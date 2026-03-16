import * as XLSX from 'xlsx';
import { aoaToSheetXlsx } from './Export2Excel';
import type { ExcelParserColumn } from './typing';

/**
 * 生成并下载 Excel 模板文件
 * @param columns 模板列定义
 * @param filename 文件名（不含后缀）
 */
export function generateTemplate(columns: ExcelParserColumn[], filename = '导入模板') {
  const header = columns.map((col) => (col.required ? `*${col.label}` : col.label));
  aoaToSheetXlsx({
    data: [],
    header,
    filename: `${filename}.xlsx`,
  });
}

/**
 * 解析 Excel 文件，返回数据数组和警告信息
 * @param file 上传的文件对象
 * @param columns 模板列定义
 */
export function parseExcelFile(
  file: File,
  columns: ExcelParserColumn[],
): Promise<{ data: Record<string, any>[]; warnings: string[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const arrayBuffer = e.target?.result;
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        // 只读第一个 sheet
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          reject(new Error('Excel 文件中没有找到工作表'));
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        const rawData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (rawData.length === 0) {
          resolve({ data: [], warnings: ['文件内容为空'] });
          return;
        }

        // 提取表头行，建立 表头索引 → field 的映射
        const headerRow = rawData[0];
        const warnings: string[] = [];
        const indexToField: Record<number, string> = {};

        headerRow.forEach((cell: any, index: number) => {
          if (cell == null) return;
          // 去除 * 前缀和首尾空格
          const headerText = String(cell).replace(/^\*/, '').trim();
          const matchedCol = columns.find((col) => col.label === headerText);
          if (matchedCol) {
            indexToField[index] = matchedCol.field;
          }
        });

        // 检查缺失的必填列
        const mappedFields = new Set(Object.values(indexToField));
        columns.forEach((col) => {
          if (col.required && !mappedFields.has(col.field)) {
            warnings.push(`缺少必填列：${col.label}`);
          }
        });

        // 跳过表头行，将数据行转换为对象数组
        const data: Record<string, any>[] = [];
        for (let i = 1; i < rawData.length; i++) {
          const row = rawData[i];
          if (!row || row.length === 0) continue;

          // 跳过完全为空的行
          const hasValue = row.some((cell: any) => cell != null && String(cell).trim() !== '');
          if (!hasValue) continue;

          const obj: Record<string, any> = {};
          Object.entries(indexToField).forEach(([indexStr, field]) => {
            const idx = Number(indexStr);
            const value = row[idx];
            obj[field] = value != null ? value : null;
          });
          data.push(obj);
        }

        resolve({ data, warnings });
      } catch (err) {
        reject(new Error('解析 Excel 文件失败：' + (err as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('读取文件失败'));
    };

    reader.readAsArrayBuffer(file);
  });
}

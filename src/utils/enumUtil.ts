import { BaseEnum } from '@/enums/baseEnum';
import { keys } from '@/utils/utils';

// 枚举缓存
const enumCache = new Map<string, BaseEnum<any, any>>();

// 使用 import.meta.glob 动态导入所有枚举文件
const modules = import.meta.glob('@/enums/biz/*.ts', { eager: true });

/**
 * 将文件名转换为枚举名
 * 例如：addressEntityType -> ADDRESS_ENTITY_TYPE
 * @param fileName 文件名（不含扩展名）
 * @returns 枚举名
 */
function fileNameToEnumName(fileName: string): string {
  return fileName
    .replace(/([A-Z])/g, '_$1') // 在大写字母前添加下划线
    .toUpperCase() // 转换为大写
    .replace(/^_/, ''); // 移除开头的下划线
}

/**
 * 初始化枚举缓存
 */
function initEnumCache(): void {
  for (const path in modules) {
    const matched = path.match(/\/enums\/biz\/(.*?)\.ts$/);
    if (matched && matched[1]) {
      const fileName = matched[1];
      const enumName = fileNameToEnumName(fileName);
      const module = modules[path] as any;

      // 查找导出的枚举对象
      const resKeys = keys(module).filter((k) => module[k] instanceof BaseEnum);
      resKeys.forEach((resKey) => {
        const resValue = module[resKey];
        // 缓存枚举对象
        enumCache.set(enumName, resValue);
      });
    }
  }
}

// 初始化枚举缓存
initEnumCache();

/**
 * 获取枚举对象
 * @param enumName 枚举名称
 * @returns 枚举对象
 */
export function getEnum(enumName: string): BaseEnum<any, any> | null {
  return enumCache.get(enumName) || null;
}

/**
 * 获取枚举描述
 * @param enumName 枚举名称
 * @param code 枚举代码
 * @returns 枚举描述
 */
export function getEnumDesc(enumName: string, code: any): string | null {
  const enumObj = getEnum(enumName);
  if (enumObj) {
    return enumObj.getDesc(code);
  }
  console.error(`未找到枚举: ${enumName}`);
  return null;
}

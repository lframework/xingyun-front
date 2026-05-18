export const normalizeAmount = (value) => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  const number = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(number) ? number : 0;
};

export const sumColumn = (rows = [], column) => {
  const total = rows.reduce((sum, row) => {
    return sum + normalizeAmount(row?.[column]);
  }, 0);

  return total.toFixed(2);
};

export const sumNumberColumn = (rows = [], column) => {
  const total = rows.reduce((sum, row) => {
    return sum + normalizeAmount(row?.[column]);
  }, 0);

  return String(Number(total.toFixed(10)));
};

export const moneyToChineseUpper = (value) => {
  const number = Math.round(normalizeAmount(value) * 100);
  if (!number) {
    return '零元整';
  }

  const digitMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const integerUnitMap = ['', '拾', '佰', '仟'];
  const sectionUnitMap = ['', '万', '亿', '兆'];
  const integerPart = Math.floor(number / 100);
  const jiao = Math.floor((number % 100) / 10);
  const fen = number % 10;

  const sectionToChinese = (section) => {
    let result = '';
    let zero = false;

    for (let unitIndex = 0; unitIndex < 4; unitIndex += 1) {
      const digit = section % 10;
      if (digit === 0) {
        if (result) {
          zero = true;
        }
      } else {
        result = digitMap[digit] + integerUnitMap[unitIndex] + (zero ? '零' : '') + result;
        zero = false;
      }
      section = Math.floor(section / 10);
    }

    return result;
  };

  const integerToChinese = (integer) => {
    if (!integer) {
      return '零';
    }

    let result = '';
    let sectionIndex = 0;
    let needZero = false;

    while (integer > 0) {
      const section = integer % 10000;
      if (section === 0) {
        needZero = true;
      } else {
        const sectionText = sectionToChinese(section);
        result =
          sectionText + sectionUnitMap[sectionIndex] + (needZero && result ? '零' : '') + result;
        needZero = section < 1000;
      }
      integer = Math.floor(integer / 10000);
      sectionIndex += 1;
    }

    return result.replace(/零+/g, '零').replace(/零$/g, '');
  };

  let result = integerToChinese(integerPart) + '元';

  if (jiao === 0 && fen === 0) {
    return result + '整';
  }

  if (jiao > 0) {
    result += digitMap[jiao] + '角';
  }
  if (fen > 0) {
    result += (jiao === 0 ? '零' : '') + digitMap[fen] + '分';
  }

  return result;
};

export const buildFooterRows = (footerRows = [], rows = []) => {
  if (!Array.isArray(footerRows)) {
    return [];
  }

  return footerRows.map((footerRow) => {
    const cells = Array.isArray(footerRow.cells) ? footerRow.cells : [];

    return cells.map((cell) => {
      const columnTotal = sumColumn(rows, cell.column);
      let text = cell.text || '';

      if (cell.type === 'sum') {
        text = columnTotal;
      } else if (cell.type === 'numberSum') {
        text = sumNumberColumn(rows, cell.column);
      } else if (cell.type === 'moneyUpper') {
        text = moneyToChineseUpper(columnTotal);
      }

      return {
        text,
        colspan: cell.colspan || 1,
        align: cell.align || 'left',
      };
    });
  });
};

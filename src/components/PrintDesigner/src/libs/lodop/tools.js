/**
 * 通过模板和模板数据生成打印内容
 * @param temp 打印模板
 * @param data 模板数据
 */
export const tempToPrint = (temp, data) => {
  let printContent = temp.map((item) => {
    var reg = /({[^{]*})/g;
    let value = item.value.replace(reg, data[item.name] || '');
    return {
      top: item.top,
      left: item.left,
      width: item.width,
      height: item.height,
      value: value,
    };
  });
  return printContent;
};

/**
 * 将字符串模板中{}内的内容替换成指定值
 * @param str 表格列配置信息
 * @param value 表格数据
 */
export const strTempToValue = (str, value) => {
  let reg = /({[^}^{]*})/g;
  return str.replace(reg, value || '');
};

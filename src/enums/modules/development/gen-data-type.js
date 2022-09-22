const GEN_DATA_TYPE = {
  STRING: {
    code: 0, desc: 'String'
  },
  INTEGER: {
    code: 1, desc: 'Integer'
  },
  SHORT: {
    code: 2, desc: 'Short'
  },
  LONG: {
    code: 3, desc: 'Long'
  },
  DOUBLE: {
    code: 4, desc: 'Double'
  },
  LOCAL_DATE: {
    code: 5, desc: 'LocalDate'
  },
  LOCAL_DATE_TIME: {
    code: 6, desc: 'LocalDateTime'
  },
  LOCAL_TIME: {
    code: 7, desc: 'LocalTime'
  },
  BOOLEAN: {
    code: 8, desc: 'Boolean'
  },
  BIG_DECIMAL: {
    code: 9, desc: 'BigDecimal'
  }
}

/**
 * 是否为数字类型
 * @param code
 * @returns {*}
 */
GEN_DATA_TYPE.isNumberType = function(code) {
  return GEN_DATA_TYPE.INTEGER.equalsCode(code) || GEN_DATA_TYPE.SHORT.equalsCode(code) || GEN_DATA_TYPE.LONG.equalsCode(code) || GEN_DATA_TYPE.DOUBLE.equalsCode(code) || GEN_DATA_TYPE.BIG_DECIMAL.equalsCode(code)
}

/**
 * 是否为小数类型
 * @param code
 * @returns {*}
 */
GEN_DATA_TYPE.isDecimalType = function(code) {
  return GEN_DATA_TYPE.DOUBLE.equalsCode(code) || GEN_DATA_TYPE.BIG_DECIMAL.equalsCode(code)
}

export default GEN_DATA_TYPE

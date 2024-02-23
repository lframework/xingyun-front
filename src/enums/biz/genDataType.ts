import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_DATA_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
GEN_DATA_TYPE.set('STRING', new BaseEnumItem<number, string>(0, 'String'));
GEN_DATA_TYPE.set('INTEGER', new BaseEnumItem<number, string>(1, 'Integer'));
GEN_DATA_TYPE.set('SHORT', new BaseEnumItem<number, string>(2, 'Short'));
GEN_DATA_TYPE.set('LONG', new BaseEnumItem<number, string>(3, 'Long'));
GEN_DATA_TYPE.set('DOUBLE', new BaseEnumItem<number, string>(4, 'Double'));
GEN_DATA_TYPE.set('LOCAL_DATE', new BaseEnumItem<number, string>(5, 'LocalDate'));
GEN_DATA_TYPE.set('LOCAL_DATE_TIME', new BaseEnumItem<number, string>(6, 'LocalDateTime'));
GEN_DATA_TYPE.set('LOCAL_TIME', new BaseEnumItem<number, string>(7, 'LocalTime'));
GEN_DATA_TYPE.set('BOOLEAN', new BaseEnumItem<number, string>(8, 'Boolean'));
GEN_DATA_TYPE.set('BIG_DECIMAL', new BaseEnumItem<number, string>(9, 'BigDecimal'));

function isNumberType(code: number): boolean | undefined {
  return <boolean | undefined>(
    (GEN_DATA_TYPE.get('INTEGER')?.equalsCode(code) ||
      GEN_DATA_TYPE.get('SHORT')?.equalsCode(code) ||
      GEN_DATA_TYPE.get('LONG')?.equalsCode(code) ||
      GEN_DATA_TYPE.get('DOUBLE')?.equalsCode(code) ||
      GEN_DATA_TYPE.get('BIG_DECIMAL')?.equalsCode(code))
  );
}

function isDecimalType(code: number): boolean | undefined {
  return <boolean | undefined>(
    (GEN_DATA_TYPE.get('DOUBLE')?.equalsCode(code) ||
      GEN_DATA_TYPE.get('BIG_DECIMAL')?.equalsCode(code))
  );
}

export { GEN_DATA_TYPE, isNumberType, isDecimalType };

import { isFunction, isNull, isEmpty, isEqualWithStr } from '@/utils/utils';

export class BaseEnum<C, D> {
  #itemKeys: string[] = [];
  #itemValues: BaseEnumItem<C, D>[] = [];

  set(key: string, value: BaseEnumItem<C, D>): void {
    this.#itemKeys.push(key);
    this.#itemValues.push(value);
  }

  keys(): string[] {
    return this.#itemKeys;
  }

  get(key: string): BaseEnumItem<C, D> | null {
    const index = this.#itemKeys.indexOf(key);
    if (index !== -1) {
      return this.#itemValues[index];
    }

    return null;
  }

  values(): BaseEnumItem<C, D>[] {
    return this.#itemValues;
  }

  /**
   * 获取枚举对象中各个枚举值数组
   * @returns eg: [{code: 1, desc:'test1'}, {code: 2, desc: 'test2'}]
   */
  getValues(): BaseEnumItem<C, D>[] {
    return this.#itemValues;
  }

  /**
   * 将枚举的code解析为desc
   * @param code
   * @returns desc
   */
  getDesc(code: C): D | null {
    if (isNull(code)) {
      return null;
    }

    const enumsKeys = this.keys();

    const enumList: BaseEnumItem<C, D>[] = [];
    enumsKeys.forEach((item) => {
      const val = this.get(item);
      if (!isEmpty(val) && !isFunction(val)) {
        enumList.push(val);
      }
    });

    for (let i = 0; i < enumList.length; i++) {
      const enumObj = enumList[i];
      if (isEqualWithStr(enumObj.code, code)) {
        return enumObj.desc;
      }
    }

    return null;
  }

  /**
   * 将枚举的code解析为对象
   * @param code
   * @returns desc
   */
  getByCode(code: C): BaseEnumItem<C, D> | null {
    if (isNull(code)) {
      return null;
    }

    const enumsKeys = this.keys();

    const enumList: BaseEnumItem<C, D>[] = [];
    enumsKeys.forEach((item) => {
      const val = this.get(item);
      if (!isEmpty(val) && !isFunction(val)) {
        enumList.push(val);
      }
    });

    for (let i = 0; i < enumList.length; i++) {
      const enumObj = enumList[i];
      if (isEqualWithStr(enumObj.code, code)) {
        return enumObj;
      }
    }

    return null;
  }
}

export class BaseEnumItem<C, D> {
  code: C;
  desc: D;

  constructor(code: C, desc: D) {
    this.code = code;
    this.desc = desc;
  }

  equalsCode(code: C): boolean {
    return isEqualWithStr(code, this.code);
  }
}

import { PageVo } from '@/api/model/pageVo';

export interface DataObjectQueryParamObj extends PageVo {
  /**
   *
   */
  conditions: Condition[];
}

export interface Condition {
  /**
   *
   */
  tableAlias: string;

  /**
   *
   */
  columnName: string;

  /**
   *
   */
  queryType: number;

  /**
   *
   */
  valuePrefix: string;

  /**
   *
   */
  value: any;

  /**
   *
   */
  values: any[];

  /**
   *
   */
  valueSuffix: string;
}

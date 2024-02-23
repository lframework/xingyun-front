import {PageVo} from "@/api/model/pageVo";

export interface QueryOpLogsVo extends PageVo {
  /**
   * 日志名称
   */
  name: string;

  /**
   * 创建人ID
   */
  createBy: string;

  /**
   * 日志类别
   */
  logType: number;

  /**
   * 创建起始时间
   */
  startTime: string;

  /**
   * 创建截止时间
   */
  endTime: string;
}

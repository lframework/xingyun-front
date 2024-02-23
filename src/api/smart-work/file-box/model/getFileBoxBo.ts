export interface GetFileBoxBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * Url
   */
  url: string;

  /**
   * 文件大小
   */
  fileSize: string;

  /**
   * 上传类型
   */
  contentType: string;

  /**
   * 备注
   */
  description: string;

  /**
   * 创建时间
   */
  createTime: string;

  /**
   * 创建人
   */
  createBy: string;
}

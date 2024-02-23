export interface A4ExcelPortraitPrintBo {
  /**
   * 打印方向及纸张类型 1---纵向打印，固定纸张； 2---横向打印，固定纸张； 3---纵向打印，宽度固定，高度按打印内容的高度自适应；0---方向不定，由操作者自行选择或按打印机缺省设置。
   */
  orient: number;

  /**
   * 纸张宽，单位为0.1mm 譬如该参数值为45，则表示4.5mm,计量精度是0.1mm。
   */
  pageWidth: number;

  /**
   * 固定纸张时该参数是纸张高；高度自适应时该参数是纸张底边的空白高，计量单位与纸张宽一样。
   */
  pageHeight: number;

  /**
   * 纸张类型名， pageWidth等于零时本参数才有效，具体名称参见操作系统打印服务属性中的格式定义。 关键字“CreateCustomPage”会在系统内建立一个名称为“LodopCustomPage”自定义纸张类型。
   */
  pageName: string;

  /**
   * 上边距 单位：mm
   */
  marginTop: number;

  /**
   * 左边距 单位：mm
   */
  marginLeft: number;

  /**
   * 右边距 单位：mm
   */
  marginRight: number;

  /**
   * 下边距 单位：mm
   */
  marginBottom: number;

  /**
   * 打印html内容
   */
  html: string;
}

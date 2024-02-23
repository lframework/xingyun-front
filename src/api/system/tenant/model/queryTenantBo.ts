export interface QueryTenantBo {
  /**
   * ID
   */
  id: string;

  /**
   * 名称
   */
  name: string;

  /**
   * JdbcUrl
   */
  jdbcUrl: string;

  /**
   * Jdbc用户名
   */
  jdbcUsername: string;

  /**
   * Jdbc密码
   */
  jdbcPassword: string;

  /**
   * 状态
   */
  available: boolean;
}

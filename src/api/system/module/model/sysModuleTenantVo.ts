export interface SysModuleTenantVo {
  /**
   * 租户ID
   */
  tenantId: number;

  /**
   * 模块
   */
  modules: SysModuleVo[];
}

export interface SysModuleVo {
  /**
   * 模块ID
   */
  moduleId: number;

  /**
   * 过期时间
   */
  expireTime: string;
}

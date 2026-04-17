# xingyun-front

`xingyun-front` 是星云 ERP 的前端仓库，基于 Vue 3、Vite、Ant Design Vue 与 `pnpm workspace + Turbo` 组织，负责系统管理、基础资料、供应链、库存、结算、报表等业务页面的实现。

## 环境要求

- Node.js 20 LTS 优先
- pnpm 8.1.0+
- 仅允许使用 `pnpm`，不要使用 `npm` 或 `yarn`

安装 pnpm 示例：

```bash
npm install -g pnpm
```

## 目录结构

- `src/`：主应用业务代码
- `apps/portal-view`：附加应用或实验性入口
- `apps/test-server`：本地测试服务
- `packages/`：共享包
- `internal/`：共享配置与基础设施封装
- `public/`：静态资源
- `types/`：全局类型声明

## 常用命令

```bash
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm type:check
```

常用扩展命令：

```bash
pnpm build:test
pnpm build:docker
pnpm build:analyze
```

## 主要技术栈

- Vue 3.3.4
- Vite 4.4.x
- Ant Design Vue 4.0.7
- Pinia 2.1.4
- Vue Router 4.0.14
- Turbo 1.10.x
- vue-vben-admin 2.10.1
- vxe-table 4.x

## 开发说明

- 页面主要位于 `src/views/`
- API 封装位于 `src/api/<domain>/<module>/`
- 状态管理位于 `src/store/modules/`
- 路由位于 `src/router/`
- 应用级配置位于 `src/settings/`
- HTTP 调用统一走 `defHttp`
- 权限控制沿用 `v-permission`

仓库当前同时存在历史结构与 workspace 结构，修改现有页面时优先遵循周边代码风格，不要为“统一风格”顺手做大范围重构。

## 与后端仓库的关系

- 后端仓库：<https://gitee.com/lframework/xingyun>
- 底层框架仓库：<https://gitee.com/lframework/jugg>

本仓库默认与 `xingyun` 后端配套使用，接口、权限和菜单体系都以对应后端能力为基础。

## 其他说明

- ElementUI 老版本代码已迁移至旧分支
- Vue 2 版本代码已迁移至历史分支维护

## License

项目使用 Apache 2.0 许可证，请遵守许可证约束。

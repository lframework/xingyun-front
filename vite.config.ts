import dayjs from 'dayjs';
import { defineApplicationConfig } from '@vben/vite-config';
import {
  createIndexBuildIdPlugin,
  createVersionManifestPlugin,
} from './src/logics/version-update/buildPlugin';

const buildId = dayjs().format('YYYYMMDDHHmmss');

export default defineApplicationConfig({
  overrides: {
    define: {
      __APP_BUILD_ID__: JSON.stringify(buildId),
    },
    plugins: [createVersionManifestPlugin(buildId), createIndexBuildIdPlugin(buildId)],
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'qrcode',
        '@iconify/iconify',
        'ant-design-vue/es/locale/zh_CN',
        'ant-design-vue/es/locale/en_US',
        `monaco-editor/esm/vs/language/json/json.worker`,
        `monaco-editor/esm/vs/language/css/css.worker`,
        `monaco-editor/esm/vs/language/html/html.worker`,
        `monaco-editor/esm/vs/language/typescript/ts.worker`,
        `monaco-editor/esm/vs/editor/editor.worker`,
      ],
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:8080',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/api`), ''),
          // only https
          // secure: false
        },
      },
    },
  },
});

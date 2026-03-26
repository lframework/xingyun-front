import type { PluginOption } from 'vite';

export const APP_BUILD_ID_PLACEHOLDER = '__APP_BUILD_ID_PLACEHOLDER__';

export function createVersionManifestPlugin(currentBuildId: string): PluginOption {
  return {
    name: 'app-version-manifest',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ buildId: currentBuildId }),
      });
    },
  };
}

export function createIndexBuildIdPlugin(currentBuildId: string): PluginOption {
  return {
    name: 'app-build-id-html',
    transformIndexHtml(html) {
      return html.replace(APP_BUILD_ID_PLACEHOLDER, currentBuildId);
    },
  };
}

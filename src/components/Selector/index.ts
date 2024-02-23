// @ts-nocheck
import { App } from 'vue';

export async function install(app: App): void {
  const modules = import.meta.glob('./src/*.vue');
  for (const path in modules) {
    const matched = path.match(/\.\/src\/(.*?)\.vue$/);
    if (matched && matched[1]) {
      const moduleName = matched[1];
      const module = modules[path];
      const res = await module();
      app.component(moduleName, res.default);
    }
  }
}

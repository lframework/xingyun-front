// @ts-nocheck
import { App } from 'vue';
import { isEmpty, isFunction, keys } from '@/utils/utils';
import { BaseEnum } from '@/enums/baseEnum';
export async function install(app: App): Promise<void> {
  const modules = import.meta.glob('./*.ts');
  const enums = {};
  for (const path in modules) {
    const matched = path.match(/\.\/(.*?)\.ts$/);
    if (matched && matched[1]) {
      const module = modules[path];
      const res = await module();
      const resKeys = keys(res).filter((k) => res[k] instanceof BaseEnum);
      const functionKeys = keys(res).filter((k) => isFunction(res[k]));
      resKeys.forEach((resKey) => {
        const resValue = res[resKey];

        const enumsKeys = resValue.keys();

        enumsKeys.forEach((item) => {
          const val = resValue.get(item);
          if (!isEmpty(val) && !isFunction(val)) {
            resValue[item] = val;
          }
        });
        functionKeys.forEach((functionKey) => {
          resValue[functionKey] = res[functionKey];
        });
        enums[resKey] = resValue;
      });
    }
  }

  app.config.globalProperties.$enums = enums;
}

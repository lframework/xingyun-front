import { usePermissionStore } from '/@/store/modules/permission';
import { intersection } from 'lodash-es';
import { isArray } from '/@/utils/is';

// User permissions related operations
export function usePermission() {
  const permissionStore = usePermissionStore();

  /**
   * Determine whether there is permission
   */
  function hasPermission(value?: string | string[], def = true): boolean {
    // Visible by default
    if (!value) {
      return def;
    }

    const allCodeList = permissionStore.getPermCodeList as string[];
    if (allCodeList?.includes('admin')) {
      return true;
    }
    if (!isArray(value)) {
      const splits = ['||', '&&'];
      const splitName = splits.find((item) => value.includes(item));
      if (splitName) {
        const splitCodes = value.split(splitName);
        return splitName === splits[0]
          ? intersection(splitCodes, allCodeList).length > 0
          : intersection(splitCodes, allCodeList).length === splitCodes.length;
      }
      return allCodeList?.includes(value);
    }
    return (intersection(value, allCodeList) as string[]).length > 0;
  }

  return { hasPermission };
}

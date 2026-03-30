function normalizeMenus(menus) {
  if (!Array.isArray(menus) || menus.length === 0) {
    return [];
  }

  return menus.map((item) => {
    const meta = item && item.meta ? item.meta : {};
    const id = meta.id || item.id;
    const title = meta.title || item.name || item.path || '';

    return {
      id,
      title,
      children: normalizeMenus(item.children),
    };
  });
}

function normalizeSaveNodes(nodes) {
  if (!Array.isArray(nodes) || nodes.length === 0) {
    return [];
  }

  return nodes.map((item) => ({
    id: item.id,
    children: normalizeSaveNodes(item.children),
  }));
}

export function toMenuSortTree(menus) {
  return normalizeMenus(menus);
}

export function toSaveUserMenuSortVo(tree) {
  return {
    menus: normalizeSaveNodes(tree),
  };
}

export function getMenuSortGroupName(parentId) {
  return `menu-sort-group-${parentId || 'root'}`;
}

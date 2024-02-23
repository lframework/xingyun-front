import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const GEN_CUSTOM_LIST_BTN_VIEW_TYPE: BaseEnum<string, string> = new BaseEnum<string, string>();
GEN_CUSTOM_LIST_BTN_VIEW_TYPE.set(
  'PRIMARY',
  new BaseEnumItem<string, string>('primary', 'primary'),
);
GEN_CUSTOM_LIST_BTN_VIEW_TYPE.set(
  'DEFAULT',
  new BaseEnumItem<string, string>('default', 'default'),
);
GEN_CUSTOM_LIST_BTN_VIEW_TYPE.set('DASHED', new BaseEnumItem<string, string>('dashed', 'dashed'));
GEN_CUSTOM_LIST_BTN_VIEW_TYPE.set('DANGER', new BaseEnumItem<string, string>('danger', 'danger'));
GEN_CUSTOM_LIST_BTN_VIEW_TYPE.set('LINK', new BaseEnumItem<string, string>('link', 'link'));
GEN_CUSTOM_LIST_BTN_VIEW_TYPE.set(
  'LINK_DANGER',
  new BaseEnumItem<string, string>('link-danger', 'link-danger'),
);

export { GEN_CUSTOM_LIST_BTN_VIEW_TYPE };

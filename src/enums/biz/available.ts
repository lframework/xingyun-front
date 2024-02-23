import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const AVAILABLE: BaseEnum<boolean, string> = new BaseEnum<boolean, string>();
AVAILABLE.set('ENABLE', new BaseEnumItem<boolean, string>(true, '启用'));
AVAILABLE.set('UNABLE', new BaseEnumItem<boolean, string>(false, '停用'));

export { AVAILABLE };

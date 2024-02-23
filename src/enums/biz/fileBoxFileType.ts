import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const FILE_BOX_FILE_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
FILE_BOX_FILE_TYPE.set('DIR', new BaseEnumItem<number, string>(0, '目录'));
FILE_BOX_FILE_TYPE.set('FILE', new BaseEnumItem<number, string>(1, '文件'));

export { FILE_BOX_FILE_TYPE };

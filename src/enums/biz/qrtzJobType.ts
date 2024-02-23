import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const QRTZ_JOB_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
QRTZ_JOB_TYPE.set('EXCUTE_CLASS', new BaseEnumItem<number, string>(1, '指定类'));
QRTZ_JOB_TYPE.set('GROOVY', new BaseEnumItem<number, string>(2, 'Groovy脚本'));

export { QRTZ_JOB_TYPE };

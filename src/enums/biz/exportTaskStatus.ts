import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const EXPORT_TASK_STATUS: BaseEnum<number, string> = new BaseEnum<number, string>();
EXPORT_TASK_STATUS.set('CREATED', new BaseEnumItem<number, string>(0, '等待导出'));
EXPORT_TASK_STATUS.set('EXPORTING', new BaseEnumItem<number, string>(1, '正在导出'));
EXPORT_TASK_STATUS.set('SUCCESS', new BaseEnumItem<number, string>(2, '导出成功'));
EXPORT_TASK_STATUS.set('FAIL', new BaseEnumItem<number, string>(3, '导出失败'));

export { EXPORT_TASK_STATUS };

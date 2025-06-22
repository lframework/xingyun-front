import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const FLOW_INSTANCE_STATUS: BaseEnum<string, string> = new BaseEnum<string, string>();
FLOW_INSTANCE_STATUS.set('CREATE', new BaseEnumItem<string, string>('0', '待提交'));
FLOW_INSTANCE_STATUS.set('APPROVING', new BaseEnumItem<string, string>('1', '审核中'));
FLOW_INSTANCE_STATUS.set('APPROVE_PASS', new BaseEnumItem<string, string>('2', '审核通过'));
FLOW_INSTANCE_STATUS.set('TERMINATION', new BaseEnumItem<string, string>('4', '已终止'));
FLOW_INSTANCE_STATUS.set('CANCEL', new BaseEnumItem<string, string>('5', '已作废'));
FLOW_INSTANCE_STATUS.set('UNDO', new BaseEnumItem<string, string>('6', '已撤回'));
FLOW_INSTANCE_STATUS.set('FINISH', new BaseEnumItem<string, string>('8', '已完成'));
FLOW_INSTANCE_STATUS.set('REFUSE', new BaseEnumItem<string, string>('9', '已退回'));
FLOW_INSTANCE_STATUS.set('INVALID', new BaseEnumItem<string, string>('10', '已失效'));
FLOW_INSTANCE_STATUS.set('REVOKE', new BaseEnumItem<string, string>('11', '已驳回'));

export { FLOW_INSTANCE_STATUS };

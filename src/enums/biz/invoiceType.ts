import { BaseEnum, BaseEnumItem } from '@/enums/baseEnum';

const INVOICE_TYPE: BaseEnum<number, string> = new BaseEnum<number, string>();
INVOICE_TYPE.set('NORMAL', new BaseEnumItem<number, string>(1, '增值税普通发票'));
INVOICE_TYPE.set('SPECIAL', new BaseEnumItem<number, string>(2, '增值税专用发票'));
INVOICE_TYPE.set(
  'NORMAL_OR_SPECIAL',
  new BaseEnumItem<number, string>(3, '增值税专用发票或增值税普通发票'),
);

export { INVOICE_TYPE };

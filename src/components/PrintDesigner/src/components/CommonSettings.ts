import { LodopStyle } from '@/components/PrintDesigner/src/constants/LodopStyle';

export interface CommonSettings {
  type: string;

  isEdit: boolean;

  draggable: boolean;

  resizable: boolean;

  width: number;
  height: number;
  left: number;
  top: number;
  title: string;
  name: string;

  style: LodopStyle;
}

import { UploadFile } from 'ant-design-vue/lib/upload/interface';

export function getDoneImageUrls(fileList: UploadFile[]): string[];

export function buildImageFileList(
  value: string[] | string | undefined,
  multiple: boolean,
  buildId: () => string,
): UploadFile[];

export function moveImageFile(
  fileList: UploadFile[],
  oldIndex: number,
  newIndex: number,
): UploadFile[];

export function replaceImageFileByUid(fileList: UploadFile[], file: UploadFile): UploadFile[];

export function removeImageFileByUid(fileList: UploadFile[], file: UploadFile): UploadFile[];

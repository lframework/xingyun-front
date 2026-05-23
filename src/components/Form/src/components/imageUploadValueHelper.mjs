export function getDoneImageUrls(fileList) {
  return (fileList || [])
    .filter((item) => item?.url && item.status === 'done')
    .map((item) => item.url);
}

export function buildImageFileList(value, multiple, buildId) {
  let urls = [];
  if (multiple) {
    if (Array.isArray(value)) {
      urls = value;
    } else if (value) {
      urls = [value];
    }
  } else if (value) {
    urls = [value];
  }

  return urls.map((url) => {
    const uuid = buildId();
    return {
      uid: uuid,
      name: uuid,
      status: 'done',
      url,
    };
  });
}

export function moveImageFile(fileList, oldIndex, newIndex) {
  const newFileList = [...(fileList || [])];
  if (
    oldIndex === newIndex ||
    oldIndex < 0 ||
    newIndex < 0 ||
    oldIndex >= newFileList.length ||
    newIndex >= newFileList.length
  ) {
    return newFileList;
  }

  const [target] = newFileList.splice(oldIndex, 1);
  newFileList.splice(newIndex, 0, target);

  return newFileList;
}

export function replaceImageFileByUid(fileList, file) {
  const newFileList = [...(fileList || [])];
  const index = newFileList.findIndex((item) => item?.uid === file?.uid);
  if (index === -1) {
    newFileList.push(file);
    return newFileList;
  }

  newFileList.splice(index, 1, file);
  return newFileList;
}

export function removeImageFileByUid(fileList, file) {
  return [...(fileList || [])].filter((item) => item?.uid !== file?.uid);
}

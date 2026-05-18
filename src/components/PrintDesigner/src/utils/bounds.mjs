export function limitValue(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function limitElementPosition(element, page) {
  const maxLeft = Math.max((page.width || 0) - (element.width || 0), 0);
  const maxTop = Math.max((page.height || 0) - (element.height || 0), 0);

  return {
    left: limitValue(element.left || 0, 0, maxLeft),
    top: limitValue(element.top || 0, 0, maxTop),
  };
}

export function limitElementSize(element, page) {
  const maxWidth = Math.max((page.width || 0) - (element.left || 0), 10);
  const maxHeight = Math.max((page.height || 0) - (element.top || 0), 10);

  return {
    width: limitValue(element.width || 10, 10, maxWidth),
    height: limitValue(element.height || 10, 10, maxHeight),
  };
}

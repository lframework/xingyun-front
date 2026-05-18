export const mm2px = (mm) => {
  return (mm * 96) / 25.4;
};

export const px2mm = (px) => {
  return (px * 25.4) / 96;
};

export const px2pt = (px) => {
  return (px * 72) / 96;
};

export const pt2px = (pt) => {
  return (pt * 96) / 72;
};

export const createPagePxSize = (page = {}) => {
  const paperWidth = page.pageDirection === 2 ? page.pageHeight : page.pageWidth;
  const paperHeight = page.pageDirection === 2 ? page.pageWidth : page.pageHeight;

  return {
    width: parseInt(mm2px(paperWidth || 0)),
    height: parseInt(mm2px(paperHeight || 0)),
  };
};

export const createPx2mmByPage = (page = {}) => {
  const paperWidth = page.pageDirection === 2 ? page.pageHeight : page.pageWidth;
  const paperHeight = page.pageDirection === 2 ? page.pageWidth : page.pageHeight;
  const hasHorizontalRatio = page.width && paperWidth;
  const hasVerticalRatio = page.height && paperHeight;
  const horizontalRatio = hasHorizontalRatio ? paperWidth / page.width : null;
  const verticalRatio = hasVerticalRatio ? paperHeight / page.height : null;
  const toHorizontalMm = (px) => (horizontalRatio ? px * horizontalRatio : px2mm(px));
  const toVerticalMm = (px) => (verticalRatio ? px * verticalRatio : px2mm(px));

  return {
    x: toHorizontalMm,
    y: toVerticalMm,
    width: toHorizontalMm,
    height: toVerticalMm,
  };
};

const DEFAULT_THRESHOLD = 5;

function getElementPoints(element) {
  const left = element.left || 0;
  const top = element.top || 0;
  const width = element.width || 0;
  const height = element.height || 0;

  return {
    vertical: [
      { key: 'left', position: left, offset: 0, source: 'element' },
      { key: 'center', position: left + width / 2, offset: width / 2, source: 'element' },
      { key: 'right', position: left + width, offset: width, source: 'element' },
    ],
    horizontal: [
      { key: 'top', position: top, offset: 0, source: 'element' },
      { key: 'middle', position: top + height / 2, offset: height / 2, source: 'element' },
      { key: 'bottom', position: top + height, offset: height, source: 'element' },
    ],
  };
}

function getPagePoints(page = {}) {
  const width = page.width || 0;
  const height = page.height || 0;

  return {
    vertical: [
      { key: 'page-left', position: 0, offset: 0, source: 'page' },
      { key: 'page-center', position: width / 2, offset: 0, source: 'page' },
      { key: 'page-right', position: width, offset: 0, source: 'page' },
    ],
    horizontal: [
      { key: 'page-top', position: 0, offset: 0, source: 'page' },
      { key: 'page-middle', position: height / 2, offset: 0, source: 'page' },
      { key: 'page-bottom', position: height, offset: 0, source: 'page' },
    ],
  };
}

function findClosestSnap(movingPoints, targetPoints, threshold) {
  let closest = null;

  movingPoints.forEach((movingPoint) => {
    targetPoints.forEach((targetPoint) => {
      const distance = Math.abs(movingPoint.position - targetPoint.position);

      if (distance <= threshold && (!closest || distance < closest.distance)) {
        closest = {
          distance,
          offset: targetPoint.position - movingPoint.offset,
          position: targetPoint.position,
          source: targetPoint.source,
        };
      }
    });
  });

  return closest;
}

function getTargetPoints(items, movingElement, page) {
  const targetPoints = items
    .filter((item) => item.uuid !== movingElement.uuid)
    .map((item) => getElementPoints(item));
  const pagePoints = page ? getPagePoints(page) : { vertical: [], horizontal: [] };

  return {
    vertical: [...targetPoints.flatMap((points) => points.vertical), ...pagePoints.vertical],
    horizontal: [...targetPoints.flatMap((points) => points.horizontal), ...pagePoints.horizontal],
  };
}

export function getSnapPosition(movingElement, items, options = {}) {
  const threshold = typeof options === 'number' ? options : options.threshold || DEFAULT_THRESHOLD;
  const page = typeof options === 'number' ? null : options.page;
  const movingPoints = getElementPoints(movingElement);
  const targetPoints = getTargetPoints(items, movingElement, page);
  const verticalSnap = findClosestSnap(movingPoints.vertical, targetPoints.vertical, threshold);
  const horizontalSnap = findClosestSnap(
    movingPoints.horizontal,
    targetPoints.horizontal,
    threshold,
  );
  const guides = [];

  if (verticalSnap) {
    guides.push({ type: 'vertical', position: verticalSnap.position, source: verticalSnap.source });
  }

  if (horizontalSnap) {
    guides.push({
      type: 'horizontal',
      position: horizontalSnap.position,
      source: horizontalSnap.source,
    });
  }

  return {
    left: verticalSnap ? verticalSnap.offset : movingElement.left,
    top: horizontalSnap ? horizontalSnap.offset : movingElement.top,
    guides,
  };
}

export function getResizeSnapSize(resizingElement, items, resizeType, options = {}) {
  const threshold = typeof options === 'number' ? options : options.threshold || DEFAULT_THRESHOLD;
  const page = typeof options === 'number' ? null : options.page;
  const targetPoints = getTargetPoints(items, resizingElement, page);
  const guides = [];
  const result = {
    left: resizingElement.left,
    top: resizingElement.top,
    width: resizingElement.width,
    height: resizingElement.height,
  };

  if (resizeType === 'right') {
    const snap = findClosestSnap(
      [
        {
          position: resizingElement.left + resizingElement.width,
          offset: resizingElement.left,
        },
      ],
      targetPoints.vertical,
      threshold,
    );

    if (snap) {
      result.width = snap.position - resizingElement.left;
      guides.push({ type: 'vertical', position: snap.position, source: snap.source });
    }
  }

  if (resizeType === 'left') {
    const right = resizingElement.left + resizingElement.width;
    const snap = findClosestSnap(
      [{ position: resizingElement.left, offset: 0 }],
      targetPoints.vertical,
      threshold,
    );

    if (snap) {
      result.left = snap.position;
      result.width = right - snap.position;
      guides.push({ type: 'vertical', position: snap.position, source: snap.source });
    }
  }

  if (resizeType === 'down') {
    const snap = findClosestSnap(
      [
        {
          position: resizingElement.top + resizingElement.height,
          offset: resizingElement.top,
        },
      ],
      targetPoints.horizontal,
      threshold,
    );

    if (snap) {
      result.height = snap.position - resizingElement.top;
      guides.push({ type: 'horizontal', position: snap.position, source: snap.source });
    }
  }

  if (resizeType === 'up') {
    const bottom = resizingElement.top + resizingElement.height;
    const snap = findClosestSnap(
      [{ position: resizingElement.top, offset: 0 }],
      targetPoints.horizontal,
      threshold,
    );

    if (snap) {
      result.top = snap.position;
      result.height = bottom - snap.position;
      guides.push({ type: 'horizontal', position: snap.position, source: snap.source });
    }
  }

  result.guides = guides;
  return result;
}

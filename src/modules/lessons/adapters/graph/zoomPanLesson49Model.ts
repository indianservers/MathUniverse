export type ZoomViewport = {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
};
export type GraphBounds = {
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
};

export const ZOOM_PAN_OVERVIEW: GraphBounds = {
  xMin: -6,
  xMax: 6,
  yMin: -3,
  yMax: 3,
};
export const DEFAULT_ZOOM_VIEWPORT: ZoomViewport = {
  centerX: 0,
  centerY: 0,
  width: 4,
  height: 2,
};
export const zoomPanValue = (x: number) => 0.25 * x ** 3 - x;

export function viewportBounds(viewport: ZoomViewport): GraphBounds {
  return {
    xMin: viewport.centerX - viewport.width / 2,
    xMax: viewport.centerX + viewport.width / 2,
    yMin: viewport.centerY - viewport.height / 2,
    yMax: viewport.centerY + viewport.height / 2,
  };
}

export function constrainViewport(viewport: ZoomViewport): ZoomViewport {
  const width = Math.max(0.75, Math.min(12, viewport.width));
  const height = Math.max(0.5, Math.min(6, viewport.height));
  return {
    width,
    height,
    centerX: Math.max(
      ZOOM_PAN_OVERVIEW.xMin + width / 2,
      Math.min(ZOOM_PAN_OVERVIEW.xMax - width / 2, viewport.centerX),
    ),
    centerY: Math.max(
      ZOOM_PAN_OVERVIEW.yMin + height / 2,
      Math.min(ZOOM_PAN_OVERVIEW.yMax - height / 2, viewport.centerY),
    ),
  };
}

export const zoomViewport = (viewport: ZoomViewport, direction: "in" | "out") =>
  constrainViewport({
    ...viewport,
    width: viewport.width * (direction === "in" ? 0.75 : 4 / 3),
    height: viewport.height * (direction === "in" ? 0.75 : 4 / 3),
  });
export const panViewport = (viewport: ZoomViewport, dx: number, dy: number) =>
  constrainViewport({
    ...viewport,
    centerX: viewport.centerX + dx,
    centerY: viewport.centerY + dy,
  });

export function graphPosition(
  x: number,
  y: number,
  bounds: GraphBounds,
  width: number,
  height: number,
) {
  return {
    x: ((x - bounds.xMin) / (bounds.xMax - bounds.xMin)) * width,
    y: ((bounds.yMax - y) / (bounds.yMax - bounds.yMin)) * height,
  };
}

export function zoomPanCurvePath(
  bounds: GraphBounds,
  width: number,
  height: number,
) {
  return Array.from({ length: 401 }, (_, index) => {
    const x = bounds.xMin + ((bounds.xMax - bounds.xMin) * index) / 400;
    const point = graphPosition(x, zoomPanValue(x), bounds, width, height);
    return `${point.x},${point.y}`;
  }).join(" ");
}

export function viewportRectangle(
  viewport: ZoomViewport,
  width: number,
  height: number,
) {
  const bounds = viewportBounds(viewport);
  const topLeft = graphPosition(
    bounds.xMin,
    bounds.yMax,
    ZOOM_PAN_OVERVIEW,
    width,
    height,
  );
  const bottomRight = graphPosition(
    bounds.xMax,
    bounds.yMin,
    ZOOM_PAN_OVERVIEW,
    width,
    height,
  );
  return {
    x: topLeft.x,
    y: topLeft.y,
    width: bottomRight.x - topLeft.x,
    height: bottomRight.y - topLeft.y,
  };
}

export function viewportCenterFromPixels(
  pixelX: number,
  pixelY: number,
  width: number,
  height: number,
) {
  return {
    centerX: ZOOM_PAN_OVERVIEW.xMin + (pixelX / width) * 12,
    centerY: ZOOM_PAN_OVERVIEW.yMax - (pixelY / height) * 6,
  };
}

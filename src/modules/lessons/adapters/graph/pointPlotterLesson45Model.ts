export type PlotPoint = { id: string; x: number; y: number; color: string };

export const POINT_PLOTTER_COLORS = [
  "#079db5",
  "#7542c8",
  "#ea6500",
  "#347ed2",
  "#00a58e",
  "#ef3357",
] as const;
export const DEFAULT_PLOT_POINTS: PlotPoint[] = [
  { id: "A", x: -2, y: 1, color: POINT_PLOTTER_COLORS[0] },
  { id: "B", x: -1, y: 3, color: POINT_PLOTTER_COLORS[1] },
  { id: "C", x: 1, y: 2, color: POINT_PLOTTER_COLORS[2] },
  { id: "D", x: 3, y: 5, color: POINT_PLOTTER_COLORS[3] },
  { id: "E", x: 4, y: 0, color: POINT_PLOTTER_COLORS[4] },
];

export const clampPlotCoordinate = (value: number, snap: boolean) => {
  const bounded = Math.max(-5, Math.min(5, Number.isFinite(value) ? value : 0));
  return snap ? Math.round(bounded) : Math.round(bounded * 2) / 2;
};

export const pointPlotPosition = (point: Pick<PlotPoint, "x" | "y">) => ({
  x: 330 + point.x * 56,
  y: 310 - point.y * 56,
});
export const pointFromPlotPixels = (
  pixelX: number,
  pixelY: number,
  snap: boolean,
) => ({
  x: clampPlotCoordinate((pixelX - 330) / 56, snap),
  y: clampPlotCoordinate((310 - pixelY) / 56, snap),
});
export const connectedPointPath = (points: PlotPoint[]) =>
  points
    .map((point) => {
      const position = pointPlotPosition(point);
      return `${position.x},${position.y}`;
    })
    .join(" ");

export function reorderPlotPoints(
  points: PlotPoint[],
  sourceId: string,
  targetId: string,
) {
  const source = points.findIndex((point) => point.id === sourceId);
  const target = points.findIndex((point) => point.id === targetId);
  if (source < 0 || target < 0 || source === target) return points;
  const next = [...points];
  const [moved] = next.splice(source, 1);
  next.splice(target, 0, moved);
  return next;
}

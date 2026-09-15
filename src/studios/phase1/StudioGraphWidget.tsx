import { useEffect, useMemo, useState } from "react";
import FunctionGraphCanvas, { type FunctionGraphView } from "../../components/math-lab/FunctionGraphCanvas";
import { sampleFunction } from "../../utils/mathEngine/graphSampler";

const COLORS = ["#06b6d4", "#8b5cf6", "#f59e0b", "#10b981"];
const DEFAULT_VIEW: FunctionGraphView = { xMin: -2 * Math.PI, xMax: 2 * Math.PI, yMin: -2, yMax: 2 };

type Props = {
  expressions: string[];
  labels?: string[];
  traceX?: number;
  onTraceChange?: (x: number) => void;
  view?: FunctionGraphView;
  compact?: boolean;
};

export default function StudioGraphWidget({ expressions, labels, traceX, onTraceChange, view, compact = true }: Props) {
  const preset = view ?? DEFAULT_VIEW;
  const [box, setView] = useState<FunctionGraphView>(preset);
  const [x, setTrace] = useState(traceX ?? 0);
  useEffect(() => {
    setView(preset);
  }, [preset.xMax, preset.xMin, preset.yMax, preset.yMin]);
  useEffect(() => {
    if (typeof traceX === "number") setTrace(traceX);
  }, [traceX]);
  const series = useMemo(() => expressions.map((input, i) => {
    const sample = sampleFunction(input, box.xMin, box.xMax, 180);
    return {
      id: `s${i}`,
      label: labels?.[i] ?? input,
      color: COLORS[i % COLORS.length] ?? "#06b6d4",
      points: sample.points,
      visible: true,
      style: "line" as const,
    };
  }), [box.xMax, box.xMin, expressions, labels]);
  return (
    <div className={`studio-graph-widget${compact ? " is-compact" : ""}`} data-studio-graph="1">
      <FunctionGraphCanvas
        series={series}
        view={box}
        showGrid
        showAxes
        traceX={x}
        onResetView={() => setView(preset)}
        onTraceChange={(next) => {
          setTrace(next);
          onTraceChange?.(next);
        }}
        onViewChange={setView}
      />
    </div>
  );
}

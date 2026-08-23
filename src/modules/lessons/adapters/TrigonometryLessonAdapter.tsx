import { useEffect, useMemo, useState, type PointerEvent } from "react";
import SliderControl from "../../../components/ui/SliderControl";
import { samplePlotLayer, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import { computeTrigFormulaValues, formatTrigNumber } from "../../../trigonometry/utils/trigFormulaUtils";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const viewport: GraphViewport = { xMin: -Math.PI * 2, xMax: Math.PI * 2, yMin: -2, yMax: 2, width: 640, height: 190 };

export default function TrigonometryLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const initial = [30, 45, 60][lesson.id % 3];
  const [angle, setAngle] = useState(initial);
  useEffect(() => setAngle(initial), [initial, resetToken]);

  const values = computeTrigFormulaValues(angle);
  const radians = values.radians;
  const px = 160 + values.cos * 112;
  const py = 150 - values.sin * 112;
  const family = /cos/i.test(lesson.title) ? "cos" : /tan/i.test(lesson.title) ? "tan" : "sin";
  const plot = useMemo<PlotItem>(() => ({ id: `trig-${lesson.id}`, expression: `${family}(x)`, color: "#06b6d4", kind: "function", visible: true }), [family, lesson.id]);
  const layer = useMemo(() => samplePlotLayer(plot, viewport, 1, 0), [plot]);
  const graphX = ((radians - viewport.xMin) / (viewport.xMax - viewport.xMin)) * 640;
  const graphValue = family === "cos" ? values.cos : family === "tan" ? values.tan ?? 0 : values.sin;
  const graphY = viewport.height - ((graphValue - viewport.yMin) / (viewport.yMax - viewport.yMin)) * viewport.height;
  const guidance = trigGuidanceFor(lesson.title);
  const updateAngle = (value: number) => {
    setAngle(Math.max(-360, Math.min(360, Math.round(value))));
    onInteraction();
  };
  const updateFromCircle = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    if (event.type === "pointerdown") event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 320;
    const y = ((event.clientY - rect.top) / rect.height) * 300;
    const degrees = Math.atan2(150 - y, x - 160) * 180 / Math.PI;
    updateAngle(degrees);
  };
  const updateFromGraph = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    if (event.type === "pointerdown") event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 640;
    const radiansAtPointer = viewport.xMin + (x / 640) * (viewport.xMax - viewport.xMin);
    updateAngle((radiansAtPointer * 180) / Math.PI);
  };

  return (
    <AdapterFrame title={`${lesson.title} - linked angle`} value={`${angle} degrees - ${values.radiansLabel}`} footer="Drag directly on the unit-circle point or graph marker; the side control is only for precise adjustment.">
      <div className="grid gap-3 xl:grid-cols-[340px_minmax(0,1fr)_250px]">
        <div className="lesson-direct-surface rounded-xl bg-slate-50 dark:bg-slate-900" data-direct-interaction="true">
          <span className="lesson-direct-cue">Drag the point</span>
          <svg viewBox="0 0 320 300" className="h-[300px] w-full" role="img" aria-label={`Unit circle at ${angle} degrees`} onPointerDown={updateFromCircle} onPointerMove={updateFromCircle}>
            <circle cx="160" cy="150" r="112" fill="none" stroke="#94a3b8" strokeWidth="2" />
            <line x1="30" x2="290" y1="150" y2="150" stroke="#94a3b8" />
            <line x1="160" x2="160" y1="20" y2="280" stroke="#94a3b8" />
            <line x1="160" y1="150" x2={px} y2={py} stroke="#06b6d4" strokeWidth="4" />
            <line x1={px} y1={py} x2={px} y2="150" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 4" />
            <circle cx={px} cy={py} r="8" fill="#06b6d4" />
            <text x={px + 8} y={py - 8} fontWeight="800" fill="#334155">(cos theta, sin theta)</text>
          </svg>
        </div>
        <div className="lesson-direct-surface overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900" data-direct-interaction="true">
          <span className="lesson-direct-cue">Drag graph marker</span>
          <svg viewBox="0 0 640 190" className="h-[220px] w-full" role="img" aria-label={`${family} graph linked to angle`} onPointerDown={updateFromGraph} onPointerMove={updateFromGraph}>
            <line x1="0" x2="640" y1="95" y2="95" stroke="#64748b" />
            {layer.paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#06b6d4" strokeWidth="4" />)}
            <line x1={graphX} x2={graphX} y1="0" y2="190" stroke="#f59e0b" strokeDasharray="6 4" />
            <circle cx={graphX} cy={graphY} r="7" fill="#f59e0b" />
          </svg>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
          <SliderControl density="compact" label="Angle theta" value={angle} min={-360} max={360} step={1} unit="degrees" onChange={updateAngle} />
          <div className="grid grid-cols-2 gap-2">
            <Metric label="sin theta" value={formatTrigNumber(values.sin)} />
            <Metric label="cos theta" value={formatTrigNumber(values.cos)} />
            <Metric label="tan theta" value={values.tan === null ? "undefined" : formatTrigNumber(values.tan)} />
            <Metric label="sin^2+cos^2" value={formatTrigNumber(values.identitySum)} />
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

function trigGuidanceFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("angle measurement")) return ["Angle measurement", "A full turn is 360 degrees or 2 pi radians.", "Do not mix degrees and radians."];
  if (name.includes("unit circle")) return ["Unit circle", "Coordinates are (cos theta, sin theta).", "Cosine is x and sine is y."];
  if (name.includes("right-triangle")) return ["Right-triangle ratios", "Label opposite, adjacent, and hypotenuse from the chosen angle.", "The chosen angle controls the labels."];
  if (name.includes("exact trig")) return ["Exact trig values", "Keep special values as fractions or surds.", "Avoid early decimal rounding."];
  if (name.includes("cosine graph")) return ["Cosine graph", "Cosine starts at 1 when the angle is 0.", "It tracks the unit-circle x-coordinate."];
  if (name.includes("sine graph")) return ["Sine graph", "Sine repeats every 2 pi radians.", "It tracks the unit-circle y-coordinate."];
  if (name.includes("tangent graph")) return ["Tangent graph", "Tangent is sine divided by cosine.", "It is undefined when cosine is 0."];
  if (name.includes("reciprocal")) return ["Reciprocal trig", "Take reciprocals only of non-zero trig values.", "Zero denominators are undefined."];
  if (name.includes("inverse trig")) return ["Inverse trig", "Inverse trig returns a principal angle.", "Equations may need more angles."];
  if (name.includes("identities")) return ["Trig identities", "An identity is true for every allowed angle.", "One checked angle is not enough."];
  if (name.includes("compound-angle")) return ["Compound-angle formulae", "sin(A+B) is not sin A plus sin B.", "Use the full addition formula."];
  if (name.includes("double-") || name.includes("half-angle")) return ["Double and half angle", "sin 2A equals 2 sin A cos A.", "Do not just double the sine value."];
  if (name.includes("trig equations")) return ["Trig equations", "Use reference angles and quadrants.", "List all solutions in the interval."];
  if (name.includes("cosine rule")) return ["Cosine rule", "Use it for non-right triangles with sides and included angle.", "It extends Pythagoras."];
  if (name.includes("sine rule")) return ["Sine rule", "Pair each side with its opposite angle.", "Check side-angle matching."];
  if (name.includes("triangle area")) return ["Triangle area formula", "Use one half ab sin C with the included angle.", "The angle must be between the two sides."];
  if (name.includes("bearings")) return ["Bearings", "Measure clockwise from north.", "Write bearings with three digits."];
  if (name.includes("elevation") || name.includes("depression")) return ["Elevation and depression", "Measure from the horizontal line.", "Elevation goes up; depression goes down."];
  if (name.includes("harmonic")) return ["Harmonic motion", "Amplitude is distance from midline to peak.", "Peak-to-trough is twice the amplitude."];
  if (name.includes("polar trigonometry")) return ["Polar trigonometry", "Polar coordinates use distance r and direction theta.", "r is not the x-coordinate."];
  return ["Trig rule", "Link the angle, unit circle, and graph.", "Check angle units before calculating."];
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">{label}</span><strong className="font-mono text-sm">{value}</strong></div>;
}

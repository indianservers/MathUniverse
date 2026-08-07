import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { samplePlotLayer, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const viewport: GraphViewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10, width: 640, height: 360 };

export default function AlgebraLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const initialA = lesson.id % 4 + 1;
  const initialB = lesson.id % 7 - 3;
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [animated, setAnimated] = useState(false);
  const guidance = algebraGuidanceFor(lesson.id);
  const plot = useMemo<PlotItem>(() => ({ id: `lesson-${lesson.id}`, expression: "a*x+b", color: "#06b6d4", kind: "function", visible: true }), [lesson.id]);
  const layer = useMemo(() => samplePlotLayer(plot, viewport, a, b), [a, b, plot]);

  useEffect(() => { setA(initialA); setB(initialB); setAnimated(false); }, [initialA, initialB, resetToken]);
  useEffect(() => {
    if (!animated) return;
    const timer = window.setInterval(() => setB((value) => value >= 5 ? -5 : Number((value + 0.25).toFixed(2))), 180);
    return () => window.clearInterval(timer);
  }, [animated]);

  const changeA = (value: number) => { setA(value); onInteraction(); };
  const changeB = (value: number) => { setB(value); onInteraction(); };
  return (
    <AdapterFrame title={`${lesson.title} linked algebra view`} value={`y=${a}x${b >= 0 ? "+" : ""}${b}`} footer="The curve is sampled by the existing graph engine; both parameters update the linked equation and table.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
          <svg viewBox="0 0 640 360" className="h-[300px] w-full" role="img" aria-label={`Graph of y equals ${a} x plus ${b}`}>
            <GraphGrid />
            {layer.paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />)}
            <circle cx="320" cy={180 - b * 18} r="6" fill="#f59e0b" />
          </svg>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
          <SliderGroup title="Linked variables">
            <SliderControl density="compact" label="a" value={a} min={-5} max={5} step={0.25} onChange={changeA} />
            <SliderControl density="compact" label="b" value={b} min={-5} max={5} step={0.25} onChange={changeB} />
          </SliderGroup>
          <button type="button" className="action-secondary w-full justify-center" onClick={() => { setAnimated((value) => !value); onInteraction(); }}>{animated ? "Pause animation" : "Animate b"}</button>
          <div className="grid grid-cols-3 gap-2 text-center">
            {[-2, 0, 2].map((x) => <div key={x} className="rounded-xl bg-slate-100 p-2 dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">x={x}</span><strong className="font-mono">{Number((a * x + b).toFixed(2))}</strong></div>)}
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

function algebraGuidanceFor(lessonId: number) {
  const guidance: Record<number, [string, string, string]> = {
    19: ["Workspace rule", "Every algebra step should preserve equivalence.", "Substitute a test value to check a step."],
    20: ["Variable rule", "A variable value updates every expression using it.", "Replace the variable everywhere, not in one place."],
    21: ["Numeric slider", "Move one number and watch the linked output.", "Change one parameter at a time."],
    22: ["Integer slider", "Integer sliders move in whole-number steps.", "Use them for counts and sequence indices."],
    23: ["Angle slider", "Angle sliders need a clear unit.", "Do not mix degrees and radians."],
    24: ["Animation rule", "Animation repeatedly changes one parameter.", "Pause and read the changing value."],
    25: ["Dependency rule", "Independent values are chosen; dependent values are calculated.", "Change the parent value to update the child."],
    26: ["Visibility rule", "A condition must be true before an object appears.", "Check boundary values carefully."],
    27: ["Dynamic label", "A dynamic label reads the current linked value.", "Avoid typing a fixed number into a live label."],
    28: ["Input syntax", "The parser needs clear multiplication and brackets.", "Check the preview before using the result."],
    29: ["Redefinition rule", "Changing a parent definition can update dependent objects.", "Inspect linked outputs after redefining."],
    30: ["Equation input", "An equation needs two sides and an equals sign.", "Solve by keeping both sides balanced."],
    31: ["Inequality input", "Use <, >, <=, or >= to compare two sides.", "Reverse the sign when dividing by a negative."],
    32: ["List rule", "A list stores ordered entries.", "Choose an operation before treating a list like a value."],
    33: ["Matrix size", "Matrix size is rows by columns.", "Count rows first, then columns."],
    34: ["Sequence rule", "A sequence is an ordered list made by a rule.", "Term n uses n-1 jumps after the first term."],
    35: ["Piecewise rule", "Only the rule with the true condition is active.", "Check boundary symbols carefully."],
    36: ["Boolean rule", "Boolean values are true or false.", "For and, both statements must be true."],
    37: ["Dynamic text", "Dynamic text reads live linked values.", "Use a link instead of typing a fixed value."],
    38: ["LaTeX display", "LaTeX needs correct grouping braces.", "Preview the formula before sharing it."],
  };
  return guidance[lessonId] ?? ["Algebra rule", "Link variables, expressions, and outputs.", "Use the table to check the rule."];
}

function GraphGrid() {
  return <g><rect width="640" height="360" fill="transparent" />{Array.from({ length: 21 }, (_, index) => <line key={`v-${index}`} x1={index * 32} x2={index * 32} y1="0" y2="360" stroke="#cbd5e1" opacity="0.35" />)}{Array.from({ length: 13 }, (_, index) => <line key={`h-${index}`} x1="0" x2="640" y1={index * 30} y2={index * 30} stroke="#cbd5e1" opacity="0.35" />)}<line x1="0" x2="640" y1="180" y2="180" stroke="#64748b" /><line x1="320" x2="320" y1="0" y2="360" stroke="#64748b" /></g>;
}

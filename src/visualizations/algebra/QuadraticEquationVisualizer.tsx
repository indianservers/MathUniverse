import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import FormulaBlock from "../../components/ui/FormulaBlock";
import GraphCard from "../../components/ui/GraphCard";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { analyzeQuadratic, quadraticResidual } from "../../utils/coreAccuracyOracles";
import { roundTo } from "../../utils/math";

export default function QuadraticEquationVisualizer() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(-5);
  const [c, setC] = useState(6);
  const analysis = useMemo(() => analyzeQuadratic(a, b, c), [a, b, c]);
  const data = useMemo(() => Array.from({ length: 161 }, (_, index) => {
    const x = -8 + index * 0.1;
    return { x, y: quadraticResidual(a, b, c, x) };
  }), [a, b, c]);
  const rootResidual = analysis.realRoots.length ? Math.max(...analysis.realRoots.map((root) => Math.abs(quadraticResidual(a, b, c, root)))) : null;
  const classification = analysis.kind !== "quadratic"
    ? analysis.kind === "linear" ? "Linear boundary case (a = 0)" : "Constant boundary case"
    : analysis.discriminant! > 0 ? "Two distinct real roots"
      : analysis.discriminant === 0 ? "One repeated real root"
        : "No real roots (two complex roots)";

  return (
    <SectionCard title="Quadratic Equation Visualizer" description="Change a, b, and c; the formula, discriminant, vertex, roots, graph, and residual check update from one state.">
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="space-y-3">
          <FormulaBlock title="Current quadratic" formula={`${formatCoefficient(a, "x^2", true)}${formatCoefficient(b, "x")}${formatConstant(c)}`} explanation="A true quadratic requires a nonzero leading coefficient." />
          <SliderControl label="Leading coefficient a" value={a} min={-4} max={4} step={0.25} onChange={setA} />
          <SliderControl label="Linear coefficient b" value={b} min={-10} max={10} step={0.5} onChange={setB} />
          <SliderControl label="Constant c" value={c} min={-10} max={10} step={0.5} onChange={setC} />
          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="action-secondary" onClick={() => { setA(1); setB(-5); setC(6); }}>Two roots</button>
            <button type="button" className="action-secondary" onClick={() => { setA(1); setB(-2); setC(1); }}>Repeated root</button>
            <button type="button" className="action-secondary" onClick={() => { setA(1); setB(0); setC(1); }}>No real roots</button>
            <button type="button" className="action-secondary" onClick={() => { setA(0); setB(2); setC(-4); }}>a = 0 boundary</button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="classification" value={classification} />
            <Metric label="discriminant" value={analysis.discriminant == null ? "not quadratic" : roundTo(analysis.discriminant, 5).toString()} />
            <Metric label="axis" value={analysis.axis == null ? "not applicable" : `x=${roundTo(analysis.axis, 5)}`} />
            <Metric label="vertex" value={analysis.vertex == null ? "not applicable" : `(${roundTo(analysis.vertex.x, 4)}, ${roundTo(analysis.vertex.y, 4)})`} />
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-300/10 dark:text-emerald-100">
            <p className="font-black">Independent root check</p>
            <p>{analysis.realRoots.length ? analysis.realRoots.map((root) => roundTo(root, 7)).join(", ") : "No real roots to substitute."}</p>
            <p>Maximum |ax²+bx+c| at reported roots: {rootResidual == null ? "n/a" : rootResidual.toExponential(2)}</p>
          </div>
        </div>
        <GraphCard title="Parabola and verified roots" description="The dashed line is the symmetry axis; root markers appear only for real roots.">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,.28)" />
              <XAxis dataKey="x" stroke="#94a3b8" /><YAxis domain={[-20, 20]} allowDataOverflow stroke="#94a3b8" />
              <Tooltip contentStyle={{ borderRadius: 16, border: "1px solid rgba(148,163,184,.3)", background: "rgba(15,23,42,.92)", color: "#f8fafc" }} />
              <ReferenceLine x={0} stroke="#64748b" /><ReferenceLine y={0} stroke="#64748b" />
              {analysis.axis != null && <ReferenceLine x={analysis.axis} stroke="#f59e0b" strokeDasharray="6 5" />}
              <Line dataKey="y" stroke="#8b5cf6" strokeWidth={3} dot={false} isAnimationActive={false} />
              {analysis.realRoots.map((root) => <ReferenceDot key={root} x={root} y={0} r={6} fill="#22d3ee" stroke="#0f172a" />)}
              {analysis.vertex && <ReferenceDot x={analysis.vertex.x} y={analysis.vertex.y} r={6} fill="#f59e0b" stroke="#0f172a" />}
            </LineChart>
          </ResponsiveContainer>
        </GraphCard>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="A quadratic function has a nonzero x² coefficient. Its discriminant classifies real roots, and its vertex lies on x=-b/(2a)."
          formula="x=(-b+-sqrt(b^2-4ac))/(2a), a != 0"
          changes="Changing a controls opening and vertical scale. Changing b moves the symmetry axis. Changing c moves the y-intercept."
          realWorldUse="Projectile height under a constant-gravity model, area constraints, optimization, and polynomial root analysis."
          warning={analysis.kind === "quadratic" ? classification : "The current a=0 state is intentionally classified outside the quadratic formula."}
          steps={[
            `Confirm a=${roundTo(a, 3)}${Math.abs(a) < 1e-9 ? ", so this is not quadratic." : " is nonzero."}`,
            analysis.discriminant == null ? "Discriminant is not applicable." : `Compute D=b²-4ac=${roundTo(analysis.discriminant, 4)}.`,
            analysis.axis == null ? "No parabola axis exists in this boundary case." : `Axis x=-b/(2a)=${roundTo(analysis.axis, 4)}.`,
            analysis.realRoots.length ? `Substitute the real root(s); maximum residual is ${rootResidual?.toExponential(2)}.` : "The graph has no real x-axis crossings.",
          ]}
          tasks={["Choose the repeated-root preset.", "Make a negative and observe downward opening.", "Set a=0 and explain why the quadratic formula is invalid.", "Create a parabola with no real roots."]}
          misconception="A negative discriminant does not make the function undefined; it means the real graph does not cross the x-axis."
          teacherPrompt="Which displayed value proves the number of real roots?"
        />
      </div>
    </SectionCard>
  );
}

function formatCoefficient(value: number, term: string, first = false) {
  const sign = value < 0 ? "-" : first ? "" : "+";
  return `${sign}${roundTo(Math.abs(value), 3)}${term}`;
}

function formatConstant(value: number) {
  return `${value < 0 ? "-" : "+"}${roundTo(Math.abs(value), 3)}`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-[10px] font-black uppercase text-slate-500">{label}</p><p className="mt-1 break-words font-semibold">{value}</p></div>;
}

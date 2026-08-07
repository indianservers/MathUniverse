import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { samplePlotLayer, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import { symbolicDerivative, symbolicIntegral } from "../../../utils/symbolic";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const viewport: GraphViewport = { xMin: -5, xMax: 5, yMin: -6, yMax: 10, width: 640, height: 360 };
const scaleX = (x: number) => ((x + 5) / 10) * 640;
const scaleY = (y: number) => 360 - ((y + 6) / 16) * 360;

function functionFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("trig") || name.includes("sine")) return "sin(x)";
  if (name.includes("exponential")) return "exp(x/2)";
  if (name.includes("rational") || name.includes("asympt")) return "1/x";
  if (name.includes("absolute")) return "abs(x)";
  return "x^2";
}

function numericValue(expression: string, x: number) {
  if (expression === "sin(x)") return Math.sin(x);
  if (expression === "exp(x/2)") return Math.exp(x / 2);
  if (expression === "1/x") return 1 / x;
  if (expression === "abs(x)") return Math.abs(x);
  return x * x;
}

function calculusGuidanceFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("informal limits")) return ["Informal limits", "A limit is the value f(x) gets close to.", "It may differ from the value at the point."];
  if (name.includes("one-sided")) return ["One-sided limits", "Check the left and right approaches separately.", "The two sides must match for a full limit."];
  if (name.includes("infinite limits")) return ["Infinite limits", "The graph grows without bound near a point.", "Infinity is not a normal number value."];
  if (name.includes("limits at infinity")) return ["Limits at infinity", "Look far left or far right on the graph.", "This describes end behaviour, not a nearby point."];
  if (name.includes("discontinuity")) return ["Types of discontinuity", "Breaks can be holes, jumps, or vertical blow-ups.", "Do not treat every break the same way."];
  if (name.includes("continuity")) return ["Continuity at a point", "The graph has no break at the point.", "Limit and function value must match."];
  if (name.includes("epsilon") || name.includes("delta")) return ["Epsilon-delta visualiser", "Delta controls input closeness; epsilon controls output closeness.", "Both bands matter in the proof."];
  if (name.includes("average rate")) return ["Average rate of change", "Use slope between two points.", "It measures change over an interval."];
  if (name.includes("instantaneous rate")) return ["Instantaneous rate of change", "Let the second point move very close.", "This becomes the derivative at one point."];
  if (name.includes("first principles")) return ["First principles", "Use the limit of the difference quotient.", "Do not skip the limiting step."];
  if (name.includes("tangent line")) return ["Tangent line", "The tangent slope is f prime at that x.", "It touches local motion, not always one point only."];
  if (name.includes("normal line")) return ["Normal line", "The normal is perpendicular to the tangent.", "Its slope is the negative reciprocal when possible."];
  if (name.includes("derivative graph")) return ["Derivative graph", "The derivative graph shows slopes of f.", "Positive slope means f prime is above zero."];
  if (name.includes("higher derivatives")) return ["Higher derivatives", "Differentiate again to study changing slope.", "Second derivative describes concavity."];
  if (name.includes("product rule")) return ["Product rule", "Differentiate both factors in two terms.", "Do not just multiply the two derivatives."];
  if (name.includes("quotient rule")) return ["Quotient rule", "Use bottom times top prime minus top times bottom prime.", "Keep the order in the numerator."];
  if (name.includes("chain rule")) return ["Chain rule", "Differentiate the outside, then multiply by the inside derivative.", "Nested functions need both parts."];
  if (name.includes("implicit")) return ["Implicit differentiation", "Differentiate both sides and use dy/dx for y terms.", "Treat y as a function of x."];
  if (name.includes("parametric")) return ["Parametric differentiation", "Use dy/dx equals (dy/dt) divided by (dx/dt).", "Both coordinates depend on the parameter."];
  if (name.includes("critical points")) return ["Critical points", "Check where f prime is zero or undefined.", "A critical point need not be a maximum."];
  if (name.includes("increasing") || name.includes("decreasing")) return ["Increasing or decreasing", "Use the sign of f prime.", "Positive derivative means the function rises."];
  if (name.includes("local and global extrema")) return ["Local and global extrema", "Compare nearby points and the whole domain.", "Global means best over all allowed inputs."];
  if (name.includes("concavity")) return ["Concavity", "Use the sign of the second derivative.", "Concavity is about bending, not rising."];
  if (name.includes("inflection")) return ["Inflection points", "Concavity changes at an inflection point.", "A zero second derivative alone is not enough."];
  if (name.includes("optimisation")) return ["Optimisation", "Model the quantity, then test candidates.", "The largest or smallest value must fit the domain."];
  if (name.includes("related rates")) return ["Related rates", "Different quantities change together over time.", "Differentiate with respect to time."];
  if (name.includes("motion analysis")) return ["Motion analysis", "Velocity is position derivative; acceleration is velocity derivative.", "Direction depends on sign, not just size."];
  if (name.includes("newton")) return ["Newton's method", "Use tangent lines to improve a root estimate.", "A poor starting point may fail."];
  if (name.includes("taylor")) return ["Taylor polynomial", "Use derivatives at one point to build a polynomial.", "It is usually an approximation nearby."];
  if (name.includes("area between curves")) return ["Area between curves", "Integrate top minus bottom over the interval.", "Area is not bottom minus top."];
  if (name.includes("area by rectangles")) return ["Area by rectangles", "Use many thin rectangles to estimate area.", "One wide rectangle is usually crude."];
  if (name.includes("riemann")) return ["Riemann sums", "Add sample heights times small widths.", "Left, right, and midpoint samples can differ."];
  if (name.includes("indefinite integral")) return ["Indefinite integral", "It gives a family of antiderivatives.", "Remember the constant C."];
  if (name.includes("definite integral")) return ["Definite integral", "It gives signed accumulation from a to b.", "Below-axis area counts negative."];
  if (name.includes("fundamental theorem")) return ["Fundamental theorem", "Use an antiderivative: F(b) minus F(a).", "Do not substitute into f only."];
  if (name.includes("substitution")) return ["Substitution", "Replace the inside expression with u.", "Change the matching dx part too."];
  if (name.includes("integration by parts")) return ["Integration by parts", "Use uv minus the integral of v du.", "It reverses the product rule."];
  if (name.includes("partial fractions")) return ["Partial fractions", "Factor the denominator before splitting.", "Choose forms that match the factors."];
  if (name.includes("improper")) return ["Improper integrals", "Turn infinity or blow-up points into limits.", "Infinity is not a normal endpoint."];
  if (name.includes("numerical integration")) return ["Numerical integration", "Approximate the integral with sampled values.", "Name the rule and step size."];
  if (name.includes("volume by slicing")) return ["Volume by slicing", "Integrate cross-section area.", "A length alone is not volume."];
  if (name.includes("disc and washer") || name.includes("washer")) return ["Disc and washer methods", "Use pi times outer radius squared minus inner radius squared.", "Square radii before subtracting."];
  if (name.includes("shell method")) return ["Shell method", "Add cylindrical shells using radius and height.", "Radius is distance to the axis."];
  if (name.includes("arc length")) return ["Arc length", "Add tiny straight pieces along the curve.", "Horizontal distance alone misses bending."];
  if (name.includes("surface area of revolution")) return ["Surface area of revolution", "Use circumference times tiny arc length.", "This is surface area, not volume."];
  if (name.includes("accumulation functions")) return ["Accumulation functions", "Move the upper limit to build a changing total.", "The output changes with x."];
  if (name.includes("direction fields")) return ["Direction fields", "Each tiny mark shows dy/dx at a point.", "A field shows many possible solutions."];
  if (name.includes("euler")) return ["Euler's method", "Step forward using the current slope.", "Large steps can create large error."];
  if (name.includes("separable")) return ["Separable equations", "Put y terms and x terms on different sides.", "Separate before integrating."];
  if (name.includes("first-order linear")) return ["First-order linear equations", "Use an integrating factor for y' plus p(x)y.", "Do not ignore the p(x)y term."];
  if (name.includes("logistic")) return ["Logistic growth", "Growth slows near carrying capacity.", "It does not grow exponentially forever."];
  if (name.includes("second-order")) return ["Second-order equations", "A second derivative models changing rate.", "Two initial conditions are usually needed."];
  if (name.includes("phase plane")) return ["Phase plane", "Axes are state variables, not time.", "Time is traced along the curve."];
  if (name.includes("equilibrium")) return ["Equilibrium and stability", "Equilibrium means the rate is zero.", "The state itself need not be zero."];
  if (name.includes("discrete dynamical")) return ["Discrete dynamical systems", "Update the state one step at a time.", "Do not treat steps as smooth time."];
  if (name.includes("cobweb")) return ["Cobweb diagrams", "Move to the curve, then to y equals x.", "The diagonal feeds output back as input."];
  if (name.includes("chaos") || name.includes("bifurcation")) return ["Chaos and bifurcation", "A rule can be very sensitive to starting values.", "Chaos does not mean no rule exists."];
  return ["Calculus rule", "Connect the graph, rate, and symbolic result.", "Check the domain before using a rule."];
}

export default function CalculusLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const expression = useMemo(() => functionFor(lesson.title), [lesson.title]);
  const initialX = lesson.id % 4 - 1;
  const [x, setX] = useState(initialX || 1);
  const [h, setH] = useState(1);
  const [partitions, setPartitions] = useState(8);
  const guidance = calculusGuidanceFor(lesson.title);

  useEffect(() => {
    setX(initialX || 1);
    setH(1);
    setPartitions(8);
  }, [initialX, resetToken]);

  const plot = useMemo<PlotItem>(() => ({ id: `calculus-${lesson.id}`, expression, color: "#06b6d4", kind: "function", visible: true }), [expression, lesson.id]);
  const layer = useMemo(() => samplePlotLayer(plot, viewport, 1, 0), [plot]);
  const y = numericValue(expression, x);
  const nextY = numericValue(expression, x + h);
  const secant = (nextY - y) / h;
  const derivative = useMemo(() => symbolicDerivative(expression).result, [expression]);
  const integral = useMemo(() => symbolicIntegral(expression).result, [expression]);
  const isIntegral = /area|integral|antiderivative|riemann|accumulation|volume/i.test(lesson.title);
  const left = Math.min(0, x);
  const right = Math.max(0.1, x);
  const width = (right - left) / partitions;
  const rectangles = Array.from({ length: partitions }, (_, index) => {
    const rx = left + index * width;
    const height = numericValue(expression, rx + width / 2);
    return { rx, height };
  });
  const update = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };

  return (
    <AdapterFrame title={`${lesson.title} - graph + CAS`} value={isIntegral ? `integral f dx = ${integral}` : `f'(x) = ${derivative}`} footer="The curve uses the graph sampler; exact derivative and antiderivative use the existing symbolic engine.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
          <svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label={`Calculus model for ${expression}`}>
            <Grid />
            {isIntegral ? (
              rectangles.map((item, index) => <rect key={index} x={scaleX(item.rx)} y={scaleY(Math.max(0, item.height))} width={Math.max(1, scaleX(item.rx + width) - scaleX(item.rx))} height={Math.abs(scaleY(0) - scaleY(item.height))} fill="#f59e0b" opacity=".25" stroke="#f59e0b" />)
            ) : (
              <>
                <line x1={scaleX(x)} y1={scaleY(y)} x2={scaleX(x + h)} y2={scaleY(nextY)} stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 5" />
                <circle cx={scaleX(x)} cy={scaleY(y)} r="7" fill="#f59e0b" />
                <circle cx={scaleX(x + h)} cy={scaleY(nextY)} r="7" fill="#f59e0b" />
              </>
            )}
            {layer.paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#06b6d4" strokeWidth="4" />)}
          </svg>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
          <SliderGroup title="Linked controls">
            <SliderControl density="compact" label="x" value={x} min={-4} max={4} step={0.1} onChange={update(setX)} />
            {isIntegral ? <SliderControl density="compact" label="Rectangles" value={partitions} min={2} max={40} step={1} onChange={update(setPartitions)} /> : <SliderControl density="compact" label="h" value={h} min={0.05} max={2} step={0.05} onChange={update(setH)} />}
          </SliderGroup>
          <div className="grid grid-cols-2 gap-2">
            <Metric label="f(x)" value={y.toFixed(3)} />
            <Metric label={isIntegral ? "dx" : "Secant slope"} value={isIntegral ? width.toFixed(3) : secant.toFixed(3)} />
            <Metric label="Exact f'" value={derivative} />
            <Metric label="Exact integral" value={integral} />
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

function Grid() {
  return (
    <g>
      {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 64} x2={i * 64} y1="0" y2="360" stroke="#cbd5e1" opacity=".28" />)}
      {Array.from({ length: 9 }, (_, i) => <line key={`h${i}`} x1="0" x2="640" y1={i * 45} y2={i * 45} stroke="#cbd5e1" opacity=".28" />)}
      <line x1="0" x2="640" y1={scaleY(0)} y2={scaleY(0)} stroke="#64748b" />
      <line x1={scaleX(0)} x2={scaleX(0)} y1="0" y2="360" stroke="#64748b" />
    </g>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">{label}</span><strong className="break-all font-mono text-xs">{value}</strong></div>;
}

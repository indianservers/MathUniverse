import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { applyGraphParameters, samplePlotLayer, sampleTable, type GraphViewport, type PlotItem } from "../../../components/workspace/panels/graphPanelUtils";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const viewport: GraphViewport = { xMin: -10, xMax: 10, yMin: -10, yMax: 10, width: 640, height: 360 };

function presetFor(title: string) {
  const name = title.toLowerCase();
  const make = (expression: string, parent: string, insight: string, check: string, kind: PlotItem["kind"] = "function") => ({ expression, parent, kind, insight, check });
  if (name.includes("cartesian graphing")) return make("a*x+b", "x", "Cartesian graphing uses x first and y second.", "Plot points by moving horizontally, then vertically.");
  if (name.includes("function plotter")) return make("a*x+b", "x", "Function plotter: each x input makes one y output.", "Check one table row against the rule.");
  if (name.includes("equation grapher")) return make("a*x+b", "x", "Equation grapher: the curve shows all solution points.", "Test a point by substitution.");
  if (name.includes("inequality grapher")) return make("y<a*x+b", "y<x", "Inequality grapher shades all points that satisfy the rule.", "Use a test point before shading.", "inequality");
  if (name.includes("point plotter")) return make("a*x+b", "x", "Point plotter places exact ordered pairs.", "Keep coordinate order as x then y.");
  if (name.includes("data plotter")) return make("a*x+b", "x", "Data plotter shows trend, spread, and outliers.", "Do not force noisy data through every point.");
  if (name.includes("table of values")) return make("a*x+b", "x", "Table of values pairs each input with its output.", "Keep each x-value with its own y-value.");
  if (name.includes("trace mode")) return make("a*x+b", "x", "Trace mode reads coordinates along the graph.", "Use the readout instead of a grid guess.");
  if (name.includes("zoom and pan")) return make("a*x+b", "x", "Zoom and pan change the view, not the equation.", "Read axes after changing the window.");
  if (name.includes("axis controls")) return make("a*x+b", "x", "Axis controls set graph limits and scale.", "Compare graphs only after checking scale.");
  if (name.includes("grid controls")) return make("a*x+b", "x", "Grid controls set guide-line spacing.", "Check the grid step before counting squares.");
  if (name.includes("multiple graphics views")) return make("a*x+b", "x", "Multiple views can show the same object at different scales.", "Identify the shared graph before comparing.");
  if (name.includes("special points")) return make("a*x^2+b", "x^2", "Special points satisfy extra conditions such as y=0.", "A random point is not automatically special.");
  if (name.includes("graph inspector")) return make("a*x+b", "x", "Graph inspector reports selected graph facts.", "Use the readout instead of guessing by eye.");
  if (name.includes("dynamic parameters")) return make("a*x+b", "x", "Dynamic parameters change a whole graph family.", "Move one parameter at a time.");
  if (name.includes("export graph")) return make("a*x+b", "x", "Export graph keeps the view, axes, labels, and scale.", "Include context so another reader understands it.");
  if (name.includes("function concept")) return make("a*x+b", "x", "Function test: each input has exactly one output.", "Check x=2 in the table; it has one f(x) value.");
  if (name.includes("domain and range")) return make("sqrt(x)+b", "sqrt(x)", "Domain check: square-root inputs start at x >= 0.", "Range is read from y-values, not x-values.");
  if (name.includes("function notation")) return make("a*x+b", "x", "f(2) means use input 2 in this named rule.", "Read one input-output pair from the table.");
  if (name.includes("vertical-line")) return make("sqrt(9-x^2)", "sqrt(9-x^2)", "Vertical-line test: one x must not have two y-values.", "A top semicircle passes, but a full circle would fail.");
  if (name.includes("linear functions")) return make("a*x+b", "x", "Linear feature: equal x-steps make equal y-changes.", "Slope controls the constant rate.");
  if (name.includes("quadratic") || name.includes("parabola")) return make("a*x^2+b", "x^2", "Quadratic feature: the graph turns at a vertex.", "The squared term makes a parabola.");
  if (name.includes("cubic")) return make("a*x^3+b", "x^3", "Cubic feature: the parent graph has origin symmetry.", "Negative inputs keep negative outputs for x^3.");
  if (name.includes("higher-degree")) return make("a*x^4+b", "x^4", "Degree feature: degree limits roots and turning points.", "A degree 4 polynomial has at most 4 real roots.");
  if (name.includes("reciprocal")) return make("a/x+b", "1/x", "Reciprocal feature: x=0 is excluded.", "The graph approaches asymptotes.");
  if (name.includes("rational functions")) return make("a/(x-2)+b", "1/(x-2)", "Rational feature: denominator zeros are excluded.", "Keep original denominator restrictions.");
  if (name.includes("square-root")) return make("a*sqrt(x)+b", "sqrt(x)", "Square-root feature: real inputs need x >= 0.", "The graph begins at an endpoint.");
  if (name.includes("cube-root")) return make("a*cbrt(x)+b", "cbrt(x)", "Cube-root feature: negative real inputs are allowed.", "cuberoot(-8) is -2.");
  if (name.includes("absolute")) return make("a*abs(x)+b", "abs(x)", "Absolute-value feature: distance makes a V-shape.", "Outputs mirror around the vertex before shifts.");
  if (name.includes("exponential")) return make("a*2^x+b", "2^x", "Exponential feature: equal x-steps multiply outputs.", "Growth has a constant ratio.");
  if (name.includes("logarith")) return make("a*ln(x)+b", "ln(x)", "Logarithmic feature: inputs must be positive.", "Logs undo exponential functions.");
  if (name.includes("trig") || name.includes("sine") || name.includes("cosine")) return make("a*sin(x)+b", "sin(x)", "Trigonometric feature: the graph repeats with a period.", "Check angle units before calculating.");
  if (name.includes("hyperbolic")) return make("a*((exp(x)+exp(-x))/2)+b", "(exp(x)+exp(-x))/2", "Hyperbolic feature: cosh is not periodic like cosine.", "The graph has a catenary shape.");
  if (name.includes("floor")) return make("floor(x)+b", "floor(x)", "Floor feature: outputs step down to integers.", "floor(-1.2) is -2, not -1.");
  if (name.includes("ceiling")) return make("ceil(x)+b", "ceil(x)", "Ceiling feature: outputs step up to integers.", "ceiling(3.2) is 4.");
  if (name.includes("sign function")) return make("x/sqrt(x^2)+b", "x/sqrt(x^2)", "Sign feature: outputs are -1, 0, or 1 before shifts.", "The value tells direction, not size.");
  if (name.includes("piecewise")) return make("if(x<0,-x,x^2)", "abs(x)", "Piecewise feature: choose only the rule whose condition matches.", "Boundary symbols decide the active rule.", "piecewise");
  if (name.includes("composite")) return make("a*(x+b)", "x", "Composite feature: the inner output becomes the outer input.", "Order matters in f(g(x)).");
  if (name.includes("inverse functions")) return make("(x-b)/a", "x", "Inverse feature: inputs and outputs reverse.", "Inverse graphs reflect across y=x.");
  if (name.includes("even and odd")) return make("x^2", "x^3", "Symmetry test: even uses f(-x)=f(x), odd uses f(-x)=-f(x).", "Compare the live even parent with the grey odd parent.");
  if (name.includes("increasing and decreasing")) return make("a*x+b", "x", "Direction feature: read increasing or decreasing from left to right.", "Use x-intervals to describe where y rises or falls.");
  if (name.includes("periodic functions")) return make("a*sin(x)+b", "sin(x)", "Periodic feature: the graph repeats after a fixed period.", "One full sine cycle is 2pi radians.");
  if (name.includes("recursive functions")) return make("a*x+b", "x", "Recursive feature: each new value depends on an earlier value.", "The table shows the next outputs step by step.");
  if (name.includes("vertical translation")) return make("x^2+b", "x^2", "Transformation feature: outside addition moves the graph up or down.", "Only y-values change.");
  if (name.includes("horizontal translation")) return make("(x-b)^2", "x^2", "Transformation feature: inside subtraction moves the graph right.", "Track the vertex to see the shift.");
  if (name.includes("vertical stretch")) return make("a*x^2", "x^2", "Transformation feature: outside multiplication changes height.", "x-values stay fixed.");
  if (name.includes("horizontal stretch")) return make("(a*x)^2", "x^2", "Transformation feature: inside multiplication changes width by the reciprocal.", "Check a key point before and after.");
  if (name.includes("reflection in x-axis")) return make("-abs(x)+b", "abs(x)", "Reflection feature: x-axis reflection changes y to -y.", "The graph flips vertically.");
  if (name.includes("reflection in y-axis")) return make("sqrt((x)^2)+b", "abs(x)", "Reflection feature: y-axis reflection changes x to -x.", "A symmetric parent may look unchanged.");
  if (name.includes("combined transformations")) return make("a*(x-b)^2+b", "x^2", "Combined feature: inside changes affect x; outside changes affect y.", "Track one key point through all changes.");
  if (name.includes("transformation order")) return make("a*(x-b)^2+1", "x^2", "Order feature: later transformations act on already changed values.", "Track one point step by step.");
  if (name.includes("parameter explorer")) return make("a*x+b", "x", "Parameter feature: sliders change the graph family, not just one point.", "Change one parameter at a time.");
  if (name.includes("parent-function library")) return make("x^2", "abs(x)", "Parent feature: the simplest rule shows the family shape.", "Compare parent shapes before transformations.");
  if (name.includes("graph matching")) return make("a*x+b", "x", "Matching feature: use shape plus more than one point.", "One point alone is not enough.");
  if (name.includes("polar")) return make("r=a*sin(3*theta), theta=0..2*pi", "r=sin(3*theta), theta=0..2*pi", "Polar graphs use angle and radius.", "The angle controls direction.", "polar");
  if (name.includes("parametric")) return make("x=a*cos(t), y=a*sin(t), t=0..2*pi", "x=cos(t), y=sin(t), t=0..2*pi", "Parametric graphs use a third variable to trace points.", "t moves both x and y.", "parametric");
  if (name.includes("inequal")) return make("y<a*x+b", "y<x", "Inequality graphs shade all points that satisfy the rule.", "A test point chooses the side.", "inequality");
  if (name.includes("circle") || name.includes("implicit")) return make("x^2+y^2=a^2", "x^2+y^2=9", "Implicit graphs can relate x and y without y=f(x).", "A circle is not a function of x.", "implicit");
  return make("a*x+b", "x", "Linked graph: the formula, curve, and table update together.", "Use the table to check one point.");
}

export default function GraphLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const preset = useMemo(() => presetFor(lesson.title), [lesson.title]);
  const initialA = lesson.id % 3 + 1;
  const initialB = lesson.id % 5 - 2;
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  useEffect(() => { setA(initialA); setB(initialB); }, [initialA, initialB, resetToken]);
  const current = useMemo<PlotItem>(() => ({ id: `graph-${lesson.id}`, expression: preset.expression, color: "#06b6d4", kind: preset.kind, visible: true }), [lesson.id, preset]);
  const parent = useMemo<PlotItem>(() => ({ id: `parent-${lesson.id}`, expression: preset.parent, color: "#94a3b8", kind: preset.kind, visible: true }), [lesson.id, preset]);
  const currentLayer = useMemo(() => samplePlotLayer(current, viewport, a, b), [a, b, current]);
  const parentLayer = useMemo(() => samplePlotLayer(parent, viewport, 1, 0), [parent]);
  const expression = applyGraphParameters(preset.expression, a, b);
  const table = useMemo(() => sampleTable(expression, "f", -2, 2, 2).slice(0, 3), [expression]);
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };
  return <AdapterFrame title={`${lesson.title} · linked graph`} value={expression} footer="Cyan is the live model; grey is the parent. The same sampler powers graph workspace plots and lesson tables.">
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
      <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900"><svg viewBox="0 0 640 360" className="h-[300px] w-full" role="img" aria-label={`Interactive plot of ${expression}`}><Grid />{parentLayer.paths.map((path, index) => <path key={`p${index}`} d={path} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="8 6" />)}{parentLayer.cells.map((cell, index) => <rect key={`pc${index}`} {...cell} fill="#94a3b8" opacity=".12" />)}{currentLayer.cells.map((cell, index) => <rect key={`c${index}`} {...cell} fill="#06b6d4" opacity=".2" />)}{currentLayer.paths.map((path, index) => <path key={index} d={path} fill="none" stroke="#06b6d4" strokeWidth="4" strokeLinecap="round" />)}</svg></div>
      <div className="space-y-3"><SliderGroup title="Graph controls"><SliderControl density="compact" label="a" value={a} min={-5} max={5} step={0.25} onChange={update(setA)} /><SliderControl density="compact" label="b" value={b} min={-5} max={5} step={0.25} onChange={update(setB)} /></SliderGroup><div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100"><p>{preset.insight}</p><p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{preset.check}</p></div><div className="grid grid-cols-3 gap-2">{table.map((row) => <div key={row.x} className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">x={row.x}</span><strong className="font-mono text-sm">{row.y}</strong></div>)}</div>{currentLayer.error ? <p className="rounded-xl bg-amber-100 p-2 text-xs font-bold text-amber-900">{currentLayer.error}</p> : null}</div>
    </div>
  </AdapterFrame>;
}

function Grid() { return <g><rect width="640" height="360" fill="transparent" />{Array.from({ length: 21 }, (_, i) => <line key={`v${i}`} x1={i * 32} x2={i * 32} y1="0" y2="360" stroke="#cbd5e1" opacity=".3" />)}{Array.from({ length: 13 }, (_, i) => <line key={`h${i}`} x1="0" x2="640" y1={i * 30} y2={i * 30} stroke="#cbd5e1" opacity=".3" />)}<line x1="0" x2="640" y1="180" y2="180" stroke="#64748b" /><line x1="320" x2="320" y1="0" y2="360" stroke="#64748b" /></g>; }

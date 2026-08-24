import AdapterFrame from "../components/AdapterFrame";
import ReusableLessonEngine, { reusableEngineParamsFor } from "../components/ReusableLessonEngine";
import FunctionMockupLesson from "./graph/FunctionMockupLesson";
import { graphVisualPresetForLesson } from "../presets/graphVisualPresets";
import type { LessonAdapterProps } from "../types";
import { useEffect, useState } from "react";

type GraphSpec = {
  title: string;
  purpose: string;
  value: string;
  equation: string;
  focus: string;
  left: string[];
  right: string[];
  warning: string;
  testSnippet: string;
  visual: "cartesian" | "functions" | "equation" | "inequality" | "parametric" | "polar" | "points" | "data" | "table" | "trace";
};

export default function GraphLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  if (lesson.id >= 143 && lesson.id <= 152) {
    return <FunctionMockupLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  if ((lesson.id >= 39 && lesson.id <= 56) || (lesson.id >= 129 && lesson.id <= 166)) {
    return <RedesignedGraphingLesson lesson={lesson} resetToken={resetToken} onInteraction={onInteraction} />;
  }

  const params = graphVisualPresetForLesson(lesson.id) ?? reusableEngineParamsFor("graph-2d", lesson.title);
  return (
    <AdapterFrame title={`${lesson.title} - reusable 2D graph engine`} value={params.expression} footer="This lesson uses the shared graph engine in focused axis mode: no full workspace menus, only topic parameters and the graph area.">
      <ReusableLessonEngine engine="graph-2d" params={params} resetToken={resetToken} onInteraction={onInteraction} />
    </AdapterFrame>
  );
}

function RedesignedGraphingLesson({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const spec = graphSpecFor(lesson.id);
  const [probe, setProbe] = useState(50);
  const [showHelper, setShowHelper] = useState(true);

  useEffect(() => { setProbe(50); setShowHelper(true); }, [lesson.id, resetToken]);

  return (
    <AdapterFrame title={`${lesson.title} graphing studio`} value={spec.value} footer={`${spec.title}: ${spec.warning}`}>
      <section className="grid gap-4 xl:grid-cols-[235px_minmax(0,1fr)_260px]" aria-label={`${spec.title} redesigned graphing calculator lesson`}>
        <aside className="space-y-3 rounded-3xl border border-cyan-100 bg-cyan-50/70 p-4 dark:border-cyan-300/20 dark:bg-cyan-300/10">
          <div>
            <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">2D graphing calculator</p>
            <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">{spec.title}</h2>
            <p className="mt-1 text-sm font-bold text-slate-600 dark:text-slate-300">{spec.purpose}</p>
          </div>
          {spec.left.map((item, index) => <p key={`${item}-${index}`} className="rounded-2xl bg-white p-3 text-sm font-black text-slate-800 ring-1 ring-cyan-100 dark:bg-slate-950 dark:text-slate-100 dark:ring-white/10">{item}</p>)}
        </aside>

        <main className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-wide text-violet-700">Graph workspace</p>
              <h3 className="text-2xl font-black text-slate-950 dark:text-white">{spec.equation}</h3>
              <p className="mt-1 text-sm font-black text-slate-600 dark:text-slate-300">{spec.focus}</p>
            </div>
            <span data-direct-interaction="true" className="rounded-2xl bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-900 ring-1 ring-cyan-100">Drag graph</span>
          </div>
          <div className="mt-4">{renderGraphVisual(spec, probe, showHelper)}</div>
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <label className="rounded-2xl bg-slate-50 p-3 text-xs font-black uppercase text-slate-500 ring-1 ring-slate-200">Trace x-value probe<input aria-label={`${spec.title} x value probe`} type="range" min="0" max="100" value={probe} onChange={(event) => { setProbe(Number(event.target.value)); onInteraction(); }} className="mt-2 w-full accent-violet-600" /></label>
            <button type="button" className="action-secondary justify-center" onClick={() => { setShowHelper((value) => !value); onInteraction(); }}>{showHelper ? "Hide guides" : "Show guides"}</button>
            <button type="button" className="action-secondary justify-center" onClick={() => { setProbe(50); setShowHelper(true); onInteraction(); }}>Reset view</button>
          </div>
        </main>

        <aside className="space-y-3">
          {spec.right.map((item, index) => <p key={`${item}-${index}`} className="rounded-2xl bg-emerald-50 p-3 text-sm font-black text-emerald-950 ring-1 ring-emerald-100">{item}</p>)}
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm font-black leading-6 text-amber-900">{spec.warning}</div>
          <div className="rounded-3xl border border-violet-200 bg-violet-50 p-4 text-sm font-black leading-6 text-violet-950">{spec.testSnippet}</div>
        </aside>
      </section>
    </AdapterFrame>
  );
}

function graphSpecFor(lessonId: number): GraphSpec {
  const specs: Record<number, GraphSpec> = {
    39: graphSpec("Cartesian Graphing", "Plot relationships on coordinate axes.", "P(2, 3)", "P(2, 3)", "x first and y second", ["Move horizontally", "Then move vertically", "Quadrant I"], ["Ordered pair confirmed", "x first", "y second"], "Read the x-coordinate before the y-coordinate.", "x first and y second", "cartesian"),
    40: graphSpec("Function Plotter", "Compare multiple functions.", "Trace x = 1.5", "f(x)=x^2-2, g(x)=0.8x+1, h(x)=sin(x)", "Outputs update together", ["f(x)=x^2-2", "g(x)=0.8x+1", "h(x)=sin(x)"], ["Intersections", "Trace x = 1.5", "each x input makes one y output"], "Do not compare curves without checking the same x input.", "each x input makes one y output", "functions"),
    41: graphSpec("Equation Grapher", "Visualise explicit and implicit equations.", "Solution set", "x^2/9 + y^2/4 = 1", "Every point on the curve makes the equation true", ["Test point (2, 1)", "satisfies", "does not satisfy"], ["Solution set", "all solution points", "Substitution check"], "Implicit equations are solution sets, not always y as a function of x.", "all solution points", "equation"),
    42: graphSpec("Inequality Grapher", "Understand feasible regions.", "Overlap", "y <= 0.8x + 1 and y > -0.5x + 2", "Overlap = solution region", ["Test point A(1, 2)", "Boundary included", "Boundary not included"], ["True/false badges", "shades all points", "Solution region"], "Solid boundaries are included; dashed boundaries are not.", "shades all points", "inequality"),
    43: graphSpec("Parametric Curves", "Explore time- or parameter-driven paths.", "t = 1.2pi", "x = 3cos(t), y = 2sin(t)", "t controls motion, not an axis", ["particle position", "direction of motion", "x radius a", "y radius b"], ["t table", "speed", "use a third variable"], "The parameter controls motion along the path; it is not a graph axis.", "use a third variable", "parametric"),
    44: graphSpec("Polar Graphs", "Explore radius-angle relationships.", "theta = 40 deg", "r = 4sin(3theta)", "Angle first, radius next", ["theta = 40 deg", "r = 2.57", "Pole"], ["Cartesian check", "petal count", "angle and radius"], "A polar point needs angle and radius, in that order.", "angle and radius", "polar"),
    45: graphSpec("Point Plotter", "Build coordinate fluency.", "C(1, 2)", "A(-2, 1), B(-1, 3), C(1, 2)", "Plot exact ordered pairs before connecting anything", ["A(-2, 1)", "B(-1, 3)", "C(1, 2)", "Snap to grid"], ["x first", "y second", "exact ordered pairs"], "Points are evidence before a trend line.", "exact ordered pairs", "points"),
    46: graphSpec("Data Plotter", "Connect datasets to graphs.", "r = 0.86", "Study hours vs Quiz score", "Best-fit line", ["Study hours", "Quiz score", "Residuals", "Outlier check"], ["r = 0.86", "trend, spread, and outliers", "Best-fit line"], "Do not force a curve before inspecting the data.", "trend, spread, and outliers", "data"),
    47: graphSpec("Table of Values", "Link numerical and graphical representations.", "x = 3", "f(x)=x^2-2x-3", "Row becomes point", ["x = 3", "f(x) = 0", "First differences"], ["Second differences constant", "pairs each input with its output", "Row becomes point"], "Every table row should correspond to a plotted graph point.", "pairs each input with its output", "table"),
    48: graphSpec("Trace Mode", "Observe paths and change.", "x = 1.8", "f(x)=sin(x)+0.3x", "Trace point", ["x = 1.8", "y = 1.51", "Slope estimate"], ["Move steadily and report both x and y", "reads coordinates along the graph", "Nearby values"], "Trace mode reads coordinates along the graph; report both x and y.", "reads coordinates along the graph", "trace"),
    49: graphSpec("Zoom and Pan", "Inspect graphs at different scales.", "x:[-2, 2], y:[-1, 1]", "f(x)=0.25x^3-x", "Same equation, different view", ["Viewport", "Zoomed region", "Pan arrows", "Mini overview map"], ["Zoom in/out", "Reset view", "Same equation, different view"], "Zoom and pan change the view, not the equation.", "change the view, not the equation", "trace"),
    50: graphSpec("Axis Controls", "Configure graph presentation.", "x:[-4,4], y:[0,18]", "y=2^x", "Axis limits and scale", ["x min", "x max", "y min", "y max"], ["Tick step", "Linear scale", "Log scale"], "Bad axis limits can hide important behavior, so check limits and scale together.", "limits and scale", "functions"),
    51: graphSpec("Grid Controls", "Use appropriate construction guides.", "f(1.5)=1.125", "y=0.5x^2", "Major and minor guide-line spacing", ["Major spacing", "Minor subdivisions", "Snap to grid", "Grid opacity"], ["Sparse grid", "Dense grid", "Estimate points"], "Gridlines guide reading; guide-line spacing does not redefine values.", "guide-line spacing", "cartesian"),
    52: graphSpec("Multiple Graphics Views", "Compare representations side by side.", "x = 2.0", "f(x)=sin(x)+0.25x", "Algebra, graph, table, and detail stay synchronized", ["Algebra view", "Graph view", "Table view", "Detail view"], ["Sync cursor", "2x2 layout", "same object at different scales"], "Each pane shows the same object at different scales, not a separate graph.", "same object at different scales", "table"),
    53: graphSpec("Special Points", "Find important graph features.", "(-1,0), (3,0), (1,-4)", "f(x)=x^2-2x-3; g(x)=x-1", "Roots, vertex, intercepts, and intersections", ["Roots", "y-intercept", "Vertex", "Intersections"], ["(-1, 0)", "(3, 0)", "(1, -4)"], "Special points satisfy extra conditions beyond merely lying on the curve.", "satisfy extra conditions", "equation"),
    54: graphSpec("Graph Inspector", "Read local graph properties.", "Slope at x = 1.2", "f(x)=x^3-3x", "Selected curve facts", ["Domain", "Range", "Intercepts", "Extrema"], ["Increasing", "Decreasing", "Average rate", "Concavity cue"], "The inspector reports selected graph facts for the current curve and probe.", "reports selected graph facts", "trace"),
    55: graphSpec("Dynamic Parameters", "Study function families.", "a=2, b=1.5, c=0.5", "y=a sin(bx)+c", "Sliders change amplitude, period, and midline", ["Amplitude", "Period", "Midline", "Ghost curves"], ["a slider", "b slider", "c slider", "Animate sweep"], "A parameter slider should explain how it can change a whole graph family.", "change a whole graph family", "functions"),
    56: graphSpec("Export Graph", "Reuse or share mathematical work.", "PNG / SVG / PDF", "f(x)=1/(1+e^{-x})", "Export preview with title, legend, labels, and scale", ["Export preview", "Include labels", "Scale 2x", "Copy link"], ["PNG", "SVG", "PDF", "Classroom embed"], "A useful exported graph includes axes, labels, and scale, and the exported state should match the current visual state.", "axes, labels, and scale", "functions"),
    129: graphSpec("Function Concept", "Map each input to exactly one output.", "f(2)=3.5", "f(x)=1.25x+1", "Each input has exactly one output", ["Input x", "Output f(x)", "Mapping arrow", "Machine rule"], ["Input-output table", "Vertical slice check", "single output"], "A function means each input has exactly one output.", "each input has exactly one output", "functions"),
    130: graphSpec("Domain and Range", "Find allowed inputs and produced outputs.", "Domain x >= -2", "f(x)=sqrt(x+2)", "Square-root inputs start at the endpoint", ["Domain starts", "Range rises", "Endpoint (-2,0)", "Allowed input strip"], ["Domain interval", "Range interval", "restriction check"], "For this square-root model, square-root inputs start where the radicand is nonnegative.", "square-root inputs start", "trace"),
    131: graphSpec("Function Notation", "Use notation to name a rule and input.", "f(2)=5", "f(x)=x^2+1", "f(2) means use input 2", ["Function card", "Input token 2", "Substitution slot", "Output value"], ["Evaluate f(2)", "Table row", "Graph point"], "Function notation is not multiplication; f(2) means use input 2.", "f(2) means use input 2", "table"),
    132: graphSpec("Vertical-Line Test", "Check whether a graph is a function.", "x = 1 hits twice", "circle compared with parabola", "Vertical-line test", ["Move vertical line", "One hit passes", "two hits fail", "Circle fails"], ["Function?", "Relation?", "Pass/fail card"], "If one x-value hits more than one y-value, the relation fails the Vertical-line test.", "Vertical-line test", "equation"),
    133: graphSpec("Linear Functions", "Recognise constant rate of change.", "m = 1.5", "y=1.5x+1", "Equal x-steps make equal y-changes", ["Slope triangle", "Intercept", "Equal steps", "Rate card"], ["Delta x = 2", "Delta y = 3", "Constant slope"], "Linear functions have constant rate: equal x-steps make equal y-changes.", "equal x-steps make equal y-changes", "functions"),
    134: graphSpec("Quadratic Functions", "Read vertex, symmetry, and turning point.", "Vertex (1,-2)", "y=0.75(x-1)^2-2", "Quadratic turns at a vertex", ["Axis of symmetry", "Mirror points", "Opening scale", "Vertex"], ["Minimum", "Table symmetry", "Parent y=x^2"], "A quadratic turns at a vertex and has mirror symmetry around its axis.", "turns at a vertex", "cartesian"),
    135: graphSpec("Cubic Functions", "Read inflection and opposite-end behavior.", "Inflection at (0,0)", "y=0.25x^3-x", "Origin symmetry", ["Left end down", "Right end up", "Inflection point", "S-curve"], ["End behavior", "Turning cue", "Odd symmetry"], "A basic cubic has origin symmetry when shifts are zero and bends through an inflection point.", "origin symmetry", "trace"),
    136: graphSpec("Higher-Degree Polynomials", "Connect degree, roots, turns, and end behavior.", "Four possible roots", "y=0.08(x+2)(x-1)(x-3)(x-4)", "Degree limits roots", ["Root chips", "turning points", "End behavior", "Multiplicity"], ["Sign table", "Root count", "Turn count"], "Polynomial degree limits roots and controls how many turns can appear.", "degree limits roots", "data"),
    137: graphSpec("Reciprocal Functions", "Track excluded inputs and asymptotes.", "x = 1 excluded", "y=3/(x-1)", "x=0 is excluded in the parent graph", ["Vertical asymptote", "Horizontal asymptote", "Two branches", "Excluded input"], ["Domain restriction", "Branch behavior", "Asymptote check"], "For reciprocal functions, x=0 is excluded in the parent graph and shifted exclusions create asymptotes.", "x=0 is excluded", "trace"),
    138: graphSpec("Rational Functions", "Find restrictions before interpreting branches.", "Denominator zero x=1", "y=(x+2)/(x-1)", "Denominator zeros are excluded", ["Numerator", "Denominator", "Restriction", "Asymptotes"], ["Slant behavior", "Branch table", "Hole/asymptote check"], "For rational functions, denominator zeros are excluded and shape depends on numerator behavior.", "denominator zeros are excluded", "trace"),
    139: graphSpec("Square-Root Functions", "Start at the endpoint and grow slowly.", "Endpoint (1,0)", "y=1.5sqrt(x-1)", "Real inputs need x >= 0 before shifts", ["Endpoint", "Domain ray", "Range ray", "Parent sqrt(x)"], ["Domain x >= 1", "Range y >= 0", "Radicand check"], "Square-root graphs only use inputs that make the radicand nonnegative.", "real inputs need x >= 0", "trace"),
    140: graphSpec("Cube-Root Functions", "Allow negative inputs and read the center.", "Center (0,0)", "y=2cuberoot(x)", "Negative real inputs are allowed", ["Negative inputs", "Center point", "Slow middle", "S-shape"], ["Domain all real", "Range all real", "Flattened crossing"], "Cube-root functions allow negative real inputs and pass through a center point.", "negative real inputs are allowed", "trace"),
    141: graphSpec("Absolute-Value Functions", "Understand piecewise reflection.", "Vertex (1, -2)", "f(x)=1.25|x-1|-2", "Distance makes a V-shape", ["Axis of symmetry x = 1", "Distance from vertex", "Parent y = |x|", "Piecewise form"], ["Opening scale a", "Vertex h", "Vertical shift k", "Reflection toggle"], "Absolute-value distance makes a V-shape at the vertex.", "distance makes a V-shape", "functions"),
    142: graphSpec("Exponential Functions", "Model growth and decay.", "x step outputs x2", "f(x)=1.5·2^x", "Equal x-steps multiply outputs", ["0.375", "0.75", "1.5", "3", "6"], ["Growth", "Decay", "Horizontal asymptote y = 0", "Ratio table"], "Compare ratios, not differences; equal x-steps multiply outputs.", "equal x-steps multiply outputs", "functions"),
    143: graphSpec("Logarithmic Functions", "Read domain, asymptote, and inverse reflection.", "x > 1", "y = 2log_2(x - 1) + 1", "Inputs must be positive", ["Vertical asymptote x = 1", "Domain shading", "Inverse exponential", "Value table"], ["Transformation sliders", "Diagnostics", "Domain challenge"], "For logarithmic graphs, inputs must be positive before taking the log.", "inputs must be positive", "trace"),
    144: graphSpec("Trigonometric Functions", "Link unit-circle angles to sine and cosine graphs.", "theta = pi/3", "y=2sin(x)+0.5", "Repeats with a period", ["Unit circle", "Radians", "Amplitude", "Midline"], ["Period measurement", "Identity check", "Angle trace"], "Every trigonometric graph repeats with a period because angle inputs cycle around the unit circle.", "repeats with a period", "polar"),
    145: graphSpec("Hyperbolic Functions", "Compare sinh, cosh, and tanh with exponential definitions.", "t = 1.2", "sinh(t), cosh(t), tanh(t)", "Not periodic like cosine", ["Exponential decomposition", "Unit hyperbola", "Selected t value", "Identity validation"], ["sinh", "cosh", "tanh", "Circular comparison"], "Hyperbolic functions grow like exponentials and are not periodic like cosine.", "not periodic like cosine", "functions"),
    146: graphSpec("Floor Function", "Round down to the greatest integer.", "floor(2.73)=2", "y=floor(x)", "Outputs step down to integers", ["Highlighted interval [2,3)", "Closed left endpoint", "Open right endpoint", "Discontinuity"], ["Input shift", "Output shift", "Interval table"], "Floor outputs step down to integers: the greatest integer less than or equal to the input.", "outputs step down to integers", "table"),
    147: graphSpec("Ceiling Function", "Understand upward rounding.", "ceil(2.3)=3", "y=ceil(x)", "Outputs step up to integers", ["2 < x <= 3", "Open left, closed right", "Integer landing zones", "Jump after each integer"], ["ceil(-1.2)=-1", "ceil(0)=0", "Evaluation table"], "Ceiling outputs step up to integers: the least integer greater than or equal to the input.", "outputs step up to integers", "table"),
    148: graphSpec("Sign Function", "Classify positive, zero, and negative inputs.", "sgn(-2.4)=-1", "y=sgn(x)", "Outputs are -1, 0, or 1", ["x < 0 -> -1", "x = 0 -> 0", "x > 0 -> 1", "Only the sign matters"], ["Magnitude ignored", "Threshold shift", "Live sign classifier"], "The sign function outputs are -1, 0, or 1 depending on whether the input is negative, zero, or positive.", "outputs are -1, 0, or 1", "table"),
    149: graphSpec("Piecewise Functions", "Model multiple rules on different domain regions.", "x = 1.4 active rule", "f(x)=-x-1, x^2, or 3", "Choose only the rule whose condition is true", ["x < 0", "0 <= x < 2", "x >= 2", "Boundary decides"], ["Active rule", "Switch points", "Branch visibility"], "For piecewise functions, choose only the rule whose condition is true.", "choose only the rule", "equation"),
    150: graphSpec("Composite Functions", "Follow chained mappings.", "f(g(2)) = 9", "g(x)=x+1, f(u)=u^2", "Inner output becomes the outer input", ["x -> g(x) -> f(g(x))", "g(2) = 3", "f(g(2)) = 9", "Evaluate inside first"], ["Order matters", "f(g(x))=(x+1)^2", "Composition order toggle"], "In composition, the inner output becomes the outer input.", "inner output becomes the outer input", "functions"),
    151: graphSpec("Inverse Functions", "Understand reversal of mappings.", "f^-1(5)=2", "f(x)=2x+1; f^-1(x)=(x-1)/2", "Inputs and outputs reverse", ["Reflect across y = x", "Swap input and output", "(2,5)<->(5,2)", "One-to-one"], ["Composition returns the start", "Horizontal-line test", "Domain restriction"], "Inverse functions make inputs and outputs reverse, reflecting across y=x when both are functions.", "inputs and outputs reverse", "functions"),
    152: graphSpec("Even and Odd Functions", "Recognise symmetry by testing x and -x.", "f(2) and f(-2)", "x^2, x^3, or x^2+x", "f(-x)=f(x)", ["Even: f(-x)=f(x)", "Odd: f(-x)=-f(x)", "Mirror over y-axis", "Rotate around origin"], ["Test x and -x", "Verdict: even", "Symmetry overlay"], "Even functions satisfy f(-x)=f(x), while odd functions rotate through the origin.", "f(-x)=f(x)", "functions"),
    153: graphSpec("Increasing and Decreasing", "Identify monotonic intervals.", "f'(x): + | 0 | - | 0 | +", "cubic with local max and min", "Read increasing or decreasing from left to right", ["Increasing", "Decreasing", "Local maximum", "Local minimum"], ["f'(x) > 0", "f'(x) < 0", "Interval notation"], "Read increasing or decreasing from left to right, not from the y-axis alone.", "read increasing or decreasing", "trace"),
    154: graphSpec("Periodic Functions", "Understand repeating behaviour.", "Period T = pi", "f(x)=1.5sin(2x)+0.5", "Repeats after a fixed period", ["f(x + T) = f(x)", "Matching points", "Cycle repeats", "Amplitude"], ["Midline", "Period finder", "Repeated cycle shading"], "A periodic function repeats after a fixed period or horizontal interval.", "repeats after a fixed period", "functions"),
    155: graphSpec("Recursive Functions", "Generate iterative values.", "a0=1", "a(n+1)=1.4a(n)+0.5", "Depends on an earlier value", ["Previous term", "Next term", "Seed value", "Step table"], ["Growth factor", "Add-on", "Cobweb mini panel"], "A recursive rule depends on an earlier value to build the next value.", "depends on an earlier value", "data"),
    156: graphSpec("Vertical Translation", "Understand f(x)+k.", "k = 2", "g(x)=f(x)+2", "Outside addition moves every output", ["Move up 2", "Same x-values", "Every y-value +2", "Vertex: (0,0) -> (0,2)"], ["Vertical shift k", "Parent visibility", "Sample x"], "An outside addition moves every output up or down by the same amount.", "outside addition moves", "cartesian"),
    157: graphSpec("Horizontal Translation", "Understand f(x-h).", "h = 2", "g(x)=f(x-2)", "Inside subtraction moves the graph horizontally", ["Move right 2", "Same y-levels", "Input changes first", "Vertex: (0,0) -> (2,0)"], ["Horizontal shift h", "Parent visibility", "Input remapping"], "An inside subtraction moves the graph horizontally by changing the input before the function acts.", "inside subtraction moves", "cartesian"),
    158: graphSpec("Vertical Stretch and Compression", "Understand af(x).", "a = 1.8", "g(x)=1.8f(x)", "Outside multiplication changes height", ["x fixed", "Every y-value x1.8", "Stretch away from x-axis", "Compression when 0<a<1"], ["Vertical scale a", "Compression/stretch toggle", "Point table"], "Outside multiplication changes height by scaling every y-value.", "outside multiplication changes height", "cartesian"),
    159: graphSpec("Horizontal Stretch and Compression", "Understand f(bx).", "b = 0.7", "g(x)=f(0.7x)", "Inside multiplication changes width", ["Horizontal distances scale inversely", "Width x 1/0.7", "Same y-levels", "Input changes first"], ["Inside scale b", "Stretch/compression toggle", "Sample y-level"], "Inside multiplication changes width before outputs are computed.", "inside multiplication changes width", "cartesian"),
    160: graphSpec("Reflection in x-Axis", "Understand -f(x).", "(2,4)->(2,-4)", "g(x)=-f(x)", "Changes y to -y", ["Mirror across x-axis", "x unchanged", "y -> -y", "Up becomes down"], ["Reflection scale", "Vertical shift", "Point-pair table"], "Reflection in the x-axis changes y to -y for every point.", "changes y to -y", "cartesian"),
    161: graphSpec("Reflection in y-Axis", "Understand f(-x).", "(-2,-8)<->(2,-8)", "g(x)=f(-x)", "Changes x to -x", ["Mirror across y-axis", "x -> -x", "y unchanged", "Left and right swap"], ["Input sign flips first", "Pre-shift", "Point-pair table"], "Reflection in the y-axis changes x to -x for every point.", "changes x to -x", "cartesian"),
    162: graphSpec("Combined Transformations", "Track inside and outside changes.", "vertex (2,-1)", "y=a(x-h)^2+k", "Inside changes affect x before outside changes affect y", ["Parent y=x^2", "Intermediate curve", "Final transformed curve", "Tracked sample point"], ["a, h, k controls", "Transformation chips", "Vertex feedback"], "For combined transformations, inside changes affect x before outside changes affect y.", "inside changes affect x", "cartesian"),
    163: graphSpec("Transformation Order", "Compare two transformation pipelines.", "same steps, different order", "shift, scale, then reflect", "Later transformations act on the graph already produced", ["Pipeline A", "Pipeline B", "Before/after graph", "Non-commutativity"], ["Order chips", "Reset", "Challenge"], "Order matters because later transformations act on the graph already produced.", "later transformations act", "cartesian"),
    164: graphSpec("Parameter Explorer", "Change one parameter and name its effect.", "a=2, h=1, k=-1", "y=a(x-h)^2+k", "Sliders change the graph family", ["Parent vs transformed", "Vertex readout", "Parameter effect cards", "Live equation"], ["a slider", "h slider", "k slider", "Effect summary"], "For parameterised functions, sliders change the graph family one cause at a time.", "sliders change the graph family", "cartesian"),
    165: graphSpec("Parent Function Library", "Identify base shapes before transformations.", "parent y=x^2", "select a parent function", "Simplest rule shows the base shape", ["Linear", "Quadratic", "Absolute value", "Square root"], ["Domain/range cards", "Key points", "Family comparison"], "A parent function is the simplest rule showing the base shape before transformations.", "simplest rule shows", "functions"),
    166: graphSpec("Graph Matching", "Match transformed equations to graphs.", "score 3/4", "candidate transformed graphs", "Shape plus more than one point", ["Equation cards", "Graph targets", "Structural hints", "Check match"], ["Score panel", "Reset", "Try next"], "Graph matching uses shape plus more than one point to identify the rule.", "shape plus more than one point", "functions"),
  };
  return specs[lessonId] ?? specs[39];
}

function graphSpec(title: string, purpose: string, value: string, equation: string, focus: string, left: string[], right: string[], warning: string, testSnippet: string, visual: GraphSpec["visual"]): GraphSpec {
  return { title, purpose, value, equation, focus, left, right, warning, testSnippet, visual };
}

function renderGraphVisual(spec: GraphSpec, probe: number, showHelper: boolean) {
  const x = 70 + probe * 4;
  return (
    <svg viewBox="0 0 560 360" className="w-full rounded-3xl bg-white ring-1 ring-slate-200" role="img" aria-label={`${spec.title} graph visual`}>
      <defs>
        <pattern id={`graph-grid-${spec.visual}`} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#e2e8f0" /></pattern>
      </defs>
      <rect width="560" height="360" fill={`url(#graph-grid-${spec.visual})`} />
      <line x1="46" y1="285" x2="520" y2="285" stroke="#334155" strokeWidth="2" />
      <line x1="280" y1="35" x2="280" y2="325" stroke="#334155" strokeWidth="2" />
      {graphShape(spec.visual)}
      {showHelper ? <><line x1={x} y1="52" x2={x} y2="305" stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 6" /><circle cx={x} cy={pointY(spec.visual, probe)} r="13" fill="#7c3aed" /><text x={Math.min(430, x + 14)} y={pointY(spec.visual, probe) - 10} fontWeight="900">{spec.value}</text></> : null}
      <text x="54" y="42" fill="#0f172a" fontWeight="900">{spec.focus}</text>
    </svg>
  );
}

function graphShape(visual: GraphSpec["visual"]) {
  if (visual === "functions") return <><polyline points="65,270 120,236 175,190 230,128 285,80 340,128 395,190 450,236 505,270" fill="none" stroke="#14b8a6" strokeWidth="4" /><line x1="65" y1="255" x2="505" y2="120" stroke="#7c3aed" strokeWidth="4" /><path d="M65 210 C145 110 230 290 305 180 S430 90 505 205" fill="none" stroke="#f97316" strokeWidth="4" /></>;
  if (visual === "equation") return <><ellipse cx="250" cy="185" rx="150" ry="82" fill="none" stroke="#14b8a6" strokeWidth="5" /><circle cx="280" cy="185" r="110" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 6" /><line x1="88" y1="282" x2="495" y2="75" stroke="#7c3aed" strokeWidth="4" /></>;
  if (visual === "inequality") return <><polygon points="70,285 505,285 505,118 70,255" fill="#bae6fd" opacity=".75" /><polygon points="70,100 505,250 505,70 70,70" fill="#ddd6fe" opacity=".75" /><polygon points="246,188 505,118 505,250" fill="#5eead4" opacity=".8" /><line x1="70" y1="255" x2="505" y2="118" stroke="#0ea5e9" strokeWidth="4" /><line x1="70" y1="100" x2="505" y2="250" stroke="#7c3aed" strokeWidth="4" strokeDasharray="8 6" /></>;
  if (visual === "parametric") return <><ellipse cx="280" cy="180" rx="170" ry="95" fill="none" stroke="#14b8a6" strokeWidth="5" /><path d="M92 180 C170 55 270 310 360 88 S480 258 500 178" fill="none" stroke="#fb923c" strokeWidth="3" opacity=".55" /></>;
  if (visual === "polar") return <><circle cx="280" cy="180" r="40" fill="none" stroke="#cbd5e1" /><circle cx="280" cy="180" r="80" fill="none" stroke="#cbd5e1" /><circle cx="280" cy="180" r="120" fill="none" stroke="#cbd5e1" /><path d="M280 180 C250 70 190 80 220 170 C130 185 150 255 260 215 C285 320 355 275 320 195 C430 170 390 95 305 155 Z" fill="none" stroke="#14b8a6" strokeWidth="5" /><line x1="280" y1="180" x2="410" y2="70" stroke="#f59e0b" strokeWidth="4" /></>;
  if (visual === "points") return <><polyline points="185,220 230,160 330,185 430,90 475,285" fill="none" stroke="#94a3b8" strokeWidth="3" strokeDasharray="8 6" />{[[185,220,"A(-2, 1)"],[230,160,"B(-1, 3)"],[330,185,"C(1, 2)"],[430,90,"D(3, 5)"],[475,285,"E(4, 0)"]].map(([cx, cy, label]) => <g key={label}><circle cx={cx} cy={cy} r="10" fill={label === "C(1, 2)" ? "#f59e0b" : "#14b8a6"} /><text x={Number(cx) + 8} y={Number(cy) - 8} fontWeight="900">{label}</text></g>)}</>;
  if (visual === "data") return <><line x1="85" y1="280" x2="500" y2="82" stroke="#7c3aed" strokeWidth="4" />{[[90,260],[130,230],[170,214],[205,190],[245,176],[285,150],[325,137],[365,110],[405,96],[445,78],[305,250]].map(([cx, cy], index) => <g key={`${cx}-${cy}`}><line x1={cx} y1={cy} x2={cx} y2={290 - Number(cx) * .42} stroke="#94a3b8" /><circle cx={cx} cy={cy} r="8" fill={index === 10 ? "#f59e0b" : "#14b8a6"} /></g>)}</>;
  if (visual === "table" || visual === "cartesian") return <><polyline points="100,80 145,155 190,215 235,260 280,285 325,260 370,215 415,155 460,80" fill="none" stroke="#14b8a6" strokeWidth="5" /><circle cx="370" cy="215" r="12" fill="#f59e0b" /><text x="384" y="210" fontWeight="900">x = 3, f(x) = 0</text></>;
  return <><path d="M65 252 C145 210 190 122 260 152 S355 260 505 92" fill="none" stroke="#14b8a6" strokeWidth="5" /><line x1="260" y1="150" x2="440" y2="70" stroke="#f59e0b" strokeWidth="4" /></>;
}

function pointY(visual: GraphSpec["visual"], probe: number) {
  if (visual === "points") return 185;
  if (visual === "data") return 280 - probe * 1.7;
  if (visual === "parametric" || visual === "polar") return 180;
  return 250 - Math.sin(probe / 18) * 58 - probe * .7;
}

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock3,
  CheckCircle2,
  ExternalLink,
  Eye,
  Hand,
  Lightbulb,
  RotateCcw,
  Share2,
  Target,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import SliderControl from "../../../components/ui/SliderControl";
import {
  computeTrigFormulaValues,
  formatTrigNumber,
} from "../../../trigonometry/utils/trigFormulaUtils";
import type { LessonAdapterProps } from "../types";
import AngleMeasurementTargetLesson257 from "./AngleMeasurementTargetLesson257";

type TrigKind =
  "circle" | "graph" | "triangle" | "equation" | "application" | "polar";

type TrigSpec = {
  mockup: string;
  id: number;
  title: string;
  subtitle: string;
  kind: TrigKind;
  accent: string;
  formula: string;
  modelTitle: string;
  controlLabels: [string, string, string, string];
  steps: [string, string, string, string];
  rule: string;
  example: string;
  misconception: string;
  practice: string;
};

const trigSpecs: TrigSpec[] = [
  t(
    "0314",
    257,
    "Angle Measurement",
    "Convert angle units. Understand degrees and radians using the unit circle.",
    "circle",
    "#0ea5e9",
    "360 degrees = 2 pi rad",
    "Dual degree-radian explorer",
    ["Degrees", "Radians", "Protractor", "Snap"],
    [
      "Angles are measured from the positive x-axis.",
      "Drag the ray or use the protractor slider.",
      "Degrees and radians change together.",
      "A full turn is 360 degrees or 2 pi radians.",
    ],
    "theta(rad) = theta(deg) x pi / 180",
    "135 degrees = 3pi/4 rad, so its reference angle is 45 degrees.",
    "Thinking degrees and radians are different kinds of angles.",
    "What is the radian measure of 45 degrees?",
  ),
  t(
    "0315",
    258,
    "Unit Circle",
    "Derive trig values geometrically.",
    "circle",
    "#2563eb",
    "(x, y) = (cos theta, sin theta)",
    "Unit-circle coordinate lab",
    ["Angle theta", "Radius", "Quadrant", "Trace"],
    [
      "Read coordinates on the circle.",
      "Rotate the point.",
      "Signs change by quadrant.",
      "Cosine is x and sine is y.",
    ],
    "cos^2 theta + sin^2 theta = 1",
    "At 60 degrees, (cos theta, sin theta) = (0.500, 0.866).",
    "Swapping sine and cosine coordinates.",
    "Choose the quadrant where sine is positive and cosine is negative.",
  ),
  t(
    "0316",
    259,
    "Right-Triangle Ratios",
    "Understand SOH-CAH-TOA.",
    "triangle",
    "#06b6d4",
    "sin theta = opposite / hypotenuse",
    "Right-triangle ratio model",
    ["Angle", "Hypotenuse", "Opposite", "Adjacent"],
    [
      "Choose the marked angle.",
      "Drag triangle dimensions.",
      "Compare side ratios.",
      "Same angle means same ratios.",
    ],
    "SOH-CAH-TOA",
    "For theta = 60 degrees and hypotenuse 10, opposite is about 8.66.",
    "Labelling opposite and adjacent from the wrong angle.",
    "Find tan theta when opposite is 6 and adjacent is 8.",
  ),
  t(
    "0317",
    260,
    "Exact Trig Values",
    "Derive standard values.",
    "circle",
    "#7c3aed",
    "sin 30 = 1/2, cos 60 = 1/2",
    "Special-angle exact value table",
    ["0", "30", "45", "60"],
    [
      "Build special triangles.",
      "Snap to known angles.",
      "Notice surd patterns.",
      "Use exact values before decimals.",
    ],
    "30-60-90 and 45-45-90 triangles generate the table.",
    "sin 45 degrees = sqrt(2)/2.",
    "Rounding exact values too early.",
    "Which exact value equals cos 30 degrees?",
  ),
  t(
    "0318",
    261,
    "Sine Graph",
    "Explore periodic shape.",
    "graph",
    "#db2777",
    "y = A sin(B(x - C)) + D",
    "Sine graph: unit-circle to y = sin x",
    ["Amplitude A", "Period factor B", "Phase shift C", "Vertical shift D"],
    [
      "A radius at angle theta has vertical height sin theta.",
      "Adjust A, B, C, and D.",
      "The graph repeats smoothly.",
      "Sine starts at 0 and increases.",
    ],
    "Period T = 2pi / |B|",
    "y = 2 sin(1/2(x - pi/3)) + 1 has period 4pi.",
    "Confusing sine with cosine start values.",
    "Set parameters for y = 1.5 sin(2x + pi/2) - 0.5.",
  ),
  t(
    "0319",
    262,
    "Cosine Graph",
    "Explore phase-shifted periodic shape.",
    "graph",
    "#2563eb",
    "y = A cos(B(x - C)) + D",
    "Cosine graph transformation lab",
    ["Amplitude A", "Period factor B", "Phase shift C", "Vertical shift D"],
    [
      "Cosine reads the horizontal coordinate.",
      "Manipulate graph sliders.",
      "Compare with sine.",
      "Cosine starts at 1 when x = 0.",
    ],
    "cos x = sin(x + pi/2)",
    "y = 3 cos(2x) has amplitude 3 and period pi.",
    "Expecting cosine to start at zero.",
    "Find the period of y = cos(4x).",
  ),
  t(
    "0320",
    263,
    "Tangent Graph",
    "Understand period and asymptotes.",
    "graph",
    "#f97316",
    "tan theta = sin theta / cos theta",
    "Tangent graph and asymptote lab",
    ["Scale", "Stretch", "Asymptotes", "Ratio"],
    [
      "Track the tangent ratio.",
      "Move through each branch.",
      "Notice undefined angles.",
      "Asymptotes occur when cosine is zero.",
    ],
    "tan(x + pi) = tan x",
    "tan 45 degrees = 1 because opposite equals adjacent.",
    "Treating vertical asymptotes as graph crossings.",
    "Where is tan theta undefined in one full turn?",
  ),
  t(
    "0321",
    264,
    "Reciprocal Trig Functions",
    "Explore sec, cosec and cot.",
    "graph",
    "#0f766e",
    "sec x = 1/cos x, cosec x = 1/sin x",
    "Reciprocal graph comparer",
    ["Function", "Scale", "Frequency", "Envelope"],
    [
      "Start with sine and cosine.",
      "Flip non-zero values.",
      "Watch undefined points.",
      "Reciprocal graphs inherit asymptotes.",
    ],
    "cot x = 1 / tan x",
    "sec 60 degrees = 2 because cos 60 degrees = 1/2.",
    "Taking reciprocals at zero values.",
    "Find csc 30 degrees.",
  ),
  t(
    "0322",
    265,
    "Inverse Trig Functions",
    "Understand restricted inverses.",
    "graph",
    "#8b5cf6",
    "sin^-1(r) = theta means sin theta = r",
    "Inverse trig reflection lab",
    ["Ratio r", "Function", "Principal range", "Reflect"],
    [
      "Restrict the original graph.",
      "Reflect across y = x.",
      "Read the principal value.",
      "Equations may need extra angles.",
    ],
    "asin returns values in [-pi/2, pi/2]",
    "asin(0.5) = 30 degrees.",
    "Assuming inverse trig returns every solution.",
    "What is arccos(1/2)?",
  ),
  t(
    "0323",
    266,
    "Trig Identities",
    "Verify equivalent expressions.",
    "equation",
    "#16a34a",
    "sin^2 theta + cos^2 theta = 1",
    "Identity verification lab",
    ["Expression A", "Expression B", "Angle", "Overlay"],
    [
      "Compare two expressions.",
      "Move theta through a full turn.",
      "Look for exact overlap.",
      "An identity is true for all allowed values.",
    ],
    "One checked angle does not prove an identity.",
    "tan theta cos theta simplifies to sin theta.",
    "Proving an identity by one numerical example.",
    "Verify 1 - cos^2 theta = sin^2 theta.",
  ),
  t(
    "0324",
    267,
    "Compound-Angle Formulae",
    "Understand sum and difference identities.",
    "equation",
    "#0891b2",
    "sin(A+B)=sin A cos B + cos A sin B",
    "Compound-angle builder",
    ["Angle A", "Angle B", "Sum", "Difference"],
    [
      "Place two rotations.",
      "Combine the angles.",
      "Compare expanded products.",
      "Use the full addition formula.",
    ],
    "cos(A+B)=cos A cos B - sin A sin B",
    "sin 75 degrees = sin45 cos30 + cos45 sin30.",
    "Writing sin(A+B) as sin A + sin B.",
    "Build sin(30 degrees + 45 degrees).",
  ),
  t(
    "0325",
    268,
    "Double- and Half-Angle Formulae",
    "Explore derived identities.",
    "equation",
    "#9333ea",
    "sin 2A = 2 sin A cos A",
    "Double and half angle explorer",
    ["Angle A", "2A", "A/2", "Identity"],
    [
      "Start with one angle.",
      "Double or halve it.",
      "Compare equivalent formulas.",
      "Signs depend on quadrant.",
    ],
    "cos 2A = cos^2 A - sin^2 A",
    "If A = 45 degrees, sin 2A = 1.",
    "Doubling the sine value instead of the angle.",
    "Find cos 2A when sin A = 3/5 and A is acute.",
  ),
  t(
    "0326",
    269,
    "Trig Equations",
    "Find interval and general solutions.",
    "equation",
    "#2563eb",
    "sin x = k",
    "Trig equation solution finder",
    ["Equation", "Interval", "Reference angle", "Solutions"],
    [
      "Plot both sides.",
      "Find intersection points.",
      "Use quadrant symmetry.",
      "Add periods for general solutions.",
    ],
    "For sin x = a, x = alpha or pi - alpha plus 2kpi.",
    "sin x = 1/2 on [0, 2pi] gives pi/6 and 5pi/6.",
    "Forgetting repeated solutions.",
    "Solve cos x = 0 on [0, 2pi].",
  ),
  t(
    "0327",
    270,
    "Sine Rule",
    "Solve oblique triangles.",
    "triangle",
    "#06b6d4",
    "a/sin A = b/sin B = c/sin C",
    "Sine Rule triangle explorer",
    ["Drag vertices", "Side a", "Angle A", "SSA c"],
    [
      "See triangle ratios change.",
      "Drag vertices or change values.",
      "Look for equal sine ratios.",
      "Apply the Sine Rule with confidence.",
    ],
    "a/sin A = 2R",
    "Given a=10, b=7, A=45 degrees, find B then C then c.",
    "SSA can have zero, one, or two possible triangles.",
    "Find a missing side using a known opposite angle pair.",
  ),
  t(
    "0328",
    271,
    "Cosine Rule",
    "Relate three sides and angles.",
    "triangle",
    "#7c3aed",
    "c^2 = a^2 + b^2 - 2ab cos C",
    "Cosine Rule triangle solver",
    ["Side a", "Side b", "Included angle", "Side c"],
    [
      "Use a non-right triangle.",
      "Adjust sides and included angle.",
      "Notice Pythagoras when C=90 degrees.",
      "Solve SAS or SSS cases.",
    ],
    "Cosine Rule extends Pythagoras.",
    "If a=7, b=9, C=60 degrees, c^2=49+81-126cos60.",
    "Using the Sine Rule when no opposite pair is known.",
    "Find c for a=5, b=8, C=60 degrees.",
  ),
  t(
    "0329",
    272,
    "Triangle Area Formula",
    "Use one-half ab sin C.",
    "triangle",
    "#0ea5e9",
    "Area = 1/2 ab sin C",
    "Included-angle area lab",
    ["Side a", "Side b", "Angle C", "Height"],
    [
      "Choose two sides.",
      "Open the included angle.",
      "Height is b sin C.",
      "Area uses the included angle.",
    ],
    "Area = base x height / 2",
    "Area for a=10, b=6, C=30 degrees is 15.",
    "Using a non-included angle in the formula.",
    "Calculate area when a=8, b=5, C=60 degrees.",
  ),
  t(
    "0330",
    273,
    "Bearings",
    "Apply direction conventions.",
    "application",
    "#0284c7",
    "Bearing is measured clockwise from north",
    "Bearing and route vector lab",
    ["Bearing", "Distance", "North line", "Route"],
    [
      "Start at north.",
      "Rotate clockwise.",
      "Draw the route vector.",
      "Write bearings with three digits.",
    ],
    "East is 090 degrees, south is 180 degrees.",
    "A bearing of 060 degrees points northeast.",
    "Measuring bearings from east like ordinary graph angles.",
    "Draw a route with bearing 125 degrees.",
  ),
  t(
    "0331",
    274,
    "Elevation and Depression",
    "Model heights and distances.",
    "application",
    "#dc2626",
    "tan theta = height / distance",
    "Line-of-sight height model",
    ["Angle", "Distance", "Height", "Eye level"],
    [
      "Draw the horizontal line.",
      "Aim up or down.",
      "Build the right triangle.",
      "Choose the tangent ratio.",
    ],
    "Elevation rises from the horizontal; depression falls from it.",
    "If tan 30 degrees = h/20, then h is about 11.55.",
    "Measuring from the vertical instead of horizontal.",
    "Find height from distance 40 m and elevation 35 degrees.",
  ),
  t(
    "0332",
    275,
    "Harmonic Motion",
    "Connect trigonometry to waves.",
    "graph",
    "#db2777",
    "x(t) = A sin(omega t + phi)",
    "Harmonic motion wave lab",
    ["Amplitude", "Frequency", "Phase", "Midline"],
    [
      "Track circular motion.",
      "Unfold displacement into a wave.",
      "Adjust amplitude and frequency.",
      "Motion repeats periodically.",
    ],
    "Period = 2pi / omega",
    "Doubling amplitude doubles maximum displacement.",
    "Confusing amplitude with peak-to-peak height.",
    "Find period when omega = 4.",
  ),
  t(
    "0333",
    276,
    "Polar Trigonometry",
    "Connect polar coordinates and trig.",
    "polar",
    "#0891b2",
    "x = r cos theta, y = r sin theta",
    "Polar coordinate point",
    ["r radius", "theta angle", "Polar grid", "Trace curve"],
    [
      "Notice r and theta locate a point.",
      "Drag the point or adjust sliders.",
      "Watch x and y change.",
      "Every polar point converts to Cartesian coordinates.",
    ],
    "r = sqrt(x^2+y^2), theta = atan2(y,x)",
    "For (r, theta)=(2,45 degrees), x=y=sqrt(2).",
    "Ignoring the sign of r.",
    "Convert (3, -60 degrees) to Cartesian coordinates.",
  ),
];

export default function TrigonometryLessonAdapter({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  if (lesson.id === 257) {
    return (
      <AngleMeasurementTargetLesson257
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  if (lesson.id === 259) {
    return (
      <RightTriangleRatiosTargetLesson
        lesson={lesson}
        resetToken={resetToken}
        onInteraction={onInteraction}
      />
    );
  }
  return (
    <GenericTrigonometryLessonAdapter
      lesson={lesson}
      resetToken={resetToken}
      onInteraction={onInteraction}
    />
  );
}

function GenericTrigonometryLessonAdapter({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const spec = trigSpecs.find((item) => item.id === lesson.id) ?? trigSpecs[0];
  const initialAngle = [30, 45, 60][lesson.id % 3];
  const [angle, setAngle] = useState(initialAngle);
  const [amplitude, setAmplitude] = useState(spec.kind === "graph" ? 1.5 : 1);
  const [frequency, setFrequency] = useState(spec.kind === "graph" ? 2 : 1);
  const [phase, setPhase] = useState(0);
  const [radius, setRadius] = useState(spec.kind === "polar" ? 1.732 : 1);

  useEffect(() => {
    setAngle(initialAngle);
    setAmplitude(spec.kind === "graph" ? 1.5 : 1);
    setFrequency(spec.kind === "graph" ? 2 : 1);
    setPhase(0);
    setRadius(spec.kind === "polar" ? 1.732 : 1);
  }, [initialAngle, resetToken, spec.kind]);

  const values = computeTrigFormulaValues(angle);
  const radiansLabel = values.radiansLabel.replace("π", "pi");
  const notify = () => onInteraction();
  const updateAngle = (value: number) => {
    setAngle(Math.max(-360, Math.min(360, Math.round(value))));
    notify();
  };
  const updateFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    if (event.type === "pointerdown")
      event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 420;
    const y = ((event.clientY - rect.top) / rect.height) * 360;
    updateAngle((Math.atan2(180 - y, x - 210) * 180) / Math.PI);
  };

  return (
    <section
      className="space-y-3"
      data-testid={`trigonometry-mockup-${spec.mockup}`}
      data-target-family="trigonometry"
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid divide-y divide-slate-200 lg:grid-cols-4 lg:divide-x lg:divide-y-0">
          {spec.steps.map((step, index) => (
            <article key={step} className="flex min-h-[118px] gap-4 p-4">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white"
                style={{
                  background:
                    index === 0
                      ? "#0ea5e9"
                      : index === 1
                        ? "#4f46e5"
                        : index === 2
                          ? "#0f766e"
                          : "#7c3aed",
                }}
              >
                {index + 1}
              </span>
              <div>
                <p
                  className="text-[10px] font-black uppercase tracking-wide"
                  style={{
                    color:
                      index === 0
                        ? "#0369a1"
                        : index === 1
                          ? "#4338ca"
                          : index === 2
                            ? "#0f766e"
                            : "#6d28d9",
                  }}
                >
                  {["Observe", "Manipulate", "Notice", "Understand"][index]}
                </p>
                <p className="mt-1 text-sm font-semibold leading-5 text-slate-700">
                  {step}
                </p>
              </div>
              {index < 3 ? (
                <ArrowRight className="ml-auto mt-8 hidden h-7 w-7 text-slate-400 lg:block" />
              ) : null}
            </article>
          ))}
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-wide"
              style={{ color: spec.accent }}
            >
              {spec.kind === "circle"
                ? "Dual explorer"
                : spec.kind === "polar"
                  ? "Interaction + visualization"
                  : "Explore the model"}
            </p>
            <h2 className="text-xl font-black text-slate-950">
              {spec.modelTitle}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-emerald-50 px-3 text-xs font-black text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Everything is in sync
            </span>
            <button
              type="button"
              className="inline-flex min-h-8 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
              onClick={() => {
                setAngle(initialAngle);
                notify();
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Restore defaults
            </button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_330px]">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            {spec.kind === "triangle" ? (
              <TriangleModel spec={spec} angle={angle} />
            ) : spec.kind === "application" ? (
              <ApplicationModel spec={spec} angle={angle} />
            ) : spec.kind === "polar" ? (
              <PolarModel
                spec={spec}
                angle={angle}
                radius={radius}
                onPointer={updateFromPointer}
              />
            ) : (
              <CircleGraphModel
                spec={spec}
                angle={angle}
                values={values}
                amplitude={amplitude}
                frequency={frequency}
                phase={phase}
                onPointer={updateFromPointer}
              />
            )}
          </div>

          <aside className="space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-[10px] font-black uppercase tracking-wide text-blue-700">
                Controls
              </p>
              <div className="mt-3 grid grid-cols-2 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-center text-sm font-black">
                <button
                  type="button"
                  className="rounded-lg bg-blue-600 py-2 text-white"
                >
                  Degrees
                </button>
                <button
                  type="button"
                  className="rounded-lg py-2 text-slate-600"
                >
                  Radians
                </button>
              </div>
              <div className="mt-4 text-center">
                <strong className="block text-4xl font-black text-slate-950">
                  {Math.abs(angle)} degrees
                </strong>
                <span className="mt-1 block text-lg font-black text-slate-700">
                  = {radiansLabel} rad
                </span>
              </div>
              <SliderControl
                density="compact"
                label={spec.controlLabels[0]}
                value={angle}
                min={-360}
                max={360}
                step={1}
                unit="degrees"
                onChange={updateAngle}
              />
              {spec.kind === "graph" ? (
                <div className="mt-3 grid gap-3">
                  <SliderControl
                    density="compact"
                    label={spec.controlLabels[1]}
                    value={frequency}
                    min={0.25}
                    max={4}
                    step={0.25}
                    onChange={(value) => {
                      setFrequency(value);
                      notify();
                    }}
                  />
                  <SliderControl
                    density="compact"
                    label={spec.controlLabels[2]}
                    value={phase}
                    min={-3.14}
                    max={3.14}
                    step={0.1}
                    onChange={(value) => {
                      setPhase(value);
                      notify();
                    }}
                  />
                </div>
              ) : spec.kind === "polar" ? (
                <SliderControl
                  density="compact"
                  label={spec.controlLabels[0]}
                  value={radius}
                  min={-3}
                  max={3}
                  step={0.1}
                  onChange={(value) => {
                    setRadius(value);
                    notify();
                  }}
                />
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Metric label="sin theta" value={formatTrigNumber(values.sin)} />
              <Metric label="cos theta" value={formatTrigNumber(values.cos)} />
              <Metric
                label="tan theta"
                value={
                  values.tan === null
                    ? "undefined"
                    : formatTrigNumber(values.tan)
                }
              />
              <Metric
                label="(cos, sin)"
                value={`(${formatTrigNumber(values.cos)}, ${formatTrigNumber(values.sin)})`}
              />
            </div>
          </aside>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {spec.controlLabels.map((label, index) => (
            <button
              key={label}
              type="button"
              className={
                index === 0
                  ? "min-h-10 rounded-xl bg-blue-600 px-3 text-xs font-black text-white"
                  : "min-h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-black text-slate-700"
              }
              onClick={notify}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">
          Current values
        </p>
        <div className="mt-2 grid overflow-hidden rounded-xl border border-slate-200 bg-white text-center sm:grid-cols-5">
          <ValueCell label="theta degrees" value={`${angle} degrees`} />
          <ValueCell label="theta radians" value={radiansLabel} />
          <ValueCell label="cos theta" value={formatTrigNumber(values.cos)} />
          <ValueCell label="sin theta" value={formatTrigNumber(values.sin)} />
          <ValueCell
            label="tan theta"
            value={
              values.tan === null ? "undefined" : formatTrigNumber(values.tan)
            }
          />
        </div>
        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
          Domains: theta in real numbers | Ranges: -1 &lt;= sin theta &lt;= 1 |
          -1 &lt;= cos theta &lt;= 1 | tan theta undefined at pi/2 + kpi
        </div>
      </section>

      <div className="grid gap-3 lg:grid-cols-3">
        <InfoCard
          icon={<BookOpen className="h-4 w-4" />}
          tone="green"
          title="Rule & formula"
          body={spec.rule}
          formula={spec.formula}
        />
        <InfoCard
          icon={<Lightbulb className="h-4 w-4" />}
          tone="blue"
          title="Worked example"
          body={spec.example}
          formula={spec.formula}
        />
        <InfoCard
          icon={<AlertTriangle className="h-4 w-4" />}
          tone="red"
          title="Common misconception"
          body={spec.misconception}
          formula="Check units, quadrant, and domain restrictions."
        />
      </div>

      <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-black text-blue-700">Quick practice</p>
            <span className="text-xs font-black text-slate-500">1 of 4</span>
          </div>
          <p className="mt-2 text-sm font-semibold text-slate-700">
            {spec.practice}
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-4">
            {["A", "B", "C", "D"].map((choice, index) => (
              <button
                key={choice}
                type="button"
                onClick={notify}
                className={
                  index === 2
                    ? "min-h-12 rounded-xl border border-emerald-300 bg-emerald-50 text-sm font-black text-emerald-800"
                    : "min-h-12 rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700"
                }
              >
                {choice}
              </button>
            ))}
          </div>
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-black text-emerald-800">
            <CheckCircle2 className="mr-2 inline h-4 w-4" />
            Correct. The model and formula agree.
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-wide text-cyan-700">
            Keyboard shortcuts
          </p>
          <dl className="mt-3 grid grid-cols-[70px_1fr] gap-y-2 text-xs font-bold text-slate-600">
            <dt>Drag</dt>
            <dd>Move angle</dd>
            <dt>Arrows</dt>
            <dd>Fine adjust</dd>
            <dt>R</dt>
            <dd>Reset angle</dd>
            <dt>S</dt>
            <dd>Snap to special angle</dd>
          </dl>
        </div>
      </section>
    </section>
  );
}

function RightTriangleRatiosTargetLesson({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [angle, setAngle] = useState(45);
  const [snap, setSnap] = useState(true);
  const [answers, setAnswers] = useState({
    opposite: "",
    hypotenuse: "",
    sin: "",
    cos: "",
    tan: "",
  });
  const [practiceResult, setPracticeResult] = useState<
    "idle" | "correct" | "incorrect"
  >("idle");
  const adjacent = 3;
  const radians = (angle * Math.PI) / 180;
  const opposite = adjacent * Math.tan(radians);
  const hypotenuse = adjacent / Math.cos(radians);
  const sin = Math.sin(radians);
  const cos = Math.cos(radians);
  const tan = Math.tan(radians);

  useEffect(() => {
    setAngle(45);
    setSnap(true);
    setAnswers({ opposite: "", hypotenuse: "", sin: "", cos: "", tan: "" });
    setPracticeResult("idle");
  }, [resetToken]);

  const updateAngle = (next: number) => {
    const limited = Math.max(5, Math.min(85, next));
    const specialAngles = [15, 30, 45, 60, 75];
    const snapped = snap
      ? specialAngles.reduce(
          (best, value) =>
            Math.abs(value - limited) < Math.abs(best - limited) ? value : best,
          specialAngles[0],
        )
      : limited;
    setAngle(Math.round(snapped));
    onInteraction();
  };
  const dragPointC = (event: PointerEvent<SVGSVGElement>) => {
    if (event.type === "pointermove" && event.buttons !== 1) return;
    if (event.type === "pointerdown")
      event.currentTarget.setPointerCapture?.(event.pointerId);
    const rect = event.currentTarget.getBoundingClientRect();
    const svgY = ((event.clientY - rect.top) / rect.height) * 430;
    const graphHeight = Math.max(24, Math.min(238, 330 - svgY));
    updateAngle((Math.atan2(graphHeight, 238) * 180) / Math.PI);
  };
  const checkPractice = () => {
    const expected = {
      opposite: 10.3923,
      hypotenuse: 12,
      sin: 0.866,
      cos: 0.5,
      tan: 1.7321,
    };
    const correct = (
      Object.keys(expected) as Array<keyof typeof expected>
    ).every((key) => {
      const value = Number(answers[key]);
      return Number.isFinite(value) && Math.abs(value - expected[key]) <= 0.001;
    });
    setPracticeResult(correct ? "correct" : "incorrect");
    onInteraction();
  };

  return (
    <section
      className="space-y-2 text-slate-900"
      data-testid="trigonometry-mockup-0316"
      data-target-family="trigonometry"
      data-direct-interaction="true"
    >
      <header className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <div className="flex gap-2 text-[9px] font-black uppercase text-cyan-700">
              <span className="rounded bg-cyan-50 px-2 py-1">Trigonometry</span>
              <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">
                Trigonometry
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-black leading-none">
              {lesson.title}
            </h1>
            <p className="mt-1 text-xs font-semibold text-slate-600">
              Understand SOH-CAH-TOA.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] font-bold text-slate-600">
              <TargetChip icon={<Target />} label="Intermediate-Advanced" />
              <TargetChip icon={<Eye />} label="Visual Lab" />
              <TargetChip
                icon={<ExternalLink />}
                label="Trig Graphing / Geometry"
              />
              <TargetChip icon={<Clock3 />} label="6-10 min" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 self-end">
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-[10px] font-black text-slate-700 [&_svg]:h-3 [&_svg]:w-3"
            >
              <ExternalLink />
              Workspace
            </button>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-[10px] font-black text-slate-700 [&_svg]:h-3 [&_svg]:w-3"
              onClick={() => {
                setAngle(45);
                onInteraction();
              }}
            >
              <RotateCcw />
              Reset
            </button>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-200 bg-white px-2 text-[10px] font-black text-slate-700 [&_svg]:h-3 [&_svg]:w-3"
              onClick={() => onInteraction()}
            >
              <Share2 />
              Share
            </button>
          </div>
        </div>
      </header>

      <section
        className="grid rounded-lg border border-slate-200 bg-white px-2 py-2 shadow-sm md:grid-cols-4"
        aria-label="Learning stages"
      >
        {[
          [
            <Eye key="eye" />,
            "1 Observe",
            "A right triangle has one 90 degree angle. The sides relate to angle theta.",
          ],
          [
            <Hand key="hand" />,
            "2 Manipulate",
            "Drag point C or use the angle slider. Sides and ratios update in real time.",
          ],
          [
            <Lightbulb key="bulb" />,
            "3 Notice",
            "Opposite, adjacent and hypotenuse change, but ratios follow rules.",
          ],
          [
            <Target key="target" />,
            "4 Understand",
            "SOH-CAH-TOA links sides to sin, cos and tan of theta.",
          ],
        ].map(([icon, title, body], index) => (
          <div
            key={String(title)}
            className={`flex gap-2 px-2 py-1 ${index ? "md:border-l md:border-slate-200" : ""}`}
          >
            <span className="mt-1 h-5 w-5 shrink-0 text-blue-600">{icon}</span>
            <div>
              <h2 className="text-[10px] font-black text-blue-700">{title}</h2>
              <p className="mt-0.5 text-[9px] font-semibold leading-3.5 text-slate-600">
                {body}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
        <h2 className="text-sm font-black">Explore a Right Triangle</h2>
        <div className="mt-2 grid gap-2 lg:grid-cols-[112px_minmax(0,1fr)_250px]">
          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-2">
            <label
              className="text-xs font-black"
              htmlFor="right-triangle-angle"
            >
              Angle θ
            </label>
            <output className="mt-2 block rounded border border-slate-200 bg-white py-2 text-center text-lg font-black">
              {angle}°
            </output>
            <input
              id="right-triangle-angle"
              aria-label="Angle theta"
              className="mt-2 w-full accent-cyan-500"
              type="range"
              min="5"
              max="85"
              value={angle}
              onChange={(event) => updateAngle(Number(event.target.value))}
            />
            <div className="flex justify-between text-[8px] font-bold text-slate-500">
              <span>0°</span>
              <span>90°</span>
            </div>
            <label className="mt-3 flex items-start gap-1.5 text-[9px] font-bold leading-3 text-slate-600">
              <input
                type="checkbox"
                checked={snap}
                onChange={(event) => {
                  setSnap(event.target.checked);
                  onInteraction();
                }}
              />
              Snap to special angles
            </label>
          </aside>

          <div className="min-w-0">
            <RightTriangleSvg
              angle={angle}
              adjacent={adjacent}
              opposite={opposite}
              hypotenuse={hypotenuse}
              onPointer={dragPointC}
            />
            <div className="mt-1 flex flex-wrap justify-center gap-2 text-[9px] font-black">
              <span className="rounded-full border border-slate-200 px-2 py-1 text-pink-600">
                ● Opposite (a)
              </span>
              <span className="rounded-full border border-slate-200 px-2 py-1 text-emerald-600">
                ● Adjacent (b)
              </span>
              <span className="rounded-full border border-slate-200 px-2 py-1 text-blue-600">
                ● Hypotenuse (c)
              </span>
            </div>
          </div>

          <aside className="space-y-2">
            <h3 className="text-xs font-black">Ratios for θ = {angle}°</h3>
            <RatioCard
              tone="pink"
              name="sin θ"
              numerator="opposite"
              denominator="hypotenuse"
              symbols="a / c"
              numbers={`${opposite.toFixed(3)} / ${hypotenuse.toFixed(3)}`}
              value={sin.toFixed(4)}
            />
            <RatioCard
              tone="green"
              name="cos θ"
              numerator="adjacent"
              denominator="hypotenuse"
              symbols="b / c"
              numbers={`${adjacent.toFixed(3)} / ${hypotenuse.toFixed(3)}`}
              value={cos.toFixed(4)}
            />
            <RatioCard
              tone="blue"
              name="tan θ"
              numerator="opposite"
              denominator="adjacent"
              symbols="a / b"
              numbers={`${opposite.toFixed(3)} / ${adjacent.toFixed(3)}`}
              value={tan.toFixed(4)}
            />
            <div className="rounded-lg border border-slate-200 p-2 text-[9px] font-semibold leading-3.5">
              <strong className="block text-[10px]">Domains</strong>sin θ, cos
              θ, tan θ are defined for θ ≠ 90° + k·180°, where k ∈ Z.
            </div>
            <QuadrantSigns />
          </aside>
        </div>
        <p className="mt-2 flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold text-slate-600">
          <Hand className="h-4 w-4 text-blue-600" />
          Drag point C or use the angle slider. Right angle at B is fixed.
        </p>
      </section>

      <div className="grid gap-2 lg:grid-cols-2">
        <TargetPanel title="The Rule (SOH-CAH-TOA)" tone="violet">
          <p>For angle θ in a right triangle:</p>
          <div className="mt-2 rounded-md border border-violet-300 bg-violet-50 p-2 text-center font-serif text-xs font-black">
            sin θ = opposite / hypotenuse &nbsp;&nbsp; cos θ = adjacent /
            hypotenuse &nbsp;&nbsp; tan θ = opposite / adjacent
          </div>
          <p className="mt-2">
            Remember: <strong className="text-blue-600">Hypotenuse</strong> is
            always opposite the right angle.
          </p>
        </TargetPanel>
        <TargetPanel title="Key Takeaway" tone="rose">
          <p className="text-xs font-bold leading-5">
            Changing the size of the triangle does not change these ratios, only
            the angle θ determines them.
          </p>
          <p className="mt-2 rounded-md bg-blue-50 p-2 text-[10px] font-semibold">
            Use sin, cos, tan to connect angles with side lengths in any right
            triangle.
          </p>
        </TargetPanel>
      </div>

      <div className="grid gap-2 lg:grid-cols-[1.05fr_.95fr]">
        <TargetPanel title="Worked Example" tone="blue">
          <p className="font-bold">
            In a right triangle, θ = 30° and the hypotenuse is 10 units. Find
            the opposite side, adjacent side and all three ratios.
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_145px]">
            <ul className="space-y-1 text-[10px] leading-4">
              <li>Opposite = 10 · sin 30° = 5</li>
              <li>Adjacent = 10 · cos 30° = 5√3 ≈ 8.660</li>
              <li>tan 30° = 5 / 5√3 ≈ 0.5774</li>
              <li>Check: sin² θ + cos² θ = 1 ✓</li>
            </ul>
            <ExampleTriangle />
          </div>
          <p className="mt-2 rounded-md bg-emerald-50 p-2 text-[10px] font-black text-emerald-700">
            ✓ Correct! All values are consistent with SOH-CAH-TOA.
          </p>
        </TargetPanel>
        <TargetPanel title="Common Misconception" tone="rose">
          <p className="font-bold">Mixing up opposite and adjacent sides.</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <MisconceptionTriangle correct />
            <MisconceptionTriangle correct={false} />
          </div>
          <p className="mt-2 rounded-md border border-rose-200 bg-rose-50 p-2 text-[10px] font-bold">
            Always identify the right angle first, then mark opposite, adjacent
            and hypotenuse.
          </p>
        </TargetPanel>
      </div>

      <section className="grid rounded-lg border border-violet-200 bg-violet-50/40 p-3 shadow-sm lg:grid-cols-[1fr_205px]">
        <div>
          <h2 className="text-sm font-black text-violet-700">
            Practice Challenge
          </h2>
          <p className="mt-1 text-[10px] font-semibold">
            Set θ = 60°. If the adjacent side is 6 units, find the opposite
            side, hypotenuse and all three ratios. Round to 4 decimal places.
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <PracticeInput
                label="Opposite"
                value={answers.opposite}
                onChange={(value) =>
                  setAnswers((current) => ({ ...current, opposite: value }))
                }
              />
              <PracticeInput
                label="Hypotenuse"
                value={answers.hypotenuse}
                onChange={(value) =>
                  setAnswers((current) => ({ ...current, hypotenuse: value }))
                }
              />
            </div>
            <div className="space-y-1">
              <PracticeInput
                label="sin 60°"
                value={answers.sin}
                onChange={(value) =>
                  setAnswers((current) => ({ ...current, sin: value }))
                }
              />
              <PracticeInput
                label="cos 60°"
                value={answers.cos}
                onChange={(value) =>
                  setAnswers((current) => ({ ...current, cos: value }))
                }
              />
              <PracticeInput
                label="tan 60°"
                value={answers.tan}
                onChange={(value) =>
                  setAnswers((current) => ({ ...current, tan: value }))
                }
              />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              className="rounded-md bg-violet-600 px-4 py-2 text-[10px] font-black text-white"
              onClick={checkPractice}
            >
              Check Answer
            </button>
            {practiceResult !== "idle" ? (
              <span
                role="status"
                className={`text-[10px] font-black ${practiceResult === "correct" ? "text-emerald-700" : "text-rose-700"}`}
              >
                {practiceResult === "correct"
                  ? "Correct. Every ratio matches."
                  : "Check each value and round to four decimal places."}
              </span>
            ) : null}
          </div>
        </div>
        <aside className="mt-2 border-t border-violet-200 pt-2 text-[10px] font-semibold leading-4 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-3 lg:pt-0">
          <strong className="block text-violet-700">Need a hint?</strong>
          <p className="mt-2">
            Use cos 60° = adjacent / hypotenuse to find hypotenuse first, then
            use sin 60° and tan 60°.
          </p>
        </aside>
      </section>

      <nav
        className="grid grid-cols-2 rounded-lg border border-slate-200 bg-white p-2 text-[10px] font-bold shadow-sm"
        aria-label="Adjacent lessons"
      >
        <Link
          className="flex items-center gap-2"
          to="/lessons/trigonometry/258-unit-circle"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>
            <small className="block uppercase text-slate-500">Previous</small>
            Unit Circle
          </span>
        </Link>
        <Link
          className="flex items-center justify-end gap-2 text-right"
          to="/lessons/trigonometry/260-exact-trig-values"
        >
          <span>
            <small className="block uppercase text-slate-500">Next</small>Exact
            Trig Values
          </span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </nav>
    </section>
  );
}

function TargetChip({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-1">
      {<span className="h-3 w-3">{icon}</span>}
      {label}
    </span>
  );
}

function RightTriangleSvg({
  angle,
  adjacent,
  opposite,
  hypotenuse,
  onPointer,
}: {
  angle: number;
  adjacent: number;
  opposite: number;
  hypotenuse: number;
  onPointer: (event: PointerEvent<SVGSVGElement>) => void;
}) {
  const height = Math.max(
    24,
    Math.min(238, 238 * Math.tan((angle * Math.PI) / 180)),
  );
  const topY = 330 - height;
  return (
    <svg
      viewBox="0 0 500 430"
      className="h-[330px] w-full touch-none"
      role="img"
      aria-label="Coordinate-grid right triangle OBC with right angle at B"
      onPointerDown={onPointer}
      onPointerMove={onPointer}
    >
      <rect width="500" height="430" fill="#fff" />
      {Array.from({ length: 9 }, (_, index) => (
        <line
          key={`v-${index}`}
          x1={70 + index * 45}
          x2={70 + index * 45}
          y1="55"
          y2="375"
          stroke="#e2e8f0"
          strokeDasharray="2 4"
        />
      ))}
      {Array.from({ length: 8 }, (_, index) => (
        <line
          key={`h-${index}`}
          x1="50"
          x2="460"
          y1={60 + index * 45}
          y2={60 + index * 45}
          stroke="#e2e8f0"
          strokeDasharray="2 4"
        />
      ))}
      <line x1="55" y1="330" x2="470" y2="330" stroke="#64748b" />
      <line x1="90" y1="390" x2="90" y2="40" stroke="#64748b" />
      <polygon
        points={`90,330 328,330 328,${topY}`}
        fill="#eff6ff"
        stroke="none"
      />
      <line
        x1="90"
        y1="330"
        x2="328"
        y2="330"
        stroke="#10b981"
        strokeWidth="4"
      />
      <line
        x1="328"
        y1="330"
        x2="328"
        y2={topY}
        stroke="#ec4899"
        strokeWidth="4"
      />
      <line
        x1="90"
        y1="330"
        x2="328"
        y2={topY}
        stroke="#2563eb"
        strokeWidth="4"
      />
      <path
        d="M 308 330 L 308 310 L 328 310"
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
      />
      <path
        d={`M 145 330 A 55 55 0 0 0 ${90 + 55 * Math.cos((angle * Math.PI) / 180)} ${330 - 55 * Math.sin((angle * Math.PI) / 180)}`}
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
      />
      <circle cx="90" cy="330" r="6" fill="#2563eb" />
      <circle cx="328" cy="330" r="6" fill="#1d4ed8" />
      <circle
        cx="328"
        cy={topY}
        r="8"
        fill="#2563eb"
        stroke="white"
        strokeWidth="3"
      />
      <text x="72" y="352" fontSize="12" fontWeight="800">
        O (0, 0)
      </text>
      <text x="335" y="352" fontSize="12" fontWeight="800">
        B (3.000, 0)
      </text>
      <text x="337" y={topY - 8} fontSize="12" fontWeight="800">
        C (3.000, {opposite.toFixed(3)})
      </text>
      <text x="148" y="314" fill="#2563eb" fontSize="13" fontWeight="800">
        θ = {angle}°
      </text>
      <text x="190" y="365" fill="#059669" fontSize="13" fontWeight="800">
        Adjacent (b) = {adjacent.toFixed(3)}
      </text>
      <text
        x="342"
        y={(330 + topY) / 2}
        fill="#db2777"
        fontSize="13"
        fontWeight="800"
      >
        Opposite (a) = {opposite.toFixed(3)}
      </text>
      <text
        x="178"
        y={(330 + topY) / 2 - 10}
        transform={`rotate(${-angle} 178 ${(330 + topY) / 2 - 10})`}
        fill="#2563eb"
        fontSize="13"
        fontWeight="800"
      >
        Hypotenuse (c) = {hypotenuse.toFixed(3)}
      </text>
    </svg>
  );
}

function RatioCard({
  tone,
  name,
  numerator,
  denominator,
  symbols,
  numbers,
  value,
}: {
  tone: "pink" | "green" | "blue";
  name: string;
  numerator: string;
  denominator: string;
  symbols: string;
  numbers: string;
  value: string;
}) {
  const colors =
    tone === "pink"
      ? "border-pink-200 bg-pink-50 text-pink-700"
      : tone === "green"
        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
        : "border-blue-200 bg-blue-50 text-blue-700";
  return (
    <div
      className={`grid grid-cols-[50px_1fr] items-center rounded-md border p-2 ${colors}`}
    >
      <strong className="text-xs">{name}</strong>
      <div className="text-center text-[8px] font-bold text-slate-700">
        <span className="inline-block border-b border-slate-500">
          {numerator}
        </span>
        <br />
        {denominator}
        <span className="mx-2">
          = {symbols} = {numbers} =
        </span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function QuadrantSigns() {
  return (
    <div>
      <h3 className="text-[9px] font-black">Signs by Quadrant (ASTC)</h3>
      <table className="mt-1 w-full border-collapse text-center text-[8px]">
        <thead>
          <tr>
            <th></th>
            {["I", "II", "III", "IV"].map((q) => (
              <th key={q}>{q}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[
            ["sin", "+", "+", "−", "−"],
            ["cos", "+", "−", "−", "+"],
            ["tan", "+", "−", "+", "−"],
          ].map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td
                  className="border border-slate-200 px-1 py-0.5 font-bold"
                  key={`${cell}-${index}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TargetPanel({
  title,
  tone,
  children,
}: {
  title: string;
  tone: "violet" | "rose" | "blue";
  children: ReactNode;
}) {
  const color =
    tone === "violet"
      ? "text-violet-700"
      : tone === "rose"
        ? "text-rose-600"
        : "text-blue-700";
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-3 text-[10px] shadow-sm">
      <h2 className={`text-sm font-black ${color}`}>{title}</h2>
      <div className="mt-1 text-slate-700">{children}</div>
    </article>
  );
}
function ExampleTriangle() {
  return (
    <svg
      viewBox="0 0 150 105"
      className="h-[95px] w-full"
      role="img"
      aria-label="Worked example 30 degree right triangle"
    >
      <polygon
        points="12,92 132,92 132,18"
        fill="#eff6ff"
        stroke="#2563eb"
        strokeWidth="2"
      />
      <path d="M120 92V80H132" fill="none" stroke="#10b981" strokeWidth="2" />
      <text x="45" y="87" fill="#2563eb" fontSize="13" fontWeight="800">
        30°
      </text>
      <text x="66" y="102" fill="#059669" fontSize="13" fontWeight="800">
        5√3
      </text>
      <text x="136" y="60" fill="#db2777" fontSize="13" fontWeight="800">
        5
      </text>
      <text x="56" y="45" fill="#2563eb" fontSize="13" fontWeight="800">
        10
      </text>
    </svg>
  );
}
function MisconceptionTriangle({ correct }: { correct: boolean }) {
  return (
    <div>
      <svg
        viewBox="0 0 140 75"
        className="h-[65px] w-full"
        role="img"
        aria-label={correct ? "Correct side labels" : "Incorrect side labels"}
      >
        <polygon
          points="10,65 120,65 120,15"
          fill="#fff"
          stroke="#2563eb"
          strokeWidth="2"
        />
        <path d="M110 65V55H120" fill="none" stroke="#10b981" />
        <text x="30" y="60" fontSize="9">
          θ
        </text>
        <text x="68" y="73" fill="#059669" fontSize="8">
          {correct ? "adjacent" : "opposite"}
        </text>
        <text x="122" y="44" fill="#db2777" fontSize="8">
          {correct ? "opposite" : "hypotenuse"}
        </text>
      </svg>
      <p
        className={`text-[9px] font-black ${correct ? "text-emerald-700" : "text-rose-600"}`}
      >
        {correct ? "✓ Correct" : "✕ Incorrect"}
      </p>
      <p className="text-[8px] leading-3">
        {correct
          ? "Opposite is across from θ."
          : "Adjacent is next to θ, not the hypotenuse."}
      </p>
    </div>
  );
}
function PracticeInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid grid-cols-[88px_1fr] items-center gap-2 text-[10px] font-bold">
      <span>{label} =</span>
      <input
        aria-label={label}
        className="min-w-0 rounded border border-slate-200 bg-white px-2 py-1"
        inputMode="decimal"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="?"
      />
    </label>
  );
}

function CircleGraphModel({
  spec,
  angle,
  values,
  amplitude,
  frequency,
  phase,
  onPointer,
}: {
  spec: TrigSpec;
  angle: number;
  values: ReturnType<typeof computeTrigFormulaValues>;
  amplitude: number;
  frequency: number;
  phase: number;
  onPointer: (event: PointerEvent<SVGSVGElement>) => void;
}) {
  const x = 210 + values.cos * 125;
  const y = 180 - values.sin * 125;
  const points = useMemo(
    () =>
      Array.from({ length: 150 }, (_, index) => {
        const px = 30 + index * (500 / 149);
        const domain = -Math.PI * 2 + index * ((Math.PI * 4) / 149);
        const value = spec.title.includes("Cosine")
          ? Math.cos(frequency * (domain - phase))
          : spec.title.includes("Tangent")
            ? Math.max(-1.6, Math.min(1.6, Math.tan(domain)))
            : Math.sin(frequency * (domain - phase));
        return `${px},${135 - value * amplitude * 42}`;
      }).join(" "),
    [amplitude, frequency, phase, spec.title],
  );
  const markerX = 30 + ((values.radians + Math.PI * 2) / (Math.PI * 4)) * 500;
  const markerY =
    135 -
    (spec.title.includes("Cosine")
      ? values.cos
      : spec.title.includes("Tangent")
        ? Math.max(-1.6, Math.min(1.6, values.tan ?? 0))
        : values.sin) *
      42;
  return (
    <svg
      viewBox="0 0 960 430"
      className="h-[430px] w-full"
      role="img"
      aria-label={`${spec.title} interactive model`}
      onPointerDown={onPointer}
      onPointerMove={onPointer}
    >
      <rect width="960" height="430" rx="16" fill="#ffffff" />
      <text x="16" y="28" fill="#0f172a" fontSize="18" fontWeight="900">
        1. Observe
      </text>
      <circle
        cx="210"
        cy="180"
        r="125"
        fill="none"
        stroke="#334155"
        strokeWidth="2"
      />
      <line x1="70" x2="350" y1="180" y2="180" stroke="#0f172a" />
      <line x1="210" x2="210" y1="40" y2="320" stroke="#0f172a" />
      <line x1="210" y1="180" x2={x} y2={y} stroke="#0b84ff" strokeWidth="5" />
      <line
        x1={x}
        y1={y}
        x2={x}
        y2="180"
        stroke="#fb923c"
        strokeWidth="3"
        strokeDasharray="7 5"
      />
      <path
        d={`M 270 180 A 60 60 0 0 ${angle < 0 ? 0 : 1} ${210 + Math.cos(values.radians) * 60} ${180 - Math.sin(values.radians) * 60}`}
        fill="none"
        stroke="#0b84ff"
        strokeDasharray="5 4"
        strokeWidth="2"
      />
      <circle cx={x} cy={y} r="9" fill={spec.accent} />
      <text
        x={x + 12}
        y={y - 12}
        fill={spec.accent}
        fontSize="17"
        fontWeight="900"
      >
        (cos theta, sin theta)
      </text>
      <ArrowSvg />
      <text x="470" y="28" fill="#0f172a" fontSize="18" fontWeight="900">
        2.{" "}
        {spec.title.includes("Graph")
          ? `${spec.title} (y = ${spec.title.split(" ")[0].toLowerCase()} x)`
          : "Live graph"}
      </text>
      <line x1="430" x2="930" y1="135" y2="135" stroke="#334155" />
      <line x1="680" x2="680" y1="42" y2="320" stroke="#334155" />
      <polyline
        points={points}
        fill="none"
        stroke="#0b84ff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1={markerX}
        x2={markerX}
        y1="55"
        y2="300"
        stroke="#fb923c"
        strokeDasharray="7 5"
        strokeWidth="2"
      />
      <circle cx={markerX} cy={markerY} r="9" fill="#db2777" />
      <text x="430" y="342" fill="#475569" fontSize="15" fontWeight="800">
        -2pi
      </text>
      <text x="666" y="342" fill="#475569" fontSize="15" fontWeight="800">
        0
      </text>
      <text x="900" y="342" fill="#475569" fontSize="15" fontWeight="800">
        2pi
      </text>
      <text x="438" y="390" fill={spec.accent} fontSize="17" fontWeight="900">
        {spec.formula}
      </text>
    </svg>
  );
}

function TriangleModel({ spec, angle }: { spec: TrigSpec; angle: number }) {
  const left = { x: 92, y: 330 };
  const top = { x: 350, y: 92 };
  const right = { x: 670, y: 330 };
  return (
    <svg
      viewBox="0 0 760 410"
      className="h-[410px] w-full"
      role="img"
      aria-label={`${spec.title} triangle model`}
    >
      <rect width="760" height="410" rx="16" fill="#ffffff" />
      <text x="18" y="32" fill="#0f172a" fontSize="18" fontWeight="900">
        Explore the model
      </text>
      <line
        x1={left.x}
        y1={left.y}
        x2={top.x}
        y2={top.y}
        stroke="#06b6d4"
        strokeWidth="6"
      />
      <line
        x1={top.x}
        y1={top.y}
        x2={right.x}
        y2={right.y}
        stroke="#8b5cf6"
        strokeWidth="6"
      />
      <line
        x1={left.x}
        y1={left.y}
        x2={right.x}
        y2={right.y}
        stroke="#2563eb"
        strokeWidth="6"
      />
      <path
        d={`M ${left.x + 30} ${left.y} A 74 74 0 0 1 ${left.x + 82} ${left.y - 68}`}
        fill="#bae6fd"
        opacity=".9"
      />
      <path
        d={`M ${right.x - 72} ${right.y} A 72 72 0 0 0 ${right.x - 25} ${right.y - 52}`}
        fill="#ddd6fe"
        opacity=".9"
      />
      {[left, top, right].map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="9"
          fill="#0b84ff"
          stroke="#ffffff"
          strokeWidth="3"
        />
      ))}
      <text
        x={top.x - 12}
        y={top.y - 14}
        fill="#0f172a"
        fontSize="24"
        fontWeight="900"
      >
        A
      </text>
      <text
        x={left.x - 24}
        y={left.y + 28}
        fill="#0f172a"
        fontSize="24"
        fontWeight="900"
      >
        B
      </text>
      <text
        x={right.x + 10}
        y={right.y + 28}
        fill="#0f172a"
        fontSize="24"
        fontWeight="900"
      >
        C
      </text>
      <text x="255" y="226" fill="#06b6d4" fontSize="24" fontWeight="900">
        c
      </text>
      <text x="520" y="210" fill="#8b5cf6" fontSize="24" fontWeight="900">
        b
      </text>
      <text x="368" y="366" fill="#2563eb" fontSize="24" fontWeight="900">
        a
      </text>
      <text x="310" y="158" fill="#1d4ed8" fontSize="22" fontWeight="900">
        {Math.abs(angle)} degrees
      </text>
      <foreignObject x="520" y="26" width="210" height="178">
        <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-[10px] font-black uppercase tracking-wide text-emerald-700">
            Live measurements
          </p>
          <p className="mt-3 text-sm font-bold text-slate-700">
            a = BC <strong className="float-right">7.84</strong>
          </p>
          <p className="mt-2 text-sm font-bold text-slate-700">
            b = AC <strong className="float-right">6.21</strong>
          </p>
          <p className="mt-2 text-sm font-bold text-slate-700">
            A <strong className="float-right">{Math.abs(angle)} degrees</strong>
          </p>
          <p className="mt-3 rounded-lg bg-emerald-50 p-2 text-sm font-black text-emerald-800">
            Ratios match
          </p>
        </div>
      </foreignObject>
    </svg>
  );
}

function ApplicationModel({ spec, angle }: { spec: TrigSpec; angle: number }) {
  const isBearing = spec.title.includes("Bearings");
  return (
    <svg
      viewBox="0 0 760 410"
      className="h-[410px] w-full"
      role="img"
      aria-label={`${spec.title} application model`}
    >
      <rect width="760" height="410" rx="16" fill="#ffffff" />
      <text x="18" y="34" fill="#0f172a" fontSize="18" fontWeight="900">
        {spec.modelTitle}
      </text>
      {Array.from({ length: 9 }, (_, index) => (
        <line
          key={`v${index}`}
          x1={80 + index * 70}
          x2={80 + index * 70}
          y1="70"
          y2="350"
          stroke="#e2e8f0"
        />
      ))}
      {Array.from({ length: 5 }, (_, index) => (
        <line
          key={`h${index}`}
          x1="70"
          x2="690"
          y1={70 + index * 70}
          y2={70 + index * 70}
          stroke="#e2e8f0"
        />
      ))}
      {isBearing ? (
        <>
          <circle
            cx="380"
            cy="210"
            r="118"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1="380"
            y1="328"
            x2="380"
            y2="92"
            stroke="#0f172a"
            strokeWidth="3"
          />
          <line
            x1="380"
            y1="210"
            x2="524"
            y2="126"
            stroke="#0b84ff"
            strokeWidth="6"
          />
          <path
            d="M 380 128 A 82 82 0 0 1 451 168"
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
          />
          <text x="528" y="126" fill="#0b84ff" fontSize="20" fontWeight="900">
            bearing {Math.abs(angle).toString().padStart(3, "0")} degrees
          </text>
          <text x="392" y="104" fill="#0f172a" fontSize="18" fontWeight="900">
            N
          </text>
        </>
      ) : (
        <>
          <rect
            x="500"
            y="112"
            width="70"
            height="210"
            rx="8"
            fill="#e0f2fe"
            stroke="#0ea5e9"
            strokeWidth="3"
          />
          <line
            x1="150"
            y1="322"
            x2="610"
            y2="322"
            stroke="#0f172a"
            strokeWidth="4"
          />
          <line
            x1="180"
            y1="322"
            x2="535"
            y2="128"
            stroke="#dc2626"
            strokeWidth="6"
          />
          <path
            d="M 220 322 A 70 70 0 0 1 241 287"
            fill="none"
            stroke="#f97316"
            strokeWidth="4"
          />
          <text x="250" y="278" fill="#dc2626" fontSize="20" fontWeight="900">
            {Math.abs(angle)} degrees
          </text>
          <text x="382" y="350" fill="#2563eb" fontSize="18" fontWeight="900">
            horizontal distance
          </text>
          <text x="582" y="218" fill="#0ea5e9" fontSize="18" fontWeight="900">
            height
          </text>
        </>
      )}
    </svg>
  );
}

function PolarModel({
  spec,
  angle,
  radius,
  onPointer,
}: {
  spec: TrigSpec;
  angle: number;
  radius: number;
  onPointer: (event: PointerEvent<SVGSVGElement>) => void;
}) {
  const rad = (angle * Math.PI) / 180;
  const x = 230 + Math.cos(rad) * radius * 70;
  const y = 210 - Math.sin(rad) * radius * 70;
  return (
    <svg
      viewBox="0 0 900 430"
      className="h-[430px] w-full"
      role="img"
      aria-label={`${spec.title} polar model`}
      onPointerDown={onPointer}
      onPointerMove={onPointer}
    >
      <rect width="900" height="430" rx="16" fill="#ffffff" />
      <text x="18" y="34" fill="#0f172a" fontSize="18" fontWeight="900">
        Polar coordinate point (r, theta)
      </text>
      {[60, 120, 180].map((r) => (
        <circle
          key={r}
          cx="230"
          cy="210"
          r={r}
          fill="none"
          stroke="#cbd5e1"
          strokeDasharray="4 4"
        />
      ))}
      <line x1="50" x2="410" y1="210" y2="210" stroke="#334155" />
      <line x1="230" x2="230" y1="30" y2="390" stroke="#334155" />
      <line
        x1="230"
        y1="210"
        x2={x}
        y2={y}
        stroke={spec.accent}
        strokeWidth="6"
      />
      <line
        x1={x}
        y1={y}
        x2={x}
        y2="210"
        stroke="#fb923c"
        strokeDasharray="7 5"
        strokeWidth="3"
      />
      <circle cx={x} cy={y} r="10" fill={spec.accent} />
      <text x={x + 12} y={y - 12} fill="#0f172a" fontSize="20" fontWeight="900">
        (r, theta)
      </text>
      <foreignObject x="460" y="50" width="190" height="265">
        <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-wide text-blue-700">
            Cartesian conversion
          </p>
          <p className="mt-4 text-center text-lg font-black text-slate-900">
            (x, y)
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg bg-white p-3">
              <span className="block text-xs font-black text-blue-600">x</span>
              <strong>{(radius * Math.cos(rad)).toFixed(4)}</strong>
            </div>
            <div className="rounded-lg bg-white p-3">
              <span className="block text-xs font-black text-violet-600">
                y
              </span>
              <strong>{(radius * Math.sin(rad)).toFixed(4)}</strong>
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-white p-3 text-sm font-black text-slate-700">
            x = r cos theta
            <br />y = r sin theta
          </p>
        </div>
      </foreignObject>
      <circle cx="760" cy="190" r="105" fill="none" stroke="#cbd5e1" />
      <path
        d="M 760 190 C 865 120 870 285 760 295 C 655 285 655 120 760 190"
        fill="none"
        stroke={spec.accent}
        strokeWidth="5"
      />
      <text x="682" y="330" fill="#475569" fontSize="15" fontWeight="900">
        Polar curve tracer
      </text>
    </svg>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 text-center">
      <span className="block text-[10px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <strong className="mt-1 block font-mono text-sm text-slate-950">
        {value}
      </strong>
    </div>
  );
}

function ValueCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-slate-200 p-3 sm:border-b-0 sm:border-r last:border-r-0">
      <span className="block text-[10px] font-black uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <strong className="mt-1 block text-lg text-slate-950">{value}</strong>
    </div>
  );
}

function InfoCard({
  icon,
  tone,
  title,
  body,
  formula,
}: {
  icon: ReactNode;
  tone: "green" | "blue" | "red";
  title: string;
  body: string;
  formula: string;
}) {
  const styles =
    tone === "green"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "blue"
        ? "border-blue-200 bg-blue-50 text-blue-700"
        : "border-rose-200 bg-rose-50 text-rose-700";
  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${styles}`}>
      <div className="flex items-center gap-2 text-sm font-black uppercase tracking-wide">
        {icon}
        {title}
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-700">
        {body}
      </p>
      <p className="mt-3 rounded-xl border border-current/20 bg-white/80 p-3 text-center font-serif text-lg font-black text-slate-950">
        {formula}
      </p>
    </article>
  );
}

function ArrowSvg() {
  return (
    <g>
      <path
        d="M 384 180 L 410 180"
        stroke="#cbd5e1"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 410 180 L 394 166 M 410 180 L 394 194"
        stroke="#cbd5e1"
        strokeWidth="10"
        strokeLinecap="round"
      />
    </g>
  );
}

function t(
  mockup: string,
  id: number,
  title: string,
  subtitle: string,
  kind: TrigKind,
  accent: string,
  formula: string,
  modelTitle: string,
  controlLabels: [string, string, string, string],
  steps: [string, string, string, string],
  rule: string,
  example: string,
  misconception: string,
  practice: string,
): TrigSpec {
  return {
    mockup,
    id,
    title,
    subtitle,
    kind,
    accent,
    formula,
    modelTitle,
    controlLabels,
    steps,
    rule,
    example,
    misconception,
    practice,
  };
}

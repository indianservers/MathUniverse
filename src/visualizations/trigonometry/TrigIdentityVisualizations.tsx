import { Pause, Play, RotateCcw, Sigma } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import { degreesToRadians, radiansToDegrees, roundTo } from "../../utils/math";

type AngleMode = "degrees" | "radians";
type TeachingMode = "standard" | "beginner" | "professor";
type Difficulty = "Basic" | "Intermediate" | "Advanced";
type VizId =
  | "pythagorean"
  | "sin-plus-cos"
  | "sin-square"
  | "cos-square"
  | "tan-ratio"
  | "sec-reciprocal"
  | "csc-reciprocal"
  | "cot-ratio"
  | "tan-sec"
  | "cot-csc"
  | "sin-add"
  | "cos-add"
  | "sin-sub"
  | "cos-sub"
  | "sin-double"
  | "cos-double"
  | "cos-double-sin"
  | "cos-double-cos"
  | "tan-double"
  | "sin-complement"
  | "cos-complement"
  | "tan-complement"
  | "cot-complement"
  | "sec-complement"
  | "csc-complement"
  | "quadrants"
  | "unit-circle"
  | "wave-transform"
  | "curve-compare";

type VizConfig = {
  id: VizId;
  title: string;
  formula: string;
  summary: string;
  category: string;
  difficulty?: Difficulty;
  needsAB?: boolean;
  needsWave?: boolean;
};

const EPSILON = 0.000001;
const VISUALIZATIONS: VizConfig[] = [
  { id: "pythagorean", title: "Pythagorean Identity", formula: "sin²θ + cos²θ = 1", summary: "See sine and cosine as perpendicular sides of a unit-radius triangle.", category: "Pythagorean Identities", difficulty: "Basic" },
  { id: "sin-plus-cos", title: "Sum of Sine and Cosine", formula: "sinθ + cosθ", summary: "Combine vertical and horizontal components and watch the sum curve.", category: "Basic Ratios", difficulty: "Intermediate" },
  { id: "sin-square", title: "Sine Squared", formula: "sin²θ", summary: "Turn the sine height into a positive area.", category: "Pythagorean Identities", difficulty: "Basic" },
  { id: "cos-square", title: "Cosine Squared", formula: "cos²θ", summary: "Turn the cosine base into a positive area.", category: "Pythagorean Identities", difficulty: "Basic" },
  { id: "tan-ratio", title: "Tangent Ratio", formula: "tanθ = sinθ / cosθ", summary: "Tangent is the slope made by sine over cosine.", category: "Basic Ratios", difficulty: "Basic" },
  { id: "sec-reciprocal", title: "Secant Reciprocal", formula: "secθ = 1 / cosθ", summary: "Secant stretches from the center to the vertical tangent line through the circle.", category: "Reciprocal Identities", difficulty: "Intermediate" },
  { id: "csc-reciprocal", title: "Cosecant Reciprocal", formula: "cosecθ = 1 / sinθ", summary: "Cosecant is the sine-side reciprocal length, undefined when sine is zero.", category: "Reciprocal Identities", difficulty: "Intermediate" },
  { id: "cot-ratio", title: "Cotangent Ratio", formula: "cotθ = cosθ / sinθ", summary: "Cotangent is the run divided by the rise, the reciprocal of tangent.", category: "Basic Ratios", difficulty: "Intermediate" },
  { id: "tan-sec", title: "Tangent and Secant", formula: "1 + tan²θ = sec²θ", summary: "A tangent triangle gives the secant hypotenuse.", category: "Reciprocal Identities", difficulty: "Intermediate" },
  { id: "cot-csc", title: "Cotangent and Cosecant", formula: "1 + cot²θ = cosec²θ", summary: "The reciprocal partner identity from the sine side.", category: "Reciprocal Identities", difficulty: "Intermediate" },
  { id: "sin-add", title: "Sine Addition", formula: "sin(A + B) = sinA cosB + cosA sinB", summary: "Compare the direct angle with the expanded formula.", category: "Addition/Subtraction", difficulty: "Advanced", needsAB: true },
  { id: "cos-add", title: "Cosine Addition", formula: "cos(A + B) = cosA cosB - sinA sinB", summary: "Watch the direct cosine match the two-product expansion.", category: "Addition/Subtraction", difficulty: "Advanced", needsAB: true },
  { id: "sin-sub", title: "Sine Subtraction", formula: "sin(A - B) = sinA cosB - cosA sinB", summary: "Subtract angles and compare direct versus expanded values.", category: "Addition/Subtraction", difficulty: "Advanced", needsAB: true },
  { id: "cos-sub", title: "Cosine Subtraction", formula: "cos(A - B) = cosA cosB + sinA sinB", summary: "The plus sign appears because cosine is even.", category: "Addition/Subtraction", difficulty: "Advanced", needsAB: true },
  { id: "sin-double", title: "Double Angle Sine", formula: "sin(2θ) = 2sinθcosθ", summary: "Double the rotation and compare it to two component products.", category: "Double Angle", difficulty: "Advanced" },
  { id: "cos-double", title: "Double Angle Cosine", formula: "cos(2θ) = cos²θ - sin²θ", summary: "Cosine of the doubled angle is the difference of two areas.", category: "Double Angle", difficulty: "Advanced" },
  { id: "cos-double-sin", title: "Double Angle Cosine: Sine Form", formula: "cos(2θ) = 1 - 2sin²θ", summary: "Use the sine square area to rewrite the cosine double-angle identity.", category: "Double Angle", difficulty: "Advanced" },
  { id: "cos-double-cos", title: "Double Angle Cosine: Cosine Form", formula: "cos(2θ) = 2cos²θ - 1", summary: "Use the cosine square area to rewrite the cosine double-angle identity.", category: "Double Angle", difficulty: "Advanced" },
  { id: "tan-double", title: "Double Angle Tangent", formula: "tan(2θ) = 2tanθ / (1 - tan²θ)", summary: "Track the places where the denominator makes tangent undefined.", category: "Double Angle", difficulty: "Advanced" },
  { id: "sin-complement", title: "Complementary Sine", formula: "sin(90° - θ) = cosθ", summary: "The sine of the complement is the adjacent side.", category: "Complementary Angles", difficulty: "Basic" },
  { id: "cos-complement", title: "Complementary Cosine", formula: "cos(90° - θ) = sinθ", summary: "The cosine of the complement is the opposite side.", category: "Complementary Angles", difficulty: "Basic" },
  { id: "tan-complement", title: "Complementary Tangent", formula: "tan(90° - θ) = cotθ", summary: "The tangent ratio of the other acute angle flips rise and run.", category: "Complementary Angles", difficulty: "Intermediate" },
  { id: "cot-complement", title: "Complementary Cotangent", formula: "cot(90° - θ) = tanθ", summary: "Cotangent of the complement becomes the original tangent.", category: "Complementary Angles", difficulty: "Intermediate" },
  { id: "sec-complement", title: "Complementary Secant", formula: "sec(90° - θ) = cosecθ", summary: "The reciprocal of cosine swaps into the reciprocal of sine.", category: "Complementary Angles", difficulty: "Intermediate" },
  { id: "csc-complement", title: "Complementary Cosecant", formula: "cosec(90° - θ) = secθ", summary: "The reciprocal of sine swaps into the reciprocal of cosine.", category: "Complementary Angles", difficulty: "Intermediate" },
  { id: "quadrants", title: "Quadrant Signs", formula: "ASTC sign rule", summary: "Highlight which of sin, cos, and tan are positive in each quadrant.", category: "Quadrant Rules", difficulty: "Basic" },
  { id: "unit-circle", title: "Unit Circle: sin, cos, tan", formula: "(cosθ, sinθ), tanθ = y/x", summary: "Read all three core trig values from one moving point.", category: "Basic Ratios", difficulty: "Basic" },
  { id: "wave-transform", title: "Amplitude and Phase Shift", formula: "y = a sin(bx + c)", summary: "Change amplitude, frequency, and phase in a live sine wave.", category: "Graph Transformations", difficulty: "Intermediate", needsWave: true },
  { id: "curve-compare", title: "Compare sin, cos, tan", formula: "sinθ, cosθ, tanθ", summary: "Overlay the three parent curves and inspect their differences.", category: "Graph Transformations", difficulty: "Intermediate" },
];

export default function TrigIdentityVisualizations() {
  const [selectedId, setSelectedId] = useState<VizId>("pythagorean");
  const [angleMode, setAngleMode] = useState<AngleMode>("degrees");
  const [thetaDeg, setThetaDeg] = useState(45);
  const [aDeg, setADeg] = useState(30);
  const [bDeg, setBDeg] = useState(25);
  const [amplitude, setAmplitude] = useState(1.4);
  const [frequency, setFrequency] = useState(1);
  const [phaseDeg, setPhaseDeg] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [teachingMode, setTeachingMode] = useState<TeachingMode>("standard");
  const active = VISUALIZATIONS.find((viz) => viz.id === selectedId) ?? VISUALIZATIONS[0];
  const categories = useMemo(() => ["All", ...Array.from(new Set(VISUALIZATIONS.map((viz) => viz.category)))], []);
  const filteredVisualizations = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return VISUALIZATIONS.filter((viz) => {
      const matchesCategory = categoryFilter === "All" || viz.category === categoryFilter;
      const haystack = `${viz.title} ${viz.formula} ${viz.summary} ${viz.category}`.toLowerCase();
      return matchesCategory && (!needle || haystack.includes(needle));
    });
  }, [categoryFilter, query]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const interval = window.setInterval(() => {
      const increment = speed * (teachingMode === "beginner" ? 1 : 2);
      if (active.needsWave) {
        setPhaseDeg((value) => normalizeSignedDegrees(value + increment));
        return;
      }
      if (active.needsAB) {
        setBDeg((value) => normalizeSignedDegrees(value + increment));
        return;
      }
      setThetaDeg((value) => normalizeSignedDegrees(value + increment));
    }, 48);
    return () => window.clearInterval(interval);
  }, [active.needsAB, active.needsWave, isPlaying, speed, teachingMode]);

  function reset() {
    setThetaDeg(45);
    setADeg(30);
    setBDeg(25);
    setAmplitude(1.4);
    setFrequency(1);
    setPhaseDeg(30);
  }

  return (
    <SectionCard
      title="Trigono Visualizations"
      description="Interactive identity proofs with live diagrams, graphs, values, and student-friendly explanations."
      compact
      headerAction={
        <button type="button" className="tool-button gap-2" onClick={reset} title="Reset visual controls">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      }
    >
      <FormulaSceneLayout
        selector={
          <>
            <FormulaSelectorControls
              query={query}
              setQuery={setQuery}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={categories}
              teachingMode={teachingMode}
              setTeachingMode={setTeachingMode}
            />
            <div className="grid max-h-[720px] gap-2 overflow-auto pr-1 thin-scrollbar sm:grid-cols-2 xl:grid-cols-1">
              {filteredVisualizations.map((viz) => (
                <IdentityVisualizationCard key={viz.id} index={VISUALIZATIONS.findIndex((item) => item.id === viz.id) + 1} config={viz} active={viz.id === selectedId} onSelect={() => setSelectedId(viz.id)} />
              ))}
              {filteredVisualizations.length === 0 && (
                <div className="rounded-xl border border-slate-200 bg-white/75 p-3 text-sm font-bold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">No formula matches this filter.</div>
              )}
            </div>
          </>
        }
        scene={
          <VisualizationPanel
          config={active}
          teachingMode={teachingMode}
          mode={angleMode}
          setAngleMode={setAngleMode}
          thetaDeg={thetaDeg}
          setThetaDeg={setThetaDeg}
          aDeg={aDeg}
          setADeg={setADeg}
          bDeg={bDeg}
          setBDeg={setBDeg}
          amplitude={amplitude}
          setAmplitude={setAmplitude}
          frequency={frequency}
          setFrequency={setFrequency}
          phaseDeg={phaseDeg}
          setPhaseDeg={setPhaseDeg}
          onReset={reset}
          isPlaying={isPlaying}
          setIsPlaying={setIsPlaying}
          speed={speed}
          setSpeed={setSpeed}
        />
        }
      />
    </SectionCard>
  );
}

function VisualizationPanel({
  config,
  teachingMode,
  mode,
  setAngleMode,
  thetaDeg,
  setThetaDeg,
  aDeg,
  setADeg,
  bDeg,
  setBDeg,
  amplitude,
  setAmplitude,
  frequency,
  setFrequency,
  phaseDeg,
  setPhaseDeg,
  onReset,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
}: {
  config: VizConfig;
  teachingMode: TeachingMode;
  mode: AngleMode;
  setAngleMode: (mode: AngleMode) => void;
  thetaDeg: number;
  setThetaDeg: (value: number) => void;
  aDeg: number;
  setADeg: (value: number) => void;
  bDeg: number;
  setBDeg: (value: number) => void;
  amplitude: number;
  setAmplitude: (value: number) => void;
  frequency: number;
  setFrequency: (value: number) => void;
  phaseDeg: number;
  setPhaseDeg: (value: number) => void;
  onReset: () => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  speed: number;
  setSpeed: (value: number) => void;
}) {
  const theta = degreesToRadians(thetaDeg);
  const a = degreesToRadians(aDeg);
  const b = degreesToRadians(bDeg);
  const values = useMemo(() => buildValues(config.id, theta, a, b, amplitude, frequency, degreesToRadians(phaseDeg)), [a, amplitude, b, config.id, frequency, phaseDeg, theta]);
  const isWave = config.id === "wave-transform";
  const modeSummary = teachingMode === "beginner" ? beginnerSummary(config) : config.summary;
  const advanced = teachingMode === "professor" ? `${values.advanced} ${professorNote(config)}` : values.advanced;

  return (
    <div className={`min-w-0 space-y-3 ${teachingMode === "beginner" ? "text-[1.03rem]" : ""}`}>
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
        <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/40">
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">{config.category}</p>
              <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">{config.title}</h2>
            </div>
            <span className="rounded-lg bg-violet-100 px-2 py-1 font-mono text-xs font-black text-violet-700 dark:bg-violet-400/15 dark:text-violet-100">{config.formula}</span>
          </div>
          <MainVisual id={config.id} theta={theta} thetaDeg={thetaDeg} a={a} aDeg={aDeg} b={b} bDeg={bDeg} amplitude={amplitude} frequency={frequency} phaseDeg={phaseDeg} />
        </div>
        <div className="space-y-3">
          <TeachingModeBanner mode={teachingMode} />
          <SmartFormulaCard title={config.title} formula={config.formula} basic={modeSummary} advanced={advanced} highlight={values.highlight} initialMode={teachingMode === "professor" ? "advanced" : "basic"} />
          <IdentityProofPanel formula={values.dynamicFormula} result={values.result} lhs={values.lhs} rhs={values.rhs} />
          <TrigValueTable rows={values.rows} />
          <StepByStepExplanation steps={values.steps} summary={modeSummary} beginner={teachingMode === "beginner"} />
        </div>
      </div>
      <AngleControlPanel
        mode={mode}
        onModeChange={setAngleMode}
        showTheta={!isWave}
        thetaDeg={thetaDeg}
        setThetaDeg={setThetaDeg}
        showAB={Boolean(config.needsAB)}
        aDeg={aDeg}
        setADeg={setADeg}
        bDeg={bDeg}
        setBDeg={setBDeg}
        showWave={isWave}
        amplitude={amplitude}
        setAmplitude={setAmplitude}
        frequency={frequency}
        setFrequency={setFrequency}
        phaseDeg={phaseDeg}
        setPhaseDeg={setPhaseDeg}
        onReset={onReset}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        speed={speed}
        setSpeed={setSpeed}
      />
    </div>
  );
}

function MainVisual({ id, theta, thetaDeg, a, aDeg, b, bDeg, amplitude, frequency, phaseDeg }: { id: VizId; theta: number; thetaDeg: number; a: number; aDeg: number; b: number; bDeg: number; amplitude: number; frequency: number; phaseDeg: number }) {
  if (id === "quadrants") return <QuadrantSignScene theta={theta} thetaDeg={thetaDeg} />;
  if (id === "pythagorean") return <PythagoreanIdentityScene theta={theta} thetaDeg={thetaDeg} />;
  if (id === "sin-plus-cos") return <SinCosSumScene theta={theta} />;
  if (id === "sin-square") return <SquareProjectionScene theta={theta} thetaDeg={thetaDeg} kind="sin" />;
  if (id === "cos-square") return <SquareProjectionScene theta={theta} thetaDeg={thetaDeg} kind="cos" />;
  if (id === "tan-ratio") return <TangentRatioScene theta={theta} thetaDeg={thetaDeg} />;
  if (id === "sec-reciprocal") return <ReciprocalScene theta={theta} thetaDeg={thetaDeg} kind="sec" />;
  if (id === "csc-reciprocal") return <ReciprocalScene theta={theta} thetaDeg={thetaDeg} kind="csc" />;
  if (id === "cot-ratio") return <CotangentRatioScene theta={theta} thetaDeg={thetaDeg} />;
  if (id === "wave-transform") return <TrigGraphScene title={`y = ${fmtNumber(amplitude)} sin(${fmtNumber(frequency)}x + ${phaseDeg}°)`} theta={degreesToRadians(phaseDeg)} series={[{ label: "a sin(bx + c)", color: "#22d3ee", fn: (x) => amplitude * Math.sin(frequency * x + degreesToRadians(phaseDeg)) }]} yMin={-3.2} yMax={3.2} />;
  if (id === "curve-compare") return <TrigGraphScene title="Parent curves" theta={theta} series={[{ label: "sinθ", color: "#22d3ee", fn: Math.sin }, { label: "cosθ", color: "#f59e0b", fn: Math.cos }, { label: "tanθ", color: "#a78bfa", fn: safeTanForGraph }]} yMin={-3} yMax={3} />;
  if (["sin-add", "cos-add", "sin-sub", "cos-sub"].includes(id)) return <AngleAdditionScene id={id} a={a} aDeg={aDeg} b={b} bDeg={bDeg} />;
  if (["sin-double", "cos-double", "cos-double-sin", "cos-double-cos", "tan-double"].includes(id)) return <DoubleAngleScene id={id} theta={theta} thetaDeg={thetaDeg} />;
  if (["sin-complement", "cos-complement", "tan-complement", "cot-complement", "sec-complement", "csc-complement"].includes(id)) return <ComplementaryAngleScene id={id} thetaDeg={thetaDeg} />;
  return <UnitCircleScene theta={theta} thetaDeg={thetaDeg} mode={id} />;
}

function PythagoreanIdentityScene({ theta, thetaDeg }: { theta: number; thetaDeg: number }) {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const sinSquare = sin * sin;
  const cosSquare = cos * cos;
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <UnitCircleScene theta={theta} thetaDeg={thetaDeg} mode="pythagorean" />
        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-sm font-black text-white">Pythagoras in one glance</p>
          <svg viewBox="0 0 280 280" className="mt-2 h-[280px] w-full">
            <rect width="280" height="280" fill="#020617" />
            <polygon points="38,222 218,222 218,82" fill="#0f2c40" stroke="#67e8f9" strokeWidth="2" />
            <line x1="38" y1="222" x2="218" y2="222" stroke="#22d3ee" strokeWidth="6" />
            <line x1="218" y1="222" x2="218" y2="82" stroke="#f59e0b" strokeWidth="6" />
            <line x1="38" y1="222" x2="218" y2="82" stroke="#a78bfa" strokeWidth="6" />
            <text x="104" y="244" fill="#67e8f9" fontSize="13" fontWeight="900">cosθ</text>
            <text x="226" y="154" fill="#fbbf24" fontSize="13" fontWeight="900">sinθ</text>
            <text x="112" y="135" fill="#c4b5fd" fontSize="13" fontWeight="900">radius = 1</text>
            <path d="M 38 222 L 72 222 A 34 34 0 0 0 65 199" fill="none" stroke="#fbbf24" strokeWidth="3" />
            <text x="73" y="211" fill="#fbbf24" fontSize="13" fontWeight="900">θ</text>
          </svg>
        </div>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        <CoreMetric label="cos²θ" value={fmtNumber(cosSquare)} tone="cyan" />
        <CoreMetric label="sin²θ" value={fmtNumber(sinSquare)} tone="amber" />
        <CoreMetric label="cos²θ + sin²θ = 1²" value={`${fmtNumber(cosSquare)} + ${fmtNumber(sinSquare)} = ${fmtNumber(cosSquare + sinSquare)}`} tone="violet" />
      </div>
    </div>
  );
}

function SinCosSumScene({ theta }: { theta: number }) {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const sum = sin + cos;
  return (
    <div className="grid gap-3">
      <div className="grid gap-2 sm:grid-cols-3">
        <SignedBar label="sinθ component" value={sin} color="#f59e0b" range={1.5} />
        <SignedBar label="cosθ component" value={cos} color="#22d3ee" range={1.5} />
        <SignedBar label="combined sinθ + cosθ" value={sum} color="#a78bfa" range={1.5} />
      </div>
      <TrigGraphScene title="sinθ + cosθ = √2 sin(θ + 45°)" theta={theta} series={[{ label: "sinθ + cosθ", color: "#a78bfa", fn: (x) => Math.sin(x) + Math.cos(x) }, { label: "√2 sin(θ+45°)", color: "#22d3ee", fn: (x) => Math.SQRT2 * Math.sin(x + Math.PI / 4) }]} yMin={-1.6} yMax={1.6} />
      <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm leading-5 text-slate-700 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-slate-300">
        Maximum is √2 when the two components support each other equally at 45°. Minimum is -√2 when both point downward together at 225°.
      </div>
    </div>
  );
}

function SquareProjectionScene({ theta, thetaDeg, kind }: { theta: number; thetaDeg: number; kind: "sin" | "cos" }) {
  const value = kind === "sin" ? Math.sin(theta) : Math.cos(theta);
  const area = value * value;
  const side = Math.max(12, Math.abs(value) * 138);
  const label = kind === "sin" ? "sinθ" : "cosθ";
  const color = kind === "sin" ? "#f59e0b" : "#22d3ee";
  const graphFn = kind === "sin" ? (x: number) => Math.sin(x) ** 2 : (x: number) => Math.cos(x) ** 2;
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
      <UnitCircleScene theta={theta} thetaDeg={thetaDeg} mode={kind === "sin" ? "sin-square" : "cos-square"} />
      <div className="grid gap-3">
        <div className="rounded-xl bg-slate-950 p-3">
          <p className="text-sm font-black text-white">{label} becomes an area</p>
          <svg viewBox="0 0 260 220" className="h-[220px] w-full">
            <rect width="260" height="220" fill="#020617" />
            <line x1="24" y1="184" x2="236" y2="184" stroke="#475569" />
            <rect x="58" y={184 - side} width={side} height={side} fill={color} opacity="0.58" stroke="#f8fafc" strokeWidth="2" />
            <text x="58" y={202} fill="#e2e8f0" fontSize="12" fontWeight="900">side = |{label}| = {fmtNumber(Math.abs(value))}</text>
            <text x="58" y="30" fill="#f8fafc" fontSize="14" fontWeight="900">area = {label}² = {fmtNumber(area)}</text>
          </svg>
        </div>
        <TrigGraphScene title={`${label}² is always non-negative`} theta={theta} series={[{ label: `${label}²`, color, fn: graphFn }]} yMin={-0.1} yMax={1.1} />
      </div>
    </div>
  );
}

function TangentRatioScene({ theta, thetaDeg }: { theta: number; thetaDeg: number }) {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const tan = safeTan(theta);
  const undefinedTan = tan === null;
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <UnitCircleScene theta={theta} thetaDeg={thetaDeg} mode="tan-ratio" />
        <RightTriangleScene theta={theta} />
      </div>
      <div className={`rounded-xl border p-3 ${undefinedTan ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-300/30 dark:bg-rose-400/10 dark:text-rose-100" : "border-slate-200 bg-white/75 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}>
        <p className="text-sm font-black">tanθ = sinθ / cosθ</p>
        <p className="mt-1 font-mono text-sm">{fmtNumber(sin)} / {fmtNumber(cos)} = {fmt(tan)}</p>
        <p className="mt-2 text-xs leading-5">{undefinedTan ? "cosθ is 0, so the denominator disappears. Tangent is undefined here." : "The tangent height on the line x = 1 matches the sine-over-cosine ratio."}</p>
      </div>
    </div>
  );
}

function ReciprocalScene({ theta, thetaDeg, kind }: { theta: number; thetaDeg: number; kind: "sec" | "csc" }) {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const value = kind === "sec" ? safeSec(theta) : safeCsc(theta);
  const denominator = kind === "sec" ? cos : sin;
  const label = kind === "sec" ? "secθ" : "cosecθ";
  const denominatorLabel = kind === "sec" ? "cosθ" : "sinθ";
  const color = kind === "sec" ? "#22d3ee" : "#f59e0b";
  const undefinedValue = value === null;
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
      <UnitCircleScene theta={theta} thetaDeg={thetaDeg} mode="unit-circle" />
      <div className="rounded-xl bg-slate-950 p-3">
        <p className="text-sm font-black text-white">Reciprocal length model</p>
        <svg viewBox="0 0 300 260" className="h-[260px] w-full">
          <rect width="300" height="260" fill="#020617" />
          <line x1="34" x2="266" y1="130" y2="130" stroke="#475569" />
          <line x1="150" x2="150" y1="24" y2="236" stroke="#475569" />
          <circle cx="150" cy="130" r="74" fill="#0f2c40" stroke="#67e8f9" strokeWidth="2" />
          <line x1="150" y1="130" x2={150 + cos * 74} y2={130 - sin * 74} stroke="#a78bfa" strokeWidth="4" />
          <line x1="150" y1="130" x2={kind === "sec" ? 150 + cos * 74 : 150} y2={kind === "sec" ? 130 : 130 - sin * 74} stroke={color} strokeWidth="6" />
          {!undefinedValue && (
            <line x1="150" y1="130" x2={kind === "sec" ? 150 + Math.sign(cos || 1) * Math.min(118, Math.abs(value) * 28) : 150} y2={kind === "csc" ? 130 - Math.sign(sin || 1) * Math.min(118, Math.abs(value) * 28) : 130} stroke="#c4b5fd" strokeWidth="5" strokeDasharray="7 5" />
          )}
          <text x="24" y="28" fill="#e2e8f0" fontSize="12" fontWeight="900">{label} = 1 / {denominatorLabel}</text>
          <text x="24" y="48" fill={undefinedValue ? "#fda4af" : "#c4b5fd"} fontSize="12" fontWeight="900">{fmt(value)}</text>
        </svg>
        <p className={`mt-2 rounded-lg p-2 text-xs leading-5 ${undefinedValue ? "bg-rose-400/10 text-rose-100" : "bg-white/10 text-slate-200"}`}>
          {undefinedValue ? `${denominatorLabel} is 0, so ${label} is undefined.` : `The violet reciprocal segment grows when ${denominatorLabel} gets small. Current denominator: ${fmtNumber(denominator)}.`}
        </p>
      </div>
    </div>
  );
}

function CotangentRatioScene({ theta, thetaDeg }: { theta: number; thetaDeg: number }) {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const cot = safeCot(theta);
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <UnitCircleScene theta={theta} thetaDeg={thetaDeg} mode="unit-circle" />
        <RightTriangleScene theta={theta} />
      </div>
      <div className={`rounded-xl border p-3 ${cot === null ? "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-300/30 dark:bg-rose-400/10 dark:text-rose-100" : "border-slate-200 bg-white/75 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"}`}>
        <p className="text-sm font-black">cotθ = cosθ / sinθ = 1 / tanθ</p>
        <p className="mt-1 font-mono text-sm">{fmtNumber(cos)} / {fmtNumber(sin)} = {fmt(cot)}</p>
        <p className="mt-2 text-xs leading-5">{cot === null ? "sinθ is 0, so the rise is zero and cotangent is undefined." : "Cotangent measures run divided by rise. It is tangent turned upside down."}</p>
      </div>
    </div>
  );
}

function UnitCircleScene({ theta, thetaDeg, mode }: { theta: number; thetaDeg: number; mode: VizId }) {
  const cx = 190;
  const cy = 170;
  const r = 118;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const px = cx + cos * r;
  const py = cy - sin * r;
  const arcEnd = { x: cx + Math.cos(theta) * 36, y: cy - Math.sin(theta) * 36 };
  const showTan = ["tan-ratio", "tan-sec", "unit-circle", "tan-double"].includes(mode);
  const showSquares = ["pythagorean", "sin-square", "cos-square", "cos-double"].includes(mode);
  const tanValue = safeTan(theta);
  const tanY = tanValue === null ? null : cy - tanValue * r;
  const secondTheta = ["sin-double", "cos-double", "tan-double"].includes(mode);
  const doubleX = cx + Math.cos(theta * 2) * r;
  const doubleY = cy - Math.sin(theta * 2) * r;
  const complement = ["sin-complement", "cos-complement"].includes(mode) ? degreesToRadians(90 - thetaDeg) : null;
  const complementX = complement === null ? null : cx + Math.cos(complement) * r;
  const complementY = complement === null ? null : cy - Math.sin(complement) * r;
  const squareCos = Math.max(12, Math.abs(cos) * 54);
  const squareSin = Math.max(12, Math.abs(sin) * 54);

  return (
    <svg viewBox="0 0 520 360" className="h-[360px] w-full rounded-xl bg-slate-950">
      <defs>
        <filter id="trig-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width="520" height="360" fill="#020617" />
      <line x1="36" x2="344" y1={cy} y2={cy} stroke="#94a3b8" strokeOpacity="0.65" />
      <line x1={cx} x2={cx} y1="24" y2="322" stroke="#94a3b8" strokeOpacity="0.65" />
      <circle cx={cx} cy={cy} r={r} fill="#0f2c40" stroke="#22d3ee" strokeWidth="3" />
      <path d={`M ${cx + 36} ${cy} A 36 36 0 ${Math.abs(thetaDeg) > 180 ? 1 : 0} ${thetaDeg < 0 ? 1 : 0} ${arcEnd.x} ${arcEnd.y}`} fill="none" stroke="#f59e0b" strokeWidth="4" />
      <line x1={cx} y1={cy} x2={px} y2={py} stroke="#a78bfa" strokeWidth="4" filter="url(#trig-glow)" />
      {secondTheta && <line x1={cx} y1={cy} x2={doubleX} y2={doubleY} stroke="#f472b6" strokeWidth="3" strokeDasharray="7 5" />}
      {complementX !== null && complementY !== null && <line x1={cx} y1={cy} x2={complementX} y2={complementY} stroke="#f472b6" strokeWidth="3" strokeDasharray="7 5" />}
      <line x1={cx} y1={cy} x2={px} y2={cy} stroke="#22d3ee" strokeWidth="5" />
      <line x1={px} y1={cy} x2={px} y2={py} stroke="#f59e0b" strokeWidth="5" />
      <circle cx={px} cy={py} r="7" fill="#f8fafc" stroke="#a78bfa" strokeWidth="3" />
      <text x={(cx + px) / 2 - 8} y={cy + 22} fill="#67e8f9" fontSize="13" fontWeight="800">cosθ</text>
      <text x={px + 8} y={(cy + py) / 2} fill="#fbbf24" fontSize="13" fontWeight="800">sinθ</text>
      <text x={cx + 34} y={cy - 14} fill="#fbbf24" fontSize="13" fontWeight="800">θ</text>
      {showTan && (
        <>
          <line x1={cx + r} y1="34" x2={cx + r} y2="306" stroke="#a78bfa" strokeDasharray="6 5" />
          {tanY !== null && <line x1={cx + r} y1={cy} x2={cx + r} y2={tanY} stroke="#a78bfa" strokeWidth="5" />}
          {tanY !== null && <line x1={cx} y1={cy} x2={cx + r} y2={tanY} stroke="#c4b5fd" strokeWidth="2" strokeDasharray="5 5" />}
          <text x={cx + r + 10} y={tanY === null ? 44 : Math.max(44, Math.min(302, (cy + tanY) / 2))} fill="#c4b5fd" fontSize="13" fontWeight="800">tanθ</text>
        </>
      )}
      {showSquares && (
        <AreaSquareScene x={372} y={48} squareCos={squareCos} squareSin={squareSin} cos={cos} sin={sin} />
      )}
    </svg>
  );
}

function AreaSquareScene({ x, y, squareCos, squareSin, cos, sin }: { x: number; y: number; squareCos: number; squareSin: number; cos: number; sin: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <text x="0" y="-12" fill="#e2e8f0" fontSize="13" fontWeight="900">Area model</text>
      <rect x="0" y="0" width={squareCos} height={squareCos} fill="#22d3ee" opacity="0.55" stroke="#67e8f9" />
      <text x="68" y="24" fill="#67e8f9" fontSize="12" fontWeight="800">cos²θ = {fmtNumber(cos * cos)}</text>
      <rect x="0" y="92" width={squareSin} height={squareSin} fill="#f59e0b" opacity="0.6" stroke="#fbbf24" />
      <text x="68" y="116" fill="#fbbf24" fontSize="12" fontWeight="800">sin²θ = {fmtNumber(sin * sin)}</text>
      <rect x="0" y="150" width="54" height="54" fill="#a78bfa" opacity="0.5" stroke="#c4b5fd" />
      <text x="68" y="180" fill="#f8fafc" fontSize="13" fontWeight="900">sum = {fmtNumber(sin * sin + cos * cos)}</text>
    </g>
  );
}

function RightTriangleScene({ theta }: { theta: number }) {
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const tan = safeTan(theta);
  const base = Math.max(42, Math.abs(cos) * 180);
  const height = Math.max(42, Math.abs(sin) * 180);
  return (
    <div className="rounded-xl bg-slate-950 p-3">
      <p className="mb-2 text-sm font-black text-white">Right triangle scene</p>
      <svg viewBox="0 0 260 260" className="h-[260px] w-full">
        <rect width="260" height="260" fill="#020617" />
        <polygon points={`34,214 ${34 + base},214 ${34 + base},${214 - height}`} fill="#0f2c40" stroke="#67e8f9" strokeWidth="2" />
        <line x1="34" y1="214" x2={34 + base} y2="214" stroke="#22d3ee" strokeWidth="5" />
        <line x1={34 + base} y1="214" x2={34 + base} y2={214 - height} stroke="#f59e0b" strokeWidth="5" />
        <line x1="34" y1="214" x2={34 + base} y2={214 - height} stroke="#a78bfa" strokeWidth="4" />
        <path d="M 34 214 L 62 214 A 28 28 0 0 0 56 197" fill="none" stroke="#fbbf24" strokeWidth="3" />
        <text x={34 + base / 2 - 22} y="236" fill="#67e8f9" fontSize="12" fontWeight="900">adjacent</text>
        <text x={42 + base} y={214 - height / 2} fill="#fbbf24" fontSize="12" fontWeight="900">opposite</text>
        <text x={44 + base / 2} y={204 - height / 2} fill="#c4b5fd" fontSize="12" fontWeight="900">hypotenuse</text>
        <text x="34" y="28" fill="#e2e8f0" fontSize="12" fontWeight="900">tanθ = opposite / adjacent = {fmt(tan)}</text>
      </svg>
    </div>
  );
}

function AngleAdditionScene({ id, a, aDeg, b, bDeg }: { id: VizId; a: number; aDeg: number; b: number; bDeg: number }) {
  const sign = id.endsWith("sub") ? -1 : 1;
  const combined = a + sign * b;
  const combinedDeg = aDeg + sign * bDeg;
  const kind = id.startsWith("sin") ? "sin" : "cos";
  const direct = kind === "sin" ? Math.sin(combined) : Math.cos(combined);
  const expansion = expandedAngleValue(id, a, b);
  const expression = angleExpansionText(id);
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <TwoAngleArmScene a={a} aDeg={aDeg} b={b} bDeg={bDeg} sign={sign} />
        <div className="grid gap-3">
          <VisualProofCard
            title="Visual proof panel"
            directLabel={`${kind}(${fmtNumber(aDeg)}° ${sign > 0 ? "+" : "-"} ${fmtNumber(Math.abs(bDeg))}°)`}
            direct={direct}
            expansionLabel={expression}
            expansion={expansion}
          />
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-slate-700 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-slate-200">
            <p className="font-black text-amber-800 dark:text-amber-100">What is happening?</p>
            <p className="mt-1">A and B are two angles. We are combining them to make <span className="font-mono font-black">{fmtNumber(combinedDeg)}°</span>.</p>
            <p className="mt-1">The formula gives the same answer without directly calculating A {sign > 0 ? "+" : "-"} B.</p>
          </div>
        </div>
      </div>
      <TrigGraphScene
        title={`${kind}(A ${sign > 0 ? "+" : "-"} B) and its expansion match`}
        theta={combined}
        series={[{ label: "direct combined angle", color: "#22d3ee", fn: (x) => kind === "sin" ? Math.sin(x) : Math.cos(x) }]}
        yMin={-1.15}
        yMax={1.15}
      />
    </div>
  );
}

function TwoAngleArmScene({ a, aDeg, bDeg, sign }: { a: number; aDeg: number; b: number; bDeg: number; sign: number }) {
  const cx = 220;
  const cy = 180;
  const r = 132;
  const bSigned = degreesToRadians(sign * bDeg);
  const combined = a + bSigned;
  const endA = polarPoint(cx, cy, r, a);
  const endCombined = polarPoint(cx, cy, r, combined);
  const endBFromA = polarPoint(endA.x, endA.y, 52, combined);
  const aArc = polarPoint(cx, cy, 48, a);
  const combinedArc = polarPoint(cx, cy, 76, combined);
  return (
    <svg viewBox="0 0 520 360" className="h-[360px] w-full rounded-xl bg-slate-950">
      <rect width="520" height="360" fill="#020617" />
      <line x1="42" x2="366" y1={cy} y2={cy} stroke="#64748b" />
      <line x1={cx} x2={cx} y1="30" y2="320" stroke="#334155" />
      <circle cx={cx} cy={cy} r={r} fill="#0f2c40" stroke="#22d3ee" strokeWidth="2" />
      <path d={`M ${cx + 48} ${cy} A 48 48 0 0 ${aDeg < 0 ? 1 : 0} ${aArc.x} ${aArc.y}`} fill="none" stroke="#22d3ee" strokeWidth="5" />
      <path d={`M ${cx + 76} ${cy} A 76 76 0 ${Math.abs(aDeg + sign * bDeg) > 180 ? 1 : 0} ${aDeg + sign * bDeg < 0 ? 1 : 0} ${combinedArc.x} ${combinedArc.y}`} fill="none" stroke="#a78bfa" strokeWidth="4" strokeDasharray="8 6" />
      <line x1={cx} y1={cy} x2={endA.x} y2={endA.y} stroke="#22d3ee" strokeWidth="5" />
      <line x1={cx} y1={cy} x2={endCombined.x} y2={endCombined.y} stroke="#a78bfa" strokeWidth="5" />
      <line x1={endA.x} y1={endA.y} x2={endBFromA.x} y2={endBFromA.y} stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 5" />
      <line x1={endCombined.x} y1={cy} x2={endCombined.x} y2={endCombined.y} stroke="#f59e0b" strokeWidth="4" />
      <line x1={cx} y1={cy} x2={endCombined.x} y2={cy} stroke="#67e8f9" strokeWidth="4" />
      <circle cx={endA.x} cy={endA.y} r="6" fill="#22d3ee" />
      <circle cx={endCombined.x} cy={endCombined.y} r="7" fill="#f8fafc" stroke="#a78bfa" strokeWidth="3" />
      <text x="24" y="32" fill="#e2e8f0" fontSize="14" fontWeight="900">Two rotating arms</text>
      <text x={cx + 54} y={cy - 16} fill="#67e8f9" fontSize="13" fontWeight="900">A = {fmtNumber(aDeg)}°</text>
      <text x={endA.x + 8} y={endA.y - 8} fill="#fbbf24" fontSize="13" fontWeight="900">B = {fmtNumber(Math.abs(bDeg))}°</text>
      <text x={endCombined.x + 8} y={endCombined.y + 18} fill="#c4b5fd" fontSize="13" fontWeight="900">A {sign > 0 ? "+" : "-"} B</text>
      <text x="374" y="72" fill="#67e8f9" fontSize="12" fontWeight="900">cos(A±B) projection</text>
      <text x="374" y="96" fill="#fbbf24" fontSize="12" fontWeight="900">sin(A±B) projection</text>
      <text x="374" y="126" fill="#c4b5fd" fontSize="12" fontWeight="900">combined angle = {fmtNumber(aDeg + sign * bDeg)}°</text>
    </svg>
  );
}

function DoubleAngleScene({ id, theta, thetaDeg }: { id: VizId; theta: number; thetaDeg: number }) {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const tan = safeTan(theta);
  const directTan = safeTan(2 * theta);
  const rhsTan = tan === null || Math.abs(1 - tan * tan) < EPSILON ? null : (2 * tan) / (1 - tan * tan);
  const variants = {
    "sin-double": { title: "sin(2θ)", direct: Math.sin(2 * theta), expansionLabel: "2sinθcosθ", expansion: 2 * sin * cos, color: "#f59e0b" },
    "cos-double": { title: "cos(2θ)", direct: Math.cos(2 * theta), expansionLabel: "cos²θ - sin²θ", expansion: cos * cos - sin * sin, color: "#a78bfa" },
    "cos-double-sin": { title: "cos(2θ)", direct: Math.cos(2 * theta), expansionLabel: "1 - 2sin²θ", expansion: 1 - 2 * sin * sin, color: "#f59e0b" },
    "cos-double-cos": { title: "cos(2θ)", direct: Math.cos(2 * theta), expansionLabel: "2cos²θ - 1", expansion: 2 * cos * cos - 1, color: "#22d3ee" },
    "tan-double": { title: "tan(2θ)", direct: directTan, expansionLabel: "2tanθ / (1 - tan²θ)", expansion: rhsTan, color: "#a78bfa" },
  } as const;
  const item = variants[id as keyof typeof variants] ?? variants["sin-double"];
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <DoubleArmScene theta={theta} thetaDeg={thetaDeg} color={item.color} />
        <div className="grid gap-3">
          <VisualProofCard title="Direct vs expanded" directLabel={item.title} direct={item.direct} expansionLabel={item.expansionLabel} expansion={item.expansion} />
          <div className="grid gap-2 sm:grid-cols-2">
            <CoreMetric label="θ added once" value={`${fmtNumber(thetaDeg)}°`} tone="cyan" />
            <CoreMetric label="θ + θ = 2θ" value={`${fmtNumber(thetaDeg * 2)}°`} tone="violet" />
            <CoreMetric label="sin²θ" value={fmtNumber(sin * sin)} tone="amber" />
            <CoreMetric label="cos²θ" value={fmtNumber(cos * cos)} tone="cyan" />
          </div>
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-slate-700 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-slate-200">
            <span className="font-black">What is happening?</span> Double angle means θ is added to itself. The violet arm shows 2θ, while the formula computes the same value using only θ.
          </p>
        </div>
      </div>
      <TrigGraphScene title={`${item.title} compared with ${item.expansionLabel}`} theta={2 * theta} series={[{ label: item.title, color: "#22d3ee", fn: (x) => id === "tan-double" ? safeTanForGraph(x) : id === "sin-double" ? Math.sin(x) : Math.cos(x) }]} yMin={id === "tan-double" ? -3 : -1.15} yMax={id === "tan-double" ? 3 : 1.15} />
    </div>
  );
}

function DoubleArmScene({ theta, thetaDeg, color }: { theta: number; thetaDeg: number; color: string }) {
  const cx = 220;
  const cy = 180;
  const r = 132;
  const first = polarPoint(cx, cy, r, theta);
  const doubled = polarPoint(cx, cy, r, 2 * theta);
  const thetaArc = polarPoint(cx, cy, 50, theta);
  const doubleArc = polarPoint(cx, cy, 82, 2 * theta);
  return (
    <svg viewBox="0 0 520 360" className="h-[360px] w-full rounded-xl bg-slate-950">
      <rect width="520" height="360" fill="#020617" />
      <line x1="42" x2="366" y1={cy} y2={cy} stroke="#64748b" />
      <line x1={cx} x2={cx} y1="30" y2="320" stroke="#334155" />
      <circle cx={cx} cy={cy} r={r} fill="#0f2c40" stroke="#22d3ee" strokeWidth="2" />
      <path d={`M ${cx + 50} ${cy} A 50 50 0 0 ${thetaDeg < 0 ? 1 : 0} ${thetaArc.x} ${thetaArc.y}`} fill="none" stroke="#22d3ee" strokeWidth="5" />
      <path d={`M ${cx + 82} ${cy} A 82 82 0 ${Math.abs(thetaDeg * 2) > 180 ? 1 : 0} ${thetaDeg * 2 < 0 ? 1 : 0} ${doubleArc.x} ${doubleArc.y}`} fill="none" stroke={color} strokeWidth="5" strokeDasharray="8 6" />
      <line x1={cx} y1={cy} x2={first.x} y2={first.y} stroke="#22d3ee" strokeWidth="5" />
      <line x1={cx} y1={cy} x2={doubled.x} y2={doubled.y} stroke={color} strokeWidth="5" />
      <line x1={doubled.x} y1={cy} x2={doubled.x} y2={doubled.y} stroke="#f59e0b" strokeWidth="4" />
      <line x1={cx} y1={cy} x2={doubled.x} y2={cy} stroke="#67e8f9" strokeWidth="4" />
      <circle cx={first.x} cy={first.y} r="6" fill="#22d3ee" />
      <circle cx={doubled.x} cy={doubled.y} r="7" fill="#f8fafc" stroke={color} strokeWidth="3" />
      <text x="24" y="32" fill="#e2e8f0" fontSize="14" fontWeight="900">Double angle: θ + θ</text>
      <text x={cx + 54} y={cy - 16} fill="#67e8f9" fontSize="13" fontWeight="900">θ = {fmtNumber(thetaDeg)}°</text>
      <text x={doubled.x + 8} y={doubled.y + 18} fill="#c4b5fd" fontSize="13" fontWeight="900">2θ = {fmtNumber(thetaDeg * 2)}°</text>
      <text x="374" y="72" fill="#67e8f9" fontSize="12" fontWeight="900">cos(2θ) projection</text>
      <text x="374" y="96" fill="#fbbf24" fontSize="12" fontWeight="900">sin(2θ) projection</text>
    </svg>
  );
}

function VisualProofCard({ title, directLabel, direct, expansionLabel, expansion }: { title: string; directLabel: string; direct: number | null; expansionLabel: string; expansion: number | null }) {
  const directText = fmt(direct);
  const expansionText = fmt(expansion);
  const match = direct !== null && expansion !== null && Math.abs(direct - expansion) < 0.001;
  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-400/10">
      <p className="text-sm font-black text-cyan-800 dark:text-cyan-100">{title}</p>
      <div className="mt-2 grid gap-2">
        <ProofMetric label={`Direct value: ${directLabel}`} value={directText} />
        <ProofMetric label={`Expansion: ${expansionLabel}`} value={expansionText} />
      </div>
      <p className={`mt-2 text-xs font-black ${match ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}>
        Match: {match ? "yes" : "undefined edge case"}
      </p>
    </div>
  );
}

function ComplementaryAngleScene({ id, thetaDeg }: { id: VizId; thetaDeg: number }) {
  const acuteThetaDeg = clamp(thetaDeg, 0, 90);
  const acuteTheta = degreesToRadians(acuteThetaDeg);
  const complementDeg = 90 - acuteThetaDeg;
  const complement = degreesToRadians(complementDeg);
  const sin = Math.sin(acuteTheta);
  const cos = Math.cos(acuteTheta);
  const tan = safeTan(acuteTheta);
  const cot = safeCot(acuteTheta);
  const sec = safeSec(acuteTheta);
  const csc = safeCsc(acuteTheta);
  const direct = complementaryDirectValue(id, complement);
  const partner = complementaryPartnerValue(id, acuteTheta);
  return (
    <div className="grid gap-3">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_310px]">
        <svg viewBox="0 0 560 360" className="h-[360px] w-full rounded-xl bg-slate-950">
          <rect width="560" height="360" fill="#020617" />
          <polygon points="74,282 414,282 414,72" fill="#0f2c40" stroke="#67e8f9" strokeWidth="2" />
          <line x1="74" y1="282" x2="414" y2="282" stroke="#22d3ee" strokeWidth="7" />
          <line x1="414" y1="282" x2="414" y2="72" stroke="#f59e0b" strokeWidth="7" />
          <line x1="74" y1="282" x2="414" y2="72" stroke="#a78bfa" strokeWidth="6" />
          <path d="M 74 282 L 126 282 A 52 52 0 0 0 118 250" fill="none" stroke="#22d3ee" strokeWidth="4" />
          <path d="M 414 72 L 384 91 A 58 58 0 0 0 414 130" fill="none" stroke="#f59e0b" strokeWidth="4" />
          <rect x="390" y="258" width="24" height="24" fill="none" stroke="#e2e8f0" strokeWidth="3" />
          <text x="126" y="268" fill="#67e8f9" fontSize="15" fontWeight="900">θ = {fmtNumber(acuteThetaDeg)}°</text>
          <text x="288" y="112" fill="#fbbf24" fontSize="15" fontWeight="900">90° - θ = {fmtNumber(complementDeg)}°</text>
          <text x="204" y="310" fill="#67e8f9" fontSize="14" fontWeight="900">adjacent to θ = cosθ</text>
          <text x="424" y="190" fill="#fbbf24" fontSize="14" fontWeight="900">opposite to θ = sinθ</text>
          <text x="174" y="160" fill="#c4b5fd" fontSize="14" fontWeight="900">hypotenuse = 1</text>
          <text x="32" y="38" fill="#e2e8f0" fontSize="15" fontWeight="900">Complementary angles share one right triangle</text>
          <text x="32" y="62" fill="#e2e8f0" fontSize="12" fontWeight="800">When you move to the other acute angle, opposite and adjacent swap roles.</text>
          <line x1="170" y1="320" x2="424" y2="320" stroke="#67e8f9" strokeWidth="3" strokeDasharray="7 5" />
          <line x1="456" y1="240" x2="456" y2="94" stroke="#fbbf24" strokeWidth="3" strokeDasharray="7 5" />
          <text x="186" y="344" fill="#67e8f9" fontSize="12" fontWeight="900">same side becomes opposite for 90° - θ</text>
          <text x="466" y="154" fill="#fbbf24" fontSize="12" fontWeight="900">swap</text>
        </svg>
        <div className="grid gap-3">
          <VisualProofCard title="Complement proof" directLabel={complementaryDirectLabel(id)} direct={direct} expansionLabel={complementaryPartnerLabel(id)} expansion={partner} />
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm leading-5 text-slate-700 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-slate-200">
            <p className="font-black text-amber-800 dark:text-amber-100">Label swap</p>
            <p className="mt-1">For θ, the cyan side is adjacent and the amber side is opposite. For 90° - θ, those same two sides trade names.</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <CoreMetric label="sinθ" value={fmtNumber(sin)} tone="amber" />
            <CoreMetric label="cosθ" value={fmtNumber(cos)} tone="cyan" />
            <CoreMetric label="tanθ" value={fmt(tan)} tone="violet" />
            <CoreMetric label="cotθ" value={fmt(cot)} tone="violet" />
            <CoreMetric label="secθ" value={fmt(sec)} tone="cyan" />
            <CoreMetric label="cosecθ" value={fmt(csc)} tone="amber" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuadrantSignScene({ theta, thetaDeg }: { theta: number; thetaDeg: number }) {
  const normalized = ((thetaDeg % 360) + 360) % 360;
  const quadrant = normalized === 0 || normalized === 90 || normalized === 180 || normalized === 270 ? "Axis" : normalized < 90 ? "I" : normalized < 180 ? "II" : normalized < 270 ? "III" : "IV";
  const cx = 180;
  const cy = 180;
  const r = 130;
  const point = polarPoint(cx, cy, r, theta);
  const signs = [
    { q: "I", astc: "All", sin: "+", cos: "+", tan: "+" },
    { q: "II", astc: "Sine", sin: "+", cos: "-", tan: "-" },
    { q: "III", astc: "Tangent", sin: "-", cos: "-", tan: "+" },
    { q: "IV", astc: "Cosine", sin: "-", cos: "+", tan: "-" },
  ];
  return (
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
      <svg viewBox="0 0 420 420" className="h-[420px] w-full rounded-xl bg-slate-950">
        <rect width="420" height="420" fill="#020617" />
        <rect x="180" y="50" width="130" height="130" fill={quadrant === "I" ? "#164e63" : "#0f172a"} opacity="0.86" />
        <rect x="50" y="50" width="130" height="130" fill={quadrant === "II" ? "#164e63" : "#0f172a"} opacity="0.86" />
        <rect x="50" y="180" width="130" height="130" fill={quadrant === "III" ? "#164e63" : "#0f172a"} opacity="0.86" />
        <rect x="180" y="180" width="130" height="130" fill={quadrant === "IV" ? "#164e63" : "#0f172a"} opacity="0.86" />
        <line x1="40" x2="320" y1={cy} y2={cy} stroke="#94a3b8" strokeWidth="2" />
        <line x1={cx} x2={cx} y1="40" y2="320" stroke="#94a3b8" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#22d3ee" strokeWidth="3" />
        <line x1={cx} y1={cy} x2={point.x} y2={point.y} stroke="#a78bfa" strokeWidth="5" />
        <circle cx={point.x} cy={point.y} r="7" fill="#f8fafc" stroke="#a78bfa" strokeWidth="3" />
        <text x="238" y="92" fill="#e2e8f0" fontSize="16" fontWeight="900">I</text>
        <text x="96" y="92" fill="#e2e8f0" fontSize="16" fontWeight="900">II</text>
        <text x="92" y="270" fill="#e2e8f0" fontSize="16" fontWeight="900">III</text>
        <text x="238" y="270" fill="#e2e8f0" fontSize="16" fontWeight="900">IV</text>
        <text x="218" y="116" fill="#67e8f9" fontSize="12" fontWeight="900">All +</text>
        <text x="82" y="116" fill="#fbbf24" fontSize="12" fontWeight="900">Sine +</text>
        <text x="78" y="292" fill="#c4b5fd" fontSize="12" fontWeight="900">Tangent +</text>
        <text x="218" y="292" fill="#67e8f9" fontSize="12" fontWeight="900">Cosine +</text>
        <text x="334" y="72" fill="#e2e8f0" fontSize="13" fontWeight="900">Current</text>
        <text x="334" y="94" fill="#c4b5fd" fontSize="20" fontWeight="900">{quadrant === "Axis" ? "Axis" : `Q${quadrant}`}</text>
        <text x="334" y="122" fill="#e2e8f0" fontSize="12" fontWeight="900">{fmtNumber(normalized)}°</text>
      </svg>
      <div className="space-y-3">
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-300/20 dark:bg-violet-400/10">
          <p className="text-sm font-black text-violet-900 dark:text-violet-100">ASTC rule</p>
          <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-slate-300">All are positive in Quadrant I. Then Sine, Tangent, and Cosine are positive in Quadrants II, III, and IV.</p>
        </div>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white/80 dark:border-white/10 dark:bg-white/5">
          <div className="grid grid-cols-4 bg-slate-100 text-xs font-black uppercase text-slate-600 dark:bg-slate-900 dark:text-slate-300">
            <div className="p-2">Quadrant</div><div className="p-2">sin</div><div className="p-2">cos</div><div className="p-2">tan</div>
          </div>
          {signs.map((item) => (
            <div key={item.q} className={`grid grid-cols-4 text-sm font-black ${quadrant === item.q ? "bg-cyan-50 text-cyan-900 dark:bg-cyan-400/15 dark:text-cyan-100" : "text-slate-700 dark:text-slate-300"}`}>
              <div className="p-2">Quadrant {item.q}</div><div className="p-2">{item.sin}</div><div className="p-2">{item.cos}</div><div className="p-2">{item.tan}</div>
            </div>
          ))}
        </div>
        <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
          <CoreMetric label="sinθ sign" value={signLabel(Math.sin(theta))} tone="amber" />
          <CoreMetric label="cosθ sign" value={signLabel(Math.cos(theta))} tone="cyan" />
          <CoreMetric label="tanθ sign" value={safeTan(theta) === null ? "undefined" : signLabel(Math.tan(theta))} tone="violet" />
        </div>
      </div>
    </div>
  );
}

function TrigGraphScene({ title, series, yMin, yMax, theta = 0 }: { title: string; series: Array<{ label: string; color: string; fn: (x: number) => number | null }>; yMin: number; yMax: number; theta?: number }) {
  const width = 640;
  const height = 300;
  const xMin = -2 * Math.PI;
  const xMax = 2 * Math.PI;
  const sx = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
  const sy = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;
  const markerTheta = clampToRange(normalizeRadians(theta), xMin, xMax);
  const markerX = sx(markerTheta);
  const paths = series.map((item) => {
    const segments: string[] = [];
    let current = "";
    for (let i = 0; i <= 320; i += 1) {
      const x = xMin + ((xMax - xMin) * i) / 320;
      const y = item.fn(x);
      if (y === null || !Number.isFinite(y) || y < yMin || y > yMax) {
        if (current) segments.push(current);
        current = "";
      } else {
        current += `${current ? " L" : "M"} ${sx(x).toFixed(2)} ${sy(y).toFixed(2)}`;
      }
    }
    if (current) segments.push(current);
    return { ...item, segments };
  });
  return (
    <div className="rounded-xl bg-slate-950 p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-black text-white">{title}</p>
        <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-200">{series.map((item) => <span key={item.label}><span style={{ backgroundColor: item.color }} className="mr-1 inline-block h-2 w-2 rounded-full" />{item.label}</span>)}</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-[300px] w-full">
        <rect width={width} height={height} fill="#020617" />
        <line x1="0" x2={width} y1={sy(0)} y2={sy(0)} stroke="#64748b" />
        <line x1={sx(0)} x2={sx(0)} y1="0" y2={height} stroke="#64748b" />
        {[-Math.PI, Math.PI].map((x) => <line key={x} x1={sx(x)} x2={sx(x)} y1="0" y2={height} stroke="#334155" strokeDasharray="4 6" />)}
        <line x1={markerX} x2={markerX} y1="0" y2={height} stroke="#f8fafc" strokeOpacity="0.75" strokeDasharray="5 5" />
        {paths.map((item) => item.segments.map((path, index) => <path key={`${item.label}-${index}`} d={path} fill="none" stroke={item.color} strokeWidth="3" strokeLinecap="round" />))}
        {series.map((item) => {
          const y = item.fn(markerTheta);
          if (y === null || !Number.isFinite(y) || y < yMin || y > yMax) return null;
          return <circle key={`${item.label}-marker`} cx={markerX} cy={sy(y)} r="5" fill={item.color} stroke="#fff" strokeWidth="1.5" />;
        })}
      </svg>
    </div>
  );
}

function buildValues(id: VizId, theta: number, a: number, b: number, amplitude: number, frequency: number, phase: number) {
  const sin = Math.sin(theta);
  const cos = Math.cos(theta);
  const tan = safeTan(theta);
  const cot = safeCot(theta);
  const sec = safeSec(theta);
  const csc = safeCsc(theta);
  const rows = [
    ["sinθ", fmt(sin)],
    ["cosθ", fmt(cos)],
    ["tanθ", fmt(tan)],
    ["θ", `${fmtNumber(radiansToDegrees(theta))}° / ${fmtNumber(theta)} rad`],
  ];
  if (id === "pythagorean") return makeValues("cos²θ + sin²θ = 1²", `${fmtNumber(cos * cos)} + ${fmtNumber(sin * sin)} = ${fmtNumber(cos * cos + sin * sin)}`, rows, ["In the unit circle, the radius is 1.", "The horizontal leg is cosθ.", "The vertical leg is sinθ.", "By Pythagoras, cos²θ + sin²θ = 1².", "Therefore sin²θ + cos²θ = 1."], "This is the same Pythagorean theorem from right triangles, anchored inside the unit circle.", "cos²θ + sin²θ");
  if (id === "sin-plus-cos") return makeValues("sinθ + cosθ = √2 sin(θ + 45°)", `${fmtNumber(sin + cos)} = ${fmtNumber(Math.SQRT2 * Math.sin(theta + Math.PI / 4))}`, rows, ["Read sinθ as the amber component and cosθ as the cyan component.", "Add the signed lengths to get the violet combined bar.", "The sum makes a sine wave shifted left by 45°.", "Its largest possible value is √2 and its smallest is -√2."], "The transformation works because equal sine and cosine coefficients combine into one wave with amplitude √(1²+1²) = √2.", "√2 sin(θ + 45°)");
  if (id === "sin-square") return makeValues("sin²θ = area of a square with side |sinθ|", `${fmtNumber(sin * sin)} = ${fmtNumber(Math.abs(sin))}²`, rows, ["The vertical projection gives sinθ.", "Use the absolute length as the side of a square.", "The area is sin²θ.", "Areas are never negative, so sin²θ stays at or above 0."], "The graph touches 0 when sinθ = 0 and reaches 1 when |sinθ| = 1.", "sin²θ area");
  if (id === "cos-square") return makeValues("cos²θ = area of a square with side |cosθ|", `${fmtNumber(cos * cos)} = ${fmtNumber(Math.abs(cos))}²`, rows, ["The horizontal projection gives cosθ.", "Use the absolute length as the side of a square.", "The area is cos²θ.", "Areas are never negative, so cos²θ stays at or above 0."], "The graph touches 0 when cosθ = 0 and reaches 1 when |cosθ| = 1.", "cos²θ area");
  if (id === "tan-ratio") return makeValues("tanθ = sinθ / cosθ", tan === null ? "undefined" : `${fmtNumber(tan)} = ${fmtNumber(sin)} / ${fmtNumber(cos)}`, rows, ["The vertical projection is sinθ.", "The horizontal projection is cosθ.", "Tangent is rise divided by run.", "On the tangent line x = 1, the matching height is tanθ.", "When cosθ = 0, tangent is undefined."], "Tangent is both a triangle ratio and the slope of the radius line.", "sinθ / cosθ");
  if (id === "sec-reciprocal") return makeValues("secθ = 1 / cosθ", sec === null ? "undefined" : `${fmtNumber(sec)} = 1 / ${fmtNumber(cos)}`, [...rows, ["secθ", fmt(sec)]], ["Cosθ is the horizontal projection.", "Secθ asks: what length has reciprocal relationship with cosθ?", "When cosθ gets small, secθ gets large.", "When cosθ = 0, secθ is undefined."], "Secant is easiest to see as a reciprocal length along the horizontal direction or the secant ray.", "1 / cosθ");
  if (id === "csc-reciprocal") return makeValues("cosecθ = 1 / sinθ", csc === null ? "undefined" : `${fmtNumber(csc)} = 1 / ${fmtNumber(sin)}`, [...rows, ["cosecθ", fmt(csc)]], ["Sinθ is the vertical projection.", "Cosecθ asks for the reciprocal of that sine height.", "When sinθ gets small, cosecθ gets large.", "When sinθ = 0, cosecθ is undefined."], "Cosecant mirrors the secant idea, but uses the vertical sine projection.", "1 / sinθ");
  if (id === "cot-ratio") return makeValues("cotθ = cosθ / sinθ", cot === null ? "undefined" : `${fmtNumber(cot)} = ${fmtNumber(cos)} / ${fmtNumber(sin)}`, [...rows, ["cotθ", fmt(cot)]], ["The horizontal projection is cosθ.", "The vertical projection is sinθ.", "Cotangent is run divided by rise.", "It is also 1 / tanθ.", "When sinθ = 0, cotθ is undefined."], "Cotangent is the reciprocal slope: how much horizontal run for each vertical rise.", "cosθ / sinθ");
  if (id === "tan-sec") return makeValues("1 + tan²θ = sec²θ", sec === null || tan === null ? "undefined" : `${fmtNumber(1 + tan * tan)} = ${fmtNumber(sec * sec)}`, [...rows, ["secθ", fmt(sec)]], ["The tangent line triangle has adjacent side 1.", "Its hypotenuse is secθ, so 1² + tan²θ = sec²θ."]);
  if (id === "cot-csc") return makeValues("1 + cot²θ = cosec²θ", csc === null || cot === null ? "undefined" : `${fmtNumber(1 + cot * cot)} = ${fmtNumber(csc * csc)}`, [...rows, ["cotθ", fmt(cot)], ["cosecθ", fmt(csc)]], ["This is the sine-side reciprocal version.", "When sinθ = 0, cotθ and cosecθ are undefined."]);
  if (["sin-add", "cos-add", "sin-sub", "cos-sub"].includes(id)) return angleValues(id, a, b, rows);
  if (id === "sin-double") return makeValues("Direct value: sin(2θ). Expansion: 2sinθcosθ.", `${fmtNumber(Math.sin(2 * theta))} = ${fmtNumber(2 * sin * cos)}`, [...rows, ["2θ", `${fmtNumber(radiansToDegrees(2 * theta))}°`]], ["Start with one angle θ.", "Add the same angle again, so θ + θ = 2θ.", "Read sin(2θ) from the doubled violet arm.", "The formula 2sinθcosθ gives the same height without measuring 2θ directly."], "Double angle means θ added to itself. The formula reuses the original sine and cosine values.", "2sinθcosθ");
  if (id === "cos-double") return makeValues("Direct value: cos(2θ). Expansion: cos²θ - sin²θ.", `${fmtNumber(Math.cos(2 * theta))} = ${fmtNumber(cos * cos - sin * sin)}`, [...rows, ["2θ", `${fmtNumber(radiansToDegrees(2 * theta))}°`], ["cos²θ - sin²θ", fmtNumber(cos * cos - sin * sin)]], ["Start with one angle θ.", "Add θ again to create 2θ.", "Read cos(2θ) as the horizontal projection of the doubled arm.", "The cyan area cos²θ minus the amber area sin²θ gives the same value."], "This form is an area-difference view of cos(2θ).", "cos²θ - sin²θ");
  if (id === "cos-double-sin") return makeValues("Direct value: cos(2θ). Expansion: 1 - 2sin²θ.", `${fmtNumber(Math.cos(2 * theta))} = ${fmtNumber(1 - 2 * sin * sin)}`, [...rows, ["2θ", `${fmtNumber(radiansToDegrees(2 * theta))}°`], ["1 - 2sin²θ", fmtNumber(1 - 2 * sin * sin)]], ["Use the unit-circle fact sin²θ + cos²θ = 1.", "Replace cos²θ with 1 - sin²θ in cos²θ - sin²θ.", "That becomes 1 - 2sin²θ.", "It still matches the direct cos(2θ) value."], "This version is useful when the sine value is easier to see or calculate.", "1 - 2sin²θ");
  if (id === "cos-double-cos") return makeValues("Direct value: cos(2θ). Expansion: 2cos²θ - 1.", `${fmtNumber(Math.cos(2 * theta))} = ${fmtNumber(2 * cos * cos - 1)}`, [...rows, ["2θ", `${fmtNumber(radiansToDegrees(2 * theta))}°`], ["2cos²θ - 1", fmtNumber(2 * cos * cos - 1)]], ["Use sin²θ + cos²θ = 1 again.", "Replace sin²θ with 1 - cos²θ in cos²θ - sin²θ.", "That becomes 2cos²θ - 1.", "It matches the same doubled-angle projection."], "This version is useful when the cosine value is easier to see or calculate.", "2cos²θ - 1");
  if (id === "tan-double") {
    const lhs = safeTan(2 * theta);
    const rhs = tan === null || Math.abs(1 - tan * tan) < EPSILON ? null : (2 * tan) / (1 - tan * tan);
    return makeValues("Direct value: tan(2θ). Expansion: 2tanθ / (1 - tan²θ).", `${fmt(lhs)} = ${fmt(rhs)}`, [...rows, ["2θ", `${fmtNumber(radiansToDegrees(2 * theta))}°`], ["denominator", fmt(tan === null ? null : 1 - tan * tan)]], ["Start with θ and add θ again.", "Read tan(2θ) as the slope of the doubled arm.", "The expansion uses only tanθ.", "When 1 - tan²θ = 0, the expansion is undefined; that matches tangent's vertical break."], "The denominator safely marks edge cases where the tangent value cannot be displayed.", "2tanθ / (1 - tan²θ)");
  }
  if (["sin-complement", "cos-complement", "tan-complement", "cot-complement", "sec-complement", "csc-complement"].includes(id)) return complementValues(id, theta, rows);
  if (id === "quadrants") return makeValues("ASTC sign table", quadrantName(theta), rows, ["The moving violet arm shows the current angle.", "Check whether the point is above or below the x-axis for sine.", "Check whether the point is right or left of the y-axis for cosine.", "Tangent is positive when sine and cosine have the same sign.", "ASTC means All, Sine, Tangent, Cosine are positive in Quadrants I to IV."], "This sign table is the unit-circle version of ASTC. It also predicts where tangent is undefined on the vertical axes.", "Quadrant | sin | cos | tan");
  if (id === "wave-transform") return makeValues("y = a sin(bx + c)", `a=${fmtNumber(amplitude)}, b=${fmtNumber(frequency)}, c=${fmtNumber(radiansToDegrees(phase))}°`, [["amplitude", fmtNumber(amplitude)], ["frequency", fmtNumber(frequency)], ["phase", `${fmtNumber(radiansToDegrees(phase))}°`]], ["Amplitude stretches height.", "Frequency changes the number of cycles.", "Phase slides the curve left or right."]);
  if (id === "curve-compare") return makeValues("sinθ, cosθ, tanθ", "three live parent curves", rows, ["Sine starts at 0, cosine starts at 1.", "Tangent is their ratio, so it has vertical breaks where cosine is 0."]);
  return makeValues("(cosθ, sinθ), tanθ = y/x", `(${fmtNumber(cos)}, ${fmtNumber(sin)})`, rows, ["The point on the unit circle is the source of sin and cos.", "Tangent is the y-coordinate divided by the x-coordinate."]);
}

function angleValues(id: VizId, a: number, b: number, baseRows: string[][]) {
  const sign = id.endsWith("sub") ? -1 : 1;
  const combined = a + sign * b;
  const kind = id.startsWith("sin") ? "sin" : "cos";
  const direct = kind === "sin" ? Math.sin(combined) : Math.cos(combined);
  const expanded = expandedAngleValue(id, a, b);
  const joiner = sign > 0 ? "+" : "-";
  return makeValues(
    `Direct value: ${kind}(A ${joiner} B). Expansion: ${angleExpansionText(id)}.`,
    `${fmtNumber(direct)} = ${fmtNumber(expanded)}`,
    [...baseRows, ["A", `${fmtNumber(radiansToDegrees(a))}°`], ["B", `${fmtNumber(radiansToDegrees(b))}°`], [`A ${joiner} B`, `${fmtNumber(radiansToDegrees(combined))}°`], ["difference", fmtNumber(Math.abs(direct - expanded))]],
    ["A and B are two angles.", `Combine them to make A ${joiner} B.`, `Read the direct value ${kind}(A ${joiner} B) from the violet arm.`, "Now calculate the expansion using only sinA, cosA, sinB, and cosB.", "Both sides match, so the formula is visually and numerically true."],
    "The formula gives the same answer without directly calculating the combined angle first. That is why it is powerful in proofs and problem solving.",
    angleExpansionText(id)
  );
}

function complementValues(id: VizId, theta: number, baseRows: string[][]) {
  const complement = Math.PI / 2 - theta;
  const direct = complementaryDirectValue(id, complement);
  const partner = complementaryPartnerValue(id, theta);
  return makeValues(
    `Direct value: ${complementaryDirectLabel(id)}. Partner value: ${complementaryPartnerLabel(id)}.`,
    `${fmt(direct)} = ${fmt(partner)}`,
    [...baseRows, ["90° - θ", `${fmtNumber(radiansToDegrees(complement))}°`], ["difference", direct === null || partner === null ? "undefined" : fmtNumber(Math.abs(direct - partner))]],
    ["Start with a right triangle.", "The two acute angles add to 90°.", "When you look from the other acute angle, opposite and adjacent swap names.", "That swap turns sine into cosine, tangent into cotangent, and secant into cosecant.", "The live values match unless the ratio is undefined."],
    "Complementary identities are cofunction identities: the function of one acute angle equals the co-function of the other.",
    `${complementaryDirectLabel(id)} = ${complementaryPartnerLabel(id)}`
  );
}

function makeValues(dynamicFormula: string, result: string, rows: string[][], steps: string[], advanced = "The live values update from the same geometric objects shown in the scene, so the equality can be checked visually and numerically.", highlight = dynamicFormula) {
  const [lhs, rhs] = result.includes("=") ? result.split("=").map((part) => part.trim()) : [result, result];
  return { dynamicFormula, result, rows, steps, lhs, rhs, advanced, highlight };
}

function FormulaSceneLayout({ selector, scene }: { selector: ReactNode; scene: ReactNode }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside className="min-w-0 space-y-3">
        <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/40">
          <p className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">Formula selector</p>
          <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">Pick one identity, then experiment with the scene and proof values.</p>
        </div>
        {selector}
      </aside>
      <main className="min-w-0">{scene}</main>
    </div>
  );
}

function FormulaSelectorControls({
  query,
  setQuery,
  categoryFilter,
  setCategoryFilter,
  categories,
  teachingMode,
  setTeachingMode,
}: {
  query: string;
  setQuery: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  categories: string[];
  teachingMode: TeachingMode;
  setTeachingMode: (mode: TeachingMode) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/40">
      <label className="block">
        <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Search formulas</span>
        <input
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold dark:border-white/10 dark:bg-slate-900"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search sin, complement, quadrant..."
          aria-label="Search formulas"
        />
      </label>
      <label className="mt-3 block">
        <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400">Formula category</span>
        <select
          className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold dark:border-white/10 dark:bg-slate-900"
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          aria-label="Formula category"
        >
          {categories.map((category) => <option key={category} value={category}>{category}</option>)}
        </select>
      </label>
      <div className="mt-3 grid grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1 dark:bg-slate-900">
        {(["standard", "beginner", "professor"] as const).map((mode) => (
          <button
            key={mode}
            type="button"
            className={`rounded-md px-2 py-2 text-[11px] font-black capitalize ${teachingMode === mode ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-50" : "text-slate-500 dark:text-slate-300"}`}
            onClick={() => setTeachingMode(mode)}
          >
            {mode}
          </button>
        ))}
      </div>
    </div>
  );
}

function TeachingModeBanner({ mode }: { mode: TeachingMode }) {
  if (mode === "standard") return null;
  return (
    <div className={`rounded-xl border p-3 text-sm leading-5 ${mode === "beginner" ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100" : "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-100"}`}>
      <p className="font-black">{mode === "beginner" ? "Beginner Mode" : "Professor Mode"}</p>
      <p className="mt-1">{mode === "beginner" ? "Labels are larger, animation is slower, and the explanation avoids heavy words." : "Explanations include derivation cues, symbolic structure, and graph interpretation."}</p>
    </div>
  );
}

function SmartFormulaCard({ title, formula, basic, advanced, highlight, initialMode }: { title: string; formula: string; basic: string; advanced: string; highlight: string; initialMode?: "basic" | "advanced" }) {
  const [mode, setMode] = useState<"basic" | "advanced">(initialMode ?? "basic");
  useEffect(() => {
    if (initialMode) setMode(initialMode);
  }, [initialMode, title]);
  return (
    <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 dark:border-violet-300/20 dark:bg-violet-400/10">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-violet-700 dark:text-violet-200">Smart formula card</p>
          <h3 className="mt-1 text-sm font-black text-slate-950 dark:text-white">{title}</h3>
        </div>
        <div className="inline-flex rounded-lg bg-white p-1 dark:bg-slate-950/60">
          {(["basic", "advanced"] as const).map((item) => (
            <button key={item} type="button" className={`rounded-md px-2 py-1 text-[11px] font-black capitalize ${mode === item ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-50" : "text-slate-500 dark:text-slate-300"}`} onClick={() => setMode(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-3 break-words rounded-lg bg-white px-2 py-2 font-mono text-sm font-black text-slate-950 dark:bg-slate-950/60 dark:text-white">{formula}</p>
      <p className="mt-2 text-xs font-bold text-violet-700 dark:text-violet-200">Focus: <span className="font-mono">{highlight}</span></p>
      <p className="mt-2 text-sm leading-5 text-slate-700 dark:text-slate-300">{mode === "basic" ? basic : advanced}</p>
    </div>
  );
}

function StepByStepExplanation({ summary, steps, beginner }: { summary: string; steps: string[]; beginner?: boolean }) {
  return (
    <details className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/5" open>
      <summary className="cursor-pointer text-sm font-black text-slate-950 dark:text-white">Step-by-step explanation</summary>
      <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{summary}</p>
      <ol className="mt-3 grid gap-2">
        {steps.slice(0, 6).map((step, index) => (
          <li key={step} className={`rounded-lg bg-slate-100 p-2 leading-5 text-slate-700 dark:bg-slate-950/60 dark:text-slate-300 ${beginner ? "text-sm" : "text-xs"}`}>
            <span className="font-black text-cyan-700 dark:text-cyan-200">Step {index + 1}:</span> {step}
          </li>
        ))}
      </ol>
    </details>
  );
}

function AngleControlPanel({
  mode,
  onModeChange,
  showTheta,
  thetaDeg,
  setThetaDeg,
  showAB,
  aDeg,
  setADeg,
  bDeg,
  setBDeg,
  showWave,
  amplitude,
  setAmplitude,
  frequency,
  setFrequency,
  phaseDeg,
  setPhaseDeg,
  onReset,
  isPlaying,
  setIsPlaying,
  speed,
  setSpeed,
}: {
  mode: AngleMode;
  onModeChange: (mode: AngleMode) => void;
  showTheta: boolean;
  thetaDeg: number;
  setThetaDeg: (value: number) => void;
  showAB: boolean;
  aDeg: number;
  setADeg: (value: number) => void;
  bDeg: number;
  setBDeg: (value: number) => void;
  showWave: boolean;
  amplitude: number;
  setAmplitude: (value: number) => void;
  frequency: number;
  setFrequency: (value: number) => void;
  phaseDeg: number;
  setPhaseDeg: (value: number) => void;
  onReset: () => void;
  isPlaying: boolean;
  setIsPlaying: (value: boolean) => void;
  speed: number;
  setSpeed: (value: number) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/40">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-black text-slate-950 dark:text-white">Angle control panel</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Switch units, drag values, animate the scene, or reset the formula.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="tool-button gap-2" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />} {isPlaying ? "Pause" : "Play"}
          </button>
          <button type="button" className="tool-button gap-2" onClick={onReset}>
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
        </div>
      </div>
      <div className="grid gap-3 lg:grid-cols-3">
        <div className="space-y-3">
          <DegreeRadianToggle mode={mode} onChange={onModeChange} />
          <NumberSlider label="animation speed" value={speed} min={0.25} max={4} step={0.25} onChange={setSpeed} unit="x" />
        </div>
        {showTheta && <AngleSlider label="θ" valueDeg={thetaDeg} onChangeDeg={setThetaDeg} mode={mode} minDeg={-360} maxDeg={360} />}
        {showAB && (
          <>
            <AngleSlider label="A" valueDeg={aDeg} onChangeDeg={setADeg} mode={mode} minDeg={-180} maxDeg={180} />
            <AngleSlider label="B" valueDeg={bDeg} onChangeDeg={setBDeg} mode={mode} minDeg={-180} maxDeg={180} />
          </>
        )}
        {showWave && (
          <>
            <NumberSlider label="amplitude a" value={amplitude} min={-3} max={3} step={0.1} onChange={setAmplitude} />
            <NumberSlider label="frequency b" value={frequency} min={0.2} max={4} step={0.1} onChange={setFrequency} />
            <AngleSlider label="phase c" valueDeg={phaseDeg} onChangeDeg={setPhaseDeg} mode={mode} minDeg={-180} maxDeg={180} />
          </>
        )}
      </div>
    </div>
  );
}

function IdentityProofPanel({ formula, result, lhs, rhs }: { formula: string; result: string; lhs: string; rhs: string }) {
  const match = lhs === rhs || Number(lhs) === Number(rhs) || Math.abs(Number(lhs) - Number(rhs)) < 0.001;
  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-300/20 dark:bg-cyan-400/10">
      <p className="flex items-center gap-2 text-xs font-black uppercase text-cyan-700 dark:text-cyan-200"><Sigma className="h-4 w-4" /> Identity proof panel</p>
      <p className="mt-2 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{formula}</p>
      <div className="mt-2 grid gap-2 text-xs sm:grid-cols-2">
        <ProofMetric label="LHS" value={lhs} />
        <ProofMetric label="RHS" value={rhs} />
      </div>
      <p className="mt-2 break-words rounded-lg bg-white px-2 py-2 font-mono text-sm font-black text-cyan-800 dark:bg-slate-950/60 dark:text-cyan-100">{result}</p>
      <p className={`mt-2 text-xs font-black ${match ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>Match: {match ? "yes" : "compare live values"}</p>
    </div>
  );
}

function ProofMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-2 dark:bg-slate-950/60">
      <p className="text-[10px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function DegreeRadianToggle({ mode, onChange }: { mode: AngleMode; onChange: (mode: AngleMode) => void }) {
  return (
    <div className="inline-flex w-full rounded-xl border border-slate-200 bg-white/80 p-1 dark:border-white/10 dark:bg-white/5">
      {(["degrees", "radians"] as const).map((item) => (
        <button key={item} type="button" className={`min-h-9 flex-1 rounded-lg px-3 text-sm font-black transition ${mode === item ? "bg-cyan-100 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-50" : "text-slate-500 hover:text-cyan-700 dark:text-slate-300"}`} onClick={() => onChange(item)}>
          {item === "degrees" ? "Degrees" : "Radians"}
        </button>
      ))}
    </div>
  );
}

function AngleSlider({ label, valueDeg, onChangeDeg, mode, minDeg, maxDeg }: { label: string; valueDeg: number; onChangeDeg: (value: number) => void; mode: AngleMode; minDeg: number; maxDeg: number }) {
  const value = mode === "degrees" ? valueDeg : degreesToRadians(valueDeg);
  const min = mode === "degrees" ? minDeg : degreesToRadians(minDeg);
  const max = mode === "degrees" ? maxDeg : degreesToRadians(maxDeg);
  const step = mode === "degrees" ? 1 : 0.01;
  const commit = (next: number) => onChangeDeg(mode === "degrees" ? next : radiansToDegrees(next));
  return <NumberSlider label={label} value={value} min={min} max={max} step={step} onChange={commit} unit={mode === "degrees" ? "°" : "rad"} />;
}

function NumberSlider({ label, value, min, max, step, onChange, unit = "" }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; unit?: string }) {
  const safe = Number(value.toFixed(4));
  return (
    <label className="min-w-0 rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-slate-950/40">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-black text-slate-900 dark:text-white">{label}</span>
        <input className="w-24 rounded-lg border border-slate-200 bg-white px-2 py-1 text-right text-sm font-semibold dark:border-white/10 dark:bg-slate-900" type="number" value={safe} min={min} max={max} step={step} onChange={(event) => onChange(clamp(Number(event.target.value), min, max))} aria-label={`${label} exact value`} />
      </div>
      <input className="slider-range w-full cursor-pointer appearance-none accent-cyan-500" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <p className="mt-1 text-right font-mono text-xs font-bold text-cyan-700 dark:text-cyan-200">{fmtNumber(value)}{unit}</p>
    </label>
  );
}

function TrigValueTable({ rows }: { rows: string[][] }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-white/75 p-2 dark:border-white/10 dark:bg-white/5">
          <p className="text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}

function IdentityVisualizationCard({ config, active, onSelect, index }: { config: VizConfig; active: boolean; onSelect: () => void; index: number }) {
  return (
    <button type="button" onClick={onSelect} className={`min-w-0 rounded-xl border p-3 text-left transition ${active ? "border-cyan-300 bg-cyan-50 text-cyan-950 shadow-sm dark:border-cyan-300/50 dark:bg-cyan-400/15 dark:text-cyan-50" : "border-slate-200 bg-white/75 hover:border-cyan-300 dark:border-white/10 dark:bg-white/5"}`}>
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-md bg-slate-950 px-1.5 py-0.5 text-[10px] font-black text-white dark:bg-white/10">{index}</span>
        <span className="text-right text-[10px] font-black uppercase text-violet-600 dark:text-violet-200">{config.category}</span>
      </div>
      <p className="mt-2 text-sm font-black">{config.title}</p>
      <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-black ${difficultyClass(config.difficulty ?? "Intermediate")}`}>{config.difficulty ?? "Intermediate"}</span>
      <p className="mt-1 break-words font-mono text-[11px] leading-4 text-slate-600 dark:text-slate-300">{config.formula}</p>
    </button>
  );
}

function difficultyClass(difficulty: Difficulty) {
  if (difficulty === "Basic") return "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-100";
  if (difficulty === "Intermediate") return "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-100";
  return "bg-violet-100 text-violet-800 dark:bg-violet-400/15 dark:text-violet-100";
}

function CoreMetric({ label, value, tone }: { label: string; value: string; tone: "cyan" | "amber" | "violet" }) {
  const toneClass =
    tone === "cyan" ? "border-cyan-200 bg-cyan-50 text-cyan-900 dark:border-cyan-300/20 dark:bg-cyan-400/10 dark:text-cyan-100" :
    tone === "amber" ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100" :
    "border-violet-200 bg-violet-50 text-violet-900 dark:border-violet-300/20 dark:bg-violet-400/10 dark:text-violet-100";
  return (
    <div className={`rounded-xl border p-3 ${toneClass}`}>
      <p className="text-[11px] font-black uppercase">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-black">{value}</p>
    </div>
  );
}

function SignedBar({ label, value, color, range = 1 }: { label: string; value: number; color: string; range?: number }) {
  const mid = 50;
  const width = Math.min(50, (Math.abs(value) / range) * 50);
  const left = value >= 0 ? mid : mid - width;
  return (
    <div className="rounded-xl border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="flex justify-between gap-2 text-xs font-black"><span>{label}</span><span>{fmtNumber(value)}</span></div>
      <div className="relative mt-3 h-5 rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="absolute top-0 h-5 w-px bg-slate-500" style={{ left: `${mid}%` }} />
        <div className="absolute top-1 h-3 rounded-full" style={{ left: `${left}%`, width: `${width}%`, backgroundColor: color }} />
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-bold text-slate-400"><span>-</span><span>0</span><span>+</span></div>
    </div>
  );
}

function expandedAngleValue(id: VizId, a: number, b: number) {
  if (id === "sin-add") return Math.sin(a) * Math.cos(b) + Math.cos(a) * Math.sin(b);
  if (id === "sin-sub") return Math.sin(a) * Math.cos(b) - Math.cos(a) * Math.sin(b);
  if (id === "cos-add") return Math.cos(a) * Math.cos(b) - Math.sin(a) * Math.sin(b);
  return Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b);
}

function angleExpansionText(id: VizId) {
  if (id === "sin-add") return "sinA cosB + cosA sinB";
  if (id === "cos-add") return "cosA cosB - sinA sinB";
  if (id === "sin-sub") return "sinA cosB - cosA sinB";
  return "cosA cosB + sinA sinB";
}

function complementaryDirectLabel(id: VizId) {
  if (id === "sin-complement") return "sin(90° - θ)";
  if (id === "cos-complement") return "cos(90° - θ)";
  if (id === "tan-complement") return "tan(90° - θ)";
  if (id === "cot-complement") return "cot(90° - θ)";
  if (id === "sec-complement") return "sec(90° - θ)";
  return "cosec(90° - θ)";
}

function complementaryPartnerLabel(id: VizId) {
  if (id === "sin-complement") return "cosθ";
  if (id === "cos-complement") return "sinθ";
  if (id === "tan-complement") return "cotθ";
  if (id === "cot-complement") return "tanθ";
  if (id === "sec-complement") return "cosecθ";
  return "secθ";
}

function complementaryDirectValue(id: VizId, complement: number) {
  if (id === "sin-complement") return Math.sin(complement);
  if (id === "cos-complement") return Math.cos(complement);
  if (id === "tan-complement") return safeTan(complement);
  if (id === "cot-complement") return safeCot(complement);
  if (id === "sec-complement") return safeSec(complement);
  return safeCsc(complement);
}

function complementaryPartnerValue(id: VizId, theta: number) {
  if (id === "sin-complement") return Math.cos(theta);
  if (id === "cos-complement") return Math.sin(theta);
  if (id === "tan-complement") return safeCot(theta);
  if (id === "cot-complement") return safeTan(theta);
  if (id === "sec-complement") return safeCsc(theta);
  return safeSec(theta);
}

function beginnerSummary(config: VizConfig) {
  if (config.category === "Complementary Angles") return "Two sharp angles in a right triangle add to 90°. When you look from the other corner, opposite and adjacent swap.";
  if (config.category === "Quadrant Rules") return "Move the arm around the circle. The sign changes when the point crosses an axis.";
  if (config.category === "Double Angle") return "Double angle means the same angle is used twice: θ + θ.";
  if (config.category === "Addition/Subtraction") return "A and B are two angles. The formula combines them without first drawing the final angle.";
  return config.summary;
}

function professorNote(config: VizConfig) {
  if (config.category === "Complementary Angles") return "Symbolically, these are cofunction identities induced by substituting π/2 - θ and swapping triangle legs.";
  if (config.category === "Quadrant Rules") return "The signs follow from the coordinate signs of (cosθ, sinθ), with tanθ = sinθ / cosθ.";
  if (config.category === "Double Angle") return "These identities can be derived by setting A = B = θ in the angle-addition formulas and then using sin²θ + cos²θ = 1.";
  if (config.category === "Addition/Subtraction") return "The visual compares a direct rotation with the coordinate expansion of the rotated unit vector.";
  return "Use the graph and live equality panel to connect the geometric model with symbolic manipulation.";
}

function signLabel(value: number) {
  if (Math.abs(value) < EPSILON) return "0";
  return value > 0 ? "+" : "-";
}

function polarPoint(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + Math.cos(angle) * r, y: cy - Math.sin(angle) * r };
}

function fmt(value: number | null) {
  return value === null || !Number.isFinite(value) ? "undefined" : fmtNumber(value);
}

function fmtNumber(value: number) {
  return roundTo(value, 4).toString();
}

function safeTan(value: number) {
  return Math.abs(Math.cos(value)) < EPSILON ? null : Math.tan(value);
}

function safeTanForGraph(value: number) {
  const tan = safeTan(value);
  return tan === null || Math.abs(tan) > 3 ? null : tan;
}

function safeCot(value: number) {
  return Math.abs(Math.sin(value)) < EPSILON ? null : Math.cos(value) / Math.sin(value);
}

function safeSec(value: number) {
  return Math.abs(Math.cos(value)) < EPSILON ? null : 1 / Math.cos(value);
}

function safeCsc(value: number) {
  return Math.abs(Math.sin(value)) < EPSILON ? null : 1 / Math.sin(value);
}

function quadrantName(theta: number) {
  const deg = ((radiansToDegrees(theta) % 360) + 360) % 360;
  if (deg === 0 || deg === 90 || deg === 180 || deg === 270) return "Axis";
  if (deg < 90) return "Quadrant I";
  if (deg < 180) return "Quadrant II";
  if (deg < 270) return "Quadrant III";
  return "Quadrant IV";
}

function normalizeSignedDegrees(value: number) {
  const normalized = ((value + 360) % 720) - 360;
  return Number(normalized.toFixed(6));
}

function normalizeRadians(value: number) {
  const twoPi = Math.PI * 2;
  let normalized = ((value + Math.PI) % twoPi) - Math.PI;
  if (normalized < -Math.PI) normalized += twoPi;
  return normalized;
}

function clampToRange(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

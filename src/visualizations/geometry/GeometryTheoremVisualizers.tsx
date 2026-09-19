import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronUp, Eye, EyeOff, GitBranch, HelpCircle, Magnet, PauseCircle, PlayCircle, Redo2, RotateCcw, Ruler, Search, Shuffle, Sparkles, Target, Undo2, XCircle } from "lucide-react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { roundTo } from "../../utils/math";

type TheoremId =
  | "angle-sum"
  | "exterior-angle"
  | "midpoint"
  | "basic-proportionality"
  | "similar-triangles"
  | "thales"
  | "law-of-sines"
  | "law-of-cosines"
  | "inscribed-angle"
  | "power-of-point"
  | "tangent-radius"
  | "intersecting-chords";

type Theorem = {
  id: TheoremId;
  title: string;
  formula: string;
  description: string;
  category: string;
  sliders: string[];
  realWorldUse: string;
};

const theorems: Theorem[] = [
  { id: "angle-sum", title: "Triangle Angle Sum", formula: "A + B + C = 180 deg", description: "Every Euclidean triangle has interior angles that add to 180 degrees.", category: "Triangles", sliders: ["Angle A", "Angle B"], realWorldUse: "Roof design, surveying, map triangulation, and polygon angle checks." },
  { id: "exterior-angle", title: "Exterior Angle Theorem", formula: "Exterior angle = opposite interior angle 1 + opposite interior angle 2", description: "A triangle exterior angle equals the sum of the two remote interior angles.", category: "Triangles", sliders: ["Remote angle A", "Remote angle B"], realWorldUse: "Navigation bearings, proofs, and turn-angle reasoning." },
  { id: "midpoint", title: "Midpoint Theorem", formula: "DE parallel BC and DE = 1/2 BC", description: "The segment joining midpoints of two triangle sides is parallel to the third side and half its length.", category: "Triangles", sliders: ["Base BC", "Height"], realWorldUse: "Computer graphics meshes, structural bracing, and scale drawings." },
  { id: "basic-proportionality", title: "Basic Proportionality Theorem", formula: "AD/DB = AE/EC", description: "A line parallel to one side of a triangle divides the other two sides proportionally.", category: "Triangles", sliders: ["Triangle width", "Parallel height"], realWorldUse: "Perspective drawing, map scaling, and similar-triangle measurements." },
  { id: "similar-triangles", title: "Similar Triangles", formula: "Corresponding sides are proportional; corresponding angles are equal", description: "Triangles with equal angles are scaled copies of each other.", category: "Triangles", sliders: ["Scale factor", "Base"], realWorldUse: "Indirect measurement, shadows, camera projection, and blueprints." },
  { id: "thales", title: "Thales' Theorem", formula: "Angle in a semicircle = 90 deg", description: "Any triangle drawn with the diameter of a circle as one side has a right angle on the circle.", category: "Circles", sliders: ["Point position"], realWorldUse: "Circle geometry, right-angle construction, and CAD constraints." },
  { id: "law-of-sines", title: "Law of Sines", formula: "a/sin A = b/sin B = c/sin C", description: "In any triangle, side lengths are proportional to the sines of their opposite angles.", category: "Trigonometry", sliders: ["Angle A", "Angle B"], realWorldUse: "Surveying, navigation, triangulation, and missing-side calculations." },
  { id: "law-of-cosines", title: "Law of Cosines", formula: "c^2 = a^2 + b^2 - 2ab cos C", description: "A generalization of Pythagoras for non-right triangles.", category: "Trigonometry", sliders: ["Side a", "Side b", "Included angle"], realWorldUse: "Distance estimation, robotics arms, GPS geometry, and physics vectors." },
  { id: "inscribed-angle", title: "Inscribed Angle Theorem", formula: "Inscribed angle = 1/2 central angle", description: "An angle on a circle is half the central angle that subtends the same arc.", category: "Circles", sliders: ["Central angle"], realWorldUse: "Optics, circle proofs, arc measurement, and mechanical linkages." },
  { id: "power-of-point", title: "Power of a Point", formula: "PA * PB = PC * PD", description: "Secants from the same outside point create equal products of segment lengths.", category: "Circles", sliders: ["Outside distance", "Secant angle"], realWorldUse: "Circle intersections, CAD construction, and geometric proofs." },
  { id: "tangent-radius", title: "Tangent Radius Theorem", formula: "Radius perpendicular tangent at point of contact", description: "A tangent line touches a circle at one point and is perpendicular to the radius there.", category: "Circles", sliders: ["Contact angle"], realWorldUse: "Wheels, gears, cam design, and normal vectors in graphics." },
  { id: "intersecting-chords", title: "Intersecting Chords Theorem", formula: "AE * EB = CE * ED", description: "When two chords intersect inside a circle, the products of their segments are equal.", category: "Circles", sliders: ["Intersection offset", "Chord tilt"], realWorldUse: "Circle construction, optics paths, and geometric validation." },
];

const categories = ["All", "Triangles", "Circles", "Trigonometry"] as const;
const proofModes = ["Explore", "Prove", "Quiz"] as const;
type ProofMode = (typeof proofModes)[number];
type DiagramState = { x: number; y: number; z: number };
type ChallengeMode = "normal" | "break" | "counterexample";
type AnnotationStroke = { id: string; color: string; points: Array<{ x: number; y: number }> };

export default function GeometryTheoremVisualizers() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selectedId, setSelectedId] = useState<TheoremId>("angle-sum");
  const [proofMode, setProofMode] = useState<ProofMode>("Explore");
  const [proofStep, setProofStep] = useState(0);
  const [query, setQuery] = useState("");
  const [prediction, setPrediction] = useState("");
  const [quizChecked, setQuizChecked] = useState(false);
  const [showConstruction, setShowConstruction] = useState(true);
  const [hideMeasurements, setHideMeasurements] = useState(false);
  const [ghostState, setGhostState] = useState<DiagramState | null>(null);
  const [whyOpen, setWhyOpen] = useState(true);
  const [studentExplanation, setStudentExplanation] = useState("");
  const [noticed, setNoticed] = useState("");
  const [challengeMode, setChallengeMode] = useState<ChallengeMode>("normal");
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [preset, setPreset] = useState("custom");
  const [annotations, setAnnotations] = useState<AnnotationStroke[]>([]);
  const [redoAnnotations, setRedoAnnotations] = useState<AnnotationStroke[]>([]);
  const [annotationColor, setAnnotationColor] = useState("#0891b2");
  const [annotationsVisible, setAnnotationsVisible] = useState(false);
  const [activeAnnotation, setActiveAnnotation] = useState<AnnotationStroke | null>(null);
  const [x, setX] = useState(55);
  const [y, setY] = useState(45);
  const [z, setZ] = useState(70);

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return theorems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const searchable = `${item.title} ${item.description} ${item.formula} ${item.category}`.toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [category, query]);
  const selected = theorems.find((item) => item.id === selectedId) ?? theorems[0];
  const metrics = theoremMetrics(selected.id, x, y, z);
  const proofStages = stepsFor(selected.id, x, y, z, metrics);
  const currentStage = proofStages[Math.min(proofStep, proofStages.length - 1)] ?? proofStages[0];
  const invariantBadges = invariantsFor(selected.id, metrics);
  const quiz = quizFor(selected.id, metrics);
  const quizCorrect = normalizeAnswer(prediction) === normalizeAnswer(quiz.answer);
  const miniQuestions = miniQuestionsFor(selected.id, metrics);
  const noticePrompt = noticePromptFor(selected.id, proofStep);
  const invalidState = invalidStateFor(selected.id);
  const annotationLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!visible.length || visible.some((item) => item.id === selectedId)) return;
    setSelectedId(visible[0].id);
    setProofStep(0);
    setPrediction("");
    setQuizChecked(false);
  }, [selectedId, visible]);

  useEffect(() => {
    if (!isAnimating) return;
    const interval = window.setInterval(() => {
      setProofStep((step) => (step + 1) % proofStages.length);
      setGhostState({ x, y, z });
      const nextX = x >= sliderMax(selected.id, 0) ? sliderMin(selected.id, 0) : x + 1;
      setX(nextX);
    }, Math.max(350, 1300 / animationSpeed));
    return () => window.clearInterval(interval);
  }, [animationSpeed, isAnimating, proofStages.length, selected.id, x, y, z]);

  function selectTheorem(id: TheoremId) {
    setSelectedId(id);
    setProofStep(0);
    setPrediction("");
    setQuizChecked(false);
  }

  function rememberGhost() {
    setGhostState({ x, y, z });
  }

  function updateX(value: number) {
    rememberGhost();
    setX(value);
    setNoticed("");
  }

  function updateY(value: number) {
    rememberGhost();
    setY(value);
    setNoticed("");
  }

  function updateZ(value: number) {
    rememberGhost();
    setZ(value);
    setNoticed("");
  }

  function updateDiagram(next: Partial<DiagramState>) {
    rememberGhost();
    if (next.x !== undefined) setX(next.x);
    if (next.y !== undefined) setY(next.y);
    if (next.z !== undefined) setZ(next.z);
  }

  function snapTo(kind: "right" | "isosceles" | "equilateral") {
    rememberGhost();
    if (kind === "right") {
      setX(selected.id === "intersecting-chords" ? 0 : 45);
      setY(45);
      setZ(90);
      return;
    }
    if (kind === "isosceles") {
      setX(selected.id === "similar-triangles" ? 2 : 60);
      setY(60);
      setZ(70);
      return;
    }
    setX(selected.id === "similar-triangles" ? 3 : 60);
    setY(60);
    setZ(60);
  }

  function resetSlider(axis: keyof DiagramState) {
    rememberGhost();
    if (axis === "x") setX(55);
    if (axis === "y") setY(45);
    if (axis === "z") setZ(70);
  }

  function randomizeDiagram() {
    rememberGhost();
    setX(randomBetween(sliderMin(selected.id, 0), sliderMax(selected.id, 0)));
    setY(randomBetween(sliderMin(selected.id, 1), sliderMax(selected.id, 1)));
    setZ(selected.sliders[2] ? randomBetween(sliderMin(selected.id, 2), sliderMax(selected.id, 2)) : z);
    setPreset("custom");
  }

  function applyPreset(value: string) {
    setPreset(value);
    if (value === "custom") return;
    if (value === "right") snapTo("right");
    if (value === "isosceles") snapTo("isosceles");
    if (value === "equilateral") snapTo("equilateral");
    if (value === "extreme") {
      rememberGhost();
      setX(sliderMax(selected.id, 0));
      setY(sliderMax(selected.id, 1));
      if (selected.sliders[2]) setZ(sliderMax(selected.id, 2));
    }
  }

  function beginAnnotation(event: React.PointerEvent<HTMLDivElement>) {
    if (!annotationsVisible) return;
    const point = annotationPoint(event, annotationLayerRef.current);
    setActiveAnnotation({ id: randomId(), color: annotationColor, points: [point] });
  }

  function moveAnnotation(event: React.PointerEvent<HTMLDivElement>) {
    if (!activeAnnotation || !annotationsVisible) return;
    setActiveAnnotation({ ...activeAnnotation, points: [...activeAnnotation.points, annotationPoint(event, annotationLayerRef.current)] });
  }

  function endAnnotation() {
    if (!activeAnnotation) return;
    if (activeAnnotation.points.length > 1) {
      setAnnotations((items) => [...items, activeAnnotation]);
      setRedoAnnotations([]);
    }
    setActiveAnnotation(null);
  }

  function undoAnnotation() {
    setAnnotations((items) => {
      const next = items.slice(0, -1);
      const removed = items.at(-1);
      if (removed) setRedoAnnotations((redo) => [removed, ...redo]);
      return next;
    });
  }

  function redoAnnotation() {
    const [next, ...rest] = redoAnnotations;
    if (!next) return;
    setAnnotations((items) => [...items, next]);
    setRedoAnnotations(rest);
  }

  return (
    <SectionCard title="Geometry Theorem Visualizers" description={`${theorems.length} theorem labs with formulas, live diagrams, and guided checks.`}>
      <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-wrap gap-2">
          {proofModes.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setProofMode(mode);
                setProofStep(0);
                setQuizChecked(false);
              }}
              className={`inline-flex min-h-10 items-center gap-2 rounded-full px-4 py-2 text-sm font-black transition ${
                proofMode === mode ? "bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
              }`}
            >
              {mode === "Explore" && <Eye className="h-4 w-4" />}
              {mode === "Prove" && <Target className="h-4 w-4" />}
              {mode === "Quiz" && <HelpCircle className="h-4 w-4" />}
              {mode}
            </button>
          ))}
        </div>
        <label className="flex min-h-10 w-full items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-sm dark:border-white/10 dark:bg-white/10 lg:w-80">
          <Search className="h-4 w-4 shrink-0 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-slate-400"
            placeholder="Search theorem, formula, or idea"
            type="search"
          />
        </label>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item ? "bg-cyan-600 text-white dark:bg-cyan-300 dark:text-slate-950" : "bg-cyan-50 text-cyan-800 hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {invariantBadges.map((badge) => (
            <span key={badge.label} className="inline-flex min-h-9 items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 text-xs font-black text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100">
              <CheckCircle2 className="h-4 w-4" />
              {badge.label}: {badge.value}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {visible.map((theorem) => (
          <button
            key={theorem.id}
            type="button"
            onClick={() => selectTheorem(theorem.id)}
            className={`min-h-20 w-64 shrink-0 rounded-xl border p-3 text-left transition hover:-translate-y-0.5 ${
              selected.id === theorem.id ? "border-cyan-400 bg-cyan-50 shadow-lg shadow-cyan-500/10 dark:bg-cyan-400/10" : "border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5"
            }`}
          >
            <p className="text-xs font-bold uppercase text-cyan-600 dark:text-cyan-300">{theorem.category}</p>
            <h3 className="mt-1 font-bold leading-5">{theorem.title}</h3>
            <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{theorem.description}</p>
          </button>
        ))}
        {!visible.length && <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 dark:border-white/20 dark:text-slate-300">No theorem matches this filter.</div>}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)_320px]">
        <div className="space-y-4">
          <FormulaBlock title={selected.title} formula={selected.formula} explanation={selected.description} />
          <DiagramControls
            showConstruction={showConstruction}
            hideMeasurements={hideMeasurements}
            hasGhost={Boolean(ghostState)}
            onToggleConstruction={() => setShowConstruction((value) => !value)}
            onToggleMeasurements={() => setHideMeasurements((value) => !value)}
            onClearGhost={() => setGhostState(null)}
            onSnap={snapTo}
            onRandomize={randomizeDiagram}
            preset={preset}
            onPreset={applyPreset}
            isAnimating={isAnimating}
            speed={animationSpeed}
            onToggleAnimation={() => setIsAnimating((value) => !value)}
            onSpeed={setAnimationSpeed}
            annotationColor={annotationColor}
            annotationsVisible={annotationsVisible}
            canUndo={annotations.length > 0}
            canRedo={redoAnnotations.length > 0}
            onAnnotationColor={setAnnotationColor}
            onToggleAnnotations={() => setAnnotationsVisible((value) => !value)}
            onUndoAnnotation={undoAnnotation}
            onRedoAnnotation={redoAnnotation}
          />
          <ParameterGroup title={parameterGroupTitle(selected, 0)} onReset={() => resetSlider("x")}>
            <SliderControl label={selected.sliders[0] ?? "Value A"} value={x} min={sliderMin(selected.id, 0)} max={sliderMax(selected.id, 0)} step={1} onChange={updateX} unit={sliderUnit(selected.id, 0)} />
          </ParameterGroup>
          <ParameterGroup title={parameterGroupTitle(selected, 1)} onReset={() => resetSlider("y")}>
            <SliderControl label={selected.sliders[1] ?? "Value B"} value={y} min={sliderMin(selected.id, 1)} max={sliderMax(selected.id, 1)} step={1} onChange={updateY} unit={sliderUnit(selected.id, 1)} />
          </ParameterGroup>
          {selected.sliders[2] && <ParameterGroup title={parameterGroupTitle(selected, 2)} onReset={() => resetSlider("z")}>
            <SliderControl label={selected.sliders[2]} value={z} min={sliderMin(selected.id, 2)} max={sliderMax(selected.id, 2)} step={1} onChange={updateZ} unit={sliderUnit(selected.id, 2)} />
          </ParameterGroup>}
          {!hideMeasurements && <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(metrics).map(([label, value]) => <Metric key={label} label={label} value={value} />)}
          </div>}
          {hideMeasurements && <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-3 text-sm font-semibold text-slate-600 dark:border-white/20 dark:bg-white/5 dark:text-slate-300">Measurements hidden. Use shape marks, colors, and construction cues only.</div>}
        </div>

        <div className="rounded-2xl bg-white p-4 dark:bg-slate-950/60">
          <div className="mb-3 rounded-xl border border-cyan-100 bg-cyan-50/80 p-3 dark:border-cyan-300/20 dark:bg-cyan-300/10">
            <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">What must stay true</p>
            <p className="mt-1 text-sm font-semibold leading-5 text-slate-700 dark:text-slate-200">{proofIdeaFor(selected.id)}</p>
          </div>
          <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 dark:border-white/10 dark:bg-slate-900/80">
            <div className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-700 shadow-sm dark:bg-slate-950/90 dark:text-slate-100">
              <Sparkles className="h-4 w-4 text-amber-500" />
              {proofMode}: {currentStage}
            </div>
            <TheoremSvg
              theorem={selected.id}
              x={x}
              y={y}
              z={z}
              activeStep={proofStep}
              ghost={ghostState}
              showConstruction={showConstruction}
              hideMeasurements={hideMeasurements}
              onChange={updateDiagram}
            />
            <AnnotationOverlay
              layerRef={annotationLayerRef}
              visible={annotationsVisible}
              strokes={annotations}
              activeStroke={activeAnnotation}
              onPointerDown={beginAnnotation}
              onPointerMove={moveAnnotation}
              onPointerUp={endAnnotation}
            />
          </div>
          <ColorLegend />
        </div>

        <ProofControlPanel
          mode={proofMode}
          selected={selected}
          stages={proofStages}
          activeStep={proofStep}
          onStep={setProofStep}
          quiz={quiz}
          prediction={prediction}
          onPrediction={setPrediction}
          checked={quizChecked}
          isCorrect={quizCorrect}
          onCheck={() => setQuizChecked(true)}
          onResetQuiz={() => {
            setPrediction("");
            setQuizChecked(false);
          }}
        />
      </div>

      <ProofLearningFlow
        selected={selected}
        currentStage={currentStage}
        activeStep={proofStep}
        miniQuestions={miniQuestions}
        whyOpen={whyOpen}
        onToggleWhy={() => setWhyOpen((value) => !value)}
        studentExplanation={studentExplanation}
        onStudentExplanation={setStudentExplanation}
        noticed={noticed}
        noticePrompt={noticePrompt}
        onNoticed={setNoticed}
        challengeMode={challengeMode}
        onChallengeMode={setChallengeMode}
        invalidState={invalidState}
        misconception={misconceptionFor(selected.id)}
      />

      <ValidInvalidProofPair selected={selected} invalidState={invalidState} challengeMode={challengeMode} />

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Proof step timeline</p>
            <h3 className="mt-1 text-lg font-black">Follow the logic, then test it</h3>
          </div>
          <button
            type="button"
            onClick={() => setProofStep((step) => (step + 1) % proofStages.length)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950"
          >
            <PlayCircle className="h-4 w-4" />
            Next step
          </button>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {proofStages.map((stage, index) => (
            <button
              key={stage}
              type="button"
              onClick={() => setProofStep(index)}
              className={`min-h-24 rounded-xl border p-3 text-left transition ${
                proofStep === index ? "border-amber-300 bg-amber-50 text-amber-950 shadow-lg shadow-amber-500/10 dark:border-amber-300/40 dark:bg-amber-400/10 dark:text-amber-50" : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              }`}
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-950 text-xs font-black text-white dark:bg-white dark:text-slate-950">{index + 1}</span>
              <p className="mt-2 text-sm font-semibold leading-5">{stage}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <VisualLearningPanel
          concept={selected.description}
          formula={selected.formula}
          changes={changeText(selected.id)}
          realWorldUse={selected.realWorldUse}
          steps={proofStages}
          tasks={tasksFor(selected.id)}
          proofIdea={proofIdeaFor(selected.id)}
          misconception={misconceptionFor(selected.id)}
          teacherPrompt={teacherPromptFor(selected.id)}
        />
      </div>
    </SectionCard>
  );
}

function DiagramControls({
  showConstruction,
  hideMeasurements,
  hasGhost,
  onToggleConstruction,
  onToggleMeasurements,
  onClearGhost,
  onSnap,
  onRandomize,
  preset,
  onPreset,
  isAnimating,
  speed,
  onToggleAnimation,
  onSpeed,
  annotationColor,
  annotationsVisible,
  canUndo,
  canRedo,
  onAnnotationColor,
  onToggleAnnotations,
  onUndoAnnotation,
  onRedoAnnotation,
}: {
  showConstruction: boolean;
  hideMeasurements: boolean;
  hasGhost: boolean;
  onToggleConstruction: () => void;
  onToggleMeasurements: () => void;
  onClearGhost: () => void;
  onSnap: (kind: "right" | "isosceles" | "equilateral") => void;
  onRandomize: () => void;
  preset: string;
  onPreset: (value: string) => void;
  isAnimating: boolean;
  speed: number;
  onToggleAnimation: () => void;
  onSpeed: (value: number) => void;
  annotationColor: string;
  annotationsVisible: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onAnnotationColor: (value: string) => void;
  onToggleAnnotations: () => void;
  onUndoAnnotation: () => void;
  onRedoAnnotation: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Diagram tools</p>
      <div className="mt-3 grid gap-2">
        <button type="button" onClick={onToggleConstruction} className={toolToggleClass(showConstruction)}>
          <GitBranch className="h-4 w-4" />
          Construction lines
        </button>
        <button type="button" onClick={onToggleMeasurements} className={toolToggleClass(hideMeasurements)}>
          {hideMeasurements ? <EyeOff className="h-4 w-4" /> : <Ruler className="h-4 w-4" />}
          {hideMeasurements ? "Pure visual mode" : "Show measurements"}
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button type="button" onClick={() => onSnap("right")} className="rounded-xl bg-cyan-50 px-2 py-2 text-xs font-black text-cyan-800 transition hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100">
          Right
        </button>
        <button type="button" onClick={() => onSnap("isosceles")} className="rounded-xl bg-cyan-50 px-2 py-2 text-xs font-black text-cyan-800 transition hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100">
          Isosceles
        </button>
        <button type="button" onClick={() => onSnap("equilateral")} className="rounded-xl bg-cyan-50 px-2 py-2 text-xs font-black text-cyan-800 transition hover:bg-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100">
          Equal
        </button>
      </div>
      <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
        <select value={preset} onChange={(event) => onPreset(event.target.value)} className="min-h-9 rounded-xl border border-slate-200 bg-white px-2 text-xs font-black text-slate-700 dark:border-white/10 dark:bg-slate-950 dark:text-slate-100" aria-label="Proof preset">
          <option value="custom">Custom</option>
          <option value="right">Right triangle</option>
          <option value="isosceles">Isosceles</option>
          <option value="equilateral">Equilateral</option>
          <option value="extreme">Extreme case</option>
        </select>
        <button type="button" onClick={onRandomize} className="inline-flex h-9 items-center justify-center rounded-xl bg-slate-100 px-3 text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200" title="Randomize diagram">
          <Shuffle className="h-4 w-4" />
        </button>
      </div>
      <button type="button" onClick={onToggleAnimation} className={toolToggleClass(isAnimating)}>
        {isAnimating ? <PauseCircle className="h-4 w-4" /> : <PlayCircle className="h-4 w-4" />}
        {isAnimating ? "Pause animation" : "Animate proof"}
      </button>
      {isAnimating && (
        <label className="mt-2 flex min-h-9 items-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-200">
          {speed.toFixed(1)}x
          <input className="min-w-0 flex-1 accent-cyan-500" type="range" min={0.5} max={2} step={0.25} value={speed} onChange={(event) => onSpeed(Number(event.target.value))} />
        </label>
      )}
      <button type="button" onClick={onClearGhost} disabled={!hasGhost} className="mt-2 inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 text-xs font-black text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/10 dark:text-slate-200">
        <Magnet className="h-4 w-4" />
        Clear ghost
      </button>
      <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-slate-950/40">
        <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2">
          <button type="button" onClick={onToggleAnnotations} className={toolToggleClass(annotationsVisible)}>
            {annotationsVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            Notes
          </button>
          <input type="color" value={annotationColor} onChange={(event) => onAnnotationColor(event.target.value)} className="h-9 w-10 rounded-lg border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-900" title="Annotation color" />
          <button type="button" onClick={onUndoAnnotation} disabled={!canUndo} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 disabled:opacity-40 dark:bg-white/10 dark:text-slate-200" title="Undo annotation">
            <Undo2 className="h-4 w-4" />
          </button>
          <button type="button" onClick={onRedoAnnotation} disabled={!canRedo} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 disabled:opacity-40 dark:bg-white/10 dark:text-slate-200" title="Redo annotation">
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function toolToggleClass(active: boolean) {
  return `inline-flex min-h-9 w-full items-center justify-center gap-2 rounded-xl px-3 text-xs font-black transition ${
    active ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
  }`;
}

function ColorLegend() {
  return (
    <div className="mt-3 flex flex-wrap gap-2 text-xs font-black">
      <span className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-cyan-800 dark:bg-cyan-400/10 dark:text-cyan-100"><span className="h-2 w-2 rounded-full bg-cyan-500" />Base object</span>
      <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-amber-800 dark:bg-amber-400/10 dark:text-amber-100"><span className="h-2 w-2 rounded-full bg-amber-500" />Changing part</span>
      <span className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-violet-800 dark:bg-violet-400/10 dark:text-violet-100"><span className="h-2 w-2 rounded-full bg-violet-500" />Proof relation</span>
    </div>
  );
}

function ParameterGroup({ title, onReset, children }: { title: string; onReset: () => void; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/70 p-2 dark:border-white/10 dark:bg-white/5">
      <div className="mb-2 flex items-center justify-between gap-2 px-1">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
        <button type="button" onClick={onReset} className="inline-flex min-h-8 items-center gap-1 rounded-full bg-slate-100 px-3 text-xs font-black text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200">
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </button>
      </div>
      {children}
    </div>
  );
}

function AnnotationOverlay({
  layerRef,
  visible,
  strokes,
  activeStroke,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: {
  layerRef: React.RefObject<HTMLDivElement>;
  visible: boolean;
  strokes: AnnotationStroke[];
  activeStroke: AnnotationStroke | null;
  onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerUp: () => void;
}) {
  const allStrokes = activeStroke ? [...strokes, activeStroke] : strokes;
  return (
    <div
      ref={layerRef}
      className={`absolute inset-0 z-20 rounded-xl ${visible ? "cursor-crosshair" : "pointer-events-none"}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      aria-label="Visual proof annotation layer"
    >
      {visible && (
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
          {allStrokes.map((stroke) => (
            <polyline
              key={stroke.id}
              points={stroke.points.map((point) => `${point.x},${point.y}`).join(" ")}
              fill="none"
              stroke={stroke.color}
              strokeWidth="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      )}
    </div>
  );
}

function ProofLearningFlow({
  selected,
  currentStage,
  activeStep,
  miniQuestions,
  whyOpen,
  onToggleWhy,
  studentExplanation,
  onStudentExplanation,
  noticed,
  noticePrompt,
  onNoticed,
  challengeMode,
  onChallengeMode,
  invalidState,
  misconception,
}: {
  selected: Theorem;
  currentStage: string;
  activeStep: number;
  miniQuestions: string[];
  whyOpen: boolean;
  onToggleWhy: () => void;
  studentExplanation: string;
  onStudentExplanation: (value: string) => void;
  noticed: string;
  noticePrompt: string;
  onNoticed: (value: string) => void;
  challengeMode: ChallengeMode;
  onChallengeMode: (value: ChallengeMode) => void;
  invalidState: string;
  misconception: string;
}) {
  return (
    <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
        <button type="button" onClick={onToggleWhy} className="flex w-full items-center justify-between gap-3 text-left">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Why this is true</p>
            <h3 className="mt-1 text-lg font-black">{selected.title}</h3>
          </div>
          {whyOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {whyOpen && (
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl bg-cyan-50 p-3 text-sm font-semibold leading-6 text-cyan-950 dark:bg-cyan-400/10 dark:text-cyan-100">
              {proofIdeaFor(selected.id)}
            </div>
            <div className="rounded-xl bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950 dark:bg-amber-400/10 dark:text-amber-100">
              Proof by animation: step {activeStep + 1} reveals "{currentStage}"
            </div>
            <div className="rounded-xl bg-violet-50 p-3 text-sm font-semibold leading-6 text-violet-950 dark:bg-violet-400/10 dark:text-violet-100">
              {rearrangementTextFor(selected.id)}
            </div>
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-semibold leading-6 text-rose-900 dark:border-rose-300/20 dark:bg-rose-400/10 dark:text-rose-100">
              <AlertTriangle className="mr-1 inline h-4 w-4" />
              {misconception}
            </div>
          </div>
        )}
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Reasoning journal</p>
        <label className="mt-3 block">
          <span className="text-sm font-black">Student explanation</span>
          <textarea value={studentExplanation} onChange={(event) => onStudentExplanation(event.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-cyan-400 dark:border-white/10 dark:bg-slate-950" placeholder="Explain the proof in your own words." />
        </label>
        <label className="mt-3 block">
          <span className="text-sm font-black">I noticed...</span>
          <input value={noticed} onChange={(event) => onNoticed(event.target.value)} className="mt-2 min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-cyan-400 dark:border-white/10 dark:bg-slate-950" placeholder={noticePrompt} />
        </label>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5 xl:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Mini checks</p>
            <h3 className="mt-1 text-lg font-black">Answer after each proof step</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {(["normal", "break", "counterexample"] as ChallengeMode[]).map((mode) => (
              <button key={mode} type="button" onClick={() => onChallengeMode(mode)} className={`rounded-full px-3 py-2 text-xs font-black transition ${challengeMode === mode ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"}`}>
                {mode === "normal" ? "Normal" : mode === "break" ? "Try to break it" : "Counterexample"}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {miniQuestions.map((question, index) => (
            <div key={question} className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
              <p className="text-xs font-black uppercase text-cyan-700 dark:text-cyan-200">Step {index + 1}</p>
              <p className="mt-2 text-sm font-semibold leading-6">{question}</p>
            </div>
          ))}
        </div>
        {challengeMode !== "normal" && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-semibold leading-6 text-amber-950 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100">
            {challengeMode === "break" ? "Move the controls until the theorem looks suspicious, then use the invariant badge to check whether it truly broke." : invalidState}
          </div>
        )}
      </div>
    </div>
  );
}

function ValidInvalidProofPair({ selected, invalidState, challengeMode }: { selected: Theorem; invalidState: string; challengeMode: ChallengeMode }) {
  return (
    <div className="mt-6 grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-300/20 dark:bg-emerald-400/10">
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-100"><CheckCircle2 className="h-4 w-4" />Valid diagram</p>
        <h3 className="mt-2 font-black">{selected.title}</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-emerald-950 dark:text-emerald-50">{proofIdeaFor(selected.id)}</p>
      </div>
      <div className={`rounded-2xl border p-4 ${challengeMode === "counterexample" ? "border-rose-300 bg-rose-50 dark:border-rose-300/30 dark:bg-rose-400/10" : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"}`}>
        <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-rose-700 dark:text-rose-100"><XCircle className="h-4 w-4" />Invalid assumption</p>
        <h3 className="mt-2 font-black">Where the proof fails</h3>
        <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{invalidState}</p>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p><p className="font-bold">{roundTo(value, 2)}</p></div>;
}

function sliderMin(id: TheoremId, index: number) {
  if (id === "similar-triangles" && index === 0) return 1;
  if (id === "thales") return 15;
  if (id === "power-of-point" && index === 0) return 20;
  if (id === "intersecting-chords" && index === 0) return -55;
  return 10;
}

function sliderMax(id: TheoremId, index: number) {
  if (id === "similar-triangles" && index === 0) return 5;
  if (id === "angle-sum" || id === "exterior-angle" || id === "law-of-sines") return 80;
  if (id === "law-of-cosines" && index === 2) return 150;
  if (id === "thales") return 165;
  if (id === "inscribed-angle") return 150;
  if (id === "tangent-radius") return 360;
  if (id === "intersecting-chords" && index === 0) return 55;
  return 120;
}

function sliderUnit(id: TheoremId, index: number) {
  if (["angle-sum", "exterior-angle", "law-of-sines", "law-of-cosines", "thales", "inscribed-angle", "power-of-point", "tangent-radius", "intersecting-chords"].includes(id) && (index > 1 || !["midpoint", "basic-proportionality", "similar-triangles"].includes(id))) return "deg";
  return "";
}

function parameterGroupTitle(theorem: Theorem, index: number) {
  const label = theorem.sliders[index] ?? "";
  if (/scale/i.test(label)) return "Scale";
  if (/position|offset|distance|point/i.test(label)) return "Position";
  if (/angle|tilt/i.test(label)) return "Angle";
  if (/base|height|width|side/i.test(label)) return "Shape";
  return index === 2 ? "Angle" : "Shape";
}

function invariantsFor(id: TheoremId, metrics: Record<string, number>) {
  const format = (value: number) => String(roundTo(value, 2));
  if (id === "angle-sum") return [{ label: "Angle total", value: `${format(metrics.Total)} deg` }];
  if (id === "exterior-angle") return [{ label: "Exterior", value: `${format(metrics.Exterior)} deg` }];
  if (id === "midpoint") return [{ label: "Half base", value: `DE = ${format(metrics.DE)}` }];
  if (id === "basic-proportionality") return [{ label: "Equal ratios", value: format(metrics["AD/AB"]) }];
  if (id === "similar-triangles") return [{ label: "Scale", value: `${format(metrics.Scale)}x` }];
  if (id === "thales") return [{ label: "Right angle", value: `${format(metrics["Angle APB"])} deg` }];
  if (id === "law-of-sines") return [{ label: "Angle total", value: "180 deg" }];
  if (id === "law-of-cosines") return [{ label: "Opposite side", value: format(metrics["Side c"]) }];
  if (id === "inscribed-angle") return [{ label: "Half angle", value: `${format(metrics["Inscribed angle"])} deg` }];
  if (id === "power-of-point") return [{ label: "Product", value: format(metrics["PA * PB"]) }];
  if (id === "tangent-radius") return [{ label: "Perpendicular", value: `${format(metrics["Radius-tangent angle"])} deg` }];
  return [{ label: "Chord product", value: format(metrics["AE * EB"]) }];
}

function quizFor(id: TheoremId, metrics: Record<string, number>) {
  const answer = (value: number, suffix = "") => `${roundTo(value, 2)}${suffix}`;
  if (id === "angle-sum") return { question: "Predict the missing third angle.", answer: answer(metrics["Angle C"], " deg"), hint: "Subtract the two visible angles from 180 degrees." };
  if (id === "exterior-angle") return { question: "Predict the exterior angle.", answer: answer(metrics.Exterior, " deg"), hint: "Add the two remote interior angles." };
  if (id === "midpoint") return { question: "Predict the midpoint segment DE.", answer: answer(metrics.DE), hint: "DE is half of BC." };
  if (id === "basic-proportionality") return { question: "Predict the shared side ratio.", answer: answer(metrics["AD/AB"]), hint: "The small and large triangles are similar." };
  if (id === "similar-triangles") return { question: "Predict the large base.", answer: answer(metrics["Large base"]), hint: "Multiply the small base by the scale factor." };
  if (id === "thales") return { question: "Predict angle APB.", answer: "90 deg", hint: "The angle in a semicircle is always right." };
  if (id === "law-of-sines") return { question: "Predict the third angle.", answer: answer(metrics["Angle C"], " deg"), hint: "Triangle angles still total 180 degrees." };
  if (id === "law-of-cosines") return { question: "Predict side c.", answer: answer(metrics["Side c"]), hint: "Use the cosine correction term." };
  if (id === "inscribed-angle") return { question: "Predict the inscribed angle.", answer: answer(metrics["Inscribed angle"], " deg"), hint: "It is half of the central angle." };
  if (id === "power-of-point") return { question: "Predict the product from point P.", answer: answer(metrics["PA * PB"]), hint: "Both secants from P have equal products." };
  if (id === "tangent-radius") return { question: "Predict the radius-tangent angle.", answer: "90 deg", hint: "A tangent is perpendicular to the radius at contact." };
  return { question: "Predict AE * EB.", answer: answer(metrics["AE * EB"]), hint: "Multiply the two pieces of the same chord." };
}

function normalizeAnswer(value: string) {
  const numeric = Number(value.toLowerCase().replace(/deg|degrees|x/g, "").trim());
  if (Number.isFinite(numeric)) return String(roundTo(numeric, 2));
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

function miniQuestionsFor(id: TheoremId, metrics: Record<string, number>) {
  if (id === "angle-sum") return ["Which two angles are already known?", `What must angle C be if the total is ${roundTo(metrics.Total, 0)} degrees?`, "What visual cue says this is still one triangle?", "Can you explain the total without using numbers?"];
  if (id === "exterior-angle") return ["Where is the straight line?", "Which two interior angles are remote?", "What sum should the exterior angle match?", "What would make this proof invalid?"];
  if (id === "midpoint") return ["Which marks show the midpoints?", "Which segment is parallel to the base?", "What is the scale factor?", "Why is DE half of BC?"];
  if (id === "basic-proportionality") return ["Which line must be parallel?", "Where is the smaller triangle?", "Which ratios are equal?", "What happens if the line tilts?"];
  if (id === "similar-triangles") return ["Which angles correspond?", "Which sides correspond?", "What is the scale factor?", "What changes if only one side grows?"];
  if (id === "thales") return ["Where is the diameter?", "Where is the point on the circle?", "Which radii are equal?", "Why is the angle always right?"];
  if (id === "law-of-sines") return ["Which side is opposite angle A?", "What is the third angle?", "Which ratio stays constant?", "What fails if angles are mismatched?"];
  if (id === "law-of-cosines") return ["Which angle is included?", "What does the cosine term correct?", "What happens at 90 degrees?", "Which side is opposite the included angle?"];
  if (id === "inscribed-angle") return ["Which arc is shared?", "Where is the center angle?", "Where is the edge angle?", "Why is one half the other?"];
  if (id === "power-of-point") return ["Which lengths start at P?", "Which products match?", "Which triangles are similar?", "Why use whole secants?"];
  if (id === "tangent-radius") return ["Where is the touch point?", "Where is the radius?", "What angle forms at contact?", "What would make the line a secant?"];
  return ["Where is intersection E?", "Which segments belong to one chord?", "Which products match?", "What wrong multiplication would fail?"];
}

function noticePromptFor(id: TheoremId, step: number) {
  const prompts: Record<TheoremId, string> = {
    "angle-sum": "I noticed the third angle changes when...",
    "exterior-angle": "I noticed the outside angle matches...",
    midpoint: "I noticed the mid-segment stays...",
    "basic-proportionality": "I noticed the ratios stay equal when...",
    "similar-triangles": "I noticed corresponding sides...",
    thales: "I noticed the angle remains right even when...",
    "law-of-sines": "I noticed opposite pairs matter because...",
    "law-of-cosines": "I noticed the cosine term changes when...",
    "inscribed-angle": "I noticed both angles see...",
    "power-of-point": "I noticed the products stay equal although...",
    "tangent-radius": "I noticed the tangent never...",
    "intersecting-chords": "I noticed each chord product...",
  };
  return `${prompts[id]} (step ${step + 1})`;
}

function invalidStateFor(id: TheoremId) {
  const invalid: Record<TheoremId, string> = {
    "angle-sum": "Invalid: use a curved surface or a non-triangle shape, and the 180 degree Euclidean triangle argument no longer applies.",
    "exterior-angle": "Invalid: choose the interior angle adjacent to the exterior angle instead of the two remote angles.",
    midpoint: "Invalid: pick points that are not true midpoints; the half-base result can fail.",
    "basic-proportionality": "Invalid: tilt the inner line so it is not parallel to the base; proportional side ratios are no longer guaranteed.",
    "similar-triangles": "Invalid: match sides without proving equal angles; the scale factor may not be common.",
    thales: "Invalid: use a chord that is not a diameter; the angle on the circle need not be 90 degrees.",
    "law-of-sines": "Invalid: pair a side with an adjacent angle instead of its opposite angle.",
    "law-of-cosines": "Invalid: put a non-included angle into the cosine term; the computed side will be wrong.",
    "inscribed-angle": "Invalid: compare angles that subtend different arcs.",
    "power-of-point": "Invalid: multiply only inside-the-circle pieces instead of whole secant lengths from P.",
    "tangent-radius": "Invalid: use a line that cuts the circle twice; that is a secant, not a tangent.",
    "intersecting-chords": "Invalid: multiply neighboring pieces from different chords instead of the two pieces of the same chord.",
  };
  return invalid[id];
}

function rearrangementTextFor(id: TheoremId) {
  if (id === "angle-sum") return "Proof by rearrangement: imagine tearing off the three angle corners and placing them on a straight line.";
  if (id === "law-of-cosines") return "Pythagoras-style rearrangement: when the included angle becomes 90 degrees, the correction term disappears.";
  if (id === "midpoint" || id === "basic-proportionality" || id === "similar-triangles") return "Rearrangement idea: copy or scale the smaller triangle until it overlays the larger one.";
  if (["thales", "inscribed-angle", "power-of-point", "tangent-radius", "intersecting-chords"].includes(id)) return "Circle rearrangement: track the same arc, radius, tangent, or chord pieces as the point moves.";
  return "Rearrangement idea: move the marked pieces without changing the relationship they prove.";
}

function theoremMetrics(id: TheoremId, x: number, y: number, z: number): Record<string, number> {
  if (id === "angle-sum") {
    const c = Math.max(1, 180 - x - y);
    return { "Angle C": c, Total: x + y + c };
  }
  if (id === "exterior-angle") return { Exterior: x + y, "Remote sum": x + y };
  if (id === "midpoint") return { BC: x, DE: x / 2, "Height": y };
  if (id === "basic-proportionality") {
    const ratio = Math.min(0.85, Math.max(0.15, y / 120));
    return { "AD/AB": ratio, "AE/AC": ratio, "DE/BC": ratio };
  }
  if (id === "similar-triangles") return { Scale: x, "Small base": y, "Large base": x * y };
  if (id === "thales") return { "Angle APB": 90, "Diameter": 12 };
  if (id === "law-of-sines") {
    const cAngle = Math.max(1, 180 - x - y);
    const k = 8;
    return { "Angle C": cAngle, "Side a": k * Math.sin(deg(x)), "Side b": k * Math.sin(deg(y)), "Side c": k * Math.sin(deg(cAngle)) };
  }
  if (id === "law-of-cosines") {
    const sideC = Math.sqrt(x * x + y * y - 2 * x * y * Math.cos(deg(z)));
    return { "Side c": sideC, "c squared": sideC * sideC };
  }
  if (id === "inscribed-angle") return { "Central angle": x, "Inscribed angle": x / 2 };
  if (id === "power-of-point") {
    const pa = x / 10;
    const pb = pa + 6;
    const pc = Math.max(1, pa + y / 30);
    return { "PA * PB": pa * pb, "PC target": pc, "PD": (pa * pb) / pc };
  }
  if (id === "tangent-radius") return { "Contact angle": x, "Radius-tangent angle": 90 };
  const ae = 5 + Math.abs(x) / 20;
  const eb = 9 - Math.abs(x) / 30;
  const ce = 4 + y / 30;
  return { "AE * EB": ae * eb, "CE": ce, "ED": (ae * eb) / ce };
}

function ProofControlPanel({
  mode,
  selected,
  stages,
  activeStep,
  onStep,
  quiz,
  prediction,
  onPrediction,
  checked,
  isCorrect,
  onCheck,
  onResetQuiz,
}: {
  mode: ProofMode;
  selected: Theorem;
  stages: string[];
  activeStep: number;
  onStep: (step: number) => void;
  quiz: { question: string; answer: string; hint: string };
  prediction: string;
  onPrediction: (value: string) => void;
  checked: boolean;
  isCorrect: boolean;
  onCheck: () => void;
  onResetQuiz: () => void;
}) {
  if (mode === "Quiz") {
    return (
      <aside className="rounded-2xl border border-violet-200 bg-violet-50/80 p-4 dark:border-violet-300/20 dark:bg-violet-400/10">
        <p className="text-xs font-black uppercase tracking-wide text-violet-700 dark:text-violet-100">Quiz check</p>
        <h3 className="mt-1 text-lg font-black">{selected.title}</h3>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{quiz.question}</p>
        <input
          value={prediction}
          onChange={(event) => onPrediction(event.target.value)}
          className="mt-3 min-h-11 w-full rounded-xl border border-violet-200 bg-white px-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-violet-400 dark:border-violet-300/20 dark:bg-slate-950"
          placeholder="Type your prediction"
        />
        {checked && (
          <div className={`mt-3 rounded-xl border p-3 text-sm font-semibold ${isCorrect ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-300/20 dark:bg-emerald-400/10 dark:text-emerald-100" : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-300/20 dark:bg-amber-400/10 dark:text-amber-100"}`}>
            {isCorrect ? "Correct. The invariant survived the move." : `Close check: ${quiz.hint} Expected: ${quiz.answer}.`}
          </div>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={onCheck} className="rounded-full bg-violet-700 px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 dark:bg-violet-200 dark:text-violet-950">Check</button>
          <button type="button" onClick={onResetQuiz} className="rounded-full bg-white px-4 py-2 text-sm font-black text-violet-800 transition hover:-translate-y-0.5 dark:bg-white/10 dark:text-violet-100">Reset</button>
        </div>
      </aside>
    );
  }

  if (mode === "Prove") {
    return (
      <aside className="rounded-2xl border border-amber-200 bg-amber-50/80 p-4 dark:border-amber-300/20 dark:bg-amber-400/10">
        <p className="text-xs font-black uppercase tracking-wide text-amber-700 dark:text-amber-100">Proof focus</p>
        <h3 className="mt-1 text-lg font-black">{selected.title}</h3>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">{stages[activeStep]}</p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onStep(Math.max(0, activeStep - 1))}
            className="rounded-full bg-white px-4 py-2 text-sm font-black text-amber-800 transition hover:-translate-y-0.5 disabled:opacity-50 dark:bg-white/10 dark:text-amber-100"
            disabled={activeStep === 0}
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => onStep(Math.min(stages.length - 1, activeStep + 1))}
            className="rounded-full bg-amber-600 px-4 py-2 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-50 dark:bg-amber-200 dark:text-amber-950"
            disabled={activeStep === stages.length - 1}
          >
            Next
          </button>
        </div>
        <div className="mt-4 space-y-2">
          {stages.map((stage, index) => (
            <button key={stage} type="button" onClick={() => onStep(index)} className={`flex w-full items-start gap-2 rounded-xl p-2 text-left text-sm transition ${index === activeStep ? "bg-white font-black text-amber-900 dark:bg-white/15 dark:text-amber-50" : "text-slate-600 hover:bg-white/70 dark:text-slate-300 dark:hover:bg-white/10"}`}>
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-600 text-xs font-black text-white dark:bg-amber-200 dark:text-amber-950">{index + 1}</span>
              {stage}
            </button>
          ))}
        </div>
      </aside>
    );
  }

  return (
    <aside className="rounded-2xl border border-cyan-200 bg-cyan-50/80 p-4 dark:border-cyan-300/20 dark:bg-cyan-400/10">
      <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-100">Explore prompt</p>
      <h3 className="mt-1 text-lg font-black">{selected.title}</h3>
      <p className="mt-3 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">Move one control at a time. Watch the highlighted relationship and decide what changed: size, position, or truth value.</p>
      <div className="mt-4 rounded-xl bg-white p-3 text-sm font-semibold leading-6 text-slate-700 dark:bg-white/10 dark:text-slate-200">
        Prediction before moving: {quiz.hint}
      </div>
    </aside>
  );
}

function TheoremSvg({
  theorem,
  x,
  y,
  z,
  activeStep,
  ghost,
  showConstruction,
  hideMeasurements,
  onChange,
}: {
  theorem: TheoremId;
  x: number;
  y: number;
  z: number;
  activeStep: number;
  ghost: DiagramState | null;
  showConstruction: boolean;
  hideMeasurements: boolean;
  onChange: (next: Partial<DiagramState>) => void;
}) {
  if (["thales", "inscribed-angle", "power-of-point", "tangent-radius", "intersecting-chords"].includes(theorem)) return <CircleTheoremSvg theorem={theorem} x={x} y={y} z={z} activeStep={activeStep} ghost={ghost} showConstruction={showConstruction} hideMeasurements={hideMeasurements} onChange={onChange} />;
  return <TriangleTheoremSvg theorem={theorem} x={x} y={y} z={z} activeStep={activeStep} ghost={ghost} showConstruction={showConstruction} hideMeasurements={hideMeasurements} onChange={onChange} />;
}

function TriangleTheoremSvg({ theorem, x, y, z, activeStep, ghost, showConstruction, hideMeasurements, onChange }: { theorem: TheoremId; x: number; y: number; z: number; activeStep: number; ghost: DiagramState | null; showConstruction: boolean; hideMeasurements: boolean; onChange: (next: Partial<DiagramState>) => void }) {
  const left = { x: 70, y: 270 };
  const right = { x: 350, y: 270 };
  const top = { x: 200 + (x - 45) * 1.2, y: 70 + (80 - y) * 0.8 };
  const ghostTop = ghost ? { x: 200 + (ghost.x - 45) * 1.2, y: 70 + (80 - ghost.y) * 0.8 } : null;
  const ratio = theorem === "basic-proportionality" ? Math.min(0.85, Math.max(0.15, y / 120)) : 0.5;
  const d = lerp(top, left, ratio);
  const e = lerp(top, right, ratio);
  const scale = theorem === "similar-triangles" ? x : 2;
  const sideC = theorem === "law-of-cosines" ? Math.sqrt(x * x + y * y - 2 * x * y * Math.cos(deg(z))) : 0;

  const highlightBase = activeStep >= 2;
  const highlightAngles = activeStep <= 1 || theorem === "angle-sum" || theorem === "exterior-angle";
  const isSimilarityProof = ["midpoint", "basic-proportionality", "similar-triangles"].includes(theorem);

  function dragTop(event: React.PointerEvent<SVGCircleElement>) {
    const point = svgPoint(event);
    onChange({
      x: clamp(Math.round(45 + (point.x - 200) / 1.2), sliderMin(theorem, 0), sliderMax(theorem, 0)),
      y: clamp(Math.round(80 - (point.y - 70) / 0.8), sliderMin(theorem, 1), sliderMax(theorem, 1)),
    });
  }

  return (
    <svg viewBox="0 0 440 330" className="h-[380px] w-full">
      <defs>
        <marker id="parallelArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <path d="M 0 0 L 8 4 L 0 8" fill="#7c3aed" />
        </marker>
      </defs>
      {ghostTop && <polygon points={`${left.x},${left.y} ${right.x},${right.y} ${ghostTop.x},${ghostTop.y}`} fill="rgba(148,163,184,.10)" stroke="#94a3b8" strokeDasharray="7 6" strokeWidth="3" />}
      <polygon points={`${left.x},${left.y} ${right.x},${right.y} ${top.x},${top.y}`} fill="rgba(34,211,238,.16)" stroke="#06b6d4" strokeWidth="3" />
      {showConstruction && <line x1={top.x} y1={top.y} x2="200" y2="270" stroke="#64748b" strokeDasharray="5 6" strokeWidth="2" opacity="0.65" />}
      <AngleArc cx={left.x} cy={left.y} start={0} end={-58} color={highlightAngles ? "#f59e0b" : "#94a3b8"} label="A" hideMeasurements={hideMeasurements} value={x} />
      <AngleArc cx={right.x} cy={right.y} start={180} end={222} color={highlightAngles ? "#8b5cf6" : "#94a3b8"} label="B" hideMeasurements={hideMeasurements} value={y} />
      <AngleArc cx={top.x} cy={top.y} start={105} end={74} color="#7c3aed" label="C" hideMeasurements={hideMeasurements} value={Math.max(1, 180 - x - y)} />
      <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke={highlightBase ? "#f59e0b" : "#06b6d4"} strokeWidth={highlightBase ? "6" : "3"} opacity="0.9" />
      {isSimilarityProof && showConstruction && <><TickMark a={top} b={left} offset={-10} /><TickMark a={top} b={right} offset={10} /></>}
      {(theorem === "midpoint" || theorem === "basic-proportionality") && <ParallelMark a={left} b={right} yOffset={-12} />}
      {theorem === "midpoint" && <><line x1={d.x} y1={d.y} x2={e.x} y2={e.y} stroke="#f59e0b" strokeWidth={activeStep >= 2 ? "7" : "5"} /> <ParallelMark a={d} b={e} yOffset={-10} /></>}
      {theorem === "basic-proportionality" && <><line x1={d.x} y1={d.y} x2={e.x} y2={e.y} stroke="#f59e0b" strokeWidth={activeStep >= 1 ? "6" : "4"} strokeDasharray="8 5" /> <ParallelMark a={d} b={e} yOffset={-10} /></>}
      {theorem === "similar-triangles" && (
        <g transform="translate(245 25)">
          <polygon points={`0,190 ${38 * scale},190 ${20 * scale},${190 - 28 * scale}`} fill="rgba(245,158,11,.2)" stroke="#f59e0b" strokeWidth={activeStep >= 2 ? "5" : "3"} />
          {!hideMeasurements && <text x="0" y="215" fill="#f59e0b">scale {roundTo(scale, 1)}x</text>}
          <text x="0" y="178" fill="#7c3aed" className="text-[13px] font-black">corresponding sides</text>
        </g>
      )}
      {theorem === "exterior-angle" && <line x1={right.x} y1={right.y} x2="420" y2={right.y} stroke="#f59e0b" strokeWidth="4" />}
      {theorem === "law-of-cosines" && !hideMeasurements && <text x="150" y="305" fill="#f59e0b">c = {roundTo(sideC, 2)}</text>}
      {theorem === "law-of-sines" && !hideMeasurements && <text x="115" y="305" fill="#7c3aed">a/sin A = b/sin B = c/sin C</text>}
      <SideLabel a={left} b={right} label="base / c" color="#06b6d4" dy={20} />
      <SideLabel a={left} b={top} label="changing side" color="#f59e0b" dy={-8} />
      <SideLabel a={right} b={top} label="proof relation" color="#7c3aed" dy={-8} />
      <circle cx={left.x} cy={left.y} r="6" fill="#8b5cf6" /><circle cx={right.x} cy={right.y} r="6" fill="#8b5cf6" />
      <circle cx={top.x} cy={top.y} r="10" fill="#f59e0b" stroke="#fff" strokeWidth="3" className="cursor-grab" onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={(event) => { if (event.buttons === 1) dragTop(event); }} />
      <text x={left.x - 28} y={left.y - 8} fill="#7c3aed">A</text>
      <text x={right.x + 10} y={right.y - 8} fill="#7c3aed">B</text>
      <text x={top.x - 5} y={top.y - 12} fill="#7c3aed">C</text>
      {!hideMeasurements && <text x="28" y="28" fill="#0f172a" className="dark:fill-slate-100">{theoremLabel(theorem, x, y, z)}</text>}
    </svg>
  );
}

function CircleTheoremSvg({ theorem, x, y, activeStep, ghost, showConstruction, hideMeasurements, onChange }: { theorem: TheoremId; x: number; y: number; z: number; activeStep: number; ghost: DiagramState | null; showConstruction: boolean; hideMeasurements: boolean; onChange: (next: Partial<DiagramState>) => void }) {
  const cx = 220, cy = 165, r = 105;
  const a = pointOnCircle(cx, cy, r, 205);
  const b = pointOnCircle(cx, cy, r, -25);
  const p = theorem === "thales" ? pointOnCircle(cx, cy, r, x) : pointOnCircle(cx, cy, r, 90);
  const q = pointOnCircle(cx, cy, r, x);
  const t = pointOnCircle(cx, cy, r, x);
  const ghostPoint = ghost ? pointOnCircle(cx, cy, r, ghost.x) : null;
  const tangentAngle = deg(x + 90);

  function dragCircle(event: React.PointerEvent<SVGCircleElement>) {
    const point = svgPoint(event);
    if (theorem === "intersecting-chords") {
      onChange({ x: clamp(Math.round(point.x - cx), sliderMin(theorem, 0), sliderMax(theorem, 0)) });
      return;
    }
    const angle = Math.round((Math.atan2(point.y - cy, point.x - cx) * 180) / Math.PI);
    const normalized = angle < 0 ? angle + 360 : angle;
    onChange({ x: clamp(normalized, sliderMin(theorem, 0), sliderMax(theorem, 0)) });
  }

  return (
    <svg viewBox="0 0 440 330" className="h-[380px] w-full">
      {ghostPoint && <circle cx={ghostPoint.x} cy={ghostPoint.y} r="11" fill="none" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth="3" />}
      <circle cx={cx} cy={cy} r={r} fill="rgba(34,211,238,.12)" stroke={activeStep >= 1 ? "#f59e0b" : "#06b6d4"} strokeWidth={activeStep >= 1 ? "6" : "4"} />
      {showConstruction && <><line x1={cx - r} y1={cy} x2={cx + r} y2={cy} stroke="#64748b" strokeDasharray="5 6" strokeWidth="2" /><circle cx={cx} cy={cy} r="4" fill="#06b6d4" /></>}
      {theorem === "thales" && <><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#7c3aed" strokeWidth="4" /><line x1={a.x} y1={a.y} x2={p.x} y2={p.y} stroke="#f59e0b" strokeWidth="4" /><line x1={b.x} y1={b.y} x2={p.x} y2={p.y} stroke="#f59e0b" strokeWidth="4" />{!hideMeasurements && <text x={p.x + 8} y={p.y - 8} fill="#f59e0b">90 deg</text>}<TickMark a={a} b={p} offset={9} /><TickMark a={b} b={p} offset={-9} /></>}
      {theorem === "inscribed-angle" && <><line x1={cx} y1={cy} x2={a.x} y2={a.y} stroke="#7c3aed" strokeWidth="3" /><line x1={cx} y1={cy} x2={q.x} y2={q.y} stroke="#7c3aed" strokeWidth="3" /><line x1={p.x} y1={p.y} x2={a.x} y2={a.y} stroke="#f59e0b" strokeWidth="3" /><line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="#f59e0b" strokeWidth="3" />{!hideMeasurements && <text x="24" y="28" fill="#f59e0b">inscribed = {roundTo(x / 2, 1)} deg</text>}</>}
      {theorem === "power-of-point" && <><circle cx="55" cy={cy} r="5" fill="#f59e0b" /><line x1="55" y1={cy} x2={b.x} y2={b.y} stroke="#f59e0b" strokeWidth="4" /><line x1="55" y1={cy} x2={pointOnCircle(cx, cy, r, y).x} y2={pointOnCircle(cx, cy, r, y).y} stroke="#7c3aed" strokeWidth="4" /><text x="26" y={cy - 12} fill="#f59e0b">P</text><SideLabel a={{ x: 55, y: cy }} b={b} label="secant product" color="#7c3aed" dy={-10} /></>}
      {theorem === "tangent-radius" && <><line x1={cx} y1={cy} x2={t.x} y2={t.y} stroke="#7c3aed" strokeWidth="4" /><line x1={t.x - 150 * Math.cos(tangentAngle)} y1={t.y - 150 * Math.sin(tangentAngle)} x2={t.x + 150 * Math.cos(tangentAngle)} y2={t.y + 150 * Math.sin(tangentAngle)} stroke="#f59e0b" strokeWidth="4" />{!hideMeasurements && <text x={t.x + 8} y={t.y - 8} fill="#f59e0b">90 deg</text>}</>}
      {theorem === "intersecting-chords" && <><line x1={pointOnCircle(cx, cy, r, 210).x} y1={pointOnCircle(cx, cy, r, 210).y} x2={pointOnCircle(cx, cy, r, 20).x} y2={pointOnCircle(cx, cy, r, 20).y} stroke="#f59e0b" strokeWidth="4" /><line x1={pointOnCircle(cx, cy, r, 150 + y / 2).x} y1={pointOnCircle(cx, cy, r, 150 + y / 2).y} x2={pointOnCircle(cx, cy, r, -70).x} y2={pointOnCircle(cx, cy, r, -70).y} stroke="#7c3aed" strokeWidth="4" /><circle cx={cx + x} cy={cy} r="5" fill="#ef4444" /><text x={cx + x + 8} y={cy - 8} fill="#ef4444">E</text></>}
      <circle cx={theorem === "intersecting-chords" ? cx + x : t.x} cy={theorem === "intersecting-chords" ? cy : t.y} r="10" fill="#f59e0b" stroke="#fff" strokeWidth="3" className="cursor-grab" onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)} onPointerMove={(event) => { if (event.buttons === 1) dragCircle(event); }} />
      <text x={cx - 38} y={cy - r - 12} fill="#06b6d4" className="text-[13px] font-black">circle base</text>
      <text x={cx + 74} y={cy + 92} fill="#7c3aed" className="text-[13px] font-black">proof relation</text>
      <circle cx={cx} cy={cy} r="4" fill="#06b6d4" />
      {!hideMeasurements && <text x="24" y="306" fill="#0f172a" className="dark:fill-slate-100">{theoremLabel(theorem, x, y, 0)}</text>}
    </svg>
  );
}

function AngleArc({ cx, cy, start, end, color, label, value, hideMeasurements }: { cx: number; cy: number; start: number; end: number; color: string; label: string; value: number; hideMeasurements: boolean }) {
  const radius = 32;
  const a = pointOnCircle(cx, cy, radius, start);
  const b = pointOnCircle(cx, cy, radius, end);
  const mid = pointOnCircle(cx, cy, radius + 18, (start + end) / 2);
  return (
    <>
      <path d={`M ${a.x} ${a.y} A ${radius} ${radius} 0 0 0 ${b.x} ${b.y}`} fill="none" stroke={color} strokeWidth="4" />
      <text x={mid.x - 10} y={mid.y} fill={color} className="text-[13px] font-black">
        {label}{hideMeasurements ? "" : ` ${roundTo(value, 0)} deg`}
      </text>
    </>
  );
}

function SideLabel({ a, b, label, color, dy = 0 }: { a: { x: number; y: number }; b: { x: number; y: number }; label: string; color: string; dy?: number }) {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  return <text x={mid.x - 34} y={mid.y + dy} fill={color} className="text-[12px] font-black">{label}</text>;
}

function TickMark({ a, b, offset = 0 }: { a: { x: number; y: number }; b: { x: number; y: number }; offset?: number }) {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
  const angle = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI / 2;
  const length = 14;
  const center = { x: mid.x + Math.cos(angle) * offset, y: mid.y + Math.sin(angle) * offset };
  return (
    <line
      x1={center.x - Math.cos(angle) * length / 2}
      y1={center.y - Math.sin(angle) * length / 2}
      x2={center.x + Math.cos(angle) * length / 2}
      y2={center.y + Math.sin(angle) * length / 2}
      stroke="#7c3aed"
      strokeWidth="4"
      strokeLinecap="round"
    />
  );
}

function ParallelMark({ a, b, yOffset }: { a: { x: number; y: number }; b: { x: number; y: number }; yOffset: number }) {
  const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 + yOffset };
  return (
    <path
      d={`M ${mid.x - 18} ${mid.y + 6} L ${mid.x} ${mid.y - 6} L ${mid.x + 18} ${mid.y + 6}`}
      fill="none"
      stroke="#7c3aed"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function svgPoint(event: React.PointerEvent<SVGElement>) {
  const svg = event.currentTarget.ownerSVGElement;
  if (!svg) return { x: 0, y: 0 };
  const rect = svg.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 440,
    y: ((event.clientY - rect.top) / rect.height) * 330,
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function randomBetween(min: number, max: number) {
  return Math.round(min + Math.random() * (max - min));
}

function annotationPoint(event: React.PointerEvent<HTMLElement>, element: HTMLElement | null) {
  if (!element) return { x: 0, y: 0 };
  const rect = element.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * 100,
    y: ((event.clientY - rect.top) / rect.height) * 100,
  };
}

function randomId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function theoremLabel(theorem: TheoremId, x: number, y: number, z: number) {
  if (theorem === "angle-sum") return `${x} deg + ${y} deg + ${Math.max(1, 180 - x - y)} deg = 180 deg`;
  if (theorem === "exterior-angle") return `Exterior angle = ${x} deg + ${y} deg = ${x + y} deg`;
  if (theorem === "law-of-cosines") return `c^2 = ${x}^2 + ${y}^2 - 2(${x})(${y})cos(${z} deg)`;
  return theorems.find((item) => item.id === theorem)?.formula ?? "";
}

function changeText(id: TheoremId) {
  if (id === "angle-sum") return "Changing two angles forces the third angle to adjust so the total remains 180 degrees.";
  if (id === "law-of-cosines") return "Changing the included angle changes the opposite side; at 90 degrees this becomes Pythagoras.";
  if (id.includes("circle") || ["thales", "inscribed-angle", "power-of-point", "tangent-radius", "intersecting-chords"].includes(id)) return "Moving the point or angle changes the diagram, while the circle relationship remains invariant.";
  return "Moving the sliders changes lengths or angles, while the theorem relationship remains true.";
}

function stepsFor(id: TheoremId, x: number, y: number, z: number, metrics: Record<string, number>) {
  if (id === "angle-sum") return [`Start with angle A = ${roundTo(x, 1)} degrees.`, `Set angle B = ${roundTo(y, 1)} degrees.`, `The third angle becomes ${roundTo(metrics["Angle C"], 1)} degrees.`, `Total stays ${roundTo(metrics.Total, 1)} degrees.`];
  if (id === "exterior-angle") return [`Look at the outside straight line at the vertex.`, `A straight line measures 180 degrees.`, `The inside angle beside the exterior angle plus the exterior angle makes 180 degrees.`, `The three inside triangle angles also make 180 degrees, so the exterior angle equals the two far inside angles.`];
  if (id === "midpoint") return [`Mark the middle of the two sides.`, `The small top triangle keeps the same angles as the full triangle.`, `Its side lengths are half of the matching full-triangle sides.`, `So the middle segment is parallel to the base and has half the base length.`];
  if (id === "basic-proportionality") return [`Draw a line parallel to the base.`, `Parallel lines create equal corresponding angles.`, `The small triangle and large triangle are similar.`, `Matching sides must keep the same ratio, so AD/DB = AE/EC.`];
  if (id === "similar-triangles") return [`First match equal angles, not side lengths.`, `Equal angles force the two triangles to have the same shape.`, `One triangle is only a scaled copy of the other.`, `Every matching side is multiplied by the same scale factor.`];
  if (id === "thales") return [`Use the diameter as the longest side.`, `Join the circle center to the point on the circle.`, `Those two center-to-point segments are equal radii.`, `The equal-radius angles force the angle on the circle to become 90 degrees.`];
  if (id === "law-of-cosines") return [`Use sides a=${roundTo(x, 1)} and b=${roundTo(y, 1)}.`, `Use included angle C=${roundTo(z, 1)} degrees.`, `Compute c^2 with the cosine correction term.`, `The opposite side is c=${roundTo(metrics["Side c"], 2)}.`];
  if (id === "law-of-sines") return [`Choose two angles.`, `The third angle is ${roundTo(metrics["Angle C"], 1)} degrees.`, `Each side divided by sine of its opposite angle gives the same constant.`, `This lets you solve missing sides or angles.`];
  if (id === "inscribed-angle") return [`Pick the same arc for both angles.`, `The center angle opens across the full arc.`, `The angle on the circle sees the same arc from the edge.`, `The edge angle is always half the center angle.`];
  if (id === "power-of-point") return [`Start from the outside point P.`, `Draw two secants that cut the same circle.`, `The hidden triangles made by the secants are similar.`, `Similarity makes the products PA * PB and PC * PD equal.`];
  if (id === "tangent-radius") return [`Find the exact touch point.`, `Draw the radius from the center to that point.`, `A tangent cannot cut through the circle.`, `So it must meet the radius at a right angle.`];
  if (id === "intersecting-chords") return [`Look at the crossing point E inside the circle.`, `The two chords create pairs of equal angles.`, `Those equal angles create similar small triangles.`, `Similarity gives AE * EB = CE * ED.`];
  return [`Select the theorem card.`, `Move the sliders and watch the marked lengths or angles update.`, `Compare the metric cards on the left.`, `The equality remains true even as the diagram changes.`];
}

function tasksFor(id: TheoremId) {
  if (id === "angle-sum") return ["Set two angles, then predict the third before reading it.", "Make a skinny triangle and check the total.", "Explain why the total is not 200 degrees."];
  if (id === "exterior-angle") return ["Cover the inside angle next to the exterior angle.", "Add the two far inside angles.", "Check the outside angle matches their sum."];
  if (id === "midpoint") return ["Double DE mentally and compare with BC.", "Move the height and check if parallel direction changes.", "Say why midpoint matters."];
  if (id === "basic-proportionality") return ["Move the parallel line upward.", "Compare the two side ratios.", "Explain what would fail if the line was not parallel."];
  if (id === "law-of-cosines") return ["Set the included angle to 90 degrees.", "Compare the formula with Pythagoras.", "Increase the angle and watch side c grow."];
  if (id === "inscribed-angle") return ["Set central angle to 100 degrees.", "Check the inscribed angle is 50 degrees.", "Try another arc size."];
  if (id === "similar-triangles") return ["Set scale to 2.", "Double the base.", "Confirm every matching side scales together."];
  if (id === "thales") return ["Move the point around the circle.", "Check the angle stays 90 degrees.", "Explain why the diameter is special."];
  if (id === "power-of-point") return ["Move the outside point farther away.", "Compare PA * PB with the second secant product.", "Say why the lengths can change but product stays fixed."];
  if (id === "tangent-radius") return ["Move the touch point.", "Find the radius line.", "Check the tangent remains perpendicular."];
  if (id === "intersecting-chords") return ["Move E left and right.", "Multiply the two pieces of each chord.", "Check the products stay equal."];
  return ["Move each slider.", "Read the formula card.", "Use the metric cards to verify the theorem."];
}

function proofIdeaFor(id: TheoremId) {
  const ideas: Record<TheoremId, string> = {
    "angle-sum": "A triangle can be folded or compared with a straight line, so its three angles always make 180 degrees.",
    "exterior-angle": "The outside angle is exactly what remains from the straight line, so it matches the two far inside angles.",
    midpoint: "Midpoints make a half-size copy of the whole triangle.",
    "basic-proportionality": "A parallel line creates a smaller similar triangle inside the larger triangle.",
    "similar-triangles": "Same angles means same shape; only the size changes.",
    thales: "A diameter splits the circle into right-angle triangles from equal radii.",
    "law-of-sines": "Each side is tied to the height of the same triangle, so side divided by sine of the opposite angle is constant.",
    "law-of-cosines": "The cosine term corrects Pythagoras when the angle is not 90 degrees.",
    "inscribed-angle": "An angle at the circle edge sees half as much turn as the angle at the center.",
    "power-of-point": "Two secants from the same point form similar triangles, which force equal products.",
    "tangent-radius": "The shortest line from the center to the tangent is the radius to the touch point, so it is perpendicular.",
    "intersecting-chords": "Crossing chords make similar triangles, which turn segment ratios into equal products.",
  };
  return ideas[id];
}

function misconceptionFor(id: TheoremId) {
  const mistakes: Record<TheoremId, string> = {
    "angle-sum": "Do not add the two given angles and forget the third angle. The theorem is about all three interior angles.",
    "exterior-angle": "The exterior angle is not added to all three inside angles. It equals only the two remote interior angles.",
    midpoint: "A segment between any two side points is not enough. The points must be midpoints.",
    "basic-proportionality": "The ratio theorem needs a line parallel to the third side. Without parallel lines, the ratios may fail.",
    "similar-triangles": "Similar does not mean equal size. Congruent means equal size; similar means same shape.",
    thales: "The 90 degree angle happens only when the side is a diameter of the circle.",
    "law-of-sines": "Match each side with its opposite angle. Mixing adjacent angles gives wrong ratios.",
    "law-of-cosines": "The angle in the cosine term must be the included angle between sides a and b.",
    "inscribed-angle": "The center angle and edge angle must stand on the same arc.",
    "power-of-point": "Use whole secant lengths from P, not only the pieces inside the circle.",
    "tangent-radius": "A tangent touches once. A line that cuts the circle twice is a secant, not a tangent.",
    "intersecting-chords": "Multiply the two pieces of the same chord, not neighboring pieces from different chords.",
  };
  return mistakes[id];
}

function teacherPromptFor(id: TheoremId) {
  const prompts: Record<TheoremId, string> = {
    "angle-sum": "Can you predict the missing angle without calculating all over again?",
    "exterior-angle": "Which two inside angles are far away from the exterior angle?",
    midpoint: "What changed: size, direction, or shape?",
    "basic-proportionality": "Where do you see the smaller triangle hiding?",
    "similar-triangles": "Point to matching angles first, then matching sides.",
    thales: "Where is the diameter, and where is the right angle?",
    "law-of-sines": "Which side is opposite this angle?",
    "law-of-cosines": "What happens when the angle becomes 90 degrees?",
    "inscribed-angle": "Are both angles looking at the same arc?",
    "power-of-point": "Which lengths start at point P?",
    "tangent-radius": "Can a tangent lean without cutting the circle?",
    "intersecting-chords": "Which two pieces belong to one chord?",
  };
  return prompts[id];
}

function deg(value: number) {
  return (value * Math.PI) / 180;
}

function lerp(a: { x: number; y: number }, b: { x: number; y: number }, t: number) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function pointOnCircle(cx: number, cy: number, r: number, angle: number) {
  return { x: cx + r * Math.cos(deg(angle)), y: cy + r * Math.sin(deg(angle)) };
}

import { type CSSProperties, type Dispatch, type PointerEvent, type SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, MoveHorizontal, Pause, Play, RotateCcw, Search, Volume2, ZoomIn, ZoomOut } from "lucide-react";
import { Link } from "react-router-dom";
import MathExpression from "../../components/ui/MathExpression";
import FormulaComparisonGraph from "../components/formula-visualizer/FormulaComparisonGraph";
import FormulaGallery from "../components/formula-visualizer/FormulaGallery";
import FormulaJourneyMode from "../components/formula-visualizer/FormulaJourneyMode";
import FormulaPracticeMode from "../components/formula-visualizer/FormulaPracticeMode";
import IdentityProofPanel from "../components/formula-visualizer/IdentityProofPanel";
import MisconceptionAlerts from "../components/formula-visualizer/MisconceptionAlerts";
import UnitCircleFormulaVisualizer from "../components/formula-visualizer/UnitCircleFormulaVisualizer";
import {
  type AngleUnit,
  type ExplanationLevel,
  type TrigFormulaDefinition,
  type TrigFormulaGroupId,
  type TrigFormulaId,
  computeTrigFormulaValues,
  formatAngle,
  formatTrigNumber,
  getFormulaDefinition,
  getFormulaLiveValue,
  normalizeDegrees,
  snapToSpecialAngle,
  specialAngleMarkers,
  trigFormulaDefinitions,
} from "../utils/trigFormulaUtils";

type VisualMode = "unit-circle" | "triangle" | "graph" | "compare";
type LowerTab = "journey" | "compare" | "practice" | "mistakes" | "gallery";
type ValueFormat = "decimal" | "exact";

const categoryTabs: Array<{ id: "all" | TrigFormulaGroupId | "graphs" | "triangles" | "unit-circle"; label: string }> = [
  { id: "all", label: "All" },
  { id: "basic-ratios", label: "Ratios" },
  { id: "reciprocal-identities", label: "Reciprocal" },
  { id: "pythagorean-identities", label: "Identities" },
  { id: "complementary-angle-identities", label: "Co-functions" },
  { id: "sum-difference-identities", label: "Sum/Diff" },
  { id: "double-angle-identities", label: "Double" },
  { id: "periodic-identities", label: "Period" },
  { id: "basic-flip-formulas", label: "Basic flips" },
  { id: "graphs", label: "Graphs" },
];

const symbolRows = [
  { symbol: "theta", label: "angle", color: "bg-amber-300" },
  { symbol: "sin theta", label: "vertical height", color: "bg-rose-400" },
  { symbol: "cos theta", label: "horizontal base", color: "bg-sky-400" },
  { symbol: "tan theta", label: "outside tangent", color: "bg-yellow-300" },
  { symbol: "r", label: "radius", color: "bg-violet-400" },
  { symbol: "x", label: "cos coordinate", color: "bg-cyan-300" },
  { symbol: "y", label: "sin coordinate", color: "bg-emerald-300" },
];

const lowerTabs: Array<{ id: LowerTab; label: string }> = [
  { id: "journey", label: "Steps" },
  { id: "compare", label: "Graphs" },
  { id: "practice", label: "Practice" },
  { id: "mistakes", label: "Mistakes" },
  { id: "gallery", label: "Formula Gallery" },
];

export default function TrigFormulaVisualizerPage() {
  const [degrees, setDegrees] = useState(45);
  const [selectedFormulaId, setSelectedFormulaId] = useState<TrigFormulaId>("sin");
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [angleUnit, setAngleUnit] = useState<AngleUnit>("degrees");
  const [explanationLevel, setExplanationLevel] = useState<ExplanationLevel>("simple");
  const [compareEvenOdd, setCompareEvenOdd] = useState(false);
  const [compareComplementary, setCompareComplementary] = useState(false);
  const [journeyStep, setJourneyStep] = useState(0);
  const [category, setCategory] = useState<(typeof categoryTabs)[number]["id"]>("all");
  const [formulaSearch, setFormulaSearch] = useState("");
  const [visualMode, setVisualMode] = useState<VisualMode>("unit-circle");
  const [lowerTab, setLowerTab] = useState<LowerTab>("compare");
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [controlWidth, setControlWidth] = useState(320);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [valueFormat, setValueFormat] = useState<ValueFormat>("decimal");
  const [playing, setPlaying] = useState(false);
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false);
  const paneRef = useRef<HTMLDivElement | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const values = useMemo(() => computeTrigFormulaValues(degrees), [degrees]);
  const selectedFormula = getFormulaDefinition(selectedFormulaId);
  const filteredFormulas = useMemo(
    () =>
      trigFormulaDefinitions.filter((formula) => {
        const query = formulaSearch.trim().toLowerCase();
        const categoryMatch =
          category === "all" ||
          (category === "graphs" && ["sin", "cos", "tan"].includes(formula.id)) ||
          (category === "triangles" && ["basic-ratios", "quotient-identities", "complementary-angle-identities"].includes(formula.groupId)) ||
          (category === "unit-circle" && ["basic-ratios", "reciprocal-identities", "pythagorean-identities", "even-odd-identities", "periodic-identities", "double-angle-identities"].includes(formula.groupId)) ||
          formula.groupId === category;
        const searchMatch =
          !query ||
          `${formula.label} ${formula.formula} ${formula.meaning} ${formula.visualExplanation}`.toLowerCase().includes(query);
        return categoryMatch && searchMatch;
      }),
    [category, formulaSearch],
  );

  useEffect(() => {
    if (!playing) return undefined;
    const timer = window.setInterval(() => {
      setDegrees((current) => normalizeDegrees(current >= 360 ? 0 : current + 1));
    }, 80);
    return () => window.clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === paneRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const updateDegrees = (nextDegrees: number) => {
    const normalized = normalizeDegrees(nextDegrees);
    setDegrees(snapEnabled ? snapToSpecialAngle(normalized) : normalized);
  };

  const selectFormula = (formulaId: TrigFormulaId) => {
    setSelectedFormulaId(formulaId);
    if (formulaId.startsWith("even-")) setCompareEvenOdd(true);
    if (formulaId.startsWith("comp-")) setCompareComplementary(true);
  };

  const resizeControls = (clientX: number) => {
    const next = Math.min(430, Math.max(250, clientX - 390));
    setControlWidth(next);
  };

  const startResize = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeControls(event.clientX);
  };

  const moveResize = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.buttons !== 1) return;
    resizeControls(event.clientX);
  };

  const toggleFullscreen = async () => {
    if (document.fullscreenElement === paneRef.current) {
      await document.exitFullscreen();
      return;
    }
    await paneRef.current?.requestFullscreen?.();
  };

  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(
      `${selectedFormula.label}. ${selectedFormula.explanations[explanationLevel]} At ${Math.round(values.degrees)} degrees, sine is ${formatTrigNumber(values.sin)}, cosine is ${formatTrigNumber(values.cos)}, and tangent is ${values.tan === null ? "undefined" : formatTrigNumber(values.tan)}.`,
    );
    utterance.rate = 0.92;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <main className="desktop-page-shell" data-testid="trig-formula-visualizer-page">
      <div className="desktop-page-header !p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Trigono / Formula Visualizer</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white md:text-4xl">
              Trigonometric Formula Visualizer
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300 md:text-base">
              Drag theta on the unit circle and watch sine, cosine, tangent, squared ratios, and the core identity change as geometry.
            </p>
          </div>
          <Link to="/trigonometry" className="action-secondary w-fit">
            Back to Trigonometry
          </Link>
        </div>
      </div>

      <TopFormulaStrip
        category={category}
        onCategoryChange={setCategory}
        formulaSearch={formulaSearch}
        onSearchChange={setFormulaSearch}
        formulas={filteredFormulas}
        selectedFormulaId={selectedFormulaId}
        onSelect={selectFormula}
        selectedFormula={selectedFormula}
      />

      <FormulaJourneyMode
        currentStep={journeyStep}
        onStepChange={setJourneyStep}
        onSelectFormula={selectFormula}
        onAngleChange={updateDegrees}
      />

      <section
        className="relative mt-4 grid gap-3 lg:grid-cols-[var(--control-width)_8px_minmax(0,1fr)_minmax(300px,0.46fr)]"
        style={{ "--control-width": `${controlWidth}px` } as CSSProperties}
      >
        <aside className="min-w-0 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
          <ControlPanel
            values={values}
            angleUnit={angleUnit}
            setAngleUnit={setAngleUnit}
            snapEnabled={snapEnabled}
            setSnapEnabled={setSnapEnabled}
            valueFormat={valueFormat}
            setValueFormat={setValueFormat}
            compareEvenOdd={compareEvenOdd}
            setCompareEvenOdd={setCompareEvenOdd}
            compareComplementary={compareComplementary}
            setCompareComplementary={setCompareComplementary}
            onAngleChange={updateDegrees}
            selectedFormula={selectedFormula}
            explanationLevel={explanationLevel}
            setExplanationLevel={setExplanationLevel}
            onSpeak={speak}
            playing={playing}
            setPlaying={setPlaying}
          />
        </aside>

        <button
          type="button"
          className="hidden cursor-col-resize items-center justify-center rounded-full border border-cyan-200 bg-white text-cyan-800 shadow-sm dark:border-cyan-300/30 dark:bg-slate-950 dark:text-cyan-100 lg:flex"
          onPointerDown={startResize}
          onPointerMove={moveResize}
          aria-label="Resize controls panel"
          title="Drag to resize controls"
        >
          <MoveHorizontal className="h-4 w-4" />
        </button>

        <section ref={paneRef} className="min-w-0 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
          <div className="mb-3 flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-300">Interactive 2D pane</p>
              <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">Formula, diagram, graph</h2>
            </div>
            <PaneToolbar
              visualMode={visualMode}
              setVisualMode={setVisualMode}
              zoom={zoom}
              setZoom={setZoom}
              setPan={setPan}
              fullscreen={fullscreen}
              onFullscreen={toggleFullscreen}
            />
          </div>

          <div className="rounded-xl border border-cyan-200/80 bg-slate-950 p-2 dark:border-cyan-300/25" data-testid="trig-main-visual-pane">
            <div className="overflow-hidden rounded-lg" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "center center" }}>
              {visualMode === "unit-circle" && (
                <UnitCircleFormulaVisualizer
                  values={values}
                  selectedFormulaId={selectedFormulaId}
                  onAngleChange={updateDegrees}
                  compareEvenOdd={compareEvenOdd}
                  compareComplementary={compareComplementary}
                />
              )}
              {visualMode === "triangle" && <TriangleOverlay values={values} selectedFormulaId={selectedFormulaId} onAngleChange={updateDegrees} />}
              {visualMode === "graph" && <FormulaComparisonGraph values={values} />}
              {visualMode === "compare" && (
                <IdentityProofPanel
                  formula={selectedFormula}
                  values={values}
                  explanationLevel={explanationLevel}
                  compareEvenOdd={compareEvenOdd}
                  compareComplementary={compareComplementary}
                />
              )}
            </div>
          </div>
        </section>

        <aside className={rightCollapsed ? "min-w-0 lg:w-14" : "min-w-0"}>
          <button
            type="button"
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-3 py-2 text-sm font-black text-slate-800 shadow-sm dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-100"
            onClick={() => setRightCollapsed((value) => !value)}
            aria-expanded={!rightCollapsed}
          >
            {rightCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {!rightCollapsed && "Values and explanation"}
          </button>
          {!rightCollapsed && (
            <RightInsightPanel
              formula={selectedFormula}
              values={values}
              explanationLevel={explanationLevel}
              valueFormat={valueFormat}
              compareEvenOdd={compareEvenOdd}
              compareComplementary={compareComplementary}
            />
          )}
        </aside>
      </section>

      <section className="mt-4 rounded-xl border border-slate-200 bg-white/85 p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/50">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Formula lab tabs">
          {lowerTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={lowerTab === tab.id}
              className={lowerTab === tab.id ? "action-primary min-h-10 rounded-lg px-4 py-2" : "action-secondary min-h-10 rounded-lg px-4 py-2"}
              onClick={() => setLowerTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="mt-3">
          {lowerTab === "journey" && (
            <FormulaJourneyMode
              currentStep={journeyStep}
              onStepChange={setJourneyStep}
              onSelectFormula={selectFormula}
              onAngleChange={updateDegrees}
            />
          )}
          {lowerTab === "compare" && <FormulaComparisonGraph values={values} />}
          {lowerTab === "practice" && <FormulaPracticeMode />}
          {lowerTab === "mistakes" && <MisconceptionAlerts />}
          {lowerTab === "gallery" && <FormulaGallery values={values} selectedFormulaId={selectedFormulaId} onSelect={selectFormula} />}
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
        {mobileControlsOpen && (
          <div className="mb-2 max-h-[68vh] overflow-auto rounded-2xl border border-cyan-200 bg-white p-3 shadow-2xl dark:border-cyan-300/30 dark:bg-slate-950">
            <ControlPanel
              values={values}
              angleUnit={angleUnit}
              setAngleUnit={setAngleUnit}
              snapEnabled={snapEnabled}
              setSnapEnabled={setSnapEnabled}
              valueFormat={valueFormat}
              setValueFormat={setValueFormat}
              compareEvenOdd={compareEvenOdd}
              setCompareEvenOdd={setCompareEvenOdd}
              compareComplementary={compareComplementary}
              setCompareComplementary={setCompareComplementary}
              onAngleChange={updateDegrees}
              selectedFormula={selectedFormula}
              explanationLevel={explanationLevel}
              setExplanationLevel={setExplanationLevel}
              onSpeak={speak}
              playing={playing}
              setPlaying={setPlaying}
            />
          </div>
        )}
        <button type="button" className="action-primary w-full rounded-2xl py-3 shadow-xl" onClick={() => setMobileControlsOpen((value) => !value)}>
          {mobileControlsOpen ? "Close controls" : "Open formula controls"}
        </button>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}

function TopFormulaStrip({
  category,
  onCategoryChange,
  formulaSearch,
  onSearchChange,
  formulas,
  selectedFormulaId,
  selectedFormula,
  onSelect,
}: {
  category: (typeof categoryTabs)[number]["id"];
  onCategoryChange: (category: (typeof categoryTabs)[number]["id"]) => void;
  formulaSearch: string;
  onSearchChange: (value: string) => void;
  formulas: TrigFormulaDefinition[];
  selectedFormulaId: TrigFormulaId;
  selectedFormula: TrigFormulaDefinition;
  onSelect: (formulaId: TrigFormulaId) => void;
}) {
  return (
    <section className="mt-4 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/60">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-start">
        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={category === tab.id ? "action-primary min-h-10 rounded-lg px-4 py-2" : "action-secondary min-h-10 rounded-lg px-4 py-2"}
                onClick={() => onCategoryChange(tab.id)}
                aria-pressed={category === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="Filtered formula picker">
            {formulas.map((formula) => (
              <button
                key={formula.id}
                type="button"
                className={`shrink-0 rounded-xl border px-3 py-2 text-left transition ${
                  formula.id === selectedFormulaId
                    ? "border-cyan-400 bg-cyan-50 text-cyan-950 shadow-sm dark:border-cyan-300/70 dark:bg-cyan-400/15 dark:text-cyan-50"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:border-cyan-300 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"
                }`}
                onClick={() => onSelect(formula.id)}
                data-testid={`formula-picker-${formula.id}`}
              >
                <MathExpression value={formula.formula} className="text-sm font-black" />
                <span className="mt-1 block text-[11px] font-bold uppercase opacity-75">{formula.meaning}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={formulaSearch}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search sin, cos, identity..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm font-bold text-slate-900 outline-none transition focus:border-cyan-400 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
            />
          </label>
          <div className="mt-3 rounded-xl border border-cyan-200 bg-cyan-50/80 p-3 dark:border-cyan-300/25 dark:bg-cyan-400/10">
            <p className="text-[11px] font-black uppercase tracking-wide text-cyan-800 dark:text-cyan-200">Selected formula</p>
            <MathExpression value={selectedFormula.formula} display className="mt-2 text-xl font-black text-slate-950 dark:text-white" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ControlPanel({
  values,
  angleUnit,
  setAngleUnit,
  snapEnabled,
  setSnapEnabled,
  valueFormat,
  setValueFormat,
  compareEvenOdd,
  setCompareEvenOdd,
  compareComplementary,
  setCompareComplementary,
  onAngleChange,
  selectedFormula,
  explanationLevel,
  setExplanationLevel,
  onSpeak,
  playing,
  setPlaying,
}: {
  values: ReturnType<typeof computeTrigFormulaValues>;
  angleUnit: AngleUnit;
  setAngleUnit: (unit: AngleUnit) => void;
  snapEnabled: boolean;
  setSnapEnabled: (enabled: boolean) => void;
  valueFormat: ValueFormat;
  setValueFormat: (format: ValueFormat) => void;
  compareEvenOdd: boolean;
  setCompareEvenOdd: (enabled: boolean) => void;
  compareComplementary: boolean;
  setCompareComplementary: (enabled: boolean) => void;
  onAngleChange: (degrees: number) => void;
  selectedFormula: TrigFormulaDefinition;
  explanationLevel: ExplanationLevel;
  setExplanationLevel: (level: ExplanationLevel) => void;
  onSpeak: () => void;
  playing: boolean;
  setPlaying: (playing: boolean) => void;
}) {
  return (
    <div className="space-y-3" data-testid="formula-control-panel">
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Angle control</p>
          <span className="rounded-lg bg-cyan-100 px-2 py-1 font-mono text-xs font-black text-cyan-900 dark:bg-cyan-400/20 dark:text-cyan-50" data-testid="theta-live-value">
            {formatAngle(values, angleUnit)} / {values.radiansLabel}
          </span>
        </div>
        <input
          className="slider-range mt-3 w-full cursor-pointer appearance-none accent-cyan-500 touch-pan-x"
          type="range"
          min="0"
          max="360"
          step="1"
          value={values.degrees}
          onChange={(event) => onAngleChange(Number(event.target.value))}
          aria-label="theta angle"
          aria-valuetext={formatAngle(values, angleUnit)}
          data-testid="theta-slider"
        />
        <div className="mt-3 grid grid-cols-4 gap-2">
          {specialAngleMarkers.map((angle) => (
            <button key={angle} type="button" className="mini-chip justify-center" onClick={() => onAngleChange(angle)} data-testid={`special-angle-${angle}`}>
              {angle} deg
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <ToggleButton active={angleUnit === "radians"} onClick={() => setAngleUnit(angleUnit === "degrees" ? "radians" : "degrees")} label={angleUnit === "degrees" ? "Degrees" : "Radians"} />
        <ToggleButton active={valueFormat === "exact"} onClick={() => setValueFormat(valueFormat === "decimal" ? "exact" : "decimal")} label={valueFormat === "decimal" ? "Decimal" : "Exact"} />
        <ToggleButton active={snapEnabled} onClick={() => setSnapEnabled(!snapEnabled)} label="Snap" />
        <ToggleButton active={compareEvenOdd} onClick={() => setCompareEvenOdd(!compareEvenOdd)} label="theta / -theta" />
        <ToggleButton active={compareComplementary} onClick={() => setCompareComplementary(!compareComplementary)} label="90 - theta" />
        <button type="button" className="action-secondary min-h-10 rounded-lg px-3 py-2" onClick={() => onAngleChange(45)} data-testid="reset-angle-button">
          Reset
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" className="action-primary min-h-10 rounded-lg px-3 py-2" onClick={() => setPlaying(!playing)}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {playing ? "Pause" : "Animate"}
        </button>
        <button type="button" className="action-secondary min-h-10 rounded-lg px-3 py-2" onClick={onSpeak}>
          <Volume2 className="h-4 w-4" />
          Read
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Explanation level</p>
        <div className="mt-2 grid gap-2">
          {[
            ["simple", "Simple"],
            ["detailed", "Detailed"],
            ["memory", "Exam trick"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={explanationLevel === id ? "rounded-lg border border-cyan-400 bg-cyan-50 px-3 py-2 text-left text-sm font-black text-cyan-900 dark:border-cyan-300/70 dark:bg-cyan-400/15 dark:text-cyan-50" : "rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-200"}
              onClick={() => setExplanationLevel(id as ExplanationLevel)}
              data-testid={`explanation-level-${id}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-cyan-200 bg-cyan-50/80 p-3 dark:border-cyan-300/25 dark:bg-cyan-400/10">
        <p className="text-[11px] font-black uppercase tracking-wide text-cyan-800 dark:text-cyan-200">Active focus</p>
        <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">{selectedFormula.meaning}</p>
        <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">{selectedFormula.visualExplanation}</p>
      </div>
    </div>
  );
}

function ToggleButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={active ? "rounded-lg border border-cyan-400 bg-cyan-50 px-3 py-2 text-sm font-black text-cyan-900 dark:border-cyan-300/70 dark:bg-cyan-400/15 dark:text-cyan-50" : "rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200"}
      onClick={onClick}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function PaneToolbar({
  visualMode,
  setVisualMode,
  zoom,
  setZoom,
  setPan,
  fullscreen,
  onFullscreen,
}: {
  visualMode: VisualMode;
  setVisualMode: (mode: VisualMode) => void;
  zoom: number;
  setZoom: (next: number) => void;
  setPan: Dispatch<SetStateAction<{ x: number; y: number }>>;
  fullscreen: boolean;
  onFullscreen: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {[
        ["unit-circle", "Unit Circle"],
        ["triangle", "Triangle"],
        ["graph", "Graphs"],
        ["compare", "Verify"],
      ].map(([id, label]) => (
        <button key={id} type="button" className={visualMode === id ? "action-primary min-h-9 rounded-lg px-3 py-1.5 text-xs" : "action-secondary min-h-9 rounded-lg px-3 py-1.5 text-xs"} onClick={() => setVisualMode(id as VisualMode)}>
          {label}
        </button>
      ))}
      <button type="button" className="tool-button min-h-9 rounded-lg px-3 py-1.5" onClick={() => setZoom(Math.min(1.8, Number((zoom + 0.1).toFixed(2))))} title="Zoom in">
        <ZoomIn className="h-4 w-4" />
      </button>
      <button type="button" className="tool-button min-h-9 rounded-lg px-3 py-1.5" onClick={() => setZoom(Math.max(0.75, Number((zoom - 0.1).toFixed(2))))} title="Zoom out">
        <ZoomOut className="h-4 w-4" />
      </button>
      <button type="button" className="tool-button min-h-9 rounded-lg px-3 py-1.5" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} title="Reset view">
        <RotateCcw className="h-4 w-4" />
      </button>
      <button type="button" className="tool-button min-h-9 rounded-lg px-3 py-1.5" onClick={() => setPan((current) => ({ ...current, x: current.x - 16 }))} title="Pan left">
        Left
      </button>
      <button type="button" className="tool-button min-h-9 rounded-lg px-3 py-1.5" onClick={() => setPan((current) => ({ ...current, x: current.x + 16 }))} title="Pan right">
        Right
      </button>
      <button type="button" className="tool-button min-h-9 rounded-lg px-3 py-1.5" onClick={onFullscreen} title={fullscreen ? "Exit full screen" : "Full screen"}>
        {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

function RightInsightPanel({
  formula,
  values,
  explanationLevel,
  valueFormat,
  compareEvenOdd,
  compareComplementary,
}: {
  formula: TrigFormulaDefinition;
  values: ReturnType<typeof computeTrigFormulaValues>;
  explanationLevel: ExplanationLevel;
  valueFormat: ValueFormat;
  compareEvenOdd: boolean;
  compareComplementary: boolean;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-slate-200 bg-white/90 p-3 shadow-sm dark:border-white/10 dark:bg-slate-950/60" data-testid="selected-formula-panel">
      <div className="rounded-xl border border-cyan-200 bg-cyan-50/80 p-3 dark:border-cyan-300/25 dark:bg-cyan-400/10">
        <p className="text-[11px] font-black uppercase tracking-wide text-cyan-800 dark:text-cyan-200">Formula</p>
        <MathExpression value={formula.formula} display className="mt-2 text-lg font-black text-slate-950 dark:text-white" />
        <p className="mt-2 text-sm font-bold text-slate-700 dark:text-slate-200">{formula.explanations[explanationLevel]}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Metric label="angle" value={`${values.degrees.toFixed(0)} deg`} />
        <Metric label="radians" value={values.radiansLabel} />
        <Metric label="point" value={`(${formatTrigNumber(values.coordinate.x)}, ${formatTrigNumber(values.coordinate.y)})`} />
        <Metric label="live formula" value={getFormulaLiveValue(formula.id, values)} />
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">What each symbol means</p>
        <div className="mt-2 grid gap-2">
          {symbolRows.map((row) => (
            <div key={row.symbol} className="flex items-center gap-2 rounded-lg bg-white px-2 py-1.5 dark:bg-slate-950/60">
              <span className={`h-2.5 w-2.5 rounded-full ${row.color}`} />
              <MathExpression value={row.symbol} className="w-16 font-black" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{row.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Live value table</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          {[
            ["sin", values.sin],
            ["cos", values.cos],
            ["tan", values.tan],
            ["sec", values.sec],
            ["cosec", values.cosec],
            ["cot", values.cot],
          ].map(([label, value]) => (
            <Metric key={label as string} label={label as string} value={formatDisplayValue(label as string, value as number | null, valueFormat, values.degrees)} />
          ))}
        </div>
      </div>

      <IdentityCheckCard values={values} formula={formula} />
      {(compareEvenOdd || compareComplementary) && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 text-sm font-bold text-violet-950 dark:border-violet-300/25 dark:bg-violet-400/10 dark:text-violet-50">
          Comparison overlays are active in the visual pane.
        </div>
      )}
    </section>
  );
}

function IdentityCheckCard({ values, formula }: { values: ReturnType<typeof computeTrigFormulaValues>; formula: TrigFormulaDefinition }) {
  const lhs = values.sinSquare + values.cosSquare;
  const rhs = 1;
  const diff = Math.abs(lhs - rhs);
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-300/25 dark:bg-emerald-400/10">
      <p className="text-xs font-black uppercase tracking-wide text-emerald-800 dark:text-emerald-200">Identity verification</p>
      <div className="mt-2 grid grid-cols-3 gap-2">
        <Metric label="LHS" value={formatTrigNumber(lhs)} />
        <Metric label="RHS" value={formatTrigNumber(rhs)} />
        <Metric label="error" value={formatTrigNumber(diff)} />
      </div>
      <p className="mt-2 text-xs font-bold text-emerald-950 dark:text-emerald-50">
        Common mistake: {formula.id.includes("square") || formula.id.includes("pythagorean") ? "sin^2 theta means (sin theta)^2." : "Keep track of which side is height, base, or hypotenuse."}
      </p>
    </div>
  );
}

export function trianglePointerToDegrees(pointer: { x: number; y: number }, origin: { x: number; y: number }) {
  const dx = Math.max(12, pointer.x - origin.x);
  const dy = Math.max(12, origin.y - pointer.y);
  return Math.min(89, Math.max(1, (Math.atan2(dy, dx) * 180) / Math.PI));
}

function TriangleOverlay({ values, selectedFormulaId, onAngleChange }: { values: ReturnType<typeof computeTrigFormulaValues>; selectedFormulaId: TrigFormulaId; onAngleChange: (degrees: number) => void }) {
  const width = 640;
  const height = 420;
  const origin = { x: 100, y: 330 };
  const triangleAngle = values.degrees > 90 && values.degrees < 270 ? 180 - values.degrees : values.degrees > 270 ? values.degrees - 360 : values.degrees;
  const rightTriangleDegrees = Math.min(89, Math.max(1, Math.abs(triangleAngle)));
  const rightTriangleRadians = (rightTriangleDegrees * Math.PI) / 180;
  const base = 360 * Math.max(0.08, Math.abs(Math.cos(rightTriangleRadians)));
  const tall = 240 * Math.max(0.08, Math.abs(Math.sin(rightTriangleRadians)));
  const point = { x: origin.x + base, y: origin.y - tall };
  const highlightSin = selectedFormulaId.includes("sin") || selectedFormulaId.includes("cosec") || selectedFormulaId.includes("pythagorean");
  const highlightCos = selectedFormulaId.includes("cos") || selectedFormulaId.includes("sec") || selectedFormulaId.includes("pythagorean");
  const highlightTan = selectedFormulaId.includes("tan") || selectedFormulaId.includes("cot");

  function updateFromTrianglePointer(event: PointerEvent<SVGSVGElement>) {
    const svg = event.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * width;
    const y = ((event.clientY - rect.top) / rect.height) * height;
    onAngleChange(trianglePointerToDegrees({ x, y }, origin));
  }

  function handlePointerDown(event: PointerEvent<SVGSVGElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    updateFromTrianglePointer(event);
  }

  function handlePointerMove(event: PointerEvent<SVGSVGElement>) {
    if (event.buttons !== 1) return;
    updateFromTrianglePointer(event);
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-[430px] w-full touch-none select-none rounded-xl bg-slate-950"
      role="img"
      aria-label="Interactive right triangle formula visualizer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      data-testid="formula-triangle-svg"
    >
      <rect width={width} height={height} fill="#020617" />
      <g opacity="0.18">
        {Array.from({ length: 11 }, (_, index) => index * 60 + 20).map((x) => <line key={`x-${x}`} x1={x} x2={x} y1="20" y2="390" stroke="#94a3b8" />)}
        {Array.from({ length: 7 }, (_, index) => index * 55 + 35).map((y) => <line key={`y-${y}`} x1="35" x2="600" y1={y} y2={y} stroke="#94a3b8" />)}
      </g>
      <polygon points={`${origin.x},${origin.y} ${origin.x + base},${origin.y} ${point.x},${point.y}`} fill="rgba(34,211,238,0.16)" stroke="#e2e8f0" strokeWidth="3" />
      <line x1={origin.x} y1={origin.y} x2={origin.x + base} y2={origin.y} stroke={highlightCos ? "#38bdf8" : "#94a3b8"} strokeWidth={highlightCos ? 10 : 5} strokeLinecap="round" />
      <line x1={origin.x + base} y1={origin.y} x2={point.x} y2={point.y} stroke={highlightSin ? "#fb7185" : "#94a3b8"} strokeWidth={highlightSin ? 10 : 5} strokeLinecap="round" />
      <line x1={origin.x} y1={origin.y} x2={point.x} y2={point.y} stroke={highlightTan ? "#facc15" : "#c084fc"} strokeWidth={highlightTan ? 8 : 5} strokeLinecap="round" />
      <path d={`M ${origin.x + 55} ${origin.y} A 55 55 0 0 0 ${origin.x + 45} ${origin.y - 35}`} fill="none" stroke="#f59e0b" strokeWidth="5" />
      <circle cx={point.x} cy={point.y} r="13" fill="#22d3ee" opacity="0.28" />
      <circle cx={point.x} cy={point.y} r="7" fill="#22d3ee" stroke="#f8fafc" strokeWidth="3" />
      <text x={point.x + 15} y={point.y - 12} fill="#cffafe" fontSize="13" fontWeight="900">drag</text>
      <text x={origin.x + base / 2 - 40} y={origin.y + 34} fill="#38bdf8" fontSize="17" fontWeight="900">adjacent = cos theta</text>
      <text x={point.x + 16} y={origin.y - tall / 2} fill="#fb7185" fontSize="17" fontWeight="900">opposite = sin theta</text>
      <text x={origin.x + base / 2 - 18} y={origin.y - tall / 2 - 14} fill="#fef3c7" fontSize="17" fontWeight="900">hypotenuse = 1</text>
      <text x={origin.x + 70} y={origin.y - 18} fill="#fbbf24" fontSize="18" fontWeight="900">theta = {Math.round(rightTriangleDegrees)} deg</text>
    </svg>
  );
}

function formatDisplayValue(label: string, value: number | null, format: ValueFormat, degrees: number) {
  if (value === null) return "undefined";
  if (format === "decimal") return formatTrigNumber(value);
  const rounded = Math.round(degrees);
  const exactValues: Record<string, Record<number, string>> = {
    sin: { 0: "0", 30: "1/2", 45: "sqrt(2)/2", 60: "sqrt(3)/2", 90: "1", 180: "0", 270: "-1", 360: "0" },
    cos: { 0: "1", 30: "sqrt(3)/2", 45: "sqrt(2)/2", 60: "1/2", 90: "0", 180: "-1", 270: "0", 360: "1" },
    tan: { 0: "0", 30: "1/sqrt(3)", 45: "1", 60: "sqrt(3)", 90: "undefined", 180: "0", 270: "undefined", 360: "0" },
    sec: { 0: "1", 30: "2/sqrt(3)", 45: "sqrt(2)", 60: "2", 90: "undefined", 180: "-1", 270: "undefined", 360: "1" },
    cosec: { 0: "undefined", 30: "2", 45: "sqrt(2)", 60: "2/sqrt(3)", 90: "1", 180: "undefined", 270: "-1", 360: "undefined" },
    cot: { 0: "undefined", 30: "sqrt(3)", 45: "1", 60: "1/sqrt(3)", 90: "0", 180: "undefined", 270: "0", 360: "undefined" },
  };
  const exact = exactValues[label]?.[rounded];
  return exact ?? formatTrigNumber(value);
}

import { LocateFixed, Move3D, Rotate3D, RotateCcw, Target, ZoomIn, ZoomOut } from "lucide-react";
import { PointerEvent, ReactNode, WheelEvent, useMemo, useRef, useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { DiagramSummary, InvalidMathStateMessage, StudentTaskCard, TeacherNotes } from "../../components/ui/LearningScaffolds";
import { roundTo } from "../../utils/math";

type Vec3 = [number, number, number];
type DragTarget = "a-tail" | "a-head" | "b-tail" | "b-head";
type DragPlane = "xy" | "xz" | "yz";
type ViewPreset = "front" | "isometric" | "top";
type ViewState = { yaw: number; pitch: number; zoom: number };
type ControlTab = "a" | "b" | "results" | "xy" | "explain";
type SceneOptionKey = "xAxis" | "yAxis" | "zAxis" | "grid" | "units" | "labels" | "resultant" | "projection" | "cross";
type SceneOptions = Record<SceneOptionKey, boolean>;
type VectorPreset = "right" | "up" | "diagonal" | "zero" | "opposite";

const range = 10;
const planeCenter = 180;
const planeScale = 16;
const sceneCenter = { x: 360, y: 245 };
const sceneScale = 24;
const zeroTolerance = 1e-6;
const presetViews: Record<ViewPreset, ViewState> = {
  front: { yaw: 0, pitch: 0, zoom: 1 },
  isometric: { yaw: -Math.PI / 5, pitch: Math.PI / 5.2, zoom: 1 },
  top: { yaw: -Math.PI / 4, pitch: Math.PI / 2.9, zoom: 1 },
};

const defaultState = {
  aTail: [0, 0, 0] as Vec3,
  aHead: [5, 3, 2] as Vec3,
  bTail: [0, 0, 0] as Vec3,
  bHead: [-2, 4, -1.5] as Vec3,
};
const defaultSceneOptions: SceneOptions = {
  xAxis: true,
  yAxis: true,
  zAxis: true,
  grid: true,
  units: true,
  labels: true,
  resultant: true,
  projection: true,
  cross: true,
};
const beginnerPresets: Record<VectorPreset, { label: string; aHead: Vec3; bHead: Vec3 }> = {
  right: { label: "Right arrow", aHead: [5, 0, 0], bHead: [0, 0, 0] },
  up: { label: "Up arrow", aHead: [0, 5, 0], bHead: [0, 0, 0] },
  diagonal: { label: "Diagonal arrow", aHead: [4, 3, 0], bHead: [0, 0, 0] },
  zero: { label: "Zero vector", aHead: [0, 0, 0], bHead: [0, 0, 0] },
  opposite: { label: "Opposite pair", aHead: [4, 0, 0], bHead: [-4, 0, 0] },
};

export default function VectorVisualizer() {
  const initial = useMemo(readVectorParams, []);
  const [aTail, setATail] = useState<Vec3>(initial.aTail);
  const [aHead, setAHead] = useState<Vec3>(initial.aHead);
  const [bTail, setBTail] = useState<Vec3>(initial.bTail);
  const [bHead, setBHead] = useState<Vec3>(initial.bHead);
  const [showSecond, setShowSecond] = useState(true);
  const [dragPlane, setDragPlane] = useState<DragPlane>("xy");
  const [viewPreset, setViewPreset] = useState<ViewPreset>("isometric");
  const [viewState, setViewState] = useState<ViewState>(presetViews.isometric);
  const [showParallelogram, setShowParallelogram] = useState(true);
  const [activePanel, setActivePanel] = useState<ControlTab>("a");
  const [sceneOptions, setSceneOptions] = useState<SceneOptions>(defaultSceneOptions);

  const a = subtract(aHead, aTail);
  const b = subtract(bHead, bTail);
  const sum = add(a, b);
  const diff = subtract(a, b);
  const cross = crossProduct(a, b);
  const dot = dotProduct(a, b);
  const magA = magnitude(a);
  const magB = magnitude(b);
  const angle = magA * magB === 0 ? 0 : Math.acos(clamp(dot / (magA * magB), -1, 1)) * 180 / Math.PI;
  const projectionScale = magB === 0 ? 0 : dot / (magB * magB);
  const projection = scaleVec(b, projectionScale);
  const area = magnitude(cross);
  const zeroVectorWarning = magA <= zeroTolerance || (showSecond && magB <= zeroTolerance);

  const movePoint = (target: DragTarget, delta: Vec3) => {
    const setter = target === "a-tail" ? setATail : target === "a-head" ? setAHead : target === "b-tail" ? setBTail : setBHead;
    setter((point) => clampVec(add(point, delta)));
  };

  const reset = () => {
    setATail(defaultState.aTail);
    setAHead(defaultState.aHead);
    setBTail(defaultState.bTail);
    setBHead(defaultState.bHead);
    setViewPreset("isometric");
    setViewState(presetViews.isometric);
  };

  const setPreset = (preset: ViewPreset) => {
    setViewPreset(preset);
    setViewState(presetViews[preset]);
  };

  const zoomView = (delta: number) => {
    setViewPreset("isometric");
    setViewState((view) => ({ ...view, zoom: clamp(view.zoom + delta, 0.55, 1.85) }));
  };
  const applyBeginnerPreset = (preset: VectorPreset) => {
    const next = beginnerPresets[preset];
    setATail([0, 0, 0]);
    setBTail([0, 0, 0]);
    setAHead(next.aHead);
    setBHead(next.bHead);
    setShowSecond(preset === "opposite");
    setDragPlane("xy");
    setViewPreset("front");
    setViewState(presetViews.front);
  };

  return (
    <SectionCard
      title="Vector Visualizer"
      description="Explore 3D vectors, projections, dot product, cross product, angle, and resultant."
      compact
      allowFullscreen
      className="linear-vector-workbench"
    >
      <div className="grid min-h-0 gap-3 xl:grid-cols-[minmax(0,1fr)_390px]">
        <div className="min-w-0 space-y-3">
          <StudentTaskCard
            tryFirst="Choose Right arrow, then Up arrow. Watch how x-change and y-change describe the arrow."
            predict="Which preset has both x-change and y-change?"
            observe="The arrow length changes when either x or y changes."
            explain="A vector is an arrow with direction and length. Its x, y, and z changes tell where the arrow points."
            commonMistake="A zero vector has length 0, so its direction is undefined."
          />
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white/80 p-2.5 dark:border-white/10 dark:bg-slate-950/50">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-sm font-black text-slate-950 dark:text-white">
                <Move3D className="h-4 w-4 text-cyan-500" />
                3D vector pane
              </div>
              <VectorBadge value={a} color="text-cyan-500" />
              {showSecond && <VectorBadge value={b} color="text-violet-400" />}
            </div>
            <div className="mobile-safe-scroll thin-scrollbar max-w-full">
              <div className="flex w-max gap-1.5">
                {(["xy", "xz", "yz"] as DragPlane[]).map((plane) => (
                  <button key={plane} type="button" onClick={() => setDragPlane(plane)} className={toolClass(dragPlane === plane)}>
                    Drag {plane.toUpperCase()}
                  </button>
                ))}
                {(["front", "isometric", "top"] as ViewPreset[]).map((preset) => (
                  <button key={preset} type="button" onClick={() => setPreset(preset)} className={toolClass(viewPreset === preset)}>
                    {preset}
                  </button>
                ))}
                <button type="button" onClick={() => zoomView(0.15)} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-black dark:border-white/10">
                  <ZoomIn className="h-3.5 w-3.5" />
                  Zoom
                </button>
                <button type="button" onClick={() => zoomView(-0.15)} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-black dark:border-white/10">
                  <ZoomOut className="h-3.5 w-3.5" />
                  Out
                </button>
                <button type="button" onClick={() => setShowParallelogram((value) => !value)} className={toolClass(showParallelogram)}>
                  Parallelogram
                </button>
                <button type="button" onClick={reset} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-black dark:border-white/10">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </button>
              </div>
            </div>
          </div>
          <div className="mobile-safe-scroll thin-scrollbar rounded-xl border border-slate-200 bg-white/82 p-2.5 shadow-sm dark:border-white/10 dark:bg-slate-950/55">
            <div className="flex w-max gap-1.5">
              {(Object.keys(beginnerPresets) as VectorPreset[]).map((preset) => (
                <button key={preset} type="button" onClick={() => applyBeginnerPreset(preset)} className="inline-flex min-h-9 items-center rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-black text-slate-700 hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:text-slate-200 dark:hover:border-cyan-300/50">
                  {beginnerPresets[preset].label}
                </button>
              ))}
            </div>
          </div>
          <SceneControlDock
            options={sceneOptions}
            showSecond={showSecond}
            showParallelogram={showParallelogram}
            dragPlane={dragPlane}
            viewPreset={viewPreset}
            viewState={viewState}
            onOptionsChange={setSceneOptions}
            onShowSecond={setShowSecond}
            onShowParallelogram={setShowParallelogram}
            onDragPlane={setDragPlane}
            onViewPreset={setPreset}
            onViewStateChange={setViewState}
            onReset={reset}
          />

          <VectorScene3D
            aTail={aTail}
            aHead={aHead}
            bTail={bTail}
            bHead={bHead}
            showSecond={showSecond}
            showParallelogram={showParallelogram}
            projection={projection}
            sum={sum}
            cross={cross}
            dragPlane={dragPlane}
            viewPreset={viewPreset}
            viewState={viewState}
            onViewStateChange={setViewState}
            onViewPresetChange={setViewPreset}
            onMovePoint={movePoint}
            options={sceneOptions}
          />
        </div>

        <aside className="min-w-0 rounded-xl border border-slate-200 bg-white/82 p-2.5 shadow-sm dark:border-white/10 dark:bg-slate-950/55">
          <div className="mobile-safe-scroll thin-scrollbar">
            <div className="inline-flex min-w-full gap-1 rounded-xl bg-slate-100 p-1 dark:bg-white/10">
              <PanelTab active={activePanel === "a"} onClick={() => setActivePanel("a")}>A</PanelTab>
              <PanelTab active={activePanel === "b"} onClick={() => setActivePanel("b")}>B</PanelTab>
              <PanelTab active={activePanel === "results"} onClick={() => setActivePanel("results")}>Results</PanelTab>
              <PanelTab active={activePanel === "xy"} onClick={() => setActivePanel("xy")}>XY</PanelTab>
              <PanelTab active={activePanel === "explain"} onClick={() => setActivePanel("explain")}>Explain</PanelTab>
            </div>
          </div>

          <div className="mt-3 min-h-[360px] xl:min-h-[420px]">
            {activePanel === "a" && (
              <VectorControlPanel
                title="Vector A"
                badge={<VectorBadge value={a} color="text-cyan-500" />}
                head={aHead}
                tail={aTail}
                onHeadChange={setAHead}
                onTailChange={setATail}
                sliderPrefix="A"
              />
            )}

            {activePanel === "b" && (
              <div className="space-y-3">
                <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold dark:border-white/10 dark:bg-white/5">
                  <span>Enable second vector and operations</span>
                  <input type="checkbox" checked={showSecond} onChange={(event) => setShowSecond(event.target.checked)} />
                </label>
                {showSecond ? (
                  <VectorControlPanel
                    title="Vector B"
                    badge={<VectorBadge value={b} color="text-violet-400" />}
                    head={bHead}
                    tail={bTail}
                    onHeadChange={setBHead}
                    onTailChange={setBTail}
                    sliderPrefix="B"
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 p-4 text-sm font-semibold text-slate-500 dark:border-white/15 dark:text-slate-300">
                    Turn on Vector B to unlock dot product, cross product, projection, resultant, and angle.
                  </div>
                )}
              </div>
            )}

            {activePanel === "results" && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Metric label="|A|" value={magA} />
                  <Metric label="A x-change" value={a[0]} />
                  <Metric label="A y-change" value={a[1]} />
                  {showSecond && <Metric label="|B|" value={magB} />}
                  {showSecond && <Metric label="A dot B" value={dot} />}
                  {showSecond && <Metric label="angle" value={`${roundTo(angle, 2)} deg`} />}
                  {showSecond && <Metric label="A cross B" value={`<${cross.map((item) => roundTo(item, 2)).join(", ")}>`} />}
                  {showSecond && <Metric label="area" value={area} />}
                  {showSecond && <Metric label="A + B" value={`<${sum.map((item) => roundTo(item, 2)).join(", ")}>`} />}
                  {showSecond && <Metric label="A - B" value={`<${diff.map((item) => roundTo(item, 2)).join(", ")}>`} />}
                </div>
                {zeroVectorWarning && <InvalidMathStateMessage>Zero vector direction is undefined. Length is 0, so there is no single direction to point toward.</InvalidMathStateMessage>}
                <LiveInterpretation a={a} b={b} showSecond={showSecond} />
              </div>
            )}

            {activePanel === "xy" && <VectorPlane2D a={a} b={b} showSecond={showSecond} projection={projection} sum={sum} />}

            {activePanel === "explain" && (
              <div className="space-y-3">
                <VisualLearningPanel
                  concept="A vector is an arrow with direction and length. A 3D vector stores x, y, and z changes, so it can point anywhere in space."
                  formula="A dot B = |A||B|cos(theta), A cross B is perpendicular to A and B"
                  changes="Dragging endpoints or changing sliders updates magnitude, direction, projection, dot product, cross product, resultant, and parallelogram area."
                  realWorldUse="3D graphics, robotics, forces, velocity, game physics, CAD, computer vision, and machine learning embeddings."
                  steps={[
                    `Vector A length is ${roundTo(magA, 3)}.`,
                    showSecond ? `Vector B length is ${roundTo(magB, 3)}.` : "Enable vector B to compare two directions.",
                    showSecond ? `Angle between A and B is ${roundTo(angle, 2)} degrees.` : "The 3D pane still supports dragging vector A.",
                    showSecond ? `Cross product length, the parallelogram area, is ${roundTo(area, 3)}.` : "Use the z slider or endpoint editor to move out of the flat plane.",
                  ]}
                  tasks={["Drag the empty pane to rotate the camera.", "Drag A head into the z direction.", "Make A and B perpendicular.", "Use XZ drag mode to move depth directly."]}
                />
                <TeacherNotes
                  objective="Students describe a vector as an arrow with length and direction before using dot or cross products."
                  prerequisite="Coordinate plane movement: right/left as x-change and up/down as y-change."
                  prompt="Start with the right, up, and diagonal presets before introducing 3D z-change."
                  misconception="Students may think a vector is only its endpoint; emphasize tail-to-head change."
                  extension="Ask students to create two opposite vectors and predict their dot product sign."
                />
              </div>
            )}
          </div>
        </aside>
      </div>
    </SectionCard>
  );
}

function SceneControlDock({
  options,
  showSecond,
  showParallelogram,
  dragPlane,
  viewPreset,
  viewState,
  onOptionsChange,
  onShowSecond,
  onShowParallelogram,
  onDragPlane,
  onViewPreset,
  onViewStateChange,
  onReset,
}: {
  options: SceneOptions;
  showSecond: boolean;
  showParallelogram: boolean;
  dragPlane: DragPlane;
  viewPreset: ViewPreset;
  viewState: ViewState;
  onOptionsChange: (options: SceneOptions) => void;
  onShowSecond: (value: boolean) => void;
  onShowParallelogram: (value: boolean) => void;
  onDragPlane: (value: DragPlane) => void;
  onViewPreset: (value: ViewPreset) => void;
  onViewStateChange: (value: ViewState | ((value: ViewState) => ViewState)) => void;
  onReset: () => void;
}) {
  const setZoom = (zoom: number) => {
    onViewPreset("isometric");
    onViewStateChange((view) => ({ ...view, zoom: clamp(zoom, 0.55, 1.85) }));
  };
  const setYaw = (yaw: number) => {
    onViewPreset("isometric");
    onViewStateChange((view) => ({ ...view, yaw }));
  };
  const setPitch = (pitch: number) => {
    onViewPreset("isometric");
    onViewStateChange((view) => ({ ...view, pitch }));
  };

  return (
    <div className="rounded-xl border border-cyan-200 bg-white/90 p-3 shadow-sm shadow-cyan-100/50 dark:border-cyan-300/20 dark:bg-slate-950/70 dark:shadow-black/20">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-wide text-cyan-700 dark:text-cyan-200">3D pane controls</div>
          <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">Choose axes, labels, overlays, camera angle, zoom, and drag plane before using the pane.</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(["front", "isometric", "top"] as ViewPreset[]).map((preset) => (
            <button key={preset} type="button" onClick={() => onViewPreset(preset)} className={toolClass(viewPreset === preset)}>
              {preset}
            </button>
          ))}
          <button type="button" onClick={onReset} className="inline-flex min-h-9 items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-black dark:border-white/10">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.1fr)_minmax(260px,.9fr)]">
        <SceneOptionsPanel options={options} onChange={onOptionsChange} />
        <div className="grid gap-2 sm:grid-cols-2">
          <CompactRange label="Zoom" value={viewState.zoom} min={0.55} max={1.85} step={0.05} valueLabel={`${roundTo(viewState.zoom, 2)}x`} onChange={setZoom} />
          <CompactRange label="Yaw" value={viewState.yaw} min={-Math.PI} max={Math.PI} step={0.05} valueLabel={`${roundTo(viewState.yaw, 2)} rad`} onChange={setYaw} />
          <CompactRange label="Pitch" value={viewState.pitch} min={-1.25} max={1.35} step={0.05} valueLabel={`${roundTo(viewState.pitch, 2)} rad`} onChange={setPitch} />
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
            <p className="text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Drag plane</p>
            <div className="mt-2 grid grid-cols-3 gap-1">
              {(["xy", "xz", "yz"] as DragPlane[]).map((plane) => (
                <button key={plane} type="button" onClick={() => onDragPlane(plane)} className={toolClass(dragPlane === plane)}>
                  {plane.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <label className="flex min-h-10 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            Vector B
            <input type="checkbox" checked={showSecond} onChange={(event) => onShowSecond(event.target.checked)} className="h-4 w-4 accent-cyan-500" />
          </label>
          <label className="flex min-h-10 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            Parallelogram
            <input type="checkbox" checked={showParallelogram} onChange={(event) => onShowParallelogram(event.target.checked)} className="h-4 w-4 accent-cyan-500" />
          </label>
        </div>
      </div>
    </div>
  );
}

function SceneOptionsPanel({ options, onChange }: { options: SceneOptions; onChange: (options: SceneOptions) => void }) {
  const toggle = (key: SceneOptionKey) => onChange({ ...options, [key]: !options[key] });
  const items: Array<{ key: SceneOptionKey; label: string }> = [
    { key: "xAxis", label: "X axis" },
    { key: "yAxis", label: "Y axis" },
    { key: "zAxis", label: "Z axis" },
    { key: "grid", label: "Grid" },
    { key: "units", label: "Units" },
    { key: "labels", label: "Labels" },
    { key: "resultant", label: "A+B" },
    { key: "projection", label: "Projection" },
    { key: "cross", label: "Cross" },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">3D pane options</div>
        <button type="button" onClick={() => onChange(defaultSceneOptions)} className="rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-black text-slate-600 dark:border-white/10 dark:text-slate-300">
          Show all
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item) => (
          <label key={item.key} className="flex min-h-9 items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-black text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            <input type="checkbox" checked={options[item.key]} onChange={() => toggle(item.key)} className="h-4 w-4 accent-cyan-500" />
            {item.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function CompactRange({ label, value, min, max, step, valueLabel, onChange }: { label: string; value: number; min: number; max: number; step: number; valueLabel: string; onChange: (value: number) => void }) {
  return (
    <label className="rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-white/10 dark:bg-white/5">
      <span className="flex items-center justify-between gap-2 text-[11px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
        <span className="text-cyan-700 dark:text-cyan-200">{valueLabel}</span>
      </span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
    </label>
  );
}

function VectorControlPanel({
  title,
  badge,
  head,
  tail,
  onHeadChange,
  onTailChange,
  sliderPrefix,
}: {
  title: string;
  badge: ReactNode;
  head: Vec3;
  tail: Vec3;
  onHeadChange: (value: Vec3) => void;
  onTailChange: (value: Vec3) => void;
  sliderPrefix: "A" | "B";
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-black text-slate-950 dark:text-white">{title}</p>
        {badge}
      </div>
      <SliderGroup title="Head components" className="p-2.5">
        <SliderControl density="compact" label={`${sliderPrefix} x`} value={head[0]} min={-10} max={10} step={0.25} onChange={(value) => onHeadChange([value, head[1], head[2]])} />
        <SliderControl density="compact" label={`${sliderPrefix} y`} value={head[1]} min={-10} max={10} step={0.25} onChange={(value) => onHeadChange([head[0], value, head[2]])} />
        <SliderControl density="compact" label={`${sliderPrefix} z`} value={head[2]} min={-10} max={10} step={0.25} onChange={(value) => onHeadChange([head[0], head[1], value])} />
      </SliderGroup>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <EndpointEditor label={`${sliderPrefix} tail`} value={tail} onChange={onTailChange} />
        <EndpointEditor label={`${sliderPrefix} head`} value={head} onChange={onHeadChange} />
      </div>
    </div>
  );
}

function PanelTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-9 flex-1 rounded-lg px-2.5 py-1.5 text-xs font-black transition ${active ? "bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-400/20" : "text-slate-600 hover:bg-white/70 hover:text-cyan-800 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-cyan-100"}`}
    >
      {children}
    </button>
  );
}

function LiveInterpretation({ a, b, showSecond }: { a: Vec3; b: Vec3; showSecond: boolean }) {
  return (
    <div className="rounded-xl border border-cyan-200 bg-cyan-50 p-3 dark:border-cyan-400/20 dark:bg-cyan-400/10">
      <div className="flex items-center gap-2 text-sm font-black text-cyan-950 dark:text-cyan-50">
        <Target className="h-4 w-4" />
        Live interpretation
      </div>
      <div className="mt-2 space-y-1.5 text-sm leading-5 text-slate-700 dark:text-slate-200">
        <p>A = &lt;{a.map((item) => roundTo(item, 2)).join(", ")}&gt;</p>
        {showSecond && <p>B = &lt;{b.map((item) => roundTo(item, 2)).join(", ")}&gt;</p>}
        {showSecond && <p>Dot product: positive same direction, zero perpendicular, negative opposite.</p>}
        {showSecond && <p>Cross product is perpendicular; its length is parallelogram area.</p>}
        <p>Drag empty space to rotate. Drag colored handles to move tails or heads.</p>
      </div>
    </div>
  );
}

function VectorScene3D({
  aTail,
  aHead,
  bTail,
  bHead,
  showSecond,
  showParallelogram,
  projection,
  sum,
  cross,
  dragPlane,
  viewPreset,
  viewState,
  onViewStateChange,
  onViewPresetChange,
  onMovePoint,
  options,
}: {
  aTail: Vec3;
  aHead: Vec3;
  bTail: Vec3;
  bHead: Vec3;
  showSecond: boolean;
  showParallelogram: boolean;
  projection: Vec3;
  sum: Vec3;
  cross: Vec3;
  dragPlane: DragPlane;
  viewPreset: ViewPreset;
  viewState: ViewState;
  onViewStateChange: (value: ViewState | ((value: ViewState) => ViewState)) => void;
  onViewPresetChange: (value: ViewPreset) => void;
  onMovePoint: (target: DragTarget, delta: Vec3) => void;
  options: SceneOptions;
}) {
  const dragRef = useRef<{ mode: "point"; target: DragTarget; x: number; y: number } | { mode: "view"; x: number; y: number } | null>(null);
  const project = (point: Vec3) => project3d(point, viewState);
  const o = project([0, 0, 0]);
  const ax = project([range, 0, 0]);
  const ay = project([0, range, 0]);
  const az = project([0, 0, range]);
  const aTailPoint = project(aTail);
  const aHeadPoint = project(aHead);
  const bTailPoint = project(bTail);
  const bHeadPoint = project(bHead);
  const sumPoint = project(add(aTail, sum));
  const projectionPoint = project(add(aTail, projection));
  const crossPoint = project(scaleToFit(cross, 4));
  const aVector = subtract(aHead, aTail);
  const bVector = subtract(bHead, bTail);
  const hasA = isNonZeroVector(aVector);
  const hasB = isNonZeroVector(bVector);
  const hasSum = isNonZeroVector(sum);
  const hasProjection = hasB && isNonZeroVector(projection);

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    if (dragRef.current.mode === "point") {
      dragRef.current = { ...dragRef.current, x: event.clientX, y: event.clientY };
      onMovePoint(dragRef.current.target, screenDeltaToVector(dx, dy, dragPlane, viewState.zoom));
      return;
    }
    dragRef.current = { ...dragRef.current, x: event.clientX, y: event.clientY };
    onViewPresetChange("isometric");
    onViewStateChange((view) => ({
      yaw: view.yaw + dx * 0.01,
      pitch: clamp(view.pitch + dy * 0.008, -1.25, 1.35),
      zoom: view.zoom,
    }));
  };

  const startViewDrag = (event: PointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { mode: "view", x: event.clientX, y: event.clientY };
  };

  const startDrag = (target: DragTarget) => (event: PointerEvent<SVGCircleElement>) => {
    event.stopPropagation();
    event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId);
    dragRef.current = { mode: "point", target, x: event.clientX, y: event.clientY };
  };

  const zoomWithWheel = (event: WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    onViewPresetChange("isometric");
    onViewStateChange((view) => ({ ...view, zoom: clamp(view.zoom + (event.deltaY < 0 ? 0.08 : -0.08), 0.55, 1.85) }));
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-950 p-2 shadow-inner dark:border-white/10">
      <DiagramSummary>
        3D vector diagram showing vector A from tail to head{showSecond ? ", vector B, and selected operation overlays" : ""}.
      </DiagramSummary>
      <svg
        viewBox="0 0 720 490"
        className="h-[min(56vh,500px)] min-h-[380px] w-full touch-none select-none rounded-lg bg-[radial-gradient(circle_at_50%_35%,rgba(14,165,233,.18),rgba(2,6,23,.98)_58%)]"
        onPointerMove={onPointerMove}
        onPointerDown={startViewDrag}
        onPointerUp={() => { dragRef.current = null; }}
        onPointerLeave={() => { dragRef.current = null; }}
        onWheel={zoomWithWheel}
      >
        <defs>
          <marker id="arrow-cyan" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" /></marker>
          <marker id="arrow-violet" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#a78bfa" /></marker>
          <marker id="arrow-amber" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" /></marker>
          <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#34d399" /></marker>
          <marker id="axis-red" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#ef4444" /></marker>
          <marker id="axis-blue" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#38bdf8" /></marker>
          <marker id="axis-lime" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#84cc16" /></marker>
        </defs>

        <rect x="0" y="0" width="720" height="490" fill="transparent" className="cursor-grab active:cursor-grabbing" />
        {options.grid && <Grid3D project={project} showUnits={options.units} />}
        {options.xAxis && <Axis from={o} to={ax} color="#ef4444" marker="axis-red" label="x" showLabel={options.labels} />}
        {options.yAxis && <Axis from={o} to={ay} color="#84cc16" marker="axis-lime" label="y" showLabel={options.labels} />}
        {options.zAxis && <Axis from={o} to={az} color="#38bdf8" marker="axis-blue" label="z" showLabel={options.labels} />}

        {showSecond && showParallelogram && hasA && hasB && (
          <polygon
            points={`${aTailPoint.x},${aTailPoint.y} ${aHeadPoint.x},${aHeadPoint.y} ${sumPoint.x},${sumPoint.y} ${bHeadPoint.x},${bHeadPoint.y}`}
            fill="rgba(245,158,11,.16)"
            stroke="rgba(245,158,11,.55)"
            strokeWidth="2"
            strokeDasharray="7 5"
          />
        )}

        {hasA ? <Arrow3D from={aTailPoint} to={aHeadPoint} color="#22d3ee" marker="arrow-cyan" label="A" showLabel={options.labels} /> : <ZeroVectorMarker point={aHeadPoint} color="#22d3ee" label="A = 0" dy={-36} showLabel={options.labels} />}
        <Handle point={aTailPoint} color="#0891b2" label="A tail" onPointerDown={startDrag("a-tail")} labelDx={12} labelDy={28} showLabel={options.labels} />
        <Handle point={aHeadPoint} color="#22d3ee" label="A head" onPointerDown={startDrag("a-head")} labelDx={12} labelDy={hasA ? 21 : -16} showLabel={options.labels} />

        {showSecond && (
          <>
            {hasB ? <Arrow3D from={bTailPoint} to={bHeadPoint} color="#a78bfa" marker="arrow-violet" label="B" showLabel={options.labels} /> : <ZeroVectorMarker point={bHeadPoint} color="#a78bfa" label="B = 0" dx={78} dy={-18} showLabel={options.labels} />}
            <Handle point={bTailPoint} color="#7c3aed" label="B tail" onPointerDown={startDrag("b-tail")} labelDx={-58} labelDy={28} showLabel={options.labels} />
            <Handle point={bHeadPoint} color="#a78bfa" label="B head" onPointerDown={startDrag("b-head")} labelDx={-58} labelDy={hasB ? 21 : -16} showLabel={options.labels} />
            {options.resultant && hasSum && <Arrow3D from={aTailPoint} to={sumPoint} color="#f59e0b" marker="arrow-amber" label="A+B" dashed showLabel={options.labels} />}
            {options.projection && hasProjection && <Arrow3D from={aTailPoint} to={projectionPoint} color="#fb7185" marker="arrow-amber" label="proj A on B" dashed showLabel={options.labels} />}
            {options.cross && magnitude(cross) > 0.01 && <Arrow3D from={o} to={crossPoint} color="#34d399" marker="arrow-green" label="A x B" showLabel={options.labels} />}
            {!hasA && !hasB && (
              <text x={o.x - 86} y={o.y + 58} fill="#cbd5e1" fontSize="13" fontWeight="800">
                Operations are zero/undefined until a vector has length.
              </text>
            )}
          </>
        )}

        <foreignObject x="18" y="18" width="238" height="66">
          <div className="rounded-xl border border-cyan-400/30 bg-slate-950/80 p-2.5 text-xs font-bold text-cyan-50">
            <p className="flex items-center gap-2"><Rotate3D className="h-3.5 w-3.5" /> 3D interactive vector lab</p>
            <p className="mt-1 text-cyan-200">Rotate, zoom, then drag handles on {dragPlane.toUpperCase()}.</p>
          </div>
        </foreignObject>
        <foreignObject x="536" y="18" width="162" height="62">
          <div className="rounded-xl border border-white/10 bg-slate-950/75 p-2.5 text-xs font-bold text-slate-100">
            <p>View: {viewPreset}</p>
            <p className="mt-1 text-slate-300">Zoom {roundTo(viewState.zoom, 2)}x</p>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

function EndpointEditor({ label, value, onChange }: { label: string; value: Vec3; onChange: (value: Vec3) => void }) {
  const update = (index: number, nextValue: number) => {
    const next = [...value] as Vec3;
    next[index] = clamp(nextValue, -range, range);
    onChange(next);
  };

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <LocateFixed className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(["x", "y", "z"] as const).map((axis, index) => (
          <label key={axis} className="space-y-1 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">
            {axis}
            <input
              type="number"
              value={roundTo(value[index], 2)}
              min={-range}
              max={range}
              step={0.25}
              onChange={(event) => update(index, Number(event.target.value))}
              className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-black text-slate-950 dark:border-white/10 dark:bg-slate-950 dark:text-white"
            />
          </label>
        ))}
      </div>
    </div>
  );
}

function Grid3D({ project, showUnits }: { project: (point: Vec3) => { x: number; y: number }; showUnits: boolean }) {
  const lines: ReactNode[] = [];
  for (let i = -range; i <= range; i += 2) {
    const x1 = project([-range, 0, i]);
    const x2 = project([range, 0, i]);
    const z1 = project([i, 0, -range]);
    const z2 = project([i, 0, range]);
    lines.push(<line key={`x-${i}`} x1={x1.x} y1={x1.y} x2={x2.x} y2={x2.y} stroke="rgba(148,163,184,.18)" />);
    lines.push(<line key={`z-${i}`} x1={z1.x} y1={z1.y} x2={z2.x} y2={z2.y} stroke="rgba(148,163,184,.18)" />);
    if (showUnits && i !== 0) {
      const xTick = project([i, 0, 0]);
      const zTick = project([0, 0, i]);
      lines.push(<circle key={`x-dot-${i}`} cx={xTick.x} cy={xTick.y} r="2.5" fill="rgba(239,68,68,.75)" />);
      lines.push(<text key={`x-label-${i}`} x={xTick.x + 5} y={xTick.y + 13} fill="rgba(254,202,202,.9)" fontSize="10" fontWeight="800">{i}</text>);
      lines.push(<circle key={`z-dot-${i}`} cx={zTick.x} cy={zTick.y} r="2.5" fill="rgba(56,189,248,.75)" />);
      lines.push(<text key={`z-label-${i}`} x={zTick.x + 5} y={zTick.y - 6} fill="rgba(186,230,253,.9)" fontSize="10" fontWeight="800">{i}</text>);
    }
  }
  return <g>{lines}</g>;
}

function VectorPlane2D({ a, b, showSecond, projection, sum }: { a: Vec3; b: Vec3; showSecond: boolean; projection: Vec3; sum: Vec3 }) {
  const pa = toPlane(a[0], a[1]);
  const pb = toPlane(b[0], b[1]);
  const ps = toPlane(sum[0], sum[1]);
  const pp = toPlane(projection[0], projection[1]);
  const hasA = isNonZeroVector(a);
  const hasB = isNonZeroVector(b);
  const hasSum = isNonZeroVector(sum);
  const hasProjection = hasB && isNonZeroVector(projection);
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60">
      <div className="mb-2 text-sm font-black text-slate-950 dark:text-white">2D XY projection</div>
      <svg viewBox="0 0 360 260" className="h-[280px] w-full rounded-lg bg-slate-950">
        <defs>
          <marker id="plane-cyan" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#22d3ee" /></marker>
          <marker id="plane-violet" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#a78bfa" /></marker>
          <marker id="plane-amber" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#f59e0b" /></marker>
        </defs>
        {Array.from({ length: 21 }, (_, i) => {
          const pos = i * 18;
          return <g key={i}><line x1={pos} x2={pos} y1="0" y2="260" stroke="rgba(148,163,184,.16)" /><line x1="0" x2="360" y1={pos} y2={pos} stroke="rgba(148,163,184,.16)" /></g>;
        })}
        <line x1="0" x2="360" y1={planeCenter} y2={planeCenter} stroke="#64748b" />
        <line x1={planeCenter} x2={planeCenter} y1="0" y2="260" stroke="#64748b" />
        {hasA ? <VectorLine2D p={pa} color="#22d3ee" marker="plane-cyan" label="A xy" /> : <ZeroPoint2D label="A=0" color="#22d3ee" dx={12} dy={-18} />}
        {showSecond && (hasB ? <VectorLine2D p={pb} color="#a78bfa" marker="plane-violet" label="B xy" /> : <ZeroPoint2D label="B=0" color="#a78bfa" dx={12} dy={22} />)}
        {showSecond && hasSum && <VectorLine2D p={ps} color="#f59e0b" marker="plane-amber" label="A+B" />}
        {showSecond && hasProjection && <line x1={planeCenter} y1={planeCenter} x2={pp.x} y2={pp.y} stroke="#fb7185" strokeWidth="4" strokeDasharray="6 4" />}
      </svg>
    </div>
  );
}

function Arrow3D({ from, to, color, marker, label, dashed = false, showLabel = true }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string; marker: string; label: string; dashed?: boolean; showLabel?: boolean }) {
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth="5" strokeLinecap="round" strokeDasharray={dashed ? "8 6" : undefined} markerEnd={`url(#${marker})`} />
      {showLabel && <text x={to.x + 10} y={to.y - 10} fill={color} fontWeight="900" fontSize="15">{label}</text>}
    </g>
  );
}

function Axis({ from, to, color, marker, label, showLabel = true }: { from: { x: number; y: number }; to: { x: number; y: number }; color: string; marker: string; label: string; showLabel?: boolean }) {
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth="3" markerEnd={`url(#${marker})`} />
      {showLabel && <text x={to.x + 8} y={to.y + 4} fill={color} fontWeight="900">{label}</text>}
    </g>
  );
}

function Handle({ point, color, label, onPointerDown, labelDx = 12, labelDy = 21, showLabel = true }: { point: { x: number; y: number }; color: string; label: string; onPointerDown: (event: PointerEvent<SVGCircleElement>) => void; labelDx?: number; labelDy?: number; showLabel?: boolean }) {
  return (
    <g>
      <circle cx={point.x} cy={point.y} r="11" fill={color} stroke="#e0f2fe" strokeWidth="3" className="cursor-grab active:cursor-grabbing" onPointerDown={onPointerDown} />
      {showLabel && <text x={point.x + labelDx} y={point.y + labelDy} fill="#e0f2fe" fontSize="11" fontWeight="800">{label}</text>}
    </g>
  );
}

function ZeroVectorMarker({ point, color, label, dx = 10, dy = -24, showLabel = true }: { point: { x: number; y: number }; color: string; label: string; dx?: number; dy?: number; showLabel?: boolean }) {
  return (
    <g>
      <circle cx={point.x} cy={point.y} r="18" fill="none" stroke={color} strokeWidth="2.5" strokeDasharray="4 4" opacity="0.85" />
      {showLabel && <text x={point.x + dx} y={point.y + dy} fill={color} fontSize="14" fontWeight="900">{label}</text>}
    </g>
  );
}

function ZeroPoint2D({ label, color, dx, dy }: { label: string; color: string; dx: number; dy: number }) {
  return (
    <g>
      <circle cx={planeCenter} cy={planeCenter} r="8" fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
      <text x={planeCenter + dx} y={planeCenter + dy} fill={color} fontWeight="800" fontSize="12">{label}</text>
    </g>
  );
}

function VectorLine2D({ p, color, marker, label }: { p: { x: number; y: number }; color: string; marker: string; label: string }) {
  return (
    <g>
      <line x1={planeCenter} y1={planeCenter} x2={p.x} y2={p.y} stroke={color} strokeWidth="4" markerEnd={`url(#${marker})`} />
      <circle cx={p.x} cy={p.y} r="5" fill={color} />
      <text x={p.x + 8} y={p.y - 8} fill={color} fontWeight="800" fontSize="13">{label}</text>
    </g>
  );
}

function VectorBadge({ value, color }: { value: Vec3; color: string }) {
  return <span className={`font-mono text-xs font-black ${color}`}>&lt;{value.map((item) => roundTo(item, 2)).join(", ")}&gt;</span>;
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-3 dark:bg-white/10">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 break-words font-mono text-sm font-black text-slate-950 dark:text-white">{typeof value === "number" ? roundTo(value, 3) : value}</p>
    </div>
  );
}

function toolClass(active: boolean) {
  return `rounded-lg px-3 py-2 text-xs font-black capitalize transition ${active ? "bg-cyan-400 text-slate-950" : "border border-slate-200 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"}`;
}

function readVectorParams() {
  const params = new URLSearchParams(window.location.search);
  const get = (names: string[], fallback: number) => {
    for (const name of names) {
      const value = Number(params.get(name));
      if (Number.isFinite(value)) return clamp(value, -10, 10);
    }
    return fallback;
  };
  return {
    aTail: [0, 0, 0] as Vec3,
    aHead: [get(["v_a_x", "v_x"], 5), get(["v_a_y", "v_y"], 3), get(["v_a_z", "v_z"], 2)] as Vec3,
    bTail: [0, 0, 0] as Vec3,
    bHead: [get(["v_b_x", "v_u"], -2), get(["v_b_y", "v_v"], 4), get(["v_b_z", "v_w"], -1.5)] as Vec3,
  };
}

function project3d(point: Vec3, view: ViewState) {
  const [x, y, z] = point;
  const { yaw, pitch, zoom } = view;
  const xr = x * Math.cos(yaw) + z * Math.sin(yaw);
  const zr = -x * Math.sin(yaw) + z * Math.cos(yaw);
  return {
    x: sceneCenter.x + xr * sceneScale * zoom,
    y: sceneCenter.y - y * sceneScale * zoom + zr * Math.sin(pitch) * sceneScale * zoom,
  };
}

function screenDeltaToVector(dx: number, dy: number, plane: DragPlane, zoom: number): Vec3 {
  const step = 1 / (sceneScale * zoom);
  if (plane === "xy") return [dx * step, -dy * step, 0];
  if (plane === "xz") return [dx * step, 0, dy * step];
  return [0, -dy * step, dx * step];
}

function toPlane(x: number, y: number) {
  return { x: planeCenter + x * planeScale, y: planeCenter - y * planeScale };
}

function add(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract(a: Vec3, b: Vec3): Vec3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function scaleVec(a: Vec3, scalar: number): Vec3 {
  return [a[0] * scalar, a[1] * scalar, a[2] * scalar];
}

function scaleToFit(a: Vec3, maxLength: number): Vec3 {
  const length = magnitude(a);
  if (length <= maxLength || length === 0) return a;
  return scaleVec(a, maxLength / length);
}

function magnitude(a: Vec3) {
  return Math.hypot(a[0], a[1], a[2]);
}

function isNonZeroVector(a: Vec3) {
  return magnitude(a) > zeroTolerance;
}

function dotProduct(a: Vec3, b: Vec3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function crossProduct(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function clampVec(point: Vec3): Vec3 {
  return [clamp(point[0], -range, range), clamp(point[1], -range, range), clamp(point[2], -range, range)];
}

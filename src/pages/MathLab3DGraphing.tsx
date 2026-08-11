import { Line, OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import { SurfaceSampleResult, generateSurfaceMeshData, sampleSurface } from "../utils/mathEngine/graph3dUtils";
import { deleteGraphWorkspace, readSavedGraphWorkspaces, saveGraphWorkspace, type SavedGraphWorkspace } from "../utils/graphWorkspaceStorage";
import { analyzeSurfaceDifferential, type SurfaceDifferential } from "../graph-studio/graphIntelligence";
import GraphStudio3DWorkspace, { type Studio3DTool } from "../graph-studio/GraphStudio3DWorkspace";
import { reconcileGraphVariables, substituteGraphVariables } from "../graph-studio/expressionEngine";
import { downloadGraphStudioFile, exportGraphStudioProject } from "../graph-studio/projectStorage";
import { useGraphStudioProject } from "../graph-studio/useGraphStudioProject";
import type { GraphStudioStylePreset, GraphStudioVariable } from "../graph-studio/types";
import { symbolicDerivative, trySymbolic } from "../utils/symbolic";

const examples = [
  "x^2 + y^2",
  "sin(x) * cos(y)",
  "sqrt(x^2 + y^2)",
  "x^2 - y^2",
  "sqrt(25 - x^2 - y^2)",
  "sqrt(9 - x^2)",
  "exp(-(x^2 + y^2))",
];

type SurfacePalette = "height" | "thermal" | "contour" | "mono";
type ObjectPosition = { x: number; y: number; z: number };
type ReferenceObjectKind = "none" | "helix" | "sphere" | "cone" | "cylinder";
type SliceAxis = "x" | "y" | "z";
type Graph3DWorkspaceState = {
  expression: string;
  secondaryExpression: string;
  secondaryVisible: boolean;
  xRange: number;
  yRange: number;
  resolution: number;
  opacity: number;
  palette: SurfacePalette;
  showGrid: boolean;
  showAxes: boolean;
  showWireframe: boolean;
  showPoints: boolean;
  sliceEnabled: boolean;
  sliceX: number;
  referenceObject: ReferenceObjectKind;
  variables?: GraphStudioVariable[];
};
type BeautifulSurfacePreset = {
  name: string;
  expression: string;
  xRange: number;
  yRange: number;
  resolution: number;
  palette: SurfacePalette;
};

const initialObjectPosition: ObjectPosition = { x: 0, y: 0, z: 0 };
const beautifulSurfacePresets = buildBeautifulSurfacePresets();
const GRAPH_3D_STORAGE_KEY = "math-universe-saved-3d-graphs";

export default function MathLab3DGraphing() {
  const [expression, setExpression] = useState("sin(x) * cos(y)");
  const [secondaryExpression, setSecondaryExpression] = useState("x^2 - y^2");
  const [secondaryVisible, setSecondaryVisible] = useState(false);
  const [xRange, setXRange] = useState(3);
  const [yRange, setYRange] = useState(3);
  const [resolution, setResolution] = useState(44);
  const [showGrid, setShowGrid] = useState(true);
  const [showBase, setShowBase] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [surfaceOpacity, setSurfaceOpacity] = useState(0.9);
  const [showLabels, setShowLabels] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [samplingAnimation, setSamplingAnimation] = useState(true);
  const [palette, setPalette] = useState<SurfacePalette>("height");
  const [objectPosition, setObjectPosition] = useState<ObjectPosition>(initialObjectPosition);
  const [cameraKey, setCameraKey] = useState(0);
  const [sliceEnabled, setSliceEnabled] = useState(false);
  const [sliceX, setSliceX] = useState(0);
  const [referenceObject, setReferenceObject] = useState<ReferenceObjectKind>("none");
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([4, 3.2, 6]);
  const [savedGraphs, setSavedGraphs] = useState<SavedGraphWorkspace<Graph3DWorkspaceState>[]>(() => readSavedGraphWorkspaces(GRAPH_3D_STORAGE_KEY));
  const [graphVariables, setGraphVariables] = useState<GraphStudioVariable[]>([]);
  const [sliceAxis, setSliceAxis] = useState<SliceAxis>("x");
  const [analysisPoint, setAnalysisPoint] = useState({ x: 0, y: 0 });
  const [selectedSurface, setSelectedSurface] = useState<"primary" | "secondary">("primary");
  const [exactPartial, setExactPartial] = useState<string | null>(null);
  const [studioTool, setStudioTool] = useState<Studio3DTool>("select");

  const graphStudioState = useMemo<Graph3DWorkspaceState>(() => ({ expression, secondaryExpression, secondaryVisible, xRange, yRange, resolution, opacity: surfaceOpacity, palette, showGrid, showAxes, showWireframe, showPoints, sliceEnabled, sliceX, referenceObject, variables: graphVariables }), [expression, graphVariables, palette, referenceObject, resolution, secondaryExpression, secondaryVisible, showAxes, showGrid, showPoints, showWireframe, sliceEnabled, sliceX, surfaceOpacity, xRange, yRange]);
  const graphStudio = useGraphStudioProject({
    dimension: "3d",
    initialName: "Graph Studio 3D",
    state: graphStudioState,
    applyState: (state, variables) => {
      setExpression(state.expression);
      setSecondaryExpression(state.secondaryExpression);
      setSecondaryVisible(state.secondaryVisible);
      setXRange(state.xRange);
      setYRange(state.yRange);
      setResolution(state.resolution);
      setSurfaceOpacity(state.opacity);
      setPalette(state.palette);
      setShowGrid(state.showGrid);
      setShowAxes(state.showAxes);
      setShowWireframe(state.showWireframe);
      setShowPoints(state.showPoints);
      setSliceEnabled(state.sliceEnabled);
      setSliceX(state.sliceX);
      setReferenceObject(state.referenceObject);
      setGraphVariables(state.variables ?? variables);
      setCameraKey((value) => value + 1);
    },
  });

  const resolvedExpression = substituteGraphVariables(expression, graphVariables);
  const resolvedSecondaryExpression = substituteGraphVariables(secondaryExpression, graphVariables);
  const surface = useMemo(() => sampleSurface(resolvedExpression, -xRange, xRange, -yRange, yRange, resolution), [resolvedExpression, xRange, yRange, resolution]);
  const secondarySurface = useMemo(() => secondaryVisible ? sampleSurface(resolvedSecondaryExpression, -xRange, xRange, -yRange, yRange, resolution) : null, [resolution, resolvedSecondaryExpression, secondaryVisible, xRange, yRange]);
  const surfaceDifferential = useMemo(() => analyzeSurfaceDifferential(resolvedExpression, analysisPoint.x, analysisPoint.y), [analysisPoint, resolvedExpression]);
  const sampleRows = useMemo(() => surface.grid.flatMap((row, rowIndex) => row.filter((_, colIndex) => rowIndex % Math.max(1, Math.floor(surface.grid.length / 4)) === 0 && colIndex % Math.max(1, Math.floor(row.length / 4)) === 0)).slice(0, 16), [surface.grid]);
  const variablesPlaying = graphVariables.some((variable) => variable.playing);

  useEffect(() => {
    setGraphVariables((current) => {
      const expressions = secondaryVisible ? [expression, secondaryExpression] : [expression];
      const next = reconcileGraphVariables(expressions, current);
      return sameVariables(current, next) ? current : next;
    });
  }, [expression, secondaryExpression, secondaryVisible]);

  useEffect(() => {
    if (!variablesPlaying) return;
    const timer = window.setInterval(() => setGraphVariables((current) => current.map(advanceGraphVariable)), 60);
    return () => window.clearInterval(timer);
  }, [variablesPlaying]);

  useEffect(() => setExactPartial(null), [resolvedExpression]);

  return (
    <GraphStudio3DWorkspace
      projectName={graphStudio.project.name}
      onProjectNameChange={(name) => graphStudio.updateProject({ name })}
      canUndo={graphStudio.canUndo}
      canRedo={graphStudio.canRedo}
      onUndo={graphStudio.undo}
      onRedo={graphStudio.redo}
      onSave={() => { graphStudio.save(); saveCurrentGraph(); }}
      onExportProject={exportProject}
      onExportCsv={exportSurfaceCsv}
      onCopyEquation={copyEquation}
      expression={expression}
      secondaryExpression={secondaryExpression}
      secondaryVisible={secondaryVisible}
      selectedSurface={selectedSurface}
      onSelectedSurfaceChange={setSelectedSurface}
      onExpressionChange={setExpression}
      onSecondaryExpressionChange={setSecondaryExpression}
      onSecondaryVisibleChange={setSecondaryVisible}
      onAddExpression={() => { setSecondaryExpression("x^2 - y^2"); setSecondaryVisible(true); setSelectedSurface("secondary"); }}
      onDuplicateExpression={() => { setSecondaryExpression(expression); setSecondaryVisible(true); setSelectedSurface("secondary"); }}
      onSwapExpressions={() => { const primary = expression; setExpression(secondaryExpression); setSecondaryExpression(primary); }}
      primaryError={surface.error}
      secondaryError={secondarySurface?.error}
      examples={examples}
      onExample={(next) => selectedSurface === "primary" ? setExpression(next) : setSecondaryExpression(next)}
      onRandomExample={tryRandom}
      variables={graphVariables}
      onVariablesChange={updateStudioVariables}
      tool={studioTool}
      onToolChange={setStudioTool}
      scene={surface.error ? (
        <div className="flex h-full items-center justify-center bg-slate-950 p-6 text-center text-sm font-bold text-amber-200">{surface.error}</div>
      ) : (
        <ThreeSceneWrapper key={cameraKey} height="100%" mobileHeight="100%" interactionLabel="Drag to orbit - wheel/pinch zoom - shift-drag pan" cameraPosition={cameraPosition} fov={46} quality="high" chrome="cinematic" showHint={false} sceneLabel={autoRotate ? "3D graphing - rotating" : undefined} className="h-full rounded-none border-0">
          <color attach="background" args={[studioSceneBackground(graphStudio.project.stylePreset)]} />
          <ambientLight intensity={0.72} />
          <directionalLight position={[5, 8, 6]} intensity={1.35} />
          <group position={toScenePosition(objectPosition)}>
            <SurfaceMesh samples={surface} palette={palette} wireframe={showWireframe} opacity={surfaceOpacity} interactive={studioTool !== "select"} onPick={handleSurfacePick} />
            {secondaryVisible && secondarySurface && !secondarySurface.error && <SurfaceMesh samples={secondarySurface} palette="thermal" wireframe={showWireframe} opacity={Math.max(0.18, surfaceOpacity * 0.62)} />}
            <SamplingSweep samples={surface} active={samplingAnimation} />
            {showPoints && <SamplePointCloud samples={surface} />}
            {showBase && <BasePlane size={Math.max(xRange, yRange) * 2.08} />}
            {showGrid && <gridHelper args={[Math.max(xRange, yRange) * 2.2, 18, "#38bdf8", "#334155"]} />}
            {showAxes && <axesHelper args={[Math.max(xRange, yRange) * 1.25]} />}
            {showLabels && <SurfaceLabels scale={Math.max(xRange, yRange) * 1.25} expression={expression} samples={surface} objectPosition={objectPosition} />}
            {sliceEnabled && <SlicePlane axis={sliceAxis} value={sliceX} range={Math.max(xRange, yRange)} samples={surface} />}
            {sliceEnabled && <SliceCurve axis={sliceAxis} value={sliceX} samples={surface} />}
            {surfaceDifferential && <SurfaceDifferentialGeometry analysis={surfaceDifferential} scale={Math.max(0.7, Math.min(xRange, yRange) * 0.22)} />}
            <ReferenceObject kind={referenceObject} scale={Math.max(1.4, Math.min(xRange, yRange) * 0.48)} />
          </group>
          <OrbitControls enablePan enableZoom enableDamping dampingFactor={0.08} autoRotate={autoRotate} autoRotateSpeed={0.7} />
        </ThreeSceneWrapper>
      )}
      crossSectionPreview={sliceEnabled ? <CrossSectionChart axis={sliceAxis} value={sliceX} samples={surface} /> : undefined}
      onCameraView={setCameraView}
      onResetCamera={() => setCameraView([4, 3.2, 6])}
      surface={surface}
      sampleRows={sampleRows}
      differential={surfaceDifferential}
      analysisPoint={analysisPoint}
      onAnalysisPointChange={setAnalysisPoint}
      onExactPartial={calculatePartial}
      exactPartial={exactPartial}
      onUsePartialSurface={() => { if (exactPartial) { setSecondaryExpression(exactPartial); setSecondaryVisible(true); setSelectedSurface("secondary"); } }}
      xRange={xRange}
      yRange={yRange}
      resolution={resolution}
      opacity={surfaceOpacity}
      palette={palette}
      objectPosition={objectPosition}
      referenceObject={referenceObject}
      onXRangeChange={setXRange}
      onYRangeChange={setYRange}
      onResolutionChange={setResolution}
      onOpacityChange={setSurfaceOpacity}
      onPaletteChange={setPalette}
      onObjectPositionChange={setObjectPosition}
      onReferenceObjectChange={setReferenceObject}
      showGrid={showGrid}
      showAxes={showAxes}
      showLabels={showLabels}
      showBase={showBase}
      showPoints={showPoints}
      showWireframe={showWireframe}
      autoRotate={autoRotate}
      samplingAnimation={samplingAnimation}
      sliceEnabled={sliceEnabled}
      sliceAxis={sliceAxis}
      sliceValue={sliceX}
      onShowGridChange={setShowGrid}
      onShowAxesChange={setShowAxes}
      onShowLabelsChange={setShowLabels}
      onShowBaseChange={setShowBase}
      onShowPointsChange={setShowPoints}
      onShowWireframeChange={setShowWireframe}
      onAutoRotateChange={setAutoRotate}
      onSamplingAnimationChange={setSamplingAnimation}
      onSliceEnabledChange={setSliceEnabled}
      onSliceAxisChange={setSliceAxis}
      onSliceValueChange={setSliceX}
      stylePreset={graphStudio.project.stylePreset}
      onStylePresetChange={(stylePreset) => graphStudio.updateProject({ stylePreset })}
      savedLibrary={<Saved3DGraphList saved={savedGraphs} onLoad={loadSavedGraph} onDelete={removeSavedGraph} />}
    />
  );

  function handleSurfacePick(point: THREE.Vector3) {
    const localX = clamp(point.x - objectPosition.x, -xRange, xRange);
    const localY = clamp(point.z - objectPosition.y, -yRange, yRange);
    const localZ = (point.y - objectPosition.z) / verticalScale(surface);
    if (studioTool === "point") {
      setAnalysisPoint({ x: Number(localX.toFixed(3)), y: Number(localY.toFixed(3)) });
      return;
    }
    if (studioTool === "slice") {
      const value = sliceAxis === "x" ? localX : sliceAxis === "y" ? localY : localZ;
      setSliceX(Number(value.toFixed(3)));
      setSliceEnabled(true);
    }
  }

  function calculatePartial(variable: "x" | "y") {
    const result = trySymbolic(() => symbolicDerivative(resolvedExpression.replace(/^z\s*=\s*/i, ""), variable));
    setExactPartial(result?.result ?? null);
  }

  function exportProject() {
    downloadGraphStudioFile(`${fileSlug(graphStudio.project.name)}.json`, exportGraphStudioProject({ ...graphStudio.project, state: graphStudioState }), "application/json");
  }

  function copyEquation() {
    void navigator.clipboard?.writeText(`z = ${selectedSurface === "primary" ? expression : secondaryExpression}`);
  }

  function updateStudioVariables(variables: GraphStudioVariable[]) {
    setGraphVariables(variables);
    graphStudio.updateProject({ variables });
  }

  function exportSurfaceCsv() {
    const csv = ["x,y,z,valid", ...surface.grid.flatMap((row) => row.map((point) => `${point.x},${point.y},${point.z ?? ""},${point.valid}`))].join("\n");
    downloadGraphStudioFile(`${fileSlug(expression)}-surface.csv`, csv, "text/csv");
  }

  function tryRandom() {
    const preset = beautifulSurfacePresets[Math.floor(Math.random() * beautifulSurfacePresets.length)];
    setExpression(preset.expression);
    setXRange(preset.xRange);
    setYRange(preset.yRange);
    setResolution(preset.resolution);
    setPalette(preset.palette);
    setShowWireframe(["contour", "mono"].includes(preset.palette));
    setShowPoints(false);
    setShowBase(true);
    setShowGrid(true);
    setShowAxes(true);
    setShowLabels(true);
    setCameraKey((value) => value + 1);
  }

  function setCameraView(position: [number, number, number]) {
    setCameraPosition(position);
    setCameraKey((value) => value + 1);
  }

  function saveCurrentGraph() {
    const workspace: SavedGraphWorkspace<Graph3DWorkspaceState> = {
      id: `graph-3d-${Date.now()}`,
      name: graphStudio.project.name.trim() || "Untitled 3D graph",
      savedAt: new Date().toISOString(),
      state: { expression, secondaryExpression, secondaryVisible, xRange, yRange, resolution, opacity: surfaceOpacity, palette, showGrid, showAxes, showWireframe, showPoints, sliceEnabled, sliceX, referenceObject, variables: graphVariables },
    };
    setSavedGraphs(saveGraphWorkspace(GRAPH_3D_STORAGE_KEY, workspace));
  }

  function loadSavedGraph(workspace: SavedGraphWorkspace<Graph3DWorkspaceState>) {
    const state = workspace.state;
    setExpression(state.expression);
    setSecondaryExpression(state.secondaryExpression);
    setSecondaryVisible(state.secondaryVisible);
    setXRange(state.xRange);
    setYRange(state.yRange);
    setResolution(state.resolution);
    setSurfaceOpacity(state.opacity);
    setPalette(state.palette);
    setShowGrid(state.showGrid);
    setShowAxes(state.showAxes);
    setShowWireframe(state.showWireframe);
    setShowPoints(state.showPoints);
    setSliceEnabled(state.sliceEnabled);
    setSliceX(state.sliceX);
    setReferenceObject(state.referenceObject);
    setGraphVariables(state.variables ?? []);
    graphStudio.updateProject({ name: workspace.name });
    setCameraView([4, 3.2, 6]);
  }

  function removeSavedGraph(id: string) {
    setSavedGraphs(deleteGraphWorkspace<Graph3DWorkspaceState>(GRAPH_3D_STORAGE_KEY, id));
  }
}

function Saved3DGraphList({ saved, onLoad, onDelete }: { saved: SavedGraphWorkspace<Graph3DWorkspaceState>[]; onLoad: (workspace: SavedGraphWorkspace<Graph3DWorkspaceState>) => void; onDelete: (id: string) => void }) {
  if (!saved.length) return <p className="mt-3 text-sm font-semibold text-slate-500">No saved 3D graphs yet.</p>;
  return (
    <div className="mt-3 max-h-56 space-y-2 overflow-auto" aria-label="Saved 3D graphs">
      {saved.map((workspace) => (
        <div key={workspace.id} className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 dark:border-white/10">
          <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onLoad(workspace)}>
            <span className="block truncate text-sm font-black">{workspace.name}</span>
            <span className="block truncate text-xs text-slate-500">z = {workspace.state.expression}</span>
          </button>
          <button type="button" className="tooltip-icon rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-400/10" aria-label={`Delete ${workspace.name}`} data-tooltip="Delete saved graph" onClick={() => onDelete(workspace.id)}><Trash2 className="h-4 w-4" /></button>
        </div>
      ))}
    </div>
  );
}

function buildBeautifulSurfacePresets(): BeautifulSurfacePreset[] {
  const preset = (name: string, expression: string, xRange = 4, yRange = xRange, resolution = 52, palette: SurfacePalette = "height"): BeautifulSurfacePreset => ({
    name,
    expression,
    xRange,
    yRange,
    resolution,
    palette,
  });
  const radial = [0.8, 1, 1.2, 1.5, 1.8, 2, 2.4, 2.8, 3, 3.4, 3.8, 4].map((k) =>
    preset(`Radial ripple ${k}`, `sin(${k}*sqrt(x^2 + y^2))/(1 + 0.08*(x^2 + y^2))`, 5, 5, 58, "contour")
  );
  const flower = [3, 4, 5, 6, 7, 8, 9, 10].flatMap((k) => [
    preset(`Flower lattice ${k}A`, `sin(${k}*x)*cos(${k}*y)/(1 + 0.12*(x^2 + y^2))`, 3.2, 3.2, 58, "height"),
    preset(`Flower lattice ${k}B`, `(sin(${k}*x) + cos(${k}*y))/(1 + 0.18*(x^2 + y^2))`, 3.2, 3.2, 56, "thermal"),
  ]);
  const waves = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.25, 2.5, 3].flatMap((k) => [
    preset(`Wave braid ${k}A`, `sin(${k}*x + y) + cos(x - ${k}*y)`, 4, 4, 50, "height"),
    preset(`Wave braid ${k}B`, `sin(${k}*x)*sin(y) + cos(x)*cos(${k}*y)`, 4, 4, 50, "contour"),
  ]);
  const gaussians = [
    preset("Twin emerald hills", `2*exp(-((x-1.4)^2 + (y-1.4)^2)) + 1.5*exp(-((x+1.2)^2 + (y+1.2)^2))`, 4, 4, 56, "height"),
    preset("Crater lake", `2*exp(-(x^2 + y^2)) - 1.6*exp(-4*(x^2 + y^2))`, 3, 3, 58, "thermal"),
    preset("Four glowing peaks", `exp(-((x-1.5)^2+(y-1.5)^2)) + exp(-((x+1.5)^2+(y-1.5)^2)) + exp(-((x-1.5)^2+(y+1.5)^2)) + exp(-((x+1.5)^2+(y+1.5)^2))`, 4, 4, 58, "height"),
    preset("Gaussian ribbon", `exp(-x^2)*sin(3*y)`, 4, 4, 58, "mono"),
    preset("Soft saddle hill", `(x^2 - y^2)*exp(-0.35*(x^2 + y^2))`, 4, 4, 56, "thermal"),
    preset("Volcanic ridge", `(3 - x^2 - y^2)*exp(-0.4*(x^2 + y^2))`, 4, 4, 56, "thermal"),
  ];
  const polynomial = [
    preset("Classic paraboloid", `0.25*(x^2 + y^2)`, 5, 5, 46, "height"),
    preset("Saddle valley", `0.35*(x^2 - y^2)`, 4, 4, 46, "contour"),
    preset("Monkey saddle", `0.08*(x^3 - 3*x*y^2)`, 4, 4, 54, "thermal"),
    preset("Quartic bowl", `0.03*(x^4 + y^4) - 0.4*(x^2 + y^2)`, 4, 4, 54, "height"),
    preset("Diamond roof", `abs(x) + abs(y)`, 4, 4, 38, "mono"),
    preset("Crystal pyramid", `abs(x-y) + 0.5*abs(x+y)`, 4, 4, 42, "mono"),
    preset("Folded saddle", `abs(x^2 - y^2)`, 4, 4, 44, "thermal"),
    preset("Cubic ribbon", `0.08*x^3 - 0.35*x*y`, 4, 4, 50, "height"),
  ];
  const trigMix = [
    preset("Classic sine lattice", `sin(x)*cos(y)`, 4, 4, 52, "height"),
    preset("Cosine lace", `cos(x*y)`, 4, 4, 54, "contour"),
    preset("Nested waves", `sin(x + sin(y))`, 5, 5, 54, "height"),
    preset("Interference field", `sin(x^2 + y^2) + 0.5*cos(3*x)`, 4, 4, 58, "thermal"),
    preset("Checker wave", `sin(2*x)*sin(2*y)`, 4, 4, 52, "contour"),
    preset("Ocean swell", `sin(x) + 0.5*sin(2*y) + 0.25*cos(x-y)`, 5, 5, 52, "height"),
    preset("Moire surface", `sin(2*x + y) * cos(x - 2*y)`, 4, 4, 58, "contour"),
    preset("Standing wave dome", `cos(sqrt(x^2 + y^2))*exp(-0.08*(x^2+y^2))`, 5, 5, 58, "height"),
    preset("Rippled saddle", `(x^2 - y^2)*0.08 + sin(3*x)*cos(3*y)*0.5`, 4, 4, 56, "thermal"),
    preset("Star waves", `sin(x)*cos(y) + sin(2*x+2*y)*0.4`, 4, 4, 56, "height"),
  ];
  const special = [
    preset("Log canyon", `ln(1 + x^2 + y^2)`, 5, 5, 46, "mono"),
    preset("Sqrt cone", `sqrt(x^2 + y^2)`, 5, 5, 44, "height"),
    preset("Inverted cone", `-sqrt(x^2 + y^2)`, 5, 5, 44, "thermal"),
    preset("Soft absolute ridge", `abs(sin(x) + cos(y))`, 4, 4, 50, "contour"),
    preset("Cubed root sheet", `cbrt(x*y)`, 5, 5, 48, "mono"),
    preset("Arctan curtain", `atan(x*y)`, 5, 5, 50, "thermal"),
    preset("Tangent fabric", `0.3*tan(0.4*x)*cos(y)`, 3, 3, 54, "thermal"),
    preset("Log wave", `ln(1 + abs(sin(x*y)))`, 4, 4, 52, "contour"),
  ];
  const harmonic = [1, 2, 3, 4, 5, 6].flatMap((k) => [
    preset(`Harmonic weave ${k}A`, `sin(${k}*x)/(1 + y^2) + cos(${k}*y)/(1 + x^2)`, 5, 5, 54, "height"),
    preset(`Harmonic weave ${k}B`, `(sin(${k}*x) + sin(${k}*y))/(1 + 0.05*(x^2+y^2))`, 5, 5, 54, "thermal"),
  ]);
  const landscapes = [0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8].flatMap((k) => [
    preset(`Landscape ${k} ridge`, `${k}*sin(x)*exp(-0.12*y^2) + 0.35*cos(2*y)`, 5, 5, 54, "height"),
    preset(`Landscape ${k} basin`, `${k}*cos(y)*exp(-0.12*x^2) - 0.12*(x^2+y^2)`, 5, 5, 54, "thermal"),
  ]);
  const gems = [
    preset("Peacock shell", `sin(3*sqrt(x^2+y^2)) + 0.35*cos(5*x)*sin(5*y)`, 4.5, 4.5, 62, "contour"),
    preset("Aurora sheet", `sin(x) + sin(1.6*y) + sin(0.7*x + 1.2*y)`, 5, 5, 54, "height"),
    preset("Glass flower", `cos(4*x)*cos(4*y)*exp(-0.08*(x^2+y^2))`, 4.5, 4.5, 62, "mono"),
    preset("Solar flare", `sin(5*sqrt(x^2+y^2))/(0.8 + sqrt(x^2+y^2))`, 5, 5, 62, "thermal"),
    preset("Cathedral vault", `cos(x) + cos(y) + 0.25*cos(x+y)`, 4, 4, 52, "height"),
    preset("Braided saddle", `sin(x*y) + 0.12*(x^2-y^2)`, 4, 4, 58, "contour"),
    preset("Crystal field", `floor(abs(sin(x)*cos(y))*5)/5`, 4, 4, 46, "mono"),
    preset("Smooth crystal field", `abs(sin(2*x)*cos(2*y))`, 4, 4, 52, "contour"),
  ];
  return [...trigMix, ...radial, ...flower, ...waves, ...gaussians, ...polynomial, ...special, ...harmonic, ...landscapes, ...gems];
}

function SurfaceMesh({ samples, palette, wireframe, opacity, interactive = false, onPick }: { samples: SurfaceSampleResult; palette: SurfacePalette; wireframe: boolean; opacity: number; interactive?: boolean; onPick?: (point: THREE.Vector3) => void }) {
  const geometry = useMemo(() => {
    const data = generateSurfaceMeshData(samples);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(data.positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colorSurface(data.positions, samples, palette), 3));
    geom.setIndex(data.indices);
    geom.computeVertexNormals();
    return geom;
  }, [palette, samples]);

  if (samples.error || !samples.grid.length) return null;
  return (
    <group>
      <mesh
        geometry={geometry}
        scale={[1, verticalScale(samples), 1]}
        castShadow
        receiveShadow
        onClick={interactive ? (event) => { event.stopPropagation(); onPick?.(event.point.clone()); } : undefined}
        onPointerOver={interactive ? () => { document.body.style.cursor = "crosshair"; } : undefined}
        onPointerOut={interactive ? () => { document.body.style.cursor = ""; } : undefined}
      >
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.42} metalness={0.08} transparent={opacity < 1} opacity={opacity} depthWrite={opacity > 0.72} />
      </mesh>
      {wireframe && (
        <mesh geometry={geometry} scale={[1, verticalScale(samples), 1]}>
          <meshBasicMaterial color="#e0f2fe" wireframe transparent opacity={0.22} />
        </mesh>
      )}
    </group>
  );
}

function SlicePlane({ axis, value, range, samples }: { axis: SliceAxis; value: number; range: number; samples: SurfaceSampleResult }) {
  const height = Math.max(2, Math.abs(samples.minZ ?? -1), Math.abs(samples.maxZ ?? 1)) * verticalScale(samples) * 2.2;
  const position: [number, number, number] = axis === "x" ? [value, height * 0.08, 0] : axis === "y" ? [0, height * 0.08, value] : [0, value * verticalScale(samples), 0];
  const rotation: [number, number, number] = axis === "x" ? [0, Math.PI / 2, 0] : axis === "y" ? [0, 0, 0] : [-Math.PI / 2, 0, 0];
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={axis === "z" ? [range * 2.1, range * 2.1] : [range * 2.1, height]} />
      <meshBasicMaterial color="#fef08a" transparent opacity={0.18} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function SliceCurve({ axis, value, samples }: { axis: SliceAxis; value: number; samples: SurfaceSampleResult }) {
  const points = useMemo(() => crossSectionPoints(samples, axis, value), [axis, samples, value]);
  const scenePoints = points.map((point) => axis === "x"
    ? new THREE.Vector3(value, point.v * verticalScale(samples), point.u)
    : axis === "y"
      ? new THREE.Vector3(point.u, point.v * verticalScale(samples), value)
      : new THREE.Vector3(point.u, value * verticalScale(samples), point.v));
  if (scenePoints.length < 2) return null;
  if (axis === "z") return <group>{scenePoints.slice(0, 180).map((point, index) => <mesh key={`${index}-${point.x}-${point.z}`} position={point}><sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial color="#fde047" /></mesh>)}</group>;
  return <Line points={scenePoints} color="#fde047" lineWidth={4} />;
}

function CrossSectionChart({ axis, value, samples }: { axis: SliceAxis; value: number; samples: SurfaceSampleResult }) {
  const points = crossSectionPoints(samples, axis, value);
  if (points.length < 2) return null;
  const width = 720;
  const height = 180;
  const minU = Math.min(...points.map((point) => point.u));
  const maxU = Math.max(...points.map((point) => point.u));
  const minV = Math.min(...points.map((point) => point.v));
  const maxV = Math.max(...points.map((point) => point.v));
  const project = (point: { u: number; v: number }) => `${20 + ((point.u - minU) / Math.max(1e-8, maxU - minU)) * (width - 40)},${height - 20 - ((point.v - minV) / Math.max(1e-8, maxV - minV)) * (height - 40)}`;
  return <section className="mb-3 rounded-lg border border-amber-300/40 bg-slate-950 p-3 text-white" aria-label={`Live ${axis} cross-section`}>
    <div className="mb-2 flex items-center justify-between gap-2"><strong className="text-sm">Live 2D cross-section</strong><code className="text-xs text-amber-200">{axis} = {format(value)}</code></div>
    <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" role="img" aria-label={`Approximate cross-section at ${axis} equals ${format(value)}`}>
      <rect width={width} height={height} fill="#020617" />
      <path d={`M20 ${height - 20}H${width - 20} M20 20V${height - 20}`} stroke="#475569" />
      {axis === "z" ? points.slice(0, 220).map((point, index) => { const [cx, cy] = project(point).split(","); return <circle key={`${index}-${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill="#fde047" />; }) : <polyline points={points.map(project).join(" ")} fill="none" stroke="#fde047" strokeWidth="3" />}
    </svg>
    <p className="mt-2 text-xs text-slate-400">Numerically sampled intersection. Values are approximate.</p>
  </section>;
}

function SurfaceDifferentialGeometry({ analysis, scale }: { analysis: SurfaceDifferential; scale: number }) {
  const { x, y, z } = analysis.point;
  const fx = analysis.gradient.x;
  const fy = analysis.gradient.y;
  const geometry = useMemo(() => {
    const vertices = [
      x - scale, z - fx * scale - fy * scale, y - scale,
      x + scale, z + fx * scale - fy * scale, y - scale,
      x + scale, z + fx * scale + fy * scale, y + scale,
      x - scale, z - fx * scale + fy * scale, y + scale,
    ];
    const result = new THREE.BufferGeometry();
    result.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
    result.setIndex([0, 1, 2, 0, 2, 3]);
    result.computeVertexNormals();
    return result;
  }, [fx, fy, scale, x, y, z]);
  const normalEnd: [number, number, number] = [x + analysis.normal[0] * scale * 1.8, z + analysis.normal[1] * scale * 1.8, y + analysis.normal[2] * scale * 1.8];
  const gradientLength = Math.max(1e-8, analysis.gradient.magnitude);
  const gradientEnd: [number, number, number] = [x + fx / gradientLength * scale * 1.8, z + gradientLength * scale * 0.65, y + fy / gradientLength * scale * 1.8];
  return <group>
    <mesh geometry={geometry}><meshStandardMaterial color="#facc15" transparent opacity={0.28} side={THREE.DoubleSide} /></mesh>
    <Line points={[[x, z, y], normalEnd]} color="#f43f5e" lineWidth={4} />
    <Line points={[[x, z, y], gradientEnd]} color="#22d3ee" lineWidth={4} />
    <mesh position={[x, z, y]}><sphereGeometry args={[scale * 0.09, 18, 18]} /><meshStandardMaterial color="#ffffff" /></mesh>
  </group>;
}

function crossSectionPoints(samples: SurfaceSampleResult, axis: SliceAxis, value: number) {
  if (!samples.grid.length) return [] as { u: number; v: number }[];
  if (axis === "x") return samples.grid.map((row) => row.reduce((best, point) => Math.abs(point.x - value) < Math.abs(best.x - value) ? point : best, row[0])).filter((point) => point?.valid && point.z !== null).map((point) => ({ u: point.y, v: point.z! }));
  if (axis === "y") {
    const row = samples.grid.reduce((best, candidate) => Math.abs((candidate[0]?.y ?? 0) - value) < Math.abs((best[0]?.y ?? 0) - value) ? candidate : best, samples.grid[0]);
    return row.filter((point) => point.valid && point.z !== null).map((point) => ({ u: point.x, v: point.z! }));
  }
  const intersections: { u: number; v: number }[] = [];
  samples.grid.forEach((row) => {
    for (let index = 1; index < row.length; index += 1) {
      const left = row[index - 1];
      const right = row[index];
      if (!left.valid || !right.valid || left.z === null || right.z === null || (left.z - value) * (right.z - value) > 0) continue;
      const ratio = Math.abs(right.z - left.z) < 1e-8 ? 0 : (value - left.z) / (right.z - left.z);
      intersections.push({ u: left.x + ratio * (right.x - left.x), v: left.y });
    }
  });
  return intersections;
}

function ReferenceObject({ kind, scale }: { kind: ReferenceObjectKind; scale: number }) {
  if (kind === "none") return null;
  if (kind === "helix") {
    const points = Array.from({ length: 180 }, (_, index) => {
      const t = index / 179 * Math.PI * 6;
      return new THREE.Vector3(Math.cos(t) * scale * 0.7, -scale + index / 179 * scale * 2, Math.sin(t) * scale * 0.7);
    });
    return <Line points={points} color="#fef08a" lineWidth={3} />;
  }
  if (kind === "sphere") return <mesh position={[0, scale, 0]}><sphereGeometry args={[scale, 48, 32]} /><meshStandardMaterial color="#a78bfa" wireframe transparent opacity={0.42} /></mesh>;
  if (kind === "cone") return <mesh position={[0, scale, 0]}><coneGeometry args={[scale, scale * 2, 48]} /><meshStandardMaterial color="#f59e0b" wireframe transparent opacity={0.46} /></mesh>;
  return <mesh position={[0, scale, 0]}><cylinderGeometry args={[scale, scale, scale * 2, 48]} /><meshStandardMaterial color="#22d3ee" wireframe transparent opacity={0.42} /></mesh>;
}

function BasePlane({ size }: { size: number }) {
  return (
    <mesh position={[0, -0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size, 1, 1]} />
      <meshBasicMaterial color="#0f172a" transparent opacity={0.34} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function SamplingSweep({ samples, active }: { samples: SurfaceSampleResult; active: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const markerRef = useRef<THREE.Mesh>(null);
  const rows = samples.grid.length;
  const cols = samples.grid[0]?.length ?? 0;
  const xMin = samples.grid[0]?.[0]?.x ?? -3;
  const xMax = samples.grid[0]?.[cols - 1]?.x ?? 3;
  const yMin = samples.grid[0]?.[0]?.y ?? -3;
  const yMax = samples.grid[rows - 1]?.[0]?.y ?? 3;
  const middleRow = rows ? samples.grid[Math.floor(rows / 2)] : [];
  const scaleY = verticalScale(samples);
  const zSpan = Math.max(1.2, Math.abs(samples.maxZ ?? 1) * scaleY, Math.abs(samples.minZ ?? -1) * scaleY);

  useFrame(({ clock }) => {
    if (!active || !groupRef.current) return;
    const phase = (clock.elapsedTime * 0.16) % 1;
    const x = xMin + phase * (xMax - xMin);
    groupRef.current.position.x = x;

    if (markerRef.current && middleRow.length) {
      const nearest = middleRow.reduce((best, point) => (Math.abs(point.x - x) < Math.abs(best.x - x) ? point : best), middleRow[0]);
      markerRef.current.visible = nearest.valid && nearest.z !== null;
      markerRef.current.position.set(x, (nearest.z ?? 0) * scaleY + 0.12, nearest.y);
    }
  });

  if (samples.error || !rows || !cols || samples.minZ === null) return null;

  return (
    <group>
      <group ref={groupRef} position={[xMin, 0, 0]}>
        <mesh position={[0, zSpan * 0.15, 0]}>
          <boxGeometry args={[0.045, zSpan * 2.2, Math.max(0.1, yMax - yMin)]} />
          <meshBasicMaterial color="#fef08a" transparent opacity={0.16} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.07, 0.08, Math.max(0.1, yMax - yMin)]} />
          <meshBasicMaterial color="#fde047" transparent opacity={0.7} />
        </mesh>
        <Text position={[0, zSpan * 1.35, yMax + 0.32]} fontSize={0.16} color="#fef08a" anchorX="center" outlineColor="#020617" outlineWidth={0.01}>
          sampling sweep
        </Text>
      </group>
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.09, 18, 18]} />
        <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={0.85} />
      </mesh>
    </group>
  );
}

function colorSurface(positions: number[], samples: SurfaceSampleResult, palette: SurfacePalette) {
  const minZ = samples.minZ ?? -1;
  const maxZ = samples.maxZ ?? 1;
  const span = Math.max(1e-8, maxZ - minZ);
  const color = new THREE.Color();
  const colors: number[] = [];
  for (let index = 1; index < positions.length; index += 3) {
    const ratio = Math.max(0, Math.min(1, (positions[index] - minZ) / span));
    if (palette === "thermal") color.setHSL(0.05 + 0.12 * ratio, 0.95, 0.38 + 0.25 * ratio);
    else if (palette === "contour") color.setHSL(Math.floor(ratio * 8) / 8, 0.85, 0.52);
    else if (palette === "mono") color.setRGB(0.18 + ratio * 0.6, 0.72 + ratio * 0.18, 0.78 + ratio * 0.12);
    else color.setRGB(0.08 + 0.75 * ratio, 0.75 - 0.35 * ratio, 0.95 - 0.75 * ratio);
    colors.push(color.r, color.g, color.b);
  }
  return colors;
}

function SamplePointCloud({ samples }: { samples: SurfaceSampleResult }) {
  const points = samples.grid.flatMap((row, rowIndex) => row.filter((point, colIndex) => point.valid && point.z !== null && rowIndex % 5 === 0 && colIndex % 5 === 0));
  return (
    <group>
      {points.map((point) => (
        <mesh key={`${point.x}-${point.y}`} position={[point.x, (point.z ?? 0) * verticalScale(samples), point.y]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color="#fef08a" />
        </mesh>
      ))}
    </group>
  );
}

function SurfaceLabels({ scale, expression, samples, objectPosition }: { scale: number; expression: string; samples: SurfaceSampleResult; objectPosition: ObjectPosition }) {
  const slope = estimateCenterSlope(samples);
  const moved = objectPosition.x !== 0 || objectPosition.y !== 0 || objectPosition.z !== 0;
  return (
    <group>
      <TextSprite text="x" position={[scale, 0, 0]} color="#67e8f9" />
      <TextSprite text="y" position={[0, 0, scale]} color="#c4b5fd" />
      <TextSprite text="z" position={[0, scale, 0]} color="#86efac" />
      <SceneText text={`z = ${expression}`} position={[-scale * 0.72, scale * 0.5, -scale * 0.72]} color="#e0f2fe" size={0.2} />
      <SceneText text={moved ? `surface origin (${format(objectPosition.x)}, ${format(objectPosition.y)}, ${format(objectPosition.z)})` : "origin (0, 0, 0)"} position={[0.28, 0.18, 0.28]} color="#f8fafc" size={0.14} />
      <SceneText text="color = height z" position={[scale * 0.58, scale * 0.18, -scale * 0.64]} color="#fde68a" size={0.17} />
      <SceneText text={`slope |grad z| ~= ${format(slope)}`} position={[scale * 0.35, scale * 0.44, scale * 0.62]} color="#fca5a5" size={0.16} />
      <SceneText text={`min z ${format(samples.minZ ?? 0)} / max z ${format(samples.maxZ ?? 0)}`} position={[-scale * 0.6, -0.28, scale * 0.68]} color="#bae6fd" size={0.16} />
    </group>
  );
}

function estimateCenterSlope(samples: SurfaceSampleResult) {
  const rows = samples.grid.length;
  const cols = samples.grid[0]?.length ?? 0;
  if (rows < 3 || cols < 3) return 0;
  const row = Math.floor(rows / 2);
  const col = Math.floor(cols / 2);
  const left = samples.grid[row]?.[col - 1];
  const right = samples.grid[row]?.[col + 1];
  const down = samples.grid[row - 1]?.[col];
  const up = samples.grid[row + 1]?.[col];
  if (!left?.valid || !right?.valid || !down?.valid || !up?.valid || left.z === null || right.z === null || down.z === null || up.z === null) return 0;
  const dzdx = (right.z - left.z) / Math.max(1e-8, right.x - left.x);
  const dzdy = (up.z - down.z) / Math.max(1e-8, up.y - down.y);
  return Math.hypot(dzdx, dzdy);
}

function SceneText({ text, position, color, size }: { text: string; position: [number, number, number]; color: string; size: number }) {
  return (
    <Text position={position} fontSize={size} color={color} anchorX="center" anchorY="middle" outlineColor="#020617" outlineWidth={0.012}>
      {text}
    </Text>
  );
}

function TextSprite({ text, position, color }: { text: string; position: [number, number, number]; color: string }) {
  const canvas = useMemo(() => {
    const element = document.createElement("canvas");
    element.width = 128;
    element.height = 64;
    const ctx = element.getContext("2d");
    if (ctx) {
      ctx.fillStyle = color;
      ctx.font = "bold 44px sans-serif";
      ctx.fillText(text, 40, 46);
    }
    return element;
  }, [color, text]);
  const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);
  return <sprite position={position} scale={[0.5, 0.25, 1]}><spriteMaterial map={texture} transparent /></sprite>;
}

function verticalScale(samples: SurfaceSampleResult) {
  const span = Math.max(1, Math.abs(samples.maxZ ?? 1), Math.abs(samples.minZ ?? -1));
  return span > 8 ? 8 / span : 1;
}

function toScenePosition(position: ObjectPosition): [number, number, number] {
  return [position.x, position.z, position.y];
}

function format(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value) < 1e-10) return "0";
  if (Math.abs(value) >= 10000 || Math.abs(value) < 0.001) return value.toExponential(3);
  return Number(value.toFixed(4)).toString();
}

function fileSlug(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "surface";
}

function studioSceneBackground(preset: GraphStudioStylePreset) {
  if (preset === "paper" || preset === "print") return "#f8fafc";
  if (preset === "contrast") return "#000000";
  if (preset === "colorblind") return "#111827";
  if (preset === "neon") return "#030712";
  return "#020617";
}

function sameVariables(current: GraphStudioVariable[], next: GraphStudioVariable[]) {
  return current.length === next.length && current.every((variable, index) => variable.id === next[index]?.id);
}

function advanceGraphVariable(variable: GraphStudioVariable): GraphStudioVariable {
  if (!variable.playing || variable.max <= variable.min) return variable;
  const increment = Math.max(0.001, variable.step) * variable.speed * variable.direction;
  let value = variable.value + increment;
  let direction = variable.direction;
  if (variable.playback === "ping-pong") {
    if (value >= variable.max) { value = variable.max; direction = -1; }
    if (value <= variable.min) { value = variable.min; direction = 1; }
  } else {
    const span = variable.max - variable.min;
    if (value > variable.max) value = variable.min + (value - variable.max) % span;
    if (value < variable.min) value = variable.max - (variable.min - value) % span;
  }
  return { ...variable, value: Number(value.toFixed(10)), direction };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

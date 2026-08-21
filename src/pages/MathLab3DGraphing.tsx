import { Line, OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import { SurfaceSampleResult, generateSurfaceMeshData, sampleSurface } from "../utils/mathEngine/graph3dUtils";
import { deleteGraphWorkspace, readSavedGraphWorkspaces, saveGraphWorkspace, type SavedGraphWorkspace } from "../utils/graphWorkspaceStorage";
import { analyzeSurfaceDifferential, type SurfaceDifferential } from "../graph-studio/graphIntelligence";
import GraphStudio3DWorkspace, { type Studio3DTool } from "../graph-studio/GraphStudio3DWorkspace";
import { reconcileGraphVariables, substituteGraphVariables } from "../graph-studio/expressionEngine";
import { downloadGraphStudioFile, exportGraphStudioProject } from "../graph-studio/projectStorage";
import { useGraphStudioProject } from "../graph-studio/useGraphStudioProject";
import type { GraphStudioVariable } from "../graph-studio/types";
import { symbolicDerivative, trySymbolic } from "../utils/symbolic";
import { createMathWorkspacePayload, type MathWorkspacePayload } from "../workspace/mathWorkspaces";
import { readWorkspaceTransfer, saveWorkspaceTransfer } from "../workspace/workspaceTransfer";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { createGraph3DSurface, migrateGraph3DSurfaces, type Graph3DSurface, type SurfacePalette } from "../graph-studio/graph3dSurfaceModel";
import { DEFAULT_GRAPH_3D_THEME_ID, GRAPH_3D_THEME_STORAGE_KEY, getGraph3DTheme, isGraph3DThemeId, type Graph3DTheme, type Graph3DThemeId } from "../graph-studio/graph3dThemes";
import ShareExportControl from "../components/workspace/ShareExportControl";
import type { PortableWorkspaceAdapter } from "../workspace/portableWorkspace";

const examples = [
  "x^2 + y^2",
  "sin(x) * cos(y)",
  "sqrt(x^2 + y^2)",
  "x^2 - y^2",
  "sqrt(25 - x^2 - y^2)",
  "sqrt(9 - x^2)",
  "exp(-(x^2 + y^2))",
];

type ObjectPosition = { x: number; y: number; z: number };
type ReferenceObjectKind = "none" | "helix" | "sphere" | "cone" | "cylinder";
type SliceAxis = "x" | "y" | "z";
type Graph3DWorkspaceState = {
  surfaces: Graph3DSurface[];
  selectedSurfaceId: string;
  expression?: string;
  secondaryExpression?: string;
  secondaryVisible?: boolean;
  xRange: number;
  yRange: number;
  resolution: number;
  opacity?: number;
  palette?: SurfacePalette;
  showGrid: boolean;
  showAxes: boolean;
  showInfiniteAxes?: boolean;
  showWireframe?: boolean;
  showPoints?: boolean;
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
  const reducedMotion = useReducedMotion();
  const location = useLocation();
  const navigate = useNavigate();
  const routePayload = (location.state as { mathWorkspacePayload?: MathWorkspacePayload } | null)?.mathWorkspacePayload;
  const incomingPayload = useMemo(() => routePayload ?? readWorkspaceTransfer("graphs-3d"), [routePayload]);
  const [surfaces, setSurfaces] = useState<Graph3DSurface[]>(() => [createGraph3DSurface(incomingPayload?.objectType === "surface" ? incomingPayload.value : "sin(x) * cos(y)")]);
  const [selectedSurfaceId, setSelectedSurfaceId] = useState(() => surfaces[0].id);
  const [xRange, setXRange] = useState(3);
  const [yRange, setYRange] = useState(3);
  const [resolution, setResolution] = useState(44);
  const [showGrid, setShowGrid] = useState(true);
  const [showBase, setShowBase] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showInfiniteAxes, setShowInfiniteAxes] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
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
  const [exactPartial, setExactPartial] = useState<string | null>(null);
  const [studioTool, setStudioTool] = useState<Studio3DTool>("select");
  const [graphThemeId, setGraphThemeId] = useState<Graph3DThemeId>(() => {
    const saved = typeof window === "undefined" ? null : window.localStorage.getItem(GRAPH_3D_THEME_STORAGE_KEY);
    return isGraph3DThemeId(saved) ? saved : DEFAULT_GRAPH_3D_THEME_ID;
  });
  const graphTheme = getGraph3DTheme(graphThemeId);

  const graphStudioState = useMemo<Graph3DWorkspaceState>(() => ({ surfaces, selectedSurfaceId, xRange, yRange, resolution, showGrid, showAxes, showInfiniteAxes, sliceEnabled, sliceX, referenceObject, variables: graphVariables }), [graphVariables, referenceObject, resolution, selectedSurfaceId, showAxes, showGrid, showInfiniteAxes, sliceEnabled, sliceX, surfaces, xRange, yRange]);
  const graphStudio = useGraphStudioProject({
    dimension: "3d",
    initialName: "Graph Studio 3D",
    state: graphStudioState,
    applyState: (state, variables) => {
      const nextSurfaces = migrateGraph3DSurfaces(state);
      setSurfaces(nextSurfaces);
      setSelectedSurfaceId(nextSurfaces.some((surface) => surface.id === state.selectedSurfaceId) ? state.selectedSurfaceId : nextSurfaces[0].id);
      setXRange(state.xRange);
      setYRange(state.yRange);
      setResolution(state.resolution);
      setShowGrid(state.showGrid);
      setShowAxes(state.showAxes);
      setShowInfiniteAxes(Boolean(state.showInfiniteAxes));
      setSliceEnabled(state.sliceEnabled);
      setSliceX(state.sliceX);
      setReferenceObject(state.referenceObject);
      setGraphVariables(state.variables ?? variables);
      setCameraKey((value) => value + 1);
    },
  });

  const selectedSurface = surfaces.find((item) => item.id === selectedSurfaceId) ?? surfaces[0];
  const expression = selectedSurface.expression;
  const resolvedExpression = substituteGraphVariables(expression, graphVariables);
  const sampledSurfaces = useMemo(() => surfaces.map((item) => ({ item, samples: sampleSurface(substituteGraphVariables(item.expression, graphVariables), -xRange, xRange, -yRange, yRange, resolution) })), [graphVariables, resolution, surfaces, xRange, yRange]);
  const surface = sampledSurfaces.find(({ item }) => item.id === selectedSurface.id)?.samples ?? sampledSurfaces[0].samples;
  const visibleValidSurfaces = sampledSurfaces.filter(({ item, samples }) => item.visible && !samples.error);
  const surfaceDifferential = useMemo(() => analyzeSurfaceDifferential(resolvedExpression, analysisPoint.x, analysisPoint.y), [analysisPoint, resolvedExpression]);
  const sampleRows = useMemo(() => surface.grid.flatMap((row, rowIndex) => row.filter((_, colIndex) => rowIndex % Math.max(1, Math.floor(surface.grid.length / 4)) === 0 && colIndex % Math.max(1, Math.floor(row.length / 4)) === 0)).slice(0, 16), [surface.grid]);
  const variablesPlaying = graphVariables.some((variable) => variable.playing);

  useEffect(() => {
    setGraphVariables((current) => {
      const expressions = surfaces.filter((surface) => surface.visible).map((surface) => surface.expression);
      const next = reconcileGraphVariables(expressions, current);
      return sameVariables(current, next) ? current : next;
    });
  }, [surfaces]);

  useEffect(() => {
    if (!variablesPlaying || reducedMotion) return;
    const timer = window.setInterval(() => setGraphVariables((current) => current.map(advanceGraphVariable)), 60);
    return () => window.clearInterval(timer);
  }, [reducedMotion, variablesPlaying]);

  useEffect(() => setExactPartial(null), [resolvedExpression]);

  useEffect(() => {
    window.localStorage.setItem(GRAPH_3D_THEME_STORAGE_KEY, graphThemeId);
  }, [graphThemeId]);

  const portableAdapter: PortableWorkspaceAdapter = {
    workspaceType: "3d-graph",
    engine: "graph-studio-3d",
    engineVersion: "1.0.1",
    title: () => graphStudio.project.name || "Graph Studio 3D",
    serializeScene: () => ({
      ...graphStudioState,
      showBase, showLabels, showInfiniteAxes, autoRotate, objectPosition, cameraPosition, sliceAxis, analysisPoint, graphThemeId,
      projectName: graphStudio.project.name,
      stylePreset: graphStudio.project.stylePreset,
    }),
    deserializeScene: (scene) => {
      if (!scene || typeof scene !== "object") throw new Error("The imported 3D graph scene is invalid.");
      const state = scene as Partial<Graph3DWorkspaceState> & {
        showBase?: boolean; showLabels?: boolean; showInfiniteAxes?: boolean; autoRotate?: boolean; objectPosition?: ObjectPosition; cameraPosition?: [number, number, number];
        sliceAxis?: SliceAxis; analysisPoint?: { x: number; y: number }; graphThemeId?: Graph3DThemeId; projectName?: string;
        stylePreset?: typeof graphStudio.project.stylePreset;
      };
      const nextSurfaces = migrateGraph3DSurfaces(state);
      if (!nextSurfaces.length) throw new Error("The imported file contains no supported 3D surfaces.");
      setSurfaces(nextSurfaces);
      setSelectedSurfaceId(nextSurfaces.some(surface => surface.id === state.selectedSurfaceId) ? state.selectedSurfaceId! : nextSurfaces[0].id);
      setXRange(clamp(Number(state.xRange ?? 3), 1, 8)); setYRange(clamp(Number(state.yRange ?? 3), 1, 8)); setResolution(clamp(Math.round(Number(state.resolution ?? 44)), 12, 80));
      setShowGrid(state.showGrid !== false); setShowAxes(state.showAxes !== false); setShowInfiniteAxes(Boolean(state.showInfiniteAxes)); setShowBase(state.showBase !== false); setShowLabels(state.showLabels !== false);
      setSliceEnabled(Boolean(state.sliceEnabled)); setSliceX(Number(state.sliceX ?? 0)); setSliceAxis(["x", "y", "z"].includes(state.sliceAxis ?? "") ? state.sliceAxis! : "x");
      setReferenceObject(["none", "helix", "sphere", "cone", "cylinder"].includes(state.referenceObject ?? "") ? state.referenceObject! : "none");
      setGraphVariables(Array.isArray(state.variables) ? state.variables.slice(0, 24) : []);
      setObjectPosition(state.objectPosition && [state.objectPosition.x, state.objectPosition.y, state.objectPosition.z].every(Number.isFinite) ? state.objectPosition : initialObjectPosition);
      setCameraPosition(Array.isArray(state.cameraPosition) && state.cameraPosition.length === 3 ? state.cameraPosition.map(Number) as [number, number, number] : [4, 3.2, 6]);
      setAnalysisPoint(state.analysisPoint && Number.isFinite(state.analysisPoint.x) && Number.isFinite(state.analysisPoint.y) ? state.analysisPoint : { x: 0, y: 0 });
      setAutoRotate(Boolean(state.autoRotate));
      if (isGraph3DThemeId(state.graphThemeId)) setGraphThemeId(state.graphThemeId);
      graphStudio.updateProject({ name: String(state.projectName ?? graphStudio.project.name).slice(0, 160), stylePreset: state.stylePreset ?? graphStudio.project.stylePreset });
      setCameraKey(value => value + 1);
    },
    validateScene: (scene) => !scene || typeof scene !== "object" || !Array.isArray((scene as { surfaces?: unknown }).surfaces) ? ["The imported file does not contain a supported 3D graph surface list."] : [],
    getImageTarget: () => document.getElementById("surface-3d-panel"),
    getSceneSummary: () => ({ objectCount: surfaces.length + (referenceObject === "none" ? 0 : 1), expressionCount: surfaces.length, description: `${surfaces.length} 3D surfaces` }),
    canMerge: false,
  };

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
      onOpenCas={() => {
        const payload = createMathWorkspacePayload({ sourceWorkspace: "graphs-3d", objectType: "surface", label: expression, value: expression });
        saveWorkspaceTransfer(payload, "cas");
        navigate("/workspace/data", { state: { mathWorkspacePayload: payload } });
      }}
      onOpenGeometry={() => {
        const payload = createMathWorkspacePayload({ sourceWorkspace: "graphs-3d", objectType: "surface", label: expression, value: expression });
        saveWorkspaceTransfer(payload, "geometry-3d");
        navigate("/workspace/3d", { state: { mathWorkspacePayload: payload } });
      }}
      surfaces={surfaces}
      selectedSurfaceId={selectedSurface.id}
      onSelectedSurfaceChange={setSelectedSurfaceId}
      onSurfaceChange={updateSurface}
      onAddExpression={() => addSurface("x^2 - y^2")}
      onDuplicateExpression={(surfaceId) => addSurface(surfaces.find((item) => item.id === surfaceId)?.expression ?? "x^2 - y^2")}
      onDeleteExpression={deleteSurface}
      onSetAllVisibility={(visible) => setSurfaces((current) => current.map((item) => ({ ...item, visible })))}
      surfaceErrors={Object.fromEntries(sampledSurfaces.map(({ item, samples }) => [item.id, samples.error]))}
      examples={examples}
      onExample={(next) => updateSurface(selectedSurface.id, { expression: next })}
      onRandomExample={tryRandom}
      variables={graphVariables}
      onVariablesChange={updateStudioVariables}
      tool={studioTool}
      onToolChange={setStudioTool}
      graphThemeId={graphThemeId}
      onGraphThemeChange={(nextTheme) => {
        setGraphThemeId(nextTheme);
        setSurfaces((current) => current.map((item) => ({ ...item, palette: "height" })));
      }}
      scene={!visibleValidSurfaces.length ? (
        <div className="flex h-full items-center justify-center bg-slate-950 p-6 text-center text-sm font-bold text-amber-200">No visible valid surface. Correct an expression or show a valid layer.</div>
      ) : (
        <ThreeSceneWrapper key={cameraKey} height="100%" mobileHeight="100%" interactionLabel="Drag to orbit - wheel/pinch zoom - shift-drag pan" cameraPosition={cameraPosition} fov={46} quality="high" chrome="cinematic" showHint={false} sceneOverlay={`radial-gradient(circle at 68% 22%, ${graphTheme.backgroundAccent}99, transparent 42%), linear-gradient(180deg, transparent, ${graphTheme.background}cc)`} sceneLabel={autoRotate && !reducedMotion ? "3D graphing - rotating" : undefined} sceneSummary={`Surface z equals ${expression}. Domain x from ${-xRange} to ${xRange}, y from ${-yRange} to ${yRange}. ${surface.grid.flat().filter((point) => point.valid).length} valid samples.`} className="h-full rounded-none border-0">
          <color attach="background" args={[graphTheme.background]} />
          <ambientLight intensity={graphThemeId === "minimal-pearl" ? 0.88 : 0.58} />
          <hemisphereLight args={[graphTheme.gradient.at(-1)?.color ?? "#ffffff", graphTheme.background, 0.72]} />
          <directionalLight position={[5, 8, 6]} intensity={graphThemeId === "arctic-glass" ? 1.65 : 1.25} color={graphTheme.gradient.at(-1)?.color} />
          <pointLight position={[-4, 2.5, -3]} intensity={0.58} color={graphTheme.gradient[0].color} />
          <group position={toScenePosition(objectPosition)}>
            {visibleValidSurfaces.map(({ item, samples }) => <group key={item.id}><SurfaceMesh samples={samples} palette={item.palette} colorLow={item.colorLow} colorHigh={item.colorHigh} wireframe={item.wireframe} opacity={item.opacity} theme={graphTheme} selected={item.id === selectedSurface.id} interactive={item.id === selectedSurface.id && studioTool !== "select"} onPick={handleSurfacePick} />{item.samplingAnimation && <SamplingSweep samples={samples} active theme={graphTheme} />}{item.showPoints && <SamplePointCloud samples={samples} color={graphTheme.point} />}</group>)}
            {showBase && <BasePlane size={Math.max(xRange, yRange) * 2.08} theme={graphTheme} />}
            {showGrid && <gridHelper args={[Math.max(xRange, yRange) * 2.2, 18, graphTheme.gridMajor, graphTheme.gridMinor]} />}
            {showAxes && <ThemeAxes scale={Math.max(xRange, yRange) * 1.25} theme={graphTheme} showLabels={showLabels} infinite={showInfiniteAxes} />}
            {showLabels && <SurfaceLabels scale={Math.max(xRange, yRange) * 1.25} expression={expression} samples={surface} objectPosition={objectPosition} theme={graphTheme} />}
            {sliceEnabled && <SlicePlane axis={sliceAxis} value={sliceX} range={Math.max(xRange, yRange)} samples={surface} color={graphTheme.crossSection} />}
            {sliceEnabled && <SliceCurve axis={sliceAxis} value={sliceX} samples={surface} color={graphTheme.crossSection} />}
            {surfaceDifferential && <SurfaceDifferentialGeometry analysis={surfaceDifferential} scale={Math.max(0.7, Math.min(xRange, yRange) * 0.22)} theme={graphTheme} />}
            <ReferenceObject kind={referenceObject} scale={Math.max(1.4, Math.min(xRange, yRange) * 0.48)} />
          </group>
          <OrbitControls enablePan enableZoom enableDamping dampingFactor={0.08} autoRotate={autoRotate && !reducedMotion} autoRotateSpeed={0.7} />
        </ThreeSceneWrapper>
      )}
      crossSectionPreview={sliceEnabled ? <CrossSectionChart axis={sliceAxis} value={sliceX} samples={surface} theme={graphTheme} /> : undefined}
      onCameraView={setCameraView}
      onResetCamera={() => setCameraView([4, 3.2, 6])}
      surface={surface}
      sampleRows={sampleRows}
      differential={surfaceDifferential}
      analysisPoint={analysisPoint}
      onAnalysisPointChange={setAnalysisPoint}
      onExactPartial={calculatePartial}
      exactPartial={exactPartial}
      onUsePartialSurface={() => { if (exactPartial) addSurface(exactPartial); }}
      xRange={xRange}
      yRange={yRange}
      resolution={resolution}
      objectPosition={objectPosition}
      referenceObject={referenceObject}
      onXRangeChange={setXRange}
      onYRangeChange={setYRange}
      onResolutionChange={setResolution}
      onObjectPositionChange={setObjectPosition}
      onReferenceObjectChange={setReferenceObject}
      showGrid={showGrid}
      showAxes={showAxes}
      showInfiniteAxes={showInfiniteAxes}
      showLabels={showLabels}
      showBase={showBase}
      autoRotate={autoRotate}
      sliceEnabled={sliceEnabled}
      sliceAxis={sliceAxis}
      sliceValue={sliceX}
      onShowGridChange={setShowGrid}
      onShowAxesChange={setShowAxes}
      onShowInfiniteAxesChange={setShowInfiniteAxes}
      onShowLabelsChange={setShowLabels}
      onShowBaseChange={setShowBase}
      onAutoRotateChange={setAutoRotate}
      onSliceEnabledChange={setSliceEnabled}
      onSliceAxisChange={setSliceAxis}
      onSliceValueChange={setSliceX}
      stylePreset={graphStudio.project.stylePreset}
      onStylePresetChange={(stylePreset) => graphStudio.updateProject({ stylePreset })}
      savedLibrary={<Saved3DGraphList saved={savedGraphs} onLoad={loadSavedGraph} onDelete={removeSavedGraph} />}
      shareControl={<ShareExportControl adapter={portableAdapter} className="portable-share-inline" />}
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
    void navigator.clipboard?.writeText(`z = ${selectedSurface.expression}`);
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
    updateSurface(selectedSurface.id, { expression: preset.expression, palette: preset.palette, wireframe: ["contour", "mono"].includes(preset.palette), showPoints: false });
    setXRange(preset.xRange);
    setYRange(preset.yRange);
    setResolution(preset.resolution);
    setShowBase(true);
    setShowGrid(true);
    setShowAxes(true);
    setShowInfiniteAxes(false);
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
      state: graphStudioState,
    };
    setSavedGraphs(saveGraphWorkspace(GRAPH_3D_STORAGE_KEY, workspace));
  }

  function loadSavedGraph(workspace: SavedGraphWorkspace<Graph3DWorkspaceState>) {
    const state = workspace.state;
    const nextSurfaces = migrateGraph3DSurfaces(state);
    setSurfaces(nextSurfaces);
    setSelectedSurfaceId(nextSurfaces.some((item) => item.id === state.selectedSurfaceId) ? state.selectedSurfaceId : nextSurfaces[0].id);
    setXRange(state.xRange);
    setYRange(state.yRange);
    setResolution(state.resolution);
    setShowGrid(state.showGrid);
    setShowAxes(state.showAxes);
    setShowInfiniteAxes(Boolean(state.showInfiniteAxes));
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

  function updateSurface(surfaceId: string, patch: Partial<Graph3DSurface>) {
    setSurfaces((current) => current.map((item) => item.id === surfaceId ? { ...item, ...patch } : item));
  }

  function addSurface(nextExpression: string) {
    const next = createGraph3DSurface(nextExpression, surfaces.length);
    setSurfaces((current) => [...current, next]);
    setSelectedSurfaceId(next.id);
  }

  function deleteSurface(surfaceId: string) {
    setSurfaces((current) => {
      if (current.length === 1) return current;
      const index = current.findIndex((item) => item.id === surfaceId);
      const next = current.filter((item) => item.id !== surfaceId);
      if (surfaceId === selectedSurfaceId) setSelectedSurfaceId(next[Math.min(Math.max(index, 0), next.length - 1)].id);
      return next;
    });
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
            <span className="block truncate text-xs text-slate-500">{migrateGraph3DSurfaces(workspace.state).length} surfaces · z = {migrateGraph3DSurfaces(workspace.state)[0].expression}</span>
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

function SurfaceMesh({ samples, palette, colorLow, colorHigh, wireframe, opacity, theme, selected, interactive = false, onPick }: { samples: SurfaceSampleResult; palette: SurfacePalette; colorLow: string; colorHigh: string; wireframe: boolean; opacity: number; theme: Graph3DTheme; selected: boolean; interactive?: boolean; onPick?: (point: THREE.Vector3) => void }) {
  const [hovered, setHovered] = useState(false);
  const geometry = useMemo(() => {
    const data = generateSurfaceMeshData(samples);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(data.positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colorSurface(data.positions, samples, palette, colorLow, colorHigh, theme), 3));
    geom.setIndex(data.indices);
    geom.computeVertexNormals();
    return geom;
  }, [colorHigh, colorLow, palette, samples, theme]);

  if (samples.error || !samples.grid.length) return null;
  return (
    <group>
      <mesh
        geometry={geometry}
        scale={[1, verticalScale(samples), 1]}
        castShadow
        receiveShadow
        onClick={interactive ? (event) => { event.stopPropagation(); onPick?.(event.point.clone()); } : undefined}
        onPointerOver={() => { setHovered(true); if (interactive) document.body.style.cursor = "crosshair"; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ""; }}
      >
        <meshPhysicalMaterial vertexColors side={THREE.DoubleSide} roughness={theme.roughness} metalness={theme.metalness} transmission={theme.id === "arctic-glass" ? 0.2 : 0} clearcoat={theme.id === "minimal-pearl" || theme.id === "arctic-glass" ? 0.55 : 0.2} clearcoatRoughness={0.36} emissive={hovered ? theme.hover : selected ? theme.selection : theme.emissive} emissiveIntensity={hovered ? 0.24 : selected ? theme.emissiveIntensity * 0.72 : theme.emissiveIntensity} transparent opacity={Math.min(1, opacity * theme.surfaceOpacity)} depthWrite={opacity * theme.surfaceOpacity > 0.72} />
      </mesh>
      <mesh geometry={geometry} scale={[1.001, verticalScale(samples) * 1.001, 1.001]}>
        <meshBasicMaterial color={selected ? theme.selection : theme.mesh} wireframe transparent opacity={wireframe ? Math.min(.62, theme.meshOpacity * 2.8) : theme.meshOpacity} depthWrite={false} />
      </mesh>
    </group>
  );
}

function SlicePlane({ axis, value, range, samples, color }: { axis: SliceAxis; value: number; range: number; samples: SurfaceSampleResult; color: string }) {
  const height = Math.max(2, Math.abs(samples.minZ ?? -1), Math.abs(samples.maxZ ?? 1)) * verticalScale(samples) * 2.2;
  const position: [number, number, number] = axis === "x" ? [value, height * 0.08, 0] : axis === "y" ? [0, height * 0.08, value] : [0, value * verticalScale(samples), 0];
  const rotation: [number, number, number] = axis === "x" ? [0, Math.PI / 2, 0] : axis === "y" ? [0, 0, 0] : [-Math.PI / 2, 0, 0];
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={axis === "z" ? [range * 2.1, range * 2.1] : [range * 2.1, height]} />
      <meshBasicMaterial color={color} transparent opacity={0.17} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function SliceCurve({ axis, value, samples, color }: { axis: SliceAxis; value: number; samples: SurfaceSampleResult; color: string }) {
  const points = useMemo(() => crossSectionPoints(samples, axis, value), [axis, samples, value]);
  const scenePoints = points.map((point) => axis === "x"
    ? new THREE.Vector3(value, point.v * verticalScale(samples), point.u)
    : axis === "y"
      ? new THREE.Vector3(point.u, point.v * verticalScale(samples), value)
      : new THREE.Vector3(point.u, value * verticalScale(samples), point.v));
  if (scenePoints.length < 2) return null;
  if (axis === "z") return <group>{scenePoints.slice(0, 180).map((point, index) => <mesh key={`${index}-${point.x}-${point.z}`} position={point}><sphereGeometry args={[0.035, 8, 8]} /><meshBasicMaterial color={color} /></mesh>)}</group>;
  return <Line points={scenePoints} color={color} lineWidth={4} />;
}

function CrossSectionChart({ axis, value, samples, theme }: { axis: SliceAxis; value: number; samples: SurfaceSampleResult; theme: Graph3DTheme }) {
  const points = crossSectionPoints(samples, axis, value);
  if (points.length < 2) return null;
  const width = 720;
  const height = 180;
  const minU = Math.min(...points.map((point) => point.u));
  const maxU = Math.max(...points.map((point) => point.u));
  const minV = Math.min(...points.map((point) => point.v));
  const maxV = Math.max(...points.map((point) => point.v));
  const project = (point: { u: number; v: number }) => `${20 + ((point.u - minU) / Math.max(1e-8, maxU - minU)) * (width - 40)},${height - 20 - ((point.v - minV) / Math.max(1e-8, maxV - minV)) * (height - 40)}`;
  return <section className="mb-3 rounded-lg border p-3 text-white" style={{ background: theme.background, borderColor: `${theme.crossSection}66` }} aria-label={`Live ${axis} cross-section`}>
    <div className="mb-2 flex items-center justify-between gap-2"><strong className="text-sm">Live 2D cross-section</strong><code className="text-xs" style={{ color: theme.crossSection }}>{axis} = {format(value)}</code></div>
    <svg viewBox={`0 0 ${width} ${height}`} className="h-44 w-full" role="img" aria-label={`Approximate cross-section at ${axis} equals ${format(value)}`}>
      <rect width={width} height={height} fill={theme.background} />
      <path d={`M20 ${height - 20}H${width - 20} M20 20V${height - 20}`} stroke={theme.gridMajor} />
      {axis === "z" ? points.slice(0, 220).map((point, index) => { const [cx, cy] = project(point).split(","); return <circle key={`${index}-${cx}-${cy}`} cx={cx} cy={cy} r="2.5" fill={theme.contour} />; }) : <polyline points={points.map(project).join(" ")} fill="none" stroke={theme.crossSection} strokeWidth="3" />}
    </svg>
    <p className="mt-2 text-xs text-slate-400">Numerically sampled intersection. Values are approximate.</p>
  </section>;
}

function SurfaceDifferentialGeometry({ analysis, scale, theme }: { analysis: SurfaceDifferential; scale: number; theme: Graph3DTheme }) {
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
    <mesh geometry={geometry}><meshStandardMaterial color={theme.crossSection} transparent opacity={0.26} side={THREE.DoubleSide} /></mesh>
    <Line points={[[x, z, y], normalEnd]} color={theme.axes[2]} lineWidth={4} />
    <Line points={[[x, z, y], gradientEnd]} color={theme.axes[0]} lineWidth={4} />
    <mesh position={[x, z, y]}><sphereGeometry args={[scale * 0.09, 18, 18]} /><meshStandardMaterial color={theme.point} emissive={theme.selection} emissiveIntensity={0.28} /></mesh>
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

function BasePlane({ size, theme }: { size: number; theme: Graph3DTheme }) {
  return (
    <mesh position={[0, -0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[size, size, 1, 1]} />
      <meshBasicMaterial color={theme.backgroundAccent} transparent opacity={0.24} side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  );
}

function SamplingSweep({ samples, active, theme }: { samples: SurfaceSampleResult; active: boolean; theme: Graph3DTheme }) {
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
          <meshBasicMaterial color={theme.crossSection} transparent opacity={0.16} depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <boxGeometry args={[0.07, 0.08, Math.max(0.1, yMax - yMin)]} />
          <meshBasicMaterial color={theme.crossSection} transparent opacity={0.7} />
        </mesh>
        <TextSprite text="sampling sweep" position={[0, zSpan * 1.35, yMax + 0.32]} color={theme.crossSection} width={1.3} />
      </group>
      <mesh ref={markerRef}>
        <sphereGeometry args={[0.09, 18, 18]} />
        <meshStandardMaterial color={theme.point} emissive={theme.crossSection} emissiveIntensity={0.85} />
      </mesh>
    </group>
  );
}

function colorSurface(positions: number[], samples: SurfaceSampleResult, palette: SurfacePalette, colorLow: string, colorHigh: string, theme: Graph3DTheme) {
  const minZ = samples.minZ ?? -1;
  const maxZ = samples.maxZ ?? 1;
  const span = Math.max(1e-8, maxZ - minZ);
  const color = new THREE.Color();
  const colors: number[] = [];
  for (let index = 1; index < positions.length; index += 3) {
    const ratio = Math.max(0, Math.min(1, (positions[index] - minZ) / span));
    if (palette === "custom") color.copy(new THREE.Color(colorLow)).lerp(new THREE.Color(colorHigh), ratio);
    else if (palette === "thermal") applyGradient(color, getGraph3DTheme("thermal-spectrum").gradient, ratio);
    else if (palette === "contour") applyGradient(color, theme.gradient, Math.floor(ratio * 8) / 8);
    else if (palette === "mono") applyGradient(color, getGraph3DTheme("minimal-pearl").gradient, ratio);
    else applyGradient(color, theme.gradient, ratio);
    colors.push(color.r, color.g, color.b);
  }
  return colors;
}

function applyGradient(color: THREE.Color, stops: Graph3DTheme["gradient"], ratio: number) {
  const upperIndex = Math.max(1, stops.findIndex((stop) => ratio <= stop.at));
  const lower = stops[Math.min(upperIndex - 1, stops.length - 1)];
  const upper = stops[Math.min(upperIndex, stops.length - 1)];
  const localRatio = (ratio - lower.at) / Math.max(1e-8, upper.at - lower.at);
  color.copy(new THREE.Color(lower.color)).lerp(new THREE.Color(upper.color), Math.max(0, Math.min(1, localRatio)));
}

function ThemeAxes({ scale, theme, showLabels, infinite }: { scale: number; theme: Graph3DTheme; showLabels: boolean; infinite: boolean }) {
  const axisScale = infinite ? Math.max(48, scale * 8) : scale;
  const start = infinite ? -axisScale : 0;
  const lineWidth = infinite ? 3 : 2;
  return <group>
    <Line points={[[start, 0.012, 0], [axisScale, 0.012, 0]]} color={theme.axes[0]} lineWidth={lineWidth} />
    <Line points={[[0, 0.012, start], [0, 0.012, axisScale]]} color={theme.axes[1]} lineWidth={lineWidth} />
    <Line points={[[0, start, 0], [0, axisScale, 0]]} color={theme.axes[2]} lineWidth={lineWidth} />
    {infinite && <InfiniteAxisCaps scale={axisScale} theme={theme} />}
    {showLabels && <><TextSprite text="x" position={[axisScale, 0, 0]} color={theme.axes[0]} /><TextSprite text="y" position={[0, 0, axisScale]} color={theme.axes[1]} /><TextSprite text="z" position={[0, axisScale, 0]} color={theme.axes[2]} /></>}
  </group>;
}

function InfiniteAxisCaps({ scale, theme }: { scale: number; theme: Graph3DTheme }) {
  const radius = Math.max(0.08, scale * 0.006);
  const length = Math.max(0.24, scale * 0.026);
  const cap = (key: string, position: [number, number, number], color: string, rotation: [number, number, number]) => (
    <mesh key={key} position={position} rotation={rotation}>
      <coneGeometry args={[radius, length, 18]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
    </mesh>
  );
  return <group>
    {cap("x-plus", [scale, 0.012, 0], theme.axes[0], [0, 0, -Math.PI / 2])}
    {cap("x-minus", [-scale, 0.012, 0], theme.axes[0], [0, 0, Math.PI / 2])}
    {cap("y-plus", [0, 0.012, scale], theme.axes[1], [Math.PI / 2, 0, 0])}
    {cap("y-minus", [0, 0.012, -scale], theme.axes[1], [-Math.PI / 2, 0, 0])}
    {cap("z-plus", [0, scale, 0], theme.axes[2], [0, 0, 0])}
    {cap("z-minus", [0, -scale, 0], theme.axes[2], [Math.PI, 0, 0])}
  </group>;
}

function SamplePointCloud({ samples, color }: { samples: SurfaceSampleResult; color: string }) {
  const points = samples.grid.flatMap((row, rowIndex) => row.filter((point, colIndex) => point.valid && point.z !== null && rowIndex % 5 === 0 && colIndex % 5 === 0));
  return (
    <group>
      {points.map((point) => (
        <mesh key={`${point.x}-${point.y}`} position={[point.x, (point.z ?? 0) * verticalScale(samples), point.y]}>
          <sphereGeometry args={[0.035, 10, 10]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.28} />
        </mesh>
      ))}
    </group>
  );
}

function SurfaceLabels({ scale, expression, samples, objectPosition, theme }: { scale: number; expression: string; samples: SurfaceSampleResult; objectPosition: ObjectPosition; theme: Graph3DTheme }) {
  const slope = estimateCenterSlope(samples);
  const moved = objectPosition.x !== 0 || objectPosition.y !== 0 || objectPosition.z !== 0;
  return (
    <group>
      <SceneText text={`z = ${expression}`} position={[-scale * 0.72, scale * 0.5, -scale * 0.72]} color={theme.point} size={0.2} />
      <SceneText text={moved ? `surface origin (${format(objectPosition.x)}, ${format(objectPosition.y)}, ${format(objectPosition.z)})` : "origin (0, 0, 0)"} position={[0.28, 0.18, 0.28]} color="#f8fafc" size={0.14} />
      <SceneText text="color = height z" position={[scale * 0.58, scale * 0.18, -scale * 0.64]} color={theme.crossSection} size={0.17} />
      <SceneText text={`slope |grad z| ~= ${format(slope)}`} position={[scale * 0.35, scale * 0.44, scale * 0.62]} color={theme.axes[1]} size={0.16} />
      <SceneText text={`min z ${format(samples.minZ ?? 0)} / max z ${format(samples.maxZ ?? 0)}`} position={[-scale * 0.6, -0.28, scale * 0.68]} color={theme.mesh} size={0.16} />
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
  return <TextSprite text={text} position={position} color={color} width={Math.max(0.8, Math.min(3.4, text.length * size * 0.32))} />;
}

function TextSprite({ text, position, color, width = 0.5 }: { text: string; position: [number, number, number]; color: string; width?: number }) {
  const canvas = useMemo(() => {
    const element = document.createElement("canvas");
    element.width = 512;
    element.height = 64;
    const ctx = element.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, element.width, element.height);
      ctx.fillStyle = color;
      ctx.font = "700 32px system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, element.width / 2, element.height / 2, element.width - 12);
    }
    return element;
  }, [color, text]);
  const texture = useMemo(() => new THREE.CanvasTexture(canvas), [canvas]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <sprite position={position} scale={[width, Math.max(.16, width / 8), 1]}><spriteMaterial map={texture} transparent depthTest={false} /></sprite>;
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

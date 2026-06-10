import { Award, Box, Camera, Circle, Cuboid, Download, Eye, Heart, Maximize2, Mic, Minimize2, Pause, Play, Printer, RefreshCw, RotateCcw, RotateCw, Search, Shapes, Sparkles, Star, Trash2, Triangle, Volume2, Wand2, ZoomIn, ZoomOut } from "lucide-react";
import { ContactShadows, OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as THREE from "three";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import FormulaBlock from "../components/ui/FormulaBlock";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import { useProgress } from "../hooks/useProgress";
import { roundTo } from "../utils/math";

type ShapeKind = "2d" | "3d";
type ShapeCategory = "2D Basic" | "2D Curved" | "2D Polygons" | "3D Solids" | "3D Curved Solids";
type ShapeId =
  | "circle" | "semicircle" | "sector" | "ellipse" | "triangle" | "right-triangle" | "square" | "rectangle"
  | "parallelogram" | "rhombus" | "trapezium" | "kite" | "regular-polygon"
  | "cube" | "cuboid" | "sphere" | "hemisphere" | "cylinder" | "cone" | "frustum" | "square-pyramid" | "triangular-prism" | "torus";

type ShapeDefinition = {
  id: ShapeId;
  name: string;
  kind: ShapeKind;
  category: ShapeCategory;
  formula: string;
  description: string;
  dimensions: string[];
  use: string;
};

type Metrics = Record<string, number>;
type SavedShapeSize = {
  id: string;
  name: string;
  shapeId: ShapeId;
  a: number;
  b: number;
  c: number;
  sides: number;
  angle: number;
};

const shapes: ShapeDefinition[] = [
  { id: "circle", name: "Circle", kind: "2d", category: "2D Curved", formula: "C = 2 pi r, A = pi r^2", description: "All points at a fixed distance from the center.", dimensions: ["radius"], use: "Wheels, clocks, lenses, gears." },
  { id: "semicircle", name: "Semicircle", kind: "2d", category: "2D Curved", formula: "Arc = pi r, A = 1/2 pi r^2", description: "Half of a circle split by a diameter.", dimensions: ["radius"], use: "Arches, windows, half-pipe profiles." },
  { id: "sector", name: "Sector", kind: "2d", category: "2D Curved", formula: "A = theta/360 pi r^2, L = theta/360 2 pi r", description: "A slice of a circle controlled by central angle.", dimensions: ["radius", "angle"], use: "Pie charts, clock angles, circular tracks." },
  { id: "ellipse", name: "Ellipse", kind: "2d", category: "2D Curved", formula: "A = pi ab", description: "A stretched circle with semi-major and semi-minor axes.", dimensions: ["width", "height"], use: "Orbits, lenses, design curves." },
  { id: "triangle", name: "Triangle", kind: "2d", category: "2D Basic", formula: "A = 1/2 bh, P = a + b + c", description: "A three-sided polygon, the base unit of many meshes.", dimensions: ["base", "height"], use: "Trusses, roofs, triangulation, game meshes." },
  { id: "right-triangle", name: "Right Triangle", kind: "2d", category: "2D Basic", formula: "A = 1/2 ab, c = sqrt(a^2 + b^2)", description: "A triangle with one 90 degree angle.", dimensions: ["base", "height"], use: "Slopes, ramps, navigation, trigonometry." },
  { id: "square", name: "Square", kind: "2d", category: "2D Basic", formula: "A = s^2, P = 4s, d = s sqrt(2)", description: "Four equal sides and four right angles.", dimensions: ["side"], use: "Tiles, grids, pixels, floor plans." },
  { id: "rectangle", name: "Rectangle", kind: "2d", category: "2D Basic", formula: "A = lw, P = 2(l+w)", description: "Opposite sides equal, all angles right angles.", dimensions: ["length", "width"], use: "Screens, rooms, pages, dashboards." },
  { id: "parallelogram", name: "Parallelogram", kind: "2d", category: "2D Polygons", formula: "A = bh, P = 2(a+b)", description: "Opposite sides are parallel and equal.", dimensions: ["base", "height", "side"], use: "Vector addition, tiling, force diagrams." },
  { id: "rhombus", name: "Rhombus", kind: "2d", category: "2D Polygons", formula: "A = d1 d2 / 2, P = 4s", description: "A parallelogram with four equal sides.", dimensions: ["diagonal 1", "diagonal 2"], use: "Patterns, crystals, lattice geometry." },
  { id: "trapezium", name: "Trapezium", kind: "2d", category: "2D Polygons", formula: "A = 1/2 (a+b)h", description: "A quadrilateral with one pair of parallel sides.", dimensions: ["base", "top", "height"], use: "Bridges, ramps, cross-sections." },
  { id: "kite", name: "Kite", kind: "2d", category: "2D Polygons", formula: "A = d1 d2 / 2", description: "Two pairs of adjacent equal sides.", dimensions: ["diagonal 1", "diagonal 2"], use: "Kites, decorative panels, symmetry studies." },
  { id: "regular-polygon", name: "Regular Polygon", kind: "2d", category: "2D Polygons", formula: "A = n s^2 / (4 tan(pi/n)), P = ns", description: "All sides and angles are equal.", dimensions: ["side", "sides"], use: "Tiling, icons, nuts and bolts, meshes." },
  { id: "cube", name: "Cube", kind: "3d", category: "3D Solids", formula: "SA = 6s^2, V = s^3", description: "A solid with six equal square faces.", dimensions: ["side"], use: "Dice, voxels, packaging, 3D grids." },
  { id: "cuboid", name: "Cuboid", kind: "3d", category: "3D Solids", formula: "SA = 2(lw+lh+wh), V = lwh", description: "A rectangular box with length, width, and height.", dimensions: ["length", "width", "height"], use: "Rooms, cartons, tanks, containers." },
  { id: "sphere", name: "Sphere", kind: "3d", category: "3D Curved Solids", formula: "SA = 4 pi r^2, V = 4/3 pi r^3", description: "All surface points are the same distance from the center.", dimensions: ["radius"], use: "Planets, balls, bubbles, atoms." },
  { id: "hemisphere", name: "Hemisphere", kind: "3d", category: "3D Curved Solids", formula: "CSA = 2 pi r^2, TSA = 3 pi r^2, V = 2/3 pi r^3", description: "Half of a sphere with a circular base.", dimensions: ["radius"], use: "Domes, bowls, observatories." },
  { id: "cylinder", name: "Cylinder", kind: "3d", category: "3D Curved Solids", formula: "SA = 2 pi r(r+h), V = pi r^2 h", description: "Two circular bases connected by a curved surface.", dimensions: ["radius", "height"], use: "Cans, pipes, tanks, pistons." },
  { id: "cone", name: "Cone", kind: "3d", category: "3D Curved Solids", formula: "SA = pi r(r+l), V = 1/3 pi r^2 h", description: "A circular base tapering to one point.", dimensions: ["radius", "height"], use: "Funnels, traffic cones, nozzles." },
  { id: "frustum", name: "Frustum", kind: "3d", category: "3D Curved Solids", formula: "V = 1/3 pi h(R^2 + Rr + r^2)", description: "A cone with its top cut off parallel to the base.", dimensions: ["radius", "top radius", "height"], use: "Buckets, lampshades, tapered columns." },
  { id: "square-pyramid", name: "Square Pyramid", kind: "3d", category: "3D Solids", formula: "V = 1/3 s^2 h", description: "A square base rising to one apex.", dimensions: ["side", "height"], use: "Pyramids, roofs, monuments." },
  { id: "triangular-prism", name: "Triangular Prism", kind: "3d", category: "3D Solids", formula: "V = 1/2 bhL", description: "A triangular face extruded through a length.", dimensions: ["base", "height", "length"], use: "Roof forms, wedges, optical prisms." },
  { id: "torus", name: "Torus", kind: "3d", category: "3D Curved Solids", formula: "SA = 4 pi^2 Rr, V = 2 pi^2 Rr^2", description: "A doughnut-shaped solid with major and minor radii.", dimensions: ["major radius", "minor radius"], use: "Tires, O-rings, magnetic coils." },
];

const categories = ["All", "2D Basic", "2D Curved", "2D Polygons", "3D Solids", "3D Curved Solids"] as const;
const savedShapeStorageKey = "math-universe-saved-shape-sizes";
const shapeCategoryTree = [
  { title: "2D Shapes", categories: ["2D Basic", "2D Curved", "2D Polygons"] as ShapeCategory[] },
  { title: "3D Shapes", categories: ["3D Solids", "3D Curved Solids"] as ShapeCategory[] },
];

export default function ShapesExplorer() {
  const { markTopicVisited, markTopicInteracted } = useProgress();
  const [searchParams] = useSearchParams();
  const shapeParam = searchParams.get("shape");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selectedId, setSelectedId] = useState<ShapeId>(() => parseShapeId(shapeParam) ?? "circle");
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const [c, setC] = useState(5);
  const [sides, setSides] = useState(6);
  const [angle, setAngle] = useState(90);
  const [wireframe, setWireframe] = useState(false);
  const [show3DBase, setShow3DBase] = useState(true);
  const [show3DCoordinates, setShow3DCoordinates] = useState(true);
  const [show3DLabels, setShow3DLabels] = useState(true);
  const [viewZoom, setViewZoom] = useState(1);
  const [viewRotation, setViewRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [studioOpen, setStudioOpen] = useState(false);
  const [savedShapes, setSavedShapes] = useState<SavedShapeSize[]>(() => loadSavedShapeSizes());
  const [activeSavedShapeId, setActiveSavedShapeId] = useState<string | null>(null);
  const [savedShapeName, setSavedShapeName] = useState("My shape");

  useEffect(() => markTopicVisited("shapes"), [markTopicVisited]);
  useEffect(() => {
    const nextShapeId = parseShapeId(shapeParam);
    if (!nextShapeId) return;
    setSelectedId(nextShapeId);
    setCategory(shapes.find((shape) => shape.id === nextShapeId)?.category ?? "All");
  }, [shapeParam]);
  useEffect(() => {
    localStorage.setItem(savedShapeStorageKey, JSON.stringify(savedShapes));
  }, [savedShapes]);

  const selected = shapes.find((shape) => shape.id === selectedId) ?? shapes[0];
  const groupedShapes = useMemo(() => {
    const groups = new Map<ShapeCategory, ShapeDefinition[]>();
    shapes.forEach((shape) => groups.set(shape.category, [...(groups.get(shape.category) ?? []), shape]));
    return groups;
  }, []);
  const savedForSelectedShape = useMemo(() => savedShapes.filter((shape) => shape.shapeId === selected.id), [savedShapes, selected.id]);
  const metrics = getMetrics(selected.id, a, b, c, sides, angle);

  const selectShape = (shape: ShapeDefinition) => {
    setSelectedId(shape.id);
    setViewZoom(1);
    setViewRotation(0);
    markTopicInteracted("shapes");
  };

  const zoomIn = () => setViewZoom((value) => Math.min(2, roundTo(value + 0.1, 2)));
  const zoomOut = () => setViewZoom((value) => Math.max(0.55, roundTo(value - 0.1, 2)));
  const rotateLeft = () => setViewRotation((value) => value - 15);
  const rotateRight = () => setViewRotation((value) => value + 15);
  const resetView = () => {
    setViewZoom(1);
    setViewRotation(0);
    setAutoRotate(true);
  };
  const currentSavedShape = () => ({
    name: savedShapeName.trim() || `${selected.name} ${savedForSelectedShape.length + 1}`,
    shapeId: selected.id,
    a,
    b,
    c,
    sides,
    angle,
  });
  const addSavedShape = () => {
    const shape = currentSavedShape();
    const item: SavedShapeSize = { ...shape, id: `saved-${Date.now()}` };
    setSavedShapes((items) => [item, ...items]);
    setActiveSavedShapeId(item.id);
    setSavedShapeName(item.name);
  };
  const updateSavedShape = () => {
    if (!activeSavedShapeId) return;
    const next = currentSavedShape();
    setSavedShapes((items) => items.map((item) => item.id === activeSavedShapeId ? { ...item, ...next } : item));
  };
  const applySavedShape = (item: SavedShapeSize) => {
    setSelectedId(item.shapeId);
    setA(item.a);
    setB(item.b);
    setC(item.c);
    setSides(item.sides);
    setAngle(item.angle);
    setSavedShapeName(item.name);
    setActiveSavedShapeId(item.id);
    setViewZoom(1);
    setViewRotation(0);
  };
  const removeSavedShape = (id: string) => {
    setSavedShapes((items) => items.filter((item) => item.id !== id));
    if (activeSavedShapeId === id) setActiveSavedShapeId(null);
  };

  return (
    <div className="space-y-3" onPointerDown={() => markTopicInteracted("shapes")}>
      <TopicHeader
        title="2D and 3D Shapes Explorer"
        subtitle="Explore common plane figures and solid shapes visually with formulas, dimensions, surface area, volume, perimeter, and real-world uses."
        difficulty="Foundational"
        estimatedMinutes={35}
      />
      <button type="button" className="tool-button w-fit" onClick={() => setStudioOpen((value) => !value)}>
        {studioOpen ? "Hide Kids Studio" : "Open Kids Studio"}
      </button>
      {studioOpen && <KidsShapeStudio shapes={shapes} selected={selected} onSelect={selectShape} />}

      <SectionCard title="Shape Explorer" description={`${shapes.length} shapes in a compact nested menu. Select any shape to update the live visualization immediately.`} compact>
        <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
          <ShapeNavigationMenu
            groupedShapes={groupedShapes}
            category={category}
            selected={selected}
            onCategory={setCategory}
            onSelect={selectShape}
          />
          <div className="min-w-0 space-y-3">
            <div className="flex flex-col gap-3 rounded-2xl border border-cyan-300/30 bg-slate-950 p-4 text-white md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase tracking-wide text-cyan-200">{selected.category}</p>
                <h2 className="mt-1 text-2xl font-black">{selected.name}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">{selected.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold sm:min-w-72">
                <span className="rounded-xl bg-white/10 p-2">{selected.kind === "2d" ? "Plane shape" : "Solid shape"}</span>
                <span className="rounded-xl bg-white/10 p-2">{selected.dimensions.length} dimension{selected.dimensions.length === 1 ? "" : "s"}</span>
                <span className="col-span-2 rounded-xl bg-white/10 p-2 font-mono">{selected.formula}</span>
              </div>
            </div>
            <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
          <div className="scroll-panel space-y-3 xl:max-h-[calc(100vh-12rem)]">
            <FormulaBlock title={`${selected.name} Formulas`} formula={selected.formula} />
            <div className="rounded-xl bg-cyan-50 p-3 text-sm leading-5 text-slate-700 dark:bg-cyan-400/10 dark:text-cyan-50">
              <p className="font-bold">Visual formula guide</p>
              <p className="mt-2">{formulaExplanation(selected.id, a, b, c, sides, angle)}</p>
            </div>
            <SliderControl label={primaryLabel(selected)} value={a} min={0.5} max={10} step={0.1} onChange={setA} />
            {needsSecond(selected.id) && <SliderControl label={secondLabel(selected)} value={b} min={0.5} max={10} step={0.1} onChange={setB} />}
            {needsThird(selected.id) && <SliderControl label={thirdLabel(selected)} value={c} min={0.5} max={12} step={0.1} onChange={setC} />}
            {selected.id === "regular-polygon" && <SliderControl label="Number of sides" value={sides} min={3} max={12} step={1} onChange={(value) => setSides(Math.round(value))} />}
            {selected.id === "sector" && <SliderControl label="Central angle" value={angle} min={5} max={360} step={1} onChange={setAngle} unit="deg" />}
            {selected.kind === "3d" && (
              <label className="flex items-center gap-3 rounded-xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10">
                <input type="checkbox" checked={wireframe} onChange={(event) => setWireframe(event.target.checked)} />
                Wireframe
              </label>
            )}
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold">Custom Shapes and Sizes</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Save, apply, modify, or remove shape variants.</p>
                </div>
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-bold dark:bg-white/10">{savedForSelectedShape.length}</span>
              </div>
              <label className="mt-3 block text-xs font-black uppercase text-slate-500">
                Name
                <input
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-2 text-sm font-semibold normal-case outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-900"
                  value={savedShapeName}
                  onChange={(event) => setSavedShapeName(event.target.value)}
                />
              </label>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button type="button" className="action-primary justify-center" onClick={addSavedShape}>Add current</button>
                <button type="button" className="action-secondary justify-center disabled:opacity-45" disabled={!activeSavedShapeId} onClick={updateSavedShape}>Modify selected</button>
              </div>
              <div className="thin-scrollbar mt-3 max-h-56 space-y-2 overflow-auto pr-1">
                {savedForSelectedShape.length === 0 ? (
                  <p className="rounded-xl bg-slate-100 p-3 text-xs font-semibold text-slate-500 dark:bg-white/10 dark:text-slate-400">No saved variants for {selected.name} yet.</p>
                ) : savedForSelectedShape.map((item) => (
                  <div key={item.id} className={`rounded-xl border p-3 ${activeSavedShapeId === item.id ? "border-cyan-400 bg-cyan-50 dark:bg-cyan-400/10" : "border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-white/5"}`}>
                    <div className="flex items-start justify-between gap-2">
                      <button type="button" className="min-w-0 text-left" onClick={() => applySavedShape(item)}>
                        <span className="block truncate text-sm font-bold">{item.name}</span>
                        <span className="mt-1 block text-xs font-semibold text-slate-500 dark:text-slate-400">{savedShapeSummary(item)}</span>
                      </button>
                      <button type="button" className="rounded-full bg-white p-2 text-rose-500 shadow-sm dark:bg-slate-950" onClick={() => removeSavedShape(item.id)} aria-label={`Remove ${item.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(metrics).map(([label, value]) => (
                <Metric key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <ShapeViewControls
              zoom={viewZoom}
              rotation={viewRotation}
              autoRotate={autoRotate}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onRotateLeft={rotateLeft}
              onRotateRight={rotateRight}
              onReset={resetView}
              onToggleAutoRotate={() => setAutoRotate((value) => !value)}
            />
            <div className="grid gap-3 xl:grid-cols-2">
              <FullscreenPane className="overflow-hidden rounded-2xl border border-cyan-300/30 bg-slate-950 p-3 shadow-2xl shadow-cyan-950/20" title="2D pane">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-cyan-200">2D pane</p>
                    <p className="text-sm text-slate-300">{selected.kind === "2d" ? "Exact plane figure with live dimensions." : "Projection, net, or cross-section view."}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">{selected.kind === "2d" ? "Flat geometry" : "2D projection"}</span>
                </div>
                <ShapeSvg shape={selected.id} a={a} b={b} c={c} sides={sides} angle={angle} zoom={viewZoom} rotation={viewRotation} cinematic />
              </FullscreenPane>

              <FullscreenPane className="overflow-hidden rounded-2xl border border-violet-300/25 bg-slate-950 p-3 shadow-2xl shadow-violet-950/20" title="3D pane">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-violet-200">3D pane</p>
                    <p className="text-sm text-slate-300">{selected.kind === "2d" ? "Real beveled extrusion from the 2D outline." : "True interactive solid with depth and shadows."}</p>
                  </div>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white">{selected.kind === "2d" ? "Extruded 3D" : "Solid model"}</span>
                </div>
                <div className="mb-2 flex flex-wrap gap-2">
                  <button type="button" className={autoRotate ? "action-primary" : "tool-button"} onClick={() => setAutoRotate((value) => !value)}>
                    {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {autoRotate ? "Pause rotation" : "Start rotation"}
                  </button>
                  <ShapeSceneCheckbox label="Base" checked={show3DBase} onChange={setShow3DBase} />
                  <ShapeSceneCheckbox label="Coordinates" checked={show3DCoordinates} onChange={setShow3DCoordinates} />
                  <ShapeSceneCheckbox label="Labels" checked={show3DLabels} onChange={setShow3DLabels} />
                </div>
                <ThreeSceneWrapper chrome="cinematic" sceneLabel={`${selected.name} - ${autoRotate ? "rotating" : "paused"}`} height="520px" mobileHeight="min(68vh, 390px)" interactionLabel="Drag rotate - pinch zoom" cameraPosition={[4.4, 3.4, 6.2]} fov={43} quality="high">
                <ambientLight intensity={0.48} />
                <directionalLight position={[4, 6, 5]} intensity={1.85} castShadow />
                <pointLight position={[-3.5, 2.4, 2.5]} intensity={1.1} color="#8b5cf6" />
                <pointLight position={[2.8, -1, -3.5]} intensity={0.65} color="#22d3ee" />
                <RotatingSolid shape={selected.id} a={a} b={b} c={c} sides={sides} angle={angle} wireframe={wireframe} zoom={viewZoom} rotation={viewRotation} autoRotate={autoRotate} showLabels={show3DLabels} />
                {show3DBase && <ContactShadows position={[0, -3, 0]} opacity={0.38} scale={8} blur={2.4} far={7} />}
                {show3DBase && <gridHelper args={[8, 16, "#38bdf8", "#334155"]} position={[0, -3.02, 0]} />}
                {show3DCoordinates && <axesHelper args={[3.4]} />}
                {show3DCoordinates && <ShapeCoordinateLabels />}
                <OrbitControls enablePan={false} enableZoom enableDamping autoRotate={autoRotate} autoRotateSpeed={0.7} />
                </ThreeSceneWrapper>
              </FullscreenPane>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <InfoTile label="Dimensions" value={selected.dimensions.join(", ")} />
              <InfoTile label="Current symbols" value={symbolSummary(selected.id, a, b, c, sides, angle)} />
              <InfoTile label="Type" value={selected.kind === "2d" ? "Plane shape" : "Solid shape"} />
              <InfoTile label="Used in" value={selected.use} />
            </div>
          </div>
        </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}

function parseShapeId(value: string | null): ShapeId | null {
  return shapes.some((shape) => shape.id === value) ? value as ShapeId : null;
}

function FullscreenPane({ children, className, title }: { children: ReactNode; className: string; title: string }) {
  const paneRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => setFullscreen(document.fullscreenElement === paneRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    if (!paneRef.current) return;
    if (fullscreen) {
      if (document.fullscreenElement === paneRef.current) await document.exitFullscreen();
      setFullscreen(false);
      return;
    }
    setFullscreen(true);
    try {
      await paneRef.current.requestFullscreen();
    } catch {
      setFullscreen(true);
    }
  }

  return (
    <div ref={paneRef} className={`${className} relative ${fullscreen ? "h-screen w-screen rounded-none p-4" : ""}`}>
      <button
        type="button"
        className="absolute right-4 top-4 z-20 rounded-full bg-white/90 p-2 text-slate-950 shadow-lg transition hover:bg-cyan-100 dark:bg-slate-900/90 dark:text-white dark:hover:bg-slate-800"
        onClick={toggleFullscreen}
        title={fullscreen ? `Exit full screen for ${title}` : `Open ${title} full screen`}
        aria-label={fullscreen ? `Exit full screen for ${title}` : `Open ${title} full screen`}
      >
        {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>
      {children}
    </div>
  );
}

function ShapeNavigationMenu({
  groupedShapes,
  category,
  selected,
  onCategory,
  onSelect,
}: {
  groupedShapes: Map<ShapeCategory, ShapeDefinition[]>;
  category: (typeof categories)[number];
  selected: ShapeDefinition;
  onCategory: (category: (typeof categories)[number]) => void;
  onSelect: (shape: ShapeDefinition) => void;
}) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/60 xl:sticky xl:top-24 xl:self-start">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-black uppercase text-cyan-600 dark:text-cyan-300">Main menu</p>
          <h3 className="text-sm font-black">Shapes</h3>
        </div>
        <button
          type="button"
          onClick={() => onCategory("All")}
          className={`rounded-full px-3 py-1.5 text-xs font-black ${category === "All" ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`}
        >
          All
        </button>
      </div>
      <div className="mt-3 space-y-3">
        {shapeCategoryTree.map((group) => (
          <div key={group.title} className="rounded-xl bg-slate-100 p-2 dark:bg-white/10">
            <p className="px-2 py-1 text-[11px] font-black uppercase text-slate-500 dark:text-slate-400">{group.title}</p>
            <div className="space-y-2">
              {group.categories.map((item) => {
                const items = groupedShapes.get(item) ?? [];
                const activeCategory = category === item;
                return (
                  <details key={item} open={activeCategory || items.some((shape) => shape.id === selected.id)} className="group rounded-lg bg-white/70 dark:bg-slate-950/45">
                    <summary
                      className={`flex cursor-pointer list-none items-center justify-between gap-2 rounded-lg px-2 py-2 text-xs font-black ${activeCategory ? "text-cyan-700 dark:text-cyan-200" : "text-slate-700 dark:text-slate-200"}`}
                      onClick={() => onCategory(item)}
                    >
                      <span>{item}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] dark:bg-white/10">{items.length}</span>
                    </summary>
                    <div className="grid gap-1 px-1 pb-2">
                      {items.map((shape) => {
                        const active = shape.id === selected.id;
                        const Icon = shape.kind === "3d" ? Box : shape.id.includes("triangle") ? Triangle : shape.id === "circle" ? Circle : Shapes;
                        return (
                          <button
                            key={shape.id}
                            type="button"
                            onClick={() => {
                              onCategory(shape.category);
                              onSelect(shape);
                            }}
                            className={`grid grid-cols-[20px_minmax(0,1fr)] items-center gap-2 rounded-lg px-2 py-2 text-left text-xs transition ${
                              active ? "bg-cyan-500 text-white shadow-sm" : "text-slate-600 hover:bg-cyan-50 hover:text-cyan-800 dark:text-slate-300 dark:hover:bg-cyan-400/10 dark:hover:text-cyan-100"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="truncate font-bold">{shape.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

type KidMode = "beginner" | "advanced";
type SortMode = "2D/3D" | "sides" | "corners" | "curved edges" | "symmetry" | "faces" | "vertices" | "edges";
type UnitName = "cm" | "m" | "in";
type StudioTab = "Play" | "Build" | "Formula" | "Teacher" | "3D";

const gradeLevels = ["Class 1-2", "Class 3-5", "Class 6-8", "Class 9-10"] as const;
const objectMatches = [
  { object: "Clock", shape: "circle" as ShapeId },
  { object: "Door", shape: "rectangle" as ShapeId },
  { object: "Dice", shape: "cube" as ShapeId },
  { object: "Ice-cream cone", shape: "cone" as ShapeId },
  { object: "Can", shape: "cylinder" as ShapeId },
  { object: "Roof wedge", shape: "triangular-prism" as ShapeId },
];
const questSteps = ["Pick safe playground tiles", "Build a slide ramp", "Choose a tunnel shape", "Paint surface area", "Share the design with teacher"];
const languageLabels = {
  English: { circle: "Circle", square: "Square", triangle: "Triangle", cube: "Cube" },
  Hindi: { circle: "वृत्त", square: "वर्ग", triangle: "त्रिभुज", cube: "घन" },
  Telugu: { circle: "వృత్తం", square: "చదరం", triangle: "త్రిభుజం", cube: "ఘనం" },
};

function KidsShapeStudio({ shapes, selected, onSelect }: { shapes: ShapeDefinition[]; selected: ShapeDefinition; onSelect: (shape: ShapeDefinition) => void }) {
  const [mode, setMode] = useState<KidMode>("beginner");
  const [grade, setGrade] = useState<(typeof gradeLevels)[number]>("Class 3-5");
  const [tab, setTab] = useState<StudioTab>("Play");
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("2D/3D");
  const [unit, setUnit] = useState<UnitName>("cm");
  const [activeFlashcard, setActiveFlashcard] = useState(0);
  const [matchObject, setMatchObject] = useState(objectMatches[0].object);
  const [matchShape, setMatchShape] = useState<ShapeId>("circle");
  const [favorites, setFavorites] = useState<ShapeId[]>([]);
  const [recent, setRecent] = useState<ShapeId[]>([selected.id]);
  const [score, setScore] = useState(0);
  const [showHints, setShowHints] = useState(true);
  const [timed, setTimed] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [surfacePaint, setSurfacePaint] = useState(35);
  const [lightAngle, setLightAngle] = useState(35);
  const [sliceLevel, setSliceLevel] = useState(50);
  const [collage, setCollage] = useState<ShapeId[]>(["circle", "triangle", "rectangle"]);
  const [customName, setCustomName] = useState("My rocket");
  const [notes, setNotes] = useState("Ask: Which dimensions changed? Why did the formula change?");

  useEffect(() => {
    setRecent((items) => [selected.id, ...items.filter((item) => item !== selected.id)].slice(0, 6));
  }, [selected.id]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    const matches = shapes.filter((shape) => !query || [shape.name, shape.category, shape.description, shape.formula, shape.use].join(" ").toLowerCase().includes(query));
    return [...matches].sort((left, right) => sortValue(left, sortMode) - sortValue(right, sortMode) || left.name.localeCompare(right.name));
  }, [search, shapes, sortMode]);

  const flashShape = shapes[activeFlashcard % shapes.length];
  const currentMatch = objectMatches.find((item) => item.object === matchObject) ?? objectMatches[0];
  const matchCorrect = currentMatch.shape === matchShape;
  const mastery = Math.min(100, Math.round((favorites.length / Math.max(1, shapes.length)) * 45 + score * 7 + recent.length * 3));
  const metrics = getMetrics(selected.id, 4, 3, 5, 6, 90);
  const unitFactor = unit === "m" ? 0.01 : unit === "in" ? 0.3937 : 1;

  const celebrate = () => {
    setScore((value) => value + 1);
    setConfetti(true);
    playTinySound();
    window.setTimeout(() => setConfetti(false), 900);
  };

  const speak = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  };

  const toggleFavorite = (shapeId: ShapeId) => setFavorites((items) => items.includes(shapeId) ? items.filter((item) => item !== shapeId) : [...items, shapeId]);
  const selectAndTrack = (shape: ShapeDefinition) => {
    onSelect(shape);
    setRecent((items) => [shape.id, ...items.filter((item) => item !== shape.id)].slice(0, 6));
  };

  const exportCard = () => downloadTextFile(`${selected.name.toLowerCase()}-formula-card.txt`, `${selected.name}\nFormula: ${selected.formula}\nSymbols: ${selected.dimensions.join(", ")}\nExample: ${selected.use}`);
  const exportShape = () => downloadTextFile(`${selected.name.toLowerCase()}-shape.svg`, simpleShapeSvg(selected));
  const exportWorksheet = () => downloadTextFile("shape-practice-worksheet.txt", worksheetText(shapes.slice(0, 10)));
  const saveCustom = () => localStorage.setItem("math-universe-custom-shape", JSON.stringify({ name: customName, shapes: collage, savedAt: new Date().toISOString() }));
  const shareActivity = () => navigator.clipboard?.writeText(`${window.location.origin}/shapes?shape=${selected.id}`);

  return (
    <SectionCard title="Kids Shape Studio" description="Story quests, games, flashcards, nets, formulas, teacher tools, and 3D explorations built around the same shape engine.">
      {confetti && <div className="pointer-events-none fixed inset-x-0 top-16 z-50 mx-auto w-fit rounded-full bg-amber-300 px-5 py-3 text-sm font-black text-slate-950 shadow-xl">Great shape thinking!</div>}
      <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-950 p-4 text-white">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-2xl font-black">S</span>
              <div>
                <p className="text-sm text-cyan-200">Shape mascot guide</p>
                <p className="font-black">Hi, I am Shape Spark</p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">Story mode: Help build a playground using shapes. Pick tiles, ramps, tunnels, shadows, and formula cards.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setMode("beginner")} className={mode === "beginner" ? "action-primary" : "action-secondary"}>Kid mode</button>
            <button type="button" onClick={() => setMode("advanced")} className={mode === "advanced" ? "action-primary" : "action-secondary"}>Advanced</button>
          </div>

          <label className="block rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">
            Grade-wise level
            <select value={grade} onChange={(event) => setGrade(event.target.value as (typeof gradeLevels)[number])} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">
              {gradeLevels.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>

          <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
            <p className="text-sm font-bold">Progress tracking</p>
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-white dark:bg-slate-950"><div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500" style={{ width: `${mastery}%` }} /></div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs font-bold">
              <span className="rounded-xl bg-white p-2 dark:bg-slate-950">{mastery}% mastery</span>
              <span className="rounded-xl bg-white p-2 dark:bg-slate-950">{score} badges</span>
              <span className="rounded-xl bg-white p-2 dark:bg-slate-950">{favorites.length} favs</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {(["Play", "Build", "Formula", "Teacher", "3D"] as StudioTab[]).map((item) => <button key={item} type="button" onClick={() => setTab(item)} className={`rounded-full px-4 py-2 text-sm font-bold ${tab === item ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"}`}>{item}</button>)}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/60 md:flex-row md:items-center">
            <label className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-3 text-sm dark:border-white/10 dark:bg-slate-900" placeholder="Search shapes, formulas, real-life uses..." />
            </label>
            <select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-semibold dark:border-white/10 dark:bg-slate-900">
              {(["2D/3D", "sides", "corners", "curved edges", "symmetry", "faces", "vertices", "edges"] as SortMode[]).map((item) => <option key={item}>{item}</option>)}
            </select>
            <button type="button" onClick={() => speak(`${selected.name}. ${selected.description}. Formula: ${selected.formula}`)} className="action-secondary"><Volume2 className="h-4 w-4" />Read aloud</button>
          </div>

          {tab === "Play" && (
            <div className="grid gap-4 xl:grid-cols-2">
              <StudioPanel title="Flashcards and pronunciation" icon={<Mic className="h-5 w-5" />}>
                <div className="rounded-2xl bg-gradient-to-br from-cyan-100 to-violet-100 p-5 text-slate-950 dark:from-cyan-400/20 dark:to-violet-500/20 dark:text-white">
                  <p className="text-xs font-bold uppercase">Shape flashcard</p>
                  <p className="mt-2 text-3xl font-black">{flashShape.name}</p>
                  <p className="mt-2 text-sm leading-6">{flashShape.description}</p>
                  <p className="mt-3 font-mono text-sm">{flashShape.formula}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" className="action-secondary" onClick={() => setActiveFlashcard((value) => value + 1)}>Next card</button>
                  <button type="button" className="action-secondary" onClick={() => speak(flashShape.name)}>Pronounce</button>
                  <button type="button" className="action-primary" onClick={celebrate}><Award className="h-4 w-4" />I know it</button>
                </div>
              </StudioPanel>

              <StudioPanel title="Drag-and-drop style matching" icon={<Wand2 className="h-5 w-5" />}>
                <div className="grid gap-3 md:grid-cols-2">
                  <label className="text-sm font-semibold">Real-world object<select value={matchObject} onChange={(event) => setMatchObject(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">{objectMatches.map((item) => <option key={item.object}>{item.object}</option>)}</select></label>
                  <label className="text-sm font-semibold">Shape match<select value={matchShape} onChange={(event) => setMatchShape(event.target.value as ShapeId)} className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900">{shapes.map((shape) => <option key={shape.id} value={shape.id}>{shape.name}</option>)}</select></label>
                </div>
                <div className={`mt-3 rounded-2xl p-4 text-sm font-bold ${matchCorrect ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-100" : "bg-amber-50 text-amber-800 dark:bg-amber-400/10 dark:text-amber-100"}`}>
                  {matchCorrect ? "Correct! Confetti unlocked." : showHints ? `Hint: ${matchObject} looks like a ${shapeName(currentMatch.shape)}.` : "Try again."}
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="action-primary" onClick={matchCorrect ? celebrate : () => setShowHints(true)}>Check</button>
                  <button type="button" className="action-secondary" onClick={() => setShowHints((value) => !value)}>Hints</button>
                </div>
              </StudioPanel>

              <StudioPanel title="Room hunt and daily challenge" icon={<Camera className="h-5 w-5" />}>
                <p className="text-sm leading-6">Find this shape in your room: <strong>{selected.name}</strong>. AR-style shape camera idea: use the checklist now; camera detection can be connected later.</p>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {["I found it", "I measured it", "I named dimensions", "I explained formula"].map((item) => <button key={item} type="button" onClick={celebrate} className="rounded-xl bg-slate-100 p-3 text-sm font-bold dark:bg-white/10">{item}</button>)}
                </div>
                <label className="mt-3 flex items-center gap-3 rounded-xl bg-slate-100 p-3 text-sm font-bold dark:bg-white/10"><input type="checkbox" checked={timed} onChange={(event) => setTimed(event.target.checked)} />Timed challenge mode</label>
              </StudioPanel>

              <StudioPanel title="Multilingual kid labels" icon={<Sparkles className="h-5 w-5" />}>
                <div className="grid gap-2 md:grid-cols-3">
                  {Object.entries(languageLabels).map(([language, labels]) => <div key={language} className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="font-bold">{language}</p><p className="mt-2 text-sm">{labels.circle} / {labels.square} / {labels.triangle} / {labels.cube}</p></div>)}
                </div>
                <p className="mt-3 text-sm leading-6">Voice instructions, mistake hints, step hints, worked examples, try-again scaffolding and no-timer practice mode are active in this studio.</p>
              </StudioPanel>
            </div>
          )}

          {tab === "Build" && (
            <div className="grid gap-4 xl:grid-cols-2">
              <StudioPanel title="Pattern, tessellation, tangram and collage canvas" icon={<Shapes className="h-5 w-5" />}>
                <div className="grid grid-cols-6 gap-1 rounded-2xl bg-slate-100 p-3 dark:bg-slate-950">
                  {Array.from({ length: 36 }).map((_, index) => <MiniShape key={index} id={collage[index % collage.length]} />)}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(["triangle", "square", "circle", "rectangle", "regular-polygon"] as ShapeId[]).map((shapeId) => <button key={shapeId} type="button" className="mini-chip" onClick={() => setCollage((items) => [...items, shapeId].slice(-6))}>Add {shapeName(shapeId)}</button>)}
                  <button type="button" className="mini-chip" onClick={() => setCollage(["triangle", "triangle", "square", "parallelogram", "rhombus"])}>Tangram</button>
                  <button type="button" className="mini-chip" onClick={() => setCollage(["triangle", "rectangle", "circle", "cone"])}>Rocket</button>
                  <button type="button" className="mini-chip" onClick={() => setCollage(["circle", "ellipse", "triangle", "rectangle"])}>Animal</button>
                  <button type="button" className="mini-chip" onClick={() => setCollage(["rectangle", "triangle", "square", "circle"])}>House</button>
                </div>
              </StudioPanel>

              <StudioPanel title="Shape collage, free draw and save custom shape" icon={<Star className="h-5 w-5" />}>
                <input value={customName} onChange={(event) => setCustomName(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-900" />
                <div className="mt-3 rounded-2xl bg-white p-3 dark:bg-slate-950">
                  <svg viewBox="0 0 360 210" className="h-52 w-full rounded-xl bg-slate-50 dark:bg-slate-900">
                    {collage.map((shapeId, index) => <MiniShapeSvg key={`${shapeId}-${index}`} id={shapeId} x={50 + (index % 3) * 105} y={55 + Math.floor(index / 3) * 82} />)}
                    <path d="M40 180 C100 120 140 210 220 150 S305 120 330 170" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="8 6" />
                  </svg>
                </div>
                <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={saveCustom} className="action-primary">Save custom</button><button type="button" onClick={exportShape} className="action-secondary"><Download className="h-4 w-4" />Export shape</button></div>
              </StudioPanel>

              <StudioPanel title="Symmetry, mirror and rotation explorer" icon={<Eye className="h-5 w-5" />}>
                <svg viewBox="0 0 420 180" className="h-44 w-full rounded-2xl bg-slate-100 dark:bg-slate-950">
                  <line x1="210" y1="20" x2="210" y2="160" stroke="#0f172a" strokeDasharray="7 6" strokeWidth="3" />
                  <polygon points="130,130 170,50 195,130" fill="#22d3ee" opacity="0.35" stroke="#06b6d4" strokeWidth="3" />
                  <polygon points="290,130 250,50 225,130" fill="#f59e0b" opacity="0.35" stroke="#f59e0b" strokeWidth="3" />
                  <text x="218" y="38" className="text-xs font-bold">mirror line</text>
                  <g transform="translate(90 30) rotate(45 40 40)"><rect x="10" y="10" width="60" height="60" fill="#8b5cf6" opacity="0.35" stroke="#8b5cf6" strokeWidth="3" /></g>
                </svg>
                <p className="mt-3 text-sm leading-6">Interactive symmetry lines, rotational symmetry and mirror reflection are demonstrated with live mirrored shapes.</p>
              </StudioPanel>

              <StudioPanel title="Story quest: build a playground" icon={<Award className="h-5 w-5" />}>
                <ol className="space-y-2">
                  {questSteps.map((step, index) => <li key={step} className="rounded-xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10"><span className="text-cyan-600 dark:text-cyan-300">{index + 1}.</span> {step}</li>)}
                </ol>
              </StudioPanel>
            </div>
          )}

          {tab === "Formula" && (
            <div className="grid gap-4 xl:grid-cols-2">
              <StudioPanel title="Formula builder, missing symbol and rearrangement" icon={<Sparkles className="h-5 w-5" />}>
                <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
                  <p className="text-sm font-bold">Build: {selected.formula}</p>
                  <div className="mt-3 flex flex-wrap gap-2">{formulaTokens(selected.formula).map((token) => <span key={token} className="rounded-xl bg-white px-3 py-2 font-mono text-sm font-bold dark:bg-slate-950">{token}</span>)}</div>
                  <p className="mt-3 text-sm leading-6">Missing-symbol quiz: replace the blank in {missingFormula(selected)}. Rearrangement practice: solve for one variable using the same pieces.</p>
                </div>
                <button type="button" className="mt-3 action-primary" onClick={celebrate}>Check formula puzzle</button>
              </StudioPanel>

              <StudioPanel title="Why formula works and substitution" icon={<CalculatorIcon />}>
                <p className="text-sm leading-6">{formulaExplanation(selected.id, 4, 3, 5, 6, 90)}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">{Object.entries(metrics).slice(0, 4).map(([label, value]) => <Metric key={label} label={label} value={value * unitFactor} />)}</div>
                <div className="mt-3 flex gap-2">
                  {(["cm", "m", "in"] as UnitName[]).map((item) => <button key={item} type="button" onClick={() => setUnit(item)} className={`rounded-xl px-3 py-2 text-sm font-bold ${unit === item ? "bg-cyan-500 text-white" : "bg-slate-100 dark:bg-white/10"}`}>{item}</button>)}
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Unit conversion, area vs perimeter and volume vs surface-area comparisons update from the same metrics.</p>
              </StudioPanel>

              <StudioPanel title="Shape comparison and property checklist" icon={<Search className="h-5 w-5" />}>
                <div className="thin-scrollbar max-h-72 overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 dark:bg-white/10"><tr><th className="p-2">Shape</th><th className="p-2">Type</th><th className="p-2">Sides/Faces</th><th className="p-2">Symmetry</th></tr></thead>
                    <tbody>{filtered.slice(0, 12).map((shape) => <tr key={shape.id} className="border-t border-slate-200 dark:border-white/10"><td className="p-2 font-bold">{shape.name}</td><td className="p-2">{shape.kind}</td><td className="p-2">{propertyOf(shape, "sides") || propertyOf(shape, "faces")}</td><td className="p-2">{propertyOf(shape, "symmetry")}</td></tr>)}</tbody>
                  </table>
                </div>
              </StudioPanel>

              <StudioPanel title="Worked examples and real-life problems" icon={<Heart className="h-5 w-5" />}>
                <p className="text-sm leading-6">Example: A classroom board is a rectangle. If length is 4 m and breadth is 3 m, area = l x b = 12 m². Try again scaffolding: first identify dimensions, then choose formula, then substitute.</p>
                <div className="mt-3 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">Mistake hint: Do not add sides when the question asks for area; multiply the dimensions that cover the surface.</div>
              </StudioPanel>
            </div>
          )}

          {tab === "Teacher" && (
            <div className="grid gap-4 xl:grid-cols-2">
              <StudioPanel title="Classroom projection and teacher notes" icon={<Printer className="h-5 w-5" />}>
                <textarea value={notes} onChange={(event) => setNotes(event.target.value)} className="min-h-28 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm dark:border-white/10 dark:bg-slate-900" />
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={() => window.print()} className="action-secondary"><Printer className="h-4 w-4" />Print</button>
                  <button type="button" onClick={exportWorksheet} className="action-secondary"><Download className="h-4 w-4" />Worksheet</button>
                  <button type="button" onClick={exportCard} className="action-secondary"><Download className="h-4 w-4" />Formula card</button>
                  <button type="button" onClick={shareActivity} className="action-secondary">Share link</button>
                </div>
              </StudioPanel>

              <StudioPanel title="Parent and teacher dashboard" icon={<Award className="h-5 w-5" />}>
                <div className="grid grid-cols-2 gap-2">
                  <Metric label="Mastery" value={mastery} />
                  <Metric label="Recently learned" value={recent.length} />
                  <Metric label="Favorites" value={favorites.length} />
                  <Metric label="Quiz score" value={score} />
                </div>
                <p className="mt-3 text-sm leading-6">Auto-generated practice sheets, printable worksheets, difficulty-based quizzes, timed and no-timer modes, daily challenges and badges are tracked here.</p>
              </StudioPanel>

              <StudioPanel title="Favorites and recently learned" icon={<Heart className="h-5 w-5" />}>
                <div className="flex flex-wrap gap-2">{recent.map((shapeId) => <button key={shapeId} type="button" className="mini-chip" onClick={() => selectAndTrack(shapeById(shapes, shapeId))}>{shapeName(shapeId)}</button>)}</div>
                <button type="button" onClick={() => toggleFavorite(selected.id)} className="mt-3 action-primary"><Heart className="h-4 w-4" />{favorites.includes(selected.id) ? "Remove favorite" : "Add favorite"}</button>
              </StudioPanel>

              <StudioPanel title="Search, sorting and filters" icon={<Search className="h-5 w-5" />}>
                <div className="grid gap-2 md:grid-cols-2">{filtered.slice(0, 8).map((shape) => <button key={shape.id} type="button" onClick={() => selectAndTrack(shape)} className="rounded-xl bg-slate-100 p-3 text-left text-sm font-bold dark:bg-white/10">{shape.name}<span className="block text-xs font-normal text-slate-500">{shape.category}</span></button>)}</div>
              </StudioPanel>
            </div>
          )}

          {tab === "3D" && (
            <div className="grid gap-4 xl:grid-cols-2">
              <StudioPanel title="Nets, folding and surface paint" icon={<Cuboid className="h-5 w-5" />}>
                <NetExplorer shape={selected.id} paint={surfacePaint} />
                <SliderControl label="Paint the surface area" value={surfacePaint} min={0} max={100} step={5} onChange={setSurfacePaint} unit="%" />
              </StudioPanel>

              <StudioPanel title="Cross-section, shadows and light source" icon={<Eye className="h-5 w-5" />}>
                <svg viewBox="0 0 420 220" className="h-56 w-full rounded-2xl bg-slate-950">
                  <circle cx="70" cy="55" r="24" fill="#facc15" />
                  <line x1="95" y1="60" x2="250" y2={70 + lightAngle} stroke="#fde68a" strokeWidth="3" opacity="0.75" />
                  <rect x="190" y="70" width="90" height="90" fill="#22d3ee" opacity="0.65" stroke="#67e8f9" />
                  <ellipse cx="305" cy="176" rx={50 + lightAngle * 0.5} ry="18" fill="#020617" stroke="#475569" />
                  <line x1="185" y1={70 + sliceLevel * 0.9} x2="285" y2={70 + sliceLevel * 0.9} stroke="#f59e0b" strokeWidth="4" strokeDasharray="7 5" />
                  <text x="185" y="205" fill="#e2e8f0" className="text-xs font-bold">2D cross-section vs 3D solid shadow</text>
                </svg>
                <SliderControl label="Light-source explorer" value={lightAngle} min={5} max={80} step={1} onChange={setLightAngle} unit="deg" />
                <SliderControl label="Cross-section slicer" value={sliceLevel} min={0} max={100} step={5} onChange={setSliceLevel} unit="%" />
                <button type="button" className="action-primary" onClick={celebrate}>Guess the 3D shape from shadow</button>
              </StudioPanel>

              <StudioPanel title="3D controls checklist" icon={<ZoomIn className="h-5 w-5" />}>
                <ul className="grid gap-2 text-sm leading-6 md:grid-cols-2">
                  {["3D rotate with touch gestures", "Zoom and pan for all shapes", "Transparent mode", "Wireframe mode", "Show shadows", "Compare 2D cross-section", "Volume filling animation", "Surface-area unfolding nets"].map((item) => <li key={item} className="rounded-xl bg-slate-100 p-3 font-semibold dark:bg-white/10">{item}</li>)}
                </ul>
              </StudioPanel>

              <StudioPanel title="Cube, cylinder, cone, pyramid and prism net explorers" icon={<Box className="h-5 w-5" />}>
                <div className="grid gap-2 md:grid-cols-5">{(["cube", "cylinder", "cone", "square-pyramid", "triangular-prism"] as ShapeId[]).map((shapeId) => <button key={shapeId} type="button" onClick={() => selectAndTrack(shapeById(shapes, shapeId))} className="rounded-xl bg-slate-100 p-3 text-xs font-bold dark:bg-white/10">{shapeName(shapeId)}</button>)}</div>
              </StudioPanel>
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}

function StudioPanel({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5"><div className="mb-3 flex items-center gap-2 font-bold text-slate-900 dark:text-white">{icon}{title}</div>{children}</div>;
}

function MiniShape({ id }: { id: ShapeId }) {
  return <div className="grid aspect-square place-items-center rounded-lg bg-white dark:bg-white/10"><svg viewBox="0 0 50 50" className="h-8 w-8"><MiniShapeGlyph id={id} /></svg></div>;
}

function MiniShapeSvg({ id, x, y }: { id: ShapeId; x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`}><MiniShapeGlyph id={id} /></g>;
}

function MiniShapeGlyph({ id }: { id: ShapeId }) {
  if (id.includes("triangle") || id === "cone") return <polygon points="25,4 46,44 4,44" fill="#22d3ee" stroke="#06b6d4" strokeWidth="3" />;
  if (id === "circle" || id === "sphere" || id === "cylinder") return <circle cx="25" cy="25" r="20" fill="#f59e0b" opacity="0.75" stroke="#d97706" strokeWidth="3" />;
  if (id === "regular-polygon") return <polygon points="25,3 44,14 44,36 25,47 6,36 6,14" fill="#8b5cf6" opacity="0.7" stroke="#7c3aed" strokeWidth="3" />;
  return <rect x="7" y="9" width="36" height="32" rx="4" fill="#22d3ee" opacity="0.7" stroke="#06b6d4" strokeWidth="3" />;
}

function NetExplorer({ shape, paint }: { shape: ShapeId; paint: number }) {
  const fill = `rgba(34,211,238,${0.12 + paint / 160})`;
  return (
    <svg viewBox="0 0 420 220" className="h-56 w-full rounded-2xl bg-slate-100 dark:bg-slate-950">
      {shape === "cylinder" ? <><rect x="110" y="80" width="190" height="70" fill={fill} stroke="#06b6d4" strokeWidth="3" /><circle cx="95" cy="115" r="35" fill={fill} stroke="#f59e0b" strokeWidth="3" /><circle cx="315" cy="115" r="35" fill={fill} stroke="#f59e0b" strokeWidth="3" /></> :
        shape === "cone" ? <><path d="M210 30 L320 170 L100 170 Z" fill={fill} stroke="#06b6d4" strokeWidth="3" /><circle cx="210" cy="170" r="42" fill={fill} stroke="#f59e0b" strokeWidth="3" /></> :
        shape === "square-pyramid" ? <><rect x="175" y="85" width="70" height="70" fill={fill} stroke="#06b6d4" strokeWidth="3" /><polygon points="175,85 210,25 245,85" fill={fill} stroke="#f59e0b" strokeWidth="3" /><polygon points="245,85 310,120 245,155" fill={fill} stroke="#f59e0b" strokeWidth="3" /><polygon points="245,155 210,215 175,155" fill={fill} stroke="#f59e0b" strokeWidth="3" /><polygon points="175,155 110,120 175,85" fill={fill} stroke="#f59e0b" strokeWidth="3" /></> :
        shape === "triangular-prism" ? <><polygon points="70,150 125,55 180,150" fill={fill} stroke="#06b6d4" strokeWidth="3" /><rect x="180" y="55" width="90" height="95" fill={fill} stroke="#f59e0b" strokeWidth="3" /><polygon points="270,150 325,55 380,150" fill={fill} stroke="#06b6d4" strokeWidth="3" /></> :
        <><rect x="175" y="85" width="50" height="50" fill={fill} stroke="#06b6d4" strokeWidth="3" /><rect x="125" y="85" width="50" height="50" fill={fill} stroke="#06b6d4" strokeWidth="3" /><rect x="225" y="85" width="50" height="50" fill={fill} stroke="#06b6d4" strokeWidth="3" /><rect x="275" y="85" width="50" height="50" fill={fill} stroke="#06b6d4" strokeWidth="3" /><rect x="175" y="35" width="50" height="50" fill={fill} stroke="#06b6d4" strokeWidth="3" /><rect x="175" y="135" width="50" height="50" fill={fill} stroke="#06b6d4" strokeWidth="3" /></>}
      <text x="20" y="205" fill="#64748b" className="text-xs font-bold">Surface-area unfolding net and folding model</text>
    </svg>
  );
}

function CalculatorIcon() {
  return <Sparkles className="h-5 w-5" />;
}

function sortValue(shape: ShapeDefinition, mode: SortMode) {
  const props = shapeProperties(shape);
  if (mode === "2D/3D") return shape.kind === "2d" ? 0 : 1;
  return props[mode] ?? 0;
}

function shapeProperties(shape: ShapeDefinition): Record<SortMode, number> {
  const curved = ["circle", "semicircle", "sector", "ellipse", "sphere", "hemisphere", "cylinder", "cone", "frustum", "torus"].includes(shape.id) ? 1 : 0;
  const sides: Partial<Record<ShapeId, number>> = { triangle: 3, "right-triangle": 3, square: 4, rectangle: 4, parallelogram: 4, rhombus: 4, trapezium: 4, kite: 4, "regular-polygon": 6 };
  const faces: Partial<Record<ShapeId, number>> = { cube: 6, cuboid: 6, cylinder: 3, cone: 2, "square-pyramid": 5, "triangular-prism": 5, frustum: 3, sphere: 1, hemisphere: 2, torus: 1 };
  const edges: Partial<Record<ShapeId, number>> = { cube: 12, cuboid: 12, cylinder: 2, cone: 1, "square-pyramid": 8, "triangular-prism": 9, frustum: 2 };
  const vertices: Partial<Record<ShapeId, number>> = { cube: 8, cuboid: 8, cone: 1, "square-pyramid": 5, "triangular-prism": 6 };
  return { "2D/3D": shape.kind === "2d" ? 0 : 1, sides: sides[shape.id] ?? 0, corners: sides[shape.id] ?? vertices[shape.id] ?? 0, "curved edges": curved, symmetry: ["circle", "square", "rectangle", "sphere", "cube"].includes(shape.id) ? 4 : 1, faces: faces[shape.id] ?? 0, vertices: vertices[shape.id] ?? 0, edges: edges[shape.id] ?? sides[shape.id] ?? 0 };
}

function propertyOf(shape: ShapeDefinition, mode: SortMode) {
  return shapeProperties(shape)[mode];
}

function shapeName(id: ShapeId) {
  return shapes.find((shape) => shape.id === id)?.name ?? id;
}

function shapeById(items: ShapeDefinition[], id: ShapeId) {
  return items.find((shape) => shape.id === id) ?? items[0];
}

function formulaTokens(formula: string) {
  return formula.split(/(\s+|=|\+|-|\*|\/|\(|\)|,)/).filter((token) => token.trim());
}

function missingFormula(shape: ShapeDefinition) {
  return shape.formula.replace(/[A-Z]/, "__");
}

function playTinySound() {
  try {
    const context = new AudioContext();
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.frequency.value = 660;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start();
    osc.stop(context.currentTime + 0.12);
  } catch {
    // Audio can be blocked until user gesture; silent fallback is fine.
  }
}

function downloadTextFile(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function simpleShapeSvg(shape: ShapeDefinition) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 180"><rect width="240" height="180" fill="#f8fafc"/><text x="20" y="30" font-size="18" font-weight="700">${shape.name}</text><text x="20" y="158" font-size="13">${shape.formula}</text><circle cx="120" cy="88" r="46" fill="#22d3ee" opacity=".35" stroke="#06b6d4" stroke-width="4"/></svg>`;
}

function worksheetText(items: ShapeDefinition[]) {
  return items.map((shape, index) => `${index + 1}. ${shape.name}\nFormula: ${shape.formula}\nTask: Find a real object shaped like this and write its dimensions.\n`).join("\n");
}

function Metric({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500 dark:text-slate-400">{label}</p><p className="font-bold">{roundTo(value, 2)}</p></div>;
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10"><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">{label}</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{value}</p></div>;
}

function formulaExplanation(id: ShapeId, a: number, b: number, c: number, sides: number, angle: number) {
  if (id === "circle") return `The radius line r=${roundTo(a, 2)} runs from center to edge. Circumference wraps once around the boundary; area fills the disk as pi*r^2.`;
  if (id === "semicircle") return `The diagram shows half a disk. Radius r=${roundTo(a, 2)} controls both the curved arc pi*r and the half-area.`;
  if (id === "sector") return `The amber slice is theta=${roundTo(angle, 0)} degrees out of 360. Arc length and area use the same fraction theta/360.`;
  if (id === "ellipse") return `The horizontal semi-axis a=${roundTo(a, 2)} and vertical semi-axis b=${roundTo(b, 2)} multiply in A=pi*a*b.`;
  if (id === "triangle" || id === "right-triangle") return `The base b=${roundTo(a, 2)} and height h=${roundTo(b, 2)} make a rectangle; the triangle takes exactly half, so A=1/2*b*h.`;
  if (id === "square") return `Every side is s=${roundTo(a, 2)}. Area counts s by s square units, while perimeter walks four equal sides.`;
  if (id === "rectangle") return `Length l=${roundTo(a, 2)} and breadth b=${roundTo(b, 2)} multiply for area. Perimeter walks l+b+l+b.`;
  if (id === "parallelogram") return `Base b=${roundTo(a, 2)} times perpendicular height h=${roundTo(b, 2)} gives area; the slanted side controls perimeter.`;
  if (id === "rhombus" || id === "kite") return `The diagonals d1=${roundTo(a, 2)} and d2=${roundTo(b, 2)} cross. Their rectangle is twice the shape area, so A=d1*d2/2.`;
  if (id === "trapezium") return `Parallel sides a=${roundTo(a, 2)} and b=${roundTo(b, 2)} are averaged, then multiplied by height h=${roundTo(c, 2)}.`;
  if (id === "regular-polygon") return `${sides} equal sides of length s=${roundTo(a, 2)} form the perimeter. Area can be split into equal center triangles.`;
  if (id === "cube") return `Side s=${roundTo(a, 2)} builds 6 identical square faces and volume s*s*s.`;
  if (id === "cuboid") return `Length l=${roundTo(a, 2)}, breadth b=${roundTo(b, 2)}, and height h=${roundTo(c, 2)} multiply for volume.`;
  if (id === "sphere" || id === "hemisphere") return `Radius r=${roundTo(a, 2)} runs from center to surface. Surface area and volume grow with r^2 and r^3.`;
  if (id === "cylinder") return `Circular radius r=${roundTo(a, 2)} builds the base area pi*r^2, then height h=${roundTo(b, 2)} stacks that base into volume.`;
  if (id === "cone") return `Radius r=${roundTo(a, 2)}, height h=${roundTo(b, 2)}, and slant l=${roundTo(Math.hypot(a, b), 2)} define the curved surface and one-third cylinder volume.`;
  if (id === "frustum") return `Bottom radius R=${roundTo(a, 2)}, top radius r=${roundTo(b, 2)}, and height h=${roundTo(c, 2)} describe a sliced cone.`;
  if (id === "square-pyramid") return `Square side s=${roundTo(a, 2)} and height h=${roundTo(b, 2)} give one-third of the matching prism volume.`;
  if (id === "triangular-prism") return `Triangle base b=${roundTo(a, 2)} and height h=${roundTo(b, 2)} form the front area, then length L=${roundTo(c, 2)} extrudes it.`;
  return `Major radius R=${roundTo(a, 2)} goes around the ring; minor radius r=${roundTo(b, 2)} controls the tube thickness.`;
}

function symbolSummary(id: ShapeId, a: number, b: number, c: number, sides: number, angle: number) {
  if (["circle", "semicircle", "sphere", "hemisphere"].includes(id)) return `r=${roundTo(a, 2)}`;
  if (id === "sector") return `r=${roundTo(a, 2)}, theta=${roundTo(angle, 0)} deg`;
  if (id === "ellipse") return `a=${roundTo(a, 2)}, b=${roundTo(b, 2)}`;
  if (id === "rectangle") return `l=${roundTo(a, 2)}, b=${roundTo(b, 2)}`;
  if (id === "triangle" || id === "right-triangle" || id === "parallelogram") return `b=${roundTo(a, 2)}, h=${roundTo(b, 2)}`;
  if (id === "square" || id === "cube") return `s=${roundTo(a, 2)}`;
  if (id === "rhombus" || id === "kite") return `d1=${roundTo(a, 2)}, d2=${roundTo(b, 2)}`;
  if (id === "trapezium") return `a=${roundTo(a, 2)}, b=${roundTo(b, 2)}, h=${roundTo(c, 2)}`;
  if (id === "regular-polygon") return `n=${sides}, s=${roundTo(a, 2)}`;
  if (id === "cuboid") return `l=${roundTo(a, 2)}, b=${roundTo(b, 2)}, h=${roundTo(c, 2)}`;
  if (id === "cylinder") return `r=${roundTo(a, 2)}, h=${roundTo(b, 2)}`;
  if (id === "cone") return `r=${roundTo(a, 2)}, h=${roundTo(b, 2)}, l=${roundTo(Math.hypot(a, b), 2)}`;
  if (id === "frustum") return `R=${roundTo(a, 2)}, r=${roundTo(b, 2)}, h=${roundTo(c, 2)}`;
  if (id === "square-pyramid") return `s=${roundTo(a, 2)}, h=${roundTo(b, 2)}`;
  if (id === "triangular-prism") return `b=${roundTo(a, 2)}, h=${roundTo(b, 2)}, L=${roundTo(c, 2)}`;
  return `R=${roundTo(a, 2)}, r=${roundTo(b, 2)}`;
}

type ShapeViewControlsProps = {
  zoom: number;
  rotation: number;
  autoRotate: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onReset: () => void;
  onToggleAutoRotate: () => void;
};

function ShapeViewControls({ zoom, rotation, autoRotate, onZoomIn, onZoomOut, onRotateLeft, onRotateRight, onReset, onToggleAutoRotate }: ShapeViewControlsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/60 sm:flex-row sm:items-center sm:justify-between">
      <div className="mobile-safe-scroll thin-scrollbar flex gap-2 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
        <IconButton label="Zoom out" onClick={onZoomOut} disabled={zoom <= 0.55}>
          <ZoomOut className="h-4 w-4" />
        </IconButton>
        <IconButton label="Zoom in" onClick={onZoomIn} disabled={zoom >= 2}>
          <ZoomIn className="h-4 w-4" />
        </IconButton>
        <IconButton label="Rotate left" onClick={onRotateLeft}>
          <RotateCcw className="h-4 w-4" />
        </IconButton>
        <IconButton label="Rotate right" onClick={onRotateRight}>
          <RotateCw className="h-4 w-4" />
        </IconButton>
        <IconButton label={autoRotate ? "Pause auto-rotate" : "Play auto-rotate"} onClick={onToggleAutoRotate}>
          {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </IconButton>
        <IconButton label="Reset view" onClick={onReset}>
          <RefreshCw className="h-4 w-4" />
        </IconButton>
      </div>
      <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span className="mini-chip">Zoom {roundTo(zoom * 100, 0)}%</span>
        <span className="mini-chip">Rotate {rotation} deg</span>
        <span className="mini-chip">{autoRotate ? "Auto rotation on" : "Rotation paused"}</span>
      </div>
    </div>
  );
}

function IconButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-cyan-100 hover:text-cyan-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-cyan-300/15 dark:hover:text-cyan-100 sm:h-10 sm:w-10"
    >
      {children}
    </button>
  );
}

function primaryLabel(shape: ShapeDefinition) {
  if (shape.id === "ellipse") return "Semi-major axis a";
  if (shape.id === "cuboid") return "Length";
  if (shape.id === "torus") return "Major radius R";
  if (shape.id === "regular-polygon" || shape.id === "square" || shape.id === "cube" || shape.id === "square-pyramid") return "Side";
  if (shape.id === "triangle" || shape.id === "right-triangle" || shape.id === "parallelogram" || shape.id === "trapezium" || shape.id === "triangular-prism") return "Base";
  return "Radius";
}

function secondLabel(shape: ShapeDefinition) {
  if (shape.id === "ellipse" || shape.id === "rhombus" || shape.id === "kite") return "Second dimension";
  if (shape.id === "cuboid") return "Width";
  if (shape.id === "torus") return "Minor radius r";
  if (shape.id === "trapezium" || shape.id === "frustum") return "Top radius / top base";
  return "Height";
}

function thirdLabel(shape: ShapeDefinition) {
  if (shape.id === "parallelogram") return "Side";
  if (shape.id === "triangular-prism") return "Length";
  return "Height";
}

function needsSecond(id: ShapeId) {
  return !["circle", "semicircle", "square", "cube", "sphere", "hemisphere"].includes(id);
}

function needsThird(id: ShapeId) {
  return ["parallelogram", "trapezium", "cuboid", "frustum", "triangular-prism"].includes(id);
}

function getMetrics(id: ShapeId, a: number, b: number, c: number, n: number, angle: number): Metrics {
  switch (id) {
    case "circle": return { Circumference: 2 * Math.PI * a, Area: Math.PI * a * a };
    case "semicircle": return { "Arc length": Math.PI * a, Perimeter: Math.PI * a + 2 * a, Area: Math.PI * a * a / 2 };
    case "sector": return { "Arc length": angle / 360 * 2 * Math.PI * a, Area: angle / 360 * Math.PI * a * a };
    case "ellipse": return { Area: Math.PI * a * b, "Approx perimeter": Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b))) };
    case "triangle": return { Area: a * b / 2, "Shown base": a, "Shown height": b };
    case "right-triangle": return { Area: a * b / 2, Hypotenuse: Math.hypot(a, b), Perimeter: a + b + Math.hypot(a, b) };
    case "square": return { Area: a * a, Perimeter: 4 * a, Diagonal: a * Math.SQRT2 };
    case "rectangle": return { Area: a * b, Perimeter: 2 * (a + b), Diagonal: Math.hypot(a, b) };
    case "parallelogram": return { Area: a * b, Perimeter: 2 * (a + c) };
    case "rhombus": return { Area: a * b / 2, Side: Math.hypot(a / 2, b / 2), Perimeter: 4 * Math.hypot(a / 2, b / 2) };
    case "trapezium": return { Area: (a + b) * c / 2, "Midline": (a + b) / 2 };
    case "kite": return { Area: a * b / 2 };
    case "regular-polygon": return { Perimeter: n * a, Area: n * a * a / (4 * Math.tan(Math.PI / n)), Apothem: a / (2 * Math.tan(Math.PI / n)) };
    case "cube": return { "Surface area": 6 * a * a, Volume: a ** 3, Diagonal: a * Math.sqrt(3) };
    case "cuboid": return { "Surface area": 2 * (a * b + a * c + b * c), Volume: a * b * c, Diagonal: Math.hypot(a, b, c) };
    case "sphere": return { "Surface area": 4 * Math.PI * a * a, Volume: 4 / 3 * Math.PI * a ** 3 };
    case "hemisphere": return { "Curved area": 2 * Math.PI * a * a, "Total area": 3 * Math.PI * a * a, Volume: 2 / 3 * Math.PI * a ** 3 };
    case "cylinder": return { "Surface area": 2 * Math.PI * a * (a + b), Volume: Math.PI * a * a * b };
    case "cone": return { "Slant height": Math.hypot(a, b), "Surface area": Math.PI * a * (a + Math.hypot(a, b)), Volume: Math.PI * a * a * b / 3 };
    case "frustum": return { "Slant height": Math.hypot(a - b, c), "Surface area": Math.PI * (a + b) * Math.hypot(a - b, c) + Math.PI * (a * a + b * b), Volume: Math.PI * c * (a * a + a * b + b * b) / 3 };
    case "square-pyramid": return { "Slant height": Math.hypot(a / 2, b), "Surface area": a * a + 2 * a * Math.hypot(a / 2, b), Volume: a * a * b / 3 };
    case "triangular-prism": return { "Base area": a * b / 2, Volume: a * b * c / 2 };
    case "torus": return { "Surface area": 4 * Math.PI * Math.PI * a * b, Volume: 2 * Math.PI * Math.PI * a * b * b };
    default: return {};
  }
}

function ShapeSvg({ shape, a, b, c, sides, angle, zoom, rotation, cinematic = false }: { shape: ShapeId; a: number; b: number; c: number; sides: number; angle: number; zoom: number; rotation: number; cinematic?: boolean }) {
  const scale = 18;
  const cx = 240;
  const cy = 180;
  const radius = Math.min(a * scale, 140);
  const w = Math.min(a * scale * 2, 300);
  const h = Math.min(b * scale * 2, 230);
  const top = Math.min(b * scale * 2, 230);
  const height = Math.min((c || b) * scale * 2, 230);
  const sectorTheta = (angle * Math.PI) / 180;
  const sectorX = cx + radius * Math.cos(sectorTheta);
  const sectorY = cy - radius * Math.sin(sectorTheta);
  const polygonPoints = Array.from({ length: sides }, (_, index) => {
    const theta = -Math.PI / 2 + (index * 2 * Math.PI) / sides;
    return `${cx + radius * Math.cos(theta)},${cy + radius * Math.sin(theta)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 480 360" className="h-[300px] w-full sm:h-[360px]">
      <defs>
        <linearGradient id="shapeFill" x1="0" x2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="shapeStageGlow" cx="50%" cy="42%" r="68%">
          <stop offset="0%" stopColor="#164e63" stopOpacity="0.95" />
          <stop offset="54%" stopColor="#111827" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#020617" stopOpacity="1" />
        </radialGradient>
        <linearGradient id="projectionFill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.78" />
          <stop offset="55%" stopColor="#8b5cf6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {cinematic && <rect width="480" height="360" rx="22" fill="url(#shapeStageGlow)" />}
      <g transform={`translate(${cx} ${cy}) rotate(${rotation}) scale(${zoom}) translate(${-cx} ${-cy})`}>
        {isSolidShape(shape) && <ShapeProjectionSvg shape={shape} cx={cx} cy={cy} size={radius} second={Math.min(b * scale, 130)} third={Math.min((c || b) * scale, 130)} />}
        {shape === "circle" && <circle cx={cx} cy={cy} r={radius} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "semicircle" && <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy} L ${cx - radius} ${cy}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "sector" && <path d={`M ${cx} ${cy} L ${cx + radius} ${cy} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 0 ${sectorX} ${sectorY} Z`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "ellipse" && <ellipse cx={cx} cy={cy} rx={Math.min(a * scale, 170)} ry={Math.min(b * scale, 120)} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "triangle" && <polygon points={`${cx - w / 2},${cy + h / 2} ${cx + w / 2},${cy + h / 2} ${cx},${cy - h / 2}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "right-triangle" && <polygon points={`${cx - w / 2},${cy + h / 2} ${cx + w / 2},${cy + h / 2} ${cx - w / 2},${cy - h / 2}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "square" && <rect x={cx - radius} y={cy - radius} width={radius * 2} height={radius * 2} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "rectangle" && <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "parallelogram" && <polygon points={`${cx - w / 2 + 45},${cy - h / 2} ${cx + w / 2},${cy - h / 2} ${cx + w / 2 - 45},${cy + h / 2} ${cx - w / 2},${cy + h / 2}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "rhombus" && <polygon points={`${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "trapezium" && <polygon points={`${cx - top / 2},${cy - height / 2} ${cx + top / 2},${cy - height / 2} ${cx + w / 2},${cy + height / 2} ${cx - w / 2},${cy + height / 2}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "kite" && <polygon points={`${cx},${cy - h / 2} ${cx + w / 2},${cy - 10} ${cx},${cy + h / 2} ${cx - w / 2},${cy - 10}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "regular-polygon" && <polygon points={polygonPoints} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        <line x1="80" y1="310" x2="400" y2="310" stroke={cinematic ? "#475569" : "#94a3b8"} strokeDasharray="6 6" />
        <DimensionGuides2D shape={shape} cx={cx} cy={cy} radius={radius} w={w} h={h} top={top} height={height} sectorX={sectorX} sectorY={sectorY} cinematic={cinematic} />
      </g>
    </svg>
  );
}

function ShapeProjectionSvg({ shape, cx, cy, size, second, third }: { shape: ShapeId; cx: number; cy: number; size: number; second: number; third: number }) {
  const r = Math.min(size, 118);
  const w = Math.min(size * 1.55, 190);
  const h = Math.min(second * 1.15, 145);
  const d = Math.min(third * 0.48, 72);
  if (shape === "sphere") return <><circle cx={cx} cy={cy} r={r} fill="url(#projectionFill)" stroke="#67e8f9" strokeWidth="4" /><ellipse cx={cx} cy={cy} rx={r} ry={r * 0.32} fill="none" stroke="#f8fafc" strokeOpacity="0.5" strokeWidth="2" /><ellipse cx={cx} cy={cy} rx={r * 0.38} ry={r} fill="none" stroke="#f8fafc" strokeOpacity="0.28" strokeWidth="2" /></>;
  if (shape === "hemisphere") return <><path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy} L ${cx - r} ${cy}`} fill="url(#projectionFill)" stroke="#67e8f9" strokeWidth="4" /><ellipse cx={cx} cy={cy} rx={r} ry={r * 0.22} fill="none" stroke="#f59e0b" strokeWidth="3" /></>;
  if (shape === "cylinder") return <><rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill="url(#projectionFill)" stroke="#67e8f9" strokeWidth="4" /><ellipse cx={cx} cy={cy - h / 2} rx={w / 2} ry="24" fill="#0f172a" fillOpacity="0.35" stroke="#f59e0b" strokeWidth="3" /><ellipse cx={cx} cy={cy + h / 2} rx={w / 2} ry="24" fill="none" stroke="#f59e0b" strokeWidth="3" /></>;
  if (shape === "cone") return <><path d={`M ${cx} ${cy - h / 1.25} L ${cx + w / 2} ${cy + h / 2} L ${cx - w / 2} ${cy + h / 2} Z`} fill="url(#projectionFill)" stroke="#67e8f9" strokeWidth="4" /><ellipse cx={cx} cy={cy + h / 2} rx={w / 2} ry="24" fill="none" stroke="#f59e0b" strokeWidth="3" /></>;
  if (shape === "frustum") return <><path d={`M ${cx - w * 0.28} ${cy - h / 2} L ${cx + w * 0.28} ${cy - h / 2} L ${cx + w / 2} ${cy + h / 2} L ${cx - w / 2} ${cy + h / 2} Z`} fill="url(#projectionFill)" stroke="#67e8f9" strokeWidth="4" /><ellipse cx={cx} cy={cy - h / 2} rx={w * 0.28} ry="15" fill="none" stroke="#f59e0b" strokeWidth="3" /><ellipse cx={cx} cy={cy + h / 2} rx={w / 2} ry="24" fill="none" stroke="#f59e0b" strokeWidth="3" /></>;
  if (shape === "square-pyramid") return <><polygon points={`${cx},${cy - h / 1.35} ${cx + w / 2},${cy + h / 3} ${cx},${cy + h / 1.65} ${cx - w / 2},${cy + h / 3}`} fill="url(#projectionFill)" stroke="#67e8f9" strokeWidth="4" /><line x1={cx} y1={cy - h / 1.35} x2={cx} y2={cy + h / 1.65} stroke="#f8fafc" strokeOpacity="0.45" strokeWidth="2" /></>;
  if (shape === "triangular-prism") return <><polygon points={`${cx - w / 2},${cy + h / 2} ${cx - w / 2 + 70},${cy - h / 2} ${cx - w / 2 + 140},${cy + h / 2}`} fill="url(#projectionFill)" stroke="#67e8f9" strokeWidth="4" /><polygon points={`${cx - w / 2 + d},${cy + h / 2 - d} ${cx - w / 2 + 70 + d},${cy - h / 2 - d} ${cx - w / 2 + 140 + d},${cy + h / 2 - d}`} fill="#0f172a" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="3" /><line x1={cx - w / 2} y1={cy + h / 2} x2={cx - w / 2 + d} y2={cy + h / 2 - d} stroke="#f59e0b" strokeWidth="3" /><line x1={cx - w / 2 + 70} y1={cy - h / 2} x2={cx - w / 2 + 70 + d} y2={cy - h / 2 - d} stroke="#f59e0b" strokeWidth="3" /><line x1={cx - w / 2 + 140} y1={cy + h / 2} x2={cx - w / 2 + 140 + d} y2={cy + h / 2 - d} stroke="#f59e0b" strokeWidth="3" /></>;
  if (shape === "torus") return <><ellipse cx={cx} cy={cy} rx={r * 1.08} ry={r * 0.64} fill="url(#projectionFill)" stroke="#67e8f9" strokeWidth="4" /><ellipse cx={cx} cy={cy} rx={r * 0.48} ry={r * 0.24} fill="#020617" stroke="#f59e0b" strokeWidth="4" /></>;
  return <><polygon points={`${cx - w / 2},${cy - h / 2} ${cx + w / 2},${cy - h / 2} ${cx + w / 2 + d},${cy - h / 2 - d} ${cx - w / 2 + d},${cy - h / 2 - d}`} fill="#67e8f9" fillOpacity="0.55" stroke="#67e8f9" strokeWidth="3" /><polygon points={`${cx + w / 2},${cy - h / 2} ${cx + w / 2},${cy + h / 2} ${cx + w / 2 + d},${cy + h / 2 - d} ${cx + w / 2 + d},${cy - h / 2 - d}`} fill="#8b5cf6" fillOpacity="0.38" stroke="#a78bfa" strokeWidth="3" /><rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill="url(#projectionFill)" stroke="#67e8f9" strokeWidth="4" /></>;
}

function DimensionGuides2D({ shape, cx, cy, radius, w, h, top, height, sectorX, sectorY, cinematic = false }: { shape: ShapeId; cx: number; cy: number; radius: number; w: number; h: number; top: number; height: number; sectorX: number; sectorY: number; cinematic?: boolean }) {
  const defaultLabel = cinematic ? "#f8fafc" : "#0f172a";
  const label = (x: number, y: number, text: string, color = defaultLabel) => <text x={x} y={y} fill={color} fontSize="15" fontWeight="700">{text}</text>;
  const guide = (x1: number, y1: number, x2: number, y2: number, color = "#f59e0b") => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="3" strokeDasharray="7 5" />;
  if (["circle", "semicircle"].includes(shape)) return <>{guide(cx, cy, cx + radius, cy)}{label(cx + radius / 2 - 5, cy - 10, "r", "#f59e0b")}{guide(cx - radius, cy + 26, cx + radius, cy + 26, "#8b5cf6")}{label(cx - 8, cy + 48, "d=2r", "#8b5cf6")}</>;
  if (shape === "sector") return <>{guide(cx, cy, cx + radius, cy)}{guide(cx, cy, sectorX, sectorY)}{label(cx + radius / 2, cy - 10, "r", "#f59e0b")}{label(cx + 18, cy - 22, "theta", "#8b5cf6")}</>;
  if (shape === "ellipse") return <>{guide(cx, cy, cx + Math.min(w / 2, 170), cy)}{guide(cx, cy, cx, cy - Math.min(h / 2, 120))}{label(cx + 55, cy - 10, "a", "#f59e0b")}{label(cx + 10, cy - 55, "b", "#8b5cf6")}</>;
  if (shape === "triangle") return <>{guide(cx - w / 2, cy + h / 2 + 20, cx + w / 2, cy + h / 2 + 20)}{guide(cx, cy + h / 2, cx, cy - h / 2)}{label(cx - 10, cy + h / 2 + 42, "b", "#f59e0b")}{label(cx + 10, cy, "h", "#8b5cf6")}</>;
  if (shape === "right-triangle") return <>{guide(cx - w / 2, cy + h / 2 + 20, cx + w / 2, cy + h / 2 + 20)}{guide(cx - w / 2 - 20, cy + h / 2, cx - w / 2 - 20, cy - h / 2)}{guide(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, "#ef4444")}{label(cx - 5, cy + h / 2 + 42, "b", "#f59e0b")}{label(cx - w / 2 - 45, cy, "h", "#8b5cf6")}{label(cx, cy, "c", "#ef4444")}</>;
  if (shape === "square") return <>{guide(cx - radius, cy + radius + 18, cx + radius, cy + radius + 18)}{label(cx - 5, cy + radius + 40, "s", "#f59e0b")}</>;
  if (shape === "rectangle") return <>{guide(cx - w / 2, cy + h / 2 + 18, cx + w / 2, cy + h / 2 + 18)}{guide(cx - w / 2 - 18, cy - h / 2, cx - w / 2 - 18, cy + h / 2)}{label(cx - 5, cy + h / 2 + 40, "l", "#f59e0b")}{label(cx - w / 2 - 42, cy, "b", "#8b5cf6")}</>;
  if (shape === "parallelogram") return <>{guide(cx - w / 2, cy + h / 2 + 18, cx + w / 2 - 45, cy + h / 2 + 18)}{guide(cx, cy + h / 2, cx, cy - h / 2)}{label(cx - 5, cy + h / 2 + 40, "b", "#f59e0b")}{label(cx + 10, cy, "h", "#8b5cf6")}</>;
  if (shape === "rhombus" || shape === "kite") return <>{guide(cx - w / 2, cy, cx + w / 2, cy)}{guide(cx, cy - h / 2, cx, cy + h / 2)}{label(cx - 8, cy - 10, "d1", "#f59e0b")}{label(cx + 10, cy, "d2", "#8b5cf6")}</>;
  if (shape === "trapezium") return <>{guide(cx - w / 2, cy + height / 2 + 18, cx + w / 2, cy + height / 2 + 18)}{guide(cx - top / 2, cy - height / 2 - 18, cx + top / 2, cy - height / 2 - 18)}{guide(cx, cy - height / 2, cx, cy + height / 2)}{label(cx - 8, cy + height / 2 + 40, "a", "#f59e0b")}{label(cx - 8, cy - height / 2 - 28, "b", "#8b5cf6")}{label(cx + 10, cy, "h", "#ef4444")}</>;
  if (shape === "regular-polygon") return <>{guide(cx, cy, cx + radius, cy)}{label(cx + radius / 2, cy - 8, "r", "#f59e0b")}{label(cx - 25, cy + radius + 30, "n sides", "#8b5cf6")}</>;
  return null;
}

function ShapeSceneCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className={checked ? "action-primary min-h-8 cursor-pointer px-3 py-1 text-xs" : "tool-button min-h-8 cursor-pointer px-3 py-1 text-xs"}>
      <input className="h-3.5 w-3.5 accent-cyan-400" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

function ShapeCoordinateLabels() {
  return (
    <group>
      <Text position={[3.6, 0, 0]} fontSize={0.28} color="#67e8f9" anchorX="center" outlineWidth={0.018} outlineColor="#020617">x</Text>
      <Text position={[0, 3.6, 0]} fontSize={0.28} color="#86efac" anchorX="center" outlineWidth={0.018} outlineColor="#020617">y</Text>
      <Text position={[0, 0, 3.6]} fontSize={0.28} color="#c4b5fd" anchorX="center" outlineWidth={0.018} outlineColor="#020617">z</Text>
      <Text position={[0.34, 0.2, 0.34]} fontSize={0.16} color="#f8fafc" anchorX="left" outlineWidth={0.014} outlineColor="#020617">origin</Text>
    </group>
  );
}

function RotatingSolid({ shape, a, b, c, sides, angle, wireframe, zoom, rotation, autoRotate, showLabels }: { shape: ShapeId; a: number; b: number; c: number; sides: number; angle: number; wireframe: boolean; zoom: number; rotation: number; autoRotate: boolean; showLabels: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const guideRef = useRef<THREE.Group>(null);
  useEffect(() => {
    if (ref.current) ref.current.rotation.y = (rotation * Math.PI) / 180;
    if (guideRef.current) guideRef.current.rotation.y = (rotation * Math.PI) / 180;
  }, [rotation]);

  useFrame((_, delta) => {
    if (ref.current && autoRotate) {
      ref.current.rotation.y += delta * 0.45;
      ref.current.rotation.x += delta * 0.12;
    }
    if (guideRef.current && autoRotate) guideRef.current.rotation.y += delta * 0.45;
  });

  const size = Math.min(a, 5);
  const second = Math.min(b, 5);
  const third = Math.min(c, 6);
  const solid = isSolidShape(shape);
  const materialColor = solid ? "#22d3ee" : "#38bdf8";
  const emissiveColor = solid ? "#083344" : "#0f172a";

  return (
    <group scale={zoom}>
      <group ref={ref}>
        <mesh castShadow receiveShadow>
          <ShapeGeometry3D shape={shape} size={size} second={second} third={third} sides={sides} angle={angle} />
          <meshPhysicalMaterial
            color={materialColor}
            emissive={emissiveColor}
            emissiveIntensity={solid ? 0.1 : 0.16}
            roughness={0.18}
            metalness={0.22}
            clearcoat={0.7}
            clearcoatRoughness={0.16}
            wireframe={wireframe}
            transparent
            opacity={wireframe ? 1 : 0.9}
          />
        </mesh>
        {!wireframe && (
          <mesh scale={1.006}>
            <ShapeGeometry3D shape={shape} size={size} second={second} third={third} sides={sides} angle={angle} />
            <meshBasicMaterial color="#e0f2fe" wireframe transparent opacity={0.13} />
          </mesh>
        )}
      </group>
      {showLabels && <group ref={guideRef}>
        <DimensionGuides3D shape={shape} size={size} second={second} third={third} />
      </group>}
    </group>
  );
}

function ShapeGeometry3D({ shape, size, second, third, sides, angle }: { shape: ShapeId; size: number; second: number; third: number; sides: number; angle: number }) {
  const extrudedShape = useMemo(() => createExtrudedShape(shape, size, second, sides, angle), [shape, size, second, sides, angle]);
  if (shape === "cube") return <boxGeometry args={[size, size, size]} />;
  if (shape === "cuboid") return <boxGeometry args={[size, second, third]} />;
  if (shape === "sphere") return <sphereGeometry args={[size, 80, 48]} />;
  if (shape === "hemisphere") return <sphereGeometry args={[size, 80, 28, 0, Math.PI * 2, 0, Math.PI / 2]} />;
  if (shape === "cylinder") return <cylinderGeometry args={[size, size, second, 96]} />;
  if (shape === "cone") return <coneGeometry args={[size, second, 96]} />;
  if (shape === "frustum") return <cylinderGeometry args={[second, size, third, 96]} />;
  if (shape === "square-pyramid") return <coneGeometry args={[size, second, 4]} />;
  if (shape === "triangular-prism") return <cylinderGeometry args={[size, size, third, 3]} />;
  if (shape === "torus") return <torusGeometry args={[size, second, 32, 128]} />;
  return <extrudeGeometry args={[extrudedShape, { depth: 0.42, bevelEnabled: true, bevelSize: 0.055, bevelThickness: 0.06, bevelSegments: 5, curveSegments: 48 }]} />;
}

function createExtrudedShape(shapeId: ShapeId, size: number, second: number, sides: number, angle: number) {
  const shape = new THREE.Shape();
  const radius = Math.max(0.45, size);
  const halfW = Math.max(0.45, size);
  const halfH = Math.max(0.45, second);
  if (shapeId === "circle") {
    shape.absellipse(0, 0, radius, radius, 0, Math.PI * 2, false, 0);
  } else if (shapeId === "semicircle") {
    shape.moveTo(-radius, 0);
    shape.absarc(0, 0, radius, Math.PI, 0, false);
    shape.lineTo(-radius, 0);
  } else if (shapeId === "sector") {
    const theta = THREE.MathUtils.degToRad(angle);
    shape.moveTo(0, 0);
    shape.lineTo(radius, 0);
    shape.absarc(0, 0, radius, 0, theta, false);
    shape.lineTo(0, 0);
  } else if (shapeId === "ellipse") {
    shape.absellipse(0, 0, halfW, halfH, 0, Math.PI * 2, false, 0);
  } else if (shapeId === "triangle") {
    shape.moveTo(-halfW, -halfH * 0.72);
    shape.lineTo(halfW, -halfH * 0.72);
    shape.lineTo(0, halfH);
    shape.lineTo(-halfW, -halfH * 0.72);
  } else if (shapeId === "right-triangle") {
    shape.moveTo(-halfW, -halfH);
    shape.lineTo(halfW, -halfH);
    shape.lineTo(-halfW, halfH);
    shape.lineTo(-halfW, -halfH);
  } else if (shapeId === "square") {
    shape.moveTo(-radius, -radius);
    shape.lineTo(radius, -radius);
    shape.lineTo(radius, radius);
    shape.lineTo(-radius, radius);
    shape.lineTo(-radius, -radius);
  } else if (shapeId === "rectangle") {
    shape.moveTo(-halfW, -halfH);
    shape.lineTo(halfW, -halfH);
    shape.lineTo(halfW, halfH);
    shape.lineTo(-halfW, halfH);
    shape.lineTo(-halfW, -halfH);
  } else if (shapeId === "parallelogram") {
    shape.moveTo(-halfW + halfW * 0.35, halfH);
    shape.lineTo(halfW, halfH);
    shape.lineTo(halfW - halfW * 0.35, -halfH);
    shape.lineTo(-halfW, -halfH);
    shape.lineTo(-halfW + halfW * 0.35, halfH);
  } else if (shapeId === "rhombus" || shapeId === "kite") {
    shape.moveTo(0, halfH);
    shape.lineTo(halfW, shapeId === "kite" ? halfH * 0.12 : 0);
    shape.lineTo(0, -halfH);
    shape.lineTo(-halfW, shapeId === "kite" ? halfH * 0.12 : 0);
    shape.lineTo(0, halfH);
  } else if (shapeId === "trapezium") {
    shape.moveTo(-second * 0.5, halfH);
    shape.lineTo(second * 0.5, halfH);
    shape.lineTo(halfW, -halfH);
    shape.lineTo(-halfW, -halfH);
    shape.lineTo(-second * 0.5, halfH);
  } else {
    const count = Math.max(3, Math.round(sides));
    for (let index = 0; index <= count; index += 1) {
      const theta = -Math.PI / 2 + (index * Math.PI * 2) / count;
      const x = radius * Math.cos(theta);
      const y = radius * Math.sin(theta);
      if (index === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
  }
  return shape;
}

function isSolidShape(shape: ShapeId) {
  return ["cube", "cuboid", "sphere", "hemisphere", "cylinder", "cone", "frustum", "square-pyramid", "triangular-prism", "torus"].includes(shape);
}

function loadSavedShapeSizes(): SavedShapeSize[] {
  try {
    const raw = localStorage.getItem(savedShapeStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isSavedShapeSize);
  } catch {
    return [];
  }
}

function isSavedShapeSize(value: unknown): value is SavedShapeSize {
  if (!value || typeof value !== "object") return false;
  const item = value as Partial<SavedShapeSize>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.shapeId === "string" &&
    shapes.some((shape) => shape.id === item.shapeId) &&
    typeof item.a === "number" &&
    typeof item.b === "number" &&
    typeof item.c === "number" &&
    typeof item.sides === "number" &&
    typeof item.angle === "number"
  );
}

function savedShapeSummary(item: SavedShapeSize) {
  return `a=${roundTo(item.a, 2)}, b=${roundTo(item.b, 2)}, c=${roundTo(item.c, 2)}, sides=${item.sides}, angle=${roundTo(item.angle, 0)} deg`;
}

function DimensionGuides3D({ shape, size, second, third }: { shape: ShapeId; size: number; second: number; third: number }) {
  if (!isSolidShape(shape)) return <ExtrudedShapeGuides size={size} second={second} />;
  const half = size / 2;
  if (shape === "cube") return <><GuideLine start={[-half, -half - 0.25, half]} end={[half, -half - 0.25, half]} color="#f59e0b" /><GuideLabel position={[0, -half - 0.45, half]} text="s" /></>;
  if (shape === "cuboid") return <><GuideLine start={[-size / 2, -second / 2 - 0.3, third / 2]} end={[size / 2, -second / 2 - 0.3, third / 2]} color="#f59e0b" /><GuideLine start={[-size / 2 - 0.3, -second / 2, -third / 2]} end={[-size / 2 - 0.3, second / 2, -third / 2]} color="#8b5cf6" /><GuideLine start={[size / 2 + 0.3, -second / 2, -third / 2]} end={[size / 2 + 0.3, -second / 2, third / 2]} color="#ef4444" /><GuideLabel position={[0, -second / 2 - 0.5, third / 2]} text="l" /><GuideLabel position={[-size / 2 - 0.55, 0, -third / 2]} text="b" /><GuideLabel position={[size / 2 + 0.45, -second / 2, 0]} text="h" /></>;
  if (shape === "sphere" || shape === "hemisphere") return <><GuideLine start={[0, 0, 0]} end={[size, 0, 0]} color="#f59e0b" /><GuideLabel position={[size / 2, 0.18, 0]} text="r" /></>;
  if (shape === "cylinder") return <><GuideLine start={[0, -second / 2, 0]} end={[size, -second / 2, 0]} color="#f59e0b" /><GuideLine start={[-size - 0.3, -second / 2, 0]} end={[-size - 0.3, second / 2, 0]} color="#8b5cf6" /><GuideLabel position={[size / 2, -second / 2 - 0.18, 0]} text="r" /><GuideLabel position={[-size - 0.55, 0, 0]} text="h" /></>;
  if (shape === "cone") return <><GuideLine start={[0, -second / 2, 0]} end={[size, -second / 2, 0]} color="#f59e0b" /><GuideLine start={[-size - 0.25, -second / 2, 0]} end={[-size - 0.25, second / 2, 0]} color="#8b5cf6" /><GuideLine start={[size, -second / 2, 0]} end={[0, second / 2, 0]} color="#ef4444" /><GuideLabel position={[size / 2, -second / 2 - 0.18, 0]} text="r" /><GuideLabel position={[-size - 0.5, 0, 0]} text="h" /><GuideLabel position={[size / 2, 0.05, 0]} text="l" /></>;
  if (shape === "frustum") return <><GuideLine start={[0, -third / 2, 0]} end={[size, -third / 2, 0]} color="#f59e0b" /><GuideLine start={[0, third / 2, 0]} end={[second, third / 2, 0]} color="#8b5cf6" /><GuideLine start={[-size - 0.35, -third / 2, 0]} end={[-size - 0.35, third / 2, 0]} color="#ef4444" /><GuideLabel position={[size / 2, -third / 2 - 0.2, 0]} text="R" /><GuideLabel position={[second / 2, third / 2 + 0.25, 0]} text="r" /><GuideLabel position={[-size - 0.6, 0, 0]} text="h" /></>;
  if (shape === "square-pyramid") return <><GuideLine start={[-size / 2, -second / 2 - 0.2, size / 2]} end={[size / 2, -second / 2 - 0.2, size / 2]} color="#f59e0b" /><GuideLine start={[0, -second / 2, 0]} end={[0, second / 2, 0]} color="#8b5cf6" /><GuideLabel position={[0, -second / 2 - 0.42, size / 2]} text="s" /><GuideLabel position={[0.15, 0, 0]} text="h" /></>;
  if (shape === "triangular-prism") return <><GuideLine start={[-size, -0.25, third / 2]} end={[size, -0.25, third / 2]} color="#f59e0b" /><GuideLine start={[-size - 0.3, -0.25, -third / 2]} end={[-size - 0.3, second, -third / 2]} color="#8b5cf6" /><GuideLine start={[size + 0.25, -0.25, -third / 2]} end={[size + 0.25, -0.25, third / 2]} color="#ef4444" /><GuideLabel position={[0, -0.45, third / 2]} text="b" /><GuideLabel position={[-size - 0.55, second / 2, -third / 2]} text="h" /><GuideLabel position={[size + 0.45, -0.25, 0]} text="L" /></>;
  return <><GuideLine start={[0, 0, 0]} end={[size, 0, 0]} color="#f59e0b" /><GuideLine start={[size, 0, 0]} end={[size + second, 0, 0]} color="#8b5cf6" /><GuideLabel position={[size / 2, 0.2, 0]} text="R" /><GuideLabel position={[size + second / 2, 0.25, 0]} text="r" /></>;
}

function ExtrudedShapeGuides({ size, second }: { size: number; second: number }) {
  const span = Math.max(size, second);
  return (
    <>
      <GuideLine start={[-span, -span - 0.25, 0.46]} end={[span, -span - 0.25, 0.46]} color="#f59e0b" />
      <GuideLine start={[span + 0.24, -span, 0]} end={[span + 0.24, -span, 0.42]} color="#8b5cf6" />
      <GuideLabel position={[0, -span - 0.48, 0.46]} text="outline" />
      <GuideLabel position={[span + 0.38, -span, 0.24]} text="depth" />
    </>
  );
}

function GuideLine({ start, end, color }: { start: [number, number, number]; end: [number, number, number]; color: string }) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const length = direction.length();
  const midpoint = startVector.clone().add(direction.clone().multiplyScalar(0.5));
  const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
  return <mesh position={midpoint} quaternion={quaternion}><cylinderGeometry args={[0.018, 0.018, length, 10]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.15} /></mesh>;
}

function GuideLabel({ position, text }: { position: [number, number, number]; text: string }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.075, 16, 10]} />
        <meshStandardMaterial color="#f8fafc" emissive="#22d3ee" emissiveIntensity={0.25} />
      </mesh>
      <Text
        position={[0.18, 0.16, 0]}
        fontSize={0.28}
        color="#f8fafc"
        anchorX="left"
        anchorY="middle"
        outlineWidth={0.018}
        outlineColor="#0f172a"
      >
        {text}
      </Text>
    </group>
  );
}

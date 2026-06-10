import { Award, Box, Camera, Circle, Cuboid, Download, ExternalLink, Eye, Heart, Mic, Pause, Play, Printer, RefreshCw, RotateCcw, RotateCw, Search, Shapes, Sparkles, Star, Triangle, Volume2, Wand2, ZoomIn, ZoomOut } from "lucide-react";
import { OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ReactNode, useEffect, useMemo, useRef, useState, type PointerEvent, type RefObject } from "react";
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
  | "parallelogram" | "rhombus" | "trapezium" | "kite" | "pentagon" | "hexagon" | "heptagon" | "octagon" | "decagon" | "regular-polygon"
  | "annulus" | "quadrant" | "segment" | "crescent" | "star" | "cross"
  | "cube" | "cuboid" | "sphere" | "hemisphere" | "cylinder" | "hollow-cylinder" | "capsule" | "ellipsoid" | "cone" | "frustum" | "torus"
  | "tetrahedron" | "octahedron" | "dodecahedron" | "icosahedron" | "square-pyramid" | "triangular-pyramid" | "rectangular-pyramid"
  | "triangular-prism" | "pentagonal-prism" | "hexagonal-prism";

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
  { id: "pentagon", name: "Pentagon", kind: "2d", category: "2D Polygons", formula: "A = 5s^2/(4 tan(pi/5)), P = 5s", description: "A five-sided polygon.", dimensions: ["side"], use: "Badges, architecture, tiling studies." },
  { id: "hexagon", name: "Hexagon", kind: "2d", category: "2D Polygons", formula: "A = 3sqrt(3)s^2/2, P = 6s", description: "A six-sided polygon common in efficient packing.", dimensions: ["side"], use: "Honeycombs, bolts, grid maps." },
  { id: "heptagon", name: "Heptagon", kind: "2d", category: "2D Polygons", formula: "A = 7s^2/(4 tan(pi/7)), P = 7s", description: "A seven-sided polygon.", dimensions: ["side"], use: "Coins, decorative geometry, polygon classification." },
  { id: "octagon", name: "Octagon", kind: "2d", category: "2D Polygons", formula: "A = 2(1+sqrt(2))s^2, P = 8s", description: "An eight-sided polygon.", dimensions: ["side"], use: "Stop signs, floor patterns, design frames." },
  { id: "decagon", name: "Decagon", kind: "2d", category: "2D Polygons", formula: "A = 10s^2/(4 tan(pi/10)), P = 10s", description: "A ten-sided polygon.", dimensions: ["side"], use: "Circular approximations, ornaments, game tokens." },
  { id: "regular-polygon", name: "Regular Polygon", kind: "2d", category: "2D Polygons", formula: "A = n s^2 / (4 tan(pi/n)), P = ns", description: "All sides and angles are equal.", dimensions: ["side", "sides"], use: "Tiling, icons, nuts and bolts, meshes." },
  { id: "annulus", name: "Annulus", kind: "2d", category: "2D Curved", formula: "A = pi(R^2-r^2)", description: "A ring-shaped region between two concentric circles.", dimensions: ["outer radius", "inner radius"], use: "Washers, rings, tracks, gaskets." },
  { id: "quadrant", name: "Quadrant", kind: "2d", category: "2D Curved", formula: "A = 1/4 pi r^2, arc = 1/2 pi r", description: "One quarter of a circle.", dimensions: ["radius"], use: "Coordinate planes, rounded corners, quarter turns." },
  { id: "segment", name: "Circular Segment", kind: "2d", category: "2D Curved", formula: "A = sector area - triangle area", description: "A region cut from a circle by a chord.", dimensions: ["radius", "angle"], use: "Lenses, bridge arches, tank fill levels." },
  { id: "crescent", name: "Crescent", kind: "2d", category: "2D Curved", formula: "A = area(big circle) - overlap", description: "A moon-like shape made from two offset circular arcs.", dimensions: ["outer radius", "inner radius"], use: "Astronomy icons, logos, moon phases." },
  { id: "star", name: "Star Polygon", kind: "2d", category: "2D Polygons", formula: "A from alternating outer/inner radii", description: "A self-pointing polygon with alternating radii.", dimensions: ["outer radius", "inner radius"], use: "Flags, ratings, decorative geometry." },
  { id: "cross", name: "Cross Shape", kind: "2d", category: "2D Polygons", formula: "A = vertical rectangle + horizontal rectangle - overlap", description: "Two rectangles crossing at right angles.", dimensions: ["arm length", "arm width"], use: "Symbols, floor plans, structural layouts." },
  { id: "cube", name: "Cube", kind: "3d", category: "3D Solids", formula: "SA = 6s^2, V = s^3", description: "A solid with six equal square faces.", dimensions: ["side"], use: "Dice, voxels, packaging, 3D grids." },
  { id: "cuboid", name: "Cuboid", kind: "3d", category: "3D Solids", formula: "SA = 2(lw+lh+wh), V = lwh", description: "A rectangular box with length, width, and height.", dimensions: ["length", "width", "height"], use: "Rooms, cartons, tanks, containers." },
  { id: "sphere", name: "Sphere", kind: "3d", category: "3D Curved Solids", formula: "SA = 4 pi r^2, V = 4/3 pi r^3", description: "All surface points are the same distance from the center.", dimensions: ["radius"], use: "Planets, balls, bubbles, atoms." },
  { id: "hemisphere", name: "Hemisphere", kind: "3d", category: "3D Curved Solids", formula: "CSA = 2 pi r^2, TSA = 3 pi r^2, V = 2/3 pi r^3", description: "Half of a sphere with a circular base.", dimensions: ["radius"], use: "Domes, bowls, observatories." },
  { id: "cylinder", name: "Cylinder", kind: "3d", category: "3D Curved Solids", formula: "SA = 2 pi r(r+h), V = pi r^2 h", description: "Two circular bases connected by a curved surface.", dimensions: ["radius", "height"], use: "Cans, pipes, tanks, pistons." },
  { id: "hollow-cylinder", name: "Hollow Cylinder", kind: "3d", category: "3D Curved Solids", formula: "V = pi h(R^2-r^2)", description: "A tube with outer and inner circular radii.", dimensions: ["outer radius", "inner radius", "height"], use: "Pipes, sleeves, washers, ducts." },
  { id: "capsule", name: "Capsule", kind: "3d", category: "3D Curved Solids", formula: "V = pi r^2 h + 4/3 pi r^3", description: "A cylinder capped by two hemispheres.", dimensions: ["radius", "cylinder length"], use: "Pills, pressure vessels, game colliders." },
  { id: "ellipsoid", name: "Ellipsoid", kind: "3d", category: "3D Curved Solids", formula: "V = 4/3 pi abc", description: "A sphere stretched along three axes.", dimensions: ["axis a", "axis b", "axis c"], use: "Planets, lenses, probability clouds." },
  { id: "cone", name: "Cone", kind: "3d", category: "3D Curved Solids", formula: "SA = pi r(r+l), V = 1/3 pi r^2 h", description: "A circular base tapering to one point.", dimensions: ["radius", "height"], use: "Funnels, traffic cones, nozzles." },
  { id: "frustum", name: "Frustum", kind: "3d", category: "3D Curved Solids", formula: "V = 1/3 pi h(R^2 + Rr + r^2)", description: "A cone with its top cut off parallel to the base.", dimensions: ["radius", "top radius", "height"], use: "Buckets, lampshades, tapered columns." },
  { id: "tetrahedron", name: "Tetrahedron", kind: "3d", category: "3D Solids", formula: "V = s^3/(6sqrt(2))", description: "A polyhedron with four triangular faces.", dimensions: ["side"], use: "Molecular geometry, dice, meshes." },
  { id: "octahedron", name: "Octahedron", kind: "3d", category: "3D Solids", formula: "V = sqrt(2)s^3/3", description: "A polyhedron with eight triangular faces.", dimensions: ["side"], use: "Crystals, dice, symmetric models." },
  { id: "dodecahedron", name: "Dodecahedron", kind: "3d", category: "3D Solids", formula: "12 regular pentagonal faces", description: "A Platonic solid with twelve pentagonal faces.", dimensions: ["side"], use: "Dice, topology, symmetry studies." },
  { id: "icosahedron", name: "Icosahedron", kind: "3d", category: "3D Solids", formula: "20 equilateral triangular faces", description: "A Platonic solid with twenty triangular faces.", dimensions: ["side"], use: "Geodesic models, dice, meshes." },
  { id: "square-pyramid", name: "Square Pyramid", kind: "3d", category: "3D Solids", formula: "V = 1/3 s^2 h", description: "A square base rising to one apex.", dimensions: ["side", "height"], use: "Pyramids, roofs, monuments." },
  { id: "triangular-pyramid", name: "Triangular Pyramid", kind: "3d", category: "3D Solids", formula: "V = 1/3 Bh", description: "A pyramid with a triangular base.", dimensions: ["base side", "height"], use: "Tetrahedral models, roof geometry." },
  { id: "rectangular-pyramid", name: "Rectangular Pyramid", kind: "3d", category: "3D Solids", formula: "V = 1/3 lwh", description: "A rectangular base rising to one apex.", dimensions: ["length", "width", "height"], use: "Roofs, monuments, packaging." },
  { id: "triangular-prism", name: "Triangular Prism", kind: "3d", category: "3D Solids", formula: "V = 1/2 bhL", description: "A triangular face extruded through a length.", dimensions: ["base", "height", "length"], use: "Roof forms, wedges, optical prisms." },
  { id: "pentagonal-prism", name: "Pentagonal Prism", kind: "3d", category: "3D Solids", formula: "V = pentagon area * length", description: "A pentagonal face extruded through a length.", dimensions: ["side", "length"], use: "Columns, packaging, architecture." },
  { id: "hexagonal-prism", name: "Hexagonal Prism", kind: "3d", category: "3D Solids", formula: "V = 3sqrt(3)/2 s^2 h", description: "A hexagonal face extruded through a length.", dimensions: ["side", "length"], use: "Pencils, honeycomb cells, bolts." },
  { id: "torus", name: "Torus", kind: "3d", category: "3D Curved Solids", formula: "SA = 4 pi^2 Rr, V = 2 pi^2 Rr^2", description: "A doughnut-shaped solid with major and minor radii.", dimensions: ["major radius", "minor radius"], use: "Tires, O-rings, magnetic coils." },
];

const categories = ["All", "2D Basic", "2D Curved", "2D Polygons", "3D Solids", "3D Curved Solids"] as const;

export default function ShapesExplorer() {
  const { markTopicVisited, markTopicInteracted } = useProgress();
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [selectedId, setSelectedId] = useState<ShapeId>("circle");
  const [a, setA] = useState(4);
  const [b, setB] = useState(3);
  const [c, setC] = useState(5);
  const [sides, setSides] = useState(6);
  const [angle, setAngle] = useState(90);
  const [wireframe, setWireframe] = useState(false);
  const [viewZoom, setViewZoom] = useState(1);
  const [viewRotation, setViewRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [controlPaneWidth, setControlPaneWidth] = useState(30);
  const [viewPaneSplit, setViewPaneSplit] = useState(50);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const viewsRef = useRef<HTMLDivElement>(null);

  useEffect(() => markTopicVisited("shapes"), [markTopicVisited]);

  const selected = shapes.find((shape) => shape.id === selectedId) ?? shapes[0];
  const visibleShapes = useMemo(() => shapes.filter((shape) => category === "All" || shape.category === category), [category]);
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

  return (
    <div className="space-y-6" onPointerDown={() => markTopicInteracted("shapes")}>
      <TopicHeader
        title="2D and 3D Shapes Explorer"
        subtitle="Explore common plane figures and solid shapes visually with formulas, dimensions, surface area, volume, perimeter, and real-world uses."
        difficulty="Foundational"
        estimatedMinutes={35}
      />
      <KidsShapeStudio shapes={shapes} selected={selected} onSelect={selectShape} />

      <SectionCard title="Shape Library" description={`${shapes.length} shapes grouped by 2D and 3D families.`}>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                category === item ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-200"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {visibleShapes.map((shape) => {
            const Icon = shape.kind === "3d" ? Box : shape.id.includes("triangle") ? Triangle : shape.id === "circle" ? Circle : Shapes;
            const active = selected.id === shape.id;
            return (
              <button
                key={shape.id}
                type="button"
                onClick={() => selectShape(shape)}
                className={`min-h-[132px] rounded-2xl border p-4 text-left transition hover:-translate-y-1 ${
                  active ? "border-cyan-400 bg-cyan-50 shadow-lg shadow-cyan-500/10 dark:bg-cyan-400/10" : "border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-cyan-500" />
                  <span className="font-bold">{shape.name}</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">{shape.category}</p>
                <p className="mt-2 text-sm leading-5 text-slate-600 dark:text-slate-300">{shape.description}</p>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title={selected.name} description={selected.description}>
        <div
          ref={workspaceRef}
          className="grid gap-3 xl:min-h-[720px] xl:items-stretch"
          style={{ gridTemplateColumns: `minmax(280px, ${controlPaneWidth}%) 14px minmax(50%, 1fr)` }}
        >
          <div className="space-y-4 overflow-y-auto pr-1 xl:max-h-[78vh]">
            <FormulaBlock title={`${selected.name} Formulas`} formula={selected.formula} />
            <div className="rounded-2xl bg-cyan-50 p-4 text-sm leading-6 text-slate-700 dark:bg-cyan-400/10 dark:text-cyan-50">
              <p className="font-bold">Visual formula guide</p>
              <p className="mt-2">{formulaExplanation(selected.id, a, b, c, sides, angle)}</p>
            </div>
            <SliderControl label={primaryLabel(selected)} value={a} min={0.5} max={10} step={0.1} onChange={setA} />
            {needsSecond(selected.id) && <SliderControl label={secondLabel(selected)} value={b} min={0.5} max={10} step={0.1} onChange={setB} />}
            {needsThird(selected.id) && <SliderControl label={thirdLabel(selected)} value={c} min={0.5} max={12} step={0.1} onChange={setC} />}
            {selected.id === "regular-polygon" && <SliderControl label="Number of sides" value={sides} min={3} max={12} step={1} onChange={(value) => setSides(Math.round(value))} />}
            {selected.id === "sector" && <SliderControl label="Central angle" value={angle} min={5} max={360} step={1} onChange={setAngle} unit="deg" />}
            {selected.kind === "3d" && (
              <label className="flex items-center gap-3 rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10">
                <input type="checkbox" checked={wireframe} onChange={(event) => setWireframe(event.target.checked)} />
                Wireframe
              </label>
            )}
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(metrics).map(([label, value]) => (
                <Metric key={label} label={label} value={value} />
              ))}
            </div>
          </div>

          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Resize controls and visualization panes"
            className="hidden cursor-col-resize rounded-full bg-slate-200 transition hover:bg-cyan-400 dark:bg-white/10 dark:hover:bg-cyan-400 xl:block"
            onPointerDown={(event) => startPaneResize(event, workspaceRef, setControlPaneWidth, 20, 48)}
          />

          <div className="space-y-4">
            <ShapeViewControls
              kind={selected.kind}
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
            <div
              ref={viewsRef}
              className="grid gap-3 xl:min-h-[640px] xl:items-stretch"
              style={{ gridTemplateColumns: `minmax(280px, ${viewPaneSplit}%) 14px minmax(280px, 1fr)` }}
            >
              <VisualizationPane title="2D Pane" description="Exact plane view with live dimensions." badge={selected.kind === "2d" ? "native 2D" : "shadow view"}>
                <ShapeSvg shape={selected.id} a={a} b={b} c={c} sides={sides} angle={angle} zoom={viewZoom} rotation={viewRotation} />
              </VisualizationPane>

              <div
                role="separator"
                aria-orientation="vertical"
                aria-label="Resize 2D and 3D panes"
                className="hidden cursor-col-resize rounded-full bg-slate-200 transition hover:bg-cyan-400 dark:bg-white/10 dark:hover:bg-cyan-400 xl:block"
                onPointerDown={(event) => startPaneResize(event, viewsRef, setViewPaneSplit, 30, 70)}
              />

              <VisualizationPane title="3D Pane" description={selected.kind === "2d" ? "Extruded model from the 2D outline." : "Real solid with dimension guides."} badge={selected.kind === "2d" ? "extruded 3D" : "solid 3D"}>
                <ThreeSceneWrapper height="100%" mobileHeight="min(68vh, 390px)" interactionLabel="Drag rotate - pinch zoom">
                  <ambientLight intensity={0.75} />
                  <directionalLight position={[4, 5, 4]} intensity={1.35} />
                  <RotatingSolid shape={selected.id} a={a} b={b} c={c} wireframe={wireframe} zoom={viewZoom} rotation={viewRotation} autoRotate={autoRotate} sides={sides} />
                  <OrbitControls enablePan={false} enableZoom enableDamping />
                </ThreeSceneWrapper>
              </VisualizationPane>
            </div>

            <div className="rounded-2xl border border-dashed border-cyan-300/60 bg-cyan-50/70 p-3 text-xs font-bold text-cyan-900 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-100">
              Drag the vertical handles to resize. The visual workspace starts above 50% of this shape area, and the 2D/3D panes start at an equal split.
            </div>

            {false && <div className="hidden">
            {selected.kind === "2d" ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60 sm:p-4">
                <ShapeSvg shape={selected.id} a={a} b={b} c={c} sides={sides} angle={angle} zoom={viewZoom} rotation={viewRotation} />
              </div>
            ) : (
              <ThreeSceneWrapper height="520px" mobileHeight="min(68vh, 390px)" interactionLabel="Drag rotate • pinch zoom">
                <ambientLight intensity={0.75} />
                <directionalLight position={[4, 5, 4]} intensity={1.35} />
                <RotatingSolid shape={selected.id} a={a} b={b} c={c} wireframe={wireframe} zoom={viewZoom} rotation={viewRotation} autoRotate={autoRotate} />
                <OrbitControls enablePan={false} enableZoom enableDamping />
              </ThreeSceneWrapper>
            )}

            </div>}

            <div className="grid gap-3 md:grid-cols-3">
              <InfoTile label="Dimensions" value={selected.dimensions.join(", ")} />
              <InfoTile label="Current symbols" value={symbolSummary(selected.id, a, b, c, sides, angle)} />
              <InfoTile label="Type" value={selected.kind === "2d" ? "Plane shape" : "Solid shape"} />
              <InfoTile label="Used in" value={selected.use} />
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Formula Map">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {shapes.map((shape) => (
            <button key={shape.id} type="button" onClick={() => selectShape(shape)} className="rounded-2xl border border-slate-200 bg-white/70 p-4 text-left transition hover:border-cyan-300 dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-bold">{shape.name}</h3>
                <ExternalLink className="h-4 w-4 text-cyan-500" />
              </div>
              <p className="mt-2 font-mono text-xs leading-5 text-slate-600 dark:text-slate-300">{shape.formula}</p>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
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
  { object: "Washer", shape: "annulus" as ShapeId },
  { object: "Pencil", shape: "hexagonal-prism" as ShapeId },
  { object: "Pill", shape: "capsule" as ShapeId },
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
                  {(["triangle", "square", "circle", "rectangle", "hexagon", "star"] as ShapeId[]).map((shapeId) => <button key={shapeId} type="button" className="mini-chip" onClick={() => setCollage((items) => [...items, shapeId].slice(-6))}>Add {shapeName(shapeId)}</button>)}
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
                <div className="max-h-72 overflow-y-auto rounded-2xl border border-slate-200 dark:border-white/10">
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
                <div className="grid gap-2 md:grid-cols-5">{(["cube", "cylinder", "cone", "square-pyramid", "triangular-prism", "tetrahedron", "hexagonal-prism", "capsule", "ellipsoid", "torus"] as ShapeId[]).map((shapeId) => <button key={shapeId} type="button" onClick={() => selectAndTrack(shapeById(shapes, shapeId))} className="rounded-xl bg-slate-100 p-3 text-xs font-bold dark:bg-white/10">{shapeName(shapeId)}</button>)}</div>
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
  const sides: Partial<Record<ShapeId, number>> = { triangle: 3, "right-triangle": 3, square: 4, rectangle: 4, parallelogram: 4, rhombus: 4, trapezium: 4, kite: 4, pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8, decagon: 10, "regular-polygon": 6, star: 10, cross: 12 };
  const faces: Partial<Record<ShapeId, number>> = { cube: 6, cuboid: 6, cylinder: 3, "hollow-cylinder": 3, capsule: 3, cone: 2, "square-pyramid": 5, "triangular-pyramid": 4, "rectangular-pyramid": 5, "triangular-prism": 5, "pentagonal-prism": 7, "hexagonal-prism": 8, frustum: 3, sphere: 1, ellipsoid: 1, hemisphere: 2, torus: 1, tetrahedron: 4, octahedron: 8, dodecahedron: 12, icosahedron: 20 };
  const edges: Partial<Record<ShapeId, number>> = { cube: 12, cuboid: 12, cylinder: 2, "hollow-cylinder": 4, cone: 1, "square-pyramid": 8, "triangular-pyramid": 6, "rectangular-pyramid": 8, "triangular-prism": 9, "pentagonal-prism": 15, "hexagonal-prism": 18, frustum: 2, tetrahedron: 6, octahedron: 12, dodecahedron: 30, icosahedron: 30 };
  const vertices: Partial<Record<ShapeId, number>> = { cube: 8, cuboid: 8, cone: 1, "square-pyramid": 5, "triangular-pyramid": 4, "rectangular-pyramid": 5, "triangular-prism": 6, "pentagonal-prism": 10, "hexagonal-prism": 12, tetrahedron: 4, octahedron: 6, dodecahedron: 20, icosahedron: 12 };
  return { "2D/3D": shape.kind === "2d" ? 0 : 1, sides: sides[shape.id] ?? 0, corners: sides[shape.id] ?? vertices[shape.id] ?? 0, "curved edges": curved, symmetry: ["circle", "annulus", "square", "rectangle", "hexagon", "sphere", "cube", "torus"].includes(shape.id) ? 4 : 1, faces: faces[shape.id] ?? 0, vertices: vertices[shape.id] ?? 0, edges: edges[shape.id] ?? sides[shape.id] ?? 0 };
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
  if (isFixedRegularPolygon(id) || id === "regular-polygon") return `${polygonSideCount(id, sides)} equal sides of length s=${roundTo(a, 2)} form the perimeter. Area can be split into equal center triangles.`;
  if (id === "annulus") return `The outer radius R=${roundTo(a, 2)} and inner radius r=${roundTo(b, 2)} make a ring area by subtracting two circle areas.`;
  if (id === "quadrant") return `A quadrant is one-fourth of a full circle, so both area and arc length are one-fourth of their circle values.`;
  if (id === "segment") return `The chord cuts off a circular segment. Its area equals sector area minus the isosceles triangle area.`;
  if (id === "crescent") return `Two offset circular arcs make a crescent. Compare the larger disk with the overlapping smaller disk.`;
  if (id === "star") return `Outer radius R=${roundTo(a, 2)} and inner radius r=${roundTo(b, 2)} alternate around the center to form triangular spikes.`;
  if (id === "cross") return `A vertical rectangle and horizontal rectangle overlap at the center; subtract the overlap once to get area.`;
  if (id === "cube") return `Side s=${roundTo(a, 2)} builds 6 identical square faces and volume s*s*s.`;
  if (id === "cuboid") return `Length l=${roundTo(a, 2)}, breadth b=${roundTo(b, 2)}, and height h=${roundTo(c, 2)} multiply for volume.`;
  if (id === "sphere" || id === "hemisphere" || id === "ellipsoid") return `Radius or axes run from center to surface. Surface area and volume respond strongly to squared and cubed dimensions.`;
  if (id === "cylinder" || id === "hollow-cylinder" || id === "capsule") return `Circular radius r=${roundTo(a, 2)} builds the base area, then height or length h=${roundTo(b, 2)} extends it through space.`;
  if (id === "cone") return `Radius r=${roundTo(a, 2)}, height h=${roundTo(b, 2)}, and slant l=${roundTo(Math.hypot(a, b), 2)} define the curved surface and one-third cylinder volume.`;
  if (id === "frustum") return `Bottom radius R=${roundTo(a, 2)}, top radius r=${roundTo(b, 2)}, and height h=${roundTo(c, 2)} describe a sliced cone.`;
  if (id.includes("pyramid") || isPlatonicSolid(id)) return `The base area and height create a pyramid-style volume, while triangular faces reveal the solid's symmetry.`;
  if (id.includes("prism")) return `The base polygon area is extruded through length L=${roundTo(c, 2)} to create volume.`;
  return `Major radius R=${roundTo(a, 2)} goes around the ring; minor radius r=${roundTo(b, 2)} controls the tube thickness.`;
}

function symbolSummary(id: ShapeId, a: number, b: number, c: number, sides: number, angle: number) {
  if (["circle", "semicircle", "sphere", "hemisphere", "quadrant", "tetrahedron", "octahedron", "dodecahedron", "icosahedron"].includes(id)) return `r/s=${roundTo(a, 2)}`;
  if (id === "sector" || id === "segment") return `r=${roundTo(a, 2)}, theta=${roundTo(angle, 0)} deg`;
  if (id === "ellipse") return `a=${roundTo(a, 2)}, b=${roundTo(b, 2)}`;
  if (id === "annulus" || id === "crescent" || id === "star" || id === "torus" || id === "hollow-cylinder") return `R=${roundTo(a, 2)}, r=${roundTo(b, 2)}`;
  if (id === "rectangle" || id === "cross") return `l=${roundTo(a, 2)}, b=${roundTo(b, 2)}`;
  if (id === "triangle" || id === "right-triangle" || id === "parallelogram") return `b=${roundTo(a, 2)}, h=${roundTo(b, 2)}`;
  if (id === "square" || id === "cube" || isFixedRegularPolygon(id)) return `s=${roundTo(a, 2)}`;
  if (id === "rhombus" || id === "kite") return `d1=${roundTo(a, 2)}, d2=${roundTo(b, 2)}`;
  if (id === "trapezium") return `a=${roundTo(a, 2)}, b=${roundTo(b, 2)}, h=${roundTo(c, 2)}`;
  if (id === "regular-polygon") return `n=${sides}, s=${roundTo(a, 2)}`;
  if (id === "cuboid" || id === "ellipsoid" || id === "rectangular-pyramid") return `l/a=${roundTo(a, 2)}, b=${roundTo(b, 2)}, h/c=${roundTo(c, 2)}`;
  if (id === "cylinder" || id === "capsule") return `r=${roundTo(a, 2)}, h=${roundTo(b, 2)}`;
  if (id === "cone") return `r=${roundTo(a, 2)}, h=${roundTo(b, 2)}, l=${roundTo(Math.hypot(a, b), 2)}`;
  if (id === "frustum") return `R=${roundTo(a, 2)}, r=${roundTo(b, 2)}, h=${roundTo(c, 2)}`;
  if (id === "square-pyramid" || id === "triangular-pyramid") return `s=${roundTo(a, 2)}, h=${roundTo(b, 2)}`;
  if (id.includes("prism")) return `s/b=${roundTo(a, 2)}, h=${roundTo(b, 2)}, L=${roundTo(c, 2)}`;
  return `R=${roundTo(a, 2)}, r=${roundTo(b, 2)}`;
}

type ShapeViewControlsProps = {
  kind: ShapeKind;
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

function ShapeViewControls({ kind, zoom, rotation, autoRotate, onZoomIn, onZoomOut, onRotateLeft, onRotateRight, onReset, onToggleAutoRotate }: ShapeViewControlsProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 dark:border-white/10 dark:bg-slate-950/60 sm:flex-row sm:items-center sm:justify-between">
      <div className="mobile-safe-scroll flex gap-2 pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0">
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
        <span className="mini-chip">{kind === "2d" ? "2D + extruded 3D" : "solid 3D"}</span>
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

function VisualizationPane({ title, description, badge, children }: { title: string; description: string; badge: string; children: ReactNode }) {
  return (
    <div className="flex min-h-[390px] flex-col rounded-2xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-950/60 xl:min-h-[640px]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-cyan-600 dark:text-cyan-300">{title}</p>
          <p className="mt-1 text-sm leading-5 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 dark:bg-white/10 dark:text-slate-100">{badge}</span>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-950">
        {children}
      </div>
    </div>
  );
}

function startPaneResize(event: PointerEvent<HTMLDivElement>, containerRef: RefObject<HTMLDivElement | null>, setValue: (value: number) => void, min: number, max: number) {
  event.preventDefault();
  const container = containerRef.current;
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const pointerId = event.pointerId;
  event.currentTarget.setPointerCapture(pointerId);

  const handleMove = (moveEvent: globalThis.PointerEvent) => {
    const percent = ((moveEvent.clientX - rect.left) / Math.max(1, rect.width)) * 100;
    setValue(roundTo(Math.min(max, Math.max(min, percent)), 1));
  };

  const cleanup = () => {
    window.removeEventListener("pointermove", handleMove);
    window.removeEventListener("pointerup", cleanup);
    window.removeEventListener("pointercancel", cleanup);
  };

  window.addEventListener("pointermove", handleMove);
  window.addEventListener("pointerup", cleanup);
  window.addEventListener("pointercancel", cleanup);
}

function primaryLabel(shape: ShapeDefinition) {
  if (shape.id === "ellipse" || shape.id === "ellipsoid") return "Semi-major axis a";
  if (shape.id === "cuboid") return "Length";
  if (["torus", "annulus", "crescent", "star", "hollow-cylinder"].includes(shape.id)) return "Outer / major radius R";
  if (shape.id === "regular-polygon" || isFixedRegularPolygon(shape.id) || isPlatonicSolid(shape.id) || shape.id === "square" || shape.id === "cube" || shape.id.includes("pyramid")) return "Side";
  if (shape.id === "triangle" || shape.id === "right-triangle" || shape.id === "parallelogram" || shape.id === "trapezium" || shape.id.includes("prism")) return "Base / side";
  return "Radius";
}

function secondLabel(shape: ShapeDefinition) {
  if (shape.id === "ellipse" || shape.id === "ellipsoid" || shape.id === "rhombus" || shape.id === "kite") return "Second dimension";
  if (shape.id === "cuboid") return "Width";
  if (["torus", "annulus", "crescent", "star", "hollow-cylinder"].includes(shape.id)) return "Inner / minor radius r";
  if (shape.id === "trapezium" || shape.id === "frustum") return "Top radius / top base";
  return "Height";
}

function thirdLabel(shape: ShapeDefinition) {
  if (shape.id === "parallelogram") return "Side";
  if (shape.id === "triangular-prism") return "Length";
  return "Height";
}

function needsSecond(id: ShapeId) {
  return !["circle", "semicircle", "quadrant", "square", "pentagon", "hexagon", "heptagon", "octagon", "decagon", "cube", "sphere", "hemisphere", "tetrahedron", "octahedron", "dodecahedron", "icosahedron"].includes(id);
}

function needsThird(id: ShapeId) {
  return ["parallelogram", "trapezium", "cuboid", "frustum", "ellipsoid", "hollow-cylinder", "rectangular-pyramid", "triangular-prism", "pentagonal-prism", "hexagonal-prism"].includes(id);
}

function getMetrics(id: ShapeId, a: number, b: number, c: number, n: number, angle: number): Metrics {
  const fixedSides = polygonSideCount(id, n);
  switch (id) {
    case "circle": return { Circumference: 2 * Math.PI * a, Area: Math.PI * a * a };
    case "semicircle": return { "Arc length": Math.PI * a, Perimeter: Math.PI * a + 2 * a, Area: Math.PI * a * a / 2 };
    case "sector": return { "Arc length": angle / 360 * 2 * Math.PI * a, Area: angle / 360 * Math.PI * a * a };
    case "quadrant": return { "Arc length": Math.PI * a / 2, Area: Math.PI * a * a / 4, Perimeter: Math.PI * a / 2 + 2 * a };
    case "segment": return { "Arc length": angle / 360 * 2 * Math.PI * a, Area: (a * a / 2) * (((angle * Math.PI) / 180) - Math.sin((angle * Math.PI) / 180)) };
    case "ellipse": return { Area: Math.PI * a * b, "Approx perimeter": Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b))) };
    case "annulus": return { Area: Math.PI * (a * a - b * b), "Outer circumference": 2 * Math.PI * a, "Inner circumference": 2 * Math.PI * b };
    case "crescent": return { "Approx area": Math.max(0, Math.PI * (a * a - b * b * 0.72)), "Outer arc": Math.PI * a, "Inner arc": Math.PI * b };
    case "star": return { "Approx area": 5 * a * b * Math.sin((72 * Math.PI) / 180), Points: 5 };
    case "cross": return { Area: 2 * a * b - b * b, Perimeter: 4 * a + 8 * b };
    case "triangle": return { Area: a * b / 2, "Shown base": a, "Shown height": b };
    case "right-triangle": return { Area: a * b / 2, Hypotenuse: Math.hypot(a, b), Perimeter: a + b + Math.hypot(a, b) };
    case "square": return { Area: a * a, Perimeter: 4 * a, Diagonal: a * Math.SQRT2 };
    case "rectangle": return { Area: a * b, Perimeter: 2 * (a + b), Diagonal: Math.hypot(a, b) };
    case "parallelogram": return { Area: a * b, Perimeter: 2 * (a + c) };
    case "rhombus": return { Area: a * b / 2, Side: Math.hypot(a / 2, b / 2), Perimeter: 4 * Math.hypot(a / 2, b / 2) };
    case "trapezium": return { Area: (a + b) * c / 2, "Midline": (a + b) / 2 };
    case "kite": return { Area: a * b / 2 };
    case "regular-polygon":
    case "pentagon":
    case "hexagon":
    case "heptagon":
    case "octagon":
    case "decagon": return { Perimeter: fixedSides * a, Area: fixedSides * a * a / (4 * Math.tan(Math.PI / fixedSides)), Apothem: a / (2 * Math.tan(Math.PI / fixedSides)) };
    case "cube": return { "Surface area": 6 * a * a, Volume: a ** 3, Diagonal: a * Math.sqrt(3) };
    case "cuboid": return { "Surface area": 2 * (a * b + a * c + b * c), Volume: a * b * c, Diagonal: Math.hypot(a, b, c) };
    case "sphere": return { "Surface area": 4 * Math.PI * a * a, Volume: 4 / 3 * Math.PI * a ** 3 };
    case "hemisphere": return { "Curved area": 2 * Math.PI * a * a, "Total area": 3 * Math.PI * a * a, Volume: 2 / 3 * Math.PI * a ** 3 };
    case "cylinder": return { "Surface area": 2 * Math.PI * a * (a + b), Volume: Math.PI * a * a * b };
    case "hollow-cylinder": return { "Material volume": Math.PI * c * (a * a - b * b), "Outer area": 2 * Math.PI * a * c, "Inner area": 2 * Math.PI * b * c };
    case "capsule": return { "Surface area": 2 * Math.PI * a * b + 4 * Math.PI * a * a, Volume: Math.PI * a * a * b + 4 / 3 * Math.PI * a ** 3 };
    case "ellipsoid": return { Volume: 4 / 3 * Math.PI * a * b * c, "Mean radius": (a + b + c) / 3 };
    case "cone": return { "Slant height": Math.hypot(a, b), "Surface area": Math.PI * a * (a + Math.hypot(a, b)), Volume: Math.PI * a * a * b / 3 };
    case "frustum": return { "Slant height": Math.hypot(a - b, c), "Surface area": Math.PI * (a + b) * Math.hypot(a - b, c) + Math.PI * (a * a + b * b), Volume: Math.PI * c * (a * a + a * b + b * b) / 3 };
    case "tetrahedron": return { "Surface area": Math.sqrt(3) * a * a, Volume: a ** 3 / (6 * Math.sqrt(2)), Faces: 4 };
    case "octahedron": return { "Surface area": 2 * Math.sqrt(3) * a * a, Volume: Math.sqrt(2) * a ** 3 / 3, Faces: 8 };
    case "dodecahedron": return { Faces: 12, Edges: 30, Vertices: 20 };
    case "icosahedron": return { Faces: 20, Edges: 30, Vertices: 12 };
    case "square-pyramid": return { "Slant height": Math.hypot(a / 2, b), "Surface area": a * a + 2 * a * Math.hypot(a / 2, b), Volume: a * a * b / 3 };
    case "triangular-pyramid": return { "Base area": Math.sqrt(3) * a * a / 4, Volume: (Math.sqrt(3) * a * a / 4) * b / 3 };
    case "rectangular-pyramid": return { "Base area": a * b, Volume: a * b * c / 3 };
    case "triangular-prism": return { "Base area": a * b / 2, Volume: a * b * c / 2 };
    case "pentagonal-prism": return { "Base area": 5 * a * a / (4 * Math.tan(Math.PI / 5)), Volume: 5 * a * a * c / (4 * Math.tan(Math.PI / 5)) };
    case "hexagonal-prism": return { "Base area": 3 * Math.sqrt(3) * a * a / 2, Volume: 3 * Math.sqrt(3) * a * a * c / 2 };
    case "torus": return { "Surface area": 4 * Math.PI * Math.PI * a * b, Volume: 2 * Math.PI * Math.PI * a * b * b };
    default: return {};
  }
}

function isFixedRegularPolygon(id: ShapeId) {
  return ["pentagon", "hexagon", "heptagon", "octagon", "decagon"].includes(id);
}

function polygonSideCount(id: ShapeId, fallback: number) {
  const counts: Partial<Record<ShapeId, number>> = { pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8, decagon: 10 };
  return counts[id] ?? fallback;
}

function isPlatonicSolid(id: ShapeId) {
  return ["tetrahedron", "octahedron", "dodecahedron", "icosahedron"].includes(id);
}

function ShapeSvg({ shape, a, b, c, sides, angle, zoom, rotation }: { shape: ShapeId; a: number; b: number; c: number; sides: number; angle: number; zoom: number; rotation: number }) {
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
  const displaySides = polygonSideCount(shape, sides);
  const polygonPoints = Array.from({ length: displaySides }, (_, index) => {
    const theta = -Math.PI / 2 + (index * 2 * Math.PI) / displaySides;
    return `${cx + radius * Math.cos(theta)},${cy + radius * Math.sin(theta)}`;
  }).join(" ");
  const starPoints = Array.from({ length: 10 }, (_, index) => {
    const theta = -Math.PI / 2 + (index * Math.PI) / 5;
    const r = index % 2 === 0 ? radius : Math.max(24, Math.min(b * scale, radius * 0.62));
    return `${cx + r * Math.cos(theta)},${cy + r * Math.sin(theta)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 480 360" className="h-[300px] w-full sm:h-[360px]">
      <defs>
        <linearGradient id="shapeFill" x1="0" x2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <g transform={`translate(${cx} ${cy}) rotate(${rotation}) scale(${zoom}) translate(${-cx} ${-cy})`}>
        {shape === "circle" && <circle cx={cx} cy={cy} r={radius} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "semicircle" && <path d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy} L ${cx - radius} ${cy}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "sector" && <path d={`M ${cx} ${cy} L ${cx + radius} ${cy} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 0 ${sectorX} ${sectorY} Z`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "quadrant" && <path d={`M ${cx} ${cy} L ${cx + radius} ${cy} A ${radius} ${radius} 0 0 0 ${cx} ${cy - radius} Z`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "segment" && <path d={`M ${cx + radius} ${cy} A ${radius} ${radius} 0 ${angle > 180 ? 1 : 0} 0 ${sectorX} ${sectorY} L ${cx + radius} ${cy}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "ellipse" && <ellipse cx={cx} cy={cy} rx={Math.min(a * scale, 170)} ry={Math.min(b * scale, 120)} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "annulus" && <path d={`${ringPath(cx, cy, radius, Math.max(18, Math.min(b * scale, radius - 12)))}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" fillRule="evenodd" />}
        {shape === "crescent" && <path d={`M ${cx - radius * 0.35} ${cy - radius} A ${radius} ${radius} 0 1 0 ${cx - radius * 0.35} ${cy + radius} A ${Math.max(20, b * scale)} ${Math.max(20, b * scale)} 0 1 1 ${cx - radius * 0.35} ${cy - radius} Z`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "triangle" && <polygon points={`${cx - w / 2},${cy + h / 2} ${cx + w / 2},${cy + h / 2} ${cx},${cy - h / 2}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "right-triangle" && <polygon points={`${cx - w / 2},${cy + h / 2} ${cx + w / 2},${cy + h / 2} ${cx - w / 2},${cy - h / 2}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "square" && <rect x={cx - radius} y={cy - radius} width={radius * 2} height={radius * 2} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "rectangle" && <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "parallelogram" && <polygon points={`${cx - w / 2 + 45},${cy - h / 2} ${cx + w / 2},${cy - h / 2} ${cx + w / 2 - 45},${cy + h / 2} ${cx - w / 2},${cy + h / 2}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "rhombus" && <polygon points={`${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "trapezium" && <polygon points={`${cx - top / 2},${cy - height / 2} ${cx + top / 2},${cy - height / 2} ${cx + w / 2},${cy + height / 2} ${cx - w / 2},${cy + height / 2}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "kite" && <polygon points={`${cx},${cy - h / 2} ${cx + w / 2},${cy - 10} ${cx},${cy + h / 2} ${cx - w / 2},${cy - 10}`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {(shape === "regular-polygon" || isFixedRegularPolygon(shape)) && <polygon points={polygonPoints} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "star" && <polygon points={starPoints} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        {shape === "cross" && <path d={`M ${cx - b * scale / 2} ${cy - radius} H ${cx + b * scale / 2} V ${cy - b * scale / 2} H ${cx + radius} V ${cy + b * scale / 2} H ${cx + b * scale / 2} V ${cy + radius} H ${cx - b * scale / 2} V ${cy + b * scale / 2} H ${cx - radius} V ${cy - b * scale / 2} H ${cx - b * scale / 2} Z`} fill="url(#shapeFill)" stroke="#06b6d4" strokeWidth="4" />}
        <line x1="80" y1="310" x2="400" y2="310" stroke="#94a3b8" strokeDasharray="6 6" />
        <DimensionGuides2D shape={shape} cx={cx} cy={cy} radius={radius} w={w} h={h} top={top} height={height} sectorX={sectorX} sectorY={sectorY} />
      </g>
    </svg>
  );
}

function ringPath(cx: number, cy: number, outer: number, inner: number) {
  return `M ${cx - outer} ${cy} A ${outer} ${outer} 0 1 0 ${cx + outer} ${cy} A ${outer} ${outer} 0 1 0 ${cx - outer} ${cy} M ${cx - inner} ${cy} A ${inner} ${inner} 0 1 1 ${cx + inner} ${cy} A ${inner} ${inner} 0 1 1 ${cx - inner} ${cy}`;
}

function DimensionGuides2D({ shape, cx, cy, radius, w, h, top, height, sectorX, sectorY }: { shape: ShapeId; cx: number; cy: number; radius: number; w: number; h: number; top: number; height: number; sectorX: number; sectorY: number }) {
  const label = (x: number, y: number, text: string, color = "#0f172a") => <text x={x} y={y} fill={color} fontSize="15" fontWeight="700">{text}</text>;
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

function RotatingSolid({ shape, a, b, c, wireframe, zoom, rotation, autoRotate, sides }: { shape: ShapeId; a: number; b: number; c: number; wireframe: boolean; zoom: number; rotation: number; autoRotate: boolean; sides?: number }) {
  const ref = useRef<THREE.Mesh>(null);
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
  const meshScale: [number, number, number] = shape === "ellipsoid" ? [size, second, third] : [1, 1, 1];
  const extrudeDepth = Math.max(0.35, Math.min(1.4, third * 0.25));
  const polygonSides = polygonSideCount(shape, sides ?? 6);
  const is2DPolygon = shape === "regular-polygon" || isFixedRegularPolygon(shape);

  return (
    <group scale={zoom}>
      <mesh ref={ref} scale={meshScale}>
        {shape === "circle" && <cylinderGeometry args={[size, size, extrudeDepth, 72]} />}
        {shape === "semicircle" && <cylinderGeometry args={[size, size, extrudeDepth, 36, 1, false, 0, Math.PI]} />}
        {shape === "sector" && <cylinderGeometry args={[size, size, extrudeDepth, 48, 1, false, 0, Math.max(0.2, Math.min(Math.PI * 2, (Math.PI * 2 * 90) / 360))]} />}
        {shape === "ellipse" && <cylinderGeometry args={[1, 1, extrudeDepth, 72]} />}
        {shape === "annulus" && <torusGeometry args={[Math.max(0.2, size * 0.7), Math.max(0.08, Math.min(second, size) * 0.18), 18, 72]} />}
        {shape === "quadrant" && <cylinderGeometry args={[size, size, extrudeDepth, 24, 1, false, 0, Math.PI / 2]} />}
        {shape === "segment" && <cylinderGeometry args={[size, size, extrudeDepth, 32, 1, false, 0, Math.PI * 0.75]} />}
        {shape === "crescent" && <torusGeometry args={[Math.max(0.2, size * 0.72), Math.max(0.08, Math.min(second, size) * 0.14), 16, 72, Math.PI * 1.35]} />}
        {shape === "triangle" && <cylinderGeometry args={[size, size, extrudeDepth, 3]} />}
        {shape === "right-triangle" && <cylinderGeometry args={[size, size, extrudeDepth, 3]} />}
        {shape === "square" && <boxGeometry args={[size, size, extrudeDepth]} />}
        {shape === "rectangle" && <boxGeometry args={[size, second, extrudeDepth]} />}
        {shape === "parallelogram" && <boxGeometry args={[size, second, extrudeDepth]} />}
        {shape === "rhombus" && <octahedronGeometry args={[size, 0]} />}
        {shape === "trapezium" && <cylinderGeometry args={[Math.max(second, 0.2), size, extrudeDepth, 4]} />}
        {shape === "kite" && <octahedronGeometry args={[size, 0]} />}
        {is2DPolygon && <cylinderGeometry args={[size, size, extrudeDepth, polygonSides]} />}
        {shape === "star" && <torusKnotGeometry args={[Math.max(0.6, size * 0.5), Math.max(0.05, second * 0.08), 80, 8, 5, 2]} />}
        {shape === "cross" && <boxGeometry args={[size, Math.max(0.4, second * 0.45), extrudeDepth]} />}
        {shape === "cube" && <boxGeometry args={[size, size, size]} />}
        {shape === "cuboid" && <boxGeometry args={[size, second, third]} />}
        {shape === "sphere" && <sphereGeometry args={[size, 64, 36]} />}
        {shape === "hemisphere" && <sphereGeometry args={[size, 64, 24, 0, Math.PI * 2, 0, Math.PI / 2]} />}
        {shape === "cylinder" && <cylinderGeometry args={[size, size, second, 64]} />}
        {shape === "hollow-cylinder" && <cylinderGeometry args={[size, size, third, 64, 1, true]} />}
        {shape === "capsule" && <capsuleGeometry args={[size, second, 16, 32]} />}
        {shape === "ellipsoid" && <sphereGeometry args={[1, 64, 36]} />}
        {shape === "cone" && <coneGeometry args={[size, second, 64]} />}
        {shape === "frustum" && <cylinderGeometry args={[second, size, third, 64]} />}
        {shape === "tetrahedron" && <tetrahedronGeometry args={[size, 0]} />}
        {shape === "octahedron" && <octahedronGeometry args={[size, 0]} />}
        {shape === "dodecahedron" && <dodecahedronGeometry args={[size, 0]} />}
        {shape === "icosahedron" && <icosahedronGeometry args={[size, 0]} />}
        {shape === "square-pyramid" && <coneGeometry args={[size, second, 4]} />}
        {shape === "triangular-pyramid" && <coneGeometry args={[size, second, 3]} />}
        {shape === "rectangular-pyramid" && <coneGeometry args={[size, third, 4]} />}
        {shape === "triangular-prism" && <cylinderGeometry args={[size, size, third, 3]} />}
        {shape === "pentagonal-prism" && <cylinderGeometry args={[size, size, third, 5]} />}
        {shape === "hexagonal-prism" && <cylinderGeometry args={[size, size, third, 6]} />}
        {shape === "torus" && <torusGeometry args={[size, second, 24, 96]} />}
        <meshStandardMaterial color="#22d3ee" roughness={0.3} metalness={0.16} wireframe={wireframe} transparent opacity={wireframe ? 1 : 0.82} />
      </mesh>
      <group ref={guideRef}>
        <DimensionGuides3D shape={shape} size={size} second={second} third={third} />
      </group>
    </group>
  );
}

function DimensionGuides3D({ shape, size, second, third }: { shape: ShapeId; size: number; second: number; third: number }) {
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

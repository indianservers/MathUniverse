import { OrbitControls, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef, useState } from "react";
import { Box, ChevronDown, ChevronsLeft, ChevronsRight, Dices, Grid3X3, Palette, PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen, Pause, Play, RotateCcw } from "lucide-react";
import { FormulaBlock, MathErrorBox, MathLabLayout, ResultCard, StepPanel } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import { ApproxBadge, CopyResultButton, EmptyState, ExportImageButton, FullscreenButton, InfoCallout, LoadingSkeleton, PresetChips, ResetExampleButton } from "../components/ui/UiFeedback";
import { SurfaceSampleResult, generateSurfaceMeshData, sampleSurface } from "../utils/mathEngine/graph3dUtils";

const examples = [
  "x^2 + y^2",
  "sin(x) * cos(y)",
  "x^2 - y^2",
  "exp(-(x^2 + y^2))",
];

type SurfacePalette = "height" | "thermal" | "contour" | "mono";
type ObjectPosition = { x: number; y: number; z: number };

const initialObjectPosition: ObjectPosition = { x: 0, y: 0, z: 0 };

export default function MathLab3DGraphing() {
  const [expression, setExpression] = useState("sin(x) * cos(y)");
  const [xRange, setXRange] = useState(3);
  const [yRange, setYRange] = useState(3);
  const [resolution, setResolution] = useState(44);
  const [showGrid, setShowGrid] = useState(true);
  const [showBase, setShowBase] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [showWireframe, setShowWireframe] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [samplingAnimation, setSamplingAnimation] = useState(true);
  const [palette, setPalette] = useState<SurfacePalette>("height");
  const [objectPosition, setObjectPosition] = useState<ObjectPosition>(initialObjectPosition);
  const [cameraKey, setCameraKey] = useState(0);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [analysisOpen, setAnalysisOpen] = useState(true);
  const [surfaceExplanationOpen, setSurfaceExplanationOpen] = useState(true);
  const [sampleTableOpen, setSampleTableOpen] = useState(false);

  const surface = useMemo(() => sampleSurface(expression, -xRange, xRange, -yRange, yRange, resolution), [expression, xRange, yRange, resolution]);
  const sampleRows = useMemo(() => surface.grid.flatMap((row, rowIndex) => row.filter((_, colIndex) => rowIndex % Math.max(1, Math.floor(surface.grid.length / 4)) === 0 && colIndex % Math.max(1, Math.floor(row.length / 4)) === 0)).slice(0, 16), [surface.grid]);
  const surfaceSummary = [
    `Surface: z = ${expression}`,
    `Domain: x in [${-xRange}, ${xRange}], y in [${-yRange}, ${yRange}]`,
    `Resolution: ${resolution} x ${resolution}`,
    `Object position: x=${format(objectPosition.x)}, y=${format(objectPosition.y)}, z=${format(objectPosition.z)}`,
    `Minimum z: ${surface.minZ === null ? "no real values" : format(surface.minZ)}`,
    `Maximum z: ${surface.maxZ === null ? "no real values" : format(surface.maxZ)}`,
  ].join("\n");

  const notes = (
    <>
      <InfoCallout title="Common mistakes" tone="warning">
        <ul className="space-y-2">
          <li>Use z = f(x,y), not y = f(x).</li>
          <li>High resolution creates smoother meshes but can slow older devices.</li>
          <li>A saddle surface rises in one direction and falls in another.</li>
          <li>Color represents height, not temperature or density.</li>
        </ul>
      </InfoCallout>
      <InfoCallout title="Real-world use" tone="success">
        <div className="flex flex-wrap gap-2">
          {["multivariable calculus", "physics fields", "optimization", "machine learning loss surfaces", "engineering surfaces"].map((item) => <span key={item} className="mini-chip">{item}</span>)}
        </div>
      </InfoCallout>
    </>
  );

  return (
    <MathLabLayout
      title="3D Graphing Lab"
      subtitle="Render interactive surfaces z = f(x,y), rotate and zoom the view, tune the domain window, and inspect sampled height values."
      notes={notes}
      compactHeader
    >
      <div className={`grid min-h-0 gap-3 ${controlsOpen ? "xl:grid-cols-[300px_minmax(0,1fr)]" : "xl:grid-cols-[64px_minmax(0,1fr)]"}`}>
        <aside className="desktop-sidebar-panel scroll-panel thin-scrollbar space-y-3">
        <button
          type="button"
          className="tool-button w-full justify-between"
          onClick={() => setControlsOpen((value) => !value)}
          aria-label={controlsOpen ? "Collapse surface controls" : "Expand surface controls"}
        >
          {controlsOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          {controlsOpen && <span>Controls</span>}
          {controlsOpen && <ChevronsLeft className="h-4 w-4" />}
        </button>
        {controlsOpen ? (
        <>
        <SectionCard title="Surface Input" description="Enter a two-variable expression. You can include sin, cos, tan, sqrt, abs, ln, log, exp, pi, and e." compact>
          <div className="mb-3 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white/90 p-1.5 backdrop-blur dark:border-white/10 dark:bg-slate-950/90">
            <ResetExampleButton onClick={() => { setExpression("sin(x) * cos(y)"); setXRange(3); setYRange(3); setResolution(44); setCameraKey((value) => value + 1); }} />
            <button type="button" className="tool-button" onClick={tryRandom}><Dices className="h-4 w-4" />Try random</button>
            <CopyResultButton value={surface.error ? "" : surfaceSummary} />
          </div>
          <label className="text-sm font-bold text-slate-600 dark:text-slate-300">
            z =
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
            />
          </label>
          <MathErrorBox error={surface.error} />
          <div className="mt-4"><PresetChips examples={examples} onSelect={setExpression} /></div>
          <div className="mt-5 space-y-4">
            <SliderControl label="3D x range" min={1} max={8} step={0.25} value={xRange} onChange={setXRange} />
            <SliderControl label="3D y range" min={1} max={8} step={0.25} value={yRange} onChange={setYRange} />
            <SliderControl label="3D resolution" min={12} max={80} step={2} value={resolution} onChange={setResolution} />
          </div>
          {surface.warning && <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">{surface.warning}</p>}
        </SectionCard>
        <SectionCard title="Move Surface" description="Shift the whole graph in math coordinates. X moves left/right, Y moves across the base grid, and Z changes height." compact>
          <div className="mb-3 rounded-2xl border border-cyan-300/40 bg-cyan-400/10 p-3 text-sm font-bold text-cyan-900 dark:text-cyan-100">
            Position: x = {format(objectPosition.x)}, y = {format(objectPosition.y)}, z = {format(objectPosition.z)}
          </div>
          <div className="space-y-4">
            <SliderControl label="Object x position" min={-6} max={6} step={0.25} value={objectPosition.x} onChange={(value) => setObjectPosition((position) => ({ ...position, x: value }))} />
            <SliderControl label="Object y position" min={-6} max={6} step={0.25} value={objectPosition.y} onChange={(value) => setObjectPosition((position) => ({ ...position, y: value }))} />
            <SliderControl label="Object z height" min={-4} max={4} step={0.25} value={objectPosition.z} onChange={(value) => setObjectPosition((position) => ({ ...position, z: value }))} />
          </div>
          <button type="button" className="tool-button mt-4 w-full justify-center" onClick={() => setObjectPosition(initialObjectPosition)}>
            <RotateCcw className="h-4 w-4" />Reset object position
          </button>
        </SectionCard>
        </>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button type="button" className="tool-button aspect-square w-full p-0" onClick={() => setExpression("sin(x) * cos(y)")} aria-label="Load sine cosine surface"><Dices className="h-4 w-4" /></button>
            <button type="button" className="tool-button aspect-square w-full p-0" onClick={() => setCameraKey((value) => value + 1)} aria-label="Reset camera"><RotateCcw className="h-4 w-4" /></button>
          </div>
        )}
        </aside>

        <div className="min-w-0 space-y-3">
        <div className={`grid gap-3 ${analysisOpen ? "2xl:grid-cols-[minmax(0,1fr)_360px]" : ""}`}>
        <SectionCard title="Interactive 3D Surface" description="Drag to rotate. Scroll or pinch to zoom. The mesh is colored by height." compact tone="spotlight">
          <div id="surface-3d-panel" className="mb-3">
            {surface.error ? (
              <LoadingSkeleton label="Waiting for a valid z = f(x,y) surface" />
            ) : (
              <ThreeSceneWrapper key={cameraKey} height="clamp(560px, calc(100vh - 300px), 820px)" mobileHeight="560px" interactionLabel="Left drag rotate - wheel/pinch zoom - right drag pan" cameraPosition={[4, 3.2, 6]} fov={46} quality="high" chrome="cinematic" sceneLabel={autoRotate ? "3D graphing - rotating" : "3D graphing - paused"}>
                <color attach="background" args={["#020617"]} />
                <ambientLight intensity={0.72} />
                <directionalLight position={[5, 8, 6]} intensity={1.35} />
                <group position={toScenePosition(objectPosition)}>
                  <SurfaceMesh samples={surface} palette={palette} wireframe={showWireframe} />
                  <SamplingSweep samples={surface} active={samplingAnimation} />
                  {showPoints && <SamplePointCloud samples={surface} />}
                  {showBase && <BasePlane size={Math.max(xRange, yRange) * 2.08} />}
                  {showGrid && <gridHelper args={[Math.max(xRange, yRange) * 2.2, 18, "#38bdf8", "#334155"]} />}
                  {showAxes && <axesHelper args={[Math.max(xRange, yRange) * 1.25]} />}
                  {showLabels && <SurfaceLabels scale={Math.max(xRange, yRange) * 1.25} expression={expression} samples={surface} objectPosition={objectPosition} />}
                </group>
                <OrbitControls enablePan enableZoom enableDamping dampingFactor={0.08} autoRotate={autoRotate} autoRotateSpeed={0.7} />
              </ThreeSceneWrapper>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <SceneCheckbox label="Base" checked={showBase} onChange={setShowBase} />
            <SceneCheckbox label="Grid" checked={showGrid} onChange={setShowGrid} />
            <SceneCheckbox label="Coordinates" checked={showAxes} onChange={setShowAxes} />
            <SceneCheckbox label="Labels" checked={showLabels} onChange={setShowLabels} />
            <button type="button" className={showPoints ? "action-primary" : "tool-button"} onClick={() => setShowPoints((value) => !value)}><Box className="h-4 w-4" />Sample Points</button>
            <button type="button" className={showWireframe ? "action-primary" : "tool-button"} onClick={() => setShowWireframe((value) => !value)}><Grid3X3 className="h-4 w-4" />Wire</button>
            <button type="button" className={autoRotate ? "action-primary" : "tool-button"} onClick={() => setAutoRotate((value) => !value)}>
              {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {autoRotate ? "Pause" : "Rotate"}
            </button>
            <button type="button" className={samplingAnimation ? "action-primary" : "tool-button"} onClick={() => setSamplingAnimation((value) => !value)}>
              {samplingAnimation ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {samplingAnimation ? "Pause scan" : "Animate scan"}
            </button>
            <label className="tool-button">
              <Palette className="h-4 w-4" />
              <select className="bg-transparent text-sm font-bold outline-none" value={palette} onChange={(event) => setPalette(event.target.value as SurfacePalette)}>
                <option value="height">Height</option>
                <option value="thermal">Thermal</option>
                <option value="contour">Contour</option>
                <option value="mono">Mono</option>
              </select>
            </label>
            <button type="button" className="tool-button" onClick={() => setCameraKey((value) => value + 1)}><RotateCcw className="h-4 w-4" />Reset Camera</button>
            <FullscreenButton targetId="surface-3d-panel" />
            <ExportImageButton targetId="surface-3d-panel" filename="3d-surface.png" />
            <button type="button" className="tool-button" onClick={() => setAnalysisOpen((value) => !value)}>
              {analysisOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
              {analysisOpen ? "Hide details" : "Show details"}
            </button>
          </div>
        </SectionCard>

        {analysisOpen ? (
        <aside className="desktop-sidebar-panel scroll-panel thin-scrollbar space-y-3">
        <button
          type="button"
          className="tool-button w-full justify-between"
          onClick={() => setAnalysisOpen(false)}
          aria-label="Collapse surface explanation"
        >
          <PanelRightClose className="h-4 w-4" />
          <span>Surface details</span>
          <ChevronsRight className="h-4 w-4" />
        </button>
        <SectionCard title="Surface Explanation" compact>
          <button
            type="button"
            className="tool-button w-full justify-between"
            onClick={() => setSurfaceExplanationOpen((value) => !value)}
            aria-expanded={surfaceExplanationOpen}
          >
            <span>Surface Explanation</span>
            <ChevronDown className={`h-4 w-4 transition ${surfaceExplanationOpen ? "rotate-180" : ""}`} />
          </button>
          {surfaceExplanationOpen && (
            <div className="mt-3">
              <ApproxBadge />
              <FormulaBlock title="Entered Surface" formula={`z=${expression.replace(/\*/g, "\\cdot ")}`} />
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <Metric label="Domain window" value={`x in [${-xRange}, ${xRange}], y in [${-yRange}, ${yRange}]`} />
                <Metric label="Object position" value={`x=${format(objectPosition.x)}, y=${format(objectPosition.y)}, z=${format(objectPosition.z)}`} />
                <Metric label="Resolution" value={`${resolution} x ${resolution} samples`} />
                <Metric label="Minimum z" value={surface.minZ === null ? "No real values" : format(surface.minZ)} />
                <Metric label="Maximum z" value={surface.maxZ === null ? "No real values" : format(surface.maxZ)} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">This page samples the function numerically across the selected rectangle and creates a color-mapped mesh. Values outside the real domain are skipped.</p>
            </div>
          )}
        </SectionCard>

        <SectionCard title="Sample Points Table" description="Selected points from the current surface sampling grid." compact>
          <button
            type="button"
            className="tool-button w-full justify-between"
            onClick={() => setSampleTableOpen((value) => !value)}
            aria-expanded={sampleTableOpen}
          >
            <span>Sample Points Table</span>
            <ChevronDown className={`h-4 w-4 transition ${sampleTableOpen ? "rotate-180" : ""}`} />
          </button>
          {sampleTableOpen && sampleRows.length ? (
            <div className="thin-scrollbar max-h-72 overflow-auto rounded-xl border border-slate-200 dark:border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900"><tr><th className="p-3">x</th><th className="p-3">y</th><th className="p-3">z</th></tr></thead>
                <tbody>
                  {sampleRows.map((point) => (
                    <tr key={`${point.x}-${point.y}`} className="border-t border-slate-100 dark:border-white/10">
                      <td className="p-3 font-mono">{format(point.x)}</td>
                      <td className="p-3 font-mono">{format(point.y)}</td>
                      <td className="p-3 font-mono">{point.valid && point.z !== null ? format(point.z) : "undefined"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : sampleTableOpen ? (
            <EmptyState title="No surface samples" message="Enter a valid z = f(x,y) expression to fill the sample table." />
          ) : null}
        </SectionCard>
        </aside>
        ) : null}
        </div>
        {!analysisOpen && (
          <button type="button" className="tool-button w-fit" onClick={() => setAnalysisOpen(true)}>
            <PanelRightOpen className="h-4 w-4" />Show Surface Explanation
          </button>
        )}
        </div>
      </div>

      <StepPanel steps={[
        { title: "Compile z = f(x,y)", explanation: "The expression is parsed as a two-variable real function.", formula: "z=f(x,y)" },
        { title: "Sample a rectangular domain", explanation: "The lab evaluates z over an x-y grid and records invalid real values safely.", formula: "(x_i,y_j)\\mapsto z_{ij}" },
        { title: "Build a height mesh", explanation: "Neighboring sample points become triangles, with vertex color mapped to height.", result: "Drag, zoom, and adjust resolution to study the surface." },
      ]} />

      <ResultCard title="3D Graphing Status" result={<p className="font-semibold">This is an interactive Three.js surface graph, not a static image. Rotate, zoom, change ranges, change resolution, and inspect the numeric sample table.</p>} relatedTools={[{ label: "Graphing Calculator", route: "/math-lab/graphing-calculator" }, { label: "Linear Algebra Lab", route: "/math-lab/linear-algebra" }]} />
    </MathLabLayout>
  );

  function tryRandom() {
    setExpression(examples[Math.floor(Math.random() * examples.length)]);
    setCameraKey((value) => value + 1);
  }
}

function SurfaceMesh({ samples, palette, wireframe }: { samples: SurfaceSampleResult; palette: SurfacePalette; wireframe: boolean }) {
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
      <mesh geometry={geometry} scale={[1, verticalScale(samples), 1]} castShadow receiveShadow>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.42} metalness={0.08} />
      </mesh>
      {wireframe && (
        <mesh geometry={geometry} scale={[1, verticalScale(samples), 1]}>
          <meshBasicMaterial color="#e0f2fe" wireframe transparent opacity={0.22} />
        </mesh>
      )}
    </group>
  );
}

function SceneCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className={checked ? "action-primary cursor-pointer" : "tool-button cursor-pointer"}>
      <input className="h-4 w-4 accent-cyan-400" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/10">
      <p className="text-xs font-black uppercase text-slate-500">{label}</p>
      <p className="mt-2 break-words font-mono text-sm font-bold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function format(value: number) {
  if (!Number.isFinite(value)) return "undefined";
  if (Math.abs(value) < 1e-10) return "0";
  if (Math.abs(value) >= 10000 || Math.abs(value) < 0.001) return value.toExponential(3);
  return Number(value.toFixed(4)).toString();
}

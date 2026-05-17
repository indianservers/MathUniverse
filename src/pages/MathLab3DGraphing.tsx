import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useState } from "react";
import { Box, Grid3X3, RotateCcw, ScanSearch } from "lucide-react";
import { FormulaBlock, MathErrorBox, MathLabLayout, ResultCard, StepPanel } from "../components/math-lab/MathLabShared";
import SectionCard from "../components/ui/SectionCard";
import SliderControl from "../components/ui/SliderControl";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import { SurfaceSampleResult, generateSurfaceMeshData, sampleSurface } from "../utils/mathEngine/graph3dUtils";

const examples = [
  "x^2 + y^2",
  "sin(x) * cos(y)",
  "x^2 - y^2",
  "exp(-(x^2 + y^2))",
];

export default function MathLab3DGraphing() {
  const [expression, setExpression] = useState("sin(x) * cos(y)");
  const [xRange, setXRange] = useState(3);
  const [yRange, setYRange] = useState(3);
  const [resolution, setResolution] = useState(44);
  const [showGrid, setShowGrid] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [showPoints, setShowPoints] = useState(false);
  const [cameraKey, setCameraKey] = useState(0);

  const surface = useMemo(() => sampleSurface(expression, -xRange, xRange, -yRange, yRange, resolution), [expression, xRange, yRange, resolution]);
  const sampleRows = useMemo(() => surface.grid.flatMap((row, rowIndex) => row.filter((_, colIndex) => rowIndex % Math.max(1, Math.floor(surface.grid.length / 4)) === 0 && colIndex % Math.max(1, Math.floor(row.length / 4)) === 0)).slice(0, 16), [surface.grid]);

  const notes = (
    <>
      <SectionCard title="Common Mistakes">
        <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          <li>Use z = f(x,y), not y = f(x).</li>
          <li>High resolution creates smoother meshes but can slow older devices.</li>
          <li>A saddle surface rises in one direction and falls in another.</li>
          <li>Color represents height, not temperature or density.</li>
        </ul>
      </SectionCard>
      <SectionCard title="Real-World Use">
        <div className="flex flex-wrap gap-2">
          {["multivariable calculus", "physics fields", "optimization", "machine learning loss surfaces", "engineering surfaces"].map((item) => <span key={item} className="mini-chip">{item}</span>)}
        </div>
      </SectionCard>
    </>
  );

  return (
    <MathLabLayout
      title="3D Graphing Lab"
      subtitle="Render interactive surfaces z = f(x,y), rotate and zoom the view, tune the domain window, and inspect sampled height values."
      notes={notes}
    >
      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <SectionCard title="Surface Input" description="Enter a two-variable expression. You can include sin, cos, tan, sqrt, abs, ln, log, exp, pi, and e.">
          <label className="text-sm font-bold text-slate-600 dark:text-slate-300">
            z =
            <input
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white p-3 font-mono outline-none focus:border-cyan-400 dark:border-white/10 dark:bg-slate-950"
              value={expression}
              onChange={(event) => setExpression(event.target.value)}
            />
          </label>
          <MathErrorBox error={surface.error} />
          <div className="mt-4 flex flex-wrap gap-2">
            {examples.map((example) => <button key={example} type="button" className="mini-chip" onClick={() => setExpression(example)}>{example}</button>)}
          </div>
          <div className="mt-5 space-y-4">
            <SliderControl label="3D x range" min={1} max={8} step={0.25} value={xRange} onChange={setXRange} />
            <SliderControl label="3D y range" min={1} max={8} step={0.25} value={yRange} onChange={setYRange} />
            <SliderControl label="3D resolution" min={12} max={80} step={2} value={resolution} onChange={setResolution} />
          </div>
          {surface.warning && <p className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:bg-amber-400/10 dark:text-amber-100">{surface.warning}</p>}
        </SectionCard>

        <SectionCard title="Interactive 3D Surface" description="Drag to rotate. Scroll or pinch to zoom. The mesh is colored by height.">
          <div className="mb-4 flex flex-wrap gap-2">
            <button type="button" className={showGrid ? "action-primary" : "tool-button"} onClick={() => setShowGrid((value) => !value)}><Grid3X3 className="h-4 w-4" />Grid</button>
            <button type="button" className={showAxes ? "action-primary" : "tool-button"} onClick={() => setShowAxes((value) => !value)}><ScanSearch className="h-4 w-4" />Axes</button>
            <button type="button" className={showPoints ? "action-primary" : "tool-button"} onClick={() => setShowPoints((value) => !value)}><Box className="h-4 w-4" />Sample Points</button>
            <button type="button" className="tool-button" onClick={() => setCameraKey((value) => value + 1)}><RotateCcw className="h-4 w-4" />Reset Camera</button>
          </div>
          <ThreeSceneWrapper key={cameraKey} height="620px" mobileHeight="520px" interactionLabel="Drag rotate - scroll zoom">
            <color attach="background" args={["#020617"]} />
            <ambientLight intensity={0.72} />
            <directionalLight position={[5, 8, 6]} intensity={1.35} />
            <SurfaceMesh samples={surface} />
            {showPoints && <SamplePointCloud samples={surface} />}
            {showGrid && <gridHelper args={[Math.max(xRange, yRange) * 2.2, 18, "#38bdf8", "#334155"]} />}
            {showAxes && <axesHelper args={[Math.max(xRange, yRange) * 1.25]} />}
            <OrbitControls enableDamping dampingFactor={0.08} />
          </ThreeSceneWrapper>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Surface Explanation">
          <FormulaBlock title="Entered Surface" formula={`z=${expression.replace(/\*/g, "\\cdot ")}`} />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Metric label="Domain window" value={`x in [${-xRange}, ${xRange}], y in [${-yRange}, ${yRange}]`} />
            <Metric label="Resolution" value={`${resolution} x ${resolution} samples`} />
            <Metric label="Minimum z" value={surface.minZ === null ? "No real values" : format(surface.minZ)} />
            <Metric label="Maximum z" value={surface.maxZ === null ? "No real values" : format(surface.maxZ)} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">This page samples the function numerically across the selected rectangle and creates a color-mapped mesh. Values outside the real domain are skipped.</p>
        </SectionCard>

        <SectionCard title="Sample Points Table" description="Selected points from the current surface sampling grid.">
          <div className="max-h-96 overflow-auto rounded-2xl border border-slate-200 dark:border-white/10">
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
        </SectionCard>
      </div>

      <StepPanel steps={[
        { title: "Compile z = f(x,y)", explanation: "The expression is parsed as a two-variable real function.", formula: "z=f(x,y)" },
        { title: "Sample a rectangular domain", explanation: "The lab evaluates z over an x-y grid and records invalid real values safely.", formula: "(x_i,y_j)\\mapsto z_{ij}" },
        { title: "Build a height mesh", explanation: "Neighboring sample points become triangles, with vertex color mapped to height.", result: "Drag, zoom, and adjust resolution to study the surface." },
      ]} />

      <ResultCard title="3D Graphing Status" result={<p className="font-semibold">This is an interactive Three.js surface graph, not a static image. Rotate, zoom, change ranges, change resolution, and inspect the numeric sample table.</p>} />
    </MathLabLayout>
  );
}

function SurfaceMesh({ samples }: { samples: SurfaceSampleResult }) {
  const geometry = useMemo(() => {
    const data = generateSurfaceMeshData(samples);
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(data.positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(data.colors, 3));
    geom.setIndex(data.indices);
    geom.computeVertexNormals();
    return geom;
  }, [samples]);

  if (samples.error || !samples.grid.length) return null;
  return (
    <mesh geometry={geometry} scale={[1, verticalScale(samples), 1]}>
      <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.55} metalness={0.05} />
    </mesh>
  );
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

function verticalScale(samples: SurfaceSampleResult) {
  const span = Math.max(1, Math.abs(samples.maxZ ?? 1), Math.abs(samples.minZ ?? -1));
  return span > 8 ? 8 / span : 1;
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

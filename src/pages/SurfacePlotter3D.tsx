import { useMemo, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import SectionCard from "../components/ui/SectionCard";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import TopicHeader from "../components/ui/TopicHeader";
import { compileTwoVariableExpression } from "../utils/functionParser";
import { Box, FunctionSquare, Grid3X3, Palette } from "lucide-react";

type PlotPalette = "height" | "thermal" | "violet";

export default function SurfacePlotter3D() {
  const [expr, setExpr] = useState("sin(x)*cos(y)");
  const [wireframe, setWireframe] = useState(false);
  const [palette, setPalette] = useState<PlotPalette>("height");
  return (
    <div className="space-y-3">
      <TopicHeader title="3D Surface Plotter" subtitle="Input z = f(x, y) and render an interactive color-mapped mesh." difficulty="3D Visualizer" estimatedMinutes={10} />
      <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="desktop-sidebar-panel scroll-panel space-y-3 xl:sticky xl:top-24">
          <SectionCard title="Surface Function" compact>
            <label className="text-sm font-bold text-slate-600 dark:text-slate-300">
              z =
              <input className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 font-mono text-base dark:border-white/10 dark:bg-slate-950/60" value={expr} onChange={(event) => setExpr(event.target.value)} />
            </label>
          </SectionCard>
          <SectionCard title="Presets" compact>
            <div className="flex flex-wrap gap-2">
              {["sin(x)*cos(y)", "x^2-y^2", "exp(-(x^2+y^2))", "sin(x*y)"].map((item) => (
                <button key={item} type="button" className="mini-chip transition hover:bg-cyan-100 dark:hover:bg-cyan-300/15" onClick={() => setExpr(item)}>{item}</button>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="View" compact>
            <div className="grid gap-2">
              <button type="button" className={wireframe ? "action-primary" : "tool-button"} onClick={() => setWireframe((value) => !value)}><Grid3X3 className="h-4 w-4" />Wireframe</button>
              <label className="tool-button justify-start">
                <Palette className="h-4 w-4" />
                <select className="min-w-0 bg-transparent text-sm font-bold outline-none" value={palette} onChange={(event) => setPalette(event.target.value as PlotPalette)}>
                  <option value="height">Height</option>
                  <option value="thermal">Thermal</option>
                  <option value="violet">Violet</option>
                </select>
              </label>
            </div>
          </SectionCard>
          <SectionCard title="Read The Surface" compact>
            <div className="space-y-2 text-sm leading-5 text-slate-600 dark:text-slate-300">
              <p className="flex gap-2"><FunctionSquare className="mt-0.5 h-4 w-4 shrink-0 text-cyan-500" />The function maps every x-y point to a height z.</p>
              <p className="flex gap-2"><Box className="mt-0.5 h-4 w-4 shrink-0 text-violet-500" />Color follows height, so peaks and valleys are easier to scan.</p>
            </div>
          </SectionCard>
        </aside>
        <SectionCard title="Interactive Mesh" description="A premium 3D stage tuned for demos, lessons, and screen-recorded walkthroughs." compact tone="spotlight">
          <ThreeSceneWrapper height="calc(100vh - 190px)" mobileHeight="460px" interactionLabel="Drag rotate - scroll zoom" cameraPosition={[4, 3.4, 6]} fov={46} quality="high" chrome="cinematic" sceneLabel="Surface cinema">
            <ambientLight intensity={0.8} />
            <directionalLight position={[4, 8, 6]} intensity={1.4} />
            <SurfaceMesh expression={expr} wireframe={wireframe} palette={palette} />
            <gridHelper args={[8, 16, "#38bdf8", "#334155"]} />
            <OrbitControls enableDamping />
          </ThreeSceneWrapper>
        </SectionCard>
      </div>
    </div>
  );
}

function SurfaceMesh({ expression, wireframe, palette }: { expression: string; wireframe: boolean; palette: PlotPalette }) {
  const geometry = useMemo(() => {
    const fn = compileTwoVariableExpression(expression);
    const size = 52;
    const positions: number[] = [];
    const colors: number[] = [];
    const indices: number[] = [];
    const color = new THREE.Color();
    for (let iy = 0; iy < size; iy += 1) {
      const y = -3 + (iy / (size - 1)) * 6;
      for (let ix = 0; ix < size; ix += 1) {
        const x = -3 + (ix / (size - 1)) * 6;
        const z = Math.max(-3, Math.min(3, fn(x, y)));
        positions.push(x, z * 0.45, y);
        setSurfaceColor(color, (z + 3) / 6, palette);
        colors.push(color.r, color.g, color.b);
      }
    }
    for (let iy = 0; iy < size - 1; iy += 1) {
      for (let ix = 0; ix < size - 1; ix += 1) {
        const a = iy * size + ix;
        indices.push(a, a + 1, a + size, a + 1, a + size + 1, a + size);
      }
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, [expression, palette]);

  return (
    <group>
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.42} metalness={0.08} />
      </mesh>
      {wireframe && (
        <mesh geometry={geometry}>
          <meshBasicMaterial color="#e0f2fe" wireframe transparent opacity={0.22} />
        </mesh>
      )}
    </group>
  );
}

function setSurfaceColor(color: THREE.Color, ratio: number, palette: PlotPalette) {
  const clamped = Math.max(0, Math.min(1, ratio));
  if (palette === "thermal") color.setHSL(0.04 + 0.13 * clamped, 0.95, 0.38 + 0.25 * clamped);
  else if (palette === "violet") color.setHSL(0.62 + 0.11 * clamped, 0.75, 0.42 + 0.2 * clamped);
  else color.setHSL(0.58 - clamped * 0.33, 0.82, 0.52);
}

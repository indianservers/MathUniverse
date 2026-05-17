import { useMemo, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import SectionCard from "../components/ui/SectionCard";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import TopicHeader from "../components/ui/TopicHeader";
import { compileTwoVariableExpression } from "../utils/functionParser";

export default function SurfacePlotter3D() {
  const [expr, setExpr] = useState("sin(x)*cos(y)");
  return (
    <div className="space-y-6">
      <TopicHeader title="3D Surface Plotter" subtitle="Input z = f(x, y) and render an interactive color-mapped mesh." difficulty="3D Visualizer" estimatedMinutes={10} />
      <SectionCard title="Surface Function">
        <input className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono text-lg dark:border-white/10 dark:bg-slate-950/60" value={expr} onChange={(event) => setExpr(event.target.value)} />
      </SectionCard>
      <SectionCard title="Interactive Mesh">
        <ThreeSceneWrapper height="560px" interactionLabel="Drag rotate - scroll zoom">
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 8, 6]} intensity={1.4} />
          <SurfaceMesh expression={expr} />
          <gridHelper args={[8, 16, "#38bdf8", "#334155"]} />
          <OrbitControls enableDamping />
        </ThreeSceneWrapper>
      </SectionCard>
    </div>
  );
}

function SurfaceMesh({ expression }: { expression: string }) {
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
        color.setHSL(0.58 - (z + 3) * 0.055, 0.8, 0.55);
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
  }, [expression]);

  return <mesh geometry={geometry}><meshStandardMaterial vertexColors side={THREE.DoubleSide} roughness={0.55} metalness={0.05} /></mesh>;
}

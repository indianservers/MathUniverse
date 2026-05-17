import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import ThreeSceneWrapper from "../../components/three/ThreeSceneWrapper";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import VisualLearningPanel from "../../components/ui/VisualLearningPanel";
import { roundTo } from "../../utils/math";

type Shape = "cube" | "sphere" | "cylinder" | "cone" | "torus";

export default function Shape3DExplorer() {
  const [shape, setShape] = useState<Shape>("cube");
  const [size, setSize] = useState(2);
  const [height, setHeight] = useState(3);
  const [wireframe, setWireframe] = useState(false);
  const values = formulas(shape, size, height);

  return (
    <SectionCard title="3D Shape Explorer" description="Rotate, inspect, and compare surface area and volume formulas.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <label className="block rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-950/40">
            <span className="text-sm font-semibold">Shape</span>
            <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={shape} onChange={(e) => setShape(e.target.value as Shape)}>
              {["cube", "sphere", "cylinder", "cone", "torus"].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <SliderControl label="Size / radius" value={size} min={0.5} max={5} step={0.1} onChange={setSize} />
          {(shape === "cylinder" || shape === "cone") && <SliderControl label="Height" value={height} min={1} max={8} step={0.1} onChange={setHeight} />}
          <label className="flex items-center gap-3 rounded-2xl bg-slate-100 p-4 text-sm font-semibold dark:bg-white/10"><input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} /> Wireframe overlay</label>
          <div className="flex flex-wrap gap-2">
            <button className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-white/10" onClick={() => { setShape("cube"); setSize(1); }}>Unit cube</button>
            <button className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-white/10" onClick={() => { setShape("cylinder"); setSize(1.2); setHeight(6); }}>Tall cylinder</button>
            <button className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-white/10" onClick={() => { setShape("cone"); setSize(2.8); setHeight(2.2); }}>Wide cone</button>
            <button className="rounded-full bg-slate-100 px-3 py-2 text-xs font-semibold dark:bg-white/10" onClick={() => { setShape("sphere"); setSize(2.8); }}>Large sphere</button>
          </div>
          <div className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-white/10">
            <p className="font-semibold">Surface area: {values.areaFormula}</p>
            <p className="mt-2 font-semibold">Volume: {values.volumeFormula}</p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Area ≈ {roundTo(values.area, 2)} · Volume ≈ {roundTo(values.volume, 2)}</p>
          </div>
        </div>
        <ThreeSceneWrapper height="440px">
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 5, 4]} intensity={1.3} />
          <RotatingShape shape={shape} size={size} height={height} wireframe={wireframe} />
          <OrbitControls enablePan={false} />
        </ThreeSceneWrapper>
      </div>
      <div className="mt-6">
        <VisualLearningPanel
          concept="3D shapes connect dimensions to volume and surface area."
          formula={`Surface area: ${values.areaFormula}; Volume: ${values.volumeFormula}`}
          changes="Size/radius changes both area and volume. Height affects cylinders and cones."
          realWorldUse="Engineering, packaging, architecture, robotics, AR/VR, and game assets."
          steps={[`Select shape: ${shape}.`, `Read key dimensions: size/radius=${roundTo(size, 2)}${shape === "cylinder" || shape === "cone" ? `, height=${roundTo(height, 2)}` : ""}.`, `Surface area is about ${roundTo(values.area, 2)}.`, `Volume is about ${roundTo(values.volume, 2)}.`]}
          tasks={["Toggle wireframe.", "Try a unit cube.", "Make a tall cylinder.", "Compare sphere and cone volume."]}
        />
      </div>
    </SectionCard>
  );
}

function RotatingShape({ shape, size, height, wireframe }: { shape: Shape; size: number; height: number; wireframe: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => { if (ref.current) { ref.current.rotation.y += delta * 0.45; ref.current.rotation.x += delta * 0.18; } });
  return (
    <mesh ref={ref}>
      {shape === "cube" && <boxGeometry args={[size, size, size]} />}
      {shape === "sphere" && <sphereGeometry args={[size, 48, 32]} />}
      {shape === "cylinder" && <cylinderGeometry args={[size, size, height, 48]} />}
      {shape === "cone" && <coneGeometry args={[size, height, 48]} />}
      {shape === "torus" && <torusGeometry args={[size, size * 0.32, 24, 80]} />}
      <meshStandardMaterial color="#22d3ee" roughness={0.28} metalness={0.18} wireframe={wireframe} />
    </mesh>
  );
}

function formulas(shape: Shape, r: number, h: number) {
  if (shape === "cube") return { areaFormula: "6s²", volumeFormula: "s³", area: 6 * r * r, volume: r ** 3 };
  if (shape === "sphere") return { areaFormula: "4πr²", volumeFormula: "4/3πr³", area: 4 * Math.PI * r * r, volume: 4 / 3 * Math.PI * r ** 3 };
  if (shape === "cylinder") return { areaFormula: "2πr(r+h)", volumeFormula: "πr²h", area: 2 * Math.PI * r * (r + h), volume: Math.PI * r * r * h };
  if (shape === "cone") return { areaFormula: "πr(r+l)", volumeFormula: "1/3πr²h", area: Math.PI * r * (r + Math.hypot(r, h)), volume: Math.PI * r * r * h / 3 };
  return { areaFormula: "4π²Rr", volumeFormula: "2π²Rr²", area: 4 * Math.PI * Math.PI * r * (r * 0.32), volume: 2 * Math.PI * Math.PI * r * (r * 0.32) ** 2 };
}

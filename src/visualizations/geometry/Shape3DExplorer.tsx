import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Pause, Play } from "lucide-react";
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
  const [autoRotate, setAutoRotate] = useState(true);
  const values = formulas(shape, size, height);

  return (
    <SectionCard title="3D Shape Explorer" description="Rotate, inspect, and compare surface area and volume formulas." compact>
      <div className="grid gap-3 lg:grid-cols-[300px_1fr]">
        <div className="space-y-3">
          <label className="block rounded-xl border border-slate-200 bg-white/70 p-3 dark:border-white/10 dark:bg-slate-950/40">
            <span className="text-sm font-semibold">Shape</span>
            <select className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 dark:border-white/10 dark:bg-slate-900" value={shape} onChange={(e) => setShape(e.target.value as Shape)}>
              {["cube", "sphere", "cylinder", "cone", "torus"].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <SliderControl label="Size / radius" value={size} min={0.5} max={5} step={0.1} onChange={setSize} />
          {(shape === "cylinder" || shape === "cone") && <SliderControl label="Height" value={height} min={1} max={8} step={0.1} onChange={setHeight} />}
          <label className="flex items-center gap-3 rounded-xl bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10"><input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} /> Wireframe overlay</label>
          <button type="button" className={autoRotate ? "action-primary w-full justify-center" : "tool-button w-full justify-center"} onClick={() => setAutoRotate((value) => !value)}>
            {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {autoRotate ? "Pause rotation" : "Start rotation"}
          </button>
          <div className="flex flex-wrap gap-2">
            <button type="button" className="mini-chip" onClick={() => { setShape("cube"); setSize(1); }}>Unit cube</button>
            <button type="button" className="mini-chip" onClick={() => { setShape("cylinder"); setSize(1.2); setHeight(6); }}>Tall cylinder</button>
            <button type="button" className="mini-chip" onClick={() => { setShape("cone"); setSize(2.8); setHeight(2.2); }}>Wide cone</button>
            <button type="button" className="mini-chip" onClick={() => { setShape("sphere"); setSize(2.8); }}>Large sphere</button>
          </div>
          <div className="rounded-xl bg-slate-100 p-3 text-sm dark:bg-white/10">
            <p className="font-semibold">Surface area: {values.areaFormula}</p>
            <p className="mt-2 font-semibold">Volume: {values.volumeFormula}</p>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Area ~= {roundTo(values.area, 2)}; Volume ~= {roundTo(values.volume, 2)}</p>
          </div>
        </div>
        <ThreeSceneWrapper
          height="500px"
          cameraPosition={[3.8, 2.8, 5.6]}
          fov={46}
          quality="high"
          chrome="cinematic"
          sceneLabel={autoRotate ? "3D shape studio - rotating" : "3D shape studio - paused"}
          toolbar={(
            <button type="button" className={autoRotate ? "action-primary" : "tool-button"} onClick={() => setAutoRotate((value) => !value)}>
              {autoRotate ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {autoRotate ? "Pause" : "Start"}
            </button>
          )}
        >
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 5, 4]} intensity={1.3} />
          <RotatingShape shape={shape} size={size} height={height} wireframe={wireframe} autoRotate={autoRotate} />
          <gridHelper args={[8, 16, "#38bdf8", "#334155"]} position={[0, -2.8, 0]} />
          <OrbitControls enablePan={false} />
        </ThreeSceneWrapper>
      </div>
      <div className="mt-3">
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

function RotatingShape({ shape, size, height, wireframe, autoRotate }: { shape: Shape; size: number; height: number; wireframe: boolean; autoRotate: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current && autoRotate) {
      ref.current.rotation.y += delta * 0.45;
      ref.current.rotation.x += delta * 0.18;
    }
  });
  return (
    <group ref={ref}>
      <mesh castShadow receiveShadow>
        <ShapeGeometry shape={shape} size={size} height={height} />
        <meshStandardMaterial color="#22d3ee" roughness={0.26} metalness={0.2} transparent opacity={0.88} />
      </mesh>
      {wireframe && (
        <mesh>
          <ShapeGeometry shape={shape} size={size} height={height} />
          <meshBasicMaterial color="#f8fafc" wireframe transparent opacity={0.28} />
        </mesh>
      )}
    </group>
  );
}

function ShapeGeometry({ shape, size, height }: { shape: Shape; size: number; height: number }) {
  if (shape === "cube") return <boxGeometry args={[size, size, size]} />;
  if (shape === "sphere") return <sphereGeometry args={[size, 64, 40]} />;
  if (shape === "cylinder") return <cylinderGeometry args={[size, size, height, 64]} />;
  if (shape === "cone") return <coneGeometry args={[size, height, 64]} />;
  return <torusGeometry args={[size, size * 0.32, 28, 96]} />;
}

function formulas(shape: Shape, r: number, h: number) {
  if (shape === "cube") return { areaFormula: "6s^2", volumeFormula: "s^3", area: 6 * r * r, volume: r ** 3 };
  if (shape === "sphere") return { areaFormula: "4*pi*r^2", volumeFormula: "4/3*pi*r^3", area: 4 * Math.PI * r * r, volume: 4 / 3 * Math.PI * r ** 3 };
  if (shape === "cylinder") return { areaFormula: "2*pi*r(r+h)", volumeFormula: "pi*r^2*h", area: 2 * Math.PI * r * (r + h), volume: Math.PI * r * r * h };
  if (shape === "cone") return { areaFormula: "pi*r(r+l)", volumeFormula: "1/3*pi*r^2*h", area: Math.PI * r * (r + Math.hypot(r, h)), volume: Math.PI * r * r * h / 3 };
  return { areaFormula: "4*pi^2*R*r", volumeFormula: "2*pi^2*R*r^2", area: 4 * Math.PI * Math.PI * r * (r * 0.32), volume: 2 * Math.PI * Math.PI * r * (r * 0.32) ** 2 };
}

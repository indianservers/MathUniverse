import { Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BufferGeometry,
  Color,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  SRGBColorSpace,
  Vector3,
} from "three";
import { ArrowUpRight, MousePointer2, Pause, Play, Rotate3D } from "lucide-react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "../../hooks/useReducedMotion";

const SURFACE_COLORS = ["#4338ca", "#7c3aed", "#2563eb", "#06b6d4", "#67e8f9"].map((value) => new Color(value));
const POINT_COLORS = ["#5eead4", "#fbbf24", "#f472b6"];

const surfaceFunctions = [
  (x: number, z: number) => 0.84 * Math.sin(x * 1.18) * Math.cos(z * 1.08),
  (x: number, z: number) => 0.62 * Math.cos((x * x + z * z) * 0.58),
  (x: number, z: number) => 0.52 * Math.sin(x) + 0.52 * Math.cos(z),
];

function gradientColor(value: number) {
  const scaled = MathUtils.clamp((value + 1.05) / 2.1, 0, 1) * (SURFACE_COLORS.length - 1);
  const index = Math.min(Math.floor(scaled), SURFACE_COLORS.length - 2);
  return SURFACE_COLORS[index].clone().lerp(SURFACE_COLORS[index + 1], scaled - index);
}

function buildSurfaceGeometry(formula: number, mobile: boolean) {
  const count = mobile ? 34 : 56;
  const geometry = new BufferGeometry();
  const positions: number[] = [];
  const colors: number[] = [];
  const surface = surfaceFunctions[formula];
  for (let zIndex = 0; zIndex < count - 1; zIndex += 1) {
    for (let xIndex = 0; xIndex < count - 1; xIndex += 1) {
      const x0 = MathUtils.lerp(-3.8, 3.8, xIndex / (count - 1));
      const x1 = MathUtils.lerp(-3.8, 3.8, (xIndex + 1) / (count - 1));
      const z0 = MathUtils.lerp(-2.8, 2.8, zIndex / (count - 1));
      const z1 = MathUtils.lerp(-2.8, 2.8, (zIndex + 1) / (count - 1));
      const points = [
        [x0, surface(x0, z0), z0], [x1, surface(x1, z0), z0], [x1, surface(x1, z1), z1],
        [x0, surface(x0, z0), z0], [x1, surface(x1, z1), z1], [x0, surface(x0, z1), z1],
      ];
      points.forEach(([x, y, z]) => {
        positions.push(x, y, z);
        const color = gradientColor(y);
        colors.push(color.r, color.g, color.b);
      });
    }
  }
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();
  return geometry;
}

function DepthGrid({ mobile }: { mobile: boolean }) {
  const lines = useMemo(() => {
    const result: Array<{ points: Vector3[]; major: boolean }> = [];
    const extentX = 5;
    const extentZ = 4;
    const step = mobile ? 1 : 0.5;
    for (let value = -extentX; value <= extentX + .01; value += step) {
      result.push({ points: [new Vector3(value, -1.12, -extentZ), new Vector3(value, -1.12, extentZ)], major: Math.abs(value % 1) < .01 });
    }
    for (let value = -extentZ; value <= extentZ + .01; value += step) {
      result.push({ points: [new Vector3(-extentX, -1.12, value), new Vector3(extentX, -1.12, value)], major: Math.abs(value % 1) < .01 });
    }
    return result;
  }, [mobile]);
  return <group>{lines.map((line, index) => <Line key={index} points={line.points} color={line.major ? "#38bdf8" : "#6366f1"} transparent opacity={line.major ? .2 : .075} lineWidth={line.major ? .75 : .35} />)}</group>;
}

function Axis({ points, color, label, labelPosition }: { points: [number, number, number][]; color: string; label: string; labelPosition: [number, number, number] }) {
  return <group>
    <Line points={points} color={color} lineWidth={1.8} transparent opacity={.82} />
    <Text position={labelPosition} fontSize={.27} color="#f8fafc" outlineWidth={.012} outlineColor="#07142d">{label}</Text>
  </group>;
}

function GraphPoint({ position, color, selected, mobile }: { position: [number, number, number]; color: string; selected?: boolean; mobile: boolean }) {
  const mesh = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useFrame((_, delta) => {
    if (!mesh.current) return;
    const target = hovered ? 1.32 : selected ? 1.16 : 1;
    mesh.current.scale.setScalar(MathUtils.damp(mesh.current.scale.x, target, 10, delta));
  });
  const stop = (event: ThreeEvent<PointerEvent>) => event.stopPropagation();
  return <group position={position}>
    <mesh scale={1.75}><sphereGeometry args={[mobile ? .12 : .09, 18, 18]} /><meshBasicMaterial color={color} transparent opacity={.18} blending={AdditiveBlending} depthWrite={false} /></mesh>
    <mesh ref={mesh} onPointerOver={(event) => { stop(event); setHovered(true); document.body.style.cursor = "pointer"; }} onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}>
      <sphereGeometry args={[mobile ? .105 : .085, 24, 24]} />
      <meshStandardMaterial color={hovered ? "#ffffff" : color} emissive={color} emissiveIntensity={hovered ? 1.5 : .58} roughness={.28} metalness={.08} />
    </mesh>
  </group>;
}

function Surface({ running, formula, mobile }: { running: boolean; formula: number; mobile: boolean }) {
  const group = useRef<Group>(null);
  const geometry = useMemo(() => buildSurfaceGeometry(formula, mobile), [formula, mobile]);
  const trace = useMemo(() => Array.from({ length: mobile ? 56 : 96 }, (_, index) => {
    const x = MathUtils.lerp(-3.8, 3.8, index / (mobile ? 55 : 95));
    return new Vector3(x, surfaceFunctions[formula](x, 1.9) + .08, 1.9);
  }), [formula, mobile]);
  const points = useMemo(() => [-2.4, 0, 2.25].map((x) => [x, surfaceFunctions[formula](x, 1.9) + .08, 1.9] as [number, number, number]), [formula]);

  useFrame((_, delta) => { if (running && group.current) group.current.rotation.y += delta * 0.055; });

  return <group ref={group} rotation={[-0.13, -0.32, 0]} position={[1, .02, 0]}>
    <DepthGrid mobile={mobile} />
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial vertexColors side={DoubleSide} roughness={.4} metalness={.11} transparent opacity={.94} />
    </mesh>
    <mesh geometry={geometry} scale={1.006}>
      <meshBasicMaterial color="#67e8f9" wireframe transparent opacity={mobile ? .15 : .21} depthWrite={false} />
    </mesh>
    <mesh geometry={geometry} scale={1.018}>
      <meshBasicMaterial color="#22d3ee" transparent opacity={.055} side={DoubleSide} blending={AdditiveBlending} depthWrite={false} />
    </mesh>
    <Line points={trace} color="#22d3ee" lineWidth={mobile ? 7 : 6} transparent opacity={.19} />
    <Line points={trace} color="#a7f3d0" lineWidth={mobile ? 3.4 : 2.8} />
    {points.map((position, index) => <GraphPoint key={index} position={position} color={POINT_COLORS[index]} selected={index === 1} mobile={mobile} />)}
    <Axis points={[[-4.35, -1.05, 0], [4.45, -1.05, 0]]} color="#22d3ee" label="x" labelPosition={[4.58, -1.03, 0]} />
    <Axis points={[[0, -1.05, -3.25], [0, -1.05, 3.35]]} color="#8b5cf6" label="y" labelPosition={[0, -1.02, 3.52]} />
    <Axis points={[[0, -1.08, 0], [0, 1.75, 0]]} color="#5eead4" label="z" labelPosition={[0, 1.92, 0]} />
    <mesh position={[0, -1.05, 0]}><sphereGeometry args={[.075, 18, 18]} /><meshBasicMaterial color="#f8fafc" /></mesh>
  </group>;
}

export default function InteractiveMathHero() {
  const reducedMotion = useReducedMotion();
  const [running, setRunning] = useState(!reducedMotion);
  const [formula, setFormula] = useState(0);
  const [mobile, setMobile] = useState(() => typeof window !== "undefined" && window.innerWidth < 700);
  const formulas = ["z = sin(x) cos(y)", "z = cos(r^2) / 2", "z = sin(x) + cos(y)"];
  const descriptions = [
    "A smooth periodic surface with alternating peaks and valleys. Mint curve, gold selected point, magenta key point.",
    "A radial cosine surface with concentric peaks and valleys. Mint curve and colour-coded reference points.",
    "A combined sine and cosine surface showing independent variation along x and y.",
  ];

  return <section className="home-live-hero" aria-labelledby="home-live-title">
    <div className="home-live-scene" aria-label={`Interactive three-dimensional mathematical surface: ${formulas[formula]}. ${descriptions[formula]} Drag to rotate and scroll to zoom.`}>
      <Canvas camera={{ position: [6, 4.2, 7], fov: 42 }} dpr={mobile ? [1, 1.2] : [1, 1.65]} gl={{ antialias: true, alpha: true }} shadows onCreated={({ gl }) => { gl.outputColorSpace = SRGBColorSpace; gl.toneMapping = ACESFilmicToneMapping; gl.toneMappingExposure = 1.18; setMobile(window.innerWidth < 700); }}>
        <ambientLight intensity={.24} />
        <hemisphereLight args={["#dff8ff", "#090b2c", .58]} />
        <directionalLight position={[4.5, 7, 5]} intensity={2.15} color="#dff8ff" castShadow shadow-mapSize={[mobile ? 512 : 1024, mobile ? 512 : 1024]} />
        <pointLight position={[-4, 2.5, 2]} intensity={mobile ? 12 : 16} distance={12} color="#6366f1" />
        <pointLight position={[4, 1.5, -4]} intensity={mobile ? 10 : 14} distance={11} color="#22d3ee" />
        <Surface running={running && !reducedMotion} formula={formula} mobile={mobile} />
        <OrbitControls enablePan={false} minDistance={6} maxDistance={12} autoRotate={false} makeDefault />
      </Canvas>
    </div>
    <div className="home-live-copy">
      <div className="home-live-kickers"><span><MousePointer2 />Interactive preview</span><span><Rotate3D />Drag to rotate</span></div>
      <h1 id="home-live-title">See mathematics<br />come alive.</h1>
      <p>Explore formulas, proofs, graphs and geometry through interactive visual labs.</p>
      <div className="home-live-actions"><Link to="/math-lab"><Play />Start Exploring</Link><Link to="/problem-solver" className="secondary">Solve a Problem</Link><Link to="/visual-formulas" className="secondary">View Formulas</Link></div>
    </div>
    <div className="home-live-equation"><strong><i aria-hidden="true" />{formulas[formula]}</strong><span>Gradient surface · mint trace · three reference points</span><button type="button" onClick={() => setFormula((value) => (value + 1) % formulas.length)}>Change surface</button></div>
    <div className="home-live-controls"><button type="button" onClick={() => setRunning((value) => !value)} aria-label={running ? "Pause surface animation" : "Play surface animation"}>{running ? <Pause /> : <Play />}</button><Link to="/math-lab/3d-graphing">Open 3D Lab<ArrowUpRight /></Link></div>
  </section>;
}

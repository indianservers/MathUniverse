import { Line, OrbitControls, Text } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import ThreeSceneWrapper from "../../components/three/ThreeSceneWrapper";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import { roundTo } from "../../utils/math";

const maxTheta = Math.PI * 4;
const xScale = 0.55;

export default function EulerFormula3D() {
  const [theta, setTheta] = useState(Math.PI);
  const [speed, setSpeed] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [showHelix, setShowHelix] = useState(true);
  const [showCosine, setShowCosine] = useState(true);
  const [showSine, setShowSine] = useState(true);
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => setTheta((value) => (value + 0.025 * speed) % maxTheta), 24);
    return () => window.clearInterval(id);
  }, [playing, speed]);
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);

  return (
    <SectionCard title="Euler Formula 3D Helix" description="A complex rotation stretched along theta becomes a helix. Its shadows are sine and cosine waves.">
      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <div className="space-y-4">
          <SliderControl label="theta" value={theta} min={0} max={maxTheta} step={0.01} onChange={setTheta} unit="rad" />
          <SliderControl label="speed" value={speed} min={0.25} max={3} step={0.25} onChange={setSpeed} />
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-2xl bg-slate-950 px-4 py-3 text-white dark:bg-white dark:text-slate-950" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play"}</button>
            <button className="rounded-2xl bg-slate-100 px-4 py-3 font-semibold dark:bg-white/10" onClick={() => setTheta(0)}>Reset</button>
          </div>
          <div className="grid gap-2 text-sm">
            <label className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><input type="checkbox" checked={showHelix} onChange={(e) => setShowHelix(e.target.checked)} /> Helix</label>
            <label className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><input type="checkbox" checked={showCosine} onChange={(e) => setShowCosine(e.target.checked)} /> Cosine projection</label>
            <label className="flex items-center gap-3 rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><input type="checkbox" checked={showSine} onChange={(e) => setShowSine(e.target.checked)} /> Sine projection</label>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Metric label="theta" value={theta} />
            <Metric label="cos theta" value={cos} />
            <Metric label="sin theta" value={sin} />
            <Metric label="e^(i theta)" value={`${roundTo(cos, 3)} ${sin >= 0 ? "+" : "-"} ${Math.abs(roundTo(sin, 3))}i`} />
          </div>
          <p className="rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600 dark:bg-white/10 dark:text-slate-300">
            As theta increases, e^(i theta) moves around the unit circle. When theta is stretched along a separate axis, the circular motion becomes a helix. Its projections are the sine and cosine waves.
          </p>
        </div>
        <ThreeSceneWrapper height="520px">
          <EulerScene theta={theta} showHelix={showHelix} showCosine={showCosine} showSine={showSine} />
        </ThreeSceneWrapper>
      </div>
    </SectionCard>
  );
}

function EulerScene({ theta, showHelix, showCosine, showSine }: { theta: number; showHelix: boolean; showCosine: boolean; showSine: boolean }) {
  const { helix, cosCurve, sinCurve } = useMemo(() => {
    const h: THREE.Vector3[] = [];
    const c: THREE.Vector3[] = [];
    const s: THREE.Vector3[] = [];
    for (let i = 0; i <= 260; i += 1) {
      const t = (i / 260) * maxTheta;
      const x = t * xScale - 3.45;
      h.push(new THREE.Vector3(x, Math.cos(t), Math.sin(t)));
      c.push(new THREE.Vector3(x, Math.cos(t), -1.75));
      s.push(new THREE.Vector3(x, 1.75, Math.sin(t)));
    }
    return { helix: h, cosCurve: c, sinCurve: s };
  }, []);
  const x = theta * xScale - 3.45;
  const cos = Math.cos(theta);
  const sin = Math.sin(theta);
  const helixPoint = new THREE.Vector3(x, cos, sin);
  const cosPoint = new THREE.Vector3(x, cos, -1.75);
  const sinPoint = new THREE.Vector3(x, 1.75, sin);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 5, 6]} intensity={1.2} />
      <gridHelper args={[9, 18, "#334155", "#1e293b"]} position={[0, -1.35, 0]} />
      <Line points={[new THREE.Vector3(-3.7, 0, 0), new THREE.Vector3(3.7, 0, 0)]} color="#94a3b8" lineWidth={2} />
      <Line points={[new THREE.Vector3(-3.45, -2.1, 0), new THREE.Vector3(-3.45, 2.1, 0)]} color="#3b82f6" lineWidth={2} />
      <Line points={[new THREE.Vector3(-3.45, 0, -2.1), new THREE.Vector3(-3.45, 0, 2.1)]} color="#ef4444" lineWidth={2} />
      <Text position={[3.95, 0, 0]} fontSize={0.18} color="#e2e8f0">theta</Text>
      <Text position={[-3.45, 2.32, 0]} fontSize={0.18} color="#60a5fa">Re = cos</Text>
      <Text position={[-3.45, 0, 2.32]} fontSize={0.18} color="#f87171">Im = sin</Text>
      {showHelix && <Line points={helix} color="#22c55e" lineWidth={4} />}
      {showCosine && <Line points={cosCurve} color="#3b82f6" lineWidth={3} />}
      {showSine && <Line points={sinCurve} color="#ef4444" lineWidth={3} />}
      {showCosine && <Line points={[helixPoint, cosPoint]} color="#60a5fa" lineWidth={1.5} dashed />}
      {showSine && <Line points={[helixPoint, sinPoint]} color="#f87171" lineWidth={1.5} dashed />}
      {showHelix && <Marker position={helixPoint} color="#22c55e" />}
      {showCosine && <Marker position={cosPoint} color="#3b82f6" />}
      {showSine && <Marker position={sinPoint} color="#ef4444" />}
      <OrbitControls enableDamping />
    </>
  );
}

function Marker({ position, color }: { position: THREE.Vector3; color: string }) {
  return <mesh position={position}><sphereGeometry args={[0.08, 24, 16]} /><meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} /></mesh>;
}

function Metric({ label, value }: { label: string; value: number | string }) {
  return <div className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10"><p className="text-xs text-slate-500">{label}</p><p className="font-bold">{typeof value === "number" ? roundTo(value, 3) : value}</p></div>;
}

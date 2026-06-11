import { Line, OrbitControls, Text } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import ThreeSceneWrapper from "../components/three/ThreeSceneWrapper";
import SectionCard from "../components/ui/SectionCard";
import SliderControl, { SliderGroup } from "../components/ui/SliderControl";
import TopicHeader from "../components/ui/TopicHeader";
import TopicTabs from "../components/ui/TopicTabs";
import { topics } from "../data/topics";
import { useProgress } from "../hooks/useProgress";
import { roundTo } from "../utils/math";

const numberConcepts = [
  { title: "Natural Numbers", set: "N", note: "Counting numbers: 1, 2, 3, ...", example: "5" },
  { title: "Whole Numbers", set: "W", note: "Natural numbers plus 0.", example: "0" },
  { title: "Integers", set: "Z", note: "Positive, negative, and zero values.", example: "-7" },
  { title: "Rational Numbers", set: "Q", note: "Numbers expressible as p/q where q is not 0.", example: "-5/8" },
  { title: "Terminating Decimals", set: "Q", note: "Rationals whose reduced denominator has only factors 2 and 5.", example: "0.125" },
  { title: "Repeating Decimals", set: "Q", note: "Rationals with a repeating decimal block.", example: "0.333..." },
  { title: "Irrational Numbers", set: "R\\Q", note: "Non-terminating, non-repeating decimals.", example: "sqrt(2), pi" },
  { title: "Real Numbers", set: "R", note: "All rational and irrational points on the number line.", example: "every point" },
  { title: "Density", set: "R", note: "Between any two real numbers, more rationals and irrationals exist.", example: "(a+b)/2" },
  { title: "Surds", set: "R\\Q", note: "Roots that cannot simplify to rational numbers.", example: "sqrt(18)=3sqrt(2)" },
  { title: "Decimal Expansion Test", set: "Q or R\\Q", note: "Terminating/repeating means rational; non-repeating means irrational.", example: "0.101001..." },
  { title: "Real Number Hierarchy", set: "N subset W subset Z subset Q subset R", note: "Number sets nest, while irrationals share the real line outside Q.", example: "sqrt(3) in R, not Q" },
];

export default function NumberSystems() {
  const topic = topics.find((item) => item.id === "number-systems")!;
  const { getTopicProgress, markTopicVisited, markTopicInteracted } = useProgress();
  const [p, setP] = useState(5);
  const [q, setQ] = useState(8);
  const [root, setRoot] = useState(2);
  const [digits, setDigits] = useState(8);

  useEffect(() => markTopicVisited(topic.id), [markTopicVisited, topic.id]);

  const rational = p / Math.max(1, q);
  const irrational = Math.sqrt(root);
  const decimal = useMemo(() => rational.toFixed(Math.round(digits)), [rational, digits]);

  return (
    <div className="space-y-3" onPointerDown={() => markTopicInteracted(topic.id)}>
      <TopicHeader title={topic.title} subtitle={topic.description} difficulty={topic.difficulty} estimatedMinutes={topic.estimatedMinutes} progress={getTopicProgress(topic.id)} />
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <TopicTabs
            tabs={[
              { id: "rational", label: "Rational", content: <RationalLab p={p} q={q} setP={setP} setQ={setQ} decimal={decimal} /> },
              { id: "irrational", label: "Irrational", content: <IrrationalLab root={root} setRoot={setRoot} digits={digits} setDigits={setDigits} /> },
              { id: "real-line", label: "Real Line", content: <RealLineLab rational={rational} irrational={irrational} /> },
              { id: "space", label: "3D View", content: <NumberSystem3D rational={rational} irrational={irrational} /> },
              { id: "concepts", label: "Concepts", content: <ConceptGrid /> },
            ]}
          />
        </div>
        <aside className="desktop-sidebar-panel scroll-panel space-y-3 xl:sticky xl:top-24">
          <SectionCard title="Fast NCERT Links" compact>
            <div className="grid gap-2">
              <Link className="tool-button justify-start" to="/ncert/class-7-rational-numbers">Class 7 rational lab</Link>
              <Link className="tool-button justify-start" to="/ncert/class-8-rational-numbers">Class 8 rational properties</Link>
              <Link className="tool-button justify-start" to="/ncert/class-9-number-systems">Class 9 number systems</Link>
              <Link className="tool-button justify-start" to="/ncert/class-10-real-numbers">Class 10 real numbers</Link>
            </div>
          </SectionCard>
          <SectionCard title="Coverage" compact>
            <div className="flex flex-wrap gap-2">
              {["JEE", "NCERT", "Degree bridge", "Real analysis base"].map((item) => <span key={item} className="mini-chip">{item}</span>)}
            </div>
          </SectionCard>
        </aside>
      </div>
    </div>
  );
}

function RationalLab({ p, q, setP, setQ, decimal }: { p: number; q: number; setP: (value: number) => void; setQ: (value: number) => void; decimal: string }) {
  const value = p / Math.max(1, q);
  return (
    <SectionCard title="Rational Numbers" description="Move p and q to see p/q as a point, fraction, and decimal." compact>
      <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-3">
          <SliderGroup title="Fraction controls">
            <SliderControl density="compact" label="numerator p" value={p} min={-24} max={24} step={1} onChange={setP} />
            <SliderControl density="compact" label="denominator q" value={q} min={1} max={24} step={1} onChange={setQ} />
          </SliderGroup>
          <Metric label="fraction" value={`${p}/${q}`} />
          <Metric label="decimal" value={decimal} />
          <Metric label="value" value={roundTo(value, 5).toString()} />
        </div>
        <NumberLine values={[{ label: `${p}/${q}`, value, color: "#06b6d4" }]} />
      </div>
    </SectionCard>
  );
}

function IrrationalLab({ root, setRoot, digits, setDigits }: { root: number; setRoot: (value: number) => void; digits: number; setDigits: (value: number) => void }) {
  const value = Math.sqrt(root);
  const rational = isPerfectSquare(root);
  return (
    <SectionCard title="Irrational Numbers" description="Roots of non-perfect squares produce decimal values that do not terminate or repeat." compact>
      <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-3">
          <SliderGroup title="Root controls">
            <SliderControl density="compact" label="root n in sqrt(n)" value={root} min={2} max={50} step={1} onChange={setRoot} />
            <SliderControl density="compact" label="decimal digits" value={digits} min={2} max={14} step={1} onChange={setDigits} />
          </SliderGroup>
          <Metric label="sqrt(n)" value={value.toFixed(Math.round(digits))} />
          <Metric label="classification" value={rational ? "rational perfect square" : "irrational surd"} />
        </div>
        <NumberLine values={[{ label: `sqrt(${root})`, value, color: rational ? "#10b981" : "#f59e0b" }]} />
      </div>
    </SectionCard>
  );
}

function RealLineLab({ rational, irrational }: { rational: number; irrational: number }) {
  const midpoint = (rational + irrational) / 2;
  return (
    <SectionCard title="Real Number Line" description="Rational and irrational values share one continuous line; between any two, more values exist." compact>
      <NumberLine values={[{ label: "rational", value: rational, color: "#06b6d4" }, { label: "irrational", value: irrational, color: "#f59e0b" }, { label: "between", value: midpoint, color: "#ec4899" }]} />
      <div className="mt-3 grid gap-2 md:grid-cols-3">
        <Metric label="rational" value={roundTo(rational, 4).toString()} />
        <Metric label="irrational" value={roundTo(irrational, 4).toString()} />
        <Metric label="one point between" value={roundTo(midpoint, 4).toString()} />
      </div>
    </SectionCard>
  );
}

function NumberSystem3D({ rational, irrational }: { rational: number; irrational: number }) {
  const min = -4;
  const max = 8;
  const clamp = (value: number) => Math.max(min, Math.min(max, value));
  const map = (value: number) => -4.2 + ((clamp(value) - min) / (max - min)) * 8.4;
  const rationalX = map(rational);
  const irrationalX = map(irrational);
  const midpointX = map((rational + irrational) / 2);
  const linePoints = Array.from({ length: 160 }, (_, index) => {
    const x = -4.2 + (index / 159) * 8.4;
    return new THREE.Vector3(x, -1.15, 0);
  });

  return (
    <SectionCard title="3D Number Systems" description="Nested set rings and a real-number rail show where rationals, irrationals, and real numbers sit together." compact>
      <ThreeSceneWrapper height="520px" mobileHeight="420px" cameraPosition={[5, 3.4, 6.5]} fov={43} quality="high" chrome="cinematic" sceneLabel="number systems 3D" interactionLabel="Drag rotate - scroll zoom">
        <OrbitControls enableDamping makeDefault />
        <gridHelper args={[9, 18, "#38bdf8", "#334155"]} position={[0, -1.35, 0]} />
        <Line points={linePoints} color="#e0f2fe" lineWidth={4} />
        <NumberPoint x={rationalX} z={-0.55} color="#22d3ee" label="rational Q" value={rational} />
        <NumberPoint x={irrationalX} z={0.55} color="#f59e0b" label="irrational R\\Q" value={irrational} />
        <NumberPoint x={midpointX} z={0} color="#ec4899" label="between" value={(rational + irrational) / 2} />
        <SetRing radius={1.05} y={0.05} color="#22d3ee" label="N" />
        <SetRing radius={1.45} y={0.42} color="#10b981" label="W" />
        <SetRing radius={1.86} y={0.79} color="#f59e0b" label="Z" />
        <SetRing radius={2.28} y={1.16} color="#8b5cf6" label="Q" />
        <SetRing radius={2.72} y={1.53} color="#ec4899" label="R" />
        <Text position={[-4.1, 2.65, 0]} fontSize={0.22} color="#e0f2fe" anchorX="left">N subset W subset Z subset Q subset R, with irrationals also inside R</Text>
      </ThreeSceneWrapper>
    </SectionCard>
  );
}

function NumberPoint({ x, z, color, label, value }: { x: number; z: number; color: string; label: string; value: number }) {
  return (
    <group position={[x, -1.02, z]}>
      <mesh castShadow>
        <sphereGeometry args={[0.13, 24, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Line points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.85, 0)]} color={color} lineWidth={2} />
      <Text position={[0, 1.05, 0]} fontSize={0.16} color="#f8fafc" anchorX="center">{`${label}: ${roundTo(value, 3)}`}</Text>
    </group>
  );
}

function SetRing({ radius, y, color, label }: { radius: number; y: number; color: string; label: string }) {
  return (
    <group position={[0, y, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.025, 12, 96]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} />
      </mesh>
      <Text position={[radius + 0.22, 0, 0]} fontSize={0.18} color={color}>{label}</Text>
    </group>
  );
}

function ConceptGrid() {
  return (
    <SectionCard title="Number System Concepts" description="Compact coverage of rational, irrational, and real-number ideas." compact>
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {numberConcepts.map((item) => (
          <article key={item.title} className="rounded-lg border border-slate-200 bg-white/75 p-3 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-black">{item.title}</h3>
              <span className="mini-chip">{item.set}</span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.note}</p>
            <p className="mt-2 font-mono text-[12px] text-cyan-700 dark:text-cyan-200">{item.example}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}

function NumberLine({ values }: { values: { label: string; value: number; color: string }[] }) {
  const min = -4;
  const max = 8;
  const map = (value: number) => 70 + ((Math.max(min, Math.min(max, value)) - min) / (max - min)) * 620;
  return (
    <svg viewBox="0 0 760 280" className="h-[280px] w-full rounded-lg">
      <rect width="760" height="280" rx="14" className="fill-slate-50 dark:fill-slate-900" />
      <line x1="70" x2="690" y1="145" y2="145" stroke="#64748b" strokeWidth="3" />
      {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((tick) => <g key={tick}><line x1={map(tick)} x2={map(tick)} y1="132" y2="158" stroke="#94a3b8" /><text x={map(tick) - 6} y="180" className="fill-slate-500 dark:fill-slate-400" fontSize="12" fontWeight="700">{tick}</text></g>)}
      {values.map((item, index) => <g key={`${item.label}-${index}`}><line x1={map(item.value)} x2={map(item.value)} y1="75" y2="145" stroke={item.color} strokeWidth="4" /><circle cx={map(item.value)} cy="145" r="8" fill={item.color} className="stroke-slate-900 dark:stroke-slate-100" strokeWidth="2" /><text x={map(item.value) + 10} y={74 + index * 24} className="fill-slate-900 dark:fill-white" fontSize="13" fontWeight="800">{item.label}: {roundTo(item.value, 4)}</text></g>)}
    </svg>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-lg bg-slate-100 p-2 dark:bg-white/10"><p className="text-[10px] font-black uppercase text-slate-500">{label}</p><p className="break-words font-mono text-sm font-bold">{value}</p></div>;
}

function isPerfectSquare(value: number) {
  return Number.isInteger(Math.sqrt(value));
}

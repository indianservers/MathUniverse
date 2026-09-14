import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import {
  ChallengeBox,
  ChipRow,
  Field,
  LiveRow,
  Panel,
  Segmented,
  SliderRow,
  StatusOk,
  StepList,
  clamp,
  fmt,
  useLabMode,
} from "../studioLabKit";
import CirclesGeometryLab from "../../geometry/circles/CirclesLab";
import RightTriangleLab from "./RightTriangleLab";
import UnitCircleLab from "./UnitCircleLab";
import RemainingStudioLab from "./RemainingStudioLabs";
import CoordinateLab from "../../geometry/coordinate/CoordinateLab";
import PolygonsLab from "../../geometry/polygons/PolygonsLab";
import TrianglesLab from "../../geometry/triangles/TrianglesLab";

export default function DedicatedStudioLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  if (page.id === "right-triangle") return <RightTriangleLab page={page} />;
  if (page.id === "unit-circle") return <UnitCircleLab page={page} />;
  if (page.id === "polygons") return <PolygonsLab page={page} />;
  if (page.id === "coordinate") return <CoordinateLab page={page} />;
  if (page.id === "triangles") return <TrianglesLab page={page} />;
  if (page.id === "vectors") return <VectorsLab page={page} />;
  if (page.id === "circles") return <CirclesGeometryLab page={page} />;
  if (page.id === "graphs" && page.route.includes("trigonometry")) return <TrigGraphsLab page={page} />;
  if (page.id === "argand-plane") return <ArgandLab page={page} extra={extra} />;
  if (page.id === "modular-arithmetic") return <ModularLab page={page} />;
  if (page.id === "interactive-distributions") return <DistributionsLab page={page} />;
  if (page.id === "epidemics") return <EpidemicLab page={page} />;
  if (page.id === "identities") return <IdentitiesLab page={page} />;
  if (page.id === "oblique") return <ObliqueTriangleLab page={page} />;
  if (page.id === "waves") return <WavesHarmonicsLab page={page} />;
  const remaining = RemainingStudioLab({ page, extra });
  if (remaining) return remaining;
  return <SmartTopicLab page={page} extra={extra} />;
}

function LabChrome({ page, children }: { page: StudioMockupPage; children: ReactNode }) {
  const { tabs, mode, setMode } = useLabMode(page);
  return (
    <>
      <nav className="msk-tabs" aria-label={`${page.title} modes`}>
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>{item}</button>
        ))}
      </nav>
      <div className="msk-lab">{children}</div>
      <MockupLearningStrip page={page} />
    </>
  );
}

function VectorsLab({ page }: { page: StudioMockupPage }) {
  const [ax, setAx] = useState(2);
  const [ay, setAy] = useState(1);
  const [az, setAz] = useState(3);
  const [bx, setBx] = useState(-1);
  const [by, setBy] = useState(2);
  const [bz, setBz] = useState(1);
  const [op, setOp] = useState("Dot");
  const a = [ax, ay, az];
  const b = [bx, by, bz];
  const dot = ax * bx + ay * by + az * bz;
  const cross = [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
  const mag = (v: number[]) => Math.hypot(v[0], v[1], v[2]);
  const angle = Math.acos(clamp(dot / (mag(a) * mag(b) || 1), -1, 1)) * 180 / Math.PI;
  const rx = ax + bx, ry = ay + by, rz = az + bz;
  return (
    <LabChrome page={page}>
      <Panel title="Vectors">
        <Field label={`a = (${ax}, ${ay}, ${az})`}>
          <SliderRow label="ax" value={ax} min={-4} max={4} step={0.1} onChange={setAx} />
          <SliderRow label="ay" value={ay} min={-4} max={4} step={0.1} onChange={setAy} />
          <SliderRow label="az" value={az} min={-4} max={4} step={0.1} onChange={setAz} />
        </Field>
        <Field label={`b = (${bx}, ${by}, ${bz})`}>
          <SliderRow label="bx" value={bx} min={-4} max={4} step={0.1} onChange={setBx} />
          <SliderRow label="by" value={by} min={-4} max={4} step={0.1} onChange={setBy} />
          <SliderRow label="bz" value={bz} min={-4} max={4} step={0.1} onChange={setBz} />
        </Field>
        <Field label="Operations">
          <ChipRow value={op} onChange={setOp} options={["Dot", "Cross", "Projections", "Add", "Subtract", "Scale"].map((id) => ({ id, label: id }))} />
        </Field>
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 520 360" role="img" aria-label="3D vector canvas">
          <rect width="520" height="360" fill="#f8fbff" />
          <line x1="70" y1="310" x2="490" y2="310" stroke="#94a3b8" />
          <line x1="70" y1="310" x2="70" y2="36" stroke="#94a3b8" />
          <line x1="70" y1="310" x2="210" y2="190" stroke="#cbd5e1" />
          <text x="498" y="314" fill="#64748b" fontSize="11">x</text>
          <text x="58" y="32" fill="#64748b" fontSize="11">z</text>
          <text x="214" y="188" fill="#64748b" fontSize="11">y</text>
          <polygon points={`70,310 ${70 + ax * 46 + az * 18},${310 - ay * 46 - az * 12} ${70 + rx * 46 + rz * 18},${310 - ry * 46 - rz * 12} ${70 + bx * 46 + bz * 18},${310 - by * 46 - bz * 12}`} fill="rgba(245,158,11,.12)" stroke="#f59e0b" strokeDasharray="4 3" />
          <line x1="70" y1="310" x2={70 + ax * 46 + az * 18} y2={310 - ay * 46 - az * 12} stroke="#147df2" strokeWidth="3" />
          <line x1="70" y1="310" x2={70 + bx * 46 + bz * 18} y2={310 - by * 46 - bz * 12} stroke="#8b45f4" strokeWidth="3" />
          <line x1="70" y1="310" x2={70 + rx * 46 + rz * 18} y2={310 - ry * 46 - rz * 12} stroke="#f59e0b" strokeWidth="2.4" />
          <text x={80 + ax * 46 + az * 18} y={300 - ay * 46 - az * 12} fill="#147df2" fontSize="12">a=({ax},{ay},{az})</text>
          <text x={80 + bx * 46 + bz * 18} y={324 - by * 46 - bz * 12} fill="#8b45f4" fontSize="12">b=({bx},{by},{bz})</text>
          <text x="220" y="40" fill="#f59e0b" fontSize="12">θ={fmt(angle, 1)}°</text>
          <text x="400" y="40" fill="#f59e0b" fontSize="12">r = a + b</text>
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <h2>Quick facts</h2>
        <LiveRow color="#147df2" label="|a|" value={fmt(mag(a))} />
        <LiveRow color="#8b45f4" label="|b|" value={fmt(mag(b))} />
        <LiveRow color="#f59e0b" label="θ" value={`${fmt(angle, 1)}°`} />
        <h2>Dot product</h2>
        <LiveRow color="#08b9dd" label="a · b" value={fmt(dot)} />
        <h2>Cross product</h2>
        <LiveRow color="#8b45f4" label="a × b" value={`(${cross.map((n) => fmt(n, 2)).join(", ")})`} />
        <LiveRow color="#10b981" label="|a × b|" value={fmt(mag(cross))} />
        <StatusOk>All computations are consistent. Vectors are in R³.</StatusOk>
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function trigWord(kind: string) {
  return kind === "Cosine" ? "cos" : kind === "Tangent" ? "tan" : "sin";
}

function evalTrig(kind: string, x: number, A: number, B: number, C: number, D: number) {
  const inner = B * x + C;
  const core = kind === "Cosine" ? Math.cos(inner) : kind === "Tangent" ? Math.tan(inner) : Math.sin(inner);
  return A * core + D;
}

function waveSegments(evalY: (x: number) => number) {
  const segments: string[] = [];
  let current: string[] = [];
  for (let i = 0; i <= 240; i++) {
    const x = -Math.PI * 2 + (i / 240) * Math.PI * 4;
    const y = evalY(x);
    if (!Number.isFinite(y) || Math.abs(y) > 5) {
      if (current.length > 1) segments.push(current.join(" "));
      current = [];
      continue;
    }
    current.push(`${20 + i * 2},${160 - clamp(y, -3.2, 3.2) * 36}`);
  }
  if (current.length > 1) segments.push(current.join(" "));
  return segments;
}

function TrigGraphsLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const [amp, setAmp] = useState(2);
  const [freq, setFreq] = useState(1.5);
  const [phase, setPhase] = useState(-Math.PI / 6);
  const [shift, setShift] = useState(0.5);
  const [fn, setFn] = useState("Sine");

  useEffect(() => {
    if (mode === "Sine" || mode === "Cosine" || mode === "Tangent") setFn(mode);
  }, [mode]);

  const family = mode === "Sine" || mode === "Cosine" || mode === "Tangent" ? mode : fn;
  const A = mode === "Comparison" ? 1 : amp;
  const B = mode === "Comparison" ? 1 : freq;
  const C = mode === "Comparison" ? 0 : phase;
  const D = mode === "Comparison" ? 0 : shift;
  const word = trigWord(family);
  const period = (family === "Tangent" ? Math.PI : 2 * Math.PI) / Math.abs(B || 1);
  const live = waveSegments((x) => evalTrig(family, x, A, B, C, D));
  const parent = waveSegments((x) => evalTrig(family, x, 1, 1, 0, 0));
  const compare = [
    { kind: "Sine", color: "#22d3ee" },
    { kind: "Cosine", color: "#a78bfa" },
    { kind: "Tangent", color: "#f59e0b" },
  ] as const;

  return (
    <>
      <nav className="msk-tabs" aria-label="Trigonometric graphs modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>{item}</button>
        ))}
      </nav>
      <div className="msk-lab" data-tg-mode={mode}>
        <Panel title={mode === "Transformations" ? "Transform the parent" : mode === "Comparison" ? "Compare the three graphs" : `${family} graph`}>
          {mode === "Sine" ? <p className="msk-note">Sine starts at 0, reaches A at a quarter-period, and repeats every 2π/|B|.</p> : null}
          {mode === "Cosine" ? <p className="msk-note">Cosine starts at A, is a sine wave shifted left by π/2, and has the same period 2π/|B|.</p> : null}
          {mode === "Tangent" ? <p className="msk-note">Tangent has vertical asymptotes and period π/|B|. The graph is broken at those lines.</p> : null}
          {mode === "Transformations" ? <p className="msk-note">A stretches height, B changes period, C shifts left/right, D moves the midline.</p> : null}
          {mode === "Comparison" ? <p className="msk-note">Parent graphs y = sin x, y = cos x, and y = tan x on the same axes.</p> : null}
          <p className="msk-formula">
            {mode === "Comparison"
              ? "y = sin x,  y = cos x,  y = tan x"
              : `y = ${fmt(A, 1)} ${word}(${fmt(B, 2)}x + ${fmt(C, 2)}) + ${fmt(D, 1)}`}
          </p>
          {mode === "Transformations" || mode === "Comparison" ? (
            <Field label="Function">
              <Segmented value={family} onChange={setFn} options={["Sine", "Cosine", "Tangent"].map((id) => ({ id, label: id }))} />
            </Field>
          ) : null}
          {mode !== "Comparison" ? (
            <>
              {family !== "Tangent" ? <SliderRow label="Amplitude A" value={amp} min={0.2} max={3} step={0.1} onChange={setAmp} /> : null}
              <SliderRow label="Period parameter B" value={freq} min={0.25} max={4} step={0.05} onChange={setFreq} />
              <SliderRow label="Phase shift C" value={phase} min={-Math.PI} max={Math.PI} step={0.05} onChange={setPhase} />
              {family !== "Tangent" ? <SliderRow label="Vertical shift D" value={shift} min={-2} max={2} step={0.1} onChange={setShift} /> : null}
            </>
          ) : null}
        </Panel>
        <section className="msk-panel msk-canvas">
          <svg className="msk-graph is-dark" viewBox="0 0 520 320" role="img" aria-label={`${mode} trigonometric graph`}>
            <rect width="520" height="320" fill="#061428" />
            <line x1="20" y1="160" x2="500" y2="160" stroke="#334155" />
            <line x1="270" y1="20" x2="270" y2="300" stroke="#334155" />
            {mode === "Transformations"
              ? parent.map((pts) => <polyline key={`p-${pts.slice(0, 12)}`} points={pts} fill="none" stroke="#64748b" strokeWidth="1.6" strokeDasharray="5 4" />)
              : null}
            {mode === "Comparison"
              ? compare.flatMap((item) =>
                  waveSegments((x) => evalTrig(item.kind, x, 1, 1, 0, 0)).map((pts) => (
                    <polyline key={`${item.kind}-${pts.slice(0, 12)}`} points={pts} fill="none" stroke={item.color} strokeWidth={item.kind === family ? 2.6 : 1.6} />
                  )),
                )
              : live.map((pts) => <polyline key={pts.slice(0, 16)} points={pts} fill="none" stroke="#22d3ee" strokeWidth="2.4" />)}
            {mode === "Tangent" ? (
              <>
                <line x1="202" y1="24" x2="202" y2="296" stroke="#f59e0b" strokeDasharray="4 4" />
                <line x1="338" y1="24" x2="338" y2="296" stroke="#f59e0b" strokeDasharray="4 4" />
              </>
            ) : null}
            <text x="36" y="28" fill="#94a3b8" fontSize="11">
              {mode === "Comparison" ? "sin x  ·  cos x  ·  tan x" : `y = ${fmt(A, 1)} ${word}(${fmt(B, 2)}x + ${fmt(C, 2)}) + ${fmt(D, 1)}`}
            </text>
          </svg>
        </section>
        <aside className="msk-panel msk-live">
          {mode === "Comparison" ? (
            <>
              <LiveRow color="#22d3ee" label="sin x" value="period 2π" />
              <LiveRow color="#a78bfa" label="cos x" value="sine shifted left π/2" />
              <LiveRow color="#f59e0b" label="tan x" value="period π, asymptotes" />
            </>
          ) : (
            <>
              {family !== "Tangent" ? <LiveRow color="#22d3ee" label="Amplitude |A|" value={fmt(Math.abs(A))} /> : <LiveRow color="#22d3ee" label="Range" value="all reals" />}
              <LiveRow color="#8b45f4" label="Period" value={fmt(period, 3)} />
              <LiveRow color="#f59e0b" label="Phase C" value={fmt(C, 3)} />
              {family !== "Tangent" ? <LiveRow color="#10b981" label="Midline D" value={fmt(D, 2)} /> : <LiveRow color="#10b981" label="Asymptotes" value="odd multiples of π/(2|B|)" />}
            </>
          )}
          <h2>Steps & Reasoning</h2>
          <StepList items={
            mode === "Cosine" ? [
              "cos x = sin(x + π/2).",
              `Period is 2π/|B| = ${fmt(period, 3)}.`,
              "A maximum occurs when the cosine argument is 0.",
            ] : mode === "Tangent" ? [
              "tan x = sin x / cos x.",
              `Period is π/|B| = ${fmt(period, 3)}.`,
              "Vertical asymptotes appear where cosine is 0.",
            ] : mode === "Transformations" ? [
              "Gray dashed curve is the parent.",
              "A stretches vertically; B compresses the period.",
              "C shifts the graph; D moves the midline.",
            ] : mode === "Comparison" ? [
              "sin and cos are shifts of each other.",
              "Both have period 2π and range [−1, 1].",
              "tan has period π and is undefined at odd multiples of π/2.",
            ] : [
              "sin 0 = 0 and sin(π/2) = 1.",
              `Period is 2π/|B| = ${fmt(period, 3)}.`,
              "The graph repeats after each full period.",
            ]
          } />
          <ChallengeBox {...page.challenge} />
        </aside>
      </div>
      <MockupLearningStrip page={page} />
    </>
  );
}

function ObliqueTriangleLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(7.8);
  const [b, setB] = useState(10.5);
  const [C, setC] = useState(70);
  const rad = C * Math.PI / 180;
  const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(rad));
  const A = Math.acos(clamp((b * b + c * c - a * a) / (2 * b * c), -1, 1)) * 180 / Math.PI;
  const B = 180 - A - C;
  const area = 0.5 * a * b * Math.sin(rad);
  return (
    <LabChrome page={page}>
      <Panel title="Triangle Inputs">
        <SliderRow label="Side a (BC)" value={a} min={2} max={16} step={0.1} onChange={setA} />
        <SliderRow label="Side b (CA)" value={b} min={2} max={16} step={0.1} onChange={setB} />
        <SliderRow label="Angle C" value={C} min={20} max={140} step={0.5} onChange={setC} unit="°" />
        <StatusOk>Angle sum {fmt(A + B + C, 1)}° · unique SAS solution</StatusOk>
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 340" role="img" aria-label="Oblique triangle">
          <rect width="420" height="340" fill="#f8fbff" />
          <polygon points={`60,280 ${60 + a * 18},280 ${60 + b * 18 * Math.cos(rad)},${280 - b * 18 * Math.sin(rad)}`} fill="rgba(20,125,242,.08)" stroke="#147df2" strokeWidth="2" />
          <text x="200" y="28" fill="#0f172a" fontSize="13">A {fmt(A, 1)}° · B {fmt(B, 1)}° · C {fmt(C, 1)}°</text>
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <h2>Sine law</h2>
        <LiveRow color="#147df2" label="a / sin A" value={fmt(a / Math.sin(A * Math.PI / 180), 3)} />
        <LiveRow color="#8b45f4" label="b / sin B" value={fmt(b / Math.sin(B * Math.PI / 180), 3)} />
        <LiveRow color="#f59e0b" label="c / sin C" value={fmt(c / Math.sin(rad), 3)} />
        <LiveRow color="#10b981" label="Area" value={fmt(area, 2)} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function WavesHarmonicsLab({ page }: { page: StudioMockupPage }) {
  const [a1, setA1] = useState(1);
  const [f1, setF1] = useState(2);
  const [a2, setA2] = useState(0.7);
  const [f2, setF2] = useState(3);
  const [t0, setT0] = useState(1.25);
  const y1 = (t: number) => a1 * Math.sin(2 * Math.PI * f1 * t);
  const y2 = (t: number) => a2 * Math.sin(2 * Math.PI * f2 * t);
  const pts = (fn: (t: number) => number) => Array.from({ length: 201 }, (_, i) => {
    const t = i / 40;
    return `${20 + i * 2.4},${140 - fn(t) * 36}`;
  }).join(" ");
  return (
    <LabChrome page={page}>
      <Panel title="Wavelet controls">
        <SliderRow label="Amplitude A1" value={a1} min={0.2} max={2} step={0.05} onChange={setA1} />
        <SliderRow label="Frequency f1" value={f1} min={0.5} max={6} step={0.1} onChange={setF1} />
        <SliderRow label="Amplitude A2" value={a2} min={0} max={2} step={0.05} onChange={setA2} />
        <SliderRow label="Frequency f2" value={f2} min={0.5} max={6} step={0.1} onChange={setF2} />
        <SliderRow label="Time t" value={t0} min={0} max={5} step={0.05} onChange={setT0} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph is-dark" viewBox="0 0 520 280" role="img" aria-label="Superposition">
          <rect width="520" height="280" fill="#061428" />
          <polyline points={pts(y1)} fill="none" stroke="#a78bfa" strokeWidth="1.4" />
          <polyline points={pts(y2)} fill="none" stroke="#22d3ee" strokeWidth="1.4" />
          <polyline points={pts((t) => y1(t) + y2(t))} fill="none" stroke="#fbbf24" strokeWidth="2.4" />
          <line x1={20 + t0 * 80} y1="20" x2={20 + t0 * 80} y2="260" stroke="#f59e0b" strokeDasharray="4 4" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#a78bfa" label="y1(t)" value={fmt(y1(t0))} />
        <LiveRow color="#22d3ee" label="y2(t)" value={fmt(y2(t0))} />
        <LiveRow color="#fbbf24" label="resultant" value={fmt(y1(t0) + y2(t0))} />
        <LiveRow color="#f59e0b" label="Beat |f2−f1|" value={fmt(Math.abs(f2 - f1), 2)} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function ArgandLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [re, setRe] = useState(3);
  const [im, setIm] = useState(4);
  const r = Math.hypot(re, im);
  const arg = Math.atan2(im, re) * 180 / Math.PI;
  return (
    <LabChrome page={page}>
      <Panel title="Plot z">
        <SliderRow label="Real a" value={re} min={-6} max={6} step={0.1} onChange={setRe} />
        <SliderRow label="Imag b" value={im} min={-6} max={6} step={0.1} onChange={setIm} />
      </Panel>
      <section className="msk-panel msk-canvas">
        {extra ?? (
          <svg className="msk-graph" viewBox="0 0 420 360" role="img" aria-label="Argand plane">
            <rect width="420" height="360" fill="#f8fbff" />
            <line x1="30" y1="180" x2="390" y2="180" stroke="#94a3b8" />
            <line x1="210" y1="20" x2="210" y2="340" stroke="#94a3b8" />
            <line x1="210" y1="180" x2={210 + re * 28} y2={180 - im * 28} stroke="#147df2" strokeWidth="2.4" />
            <circle cx={210 + re * 28} cy={180 - im * 28} r="6" fill="#147df2" />
            <text x={220 + re * 28} y={176 - im * 28} fontSize="12">z = {fmt(re, 1)} + {fmt(im, 1)}i</text>
          </svg>
        )}
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="|z|" value={fmt(r)} />
        <LiveRow color="#8b45f4" label="arg z" value={`${fmt(arg, 1)}°`} />
        <LiveRow color="#f59e0b" label="conjugate" value={`${fmt(re, 1)} − ${fmt(im, 1)}i`} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function ModularLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(5);
  const [n, setN] = useState(12);
  const hops = Array.from({ length: n }, (_, i) => (i * a) % n);
  return (
    <LabChrome page={page}>
      <Panel title="Clock arithmetic">
        <SliderRow label="Step a" value={a} min={1} max={20} step={1} onChange={setA} />
        <SliderRow label="Modulus n" value={n} min={3} max={16} step={1} onChange={setN} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 360 360" role="img" aria-label="Modular clock">
          <rect width="360" height="360" fill="#f8fbff" />
          <circle cx="180" cy="180" r="120" fill="none" stroke="#8b45f4" strokeWidth="2" />
          {Array.from({ length: n }, (_, i) => {
            const t = (-90 + i * 360 / n) * Math.PI / 180;
            return <g key={i}><circle cx={180 + 120 * Math.cos(t)} cy={180 + 120 * Math.sin(t)} r="8" fill={i === hops[1] ? "#08b9dd" : "#147df2"} /><text x={180 + 148 * Math.cos(t)} y={184 + 148 * Math.sin(t)} fontSize="11" textAnchor="middle">{i}</text></g>;
          })}
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label={`${a} mod ${n}`} value={String(((a % n) + n) % n)} />
        <LiveRow color="#8b45f4" label={`${a}×2 mod ${n}`} value={String(((2 * a) % n + n) % n)} />
        <LiveRow color="#f59e0b" label="Cycle" value={hops.slice(0, 8).join(" → ")} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function DistributionsLab({ page }: { page: StudioMockupPage }) {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);
  const [lo, setLo] = useState(-1);
  const [hi, setHi] = useState(1);
  const pdf = (x: number) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
  const cdf = (z: number) => {
    const sign = z < 0 ? -1 : 1;
    const a = Math.abs(z) / Math.SQRT2;
    const t = 1 / (1 + 0.3275911 * a);
    const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-a * a);
    return 0.5 * (1 + sign * erf);
  };
  const p = cdf((hi - mu) / sigma) - cdf((lo - mu) / sigma);
  const pts = Array.from({ length: 121 }, (_, i) => {
    const x = mu - 4 * sigma + (i / 120) * 8 * sigma;
    return `${20 + i * 4},${200 - pdf(x) * 160 * sigma}`;
  }).join(" ");
  return (
    <LabChrome page={page}>
      <Panel title="Distribution">
        <SliderRow label="Mean μ" value={mu} min={-3} max={3} step={0.1} onChange={setMu} />
        <SliderRow label="σ" value={sigma} min={0.4} max={2.5} step={0.1} onChange={setSigma} />
        <SliderRow label="Shade a" value={lo} min={-4} max={4} step={0.1} onChange={setLo} />
        <SliderRow label="Shade b" value={hi} min={-4} max={4} step={0.1} onChange={setHi} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 520 240" role="img" aria-label="Normal curve">
          <rect width="520" height="240" fill="#f8fbff" />
          <polyline points={pts} fill="none" stroke="#8b45f4" strokeWidth="2.2" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#8b45f4" label="P(a < X < b)" value={fmt(p, 3)} />
        <LiveRow color="#08b9dd" label="68% band" value="μ ± σ" />
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function EpidemicLab({ page }: { page: StudioMockupPage }) {
  const [beta, setBeta] = useState(0.35);
  const [gamma, setGamma] = useState(0.12);
  const [vax, setVax] = useState(0.15);
  const r0 = beta / gamma;
  const pts = useMemo(() => {
    let s = 0.99 - vax, i = 0.01, r = vax;
    const out = [{ s, i, r }];
    for (let t = 0; t < 80; t += 1) {
      const ds = -beta * s * i;
      const di = beta * s * i - gamma * i;
      const dr = gamma * i;
      s = clamp(s + ds, 0, 1); i = clamp(i + di, 0, 1); r = clamp(r + dr, 0, 1);
      out.push({ s, i, r });
    }
    return out;
  }, [beta, gamma, vax]);
  const path = (key: "s" | "i" | "r") => pts.map((p, idx) => `${20 + idx * 5.8},${200 - p[key] * 170}`).join(" ");
  return (
    <LabChrome page={page}>
      <Panel title="SIR controls">
        <SliderRow label="β contact" value={beta} min={0.05} max={0.8} step={0.01} onChange={setBeta} />
        <SliderRow label="γ recover" value={gamma} min={0.04} max={0.4} step={0.01} onChange={setGamma} />
        <SliderRow label="Vaccinated" value={vax} min={0} max={0.7} step={0.01} onChange={setVax} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 500 220" role="img" aria-label="SIR curves">
          <rect width="500" height="220" fill="#f8fbff" />
          <polyline points={path("s")} fill="none" stroke="#147df2" strokeWidth="2" />
          <polyline points={path("i")} fill="none" stroke="#ef4444" strokeWidth="2" />
          <polyline points={path("r")} fill="none" stroke="#10b981" strokeWidth="2" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#ef4444" label="R₀" value={fmt(r0, 2)} />
        <LiveRow color="#10b981" label="Peak I" value={fmt(Math.max(...pts.map((p) => p.i)), 3)} />
        <StatusOk>{r0 < 1 ? "Outbreak dies out (R₀ < 1)." : "Outbreak grows until susceptibles fall."}</StatusOk>
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function IdentitiesLab({ page }: { page: StudioMockupPage }) {
  const [th, setTh] = useState(40);
  const s = Math.sin(th * Math.PI / 180);
  const c = Math.cos(th * Math.PI / 180);
  return (
    <LabChrome page={page}>
      <Panel title="Identity explorer">
        <SliderRow label="θ" value={th} min={0} max={360} step={1} onChange={setTh} unit="°" />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 360 280" role="img" aria-label="Pythagorean identity">
          <rect width="360" height="280" fill="#f8fbff" />
          <circle cx="180" cy="140" r="90" fill="none" stroke="#08b9dd" />
          <line x1="180" y1="140" x2={180 + c * 90} y2={140 - s * 90} stroke="#8b45f4" strokeWidth="2" />
          <text x="40" y="36" fill="#147df2" fontSize="16">sin²θ + cos²θ = {fmt(s * s + c * c, 4)}</text>
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#08b9dd" label="sin θ" value={fmt(s)} />
        <LiveRow color="#8b45f4" label="cos θ" value={fmt(c)} />
        <LiveRow color="#10b981" label="sin²+cos²" value={fmt(s * s + c * c, 4)} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function SmartTopicLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const { mode } = useLabMode(page);
  const [a, setA] = useState(2.5);
  const [b, setB] = useState(1.5);
  const [n, setN] = useState(8);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(0);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      tRef.current += 0.08;
      setT(tRef.current);
      setA((value) => -8 + ((value + 8 + 0.08) % 20));
    }, 80);
    return () => window.clearInterval(id);
  }, [playing]);

  const live = compute(page.id, mode, a, b, n, t);
  return (
    <LabChrome page={page}>
      <Panel title={`${mode} controls`}>
        <p className="msk-note">{page.description}</p>
        <SliderRow label={live.aLabel} value={a} min={live.aMin} max={live.aMax} step={0.1} onChange={setA} />
        <SliderRow label={live.bLabel} value={b} min={-6} max={8} step={0.1} onChange={setB} />
        <SliderRow label={live.nLabel} value={n} min={1} max={24} step={1} onChange={setN} />
        <div className="msk-btn-row">
          <button className="msk-cta" type="button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Play animation"}</button>
          <button className="msk-soft" type="button" onClick={() => { setA(2.5); setB(1.5); setN(8); }}>Reset</button>
        </div>
      </Panel>
      <section className="msk-panel msk-canvas">
        {extra ?? <TopicCanvas pageId={page.id} mode={mode} a={a} b={b} n={n} t={t} />}
      </section>
      <aside className="msk-panel msk-live">
        <h2>Live values</h2>
        {live.rows.map((row) => <LiveRow key={row.label} color={row.color} label={row.label} value={row.value} />)}
        <ChallengeBox {...page.challenge} />
      </aside>
    </LabChrome>
  );
}

function compute(pageId: string, mode: string, a: number, b: number, n: number, t: number) {
  const r = Math.hypot(a, b);
  const rows: Array<{ label: string; value: string; color: string }> = [];
  let aLabel = "Parameter a", bLabel = "Parameter b", nLabel = "Steps n", aMin = -8, aMax = 12;
  if (/matrix|row|transform|det|eigen|ortho|least|playground/.test(pageId)) {
    aLabel = "Matrix a₁₁"; bLabel = "Matrix a₁₂"; nLabel = "Size n";
    rows.push({ label: "det model", value: fmt(a * n - b), color: "#8b45f4" }, { label: "‖v‖", value: fmt(r), color: "#147df2" });
  } else if (/polygon|solid|measure|coordinate|construction|proof/.test(pageId)) {
    aLabel = "Length"; bLabel = "Height"; nLabel = "Sides / slices";
    rows.push({ label: "Area", value: fmt(Math.abs(a * b)), color: "#08b9dd" }, { label: "Perimeter", value: fmt(2 * (Math.abs(a) + Math.abs(b))), color: "#147df2" });
  } else if (/polar|euler|root|loci|fractal|rotation|arithmetic|circuit/.test(pageId)) {
    aLabel = "Re(z)"; bLabel = "Im(z)"; nLabel = "n / terms";
    rows.push({ label: "|z|", value: fmt(r), color: "#147df2" }, { label: "arg z", value: `${fmt(Math.atan2(b, a) * 180 / Math.PI, 1)}°`, color: "#8b45f4" });
  } else if (/motion|population|finance|opt|network|regress|periodic|numeric|compar/.test(pageId)) {
    aLabel = "Rate / slope"; bLabel = "Initial / intercept"; nLabel = "Horizon";
    rows.push({ label: "Model y", value: fmt(b * Math.exp(0.08 * a) + t), color: "#08b9dd" }, { label: "RMSE proxy", value: fmt(Math.abs(a - b) / (n + 1), 3), color: "#f59e0b" });
  } else if (/prime|pattern|combin|logic|set|graph|algo|crypto|number/.test(pageId)) {
    aLabel = "Value a"; bLabel = "Value b"; nLabel = "Modulus / n";
    rows.push({ label: "Count", value: String(Math.round(Math.abs(a * n) + b)), color: "#147df2" }, { label: "mod n", value: String(((Math.round(a) % n) + n) % n), color: "#8b45f4" });
  } else if (/data|descript|experiment|count|clt|confidence|hypothes|correl|anova/.test(pageId)) {
    aLabel = "Mean / p"; bLabel = "Spread / n effect"; nLabel = "Sample size";
    rows.push({ label: "z", value: fmt((a - 0) / Math.max(0.2, b), 3), color: "#8b45f4" }, { label: "SE", value: fmt(Math.abs(b) / Math.sqrt(n), 3), color: "#147df2" });
  } else {
    rows.push({ label: "Mode", value: mode, color: "#08b9dd" }, { label: "a + b", value: fmt(a + b), color: "#147df2" });
  }
  rows.unshift({ label: "Mode", value: mode, color: "#64748b" });
  return { rows, aLabel, bLabel, nLabel, aMin, aMax };
}

function TopicCanvas({ pageId, mode, a, b, n, t }: { pageId: string; mode: string; a: number; b: number; n: number; t: number }) {
  const x1 = 210 + a * 14;
  const y1 = 160 - b * 12;
  const sides = Math.max(3, Math.round(n / 2 + 3));
  if (/polygon/.test(pageId)) {
    const pts = Array.from({ length: sides }, (_, i) => {
      const ang = (i / sides) * Math.PI * 2 - Math.PI / 2;
      return `${210 + Math.cos(ang) * (40 + a * 6)},${160 + Math.sin(ang) * (40 + a * 6)}`;
    }).join(" ");
    return <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label={mode}><rect width="420" height="320" fill="#f8fbff" /><polygon points={pts} fill="rgba(139,69,244,.12)" stroke="#8b45f4" strokeWidth="2" /></svg>;
  }
  if (/fractal/.test(pageId)) {
    return (
      <svg className="msk-graph is-dark" viewBox="0 0 420 320" role="img" aria-label="Mandelbrot">
        <rect width="420" height="320" fill="#061428" />
        {Array.from({ length: 220 }, (_, i) => {
          const x = -2 + (i % 20) * 0.16 + a * 0.02;
          const y = -1.2 + Math.floor(i / 20) * 0.2 + b * 0.02;
          let zx = 0, zy = 0, k = 0;
          while (zx * zx + zy * zy < 4 && k < 12 + n) { const nx = zx * zx - zy * zy + x; zy = 2 * zx * zy + y; zx = nx; k += 1; }
          return <rect key={i} x={(i % 20) * 21} y={Math.floor(i / 20) * 29} width="21" height="29" fill={k > 10 + n / 2 ? "#0f172a" : `hsl(${200 + k * 8} 70% 55%)`} />;
        })}
      </svg>
    );
  }
  return (
    <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label={`${pageId} ${mode}`}>
      <rect width="420" height="320" fill="#f8fbff" />
      <line x1="30" y1="160" x2="400" y2="160" stroke="#cbd5e1" />
      <line x1="210" y1="20" x2="210" y2="300" stroke="#cbd5e1" />
      <circle cx={x1} cy={y1} r="7" fill="#08b9dd" />
      <circle cx={210 + n * 6} cy={160 - a * 8 - Math.sin(t) * 10} r="6" fill="#8b45f4" />
      <line x1="210" y1="160" x2={x1} y2={y1} stroke="#147df2" strokeWidth="2.4" />
      <text x="24" y="28" fill="#334155" fontSize="12">{mode}</text>
    </svg>
  );
}

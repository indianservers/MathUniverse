import { useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import { useTrigSession, writeTrigSession } from "../trigStudioSession";
import {
  ChallengeBox,
  ExtraFrame,
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
import ModellingStudioLab from "./ModellingLabs";
import CoordinateLab from "../../geometry/coordinate/CoordinateLab";
import PolygonsLab from "../../geometry/polygons/PolygonsLab";
import TrianglesLab from "../../geometry/triangles/TrianglesLab";
import { crtTwo, gcd, hopCycle, inverseMod, solveLinear } from "../../discrete/modular/modularMath";
import StudioGraphWidget from "../../phase1/StudioGraphWidget";
import {
  IdentitiesLab as TargetIdentitiesLab,
  TrigGraphsLab as TargetTrigGraphsLab,
} from "./TrigonometryConceptLabs";
import {
  ObliqueTriangleLab as TargetObliqueTriangleLab,
  WavesHarmonicsLab as TargetWavesHarmonicsLab,
} from "./TrigonometryAppliedLabs";

export default function DedicatedStudioLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  if (page.route.includes("mathematical-modelling") && page.id !== "home") return <ModellingStudioLab page={page} />;
  if (page.id === "right-triangle") return <RightTriangleLab page={page} />;
  if (page.id === "unit-circle") return <UnitCircleLab page={page} />;
  if (page.id === "polygons") return <PolygonsLab page={page} />;
  if (page.id === "coordinate") return <CoordinateLab page={page} />;
  if (page.id === "triangles") return <TrianglesLab page={page} />;
  if (page.id === "vectors") return <VectorsLab page={page} extra={extra} />;
  if (page.id === "circles") return <CirclesGeometryLab page={page} />;
  if (page.id === "graphs" && page.route.includes("trigonometry")) return <TargetTrigGraphsLab page={page} />;
  if (page.id === "argand-plane") return <ArgandLab page={page} extra={extra} />;
  if (page.id === "modular-arithmetic") return <ModularLab page={page} />;
  if (page.id === "interactive-distributions") return <DistributionsLab page={page} />;
  if (page.id === "identities") return <TargetIdentitiesLab page={page} />;
  if (page.id === "oblique") return <TargetObliqueTriangleLab page={page} />;
  if (page.id === "waves") return <TargetWavesHarmonicsLab page={page} />;
  const remaining = RemainingStudioLab({ page, extra });
  if (remaining) return remaining;
  return <SmartTopicLab page={page} extra={extra} />;
}

function LabChrome({ page, children }: { page: StudioMockupPage; children: ReactNode | ((mode: string) => ReactNode) }) {
  return <Phase1LabChrome page={page}>{children}</Phase1LabChrome>;
}

function VectorsLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [ax, setAx] = useState(2);
  const [ay, setAy] = useState(1);
  const [az, setAz] = useState(3);
  const [bx, setBx] = useState(-1);
  const [by, setBy] = useState(2);
  const [bz, setBz] = useState(1);
  const a = [ax, ay, az];
  const b = [bx, by, bz];
  const dot = ax * bx + ay * by + az * bz;
  const cross = [ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx];
  const mag = (v: number[]) => Math.hypot(v[0] ?? 0, v[1] ?? 0, v[2] ?? 0);
  const angle = Math.acos(clamp(dot / (mag(a) * mag(b) || 1), -1, 1)) * 180 / Math.PI;
  const rx = ax + bx, ry = ay + by, rz = az + bz;
  const projScale = mag(b) ? dot / (mag(b) ** 2) : 0;
  const px = 70 + ax * 46 + az * 18, py = 310 - ay * 46 - az * 12;
  const qx = 70 + bx * 46 + bz * 18, qy = 310 - by * 46 - bz * 12;
  const sx = 70 + rx * 46 + rz * 18, sy = 310 - ry * 46 - rz * 12;
  const cx = 70 + (cross[0] ?? 0) * 18 + (cross[2] ?? 0) * 8, cy = 200 - (cross[1] ?? 0) * 22;
  return (
    <LabChrome page={page}>
      {(mode) => {
        const op = mode;
        return (
          <>
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
              <p className="msk-note">{op}: cos θ = (a·b) / (|a||b|) = {fmt(Math.cos(angle * Math.PI / 180), 3)}</p>
            </Panel>
            <section className="msk-panel msk-canvas">
              <ExtraFrame
                mode={mode}
                extra={extra}
                fallback={(
                  <svg
                    className="msk-graph is-interactive"
                    viewBox="0 0 520 360"
                    role="img"
                    aria-label={`${mode} vector canvas`}
                    onPointerDown={(event: PointerEvent<SVGSVGElement>) => {
                      const box = event.currentTarget.getBoundingClientRect();
                      const x = ((event.clientX - box.left) / box.width) * 520;
                      const y = ((event.clientY - box.top) / box.height) * 360;
                      const nextX = clamp((x - 70) / 46, -4, 4);
                      const nextY = clamp((310 - y) / 46, -4, 4);
                      const da = Math.hypot(x - px, y - py);
                      const db = Math.hypot(x - qx, y - qy);
                      if (da <= db) {
                        setAx(nextX);
                        setAy(nextY);
                      } else {
                        setBx(nextX);
                        setBy(nextY);
                      }
                    }}
                  >
                    <rect width="520" height="360" fill="#f8fbff" />
                    <line x1="70" y1="310" x2="490" y2="310" stroke="#94a3b8" />
                    <line x1="70" y1="310" x2="70" y2="36" stroke="#94a3b8" />
                    <line x1="70" y1="310" x2="210" y2="190" stroke="#cbd5e1" />
                    {mode === "Cross" ? <polygon points={`70,310 ${px},${py} ${sx},${sy} ${qx},${qy}`} fill="rgba(139,69,244,.16)" stroke="#8b45f4" /> : null}
                    {mode === "Projections" ? <line x1="70" y1="310" x2={70 + projScale * bx * 46 + projScale * bz * 18} y2={310 - projScale * by * 46 - projScale * bz * 12} stroke="#f59e0b" strokeWidth="8" opacity="0.35" /> : null}
                    {mode === "Add" || mode === "Subtract" ? <polygon points={`70,310 ${px},${py} ${sx},${sy} ${qx},${qy}`} fill="rgba(245,158,11,.12)" stroke="#f59e0b" strokeDasharray="4 3" /> : null}
                    <line x1="70" y1="310" x2={px} y2={py} stroke="#147df2" strokeWidth="3" />
                    <line x1="70" y1="310" x2={qx} y2={qy} stroke="#8b45f4" strokeWidth="3" />
                    {mode === "Scale" ? <line x1="70" y1="310" x2={70 + ax * 70 + az * 24} y2={310 - ay * 70 - az * 16} stroke="#08b9dd" strokeWidth="2" strokeDasharray="5 3" /> : null}
                    {mode === "Cross" ? <line x1="70" y1="200" x2={cx} y2={cy} stroke="#10b981" strokeWidth="3" /> : null}
                    <text x="24" y="28" fill="#334155" fontSize="13">{mode === "Cross" ? "Right-hand parallelogram · a × b" : mode === "Projections" ? "Shadow of a onto b" : mode === "Dot" ? `Alignment · cos θ = ${fmt(Math.cos(angle * Math.PI / 180), 3)}` : mode}</text>
                  </svg>
                )}
              />
              <p className="msk-note">{mode === "Cross" ? "Area of the parallelogram is |a × b|. Thumb points along a × b." : mode === "Projections" ? "The shadow of a on b is ((a·b)/|b|²) b." : mode === "Dot" ? "cos θ measures alignment." : "Parallelogram / ray of the resultant."}</p>
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color="#147df2" label="|a|" value={fmt(mag(a))} />
              <LiveRow color="#8b45f4" label="|b|" value={fmt(mag(b))} />
              <LiveRow color="#f59e0b" label="θ" value={`${fmt(angle, 1)}°`} />
              <LiveRow color="#08b9dd" label="a · b" value={fmt(dot)} />
              <LiveRow color="#8b45f4" label="a × b" value={`(${cross.map((n) => fmt(n, 2)).join(", ")})`} />
              <LiveRow color="#10b981" label="|a × b|" value={fmt(mag(cross))} />
              <StatusOk>All computations are consistent. Vectors are in R³.</StatusOk>
              <ChallengeBox {...page.challenge} />
            </aside>
          </>
        );
      }}
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
  const { mode } = useLabMode(page);
  const session = useTrigSession();
  const [amp, setAmp] = useState(2);
  const [freq, setFreq] = useState(1.5);
  const [phase, setPhase] = useState(-Math.PI / 6);
  const [shift, setShift] = useState(0.5);
  const [fn, setFn] = useState("Sine");
  const [handle, setHandle] = useState<"A" | "D" | null>(null);

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
  const thetaRad = session.theta * Math.PI / 180;
  const thetaX = 20 + ((thetaRad + Math.PI * 2) / (Math.PI * 4)) * 480;
  const compare = [
    { kind: "Sine", color: "#22d3ee" },
    { kind: "Cosine", color: "#a78bfa" },
    { kind: "Tangent", color: "#f59e0b" },
  ] as const;

  return (
    <LabChrome page={page}>
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
          <svg
            className="msk-graph is-dark is-interactive"
            viewBox="0 0 520 320"
            role="img"
            aria-label={`${mode} trigonometric graph`}
            onPointerMove={(event: PointerEvent<SVGSVGElement>) => {
              if (!handle) return;
              const box = event.currentTarget.getBoundingClientRect();
              const y = (event.clientY - box.top) / box.height * 320;
              const value = clamp((160 - y) / 36, -3.2, 3.2);
              if (handle === "A") setAmp(clamp(Math.abs(value - D), 0.2, 3));
              if (handle === "D") setShift(clamp(value, -2, 2));
            }}
            onPointerUp={() => setHandle(null)}
            onPointerLeave={() => setHandle(null)}
          >
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
            <line x1={thetaX} y1="24" x2={thetaX} y2="296" stroke="#fbbf24" strokeDasharray="5 4" />
            <circle cx={thetaX} cy={160 - clamp(evalTrig(family, thetaRad, A, B, C, D), -3.2, 3.2) * 36} r="5" fill="#fbbf24" />
            {mode !== "Comparison" && family !== "Tangent" ? (
              <>
                <circle cx="40" cy={160 - D * 36} r="7" fill="#10b981" style={{ cursor: "grab" }} onPointerDown={(event) => { event.preventDefault(); setHandle("D"); }} />
                <circle cx="480" cy={160 - (A + D) * 36} r="7" fill="#22d3ee" style={{ cursor: "grab" }} onPointerDown={(event) => { event.preventDefault(); setHandle("A"); }} />
                <text x="48" y={160 - D * 36 - 8} fill="#10b981" fontSize="11">D</text>
                <text x="456" y={160 - (A + D) * 36 - 8} fill="#22d3ee" fontSize="11">A</text>
              </>
            ) : null}
          </svg>
          <StudioGraphWidget
            expressions={mode === "Comparison" ? ["sin(x)", "cos(x)", "tan(x)"] : [`${A}*${word}(${B}*x+(${C}))+(${D})`]}
            labels={mode === "Comparison" ? ["sin x", "cos x", "tan x"] : [`${family}`]}
            traceX={thetaRad}
            onTraceChange={(x) => writeTrigSession({ theta: ((x * 180 / Math.PI) % 360 + 360) % 360 })}
            view={{ xMin: -2 * Math.PI, xMax: 2 * Math.PI, yMin: -4, yMax: 4 }}
          />
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
              "Drag the A and D handles on the graph.",
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
          <ChallengeBox page={page} mode={mode} />
        </aside>
      </div>
    </LabChrome>
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
  const ssa = a * Math.sin(rad) / b;
  return (
    <LabChrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode === "SSA Ambiguous Case" ? "SSA check" : mode === "Area" ? "Area inputs" : "Triangle Inputs"}>
            <SliderRow label="Side a (BC)" value={a} min={2} max={16} step={0.1} onChange={setA} />
            <SliderRow label="Side b (CA)" value={b} min={2} max={16} step={0.1} onChange={setB} />
            <SliderRow label="Angle C" value={C} min={20} max={140} step={0.5} onChange={setC} unit="°" />
            <StatusOk>{mode === "SSA Ambiguous Case" ? (ssa < 1 ? "One or two triangles possible — h = b sin C." : "No triangle or one right triangle.") : `Angle sum ${fmt(A + B + C, 1)}° · unique SAS solution`}</StatusOk>
          </Panel>
          <section className="msk-panel msk-canvas" data-ob-mode={mode}>
            <svg className="msk-graph" viewBox="0 0 420 340" role="img" aria-label="Oblique triangle">
              <rect width="420" height="340" fill="#f8fbff" />
              <polygon points={`60,280 ${60 + a * 18},280 ${60 + b * 18 * Math.cos(rad)},${280 - b * 18 * Math.sin(rad)}`} fill="rgba(20,125,242,.08)" stroke="#147df2" strokeWidth="2" />
              {mode === "SSA Ambiguous Case" && a > b * Math.sin(rad) && a < b ? (
                <polygon points={`60,280 ${60 + a * 18},280 ${60 + b * 18 * Math.cos(Math.PI - rad)},${280 - b * 18 * Math.sin(rad)}`} fill="rgba(245,158,11,.12)" stroke="#f59e0b" strokeWidth="2" strokeDasharray="6 4" />
              ) : null}
              <text x="36" y="28" fill="#0f172a" fontSize="13">
                {mode === "SSA Ambiguous Case"
                  ? (a < b * Math.sin(rad) - 0.05 ? "0 triangles" : Math.abs(a - b * Math.sin(rad)) < 0.08 ? "1 right triangle" : a < b ? "2 triangles" : "1 triangle")
                  : `A ${fmt(A, 1)}° · B ${fmt(B, 1)}° · C ${fmt(C, 1)}°`}
              </text>
              {mode === "Area" ? <text x="36" y="52" fill="#10b981" fontSize="14">(1/2)ab sin C = {fmt(area, 2)}</text> : null}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <h2>{mode === "Cosine Law" ? "Cosine law" : mode === "Area" ? "Area" : "Sine law"}</h2>
            {mode === "Cosine Law" ? (
              <LiveRow color="#147df2" label="c² = a²+b²−2ab cos C" value={fmt(c * c, 2)} />
            ) : mode === "Area" ? (
              <LiveRow color="#10b981" label="Area" value={fmt(area, 2)} />
            ) : (
              <>
                <LiveRow color="#147df2" label="a / sin A" value={fmt(a / Math.sin(A * Math.PI / 180), 3)} />
                <LiveRow color="#8b45f4" label="b / sin B" value={fmt(b / Math.sin(B * Math.PI / 180), 3)} />
                <LiveRow color="#f59e0b" label="c / sin C" value={fmt(c / Math.sin(rad), 3)} />
              </>
            )}
            {mode === "Solve Triangle" ? <LiveRow color="#0f172a" label="Side c" value={fmt(c, 2)} /> : null}
            <ChallengeBox page={page} mode={mode} />
          </aside>
        </>
      )}
    </LabChrome>
  );
}

function WavesHarmonicsLab({ page }: { page: StudioMockupPage }) {
  const [a1, setA1] = useState(1);
  const [f1, setF1] = useState(2);
  const [a2, setA2] = useState(0.7);
  const [f2, setF2] = useState(3);
  const [phi, setPhi] = useState(0);
  const [t0, setT0] = useState(1.25);
  const y1 = (t: number) => a1 * Math.sin(2 * Math.PI * f1 * t);
  const y2 = (t: number, mode: string) => {
    const freq = mode === "Harmonics" ? 2 * f1 : mode === "Beats" ? f1 + 0.4 : f2;
    const phase = mode === "Phase" ? phi : 0;
    return a2 * Math.sin(2 * Math.PI * freq * t + phase);
  };
  const pts = (fn: (t: number) => number) => Array.from({ length: 201 }, (_, i) => {
    const t = i / 40;
    return `${20 + i * 2.4},${140 - fn(t) * 36}`;
  }).join(" ");
  return (
    <LabChrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode === "Simple Wave" ? "One wave" : "Wavelet controls"}>
            <SliderRow label="Amplitude A1" value={a1} min={0.2} max={2} step={0.05} onChange={setA1} />
            <SliderRow label="Frequency f1" value={f1} min={0.5} max={6} step={0.1} onChange={setF1} />
            {mode !== "Simple Wave" ? (
              <>
                <SliderRow label="Amplitude A2" value={a2} min={0} max={2} step={0.05} onChange={setA2} />
                {mode === "Phase" ? <SliderRow label="Phase" value={phi} min={0} max={Math.PI} step={0.05} onChange={setPhi} /> : <SliderRow label="Frequency f2" value={f2} min={0.5} max={6} step={0.1} onChange={setF2} />}
              </>
            ) : null}
            <SliderRow label="Time t" value={t0} min={0} max={5} step={0.05} onChange={setT0} />
          </Panel>
          <section className="msk-panel msk-canvas" data-wv-mode={mode}>
            <svg className="msk-graph is-dark" viewBox="0 0 520 280" role="img" aria-label={mode}>
              <rect width="520" height="280" fill="#061428" />
              <polyline points={pts(y1)} fill="none" stroke="#a78bfa" strokeWidth="1.4" />
              {mode !== "Simple Wave" ? <polyline points={pts((t) => y2(t, mode))} fill="none" stroke="#22d3ee" strokeWidth="1.4" /> : null}
              {mode !== "Simple Wave" ? <polyline points={pts((t) => y1(t) + y2(t, mode))} fill="none" stroke="#fbbf24" strokeWidth="2.4" /> : null}
              <line x1={20 + t0 * 80} y1="20" x2={20 + t0 * 80} y2="260" stroke="#f59e0b" strokeDasharray="4 4" />
            </svg>
            <StudioGraphWidget
              expressions={mode === "Simple Wave" ? [`${a1}*sin(2*pi*${f1}*x)`] : [`${a1}*sin(2*pi*${f1}*x)+${a2}*sin(2*pi*${f2}*x)`]}
              traceX={t0}
              onTraceChange={setT0}
              view={{ xMin: 0, xMax: 5, yMin: -3, yMax: 3 }}
            />
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#a78bfa" label="y1(t)" value={fmt(y1(t0))} />
            {mode !== "Simple Wave" ? <LiveRow color="#22d3ee" label="y2(t)" value={fmt(y2(t0, mode))} /> : null}
            {mode !== "Simple Wave" ? <LiveRow color="#fbbf24" label="resultant" value={fmt(y1(t0) + y2(t0, mode))} /> : null}
            <LiveRow color="#f59e0b" label="Beat |f2−f1|" value={fmt(mode === "Beats" ? 0.4 : Math.abs(f2 - f1), 2)} />
            <ChallengeBox page={page} mode={mode} />
          </aside>
        </>
      )}
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
      {(mode) => (
        <>
          <Panel title="Plot z">
            <SliderRow label="Real a" value={re} min={-6} max={6} step={0.1} onChange={setRe} />
            <SliderRow label="Imag b" value={im} min={-6} max={6} step={0.1} onChange={setIm} />
            <p className="msk-note">{mode}: |z| = r = {fmt(r, 2)}. Drag sliders; conjugate is the fold across the real axis.</p>
          </Panel>
          <section className="msk-panel msk-canvas">
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <svg className="msk-graph" viewBox="0 0 420 360" role="img" aria-label="Argand plane">
                  <rect width="420" height="360" fill="#f8fbff" />
                  <line x1="30" y1="180" x2="390" y2="180" stroke="#94a3b8" />
                  <line x1="210" y1="20" x2="210" y2="340" stroke="#94a3b8" />
                  {mode === "Modulus" ? <circle cx="210" cy="180" r={r * 28} fill="none" stroke="#08b9dd" /> : null}
                  {mode === "Argument" ? <line x1="210" y1="180" x2={210 + 120} y2="180" stroke="#cbd5e1" /> : null}
                  <line x1="210" y1="180" x2={210 + re * 28} y2={180 - im * 28} stroke="#147df2" strokeWidth="2.4" />
                  {mode === "Conjugate" ? <line x1="210" y1="180" x2={210 + re * 28} y2={180 + im * 28} stroke="#f59e0b" strokeDasharray="4 3" /> : null}
                  <circle cx={210 + re * 28} cy={180 - im * 28} r="6" fill="#147df2" />
                  <text x={220 + re * 28} y={176 - im * 28} fontSize="12">z = {fmt(re, 1)} + {fmt(im, 1)}i</text>
                </svg>
              )}
            />
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label="|z|" value={fmt(r)} />
            <LiveRow color="#8b45f4" label="arg z" value={`${fmt(arg, 1)}°`} />
            <LiveRow color="#f59e0b" label="conjugate" value={`${fmt(re, 1)} − ${fmt(im, 1)}i`} />
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </LabChrome>
  );
}

function ModularLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(5);
  const [n, setN] = useState(12);
  const [b, setB] = useState(10);
  const [m, setM] = useState(5);
  const [r, setR] = useState(3);
  const [tick, setTick] = useState(0);
  const hops = hopCycle(a, n);
  const inv = inverseMod(a, n);
  const linear = solveLinear(a, b, n);
  const crt = crtTwo(a % n, n, r, m);
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 700);
    return () => window.clearInterval(id);
  }, [a, n]);
  const hopAt = hops[tick % hops.length] ?? 0;
  return (
    <LabChrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <SliderRow label="a" value={a} min={1} max={20} step={1} onChange={setA} />
            <SliderRow label="Modulus n" value={n} min={3} max={16} step={1} onChange={setN} />
            {mode === "Linear Congruences" ? <SliderRow label="b in ax ≡ b" value={b} min={0} max={20} step={1} onChange={setB} /> : null}
            {mode === "Clock Arithmetic" || mode === "Cycles" ? <p className="msk-note">Hops of +{a} on ℤ/{n}ℤ. Cycle length {hops.length}.</p> : null}
            {mode === "Inverses" ? <p className="msk-note">An inverse exists iff gcd(a,n)=1. gcd({a},{n})={gcd(a, n)}.</p> : null}
            {mode === "Congruence" ? <p className="msk-note">{a} ≡ {((a % n) + n) % n} (mod {n}). Same residue class means same clock hour.</p> : null}
            {mode === "Linear Congruences" ? (
              <>
                <SliderRow label="Second modulus m" value={m} min={2} max={15} step={1} onChange={setM} />
                <SliderRow label="x ≡ r (mod m)" value={r} min={0} max={14} step={1} onChange={setR} />
                <p className="msk-note">CRT needs gcd(n,m) to divide a−r. Solutions to {a}x ≡ {b} (mod {n}): {linear.length ? linear.join(", ") : "none"}.</p>
              </>
            ) : null}
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg
              className="msk-graph is-interactive"
              viewBox="0 0 360 360"
              role="img"
              aria-label="Modular clock"
              onPointerDown={(event: PointerEvent<SVGSVGElement>) => {
                const box = event.currentTarget.getBoundingClientRect();
                const x = ((event.clientX - box.left) / box.width) * 360 - 180;
                const y = ((event.clientY - box.top) / box.height) * 360 - 180;
                const ang = (Math.atan2(y, x) * 180 / Math.PI + 90 + 360) % 360;
                const hour = Math.round(ang / (360 / n)) % n;
                setA(((hour - hopAt + n) % n) || n);
              }}
            >
              <rect width="360" height="360" fill="#f8fbff" />
              <circle cx="180" cy="180" r="120" fill="none" stroke="#8b45f4" strokeWidth="2" />
              {Array.from({ length: n }, (_, i) => {
                const t = (-90 + i * 360 / n) * Math.PI / 180;
                return (
                  <g key={i}>
                    <circle cx={180 + 120 * Math.cos(t)} cy={180 + 120 * Math.sin(t)} r={i === hopAt ? 11 : inv != null && i === inv ? 11 : 8} fill={i === hopAt ? "#f59e0b" : inv != null && i === inv ? "#10b981" : i === hops[1] ? "#08b9dd" : "#147df2"} />
                    <text x={180 + 148 * Math.cos(t)} y={184 + 148 * Math.sin(t)} fontSize="11" textAnchor="middle">{i}</text>
                  </g>
                );
              })}
              {mode === "Linear Congruences" && crt ? (
                <text x="70" y="340" fontSize="12">CRT x ≡ {crt.x} (mod {crt.modulus})</text>
              ) : null}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label={`${a} mod ${n}`} value={String(((a % n) + n) % n)} />
            <LiveRow color="#8b45f4" label="Inverse" value={inv == null ? "none (gcd≠1)" : String(inv)} />
            <LiveRow color="#f59e0b" label="Cycle" value={hops.slice(0, 8).join(" → ")} />
            {mode === "Linear Congruences" ? <LiveRow color="#10b981" label="CRT" value={crt ? `x=${crt.x} (mod ${crt.modulus})` : "inconsistent"} /> : null}
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
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

function IdentitiesLab({ page }: { page: StudioMockupPage }) {
  const session = useTrigSession();
  const th = ((session.theta % 360) + 360) % 360;
  const [phi, setPhi] = useState(25);
  const [tiles, setTiles] = useState<string[]>([]);
  const s = Math.sin(th * Math.PI / 180);
  const c = Math.cos(th * Math.PI / 180);
  const p = Math.sin(phi * Math.PI / 180);
  const q = Math.cos(phi * Math.PI / 180);
  const two = th * 2 * Math.PI / 180;
  const half = th * Math.PI / 360;
  const ox = 148;
  const oy = 168;
  const R = 92;
  const px = ox + c * R;
  const py = oy - s * R;
  const hCos = Math.abs(c) * R;
  const hSin = Math.abs(s) * R;
  const stackH = 160;
  const bank: Record<string, string[]> = {
    Pythagorean: ["Point is on the unit circle", "x = cos θ and y = sin θ", "Therefore sin²θ + cos²θ = 1"],
    "Angle Sum": ["Project the second ray", "cos(θ+φ) = cosθ cosφ − sinθ sinφ", "sin(θ+φ) = sinθ cosφ + cosθ sinφ"],
    "Double Angle": ["Double angle is the sum with φ = θ", "sin 2θ = 2 sinθ cosθ", "cos 2θ = cos²θ − sin²θ"],
    "Half Angle": ["Half angle comes from the double-angle reverse", "cos θ = 2 cos²(θ/2) − 1", "Solve for the half-angle cosine"],
    "Product-Sum": ["Product-to-sum uses the sum identities", "2 sinθ cosφ = sin(θ+φ) + sin(θ−φ)"],
  };
  const headline = (mode: string) => {
    if (mode === "Double Angle") return `sin 2θ = ${fmt(2 * s * c, 4)}`;
    if (mode === "Half Angle") return `sin(θ/2) = ${fmt(Math.sin(half), 4)}`;
    if (mode === "Angle Sum") return `sin(θ+φ) = ${fmt(s * q + c * p, 4)}`;
    if (mode === "Product-Sum") return `2 sin θ cos φ = ${fmt(2 * s * q, 4)}`;
    return `sin²θ + cos²θ = ${fmt(s * s + c * c, 4)}`;
  };
  const setThetaFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 420;
    const y = ((event.clientY - box.top) / box.height) * 280;
    const ang = Math.atan2(oy - y, x - ox) * 180 / Math.PI;
    writeTrigSession({ theta: ((ang % 360) + 360) % 360 });
  };
  return (
    <LabChrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <SliderRow label="θ" value={th} min={0} max={360} step={1} onChange={(n) => writeTrigSession({ theta: n })} unit="°" />
            {mode === "Angle Sum" || mode === "Product-Sum" ? <SliderRow label="φ" value={phi} min={0} max={180} step={1} onChange={setPhi} unit="°" /> : null}
            <p className="msk-formula">{headline(mode)}</p>
            <p className="msk-note">Drag the point on the circle. The identity is the figure, not a zoomed-out graph of a constant.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-id-mode={mode}>
            <svg
              className="msk-graph is-interactive"
              viewBox="0 0 420 280"
              role="img"
              aria-label={mode}
              onPointerDown={setThetaFromPointer}
              onPointerMove={(event) => {
                if (event.buttons === 1) setThetaFromPointer(event);
              }}
            >
              <rect width="420" height="280" fill="#f8fbff" />
              <line x1="40" y1={oy} x2="260" y2={oy} stroke="#cbd5e1" />
              <line x1={ox} y1="40" x2={ox} y2="250" stroke="#cbd5e1" />
              <circle cx={ox} cy={oy} r={R} fill="none" stroke="#64748b" strokeWidth="1.5" />
              {mode === "Pythagorean" ? (
                <>
                  <rect x={c >= 0 ? ox : ox - hCos} y={oy} width={hCos} height={hCos} fill="rgba(8,185,221,.28)" stroke="#08b9dd" />
                  <rect x={ox - hSin} y={s >= 0 ? oy - hSin : oy} width={hSin} height={hSin} fill="rgba(139,69,244,.28)" stroke="#8b45f4" />
                  <rect x="318" y="36" width="54" height={stackH} fill="#fff" stroke="#334155" />
                  <rect x="318" y={36 + stackH * (1 - c * c)} width="54" height={Math.max(0, stackH * c * c)} fill="#08b9dd" />
                  <rect x="318" y="36" width="54" height={Math.max(0, stackH * s * s)} fill="#8b45f4" />
                  <text x="318" y="28" fill="#334155" fontSize="11">area 1</text>
                  <text x="376" y={36 + stackH * s * s / 2 + 4} fill="#8b45f4" fontSize="11">sin²</text>
                  <text x="376" y={36 + stackH * (1 - c * c / 2)} fill="#08b9dd" fontSize="11">cos²</text>
                </>
              ) : null}
              <polygon points={`${ox},${oy} ${ox + c * R},${oy} ${px},${py}`} fill="rgba(20,125,242,.14)" stroke="#147df2" />
              <line x1={ox} y1={oy} x2={px} y2={py} stroke="#8b45f4" strokeWidth="2.4" />
              {mode === "Double Angle" ? <line x1={ox} y1={oy} x2={ox + Math.cos(two) * R} y2={oy - Math.sin(two) * R} stroke="#d97706" strokeWidth="2.6" /> : null}
              {mode === "Half Angle" ? <line x1={ox} y1={oy} x2={ox + Math.cos(half) * R} y2={oy - Math.sin(half) * R} stroke="#0ea5e9" strokeWidth="2.4" /> : null}
              {mode === "Angle Sum" || mode === "Product-Sum" ? <line x1={ox} y1={oy} x2={ox + Math.cos((th + phi) * Math.PI / 180) * R} y2={oy - Math.sin((th + phi) * Math.PI / 180) * R} stroke="#d97706" strokeWidth="2.4" /> : null}
              <circle cx={px} cy={py} r="7" fill="#147df2" />
              <text x="16" y="24" fill="#0f172a" fontSize="14" fontWeight="700">{headline(mode)}</text>
              {mode === "Double Angle" ? <text x="16" y="44" fill="#d97706" fontSize="12">gold ray is 2θ</text> : null}
              {mode === "Pythagorean" ? <text x="16" y="44" fill="#334155" fontSize="12">squares on the legs · stack on the right is always 1</text> : null}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#08b9dd" label="sin θ" value={fmt(s)} />
            <LiveRow color="#8b45f4" label="cos θ" value={fmt(c)} />
            {mode === "Pythagorean" ? <LiveRow color="#10b981" label="sin²+cos²" value={fmt(s * s + c * c, 4)} /> : null}
            {mode === "Double Angle" ? <LiveRow color="#d97706" label="2 sinθ cosθ" value={fmt(2 * s * c, 4)} /> : null}
            <div className="msk-history" aria-label="Proof tiles">
              {(bank[mode] ?? bank.Pythagorean!).map((step) => (
                <button
                  key={step}
                  type="button"
                  className={tiles.includes(step) ? "active" : ""}
                  onClick={() => setTiles((current) => current.includes(step) ? current.filter((item) => item !== step) : [...current, step])}
                >
                  {step}
                </button>
              ))}
            </div>
            {tiles.length ? <p className="msk-note">Order: {tiles.join(" → ")}</p> : <p className="msk-note">Tap tiles in order to write the identity from the figure.</p>}
            <ChallengeBox page={page} mode={mode} />
          </aside>
        </>
      )}
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
    return <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label={mode} data-mode-canvas={mode}><rect width="420" height="320" fill="#f8fbff" /><polygon points={pts} fill="rgba(139,69,244,.12)" stroke="#8b45f4" strokeWidth="2" /></svg>;
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
  if (/inverse/.test(pageId)) {
    return (
      <svg className="msk-graph is-dark" viewBox="0 0 420 320" role="img" aria-label="Principal inverse">
        <rect width="420" height="320" fill="#061428" />
        <path d={`M40 ${260 - a * 8} C 140 ${260 - a * 8}, 180 ${80 + b * 6}, 380 ${60 + b * 4}`} fill="none" stroke="#c4b5fd" strokeWidth="3" />
        <circle cx={210 + n * 4} cy={160 - a * 10} r="7" fill="#fbbf24" />
        <text x="24" y="32" fill="#67e8f9" fontSize="14">arcsin / arccos principal branch</text>
      </svg>
    );
  }
  if (/application/.test(pageId)) {
    return (
      <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label="Angle of elevation">
        <rect width="420" height="320" fill="#f8fbff" />
        <polygon points={`40,280 ${180 + a * 12},280 ${180 + a * 12},${80 + b * 8}`} fill="#e0f7ff" stroke="#147df2" strokeWidth="2" />
        <text x="24" y="32" fill="#334155" fontSize="14">h = d tan θ · {mode}</text>
      </svg>
    );
  }
  if (/epidemic/.test(pageId)) {
    return (
      <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label="SIR curves">
        <rect width="420" height="320" fill="#f8fbff" />
        <path d={`M20 80 C 120 ${40 + a * 4}, 220 90, 400 ${60 + b * 3}`} fill="none" stroke="#ef4444" strokeWidth="3" />
        <path d={`M20 220 C 140 ${180 - n}, 260 240, 400 260`} fill="none" stroke="#10b981" strokeWidth="3" />
        <text x="24" y="32" fill="#334155" fontSize="14">S / I / R compartments</text>
      </svg>
    );
  }
  return (
    <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label={`${pageId} ${mode}`} data-mode-canvas={mode}>
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

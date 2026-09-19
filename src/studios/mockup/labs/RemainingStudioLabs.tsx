import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import CombinatoricsLab from "../../discrete/combinatorics/CombinatoricsLab";
import NumberSenseLab from "../../discrete/number-sense/NumberSenseLab";
import NumberPatternsLab from "../../discrete/patterns/NumberPatternsLab";
import PrimesLab from "../../discrete/primes/PrimesLab";
import CoordinateLab from "../../geometry/coordinate/CoordinateLab";
import ConstructionLab from "../../geometry/construction/ConstructionLab";
import MeasurementLab from "../../geometry/measurement/MeasurementLab";
import TransformationsLab from "../../geometry/transformations/TransformationsLab";
import ProofsLab from "../../geometry/proofs/ProofsLab";
import SolidsStudioLab from "../../geometry/solids/SolidsStudioLab";
import VectorSpacesLab from "../../linear-algebra/VectorSpacesLab";
import LinearAlgebraLab from "../../linear-algebra/LinearAlgebraLabs";
import FractalsLab from "../../complex/FractalsLab";
import ComplexNumbersLab from "../../complex/ComplexNumbersLabs";
import LogicLab from "../../discrete/logic/LogicLab";
import AlgorithmsLab from "../../discrete/algorithms/AlgorithmsLab";
import CryptographyLab from "../../discrete/crypto/CryptographyLab";
import { DiscreteGraphsLinkLab, DiscreteSetsLinkLab } from "../../discrete/DiscreteEngineLinks";
import { Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, LiveRow, Panel, SliderRow, StepList, fmt, useLabMode } from "../studioLabKit";
import { useTrigSession } from "../trigStudioSession";
import ModellingStudioLab from "./ModellingLabs";
import { InverseTrigLab as TargetInverseTrigLab } from "./InverseTrigLab";
import { ApplicationsLab as TargetApplicationsLab } from "./ApplicationsLab";
import { ArRoomScene, ElevationTriangle, StudioMath3D } from "../../shared/studioMath3D";

function Chrome({ page, children, layout, toolbar }: { page: StudioMockupPage; children: ReactNode | ((mode: string) => ReactNode); layout?: "quad"; toolbar?: ReactNode }) {
  return (
    <Phase1LabChrome page={page} toolbar={toolbar}>
      {layout === "quad" ? (
        (mode) => <div className="msk-lab is-quad" data-mode-canvas={mode}>{typeof children === "function" ? children(mode) : children}</div>
      ) : children}
    </Phase1LabChrome>
  );
}

function PascalTriangle({ rows = 6 }: { rows?: number }) {
  const cells: number[][] = [[1]];
  for (let r = 1; r < rows; r += 1) {
    const prev = cells[r - 1]!;
    cells.push(Array.from({ length: r + 1 }, (_, k) => (prev[k - 1] ?? 0) + (prev[k] ?? 0)));
  }
  return (
    <div className="msk-pascal" aria-label="Pascal triangle">
      {cells.map((row, i) => (
        <span key={i}>{row.map((n, k) => <i key={`${i}-${k}`}>{n}</i>)}</span>
      ))}
    </div>
  );
}

export default function RemainingStudioLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const id = page.route.includes("discrete-world") && page.id === "graphs" ? "discrete-graphs" : page.route.includes("geometry") && page.id === "ar" ? "geometry-ar" : page.id;
  switch (id) {
    case "construction": return <ConstructionLab page={page} />;
    case "transformations": return <TransformationsLab page={page} />;
    case "coordinate": return <CoordinateLab page={page} />;
    case "measurement": return <MeasurementLab page={page} />;
    case "proofs": return <ProofsLab page={page} />;
    case "solids": return <SolidsStudioLab page={page} />;
    case "geometry-ar": return <ArLab page={page} kind="geometry" />;
    case "inverse": return <TargetInverseTrigLab page={page} />;
    case "applications": return <TargetApplicationsLab page={page} />;
    case "ar": return <ArLab page={page} kind="trig" />;
    case "matrices":
    case "row-reduction":
    case "linear-transforms":
    case "determinants":
    case "eigenvectors":
    case "orthogonality":
    case "least-squares":
    case "playground":
      return <LinearAlgebraLab page={page} extra={extra} />;
    case "vector-spaces": return <VectorSpacesLab page={page} />;
    case "arithmetic":
    case "polar-forms":
    case "rotation":
    case "roots":
    case "euler":
    case "loci":
    case "waves-circuits":
      return <ComplexNumbersLab page={page} extra={extra} />;
    case "fractals": return <FractalsLab page={page} />;
    case "motion":
    case "population":
    case "epidemics":
    case "finance":
    case "optimization":
    case "networks":
    case "regression":
    case "periodic":
    case "numerical":
    case "comparison":
      return <ModellingStudioLab page={page} />;
    case "number-sense": return <NumberSenseLab page={page} />;
    case "primes": return <PrimesLab page={page} />;
    case "number-patterns": return <NumberPatternsLab page={page} />;
    case "combinatorics": return <CombinatoricsLab page={page} />;
    case "logic": return <LogicLab page={page} />;
    case "sets": return <DiscreteSetsLinkLab page={page} />;
    case "graphs":
    case "discrete-graphs": return <DiscreteGraphsLinkLab page={page} />;
    case "algorithms": return <AlgorithmsLab page={page} />;
    case "cryptography": return <CryptographyLab page={page} />;
    case "data-explorer": return <DataExplorerLab page={page} />;
    case "descriptive": return <DescriptiveLab page={page} />;
    case "experiments": return <ExperimentsLab page={page} />;
    case "counting": return <CountingLab page={page} />;
    case "clt": return <CltLab page={page} />;
    case "confidence-intervals": return <CiLab page={page} />;
    case "hypothesis": return <HypothesisLab page={page} />;
    case "correlation": return <CorrelationLab page={page} />;
    case "anova": return <AnovaLab page={page} />;
    default: return null;
  }
}

function ArLab({ page, kind }: { page: StudioMockupPage; kind: "geometry" | "trig" }) {
  const { mode } = useLabMode(page);
  const session = useTrigSession();
  const [dist, setDist] = useState(kind === "trig" ? 28.45 : 2.45);
  const [elev, setElev] = useState(kind === "trig" ? 32.7 : 78.4);
  const [eye, setEye] = useState(1.6);
  const [scale, setScale] = useState(1);
  const [measured, setMeasured] = useState(false);
  const [liveHeight, setLiveHeight] = useState(0);
  const [snapPlanes, setSnapPlanes] = useState(true);
  const [rightAngles, setRightAngles] = useState(true);
  const height = kind === "trig" ? dist * Math.tan(elev * Math.PI / 180) + eye : 1.32;
  const tools = kind === "trig"
    ? ["Height", "Distance", "Angle", "Triangle", "Unit Circle", "Wave"]
    : ["Select", "Point", "Line", "Circle", "Polygon", "3D Solid", "Plane", "Measure"];
  const modeTool = kind === "trig"
    ? ({ "Height Measurement": "Height", Distance: "Distance", Angle: "Angle", "Triangle Overlay": "Triangle", "Unit Circle": "Unit Circle", "Wave Projection": "Wave" }[mode] ?? "Height")
    : (tools.includes(mode) ? mode : tools[0]);
  const [tool, setTool] = useState(modeTool.toLowerCase());
  useEffect(() => {
    setTool(modeTool.toLowerCase());
  }, [modeTool]);
  const active = kind === "trig" ? modeTool.toLowerCase() : tool;
  const hud = kind === "trig"
    ? (mode === "Wave Projection" ? "WAVE OVERLAY" : mode === "Unit Circle" ? "UNIT CIRCLE AR" : mode === "Distance" ? "DISTANCE TAPE" : mode === "Angle" ? "ANGLE HUD" : mode === "Triangle Overlay" ? "TRIANGLE OVERLAY" : "HEIGHT MEASURE")
    : `${tool.toUpperCase()} TOOL`;
  return (
    <Chrome page={page}>
      <Panel title={kind === "trig" ? mode : "AR tools"}>
        <div className="msk-tool-grid">
          {tools.map((id) => (
            <button key={id} type="button" className={active === id.toLowerCase() ? "active" : ""} onClick={() => setTool(id.toLowerCase())}>{id}</button>
          ))}
        </div>
        {kind === "trig" ? (
          <>
            <SliderRow label="Angle of elevation" value={elev} min={10} max={70} step={0.1} onChange={setElev} unit="°" />
            <SliderRow label="Horizontal distance" value={dist} min={8} max={40} step={0.05} onChange={setDist} />
            <SliderRow label="Eye / reference height" value={eye} min={1} max={2} step={0.05} onChange={setEye} />
            <button type="button" className="msk-primary" onClick={() => { setMeasured(true); setLiveHeight(height); }}>Start measurement</button>
          </>
        ) : (
          <>
            <SliderRow label="Reference scale" value={scale} min={0.5} max={3} step={0.05} onChange={setScale} />
            <label className="msk-toggle"><input type="checkbox" checked={snapPlanes} onChange={(e) => setSnapPlanes(e.target.checked)} /> Snap to planes</label>
            <label className="msk-toggle"><input type="checkbox" checked={rightAngles} onChange={(e) => setRightAngles(e.target.checked)} /> Right angles</label>
          </>
        )}
      </Panel>
      <section className="msk-panel msk-canvas" data-ar-mode={kind === "trig" ? mode : tool}>
        <div className="msk-cam">
          <span className="msk-cam-hud">{hud}</span>
          <i className="msk-cam-rec" />
          <div className="msk-cam-frame" />
        {kind === "trig" && (mode === "Unit Circle" || mode === "Wave Projection") ? (
          <svg className="msk-graph" viewBox="0 0 560 360" role="img" aria-label={mode}>
            <rect width="560" height="360" fill="#9ec9f0" />
            <rect x="0" y="230" width="560" height="130" fill="#c4b8a4" />
            {Array.from({ length: 8 }, (_, i) => <line key={i} x1={40 + i * 70} y1="230" x2={10 + i * 70} y2="360" stroke="#94a3b8" strokeOpacity=".35" />)}
            <rect x="220" y="70" width="220" height="200" fill="#d7dde4" stroke="#94a3b8" />
            {Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 }, (_, c) => <rect key={`${r}${c}`} x={235 + c * 50} y={85 + r * 34} width="28" height="22" fill="#8fb4d4" />))}
            {mode === "Unit Circle" ? (
              <>
                <circle cx="280" cy="180" r="70" fill="none" stroke="#22d3ee" strokeWidth="2" />
                <line x1="280" y1="180" x2={280 + 70 * Math.cos(session.theta * Math.PI / 180)} y2={180 - 70 * Math.sin(session.theta * Math.PI / 180)} stroke="#fbbf24" strokeWidth="2" />
              </>
            ) : (
              <polyline points={Array.from({ length: 40 }, (_, i) => `${20 + i * 13},${200 - Math.sin(i / 4 + session.theta * Math.PI / 180) * 28}`).join(" ")} fill="none" stroke="#fbbf24" strokeWidth="2.4" />
            )}
            <text x="240" y="244" fill="#0f172a" fontSize="12">{fmt(dist, 2)} m</text>
            <text x="150" y="220" fill="#f59e0b" fontSize="12">{fmt(elev, 1)}°</text>
          </svg>
        ) : kind === "trig" ? (
          <StudioMath3D label={`${mode} elevation`}>
            <ElevationTriangle dist={dist} height={height} />
          </StudioMath3D>
        ) : (
          <StudioMath3D label="Room AR overlay">
            <ArRoomScene dist={dist} elev={elev} scale={scale} />
          </StudioMath3D>
        )}
        </div>
      </section>
      <aside className="msk-panel msk-live">
        {kind === "trig" ? (
          <>
            <LiveRow color="#f59e0b" label="Angle of elevation" value={`${fmt(elev, 1)}°`} />
            <LiveRow color="#08b9dd" label="Horizontal distance" value={`${fmt(dist, 2)} m`} />
            <LiveRow color="#8b45f4" label="Height h = d tan θ + eye" value={`${fmt(height, 2)} m`} />
            <LiveRow color="#147df2" label="Reference height" value={`${fmt(eye, 2)} m`} />
            <LiveRow color="#10b981" label="Measured height" value={measured ? `${fmt(liveHeight, 2)} m` : "—"} />
            <p className="msk-formula">h = d tan(θ) + eye</p>
            <StepList items={["Set ground anchor at your position.", "Aim at the top of the target.", "Adjust until angle is steady.", "Read computed height."]} />
          </>
        ) : (
          <>
            <LiveRow color="#08b9dd" label="AB" value={`${fmt(2.18 * scale, 2)} m`} />
            <LiveRow color="#147df2" label="BC" value={`${fmt(2.45 * scale, 2)} m`} />
            <LiveRow color="#8b45f4" label="CA" value={`${fmt(2.18 * scale, 2)} m`} />
            <LiveRow color="#f59e0b" label="∠BAC" value={`${fmt(elev, 1)}°`} />
            <LiveRow color="#8b45f4" label="Pyramid volume" value={`${fmt(0.82 * scale ** 3, 2)} m³`} />
            <LiveRow color="#10b981" label="Tool" value={tool} />
            <LiveRow color="#64748b" label="Snap" value={`${snapPlanes ? "planes" : "free"}${rightAngles ? " · right angles" : ""}`} />
          </>
        )}
        <ChallengeBox page={page} mode={kind === "trig" ? mode : undefined} />
      </aside>
    </Chrome>
  );
}

function CountingPascalLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(5);
  const [k, setK] = useState(3);
  const fact = (v: number): number => (v <= 1 ? 1 : v * fact(v - 1));
  const p = n >= k ? fact(n) / fact(n - k) : 0;
  const c = k === 0 ? 1 : p / fact(k);
  return (
    <Chrome page={page}>
      <Panel title="nPr / nCr"><SliderRow label="n" value={n} min={1} max={8} step={1} onChange={setN} /><SliderRow label="k" value={k} min={0} max={8} step={1} onChange={setK} /></Panel>
      <section className="msk-panel msk-canvas">
        <PascalTriangle rows={Math.min(8, n + 1)} />
        <p className="msk-formula">C({n},{k}) sits in Pascal row {n}, entry {k}.</p>
      </section>
      <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="P(n,k)" value={fmt(p, 0)} /><LiveRow color="#8b45f4" label="C(n,k)" value={fmt(c, 0)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function quantile(sorted: number[], p: number) {
  if (!sorted.length) return 0;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  const t = idx - lo;
  return (sorted[lo] ?? 0) * (1 - t) + (sorted[hi] ?? sorted[lo] ?? 0) * t;
}

function pearson(pts: Array<{ x: number; y: number }>) {
  const n = pts.length || 1;
  const mx = pts.reduce((s, p) => s + p.x, 0) / n;
  const my = pts.reduce((s, p) => s + p.y, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (const p of pts) {
    const a = p.x - mx;
    const b = p.y - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  return num / Math.sqrt((dx * dy) || 1);
}

function seededRng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function histogramBins(values: number[], bins: number) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const counts = Array.from({ length: bins }, () => 0);
  for (const v of values) {
    const b = Math.min(bins - 1, Math.floor(((v - min) / span) * bins));
    counts[b] += 1;
  }
  return { min, max, span, counts };
}

function DataExplorerLab({ page }: { page: StudioMockupPage }) {
  const [params] = useSearchParams();
  const dice = `${params.get("set") ?? ""}`.includes("dice") || params.toString().includes("dice");
  const base = dice ? [1, 2, 3, 4, 5, 6] : [42, 55, 60, 62, 68, 72, 75, 80, 88, 90];
  const [n, setN] = useState(base.length);
  const scores = Array.from({ length: n }, (_, i) => base[i % base.length]!);
  const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
  const bins = dice ? 6 : 5;
  const hist = dice
    ? { min: 1, max: 6, span: 5, counts: [1, 2, 3, 4, 5, 6].map((face) => scores.filter((s) => s === face).length) }
    : histogramBins(scores, bins);
  const meanX = 30 + ((mean - hist.min) / hist.span) * 360;
  const maxCount = Math.max(1, ...hist.counts);
  return (
    <Chrome page={page}>
      <Panel title="Dataset">
        <p className="msk-note">{dice ? "Dice faces · counts of 1–6." : "Student performance · histogram of live scores."}</p>
        <SliderRow label="n" value={n} min={dice ? 6 : 4} max={dice ? 60 : 40} step={dice ? 6 : 1} onChange={setN} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 200" role="img" aria-label="Histogram">
          <rect width="420" height="200" fill="#f8fbff" />
          {hist.counts.map((c, i) => {
            const bw = 360 / hist.counts.length;
            const h = (c / maxCount) * 150;
            return <rect key={i} x={30 + i * bw} y={180 - h} width={bw - 8} height={h} fill="#08b9dd" />;
          })}
          <line x1={meanX} y1="20" x2={meanX} y2="190" stroke="#8b45f4" strokeDasharray="4 3" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#08b9dd" label="Mean score" value={fmt(mean, 1)} />
        <LiveRow color="#8b45f4" label="n" value={String(n)} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function DescriptiveLab({ page }: { page: StudioMockupPage }) {
  const data = [4, 5, 6, 6, 7, 7, 7, 8, 9, 10];
  const sorted = [...data].sort((a, b) => a - b);
  const mean = data.reduce((s, v) => s + v, 0) / data.length;
  const q1 = quantile(sorted, 0.25);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Center & spread"><p className="msk-note">{mode === "Spread" ? "IQR and quartiles from the sorted sample." : mode === "Center" ? "Mean and median of a small sample." : "Dot plot of a small sample."}</p></Panel>
          <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 400 140"><rect width="400" height="140" fill="#f8fbff" /><line x1="20" y1="90" x2="380" y2="90" stroke="#334155" />{data.map((v, i) => <circle key={`${v}${i}`} cx={20 + v * 32} cy={80 - (i % 3) * 12} r="5" fill="#147df2" />)}</svg></section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label={mode === "Spread" ? "Q1" : "Mean"} value={fmt(mode === "Spread" ? q1 : mean, 2)} />
            <LiveRow color="#8b45f4" label={mode === "Spread" ? "Q3" : "IQR"} value={fmt(mode === "Spread" ? q3 : iqr, 2)} />
            <LiveRow color="#10b981" label="IQR" value={fmt(iqr, 2)} />
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function ExperimentsLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(36);
  const [seed] = useState(12345);
  const sums = useMemo(() => {
    const rand = seededRng(seed);
    return Array.from({ length: n }, () => 1 + Math.floor(rand() * 6) + 1 + Math.floor(rand() * 6));
  }, [n, seed]);
  const counts = Array.from({ length: 11 }, (_, i) => sums.filter((s) => s === i + 2).length);
  const p7 = sums.filter((s) => s === 7).length / Math.max(1, n);
  const maxC = Math.max(1, ...counts);
  return (
    <Chrome page={page}>
      <Panel title="Dice"><SliderRow label="Trials shown" value={n} min={6} max={72} step={6} onChange={setN} /></Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 360 160" role="img" aria-label="Dice sum histogram 2-12">
          <rect width="360" height="160" fill="#f8fbff" />
          {counts.map((c, i) => <rect key={i} x={20 + i * 30} y={140 - (c / maxC) * 100} width="24" height={(c / maxC) * 100} fill={i === 5 ? "#f59e0b" : "#147df2"} />)}
        </svg>
      </section>
      <aside className="msk-panel msk-live"><LiveRow color="#f59e0b" label="P(sum=7)" value={fmt(p7, 3)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function CountingLab({ page }: { page: StudioMockupPage }) {
  return <CountingPascalLab page={page} />;
}

function CltLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(25);
  const se = 10 / Math.sqrt(n);
  const dots = Array.from({ length: n }, (_, i) => {
    const hash = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    const u = hash - Math.floor(hash);
    return { x: 200 + (u * 2 - 1) * Math.min(160, se * 16), y: 100 + Math.sin(i * 2.15) * 28 };
  });
  return (
    <Chrome page={page}>
      <Panel title="Sampling"><SliderRow label="n" value={n} min={4} max={100} step={1} onChange={setN} /></Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 400 180" role="img" aria-label="Sampling distribution of the mean">
          <rect width="400" height="180" fill="#f8fbff" />
          <path d="M20 160 C 80 160, 140 30, 200 30 S 320 160 380 160" fill="none" stroke="#8b45f4" strokeWidth="2" />
          {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="3.2" fill="#147df2" />)}
        </svg>
      </section>
      <aside className="msk-panel msk-live"><LiveRow color="#8b45f4" label="SE = 10/√n" value={fmt(se, 2)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function CiLab({ page }: { page: StudioMockupPage }) {
  const [level, setLevel] = useState(95);
  const z = level >= 99 ? 2.58 : level >= 95 ? 1.96 : 1.28;
  const half = z * 10 / Math.sqrt(30);
  const intervals = Array.from({ length: 12 }, (_, i) => {
    const mean = 50 + Math.sin(i * 1.7) * 8;
    const lo = mean - half;
    const hi = mean + half;
    return { lo, hi, hit: lo <= 50 && 50 <= hi };
  });
  const captured = intervals.filter((item) => item.hit).length;
  const xOf = (v: number) => 40 + ((v - 20) / 60) * 320;
  return (
    <Chrome page={page}>
      <Panel title="Confidence"><SliderRow label="Level %" value={level} min={80} max={99} step={1} onChange={setLevel} /></Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 400 140" role="img" aria-label="Capture intervals">
          <rect width="400" height="140" fill="#f8fbff" />
          <line x1={xOf(50)} y1="8" x2={xOf(50)} y2="132" stroke="#334155" strokeDasharray="3 3" />
          {intervals.map((item, i) => <line key={i} x1={xOf(item.lo)} y1={16 + i * 10} x2={xOf(item.hi)} y2={16 + i * 10} stroke={item.hit ? "#147df2" : "#ef4444"} strokeWidth="3" />)}
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="z × 10/√30 width" value={fmt(2 * half, 2)} />
        <LiveRow color="#10b981" label="Captured μ=50" value={`${captured} of 12`} />
        <LiveRow color="#147df2" label="Target capture" value={`${level} of 100`} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function HypothesisLab({ page }: { page: StudioMockupPage }) {
  const [p, setP] = useState(0.02);
  const [a, setA] = useState(0.05);
  const reject = p < a;
  const alphaX = 200 + (1 - a) * 160;
  return (
    <Chrome page={page}>
      <Panel title="Test"><SliderRow label="p-value" value={p} min={0.001} max={0.2} step={0.001} onChange={setP} /><SliderRow label="α" value={a} min={0.01} max={0.1} step={0.01} onChange={setA} /></Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 400 160" role="img" aria-label="Rejection region">
          <rect width="400" height="160" fill="#f8fbff" />
          {reject ? <rect x={alphaX} y="10" width={Math.max(8, 380 - alphaX)} height="140" fill="rgba(239,68,68,.22)" /> : null}
          <path d="M20 140 C 80 140, 140 20, 200 20 S 320 140 380 140" fill="none" stroke="#8b45f4" />
          <line x1={alphaX} y1="10" x2={alphaX} y2="150" stroke="#ef4444" strokeDasharray="4 3" />
        </svg>
      </section>
      <aside className="msk-panel msk-live"><LiveRow color="#ef4444" label="Reject H0?" value={reject ? "Yes" : "No"} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function CorrelationLab({ page }: { page: StudioMockupPage }) {
  const [r, setR] = useState(0.8);
  const jitter = Math.sqrt(Math.max(0, 1 - r * r));
  const pts = Array.from({ length: 8 }, (_, i) => ({
    x: 50 + i * 35,
    y: 150 - i * 12 * r + (i % 2) * 8 * jitter,
  }));
  const liveR = pearson(pts);
  return (
    <Chrome page={page}>
      <Panel title="Fit"><SliderRow label="r" value={r} min={-1} max={1} step={0.05} onChange={setR} /></Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 360 200" role="img" aria-label="Correlation scatter">
          <rect width="360" height="200" fill="#f8fbff" />
          <line x1="40" y1={160} x2="320" y2={160 - r * 120} stroke="#8b45f4" />
          {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#147df2" />)}
        </svg>
      </section>
      <aside className="msk-panel msk-live"><LiveRow color="#8b45f4" label="r" value={fmt(liveR, 2)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function AnovaLab({ page }: { page: StudioMockupPage }) {
  const [g1, setG1] = useState(4);
  const [g2, setG2] = useState(6);
  const [g3, setG3] = useState(5);
  const means = [g1, g2, g3];
  const grand = (g1 + g2 + g3) / 3;
  const msb = means.reduce((s, m) => s + (m - grand) ** 2, 0) / 3;
  const msw = 1;
  const f = msb / msw;
  return (
    <Chrome page={page}>
      <Panel title="Group means"><SliderRow label="Group A" value={g1} min={1} max={10} step={0.1} onChange={setG1} /><SliderRow label="Group B" value={g2} min={1} max={10} step={0.1} onChange={setG2} /><SliderRow label="Group C" value={g3} min={1} max={10} step={0.1} onChange={setG3} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 360 180"><rect width="360" height="180" fill="#f8fbff" /><rect x="50" y={160 - g1 * 12} width="40" height={g1 * 12} fill="#08b9dd" /><rect x="150" y={160 - g2 * 12} width="40" height={g2 * 12} fill="#8b45f4" /><rect x="250" y={160 - g3 * 12} width="40" height={g3 * 12} fill="#f59e0b" /></svg></section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#08b9dd" label="MSB = var(means)" value={fmt(msb, 2)} />
        <LiveRow color="#64748b" label="MSW" value={fmt(msw, 0)} />
        <LiveRow color="#147df2" label="F = MSB/MSW" value={fmt(f, 2)} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}
import { useState, type ReactNode } from "react";
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
  const height = kind === "trig" ? dist * Math.tan(elev * Math.PI / 180) : 1.32;
  const tools = kind === "trig"
    ? ["Height", "Distance", "Angle", "Triangle", "Unit Circle", "Wave"]
    : ["Select", "Point", "Line", "Circle", "Polygon", "3D Solid", "Plane", "Measure"];
  const modeTool = kind === "trig"
    ? ({ "Height Measurement": "Height", Distance: "Distance", Angle: "Angle", "Triangle Overlay": "Triangle", "Unit Circle": "Unit Circle", "Wave Projection": "Wave" }[mode] ?? "Height")
    : tools[0];
  const [tool, setTool] = useState(modeTool.toLowerCase());
  const active = kind === "trig" ? modeTool.toLowerCase() : tool;
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
            <button type="button" className="msk-primary">Start measurement</button>
          </>
        ) : (
          <>
            <SliderRow label="Reference scale" value={scale} min={0.5} max={3} step={0.05} onChange={setScale} />
            <label className="msk-toggle"><input type="checkbox" defaultChecked /> Snap to planes</label>
            <label className="msk-toggle"><input type="checkbox" defaultChecked /> Right angles</label>
          </>
        )}
      </Panel>
      <section className="msk-panel msk-canvas" data-ar-mode={kind === "trig" ? mode : tool}>
        <div className="msk-cam">
          <span className="msk-cam-hud">{kind === "trig" ? (mode === "Wave Projection" ? "WAVE OVERLAY" : mode === "Unit Circle" ? "UNIT CIRCLE AR" : mode === "Distance" ? "DISTANCE TAPE" : mode === "Angle" ? "ANGLE HUD" : mode === "Triangle Overlay" ? "TRIANGLE OVERLAY" : "HEIGHT MEASURE") : "AR CAMERA"}</span>
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
            <LiveRow color="#8b45f4" label="Height h = d tan θ" value={`${fmt(height, 2)} m`} />
            <LiveRow color="#147df2" label="Reference height" value={`${fmt(eye, 2)} m`} />
            <p className="msk-formula">tan(θ) = h / d</p>
            <StepList items={["Set ground anchor at your position.", "Aim at the top of the target.", "Adjust until angle is steady.", "Read computed height."]} />
          </>
        ) : (
          <>
            <LiveRow color="#08b9dd" label="AB" value={`${fmt(2.18 * scale, 2)} m`} />
            <LiveRow color="#147df2" label="BC" value={`${fmt(2.45 * scale, 2)} m`} />
            <LiveRow color="#8b45f4" label="CA" value={`${fmt(2.18 * scale, 2)} m`} />
            <LiveRow color="#f59e0b" label="∠BAC" value={`${fmt(elev, 1)}°`} />
            <LiveRow color="#8b45f4" label="Pyramid volume" value={`${fmt(0.82 * scale ** 3, 2)} m³`} />
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

function DataExplorerLab({ page }: { page: StudioMockupPage }) {
  const scores = [42, 55, 60, 62, 68, 72, 75, 80, 88, 90];
  const mean = scores.reduce((s, v) => s + v, 0) / scores.length;
  return (
    <Chrome page={page}>
      <Panel title="Dataset"><p className="msk-note">Student performance · 10 rows shown.</p></Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 200" role="img" aria-label="Histogram">
          <rect width="420" height="200" fill="#f8fbff" />
          {scores.map((s, i) => <rect key={s} x={30 + i * 38} y={180 - s} width="28" height={s} fill="#08b9dd" />)}
          <line x1={30 + mean * 3.2} y1="20" x2={30 + mean * 3.2} y2="190" stroke="#8b45f4" strokeDasharray="4 3" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#08b9dd" label="Mean score" value={fmt(mean, 1)} />
        <LiveRow color="#8b45f4" label="n" value="10" />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function DescriptiveLab({ page }: { page: StudioMockupPage }) {
  const data = [4, 5, 6, 6, 7, 7, 7, 8, 9, 10];
  const mean = data.reduce((s, v) => s + v, 0) / data.length;
  const q1 = 6, q3 = 8;
  return (
    <Chrome page={page}>
      <Panel title="Center & spread"><p className="msk-note">Dot plot of a small sample.</p></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 400 140"><rect width="400" height="140" fill="#f8fbff" /><line x1="20" y1="90" x2="380" y2="90" stroke="#334155" />{data.map((v, i) => <circle key={`${v}${i}`} cx={20 + v * 32} cy={80 - (i % 3) * 12} r="5" fill="#147df2" />)}</svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="Mean" value={fmt(mean, 2)} /><LiveRow color="#8b45f4" label="IQR" value={String(q3 - q1)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function ExperimentsLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(36);
  const p7 = 6 / 36;
  return (
    <Chrome page={page}>
      <Panel title="Dice"><SliderRow label="Trials shown" value={n} min={6} max={72} step={6} onChange={setN} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 360 160">{Array.from({ length: 11 }, (_, i) => <rect key={i} x={20 + i * 30} y={140 - ((i === 5 ? 6 : 3 + (i % 4)) / 6) * 100} width="24" height={((i === 5 ? 6 : 3 + (i % 4)) / 6) * 100} fill={i === 5 ? "#f59e0b" : "#147df2"} />)}</svg></section>
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
  return (
    <Chrome page={page}>
      <Panel title="Sampling"><SliderRow label="n" value={n} min={4} max={100} step={1} onChange={setN} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 400 180"><rect width="400" height="180" fill="#f8fbff" /><path d="M20 160 C 80 160, 140 30, 200 30 S 320 160 380 160" fill="none" stroke="#8b45f4" strokeWidth="2" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#8b45f4" label="SE = 10/√n" value={fmt(se, 2)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function CiLab({ page }: { page: StudioMockupPage }) {
  const [level, setLevel] = useState(95);
  return (
    <Chrome page={page}>
      <Panel title="Confidence"><SliderRow label="Level %" value={level} min={80} max={99} step={1} onChange={setLevel} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 400 140">{Array.from({ length: 12 }, (_, i) => <line key={i} x1={40} y1={20 + i * 10} x2={40 + 200 + (i % 3) * 20} y2={20 + i * 10} stroke={i % 5 === 0 ? "#ef4444" : "#147df2"} strokeWidth="3" />)}</svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="Target capture" value={`${level} of 100`} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function HypothesisLab({ page }: { page: StudioMockupPage }) {
  const [p, setP] = useState(0.02);
  const [a, setA] = useState(0.05);
  return (
    <Chrome page={page}>
      <Panel title="Test"><SliderRow label="p-value" value={p} min={0.001} max={0.2} step={0.001} onChange={setP} /><SliderRow label="α" value={a} min={0.01} max={0.1} step={0.01} onChange={setA} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 400 160"><rect width="400" height="160" fill="#f8fbff" /><path d="M20 140 C 80 140, 140 20, 200 20 S 320 140 380 140" fill="none" stroke="#8b45f4" /><line x1="300" y1="10" x2="300" y2="150" stroke="#ef4444" strokeDasharray="4 3" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#ef4444" label="Reject H0?" value={p < a ? "Yes" : "No"} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function CorrelationLab({ page }: { page: StudioMockupPage }) {
  const [r, setR] = useState(0.8);
  return (
    <Chrome page={page}>
      <Panel title="Fit"><SliderRow label="r" value={r} min={-1} max={1} step={0.05} onChange={setR} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 360 200"><rect width="360" height="200" fill="#f8fbff" /><line x1="40" y1={160} x2="320" y2={160 - r * 120} stroke="#8b45f4" />{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={50 + i * 35} cy={150 - i * 12 * r + (i % 2) * 8} r="4" fill="#147df2" />)}</svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#8b45f4" label="r" value={fmt(r, 2)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function AnovaLab({ page }: { page: StudioMockupPage }) {
  const [g1, setG1] = useState(4);
  const [g2, setG2] = useState(6);
  const [g3, setG3] = useState(5);
  return (
    <Chrome page={page}>
      <Panel title="Group means"><SliderRow label="Group A" value={g1} min={1} max={10} step={0.1} onChange={setG1} /><SliderRow label="Group B" value={g2} min={1} max={10} step={0.1} onChange={setG2} /><SliderRow label="Group C" value={g3} min={1} max={10} step={0.1} onChange={setG3} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 360 180"><rect width="360" height="180" fill="#f8fbff" /><rect x="50" y={160 - g1 * 12} width="40" height={g1 * 12} fill="#08b9dd" /><rect x="150" y={160 - g2 * 12} width="40" height={g2 * 12} fill="#8b45f4" /><rect x="250" y={160 - g3 * 12} width="40" height={g3 * 12} fill="#f59e0b" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="F near 1 if equal" value={fmt(1 + Math.abs(g1 - g2) / 10, 2)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}
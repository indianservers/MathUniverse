import StatisticsCoreLab from "../../statistics/StatisticsCoreLabs";
import GeometryARWorkspace from "../../geometry/GeometryARWorkspace";
import { useStudioState } from "../../phase1/StudioModelProvider";
import { useEffect, useMemo, type ReactNode } from "react";
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
import SamplingCltLab from "../../statistics/SamplingCltLab";

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
    case "data-explorer": return <StatisticsCoreLab page={page} />;
    case "descriptive": return <StatisticsCoreLab page={page} />;
    case "experiments": return <StatisticsCoreLab page={page} />;
    case "counting": return <CountingLab page={page} />;
    case "clt": return <SamplingCltLab page={page} />;
    case "confidence-intervals": return <StatisticsCoreLab page={page} />;
    case "hypothesis": return <StatisticsCoreLab page={page} />;
    case "correlation": return <StatisticsCoreLab page={page} />;
    case "anova": return <StatisticsCoreLab page={page} />;
    default: return null;
  }
}

function ArLab({ page, kind }: { page: StudioMockupPage; kind: "geometry" | "trig" }) {
  const { mode } = useLabMode(page);
  const session = useTrigSession();
  const [dist, setDist] = useStudioState("RemainingStudioLabs:ArLab:dist", kind === "trig" ? 28.45 : 2.45);
  const [elev, setElev] = useStudioState("RemainingStudioLabs:ArLab:elev", kind === "trig" ? 32.7 : 78.4);
  const [eye, setEye] = useStudioState("RemainingStudioLabs:ArLab:eye", 1.6);
  const [scale, setScale] = useStudioState("RemainingStudioLabs:ArLab:scale", 1);
  const [measured, setMeasured] = useStudioState("RemainingStudioLabs:ArLab:measured", false);
  const [liveHeight, setLiveHeight] = useStudioState("RemainingStudioLabs:ArLab:liveHeight", 0);
  const [snapPlanes, setSnapPlanes] = useStudioState("RemainingStudioLabs:ArLab:snapPlanes", true);
  const [rightAngles, setRightAngles] = useStudioState("RemainingStudioLabs:ArLab:rightAngles", true);
  const height = kind === "trig" ? dist * Math.tan(elev * Math.PI / 180) + eye : 1.32;
  const tools = kind === "trig"
    ? ["Height", "Distance", "Angle", "Triangle", "Unit Circle", "Wave"]
    : ["Select", "Point", "Line", "Circle", "Polygon", "3D Solid", "Plane", "Measure"];
  const modeTool = kind === "trig"
    ? ({ "Height Measurement": "Height", Distance: "Distance", Angle: "Angle", "Triangle Overlay": "Triangle", "Unit Circle": "Unit Circle", "Wave Projection": "Wave" }[mode] ?? "Height")
    : (tools.includes(mode) ? mode : tools[0]);
  const [tool, setTool] = useStudioState("RemainingStudioLabs:ArLab:tool", modeTool.toLowerCase());
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
          <GeometryARWorkspace key={active} mode={active} scale={scale}><StudioMath3D label="Room AR overlay"><ArRoomScene dist={dist} elev={elev} scale={scale} /></StudioMath3D></GeometryARWorkspace>
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
  const [n, setN] = useStudioState("RemainingStudioLabs:CountingPascalLab:n", 5);
  const [k, setK] = useStudioState("RemainingStudioLabs:CountingPascalLab:k", 3);
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

function CountingLab({ page }: { page: StudioMockupPage }) {
  return <CountingPascalLab page={page} />;
}

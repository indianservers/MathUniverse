import { useMemo, useState, type PointerEvent, type ReactNode } from "react";
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
import FractalsLab from "../../complex/FractalsLab";
import LogicLab from "../../discrete/logic/LogicLab";
import AlgorithmsLab from "../../discrete/algorithms/AlgorithmsLab";
import CryptographyLab from "../../discrete/crypto/CryptographyLab";
import { DiscreteGraphsLinkLab, DiscreteSetsLinkLab } from "../../discrete/DiscreteEngineLinks";
import { aic, fitMetrics, sampleGrowth } from "../../modelling/comparisonMath";
import { Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, ExtraFrame, Field, LiveRow, Panel, Segmented, SliderRow, StatusOk, StepList, clamp, fmt, useLabMode } from "../studioLabKit";
import { gramSchmidt } from "../../linear-algebra/vectorSpaceMath";
import { useTrigSession } from "../trigStudioSession";
import { TransformUnitSquare } from "./unitSquareCanvas";
import {
  InverseTrigLab as TargetInverseTrigLab,
} from "./TrigonometryConceptLabs";
import {
  ApplicationsLab as TargetApplicationsLab,
} from "./TrigonometryAppliedLabs";

function Chrome({ page, children, layout, toolbar }: { page: StudioMockupPage; children: ReactNode | ((mode: string) => ReactNode); layout?: "quad"; toolbar?: ReactNode }) {
  return (
    <Phase1LabChrome page={page} toolbar={toolbar}>
      {layout === "quad" ? (
        (mode) => <div className="msk-lab is-quad" data-mode-canvas={mode}>{typeof children === "function" ? children(mode) : children}</div>
      ) : children}
    </Phase1LabChrome>
  );
}

function ToolGlyph({ kind }: { kind: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, ReactNode> = {
    Select: <path {...common} d="M7 4 8 17l3.2-3.1L14.8 20l1.8-1-3.5-6.1L18 12Z" />,
    Point: <circle cx="12" cy="12" r="3.4" fill="currentColor" />,
    Line: <path {...common} d="M3 18 21 6" />,
    Segment: <><path {...common} d="M5 17 19 7" /><circle cx="5" cy="17" r="1.8" fill="currentColor" /><circle cx="19" cy="7" r="1.8" fill="currentColor" /></>,
    Circle: <circle cx="12" cy="12" r="7" {...common} />,
    Arc: <path {...common} d="M5 16A8 8 0 0 1 19 8" />,
    Perpendicular: <><path {...common} d="M4 18h16" /><path {...common} d="M12 18V5" /><path {...common} d="M12 14h3v3" /></>,
    Parallel: <><path {...common} d="M5 16 19 8" /><path {...common} d="M5 11 19 3" /></>,
    Bisector: <><path {...common} d="M5 19 12 5l7 14" /><path {...common} d="M12 19V9" strokeDasharray="2 2" /></>,
    Angle: <><path {...common} d="M5 18h14" /><path {...common} d="M5 18 16 6" /><path {...common} d="M9 18a6 6 0 0 0 4.2-2.2" /></>,
    Polygon: <path {...common} d="M12 4 19 8.5v7L12 20 5 15.5v-7Z" />,
    Text: <path {...common} d="M6 7h12M12 7v11M8 18h8" />,
  };
  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[kind]}</svg>;
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
    case "matrices": return <MatricesLab page={page} />;
    case "row-reduction": return <RowReductionLab page={page} />;
    case "linear-transforms": return <LinearTransformsLab page={page} extra={extra} />;
    case "determinants": return <DeterminantsLab page={page} />;
    case "vector-spaces": return <VectorSpacesLab page={page} />;
    case "eigenvectors": return <EigenLab page={page} extra={extra} />;
    case "orthogonality": return <OrthoLab page={page} />;
    case "least-squares": return <LeastSquaresLab page={page} />;
    case "playground": return <PlaygroundLab page={page} extra={extra} />;
    case "arithmetic": return <ComplexArithmeticLab page={page} />;
    case "polar-forms": return <PolarLab page={page} />;
    case "rotation": return <RotationLab page={page} extra={extra} />;
    case "roots": return <RootsLab page={page} />;
    case "euler": return <EulerLab page={page} extra={extra} />;
    case "loci": return <LociLab page={page} />;
    case "fractals": return <FractalsLab page={page} />;
    case "waves-circuits": return <CircuitsLab page={page} />;
    case "motion": return <MotionLab page={page} />;
    case "population": return <PopulationLab page={page} />;
    case "finance": return <FinanceLab page={page} />;
    case "optimization": return <OptimizationLab page={page} />;
    case "networks": return <NetworksLab page={page} />;
    case "regression": return <RegressionLab page={page} />;
    case "periodic": return <PeriodicLab page={page} />;
    case "numerical": return <NumericalLab page={page} />;
    case "comparison": return <ComparisonLab page={page} />;
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
        {kind === "trig" ? (
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
            ) : mode === "Wave Projection" ? (
              <polyline points={Array.from({ length: 40 }, (_, i) => `${20 + i * 13},${200 - Math.sin(i / 4 + session.theta * Math.PI / 180) * 28}`).join(" ")} fill="none" stroke="#fbbf24" strokeWidth="2.4" />
            ) : mode === "Distance" ? (
              <line x1="90" y1="250" x2="440" y2="250" stroke="#22d3ee" strokeWidth="4" />
            ) : mode === "Angle" ? (
              <path d="M90 250 L440 250 L440 120" fill="none" stroke="#f59e0b" strokeWidth="2" />
            ) : (
              <>
                <line x1="90" y1="250" x2="440" y2="250" stroke="#22d3ee" strokeDasharray="4 3" />
                <line x1="440" y1="250" x2="440" y2={250 - height * 4.2} stroke="#8b45f4" strokeDasharray="4 3" />
                <line x1="90" y1="250" x2="440" y2={250 - height * 4.2} stroke="#f59e0b" />
              </>
            )}
            <text x="240" y="244" fill="#0f172a" fontSize="12">{fmt(dist, 2)} m</text>
            <text x="150" y="220" fill="#f59e0b" fontSize="12">{fmt(elev, 1)}°</text>
          </svg>
        ) : (
          <svg className="msk-graph" viewBox="0 0 560 360" role="img" aria-label="Room AR overlay">
            <rect width="560" height="360" fill="#e8eef4" />
            <rect x="0" y="210" width="560" height="150" fill="#d6cfc4" />
            <line x1="40" y1="210" x2="520" y2="210" stroke="#94a3b8" />
            <polygon points="80,200 260,40 440,200" fill="none" stroke="#22d3ee" />
            <circle cx="80" cy="200" r="5" fill="#f59e0b" /><circle cx="260" cy="40" r="5" fill="#08b9dd" /><circle cx="440" cy="200" r="5" fill="#f59e0b" />
            <text x="70" y="216" fontSize="11">B</text><text x="266" y="36" fontSize="11">A</text><text x="444" y="216" fontSize="11">C</text>
            <text x="240" y="28" fill="#8b45f4" fontSize="11">{fmt(elev, 1)}°</text>
            <text x="240" y="130" fill="#147df2" fontSize="11">{fmt(dist * scale, 2)} m</text>
            <circle cx="400" cy="90" r="36" fill="none" stroke="#8b45f4" />
            <polygon points="160,300 220,220 280,300" fill="rgba(139,69,244,.35)" stroke="#8b45f4" />
            <polygon points="320,300 360,230 400,300" fill="rgba(139,69,244,.35)" stroke="#8b45f4" />
            <text x="188" y="318" fontSize="11">Pyramid</text>
          </svg>
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

function InverseTrigLab({ page }: { page: StudioMockupPage }) {
  const [x, setX] = useState(0.6);
  const [theta, setTheta] = useState(150);
  return (
    <Chrome page={page}>
      {(mode) => {
        const val = mode === "Arccos" ? Math.acos(clamp(x, -1, 1)) : mode === "Arctan" ? Math.atan(x) : Math.asin(clamp(x, -1, 1));
        const composed = Math.sin(Math.asin(clamp(x, -1, 1)));
        const trap = Math.asin(Math.sin(theta * Math.PI / 180));
        const range = mode === "Arccos" ? "[0, π]" : mode === "Arctan" ? "(−π/2, π/2)" : "[−π/2, π/2]";
        return (
          <>
            <Panel title={mode}>
              {mode === "Compositions" ? (
                <SliderRow label="Input θ for arcsin(sin θ)" value={theta} min={-360} max={360} step={1} onChange={setTheta} unit="°" />
              ) : (
                <SliderRow label="Input x" value={x} min={mode === "Arctan" ? -4 : -1} max={mode === "Arctan" ? 4 : 1} step={0.01} onChange={setX} />
              )}
              <p className="msk-formula">{mode === "Compositions" ? `arcsin(sin ${fmt(theta, 0)}°) ≠ θ in general` : `${mode}(${fmt(x, 2)})`}</p>
            </Panel>
            <section className="msk-panel msk-canvas" data-inv-mode={mode}>
                <svg
                  className="msk-graph is-interactive"
                  viewBox="0 0 420 260"
                  role="img"
                  aria-label="Inverse graph"
                  data-mode-canvas={mode}
                  onPointerMove={(event: PointerEvent<SVGSVGElement>) => {
                    if (event.buttons === 0) return;
                    const box = event.currentTarget.getBoundingClientRect();
                    const worldX = clamp(((event.clientX - box.left) / box.width) * 2 - 1, -1, 1);
                    setX(mode === "Arctan" ? clamp(((event.clientX - box.left) / box.width) * 8 - 4, -4, 4) : worldX);
                  }}
                >
                <rect width="420" height="260" fill="#f8fbff" />
                    <rect x="30" y="40" width="360" height="180" fill="#f3e8ff" opacity=".35" />
                    <text x="36" y="252" fontSize="11" fill="#8b45f4">Drag on the shaded principal band to pin x</text>
                <line x1="30" y1="130" x2="390" y2="130" stroke="#94a3b8" />
                <line x1="210" y1="20" x2="210" y2="240" stroke="#94a3b8" />
                {mode === "Compositions" ? (
                  <>
                    <line x1="70" y1="190" x2="350" y2="70" stroke="#94a3b8" strokeDasharray="4 3" />
                    <polyline
                      points={Array.from({ length: 80 }, (_, i) => {
                        const deg = -360 + i * 9;
                        const y = Math.asin(Math.sin(deg * Math.PI / 180));
                        return `${70 + i * 3.4},${130 - y * 50}`;
                      }).join(" ")}
                      fill="none"
                      stroke="#0f766e"
                      strokeWidth="2.4"
                    />
                    <circle cx={210 + (theta / 360) * 140} cy={130 - trap * 50} r="6" fill="#f59e0b" />
                    <text x="36" y="36" fontSize="11" fill="#8b45f4">green = arcsin(sin θ) · dashed = identity y = θ</text>
                  </>
                ) : (
                  <>
                    <path d="M50 210 C 140 210, 170 50, 370 50" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="4 3" />
                    <path d="M50 50 C 140 50, 170 210, 370 210" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeDasharray="4 3" />
                    <path d="M50 210 C 140 210, 170 50, 370 50" fill="none" stroke="#8b45f4" strokeWidth="2.2" />
                    <circle cx={210 + clamp(x, -1, 1) * 140} cy={130 - val * 50} r="6" fill="#f59e0b" />
                    <text x="36" y="36" fontSize="11" fill="#8b45f4">principal {range} · dashed ghosts are other branches</text>
                  </>
                )}
              </svg>
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color="#8b45f4" label="principal value" value={mode === "Compositions" ? fmt(trap, 4) : fmt(val, 4)} />
              <LiveRow color="#f59e0b" label="degrees" value={`${fmt((mode === "Compositions" ? trap : val) * 180 / Math.PI, 2)}°`} />
              <LiveRow color="#10b981" label={mode === "Compositions" ? "arcsin(sin θ)" : "sin(arcsin x)"} value={mode === "Compositions" ? fmt(trap, 4) : fmt(composed, 4)} />
              {mode === "Compositions" ? <p className="msk-note">sin(arcsin x) returns x on [−1,1]. arcsin(sin θ) folds θ into {range}.</p> : <p className="msk-note">Principal range lock: {range}</p>}
              <ChallengeBox page={page} mode={mode} />
            </aside>
          </>
        );
      }}
    </Chrome>
  );
}

function ApplicationsLab({ page }: { page: StudioMockupPage }) {
  const [dist, setDist] = useState(80);
  const [elev, setElev] = useState(36.5);
  const [eye, setEye] = useState(1.7);
  const [bearing, setBearing] = useState(42);
  const h = dist * Math.tan(elev * Math.PI / 180) + eye;
  const tide = 1.4 + Math.sin((elev + bearing) * Math.PI / 180);
  const br = (bearing - 90) * Math.PI / 180;
  const tidePts = Array.from({ length: 80 }, (_, i) => `${20 + i * 6},${140 - (1.4 + Math.sin(i / 8 + elev * Math.PI / 180)) * 28}`).join(" ");
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
      <Panel title={mode}>
        <SliderRow label={mode === "Bearings" || mode === "Navigation" ? "Bearing" : "Observer distance"} value={mode === "Bearings" || mode === "Navigation" ? bearing : dist} min={mode === "Bearings" || mode === "Navigation" ? 0 : 10} max={mode === "Bearings" || mode === "Navigation" ? 360 : 200} step={1} onChange={mode === "Bearings" || mode === "Navigation" ? setBearing : setDist} unit={mode === "Bearings" || mode === "Navigation" ? "°" : "m"} />
        {mode === "Heights & Distances" ? <SliderRow label="Eye height" value={eye} min={0.5} max={3} step={0.1} onChange={setEye} unit="m" /> : null}
        {mode !== "Bearings" && mode !== "Navigation" ? <SliderRow label={mode === "Periodic Models" ? "Phase" : "Angle of elevation"} value={elev} min={5} max={80} step={0.5} onChange={setElev} unit="°" /> : null}
        {mode === "Navigation" ? <SliderRow label="Second bearing" value={elev} min={0} max={180} step={1} onChange={setElev} unit="°" /> : null}
      </Panel>
      <section className="msk-panel msk-canvas" data-app-mode={mode}>
        <svg className="msk-graph" viewBox="0 0 520 280" role="img" aria-label={mode} data-mode-canvas={mode}>
          {mode === "Periodic Models" ? (
            <>
              <rect width="520" height="280" fill="#061428" />
              <polyline points={tidePts} fill="none" stroke="#22d3ee" strokeWidth="2.4" />
              <line x1="20" y1="140" x2="500" y2="140" stroke="#334155" />
              <text x="28" y="32" fill="#fde68a" fontSize="13">tide = 1.4 + sin(t + φ)</text>
            </>
          ) : mode === "Bearings" ? (
            <>
              <rect width="520" height="280" fill="#e8f4ea" />
              <circle cx="260" cy="140" r="90" fill="none" stroke="#147df2" />
              <text x="248" y="48" fontSize="12">N</text>
              <line x1="260" y1="140" x2={260 + 90 * Math.cos(br)} y2={140 + 90 * Math.sin(br)} stroke="#f59e0b" strokeWidth="3" />
              <text x="300" y="24" fill="#8b45f4" fontSize="14">{fmt(bearing, 0)}° from north</text>
            </>
          ) : mode === "Navigation" ? (
            <>
              <rect width="520" height="280" fill="#e8f4ea" />
              <circle cx="80" cy="220" r="5" fill="#0f172a" />
              <circle cx="440" cy="220" r="5" fill="#0f172a" />
              <line x1="80" y1="220" x2={80 + 220 * Math.cos((bearing - 90) * Math.PI / 180)} y2={220 + 220 * Math.sin((bearing - 90) * Math.PI / 180)} stroke="#147df2" />
              <line x1="440" y1="220" x2={440 + 220 * Math.cos((elev - 90) * Math.PI / 180)} y2={220 + 220 * Math.sin((elev - 90) * Math.PI / 180)} stroke="#8b45f4" />
              <text x="36" y="28" fontSize="13">Two bearings fix the ship</text>
            </>
          ) : mode === "Surveying" ? (
            <>
              <rect width="520" height="280" fill="#e8f4ea" />
              <line x1="80" y1="240" x2="360" y2="240" stroke="#147df2" strokeWidth="3" />
              <polygon points="80,240 360,240 220,80" fill="rgba(20,125,242,.12)" stroke="#f59e0b" />
              <text x="200" y="258" fontSize="12">baseline {fmt(dist, 0)} m</text>
              <text x="36" y="28" fontSize="13">Two angles from a measured base</text>
            </>
          ) : (
            <>
              <rect width="520" height="280" fill="#e8f4ea" />
              <rect x="360" y={240 - h * 1.6} width="50" height={h * 1.6} fill="#64748b" />
              <line x1="80" y1="240" x2="360" y2="240" stroke="#147df2" />
              <line x1="80" y1="230" x2="360" y2={240 - (h - eye) * 1.6} stroke="#f59e0b" strokeDasharray="5 4" />
              <circle cx="80" cy="230" r="6" fill="#0f172a" />
              <text x="200" y="232" fontSize="12">{fmt(dist, 1)} m</text>
              <text x="380" y={230 - (h - eye) * 0.8} fontSize="12" fill="#f59e0b">{fmt(h, 2)} m</text>
            </>
          )}
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        {mode === "Periodic Models" ? <LiveRow color="#147df2" label="Tide height" value={fmt(tide, 2)} /> : null}
        {mode === "Bearings" || mode === "Navigation" ? <LiveRow color="#8b45f4" label="Bearing" value={`${fmt(bearing, 0)}°`} /> : null}
        {mode === "Heights & Distances" || mode === "Surveying" ? <LiveRow color="#f59e0b" label="tan θ" value={fmt(Math.tan(elev * Math.PI / 180), 4)} /> : null}
        {mode === "Heights & Distances" ? <LiveRow color="#10b981" label="Total height H" value={`${fmt(h, 2)} m`} /> : null}
        <StepList items={mode === "Surveying" ? ["Set a baseline.", "Read both elevation angles.", "Solve the triangle."] : mode === "Periodic Models" ? ["A sine models the tide.", "Phase shifts the peaks.", "Midline is the offset D."] : mode === "Bearings" || mode === "Navigation" ? ["Bearings are clockwise from north.", "A heading plus a distance locates a point.", "Two bearings fix a position."] : [`Distance d = ${fmt(dist)} m`, `θ = ${fmt(elev, 1)}°`, `H = d tan θ + eye`]} />
        <ChallengeBox page={page} mode={mode} />
      </aside>
        </>
      )}
    </Chrome>
  );
}

function apply2(M: number[][], x: number, y: number) {
  return [(M[0]?.[0] ?? 0) * x + (M[0]?.[1] ?? 0) * y, (M[1]?.[0] ?? 0) * x + (M[1]?.[1] ?? 0) * y];
}

function poly(M: number[][], ox: number, oy: number, u: number) {
  const pts = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => apply2(M, x, y));
  return pts.map(([x, y]) => `${ox + x * u},${oy - y * u}`).join(" ");
}

function MatricesLab({ page }: { page: StudioMockupPage }) {
  const [view, setView] = useState("2D");
  const [A, setA] = useState([[1, 2, -1], [0, 3, 4]]);
  const [B, setB] = useState([[2, 1], [0, -1], [3, 2]]);
  const setCell = (which: "A" | "B", r: number, c: number, value: number) => {
    const next = (which === "A" ? A : B).map((row, i) => row.map((cell, j) => (i === r && j === c ? value : cell)));
    if (which === "A") setA(next);
    else setB(next);
  };
  const c11 = A[0]![0]! * B[0]![0]! + A[0]![1]! * B[1]![0]! + A[0]![2]! * B[2]![0]!;
  const c12 = A[0]![0]! * B[0]![1]! + A[0]![1]! * B[1]![1]! + A[0]![2]! * B[2]![1]!;
  const c21 = A[1]![0]! * B[0]![0]! + A[1]![1]! * B[1]![0]! + A[1]![2]! * B[2]![0]!;
  const c22 = A[1]![0]! * B[0]![1]! + A[1]![1]! * B[1]![1]! + A[1]![2]! * B[2]![1]!;
  const detC = c11 * c22 - c12 * c21;
  const A2 = [[A[0]![0]!, A[0]![1]!], [A[1]![0]!, A[1]![1]!]];
  const B2 = [[B[0]![0]!, B[0]![1]!], [B[1]![0]!, B[1]![1]!]];
  const C2 = [[c11, c12], [c21, c22]];
  const detA = A2[0]![0]! * A2[1]![1]! - A2[0]![1]! * A2[1]![0]!;
  const invA = Math.abs(detA) < 1e-8 ? null : [[A2[1]![1]! / detA, -A2[0]![1]! / detA], [-A2[1]![0]! / detA, A2[0]![0]! / detA]];
  const AT = [[A2[0]![0]!, A2[1]![0]!], [A2[0]![1]!, A2[1]![1]!]];
  const ops = [["Add", "+ Add"], ["Multiply", "× Multiply"], ["Inverse", "x⁻¹ Inverse"], ["Transpose", "T Transpose"], ["Block", "Block"]] as const;
  return (
    <Chrome
      page={page}
      toolbar={(
        <div className="msk-opbar" aria-label="Matrix operations">
          {ops.map(([id, label]) => (
            <a key={id} href={`?mode=${encodeURIComponent(id)}`} className="msk-opbar-link">{label}</a>
          ))}
          <span className="msk-opbar-view">
            <button type="button" className={view === "2D" ? "active" : ""} onClick={() => setView("2D")}>2D</button>
            <button type="button" className={view === "3D" ? "active" : ""} onClick={() => setView("3D")}>3D</button>
          </span>
        </div>
      )}
    >
      {(mode) => {
        const geo = mode === "Inverse" && invA ? invA : mode === "Transpose" ? AT : mode === "Add" ? [[A2[0]![0]! + B2[0]![0]!, A2[0]![1]! + B2[0]![1]!], [A2[1]![0]! + B2[1]![0]!, A2[1]![1]! + B2[1]![1]!]] : C2;
        return (
          <>
            <Panel title={`Operation: A ${mode === "Add" ? "+" : mode === "Multiply" ? "×" : "·"} B`}>
              <p className="msk-note">Matrix A (2 × 3)</p>
              <table className="msk-sheet">
                <thead><tr><th></th><th>c1</th><th>c2</th><th>c3</th></tr></thead>
                <tbody>
                  {A.map((row, r) => (
                    <tr key={r}>
                      <th>r{r + 1}</th>
                      {row.map((cell, c) => (
                        <td key={c}><input aria-label={`A${r + 1}${c + 1}`} type="number" value={cell} onChange={(e) => setCell("A", r, c, Number(e.target.value))} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="msk-note">Matrix B (3 × 2)</p>
              <table className="msk-sheet">
                <thead><tr><th></th><th>c1</th><th>c2</th></tr></thead>
                <tbody>
                  {B.map((row, r) => (
                    <tr key={r}>
                      <th>r{r + 1}</th>
                      {row.map((cell, c) => (
                        <td key={c}><input aria-label={`B${r + 1}${c + 1}`} type="number" value={cell} onChange={(e) => setCell("B", r, c, Number(e.target.value))} /></td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <button type="button" className="msk-primary">Compute A × B</button>
              <label className="msk-toggle"><input type="checkbox" defaultChecked /> Animate computation</label>
              <p className="msk-note">Deep calculator: <a href="/matrices">/matrices</a> (not a second teacher).</p>
            </Panel>
            <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
              <p className="msk-note">{mode === "Multiply" ? "Product = composition: unit square → A then B" : mode === "Inverse" ? "AA⁻¹ → I animation (2×2 block of A)" : mode === "Transpose" ? "Geometric transpose: columns become rows" : mode === "Block" ? "Block multiply on 2×2 tiles" : `A + B · ${view}`}</p>
              <svg className="msk-graph" viewBox="0 0 420 280" role="img" aria-label={`${mode} geometry`}>
                <rect width="420" height="280" fill={view === "3D" ? "#0b1220" : "#f8fbff"} />
                <line x1="20" y1="200" x2="400" y2="200" stroke="#94a3b8" /><line x1="80" y1="16" x2="80" y2="264" stroke="#94a3b8" />
                <polygon points="80,200 150,200 150,150 80,150" fill="none" stroke="#94a3b8" strokeDasharray="4 3" />
                {mode === "Multiply" ? (
                  <>
                    <polygon points={poly(A2, 80, 200, 50)} fill="rgba(8,185,221,.2)" stroke="#08b9dd" />
                    <polygon points={poly(C2, 80, 200, 50)} fill="rgba(139,69,244,.22)" stroke="#8b45f4" />
                    <text x="24" y="28" fill="#334155" fontSize="12">After A, then A×B</text>
                  </>
                ) : mode === "Inverse" ? (
                  <>
                    <polygon points={poly(A2, 80, 200, 40)} fill="rgba(8,185,221,.2)" stroke="#08b9dd" />
                    <polygon points={invA ? poly([[1, 0], [0, 1]], 250, 200, 40) : "250,200"} fill="rgba(16,185,129,.25)" stroke="#10b981" />
                    <text x="24" y="28" fill="#334155" fontSize="12">{invA ? "A then A⁻¹ collapses to the unit square I" : "Singular — no inverse"}</text>
                  </>
                ) : mode === "Transpose" ? (
                  <polygon points={poly(AT, 80, 200, 50)} fill="rgba(245,158,11,.2)" stroke="#f59e0b" />
                ) : mode === "Block" ? (
                  <>
                    <rect x="40" y="40" width="140" height="90" fill="rgba(20,125,242,.15)" stroke="#147df2" />
                    <rect x="200" y="40" width="140" height="90" fill="rgba(139,69,244,.2)" stroke="#8b45f4" />
                    <text x="70" y="90" fontSize="12">A₁₁ × B₁₁</text>
                  </>
                ) : (
                  <polygon points={poly(geo, 80, 200, 50)} fill="rgba(20,125,242,.2)" stroke="#147df2" />
                )}
              </svg>
              <p className="msk-formula">det(A) · det(B) = det(A × B) · det(C) = {fmt(detC)}</p>
            </section>
            <aside className="msk-panel msk-live">
              <h2>Dimensions &amp; compatibility</h2>
              <p className="msk-note">A: 2 × 3 · B: 3 × 2 → A × B: 2 × 2 · Compatible</p>
              <h2>Result C = A × B</h2>
              <table className="msk-sheet">
                <thead><tr><th></th><th>c1</th><th>c2</th></tr></thead>
                <tbody>
                  <tr><th>r1</th><td><output>{fmt(c11)}</output></td><td><output>{fmt(c12)}</output></td></tr>
                  <tr><th>r2</th><td><output>{fmt(c21)}</output></td><td><output>{fmt(c22)}</output></td></tr>
                </tbody>
              </table>
              <h2>Computation (dot-product view)</h2>
              <p className="msk-formula">c₁ = A × b₁ = {A[0]![0]}·{B[0]![0]} + {A[0]![1]}·{B[1]![0]} + {A[0]![2]}·{B[2]![0]} = {fmt(c11)}</p>
              <p className="msk-formula">c₂ = A × b₂ = {fmt(c12)}</p>
              <p className="msk-note">Matrix multiplication sends the columns of B through the linear transformation defined by A. Each entry cᵢⱼ is the dot product of row i of A with column j of B.</p>
              <StatusOk>{mode === "Inverse" ? (invA ? "AA⁻¹ = I on the 2×2 block." : "No inverse.") : "Result verified"}</StatusOk>
              <ChallengeBox {...page.challenge} />
            </aside>
          </>
        );
      }}
    </Chrome>
  );
}

function RowReductionLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(1);
  const [rhs1, setRhs1] = useState(5);
  const [c, setC] = useState(1);
  const [d, setD] = useState(3);
  const [rhs2, setRhs2] = useState(7);
  const [step, setStep] = useState(0);
  const [free, setFree] = useState(0);
  const det = a * d - b * c;
  const r21 = a === 0 ? 0 : c / a;
  const row2 = [0, d - r21 * b, rhs2 - r21 * rhs1];
  const pivot2 = row2[1] === 0 ? 1 : row2[1];
  const rref = [
    [1, 0, det === 0 ? "—" : fmt((d * rhs1 - b * rhs2) / det, 2)],
    [0, 1, det === 0 ? "—" : fmt((a * rhs2 - c * rhs1) / det, 2)],
  ];
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Augmented system">
            <SliderRow label="a₁₁" value={a} min={-4} max={4} step={0.1} onChange={setA} />
            <SliderRow label="a₁₂" value={b} min={-4} max={4} step={0.1} onChange={setB} />
            <SliderRow label="b₁" value={rhs1} min={-8} max={8} step={0.1} onChange={setRhs1} />
            <SliderRow label="a₂₁" value={c} min={-4} max={4} step={0.1} onChange={setC} />
            <SliderRow label="a₂₂" value={d} min={-4} max={4} step={0.1} onChange={setD} />
            <SliderRow label="b₂" value={rhs2} min={-8} max={8} step={0.1} onChange={setRhs2} />
            {Math.abs(det) < 1e-6 ? <SliderRow label="Free variable t" value={free} min={-3} max={3} step={0.1} onChange={setFree} /> : null}
            <p className="msk-note">Click a row-op. The figure follows the current tableau.</p>
            <button type="button" className={step === 0 ? "msk-soft active" : "msk-soft"} onClick={() => setStep(0)}>Start</button>
            <button type="button" className={step === 1 ? "msk-soft active" : "msk-soft"} onClick={() => setStep(1)}>R2 − {fmt(r21, 2)} R1</button>
            <button type="button" className={step === 2 ? "msk-soft active" : "msk-soft"} onClick={() => setStep(2)}>RREF</button>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <h2>{mode === "Pivot Map" ? "Pivot map" : mode === "3D View" ? "Planes in R³" : "Lines in R²"}</h2>
            <table className="msk-rref">
              <thead><tr><th>R1</th><th>x</th><th>y</th><th>|</th><th>b</th></tr></thead>
              <tbody>
                <tr><td>start</td><td className="is-pivot">{fmt(a)}</td><td>{fmt(b)}</td><td>|</td><td>{fmt(rhs1)}</td></tr>
                <tr><td>start</td><td>{fmt(c)}</td><td>{fmt(d)}</td><td>|</td><td>{fmt(rhs2)}</td></tr>
                {step >= 1 ? <tr><td>R2 − {fmt(r21, 2)} R1</td><td>0</td><td className="is-pivot">{fmt(row2[1]!)}</td><td>|</td><td>{fmt(row2[2]!)}</td></tr> : null}
                {step >= 2 ? <tr><td>RREF</td><td className="is-pivot">{rref[0]![0]}</td><td>{rref[0]![1]}</td><td>|</td><td>{rref[0]![2]}</td></tr> : null}
                {step >= 2 ? <tr><td>RREF</td><td>{rref[1]![0]}</td><td className="is-pivot">{rref[1]![1]}</td><td>|</td><td>{rref[1]![2]}</td></tr> : null}
              </tbody>
            </table>
            <svg className="msk-graph" viewBox="0 0 420 180" role="img" aria-label={mode}>
              <rect width="420" height="180" fill={mode === "3D View" ? "#0b1220" : "#f8fbff"} />
              {mode === "3D View" ? (
                <>
                  <polygon points="40,150 200,40 380,80 220,170" fill="rgba(20,125,242,.2)" stroke="#38bdf8" />
                  <polygon points="60,40 360,50 340,160 90,160" fill="rgba(139,69,244,.18)" stroke="#c084fc" />
                </>
              ) : mode === "Pivot Map" ? (
                <>
                  <rect x="40" y="40" width="80" height="50" fill="#fde68a" stroke="#f59e0b" />
                  <rect x="140" y="100" width="80" height="50" fill={Math.abs(row2[1]!) < 1e-6 ? "#fecaca" : "#bbf7d0"} stroke="#10b981" />
                  <text x="48" y="70" fontSize="12">pivot 1</text>
                  <text x="148" y="130" fontSize="12">{Math.abs(det) < 1e-6 ? "free" : "pivot 2"}</text>
                </>
              ) : (
                <>
                  <line x1="20" y1={90 - a * 6} x2="400" y2={90 + b * 6} stroke="#147df2" />
                  <line x1="20" y1={90 - c * 6} x2="400" y2={90 + d * 6} stroke="#8b45f4" />
                  {Math.abs(det) < 1e-6 ? <circle cx={210 + free * 30} cy="90" r="5" fill="#f59e0b" /> : null}
                </>
              )}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label="Pivots" value={Math.abs(det) < 1e-6 ? "1" : "2"} />
            <LiveRow color="#8b45f4" label="Rank" value={Math.abs(det) < 1e-6 ? "1 or 0" : "2"} />
            <LiveRow color="#08b9dd" label="det" value={fmt(det)} />
            <LiveRow color="#f59e0b" label="R2 scale" value={fmt(pivot2)} />
            <p className="msk-note">Each highlighted cell is a pivot. Rank is the number of pivots.</p>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function LinearTransformsLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [k, setK] = useState(1.4);
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <SliderRow label="Scale / shear" value={k} min={0.2} max={2.5} step={0.05} onChange={setK} />
            <p className="msk-note">Columns of A are the images of e₁ and e₂. Same matrix on both canvases when an extra is mounted.</p>
          </Panel>
          <section className="msk-panel msk-canvas">
            <ExtraFrame mode={mode} extra={extra} fallback={<TransformUnitSquare mode={mode} k={k} />} />
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label="Image of e1" value={mode === "R90" ? "(0, 1)" : `(${fmt(k)}, 0)`} />
            <LiveRow color="#8b45f4" label="Image of e2" value={mode === "R90" ? "(−1, 0)" : mode === "Shear" ? `(${fmt(k - 1)}, 1)` : "(0, 1)"} />
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function DeterminantsLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(0.6);
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <SliderRow label="Width" value={a} min={0.2} max={4} step={0.1} onChange={setA} />
            <SliderRow label="Shear" value={b} min={-2} max={2} step={0.1} onChange={setB} />
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label={mode}>
              <rect width="420" height="240" fill={mode === "3D Volume" ? "#0b1220" : "#f8fbff"} />
              {mode === "3D Volume" ? (
                <path d={`M80 180 L${80 + a * 40} 180 L${100 + a * 40 + b * 20} 120 L${140 + a * 20} 80 L100 80 Z`} fill="rgba(245,158,11,.25)" stroke="#fbbf24" />
              ) : mode === "Cofactor" ? (
                <>
                  <rect x="40" y="40" width="80" height="80" fill="#dbeafe" stroke="#147df2" />
                  <rect x="140" y="40" width="80" height="80" fill="#fef3c7" stroke="#f59e0b" />
                  <text x="50" y="85" fontSize="12">a₁₁ highlighted</text>
                </>
              ) : mode === "Orientation" ? (
                <polygon points={`80,180 ${80 + a * 50},180 ${80 + a * 50 + b * 40},100 ${80 + b * 40},100`} fill={a >= 0 ? "rgba(16,185,129,.25)" : "rgba(239,68,68,.3)"} stroke={a >= 0 ? "#10b981" : "#ef4444"} />
              ) : mode === "Singularity" ? (
                <polygon points={`80,180 ${80 + a * 50},180 ${80 + a * 50 + b * 40},${180 - a * 2} ${80 + b * 40},${180 - a * 2}`} fill="rgba(239,68,68,.2)" stroke="#ef4444" />
              ) : (
                <polygon points={`80,180 ${80 + a * 50},180 ${80 + a * 50 + b * 40},100 ${80 + b * 40},100`} fill="rgba(245,158,11,.2)" stroke="#f59e0b" />
              )}
              <text x="24" y="28" fill={mode === "3D Volume" ? "#e2e8f0" : "#334155"} fontSize="13">{mode === "Singularity" ? "Shear toward det → 0" : mode === "Orientation" ? (a >= 0 ? "color: preserved" : "flip") : mode}</text>
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#f59e0b" label={mode === "3D Volume" ? "signed volume" : "det (signed area)"} value={fmt(a)} />
            <StatusOk>{Math.abs(a) < 0.15 ? "Singular · collapse" : a < 0 ? "Orientation reversed" : "Orientation preserved"}</StatusOk>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function EigenLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [t, setT] = useState(40);
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Probe vector">
            <SliderRow label="Angle" value={t} min={0} max={180} step={1} onChange={setT} unit="°" />
            <p className="msk-note">{mode === "Phase Portrait" ? "Trajectories are the default view." : "Glow on the eigenline when Av ∥ v."}</p>
          </Panel>
          <section className="msk-panel msk-canvas">
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <svg
                  className="msk-graph is-interactive"
                  viewBox="0 0 420 240"
                  role="img"
                  aria-label="Eigenline"
                  onPointerMove={(event: PointerEvent<SVGSVGElement>) => {
                    if (event.buttons === 0) return;
                    const box = event.currentTarget.getBoundingClientRect();
                    const x = event.clientX - box.left - box.width / 2;
                    const y = box.height / 2 - (event.clientY - box.top);
                    setT(((Math.atan2(y, x) * 180 / Math.PI) + 360) % 180);
                  }}
                >
                  <rect width="420" height="240" fill={mode === "3D View" ? "#0b1220" : "#f8fbff"} />
                  {mode === "Phase Portrait" ? <path d="M40 200 C 80 40, 200 200, 380 60" fill="none" stroke="#8b45f4" /> : <ellipse cx="210" cy="120" rx="90" ry="40" fill="none" stroke="#94a3b8" />}
                  <line x1="80" y1="180" x2="340" y2="60" stroke="#8b45f4" strokeWidth="3" />
                  <line x1="210" y1="120" x2={210 + 80 * Math.cos(t * Math.PI / 180)} y2={120 - 50 * Math.sin(t * Math.PI / 180)} stroke="#147df2" strokeWidth="2" />
                </svg>
              )}
            />
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#8b45f4" label="Aligned when" value="Av ∥ v" />
            <p className="msk-note">Defective or complex eigenvalues: stretch-rotate — continue in Complex.</p>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function OrthoLab({ page }: { page: StudioMockupPage }) {
  const [ux, setUx] = useState(3);
  const [uy, setUy] = useState(1);
  const [vx, setVx] = useState(2);
  const [vy, setVy] = useState(0.4);
  const gs = gramSchmidt(vx, vy, ux, uy);
  const proj = (ux * vx + uy * vy) / ((vx * vx + vy * vy) || 1);
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Gram–Schmidt you drag">
            <SliderRow label="ux" value={ux} min={-4} max={4} step={0.1} onChange={setUx} />
            <SliderRow label="uy" value={uy} min={-4} max={4} step={0.1} onChange={setUy} />
            <SliderRow label="vx" value={vx} min={-4} max={4} step={0.1} onChange={setVx} />
            <SliderRow label="vy" value={vy} min={-4} max={4} step={0.1} onChange={setVy} />
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label={mode}>
              <rect width="420" height="240" fill={mode === "3D View" ? "#0b1220" : "#f8fbff"} />
              <line x1="60" y1="180" x2={60 + vx * 40} y2={180 - vy * 40} stroke="#147df2" strokeWidth="3" />
              <line x1="60" y1="180" x2={60 + ux * 30} y2={180 - uy * 30} stroke="#8b45f4" />
              <line x1="60" y1="180" x2={60 + gs.u1[0] * 80} y2={180 - gs.u1[1] * 80} stroke="#10b981" />
              <line x1="60" y1="180" x2={60 + gs.residual[0] * 30} y2={180 - gs.residual[1] * 30} stroke="#f59e0b" strokeDasharray="4 3" />
              {mode === "2D Projections" ? <line x1="60" y1="180" x2={60 + proj * vx * 40} y2={180 - proj * vy * 40} stroke="#f59e0b" strokeWidth="6" opacity="0.35" /> : null}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#f59e0b" label="residual ⊥ v" value={fmt(gs.residual[0] * gs.u1[0] + gs.residual[1] * gs.u1[1], 3)} />
            <LiveRow color="#10b981" label="u1 · u2" value={fmt(gs.u1[0] * gs.u2[0] + gs.u1[1] * gs.u2[1], 3)} />
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function LeastSquaresLab({ page }: { page: StudioMockupPage }) {
  const [pts, setPts] = useState([[1, 1.1], [2, 2.4], [3, 3.2], [4, 5.1]]);
  const [drag, setDrag] = useState<number | null>(null);
  const n = pts.length;
  const sx = pts.reduce((s, [x]) => s + x, 0);
  const sy = pts.reduce((s, [, y]) => s + y, 0);
  const sxx = pts.reduce((s, [x]) => s + x * x, 0);
  const sxy = pts.reduce((s, [x, y]) => s + x * y, 0);
  const m = (n * sxy - sx * sy) / (n * sxx - sx * sx || 1);
  const intercept = (sy - m * sx) / n;
  const mean = sy / n;
  const sse = pts.reduce((s, [x, y]) => s + (y - (m * x + intercept)) ** 2, 0);
  const sst = pts.reduce((s, [, y]) => s + (y - mean) ** 2, 0) || 1;
  const rmse = Math.sqrt(sse / n);
  const r2 = 1 - sse / sst;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (drag === null) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width * 5.5, 0.4, 5);
    const y = clamp(8.5 - (event.clientY - rect.top) / rect.height * 8.5, 0.2, 8);
    setPts((prev) => prev.map((p, i) => (i === drag ? [x, y] : p)));
  };
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <p className="msk-note">Drag points. Residual is orthogonal to the columns. Outlier: pull one point far.</p>
            <button type="button" className="msk-soft" onClick={() => setPts((p) => [...p.slice(0, 3), [4.6, 7.8]])}>Add outlier</button>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg className="msk-graph is-interactive" viewBox="0 0 420 240" role="img" aria-label="Least squares" onPointerMove={move} onPointerUp={() => setDrag(null)} onPointerLeave={() => setDrag(null)}>
              <rect width="420" height="240" fill="#f8fbff" />
              <line x1="40" y1={200 - intercept * 22} x2="400" y2={200 - (m * 5 + intercept) * 22} stroke="#8b45f4" />
              {pts.map(([x, y], i) => (
                <g key={i}>
                  {mode !== "Fit" ? <line x1={40 + x * 70} y1={200 - y * 22} x2={40 + x * 70} y2={200 - (m * x + intercept) * 22} stroke="#f59e0b" /> : null}
                  <circle cx={40 + x * 70} cy={200 - y * 22} r="7" fill="#147df2" onPointerDown={() => setDrag(i)} />
                </g>
              ))}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#8b45f4" label="RMSE" value={fmt(rmse, 3)} />
            <LiveRow color="#10b981" label="R²" value={fmt(r2, 3)} />
            <LiveRow color="#f59e0b" label="slope" value={fmt(m, 3)} />
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function PlaygroundLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [stack, setStack] = useState(["I", "R90"]);
  const presets = ["I", "R90", "Scale", "Shear"];
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Compose">
            <p className="msk-note">One composition stack shared with Transforms. Reorder = product order.</p>
            {presets.map((item) => (
              <button key={item} type="button" className="msk-soft" onClick={() => setStack((s) => [...s, item])}>+ {item}</button>
            ))}
            <button type="button" className="msk-soft" onClick={() => setStack((s) => [...s].reverse())}>Reorder</button>
            <p className="msk-note">Stack: {stack.join(" ∘ ")}</p>
          </Panel>
          <section className="msk-panel msk-canvas">
            <ExtraFrame mode={mode} extra={extra} fallback={<TransformUnitSquare mode={mode} />} />
          </section>
          <aside className="msk-panel msk-live"><LiveRow color="#08b9dd" label="det I" value="1" /><ChallengeBox {...page.challenge} /></aside>
        </>
      )}
    </Chrome>
  );
}

function ComplexArithmeticLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(2.5);
  const [b, setB] = useState(1.5);
  const [c, setC] = useState(-1);
  const [d, setD] = useState(2);
  const [op, setOp] = useState("Add");
  const sum = [a + c, b + d];
  const prod = [a * c - b * d, a * d + b * c];
  const res = op === "Multiply" ? prod : op === "Subtract" ? [a - c, b - d] : sum;
  return (
    <Chrome page={page}>
      <Panel title="Vectors (drag points)">
        <Field label="Operation"><Segmented value={op} onChange={setOp} options={["Add", "Subtract", "Multiply"].map((id) => ({ id, label: id }))} /></Field>
        <SliderRow label="Re z1" value={a} min={-4} max={4} step={0.1} onChange={setA} />
        <SliderRow label="Im z1" value={b} min={-4} max={4} step={0.1} onChange={setB} />
        <SliderRow label="Re z2" value={c} min={-4} max={4} step={0.1} onChange={setC} />
        <SliderRow label="Im z2" value={d} min={-4} max={4} step={0.1} onChange={setD} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 320" role="img" aria-label="Parallelogram">
          <rect width="420" height="320" fill="#f8fbff" />
          <line x1="30" y1="160" x2="390" y2="160" stroke="#94a3b8" /><line x1="210" y1="20" x2="210" y2="300" stroke="#94a3b8" />
          <line x1="210" y1="160" x2={210 + a * 28} y2={160 - b * 28} stroke="#147df2" strokeWidth="2" />
          <line x1="210" y1="160" x2={210 + c * 28} y2={160 - d * 28} stroke="#8b45f4" strokeWidth="2" />
          <line x1="210" y1="160" x2={210 + res[0] * 28} y2={160 - res[1] * 28} stroke="#f59e0b" strokeWidth="2" />
          <polygon points={`210,160 ${210 + a * 28},${160 - b * 28} ${210 + res[0] * 28},${160 - res[1] * 28} ${210 + c * 28},${160 - d * 28}`} fill="rgba(245,158,11,.08)" stroke="#f59e0b" strokeDasharray="4 3" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#f59e0b" label="result" value={`${fmt(res[0], 2)} + ${fmt(res[1], 2)}i`} />
        <LiveRow color="#147df2" label="|z1|" value={fmt(Math.hypot(a, b))} />
        <p className="msk-note">Addition is the parallelogram diagonal.</p>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function PolarLab({ page }: { page: StudioMockupPage }) {
  const [re, setRe] = useState(1);
  const [im, setIm] = useState(1.732);
  const [branch, setBranch] = useState(-180);
  const r = Math.hypot(re, im);
  const raw = Math.atan2(im, re) * 180 / Math.PI;
  let th = raw;
  while (th < branch) th += 360;
  while (th >= branch + 360) th -= 360;
  const setPolar = (nr: number, nth: number) => {
    const rad = nth * Math.PI / 180;
    setRe(nr * Math.cos(rad));
    setIm(nr * Math.sin(rad));
  };
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Always in sync">
            <SliderRow label="Re" value={re} min={-4} max={4} step={0.05} onChange={setRe} />
            <SliderRow label="Im" value={im} min={-4} max={4} step={0.05} onChange={setIm} />
            <SliderRow label="r" value={r} min={0.2} max={4} step={0.05} onChange={(nr) => setPolar(nr, th)} />
            <SliderRow label="θ °" value={th} min={branch} max={branch + 359} step={1} onChange={(nth) => setPolar(r, nth)} />
            <SliderRow label="Branch cut" value={branch} min={-180} max={0} step={1} onChange={setBranch} />
            <p className="msk-note">{mode}: rectangular, polar, and exponential stay linked.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg
              className="msk-graph is-interactive"
              viewBox="0 0 360 280"
              role="img"
              aria-label={mode}
              onPointerDown={(event: PointerEvent<SVGSVGElement>) => {
                const box = event.currentTarget.getBoundingClientRect();
                const x = ((event.clientX - box.left) / box.width) * 360;
                const y = ((event.clientY - box.top) / box.height) * 280;
                setRe(clamp((x - 180) / 28, -4, 4));
                setIm(clamp((140 - y) / 28, -4, 4));
              }}
            >
              <rect width="360" height="280" fill="#f8fbff" />
              <circle cx="180" cy="140" r={r * 28} fill="none" stroke={mode === "Polar" ? "#8b45f4" : "#94a3b8"} />
              <line x1="40" y1="140" x2="320" y2="140" stroke="#94a3b8" />
              <line x1="180" y1="20" x2="180" y2="260" stroke="#94a3b8" />
              {mode === "Exponential" ? <path d={`M180,140 ${Array.from({ length: 24 }, (_, i) => `L${180 + (i / 8) * re * 28},${140 - (i / 8) * im * 28}`).join(" ")}`} fill="none" stroke="#08b9dd" /> : null}
              <line x1="180" y1="140" x2={180 + re * 28} y2={140 - im * 28} stroke="#8b45f4" strokeWidth="2" />
              <circle cx={180 + re * 28} cy={140 - im * 28} r="6" fill="#f59e0b" />
              <text x="16" y="24" fontSize="12" fill="#334155">{mode === "Rectangular" ? "drag Re, Im" : mode === "Polar" ? "r cis θ" : "r e^{iθ}"}</text>
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label="rectangular" value={`${fmt(re, 2)} + ${fmt(im, 2)}i`} />
            <LiveRow color="#8b45f4" label="polar" value={`${fmt(r, 2)} cis ${fmt(th, 0)}°`} />
            <LiveRow color="#08b9dd" label="exp" value={`${fmt(r, 2)} e^{i${fmt(th, 0)}°}`} />
            <p className="msk-formula">{"z = r (cos θ + i sin θ) = r e^{iθ}"}</p>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function RotationLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [th, setTh] = useState(90);
  const powers = Array.from({ length: 8 }, (_, i) => (i * th) % 360);
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Multiply by e^{iθ}">
            <SliderRow label="θ" value={th} min={-180} max={180} step={1} onChange={setTh} unit="°" />
            <p className="msk-note">× i = +90°. Powers of z spiral when |z| ≠ 1.</p>
          </Panel>
          <section className="msk-panel msk-canvas">
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <svg className="msk-graph" viewBox="0 0 320 240">
                  <rect width="320" height="240" fill="#f8fbff" />
                  <circle cx="160" cy="120" r="70" fill="none" stroke="#94a3b8" />
                  {powers.map((a, i) => (
                    <circle key={i} cx={160 + (50 + i * 4) * Math.cos(a * Math.PI / 180)} cy={120 - (50 + i * 4) * Math.sin(a * Math.PI / 180)} r="3" fill="#147df2" />
                  ))}
                </svg>
              )}
            />
          </section>
          <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="arg(w)" value={`${fmt(th, 0)}°`} /><ChallengeBox {...page.challenge} /></aside>
        </>
      )}
    </Chrome>
  );
}

function RootsLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(6);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return `${180 + Math.cos(a) * 80},${140 + Math.sin(a) * 80}`;
  });
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="nth roots"><SliderRow label="n" value={n} min={2} max={10} step={1} onChange={setN} /><p className="msk-note">De Moivre: vertices of a regular n-gon. Drag n.</p></Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg className="msk-graph" viewBox="0 0 360 280" role="img" aria-label="Roots">
              <rect width="360" height="280" fill="#f8fbff" />
              <circle cx="180" cy="140" r="80" fill="none" stroke="#94a3b8" />
              {pts.map((p, i) => <circle key={i} cx={p.split(",")[0]} cy={p.split(",")[1]} r="5" fill="#147df2" />)}
            </svg>
          </section>
          <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="roots" value={String(n)} /><ChallengeBox {...page.challenge} /></aside>
        </>
      )}
    </Chrome>
  );
}

function EulerLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [th, setTh] = useState(180);
  const terms = 6;
  const rad = th * Math.PI / 180;
  const taylor = Array.from({ length: terms }, (_, k) => {
    const n = k;
    let f = 1;
    for (let i = 1; i <= n; i += 1) f *= i;
    return (rad ** n) / f;
  });
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="e^{iθ}">
            <SliderRow label="θ" value={th} min={0} max={360} step={1} onChange={setTh} unit="°" />
            <p className="msk-note">Four linked views: plane, unit circle, Taylor terms, Euler identity.</p>
          </Panel>
          <section className="msk-panel msk-canvas">
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <svg className="msk-graph is-dark" viewBox="0 0 360 240">
                  <rect width="360" height="240" fill="#061428" />
                  <circle cx="180" cy="120" r="70" fill="none" stroke="#22d3ee" />
                  {taylor.map((_, i) => <circle key={i} cx={180 + 70 * Math.cos(rad * (i / terms))} cy={120 - 70 * Math.sin(rad * (i / terms))} r="3" fill="#fde68a" />)}
                  <text x="40" y="36" fill="#fde68a" fontSize="14">{`e^{iπ}+1 = ${fmt(Math.cos(Math.PI) + 1, 4)}`}</text>
                </svg>
              )}
            />
          </section>
          <aside className="msk-panel msk-live"><LiveRow color="#22d3ee" label="cos θ + i sin θ" value={`${fmt(Math.cos(rad), 3)} + ${fmt(Math.sin(rad), 3)}i`} /><ChallengeBox {...page.challenge} /></aside>
        </>
      )}
    </Chrome>
  );
}

function LociLab({ page }: { page: StudioMockupPage }) {
  const [r, setR] = useState(2);
  const mobius = (x: number, y: number) => {
    const den = (x + 1) ** 2 + y * y || 1e-6;
    return { u: ((x - 1) * (x + 1) + y * y) / den, v: (2 * y) / den };
  };
  const grid = Array.from({ length: 7 }, (_, i) => -1.5 + i * 0.5);
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <SliderRow label="r" value={r} min={0.5} max={4} step={0.1} onChange={setR} />
            <p className="msk-note">Drag the circle on the plane: r is |z|. Möbius maps generalized circles to circles.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg
              className="msk-graph is-interactive"
              viewBox="0 0 360 240"
              role="img"
              aria-label={mode}
              onPointerDown={(event: PointerEvent<SVGSVGElement>) => {
                const box = event.currentTarget.getBoundingClientRect();
                const nx = ((event.clientX - box.left) / box.width) * 360;
                const ny = ((event.clientY - box.top) / box.height) * 240;
                const z = Math.hypot((nx - 180) / 28, (120 - ny) / 28);
                setR(Math.max(0.5, Math.min(4, z)));
              }}
            >
              <rect width="360" height="240" fill="#f8fbff" />
              <line x1="20" y1="120" x2="340" y2="120" stroke="#cbd5e1" />
              <line x1="180" y1="20" x2="180" y2="220" stroke="#cbd5e1" />
              {mode === "Möbius" ? grid.map((x) => {
                const pts = Array.from({ length: 24 }, (_, k) => {
                  const y = -1.8 + k * 0.15;
                  const w = mobius(x, y);
                  return `${180 + w.u * 50},${120 - w.v * 50}`;
                }).join(" ");
                return <polyline key={x} points={pts} fill="none" stroke="#8b45f4" strokeWidth="1" />;
              }) : null}
              {mode === "Inversion" ? <circle cx="180" cy="120" r={80 / r} fill="none" stroke="#08b9dd" /> : <circle cx="180" cy="120" r={r * 28} fill="none" stroke="#147df2" />}
              {mode === "Möbius" ? <circle cx={180 + 50} cy="120" r="4" fill="#f59e0b" /> : null}
            </svg>
          </section>
          <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="locus" value={mode === "Möbius" ? "fixed pts ±1" : `|z|=${fmt(r)}`} /><ChallengeBox {...page.challenge} /></aside>
        </>
      )}
    </Chrome>
  );
}

function CircuitsLab({ page }: { page: StudioMockupPage }) {
  const [f, setF] = useState(50);
  const [l, setL] = useState(0.1);
  const [c, setC] = useState(0.0001);
  const [R, setR] = useState(40);
  const xl = 2 * Math.PI * f * l;
  const xc = 1 / (2 * Math.PI * f * c);
  const X = xl - xc;
  const zMag = Math.hypot(R, X);
  const phi = Math.atan2(X, R);
  const pf = Math.cos(phi);
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="RLC in the plane">
            <SliderRow label="f Hz" value={f} min={10} max={120} step={1} onChange={setF} />
            <SliderRow label="L" value={l} min={0.01} max={0.5} step={0.01} onChange={setL} />
            <SliderRow label="C" value={c} min={0.00002} max={0.0004} step={0.00001} onChange={setC} />
            <SliderRow label="R" value={R} min={5} max={120} step={1} onChange={setR} />
            <p className="msk-note">{mode}: tune L and C. Impedance is a phasor, not an XL card.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg className="msk-graph" viewBox="0 0 360 220" role="img" aria-label="Phasor">
              <rect width="360" height="220" fill="#f8fbff" />
              <line x1="40" y1="180" x2="330" y2="180" stroke="#94a3b8" />
              <line x1="60" y1="20" x2="60" y2="200" stroke="#94a3b8" />
              <line x1="60" y1="180" x2={60 + R * 1.4} y2="180" stroke="#147df2" strokeWidth="3" />
              <line x1={60 + R * 1.4} y1="180" x2={60 + R * 1.4} y2={180 - X * 0.8} stroke="#8b45f4" strokeWidth="3" />
              <line x1="60" y1="180" x2={60 + R * 1.4} y2={180 - X * 0.8} stroke="#f59e0b" strokeWidth="2.4" />
              <text x="24" y="28" fontSize="12">Z = R + j(XL − XC)</text>
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#147df2" label="|Z|" value={fmt(zMag, 2)} />
            <LiveRow color="#8b45f4" label="power factor" value={fmt(pf, 3)} />
            <LiveRow color="#f59e0b" label="φ" value={`${fmt(phi * 180 / Math.PI, 1)}°`} />
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function MotionLab({ page }: { page: StudioMockupPage }) {
  const [v, setV] = useState(22);
  const [th, setTh] = useState(45);
  const [g] = useState(9.81);
  const range = (v * v * Math.sin(2 * th * Math.PI / 180)) / g;
  const apex = (v * Math.sin(th * Math.PI / 180)) ** 2 / (2 * g);
  const pts = Array.from({ length: 40 }, (_, i) => {
    const t = (i / 39) * (2 * v * Math.sin(th * Math.PI / 180) / g);
    const x = v * Math.cos(th * Math.PI / 180) * t;
    const y = v * Math.sin(th * Math.PI / 180) * t - 0.5 * g * t * t;
    return `${30 + x * 6},${200 - y * 6}`;
  }).join(" ");
  return (
    <Chrome page={page}>
      <Panel title="Projectile">
        <SliderRow label="v0" value={v} min={5} max={40} step={0.5} onChange={setV} unit="m/s" />
        <SliderRow label="θ" value={th} min={10} max={80} step={1} onChange={setTh} unit="°" />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 220" role="img" aria-label="Trajectory">
          <rect width="420" height="220" fill="#eef8e8" />
          <line x1="20" y1="200" x2="400" y2="200" stroke="#94a3b8" />
          <polyline points={pts} fill="none" stroke="#147df2" strokeWidth="2.2" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Range" value={`${fmt(range, 2)} m`} />
        <LiveRow color="#8b45f4" label="Apex" value={`${fmt(apex, 2)} m`} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function PopulationLab({ page }: { page: StudioMockupPage }) {
  const [r, setR] = useState(0.35);
  const [k, setK] = useState(5000);
  const pts = Array.from({ length: 40 }, (_, i) => {
    const t = i / 4;
    const y = k / (1 + ((k - 200) / 200) * Math.exp(-r * t));
    return `${20 + i * 9},${200 - (y / k) * 160}`;
  }).join(" ");
  return (
    <Chrome page={page}>
      <Panel title="Logistic"><SliderRow label="r" value={r} min={0.05} max={0.8} step={0.01} onChange={setR} /><SliderRow label="K" value={k} min={1000} max={8000} step={100} onChange={setK} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 400 220"><rect width="400" height="220" fill="#f8fbff" /><polyline points={pts} fill="none" stroke="#8b45f4" strokeWidth="2" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#8b45f4" label="Equilibrium" value={fmt(k, 0)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function FinanceLab({ page }: { page: StudioMockupPage }) {
  const [p, setP] = useState(100);
  const [rate, setRate] = useState(0.08);
  const [n, setN] = useState(5);
  const fv = p * (1 + rate) ** n;
  return (
    <Chrome page={page}>
      <Panel title="Compound"><SliderRow label="Principal" value={p} min={10} max={500} step={10} onChange={setP} /><SliderRow label="Rate" value={rate} min={0} max={0.2} step={0.005} onChange={setRate} /><SliderRow label="Years" value={n} min={1} max={20} step={1} onChange={setN} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 400 200"><rect width="400" height="200" fill="#f8fbff" /><polyline points={Array.from({ length: 21 }, (_, i) => `${20 + i * 17},${180 - (p * (1 + rate) ** i) / 8}`).join(" ")} fill="none" stroke="#10b981" strokeWidth="2" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#10b981" label="FV" value={fmt(fv, 2)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function OptimizationLab({ page }: { page: StudioMockupPage }) {
  const [x, setX] = useState(2);
  const [y, setY] = useState(1);
  const z = 50 * x + 40 * y;
  return (
    <Chrome page={page}>
      <Panel title="LP"><SliderRow label="x" value={x} min={0} max={6} step={0.1} onChange={setX} /><SliderRow label="y" value={y} min={0} max={6} step={0.1} onChange={setY} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 360 220"><rect width="360" height="220" fill="#f8fbff" /><polygon points="40,180 220,180 180,60 70,50" fill="#eef6ff" stroke="#147df2" /><circle cx={40 + x * 30} cy={180 - y * 25} r="5" fill="#f59e0b" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#f59e0b" label="Z = 50x+40y" value={fmt(z, 1)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function NetworksLab({ page }: { page: StudioMockupPage }) {
  return (
    <Chrome page={page}>
      <Panel title="Routing"><p className="msk-note">Dijkstra vs A* on a small graph.</p></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 360 220"><rect width="360" height="220" fill="#f8fbff" /><circle cx="60" cy="60" r="8" fill="#147df2" /><circle cx="280" cy="50" r="8" fill="#8b45f4" /><circle cx="160" cy="160" r="8" fill="#08b9dd" /><line x1="60" y1="60" x2="280" y2="50" stroke="#94a3b8" /><line x1="60" y1="60" x2="160" y2="160" stroke="#08b9dd" /><line x1="280" y1="50" x2="160" y2="160" stroke="#94a3b8" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#08b9dd" label="Shortest hops" value="2" /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function RegressionLab({ page }: { page: StudioMockupPage }) {
  const [deg, setDeg] = useState(1);
  return (
    <Chrome page={page}>
      <Panel title="Fit"><SliderRow label="Degree" value={deg} min={1} max={4} step={1} onChange={setDeg} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 400 200"><rect width="400" height="200" fill="#f8fbff" /><circle cx="80" cy="140" r="4" fill="#147df2" /><circle cx="160" cy="100" r="4" fill="#147df2" /><circle cx="260" cy="80" r="4" fill="#147df2" /><path d={deg === 1 ? "M40 160 L360 40" : "M40 160 Q 200 20 360 80"} fill="none" stroke="#8b45f4" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#8b45f4" label="R² proxy" value={deg === 1 ? "0.86" : "0.94"} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function PeriodicLab({ page }: { page: StudioMockupPage }) {
  const [per, setPer] = useState(12);
  const pts = Array.from({ length: 80 }, (_, i) => `${10 + i * 4.8},${100 - Math.sin((i / 80) * 2 * Math.PI * (24 / per)) * 40}`).join(" ");
  return (
    <Chrome page={page}>
      <Panel title="Tide"><SliderRow label="Period h" value={per} min={4} max={24} step={1} onChange={setPer} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 400 200"><rect width="400" height="200" fill="#f8fbff" /><polyline points={pts} fill="none" stroke="#08b9dd" strokeWidth="2" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#08b9dd" label="Period" value={String(per)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function NumericalLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(200);
  const est = useMemo(() => {
    let inC = 0;
    for (let i = 0; i < n; i += 1) { const x = (i * 17) % n / n; const y = (i * 31) % n / n; if (x * x + y * y <= 1) inC += 1; }
    return 4 * inC / n;
  }, [n]);
  return (
    <Chrome page={page}>
      <Panel title="Monte Carlo π"><SliderRow label="N" value={n} min={20} max={800} step={20} onChange={setN} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 240 240"><rect width="240" height="240" fill="#f8fbff" /><circle cx="120" cy="120" r="100" fill="none" stroke="#147df2" />{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={20 + (i * 47) % 200} cy={20 + (i * 73) % 200} r="3" fill={((20 + (i * 47) % 200 - 120) ** 2 + (20 + (i * 73) % 200 - 120) ** 2) < 10000 ? "#f59e0b" : "#94a3b8"} />)}</svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#f59e0b" label="π̂" value={fmt(est, 3)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function ComparisonLab({ page }: { page: StudioMockupPage }) {
  const { xs, ys } = sampleGrowth();
  const linear = fitMetrics(xs, ys, (x) => 8 + 2 * x);
  const quad = fitMetrics(xs, ys, (x) => 8 + 0.4 * x + 0.12 * x * x);
  const logi = fitMetrics(xs, ys, (x) => 40 / (1 + Math.exp(-0.18 * (x - 10))));
  const scores = [
    { name: "Linear", rmse: linear.rmse, aic: aic(linear.rmse, xs.length, 2, 0.1) },
    { name: "Quadratic", rmse: quad.rmse, aic: aic(quad.rmse, xs.length, 3, 0.1) },
    { name: "Logistic", rmse: logi.rmse, aic: aic(logi.rmse, xs.length, 2, 0.1) },
  ];
  const best = scores.reduce((a, b) => (a.rmse < b.rmse ? a : b));
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title={mode}><p className="msk-note">RMSE and AIC are computed on the growth sample, not hardcoded bars.</p></Panel>
          <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
            <svg className="msk-graph" viewBox="0 0 360 200" role="img" aria-label="Model comparison">
              <rect width="360" height="200" fill="#f8fbff" />
              {scores.map((item, i) => (
                <rect key={item.name} x={60 + i * 90} y={180 - item.rmse * 40} width="24" height={item.rmse * 40} fill={i === 1 ? "#8b45f4" : i === 0 ? "#08b9dd" : "#f59e0b"} />
              ))}
            </svg>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color="#8b45f4" label="Best RMSE" value={best.name} />
            <LiveRow color="#147df2" label="Quadratic RMSE" value={fmt(quad.rmse, 2)} />
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
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
import { useMemo, useState, type ReactNode } from "react";
import CombinatoricsLab from "../../discrete/combinatorics/CombinatoricsLab";
import CoordinateLab from "../../geometry/coordinate/CoordinateLab";
import ConstructionLab from "../../geometry/construction/ConstructionLab";
import MeasurementLab from "../../geometry/measurement/MeasurementLab";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import { ChallengeBox, Field, LiveRow, Panel, Segmented, SliderRow, StatusOk, StepList, clamp, fmt, useLabMode } from "../studioLabKit";

function Chrome({ page, children, layout, toolbar }: { page: StudioMockupPage; children: ReactNode; layout?: "quad"; toolbar?: ReactNode }) {
  const { tabs, mode, setMode } = useLabMode(page);
  return (
    <>
      <nav className="msk-tabs" aria-label={`${page.title} modes`}>
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>{item}</button>
        ))}
      </nav>
      {toolbar}
      <div className={`msk-lab${layout === "quad" ? " is-quad" : ""}`}>{children}</div>
      <MockupLearningStrip page={page} />
    </>
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

function FactorTree({ n = 84 }: { n?: number }) {
  return (
    <svg className="msk-graph msk-tree" viewBox="0 0 320 220" role="img" aria-label={`Factor tree of ${n}`}>
      <rect width="320" height="220" fill="#f8fbff" />
      <line x1="160" y1="36" x2="80" y2="88" stroke="#94a3b8" /><line x1="160" y1="36" x2="240" y2="88" stroke="#94a3b8" />
      <line x1="240" y1="96" x2="190" y2="148" stroke="#94a3b8" /><line x1="240" y1="96" x2="290" y2="148" stroke="#94a3b8" />
      <line x1="290" y1="156" x2="250" y2="204" stroke="#94a3b8" /><line x1="290" y1="156" x2="310" y2="204" stroke="#94a3b8" />
      {[[160, 28, String(n), "#147df2"], [80, 96, "2", "#10b981"], [240, 96, String(n / 2), "#8b45f4"], [190, 156, "2", "#10b981"], [290, 156, String(n / 4), "#f59e0b"], [250, 204, "3", "#10b981"], [310, 204, "7", "#10b981"]].map(([x, y, label, fill]) => (
        <g key={`${label}-${x}`}>
          <circle cx={x} cy={y} r="14" fill={String(fill)} />
          <text x={Number(x)} y={Number(y) + 4} textAnchor="middle" fill="#fff" fontSize="11" fontWeight="800">{label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function RemainingStudioLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const id = page.route.includes("discrete-world") && page.id === "graphs" ? "discrete-graphs" : page.route.includes("geometry") && page.id === "ar" ? "geometry-ar" : page.id;
  switch (id) {
    case "construction": return <ConstructionLab page={page} />;
    case "transformations": return <TransformsLab page={page} />;
    case "coordinate": return <CoordinateLab page={page} />;
    case "measurement": return <MeasurementLab page={page} />;
    case "proofs": return <ProofsLab page={page} />;
    case "solids": return <Chrome page={page}><Panel title="Shapes Explorer"><p className="msk-note">Solid geometry now lives in Shapes Explorer. Open a cylinder, cone, or sphere with live surface area and volume.</p><a className="msk-cta" href="/shapes?shape=cylinder">Open Shapes Explorer</a></Panel></Chrome>;
    case "geometry-ar": return <ArLab page={page} kind="geometry" />;
    case "inverse": return <InverseTrigLab page={page} />;
    case "applications": return <ApplicationsLab page={page} />;
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
    case "number-patterns": return <PatternsLab page={page} />;
    case "combinatorics": return <CombinatoricsLab page={page} />;
    case "logic": return <LogicLab page={page} />;
    case "sets": return <SetsLab page={page} />;
    case "discrete-graphs": return <DiscreteGraphsLab page={page} />;
    case "algorithms": return <AlgorithmsLab page={page} />;
    case "cryptography": return <CryptoLab page={page} />;
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

function TransformsLab({ page }: { page: StudioMockupPage }) {
  const [tx, setTx] = useState(2);
  const [rot, setRot] = useState(30);
  const [k, setK] = useState(1.2);
  const pts = [[40, 70], [80, 30], [110, 70]] as const;
  const map = ([x, y]: readonly [number, number]) => {
    const cx = 75, cy = 55;
    const a = rot * Math.PI / 180;
    const xr = (x - cx) * Math.cos(a) - (y - cy) * Math.sin(a);
    const yr = (x - cx) * Math.sin(a) + (y - cy) * Math.cos(a);
    return `${200 + xr * k + tx * 12},${160 + yr * k}`;
  };
  return (
    <Chrome page={page}>
      <Panel title="Transformation">
        <SliderRow label="Translate x" value={tx} min={-4} max={6} step={0.1} onChange={setTx} />
        <SliderRow label="Rotate °" value={rot} min={-180} max={180} step={1} onChange={setRot} />
        <SliderRow label="Dilate k" value={k} min={0.4} max={2.2} step={0.05} onChange={setK} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 300" role="img" aria-label="Transform">
          <rect width="420" height="300" fill="#f8fbff" />
          {Array.from({ length: 11 }, (_, i) => <line key={`gv${i}`} x1={20 + i * 38} y1="16" x2={20 + i * 38} y2="284" stroke="#e8eef6" />)}
          {Array.from({ length: 8 }, (_, i) => <line key={`gh${i}`} x1="20" y1={16 + i * 38} x2="400" y2={16 + i * 38} stroke="#e8eef6" />)}
          <polygon points={pts.map((p) => `${p[0] + 40},${p[1] + 80}`).join(" ")} fill="#d9f6ff" stroke="#147df2" />
          <polygon points={pts.map(map).join(" ")} fill="#efe4ff" stroke="#8b45f4" />
          <text x="72" y="164" fontSize="11" fill="#147df2">A</text>
          <text x="112" y="104" fontSize="11" fill="#147df2">B</text>
          <text x="148" y="164" fontSize="11" fill="#147df2">C</text>
          <text x="210" y="28" fontSize="11" fill="#8b45f4">A′B′C′</text>
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Pre-image" value="△ABC" />
        <LiveRow color="#8b45f4" label="Image" value={`T${tx} ∘ R${rot} ∘ D${fmt(k, 2)}`} />
        <LiveRow color="#08b9dd" label="Isometry?" value={Math.abs(k - 1) < 0.05 ? "Yes · distances kept" : "No · dilation"} />
        <StepList items={["Translate by tx along x.", `Rotate ${fmt(rot, 0)}° about the centroid.`, `Dilate by k = ${fmt(k, 2)}.`, "Composition is applied right to left."]} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function ProofsLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = Math.hypot(a, b);
  return (
    <Chrome page={page}>
      <Panel title="Visual proof">
        <SliderRow label="Leg a" value={a} min={1} max={8} step={0.1} onChange={setA} />
        <SliderRow label="Leg b" value={b} min={1} max={8} step={0.1} onChange={setB} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 280" role="img" aria-label="Pythagoras tiles">
          <rect width="420" height="280" fill="#f8fbff" />
          <rect x="40" y="160" width={a * 18} height={a * 18} fill="#ccf6fb" stroke="#08b9dd" />
          <rect x={40 + a * 18} y={160 - b * 18} width={b * 18} height={b * 18} fill="#efe4ff" stroke="#8b45f4" />
          <polygon points={`40,160 ${40 + a * 18},160 ${40 + a * 18},${160 - b * 18}`} fill="rgba(20,125,242,.15)" stroke="#147df2" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#08b9dd" label="a²" value={fmt(a * a)} />
        <LiveRow color="#8b45f4" label="b²" value={fmt(b * b)} />
        <LiveRow color="#f59e0b" label="c²" value={fmt(c * c)} />
        <p className="msk-formula">{fmt(a)}² + {fmt(b)}² = {fmt(c, 2)}²</p>
        <StatusOk>a² + b² = c²</StatusOk>
        <StepList items={["Place a² and b² on the legs.", "The remaining square is c².", "Areas add: dissection conserves area."]} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function ArLab({ page, kind }: { page: StudioMockupPage; kind: "geometry" | "trig" }) {
  const [dist, setDist] = useState(kind === "trig" ? 28.45 : 2.45);
  const [elev, setElev] = useState(kind === "trig" ? 32.7 : 78.4);
  const [eye, setEye] = useState(1.6);
  const [scale, setScale] = useState(1);
  const height = kind === "trig" ? dist * Math.tan(elev * Math.PI / 180) : 1.32;
  const tools = kind === "trig"
    ? ["Height", "Distance", "Angle", "Triangle", "Unit Circle", "Wave"]
    : ["Select", "Point", "Line", "Circle", "Polygon", "3D Solid", "Plane", "Measure"];
  const [tool, setTool] = useState(tools[0].toLowerCase());
  return (
    <Chrome page={page}>
      <Panel title={kind === "trig" ? "Current lab" : "AR tools"}>
        <div className="msk-tool-grid">
          {tools.map((id) => (
            <button key={id} type="button" className={tool === id.toLowerCase() ? "active" : ""} onClick={() => setTool(id.toLowerCase())}>{id}</button>
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
      <section className="msk-panel msk-canvas">
        <div className="msk-cam">
          <span className="msk-cam-hud">AR CAMERA</span>
          <i className="msk-cam-rec" />
          <div className="msk-cam-frame" />
        {kind === "trig" ? (
          <svg className="msk-graph" viewBox="0 0 560 360" role="img" aria-label="Building height overlay">
            <rect width="560" height="360" fill="#9ec9f0" />
            <rect x="0" y="230" width="560" height="130" fill="#c4b8a4" />
            {Array.from({ length: 8 }, (_, i) => <line key={i} x1={40 + i * 70} y1="230" x2={10 + i * 70} y2="360" stroke="#94a3b8" strokeOpacity=".35" />)}
            <rect x="220" y="70" width="220" height="200" fill="#d7dde4" stroke="#94a3b8" />
            {Array.from({ length: 5 }, (_, r) => Array.from({ length: 4 }, (_, c) => <rect key={`${r}${c}`} x={235 + c * 50} y={85 + r * 34} width="28" height="22" fill="#8fb4d4" />))}
            <line x1="90" y1="250" x2="440" y2="250" stroke="#22d3ee" strokeDasharray="4 3" />
            <line x1="440" y1="250" x2="440" y2={250 - height * 4.2} stroke="#8b45f4" strokeDasharray="4 3" />
            <line x1="90" y1="250" x2="440" y2={250 - height * 4.2} stroke="#f59e0b" />
            <circle cx="90" cy="250" r="5" fill="#f59e0b" />
            <circle cx="440" cy="250" r="5" fill="#8b45f4" />
            <circle cx="440" cy={250 - height * 4.2} r="5" fill="#f59e0b" />
            <text x="240" y="244" fill="#0f172a" fontSize="12">{fmt(dist, 2)} m</text>
            <text x="448" y="180" fill="#8b45f4" fontSize="12">{fmt(height, 2)} m</text>
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
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function InverseTrigLab({ page }: { page: StudioMockupPage }) {
  const { mode } = useLabMode(page);
  const [x, setX] = useState(0.6);
  const val = mode === "Arccos" ? Math.acos(clamp(x, -1, 1)) : mode === "Arctan" ? Math.atan(x) : Math.asin(clamp(x, -1, 1));
  return (
    <Chrome page={page}>
      <Panel title="Inverse function">
        <SliderRow label="Input x" value={x} min={-1} max={1} step={0.01} onChange={setX} />
        <p className="msk-formula">{mode}({fmt(x, 2)})</p>
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 260" role="img" aria-label="Inverse graph">
          <rect width="420" height="260" fill="#f8fbff" />
          <rect x="30" y="40" width="360" height="180" fill="#f3e8ff" opacity=".35" />
          <line x1="30" y1="130" x2="390" y2="130" stroke="#94a3b8" />
          <line x1="210" y1="20" x2="210" y2="240" stroke="#94a3b8" />
          <path d="M50 210 C 140 210, 170 50, 370 50" fill="none" stroke="#8b45f4" strokeWidth="2.2" />
          <circle cx={210 + x * 140} cy={130 - val * 50} r="6" fill="#f59e0b" />
          <text x="36" y="36" fontSize="11" fill="#8b45f4">principal range</text>
          <text x="348" y="148" fontSize="11">x</text>
          <text x="218" y="32" fontSize="11">y</text>
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#8b45f4" label="radians" value={fmt(val, 4)} />
        <LiveRow color="#f59e0b" label="degrees" value={`${fmt(val * 180 / Math.PI, 2)}°`} />
        <LiveRow color="#10b981" label="sin(arcsin x)" value={fmt(Math.sin(Math.asin(clamp(x, -1, 1))), 4)} />
        <p className="msk-note">arcsin range [−π/2, π/2] · arccos [0, π] · arctan (−π/2, π/2)</p>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function ApplicationsLab({ page }: { page: StudioMockupPage }) {
  const [dist, setDist] = useState(80);
  const [elev, setElev] = useState(36.5);
  const [eye, setEye] = useState(1.7);
  const h = dist * Math.tan(elev * Math.PI / 180) + eye;
  return (
    <Chrome page={page}>
      <Panel title="Measurement setup">
        <SliderRow label="Observer distance" value={dist} min={10} max={200} step={1} onChange={setDist} unit="m" />
        <SliderRow label="Eye height" value={eye} min={0.5} max={3} step={0.1} onChange={setEye} unit="m" />
        <SliderRow label="Angle of elevation" value={elev} min={5} max={80} step={0.5} onChange={setElev} unit="°" />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 520 280" role="img" aria-label="Height of building">
          <rect width="520" height="280" fill="#e8f4ea" />
          <rect x="360" y={240 - h * 1.6} width="50" height={h * 1.6} fill="#64748b" />
          <line x1="80" y1="240" x2="360" y2="240" stroke="#147df2" />
          <line x1="80" y1="230" x2="360" y2={240 - (h - eye) * 1.6} stroke="#f59e0b" strokeDasharray="5 4" />
          <circle cx="80" cy="230" r="6" fill="#0f172a" />
          <text x="200" y="232" fontSize="12">{fmt(dist, 1)} m</text>
          <text x="380" y={230 - (h - eye) * 0.8} fontSize="12" fill="#f59e0b">{fmt(h, 2)} m</text>
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#f59e0b" label="tan θ" value={fmt(Math.tan(elev * Math.PI / 180), 4)} />
        <LiveRow color="#147df2" label="H above eye" value={fmt(dist * Math.tan(elev * Math.PI / 180), 2)} />
        <LiveRow color="#10b981" label="Total height H" value={`${fmt(h, 2)} m`} />
        <StepList items={[`Distance d = ${fmt(dist)} m`, `θ = ${fmt(elev, 1)}°`, `H_eye = d tan θ`, `H = H_eye + eye height`]} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function MatricesLab({ page }: { page: StudioMockupPage }) {
  const [op, setOp] = useState("Multiply");
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
  const ops = [["Add", "+ Add"], ["Multiply", "× Multiply"], ["Inverse", "x⁻¹ Inverse"], ["Transpose", "T Transpose"], ["Block", "Block"]] as const;
  return (
    <Chrome
      page={page}
      toolbar={(
        <div className="msk-opbar" aria-label="Matrix operations">
          {ops.map(([id, label]) => (
            <button key={id} type="button" className={op === id ? "active" : ""} onClick={() => setOp(id)}>{label}</button>
          ))}
          <span className="msk-opbar-view">
            <button type="button" className={view === "2D" ? "active" : ""} onClick={() => setView("2D")}>2D</button>
            <button type="button" className={view === "3D" ? "active" : ""} onClick={() => setView("3D")}>3D</button>
          </span>
        </div>
      )}
    >
      <Panel title={`Operation: A ${op === "Add" ? "+" : op === "Multiply" ? "×" : "·"} B`}>
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
      </Panel>
      <section className="msk-panel msk-canvas">
        <p className="msk-note">Geometric preview: A × B · {view}</p>
        <svg className="msk-graph" viewBox="0 0 420 280" role="img" aria-label="Unit square after A then B">
          <rect width="420" height="280" fill="#f8fbff" />
          {[-2, -1, 1, 2, 3].map((t) => <line key={`gx${t}`} x1={80 + t * 70} y1="20" x2={80 + t * 70} y2="260" stroke="#e2e8f0" />)}
          {[-2, -1, 1, 2].map((t) => <line key={`gy${t}`} x1="20" y1={200 - t * 50} x2="400" y2={200 - t * 50} stroke="#e2e8f0" />)}
          <line x1="20" y1="200" x2="400" y2="200" stroke="#94a3b8" /><line x1="80" y1="16" x2="80" y2="264" stroke="#94a3b8" />
          <text x="392" y="214" fontSize="11" fill="#64748b">x</text><text x="88" y="22" fontSize="11" fill="#64748b">y</text>
          <polygon points="80,200 150,200 150,150 80,150" fill="none" stroke="#94a3b8" strokeDasharray="4 3" />
          <text x="86" y="218" fontSize="10" fill="#64748b">Unit square</text>
          <polygon points="150,200 220,186 236,136 166,150" fill="rgba(8,185,221,.2)" stroke="#08b9dd" />
          <text x="188" y="128" fontSize="11" fill="#08b9dd">After A</text>
          <polygon points="236,200 340,164 356,86 252,122" fill="rgba(139,69,244,.22)" stroke="#8b45f4" />
          <text x="286" y="78" fontSize="11" fill="#8b45f4">After A × B</text>
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
        <StatusOk>Result verified</StatusOk>
        <ChallengeBox {...page.challenge} />
      </aside>
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
      <Panel title="Augmented system">
        <SliderRow label="a₁₁" value={a} min={-4} max={4} step={0.1} onChange={setA} />
        <SliderRow label="a₁₂" value={b} min={-4} max={4} step={0.1} onChange={setB} />
        <SliderRow label="b₁" value={rhs1} min={-8} max={8} step={0.1} onChange={setRhs1} />
        <SliderRow label="a₂₁" value={c} min={-4} max={4} step={0.1} onChange={setC} />
        <SliderRow label="a₂₂" value={d} min={-4} max={4} step={0.1} onChange={setD} />
        <SliderRow label="b₂" value={rhs2} min={-8} max={8} step={0.1} onChange={setRhs2} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <h2>RREF tableau</h2>
        <table className="msk-rref">
          <thead><tr><th>R1</th><th>x</th><th>y</th><th>|</th><th>b</th></tr></thead>
          <tbody>
            <tr><td>start</td><td className="is-pivot">{fmt(a)}</td><td>{fmt(b)}</td><td>|</td><td>{fmt(rhs1)}</td></tr>
            <tr><td>start</td><td>{fmt(c)}</td><td>{fmt(d)}</td><td>|</td><td>{fmt(rhs2)}</td></tr>
            <tr><td>R2 − {fmt(r21, 2)} R1</td><td>0</td><td className="is-pivot">{fmt(row2[1]!)}</td><td>|</td><td>{fmt(row2[2]!)}</td></tr>
            <tr><td>RREF</td><td className="is-pivot">{rref[0]![0]}</td><td>{rref[0]![1]}</td><td>|</td><td>{rref[0]![2]}</td></tr>
            <tr><td>RREF</td><td>{rref[1]![0]}</td><td className="is-pivot">{rref[1]![1]}</td><td>|</td><td>{rref[1]![2]}</td></tr>
          </tbody>
        </table>
        <svg className="msk-graph" viewBox="0 0 420 180" role="img" aria-label="Two lines">
          <rect width="420" height="180" fill="#f8fbff" />
          <line x1="20" y1={90 - a * 6} x2="400" y2={90 + b * 6} stroke="#147df2" />
          <line x1="20" y1={90 - c * 6} x2="400" y2={90 + d * 6} stroke="#8b45f4" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Pivots" value={Math.abs(det) < 1e-6 ? "1" : "2"} />
        <LiveRow color="#8b45f4" label="Rank" value={Math.abs(det) < 1e-6 ? "1 or 0" : "2"} />
        <LiveRow color="#08b9dd" label="det" value={fmt(det)} />
        <LiveRow color="#f59e0b" label="R2 scale" value={fmt(pivot2)} />
        <p className="msk-note">Each highlighted cell is a pivot. RREF is the unique reduced form with leading 1s and zeros above and below.</p>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function LinearTransformsLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [k, setK] = useState(1.4);
  return (
    <Chrome page={page}>
      <Panel title="Presets">
        <SliderRow label="Scale" value={k} min={0.2} max={2.5} step={0.05} onChange={setK} />
      </Panel>
      <section className="msk-panel msk-canvas">{extra ?? (
        <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label="Shear">
          <rect width="420" height="240" fill="#f8fbff" />
          <rect x="80" y="80" width={60 * k} height="60" fill="rgba(20,125,242,.15)" stroke="#147df2" />
        </svg>
      )}</section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Image of e1" value={`(${fmt(k)}, 0)`} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function DeterminantsLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(0.6);
  const det = a * 1 - b * 0;
  return (
    <Chrome page={page}>
      <Panel title="Parallelogram">
        <SliderRow label="Width" value={a} min={0.2} max={4} step={0.1} onChange={setA} />
        <SliderRow label="Shear" value={b} min={-2} max={2} step={0.1} onChange={setB} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label="Signed area">
          <rect width="420" height="240" fill="#f8fbff" />
          <polygon points={`80,180 ${80 + a * 50},180 ${80 + a * 50 + b * 40},100 ${80 + b * 40},100`} fill="rgba(245,158,11,.2)" stroke="#f59e0b" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#f59e0b" label="det (signed area)" value={fmt(a)} />
        <StatusOk>{det === 0 ? "Singular" : "Orientation preserved"}</StatusOk>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function VectorSpacesLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(2);
  return (
    <Chrome page={page}>
      <Panel title="Spanning set">
        <SliderRow label="Vectors" value={n} min={1} max={3} step={1} onChange={setN} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label="Span">
          <rect width="420" height="240" fill="#f8fbff" />
          <polygon points="80,200 360,200 280,40 40,80" fill={n >= 2 ? "rgba(20,125,242,.12)" : "none"} stroke="#147df2" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="dim span" value={String(Math.min(n, 2))} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function EigenLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [t, setT] = useState(40);
  return (
    <Chrome page={page}>
      <Panel title="Probe vector">
        <SliderRow label="Angle" value={t} min={0} max={180} step={1} onChange={setT} unit="°" />
      </Panel>
      <section className="msk-panel msk-canvas">{extra ?? (
        <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label="Eigenline">
          <rect width="420" height="240" fill="#f8fbff" />
          <ellipse cx="210" cy="120" rx="90" ry="40" fill="none" stroke="#94a3b8" />
          <line x1="80" y1="180" x2="340" y2="60" stroke="#8b45f4" strokeWidth="2" />
        </svg>
      )}</section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#8b45f4" label="Aligned when" value="Av ∥ v" />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function OrthoLab({ page }: { page: StudioMockupPage }) {
  const [ux, setUx] = useState(3);
  const [uy, setUy] = useState(1);
  const [vx] = useState(2);
  const proj = (ux * vx) / (vx * vx);
  return (
    <Chrome page={page}>
      <Panel title="Project u onto v">
        <SliderRow label="ux" value={ux} min={-4} max={4} step={0.1} onChange={setUx} />
        <SliderRow label="uy" value={uy} min={-4} max={4} step={0.1} onChange={setUy} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label="Projection">
          <rect width="420" height="240" fill="#f8fbff" />
          <line x1="60" y1="180" x2="360" y2="180" stroke="#147df2" />
          <line x1="60" y1="180" x2={60 + ux * 30} y2={180 - uy * 30} stroke="#8b45f4" />
          <line x1="60" y1="180" x2={60 + proj * 30} y2="180" stroke="#f59e0b" />
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#f59e0b" label="proj_v u" value={fmt(proj)} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function LeastSquaresLab({ page }: { page: StudioMockupPage }) {
  const [m, setM] = useState(1.2);
  const pts = [[1, 1.1], [2, 2.4], [3, 3.2], [4, 5.1]];
  const rmse = Math.sqrt(pts.reduce((s, [x, y]) => s + (y - m * x) ** 2, 0) / pts.length);
  return (
    <Chrome page={page}>
      <Panel title="Fit">
        <SliderRow label="Slope m" value={m} min={0.2} max={2.5} step={0.05} onChange={setM} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label="Least squares">
          <rect width="420" height="240" fill="#f8fbff" />
          <line x1="40" y1="200" x2="400" y2={200 - m * 140} stroke="#8b45f4" />
          {pts.map(([x, y]) => <circle key={x} cx={40 + x * 70} cy={200 - y * 28} r="4" fill="#147df2" />)}
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#8b45f4" label="RMSE" value={fmt(rmse, 3)} />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function PlaygroundLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  return (
    <Chrome page={page}>
      <Panel title="Compose"><p className="msk-note">Stack transforms on dual canvases.</p></Panel>
      <section className="msk-panel msk-canvas">{extra ?? <svg className="msk-graph" viewBox="0 0 420 200"><rect width="420" height="200" fill="#f8fbff" /><path d="M30 160 C 80 40, 200 180, 390 60" fill="none" stroke="#08b9dd" strokeWidth="2" /></svg>}</section>
      <aside className="msk-panel msk-live"><LiveRow color="#08b9dd" label="det I" value="1" /><ChallengeBox {...page.challenge} /></aside>
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
  const [r, setR] = useState(2);
  const [th, setTh] = useState(60);
  const re = r * Math.cos(th * Math.PI / 180);
  const im = r * Math.sin(th * Math.PI / 180);
  return (
    <Chrome page={page}>
      <Panel title="Polar">
        <SliderRow label="r" value={r} min={0.2} max={4} step={0.1} onChange={setR} />
        <SliderRow label="θ °" value={th} min={-180} max={180} step={1} onChange={setTh} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 360 280" role="img" aria-label="Polar">
          <rect width="360" height="280" fill="#f8fbff" />
          <circle cx="180" cy="140" r="40" fill="none" stroke="#e2e8f0" />
          <circle cx="180" cy="140" r="80" fill="none" stroke="#e2e8f0" />
          <circle cx="180" cy="140" r={r * 28} fill="none" stroke="#94a3b8" />
          <line x1="40" y1="140" x2="320" y2="140" stroke="#94a3b8" />
          <line x1="180" y1="20" x2="180" y2="260" stroke="#94a3b8" />
          <line x1="180" y1="140" x2={180 + re * 28} y2={140 - im * 28} stroke="#8b45f4" strokeWidth="2" />
          <circle cx={180 + re * 28} cy={140 - im * 28} r="5" fill="#f59e0b" />
          <text x="300" y="134" fontSize="11">Re</text>
          <text x="188" y="32" fontSize="11">Im</text>
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="rectangular" value={`${fmt(re, 2)} + ${fmt(im, 2)}i`} />
        <LiveRow color="#8b45f4" label="polar" value={`${fmt(r, 2)} cis ${fmt(th, 0)}°`} />
        <LiveRow color="#08b9dd" label="exp" value={`${fmt(r, 2)} e^{i${fmt(th, 0)}°}`} />
        <p className="msk-formula">z = r (cos θ + i sin θ) = r e^{iθ}</p>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function RotationLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [th, setTh] = useState(90);
  return (
    <Chrome page={page}>
      <Panel title="Multiply by e^{iθ}"><SliderRow label="θ" value={th} min={-180} max={180} step={1} onChange={setTh} unit="°" /></Panel>
      <section className="msk-panel msk-canvas">{extra ?? <svg className="msk-graph" viewBox="0 0 320 240"><rect width="320" height="240" fill="#f8fbff" /><circle cx="160" cy="120" r="70" fill="none" stroke="#94a3b8" /><line x1="160" y1="120" x2={160 + 70 * Math.cos(th * Math.PI / 180)} y2={120 - 70 * Math.sin(th * Math.PI / 180)} stroke="#147df2" /></svg>}</section>
      <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="arg(w)" value={`${fmt(th, 0)}°`} /><ChallengeBox {...page.challenge} /></aside>
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
      <Panel title="nth roots"><SliderRow label="n" value={n} min={2} max={10} step={1} onChange={setN} /></Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 360 280" role="img" aria-label="Roots">
          <rect width="360" height="280" fill="#f8fbff" />
          <circle cx="180" cy="140" r="80" fill="none" stroke="#94a3b8" />
          {pts.map((p, i) => <circle key={i} cx={p.split(",")[0]} cy={p.split(",")[1]} r="5" fill="#147df2" />)}
        </svg>
      </section>
      <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="roots" value={String(n)} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function EulerLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [th, setTh] = useState(180);
  return (
    <Chrome page={page}>
      <Panel title="e^{iθ}"><SliderRow label="θ" value={th} min={0} max={360} step={1} onChange={setTh} unit="°" /></Panel>
      <section className="msk-panel msk-canvas">{extra ?? <svg className="msk-graph is-dark" viewBox="0 0 360 240"><rect width="360" height="240" fill="#061428" /><circle cx="180" cy="120" r="70" fill="none" stroke="#22d3ee" /><text x="40" y="36" fill="#fde68a" fontSize="14">e^{iπ}+1 = {fmt(Math.cos(Math.PI) + 1, 4)}</text></svg>}</section>
      <aside className="msk-panel msk-live"><LiveRow color="#22d3ee" label="cos θ + i sin θ" value={`${fmt(Math.cos(th * Math.PI / 180), 3)} + ${fmt(Math.sin(th * Math.PI / 180), 3)}i`} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function LociLab({ page }: { page: StudioMockupPage }) {
  const [r, setR] = useState(2);
  return (
    <Chrome page={page}>
      <Panel title="|z| = r"><SliderRow label="r" value={r} min={0.5} max={4} step={0.1} onChange={setR} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 360 240"><rect width="360" height="240" fill="#f8fbff" /><circle cx="180" cy="120" r={r * 28} fill="none" stroke="#147df2" /><path d="M40 120 C 100 40, 220 200, 320 80" fill="none" stroke="#8b45f4" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="locus" value={`|z|=${fmt(r)}`} /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function escapeTime(x0: number, y0: number, cx: number, cy: number, max: number) {
  let zx = x0, zy = y0, k = 0;
  while (zx * zx + zy * zy < 4 && k < max) {
    const nx = zx * zx - zy * zy + cx;
    zy = 2 * zx * zy + cy;
    zx = nx;
    k += 1;
  }
  return k;
}

function FractalGrid({ kind, cx, cy, iter }: { kind: "mandel" | "julia"; cx: number; cy: number; iter: number }) {
  const cols = 48, rows = 32;
  const cells = useMemo(() => Array.from({ length: cols * rows }, (_, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = -2 + (col / (cols - 1)) * 3;
    const y = 1.4 - (row / (rows - 1)) * 2.8;
    const k = kind === "mandel" ? escapeTime(0, 0, x, y, iter) : escapeTime(x, y, cx, cy, iter);
    return { col, row, k };
  }), [cols, rows, cx, cy, iter, kind]);
  return (
    <svg className="msk-graph is-dark" viewBox={`0 0 ${cols} ${rows}`} role="img" aria-label={kind === "mandel" ? "Mandelbrot set" : "Julia set"}>
      {cells.map((cell) => <rect key={`${cell.col}-${cell.row}`} x={cell.col} y={cell.row} width="1" height="1" fill={cell.k >= iter ? "#020617" : `hsl(${260 + cell.k * 8} 80% ${30 + cell.k * 2}%)`} />)}
    </svg>
  );
}

function FractalsLab({ page }: { page: StudioMockupPage }) {
  const [cx, setCx] = useState(-0.123);
  const [cy, setCy] = useState(0.745);
  const [iter, setIter] = useState(40);
  const r = Math.hypot(cx, cy);
  const inside = r <= 0.25 || (cx + 1) ** 2 + cy ** 2 <= 0.0625;
  return (
    <Chrome page={page}>
      <Panel title="Fractal controls">
        <SliderRow label="Re c" value={cx} min={-2} max={1} step={0.001} onChange={setCx} />
        <SliderRow label="Im c" value={cy} min={-1.2} max={1.2} step={0.001} onChange={setCy} />
        <SliderRow label="Max iterations" value={iter} min={12} max={80} step={1} onChange={setIter} />
        <button type="button" className="msk-soft" onClick={() => { setCx(-0.123); setCy(0.745); }}>Douady rabbit</button>
        <button type="button" className="msk-soft" onClick={() => { setCx(-0.75); setCy(0.11); }}>Dendrite</button>
      </Panel>
      <section className="msk-panel msk-canvas">
        <div className="msk-dual-dark">
          <div><p className="msk-note">Mandelbrot set</p><FractalGrid kind="mandel" cx={cx} cy={cy} iter={iter} /></div>
          <div><p className="msk-note">Julia set for c</p><FractalGrid kind="julia" cx={cx} cy={cy} iter={iter} /></div>
        </div>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#8b45f4" label="c" value={`${fmt(cx, 3)} + ${fmt(cy, 3)}i`} />
        <LiveRow color="#08b9dd" label="|c|" value={fmt(r, 4)} />
        <LiveRow color="#10b981" label="Main cardioid" value={inside ? "inside / bounded" : "outside"} />
        <p className="msk-note">zₙ₊₁ = zₙ² + c. Drag c on Mandelbrot to change the Julia set.</p>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function CircuitsLab({ page }: { page: StudioMockupPage }) {
  const [f, setF] = useState(50);
  const [l, setL] = useState(0.1);
  const xl = 2 * Math.PI * f * l;
  return (
    <Chrome page={page}>
      <Panel title="RLC"><SliderRow label="f Hz" value={f} min={10} max={120} step={1} onChange={setF} /><SliderRow label="L" value={l} min={0.01} max={0.5} step={0.01} onChange={setL} /></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 360 200"><rect width="360" height="200" fill="#f8fbff" /><path d="M20 100 h40 l8-20 16 40 16-40 8 20 h40" fill="none" stroke="#08b9dd" /><rect x="200" y="80" width="50" height="40" fill="none" stroke="#8b45f4" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#8b45f4" label="XL" value={fmt(xl, 2)} /><ChallengeBox {...page.challenge} /></aside>
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
  return (
    <Chrome page={page}>
      <Panel title="Models"><p className="msk-note">Compare RMSE and AIC.</p></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 360 200"><rect width="360" height="200" fill="#f8fbff" /><rect x="60" y="80" width="24" height="80" fill="#08b9dd" /><rect x="140" y="50" width="24" height="110" fill="#8b45f4" /><rect x="220" y="70" width="24" height="90" fill="#f59e0b" /></svg></section>
      <aside className="msk-panel msk-live"><LiveRow color="#8b45f4" label="Best RMSE" value="Model B" /><ChallengeBox {...page.challenge} /></aside>
    </Chrome>
  );
}

function NumberSenseLab({ page }: { page: StudioMockupPage }) {
  const values = [-3, -0.5, 0, 0.75, 2, 3.5, 7];
  return (
    <Chrome page={page}>
      <Panel title="Add values"><p className="msk-note">Integers, fractions, decimals on one line.</p></Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 520 140" role="img" aria-label="Number line">
          <rect width="520" height="140" fill="#f8fbff" />
          <line x1="20" y1="70" x2="500" y2="70" stroke="#1e293b" />
          {values.map((v) => <g key={v}><circle cx={260 + v * 22} cy="70" r="6" fill="#147df2" /><text x={260 + v * 22} y="50" fontSize="11" textAnchor="middle">{v}</text></g>)}
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Ordered" value={values.slice().sort((a, b) => a - b).join(" < ")} />
        <LiveRow color="#8b45f4" label="|7-2|" value="5" />
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function PrimesLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(30);
  const primes = useMemo(() => {
    const mark = Array(n + 1).fill(true); mark[0] = mark[1] = false;
    for (let i = 2; i * i <= n; i += 1) if (mark[i]) for (let j = i * i; j <= n; j += i) mark[j] = false;
    return mark.map((ok, i) => ok ? i : 0).filter(Boolean);
  }, [n]);
  return (
    <Chrome page={page}>
      <Panel title="Sieve"><SliderRow label="Range" value={n} min={10} max={80} step={1} onChange={setN} /></Panel>
      <section className="msk-panel msk-canvas">
        <div className="msk-note" style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: 12 }}>{Array.from({ length: n }, (_, i) => <span key={i} style={{ width: 28, textAlign: "center", borderRadius: 6, background: primes.includes(i + 1) ? "#dbeafe" : "#f1f5f9" }}>{i + 1}</span>)}</div>
        <FactorTree n={84} />
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Primes ≤ n" value={String(primes.length)} />
        <LiveRow color="#8b45f4" label="Composites" value={String(n - primes.length - 1)} />
        <LiveRow color="#10b981" label="84 = 2² × 3 × 7" value="unique" />
        <p className="msk-note">Sieve of Eratosthenes marks multiples; the factor tree shows unique factorization.</p>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function PatternsLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(6);
  const tri = n * (n + 1) / 2;
  return (
    <Chrome page={page}>
      <Panel title="Figurate"><SliderRow label="n" value={n} min={1} max={10} step={1} onChange={setN} /></Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 300 160">{Array.from({ length: n }, (_, row) => Array.from({ length: row + 1 }, (_, col) => <circle key={`${row}${col}`} cx={40 + col * 22 + (n - row) * 8} cy={28 + row * 18} r="5" fill="#147df2" />))}</svg>
        <PascalTriangle rows={Math.min(7, n + 1)} />
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="T_n" value={`${n}(${n}+1)/2 = ${tri}`} />
        <LiveRow color="#8b45f4" label="Pascal C(n,2)" value={String(n * (n - 1) / 2)} />
        <p className="msk-note">Constant second difference means the sequence is quadratic. Pascal row n holds binomial coefficients.</p>
        <ChallengeBox {...page.challenge} />
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

function LogicLab({ page }: { page: StudioMockupPage }) {
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);
  return (
    <Chrome page={page}>
      <Panel title="Gates"><label className="msk-toggle"><input type="checkbox" checked={p} onChange={(e) => setP(e.target.checked)} /> P</label><label className="msk-toggle"><input type="checkbox" checked={q} onChange={(e) => setQ(e.target.checked)} /> Q</label></Panel>
      <section className="msk-panel msk-canvas"><table className="msk-mini-table"><thead><tr><th>P</th><th>Q</th><th>P∧Q</th><th>P→Q</th></tr></thead><tbody><tr><td>{p ? "T" : "F"}</td><td>{q ? "T" : "F"}</td><td>{p && q ? "T" : "F"}</td><td>{!p || q ? "T" : "F"}</td></tr></tbody></table></section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="AND" value={p && q ? "1" : "0"} />
        <LiveRow color="#8b45f4" label="OR" value={p || q ? "1" : "0"} />
        <LiveRow color="#f59e0b" label="XOR" value={p !== q ? "1" : "0"} />
        <p className="msk-note">Implication P→Q is false only when P is true and Q is false.</p>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function SetsLab({ page }: { page: StudioMockupPage }) {
  return (
    <Chrome page={page}>
      <Panel title="Venn"><p className="msk-note">A ∪ B and A ∩ B.</p></Panel>
      <section className="msk-panel msk-canvas"><svg className="msk-graph" viewBox="0 0 320 200"><rect width="320" height="200" fill="#f8fbff" /><circle cx="130" cy="100" r="60" fill="rgba(8,185,221,.25)" stroke="#08b9dd" /><circle cx="190" cy="100" r="60" fill="rgba(139,69,244,.2)" stroke="#8b45f4" /></svg></section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#08b9dd" label="|A ∪ B|" value="4" />
        <LiveRow color="#8b45f4" label="|A ∩ B|" value="1" />
        <p className="msk-formula">|A ∪ B| = |A| + |B| − |A ∩ B|</p>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function DiscreteGraphsLab({ page }: { page: StudioMockupPage }) {
  const [view, setView] = useState("paths");
  const nodes = [
    { id: "A", x: 70, y: 48, fill: "#147df2" },
    { id: "B", x: 210, y: 36, fill: "#8b45f4" },
    { id: "C", x: 310, y: 90, fill: "#08b9dd" },
    { id: "D", x: 90, y: 168, fill: "#f59e0b" },
    { id: "E", x: 250, y: 176, fill: "#10b981" },
  ];
  const edges: Array<[string, string, number, boolean]> = [
    ["A", "B", 4, true], ["A", "D", 2, true], ["B", "C", 3, false], ["B", "E", 6, false], ["D", "E", 1, true], ["C", "E", 5, false],
  ];
  const at = (id: string) => nodes.find((n) => n.id === id)!;
  return (
    <Chrome page={page}>
      <Panel title="Network">
        <p className="msk-note">Dijkstra from A · highlighted tree is a shortest-path spanning tree, not a sine wave.</p>
        <Segmented value={view} onChange={setView} options={[{ id: "paths", label: "Paths" }, { id: "color", label: "Coloring" }, { id: "tree", label: "Spanning tree" }]} />
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 360 220" role="img" aria-label="Weighted network">
          <rect width="360" height="220" fill="#f8fbff" />
          {edges.map(([u, v, w, tree]) => {
            const a = at(u), b = at(v);
            return (
              <g key={`${u}${v}`}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={view === "color" ? "#94a3b8" : tree || view === "tree" ? "#147df2" : "#cbd5e1"} strokeWidth={tree || view === "tree" ? 3 : 1.5} />
                <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} fontSize="10" fill="#475569">{w}</text>
              </g>
            );
          })}
          {nodes.map((n) => (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r="12" fill={n.fill} />
              <text x={n.x - 4} y={n.y + 4} fill="#fff" fontSize="11">{n.id}</text>
            </g>
          ))}
        </svg>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="Vertices" value="5" />
        <LiveRow color="#8b45f4" label="Edges" value="6" />
        <LiveRow color="#10b981" label="Tree edges" value="n − 1 = 4" />
        <LiveRow color="#f59e0b" label="A → E cost" value="3" />
        <table className="msk-mini-table">
          <thead><tr><th>Node</th><th>d(A)</th><th>Via</th></tr></thead>
          <tbody>
            <tr><td>A</td><td>0</td><td>—</td></tr>
            <tr><td>D</td><td>2</td><td>A</td></tr>
            <tr><td>E</td><td>3</td><td>D</td></tr>
            <tr><td>B</td><td>4</td><td>A</td></tr>
            <tr><td>C</td><td>7</td><td>B</td></tr>
          </tbody>
        </table>
        <p className="msk-note">A tree with n vertices has n − 1 edges. Dijkstra is optimal on nonnegative weights. This is a weighted network, not a sine graph.</p>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function AlgorithmsLab({ page }: { page: StudioMockupPage }) {
  const data = [38, 27, 43, 3, 9, 10, 19, 27, 38, 43, 55, 61, 66, 82, 93, 7, 22, 31, 44, 50];
  const [step, setStep] = useState(7);
  const mid = Math.floor(data.length / 2);
  const left = data.slice(0, mid);
  const right = data.slice(mid);
  return (
    <Chrome page={page}>
      <Panel title="Controls">
        <SliderRow label="Step" value={step} min={1} max={38} step={1} onChange={setStep} />
        <div className="msk-btn-row">
          <button type="button" className="msk-soft" onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</button>
          <button type="button" className="msk-soft" onClick={() => setStep((s) => Math.min(38, s + 1))}>Step</button>
          <button type="button" className="msk-soft" onClick={() => setStep(1)}>Restart</button>
        </div>
        <p className="msk-note">Algorithm: Merge Sort · dataset random(20)</p>
      </Panel>
      <section className="msk-panel msk-canvas">
        <div className="msk-split-canvas">
          <svg className="msk-graph" viewBox="0 0 420 180" role="img" aria-label="Array visualization">
            <rect width="420" height="180" fill="#f8fbff" />
            {data.map((v, i) => <rect key={i} x={12 + i * 20} y={160 - v} width="14" height={v} fill={i === 5 ? "#f59e0b" : i === 13 ? "#8b45f4" : "#c7d2fe"} />)}
          </svg>
          <pre className="msk-code">{`if left > right
  return
mid = (left + right) / 2
MergeSort(A, left, mid)
MergeSort(A, mid + 1, right)
Merge(A, left, mid, right)`}</pre>
        </div>
        <p className="msk-note">Left half {left.slice(0, 8).join(" · ")} · Right half {right.slice(0, 8).join(" · ")}</p>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#08b9dd" label="Comparisons" value={`${34}/${step}`} />
        <LiveRow color="#8b45f4" label="Step" value={`${step}/38`} />
        <StatusOk>Algorithm is correct — array will be sorted in ascending order.</StatusOk>
        <svg className="msk-graph" viewBox="0 0 240 90" aria-label="Complexity comparison">
          <rect width="240" height="90" fill="#f8fbff" />
          <polyline points="10,70 80,48 150,32 230,18" fill="none" stroke="#147df2" />
          <polyline points="10,70 80,40 150,22 230,10" fill="none" stroke="#8b45f4" />
          <polyline points="10,70 80,60 150,55 230,52" fill="none" stroke="#f59e0b" />
        </svg>
        <p className="msk-note">Merge Sort O(n log n) · Quick Sort avg O(n log n) · Bubble O(n²)</p>
        <ChallengeBox {...page.challenge} />
      </aside>
    </Chrome>
  );
}

function modPow(base: number, exp: number, mod: number) {
  let result = 1, b = ((base % mod) + mod) % mod, e = exp;
  while (e > 0) {
    if (e % 2 === 1) result = (result * b) % mod;
    b = (b * b) % mod;
    e = Math.floor(e / 2);
  }
  return result;
}

function modInverse(a: number, m: number) {
  let [oldR, r] = [((a % m) + m) % m, m];
  let [oldS, s] = [1, 0];
  while (r !== 0) {
    const q = Math.floor(oldR / r);
    [oldR, r] = [r, oldR - q * r];
    [oldS, s] = [s, oldS - q * s];
  }
  return oldR === 1 ? ((oldS % m) + m) % m : 1;
}

function CryptoLab({ page }: { page: StudioMockupPage }) {
  const [p, setP] = useState(61);
  const [q, setQ] = useState(53);
  const [e, setE] = useState(17);
  const [m, setM] = useState(72);
  const n = p * q;
  const phi = (p - 1) * (q - 1);
  const d = modInverse(e, phi);
  const c = modPow(m, e, n);
  const recovered = modPow(c, d, n);
  return (
    <Chrome page={page}>
      <Panel title="1. Key generation (RSA concept)">
        <SliderRow label="Prime p" value={p} min={11} max={97} step={2} onChange={setP} />
        <SliderRow label="Prime q" value={q} min={11} max={97} step={2} onChange={setQ} />
        <SliderRow label="Public exponent e" value={e} min={3} max={19} step={2} onChange={setE} />
        <SliderRow label="Plaintext m" value={m} min={2} max={200} step={1} onChange={setM} />
        <p className="msk-note">Educational keys only — no real secrets.</p>
      </Panel>
      <section className="msk-panel msk-canvas">
        <svg className="msk-graph" viewBox="0 0 360 220" role="img" aria-label="Modular exponentiation clock">
          <rect width="360" height="220" fill="#f8fbff" />
          <circle cx="180" cy="110" r="78" fill="none" stroke="#147df2" />
          {Array.from({ length: 8 }, (_, i) => {
            const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={180 + Math.cos(a) * 78} cy={110 + Math.sin(a) * 78} r="4" fill={i === 3 ? "#f59e0b" : "#8b45f4"} />;
          })}
          <text x="150" y="114" fontSize="12">mᵉ mod n</text>
        </svg>
        <p className="msk-formula">plaintext m={m} → c = mᵉ mod n = {c} → recovered m = cᵈ mod n = {recovered}</p>
      </section>
      <aside className="msk-panel msk-live">
        <LiveRow color="#147df2" label="n = p × q" value={String(n)} />
        <LiveRow color="#8b45f4" label="φ(n)" value={String(phi)} />
        <LiveRow color="#08b9dd" label="Public (e, n)" value={`(${e}, ${n})`} />
        <LiveRow color="#f59e0b" label="Ciphertext c" value={String(c)} />
        <LiveRow color="#10b981" label="Decrypt check" value={recovered === m ? "m recovered" : "check primes"} />
        <p className="msk-note">RSA security is the difficulty of factoring n = p q.</p>
        <ChallengeBox {...page.challenge} />
      </aside>
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
import { useEffect, useMemo, useState, type PointerEvent, type ReactNode } from "react";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { ExtraFrame, StatusOk, clamp, fmt } from "../mockup/studioLabKit";
import { LinearAlgebraLabChrome } from "./LinearAlgebraLabChrome";
import VectorSpacesLab from "./VectorSpacesLab";
import { BracketMatrix, Card, LinearLabHeader, SliderRow, Switch } from "./linearAlgebraUi";
import {
  ArrowDefs, AxisGrid, DragHandle, VectorRay, canvasKeyNudge, LA_A, LA_B, LA_C, LA_D, LA_E,
} from "./linearAlgebraCanvas";
import {
  addMatrices, apply2, apply3, classifySystem, det2, det3, eigen2, identity2, inv2, iso3, lerp,
  multiply, namedTransform, phaseTrajectories, resizeMatrix, setCell, solve2,
  rrefAugmented, type Mat2,
} from "./linearAlgebraLabMath";
import { markLinearComplete } from "./linearAlgebraStudioSession";

export default function LinearAlgebraLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  switch (page.id) {
    case "vectors": return <VectorsLab page={page} extra={extra} />;
    case "matrices": return <MatricesLab page={page} />;
    case "row-reduction": return <RowReductionLab page={page} />;
    case "linear-transforms": return <LinearTransformsLab page={page} extra={extra} />;
    case "determinants": return <DeterminantsLab page={page} />;
    case "vector-spaces": return <VectorSpacesLab page={page} />;
    case "eigenvectors": return <EigenLab page={page} extra={extra} />;
    case "orthogonality": return <OrthoLab page={page} />;
    case "least-squares": return <LeastSquaresLab page={page} />;
    case "playground": return <PlaygroundLab page={page} extra={extra} />;
    default: return null;
  }
}

function Stepper({
  label, value, min, max, step = 0.1, onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number; onChange: (n: number) => void;
}) {
  return (
    <div className="la-step">
      <span>{label}</span>
      <button type="button" aria-label={`Decrease ${label}`} onClick={() => onChange(clamp(value - step, min, max))}>−</button>
      <input type="number" aria-label={label} min={min} max={max} step={step} value={value} onChange={(event) => onChange(clamp(Number(event.target.value), min, max))} />
      <button type="button" aria-label={`Increase ${label}`} onClick={() => onChange(clamp(value + step, min, max))}>+</button>
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="la-toggle">
      <span>{label}</span>
      <input type="checkbox" checked={on} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function Sheet({
  matrix, onChange, rowLabels = true,
}: {
  matrix: number[][];
  onChange?: (r: number, c: number, v: number) => void;
  rowLabels?: boolean;
}) {
  const cols = matrix[0]?.length ?? 0;
  return (
    <table className="la-sheet">
      <thead>
        <tr>
          {rowLabels ? <th /> : null}
          {Array.from({ length: cols }, (_, c) => <th key={c}>c{c + 1}</th>)}
        </tr>
      </thead>
      <tbody>
        {matrix.map((row, r) => (
          <tr key={r}>
            {rowLabels ? <th className="is-r">r{r + 1}</th> : null}
            {row.map((cell, c) => (
              <td key={c} className={c === 0 ? "is-c1" : c === 1 ? "is-c2" : "is-c3"}>
                {onChange ? (
                  <input type="number" step={0.1} value={cell} aria-label={`r${r + 1} c${c + 1}`} onChange={(event) => onChange(r, c, Number(event.target.value))} />
                ) : (
                  <output>{fmt(cell, 2)}</output>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Bar({ color, label, value, max = 8 }: { color: string; label: string; value: number; max?: number }) {
  return (
    <div className="la-bar">
      <span>{label}</span>
      <i><b style={{ width: `${clamp((Math.abs(value) / max) * 100, 0, 100)}%`, background: color }} /></i>
      <output>{fmt(value, 3)}</output>
    </div>
  );
}

function poly(M: Mat2, ox: number, oy: number, u: number) {
  return [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => apply2(M, x, y)).map(([x, y]) => `${ox + x * u},${oy - y * u}`).join(" ");
}

function transposeAny(M: number[][]) {
  const cols = M[0]?.length ?? 0;
  return Array.from({ length: cols }, (_, c) => M.map((row) => row[c] ?? 0));
}

function mag3(v: number[]) {
  return Math.hypot(v[0] ?? 0, v[1] ?? 0, v[2] ?? 0);
}

function dot3(a: number[], b: number[]) {
  return (a[0] ?? 0) * (b[0] ?? 0) + (a[1] ?? 0) * (b[1] ?? 0) + (a[2] ?? 0) * (b[2] ?? 0);
}

function cross3(a: number[], b: number[]): [number, number, number] {
  return [
    (a[1] ?? 0) * (b[2] ?? 0) - (a[2] ?? 0) * (b[1] ?? 0),
    (a[2] ?? 0) * (b[0] ?? 0) - (a[0] ?? 0) * (b[2] ?? 0),
    (a[0] ?? 0) * (b[1] ?? 0) - (a[1] ?? 0) * (b[0] ?? 0),
  ];
}

function scale3(a: number[], s: number): [number, number, number] {
  return [(a[0] ?? 0) * s, (a[1] ?? 0) * s, (a[2] ?? 0) * s];
}

function sub3(a: number[], b: number[]): [number, number, number] {
  return [(a[0] ?? 0) - (b[0] ?? 0), (a[1] ?? 0) - (b[1] ?? 0), (a[2] ?? 0) - (b[2] ?? 0)];
}

const vecInit = { ax: 2, ay: 1, az: 3, bx: -1, by: 2, bz: 1, yaw: 0.42 };

function VectorsLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [s, setS] = useState(vecInit);
  const [view, setView] = useState<"2D" | "3D">("3D");
  const [op, setOp] = useState("Dot");
  const [show, setShow] = useState({ para: true, result: true, components: true, angle: true });
  const [selected, setSelected] = useState<"a" | "b">("a");
  const a = [s.ax, s.ay, s.az];
  const b = [s.bx, s.by, s.bz];
  const r = [s.ax + s.bx, s.ay + s.by, s.az + s.bz];
  const dot = dot3(a, b);
  const cross = cross3(a, b);
  const angle = Math.acos(clamp(dot / (mag3(a) * mag3(b) || 1), -1, 1)) * 180 / Math.PI;
  const projAonB = scale3(b, mag3(b) ? dot / mag3(b) ** 2 : 0);
  const projBonA = scale3(a, mag3(a) ? dot / mag3(a) ** 2 : 0);
  const ox = 210, oy = 250, u = 42;
  const p = (x: number, y: number, z: number) => view === "3D" ? iso3(x, y, z, ox, oy, u, s.yaw) : { x: ox + x * u, y: oy - y * u };
  const o = p(0, 0, 0);
  const pa = p(s.ax, s.ay, s.az);
  const pb = p(s.bx, s.by, s.bz);
  const pr = p(r[0] ?? 0, r[1] ?? 0, r[2] ?? 0);
  const pab = p(s.ax + s.bx, s.ay + s.by, s.az);
  const commitSel = (dx: number, dy: number) => {
    if (selected === "a") setS((prev) => ({ ...prev, ax: clamp(prev.ax + dx, -4, 4), ay: clamp(prev.ay + dy, -4, 4) }));
    else setS((prev) => ({ ...prev, bx: clamp(prev.bx + dx, -4, 4), by: clamp(prev.by + dy, -4, 4) }));
  };

  return (
    <LinearAlgebraLabChrome page={page}>
      {(mode) => (
        <>
          <div className="la-rail">
            <Card title="Vectors">
              <div className="la-vec">
                <strong style={{ color: LA_A }}>a = ({fmt(s.ax, 0)}, {fmt(s.ay, 0)}, {fmt(s.az, 0)})</strong>
                <div className="la-steppers">
                  <Stepper label="x" value={s.ax} min={-4} max={4} onChange={(ax) => setS({ ...s, ax })} />
                  <Stepper label="y" value={s.ay} min={-4} max={4} onChange={(ay) => setS({ ...s, ay })} />
                  <Stepper label="z" value={s.az} min={-4} max={4} onChange={(az) => setS({ ...s, az })} />
                </div>
              </div>
              <div className="la-vec">
                <strong style={{ color: LA_B }}>b = ({fmt(s.bx, 0)}, {fmt(s.by, 0)}, {fmt(s.bz, 0)})</strong>
                <div className="la-steppers">
                  <Stepper label="x" value={s.bx} min={-4} max={4} onChange={(bx) => setS({ ...s, bx })} />
                  <Stepper label="y" value={s.by} min={-4} max={4} onChange={(by) => setS({ ...s, by })} />
                  <Stepper label="z" value={s.bz} min={-4} max={4} onChange={(bz) => setS({ ...s, bz })} />
                </div>
              </div>
              <Switch label="Show components" on={show.components} onChange={(components) => setShow({ ...show, components })} />
            </Card>
            <Card title="Operations">
              <div className="la-ops">
                {["Dot", "Cross", "Projections", "Add", "Subtract", "Scale"].map((item) => (
                  <button key={item} type="button" className={item === op || item === mode ? "active" : ""} onClick={() => setOp(item)}>{item}</button>
                ))}
              </div>
            </Card>
            <Card title="Resultant">
              <p className="la-eq">r = a + b = ({fmt(r[0] ?? 0, 0)}, {fmt(r[1] ?? 0, 0)}, {fmt(r[2] ?? 0, 0)})</p>
            </Card>
            <Card title="Display options">
              <Toggle label="Parallelogram (a, b)" on={show.para} onChange={(para) => setShow({ ...show, para })} />
              <Toggle label="Resultant vector r" on={show.result} onChange={(result) => setShow({ ...show, result })} />
              <Toggle label="Component projections" on={show.components} onChange={(components) => setShow({ ...show, components })} />
              <Toggle label="Angle between a and b" on={show.angle} onChange={(angleOn) => setShow({ ...show, angle: angleOn })} />
              <button type="button" className="la-soft" onClick={() => setS(vecInit)}>Reset all</button>
            </Card>
          </div>
          <div className="la-center">
          <Card className="la-viz" title={`${view} vector space`}>
              <div className="la-canvas-tools">
                <button type="button" className={view === "3D" ? "active" : ""} onClick={() => setView("3D")}>3D</button>
                <button type="button" className={view === "2D" ? "active" : ""} onClick={() => setView("2D")}>2D</button>
              </div>
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <svg
                  className="msk-graph is-interactive"
                  viewBox="0 0 520 360"
                  tabIndex={0}
                  role="img"
                  aria-label="Vectors canvas"
                  onKeyDown={(event) => canvasKeyNudge(event, commitSel)}
                  onPointerDown={(event: PointerEvent<SVGSVGElement>) => {
                    const box = event.currentTarget.getBoundingClientRect();
                    const x = ((event.clientX - box.left) / box.width) * 520;
                    const y = ((event.clientY - box.top) / box.height) * 360;
                    setSelected(Math.hypot(x - pa.x, y - pa.y) < Math.hypot(x - pb.x, y - pb.y) ? "a" : "b");
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                  onPointerMove={(event) => {
                    if (event.buttons === 0) return;
                    const box = event.currentTarget.getBoundingClientRect();
                    const x = ((event.clientX - box.left) / box.width) * 520;
                    const y = ((event.clientY - box.top) / box.height) * 360;
                    const dx = (x - o.x) / u;
                    const dy = (o.y - y) / u;
                    if (selected === "a") setS((prev) => ({ ...prev, ax: clamp(dx, -4, 4), ay: clamp(dy, -4, 4) }));
                    else setS((prev) => ({ ...prev, bx: clamp(dx, -4, 4), by: clamp(dy, -4, 4) }));
                  }}
                >
                  <rect width="520" height="360" fill="#f7fbff" />
                  <ArrowDefs />
                  {view === "3D" ? (
                    <>
                      <VectorRay x1={o.x} y1={o.y} x2={p(3.2, 0, 0).x} y2={p(3.2, 0, 0).y} color="#94a3b8" marker="la-c" />
                      <VectorRay x1={o.x} y1={o.y} x2={p(0, 4, 0).x} y2={p(0, 4, 0).y} color="#94a3b8" marker="la-c" />
                      <VectorRay x1={o.x} y1={o.y} x2={p(0, 0, 3).x} y2={p(0, 0, 3).y} color="#94a3b8" marker="la-c" />
                      <text x={p(3.2, 0, 0).x} y={p(3.2, 0, 0).y + 12} fontSize="11" fill="#64748b">x</text>
                      <text x={p(0, 4, 0).x - 8} y={p(0, 4, 0).y - 6} fontSize="11" fill="#64748b">z</text>
                      <text x={p(0, 0, 3).x + 8} y={p(0, 0, 3).y + 12} fontSize="11" fill="#64748b">y</text>
                    </>
                  ) : <AxisGrid ox={ox} oy={oy} unit={u} dark={false} />}
                  {show.para ? <polygon points={`${o.x},${o.y} ${pa.x},${pa.y} ${pr.x},${pr.y} ${pb.x},${pb.y}`} fill="rgba(245,158,11,.18)" stroke={LA_C} /> : null}
                  <VectorRay x1={o.x} y1={o.y} x2={pa.x} y2={pa.y} color={LA_A} marker="la-a" />
                  <VectorRay x1={o.x} y1={o.y} x2={pb.x} y2={pb.y} color={LA_B} marker="la-b" />
                  {show.result ? <VectorRay x1={o.x} y1={o.y} x2={pr.x} y2={pr.y} color={LA_C} marker="la-c" /> : null}
                  {show.components ? <VectorRay x1={o.x} y1={o.y} x2={pab.x} y2={pab.y} color={LA_E} dashed marker="la-e" /> : null}
                  <DragHandle x={pa.x} y={pa.y} fill={LA_A} label={`a = (${fmt(s.ax, 0)}, ${fmt(s.ay, 0)}, ${fmt(s.az, 0)})`} selected={selected === "a"} />
                  <DragHandle x={pb.x} y={pb.y} fill={LA_B} label={`b = (${fmt(s.bx, 0)}, ${fmt(s.by, 0)}, ${fmt(s.bz, 0)})`} selected={selected === "b"} />
                  {show.angle ? <text x={(pa.x + pb.x) / 2} y={(pa.y + pb.y) / 2} fontSize="12" fill={LA_C}>θ = {fmt(angle, 1)}°</text> : null}
                </svg>
              )}
            />
            <div className="la-legend-row">
              <span>a</span><span>b</span><span>r = a + b</span><span>a proj</span><span>b proj</span>
            </div>
          </Card>
          </div>
          <div className="la-rail">
            <Card title="Quick facts">
              <Bar color={LA_A} label="|a|" value={mag3(a)} />
              <Bar color={LA_B} label="|b|" value={mag3(b)} />
              <Bar color={LA_C} label="|r|" value={mag3(r)} />
              <Bar color={LA_E} label="θ" value={angle} max={180} />
            </Card>
            <Card title="Dot product">
              <p className="la-eq">a · b = {fmt(dot, 3)}</p>
              <p className="la-note">= |a||b| cos θ</p>
            </Card>
            <Card title="Cross product">
              <p className="la-eq">a × b = [{fmt(cross[0], 0)}, {fmt(cross[1], 0)}, {fmt(cross[2], 0)}]</p>
              <p className="la-eq">|a × b| = {fmt(mag3(cross), 3)}</p>
            </Card>
            <Card title="Projections">
              <p className="la-eq">proj<sub>a</sub> b = ({fmt(projBonA[0], 3)}, {fmt(projBonA[1], 3)}, {fmt(projBonA[2], 3)})</p>
              <p className="la-eq">proj<sub>b</sub> a = ({fmt(projAonB[0], 3)}, {fmt(projAonB[1], 3)}, {fmt(projAonB[2], 3)})</p>
            </Card>
            <Card title="Geometry">
              <p className="la-eq">Parallelogram area |a × b| = {fmt(mag3(cross), 3)}</p>
              <p className="la-eq">Volume with i, j, k = {fmt(mag3(cross), 3)}</p>
            </Card>
            <Card title="Validation">
              <StatusOk>All computations are consistent. Vectors are in R³.</StatusOk>
            </Card>
          </div>
        </>
      )}
    </LinearAlgebraLabChrome>
  );
}

function MatricesLab({ page }: { page: StudioMockupPage }) {
  const [A, setA] = useState([[1, 2, -1], [0, 3, 4]]);
  const [B, setB] = useState([[2, 1], [0, -1], [3, 2]]);
  const ops = ["Multiply", "Add", "Inverse", "Transpose", "Block"];
  const product = multiply(A, B);
  const sum = addMatrices(A, resizeMatrix(B, A.length, A[0]?.length ?? 0));
  const At = transposeAny(A);
  const inv = A.length === 2 && (A[0]?.length ?? 0) === 2 ? inv2([[A[0]?.[0] ?? 0, A[0]?.[1] ?? 0], [A[1]?.[0] ?? 0, A[1]?.[1] ?? 0]]) : null;
  const da = A.length === 2 && (A[0]?.length ?? 0) === 2 ? det2([[A[0]?.[0] ?? 0, A[0]?.[1] ?? 0], [A[1]?.[0] ?? 0, A[1]?.[1] ?? 0]]) : null;
  const db = B.length === 2 && (B[0]?.length ?? 0) === 2 ? det2([[B[0]?.[0] ?? 0, B[0]?.[1] ?? 0], [B[1]?.[0] ?? 0, B[1]?.[1] ?? 0]]) : null;
  const MA: Mat2 = [[A[0]?.[0] ?? 1, A[0]?.[1] ?? 0], [A[1]?.[0] ?? 0, A[1]?.[1] ?? 1]];
  const MB: Mat2 = [[B[0]?.[0] ?? 1, B[0]?.[1] ?? 0], [B[1]?.[0] ?? 0, B[1]?.[1] ?? 1]];
  const MC = multiply(MA, MB) as Mat2 | null;
  const C = product ?? sum ?? At;
  const compatible = Boolean(product);

  return (
    <LinearAlgebraLabChrome page={page}>
      {(mode, setMode) => {
        const shown = mode === "Add" ? sum : mode === "Transpose" ? At : mode === "Inverse" ? inv : C;
        return (
          <>
            <div className="la-rail">
              <Card>
                <nav className="la-opbar" aria-label="Matrix operations">
                  {ops.map((item) => (
                    <button key={item} type="button" className={item === mode ? "active" : ""} onClick={() => setMode(item)}>{item}</button>
                  ))}
                </nav>
                <p className="la-kicker">Operation: A × B</p>
                <h2>Matrix A (m × n) <small>{A.length} × {A[0]?.length ?? 0}</small></h2>
                <Sheet matrix={A} onChange={(r, c, v) => setA(setCell(A, r, c, v))} />
                <h2>Matrix B (n × p) <small>{B.length} × {B[0]?.length ?? 0}</small></h2>
                <Sheet matrix={B} onChange={(r, c, v) => setB(setCell(B, r, c, v))} />
                <button type="button" className="la-compute" onClick={() => markLinearComplete(page.id)}>Compute A × B</button>
                <Switch label="Animate computation" on={false} onChange={() => undefined} />
              </Card>
            </div>
            <div className="la-center">
            <Card className="la-viz" title="Geometric preview: A × B">
              <svg className="msk-graph" viewBox="0 0 520 360" role="img" aria-label="Unit square through A then B">
                <rect width="520" height="360" fill="#f7fbff" />
                <ArrowDefs />
                <AxisGrid ox={280} oy={250} unit={38} dark={false} />
                <polygon points="48,250 96,250 96,202 48,202" fill="none" stroke="#38bdf8" strokeDasharray="5 4" />
                <text x="40" y="190" fontSize="11" fill="#64748b">Unit square before</text>
                <polygon points={poly([[1, 0.2], [0.15, 1.1]], 150, 250, 42)} fill="rgba(16,185,129,.2)" stroke={LA_D} />
                <text x="158" y="148" fontSize="12" fill={LA_D}>After A</text>
                <polygon points={poly(MC ?? MA, 290, 250, 48)} fill="rgba(139,69,244,.22)" stroke={LA_B} />
                <text x="340" y="118" fontSize="12" fill={LA_B}>After A × B</text>
                <path d="M102 226 L142 226" stroke="#94a3b8" markerEnd="url(#la-c)" />
                <path d="M232 226 L278 226" stroke="#94a3b8" markerEnd="url(#la-c)" />
              </svg>
              <p className="la-eq">Det(A) = {da == null ? "—" : fmt(da, 2)} · Det(B) = {db == null ? "—" : fmt(db, 2)} · Det(A × B) = {MC ? fmt(det2(MC), 2) : "—"}</p>
            </Card>
            </div>
            <div className="la-rail">
            <Card title="Dimensions & Compatibility" kicker={compatible ? "Compatible" : "Incompatible"}>
              <p className="la-eq">A: {A.length} × {A[0]?.length ?? 0} · B: {B.length} × {B[0]?.length ?? 0} → A × B: {product ? `${product.length} × ${product[0]?.length ?? 0}` : "—"}</p>
              <h2>Result C = A × B <small>{shown ? `${shown.length} × ${shown[0]?.length ?? 0}` : ""}</small></h2>
              {shown ? <Sheet matrix={shown} /> : <p className="la-note">Resize so inner dimensions match.</p>}
            </Card>
            <Card title="Computation (dot-product view)">
              {(product?.[0] ?? []).map((cell, j) => (
                <p key={j} className="la-eq">c<sub>1{j + 1}</sub> = A × b<sub>{j + 1}</sub> = {fmt(cell, 2)}</p>
              ))}
            </Card>
            <Card title="Operation Explanation">
              <p className="la-note">Matrix multiplication transforms the columns of B through the linear transformation defined by A. Each entry c<sub>ij</sub> is the dot product of row i of A and column j of B.</p>
              <StatusOk>Result verified</StatusOk>
            </Card>
            </div>
          </>
        );
      }}
    </LinearAlgebraLabChrome>
  );
}

function RowReductionLab({ page }: { page: StudioMockupPage }) {
  const [A, setA] = useState([[1, 2, -1], [0, 1, 1], [2, -1, 1]]);
  const [b, setB] = useState([3, 2, 1]);
  const [cursor, setCursor] = useState(3);
  const [exact, setExact] = useState(true);
  const steps = useMemo(() => rrefAugmented(A, b), [A, b]);
  const cls = classifySystem(A, b);
  const shown = steps[clamp(cursor, 0, steps.length - 1)] ?? steps[0]!;
  const last = steps[steps.length - 1]?.matrix ?? [];
  const sol = last.map((row) => row[row.length - 1] ?? 0);
  const viewMode = (mode: string) => mode;

  return (
    <LinearAlgebraLabChrome page={page} wide>
      {(mode, setMode) => (
        <>
          <div className="la-rail">
          <Card title="Augmented matrix [A | b]">
            <table className="la-sheet">
              <tbody>
                {A.map((row, r) => (
                  <tr key={r}>
                    {row.map((cell, c) => (
                      <td key={c} className={c === 2 ? "is-c3" : c === 1 ? "is-c2" : "is-c1"}>
                        <input type="number" step={0.1} value={cell} aria-label={`a${r + 1}${c + 1}`} onChange={(event) => setA(setCell(A, r, c, Number(event.target.value)))} />
                      </td>
                    ))}
                    <td className="is-r">
                      <input type="number" step={0.1} value={b[r]} aria-label={`b${r + 1}`} onChange={(event) => setB(b.map((v, i) => (i === r ? Number(event.target.value) : v)))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Switch label="Exact" on={exact} onChange={setExact} />
            <h2>Row operations</h2>
            <div className="la-ops">
              <button type="button" onClick={() => { const next = A.map((row) => row.slice()); const swap = next[0]!; next[0] = next[1]!; next[1] = swap; setA(next); const nb = [...b]; const t = nb[0]!; nb[0] = nb[1]!; nb[1] = t; setB(nb); }}>Swap</button>
              <button type="button" onClick={() => setA(A.map((row, i) => i === 0 ? row.map((v) => v * 0.5) : row))}>Scale</button>
              <button type="button" className="active">Add</button>
              <button type="button" onClick={() => setA(setCell(A, 2, 0, 0))}>Zero</button>
            </div>
            <button type="button" className="la-compute" onClick={() => setCursor(steps.length - 1)}>Apply operation</button>
          </Card>
          </div>
          <div className="la-center">
          <Card className="la-viz" title={viewMode(mode) === "2D View" ? "2D View" : viewMode(mode) === "Pivot Map" ? "Pivot Map" : "3D Visualization"}>
              <div className="la-canvas-tools">
                {["3D View", "2D View", "Pivot Map"].map((item) => (
                  <button key={item} type="button" className={item === mode ? "active" : ""} onClick={() => setMode(item)}>{item}</button>
                ))}
              </div>
            <svg className="msk-graph" viewBox="0 0 560 340" role="img" aria-label="Planes">
              <rect width="560" height="340" fill="#f7fbff" />
              {mode === "Pivot Map" ? (
                <>
                  <rect x="80" y="70" width="90" height="60" fill="#fde68a" />
                  <rect x="190" y="150" width="90" height="60" fill="#bbf7d0" />
                  <rect x="300" y="230" width="90" height="60" fill="#ddd6fe" />
                  <text x="90" y="105">pivot 1</text>
                  <text x="200" y="185">pivot 2</text>
                  <text x="310" y="265">pivot 3</text>
                </>
              ) : mode === "2D View" ? (
                <>
                  <line x1="40" y1="80" x2="520" y2="240" stroke={LA_A} />
                  <line x1="40" y1="220" x2="520" y2="90" stroke={LA_B} />
                  <circle cx="280" cy="160" r="6" fill={LA_C} />
                </>
              ) : (
                <>
                  <polygon points="80,240 280,80 500,160 300,300" fill="rgba(20,125,242,.28)" stroke={LA_A} />
                  <polygon points="90,80 470,70 480,250 120,270" fill="rgba(139,69,244,.22)" stroke={LA_B} />
                  <line x1="140" y1="250" x2="430" y2="90" stroke={LA_C} strokeWidth="3" />
                  <circle cx="280" cy="170" r="7" fill={LA_C} />
                </>
              )}
            </svg>
            <p className="la-eq">Step {clamp(cursor + 1, 1, steps.length)} of {steps.length} · {shown.label}</p>
            <div className="la-canvas-tools">
              <button type="button" onClick={() => setCursor((v) => Math.max(0, v - 1))}>Previous</button>
              <button type="button" className="active" onClick={() => setCursor((v) => Math.min(steps.length - 1, v + 1))}>Next</button>
            </div>
          </Card>
          </div>
          <div className="la-rail">
          <Card title="System summary">
            <p className="la-eq">Rank(A) = {cls.rankA}</p>
            <p className="la-eq">Rank([A|b]) = {cls.rankAb}</p>
            <p className="la-eq"># Variables = {A[0]?.length ?? 0}</p>
            <p className="la-eq"># Free variables = {Math.max(0, (A[0]?.length ?? 0) - cls.rankA)}</p>
            <span className={`la-badge${cls.kind === "unique" ? "" : " is-warn"}`}>{cls.kind === "unique" ? "Unique solution" : cls.kind === "infinite" ? "Infinitely many" : "Inconsistent"}</span>
            <div className="la-fold">
              <h3>Solution</h3>
              {sol.map((v, i) => <p key={i} className="la-eq">x{i + 1} = {exact ? fmt(v, 3) : fmt(v, 2)}</p>)}
            </div>
            <div className="la-fold">
              <h3>Geometric interpretation</h3>
              <p className="la-note">{cls.kind === "unique" ? "Three planes intersect at a single point in R³." : cls.kind === "infinite" ? "Planes intersect in a line." : "No common intersection."}</p>
            </div>
            <div className="la-fold">
              <h3>Step history</h3>
              <div className="la-history">
                {steps.map((step, i) => (
                  <button key={`${step.label}-${i}`} type="button" className={i === cursor ? "active" : ""} onClick={() => setCursor(i)}>
                    <span>{i + 1}. {step.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>
          </div>
          <section className="la-band">
            <h2>Auto-solve</h2>
            <button type="button" className="la-soft" onClick={() => setCursor(steps.length - 1)}>Run elimination</button>
            <div className="la-steps">
              {steps.slice(0, 6).map((step, i) => (
                <div key={`${step.label}-m-${i}`}>
                  <small>{i === 0 ? "Initial" : `Step ${i}`}</small>
                  <table>
                    <tbody>
                      {step.matrix.map((row, r) => (
                        <tr key={r}>{row.map((cell, c) => <td key={c}>{fmt(cell, 2)}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </LinearAlgebraLabChrome>
  );
}

function LinearTransformsLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [M, setM] = useState<Mat2>([[1.5, 0.5], [-1, 2]]);
  const [t, setT] = useState(0.65);
  const [shape, setShape] = useState<"custom" | "unit">("custom");
  const spec = eigen2(M);
  const Mt: Mat2 = [[lerp(1, M[0][0], t), lerp(0, M[0][1], t)], [lerp(0, M[1][0], t), lerp(1, M[1][1], t)]];
  const det = det2(M);
  const presets: Array<[string, Mat2]> = [["I", identity2()], ["R90", namedTransform("R90")], ["Sx", namedTransform("Scale X", 1.5)], ["Shear", namedTransform("Shear", 1.6)]];

  return (
    <LinearAlgebraLabChrome page={page}>
      {(mode, setMode) => (
        <>
          <div className="la-rail">
          <Card title="Transformation" kicker="2×2 Matrix A">
            <Sheet matrix={M} onChange={(r, c, v) => setM(setCell(M, r, c, v) as Mat2)} />
            <div className="la-ops">
              {presets.map(([name, mat]) => (
                <button key={name} type="button" className={JSON.stringify(mat) === JSON.stringify(M) ? "active" : ""} onClick={() => setM(mat)}>{name}</button>
              ))}
            </div>
            <h2>Apply to</h2>
            <Toggle label="Custom shape" on={shape === "custom"} onChange={(on) => setShape(on ? "custom" : "unit")} />
            <Toggle label="Unit square" on={shape === "unit"} onChange={(on) => setShape(on ? "unit" : "custom")} />
            <h2>Interpolation t = {fmt(t, 2)}</h2>
            <input type="range" min={0} max={1} step={0.01} value={t} aria-label="Interpolation" onChange={(event) => setT(Number(event.target.value))} />
            <h2>Composition</h2>
            <button type="button" className="la-soft" onClick={() => setM(namedTransform(mode.includes("R90") ? "R90" : "Shear"))}>Apply {mode}</button>
          </Card>
          </div>
          <div className="la-center">
          <Card className="la-viz" title="2D transformation view">
              <div className="la-canvas-tools">
                <button type="button" className={!mode.includes("3D") ? "active" : ""} onClick={() => setMode("2D")}>2D</button>
                <button type="button" className={mode.includes("3D") ? "active" : ""} onClick={() => setMode("3D")}>3D</button>
              </div>
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <svg className="msk-graph is-interactive" viewBox="0 0 560 420" role="img" aria-label="Linear transform">
                  <rect width="560" height="420" fill="#f7fbff" />
                  <ArrowDefs />
                  <AxisGrid ox={280} oy={220} unit={48} dark={false} />
                  {shape === "unit" ? (
                    <>
                      <polygon points={poly(identity2(), 280, 220, 48)} fill="rgba(20,125,242,.16)" stroke={LA_A} />
                      <polygon points={poly(Mt, 280, 220, 48)} fill="rgba(139,69,244,.2)" stroke={LA_B} />
                    </>
                  ) : (
                    <>
                      <polygon points={[[-1.2, 0.4], [-0.4, 2.1], [0.9, 2.6], [1.4, 0.9], [-0.2, -0.6]].map(([x, y]) => `${280 + x * 48},${220 - y * 48}`).join(" ")} fill="rgba(20,125,242,.16)" stroke={LA_A} />
                      <polygon points={[[-1.2, 0.4], [-0.4, 2.1], [0.9, 2.6], [1.4, 0.9], [-0.2, -0.6]].map(([x, y]) => { const [nx, ny] = apply2(Mt, x, y); return `${280 + nx * 48},${220 - ny * 48}`; }).join(" ")} fill="rgba(139,69,244,.2)" stroke={LA_B} />
                    </>
                  )}
                  <VectorRay x1={280} y1={220} x2={280 + Mt[0][0] * 48} y2={220 - Mt[1][0] * 48} color={LA_A} marker="la-a" />
                  <VectorRay x1={280} y1={220} x2={280 + Mt[0][1] * 48} y2={220 - Mt[1][1] * 48} color={LA_C} marker="la-c" />
                  <text x="40" y="400" fontSize="11">Original (t = 0) · Transformed (t = 1) · Current (t = {fmt(t, 2)})</text>
                </svg>
              )}
            />
            <div className="la-legend-row">
              <span>Original (t = 0)</span><span>Transformed (t = 1)</span><span>Current (t = {fmt(t, 2)})</span>
            </div>
          </Card>
          </div>
          <div className="la-rail">
          <Card title="Matrix A" kicker={Math.abs(det) < 1e-6 ? "Singular" : "Invertible"}>
            <p className="la-eq">det(A) = {fmt(det, 2)}</p>
            <p className="la-eq">Area scale = |det(A)| = {fmt(Math.abs(det), 2)}</p>
          </Card>
          <Card title="Mapped basis">
            <p className="la-eq">A e₁ = ({fmt(M[0][0], 2)}, {fmt(M[1][0], 2)})</p>
            <p className="la-eq">A e₂ = ({fmt(M[0][1], 2)}, {fmt(M[1][1], 2)})</p>
          </Card>
          <Card title="Eigen information">
            <p className="la-eq">λ₁ ≈ {spec.values[0] == null ? "complex" : fmt(spec.values[0], 3)} · λ₂ ≈ {spec.values[1] == null ? "complex" : fmt(spec.values[1], 3)}</p>
            <span className="la-badge is-info">{spec.complex ? "Not diagonalizable over R" : "Diagonalizable"}</span>
          </Card>
          <Card title="Geometric interpretation">
            <p className="la-note">A maps any vector x to Ax. Lengths change by stretching factors. The origin is fixed.</p>
          </Card>
          </div>
        </>
      )}
    </LinearAlgebraLabChrome>
  );
}

function DeterminantsLab({ page }: { page: StudioMockupPage }) {
  const [A, setA] = useState<Mat2>([[1, 2], [-1, 3]]);
  const [showUnit, setShowUnit] = useState(true);
  const det = det2(A);
  const v1 = apply2(A, 1, 0);
  const v2 = apply2(A, 0, 1);

  return (
    <LinearAlgebraLabChrome page={page} pills>
      {(mode) => (
        <>
          <div className="la-rail">
          <Card title="Matrix A" kicker="2 × 2">
            <Sheet matrix={A} onChange={(r, c, v) => setA(setCell(A, r, c, v) as Mat2)} />
            <h2>Basis vectors (columns of B)</h2>
            <p className="la-eq">v₁ = (1, 0) · v₂ = (0, 1)</p>
            <Switch label="Show unit square" on={showUnit} onChange={setShowUnit} />
            <Switch label="Grid" on onChange={() => undefined} />
            <button type="button" className="la-soft" onClick={() => setA([[1, 2], [-1, 3]])}>Reset</button>
          </Card>
          </div>
          <div className="la-center">
          <Card className="la-viz" title={mode === "3D Volume" ? "Transformed volume" : "Original basis B → Transformed basis AB"}>
            <svg className="msk-graph is-interactive" viewBox="0 0 640 360" role="img" aria-label="Determinant area">
              <rect width="640" height="360" fill="#f7fbff" />
              <ArrowDefs />
              <AxisGrid ox={180} oy={210} unit={36} dark={false} />
              <AxisGrid ox={430} oy={210} unit={36} dark={false} />
              {showUnit ? <polygon points={poly(identity2(), 180, 210, 36)} fill="rgba(20,125,242,.18)" stroke={LA_A} /> : null}
              <polygon points={poly(A, 430, 210, 36)} fill={det >= 0 ? "rgba(139,69,244,.2)" : "rgba(239,68,68,.2)"} stroke={LA_B} />
              <VectorRay x1={180} y1={210} x2={180 + 36} y2={210} color={LA_A} marker="la-a" />
              <VectorRay x1={180} y1={210} x2={180} y2={210 - 36} color={LA_C} marker="la-c" />
              <VectorRay x1={430} y1={210} x2={430 + v1[0] * 36} y2={210 - v1[1] * 36} color={LA_B} marker="la-b" />
              <VectorRay x1={430} y1={210} x2={430 + v2[0] * 36} y2={210 - v2[1] * 36} color={LA_C} marker="la-c" />
              <text x="150" y="44" fontSize="12" fill={LA_A}>Original basis B · det(B) = 1.000</text>
              <text x="390" y="44" fontSize="12" fill={LA_D}>Transformed basis AB · det(AB) = {fmt(det, 3)}</text>
              <text x="448" y="88" fontSize="13" fill={LA_B}>Area = {fmt(Math.abs(det), 3)}</text>
            </svg>
            <div className="la-kpis" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 10 }}>
              <div><small>Area (det B)</small><b>1.000</b></div>
              <div><small>Area scaling</small><b>× {fmt(Math.abs(det), 3)}</b></div>
              <div><small>Area (det AB)</small><b>{fmt(Math.abs(det), 3)}</b></div>
            </div>
          </Card>
          </div>
          <div className="la-rail">
          <Card title="Live calculations">
            <p className="la-eq">det(A) = ({fmt(A[0][0], 0)})({fmt(A[1][1], 0)}) − ({fmt(A[0][1], 0)})({fmt(A[1][0], 0)}) = {fmt(det, 3)}</p>
            <p className="la-eq">A v₁ = ({fmt(v1[0], 0)}, {fmt(v1[1], 0)}) · A v₂ = ({fmt(v2[0], 0)}, {fmt(v2[1], 0)})</p>
          </Card>
          <Card title="Geometric interpretation">
            <p className="la-note">|det(A)| = {fmt(Math.abs(det), 3)}. {det > 0 ? "Orientation is preserved (no flip)." : det < 0 ? "Orientation is reversed." : "The parallelogram collapses."}</p>
          </Card>
          </div>
        </>
      )}
    </LinearAlgebraLabChrome>
  );
}

function EigenLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const init: Mat2 = [[2, 1], [0, 3]];
  const [M, setM] = useState<Mat2>(init);
  const [show, setShow] = useState({ field: true, circle: true, eigen: true, axis: true, grid: true });
  const [steps, setSteps] = useState(2);
  const [k, setK] = useState(0);
  const [speed, setSpeed] = useState("1.0x");
  const [playing, setPlaying] = useState(false);
  const spec = eigen2(M);
  const det = det2(M);
  const trace = M[0][0] + M[1][1];
  const paths = phaseTrajectories(M);
  const e1 = spec.vectors[0] ?? [1, 0];
  const e2 = spec.vectors[1] ?? [0, 1];
  const n1 = mag3([e1[0], e1[1], 0]) || 1;
  const n2 = mag3([e2[0], e2[1], 0]) || 1;
  const u1: [number, number] = [e1[0] / n1, e1[1] / n1];
  const u2: [number, number] = [e2[0] / n2, e2[1] / n2];
  const mappedCircle = Array.from({ length: 72 }, (_, i) => {
    const t = (i / 72) * Math.PI * 2;
    return apply2(M, Math.cos(t), Math.sin(t));
  });
  useEffect(() => {
    if (!playing) return;
    const ms = speed === "2.0x" ? 80 : speed === "0.5x" ? 280 : 140;
    const id = window.setInterval(() => setK((v) => (v >= 6 ? 0 : v + 1)), ms);
    return () => window.clearInterval(id);
  }, [playing, speed]);

  const ox = 280, oy = 210, u = 48;

  return (
    <LinearAlgebraLabChrome
      page={page}
      header={<LinearLabHeader page={page} onReset={() => { setM(init); setK(0); setPlaying(false); }} onAnimate={() => setPlaying((v) => !v)} speed={speed} onSpeed={setSpeed} />}
    >
      {(mode, setMode) => (
        <>
          <div className="la-rail">
            <Card title="Matrix A" kicker="Edit the 2×2 matrix">
              <p className="la-eq">A = </p>
              <BracketMatrix matrix={M} />
              <SliderRow label="a (1,1)" value={M[0][0]} min={-5} max={5} onChange={(v) => setM([[v, M[0][1]], M[1]])} />
              <SliderRow label="b (1,2)" value={M[0][1]} min={-5} max={5} onChange={(v) => setM([[M[0][0], v], M[1]])} />
              <SliderRow label="c (2,1)" value={M[1][0]} min={-5} max={5} onChange={(v) => setM([M[0], [v, M[1][1]]])} />
              <SliderRow label="d (2,2)" value={M[1][1]} min={-5} max={5} onChange={(v) => setM([M[0], [M[1][0], v]])} />
            </Card>
            <Card title="Display options">
              <Switch label="Vector field" on={show.field} onChange={(field) => setShow({ ...show, field })} />
              <Switch label="Unit circle / ellipse" on={show.circle} onChange={(circle) => setShow({ ...show, circle })} />
              <Switch label="Eigenvectors" on={show.eigen} onChange={(eigen) => setShow({ ...show, eigen })} />
              <Switch label="Axis" on={show.axis} onChange={(axis) => setShow({ ...show, axis })} />
              <Switch label="Grid" on={show.grid} onChange={(grid) => setShow({ ...show, grid })} />
            </Card>
            <Card title="Transformation" kicker="Steps per cycle">
              <div className="la-seg">
                {[1, 2, 5, 10].map((n) => (
                  <button key={n} type="button" className={steps === n ? "active" : ""} onClick={() => setSteps(n)}>{n}</button>
                ))}
              </div>
              <button type="button" className="la-compute" onClick={() => setPlaying((v) => !v)}>{playing ? "Pause animation" : "Start animation"}</button>
            </Card>
          </div>
          <div className="la-center">
            <Card className="la-viz">
              <div className="la-canvas-tools" style={{ justifyContent: "center", marginBottom: 8 }}>
                {["2D View", "3D View", "Phase Portrait"].map((item) => (
                  <button key={item} type="button" className={item === mode ? "active" : ""} onClick={() => setMode(item)}>{item}</button>
                ))}
              </div>
              <ExtraFrame
                mode={mode}
                extra={extra}
                fallback={(
                  <svg className="msk-graph" viewBox="0 0 560 420" role="img" aria-label="Eigen view">
                    <rect width="560" height="420" fill="#f7fbff" />
                    <ArrowDefs />
                    {show.grid ? <AxisGrid ox={ox} oy={oy} unit={u} dark={false} /> : null}
                    {show.axis ? (
                      <>
                        <line x1="40" y1={oy} x2="520" y2={oy} stroke="#94a3b8" />
                        <line x1={ox} y1="20" x2={ox} y2="400" stroke="#94a3b8" />
                        <text x="528" y={oy + 4} fontSize="12" fill="#64748b">x</text>
                        <text x={ox + 6} y="16" fontSize="12" fill="#64748b">y</text>
                      </>
                    ) : null}
                    {show.field ? Array.from({ length: 17 }, (_, i) => Array.from({ length: 13 }, (_, j) => {
                      const x = -4 + i * 0.5;
                      const y = -3 + j * 0.5;
                      const [dx, dy] = apply2(M, x, y);
                      const L = Math.hypot(dx, dy) || 1;
                      const s = 10;
                      return <line key={`${i}-${j}`} x1={ox + x * u} y1={oy - y * u} x2={ox + x * u + (dx / L) * s} y2={oy - y * u - (dy / L) * s} stroke="#7dd3fc" strokeWidth="1.4" />;
                    })) : null}
                    {show.circle ? <circle cx={ox} cy={oy} r={u} fill="none" stroke="#38bdf8" strokeWidth="2" /> : null}
                    {mode === "Phase Portrait" ? paths.map((pts, i) => (
                      <polyline key={i} fill="none" stroke={LA_B} opacity="0.45" points={pts.map(([x, y]) => `${ox + x * 36},${oy - y * 36}`).join(" ")} />
                    )) : show.circle ? (
                      <polygon points={mappedCircle.map(([x, y]) => `${ox + x * u},${oy - y * u}`).join(" ")} fill="rgba(139,69,244,.16)" stroke={LA_B} strokeDasharray="6 4" />
                    ) : null}
                    {show.eigen ? (
                      <>
                        <line x1={ox - u1[0] * 180} y1={oy + u1[1] * 180} x2={ox + u1[0] * 180} y2={oy - u1[1] * 180} stroke={LA_D} strokeWidth="3" />
                        <line x1={ox - u2[0] * 180} y1={oy + u2[1] * 180} x2={ox + u2[0] * 180} y2={oy - u2[1] * 180} stroke={LA_C} strokeWidth="3" />
                        <circle cx={ox + u1[0] * u} cy={oy - u1[1] * u} r="5" fill={LA_D} />
                        <circle cx={ox + u2[0] * u * (spec.values[1] ?? 1)} cy={oy - u2[1] * u * (spec.values[1] ?? 1)} r="5" fill={LA_C} />
                        <text x={ox + u1[0] * 160} y={oy - u1[1] * 160 - 8} fill={LA_D} fontSize="12" fontWeight={800}>v₁</text>
                        <text x={ox + u2[0] * 150} y={oy - u2[1] * 150 - 8} fill={LA_C} fontSize="12" fontWeight={800}>v₂</text>
                      </>
                    ) : null}
                  </svg>
                )}
              />
              <div className="la-legend-row">
                <span>Unit circle</span>
                <span>Image of circle</span>
                <span>Eigenvector v₁</span>
                <span>Eigenvector v₂</span>
              </div>
            </Card>
            <Card title="Repeated transformation (Aᵏ)">
              <div className="la-ak">
                <span>k = {k}</span>
                <input type="range" min={0} max={6} step={1} value={k} aria-label="k" onChange={(event) => setK(Number(event.target.value))} />
              </div>
              <div className="la-thumbs">
                {[0, 1, 2, 3, 4, 5, 6].map((power) => {
                  const pts = Array.from({ length: 36 }, (_, i) => {
                    const t = (i / 36) * Math.PI * 2;
                    let x = Math.cos(t), y = Math.sin(t);
                    for (let p = 0; p < power; p += 1) {
                      const n = apply2(M, x, y);
                      x = n[0]; y = n[1];
                    }
                    return `${28 + x * 10},${28 - y * 10}`;
                  });
                  return <svg key={power} viewBox="0 0 56 56" aria-label={`A^${power}`}><polygon points={pts.join(" ")} fill="rgba(139,69,244,.15)" stroke={LA_B} /></svg>;
                })}
              </div>
            </Card>
          </div>
          <div className="la-rail">
            <Card title="Eigenvalues">
              <p className="la-eq" style={{ color: LA_D }}>λ₁ = {spec.values[0] == null ? "complex" : fmt(spec.values[0], 4)} (real)</p>
              <p className="la-eq" style={{ color: LA_C }}>λ₂ = {spec.values[1] == null ? "complex" : fmt(spec.values[1], 4)} (real)</p>
            </Card>
            <Card title="Eigenvectors (normalized)">
              <p className="la-eq">v₁ = ({fmt(u1[0], 4)}, {fmt(u1[1], 4)})</p>
              <p className="la-eq">v₂ = ({fmt(u2[0], 4)}, {fmt(u2[1], 4)})</p>
            </Card>
            <Card title="Characteristic polynomial">
              <p className="la-eq">p(λ) = det(A − λI) = λ² − {fmt(trace, 0)}λ + {fmt(det, 0)}</p>
              <p className="la-eq">= (λ − {fmt(spec.values[0] ?? 0, 0)})(λ − {fmt(spec.values[1] ?? 0, 0)})</p>
            </Card>
            <Card title="Stability classification">
              <span className={`la-badge${(spec.values[0] ?? 0) > 0 && (spec.values[1] ?? 0) > 0 ? " is-warn" : ""}`}>{(spec.values[0] ?? 0) > 0 && (spec.values[1] ?? 0) > 0 ? "UNSTABLE (NODE)" : "Check signs"}</span>
              <p className="la-note">All eigenvalues are real and positive. Trajectories diverge from the origin along invariant directions.</p>
            </Card>
            <Card title="Geometric interpretation">
              <p className="la-note">Eigenvectors are invariant directions. A v₁ = {fmt(spec.values[0] ?? 0, 0)} v₁. Vectors not on eigenvectors are sheared toward v₂ and stretched.</p>
            </Card>
            <Card title="Quick checks">
              <p className="la-eq">det(A) = {fmt(det, 4)} · trace(A) = {fmt(trace, 4)}</p>
            </Card>
          </div>
        </>
      )}
    </LinearAlgebraLabChrome>
  );
}

function OrthoLab({ page }: { page: StudioMockupPage }) {
  const [v, setV] = useState<[number, number, number]>([2, 1, 2]);
  const [u, setU] = useState<[number, number, number]>([1, 2, 0]);
  const [n, setN] = useState<[number, number, number]>([1, 1, 1]);
  const [step, setStep] = useState(1);
  const pu = mag3(u) ? scale3(u, dot3(v, u) / mag3(u) ** 2) : [0, 0, 0];
  const ru = sub3(v, pu);
  const pn = mag3(n) ? sub3(v, scale3(n, dot3(v, n) / mag3(n) ** 2)) : v;
  const ox = 250, oy = 230, un = 48;
  const p = (vec: number[]) => iso3(vec[0] ?? 0, vec[1] ?? 0, vec[2] ?? 0, ox, oy, un, 0.45);
  const o = p([0, 0, 0]);
  const u1m = mag3(v) || 1;
  const u1 = scale3(v, 1 / u1m);
  const w2 = sub3(u, scale3(u1, dot3(u, u1)));
  const u2 = scale3(w2, 1 / (mag3(w2) || 1));
  const w3 = sub3(sub3(n, scale3(u1, dot3(n, u1))), scale3(u2, dot3(n, u2)));
  const u3 = scale3(w3, 1 / (mag3(w3) || 1));

  return (
    <LinearAlgebraLabChrome page={page}>
      {(mode, setMode) => (
        <>
          <div className="la-rail">
          <Card title="Inputs">
            <p className="la-eq">v ({fmt(v[0], 0)}, {fmt(v[1], 0)}, {fmt(v[2], 0)})</p>
            <Stepper label="vx" value={v[0]} min={-4} max={4} onChange={(x) => setV([x, v[1], v[2]])} />
            <p className="la-eq">u ({fmt(u[0], 0)}, {fmt(u[1], 0)}, {fmt(u[2], 0)})</p>
            <Stepper label="ux" value={u[0]} min={-4} max={4} onChange={(x) => setU([x, u[1], u[2]])} />
            <p className="la-eq">n ({fmt(n[0], 0)}, {fmt(n[1], 0)}, {fmt(n[2], 0)})</p>
            <Stepper label="nx" value={n[0]} min={-4} max={4} onChange={(x) => setN([x, n[1], n[2]])} />
            <h2>Gram–Schmidt (from v, u, n)</h2>
            <Stepper label="Step" value={step} min={1} max={3} step={1} onChange={setStep} />
          </Card>
          </div>
          <div className="la-center">
          <Card className="la-viz" title="Orthogonal projection of v onto line span(u) and plane n · x = 0">
              <div className="la-canvas-tools">
                {["3D View", "Vector Decomp", "2D Projections"].map((item) => (
                  <button key={item} type="button" className={item === mode ? "active" : ""} onClick={() => setMode(item)}>{item}</button>
                ))}
              </div>
            <svg className="msk-graph" viewBox="0 0 520 360" role="img" aria-label="Orthogonality">
              <rect width="520" height="360" fill="#f7fbff" />
              <ArrowDefs />
              <polygon points={`${p([-2, 0, -2]).x},${p([-2, 0, -2]).y} ${p([2, 0, -2]).x},${p([2, 0, -2]).y} ${p([2, 0, 2]).x},${p([2, 0, 2]).y} ${p([-2, 0, 2]).x},${p([-2, 0, 2]).y}`} fill="rgba(139,69,244,.12)" />
              <VectorRay x1={o.x} y1={o.y} x2={p(v).x} y2={p(v).y} color={LA_A} marker="la-a" />
              <VectorRay x1={o.x} y1={o.y} x2={p(u).x} y2={p(u).y} color={LA_E} marker="la-e" />
              <VectorRay x1={o.x} y1={o.y} x2={p(n).x} y2={p(n).y} color={LA_B} marker="la-b" />
              <VectorRay x1={o.x} y1={o.y} x2={p(pu).x} y2={p(pu).y} color={LA_C} marker="la-c" />
              <VectorRay x1={p(pu).x} y1={p(pu).y} x2={p(v).x} y2={p(v).y} color={LA_C} dashed marker="la-c" />
              <DragHandle x={p(v).x} y={p(v).y} fill={LA_A} label="v" />
              <DragHandle x={p(u).x} y={p(u).y} fill={LA_E} label="u" />
              <DragHandle x={p(n).x} y={p(n).y} fill={LA_B} label="n" />
            </svg>
          </Card>
          </div>
          <div className="la-rail">
          <Card title="Projection onto Line (span(u))">
            <p className="la-eq">proj<sub>u</sub> v = ({fmt(pu[0], 2)}, {fmt(pu[1], 2)}, {fmt(pu[2], 2)})</p>
            <p className="la-eq">r<sub>u</sub> = v − proj = ({fmt(ru[0], 2)}, {fmt(ru[1], 2)}, {fmt(ru[2], 2)})</p>
            <p className="la-eq">u · r<sub>u</sub> = {fmt(dot3(u, ru), 3)}</p>
          </Card>
          <Card title="Projection onto Plane (n · x = 0)">
            <p className="la-eq">proj<sub>n</sub> v = ({fmt(pn[0], 2)}, {fmt(pn[1], 2)}, {fmt(pn[2], 2)})</p>
          </Card>
          <Card title="Gram–Schmidt building ON basis">
            <p className="la-eq">u₁ = ({fmt(u1[0], 3)}, {fmt(u1[1], 3)}, {fmt(u1[2], 3)})</p>
            {step >= 2 ? <p className="la-eq">u₂ = ({fmt(u2[0], 3)}, {fmt(u2[1], 3)}, {fmt(u2[2], 3)})</p> : null}
            {step >= 3 ? <p className="la-eq">u₃ = ({fmt(u3[0], 3)}, {fmt(u3[1], 3)}, {fmt(u3[2], 3)})</p> : null}
          </Card>
          <Card title="Lengths & Angles">
            <p className="la-eq">||v|| = {fmt(mag3(v), 3)} · ∠(v, u) = {fmt(Math.acos(clamp(dot3(v, u) / ((mag3(v) * mag3(u)) || 1), -1, 1)) * 180 / Math.PI, 1)}°</p>
          </Card>
          </div>
        </>
      )}
    </LinearAlgebraLabChrome>
  );
}

function seedPoints() {
  return [
    [-2.5, -1.92], [-1.8, -1.15], [-1, -0.17], [-0.2, 1.12], [0.3, 1.18], [1.1, 2.3],
    [1.8, 2.7], [2.2, 3.4], [2.7, 4.15], [-2.1, -2.4], [0.7, 1.6], [1.5, 2.1],
  ];
}

function LeastSquaresLab({ page }: { page: StudioMockupPage }) {
  const [pts, setPts] = useState(seedPoints);
  const [drag, setDrag] = useState<number | null>(null);
  const n = pts.length;
  const sx = pts.reduce((s, p) => s + (p[0] ?? 0), 0);
  const sy = pts.reduce((s, p) => s + (p[1] ?? 0), 0);
  const sxx = pts.reduce((s, p) => s + (p[0] ?? 0) ** 2, 0);
  const sxy = pts.reduce((s, p) => s + (p[0] ?? 0) * (p[1] ?? 0), 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx || 1);
  const intercept = (sy - slope * sx) / n;
  const mean = sy / n;
  const sse = pts.reduce((s, p) => s + ((p[1] ?? 0) - (slope * (p[0] ?? 0) + intercept)) ** 2, 0);
  const sst = pts.reduce((s, p) => s + ((p[1] ?? 0) - mean) ** 2, 0) || 1;
  const r2 = 1 - sse / sst;
  const se = Math.sqrt(sse / Math.max(1, n - 2));
  const fit = solve2(n, sx, sx, sxx, sy, sxy);

  return (
    <LinearAlgebraLabChrome page={page}>
      {(mode) => (
        <>
          <div className="la-rail">
          <Card title="Data & Model" kicker="Model">
            <p className="la-eq">y = β₀ + β₁ x</p>
            <p className="la-note">n = {n}</p>
            <button type="button" className="la-soft" onClick={() => setPts(seedPoints().map(([x, y]) => [x ?? 0, (y ?? 0) + (Math.random() - 0.5)]))}>Randomize</button>
            <Switch label="Best-fit line" on onChange={() => undefined} />
            <Switch label="Residuals" on onChange={() => undefined} />
            <Toggle label="Squared-error tiles" on onChange={() => undefined} />
            <button type="button" className="la-soft" onClick={() => setPts([...pts, [2.4, -2]])}>Add outlier</button>
          </Card>
          </div>
          <div className="la-center">
          <Card className="la-viz" title="Data with best-fit line">
            <svg
              className="msk-graph is-interactive"
              viewBox="0 0 520 280"
              role="img"
              aria-label="Least squares fit"
              onPointerMove={(event: PointerEvent<SVGSVGElement>) => {
                if (drag === null) return;
                const rect = event.currentTarget.getBoundingClientRect();
                const x = clamp(((event.clientX - rect.left) / rect.width) * 8 - 4, -3.5, 3.5);
                const y = clamp(6 - ((event.clientY - rect.top) / rect.height) * 10, -4, 6);
                setPts(pts.map((p, i) => (i === drag ? [x, y] : p)));
              }}
              onPointerUp={() => setDrag(null)}
            >
              <rect width="520" height="280" fill="#f7fbff" />
              <line x1="40" y1={160 - intercept * 22} x2="500" y2={160 - (slope * 4 + intercept) * 22} stroke={LA_A} strokeWidth="3" />
              {pts.map(([x = 0, y = 0], i) => {
                const px = 260 + x * 55;
                const py = 160 - y * 22;
                const fy = 160 - (slope * x + intercept) * 22;
                const h = Math.abs(py - fy);
                return (
                  <g key={i}>
                    <rect x={px} y={Math.min(py, fy)} width={Math.max(8, h * 0.4)} height={h} fill="rgba(245,158,11,.22)" />
                    <line x1={px} y1={py} x2={px} y2={fy} stroke={LA_B} />
                    <circle cx={px} cy={py} r="6" fill={LA_A} onPointerDown={() => setDrag(i)} />
                  </g>
                );
              })}
            </svg>
            <h2>Column space projection view</h2>
            <svg className="msk-graph" viewBox="0 0 520 180" role="img" aria-label={mode}>
              <rect width="520" height="180" fill="#f7fbff" />
              <ArrowDefs />
              <VectorRay x1={80} y1={150} x2={240} y2={40} color={LA_A} marker="la-a" />
              <VectorRay x1={80} y1={150} x2={300} y2={90} color={LA_D} marker="la-d" />
              <VectorRay x1={300} y1={90} x2={240} y2={40} color={LA_B} dashed marker="la-b" />
              <text x="248" y="32" fontSize="12" fill={LA_A}>b</text>
              <text x="308" y="104" fontSize="12" fill={LA_D}>b̂ = A x̂</text>
            </svg>
          </Card>
          </div>
          <div className="la-rail">
          <Card title="Design matrix A and vector b">
            <p className="la-eq">A = [1 x] · b = y</p>
            <Sheet matrix={pts.slice(0, 6).map(([x = 0, y = 0]) => [1, x, y])} />
          </Card>
          <Card title="Normal equations Aᵀ A x̂ = Aᵀ b">
            <p className="la-eq">β₀ = {fmt(fit?.x ?? intercept, 3)} · β₁ = {fmt(fit?.y ?? slope, 3)}</p>
          </Card>
          <Card title="Solution x̂">
            <p className="la-eq">ŷ = {fmt(intercept, 3)} + {fmt(slope, 3)} x</p>
          </Card>
          <Card title="Fit quality">
            <p className="la-eq">SSE = {fmt(sse, 3)} · R² = {fmt(r2, 4)} · SE = {fmt(se, 4)}</p>
          </Card>
          </div>
        </>
      )}
    </LinearAlgebraLabChrome>
  );
}

function ident3(): number[][] {
  return [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
}

function PlaygroundLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [A, setA] = useState([[1.2, 0.6, 0.2], [-0.4, 1.1, 0.3], [0.1, -0.2, 0.9]]);
  const [t, setT] = useState(0.65);
  const [stack, setStack] = useState(["Rotate Z (30°)", "Shear X (0.6)"]);
  const det = det3(A);
  const M2: Mat2 = [[lerp(1, A[0]?.[0] ?? 1, t), lerp(0, A[0]?.[1] ?? 0, t)], [lerp(0, A[1]?.[0] ?? 0, t), lerp(1, A[1]?.[1] ?? 1, t)]];
  const cube = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]];
  const mapped = cube.map(([x, y, z]) => apply3(A, x, y, z));
  const p3 = (v: number[]) => iso3(v[0] ?? 0, v[1] ?? 0, v[2] ?? 0, 160, 150, 52, 0.5);

  return (
    <LinearAlgebraLabChrome page={page} play>
      {(mode) => (
        <div className="la-play">
          <div className="la-rail">
          <Card title="Transformation matrix" kicker="Edit the 3×3 matrix A">
            <Sheet matrix={A} onChange={(r, c, v) => setA(setCell(A, r, c, v))} />
            <h2>Quick presets</h2>
            <div className="la-presets">
              <button type="button" onClick={() => setA(ident3())}>Identity</button>
              <button type="button" onClick={() => setA([[0.87, -0.5, 0], [0.5, 0.87, 0], [0, 0, 1]])}>Rotate 30°</button>
              <button type="button" onClick={() => setA([[1.5, 0, 0], [0, 1, 0], [0, 0, 1]])}>Scale X</button>
              <button type="button" onClick={() => setA([[1, 0.6, 0], [0, 1, 0], [0, 0, 1]])}>Shear X</button>
              <button type="button" onClick={() => setA([[1, 0, 0], [0, -1, 0], [0, 0, 1]])}>Reflect Y</button>
              <button type="button" onClick={() => setA([[1, 0, 0], [0, 1, 0], [0, 0, -1]])}>Reflect Z</button>
            </div>
            <h2>Object & basis controls</h2>
            <Switch label="Show grid" on onChange={() => undefined} />
            <Switch label="Snap to axes" on={false} onChange={() => undefined} />
          </Card>
          </div>
          <div>
            <div className="la-play-canvases">
              <Card className="la-viz" title="2D transformation">
                <ExtraFrame
                  mode={mode}
                  extra={extra}
                  fallback={(
                    <svg className="msk-graph" viewBox="0 0 360 280" role="img" aria-label="2D playground">
                      <rect width="360" height="280" fill="#f7fbff" />
                      <ArrowDefs />
                      <AxisGrid ox={120} oy={180} unit={40} dark={false} />
                      <polygon points={poly(identity2(), 120, 180, 40)} fill="rgba(20,125,242,.16)" stroke={LA_A} />
                      <polygon points={poly(M2, 120, 180, 40)} fill="rgba(139,69,244,.22)" stroke={LA_B} />
                    </svg>
                  )}
                />
                <div className="la-metrics">
                  <div><small>det(A)</small><b>{fmt(det, 3)}</b></div>
                  <div><small>Area scale</small><b>{fmt(Math.abs(det), 3)}×</b></div>
                  <div><small>Orientation</small><b>{det >= 0 ? "Preserved" : "Flipped"}</b></div>
                  <div><small>Invertible</small><b>{Math.abs(det) > 1e-6 ? "Yes" : "No"}</b></div>
                </div>
              </Card>
              <Card className="la-viz" title="3D transformation">
                <svg className="msk-graph" viewBox="0 0 360 280" role="img" aria-label="3D playground">
                  <rect width="360" height="280" fill="#f7fbff" />
                  <polygon points={mapped.slice(0, 4).map((v) => `${p3(v).x},${p3(v).y}`).join(" ")} fill="rgba(139,69,244,.25)" stroke={LA_B} />
                  <polygon points={`${p3([0, 0, 0]).x},${p3([0, 0, 0]).y} ${p3([1, 0, 0]).x},${p3([1, 0, 0]).y} ${p3([1, 1, 0]).x},${p3([1, 1, 0]).y} ${p3([0, 1, 0]).x},${p3([0, 1, 0]).y}`} fill="rgba(20,125,242,.2)" stroke={LA_A} />
                </svg>
                <div className="la-metrics">
                  <div><small>Volume scale</small><b>{fmt(Math.abs(det), 3)}×</b></div>
                  <div><small>Orientation</small><b>{det >= 0 ? "Preserved" : "Flipped"}</b></div>
                  <div><small>Condition #</small><b>{fmt(Math.abs(det) > 1e-6 ? 1 / Math.abs(det) : 99, 2)}</b></div>
                  <div><small>Rank</small><b>{Math.abs(det) > 1e-6 ? "3" : " < 3"}</b></div>
                </div>
              </Card>
            </div>
            <Card title="Slider scrub interpolate between identity and A">
              <input type="range" min={0} max={1} step={0.01} value={t} aria-label="Interpolate" onChange={(event) => setT(Number(event.target.value))} />
            </Card>
          </div>
          <div className="la-rail">
          <Card title="Matrix analysis">
            <p className="la-eq">det(A) = {fmt(det, 3)}</p>
            <p className="la-eq">Rank = {Math.abs(det) > 1e-6 ? 3 : 2}</p>
            <p className="la-eq">Trace = {fmt((A[0]?.[0] ?? 0) + (A[1]?.[1] ?? 0) + (A[2]?.[2] ?? 0), 3)}</p>
            <span className={`la-badge${Math.abs(det) > 1e-6 ? "" : " is-bad"}`}>{Math.abs(det) > 1e-6 ? "Invertible" : "Singular"}</span>
          </Card>
          <Card title="Composition stack">
            <ol className="la-history">
              {stack.map((item) => <li key={item}>{item}</li>)}
            </ol>
            <button type="button" className="la-soft" onClick={() => setStack([...stack, "Scale (1.5, 1, 1)"])}>Add transform</button>
          </Card>
          <Card title="Composed matrix">
            <p className="la-eq">A ≈ T₄ T₃ T₂ T₁</p>
            <p className="la-eq">Determinant {fmt(det, 3)}</p>
          </Card>
          </div>
        </div>
      )}
    </LinearAlgebraLabChrome>
  );
}

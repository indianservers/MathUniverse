import { useState, type PointerEvent, type ReactNode } from "react";
import { Phase1LabChrome } from "../phase1/Phase1LabChrome";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { ChallengeBox, ExtraFrame, Field, LiveRow, Panel, SliderRow, StatusOk, clamp, fmt } from "../mockup/studioLabKit";
import { TransformUnitSquare } from "../mockup/labs/unitSquareCanvas";
import VectorSpacesLab from "./VectorSpacesLab";
import { gramSchmidt } from "./vectorSpaceMath";

function Chrome({
  page,
  children,
  toolbar,
}: {
  page: StudioMockupPage;
  children: ReactNode | ((mode: string) => ReactNode);
  toolbar?: ReactNode;
}) {
  return <Phase1LabChrome page={page} toolbar={toolbar}>{children}</Phase1LabChrome>;
}

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

function apply2(M: number[][], x: number, y: number) {
  return [(M[0]?.[0] ?? 0) * x + (M[0]?.[1] ?? 0) * y, (M[1]?.[0] ?? 0) * x + (M[1]?.[1] ?? 0) * y];
}

function poly(M: number[][], ox: number, oy: number, u: number) {
  const pts = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => apply2(M, x, y));
  return pts.map(([x, y]) => `${ox + x * u},${oy - y * u}`).join(" ");
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
    <Chrome page={page}>
      {(mode) => (
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
            <p className="msk-note">{mode}: cos θ = (a·b) / (|a||b|) = {fmt(Math.cos(angle * Math.PI / 180), 3)}</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
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
            <ul className="la-legend">
              <li><i style={{ background: "#147df2" }} />a</li>
              <li><i style={{ background: "#8b45f4" }} />b</li>
              <li><i style={{ background: "#f59e0b" }} />{mode === "Projections" ? "proj" : "result"}</li>
            </ul>
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
      )}
    </Chrome>
  );
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
            </Panel>
            <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
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
            <button type="button" className={step === 0 ? "msk-soft active" : "msk-soft"} onClick={() => setStep(0)}>Start</button>
            <button type="button" className={step === 1 ? "msk-soft active" : "msk-soft"} onClick={() => setStep(1)}>R2 − {fmt(r21, 2)} R1</button>
            <button type="button" className={step === 2 ? "msk-soft active" : "msk-soft"} onClick={() => setStep(2)}>RREF</button>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
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
            <p className="msk-note">Columns of A are the images of e₁ and e₂.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
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
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
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
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
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
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
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
            <p className="msk-note">Drag points. Residual is orthogonal to the columns.</p>
            <button type="button" className="msk-soft" onClick={() => setPts((p) => [...p.slice(0, 3), [4.6, 7.8]])}>Add outlier</button>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
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
            {presets.map((item) => (
              <button key={item} type="button" className="msk-soft" onClick={() => setStack((s) => [...s, item])}>+ {item}</button>
            ))}
            <button type="button" className="msk-soft" onClick={() => setStack((s) => [...s].reverse())}>Reorder</button>
            <p className="msk-note">Stack: {stack.join(" ∘ ")}</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
            <ExtraFrame mode={mode} extra={extra} fallback={<TransformUnitSquare mode={mode} />} />
          </section>
          <aside className="msk-panel msk-live"><LiveRow color="#08b9dd" label="det I" value="1" /><ChallengeBox {...page.challenge} /></aside>
        </>
      )}
    </Chrome>
  );
}

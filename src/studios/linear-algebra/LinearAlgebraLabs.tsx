import { useEffect, useState, type PointerEvent, type ReactNode } from "react";
import { Phase1LabChrome, FigureToolbar } from "../phase1/Phase1LabChrome";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { ChallengeBox, ExtraFrame, LiveRow, Panel, StatusOk, clamp, fmt } from "../mockup/studioLabKit";
import { useStudioFigure } from "../phase1/useStudioFigure";
import VectorSpacesLab from "./VectorSpacesLab";
import { gramSchmidt } from "./vectorSpaceMath";
import {
  ArrowDefs, AxisGrid, DragHandle, FormulaBridge, LiveRegion, NudgeSlider, ShapeLegend, VectorRay,
  canvasFill, canvasKeyNudge, ink, useDarkCanvas, LA_A, LA_B, LA_C, LA_D, LA_E,
} from "./linearAlgebraCanvas";
import {
  addMatrices, apply2, classifySystem, composeNamed, det2, eigen2, identity2, inv2, iso3, lerp, multiply,
  namedTransform, parallel2, phaseTrajectories, resizeMatrix, setCell, solve2, transpose2,
  type Mat2,
} from "./linearAlgebraLabMath";
import { markLinearComplete, prefersReducedMotion } from "./linearAlgebraStudioSession";

function Chrome({
  page, children, toolbar,
}: {
  page: StudioMockupPage;
  children: ReactNode | ((mode: string) => ReactNode);
  toolbar?: ReactNode;
}) {
  return <Phase1LabChrome page={page} toolbar={toolbar}>{children}</Phase1LabChrome>;
}

function FigureBar<T extends object>({ fig }: { fig: ReturnType<typeof useStudioFigure<T>> }) {
  return (
    <FigureToolbar
      canUndo={fig.canUndo}
      canRedo={fig.canRedo}
      exact={fig.exact}
      onUndo={fig.undo}
      onRedo={fig.redo}
      onReset={fig.reset}
      onShare={() => void fig.share()}
      onExact={fig.setExact}
    />
  );
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

function poly(M: Mat2, ox: number, oy: number, u: number) {
  const pts = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => apply2(M, x, y));
  return pts.map(([x, y]) => `${ox + x * u},${oy - y * u}`).join(" ");
}

type VecState = { ax: number; ay: number; az: number; bx: number; by: number; bz: number; cx: number; cy: number; cz: number; yaw: number };
const vecInit: VecState = { ax: 2, ay: 1, az: 1, bx: -1, by: 2, bz: 0.5, cx: 0.5, cy: -1, cz: 1.5, yaw: 0.4 };

function VectorsLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const fig = useStudioFigure(vecInit);
  const [view, setView] = useState<"2D" | "3D">("3D");
  const [assoc, setAssoc] = useState(false);
  const [selected, setSelected] = useState<"a" | "b" | "c">("a");
  const dark = useDarkCanvas(view === "3D");
  const s = fig.state;
  const a = [s.ax, s.ay, s.az];
  const b = [s.bx, s.by, s.bz];
  const mag = (v: number[]) => Math.hypot(v[0] ?? 0, v[1] ?? 0, v[2] ?? 0);
  const dot = s.ax * s.bx + s.ay * s.by + s.az * s.bz;
  const cross: [number, number, number] = [s.ay * s.bz - s.az * s.by, s.az * s.bx - s.ax * s.bz, s.ax * s.by - s.ay * s.bx];
  const angle = Math.acos(clamp(dot / (mag(a) * mag(b) || 1), -1, 1)) * 180 / Math.PI;
  const projScale = mag(b) ? dot / (mag(b) ** 2) : 0;
  const ox = 90, oy = 300, u = 46;
  const p = (x: number, y: number, z: number) => view === "3D" ? iso3(x, y, z, ox, oy, u, s.yaw) : { x: ox + x * u, y: oy - y * u };
  const pa = p(s.ax, s.ay, s.az), pb = p(s.bx, s.by, s.bz), pc = p(s.cx, s.cy, s.cz);
  const pr = p(s.ax + s.bx, s.ay + s.by, s.az + s.bz);
  const ps = p(s.ax - s.bx, s.ay - s.by, s.az - s.bz);
  const pproj = p(projScale * s.bx, projScale * s.by, projScale * s.bz);
  const pcross = p(cross[0], cross[1], cross[2]);
  const origin = p(0, 0, 0);
  const zero = mag(a) < 1e-6 || mag(b) < 1e-6;
  const parallel = Math.hypot(...cross) < 1e-4;
  const left = [s.ax + (s.bx + s.cx), s.ay + (s.by + s.cy), s.az + (s.bz + s.cz)];

  const commitSel = (dx: number, dy: number) => {
    if (selected === "a") fig.commit({ ...s, ax: clamp(s.ax + dx, -4, 4), ay: clamp(s.ay + dy, -4, 4) });
    if (selected === "b") fig.commit({ ...s, bx: clamp(s.bx + dx, -4, 4), by: clamp(s.by + dy, -4, 4) });
    if (selected === "c") fig.commit({ ...s, cx: clamp(s.cx + dx, -4, 4), cy: clamp(s.cy + dy, -4, 4) });
  };

  return (
    <Chrome page={page} toolbar={<FigureBar fig={fig} />}>
      {(mode) => (
        <>
          <Panel title="Vectors">
            <NudgeSlider label="ax" value={s.ax} min={-4} max={4} step={0.1} onChange={(ax) => fig.commit({ ...s, ax })} />
            <NudgeSlider label="ay" value={s.ay} min={-4} max={4} step={0.1} onChange={(ay) => fig.commit({ ...s, ay })} />
            <NudgeSlider label="az" value={s.az} min={-4} max={4} step={0.1} onChange={(az) => fig.commit({ ...s, az })} />
            <NudgeSlider label="bx" value={s.bx} min={-4} max={4} step={0.1} onChange={(bx) => fig.commit({ ...s, bx })} />
            <NudgeSlider label="by" value={s.by} min={-4} max={4} step={0.1} onChange={(by) => fig.commit({ ...s, by })} />
            <NudgeSlider label="bz" value={s.bz} min={-4} max={4} step={0.1} onChange={(bz) => fig.commit({ ...s, bz })} />
            {assoc ? (
              <>
                <NudgeSlider label="cx" value={s.cx} min={-4} max={4} step={0.1} onChange={(cx) => fig.commit({ ...s, cx })} />
                <NudgeSlider label="cy" value={s.cy} min={-4} max={4} step={0.1} onChange={(cy) => fig.commit({ ...s, cy })} />
                <NudgeSlider label="cz" value={s.cz} min={-4} max={4} step={0.1} onChange={(cz) => fig.commit({ ...s, cz })} />
              </>
            ) : null}
            {view === "3D" ? <NudgeSlider label="Orbit" value={s.yaw} min={-1} max={1.2} step={0.05} onChange={(yaw) => fig.commit({ ...s, yaw })} /> : null}
            <div className="msk-seg" role="group" aria-label="Vector view">
              <button type="button" className={view === "2D" ? "active" : ""} aria-pressed={view === "2D"} onClick={() => setView("2D")}>2D</button>
              <button type="button" className={view === "3D" ? "active" : ""} aria-pressed={view === "3D"} onClick={() => setView("3D")}>3D</button>
            </div>
            {mode === "Add" ? <button type="button" className={assoc ? "msk-soft active" : "msk-soft"} onClick={() => setAssoc((v) => !v)}>Associativity sandbox</button> : null}
            <p className="msk-note">Drag handles or use WASD / arrows on the canvas. Tick marks are the i, j{view === "3D" ? ", k" : ""} components.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <svg
                  className="msk-graph is-interactive"
                  viewBox="0 0 520 360"
                  tabIndex={0}
                  role="img"
                  aria-label={`${mode} vector canvas. Drag a or b. Keyboard arrows nudge the selected vector.`}
                  onKeyDown={(event) => canvasKeyNudge(event, commitSel)}
                  onPointerDown={(event: PointerEvent<SVGSVGElement>) => {
                    const box = event.currentTarget.getBoundingClientRect();
                    const x = ((event.clientX - box.left) / box.width) * 520;
                    const y = ((event.clientY - box.top) / box.height) * 360;
                    const hits: Array<["a" | "b" | "c", number]> = [
                      ["a", Math.hypot(x - pa.x, y - pa.y)],
                      ["b", Math.hypot(x - pb.x, y - pb.y)],
                    ];
                    if (assoc) hits.push(["c", Math.hypot(x - pc.x, y - pc.y)]);
                    hits.sort((l, r) => l[1] - r[1]);
                    const pick = hits[0]?.[0] ?? "a";
                    setSelected(pick);
                    event.currentTarget.setPointerCapture(event.pointerId);
                    const nextX = clamp((x - ox) / u, -4, 4);
                    const nextY = clamp((oy - y) / u, -4, 4);
                    if (pick === "a") fig.commit({ ...s, ax: nextX, ay: nextY });
                    if (pick === "b") fig.commit({ ...s, bx: nextX, by: nextY });
                    if (pick === "c") fig.commit({ ...s, cx: nextX, cy: nextY });
                  }}
                >
                  <rect width="520" height="360" fill={canvasFill(dark)} />
                  <ArrowDefs />
                  <line x1="70" y1="310" x2="490" y2="310" stroke="#94a3b8" />
                  <line x1="70" y1="310" x2="70" y2="36" stroke="#94a3b8" />
                  {view === "3D" ? <line x1="70" y1="310" x2="210" y2="190" stroke="#cbd5e1" /> : null}
                  {[1, 2, 3].map((i) => (
                    <g key={i}>
                      <line x1={ox + i * u} y1={oy - 4} x2={ox + i * u} y2={oy + 4} stroke="#64748b" />
                      <line x1={ox - 4} y1={oy - i * u} x2={ox + 4} y2={oy - i * u} stroke="#64748b" />
                    </g>
                  ))}
                  {mode === "Dot" ? (
                    <path d={`M ${origin.x + 28} ${origin.y} A 28 28 0 0 0 ${origin.x + 28 * Math.cos(angle * Math.PI / 180)} ${origin.y - 28 * Math.sin(angle * Math.PI / 180)}`} fill="none" stroke={LA_C} />
                  ) : null}
                  {mode === "Cross" ? <polygon points={`${origin.x},${origin.y} ${pa.x},${pa.y} ${pr.x},${pr.y} ${pb.x},${pb.y}`} fill="rgba(139,69,244,.16)" stroke={LA_B} /> : null}
                  {mode === "Projections" ? <VectorRay x1={origin.x} y1={origin.y} x2={pproj.x} y2={pproj.y} color={LA_C} width={8} marker="la-c" /> : null}
                  {mode === "Add" || mode === "Subtract" ? <polygon points={`${origin.x},${origin.y} ${pa.x},${pa.y} ${mode === "Add" ? `${pr.x},${pr.y}` : `${ps.x},${ps.y}`} ${pb.x},${pb.y}`} fill="rgba(245,158,11,.12)" stroke={LA_C} strokeDasharray="4 3" /> : null}
                  <VectorRay x1={origin.x} y1={origin.y} x2={pa.x} y2={pa.y} color={LA_A} marker="la-a" />
                  <VectorRay x1={origin.x} y1={origin.y} x2={pb.x} y2={pb.y} color={LA_B} marker="la-b" />
                  {mode === "Scale" ? <VectorRay x1={origin.x} y1={origin.y} x2={p(s.ax * 1.5, s.ay * 1.5, s.az * 1.5).x} y2={p(s.ax * 1.5, s.ay * 1.5, s.az * 1.5).y} color={LA_E} dashed marker="la-e" /> : null}
                  {mode === "Cross" ? <VectorRay x1={origin.x} y1={origin.y} x2={pcross.x} y2={pcross.y} color={LA_D} marker="la-d" /> : null}
                  {assoc && mode === "Add" ? <VectorRay x1={origin.x} y1={origin.y} x2={pc.x} y2={pc.y} color={LA_C} dashed marker="la-c" /> : null}
                  <DragHandle x={pa.x} y={pa.y} fill={LA_A} label="a" selected={selected === "a"} />
                  <DragHandle x={pb.x} y={pb.y} fill={LA_B} label="b" shape="square" selected={selected === "b"} />
                  {assoc ? <DragHandle x={pc.x} y={pc.y} fill={LA_C} label="c" shape="diamond" selected={selected === "c"} /> : null}
                  <text x="24" y="28" fill={ink(dark)} fontSize="13">
                    {mode === "Cross" ? "Right-hand parallelogram · a × b" : mode === "Projections" ? "Shadow of a onto b" : mode === "Dot" ? `Alignment · cos θ = ${fmt(Math.cos(angle * Math.PI / 180), 3)}` : mode}
                  </text>
                </svg>
              )}
            />
            <FormulaBridge>
              {mode === "Dot" ? `a · b = |a||b| cos θ = ${fmt(dot)}` : mode === "Cross" ? "|a × b| is the parallelogram area" : mode === "Projections" ? "proj_b a = ((a·b)/|b|²) b" : mode === "Add" && assoc ? `a+(b+c) = (${left.map((n) => fmt(n, 2)).join(", ")}) = (a+b)+c` : `${mode} updates from the same three components.`}
            </FormulaBridge>
            <ShapeLegend items={[
              { color: LA_A, label: "a (circle)", shape: "solid" },
              { color: LA_B, label: "b (square)", shape: "square" },
              { color: LA_C, label: mode === "Projections" ? "proj (dashed)" : "result", shape: "dashed" },
            ]} />
          </section>
          <aside className="msk-panel msk-live">
            <LiveRegion text={`theta ${fmt(angle, 1)} degrees, dot ${fmt(dot)}`} />
            <LiveRow color={LA_A} label="|a|" value={fmt(mag(a))} />
            <LiveRow color={LA_B} label="|b|" value={fmt(mag(b))} />
            <LiveRow color={LA_C} label="θ" value={`${fmt(angle, 1)}°`} />
            <LiveRow color={LA_E} label="a · b" value={fmt(dot)} />
            <LiveRow color={LA_B} label="a × b" value={`(${cross.map((n) => fmt(n, 2)).join(", ")})`} />
            <LiveRow color={LA_D} label="|a × b|" value={fmt(mag(cross))} />
            {zero ? <p className="msk-warn">A zero vector makes the angle undefined — restore a nonzero a and b.</p> : parallel ? <p className="msk-warn">a and b are parallel, so a × b is the zero vector.</p> : <StatusOk>All computations are consistent. Vectors are in R³.</StatusOk>}
            {assoc ? <StatusOk>a+(b+c) matches (a+b)+c to machine precision.</StatusOk> : null}
            <ChallengeBox {...page.challenge} page={page} onCorrect={() => markLinearComplete(page.id)} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

type MatrixState = { A: number[][]; B: number[][]; hi: number; hj: number; guess: string; reveal: boolean; play: number };
const matrixInit: MatrixState = {
  A: [[1, 2, -1], [0, 3, 4]],
  B: [[2, 1], [0, -1], [3, 2]],
  hi: 0, hj: 0, guess: "", reveal: false, play: 1,
};

function MatricesLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure(matrixInit);
  const [view, setView] = useState("2D");
  const dark = useDarkCanvas(view === "3D");
  const { A, B, hi, hj, guess, reveal, play } = fig.state;
  const product = multiply(A, B);
  const sum = addMatrices(
    A.map((row) => row.slice(0, B[0]?.length ?? 0)),
    B.slice(0, A.length).map((row) => row.slice(0, A[0]?.length ?? 0)),
  );
  const A2: Mat2 = [[A[0]?.[0] ?? 0, A[0]?.[1] ?? 0], [A[1]?.[0] ?? 0, A[1]?.[1] ?? 0]];
  const C2: Mat2 = product ? [[product[0]?.[0] ?? 0, product[0]?.[1] ?? 0], [product[1]?.[0] ?? 0, product[1]?.[1] ?? 0]] : [[0, 0], [0, 0]];
  const invA = inv2(A2);
  const AT = transpose2(A2);
  const compatible = product != null;
  const ops = [["Add", "+ Add"], ["Multiply", "× Multiply"], ["Inverse", "x⁻¹ Inverse"], ["Transpose", "T Transpose"], ["Block", "Block"]] as const;

  useEffect(() => {
    if (prefersReducedMotion() || play >= 1) return;
    const id = window.setInterval(() => {
      fig.commit((prev) => ({ ...prev, play: Math.min(1, prev.play + 0.08) }));
    }, 80);
    return () => window.clearInterval(id);
    // fig.commit is stable enough for this playback loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [play]);

  return (
    <Chrome
      page={page}
      toolbar={(
        <>
          <FigureBar fig={fig} />
          <div className="msk-opbar" aria-label="Matrix operations">
            {ops.map(([id, label]) => (
              <a key={id} href={`?mode=${encodeURIComponent(id)}`} className="msk-opbar-link">{label}</a>
            ))}
            <span className="msk-opbar-view">
              <button type="button" className={view === "2D" ? "active" : ""} onClick={() => setView("2D")}>2D</button>
              <button type="button" className={view === "3D" ? "active" : ""} onClick={() => setView("3D")}>3D</button>
            </span>
          </div>
        </>
      )}
    >
      {(mode) => {
        const geo = mode === "Inverse" && invA ? invA : mode === "Transpose" ? AT : mode === "Add" && sum ? [[sum[0]?.[0] ?? 0, sum[0]?.[1] ?? 0], [sum[1]?.[0] ?? 0, sum[1]?.[1] ?? 0]] as Mat2 : C2;
        const rowsA = A.length;
        const colsA = A[0]?.length ?? 0;
        const rowsB = B.length;
        const colsB = B[0]?.length ?? 0;
        const hideB = mode === "Inverse" || mode === "Transpose";
        const shownC = product?.[hi]?.[hj];
        return (
          <>
            <Panel title={`Operation: A ${mode === "Add" ? "+" : mode === "Multiply" ? "×" : "·"} B`}>
              <p className="msk-note">Matrix A ({rowsA} × {colsA})</p>
              <div className="msk-seg" role="group" aria-label="Resize A">
                <button type="button" onClick={() => fig.commit({ ...fig.state, A: resizeMatrix(A, clamp(rowsA - 1, 1, 4), colsA) })}>− row</button>
                <button type="button" onClick={() => fig.commit({ ...fig.state, A: resizeMatrix(A, clamp(rowsA + 1, 1, 4), colsA) })}>+ row</button>
                <button type="button" onClick={() => fig.commit({ ...fig.state, A: resizeMatrix(A, rowsA, clamp(colsA - 1, 1, 4)) })}>− col</button>
                <button type="button" onClick={() => fig.commit({ ...fig.state, A: resizeMatrix(A, rowsA, clamp(colsA + 1, 1, 4)) })}>+ col</button>
              </div>
              <table className="msk-sheet">
                <tbody>
                  {A.map((row, r) => (
                    <tr key={r}>
                      {row.map((cell, c) => (
                        <td key={c} className={mode === "Multiply" && r === hi ? "is-hot" : ""}>
                          <input aria-label={`A${r + 1}${c + 1}`} type="number" value={cell} onChange={(e) => fig.commit({ ...fig.state, A: setCell(A, r, c, Number(e.target.value)) })} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {hideB ? null : (
                <>
                  <p className="msk-note">Matrix B ({rowsB} × {colsB})</p>
                  <div className="msk-seg" role="group" aria-label="Resize B">
                    <button type="button" onClick={() => fig.commit({ ...fig.state, B: resizeMatrix(B, clamp(rowsB - 1, 1, 4), colsB) })}>− row</button>
                    <button type="button" onClick={() => fig.commit({ ...fig.state, B: resizeMatrix(B, clamp(rowsB + 1, 1, 4), colsB) })}>+ row</button>
                    <button type="button" onClick={() => fig.commit({ ...fig.state, B: resizeMatrix(B, rowsB, clamp(colsB - 1, 1, 4)) })}>− col</button>
                    <button type="button" onClick={() => fig.commit({ ...fig.state, B: resizeMatrix(B, rowsB, clamp(colsB + 1, 1, 4)) })}>+ col</button>
                  </div>
                  <table className="msk-sheet">
                    <tbody>
                      {B.map((row, r) => (
                        <tr key={r}>
                          {row.map((cell, c) => (
                            <td key={c} className={mode === "Multiply" && c === hj ? "is-hot" : ""}>
                              <input aria-label={`B${r + 1}${c + 1}`} type="number" value={cell} onChange={(e) => fig.commit({ ...fig.state, B: setCell(B, r, c, Number(e.target.value)) })} />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              <button type="button" className="msk-primary" onClick={() => fig.commit({ ...fig.state, play: 0 })}>Replay row×column</button>
              <label className="msk-field">
                <span>Predict C{hi + 1}{hj + 1}</span>
                <input value={guess} onChange={(e) => fig.commit({ ...fig.state, guess: e.target.value, reveal: false })} aria-label="Predicted entry" />
              </label>
              <button type="button" className="msk-soft" onClick={() => fig.commit({ ...fig.state, reveal: true })}>Reveal</button>
            </Panel>
            <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
              {!compatible && mode === "Multiply" ? <p className="msk-warn" role="alert">Incompatible: A is {rowsA}×{colsA} and B is {rowsB}×{colsB}. Inner sizes must match.</p> : null}
              {mode === "Inverse" && !invA ? <p className="msk-warn" role="alert">Singular — no inverse. The 2×2 block of A has det ≈ 0.</p> : null}
              <p className="msk-note">{mode === "Multiply" ? "Product = composition: unit square → A then B" : mode === "Inverse" ? "AA⁻¹ → I animation (2×2 block of A)" : mode === "Transpose" ? "Geometric transpose: columns become rows" : mode === "Block" ? "Block multiply on 2×2 tiles" : `A + B · ${view}`}</p>
              <svg className="msk-graph" viewBox="0 0 420 280" role="img" aria-label={`${mode} geometry`}>
                <rect width="420" height="280" fill={canvasFill(dark, view === "3D")} />
                <line x1="20" y1="200" x2="400" y2="200" stroke="#94a3b8" /><line x1="80" y1="16" x2="80" y2="264" stroke="#94a3b8" />
                <polygon points="80,200 150,200 150,150 80,150" fill="none" stroke="#94a3b8" strokeDasharray="4 3" />
                {mode === "Multiply" && compatible ? (
                  <>
                    <polygon points={poly(A2, 80, 200, 50)} fill="rgba(8,185,221,.2)" stroke="#08b9dd" />
                    <polygon points={poly(C2, 80, 200, 50)} fill="rgba(139,69,244,.22)" stroke="#8b45f4" opacity={play} />
                  </>
                ) : mode === "Inverse" ? (
                  <>
                    <polygon points={poly(A2, 80, 200, 40)} fill="rgba(8,185,221,.2)" stroke="#08b9dd" opacity={invA ? 1 : 0.35} />
                    <polygon points={invA ? poly(identity2(), 250, 200, 40) : "250,200"} fill="rgba(16,185,129,.25)" stroke="#10b981" />
                    <text x="24" y="28" fill={ink(dark)} fontSize="12">{invA ? "A then A⁻¹ collapses to the unit square I" : "Singular — no inverse"}</text>
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
              <FormulaBridge>{mode === "Multiply" ? `C${hi + 1}${hj + 1} is row ${hi + 1} of A dotted with column ${hj + 1} of B.` : `det(A) · det(B) = det(AB) when both are square.`}</FormulaBridge>
            </section>
            <aside className="msk-panel msk-live">
              <h2>Dimensions &amp; compatibility</h2>
              <p className="msk-note">{compatible ? `A: ${rowsA} × ${colsA} · B: ${rowsB} × ${colsB} → A × B: ${rowsA} × ${colsB} · Compatible` : "Not compatible for multiply"}</p>
              <h2>Result C = A × B</h2>
              {product ? (
                <table className="msk-sheet">
                  <tbody>
                    {product.map((row, r) => (
                      <tr key={r}>
                        {row.map((cell, c) => (
                          <td key={c}>
                            <button type="button" className={r === hi && c === hj ? "active" : ""} onClick={() => fig.commit({ ...fig.state, hi: r, hj: c })}>
                              <output>{fmt(cell)}</output>
                            </button>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>Resize until inner dimensions match.</p>}
              {reveal && shownC != null ? <p role="status">{Math.abs(Number(guess) - shownC) < 0.05 ? "Your prediction matches the derived entry." : `Derived value is ${fmt(shownC)}. C stays computed, not typed.`}</p> : null}
              <StatusOk>{mode === "Inverse" ? (invA ? "AA⁻¹ = I on the 2×2 block." : "No inverse.") : "Result verified"}</StatusOk>
              <ChallengeBox {...page.challenge} page={page} onCorrect={() => markLinearComplete(page.id)} />
            </aside>
          </>
        );
      }}
    </Chrome>
  );
}

function RowReductionLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure({ a: 2, b: 1, rhs1: 5, c: 1, d: 3, rhs2: 7, step: 0, free: 0, t: 1 });
  const dark = useDarkCanvas();
  const { a, b, rhs1, c, d, rhs2, step, free, t } = fig.state;
  const det = a * d - b * c;
  const r21 = a === 0 ? 0 : c / a;
  const row2 = [0, d - r21 * b, rhs2 - r21 * rhs1];
  const solution = solve2(a, b, c, d, rhs1, rhs2);
  const cls = classifySystem([[a, b], [c, d]], [rhs1, rhs2]);
  const shownA = step === 0 ? a : 1;
  const shownB = step === 0 ? b : step === 1 ? b : 0;
  const shownC = step === 0 ? c : lerp(c, 0, t);
  const shownD = step === 0 ? d : step === 1 ? row2[1]! : 1;
  useEffect(() => {
    if (prefersReducedMotion() || t >= 1) return;
    const id = window.setInterval(() => {
      fig.commit((prev) => ({ ...prev, t: Math.min(1, prev.t + 0.1) }));
    }, 60);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

  return (
    <Chrome page={page} toolbar={<FigureBar fig={fig} />}>
      {(mode) => (
        <>
          <Panel title="Augmented system">
            <NudgeSlider label="a₁₁" value={a} min={-4} max={4} step={0.1} onChange={(v) => fig.commit({ ...fig.state, a: v })} />
            <NudgeSlider label="a₁₂" value={b} min={-4} max={4} step={0.1} onChange={(v) => fig.commit({ ...fig.state, b: v })} />
            <NudgeSlider label="b₁" value={rhs1} min={-8} max={8} step={0.1} onChange={(v) => fig.commit({ ...fig.state, rhs1: v })} />
            <NudgeSlider label="a₂₁" value={c} min={-4} max={4} step={0.1} onChange={(v) => fig.commit({ ...fig.state, c: v })} />
            <NudgeSlider label="a₂₂" value={d} min={-4} max={4} step={0.1} onChange={(v) => fig.commit({ ...fig.state, d: v })} />
            <NudgeSlider label="b₂" value={rhs2} min={-8} max={8} step={0.1} onChange={(v) => fig.commit({ ...fig.state, rhs2: v })} />
            {cls.kind === "infinite" ? <NudgeSlider label="Free variable t" value={free} min={-3} max={3} step={0.1} onChange={(v) => fig.commit({ ...fig.state, free: v })} /> : null}
            <button type="button" className={step === 0 ? "msk-soft active" : "msk-soft"} onClick={() => fig.commit({ ...fig.state, step: 0, t: 0 })}>Start</button>
            <button type="button" className={step === 1 ? "msk-soft active" : "msk-soft"} onClick={() => fig.commit({ ...fig.state, step: 1, t: 0 })}>R2 − {fmt(r21, 2)} R1</button>
            <button type="button" className={step === 2 ? "msk-soft active" : "msk-soft"} onClick={() => fig.commit({ ...fig.state, step: 2, t: 0 })}>RREF</button>
            <p className="msk-eq">{fmt(a)}x + {fmt(b)}y = {fmt(rhs1)}</p>
            <p className="msk-eq">{fmt(c)}x + {fmt(d)}y = {fmt(rhs2)}</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
            <h2>{mode === "Pivot Map" ? "Pivot map" : mode === "3D View" ? "Planes in R³" : "Lines in R²"}</h2>
            <table className="msk-rref">
              <thead><tr><th>R1</th><th>x</th><th>y</th><th>|</th><th>b</th></tr></thead>
              <tbody>
                <tr><td>live</td><td className="is-pivot">{fmt(shownA)}</td><td>{fmt(shownB)}</td><td>|</td><td>{fmt(rhs1)}</td></tr>
                <tr><td>live</td><td>{fmt(shownC)}</td><td className={step >= 1 ? "is-pivot" : ""}>{fmt(shownD)}</td><td>|</td><td>{fmt(step >= 1 ? row2[2]! : rhs2)}</td></tr>
              </tbody>
            </table>
            <svg className="msk-graph" viewBox="0 0 420 180" role="img" aria-label={mode}>
              <rect width="420" height="180" fill={canvasFill(dark, mode === "3D View")} />
              {mode === "3D View" ? (
                <>
                  <polygon points="40,150 200,40 380,80 220,170" fill="rgba(20,125,242,.2)" stroke="#38bdf8" />
                  <polygon points="60,40 360,50 340,160 90,160" fill="rgba(139,69,244,.18)" stroke="#c084fc" />
                </>
              ) : mode === "Pivot Map" ? (
                <>
                  <rect x="40" y="40" width="80" height="50" fill="#fde68a" stroke="#f59e0b" />
                  <rect x="140" y="100" width="80" height="50" fill={cls.kind === "unique" ? "#bbf7d0" : "#fecaca"} stroke="#10b981" />
                  <text x="48" y="70" fontSize="12">pivot 1</text>
                  <text x="148" y="130" fontSize="12">{cls.kind === "unique" ? "pivot 2" : cls.kind}</text>
                </>
              ) : (
                <>
                  <line x1="20" y1={90 - a * 8 - rhs1} x2="400" y2={90 + b * 8 - rhs1} stroke={LA_A} />
                  <line x1="20" y1={90 - c * 8 - rhs2} x2="400" y2={90 + d * 8 - rhs2} stroke={LA_B} />
                  {solution ? <circle cx={210 + solution.x * 28} cy={90 - solution.y * 18} r="6" fill={LA_C} /> : <circle cx={210 + free * 30} cy="90" r="5" fill={LA_C} />}
                </>
              )}
            </svg>
            <FormulaBridge>Elementary ops morph the same solution set. The gold marker is the intersection (or a point on the free line).</FormulaBridge>
          </section>
          <aside className="msk-panel msk-live">
            <span className={`la-badge is-${cls.kind}`}>{cls.kind === "unique" ? "Unique solution" : cls.kind === "infinite" ? "Infinitely many" : "Inconsistent"}</span>
            <LiveRow color={LA_A} label="Pivots" value={String(cls.rankA)} />
            <LiveRow color={LA_B} label="Rank A vs [A|b]" value={`${cls.rankA} / ${cls.rankAb}`} />
            <LiveRow color={LA_E} label="det" value={fmt(det)} />
            <ChallengeBox {...page.challenge} page={page} onCorrect={() => markLinearComplete(page.id)} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function TransformCanvas({ mode, M, k, dark, ghost = true, onDrag }: { mode: string; M: Mat2; k: number; dark: boolean; ghost?: boolean; onDrag?: (which: "e1" | "e2", x: number, y: number) => void }) {
  const ox = 80, oy = 220, u = 48;
  const e1 = apply2(M, 1, 0);
  const e2 = apply2(M, 0, 1);
  const p1 = { x: ox + e1[0] * u, y: oy - e1[1] * u };
  const p2 = { x: ox + e2[0] * u, y: oy - e2[1] * u };
  return (
    <svg
      className="msk-graph is-interactive"
      viewBox="0 0 420 280"
      role="img"
      aria-label={`${mode} unit square`}
      data-mode-canvas={mode}
      tabIndex={0}
      onPointerDown={(event) => {
        if (!onDrag) return;
        const box = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - box.left) / box.width) * 420;
        const y = ((event.clientY - box.top) / box.height) * 280;
        const which = Math.hypot(x - p1.x, y - p1.y) < Math.hypot(x - p2.x, y - p2.y) ? "e1" : "e2";
        onDrag(which, (x - ox) / u, (oy - y) / u);
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
    >
      <rect width="420" height="280" fill={canvasFill(dark, mode.includes("3D"))} />
      <ArrowDefs />
      <AxisGrid ox={ox} oy={oy} unit={u} dark={dark} transform={(x, y) => {
        const [tx, ty] = apply2(M, x, y);
        return { x: ox + tx * u, y: oy - ty * u };
      }} />
      {ghost ? <polygon points={`${ox},${oy} ${ox + u},${oy} ${ox + u},${oy - u} ${ox},${oy - u}`} fill="none" stroke="#94a3b8" strokeDasharray="4 3" /> : null}
      <polygon points={poly(M, ox, oy, u)} fill="rgba(20,125,242,.2)" stroke={LA_A} />
      <VectorRay x1={ox} y1={oy} x2={p1.x} y2={p1.y} color={LA_A} marker="la-a" />
      <VectorRay x1={ox} y1={oy} x2={p2.x} y2={p2.y} color={LA_B} marker="la-b" />
      <DragHandle x={p1.x} y={p1.y} fill={LA_A} label="Ae₁" />
      <DragHandle x={p2.x} y={p2.y} fill={LA_B} label="Ae₂" shape="square" />
      <text x="24" y="32" fill={ink(dark)} fontSize="14">{mode}: image of the unit square · k={fmt(k, 2)}</text>
    </svg>
  );
}

function LinearTransformsLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const fig = useStudioFigure({ e1x: 1.4, e1y: 0, e2x: 0, e2y: 1, k: 1.4 });
  const dark = useDarkCanvas();
  return (
    <Chrome page={page} toolbar={<FigureBar fig={fig} />}>
      {(mode) => {
        const preset = namedTransform(mode, fig.state.k);
        const M: Mat2 = mode === "Identity" || mode === "R90" || mode === "Scale X" || mode === "Shear"
          ? preset
          : [[fig.state.e1x, fig.state.e2x], [fig.state.e1y, fig.state.e2y]];
        return (
          <>
            <Panel title={mode}>
              <NudgeSlider label="Scale / shear" value={fig.state.k} min={0.2} max={2.5} step={0.05} onChange={(k) => fig.commit({ ...fig.state, k })} />
              <p className="msk-note">Columns of A are the images of e₁ and e₂. Drag the tips.</p>
            </Panel>
            <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
              <ExtraFrame
                mode={mode}
                extra={extra}
                fallback={<TransformCanvas mode={mode} M={M} k={fig.state.k} dark={dark} onDrag={(which, x, y) => fig.commit(which === "e1" ? { ...fig.state, e1x: x, e1y: y } : { ...fig.state, e2x: x, e2y: y })} />}
              />
              <FormulaBridge>The dashed square is the original; the filled parallelogram is A times that square.</FormulaBridge>
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color={LA_A} label="Image of e1" value={`(${fmt(M[0][0])}, ${fmt(M[1][0])})`} />
              <LiveRow color={LA_B} label="Image of e2" value={`(${fmt(M[0][1])}, ${fmt(M[1][1])})`} />
              <LiveRow color={LA_C} label="det A" value={fmt(det2(M))} />
              <ChallengeBox {...page.challenge} page={page} onCorrect={() => markLinearComplete(page.id)} />
            </aside>
          </>
        );
      }}
    </Chrome>
  );
}

function DeterminantsLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure({ a: 2, b: 0.6, c: 0, d: 1, pick: 0 });
  const dark = useDarkCanvas();
  const M: Mat2 = [[fig.state.a, fig.state.b], [fig.state.c, fig.state.d]];
  const det = det2(M);
  const minors = [fig.state.d, -fig.state.c, -fig.state.b, fig.state.a];
  return (
    <Chrome page={page} toolbar={<FigureBar fig={fig} />}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <NudgeSlider label="a₁₁" value={fig.state.a} min={-3} max={4} step={0.1} onChange={(a) => fig.commit({ ...fig.state, a })} />
            <NudgeSlider label="a₁₂" value={fig.state.b} min={-3} max={3} step={0.1} onChange={(b) => fig.commit({ ...fig.state, b })} />
            <NudgeSlider label="a₂₁" value={fig.state.c} min={-3} max={3} step={0.1} onChange={(c) => fig.commit({ ...fig.state, c })} />
            <NudgeSlider label="a₂₂" value={fig.state.d} min={-3} max={4} step={0.1} onChange={(d) => fig.commit({ ...fig.state, d })} />
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
            <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label={mode}>
              <rect width="420" height="240" fill={canvasFill(dark, mode === "3D Volume")} />
              <ArrowDefs />
              {mode === "3D Volume" ? (
                <path d={`M80 180 L${80 + fig.state.a * 40} 180 L${100 + fig.state.a * 40 + fig.state.b * 20} 120 L${140 + fig.state.a * 20} 80 L100 80 Z`} fill="rgba(245,158,11,.25)" stroke="#fbbf24" />
              ) : mode === "Cofactor" ? (
                <>
                  {([[40, 40, "a₁₁"], [140, 40, "a₁₂"], [40, 130, "a₂₁"], [140, 130, "a₂₂"]] as const).map(([x, y, label], i) => (
                    <g key={label} onClick={() => fig.commit({ ...fig.state, pick: i })}>
                      <rect x={x} y={y} width="80" height="80" fill={fig.state.pick === i ? "#fde68a" : "#dbeafe"} stroke={LA_A} />
                      <text x={x + 10} y={y + 45} fontSize="12">{label}</text>
                    </g>
                  ))}
                  <text x="240" y="90" fontSize="13">minor = {fmt(minors[fig.state.pick] ?? 0)}</text>
                </>
              ) : (
                <>
                  <polygon points={poly(M, 80, 180, 50)} fill={det >= 0 ? "rgba(16,185,129,.25)" : "rgba(239,68,68,.3)"} stroke={det >= 0 ? LA_D : "#ef4444"} />
                  <VectorRay x1={80} y1={180} x2={80 + M[0][0] * 50} y2={180 - M[1][0] * 50} color={det >= 0 ? LA_D : "#ef4444"} marker="la-d" />
                </>
              )}
              <text x="24" y="28" fill={ink(dark || mode === "3D Volume")} fontSize="13">{mode === "Singularity" ? "Shear toward det → 0" : mode === "Orientation" ? (det >= 0 ? "color: preserved" : "flip") : mode}</text>
            </svg>
            <FormulaBridge>Signed area of the parallelogram spanned by the columns is det A = {fmt(det)}. The boundary arrow reverses when det is negative.</FormulaBridge>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color={LA_C} label={mode === "3D Volume" ? "signed volume" : "det (signed area)"} value={fmt(det)} />
            <StatusOk>{Math.abs(det) < 0.15 ? "Singular · collapse" : det < 0 ? "Orientation reversed" : "Orientation preserved"}</StatusOk>
            <ChallengeBox {...page.challenge} page={page} onCorrect={() => markLinearComplete(page.id)} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function EigenLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const fig = useStudioFigure({ a: 1.6, b: 0.4, c: 0.2, d: 1.1, t: 40 });
  const dark = useDarkCanvas();
  const M: Mat2 = [[fig.state.a, fig.state.b], [fig.state.c, fig.state.d]];
  const spec = eigen2(M);
  const rad = fig.state.t * Math.PI / 180;
  const v: [number, number] = [Math.cos(rad), Math.sin(rad)];
  const Av = apply2(M, v[0], v[1]);
  const aligned = parallel2(v, Av);
  const lambda = Math.hypot(...v) > 1e-6 ? (v[0] * Av[0] + v[1] * Av[1]) / (v[0] * v[0] + v[1] * v[1]) : 0;
  const paths = phaseTrajectories(M);
  return (
    <Chrome page={page} toolbar={<FigureBar fig={fig} />}>
      {(mode) => (
        <>
          <Panel title="Probe vector">
            <NudgeSlider label="a₁₁" value={fig.state.a} min={-2} max={3} step={0.1} onChange={(a) => fig.commit({ ...fig.state, a })} />
            <NudgeSlider label="a₁₂" value={fig.state.b} min={-2} max={2} step={0.1} onChange={(b) => fig.commit({ ...fig.state, b })} />
            <NudgeSlider label="a₂₁" value={fig.state.c} min={-2} max={2} step={0.1} onChange={(c) => fig.commit({ ...fig.state, c })} />
            <NudgeSlider label="a₂₂" value={fig.state.d} min={-2} max={3} step={0.1} onChange={(d) => fig.commit({ ...fig.state, d })} />
            <NudgeSlider label="Angle" value={fig.state.t} min={0} max={180} step={1} onChange={(t) => fig.commit({ ...fig.state, t })} unit="°" />
            <p className="msk-note">{mode === "Phase Portrait" ? "Trajectories come from x' = Ax for this matrix." : "Glow on the eigenline when Av ∥ v."}</p>
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
                  tabIndex={0}
                  onPointerMove={(event: PointerEvent<SVGSVGElement>) => {
                    if (event.buttons === 0) return;
                    const box = event.currentTarget.getBoundingClientRect();
                    const x = event.clientX - box.left - box.width / 2;
                    const y = box.height / 2 - (event.clientY - box.top);
                    fig.commit({ ...fig.state, t: ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 180 });
                  }}
                >
                  <rect width="420" height="240" fill={canvasFill(dark, mode === "3D View")} />
                  <ArrowDefs />
                  {mode === "Phase Portrait" ? paths.map((pts, i) => (
                    <polyline key={i} fill="none" stroke={LA_B} opacity="0.55" points={pts.map(([x, y]) => `${210 + x * 28},${120 - y * 28}`).join(" ")} />
                  )) : <ellipse cx="210" cy="120" rx="90" ry="40" fill="none" stroke="#94a3b8" />}
                  {spec.vectors.map((vec, i) => (
                    <line key={i} x1={210 - vec[0] * 80} y1={120 + vec[1] * 50} x2={210 + vec[0] * 80} y2={120 - vec[1] * 50} stroke={LA_B} strokeWidth="3" />
                  ))}
                  <VectorRay x1={210} y1={120} x2={210 + v[0] * 80} y2={120 - v[1] * 50} color={LA_A} marker="la-a" />
                  <VectorRay x1={210} y1={120} x2={210 + Av[0] * 50} y2={120 - Av[1] * 32} color={aligned ? LA_D : LA_C} marker={aligned ? "la-d" : "la-c"} />
                  {aligned ? <circle cx={210 + v[0] * 80} cy={120 - v[1] * 50} r="10" fill={LA_D} opacity="0.35" /> : null}
                  {aligned ? <text x="24" y="28" fill={ink(dark)} fontSize="13">λ ≈ {fmt(lambda, 2)} on this eigenline</text> : <text x="24" y="28" fill={ink(dark)} fontSize="13">Av turns off the line of v</text>}
                </svg>
              )}
            />
            <FormulaBridge>Av = λv exactly on an eigenline. Gold is Av; blue is v.</FormulaBridge>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color={LA_B} label="Aligned when" value="Av ∥ v" />
            <LiveRow color={LA_D} label="λ estimate" value={fmt(lambda, 3)} />
            <LiveRow color={LA_A} label="spectrum" value={spec.complex ? "complex pair" : spec.values.map((n) => fmt(n, 2)).join(", ")} />
            <ChallengeBox {...page.challenge} page={page} onCorrect={() => markLinearComplete(page.id)} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function OrthoLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure({ ux: 3, uy: 1, vx: 2, vy: 0.4, gsStep: 3, playing: false });
  const dark = useDarkCanvas();
  const gs = gramSchmidt(fig.state.vx, fig.state.vy, fig.state.ux, fig.state.uy);
  const proj = (fig.state.ux * fig.state.vx + fig.state.uy * fig.state.vy) / ((fig.state.vx * fig.state.vx + fig.state.vy * fig.state.vy) || 1);
  useEffect(() => {
    if (!fig.state.playing || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      fig.commit((prev) => ({ ...prev, gsStep: prev.gsStep >= 3 ? 0 : prev.gsStep + 1 }));
    }, 900);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fig.state.playing]);
  return (
    <Chrome page={page} toolbar={<FigureBar fig={fig} />}>
      {(mode) => (
        <>
          <Panel title="Gram–Schmidt you drag">
            <NudgeSlider label="ux" value={fig.state.ux} min={-4} max={4} step={0.1} onChange={(ux) => fig.commit({ ...fig.state, ux })} />
            <NudgeSlider label="uy" value={fig.state.uy} min={-4} max={4} step={0.1} onChange={(uy) => fig.commit({ ...fig.state, uy })} />
            <NudgeSlider label="vx" value={fig.state.vx} min={-4} max={4} step={0.1} onChange={(vx) => fig.commit({ ...fig.state, vx })} />
            <NudgeSlider label="vy" value={fig.state.vy} min={-4} max={4} step={0.1} onChange={(vy) => fig.commit({ ...fig.state, vy })} />
            <div className="msk-seg" role="group" aria-label="Gram-Schmidt steps">
              {["v", "project", "subtract", "normalize"].map((label, i) => (
                <button key={label} type="button" className={fig.state.gsStep === i ? "active" : ""} onClick={() => fig.commit({ ...fig.state, gsStep: i, playing: false })}>{label}</button>
              ))}
            </div>
            <button type="button" className="msk-soft" onClick={() => fig.commit({ ...fig.state, playing: !fig.state.playing })}>{fig.state.playing ? "Pause" : "Play steps"}</button>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
            <svg className="msk-graph" viewBox="0 0 420 240" role="img" aria-label={mode}>
              <rect width="420" height="240" fill={canvasFill(dark, mode === "3D View")} />
              <ArrowDefs />
              <VectorRay x1={60} y1={180} x2={60 + fig.state.vx * 40} y2={180 - fig.state.vy * 40} color={LA_A} marker="la-a" />
              <VectorRay x1={60} y1={180} x2={60 + fig.state.ux * 30} y2={180 - fig.state.uy * 30} color={LA_B} marker="la-b" />
              {fig.state.gsStep >= 1 ? <VectorRay x1={60} y1={180} x2={60 + proj * fig.state.vx * 40} y2={180 - proj * fig.state.vy * 40} color={LA_C} width={6} marker="la-c" /> : null}
              {fig.state.gsStep >= 2 ? <VectorRay x1={60} y1={180} x2={60 + gs.residual[0] * 30} y2={180 - gs.residual[1] * 30} color={LA_C} dashed marker="la-c" /> : null}
              {fig.state.gsStep >= 3 ? <VectorRay x1={60} y1={180} x2={60 + gs.u1[0] * 80} y2={180 - gs.u1[1] * 80} color={LA_D} marker="la-d" /> : null}
            </svg>
            <FormulaBridge>Project onto v, subtract, then normalize. Residual · u1 stays 0.</FormulaBridge>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color={LA_C} label="residual ⊥ v" value={fmt(gs.residual[0] * gs.u1[0] + gs.residual[1] * gs.u1[1], 3)} />
            <LiveRow color={LA_D} label="u1 · u2" value={fmt(gs.u1[0] * gs.u2[0] + gs.u1[1] * gs.u2[1], 3)} />
            <ChallengeBox {...page.challenge} page={page} onCorrect={() => markLinearComplete(page.id)} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function LeastSquaresLab({ page }: { page: StudioMockupPage }) {
  const fig = useStudioFigure({ pts: [[1, 1.1], [2, 2.4], [3, 3.2], [4, 5.1]] as number[][] });
  const [drag, setDrag] = useState<number | null>(null);
  const dark = useDarkCanvas();
  const pts = fig.state.pts;
  const n = pts.length;
  const sx = pts.reduce((s, p) => s + (p[0] ?? 0), 0);
  const sy = pts.reduce((s, p) => s + (p[1] ?? 0), 0);
  const sxx = pts.reduce((s, p) => s + (p[0] ?? 0) ** 2, 0);
  const sxy = pts.reduce((s, p) => s + (p[0] ?? 0) * (p[1] ?? 0), 0);
  const m = (n * sxy - sx * sy) / (n * sxx - sx * sx || 1);
  const intercept = (sy - m * sx) / n;
  const mean = sy / n;
  const sse = pts.reduce((s, p) => s + ((p[1] ?? 0) - (m * (p[0] ?? 0) + intercept)) ** 2, 0);
  const sst = pts.reduce((s, p) => s + ((p[1] ?? 0) - mean) ** 2, 0) || 1;
  const rmse = Math.sqrt(sse / n);
  const r2 = 1 - sse / sst;
  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (drag === null) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width * 5.5, 0.4, 5);
    const y = clamp(8.5 - (event.clientY - rect.top) / rect.height * 8.5, 0.2, 8);
    fig.commit({ pts: pts.map((p, i) => (i === drag ? [x, y] : p)) });
  };
  return (
    <Chrome page={page} toolbar={<FigureBar fig={fig} />}>
      {(mode) => (
        <>
          <Panel title={mode}>
            <p className="msk-note">Drag points. Residual is orthogonal to the columns.</p>
            <button type="button" className="msk-soft" onClick={() => fig.commit({ pts: [...pts.slice(0, 3), [4.6, 7.8]] })}>Add outlier</button>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
            <svg
              className="msk-graph is-interactive"
              viewBox="0 0 420 240"
              role="img"
              aria-label="Least squares"
              onPointerMove={move}
              onPointerUp={() => setDrag(null)}
              onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
            >
              <rect width="420" height="240" fill={canvasFill(dark)} />
              <ArrowDefs />
              <line x1="40" y1={200 - intercept * 22} x2="400" y2={200 - (m * 5 + intercept) * 22} stroke={LA_B} />
              {pts.map(([x = 0, y = 0], i) => {
                const px = 40 + x * 70;
                const py = 200 - y * 22;
                const fy = 200 - (m * x + intercept) * 22;
                const h = Math.abs(py - fy);
                return (
                  <g key={i}>
                    {mode !== "Fit" ? <line x1={px} y1={py} x2={px} y2={fy} stroke={LA_C} /> : null}
                    {mode === "Residuals" ? <rect x={px} y={Math.min(py, fy)} width={h} height={h} fill="rgba(245,158,11,.2)" stroke={LA_C} /> : null}
                    <circle cx={px} cy={py} r="7" fill={LA_A} onPointerDown={() => setDrag(i)} />
                  </g>
                );
              })}
              {mode === "Column Space" ? (
                <>
                  <VectorRay x1={60} y1={210} x2={140} y2={80} color={LA_A} marker="la-a" />
                  <VectorRay x1={60} y1={210} x2={220} y2={120} color={LA_B} marker="la-b" />
                  <VectorRay x1={220} y1={120} x2={250} y2={40} color={LA_C} dashed marker="la-c" />
                  <text x="24" y="24" fontSize="12" fill={ink(dark)}>col(A) plane · residual ⊥ columns</text>
                </>
              ) : null}
            </svg>
            <FormulaBridge>The residual vector is orthogonal to the columns of the design matrix [1 x]. Gold squares are squared error.</FormulaBridge>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color={LA_B} label="RMSE" value={fmt(rmse, 3)} />
            <LiveRow color={LA_D} label="R²" value={fmt(r2, 3)} />
            <LiveRow color={LA_C} label="slope" value={fmt(m, 3)} />
            <ChallengeBox {...page.challenge} page={page} onCorrect={() => markLinearComplete(page.id)} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

function PlaygroundLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const fig = useStudioFigure({ stack: ["I", "R90"] as string[], k: 1.4 });
  const dark = useDarkCanvas();
  const presets = ["I", "R90", "Scale", "Shear"];
  const M = composeNamed(fig.state.stack, fig.state.k);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  return (
    <Chrome page={page} toolbar={<FigureBar fig={fig} />}>
      {(mode) => (
        <>
          <Panel title="Compose">
            {presets.map((item) => (
              <button key={item} type="button" className="msk-soft" onClick={() => fig.commit({ ...fig.state, stack: [...fig.state.stack, item] })}>+ {item}</button>
            ))}
            <NudgeSlider label="k" value={fig.state.k} min={0.4} max={2.2} step={0.05} onChange={(k) => fig.commit({ ...fig.state, k })} />
            <ol className="la-stack">
              {fig.state.stack.map((item, index) => (
                <li key={`${item}-${index}`}>
                  <button
                    type="button"
                    draggable
                    onDragStart={() => setDragFrom(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (dragFrom == null) return;
                      const next = [...fig.state.stack];
                      const [moved] = next.splice(dragFrom, 1);
                      if (moved) next.splice(index, 0, moved);
                      fig.commit({ ...fig.state, stack: next });
                      setDragFrom(null);
                    }}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ol>
            <p className="msk-note">Stack: {fig.state.stack.join(" ∘ ")} — left is applied last.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="linear-algebra" data-mode-canvas={mode}>
            <ExtraFrame mode={mode} extra={extra} fallback={<TransformCanvas mode={mode} M={M} k={fig.state.k} dark={dark || mode.includes("3D")} />} />
            <FormulaBridge>Composition is matrix product. det(stack) = {fmt(det2(M))}.</FormulaBridge>
          </section>
          <aside className="msk-panel msk-live">
            <LiveRow color={LA_E} label="det I" value="1" />
            <LiveRow color={LA_A} label="det composed" value={fmt(det2(M))} />
            <ChallengeBox {...page.challenge} page={page} onCorrect={() => markLinearComplete(page.id)} />
          </aside>
        </>
      )}
    </Chrome>
  );
}

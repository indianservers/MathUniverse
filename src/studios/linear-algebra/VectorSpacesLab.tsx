import { useState } from "react";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { StatusOk, clamp, fmt } from "../mockup/studioLabKit";
import { LinearAlgebraLabChrome } from "./LinearAlgebraLabChrome";
import { ArrowDefs, DragHandle, VectorRay, LA_A, LA_B, LA_C, LA_D, LA_E } from "./linearAlgebraCanvas";
import { iso3, matrixRank } from "./linearAlgebraLabMath";
import { areIndependent, coordinates, gramSchmidt } from "./vectorSpaceMath";

const initial = {
  v1: [1, 2, 1] as [number, number, number],
  v2: [0, 1, 1] as [number, number, number],
  v3: [1, -1, 1] as [number, number, number],
  c1: 1,
  c2: -0.5,
  c3: 0.25,
  on: [true, true, true] as boolean[],
};

export default function VectorSpacesLab({ page }: { page: StudioMockupPage }) {
  const [s, setS] = useState(initial);
  const cols = [s.v1, s.v2, s.v3].filter((_, i) => s.on[i]);
  const A = [
    [s.v1[0], s.v2[0], s.v3[0]],
    [s.v1[1], s.v2[1], s.v3[1]],
    [s.v1[2], s.v2[2], s.v3[2]],
  ];
  const selected = A.map((row) => row.filter((_, c) => Boolean(s.on[c])));
  const rank = selected[0]?.length ? matrixRank(selected) : 0;
  const dim = cols.length === 0 ? 0 : rank;
  const w: [number, number, number] = [
    s.c1 * s.v1[0] + s.c2 * s.v2[0] + s.c3 * s.v3[0],
    s.c1 * s.v1[1] + s.c2 * s.v2[1] + s.c3 * s.v3[1],
    s.c1 * s.v1[2] + s.c2 * s.v2[2] + s.c3 * s.v3[2],
  ];
  const independent2 = areIndependent(s.v1[0], s.v1[1], s.v2[0], s.v2[1]);
  const coords = coordinates(w[0], w[1], s.v1[0], s.v1[1], s.v2[0], s.v2[1]);
  const gs = gramSchmidt(s.v1[0], s.v1[1], s.v2[0], s.v2[1]);
  const basis = dim === cols.length && cols.length > 0;
  const ox = 250, oy = 220, u = 52;
  const p = (v: number[]) => iso3(v[0] ?? 0, v[1] ?? 0, v[2] ?? 0, ox, oy, u, 0.5);
  const o = p([0, 0, 0]);
  const plane = [p([-2, 0, -2]), p([2, 0, -2]), p([2, 2, 2]), p([-2, 2, 2])];

  return (
    <LinearAlgebraLabChrome page={page} pills>
      {(mode) => (
        <>
          <section className="la-col">
            <h2>Candidate vectors in R³</h2>
            {([["v₁", s.v1, LA_A, 0], ["v₂", s.v2, LA_B, 1], ["v₃", s.v3, LA_C, 2]] as const).map(([label, vec, color, i]) => (
              <label key={label} className="la-toggle">
                <input type="checkbox" checked={Boolean(s.on[i])} onChange={(event) => setS({ ...s, on: s.on.map((v, j) => (j === i ? event.target.checked : v)) })} />
                <span style={{ color }}>{label} [{fmt(vec[0], 0)}, {fmt(vec[1], 0)}, {fmt(vec[2], 0)}]</span>
              </label>
            ))}
            <h2>Show / hide</h2>
            <p className="la-note">Span (plane) · Coordinate axes · Grid · Projection to plane</p>
            <h2>Vector combination c₁v₁ + c₂v₂ + c₃v₃</h2>
            <label className="la-toggle"><span>c₁</span><input type="range" min={-2} max={2} step={0.05} value={s.c1} onChange={(event) => setS({ ...s, c1: Number(event.target.value) })} /></label>
            <label className="la-toggle"><span>c₂</span><input type="range" min={-2} max={2} step={0.05} value={s.c2} onChange={(event) => setS({ ...s, c2: Number(event.target.value) })} /></label>
            <label className="la-toggle"><span>c₃</span><input type="range" min={-2} max={2} step={0.05} value={s.c3} onChange={(event) => setS({ ...s, c3: Number(event.target.value) })} /></label>
            <p className="la-eq">w = ({fmt(w[0], 2)}, {fmt(w[1], 2)}, {fmt(w[2], 2)})</p>
            <p className="la-note">{independent2 ? "v₁, v₂ independent in the xy-shadow." : "Dependent in the plane."}</p>
          </section>
          <section className="la-canvas">
            <h2>{mode} in R³</h2>
            <svg className="msk-graph" viewBox="0 0 520 360" role="img" aria-label="Vector spaces">
              <rect width="520" height="360" fill="#f7fbff" />
              <ArrowDefs />
              <polygon points={plane.map((pt) => `${pt.x},${pt.y}`).join(" ")} fill="rgba(20,125,242,.12)" stroke="#93c5fd" />
              <VectorRay x1={o.x} y1={o.y} x2={p([3, 0, 0]).x} y2={p([3, 0, 0]).y} color="#94a3b8" marker="la-c" />
              <VectorRay x1={o.x} y1={o.y} x2={p([0, 3, 0]).x} y2={p([0, 3, 0]).y} color="#94a3b8" marker="la-c" />
              <VectorRay x1={o.x} y1={o.y} x2={p([0, 0, 3]).x} y2={p([0, 0, 3]).y} color="#94a3b8" marker="la-c" />
              {s.on[0] ? <VectorRay x1={o.x} y1={o.y} x2={p(s.v1).x} y2={p(s.v1).y} color={LA_A} marker="la-a" /> : null}
              {s.on[1] ? <VectorRay x1={o.x} y1={o.y} x2={p(s.v2).x} y2={p(s.v2).y} color={LA_B} marker="la-b" /> : null}
              {s.on[2] ? <VectorRay x1={o.x} y1={o.y} x2={p(s.v3).x} y2={p(s.v3).y} color={LA_C} marker="la-c" /> : null}
              <VectorRay x1={o.x} y1={o.y} x2={p(w).x} y2={p(w).y} color={LA_D} marker="la-d" />
              <DragHandle x={p(s.v1).x} y={p(s.v1).y} fill={LA_A} label="v₁" />
              <DragHandle x={p(s.v2).x} y={p(s.v2).y} fill={LA_B} label="v₂" />
              <DragHandle x={p(s.v3).x} y={p(s.v3).y} fill={LA_C} label="v₃" />
              <DragHandle x={p(w).x} y={p(w).y} fill={LA_D} label="w" />
            </svg>
            <p className="la-note">Span{s.on.filter(Boolean).length ? `(v₁, v₂, v₃)` : ""} is a {dim === 3 ? "space" : dim === 2 ? "plane" : "line"} (dim = {dim}) in R³. The vectors are {basis ? "a basis" : "linearly dependent"}.</p>
          </section>
          <aside className="la-live">
            <h2>Matrix with columns v₁, v₂, v₃</h2>
            <table className="la-sheet">
              <tbody>
                {A.map((row, r) => (
                  <tr key={r}>{row.map((cell, c) => <td key={c} className={c === 0 ? "is-c1" : c === 1 ? "is-c2" : "is-c3"}><output>{fmt(cell, 0)}</output></td>)}</tr>
                ))}
              </tbody>
            </table>
            <p className="la-eq">Rank(A) = {rank}</p>
            <p className="la-eq">dim(Span) = {dim}</p>
            <span className={`la-badge${basis ? "" : " is-bad"}`}>{basis ? "Vectors form a basis" : "Vectors do not form a basis"}</span>
            <div className="la-fold">
              <h3>Coordinate conversion</h3>
              <p className="la-eq">w ≈ ({fmt(w[0], 2)}, {fmt(w[1], 2)}, {fmt(w[2], 2)})</p>
              {coords ? <p className="la-eq">c₁ ≈ {fmt(coords.s, 3)} · c₂ ≈ {fmt(coords.t, 3)}</p> : <p className="la-eq">Least-squares coords in the plane</p>}
              <StatusOk>Exact (w lies in the span)</StatusOk>
            </div>
            <div className="la-fold">
              <h3>Subspace information</h3>
              <p className="la-eq">Type: {dim === 2 ? "Plane through origin" : dim === 3 ? "All of R³" : "Line through origin"}</p>
              <p className="la-eq">u₁ · u₂ = {fmt(gs.u1[0] * gs.u2[0] + gs.u1[1] * gs.u2[1], 3)}</p>
            </div>
            <p className="sr-only">{clamp(dim, 0, 3)}</p>
          </aside>
        </>
      )}
    </LinearAlgebraLabChrome>
  );
}

import { useState } from "react";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { StatusOk, clamp, fmt } from "../mockup/studioLabKit";
import { LinearAlgebraLabChrome } from "./LinearAlgebraLabChrome";
import { Card, SliderRow, Switch } from "./linearAlgebraUi";
import { LA_A, LA_B, LA_C, LA_D } from "./linearAlgebraCanvas";
import { matrixRank } from "./linearAlgebraLabMath";
import { MathArrow, MathParallelogram, StudioMath3D } from "../shared/studioMath3D";
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
  const [show, setShow] = useState({ span: true, axes: true, grid: true, proj: true });
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
  const wEnabled: [number, number, number] = [
    (s.on[0] ? s.c1 : 0) * s.v1[0] + (s.on[1] ? s.c2 : 0) * s.v2[0] + (s.on[2] ? s.c3 : 0) * s.v3[0],
    (s.on[0] ? s.c1 : 0) * s.v1[1] + (s.on[1] ? s.c2 : 0) * s.v2[1] + (s.on[2] ? s.c3 : 0) * s.v3[1],
    (s.on[0] ? s.c1 : 0) * s.v1[2] + (s.on[1] ? s.c2 : 0) * s.v2[2] + (s.on[2] ? s.c3 : 0) * s.v3[2],
  ];
  const leftover = Math.hypot(w[0] - wEnabled[0], w[1] - wEnabled[1], w[2] - wEnabled[2]);
  const inSpan = leftover < 1e-6;
  const independent2 = areIndependent(s.v1[0], s.v1[1], s.v2[0], s.v2[1]);
  const coords = coordinates(w[0], w[1], s.v1[0], s.v1[1], s.v2[0], s.v2[1]);
  const gs = gramSchmidt(s.v1[0], s.v1[1], s.v2[0], s.v2[1]);
  const basis = dim === cols.length && cols.length > 0;

  return (
    <LinearAlgebraLabChrome page={page} pills>
      {(mode) => (
        <>
          <div className="la-rail">
            <Card title="Candidate vectors in R³">
            {([["v₁", s.v1, LA_A, 0], ["v₂", s.v2, LA_B, 1], ["v₃", s.v3, LA_C, 2]] as const).map(([label, vec, color, i]) => (
              <label key={label} className="la-toggle">
                <input type="checkbox" checked={Boolean(s.on[i])} onChange={(event) => setS({ ...s, on: s.on.map((v, j) => (j === i ? event.target.checked : v)) })} />
                <span style={{ color }}>{label} [{fmt(vec[0], 0)}, {fmt(vec[1], 0)}, {fmt(vec[2], 0)}]</span>
              </label>
            ))}
            <label className="la-slider">
              <span>v₁ x</span>
              <input type="number" step={0.1} value={s.v1[0]} aria-label="v1 x" onChange={(event) => setS({ ...s, v1: [Number(event.target.value), s.v1[1], s.v1[2]] })} />
            </label>
            </Card>
            <Card title="Show / hide">
              <Switch label="Span (plane)" on={show.span} onChange={(span) => setShow({ ...show, span })} />
              <Switch label="Coordinate axes" on={show.axes} onChange={(axes) => setShow({ ...show, axes })} />
              <Switch label="Grid" on={show.grid} onChange={(grid) => setShow({ ...show, grid })} />
              <Switch label="Projection to plane" on={show.proj} onChange={(proj) => setShow({ ...show, proj })} />
            </Card>
            <Card title="Vector combination c₁v₁ + c₂v₂ + c₃v₃">
            <SliderRow label="c₁" value={s.c1} min={-2} max={2} step={0.05} onChange={(c1) => setS({ ...s, c1 })} />
            <SliderRow label="c₂" value={s.c2} min={-2} max={2} step={0.05} onChange={(c2) => setS({ ...s, c2 })} />
            <SliderRow label="c₃" value={s.c3} min={-2} max={2} step={0.05} onChange={(c3) => setS({ ...s, c3 })} />
            <p className="la-eq">w = ({fmt(w[0], 2)}, {fmt(w[1], 2)}, {fmt(w[2], 2)})</p>
            <p className="la-note">{independent2 ? "v₁, v₂ independent in the xy-shadow." : "Dependent in the plane."}</p>
            </Card>
          </div>
          <div className="la-center">
          <Card className="la-viz" title={`${mode} in R³`}>
            <StudioMath3D label="Vector spaces in R3">
              {show.span ? <MathParallelogram a={s.v1} b={s.v2} color="#147df2" /> : null}
              {s.on[0] ? <MathArrow to={s.v1} color={LA_A} /> : null}
              {s.on[1] ? <MathArrow to={s.v2} color={LA_B} /> : null}
              {s.on[2] ? <MathArrow to={s.v3} color={LA_C} /> : null}
              <MathArrow to={w} color={LA_D} />
              {show.proj && !inSpan ? <MathArrow to={wEnabled} color="#94a3b8" /> : null}
            </StudioMath3D>
            <p className="la-note">Span{s.on.filter(Boolean).length ? `(v₁, v₂, v₃)` : ""} is a {dim === 3 ? "space" : dim === 2 ? "plane" : "line"} (dim = {dim}) in R³. The vectors are {basis ? "a basis" : "linearly dependent"}.</p>
          </Card>
          </div>
          <div className="la-rail">
          <Card title="Matrix with columns v₁, v₂, v₃">
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
          </Card>
          <Card title="Coordinate conversion">
              <p className="la-eq">w ≈ ({fmt(w[0], 2)}, {fmt(w[1], 2)}, {fmt(w[2], 2)})</p>
              {coords ? <p className="la-eq">c₁ ≈ {fmt(coords.s, 3)} · c₂ ≈ {fmt(coords.t, 3)}</p> : <p className="la-eq">Least-squares coords in the plane</p>}
              {inSpan ? <StatusOk>Exact (w lies in the span)</StatusOk> : <p className="la-note">w is not in the span of the selected vectors (residual {fmt(leftover, 3)}).</p>}
          </Card>
          <Card title="Subspace information">
              <p className="la-eq">Type: {dim === 2 ? "Plane through origin" : dim === 3 ? "All of R³" : "Line through origin"}</p>
              <p className="la-eq">u₁ · u₂ = {fmt(gs.u1[0] * gs.u2[0] + gs.u1[1] * gs.u2[1], 3)}</p>
          </Card>
            <p className="sr-only">{clamp(dim, 0, 3)}</p>
          </div>
        </>
      )}
    </LinearAlgebraLabChrome>
  );
}

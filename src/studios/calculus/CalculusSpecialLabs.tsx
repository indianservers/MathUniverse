import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import MathExpression from "../../components/ui/MathExpression";
import { MathArrow, StudioMath3D, type Vec3 } from "../shared/studioMath3D";
import {
  betaFromGamma,
  betaIntegrand,
  betaNumeric,
  cylindricalPoint,
  gammaIntegrand,
  gammaNumeric,
  gammaWindowIntegral,
  polarPoint,
  sphericalPoint,
  squareToDiamond,
  trigPowerIntegral,
  wallisBeta,
} from "./specialCalculusMath";
import "../differential-equations/differentialEquations.css";

function AreaPlot({ curves, label }: { curves: Array<Array<{ x: number; y: number }>>; label: string }) {
  const mapX = (x: number) => 24 + ((x + 2) / 4) * 312;
  const mapY = (y: number) => 176 - ((y + 2) / 4) * 156;
  return (
    <svg className="odes-plot" viewBox="0 0 360 200" role="img" aria-label={label}>
      <line x1="24" y1={mapY(0)} x2="336" y2={mapY(0)} stroke="currentColor" opacity="0.35" />
      <line x1={mapX(0)} y1="16" x2={mapX(0)} y2="184" stroke="currentColor" opacity="0.35" />
      {curves.map((curve, index) => (
        <polyline key={index} fill="none" stroke={index % 2 === 0 ? "#0f766e" : "#b45309"} strokeWidth="1.4" points={curve.filter((point) => Math.abs(point.x) < 2.2 && Math.abs(point.y) < 2.2).map((point) => `${mapX(point.x)},${mapY(point.y)}`).join(" ")} />
      ))}
    </svg>
  );
}

function gridLines(map: (u: number, v: number) => { x: number; y: number }) {
  const lines: Array<Array<{ x: number; y: number }>> = [];
  for (let u = -1; u <= 1.01; u += 0.25) {
    lines.push(Array.from({ length: 17 }, (_, index) => map(u, -1 + index / 8)));
  }
  for (let v = -1; v <= 1.01; v += 0.25) {
    lines.push(Array.from({ length: 17 }, (_, index) => map(-1 + index / 8, v)));
  }
  return lines;
}

function IntegrandPlot({ values, label }: { values: number[]; label: string }) {
  const max = Math.max(...values, 0.2);
  const points = values.map((value, index) => `${20 + (index / (values.length - 1)) * 320},${170 - (value / max) * 140}`).join(" ");
  return (
    <svg className="odes-plot" viewBox="0 0 360 190" role="img" aria-label={label}>
      <polyline fill="none" stroke="#0f766e" strokeWidth="2" points={points} />
    </svg>
  );
}

function toThree(x: number, y: number, z: number): Vec3 {
  return [x, z, y];
}

export function JacobianLab({ mode }: { mode: string }) {
  const [u, setU] = useState(0.6);
  const [v, setV] = useState(0.4);
  const [r, setR] = useState(1.4);
  const [theta, setTheta] = useState(0.8);
  const [height, setHeight] = useState(0.8);
  const [rho, setRho] = useState(1.6);
  const [phi, setPhi] = useState(1.1);
  const [view, setView] = useState<"cartesian" | "polar" | "diamond">("polar");
  const cell = mode === "singular"
    ? { x: u * u, y: v, jacobian: 2 * u }
    : { x: (u + 0.35 * v), y: v, jacobian: 1 };
  const mapped = useMemo(() => gridLines((left, right) => mode === "singular" ? { x: left * left, y: right } : squareToDiamond(left, right)), [mode]);
  const source = useMemo(() => gridLines((left, right) => ({ x: left, y: right })), []);
  const polar = polarPoint(r, theta);
  const cylinder = cylindricalPoint(r, theta, height);
  const sphere = sphericalPoint(rho, phi, theta);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        {mode === "polar" ? (
          <>
            <h2>Polar cell</h2>
            <p><MathExpression value="x = r cos θ, y = r sin θ, ∂(x,y)/∂(r,θ) = r" /></p>
            <label>r <input aria-label="Radius" type="range" min={0.2} max={2} step={0.05} value={r} onChange={(event) => setR(Number(event.target.value))} /></label>
            <label>θ <input aria-label="Polar angle" type="range" min={0} max={6.2} step={0.05} value={theta} onChange={(event) => setTheta(Number(event.target.value))} /></label>
            <AreaPlot curves={[[{ x: 0, y: 0 }, polar]]} label="Point in Cartesian coordinates" />
            <p>Point ({polar.x.toFixed(2)}, {polar.y.toFixed(2)}). A rectangle dr dθ becomes a curved sector whose area scales by r, so dA = r dr dθ.</p>
          </>
        ) : mode === "cylindrical" ? (
          <>
            <h2>Cylindrical volume</h2>
            <p>Convention: x = r cos θ, y = r sin θ, z = z. Jacobian magnitude r. dV = r dr dθ dz.</p>
            <label>r <input aria-label="Cylinder radius" type="range" min={0.3} max={2} step={0.05} value={r} onChange={(event) => setR(Number(event.target.value))} /></label>
            <label>θ <input aria-label="Cylinder angle" type="range" min={0} max={6.2} step={0.05} value={theta} onChange={(event) => setTheta(Number(event.target.value))} /></label>
            <label>z <input aria-label="Cylinder height" type="range" min={-1.5} max={1.5} step={0.05} value={height} onChange={(event) => setHeight(Number(event.target.value))} /></label>
            <StudioMath3D label="Cylindrical coordinate point" compact camera={[4.2, 3.2, 4.8]}>
              <MathArrow to={toThree(cylinder.x, cylinder.y, cylinder.z)} color="#0f766e" />
            </StudioMath3D>
            <p>Cartesian ({cylinder.x.toFixed(2)}, {cylinder.y.toFixed(2)}, {cylinder.z.toFixed(2)}). |J| = {cylinder.jacobian.toFixed(2)}.</p>
          </>
        ) : mode === "spherical" ? (
          <>
            <h2>Spherical volume</h2>
            <p>Convention used in the geometry lessons: x = ρ sin φ cos θ, y = ρ sin φ sin θ, z = ρ cos φ. φ is measured from the positive z-axis. |J| = ρ² sin φ, so dV = ρ² sin φ dρ dφ dθ.</p>
            <label>ρ <input aria-label="Spherical radius" type="range" min={0.3} max={2} step={0.05} value={rho} onChange={(event) => setRho(Number(event.target.value))} /></label>
            <label>φ <input aria-label="Polar angle phi" type="range" min={0.15} max={3} step={0.05} value={phi} onChange={(event) => setPhi(Number(event.target.value))} /></label>
            <label>θ <input aria-label="Azimuth" type="range" min={0} max={6.2} step={0.05} value={theta} onChange={(event) => setTheta(Number(event.target.value))} /></label>
            <StudioMath3D label="Spherical coordinate point" compact camera={[4.2, 3.2, 4.8]}>
              <MathArrow to={toThree(sphere.x, sphere.y, sphere.z)} color="#b45309" />
            </StudioMath3D>
            <p>|J| = {sphere.jacobian.toFixed(3)}. At φ = 0 or π the volume element collapses.</p>
          </>
        ) : mode === "change" ? (
          <>
            <h2>Two representations</h2>
            <div className="odes-actions">
              <button type="button" onClick={() => setView("polar")}>Unit disk in polar</button>
              <button type="button" onClick={() => setView("diamond")}>Diamond in u, v</button>
              <button type="button" onClick={() => setView("cartesian")}>Source square</button>
            </div>
            <AreaPlot curves={view === "cartesian" ? source : view === "diamond" ? gridLines((left, right) => squareToDiamond(left, right)) : gridLines((radius, angle) => polarPoint(0.2 + 0.8 * (radius + 1) / 2, angle * Math.PI))} label="Region before or after the change of variables" />
            {view === "polar" ? <p>Over the unit disk, the integral of x² + y² becomes the polar integral of r² times the Jacobian r, from r = 0 to 1 and θ = 0 to 2π, which equals π/2.</p> : null}
            {view === "diamond" ? <p>u = x + y, v = x − y turns the diamond |x| + |y| ≤ 1 into the square max(|u|, |v|) ≤ 1. |J| = 1/2, and the areas match: 2 = 4 × 1/2.</p> : null}
            {view === "cartesian" ? <p>This is the uv square before either transformation.</p> : null}
          </>
        ) : mode === "singular" ? (
          <>
            <h2>Where J vanishes</h2>
            <p><MathExpression value="x = u^2, y = v, J = 2u" /></p>
            <label>u <input aria-label="Fold coordinate" type="range" min={-1.2} max={1.2} step={0.05} value={u} onChange={(event) => setU(Number(event.target.value))} /></label>
            <AreaPlot curves={mapped} label="Folded image of the uv square" />
            <p>At the selected cell, J = {cell.jacobian.toFixed(2)}. {Math.abs(cell.jacobian) < 0.08 ? "The local area collapses and the map is not invertible here." : "Away from u = 0 the map still stretches horizontally."}</p>
          </>
        ) : (
          <>
            <h2>Grid and its image</h2>
            <p>Map (u, v) to x = (u + v) / 2, y = (u − v) / 2. |J| = 1/2, so each uv cell loses half its area.</p>
            <AreaPlot curves={mapped} label="Image of a square grid" />
            <label>u <input aria-label="Source u" type="range" min={-1} max={1} step={0.05} value={u} onChange={(event) => setU(Number(event.target.value))} /></label>
            <label>v <input aria-label="Source v" type="range" min={-1} max={1} step={0.05} value={v} onChange={(event) => setV(Number(event.target.value))} /></label>
            <p>Selected cell around ({u.toFixed(2)}, {v.toFixed(2)}) lands at ({squareToDiamond(u, v).x.toFixed(2)}, {squareToDiamond(u, v).y.toFixed(2)}).</p>
          </>
        )}
      </section>
      <aside className="odes-side">
        <h2>What the determinant scales</h2>
        <p className="odes-note">A small uv rectangle of area du dv is sent to a region whose area is about |J| du dv. The sign of J records orientation.</p>
        <p><Link to="/calculus/multiple-integral-applications">Use this Jacobian in multiple integrals.</Link></p>
        <p><Link to="/calculus/change-order-integration">Changing the order of integration is a different rewrite of the same region.</Link></p>
      </aside>
    </div>
  );
}

export function BetaGammaLab({ mode }: { mode: string }) {
  const [s, setS] = useState(2);
  const [p, setP] = useState(2);
  const [q, setQ] = useState(3);
  const [m, setM] = useState(2);
  const [n, setN] = useState(2);
  const gammaValues = useMemo(() => Array.from({ length: 80 }, (_, index) => gammaIntegrand(s, 0.05 + (index / 79) * 10)), [s]);
  const betaValues = useMemo(() => Array.from({ length: 80 }, (_, index) => betaIntegrand(p, q, 0.02 + (index / 79) * 0.96)), [p, q]);
  const gamma = gammaNumeric(s);
  const window = gammaWindowIntegral(s, 10);
  return (
    <div className="odes-lab">
      <section className="odes-card">
        {mode === "beta" ? (
          <>
            <h2>Beta integrand</h2>
            <p><MathExpression value="B(p,q) = ∫_0^1 x^{p-1}(1-x)^{q-1} dx" /></p>
            <label>p <input aria-label="Beta p" type="range" min={0.6} max={5} step={0.1} value={p} onChange={(event) => setP(Number(event.target.value))} /></label>
            <label>q <input aria-label="Beta q" type="range" min={0.6} max={5} step={0.1} value={q} onChange={(event) => setQ(Number(event.target.value))} /></label>
            <IntegrandPlot values={betaValues} label="Beta integrand on (0,1)" />
            <p>B({p.toFixed(1)}, {q.toFixed(1)}) ≈ {betaNumeric(p, q).toFixed(4)}. B({q.toFixed(1)}, {p.toFixed(1)}) ≈ {betaNumeric(q, p).toFixed(4)}.</p>
            <p>Γ(p)Γ(q)/Γ(p+q) ≈ {betaFromGamma(p, q).toFixed(4)}.</p>
          </>
        ) : mode === "engineering" ? (
          <>
            <h2>A standard trig integral</h2>
            <p><MathExpression value="∫_0^{π/2} sin^{m-1}θ cos^{n-1}θ dθ = (1/2) B(m/2, n/2)" /></p>
            <label>m <input aria-label="Sine power parameter" type="range" min={1} max={6} step={0.2} value={m} onChange={(event) => setM(Number(event.target.value))} /></label>
            <label>n <input aria-label="Cosine power parameter" type="range" min={1} max={6} step={0.2} value={n} onChange={(event) => setN(Number(event.target.value))} /></label>
            <p>Direct integral ≈ {trigPowerIntegral(m, n).toFixed(4)}. Half Beta ≈ {wallisBeta(m, n).toFixed(4)}.</p>
            <p className="odes-note">The improper integral of sqrt(x) e to the −x, from 0 to infinity, is Γ(3/2) = √π / 2 ≈ {gammaNumeric(1.5).toFixed(4)}.</p>
          </>
        ) : (
          <>
            <h2>Gamma integrand</h2>
            <p><MathExpression value="Γ(s) = ∫_0^∞ x^{s-1} e^{-x} dx" /></p>
            <label>s <input aria-label="Gamma argument" type="range" min={0.5} max={5} step={0.1} value={s} onChange={(event) => setS(Number(event.target.value))} /></label>
            <IntegrandPlot values={gammaValues} label="Gamma integrand from 0 to 10" />
            <p>Visible-window integral ≈ {window.toFixed(3)}. Evaluated Γ({s.toFixed(1)}) ≈ {gamma.toFixed(4)}.</p>
            <p>Γ(s+1) ≈ {gammaNumeric(s + 1).toFixed(4)} and s Γ(s) ≈ {(s * gamma).toFixed(4)}.</p>
            <p>Presets: Γ(1) = {gammaNumeric(1).toFixed(3)}, Γ(2) = {gammaNumeric(2).toFixed(3)}, Γ(3) = {gammaNumeric(3).toFixed(3)}, Γ(1/2) = {gammaNumeric(0.5).toFixed(4)} against √π = {Math.sqrt(Math.PI).toFixed(4)}.</p>
          </>
        )}
      </section>
      <aside className="odes-side">
        <h2>Keep the parameters positive</h2>
        <p className="odes-note">Gamma and Beta, in these integral forms, need positive arguments. Nonpositive integers are poles of Gamma.</p>
        <p className="odes-warn">Common mistake: writing Γ(n) = n!. For a positive integer, Γ(n) = (n − 1)!.</p>
      </aside>
    </div>
  );
}

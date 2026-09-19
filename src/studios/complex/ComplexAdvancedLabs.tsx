import { useEffect, useMemo, useState } from "react";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { clamp, fmt } from "../mockup/studioLabKit";
import { ComplexLabChrome, CxCol, CxLive, CxSlider, CxStepper, CxToggle } from "./ComplexLabChrome";
import { ComplexPlane, CxDot, CxRay, CX_R, CX_W, CX_Z } from "./complexArgandCanvas";
import {
  addC, argC, divC, fmtC, fromPolar, invertC, mobius, modC, mulC, quadraticRoots, seriesRLC, subC, taylorExpITheta, type C,
} from "./complexLabMath";
import { EulerHelix, StudioMath3D } from "../shared/studioMath3D";

export function EulerLab({ page }: { page: StudioMockupPage }) {
  const [theta, setTheta] = useState(Math.PI);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [cycles, setCycles] = useState(3);
  const [terms, setTerms] = useState(7);
  const [showCircle, setShowCircle] = useState(true);
  const [showHelix, setShowHelix] = useState(true);
  const [showPoint, setShowPoint] = useState(true);
  const [showAxes, setShowAxes] = useState(true);
  const [grid, setGrid] = useState(true);
  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => setTheta((t) => (t + 0.04 * speed) % (Math.PI * 2)), 40);
    return () => window.clearInterval(id);
  }, [playing, speed]);
  useEffect(() => {
    const reset = () => {
      setTheta(Math.PI);
      setPlaying(false);
      setSpeed(1);
      setCycles(3);
      setTerms(7);
    };
    window.addEventListener("cx-lab-reset", reset);
    return () => window.removeEventListener("cx-lab-reset", reset);
  }, []);
  const c = Math.cos(theta);
  const s = Math.sin(theta);
  const approx = taylorExpITheta(theta, terms);
  const err = Math.hypot(approx.re - c, approx.im - s);
  const identity = Math.hypot(Math.cos(Math.PI) + 1, Math.sin(Math.PI));

  return (
    <ComplexLabChrome page={page} className="is-euler">
      {() => (
        <>
          <CxCol>
            <div className="cx-card">
              <div className="cx-kicker">Parameters</div>
              <CxSlider label="Angle θ (radians)" value={theta} min={0} max={Math.PI * 2} step={0.01} display={`${fmt(theta, 6)}`} onChange={setTheta} />
              <div className="cx-pi-marks" aria-hidden="true"><span>0</span><span>π</span><span>2π</span></div>
            </div>
            <div className="cx-card">
              <div className="cx-kicker">Animate e<sup>iθ</sup></div>
              <div className="cx-play">
                <button type="button" aria-pressed={playing} onClick={() => setPlaying((v) => !v)}>{playing ? "Pause" : "Play"}</button>
                <select aria-label="Animation speed" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}>
                  <option value={0.5}>0.5×</option>
                  <option value={1}>1.0×</option>
                  <option value={2}>2.0×</option>
                </select>
              </div>
            </div>
            <div className="cx-card">
              <div className="cx-kicker">Display options</div>
              <CxToggle label="Unit circle & projections" on={showCircle} onChange={setShowCircle} />
              <CxToggle label="Complex exponential (helix)" on={showHelix} onChange={setShowHelix} />
              <CxToggle label="Terminal point & trace" on={showPoint} onChange={setShowPoint} />
              <CxToggle label="Real & Imag axes" on={showAxes} onChange={setShowAxes} />
              <CxToggle label="Show grid" on={grid} onChange={setGrid} />
            </div>
            <div className="cx-card">
              <CxSlider label="Trace length" value={cycles} min={1} max={5} step={0.5} display={`${fmt(cycles, 1)} cycles`} onChange={setCycles} />
            </div>
            <div className="cx-card">
              <div className="cx-kicker">Approximation terms (Taylor series)</div>
              <CxStepper label="Terms" value={terms} min={1} max={16} step={1} digits={0} onChange={setTerms} />
            </div>
          </CxCol>
          <div className="cx-euler-grid">
            <figure className="cx-mini">
              <figcaption>1. Unit circle &amp; Argand plane</figcaption>
              <UnitCirclePanel theta={theta} c={c} s={s} showCircle={showCircle} showPoint={showPoint} showAxes={showAxes} grid={grid} />
            </figure>
            <figure className="cx-mini">
              <figcaption>2. Complex exponential helix</figcaption>
              <HelixPanel theta={theta} cycles={cycles} show={showHelix} />
            </figure>
            <figure className="cx-mini">
              <figcaption>3. Real &amp; imaginary projections</figcaption>
              <ProjectionPanel theta={theta} />
            </figure>
            <figure className="cx-mini">
              <figcaption>4. Trace on Argand plane</figcaption>
              <TracePanel theta={theta} cycles={cycles} showPoint={showPoint} />
            </figure>
          </div>
          <CxLive title="Live values">
            <p className="cx-eq">e<sup>iθ</sup></p>
            <p className="cx-eq is-ans">{fmt(c, 4)} + {fmt(s, 4)}i</p>
            <div className="cx-split">
              <p>Re<br /><strong>{fmt(c, 4)}</strong></p>
              <p>Im<br /><strong>{fmt(s, 4)}</strong></p>
            </div>
            <div className="cx-split">
              <p>|e<sup>iθ</sup>|<br /><strong>{fmt(Math.hypot(c, s), 4)}</strong></p>
              <p>arg(e<sup>iθ</sup>)<br /><strong>{Math.abs(theta - Math.PI) < 0.02 ? "π rad" : `${fmt(theta, 4)} rad`}</strong></p>
            </div>
            <h3>Polar form</h3>
            <p className="cx-eq">e<sup>iθ</sup> = 1 cis({Math.abs(theta - Math.PI) < 0.02 ? "π" : fmt(theta, 2)}) = cos({Math.abs(theta - Math.PI) < 0.02 ? "π" : fmt(theta, 2)}) + i sin({Math.abs(theta - Math.PI) < 0.02 ? "π" : fmt(theta, 2)})</p>
            <h3>Taylor series (about 0)</h3>
            <p className="cx-eq">e<sup>iθ</sup> = Σ (iθ)<sup>n</sup> / n!</p>
            <p className="cx-meta">{terms} terms · Error {err < 1e-8 ? "< 1.1 × 10⁻⁸" : fmt(err, 8)}</p>
            <p className="cx-eq">≈ {fmtC(approx, 4)}</p>
            <h3>Euler identity</h3>
            <p className="cx-ok">e<sup>iπ</sup> + 1 = {fmt(Math.cos(Math.PI) + 1, 4)} + {fmt(Math.sin(Math.PI), 4)}i = 0 · Verified {identity < 1e-10 ? "✓" : ""}</p>
            <h3>Key relationships</h3>
            <p className="cx-eq">cos θ = (e<sup>iθ</sup> + e<sup>−iθ</sup>) / 2</p>
            <p className="cx-eq">sin θ = (e<sup>iθ</sup> − e<sup>−iθ</sup>) / 2i</p>
          </CxLive>
        </>
      )}
    </ComplexLabChrome>
  );
}

function UnitCirclePanel({ theta, c, s, showCircle, showPoint, showAxes, grid }: { theta: number; c: number; s: number; showCircle: boolean; showPoint: boolean; showAxes: boolean; grid: boolean }) {
  return (
    <ComplexPlane label="Unit circle" width={320} height={280} xmin={-1.4} xmax={1.4} ymin={-1.4} ymax={1.4} showGrid={grid} showAxes={showAxes} showTicks>
      {({ x, y, u }) => (
        <>
          {showCircle ? <circle cx={x(0)} cy={y(0)} r={u} fill="none" stroke="#22d3ee" strokeWidth="2.4" /> : null}
          <CxRay x1={x(0)} y1={y(0)} x2={x(c)} y2={y(0)} color="#fb923c" width={3} />
          <CxRay x1={x(c)} y1={y(0)} x2={x(c)} y2={y(s)} color="#38bdf8" width={2} dashed />
          <CxRay x1={x(0)} y1={y(0)} x2={x(c)} y2={y(s)} color="#6366f1" width={2.4} />
          <text x={x(c / 2)} y={y(0) + 14} fontSize="11" fill="#ea580c">cos θ</text>
          <text x={x(0) - 28} y={y(s / 2)} fontSize="11" fill="#0284c7">sin θ</text>
          <text x={x(0.35 * Math.cos(theta / 2))} y={y(0.35 * Math.sin(theta / 2))} fontSize="12" fill="#f59e0b">θ</text>
          {showPoint ? <CxDot x={x(c)} y={y(s)} fill="#0ea5e9" label="e^{iθ}" /> : null}
        </>
      )}
    </ComplexPlane>
  );
}

function HelixPanel({ theta, cycles, show }: { theta: number; cycles: number; show: boolean }) {
  return (
    <StudioMath3D label="Complex exponential helix" compact camera={[3.4, 2.6, 4.6]}>
      {show ? <EulerHelix theta={theta} /> : null}
    </StudioMath3D>
  );
}

function ProjectionPanel({ theta }: { theta: number }) {
  const w = 320;
  const plot = (fn: (t: number) => number, color: string, y0: number) => {
    const pts = Array.from({ length: 80 }, (_, i) => {
      const t = (i / 79) * Math.PI * 3;
      return `${20 + (t / (Math.PI * 3)) * 280},${y0 - fn(t) * 28}`;
    });
    const x = 20 + (theta / (Math.PI * 3)) * 280;
    const y = y0 - fn(theta) * 28;
    return (
      <>
        <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.2" />
        <circle cx={x} cy={y} r="5" fill={color} />
      </>
    );
  };
  return (
    <svg className="cx-plane" viewBox="0 0 320 280" role="img" aria-label="Real and imaginary projections">
      <rect width="320" height="280" fill="#f7fbff" rx="18" />
      <text x="16" y="22" fontSize="12" fill="#0ea5e9">cos θ</text>
      <line x1="20" y1="70" x2="300" y2="70" stroke="#cbd5e1" />
      {plot(Math.cos, "#22d3ee", 70)}
      <text x="16" y="150" fontSize="12" fill="#8b5cf6">sin θ</text>
      <line x1="20" y1="200" x2="300" y2="200" stroke="#cbd5e1" />
      {plot(Math.sin, "#8b5cf6", 200)}
      <text x="18" y="268" fontSize="10" fill="#94a3b8">0</text>
      <text x="108" y="268" fontSize="10" fill="#94a3b8">π</text>
      <text x="198" y="268" fontSize="10" fill="#94a3b8">2π</text>
      <text x="278" y="268" fontSize="10" fill="#94a3b8">3π</text>
    </svg>
  );
}

function TracePanel({ theta, cycles, showPoint }: { theta: number; cycles: number; showPoint: boolean }) {
  const trail = Array.from({ length: 80 }, (_, i) => {
    const t = theta - ((79 - i) / 79) * Math.min(theta, cycles * 0.4);
    return t;
  }).filter((t) => t >= 0);
  return (
    <ComplexPlane label="Trace on Argand plane" width={320} height={280} xmin={-1.4} xmax={1.4} ymin={-1.4} ymax={1.4}>
      {({ x, y, u }) => (
        <>
          <circle cx={x(0)} cy={y(0)} r={u} fill="none" stroke="#22d3ee" strokeWidth="2.4" />
          <polyline
            fill="none"
            stroke="#93c5fd"
            strokeWidth="2"
            points={trail.map((t) => `${x(Math.cos(t))},${y(Math.sin(t))}`).join(" ")}
          />
          {showPoint ? <CxDot x={x(Math.cos(theta))} y={y(Math.sin(theta))} fill="#0ea5e9" /> : null}
        </>
      )}
    </ComplexPlane>
  );
}

const LOCUS_MODES = ["Circle Loci", "Line Loci", "Möbius", "Inversion", "Affine Map"] as const;

export function LociLab({ page }: { page: StudioMockupPage }) {
  const [cx, setCx] = useState(1);
  const [cy, setCy] = useState(-1);
  const [r, setR] = useState(2);
  const [th, setTh] = useState(1.23);
  const [playing, setPlaying] = useState(false);
  const [showLocus, setShowLocus] = useState(true);
  const [showCenter, setShowCenter] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [trail, setTrail] = useState(8);
  const [a, setA] = useState<C>({ re: 1, im: 1 });
  const [b, setB] = useState<C>({ re: 1, im: 0 });
  const [c, setC] = useState<C>({ re: 0, im: 1 });
  const [d, setD] = useState<C>({ re: 1, im: -1 });
  const [kind, setKind] = useState<"Möbius" | "Inversion" | "Affine" | "Rotation" | "Scaling">("Möbius");
  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => setTh((t) => (t + 0.04) % (Math.PI * 2)), 40);
    return () => window.clearInterval(id);
  }, [playing]);
  useEffect(() => {
    const toggle = () => setPlaying((v) => !v);
    const reset = () => { setCx(1); setCy(-1); setR(2); setTh(1.23); setPlaying(false); };
    window.addEventListener("cx-lab-animate", toggle);
    window.addEventListener("cx-lab-reset", reset);
    return () => {
      window.removeEventListener("cx-lab-animate", toggle);
      window.removeEventListener("cx-lab-reset", reset);
    };
  }, []);

  const map = (z: C): C => {
    if (kind === "Inversion") return invertC(z);
    if (kind === "Affine") return addC(mulC(a, z), b);
    if (kind === "Rotation") return mulC(fromPolar(1, (th * 180) / Math.PI), z);
    if (kind === "Scaling") return mulC({ re: r / 2, im: 0 }, z);
    return mobius(z, a, b, c, d);
  };

  return (
    <ComplexLabChrome page={page} pills className="is-loci">
      {(mode, setMode) => {
        const circle = mode === "Circle Loci" || mode === "Möbius" || mode === "Inversion" || mode === "Affine Map";
        const z: C = circle
          ? { re: cx + r * Math.cos(th), im: cy + r * Math.sin(th) }
          : { re: -2 + th, im: cy + 0.4 * th };
        const w = map(z);
        const samples = Array.from({ length: 64 }, (_, i) => {
          const t = (i / 64) * Math.PI * 2;
          const p = circle ? { re: cx + r * Math.cos(t), im: cy + r * Math.sin(t) } : { re: -2.2 + (i / 63) * 4.4, im: cy };
          return { z: p, w: map(p) };
        });
        const pole = c.re === 0 && c.im === 0 ? { re: Number.NaN, im: Number.NaN } : divC({ re: -d.re, im: -d.im }, c);
        const det = subC(mulC(a, d), mulC(b, c));
        const fixed = kind === "Möbius" ? quadraticRoots(c, addC(d, { re: -a.re, im: -a.im }), { re: -b.re, im: -b.im }) : [];
        return (
          <>
            <CxCol>
              <div className="cx-card">
                <div className="cx-kicker">Loci controls</div>
                <label className="cx-select">Locus type
                  <select aria-label="Locus type" value={mode} onChange={(event) => setMode(event.target.value)}>
                    {LOCUS_MODES.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <CxStepper label="Center a" value={cx} min={-3} max={3} onChange={setCx} />
                <CxStepper label="Center b" value={cy} min={-3} max={3} onChange={setCy} />
                <CxSlider label="Radius (r)" value={r} min={0.4} max={3} step={0.05} display={fmt(r, 2)} onChange={setR} />
                <CxSlider label="Parametric point z(θ)" value={th} min={0} max={Math.PI * 2} step={0.01} display={`${fmt(th, 2)} rad`} onChange={setTh} />
                <p className="cx-eq">z = c + r e<sup>iθ</sup></p>
                <div className="cx-ops">
                  <button type="button" aria-pressed={playing} onClick={() => setPlaying((v) => !v)}>{playing ? "Pause" : "Play"}</button>
                  <button type="button" onClick={() => { setCx(1); setCy(-1); setR(2); setTh(1.23); }}>Reset</button>
                </div>
              </div>
              <div className="cx-card">
                <div className="cx-kicker">Display</div>
                <CxToggle label="Show locus" on={showLocus} onChange={setShowLocus} />
                <CxToggle label="Show center" on={showCenter} onChange={setShowCenter} />
                <CxToggle label="Show mapping grid" on={showGrid} onChange={setShowGrid} />
                <CxSlider label="Trail length" value={trail} min={2} max={16} step={1} display={String(trail)} onChange={setTrail} />
              </div>
            </CxCol>
            <div className="cx-loci-planes">
              <figure className="cx-mini">
                <figcaption>Before (z-plane)</figcaption>
                <ComplexPlane label="z-plane" width={360} height={280} xmin={-2.6} xmax={3.2} ymin={-3} ymax={2.4} showGrid onPick={(re, im) => {
                    if (circle) setTh(Math.atan2(im - cy, re - cx));
                    else setTh(clamp(re + 2, 0, Math.PI * 2));
                  }}>
                  {({ x, y, u }) => (
                    <>
                      {showLocus && circle ? (
                        <circle cx={x(cx)} cy={y(cy)} r={r * u} fill="none" stroke="#22d3ee" strokeDasharray="6 5" />
                      ) : null}
                      {showLocus && !circle ? (
                        <line x1={x(-2.4)} y1={y(cy)} x2={x(3)} y2={y(cy)} stroke="#22d3ee" strokeDasharray="6 5" />
                      ) : null}
                      {showCenter && circle ? <CxDot x={x(cx)} y={y(cy)} fill="#147df2" label="c" /> : null}
                      <CxDot x={x(z.re)} y={y(z.im)} fill={CX_R} label="z" />
                    </>
                  )}
                </ComplexPlane>
              </figure>
              <figure className="cx-mini">
                <figcaption>After (w-plane)  w = f(z)</figcaption>
                <ComplexPlane label="w-plane" width={360} height={280} xmin={-3.2} xmax={3.6} ymin={-2.6} ymax={3.2} showGrid>
                  {({ x, y }) => (
                    <>
                      {showLocus ? (
                        <polyline fill="none" stroke="#8b5cf6" strokeWidth="2.2" points={samples.map((p) => `${x(p.w.re)},${y(p.w.im)}`).join(" ")} />
                      ) : null}
                      <CxDot x={x(w.re)} y={y(w.im)} fill={CX_W} label="w = f(z)" />
                    </>
                  )}
                </ComplexPlane>
              </figure>
              {showGrid ? (
                <svg className="cx-map-grid" viewBox="0 0 640 140" role="img" aria-label="Mapping grid">
                  {Array.from({ length: 16 * 2 }, (_, i) => {
                    const col = i % 16;
                    const row = Math.floor(i / 16);
                    const zx = -1.6 + col * 0.22;
                    const zy = row === 0 ? 0.45 : -0.45;
                    const wz = map({ re: zx, im: zy });
                    const x0 = 18 + col * 18;
                    const y0 = 36 + row * 48;
                    return (
                      <g key={i}>
                        <circle cx={x0} cy={y0} r="3" fill="#0ea5e9" />
                        <line x1={x0} y1={y0} x2={360 + wz.re * 22} y2={60 - wz.im * 14} stroke="#c4b5fd" strokeDasharray="3 3" />
                        <circle cx={360 + wz.re * 22} cy={60 - wz.im * 14} r="3" fill="#8b5cf6" />
                      </g>
                    );
                  })}
                  <text x="8" y="16" fontSize="11" fill="#64748b">Mapping Grid (sample points)</text>
                  <text x="560" y="130" fontSize="10" fill="#94a3b8">16 × 16 grid</text>
                </svg>
              ) : null}
            </div>
            <CxLive title="Live values">
              <p className="cx-eq">z = {fmtC(z, 3)}</p>
              <p className="cx-eq is-ans">w = f(z) = {fmtC(w, 3)}</p>
              <p className="cx-meta">|z| = {fmt(modC(z), 3)} · |w| = {fmt(modC(w), 3)}</p>
              <p className="cx-meta">arg(z) = {fmt((argC(z) * 180) / Math.PI, 1)}° · arg(w) = {fmt((argC(w) * 180) / Math.PI, 1)}°</p>
              <h3>Polar forms</h3>
              <p className="cx-eq">z = {fmt(modC(z), 3)} ∠ {fmt((argC(z) * 180) / Math.PI, 1)}°</p>
              <p className="cx-eq">w = {fmt(modC(w), 3)} ∠ {fmt((argC(w) * 180) / Math.PI, 1)}°</p>
              <h3>Fixed points</h3>
              {fixed.map((p, i) => <p key={i} className="cx-eq">z<sub>{i + 1}</sub> = {fmtC(p, 3)}</p>)}
              <h3>Domain check</h3>
              <p className={modC(addC(mulC(c, z), d)) < 1e-6 ? "cx-warn" : "cx-ok"}>
                Denominator (cz + d) = {fmtC(addC(mulC(c, z), d), 3)} {modC(addC(mulC(c, z), d)) < 1e-6 ? "= 0 pole" : "≠ 0"}
              </p>
              <p className="cx-meta">Pole at z = −d/c ≈ {Number.isFinite(pole.re) ? fmtC(pole, 3) : "∞"}</p>
              <h3>Explanation</h3>
              <p className="cx-note">Möbius transformations map circles and lines to circles and lines (or vice versa). Distances and angles are not preserved, but cross-ratios are.</p>
              <p className="cx-meta">Learn more</p>
            </CxLive>
            <section className="cx-xform">
              <h3>Transformation f(z)</h3>
              <div className="cx-ops">
                {(["Möbius", "Inversion", "Affine", "Rotation", "Scaling"] as const).map((item) => (
                  <button key={item} type="button" className={kind === item ? "active" : ""} onClick={() => setKind(item)}>
                    {item === "Möbius" ? "w = (az+b)/(cz+d)" : item === "Inversion" ? "w = 1/z" : item === "Affine" ? "w = αz + β" : item === "Rotation" ? "w = e^{iθ} z" : "w = kz"}
                  </button>
                ))}
              </div>
              <div className="cx-coeff">
                <CxStepper label="a" value={a.re} min={-3} max={3} onChange={(re) => setA({ ...a, re })} />
                <CxStepper label="ai" value={a.im} min={-3} max={3} onChange={(im) => setA({ ...a, im })} />
                <CxStepper label="b" value={b.re} min={-3} max={3} onChange={(re) => setB({ ...b, re })} />
                <CxStepper label="bi" value={b.im} min={-3} max={3} onChange={(im) => setB({ ...b, im })} />
                <CxStepper label="c" value={c.re} min={-3} max={3} onChange={(re) => setC({ ...c, re })} />
                <CxStepper label="ci" value={c.im} min={-3} max={3} onChange={(im) => setC({ ...c, im })} />
                <CxStepper label="d" value={d.re} min={-3} max={3} onChange={(re) => setD({ ...d, re })} />
                <CxStepper label="di" value={d.im} min={-3} max={3} onChange={(im) => setD({ ...d, im })} />
              </div>
              <p className="cx-eq">Determinant ad − bc = {fmtC(det, 3)} {modC(det) > 1e-8 ? "Valid (ad − bc ≠ 0)" : "Singular"}</p>
              <p className="cx-eq">w = (({fmtC(a, 2)})z + ({fmtC(b, 2)})) / (({fmtC(c, 2)})z + ({fmtC(d, 2)}))</p>
            </section>
          </>
        );
      }}
    </ComplexLabChrome>
  );
}

export function CircuitsLab({ page }: { page: StudioMockupPage }) {
  const [f, setF] = useState(60);
  const [R, setR] = useState(100);
  const [L, setL] = useState(0.15);
  const [Ccap, setCcap] = useState(0.0001);
  const [Vrms, setVrms] = useState(10);
  const [phiV, setPhiV] = useState(0);
  const [wt, setWt] = useState(45);
  const [cycles, setCycles] = useState(2);
  const [playing, setPlaying] = useState(false);
  const [grid, setGrid] = useState(true);
  const [labels, setLabels] = useState(true);
  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => setWt((t) => (t + 3) % 360), 40);
    return () => window.clearInterval(id);
  }, [playing]);
  const { w, xl, xc, X, zMag, phi, pf } = seriesRLC(f, R, L, Ccap);
  const Irms = Vrms / zMag;
  const vInst = Vrms * Math.SQRT2 * Math.sin((wt * Math.PI) / 180 + (phiV * Math.PI) / 180);
  const iInst = Irms * Math.SQRT2 * Math.sin((wt * Math.PI) / 180 + (phiV * Math.PI) / 180 - phi);
  const pInst = vInst * iInst;
  const energyL = 0.5 * L * (iInst ** 2);
  const energyC = 0.5 * Ccap * (vInst ** 2);

  return (
    <ComplexLabChrome page={page} className="is-waves">
      {(mode) => (
        <>
          <div className="cx-waves-top">
            <CxSlider label="Frequency f" value={f} min={10} max={1000} step={1} display={`${fmt(f, 0)} Hz`} onChange={setF} />
            <CxSlider label="R" value={R} min={1} max={1000} step={1} display={`${fmt(R, 0)} Ω`} onChange={setR} />
            <CxSlider label="L" value={L} min={0.001} max={1} step={0.001} display={`${fmt(L * 1000, 0)} mH`} onChange={setL} />
            <CxSlider label="C" value={Ccap} min={1e-6} max={0.001} step={1e-6} display={`${fmt(Ccap * 1e6, 0)} μF`} onChange={setCcap} />
            <div>
              <CxStepper label="Source Vrms" value={Vrms} min={1} max={50} step={1} digits={0} onChange={setVrms} />
              <CxStepper label="∠ V" value={phiV} min={-180} max={180} step={1} digits={0} onChange={setPhiV} />
            </div>
          </div>
          <section className="cx-waves-phasor">
            <h2>Phasor diagram</h2>
            <CxToggle label="Show grid" on={grid} onChange={setGrid} />
            <CxToggle label="Show values" on={labels} onChange={setLabels} />
            <PhasorFigure R={R} xl={xl} xc={xc} I={Irms} V={Vrms} phi={phi} grid={grid} labels={labels} wt={wt} />
          </section>
          <section className="cx-waves-time">
            <h2>Time-domain waves</h2>
            <p className="cx-meta">φ = {fmt((phi * 180) / Math.PI, 2)}° (current {phi > 0 ? "lags" : "leads"} voltage)</p>
            <WavePlot Vrms={Vrms} Irms={Irms} phi={phi} wt={wt} cycles={cycles} />
            <div className="cx-play">
              <CxSlider label="ωt" value={wt} min={0} max={360} step={1} display={`${fmt(wt, 1)}°`} onChange={setWt} />
              <select aria-label="Cycles" value={cycles} onChange={(event) => setCycles(Number(event.target.value))}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
              <button type="button" aria-pressed={playing} onClick={() => setPlaying((v) => !v)}>{playing ? "Pause" : "Play"}</button>
            </div>
          </section>
          <CxLive title="Live complex values">
            <p>Impedance Z <strong>{fmt(R, 2)} {X < 0 ? "−" : "+"} j{fmt(Math.abs(X), 2)} Ω</strong></p>
            <p>|Z| <strong>{fmt(zMag, 2)} Ω</strong></p>
            <p>Angle ∠Z <strong>{fmt((phi * 180) / Math.PI, 2)}°</strong></p>
            <p>Current I <strong>{fmt(Irms, 2)} ∠ {fmt(phiV - (phi * 180) / Math.PI, 2)}° A</strong></p>
            <p>Voltage V <strong>{fmt(Vrms, 2)} ∠ {fmt(phiV, 1)}° V</strong></p>
            <p>Power (complex) S <strong>{fmt(Vrms * Irms, 2)} ∠ {fmt((phi * 180) / Math.PI, 2)}° VA</strong></p>
            <p>Real Power P <strong>{fmt(Vrms * Irms * pf, 2)} W</strong></p>
            <p>Reactive Power Q <strong>{fmt(Vrms * Irms * Math.sin(phi), 2)} var</strong></p>
            <p>Power Factor <strong>{fmt(pf, 3)} ({phi > 0 ? "lagging" : "leading"})</strong></p>
            <h3>Explanation</h3>
            <p className="cx-note">The current {phi > 0 ? "lags" : "leads"} the voltage by the impedance angle ∠Z = {fmt((phi * 180) / Math.PI, 2)}° because {Math.abs(xl) > Math.abs(xc) ? "inductive reactance is larger than capacitive" : "capacitive reactance is larger than inductive"}.</p>
            <p className="cx-note">Power factor = cos(∠Z) = {fmt(pf, 3)} {phi > 0 ? "lagging" : "leading"}.</p>
            <h3>Key formulas</h3>
            <p className="cx-eq">Z = R + j(ωL − 1/ωC)</p>
            <p className="cx-eq">I = V / Z</p>
            <p className="cx-eq">S = VI* = P + jQ</p>
            {mode === "Impedance" ? <p className="cx-meta">Impedance mode isolates Z, XL and XC.</p> : null}
            {mode === "AC Circuits" ? <p className="cx-meta">Series RLC: one current through R, L and C.</p> : null}
            {mode === "Signal Rotation" ? <p className="cx-meta">ωt rotates every phasor together on the Argand plane.</p> : null}
          </CxLive>
          <section className="cx-waves-rlc">
            <h2>RLC circuit (series)</h2>
            <svg viewBox="0 0 420 140" className="cx-plane" role="img" aria-label="Series RLC">
              <rect x="20" y="40" width="70" height="36" rx="8" fill="#fff" stroke="#94a3b8" />
              <text x="34" y="62" fontSize="12">V∠0°</text>
              <line x1="90" y1="58" x2="130" y2="58" stroke="#0f172a" />
              <rect x="130" y="46" width="70" height="24" fill="none" stroke="#0ea5e9" strokeWidth="2" />
              <text x="156" y="40" fontSize="12">R</text>
              <text x="148" y="86" fontSize="11">{fmt(R, 0)} Ω</text>
              <line x1="200" y1="58" x2="230" y2="58" stroke="#0f172a" />
              <path d="M230 58 h8 l6 -14 8 28 8 -28 8 28 6 -14 h8" fill="none" stroke="#8b5cf6" strokeWidth="2" />
              <text x="248" y="40" fontSize="12">L</text>
              <text x="236" y="86" fontSize="11">{fmt(L * 1000, 0)} mH</text>
              <line x1="282" y1="58" x2="310" y2="58" stroke="#0f172a" />
              <line x1="318" y1="40" x2="318" y2="76" stroke="#f59e0b" strokeWidth="2" />
              <line x1="328" y1="40" x2="328" y2="76" stroke="#f59e0b" strokeWidth="2" />
              <text x="316" y="34" fontSize="12">C</text>
              <text x="300" y="96" fontSize="11">{fmt(Ccap * 1e6, 0)} μF</text>
              <line x1="328" y1="58" x2="380" y2="58" stroke="#0f172a" />
              <line x1="380" y1="58" x2="380" y2="110" stroke="#0f172a" />
              <line x1="380" y1="110" x2="20" y2="110" stroke="#0f172a" />
              <line x1="20" y1="110" x2="20" y2="58" stroke="#0f172a" />
              <text x="140" y="128" fontSize="12">ω = 2πf = {fmt(w, 0)} rad/s</text>
            </svg>
          </section>
          <section className="cx-waves-tri">
            <h2>Impedance triangle</h2>
            <svg viewBox="0 0 320 160" className="cx-plane" role="img" aria-label="Impedance triangle">
              <polygon points="40,130 240,130 240,40" fill="rgba(251,191,36,.2)" stroke="#f59e0b" strokeWidth="2" />
              <text x="110" y="148" fontSize="12">R = {fmt(R, 2)} Ω</text>
              <text x="248" y="90" fontSize="12">X = {fmt(X, 2)} Ω</text>
              <text x="90" y="70" fontSize="12">|Z| = {fmt(zMag, 2)} Ω</text>
              <text x="150" y="122" fontSize="12">{fmt((phi * 180) / Math.PI, 2)}°</text>
              <text x="16" y="20" fontSize="12">X_L = ωL = {fmt(xl, 2)}</text>
              <text x="16" y="36" fontSize="12">X_C = 1/ωC = {fmt(xc, 2)}</text>
            </svg>
          </section>
          <div className="cx-waves-inst">
            <h2>Instantaneous values (at ωt = {fmt(wt, 1)}°)</h2>
            <p>v(t) <strong>{fmt(vInst, 3)} V</strong></p>
            <p>i(t) <strong>{fmt(iInst, 3)} A</strong></p>
            <p>Instantaneous Power p(t) <strong>{fmt(pInst, 2)} W</strong></p>
            <p>Energy in L <strong>{fmt(energyL * 1000, 2)} mJ</strong></p>
            <p>Energy in C <strong>{fmt(energyC * 1000, 2)} mJ</strong></p>
          </div>
        </>
      )}
    </ComplexLabChrome>
  );
}

function PhasorFigure({ R, xl, xc, I, V, phi, grid, labels, wt }: { R: number; xl: number; xc: number; I: number; V: number; phi: number; grid: boolean; labels: boolean; wt: number }) {
  const rot = (wt * Math.PI) / 180;
  const scale = 6;
  const VR = I * R;
  const VL = I * xl;
  const VC = I * xc;
  const pt = (mag: number, ang: number) => {
    const a = ang + rot;
    return { x: 210 + mag * scale * Math.cos(a), y: 150 - mag * scale * Math.sin(a) };
  };
  const v = pt(V, 0);
  const i = pt(I * 8, -phi);
  const jxl = pt(VL, Math.PI / 2);
  const jxc = pt(VC, -Math.PI / 2);
  return (
    <svg className="cx-plane" viewBox="0 0 420 300" role="img" aria-label="Phasor diagram">
      <rect width="420" height="300" fill="#f7fbff" rx="18" />
      {grid ? Array.from({ length: 7 }, (_, n) => <circle key={n} cx="210" cy="150" r={(n + 1) * 18} fill="none" stroke="#e2e8f0" />) : null}
      <line x1="20" y1="150" x2="400" y2="150" stroke="#94a3b8" />
      <line x1="210" y1="16" x2="210" y2="284" stroke="#94a3b8" />
      <text x="392" y="144" fontSize="12">Re</text>
      <text x="216" y="22" fontSize="12">Im</text>
      <line x1="210" y1="150" x2={v.x} y2={v.y} stroke="#fb923c" strokeWidth="2.6" markerEnd="url(#cx-r)" />
      <line x1="210" y1="150" x2={i.x} y2={i.y} stroke="#f59e0b" strokeWidth="2.6" />
      <line x1="210" y1="150" x2={jxl.x} y2={jxl.y} stroke="#8b5cf6" strokeWidth="2.2" />
      <line x1="210" y1="150" x2={jxc.x} y2={jxc.y} stroke="#22d3ee" strokeWidth="2.2" />
      {labels ? (
        <>
          <text x={v.x + 6} y={v.y} fontSize="11" fill="#ea580c">V {fmt(V, 2)}∠0°</text>
          <text x={i.x + 6} y={i.y} fontSize="11" fill="#d97706">I {fmt(I, 2)}∠{fmt((-phi * 180) / Math.PI, 2)}°</text>
          <text x={jxl.x + 4} y={jxl.y} fontSize="11" fill="#7c3aed">jX_L I</text>
          <text x={jxc.x + 4} y={jxc.y} fontSize="11" fill="#0e7490">−jX_C I</text>
        </>
      ) : null}
      <text x="300" y="28" fontSize="12">ωt = {fmt(wt, 1)}°</text>
    </svg>
  );
}

function WavePlot({ Vrms, Irms, phi, wt, cycles }: { Vrms: number; Irms: number; phi: number; wt: number; cycles: number }) {
  const vp = Vrms * Math.SQRT2;
  const ip = Irms * Math.SQRT2 * 8;
  const pts = (amp: number, shift: number) => Array.from({ length: 120 }, (_, i) => {
    const t = (i / 119) * cycles * Math.PI * 2;
    return `${20 + (i / 119) * 360},${80 - Math.sin(t + shift) * amp}`;
  }).join(" ");
  const cursor = 20 + (wt / 360) * 360;
  return (
    <svg className="cx-plane" viewBox="0 0 400 160" role="img" aria-label="Voltage and current waves">
      <rect width="400" height="160" fill="#f7fbff" rx="16" />
      <line x1="20" y1="80" x2="380" y2="80" stroke="#cbd5e1" />
      <polyline points={pts(vp * 3.2, 0)} fill="none" stroke="#22d3ee" strokeWidth="2.2" />
      <polyline points={pts(Math.min(48, ip), -phi)} fill="none" stroke="#fb923c" strokeWidth="2.2" />
      <line x1={cursor} y1="16" x2={cursor} y2="144" stroke="#94a3b8" strokeDasharray="4 3" />
      <text x="24" y="18" fontSize="11" fill="#0ea5e9">Voltage v(t)</text>
      <text x="120" y="18" fontSize="11" fill="#ea580c">Current i(t)</text>
    </svg>
  );
}

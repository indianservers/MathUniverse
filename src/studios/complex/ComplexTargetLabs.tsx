import { useEffect, useState } from "react";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { clamp, fmt } from "../mockup/studioLabKit";
import { ComplexLabChrome, CxCanvas, CxCol, CxLive, CxSlider, CxStepper, CxToggle } from "./ComplexLabChrome";
import { ComplexPlane, CxDot, CxRay, CX_R, CX_W, CX_Z } from "./complexArgandCanvas";
import { addC, argC, conjC, divC, fmtC, fmtSigned, fromPolar, modC, mulC, nthRoots, subC, wrapDeg, type C } from "./complexLabMath";

const OPS = ["Add", "Subtract", "Multiply", "Divide", "Conj"] as const;

function resultOf(mode: string, z1: C, z2: C): C {
  if (mode === "Subtract") return subC(z1, z2);
  if (mode === "Multiply") return mulC(z1, z2);
  if (mode === "Divide") return divC(z1, z2);
  if (mode === "Conjugate" || mode === "Conj") return conjC(z1);
  return addC(z1, z2);
}

export function ComplexArithmeticLab({ page }: { page: StudioMockupPage }) {
  const [z1, setZ1] = useState<C>({ re: 2.5, im: 1.5 });
  const [z2, setZ2] = useState<C>({ re: -1, im: 2 });
  const [grid, setGrid] = useState(true);
  const [axes, setAxes] = useState(true);
  const [ticks, setTicks] = useState(true);
  const [para, setPara] = useState(true);
  const [proj, setProj] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  return (
    <ComplexLabChrome page={page}>
      {(mode, setMode) => {
        const op = OPS.includes(mode as typeof OPS[number]) || mode === "Conjugate" ? mode : "Add";
        const res = resultOf(op, z1, z2);
        const showPara = para && (op === "Add" || op === "Subtract");
        return (
          <>
            <CxCol>
              <div className="cx-card">
                <div className="cx-kicker">Operation</div>
                <div className="cx-ops" role="group" aria-label="Complex operation">
                  {OPS.map((item) => {
                    const key = item === "Conj" ? "Conjugate" : item;
                    const on = key === op || item === op;
                    return (
                      <button key={item} type="button" className={on ? "active" : ""} aria-pressed={on} onClick={() => setMode(key)}>
                        {item === "Add" ? "+ Add" : item === "Subtract" ? "− Subtract" : item === "Multiply" ? "× Multiply" : item === "Divide" ? "÷ Divide" : "Conj"}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="cx-card">
                <div className="cx-kicker">Vectors (drag points)</div>
                <div className="cx-vec" data-tone="z">
                  <strong>z₁ = a + bi</strong>
                  <CxStepper label="a" value={z1.re} min={-4} max={4} onChange={(re) => setZ1({ ...z1, re })} />
                  <CxStepper label="b" value={z1.im} min={-4} max={4} onChange={(im) => setZ1({ ...z1, im })} />
                </div>
                <div className="cx-vec" data-tone="w">
                  <strong>z₂ = c + di</strong>
                  <CxStepper label="c" value={z2.re} min={-4} max={4} onChange={(re) => setZ2({ ...z2, re })} />
                  <CxStepper label="d" value={z2.im} min={-4} max={4} onChange={(im) => setZ2({ ...z2, im })} />
                </div>
              </div>
              <div className="cx-card">
                <div className="cx-kicker">Visual options</div>
                <CxToggle label="Show grid" on={grid} onChange={setGrid} />
                <CxToggle label="Show labels" on={ticks} onChange={setTicks} />
                <CxToggle label="Show parallelogram (sum)" on={para} onChange={setPara} />
                <CxToggle label="Show component projections" on={proj} onChange={setProj} />
                <CxToggle label="Show axes" on={axes} onChange={setAxes} />
              </div>
              <div className="cx-card">
                <div className="cx-kicker">Animation</div>
                <div className="cx-play">
                  <button type="button" aria-pressed={playing} onClick={() => setPlaying((v) => !v)}>{playing ? "Pause" : "Play"}</button>
                  <input type="range" min={0.25} max={2} step={0.25} value={speed} aria-label="Animation speed" onChange={(event) => setSpeed(Number(event.target.value))} />
                  <span>{speed.toFixed(1)} ×</span>
                </div>
              </div>
            </CxCol>
            <CxCanvas
              title="Argand Plane"
              tools={(
                <span className="cx-canvas-tools">
                  <button type="button" className={grid ? "active" : ""} onClick={() => setGrid((v) => !v)}>Grid</button>
                  <button type="button" className={axes ? "active" : ""} onClick={() => setAxes((v) => !v)}>Axes</button>
                  <button type="button" className={ticks ? "active" : ""} onClick={() => setTicks((v) => !v)}>Ticks</button>
                  <button type="button" aria-label="Zoom fit" onClick={() => { setZ1({ re: 2.5, im: 1.5 }); setZ2({ re: -1, im: 2 }); }}>Zoom fit</button>
                </span>
              )}
            >
              <ArithmeticFigure z1={z1} z2={z2} res={res} op={op} showGrid={grid} showAxes={axes} showTicks={ticks} showPara={showPara} showProj={proj} onZ1={setZ1} onZ2={setZ2} />
              <ul className="cx-legend">
                <li><i style={{ background: CX_Z }} />z₁</li>
                <li><i style={{ background: CX_W }} />z₂</li>
                <li><i style={{ background: CX_R }} />{op === "Add" ? "z₁ + z₂" : op === "Subtract" ? "z₁ − z₂" : op === "Multiply" ? "z₁ × z₂" : op === "Divide" ? "z₁ ÷ z₂" : "conjugate"}</li>
                <li><i className="is-dash" />Parallelogram</li>
              </ul>
            </CxCanvas>
            <CxLive title={`Result (${op === "Conjugate" ? "conjugate" : op.toLowerCase()})`} badge={<span className="cx-badge">Exact</span>}>
              <p className="cx-eq">{op === "Add" ? "z₁ + z₂" : op === "Subtract" ? "z₁ − z₂" : op === "Multiply" ? "z₁ × z₂" : op === "Divide" ? "z₁ ÷ z₂" : "conj(z₁)"} = ({fmt(z1.re, 2)} + {fmt(z1.im, 2)}i) {op === "Add" ? "+" : op === "Subtract" ? "−" : op === "Multiply" ? "×" : op === "Divide" ? "÷" : ""} {op === "Conjugate" ? "" : `(${fmt(z2.re, 2)} + ${fmt(z2.im, 2)}i)`}</p>
              <p className="cx-eq is-ans">= {fmtC(res)}</p>
              <h3>Polar form</h3>
              <p className="cx-eq">r = √({fmt(res.re, 2)}² + {fmt(res.im, 2)}²) = {fmt(modC(res), 4)}</p>
              <p className="cx-eq">θ = atan2({fmt(res.im, 2)}, {fmt(res.re, 2)}) = {fmt(wrapDeg(argC(res) * 180 / Math.PI), 4)}°</p>
              <p className="cx-eq">{fmt(argC(res), 4)} rad</p>
              <h3>Interpretation</h3>
              <p className="cx-note">{op === "Add" ? "The sum is the diagonal of the parallelogram formed by z₁ and z₂." : op === "Multiply" ? "Multiply moduli and add arguments." : op === "Divide" ? "Divide moduli and subtract arguments." : op === "Subtract" ? "Subtraction is the vector from z₂ to z₁." : "Conjugation reflects across the real axis."}</p>
              <MiniSum z1={z1} z2={z2} res={res} />
              <h3>Algebra (component form)</h3>
              <p className="cx-eq">(a + bi) + (c + di) = (a + c) + (b + d)i</p>
              <p className="cx-eq">= ({fmt(z1.re, 2)} + ({fmt(z2.re, 2)})) + ({fmt(z1.im, 2)} + {fmt(z2.im, 2)})i</p>
              <p className="cx-eq is-ans">= {fmtC(addC(z1, z2))}</p>
            </CxLive>
          </>
        );
      }}
    </ComplexLabChrome>
  );
}

function MiniSum({ z1, z2, res }: { z1: C; z2: C; res: C }) {
  return (
    <svg className="cx-mini-sum" viewBox="0 0 220 90" aria-hidden="true">
      <line x1="20" y1="70" x2="200" y2="70" stroke="#cbd5e1" />
      <line x1="30" y1="80" x2="30" y2="12" stroke="#cbd5e1" />
      <line x1="30" y1="70" x2={30 + z1.re * 18} y2={70 - z1.im * 18} stroke={CX_Z} strokeWidth="2.2" />
      <line x1="30" y1="70" x2={30 + z2.re * 18} y2={70 - z2.im * 18} stroke={CX_W} strokeWidth="2.2" />
      <line x1="30" y1="70" x2={30 + res.re * 18} y2={70 - res.im * 18} stroke={CX_R} strokeWidth="2.2" />
      <text x="160" y="22" fontSize="11" fill={CX_W}>z₂</text>
      <text x="150" y="48" fontSize="11" fill={CX_R}>z₁ + z₂</text>
      <text x="110" y="82" fontSize="11" fill={CX_Z}>z₁</text>
    </svg>
  );
}

function ArithmeticFigure({
  z1, z2, res, op, showGrid, showAxes, showTicks, showPara, showProj, onZ1, onZ2,
}: {
  z1: C; z2: C; res: C; op: string; showGrid: boolean; showAxes: boolean; showTicks: boolean; showPara: boolean; showProj: boolean;
  onZ1: (z: C) => void; onZ2: (z: C) => void;
}) {
  return (
    <ComplexPlane
      label="Argand plane parallelogram"
      showGrid={showGrid}
      showAxes={showAxes}
      showTicks={showTicks}
      onPick={(re, im) => {
        const p = { re: clamp(re, -4, 4), im: clamp(im, -4, 4) };
        if (Math.hypot(p.re - z1.re, p.im - z1.im) <= Math.hypot(p.re - z2.re, p.im - z2.im)) onZ1(p);
        else onZ2(p);
      }}
    >
      {({ x, y }) => (
        <>
          {showProj ? (
            <>
              <CxRay x1={x(z1.re)} y1={y(z1.im)} x2={x(z1.re)} y2={y(0)} color="#94a3b8" dashed />
              <CxRay x1={x(0)} y1={y(z1.im)} x2={x(z1.re)} y2={y(z1.im)} color="#94a3b8" dashed />
              <CxRay x1={x(z2.re)} y1={y(z2.im)} x2={x(z2.re)} y2={y(0)} color="#c4b5fd" dashed />
              <CxRay x1={x(0)} y1={y(z2.im)} x2={x(z2.re)} y2={y(z2.im)} color="#c4b5fd" dashed />
              <CxRay x1={x(res.re)} y1={y(res.im)} x2={x(res.re)} y2={y(0)} color="#fcd34d" dashed />
              <text x={x(z1.re / 2)} y={y(0) + 14} fontSize="11" fill={CX_Z}>{fmtSigned(z1.re)}</text>
              <text x={x(0) - 28} y={y(z1.im / 2)} fontSize="11" fill={CX_Z}>{fmtSigned(z1.im)}</text>
              <text x={x(z2.re) + 6} y={y(z2.im / 2)} fontSize="11" fill={CX_W}>{fmtSigned(z2.im)}</text>
              <text x={x(z2.re / 2)} y={y(0) - 8} fontSize="11" fill={CX_W}>{fmtSigned(z2.re)}</text>
            </>
          ) : null}
          {showPara ? (
            <polygon
              points={`${x(0)},${y(0)} ${x(z1.re)},${y(z1.im)} ${x(res.re)},${y(res.im)} ${x(z2.re)},${y(z2.im)}`}
              fill="rgba(245,158,11,.08)"
              stroke={CX_R}
              strokeDasharray="6 5"
              fillOpacity={0.12}
            />
          ) : null}
          <CxRay x1={x(0)} y1={y(0)} x2={x(z1.re)} y2={y(z1.im)} color={CX_Z} marker="cx-z" width={3} />
          {op !== "Conjugate" ? <CxRay x1={x(0)} y1={y(0)} x2={x(z2.re)} y2={y(z2.im)} color={CX_W} marker="cx-w" width={3} /> : null}
          <CxRay x1={x(0)} y1={y(0)} x2={x(res.re)} y2={y(res.im)} color={CX_R} marker="cx-r" width={2.8} />
          <CxDot x={x(z1.re)} y={y(z1.im)} fill={CX_Z} label={`P  z₁ = ${fmtC(z1)}`} />
          {op !== "Conjugate" ? <CxDot x={x(z2.re)} y={y(z2.im)} fill={CX_W} label={`Q  z₂ = ${fmtC(z2)}`} /> : null}
          <CxDot x={x(res.re)} y={y(res.im)} fill={CX_R} label={`R = ${op === "Add" ? "z₁ + z₂" : "result"}`} sub={fmtC(res)} />
        </>
      )}
    </ComplexPlane>
  );
}

export function PolarLab({ page }: { page: StudioMockupPage }) {
  const [re, setRe] = useState(2);
  const [im, setIm] = useState(1.5);
  const [linked, setLinked] = useState(true);
  const [branch, setBranch] = useState(-180);
  const [grid, setGrid] = useState(true);
  const [axes, setAxes] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const r = Math.hypot(re, im);
  const th = wrapDeg((Math.atan2(im, re) * 180) / Math.PI, branch);
  const setPolar = (nr: number, nth: number) => {
    const next = fromPolar(nr, nth);
    setRe(next.re);
    setIm(next.im);
  };
  useEffect(() => {
    if (!playing) return undefined;
    const id = window.setInterval(() => {
      setPolar(r, th + 2 * speed);
    }, 40);
    return () => window.clearInterval(id);
  }, [playing, r, speed, th]);
  const exactRe = re === 2 && Math.abs(im - 1.5) < 1e-6;

  return (
    <ComplexLabChrome page={page}>
      {(mode) => (
        <>
          <CxCol>
            <div className="cx-card">
              <div className="cx-step-title">1. Rectangular Form  a + bi</div>
              <CxStepper label="a =" value={re} min={-4} max={4} onChange={setRe} />
              <CxStepper label="b =" value={im} min={-4} max={4} onChange={setIm} />
              <output className="cx-form-pill">z = {fmt(re, 4)} + {fmt(im, 4)}i</output>
            </div>
            <div className="cx-card">
              <div className="cx-step-title">2. Polar Form  r ∠ θ</div>
              <CxSlider label="Modulus r" value={r} min={0.2} max={4} step={0.05} display={fmt(r, 4)} onChange={(nr) => setPolar(nr, th)} />
              <CxSlider label="Argument θ (degrees)" value={th} min={branch} max={branch + 359} step={0.1} display={fmt(th, 4)} onChange={(nth) => setPolar(r, nth)} />
              <output className="cx-form-pill">z = {fmt(r, 4)} ∠ {fmt(th, 4)}°</output>
            </div>
            <div className="cx-card">
              <div className="cx-step-title">3. Exponential Form  re<sup>iθ</sup></div>
              <CxSlider label="r =" value={r} min={0.2} max={4} step={0.05} display={fmt(r, 4)} onChange={(nr) => setPolar(nr, th)} />
              <CxSlider label="θ =" value={th} min={branch} max={branch + 359} step={0.1} display={`${fmt(th, 4)}°`} onChange={(nth) => setPolar(r, nth)} />
              <output className="cx-form-pill">z = {fmt(r, 4)} e<sup>i({fmt(th, 4)}°)</sup></output>
            </div>
            <div className="cx-card">
              <div className="cx-kicker">Link controls</div>
              <CxToggle label="Keep rectangular, polar, and exponential in sync." on={linked && Boolean(mode)} onChange={setLinked} />
            </div>
          </CxCol>
          <CxCanvas
            title="Argand Plane"
            tools={(
              <span className="cx-canvas-tools">
                <button type="button" className={grid ? "active" : ""} onClick={() => setGrid((v) => !v)}>Grid</button>
                <button type="button" className={axes ? "active" : ""} onClick={() => setAxes((v) => !v)}>Axes</button>
              </span>
            )}
          >
            <ComplexPlane label="Polar Argand plane" xmin={-4.4} xmax={4.4} ymin={-4.4} ymax={4.4} showGrid={grid} showAxes={axes} onPick={(x, y) => { setRe(clamp(x, -4, 4)); setIm(clamp(y, -4, 4)); }}>
              {({ x, y, u }) => {
                const rad = (th * Math.PI) / 180;
                const px = x(re);
                const py = y(im);
                const arc = Array.from({ length: 24 }, (_, i) => {
                  const a = (rad * i) / 23;
                  return `${x(0.55 * Math.cos(a))} ${y(0.55 * Math.sin(a))}`;
                }).join(" L ");
                return (
                  <>
                    <circle cx={x(0)} cy={y(0)} r={u} fill="none" stroke="#f59e0b" strokeDasharray="5 5" />
                    <circle cx={x(0)} cy={y(0)} r={r * u} fill="none" stroke="#f59e0b" />
                    <path d={`M ${x(0.55)} ${y(0)} L ${arc}`} fill="rgba(251,146,60,.35)" stroke="#fb923c" />
                    <CxRay x1={x(0)} y1={y(0)} x2={px} y2={py} color="#fb923c" width={3} />
                    <text x={x(0) + 8} y={y(r) - 8} fontSize="12" fill="#f59e0b">r = {fmt(r, 4)}</text>
                    <text x={x(0.7 * Math.cos(rad / 2))} y={y(0.7 * Math.sin(rad / 2))} fontSize="12" fill="#ea580c">θ = {fmt(th, 4)}°</text>
                    {[["0°", 0], ["90°", 90], ["180°", 180], ["−90°", -90]].map(([lab, deg]) => {
                      const a = (Number(deg) * Math.PI) / 180;
                      return <text key={lab} x={x(4.05 * Math.cos(a))} y={y(4.05 * Math.sin(a))} fontSize="11" fill="#94a3b8">{lab}</text>;
                    })}
                    <CxDot x={px} y={py} fill="#0ea5e9" label={`z = ${fmt(re, 1)} + ${fmt(im, 1)}i`} />
                  </>
                );
              }}
            </ComplexPlane>
            <ul className="cx-legend">
              <li><i style={{ background: "#0ea5e9" }} />Point z</li>
              <li><i style={{ background: "#f59e0b" }} />Radius r</li>
              <li><i style={{ background: "#fb923c" }} />Angle θ</li>
              <li><i className="is-dash" />Grid</li>
              <li><i style={{ background: "#fcd34d" }} />Unit circle</li>
            </ul>
            <div className="cx-play">
              <button type="button" aria-pressed={playing} onClick={() => setPlaying((v) => !v)}>{playing ? "Pause conversion" : "Animate conversion"}</button>
              <input type="range" min={0.25} max={2} step={0.25} value={speed} aria-label="Speed" onChange={(event) => setSpeed(Number(event.target.value))} />
              <span>Speed {speed.toFixed(1)}x</span>
            </div>
          </CxCanvas>
          <CxLive title="Live Values (Exact)" badge={linked ? <span className="cx-badge">Linked</span> : null}>
            <h3>Rectangular</h3>
            <p className="cx-eq is-ans">z = {exactRe ? "2 + 3/2 i" : fmtC({ re, im }, 4)}</p>
            <h3>Polar</h3>
            <p className="cx-eq is-ans">z = {exactRe ? "5/2 ∠ 36.86989765°" : `${fmt(r, 8)} ∠ ${fmt(th, 8)}°`}</p>
            <h3>Exponential (Euler)</h3>
            <p className="cx-eq is-ans">z = {exactRe ? "5/2 e^{i(36.86989765°)}" : `${fmt(r, 4)} e^{i(${fmt(th, 4)}°)}`}</p>
            <p className="cx-meta">|z| = {exactRe ? "5/2" : fmt(r, 4)}   Re(z) = {fmt(re, 2)}   Im(z) = {exactRe ? "3/2" : fmt(im, 2)}</p>
            <h3>Euler’s Representation</h3>
            <p className="cx-eq">e<sup>iθ</sup> = cos θ + i sin θ</p>
            <p className="cx-eq">e<sup>i({fmt(th, 4)}°)</sup> = {fmt(Math.cos(th * Math.PI / 180), 4)} + {fmt(Math.sin(th * Math.PI / 180), 4)} i</p>
            <h3>Branch of Argument</h3>
            <label className="cx-select">
              Principal Value
              <select aria-label="Argument branch" value={branch} onChange={(event) => setBranch(Number(event.target.value))}>
                <option value={-180}>θ ∈ (−180°, 180°]</option>
                <option value={0}>θ ∈ [0°, 360°)</option>
              </select>
            </label>
            <p className="cx-ok">θ = {fmt(th, 8)}°  Valid</p>
            <p className="cx-warn">Other values: θ + k·360°,  k ∈ ℤ</p>
            <h3>Identity Check</h3>
            <p className="cx-eq">e<sup>iθ</sup>(cos θ − i sin θ) = 1</p>
            <p className="cx-ok">Holds (within tolerance)</p>
          </CxLive>
        </>
      )}
    </ComplexLabChrome>
  );
}

export function RotationLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(1.5);
  const [b, setB] = useState(1);
  const [r, setR] = useState(1.4);
  const [th, setTh] = useState(60);
  const [n, setN] = useState(8);
  const [showSeq, setShowSeq] = useState(true);
  const [showCircles, setShowCircles] = useState(true);
  const [showPath, setShowPath] = useState(true);
  const [axes, setAxes] = useState(true);
  const [grid, setGrid] = useState(true);
  const [labels, setLabels] = useState(true);
  const z: C = { re: a, im: b };
  const w = fromPolar(r, th);
  const wz = mulC(z, w);
  const seq = Array.from({ length: n }, (_, k) => {
    let p = z;
    for (let i = 0; i < k; i += 1) p = mulC(p, w);
    return p;
  });
  const magZ = modC(z);
  const argZ = wrapDeg((argC(z) * 180) / Math.PI);
  const magW = modC(w);
  const magWz = modC(wz);

  return (
    <ComplexLabChrome page={page}>
      {() => (
        <>
          <CxCol>
            <div className="cx-card">
              <strong className="cx-dot-title" data-tone="z">Complex number z (input)</strong>
              <p className="cx-eq">z = a + bi</p>
              <CxStepper label="a" value={a} min={-3} max={3} onChange={setA} />
              <CxStepper label="b" value={b} min={-3} max={3} onChange={setB} />
              <p className="cx-meta">|z| = {fmt(magZ, 3)}   arg z = {fmt(argZ, 2)}°</p>
            </div>
            <div className="cx-card">
              <strong className="cx-dot-title" data-tone="w">Multiplier w</strong>
              <p className="cx-eq">w = r e<sup>iθ</sup></p>
              <CxSlider label="Modulus r" value={r} min={0.1} max={3} step={0.05} display={fmt(r, 2)} onChange={setR} />
              <CxSlider label="Argument θ" value={th} min={-180} max={180} step={1} display={`${fmt(th, 0)}°`} onChange={setTh} />
              <div className="cx-snaps">
                {[-90, -45, 45, 90, 180].map((d) => (
                  <button key={d} type="button" className={th === d ? "active" : ""} onClick={() => setTh(d)}>{d > 0 ? `+${d}°` : `${d}°`}</button>
                ))}
              </div>
              <p className="cx-eq">w (rectangular) {fmtC(w)}</p>
              <p className="cx-meta">|w| = {fmt(magW, 3)}   arg w = {fmt(th, 2)}°</p>
            </div>
            <div className="cx-card">
              <strong>Repeated multiplication</strong>
              <CxSlider label="n (steps)" value={n} min={1} max={24} step={1} display={String(n)} onChange={setN} />
              <CxToggle label="Show sequence" on={showSeq} onChange={setShowSeq} />
              <CxToggle label="Show scale circles" on={showCircles} onChange={setShowCircles} />
              <CxToggle label="Show path" on={showPath} onChange={setShowPath} />
            </div>
          </CxCol>
          <CxCanvas
            title="Argand Plane"
            tools={(
              <span className="cx-canvas-tools">
                <button type="button" className={axes ? "active" : ""} onClick={() => setAxes((v) => !v)}>Axes</button>
                <button type="button" className={grid ? "active" : ""} onClick={() => setGrid((v) => !v)}>Grid</button>
                <button type="button" className={labels ? "active" : ""} onClick={() => setLabels((v) => !v)}>Labels</button>
                <button type="button" className="active">Equal scale</button>
                <button type="button" onClick={() => { setA(1.5); setB(1); setR(1.4); setTh(60); }}>Reset view</button>
              </span>
            )}
          >
            <ComplexPlane label="Multiplication as rotation" xmin={-3.4} xmax={3.4} ymin={-3.4} ymax={3.4} showGrid={grid} showAxes={axes} showTicks={labels}>
              {({ x, y, u }) => {
                const rad = (th * Math.PI) / 180;
                return (
                  <>
                    {showCircles ? seq.map((p, i) => <circle key={`c${i}`} cx={x(0)} cy={y(0)} r={Math.max(4, modC(p) * u)} fill="none" stroke="#fbbf24" strokeDasharray="4 6" />) : null}
                    {showPath ? <polyline fill="none" stroke="#c4b5fd" strokeWidth="1.6" points={seq.map((p) => `${x(p.re)},${y(p.im)}`).join(" ")} /> : null}
                    <path d={`M ${x(0.5)} ${y(0)} A 40 40 0 ${th < 0 ? 0 : 0} 1 ${x(0.5 * Math.cos(rad))} ${y(0.5 * Math.sin(rad))}`} fill="rgba(251,146,60,.35)" stroke="#fb923c" />
                    <text x={x(0.7 * Math.cos(rad / 2))} y={y(0.7 * Math.sin(rad / 2))} fontSize="12" fill="#ea580c">θ = {fmt(th, 0)}°</text>
                    <CxRay x1={x(0)} y1={y(0)} x2={x(z.re)} y2={y(z.im)} color={CX_Z} marker="cx-z" />
                    <CxRay x1={x(0)} y1={y(0)} x2={x(wz.re)} y2={y(wz.im)} color={CX_W} marker="cx-w" />
                    {showSeq ? seq.map((p, i) => (
                      <g key={i}>
                        <circle cx={x(p.re)} cy={y(p.im)} r={i === 0 ? 6 : 4} fill={i === 0 ? CX_Z : i === 1 ? CX_W : "#a78bfa"} stroke="#fff" />
                        {labels && (i === 0 || i === 1 || i === 2 || i === 3) ? <text x={x(p.re) + 8} y={y(p.im) - 8} fontSize="11" fontWeight={800} fill="#0f172a">{i === 0 ? "z" : i === 1 ? "wz" : `|w|${i === 2 ? "²" : "³"}`}</text> : null}
                      </g>
                    )) : null}
                    <CxDot x={x(z.re)} y={y(z.im)} fill={CX_Z} label={`${fmtC(z)}`} />
                    <CxDot x={x(wz.re)} y={y(wz.im)} fill={CX_W} label={`${fmtC(wz, 3)}`} />
                  </>
                );
              }}
            </ComplexPlane>
            <ul className="cx-legend">
              <li><i style={{ background: CX_Z }} />z (input)</li>
              <li><i style={{ background: CX_W }} />wz (product)</li>
              <li><i className="is-dash" />Rotation by θ</li>
              <li><i style={{ background: CX_R }} />|w| scale</li>
              <li><i style={{ background: "#c4b5fd" }} />Sequence (n = {n})</li>
            </ul>
          </CxCanvas>
          <CxLive title="Product">
            <p className="cx-eq is-ans">wz {fmtC(wz, 3)}</p>
            <p className="cx-meta">|wz| = {fmt(magWz, 3)}   arg(wz) = {fmt(wrapDeg(argC(wz) * 180 / Math.PI), 2)}°</p>
            <h3>Polar form</h3>
            <p className="cx-eq">wz = {fmt(magWz, 3)} e<sup>i{fmt(wrapDeg(argC(wz) * 180 / Math.PI), 2)}°</sup></p>
            <h3>Rotation &amp; scaling</h3>
            <p className="cx-meta">|w| = {fmt(magW, 3)} (scale {fmt(magW, 3)})</p>
            <p className="cx-meta">arg w = {fmt(th, 2)}° (rotate {th >= 0 ? "+" : ""}{fmt(th, 2)}°)</p>
            <h3>Transformation matrix</h3>
            <p className="cx-eq">z ↦ wz</p>
            <p className="cx-eq">M = [ {fmt(w.re, 3)}  {fmt(-w.im, 3)} ; {fmt(w.im, 3)}  {fmt(w.re, 3)} ]</p>
            <h3>Explanation</h3>
            <p className="cx-note">Multiplying by w = r e<sup>iθ</sup> rotates by θ and scales by r. Each step: multiply by w. After n steps: w<sup>n</sup> z.</p>
          </CxLive>
        </>
      )}
    </ComplexLabChrome>
  );
}

export function RootsLab({ page }: { page: StudioMockupPage }) {
  const [r, setR] = useState(8);
  const [th, setTh] = useState(40);
  const [n, setN] = useState(6);
  const [all, setAll] = useState(true);
  const [principal, setPrincipal] = useState(false);
  const [polygon, setPolygon] = useState(true);
  const [rotate, setRotate] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [form, setForm] = useState<"Polar" | "Rectangular">("Polar");
  useEffect(() => {
    if (!rotate) return undefined;
    const id = window.setInterval(() => setTh((v) => wrapDeg(v + speed)), 40);
    return () => window.clearInterval(id);
  }, [rotate, speed]);
  const z = fromPolar(r, th);

  return (
    <ComplexLabChrome page={page} pills>
      {(mode) => {
        const unity = mode === "Roots of Unity";
        const square = mode === "Square Roots";
        const degree = square ? 2 : n;
        const source = unity ? { re: 1, im: 0 } : z;
        const pts = nthRoots(source, degree);
        const vis = principal ? pts.slice(0, 1) : pts;
        const span = Math.max(1.6, modC(pts[0] ?? { re: 1, im: 0 }) * 1.35);
        const rr = modC(pts[0] ?? { re: 1, im: 0 });
        const polyPts = vis.map((p) => p);
        return (
          <>
            <CxCol>
              <div className="cx-card">
                <div className="cx-step-title">1. Choose complex number z</div>
                <select aria-label="Choose z" value={`${r}|${th}`} onChange={(event) => {
                  const [nr, nt] = event.target.value.split("|").map(Number);
                  setR(nr ?? 8);
                  setTh(nt ?? 40);
                }}>
                  <option value="8|40">z = 8 ∠ 40°</option>
                  <option value="1|0">z = 1</option>
                  <option value="4|90">z = 4 ∠ 90°</option>
                  <option value="9|180">z = 9 ∠ 180°</option>
                </select>
                <div className="cx-ops">
                  <button type="button" className={form === "Polar" ? "active" : ""} onClick={() => setForm("Polar")}>Polar</button>
                  <button type="button" className={form === "Rectangular" ? "active" : ""} onClick={() => setForm("Rectangular")}>Rectangular</button>
                </div>
                <p className="cx-eq">{form === "Polar" ? `r = ${fmt(r, 0)}   θ = ${fmt(th, 0)}°` : fmtC(z, 2)}</p>
              </div>
              <div className="cx-card">
                <div className="cx-step-title">2. Degree of roots (n)</div>
                <CxSlider label="n =" value={square ? 2 : n} min={2} max={20} step={1} display={String(degree)} onChange={setN} />
              </div>
              <div className="cx-card">
                <div className="cx-step-title">3. Mode options</div>
                <CxToggle label="All roots" on={all && !principal} onChange={(v) => { setAll(v); if (v) setPrincipal(false); }} />
                <CxToggle label="Principal root only" on={principal} onChange={(v) => { setPrincipal(v); if (v) setAll(false); }} />
                <CxToggle label="Vertex sequence" on={!principal} onChange={(v) => setPrincipal(!v)} />
                <CxToggle label="Show polygon" on={polygon} onChange={setPolygon} />
              </div>
              <div className="cx-card">
                <div className="cx-step-title">4. Animation</div>
                <CxToggle label="Rotate roots" on={rotate} onChange={setRotate} />
                <CxSlider label="Speed" value={speed} min={0.25} max={2} step={0.25} display={`${speed.toFixed(1)}x`} onChange={setSpeed} />
                <div className="cx-ops">
                  <button type="button" onClick={() => { setR(8); setTh(40); setN(6); }}>Reset</button>
                  <button type="button" onClick={() => { setR(1 + Math.round(Math.random() * 8)); setTh(Math.round(Math.random() * 360 - 180)); }}>Random z</button>
                </div>
              </div>
            </CxCol>
            <CxCanvas
              title="Argand plane (Unit Circle)"
              tools={(
                <span className="cx-canvas-tools">
                  <button type="button" className="active">Grid</button>
                  <button type="button" className="active">Axes</button>
                  <button type="button">Pan</button>
                  <button type="button">Zoom in</button>
                  <button type="button">Zoom out</button>
                  <button type="button">Reset view</button>
                </span>
              )}
            >
              <ComplexPlane label="nth roots" xmin={-span} xmax={span} ymin={-span} ymax={span}>
                {({ x, y, u }) => {
                  const poly = polyPts.map((p) => `${x(p.re)},${y(p.im)}`).join(" ");
                  const arg0 = argC(source);
                  return (
                    <>
                      <circle cx={x(0)} cy={y(0)} r={u} fill="rgba(148,163,184,.18)" stroke="#cbd5e1" />
                      <circle cx={x(0)} cy={y(0)} r={rr * u} fill="none" stroke="#f59e0b" strokeDasharray="5 5" />
                      {polygon && vis.length > 1 ? <polygon points={poly} fill="none" stroke={CX_R} strokeWidth="2.4" /> : null}
                      <CxRay x1={x(0)} y1={y(0)} x2={x(vis[0]?.re ?? 0)} y2={y(vis[0]?.im ?? 0)} color="#6366f1" marker="cx-w" />
                      <path d={`M ${x(0.35)} ${y(0)} A 24 24 0 0 1 ${x(0.35 * Math.cos(arg0 / degree))} ${y(0.35 * Math.sin(arg0 / degree))}`} fill="rgba(99,102,241,.2)" stroke="#6366f1" />
                      <text x={x(0.55 * Math.cos(arg0 / (2 * degree)))} y={y(0.55 * Math.sin(arg0 / (2 * degree)))} fontSize="12" fill="#4f46e5">{fmt((arg0 * 180) / Math.PI / degree, 0)}°</text>
                      {vis.map((p, i) => (
                        <g key={i}>
                          <circle cx={x(p.re)} cy={y(p.im)} r="7" fill={i === 0 ? CX_W : CX_R} stroke="#fff" strokeWidth="2" />
                          <text x={x(p.re) + 10} y={y(p.im) - 8} fontSize="11" fontWeight={800} fill="#0f172a">{`z${i === 0 ? "₀" : `_${i}`}^{1/${degree}`}</text>
                          <text x={x(p.re) + 10} y={y(p.im) + 8} fontSize="10" fill="#64748b">{`${fmt(modC(p), 4)} ∠ ${fmt(wrapDeg(argC(p) * 180 / Math.PI), 0)}°`}</text>
                        </g>
                      ))}
                      <CxDot x={x(source.re > 3 ? 1 : source.re)} y={y(source.im > 3 ? 0 : source.im)} fill={CX_W} label={`z = ${fmt(unity ? 1 : r, 0)} ∠ ${fmt(unity ? 0 : th, 0)}°`} />
                    </>
                  );
                }}
              </ComplexPlane>
              <ul className="cx-legend">
                <li><i style={{ background: CX_W }} />z (given)</li>
                <li><i style={{ background: CX_R }} />Roots</li>
                <li><i className="is-dash" />Unit circle (|z| = 1)</li>
                <li><i style={{ background: "#6366f1" }} />Angle θ / n</li>
              </ul>
            </CxCanvas>
            <CxLive title="Live values">
              <p className="cx-eq">z = {fmt(unity ? 1 : r, 0)} ∠ {fmt(unity ? 0 : th, 0)}°</p>
              <p className="cx-meta">|z| = {fmt(unity ? 1 : r, 0)}   n = {degree}   arg(z) = {fmt(unity ? 0 : th, 0)}°</p>
              <h3>Principal root (k = 0)</h3>
              <p className="cx-eq is-ans">z<sup>1/{degree}</sup>₀ = {fmt(rr, 4)} ∠ {fmt(wrapDeg(argC(pts[0] ?? { re: 1, im: 0 }) * 180 / Math.PI), 4)}°</p>
              <p className="cx-eq">= {fmtC(pts[0] ?? { re: 1, im: 0 }, 4)}</p>
              <h3>De Moivre’s theorem</h3>
              <p className="cx-eq">If z = r∠θ, then the n nth roots are</p>
              <p className="cx-eq">z<sup>1/n</sup><sub>k</sub> = r<sup>1/n</sup> ∠ (θ + 360° k) / n , k = 0, 1, …, n − 1</p>
              <ol className="cx-steps">
                <li>Write z in polar form: z = {fmt(unity ? 1 : r, 0)} ∠ {fmt(unity ? 0 : th, 0)}°</li>
                <li>Compute r<sup>1/n</sup> = {fmt(unity ? 1 : r, 0)}<sup>1/{degree}</sup> = {fmt(rr, 4)}</li>
                <li>Angles: ({fmt(unity ? 0 : th, 0)}° + 360° k) / {degree} , k = 0, …, {degree - 1}</li>
                <li>Plot each root on the Argand plane.</li>
              </ol>
              <p className="cx-ok">Identity verified</p>
              <h3>All roots table</h3>
              <table className="cx-table">
                <thead><tr><th>k</th><th>z<sub>k</sub><sup>1/n</sup> (Polar)</th><th>z<sub>k</sub> (Rectangular)</th></tr></thead>
                <tbody>
                  {pts.map((p, k) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{fmt(modC(p), 4)} ∠ {fmt(wrapDeg(argC(p) * 180 / Math.PI), 4)}°</td>
                      <td>{fmtC(p, 4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CxLive>
          </>
        );
      }}
    </ComplexLabChrome>
  );
}

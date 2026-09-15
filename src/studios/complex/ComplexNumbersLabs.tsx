import { useState, type PointerEvent, type ReactNode } from "react";
import { Phase1LabChrome } from "../phase1/Phase1LabChrome";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { ChallengeBox, ExtraFrame, LiveRow, Panel, SliderRow, clamp, fmt } from "../mockup/studioLabKit";
import FractalsLab from "./FractalsLab";

function Chrome({ page, children }: { page: StudioMockupPage; children: ReactNode | ((mode: string) => ReactNode) }) {
  return <Phase1LabChrome page={page}>{children}</Phase1LabChrome>;
}

export default function ComplexNumbersLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  switch (page.id) {
    case "argand-plane": return <ArgandLab page={page} extra={extra} />;
    case "arithmetic": return <ComplexArithmeticLab page={page} />;
    case "polar-forms": return <PolarLab page={page} />;
    case "rotation": return <RotationLab page={page} extra={extra} />;
    case "roots": return <RootsLab page={page} />;
    case "euler": return <EulerLab page={page} extra={extra} />;
    case "loci": return <LociLab page={page} />;
    case "fractals": return <FractalsLab page={page} />;
    case "waves-circuits": return <CircuitsLab page={page} />;
    default: return null;
  }
}

function ArgandLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  const [re, setRe] = useState(3);
  const [im, setIm] = useState(4);
  const r = Math.hypot(re, im);
  const arg = Math.atan2(im, re) * 180 / Math.PI;
  return (
    <Chrome page={page}>
      {(mode) => (
        <>
          <Panel title="Plot z">
            <SliderRow label="Real a" value={re} min={-6} max={6} step={0.1} onChange={setRe} />
            <SliderRow label="Imag b" value={im} min={-6} max={6} step={0.1} onChange={setIm} />
            <p className="msk-note">{mode}: |z| = r = {fmt(r, 2)}. Drag the blue point; conjugate folds across the real axis.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="complex-numbers" data-mode-canvas={mode}>
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <svg
                  className="msk-graph is-interactive"
                  viewBox="0 0 420 360"
                  role="img"
                  aria-label="Argand plane"
                  onPointerDown={(event: PointerEvent<SVGSVGElement>) => {
                    const box = event.currentTarget.getBoundingClientRect();
                    setRe(clamp(((event.clientX - box.left) / box.width) * 420 / 28 - 7.5, -6, 6));
                    setIm(clamp(6.4 - ((event.clientY - box.top) / box.height) * 360 / 28, -6, 6));
                  }}
                >
                  <rect width="420" height="360" fill="#f8fbff" />
                  <line x1="30" y1="180" x2="390" y2="180" stroke="#94a3b8" />
                  <line x1="210" y1="20" x2="210" y2="340" stroke="#94a3b8" />
                  {mode === "Modulus" || mode === "Locus" ? <circle cx="210" cy="180" r={r * 28} fill="none" stroke="#08b9dd" /> : null}
                  {mode === "Argument" ? <line x1="210" y1="180" x2={210 + 120} y2="180" stroke="#cbd5e1" /> : null}
                  <line x1="210" y1="180" x2={210 + re * 28} y2={180 - im * 28} stroke="#147df2" strokeWidth="2.4" />
                  {mode === "Conjugate" ? <line x1="210" y1="180" x2={210 + re * 28} y2={180 + im * 28} stroke="#f59e0b" strokeDasharray="4 3" /> : null}
                  {mode === "Distance" ? <line x1="210" y1="180" x2={210 + re * 28} y2={180 - im * 28} stroke="#10b981" strokeWidth="6" opacity="0.25" /> : null}
                  <circle cx={210 + re * 28} cy={180 - im * 28} r="6" fill="#147df2" />
                  <text x={220 + re * 28} y={176 - im * 28} fontSize="12">z = {fmt(re, 1)} + {fmt(im, 1)}i</text>
                </svg>
              )}
            />
          </section>
          <aside className="msk-panel msk-live">
            <div className="cx-form-rail">
              <output>rectangular {fmt(re, 2)} + {fmt(im, 2)}i</output>
              <output>polar {fmt(r, 2)} cis {fmt(arg, 1)}°</output>
            </div>
            <LiveRow color="#147df2" label="|z|" value={fmt(r)} />
            <LiveRow color="#8b45f4" label="arg z" value={`${fmt(arg, 1)}°`} />
            <LiveRow color="#f59e0b" label="conjugate" value={`${fmt(re, 1)} − ${fmt(im, 1)}i`} />
            <ChallengeBox {...page.challenge} />
          </aside>
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
  const sum = [a + c, b + d];
  const prod = [a * c - b * d, a * d + b * c];
  const quotDen = c * c + d * d || 1;
  const quot = [(a * c + b * d) / quotDen, (b * c - a * d) / quotDen];
  return (
    <Chrome page={page}>
      {(mode) => {
        const res = mode === "Multiply" ? prod : mode === "Subtract" ? [a - c, b - d] : mode === "Divide" ? quot : mode === "Conjugate" ? [a, -b] : sum;
        return (
          <>
            <Panel title="Vectors (drag points)">
              <p className="msk-note">Operation {mode} uses the live figure, not a copy-only switch.</p>
              <SliderRow label="Re z1" value={a} min={-4} max={4} step={0.1} onChange={setA} />
              <SliderRow label="Im z1" value={b} min={-4} max={4} step={0.1} onChange={setB} />
              <SliderRow label="Re z2" value={c} min={-4} max={4} step={0.1} onChange={setC} />
              <SliderRow label="Im z2" value={d} min={-4} max={4} step={0.1} onChange={setD} />
            </Panel>
            <section className="msk-panel msk-canvas" data-studio="complex-numbers" data-mode-canvas={mode}>
              <svg
                className="msk-graph is-interactive"
                viewBox="0 0 420 320"
                role="img"
                aria-label="Parallelogram"
                onPointerDown={(event: PointerEvent<SVGSVGElement>) => {
                  const box = event.currentTarget.getBoundingClientRect();
                  const x = clamp(((event.clientX - box.left) / box.width) * 420 / 28 - 7.5, -4, 4);
                  const y = clamp(5.7 - ((event.clientY - box.top) / box.height) * 320 / 28, -4, 4);
                  if (Math.hypot(x - a, y - b) <= Math.hypot(x - c, y - d)) {
                    setA(x);
                    setB(y);
                  } else {
                    setC(x);
                    setD(y);
                  }
                }}
              >
                <rect width="420" height="320" fill="#f8fbff" />
                <line x1="30" y1="160" x2="390" y2="160" stroke="#94a3b8" /><line x1="210" y1="20" x2="210" y2="300" stroke="#94a3b8" />
                <line x1="210" y1="160" x2={210 + a * 28} y2={160 - b * 28} stroke="#147df2" strokeWidth="2" />
                {mode !== "Conjugate" ? <line x1="210" y1="160" x2={210 + c * 28} y2={160 - d * 28} stroke="#8b45f4" strokeWidth="2" /> : null}
                <line x1="210" y1="160" x2={210 + res[0] * 28} y2={160 - res[1] * 28} stroke="#f59e0b" strokeWidth="2" />
                {mode === "Add" || mode === "Subtract" ? <polygon points={`210,160 ${210 + a * 28},${160 - b * 28} ${210 + res[0] * 28},${160 - res[1] * 28} ${210 + c * 28},${160 - d * 28}`} fill="rgba(245,158,11,.08)" stroke="#f59e0b" strokeDasharray="4 3" /> : null}
              </svg>
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color="#f59e0b" label="result" value={`${fmt(res[0], 2)} + ${fmt(res[1], 2)}i`} />
              <LiveRow color="#147df2" label="|z1|" value={fmt(Math.hypot(a, b))} />
              <p className="msk-note">{mode === "Multiply" ? "Multiply adds arguments and multiplies moduli." : mode === "Divide" ? "Divide subtracts arguments." : "Addition is the parallelogram diagonal."}</p>
              <ChallengeBox {...page.challenge} />
            </aside>
          </>
        );
      }}
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
          <section className="msk-panel msk-canvas" data-studio="complex-numbers" data-mode-canvas={mode}>
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
            <p className="msk-note">{mode === "Scale" ? "Radius grows when |z| ≠ 1." : mode === "Sequence" ? "Powers of z spiral." : "× i = +90°."}</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="complex-numbers" data-mode-canvas={mode}>
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <svg className="msk-graph" viewBox="0 0 320 240" role="img" aria-label={mode}>
                  <rect width="320" height="240" fill="#f8fbff" />
                  <circle cx="160" cy="120" r="70" fill="none" stroke="#94a3b8" />
                  {powers.map((angle, i) => (
                    <circle key={i} cx={160 + (mode === "Scale" ? 40 + i * 8 : 50 + i * 4) * Math.cos(angle * Math.PI / 180)} cy={120 - (mode === "Scale" ? 40 + i * 8 : 50 + i * 4) * Math.sin(angle * Math.PI / 180)} r="3" fill="#147df2" />
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
  return (
    <Chrome page={page}>
      {(mode) => {
        const sides = mode === "Square Roots" ? 2 : mode === "Roots of Unity" ? n : n;
        const vertices = Array.from({ length: sides }, (_, i) => {
          const a = (i / sides) * Math.PI * 2 - Math.PI / 2;
          return `${180 + Math.cos(a) * 80},${140 + Math.sin(a) * 80}`;
        });
        return (
          <>
            <Panel title="nth roots">
              <SliderRow label="n" value={n} min={2} max={10} step={1} onChange={setN} />
              <p className="msk-note">{mode}: De Moivre places roots on a regular polygon.</p>
            </Panel>
            <section className="msk-panel msk-canvas" data-studio="complex-numbers" data-mode-canvas={mode}>
              <svg className="msk-graph" viewBox="0 0 360 280" role="img" aria-label="Roots">
                <rect width="360" height="280" fill="#f8fbff" />
                <circle cx="180" cy="140" r="80" fill="none" stroke="#94a3b8" />
                <polygon points={vertices.join(" ")} fill="rgba(20,125,242,.08)" stroke="#147df2" />
                {(mode === "Square Roots" ? vertices.slice(0, 2) : vertices).map((p, i) => <circle key={i} cx={p.split(",")[0]} cy={p.split(",")[1]} r="5" fill="#147df2" />)}
              </svg>
            </section>
            <aside className="msk-panel msk-live"><LiveRow color="#147df2" label="roots" value={String(mode === "Square Roots" ? 2 : n)} /><ChallengeBox {...page.challenge} /></aside>
          </>
        );
      }}
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
            <p className="msk-note">{mode}: plane, helix, projections, and Taylor stay linked.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="complex-numbers" data-mode-canvas={mode}>
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <svg className="msk-graph is-dark" viewBox="0 0 360 240" role="img" aria-label={mode}>
                  <rect width="360" height="240" fill="#061428" />
                  {mode === "Helix" ? (
                    <polyline points={Array.from({ length: 40 }, (_, i) => `${40 + i * 7},${120 - Math.sin(i / 6 + rad) * 40 + i * 0.4}`).join(" ")} fill="none" stroke="#22d3ee" />
                  ) : mode === "Projections" ? (
                    <>
                      <line x1="40" y1="180" x2={40 + Math.cos(rad) * 120} y2="180" stroke="#38bdf8" strokeWidth="3" />
                      <line x1="40" y1="180" x2="40" y2={180 - Math.sin(rad) * 80} stroke="#fde68a" strokeWidth="3" />
                    </>
                  ) : (
                    <circle cx="180" cy="120" r="70" fill="none" stroke="#22d3ee" />
                  )}
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
            <p className="msk-note">Möbius maps send generalized circles to circles.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="complex-numbers" data-mode-canvas={mode}>
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
              {mode === "Möbius" || mode === "Affine Map" ? grid.map((x) => {
                const pts = Array.from({ length: 24 }, (_, k) => {
                  const y = -1.8 + k * 0.15;
                  const w = mobius(x, y);
                  return `${180 + w.u * 50},${120 - w.v * 50}`;
                }).join(" ");
                return <polyline key={x} points={pts} fill="none" stroke="#8b45f4" strokeWidth="1" />;
              }) : null}
              {mode === "Line Loci" ? <line x1="40" y1={120 - r * 10} x2="320" y2={120 + r * 10} stroke="#147df2" /> : null}
              {mode === "Inversion" ? <circle cx="180" cy="120" r={80 / r} fill="none" stroke="#08b9dd" /> : mode === "Line Loci" ? null : <circle cx="180" cy="120" r={r * 28} fill="none" stroke="#147df2" />}
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
            <p className="msk-note">{mode}: impedance is a phasor.</p>
          </Panel>
          <section className="msk-panel msk-canvas" data-studio="complex-numbers" data-mode-canvas={mode}>
            <svg className="msk-graph" viewBox="0 0 360 220" role="img" aria-label="Phasor">
              <rect width="360" height="220" fill="#f8fbff" />
              <line x1="40" y1="180" x2="330" y2="180" stroke="#94a3b8" />
              <line x1="60" y1="20" x2="60" y2="200" stroke="#94a3b8" />
              <line x1="60" y1="180" x2={60 + R * 1.4} y2="180" stroke="#147df2" strokeWidth="3" />
              <line x1={60 + R * 1.4} y1="180" x2={60 + R * 1.4} y2={180 - X * 0.8} stroke="#8b45f4" strokeWidth="3" />
              <line x1="60" y1="180" x2={60 + R * 1.4} y2={180 - X * 0.8} stroke="#f59e0b" strokeWidth="2.4" />
              <text x="24" y="28" fontSize="12">{mode === "Impedance" ? "Z = R + j(XL − XC)" : mode === "AC Circuits" ? "Current lags when X>0" : "Phasor diagram"}</text>
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

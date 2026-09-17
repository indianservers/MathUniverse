import { useState, type PointerEvent, type ReactNode } from "react";
import { Phase1LabChrome } from "../phase1/Phase1LabChrome";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { ChallengeBox, ExtraFrame, LiveRow, Panel, SliderRow, clamp, fmt } from "../mockup/studioLabKit";
import ArgandFigure from "./ArgandFigure";
import FractalsLab from "./FractalsLab";
import { ComplexArithmeticLab, PolarLab, RotationLab, RootsLab } from "./ComplexTargetLabs";

function Chrome({ page, children }: { page: StudioMockupPage; children: ReactNode | ((mode: string) => ReactNode) }) {
  return <Phase1LabChrome page={page}>{children}</Phase1LabChrome>;
}

function Legend({ items }: { items: Array<[string, string]> }) {
  return (
    <ul className="cx-legend">
      {items.map(([color, label]) => (
        <li key={label}><i style={{ background: color }} />{label}</li>
      ))}
    </ul>
  );
}

function Canvas({
  title,
  mode,
  children,
}: {
  title: string;
  mode: string;
  children: ReactNode;
}) {
  return (
    <section className="msk-panel msk-canvas" data-studio="complex-numbers" data-mode-canvas={mode} data-cx-mode={mode}>
      <header className="cx-canvas-head">
        <h2>{title}</h2>
        <small>{mode}</small>
      </header>
      {children}
    </section>
  );
}

export default function ComplexNumbersLab({ page, extra }: { page: StudioMockupPage; extra?: ReactNode }) {
  switch (page.id) {
    case "argand-plane": return <ArgandLab page={page} extra={extra} />;
    case "arithmetic": return <ComplexArithmeticLab page={page} />;
    case "polar-forms": return <PolarLab page={page} />;
    case "rotation": return <RotationLab page={page} />;
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
          <Canvas title="ARGAND PLANE" mode={mode}>
            <ExtraFrame
              mode={mode}
              extra={extra}
              fallback={(
                <ArgandFigure
                  re={re}
                  im={im}
                  showModulus={mode === "Modulus" || mode === "Locus" || mode === "Distance"}
                  showArgument={mode === "Argument"}
                  showConjugate={mode === "Conjugate"}
                  showUnit={mode === "Locus"}
                  onPick={(nextRe, nextIm) => {
                    setRe(clamp(nextRe, -6, 6));
                    setIm(clamp(nextIm, -6, 6));
                  }}
                  label="Argand plane"
                />
              )}
            />
            <Legend items={[["#08a8cf", "z"], ["#08b9dd", "|z|"], ["#f59e0b", "conjugate"]]} />
          </Canvas>
          <aside className="msk-panel msk-live">
            <div className="cx-form-rail">
              <output>rectangular {fmt(re, 2)} + {fmt(im, 2)}i</output>
              <output>polar {fmt(r, 2)} cis {fmt(arg, 1)}°</output>
            </div>
            <LiveRow color="#147df2" label="|z|" value={fmt(r)} />
            <LiveRow color="#8b45f4" label="arg z" value={`${fmt(arg, 1)}°`} />
            <LiveRow color="#f59e0b" label="conjugate" value={`${fmt(re, 1)} − ${fmt(im, 1)}i`} />
            <p className="msk-formula">z = a + bi · |z| = √(a² + b²)</p>
            <ChallengeBox {...page.challenge} />
          </aside>
        </>
      )}
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
          <Canvas title="EULER'S FORMULA" mode={mode}>
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
          </Canvas>
          <aside className="msk-panel msk-live"><LiveRow color="#22d3ee" label="cos θ + i sin θ" value={`${fmt(Math.cos(rad), 3)} + ${fmt(Math.sin(rad), 3)}i`} /><p className="msk-formula">e^{"{iθ}"} = cos θ + i sin θ</p><ChallengeBox {...page.challenge} /></aside>
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
          <Canvas title="LOCI & TRANSFORMS" mode={mode}>
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
              <line className="cx-axis" x1="20" y1="120" x2="340" y2="120" />
              <line className="cx-axis" x1="180" y1="20" x2="180" y2="220" />
              <text x="328" y="112" fontSize="11">Re</text>
              <text x="188" y="28" fontSize="11">Im</text>
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
          </Canvas>
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
          <Canvas title="PHASOR DIAGRAM" mode={mode}>
            <svg className="msk-graph" viewBox="0 0 360 220" role="img" aria-label="Phasor">
              <rect width="360" height="220" fill="#f8fbff" />
              <line className="cx-axis" x1="40" y1="180" x2="330" y2="180" />
              <line className="cx-axis" x1="60" y1="20" x2="60" y2="200" />
              <line x1="60" y1="180" x2={60 + R * 1.4} y2="180" stroke="#147df2" strokeWidth="3" />
              <line x1={60 + R * 1.4} y1="180" x2={60 + R * 1.4} y2={180 - X * 0.8} stroke="#8b45f4" strokeWidth="3" />
              <line x1="60" y1="180" x2={60 + R * 1.4} y2={180 - X * 0.8} stroke="#f59e0b" strokeWidth="2.4" />
              <text x="24" y="28" fontSize="12">{mode === "Impedance" ? "Z = R + j(XL − XC)" : mode === "AC Circuits" ? "Current lags when X>0" : "Phasor diagram"}</text>
            </svg>
            <Legend items={[["#147df2", "R"], ["#8b45f4", "jX"], ["#f59e0b", "Z"]]} />
          </Canvas>
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

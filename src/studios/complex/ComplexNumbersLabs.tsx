import { useState, type ReactNode } from "react";
import { Phase1LabChrome } from "../phase1/Phase1LabChrome";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { ChallengeBox, ExtraFrame, LiveRow, Panel, SliderRow, clamp, fmt } from "../mockup/studioLabKit";
import ArgandFigure from "./ArgandFigure";
import FractalsLab from "./FractalsLab";
import { ComplexArithmeticLab, PolarLab, RotationLab, RootsLab } from "./ComplexTargetLabs";
import { CircuitsLab, EulerLab, LociLab } from "./ComplexAdvancedLabs";

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
    case "euler": return <EulerLab page={page} />;
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

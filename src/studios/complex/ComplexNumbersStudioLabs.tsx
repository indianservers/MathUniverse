import { useMemo, useState, type PointerEvent, type ReactNode } from "react";
import { HelpCircle, RotateCcw, RotateCw, Settings } from "lucide-react";
import StudioHomeButtons from "../../components/ui/StudioHomeButtons";
import { StudioCanvasToolbar } from "../../components/ui/StudioCanvasToolbar";
import { ChallengeBox, clamp, fmt, useLabMode } from "../mockup/studioLabKit";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { studioMockups } from "../mockup/studioMockupCatalog";
import ArgandFigure from "./ArgandFigure";
import { juliaConnected, orbit, periodBulbLabel } from "./fractalMath";
import { computeFractalGrid } from "./fractalWorker";
import { markComplexComplete } from "./complexStudioSession";
import { nthRoots, taylorExpITheta } from "./complexLabMath";
import { EulerHelix, StudioMath3D } from "../shared/studioMath3D";

const catalog = studioMockups["complex-numbers"];

export default function ComplexNumbersStudioLabs({ pageId }: { pageId: string }) {
  const page = catalog.pages.find((item) => item.id === pageId);
  if (!page) return null;
  switch (pageId) {
    case "argand-plane": return <ArgandLab page={page} />;
    case "arithmetic": return <ArithmeticLab page={page} />;
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

function LabFrame({
  page,
  canvasTitle,
  controls,
  canvas,
  insight,
}: {
  page: StudioMockupPage;
  canvasTitle: string;
  controls: (mode: string) => ReactNode;
  canvas: (mode: string) => ReactNode;
  insight: (mode: string) => ReactNode;
}) {
  const { tabs, mode, setMode } = useLabMode(page);
  const [helpOpen, setHelpOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  return (
    <div className="cxs-page cxs-lab" data-lab-mode={mode} data-mode-canvas={mode} data-cx-mode={mode} data-studio-kernel="1">
      <header className="cxs-header" data-lab-mode={mode} data-mode-canvas={mode}>
        <div>
          <StudioHomeButtons studioTo="/complex-numbers" />
          <h1>{page.title}</h1>
          <p>{page.subtitle}</p>
        </div>
        <nav className="cxs-header-modes" aria-label={`${page.title} modes`}>
          <small>Mode</small>
          {tabs.map((item) => (
            <button key={item} type="button" aria-pressed={item === mode} className={item === mode ? "active" : ""} onClick={() => setMode(item)}>{item}</button>
          ))}
        </nav>
        <div className="cxs-header-actions">
          <StudioCanvasToolbar />
          <button type="button" aria-label="Undo" disabled><RotateCcw /></button>
          <button type="button" aria-label="Redo" disabled><RotateCw /></button>
          <button type="button" aria-label="Help" aria-expanded={helpOpen} onClick={() => { setHelpOpen((open) => !open); setSettingsOpen(false); }}><HelpCircle /></button>
          <button type="button" aria-label="Settings" aria-expanded={settingsOpen} onClick={() => { setSettingsOpen((open) => !open); setHelpOpen(false); }}><Settings /></button>
        </div>
      </header>
      {helpOpen ? (
        <div className="cxs-card cxs-dialog" role="dialog" aria-label="Help">
          <h2>Help · {page.title}</h2>
          <p>{page.subtitle}</p>
          <p>{page.description}</p>
          <p className="cxs-note">{page.learning.understand}</p>
          <button type="button" className="cxs-soft-button" onClick={() => setHelpOpen(false)}>Close</button>
        </div>
      ) : null}
      {settingsOpen ? (
        <div className="cxs-card cxs-dialog" role="dialog" aria-label="Settings">
          <h2>Settings</h2>
          <p className="cxs-note">Grid, snap, and figure history live on the canvas toolbar. Undo/Redo stay disabled until a history stack is added.</p>
          <p className="cxs-note">Current mode: {mode}</p>
          <button type="button" className="cxs-soft-button" onClick={() => setSettingsOpen(false)}>Close</button>
        </div>
      ) : null}
      <p className="sr-only" role="status">{page.title} mode {mode}</p>
      <div className="cxs-dash-banner" data-lab-mode={mode} data-studio-kernel="1">
        <b>{page.title} · {mode}</b>
        <small>{page.subtitle}</small>
      </div>
      <div className="cxs-three-column">
        <div className="cxs-stack cxs-card">{controls(mode)}</div>
        <section className="cxs-card cxs-wide cxs-canvas" data-studio="complex-numbers" data-mode-canvas={mode} data-cx-mode={mode}>
          <header className="cxs-canvas-head">
            <h2>{canvasTitle}</h2>
            <small>{mode}</small>
          </header>
          {canvas(mode)}
        </section>
        <aside className="cxs-stack cxs-card">{insight(mode)}</aside>
      </div>
      <section className="cxs-learning-strip" aria-label="Learning loop">
        <div><span><b>Observe</b><small>{page.learning.observe}</small></span></div>
        <div><span><b>Understand</b><small>{page.learning.understand}</small></span></div>
        <div><span><b>Why</b><small>{page.learning.why}</small></span></div>
        <div><span><b>Try</b><small>{page.learning.try}</small></span></div>
        <div><span><b>Challenge</b><small>{page.learning.challenge}</small></span></div>
      </section>
    </div>
  );
}

function Legend({ items }: { items: Array<[string, string]> }) {
  return (
    <ul className="cxs-legend">
      {items.map(([color, label]) => (
        <li key={label}><i style={{ background: color }} />{label}</li>
      ))}
    </ul>
  );
}

function Slider({
  label, value, min, max, step, onChange, unit,
}: {
  label: string; value: number; min: number; max: number; step: number; onChange: (n: number) => void; unit?: string;
}) {
  return (
    <label className="cxs-slider">
      <span>{label}</span>
      <div>
        <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
        <output>{fmt(value, step < 1 ? 2 : 0)}{unit ? ` ${unit}` : ""}</output>
      </div>
    </label>
  );
}

function Live({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="cxs-live-row">
      <i style={{ background: color }} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ArgandLab({ page }: { page: StudioMockupPage }) {
  const [re, setRe] = useState(3);
  const [im, setIm] = useState(4);
  const r = Math.hypot(re, im);
  const arg = Math.atan2(im, re) * 180 / Math.PI;
  return (
    <LabFrame
      page={page}
      canvasTitle="ARGAND PLANE"
      controls={(mode) => (
        <>
          <h2>Plot z</h2>
          <Slider label="Real a" value={re} min={-6} max={6} step={0.1} onChange={setRe} />
          <Slider label="Imag b" value={im} min={-6} max={6} step={0.1} onChange={setIm} />
          <p className="cxs-note">{mode}: |z| = r = {fmt(r, 2)}. Drag the blue point; conjugate folds across the real axis.</p>
        </>
      )}
      canvas={(mode) => (
        <>
          <ArgandFigure
            re={re}
            im={im}
            showModulus={mode === "Modulus" || mode === "Locus" || mode === "Distance"}
            showArgument={mode === "Argument"}
            showConjugate={mode === "Conjugate"}
            showUnit={mode === "Locus"}
            unitRadius={2}
            onPick={(nextRe, nextIm) => {
              setRe(clamp(nextRe, -6, 6));
              setIm(clamp(nextIm, -6, 6));
            }}
            label="Argand plane"
          />
          <Legend items={[["#08a8cf", "z"], ["#08b9dd", "|z|"], ["#f59e0b", "conjugate"]]} />
        </>
      )}
      insight={() => (
        <>
          <div className="cxs-form-rail">
            <output>rectangular {fmt(re, 2)} + {fmt(im, 2)}i</output>
            <output>polar {fmt(r, 2)} cis {fmt(arg, 1)}°</output>
          </div>
          <Live color="#147df2" label="|z|" value={fmt(r)} />
          <Live color="#8b45f4" label="arg z" value={`${fmt(arg, 1)}°`} />
          <Live color="#f59e0b" label="conjugate" value={`${fmt(re, 1)} − ${fmt(im, 1)}i`} />
          <p className="cxs-formula">z = a + bi · |z| = √(a² + b²)</p>
          <ChallengeBox {...page.challenge} onCorrect={() => markComplexComplete(page.id)} />
        </>
      )}
    />
  );
}

function ArithmeticLab({ page }: { page: StudioMockupPage }) {
  const [a, setA] = useState(2.5);
  const [b, setB] = useState(1.5);
  const [c, setC] = useState(-1);
  const [d, setD] = useState(2);
  const sum = [a + c, b + d];
  const prod = [a * c - b * d, a * d + b * c];
  const quotDen = c * c + d * d;
  const divideError = Math.abs(quotDen) < 1e-9;
  const quot = divideError ? [Number.NaN, Number.NaN] : [(a * c + b * d) / quotDen, (b * c - a * d) / quotDen];
  return (
    <LabFrame
      page={page}
      canvasTitle="PARALLELOGRAM LAW"
      controls={(mode) => (
        <>
          <h2>Vectors (drag points)</h2>
          <p className="cxs-note">Operation {mode} uses the live figure, not a copy-only switch.</p>
          <Slider label="Re z1" value={a} min={-4} max={4} step={0.1} onChange={setA} />
          <Slider label="Im z1" value={b} min={-4} max={4} step={0.1} onChange={setB} />
          {mode !== "Conjugate" ? (
            <>
              <Slider label="Re z2" value={c} min={-4} max={4} step={0.1} onChange={setC} />
              <Slider label="Im z2" value={d} min={-4} max={4} step={0.1} onChange={setD} />
            </>
          ) : <p className="cxs-note">z₂ is hidden in Conjugate mode so only z and z̄ remain.</p>}
        </>
      )}
      canvas={(mode) => {
        const res = mode === "Multiply" ? prod : mode === "Subtract" ? [a - c, b - d] : mode === "Divide" ? quot : mode === "Conjugate" ? [a, -b] : sum;
        return (
          <>
            <ArgandFigure
              re={a}
              im={b}
              wRe={mode === "Conjugate" ? undefined : c}
              wIm={mode === "Conjugate" ? undefined : d}
              resRe={mode === "Divide" && divideError ? undefined : res[0]}
              resIm={mode === "Divide" && divideError ? undefined : res[1]}
              showParallelogram={mode === "Add" || mode === "Subtract"}
              showConjugate={mode === "Conjugate"}
              scale={36}
              width={420}
              height={320}
              onPick={(x, y) => {
                const nx = clamp(x, -4, 4);
                const ny = clamp(y, -4, 4);
                if (mode === "Conjugate" || Math.hypot(nx - a, ny - b) <= Math.hypot(nx - c, ny - d)) {
                  setA(nx);
                  setB(ny);
                } else {
                  setC(nx);
                  setD(ny);
                }
              }}
              label="Parallelogram"
            />
            <Legend items={[["#08a8cf", "z₁"], ["#8b45f4", "z₂"], ["#f59e0b", "result"]]} />
          </>
        );
      }}
      insight={(mode) => {
        const res = mode === "Multiply" ? prod : mode === "Subtract" ? [a - c, b - d] : mode === "Divide" ? quot : mode === "Conjugate" ? [a, -b] : sum;
        return (
          <>
            <Live color="#f59e0b" label="result" value={mode === "Divide" && divideError ? "undefined (divide by 0)" : `${fmt(res[0], 2)} + ${fmt(res[1], 2)}i`} />
            <Live color="#147df2" label="|z1|" value={fmt(Math.hypot(a, b))} />
            <p className="cxs-note">{mode === "Multiply" ? "Multiply adds arguments and multiplies moduli." : mode === "Divide" ? (divideError ? "Cannot divide: |z₂| ≈ 0." : "Divide subtracts arguments.") : mode === "Conjugate" ? "z₂ is hidden; the dashed ray is the conjugate." : "Addition is the parallelogram diagonal."}</p>
            <ChallengeBox {...page.challenge} onCorrect={() => markComplexComplete(page.id)} />
          </>
        );
      }}
    />
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
    <LabFrame
      page={page}
      canvasTitle="POLAR & EXPONENTIAL"
      controls={(mode) => (
        <>
          <h2>Always in sync</h2>
          <Slider label="Re" value={re} min={-4} max={4} step={0.05} onChange={setRe} />
          <Slider label="Im" value={im} min={-4} max={4} step={0.05} onChange={setIm} />
          <Slider label="r" value={r} min={0.2} max={4} step={0.05} onChange={(nr) => setPolar(nr, th)} />
          <Slider label="θ °" value={th} min={branch} max={branch + 359} step={1} onChange={(nth) => setPolar(r, nth)} />
          <Slider label="Branch cut" value={branch} min={-180} max={0} step={1} onChange={setBranch} />
          <p className="cxs-note">{mode}: rectangular, polar, and exponential stay linked.</p>
        </>
      )}
      canvas={(mode) => (
        <>
          <svg
            className="cxs-graph is-interactive"
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
            <line className="cxs-axis" x1="40" y1="140" x2="320" y2="140" />
            <line className="cxs-axis" x1="180" y1="20" x2="180" y2="260" />
            <text x="312" y="132" fontSize="11">Re</text>
            <text x="188" y="28" fontSize="11">Im</text>
            <circle cx="180" cy="140" r={r * 28} fill="none" stroke={mode === "Polar" ? "#8b45f4" : "#94a3b8"} />
            {mode === "Exponential" ? <path d={`M180,140 ${Array.from({ length: 24 }, (_, i) => `L${180 + (i / 8) * re * 28},${140 - (i / 8) * im * 28}`).join(" ")}`} fill="none" stroke="#08b9dd" /> : null}
            <line x1="180" y1="140" x2={180 + re * 28} y2={140 - im * 28} stroke="#8b45f4" strokeWidth="2" />
            <circle cx={180 + re * 28} cy={140 - im * 28} r="6" fill="#f59e0b" />
            <text x="16" y="24" fontSize="12" fill="#334155">{mode === "Rectangular" ? "drag Re, Im" : mode === "Polar" ? "r cis θ" : "r e^{iθ}"}</text>
          </svg>
          <Legend items={[["#8b45f4", "z"], ["#08b9dd", "e^{iθ} path"]]} />
        </>
      )}
      insight={() => (
        <>
          <Live color="#147df2" label="rectangular" value={`${fmt(re, 2)} + ${fmt(im, 2)}i`} />
          <Live color="#8b45f4" label="polar" value={`${fmt(r, 2)} cis ${fmt(th, 0)}°`} />
          <Live color="#08b9dd" label="exp" value={`${fmt(r, 2)} e^{i${fmt(th, 0)}°}`} />
          <p className="cxs-formula">{"z = r (cos θ + i sin θ) = r e^{iθ}"}</p>
          <ChallengeBox {...page.challenge} onCorrect={() => markComplexComplete(page.id)} />
        </>
      )}
    />
  );
}

function RotationLab({ page }: { page: StudioMockupPage }) {
  const [th, setTh] = useState(90);
  const [mag, setMag] = useState(1);
  const powers = Array.from({ length: 8 }, (_, i) => (i * th) % 360);
  return (
    <LabFrame
      page={page}
      canvasTitle="MULTIPLICATION AS ROTATION"
      controls={(mode) => (
        <>
          <h2>Multiply by e^{"{iθ}"}</h2>
          <Slider label="θ" value={th} min={-180} max={180} step={1} onChange={setTh} unit="°" />
          <Slider label="|w|" value={mag} min={0.2} max={2.4} step={0.05} onChange={setMag} />
          <p className="cxs-note">{mode === "Scale" ? "Radius grows when |w| ≠ 1." : mode === "Sequence" ? "Powers of z spiral." : "× i = +90°."}</p>
        </>
      )}
      canvas={(mode) => (
        <>
          <svg className="cxs-graph" viewBox="0 0 320 240" role="img" aria-label={mode}>
            <rect width="320" height="240" fill="#f8fbff" />
            <line className="cxs-axis" x1="16" y1="120" x2="304" y2="120" />
            <line className="cxs-axis" x1="160" y1="16" x2="160" y2="224" />
            <text x="292" y="112" fontSize="11">Re</text>
            <text x="168" y="24" fontSize="11">Im</text>
            <circle cx="160" cy="120" r="70" fill="none" stroke="#94a3b8" />
            {powers.map((angle, i) => (
              <circle key={i} cx={160 + mag * (mode === "Scale" ? 40 + i * 8 : 50 + i * 4) * Math.cos(angle * Math.PI / 180)} cy={120 - mag * (mode === "Scale" ? 40 + i * 8 : 50 + i * 4) * Math.sin(angle * Math.PI / 180)} r="3" fill="#147df2" />
            ))}
          </svg>
          <Legend items={[["#147df2", "z · wⁿ"], ["#94a3b8", "unit circle"]]} />
        </>
      )}
      insight={() => (
        <>
          <Live color="#147df2" label="arg(w)" value={`${fmt(th, 0)}°`} />
          <Live color="#8b45f4" label="|w|" value={fmt(mag, 2)} />
          <p className="cxs-formula">arg(zw) = arg z + arg w</p>
          <ChallengeBox {...page.challenge} onCorrect={() => markComplexComplete(page.id)} />
        </>
      )}
    />
  );
}

function RootsLab({ page }: { page: StudioMockupPage }) {
  const [n, setN] = useState(6);
  const [re, setRe] = useState(1);
  const [im, setIm] = useState(0);
  return (
    <LabFrame
      page={page}
      canvasTitle="ROOTS OF UNITY"
      controls={(mode) => (
        <>
          <h2>nth roots of z</h2>
          <Slider label="n" value={n} min={2} max={10} step={1} onChange={setN} />
          <Slider label="Re z" value={re} min={-3} max={3} step={0.05} onChange={setRe} />
          <Slider label="Im z" value={im} min={-3} max={3} step={0.05} onChange={setIm} />
          <p className="cxs-note">{mode}: De Moivre places roots of z, not only of 1.</p>
        </>
      )}
      canvas={(mode) => {
        const sides = mode === "Square Roots" ? 2 : n;
        const roots = nthRoots({ re, im }, sides);
        const vertices = roots.map((root) => `${180 + root.re * 40},${140 - root.im * 40}`);
        const rad = Math.hypot(re, im) ** (1 / sides) * 40;
        return (
          <>
            <svg className="cxs-graph is-interactive" viewBox="0 0 360 280" role="img" aria-label="Roots">
              <rect width="360" height="280" fill="#f8fbff" />
              <line className="cxs-axis" x1="24" y1="140" x2="336" y2="140" />
              <line className="cxs-axis" x1="180" y1="20" x2="180" y2="260" />
              <text x="328" y="132" fontSize="11">Re</text>
              <text x="188" y="28" fontSize="11">Im</text>
              <circle cx="180" cy="140" r={rad || 80} fill="none" stroke="#94a3b8" />
              <polygon points={vertices.join(" ")} fill="rgba(20,125,242,.08)" stroke="#147df2" />
              {vertices.map((p, i) => <circle key={i} cx={p.split(",")[0]} cy={p.split(",")[1]} r="5" fill="#147df2" />)}
              <circle cx={180 + re * 40} cy={140 - im * 40} r="4" fill="#f59e0b" />
            </svg>
            <Legend items={[["#147df2", "roots"], ["#f59e0b", "z"], ["#94a3b8", "|z|^{1/n} circle"]]} />
          </>
        );
      }}
      insight={(mode) => (
        <>
          <Live color="#147df2" label="roots" value={String(mode === "Square Roots" ? 2 : n)} />
          <Live color="#f59e0b" label="z" value={`${fmt(re, 2)} + ${fmt(im, 2)}i`} />
          <p className="cxs-formula">zⁿ = rⁿ (cos nθ + i sin nθ)</p>
          <ChallengeBox {...page.challenge} onCorrect={() => markComplexComplete(page.id)} />
        </>
      )}
    />
  );
}

function EulerLab({ page }: { page: StudioMockupPage }) {
  const [th, setTh] = useState(180);
  const [terms, setTerms] = useState(6);
  const rad = th * Math.PI / 180;
  const approx = taylorExpITheta(rad, terms);
  const taylor = Array.from({ length: terms }, (_, k) => {
    const n = k;
    let f = 1;
    for (let i = 1; i <= n; i += 1) f *= i;
    return (rad ** n) / f;
  });
  return (
    <LabFrame
      page={page}
      canvasTitle="EULER'S FORMULA"
      controls={(mode) => (
        <>
          <h2>e^{"{iθ}"}</h2>
          <Slider label="θ" value={th} min={0} max={360} step={1} onChange={setTh} unit="°" />
          <Slider label="Taylor terms" value={terms} min={1} max={16} step={1} onChange={setTerms} />
          <p className="cxs-note">{mode}: plane, helix, projections, and Taylor stay linked.</p>
        </>
      )}
      canvas={(mode) => (
        mode === "Helix" ? (
          <StudioMath3D label="Euler helix" compact camera={[3.4, 2.6, 4.6]}>
            <EulerHelix theta={rad} />
          </StudioMath3D>
        ) : (
          <svg className="cxs-graph is-dark" viewBox="0 0 360 240" role="img" aria-label={mode}>
            <rect width="360" height="240" fill="#061428" />
            {mode === "Projections" ? (
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
        )
      )}
      insight={() => (
        <>
          <Live color="#22d3ee" label="cos θ + i sin θ" value={`${fmt(Math.cos(rad), 3)} + ${fmt(Math.sin(rad), 3)}i`} />
          <Live color="#fde68a" label={`Taylor (${terms})`} value={`${fmt(approx.re, 3)} + ${fmt(approx.im, 3)}i`} />
          <p className="cxs-formula">e^{"{iθ}"} = cos θ + i sin θ</p>
          <ChallengeBox {...page.challenge} onCorrect={() => markComplexComplete(page.id)} />
        </>
      )}
    />
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
    <LabFrame
      page={page}
      canvasTitle="LOCI & TRANSFORMS"
      controls={(mode) => (
        <>
          <h2>{mode}</h2>
          <Slider label="r" value={r} min={0.5} max={4} step={0.1} onChange={setR} />
          <p className="cxs-note">Möbius maps send generalized circles to circles.</p>
        </>
      )}
      canvas={(mode) => (
        <svg
          className="cxs-graph is-interactive"
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
          <line className="cxs-axis" x1="20" y1="120" x2="340" y2="120" />
          <line className="cxs-axis" x1="180" y1="20" x2="180" y2="220" />
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
      )}
      insight={(mode) => (
        <>
          <Live color="#147df2" label="locus" value={mode === "Möbius" ? "fixed pts ±1" : `|z|=${fmt(r)}`} />
          <ChallengeBox {...page.challenge} onCorrect={() => markComplexComplete(page.id)} />
        </>
      )}
    />
  );
}

function FractalsLab({ page }: { page: StudioMockupPage }) {
  const [cx, setCx] = useState(-0.123);
  const [cy, setCy] = useState(0.745);
  const [iter, setIter] = useState(40);
  const pts = orbit(0, 0, cx, cy, 18);
  const inside = juliaConnected(cx, cy);
  const bulb = periodBulbLabel(cx, cy);
  return (
    <LabFrame
      page={page}
      canvasTitle="MANDELBROT & JULIA"
      controls={() => (
        <>
          <h2>Fractal controls</h2>
          <Slider label="Re c" value={cx} min={-2} max={1} step={0.001} onChange={setCx} />
          <Slider label="Im c" value={cy} min={-1.2} max={1.2} step={0.001} onChange={setCy} />
          <Slider label="Max iterations" value={iter} min={12} max={80} step={1} onChange={setIter} />
          <button type="button" className="cxs-soft-button" onClick={() => { setCx(-0.123); setCy(0.745); }}>Douady rabbit</button>
          <button type="button" className="cxs-soft-button" onClick={() => { setCx(-0.75); setCy(0.11); }}>Dendrite</button>
          <p className="cxs-note">Click the Mandelbrot plot to choose c. The Julia set and orbit update together.</p>
        </>
      )}
      canvas={(mode) => (
        <>
          <div className="cxs-dual">
            <div
              className="is-interactive"
              onPointerDown={(event: PointerEvent<HTMLDivElement>) => {
                const rect = event.currentTarget.getBoundingClientRect();
                setCx(-2.2 + ((event.clientX - rect.left) / rect.width) * 3.2);
                setCy(1.4 - ((event.clientY - rect.top) / rect.height) * 2.8);
              }}
            >
              <p className="cxs-note">Mandelbrot set · {bulb} · {mode}</p>
              <FractalGrid kind="mandel" cx={cx} cy={cy} iter={iter} />
            </div>
            <div>
              <p className="cxs-note">Julia set for c · {inside ? "connected" : "dust (challenge: is it connected?)"}</p>
              <FractalGrid kind="julia" cx={cx} cy={cy} iter={iter} orbitPts={pts} />
            </div>
          </div>
        </>
      )}
      insight={() => (
        <>
          <Live color="#8b45f4" label="c" value={`${fmt(cx, 3)} + ${fmt(cy, 3)}i`} />
          <Live color="#147df2" label="orbit steps" value={String(pts.length)} />
          <ChallengeBox {...page.challenge} onCorrect={() => markComplexComplete(page.id)} />
        </>
      )}
    />
  );
}

function FractalGrid({ kind, cx, cy, iter, orbitPts }: { kind: "mandel" | "julia"; cx: number; cy: number; iter: number; orbitPts?: Array<{ x: number; y: number }> }) {
  const cols = 72;
  const rows = 48;
  const cells = useMemo(() => computeFractalGrid({ kind, cx, cy, iter, cols, rows }), [cols, rows, cx, cy, iter, kind]);
  return (
    <svg className="cxs-graph is-dark" viewBox={`0 0 ${cols} ${rows}`} role="img" aria-label={kind === "mandel" ? "Mandelbrot set" : "Julia set"}>
      {cells.map((cell) => (
        <rect key={`${cell.col}-${cell.row}`} x={cell.col} y={cell.row} width="1" height="1" fill={cell.k >= iter ? "#020617" : `hsl(${260 + cell.k * 8} 80% ${30 + cell.k * 2}%)`} />
      ))}
      {orbitPts?.map((p, i) => {
        const col = ((p.x + 2.2) / 3.2) * (cols - 1);
        const row = ((1.4 - p.y) / 2.8) * (rows - 1);
        return <circle key={`orb-${i}`} cx={col} cy={row} r="0.7" fill={i === 0 ? "#fde68a" : "#fb7185"} />;
      })}
    </svg>
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
    <LabFrame
      page={page}
      canvasTitle="PHASOR DIAGRAM"
      controls={(mode) => (
        <>
          <h2>RLC in the plane</h2>
          <Slider label="f Hz" value={f} min={10} max={120} step={1} onChange={setF} />
          <Slider label="L" value={l} min={0.01} max={0.5} step={0.01} onChange={setL} />
          <Slider label="C" value={c} min={0.00002} max={0.0004} step={0.00001} onChange={setC} />
          <Slider label="R" value={R} min={5} max={120} step={1} onChange={setR} />
          <p className="cxs-note">{mode}: impedance is a phasor.</p>
        </>
      )}
      canvas={(mode) => (
        <>
          <svg className="cxs-graph" viewBox="0 0 360 220" role="img" aria-label="Phasor">
            <rect width="360" height="220" fill="#f8fbff" />
            <line className="cxs-axis" x1="40" y1="180" x2="330" y2="180" />
            <line className="cxs-axis" x1="60" y1="20" x2="60" y2="200" />
            <line x1="60" y1="180" x2={60 + R * 1.4} y2="180" stroke="#147df2" strokeWidth="3" />
            <line x1={60 + R * 1.4} y1="180" x2={60 + R * 1.4} y2={180 - X * 0.8} stroke="#8b45f4" strokeWidth="3" />
            <line x1="60" y1="180" x2={60 + R * 1.4} y2={180 - X * 0.8} stroke="#f59e0b" strokeWidth="2.4" />
            <text x="24" y="28" fontSize="12">{mode === "Impedance" ? "Z = R + j(XL − XC)" : mode === "AC Circuits" ? "Current lags when X>0" : "Phasor diagram"}</text>
          </svg>
          <Legend items={[["#147df2", "R"], ["#8b45f4", "jX"], ["#f59e0b", "Z"]]} />
        </>
      )}
      insight={() => (
        <>
          <Live color="#147df2" label="|Z|" value={fmt(zMag, 2)} />
          <Live color="#8b45f4" label="power factor" value={fmt(pf, 3)} />
          <Live color="#f59e0b" label="φ" value={`${fmt(phi * 180 / Math.PI, 1)}°`} />
          <ChallengeBox {...page.challenge} onCorrect={() => markComplexComplete(page.id)} />
        </>
      )}
    />
  );
}

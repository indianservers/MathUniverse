import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { MockupLearningStrip } from "../MockupStudioChrome";
import type { StudioMockupPage } from "../studioMockupCatalog";
import {
  ChallengeBox,
  Field,
  LiveRow,
  Panel,
  Segmented,
  SliderRow,
  StatusOk,
  StepList,
  fmt,
  useLabMode,
} from "../studioLabKit";
import { useTrigSession, writeTrigSession } from "../trigStudioSession";

const COLORS = {
  sine: "#8b5cf6",
  cosine: "#06b6d4",
  angle: "#f59e0b",
  anglePoint: "#fb923c",
  success: "#10b981",
  paper: "#f9fcff",
} as const;

const IDENTITIES = [
  { mode: "Pythagorean", label: "sin²θ + cos²θ = 1", formula: "sin²θ + cos²θ = 1" },
  { mode: "Pythagorean", label: "1 + tan²θ = sec²θ", formula: "1 + tan²θ = sec²θ" },
  { mode: "Angle Sum", label: "sin(θ + φ)", formula: "sin(θ + φ) = sin θ cos φ + cos θ sin φ" },
  { mode: "Double Angle", label: "sin 2θ", formula: "sin 2θ = 2 sin θ cos θ" },
  { mode: "Half Angle", label: "sin²(θ/2)", formula: "sin²(θ/2) = (1 − cos θ) / 2" },
  { mode: "Product-Sum", label: "2 sin θ cos φ", formula: "2 sin θ cos φ = sin(θ + φ) + sin(θ − φ)" },
] as const;

const PROOF_STEPS: Record<string, string[]> = {
  Pythagorean: ["Point P lies on the unit circle.", "Its coordinates are (cos θ, sin θ).", "The horizontal leg has length |cos θ|.", "The vertical leg has length |sin θ|.", "Pythagoras gives cos²θ + sin²θ = 1."],
  "Angle Sum": ["Resolve the rotated unit vector.", "Project once along θ.", "Project once perpendicular to θ.", "Collect the horizontal and vertical components.", "The components give the angle-sum identities."],
  "Double Angle": ["Start with the angle-sum identity.", "Set φ = θ.", "Pair the two equal products.", "Factor out the coefficient 2.", "sin 2θ = 2 sin θ cos θ."],
  "Half Angle": ["Replace θ by 2u.", "Use the cosine double-angle identity.", "Rearrange cos 2u = 2cos²u − 1.", "Solve for the squared half-angle term.", "Choose the sign from the active quadrant."],
  "Product-Sum": ["Write the θ + φ identity.", "Write the θ − φ identity.", "Add or subtract the equations.", "Cancel the opposite terms.", "Divide by 2 to isolate the product."],
};

function pointerInFigure(event: ReactPointerEvent<SVGSVGElement>, width: number, height: number) {
  const box = event.currentTarget.getBoundingClientRect();
  const scale = Math.min(box.width / width, box.height / height);
  return {
    x: (event.clientX - box.left - (box.width - width * scale) / 2) / scale,
    y: (event.clientY - box.top - (box.height - height * scale) / 2) / scale,
  };
}

export function IdentitiesLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const session = useTrigSession();
  const [theta, setTheta] = useState(session.theta || 40);
  const [phi, setPhi] = useState(30);
  const [proofView, setProofView] = useState<"Unit Circle" | "Triangle" | "Algebra">("Unit Circle");
  const [identityKey, setIdentityKey] = useState(0);
  const [step, setStep] = useState(2);
  const [challengeMode, setChallengeMode] = useState(false);
  const drag = useRef(false);

  const setAngle = (value: number) => {
    const next = ((value % 360) + 360) % 360;
    setTheta(next);
    writeTrigSession({ theta: next });
  };

  const radians = theta * Math.PI / 180;
  const phiRadians = phi * Math.PI / 180;
  const sine = Math.sin(radians);
  const cosine = Math.cos(radians);
  const cx = 250;
  const cy = 210;
  const radius = 118;
  const px = cx + cosine * radius;
  const py = cy - sine * radius;
  const sumX = cx + Math.cos(radians + phiRadians) * radius;
  const sumY = cy - Math.sin(radians + phiRadians) * radius;
  const doubleX = cx + Math.cos(2 * radians) * radius;
  const doubleY = cy - Math.sin(2 * radians) * radius;
  const halfX = cx + Math.cos(radians / 2) * radius;
  const halfY = cy - Math.sin(radians / 2) * radius;
  const formula = IDENTITIES.find((item) => item.mode === mode && (mode !== "Pythagorean" || item.label === IDENTITIES[identityKey]?.label))?.formula
    ?? IDENTITIES.find((item) => item.mode === mode)?.formula
    ?? IDENTITIES[0].formula;
  const steps = PROOF_STEPS[mode] ?? PROOF_STEPS.Pythagorean!;
  const lhs = mode === "Angle Sum"
    ? Math.sin(radians + phiRadians)
    : mode === "Double Angle"
      ? Math.sin(2 * radians)
      : mode === "Half Angle"
        ? Math.sin(radians / 2) ** 2
        : mode === "Product-Sum"
          ? 2 * sine * Math.cos(phiRadians)
          : identityKey === 1
            ? 1 + (Math.abs(cosine) < 1e-8 ? Number.NaN : (sine / cosine) ** 2)
            : sine * sine + cosine * cosine;
  const rhs = mode === "Angle Sum"
    ? sine * Math.cos(phiRadians) + cosine * Math.sin(phiRadians)
    : mode === "Double Angle"
      ? 2 * sine * cosine
      : mode === "Half Angle"
        ? (1 - cosine) / 2
        : mode === "Product-Sum"
          ? Math.sin(radians + phiRadians) + Math.sin(radians - phiRadians)
          : identityKey === 1
            ? (Math.abs(cosine) < 1e-8 ? Number.NaN : 1 / cosine ** 2)
            : 1;
  const wave = Array.from({ length: 181 }, (_, index) => {
    const t = (index / 180) * 2 * Math.PI;
    return `${40 + index * 2.55},${368 - 28 * (Math.sin(t) * Math.cos(phiRadians) * 2)}`;
  }).join(" ");

  const pointerAngle = (event: ReactPointerEvent<SVGSVGElement>) => {
    const point = pointerInFigure(event, 520, 390);
    setAngle(Math.atan2(cy - point.y, point.x - cx) * 180 / Math.PI);
  };

  return (
    <>
      <nav className="msk-tabs trig-target-tabs id-target-tabs" aria-label="Identities modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => { setMode(item); setStep(2); if (item === "Pythagorean") setIdentityKey(0); }}>
            {item}
          </button>
        ))}
      </nav>
      <div className="msk-lab trig-target-lab id-target-lab" data-lab-mode={mode} data-mode-canvas={mode} data-id-mode={mode}>
        <Panel title="Identity explorer" className="trig-target trig-target-controls id-target-controls">
          <Field label="Search identities">
            <input type="search" value={formula} readOnly aria-label="Selected identity" />
          </Field>
          <div className="msk-history trig-target-identity-list id-target-identity-list">
            {IDENTITIES.map((identity, index) => (
              <button
                key={identity.label}
                type="button"
                className={identity.mode === mode && (mode !== "Pythagorean" || index === identityKey) ? "active" : ""}
                onClick={() => {
                  setMode(identity.mode);
                  setIdentityKey(identity.mode === "Pythagorean" ? index : 0);
                  setStep(2);
                }}
              >
                {identity.label}
              </button>
            ))}
          </div>
          <div className="id-target-angle-readout" aria-live="polite">
            <span>θ =</span>
            <strong>{fmt(theta, 0)}°</strong>
          </div>
          <SliderRow label="Angle θ" value={theta} min={0} max={360} step={1} onChange={setAngle} unit="°" />
          {(mode === "Angle Sum" || mode === "Product-Sum") ? (
            <SliderRow label="Angle φ" value={phi} min={0} max={180} step={1} onChange={setPhi} unit="°" />
          ) : null}
          <Field label="Proof view">
            <Segmented
              value={proofView}
              onChange={(value) => setProofView(value as "Unit Circle" | "Triangle" | "Algebra")}
              options={["Unit Circle", "Triangle", "Algebra"].map((value) => ({ id: value, label: value }))}
            />
          </Field>
          <div className="msk-btn-row">
            <button type="button" className="msk-soft" disabled={step === 0} onClick={() => setStep((valueNow) => Math.max(0, valueNow - 1))}>‹</button>
            <strong>{step + 1} / {steps.length}</strong>
            <button type="button" className="msk-soft" disabled={step >= steps.length - 1} onClick={() => setStep((valueNow) => Math.min(steps.length - 1, valueNow + 1))}>›</button>
          </div>
          <label className="msk-toggle"><input type="checkbox" checked={challengeMode} onChange={(event) => setChallengeMode(event.target.checked)} /> Challenge mode</label>
        </Panel>

        <section className="msk-panel msk-canvas trig-target trig-target-identities-canvas id-target-canvas" data-trig-target-mode={mode} data-id-mode={mode}>
          <header className="trig-target-proof-heading id-target-proof-heading">
            <b>Visual Proof: {formula}</b>
            <span>θ = {fmt(theta, 0)}°</span>
          </header>
          {proofView === "Algebra" ? (
            <div className="id-target-algebra" aria-label={`${mode} algebraic proof`}>
              {steps.map((item, index) => (
                <p key={item} className={index <= step ? "is-on" : ""}>
                  <b>{index + 1}</b>
                  <span>{item}</span>
                </p>
              ))}
              <p className="msk-formula">{formula}</p>
            </div>
          ) : (
            <svg
              className="msk-graph is-interactive trig-target-proof-figure id-target-figure"
              viewBox="0 0 520 390"
              role="img"
              aria-label={`${mode} visual proof`}
              onPointerDown={(event) => { drag.current = true; event.currentTarget.setPointerCapture(event.pointerId); pointerAngle(event); }}
              onPointerMove={(event) => { if (drag.current) pointerAngle(event); }}
              onPointerUp={(event) => { drag.current = false; event.currentTarget.releasePointerCapture(event.pointerId); }}
              onPointerLeave={() => { drag.current = false; }}
            >
              <rect width="520" height="390" rx="12" fill={COLORS.paper} />
              {Array.from({ length: 13 }, (_, index) => <line key={`v${index}`} x1={20 + index * 40} y1="18" x2={20 + index * 40} y2="372" stroke="#e8eef6" />)}
              {Array.from({ length: 10 }, (_, index) => <line key={`h${index}`} x1="20" y1={18 + index * 39} x2="500" y2={18 + index * 39} stroke="#e8eef6" />)}
              <line x1="48" y1={cy} x2="452" y2={cy} stroke="#334155" />
              <line x1={cx} y1="42" x2={cx} y2="372" stroke="#334155" />
              {proofView === "Unit Circle" ? <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#38bdf8" strokeWidth="2" /> : null}
              <polygon points={`${cx},${cy} ${px},${cy} ${px},${py}`} fill="rgba(139,92,246,.12)" stroke={COLORS.sine} />
              <line x1={cx} y1={cy} x2={px} y2={cy} stroke={COLORS.cosine} strokeWidth="2.6" />
              <line x1={px} y1={cy} x2={px} y2={py} stroke={COLORS.sine} strokeWidth="2.6" />
              <line x1={cx} y1={cy} x2={px} y2={py} stroke={COLORS.angle} strokeWidth="2.6" />
              <path d={`M ${cx + 28} ${cy} A 28 28 0 ${theta > 180 ? 1 : 0} 0 ${cx + 28 * cosine} ${cy - 28 * sine}`} fill="none" stroke={COLORS.angle} strokeWidth="2" />
              <circle cx={px} cy={py} r="7" fill={COLORS.anglePoint} stroke="#fff7ed" strokeWidth="2" />
              <text x={px + 10} y={py - 8} fill="#0f172a" fontSize="12">P(cos θ, sin θ)</text>
              <text x={(cx + px) / 2} y={cy + 18} fill="#0891b2" fontSize="12" textAnchor="middle">cos θ</text>
              <text x={px + 10} y={(cy + py) / 2} fill="#7c3aed" fontSize="12">sin θ</text>
              <text x={cx + 36} y={cy - 10} fill={COLORS.angle} fontSize="13" fontWeight="700">{fmt(theta, 0)}°</text>

              {mode === "Pythagorean" ? (
                <>
                  <rect x={cx} y={cy - Math.abs(sine) * 54 - 8} width={Math.abs(sine) * 54} height={Math.abs(sine) * 54} fill="rgba(139,92,246,.22)" stroke={COLORS.sine} />
                  <rect x={cx - Math.abs(cosine) * 54 - 8} y={cy} width={Math.abs(cosine) * 54} height={Math.abs(cosine) * 54} fill="rgba(6,182,212,.18)" stroke={COLORS.cosine} />
                  <g transform="translate(392 58)">
                    <rect width="72" height="72" fill="rgba(139,92,246,.25)" stroke={COLORS.sine} />
                    <text x="16" y="42" fill="#7c3aed" fontSize="13">sin²θ</text>
                    <text x="30" y="92" fill="#334155" fontSize="18">+</text>
                    <rect y="104" width="72" height="72" fill="rgba(6,182,212,.22)" stroke={COLORS.cosine} />
                    <text x="14" y="146" fill="#0891b2" fontSize="13">cos²θ</text>
                    <text x="24" y="202" fill="#334155" fontSize="20">= 1</text>
                  </g>
                </>
              ) : null}

              {mode === "Angle Sum" ? (
                <>
                  <line x1={cx} y1={cy} x2={sumX} y2={sumY} stroke={COLORS.sine} strokeWidth="2.5" />
                  <path d={`M ${cx + 46} ${cy} A 46 46 0 0 0 ${cx + 46 * Math.cos(radians + phiRadians)} ${cy - 46 * Math.sin(radians + phiRadians)}`} fill="none" stroke={COLORS.sine} strokeWidth="2" />
                  <text x={sumX + 8} y={sumY - 6} fill={COLORS.sine} fontSize="12">θ + φ</text>
                  <text x="28" y="36" fill={COLORS.sine} fontSize="12">φ = {fmt(phi, 0)}°</text>
                </>
              ) : null}

              {mode === "Double Angle" ? (
                <>
                  <line x1={cx} y1={cy} x2={doubleX} y2={doubleY} stroke={COLORS.sine} strokeWidth="2.6" />
                  <text x={doubleX + 8} y={doubleY - 6} fill={COLORS.sine} fontSize="12">2θ</text>
                  <text x="28" y="36" fill={COLORS.angle} fontSize="12">θ is gold · gold ray is 2θ in purple</text>
                </>
              ) : null}

              {mode === "Half Angle" ? (
                <>
                  <line x1={cx} y1={cy} x2={halfX} y2={halfY} stroke={COLORS.cosine} strokeWidth="2.6" />
                  <text x={halfX + 8} y={halfY - 6} fill={COLORS.cosine} fontSize="12">θ/2</text>
                </>
              ) : null}

              {mode === "Product-Sum" ? (
                <>
                  <line x1={cx} y1={cy} x2={sumX} y2={sumY} stroke={COLORS.sine} strokeWidth="2.4" />
                  <polyline points={wave} fill="none" stroke={COLORS.angle} strokeWidth="2" />
                  <text x="28" y="36" fill={COLORS.angle} fontSize="12">product 2 sin θ cos φ as a wave sum</text>
                </>
              ) : null}
            </svg>
          )}
          <div className="trig-target-symbolic-proof id-target-symbolic">
            <b>Symbolic derivation</b>
            <div className="msk-formula">{steps.slice(0, step + 1).join("  →  ")}</div>
          </div>
          <div className="id-target-numeric" aria-label="Numerical verification">
            <article>
              <small>LHS</small>
              <strong>{fmt(lhs, 5)}</strong>
            </article>
            <article>
              <small>RHS</small>
              <strong>{fmt(rhs, 5)}</strong>
            </article>
            <article>
              <small>|LHS − RHS|</small>
              <strong>{fmt(Math.abs(lhs - rhs), 6)}</strong>
            </article>
          </div>
        </section>

        <aside className="msk-panel msk-live trig-target trig-target-right-rail id-target-rail">
          <section className="uc-target-rail-section">
            <h2>Live substitution</h2>
            <LiveRow color={COLORS.sine} label="sin θ" value={fmt(sine, 6)} />
            <LiveRow color={COLORS.cosine} label="cos θ" value={fmt(cosine, 6)} />
            {(mode === "Angle Sum" || mode === "Product-Sum") ? <LiveRow color={COLORS.angle} label="φ" value={`${fmt(phi, 0)}°`} /> : null}
            <LiveRow color={COLORS.angle} label="LHS" value={fmt(lhs, 6)} />
            <LiveRow color={COLORS.success} label="RHS" value={fmt(rhs, 6)} />
            <StatusOk>LHS = RHS · Identity verified</StatusOk>
          </section>
          <section className="uc-target-rail-section">
            <h2>Why it works</h2>
            <p className="msk-note">{steps[Math.min(step, steps.length - 1)]}</p>
          </section>
          <section className="uc-target-rail-section">
            <h2>Proof progress</h2>
            <progress max={steps.length} value={step + 1}>{step + 1} / {steps.length}</progress>
            <StepList items={steps.slice(0, step + 1)} />
          </section>
          {challengeMode ? <ChallengeBox page={page} mode={mode} /> : null}
        </aside>
      </div>
      <div className="trig-target-footer id-target-footer">
        <MockupLearningStrip page={page} mode={mode} />
      </div>
    </>
  );
}

export default IdentitiesLab;

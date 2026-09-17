import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
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
  parseChallengeAnswer,
  useLabMode,
} from "../studioLabKit";
import { useTrigSession, writeTrigSession } from "../trigStudioSession";

const COLORS = {
  sine: "#8b5cf6",
  cosine: "#06b6d4",
  angle: "#f59e0b",
  anglePoint: "#fb923c",
  double: "#7c3aed",
  success: "#10b981",
  paper: "#f9fcff",
  trap: "#ef4444",
} as const;

type DoubleForm = "sin" | "cos" | "tan";

const IDENTITIES = [
  { mode: "Pythagorean", label: "sin²θ + cos²θ = 1", formula: "sin²θ + cos²θ = 1" },
  { mode: "Pythagorean", label: "1 + tan²θ = sec²θ", formula: "1 + tan²θ = sec²θ" },
  { mode: "Angle Sum", label: "sin(θ + φ)", formula: "sin(θ + φ) = sin θ cos φ + cos θ sin φ" },
  { mode: "Double Angle", label: "sin 2θ", formula: "sin 2θ = 2 sin θ cos θ", form: "sin" as const },
  { mode: "Double Angle", label: "cos 2θ", formula: "cos 2θ = cos²θ − sin²θ", form: "cos" as const },
  { mode: "Double Angle", label: "tan 2θ", formula: "tan 2θ = 2 tan θ / (1 − tan²θ)", form: "tan" as const },
  { mode: "Half Angle", label: "sin²(θ/2)", formula: "sin²(θ/2) = (1 − cos θ) / 2" },
  { mode: "Product-Sum", label: "2 sin θ cos φ", formula: "2 sin θ cos φ = sin(θ + φ) + sin(θ − φ)" },
] as const;

const DOUBLE_FORMS: Array<{ id: DoubleForm; label: string; formula: string }> = [
  { id: "sin", label: "sin 2θ", formula: "sin 2θ = 2 sin θ cos θ" },
  { id: "cos", label: "cos 2θ", formula: "cos 2θ = cos²θ − sin²θ" },
  { id: "tan", label: "tan 2θ", formula: "tan 2θ = 2 tan θ / (1 − tan²θ)" },
];

const SPECIAL_ANGLES = [0, 15, 30, 45, 60, 90];

const PROOF_STEPS: Record<string, string[]> = {
  Pythagorean: ["Point P lies on the unit circle.", "Its coordinates are (cos θ, sin θ).", "The horizontal leg has length |cos θ|.", "The vertical leg has length |sin θ|.", "Pythagoras gives cos²θ + sin²θ = 1."],
  "Angle Sum": ["Resolve the rotated unit vector.", "Project once along θ.", "Project once perpendicular to θ.", "Collect the horizontal and vertical components.", "The components give the angle-sum identities."],
  "Double Angle": ["Start with the angle-sum identity.", "Set φ = θ so the second angle is a copy of the first.", "The two products sinθ cosθ and cosθ sinθ are equal.", "Add them: the 2 is those matching terms.", "sin 2θ = 2 sin θ cos θ."],
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

function exactish(n: number) {
  if (!Number.isFinite(n)) return "undefined";
  const hits: Array<[number, string]> = [
    [0, "0"], [0.5, "1/2"], [Math.SQRT1_2, "√2/2"], [Math.sqrt(3) / 2, "√3/2"], [1, "1"],
    [Math.sqrt(3) / 3, "√3/3"], [Math.SQRT2, "√2"], [Math.sqrt(3), "√3"], [2, "2"],
    [-0.5, "−1/2"], [-Math.SQRT1_2, "−√2/2"], [-Math.sqrt(3) / 2, "−√3/2"], [-1, "−1"],
  ];
  const hit = hits.find(([value]) => Math.abs(value - n) < 0.012);
  return hit ? hit[1] : fmt(n, 4);
}

function wrapDeg(value: number) {
  return ((value % 360) + 360) % 360;
}

function quadrantLabel(deg: number) {
  const a = wrapDeg(deg);
  if (a === 0) return "positive x-axis";
  if (a === 90) return "positive y-axis";
  if (a === 180) return "negative x-axis";
  if (a === 270) return "negative y-axis";
  if (a < 90) return "I";
  if (a < 180) return "II";
  if (a < 270) return "III";
  return "IV";
}

function polar(cx: number, cy: number, radius: number, deg: number) {
  const radians = deg * Math.PI / 180;
  return { x: cx + radius * Math.cos(radians), y: cy - radius * Math.sin(radians) };
}

function wedgePath(cx: number, cy: number, radius: number, fromDeg: number, toDeg: number) {
  const start = polar(cx, cy, radius, fromDeg);
  const end = polar(cx, cy, radius, toDeg);
  const delta = wrapDeg(toDeg - fromDeg);
  const large = delta > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${radius} ${radius} 0 ${large} 0 ${end.x} ${end.y} Z`;
}

function doubleProofSteps(theta: number, form: DoubleForm, sine: number, cosine: number): string[] {
  const s = exactish(sine);
  const c = exactish(cosine);
  if (form === "cos") {
    return [
      "Start from cos(θ + φ) = cosθ cosφ − sinθ sinφ.",
      `Set φ = θ. Here θ = ${fmt(theta, 0)}°, so you add the same angle twice.`,
      `cos(θ+θ) = cosθ cosθ − sinθ sinθ = cos²θ − sin²θ.`,
      `The same value is 2cos²θ − 1 and 1 − 2sin²θ (Pythagoras).`,
      `cos 2θ = ${c}² − ${s}² = ${exactish(cosine * cosine - sine * sine)}.`,
    ];
  }
  if (form === "tan") {
    return [
      "Divide the sine and cosine double-angle identities.",
      "tan 2θ = sin 2θ / cos 2θ = (2 sinθ cosθ) / (cos²θ − sin²θ).",
      "Divide numerator and denominator by cos²θ to get tans.",
      "tan 2θ = 2 tanθ / (1 − tan²θ), provided cos 2θ ≠ 0.",
      `At θ = ${fmt(theta, 0)}° this is ${exactish(Number.isFinite(2 * sine * cosine / (cosine * cosine - sine * sine)) ? 2 * sine * cosine / (cosine * cosine - sine * sine) : Number.NaN)}.`,
    ];
  }
  return [
    "Start from sin(θ + φ) = sinθ cosφ + cosθ sinφ.",
    `Double angle means φ = θ. Here θ = ${fmt(theta, 0)}°, so φ is another copy of θ.`,
    "sin(θ+θ) = sinθ cosθ + cosθ sinθ — two equal products.",
    "Add them: the coefficient 2 is those two matching terms, not “twice the sine”.",
    `sin 2θ = 2 · ${s} · ${c} = ${exactish(2 * sine * cosine)}.`,
  ];
}

export function IdentitiesLab({ page }: { page: StudioMockupPage }) {
  const { tabs, mode, setMode } = useLabMode(page);
  const session = useTrigSession();
  const [theta, setTheta] = useState(session.theta || 40);
  const [phi, setPhi] = useState(30);
  const [proofView, setProofView] = useState<"Unit Circle" | "Triangle" | "Algebra">("Unit Circle");
  const [identityKey, setIdentityKey] = useState(0);
  const [doubleForm, setDoubleForm] = useState<DoubleForm>("sin");
  const [step, setStep] = useState(2);
  const [challengeMode, setChallengeMode] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [sweep, setSweep] = useState(1);
  const [checkAnswer, setCheckAnswer] = useState("");
  const [checkStatus, setCheckStatus] = useState("");
  const drag = useRef(false);

  const setAngle = (value: number) => {
    const next = wrapDeg(value);
    setTheta(next);
    writeTrigSession({ theta: next });
  };

  useEffect(() => {
    if (!playing) return;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / 900);
      setSweep(progress);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const radians = theta * Math.PI / 180;
  const phiRadians = phi * Math.PI / 180;
  const sine = Math.sin(radians);
  const cosine = Math.cos(radians);
  const tangent = Math.abs(cosine) < 1e-8 ? Number.NaN : sine / cosine;
  const doubleTheta = wrapDeg(2 * theta);
  const doubleRadians = 2 * radians;
  const sinDouble = Math.sin(doubleRadians);
  const cosDouble = Math.cos(doubleRadians);
  const tanDouble = Math.abs(cosDouble) < 1e-8 ? Number.NaN : sinDouble / cosDouble;
  const twoSinCos = 2 * sine * cosine;
  const cosDiff = cosine * cosine - sine * sine;
  const cosFromCos = 2 * cosine * cosine - 1;
  const cosFromSin = 1 - 2 * sine * sine;
  const tanRhs = !Number.isFinite(tangent) || Math.abs(1 - tangent * tangent) < 1e-8
    ? Number.NaN
    : (2 * tangent) / (1 - tangent * tangent);
  const trapValue = 2 * sine;
  const tanUndefined = !Number.isFinite(tanDouble) || !Number.isFinite(tanRhs);
  const cx = 250;
  const cy = 210;
  const radius = 118;
  const px = cx + cosine * radius;
  const py = cy - sine * radius;
  const sumX = cx + Math.cos(radians + phiRadians) * radius;
  const sumY = cy - Math.sin(radians + phiRadians) * radius;
  const doubleX = cx + Math.cos(doubleRadians) * radius;
  const doubleY = cy - Math.sin(doubleRadians) * radius;
  const halfX = cx + Math.cos(radians / 2) * radius;
  const halfY = cy - Math.sin(radians / 2) * radius;
  const sweepDeg = theta + sweep * theta;
  const sweepPt = polar(cx, cy, radius, sweepDeg);
  const selectedIdentity = IDENTITIES.find((item) => {
    if (item.mode !== mode) return false;
    if (mode === "Pythagorean") return IDENTITIES.indexOf(item) === identityKey;
    if (mode === "Double Angle") return item.form === doubleForm;
    return true;
  });
  const formula = selectedIdentity?.formula
    ?? IDENTITIES.find((item) => item.mode === mode)?.formula
    ?? IDENTITIES[0].formula;
  const steps = mode === "Double Angle"
    ? doubleProofSteps(theta, doubleForm, sine, cosine)
    : (PROOF_STEPS[mode] ?? PROOF_STEPS.Pythagorean!);
  const lhs = mode === "Angle Sum"
    ? Math.sin(radians + phiRadians)
    : mode === "Double Angle"
      ? doubleForm === "cos"
        ? cosDouble
        : doubleForm === "tan"
          ? tanDouble
          : sinDouble
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
      ? doubleForm === "cos"
        ? cosDiff
        : doubleForm === "tan"
          ? tanRhs
          : twoSinCos
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
  const identityHolds = Number.isFinite(lhs) && Number.isFinite(rhs) && Math.abs(lhs - rhs) < 1e-9;
  const trapEquals = Math.abs(trapValue - sinDouble) < 1e-9;

  const pointerAngle = (event: ReactPointerEvent<SVGSVGElement>) => {
    const point = pointerInFigure(event, 520, 390);
    setAngle(Math.atan2(cy - point.y, point.x - cx) * 180 / Math.PI);
  };

  const chooseIdentity = (identity: (typeof IDENTITIES)[number], index: number) => {
    setMode(identity.mode);
    setIdentityKey(identity.mode === "Pythagorean" ? index : 0);
    if (identity.mode === "Double Angle" && identity.form) setDoubleForm(identity.form);
    setStep(2);
    setPlaying(false);
    setSweep(1);
    setCheckStatus("");
  };

  const gradeMiniCheck = () => {
    const expected = doubleForm === "cos" ? cosDouble : doubleForm === "tan" ? tanDouble : sinDouble;
    const parsed = parseChallengeAnswer(checkAnswer);
    const ok = Number.isFinite(expected) && Number.isFinite(parsed) && Math.abs(parsed - expected) < 0.03;
    setCheckStatus(ok
      ? `Yes — ${DOUBLE_FORMS.find((item) => item.id === doubleForm)?.label} = ${exactish(expected)} at θ = ${fmt(theta, 0)}°.`
      : `Use the live substitution. At θ = ${fmt(theta, 0)}° the value is ${exactish(expected)}.`);
  };

  return (
    <>
      <nav className="msk-tabs trig-target-tabs id-target-tabs" aria-label="Identities modes">
        {tabs.map((item) => (
          <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => { setMode(item); setStep(2); if (item === "Pythagorean") setIdentityKey(0); if (item === "Double Angle") setDoubleForm("sin"); setPlaying(false); setSweep(1); }}>
            {item}
          </button>
        ))}
      </nav>
      <div className="msk-lab trig-target-lab id-target-lab" data-lab-mode={mode} data-mode-canvas={mode} data-id-mode={mode} data-double-form={mode === "Double Angle" ? doubleForm : undefined} data-double-theta={mode === "Double Angle" ? String(Math.round(theta)) : undefined} data-double-2theta={mode === "Double Angle" ? String(Math.round(doubleTheta)) : undefined}>
        <Panel title="Identity explorer" className="trig-target trig-target-controls id-target-controls">
          <Field label="Search identities">
            <input type="search" value={formula} readOnly aria-label="Selected identity" />
          </Field>
          <div className="msk-history trig-target-identity-list id-target-identity-list">
            {IDENTITIES.map((identity, index) => (
              <button
                key={identity.label}
                type="button"
                className={identity.mode === mode && (mode === "Pythagorean" ? index === identityKey : mode === "Double Angle" ? identity.form === doubleForm : true) ? "active" : ""}
                onClick={() => chooseIdentity(identity, index)}
              >
                {identity.label}
              </button>
            ))}
          </div>
          <div className="id-target-angle-readout" aria-live="polite">
            <span>θ =</span>
            <strong>{fmt(theta, 0)}°</strong>
            {mode === "Double Angle" ? (
              <>
                <span className="id-double-arrow">→</span>
                <span>2θ =</span>
                <strong data-testid="double-angle-2theta">{fmt(doubleTheta, 0)}°</strong>
              </>
            ) : null}
          </div>
          <SliderRow label="Angle θ" value={theta} min={0} max={360} step={1} onChange={setAngle} unit="°" />
          {mode === "Double Angle" ? (
            <div className="id-double-snaps" role="group" aria-label="Special double-angle values">
              {SPECIAL_ANGLES.map((angle) => (
                <button key={angle} type="button" className={Math.round(theta) === angle ? "active" : ""} onClick={() => setAngle(angle)}>
                  {angle}°
                </button>
              ))}
            </div>
          ) : null}
          {(mode === "Angle Sum" || mode === "Product-Sum") ? (
            <SliderRow label="Angle φ" value={phi} min={0} max={180} step={1} onChange={setPhi} unit="°" />
          ) : null}
          {mode === "Double Angle" ? (
            <Field label="Which double-angle identity">
              <Segmented
                value={doubleForm}
                onChange={(value) => { setDoubleForm(value as DoubleForm); setStep(2); setCheckStatus(""); }}
                options={DOUBLE_FORMS.map((item) => ({ id: item.id, label: item.label }))}
              />
            </Field>
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
          {mode === "Double Angle" ? (
            <button
              type="button"
              className="msk-soft id-double-play"
              onClick={() => { setSweep(0); setPlaying(true); }}
            >
              Play doubling: θ → 2θ
            </button>
          ) : null}
          <label className="msk-toggle"><input type="checkbox" checked={challengeMode} onChange={(event) => setChallengeMode(event.target.checked)} /> Challenge mode</label>
        </Panel>

        <section className="msk-panel msk-canvas trig-target trig-target-identities-canvas id-target-canvas" data-trig-target-mode={mode} data-id-mode={mode}>
          <header className="trig-target-proof-heading id-target-proof-heading">
            <b>Visual Proof: {formula}</b>
            <span>θ = {fmt(theta, 0)}°</span>
          </header>
          {mode === "Double Angle" ? (
            <p className="id-double-legend" data-testid="double-angle-legend">
              <i style={{ background: COLORS.angle }} /> Gold ray is θ
              <i style={{ background: COLORS.double }} /> Purple ray is 2θ
              <i style={{ background: COLORS.sine }} /> Two gold wedges stack as θ + θ
            </p>
          ) : null}
          {mode === "Double Angle" ? (
            <p className="id-double-formula" aria-label="Color-coded double-angle formula">
              {doubleForm === "sin" ? (
                <>
                  <b style={{ color: COLORS.double }}>sin 2θ</b>
                  {" = "}
                  <b>2</b>
                  {" · "}
                  <b style={{ color: COLORS.sine }}>sin θ</b>
                  {" · "}
                  <b style={{ color: COLORS.cosine }}>cos θ</b>
                </>
              ) : doubleForm === "cos" ? (
                <>
                  <b style={{ color: COLORS.double }}>cos 2θ</b>
                  {" = "}
                  <b style={{ color: COLORS.cosine }}>cos²θ</b>
                  {" − "}
                  <b style={{ color: COLORS.sine }}>sin²θ</b>
                </>
              ) : (
                <>
                  <b style={{ color: COLORS.double }}>tan 2θ</b>
                  {" = 2 tan θ / (1 − tan²θ)"}
                </>
              )}
            </p>
          ) : null}
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
              {mode === "Double Angle" ? (
                <>
                  <path d={wedgePath(cx, cy, 52, 0, theta)} fill="rgba(245,158,11,.28)" stroke={COLORS.angle} />
                  <path d={wedgePath(cx, cy, 52, theta, doubleTheta)} fill="rgba(124,58,237,.22)" stroke={COLORS.double} />
                </>
              ) : null}
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
                  <line x1={cx} y1={cy} x2={doubleX} y2={doubleY} stroke={COLORS.double} strokeWidth="2.8" />
                  <circle cx={doubleX} cy={doubleY} r="6" fill={COLORS.double} stroke="#fff" strokeWidth="2" />
                  <text x={doubleX + 8} y={doubleY - 6} fill={COLORS.double} fontSize="12" fontWeight="700">2θ = {fmt(doubleTheta, 0)}°</text>
                  {playing || sweep < 1 ? (
                    <line x1={cx} y1={cy} x2={sweepPt.x} y2={sweepPt.y} stroke={COLORS.double} strokeWidth="2" strokeDasharray="6 5" />
                  ) : null}
                  <text x="28" y="28" fill={COLORS.angle} fontSize="12">Gold ray is θ · purple ray is 2θ</text>
                  <text x="28" y="46" fill={COLORS.double} fontSize="12">2θ is θ stacked on θ, not “twice the sine”</text>
                  <g transform="translate(368 54)" aria-label="Area model 2 sin θ cos θ">
                    <rect width={Math.max(18, Math.abs(cosine) * 86)} height={Math.max(14, Math.abs(sine) * 72)} fill="rgba(16,185,129,.16)" stroke={COLORS.success} />
                    <text x="4" y="-6" fill={COLORS.success} fontSize="11">area 2 sinθ cosθ</text>
                    <text x="4" y={Math.max(28, Math.abs(sine) * 72) + 14} fill="#334155" fontSize="11">{exactish(twoSinCos)}</text>
                  </g>
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
          {mode === "Double Angle" ? (
            <svg className="id-double-graph" viewBox="0 0 520 92" role="img" aria-label="sin θ versus sin 2θ period doubling">
              <rect width="520" height="92" rx="10" fill="#fff" />
              <text x="12" y="16" fill="#64748b" fontSize="11">Period doubling: sin θ (gold) vs sin 2θ (purple)</text>
              <line x1="16" y1="52" x2="504" y2="52" stroke="#e2e8f0" />
              <polyline
                fill="none"
                stroke={COLORS.angle}
                strokeWidth="2"
                points={Array.from({ length: 181 }, (_, index) => {
                  const t = (index / 180) * 2 * Math.PI;
                  return `${16 + index * 2.7},${52 - 22 * Math.sin(t)}`;
                }).join(" ")}
              />
              <polyline
                fill="none"
                stroke={COLORS.double}
                strokeWidth="2"
                points={Array.from({ length: 181 }, (_, index) => {
                  const t = (index / 180) * 2 * Math.PI;
                  return `${16 + index * 2.7},${52 - 22 * Math.sin(2 * t)}`;
                }).join(" ")}
              />
              <circle cx={16 + (theta / 360) * 486} cy={52 - 22 * sine} r="4" fill={COLORS.angle} />
              <circle cx={16 + (theta / 360) * 486} cy={52 - 22 * sinDouble} r="4" fill={COLORS.double} />
            </svg>
          ) : null}
          <div className="trig-target-symbolic-proof id-target-symbolic">
            <b>Symbolic derivation</b>
            <div className="msk-formula">{steps.slice(0, step + 1).join("  →  ")}</div>
          </div>
          <div className="id-target-numeric" aria-label="Numerical verification">
            <article>
              <small>LHS</small>
              <strong>{exactish(lhs)}</strong>
              <em>≈ {fmt(lhs, 5)}</em>
            </article>
            <article>
              <small>RHS</small>
              <strong>{exactish(rhs)}</strong>
              <em>≈ {fmt(rhs, 5)}</em>
            </article>
            <article>
              <small>|LHS − RHS|</small>
              <strong>{fmt(Math.abs((Number.isFinite(lhs) ? lhs : 0) - (Number.isFinite(rhs) ? rhs : 0)), 6)}</strong>
            </article>
          </div>
        </section>

        <aside className="msk-panel msk-live trig-target trig-target-right-rail id-target-rail">
          <section className="uc-target-rail-section">
            <h2>Live substitution</h2>
            <LiveRow color={COLORS.sine} label="sin θ" value={`${exactish(sine)}  ·  ${fmt(sine, 6)}`} />
            <LiveRow color={COLORS.cosine} label="cos θ" value={`${exactish(cosine)}  ·  ${fmt(cosine, 6)}`} />
            {mode === "Double Angle" ? <LiveRow color={COLORS.double} label="2θ" value={`${fmt(doubleTheta, 0)}° · Q ${quadrantLabel(doubleTheta)}`} /> : null}
            {(mode === "Angle Sum" || mode === "Product-Sum") ? <LiveRow color={COLORS.angle} label="φ" value={`${fmt(phi, 0)}°`} /> : null}
            <LiveRow color={COLORS.angle} label="LHS" value={exactish(lhs)} />
            <LiveRow color={COLORS.success} label="RHS" value={exactish(rhs)} />
            <StatusOk>{identityHolds ? "LHS = RHS · Identity verified" : tanUndefined ? "tan 2θ is undefined at this θ" : "Values updating"}</StatusOk>
          </section>
          {mode === "Double Angle" ? (
            <section className="uc-target-rail-section id-double-trap" data-testid="double-angle-trap">
              <h2>Common trap</h2>
              <p className="msk-note">sin 2θ is not 2 sin θ. The 2 multiplies the product sinθ cosθ.</p>
              <LiveRow color={COLORS.trap} label="2 sin θ" value={exactish(trapValue)} />
              <LiveRow color={COLORS.double} label="sin 2θ" value={exactish(sinDouble)} />
              <p className={trapEquals ? "msk-ok" : "id-double-mismatch"}>{trapEquals ? "Equal only at special θ such as 0°." : "Different — doubling the angle is not doubling the sine."}</p>
            </section>
          ) : null}
          {mode === "Double Angle" ? (
            <section className="uc-target-rail-section id-double-cosforms" data-testid="double-angle-cos-forms">
              <h2>Three faces of cos 2θ</h2>
              <LiveRow color={COLORS.double} label="cos²θ − sin²θ" value={exactish(cosDiff)} />
              <LiveRow color={COLORS.cosine} label="2cos²θ − 1" value={exactish(cosFromCos)} />
              <LiveRow color={COLORS.sine} label="1 − 2sin²θ" value={exactish(cosFromSin)} />
              <p className="msk-ok">All three match cos 2θ.</p>
            </section>
          ) : null}
          {mode === "Double Angle" ? (
            <section className="uc-target-rail-section" data-testid="double-angle-tan-domain">
              <h2>Where tan 2θ breaks</h2>
              <p className="msk-note">Undefined when cos 2θ = 0, i.e. θ = 45° + 90°k. Then 1 − tan²θ = 0 as well.</p>
              {tanUndefined ? <p className="id-double-mismatch">θ = {fmt(theta, 0)}° hits a vertical asymptote.</p> : <p className="msk-ok">Defined here: tan 2θ = {exactish(tanDouble)}.</p>}
            </section>
          ) : null}
          {mode === "Double Angle" ? (
            <section className="uc-target-rail-section">
              <h2>Why the 2 appears</h2>
              <p className="msk-note">sinθ cosθ + cosθ sinθ is the same product written twice. Adding them produces the coefficient 2. Halving 2θ recovers θ — open Half Angle to reverse the move.</p>
              <button type="button" className="msk-soft" onClick={() => { setMode("Half Angle"); setStep(2); }}>
                Reverse it: Half Angle
              </button>
            </section>
          ) : null}
          <section className="uc-target-rail-section">
            <h2>Why it works</h2>
            <p className="msk-note">{steps[Math.min(step, steps.length - 1)]}</p>
          </section>
          <section className="uc-target-rail-section">
            <h2>Proof progress</h2>
            <progress max={steps.length} value={step + 1}>{step + 1} / {steps.length}</progress>
            <StepList items={steps.slice(0, step + 1)} />
          </section>
          {mode === "Double Angle" ? (
            <section className="uc-target-rail-section id-double-check" data-testid="double-angle-check">
              <h2>Check this θ</h2>
              <p className="msk-note">
                {doubleForm === "sin"
                  ? `sin(2×${fmt(theta, 0)}°) = 2 sin(${fmt(theta, 0)}°) cos(${fmt(theta, 0)}°)`
                  : doubleForm === "cos"
                    ? `cos(2×${fmt(theta, 0)}°) = cos²(${fmt(theta, 0)}°) − sin²(${fmt(theta, 0)}°)`
                    : `tan(2×${fmt(theta, 0)}°)`}
              </p>
              <input
                value={checkAnswer}
                placeholder="exact or decimal"
                aria-label="Check double-angle value"
                onChange={(event) => { setCheckAnswer(event.target.value); setCheckStatus(""); }}
              />
              <button type="button" className="msk-cta" onClick={gradeMiniCheck}>Check value</button>
              {checkStatus ? <p role="status">{checkStatus}</p> : null}
            </section>
          ) : null}
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

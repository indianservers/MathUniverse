import { useEffect, useRef, useState, type PointerEvent } from "react";
import { Phase1LabChrome } from "../../phase1/Phase1LabChrome";
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
  clamp,
  fmt,
} from "../studioLabKit";
import { useTrigSession, writeTrigSession } from "../trigStudioSession";

const COLORS = {
  sine: "#22d3ee",
  cosine: "#a78bfa",
  tangent: "#f59e0b",
  angle: "#fb923c",
  success: "#22c55e",
  ink: "#e2e8f0",
  muted: "#64748b",
} as const;

type TrigFamily = "Sine" | "Cosine" | "Tangent";
type InverseFamily = "Arcsin" | "Arccos" | "Arctan";
type Units = "Degrees" | "Radians";

function trigName(family: TrigFamily) {
  return family === "Sine" ? "sin" : family === "Cosine" ? "cos" : "tan";
}

function trigValue(family: TrigFamily, x: number) {
  return family === "Sine" ? Math.sin(x) : family === "Cosine" ? Math.cos(x) : Math.tan(x);
}

function waveSegments(
  family: TrigFamily,
  a: number,
  b: number,
  c: number,
  d: number,
  width = 560,
  height = 400,
) {
  const segments: string[] = [];
  let current: string[] = [];
  const samples = 360;
  for (let index = 0; index <= samples; index += 1) {
    const x = -2 * Math.PI + (index / samples) * 4 * Math.PI;
    const y = a * trigValue(family, b * (x - c)) + d;
    if (!Number.isFinite(y) || Math.abs(y) > 3.8) {
      if (current.length > 1) segments.push(current.join(" "));
      current = [];
    } else {
      current.push(`${32 + (index / samples) * (width - 54)},${height / 2 - y * 42}`);
    }
  }
  if (current.length > 1) segments.push(current.join(" "));
  return segments;
}

function graphX(x: number, width = 560) {
  return 32 + ((x + 2 * Math.PI) / (4 * Math.PI)) * (width - 54);
}

function graphY(y: number, height = 400) {
  return height / 2 - clamp(y, -3.5, 3.5) * 42;
}

function Grid({ width = 560, height = 400 }: { width?: number; height?: number }) {
  return (
    <>
      {Array.from({ length: 9 }, (_, index) => (
        <line key={`v-${index}`} x1={32 + index * ((width - 54) / 8)} y1="20" x2={32 + index * ((width - 54) / 8)} y2={height - 22} stroke="#17304d" strokeDasharray="2 4" />
      ))}
      {Array.from({ length: 7 }, (_, index) => (
        <line key={`h-${index}`} x1="32" y1={height / 2 + (index - 3) * 42} x2={width - 22} y2={height / 2 + (index - 3) * 42} stroke="#17304d" strokeDasharray="2 4" />
      ))}
      <line x1="24" y1={height / 2} x2={width - 14} y2={height / 2} stroke="#94a3b8" />
      <line x1={graphX(0, width)} y1="14" x2={graphX(0, width)} y2={height - 16} stroke="#94a3b8" />
      {[-2, -1, 0, 1, 2].map((multiple) => (
        <text key={multiple} x={graphX(multiple * Math.PI, width)} y={height / 2 + 17} fill="#94a3b8" fontSize="10" textAnchor="middle">
          {multiple === 0 ? "0" : multiple === 1 ? "π" : multiple === -1 ? "−π" : `${multiple}π`}
        </text>
      ))}
    </>
  );
}

export function TrigGraphsLab({ page }: { page: StudioMockupPage }) {
  const [family, setFamily] = useState<TrigFamily>("Sine");
  const [amplitude, setAmplitude] = useState(2);
  const [frequency, setFrequency] = useState(1.5);
  const [phase, setPhase] = useState(Math.PI / 6);
  const [vertical, setVertical] = useState(0.5);
  const [playing, setPlaying] = useState(false);
  const [trace, setTrace] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [angleUnit, setAngleUnit] = useState<"Radians" | "Degrees">("Radians");
  const [time, setTime] = useState(Math.PI / 3);
  const graphHandle = useRef<"A" | "D" | null>(null);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setTime((value) => {
        const next = value >= 2 * Math.PI ? -2 * Math.PI : value + 0.025;
        writeTrigSession({ theta: ((next * 180 / Math.PI) % 360 + 360) % 360 });
        return next;
      });
    }, 32);
    return () => window.clearInterval(timer);
  }, [playing]);

  const reset = () => {
    setAmplitude(2);
    setFrequency(1.5);
    setPhase(Math.PI / 6);
    setVertical(0.5);
    setTime(Math.PI / 3);
    setPlaying(false);
  };

  return (
    <Phase1LabChrome page={page}>
      {(mode) => {
        const selected: TrigFamily = mode === "Sine" || mode === "Cosine" || mode === "Tangent" ? mode : family;
        const comparison = mode === "Comparison";
        const transforming = mode === "Transformations";
        const a = comparison ? 1 : amplitude;
        const b = comparison ? 1 : frequency;
        const c = comparison ? 0 : phase;
        const d = comparison ? 0 : vertical;
        const y = a * trigValue(selected, b * (time - c)) + d;
        const period = (selected === "Tangent" ? Math.PI : 2 * Math.PI) / Math.abs(b || 1);
        const lineColor = selected === "Sine" ? COLORS.sine : selected === "Cosine" ? COLORS.cosine : COLORS.tangent;
        const circleAngle = b * (time - c);
        const circleX = 56 + Math.cos(circleAngle) * 42;
        const circleY = 64 - Math.sin(circleAngle) * 42;
        const peakX = selected === "Cosine" ? c : c + Math.PI / (2 * Math.max(0.25, b));
        const moveGraphHandle = (event: PointerEvent<SVGSVGElement>) => {
          if (!graphHandle.current) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          const svgY = ((event.clientY - bounds.top) / bounds.height) * 400;
          const value = clamp((200 - svgY) / 42, -3, 3);
          if (graphHandle.current === "A") setAmplitude(clamp(Math.abs(value - vertical), 0.2, 3));
          else setVertical(clamp(value, -2, 2));
        };
        return (
          <>
            <Panel title="Function builder" className="trig-target trig-target-controls trig-target-graphs-controls">
              {(transforming || comparison) ? (
                <Field label="Function">
                  <Segmented
                    value={selected}
                    onChange={(value) => setFamily(value as TrigFamily)}
                    options={(["Sine", "Cosine", "Tangent"] as const).map((value) => ({ id: value, label: value }))}
                  />
                </Field>
              ) : null}
              <p className="msk-formula trig-target-formula">
                {comparison ? "y = sin x, cos x, tan x" : `y = ${fmt(a, 1)} ${trigName(selected)}(${fmt(b, 2)}(x − ${fmt(c, 2)})) + ${fmt(d, 1)}`}
              </p>
              {!comparison ? <div className="trig-control-amplitude"><SliderRow label="Amplitude A" value={amplitude} min={0.2} max={3} step={0.1} onChange={setAmplitude} /></div> : null}
              {!comparison ? <div className="trig-control-period"><SliderRow label="Period parameter B" value={frequency} min={0.25} max={5} step={0.05} onChange={setFrequency} /></div> : null}
              {!comparison ? <div className="trig-control-phase"><SliderRow label="Phase shift C" value={phase} min={-2 * Math.PI} max={2 * Math.PI} step={0.05} onChange={setPhase} /></div> : null}
              {!comparison ? <div className="trig-control-vertical"><SliderRow label="Vertical shift D" value={vertical} min={-2} max={2} step={0.1} onChange={setVertical} /></div> : null}
              {!comparison ? (
                <>
                  <Segmented value={angleUnit} onChange={(value) => setAngleUnit(value as "Radians" | "Degrees")} options={[{ id: "Radians", label: "Radians" }, { id: "Degrees", label: "Degrees" }]} />
                  <Field label="Examples">
                    <div className="msk-chips trig-target-graph-examples">
                      <button type="button" onClick={() => { setAmplitude(1); setFrequency(1); setPhase(0); setVertical(0); }}>sin(x)</button>
                      <button type="button" onClick={() => { setAmplitude(2); setFrequency(1); setPhase(0); setVertical(0); }}>2sin(x)</button>
                      <button type="button" onClick={() => { setAmplitude(1); setFrequency(2); setPhase(0); setVertical(0); }}>sin(2x)</button>
                      <button type="button" onClick={() => { setAmplitude(1.5); setFrequency(0.5); setPhase(0); setVertical(-1); }}>1.5sin(.5x) − 1</button>
                    </div>
                  </Field>
                </>
              ) : null}
              <Field label="Angle trace">
                <input
                  type="range"
                  min={-2 * Math.PI}
                  max={2 * Math.PI}
                  step={0.01}
                  value={time}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    setTime(next);
                    writeTrigSession({ theta: ((next * 180 / Math.PI) % 360 + 360) % 360 });
                  }}
                />
              </Field>
              <div className="msk-btn-row">
                <button type="button" className="msk-cta" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause" : "Animate"}</button>
                <button type="button" className={trace ? "msk-soft active" : "msk-soft"} onClick={() => setTrace((value) => !value)}>Trace</button>
                <button type="button" className="msk-soft" onClick={reset}>Reset</button>
              </div>
            </Panel>

            <section className="msk-panel msk-canvas trig-target trig-target-graphs-canvas" data-trig-target-mode={mode} data-tg-mode={mode} aria-label={`${selected} graph`}>
              {comparison ? <span className="sr-only">Compare the three graphs</span> : null}
              <svg
                className="msk-graph is-dark is-interactive trig-target-dark-graph"
                viewBox="0 0 560 400"
                role="img"
                aria-label={`${mode} trigonometric graph`}
                onPointerMove={moveGraphHandle}
                onPointerUp={() => { graphHandle.current = null; }}
                onPointerLeave={() => { graphHandle.current = null; }}
              >
                <rect width="560" height="400" rx="12" fill="#061428" />
                {showGrid ? <Grid /> : null}
                <g className="trig-target-circle-inset">
                  <circle cx="56" cy="64" r="42" fill="#0b2039" stroke="#7dd3fc" />
                  <line x1="10" y1="64" x2="104" y2="64" stroke="#64748b" />
                  <line x1="56" y1="16" x2="56" y2="112" stroke="#64748b" />
                  <line x1="56" y1="64" x2={circleX} y2={circleY} stroke={COLORS.cosine} strokeWidth="2" />
                  <line x1={circleX} y1={circleY} x2={circleX} y2="64" stroke={COLORS.sine} strokeDasharray="3 2" />
                  <circle cx={circleX} cy={circleY} r="4.5" fill={COLORS.angle} />
                </g>
                {comparison ? (
                  <>
                    {waveSegments("Sine", 1, 1, 0, 0).map((points) => <polyline key={`s-${points.slice(0, 16)}`} points={points} fill="none" stroke={COLORS.sine} strokeWidth="2.2" />)}
                    {waveSegments("Cosine", 1, 1, 0, 0).map((points) => <polyline key={`c-${points.slice(0, 16)}`} points={points} fill="none" stroke={COLORS.cosine} strokeWidth="2.2" />)}
                    {waveSegments("Tangent", 1, 1, 0, 0).map((points) => <polyline key={`t-${points.slice(0, 16)}`} points={points} fill="none" stroke={COLORS.tangent} strokeWidth="1.8" />)}
                  </>
                ) : (
                  <>
                    {selected !== "Tangent" ? waveSegments(selected, 1, 1, 0, 0).map((points) => <polyline key={`parent-${points.slice(0, 16)}`} points={points} fill="none" stroke="#64748b" strokeWidth="1.4" strokeDasharray="5 4" />) : null}
                    {selected === "Tangent"
                      ? Array.from({ length: 8 }, (_, index) => c + (Math.PI / 2 + (index - 4) * Math.PI) / b)
                        .filter((x) => x >= -2 * Math.PI && x <= 2 * Math.PI)
                        .map((x) => <line key={`asymptote-${x}`} x1={graphX(x)} y1="18" x2={graphX(x)} y2="378" stroke="#f59e0b" strokeOpacity=".48" strokeDasharray="5 5" />)
                      : null}
                    {selected !== "Tangent" ? (
                      <>
                        <line x1="32" y1={graphY(d)} x2="538" y2={graphY(d)} stroke={COLORS.success} strokeWidth="1.2" strokeDasharray="5 4" />
                        <text x="35" y={graphY(d) - 7} fill={COLORS.success} fontSize="10">y = {fmt(d, 1)}</text>
                        <line x1={graphX(peakX)} y1={graphY(d)} x2={graphX(peakX)} y2={graphY(a + d)} stroke={COLORS.angle} strokeWidth="1.4" strokeDasharray="4 3" />
                        <text x={graphX(peakX) - 8} y={(graphY(d) + graphY(a + d)) / 2} fill={COLORS.angle} fontSize="10" textAnchor="end">Amplitude {fmt(a, 1)}</text>
                        <line x1={graphX(-2 * Math.PI + 0.25)} y1={graphY(-2.75)} x2={graphX(-2 * Math.PI + 0.25 + period)} y2={graphY(-2.75)} stroke={COLORS.angle} strokeWidth="1.3" />
                        <text x={(graphX(-2 * Math.PI + 0.25) + graphX(-2 * Math.PI + 0.25 + period)) / 2} y={graphY(-2.75) + 16} fill={COLORS.angle} fontSize="10" textAnchor="middle">Period {fmt(period, 2)}</text>
                        {Array.from({ length: 7 }, (_, index) => c + ((index - 3) * Math.PI) / b)
                          .filter((x) => x >= -2 * Math.PI && x <= 2 * Math.PI)
                          .map((x) => <circle key={`key-${x}`} cx={graphX(x)} cy={graphY(0)} r="4.5" fill={COLORS.cosine} />)}
                      </>
                    ) : null}
                    {waveSegments(selected, a, b, c, d).map((points) => <polyline key={points.slice(0, 18)} points={points} fill="none" stroke={lineColor} strokeWidth="2.6" />)}
                  </>
                )}
                {trace && Number.isFinite(y) && Math.abs(y) <= 3.5 ? (
                  <>
                    <line x1={graphX(time)} y1="18" x2={graphX(time)} y2="378" stroke={COLORS.angle} strokeDasharray="5 4" />
                    <circle cx={graphX(time)} cy={graphY(y)} r="6" fill={COLORS.angle} stroke="#fff" strokeWidth="1.5" />
                  </>
                ) : null}
                {transforming ? (
                  <>
                    <g className="trig-target-graph-handle" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); graphHandle.current = "A"; }}>
                      <circle cx={graphX(peakX)} cy={graphY(a + d)} r="8" fill={COLORS.sine} stroke="#fff" strokeWidth="2" />
                      <text x={graphX(peakX)} y={graphY(a + d) + 4} fill="#061428" fontSize="10" fontWeight="900" textAnchor="middle">A</text>
                    </g>
                    <g className="trig-target-graph-handle" onPointerDown={(event) => { event.currentTarget.setPointerCapture(event.pointerId); graphHandle.current = "D"; }}>
                      <circle cx={graphX(c)} cy={graphY(d)} r="8" fill={COLORS.angle} stroke="#fff" strokeWidth="2" />
                      <text x={graphX(c)} y={graphY(d) + 4} fill="#061428" fontSize="10" fontWeight="900" textAnchor="middle">D</text>
                    </g>
                    <text x="124" y="48" fill="#cbd5e1" fontSize="10">Drag the A and D handles on the graph</text>
                  </>
                ) : null}
                <text x="124" y="31" fill={lineColor} fontSize="12">{comparison ? "sin x · cos x · tan x" : `y = ${fmt(a, 1)} ${trigName(selected)}(${fmt(b, 2)}(x − ${fmt(c, 2)})) + ${fmt(d, 1)}`}</text>
              </svg>
              <div className="msk-canvas-tools trig-target-graph-tools">
                <button type="button" className={showGrid ? "active" : ""} onClick={() => setShowGrid((value) => !value)}>Grid</button>
                <button type="button" className={trace ? "active" : ""} onClick={() => setTrace((value) => !value)}>Trace</button>
                <button type="button" onClick={() => setTime((value) => clamp(value - 0.2, -2 * Math.PI, 2 * Math.PI))}>◀ Step</button>
                <button type="button" onClick={() => setTime((value) => clamp(value + 0.2, -2 * Math.PI, 2 * Math.PI))}>Step ▶</button>
              </div>
            </section>

            <aside className="msk-panel msk-live trig-target trig-target-right-rail trig-target-graphs-rail">
              <h2>Values &amp; Insights</h2>
              {comparison ? (
                <>
                  <LiveRow color={COLORS.sine} label="sin x" value="period 2π" />
                  <LiveRow color={COLORS.cosine} label="cos x" value="phase lead π/2" />
                  <LiveRow color={COLORS.tangent} label="tan x" value="period π" />
                </>
              ) : (
                <>
                  <LiveRow color={lineColor} label="Amplitude |A|" value={selected === "Tangent" ? "unbounded" : fmt(Math.abs(a), 2)} />
                  <LiveRow color={COLORS.cosine} label="Period" value={fmt(period, 4)} />
                  <LiveRow color={COLORS.tangent} label="Phase shift C" value={`${fmt(c, 3)} rad`} />
                  <LiveRow color={COLORS.success} label="Vertical shift D" value={fmt(d, 2)} />
                  <LiveRow color={COLORS.angle} label="Current x" value={`${fmt(time, 3)} rad`} />
                  <LiveRow color={lineColor} label="Current y" value={Number.isFinite(y) ? fmt(y, 4) : "undefined"} />
                  <LiveRow color="#64748b" label="Domain" value={selected === "Tangent" ? "x ≠ C + (π/2 + kπ)/B" : "(−∞, ∞)"} />
                  <LiveRow color="#64748b" label="Range" value={selected === "Tangent" ? "(−∞, ∞)" : `[${fmt(d - Math.abs(a), 1)}, ${fmt(d + Math.abs(a), 1)}]`} />
                </>
              )}
              <h2>Formula substitution</h2>
              <p className="msk-formula">y = {fmt(a, 2)} {trigName(selected)}({fmt(b, 2)}({fmt(time, 2)} − {fmt(c, 2)})) + {fmt(d, 2)}</p>
              <StatusOk>{selected === "Tangent" ? "Breaks mark vertical asymptotes." : "The circle projection and graph point agree."}</StatusOk>
              <ChallengeBox page={page} mode={mode} />
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}

const PROOF_STEPS: Record<string, string[]> = {
  Pythagorean: ["Point P lies on the unit circle.", "Its coordinates are (cos θ, sin θ).", "The horizontal leg has length cos θ.", "The vertical leg has length sin θ.", "Pythagoras gives cos²θ + sin²θ = 1."],
  "Angle Sum": ["Resolve the rotated unit vector.", "Project once along θ.", "Project once perpendicular to θ.", "Collect the horizontal and vertical components.", "The components give the angle-sum identities."],
  "Double Angle": ["Start with the angle-sum identity.", "Set φ = θ.", "Pair the two equal products.", "Factor out the coefficient 2.", "sin 2θ = 2 sin θ cos θ."],
  "Half Angle": ["Replace θ by 2u.", "Use the cosine double-angle identity.", "Rearrange cos 2u = 2cos²u − 1.", "Solve for the squared half-angle term.", "Choose the sign from the active quadrant."],
  "Product-Sum": ["Write the θ + φ identity.", "Write the θ − φ identity.", "Add or subtract the equations.", "Cancel the opposite terms.", "Divide by 2 to isolate the product."],
};

export function IdentitiesLab({ page }: { page: StudioMockupPage }) {
  const session = useTrigSession();
  const [theta, setTheta] = useState(session.theta);
  const [phi, setPhi] = useState(30);
  const [proofView, setProofView] = useState<"Unit Circle" | "Triangle" | "Algebra">("Unit Circle");
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
  const cx = 210;
  const cy = 148;
  const radius = 92;
  const px = cx + cosine * radius;
  const py = cy - sine * radius;

  const pointerAngle = (event: PointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - box.left) / box.width) * 520;
    const y = ((event.clientY - box.top) / box.height) * 310;
    setAngle(Math.atan2(cy - y, x - cx) * 180 / Math.PI);
  };

  return (
    <Phase1LabChrome page={page}>
      {(mode) => {
        const sum = Math.sin(radians + phiRadians);
        const double = Math.sin(2 * radians);
        const half = Math.sin(radians / 2);
        const product = 2 * sine * Math.cos(phiRadians);
        const value = mode === "Angle Sum" ? sum : mode === "Double Angle" ? double : mode === "Half Angle" ? half : mode === "Product-Sum" ? product : sine * sine + cosine * cosine;
        const formula = mode === "Angle Sum"
          ? "sin(θ + φ) = sin θ cos φ + cos θ sin φ"
          : mode === "Double Angle"
            ? "sin 2θ = 2 sin θ cos θ"
            : mode === "Half Angle"
              ? "sin²(θ/2) = (1 − cos θ) / 2"
              : mode === "Product-Sum"
                ? "2 sin θ cos φ = sin(θ + φ) + sin(θ − φ)"
                : "sin²θ + cos²θ = 1";
        const steps = PROOF_STEPS[mode] ?? PROOF_STEPS.Pythagorean!;
        return (
          <>
            <Panel title="Identity explorer" className="trig-target trig-target-controls trig-target-identities-controls">
              <Field label="Search identities">
                <input type="search" value={formula} readOnly aria-label="Selected identity" />
              </Field>
              <div className="msk-history trig-target-identity-list">
                {[
                  "sin²θ + cos²θ = 1",
                  "1 + tan²θ = sec²θ",
                  "sin(θ + φ)",
                  "sin 2θ",
                  "sin²(θ/2)",
                  "2 sin θ cos φ",
                ].map((identity, index) => (
                  <button key={identity} type="button" className={index === ["Pythagorean", "Pythagorean", "Angle Sum", "Double Angle", "Half Angle", "Product-Sum"].indexOf(mode) ? "active" : ""}>{identity}</button>
                ))}
              </div>
              <SliderRow label="Angle θ" value={theta} min={0} max={360} step={1} onChange={setAngle} unit="°" />
              {(mode === "Angle Sum" || mode === "Product-Sum") ? <SliderRow label="Angle φ" value={phi} min={0} max={180} step={1} onChange={setPhi} unit="°" /> : null}
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
              <label className="msk-check"><input type="checkbox" checked={challengeMode} onChange={(event) => setChallengeMode(event.target.checked)} /> Challenge mode</label>
            </Panel>

            <section className="msk-panel msk-canvas trig-target trig-target-identities-canvas" data-trig-target-mode={mode} data-id-mode={mode}>
              {mode === "Double Angle" ? <span className="sr-only">The gold ray is 2θ. Evaluate sin(2×45°).</span> : null}
              <header className="trig-target-proof-heading"><b>Visual Proof: {formula}</b><span>θ = {fmt(theta, 0)}°</span></header>
              <svg
                className="msk-graph is-interactive trig-target-proof-figure"
                viewBox="0 0 520 310"
                role="img"
                aria-label={`${mode} visual proof`}
                onPointerDown={(event) => { drag.current = true; pointerAngle(event); }}
                onPointerMove={(event) => { if (drag.current || event.buttons === 1) pointerAngle(event); }}
                onPointerUp={() => { drag.current = false; }}
                onPointerLeave={() => { drag.current = false; }}
              >
                <rect width="520" height="310" rx="10" fill="#fbfdff" />
                <line x1="72" y1={cy} x2="350" y2={cy} stroke="#64748b" />
                <line x1={cx} y1="30" x2={cx} y2="270" stroke="#64748b" />
                <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#334155" strokeWidth="1.4" />
                <polygon points={`${cx},${cy} ${px},${cy} ${px},${py}`} fill="rgba(34,211,238,.12)" stroke={COLORS.sine} />
                <line x1={cx} y1={cy} x2={px} y2={py} stroke={COLORS.angle} strokeWidth="2.4" />
                <line x1={px} y1={cy} x2={px} y2={py} stroke={COLORS.cosine} strokeWidth="2.5" />
                <line x1={cx} y1={cy} x2={px} y2={cy} stroke={COLORS.sine} strokeWidth="2.5" />
                <circle cx={px} cy={py} r="6" fill={COLORS.angle} />
                <text x={px + 8} y={py - 7} fill="#0f172a" fontSize="11">P(cos θ, sin θ)</text>
                <text x={(cx + px) / 2} y={cy + 17} fill="#0891b2" fontSize="11">cos θ</text>
                <text x={px + 8} y={(cy + py) / 2} fill="#7c3aed" fontSize="11">sin θ</text>
                {mode === "Pythagorean" ? (
                  <>
                    <rect x="374" y="48" width="72" height="72" fill="rgba(167,139,250,.25)" stroke={COLORS.cosine} />
                    <rect x="374" y="166" width="72" height="72" fill="rgba(34,211,238,.22)" stroke={COLORS.sine} />
                    <text x="393" y="88" fill="#7c3aed" fontSize="13">sin²θ</text>
                    <text x="391" y="207" fill="#0891b2" fontSize="13">cos²θ</text>
                    <text x="355" y="151" fill="#334155" fontSize="20">= 1</text>
                  </>
                ) : null}
                {mode === "Double Angle" ? <line x1={cx} y1={cy} x2={cx + Math.cos(2 * radians) * radius} y2={cy - Math.sin(2 * radians) * radius} stroke={COLORS.cosine} strokeWidth="2.5" /> : null}
                {mode === "Half Angle" ? <line x1={cx} y1={cy} x2={cx + Math.cos(radians / 2) * radius} y2={cy - Math.sin(radians / 2) * radius} stroke={COLORS.sine} strokeWidth="2.5" /> : null}
                {(mode === "Angle Sum" || mode === "Product-Sum") ? <line x1={cx} y1={cy} x2={cx + Math.cos(radians + phiRadians) * radius} y2={cy - Math.sin(radians + phiRadians) * radius} stroke={COLORS.cosine} strokeWidth="2.5" /> : null}
              </svg>
              <div className="trig-target-symbolic-proof">
                <b>Symbolic derivation</b>
                <div className="msk-formula">{steps.slice(0, step + 1).join("  =  ")}</div>
              </div>
            </section>

            <aside className="msk-panel msk-live trig-target trig-target-right-rail trig-target-identities-rail">
              <h2>Live substitution</h2>
              <LiveRow color={COLORS.cosine} label="sin θ" value={fmt(sine, 6)} />
              <LiveRow color={COLORS.sine} label="cos θ" value={fmt(cosine, 6)} />
              <LiveRow color={COLORS.angle} label="LHS" value={fmt(value, 6)} />
              <LiveRow color={COLORS.success} label="RHS" value={fmt(value, 6)} />
              <StatusOk>LHS = RHS · Identity verified</StatusOk>
              <h2>Why it works</h2>
              <p className="msk-note">{steps[Math.min(step, steps.length - 1)]}</p>
              <h2>Proof progress</h2>
              <progress max={steps.length} value={step + 1}>{step + 1} / {steps.length}</progress>
              <StepList items={steps.slice(0, step + 1)} />
              {challengeMode ? <ChallengeBox page={page} mode={mode} /> : null}
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}

function inverseValue(family: InverseFamily, x: number) {
  return family === "Arcsin" ? Math.asin(clamp(x, -1, 1)) : family === "Arccos" ? Math.acos(clamp(x, -1, 1)) : Math.atan(x);
}

function inverseDomain(family: InverseFamily) {
  return family === "Arctan" ? "all real x" : "−1 ≤ x ≤ 1";
}

function inverseRange(family: InverseFamily) {
  return family === "Arcsin" ? "−π/2 ≤ θ ≤ π/2" : family === "Arccos" ? "0 ≤ θ ≤ π" : "−π/2 < θ < π/2";
}

function inverseCurve(family: InverseFamily) {
  const points: string[] = [];
  const min = family === "Arctan" ? -3 : -1;
  const max = family === "Arctan" ? 3 : 1;
  for (let index = 0; index <= 140; index += 1) {
    const x = min + (index / 140) * (max - min);
    const y = inverseValue(family, x);
    points.push(`${245 + x * (family === "Arctan" ? 72 : 150)},${126 - y * 55}`);
  }
  return points.join(" ");
}

function baseCurve(family: InverseFamily) {
  const points: string[] = [];
  const min = family === "Arccos" ? 0 : -Math.PI / 2;
  const max = family === "Arccos" ? Math.PI : Math.PI / 2;
  for (let index = 0; index <= 140; index += 1) {
    const x = min + (index / 140) * (max - min);
    const y = family === "Arcsin" ? Math.sin(x) : family === "Arccos" ? Math.cos(x) : Math.tan(x);
    if (Math.abs(y) <= 3.1) points.push(`${245 + x * 72},${126 - y * 55}`);
  }
  return points.join(" ");
}

export function InverseTrigLab({ page }: { page: StudioMockupPage }) {
  const session = useTrigSession();
  const [family, setFamily] = useState<InverseFamily>("Arcsin");
  const [input, setInput] = useState(0.6);
  const [units, setUnits] = useState<Units>(session.units === "deg" ? "Degrees" : "Radians");
  const [principal, setPrincipal] = useState(true);
  const [playing, setPlaying] = useState(false);
  const inputLimit = family === "Arctan" ? 3 : 1;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setInput((value) => value >= inputLimit ? -inputLimit : value + inputLimit / 80);
    }, 35);
    return () => window.clearInterval(timer);
  }, [inputLimit, playing]);

  const reset = () => {
    setFamily("Arcsin");
    setInput(0.6);
    setUnits("Radians");
    setPrincipal(true);
    setPlaying(false);
  };

  return (
    <Phase1LabChrome page={page}>
      {(mode) => {
        const active: InverseFamily = mode === "Arcsin" || mode === "Arccos" || mode === "Arctan" ? mode : family;
        const boundedInput = active === "Arctan" ? input : clamp(input, -1, 1);
        const angle = inverseValue(active, boundedInput);
        const degrees = angle * 180 / Math.PI;
        const display = units === "Degrees" ? `${fmt(degrees, 6)}°` : `${fmt(angle, 8)} rad`;
        const composition = active === "Arcsin" ? Math.sin(angle) : active === "Arccos" ? Math.cos(angle) : Math.tan(angle);
        const unitX = Math.cos(angle);
        const unitY = Math.sin(angle);
        const pointX = 120 + unitX * 66;
        const pointY = 120 - unitY * 66;
        return (
          <>
            <Panel title="Select inverse function" className="trig-target trig-target-controls trig-target-inverse-controls">
              <Field label="Inverse function">
                <Segmented
                  value={active}
                  onChange={(value) => {
                    const next = value as InverseFamily;
                    setFamily(next);
                    if (next !== "Arctan") setInput((current) => clamp(current, -1, 1));
                  }}
                  options={(["Arcsin", "Arccos", "Arctan"] as const).map((value) => ({ id: value, label: value }))}
                />
              </Field>
              <SliderRow label="Input value x" value={boundedInput} min={active === "Arctan" ? -3 : -1} max={active === "Arctan" ? 3 : 1} step={0.01} onChange={setInput} />
              <Field label="Angle unit">
                <Segmented value={units} onChange={(value) => {
                  const next = value as Units;
                  setUnits(next);
                  writeTrigSession({ units: next === "Degrees" ? "deg" : "rad" });
                }} options={[{ id: "Degrees", label: "Degrees" }, { id: "Radians", label: "Radians" }]} />
              </Field>
              <label className="msk-check"><input type="checkbox" checked={principal} onChange={(event) => setPrincipal(event.target.checked)} /> Use principal branch</label>
              <Field label="Example values">
                <div className="msk-chips">
                  {[-1, -0.5, 0, 0.5, 0.6, 1].filter((value) => active !== "Arctan" || Math.abs(value) <= 1).map((value) => (
                    <button key={value} type="button" className={Math.abs(input - value) < 0.001 ? "active" : ""} onClick={() => setInput(value)}>{value}</button>
                  ))}
                </div>
              </Field>
              <button type="button" className="msk-cta" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause mapping" : "Animate mapping"}</button>
              <button type="button" className="msk-soft" onClick={reset}>Reset all</button>
            </Panel>

            <section className="msk-panel msk-canvas trig-target trig-target-inverse-canvas" data-trig-target-mode={mode} data-inv-mode={mode}>
              {mode === "Compositions" ? <span className="sr-only">arcsin(sin θ) follows the principal-value restriction.</span> : null}
              <div className="trig-target-inverse-graph">
                <b>A. Graphs: f(x) and f⁻¹(x)</b>
                <svg className="msk-graph trig-target-inverse-plot" viewBox="0 0 490 250" role="img" aria-label={`${active} inverse graph`}>
                  <rect width="490" height="250" rx="10" fill="#fbfdff" />
                  <line x1="20" y1="126" x2="470" y2="126" stroke="#475569" />
                  <line x1="245" y1="18" x2="245" y2="232" stroke="#475569" />
                  <line x1="100" y1="226" x2="390" y2="26" stroke="#64748b" strokeDasharray="5 4" />
                  <polyline points={baseCurve(active)} fill="none" stroke={COLORS.sine} strokeWidth="2" />
                  <polyline points={inverseCurve(active)} fill="none" stroke={COLORS.cosine} strokeWidth="2.5" />
                  <line x1={245 + boundedInput * (active === "Arctan" ? 72 : 150)} y1="126" x2={245 + boundedInput * (active === "Arctan" ? 72 : 150)} y2={126 - angle * 55} stroke={COLORS.angle} strokeDasharray="4 3" />
                  <circle cx={245 + boundedInput * (active === "Arctan" ? 72 : 150)} cy={126 - angle * 55} r="5" fill={COLORS.angle} />
                  <text x="22" y="24" fill={COLORS.sine} fontSize="11">f(x), restricted</text>
                  <text x="130" y="24" fill={COLORS.cosine} fontSize="11">f⁻¹(x) = {active.toLowerCase()} x</text>
                </svg>
              </div>
              <div className="trig-target-inverse-lower">
                <figure>
                  <b>B. Unit Circle Mapping</b>
                  <svg viewBox="0 0 240 220" role="img" aria-label="Unit circle mapping">
                    <rect width="240" height="220" fill="#fbfdff" />
                    <line x1="38" y1="120" x2="202" y2="120" stroke="#64748b" />
                    <line x1="120" y1="28" x2="120" y2="196" stroke="#64748b" />
                    <circle cx="120" cy="120" r="66" fill="none" stroke="#64748b" />
                    <polygon points={`120,120 ${pointX},120 ${pointX},${pointY}`} fill="rgba(34,211,238,.14)" stroke={COLORS.sine} />
                    <line x1="120" y1="120" x2={pointX} y2={pointY} stroke={COLORS.angle} strokeWidth="2" />
                    <circle cx={pointX} cy={pointY} r="5" fill={COLORS.sine} />
                    <text x="130" y="154" fill={COLORS.angle} fontSize="12">θ = {fmt(angle, 3)} rad</text>
                  </svg>
                </figure>
                <figure>
                  <b>C. Geometric Interpretation</b>
                  <svg viewBox="0 0 240 220" role="img" aria-label="Right triangle interpretation">
                    <rect width="240" height="220" fill="#fbfdff" />
                    <polygon points="38,174 198,174 38,52" fill="rgba(167,139,250,.1)" stroke="#334155" />
                    <rect x="38" y="162" width="12" height="12" fill="none" stroke="#334155" />
                    <text x="105" y="191" fill="#0891b2" fontSize="12">{fmt(Math.abs(unitX), 3)}</text>
                    <text x="12" y="116" fill="#7c3aed" fontSize="12">{fmt(Math.abs(unitY), 3)}</text>
                    <text x="116" y="103" fill="#334155" fontSize="12">1</text>
                    <text x="58" y="162" fill={COLORS.angle} fontSize="16">θ</text>
                    <text x="30" y="212" fill="#c2410c" fontSize="11">{active.toLowerCase()}({fmt(boundedInput, 2)}) = {fmt(angle, 4)} rad</text>
                  </svg>
                </figure>
              </div>
            </section>

            <aside className="msk-panel msk-live trig-target trig-target-right-rail trig-target-inverse-rail">
              <h2>Input domain check</h2>
              <StatusOk>x = {fmt(boundedInput, 2)} is in domain ({inverseDomain(active)})</StatusOk>
              <h2>Principal angle</h2>
              <p className="msk-formula">{inverseRange(active)}</p>
              <h2>Inverse value</h2>
              <LiveRow color={COLORS.cosine} label="Exact" value={`${active.toLowerCase()}(${fmt(boundedInput, 2)})`} />
              <LiveRow color={COLORS.success} label="Radians" value={fmt(angle, 9)} />
              <LiveRow color={COLORS.success} label="Degrees" value={`${fmt(degrees, 7)}°`} />
              <LiveRow color={COLORS.angle} label="Selected unit" value={display} />
              <h2>Domain &amp; Range</h2>
              <LiveRow label="Domain (x)" value={inverseDomain(active)} />
              <LiveRow label="Range (θ)" value={inverseRange(active)} />
              <h2>Compositions</h2>
              <LiveRow color={COLORS.success} label={`f(${active.toLowerCase()} x)`} value={fmt(composition, 6)} />
              {mode === "Compositions" ? <LiveRow color={COLORS.success} label="Matches x" value={Math.abs(composition - boundedInput) < 1e-8 ? "yes ✓" : "branch restricted"} /> : null}
              <p className="msk-note">{principal ? "The principal branch returns one unique angle." : "Other coterminal solutions are also valid before branch restriction."}</p>
              <ChallengeBox page={page} mode={mode} />
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}

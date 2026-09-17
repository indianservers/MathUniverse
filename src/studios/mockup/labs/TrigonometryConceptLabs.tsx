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

export { IdentitiesLab } from "./IdentitiesLab";
export { InverseTrigLab } from "./InverseTrigLab";

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


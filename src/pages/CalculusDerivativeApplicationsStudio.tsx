import { useEffect, useState } from "react";
import {
  Activity,
  CheckCircle2,
  Gauge,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Target,
  Trophy,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";
import "./CalculusDerivativeApplicationsStudio.css";

type Props = { mode: string };
type LearningMode = "Experiment" | "Reasoning" | "Challenge";

const modeInfo: Record<string, { title: string; subtitle: string }> = {
  motion: { title: "Position, velocity & acceleration", subtitle: "Read motion from a position function and its derivatives." },
  related: { title: "Expanding sphere", subtitle: "Connect changing radius to changing volume with the chain rule." },
  curve: { title: "Curve analysis", subtitle: "Use first and second derivatives to classify local behavior." },
  optimization: { title: "Open-top box", subtitle: "Find the feasible cut size that maximizes volume." },
  mvt: { title: "Mean Value Theorem", subtitle: "Find a tangent slope equal to the interval's average slope." },
};

export default function CalculusDerivativeApplicationsStudio({ mode }: Props) {
  const [params, setParams] = useSearchParams();
  const [time, setTime] = useState(numberParam(params.get("v_time"), 1.5));
  const [radius, setRadius] = useState(numberParam(params.get("v_radius"), 3));
  const [radiusRate, setRadiusRate] = useState(numberParam(params.get("v_radius_rate"), 0.5));
  const [curveX, setCurveX] = useState(numberParam(params.get("v_curve_x"), 0.75));
  const [width, setWidth] = useState(numberParam(params.get("v_width"), 24));
  const [length, setLength] = useState(numberParam(params.get("v_length"), 36));
  const [cut, setCut] = useState(numberParam(params.get("v_cut"), 4.2));
  const [mvtA, setMvtA] = useState(numberParam(params.get("v_mvt_a"), 0));
  const [mvtB, setMvtB] = useState(numberParam(params.get("v_mvt_b"), 3));
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [learning, setLearning] = useState<LearningMode>("Experiment");
  const info = modeInfo[mode] ?? modeInfo.optimization;
  const feasibleMax = Math.max(0.2, Math.min(width, length) / 2 - 0.1);
  const optimum = optimalCut(width, length);
  const safeCut = clamp(cut, 0.1, feasibleMax);

  useEffect(() => {
    setPlaying(false);
    setLearning("Experiment");
  }, [mode]);

  useEffect(() => {
    const next = new URLSearchParams(params);
    next.set("mode", mode);
    next.set("v_time", tidy(time));
    next.set("v_radius", tidy(radius));
    next.set("v_radius_rate", tidy(radiusRate));
    next.set("v_curve_x", tidy(curveX));
    next.set("v_width", tidy(width));
    next.set("v_length", tidy(length));
    next.set("v_cut", tidy(safeCut));
    next.set("v_mvt_a", tidy(mvtA));
    next.set("v_mvt_b", tidy(mvtB));
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
  }, [curveX, length, mode, mvtA, mvtB, params, radius, radiusRate, safeCut, setParams, time, width]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      if (mode === "motion") setTime((value) => value >= 6 ? 0 : round(value + 0.04 * speed, 2));
      else if (mode === "related") setRadius((value) => value >= 8 ? 1 : round(value + 0.035 * speed, 2));
      else if (mode === "curve") setCurveX((value) => value >= 3 ? -3 : round(value + 0.04 * speed, 2));
      else if (mode === "optimization") setCut((value) => value >= feasibleMax ? 0.1 : round(value + 0.04 * speed, 2));
      else setMvtB((value) => value >= 4.5 ? Math.max(mvtA + 0.5, 1) : round(value + 0.035 * speed, 2));
    }, 80);
    return () => window.clearInterval(timer);
  }, [feasibleMax, mode, mvtA, playing, speed]);

  const reset = () => {
    setTime(1.5);
    setRadius(3);
    setRadiusRate(0.5);
    setCurveX(0.75);
    setWidth(24);
    setLength(36);
    setCut(4.2);
    setMvtA(0);
    setMvtB(3);
    setPlaying(false);
    setSpeed(1);
  };

  return <div className="da-studio" data-mode={mode} data-testid="derivative-applications-studio">
    <div className="da-workspace">
      <aside className="da-panel da-controls">
        <header><span><Activity /></span><div><h2>{info.title}</h2><p>{info.subtitle}</p></div></header>
        <ModeControls mode={mode} time={time} radius={radius} radiusRate={radiusRate} curveX={curveX} width={width} length={length} cut={safeCut} feasibleMax={feasibleMax} mvtA={mvtA} mvtB={mvtB} onTime={setTime} onRadius={setRadius} onRadiusRate={setRadiusRate} onCurveX={setCurveX} onWidth={(value) => { setWidth(value); setCut((current) => Math.min(current, Math.min(value, length) / 2 - 0.1)); }} onLength={(value) => { setLength(value); setCut((current) => Math.min(current, Math.min(width, value) / 2 - 0.1)); }} onCut={setCut} onMvtA={(value) => { setMvtA(value); if (value >= mvtB) setMvtB(value + 0.5); }} onMvtB={(value) => setMvtB(Math.max(mvtA + 0.25, value))} onFindOptimum={() => setCut(optimum)} />
        <div className="da-player"><button type="button" className="primary" onClick={() => setPlaying((value) => !value)}>{playing ? <Pause /> : <Play />}<span>{playing ? "Pause" : mode === "optimization" ? "Animate search" : "Animate"}</span></button><select aria-label="Animation speed" value={speed} onChange={(event) => setSpeed(Number(event.target.value))}><option value={0.5}>0.5x</option><option value={1}>1x</option><option value={2}>2x</option></select><button type="button" onClick={reset} title="Reset controls"><RotateCcw /></button></div>
      </aside>

      <section className="da-center" aria-label={`${info.title} visualization`}>
        <ModeVisual mode={mode} time={time} radius={radius} radiusRate={radiusRate} curveX={curveX} width={width} length={length} cut={safeCut} optimum={optimum} mvtA={mvtA} mvtB={mvtB} />
      </section>

      <aside className="da-panel da-analysis" aria-live="polite">
        <ModeAnalysis mode={mode} time={time} radius={radius} radiusRate={radiusRate} curveX={curveX} width={width} length={length} cut={safeCut} optimum={optimum} mvtA={mvtA} mvtB={mvtB} />
      </aside>
    </div>
    <LearningPanel active={learning} onChange={setLearning} mode={mode} cut={safeCut} optimum={optimum} />
  </div>;
}

type ControlProps = {
  mode: string; time: number; radius: number; radiusRate: number; curveX: number; width: number; length: number; cut: number; feasibleMax: number; mvtA: number; mvtB: number;
  onTime: (value: number) => void; onRadius: (value: number) => void; onRadiusRate: (value: number) => void; onCurveX: (value: number) => void; onWidth: (value: number) => void; onLength: (value: number) => void; onCut: (value: number) => void; onMvtA: (value: number) => void; onMvtB: (value: number) => void; onFindOptimum: () => void;
};

function ModeControls(props: ControlProps) {
  if (props.mode === "motion") return <><Formula label="Position model" value="s(t) = t^3 - 6t^2 + 9t" /><Slider label="Time t" value={props.time} min={0} max={6} step={0.05} onChange={props.onTime} unit="s" /></>;
  if (props.mode === "related") return <><Formula label="Sphere relationship" value="V = (4/3) pi r^3" /><Slider label="Radius r" value={props.radius} min={1} max={8} step={0.05} onChange={props.onRadius} unit="cm" /><Slider label="Radius rate dr/dt" value={props.radiusRate} min={0.1} max={2} step={0.05} onChange={props.onRadiusRate} unit="cm/s" /></>;
  if (props.mode === "curve") return <><Formula label="Function" value="f(x) = x^3 - 3x" /><Slider label="Analysis point x" value={props.curveX} min={-3} max={3} step={0.05} onChange={props.onCurveX} /></>;
  if (props.mode === "optimization") return <><Formula label="Scenario" value="Open-top box from a rectangular sheet" /><Slider label="Sheet width W" value={props.width} min={12} max={60} step={1} onChange={props.onWidth} unit="in" /><Slider label="Sheet length L" value={props.length} min={18} max={80} step={1} onChange={props.onLength} unit="in" /><Slider label="Cut size x" value={props.cut} min={0.1} max={props.feasibleMax} step={0.05} onChange={props.onCut} unit="in" /><div className="da-constraint"><CheckCircle2 /><span>Feasible: 0 &lt; x &lt; {tidy(Math.min(props.width, props.length) / 2)}</span></div><button className="da-find" type="button" onClick={props.onFindOptimum}><Trophy />Find optimum</button></>;
  return <><Formula label="Function" value="f(x) = x^2" /><Slider label="Interval start a" value={props.mvtA} min={-3} max={3.5} step={0.05} onChange={props.onMvtA} /><Slider label="Interval end b" value={props.mvtB} min={props.mvtA + 0.25} max={5} step={0.05} onChange={props.onMvtB} /></>;
}

function ModeVisual(props: { mode: string; time: number; radius: number; radiusRate: number; curveX: number; width: number; length: number; cut: number; optimum: number; mvtA: number; mvtB: number }) {
  if (props.mode === "motion") return <MotionVisual time={props.time} />;
  if (props.mode === "related") return <RelatedRatesVisual radius={props.radius} radiusRate={props.radiusRate} />;
  if (props.mode === "curve") return <CurveVisual x={props.curveX} />;
  if (props.mode === "optimization") return <OptimizationVisual width={props.width} length={props.length} cut={props.cut} optimum={props.optimum} />;
  return <MvtVisual a={props.mvtA} b={props.mvtB} />;
}

function MotionVisual({ time }: { time: number }) {
  const position = motionPosition(time), velocity = motionVelocity(time);
  return <div className="da-visual-stack"><article className="da-panel da-scene"><header><h2>Motion along a line</h2><span>t = {tidy(time)} s</span></header><svg viewBox="0 0 820 265" role="img" aria-label="Particle position on a number line"><defs><linearGradient id="motionTrail" x1="0" x2="1"><stop stopColor="#09b9df" /><stop offset="1" stopColor="#8b4df5" /></linearGradient></defs><line x1="70" x2="750" y1="155" y2="155" stroke="#91a6bd" strokeWidth="3" />{Array.from({ length: 7 }, (_, index) => <g key={index}><line x1={90 + index * 105} x2={90 + index * 105} y1="145" y2="165" stroke="#607892" /><text x={84 + index * 105} y="188">{index * 2}</text></g>)}<line x1="90" x2={90 + clamp(position, 0, 12) / 12 * 630} y1="155" y2="155" stroke="url(#motionTrail)" strokeWidth="10" strokeLinecap="round" /><circle cx={90 + clamp(position, 0, 12) / 12 * 630} cy="155" r="17" fill="#ff8a1f" stroke="#fff" strokeWidth="5" /><text x="55" y="54" className="title">s(t) = {format(position, 3)} m</text><text x="55" y="86" className="note">velocity {velocity >= 0 ? "points right" : "points left"}</text></svg></article><GraphCard title="Position and velocity" curves={[{ fn: motionPosition, color: "#09b9df" }, { fn: motionVelocity, color: "#8b4df5" }]} xMin={0} xMax={6} marker={time} /></div>;
}

function RelatedRatesVisual({ radius, radiusRate }: { radius: number; radiusRate: number }) {
  const displayRadius = 38 + radius * 12;
  return <div className="da-visual-stack"><article className="da-panel da-scene"><header><h2>Linked rates in an expanding sphere</h2><span>dr/dt = {tidy(radiusRate)} cm/s</span></header><svg viewBox="0 0 820 360" role="img" aria-label="Expanding sphere with radius and volume rate"><defs><radialGradient id="sphereFill" cx="35%" cy="28%"><stop stopColor="#dff9ff" /><stop offset=".48" stopColor="#38c9ef" /><stop offset="1" stopColor="#4f46e5" /></radialGradient></defs><circle cx="365" cy="185" r={displayRadius} fill="url(#sphereFill)" opacity=".82" stroke="#174e9c" strokeWidth="3" /><ellipse cx="365" cy="185" rx={displayRadius} ry={displayRadius * .3} fill="none" stroke="#dff8ff" strokeWidth="2" opacity=".8" /><line x1="365" x2={365 + displayRadius} y1="185" y2="185" stroke="#ff8a1f" strokeWidth="4" /><circle cx="365" cy="185" r="5" fill="#0a2147" /><text x={375 + displayRadius / 2} y="174">r = {tidy(radius)} cm</text><path d={`M${365 + displayRadius + 12} 185 l35 0 l-12 -9 m12 9 l-12 9`} fill="none" stroke="#8b4df5" strokeWidth="4" /><text x="55" y="55" className="title">dV/dt = 4 pi r^2 dr/dt</text><text x="55" y="88" className="note">A small radial change affects the entire spherical surface.</text></svg></article><GraphCard title="Volume as radius changes" curves={[{ fn: (r) => 4 / 3 * Math.PI * r ** 3, color: "#09b9df" }]} xMin={0} xMax={8} marker={radius} /></div>;
}

function CurveVisual({ x }: { x: number }) { return <div className="da-visual-stack"><GraphCard title="Function, tangent, and critical behavior" curves={[{ fn: curveFunction, color: "#09b9df" }, { fn: curveDerivative, color: "#8b4df5" }]} xMin={-3} xMax={3} marker={x} tangent /><article className="da-panel da-band"><div><span>Increasing</span><b>x &lt; -1 and x &gt; 1</b></div><div><span>Decreasing</span><b>-1 &lt; x &lt; 1</b></div><div><span>Inflection</span><b>x = 0</b></div></article></div>; }

function OptimizationVisual({ width, length, cut, optimum }: { width: number; length: number; cut: number; optimum: number }) {
  const boxW = Math.max(120, 400 - cut * 12), boxD = Math.max(65, 155 - cut * 5), boxH = 42 + cut * 10;
  return <div className="da-visual-stack"><article className="da-panel da-box-scene"><header><h2>3D box model</h2><span>x = {tidy(cut)} in</span></header><svg viewBox="0 0 820 310" role="img" aria-label="Open top box model"><defs><linearGradient id="boxFront" x1="0" x2="1"><stop stopColor="#60c8f4" stopOpacity=".72" /><stop offset="1" stopColor="#178ac6" stopOpacity=".56" /></linearGradient></defs><polygon points={`190,${220-boxH} ${190+boxW},${220-boxH} ${190+boxW+boxD},${220-boxH-boxD*.48} ${190+boxD},${220-boxH-boxD*.48}`} fill="#bfe5fb" stroke="#113f78" strokeWidth="3" /><polygon points={`190,${220-boxH} ${190+boxW},${220-boxH} ${190+boxW},220 ${190},220`} fill="url(#boxFront)" stroke="#113f78" strokeWidth="3" /><polygon points={`${190+boxW},${220-boxH} ${190+boxW+boxD},${220-boxH-boxD*.48} ${190+boxW+boxD},${220-boxD*.48} ${190+boxW},220`} fill="#1ca8df" fillOpacity=".45" stroke="#113f78" strokeWidth="3" /><text x="80" y="55" className="title">V(x) = x(W - 2x)(L - 2x)</text><text x="210" y="260">L - 2x = {format(length - 2 * cut, 2)} in</text><text x="595" y="232">W - 2x = {format(width - 2 * cut, 2)} in</text><text x="115" y={210-boxH/2}>x = {format(cut, 2)}</text></svg></article><VolumeGraph width={width} length={length} cut={cut} optimum={optimum} /></div>;
}

function MvtVisual({ a, b }: { a: number; b: number }) {
  const c = (a + b) / 2, slope = a + b;
  return <div className="da-visual-stack"><GraphCard title="Secant and matching tangent" curves={[{ fn: (x) => x * x, color: "#09b9df" }]} xMin={-3} xMax={5} marker={c} secant={{ a, b }} tangent /><article className="da-panel da-band"><div><span>Average slope</span><b>{format(slope, 4)}</b></div><div><span>MVT point c</span><b>{format(c, 4)}</b></div><div><span>f'(c)</span><b>{format(2 * c, 4)}</b></div></article></div>;
}

function GraphCard({ title, curves, xMin, xMax, marker, tangent = false, secant }: { title: string; curves: Array<{ fn: (x: number) => number; color: string }>; xMin: number; xMax: number; marker: number; tangent?: boolean; secant?: { a: number; b: number } }) {
  const width = 820, height = 430, pad = 48;
  const values = curves.flatMap((curve) => sample(curve.fn, xMin, xMax, 180).map((point) => point.y)).filter(Number.isFinite);
  const rawMin = Math.min(...values, -1), rawMax = Math.max(...values, 1), margin = Math.max(1, (rawMax - rawMin) * .12), yMin = rawMin - margin, yMax = rawMax + margin;
  const sx = (x: number) => pad + (x - xMin) / (xMax - xMin) * (width - pad * 2), sy = (y: number) => height - pad - (y - yMin) / (yMax - yMin) * (height - pad * 2);
  const primary = curves[0].fn, markerY = primary(marker), tangentSlope = derivative(primary, marker);
  return <article className="da-panel da-graph-card"><header><h2>{title}</h2><div>{curves.map((curve, index) => <span key={curve.color}><i style={{ background: curve.color }} />{index ? "derivative" : "function"}</span>)}</div></header><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}><rect width={width} height={height} fill="#fff" />{Array.from({ length: 9 }, (_, index) => <line key={`v${index}`} x1={pad + index * (width-pad*2)/8} x2={pad + index*(width-pad*2)/8} y1={pad} y2={height-pad} className="grid" />)}{Array.from({ length: 7 }, (_, index) => <line key={`h${index}`} x1={pad} x2={width-pad} y1={pad+index*(height-pad*2)/6} y2={pad+index*(height-pad*2)/6} className="grid" />)}<line x1={pad} x2={width-pad} y1={sy(0)} y2={sy(0)} className="axis" /><line x1={sx(0)} x2={sx(0)} y1={pad} y2={height-pad} className="axis" />{curves.map((curve) => <path key={curve.color} d={graphPath(sample(curve.fn,xMin,xMax,280),sx,sy)} fill="none" stroke={curve.color} strokeWidth="4" />)}{secant && <line x1={sx(secant.a)} y1={sy(primary(secant.a))} x2={sx(secant.b)} y2={sy(primary(secant.b))} stroke="#f59e0b" strokeWidth="3" />}{tangent && <line x1={sx(xMin)} y1={sy(markerY+tangentSlope*(xMin-marker))} x2={sx(xMax)} y2={sy(markerY+tangentSlope*(xMax-marker))} stroke="#ef4444" strokeWidth="3" strokeDasharray="9 6" />}<line x1={sx(marker)} x2={sx(marker)} y1={pad} y2={height-pad} stroke="#8b5cf6" strokeDasharray="7 6" /><circle cx={sx(marker)} cy={sy(markerY)} r="8" fill="#8b5cf6" stroke="#fff" strokeWidth="3" /></svg></article>;
}

function VolumeGraph({ width: sheetW, length: sheetL, cut, optimum }: { width: number; length: number; cut: number; optimum: number }) {
  const width = 820, height = 330, pad = 48, xMax = Math.min(sheetW, sheetL) / 2, maxVolume = boxVolume(sheetW, sheetL, optimum) * 1.14;
  const sx = (x: number) => pad + x / xMax * (width - pad * 2), sy = (y: number) => height - pad - y / maxVolume * (height - pad * 2);
  const points = sample((x) => boxVolume(sheetW, sheetL, x), 0, xMax, 220);
  return <article className="da-panel da-volume"><header><h2>Volume V(x) vs cut size x</h2><span>Maximum at x = {format(optimum, 3)}</span></header><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Box volume optimization graph"><rect width={width} height={height} fill="#fff" /><rect x={pad} y={pad} width={width-pad*2} height={height-pad*2} fill="#effbef" /><line x1={pad} x2={width-pad} y1={height-pad} y2={height-pad} className="axis" /><path d={graphPath(points,sx,sy)} fill="none" stroke="#0aaed8" strokeWidth="4" /><line x1={sx(optimum)} x2={sx(optimum)} y1={pad} y2={height-pad} stroke="#159947" strokeDasharray="7 5" /><circle cx={sx(optimum)} cy={sy(boxVolume(sheetW,sheetL,optimum))} r="8" fill="#19b34b" /><circle cx={sx(cut)} cy={sy(boxVolume(sheetW,sheetL,cut))} r="7" fill="#ff8a1f" stroke="#fff" strokeWidth="2" /><text x={sx(optimum)-38} y={sy(boxVolume(sheetW,sheetL,optimum))-14}>maximum</text><text x={sx(cut)+10} y={sy(boxVolume(sheetW,sheetL,cut))+5}>x = {tidy(cut)}</text></svg></article>;
}

function ModeAnalysis(props: { mode: string; time: number; radius: number; radiusRate: number; curveX: number; width: number; length: number; cut: number; optimum: number; mvtA: number; mvtB: number }) {
  if (props.mode === "motion") { const s=motionPosition(props.time),v=motionVelocity(props.time),a=motionAcceleration(props.time); return <><AnalysisTitle title="Live motion" /><Metric label="Position s(t)" value={`${format(s,3)} m`} /><Metric label="Velocity v(t)" value={`${format(v,3)} m/s`} tone={v>=0?"green":"violet"} /><Metric label="Acceleration a(t)" value={`${format(a,3)} m/s^2`} /><Insight text={v*a>0?"Speed is increasing because velocity and acceleration have the same sign.":v*a<0?"Speed is decreasing because velocity and acceleration have opposite signs.":"The particle is at a turning or transition point."} /></>; }
  if (props.mode === "related") { const volume=4/3*Math.PI*props.radius**3,rate=4*Math.PI*props.radius**2*props.radiusRate; return <><AnalysisTitle title="Linked rates" /><Metric label="Current volume" value={`${format(volume,3)} cm^3`} /><Metric label="dV/dt" value={`${format(rate,3)} cm^3/s`} tone="green" /><Metric label="Surface area" value={`${format(4*Math.PI*props.radius**2,3)} cm^2`} /><Insight text="Differentiate the relationship first, then substitute the current radius and its rate." /></>; }
  if (props.mode === "curve") { const first=curveDerivative(props.curveX),second=curveSecond(props.curveX); return <><AnalysisTitle title={`Local analysis at x = ${tidy(props.curveX)}`} /><Metric label="f(x)" value={format(curveFunction(props.curveX),4)} /><Metric label="f'(x)" value={format(first,4)} tone={first>=0?"green":"red"} /><Metric label="f''(x)" value={format(second,4)} tone={second>=0?"green":"violet"} /><Insight text={`${first>0?"Increasing":"Decreasing"} and ${second>0?"concave up":second<0?"concave down":"at an inflection point"}.`} /></>; }
  if (props.mode === "optimization") { const volume=boxVolume(props.width,props.length,props.cut), derivativeValue=boxDerivative(props.width,props.length,props.cut); return <><AnalysisTitle title="Dimensions and objective" /><Metric label="Cut size x" value={`${format(props.cut,3)} in`} /><Metric label="Base dimensions" value={`${format(props.length-2*props.cut,2)} x ${format(props.width-2*props.cut,2)} in`} /><Metric label="Volume V(x)" value={`${format(volume,3)} in^3`} tone="green" /><Metric label="Derivative V'(x)" value={format(derivativeValue,3)} tone={Math.abs(derivativeValue)<.1?"green":"plain"} /><section className="da-proof"><h3>Why this is a maximum</h3><p><CheckCircle2 /> V'(x*) = 0 at x* = {format(props.optimum,4)}</p><p><CheckCircle2 /> V''(x*) = {format(boxSecond(props.width,props.length,props.optimum),3)} &lt; 0</p><p><CheckCircle2 /> The optimum lies inside the feasible interval.</p></section></>; }
  const c=(props.mvtA+props.mvtB)/2,slope=props.mvtA+props.mvtB; return <><AnalysisTitle title="Mean Value check" /><Metric label="Average slope" value={format(slope,4)} /><Metric label="Theorem point c" value={format(c,4)} tone="violet" /><Metric label="Tangent slope f'(c)" value={format(2*c,4)} tone="green" /><Insight text="The secant and tangent slopes agree, so the Mean Value Theorem is verified on this interval." /></>;
}

function LearningPanel({ active, onChange, mode, cut, optimum }: { active: LearningMode; onChange: (value: LearningMode) => void; mode: string; cut: number; optimum: number }) {
  const copy: Record<LearningMode,string> = { Experiment: modeInfo[mode]?.subtitle ?? "Explore the derivative model.", Reasoning: "Identify the changing quantity, write its relationship, differentiate, and only then substitute the current values.", Challenge: mode === "optimization" ? `Move x from ${tidy(cut)} toward ${format(optimum,2)} and make V'(x) approach zero.` : "Change the controls and predict the sign of each derivative before reading the live analysis." };
  return <section className="da-learning"><nav>{(["Experiment","Reasoning","Challenge"] as LearningMode[]).map((tab)=><button type="button" key={tab} className={active===tab?"active":""} onClick={()=>onChange(tab)}>{tab==="Experiment"?<Lightbulb />:tab==="Reasoning"?<Target />:<Trophy />}{tab}</button>)}</nav><p>{copy[active]}</p></section>;
}

function Slider({ label, value, min, max, step, onChange, unit = "" }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; unit?: string }) { return <label className="da-slider"><span>{label}<b>{tidy(value)} {unit}</b></span><input aria-label={label} type="range" min={min} max={max} step={step} value={clamp(value,min,max)} onChange={(event)=>onChange(Number(event.target.value))} /><small><span>{tidy(min)}</span><span>{tidy(max)}</span></small></label>; }
function Formula({ label, value }: { label: string; value: string }) { return <div className="da-formula"><span>{label}</span><strong>{value}</strong></div>; }
function Metric({ label, value, tone="plain" }: { label: string; value: string; tone?: string }) { return <div className={`da-metric ${tone}`}><span>{label}</span><strong>{value}</strong></div>; }
function Insight({ text }: { text: string }) { return <section className="da-insight"><Lightbulb /><p>{text}</p></section>; }
function AnalysisTitle({ title }: { title: string }) { return <h2 className="da-analysis-title"><Gauge />{title}</h2>; }

function motionPosition(t:number){return t**3-6*t**2+9*t} function motionVelocity(t:number){return 3*t**2-12*t+9} function motionAcceleration(t:number){return 6*t-12}
function curveFunction(x:number){return x**3-3*x} function curveDerivative(x:number){return 3*x**2-3} function curveSecond(x:number){return 6*x}
function boxVolume(width:number,length:number,x:number){return Math.max(0,x*(width-2*x)*(length-2*x))} function boxDerivative(width:number,length:number,x:number){return width*length-4*(width+length)*x+12*x*x} function boxSecond(width:number,length:number,x:number){return 24*x-4*(width+length)}
function optimalCut(width:number,length:number){return (width+length-Math.sqrt(width*width-width*length+length*length))/6}
function derivative(fn:(x:number)=>number,x:number){const h=.0001;return(fn(x+h)-fn(x-h))/(2*h)}
function sample(fn:(x:number)=>number,min:number,max:number,count:number){return Array.from({length:count},(_,index)=>{const x=min+index/(count-1)*(max-min);return{x,y:fn(x)}})}
function graphPath(points:Array<{x:number;y:number}>,sx:(value:number)=>number,sy:(value:number)=>number){return points.map((point,index)=>`${index?"L":"M"}${sx(point.x).toFixed(2)},${sy(point.y).toFixed(2)}`).join(" ")}
function numberParam(value:string|null,fallback:number){const parsed=Number(value);return value!==null&&Number.isFinite(parsed)?parsed:fallback} function clamp(value:number,min:number,max:number){return Math.min(max,Math.max(min,value))} function round(value:number,digits:number){const factor=10**digits;return Math.round(value*factor)/factor} function tidy(value:number){return Number.isFinite(value)?Number(value.toFixed(2)).toString():"--"} function format(value:number,digits:number){return Number.isFinite(value)?value.toFixed(digits):"--"}

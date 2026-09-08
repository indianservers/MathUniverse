import { AlertTriangle, Check, Maximize2, Pause, Play, RotateCcw, ShieldCheck, Target } from "lucide-react";
import { useMemo, useState, type PointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import { exponentialAnalysis, exponentialDensity, exponentialSurvival, simulateExponentialArrivals } from "./exponentialLessonModel";
import "./ExponentialDistributionLesson532.css";

export default function ExponentialDistributionLesson532({ resetToken, onInteraction }: LessonAdapterProps) {
  return <ExponentialActivity key={resetToken} onInteraction={onInteraction}/>;
}

function ExponentialActivity({ onInteraction }: Pick<LessonAdapterProps, "onInteraction">) {
  const [rate, setRate] = useState(0.4);
  const [threshold, setThreshold] = useState(3);
  const [unit, setUnit] = useState("minutes");
  const [seed, setSeed] = useState(532);
  const [running, setRunning] = useState(true);
  const [answer, setAnswer] = useState(1);
  const [checked, setChecked] = useState(true);
  const result = useMemo(() => exponentialAnalysis(rate, threshold), [rate, threshold]);
  const simulation = useMemo(() => simulateExponentialArrivals(rate, 18, seed), [rate, seed]);
  const samples = Array.from({ length: 121 }, (_, index) => {
    const time = 10 * index / 120;
    return { time, density: exponentialDensity(time, rate), survival: exponentialSurvival(time, rate) };
  });
  const px = (value: number) => 6 + value / 10 * 90;
  const densityLine = samples.map((point) => `${px(point.time)},${88-point.density/Math.max(rate,0.01)*72}`).join(" ");
  const survivalLine = samples.map((point) => `${px(point.time)},${88-point.survival*72}`).join(" ");
  const dragThreshold = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setThreshold(Math.max(0, Math.min(10, (((event.clientX-rect.left)/rect.width)-0.06)/0.9*10)));
    onInteraction();
  };
  const reset = () => { setRate(.4); setThreshold(3); setUnit("minutes"); setSeed(532); setRunning(true); setAnswer(1); setChecked(true); onInteraction(); };
  const resample = () => { setSeed((value) => value + 1); setRunning(true); onInteraction(); };
  const histogram = Array.from({length:10},(_,index) => simulation.intervals.filter((value) => value >= index && value < index+1).length);
  const maxBin = Math.max(1,...histogram);
  const memoryS = 2, memoryT = 3;

  return <div className="ex532" data-testid="probability-mockup-0495" data-target-family="probability-and-distributions">
    <header className="ex532-hero"><span>DATA AND PROBABILITY</span><h2>Exponential Distribution</h2><p>Model waiting times between events in a Poisson process.</p><button type="button" onClick={reset}><RotateCcw size={14}/>Reset</button></header>
    <nav><b>Interactive Lab</b><span>Explain</span><span>Examples</span><span>Formulas</span><span>Key Insights</span><span>Practice</span></nav>
    <main className="ex532-lab"><header><div><h3>Interactive Lab</h3><h4>Waiting times between events</h4><p>Adjust the rate, explore the distribution, and run simulations.</p></div><strong>Active</strong><button type="button" aria-label="Expand"><Maximize2 size={14}/></button></header>
      <section className="ex532-controls"><label>Rate lambda (per unit time)<input type="range" min=".05" max="2" step=".01" value={rate} onChange={(event) => { setRate(Number(event.target.value)); onInteraction(); }}/><output>{rate.toFixed(2)}</output></label><label>Time threshold t0<input type="range" min="0" max="10" step=".05" value={threshold} onChange={(event) => { setThreshold(Number(event.target.value)); onInteraction(); }}/><output>t0 = {threshold.toFixed(2)}</output></label><label>Units<select value={unit} onChange={(event) => { setUnit(event.target.value); onInteraction(); }}><option>minutes</option><option>seconds</option><option>hours</option></select></label><button type="button" onClick={resample}><Play size={14}/>New simulation</button></section>
      <section className="ex532-graphs"><DistributionGraph title="Probability density" formula="f(t) = lambda e^(-lambda t)" line={densityLine} threshold={threshold} value={`f(${threshold.toFixed(2)}) = ${result.density.toFixed(4)}`} drag={dragThreshold}/><DistributionGraph title="Survival function" formula="S(t) = P(T > t) = e^(-lambda t)" line={survivalLine} threshold={threshold} value={`P(T > ${threshold.toFixed(2)}) = ${result.survival.toFixed(4)}`} drag={dragThreshold} shaded/></section>
      <section className="ex532-summary"><article>P(T &lt;= t0)<b>{result.cumulative.toFixed(4)}</b><span>{(result.cumulative*100).toFixed(2)}%</span></article><article>P(T &gt; t0)<b>{result.survival.toFixed(4)}</b><span>{(result.survival*100).toFixed(2)}%</span></article><article>Instantaneous rate<b>{rate.toFixed(4)}</b><span>per {unit.slice(0,-1)}</span></article><article>Expected wait<b>{result.mean.toFixed(3)} {unit.slice(0,3)}</b><span>E[T] = 1/lambda</span></article></section>
      <section className="ex532-middle"><article><h3>Memoryless property</h3><b>P(T &gt; s + t | T &gt; s) = P(T &gt; t)</b><table><tbody><tr><td>P(T &gt; {memoryS+memoryT})</td><td>{exponentialSurvival(memoryS+memoryT,rate).toFixed(4)}</td></tr><tr><td>P(T &gt; {memoryS})</td><td>{exponentialSurvival(memoryS,rate).toFixed(4)}</td></tr><tr><td>P(T &gt; {memoryS+memoryT} | T &gt; {memoryS})</td><td>{(exponentialSurvival(memoryS+memoryT,rate)/exponentialSurvival(memoryS,rate)).toFixed(4)}</td></tr><tr><td>P(T &gt; {memoryT})</td><td>{exponentialSurvival(memoryT,rate).toFixed(4)}</td></tr></tbody></table><strong><Check size={14}/>Equal: confirms the memoryless property.</strong></article><article><header><div><h3>Live arrival simulation (Poisson process)</h3><p>Rate lambda = {rate.toFixed(3)} per {unit.slice(0,-1)}</p></div><button type="button" onClick={() => setRunning((value) => !value)}>{running?<Pause size={14}/>:<Play size={14}/>}</button></header><div className="ex532-simstats"><span>Simulated time<b>18.00 {unit.slice(0,3)}</b></span><span>Events observed<b>{simulation.intervals.length}</b></span><span>Average wait<b>{simulation.average.toFixed(3)} {unit.slice(0,3)}</b></span></div><p className="ex532-values">{simulation.intervals.length ? simulation.intervals.map((value) => value.toFixed(3)).join("   ") : "No arrivals in this run"}</p><h3>Histogram of inter-event times</h3><div className={`ex532-hist ${running?"running":""}`}>{histogram.map((count,index) => <i key={index} style={{height:`${Math.max(3,count/maxBin*100)}%`}} title={`${index}-${index+1}: ${count}`}/>)}</div></article></section>
      <section className="ex532-notes"><article><Target size={16}/><h3>Objective</h3><p>Model waiting times, compute probabilities, and interpret graphs and simulations.</p></article><article><h3>Key insight</h3><p>The exponential distribution is memoryless and has a constant event rate.</p></article><article><AlertTriangle size={16}/><h3>Common misconception</h3><p>The most likely waiting time is zero, not the mean.</p></article><article><ShieldCheck size={16}/><h3>Assumptions &amp; cautions</h3><p>Events occur independently and the average rate is constant.</p></article></section>
      <section className="ex532-formulas"><article><h3>Formulas at a glance</h3><p>PDF: f(t)=lambda e^(-lambda t)</p><p>CDF: F(t)=1-e^(-lambda t)</p><p>Mean: E[T]=1/lambda</p><p>Variance: Var(T)=1/lambda^2</p></article><article><h3>Worked example with current lambda = {rate.toFixed(2)}</h3><p>P(T &gt; {threshold.toFixed(0)}) = {result.survival.toFixed(4)}</p><p>P(T &lt;= {threshold.toFixed(0)}) = {result.cumulative.toFixed(4)}</p><p>Expected wait = {result.mean.toFixed(3)} {unit}</p><p>Variance = {result.variance.toFixed(3)} {unit} squared</p></article></section>
      <section className="ex532-quiz"><h3>Quick knowledge check</h3><article><div><b>For rate lambda=0.40, what is P(T &gt; 3 minutes)?</b>{["0.2019","0.3012","0.5507","0.6988"].map((option,index)=><label key={option} className={answer===index?"selected":""}><input type="radio" checked={answer===index} onChange={() => { setAnswer(index); setChecked(false); onInteraction(); }}/>{String.fromCharCode(65+index)}. {option}</label>)}</div><aside className={checked&&answer===1?"correct":"incorrect"}>{checked&&answer===1?<Check size={15}/>:<AlertTriangle size={15}/>} {checked?answer===1?"Correct!":"Try again.":"Check your answer."}<button type="button" onClick={() => setChecked(true)}>Check</button></aside></article></section>
    </main><footer><button type="button" onClick={reset}><RotateCcw size={14}/>Reset lesson</button><span>Previous: F Distribution &nbsp; Next: Gamma Distribution</span></footer>
  </div>;
}

function DistributionGraph({ title, formula, line, threshold, value, drag, shaded=false }: { title:string; formula:string; line:string; threshold:number; value:string; drag:(event:PointerEvent<SVGSVGElement>)=>void; shaded?:boolean }) {
  const marker=6+threshold/10*90;
  return <article><h3>{title} <span>{formula}</span></h3><svg viewBox="0 0 100 100" preserveAspectRatio="none" onPointerDown={(event)=>{event.currentTarget.setPointerCapture(event.pointerId);drag(event);}} onPointerMove={(event)=>{if(event.currentTarget.hasPointerCapture(event.pointerId))drag(event);}}>{shaded&&<rect x={marker} y="16" width={96-marker} height="72" className="shade"/>}<line className="axis" x1="4" y1="88" x2="98" y2="88"/><polyline points={line}/><line className="marker" x1={marker} x2={marker} y1="16" y2="90"/><circle cx={marker} cy="88" r="1.7"/></svg><strong>At t = {threshold.toFixed(2)}: {value}</strong></article>;
}

import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  Eye,
  Expand,
  Hand,
  Lightbulb,
  Pause,
  Play,
  RotateCcw,
  Share2,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./SineGraphTargetLesson261.css";

type Parameters = { a: number; b: number; c: number; d: number };
type PracticeFields = { a: string; b: string; c: string; d: string };
const DEFAULTS: Parameters = { a: 1, b: 1, c: 0, d: 0 };
const PRACTICE_EXPECTED: Parameters = { a: 1.5, b: 2, c: -Math.PI / 4, d: -.5 };
const TARGET_PRACTICE: PracticeFields = { a: "1.5", b: "2", c: "−π/4", d: "−0.5" };
const TAU = Math.PI * 2;

export default function SineGraphTargetLesson261({ resetToken, onInteraction }: LessonAdapterProps) {
  const [theta, setTheta] = useState(Math.PI / 3);
  const [parameters, setParameters] = useState<Parameters>(DEFAULTS);
  const [playing, setPlaying] = useState(false);
  const [practice, setPractice] = useState<PracticeFields>(TARGET_PRACTICE);
  const [practiceResult, setPracticeResult] = useState<"idle" | "correct" | "incorrect">("correct");
  const model = useMemo(() => sineModel(parameters), [parameters]);
  const current = model.value(theta);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setTheta((value) => value >= TAU ? -TAU : value + .035), 32);
    return () => window.clearInterval(timer);
  }, [playing]);
  useEffect(() => {
    setTheta(Math.PI / 3);
    setParameters(DEFAULTS);
    setPlaying(false);
    setPractice(TARGET_PRACTICE);
    setPracticeResult("correct");
  }, [resetToken]);

  const updateTheta = (value: number) => {
    setTheta(clamp(value, -TAU, TAU));
    onInteraction();
  };
  const updateParameter = (key: keyof Parameters, value: number) => {
    setParameters((currentParameters) => ({ ...currentParameters, [key]: value }));
    onInteraction();
  };
  const reset = (notify = true) => {
    setTheta(Math.PI / 3);
    setParameters(DEFAULTS);
    setPlaying(false);
    setPractice(TARGET_PRACTICE);
    setPracticeResult("correct");
    if (notify) onInteraction();
  };
  const gradePractice = () => {
    const parsed = {
      a: Number(practice.a), b: Number(practice.b), c: parsePi(practice.c), d: Number(practice.d),
    };
    const correct = (Object.keys(PRACTICE_EXPECTED) as Array<keyof Parameters>).every((key) => Number.isFinite(parsed[key]) && Math.abs(parsed[key] - PRACTICE_EXPECTED[key]) < .005);
    setPracticeResult(correct ? "correct" : "incorrect");
    onInteraction();
  };

  return <section
    className="target-sine-page"
    data-testid="trigonometry-mockup-0318"
    data-dedicated-lesson="261"
    data-object-model="linked-unit-circle-transformable-sine-function-model"
    data-theta={theta.toFixed(6)}
    data-current-y={current.toFixed(6)}
    data-amplitude={model.amplitude.toFixed(3)}
    data-period={model.period.toFixed(6)}
    data-phase-shift={parameters.c.toFixed(6)}
    data-vertical-shift={parameters.d.toFixed(3)}
    data-playing={playing}
    data-practice-result={practiceResult}
  >
    <header className="target-sine-header">
      <div><span>Trigonometry</span><span>Trigonometry</span><h1>Sine Graph</h1><p>Explore periodic shape.</p><section><b>♙ Intermediate-Advanced</b><b>ϟ Visual Lab</b><b>▣ Trig Graphing / Geometry</b><b>◷ 6-10 min</b></section></div>
      <footer><label><select aria-label="Lesson language" defaultValue="en" onChange={onInteraction}><option value="en">English (English)</option><option value="hi">हिन्दी (Hindi)</option></select></label><button type="button" onClick={() => reset()}><RotateCcw />Reset</button><button type="button" onClick={() => { void navigator.clipboard?.writeText(model.equation); onInteraction(); }}><Share2 />Share</button><button type="button" onClick={() => { document.querySelector(".target-sine-sync")?.scrollIntoView({ behavior:"smooth" }); onInteraction(); }}><Expand />Workspace</button></footer>
    </header>

    <section className="target-sine-sync">
      <header><h2>Sine Graph: unit-circle to y = sin x</h2><span><Check />Everything is in sync</span><button type="button" aria-label="Expand linked graph" onClick={() => { document.querySelector(".target-sine-diagrams")?.requestFullscreen?.(); onInteraction(); }}><Expand /></button></header>
      <div className="target-sine-diagrams"><article><h3>1. Observe (unit circle)</h3><CircleGraph theta={theta} onTheta={updateTheta} /></article><div className="target-sine-arrow">➜</div><article><h3>2. Sine graph (y = sin x)</h3><SinePlot parameters={DEFAULTS} theta={theta} onTheta={updateTheta} testId="sine-main-graph-handle" /></article></div>
      <footer><output><small>Current angle θ</small><strong>{formatDegrees(theta)}°</strong><b>({formatRadians(theta)} rad)</b></output><div><input aria-label="Current sine angle" type="range" min={-TAU} max={TAU} step={Math.PI / 180} value={theta} onChange={(event) => updateTheta(Number(event.target.value))} /><section>{["−2π","−3π/2","−π","−π/2","0","π/2","π","3π/2","2π"].map((item) => <span key={item}>{item}</span>)}</section></div><button type="button" aria-label={playing ? "Pause animation" : "Play animation"} onClick={() => { setPlaying((value) => !value); onInteraction(); }}>{playing ? <Pause /> : <Play />}</button><button type="button" aria-label="Restart animation" onClick={() => { setTheta(-TAU); setPlaying(false); onInteraction(); }}><RotateCcw /></button><output><small>sin θ</small><strong>{Math.sin(theta).toFixed(3)}</strong></output></footer>
    </section>

    <section className="target-sine-transform">
      <header><h2>3. Manipulate transformations</h2><button type="button" onClick={() => { setParameters(DEFAULTS); onInteraction(); }}><RotateCcw />Restore defaults</button></header>
      <h3>General form: &nbsp; y = <b>A</b> sin (<b>B</b> (x − <b>C</b>)) + <b>D</b></h3>
      <div className="target-sine-controls"><ParameterControl name="Amplitude A" tone="pink" value={parameters.a} min={.1} max={5} step={.1} onChange={(value) => updateParameter("a", value)} /><ParameterControl name="Period factor B" tone="blue" value={parameters.b} min={.25} max={4} step={.25} onChange={(value) => updateParameter("b", value)} /><ParameterControl name="Phase shift C" suffix=" (radians)" tone="purple" value={parameters.c} min={-TAU} max={TAU} step={Math.PI / 12} onChange={(value) => updateParameter("c", value)} format={formatRadians} /><ParameterControl name="Vertical shift D" tone="teal" value={parameters.d} min={-3} max={3} step={.25} onChange={(value) => updateParameter("d", value)} /></div>
      <footer><article><h3>Key Formula</h3><strong>{model.equation}</strong><p>Domain: &nbsp; x ∈ R &nbsp; • &nbsp; Range: &nbsp; [{formatNumber(model.min)}, {formatNumber(model.max)}]</p><p>Period: &nbsp; T = 2π / |B| = {formatRadians(model.period)}</p></article><ul><li><i>A</i>Amplitude: vertical stretch/compression; height = |A|.</li><li><i>B</i>Period factor: compress (B &gt; 1) or stretch (0 &lt; B &lt; 1).</li><li><i>C</i>Phase shift: moves left/right. Right by C.</li><li><i>D</i>Vertical shift: moves up/down.</li></ul></footer>
    </section>

    <section className="target-sine-steps">{[[Eye,"1. Observe","A radius at angle θ on the unit circle has point (cos θ, sin θ). The vertical projection is sin θ."],[Hand,"2. Manipulate","Change θ to move; adjust A, B, C, D to transform the sine graph."],[Lightbulb,"3. Notice","Amplitude controls height; B controls period; C shifts left/right; D shifts up/down."],[Brain,"4. Understand","The sine graph is periodic and smooth, tracing sin θ as θ increases along the x-axis."]].map(([Icon,title,text],index) => <article key={String(title)}><h3><Icon />{String(title)}</h3><p>{String(text)}</p>{index === 0 ? <MiniCircle /> : index === 1 ? <MiniSliders /> : <MiniWave shifted={index === 2} />}</article>)}</section>

    <section className="target-sine-examples"><article><h2><Check />Worked Example</h2><h3>Graph y = 2 sin (½ (x − π/3)) + 1.</h3><div><section><b>Solution</b><p>A = 2 → amplitude 2</p><p>B = ½ → period T = 2π/(½) = 4π</p><p>C = π/3 → shift right by π/3</p><p>D = 1 → shift up by 1</p><p>Range: [1 − 2, 1 + 2] = [−1, 3]</p></section><SinePlot parameters={{a:2,b:.5,c:Math.PI/3,d:1}} compact /></div></article><article><h2><TriangleAlert />Common Misconception</h2><h3>Confusing sine with cosine.</h3><p>Sine starts at 0 when x = 0 and increases.<br />Cosine starts at 1 when x = 0.</p><ComparisonPlot /><footer>Remember: &nbsp; sin x = cos (x − π/2)</footer></article></section>

    <section className="target-sine-practice"><article><h2><Target />Practice Challenge</h2><p>Set parameters to graph &nbsp; y = 1.5 sin (2x + π/2) − 0.5.</p><h3>Your settings</h3><div>{(["a","b","c","d"] as const).map((key) => <label key={key}><b>{key.toUpperCase()}</b><input aria-label={`Practice ${key.toUpperCase()}`} value={practice[key]} placeholder="?" onChange={(event) => { setPractice((currentPractice) => ({...currentPractice,[key]:event.target.value})); setPracticeResult("idle"); onInteraction(); }} /></label>)}<button type="button" onClick={gradePractice}>Check</button></div><footer><b>What to expect:</b> Amplitude = 1.5 &nbsp; • &nbsp; Period = π &nbsp; • &nbsp; Shift left by π/4 &nbsp; • &nbsp; Range [−2, 1]</footer>{practiceResult === "incorrect" ? <p role="status">Check A, B, C and D. Use −π/4 for the phase shift.</p> : null}</article><aside className={practiceResult === "correct" ? "correct" : ""}><h3><Check />{practiceResult === "correct" ? "Great! Your graph matches." : "Preview updates from your settings"}</h3><SinePlot parameters={practiceParameters(practice)} compact /><p>y = {practiceParameters(practice).d.toFixed(1)}</p></aside></section>

    <nav className="target-sine-nav"><a href="/lessons/trigonometry/260-exact-trig-values"><ArrowLeft /><span><b>Previous</b>Exact Trig Values</span></a><a href="/lessons/trigonometry/262-cosine-graph"><span><b>Next</b>Cosine Graph</span><ArrowRight /></a></nav>
  </section>;
}

function CircleGraph({ theta, onTheta }: { theta:number; onTheta:(value:number)=>void }) {
  const svg=useRef<SVGSVGElement>(null), center={x:148,y:140}, normalized=((theta%TAU)+TAU)%TAU, point={x:148+128*Math.cos(normalized),y:140-128*Math.sin(normalized)};
  const move=(event:ReactPointerEvent<SVGSVGElement>)=>{ if(event.type==="pointermove"&&event.buttons!==1)return; const matrix=svg.current?.getScreenCTM(); if(!matrix)return; const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse()); let next=Math.atan2(center.y-p.y,p.x-center.x); if(next<0)next+=TAU; onTheta(next); };
  return <svg ref={svg} viewBox="0 0 310 270" role="img" aria-label="Draggable unit-circle point projecting sine" onPointerDown={(event)=>{event.currentTarget.setPointerCapture(event.pointerId);move(event);}} onPointerMove={move}><line x1="10" x2="300" y1="140" y2="140"/><line x1="148" x2="148" y1="5" y2="268"/><circle cx="148" cy="140" r="128"/><path d={`M148 140L${point.x} ${point.y}`} stroke="#087aea" strokeWidth="3"/><line x1={point.x} x2={point.x} y1={point.y} y2="140" stroke="#f59e0b" strokeDasharray="5 4"/><circle data-testid="sine-unit-circle-handle" cx={point.x} cy={point.y} r="7" fill="#087aea"/><text x={point.x+7} y={point.y-7}>(cos θ, sin θ)</text><text x={point.x+10} y={(point.y+140)/2} fill="#ec1670">sin θ</text><text x="153" y="12">y</text><text x="298" y="135">x</text><text x="12" y="146">−1</text><text x="288" y="146">1</text><text x="138" y="264">−1</text><text x="138" y="21">1</text></svg>;
}
function SinePlot({ parameters, theta, onTheta, compact=false, testId }: {parameters:Parameters;theta?:number;onTheta?:(value:number)=>void;compact?:boolean;testId?:string}) {
  const svg=useRef<SVGSVGElement>(null), width=compact?250:330,height=compact?150:270,pad=compact?18:25, mid=height/2, scaleY=compact?30:52, path=wavePath(parameters,width,height,pad,scaleY);
  const currentX=theta===undefined?null:pad+(theta+TAU)/(TAU*2)*(width-pad*2), currentY=theta===undefined?null:mid-(parameters.a*Math.sin(parameters.b*(theta-parameters.c))+parameters.d)*scaleY;
  const move=(event:ReactPointerEvent<SVGSVGElement>)=>{if(!onTheta||(event.type==="pointermove"&&event.buttons!==1))return;const matrix=svg.current?.getScreenCTM();if(!matrix)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());onTheta(((p.x-pad)/(width-pad*2))*TAU*2-TAU);};
  return <svg ref={svg} className={compact?"compact":""} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Interactive transformed sine graph" onPointerDown={(event)=>{event.currentTarget.setPointerCapture(event.pointerId);move(event);}} onPointerMove={move}><line x1={pad} x2={width-pad/2} y1={mid} y2={mid}/><line x1={pad} x2={pad} y1="10" y2={height-10}/><path d={path} fill="none" stroke="#087aea" strokeWidth="2.5"/>{currentX!==null&&currentY!==null?<><line x1={currentX} x2={currentX} y1={currentY} y2={mid} stroke="#f59e0b" strokeDasharray="4 3"/><line x1={pad} x2={currentX} y1={currentY} y2={currentY} stroke="#ec1670" strokeDasharray="4 3"/><circle data-testid={testId} cx={currentX} cy={currentY} r="6" fill="#ec1670"/></>:null}<text x={width-12} y={mid-5}>x</text><text x={pad+4} y="14">y</text><text x={pad-7} y={mid+13}>−2π</text><text x={width/2-4} y={mid+13}>0</text><text x={width-pad-8} y={mid+13}>2π</text></svg>;
}
function ParameterControl({name,suffix="",tone,value,min,max,step,onChange,format=formatNumber}:{name:string;suffix?:string;tone:string;value:number;min:number;max:number;step:number;onChange:(value:number)=>void;format?:(value:number)=>string}){return <label className={tone}><b>{name}{suffix}</b><output>{format(value)}</output><input aria-label={name} type="range" min={min} max={max} step={step} value={value} onChange={(event)=>onChange(Number(event.target.value))}/><small><span>{format(min)}</span><span>{format(max)}</span></small></label>;}
function MiniCircle(){return <svg viewBox="0 0 100 70"><circle cx="43" cy="36" r="27" fill="none" stroke="#334155"/><line x1="10" x2="78" y1="36" y2="36" stroke="#64748b"/><line x1="43" x2="43" y1="5" y2="67" stroke="#64748b"/><line x1="43" x2="70" y1="36" y2="22" stroke="#087aea"/><line x1="70" x2="70" y1="22" y2="36" stroke="#ec1670"/><circle cx="70" cy="22" r="3" fill="#087aea"/></svg>;}
function MiniSliders(){return <svg viewBox="0 0 100 70">{[15,35,55].map((y,i)=><g key={y}><line x1="15" x2="82" y1={y} y2={y} stroke="#cbd5e1"/><circle cx={35+i*14} cy={y} r="5" fill="#fff" stroke="#334155" strokeWidth="2"/></g>)}</svg>;}
function MiniWave({shifted}:{shifted:boolean}){const p=wavePath({a:1,b:shifted?1:1.4,c:0,d:0},100,70,6,18);return <svg viewBox="0 0 100 70"><line x1="5" x2="96" y1="35" y2="35" stroke="#64748b" strokeDasharray="3 2"/><path d={p} fill="none" stroke="#087aea" strokeWidth="2"/></svg>;}
function ComparisonPlot(){return <svg viewBox="0 0 270 145"><line x1="25" x2="260" y1="75" y2="75" stroke="#64748b"/><line x1="120" x2="120" y1="10" y2="135" stroke="#64748b"/><path d={wavePath(DEFAULTS,270,145,25,38)} fill="none" stroke="#087aea" strokeWidth="2"/><path d={wavePath({a:1,b:1,c:Math.PI/2,d:0},270,145,25,38)} fill="none" stroke="#ec1670" strokeWidth="2" strokeDasharray="5 3"/></svg>;}
function sineModel(parameters:Parameters){return{amplitude:Math.abs(parameters.a),period:TAU/Math.abs(parameters.b),min:parameters.d-Math.abs(parameters.a),max:parameters.d+Math.abs(parameters.a),equation:`y = ${formatNumber(parameters.a)} sin (${formatNumber(parameters.b)} (x − ${formatRadians(parameters.c)})) + ${formatNumber(parameters.d)}`,value:(x:number)=>parameters.a*Math.sin(parameters.b*(x-parameters.c))+parameters.d};}
function wavePath(parameters:Parameters,width:number,height:number,pad:number,scaleY:number){const mid=height/2,parts=[];for(let i=0;i<=160;i++){const x=-TAU+i/160*TAU*2,y=parameters.a*Math.sin(parameters.b*(x-parameters.c))+parameters.d,px=pad+i/160*(width-pad*2),py=mid-y*scaleY;parts.push(`${i?"L":"M"}${px.toFixed(2)} ${py.toFixed(2)}`);}return parts.join(" ");}
function practiceParameters(fields:PracticeFields):Parameters{return{a:Number(fields.a)||1.5,b:Number(fields.b)||2,c:Number.isFinite(parsePi(fields.c))?parsePi(fields.c):-Math.PI/4,d:Number(fields.d)||-.5};}
function parsePi(value:string){const normalized=value.trim().toLowerCase().replaceAll(" ","").replace("−","-").replace("π","pi");if(!normalized)return Number.NaN;if(normalized==="-pi/4")return-Math.PI/4;if(normalized==="pi/4")return Math.PI/4;if(normalized==="pi/2")return Math.PI/2;if(normalized==="-pi/2")return-Math.PI/2;return Number(normalized);}
function formatRadians(value:number){const ratio=value/Math.PI;if(Math.abs(ratio)<.001)return"0";const choices:[[number,string]]|Array<[number,string]>=[[-2,"−2π"],[-1.5,"−3π/2"],[-1,"−π"],[-.5,"−π/2"],[-.25,"−π/4"],[1/3,"π/3"],[.5,"π/2"],[1,"π"],[1.5,"3π/2"],[2,"2π"],[4,"4π"]];const match=choices.find(([number])=>Math.abs(number-ratio)<.01);return match?.[1]??`${ratio.toFixed(2)}π`;}
function formatDegrees(value:number){return Math.round(value*180/Math.PI);}
function formatNumber(value:number){return Number(value.toFixed(2)).toString();}
function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value));}

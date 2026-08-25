import { ExternalLink, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./AngleSlidersTargetLesson23.css";

const VIEWS = ["Interaction + visualization", "Explain", "Examples", "Formulas", "Know more"];
const COMMON_ANGLES = [0, 30, 45, 60, 90, 180, 270, 360];
const RADIAN_LABELS: Record<number, string> = { 0: "0", 30: "π/6", 45: "π/4", 60: "π/3", 90: "π/2", 180: "π", 270: "3π/2", 360: "2π" };

function format(value: number) { return Math.abs(value) < 0.0005 ? "0.000" : value.toFixed(3); }
function normalize(value: number) { return Math.max(0, Math.min(360, Math.round(value))); }

export default function AngleSlidersTargetLesson23({ resetToken, onInteraction }: LessonAdapterProps) {
  const [angle, setAngle] = useState(60);
  const [view, setView] = useState(0);
  const [mode, setMode] = useState<"degrees" | "radians">("degrees");
  const [workspace, setWorkspace] = useState(false);
  const [shareState, setShareState] = useState("Share");
  const [actions, setActions] = useState(0);
  const radians = angle * Math.PI / 180;
  const cos = Math.cos(radians), sin = Math.sin(radians);
  const tan = Math.abs(cos) < 0.000001 ? null : sin / cos;
  const radianLabel = RADIAN_LABELS[angle] ?? `${(angle / 180).toFixed(3)}π`;
  const touch = () => { setActions((count) => count + 1); onInteraction(); };
  const updateAngle = (value: number) => { setAngle(normalize(value)); touch(); };
  const reset = () => { setAngle(60); setView(0); setMode("degrees"); setWorkspace(false); setShareState("Share"); setActions(0); onInteraction(); };
  useEffect(() => { setAngle(60); setView(0); setMode("degrees"); setWorkspace(false); setShareState("Share"); setActions(0); }, [resetToken]);
  const share = async () => { try { await navigator.clipboard?.writeText(`θ=${angle}°, cos=${format(cos)}, sin=${format(sin)}, tan=${tan===null?"undefined":format(tan)}`); setShareState("Copied"); } catch { setShareState("Ready"); } touch(); };

  return <div className="angle-slider-page" data-testid="algebra-mockup-0023" data-dedicated-lesson="23" data-object-model="draggable-unit-circle-linked-sine-wave-trig-values-degree-radian-common-angle-model" data-angle={angle} data-sin={format(sin)} data-cos={format(cos)} data-tan={tan===null?"undefined":format(tan)} data-view={view} data-mode={mode} data-workspace={workspace} data-actions={actions}>
    <nav className="angle-breadcrumb"><a href="/">←</a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/core-workspaces">Core Workspaces</a><span>›</span><b>23 Angle Sliders</b></nav>
    <header className="angle-header"><div><span><b>CORE WORKSPACES</b><b>ALGEBRA AND DYNAMIC VARIABLES</b></span><h1>Angle Sliders</h1><p>Control rotations and periodic models.</p><nav><b>♙ Foundational-Advanced</b><b>ϟ Exploration Lab</b><b>▣ Algebra View / Input Bar</b><b>◴ 6-10 min</b></nav></div><aside><button type="button" onClick={reset}><RotateCcw/>Reset</button><button type="button" onClick={()=>void share()}><Share2/>{shareState}</button><button type="button" className={workspace?"active":""} onClick={()=>{setWorkspace(value=>!value);touch();}}><ExternalLink/>Workspace</button></aside></header>
    <section className="angle-workspace">
      <nav className="angle-tabs" aria-label="Lesson views">{VIEWS.map((label,index)=><button type="button" className={view===index?"active":""} key={label} onClick={()=>{setView(index);touch();}}>{index===0?"◉":index===1?"▣":index===2?"♧":index===3?"∑":"✣"}<span>{label}</span></button>)}</nav>
      <div className="angle-models"><section><h2>Unit Circle</h2><output>theta = {angle} deg</output><UnitCircle angle={angle} cos={cos} sin={sin} onAngle={updateAngle}/></section><section><h2>Sine Wave: y = sin(theta)</h2><SineWave angle={angle} sin={sin}/></section></div>
      <div className="angle-values"><section><h3>Trigonometric Values</h3><p><b>cos(theta)</b><i>=</i><strong>{format(cos)}</strong></p><p><b>sin(theta)</b><i>=</i><strong>{format(sin)}</strong></p><p><b>tan(theta)</b><i>=</i><strong>{tan===null?"undefined":format(tan)}</strong></p></section><section><h3>Angle Conversion</h3><strong>{angle} deg = <i>{radianLabel}</i> rad</strong></section><section><h3>Angle Mode</h3><nav><button type="button" className={mode==="degrees"?"active":""} onClick={()=>{setMode("degrees");touch();}}>Degrees</button><button type="button" className={mode==="radians"?"active":""} onClick={()=>{setMode("radians");touch();}}>Radians</button></nav><h3>Common Angles</h3><div>{COMMON_ANGLES.map(value=><button type="button" className={angle===value?"active":""} key={value} onClick={()=>updateAngle(value)}>{mode==="degrees"?`${value}°`:RADIAN_LABELS[value]}</button>)}</div></section></div>
      <section className="angle-drag"><h3>Drag angle to rotate.</h3><output style={{left:`${angle/3.6}%`}}>{mode==="degrees"?`${angle}°`:radianLabel}</output><input aria-label="Angle slider drag control" type="range" min="0" max="360" step="1" value={angle} onChange={(event)=>updateAngle(Number(event.target.value))}/><footer><span>0°</span><span>360°</span></footer></section>
    </section>
    <nav className="angle-neighbors"><a href="/lessons/core-workspaces/22-integer-sliders">←<span><small>PREVIOUS</small><b>Integer Sliders</b></span></a><a href="/lessons/core-workspaces/24-animation-controls"><span><small>NEXT</small><b>Animation Controls</b></span>→</a></nav>
    <footer className="angle-footer"><b><Sparkles/>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><button type="button" onClick={touch}>Sitemap</button><button type="button" onClick={touch}>Docs</button><button type="button" onClick={touch}>About</button></nav></footer>
  </div>;
}

function UnitCircle({angle,cos,sin,onAngle}:{angle:number;cos:number;sin:number;onAngle:(value:number)=>void}) {
  const svg=useRef<SVGSVGElement>(null), dragging=useRef(false), center={x:155,y:155}, radius=112;
  const point={x:center.x+radius*cos,y:center.y-radius*sin};
  const update=(event:ReactPointerEvent<SVGSVGElement>)=>{const matrix=svg.current?.getScreenCTM();if(!matrix)return;const p=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());let next=Math.atan2(center.y-p.y,p.x-center.x)*180/Math.PI;if(next<0)next+=360;onAngle(next);};
  return <svg ref={svg} viewBox="0 0 330 310" role="img" aria-label="Draggable angle unit circle" onPointerMove={event=>{if(dragging.current)update(event);}} onPointerUp={()=>{dragging.current=false;}}><line className="axis" x1="24" y1="155" x2="310" y2="155"/><line className="axis" x1="155" y1="20" x2="155" y2="292"/><circle className="circle" cx="155" cy="155" r="112"/><line className="projection" x1={point.x} y1={point.y} x2="155" y2={point.y}/><line className="ray" x1="155" y1="155" x2={point.x} y2={point.y}/><path className="arc" d={`M 202 155 A 47 47 0 ${angle>180?1:0} 0 ${155+47*Math.cos(radians(angle))} ${155-47*Math.sin(radians(angle))}`}/><circle data-testid="angle-circle-handle" className="handle" cx={point.x} cy={point.y} r="7" onPointerDown={event=>{dragging.current=true;event.currentTarget.setPointerCapture(event.pointerId);}}/><text className="point" x={Math.min(point.x+14,245)} y={Math.max(point.y-10,25)}>P({format(cos)}, {format(sin)})</text><text x="216" y="137">{angle}°</text><text x="303" y="150">1 → x</text><text x="148" y="18">y</text><text x="139" y="171">0</text><text x="139" y="39">1</text><text x="139" y="299">-1</text><text x="25" y="171">-1</text></svg>;
}
function SineWave({angle,sin}:{angle:number;sin:number}) {const path=useMemo(()=>Array.from({length:73},(_,i)=>{const degree=i*5,x=28+degree*.72,y=145-Math.sin(degree*Math.PI/180)*92;return `${i?"L":"M"}${x.toFixed(1)},${y.toFixed(1)}`;}).join(" "),[]);const x=28+angle*.72,y=145-sin*92;return <svg viewBox="0 0 320 310" role="img" aria-label={`Sine wave marker at ${angle} degrees`}><line className="axis" x1="28" y1="145" x2="302" y2="145"/><line className="axis" x1="28" y1="28" x2="28" y2="275"/><path className="wave" d={path}/><line className="guide" x1={x} y1="35" x2={x} y2="260"/><line className="guide" x1="28" y1={y} x2={x} y2={y}/><circle className="probe" cx={x} cy={y} r="7"/><rect className="label-box" x={Math.min(x+14,205)} y={Math.max(y-35,20)} width="108" height="32" rx="7"/><text className="label" x={Math.min(x+23,214)} y={Math.max(y-14,41)}>sin(theta)={format(sin)}</text><text className="degree" x={x-10} y="272">{angle}°</text>{[0,90,180,270,360].map(value=><text className="tick" key={value} x={23+value*.72} y="164">{value}°</text>)}{[-1,-.5,.5,1].map(value=><text className="tick" key={value} x="5" y={149-value*92}>{value}</text>)}</svg>;}
function radians(value:number){return value*Math.PI/180;}

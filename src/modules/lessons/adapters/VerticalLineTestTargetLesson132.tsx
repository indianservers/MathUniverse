import { useEffect, useRef, useState, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleX, Expand, Info, Languages, RotateCcw, Share2, Sparkles, TriangleAlert } from "lucide-react";
import type { LessonAdapterProps } from "../types";
import "./VerticalLineTestTargetLesson132.css";
import "./VerticalLineTestTargetLesson132Tuning.css";

type Relation = "circle" | "parabola" | "sideways";

const clean = (value: number) => Math.abs(value) < 0.0001 ? "0" : Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
const relationLabel = (relation: Relation, radius: number) => relation === "circle" ? `x² + y² = ${clean(radius ** 2)}` : relation === "parabola" ? "y = x²" : "x = y²";

function relationState(relation: Relation, testX: number, radius: number) {
  if (relation === "circle") {
    if (Math.abs(testX) > radius) return { hits: 0, values: [] as number[], passes: false };
    const y = Math.sqrt(Math.max(0, radius ** 2 - testX ** 2));
    return { hits: y < 0.0001 ? 1 : 2, values: y < 0.0001 ? [0] : [y, -y], passes: false };
  }
  if (relation === "parabola") return { hits: 1, values: [testX ** 2], passes: true };
  if (testX < 0) return { hits: 0, values: [], passes: false };
  const y = Math.sqrt(testX);
  return { hits: y < 0.0001 ? 1 : 2, values: y < 0.0001 ? [0] : [y, -y], passes: false };
}

function ScannerGraph({ relation, radius, testX, onTestX }: { relation: Relation; radius: number; testX: number; onTestX: (value: number) => void }) {
  const svg = useRef<SVGSVGElement>(null);
  const [dragging, setDragging] = useState(false);
  const px = (x: number) => 211 + x * 50;
  const py = (y: number) => 239 - y * 51;
  const current = relationState(relation, testX, radius);
  const move = (event: PointerEvent<SVGSVGElement>) => {
    const box = svg.current?.getBoundingClientRect(); if (!box) return;
    const raw = ((((event.clientX - box.left) / box.width) * 430) - 211) / 50;
    onTestX(Math.max(-4.5, Math.min(4.5, Math.round(raw * 2) / 2)));
  };
  const upright = Array.from({ length: 101 }, (_, index) => { const x = -2.1 + index * .042; return `${index ? "L" : "M"}${px(x)},${py(x * x)}`; }).join(" ");
  const sidewaysTop = Array.from({ length: 101 }, (_, index) => { const y = index * .04; return `${index ? "L" : "M"}${px(y * y)},${py(y)}`; }).join(" ");
  const sidewaysBottom = Array.from({ length: 101 }, (_, index) => { const y = index * .04; return `${index ? "L" : "M"}${px(y * y)},${py(-y)}`; }).join(" ");
  return <svg ref={svg} className="vlt132-graph" viewBox="0 0 430 470" role="img" aria-label="Vertical-line test relation graph" onPointerMove={(event)=>dragging&&move(event)} onPointerUp={()=>setDragging(false)} onPointerLeave={()=>setDragging(false)}>
    <defs><pattern id="vlt132-grid" width="50" height="51" patternUnits="userSpaceOnUse"><path d="M50 0H0V51" fill="none" stroke="#dce7ed" strokeWidth="1" strokeDasharray="3 3"/></pattern><marker id="vlt132-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10Z" fill="#52627a"/></marker></defs>
    <rect x="15" y="15" width="400" height="430" fill="url(#vlt132-grid)"/>
    <line x1="16" x2="414" y1={py(0)} y2={py(0)} className="axis" markerEnd="url(#vlt132-arrow)"/><line x1={px(0)} x2={px(0)} y1="444" y2="17" className="axis" markerEnd="url(#vlt132-arrow)"/>
    {[-3,-2,-1,0,1,2,3].map((x)=><text key={`x${x}`} x={px(x)} y={py(0)+24}>{x}</text>)}{[-3,-2,-1,1,2,3].map((y)=><text key={`y${y}`} x={px(0)-17} y={py(y)+5}>{y}</text>)}<text x="408" y={py(0)+8} className="xy">x</text><text x={px(0)+15} y="28" className="xy">y</text>
    {relation==="circle"?<circle cx={px(0)} cy={py(0)} r={radius*48} className="relation"/>:relation==="parabola"?<path d={upright} className="relation"/>:<><path d={sidewaysTop} className="relation"/><path d={sidewaysBottom} className="relation"/></>}
    <line x1={px(testX)} x2={px(testX)} y1="-8" y2="459" className="scanner" role="slider" tabIndex={0} aria-label="Drag vertical test line" aria-valuemin={-4.5} aria-valuemax={4.5} aria-valuenow={testX} aria-valuetext={`x equals ${clean(testX)}`} onPointerDown={(event)=>{event.currentTarget.setPointerCapture(event.pointerId);setDragging(true);}} onKeyDown={(event)=>{if(event.key==="ArrowLeft")onTestX(Math.max(-4.5,testX-.5));if(event.key==="ArrowRight")onTestX(Math.min(4.5,testX+.5));}}/>
    {current.values.filter((y)=>Math.abs(y)<=4.35).map((y,index)=><g key={`${y}-${index}`} className="intersection"><circle cx={px(testX)} cy={py(y)} r="7"/><rect x={px(testX)+14} y={py(y)-28} width="67" height="36" rx="8"/><text x={px(testX)+47} y={py(y)-6}>({clean(testX)}, {clean(y)})</text></g>)}
  </svg>;
}

function ComparisonGraph({ relation }: { relation: "parabola" | "sideways" }) {
  return <svg viewBox="0 0 210 160" aria-label={relation === "parabola" ? "Passing parabola comparison" : "Failing sideways parabola comparison"}><line x1="18" x2="200" y1="105" y2="105"/><line x1="105" x2="105" y1="148" y2="10"/>{relation==="parabola"?<path d="M44 24Q105 184 166 24"/>:<path d="M20 105Q130 12 198 38M20 105Q130 198 198 172"/>}<line className={relation==="parabola"?"pass-line":"fail-line"} x1={relation==="parabola"?166:170} x2={relation==="parabola"?166:170} y1="14" y2="149"/>{relation==="sideways"&&<><circle cx="170" cy="38" r="5"/><circle cx="170" cy="172" r="5"/></>}</svg>;
}

export default function VerticalLineTestTargetLesson132({ resetToken, onInteraction }: LessonAdapterProps) {
  const [relation,setRelation]=useState<Relation>("circle"),[testX,setTestX]=useState(0),[tab,setTab]=useState("Interaction + visualization"),[language,setLanguage]=useState("English (English)"),[actions,setActions]=useState(0),[shared,setShared]=useState(false),[workspace,setWorkspace]=useState(false),[fullscreen,setFullscreen]=useState(false),[tryIndex,setTryIndex]=useState(0); const radius=3;
  const current=relationState(relation,testX,radius), label=relationLabel(relation,radius);
  const act=()=>{setActions((value)=>value+1);onInteraction();};
  const reset=()=>{setRelation("circle");setTestX(0);setTab("Interaction + visualization");setLanguage("English (English)");setActions(0);setShared(false);setWorkspace(false);setFullscreen(false);setTryIndex(0);onInteraction();}; useEffect(()=>reset(),[resetToken]); // eslint-disable-line react-hooks/exhaustive-deps
  const changeX=(value:number)=>{setTestX(value);act();};
  const chooseRelation=(next:Relation)=>{setRelation(next);setTestX(next==="sideways"?4:0);act();};
  const values=current.values.map(clean), verdict=current.passes?"Passes vertical-line test → function.":"Fails vertical-line test → not a function.";
  return <div className={`vlt132-page ${fullscreen?"fullscreen":""}`} data-testid="graph-mockup-0189" data-dedicated-lesson="132" data-object-model="editable-vertical-line-scanner-circle-parabola-sideways-relation-pointer-keyboard-draggable-test-line-generated-intersections-hit-count-global-function-classification-linked-reasoning-comparison-model" data-relation={relation} data-radius={radius} data-test-x={testX} data-hits={current.hits} data-hit-values={values.join(",")} data-passes={current.passes} data-actions={actions} data-direct-interaction="true">
    <nav className="vlt132-breadcrumb"><a href="/">←</a><a href="/">Home</a><span>&gt;</span><a href="/lessons">Lessons</a><span>&gt;</span><a href="/lessons/graphs-and-functions">Graphs And Functions</a><span>&gt;</span><b>132 Vertical Line Test</b></nav>
    <header className="vlt132-intro"><small><b>GRAPHS AND FUNCTIONS</b><b>FUNCTIONS</b></small><h1>Vertical-Line Test</h1><p>Classify relations as functions.</p><nav><b>♙ Intermediate-Advanced</b><b>ϟ Graph Explorer</b><b>▣ Graphing Calculator</b><b>◷ 6-10 min</b></nav><div><label><Languages/><select aria-label="Vertical line test language" value={language} onChange={(event)=>{setLanguage(event.target.value);act();}}><option>English (English)</option><option>Hindi (हिन्दी)</option></select><ChevronDown/></label><button onClick={reset}><RotateCcw/>Reset</button><button onClick={()=>{setShared(true);act();}}><Share2/>{shared?"Link ready":"Share"}</button><button onClick={()=>{setWorkspace((value)=>!value);act();}}>↗ {workspace?"Close workspace":"Workspace"}</button></div></header>
    <nav className="vlt132-tabs">{["Interaction + visualization","Explain","Examples","Formulas","Know more"].map((name)=><button key={name} className={tab===name?"active":""} onClick={()=>{setTab(name);if(name==="Examples"){setRelation("parabola");setTestX(2);}act();}}>{name}</button>)}</nav>
    <section className="vlt132-lab"><header><div><small>INTERACTION + VISUALIZATION</small><h2>Vertical-Line Scanner</h2><p>Move the vertical line to test the relation <i>{label}</i>.</p></div><nav><b className={current.passes?"passes":"fails"}>{current.passes?<Check/>:<CircleX/>}{current.passes?"Passes":"Fails"} vertical-line test</b><span>{current.hits} {current.hits===1?"hit":"hits"}</span><button aria-label="Expand vertical line scanner" onClick={()=>{setFullscreen((value)=>!value);act();}}><Expand/></button></nav></header>
      <div className="vlt132-layout"><main className="vlt132-main"><article className="vlt132-plot"><b>{label}</b><ScannerGraph relation={relation} radius={radius} testX={testX} onTestX={changeX}/><section><div><h3>Vertical test line</h3><p>Drag or slide to choose an x-value.</p><strong>x = {clean(testX)}</strong><input aria-label="Vertical test line position" type="range" min="-4.5" max="4.5" step=".5" value={testX} onChange={(event)=>changeX(Number(event.target.value))}/><small><span>-5</span><span>{clean(testX)}</span><span>5</span></small></div><aside><b>Intersections</b><strong>{current.hits}</strong><span>{current.hits===1?"hit":"hits"}</span></aside></section></article>
        <article className={`vlt132-result ${current.passes?"pass":"fail"}`}>{current.passes?<Check/>:<CircleX/>}<div><h3>{verdict}</h3><p>{current.hits===0?`At x = ${clean(testX)}, the line does not hit this relation.`:current.hits===1?`At x = ${clean(testX)}, the vertical line hits at y = ${values[0]}.`:`At x = ${clean(testX)}, the vertical line hits the relation at two points: y = ${values[0]} and y = ${values[1]}.`}</p></div></article>
        <article className="vlt132-why"><Info/><div><h3>Why?</h3><p>{current.passes?"Every input has exactly one output on this relation. Each vertical line can hit at most once.":relation==="circle"?`One input (x = ${clean(testX)}) can produce ${current.hits===2?"two different outputs":"two outputs at another position"}. A function cannot assign two outputs to the same input.`:"For positive x-values, the relation gives both a positive and a negative y-value."}</p></div></article>
      </main><aside className="vlt132-rail"><section className="vlt132-steps"><h3>How the vertical-line test works</h3>{[["Pick an x-value.","Choose a position on the x-axis."],["Draw a vertical line.",`Draw the line x = ${clean(testX)} through your chosen x-value.`],["Count intersections.",`The current line has ${current.hits} ${current.hits===1?"hit":"hits"}.`],["Decide.","If every vertical line hits at most once, it’s a function."]].map((item,index)=><p key={item[0]}><i>{index+1}</i><span><b>{item[0]}</b><small>{item[1]}</small></span></p>)}<article><TriangleAlert/><span><b>TWO_OUTPUTS</b><small>If one input has two outputs, the relation is not a function.</small></span></article></section>
        <section className="vlt132-compare"><h3>Compare &amp; Learn</h3><button className={relation==="parabola"?"active":""} onClick={()=>chooseRelation("parabola")}><b><Check/>Passes: y = x²</b><ComparisonGraph relation="parabola"/><span>Any vertical line hits the parabola exactly once. Function.</span></button><button className={relation==="sideways"?"active":""} onClick={()=>chooseRelation("sideways")}><b><CircleX/>Fails: x = y²</b><ComparisonGraph relation="sideways"/><span>At x = 4, the line hits at y = 2 and y = −2. Not a function.</span></button></section>
        <section className="vlt132-try"><Sparkles/><div><h3>Try it!</h3><p>Move the slider to different x-values and see how the number of hits changes.</p><button onClick={()=>{const values=[0,2,3,4,-4],next=(tryIndex+1)%values.length;setTryIndex(next);setTestX(values[next]);act();}}>Next x-value</button></div></section>
      </aside></div></section>
    <nav className="vlt132-adjacent"><a href="/lessons/graphs-and-functions/131-function-notation"><ArrowLeft/><span><small>PREVIOUS</small>Function Notation</span></a><a href="/lessons/graphs-and-functions/133-linear-functions"><span><small>NEXT</small>Linear Functions</span><ArrowRight/></a></nav><footer className="vlt132-footer"><b><Sparkles/>Math Universe</b><span>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</span><nav><a href="/sitemap">Sitemap</a><a href="/docs">Docs</a><a href="/about">About</a></nav><hr/><small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.</small><small>www.IndianServers.com · info@IndianServers.com</small></footer>
  </div>;
}

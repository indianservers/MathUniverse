import { Eye, Info, Lightbulb, LockKeyhole, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import { LessonCartesianGraph } from "../graphs/LessonCartesianGraph";
import "./IntegerSlidersTargetLesson22.css";

const VIEWS = ["Interaction + visualization", "Explain", "Examples", "Formulas", "Know more"];
const INTEGER_VALUES = Array.from({ length: 11 }, (_, index) => index - 5);
const INTEGER_POINTS = INTEGER_VALUES.map(x=>({x,y:2*x+3}));
const STEP_POINTS = INTEGER_VALUES.slice(0,-1).flatMap(x=>[{x,y:2*x+3},{x:x+1,y:2*x+3},{x:x+1,y:2*(x+1)+3}]);
// Exact extents of the original SVG's affine point mapping.
const GRAPH_VIEW = {xMin:-38/29.6-5,xMax:(360-38)/29.6-5,yMin:(204-250)/9,yMax:204/9};

export default function IntegerSlidersTargetLesson22({ resetToken, onInteraction }: LessonAdapterProps) {
  const [x, setX] = useState(3);
  const [view, setView] = useState(0);
  const [actions, setActions] = useState(0);
  const [graphView, setGraphView] = useState(GRAPH_VIEW);
  const y = 2 * x + 3;
  const setInteger = (value: number) => {
    setX(Math.max(-5, Math.min(5, Math.round(value))));
    setActions((count) => count + 1);
    onInteraction();
  };
  const selectView = (index: number) => { setView(index); setActions((count) => count + 1); onInteraction(); };
  useEffect(() => { setX(3); setView(0); setActions(0); setGraphView(GRAPH_VIEW); }, [resetToken]);

  return (
    <div className="integer-slider-page" data-testid="algebra-mockup-0022" data-dedicated-lesson="22" data-object-model="discrete-integer-snap-iteration-table-staircase-plot-linked-affine-calculation-model" data-x={x} data-y={y} data-view={view} data-actions={actions}>
      <nav className="integer-breadcrumb"><a href="/">←</a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/core-workspaces">Core Workspaces</a><span>›</span><b>22 Integer Sliders</b></nav>
      <header className="integer-header"><h1>Integer Sliders</h1><p>Explore discrete values and iteration.</p><div><b>♙ Foundational-Advanced</b><b>ϟ Exploration Lab</b><b>▣ Algebra View / Input Bar</b><b>◴ 6-10 min</b></div></header>
      <nav className="integer-tabs" aria-label="Lesson views">{VIEWS.map((label,index)=><button type="button" className={view===index?"active":""} key={label} onClick={()=>selectView(index)}>{index===0?<Eye/>:index===1?"▣":index===2?<Lightbulb/>:index===3?"∑":"✣"}<span>{label}</span></button>)}</nav>
      <main className="integer-main">
        <section className="integer-lab"><header><b>INTERACTIVE LAB</b><h2>Discrete integer slider</h2><p>Snap to whole numbers and see how y changes.</p></header>
          <div className="integer-range"><input aria-label="Integer slider x drag control" type="range" min="-5" max="5" step="1" value={x} onChange={(event)=>setInteger(Number(event.target.value))}/><output style={{ left: `${5.3+(x+5)*8.95}%` }}>{x}</output><div>{INTEGER_VALUES.map(value=><button type="button" key={value} aria-label={String(value)} aria-pressed={x===value} className={x===value?"active":""} onClick={()=>setInteger(value)}><i/><span>{value}</span></button>)}</div></div>
          <div className="integer-snap"><LockKeyhole />Snap to whole numbers</div>
          <section className="integer-calculation"><h3>Live calculation</h3><div><span><b>y = 2x + 3</b><small>Rule</small></span><em>→</em><span><b>y = 2({x})+3</b><small>Substitution (x = {x})</small></span><em>→</em><span><b>y = {y}</b><small>Result</small></span></div></section>
          <div className="integer-lower"><section className="integer-table"><h3>Iteration table</h3><div><b>Step</b><b>x</b><b>y = 2x + 3</b>{[0,1,2,3].map(value=><span className={x===value?"active":""} key={value}><i>{value}</i><i>{value}</i><i>{2*value+3}</i></span>)}</div><p><Info />Only integer values are allowed.</p></section>
            <LessonCartesianGraph title="Step plot" description={`Selected point (${x}, ${y})`}
              view={graphView} onViewChange={setGraphView} onResetView={()=>setGraphView(GRAPH_VIEW)}
              legend={[{id:"steps",label:"y = 2x + 3",color:"#087ad4"}]}
              series={[
                {id:"steps",label:"Integer steps",color:"#087ad4",points:STEP_POINTS},
                {id:"integers",label:"Integer values",color:"#087ad4",kind:"points",points:INTEGER_POINTS.filter(p=>p.x!==x)},
                {id:"x-guide",label:"x coordinate",color:"#f39a13",dashed:true,points:[{x,y:0},{x,y}]},
                {id:"y-guide",label:"y coordinate",color:"#f39a13",dashed:true,points:[{x:-5,y},{x,y}]},
              ]}
              annotations={[{id:"selected",x,y,label:`(${x}, ${y})`,color:"#f5a719",onChange:point=>setInteger(point.x),keyboardStep:1}]}/>
          </div>
        </section>
        <aside className="integer-side"><section><h2>Integer slider controls</h2><div className="integer-control-card"><h3>Integer slider</h3><p>Move between whole numbers only.</p><b><LockKeyhole />Snap to whole numbers</b><hr/><label>Current value</label><output>x = {x}</output><hr/><label>Step size</label><output>1</output></div><div className="integer-move"><h3>Move slider</h3><nav><button type="button" onClick={()=>setInteger(x-1)} disabled={x<=-5}>‹ <span>Previous<small>x = {Math.max(-5,x-1)}</small></span></button><button type="button" onClick={()=>setInteger(x+1)} disabled={x>=5}><span>Next<small>x = {Math.min(5,x+1)}</small></span> ›</button></nav></div><p className="integer-note"><Info />Only integer values<br/>are allowed.</p></section></aside>
      </main>
      <nav className="integer-neighbors"><a href="/lessons/core-workspaces/21-numeric-sliders">←<span><small>PREVIOUS</small><b>Numeric Sliders</b></span></a><a href="/lessons/core-workspaces/23-angle-sliders"><span><small>NEXT</small><b>Angle Sliders</b></span>→</a></nav>
      <footer className="integer-footer"><b><Sparkles />Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><button type="button" onClick={()=>selectView(0)}>Sitemap</button><button type="button" onClick={()=>selectView(1)}>Docs</button><button type="button" onClick={()=>selectView(2)}>About</button></nav></footer>
    </div>
  );
}


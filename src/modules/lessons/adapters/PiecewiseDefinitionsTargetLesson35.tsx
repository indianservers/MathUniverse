import { ExternalLink, RotateCcw, Share2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../types";
import { LessonCartesianGraph } from "../graphs/LessonCartesianGraph";
import "./PiecewiseDefinitionsTargetLesson35.css";

const clamp = (value: number) => Math.max(-5, Math.min(5, Math.round(value)));

export default function PiecewiseDefinitionsTargetLesson35({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [graphReset,setGraphReset]=useState(0);
  const [x, setX] = useState(1);
  const [language, setLanguage] = useState("English (English)");
  const [shareState, setShareState] = useState("Share");
  const [workspace, setWorkspace] = useState(false);
  const [actions, setActions] = useState(0);
  const leftActive = x < 0;
  const value = leftActive ? x + 3 : 2 * x;
  const branch = leftActive ? "left" : "right";

  const touch = () => {
    setActions((current) => current + 1);
    onInteraction();
  };
  const changeX = (next: number) => {
    setX(clamp(next));
    touch();
  };
  const reset = () => {
    setGraphReset(value=>value+1);
    setX(1);
    setLanguage("English (English)");
    setShareState("Share");
    setWorkspace(false);
    setActions(0);
    onInteraction();
  };
  useEffect(() => {
    setX(1);
    setLanguage("English (English)");
    setShareState("Share");
    setWorkspace(false);
    setActions(0);
  }, [resetToken]);

  const share = async () => {
    try {
      await navigator.clipboard?.writeText(`f(${x}) = ${value}`);
      setShareState("Copied");
    } catch {
      setShareState("Ready");
    }
    touch();
  };
  return (
    <div
      className="piecewise-page"
      data-testid="algebra-mockup-0035"
      data-dedicated-lesson="35"
      data-object-model="two-branch-piecewise-condition-endpoint-inclusion-evaluation-draggable-graph-probe-boundary-check-model"
      data-x={x}
      data-value={value}
      data-branch={branch}
      data-left-active={leftActive}
      data-workspace={workspace}
      data-actions={actions}
    >
      <nav className="piecewise-breadcrumb">
        <a href="/">&larr;</a>
        <a href="/">Home</a><span>&rsaquo;</span>
        <a href="/lessons">Lessons</a><span>&rsaquo;</span>
        <a href="/lessons/core-workspaces">Core Workspaces</a><span>&rsaquo;</span>
        <b>35 Piecewise Definitions</b>
      </nav>

      <section className="piecewise-shell">
        <header className="piecewise-header">
          <div>
            <h1>Piecewise Definitions</h1>
            <p>Model rule changes across intervals.</p>
            <nav>
              <b>♙ Foundational-Advanced</b>
              <b>ϟ Exploration Lab</b>
              <b>▣ Algebra View / Input Bar</b>
              <b>◷ 6-10 min</b>
            </nav>
          </div>
          <aside>
            <button
              type="button"
              aria-label="Lesson language"
              onClick={() => {
                setLanguage((current) => current.startsWith("English") ? "Hindi (हिन्दी)" : "English (English)");
                touch();
              }}
            >
              ⌁ {language}⌄
            </button>
            <button type="button" onClick={reset}><RotateCcw /> Reset</button>
            <button type="button" onClick={() => void share()}><Share2 /> {shareState}</button>
            <button
              type="button"
              className={workspace ? "active" : ""}
              onClick={() => {
                setWorkspace((current) => !current);
                touch();
              }}
            ><ExternalLink /> Workspace</button>
          </aside>
        </header>

        <main className="piecewise-layout">
          <section className="piecewise-left">
            <section className="piecewise-graph-card">
              <p className="eyebrow">PIECEWISE RULE</p>
              <div className="piecewise-rule" aria-label="Piecewise rule">
                <i>f (x) =</i><span className="brace">&#123;</span>
                <div><p>x + 3 <em>if x &lt; 0</em></p><p>2x <em>if x &gt;= 0</em></p></div>
              </div>
              <h2>Graph of <i>f (x)</i></h2>
              <PiecewiseGraph key={`${resetToken}-${graphReset}`} x={x} value={value} onProbe={changeX} />
              <footer className="branch-legend">
                <span className="blue-line" />
                <p><i>y = x + 3</i> for x &lt; 0<br />(open at (0,3))</p>
                <span className="purple-line" />
                <p><i>y = 2x</i> for x &gt;= 0<br />(closed at (0,0))</p>
              </footer>
            </section>

            <section className="boundary-card">
              <p className="eyebrow">CHECK THE BOUNDARIES</p>
              <div>
                <BoundaryCheck x={-1} />
                <BoundaryCheck x={0} />
                <BoundaryCheck x={1} />
              </div>
            </section>
          </section>

          <aside className="piecewise-side">
            <section className="explore-card">
              <p className="eyebrow">EXPLORE VALUES</p>
              <h2><i>x</i> = {x}</h2>
              <div className="slider-row">
                <button type="button" aria-label="Decrease x" onClick={() => changeX(x - 1)}>&minus;</button>
                <input aria-label="Piecewise x value" type="range" min="-5" max="5" step="1" value={x} onChange={(event) => changeX(Number(event.target.value))} />
                <button type="button" aria-label="Increase x" onClick={() => changeX(x + 1)}>+</button>
              </div>
              <div className="tick-row">{Array.from({ length: 11 }, (_, index) => <span key={index}>{index - 5}</span>)}</div>
              <output><i>f</i> ({x}) = {value}</output>
            </section>

            <section className="active-condition">
              <p className="eyebrow">ACTIVE CONDITION</p>
              <div>
                <strong><span /> {leftActive ? "x < 0" : "x >= 0"} is active</strong>
                <p>Using <i>f (x)</i> = {leftActive ? "x + 3" : "2x"} because {x} {leftActive ? "<" : ">="} 0.</p>
              </div>
            </section>

            <section className="select-branch">
              <p className="eyebrow">SELECT BRANCH</p>
              <button type="button" className={leftActive ? "selected blue" : "blue"} onClick={() => changeX(-1)}>
                <span className="radio" /><p><i>f (x)</i> = x + 3&nbsp; for x &lt; 0<small>Left branch (open at (0,3))</small></p>
              </button>
              <button type="button" className={!leftActive ? "selected purple" : "purple"} onClick={() => changeX(1)}>
                <span className="radio" /><p><i>f (x)</i> = 2x&nbsp; for x &gt;= 0<small>Right branch (closed at (0,0))</small></p>
              </button>
            </section>

            <section className="endpoint-card">
              <p className="eyebrow">ENDPOINT LEGEND</p>
              <div><span className="open-point" /><p><b>open circle</b><small>Point is not included.</small></p></div>
              <div><span className="closed-point" /><p><b>closed circle</b><small>Point is included.</small></p></div>
            </section>

            <section className="boundary-note"><TriangleAlert /><b>Boundary symbols decide<br />which point is filled.</b></section>
          </aside>
        </main>

        <nav className="piecewise-navigation">
          <a href="/lessons/core-workspaces/34-sequences">&larr;<span><small>PREVIOUS</small>Sequences</span></a>
          <a href="/lessons/core-workspaces/36-boolean-variables"><span><small>NEXT</small>Boolean Variables</span>&rarr;</a>
        </nav>
      </section>

      <footer className="piecewise-footer">
        <h2>✣ Math Universe</h2>
        <p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p>
        <nav><button type="button" onClick={touch}>▣ Sitemap</button><button type="button" onClick={touch}>⚑ Docs</button><button type="button" onClick={touch}>✉ About</button></nav>
        <hr />
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.<br /><br />www.IndianServers.com info@IndianServers.com</small>
      </footer>
    </div>
  );
}

function BoundaryCheck({ x }: { x: number }) {
  const left = x < 0;
  const value = left ? x + 3 : 2 * x;
  return <article>
    <h3><i>x</i> = {x}</h3>
    <p>{x === -1 ? "Since -1 < 0, use x + 3." : x === 0 ? "x = 0 uses 2x because 0 >= 0." : "Since 1 >= 0, use 2x."}</p>
    <strong><i>f</i> ({x}) = {left ? `(${x}) + 3` : `2(${x})`} = {value}</strong>
    <small>Uses {left ? "x + 3 because -1 < 0." : `2x because ${x} >= 0.`}</small>
  </article>;
}


const PIECEWISE_VIEW={xMin:-250/33,xMax:(530-250)/33,yMin:(180-370)/27,yMax:180/27};
function PiecewiseGraph({x,value,onProbe}:{x:number;value:number;onProbe:(x:number)=>void}) {
 const [view,setView]=useState(PIECEWISE_VIEW);
 return <LessonCartesianGraph title="Interactive piecewise function graph" description="Click or drag to explore x. The left endpoint is open; the right endpoint is closed." view={view} unitAspectRatio={33/27} onViewChange={setView} onResetView={()=>setView(PIECEWISE_VIEW)} onProbe={point=>onProbe(point.x)}
  series={[{id:'left',label:'y = x + 3 for x < 0',color:'#087bf0',points:[{x:-7,y:-4},{x:0,y:3}]},{id:'right',label:'y = 2x for x ≥ 0',color:'#7138d3',points:[{x:0,y:0},{x:3.5,y:7}]},{id:'guide',label:'Probe projection',color:'#94a3b8',dashPattern:'4 4',points:[{x,y:0},{x,y:value}]}]}
  annotations={[{id:'open',x:0,y:3,label:'(0, 3), excluded',color:'#087bf0',included:false},{id:'closed',x:0,y:0,label:'(0, 0), included',color:'#7138d3',included:true},{id:'probe',x,y:value,label:`f(${x}) = ${value}`,color:x<0?'#087bf0':'#7138d3',testId:'piecewise-probe',onChange:point=>onProbe(point.x),keyboardStep:1}]}/>;
}

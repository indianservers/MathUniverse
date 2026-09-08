import { ExternalLink, RotateCcw, Share2, TriangleAlert } from "lucide-react";
import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { LessonAdapterProps } from "../types";
import "./PiecewiseDefinitionsTargetLesson35.css";

const clamp = (value: number) => Math.max(-5, Math.min(5, Math.round(value)));

export default function PiecewiseDefinitionsTargetLesson35({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
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
  const updateFromGraph = (event: ReactPointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const graphX = ((event.clientX - rect.left) / rect.width) * 14 - 7;
    changeX(graphX);
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
              <PiecewiseGraph x={x} value={value} onProbe={updateFromGraph} />
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

function PiecewiseGraph({ x, value, onProbe }: { x: number; value: number; onProbe: (event: ReactPointerEvent<SVGSVGElement>) => void }) {
  const px = (input: number) => 250 + input * 33;
  const py = (input: number) => 180 - input * 27;
  return <svg
    className="piecewise-graph"
    viewBox="0 0 530 370"
    role="img"
    aria-label="Interactive piecewise function graph"
    onPointerDown={onProbe}
    onPointerMove={(event) => { if (event.buttons === 1) onProbe(event); }}
  >
    <defs><pattern id="piecewise-grid" width="33" height="27" patternUnits="userSpaceOnUse"><path d="M33 0H0V27" fill="none" stroke="#e9eef3" strokeWidth="1" /></pattern></defs>
    <rect x="10" y="10" width="500" height="340" fill="url(#piecewise-grid)" />
    <line x1="10" y1="180" x2="515" y2="180" className="axis" /><path d="M515 180l-9-5v10z" />
    <line x1="250" y1="350" x2="250" y2="5" className="axis" /><path d="M250 5l-5 9h10z" />
    {[-6,-4,-2,0,2,4,6].map((tick) => <g key={`x${tick}`}><line x1={px(tick)} y1="174" x2={px(tick)} y2="186" /><text x={px(tick)-8} y="201">{tick}</text></g>)}
    {[-6,-4,-2,2,4,6].map((tick) => <g key={`y${tick}`}><line x1="244" y1={py(tick)} x2="256" y2={py(tick)} /><text x="228" y={py(tick)+4}>{tick}</text></g>)}
    <text x="520" y="186" className="axis-label">x</text><text x="246" y="8" className="axis-label">y</text>
    <line x1={px(-7)} y1={py(-4)} x2={px(0)} y2={py(3)} className="left-branch" />
    <circle cx={px(0)} cy={py(3)} r="8" className="open-end" />
    <line x1={px(0)} y1={py(0)} x2={px(3.5)} y2={py(7)} className="right-branch" />
    <circle cx={px(0)} cy={py(0)} r="7" className="closed-end" />
    <text x="56" y="112" className="left-label">y = x + 3&nbsp; for x&lt;0</text>
    <text x="360" y="62" className="right-label">y = 2x&nbsp; for x&gt;=0</text>
    <line x1={px(x)} y1="180" x2={px(x)} y2={py(value)} className="probe-guide" />
    <circle cx={px(x)} cy={py(value)} r="7" className={x < 0 ? "probe left" : "probe right"} />
  </svg>;
}

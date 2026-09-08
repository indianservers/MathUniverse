import { CheckCircle2, RotateCcw, Share2, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../types";
import "./NumericSlidersTargetLesson21.css";

const PATTERN_VALUES = [-2, 0, 2, 4];
const STEPS = [0.1, 0.5, 1];

function decimalsFor(step: number) {
  return step < 1 ? 1 : 0;
}

function clean(value: number, step: number) {
  return Number(value.toFixed(decimalsFor(step)));
}

export default function NumericSlidersTargetLesson21({ resetToken, onInteraction }: LessonAdapterProps) {
  const [x, setX] = useState(2);
  const [minimum, setMinimum] = useState(-5);
  const [maximum, setMaximum] = useState(5);
  const [step, setStep] = useState(0.1);
  const [shareState, setShareState] = useState("Share");
  const [actions, setActions] = useState(0);
  const y = clean(2 * x + 3, step);
  const displayX = x.toFixed(decimalsFor(step)).replace(/\.0$/, "");
  const displayY = y.toFixed(decimalsFor(step)).replace(/\.0$/, "");
  const graphPoint = useMemo(() => ({ left: 50 + x * 8.4, top: 50 - y * 4.15 }), [x, y]);

  const touch = () => { setActions((value) => value + 1); onInteraction(); };
  const setValue = (value: number) => {
    const bounded = Math.max(minimum, Math.min(maximum, clean(value, step)));
    setX(bounded);
    touch();
  };
  const reset = () => {
    setX(2); setMinimum(-5); setMaximum(5); setStep(0.1); setShareState("Share"); setActions(0); onInteraction();
  };
  useEffect(() => { setX(2); setMinimum(-5); setMaximum(5); setStep(0.1); setShareState("Share"); setActions(0); }, [resetToken]);
  const updateMinimum = (value: number) => {
    const next = Math.min(value, maximum - step);
    setMinimum(next); setX((current) => Math.max(next, current)); touch();
  };
  const updateMaximum = (value: number) => {
    const next = Math.max(value, minimum + step);
    setMaximum(next); setX((current) => Math.min(next, current)); touch();
  };
  const updateStep = (value: number) => {
    setStep(value); setX((current) => clean(current, value)); touch();
  };
  const share = async () => {
    try { await navigator.clipboard?.writeText(`x = ${displayX}; y = 2(${displayX}) + 3 = ${displayY}`); setShareState("Copied"); }
    catch { setShareState("Ready"); }
    touch();
  };

  return (
    <div className="numeric-slider-page" data-testid="algebra-mockup-0021" data-dedicated-lesson="21" data-object-model="continuous-bounded-precision-slider-linked-substitution-pattern-coordinate-graph-model" data-x={x} data-y={y} data-min={minimum} data-max={maximum} data-step={step} data-actions={actions}>
      <nav className="numeric-breadcrumb"><a href="/">←</a><a href="/">Home</a><span>›</span><a href="/lessons">Lessons</a><span>›</span><a href="/lessons/core-workspaces">Core Workspaces</a><span>›</span><b>21 Numeric Sliders</b></nav>
      <section className="numeric-surface">
        <header className="numeric-header"><div><h1>Numeric Sliders</h1><p>Explore parameter changes dynamically.</p><span>Move <i>x</i> and watch every linked value update.</span></div><nav><button type="button" onClick={reset}><RotateCcw />Reset</button><button type="button" onClick={() => void share()}><Share2 />{shareState}</button></nav></header>
        <main className="numeric-main">
          <div className="numeric-left">
            <section className="numeric-slider-stage"><h2><i>1.</i> Move the slider</h2><div className="numeric-range-wrap"><output style={{ left: `${((x-minimum)/(maximum-minimum))*100}%` }}>x = {displayX}</output><input aria-label="Numeric slider x drag control" type="range" min={minimum} max={maximum} step={step} value={x} onChange={(event)=>setValue(Number(event.target.value))}/><div><span>{minimum}</span><span>-2</span><span>0</span><span>2</span><span>{maximum}</span></div></div><footer><span>Range: {minimum} to {maximum}</span><span>Step: {step}</span></footer></section>
            <section className="numeric-linked"><h2><i>2.</i> Linked outputs update live</h2><div className="numeric-link-row"><b>f(x)</b><span><small>Expression</small><strong>y = 2x + 3</strong></span></div><em>↓</em><div className="numeric-link-row"><b>=</b><span><small>Substitution</small><strong>y = 2(<mark>{displayX}</mark>) + 3</strong></span></div><em>↓</em><div className="numeric-link-row result"><b>{displayY}</b><span><small>Result</small><strong>y = {displayY}</strong></span></div></section>
            <section className="numeric-pattern"><h2><i>3.</i> See the pattern</h2><div><small>Try different values</small><nav>{PATTERN_VALUES.map((value)=><button type="button" className={Math.abs(x-value)<0.0001?"active":""} key={value} onClick={()=>setValue(value)}><b>x = {value}</b><span>→ {2*value+3}</span></button>)}</nav></div><p>As <i>x</i> increases by 1, <i>y</i> increases by 2.</p></section>
          </div>
          <aside className="numeric-right">
            <section className="numeric-control"><h2>Numeric slider</h2><label>Active value</label><output>x = {displayX}</output><small>Drag the handle to change <i>x</i></small><div className="numeric-stepper"><button type="button" aria-label="Decrease x" onClick={()=>setValue(x-step)}>‹</button><input aria-label="Current x value" type="number" value={x} min={minimum} max={maximum} step={step} onChange={(event)=>setValue(Number(event.target.value))}/><button type="button" aria-label="Increase x" onClick={()=>setValue(x+step)}>›</button></div><label>Range</label><div className="numeric-bounds"><span>Min<input aria-label="Minimum slider value" type="number" value={minimum} step={step} onChange={(event)=>updateMinimum(Number(event.target.value))}/></span><span>Max<input aria-label="Maximum slider value" type="number" value={maximum} step={step} onChange={(event)=>updateMaximum(Number(event.target.value))}/></span></div><label htmlFor="numeric-step">Step (precision)</label><select id="numeric-step" value={step} onChange={(event)=>updateStep(Number(event.target.value))}>{STEPS.map(value=><option key={value} value={value}>{value}</option>)}</select><p><CheckCircle2 /><b>Linked output</b><small>All dependent values update automatically.</small></p></section>
            <section className="numeric-graph"><h2><i>4.</i> Visual on the graph</h2><div className="numeric-plot"><strong>y = 2x + 3</strong><span className="axis x"/><span className="axis y"/><span className="line"/><span className="guide vertical" style={{left:`${graphPoint.left}%`,height:`${50-graphPoint.top}%`,top:`${graphPoint.top}%`}}/><span className="guide horizontal" style={{width:`${graphPoint.left-50}%`,left:"50%",top:`${graphPoint.top}%`}}/><i className="point" style={{left:`${graphPoint.left}%`,top:`${graphPoint.top}%`}}/><b className="point-label" style={{left:`${Math.min(graphPoint.left+2,69)}%`,top:`${Math.max(graphPoint.top+3,6)}%`}}>Point ({displayX}, {displayY})</b><label className="x-label">x</label><label className="y-label">y</label><small className="tick tx1">-5</small><small className="tick tx2">0</small><small className="tick tx3">5</small><small className="tick ty1">10</small><small className="tick ty2">5</small><small className="tick ty3">-5</small><small className="tick ty4">-10</small></div></section>
          </aside>
        </main>
        <nav className="numeric-neighbors"><a href="/lessons/core-workspaces/20-variable-explorer">←<span><small>Previous</small><b>Variable Explorer</b></span></a><a href="/lessons/core-workspaces/22-integer-sliders"><span><small>Next</small><b>Integer Sliders</b></span>→</a></nav>
      </section>
      <footer className="numeric-footer"><b><Sparkles />Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p><nav><button type="button" onClick={touch}>Sitemap</button><button type="button" onClick={touch}>Docs</button><button type="button" onClick={touch}>About</button></nav></footer>
    </div>
  );
}

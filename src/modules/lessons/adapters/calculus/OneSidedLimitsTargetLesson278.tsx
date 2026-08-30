import { ArrowLeft, ArrowRight, Info, Lightbulb, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./OneSidedLimitsTargetLesson278.css";
import "./OneSidedLimitsTargetLesson278Fit.css";

type Scenario = "jump" | "match" | "removable";
type ScenarioSpec = { label: string; left: number; right: number; defined: number | null };
const specs: Record<Scenario, ScenarioSpec> = {
  jump: { label: "Jump at x = 0", left: -1, right: 1, defined: null as number | null },
  match: { label: "Matching sides", left: 1, right: 1, defined: 1 },
  removable: { label: "Removable hole", left: 1, right: 1, defined: null as number | null },
};

export default function OneSidedLimitsTargetLesson278({ resetToken, onInteraction }: LessonAdapterProps) {
  const [scenario, setScenario] = useState<Scenario>("jump");
  const [leftX, setLeftX] = useState(-0.25);
  const [rightX, setRightX] = useState(0.25);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [tab, setTab] = useState("Interaction + visualization");
  const [actions, setActions] = useState(0);
  const spec = specs[scenario];
  const exists = spec.left === spec.right;
  const trace = useMemo(() => [1, .5, .1, .01, .001], []);
  const reset = () => { setScenario("jump"); setLeftX(-.25); setRightX(.25); setShowLeft(true); setShowRight(true); setTab("Interaction + visualization"); setActions(0); };
  useEffect(reset, [resetToken]);
  const act = (run:()=>void) => { run(); setActions(value=>value+1); onInteraction(); };
  return <section className="os278-page" data-testid="calculus-mockup-0357" data-dedicated-lesson="278" data-object-model="piecewise-one-sided-approach-independent-sliders-trace-verdict" data-scenario={scenario} data-left-x={leftX} data-right-x={rightX} data-left-limit={spec.left} data-right-limit={spec.right} data-exists={exists} data-show-left={showLeft} data-show-right={showRight} data-actions={actions}>
    <span className="sr-only">One-sided limits</span>
    <header className="os278-hero"><div><h1>One-Sided Limits</h1><p>Compare how the function behaves as x approaches 0 from the left and from the right.</p></div><div><span>♙ Advanced</span><span>⚡ Calculus Lab</span><span>▣ Derivative / Limit / CAS</span><span>◷ 6–10 min</span></div></header>
    <nav className="os278-tabs">{["Interaction + visualization","Explain","Examples","Formulas","Know more"].map(name=><button key={name} className={tab===name?"active":""} data-lesson-control={`tab-${name}`} onClick={()=>act(()=>setTab(name))}>{name}</button>)}</nav>
    <section className="os278-content"><main><header><h2>Compare what the graph does from each side</h2><p>Explore the function below. Drag the markers toward 0 from each side and observe the values.</p></header><label className="function">Function<select aria-label="Piecewise scenario" data-lesson-control="scenario" value={scenario} onChange={event=>act(()=>setScenario(event.target.value as Scenario))}><option value="jump">Jump at x = 0</option><option value="match">Matching sides</option><option value="removable">Removable hole</option></select></label><OneSidedGraph spec={spec} leftX={leftX} rightX={rightX} showLeft={showLeft} showRight={showRight}/><div className="os278-sliders"><label><b>x → 0⁻</b><input aria-label="Left approach distance" data-lesson-control="left-slider" type="range" min="-1" max="-0.01" step="0.01" value={leftX} onChange={event=>act(()=>setLeftX(Number(event.target.value)))}/><output>x = {leftX.toFixed(2)}</output></label><label><b>x → 0⁺</b><input aria-label="Right approach distance" data-lesson-control="right-slider" type="range" min="0.01" max="1" step="0.01" value={rightX} onChange={event=>act(()=>setRightX(Number(event.target.value)))}/><output>x = {rightX.toFixed(2)}</output></label></div><p className="note"><Info/>Open circles show the values approached. The function value at x = 0 is {spec.defined===null?"not defined":spec.defined}.</p><section className="trace"><h3>Numeric trace near 0</h3><table><thead><tr><th colSpan={2}>Approaching from left (x &lt; 0)</th><th>x</th><th colSpan={2}>Approaching from right (x &gt; 0)</th></tr><tr><th>x</th><th>f(x)</th><th></th><th>x</th><th>f(x)</th></tr></thead><tbody>{trace.map(value=><tr key={value}><td>{(-value).toFixed(value<.01?4:Math.max(1,-Math.floor(Math.log10(value))))}</td><td>{spec.left.toFixed(4)}</td><td>{-value}</td><td>{value.toFixed(value<.01?4:Math.max(1,-Math.floor(Math.log10(value))))}</td><td>{spec.right.toFixed(4)}</td></tr>)}</tbody></table></section></main><aside className="os278-side"><article className="limits"><h3>One-sided limits at x = 0</h3><div><b>Left-hand limit</b><output>lim x→0⁻ f(x) = <strong>{spec.left}</strong></output></div><div><b>Right-hand limit</b><output>lim x→0⁺ f(x) = <strong>{spec.right}</strong></output></div><div><b>Function value at 0</b><p>{spec.defined===null?"f(0) is not defined":`f(0) = ${spec.defined}`}</p><small>{spec.defined===null?"(open circles at the break)":"(filled point at the break)"}</small></div></article><article className={`verdict ${exists?"yes":"no"}`}><h3>Verdict</h3><b>{exists?"✓ values match — limit exists":"! values do not match — limit DNE"}</b><p>{exists?`The two-sided limit is ${spec.left}.`:"The two-sided limit does not exist."}</p></article><article className="display"><h3>Display controls</h3><label><input data-lesson-control="show-left" type="checkbox" checked={showLeft} onChange={()=>act(()=>setShowLeft(value=>!value))}/>Show left trace<small>Track values as x → 0⁻</small></label><label><input data-lesson-control="show-right" type="checkbox" checked={showRight} onChange={()=>act(()=>setShowRight(value=>!value))}/>Show right trace<small>Track values as x → 0⁺</small></label></article><article className="tip"><Lightbulb/><p>One-sided limits can exist even when the two-sided limit does not.</p></article><button className="reset" data-lesson-control="reset" onClick={()=>act(reset)}><RotateCcw/>Reset model</button><button className="share" data-lesson-control="share" onClick={()=>act(()=>navigator.clipboard?.writeText(`left=${spec.left}, right=${spec.right}, ${exists?"limit exists":"DNE"}`))}><Share2/>Share result</button></aside></section>
    <nav className="os278-nav"><a href="/lessons/calculus/277-informal-limits"><ArrowLeft/><span><small>Previous</small>Informal Limits</span></a><a href="/lessons/calculus/279-infinite-limits"><span><small>Next</small>Infinite Limits</span><ArrowRight/></a></nav>
  </section>;
}

function OneSidedGraph({
  spec,
  leftX,
  rightX,
  showLeft,
  showRight,
}: {
  spec: ScenarioSpec;
  leftX: number;
  rightX: number;
  showLeft: boolean;
  showRight: boolean;
}) {
  const width = 850;
  const height = 310;
  const scaleX = (x: number) => width / 2 + x * 82;
  const scaleY = (y: number) => height / 2 - y * 48;
  return (
    <svg
      className="os278-graph"
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Piecewise graph showing independent one-sided limits"
    >
      {Array.from({ length: 11 }, (_, index) => (
        <line key={`v${index}`} className="grid" x1={index * 85} y1="0" x2={index * 85} y2={height} />
      ))}
      {Array.from({ length: 7 }, (_, index) => (
        <line key={`h${index}`} className="grid" x1="0" y1={index * 52} x2={width} y2={index * 52} />
      ))}
      <line className="axis" x1="0" y1={scaleY(0)} x2={width} y2={scaleY(0)} />
      <line className="axis" x1={scaleX(0)} y1="0" x2={scaleX(0)} y2={height} />
      {showLeft && (
        <g>
          <line x1="0" y1={scaleY(spec.left)} x2={scaleX(0)} y2={scaleY(spec.left)} stroke="#7340df" strokeWidth="4" />
          <circle cx={scaleX(0)} cy={scaleY(spec.left)} r="7" fill="white" stroke="#7340df" strokeWidth="2" />
          <circle cx={scaleX(leftX)} cy={scaleY(spec.left)} r="7" fill="#7340df" />
          <text x="130" y={scaleY(spec.left) - 16} fill="#7340df">approach from left →</text>
        </g>
      )}
      {showRight && (
        <g>
          <line x1={scaleX(0)} y1={scaleY(spec.right)} x2={width} y2={scaleY(spec.right)} stroke="#05a8c8" strokeWidth="4" />
          <circle cx={scaleX(0)} cy={scaleY(spec.right)} r="7" fill="white" stroke="#05a8c8" strokeWidth="2" />
          <circle cx={scaleX(rightX)} cy={scaleY(spec.right)} r="7" fill="#05a8c8" />
          <text x={scaleX(0) + 75} y={scaleY(spec.right) + 32} fill="#05a8c8">← approach from right</text>
        </g>
      )}
      {spec.defined !== null && <circle cx={scaleX(0)} cy={scaleY(spec.defined)} r="6" fill="#132342" />}
      <text x={width - 15} y={scaleY(0) - 8}>x</text>
      <text x={scaleX(0) + 10} y="15">y</text>
    </svg>
  );
}

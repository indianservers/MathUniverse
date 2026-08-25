import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Eye,
  Hand,
  Languages,
  Lightbulb,
  RotateCcw,
  Share2,
  Sparkles,
  Target,
  Trophy,
  TriangleAlert,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";
import "./TrigIdentitiesTargetLesson266.css";

type Stage = "explore" | "explain" | "examples" | "practice" | "formulas" | "know";
type PracticeResult = "idle" | "correct" | "incorrect";

const INITIAL_ANGLE = 60;

export default function TrigIdentitiesTargetLesson266({ resetToken, onInteraction }: LessonAdapterProps) {
  const [angle, setAngle] = useState(INITIAL_ANGLE);
  const [stage, setStage] = useState<Stage>("explore");
  const [autoVerify, setAutoVerify] = useState(true);
  const [practiceAnswer, setPracticeAnswer] = useState("csc θ");
  const [practiceResult, setPracticeResult] = useState<PracticeResult>("idle");
  const [stepsShown, setStepsShown] = useState(false);
  const [openChallenge, setOpenChallenge] = useState<number | null>(null);
  const model = useMemo(() => identityModel(angle), [angle]);

  useEffect(() => {
    setAngle(INITIAL_ANGLE);
    setStage("explore");
    setAutoVerify(true);
    setPracticeAnswer("csc θ");
    setPracticeResult("idle");
    setStepsShown(false);
    setOpenChallenge(null);
  }, [resetToken]);

  const updateAngle = (value: number) => {
    setAngle(clamp(value, -360, 360));
    onInteraction();
  };
  const reset = () => {
    setAngle(INITIAL_ANGLE);
    setStage("explore");
    setAutoVerify(true);
    setPracticeAnswer("csc θ");
    setPracticeResult("idle");
    setStepsShown(false);
    setOpenChallenge(null);
    onInteraction();
  };
  const chooseStage = (next: Stage) => {
    setStage(next);
    const selector = next === "explore" ? ".target-identities-lab" : next === "explain" || next === "formulas" || next === "know" ? ".target-identities-rule" : next === "examples" ? ".target-identities-worked" : ".target-identities-practice";
    document.querySelector(selector)?.scrollIntoView({ behavior: "smooth" });
    onInteraction();
  };
  const grade = () => {
    setPracticeResult(normalize(practiceAnswer) === "csctheta" ? "correct" : "incorrect");
    onInteraction();
  };

  return <section className="target-identities-page" data-testid="trigonometry-mockup-0323" data-dedicated-lesson="266" data-object-model="unit-circle-symbolic-transformation-numerical-identity-verification-model" data-angle={angle.toFixed(6)} data-sin={model.sin.toFixed(6)} data-cos={model.cos.toFixed(6)} data-lhs={model.tan === null ? "undefined" : model.tan.toFixed(6)} data-rhs={model.rhs === null ? "undefined" : model.rhs.toFixed(6)} data-difference={model.difference === null ? "undefined" : model.difference.toFixed(9)} data-defined={model.defined} data-stage={stage} data-auto-verify={autoVerify} data-practice-result={practiceResult} data-steps-shown={stepsShown} data-open-challenge={openChallenge ?? "none"}>
    <header className="target-identities-header"><div><section><span>Trigonometry</span><span>Trigonometry</span></section><h1>Trig Identities</h1><p>Verify equivalent expressions.</p><footer><b>♙ Intermediate–Advanced</b><b>ϟ Visual Lab</b><b>▣ Trig Graphing / Geometry</b><b>◷ 6–10 min</b></footer></div><aside><label><Languages/><select aria-label="Lesson language" defaultValue="en" onChange={onInteraction}><option value="en">English (English)</option><option value="hi">हिन्दी (Hindi)</option></select></label><div><button type="button" onClick={reset}><RotateCcw/>Reset</button><button type="button" onClick={()=>{void navigator.clipboard?.writeText(`tan(${angle}°) = sin(${angle}°)/cos(${angle}°)`);onInteraction();}}><Share2/>Share</button></div><button type="button" onClick={()=>{document.querySelector(".target-identities-lab")?.scrollIntoView({behavior:"smooth"});onInteraction();}}>↗ Workspace</button></aside></header>

    <nav className="target-identities-tabs">{[["explore","◉","Explore & Verify"],["explain","▣","Explain"],["examples","▣","Examples"],["practice","⌘","Practice"],["formulas","∑","Formulas"],["know","✣","Know more"]].map(([key,icon,label])=><button key={key} type="button" className={stage===key?"active":""} onClick={()=>chooseStage(key as Stage)}><i>{icon}</i>{label}</button>)}</nav>

    <section className="target-identities-lab"><header><Flow icon={Eye} number="1" title="Observe">See the angle on the unit circle.</Flow><Flow icon={Hand} number="2" title="Manipulate">Transform the left side.</Flow><Flow icon={Lightbulb} number="3" title="Notice">Compare both sides.</Flow><Flow icon={Target} number="4" title="Understand">Recognize the identity.</Flow></header><div>
      <article className="target-identities-circle"><h2>θ = {formatAngle(angle)} <small>({radianLabel(angle)} rad)</small></h2><IdentityCircle angle={angle} onAngle={updateAngle}/><div><span>cosθ = <b>{exactCos(angle)}</b></span><span>sinθ = <b>{exactSin(angle)}</b></span><span>tanθ = <b>{exactTan(angle)}</b></span></div><footer><b>Quadrant: {model.quadrant}</b><b>Signs: sin {sign(model.sin)}, cos {sign(model.cos)}, tan {model.tan===null?"undefined":sign(model.tan)}</b><b>Domain: {model.defined?"All real θ":"Excluded"}</b></footer></article>
      <article className="target-identities-proof"><h2>Justified Identity Transformation</h2><h3>Prove: &nbsp; tanθ = <Fraction top="sinθ" bottom="cosθ"/></h3><div className="target-identities-proof-table"><b>Step</b><b>Reason</b><span>1 &nbsp;&nbsp; tanθ</span><span>Starting LHS</span><span>2 &nbsp;&nbsp; = <Fraction top="sinθ" bottom="cosθ"/></span><span>Definition of tanθ</span><span>3 &nbsp;&nbsp; = <Fraction top={exactSin(angle)} bottom={exactCos(angle)}/></span><span>Substitute values</span><span>4 &nbsp;&nbsp; = {exactTan(angle)}</span><span>Simplify</span></div><footer><CheckCircle2/><h3>Identity Verified!<small>LHS = RHS = {model.tan===null?"undefined":exactTan(angle)}</small></h3></footer></article>
      <article className="target-identities-numeric"><header><h2>Numerical Verification</h2><label>Auto <input aria-label="Automatic verification" type="checkbox" checked={autoVerify} onChange={(event)=>{setAutoVerify(event.target.checked);onInteraction();}}/><i/></label></header><h3>Evaluate both sides for θ = {formatAngle(angle)}</h3><div><section><b>LHS: tanθ</b><p>= {exactTan(angle)}</p><p>≈ {model.tan===null?"undefined":model.tan.toFixed(5)}</p></section><section><b>RHS: <Fraction top="sinθ" bottom="cosθ"/></b><p>= <Fraction top={exactSin(angle)} bottom={exactCos(angle)}/></p><p>= {exactTan(angle)}</p><p>≈ {model.rhs===null?"undefined":model.rhs.toFixed(5)}</p></section></div><footer><small>Difference</small><b>|LHS − RHS| ≈ {model.difference===null?"undefined":model.difference.toFixed(0)}</b><span>(within rounding error)</span></footer><aside><h3>Change angle θ <output>{formatAngle(angle)}</output></h3><input aria-label="Identity angle" type="range" min="-360" max="360" step="1" value={angle} onChange={(event)=>updateAngle(Number(event.target.value))}/><div><span>−360°</span><span>360°</span></div></aside></article>
    </div></section>

    <section className="target-identities-notice"><Lightbulb/><p>Both expressions give the same value for any angle (where cosθ ≠ 0). Hence, &nbsp; <b>tanθ = <Fraction top="sinθ" bottom="cosθ"/></b> &nbsp; is an identity.</p></section>

    <section className="target-identities-learning"><article className="target-identities-rule"><h2><BookOpen/>Rule / Formula</h2><p>Identity (True for all θ where defined)</p><div>tanθ = <Fraction top="sinθ" bottom="cosθ"/></div><footer>Domain: &nbsp; cosθ ≠ 0 &nbsp; → &nbsp; θ ≠ 90° + 180°k, &nbsp; k ∈ Z</footer></article><article className="target-identities-misconception"><h2><TriangleAlert/>Common Misconception</h2><p>Do not cancel sinθ or cosθ across a sum or difference.</p><div><b>Wrong:</b> &nbsp; sin²θ + cos²θ = 1 &nbsp; ⇒ &nbsp; sinθ + cosθ = 1 &nbsp; <strong>×</strong></div><footer><b>Right:</b> &nbsp; sin²θ + cos²θ = 1 &nbsp; is an identity.<br/>But &nbsp; sinθ + cosθ ≠ 1 &nbsp; (not true for most θ).</footer></article>
      <article className="target-identities-worked"><h2><CheckCircle2/>Worked Example</h2><h3>Verify the identity: &nbsp; (1 + tan²θ) cos²θ = 1</h3><div><section><p>LHS &nbsp; = &nbsp; (1 + tan²θ) cos²θ</p><p>= &nbsp; (1 + (<Fraction top="sinθ" bottom="cosθ"/>)²) cos²θ</p><p>= &nbsp; (1 + <Fraction top="sin²θ" bottom="cos²θ"/>) cos²θ</p><p>= &nbsp; <Fraction top="cos²θ + sin²θ" bottom="cos²θ"/> · cos²θ</p><p>= &nbsp; sin²θ + cos²θ</p><p>= &nbsp; 1</p></section><aside><span>Definition of tanθ</span><span>Simplify</span><span>Common denominator</span><span>Cancel cos²θ (cosθ ≠ 0)</span><span>Pythagorean identity</span></aside></div><footer>Hence, &nbsp; (1 + tan²θ) cos²θ = 1</footer></article>
      <article className="target-identities-practice"><h2><Trophy/>Practice Challenge</h2><h3>1. Verify the identity using the workspace.</h3><label>sinθ (1 + cot²θ) = <input aria-label="Identity practice answer" value={practiceAnswer} onChange={(event)=>{setPracticeAnswer(event.target.value);setPracticeResult("idle");setStepsShown(false);onInteraction();}}/></label><div className="target-identities-hints"><b>Hints</b><p>• Use cotθ = <Fraction top="cosθ" bottom="sinθ"/> and cscθ = <Fraction top="1" bottom="sinθ"/></p><p>• Simplify to sinθ + <Fraction top="cos²θ" bottom="sinθ"/> = <Fraction top="1" bottom="sinθ"/></p></div><footer><button type="button" onClick={grade}>Check My Answer</button><button type="button" onClick={()=>{setStepsShown((value)=>!value);onInteraction();}}>Need help? &nbsp; <b>Show Step-by-Step</b> <Sparkles/></button></footer>{practiceResult!=="idle"?<p role="status">{practiceResult==="correct"?"Correct: the expression simplifies to csc θ.":"Rewrite cot²θ using sine and cosine first."}</p>:null}{stepsShown?<p>sinθ(1 + cos²θ/sin²θ) = (sin²θ + cos²θ)/sinθ = 1/sinθ = cscθ.</p>:null}<ChallengeRow number={2} open={openChallenge===2} onClick={()=>{setOpenChallenge(openChallenge===2?null:2);onInteraction();}}>Verify the identity: &nbsp; sec²θ − tan²θ = 1</ChallengeRow><ChallengeRow number={3} open={openChallenge===3} onClick={()=>{setOpenChallenge(openChallenge===3?null:3);onInteraction();}}>Show that: &nbsp; (1 − sin²θ) / cos²θ = 1</ChallengeRow></article>
    </section>

    <nav className="target-identities-nav"><a href="/lessons/trigonometry/265-inverse-trig-functions"><ArrowLeft/><span><b>Previous</b>Inverse Trig Functions</span></a><a href="/lessons/trigonometry/267-compound-angle-formulae"><span><b>Next</b>Compound-Angle Formulae</span><ArrowRight/></a></nav>
  </section>;
}

function Flow({icon:Icon,number,title,children}:{icon:typeof Eye;number:string;title:string;children:string}){return <article><span>{number}</span><Icon/><div><h3>{title}</h3><p>{children}</p></div></article>;}
function IdentityCircle({angle,onAngle}:{angle:number;onAngle:(value:number)=>void}){const svg=useRef<SVGSVGElement>(null),cx=134,cy=125,r=105,normalized=normalizeDegrees(angle),rad=toRadians(normalized),x=cx+Math.cos(rad)*r,y=cy-Math.sin(rad)*r;const move=(event:ReactPointerEvent<SVGSVGElement>)=>{if(event.type==="pointermove"&&event.buttons!==1)return;const matrix=svg.current?.getScreenCTM();if(!matrix)return;const point=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse()),next=toDegrees(Math.atan2(cy-point.y,point.x-cx));onAngle(nearestTurn(next,angle));};return <svg ref={svg} viewBox="0 0 292 255" role="img" aria-label="Draggable identity unit-circle point" onPointerDown={(event)=>{event.currentTarget.setPointerCapture(event.pointerId);move(event);}} onPointerMove={move}><line x1="15" x2="270" y1={cy} y2={cy}/><line x1={cx} x2={cx} y1="12" y2="244"/><circle cx={cx} cy={cy} r={r} fill="none" stroke="#64748b"/><path d={arcPath(cx,cy,34,0,normalized)} fill="none" stroke="#06b6d4" strokeWidth="3"/><polygon points={`${cx},${cy} ${x},${cy} ${x},${y}`} fill="#cffafe"/><line x1={cx} y1={cy} x2={x} y2={y} stroke="#0878cf" strokeWidth="3"/><line x1={x} y1={y} x2={x} y2={cy} stroke="#f97316" strokeWidth="2" strokeDasharray="5 4"/><circle data-testid="identity-circle-handle" cx={x} cy={y} r="7" fill="#0878cf"/><text x={x+12} y={y-10} fill="#142451">(cosθ, sinθ)</text><text x={x+26} y={y+9} fill="#142451">({exactCos(angle)}, {exactSin(angle)})</text><text x={cx+26} y={cy-16} fill="#0878cf">{formatAngle(normalized)}</text><text x="266" y={cy+16}>x</text><text x={cx+8} y="18">y</text><text x="5" y={cy+16}>−1</text><text x="250" y={cy+16}>1</text><text x={cx-15} y="28">1</text><text x={cx-19} y="242">−1</text></svg>;}
function ChallengeRow({number,open,onClick,children}:{number:number;open:boolean;onClick:()=>void;children:string}){return <button type="button" className="target-identities-challenge-row" aria-expanded={open} onClick={onClick}><span>{number}. &nbsp; {children}</span><ChevronRight className={open?"open":""}/>{open?<small>{number===2?"Use sec²θ = 1 + tan²θ.":"Replace 1 − sin²θ with cos²θ."}</small>:null}</button>;}
function Fraction({top,bottom}:{top:string;bottom:string}){return <span className="target-identities-fraction"><span>{top}</span><span>{bottom}</span></span>;}
function identityModel(angle:number){const rad=toRadians(angle),sin=Math.sin(rad),cos=Math.cos(rad),defined=Math.abs(cos)>1e-8,tan=defined?Math.tan(rad):null,rhs=defined?sin/cos:null;return{sin,cos,tan,rhs,defined,difference:tan===null||rhs===null?null:Math.abs(tan-rhs),quadrant:quadrant(angle)};}
function exactSin(angle:number){const n=normalizeDegrees(angle);if(close(n,0)||close(n,180)||close(n,360))return"0";if(close(n,30)||close(n,150))return"1/2";if(close(n,45)||close(n,135))return"√2/2";if(close(n,60)||close(n,120))return"√3/2";if(close(n,90))return"1";return Math.sin(toRadians(angle)).toFixed(3);}
function exactCos(angle:number){const n=normalizeDegrees(angle);if(close(n,0)||close(n,360))return"1";if(close(n,30))return"√3/2";if(close(n,45))return"√2/2";if(close(n,60))return"1/2";if(close(n,90))return"0";if(close(n,120))return"−1/2";if(close(n,135))return"−√2/2";if(close(n,150))return"−√3/2";if(close(n,180))return"−1";return Math.cos(toRadians(angle)).toFixed(3);}
function exactTan(angle:number){const model=identityModel(angle);if(!model.defined)return"undefined";const n=normalizeDegrees(angle);if(close(n,0)||close(n,180)||close(n,360))return"0";if(close(n,30))return"√3/3";if(close(n,45))return"1";if(close(n,60))return"√3";if(close(n,120))return"−√3";if(close(n,135))return"−1";if(close(n,150))return"−√3/3";return model.tan?.toFixed(3)??"undefined";}
function quadrant(angle:number){const n=normalizeDegrees(angle);if(close(n,0)||close(n,90)||close(n,180)||close(n,270)||close(n,360))return"Axis";return n<90?"I":n<180?"II":n<270?"III":"IV";}
function radianLabel(angle:number){const n=normalizeDegrees(angle);if(close(n,60))return"π/3";if(close(n,45))return"π/4";if(close(n,30))return"π/6";if(close(n,90))return"π/2";if(close(n,180))return"π";return`${(angle/Math.PI).toFixed(2)}π`;}
function sign(value:number){return value>=0?"+":"−";}function normalize(value:string){return value.toLowerCase().replaceAll(" ","").replaceAll("θ","theta").replaceAll("cosec","csc");}function formatAngle(value:number){return`${Number(value.toFixed(1))}°`;}function normalizeDegrees(value:number){return((value%360)+360)%360;}function nearestTurn(principal:number,current:number){return clamp(principal+Math.round((current-principal)/360)*360,-360,360);}function close(a:number,b:number){return Math.abs(a-b)<.05;}function toRadians(value:number){return value*Math.PI/180;}function toDegrees(value:number){return value*180/Math.PI;}function clamp(value:number,min:number,max:number){return Math.max(min,Math.min(max,value));}function arcPath(cx:number,cy:number,r:number,start:number,end:number){const a=polar(cx,cy,r,start),b=polar(cx,cy,r,end),large=Math.abs(end-start)>180?1:0;return`M ${a.x} ${a.y} A ${r} ${r} 0 ${large} 0 ${b.x} ${b.y}`;}function polar(cx:number,cy:number,r:number,angle:number){const rad=toRadians(angle);return{x:cx+r*Math.cos(rad),y:cy-r*Math.sin(rad)};}

import {
  ArrowLeft,
  ArrowRight,
  Check,
  RotateCcw,
  TriangleAlert,
} from "lucide-react";
import { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./ZerosCoefficientsTargetLesson10050.css";
import MathExpression from "../../../components/ui/MathExpression";
import {zcState10050 as state,zcTarget10050 as target,zcRead10050 as read,zcMatches10050 as matches,zcPlot10050 as plot} from "./zerosCoefficientsModel10050";

const tabs = ["INTERACT", "LEARN", "EXAMPLE", "FORMULA", "PRACTICE"];
const tidy = (n: number) => Math.round(n * 100) / 100;
const signed = (n: number, variable = "") =>
  `${n < 0 ? "−" : "+"} ${Math.abs(n)}${variable}`;
const polynomial = (a: number, alpha: number, beta: number) => {
  const b = tidy(-a * (alpha + beta)),
    c = tidy(a * alpha * beta);
  return `${a === 1 ? "" : a}x² ${signed(b, "x")} ${signed(c)}`;
};

export default function ZerosCoefficientsTargetLesson10050({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [alpha, setAlpha] = useState(1),
    [beta, setBeta] = useState(3),
    [tab, setTab] = useState("INTERACT"),
    [targetSum, setTargetSum] = useState(5),
    [targetProduct, setTargetProduct] = useState(6),
    [customSum, setCustomSum] = useState("0"),
    [customProduct, setCustomProduct] = useState("0"),
    [quick, setQuick] = useState("B"),
    [showExplanation, setShowExplanation] = useState(true),
    [actions, setActions] = useState(0);
  const a = 1, exact=state(Math.round(alpha*10),Math.round(beta*10)),
    b=exact.b/100,c=exact.c/100,sum=exact.sum/100,product=exact.product/100,
    targetInfo=target(Math.round(targetSum*100),Math.round(targetProduct*100)),targetRoots=targetInfo.roots,
    customS=read(customSum,10),customP=read(customProduct,25),match=matches(Math.round(alpha*10),Math.round(beta*10),Math.round(targetSum*100),Math.round(targetProduct*100)),
    act = (fn: () => void) => {
      fn();
      setActions((n) => n + 1);
    };
  const setRoot = (which: "alpha" | "beta", value: number) =>
    act(() =>
      which === "alpha"
        ? setAlpha(Math.max(-5, Math.min(5, Math.round(value*10)/10)))
        : setBeta(Math.max(-5, Math.min(5, Math.round(value*10)/10))),
    );
  const reset = () =>
      act(() => {
        setAlpha(1);
        setBeta(3);
      }),
    setTarget = () =>
      act(() => {
        if(customS===null||customP===null)return;
        setTargetSum(customS/100);
        setTargetProduct(customP/100);
      });
  return (
    <section
      className="zc10050-page"
      data-testid="school-mockup-0724"
      data-object-model="dedicated-vieta-draggable-roots-coefficient-engine"
      data-alpha={alpha}
      data-beta={beta}
      data-a={a}
      data-b={b}
      data-c={c}
      data-sum={sum}
      data-product={product}
      data-target-roots={targetRoots.join(",")}
      data-quick={quick}
      data-quick-correct={String(quick === "B")}
      data-target-kind={targetInfo.kind}
      data-target-met={match.all}
      data-target-sum={targetSum}
      data-target-product={targetProduct}
      data-actions={actions}
    >
      <div role="banner" className="zc10050-hero">
        <small>CLASS 9 · POLYNOMIALS</small>
        <h1>Relationship Between Zeros and Coefficients</h1>
        <p>
          Connect the zeros (roots) of a quadratic to the sum and product
          determined by its coefficients.
        </p>
        <div>
          <span>18 min</span>
          <span>INTERACTIVE</span>
          <span>CONCEPT</span>
          <span>GRAPH</span>
          <span>CLASS 9</span>
        </div>
        <Link to="/lessons/school">
          <ArrowLeft /> School lessons
        </Link>
      </div>
      <div role="group" aria-label="Lesson sections" className="zc10050-tabs">
        {tabs.map((item) => (
          <button
            key={item}
            className={tab === item ? "active" : ""}
            aria-pressed={tab === item}
            onClick={() => act(() => {setTab(item);document.getElementById("zc10050-"+item.toLowerCase())?.scrollIntoView({behavior:"smooth",block:"start"});})}
          >
            {item}
          </button>
        ))}
      </div>
      <main className="zc10050-main">
        <section id="zc10050-interact" className="zc-lab">
          <div className="zc-left">
            <h2>GRAPH &amp; ROOTS</h2>
            <RootsGraph alpha={alpha} beta={beta} onRoot={setRoot} />
            <p>Drag α or β to change the roots.</p>
            <section>
              <header>
                <h3>ROOT SLIDERS</h3>
                <button onClick={reset}>
                  <RotateCcw /> Reset
                </button>
              </header>
              <RootSlider
                label="α (first root)"
                value={alpha}
                color="cyan"
                onChange={(v) => setRoot("alpha", v)}
              />
              <RootSlider
                label="β (second root)"
                value={beta}
                color="purple"
                onChange={(v) => setRoot("beta", v)}
              />
            </section>
          </div>
          <div className="zc-right">
            <section>
              <h2>COEFFICIENTS &amp; FORMS</h2>
              <p>Monic quadratics (a = 1). Live values update as you move the roots.</p>
              <div className="zc-coefficients">
                <span>
                  <i>a</i>
                  <b>{a}</b>
                </span>
                <span>
                  <i>b</i>
                  <b>{b}</b>
                </span>
                <span>
                  <i>c</i>
                  <b>{c}</b>
                </span>
              </div>
              <Formula label="Polynomial">{polynomial(a, alpha, beta)}</Formula>
              <Formula label="Expanded form">
                1 · x² {signed(b, "x")} {signed(c)}
              </Formula>
              <Formula label="Factored form">
                (x {alpha < 0 ? "+" : "−"} {Math.abs(alpha)})(x{" "}
                {beta < 0 ? "+" : "−"} {Math.abs(beta)})
              </Formula>
            </section>
            <section className="zc-balance">
              <h2 id="zc10050-formula">VIETA BALANCE</h2>
              <p>Check the sums and products.</p>
              <div>
                <Formula>
                  α + β<br />
                  {alpha<0?`(${alpha})`:alpha} + {beta<0?`(${beta})`:beta}
                </Formula>
                <b>=</b>
                <Formula>
                  <MathExpression value="−b/a"/>
                  <br />
                  <MathExpression value={String(-b)+"/"+a}/>
                </Formula>
                <b>=</b>
                <Formula>{sum}</Formula>
                <Check />
              </div>
              <div>
                <Formula>
                  αβ
                  <br />
                  {alpha<0?`(${alpha})`:alpha} × {beta<0?`(${beta})`:beta}
                </Formula>
                <b>=</b>
                <Formula>
                  <MathExpression value="c/a"/>
                  <br />
                  <MathExpression value={String(c)+"/"+a}/>
                </Formula>
                <b>=</b>
                <Formula>{product}</Formula>
                <Check />
              </div>
            </section>
          </div>
          <footer>
            <Check /> Perfect! The sums and products match Vieta's formulas.
          </footer>
        </section>
        <section id="zc10050-learn" className="zc-theory">
          <article>
            <h2>WHY IT WORKS</h2>
            <p>For a quadratic ax²+bx+c with a ≠ 0, the zeros α and β satisfy:</p>
            <div>
              <Formula label="Sum of zeros">α + β = −b/a</Formula>
              <Formula label="Product of zeros">αβ = c/a</Formula>
            </div>
            <p>
              These are Vieta's formulas. Expand a(x−α)(x−β) = ax² − a(α+β)x + aαβ and match coefficients.
            </p>
          </article>
          <article>
            <h2 id="zc10050-example">WORKED EXAMPLE</h2>
            <p>Consider 2x²−7x+3.</p>
            <p>
              <b>Step 1:</b> (2x−1)(x−3)=0, roots 1/2 and 3.
            </p>
            <p>
              <b>Step 2:</b> Check Vieta:
            </p>
            <Formula>α+β=3+1/2=7/2=−b/a</Formula>
            <Formula>αβ=3·1/2=3/2=c/a</Formula>
          </article>
          <article className="zc-mistake">
            <h2>
              <TriangleAlert /> COMMON MISTAKE
            </h2>
            <p>Remember the negative sign in the sum formula.</p>
            <div><b>Wrong:</b><MathExpression value="α+β=b/a"/><span>✕</span></div>
            <div>
              <b>Correct:</b><MathExpression value="α+β=−b/a"/> <Check />
            </div>
            <p>Always use −b/a for the sum of zeros.</p>
          </article>
        </section>
        <section id="zc10050-practice" className="zc-lower">
          <article className="zc-challenge">
            <h2>CHALLENGE</h2>
            <p>
              Drag the roots so that the sum is {targetSum} and the product is{" "}
              {targetProduct}. Then identify the polynomial.
            </p>
            <div className="zc-targets">
              <span>
                <b>Target: α+β={targetSum}</b>Current: {sum} {match.sum ? <Check/> : <small>Not matched</small>}
              </span>
              <span>
                <b>Target: αβ={targetProduct}</b>Current: {product} {match.product ? <Check/> : <small>Not matched</small>}
              </span>
              <aside>
                <b>How to reach the target?</b>
                <p>1. Move one root up and the other down to preserve the sum.</p>
                <p>2. Compare their actual product with {targetProduct}.</p>
                <p>3. The controls use tenths from −5 to 5. Some targets cannot be reached exactly here.</p>
              </aside>
            </div>
            <div className="zc-identified">
              <section>
                <b>Target polynomial (monic)</b>
                <Formula>
                  {`x² ${signed(-targetSum, "x")} ${signed(targetProduct)}`}
                </Formula>
                <p>
                  Possible roots:{" "}
                  {targetRoots.length ? targetRoots.map(v=>Number.isInteger(v*10)?String(v):"≈"+v.toPrecision(6)).join(", ") : "no real roots (the polynomial still exists)"}
                </p>
                <p role="status" className={match.all?"zc-target-success":"zc-target-pending"}>{match.all?"Correct: the current roots match both targets.":targetInfo.kind==='complex'?"No pair of real roots has this sum and product.":targetInfo.kind==='outside'?"At least one required root lies outside −5 to 5.":targetInfo.kind==='between'?"The exact roots lie between the tenth-step slider values; exact matching is unavailable in this lab.":"Move the roots until both live values match."}</p>
              </section>
              <aside>
                <b>Try another target</b>
                <label>
                  Sum
                  <input
                    type="text" aria-label="Target sum" inputMode="decimal" maxLength={20} aria-invalid={customS===null}
                    value={customSum}
                    onChange={(e) =>
                      act(() => setCustomSum(e.target.value))
                    }
                  />
                </label>
                <label>
                  Product
                  <input
                    type="text" aria-label="Target product" inputMode="decimal" maxLength={20} aria-invalid={customP===null}
                    value={customProduct}
                    onChange={(e) =>
                      act(() => setCustomProduct(e.target.value))
                    }
                  />
                </label>
                <small>Up to 2 decimal places. Sum: −10 to 10; product: −25 to 25.</small><button disabled={customS===null||customP===null} onClick={setTarget}>Set target</button>{(customS===null||customP===null)&&<small role="alert">Enter valid bounded decimal values.</small>}
              </aside>
            </div>
          </article>
          <article className="zc-quick">
            <h2>QUICK CHECK</h2>
            <p>Identify the monic quadratic whose roots satisfy α+β=−1 and αβ=−2.</p>
            {[
              ["A", "x²+x+2"],
              ["B", "x²+x−2"],
              ["C", "x²−x+2"],
              ["D", "x²−x−2"],
            ].map(([key, label], i) => (
              <label key={`${key}${i}`}>
                <input
                  type="radio"
                  name="zcquick"
                  checked={quick === key}
                  onChange={() => act(() => setQuick(key))}
                />
                {key} {label}
                {key === "B" && quick === "B" && <Check />}
              </label>
            ))}
            <p role="status" className={quick==='B'?'zc-target-success':'zc-target-pending'}>{quick==='B'?'Correct: b = 1 and c = −2.':'Check both signs: the sum is −b and the product is c for a monic quadratic.'}</p>
            <button aria-expanded={showExplanation} onClick={() => act(() => setShowExplanation((v) => !v))}>
              Show explanation
            </button>
            {showExplanation && (
              <p>
                Using a=1: −(α+β)=1 gives b=1 and αβ=−2 gives c=−2. Polynomial:
                x²+x−2.
              </p>
            )}
          </article>
        </section>
      </main>
      <nav className="zc10050-nav">
        <Link to="/lessons/school/class-9/class-9-polynomials-factor-theorem">
          <ArrowLeft /> Factor Theorem
        </Link>
        <Link to="/lessons/school/class-9/class-9-polynomials-cubic-algebraic-identities">
          <span>Cubic Algebraic Identities</span>
          <ArrowRight />
        </Link>
      </nav>
      <footer className="zc10050-footer"><div><b>Math Universe</b><p>Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p></div><nav><Link to="/sitemap">Sitemap</Link><Link to="/documentation">Docs</Link><Link to="/about">About</Link></nav><small>©2026 INDIAN SERVERS PRIVATE LIMITED. NO RIGHT TO REPRODUCE IT.<br/>www.IndianServers.com | info@IndianServers.com</small></footer>

    </section>
  );
}
function Formula({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="zc-formula">
      {label && <b>{label}</b>}
      <span>{typeof children === "string" ? <MathExpression value={children}/> : children}</span>
    </div>
  );
}
function RootSlider({
  label,
  value,
  color,
  onChange,
}: {
  label: string;
  value: number;
  color: string;
  onChange: (v: number) => void;
}) {
  return (
    <label className={`zc-slider ${color}`}>
      <b>{label}</b>
      <input
        type="range"
        min="-5"
        max="5"
        step="0.1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{value}</output><small className="zc-slider-ticks" aria-hidden="true">{Array.from({length:11},(_,i)=><span key={i}>{i-5}</span>)}</small>
    </label>
  );
}
function RootsGraph({alpha,beta,onRoot}:{alpha:number;beta:number;onRoot:(which:"alpha"|"beta",value:number)=>void}){
 const ref=useRef<SVGSVGElement>(null),id=useId().replace(/:/g,''),g=plot(Math.round(alpha*10),Math.round(beta*10)),drag=useRef<{which:'alpha'|'beta';pointer:number;before:number;start:number}|null>(null);
 const update=(e:React.PointerEvent<SVGGElement>)=>{const d=drag.current,svg=ref.current;if(!d||!svg)return;if(Math.abs(e.clientX-d.start)<.5){onRoot(d.which,d.before);return;}const c=svg.getScreenCTM();if(!c)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(c.inverse()),x=g.xMin+(p.x-35)/440*(g.xMax-g.xMin);onRoot(d.which,Math.max(-5,Math.min(5,Math.round(x*10)/10)));};
 const end=(e:React.PointerEvent<SVGGElement>,cancel=false)=>{const d=drag.current;if(!d||d.pointer!==e.pointerId)return;if(cancel)onRoot(d.which,d.before);else update(e);drag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);};
 const yStep=g.yMin<-10?5:1,yTicks=Array.from({length:Math.floor((g.yMax-g.yMin)/yStep)+1},(_,i)=>Math.ceil(g.yMin/yStep)*yStep+i*yStep).filter(y=>y<=g.yMax),same=alpha===beta;
 return <svg ref={ref} className="zc-svg" viewBox="0 0 500 380" aria-label="Interactive roots graph" data-x-min={g.xMin} data-x-max={g.xMax} data-y-min={g.yMin} data-y-max={g.yMax} data-vertex={`${g.vertex},${g.minimum}`}><defs><clipPath id={'zc-clip-'+id}><rect x="35" y="25" width="440" height="315"/></clipPath></defs><g className="zc-grid">{Array.from({length:11},(_,i)=><line key={'x'+i} x1={g.sx(i-5)} x2={g.sx(i-5)} y1="25" y2="340"/>)}{yTicks.map(y=><line key={y} x1="35" x2="475" y1={g.sy(y)} y2={g.sy(y)}/>)}</g><path className="zc-axis" d={`M35 ${g.sy(0)}H480M${g.sx(0)} 345V20`}/><g className="zc-ticks">{Array.from({length:11},(_,i)=><text key={i} x={g.sx(i-5)} y={g.sy(0)+19} textAnchor="middle">{i-5}</text>)}{yTicks.filter(y=>y!==0).map(y=><text key={y} x={g.sx(0)-9} y={g.sy(y)+4} textAnchor="end">{y}</text>)}<text x="484" y={g.sy(0)-8}>x</text><text x={g.sx(0)+8} y="18">y</text></g><path className="zc-curve" clipPath={`url(#zc-clip-${id})`} d={g.points.map((p,i)=>`${i?'L':'M'}${p.px},${p.py}`).join(' ')}/>{(['alpha','beta']as const).map(which=>{const value=which==='alpha'?alpha:beta,y=g.sy(0)+(same?(which==='alpha'?-16:16):0);return <g key={which} role="slider" tabIndex={0} aria-label={which==='alpha'?'Graph root alpha':'Graph root beta'} aria-valuemin={-5} aria-valuemax={5} aria-valuenow={value} aria-valuetext={value+(same?' (double root)':'')} className={`zc-root ${which}`} data-root={which} data-value={value} onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();e.currentTarget.focus();drag.current={which,pointer:e.pointerId,before:value,start:e.clientX};e.currentTarget.setPointerCapture(e.pointerId);}} onPointerMove={e=>{if(drag.current?.pointer===e.pointerId)update(e);}} onPointerUp={e=>end(e)} onPointerCancel={e=>end(e,true)} onLostPointerCapture={e=>{if(drag.current?.pointer===e.pointerId)end(e,true);}} onKeyDown={e=>{const delta=e.shiftKey?.5:.1;if(['ArrowLeft','ArrowDown','ArrowRight','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();onRoot(which,e.key==='Home'?-5:e.key==='End'?5:value+(['ArrowLeft','ArrowDown'].includes(e.key)?-delta:delta));}}}><line className="zc-root-stem" x1={g.sx(value)} x2={g.sx(value)} y1={g.sy(0)} y2={y}/><circle cx={g.sx(value)} cy={y} r="13"/><text x={g.sx(value)} y={y+4} textAnchor="middle">{which==='alpha'?'α':'β'}</text></g>;})}<text className="zc-plot-note" x="35" y="373">{same?'Double root: both handles share the same x coordinate.':'Roots are the actual x-intercepts. The vertical scale adjusts to the vertex.'}</text></svg>;
}

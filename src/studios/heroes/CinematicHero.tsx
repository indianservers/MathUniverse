import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { drawMathScene } from './mathScenes';
import { visibleStudioObjects } from './studioObjects';


import './cinematicHeroes.css';
export const heroCatalog: Record<string, [string,string,string,string,string,string]> = {
 algebra:['Algebra Studio','Patterns Become','Powerful','Explore equations, transformations and polynomial patterns through visual reasoning.','/algebra/equations','3x + 5 = 2x − 1  ⇒  x = −6'],
 structures:['Algebraic Structures Studio','Where Structure','Shapes Logic','Explore groups, rings, fields and the symmetries that connect abstract ideas.','/algebraic-structures/structure-test','a ⊕ b = (a + b) mod 4'],
 geometry:['Geometry Studio','Shape the World','Through Space','Construct points, lines, angles and solids. Discover relationships through geometry.','/geometry/construction','OM ⟂ AB  ⇒  AM = MB'],
 calculus:['Calculus Studio','Motion, Change','and Infinity','Follow a moving point from limits and tangent slopes to accumulated area.','/calculus/derivatives','f(x) = x²    f′(x) = 2x'],
 'number-systems':['Number Systems Studio','From Counting to','Infinite Sets','Connect counting numbers, integers, fractions and the complete real number line.','/number-systems/fundamentals','ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ'],
 'linear-algebra':['Linear Algebra Studio','Transform Space','with Vectors','See matrices reshape coordinates, vectors and the space around them.','/linear-algebra/vectors','T(v) = Av'],
 'complex-numbers':['Complex Numbers Studio','Beyond the','Real Axis','Explore a richer plane through rotation, magnitude, roots and Euler’s relation.','/complex-numbers/argand-plane','eⁱθ = cos θ + i sin θ'],
 modelling:['Mathematical Modelling Studio','Turn Reality into','Equations','Connect observations to data, models, simulations and useful predictions.','/mathematical-modelling/epidemics','Reality → Data → Model → Prediction'],
 discrete:['Number & Discrete Mathematics Studio','Logic, Counting and','Hidden Patterns','Discover how integer steps grow into recurrences, combinations and logical structures.','/discrete-world/number-sense','C(n,k) = C(n−1,k−1) + C(n−1,k)'],
 sets:['Set Theory & Relations','Connect Elements,','Build Foundations','Organize elements into sets, relations and mappings. See structure emerge.','/set-theory/venn-diagram-engine','A ∩ B = {x : x ∈ A and x ∈ B}'],
 graphs:['Graph Theory Studio','See the World','Through Connections','Explore networks, paths, trees and coloring through connected visual ideas.','/graph-theory?mode=path','Connections reveal structure'],
 statistics:['Statistics & Probability Studio','Turn Data into','Insight','Watch random observations form distributions and reveal the patterns in data.','/probability-statistics/experiments','X ∼ N(μ, σ²)'],
 'differential-equations':['Differential Equations Studio','Model Change','as It Unfolds','Follow initial conditions through direction fields, growth and oscillation.','/differential-equations/first-order','y′ = y(1 − y)'],
 'continued-fractions':['Continued Fractions Lab','Infinite Patterns in','Every Approximation','Follow nested fractions and rational convergents toward an irrational limit.','#hero-workbench','φ = 1 + 1/(1 + 1/(1 + …))'],
 'famous-problems':['Famous Problems Atlas','Explore the Mysteries','that Shaped Mathematics','Travel through landmark problems, proved theorems and questions still open.','#hero-workbench','Discovery begins with a question'],
 'stats-inference':['Statistics Inference Studio','Draw Conclusions','with Confidence','Turn samples into estimates, intervals and evidence for mathematical decisions.','#hero-workbench','Estimate ± uncertainty'],
 'special-functions':['Special Functions Gallery','A Gallery of','Mathematical Elegance','Explore Gamma, Beta and oscillating special functions as living mathematical sculptures.','#hero-workbench','Γ(x + 1) = xΓ(x)'],
 'advanced-de':['Advanced Differential Equations','Master the Mathematics','of Complex Dynamics','Explore diffusion, waves and the continuous evolution of complex systems.','#hero-workbench','∂u/∂t = α∇²u'],
};
export default function CinematicHero({id,children,secondaryHref}:{id:string;children?:ReactNode;secondaryHref?:string}){
 const ref=useRef<HTMLElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 const clock=useRef(0);
 const [playing,setPlaying]=useState(true),[replay,setReplay]=useState(0);
 const [reducedMotion,setReducedMotion]=useState(false);
 const info=heroCatalog[id];
 const objects=visibleStudioObjects(id);
 useEffect(()=>{
  const host=ref.current,c=canvas.current;if(!host||!c)return;const ctx=c.getContext('2d');if(!ctx)return;
  let frame=0,visible=false,hidden=document.hidden,last=0,lastPaint=0,width=760,height=620;
  const media=matchMedia('(prefers-reduced-motion: reduce)');let reduced=media.matches;setReducedMotion(reduced);
  const paint=(time:number)=>{frame=0;if(!visible||hidden)return;if(last&&playing&&!reduced)clock.current+=Math.min(.05,(time-last)/1000);last=time;if(time-lastPaint>=32||!playing||reduced){drawMathScene(ctx,id,width,height,reduced?8:clock.current);lastPaint=time;}if(!reduced&&playing)frame=requestAnimationFrame(paint);};
  const start=()=>{cancelAnimationFrame(frame);last=0;if(visible&&!hidden)frame=requestAnimationFrame(paint);};
  const resize=new ResizeObserver(()=>{const r=c.getBoundingClientRect();width=r.width;height=r.height;const dpr=Math.min(devicePixelRatio||1,1.5);c.width=Math.round(width*dpr);c.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);start();});resize.observe(c);
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;host.dataset.active=String(visible);if(visible)host.dataset.entered='true';start();},{threshold:.08});observer.observe(host);
  const preference=()=>{reduced=media.matches;setReducedMotion(reduced);start();};media.addEventListener('change',preference);
  const visibility=()=>{hidden=document.hidden;start();};document.addEventListener('visibilitychange',visibility);
  return()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();media.removeEventListener('change',preference);document.removeEventListener('visibilitychange',visibility);};
 },[id,playing,replay]);
 if(!info)return null;
 return <section ref={ref} className={`cinematic-hero hero-${id}`} data-hero={id} aria-label={`${info[0]} introduction`} onPointerMove={e=>{if(!playing||reducedMotion)return;const r=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--pointer-x',`${(e.clientX-r.left)/r.width*12-6}px`);e.currentTarget.style.setProperty('--pointer-y',`${(e.clientY-r.top)/r.height*8-4}px`);}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--pointer-x','0px');e.currentTarget.style.setProperty('--pointer-y','0px');}}>
  <div className="cinematic-copy"><span className="cinematic-kicker">{info[0]} · Explore · Visualize</span><h1>{info[1]}<br/><em>{info[2]}</em></h1><p>{info[3]}</p><div className="cinematic-features"><span>◉ Visual intuition</span><span>✧ Real-world ideas</span><span>↗ Hands-on discovery</span></div><div className="cinematic-actions">{info[4].startsWith('#')?<a href={info[4]} className="cinematic-primary">▶ Start Exploring →</a>:<Link to={info[4]} className="cinematic-primary">▶ Start Learning →</Link>}{secondaryHref?<a href={secondaryHref}>Explore All Topics ↓</a>:<button type="button" onClick={()=>{const next=ref.current?.nextElementSibling;next?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}}>Explore All Topics ↓</button>}</div>{children?<details className="cinematic-existing"><summary>More studio controls</summary>{children}</details>:null}</div>
  <div className="cinematic-scene"><canvas ref={canvas} role="img" aria-label={`${info[0]} animated scene. ${objects.map(o=>o.name).join(', ')}.`}/><div className="cinematic-motion-tools"><span>{objects.length} concept animations</span><button type="button" disabled={reducedMotion} aria-pressed={reducedMotion||!playing} onClick={()=>setPlaying(!playing)}>{reducedMotion?'Reduced motion':playing?'Pause motion':'Resume motion'}</button><button type="button" onClick={()=>{clock.current=0;setReplay(n=>n+1);}}>Replay scene</button></div><div className="cinematic-equation">{info[5]}</div><details className="cinematic-object-key"><summary>Explore the objects</summary><ul>{objects.map(o=><li key={o.name}><b>{o.name}</b><span>{o.formula}</span></li>)}</ul></details></div>

 </section>;
}



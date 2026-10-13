import { quadraticRoots, generateSequences } from "./algebraEnhancementEngine";

type Props = {id:string;a:number;b:number;c:number;x:number;icon?:boolean;leftExpr?:string;rightExpr?:string};
const symbols:Record<string,string>={"ALG-01":"x²","ALG-02":"±","ALG-03":"▦","ALG-04":"(x)","ALG-05":"⚖","ALG-06":"↔","ALG-07":"|x|","ALG-08":"□","ALG-09":"÷","ALG-10":"√","ALG-11":"∘","ALG-12":"f⁻¹","ALG-13":"{","ALG-14":"x²","ALG-15":"i","ALG-16":"÷","ALG-17":"∞","ALG-18":"▦","ALG-19":"∩","ALG-20":"aᵐ","ALG-21":"log","ALG-22":"⋮","ALG-23":"Σ","ALG-24":"⌕","ALG-25":"✓"};
const n=(v:number)=>Number.isFinite(v)?String(Math.round(v*1000)/1000):"undefined";
export default function WorkbenchVisual({id,a,b,c,x,icon,leftExpr="(t+b)^2",rightExpr="t^2+b^2"}:Props){
 if(icon)return <span>{symbols[id]}</span>;
 const tx=(v:number)=>150+v*17,ty=(v:number)=>80-v*14;
 const path=(fn:(v:number)=>number)=>{let d="",open=false;for(let i=0;i<=200;i++){const t=-8+i*.08,y=fn(t);if(!Number.isFinite(y)||Math.abs(y)>10){open=false;continue;}d+=`${open?"L":"M"}${tx(t).toFixed(2)},${ty(y).toFixed(2)} `;open=true;}return d;};
 const graph=(f:(t:number)=>number,g?:(t:number)=>number)=><svg viewBox="0 0 300 160" aria-label="Live function graph"><defs><pattern id={`grid-${id}`} width="17" height="14" patternUnits="userSpaceOnUse"><path d="M17 0H0V14" fill="none" stroke="#ddebfc" strokeWidth=".5"/></pattern><clipPath id={`clip-${id}`}><rect width="300" height="160"/></clipPath></defs><rect width="300" height="160" fill={`url(#grid-${id})`}/><path d="M8 80H292 M150 8V152" stroke="#6685b2"/><g clipPath={`url(#clip-${id})`}><path d={path(f)} fill="none" stroke="#009fea" strokeWidth="2.5"/>{g&&<path d={path(g)} fill="none" stroke="#9745ff" strokeWidth="2.5"/>}{Number.isFinite(f(x))&&<circle cx={tx(x)} cy={ty(f(x))} r="4" fill="#ff9d00"/>}</g><text x="284" y="75">x</text></svg>;
 if(id==="ALG-01")return <div className="awb-signed-tiles">{[[a,"x²"],[b,"x"],[c,"1"]].map(([v,label])=><div key={label} className={Number(v)<0?"negative":"positive"}><b>{Number(v)<0?"−":"+"}{label}</b><small>× {n(Math.abs(Number(v)))}</small></div>)}</div>;
 if(id==="ALG-02")return <div className="awb-signed-tiles"><div className="positive">+{n(Math.abs(a)+2)}</div><div className="negative">−{n(Math.abs(b))}</div><span>→ {n(Math.abs(a)+2-Math.abs(b))}</span></div>;
 if(id==="ALG-03")return <div className="awb-area"><span>{n(a*c)}x²</span><span>{n(a*x)}x</span><span>{n(b*c)}x</span><span>{n(b*x)}</span></div>;
 if(id==="ALG-05")return <svg viewBox="0 0 300 160" aria-label="Linear balance"><path d="M25 105H275 M150 105L130 135H170Z" fill="#a4bee8" stroke="#5575a9" strokeWidth="3"/><rect x="30" y="40" width="100" height="55" rx="8" fill="#b4f2e0"/><rect x="175" y="40" width="100" height="55" rx="8" fill="#c6e7ff"/><text x="80" y="72" textAnchor="middle">{n(a)}x + {n(b)}</text><text x="225" y="72" textAnchor="middle">{n(c)}x + {n(x)}</text></svg>;
 if(id==="ALG-06"){const bound=a===0?null:(c-b)/a;return <svg viewBox="0 0 300 160" aria-label="Inequality solution ray"><path d="M15 82H285l-8-6m8 6-8 6" stroke="#162253" fill="none" strokeWidth="2"/>{bound!==null&&<><path d={a>0?"M25 82H150":"M150 82H275"} stroke="#914dff" strokeWidth="4"/><circle cx="150" cy="82" r="6" fill="white" stroke="#914dff" strokeWidth="2"/><text x="150" y="108" textAnchor="middle">{n(bound)}</text></>}</svg>;}
 if(id==="ALG-11")return <div className="awb-machine"><b>x = {n(x)}</b><span>→</span><b>g</b><span>→</span><b>f</b><span>→</span><b>{n(a*(x*x+c)+b)}</b></div>;
 if(id==="ALG-12")return graph(t=>a*t+b,a===0?undefined:t=>(t-b)/a);
 if(id==="ALG-13")return graph(t=>t<0?a*t+b:t*t+c);
 if(id==="ALG-14")return graph(t=>(t-a)*(t-b)*(t-c));
 if(id==="ALG-15"){const roots=quadraticRoots(a,b,c),scale=Math.max(2,...roots.flatMap(r=>[Math.abs(r.real),Math.abs(r.imaginary)]))*1.3;return <svg viewBox="0 0 300 160" aria-label="Complex roots on Argand plane"><path d="M15 80H285M150 8V152" stroke="#aac4e5"/><text x="268" y="73">Re</text><text x="158" y="18">Im</text>{roots.map((r,i)=><g key={i}><circle cx={150+r.real/scale*120} cy={80-r.imaginary/scale*60} r="5" fill="#9750ff"/><text x={150+r.real/scale*120+8} y={80-r.imaginary/scale*60-8}>{n(r.real)} {r.imaginary>=0?"+":"−"} {n(Math.abs(r.imaginary))}i</text></g>)}</svg>;}
 if(id==="ALG-20")return <div className="awb-formula"><b>{n(Math.max(.1,Math.abs(a)))}<sup>{n(b)}</sup> + {n(Math.max(.1,Math.abs(a)))}<sup>{n(c)}</sup></b><span>compare with</span><b>{n(Math.max(.1,Math.abs(a)))}<sup>{n(b+c)}</sup></b></div>;
 if(id==="ALG-21")return <div className="awb-formula"><b>logᵦ v = log꜀ v / log꜀ b</b><small>v &gt; 0 · b, c &gt; 0 · b, c ≠ 1</small></div>;
 if(id==="ALG-22"||id==="ALG-23"){const seq=generateSequences(a,b,6);const scale=Math.max(1,...Object.values(seq).flat().map(Math.abs));return <svg viewBox="0 0 300 160" aria-label="Sequence values">{Object.entries(seq).map(([key,values],j)=><g key={key}>{values.map((v,i)=><circle key={i} cx={20+i*48} cy={120-v/scale*90} r="4" fill={["#00a8e7","#ab4cff","#00b98d"][j]}/>)}<text x={j*100+8} y="151" fill={["#00a8e7","#ab4cff","#00b98d"][j]}>{key}</text></g>)}</svg>;}
 if(id==="ALG-10")return graph(t=>t<0?NaN:Math.sqrt(t),()=>Math.abs(a));
 if(id==="ALG-07")return graph(t=>Math.abs(a*t+b),()=>Math.abs(c));
 if(id==="ALG-09")return graph(t=>(t-b)/( (t-b)*(t-c)));
 if(id==="ALG-17")return graph(t=>a*(t-b)**2/((t-b)*(t-c)));
 if(id==="ALG-18")return <div className="awb-matrix">{["1","1","1","2","−1","1","1","2","−1"].map((v,i)=><span key={i}>{v}</span>)}<b>→ ({n(a)}, {n(b)}, {n(c)})</b></div>;
 if(id==="ALG-24")return <div className="awb-formula"><b>{leftExpr}</b><span>compare with</span><b>{rightExpr}</b><small>Find a counterexample, then explain.</small></div>;
 return graph(t=>a*t*t+b*t+c,id==="ALG-19"?()=>x:undefined);
}

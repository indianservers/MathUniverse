import { useId, useRef, type PointerEvent } from 'react';
import { angleLabel, decimal, nearZero, rad, type Identity } from './identityMath';

type Props={identity:Identity;theta:number;phi:number;units:'deg'|'rad';step:number;view:'Circle'|'Triangle';reveal:boolean;onAngle:(n:number)=>void};
const point=(angle:number,r=112)=>({x:220+r*Math.cos(rad(angle)),y:170-r*Math.sin(rad(angle))});
function arcPath(from:number,to:number,r:number){const first=point(from,r);let d=`M${first.x} ${first.y}`;const count=Math.max(1,Math.ceil(Math.abs(to-from)/90));for(let i=1;i<=count;i++){const p=point(from+(to-from)*i/count,r);d+=`A${r} ${r} 0 0 ${to>=from?0:1} ${p.x} ${p.y}`;}return d;}
export function IdentityFigure({identity:item,theta,phi,units,step,view,reveal,onAngle}:Props){
  const id=useId().replaceAll(':',''),drag=useRef(false);
  const p=point(theta),half=item.family==='Half Angle',double=item.family==='Double Angle',triple=item.family==='Triple Angle';
  const difference=item.id.includes('difference'),sumProduct=item.family==='Sum-Product';
  const other=half?theta/2:double?theta*2:triple?theta*3:item.family==='Complementary'?90-theta:item.family==='Negative Angles'?-theta:sumProduct?(theta+phi)/2:theta+(difference?-phi:phi);
  const q=point(other), sx=Math.sin(rad(theta)),cx=Math.cos(rad(theta));
  const stage=item.steps[Math.min(step,item.steps.length-1)].scene;
  const scaled=item.id==='secant'||item.id==='cosecant';
  const scale=scaled?Math.abs(item.id==='secant'?cx:sx):1;
  const leg1=scaled?1:Math.abs(cx),leg2=scaled?Math.abs(item.id==='secant'?sx/cx:cx/sx):Math.abs(sx);
  const hyp=scaled?1/scale:1,areaScale=Number.isFinite(hyp)?80/Math.max(1,hyp):80;
  const labels=item.id==='secant'?['1','tan²θ','sec²θ']:item.id==='cosecant'?['1','cot²θ','csc²θ']:['cos²θ','sin²θ','1'];
  const pointer=(event:PointerEvent<SVGSVGElement>)=>{const matrix=event.currentTarget.getScreenCTM();if(!matrix)return;const pt=new DOMPoint(event.clientX,event.clientY).matrixTransform(matrix.inverse());onAngle(Math.atan2(170-pt.y,pt.x-220)*180/Math.PI);};
  return <div className={`ids-figure ${reveal?'is-revealing':''}`} data-stage={stage}>
    <svg viewBox="0 0 600 360" role="img" aria-label={`Visual Proof: ${item.label}: ${item.steps[step].reason}`} onPointerDown={e=>{drag.current=true;e.currentTarget.setPointerCapture(e.pointerId);pointer(e);}} onPointerMove={e=>{if(drag.current)pointer(e);}} onPointerUp={e=>{drag.current=false;e.currentTarget.releasePointerCapture(e.pointerId);}} onPointerCancel={()=>{drag.current=false;}}>
      <defs><pattern id={`${id}grid`} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="currentColor" opacity=".065"/></pattern><filter id={`${id}glow`}><feGaussianBlur stdDeviation="3"/></filter></defs>
      <rect width="600" height="360" fill={`url(#${id}grid)`}/>
      <g className="ids-construction"><path d="M55 170H370M220 25V312" className="ids-axis"/>{view==='Circle'&&<circle cx="220" cy="170" r="112" className="ids-circle"/>}<text x="373" y="174">x</text><text x="227" y="28">y</text></g>
      <g className={`ids-ray ${stage==='rays'?'ids-lit':''}`}><line x1="220" y1="170" x2={p.x} y2={p.y} stroke="#d97706" strokeWidth="3"/><circle cx={p.x} cy={p.y} r="8" fill="#f59e0b"/><text x={Math.max(30,Math.min(p.x+12,320))} y={p.y<60?p.y+24:p.y-12}>P · {angleLabel(theta,units)}</text></g>
      {step>=1&&<g className={`ids-projection ${stage==='projections'||stage==='triangle'?'ids-lit':''}`}><polygon points={`220,170 ${p.x},170 ${p.x},${p.y}`} fill="#8b5cf61a"/><path d={`M220 170H${p.x}`} stroke="#0891b2" strokeWidth="4"/><path d={`M${p.x} 170V${p.y}`} stroke="#7c3aed" strokeWidth="4" strokeDasharray="7 3"/><text x={(220+p.x)/2} y="193" textAnchor="middle" fill="#0891b2">cos θ · {cx<0?'negative':'nonnegative'}</text><text x={p.x<220?p.x-8:p.x+8} y={(170+p.y)/2} textAnchor={p.x<220?'end':'start'} fill="#7c3aed">sin θ</text></g>}
      {item.family!=='Pythagorean'&&step>=1&&<g className={`ids-second-ray ${stage==='result'?'ids-lit':''}`}><line x1="220" y1="170" x2={q.x} y2={q.y} stroke="#7c3aed" strokeWidth="3" strokeDasharray="8 4"/><circle cx={q.x} cy={q.y} r="6" fill="#7c3aed"/><text x="35" y="330" fill="#7c3aed">Dashed ray: {half?'θ/2':double?'2θ':triple?'3θ':item.family==='Negative Angles'?'−θ':item.family==='Complementary'?'π/2 − θ':sumProduct?'(θ + φ)/2':difference?'θ − φ':'θ + φ'} = {angleLabel(other,units)}</text></g>}
      {(item.family==='Product-Sum'||sumProduct)&&step>=1&&<g><line x1="220" y1="170" x2={point(sumProduct?(theta-phi)/2:theta-phi).x} y2={point(sumProduct?(theta-phi)/2:theta-phi).y} stroke="#059669" strokeWidth="2.5" strokeDasharray="2 4"/><text x="406" y="285">Second ray: {sumProduct?'(θ − φ)/2':'θ − φ'}</text></g>}
      {(double||triple)&&step>=1&&<g><path d={arcPath(0,theta,28)} fill="none" stroke="#d97706" strokeWidth="3"/><path d={arcPath(theta,2*theta,42)} fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="5 2"/>{triple&&<path d={arcPath(2*theta,3*theta,54)} fill="none" stroke="#059669" strokeWidth="3"/>}<text x="30" y="25">{triple?'θ + θ + θ':'θ + θ'} · repeated rotations</text></g>}
      {item.family==='Angle Sum'&&step>=1&&<g><path d={`M${q.x} ${q.y}V170H220`} fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="3 3"/><path d={arcPath(theta,other,42)} fill="none" stroke="#059669" strokeWidth="2"/><text x="406" y="245">Projected x = {decimal(Math.cos(rad(other)),3)}</text><text x="406" y="264">Projected y = {decimal(Math.sin(rad(other)),3)}</text></g>}
      {double&&item.fn==='sin'&&step>=2&&<g><rect x="416" y="240" width={Math.abs(cx)*68} height={Math.abs(sx)*40} fill="#0891b222" stroke="#0891b2"/><rect x={416+Math.abs(cx)*68} y="240" width={Math.abs(cx)*68} height={Math.abs(sx)*40} fill="#7c3aed22" stroke="#7c3aed"/><text x="406" y="310">Two products: 2 sin θ cos θ</text><text x="406" y="330">Sign: {sx*cx<0?'negative':sx*cx>0?'positive':'zero'} · area magnitude</text></g>}
      {item.twoAngles&&<g><line x1="220" y1="170" x2={point(phi).x} y2={point(phi).y} stroke="#059669" strokeWidth="2"/><text x="35" y="350" fill="#059669">φ = {angleLabel(phi,units)}</text></g>}
      {item.family==='Pythagorean'? <g className={`ids-area ${stage==='area'?'ids-lit':''}`}>
        <text x="400" y="34">Squared lengths → areas</text>
        {nearZero(scale)?<text x="400" y="80">Scaling undefined here.</text>:<>
        <rect x="408" y="50" width={leg1*areaScale} height={leg1*areaScale} fill="#06b6d433" stroke="#0891b2"/><text x="408" y="146" fill="#0891b2">{labels[0]} = {decimal(leg1**2,3)}</text>
        <text x="495" y="94">+</text><rect x="520" y="50" width={leg2*areaScale} height={leg2*areaScale} fill="#8b5cf633" stroke="#7c3aed"/><text x="502" y="167" fill="#7c3aed">{labels[1]} = {decimal(leg2**2,3)}</text>
        <g className="ids-unit-square"><rect className="ids-unit-slice" x="440" y="204" width={hyp*areaScale} height={leg1**2/hyp*areaScale} fill="#06b6d433"/><rect className="ids-unit-slice" x="440" y={204+leg1**2/hyp*areaScale} width={hyp*areaScale} height={leg2**2/hyp*areaScale} fill="#8b5cf633"/><rect x="440" y="204" width={hyp*areaScale} height={hyp*areaScale} fill="none" stroke="#059669"/></g><text x="402" y="311" fill="#059669">{labels[2]} = {decimal(hyp**2,3)}</text>
        </>}
      </g>:<g className="ids-geometric-note"><text x="406" y="72">{half?'Reverse the rotation':double?'Two equal rotations':triple?'Three equal rotations':item.family==='Negative Angles'?'Reflect the point':'Resolve the rotations'}</text><text x="406" y="98">{step+1} / {item.steps.length} · {stage}</text><text x="406" y="128">Solid ray: original θ</text><text x="406" y="152">Dashed ray: transformed</text><text x="406" y="192">Lengths use |sin θ|, |cos θ|.</text><text x="406" y="216">Coordinates retain their signs.</text></g>}
      {reveal&&<circle cx={p.x} cy={p.y} r="16" fill="#22d3ee" opacity=".45" filter={`url(#${id}glow)`}/>}
    </svg>
  </div>;
}

export function IdentityWaves({identity:item,theta,phi,units}:Pick<Props,'identity'|'theta'|'phi'|'units'>){
  const product=item.family==='Product-Sum',sum=item.family==='Sum-Product',double=item.family==='Double Angle',triple=item.family==='Triple Angle';
  if(!product&&!sum&&!double&&!triple)return null;
  const multiplier=triple?3:2;
  const fn=item.fn==='cos'?Math.cos:item.fn==='tan'?(x:number)=>Math.abs(Math.cos(x))<1e-7?NaN:Math.tan(x):Math.sin;
  const path=(f:(x:number)=>number)=>{let d='',last:number|null=null;for(let i=0;i<=360;i++){const v=f(rad(i));if(!Number.isFinite(v)||Math.abs(v)>3||(last!==null&&Math.abs(v-last)>1.5)){last=null;continue;}d+=`${last===null?'M':'L'}${35+i*1.43},${112-v*23} `;last=v;}return d;};
  const y=rad(phi),comp1=(x:number)=>product?item.fn==='sin'?Math.sin(x+y):Math.cos(x+y):item.fn==='sin'?Math.sin(x):Math.cos(x);
  const comp2=(x:number)=>product?(item.id==='product-sin-sin'?-Math.cos(x-y):item.id==='product-cos-sin'?-Math.sin(x-y):item.fn==='sin'?Math.sin(x-y):Math.cos(x-y)):item.id.includes('subtract')?-(item.fn==='sin'?Math.sin(y):Math.cos(y)):(item.fn==='sin'?Math.sin(y):Math.cos(y));
  // sin-sin uses cos(θ−φ) − cos(θ+φ), the opposite order to the other products.
  const first=(x:number)=>item.id==='product-sin-sin'?Math.cos(x-y):comp1(x);
  const second=(x:number)=>item.id==='product-sin-sin'?-Math.cos(x+y):comp2(x);
  return <section className="ids-wave-panel" aria-label="Linked identity curves"><h3>{double||triple?`Frequency ×${multiplier}; period ÷${multiplier}`:'Components combine into the same curve'}</h3><svg viewBox="0 0 600 205" role="img" aria-label={double||triple?`${item.fn} θ and ${item.fn} ${multiplier}θ with discontinuities excluded`:'Two component curves, their combination, and the equivalent expression'}><path d="M35 35V169H557M35 112H557" className="ids-axis"/>
    <path d={path(double||triple?fn:first)} fill="none" stroke="#0891b2" strokeWidth="2"/><path d={path(double||triple?(x=>fn(multiplier*x)):second)} fill="none" stroke="#7c3aed" strokeWidth="2" strokeDasharray="7 3"/>
    {(product||sum)&&<><path d={path(x=>item.lhs(x,y))} fill="none" stroke="#d97706" strokeWidth="4" opacity=".7"/><path d={path(x=>item.rhs(x,y))} fill="none" stroke="#059669" strokeWidth="2" strokeDasharray="3 3"/></>}
    <line x1={35+((theta%360+360)%360)*1.43} x2={35+((theta%360+360)%360)*1.43} y1="35" y2="169" stroke="#64748b" strokeDasharray="3 3"/>
    {[0,90,180,270,360].map(n=><text key={n} x={35+n*1.43} y="189" textAnchor="middle">{angleLabel(n,units)}</text>)}
    </svg><div className="ids-legend">{double||triple?<><span className="ids-cos">━ {item.fn} θ</span><span className="ids-sin">┄ {item.fn} {multiplier}θ</span><span>Periods: {angleLabel(item.fn==='tan'?180:360,units)} → {angleLabel((item.fn==='tan'?180:360)/multiplier,units)}</span></>:<><span className="ids-cos">━ component 1</span><span className="ids-sin">┄ component 2</span><span className="ids-angle">━ LHS</span><span className="ids-result">┈ RHS (combination)</span></>}</div><p>Horizontal axis varies θ; φ stays fixed. Values outside ±3 are omitted to keep the comparison readable.</p></section>;
}

import {noEvidence,type VerificationEvidence} from '../../math-foundation/executionOutcome';
import type {KernelRequest,KernelResult} from './types';
import * as c from './certificateArithmetic';

type V=c.Q[];
type Linear={kind:'line'|'segment'|'ray';p:V;u:V};
type Plane={p:V;n:V};
type Circle={p:V;r:c.Q};
type Expected={kind:string;point?:V;points?:c.A[][];direction?:V;center?:V;normal?:V;radiusSquared?:c.Q;closestPoints?:V[];distanceSquared?:c.Q;interval?:{lower?:c.Q;upper?:c.Q};parameters?:c.Q[];endpoints?:V[];classification?:string;multiplicity?:number};
const vSub=(a:V,b:V)=>a.map((x,i)=>c.sub(x,b[i]));
const vAdd=(a:V,b:V)=>a.map((x,i)=>c.add(x,b[i]));
const scale=(a:V,k:c.Q)=>a.map(x=>c.mul(x,k));
const dot=(a:V,b:V)=>a.reduce((s,x,i)=>c.add(s,c.mul(x,b[i])),c.z);
const zero=(a:V)=>a.every(x=>!x.n);
const cross=(a:V,b:V):V=>[c.sub(c.mul(a[1],b[2]),c.mul(a[2],b[1])),c.sub(c.mul(a[2],b[0]),c.mul(a[0],b[2])),c.sub(c.mul(a[0],b[1]),c.mul(a[1],b[0]))];
function vector(raw:unknown,dimension:number):V{if(!Array.isArray(raw)||raw.length!==dimension||raw.some(x=>typeof x!=='number'||!Number.isFinite(x)))throw new Error('Invalid certificate vector.');return raw.map(c.binary);}
function linear(raw:unknown,dimension:number):Linear{
 const o=raw as Record<string,unknown>;if(!o||!['line','segment','ray'].includes(String(o.kind)))throw new Error('Invalid certificate line.');
 const p=vector(dimension===2?o.a:o.point,dimension),u=dimension===2?vSub(vector(o.b,2),p):vector(o.direction,3);
 if(zero(u)&&(dimension===3||o.kind!=='segment'))throw new Error('Zero certificate direction.');return {kind:o.kind as Linear['kind'],p,u};
}
function plane(raw:unknown):Plane{const o=raw as Record<string,unknown>,p=vector(o.point,3),n=vector(o.normal,3);if(zero(n))throw new Error('Zero certificate normal.');return {p,n};}
function circle(raw:unknown,dimension=2):Circle{const o=raw as Record<string,unknown>;if(typeof o.radius!=='number'||!Number.isFinite(o.radius)||o.radius<=0)throw new Error('Invalid certificate radius.');return {p:vector(o.center,dimension),r:c.binary(o.radius)};}
const allowed=(l:Linear,t:c.Q)=>l.kind==='line'||c.sign(t)>=0&&(l.kind==='ray'||c.sign(c.sub(t,c.one))<=0);
const at=(l:Linear,t:c.Q)=>vAdd(l.p,scale(l.u,t));
function interval(l:Linear):{lower?:c.Q;upper?:c.Q}{return {lower:l.kind==='line'?undefined:c.z,upper:l.kind==='segment'?c.one:undefined};}
function collinear(a:Linear,b:Linear):Expected{
 if(a.kind==='line'&&b.kind==='line')return {kind:'coincident'};
 const i=a.u.findIndex(x=>x.n),offset=c.div(c.sub(b.p[i],a.p[i]),a.u[i]),rate=c.div(b.u[i],a.u[i]),first=interval(a);
 let second:{lower?:c.Q;upper?:c.Q}={};
 if(b.kind==='segment'){const end=c.add(offset,rate);second=c.sign(c.sub(end,offset))>=0?{lower:offset,upper:end}:{lower:end,upper:offset};}
 else if(b.kind==='ray')second=c.sign(rate)>0?{lower:offset}:{upper:offset};
 const lower=!first.lower?second.lower:!second.lower?first.lower:c.sign(c.sub(first.lower,second.lower))>=0?first.lower:second.lower;
 const upper=!first.upper?second.upper:!second.upper?first.upper:c.sign(c.sub(first.upper,second.upper))<=0?first.upper:second.upper;
 if(lower&&upper){const s=c.sign(c.sub(lower,upper));if(s>0)return {kind:'none'};if(!s)return {kind:'point',point:at(a,lower)};}
 return {kind:'overlap',interval:{lower,upper},endpoints:[...(lower?[at(a,lower)]:[]),...(upper?[at(a,upper)]:[])]};
}
/** Gram equations independently classify linear intersections in either dimension. */
function lineLine(a:Linear,b:Linear):Expected{
 const delta=vSub(b.p,a.p),aa=dot(a.u,a.u),bb=dot(b.u,b.u),ab=dot(a.u,b.u);
 if(!aa.n){if(!bb.n)return zero(delta)?{kind:'point',point:a.p}:{kind:'none'};
  const s=c.div(dot(vSub(a.p,b.p),b.u),bb);return zero(vSub(at(b,s),a.p))&&allowed(b,s)?{kind:'point',point:a.p}:{kind:'none'};}
 if(!bb.n)return lineLine(b,a);
 const determinant=c.sub(c.mul(aa,bb),c.mul(ab,ab));
 if(!determinant.n){const t=c.div(dot(delta,a.u),aa);return zero(vSub(delta,scale(a.u,t)))?collinear(a,b):{kind:'parallel'};}
 const ad=dot(a.u,delta),bd=dot(b.u,delta),t=c.div(c.sub(c.mul(bb,ad),c.mul(ab,bd)),determinant),s=c.div(c.sub(c.mul(ab,ad),c.mul(aa,bd)),determinant),p=at(a,t),q=at(b,s),separation=vSub(p,q);
 if(zero(separation))return allowed(a,t)&&allowed(b,s)?{kind:'point',point:p,parameters:[t,s]}:{kind:'none'};
 if(a.kind!=='line'||b.kind!=='line')return {kind:'none'};
 return {kind:'skew',closestPoints:[p,q],distanceSquared:dot(separation,separation),parameters:[t,s]};
}
function linePlane(l:Linear,p:Plane):Expected{
 const rhs=dot(vSub(p.p,l.p),p.n),coefficient=dot(l.u,p.n);
 if(!coefficient.n)return {kind:rhs.n?'parallel':'coincident'};
 const t=c.div(rhs,coefficient);return allowed(l,t)?{kind:'point',point:at(l,t),parameters:[t]}:{kind:'none'};
}
/** Solve a 2x2 coordinate subsystem rather than the solver's cross-product formula. */
function planePlane(a:Plane,b:Plane):Expected{
 const direction=cross(a.n,b.n),rhs1=dot(a.n,a.p),rhs2=dot(b.n,b.p);
 if(zero(direction))return {kind:dot(a.n,vSub(b.p,a.p)).n?'parallel':'coincident'};
 const fixed=direction.findIndex(x=>x.n),indices=[0,1,2].filter(i=>i!==fixed),[i,j]=indices;
 const determinant=c.sub(c.mul(a.n[i],b.n[j]),c.mul(a.n[j],b.n[i])),point=[c.z,c.z,c.z];
 point[i]=c.div(c.sub(c.mul(rhs1,b.n[j]),c.mul(rhs2,a.n[j])),determinant);
 point[j]=c.div(c.sub(c.mul(a.n[i],rhs2),c.mul(b.n[i],rhs1)),determinant);
 return {kind:'line',point,direction};
}
function spherePlane(s:Circle,p:Plane):Expected{
 const delta=vSub(s.p,p.p),nn=dot(p.n,p.n),offset=c.div(dot(delta,p.n),nn),radiusSquared=c.sub(c.mul(s.r,s.r),c.mul(c.mul(offset,offset),nn));
 if(radiusSquared.n<0n)return {kind:'none'};
 return {kind:radiusSquared.n?'circle':'point',center:vSub(s.p,scale(p.n,offset)),normal:p.n,radiusSquared};
}
function circleLine(s:Circle,l:Linear):Expected{
 const delta=vSub(l.p,s.p),A=dot(l.u,l.u),B=c.mul(c.q(2n),dot(l.u,delta)),C=c.sub(dot(delta,delta),c.mul(s.r,s.r));
 if(!A.n)return C.n?{kind:'none'}:{kind:'points',points:[l.p.map(c.scalar)],classification:'point',multiplicity:1};
 const parameters=c.roots([C,B,A]).filter(t=>l.kind==='line'||c.aSign(t)>=0&&(l.kind==='ray'||c.aSign(c.aSub(t,c.scalar(c.one)))<=0));
 if(!parameters.length)return {kind:'none'};
 const D=c.sub(c.mul(B,B),c.mul(c.q(4n),c.mul(A,C)));
 return {kind:'points',points:parameters.map(t=>l.p.map((x,i)=>c.aAdd(c.scalar(x),c.aMul(c.scalar(l.u[i]),t)))),classification:D.n?'intersecting':'tangent',multiplicity:D.n?1:2};
}
function circleCircle(a:Circle,b:Circle):Expected{
 const delta=vSub(b.p,a.p),squared=dot(delta,delta),r1=c.mul(a.r,a.r),r2=c.mul(b.r,b.r);
 if(!squared.n)return {kind:c.eq(r1,r2)?'coincident':'none'};
 // The radical axis supplies one linear equation. Its perpendicular offset
 // supplies the two possible roots, checked independently in both circles.
 const fraction=c.div(c.add(c.sub(r1,r2),squared),c.mul(c.q(2n),squared)),base=vAdd(a.p,scale(delta,fraction)),height=c.sub(r1,c.mul(c.mul(fraction,fraction),squared));
 if(height.n<0n)return {kind:'none'};
 const r=c.div(height,squared),perpendicular=[c.neg(delta[1]),delta[0]],signs=height.n?[c.one,c.neg(c.one)]:[c.z];
 return {kind:'points',points:signs.map(sign=>base.map((x,i)=>c.algebraic(x,c.mul(sign,perpendicular[i]),r))),classification:height.n?'intersecting':'tangent',multiplicity:height.n?1:2};
}
function isCircle(raw:unknown){return !!raw&&typeof raw==='object'&&'kind' in raw&&raw.kind==='circle';}
function oracle(request:KernelRequest):Expected|undefined{
 const [op,a,b]=request.args??[];
 if(request.operation==='geometry2d'){
  if(op==='intersection')return isCircle(a)&&isCircle(b)?circleCircle(circle(a),circle(b)):isCircle(a)||isCircle(b)?circleLine(circle(isCircle(a)?a:b),linear(isCircle(a)?b:a,2)):lineLine(linear(a,2),linear(b,2));
  if(op==='circleLine')return circleLine(circle(a),linear(b,2));
  if(op==='circleCircle')return circleCircle(circle(a),circle(b));
 }
 if(request.operation==='geometry3d'){
  if(op==='lineLine')return lineLine(linear(a,3),linear(b,3));
  if(op==='linePlane')return linePlane(linear(a,3),plane(b));
  if(op==='planePlane')return planePlane(plane(a),plane(b));
  if(op==='spherePlane')return spherePlane(circle(a,3),plane(b));
 }return;
}
function magnitude(a:c.Q):c.Q{return c.q(c.abs(a.n),a.d);}
const maximum=(a:c.Q,b:c.Q)=>c.sign(c.sub(a,b))>=0?a:b;
function inputScale(raw:unknown):c.Q{
 if(typeof raw==='number')return magnitude(c.binary(raw));
 if(Array.isArray(raw))return raw.reduce((s:c.Q,x)=>maximum(s,inputScale(x)),c.z);
 if(raw&&typeof raw==='object')return Object.values(raw).reduce((s:c.Q,x)=>maximum(s,inputScale(x)),c.z);
 return c.z;
}
function close(raw:unknown,expected:c.A,scale:c.Q):boolean{
 if(typeof raw!=='number'||!Number.isFinite(raw))return false;
 // Compare the rounded value directly with the exact algebraic value; do not
 // round the oracle first, or tiny tangencies can turn into false certificates.
 const bound=c.scalar(maximum(c.q(1n,1n<<1074n),c.mul(c.binary(2e-10),maximum(scale,magnitude(c.binary(raw)))))),error=c.aSub(c.scalar(c.binary(raw)),expected);
 return c.aSign(c.aSub(error,bound))<=0&&c.aSign(c.aAdd(error,bound))>=0;
}
function numericVector(raw:unknown,expected:c.A[],scale:c.Q){return Array.isArray(raw)&&raw.length===expected.length&&raw.every((x,i)=>close(x,expected[i],scale));}
function exactVector(raw:unknown,expected:V){return Array.isArray(raw)&&raw.length===expected.length&&raw.every((x,i)=>typeof x==='string'&&c.eq(c.readQ(x),expected[i]));}
function normalized(raw:unknown,expected:V):boolean{
 const v=vector(raw,expected.length),norm=dot(v,v);if(!close(c.approximate(norm),c.scalar(c.one),c.one))return false;
 const index=expected.findIndex(x=>x.n),factor=c.div(v[index],expected[index]);
 // Rounded unit vectors need a relative comparison with the direction itself.
 return v.every((x,i)=>close(c.approximate(x),c.scalar(c.mul(factor,expected[i])),c.one));
}
function check(output:Record<string,unknown>,expected:Expected,request:KernelRequest):{passed:boolean;exact:boolean}{
 let exact=true,passed=output.kind===expected.kind;const size=inputScale(request.args?.slice(1));
 const point=(key:string,expected:V)=>{
  passed&&=numericVector(output[key],expected.map(c.scalar),c.z);
  const exactKey=key==='point'?'exactPoint':undefined;
  if(exactKey&&output[exactKey]!==undefined)passed&&=exactVector(output[exactKey],expected);else exact=false;
 };
 if(expected.point){
  if(expected.kind==='line'){
   // Any point on the intersection line is valid, not only the oracle's origin.
   const p=vector(output.point,3),a=plane(request.args?.[1]),b=plane(request.args?.[2]);
   const ep=Array.isArray(output.exactPoint)?output.exactPoint.map(x=>c.readQ(String(x))):undefined;
   if(ep){passed&&=ep.length===3&&!dot(a.n,vSub(ep,a.p)).n&&!dot(b.n,vSub(ep,b.p)).n;passed&&=numericVector(output.point,ep.map(c.scalar),c.z);}else {exact=false;passed&&=close(c.approximate(dot(a.n,vSub(p,a.p))),c.scalar(c.z),c.mul(size,inputScale(request.args?.[1])))&&close(c.approximate(dot(b.n,vSub(p,b.p))),c.scalar(c.z),c.mul(size,inputScale(request.args?.[2])));}
  }else point('point',expected.point);
 }
 if(expected.points){
  exact=false;const points=output.points;
  passed&&=Array.isArray(points)&&points.length===expected.points.length&&expected.points.every(p=>points.filter(x=>numericVector(x,p,size)).length===1);
  passed&&=output.classification===expected.classification&&output.multiplicity===expected.multiplicity;
 }
 if(expected.direction){passed&&=normalized(output.direction,expected.direction);if(output.exactDirection!==undefined){const d=vector(output.direction,3);passed&&=!zero(d)&&exactVector(output.exactDirection,expected.direction);}else exact=false;}
 if(expected.center){point('center',expected.center);passed&&=normalized(output.normal,expected.normal!);}
 if(expected.radiusSquared){exact=false;passed&&=close(output.radius,c.algebraic(c.z,c.one,expected.radiusSquared),circle(request.args?.[1],3).r);if(output.exactRadius!==undefined)passed&&=c.aEqual(c.readRadical(String(output.exactRadius)),c.algebraic(c.z,c.one,expected.radiusSquared));}
 if(expected.closestPoints){exact=false;const ps=output.closestPoints;passed&&=Array.isArray(ps)&&ps.length===2&&ps.every((p,i)=>numericVector(p,expected.closestPoints![i].map(c.scalar),c.z));}
 if(expected.distanceSquared){exact=false;passed&&=close(output.distance,c.algebraic(c.z,c.one,expected.distanceSquared),c.z);passed&&=c.aEqual(c.readRadical(String(output.exactDistance)),c.algebraic(c.z,c.one,expected.distanceSquared));}
 if(expected.interval){
  const interval=output.parameterInterval as Record<string,unknown>|undefined;
  passed&&=!!interval&&interval.lower===(expected.interval.lower?c.text(expected.interval.lower):'-∞')&&interval.upper===(expected.interval.upper?c.text(expected.interval.upper):'∞');
  if(request.operation==='geometry2d'){const ends=output.endpoints;exact=false;passed&&=Array.isArray(ends)&&ends.length===expected.endpoints!.length&&ends.every((p,i)=>numericVector(p,expected.endpoints![i].map(c.scalar),c.z));}
 }
 if(expected.parameters){const ps=expected.parameters.length===1?[output.parameter]:output.parameters;passed&&=exactVector(ps,expected.parameters);}
 return {passed,exact};
}
export function geometryCertificate(request:KernelRequest,result:KernelResult):VerificationEvidence{
 let expected:Expected|undefined;
 try{expected=oracle(request);}catch{return noEvidence('Geometry certificate cannot classify these inputs.');}
 if(!expected)return noEvidence('This geometry operation has no independent certificate.');
 let checked={passed:false,exact:false};
 try{if(result.value&&typeof result.value==='object'){checked=check(result.value as Record<string,unknown>,expected,request);checked.passed&&=result.answer===JSON.stringify(result.value);}}catch{/* Malformed output contradicts a supported intersection. */}
 return {level:checked.passed?checked.exact?'exact_geometric_invariant':'numerical_consistency':'contradicted',passed:checked.passed,independent:true,scope:'intersection',complete:checked.passed,
  method:'Independent binary-rational classification, incidence, parameter domains and complete intersection checks; rounded coordinates use scaled bounds',assumptions:result.conditions,
  ...(!checked.passed?{counterexample:{input:request,expected:expected.kind,actual:result.value,reason:'Returned intersection geometry or classification contradicts the independent certificate.'}}:{})};
}

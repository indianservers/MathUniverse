import type {Fraction} from './exact';
import {coordinates,fp,binaryRational as f,add,sub,mul,div,dot,subtract,approximate,sqrtApproximate} from './geometryPrecision';
import {linear,type Linear2} from './geometryPredicates';
import type {Circle2} from './geometry2d';
const neg=(a:Fraction)=>({...a,numerator:-a.numerator});
function circle(input:unknown):Circle2{const c=input as Circle2;if(!c)throw new Error('A circle is required.');coordinates(c.center,2);if(!(c.radius>0)||!Number.isFinite(c.radius))throw new Error('A circle requires a finite positive radius.');return c;}
// Sign of a + b sqrt(r), without rounding a boundary parameter.
function radicalSign(a:Fraction,b:Fraction,r:Fraction):number{
 const s=(x:Fraction)=>x.numerator<0n?-1:x.numerator>0n?1:0;
 if(!b.numerator||!r.numerator)return s(a);if(!a.numerator||s(a)===s(b))return s(b);
 return s(sub(mul(a,a),mul(mul(b,b),r)))*s(a);
}
function allowed(l:Linear2,base:Fraction,coefficient:Fraction,radicand:Fraction){
 return l.kind==='line'||radicalSign(base,coefficient,radicand)>=0&&(l.kind==='ray'||radicalSign(sub(base,f(1)),coefficient,radicand)<=0);
}
export function circleLineIntersection(input:unknown,host:unknown){
 const c=circle(input),l=linear(host),u=subtract(fp(l.b),fp(l.a)),delta=subtract(fp(l.a),fp(c.center)),A=dot(u,u),C=sub(dot(delta,delta),mul(f(c.radius),f(c.radius)));
 if(!A.numerator)return C.numerator?{kind:'none',points:[]}:{kind:'points',classification:'point',points:[l.a],multiplicity:1};
 const B=mul(f(2),dot(u,delta)),D=sub(mul(B,B),mul(f(4),mul(A,C)));if(D.numerator<0n)return {kind:'none',points:[]};
 const base=div(neg(B),mul(f(2),A)),radicand=div(D,mul(f(4),mul(A,A))),signs=D.numerator?[f(-1),f(1)]:[f(0)];
 const accepted=signs.filter(s=>allowed(l,base,s,radicand));
 const points=accepted.map(s=>u.map((v,i)=>{
  const center=add(f(l.a[i]),mul(base,v)),coefficient=mul(s,v);
  // Scale the radical contribution first so extremely short/long directions work.
  const offset=coefficient.numerator?sqrtApproximate(mul(mul(coefficient,coefficient),radicand))*(coefficient.numerator<0n?-1:1):0;
  return approximate(center)+offset;
 }));
 return points.length?{kind:'points',classification:D.numerator?'intersecting':'tangent',points,multiplicity:D.numerator?1:2}:{kind:'none',points:[]};
}
export function circleCircleIntersection(first:unknown,second:unknown){
 const a=circle(first),b=circle(second),u=subtract(fp(b.center),fp(a.center)),d2=dot(u,u),r=mul(f(a.radius),f(a.radius)),s=mul(f(b.radius),f(b.radius));
 if(!d2.numerator)return sub(r,s).numerator?{kind:'none'}:{kind:'coincident'};
 const k=div(add(sub(r,s),d2),mul(f(2),d2)),h2=sub(r,mul(mul(k,k),d2));if(h2.numerator<0n)return {kind:'none'};
 const base=fp(a.center).map((x,i)=>add(x,mul(k,u[i]))),perpendicular=[neg(u[1]),u[0]],radicand=div(h2,d2);
 const points=(h2.numerator?[-1,1]:[0]).map(sign=>base.map((x,i)=>{
  const coefficient=mul(f(sign),perpendicular[i]),offset=coefficient.numerator?sqrtApproximate(mul(mul(coefficient,coefficient),radicand))*(coefficient.numerator<0n?-1:1):0;
  return approximate(x)+offset;
 }));
 return {kind:'points',classification:h2.numerator?'intersecting':'tangent',points,multiplicity:h2.numerator?1:2};
}

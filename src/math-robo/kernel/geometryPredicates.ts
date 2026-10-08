import {fractionText,type Fraction} from './exact';
import {coordinates,fp,binaryRational as f,add,sub,mul,div,dot,cross2,subtract,approximate} from './geometryPrecision';
export type Linear2={id?:string;kind:'line'|'segment'|'ray';a:number[];b:number[]};
const sign=(x:Fraction)=>x.numerator<0n?-1:x.numerator>0n?1:0;
export function orientation2(a:number[],b:number[],c:number[]):number{return sign(cross2(subtract(fp(coordinates(b,2)),fp(coordinates(a,2))),subtract(fp(coordinates(c,2)),fp(a))));}
export function linear(input:unknown):Linear2{const o=input as Linear2;if(!o||!['line','segment','ray'].includes(o.kind))throw new Error('Use a distinct line, segment or ray object.');coordinates(o.a,2);coordinates(o.b,2);if(o.kind!=='segment'&&o.a.every((x,i)=>x===o.b[i]))throw new Error('A line or ray needs nonzero direction.');return o;}
const allowed=(o:Linear2,t:Fraction)=>o.kind==='line'||sign(t)>=0&&(o.kind==='ray'||sign(sub(t,f(1)))<=0);
export function linearIntersection2(first:Linear2,second:Linear2):unknown{
 const a=fp(first.a),b=fp(second.a),u=subtract(fp(first.b),a),v=subtract(fp(second.b),b),delta=subtract(b,a),den=cross2(u,v);
 if(sign(dot(u,u))===0){if(sign(dot(v,v))===0)return first.a.every((x,i)=>x===second.a[i])?{kind:'point',point:first.a,exactPoint:a.map(fractionText)}:{kind:'none'};const index=sign(v[0])?0:1,t=div(sub(a[index],b[index]),v[index]);return sign(cross2(subtract(a,b),v))===0&&allowed(second,t)?{kind:'point',point:first.a,exactPoint:a.map(fractionText)}:{kind:'none'};}
 if(sign(dot(v,v))===0)return linearIntersection2(second,first);
 if(sign(den)!==0){const t=div(cross2(delta,v),den),s=div(cross2(delta,u),den);if(!allowed(first,t)||!allowed(second,s))return {kind:'none'};const p=a.map((x,i)=>add(x,mul(t,u[i])));if(sign(cross2(subtract(p,b),v))!==0||sign(cross2(subtract(p,a),u))!==0)throw new Error('Exact incidence verification failed.');return {kind:'point',point:p.map(approximate),exactPoint:p.map(fractionText),parameters:[fractionText(t),fractionText(s)]};}
 if(sign(cross2(delta,u))!==0)return {kind:'parallel'};
 const index=sign(u[0])?0:1,t0=div(delta[index],u[index]),rate=div(v[index],u[index]);let low:Fraction|undefined=first.kind==='line'?undefined:f(0),high:Fraction|undefined=first.kind==='segment'?f(1):undefined;
 let otherLow:Fraction|undefined,otherHigh:Fraction|undefined;if(second.kind==='segment'){const t1=add(t0,rate);[otherLow,otherHigh]=sign(sub(t0,t1))<=0?[t0,t1]:[t1,t0];}else if(second.kind==='ray'){if(sign(rate)>0)otherLow=t0;else otherHigh=t0;}
 if(otherLow&&(!low||sign(sub(otherLow,low))>0))low=otherLow;if(otherHigh&&(!high||sign(sub(otherHigh,high))<0))high=otherHigh;
 if(low&&high&&sign(sub(low,high))>0)return {kind:'none'};const point=(t:Fraction)=>a.map((x,i)=>approximate(add(x,mul(t,u[i]))));if(low&&high&&sign(sub(low,high))===0)return {kind:'point',point:point(low)};
 return {kind:'overlap',parameterInterval:{lower:low?fractionText(low):'-∞',upper:high?fractionText(high):'∞'},endpoints:[...(low?[point(low)]:[]),...(high?[point(high)]:[])]};
}

import {rationalAdd as add,rationalSubtract as sub,rationalMultiply as mul,rationalDivide as div} from '../../math-foundation/values';
import {zero,polynomial,gcd,fractionText,type Fraction} from './exact';
import {safeAst} from './safeExpression';
import type {MathAstNode} from '../../math-foundation/types';
export type Poly=Fraction[];
const one:Fraction={numerator:1n,denominator:1n};
export function trim(p:Poly):Poly{p=[...p];while(p.length>1&&p.at(-1)!.numerator===0n)p.pop();return p;}
export function plus(a:Poly,b:Poly,subtract=false):Poly{return trim(Array.from({length:Math.max(a.length,b.length)},(_,i)=>(subtract?sub:add)(a[i]??zero,b[i]??zero)));}
export function times(a:Poly,b:Poly):Poly{if(a.length+b.length>66)throw new Error('Polynomial degree budget exceeded.');const p=Array.from({length:a.length+b.length-1},()=>zero);a.forEach((x,i)=>b.forEach((y,j)=>p[i+j]=add(p[i+j],mul(x,y))));return trim(p);}
export function divide(a:Poly,b:Poly):{quotient:Poly;remainder:Poly}{a=trim(a);b=trim(b);if(b.every(c=>c.numerator===0n))throw new Error('Polynomial division by zero.');const q=Array.from({length:Math.max(1,a.length-b.length+1)},()=>zero);while(a.length>=b.length&&a.some(c=>c.numerator!==0n)){const shift=a.length-b.length,k=div(a.at(-1)!,b.at(-1)!);q[shift]=k;const next=[...a];b.forEach((x,i)=>next[i+shift]=sub(next[i+shift],mul(x,k)));a=trim(next);}return {quotient:trim(q),remainder:a};}
export function polyGcd(a:Poly,b:Poly):Poly{a=trim(a);b=trim(b);for(let i=0;b.some(c=>c.numerator!==0n);i++){if(i>65)throw new Error('Polynomial GCD budget exceeded.');[a,b]=[b,divide(a,b).remainder];}return a.some(c=>c.numerator!==0n)?a.map(c=>div(c,a.at(-1)!)):[zero];}
export const same=(a:Poly,b:Poly)=>plus(a,b,true).every(c=>c.numerator===0n);
export function text(p:Poly,v='x'):string{return trim(p).map((c,i)=>c.numerator===0n?'':i===0?fractionText(c):`(${fractionText(c)})*${v}${i===1?'':`^${i}`}`).filter(Boolean).join('+')||'0';}
export function at(p:Poly,x:Fraction):Fraction{return [...p].reverse().reduce((a,c)=>add(mul(a,x),c),zero);}
export function rationalForm(n:MathAstNode,v='x'):{n:Poly;d:Poly}|undefined{
 const p=polynomial(n,v);if(p)return {n:trim(p),d:[one]};
 if(n.type==='UNARY_OPERATION'){const a=rationalForm(n.operand,v);return a&&{...a,n:a.n.map(c=>n.operator==='-'?{...c,numerator:-c.numerator}:c)};}
 if(n.type!=='BINARY_OPERATION')return;const a=rationalForm(n.left,v),b=rationalForm(n.right,v);if(!a||!b)return;
 if(n.operator==='+')return {n:plus(times(a.n,b.d),times(b.n,a.d)),d:times(a.d,b.d)};
 if(n.operator==='-')return {n:plus(times(a.n,b.d),times(b.n,a.d),true),d:times(a.d,b.d)};
 if(n.operator==='*')return {n:times(a.n,b.n),d:times(a.d,b.d)};
 if(n.operator==='/'){if(b.n.every(c=>!c.numerator))throw new Error('Zero denominator.');return {n:times(a.n,b.d),d:times(a.d,b.n)};}
 return;
}
export function coefficients(source:string,v='x'):Poly{const p=polynomial(safeAst(source),v);if(!p)throw new Error('A bounded rational-coefficient polynomial is required.');return trim(p);}
/** Rational root theorem with exact synthetic division, never numerical root guessing. */
export function rationalFactors(input:Poly):{roots:Fraction[];remaining:Poly}{let p=trim(input);const roots:Fraction[]=[];while(p.length>1&&p[0].numerator===0n){roots.push(zero);p=p.slice(1);}let trials=0;
 while(p.length>3){let denominator=1n;for(const c of p)denominator=denominator/gcd(denominator,c.denominator)*c.denominator;const integers=p.map(c=>c.numerator*(denominator/c.denominator));let common=0n;for(const x of integers)common=gcd(common,x);const constant=integers[0]/common,lead=integers.at(-1)!/common;
  const divisors=(n:bigint)=>{n=n<0n?-n:n;if(n>1000000n)throw new Error('Rational-root divisor enumeration exceeds the 10^6 coefficient budget.');const out:bigint[]=[];for(let k=1n;k*k<=n;k++)if(n%k===0n){out.push(k);if(k*k!==n)out.push(n/k);}return out;};let found:Fraction|undefined;
  outer:for(const a of divisors(constant))for(const b of divisors(lead))for(const sign of [1n,-1n]){if(++trials>10000)throw new Error('Rational-root candidate budget exceeded.');const x=div({numerator:a*sign,denominator:1n},{numerator:b,denominator:1n});if(at(p,x).numerator===0n){found=x;break outer;}}
  if(!found)break;roots.push(found);p=divide(p,[{...found,numerator:-found.numerator},one]).quotient;
 }return {roots,remaining:p};}

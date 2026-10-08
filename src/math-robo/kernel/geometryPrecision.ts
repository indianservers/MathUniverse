import {rationalAdd as add,rationalSubtract as sub,rationalMultiply as mul,rationalDivide as div} from '../../math-foundation/values';
import {gcd,type Fraction} from './exact';
export {add,sub,mul,div};
/** Exact binary rational value of an IEEE-754 coordinate, including subnormals. */
export function binaryRational(x:number):Fraction{if(!Number.isFinite(x))throw new Error('Coordinates must be finite.');if(x===0)return {numerator:0n,denominator:1n};const view=new DataView(new ArrayBuffer(8));view.setFloat64(0,x);const bits=view.getBigUint64(0),exponent=Number(bits>>52n&2047n),mantissa=(bits&((1n<<52n)-1n))+(exponent?1n<<52n:0n),power=(exponent||1)-1023-52;let n=mantissa*(bits>>63n?-1n:1n),d=1n;if(power>=0)n<<=BigInt(power);else d<<=BigInt(-power);const g=gcd(n,d);return {numerator:n/g,denominator:d/g};}
export function approximate(f:Fraction):number{if(!f.numerator)return 0;const negative=f.numerator<0n,n=negative?-f.numerator:f.numerator,ns=Math.max(0,n.toString(2).length-53),ds=Math.max(0,f.denominator.toString(2).length-53),value=Number(n>>BigInt(ns))/Number(f.denominator>>BigInt(ds))*2**(ns-ds)*(negative?-1:1);if(!Number.isFinite(value))throw new Error('The output exceeds finite coordinate precision.');return value;}
export function coordinates(input:unknown,dimension:number):number[]{if(!Array.isArray(input)||input.length!==dimension||input.some(x=>typeof x!=='number'||!Number.isFinite(x)))throw new Error(`Expected ${dimension} finite coordinates.`);return input;}
export const fp=(p:number[])=>p.map(binaryRational);
export const subtract=(a:Fraction[],b:Fraction[])=>a.map((x,i)=>sub(x,b[i]));
export const dot=(a:Fraction[],b:Fraction[])=>a.reduce((s,x,i)=>add(s,mul(x,b[i])),binaryRational(0));
export const cross2=(a:Fraction[],b:Fraction[])=>sub(mul(a[0],b[1]),mul(a[1],b[0]));
export const cross3=(a:Fraction[],b:Fraction[])=>[sub(mul(a[1],b[2]),mul(a[2],b[1])),sub(mul(a[2],b[0]),mul(a[0],b[2])),sub(mul(a[0],b[1]),mul(a[1],b[0]))];
export function finiteTree(value:unknown){if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Nonfinite geometry output.');if(Array.isArray(value))value.forEach(finiteTree);else if(value&&typeof value==='object')Object.values(value).forEach(finiteTree);}

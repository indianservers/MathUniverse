import { simpsonIntegral } from "../../../studios/calculus/calculusEnhancementEngine";
export function gaussianArea(x:number) { return x===0?0:Math.sign(x)*simpsonIntegral(t=>Math.exp(-t*t),0,Math.abs(x),800); }
export function erfValue(x:number) {return 2/Math.sqrt(Math.PI)*gaussianArea(x);}
export function errorFunctionState(x:number) {const area=gaussianArea(x),erf=2/Math.sqrt(Math.PI)*area;return {x,area,erf,erfc:1-erf,normal:.5*(1+erfValue(x/Math.SQRT2)),derivative:2/Math.sqrt(Math.PI)*Math.exp(-x*x)};}
export function diffusionKernel(z:number,tau:number) {return Math.exp(-z*z/(4*tau))/Math.sqrt(4*Math.PI*tau);}
export const errorCurves=Array.from({length:361},(_,i)=>{const x=-3+i/60;return {...errorFunctionState(x),gaussian:Math.exp(-x*x)};});
export function checkErrorPractice(zero:string,interpretation:string,one:string) {const near=(s:string,v:number)=>s.trim()!==""&&Number.isFinite(Number(s))&&Math.abs(Number(s)-v)<=.0000006;return [near(zero,0),interpretation==="integral",near(one,erfValue(1))];}

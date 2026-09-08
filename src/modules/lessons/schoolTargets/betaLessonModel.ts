import { gamma } from "../../probability-statistics/data/distributionAtlas";
import { simpsonIntegral } from "../../../studios/calculus/calculusEnhancementEngine";
export function betaValue(a:number,b:number) { return gamma(a)*gamma(b)/gamma(a+b); }
export function betaIntegrand(a:number,b:number,t:number) { if(t===0)return a<1?Infinity:a===1?1:0;if(t===1)return b<1?Infinity:b===1?1:0;return Math.exp((a-1)*Math.log(t)+(b-1)*Math.log1p(-t)); }
export function betaQuadrature(a:number,b:number) {
  // Split at 1/2 and smooth both endpoint singularities with power substitutions.
  const half=(left:number,right:number)=>{const p=Math.ceil(4/left);return simpsonIntegral(u=>u===0?0:Math.exp(Math.log(p)+left*Math.log(.5)+(p*left-1)*Math.log(u)+(right-1)*Math.log1p(-.5*u**p)),0,1,2000);};
  return half(a,b)+half(b,a);
}
export function betaShape(a:number,b:number) {
  if(a===1&&b===1)return {label:"Uniform",mode:null,note:"Every point has the same density."};
  if(a>1&&b>1)return {label:a===b?"Symmetric hump":a<b?"Right-skewed hump":"Left-skewed hump",mode:(a-1)/(a+b-2),note:"Unique interior mode."};
  if(a<1&&b<1)return {label:"U-shaped",mode:null,note:"Density diverges at both endpoints; no finite interior maximum."};
  if(a<=1&&b>=1)return {label:"Decreasing",mode:null,note:a<1?"Density diverges at 0.":"Maximum at 0."};
  return {label:"Increasing",mode:null,note:b<1?"Density diverges at 1.":"Maximum at 1."};
}
export const betaPresets=[{a:1,b:1,name:"Uniform"},{a:2,b:2,name:"Symmetric"},{a:2,b:5,name:"Right-skewed"},{a:.5,b:.5,name:"U-shaped"},{a:5,b:2,name:"Left-skewed"},{a:1,b:5,name:"Decreasing"},{a:5,b:1,name:"Increasing"},{a:.5,b:2,name:"Peak near zero"}];
export function betaAssessment(values:string[]) {return [1/12,1/3,1/5,Math.PI].map((v,i)=>values[i]?.trim()!==""&&Number.isFinite(Number(values[i]))&&Math.abs(Number(values[i])-v)<=.0006);}

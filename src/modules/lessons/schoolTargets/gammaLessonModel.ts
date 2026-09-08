import { gamma } from "../../probability-statistics/data/distributionAtlas";
import { simpsonIntegral } from "../../../studios/calculus/calculusEnhancementEngine";
export function gammaValue(x:number):number|null { return !Number.isFinite(x)||(x<=0&&Number.isInteger(x))?null:gamma(x); }
export function gammaIntegrand(x:number,t:number) { if(t===0)return x<1?Infinity:x===1?1:0;return Math.exp((x-1)*Math.log(t)-t); }
export function gammaLens(x:number,end=12) {
  // A power substitution removes the integrable endpoint singularity for x < 1.
  const p=Math.ceil(4/x),exponent=p*x-1;
  const partial=simpsonIntegral(s=>s===0?(Math.abs(exponent)<1e-12?p:0):p*Math.pow(s,exponent)*Math.exp(-Math.pow(s,p)),0,Math.pow(end,1/p),4000);
  return {total:gamma(x),partial,tail:Math.max(0,gamma(x)-partial),samples:Array.from({length:301},(_,i)=>{const t=end*i/300;return {t,y:gammaIntegrand(x,t)};})};
}
export function gammaCheck(input:string,answer:number) { return input.trim()!==""&&Number.isFinite(Number(input))&&Math.abs(Number(input)-answer)<=.0006; }
export const gammaCheckpoints=[1,2,3,4,5,6].map(x=>({x,y:gamma(x)}));

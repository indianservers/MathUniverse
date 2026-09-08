import { confidenceIntervalMean } from "../../../visual-proofs/utils/statisticsMath";
import { criticalValues,type ConfidenceLevel } from "./confidenceIntervalsLessonModel";
export function precisionInterval(n:number,sigma:number,confidence:ConfidenceLevel) {
  if(!Number.isInteger(n)||n<1||n>1000000||!Number.isFinite(sigma)||sigma<1||sigma>30||![90,95,99].includes(confidence))throw new Error("Unsupported precision settings.");
  const z=criticalValues[confidence];return {n,sigma,z,...confidenceIntervalMean(50,sigma,n,z)};
}
export function planPrecision(sigma:number,confidence:ConfidenceLevel,target:number) {
  const {z}=precisionInterval(1,sigma,confidence);
  if(!Number.isFinite(target)||target<.5||target>6)throw new Error("Target margin must be between 0.5 and 6.");
  const raw=(z*sigma/target)**2,required=Math.max(1,Math.ceil(raw));
  return {z,raw,required,achieved:precisionInterval(required,sigma,confidence).margin,previous:required>1?precisionInterval(required-1,sigma,confidence).margin:null};
}
export const comparisonSizes=[25,64,100,400];
export function precisionCosts(sigma:number,confidence:ConfidenceLevel) {return [25,100,400,1600].map(n=>({...precisionInterval(n,sigma,confidence),relative:n/25}));}
export const precisionChallenges=[3,1.5,.5];
export function checkPrecisionAnswers(answers:string[]) {return precisionChallenges.map((target,i)=>answers[i]?.trim()!==""&&Number(answers[i])===planPrecision(12,95,target).required);}

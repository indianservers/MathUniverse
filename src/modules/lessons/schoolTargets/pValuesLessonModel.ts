import { randomLcg,randomNormal } from "d3";
import { zEvidence,type Alternative } from "./hypothesisTestsLessonModel";
export function nullZSamples(seed:number) {
  if(!Number.isInteger(seed)||seed<1||seed>4294967295)throw new Error("Seed must be a positive uint32.");
  const sample=randomNormal.source(randomLcg(seed))(0,1);return Array.from({length:1000},()=>sample());
}
export function extremeUnderNull(value:number,observed:number,alternative:Alternative) {return alternative==="two"?Math.abs(value)>=Math.abs(observed):alternative==="greater"?value>=observed:value<=observed;}
export function pValueView(observed:number,alternative:Alternative,samples:number[]) {
  if(!Number.isFinite(observed)||observed< -3.5||observed>3.5||samples.length!==1000||samples.some(v=>!Number.isFinite(v)))throw new Error("Invalid p-value explorer data.");
  const theoretical=zEvidence(observed,.05,alternative),extreme=samples.filter(v=>extremeUnderNull(v,observed,alternative)).length;
  return {...theoretical,extreme,ordinary:samples.length-extreme,simulated:extreme/samples.length};
}
export function stackNullSamples(samples:number[]) {
  const extent=Math.max(3.5,Math.ceil(Math.max(...samples.map(Math.abs))*2)/2),bins=160,counts=Array(bins).fill(0) as number[];
  const dots=samples.map((value,id)=>{const bin=Math.max(0,Math.min(bins-1,Math.floor((value+extent)/(2*extent)*bins))),row=counts[bin]++;return {id,value,bin,row};});
  return {extent,dots,rows:Math.max(...counts)};
}
export const pValueAnswers=[
  "Assuming no improvement and the stated test assumptions, results at least as extreme in the improvement direction have probability 3% under the null model.",
  "There is a 3% probability the new method truly improves scores.",
  "There is a 3% chance the observed results occurred by chance.",
  "The new method improves scores by 3%.",
];
export function correctPValueInterpretation(answer:number) {return answer===0;}

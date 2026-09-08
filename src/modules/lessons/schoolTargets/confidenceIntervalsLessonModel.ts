import { confidenceCoverage } from "../../../studios/statistics/statisticsEnhancementEngine";
import { confidenceIntervalMean } from "../../../visual-proofs/utils/statisticsMath";
export type ConfidenceLevel=90|95|99;
export const criticalValues:Record<ConfidenceLevel,number>={90:1.6448536269514722,95:1.959963984540054,99:2.5758293035489004};
export function intervalForMean(mean:number,n:number,sigma:number,level:ConfidenceLevel) {
  if(!Number.isFinite(mean)||!Number.isInteger(n)||n<4||n>400||!Number.isFinite(sigma)||sigma<1||sigma>30||![90,95,99].includes(level))throw new Error("Unsupported normal-population interval settings.");
  const z=criticalValues[level],se=sigma/Math.sqrt(n),interval=confidenceIntervalMean(mean,sigma,n,z);
  return {...interval,mean,z,se,contains:interval.lower<=50&&interval.upper>=50};
}
export function confidenceRun(n:number,sigma:number,level:ConfidenceLevel,seed:number) {
  intervalForMean(50,n,sigma,level);
  if(!Number.isInteger(seed)||seed<1||seed>4294967295)throw new Error("Seed must be a positive uint32.");
  // Reuse the existing seeded normal-sample engine, retaining each sample mean
  // while recomputing bounds for the selected confidence level.
  const source=confidenceCoverage(50,sigma,n,100,seed);
  const intervals=source.intervals.map(({low,high},i)=>({id:i+1,...intervalForMean((low+high)/2,n,sigma,level)}));
  return {intervals,covered:intervals.filter(i=>i.contains).length};
}
export const confidenceQuestions=[
  {prompt:"With n = 64, σ = 12 and 95% confidence, what is the margin of error?",options:["1.50","2.35","2.94","3.12"],correct:2,explanation:"ME = 1.96 × 12 / √64 ≈ 2.94."},
  {prompt:"If n increases to 256, with other values unchanged, what happens to the interval width?",options:["Stays the same","Gets wider","Gets narrower","Cannot tell"],correct:2,explanation:"The standard error and interval width halve when n is multiplied by four."},
  {prompt:"If confidence changes from 95% to 99%, with other values unchanged, what happens to the interval width?",options:["Stays the same","Gets wider","Gets narrower","Depends only on σ"],correct:1,explanation:"The larger critical value creates a wider interval."},
  {prompt:"Which interpretation is correct?",options:["There is a 95% probability μ is in this computed interval.","About 95% of intervals made this way contain μ.","μ is guaranteed to be in every 95% interval.","The sample mean equals μ with 95% probability."],correct:1,explanation:"Confidence refers to the long-run coverage of the method."},
];
export function gradeConfidenceAnswers(answers:number[]) {return confidenceQuestions.map((q,i)=>answers[i]===q.correct);}

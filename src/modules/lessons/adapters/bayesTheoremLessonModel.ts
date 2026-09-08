export type DiagnosticParameters = { population: number; baseRate: number; sensitivity: number; specificity: number };
export const defaultDiagnosticParameters: DiagnosticParameters = { population: 1000, baseRate: 0.1, sensitivity: 0.9, specificity: 0.9 };
export function clampRate(value:number){return Math.max(0,Math.min(1,Number.isFinite(value)?value:0))}
export function diagnosticSummary(parameters:DiagnosticParameters){
 const population=Math.max(1,Math.round(parameters.population)),baseRate=clampRate(parameters.baseRate),sensitivity=clampRate(parameters.sensitivity),specificity=clampRate(parameters.specificity); const disease=Math.round(population*baseRate),noDisease=population-disease,truePositive=Math.round(disease*sensitivity),falseNegative=disease-truePositive,trueNegative=Math.round(noDisease*specificity),falsePositive=noDisease-trueNegative,positive=truePositive+falsePositive,negative=falseNegative+trueNegative,posterior=positive?truePositive/positive:0;
 return {population,baseRate,sensitivity,specificity,disease,noDisease,truePositive,falseNegative,trueNegative,falsePositive,positive,negative,posterior};
}
export type BayesQuestion={baseRate:number;sensitivity:number;specificity:number;options:number[]};
export const bayesQuestions:BayesQuestion[]=[{baseRate:.05,sensitivity:.95,specificity:.95,options:[.32,.167,.095,.5]},{baseRate:.02,sensitivity:.9,specificity:.98,options:[.479,.02,.9,.31]},{baseRate:.2,sensitivity:.85,specificity:.8,options:[.515,.85,.2,.68]}];
export function questionAnswer(question:BayesQuestion){return diagnosticSummary({population:10000,...question}).posterior}

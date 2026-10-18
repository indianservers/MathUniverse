export type IntegralFunctionId = "linear" | "square" | "shifted" | "sine";
export const integralFunctions = {
  linear: { label: "f(x) = x", latex: "x", value: (x: number) => x, primitive: (x: number) => x*x/2, min: -1, max: 5, ticks: [-1,0,1,2,3,4,5] },
  square: { label: "f(x) = x²", latex: "x^2", value: (x: number) => x*x, primitive: (x: number) => x*x*x/3, min: -2, max: 18, ticks: [0,4,8,12,16] },
  shifted: { label: "f(x) = x − 2", latex: "x-2", value: (x: number) => x-2, primitive: (x: number) => x*x/2-2*x, min: -3, max: 3, ticks: [-3,-2,-1,0,1,2,3] },
  sine: { label: "f(x) = sin x", latex: String.raw`\sin x`, value: (x: number) => Math.sin(x), primitive: (x: number) => -Math.cos(x), min: -1.4, max: 1.4, ticks: [-1,-.5,0,.5,1] },
};
export function splitIntegral(id: IntegralFunctionId, c: number) {
  if(!Number.isFinite(c)||c<0||c>4)throw new RangeError("Split point must lie in [0, 4]");
  const f=integralFunctions[id],left=f.primitive(c)-f.primitive(0),right=f.primitive(4)-f.primitive(c),total=f.primitive(4)-f.primitive(0);
  return {left,right,total};
}
export const propertyChoices = [
  {id:"A",label:"Zero-width interval"}, {id:"B",label:"Additivity"}, {id:"C",label:"Reversal of limits"}, {id:"D",label:"Constant multiple"}, {id:"E",label:"Even function symmetry"}, {id:"F",label:"Odd function symmetry"},
];
export const matchingAnswers = ["C","A","B","D","E","F"];
export function gradePropertyMatches(answers: string[]) {
  const rows=matchingAnswers.map((expected,i)=>answers[i]===expected);
  return {rows,score:rows.filter(Boolean).length,complete:rows.every(Boolean)};
}

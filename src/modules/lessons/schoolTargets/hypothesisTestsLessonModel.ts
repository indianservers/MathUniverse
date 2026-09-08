import { normalCdf,normalQuantile,normalSurvival } from "../../../phase4/statistics";
export type Alternative="two"|"greater"|"less";
export const alternatives:{value:Alternative;label:string;symbol:string}[]=[{value:"two",label:"Two-sided (≠)",symbol:"≠"},{value:"greater",label:"Greater than (>)",symbol:">"},{value:"less",label:"Less than (<)",symbol:"<"}];
export function zEvidence(z:number,alpha:number,alternative:Alternative) {
  if(!Number.isFinite(z)||!Number.isFinite(alpha)||alpha<.001||alpha>.2||!alternatives.some(a=>a.value===alternative))throw new Error("Invalid test settings.");
  const p=z===0?(alternative==="two"?1:.5):Math.max(0,Math.min(1,alternative==="two"?2*normalSurvival(Math.abs(z)):alternative==="greater"?normalSurvival(z):normalCdf(z)));
  const critical=normalQuantile(1-alpha/(alternative==="two"?2:1));
  return {z,p,alpha,alternative,critical,criticalValues:alternative==="two"?[-critical,critical]:[alternative==="greater"?critical:-critical],reject:p<alpha};
}
export function meanZTest(mean:number,sigma:number,n:number,alpha:number,alternative:Alternative) {
  if(!Number.isFinite(mean)||mean<40||mean>60||!Number.isFinite(sigma)||sigma<1||sigma>30||!Number.isInteger(n)||n<4||n>400)throw new Error("Unsupported one-sample mean settings.");
  const se=sigma/Math.sqrt(n);return {...zEvidence((mean-50)/se,alpha,alternative),mean,sigma,n,se};
}
export function coinZTest(n:number,heads:number,p0:number,alternative:Alternative) {
  if(!Number.isInteger(n)||n<20||n>400||!Number.isInteger(heads)||heads<0||heads>n||!Number.isFinite(p0)||p0<.1||p0>.9)throw new Error("Unsupported coin sample.");
  const expectedHeads=n*p0,expectedTails=n*(1-p0),eligible=expectedHeads>=10&&expectedTails>=10;
  return {...zEvidence((heads-expectedHeads)/Math.sqrt(n*p0*(1-p0)),.05,alternative),eligible,n,heads,p0,expectedHeads,expectedTails};
}
export function formatP(p:number){return p<.0001?"< 0.0001":`≈ ${p.toFixed(4)}`;}

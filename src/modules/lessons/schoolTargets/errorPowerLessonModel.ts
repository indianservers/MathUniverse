import { normalCdf,normalQuantile,normalSurvival } from "../../../phase4/statistics";
export type PowerTest="one"|"two";
const cdf=(z:number)=>z===0?.5:normalCdf(z);
const survival=(z:number)=>z===0?.5:normalSurvival(z);
export function errorPower(alpha:number,mu1:number,n:number,test:PowerTest) {
  if(!Number.isFinite(alpha)||alpha<.001||alpha>.2||!Number.isFinite(mu1)||mu1<50||mu1>60||!Number.isInteger(n)||n<10||n>200||!["one","two"].includes(test))throw new Error("Unsupported power settings.");
  const se=6/Math.sqrt(n),d=(mu1-50)/se,critical=normalQuantile(1-alpha/(test==="two"?2:1)),lower=test==="two"?50-critical*se:-Infinity,upper=50+critical*se;
  const beta=mu1===50?1-alpha:Math.max(0,Math.min(1,test==="one"?cdf(critical-d):cdf(critical-d)-cdf(-critical-d)));
  const power=mu1===50?alpha:Math.max(0,Math.min(1,test==="one"?survival(critical-d):survival(critical-d)+cdf(-critical-d)));
  return {alpha,mu1,n,test,se,d,critical,lower,upper,beta,power,alternativeTrue:mu1!==50};
}
export function errorProbability(value:number){return value>0&&value<.001?"< 0.001":value<1&&value>.999?"> 0.999":value.toFixed(3);}
export function planErrorPower(alpha:number,mu1:number,test:PowerTest,target:number) {
  errorPower(alpha,mu1,10,test);
  if(!Number.isFinite(target)||target<.5||target>.99)throw new Error("Target power must be 0.5 to 0.99.");
  if(mu1===50)return null;
  for(let n=10;n<=200;n++){const result=errorPower(alpha,mu1,n,test);if(result.power>=target)return result;}
  return null;
}
export const errorQuestions=[
  {question:"If we lower α from 0.05 to 0.01 with n and a nonzero true effect fixed, what happens?",options:["α decreases, β decreases","α decreases, β increases","α increases, β decreases","α increases, β increases"],correct:1},
  {question:"Which action increases power for a fixed nonzero effect, σ and test direction?",options:["Lower the significance level α","Increase the sample size n","Decrease the true effect","Use a stricter cutoff"],correct:1},
  {question:"A test has α = 0.05 and power = 0.80 at a specified alternative. What is β?",options:["0.05","0.20","0.80","0.95"],correct:1},
];

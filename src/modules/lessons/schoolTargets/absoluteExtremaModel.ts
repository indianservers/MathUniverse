export const extremaFunction=(x:number)=>x*x*x-3*x+1;
export type ExtremaCandidate={x:number;value:number;kind:"left"|"right"|"critical";included:boolean};
const equal=(a:number,b:number)=>Math.abs(a-b)<=1e-9*(1+Math.max(Math.abs(a),Math.abs(b)));
export function analyzeExtrema(a:number,b:number,closed:boolean){
 if(!Number.isFinite(a)||!Number.isFinite(b)||a>=b)throw new RangeError("Finite endpoints with a < b required");
 const candidates:ExtremaCandidate[]=[{x:a,value:extremaFunction(a),kind:"left",included:closed},{x:b,value:extremaFunction(b),kind:"right",included:closed}];
 for(const x of[-1,1])if(x>a&&x<b)candidates.push({x,value:extremaFunction(x),kind:"critical",included:true});candidates.sort((p,q)=>p.x-q.x);
 const supremum=Math.max(...candidates.map(c=>c.value)),infimum=Math.min(...candidates.map(c=>c.value)),maxAt=candidates.filter(c=>c.included&&equal(c.value,supremum)).map(c=>c.x),minAt=candidates.filter(c=>c.included&&equal(c.value,infimum)).map(c=>c.x);
 return{candidates,supremum,infimum,maximum:maxAt.length?supremum:null,minimum:minAt.length?infimum:null,maxAt,minAt};
}
export function candidateClassification(candidate:ExtremaCandidate,analysis:ReturnType<typeof analyzeExtrema>){
 if(!candidate.included)return"excluded";const maximum=analysis.maxAt.some(x=>equal(x,candidate.x)),minimum=analysis.minAt.some(x=>equal(x,candidate.x));return maximum&&minimum?"both":maximum?"maximum":minimum?"minimum":candidate.kind==="critical"?(candidate.x===-1?"local-maximum":"local-minimum"):"neither";
}
export function clampExtremaEndpoint(side:"a"|"b",value:number,a:number,b:number){if(!Number.isFinite(value))return side==="a"?a:b;const rounded=Math.round(value*20)/20;return side==="a"?Math.max(-5,Math.min(Number((b-.1).toFixed(2)),rounded)):Math.min(5,Math.max(Number((a+.1).toFixed(2)),rounded));}
export function extremaFrame(a:number,b:number){const analysis=analyzeExtrema(a,b,true),margin=Math.max(.5,(analysis.supremum-analysis.infimum)*.12);return{xmin:Math.min(-3.2,a-.8),xmax:Math.max(3.2,b+.8),ymin:Math.min(-3.2,analysis.infimum-margin),ymax:Math.max(3.8,analysis.supremum+margin)};}
export function extremaTicks(min:number,max:number,target=7){const raw=(max-min)/target,power=10**Math.floor(Math.log10(raw)),ratio=raw/power,step=(ratio<=1?1:ratio<=2?2:ratio<=5?5:10)*power;return Array.from({length:Math.ceil((max-min)/step)+2},(_,i)=>Math.ceil(min/step)*step+i*step).filter(x=>x<=max+step*1e-6).map(x=>Number(x.toFixed(6)));}
export function numericExtremaAnswer(source:string):number|null{const s=source.trim().replace(/−/g,"-").replace(/\s/g,"");if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(s)||s.length>64)return null;const parts=s.split("/").map(Number),result=parts.length===2?parts[0]/parts[1]:parts[0];return Number.isFinite(result)?result:null;}
export function gradeExtremaPractice(a:number,b:number,maxAnswer:string,minAnswer:string){const analysis=analyzeExtrema(a,b,true),max=numericExtremaAnswer(maxAnswer),min=numericExtremaAnswer(minAnswer),maximumCorrect=max!==null&&Math.abs(max-analysis.maximum!)<=.0006,minimumCorrect=min!==null&&Math.abs(min-analysis.minimum!)<=.0006;return{maximumCorrect,minimumCorrect,correct:maximumCorrect&&minimumCorrect,message:maximumCorrect&&minimumCorrect?"Correct: both extrema match the candidate comparison.":max===null||min===null?"Enter both maximum and minimum values.":"Recheck the endpoints and all interior critical points; use at least three decimal places."};}

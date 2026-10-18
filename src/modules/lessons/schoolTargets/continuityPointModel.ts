export type ContinuityPointRule='linear'|'constant';
export const pointLimit=(rule:ContinuityPointRule)=>rule==='linear'?2:1;
export const pointNearby=(x:number,rule:ContinuityPointRule)=>rule==='linear'?x+1:1;
export function pointContinuity(value:number|null,rule:ContinuityPointRule){const exists=value!==null,limit=pointLimit(rule),equal=exists&&value===limit;return{exists,limit,equal,continuous:equal,conditions:[exists,true,equal]};}
export function pointFrame(zoom:number){const half=4/zoom;return{xmin:-half,xmax:half,ymin:1.5-half,ymax:1.5+half};}
export const clampPointValue=(value:number)=>Math.max(-2,Math.min(5,value));
export const pointPractice=[{value:'0',answer:'No'},{value:'2',answer:'Yes'},{value:'5',answer:'No'},{value:'Not defined',answer:'No'}];
export function gradePointPractice(answers:string[]){return pointPractice.map((r,i)=>r.answer===answers[i]);}
export function parsePointValue(text:string){if(text.trim()==='')return null;const value=Number(text);return Number.isFinite(value)?clampPointValue(value):null;}

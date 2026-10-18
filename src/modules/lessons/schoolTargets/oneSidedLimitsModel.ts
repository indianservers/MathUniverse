export type OneSidedScenario='continuous'|'jump';
export const oneSidedRightLimit=(s:OneSidedScenario)=>s==='continuous'?2:3;
export const oneSidedBranch=(x:number,side:'left'|'right',s:OneSidedScenario)=>side==='left'?x+1:(s==='continuous'?3:4)-x;
export function oneSidedState(s:OneSidedScenario,value:number|null){const right=oneSidedRightLimit(s),exists=right===2;return{left:2,right,exists,limit:exists?2:null,continuous:exists&&value===2};}
export const clampOneSidedProbe=(side:'left'|'right',x:number)=>side==='left'?Math.max(-1,Math.min(.999,Math.round(x*1000)/1000)):Math.max(1.001,Math.min(3,Math.round(x*1000)/1000));
export function moveOneSidedProbe(side:'left'|'right',value:number,left:number,right:number,locked:boolean){const x=clampOneSidedProbe(side,value);return side==='left'?{left:x,right:locked?Math.round((2-x)*1000)/1000:right}:{left:locked?Math.round((2-x)*1000)/1000:left,right:x};}
export const oneSidedEpsilon=(left:number,right:number)=>Math.round(Math.max(1-left,right-1)*1000)/1000;
export const epsilonFromPosition=(p:number)=>Math.max(.001,Math.min(2,Math.round(.001*2000**(p/1000)*1000)/1000));
export const epsilonPosition=(e:number)=>Math.log(e/.001)/Math.log(2000)*1000;
export function oneSidedFrame(zoom:number,value:number|null){const low=Math.min(-1.3,value===null?-1.3:value-Math.max(1,Math.abs(value)*.15)),high=Math.max(4.5,value===null?4.5:value+Math.max(1,Math.abs(value)*.15)),center=(low+high)/2,half=(high-low)/2/zoom;return{xmin:1-3.5/zoom,xmax:1+3.5/zoom,ymin:center-half,ymax:center+half};}
export function parseOneSidedAnswer(text:string){const v=text.trim();if(!v)return null;const parts=v.split('/');if(parts.length>2||parts.some(p=>!p.trim()||!Number.isFinite(Number(p))))return null;const n=Number(parts[0])/(parts.length===2?Number(parts[1]):1);return Number.isFinite(n)?n:null;}
export function gradeOneSidedAnswers(answers:string[],scenario:OneSidedScenario){return answers.map((a,i)=>i===2&&scenario==='jump'?/^(dne|does\s+not\s+exist)$/i.test(a.trim()):parseOneSidedAnswer(a)===(i===1?oneSidedRightLimit(scenario):2));}
export function oneSidedNumberTex(n:number){const [m,e]=String(n).split('e');return e===undefined?m:`${m}\\times10^{${Number(e)}}`;}

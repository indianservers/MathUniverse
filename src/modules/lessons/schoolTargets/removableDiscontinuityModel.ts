export const removableLimit=4;
export const originalRemovable=(x:number)=>x===2?null:x+2;
export const currentRemovable=(x:number,defined:number|null)=>x===2?defined:x+2;
export function removableStatus(defined:number|null){return{exists:defined!==null,repaired:defined===4,conditions:[true,defined!==null,defined===4]};}
export const clampRepairValue=(n:number)=>Math.max(-2,Math.min(8,n));
export const clampRepairProbe=(side:'left'|'right',x:number)=>side==='left'?Math.max(1.5,Math.min(1.999,Math.round(x*1000)/1000)):Math.max(2.001,Math.min(2.5,Math.round(x*1000)/1000));
export const removableRows=[1.8,1.9,1.99,2,2.01,2.1,2.2];
export function repairNumber(n:number){return String(Number(n.toFixed(6)));}
export function repairTexNumber(n:number){const [mantissa,exponent]=String(n).split('e');return exponent?`${mantissa}\\times10^{${Number(exponent)}}`:mantissa;}
export function parseRepairAnswer(raw:string){const s=raw.trim().replace(/−/g,'-').replace(/\s/g,'');if(!s)return null;const match=s.match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(?:\/([+-]?(?:\d+(?:\.\d*)?|\.\d+)))?$/);if(!match)return null;const denominator=match[2]===undefined?1:Number(match[2]),n=Number(match[1])/denominator;return denominator!==0&&Number.isFinite(n)?n:null;}
export function gradeRepairAnswer(raw:string){const value=parseRepairAnswer(raw);return{correct:value!==null&&Math.abs(value-6)<1e-9,message:!raw.trim()?'Enter a value before checking.':value===null?'Enter a finite number or fraction.':Math.abs(value-6)<1e-9?'Correct: g(3) = 6 makes the function continuous.':'Recheck by factoring x² − 9 and evaluating the simplified expression at 3.'};}

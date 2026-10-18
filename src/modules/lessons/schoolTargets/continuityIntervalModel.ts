export function semicircleValue(x:number){return Math.abs(x)>2?null:Math.sqrt(Math.max(0,4-x*x));}
export function intervalContinuity(a:number,b:number,hole:number|null){const interior=hole===null||hole<=a||hole>=b,left=hole!==a,right=hole!==b;return{interior,left,right,continuous:interior&&left&&right,fa:hole===a?null:semicircleValue(a),fb:hole===b?null:semicircleValue(b)};}
export function clampContinuityEndpoint(side:'a'|'b',n:number,a:number,b:number){const value=Math.round(n*100)/100;return side==='a'?Math.max(-2,Math.min(Math.round((b-.1)*100)/100,value)):Math.min(2,Math.max(Math.round((a+.1)*100)/100,value));}
export const clampContinuityHole=(n:number)=>Math.max(-2,Math.min(2,Math.round(n*100)/100));
export function continuityFrame(zoom:number){const half=3/zoom,yhalf=half*410/595;return{xmin:-half,xmax:half,ymin:.5-yhalf,ymax:.5+yhalf};}
export const continuityPractice=[{interval:'[-2, 2]',values:['Yes','Yes','Yes','Yes']},{interval:'[-1, 2]',values:['Yes','Yes','Yes','Yes']},{interval:'[-2, 1]',values:['Yes','Yes','Yes','Yes']},{interval:'(−2, 2)',values:['Yes','N/A','N/A','Yes']}];
export function continuityPracticeGrade(answers:string[][]){return continuityPractice.map((row,i)=>row.values.map((value,j)=>value===answers[i]?.[j]));}
export function semicircleRange(hole:number|null){return hole===0?'[0,2)':'[0,2]';}

export const reciprocalValue=(x:number,a:number)=>1/(x-a);
export function asymptoteXFrame(a:number){return{xmin:Math.min(-6,a-4),xmax:Math.max(6,a+4)};}
export function reciprocalFrame(a:number,left:number,right:number){const extent=Math.max(6.5,Math.abs(reciprocalValue(left,a))*1.12,Math.abs(reciprocalValue(right,a))*1.12);return{...asymptoteXFrame(a),ymin:-extent,ymax:extent};}
export function clampAsymptoteProbe(side:'left'|'right',x:number,a:number){const frame=asymptoteXFrame(a),value=Math.round(x*1e6)/1e6;return side==='left'?Math.max(frame.xmin+.15,Math.min(a-.001,value)):Math.min(frame.xmax-.15,Math.max(a+.001,value));}
export const clampAsymptote=(a:number)=>Math.max(-5,Math.min(5,Math.round(a*100)/100));
export const distanceFromPosition=(p:number)=>10**(Math.max(0,Math.min(300,p))/100-3);
export const positionFromDistance=(e:number)=>Math.max(0,Math.min(300,100*(Math.log10(e)+3)));
export function limitRows(a:number,epsilon:number){return([-1,1]as const).flatMap(side=>[epsilon,epsilon/10,epsilon/100].map((distance,i)=>({side:side<0?'Left':'Right',power:i,x:a+side*distance,offset:side*distance,value:side/distance})));}
export function reciprocalBranch(a:number,side:-1|1,frame:ReturnType<typeof reciprocalFrame>){const far=side<0?a-frame.xmin:frame.xmax-a,near=1/(Math.max(Math.abs(frame.ymin),Math.abs(frame.ymax))*2);return Array.from({length:801},(_,i)=>{const distance=side<0?far*(near/far)**(i/800):near*(far/near)**(i/800);return{x:a+side*distance,y:side/distance};});}
export function reciprocalDenominator(a:number){return a===0?'x':`x${a<0?'+':'-'}${Math.abs(a)}`;}
export function infiniteTicks(min:number,max:number,target=10){const raw=(max-min)/target,p=10**Math.floor(Math.log10(raw)),r=raw/p,step=(r<=1?1:r<=2?2:r<=5?5:10)*p;return Array.from({length:Math.ceil((max-min)/step)+2},(_,i)=>Math.ceil(min/step)*step+i*step).filter(v=>v<=max+1e-8).map(v=>Number(v.toFixed(6)));}
export const infinitePractice=[{formula:'g(x)=\\dfrac{3}{x+1}',point:-1,left:'-infinity',right:'infinity'},{formula:'h(x)=\\dfrac{-2}{x-3}',point:3,left:'infinity',right:'-infinity'},{formula:'k(x)=\\dfrac{5}{2x}',point:0,left:'-infinity',right:'infinity'}];
export function gradeInfinitePractice(answers:string[]){const expected=infinitePractice.flatMap(q=>[q.left,q.right]).concat('Infinite');return expected.map((value,i)=>answers[i]?.trim()?answers[i]===value:null);}

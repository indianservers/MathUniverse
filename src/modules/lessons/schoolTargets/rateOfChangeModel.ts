export const ratePosition=(t:number)=>t*t+2*t;
export const rateVelocity=(t:number)=>2*t+2;
export const averageRate=(a:number,b:number)=>a===b?null:a+b+2;
export const feetPerMeter=1/.3048;
export function rateSnapshot(a:number,b:number,t:number,scale=1){return{start:ratePosition(a)*scale,end:ratePosition(b)*scale,position:ratePosition(t)*scale,average:(a+b+2)*scale,instant:rateVelocity(t)*scale,match:Math.abs(a+b-2*t)<1e-8};}
export function clampRatePoint(kind:"a"|"b"|"time",value:number,a:number,b:number){const v=Math.round(value*100)/100;return kind==="a"?Math.max(0,Math.min(Math.round((b-.1)*100)/100,v)):kind==="b"?Math.min(5,Math.max(Math.round((a+.1)*100)/100,v)):Math.max(0,Math.min(5,v));}
export function motionProgress(start:number,elapsed:number,speed:number,loop:boolean){const raw=start+Math.max(0,elapsed)*speed;return{time:Math.round((loop?raw%5:Math.min(5,raw))*100)/100,finished:!loop&&raw>=5};}
export const motionPositionPercent=(t:number)=>8+84*ratePosition(t)/ratePosition(5);
export function rateGraphFrame(a:number,b:number,t:number,zoom:number,scale:number,centered=false){const lo=Math.min(a,b,t),hi=Math.max(a,b,t),width=Math.max(7/zoom,hi-lo+.8),xmin=centered?(lo+hi-width)/2:-.5,xmax=Math.max(xmin+width,hi+.35),ymax=Math.max(22/zoom,ratePosition(hi)*1.14)*scale;return{xmin,xmax,ymin:-1.5*scale,ymax};}
export function rateTicks(min:number,max:number,target=10){const raw=(max-min)/target,p=10**Math.floor(Math.log10(raw)),r=raw/p,step=(r<=1?1:r<=2?2:r<=5?5:10)*p;return Array.from({length:Math.ceil((max-min)/step)+2},(_,i)=>Math.ceil(min/step)*step+i*step).filter(v=>v<=max+1e-8).map(v=>Number(v.toFixed(6)));}
export const matchingChallenge=(x:number)=>({average:x+2,target:6,match:Math.abs(x-4)<1e-8});

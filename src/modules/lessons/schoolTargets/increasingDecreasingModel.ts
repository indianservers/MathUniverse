export const cubicValue=(x:number,a:number,b:number)=>x**3+a*x+b;
export const cubicSlope=(x:number,a:number)=>3*x*x+a;
export const monotonicStatus=(slope:number)=>Math.abs(slope)<1e-8?"stationary":slope>0?"increasing":"decreasing";
export function cubicCriticalPoints(a:number){return a<0?[-Math.sqrt(-a/3),Math.sqrt(-a/3)]:a===0?[0]:[];}
export function cubicAnalysis(a:number,b:number){return cubicCriticalPoints(a).map(x=>({x,value:cubicValue(x,a,b),second:6*x,kind:a===0?"stationary inflection":x<0?"local maximum":"local minimum"}));}
export const clampCubicProbe=(x:number)=>Math.max(-3.5,Math.min(3.5,Math.round(x*100)/100));
export function cubicViewport(x:number,a:number,b:number,zoom:number,centered=false){const radius=4.5/zoom,half=Math.max(6.5,Math.abs(cubicValue(x,a,b))*1.12,...cubicAnalysis(a,b).map(c=>Math.abs(c.value)*1.3));return{xmin:centered?x-radius:Math.min(-radius,x-.4),xmax:centered?x+radius:Math.max(radius,x+.4),ymin:-half/Math.min(zoom,1),ymax:half/Math.min(zoom,1)};}
export function cubicTicks(min:number,max:number){const raw=(max-min)/8,p=10**Math.floor(Math.log10(raw)),r=raw/p,step=(r<=1?1:r<=2?2:r<=5?5:10)*p;return Array.from({length:Math.ceil((max-min)/step)+2},(_,i)=>Math.ceil(min/step)*step+i*step).filter(v=>v<=max+1e-8).map(v=>Number(v.toFixed(6)));}
export function cubicExpression(a:number,b:number){return `x^3${a===0?"":`${a<0?"-":"+"}${Math.abs(a)===1?"":Math.abs(a)}x`}${b===0?"":`${b<0?"-":"+"}${Math.abs(b)}`}`;}
export function cubicDerivativeExpression(a:number){return `3x^2${a===0?"":`${a<0?"-":"+"}${Math.abs(a)}`}`;}

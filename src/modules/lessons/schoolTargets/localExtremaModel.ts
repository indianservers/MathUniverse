export const localFunction=(x:number)=>x*x*x-3*x;
export const localDerivative=(x:number)=>3*x*x-3;
export function localProbe(x:number){const slope=localDerivative(x),zero=Math.abs(slope)<1e-8;return{value:localFunction(x),slope,sign:zero?"Zero (0)":slope>0?"Positive (+)":"Negative (−)",region:zero?(x<0?1:3):slope<0?2:x<0?0:4};}
export const clampLocalPoint=(value:number)=>Math.max(-2.6,Math.min(2.6,Math.round(value*100)/100));
export const scanLocalProbe=(start:number,seconds:number)=>clampLocalPoint(start+.65*Math.max(0,seconds));
export const localTangent=(at:number,x:number)=>localFunction(at)+localDerivative(at)*(x-at);
export function localGraphFrame(x:number){const extent=Math.max(3.5,Math.abs(localFunction(x))*1.15);return{xmin:-3.2,xmax:3.2,ymin:-extent,ymax:extent};}
export function localTicks(min:number,max:number,target=7){const raw=(max-min)/target,power=10**Math.floor(Math.log10(raw)),ratio=raw/power,step=(ratio<=1?1:ratio<=2?2:ratio<=5?5:10)*power;return Array.from({length:Math.ceil((max-min)/step)+2},(_,i)=>Math.ceil(min/step)*step+i*step).filter(x=>x<=max+step*1e-6).map(x=>Number(x.toFixed(6)));}
export function classifyDerivativeSigns(left:-1|0|1,right:-1|0|1){return left===1&&right===-1?"maximum":left===-1&&right===1?"minimum":left===right&&left!==0?"neither":"inconclusive";}
export const quarticFunction=(x:number)=>x**4-4*x*x+1;
export const quarticDerivative=(x:number)=>4*x*x*x-8*x;
export const quarticExtrema=[{x:-Math.sqrt(2),value:quarticFunction(-Math.sqrt(2)),kind:"minimum"},{x:0,value:1,kind:"maximum"},{x:Math.sqrt(2),value:quarticFunction(Math.sqrt(2)),kind:"minimum"}];
export function gradeStationaryUnderstanding(choice:string){return{correct:choice==="1",message:choice==="1"?"Correct: h′(x) = 3x² is positive on both sides of 0. The function increases through a stationary inflection point.":choice==="0"?"h″(0) = 0 makes the second derivative test inconclusive. Check h′ on both sides.":choice==="2"?"h(x) = x³ is continuous everywhere. Compare the derivative signs near 0.":choice==="3"?"The value h(0) = 0 does not classify the point. Compare h′ on both sides.":"Choose an option before checking."};}

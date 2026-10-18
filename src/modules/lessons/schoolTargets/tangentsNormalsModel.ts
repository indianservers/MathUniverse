export const parabola=(x:number)=>x*x;
export const tangentSlope=(p:number)=>2*p;
export function tangentNormal(p:number,q:number){const tangent=2*p,normal=tangent===0?null:-1/tangent,secant=q===p?null:p+q;return{value:p*p,tangent,normal,secant,tangentIntercept:-p*p,normalIntercept:normal===null?null:p*p-normal*p};}
export const clampTangentPoint=(v:number)=>Math.max(-2.5,Math.min(2.5,Math.round(v*10000)/10000));
export const clampSecantPoint=(v:number)=>Math.max(-3,Math.min(3,Math.round(v*10000)/10000));
export function tangentViewport(p:number,q:number,zoom:number){const half=Math.max(3.2/zoom,Math.abs(p)+.25,Math.abs(q)+.25,(Math.max(p*p,q*q)+3.1)*510/1360);return{xmin:-half,xmax:half,ymin:-2.5,ymax:-2.5+2*half*680/510};}
export function tangentTicks(min:number,max:number){const raw=(max-min)/7,p=10**Math.floor(Math.log10(raw)),r=raw/p,step=(r<=1?1:r<=2?2:r<=5?5:10)*p;return Array.from({length:Math.ceil((max-min)/step)+2},(_,i)=>Math.ceil(min/step)*step+i*step).filter(v=>v<=max+1e-8).map(v=>Number(v.toFixed(6)));}
export function secantRows(p:number){return[.5,.2,.1,.01,.001,.0001].map(h=>({h,q:p+h,value:(p+h)**2,slope:2*p+h}));}
export function decimal(value:number,digits=4){return Number(value.toFixed(digits));}
export function linearEquation(slope:number,intercept:number){const m=decimal(slope),c=decimal(intercept);return `y=${m===0?"":m===1?"x":m===-1?"-x":`${m}x`}${c===0?(m===0?"0":""):m===0?`${c}`:`${c>0?"+":"-"}${Math.abs(c)}`}`;}
export function normalEquation(p:number){const n=tangentNormal(p,p);return n.normal===null?`x=${decimal(p)}`:linearEquation(n.normal,n.normalIntercept!);}
function fractionTex(n:number,d:number){const sign=n*d<0?"-":"";n=Math.abs(n);d=Math.abs(d);let a=n,b=d;while(b){const r=a%b;a=b;b=r;}n/=a;d/=a;return d===1?`${sign}${n}`:`${sign}\\dfrac{${n}}{${d}}`;}
export function normalSlopeTex(p:number){return p===0?"\\text{undefined}":fractionTex(-10000,2*Math.round(p*10000));}
export function normalEquationTex(p:number){if(p===0)return"x=0";const pn=Math.round(p*10000);return`y=${normalSlopeTex(p)}x+${fractionTex(pn*pn+50000000,100000000)}`;}

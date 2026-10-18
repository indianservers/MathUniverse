export function differentialApproximation(a:number,dx:number){
 if(!Number.isFinite(a)||!Number.isFinite(dx)||a<=0||a+dx<0)throw new RangeError("Use a positive base and a defined square root");
 const fa=Math.sqrt(a),actual=Math.sqrt(a+dx),derivative=1/(2*fa),delta=dx/(actual+fa),dy=derivative*dx,approximation=fa+dy,error=dx*dx/(2*fa*(actual+fa)**2),percentage=delta===0?0:error/Math.abs(delta)*100;
 return{fa,actual,derivative,delta,dy,approximation,error,percentage};
}
export function differentialFrame(a:number,dx:number,zoom:number){
 if(!Number.isFinite(zoom)||zoom<=0)throw new RangeError("Positive zoom required");const r=differentialApproximation(a,dx),baseSpan=Math.max(7,a+dx+1),span=Math.max(baseSpan/zoom,Math.abs(dx)*1.6,.01),xmin=zoom<=1?0:Math.max(0,a+dx/2-span/2),xmax=xmin+span,baseY=Math.max(4.5,Math.sqrt(xmax)*1.2,r.approximation*1.15),height=Math.max(baseY/zoom,Math.abs(r.dy)*2,.015),ymin=zoom<=1?0:Math.max(0,(r.fa+r.approximation)/2-height/2),ymax=zoom<=1?baseY:ymin+height;return{xmin,xmax,ymin,ymax};
}
export function axisTicks(min:number,max:number,target=6){const raw=(max-min)/target,power=10**Math.floor(Math.log10(raw)),ratio=raw/power,step=(ratio<=1?1:ratio<=2?2:ratio<=5?5:10)*power;return Array.from({length:Math.ceil((max-min)/step)+2},(_,i)=>Math.ceil(min/step)*step+i*step).filter(x=>x<=max+step*1e-6).map(x=>Number(x.toFixed(6)));}
export function dxPosition(dx:number){const v=Math.max(.001,Math.min(1,dx));return v<=.1?Math.log10(v/.001)*25:50+Math.log10(v/.1)*50;}
export function positionDx(position:number){const p=Math.max(0,Math.min(100,position));return p<=50?.001*10**(p/25):.1*10**((p-50)/50);}
export const shrinkChange=(dx:number,seconds:number,speed:number)=>Math.max(.001,dx*Math.exp(-1.25*speed*Math.max(0,seconds)));
export const cubeRootEstimate=3+.3/27;
export function gradeCubeRootEstimate(answer:string){const text=answer.trim().replace(/\s/g,"");if(!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:\/[+-]?(?:\d+(?:\.\d*)?|\.\d+))?$/.test(text))return{attempted:false,correct:false,message:"Enter a numerical estimate first."};const [n,d]=text.split("/").map(Number),value=d===undefined?n:n/d;if(!Number.isFinite(value))return{attempted:false,correct:false,message:"Enter a finite numerical estimate."};const correct=Math.abs(value-cubeRootEstimate)<.00002;return{attempted:true,correct,message:correct?"Correct: 3.01111 is the differential estimate.":"Use f′(27) = 1/27 and add f′(27)·0.3 to 3."};}

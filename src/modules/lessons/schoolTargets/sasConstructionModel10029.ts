export type SasData10029={ab:number;ac:number;angle:number};
export type SasPoint10029={x:number;y:number};
export type SasFrame10029={scale:number;offset:number;base:number};
export const sasInitial10029:SasData10029={ab:6,ac:4,angle:55},sasChallenge10029:SasData10029={ab:5,ac:7,angle:60};
export function sasSet10029(d:SasData10029,key:keyof SasData10029,n:number){if(!Number.isFinite(n))return d;return{...d,[key]:key==='angle'?Math.round(Math.max(10,Math.min(120,n))):Math.round(Math.max(1,Math.min(10,n))*10)/10};}
export function sasSolve10029(d:SasData10029){if(![d.ab,d.ac,d.angle].every(Number.isFinite)||d.ab<=0||d.ac<=0||d.angle<=0||d.angle>=180)return null;const a=d.angle*Math.PI/180,p={x:d.ac*Math.cos(a),y:d.ac*Math.sin(a)},bc=Math.hypot(d.ab-p.x,p.y),b=Math.atan2(p.y,d.ab-p.x)*180/Math.PI;return{p,bc,b,c:180-d.angle-b};}
export function sasDraft10029(d:SasData10029):SasPoint10029{return{x:d.ac*.65,y:d.ac*.25};}
export function sasMeasure10029(d:SasData10029,p:SasPoint10029){const ac=Math.hypot(p.x,p.y),angle=Math.atan2(p.y,p.x)*180/Math.PI,b=Math.atan2(p.y,d.ab-p.x)*180/Math.PI;return{ac,angle,bc:Math.hypot(d.ab-p.x,p.y),b,c:180-angle-b};}
export function sasGrade10029(d:SasData10029,p:SasPoint10029,placed:boolean){if(!placed)return'pending';if(!sasSolve10029(d)||![p.x,p.y].every(Number.isFinite)||p.y<=0)return'retry';const m=sasMeasure10029(d,p);return Math.abs(m.ac-d.ac)<=.05+1e-10&&Math.abs(m.angle-d.angle)<=.5+1e-10?'correct':'retry';}
export function sasClampPoint10029(p:SasPoint10029){return{x:Math.max(-10,Math.min(10,p.x)),y:Math.max(.1,Math.min(10,p.y))};}
export function sasSnap10029(d:SasData10029,p:SasPoint10029,enabled:boolean,pixelsPerCm:number){const target=sasSolve10029(d)!.p;return enabled&&Math.hypot(p.x-target.x,p.y-target.y)*pixelsPerCm<=18?target:sasClampPoint10029(p);}
export function sasLayout10029(d:SasData10029,p?:SasPoint10029,fixed?:SasFrame10029){const s=sasSolve10029(d)!,min=Math.min(0,s.p.x,p?.x??0),max=Math.max(d.ab,s.p.x,p?.x??0),height=Math.max(s.p.y,p?.y??0),scale=Math.min(360/d.ab,440/Math.max(.1,max-min),300/Math.max(.1,height)),frame=fixed??{scale,offset:300-(min+max)*scale/2,base:420},point=(q:SasPoint10029)=>({x:frame.offset+q.x*frame.scale,y:frame.base-q.y*frame.scale});return{...s,frame,a:point({x:0,y:0}),b:point({x:d.ab,y:0}),target:point(s.p),point:point(p??s.p)};}

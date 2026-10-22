import {cyclicNames,cyclicNormalize,moveCyclicVertex,type CyclicName,type CyclicPoint} from './oppositeCyclicModel';
export type CyclicVertex={angle:number;radius:number};
export type CyclicVertices=Record<CyclicName,CyclicVertex>;
export const cyclicDefaults:CyclicVertices={A:{angle:112,radius:1},B:{angle:31,radius:1},C:{angle:298,radius:1},D:{angle:202,radius:1}};
export function cyclicQuadrilateralModel(vertices:CyclicVertices){
 const points=Object.fromEntries(cyclicNames.map(n=>{const v=vertices[n],a=v.angle*Math.PI/180;return[n,{x:v.radius*Math.cos(a),y:v.radius*Math.sin(a)}];})) as Record<CyclicName,CyclicPoint>;
 const angles=Object.fromEntries(cyclicNames.map((n,i)=>{const p=points[n],b=points[cyclicNames[(i+3)%4]],a=points[cyclicNames[(i+1)%4]],u={x:b.x-p.x,y:b.y-p.y},v={x:a.x-p.x,y:a.y-p.y};return[n,cyclicNormalize(Math.atan2(u.x*v.y-u.y*v.x,u.x*v.x+u.y*v.y)*180/Math.PI)];})) as Record<CyclicName,number>;
 const a=points.A,c=points.C,d=points.D,den=2*(a.x*(c.y-d.y)+c.x*(d.y-a.y)+d.x*(a.y-c.y));
 let fitted:null|{center:CyclicPoint;radius:number;residual:number}=null;
 if(Math.abs(den)>1e-10){const aa=a.x*a.x+a.y*a.y,cc=c.x*c.x+c.y*c.y,dd=d.x*d.x+d.y*d.y,center={x:(aa*(c.y-d.y)+cc*(d.y-a.y)+dd*(a.y-c.y))/den,y:(aa*(d.x-c.x)+cc*(a.x-d.x)+dd*(c.x-a.x))/den},radius=Math.hypot(a.x-center.x,a.y-center.y),b=points.B;fitted={center,radius,residual:Math.abs(Math.hypot(b.x-center.x,b.y-center.y)-radius)};}
 const sums={AC:angles.A+angles.C,BD:angles.B+angles.D},onReference=cyclicNames.filter(n=>Math.abs(vertices[n].radius-1)<1e-8).length;
 return{points,angles,sums,onReference,fitted,cyclic:!!fitted&&fitted.residual<1e-8&&Math.abs(sums.AC-180)<1e-7&&Math.abs(sums.BD-180)<1e-7};
}
export function moveQuadrilateralVertex(vertices:CyclicVertices,name:CyclicName,angle:number,radius:number,snap=false):CyclicVertices{
 if(!Number.isFinite(angle)||!Number.isFinite(radius))return vertices;
 const positions=Object.fromEntries(cyclicNames.map(n=>[n,vertices[n].angle])) as Record<CyclicName,number>,i=cyclicNames.indexOf(name),current=positions[name],previous=current+cyclicNormalize(positions[cyclicNames[(i+3)%4]]-current),next=current-cyclicNormalize(current-positions[cyclicNames[(i+1)%4]]),candidate=current+cyclicNormalize(angle-current+180)-180;
 const bounded=Math.max(Math.max(next+8,previous-172),Math.min(Math.min(previous-8,next+172),candidate)),moved=moveCyclicVertex(positions,name,bounded);
 return{...vertices,[name]:{angle:moved[name],radius:snap?1:Math.round(Math.max(.55,Math.min(1.25,radius))*10000)/10000}};
}
export function quadrilateralSector(p:CyclicPoint,before:CyclicPoint,after:CyclicPoint,angle:number,r=31){
 const a=Math.atan2(before.y-p.y,before.x-p.x),b=Math.atan2(after.y-p.y,after.x-p.x),cross=(before.x-p.x)*(after.y-p.y)-(before.y-p.y)*(after.x-p.x),reflex=angle>180,sweep=reflex?(cross>0?0:1):(cross>0?1:0);
 return `M${p.x} ${p.y}L${p.x+r*Math.cos(a)} ${p.y+r*Math.sin(a)}A${r} ${r} 0 ${reflex?1:0} ${sweep} ${p.x+r*Math.cos(b)} ${p.y+r*Math.sin(b)}Z`;
}

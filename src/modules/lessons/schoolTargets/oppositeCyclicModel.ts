export type CyclicName = 'A'|'B'|'C'|'D';
export type CyclicPoint = {x:number;y:number};
export const cyclicNames:CyclicName[]=['A','B','C','D'];
export const defaultCyclicPositions:Record<CyclicName,number>={A:110,B:30,C:258,D:166};
export const cyclicNormalize=(v:number)=>((v%360)+360)%360;
export const cyclicPoint=(v:number):CyclicPoint=>({x:Math.cos(v*Math.PI/180),y:Math.sin(v*Math.PI/180)});
const gap=(a:number,b:number)=>cyclicNormalize(a-b);
export function oppositeCyclicModel(positions:Record<CyclicName,number>){
 const gaps=cyclicNames.map((n,i)=>gap(positions[n],positions[cyclicNames[(i+1)%4]]));
 if(gaps.some(g=>g<1e-7)||Math.abs(gaps.reduce((a,b)=>a+b,0)-360)>1e-7)throw new Error('Vertices must be distinct and in clockwise cyclic order');
 const points=Object.fromEntries(cyclicNames.map(n=>[n,cyclicPoint(positions[n])])) as Record<CyclicName,CyclicPoint>;
 const angles=Object.fromEntries(cyclicNames.map((n,i)=>{const p=points[n],b=points[cyclicNames[(i+3)%4]],a=points[cyclicNames[(i+1)%4]],u={x:b.x-p.x,y:b.y-p.y},v={x:a.x-p.x,y:a.y-p.y};return[n,Math.atan2(Math.abs(u.x*v.y-u.y*v.x),u.x*v.x+u.y*v.y)*180/Math.PI];})) as Record<CyclicName,number>;
 const intercepted={BCD:gaps[1]+gaps[2],CDA:gaps[2]+gaps[3],DAB:gaps[3]+gaps[0],ABC:gaps[0]+gaps[1]};
 return{points,angles,gaps,intercepted,sums:{AC:angles.A+angles.C,BD:angles.B+angles.D}};
}
export function moveCyclicVertex(positions:Record<CyclicName,number>,name:CyclicName,requested:number){
 if(!Number.isFinite(requested))return positions;
 const i=cyclicNames.indexOf(name),current=positions[name],previous=positions[cyclicNames[(i+3)%4]],next=positions[cyclicNames[(i+1)%4]];
 const candidate=current+((requested-current+540)%360+360)%360-180;
 const value=Math.max(current-gap(current,next)+8,Math.min(current+gap(previous,current)-8,candidate));
 return{...positions,[name]:cyclicNormalize(Math.round(value*1000)/1000)};
}
export const cyclicChallengePositions=(angle:number):Record<CyclicName,number>=>({A:90,B:0,C:360-angle,D:360-2*angle});
export function cyclicSector(p:CyclicPoint,before:CyclicPoint,after:CyclicPoint,r=31){
 const a=Math.atan2(before.y-p.y,before.x-p.x),b=Math.atan2(after.y-p.y,after.x-p.x),cross=(before.x-p.x)*(after.y-p.y)-(before.y-p.y)*(after.x-p.x);
 return `M${p.x} ${p.y}L${p.x+r*Math.cos(a)} ${p.y+r*Math.sin(a)}A${r} ${r} 0 0 ${cross>0?1:0} ${p.x+r*Math.cos(b)} ${p.y+r*Math.sin(b)}Z`;
}

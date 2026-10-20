export type SectionPoint={x:number;y:number};
export function internalSectionModel(a:SectionPoint,b:SectionPoint,m:number,n:number){
 if(![a.x,a.y,b.x,b.y,m,n].every(Number.isFinite)||m<=0||n<=0)throw new Error('Finite coordinates and positive ratios required');
 const t=m/(m+n),p={x:a.x+t*(b.x-a.x),y:a.y+t*(b.y-a.y)},ab=Math.hypot(b.x-a.x,b.y-a.y),ap=Math.hypot(p.x-a.x,p.y-a.y),pb=Math.hypot(b.x-p.x,b.y-p.y);
 return {p,t,ab,ap,pb,ratio:ab===0?null:ap/pb,defined:ab!==0};
}
export function internalProjection(a:SectionPoint,b:SectionPoint,q:SectionPoint){
 const dx=b.x-a.x,dy=b.y-a.y,base=Math.hypot(dx,dy);if(base===0)return null;
 const t=Math.max(.000001,Math.min(.999999,((q.x-a.x)*(dx/base)+(q.y-a.y)*(dy/base))/base));
 return Math.round(t*1000000)/1000000;
}

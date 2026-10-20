import{semiPerimeter10080,type Sides10080,type Point10080,type Points10080}from'./semiPerimeterModel10080';
export type HeronSides10079=Sides10080;
export type HeronPoint10079=Point10080;
export type HeronPoints10079=Points10080;
export function heronDerivation10079(sides:HeronSides10079){const m=semiPerimeter10080(sides),x=(sides.a*sides.a+sides.c*sides.c-sides.b*sides.b)/(2*sides.a),h=m.area===null?null:2*m.area/sides.a;return{...m,x:h===null?null:x,h,remainder:h===null?null:sides.a-x,outside:h!==null&&(x<0||x>sides.a)};}
export function heronPoints10079(sides:HeronSides10079):HeronPoints10079|null{const m=heronDerivation10079(sides);return m.h===null?null:{a:{x:m.x!,y:m.h},b:{x:0,y:0},c:{x:sides.a,y:0}};}
export function heronSides10079(p:HeronPoints10079){return{a:Math.hypot(p.c.x-p.b.x,p.c.y-p.b.y),b:Math.hypot(p.a.x-p.c.x,p.a.y-p.c.y),c:Math.hypot(p.a.x-p.b.x,p.a.y-p.b.y)};}
export function heronAltitude10079(p:HeronPoints10079){const dx=p.c.x-p.b.x,dy=p.c.y-p.b.y,base=Math.hypot(dx,dy),ux=dx/base,uy=dy/base,x=(p.a.x-p.b.x)*ux+(p.a.y-p.b.y)*uy,d={x:p.b.x+x*ux,y:p.b.y+x*uy},h=Math.hypot(p.a.x-d.x,p.a.y-d.y);return{x,h,d,remainder:base-x,outside:x<0||x>base,ux,uy,base};}
export function heronFit10079(p:HeronPoints10079){const d=heronAltitude10079(p).d,ps=[...Object.values(p),d],minX=Math.min(...ps.map(v=>v.x)),maxX=Math.max(...ps.map(v=>v.x)),minY=Math.min(...ps.map(v=>v.y)),maxY=Math.max(...ps.map(v=>v.y)),scale=Math.min(35,280/Math.max(.01,maxX-minX),260/Math.max(.01,maxY-minY));return{scale,x:180-(minX+maxX)*scale/2,y:155+(minY+maxY)*scale/2};}
export const heronOrder10079=['A','B','E','C','F','D'];
export function checkHeronOrder10079(order:string[]){return order.length===6&&order.every((v,i)=>v===heronOrder10079[i]);}
export function reorderHeron10079(order:string[],from:number,to:number){if(from<0||to<0||from>=order.length||to>=order.length)return order;const next=[...order],item=next.splice(from,1)[0];next.splice(to,0,item);return next;}

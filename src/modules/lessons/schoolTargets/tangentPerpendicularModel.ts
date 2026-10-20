export type CircleLinePoint={x:number;y:number};
export const normalizeCircleAngle=(v:number)=>((v%360)+360)%360;
export const normalizeCircleLine=(v:number)=>((v%180)+180)%180;
export function tangentPerpendicularModel(tAngle:number,lineAngle:number,offset=0,r=6){
 const theta=tAngle*Math.PI/180,phi=lineAngle*Math.PI/180,t={x:r*Math.cos(theta),y:r*Math.sin(theta)},direction={x:Math.cos(phi),y:Math.sin(phi)},normal={x:-Math.sin(phi),y:Math.cos(phi)},base={x:t.x+normal.x*offset,y:t.y+normal.y*offset},signed=base.x*normal.x+base.y*normal.y,distance=Math.abs(signed),foot={x:normal.x*signed,y:normal.y*signed},eps=1e-9;
 const count=distance>r+eps?0:Math.abs(distance-r)<=eps?1:2,delta=Math.abs(normalizeCircleLine(tAngle)-normalizeCircleLine(lineAngle)),angle=Math.min(delta,180-delta),onLine=Math.abs(offset)<=eps,perpendicular=count===1&&onLine&&Math.abs(angle-90)<=1e-8;
 const half=count===2?Math.sqrt(Math.max(0,r*r-distance*distance)):0,intersections:CircleLinePoint[]=count===0?[]:count===1?[foot]:[{x:foot.x+direction.x*half,y:foot.y+direction.y*half},{x:foot.x-direction.x*half,y:foot.y-direction.y*half}];
 return{t,direction,normal,base,signed,distance,foot,count,angle,onLine,perpendicular,intersections,status:count===1?'TANGENT':count===2?'SECANT':'NO INTERSECTION'};
}
export function visibleLineHandle(base:CircleLinePoint,u:CircleLinePoint){const reach=(sign:number)=>{const dx=u.x*sign,dy=u.y*sign;return Math.min(dx>1e-9?(649-base.x)/dx:dx< -1e-9?(35-base.x)/dx:Infinity,dy>1e-9?(465-base.y)/dy:dy< -1e-9?(35-base.y)/dy:Infinity);},a=reach(1),b=reach(-1),sign=a>=b?1:-1,len=Math.min(190,Math.max(20,Math.max(a,b)*.8));return{x:base.x+u.x*sign*len,y:base.y+u.y*sign*len};}

export type SemicirclePoint={x:number;y:number};
export const semicircleMin=2,semicircleMax=178;
export const clampSemicircle=(v:number)=>Math.round(Math.max(semicircleMin,Math.min(semicircleMax,v))*1000)/1000;
const angle=(p:SemicirclePoint,a:SemicirclePoint,b:SemicirclePoint)=>{const u={x:a.x-p.x,y:a.y-p.y},v={x:b.x-p.x,y:b.y-p.y};return Math.atan2(Math.abs(u.x*v.y-u.y*v.x),u.x*v.x+u.y*v.y)*180/Math.PI;};
export function semicircleModel(theta:number,radius=6.31){
 if(!Number.isFinite(theta)||theta<=0||theta>=180||!Number.isFinite(radius)||radius<=0)throw new Error('A positive radius and non-endpoint upper semicircle position are required');
 const a={x:-radius,y:0},b={x:radius,y:0},radians=theta*Math.PI/180,c={x:radius*Math.cos(radians),y:radius*Math.sin(radians)},ac=Math.hypot(c.x-a.x,c.y-a.y),bc=Math.hypot(c.x-b.x,c.y-b.y),diameter=2*radius,lhs=ac*ac+bc*bc,rhs=diameter*diameter;
 return{a,b,c,ac,bc,diameter,angleA:angle(a,b,c),angleB:angle(b,c,a),angleC:angle(c,a,b),lhs,rhs,verified:Math.abs(lhs-rhs)<=1e-10*Math.max(1,rhs)};
}
export function advanceSemicircle(motion:{theta:number;direction:number},step:number){let next=motion.theta+motion.direction*step,direction=motion.direction;if(next>semicircleMax){next=2*semicircleMax-next;direction=-1;}else if(next<semicircleMin){next=2*semicircleMin-next;direction=1;}return{theta:next,direction};}

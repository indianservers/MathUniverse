export type TangentPoint={x:number;y:number};
export const normalizeTangentAngle=(v:number)=>((v%360)+360)%360;
export function externalTangents(distance:number,direction:number,radius=6){
 const valid=[distance,direction,radius].every(Number.isFinite)&&radius>0&&distance>radius,a=Math.acos(radius/distance)*180/Math.PI;
 const polar=(d:number,angle:number)=>({x:d*Math.cos(angle*Math.PI/180),y:d*Math.sin(angle*Math.PI/180)}),O={x:0,y:0},P=polar(distance,direction),A=polar(radius,direction+a),B=polar(radius,direction-a),pa=Math.hypot(P.x-A.x,P.y-A.y),pb=Math.hypot(P.x-B.x,P.y-B.y);
 const scale=Math.min(27,240/Math.max(radius,-P.x),290/Math.max(radius,P.x),190/Math.max(radius,P.y),190/Math.max(radius,-P.y));
 return{valid,alpha:a,points:{O,P,A,B},pa,pb,difference:Math.abs(pa-pb),scale};
}
export function tangentRightAngle(t:TangentPoint,o:TangentPoint,p:TangentPoint,size=13){const n=(v:TangentPoint)=>{const l=Math.hypot(v.x,v.y);return{x:v.x/l,y:v.y/l};},u=n({x:o.x-t.x,y:o.y-t.y}),v=n({x:p.x-t.x,y:p.y-t.y});return[{x:t.x+u.x*size,y:t.y+u.y*size},{x:t.x+(u.x+v.x)*size,y:t.y+(u.y+v.y)*size},{x:t.x+v.x*size,y:t.y+v.y*size}];}

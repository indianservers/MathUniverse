export type SegmentPoint={x:number;y:number};
export const segmentUnit=(degrees:number):SegmentPoint=>({x:Math.cos(degrees*Math.PI/180),y:Math.sin(degrees*Math.PI/180)});
const normalize=(v:number)=>((v%360)+360)%360;
export function safeSegmentPosition(requested:number,previous:number,a=218,b=322){
 if(!Number.isFinite(requested))return previous;
 let value=normalize(Math.round(requested*1000)/1000);
 for(const endpoint of[a,b]){const delta=normalize(value-endpoint+180)-180;if(Math.abs(delta)<2){const prior=normalize(previous-endpoint+180)-180;value=normalize(endpoint+(delta===0?(prior<0?-2:2):(delta<0?-2:2)));}}
 return value;
}
const interior=(p:SegmentPoint,a:SegmentPoint,b:SegmentPoint)=>{const u={x:a.x-p.x,y:a.y-p.y},v={x:b.x-p.x,y:b.y-p.y};if(Math.hypot(u.x,u.y)<1e-10||Math.hypot(v.x,v.y)<1e-10)return null;return Math.atan2(Math.abs(u.x*v.y-u.y*v.x),u.x*v.x+u.y*v.y)*180/Math.PI;};
export function sameSegmentModel(cAngle:number,dAngle:number,aAngle=218,bAngle=322){
 const a=segmentUnit(aAngle),b=segmentUnit(bAngle),c=segmentUnit(cAngle),d=segmentUnit(dAngle),angleC=interior(c,a,b),angleD=interior(d,a,b),cross=(p:SegmentPoint)=>(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x),valid=angleC!==null&&angleD!==null;
 const sameSegment=valid&&cross(c)*cross(d)>0,minor=Math.min(normalize(bAngle-aAngle),normalize(aAngle-bAngle));
 return{a,b,c,d,angleC,angleD,valid,sameSegment,relation:valid?(sameSegment?'equal':'supplementary'):'undefined',difference:valid?Math.abs(angleC-angleD):null,sum:valid?angleC+angleD:null,minor,interceptedC:angleC===null?null:angleC*2,interceptedD:angleD===null?null:angleD*2};
}
export function segmentAngleLabel(p:SegmentPoint,a:SegmentPoint,b:SegmentPoint,r=45){
 const u={x:a.x-p.x,y:a.y-p.y},v={x:b.x-p.x,y:b.y-p.y},lu=Math.hypot(u.x,u.y),lv=Math.hypot(v.x,v.y),x=u.x/lu+v.x/lv,y=u.y/lu+v.y/lv,l=Math.hypot(x,y);
 return{x:p.x+r*x/l,y:p.y+r*y/l};
}

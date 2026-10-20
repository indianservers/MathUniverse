import{segmentUnit}from'./sameSegmentModel';
export const arcPosition=(p:number)=>Math.round(Math.max(.04,Math.min(.96,p))*1e6)/1e6;
export function arcAngleModel(position:number,minor=118.4){
 if(!Number.isFinite(position)||position<=0||position>=1||!Number.isFinite(minor)||minor<=0||minor>=180)throw new Error('A non-endpoint major-arc position and a minor arc below180degrees are required');
 const aAngle=270-minor/2,bAngle=270+minor/2,major=360-minor,cAngle=(bAngle+position*major)%360,a=segmentUnit(aAngle),b=segmentUnit(bAngle),c=segmentUnit(cAngle),u={x:a.x-c.x,y:a.y-c.y},v={x:b.x-c.x,y:b.y-c.y},central=Math.atan2(Math.abs(a.x*b.y-a.y*b.x),a.x*b.x+a.y*b.y)*180/Math.PI,inscribed=Math.atan2(Math.abs(u.x*v.y-u.y*v.x),u.x*v.x+u.y*v.y)*180/Math.PI,ratio=central/inscribed;
 return{a,b,c,aAngle,bAngle,cAngle,major,central,inscribed,ratio,valid:Math.abs(central-2*inscribed)<1e-9};
}
export function arcPositionFromAngle(degrees:number){const delta=((degrees-329.2)%360+360)%360;return arcPosition(delta<=241.6?delta/241.6:(delta-241.6<360-delta?1:0));}

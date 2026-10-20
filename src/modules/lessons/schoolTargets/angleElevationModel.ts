export function angleElevationModel(d:number,angle:number,eye:number){
 const valid=[d,angle,eye].every(Number.isFinite)&&d>0&&angle>0&&angle<90&&eye>=0,tan=Math.tan(angle*Math.PI/180),height=valid?d*tan:null,total=height===null?null:height+eye;
 const ax=72,ay=332,run=Math.min(338,260/tan),rise=run*tan,bx=ax+run,cy=ay-rise;
 const scale=total?Math.min(280/total,330/d):1,sceneAx=80,groundY=330,sceneBx=sceneAx+d*scale,sceneAy=groundY-eye*scale,sceneCy=groundY-(total??0)*scale;
 return{valid,tan,height,total,ax,ay,bx,by:ay,cy,scale,sceneAx,sceneBx,sceneAy,sceneCy,groundY};
}
export function elevationAngleFromPoint(x:number,y:number){return Math.max(5,Math.min(80,Math.atan2(Math.max(0,332-y),Math.max(.001,x-72))*180/Math.PI));}

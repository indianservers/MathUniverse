export function shadowLengthModel(angle:number,shadow:number){
 const valid=Number.isFinite(angle)&&Number.isFinite(shadow)&&angle>0&&angle<90&&shadow>0,tan=Math.tan(angle*Math.PI/180),height=valid?shadow*tan:null;
 const maxRun=Math.min(390,260/tan),run=maxRun*shadow/(shadow+1),scale=run/shadow,objectX=210,groundY=325,topY=groundY-run*tan,endpointX=objectX+run;
 const radians=angle*Math.PI/180,extension=Math.max(0,Math.min((objectX-50)/Math.cos(radians),(topY-55)/Math.sin(radians)));
 return{valid,tan,height,maxRun,run,scale,objectX,groundY,topY,endpointX,sunX:objectX-extension*Math.cos(radians),sunY:topY-extension*Math.sin(radians)};
}
export function shadowFromSceneX(angle:number,x:number){const tan=Math.tan(angle*Math.PI/180),maxRun=Math.min(390,260/tan),f=Math.max(1/3,Math.min(20/21,(x-210)/maxRun));return f/(1-f);}
export const displayLength=(metres:number,unit:'m'|'cm')=>metres*(unit==='cm'?100:1);

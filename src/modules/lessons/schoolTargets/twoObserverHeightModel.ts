export const tangent=(degrees:number)=>Math.tan(degrees*Math.PI/180);
export function twoObserverHeightModel(alpha:number,beta:number,d:number){
 const valid=[alpha,beta,d].every(Number.isFinite)&&alpha>beta&&beta>0&&alpha<90&&d>0;
 const x=valid?d*tangent(beta)/(tangent(alpha)-tangent(beta)):null,h=x===null?null:x*tangent(alpha);
 return{valid,x,h,far:x===null?null:x+d};
}
export function twoObserverScene(alpha:number,beta:number,d:number,frozenRise?:number|null){
 const m=twoObserverHeightModel(alpha,beta,d),towerX=620,groundY=300;
 if(m.x===null||m.h===null||m.far===null)return{...m,towerX,groundY,topY:groundY,scale:1,nearX:towerX,farX:towerX};
 const scale=frozenRise?frozenRise/m.h:Math.min(260/m.h,500/m.far),topY=groundY-m.h*scale;
 return{...m,towerX,groundY,topY,scale,nearX:towerX-m.x*scale,farX:towerX-m.far*scale};
}

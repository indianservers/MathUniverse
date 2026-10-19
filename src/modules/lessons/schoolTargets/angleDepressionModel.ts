export function angleDepressionModel(height:number,distance:number){
 const valid=[height,distance].every(Number.isFinite)&&height>0&&distance>0,angle=valid?Math.atan2(height,distance)*180/Math.PI:null;
 const scale=valid?Math.min(260/height,500/(distance+10)):1,observerX=120,waterY=345,observerY=waterY-height*scale,boatX=observerX+distance*scale;
 return{valid,angle,scale,observerX,observerY,waterY,boatX,challengeComplete:valid&&Math.abs(height-40)<1e-9&&Math.abs(distance-40)<=.02};
}
export function depressionDistanceFromX(height:number,x:number){const run=Math.max(0,Math.min(499.9,x-120)),threshold=500-2600/height;return Math.max(5,Math.min(200,run<=threshold?run*height/260:10*run/(500-run)));}

import {medianOgiveModel} from './medianOgiveModel';
export type OgivePoint={id:number;x:number;cf:number};
export function lessThanModel(points:OgivePoint[]){
 if(points.length<2||points[0].cf!==0)throw Error('Ogive needs a zero cumulative start and at least two boundaries.');
 return medianOgiveModel(points.map(p=>p.x),points.slice(1).map((p,i)=>p.cf-points[i].cf));
}
export function lessAxisMax(N:number){if(N<=0)return 1;const raw=N/6,u=10**Math.floor(Math.log10(raw));return 7*[1,2,5,10].find(k=>k*u>=raw)!*u;}
export function moveLessPoint(points:OgivePoint[],id:number,next:Partial<OgivePoint>){
 const i=points.findIndex(p=>p.id===id);if(i<0)return points;
 const old=points[i],lo=points[i-1]?.x??-Infinity,hi=points[i+1]?.x??Infinity;
 const eps=Math.min(1e-6,Math.max(Number.EPSILON,(old.x-lo)/4),Math.max(Number.EPSILON,(hi-old.x)/4));
 let x=next.x===undefined?old.x:Number.isFinite(next.x)?Math.max(points[i-1]?lo+eps:lo,Math.min(points[i+1]?hi-eps:hi,next.x)):old.x;
 if((points[i-1]&&x<=points[i-1].x)||(points[i+1]&&x>=points[i+1].x))x=old.x;
 const cf=i===0?0:next.cf===undefined?old.cf:Number.isFinite(next.cf)?Math.max(points[i-1].cf,Math.min(points[i+1]?.cf??1000000000,Math.round(next.cf))):old.cf;
 return points.map(p=>p.id===id?{...p,x,cf}:p);
}

export type ExternalPoint={x:number;y:number};
export const externalA={x:0,y:0},externalB={x:4,y:2};
export const externalPresets=[[2,1],[3,2],[3,1],[5,4],[4,3],[1,1]] as const;
export function externalSectionModel(m:number,n:number){
 if(!Number.isFinite(m)||!Number.isFinite(n)||m<=0||n<=0)throw new Error('Positive finite ratios required');
 if(m===n)return null;
 const t=m/(m-n),p={x:4*t,y:2*t},ab=Math.hypot(4,2),ap=Math.hypot(p.x,p.y),pb=Math.hypot(p.x-4,p.y-2);
 return {p,t,ab,ap,pb,side:t<0?'left' as const:'right' as const,ratio:ap/pb,normalized:{ap:ap/(ab/Math.abs(m-n)),pb:pb/(ab/Math.abs(m-n))}};
}
export function externalDragRatio(q:ExternalPoint){
 let t=(4*q.x+2*q.y)/20;
 if(t>=0&&t<=1)t=t<.5?-.05:1.05;
 t=Math.min(1000000,Math.max(-1000000,t));
 const ratio=Math.abs(t)/Math.abs(t-1);
 return {m:ratio,n:1};
}
export function externalProjection(p:ExternalPoint|null){
 const minX=Math.min(0,p?.x??0),maxX=Math.max(4,p?.x??4),minY=Math.min(0,p?.y??0),maxY=Math.max(2,p?.y??2);
 const scale=Math.min(22,480/(maxX-minX+8),180/(maxY-minY+4));
 return {scale,ox:320-(minX+maxX)/2*scale,oy:145+(minY+maxY)/2*scale};
}

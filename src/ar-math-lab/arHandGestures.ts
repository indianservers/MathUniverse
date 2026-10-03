export type HandPoint = { x: number; y: number; z: number };
export type PinchHand = { id: string; point: HandPoint; ratio: number };
export type HandTransform = { position: [number, number, number]; rotation: [number, number, number]; scale: number };
const distance = (a: HandPoint, b: HandPoint) => Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi,v));
export function landmarkPinch(points: HandPoint[], id: string): PinchHand | null {
 if(points.length!==21 || points.some(p=>![p.x,p.y,p.z].every(Number.isFinite))) return null;
 const palm=distance(points[0],points[9]);
 if(palm<.015)return null;
 return {id,point:{x:(points[4].x+points[8].x)/2,y:(points[4].y+points[8].y)/2,z:0},ratio:distance(points[4],points[8])/palm};
}
/** A fresh baseline on every grab/release prevents jumps when tracking or hand count changes. */
export class ARHandGestureEngine {
 private held=new Set<string>();
 private previous: PinchHand[]=[];
 get grabbedCount(){return this.previous.length;}
 reset(){this.held.clear();this.previous=[];}
 update(hands: PinchHand[], transform: HandTransform, camera=false, resizeOnly=false): HandTransform | null {
  const valid=hands.filter(h=>Number.isFinite(h.ratio)&&h.ratio>=0&&[h.point.x,h.point.y,h.point.z].every(Number.isFinite));
  this.held=new Set(valid.filter(h=>h.ratio<(this.held.has(h.id)?.5:.3)).map(h=>h.id));
  const active=valid.filter(h=>this.held.has(h.id)).sort((a,b)=>a.id.localeCompare(b.id)).slice(0,2);
  const old=this.previous;this.previous=active;
  if(!active.length||active.length!==old.length||active.some((h,i)=>h.id!==old[i].id))return null;
  // Reject each hand independently: opposite tracking jumps can cancel at the center.
  if(active.some((h,i)=>distance(h.point,old[i].point)>(camera?.4:.6))){this.previous=[];return null;}
  // Keep the baseline until movement exceeds sensor jitter, so slow drags accumulate.
  if(active.every((h,i)=>distance(h.point,old[i].point)<(camera?.003:.002))){this.previous=old;return null;}
  const center=(hs:PinchHand[])=>hs.reduce((p,h)=>({x:p.x+h.point.x/hs.length,y:p.y+h.point.y/hs.length,z:p.z+h.point.z/hs.length}),{x:0,y:0,z:0});
  const a=center(active),b=center(old),gain=camera?8:1;
  if(distance(a,b)>(camera?.2:.3)){this.previous=[];return null;}
  const position=transform.position.map((v,i)=>resizeOnly||camera&&i===2?v:clamp(v+([a.x-b.x,(a.y-b.y)*(camera?-1:1),a.z-b.z][i])*gain,camera?-4:-10,camera?4:10)) as HandTransform['position'];
  let scale=transform.scale;const rotation=[...transform.rotation] as HandTransform['rotation'];
  if(camera&&resizeOnly&&active.length===1)scale=clamp(scale*Math.exp(clamp((b.y-a.y)*4,-.2,.2)),.18,5);
  if(active.length===2){
   const span=distance(active[0].point,active[1].point),prev=distance(old[0].point,old[1].point);
   if(prev>.03&&span>.03){scale=clamp(scale*clamp(span/prev,.85,1.15),.18,5);
    const angle=(hs:PinchHand[])=>camera?Math.atan2(hs[1].point.y-hs[0].point.y,hs[1].point.x-hs[0].point.x):Math.atan2(hs[1].point.z-hs[0].point.z,hs[1].point.x-hs[0].point.x);
    const delta=angle(active)-angle(old);rotation[camera?2:1]+=Math.atan2(Math.sin(delta),Math.cos(delta));
   }
  }
  return {position,rotation,scale};
 }
}

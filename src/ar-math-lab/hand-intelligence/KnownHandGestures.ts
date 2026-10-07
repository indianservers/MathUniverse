import type { HandPoint } from '../arHandGestures';
import type { HandFeatures } from './types';
export type KnownHandPose='open-palm'|'fist'|'index'|'victory'|'three'|'four'|'thumbs-up'|'thumbs-down'|'thumb-left'|'thumb-right'|'horns'|'ok'|'shaka'|'unknown';
export type HandCommand='activate'|'undo'|'redo'|'labels'|'grid'|'help'|'fit';
export const gestureActions=[
 ['☝','Index finger only','Select next','Select the next scene object once. Lower your finger before selecting again. The cycle includes None.'],
 ['🖐','Open palm','Enlarge','Hold to grow the selected object smoothly, up to 5 times.'],
 ['✌','Victory','Shrink','Hold to shrink the selected object smoothly, down to 0.2 times.'],
 ['✊','Closed fist','HOLD','Immediately stop all transformations. Selection stays.'],
 ['👍','Thumb up','Move up','Hold to move the selected object upward.'],
 ['👎','Thumb down','Move down','Hold to move the selected object downward.'],
 ['←','Thumb left','Move left','Hold a closed hand with your thumb pointing left.'],
 ['→','Thumb right','Move right','Hold a closed hand with your thumb pointing right.'],
 ['🤟','Index + little finger','ROTATE','Turn your hand left/right to spin the object. Your starting orientation is neutral.'],
 ['③','Index + middle + ring','TILT','Lean your hand left/right or forward/back to tilt. Available in 3D; starting orientation is neutral.'],
 ['👌','OK sign','Reset selected','Touch thumb and index tips with other fingers open. Restore only the selected object once.'],
] as const;
const distance=(a:HandPoint,b:HandPoint)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
export function classifyHandPose(p:HandPoint[],camera=true):KnownHandPose{
 if(p.length!==21||p.some(v=>![v.x,v.y,v.z].every(Number.isFinite)))return 'unknown';
 const size=distance(p[0],p[9]);if(size<.015)return 'unknown';
 const up=[8,12,16,20].map((tip,i)=>{
  const pip=p[6+i*4],mcp=p[5+i*4],end=p[tip];
  const a=[mcp.x-pip.x,mcp.y-pip.y,mcp.z-pip.z],b=[end.x-pip.x,end.y-pip.y,end.z-pip.z];
  const angle=Math.acos(Math.max(-1,Math.min(1,a.reduce((n,v,j)=>n+v*b[j],0)/Math.max(1e-8,Math.hypot(...a)*Math.hypot(...b)))));
  return angle>Math.PI*.68&&distance(end,p[0])>distance(pip,p[0])*1.18&&distance(end,pip)>size*.35;
 });
 const thumb=distance(p[4],p[5])>size*.72&&distance(p[4],p[2])>size*.55;
 if(!up.some(Boolean)&&!thumb)return 'fist';
 // A true OK sign needs open supporting fingers, so a fist cannot be reset by a pinch.
 if(distance(p[4],p[8])/size<.28&&up.slice(1).filter(Boolean).length>=2)return 'ok';
 if(up.every(Boolean))return thumb?'open-palm':'four';
 if(!up.some(Boolean)){
  if(thumb){const dx=p[4].x-p[2].x,dy=p[4].y-p[2].y;if(Math.abs(dy)>Math.abs(dx)*1.25&&Math.abs(dy)>size*.45)return (camera?dy<0:dy>0)?'thumbs-up':'thumbs-down';if(Math.abs(dx)>Math.abs(dy)*1.25&&Math.abs(dx)>size*.45)return dx<0?'thumb-left':'thumb-right';}
  return thumb?'unknown':'fist';
 }
 if(up[0]&&!up[1]&&!up[2]&&!up[3])return 'index';
 if(up[0]&&up[1]&&!up[2]&&!up[3])return 'victory';
 if(up[0]&&up[1]&&up[2]&&!up[3])return 'three';
 if(up[0]&&!up[1]&&!up[2]&&up[3])return 'horns';
 if(!up[0]&&!up[1]&&!up[2]&&up[3]&&thumb)return 'shaka';return 'unknown';
}
/** A deliberate hold fires once. Neutral/release for 300 ms rearms it; no frame-by-frame commands. */
export class KnownGestureCommands{
 private key='';private since=0;private fired=false;private neutralSince:number|null=null;
 reset(){this.key='';this.since=0;this.fired=false;this.neutralSince=null;}
 update(hands:HandFeatures[],target:string|undefined,time:number,locked:boolean):HandCommand|undefined{
  const live=hands.filter(h=>!h.missing&&h.quality>.65&&h.speed<.4);const pose=live[0]?.pose;
  let command:HandCommand|undefined;
  if(!locked){if(live.length===2&&live.every(h=>h.pose==='thumbs-up'))command='fit';else if(pose==='thumbs-up'&&target)command='activate';else if(pose==='thumbs-down')command='undo';else if(pose==='victory')command='redo';else if(pose==='three')command='labels';else if(pose==='four')command='grid';else if(pose==='shaka')command='help';else if(pose==='index'&&target)command='activate';}
  if(!command){if(this.neutralSince===null)this.neutralSince=time;if(time-this.neutralSince>=300)this.reset();return;}
  this.neutralSince=null;const key=command+(command==='activate'?':'+target:'');if(key!==this.key){if(this.fired)return;this.key=key;this.since=time;}
  if(this.fired||time-this.since<(pose==='index'?800:650))return;this.fired=true;return command;
 }
}

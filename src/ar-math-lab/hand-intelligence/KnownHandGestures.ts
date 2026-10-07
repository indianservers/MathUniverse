import type { HandPoint } from '../arHandGestures';
import type { HandFeatures } from './types';
export type KnownHandPose='open-palm'|'fist'|'index'|'victory'|'three'|'four'|'thumbs-up'|'thumbs-down'|'shaka'|'unknown';
export type HandCommand='activate'|'undo'|'redo'|'labels'|'grid'|'help'|'fit';
export const gestureActions=[
 ['☝','Index finger','Hover','Point at a model or control to highlight it.'],['☝','Index held still','Select / click','Hold on the same target for 800 ms. Activates a button once, or selects a model.'],
 ['✊','Closed fist','Grab','Pause over a model, then close your fist. Locked models stay locked.'],['✊ →','Move your fist','Move / edit','Move the grabbed model; on a slider or numeric field, move sideways to edit its value.'],['✊ ↻','Turn your fist','Rotate','Turn the wrist while holding an object that allows rotation.'],
 ['✋','Open palm','Release','Open your hand to commit the current edit.'],['✋ →','Move an open palm','Pan','Move across the graph to pan its view when no object is held.'],['✋ ↔ ✋','Two open palms','Zoom view','Spread hands to zoom in; bring them together to zoom out.'],
 ['✊ ↔ ✊','Two fists','Scale object','Grab the same object with both fists; spread to enlarge or bring together to shrink.'],['✊ ↻ ✊','Turn two fists','Rotate object','Turn the line between your hands to rotate the held model.'],
 ['👍','Thumbs up','Confirm / select','Hold for 650 ms to select the hovered model or activate the hovered button.'],['👎','Thumbs down','Undo','Hold for 650 ms. Undo one edit; in the camera AR lab, undo a hand transform.'],['✌','Victory / V sign','Redo','Hold for 650 ms to redo one undone edit.'],
 ['③','Index + middle + ring','Toggle labels','Hold three fingers up for 650 ms to toggle existing labels.'],['④','Four fingers, thumb tucked','Toggle grid','Hold for 650 ms to toggle the existing grid.'],['🤙','Thumb + little finger','Gesture guide','Hold the shaka sign for 650 ms to show or hide this guide.'],['👍 👍','Two thumbs up','Fit / reset view','Hold for 650 ms to fit the view using its existing control; camera AR restores the default object pose.'],
 ['☝','Point at a graph surface','Inspect','Pause to inspect a real surface sample, where supported.'],['✊','Fist on a face / handle','Change dimensions','Grab a valid face or parameter handle to edit dimensions through the original model constraints.'],
] as const;
const distance=(a:HandPoint,b:HandPoint)=>Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
export function classifyHandPose(p:HandPoint[],camera=true):KnownHandPose{
 if(p.length!==21||p.some(v=>![v.x,v.y,v.z].every(Number.isFinite)))return 'unknown';
 const size=distance(p[0],p[9]);if(size<.015)return 'unknown';
 const up=[8,12,16,20].map((tip,i)=>distance(p[tip],p[0])>distance(p[6+i*4],p[0])*1.18&&distance(p[tip],p[6+i*4])>size*.35);
 const thumb=distance(p[4],p[5])>size*.72&&distance(p[4],p[2])>size*.55;
 if(up.every(Boolean))return thumb?'open-palm':'four';
 if(!up.some(Boolean)){
  if(thumb){const dx=p[4].x-p[2].x,dy=p[4].y-p[2].y;if(Math.abs(dy)>Math.abs(dx)*1.25&&Math.abs(dy)>size*.45)return (camera?dy<0:dy>0)?'thumbs-up':'thumbs-down';}
  return thumb?'unknown':'fist';
 }
 if(up[0]&&!up[1]&&!up[2]&&!up[3])return 'index';
 if(up[0]&&up[1]&&!up[2]&&!up[3])return 'victory';
 if(up[0]&&up[1]&&up[2]&&!up[3])return 'three';
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

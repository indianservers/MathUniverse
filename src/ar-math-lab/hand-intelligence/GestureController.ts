import type { HandTransform } from '../arHandGestures';
import type { HandFeatures } from './types';

export const GESTURE_CONFIG={GESTURE_STABILITY_MS:350,ACTIVATE_CONFIDENCE:.8,KEEP_CONFIDENCE:.6,REARM_MS:250,RESET_COOLDOWN_MS:1000,MOVE_SPEED_INITIAL:.35,MOVE_SPEED_HELD:.65,SCALE_SPEED:.4,ROTATION_SENSITIVITY:1,TILT_SENSITIVITY:1,DEAD_ZONE:4*Math.PI/180,MAX_ANGLE:Math.PI/2,SMOOTHING_RATE:12,MIN_SCALE:.2,MAX_SCALE:5} as const;
export type GestureState='NONE'|'SELECT'|'HOLD'|'SCALE_UP'|'SCALE_DOWN'|'MOVE_UP'|'MOVE_DOWN'|'MOVE_LEFT'|'MOVE_RIGHT'|'ROTATE'|'TILT'|'RESET';
export type GestureSelectable={id:string;name:string;kind:'2d'|'3d';capabilities:{move:boolean;scale:boolean;rotate:boolean;tilt:boolean;reset:boolean};read:()=>HandTransform;write:(value:HandTransform)=>void;select:(selected:boolean)=>void;captureReset?:()=>()=>void};
export type GestureFeedback={selected:string;gesture:string;action:string;state:GestureState;detected:boolean;stable:boolean;confidence:number;handedness:string;angles?:{yaw:number;pitch:number;roll:number}};
const copy=(t:HandTransform):HandTransform=>({position:[...t.position],rotation:[...t.rotation],scale:t.scale});
const states:Record<string,GestureState>={'index':'SELECT','fist':'HOLD','open-palm':'SCALE_UP','victory':'SCALE_DOWN','thumbs-up':'MOVE_UP','thumbs-down':'MOVE_DOWN','thumb-left':'MOVE_LEFT','thumb-right':'MOVE_RIGHT','horns':'ROTATE','three':'TILT','ok':'RESET'};
const names:Record<GestureState,string>={NONE:'Detecting…',SELECT:'Index',HOLD:'Closed fist',SCALE_UP:'Open palm',SCALE_DOWN:'Victory',MOVE_UP:'Thumb up',MOVE_DOWN:'Thumb down',MOVE_LEFT:'Thumb left',MOVE_RIGHT:'Thumb right',ROTATE:'Index + little finger',TILT:'Three fingers',RESET:'OK sign'};
const actions:Record<GestureState,string>={NONE:'Stopped',SELECT:'Select next',HOLD:'HOLD',SCALE_UP:'Enlarge',SCALE_DOWN:'Shrink',MOVE_UP:'Move up',MOVE_DOWN:'Move down',MOVE_LEFT:'Move left',MOVE_RIGHT:'Move right',ROTATE:'ROTATE — turn your hand',TILT:'TILT — lean your hand',RESET:'Reset selected object'};
/** Dynamic registry preserves the transform captured when an object first appears. */
export class GestureObjectRegistry{
 private entries=new Map<string,{object:GestureSelectable;reset:()=>void}>();
 selectedId:string|null=null;
 sync(objects:GestureSelectable[]){
  const ids=new Set(objects.map(o=>o.id));for(const [id] of this.entries)if(!ids.has(id)){this.entries.delete(id);if(this.selectedId===id)this.selectedId=null;}
  for(const object of objects){const prior=this.entries.get(object.id);if(prior)prior.object=object;else{const original=copy(object.read());this.entries.set(object.id,{object,reset:object.captureReset?.()??(()=>this.entries.get(object.id)?.object.write(copy(original)))});}}
  // Follow the renderer's current ordering, including objects added after axes existed.
  this.entries=new Map(objects.map(object=>[object.id,this.entries.get(object.id)!]));
 }
 get selected(){return this.selectedId?this.entries.get(this.selectedId)?.object:undefined;}
 next(){const ids=[...this.entries.keys()];const index=this.selectedId?ids.indexOf(this.selectedId):-1;this.choose(index===ids.length-1?null:ids[index+1]??null);}
 choose(id:string|null){this.selected?.select(false);this.selectedId=id&&this.entries.has(id)?id:null;this.selected?.select(true);}
 reset(){if(this.selectedId)this.entries.get(this.selectedId)?.reset();}
 clear(){this.choose(null);this.entries.clear();}
}
/** One control hand, one operation, deliberate stable entry and edge-triggered commands. */
export class GestureController{
 readonly registry=new GestureObjectRegistry();
 private activeHand?:string;private history:{state:GestureState;time:number}[]=[];private candidate:GestureState='NONE';private since=0;private current:GestureState='NONE';private lastTime=0;
 private indexLocked=false;private resetLocked=false;private absentIndex?:number;private absentReset?:number;private lastReset=-Infinity;
 private reference?:{hand:[number,number,number];object:HandTransform};
 stop(){this.history=[];this.candidate='NONE';this.current='NONE';this.reference=undefined;this.lastTime=0;}
 update(hands:HandFeatures[],time:number):GestureFeedback{
  const live=hands.filter(h=>!h.missing&&h.quality>=GESTURE_CONFIG.KEEP_CONFIDENCE);
  const hand=live.find(h=>h.id===this.activeHand)??live.sort((a,b)=>b.quality-a.quality)[0];
  const changed=!!hand&&this.activeHand!==hand.id;this.activeHand=hand?.id;
  const feedback=(state:GestureState,stable=false,action=actions[state],angles?:GestureFeedback['angles']):GestureFeedback=>({selected:this.registry.selected?.name??'None',gesture:hand?names[state]:'Hand not detected',action,state,detected:!!hand,stable,confidence:hand?.quality??0,handedness:hand?.handedness??'',angles});
  if(!hand||changed){this.stop();if(!hand){this.rearm('NONE',time);return feedback('NONE');}}
  const raw=states[hand!.pose??'unknown']??'NONE';this.rearm(raw,time);
  const dt=this.lastTime?Math.min(.08,Math.max(0,(time-this.lastTime)/1000)):0;this.lastTime=time;
  // HOLD is immediate: no easing or stale velocity is permitted after a fist frame.
  if(raw==='HOLD'){this.current='HOLD';this.candidate='HOLD';this.since=time;this.history=[];this.reference=undefined;return feedback('HOLD',true);}
  this.history.push({state:raw,time});this.history=this.history.filter(s=>time-s.time<=500).slice(-10);
  const majority=this.history.filter(s=>s.state===raw).length/this.history.length;
  if(raw!==this.candidate){
   if(majority<.75)return feedback('NONE',false,'Detecting…');
   this.candidate=raw;this.since=this.history.find(sample=>sample.state===raw)?.time??time;this.current='NONE';this.reference=undefined;
  }
  const confidence=this.current===raw?GESTURE_CONFIG.KEEP_CONFIDENCE:GESTURE_CONFIG.ACTIVATE_CONFIDENCE;
  if(raw==='NONE'||hand!.quality<confidence||time-this.since<GESTURE_CONFIG.GESTURE_STABILITY_MS||majority<.75)return feedback('NONE',false,'Keep the gesture steady');
  const entered=this.current!==raw;this.current=raw;
  if(raw==='SELECT'){if(!this.indexLocked){this.registry.next();this.indexLocked=true;}return feedback(raw,true);}
  const object=this.registry.selected;if(!object)return feedback(raw,true,'Show index finger to select an object');
  if(raw==='RESET'){if(!object.capabilities.reset)return feedback(raw,true,`Reset unavailable for ${object.name}`);if(!this.resetLocked&&time-this.lastReset>=GESTURE_CONFIG.RESET_COOLDOWN_MS){this.registry.reset();this.resetLocked=true;this.lastReset=time;}return feedback(raw,true,`${object.name} restored`);}
  const capability=raw.startsWith('MOVE')?'move':raw.startsWith('SCALE')?'scale':raw==='ROTATE'?'rotate':'tilt';
  if(!object.capabilities[capability])return feedback(raw,true,`${actions[raw].split(' — ')[0]} unavailable for ${object.name}`);
  const next=copy(object.read());
  if(raw.startsWith('MOVE')){const speed=time-this.since>1200?GESTURE_CONFIG.MOVE_SPEED_HELD:GESTURE_CONFIG.MOVE_SPEED_INITIAL;const axis=raw==='MOVE_LEFT'||raw==='MOVE_RIGHT'?0:1;next.position[axis]+=(raw==='MOVE_LEFT'||raw==='MOVE_DOWN'?-1:1)*speed*dt;}
  if(raw.startsWith('SCALE'))next.scale=Math.min(GESTURE_CONFIG.MAX_SCALE,Math.max(GESTURE_CONFIG.MIN_SCALE,next.scale*Math.exp((raw==='SCALE_UP'?1:-1)*GESTURE_CONFIG.SCALE_SPEED*dt)));
  let angles:GestureFeedback['angles'];
  if(raw==='ROTATE'||raw==='TILT'){
   const orientation=hand!.orientation3D??[0,0,hand!.orientation];
   if(entered||!this.reference)this.reference={hand:[...orientation],object:copy(next)};
   const diff=orientation.map((n,i)=>{let d=Math.atan2(Math.sin(n-this.reference!.hand[i]),Math.cos(n-this.reference!.hand[i]));d=Math.sign(d)*Math.max(0,Math.abs(d)-GESTURE_CONFIG.DEAD_ZONE);return Math.max(-GESTURE_CONFIG.MAX_ANGLE,Math.min(GESTURE_CONFIG.MAX_ANGLE,d));});
   const blend=1-Math.exp(-GESTURE_CONFIG.SMOOTHING_RATE*dt);
   const set=(axis:number,value:number)=>{next.rotation[axis]+=(this.reference!.object.rotation[axis]+value-next.rotation[axis])*blend;};
   if(raw==='ROTATE')set(object.kind==='2d'?2:1,diff[1]*GESTURE_CONFIG.ROTATION_SENSITIVITY);
   else{set(0,diff[0]*GESTURE_CONFIG.TILT_SENSITIVITY);set(2,-diff[2]*GESTURE_CONFIG.TILT_SENSITIVITY);}
   angles={pitch:diff[0]*180/Math.PI,yaw:diff[1]*180/Math.PI,roll:diff[2]*180/Math.PI};
  }
  object.write(next);return feedback(raw,true,actions[raw],angles);
 }
 private rearm(state:GestureState,time:number){
  if(state==='SELECT')this.absentIndex=undefined;else{this.absentIndex??=time;if(time-this.absentIndex>=GESTURE_CONFIG.REARM_MS)this.indexLocked=false;}
  if(state==='RESET')this.absentReset=undefined;else{this.absentReset??=time;if(time-this.absentReset>=GESTURE_CONFIG.REARM_MS)this.resetLocked=false;}
 }
}

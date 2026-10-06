import { RingBuffer } from './math';
import type { HandIntelligenceState, IntelligenceFrameInput, ManipulationResult } from './types';
export type HandRecordingFrame={label:string;input:IntelligenceFrameInput;state:HandIntelligenceState;result:ManipulationResult};
export type HandRecording={version:1;coordinateSystem:'normalized-camera-or-XR-local';frames:HandRecordingFrame[]};
/** Explicit developer opt-in. Bounded memory, feature-only export, no identifiers/images/network. */
export class HandIntelligenceRecorder {
  private buffer=new RingBuffer<HandRecordingFrame>(1800);private bytes=0;private sizes=new WeakMap<HandRecordingFrame,number>();private ids=new Map<string,string>();recording=false;label='idle';
  start(label:string){this.label=label;this.buffer.clear();this.bytes=0;this.ids.clear();this.recording=true;}
  stop(){this.recording=false;}
  get count(){return this.buffer.size;}
  capture(input:IntelligenceFrameInput,state:HandIntelligenceState,result:ManipulationResult){
    if(!this.recording)return;
    const clean=JSON.parse(JSON.stringify({label:this.label,input,state,result})) as HandRecordingFrame;
    // Local scene names/equations and images are never present in this format.
    const mapId=(id:string|undefined)=>{if(id===undefined)return undefined;if(!this.ids.has(id))this.ids.set(id,`target-${this.ids.size}`);return this.ids.get(id);};
    clean.input.targets=clean.input.targets.map(t=>({...t,objectId:mapId(t.objectId)!}));
    clean.input.selectedObjectId=mapId(input.selectedObjectId);clean.state.targetObjectId=mapId(state.targetObjectId);
    if(clean.state.primaryTarget){clean.state.primaryTarget.objectId=mapId(state.primaryTarget?.objectId)!;clean.state.primaryTarget.affordance.objectId=clean.state.primaryTarget.objectId;}
    if(clean.result.semanticEdit)clean.result.semanticEdit.objectId=mapId(result.semanticEdit?.objectId)!;
    if(clean.result.inspection)clean.result.inspection.objectId=mapId(result.inspection?.objectId)!;
    const size=JSON.stringify(clean).length*2;if(size>8_000_000)return;
    while(this.buffer.size&&this.bytes+size>8_000_000){const old=this.buffer.shift();if(old)this.bytes-=this.sizes.get(old)??0;}
    if(this.buffer.size===this.buffer.capacity){const old=this.buffer.shift();if(old)this.bytes-=this.sizes.get(old)??0;}
    this.sizes.set(clean,size);this.bytes+=size;this.buffer.push(clean);
  }
  exportJSON(){return JSON.stringify({version:1,coordinateSystem:'normalized-camera-or-XR-local',frames:this.buffer.values()} satisfies HandRecording,null,2);}
  exportCSV(){return['timestamp,label,intent,confidence,target,phase,hand_count,precision,hand_features,landmarks',...this.buffer.values().map(f=>[f.input.timestamp,f.label,f.state.primaryIntent,f.state.interactionConfidence,f.state.targetObjectId??'',f.state.phase,f.state.activeHandIds.length,f.state.precision,JSON.stringify(f.state.hands.map(h=>({id:h.id,quality:h.quality,embedding:h.embedding,velocity:h.velocity,acceleration:h.acceleration}))),JSON.stringify(f.input.hands.map(h=>h.landmarks??h.point))].map(v=>`"${String(v).replaceAll('"','""')}"`).join(','))].join('\n');}
  static parse(text:string):HandRecording{
    if(text.length>10_000_000)throw new Error('Recording exceeds 10 MB.');
    const value=JSON.parse(text) as HandRecording;
    if(value.version!==1||!Array.isArray(value.frames)||value.frames.length>1800||value.frames.some(f=>!f.input||!Number.isFinite(f.input.timestamp)||!Array.isArray(f.input.hands)||f.input.hands.length>2||!Array.isArray(f.input.targets)||f.input.targets.length>40))throw new Error('Invalid hand recording.');
    return value;
  }
}

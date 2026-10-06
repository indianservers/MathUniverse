import { HandIntelligenceEngine } from './HandIntelligenceEngine';
import { SpatialHandEngine } from './SpatialHandEngine';
import type { HandTransform } from '../arHandGestures';
import type { HandRecording } from './HandIntelligenceRecorder';
import type { IntelligenceFrameInput, IntelligenceProfile, ObjectAffordance, RawHand } from './types';

export const replayCases=['grab cube','rotate cube','resize sphere','edit vector','move graph','inspect graph','accidental movement','hand crossing','tracking loss'] as const;
export function replayInputs(name:string):IntelligenceFrameInput[]{
  const target:ObjectAffordance={objectId:'fixture-object',semanticType:name.includes('sphere')?'sphere':name.includes('vector')?'vector':name.includes('graph')?'graph':'cube',position:[.5,.5,0],radius:.25,depth:2,visible:true,selected:true,precisionRequired:.2,
    allowedInteractions:{translate:true,rotate:true,scale:true,editRadius:name.includes('sphere'),editVector:name.includes('vector'),sampleSurface:name.includes('graph')},
    preferredGrabZones:[{id:'body',kind:name.includes('vector')?'vector':'body',position:[.5,.5,0],radius:.25,dimension:name.includes('sphere')?'radius':undefined,value:2,index:1}]};
  const frames:IntelligenceFrameInput[]=[];
  for(let i=0;i<90;i++){
    const progress=Math.max(0,i-22)/60;let hands:RawHand[]=[{point:{x:.5,y:.5,z:0},pinchRatio:.1,handedness:'right',confidence:1,orientation:0}];
    if(name==='accidental movement')hands=[{point:{x:.05+progress*.1,y:.05,z:0},pinchRatio:.1,handedness:'right'}];
    if(name==='move graph')hands[0].point!.x+=progress*.16;
    if(name==='rotate cube')hands[0].orientation=progress*.8;
    if(name==='resize sphere')hands=[{point:{x:.44-progress*.1,y:.5,z:0},pinchRatio:.1,handedness:'left'},{point:{x:.56+progress*.1,y:.5,z:0},pinchRatio:.1,handedness:'right'}];
    if(name==='edit vector')hands[0].point!.y-=progress*.12;
    if(name==='hand crossing')hands=[{point:{x:.4+progress*.18,y:.48,z:0},pinchRatio:.1,handedness:i%2?'right':'left'},{point:{x:.6-progress*.18,y:.52,z:0},pinchRatio:.1,handedness:i%2?'left':'right'}];
    if(name==='tracking loss'&&i>=35&&i<=38)hands=[];
    if(name==='inspect graph'){
      const landmarks=Array.from({length:21},()=>({x:.55,y:.57,z:0}));landmarks[0]={x:.5,y:.7,z:0};landmarks[9]={x:.5,y:.6,z:0};landmarks[8]={x:.5,y:.5,z:0};landmarks[6]={x:.5,y:.6,z:0};landmarks[4]={x:.64,y:.62,z:0};
      hands=[{landmarks,handedness:'right',confidence:1}];
    }
    if(i>=82&&name!=='accidental movement'&&name!=='inspect graph')hands=hands.map(h=>({...h,pinchRatio:1}));
    frames.push({timestamp:i*33.333,hands,targets:[target],camera:true,selectedObjectId:target.objectId,tool:'auto'});
  }
  return frames;
}
export function replaySequence(inputs:IntelligenceFrameInput[],profile:IntelligenceProfile='balanced'){
  const engine=new HandIntelligenceEngine(profile),spatial=new SpatialHandEngine();let transform:HandTransform={position:[0,0,0],rotation:[0,0,0],scale:1};
  return inputs.map(input=>{const state=engine.update(input),result=spatial.solve(state,transform,input.camera,profile);if(result.transform)transform=result.transform;return{state,result,transform:{...transform,position:[...transform.position],rotation:[...transform.rotation]} as HandTransform};});
}
export const recordingInputs=(recording:HandRecording)=>recording.frames.map(f=>f.input);

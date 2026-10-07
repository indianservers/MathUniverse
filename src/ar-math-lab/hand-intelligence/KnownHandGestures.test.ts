import { describe,it,expect } from 'vitest';
import { classifyHandPose, KnownGestureCommands, type KnownHandPose } from './KnownHandGestures';
import { HandFeatureEngine } from './HandFeatureEngine';
import { HandIntelligenceEngine } from './HandIntelligenceEngine';
import { replayInputs } from './replay';
export function posePoints(pose:KnownHandPose){
 const p=Array.from({length:21},()=>({x:.5,y:.65,z:0}));p[0]={x:.5,y:.75,z:0};p[9]={x:.5,y:.6,z:0};p[5]={x:.44,y:.6,z:0};p[17]={x:.58,y:.6,z:0};p[2]={x:.35,y:.67,z:0};p[4]={x:.53,y:.64,z:0};
 const extended=pose==='open-palm'||pose==='four'?[0,1,2,3]:pose==='index'?[0]:pose==='victory'?[0,1]:pose==='three'?[0,1,2]:pose==='shaka'?[3]:[];
 for(let i=0;i<4;i++){p[6+i*4]={x:.44+i*.04,y:.54,z:0};p[8+i*4]={x:.44+i*.04,y:extended.includes(i)?.3:.65,z:0};}
 if(pose==='open-palm'||pose==='shaka')p[4]={x:.25,y:.55,z:0};if(pose==='thumbs-up')p[4]={x:.35,y:.35,z:0};if(pose==='thumbs-down')p[4]={x:.35,y:.97,z:0};return p;
}
describe('known hand poses',()=>{
 for(const pose of ['open-palm','fist','index','victory','three','four','thumbs-up','thumbs-down','shaka'] as KnownHandPose[])it(`recognizes ${pose}`,()=>expect(classifyHandPose(posePoints(pose))).toBe(pose));
 it('rejects incomplete and invalid hands',()=>{expect(classifyHandPose([])).toBe('unknown');const p=posePoints('fist');p[8].x=NaN;expect(classifyHandPose(p)).toBe('unknown');});
 it('does not reverse thumbs when camera is mirrored horizontally',()=>{const p=posePoints('thumbs-up');expect(classifyHandPose(p.map(v=>({...v,x:1-v.x})))).toBe('thumbs-up');});
 it('grabs with a closed fist without a pinch, releases with an open palm',()=>{const engine=new HandIntelligenceEngine();expect(engine.features.update([{landmarks:posePoints('fist')}],1,true,'balanced')[0].pinchRatio).toBeGreaterThan(.5);engine.reset();const targets=replayInputs('grab cube')[0].targets;targets[0].position=[.5,.6,0];targets[0].preferredGrabZones[0].position=[.5,.6,0];let state=engine.state;for(let i=1;i<25;i++)state=engine.update({timestamp:i*33,camera:true,targets,hands:[{landmarks:posePoints('fist'),confidence:1}]});expect(state.targetLocked).toBe(true);for(let i=25;i<37;i++)state=engine.update({timestamp:i*33,camera:true,targets,hands:[{landmarks:posePoints('open-palm'),confidence:1}]});expect(state.targetLocked).toBe(false);});
 it('commands wait, fire once, and rearm only after neutral',()=>{const commands=new KnownGestureCommands(),features=new HandFeatureEngine();const hand=(pose:KnownHandPose,time:number)=>features.update([{landmarks:posePoints(pose),confidence:1}],time,true,'balanced');expect(commands.update(hand('thumbs-down',1),undefined,1,false)).toBeUndefined();expect(commands.update(hand('thumbs-down',700),undefined,700,false)).toBe('undo');expect(commands.update(hand('thumbs-down',2000),undefined,2000,false)).toBeUndefined();commands.update(hand('open-palm',2100),undefined,2100,false);commands.update(hand('open-palm',2500),undefined,2500,false);commands.update(hand('thumbs-down',2600),undefined,2600,false);expect(commands.update(hand('thumbs-down',3300),undefined,3300,false)).toBe('undo');});
 it('never fires commands during a grab',()=>{const command=new KnownGestureCommands(),features=new HandFeatureEngine();const hands=features.update([{landmarks:posePoints('victory'),confidence:1}],1,true,'balanced');expect(command.update(hands,undefined,1,true)).toBeUndefined();expect(command.update(hands,undefined,5000,true)).toBeUndefined();});
 it('four fingers toggle grid, three fingers labels, two thumbs fit',()=>{for(const [pose,action] of [['four','grid'],['three','labels'],['thumbs-up','fit']] as const){const c=new KnownGestureCommands(),features=new HandFeatureEngine();const hands=features.update([{landmarks:posePoints(pose),confidence:1},...(action==='fit'?[{landmarks:posePoints(pose).map(v=>({...v,x:v.x+.35})),confidence:1}]:[])],1,true,'balanced');c.update(hands,undefined,1,false);expect(c.update(hands,undefined,700,false)).toBe(action);}});
});

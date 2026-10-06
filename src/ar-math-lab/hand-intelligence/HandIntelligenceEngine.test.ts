import { describe,expect,it } from 'vitest';
import { replayCases,replayInputs,replaySequence } from './replay';
import { HandIntelligenceEngine } from './HandIntelligenceEngine';
import { HandIntelligenceRecorder } from './HandIntelligenceRecorder';
import { SpatialProcessingLayer } from './SpatialProcessingLayer';

describe('hand intelligence pipeline',()=>{
  it('requires deliberate proximity and dwell before acquisition',()=>{
    const sequence=replaySequence(replayInputs('grab cube'));
    expect(sequence.slice(0,4).every(s=>!s.state.targetLocked)).toBe(true);
    expect(sequence.some(s=>s.state.targetLocked)).toBe(true);
    expect(sequence.slice(-1)[0]!.state.targetLocked).toBe(false);
    expect(replaySequence(replayInputs('accidental movement')).every(s=>s.result.transform===null)).toBe(true);
  });
  it('moves a grabbed graph and infers wrist rotation without separate modes',()=>{
    expect(replaySequence(replayInputs('move graph')).slice(-1)[0]!.transform.position[0]).toBeGreaterThan(.05);
    expect(replaySequence(replayInputs('rotate cube')).slice(-1)[0]!.transform.rotation[2]).toBeGreaterThan(.1);
  });
  it('edits mathematical radius and vector endpoints rather than arbitrary meshes',()=>{
    const radius=replaySequence(replayInputs('resize sphere')).flatMap(s=>s.result.semanticEdit?[s.result.semanticEdit]:[]);
    expect(radius.length).toBeGreaterThan(0);expect(radius.slice(-1)[0]!.value).toBeGreaterThan(2);
    const vector=replaySequence(replayInputs('edit vector')).flatMap(s=>s.result.semanticEdit?[s.result.semanticEdit]:[]);
    expect(vector.length).toBeGreaterThan(0);expect(vector[0].kind).toBe('vector');
  });
  it('tolerates a short loss without moving an unobserved hand',()=>{
    const sequence=replaySequence(replayInputs('tracking loss'));
    expect(sequence.slice(35,39).every(s=>s.state.targetLocked&&s.result.transform===null)).toBe(true);
  });
  it('keeps lock when a distractor is nearby, ignores locked objects and low quality',()=>{
    const input=replayInputs('grab cube');const locked=input.map(f=>({...f,targets:f.targets.map(t=>({...t,locked:true}))}));
    expect(replaySequence(locked).some(s=>s.state.targetLocked)).toBe(false);
    const low=input.map(f=>({...f,hands:f.hands.map(h=>({...h,confidence:.2}))}));expect(replaySequence(low).some(s=>s.state.targetLocked)).toBe(false);
    const distractor=input.map((f,i)=>({...f,targets:i>25?[{...f.targets[0],objectId:'distractor'},...f.targets]:f.targets}));
    expect(replaySequence(distractor).filter(s=>s.state.targetLocked).every(s=>s.state.targetObjectId==='fixture-object')).toBe(true);
  });
  it('does not join two hands that target different objects',()=>{
    const input=replayInputs('grab cube').map(f=>({...f,hands:[...f.hands,{point:{x:.9,y:.9,z:0},pinchRatio:.1,handedness:'left',confidence:1}]}));
    expect(replaySequence(input).every(s=>s.state.activeHandIds.length<2)).toBe(true);
  });
  it('inspects without moving geometry',()=>{
    const sequence=replaySequence(replayInputs('inspect graph'));expect(sequence.some(s=>s.state.primaryIntent==='inspect')).toBe(true);expect(sequence.every(s=>s.result.transform===null)).toBe(true);
  });
  it('emits lifecycle events and limits history',()=>{
    const engine=new HandIntelligenceEngine();const events:string[]=[];engine.subscribe(e=>events.push(e.type));replayInputs('resize sphere').forEach(f=>engine.update(f));
    expect(events).toContain('onGrabStart');expect(events).toContain('onTwoHandStart');expect(events).toContain('onGrabEnd');expect(engine.history.size).toBe(60);
  });
  it('bounds output and never enables throws without explicit physics',()=>{
    for(const name of replayCases)for(const item of replaySequence(replayInputs(name),'play')){
      expect(item.state.throwAllowed).toBe(false);expect([...item.transform.position,...item.transform.rotation,item.transform.scale].every(Number.isFinite)).toBe(true);expect(item.transform.scale).toBeLessThanOrEqual(5);
    }
  });
  it('exports only after opt-in and validates local replay input',()=>{
    const recorder=new HandIntelligenceRecorder(),input=replayInputs('grab cube')[0],result=replaySequence([input])[0];recorder.capture(input,result.state,result.result);expect(recorder.count).toBe(0);
    recorder.start('grab');recorder.capture(input,result.state,result.result);const text=recorder.exportJSON();expect(text).not.toContain('fixture-object');expect(HandIntelligenceRecorder.parse(text).frames).toHaveLength(1);expect(recorder.exportCSV()).toContain('confidence');expect(()=>HandIntelligenceRecorder.parse('{"version":2}')).toThrow();
  });
  it('maps object-cover coordinates consistently with NDC',()=>{
    expect(SpatialProcessingLayer.webcamToNDC([.5,.5,0])).toEqual([0,0,0]);expect(SpatialProcessingLayer.coverPoint([.75,.5,0],2,1)).toEqual([1,.5,0]);
  });
  it('keeps identities through crossing and preserves a one-hand hold when support leaves',()=>{
    const crossing=replaySequence(replayInputs('hand crossing'));
    const grabbed=crossing.filter(s=>s.state.activeHandIds.length===2);
    expect(grabbed.length).toBeGreaterThan(10);
    expect(new Set(grabbed.map(s=>s.state.activeHandIds.join(':'))).size).toBe(1);
    const inputs=replayInputs('resize sphere').map((f,i)=>i>=45&&i<82?{...f,hands:[f.hands[0]]}:f);
    const output=replaySequence(inputs);
    expect(output[65].state.targetLocked).toBe(true);expect(output[65].state.activeHandIds).toHaveLength(1);
  });
  it('holds through a two-frame accidental opening, releases a sustained opening',()=>{
    const input=replayInputs('move graph').map((f,i)=>i===40||i===41?{...f,hands:f.hands.map(h=>({...h,pinchRatio:1}))}:f);
    const output=replaySequence(input);expect(output.slice(40,44).every(f=>f.state.targetLocked)).toBe(true);expect(output[89].state.targetLocked).toBe(false);
  });
  it('prevents changes while drawing and suppresses invalid or occluded targets',()=>{
    const input=replayInputs('move graph');expect(replaySequence(input.map(f=>({...f,tool:'draw' as const}))).every(f=>f.result.transform===null)).toBe(true);
    expect(replaySequence(input.map(f=>({...f,targets:f.targets.map(t=>({...t,occluded:true}))}))).every(f=>!f.state.targetLocked)).toBe(true);
    expect(replaySequence(input.map(f=>({...f,hands:f.hands.map(h=>({...h,point:{x:NaN,y:0,z:0}}))}))).every(f=>!f.state.targetLocked)).toBe(true);
  });
  it('infers face stretching and keeps the mathematical dimension positive',()=>{
    const input=replayInputs('move graph').map(f=>({...f,targets:f.targets.map(t=>({...t,semanticType:'cuboid',allowedInteractions:{...t.allowedInteractions,stretchX:true},preferredGrabZones:[{...t.preferredGrabZones[0],kind:'face' as const,axis:0 as const,dimension:'length',value:2}]}))}));
    const output=replaySequence(input);const edits=output.filter(f=>f.result.semanticEdit);
    expect(edits.length).toBeGreaterThan(0);expect(edits[edits.length-1].result.semanticEdit?.dimension).toBe('length');expect(edits[edits.length-1].result.semanticEdit!.value).toBeGreaterThan(2);
  });
  it('allows combined motion but rebases on a second hand without jumping',()=>{
    const input=replayInputs('resize sphere').map((f,i)=>({...f,targets:f.targets.map(t=>({...t,allowedInteractions:{translate:true,rotate:true,scale:true}})),hands:f.hands.map(h=>({...h,point:h.point?{...h.point,y:h.point.y+Math.max(0,i-30)*.002}:undefined}))}));
    const output=replaySequence(input);expect(output.some(f=>f.state.weights.translate>.2&&f.state.weights.scale>.2)).toBe(true);
    for(let i=1;i<output.length;i++)expect(Math.abs(output[i].transform.position[1]-output[i-1].transform.position[1])).toBeLessThan(.1);
  });
  it('is deterministic across profiles and keeps inference within a small frame budget',()=>{
    const input=replayInputs('hand crossing');for(const profile of ['precision','balanced','play'] as const)expect(replaySequence(input,profile)).toEqual(replaySequence(input,profile));
    const engine=new HandIntelligenceEngine();const timings:number[]=[];
    for(let i=0;i<2000;i++){const frame={...input[i%input.length],timestamp:i*33.333};const begin=performance.now();engine.update(frame);timings.push(performance.now()-begin);}
    timings.sort((a,b)=>a-b);console.info(`Hand inference p95: ${timings[Math.floor(timings.length*.95)].toFixed(3)} ms; history: ${engine.history.size} frames`);
    expect(engine.history.size).toBe(60);expect(timings[Math.floor(timings.length*.95)]).toBeLessThan(8);
  });
});

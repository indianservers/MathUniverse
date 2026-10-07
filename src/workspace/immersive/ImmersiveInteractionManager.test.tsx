import {describe,expect,it,vi} from 'vitest';
import {ImmersiveModelController} from './ImmersiveModelController';
import {HandIntelligenceEngine} from '../../ar-math-lab/hand-intelligence/HandIntelligenceEngine';
import {SpatialHandEngine} from '../../ar-math-lab/hand-intelligence/SpatialHandEngine';
import {replayInputs} from '../../ar-math-lab/hand-intelligence/replay';
import {identityTransform,type ImmersiveAdapter} from './types';
describe('shared immersive model integration',()=>{
 it.each(['move graph','rotate cube','two-hand resize'])('updates the live model for %s and groups its undo transaction',name=>{
  const frames=name==='two-hand resize'?replayInputs('resize sphere').map(frame=>({...frame,targets:frame.targets.map(target=>({...target,allowedInteractions:{...target.allowedInteractions,editRadius:false}}))})):replayInputs(name);let value=identityTransform();const begin=vi.fn(),end=vi.fn(),select=vi.fn();
  const adapter:ImmersiveAdapter={kind:'3d',element:()=>null,targets:()=>frames[0].targets,transform:()=>value,select,begin,end,apply:(_,result)=>{if(result.transform)value=result.transform;}};
  const model=new ImmersiveModelController(()=>adapter),intelligence=new HandIntelligenceEngine(),spatial=new SpatialHandEngine();
  for(const input of frames){const state=intelligence.update(input),previous=value,result=spatial.solve(state,previous,true);model.update(state,result,previous);}
  expect(select).toHaveBeenCalled();expect(begin).toHaveBeenCalledTimes(1);expect(end).toHaveBeenCalledTimes(1);
  if(name==='move graph')expect(value.position[0]).toBeGreaterThan(.05);
  if(name==='rotate cube')expect(value.rotation[2]).toBeLessThan(-.1);
  if(name==='two-hand resize')expect(value.scale).toBeGreaterThan(1);
 });
 it('blocks locked objects and never begins an undo edit',()=>{
  const frames=replayInputs('move graph'),apply=vi.fn(),begin=vi.fn();const adapter:ImmersiveAdapter={kind:'3d',element:()=>null,targets:()=>[],transform:identityTransform,select:vi.fn(),apply,begin};
  const model=new ImmersiveModelController(()=>adapter),engine=new HandIntelligenceEngine(),solver=new SpatialHandEngine();
  for(const frame of frames){const state=engine.update({...frame,targets:frame.targets.map(t=>({...t,locked:true}))});model.update(state,solver.solve(state,identityTransform(),true),identityTransform());}
  expect(apply).not.toHaveBeenCalled();expect(begin).not.toHaveBeenCalled();
 });
 it('commits the current edit on mode exit once',()=>{const adapter={end:vi.fn(),begin:vi.fn(),select:vi.fn(),apply:vi.fn()} as unknown as ImmersiveAdapter;const frames=replayInputs('move graph'),engine=new HandIntelligenceEngine(),model=new ImmersiveModelController(()=>adapter);for(const frame of frames.slice(0,60)){const state=engine.update(frame);model.update(state,{transform:null},identityTransform());}model.release();model.release();expect(adapter.end).toHaveBeenCalledTimes(1);});
});

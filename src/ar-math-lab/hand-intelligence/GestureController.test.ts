import {describe,it,expect} from 'vitest';
import {GestureController,GestureObjectRegistry,type GestureSelectable} from './GestureController';
import {classifyHandPose,type KnownHandPose} from './KnownHandGestures';
import type {HandFeatures} from './types';
import type {HandTransform,HandPoint} from '../arHandGestures';
const base=():HandTransform=>({position:[2,3,4],rotation:[.1,.2,.3],scale:1.2});
const hand=(pose:KnownHandPose,quality=.95,id='left',angles:[number,number,number]=[0,0,0])=>({id,pose,quality,missing:false,orientation:0,orientation3D:angles,handedness:id} as HandFeatures);
function fixture(kind:'2d'|'3d'='3d'){
 const engine=new GestureController();let transform=base(),time=0;
 const object:GestureSelectable={id:'triangle',name:'Triangle',kind,capabilities:{move:true,scale:true,rotate:true,tilt:kind==='3d',reset:true},read:()=>transform,write:t=>{transform=t;},select:()=>undefined};engine.registry.sync([object]);
 const feed=(pose:KnownHandPose,ms=600,angles:[number,number,number]=[0,0,0])=>{let state;for(let i=0;i<ms;i+=20){time+=20;state=engine.update([hand(pose,.95,'left',angles)],time);}return state!;};
 return {engine,feed,read:()=>transform,advance:(hands:HandFeatures[])=>engine.update(hands,time+=20)};
}
describe('small deterministic gesture language',()=>{
 it('cycles dynamically through objects and None once per index presentation',()=>{
  const f=fixture();const names=['Equation','Triangle','Circle','X Axis','Y Axis'];f.engine.registry.sync(names.map((name,i)=>({id:String(i),name,kind:'2d',capabilities:{move:false,rotate:false,tilt:false,scale:false,reset:false},read:base,write:()=>undefined,select:()=>undefined})));
  for(const name of [...names,'None','Equation']){expect(f.feed('index',5000).selected).toBe(name);f.feed('fist',300);}
 });
 it('captures nonzero originals and resets only the selected object, once per held OK',()=>{
  const f=fixture();f.feed('index');f.feed('thumb-right',1500);f.feed('open-palm',1500);f.feed('horns');f.feed('horns',600,[0,.8,0]);f.feed('three');f.feed('three',600,[.5,0,.5]);expect(f.read()).not.toEqual(base());expect(f.feed('ok',2000).selected).toBe('Triangle');expect(f.read()).toEqual(base());
 });
 it.each([['thumbs-up',1,1],['thumbs-down',1,-1],['thumb-left',0,-1],['thumb-right',0,1]] as const)('%s moves only its intended axis',(pose,axis,sign)=>{
  const f=fixture();f.feed('index');f.feed(pose,1200);const t=f.read();expect(Math.sign(t.position[axis]-base().position[axis])).toBe(sign);expect(t.position[2]).toBe(4);expect(t.rotation).toEqual(base().rotation);expect(t.scale).toBe(1.2);
 });
 it('clamps scale above zero and below maximum',()=>{const f=fixture();f.feed('index');f.feed('open-palm',30000);expect(f.read().scale).toBe(5);f.feed('victory',30000);expect(f.read().scale).toBe(.2);});
 it('holds immediately, including when movement and rotation were active',()=>{const f=fixture();f.feed('index');f.feed('thumb-right',1200);const before=structuredClone(f.read());expect(f.advance([hand('fist')]).state).toBe('HOLD');expect(f.read()).toEqual(before);f.feed('fist',2000);expect(f.read()).toEqual(before);});
 it('stops on lost tracking, preserves selection, and requires restabilization',()=>{const f=fixture();f.feed('index');f.feed('open-palm',1000);const before=structuredClone(f.read());expect(f.advance([]).selected).toBe('Triangle');expect(f.read()).toEqual(before);f.feed('open-palm',200);expect(f.read()).toEqual(before);});
 it('separates rotate from tilt, captures new references, and ignores tremor',()=>{const f=fixture();f.feed('index');f.feed('horns');const before=structuredClone(f.read());f.feed('horns',400,[0,.03,0]);expect(f.read()).toEqual(before);f.feed('horns',600,[0,.6,0]);expect(f.read().rotation[1]).toBeGreaterThan(before.rotation[1]);expect(f.read().rotation[0]).toBe(before.rotation[0]);const rotated=structuredClone(f.read());f.feed('three',500,[.5,.6,.5]);expect(f.read()).toEqual(rotated);f.feed('three',600,[.8,.6,.8]);expect(f.read().position).toEqual(rotated.position);expect(f.read().scale).toBe(rotated.scale);expect(f.read().rotation[1]).toBe(rotated.rotation[1]);expect(f.read().rotation[0]).toBeGreaterThan(rotated.rotation[0]);expect(f.read().rotation[2]).toBeLessThan(rotated.rotation[2]);});
 it('reports unavailable 2D tilt and keeps the original transform',()=>{const f=fixture('2d');f.feed('index');expect(f.feed('three').action).toContain('unavailable');expect(f.read()).toEqual(base());});
 it('keeps one control hand instead of switching to a more confident second hand',()=>{const f=fixture();f.feed('index');f.advance([hand('fist',.85,'left'),hand('open-palm',1,'right')]);const before=structuredClone(f.read());for(let i=0;i<50;i++)f.advance([hand('fist',.85,'left'),hand('open-palm',1,'right')]);expect(f.read()).toEqual(before);});
 it('uses activation confidence, hysteresis and majority stability',()=>{const f=fixture();for(let i=0;i<60;i++)f.advance([hand('index',.7)]);expect(f.engine.registry.selectedId).toBe(null);f.feed('index');expect(f.engine.registry.selectedId).toBe('triangle');});
 it('removes deleted objects safely',()=>{const registry=new GestureObjectRegistry();registry.sync([{id:'one',name:'One',kind:'3d',capabilities:{move:false,rotate:false,tilt:false,scale:false,reset:false},read:base,write:()=>undefined,select:()=>undefined}]);registry.next();registry.sync([]);expect(registry.selectedId).toBe(null);});
 it('keeps scene order when new objects appear before existing axes',()=>{const registry=new GestureObjectRegistry();const object=(id:string):GestureSelectable=>({id,name:id,kind:'2d',capabilities:{move:false,rotate:false,tilt:false,scale:false,reset:false},read:base,write:()=>undefined,select:()=>undefined});registry.sync([object('X Axis')]);registry.sync([object('Triangle'),object('X Axis')]);registry.next();expect(registry.selectedId).toBe('Triangle');registry.next();expect(registry.selectedId).toBe('X Axis');registry.next();expect(registry.selectedId).toBe(null);});
 it('restores one original transform while leaving another object unchanged',()=>{const registry=new GestureObjectRegistry();let first=base(),second={...base(),scale:2};const object=(id:string,read:()=>HandTransform,write:(t:HandTransform)=>void):GestureSelectable=>({id,name:id,kind:'3d',capabilities:{move:true,rotate:true,tilt:true,scale:true,reset:true},read,write,select:()=>undefined});registry.sync([object('Triangle',()=>first,t=>{first=t;}),object('Cube',()=>second,t=>{second=t;})]);first={position:[10,20,30],rotation:[1,2,3],scale:3};const other=structuredClone(second);registry.next();registry.reset();expect(first).toEqual(base());expect(second).toEqual(other);expect(registry.selectedId).toBe('Triangle');});
 it('does not flicker through an isolated noisy pose',()=>{const f=fixture();f.feed('index');f.feed('open-palm',700);const before=f.read().scale;f.advance([hand('unknown')]);f.feed('open-palm',100);expect(f.read().scale).toBeGreaterThan(before);});
});
function landmarks(extended:boolean[],thumb:'open'|'closed'|'left'|'right'|'up'|'down'='closed'){
 const p:HandPoint[]=Array.from({length:21},()=>({x:.5,y:.65,z:0}));p[0]={x:.5,y:.75,z:0};p[9]={x:.5,y:.6,z:0};p[5]={x:.44,y:.6,z:0};p[17]={x:.58,y:.6,z:0};p[2]={x:.35,y:.67,z:0};p[4]=thumb==='closed'?{x:.53,y:.64,z:0}:thumb==='up'?{x:.35,y:.35,z:0}:thumb==='down'?{x:.35,y:.98,z:0}:thumb==='right'?{x:.85,y:.67,z:0}:{x:.15,y:.67,z:0};
 for(let i=0;i<4;i++){p[6+i*4]={x:.44+i*.04,y:.54,z:0};p[8+i*4]={x:.44+i*.04,y:extended[i]?.3:.65,z:0};}return p;
}
describe('landmark vocabulary, independent of camera distance and handedness',()=>{
 it.each([['fist',[false,false,false,false],'closed'],['index',[true,false,false,false],'closed'],['victory',[true,true,false,false],'closed'],['horns',[true,false,false,true],'closed'],['three',[true,true,true,false],'closed'],['open-palm',[true,true,true,true],'open'],['thumbs-up',[false,false,false,false],'up'],['thumbs-down',[false,false,false,false],'down'],['thumb-left',[false,false,false,false],'left'],['thumb-right',[false,false,false,false],'right']] as const)('recognizes %s at different normalized sizes',(pose,up,thumb)=>{for(const scale of [.5,1,1.5])expect(classifyHandPose(landmarks([...up],thumb).map(p=>({x:(p.x-.5)*scale+.5,y:(p.y-.5)*scale+.5,z:0})))).toBe(pose);});
 it('recognizes OK and does not confuse it with a closed fist',()=>{const p=landmarks([false,true,true,true]);p[4]={...p[8]};expect(classifyHandPose(p)).toBe('ok');expect(classifyHandPose(landmarks([false,false,false,false]))).toBe('fist');});
 it('normalizes left/right after mirroring coordinates',()=>{const p=landmarks([false,false,false,false],'left');expect(classifyHandPose(p)).toBe('thumb-left');expect(classifyHandPose(p.map(v=>({...v,x:1-v.x})))).toBe('thumb-right');});
});

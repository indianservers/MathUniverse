import {expect,it} from 'vitest';
import {geometry3dInventory,visibleBaseTransforms,type SceneTransform3D} from './geometry3dInventory';
import {SemanticEngine} from '../math-robo/intelligence/semanticEngine';
import {describeObject} from '../math-robo/intelligence/sceneContext';
import type {VisualCommand} from './commands';
import {commandTransform3d} from './solidAdapter';
const transform:SceneTransform3D={position:[2,1,3],rotation:[0,0,0],scale:1,dimensions:[4,4,4],color:'#22d3ee',visible:true};
it('deleted default objects are hidden in the rendered scene without altering saved transforms',()=>{
 const transforms={sphere3d:transform,point:{...transform}};
 const rendered=visibleBaseTransforms(transforms,['sphere3d','point']);
 expect(Object.values(rendered).every(t=>!t.visible)).toBe(true);expect(transform.visible).toBe(true);
 expect(visibleBaseTransforms(transforms,[]).sphere3d.visible).toBe(true);
});
it('selected default sphere supports chained volume, move and radius questions',async()=>{
 const engine=new SemanticEngine('geometry3d');
 let commands=geometry3dInventory([{id:'sphere3d',kind:'sphere',transform}]);
 const read=()=>({objects:commands.map(c=>describeObject(c,'geometry3d')),selectedIds:['sphere3d']});
 const apply=async(c:VisualCommand)=>{if(c.roboClearAll)commands=[];else if(c.roboControl==='delete')commands=commands.filter(o=>o.objectId!==c.objectId);else if(!c.roboControl)commands=commands.map(o=>o.objectId===c.objectId?c:o);};
 const ask=async(text:string)=>{const scene=read();engine.sync(scene.objects,scene.selectedIds);return engine.execute(text,apply,undefined,read);};
 expect((await ask('What is its volume?')).value).toBeCloseTo(4*Math.PI*8/3);
 const move=await ask('Move it 3 units right');expect(move.status,move.message).toBe('success');
 expect((await ask('What is its radius?')).value).toBe(2);
 expect(engine.snapshot().objects[0].position).toEqual([5,1,3]);
 const clear=await ask('clear all');expect(clear.status,clear.message).toBe('success');expect(commands).toEqual([]);
});
it('includes manually inserted solids without an NLP command',()=>{
 expect(geometry3dInventory([{id:'manual',kind:'cube',transform}])[0]).toMatchObject({objectId:'manual',kind:'cube',width:4,points:[[2,1,3]]});
});
it('reads line coordinates after a manual drag instead of restoring stale endpoints',()=>{
 const source:VisualCommand={kind:'line',dimension:'3d',points:[[0,0,0],[4,0,0]],width:4,height:1,radius:1,color:'red',rotation:[0,0,0],scale:1};
 const original=commandTransform3d(source);
 const actual={...transform,...original,position:[5,2,1] as [number,number,number]};
 const command=geometry3dInventory([{id:'line',kind:'line',transform:actual,command:source}])[0];
 expect(command.points).toEqual([[3,2,1],[7,2,1]]);
});

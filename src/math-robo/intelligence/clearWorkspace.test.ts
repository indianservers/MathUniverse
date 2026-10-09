import {expect,it} from 'vitest';
import {SemanticEngine} from './semanticEngine';
import type {VisualCommand} from '../../offline-intelligence/commands';

for(const mode of ['graph2d','graph3d','geometry2d','geometry3d'] as const){
  for(const phrase of ['reset all','clear all','delete all','remove everything']){
    it(`${mode}: ${phrase} clears native objects outside Ruhi inventory`,async()=>{
      const engine=new SemanticEngine(mode);
      const objects=new Map<string,VisualCommand>();
      const apply=async(command:VisualCommand)=>{
        if(command.roboClearAll)objects.clear();
        else if(command.roboControl==='delete')objects.delete(command.objectId!);
        else if(!command.roboControl)objects.set(command.objectId!,command);
      };
      const created=await engine.execute(mode.endsWith('3d')?'Draw a sphere radius 3':'Draw a circle radius 3',apply);
      expect(created.status,created.message).toBe('success');
      objects.set('manual-object',{kind:'point',dimension:mode.endsWith('3d')?'3d':'2d',points:[[1,2]],width:1,height:1,radius:1,color:'red'});
      const result=await engine.execute(phrase,apply);
      expect(result.status,result.message).toBe('success');
      expect(result.effects.some(effect=>effect.roboClearAll)).toBe(true);
      expect(objects.size).toBe(0);
      expect(engine.snapshot().objects).toEqual([]);
    });
  }
}

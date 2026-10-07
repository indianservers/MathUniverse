import {describe, expect, it} from 'vitest';
import * as tf from '@tensorflow/tfjs';
import {features, readCorrections, RoboLearning} from './roboLearning';

function memoryStorage(): Storage {
  const data=new Map<string,string>();
  return {getItem:key=>data.get(key)??null,setItem:(key,value)=>{data.set(key,value);},removeItem:key=>{data.delete(key);},clear:()=>data.clear(),key:index=>[...data.keys()][index]??null,get length(){return data.size;}};
}
describe('Robo continual command learning',()=>{
  it('uses stable normalized features without encoding numeric dimensions',()=>{
    expect(features(' DRAW circle radius 2 ')).toEqual(features('draw circle radius 50'));
    expect(features('draw circle')).not.toEqual(features('draw cube'));
    expect(features('draw circle').reduce((sum,value)=>sum+value*value,0)).toBeCloseTo(1);
  });
  it('rejects corrupt and unsafe saved commands',()=>{
    expect(readCorrections({getItem:()=>'{broken'})).toEqual([]);
    expect(readCorrections({getItem:()=>JSON.stringify([{phrase:'hi',canonical:'Create circle radius -2',mode:'normal'},{phrase:'hi',canonical:'Create circle',mode:'bogus'}])})).toEqual([]);
  });
  it('trains, learns corrections, restores them, isolates modes and clears memory',async()=>{
    await tf.setBackend('cpu');
    const storage=memoryStorage();
    const learner=new RoboLearning(storage);
    const before=tf.memory().numTensors;
    try {
      await learner.ready();
      const neural=await learner.interpret('Sketch a round shape','normal');
      expect(neural.command?.kind).toBe('circle');
      expect(neural.source).toBe('TensorFlow.js prediction');
      expect((await learner.interpret('Create circle radius -2','normal')).command).toBeUndefined();
      expect((await learner.interpret('2x+5=15','normal')).message).toBe('');
      const values=await learner.interpret('Create rectangle width 7 height 9','normal');
      expect(values.command).toMatchObject({kind:'rectangle',width:7,height:9});
      await expect(learner.teach('bad','Create circle radius -2','normal')).rejects.toThrow();
      expect(learner.count).toBe(0);
      let weightsBefore:number[]=[];
      await learner.exportModel(tf.io.withSaveHandler(async artifacts=>{
        weightsBefore=Array.from(new Uint8Array(artifacts.weightData as ArrayBuffer));
        return {modelArtifactsInfo:tf.io.getModelArtifactsInfoForJSON(artifacts)};
      }));
      await learner.teach('my moon','Create circle radius 5','normal');
      await learner.exportModel(tf.io.withSaveHandler(async artifacts=>{
        expect(Array.from(new Uint8Array(artifacts.weightData as ArrayBuffer))).not.toEqual(weightsBefore);
        return {modelArtifactsInfo:tf.io.getModelArtifactsInfoForJSON(artifacts)};
      }));
      expect(learner.count).toBe(1);
      expect((await learner.interpret('MY MOON','normal')).command).toMatchObject({kind:'circle',radius:5});
      const restored=new RoboLearning(storage);
      try {
        expect(restored.count).toBe(1);
        expect((await restored.interpret('my moon','normal')).source).toBe('Your correction');
        expect((await restored.interpret('my moon','geometry3d')).source).not.toBe('Your correction');
        await restored.reset();
        expect(restored.count).toBe(0);
        expect(readCorrections(storage)).toEqual([]);
      } finally {await restored.dispose();}
      // Replacement teaches a new meaning instead of adding contradictory labels.
      await learner.teach('my moon','Create sphere radius 4','normal');
      expect(learner.count).toBe(1);
      expect((await learner.interpret('my moon','normal')).command?.kind).toBe('sphere');
    } finally {await learner.dispose();}
    expect(tf.memory().numTensors).toBe(before);
  },120000);
});

import {describe,it,expect,afterAll} from 'vitest';
import {mkdirSync} from 'node:fs';
import {writeTestReport as writeFileSync} from '../testReport';
import {SemanticEngine} from './semanticEngine';
import {adversarialCorpus} from './adversarialCorpus';
import {geometryState} from './resultVerifier';
import {OPERATIONS,BASELINE_OPERATION_KEYS,BASELINE_SUBACTIONS} from './actionRegistry';
import {generateStarterDataset} from './semanticDataset';
import {datasetQuality} from './datasetQuality';
import type {RoboMode} from './types';
const modes:RoboMode[]=['geometry2d','geometry3d','graph2d','graph3d'];
const run=(e:SemanticEngine,p:string)=>e.execute(p,async()=>undefined);
let seed=20261008;
const random=()=>{seed=Math.imul(seed,1664525)+1013904223;return (seed>>>0)/4294967296;};
const cases=Array.from({length:100},(_,i)=>({i,x:Math.round((random()-.5)*1000)/10,y:Math.round((random()-.5)*1000)/10,dx:1+Math.floor(random()*20),dy:1+Math.floor(random()*20),r:1+Math.floor(random()*20),factor:1+Math.floor(random()*5)}));
let negativePassed=0,propertyPassed=0;
describe('v4.1 seeded geometry properties (seed 20261008)',()=>{
 it.each(modes)('%s verifies every target of a plural translation',async mode=>{const e=new SemanticEngine(mode);expect((await run(e,'Create two circles radius 5')).status).toBe('success');expect((await run(e,'Move them 3 units right and 2 up')).status).toBe('success');expect(e.snapshot().objects).toHaveLength(2);for(const object of e.snapshot().objects){expect(object.position[0]).toBe(3);expect(object.position[1]).toBe(2);}});
 for(const mode of modes)for(const sample of cases){
  it(`${mode}: translation and inverse ${sample.i}`,async()=>{const e=new SemanticEngine(mode);expect((await run(e,`Create a point at (${sample.x},${sample.y}${mode.endsWith('3d')?',0':''})`)).status).toBe('success');expect((await run(e,`Move it ${sample.dx} right and ${sample.dy} up`)).status).toBe('success');const p=e.snapshot().objects[0].position;expect(p[0]).toBeCloseTo(sample.x+sample.dx);expect(p[1]).toBeCloseTo(sample.y+sample.dy);expect((await run(e,`Move it ${sample.dx} left and ${sample.dy} down`)).status).toBe('success');expect(e.snapshot().objects[0].position[0]).toBeCloseTo(sample.x);expect(e.snapshot().objects[0].position[1]).toBeCloseTo(sample.y);propertyPassed++;});
  it(`${mode}: circle area is query-only ${sample.i}`,async()=>{const e=new SemanticEngine(mode);expect((await run(e,`Create a circle radius ${sample.r}`)).status).toBe('success');const before=geometryState(e.snapshot());const result=await run(e,'What is its area?');expect(result.status).toBe('success');expect(result.value).toBeCloseTo(Math.PI*sample.r**2);expect(geometryState(e.snapshot())).toBe(before);expect(result.effects).toEqual([]);propertyPassed++;});
  it(`${mode}: undo and redo radius ${sample.i}`,async()=>{const e=new SemanticEngine(mode);await run(e,`Create a circle radius ${sample.r}`);const before=geometryState(e.snapshot());expect((await run(e,`Change its radius to ${sample.r+sample.factor}`)).status).toBe('success');const changed=geometryState(e.snapshot());expect(changed).not.toBe(before);expect((await run(e,'Undo')).status).toBe('success');expect(geometryState(e.snapshot())).toBe(before);expect((await run(e,'Redo')).status).toBe('success');expect(geometryState(e.snapshot())).toBe(changed);propertyPassed++;});
  it(`${mode}: invalid radius transaction ${sample.i}`,async()=>{const e=new SemanticEngine(mode);await run(e,`Create a circle radius ${sample.r}`);const before=geometryState(e.snapshot());let applied=0;const result=await e.execute(`Change its radius to -${sample.factor}`,async()=>{applied++;});expect(result.status).not.toBe('success');expect(applied).toBe(0);expect(geometryState(e.snapshot())).toBe(before);propertyPassed++;});
 }
});
describe('v4.1 intent-negative adversarial safety',()=>{
 it.each(adversarialCorpus)('$id: $phrase',async row=>{const e=new SemanticEngine(row.mode);await run(e,'Create a circle radius 5');const before=geometryState(e.snapshot());let applied=0;await e.execute(row.phrase,async()=>{applied++;});expect(applied).toBe(0);expect(geometryState(e.snapshot())).toBe(before);negativePassed++;});
});
afterAll(()=>{mkdirSync('artifacts/math-robo-v4.1',{recursive:true});writeFileSync('artifacts/math-robo-v4.1/regression.json',JSON.stringify({seed:20261008,properties:{total:1600,passed:propertyPassed},adversarial:{rows:adversarialCorpus.length,authoredFamilies:50,passed:negativePassed,falseMutations:adversarialCorpus.length-negativePassed,scope:'Intent-negative safety; grouped surface perturbations'},registry:{baselineSubactions:BASELINE_SUBACTIONS.length,baselinePairs:BASELINE_OPERATION_KEYS.length,implementedPairs:OPERATIONS.filter(o=>o.implemented).length,unsupported:OPERATIONS.filter(o=>!o.implemented)},dataset:datasetQuality(generateStarterDataset())},null,2));});

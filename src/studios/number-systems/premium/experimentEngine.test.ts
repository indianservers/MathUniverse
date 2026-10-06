import {describe,expect,it} from 'vitest';
import {evaluateExperiment,experimentConfigs,randomExperiment} from './experimentEngine';
describe('live Number Systems experiments',()=>{
 for(const [id,c] of Object.entries(experimentConfigs)){
  it(`${id}: every mode evaluates its own displayed model`,()=>{for(const mode of c.modes){const r=evaluateExperiment(id,{...c.initial,mode});expect(r.answer).not.toBe('');expect(Number.isFinite(r.result)).toBe(true);expect(r.steps).toHaveLength(3);}});
  it(`${id}: generated questions remain valid at each difficulty`,()=>{for(const d of ['Starter','Explorer','Stretch'])for(let seed=1;seed<25;seed++){const m=randomExperiment(id,seed,d);expect(()=>evaluateExperiment(id,m)).not.toThrow();}});
 }
 it('subtracting a negative reverses the signed movement',()=>{const m={...experimentConfigs.integers.initial,a:'3',b:'-4',mode:'Subtract'},r=evaluateExperiment('integers',m);expect(r.answer).toBe('7');expect(r.steps[1]).toContain('Move 4 signed units');});
 it('does not accept division by zero or decimal integer inputs',()=>{expect(()=>evaluateExperiment('integers',{...experimentConfigs.integers.initial,b:'0',mode:'Divide'})).toThrow('Division by zero');expect(()=>evaluateExperiment('integers',{...experimentConfigs.integers.initial,a:'1.2'})).toThrow('integer');});
 it('zero has no predecessor in whole numbers',()=>{expect(evaluateExperiment('natural-whole',{...experimentConfigs['natural-whole'].initial,a:'0',mode:'Predecessor'}).answer).toBe('none');});
 it('preserves exact recurring ratios and equivalent inputs',()=>{const r=evaluateExperiment('rational',{...experimentConfigs.rational.initial,a:'1',b:'3'});expect(r.facts.find(f=>f.label==='Exact decimal')?.value).toBe('0.(3)');expect(evaluateExperiment('ordering-comparing',{...experimentConfigs['ordering-comparing'].initial,a:'3/4',b:'75%'}).answer).toBe('=');});
 it('open zero boundary excludes zero while a closed one includes it',()=>{const m={...experimentConfigs['absolute-distance-intervals'].initial,a:'0',b:'4'};expect(evaluateExperiment('absolute-distance-intervals',{...m,left:false}).answer).toBe('no');expect(evaluateExperiment('absolute-distance-intervals',{...m,left:true}).answer).toBe('yes');});
 it('treats perfect roots as rational and measures rounding error',()=>{const r=evaluateExperiment('irrational',{...experimentConfigs.irrational.initial,a:'9'});expect(r.steps[2]).toContain('rational');expect(evaluateExperiment('irrational',{...experimentConfigs.irrational.initial,mode:'Approximation error'}).result).toBeCloseTo(Math.abs(Math.SQRT2-1.414));});
 it('does not classify an irrational sum from its rounded decimal',()=>{const m={...experimentConfigs['properties-operations'].initial,a:'√2',b:'√2',set:'I' as const};expect(evaluateExperiment('properties-operations',m).facts[2].value).toContain('does not establish');expect(evaluateExperiment('properties-operations',{...m,mode:'Multiply'}).facts[2].value).toContain('leaves I');});
});

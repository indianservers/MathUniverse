import {expect,it} from 'vitest';
import {executionOutcome,noEvidence} from './executionOutcome';
import {topologicalObjects,validateMathObjectGraph,type MathObjectGraph,type MathObjectIR} from './mathIR';
const point=(id:string,dependencies:string[]=[]):MathObjectIR=>({id,aliases:['user label'],definition:{kind:'point',coordinates:[0,0]},state:{status:'defined'},unit:{symbol:'u',dimension:'length',scaleToBase:1},domain:'REAL',assumptions:[],dependencies});
const graph=(objects:MathObjectIR[]):MathObjectGraph=>({schema:'ruhi-math-object-graph',version:1,objects});
it('rejects verified execution without independent evidence',()=>{expect(()=>executionOutcome('verified')).toThrow(/independent/);expect(executionOutcome('valid_unverified').evidence).toEqual(noEvidence());expect(executionOutcome('verified','id',undefined,{level:'numerical_consistency',independent:true,passed:true,method:'Independent residual',assumptions:[]})).toMatchObject({status:'verified',evidence:{level:'numerical_consistency'}});});
it('orders dependencies by semantic IDs, with aliases independent of identity',()=>{expect(topologicalObjects(graph([point('b',['a']),point('a')])).map(o=>o.id)).toEqual(['a','b']);});
it('rejects cycles, duplicate IDs, dangling references and inconsistent dimensions',()=>{
 expect(()=>validateMathObjectGraph(graph([point('a',['b']),point('b',['a'])]))).toThrow(/cycle/);
 expect(()=>validateMathObjectGraph(graph([point('a'),point('a')]))).toThrow(/duplicate/);
 expect(()=>validateMathObjectGraph(graph([point('a',['missing'])]))).toThrow(/Dangling/);
 const p=point('a');p.definition={kind:'line',points:[[0,0],[1,1,1]]};expect(()=>validateMathObjectGraph(graph([p]))).toThrow(/dimensions/);
});

it('rejects nonnumeric coordinates, nonfinite values, bad units/domains and zero rational denominator',()=>{const a=point('a');for(const invalid of [{...a,definition:{kind:'point',coordinates:['bad',0]}},{...a,definition:{kind:'point',coordinates:[Infinity,0]}},{...a,unit:{...a.unit,scaleToBase:0}},{...a,domain:'QUATERNION'},{...a,definition:{kind:'exact_rational',value:{kind:'RATIONAL',numerator:'1',denominator:'0'}}}])expect(()=>validateMathObjectGraph(graph([invalid as MathObjectIR]))).toThrow();});

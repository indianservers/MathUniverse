import {beforeAll,afterAll,it,expect,vi} from 'vitest';
import * as tf from '@tensorflow/tfjs';
import {readFileSync} from 'node:fs';
import {writeTestReport as writeFileSync} from '../testReport';
import {buildContextDataset} from './contextDataset';
import {inferContext,type ContextRow} from './ruhiContextNet';
import {ContextAssistant} from './contextAssistant';
import {emptyScene,describeObject} from './sceneContext';
import {registerPageCapability,executePigeonhole} from './pageCapabilities';
const state=vi.hoisted(()=>({model:undefined as tf.LayersModel|undefined}));
vi.mock('./ruhiContextNet',async original=>({...await original<typeof import('./ruhiContextNet')>(),loadContextModel:async()=>state.model!}));
beforeAll(async()=>{await tf.setBackend('cpu');const json=JSON.parse(readFileSync('public/models/ruhi-context-v1/model.json','utf8')),data=readFileSync('public/models/ruhi-context-v1/weights.bin');state.model=await tf.loadLayersModel(tf.io.fromMemory({modelTopology:json.modelTopology,weightSpecs:json.weightsManifest[0].weights,weightData:data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),userDefinedMetadata:json.userDefinedMetadata}));});
afterAll(()=>state.model?.dispose());
it('grounds rectangle dimensions in the selected scene instead of a predicted unrelated topic',async()=>{
 const scene=emptyScene('graph2d');scene.objects=[describeObject({kind:'rectangle',dimension:'2d',action:'create',objectId:'rectangle-test',points:[[0,0]],width:8,height:4,depth:1,radius:1,color:'blue',rotation:[0,0,30],scale:1},'graph2d')];scene.selectedIds=['rectangle-test'];
 const result=await new ContextAssistant().answer('What are its dimensions?','/workspace/graph',scene);expect(result.status).toBe('success');expect(result.message).toMatch(/width 8, height 4/);expect(result.message).not.toMatch(/Biological/);
});
it('evaluates 300+ held-out questions without semantic template split leakage',()=>{
 const rows=buildContextDataset(),groups=new Map<string,string>();for(const row of rows){expect(groups.get(row.group)??row.split).toBe(row.split);groups.set(row.group,row.split);}const test=rows.filter(r=>r.split==='test');expect(test.length).toBeGreaterThanOrEqual(300);
 const results=test.map(row=>({question:row.question,pageId:row.pageId,group:row.group,intent:row.intent,meaning:row.meaning,prediction:inferContext(state.model!,row)}));
 const score=(rows:typeof results,key:'intent'|'meaning')=>rows.filter(r=>r[key]===r.prediction[key]).length/rows.length;
 const terms=results.filter(r=>r.group.startsWith('term:'));
 writeFileSync('artifacts/ruhi-context/held-out-results.json',JSON.stringify({rows:results.length,intentAccuracy:score(results,'intent'),contextAccuracy:score(results,'meaning'),terminologyAccuracy:score(terms,'meaning'),results},null,2));
});
it('maintains pigeonhole topic through explanation, example and why',async()=>{
 const assistant=new ContextAssistant(),scene=emptyScene('normal');
 for(const prompt of ['What are pigeon holes?','Explain this.','Give an example.','Why?']){const result=await assistant.answer(prompt,'/discrete-world/combinatorics?mode=pigeonhole',scene);expect(result.status,JSON.stringify(result)).toBe('success');expect(result.knowledgeId).toBe('pigeonhole');}
});
it('disambiguates tree and supports explicit biological override across page transitions',async()=>{
 const assistant=new ContextAssistant(),scene=emptyScene('normal');
 const graph=await assistant.answer('What is a tree?','/graph-theory',scene);expect(graph.status,JSON.stringify(graph)).toBe('success');expect(graph.message).toMatch(/connected acyclic/);
 const data=await assistant.answer('What is a tree?','/discrete-world/algorithms',scene);expect(data.status,JSON.stringify(data)).toBe('success');expect(data.message).toMatch(/hierarchically/);
 const biology=await assistant.answer("I'm not asking about the mathematical tree. Tell me about real trees.",'/graph-theory',scene);expect(biology.status,JSON.stringify(biology)).toBe('success');expect(biology.knowledgeId).toBe('real-tree');
});
it('executes a mounted simulation only after independent validation',async()=>{
 let simulation={n:5,k:4,distribution:[2,1,1,1]};const unregister=registerPageCapability({knowledgeId:'pigeonhole',read:()=>simulation,apply:async(n,k)=>{simulation={n,k,distribution:[4,3,3]};}});
 try{const result=await new ContextAssistant().answer('Show 10 objects in 3 boxes.','/discrete-world/combinatorics?mode=pigeonhole',emptyScene('normal'));expect(result.status,JSON.stringify(result)).toBe('success');expect(simulation).toEqual({n:10,k:3,distribution:[4,3,3]});expect(result.message).toMatch(/4 or more/);await expect(executePigeonhole(-1,0)).rejects.toThrow();expect(simulation.n).toBe(10);}finally{unregister();}
});
it('does not mutate anything for uncertainty and unrelated questions',async()=>{
 const assistant=new ContextAssistant();expect((await assistant.answer('What should I do?','/graph-theory',emptyScene('normal'))).status).toBe('ambiguous');
 const unrelated=await assistant.answer('What is the weather','/graph-theory',emptyScene('normal'));expect(unrelated.status).toBe('unsupported');
});
it('has zero false simulation actions for fifteen uncertain, negative or read-only questions',async()=>{
 let calls=0;const snapshot={n:5,k:4,distribution:[2,1,1,1]},unregister=registerPageCapability({knowledgeId:'pigeonhole',read:()=>snapshot,apply:async()=>{calls++;}});
 try{for(const question of ['What should I do?','What is the weather','Tell me a joke','Maybe delete everything','Do not move anything','Explain this','Give an example','Why','What is the formula','Prove it','Explain the previous concept','What does this mean','Do not show 10 objects in 3 boxes','What if I show 10 objects in 3 boxes','Maybe show 10 objects in 3 boxes'])await new ContextAssistant().answer(question,'/discrete-world/combinatorics?mode=pigeonhole',emptyScene('normal'));expect(calls).toBe(0);writeFileSync('artifacts/ruhi-context/false-action-results.json',JSON.stringify({questions:15,falseActions:calls,rate:calls/15},null,2));}finally{unregister();}
});
it('resolves previous-topic and selected-object references',async()=>{
 const assistant=new ContextAssistant(),scene=emptyScene('normal');await assistant.answer('What are pigeon holes?','/discrete-world/combinatorics?mode=pigeonhole',scene);await assistant.answer('What is a tree?','/graph-theory',scene);
 const previous=await assistant.answer('Explain the previous concept','/graph-theory',scene);expect(previous.status,JSON.stringify(previous)).toBe('success');expect(previous.knowledgeId).toBe('pigeonhole');
 scene.objects=[describeObject({kind:'circle',objectId:'C1',dimension:'2d',points:[[2,3]],radius:5,width:10,height:10,color:'#3b82f6',action:'create',scale:1,rotation:[0,0,0]},'normal')];scene.selectedIds=['C1'];const selected=await assistant.answer('Explain the selected object','/workspace/geometry',scene);expect(selected.status,JSON.stringify(selected)).toBe('success');expect(selected.message).toMatch(/C1/);expect(selected.message).toMatch(/2, 3/);
});
it('disposes inference tensors and measures CPU latency',()=>{
 const input:ContextRow=buildContextDataset().find(r=>r.split==='test')!,before=tf.memory().numTensors,start=performance.now();for(let i=0;i<150;i++)inferContext(state.model!,input);expect(tf.memory().numTensors).toBe(before);writeFileSync('artifacts/ruhi-context/cpu-performance.json',JSON.stringify({backend:tf.getBackend(),inferences:150,meanMs:(performance.now()-start)/150,tensorsBefore:before,tensorsAfter:tf.memory().numTensors},null,2));
});

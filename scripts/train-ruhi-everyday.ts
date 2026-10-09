import * as tf from '@tensorflow/tfjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {generateStarterDataset,validateSemanticRows,splitSemanticRows,contextToScene} from '../src/math-robo/intelligence/semanticDataset';
import {trainSemanticModel,evaluateSemanticModel,inferSemanticHeads,HEAD_LABELS} from '../src/math-robo/intelligence/hierarchicalModel';
import {SemanticEngine} from '../src/math-robo/intelligence/semanticEngine';
import {normalizeLanguage} from '../src/math-robo/intelligence/numberParser';
import {assessExecution,publicationBlocks} from '../src/math-robo/intelligence/candidateAssessment';
import type {SemanticRow,RoboMode,RoboTarget} from '../src/math-robo/intelligence/types';
import type {VisualCommand} from '../src/offline-intelligence/commands';
const dir='reports/ruhi-everyday-training',modelDir=dir+'/candidate-model';
await mkdir(modelDir,{recursive:true});
const modes:RoboMode[]=['graph2d','geometry2d','graph3d','geometry3d'];
const types=['circle','triangle','rectangle','square','point','line','vector','sphere','cube','cylinder'];
const labels=['C','T','R','S','P','L','V','SP','CU','CY'];
type Case={id:string;row:SemanticRow;expectedIds:string[];valid:boolean;family:string};
const cases:Case[]=[];
function context(mode:RoboMode):NonNullable<SemanticRow['context']>{return {objects:types.flatMap((type,i)=>[1,2].map(n=>({id:type+'-'+n,type,mode,label:labels[i]+n,position:mode.endsWith('3d')?[i*2,n,1]:[i*2,n],radius:n+2,vertices:['triangle','line','vector'].includes(type)?(mode.endsWith('3d')?[[0,0,0],[4,0,0],[2,3,0]]:[[0,0],[4,0],[2,3]]):undefined,style:{color:n===1?'#3b82f6':'#ef4444'},parameters:{width:4,height:6,depth:3}}))),selected:['circle-1'],lastReferenced:'circle-1'};}
const selectors=types.flatMap((type,i)=>[
 {phrase:type+'s',target:{type} as RoboTarget,ids:[type+'-1',type+'-2']},
 {phrase:'blue '+type+'s',target:{type,color:'blue'} as RoboTarget,ids:[type+'-1']},
 {phrase:type+' '+labels[i]+'1',target:{type,name:(labels[i]+'1').toLowerCase()} as RoboTarget,ids:[type+'-1']}
]);
const prefixes=['clear','delete','remove','reset'].flatMap(verb=>['except','except for','excluding','apart from','other than'].map(marker=>verb+' all '+marker));
for(const [s,selector] of selectors.entries())for(const [p,prefix] of prefixes.entries()){
 const mode=modes[(s+p)%4],phrase=prefix+' '+selector.phrase;
 cases.push({id:'everyday-'+String(cases.length+1).padStart(4,'0'),valid:true,family:'exception',expectedIds:selector.ids,row:{phrase,mode,action:'DELETE',subAction:'ALL',parameters:{preserveTargets:[selector.target]},context:context(mode),group:'everyday-preserve-'+s,source:'everyday-authored-template'}});
}
for(const [s,selector] of selectors.entries())for(const verb of ['keep','leave']){
 const mode=modes[s%4];cases.push({id:'everyday-'+String(cases.length+1).padStart(4,'0'),valid:true,family:'keep-first',expectedIds:selector.ids,row:{phrase:verb+' '+selector.phrase+' and clear everything else',mode,action:'DELETE',subAction:'ALL',parameters:{preserveTargets:[selector.target]},context:context(mode),group:'everyday-preserve-'+s,source:'everyday-authored-template'}});
}
for(let i=0;i<100;i++){
 const mode=modes[i%4],type=types[i%10],bad=['clear all except missing'+i,'delete all except '+type+' unknown'+i,'clear all except '+type+'s and missing'+i,'clear all '+type+'s except missing'+i][Math.floor(i/25)];
 const ctx=context(mode);cases.push({id:'guard-'+i,valid:false,family:'unknown-or-scoped-exception',expectedIds:ctx.objects.map(o=>o.id),row:{phrase:(['clear all except','clear all except circles and','keep circles and clear all','leave triangles then delete everything','clear all circles except C1','delete all rectangles except R1','clear all except nonexistent','clear all except blue missing shapes','clear all except circle nonsense words','clear all apart from'][i]??bad),mode,action:'DELETE',subAction:'ALL',parameters:{},context:ctx}});
}
await writeFile(dir+'/cases.json',JSON.stringify(cases,null,2));
const outcomes=[];
for(const c of cases){
 const engine=new SemanticEngine(c.row.mode),scene=contextToScene(c.row),native=new Map(scene.objects.map(o=>[o.id,structuredClone(o.command)]));engine.sync(scene.objects,scene.selectedIds,{lastReferenced:scene.lastReferenced});
 const originals=new Map(native),result=await engine.execute(c.row.phrase,async(command:VisualCommand)=>{if(command.roboClearAll)native.clear();else if(command.roboControl==='delete')native.delete(command.objectId!);else if(!command.roboControl)native.set(command.objectId!,structuredClone(command));});
 const actual=[...native.keys()].sort(),expected=[...c.expectedIds].sort();
 const geometryIntact=actual.every(id=>JSON.stringify(native.get(id))===JSON.stringify(originals.get(id)));
 const passed=JSON.stringify(actual)===JSON.stringify(expected)&&geometryIntact&&(c.valid?result.status==='success':result.status!=='success')&&!result.effects.some(e=>e.roboClearAll);
 outcomes.push({id:c.id,phrase:c.row.phrase,mode:c.row.mode,valid:c.valid,passed,status:result.status,message:result.message,expectedIds:expected,actualIds:actual,geometryIntact});
}
await writeFile(dir+'/case-results.json',JSON.stringify(outcomes,null,2));
const failures=outcomes.filter(o=>!o.passed);console.log('Everyday execution:',outcomes.length,'cases;',failures.length,'failures');
if(failures.length){console.log(JSON.stringify(failures.slice(0,8)));throw new Error('Fix everyday failures before training.');}
const positive=validateSemanticRows(cases.filter(c=>c.valid).map(c=>c.row));
const everydayJsonl=positive.map(r=>JSON.stringify(r)).join('\n')+'\n';
await writeFile(dir+'/everyday-training.jsonl',everydayJsonl);
await mkdir('public/datasets',{recursive:true});await writeFile('public/datasets/ruhi-everyday-660.jsonl',everydayJsonl);
const all=validateSemanticRows([...positive,...generateStarterDataset()]);
for(const row of all)if(row.parameters.preserveTargets)row.group='preserve-'+JSON.stringify(row.parameters.preserveTargets.map(target=>typeof target==='object'?Object.fromEntries(Object.entries(target).sort(([a],[b])=>a.localeCompare(b))):target));
const seen=new Set<string>(),rows=all.filter(row=>{const key=row.mode+':'+normalizeLanguage(row.phrase);if(seen.has(key))return false;seen.add(key);return true;});
const split=splitSemanticRows(rows);
await writeFile(dir+'/combined-training.jsonl',rows.map(r=>JSON.stringify(r)).join('\n')+'\n');
console.log('Training dataset:',rows.length,'rows; split:',split.train.length,split.validation.length,split.test.length);
await tf.setBackend('cpu');await tf.ready();
const publicPath='public/models/math-robo-intelligence-v4/';
const baselineJson=JSON.parse(await readFile(publicPath+'model.json','utf8')),binary=await readFile(publicPath+'weights.bin');
const hash=createHash('sha256').update(binary).digest('hex');
const baseline=await tf.loadLayersModel(tf.io.fromMemory({modelTopology:baselineJson.modelTopology,weightSpecs:baselineJson.weightsManifest[0].weights,weightData:binary.buffer.slice(binary.byteOffset,binary.byteOffset+binary.byteLength),userDefinedMetadata:baselineJson.userDefinedMetadata}));
const baselineMetrics=await evaluateSemanticModel(baseline,split.test);baseline.dispose();
const {model,report}=await trainSemanticModel(rows,12,256,(message,_fraction,loss)=>{if(/complete|Evaluating/.test(message))console.log(message,loss??'');},()=>false,{hidden:128,encoder:64,balanced:true});
await model.save(tf.io.withSaveHandler(async artifact=>{const data=artifact.weightData as ArrayBuffer;await writeFile(modelDir+'/weights.bin',Buffer.from(data));await writeFile(modelDir+'/model.json',JSON.stringify({format:'layers-model',generatedBy:'TensorFlow.js '+tf.version.tfjs,modelTopology:artifact.modelTopology,weightsManifest:[{paths:['weights.bin'],weights:artifact.weightSpecs}],userDefinedMetadata:artifact.userDefinedMetadata}));return {modelArtifactsInfo:{dateSaved:new Date(),modelTopologyType:'JSON',weightDataBytes:data.byteLength}};}));
await writeFile(modelDir+'/labels.json',JSON.stringify(HEAD_LABELS,null,2));await writeFile(modelDir+'/metadata.json',JSON.stringify(report,null,2));
let neuralIntentCorrect=0;for(const row of split.test){const p=inferSemanticHeads(model,row.phrase,row.mode);if(p.action.label===row.action&&p.subAction.label===row.subAction)neuralIntentCorrect++;}
const savedJson=JSON.parse(await readFile(modelDir+'/model.json','utf8')),savedBinary=await readFile(modelDir+'/weights.bin');
const reloaded=await tf.loadLayersModel(tf.io.fromMemory({modelTopology:savedJson.modelTopology,weightSpecs:savedJson.weightsManifest[0].weights,weightData:savedBinary.buffer.slice(savedBinary.byteOffset,savedBinary.byteOffset+savedBinary.byteLength),userDefinedMetadata:savedJson.userDefinedMetadata}));
const reloadVerified=JSON.stringify(inferSemanticHeads(reloaded,'clear all except circles','graph2d'))===JSON.stringify(inferSemanticHeads(model,'clear all except circles','graph2d'));reloaded.dispose();model.optimizer.dispose();model.dispose();
const execution=await assessExecution(rows,message=>{if(/complete|adversarial/i.test(message))console.log(message);});
const blocks=publicationBlocks(report,execution,true);
const baselineUnchanged=createHash('sha256').update(await readFile(publicPath+'weights.bin')).digest('hex')===hash;
const summary={authoredCases:cases.length,positiveTrainingExamples:positive.length,guardCases:100,executionPassed:outcomes.filter(o=>o.passed).length,uniqueRawCommands:new Set(cases.map(c=>c.row.phrase)).size,templateGenerated:true,modes,totalTrainingRows:rows.length,split:{train:split.train.length,validation:split.validation.length,test:split.test.length},baselineMetrics,report,neuralJointIntentAccuracy:neuralIntentCorrect/split.test.length,execution,publication:{promoted:false,blocks},reloadVerified,baselineUnchanged,baselineWeightsSha256:hash};
await writeFile(dir+'/summary.json',JSON.stringify(summary,null,2));
await writeFile(dir+'/REPORT.md',`# Ruhi everyday command training\n\n${cases.length} distinct authored template cases: ${positive.length} valid selective-clearing commands and 100 guarded invalid requests. All ${outcomes.length} passed scene-state execution checks across four workspaces; retained geometry was unchanged. These are generated cases, not collected human conversations. Scene tests use the real SemanticEngine with an in-memory native adapter.\n\nTrained TensorFlow.js CPU candidate for ${report.epochs} epochs on ${rows.length} deduplicated examples including the existing starter corpus. Grouped split: ${split.train.length} train / ${split.validation.length} validation / ${split.test.length} test. Alias families and mode copies of the new examples share semantic groups.\n\nHeld-out neural action accuracy: ${(report.metrics.actionAccuracy*100).toFixed(2)}%; subaction: ${(report.metrics.subActionAccuracy*100).toFixed(2)}%; joint intent: ${(summary.neuralJointIntentAccuracy*100).toFixed(2)}%. Parser semanticExactMatch in metadata is a rule-parser metric, not neural exact match. Exception parameters are resolved by deterministic parsing, not predicted by the neural heads.\n\nActual model files: candidate-model/model.json, candidate-model/weights.bin, labels.json, metadata.json. Serialized weights reloaded and prediction verified: ${reloadVerified}. Production weights unchanged: ${baselineUnchanged}. Candidate is not active in the application. Publication gates: ${blocks.length?blocks.join('; '):'passed; promotion intentionally separate from candidate generation'}.\n\nData: everyday-training.jsonl; full deduplicated corpus: combined-training.jsonl; complete execution evidence: case-results.json; metrics and release assessment: summary.json. Scoped deletion such as clear all circles except C1 is safely rejected rather than interpreted as global deletion.\n`);
console.log('DONE:',JSON.stringify({cases:cases.length,weightsBytes:savedBinary.length,actionAccuracy:report.metrics.actionAccuracy,subActionAccuracy:report.metrics.subActionAccuracy,blocks,reloadVerified,baselineUnchanged}));

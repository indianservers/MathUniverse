import * as tf from '@tensorflow/tfjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {trainSemanticModel,HEAD_LABELS,inferSemanticHeads} from '../src/math-robo/intelligence/hierarchicalModel';
import {generateStarterDataset,validateSemanticRows,splitSemanticRows} from '../src/math-robo/intelligence/semanticDataset';
import {ACTION_REGISTRY,LANGUAGE_ACTIONS,OPERATIONS} from '../src/math-robo/intelligence/actionRegistry';
import {parseSemanticPlan} from '../src/math-robo/intelligence/semanticParser';
import {preparePlan} from '../src/math-robo/intelligence/executionPlanner';
import {emptyScene} from '../src/math-robo/intelligence/sceneContext';
import {migrateCompatibilityPlan,V3_MIGRATION} from '../src/math-robo/intelligence/migration';
import {contextToScene} from '../src/math-robo/intelligence/semanticDataset';
import {V4_SAMPLE_ROWS} from '../src/math-robo/intelligence/sampleDataset';

await tf.setBackend('cpu');
const rows=validateSemanticRows(generateStarterDataset());
const epochs=Number(process.env.ROBO_TRAIN_EPOCHS??12);
let lastEpoch='';
const result=await trainSemanticModel(rows,epochs,128,(message,fraction)=>{if(message.includes('complete')||fraction===1){if(message!==lastEpoch){process.stdout.write(`${message}\n`);lastEpoch=message;}}});
const dir='public/models/math-robo-intelligence-v4';await mkdir(dir,{recursive:true});await mkdir('artifacts/math-robo-v4',{recursive:true});
await result.model.save(tf.io.withSaveHandler(async artifact=>{
  const {weightData,weightSpecs,modelTopology,userDefinedMetadata}=artifact;
  await writeFile(`${dir}/weights.bin`,Buffer.from(weightData as ArrayBuffer));
  await writeFile(`${dir}/model.json`,JSON.stringify({format:'layers-model',generatedBy:`TensorFlow.js ${tf.version.tfjs}`,modelTopology,weightsManifest:[{paths:['weights.bin'],weights:weightSpecs}],userDefinedMetadata}));
  return {modelArtifactsInfo:{dateSaved:new Date(),modelTopologyType:'JSON',weightDataBytes:(weightData as ArrayBuffer).byteLength}};
}));
const coverage=ACTION_REGISTRY.map(action=>({action:action.action,normalizedAction:action.normalizedAction,operations:action.operations.map(op=>({subAction:op.subAction,implemented:op.implemented,executor:op.executor,trainingExamples:rows.filter(row=>row.action===op.action&&row.subAction===op.subAction).length}))}));
const tested=OPERATIONS.filter(op=>op.implemented).map(op=>{
  if(op.action==='UNDO'||op.action==='REDO')return {action:op.action,subAction:op.subAction,tested:true,evidence:'semanticEngine.test.ts history round-trip test'};
  let evidence:string|undefined;for(const row of rows.filter(row=>row.action===op.action&&row.subAction===op.subAction))try{const scene=contextToScene(row),plan=migrateCompatibilityPlan(parseSemanticPlan(row.phrase,row.mode),scene);if(plan.commands[0].action===op.action&&plan.commands[0].subAction===op.subAction){preparePlan(plan,scene);evidence=row.phrase;break;}}catch{/* Try other applicable context examples. */}
  return {action:op.action,subAction:op.subAction,tested:!!evidence,evidence};
});
if(tested.some(op=>!op.tested))throw new Error(`Operations without executable coverage: ${JSON.stringify(tested.filter(op=>!op.tested))}`);
await writeFile(`${dir}/labels.json`,JSON.stringify(HEAD_LABELS,null,2));await writeFile(`${dir}/action-registry.json`,JSON.stringify(ACTION_REGISTRY,null,2));
await writeFile(`${dir}/metadata.json`,JSON.stringify({...result.report,languageActions:LANGUAGE_ACTIONS.length,semanticOperations:OPERATIONS.filter(op=>op.implemented).length,registeredOperations:OPERATIONS.length,inference:'local-browser',context:'read-only snapshots',v3Preserved:true},null,2));
const split=splitSemanticRows(rows);
await writeFile(`${dir}/training-manifest.json`,JSON.stringify({seed:41,split:'Stratified template-family groups targeting 70/15/15; rare classes reserve validation/test families. Actual counts below.',train:split.train.length,validation:split.validation.length,test:split.test.length,source:'controlled templates; exact parameter labels authored independently',dataset:'starter.jsonl',featureVersion:'semantic-hash-768-v4',modeHead:'conditioned on active workspace mode',coverage},null,2));
await writeFile(`${dir}/starter.jsonl`,rows.map(row=>JSON.stringify(row)).join('\n')+'\n');
await writeFile('artifacts/math-robo-v4/evaluation.json',JSON.stringify(result.report,null,2));
await writeFile('artifacts/math-robo-v4/coverage.json',JSON.stringify(coverage,null,2));
await writeFile('artifacts/math-robo-v4/operation-tests.json',JSON.stringify(tested,null,2));await writeFile(`${dir}/v3-migration.json`,JSON.stringify(V3_MIGRATION,null,2));
await mkdir('public/datasets',{recursive:true});await writeFile('public/datasets/math-robo-v4-15-samples.jsonl',V4_SAMPLE_ROWS.map(row=>JSON.stringify(row)).join('\n')+'\n');
const phrase='Draw a rectangle 4 by 6';for(let i=0;i<20;i++)inferSemanticHeads(result.model,phrase,'geometry2d');
const begin=performance.now();for(let i=0;i<100;i++)inferSemanticHeads(result.model,phrase,'geometry2d');const inferenceMs=(performance.now()-begin)/100;
const start=performance.now();for(let i=0;i<1000;i++)parseSemanticPlan(phrase,'geometry2d');const parseMs=(performance.now()-start)/1000;
const plan=parseSemanticPlan(phrase,'geometry2d');const scene=emptyScene('geometry2d');const planStart=performance.now();for(let i=0;i<1000;i++)preparePlan(plan,scene);const planMs=(performance.now()-planStart)/1000;
await writeFile('artifacts/math-robo-v4/benchmark.json',JSON.stringify({environment:`Node ${process.version}, TensorFlow.js CPU (browser benchmarks measured separately)`,inferenceMs,parseMs,planMs,parameters:result.model.countParams(),weightBytes:result.model.countParams()*4},null,2));
process.stdout.write(JSON.stringify({samples:rows.length,testSamples:result.report.testSamples,metrics:{actionAccuracy:result.report.metrics.actionAccuracy,subActionAccuracy:result.report.metrics.subActionAccuracy,semanticExactMatch:result.report.metrics.semanticExactMatch},weightBytes:result.report.weightBytes,inferenceMs,parseMs,planMs})+'\n');result.model.optimizer.dispose();result.model.dispose();

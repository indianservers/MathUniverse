import * as tf from '@tensorflow/tfjs';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {trainSemanticModel,evaluateSemanticModel,inferSemanticHeads,HEAD_LABELS} from '../src/math-robo/intelligence/hierarchicalModel';
import {generateStarterDataset,validateSemanticRows,splitSemanticRows} from '../src/math-robo/intelligence/semanticDataset';
import {assessExecution,publicationBlocks} from '../src/math-robo/intelligence/candidateAssessment';
await tf.setBackend('cpu');
const dir='artifacts/math-robo-v4.1',rows=validateSemanticRows(generateStarterDataset()),split=splitSemanticRows(rows);
await mkdir(dir,{recursive:true});
const baselineJson=JSON.parse(await readFile('public/models/math-robo-intelligence-v4/model.json','utf8')),binary=await readFile('public/models/math-robo-intelligence-v4/weights.bin');
const baseline=await tf.loadLayersModel(tf.io.fromMemory({modelTopology:baselineJson.modelTopology,weightSpecs:baselineJson.weightsManifest[0].weights,weightData:binary.buffer.slice(binary.byteOffset,binary.byteOffset+binary.byteLength),userDefinedMetadata:baselineJson.userDefinedMetadata}));
const baselineMetrics=await evaluateSemanticModel(baseline,split.test);
const configurations=[{hidden:128,encoder:64,balanced:true},{hidden:192,encoder:96,dropout:.1,balanced:true}];
const benchmarks=[];
for(const [index,options] of configurations.entries()){
 const result=await trainSemanticModel(rows,Number(process.env.ROBO_TRAIN_EPOCHS??12),128,message=>{if(/complete/.test(message))process.stdout.write(`${index+1}: ${message}\n`);},()=>false,options);
 for(let i=0;i<20;i++)inferSemanticHeads(result.model,'Draw a rectangle 4 by 6','geometry2d');
 const start=performance.now();for(let i=0;i<100;i++)inferSemanticHeads(result.model,'Draw a rectangle 4 by 6','geometry2d');
 benchmarks.push({configuration:options,report:result.report,warmInferenceMs:(performance.now()-start)/100});
 const candidate=`${dir}/candidate-${index+1}`;await mkdir(candidate,{recursive:true});
 await result.model.save(tf.io.withSaveHandler(async artifact=>{const data=artifact.weightData as ArrayBuffer;await writeFile(`${candidate}/weights.bin`,Buffer.from(data));await writeFile(`${candidate}/model.json`,JSON.stringify({format:'layers-model',generatedBy:`TensorFlow.js ${tf.version.tfjs}`,modelTopology:artifact.modelTopology,weightsManifest:[{paths:['weights.bin'],weights:artifact.weightSpecs}],userDefinedMetadata:artifact.userDefinedMetadata}));return {modelArtifactsInfo:{dateSaved:new Date(),modelTopologyType:'JSON',weightDataBytes:data.byteLength}};}));
 await writeFile(`${candidate}/labels.json`,JSON.stringify(HEAD_LABELS,null,2));await writeFile(`${candidate}/metadata.json`,JSON.stringify(result.report,null,2));result.model.optimizer.dispose();result.model.dispose();
}
const execution=await assessExecution(rows,text=>process.stdout.write(`${text}\n`));
await writeFile(`${dir}/model-comparison.json`,JSON.stringify({environment:`Node ${process.version}, TensorFlow.js CPU`,baselineMetrics,benchmarks,execution,publication:benchmarks.map(candidate=>({configuration:candidate.configuration,approved:false,blocks:publicationBlocks(candidate.report,execution,true)}))},null,2));
await writeFile(`${dir}/starter.jsonl`,rows.map(row=>JSON.stringify(row)).join('\n')+'\n');
await writeFile(`${dir}/adversarial-corpus.json`,JSON.stringify((await import('../src/math-robo/intelligence/adversarialCorpus')).adversarialCorpus,null,2));
baseline.dispose();process.stdout.write('Candidate files saved separately; baseline preserved.\n');

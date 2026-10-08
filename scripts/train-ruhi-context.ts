import * as tf from '@tensorflow/tfjs';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {buildContextDataset} from '../src/math-robo/intelligence/contextDataset';
import {trainContextModel,inferContext} from '../src/math-robo/intelligence/ruhiContextNet';
import {contextPages} from '../src/math-robo/intelligence/contextKnowledge';
import {inferSemanticHeads} from '../src/math-robo/intelligence/hierarchicalModel';
await tf.setBackend('cpu');await tf.ready();const dir='artifacts/ruhi-context';await mkdir(dir,{recursive:true});const rows=buildContextDataset(),test=rows.filter(r=>r.split==='test');
const baselineJson=JSON.parse(await readFile('public/models/math-robo-intelligence-v4/model.json','utf8')),binary=await readFile('public/models/math-robo-intelligence-v4/weights.bin');
const baseline=await tf.loadLayersModel(tf.io.fromMemory({modelTopology:baselineJson.modelTopology,weightSpecs:baselineJson.weightsManifest[0].weights,weightData:binary.buffer.slice(binary.byteOffset,binary.byteOffset+binary.byteLength),userDefinedMetadata:baselineJson.userDefinedMetadata}));
const started=performance.now();for(const r of test)inferSemanticHeads(baseline,r.question,'normal');const baselineMs=(performance.now()-started)/test.length;baseline.dispose();
const benchmarks=[];let best:tf.LayersModel|undefined,bestScore=-1;
for(const hidden of [0,64]){
 const start=performance.now(),model=await trainContextModel(rows,hidden,40,(epoch,loss)=>{if(epoch%4===0)console.log(hidden,epoch,loss.toFixed(4));});
 const results=test.map(row=>({question:row.question,pageId:row.pageId,expectedIntent:row.intent,expectedMeaning:row.meaning,prediction:inferContext(model,row)}));
 const metrics={intentAccuracy:results.filter(r=>r.prediction.intent===r.expectedIntent).length/test.length,contextAccuracy:results.filter(r=>r.prediction.meaning===r.expectedMeaning).length/test.length,jointAccuracy:results.filter(r=>r.prediction.intent===r.expectedIntent&&r.prediction.meaning===r.expectedMeaning).length/test.length,acceptedCoverage:results.filter(r=>r.prediction.accepted).length/test.length,meanInferenceMs:results.reduce((n,r)=>n+r.prediction.inferenceMs,0)/test.length};
 const calibration=rows.filter(r=>r.split==='calibration').map(r=>({r,p:inferContext(model,r)})),selectionScore=calibration.filter(({r,p})=>r.intent===p.intent&&r.meaning===p.meaning).length/calibration.length;
 benchmarks.push({hidden,parameters:model.countParams(),weightBytes:model.countParams()*4,trainingSeconds:(performance.now()-start)/1000,selectionScore,metrics,results});
 // Selection uses calibration, never untouched test accuracy.
 if(selectionScore>bestScore){best?.optimizer.dispose();best?.dispose();best=model;bestScore=selectionScore;}else{model.optimizer.dispose();model.dispose();}
}
const output='public/models/ruhi-context-v1';await mkdir(output,{recursive:true});await best!.save(tf.io.withSaveHandler(async artifact=>{const data=artifact.weightData as ArrayBuffer;await writeFile(`${output}/weights.bin`,Buffer.from(data));await writeFile(`${output}/model.json`,JSON.stringify({format:'layers-model',generatedBy:`TensorFlow.js ${tf.version.tfjs}`,modelTopology:artifact.modelTopology,weightsManifest:[{paths:['weights.bin'],weights:artifact.weightSpecs}],userDefinedMetadata:artifact.userDefinedMetadata}));return {modelArtifactsInfo:{dateSaved:new Date(),modelTopologyType:'JSON',weightDataBytes:data.byteLength}};}));
await writeFile(`${dir}/dataset.jsonl`,rows.map(r=>JSON.stringify(r)).join('\n'));await writeFile(`${dir}/model-evaluation.json`,JSON.stringify({baseline:{meanInferenceMs:baselineMs,pageFeaturesPresent:false,contextInterpretationAccuracy:null},discoveredPages:contextPages.length,rows:rows.length,train:rows.filter(r=>r.split==='train').length,calibration:rows.filter(r=>r.split==='calibration').length,test:test.length,selectedHidden:(best!.getUserDefinedMetadata() as {hidden:number}).hidden,benchmarks},null,2));best!.optimizer.dispose();best!.dispose();console.log('Context model saved separately; v4 unchanged.');

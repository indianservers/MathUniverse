import * as tf from '@tensorflow/tfjs';
import {readFile} from 'node:fs/promises';
import {inferContext} from '../src/math-robo/intelligence/ruhiContextNet';
import {meanings} from '../src/math-robo/intelligence/contextKnowledge';
await tf.setBackend('cpu');const json=JSON.parse(await readFile('public/models/ruhi-context-v1/model.json','utf8')),b=await readFile('public/models/ruhi-context-v1/weights.bin');
const model=await tf.loadLayersModel(tf.io.fromMemory({modelTopology:json.modelTopology,weightSpecs:json.weightsManifest[0].weights,weightData:b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength),userDefinedMetadata:json.userDefinedMetadata}));
for(const [question,id] of [['What are pigeon holes?','pigeonhole'],['What is a tree?','graph-tree'],['What is a tree?','data-tree'],['Explain this.','graph-tree'],['Give an example.','graph-tree'],['Why?','graph-tree'],['Show 10 objects in 3 boxes.','pigeonhole'],["I'm not asking about the mathematical tree. Tell me about real trees.",'graph-tree'],['What should I do?','graph-tree']]){
 const p=inferContext(model,{question,pageVocabulary:meanings.find(m=>m.id===id)!.vocabulary,hasPrevious:true,selectedTypes:[],simulation:id==='pigeonhole'?{n:5,k:4}:undefined});console.log(JSON.stringify({question,id,intent:p.intent,meaning:p.meaning,i:p.intentConfidence,m:p.meaningConfidence,accepted:p.accepted}));
}model.dispose();

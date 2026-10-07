import * as tf from '@tensorflow/tfjs';
import {mkdir,writeFile} from 'node:fs/promises';
import {RoboLearning} from '../src/offline-intelligence/roboLearning';

const destination=new URL('../public/models/math-robo-intents-v3/',import.meta.url);
const learner=new RoboLearning();
try {
  await learner.ready();
  await mkdir(destination,{recursive:true});
  await learner.exportModel(tf.io.withSaveHandler(async artifacts=>{
    const model={format:'layers-model',generatedBy:`TensorFlow.js ${tf.version.tfjs}`,convertedBy:null,
      modelTopology:artifacts.modelTopology,weightsManifest:[{paths:['weights.bin'],weights:artifacts.weightSpecs}]};
    const parts=Array.isArray(artifacts.weightData)?artifacts.weightData:[artifacts.weightData!];
    await writeFile(new URL('weights.bin',destination),Buffer.concat(parts.map(part=>Buffer.from(part))));
    await writeFile(new URL('model.json',destination),JSON.stringify(model));
    return {modelArtifactsInfo:tf.io.getModelArtifactsInfoForJSON(artifacts)};
  }));
  console.log('Saved trained Robo starter weights. Personal learning remains on-device.');
} finally {await learner.dispose();}

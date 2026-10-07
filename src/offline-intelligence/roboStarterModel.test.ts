import {readFile} from 'node:fs/promises';
import {expect,it} from 'vitest';
import * as tf from '@tensorflow/tfjs';
import {features} from './roboLearning';
import {FLAT_SHAPES} from './shapeCatalog';

it('loads the bundled trained weights and recognizes a natural circle request',async()=>{
  await tf.setBackend('cpu');
  const config=JSON.parse(await readFile(new URL('../../public/models/math-robo-intents-v3/model.json',import.meta.url),'utf8'));
  const bytes=await readFile(new URL('../../public/models/math-robo-intents-v3/weights.bin',import.meta.url));
  const model=await tf.loadLayersModel(tf.io.fromMemory({modelTopology:config.modelTopology,
    weightSpecs:config.weightsManifest[0].weights,weightData:bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength)}));
  try {
    const probabilities=tf.tidy(()=>Array.from((model.predict(tf.tensor2d([features('Sketch a round shape')])) as tf.Tensor).dataSync()));
    expect(probabilities).toHaveLength(45);
    expect(probabilities.indexOf(Math.max(...probabilities))).toBe(FLAT_SHAPES.indexOf('circle'));
    expect(Math.max(...probabilities)).toBeGreaterThan(0.9);
  } finally {model.dispose();}
});

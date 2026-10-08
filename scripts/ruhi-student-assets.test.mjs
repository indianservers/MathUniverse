import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {removeStudentTrainingAssets} from './ruhi-student-assets.mjs';

test('student output removes public training assets while retaining local inference weights', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ruhi-student-'));
  try {
    for (const name of ['datasets/private.jsonl', 'models/math-robo-intelligence-v4/starter.jsonl',
      'models/math-robo-intelligence-v4/training-manifest.json',
      'models/math-robo-intelligence-v4/action-registry.json',
      'models/math-robo-intelligence-v4/metadata.json',
      'models/math-robo-intelligence-v4/v3-migration.json',
      'models/math-robo-intelligence-v4/model.json', 'models/math-robo-intelligence-v4/weights.bin',
      'models/ruhi-context-v1/model.json', 'models/ruhi-context-v1/weights.bin']) {
      fs.mkdirSync(path.dirname(path.join(root, name)), {recursive: true});
      fs.writeFileSync(path.join(root, name), name.endsWith('model.json')?JSON.stringify({modelTopology:{name:'runtime'},weightsManifest:[{paths:['weights.bin']}],userDefinedMetadata:{labels:['circle'],report:{private:'training metrics'}}}):'fixture');
    }
    assert.equal(removeStudentTrainingAssets(root).length, 8);
    assert.equal(fs.existsSync(path.join(root, 'datasets')), false);
    for (const model of ['math-robo-intelligence-v4', 'ruhi-context-v1'])
      for (const file of ['model.json', 'weights.bin']) {
        const content=fs.readFileSync(path.join(root, 'models', model, file), 'utf8');
        if(file==='weights.bin')assert.equal(content,'fixture');
        else {const spec=JSON.parse(content);assert.deepEqual(spec.userDefinedMetadata,{labels:['circle']});assert.deepEqual(spec.modelTopology,{name:'runtime'});assert.deepEqual(spec.weightsManifest,[{paths:['weights.bin']}]);}
      }
    assert.deepEqual(removeStudentTrainingAssets(root), []);
  } finally { fs.rmSync(root, {recursive: true}); }
});

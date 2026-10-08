import fs from 'node:fs';
import path from 'node:path';

// Runtime models remain public. Training fixtures and diagnostics belong only
// in the private developer distribution, regardless of route visibility.
export function removeStudentTrainingAssets(outputDirectory) {
  const root = path.resolve(outputDirectory);
  const removed = [];
  for (const relative of ['datasets', 'models/math-robo-intelligence-v4/starter.jsonl',
    'models/math-robo-intelligence-v4/training-manifest.json',
    'models/math-robo-intelligence-v4/action-registry.json',
    'models/math-robo-intelligence-v4/metadata.json',
    'models/math-robo-intelligence-v4/v3-migration.json']) {
    const target = path.resolve(root, relative);
    if (!target.startsWith(root + path.sep)) throw new Error('Invalid student asset path');
    if (fs.existsSync(target)) { fs.rmSync(target, {recursive: true}); removed.push(relative); }
  }
  const models=path.join(root,'models');
  if(fs.existsSync(models))for(const entry of fs.readdirSync(models,{withFileTypes:true})){
    if(!entry.isDirectory())continue;
    const file=path.join(models,entry.name,'model.json');
    if(!fs.existsSync(file))continue;
    const model=JSON.parse(fs.readFileSync(file,'utf8'));
    if(model.userDefinedMetadata?.report){
      delete model.userDefinedMetadata.report;
      fs.writeFileSync(file,JSON.stringify(model));
      removed.push(`models/${entry.name}/model.json#userDefinedMetadata.report`);
    }
  }
  return removed;
}

import fs from 'node:fs';
import crypto from 'node:crypto';
const directory='reports/ruhi-v5.3';
const hash=path=>crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex');
export function auditPartitions(records) {
 const groups=new Map(),families=new Map(),texts=new Map(),classes={};
 for(const row of records){
  const text=row.userUtterance.toLowerCase().replace(/\s+/g,' ').trim();
  const family=text.replace(/[-+]?\d+(?:\.\d+)?/g,'#').replace(/\b(?:please|kindly|can you|could you)\b/g,'').replace(/\s+/g,' ').trim();
  for(const [map,key] of [[groups,row.scenarioId],[families,family],[texts,text]]){const set=map.get(key)??new Set();set.add(row.split);map.set(key,set);}
  const label=row.expected?.actions?.[0]?.op??'unlabeled';classes[label]=(classes[label]??0)+1;
 }
 const crossings=map=>[...map].filter(([,splits])=>splits.size>1).map(([key,splits])=>({key,splits:[...splits]}));
 return {records:records.length,classCounts:classes,scenarioCrossings:crossings(groups),templateCrossings:crossings(families),identicalTextCrossings:crossings(texts)};
}
if(process.argv[1]?.endsWith('ruhi-v53-evaluation.mjs')) {
 const paths=['datasets/ruhi-2d-nlp/v1.normalized.json',
 'C:/Users/saisa/.codex/attachments/f2e0e61d-3bfa-48ef-a043-92f8942b15b2/Pasted text.txt',
 'public/datasets/math-robo-conversations.json'];
 const manifestPath=`${directory}/fixture-manifest.json`;
 const files=paths.map(path=>({path,sha256:hash(path)}));
 if(process.argv[2]==='freeze'){
  if(fs.existsSync(manifestPath))throw new Error('Frozen manifest already exists; do not overwrite');
  fs.writeFileSync(manifestPath,JSON.stringify({frozenAt:new Date().toISOString(),files,partitions:{A:'Original 100 and historical regressions',B:'Historical train split, exposed',C:'Historical validation split, exposed',D:'Not established: historical test split has been inspected during earlier repairs',E:'Kernel adversarial and resource-budget tests',F:'Whole historical scenarios and focused conversations'},oracleCorrections:'None in v5.3; historical source fixtures and expected values retained'},null,2));
 } else {
  const manifest=JSON.parse(fs.readFileSync(manifestPath));
  for(const file of manifest.files)if(hash(file.path)!==file.sha256)throw new Error(`Frozen fixture changed: ${file.path}`);
 }
 const records=JSON.parse(fs.readFileSync(paths[0])).records;
 fs.writeFileSync(`${directory}/partition-audit.json`,JSON.stringify(auditPartitions(records),null,2));
 console.log('Fixture hashes verified; partition audit saved. Historical test is exposed, not an untouched holdout.');
}

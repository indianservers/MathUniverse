import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const directory='reports/ruhi-v6-phase1';
fs.mkdirSync(directory,{recursive:true});
const temporary=`scripts/.ruhi-v6-phase1-evidence-${process.pid}.mjs`;
try{
 const source=fs.readFileSync('scripts/ruhi-v53-evidence.mjs','utf8').replace("const root='reports/ruhi-v5.3'",`const root='${directory}'`);
 fs.writeFileSync(temporary,source);
 const result=spawnSync(process.execPath,[temporary,...process.argv.slice(2)],{stdio:'inherit'});
 process.exitCode=result.status??1;
}finally{fs.rmSync(temporary,{force:true});}

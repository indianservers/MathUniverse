import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const temporary=`scripts/.phase2-evidence-${process.pid}.mjs`;
try{fs.writeFileSync(temporary,fs.readFileSync('scripts/ruhi-v53-evidence.mjs','utf8').replace("const root='reports/ruhi-v5.3'","const root='reports/ruhi-v6-phase2'"));const result=spawnSync(process.execPath,[temporary,...process.argv.slice(2)],{stdio:'inherit'});process.exitCode=result.status??1;}finally{fs.rmSync(temporary,{force:true});}

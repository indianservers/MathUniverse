import fs from 'node:fs';
import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
const directory='reports/ruhi-v6-phase2';fs.mkdirSync(directory,{recursive:true});
for(const [name,file,from]of [['context','scripts/ruhi-v53-neural-context.ts',"const dir='reports/ruhi-v5.3'"],['primary','scripts/evaluate-ruhi-2d-held-model.ts',"const dir='reports/ruhi-2d-nlp'"]]){const temporary='scripts/.phase2-baseline-'+name+'-'+process.pid+'.ts',compiled='tmp/phase2-baseline-'+name+'-'+process.pid+'.mjs';try{fs.writeFileSync(temporary,fs.readFileSync(file,'utf8').replace(from,"const dir='"+directory+"'"));await build({entryPoints:[temporary],bundle:true,platform:'node',format:'esm',packages:'external',outfile:compiled,define:{'import.meta.env':'{"DEV":false,"BASE_URL":"/","VITE_ENABLE_MODEL_TRAINING":"false"}'}});const result=spawnSync(process.execPath,[compiled],{stdio:'inherit'});if(result.status)process.exitCode=result.status;}finally{fs.rmSync(temporary,{force:true});}}

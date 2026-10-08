import {spawnSync} from 'node:child_process';
import {removeStudentTrainingAssets} from './ruhi-student-assets.mjs';
const mode=process.argv[2]??'student';
if(!['student','developer'].includes(mode))throw new Error('Choose student or developer build.');
const args=['--max-old-space-size=8192','./node_modules/vite/bin/vite.js','build','--config','vite.config.ts'];
if(mode==='developer')args.push('--outDir','dist-developer');
const result=spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,VITE_ENABLE_MODEL_TRAINING:mode==='developer'?'true':'false'}});
if(result.status===0&&mode==='student')console.log('Excluded student training assets:',removeStudentTrainingAssets('dist'));
process.exit(result.status??1);

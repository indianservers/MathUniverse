import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
await build({entryPoints:['scripts/ruhi-v6-phase2-neural.ts'],bundle:true,platform:'node',format:'esm',packages:'external',outfile:'tmp/ruhi-v6-phase2-neural.mjs',define:{'import.meta.env':'{"DEV":true,"BASE_URL":"/","VITE_ENABLE_MODEL_TRAINING":"true"}'}});
const result=spawnSync(process.execPath,['tmp/ruhi-v6-phase2-neural.mjs',...process.argv.slice(2)],{stdio:'inherit'});process.exitCode=result.status??1;

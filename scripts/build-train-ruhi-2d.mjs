import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
await build({entryPoints:['scripts/train-ruhi-2d-nlp.ts'],bundle:true,platform:'node',format:'esm',packages:'external',outfile:'tmp/train-ruhi-2d.mjs',define:{'import.meta.env':'{"DEV":false,"BASE_URL":"/","VITE_ENABLE_MODEL_TRAINING":"false"}'}});
const result=spawnSync(process.execPath,['tmp/train-ruhi-2d.mjs'],{stdio:'inherit'});process.exitCode=result.status??1;

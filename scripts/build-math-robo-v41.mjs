import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
await build({entryPoints:['scripts/train-math-robo-v41.ts'],bundle:true,platform:'node',format:'esm',packages:'external',outfile:'tmp/train-math-robo-v41.mjs',define:{'import.meta.env':'{"DEV":false,"BASE_URL":"/","VITE_ENABLE_MODEL_TRAINING":"false"}'}});
const result=spawnSync(process.execPath,['tmp/train-math-robo-v41.mjs'],{stdio:'inherit'});process.exitCode=result.status??1;

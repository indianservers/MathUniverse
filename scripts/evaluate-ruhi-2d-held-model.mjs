import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
await build({entryPoints:['scripts/evaluate-ruhi-2d-held-model.ts'],bundle:true,platform:'node',format:'esm',packages:'external',outfile:'tmp/evaluate-ruhi-2d-held-model.mjs',define:{'import.meta.env':'{"DEV":false,"BASE_URL":"/","VITE_ENABLE_MODEL_TRAINING":"false"}'}});
const result=spawnSync(process.execPath,['tmp/evaluate-ruhi-2d-held-model.mjs'],{stdio:'inherit'});process.exitCode=result.status??1;

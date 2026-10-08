import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
mkdirSync('tmp',{recursive:true});
const entry=process.argv[2]??'scripts/train-ruhi-context.ts';
await build({entryPoints:[entry],bundle:true,platform:'node',format:'esm',packages:'external',outfile:'tmp/ruhi-context-task.mjs',define:{'import.meta.env':'{"DEV":false,"BASE_URL":"/","VITE_ENABLE_MODEL_TRAINING":"true"}'}});
const result=spawnSync(process.execPath,['tmp/ruhi-context-task.mjs'],{stdio:'inherit'});process.exitCode=result.status??1;

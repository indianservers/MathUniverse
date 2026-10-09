import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
await build({entryPoints:['scripts/train-ruhi-everyday.ts'],bundle:true,platform:'node',format:'esm',packages:'external',plugins:[{name:'node-nerdamer-extensions',setup(b){b.onResolve({filter:/^nerdamer\/(Algebra|Calculus|Solve)$/},args=>({path:args.path+'.js',external:true}));}}],outfile:'tmp/train-ruhi-everyday.mjs',define:{'import.meta.env':JSON.stringify({DEV:false,BASE_URL:'/',VITE_ENABLE_MODEL_TRAINING:'true'})}});
const result=spawnSync(process.execPath,['tmp/train-ruhi-everyday.mjs'],{stdio:'inherit'});process.exitCode=result.status??1;

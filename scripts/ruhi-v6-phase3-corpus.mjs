import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
await build({entryPoints:['scripts/ruhi-v6-phase3-corpus.ts'],bundle:true,platform:'node',format:'esm',packages:'external',outfile:'tmp/ruhi-v6-phase3-corpus.mjs',define:{'import.meta.env':'{"DEV":false,"BASE_URL":"/","VITE_ENABLE_MODEL_TRAINING":"false"}'}});
const entry='tmp/ruhi-v6-phase3-corpus.mjs';fs.writeFileSync(entry,fs.readFileSync(entry,'utf8').replace(/"nerdamer\/(Algebra|Calculus|Solve)"/g,'"nerdamer/$1.js"'));
const result=spawnSync(process.execPath,[entry,...process.argv.slice(2)],{stdio:'inherit'});process.exitCode=result.status??1;

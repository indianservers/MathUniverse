import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
import {unlink} from 'node:fs/promises';
await build({entryPoints:['scripts/train-robo-model.ts'],bundle:true,platform:'node',format:'esm',packages:'external',
  outfile:'scripts/.train-robo-model.generated.mjs',define:{'import.meta.env.BASE_URL':'"/"'}});
try {
  const result=spawnSync(process.execPath,['scripts/.train-robo-model.generated.mjs'],{stdio:'inherit'});
  process.exitCode=result.status??1;
} finally {await unlink('scripts/.train-robo-model.generated.mjs');}

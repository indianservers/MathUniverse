import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import crypto from 'node:crypto';
const root='reports/ruhi-v6-phase3';
fs.mkdirSync(root,{recursive:true});
const jobs={
 context:['scripts/ruhi-v53-neural-context.ts',s=>s,true],
 frozen:['scripts/ruhi-100-conversation.mjs',s=>s.replaceAll('artifacts/math-robo-v4.1',root).replace('const page=await browser.newPage({reducedMotion:', 'const page=await browser.newPage({reducedMotion:').replace("await page.goto('http://127.0.0.1:9867/workspace/graph');", "page.setDefaultTimeout(90000);await page.goto('http://127.0.0.1:9867/workspace/graph');")],
 'frozen-entry':['scripts/ruhi-100-conversation.mjs',s=>s.replaceAll('artifacts/math-robo-v4.1',root).replace(/async function ask\(prompt\)\{[^\n]+\}/,"async function ask(prompt){return page.evaluate(async({prompt,engineUrl})=>{const {runSemanticAssistant}=await import(engineUrl);const r=await runSemanticAssistant(prompt,'graph2d','/workspace/graph');return r.message;},{prompt,engineUrl});}")],
 nlp:['scripts/ruhi-2d-nlp-run.mjs',s=>s.replace('{directory,sourcePath,sha}','{sourcePath,sha}').replace("const phase=process.argv[2]",`const directory='${root}';\nconst phase=process.argv[2]`)],
 neural:['scripts/evaluate-ruhi-2d-held-model.ts',s=>s.replace("const dir='reports/ruhi-2d-nlp'",`const dir='${root}'`),true],
 persistence:['scripts/ruhi-2d-nlp-persistence.mjs',s=>s.replaceAll('reports/ruhi-2d-nlp',root)],
 conversations:['scripts/ruhi-2d-nlp-conversations.mjs',s=>s.replaceAll('reports/ruhi-2d-nlp',root)],
 performance:['scripts/ruhi-v52-performance.mjs',s=>s.replaceAll('artifacts/ruhi-v52',root)],
 workspaces:['scripts/ruhi-v52-browser.mjs',s=>s.replaceAll('artifacts/ruhi-v52',root)],
};
const job=process.argv[2];
if(!jobs[job])throw new Error('Choose '+Object.keys(jobs).join(', '));
const [source,transform,bundle]=jobs[job];
const temporary=`scripts/.ruhi-v53-${job}-${process.pid}.${bundle?'ts':'mjs'}`;
let adapted=transform(fs.readFileSync(source,'utf8'));
if(!bundle){adapted="import {freezeDevHotReload} from './ruhi-v53-browser-support.mjs';\n"+adapted;adapted=adapted.replaceAll("await page.goto('http://127.0.0.1:9867", "page.setDefaultNavigationTimeout(90000);page.setDefaultTimeout(90000);await freezeDevHotReload(page);await page.goto('http://127.0.0.1:9867");}
if(job==='frozen-entry')adapted=adapted.replaceAll('Real browser submission','Normal assistant entry point in a real browser');
fs.writeFileSync(temporary,adapted);
fs.writeFileSync(`${root}/${job}-provenance.json`,JSON.stringify({source,sha256:crypto.createHash('sha256').update(fs.readFileSync(source)).digest('hex'),adaptation:job==='frozen-entry'?'Output directory; UI form submission replaced by the same runSemanticAssistant entry point, native state assertions and expectations unchanged':job==='frozen'?'Output directory and 90-second automation timeout; expectations unchanged':'Output directory only; expectations unchanged',hotReload:bundle?'not applicable':'Vite connection retained; refresh messages suppressed; 90-second automation limits; remote hosts blocked'},null,2));
try {
 let entry=temporary;
 if(bundle){const {build}=await import('esbuild');entry=`tmp/ruhi-v53-${job}.mjs`;await build({entryPoints:[temporary],bundle:true,platform:'node',format:'esm',packages:'external',outfile:entry,define:{'import.meta.env':'{"DEV":false,"BASE_URL":"/","VITE_ENABLE_MODEL_TRAINING":"false"}'}});}
 const result=spawnSync(process.execPath,[entry,'v53'],{stdio:'inherit'});process.exitCode=result.status??1;
} finally {fs.unlinkSync(temporary);}

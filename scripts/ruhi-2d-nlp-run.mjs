import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {directory,sourcePath,sha} from './ruhi-2d-nlp-dataset.mjs';
import {evaluateRecord} from './ruhi-2d-nlp-oracle.mjs';
import {fingerprint} from './ruhi-2d-nlp-fingerprint.mjs';
const phase=process.argv[2]??'baseline',subset=process.argv[3]??'all';
if(!['all','train','validation','test'].includes(subset)||!/^[a-z0-9-]+$/.test(phase))throw new Error('Usage: node scripts/ruhi-2d-nlp-run.mjs PHASE all|train|validation|test');
if(/^cycle-/.test(phase)&&(!/^cycle-\d\d$/.test(phase)||Number(phase.slice(-2))>20||Number(phase.slice(-2))<1))throw new Error('Repair cycles are bounded to 01–20.');
const dataset=JSON.parse(fs.readFileSync(process.argv[4]??'datasets/ruhi-2d-nlp/v1.normalized.json','utf8'));
if(sha(dataset.sourcePath??sourcePath)!==dataset.sourceSha256)throw new Error('Source dataset changed. Revalidate explicitly.');
const sourceFingerprint=fingerprint();
const records=dataset.records.filter(r=>subset==='all'||r.split===subset);
if(!records.length)throw new Error('Evaluation scope is empty.');
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}),page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));await page.route('**/*',r=>/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::|\/)/.test(r.request().url())?r.continue():r.abort());
await page.goto('http://127.0.0.1:9867/workspace/graph');
const source=await(await page.request.get('http://127.0.0.1:9867/src/offline-intelligence/OfflineMathAssistant.tsx')).text(),engineUrl=source.match(/from "([^"]+liveAssistant\.ts[^"]*)"/)[1];
const module=await(await page.request.get('http://127.0.0.1:9867'+engineUrl)).text(),bridgeUrl=module.match(/from "([^"]+workspaceBridge\.ts[^"]*)"/)[1];
await page.getByRole('button',{name:'Ask Math · Offline'}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor({timeout:90000});
async function ask(text){return page.evaluate(async({text,engineUrl})=>{const {runSemanticAssistant}=await import(engineUrl);return runSemanticAssistant(text,'graph2d','/workspace/graph');},{text,engineUrl});}
async function state(){return page.evaluate(async({engineUrl,bridgeUrl})=>{const {liveEngine}=await import(engineUrl),{readRoboScene}=await import(bridgeUrl),{describeObject}=await import('/src/math-robo/intelligence/sceneContext.ts');const e=liveEngine('graph2d'),native=readRoboScene('graph2d');return {...e.snapshot(),objects:native.objects.map(o=>describeObject(o.command,'graph2d',o.vertices)),pending:e.conversation.pending,memory:e.workingMemory()};},{engineUrl,bridgeUrl});}
async function seed(record){const context=record.initialScene??{},commands=[];
 const triangle=name=>[`Draw triangle (0,0), (6,0), (2,5)`,`Label it as ${name}`];
 if(context.objects){for(const o of context.objects){if(typeof o==='string'){commands.push(o==='line-L1'?'Draw line (-4,-4) to (4,4)':'Draw line (-4,4) to (4,-4)');continue;}if(o.type==='triangle'){const offset=o.region==='upper'?6:o.region==='lower'?-6:0;const v=o.vertices?Object.values(o.vertices):[[0,offset],[6,offset],[2,5+offset]];commands.push(`Draw triangle ${v.map(p=>'('+p.join(',')+')').join(', ')}`,`Label it as ${o.id}`);}else throw new Error(`Unsupported fixture object ${o.type}`);}}
 else if(context.segments){for(const name of context.segments)commands.push('Draw segment (0,0) to (6,4)',`Label it as ${name}`);}
 else if(context.active_object||context.referenced_object||context.selection){const kind=context.object_type??record.userUtterance.match(/\b(triangle|circle|rectangle|polygon|line)\b/)?.[1]??'triangle';if(['triangle','angle'].includes(kind))commands.push(...triangle(context.active_object??context.referenced_object??context.selection));else if(kind==='circle')commands.push('Draw circle centered (0,0) radius 4');else if(kind==='line')commands.push('Draw line (0,0) to (6,2)');else if(kind==='rectangle')commands.push('Draw rectangle 4 by 6');else if(kind==='vertex')commands.push('Draw point (2,3)');else commands.push('Draw blue pentagon centered (0,0) radius 3');}
 for(const text of commands){const r=await ask(text);if(r.status!=='success')throw new Error(`Fixture failed: ${text}: ${r.message}`);}
 if(context.selection)await ask('Select it');
}
const results=[],groups=[...new Set(records.map(r=>r.scenarioId))];
for(const scenarioId of groups){const group=records.filter(r=>r.scenarioId===scenarioId).sort((a,b)=>a.turnIndex-b.turnIndex);let setupError;const history=[];
 try{await ask('Delete all objects');await ask('Clear context');await seed(group[0]);}catch(e){setupError=String(e);}
 for(const record of group){let row={id:record.id,scenarioId,split:record.split,command:record.userUtterance,expected:record.expected};
  if(!record.valid||record.ambiguous||setupError)row={...row,status:'blocked',reason:setupError??JSON.stringify(record.issues),rootCause:'DATASET_EXPECTATION_ERROR'};
  else try{const before=await state(),start=performance.now(),actual=await ask(record.userUtterance),after=await state(),evaluation=evaluateRecord(record,before,after,actual,history);row={...row,status:evaluation.passed?'passed':'failed',...evaluation,actual,before,after,latencyMs:performance.now()-start,recommendation:'Inspect development diagnostics; repair parser/dialogue/solver according to the failing dimension. Never use expected sentence lookups.'};}catch(e){row={...row,status:'failed',reason:String(e),rootCause:'WORKSPACE_EXECUTION_ERROR'};}
  if(row.before)history.push(row);results.push(row);console.log(phase,row.id,row.status);fs.writeFileSync(`${directory}/${phase}-progress.json`,JSON.stringify({done:results.length,total:records.length,last:row.id},null,2));
 }
}
const scored=results.filter(r=>r.status!=='blocked'),metrics={};for(const dimension of ['intent','entities','numeric','context','clarification','geometry','execution','response']){const eligible=scored.filter(r=>r.dimensions?.[dimension]!==null&&r.dimensions?.[dimension]!==undefined),passed=eligible.filter(r=>r.dimensions[dimension]).length;metrics[dimension]={passed,total:eligible.length,accuracy:eligible.length?passed/eligible.length:null};}
const passed=results.filter(r=>r.status==='passed').length,failed=results.filter(r=>r.status==='failed').length,blocked=results.filter(r=>r.status==='blocked').length;
if(sourceFingerprint!==fingerprint())throw new Error('Application or model changed during evaluation; discard this run.');
const report={phase,subset,sourceFingerprint,fingerprintVerified:true,date:new Date().toISOString(),sourceSha256:dataset.sourceSha256,total:records.length,valid:records.filter(r=>r.valid).length,passed,failed,blocked,endToEndAccuracy:passed/records.length,scenarios:{passed:groups.filter(id=>results.filter(r=>r.scenarioId===id).every(r=>r.status==='passed')).length,total:groups.length},metrics,errors,execution:'Real graph2d browser workspace via normal runSemanticAssistant entry point, native readRoboScene and committed geometry; fixture initialization only uses natural-language requests.',limits:['Metrics use eligible explicit assertions, not all 300 as each dimension denominator. Blocked records count against full-suite success.','Baseline all-300 is a regression observation; only development failures guide repairs. Repeated templates cross the scenario split.','Response relevance checks are bounded templates, not a free-form semantic judge. Geometry comparisons use relative/absolute 1e-7 coordinate tolerance.'],results};
fs.writeFileSync(`${directory}/${phase}.json`,JSON.stringify(report,null,2));fs.writeFileSync(`${directory}/${phase}.md`,`# Ruhi 2D NLP ${phase}\n\n${passed}/${records.length} passed; ${failed} failed; ${blocked} blocked. End-to-end record accuracy: ${(passed/records.length*100).toFixed(2)}%. Scenario success: ${report.scenarios.passed}/${groups.length}.\n\n| Dimension | Passed / eligible | Accuracy |\n|---|---:|---:|\n${Object.entries(metrics).map(([k,v])=>`| ${k} | ${v.passed}/${v.total} | ${v.accuracy===null?'N/A':(v.accuracy*100).toFixed(2)+'%'} |`).join('\n')}\n\n${report.limits.join('\n\n')}\n\n## Failures\n\n${results.filter(r=>r.status!=='passed').map(r=>`- ${r.id} (${r.scenarioId}): ${r.command}\n  ${r.rootCause}: ${r.reason??r.checks.filter(c=>!c.passed).map(c=>c.name).join('; ')}`).join('\n')}\n`);
await page.screenshot({path:`${directory}/${phase}-graph.png`});await browser.close();console.log('SUMMARY',passed,failed,blocked);

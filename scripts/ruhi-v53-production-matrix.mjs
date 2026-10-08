/* global document */
import fs from 'node:fs';
import {chromium} from '@playwright/test';
const dir='reports/ruhi-v5.3',browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={distribution:'student production output',cases:[],errors:[],remoteRequests:[],models:[],coldLoads:[],visibleLatencies:[],environment:{browser:browser.version(),gpu:'ANGLE SwiftShader software rendering; no physical GPU benchmark',cpuThrottle:1,concurrentWork:'Other local development processes present; observed latency includes machine load'}};
for(const [mode,path] of [['graph2d','/workspace/graph'],['geometry2d','/workspace/geometry'],['graph3d','/math-lab/3d-graphing'],['geometry3d','/workspace/3d']]){
 const page=await browser.newPage({reducedMotion:'reduce'});page.setDefaultTimeout(60000);
 page.on('pageerror',e=>report.errors.push({mode,error:String(e)}));
 await page.route('**/*',r=>{const url=r.request().url();if(/^https?:\/\/127\.0\.0\.1:9987\//.test(url))return r.continue();report.remoteRequests.push(url);return r.abort();});
 page.on('response',r=>{if(r.url().includes('/models/')&&r.url().endsWith('.bin'))report.models.push({mode,url:r.url(),status:r.status()});});
 try{
  const start=performance.now();await page.goto('http://127.0.0.1:9987'+path);
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor();report.coldLoads.push({mode,ms:performance.now()-start});
  async function ask(text,expected){const start=performance.now();await page.getByLabel('What would you like to create or solve?').fill(text);await page.getByRole('button',{name:'Run request',exact:true}).evaluate(b=>b.click());await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='Run request'&&!b.disabled));const answer=await page.locator('.robo-answer > p[role="status"]').innerText();const ms=performance.now()-start;report.visibleLatencies.push({mode,text,ms});report.cases.push({mode,text,answer,passed:expected.test(answer)});return answer;}
  await ask('Exact 1/3 + 1/6',/^1\/2$/);
  await ask(mode.endsWith('2d')?'Draw a circle radius 5':'Draw a sphere radius 5',/Created/i);
  await ask('Move it 3 units right',/move/i);
  await ask('Make it twice as large',/Scaled|scale|10/i);
  await ask('What is its radius?',/10/);
  await ask('Undo',/Undid|Undo/i);
  await ask('What is its radius now?',/5/);
  await ask('Redo',/Redid|Redo/i);
  report.cases.push({mode,text:'Native renderer mounted',passed:mode.endsWith('2d')?await page.locator('svg').count()>0:await page.locator('canvas').count()>0});
  report.environment.hardwareConcurrency=await page.evaluate(()=>navigator.hardwareConcurrency);
  report.environment.heap=await page.evaluate(()=>performance.memory?{used:performance.memory.usedJSHeapSize,total:performance.memory.totalJSHeapSize}:null);
  await page.screenshot({path:`${dir}/student-${mode}.png`});
 }catch(error){report.cases.push({mode,passed:false,error:String(error)});}finally{await page.close();}
}
const excluded=['datasets/math-robo-15-samples.jsonl','models/math-robo-intelligence-v4/starter.jsonl','models/math-robo-intelligence-v4/training-manifest.json','models/math-robo-intelligence-v4/metadata.json'];
for(const path of excluded){const response=await browser.newPage();try{const r=await response.request.get('http://127.0.0.1:9987/'+path);const type=r.headers()['content-type']??'';report.cases.push({text:`Excluded public asset: ${path}`,passed:!r.ok()||type.includes('text/html'),status:r.status(),contentType:type});}finally{await response.close();}}
report.passed=report.cases.filter(c=>c.passed).length;report.total=report.cases.length;
fs.writeFileSync(`${dir}/production-matrix.json`,JSON.stringify(report,null,2));await browser.close();if(report.passed!==report.total||report.errors.length)process.exitCode=1;

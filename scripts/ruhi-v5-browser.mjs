/* global document */
import {chromium} from '@playwright/test';
import fs from 'node:fs';
const dir='artifacts/ruhi-v5';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={date:new Date().toISOString(),configuration:'Chromium software WebGL; desktop CPU throttled 4× after model warm-up',cases:[],pageErrors:[],performance:[]};
for(const [mode,path] of [['graph2d','/workspace/graph'],['geometry2d','/workspace/geometry'],['graph3d','/math-lab/3d-graphing'],['geometry3d','/workspace/3d']]){
 const page=await browser.newPage({reducedMotion:'reduce',viewport:{width:1280,height:900}});page.on('pageerror',e=>report.pageErrors.push({mode,error:String(e)}));
 try{
  await page.goto('http://127.0.0.1:9867'+path);
  const served=await(await page.request.get('http://127.0.0.1:9867/src/offline-intelligence/OfflineMathAssistant.tsx')).text(),engineUrl=served.match(/from "([^"]+liveAssistant\.ts[^"]*)"/)[1];
  const live=await(await page.request.get('http://127.0.0.1:9867'+engineUrl)).text(),bridgeUrl=live.match(/from "([^"]+workspaceBridge\.ts[^"]*)"/)[1];
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor({timeout:90000});
  const state=()=>page.evaluate(async({mode,engineUrl,bridgeUrl})=>{const {liveEngine}=await import(engineUrl),{readRoboScene}=await import(bridgeUrl);return {memory:liveEngine(mode).workingMemory(),committed:readRoboScene(mode),semantic:liveEngine(mode).snapshot()};},{mode,engineUrl,bridgeUrl});
  const ask=async(prompt,check)=>{const start=performance.now();await page.getByLabel('What would you like to create or solve?').fill(prompt);await page.getByRole('button',{name:'Run request',exact:true}).evaluate(b=>b.click());await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='Run request'&&!b.disabled));const current=await state(),answer=await page.locator('.robo-answer').innerText(),status=current.memory.turns.at(-1)?.status;const row={mode,prompt,status,answer,latencyMs:performance.now()-start,passed:check?check(current,status):status==='success',snapshot:current.committed};report.cases.push(row);console.log(mode,prompt,row.passed?'PASS':'FAIL',answer);return current;};
  await ask('Delete all objects');await ask('Clear context');
  const d=mode.endsWith('3d')?3:2,a=d===3?'(1,1,1)':'(1,1)',b=d===3?'(4,5,1)':'(4,5)';
  await ask(`Draw vector from ${a} to ${b}`,(s,status)=>status==='success'&&s.semantic.objects[0]?.type==='vector'&&s.semantic.objects[0].vertices.length===2);
  await ask('Find its magnitude',(s,status)=>status==='success'&&Math.abs(s.semantic.previousResult-5)<1e-7);
  await ask('Move it 2 units right');await ask('Find its magnitude',(s,status)=>status==='success'&&Math.abs(s.semantic.previousResult-5)<1e-7);
  await ask('Rotate it 90 degrees');await ask('Find its components',(s,status)=>status==='success'&&Math.abs(s.semantic.previousResult[0]+4)<1e-7&&Math.abs(s.semantic.previousResult[1]-3)<1e-7);
  await ask('Scale it by 2');await ask('Find its magnitude',(s,status)=>status==='success'&&Math.abs(s.semantic.previousResult-10)<1e-7);
  await ask('Undo');await ask('Redo');await ask(`Set its endpoints to ${a} and ${b}`);
  await ask('Delete it',(s,status)=>status==='success'&&s.semantic.objects.length===0);await ask('Undo',(s,status)=>status==='success'&&s.semantic.objects[0]?.type==='vector');
  const origin=d===3?'(2,2,0)':'(2,2)',through=d===3?'(5,6,1)':'(5,6)';
  await ask(`Draw ray origin ${origin} through ${through}`,(s,status)=>status==='success'&&s.semantic.objects.at(-1)?.type==='ray');
  await ask('Find its direction',(s,status)=>status==='success'&&s.semantic.previousResult[0]===3&&s.semantic.previousResult[1]===4);
  await ask('Find its parameterization',(s,status)=>status==='success'&&s.semantic.previousResult.includes('t ≥ 0'));
  await page.screenshot({path:`${dir}/${mode}-directed.png`});
  if(d===2){const rendered=await page.locator(mode==='graph2d'?'[data-directed-id]':'[data-directed-kind="ray"]').count();report.cases.push({mode,prompt:'native arrow rendering',passed:rendered>0,rendered});}
  const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  const timings=[];for(let i=0;i<20;i++){const start=performance.now();await ask('Find its direction');timings.push(performance.now()-start);}
  const sorted=[...timings].sort((a,b)=>a-b),memory=await page.evaluate(()=>performance.memory?{usedJSHeapSize:performance.memory.usedJSHeapSize,totalJSHeapSize:performance.memory.totalJSHeapSize}:null);
  report.performance.push({mode,warmRequests:20,meanMs:timings.reduce((a,b)=>a+b,0)/timings.length,p95Ms:sorted[18],memory,limitation:'Synthetic CPU throttle and software GPU; not a physical low-spec-device benchmark.'});
  const saved=(await state()).committed.objects.map(o=>o.command);await ask('Delete all objects');
  await page.context().setOffline(true);
  const restored=await page.evaluate(async({bridgeUrl,mode,saved})=>{const {applyVisualCommand,readRoboScene}=await import(bridgeUrl);const errors=[];for(const command of JSON.parse(JSON.stringify(saved))){const error=await applyVisualCommand(mode,{...command,action:'create',roboControl:undefined});if(error)errors.push(error);}return {errors,scene:readRoboScene(mode)};},{bridgeUrl,mode,saved});
  report.cases.push({mode,prompt:'offline serialized command restore through native bridge',passed:restored.errors.length===0&&restored.scene.objects.length===saved.length&&restored.scene.objects.some(o=>o.command.kind==='ray'&&o.command.points.length===2)&&restored.scene.objects.some(o=>o.command.kind==='vector'&&o.command.points.length===2),snapshot:restored.scene,errors:restored.errors});
 }catch(error){report.cases.push({mode,prompt:'browser setup or execution',passed:false,error:String(error)});}finally{await page.close();fs.writeFileSync(`${dir}/browser-results.json`,JSON.stringify(report,null,2));}
}
await browser.close();report.total=report.cases.length;report.passed=report.cases.filter(c=>c.passed).length;fs.writeFileSync(`${dir}/browser-results.json`,JSON.stringify(report,null,2));console.log('SUMMARY',report.passed,report.total,'pageErrors',report.pageErrors.length);if(report.passed!==report.total||report.pageErrors.length)process.exitCode=1;

/* global document */
import {chromium} from '@playwright/test';
import fs from 'node:fs';
const dir='artifacts/ruhi-v51';
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const report={cases:[],errors:[],performance:[],network:'Remote hosts blocked; app and worker assets served only from localhost.'};
for(const [mode,path] of [['graph2d','/workspace/graph'],['geometry2d','/workspace/geometry'],['graph3d','/math-lab/3d-graphing'],['geometry3d','/workspace/3d']]){
 const page=await browser.newPage({reducedMotion:'reduce'});page.setDefaultTimeout(30000);page.on('pageerror',e=>report.errors.push({mode,error:String(e)}));
 await page.route('**/*',route=>/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::|\/)/.test(route.request().url())?route.continue():route.abort());
 try{
  await page.goto('http://127.0.0.1:9867'+path);
  const source=await(await page.request.get('http://127.0.0.1:9867/src/offline-intelligence/OfflineMathAssistant.tsx')).text(),engineUrl=source.match(/from "([^"]+liveAssistant\.ts[^"]*)"/)[1];
  const live=await(await page.request.get('http://127.0.0.1:9867'+engineUrl)).text(),bridgeUrl=live.match(/from "([^"]+workspaceBridge\.ts[^"]*)"/)[1];
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor({timeout:90000});
  async function ask(prompt,check){const started=performance.now();await page.getByLabel('What would you like to create or solve?').fill(prompt);await page.getByRole('button',{name:'Run request',exact:true}).evaluate(b=>b.click());await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(b=>b.textContent==='Run request'&&!b.disabled));
   const state=await page.evaluate(async({mode,engineUrl,bridgeUrl})=>{const {liveEngine}=await import(engineUrl),{readRoboScene}=await import(bridgeUrl);const engine=liveEngine(mode);return {scene:readRoboScene(mode),semantic:engine.snapshot(),last:engine.engineRouter.last,turn:engine.workingMemory().turns.at(-1)};},{mode,engineUrl,bridgeUrl});const answer=await page.locator('.robo-answer > p[role="status"]').innerText(),passed=check?check(state,answer):state.turn.status==='success';report.cases.push({mode,prompt,passed,answer,state,latencyMs:performance.now()-started});console.log(mode,passed?'PASS':'FAIL',prompt,answer);return state;
  }
  await ask('Delete all objects');await ask('Clear context');
  await ask('Exact 1/3 + 1/6',(s,a)=>a==='1/2'&&s.last.result.verificationStatus==='verified_exact');
  await ask('Exact sqrt(8)',(s,a)=>a==='2*sqrt(2)'&&s.last.result.verificationStatus==='verified_with_assumptions');
  await ask('Exact sin(pi/6)',(s,a)=>a==='1/2'&&s.last.result.verificationStatus==='verified_exact');
  await ask('Solve sqrt(x+5)=x-1',(s,a)=>a.includes('{4}')&&s.last.result.verification.passed);
  await ask('Show steps',(s,a)=>a.includes('rejected: -1'));
  await ask('Solve sin(x)=1/2 over the reals',(s,a)=>a.includes('2*pi*k')&&s.last.result.metadata.conditions.includes('k is an integer'));
  await ask('Decimal 1/3 to 12 places',(s,a)=>a==='0.333333333333');
  await ask('GCD 12345678901234567890 and 10',(s,a)=>a==='10');
  await ask('Numerically integrate x^2 from 0 to 3',(s,a)=>a.includes('9')&&s.last.result.verificationStatus==='verified_numerical');
  await ask('Run kernel.compute [{"operation":"geometry","args":["linePlane",[1,2,3],[0,0,1],[0,0,5],[0,0,1]]}]',(s,a)=>a==='[1,2,5]');
  await ask('Exact solve x^5=1',(s,a)=>s.turn.status==='unsupported'&&a.includes('Higher-degree'));
  if(mode.endsWith('2d')){
   await ask('Draw circle radius 5');const before=await ask('Draw a tangent to it',(s,a)=>s.turn.status==='ambiguous'&&s.scene.objects.length===1&&a.includes('point'));
   await ask('At point (3,4)',(s,a)=>a.includes('3x + 4y = 25')&&s.scene.objects.length===before.scene.objects.length+1);
   await ask('Delete all objects');await ask('Clear context');
   await ask('Create triangle A(0,0), B(6,0), C(2,4), draw its circumcircle and find its area',(s)=>s.turn.status==='success'&&s.scene.objects.length===2&&s.semantic.previousResult===12);
   await ask('Move the triangle 3 units right',(s)=>{const circle=s.scene.objects.find(o=>o.command.kind==='circle');return s.turn.status==='success'&&Math.abs(circle.command.points[0][0]-6)<1e-7;});
   await ask('Undo');await ask('Redo');
  }
  const cdp=await page.context().newCDPSession(page);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});const timings=[];for(let i=0;i<10;i++){const t=performance.now();await ask('Exact 1/3 + 1/6');timings.push(performance.now()-t);}const sorted=timings.sort((a,b)=>a-b);report.performance.push({mode,meanMs:timings.reduce((a,b)=>a+b,0)/timings.length,p95Ms:sorted.at(-1),configuration:'4x synthetic CPU throttle; software WebGL; UI/automation latency included'});
  await page.screenshot({path:`${dir}/${mode}-v51.png`});
 }catch(error){report.cases.push({mode,passed:false,error:String(error)});}finally{await page.close();fs.writeFileSync(`${dir}/browser-results.json`,JSON.stringify(report,null,2));}
}
await browser.close();report.passed=report.cases.filter(c=>c.passed).length;report.total=report.cases.length;fs.writeFileSync(`${dir}/browser-results.json`,JSON.stringify(report,null,2));console.log('SUMMARY',report.passed,report.total,report.errors.length);if(report.passed!==report.total||report.errors.length)process.exitCode=1;

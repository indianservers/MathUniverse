/* global caches, location, document */
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium} from '@playwright/test';
const root='reports/ruhi-v6-phase3', report={scope:'Student production build, full verified asset installation then fresh offline navigation/reload; headless desktop Chromium only.',checks:[],errors:[]};
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--config','vite.config.ts','--host','127.0.0.1','--port','9888','--strictPort'],{windowsHide:true,stdio:'pipe'});let browser,context;
try{
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Preview startup timeout')),30000);server.stdout.on('data',b=>{if(String(b).includes('9888')){clearTimeout(timer);resolve();}});server.on('exit',c=>reject(new Error('Preview exit '+c)));});
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});context=await browser.newContext();let page=await context.newPage();page.setDefaultTimeout(90000);await page.goto('http://127.0.0.1:9888/workspace/graph');
 page.on('console',m=>{if(m.type()==='warning'||m.type()==='error')report.errors.push({console:m.text()});});const started=Date.now();for(;;){const installed=await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();const keys=await caches.keys();return Boolean(r?.active&&navigator.serviceWorker.controller&&keys.some(k=>k.startsWith('ruhi-offline-v6-')));});if(installed)break;if(Date.now()-started>300000)throw new Error('Verified offline installation timed out');await new Promise(r=>setTimeout(r,1000));}
 report.installationMs=Date.now()-started;report.cache=await page.evaluate(async()=>{const keys=(await caches.keys()).filter(k=>k.startsWith('ruhi-offline-v6-'));if(!keys.length)throw new Error('No offline cache: '+JSON.stringify({all:await caches.keys(),worker:(await navigator.serviceWorker.getRegistration())?.active?.scriptURL}));const c=await caches.open(keys[0]);const requests=await c.keys();const response=await c.match(new URL('/ruhi-offline-assets.json',location.origin));if(!response)throw new Error('Missing completion manifest '+JSON.stringify({keys,entries:requests.map(r=>r.url).slice(-4)}));const manifest=await response.json();return {keys,entries:(await c.keys()).length,manifest};});
 report.checks.push({name:'Atomic versioned installation completes',passed:report.cache.keys.length===1&&report.cache.entries===report.cache.manifest.assets.length+1});
 await page.close();await context.setOffline(true);
 for(const path of ['/workspace/graph','/workspace/geometry','/math-lab/3d-graphing','/workspace/3d']){
  page=await context.newPage();page.setDefaultTimeout(90000);page.on('pageerror',e=>report.errors.push({path,message:String(e)}));
  try{
   await page.goto('http://127.0.0.1:9888'+path);await page.reload();await page.getByRole('button',{name:/^Ask Math/}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor();
   const ask=async text=>{const answer=page.locator('.robo-answer'),old=await answer.count()?await answer.getAttribute('data-response-id'):null;await page.locator('#offline-math-request').fill(text);await page.getByRole('button',{name:'Run request',exact:true}).click();await page.waitForFunction(old=>{const a=document.querySelector('.robo-answer');return a&&a.getAttribute('data-response-id')!==old;},old);return answer.innerText();};
   const drawn=await ask('Create rectangle width 4 height 6'),moved=await ask('Move it right by 2'),area=await ask('Find its area');report.checks.push({path,name:'Fresh offline route/reload and model-backed assistant',passed:/created|draw|rectangle/i.test(drawn)&&/move/i.test(moved)&&area.includes('24'),details:{drawn,moved,area}});
   report.checks.push({path,name:'Student UI excludes trainer',passed:await page.getByRole('link',{name:/Training Lab|Admin training/}).count()===0});
  }catch(error){report.errors.push({path,message:String(error)});}finally{await page.close();}
 }
}catch(error){report.errors.push({message:String(error)});}finally{await context?.close();await browser?.close();server.kill();report.passed=report.checks.filter(c=>c.passed).length;report.failed=report.checks.filter(c=>!c.passed).length;fs.writeFileSync(root+'/student-offline-repair.json',JSON.stringify(report,null,2));console.log('SUMMARY',report.passed,report.failed,report.errors.length);}if(report.failed||report.errors.length)process.exitCode=1;

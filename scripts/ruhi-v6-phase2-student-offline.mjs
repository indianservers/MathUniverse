/* global document */
import fs from 'node:fs';
import {spawn} from 'node:child_process';
import {chromium} from '@playwright/test';
const report={scope:'Built student UI, loaded workspace then disconnected network; not a cold-start/PWA caching claim',checks:[],errors:[]};
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--config','vite.config.ts','--host','127.0.0.1','--port','9887','--strictPort'],{windowsHide:true,stdio:'pipe'});
let browser;
try{
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(new Error('Owned preview startup timed out')),30000);server.stdout.on('data',b=>{if(String(b).includes('9887')){clearTimeout(timer);resolve();}});server.on('exit',code=>{clearTimeout(timer);reject(new Error(`Owned preview exited ${code}`));});});
 browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
 for(const path of ['/workspace/graph','/workspace/geometry','/math-lab/3d-graphing','/workspace/3d']){
  const context=await browser.newContext(),page=await context.newPage();page.setDefaultTimeout(90000);page.on('pageerror',e=>report.errors.push({path,message:String(e)}));
  try{
   await page.route('**/*',r=>/^http:\/\/127\.0\.0\.1:9887\//.test(r.request().url())?r.continue():r.abort());await page.goto(`http://127.0.0.1:9887${path}`);
   await page.getByRole('button',{name:'Ask Math · Offline'}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor();
   const ask=async text=>{const answer=page.locator('.robo-answer'),old=await answer.count()?await answer.getAttribute('data-response-id'):null;await page.locator('#offline-math-request').fill(text);await page.getByRole('button',{name:'Run request',exact:true}).click();await page.waitForFunction(old=>{const a=document.querySelector('.robo-answer');return a&&a.getAttribute('data-response-id')!==old;},old);return answer.innerText();};
   await ask('Draw rectangle width 4 height 6');await ask('Find its area');
   report.checks.push({path,name:'Student UI excludes training links',passed:await page.getByRole('link',{name:/Training Lab|Admin training/}).count()===0});
   await context.setOffline(true);
   const moved=await ask('Move it right by 2'),resized=await ask('Increase its width by 2'),area=await ask('Find its area'),hint=await ask('Give me a hint'),answer=await ask('My answer is 72/2');
   report.checks.push({path,name:'Loaded student workspace executes without network',passed:/moved|move/i.test(moved)&&/changed|width/i.test(resized)&&area.includes('36')&&/width|height|multiply/i.test(hint)&&/correct|matches/i.test(answer),details:{moved,resized,area,hint,answer}});
  }catch(error){report.errors.push({path,message:String(error)});}finally{await context.close();}
 }
}catch(error){report.errors.push({message:String(error)});}finally{await browser?.close();server.kill();report.passed=report.checks.filter(c=>c.passed).length;report.failed=report.checks.filter(c=>!c.passed).length;fs.writeFileSync('reports/ruhi-v6-phase2/student-offline.json',JSON.stringify(report,null,2));console.log('SUMMARY',report.passed,report.failed,report.errors.length);}
if(report.failed||report.errors.length)process.exitCode=1;

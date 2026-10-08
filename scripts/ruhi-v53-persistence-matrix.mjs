/* global localStorage */
import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {freezeDevHotReload} from './ruhi-v53-browser-support.mjs';
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}),results=[];
for(const [mode,path] of [['graph2d','/workspace/graph'],['geometry2d','/workspace/geometry'],['graph3d','/math-lab/3d-graphing'],['geometry3d','/workspace/3d']]){
 const page=await browser.newPage({reducedMotion:'reduce'});page.setDefaultTimeout(60000);const errors=[];page.on('pageerror',e=>errors.push(String(e)));await freezeDevHotReload(page);
 const checks=[];const check=(name,value)=>checks.push({name,passed:!!value});
 try{
  await page.goto('http://127.0.0.1:9867'+path);
  const source=await(await page.request.get('http://127.0.0.1:9867/src/offline-intelligence/OfflineMathAssistant.tsx')).text(),engineUrl=source.match(/from "([^"]+liveAssistant\.ts[^"]*)"/)[1];
  const live=await(await page.request.get('http://127.0.0.1:9867'+engineUrl)).text(),bridgeUrl=live.match(/from "([^"]+workspaceBridge\.ts[^"]*)"/)[1];
  async function open(){await page.getByRole('button',{name:'Ask Math · Offline'}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor({timeout:90000});}
  async function ask(text){return page.evaluate(async({text,mode,path,engineUrl})=>(await import(engineUrl)).runSemanticAssistant(text,mode,path),{text,mode,path,engineUrl});}
  async function state(){return page.evaluate(async({mode,bridgeUrl})=>(await import(bridgeUrl)).readRoboScene(mode).objects.map(o=>o.command),{mode,bridgeUrl});}
  const signature=commands=>JSON.stringify(commands.map(c=>({id:c.objectId,kind:c.kind,label:c.roboLabel,points:c.points,width:['circle','sphere'].includes(c.kind)?2*c.radius:c.width,height:['circle','sphere'].includes(c.kind)?2*c.radius:c.height,radius:c.radius,scale:c.scale??1,rotation:c.rotation??[0,0,0],color:c.color,fill:c.roboFillColor,dependency:c.roboDependency})).sort((a,b)=>a.id.localeCompare(b.id)));
  await open();await ask('Delete all objects');await ask('Clear context');
  check('create',(await ask(mode.endsWith('2d')?'Draw circle centered (2,3) radius 5':'Create sphere centered (2,3,1) radius 5')).status==='success');
  check('name',(await ask('Label it as SavedObject')).status==='success');
  check('move',(await ask('Move it 3 units right')).status==='success');
  check('style',(await ask('Make it blue')).status==='success');
  const before=await state();const start=performance.now();await page.locator('button[title^="Save"]').first().evaluate(b=>b.click());
  check('serialized native object exists',await page.evaluate(()=>Object.values(localStorage).some(v=>v.toLowerCase().includes('savedobject'))));
  await page.reload();
  if(mode==='geometry2d')await page.getByRole('button',{name:'Restore saved construction',exact:true}).evaluate(b=>b.click());
  else{await page.getByRole('button',{name:'Settings',exact:true}).evaluate(b=>b.click());if(mode==='geometry3d')await page.getByRole('button',{name:'Load saved scene'}).evaluate(b=>b.click());else await page.getByLabel(mode==='graph3d'?'Saved 3D graphs':'Saved 2D graphs').getByRole('button').first().evaluate(b=>b.click());}
  await open();const after=await state();check('IDs, name, coordinates, dimensions and color survive UI save/reload/restore',signature(before)===signature(after));
  const persistenceMs=performance.now()-start;
  check('query restored object',(await ask('What is its radius?')).value===5);
  check('modify restored object',(await ask('Move SavedObject 2 units left')).status==='success');
  const changed=await state();check('restored native center changed by exactly 2',changed.some(c=>c.roboLabel?.toLowerCase()==='savedobject'&&Math.abs(c.points[0][0]-3)<1e-7));
  results.push({mode,checks,errors,persistenceMs,before,after,changed});await page.screenshot({path:`reports/ruhi-v5.3/persistence-${mode}.png`});
 }catch(error){results.push({mode,checks,errors,error:String(error),buttons:await page.locator('button').allTextContents()});await page.screenshot({path:`reports/ruhi-v5.3/persistence-error-${mode}.png`});}finally{await page.close();fs.writeFileSync('reports/ruhi-v5.3/persistence-matrix.json',JSON.stringify(results,null,2));console.log(mode,checks.filter(c=>!c.passed));}
}
await browser.close();fs.writeFileSync('reports/ruhi-v5.3/persistence-matrix.json',JSON.stringify(results,null,2));if(results.some(r=>r.error||r.errors.length||r.checks.some(c=>!c.passed)))process.exitCode=1;

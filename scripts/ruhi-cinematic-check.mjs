import fs from 'node:fs';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({reducedMotion:'no-preference'});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
try{
await page.goto('http://127.0.0.1:9867/workspace/graph');
const source=await(await page.request.get('http://127.0.0.1:9867/src/offline-intelligence/OfflineMathAssistant.tsx')).text();
const engineUrl=source.match(/from "([^"]+liveAssistant\.ts[^"]*)"/)[1];
const engineSource=await(await page.request.get('http://127.0.0.1:9867'+engineUrl)).text();const bridgeUrl=engineSource.match(/from "([^"]+workspaceBridge\.ts[^"]*)"/)[1];
const bridgeSource=await(await page.request.get('http://127.0.0.1:9867'+bridgeUrl)).text();const motionUrl=bridgeSource.match(/from "([^"]+RuhiCinematicMotionEngine\.ts[^"]*)"/)[1];
await page.getByRole('button',{name:'Ask Math · Offline'}).click();
await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor({timeout:90000});
const result=await page.evaluate(async ({engineUrl,bridgeUrl,motionUrl})=>{
 const {runSemanticAssistant}=await import(engineUrl);
 const bridge=await import(bridgeUrl);
 const {ruhiMotion}=await import(motionUrl);
 const created=await runSemanticAssistant('Draw a circle of radius 5','graph2d','/workspace/graph');
 if(created.status!=='success')return {created,scene:bridge.readRoboScene('graph2d')};
 const start=bridge.readRoboScene('graph2d').objects.find(o=>o.command.kind==='circle').command;
 const frames=[],paths=[];const preview=await import('/src/math-robo/animation/motionPreview.ts');const off=ruhiMotion.subscribe(()=>{if(ruhiMotion.snapshot().status==='playing'){const c=bridge.readRoboScene('graph2d').objects.find(o=>o.command.objectId===start.objectId)?.command;if(c)frames.push(structuredClone(c.points));paths.push(document.querySelector('[data-cinematic-object] path')?.getAttribute('d')); }});
 const moved=await runSemanticAssistant('Move it 5 units right','graph2d','/workspace/graph');off();
 const end=bridge.readRoboScene('graph2d').objects.find(o=>o.command.objectId===start.objectId).command;
 const undo=await runSemanticAssistant('Undo','graph2d','/workspace/graph');
 const restored=bridge.readRoboScene('graph2d').objects.find(o=>o.command.objectId===start.objectId).command;
 return {created:created.status,moved:moved.status,undo:undo.status,start:start.points,end:end.points,restored:restored.points,frames,distinct:new Set(paths.filter(Boolean)).size,nativeDistinct:new Set(frames.map(f=>JSON.stringify(f))).size};
},{engineUrl,bridgeUrl,motionUrl});
await page.screenshot({path:'reports/ruhi-cinematic-browser.png'});
fs.writeFileSync('reports/ruhi-cinematic-browser.json',JSON.stringify({result,errors},null,2));console.log(JSON.stringify({ ...result,frames:result.frames.length,errors}));
if(result.distinct<3||result.moved!=='success'||JSON.stringify(result.start)!==JSON.stringify(result.restored)||errors.length)process.exitCode=1;
}finally{await browser.close();}

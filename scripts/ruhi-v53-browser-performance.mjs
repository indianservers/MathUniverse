import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {freezeDevHotReload} from './ruhi-v53-browser-support.mjs';
const browser=await chromium.launch({headless:true}),page=await browser.newPage();
await freezeDevHotReload(page);
try{
 await page.goto('http://127.0.0.1:9867/workspace/graph');
 const source=await(await page.request.get('http://127.0.0.1:9867/src/offline-intelligence/OfflineMathAssistant.tsx')).text(),engineUrl=source.match(/from "([^"]+liveAssistant\.ts[^"]*)"/)[1];
 const engineSource=await(await page.request.get('http://127.0.0.1:9867'+engineUrl)).text();
 const bridgeUrl=engineSource.match(/from "([^"]+workspaceBridge\.ts[^"]*)"/)[1],modelUrl=engineSource.match(/from "([^"]+hierarchicalModel\.ts[^"]*)"/)[1];
 const bridgeSource=await(await page.request.get('http://127.0.0.1:9867'+bridgeUrl)).text(),motionUrl=bridgeSource.match(/from "([^"]+RuhiCinematicMotionEngine\.ts[^"]*)"/)[1];
 await page.getByRole('button',{name:'Ask Math · Offline'}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor({timeout:90000});
 const result=await page.evaluate(async({engineUrl,bridgeUrl,modelUrl,motionUrl})=>{
  const live=await import(engineUrl),bridge=await import(bridgeUrl),neural=await import(modelUrl),{ruhiMotion}=await import(motionUrl);
  const {recomputeRoboDependencies}=await import('/src/math-robo/intelligence/workspaceDependencies.ts');
  ruhiMotion.configure({enabled:false});
  const engine=live.liveEngine('graph2d'),model=await neural.loadIntelligenceModel(),measure=(fn,count=30)=>{const times=[];for(let i=0;i<count;i++){const t=performance.now();fn();times.push(performance.now()-t);}return times;};
  await live.runSemanticAssistant('Delete all objects','graph2d','/workspace/graph');
  for(let i=0;i<12;i++){const r=await live.runSemanticAssistant(`Draw a circle centered (${i},${i%3}) radius 2`,'graph2d','/workspace/graph');if(r.status!=='success')throw new Error(r.message);}
  const warmInference=measure(()=>neural.inferSemanticHeads(model,'Move that circle 3 units right','graph2d'));
  const parser=measure(()=>engine.parse('Move that circle 3 units right'));
  const dependencies=measure(()=>recomputeRoboDependencies(structuredClone(engine.snapshot())));
  const commits=[],object=bridge.readRoboScene('graph2d').objects[0].command;
  for(let i=0;i<10;i++){const t=performance.now();await bridge.applyVisualCommand('graph2d',{...object,action:'update',points:[[i*.1,0]]});commits.push(performance.now()-t);}
  return {sceneObjects:engine.snapshot().objects.length,warmInference,parser,dependencies,commits,hardwareConcurrency:navigator.hardwareConcurrency,heap:performance.memory?{used:performance.memory.usedJSHeapSize,total:performance.memory.totalJSHeapSize}:null};
 },{engineUrl,bridgeUrl,modelUrl,motionUrl});
 fs.writeFileSync('reports/ruhi-v5.3/browser-component-performance.json',JSON.stringify({browser:browser.version(),environment:'Real browser development modules, no CPU throttle, 12 native circles; motion disabled for commit measurement; isolated test storage',...result},null,2));
}finally{await browser.close();}

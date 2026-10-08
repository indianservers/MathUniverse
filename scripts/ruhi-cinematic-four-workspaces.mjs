import fs from 'node:fs';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});const results=[];
try{for(const [path,mode,create,move] of [
 ['/workspace/graph','graph2d','Draw a circle of radius 5','Move it 5 units right'],
 ['/workspace/geometry','geometry2d','Draw a circle of radius 5','Move it 5 units right'],
 ['/workspace/3d','geometry3d','Create a sphere of radius 2','Move it 3 units right'],
 ['/math-lab/3d-graphing','graph3d','Plot z = x^2 + y^2','Move it 3 units right']
]){
 const page=await browser.newPage({reducedMotion:'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto('http://127.0.0.1:9867'+path);
 const source=await(await page.request.get('http://127.0.0.1:9867/src/offline-intelligence/OfflineMathAssistant.tsx')).text(),engineUrl=source.match(/from "([^"]+liveAssistant\.ts[^"]*)"/)[1];
 const engineSource=await(await page.request.get('http://127.0.0.1:9867'+engineUrl)).text(),bridgeUrl=engineSource.match(/from "([^"]+workspaceBridge\.ts[^"]*)"/)[1];
 const bridgeSource=await(await page.request.get('http://127.0.0.1:9867'+bridgeUrl)).text(),motionUrl=bridgeSource.match(/from "([^"]+RuhiCinematicMotionEngine\.ts[^"]*)"/)[1],previewUrl=bridgeSource.match(/from "([^"]+motionPreview\.ts[^"]*)"/)[1];
 await page.getByRole('button',{name:/Ask Math.*Offline/}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor({timeout:90000});
 const result=await page.evaluate(async({engineUrl,bridgeUrl,motionUrl,previewUrl,mode,create,move,path})=>{
  const {runSemanticAssistant}=await import(engineUrl),bridge=await import(bridgeUrl),{ruhiMotion}=await import(motionUrl),preview=await import(previewUrl);
  const created=await runSemanticAssistant(create,mode,path);if(created.status!=='success')return {created,previewRegistered:preview.hasMotionPreview(mode)};
  const id=created.effects.find(c=>!c.roboControl)?.objectId,start=bridge.readRoboScene(mode).objects.find(o=>o.command.objectId===id)?.command;
  const frames=[],native=[];const off=preview.subscribeMotionPreview(()=>{const f=preview.getMotionPreview(mode);if(f){frames.push(f.commands.find(c=>c.objectId===id)?.points);native.push(bridge.readRoboScene(mode).objects.find(o=>o.command.objectId===id)?.command.points);}});
  const moved=await runSemanticAssistant(move,mode,path);off();const end=bridge.readRoboScene(mode).objects.find(o=>o.command.objectId===id)?.command;
  const undo=await runSemanticAssistant('Undo',mode,path),restored=bridge.readRoboScene(mode).objects.find(o=>o.command.objectId===id)?.command;
  const redo=await runSemanticAssistant('Redo',mode,path),redone=bridge.readRoboScene(mode).objects.find(o=>o.command.objectId===id)?.command;
  let morph;
  if(mode==='geometry3d'){
   const kinds=[];const stop=preview.subscribeMotionPreview(()=>{const f=preview.getMotionPreview(mode);if(f?.sources?.[id])kinds.push(f.sources[id].kind);});
   const error=await bridge.applyVisualCommand(mode,{...redone,kind:'cube',width:4,height:4,depth:4,action:'update'});stop();
   morph={error:error??null,sourceFrames:kinds.length,sourceKind:kinds[0],finalKind:bridge.readRoboScene(mode).objects.find(o=>o.command.objectId===id)?.command.kind};
  }
  return {morph,created:created.status,moved:moved.status,undo:undo.status,redo:redo.status,previewRegistered:preview.hasMotionPreview(mode),frames:frames.length,distinct:new Set(frames.map(p=>JSON.stringify(p))).size,nativeDistinct:new Set(native.map(p=>JSON.stringify(p))).size,start:start?.points,end:end?.points,restored:restored?.points,redone:redone?.points};
 },{engineUrl,bridgeUrl,motionUrl,previewUrl,mode,create,move,path});
 await page.screenshot({path:`reports/ruhi-cinematic-${mode}.png`});results.push({mode,result,errors});console.log(JSON.stringify(results.at(-1)));await page.close();
}}
finally{await browser.close();fs.writeFileSync('reports/ruhi-cinematic-four-workspaces.json',JSON.stringify(results,null,2));}
if(results.length!==4||results.some(({result:r,errors})=>r.moved!=='success'||(r.morph&&(r.morph.error||r.morph.sourceKind!=='sphere'||r.morph.finalKind!=='cube'||r.morph.sourceFrames<3))||r.distinct<3||r.nativeDistinct!==1||JSON.stringify(r.start)!==JSON.stringify(r.restored)||JSON.stringify(r.end)!==JSON.stringify(r.redone)||errors.length))process.exitCode=1;

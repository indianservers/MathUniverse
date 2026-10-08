import fs from 'node:fs';import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({reducedMotion:'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(String(e)));
try{await page.goto('http://127.0.0.1:9867/workspace/geometry');
const source=await(await page.request.get('http://127.0.0.1:9867/src/offline-intelligence/OfflineMathAssistant.tsx')).text(),engineUrl=source.match(/from "([^"]+liveAssistant\.ts[^"]*)"/)[1],es=await(await page.request.get('http://127.0.0.1:9867'+engineUrl)).text(),bridgeUrl=es.match(/from "([^"]+workspaceBridge\.ts[^"]*)"/)[1],bs=await(await page.request.get('http://127.0.0.1:9867'+bridgeUrl)).text(),motionUrl=bs.match(/from "([^"]+RuhiCinematicMotionEngine\.ts[^"]*)"/)[1],previewUrl=bs.match(/from "([^"]+motionPreview\.ts[^"]*)"/)[1];
await page.getByRole('button',{name:/Ask Math.*Offline/}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor({timeout:90000});
const result=await page.evaluate(async({engineUrl,bridgeUrl,motionUrl,previewUrl})=>{
const {runSemanticAssistant}=await import(engineUrl),bridge=await import(bridgeUrl),{ruhiMotion}=await import(motionUrl),p=await import(previewUrl);const ask=text=>runSemanticAssistant(text,'geometry2d','/workspace/geometry');const turns=[];
for(const text of ['Draw a line from 0,0 to 6,8','What is the midpoint?','Create a point at the midpoint']){const r=await ask(text);turns.push({text,status:r.status});}
let frames=0,valid=true;const off=p.subscribeMotionPreview(()=>{const f=p.getMotionPreview('geometry2d');if(!f)return;const line=f.commands.find(c=>c.kind==='line'),midpoint=f.commands.find(c=>c.roboDependency?.kind==='midpoint');if(line&&midpoint){frames++;valid&&=line.points[0].slice(0,2).every((v,i)=>Math.abs((v+line.points[1][i])/2-midpoint.points[0][i])<1e-7);}});
const moved=await ask('Move the line 3 units right');off();turns.push({text:'Move the line 3 units right',status:moved.status});
const before=bridge.readRoboScene('geometry2d').objects.map(o=>o.command);await ruhiMotion.replay();const after=bridge.readRoboScene('geometry2d').objects.map(o=>o.command);
return {turns,dependencyFrames:frames,dependenciesValid:valid,replayPreservesExactState:JSON.stringify(before)===JSON.stringify(after),previewCleaned:p.getMotionPreview('geometry2d')===undefined};
},{engineUrl,bridgeUrl,motionUrl,previewUrl});fs.writeFileSync('reports/ruhi-cinematic-dependencies.json',JSON.stringify({result,errors},null,2));console.log(JSON.stringify({result,errors}));if(!result.dependencyFrames||!result.dependenciesValid||!result.replayPreservesExactState||errors.length)process.exitCode=1;
}finally{await browser.close();}


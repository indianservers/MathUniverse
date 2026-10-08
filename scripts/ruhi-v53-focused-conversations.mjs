import fs from 'node:fs';
import {chromium} from '@playwright/test';
import {freezeDevHotReload} from './ruhi-v53-browser-support.mjs';
const browser=await chromium.launch({headless:true}),page=await browser.newPage({reducedMotion:'reduce'});page.setDefaultTimeout(90000);await freezeDevHotReload(page);
const cases=[
 ['Draw a circle of radius 5.','Move it right by 3.','Make it twice as large.','What is its radius?','Undo the last change.','What is its radius now?'],
 ['Draw triangle ABC.','Construct its circumcircle.','Change side AB.','Does the circumcircle update?','Undo.','Explain what changed.'],
 ['Create two intersecting lines.','Find their intersection.','Draw a circle centered there.','Make its radius 4.','Color only the circle blue.','Undo only the color change.'],
 ['Draw a rectangle.','Make it 8 units wide.','Make its height half its width.','Rotate it by 30 degrees.','SAVE_RELOAD','What are its dimensions?'],
 ['Create a vector.','Find its magnitude.','Rotate it.','Find its new direction.','Explain why its magnitude remained unchanged.'],
];
const report={scope:'Exact five requested prompts; missing information is not supplied by the harness',results:[],errors:[]};page.on('pageerror',e=>report.errors.push(String(e)));
try{
 await page.goto('http://127.0.0.1:9867/workspace/graph');
 const source=await(await page.request.get('http://127.0.0.1:9867/src/offline-intelligence/OfflineMathAssistant.tsx')).text(),engineUrl=source.match(/from "([^"]+liveAssistant\.ts[^"]*)"/)[1];
 const live=await(await page.request.get('http://127.0.0.1:9867'+engineUrl)).text(),bridgeUrl=live.match(/from "([^"]+workspaceBridge\.ts[^"]*)"/)[1];
 async function open(){await page.getByRole('button',{name:'Ask Math · Offline'}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor();}
 const ask=text=>page.evaluate(async({text,engineUrl})=>(await import(engineUrl)).runSemanticAssistant(text,'graph2d','/workspace/graph'),{text,engineUrl});
 const state=()=>page.evaluate(async({bridgeUrl})=>(await import(bridgeUrl)).readRoboScene('graph2d'),{bridgeUrl});
 await open();
 for(const [index,conversation] of cases.entries()){
  await ask('Delete all objects');await ask('Clear context');const turns=[],checks=[];
  for(const text of conversation){
   const before=await state();let actual;
   if(text==='SAVE_RELOAD'){
    await page.getByRole('button',{name:'Save',exact:true}).evaluate(b=>b.click());await page.reload();await page.getByRole('button',{name:'Settings',exact:true}).evaluate(b=>b.click());await page.getByLabel('Saved 2D graphs').getByRole('button').first().evaluate(b=>b.click());await open();actual={status:'success',message:'Real UI save/reload/restore'};
   }else actual=await ask(text);
   turns.push({text,before,actual,after:await state()});
  }
  const last=turns.at(-1).after.objects;
  if(index===0)checks.push({name:'Radius after scaling is 10 and undo query is 5',passed:turns[3].actual.value===10&&turns[5].actual.value===5&&last.some(o=>o.command.kind==='circle'&&o.command.points[0][0]===3)});
  if(index===3){const rectangle=turns[2].after.objects.find(o=>o.command.kind==='rectangle');checks.push({name:'Width is 8 and height is 4 after relative request',passed:turns[1].actual.status==='success'&&turns[2].actual.status==='success'&&rectangle?.command.width===8&&rectangle?.command.height===4});checks.push({name:'Restored dimensions response matches rotated rectangle',passed:turns.at(-1).actual.status==='success'&&/width 8, height 4/.test(turns.at(-1).actual.message)});}
  const blocked=turns.some(t=>t.actual.status==='ambiguous'),unsupported=turns.some(t=>['unsupported','unhandled','invalid'].includes(t.actual.status));
  report.results.push({conversation:index+1,status:checks.some(c=>!c.passed)?'failed':blocked?'blocked':unsupported?'unsupported':'passed',checks,turns});
 }
}catch(error){report.error=String(error);process.exitCode=1;}finally{fs.writeFileSync('reports/ruhi-v5.3/focused-conversations.json',JSON.stringify(report,null,2));await browser.close();}

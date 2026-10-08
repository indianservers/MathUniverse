import fs from 'node:fs';
import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}),page=await browser.newPage({reducedMotion:'reduce'}),errors=[];
page.on('pageerror',e=>errors.push(String(e)));await page.route('**/*',r=>/^https?:\/\/(?:localhost|127\.0\.0\.1)(?::|\/)/.test(r.request().url())?r.continue():r.abort());
await page.goto('http://127.0.0.1:9867/workspace/graph');
const source=await(await page.request.get('http://127.0.0.1:9867/src/offline-intelligence/OfflineMathAssistant.tsx')).text(),engineUrl=source.match(/from "([^"]+liveAssistant\.ts[^"]*)"/)[1];
const module=await(await page.request.get('http://127.0.0.1:9867'+engineUrl)).text(),bridgeUrl=module.match(/from "([^"]+workspaceBridge\.ts[^"]*)"/)[1];
await page.getByRole('button',{name:'Ask Math · Offline'}).click();await page.locator('.robo-learning-status').filter({hasText:'TensorFlow.js ready'}).waitFor({timeout:90000});
async function ask(text){return page.evaluate(async({text,engineUrl})=>{const {runSemanticAssistant}=await import(engineUrl);return runSemanticAssistant(text,'graph2d','/workspace/graph');},{text,engineUrl});}
async function state(){return page.evaluate(async({engineUrl,bridgeUrl})=>{const {liveEngine}=await import(engineUrl),{readRoboScene}=await import(bridgeUrl),{describeObject}=await import('/src/math-robo/intelligence/sceneContext.ts');const e=liveEngine('graph2d'),native=readRoboScene('graph2d');return {...e.snapshot(),objects:native.objects.map(o=>describeObject(o.command,'graph2d',o.vertices)),pending:e.conversation.pending,memory:e.workingMemory()};},{engineUrl,bridgeUrl});}

const conversations=[
 ['Draw a triangle','Move it 3 units right','Find its centroid','Mark it as O','Draw a line from O perpendicular to the base'],
 ['Draw an angle of 50 degrees','Make it 84','Increase it two more degrees','Decrease it by 10 percent'],
 ['Draw two triangles','Make the other one green','The second triangle'],
 ['Draw a circle of radius 5 at the origin','Draw the line y = 3','Mark their intersection points','Connect both points to the origin'],
 ['Create a triangle','Make all its angles 90 degrees']
];
const results=[];
for(let i=0;i<conversations.length;i++){await ask('Delete all objects');await ask('Clear context');const turns=[];for(const text of conversations[i]){const before=await state(),actual=await ask(text),after=await state();turns.push({text,before,actual,after});}const checks=[];const check=(name,value)=>checks.push({name,passed:!!value});const objects=turns.at(-1).after.objects;
 if(i===0){const tri=objects.find(o=>o.type==='triangle'),point=objects.find(o=>o.type==='point'&&o.label==='O'),line=objects.find(o=>o.type==='line');check('all turns succeed',turns.every(t=>t.actual.status==='success'));check('centroid marker named O',tri&&point&&[0,1].every(j=>Math.abs(point.position[j]-tri.vertices.reduce((s,p)=>s+p[j],0)/3)<1e-7));if(tri&&line){const v=tri.vertices,edges=v.map((p,j)=>({a:p,b:v[(j+1)%3]})).sort((a,b)=>(a.a[1]+a.b[1])-(b.a[1]+b.b[1])),base=edges[0],d=line.vertices[1].map((x,j)=>x-line.vertices[0][j]);check('perpendicular to actual base',Math.abs(d[0]*(base.b[0]-base.a[0])+d[1]*(base.b[1]-base.a[1]))<1e-7);}check('perpendicular passes through O',point&&line&&Math.abs((point.position[0]-line.vertices[0][0])*(line.vertices[1][1]-line.vertices[0][1])-(point.position[1]-line.vertices[0][1])*(line.vertices[1][0]-line.vertices[0][0]))<1e-7);}
 if(i===1)check('actual angle 77.4',Math.abs(objects[0]?.command.roboAngle?.degrees-77.4)<1e-7);
 if(i===2){check('two triangles',turns[0].after.objects.length===2);check('clarifies other triangle',turns[1].actual.status==='ambiguous'&&!!turns[1].after.pending);check('resumes second triangle green',turns[2].actual.status==='success'&&objects[1]?.command.color==='#22c55e');}
 if(i===3){const points=turns[2].after.objects.filter(o=>o.type==='point');check('two exact circle-line intersections',points.length===2&&[-4,4].every(x=>points.some(p=>Math.abs(p.position[0]-x)<1e-7&&Math.abs(p.position[1]-3)<1e-7)));const segments=objects.filter(o=>o.command.linearExtent==='segment');check('both origin connections',segments.length===2&&points.every(p=>segments.some(l=>l.vertices.some(q=>Math.hypot(q[0],q[1])<1e-7)&&l.vertices.some(q=>Math.hypot(q[0]-p.position[0],q[1]-p.position[1])<1e-7))));}
 if(i===4){check('impossible constraint refused atomically',turns[1].actual.status==='invalid'&&JSON.stringify(turns[1].before.objects)===JSON.stringify(turns[1].after.objects));}
 results.push({conversation:i+1,turns,checks,passed:checks.every(c=>c.passed)});console.log(i+1,checks);
}
fs.writeFileSync('reports/ruhi-2d-nlp/five-conversations.json',JSON.stringify({date:new Date().toISOString(),results,errors},null,2));await browser.close();

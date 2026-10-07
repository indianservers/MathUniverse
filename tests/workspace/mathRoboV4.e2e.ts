import {test,expect,type Page} from '@playwright/test';
async function ask(page:Page,phrase:string,expected?:string){
  await page.getByLabel('What would you like to create or solve?').fill(phrase);
  await page.getByRole('button',{name:'Run request',exact:true}).click();
  await expect(page.getByRole('button',{name:'Run request',exact:true})).toBeEnabled({timeout:30000});
  if(expected)await expect(page.locator('.robo-answer')).toContainText(expected);
}
async function snapshot(page:Page,_mode:string){return {objects:Array(Number(await page.locator('.offline-assistant').getAttribute('data-robo-scene-count')))};}
async function open(page:Page,path:string){await page.goto(path);await page.getByRole('button',{name:'Ask Math · Offline'}).click();await expect(page.locator('.robo-learning-status')).toContainText('TensorFlow.js ready',{timeout:60000});}
test('v4 live geometry acceptance, read-only queries, constructions, references and history',async({page})=>{
  test.setTimeout(180000);await open(page,'/workspace/geometry');
  for(const phrase of ['Draw a rectangle 4 by 6','Make it blue','Move it 3 units right and 2 up','Rotate it 45 degrees'])await ask(page,phrase);
  await ask(page,'What is its area?','24');
  await ask(page,'Duplicate it','Duplicated');await ask(page,'Make the copy red','red');await ask(page,'Delete the original','Deleted');await ask(page,'Undo that','Undid');
  await ask(page,'Draw a line from 0,0 to 6,8','Created');const before=await snapshot(page,'geometry2d');
  await ask(page,'What is the midpoint?','[3,4]');expect((await snapshot(page,'geometry2d')).objects.length).toBe(before.objects.length);
  await ask(page,'Mark the midpoint','Marked');expect((await snapshot(page,'geometry2d')).objects.length).toBe(before.objects.length+1);
  await ask(page,'Draw a perpendicular through that point','Perpendicular');await ask(page,'Create a circle centered there with radius 5','Created');
  const beforeIntersection=await snapshot(page,'geometry2d');await ask(page,'Where does the line intersect the circle?','Intersections');expect((await snapshot(page,'geometry2d')).objects.length).toBe(beforeIntersection.objects.length);
  await ask(page,'Mark those intersection points','Marked');expect((await snapshot(page,'geometry2d')).objects.length).toBe(beforeIntersection.objects.length+2);
  await ask(page,'Are these two lines perpendicular?','Yes');await ask(page,'Create a circle radius 2','Created');await ask(page,'Which circle is larger?','larger');
  await ask(page,'Select the largest circle','Selected');await ask(page,'Change its radius to 8','Changed');await ask(page,'Reflect it across the y-axis','reflect');await ask(page,'Undo that','Undid');
  await page.getByText('Developer inspector',{exact:true}).click();await page.screenshot({path:'artifacts/math-robo-v4/live-geometry2d.png'});
});
test('distance between existing points makes zero new objects in live geometry',async({page})=>{
  test.setTimeout(120000);await open(page,'/workspace/geometry');await ask(page,'Draw point A (1,1)','Created');await ask(page,'Draw point B (4,5)','Created');
  const before=await snapshot(page,'geometry2d');await ask(page,'What is the distance between A and B?','5 units');expect((await snapshot(page,'geometry2d')).objects.length).toBe(before.objects.length);
});
test('v4 live graph2d evaluates roots and intersections without extra plots',async({page})=>{
  test.setTimeout(120000);await open(page,'/workspace/graph');await ask(page,'Plot y=x^2','Created');const before=await snapshot(page,'graph2d');await ask(page,'Find its roots','[[0,0]]');expect((await snapshot(page,'graph2d')).objects.length).toBe(before.objects.length);
  await ask(page,'Plot y=2x+3','Created');await ask(page,'Find where these graphs intersect','[-1,1]');
});
for(const [path,mode] of [['/workspace/3d','geometry3d'],['/math-lab/3d-graphing','graph3d']])test(`v4 sphere creation, movement, volume and deletion in ${mode}`,async({page})=>{
  test.setTimeout(120000);await open(page,path);await ask(page,'Create a sphere radius 3','Created');await ask(page,'Move it up 5 units','move');const before=await snapshot(page,mode);await ask(page,'Find its volume','113.097');expect((await snapshot(page,mode)).objects.length).toBe(before.objects.length);await ask(page,'Hide it','Hidden');await ask(page,'Show it','Showing');await ask(page,'Delete it','Deleted');await ask(page,'Undo that','Undid');await page.screenshot({path:`artifacts/math-robo-v4/live-${mode}.png`});
});
test('v4 Training Lab runs its worker, evaluates and exports genuine assets',async({page})=>{
  test.setTimeout(180000);await page.goto('/model-training');await expect(page.getByRole('heading',{name:'Ruhi Intelligence v4',exact:true})).toBeVisible();
  await page.getByRole('button',{name:'Load bundled starter dataset'}).click();await page.getByRole('tab',{name:'Train',exact:true}).click();await page.getByLabel('v4 epochs',{exact:true}).fill('1');await page.getByRole('button',{name:'Train v4 model',exact:true}).click();
  await expect(page.getByRole('tabpanel',{name:'Evaluate',exact:true})).toBeVisible({timeout:120000});await expect(page.getByRole('status').first()).toContainText('Training complete');
  await page.getByRole('tab',{name:'Model Info',exact:true}).click();const files:string[]=[];page.on('download',download=>files.push(download.suggestedFilename()));await page.getByRole('button',{name:'Download v4 weights, labels and metadata'}).click();await expect.poll(()=>files).toContain('math-robo-intelligence-v4.json');await expect.poll(()=>files).toContain('math-robo-intelligence-v4.weights.bin');
  await page.reload();await page.getByRole('tab',{name:'Model Info',exact:true}).click();await expect(page.getByRole('tabpanel',{name:'Model Info',exact:true})).toContainText('768');await page.screenshot({path:'artifacts/math-robo-v4/training-lab.png'});
});
test('v4 commands and corrections execute locally after the browser goes offline',async({page,context})=>{
  test.setTimeout(120000);const network:string[]=[];page.on('request',request=>{if(/openai|anthropic|gemini|generativelanguage/i.test(request.url()))network.push(request.url());});
  await open(page,'/workspace/geometry');await expect(page.getByText('Model information · v4',{exact:true})).toBeVisible();
  await context.setOffline(true);await ask(page,'Draw a rectangle 4 by 6 and make it blue','blue');await ask(page,'Move it 3 right and 2 up','move');await ask(page,'What is its area?','24');
  await page.getByText('Teach Ruhi · 0 learned phrases',{exact:true}).click();await page.getByLabel('Your phrase',{exact:true}).fill('double this shape');await page.getByLabel('What it should mean',{exact:true}).fill('Scale it by 2');await page.getByRole('button',{name:'Learn correction',exact:true}).click();await expect(page.locator('.robo-learning-status')).toContainText('Correction saved');await ask(page,'double this shape','scale');await ask(page,'What is its area?','96');expect(network).toEqual([]);
});
test('v4 records real browser timings and handles a 100K-row worker run without blocking the UI',async({page})=>{
  test.setTimeout(180000);await open(page,'/workspace/geometry');
  const benchmark=await page.evaluate(async()=>{
    const modelPath='/src/math-robo/intelligence/hierarchicalModel.ts',parserPath='/src/math-robo/intelligence/semanticParser.ts',plannerPath='/src/math-robo/intelligence/executionPlanner.ts',scenePath='/src/math-robo/intelligence/sceneContext.ts',resolverPath='/src/math-robo/intelligence/targetResolver.ts';
    const [modelModule,parser,planner,sceneModule,resolver]=await Promise.all([import(modelPath),import(parserPath),import(plannerPath),import(scenePath),import(resolverPath)]);
    const start=performance.now(),model=await modelModule.loadIntelligenceModel(),loadMs=performance.now()-start,first=performance.now();modelModule.inferSemanticHeads(model,'Draw a rectangle 4 by 6','geometry2d');const firstInferenceMs=performance.now()-first;
    for(let i=0;i<20;i++)modelModule.inferSemanticHeads(model,'Draw a rectangle 4 by 6','geometry2d');const warm=performance.now();for(let i=0;i<100;i++)modelModule.inferSemanticHeads(model,'Draw a rectangle 4 by 6','geometry2d');const averageInferenceMs=(performance.now()-warm)/100;
    const parseStart=performance.now();for(let i=0;i<500;i++)parser.parseSemanticPlan('Draw a rectangle 4 by 6','geometry2d');const semanticParseMs=(performance.now()-parseStart)/500;
    const scene=sceneModule.emptyScene('geometry2d'),plan=parser.parseSemanticPlan('Draw a rectangle 4 by 6','geometry2d');const planStart=performance.now();for(let i=0;i<500;i++)planner.preparePlan(plan,scene);const planMs=(performance.now()-planStart)/500;
    const created=planner.preparePlan(plan,scene).scene,targetStart=performance.now();for(let i=0;i<500;i++)resolver.resolveTarget('lastReferenced',created);const targetResolutionMs=(performance.now()-targetStart)/500;
    return {environment:navigator.userAgent,cachedModelAcquireMs:loadMs,firstInferenceMs,averageInferenceMs,semanticParseMs,planMs,targetResolutionMs};
  });
  const fs=await import('node:fs/promises');await fs.mkdir('artifacts/math-robo-v4',{recursive:true});await fs.writeFile('artifacts/math-robo-v4/browser-benchmark.json',JSON.stringify(benchmark,null,2));expect(benchmark.averageInferenceMs).toBeLessThan(50);
  await page.goto('/model-training');
  const starters=['Draw a circle radius 3','Create a circle radius 3','Make a circle radius 3','Add a circle radius 3','Sketch a circle radius 3','Build a circle radius 3','I need a circle radius 3','Show me a circle radius 3'];
  const rows=Array.from({length:100000},(_,i)=>({phrase:starters[i%starters.length],action:'CREATE',subAction:'CIRCLE',mode:'geometry2d',parameters:{radius:3},group:`stress-template-${i%starters.length}`}));
  await page.getByLabel('Upload semantic dataset').setInputFiles({name:'stress-100k.jsonl',mimeType:'application/x-ndjson',buffer:Buffer.from(rows.map(row=>JSON.stringify(row)).join('\n'))});await expect(page.getByRole('status').first()).toContainText('100,000 semantic rows');
  await page.getByRole('tab',{name:'Train',exact:true}).click();await page.getByLabel('v4 epochs',{exact:true}).fill('1');await page.getByRole('button',{name:'Train v4 model',exact:true}).click();await expect(page.getByRole('button',{name:'Stop worker',exact:true})).toBeVisible();
  await page.getByRole('tab',{name:'Action Registry',exact:true}).click();await expect(page.getByRole('tabpanel',{name:'Action Registry',exact:true})).toBeVisible();
  await expect(page.getByRole('status').first()).toContainText('Training complete',{timeout:150000});
  await page.getByRole('tab',{name:'Model Info',exact:true}).click();await expect(page.getByRole('tabpanel',{name:'Model Info',exact:true})).toContainText('75000 training / 12500 validation / 12500 test rows');
  const stressReport=page.waitForEvent('download',{predicate:download=>download.suggestedFilename()==='metadata.json'});await page.getByRole('button',{name:'Download v4 weights, labels and metadata'}).click();await (await stressReport).saveAs('artifacts/math-robo-v4/stress-100k-report.json');
  await page.getByRole('tab',{name:'Train',exact:true}).click();await page.getByRole('button',{name:'Train v4 model',exact:true}).click();await page.getByRole('button',{name:'Stop worker',exact:true}).click();await expect(page.getByRole('status').first()).toContainText('Training stopped');
});

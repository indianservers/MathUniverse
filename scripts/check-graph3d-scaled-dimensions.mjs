import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  await page.goto('http://127.0.0.1:4317/math-lab/3d-graphing',{waitUntil:'domcontentloaded',timeout:120000});
  await page.locator('#surface-3d-panel canvas').first().waitFor({state:'visible',timeout:60000});
  const results=await page.evaluate(async()=>{
    const {ruhiMotion}=await import('/src/math-robo/animation/RuhiCinematicMotionEngine.ts');ruhiMotion.enabled=false;
    const {runSemanticAssistant,liveEngine}=await import('/src/math-robo/intelligence/liveAssistant.ts');
    const {runAuditCase}=await import('/src/graph-studio/command-audit/browserAudit.ts');
    await runAuditCase(1);
    const run=command=>runSemanticAssistant(command,'graph3d');
    const boxCommands=['Scale it by 2','Make the cube twice as wide'],boxResults=[];
    for(const command of boxCommands)boxResults.push(await run(command));
    const box=liveEngine('graph3d').snapshot().objects[0];
    const cylinderCommands=['Clear all shapes','Create cylinder height 4 radius 3','Scale it by 2','Set the cylinder radius to 2'],cylinderResults=[];
    for(const command of cylinderCommands)cylinderResults.push(await run(command));
    const cylinder=liveEngine('graph3d').snapshot().objects[0];
    return {box:{commands:boxCommands,results:boxResults,actual:box.command},cylinder:{commands:cylinderCommands,results:cylinderResults,actual:cylinder.command}};
  });
  expect(results.box.results.every(r=>r.status==='success')).toBe(true);
  expect(results.box.actual).toMatchObject({kind:'cuboid',width:24,height:12,depth:12,scale:1});
  expect(results.cylinder.results.every(r=>r.status==='success')).toBe(true);
  expect(results.cylinder.actual).toMatchObject({kind:'cylinder',height:8,radius:2,scale:1});
  await writeFile('reports/graph3d-command-audit/composition-check.json',JSON.stringify({passed:true,results},null,2));
  console.log('Two held-out scaling compositions passed through runSemanticAssistant and the mounted graph.');
}finally{await browser.close();}

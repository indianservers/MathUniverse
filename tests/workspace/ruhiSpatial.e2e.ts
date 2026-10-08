import {test,expect,type Page} from '@playwright/test';
async function open(page:Page,path='/?roboLab'){await page.goto(path);await page.getByRole('button',{name:'Ask Math · Offline'}).click();}
async function ask(page:Page,text:string){if(await page.getByRole('button',{name:'Ask Math · Offline'}).count())await page.getByRole('button',{name:'Ask Math · Offline'}).click();const previous=await page.locator('.robo-answer').count()?await page.locator('.robo-answer').getAttribute('data-response-id'):null;await page.getByLabel('What would you like to create or solve?').fill(text);await page.getByRole('button',{name:'Run request',exact:true}).click();await expect(page.getByRole('button',{name:'Run request',exact:true})).toBeEnabled({timeout:20000});await expect(page.locator('.robo-answer')).not.toHaveAttribute('data-response-id',previous??'');return page.locator('.robo-answer p').first();}
async function anchorAt(page:Page,x:number,y:number){const actor=page.locator('.offline-assistant-toggle'),r=(await actor.boundingBox())!;await page.mouse.move(r.x+r.width/2,r.y+r.height/2);await page.mouse.down();await page.mouse.move(x,y-r.height*.41,{steps:12});await page.mouse.up();}
async function snapshot(page:Page){return JSON.parse(await page.getByRole('region',{name:'Developer animation lab'}).locator('pre').innerText()).awareness;}
test('walking and crawling move the saved position in every direction',async({page})=>{
 await open(page);const actor=page.locator('.offline-assistant-toggle'),start=(await actor.boundingBox())!;
 await ask(page,'Ruhi walk left 80 pixels');expect((await actor.boundingBox())!.x).toBeCloseTo(start.x-80,0);
 await ask(page,'Ruhi walk top 70 pixels');expect((await actor.boundingBox())!.y).toBeCloseTo(start.y-70,0);
 const before=(await actor.boundingBox())!;await ask(page,'crawl right 50 pixels');expect((await actor.boundingBox())!.x).toBeCloseTo(before.x+50,0);
 const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('math-robo-position')!));expect(stored.x).toBeCloseTo(before.x+50,0);
 await page.reload();expect((await actor.boundingBox())!.x).toBeCloseTo(stored.x,0);
});
for(const [tag,role,kind] of [['button','button','button'],['button','tab','tab'],['h2','heading','heading']] as const)test(`Ruhi knows when it stands on a real ${kind}`,async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await open(page);
 await page.evaluate(({tag,role})=>{const el=document.createElement(tag);el.setAttribute('role',role);el.setAttribute('aria-label','Spatial target');el.textContent='Spatial target';el.style.cssText='position:fixed;left:200px;top:260px;width:120px;height:40px;z-index:70;background:white;color:black;';document.body.appendChild(el);},{tag,role});
 const answer=await ask(page,`Ruhi walk to the Spatial target ${kind}`);await expect(answer).toContainText(`over the ${kind} “Spatial target”`);
 await expect(page.getByTestId('ruhi-location')).toContainText(`over the ${kind} “Spatial target”`);
 await expect.poll(async()=> (await snapshot(page))?.currentElement?.kind).toBe(kind);
});
test('a live circle contact and distances use actual geometry and camera transforms',async({page})=>{
 await open(page,'/workspace/geometry?roboLab');await ask(page,'draw a circle radius 2');const circle=page.locator('[data-object-type="circle"]').first();await expect(circle).toBeVisible();
 const client=async(outside:boolean)=>circle.evaluate((el:SVGCircleElement,outside)=>{const p=new DOMPoint(el.cx.baseVal.value+(outside?el.r.baseVal.value+40:0),el.cy.baseVal.value).matrixTransform(el.getScreenCTM()!);return {x:p.x,y:p.y};},outside);
 let target=await client(false);await anchorAt(page,target.x,target.y);await expect.poll(async()=> (await snapshot(page))?.onObject?.kind).toMatch(/circle|point/);
 target=await client(true);await anchorAt(page,target.x,target.y);await expect(await ask(page,'how far are you from the circle')).toContainText('approximately 1.00 graph units');
 const old=await snapshot(page);const board=page.getByTestId('workspace-geometry-board'),view=await board.getAttribute('viewBox');await board.dispatchEvent('wheel',{deltaY:-200,clientX:target.x,clientY:target.y});await expect(board).not.toHaveAttribute('viewBox',view!);
 target=await client(true);await anchorAt(page,target.x,target.y);await expect(await ask(page,'how far are you from the circle')).toContainText('approximately 1.00 graph units');await expect.poll(async()=> (await snapshot(page))?.nearbyObjects.find((o:{kind:string})=>o.kind==='circle')?.screenDistancePx).not.toBe(old.nearbyObjects.find((o:{kind:string})=>o.kind==='circle')?.screenDistancePx);
 await page.screenshot({path:'artifacts/math-robo-character/spatial-circle.png'});
});
test('stop interrupts actual travel and keeps the reached position',async({page})=>{
 await open(page);await page.getByText('Ruhi’s surroundings',{exact:true}).click();const actor=page.locator('.offline-assistant-toggle'),start=(await actor.boundingBox())!.x;
 await page.getByLabel('What would you like to create or solve?').fill('crawl left 700 pixels');await page.getByRole('button',{name:'Run request',exact:true}).click();await expect(page.locator('.articulated-robo')).toHaveAttribute('data-action','crawlLeft');
 await expect.poll(async()=> (await actor.boundingBox())!.x).toBeLessThan(start-30);await page.getByRole('button',{name:'Stop moving',exact:true}).click();await expect(page.locator('.robo-answer')).toContainText('cancelled');const reached=(await actor.boundingBox())!.x;await page.waitForTimeout(300);expect((await actor.boundingBox())!.x).toBeCloseTo(reached,0);
});
test('3D awareness reports rendered objects without inventing robot depth',async({page})=>{
 await open(page,'/workspace/3d?roboLab');const canvas=page.locator('canvas').first();await expect(canvas).toBeVisible();const r=(await canvas.boundingBox())!;await anchorAt(page,r.x+r.width/2,r.y+r.height/2);
 await expect.poll(async()=> (await snapshot(page))?.nearbyObjects?.length??0).toBeGreaterThan(0);const state=await snapshot(page);expect(state.graphPosition).toBeUndefined();expect(state.nearbyObjects.every((o:{graphDistance?:number})=>o.graphDistance===undefined)).toBe(true);
 await expect(await ask(page,'what is near you')).toContainText('screen pixels');
});

test('function graph awareness uses the rendered curves and graph coordinates',async({page})=>{
 test.setTimeout(90000);
 await open(page,'/math-lab/graphing-calculator?roboLab');const graph=page.getByRole('img',{name:/^Interactive function graph/});await expect(graph).toBeVisible({timeout:60000});const r=(await graph.boundingBox())!;
 await anchorAt(page,r.x+r.width*.5,r.y+r.height*.5);
 await expect.poll(async()=> (await snapshot(page))?.nearbyObjects?.filter((o:{kind:string})=>o.kind==='plot').length??0).toBeGreaterThan(0);
 await expect.poll(async()=> (await snapshot(page))?.graphPosition?.length??0).toBe(2);const state=await snapshot(page);expect(state.mode).toBe('graph2d');expect(state.graphPosition).toHaveLength(2);expect(state.nearbyObjects.some((o:{graphDistance?:number})=>Number.isFinite(o.graphDistance))).toBe(true);
 await expect(await ask(page,'what is near you')).toContainText('graph units');
});

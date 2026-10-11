import {expect,test,type Page,type Locator} from '@playwright/test';
import {mkdirSync} from 'node:fs';
test.use({isMobile:true,hasTouch:true,deviceScaleFactor:1});
async function pinch(page:Page,canvas:Locator){
 const box=(await canvas.boundingBox())!;const x=box.x+box.width/2,y=box.y+box.height*.35;
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-35,y,id:1},{x:x+35,y,id:2}]});
 for(let i=1;i<=4;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-35-i*12,y,id:1},{x:x+35+i*12,y,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
}
for(const width of [320,390]){
 test(`3D geometry: touch add, delete, button zoom and pinch at ${width}px`,async({page})=>{
  test.setTimeout(120000);await page.setViewportSize({width,height:844});
  await page.goto('/workspace/3d',{waitUntil:'domcontentloaded'});
  const root=page.locator('.object-studio-shell'),canvas=root.locator('canvas').first();await expect(canvas).toBeVisible({timeout:60000});
  const initial=await root.locator('.os-object-list > div').count();
  await page.getByRole('button',{name:'Shape library menu'}).tap();
  await page.getByRole('button',{name:'Add Cube',exact:true}).tap();
  await expect(root.locator('.os-object-list > div')).toHaveCount(initial+1);
  await page.getByRole('button',{name:'Close inspector'}).tap();
  const toolbar=page.getByRole('navigation',{name:'3D geometry tools'});
  await expect(toolbar.getByRole('button',{name:'Select',exact:true})).toHaveAttribute('aria-pressed','true');
  await toolbar.getByRole('button',{name:'View',exact:true}).tap();
  const before=await canvas.screenshot({mask:[page.locator('.offline-assistant')]});await page.locator('.mws-sheet').getByRole('button',{name:'Zoom in',exact:true}).tap();
  await expect.poll(async()=>!(await canvas.screenshot({mask:[page.locator('.offline-assistant')]})).equals(before)).toBe(true);
  await page.getByRole('button',{name:'Close panel'}).tap();
  const beforePinch=await canvas.screenshot({mask:[page.locator('.offline-assistant')]});await pinch(page,canvas);
  await expect.poll(async()=>!(await canvas.screenshot({mask:[page.locator('.offline-assistant')]})).equals(beforePinch)).toBe(true);
  await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();
  await expect(root.locator('.os-object-list > div')).toHaveCount(initial);
  mkdirSync('reports/mobile-workspaces',{recursive:true});await page.screenshot({path:`reports/mobile-workspaces/geometry3d-${width}.png`});
 });
 test(`3D graph: touch add, delete and camera zoom at ${width}px`,async({page})=>{
  test.setTimeout(120000);await page.setViewportSize({width,height:844});
  await page.goto('/math-lab/3d-graphing',{waitUntil:'domcontentloaded'});
  const root=page.locator('.graph-studio-3d-shell'),canvas=root.locator('canvas').first();await expect(canvas).toBeVisible({timeout:60000});
  const toolbar=page.getByRole('navigation',{name:'3D graph tools'});
  await toolbar.getByRole('button',{name:'Add',exact:true}).tap();await page.getByRole('button',{name:'Add explicit surface'}).tap();await expect(root.locator('.gs3d-expression')).toHaveCount(2);
  await page.getByRole('button',{name:/Collapse Expressions & Layers/}).tap();
  await toolbar.getByRole('button',{name:'Camera',exact:true}).tap();
  const before=await canvas.screenshot({mask:[page.locator('.offline-assistant')]});await page.locator('.mws-sheet').getByRole('button',{name:'Zoom in',exact:true}).tap();await expect.poll(async()=>!(await canvas.screenshot({mask:[page.locator('.offline-assistant')]})).equals(before)).toBe(true);
  await page.getByRole('button',{name:'Close panel'}).tap();
  const beforePinch=await canvas.screenshot({mask:[page.locator('.offline-assistant')]});await pinch(page,canvas);await expect.poll(async()=>!(await canvas.screenshot({mask:[page.locator('.offline-assistant')]})).equals(beforePinch)).toBe(true);
  await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();await expect(root.locator('.gs3d-expression')).toHaveCount(1);
  mkdirSync('reports/mobile-workspaces',{recursive:true});await page.screenshot({path:`reports/mobile-workspaces/graph3d-${width}.png`});
 });
 test(`2D geometry: touch construction, pinch, zoom controls and delete at ${width}px`,async({page})=>{
  test.setTimeout(120000);await page.setViewportSize({width,height:844});await page.goto('/workspace/geometry',{waitUntil:'domcontentloaded'});
  const board=page.getByTestId('workspace-geometry-board');await expect(board).toBeVisible({timeout:60000});
  const toolbar=page.getByRole('navigation',{name:'Essential geometry tools'});
  for(const button of await toolbar.getByRole('button').all()){
   const bounds=(await button.boundingBox())!;expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(width);expect(bounds.y+bounds.height).toBeLessThanOrEqual(844);
  }
  await toolbar.getByRole('button',{name:'More',exact:true}).tap();
  await toolbar.getByRole('button',{name:'More',exact:true}).tap();
  await toolbar.getByRole('button',{name:'Point',exact:true}).tap();const box=(await board.boundingBox())!;
  await page.touchscreen.tap(box.x+box.width*.5,box.y+box.height*.45);await expect(board.locator('[data-point-id]')).toHaveCount(1);
  await toolbar.getByRole('button',{name:'Select',exact:true}).tap();const before=await board.getAttribute('viewBox');await pinch(page,board);await expect(board).not.toHaveAttribute('viewBox',before!);await expect(board.locator('[data-point-id]')).toHaveCount(1);
  const beforeButton=await board.getAttribute('viewBox');const zoom=page.getByRole('button',{name:'Zoom in',exact:true});await expect(zoom).toBeVisible();expect((await zoom.boundingBox())!.width).toBeGreaterThanOrEqual(44);await zoom.tap();await expect(board).not.toHaveAttribute('viewBox',beforeButton!);
  await board.locator('[data-point-id]').tap();await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();await expect(board.locator('[data-point-id]')).toHaveCount(0);
  mkdirSync('reports/mobile-workspaces',{recursive:true});await page.screenshot({path:`reports/mobile-workspaces/geometry2d-${width}.png`});
 });
 test(`2D graph: touch expressions, pinch and direct delete at ${width}px`,async({page})=>{
  test.setTimeout(120000);await page.setViewportSize({width,height:844});await page.goto('/workspace/graph',{waitUntil:'domcontentloaded'});
  const graph=page.getByRole('img',{name:/Interactive function graph/});await expect(graph).toBeVisible({timeout:60000});
  await page.getByRole('button',{name:'Expressions menu'}).tap();await page.getByRole('textbox',{name:'Function 1',exact:true}).fill('sin(x^2)');await page.getByRole('button',{name:'Collapse Expressions & Layers'}).tap();
  const before=await graph.locator('polyline').first().getAttribute('points');await pinch(page,graph);await expect.poll(()=>graph.locator('polyline').first().getAttribute('points')).not.toBe(before);
  const toolbar=page.getByRole('navigation',{name:'Graph workspace tools'});await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();await expect(page.locator('.gs2d-expression')).toHaveCount(1);
  mkdirSync('reports/mobile-workspaces',{recursive:true});await page.screenshot({path:`reports/mobile-workspaces/graph2d-${width}.png`});
 });
}

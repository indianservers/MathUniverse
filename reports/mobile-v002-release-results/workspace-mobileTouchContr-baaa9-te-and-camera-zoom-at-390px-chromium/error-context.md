# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace\mobileTouchControls.e2e.ts >> 3D graph: touch add, delete and camera zoom at 390px
- Location: tests\workspace\mobileTouchControls.e2e.ts:33:2

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.graph-studio-3d-shell').locator('.gs3d-expression')
Expected: 1
Received: undefined
Timeout:  10000ms

Call log:
  - Expect "toHaveCount" with timeout 10000ms
  - waiting for locator('.graph-studio-3d-shell').locator('.gs3d-expression')
    - waiting for" http://127.0.0.1:9867/math-lab/3d-graphing" navigation to finish...

```

# Test source

```ts
  1  | import {expect,test,type Page,type Locator} from '@playwright/test';
  2  | import {mkdirSync} from 'node:fs';
  3  | test.use({isMobile:true,hasTouch:true,deviceScaleFactor:1});
  4  | async function pinch(page:Page,canvas:Locator){
  5  |  const box=(await canvas.boundingBox())!;const x=box.x+box.width/2,y=box.y+box.height*.35;
  6  |  const cdp=await page.context().newCDPSession(page);
  7  |  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-35,y,id:1},{x:x+35,y,id:2}]});
  8  |  for(let i=1;i<=4;i++)await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-35-i*12,y,id:1},{x:x+35+i*12,y,id:2}]});
  9  |  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await cdp.detach();
  10 | }
  11 | for(const width of [320,390]){
  12 |  test(`3D geometry: touch add, delete, button zoom and pinch at ${width}px`,async({page})=>{
  13 |   test.setTimeout(120000);await page.setViewportSize({width,height:844});
  14 |   await page.goto('/workspace/3d',{waitUntil:'domcontentloaded'});
  15 |   const root=page.locator('.object-studio-shell'),canvas=root.locator('canvas').first();await expect(canvas).toBeVisible({timeout:60000});
  16 |   const initial=await root.locator('.os-object-list > div').count();
  17 |   await page.getByRole('button',{name:'Shape library menu'}).tap();
  18 |   await page.getByRole('button',{name:'Add Cube',exact:true}).tap();
  19 |   await expect(root.locator('.os-object-list > div')).toHaveCount(initial+1);
  20 |   await page.getByRole('button',{name:'Close inspector'}).tap();
  21 |   const toolbar=page.getByRole('navigation',{name:'3D geometry tools'});
  22 |   await expect(toolbar.getByRole('button',{name:'Select',exact:true})).toHaveAttribute('aria-pressed','true');
  23 |   await toolbar.getByRole('button',{name:'View',exact:true}).tap();
  24 |   const before=await canvas.screenshot({mask:[page.locator('.offline-assistant')]});await page.locator('.mws-sheet').getByRole('button',{name:'Zoom in',exact:true}).tap();
  25 |   await expect.poll(async()=>!(await canvas.screenshot({mask:[page.locator('.offline-assistant')]})).equals(before)).toBe(true);
  26 |   await page.getByRole('button',{name:'Close panel'}).tap();
  27 |   const beforePinch=await canvas.screenshot({mask:[page.locator('.offline-assistant')]});await pinch(page,canvas);
  28 |   await expect.poll(async()=>!(await canvas.screenshot({mask:[page.locator('.offline-assistant')]})).equals(beforePinch)).toBe(true);
  29 |   await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();
  30 |   await expect(root.locator('.os-object-list > div')).toHaveCount(initial);
  31 |   mkdirSync('reports/mobile-workspaces',{recursive:true});await page.screenshot({path:`reports/mobile-workspaces/geometry3d-${width}.png`});
  32 |  });
  33 |  test(`3D graph: touch add, delete and camera zoom at ${width}px`,async({page})=>{
  34 |   test.setTimeout(120000);await page.setViewportSize({width,height:844});
  35 |   await page.goto('/math-lab/3d-graphing',{waitUntil:'domcontentloaded'});
  36 |   const root=page.locator('.graph-studio-3d-shell'),canvas=root.locator('canvas').first();await expect(canvas).toBeVisible({timeout:60000});
  37 |   const toolbar=page.getByRole('navigation',{name:'3D graph tools'});
  38 |   await toolbar.getByRole('button',{name:'Add',exact:true}).tap();await page.getByRole('button',{name:'Add explicit surface'}).tap();await expect(root.locator('.gs3d-expression')).toHaveCount(2);
  39 |   await page.getByRole('button',{name:/Collapse Expressions & Layers/}).tap();
  40 |   await toolbar.getByRole('button',{name:'Camera',exact:true}).tap();
  41 |   const before=await canvas.screenshot({mask:[page.locator('.offline-assistant')]});await page.locator('.mws-sheet').getByRole('button',{name:'Zoom in',exact:true}).tap();await expect.poll(async()=>!(await canvas.screenshot({mask:[page.locator('.offline-assistant')]})).equals(before)).toBe(true);
  42 |   await page.getByRole('button',{name:'Close panel'}).tap();
  43 |   const beforePinch=await canvas.screenshot({mask:[page.locator('.offline-assistant')]});await pinch(page,canvas);await expect.poll(async()=>!(await canvas.screenshot({mask:[page.locator('.offline-assistant')]})).equals(beforePinch)).toBe(true);
> 44 |   await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();await expect(root.locator('.gs3d-expression')).toHaveCount(1);
     |                                                                                                                     ^ Error: expect(locator).toHaveCount(expected) failed
  45 |   mkdirSync('reports/mobile-workspaces',{recursive:true});await page.screenshot({path:`reports/mobile-workspaces/graph3d-${width}.png`});
  46 |  });
  47 |  test(`2D geometry: touch construction, pinch, zoom controls and delete at ${width}px`,async({page})=>{
  48 |   test.setTimeout(120000);await page.setViewportSize({width,height:844});await page.goto('/workspace/geometry',{waitUntil:'domcontentloaded'});
  49 |   const board=page.getByTestId('workspace-geometry-board');await expect(board).toBeVisible({timeout:60000});
  50 |   const toolbar=page.getByRole('navigation',{name:'Essential geometry tools'});
  51 |   for(const button of await toolbar.getByRole('button').all()){
  52 |    const bounds=(await button.boundingBox())!;expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(width);expect(bounds.y+bounds.height).toBeLessThanOrEqual(844);
  53 |   }
  54 |   await toolbar.getByRole('button',{name:'More',exact:true}).tap();
  55 |   await toolbar.getByRole('button',{name:'More',exact:true}).tap();
  56 |   await toolbar.getByRole('button',{name:'Point',exact:true}).tap();const box=(await board.boundingBox())!;
  57 |   await page.touchscreen.tap(box.x+box.width*.5,box.y+box.height*.45);await expect(board.locator('[data-point-id]')).toHaveCount(1);
  58 |   await toolbar.getByRole('button',{name:'Select',exact:true}).tap();const before=await board.getAttribute('viewBox');await pinch(page,board);await expect(board).not.toHaveAttribute('viewBox',before!);await expect(board.locator('[data-point-id]')).toHaveCount(1);
  59 |   const beforeButton=await board.getAttribute('viewBox');const zoom=page.getByRole('button',{name:'Zoom in',exact:true});await expect(zoom).toBeVisible();expect((await zoom.boundingBox())!.width).toBeGreaterThanOrEqual(44);await zoom.tap();await expect(board).not.toHaveAttribute('viewBox',beforeButton!);
  60 |   await board.locator('[data-point-id]').tap();await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();await expect(board.locator('[data-point-id]')).toHaveCount(0);
  61 |   mkdirSync('reports/mobile-workspaces',{recursive:true});await page.screenshot({path:`reports/mobile-workspaces/geometry2d-${width}.png`});
  62 |  });
  63 |  test(`2D graph: touch expressions, pinch and direct delete at ${width}px`,async({page})=>{
  64 |   test.setTimeout(120000);await page.setViewportSize({width,height:844});await page.goto('/workspace/graph',{waitUntil:'domcontentloaded'});
  65 |   const graph=page.getByRole('img',{name:/Interactive function graph/});await expect(graph).toBeVisible({timeout:60000});
  66 |   await page.getByRole('button',{name:'Expressions menu'}).tap();await page.getByRole('textbox',{name:'Function 1',exact:true}).fill('sin(x^2)');await page.getByRole('button',{name:'Collapse Expressions & Layers'}).tap();
  67 |   const before=await graph.locator('polyline').first().getAttribute('points');await pinch(page,graph);await expect.poll(()=>graph.locator('polyline').first().getAttribute('points')).not.toBe(before);
  68 |   const toolbar=page.getByRole('navigation',{name:'Graph workspace tools'});await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();await expect(page.locator('.gs2d-expression')).toHaveCount(1);
  69 |   mkdirSync('reports/mobile-workspaces',{recursive:true});await page.screenshot({path:`reports/mobile-workspaces/graph2d-${width}.png`});
  70 |  });
  71 | }
  72 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace\mobileTouchControls.e2e.ts >> 2D graph: touch expressions, pinch and direct delete at 320px
- Location: tests\workspace\mobileTouchControls.e2e.ts:63:2

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.tap: Test timeout of 120000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Expressions menu' })
    - locator resolved to <button type="button" data-mws-menu="true" aria-pressed="false" aria-expanded="false" class="gs3d-mobile-menu" aria-label="Expressions menu">…</button>
  - attempting tap action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <svg width="24" height="24" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list" xmlns="http://www.w3.org/2000/svg">…</svg> from <div data-mws-toolbar="true" class="mws-quick-actions">…</div> subtree intercepts pointer events
    - retrying tap action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <svg width="24" height="24" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list" xmlns="http://www.w3.org/2000/svg">…</svg> from <div data-mws-toolbar="true" class="mws-quick-actions">…</div> subtree intercepts pointer events
    - retrying tap action
      - waiting 100ms
    217 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
        - done scrolling
        - <svg width="24" height="24" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list" xmlns="http://www.w3.org/2000/svg">…</svg> from <div data-mws-toolbar="true" class="mws-quick-actions">…</div> subtree intercepts pointer events
      - retrying tap action
        - waiting 500ms

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - progressbar "Loading page"
  - complementary "Offline math assistant" [ref=e3]:
    - button "Ask Math · Offline" [ref=e4] [cursor=pointer]:
      - generic: Hi! I’m Ruhi
      - img [ref=e5]
  - main [ref=e60]:
    - region "Scrollable graph workspace" [ref=e62]:
      - generic [ref=e64]:
        - generic [ref=e65]:
          - generic [ref=e67]: MU
          - button "My Function Study" [ref=e69] [cursor=pointer]:
            - generic [ref=e70]: My Function Study
            - img [ref=e71]
          - generic [ref=e74]:
            - generic [ref=e75]:
              - button "AR" [ref=e76] [cursor=pointer]:
                - img [ref=e77]
              - button "Hand Gestures" [ref=e82] [cursor=pointer]:
                - img [ref=e83]
            - generic "Graph view controls" [ref=e88]:
              - generic [ref=e89]: Cartesian
              - button "Zoom in" [ref=e90] [cursor=pointer]:
                - img [ref=e91]
              - button "Zoom out" [ref=e94] [cursor=pointer]:
                - img [ref=e95]
              - button "Fit visible graphs" [ref=e98] [cursor=pointer]:
                - img [ref=e99]
              - button "Reset to default window" [ref=e105] [cursor=pointer]:
                - img [ref=e106]
              - button "View graph full screen" [ref=e109] [cursor=pointer]:
                - img [ref=e110]
            - 'button "Theme: Dark" [ref=e115] [cursor=pointer]':
              - img [ref=e116]
          - button "Expressions menu" [ref=e118] [cursor=pointer]:
            - img [ref=e119]
        - main [ref=e120]:
          - img "Interactive function graph. Trace point x -0.044, y -3.998" [ref=e122]:
            - generic [ref=e124]: x
            - generic [ref=e125]: "y"
            - generic [ref=e126]:
              - generic [ref=e127]: "-10"
              - generic [ref=e128]: "-9"
              - generic [ref=e129]: "-8"
              - generic [ref=e130]: "-7"
              - generic [ref=e131]: "-6"
              - generic [ref=e132]: "-5"
              - generic [ref=e133]: "-4"
              - generic [ref=e134]: "-3"
              - generic [ref=e135]: "-2"
              - generic [ref=e136]: "-1"
              - generic [ref=e137]: "1"
              - generic [ref=e138]: "2"
              - generic [ref=e139]: "3"
              - generic [ref=e140]: "4"
              - generic [ref=e141]: "5"
              - generic [ref=e142]: "6"
              - generic [ref=e143]: "7"
              - generic [ref=e144]: "8"
              - generic [ref=e145]: "9"
              - generic [ref=e146]: "10"
              - generic [ref=e147]: "-10"
              - generic [ref=e148]: "-8"
              - generic [ref=e149]: "-6"
              - generic [ref=e150]: "-4"
              - generic [ref=e151]: "-2"
              - generic [ref=e152]: "2"
              - generic [ref=e153]: "4"
              - generic [ref=e154]: "6"
              - generic [ref=e155]: "8"
              - generic [ref=e156]: "10"
            - button "root at -2, 0" [ref=e162] [cursor=pointer]
            - button "root at 2, 0" [ref=e164] [cursor=pointer]
            - button "intercept at 0, -4" [ref=e166] [cursor=pointer]
            - button "minimum at -0.044, -3.998" [ref=e168] [cursor=pointer]
            - button "intersection at -1.736, -0.986" [ref=e170] [cursor=pointer]
            - button "intersection at 2.193, 0.812" [ref=e172] [cursor=pointer]
            - generic [ref=e176]:
              - generic [ref=e178]: x^2 - 4
              - generic [ref=e179]: x=-0.044444, y=-3.998025
          - generic [ref=e180]:
            - generic [ref=e181]:
              - strong [ref=e182]: f • Function
              - text: x^2 - 4
              - generic [ref=e183]:
                - generic [ref=e184]:
                  - term [ref=e185]: x min
                  - definition [ref=e186]: "-10"
                - generic [ref=e187]:
                  - term [ref=e188]: x max
                  - definition [ref=e189]: "10"
            - generic [ref=e190]:
              - button "Style" [ref=e191] [cursor=pointer]
              - button "Lock" [ref=e192] [cursor=pointer]
              - button "More" [ref=e193] [cursor=pointer]
        - generic [ref=e194]:
          - button "Mobile controls" [ref=e195] [cursor=pointer]:
            - img [ref=e196]
            - generic [ref=e197]: Objects & tools
          - button "Undo mobile change" [disabled] [ref=e198]:
            - img [ref=e199]
          - button "Redo mobile change" [disabled] [ref=e202]:
            - img [ref=e203]
        - navigation "Graph workspace tools" [ref=e206]:
          - button "Delete" [ref=e207] [cursor=pointer]:
            - img [ref=e209]
            - generic [ref=e212]: Delete
          - button "Zoom in" [ref=e213] [cursor=pointer]:
            - img [ref=e215]
            - generic [ref=e218]: Zoom in
          - button "Zoom out" [ref=e219] [cursor=pointer]:
            - img [ref=e221]
            - generic [ref=e224]: Zoom out
          - button "Reset view" [ref=e225] [cursor=pointer]:
            - img [ref=e227]
            - generic [ref=e230]: Reset view
          - button "Expression" [ref=e231] [cursor=pointer]:
            - img [ref=e233]
            - generic [ref=e234]: Expression
          - button "Point" [ref=e235] [cursor=pointer]:
            - img [ref=e237]
            - generic [ref=e239]: Point
          - button "Trace" [pressed] [ref=e240] [cursor=pointer]:
            - img [ref=e242]
            - generic [ref=e244]: Trace
          - button "Zoom" [ref=e245] [cursor=pointer]:
            - img [ref=e247]
            - generic [ref=e250]: Zoom
          - button "More" [ref=e251] [cursor=pointer]:
            - img [ref=e253]
            - generic [ref=e257]: More
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
  44 |   await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();await expect(root.locator('.gs3d-expression')).toHaveCount(1);
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
> 66 |   await page.getByRole('button',{name:'Expressions menu'}).tap();await page.getByRole('textbox',{name:'Function 1',exact:true}).fill('sin(x^2)');await page.getByRole('button',{name:'Collapse Expressions & Layers'}).tap();
     |                                                            ^ Error: locator.tap: Test timeout of 120000ms exceeded.
  67 |   const before=await graph.locator('polyline').first().getAttribute('points');await pinch(page,graph);await expect.poll(()=>graph.locator('polyline').first().getAttribute('points')).not.toBe(before);
  68 |   const toolbar=page.getByRole('navigation',{name:'Graph workspace tools'});await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();await expect(page.locator('.gs2d-expression')).toHaveCount(1);
  69 |   mkdirSync('reports/mobile-workspaces',{recursive:true});await page.screenshot({path:`reports/mobile-workspaces/graph2d-${width}.png`});
  70 |  });
  71 | }
  72 | 
```
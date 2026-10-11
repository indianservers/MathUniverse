# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace\mobileTouchControls.e2e.ts >> 2D geometry: touch construction, pinch, zoom controls and delete at 320px
- Location: tests\workspace\mobileTouchControls.e2e.ts:47:2

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.tap: Test timeout of 120000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Zoom in', exact: true })
    - locator resolved to <button type="button" title="Zoom in" aria-label="Zoom in">…</button>
  - attempting tap action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <button type="button" aria-label="Undo mobile change">…</button> from <div data-mws-toolbar="true" class="mws-quick-actions">…</div> subtree intercepts pointer events
    - retrying tap action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <button type="button" aria-label="Undo mobile change">…</button> from <div data-mws-toolbar="true" class="mws-quick-actions">…</div> subtree intercepts pointer events
    - retrying tap action
      - waiting 100ms
    219 × waiting for element to be visible, enabled and stable
        - element is visible, enabled and stable
        - scrolling into view if needed
        - done scrolling
        - <button type="button" aria-label="Undo mobile change">…</button> from <div data-mws-toolbar="true" class="mws-quick-actions">…</div> subtree intercepts pointer events
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
    - generic [ref=e65]:
      - generic [ref=e66]:
        - generic [ref=e67]:
          - generic [ref=e68]:
            - link "Home page" [ref=e69] [cursor=pointer]:
              - /url: /
              - img [ref=e70]
            - heading "2D Geometry Workspace" [level=1]
            - button "Rename project" [ref=e73] [cursor=pointer]:
              - img
          - paragraph [ref=e76]: Circle Theorem Exploration
        - generic [ref=e77]:
          - generic [ref=e78]:
            - button "AR" [ref=e79] [cursor=pointer]:
              - img [ref=e80]
            - button "Hand Gestures" [ref=e85] [cursor=pointer]:
              - img [ref=e86]
          - generic "Pane controls" [ref=e91]:
            - button "Reduce active pane" [ref=e92] [cursor=pointer]:
              - img [ref=e93]
            - button "Enlarge active pane" [ref=e94] [cursor=pointer]:
              - img [ref=e95]
            - button "Expand active pane" [ref=e96] [cursor=pointer]:
              - img [ref=e97]
          - button "Undo" [ref=e102] [cursor=pointer]:
            - img [ref=e103]
          - button "Redo" [ref=e106] [cursor=pointer]:
            - img [ref=e107]
          - button "Save" [ref=e110] [cursor=pointer]:
            - img [ref=e111]
          - button "Restore saved construction" [ref=e115] [cursor=pointer]:
            - img [ref=e116]
          - button "Load or import workspace file" [ref=e119] [cursor=pointer]:
            - img [ref=e120]
          - button "Export" [ref=e123] [cursor=pointer]:
            - img [ref=e124]
          - button "Workspace settings" [ref=e130] [cursor=pointer]:
            - img [ref=e131]
          - button "Share or export" [ref=e135] [cursor=pointer]:
            - img [ref=e136]
          - 'button "Theme: Light" [ref=e142] [cursor=pointer]':
            - img [ref=e143]
          - button "Open workspace panels" [ref=e149] [cursor=pointer]:
            - img [ref=e150]
      - main [ref=e151]:
        - generic [ref=e153]:
          - generic "Canvas navigation tools" [ref=e154]:
            - button "Select" [ref=e155] [cursor=pointer]:
              - img [ref=e156]
            - button "Pan" [ref=e158] [cursor=pointer]:
              - img [ref=e159]
          - generic "Canvas zoom controls" [ref=e164]:
            - button "Zoom in" [ref=e165] [cursor=pointer]:
              - img [ref=e166]
            - button "Zoom out" [ref=e169] [cursor=pointer]:
              - img [ref=e170]
            - button "Fit all objects" [ref=e173] [cursor=pointer]:
              - img [ref=e174]
            - button "Reset view" [ref=e179] [cursor=pointer]:
              - img [ref=e180]
          - application "Geometry constructor. Select a point and use arrow keys to nudge it. Press Escape to return to select mode." [ref=e183]:
            - generic [ref=e185]:
              - generic [ref=e186]: "-1"
              - generic [ref=e187]: "1"
              - generic [ref=e188]: "2"
              - generic [ref=e189]: "5"
              - generic [ref=e190]: "4"
              - generic [ref=e191]: "0"
              - generic [ref=e192]: x
              - generic [ref=e193]: "y"
            - generic [ref=e194]:
              - generic: A
          - generic [ref=e196]: Drag points to explore · Shift for multi-select · Esc to clear
          - generic [ref=e197]: Touch mode supports direct manipulation with 44 pixel controls.
        - region "Selected object actions" [ref=e198]:
          - button "Move" [ref=e199] [cursor=pointer]:
            - img
            - text: Move
          - button "Size" [disabled] [ref=e204]:
            - img
            - text: Size
          - button "Size" [disabled] [ref=e205]:
            - img
            - text: Size
          - button "Trace" [ref=e206] [cursor=pointer]:
            - img
            - text: Trace
          - button "Lock" [ref=e209] [cursor=pointer]:
            - img
            - text: Lock
          - button "Hide" [ref=e212] [cursor=pointer]:
            - img
            - text: Hide
          - button "Delete" [ref=e217] [cursor=pointer]:
            - img
            - text: Delete
      - generic [ref=e220]:
        - button "Mobile controls" [ref=e221] [cursor=pointer]:
          - img [ref=e222]
          - generic [ref=e223]: Objects & tools
        - button "Undo mobile change" [ref=e224] [cursor=pointer]:
          - img [ref=e225]
        - button "Redo mobile change" [disabled] [ref=e228]:
          - img [ref=e229]
      - navigation "Essential geometry tools" [ref=e232]:
        - button "Select" [active] [pressed] [ref=e233] [cursor=pointer]:
          - img [ref=e234]
          - generic [ref=e236]: Select
        - button "Point" [ref=e237] [cursor=pointer]:
          - img [ref=e238]
          - generic [ref=e239]: Point
        - button "Line" [ref=e240] [cursor=pointer]:
          - img [ref=e241]
          - generic [ref=e243]: Line
        - button "Shape" [ref=e244] [cursor=pointer]:
          - img [ref=e245]
          - generic [ref=e247]: Shape
        - button "Measure" [ref=e248] [cursor=pointer]:
          - img [ref=e249]
          - generic [ref=e255]: Measure
        - button "Delete" [disabled] [ref=e256]:
          - img [ref=e257]
          - generic [ref=e260]: Delete
        - button "Undo geometry change" [ref=e261] [cursor=pointer]:
          - img [ref=e262]
          - generic [ref=e265]: Undo
        - button "Redo geometry change" [ref=e266] [cursor=pointer]:
          - img [ref=e267]
          - generic [ref=e270]: Redo
        - button "More" [ref=e271] [cursor=pointer]:
          - img [ref=e272]
          - generic [ref=e273]: More
      - generic [ref=e274]:
        - text: Offline
        - generic [ref=e275]: 60 FPS
        - generic [ref=e276]: 0 constraints
        - generic [ref=e277]: 1 points
        - button "Snap on" [ref=e278] [cursor=pointer]:
          - img [ref=e279]
          - text: Snap on
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
> 59 |   const beforeButton=await board.getAttribute('viewBox');const zoom=page.getByRole('button',{name:'Zoom in',exact:true});await expect(zoom).toBeVisible();expect((await zoom.boundingBox())!.width).toBeGreaterThanOrEqual(44);await zoom.tap();await expect(board).not.toHaveAttribute('viewBox',beforeButton!);
     |                                                                                                                                                                                                                                           ^ Error: locator.tap: Test timeout of 120000ms exceeded.
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
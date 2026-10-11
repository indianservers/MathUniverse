# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace\mobileTouchControls.e2e.ts >> 3D geometry: touch add, delete, button zoom and pinch at 320px
- Location: tests\workspace\mobileTouchControls.e2e.ts:12:2

# Error details

```
Test timeout of 120000ms exceeded.
```

```
Error: locator.tap: Test timeout of 120000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Close inspector' })

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
          - generic [ref=e68]: MU
          - strong [ref=e69]: 3d- Geometry
        - generic [ref=e70]:
          - button "AR" [ref=e71] [cursor=pointer]:
            - img [ref=e72]
          - button "Hand Gestures" [ref=e77] [cursor=pointer]:
            - img [ref=e78]
        - button "Shape library menu" [ref=e83] [cursor=pointer]:
          - img [ref=e84]
      - main [ref=e85]:
        - button "Perspective" [ref=e88] [cursor=pointer]:
          - text: Perspective
          - img [ref=e89]
        - generic [ref=e91]:
          - button "Fit view" [ref=e92] [cursor=pointer]:
            - img [ref=e93]
          - button "Full screen" [ref=e99] [cursor=pointer]:
            - img [ref=e100]
          - button "Open Vector Lab" [ref=e106] [cursor=pointer]:
            - img [ref=e107]
        - application "Interactive 3D scene. Drag objects, orbit, pan, and zoom" [ref=e113]:
          - paragraph [ref=e117]: Interactive 3D scene. Drag objects, orbit, pan, and zoom. Use the adjacent controls for a keyboard-accessible alternative.
      - region "Object details dock" [ref=e118]
      - generic [ref=e120]:
        - button "Mobile controls" [ref=e121] [cursor=pointer]:
          - img [ref=e122]
          - generic [ref=e123]: Objects & tools
        - button "Undo mobile change" [ref=e124] [cursor=pointer]:
          - img [ref=e125]
        - button "Redo mobile change" [disabled] [ref=e128]:
          - img [ref=e129]
      - dialog "Mobile controls" [ref=e132]:
        - button "Expand panel" [ref=e133]
        - generic [ref=e134]:
          - heading "Mobile controls" [level=2] [ref=e135]
          - button "Close panel" [ref=e136] [cursor=pointer]: Close
        - generic [ref=e137]:
          - navigation "Mobile control sections" [ref=e138]:
            - button "Objects" [pressed] [ref=e139] [cursor=pointer]
            - button "Add" [ref=e140] [cursor=pointer]
            - button "Edit" [ref=e141] [cursor=pointer]
            - button "View" [ref=e142] [cursor=pointer]
            - button "Help" [ref=e143] [cursor=pointer]
          - generic [ref=e144]:
            - generic [ref=e145] [cursor=pointer]:
              - text: Search objects
              - searchbox "Search objects" [ref=e146]
            - paragraph [ref=e147]: 14 objects · 0 marked
            - generic [ref=e148]:
              - button "Mark all results" [ref=e149] [cursor=pointer]
              - button "Unmark all" [disabled] [ref=e150]
              - button "Show marked" [disabled] [ref=e151]
              - button "Hide marked" [disabled] [ref=e152]
              - button "Delete marked" [disabled] [ref=e153]
              - button "Clear all (14)" [ref=e154] [cursor=pointer]
            - generic [ref=e155]:
              - checkbox "Mark surface" [ref=e156] [cursor=pointer]
              - button "surface surface" [ref=e157] [cursor=pointer]:
                - strong [ref=e158]: surface
                - generic [ref=e159]: surface
              - button "Hide surface" [ref=e160] [cursor=pointer]:
                - img [ref=e161]
              - button "Lock surface" [ref=e164] [cursor=pointer]:
                - img [ref=e165]
            - generic [ref=e168]:
              - checkbox "Mark solid" [ref=e169] [cursor=pointer]
              - button "solid solid" [ref=e170] [cursor=pointer]:
                - strong [ref=e171]: solid
                - generic [ref=e172]: solid
              - button "Hide solid" [ref=e173] [cursor=pointer]:
                - img [ref=e174]
              - button "Lock solid" [ref=e177] [cursor=pointer]:
                - img [ref=e178]
            - generic [ref=e181]:
              - checkbox "Mark slice" [ref=e182] [cursor=pointer]
              - button "slice slice" [ref=e183] [cursor=pointer]:
                - strong [ref=e184]: slice
                - generic [ref=e185]: slice
              - button "Hide slice" [ref=e186] [cursor=pointer]:
                - img [ref=e187]
              - button "Lock slice" [ref=e190] [cursor=pointer]:
                - img [ref=e191]
            - generic [ref=e194]:
              - checkbox "Mark P" [ref=e195] [cursor=pointer]
              - button "P point" [ref=e196] [cursor=pointer]:
                - strong [ref=e197]: P
                - generic [ref=e198]: point
              - button "Hide P" [ref=e199] [cursor=pointer]:
                - img [ref=e200]
              - button "Lock P" [ref=e203] [cursor=pointer]:
                - img [ref=e204]
            - generic [ref=e207]:
              - checkbox "Mark v" [ref=e208] [cursor=pointer]
              - button "v vector" [ref=e209] [cursor=pointer]:
                - strong [ref=e210]: v
                - generic [ref=e211]: vector
              - button "Hide v" [ref=e212] [cursor=pointer]:
                - img [ref=e213]
              - button "Lock v" [ref=e216] [cursor=pointer]:
                - img [ref=e217]
            - generic [ref=e220]:
              - checkbox "Mark l" [ref=e221] [cursor=pointer]
              - button "l line3d" [ref=e222] [cursor=pointer]:
                - strong [ref=e223]: l
                - generic [ref=e224]: line3d
              - button "Show l" [ref=e225] [cursor=pointer]:
                - img [ref=e226]
              - button "Lock l" [ref=e231] [cursor=pointer]:
                - img [ref=e232]
            - generic [ref=e235]:
              - checkbox "Mark plane" [ref=e236] [cursor=pointer]
              - button "plane plane3d" [ref=e237] [cursor=pointer]:
                - strong [ref=e238]: plane
                - generic [ref=e239]: plane3d
              - button "Show plane" [ref=e240] [cursor=pointer]:
                - img [ref=e241]
              - button "Lock plane" [ref=e246] [cursor=pointer]:
                - img [ref=e247]
            - generic [ref=e250]:
              - checkbox "Mark sphere" [ref=e251] [cursor=pointer]
              - button "sphere sphere3d" [ref=e252] [cursor=pointer]:
                - strong [ref=e253]: sphere
                - generic [ref=e254]: sphere3d
              - button "Show sphere" [ref=e255] [cursor=pointer]:
                - img [ref=e256]
              - button "Lock sphere" [ref=e261] [cursor=pointer]:
                - img [ref=e262]
            - generic [ref=e265]:
              - checkbox "Mark cone" [ref=e266] [cursor=pointer]
              - button "cone cone3d" [ref=e267] [cursor=pointer]:
                - strong [ref=e268]: cone
                - generic [ref=e269]: cone3d
              - button "Show cone" [ref=e270] [cursor=pointer]:
                - img [ref=e271]
              - button "Lock cone" [ref=e276] [cursor=pointer]:
                - img [ref=e277]
            - generic [ref=e280]:
              - checkbox "Mark cylinder" [ref=e281] [cursor=pointer]
              - button "cylinder cylinder3d" [ref=e282] [cursor=pointer]:
                - strong [ref=e283]: cylinder
                - generic [ref=e284]: cylinder3d
              - button "Show cylinder" [ref=e285] [cursor=pointer]:
                - img [ref=e286]
              - button "Lock cylinder" [ref=e291] [cursor=pointer]:
                - img [ref=e292]
            - generic [ref=e295]:
              - checkbox "Mark prism" [ref=e296] [cursor=pointer]
              - button "prism prism3d" [ref=e297] [cursor=pointer]:
                - strong [ref=e298]: prism
                - generic [ref=e299]: prism3d
              - button "Show prism" [ref=e300] [cursor=pointer]:
                - img [ref=e301]
              - button "Lock prism" [ref=e306] [cursor=pointer]:
                - img [ref=e307]
            - generic [ref=e310]:
              - checkbox "Mark pyramid" [ref=e311] [cursor=pointer]
              - button "pyramid pyramid3d" [ref=e312] [cursor=pointer]:
                - strong [ref=e313]: pyramid
                - generic [ref=e314]: pyramid3d
              - button "Show pyramid" [ref=e315] [cursor=pointer]:
                - img [ref=e316]
              - button "Lock pyramid" [ref=e321] [cursor=pointer]:
                - img [ref=e322]
            - generic [ref=e325]:
              - checkbox "Mark polyhedron" [ref=e326] [cursor=pointer]
              - button "polyhedron polyhedron3d" [ref=e327] [cursor=pointer]:
                - strong [ref=e328]: polyhedron
                - generic [ref=e329]: polyhedron3d
              - button "Show polyhedron" [ref=e330] [cursor=pointer]:
                - img [ref=e331]
              - button "Lock polyhedron" [ref=e336] [cursor=pointer]:
                - img [ref=e337]
            - generic [ref=e340]:
              - checkbox "Mark Cube 1" [ref=e341] [cursor=pointer]
              - button "Cube 1 solid" [pressed] [ref=e342] [cursor=pointer]:
                - strong [ref=e343]: Cube 1
                - generic [ref=e344]: solid
              - button "Hide Cube 1" [ref=e345] [cursor=pointer]:
                - img [ref=e346]
              - button "Lock Cube 1" [ref=e349] [cursor=pointer]:
                - img [ref=e350]
            - paragraph [ref=e353]: Overlapping objects? Choose the exact object from this list.
      - navigation "3D geometry tools" [ref=e354]:
        - button "Delete" [ref=e355] [cursor=pointer]:
          - img [ref=e357]
          - generic [ref=e360]: Delete
        - button "Zoom in" [ref=e361] [cursor=pointer]:
          - img [ref=e363]
          - generic [ref=e366]: Zoom in
        - button "Zoom out" [ref=e367] [cursor=pointer]:
          - img [ref=e369]
          - generic [ref=e372]: Zoom out
        - button "Reset view" [ref=e373] [cursor=pointer]:
          - img [ref=e375]
          - generic [ref=e378]: Reset view
        - button "Select" [pressed] [ref=e379] [cursor=pointer]:
          - img [ref=e381]
          - generic [ref=e383]: Select
        - button "Construct" [ref=e384] [cursor=pointer]:
          - img [ref=e386]
          - generic [ref=e390]: Construct
        - button "Measure" [ref=e391] [cursor=pointer]:
          - img [ref=e393]
          - generic [ref=e399]: Measure
        - button "View" [ref=e400] [cursor=pointer]:
          - img [ref=e402]
          - generic [ref=e408]: View
        - button "More" [ref=e409] [cursor=pointer]:
          - img [ref=e411]
          - generic [ref=e415]: More
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
> 20 |   await page.getByRole('button',{name:'Close inspector'}).tap();
     |                                                           ^ Error: locator.tap: Test timeout of 120000ms exceeded.
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
  66 |   await page.getByRole('button',{name:'Expressions menu'}).tap();await page.getByRole('textbox',{name:'Function 1',exact:true}).fill('sin(x^2)');await page.getByRole('button',{name:'Collapse Expressions & Layers'}).tap();
  67 |   const before=await graph.locator('polyline').first().getAttribute('points');await pinch(page,graph);await expect.poll(()=>graph.locator('polyline').first().getAttribute('points')).not.toBe(before);
  68 |   const toolbar=page.getByRole('navigation',{name:'Graph workspace tools'});await toolbar.getByRole('button',{name:'Delete',exact:true}).tap();await expect(page.locator('.gs2d-expression')).toHaveCount(1);
  69 |   mkdirSync('reports/mobile-workspaces',{recursive:true});await page.screenshot({path:`reports/mobile-workspaces/graph2d-${width}.png`});
  70 |  });
  71 | }
  72 | 
```
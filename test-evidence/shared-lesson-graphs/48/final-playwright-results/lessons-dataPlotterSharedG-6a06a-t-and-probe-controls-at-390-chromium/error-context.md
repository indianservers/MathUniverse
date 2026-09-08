# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lessons\dataPlotterSharedGraph.e2e.ts >> Data Plotter dataset, fit and probe controls at 390
- Location: tests\lessons\dataPlotterSharedGraph.e2e.ts:2:63

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: locator.evaluate: Target page, context or browser has been closed
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - progressbar "Loading page"
  - generic [ref=e3]:
    - link "Skip to content" [ref=e4] [cursor=pointer]:
      - /url: "#main-content"
    - generic [ref=e6]:
      - banner [ref=e7]:
        - generic [ref=e8]:
          - paragraph [ref=e10]: Interactive Math Lab
          - generic [ref=e11]:
            - button "Keyboard shortcuts" [ref=e12] [cursor=pointer]: Keyboard shortcuts (?)
            - button "Accessibility settings" [ref=e16] [cursor=pointer]
            - button "Toggle theme" [ref=e20] [cursor=pointer]: "Theme: Light"
      - main [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]:
            - button "Go back" [ref=e26] [cursor=pointer]
            - navigation "Breadcrumb" [ref=e29]:
              - link "Home" [ref=e30] [cursor=pointer]:
                - /url: /
              - generic [ref=e32]:
                - generic [ref=e33]: ">"
                - link "Lessons" [ref=e34] [cursor=pointer]:
                  - /url: /lessons
              - generic [ref=e36]:
                - generic [ref=e37]: ">"
                - link "Graphs And Functions" [ref=e38] [cursor=pointer]:
                  - /url: /lessons/graphs-and-functions
              - generic [ref=e40]:
                - generic [ref=e41]: ">"
                - generic [ref=e42]: 46 Data Plotter
          - generic [ref=e43]:
            - generic [ref=e46]:
              - heading "Data Plotter" [level=1] [ref=e48]
              - generic [ref=e49]:
                - generic "Load a lesson language pack on demand" [ref=e50]:
                  - combobox "Lesson language" [ref=e54]:
                    - option "English (English)" [selected]
                    - option "हिन्दी (Hindi)"
                    - option "বাংলা (Bengali)"
                    - option "తెలుగు (Telugu)"
                    - option "தமிழ் (Tamil)"
                    - option "मराठी (Marathi)"
                    - option "ગુજરાતી (Gujarati)"
                    - option "ಕನ್ನಡ (Kannada)"
                    - option "മലയാളം (Malayalam)"
                    - option "ਪੰਜਾਬੀ (Punjabi)"
                    - option "ଓଡ଼ିଆ (Odia)"
                    - option "অসমীয়া (Assamese)"
                    - option "اردو (Urdu)"
                - button "Reset" [ref=e55] [cursor=pointer]
                - button "Share" [ref=e59] [cursor=pointer]
                - link "Workspace" [ref=e66] [cursor=pointer]:
                  - /url: /workspace/graph
            - tablist "Lesson content tabs" [ref=e71]:
              - tab "Interaction + visualization" [selected] [ref=e72] [cursor=pointer]
              - tab "Learn" [ref=e76] [cursor=pointer]
              - tab "Examples" [ref=e79] [cursor=pointer]
              - tab "Formulas" [ref=e82] [cursor=pointer]
              - tab "Practice" [ref=e85] [cursor=pointer]
            - main [ref=e89]:
              - tabpanel "Lesson interaction and visualization" [ref=e90]:
                - generic [ref=e91]:
                  - generic [ref=e92]:
                    - complementary [ref=e93]:
                      - paragraph [ref=e94]: Data story
                      - heading "r = 0.9986" [level=3] [ref=e95]
                      - generic [ref=e96]:
                        - generic [ref=e97]:
                          - generic [ref=e98]: "1"
                          - generic [ref=e99]: Plot each row
                        - generic [ref=e100]:
                          - generic [ref=e101]: "2"
                          - generic [ref=e102]: Inspect outliers
                        - generic [ref=e103]:
                          - generic [ref=e104]: "3"
                          - generic [ref=e105]: Compare to fit line
                      - generic [ref=e106]: Trend, spread, and outliers must all be visible.
                    - main [ref=e107]:
                      - generic [ref=e108]:
                        - generic [ref=e109]:
                          - heading "Study hours vs Quiz score" [level=3] [ref=e110]
                          - paragraph [ref=e111]: Best-fit line
                        - generic [ref=e112]:
                          - button "Reset view" [ref=e113] [cursor=pointer]
                          - button "Fit" [ref=e117] [cursor=pointer]
                          - button "Share" [ref=e121] [cursor=pointer]
                          - button "Move graph" [ref=e128] [cursor=pointer]
                          - button "Toggle guides" [ref=e134] [cursor=pointer]
                          - button "Inspector" [ref=e137] [cursor=pointer]
                      - region [ref=e142]:
                        - generic [ref=e143]:
                          - generic [ref=e144]:
                            - heading "Data Plotter" [level=3] [ref=e145]
                            - paragraph [ref=e146]: x measures study hours; y measures quiz score. The orange comparison point is excluded from the fit.
                          - group "Graph view controls" [ref=e147]:
                            - button "Zoom graph in" [ref=e148] [cursor=pointer]:
                              - text: ＋
                              - generic [ref=e149]: Zoom in
                            - button "Zoom graph out" [ref=e150] [cursor=pointer]:
                              - text: −
                              - generic [ref=e151]: Zoom out
                            - button "Reset graph view" [ref=e152] [cursor=pointer]:
                              - text: ↺
                              - generic [ref=e153]: Reset view
                        - list "Graph legend" [ref=e154]:
                          - listitem [ref=e155]:
                            - generic [ref=e157]: Least-squares fit
                          - listitem [ref=e158]:
                            - generic [ref=e160]: Three recorded rows
                          - listitem [ref=e161]:
                            - generic [ref=e163]: Recorded residuals
                          - listitem [ref=e164]:
                            - generic [ref=e166]: Probe residual
                          - listitem [ref=e167]:
                            - generic [ref=e169]: Trace hours
                        - generic [ref=e171]:
                          - img "Data Plotter" [ref=e172]:
                            - generic [ref=e175]:
                              - generic [ref=e176]: "-5"
                              - generic [ref=e177]: "0"
                              - generic [ref=e178]: "5"
                              - generic [ref=e179]: "0"
                              - generic [ref=e180]: "50"
                              - generic [ref=e181]: "100"
                              - generic [ref=e182]: x
                              - generic [ref=e183]: "y"
                            - generic [ref=e187]:
                              - 'generic "Three recorded rows: (2, 68)" [ref=e188]'
                              - 'generic "Three recorded rows: (4, 78)" [ref=e189]'
                              - 'generic "Three recorded rows: (6, 90)" [ref=e190]'
                            - generic [ref=e192]:
                              - 'button "(2h, 68): (2, 68)" [ref=e193] [cursor=pointer]'
                              - generic: (2h, 68)
                            - generic [ref=e194]:
                              - 'button "(4h, 78): (4, 78)" [ref=e195] [cursor=pointer]'
                              - generic: (4h, 78)
                            - generic [ref=e196]:
                              - 'button "(6h, 90): (6, 90)" [ref=e197] [cursor=pointer]'
                              - generic: (6h, 90)
                            - generic [ref=e198]:
                              - 'button "Fit 64.92: (1.5, 64.91666666666667)" [ref=e199] [cursor=pointer]'
                              - generic: Fit 64.92
                            - generic [ref=e200]:
                              - 'button "Probe (0.5, 3): (0.5, 3)" [ref=e201] [cursor=pointer]'
                              - generic: Probe (0.5, 3)
                          - paragraph [ref=e202]: Focus the graph and use arrow keys to pan, plus or minus to zoom, and zero to reset the view. Tab to a point to inspect its coordinates.
                        - generic [ref=e203]: "Fit: score = 5.500 × hours + 56.667. r = 0.9986; probe (0.5, 3), residual = -56.417; fit at 1.5 hours = 64.917. The trace extrapolates outside the recorded 2–6 hour range."
                      - generic [ref=e204]:
                        - generic [ref=e205]:
                          - paragraph [ref=e206]: trend
                          - paragraph [ref=e207]: positive
                        - generic [ref=e208]:
                          - paragraph [ref=e209]: r
                          - paragraph [ref=e210]: "0.9986"
                        - generic [ref=e211]:
                          - paragraph [ref=e212]: Probe residual
                          - paragraph [ref=e213]: "-56.417"
                    - complementary [ref=e214]:
                      - generic [ref=e215]:
                        - paragraph [ref=e216]: Data controls
                        - generic [ref=e217]:
                          - generic [ref=e218]:
                            - generic [ref=e219]:
                              - generic [ref=e220]: hours
                              - generic [ref=e221]: "0.5"
                            - slider "hours" [active] [ref=e222]: "0.5"
                            - generic [ref=e223]:
                              - button "Decrease hours" [ref=e224] [cursor=pointer]
                              - status [ref=e226]: "0.5"
                              - button "Increase hours" [ref=e227] [cursor=pointer]
                          - generic [ref=e229]:
                            - generic [ref=e230]:
                              - generic [ref=e231]: score
                              - generic [ref=e232]: "3"
                            - slider "score" [ref=e233]: "3"
                            - generic [ref=e234]:
                              - button "Decrease score" [ref=e235] [cursor=pointer]
                              - status [ref=e237]: "3"
                              - button "Increase score" [ref=e238] [cursor=pointer]
                          - generic [ref=e240]:
                            - generic [ref=e241]:
                              - generic [ref=e242]: Trace x
                              - generic [ref=e243]: "1.5"
                            - slider "Trace x" [ref=e244]: "1.5"
                            - generic [ref=e245]:
                              - button "Decrease Trace x" [ref=e246] [cursor=pointer]
                              - status [ref=e248]: "1.5"
                              - button "Increase Trace x" [ref=e249] [cursor=pointer]
                      - generic [ref=e251]:
                        - paragraph [ref=e252]: "Recorded rows: hours → score"
                        - table [ref=e254]:
                          - rowgroup [ref=e255]:
                            - row [ref=e256]:
                              - rowheader "Study" [ref=e257]
                              - cell "2h" [ref=e258]
                              - cell "68" [ref=e259]
                            - row [ref=e260]:
                              - rowheader "Study" [ref=e261]
                              - cell "4h" [ref=e262]
                              - cell "78" [ref=e263]
                            - row [ref=e264]:
                              - rowheader "Study" [ref=e265]
                              - cell "6h" [ref=e266]
                              - cell "90" [ref=e267]
                  - generic [ref=e268]:
                    - generic [ref=e269]:
                      - paragraph [ref=e270]: Sample values
                      - table [ref=e272]:
                        - rowgroup [ref=e273]:
                          - row [ref=e274]:
                            - columnheader "hours" [ref=e275]
                            - columnheader "-3" [ref=e276]
                            - columnheader "-2" [ref=e277]
                            - columnheader "-1" [ref=e278]
                            - columnheader "0" [ref=e279]
                            - columnheader "1" [ref=e280]
                            - columnheader "1.5" [ref=e281]
                            - columnheader "2" [ref=e282]
                            - columnheader "3" [ref=e283]
                        - rowgroup [ref=e284]:
                          - row [ref=e285]:
                            - rowheader "Fitted score" [ref=e286]
                            - cell "40.167" [ref=e287]
                            - cell "45.667" [ref=e288]
                            - cell "51.167" [ref=e289]
                            - cell "56.667" [ref=e290]
                            - cell "62.167" [ref=e291]
                            - cell "64.917" [ref=e292]
                            - cell "67.667" [ref=e293]
                            - cell "73.167" [ref=e294]
                    - generic [ref=e295]:
                      - strong [ref=e296]: Do not force a curve before inspecting the data.
                      - text: r = 0.9986; probe (0.5, 3), residual = -56.417; fit at 1.5 hours = 64.917
            - navigation "Adjacent lessons" [ref=e297]:
              - link "Previous Point Plotter" [ref=e298] [cursor=pointer]:
                - /url: /lessons/graphs-and-functions/45-point-plotter
                - generic [ref=e301]:
                  - generic [ref=e302]: Previous
                  - generic [ref=e303]: Point Plotter
              - link "Next Table of Values" [ref=e304] [cursor=pointer]:
                - /url: /lessons/graphs-and-functions/47-table-of-values
                - generic [ref=e305]:
                  - generic [ref=e306]: Next
                  - generic [ref=e307]: Table of Values
      - contentinfo "Site footer" [ref=e310]:
        - generic [ref=e311]:
          - paragraph [ref=e312]: © 2026 Indian Servers Private Limited · Math Universe · www.IndianServers.com · info@IndianServers.com
          - navigation "Footer links" [ref=e313]:
            - link "Sitemap" [ref=e314] [cursor=pointer]:
              - /url: /sitemap
            - generic [ref=e315]: ·
            - link "Docs" [ref=e316] [cursor=pointer]:
              - /url: /documentation
            - generic [ref=e317]: ·
            - link "About" [ref=e318] [cursor=pointer]:
              - /url: /about
    - navigation "Mobile learning shortcuts" [ref=e319]:
      - generic [ref=e320]:
        - link "Home" [ref=e321] [cursor=pointer]:
          - /url: /
        - link "Workspace" [ref=e325] [cursor=pointer]:
          - /url: /workspace
        - link "Shapes" [ref=e328] [cursor=pointer]:
          - /url: /shapes
        - link "AR" [ref=e333] [cursor=pointer]:
          - /url: /modules/ar-math-lab
        - link "3 Learn" [ref=e339] [cursor=pointer]:
          - /url: /learn
          - generic [ref=e340]: "3"
          - text: Learn
        - link "Calc" [ref=e343] [cursor=pointer]:
          - /url: /calculator
    - button "Back to top" [ref=e346] [cursor=pointer]
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | for(const [width,height] of [[1440,900],[768,1024],[390,844]])test(`Data Plotter dataset, fit and probe controls at ${width}`,async({page,context})=>{
  3  |  test.setTimeout(90000);await context.grantPermissions(['clipboard-read','clipboard-write']);await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});await page.goto('/lessons/graphs-and-functions/46-data-plotter',{waitUntil:'domcontentloaded'});const lesson=page.locator('[data-dedicated-lesson="46"]');await lesson.waitFor({timeout:45000});const graph=lesson.locator('[data-lesson-graph-workspace]'),frame=graph.locator('[data-graph-family]'),svg=graph.locator('svg'),point=lesson.getByTestId('data-probe-46');
  4  |  const verify=async(x:number,y:number)=>{await expect(lesson).toHaveAttribute('data-primary',String(x));await expect(lesson).toHaveAttribute('data-secondary',String(y));await expect(point).toHaveAttribute('aria-label',`Probe (${x}, ${y}): (${x}, ${y})`);const p=await point.evaluate(e=>({x:Number(e.getAttribute('cx')),y:Number(e.getAttribute('cy'))}));const f=await frame.evaluate(e=>Object.fromEntries(['x-min','x-max','y-min','y-max','plot-left','plot-top','plot-width','plot-height'].map(k=>[k,Number(e.getAttribute('data-'+k))])));expect(p.x).toBeCloseTo(f['plot-left']+(x-f['x-min'])/(f['x-max']-f['x-min'])*f['plot-width'],4);expect(p.y).toBeCloseTo(f['plot-top']+(f['y-max']-y)/(f['y-max']-f['y-min'])*f['plot-height'],4);expect(Number(await lesson.getAttribute('data-residual'))).toBeCloseTo(y-(5.5*x+170/3),10);};
  5  |  const verifyFixed=async()=>{expect(Number(await lesson.getAttribute('data-correlation'))).toBeCloseTo(44/Math.sqrt(5824/3),10);for(const [id,x,y] of [['data-row-0-46',2,68],['data-row-1-46',4,78],['data-row-2-46',6,90]] as const){const p=graph.getByTestId(id);const values=await p.evaluate(e=>{const f=e.closest('[data-graph-family]')!,a=(k:string)=>Number(f.getAttribute('data-'+k));return {x:a('x-min')+(Number(e.getAttribute('cx'))-a('plot-left'))/a('plot-width')*(a('x-max')-a('x-min')),y:a('y-max')-(Number(e.getAttribute('cy'))-a('plot-top'))/a('plot-height')*(a('y-max')-a('y-min'))};});expect(values.x).toBeCloseTo(x,10);expect(values.y).toBeCloseTo(y,10);}};
  6  |  await verifyFixed();await verify(2,3);await expect(frame).toHaveAttribute('data-y-min','-10');await expect(frame).toHaveAttribute('data-y-max','100');await expect(graph).toContainText('extrapolates');await expect(frame).toHaveAttribute('data-x-min','-6');const names=['hours','score','Trace x'];
> 7  |  for(let i=0;i<3;i++){const s=lesson.getByRole('slider',{name:names[i],exact:true});await expect(s).toHaveAttribute('min','-5');await expect(s).toHaveAttribute('max','5');await expect(s).toHaveAttribute('step','0.5');await s.focus();await page.keyboard.press('Home');for(let n=-5;n<=5;n+=.5){await expect(s).toHaveValue(String(n));if(i===0)await verify(n,3);if(i===1)await verify(5,n);if(i===2){await expect(lesson).toHaveAttribute('data-trace',String(n));expect(await graph.getByTestId('data-trace-46').getAttribute('aria-label')).toContain(`Fit ${(5.5*n+170/3).toFixed(2)}:`);const actual=await graph.getByTestId('data-trace-46').evaluate(e=>{const f=e.closest('[data-graph-family]')!,a=(k:string)=>Number(f.getAttribute('data-'+k));return {x:a('x-min')+(Number(e.getAttribute('cx'))-a('plot-left'))/a('plot-width')*(a('x-max')-a('x-min')),y:a('y-max')-(Number(e.getAttribute('cy'))-a('plot-top'))/a('plot-height')*(a('y-max')-a('y-min'))};});expect(actual.x).toBeCloseTo(n,10);expect(actual.y).toBeCloseTo(5.5*n+170/3,10);}if(n<5)await page.keyboard.press('ArrowRight');}await expect(lesson.getByRole('button',{name:`Increase ${names[i]}`,exact:true})).toBeDisabled();await expect(s).toHaveValue('5');await lesson.getByRole('button',{name:`Decrease ${names[i]}`,exact:true}).click();await expect(s).toHaveValue('4.5');await s.focus();await page.keyboard.press('End');}
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         ^ Error: locator.evaluate: Target page, context or browser has been closed
  8  |  await expect(lesson.getByRole('cell',{name:'40.167',exact:true})).toBeVisible();await lesson.getByRole('button',{name:'Reset view',exact:true}).click();await verify(2,3);
  9  |  const world=async(selector:string)=>graph.locator(selector).evaluateAll(es=>es.map(e=>{const f=e.closest('[data-graph-family]')!,a=(k:string)=>Number(f.getAttribute('data-'+k));return e.getAttribute('points')!.split(' ').map(p=>{const [x,y]=p.split(',').map(Number);return {x:a('x-min')+(x-a('plot-left'))/a('plot-width')*(a('x-max')-a('x-min')),y:a('y-max')-(y-a('plot-top'))/a('plot-height')*(a('y-max')-a('y-min'))};});}));
  10 |  const [fit]=await world('[data-series-id="fit"] polyline');for(const p of fit)expect(p.y).toBeCloseTo(5.5*p.x+170/3,10);const residuals=await world('[data-series-id="residuals"] polyline');expect(residuals).toHaveLength(3);for(let i=0;i<3;i++){const [a,b]=residuals[i];expect(a.x).toBeCloseTo(2+2*i,10);expect(a.y).toBeCloseTo([68,78,90][i],10);expect(b.x).toBeCloseTo(a.x,10);expect(b.y).toBeCloseTo(5.5*a.x+170/3,10);}
  11 |  await point.focus();await page.keyboard.press('ArrowLeft');await verify(1.5,3);await page.keyboard.press('ArrowDown');await verify(1.5,2.5);
  12 |  const screen=async(x:number,y:number)=>{await svg.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));return svg.evaluate((e,p)=>{const s=e as SVGSVGElement,r=s.getBoundingClientRect(),v=s.viewBox.baseVal,f=s.closest('[data-graph-family]')!;const a=(k:string)=>Number(f.getAttribute('data-'+k));return {x:r.x+(a('plot-left')+(p.x-a('x-min'))/(a('x-max')-a('x-min'))*a('plot-width'))*r.width/v.width,y:r.y+(a('plot-top')+(a('y-max')-p.y)/(a('y-max')-a('y-min'))*a('plot-height'))*r.height/v.height};},{x,y});};
  13 |  let p=await screen(1.5,2.5),q=await screen(-2,-1);await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(q.x,q.y,{steps:4});await page.mouse.up();await verify(-2,-1);p=await screen(-2,-1);q=await screen(3,-2);const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[q]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await verify(3,-2);await verifyFixed();
  14 |  await lesson.getByRole('button',{name:'Toggle guides'}).click();await expect(lesson).toHaveAttribute('data-guides','false');await expect(graph.getByTestId('data-trace-46')).toHaveCount(0);await expect(point).toBeVisible();await expect(graph.locator('.lesson-cartesian-ticks text')).toHaveCount(2);await lesson.getByRole('button',{name:'Toggle guides'}).click();await expect(lesson).toHaveAttribute('data-guides','true');
  15 |  await lesson.getByRole('button',{name:'Move graph',exact:true}).click();await expect(svg).toBeFocused();await page.keyboard.press('ArrowRight');await expect(frame).not.toHaveAttribute('data-x-min','-6');await lesson.getByRole('button',{name:'Inspector',exact:true}).click();await expect(point).toBeFocused();await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();await lesson.getByRole('button',{name:'Fit',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min','-6');await expect(lesson).toHaveAttribute('data-trace','1.5');await verify(3,-2);await verifyFixed();
  16 |  await lesson.getByRole('button',{name:'Share',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('r = 0.9986; probe (3, -2), residual = -75.167; fit at 1.5 hours = 64.917');await lesson.getByRole('button',{name:'Reset view',exact:true}).click();await verify(2,3);await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();
  17 |  await expect(graph.locator('.lesson-graph-swatch[data-kind="point"]')).toHaveCount(1);const connectors=await graph.locator('.lesson-cartesian-label-leader').evaluateAll(es=>es.map(e=>{const c=e.parentElement!.querySelector('circle')!;return {x:Number(e.getAttribute('x1')),y:Number(e.getAttribute('y1')),cx:Number(c.getAttribute('cx')),cy:Number(c.getAttribute('cy'))};}));expect(connectors).toHaveLength(5);for(const p of connectors){expect(p.x).toBeCloseTo(p.cx,10);expect(p.y).toBeCloseTo(p.cy,10);}
  18 |  const boxes=await graph.locator('.lesson-cartesian-annotation').evaluateAll(es=>es.map(e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height};}));for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){const a=boxes[i],b=boxes[j];expect(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y).toBe(true);}for(const dark of [false,true]){await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);await page.screenshot({path:`test-evidence/shared-lesson-graphs/46/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});}expect(errors).toEqual([]);
  19 | });
  20 | 
  21 | 
  22 | 
```
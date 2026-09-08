# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lessons\parametricSharedGraph.e2e.ts >> Parametric Curves follow radii and parameter at 1440
- Location: tests\lessons\parametricSharedGraph.e2e.ts:2:63

# Error details

```
Test timeout of 90000ms exceeded.
```

```
TimeoutError: locator.waitFor: Timeout 45000ms exceeded.
Call log:
  - waiting for locator('[data-dedicated-lesson="43"]') to be visible

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
          - generic [ref=e9]:
            - paragraph [ref=e10]: Interactive Math Lab
            - paragraph [ref=e11]: Visual proofs, simulations, graphing, and practice
          - generic [ref=e12]:
            - button "Ctrl+K" [ref=e13] [cursor=pointer]
            - generic [ref=e18]:
              - generic [ref=e19]: "0"
              - generic [ref=e22]: 0 XP
            - button "Teacher mode" [ref=e26] [cursor=pointer]
            - button "Keyboard shortcuts" [ref=e29] [cursor=pointer]: Keyboard shortcuts (?)
            - button "Accessibility settings" [ref=e33] [cursor=pointer]
            - button "Toggle theme" [ref=e37] [cursor=pointer]: "Theme: Light"
      - main [ref=e40]:
        - generic [ref=e41]:
          - generic [ref=e42]:
            - button "Go back" [ref=e43] [cursor=pointer]
            - navigation "Breadcrumb" [ref=e46]:
              - link "Home" [ref=e47] [cursor=pointer]:
                - /url: /
              - generic [ref=e49]:
                - generic [ref=e50]: ">"
                - link "Lessons" [ref=e51] [cursor=pointer]:
                  - /url: /lessons
              - generic [ref=e53]:
                - generic [ref=e54]: ">"
                - link "Graphs And Functions" [ref=e55] [cursor=pointer]:
                  - /url: /lessons/graphs-and-functions
              - generic [ref=e57]:
                - generic [ref=e58]: ">"
                - generic [ref=e59]: 43 Parametric Curves
          - generic [ref=e60]:
            - generic [ref=e63]:
              - generic [ref=e64]:
                - heading "Parametric Curves" [level=1] [ref=e65]
                - generic [ref=e66]:
                  - generic [ref=e67]: Foundational–Advanced
                  - generic [ref=e71]: Graph Explorer
                  - generic [ref=e74]: Graphing Calculator
                  - generic [ref=e77]: 6-10 min
              - generic [ref=e81]:
                - generic "Load a lesson language pack on demand" [ref=e82]:
                  - combobox "Lesson language" [ref=e86]:
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
                - button "Reset" [ref=e87] [cursor=pointer]
                - button "Share" [ref=e91] [cursor=pointer]
                - link "Workspace" [ref=e98] [cursor=pointer]:
                  - /url: /workspace/graph
            - tablist "Lesson content tabs" [ref=e103]:
              - tab "Interaction + visualization" [selected] [ref=e104] [cursor=pointer]
              - tab "Learn" [ref=e108] [cursor=pointer]
              - tab "Examples" [ref=e111] [cursor=pointer]
              - tab "Formulas" [ref=e114] [cursor=pointer]
              - tab "Practice" [ref=e117] [cursor=pointer]
            - main [ref=e121]:
              - tabpanel "Lesson interaction and visualization" [ref=e122]:
                - generic [ref=e123]:
                  - generic [ref=e124]:
                    - complementary [ref=e125]:
                      - paragraph [ref=e126]: Motion path
                      - heading "t = 1.5" [level=3] [ref=e127]
                      - generic [ref=e128]:
                        - generic [ref=e129]:
                          - generic [ref=e130]: "1"
                          - generic [ref=e131]: Follow the parameter
                        - generic [ref=e132]:
                          - generic [ref=e133]: "2"
                          - generic [ref=e134]: Mark direction
                        - generic [ref=e135]:
                          - generic [ref=e136]: "3"
                          - generic [ref=e137]: Read x(t) and y(t)
                      - generic [ref=e138]: The parameter moves a point along the path.
                    - main [ref=e139]:
                      - generic [ref=e140]:
                        - generic [ref=e141]:
                          - heading "x = 2cos(t), y = 3sin(t)" [level=3] [ref=e142]
                          - paragraph [ref=e143]: t controls motion, not an axis
                        - generic [ref=e144]:
                          - button "Reset view" [ref=e145] [cursor=pointer]
                          - button "Fit" [ref=e149] [cursor=pointer]
                          - button "Share" [ref=e153] [cursor=pointer]
                          - button "Move graph" [ref=e160] [cursor=pointer]
                          - button "Toggle guides" [ref=e166] [cursor=pointer]
                          - button "Inspector" [ref=e169] [cursor=pointer]
                      - region [ref=e174]:
                        - generic [ref=e175]:
                          - generic [ref=e176]:
                            - heading "Parametric Curves" [level=3] [ref=e177]
                            - paragraph [ref=e178]: The parameter t is measured in radians and moves the point along the path.
                          - group "Graph view controls" [ref=e179]:
                            - button "Zoom graph in" [ref=e180] [cursor=pointer]:
                              - text: ＋
                              - generic [ref=e181]: Zoom in
                            - button "Zoom graph out" [ref=e182] [cursor=pointer]:
                              - text: −
                              - generic [ref=e183]: Zoom out
                            - button "Reset graph view" [ref=e184] [cursor=pointer]:
                              - text: ↺
                              - generic [ref=e185]: Reset view
                        - list "Graph legend" [ref=e186]:
                          - listitem [ref=e187]:
                            - generic [ref=e189]: Parametric path
                          - listitem [ref=e190]:
                            - generic [ref=e192]: Direction as t increases
                        - generic [ref=e194]:
                          - img "Parametric Curves" [ref=e195]:
                            - generic [ref=e198]:
                              - generic [ref=e199]: "-5"
                              - generic [ref=e200]: "0"
                              - generic [ref=e201]: "5"
                              - generic [ref=e202]: "-4"
                              - generic [ref=e203]: "-2"
                              - generic [ref=e204]: "0"
                              - generic [ref=e205]: "2"
                              - generic [ref=e206]: "4"
                              - generic [ref=e207]: x
                              - generic [ref=e208]: "y"
                            - generic [ref=e214]:
                              - 'button "t = 1.5: (0.1414744033354058, 2.9924849598121632)" [ref=e215] [cursor=pointer]'
                              - generic: t = 1.5
                          - paragraph [ref=e216]: Focus the graph and use arrow keys to pan, plus or minus to zoom, and zero to reset the view. Tab to a point to inspect its coordinates.
                        - generic [ref=e217]: "At t = 1.5: (x, y) = (0.141, 2.992); speed = 2.006."
                      - generic [ref=e218]:
                        - generic [ref=e219]:
                          - paragraph [ref=e220]: x(t)
                          - paragraph [ref=e221]: "0.141"
                        - generic [ref=e222]:
                          - paragraph [ref=e223]: y(t)
                          - paragraph [ref=e224]: "2.992"
                        - generic [ref=e225]:
                          - paragraph [ref=e226]: speed
                          - paragraph [ref=e227]: "2.006"
                    - complementary [ref=e228]:
                      - generic [ref=e229]:
                        - paragraph [ref=e230]: Parameter controls
                        - generic [ref=e231]:
                          - generic [ref=e232]:
                            - generic [ref=e233]:
                              - generic [ref=e234]: a radius
                              - generic [ref=e235]: "2"
                            - slider "a radius" [ref=e236]: "2"
                            - generic [ref=e237]:
                              - button "Decrease a radius" [ref=e238] [cursor=pointer]
                              - status [ref=e240]: "2"
                              - button "Increase a radius" [ref=e241] [cursor=pointer]
                          - generic [ref=e243]:
                            - generic [ref=e244]:
                              - generic [ref=e245]: b radius
                              - generic [ref=e246]: "3"
                            - slider "b radius" [ref=e247]: "3"
                            - generic [ref=e248]:
                              - button "Decrease b radius" [ref=e249] [cursor=pointer]
                              - status [ref=e251]: "3"
                              - button "Increase b radius" [ref=e252] [cursor=pointer]
                          - generic [ref=e254]:
                            - generic [ref=e255]:
                              - generic [ref=e256]: t
                              - generic [ref=e257]: "1.5"
                            - slider "t" [ref=e258]: "1.5"
                            - generic [ref=e259]:
                              - button "Decrease t" [ref=e260] [cursor=pointer]
                              - status [ref=e262]: "1.5"
                              - button "Increase t" [ref=e263] [cursor=pointer]
                      - generic [ref=e265]:
                        - paragraph [ref=e266]: t table
                        - table [ref=e268]:
                          - rowgroup [ref=e269]:
                            - row [ref=e270]:
                              - rowheader "t" [ref=e271]
                              - cell "0" [ref=e272]
                              - cell "(2.000, 0.000)" [ref=e273]
                            - row [ref=e274]:
                              - rowheader "t" [ref=e275]
                              - cell "pi/2" [ref=e276]
                              - cell "(0.000, 3.000)" [ref=e277]
                            - row [ref=e278]:
                              - rowheader "t" [ref=e279]
                              - cell "pi" [ref=e280]
                              - cell "(-2.000, 0.000)" [ref=e281]
                  - generic [ref=e282]:
                    - generic [ref=e283]:
                      - paragraph [ref=e284]: Sample values
                      - table [ref=e286]:
                        - rowgroup [ref=e287]:
                          - row [ref=e288]:
                            - columnheader "t" [ref=e289]
                            - columnheader "-3" [ref=e290]
                            - columnheader "-2" [ref=e291]
                            - columnheader "-1" [ref=e292]
                            - columnheader "0" [ref=e293]
                            - columnheader "1" [ref=e294]
                            - columnheader "1.5" [ref=e295]
                            - columnheader "2" [ref=e296]
                            - columnheader "3" [ref=e297]
                        - rowgroup [ref=e298]:
                          - row [ref=e299]:
                            - rowheader "Parametric Curves" [ref=e300]
                            - cell "(-1.980, -0.423)" [ref=e301]
                            - cell "(-0.832, -2.728)" [ref=e302]
                            - cell "(1.081, -2.524)" [ref=e303]
                            - cell "(2.000, 0.000)" [ref=e304]
                            - cell "(1.081, 2.524)" [ref=e305]
                            - cell "(0.141, 2.992)" [ref=e306]
                            - cell "(-0.832, 2.728)" [ref=e307]
                            - cell "(-1.980, 0.423)" [ref=e308]
                    - generic [ref=e309]:
                      - strong [ref=e310]: The parameter controls motion along the path; it is not a graph axis.
                      - text: t = 1.5; (x, y) = (0.141, 2.992); speed = 2.006
            - navigation "Adjacent lessons" [ref=e311]:
              - link "Previous Inequality Grapher" [ref=e312] [cursor=pointer]:
                - /url: /lessons/graphs-and-functions/42-inequality-grapher
                - generic [ref=e315]:
                  - generic [ref=e316]: Previous
                  - generic [ref=e317]: Inequality Grapher
              - link "Next Polar Graphs" [ref=e318] [cursor=pointer]:
                - /url: /lessons/graphs-and-functions/44-polar-graphs
                - generic [ref=e319]:
                  - generic [ref=e320]: Next
                  - generic [ref=e321]: Polar Graphs
      - contentinfo "Site footer" [ref=e324]:
        - generic [ref=e325]:
          - paragraph [ref=e326]: © 2026 Indian Servers Private Limited · Math Universe · www.IndianServers.com · info@IndianServers.com
          - navigation "Footer links" [ref=e327]:
            - link "Sitemap" [ref=e328] [cursor=pointer]:
              - /url: /sitemap
            - generic [ref=e329]: ·
            - link "Docs" [ref=e330] [cursor=pointer]:
              - /url: /documentation
            - generic [ref=e331]: ·
            - link "About" [ref=e332] [cursor=pointer]:
              - /url: /about
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | for(const [width,height] of [[1440,900],[768,1024],[390,844]])test(`Parametric Curves follow radii and parameter at ${width}`,async({page,context})=>{
> 3  |  test.setTimeout(90000);await context.grantPermissions(['clipboard-read','clipboard-write']);await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});await page.goto('/lessons/graphs-and-functions/43-parametric-curves',{waitUntil:'domcontentloaded'});const lesson=page.locator('[data-dedicated-lesson="43"]');await lesson.waitFor({timeout:45000});const graph=lesson.locator('[data-lesson-graph-workspace]'),frame=graph.locator('[data-graph-family]'),svg=graph.locator('svg');
     |                                                                                                                                                                                                                                                                                                                                                                                                                                                                  ^ TimeoutError: locator.waitFor: Timeout 45000ms exceeded.
  4  |  const world=async(selector:string)=>graph.locator(selector).evaluate(e=>{const f=e.closest('[data-graph-family]')!,a=(k:string)=>Number(f.getAttribute('data-'+k));const pixels=e.tagName==='circle'?[[Number(e.getAttribute('cx')),Number(e.getAttribute('cy'))]]:e.getAttribute('points')!.split(' ').map(p=>p.split(',').map(Number));return pixels.map(([px,py])=>({x:a('x-min')+(px-a('plot-left'))/a('plot-width')*(a('x-max')-a('x-min')),y:a('y-max')-(py-a('plot-top'))/a('plot-height')*(a('y-max')-a('y-min'))}));});
  5  |  const verify=async(a:number,b:number,t:number)=>{await expect(lesson).toHaveAttribute('data-primary',String(a));await expect(lesson).toHaveAttribute('data-secondary',String(b));await expect(lesson).toHaveAttribute('data-trace',String(t));const [p]=await world('[data-testid="parametric-position-43"]');expect(p.x).toBeCloseTo(a*Math.cos(t),10);expect(p.y).toBeCloseTo(b*Math.sin(t),10);const speed=Math.hypot(a*Math.sin(t),b*Math.cos(t));expect(Number(await lesson.getAttribute('data-speed'))).toBeCloseTo(speed,10);await expect(graph.locator('[data-series-id="direction"]')).toHaveCount(speed>1e-10?1:0);if(speed>1e-10){const [start,end]=await world('[data-series-id="direction"] polyline');expect((end.x-start.x)/.65).toBeCloseTo(-a*Math.sin(t)/speed,10);expect((end.y-start.y)/.65).toBeCloseTo(b*Math.cos(t)/speed,10);}};
  6  |  const verifyPath=async(a:number,b:number)=>{const points=await world('[data-series-id="path"] polyline');expect(points).toHaveLength(361);for(let i=0;i<points.length;i++){expect(points[i].x).toBeCloseTo(a*Math.cos(i*Math.PI/180),10);expect(points[i].y).toBeCloseTo(b*Math.sin(i*Math.PI/180),10);}};
  7  |  await verify(2,3,1.5);await verifyPath(2,3);await expect(frame).toHaveAttribute('data-x-min','-5');const names=['a radius','b radius','t'];
  8  |  for(let i=0;i<3;i++){const s=lesson.getByRole('slider',{name:names[i],exact:true});await expect(s).toHaveAttribute('min','-5');await expect(s).toHaveAttribute('max','5');await expect(s).toHaveAttribute('step','0.5');await s.focus();await page.keyboard.press('Home');for(let n=-5;n<=5;n+=.5){await verify(i===0?n:5,i===1?n:i===0?3:5,i===2?n:1.5);if(n<5)await page.keyboard.press('ArrowRight');}await expect(lesson.getByRole('button',{name:`Increase ${names[i]}`,exact:true})).toBeDisabled();await expect(s).toHaveValue('5');await lesson.getByRole('button',{name:`Decrease ${names[i]}`,exact:true}).click();await expect(s).toHaveValue('4.5');await s.focus();await page.keyboard.press('End');}
  9  |  const set=async(name:string,value:number)=>{const s=lesson.getByRole('slider',{name,exact:true});await s.focus();await page.keyboard.press('Home');for(let n=-5;n<value;n+=.5)await page.keyboard.press('ArrowRight');};
  10 |  for(const [a,b] of [[-3,2],[0,3],[3,0],[0,0]]){await set('a radius',a);await set('b radius',b);await verify(a,b,5);await verifyPath(a,b);}await expect(graph).toContainText('path is one point');await lesson.getByRole('button',{name:'Reset view',exact:true}).click();await verify(2,3,1.5);
  11 |  await lesson.getByRole('button',{name:'Inspector',exact:true}).click();await expect(graph.getByTestId('parametric-position-43')).toBeFocused();await page.keyboard.press('Enter');await expect(graph.locator('.lesson-graph-tooltip')).toContainText('t = 1.5');await lesson.getByRole('button',{name:'Toggle guides'}).click();await expect(graph.getByTestId('parametric-position-43')).toHaveCount(0);await expect(graph.locator('[data-series-id="direction"]')).toHaveCount(0);await lesson.getByRole('button',{name:'Toggle guides'}).click();await verify(2,3,1.5);
  12 |  await svg.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const rect=await svg.boundingBox();if(!rect)throw Error('Missing graph');const start={x:rect.x+rect.width*.3,y:rect.y+rect.height*.8};await page.mouse.move(start.x,start.y);await page.mouse.down();await page.mouse.move(start.x+35,start.y+15,{steps:4});await page.mouse.up();await expect(frame).not.toHaveAttribute('data-x-min','-5');await verify(2,3,1.5);await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();await svg.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));const r=await svg.boundingBox();if(!r)throw Error('Missing graph');const p={x:r.x+r.width*.3,y:r.y+r.height*.8},q={x:p.x+30,y:p.y-15};const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[q]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(frame).not.toHaveAttribute('data-x-min','-5');await lesson.getByRole('button',{name:'Move graph',exact:true}).click();await expect(svg).toBeFocused();await page.keyboard.press('ArrowRight');await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();await lesson.getByRole('button',{name:'Fit',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min','-5');await verify(2,3,1.5);await lesson.getByRole('button',{name:'Share',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('t = 1.5; (x, y) = (0.141, 2.992); speed = 2.006');await expect(lesson.getByRole('cell',{name:'(0.000, 3.000)',exact:true})).toBeVisible();await expect(lesson.getByRole('cell',{name:'(-2.000, 0.000)',exact:true})).toBeVisible();
  13 |  for(const dark of [false,true]){await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);await page.screenshot({path:`test-evidence/shared-lesson-graphs/43/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});}expect(errors).toEqual([]);
  14 | });
  15 | 
```
# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lessons\equationGrapherSharedGraph.e2e.ts >> Equation Grapher checks ellipse membership at 768
- Location: tests\lessons\equationGrapherSharedGraph.e2e.ts:2:63

# Error details

```
Test timeout of 90000ms exceeded.
```

```
Error: expect(locator).toHaveAttribute(expected) failed

Locator:  locator('[data-dedicated-lesson="41"]').locator('[data-lesson-graph-workspace]').getByTestId('equation-test-41')
Expected: "Test (0, -2): (0, -2)"
Received: ""

Call log:
  - Expect "toHaveAttribute" with timeout 10000ms
  - waiting for locator('[data-dedicated-lesson="41"]').locator('[data-lesson-graph-workspace]').getByTestId('equation-test-41')
  - Protocol error (Runtime.callFunctionOn): Internal server error, session closed.

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
                - generic [ref=e59]: 41 Equation Grapher
          - generic [ref=e60]:
            - generic [ref=e63]:
              - heading "Equation Grapher" [level=1] [ref=e65]
              - generic [ref=e66]:
                - generic "Load a lesson language pack on demand" [ref=e67]:
                  - combobox "Lesson language" [ref=e71]:
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
                - button "Reset" [ref=e72] [cursor=pointer]
                - button "Share" [ref=e76] [cursor=pointer]
                - link "Workspace" [ref=e83] [cursor=pointer]:
                  - /url: /workspace/graph
            - tablist "Lesson content tabs" [ref=e88]:
              - tab "Interaction + visualization" [selected] [ref=e89] [cursor=pointer]
              - tab "Learn" [ref=e93] [cursor=pointer]
              - tab "Examples" [ref=e96] [cursor=pointer]
              - tab "Formulas" [ref=e99] [cursor=pointer]
              - tab "Practice" [ref=e102] [cursor=pointer]
            - main [ref=e106]:
              - tabpanel "Lesson interaction and visualization" [ref=e107]:
                - generic [ref=e108]:
                  - generic [ref=e109]:
                    - complementary [ref=e110]:
                      - paragraph [ref=e111]: Check points
                      - heading "Solution set" [level=3] [ref=e112]
                      - generic [ref=e113]:
                        - generic [ref=e114]:
                          - generic [ref=e115]: "1"
                          - generic [ref=e116]: Substitute x and y
                        - generic [ref=e117]:
                          - generic [ref=e118]: "2"
                          - generic [ref=e119]: True points stay on curve
                        - generic [ref=e120]:
                          - generic [ref=e121]: "3"
                          - generic [ref=e122]: False points miss the graph
                      - generic [ref=e123]: An equation graph is a set of all points that satisfy the rule.
                    - main [ref=e124]:
                      - generic [ref=e125]:
                        - generic [ref=e126]:
                          - heading "x^2/9 + y^2/4 = 1" [level=3] [ref=e127]
                          - paragraph [ref=e128]: Every point on the curve makes the equation true
                        - generic [ref=e129]:
                          - button "Reset view" [ref=e130] [cursor=pointer]
                          - button "Fit" [ref=e134] [cursor=pointer]
                          - button "Share" [ref=e138] [cursor=pointer]
                          - button "Move graph" [ref=e145] [cursor=pointer]
                          - button "Toggle guides" [ref=e151] [cursor=pointer]
                          - button "Inspector" [ref=e154] [cursor=pointer]
                      - region [ref=e159]:
                        - generic [ref=e160]:
                          - generic [ref=e161]:
                            - heading "Equation Grapher" [level=3] [ref=e162]
                            - paragraph [ref=e163]: Test a point by substitution. The ellipse contains every solution of the equation.
                          - group "Graph view controls" [ref=e164]:
                            - button "Zoom graph in" [ref=e165] [cursor=pointer]:
                              - text: ＋
                              - generic [ref=e166]: Zoom in
                            - button "Zoom graph out" [ref=e167] [cursor=pointer]:
                              - text: −
                              - generic [ref=e168]: Zoom out
                            - button "Reset graph view" [ref=e169] [cursor=pointer]:
                              - text: ↺
                              - generic [ref=e170]: Reset view
                        - list "Graph legend" [ref=e171]:
                          - listitem [ref=e172]:
                            - generic [ref=e174]: x²/9 + y²/4 = 1
                          - listitem [ref=e175]:
                            - generic [ref=e177]: Trace x = 1.5
                        - generic [ref=e179]:
                          - img "Equation Grapher" [ref=e180]:
                            - generic [ref=e183]:
                              - generic [ref=e184]: "-5"
                              - generic [ref=e185]: "0"
                              - generic [ref=e186]: "5"
                              - generic [ref=e187]: "-4"
                              - generic [ref=e188]: "-2"
                              - generic [ref=e189]: "0"
                              - generic [ref=e190]: "2"
                              - generic [ref=e191]: "4"
                              - generic [ref=e192]: x
                              - generic [ref=e193]: "y"
                            - generic [ref=e197]:
                              - 'button "(1.5, 1.732): (1.5, 1.7320508075688772)" [ref=e198] [cursor=pointer]'
                              - generic: (1.5, 1.732)
                            - generic [ref=e199]:
                              - 'button "(1.5, -1.732): (1.5, -1.7320508075688772)" [ref=e200] [cursor=pointer]'
                              - generic: (1.5, -1.732)
                            - generic [ref=e201]:
                              - 'button "Test (5, 1.5): (5, 1.5)" [ref=e202] [cursor=pointer]'
                              - generic: Test (5, 1.5)
                          - paragraph [ref=e203]: Focus the graph and use arrow keys to pan, plus or minus to zoom, and zero to reset the view. Tab to a point to inspect its coordinates.
                        - generic [ref=e204]: At (5, 1.5), x²/9 + y²/4 = 3.340. The point does not satisfy the equation.
                      - generic [ref=e205]:
                        - generic [ref=e206]:
                          - paragraph [ref=e207]: Status
                          - paragraph [ref=e208]: does not satisfy
                        - generic [ref=e209]:
                          - paragraph [ref=e210]: Curve
                          - paragraph [ref=e211]: ellipse
                        - generic [ref=e212]:
                          - paragraph [ref=e213]: Mode
                          - paragraph [ref=e214]: implicit
                    - complementary [ref=e215]:
                      - generic [ref=e216]:
                        - paragraph [ref=e217]: Equation tools
                        - generic [ref=e218]:
                          - generic [ref=e219]:
                            - generic [ref=e220]:
                              - generic [ref=e221]: Test x
                              - generic [ref=e222]: "5"
                            - slider "Test x" [ref=e223]: "5"
                            - generic [ref=e224]:
                              - button "Decrease Test x" [ref=e225] [cursor=pointer]
                              - status [ref=e227]: "5"
                              - button "Increase Test x" [disabled] [ref=e228]
                          - generic [ref=e230]:
                            - generic [ref=e231]:
                              - generic [ref=e232]: Test y
                              - generic [ref=e233]: "1.5"
                            - slider "Test y" [active] [ref=e234]: "1.5"
                            - generic [ref=e235]:
                              - button "Decrease Test y" [ref=e236] [cursor=pointer]
                              - status [ref=e238]: "1.5"
                              - button "Increase Test y" [ref=e239] [cursor=pointer]
                          - generic [ref=e241]:
                            - generic [ref=e242]:
                              - generic [ref=e243]: Trace x
                              - generic [ref=e244]: "1.5"
                            - slider "Trace x" [ref=e245]: "1.5"
                            - generic [ref=e246]:
                              - button "Decrease Trace x" [ref=e247] [cursor=pointer]
                              - status [ref=e249]: "1.5"
                              - button "Increase Trace x" [ref=e250] [cursor=pointer]
                      - generic [ref=e252]:
                        - paragraph [ref=e253]: Substitution check
                        - table [ref=e255]:
                          - rowgroup [ref=e256]:
                            - row [ref=e257]:
                              - rowheader "Point" [ref=e258]
                              - cell "(2,1)" [ref=e259]
                              - cell "false" [ref=e260]
                            - row [ref=e261]:
                              - rowheader "Point" [ref=e262]
                              - cell "(4,1)" [ref=e263]
                              - cell "false" [ref=e264]
                            - row [ref=e265]:
                              - rowheader "Rule" [ref=e266]
                              - cell "all solutions" [ref=e267]
                              - cell "set" [ref=e268]
                  - generic [ref=e269]:
                    - generic [ref=e270]:
                      - paragraph [ref=e271]: Sample values
                      - table [ref=e273]:
                        - rowgroup [ref=e274]:
                          - row [ref=e275]:
                            - columnheader "x" [ref=e276]
                            - columnheader "-3" [ref=e277]
                            - columnheader "-2" [ref=e278]
                            - columnheader "-1" [ref=e279]
                            - columnheader "0" [ref=e280]
                            - columnheader "1" [ref=e281]
                            - columnheader "1.5" [ref=e282]
                            - columnheader "2" [ref=e283]
                            - columnheader "3" [ref=e284]
                        - rowgroup [ref=e285]:
                          - row [ref=e286]:
                            - rowheader "Equation Grapher" [ref=e287]
                            - cell "0" [ref=e288]
                            - cell "±1.491" [ref=e289]
                            - cell "±1.886" [ref=e290]
                            - cell "±2.000" [ref=e291]
                            - cell "±1.886" [ref=e292]
                            - cell "±1.732" [ref=e293]
                            - cell "±1.491" [ref=e294]
                            - cell "0" [ref=e295]
                    - generic [ref=e296]:
                      - strong [ref=e297]: Implicit equations are solution sets, not always y as a function of x.
                      - text: "Test (5, 1.5): left side = 3.340; does not satisfy"
            - navigation "Adjacent lessons" [ref=e298]:
              - link "Previous Function Plotter" [ref=e299] [cursor=pointer]:
                - /url: /lessons/graphs-and-functions/40-function-plotter
                - generic [ref=e302]:
                  - generic [ref=e303]: Previous
                  - generic [ref=e304]: Function Plotter
              - link "Next Inequality Grapher" [ref=e305] [cursor=pointer]:
                - /url: /lessons/graphs-and-functions/42-inequality-grapher
                - generic [ref=e306]:
                  - generic [ref=e307]: Next
                  - generic [ref=e308]: Inequality Grapher
      - contentinfo "Site footer" [ref=e311]:
        - generic [ref=e312]:
          - paragraph [ref=e313]: © 2026 Indian Servers Private Limited · Math Universe · www.IndianServers.com · info@IndianServers.com
          - navigation "Footer links" [ref=e314]:
            - link "Sitemap" [ref=e315] [cursor=pointer]:
              - /url: /sitemap
            - generic [ref=e316]: ·
            - link "Docs" [ref=e317] [cursor=pointer]:
              - /url: /documentation
            - generic [ref=e318]: ·
            - link "About" [ref=e319] [cursor=pointer]:
              - /url: /about
    - navigation "Mobile learning shortcuts" [ref=e320]:
      - generic [ref=e321]:
        - link "Home" [ref=e322] [cursor=pointer]:
          - /url: /
        - link "Workspace" [ref=e326] [cursor=pointer]:
          - /url: /workspace
        - link "Shapes" [ref=e329] [cursor=pointer]:
          - /url: /shapes
        - link "AR" [ref=e334] [cursor=pointer]:
          - /url: /modules/ar-math-lab
        - link "3 Learn" [ref=e340] [cursor=pointer]:
          - /url: /learn
          - generic [ref=e341]: "3"
          - text: Learn
        - link "Calc" [ref=e344] [cursor=pointer]:
          - /url: /calculator
    - button "Back to top" [ref=e347] [cursor=pointer]
```

# Test source

```ts
  1  | import {test,expect} from '@playwright/test';
  2  | for(const [width,height] of [[1440,900],[768,1024],[390,844]])test(`Equation Grapher checks ellipse membership at ${width}`,async({page,context})=>{
  3  |  test.setTimeout(90000);await context.grantPermissions(['clipboard-read','clipboard-write']);await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});await page.goto('/lessons/graphs-and-functions/41-equation-grapher',{waitUntil:'domcontentloaded'});const lesson=page.locator('[data-dedicated-lesson="41"]');await lesson.waitFor({timeout:45000});const graph=lesson.locator('[data-lesson-graph-workspace]'),frame=graph.locator('[data-graph-family]'),svg=graph.locator('svg'),point=graph.getByTestId('equation-test-41');
> 4  |  const verify=async(x:number,y:number)=>{await expect(lesson).toHaveAttribute('data-primary',String(x));await expect(lesson).toHaveAttribute('data-secondary',String(y));expect(Number(await lesson.getAttribute('data-lhs'))).toBeCloseTo(x*x/9+y*y/4,12);await expect(lesson).toHaveAttribute('data-satisfies',String(Math.abs(x*x/9+y*y/4-1)<1e-9));await expect(point).toHaveAttribute('aria-label',`Test (${x}, ${y}): (${x}, ${y})`);};
     |                                                                                                                                                                                                                                                                                                                                                                            ^ Error: expect(locator).toHaveAttribute(expected) failed
  5  |  const worldPoints=async(selector:string)=>graph.locator(selector).evaluate(e=>{const f=e.closest('[data-graph-family]')!,a=(k:string)=>Number(f.getAttribute('data-'+k));const pixels=e.tagName==='circle'?[[Number(e.getAttribute('cx')),Number(e.getAttribute('cy'))]]:e.getAttribute('points')!.split(' ').map(p=>p.split(',').map(Number));return pixels.map(([px,py])=>({x:a('x-min')+(px-a('plot-left'))/a('plot-width')*(a('x-max')-a('x-min')),y:a('y-max')-(py-a('plot-top'))/a('plot-height')*(a('y-max')-a('y-min'))}));});
  6  |  await verify(2,3);await expect(frame).toHaveAttribute('data-x-min','-5');const ellipse=await worldPoints('[data-series-id="ellipse"] polyline');expect(ellipse).toHaveLength(361);for(const p of ellipse)expect(p.x*p.x/9+p.y*p.y/4).toBeCloseTo(1,10);expect(Math.max(...ellipse.map(p=>p.x))).toBeCloseTo(3,10);expect(Math.max(...ellipse.map(p=>p.y))).toBeCloseTo(2,10);
  7  |  for(let i=0;i<2;i++){const s=lesson.getByRole('slider',{name:i?'Test y':'Test x',exact:true});await expect(s).toHaveAttribute('min','-5');await expect(s).toHaveAttribute('max','5');await expect(s).toHaveAttribute('step','0.5');await s.focus();await page.keyboard.press('Home');for(let n=-5;n<=5;n+=.5){await verify(i?5:n,i?n:3);if(n<5)await page.keyboard.press('ArrowRight');}await expect(lesson.getByRole('button',{name:`Increase ${i?'Test y':'Test x'}`,exact:true})).toBeDisabled();await expect(s).toHaveValue('5');await lesson.getByRole('button',{name:`Decrease ${i?'Test y':'Test x'}`,exact:true}).click();await expect(s).toHaveValue('4.5');await s.focus();await page.keyboard.press('End');}
  8  |  const trace=lesson.getByRole('slider',{name:'Trace x',exact:true});await trace.focus();await page.keyboard.press('Home');for(let x=-5;x<=5;x+=.5){await expect(lesson).toHaveAttribute('data-trace',String(x));const count=Math.abs(x)>3?0:Math.abs(x)===3?1:2;await expect(graph.locator('[data-testid^="equation-trace-"]')).toHaveCount(count);for(let i=0;i<count;i++){const [p]=await worldPoints(`[data-testid="equation-trace-${i}-41"]`);expect(p.x).toBeCloseTo(x,10);expect(p.x*p.x/9+p.y*p.y/4).toBeCloseTo(1,10);}if(x<5)await page.keyboard.press('ArrowRight');}await expect(lesson.getByRole('button',{name:'Increase Trace x',exact:true})).toBeDisabled();await expect(trace).toHaveValue('5');await lesson.getByRole('button',{name:'Decrease Trace x',exact:true}).click();await expect(trace).toHaveValue('4.5');await expect(graph).toContainText('No real points');await lesson.getByRole('button',{name:'Reset view',exact:true}).click();await verify(2,3);
  9  |  const set=async(name:string,value:number)=>{const s=lesson.getByRole('slider',{name,exact:true});await s.focus();await page.keyboard.press('Home');for(let n=-5;n<value;n+=.5)await page.keyboard.press('ArrowRight');};
  10 |  for(const [x,y] of [[3,0],[-3,0],[0,2],[0,-2],[2,1],[4,1]]){await set('Test x',x);await set('Test y',y);await verify(x,y);}
  11 |  await lesson.getByRole('button',{name:'Inspector',exact:true}).click();await expect(point).toBeFocused();await page.keyboard.press('ArrowLeft');await verify(3.5,1);
  12 |  const screen=async(x:number,y:number)=>{await svg.evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));return svg.evaluate((e,p)=>{const s=e as SVGSVGElement,r=s.getBoundingClientRect(),v=s.viewBox.baseVal,f=s.closest('[data-graph-family]')!;const a=(k:string)=>Number(f.getAttribute('data-'+k));return {x:r.x+(a('plot-left')+(p.x-a('x-min'))/(a('x-max')-a('x-min'))*a('plot-width'))*r.width/v.width,y:r.y+(a('plot-top')+(a('y-max')-p.y)/(a('y-max')-a('y-min'))*a('plot-height'))*r.height/v.height};},{x,y});};
  13 |  let p=await screen(3.5,1),q=await screen(0,2);await page.mouse.move(p.x,p.y);await page.mouse.down();await page.mouse.move(q.x,q.y,{steps:4});await page.mouse.up();await verify(0,2);p=await screen(0,2);q=await screen(-3,0);const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[p]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[q]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await verify(-3,0);
  14 |  await lesson.getByRole('button',{name:'Toggle guides'}).click();await expect(graph.locator('[data-testid^="equation-trace-"]')).toHaveCount(0);await expect(point).toHaveCount(1);await lesson.getByRole('button',{name:'Toggle guides'}).click();await lesson.getByRole('button',{name:'Move graph',exact:true}).click();await expect(svg).toBeFocused();await page.keyboard.press('ArrowRight');await expect(frame).not.toHaveAttribute('data-x-min','-5');await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();await lesson.getByRole('button',{name:'Fit',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min','-5');await expect(lesson).toHaveAttribute('data-trace','1.5');await verify(-3,0);await lesson.getByRole('button',{name:'Share',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('Test (-3, 0): x²/9 + y²/4 = 1.000; satisfies');await lesson.getByRole('button',{name:'Reset view',exact:true}).click();await verify(2,3);await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();await expect(lesson.getByRole('cell',{name:'false',exact:true})).toHaveCount(2);await expect(lesson.getByRole('cell',{name:'±1.732',exact:true})).toHaveCount(1);
  15 |  for(const dark of [false,true]){await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);expect(await graph.locator('.lesson-graph-heading p').evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);await page.screenshot({path:`test-evidence/shared-lesson-graphs/41/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});}expect(errors).toEqual([]);
  16 | });
  17 | 
```
import {test,expect} from '@playwright/test';
for(const [width,height] of [[1440,900],[768,1024],[390,844]])test(`redefinition preserves identity and dependent plots at ${width}`,async({page})=>{
 test.setTimeout(90000);page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(45000);await page.setViewportSize({width,height});
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
 await page.goto('/lessons/core-workspaces/29-object-redefinition',{waitUntil:'domcontentloaded'});const lesson=page.locator('[data-dedicated-lesson="29"]');await lesson.waitFor({timeout:45000});
 const draft=lesson.getByRole('textbox',{name:'New object definition'}),name=lesson.getByRole('textbox',{name:'Object name'}),before=lesson.locator('.shared-rule-graph.before'),after=lesson.locator('.shared-rule-graph.after');
 const check=async(graph:typeof before,fn:(x:number)=>number)=>{
   const segments=await graph.locator('[data-series-id="function"] polyline').evaluateAll(elements=>elements.map(e=>{const svg=(e as SVGPolylineElement).ownerSVGElement!,v=svg.viewBox.baseVal,f=svg.closest('[data-graph-family]')!,xmin=Number(f.getAttribute('data-x-min')),xmax=Number(f.getAttribute('data-x-max')),ymin=Number(f.getAttribute('data-y-min')),ymax=Number(f.getAttribute('data-y-max'));return [...(e as SVGPolylineElement).points].map(p=>({x:xmin+(p.x-48)/(v.width-72)*(xmax-xmin),y:ymax-(p.y-24)/(v.height-64)*(ymax-ymin)}));}));
   expect(segments.flat().length).toBeGreaterThanOrEqual(80);for(const p of segments.flat())expect(p.y).toBeCloseTo(fn(p.x),3);
 };
 await expect(lesson).toHaveAttribute('data-name','f');await expect(lesson).toHaveAttribute('data-revision','1');await expect(lesson).toHaveAttribute('data-a','3');await expect(lesson).toHaveAttribute('data-b','-1');await check(before,x=>x+1);await check(after,x=>x*x-1);
 await name.fill('g!');await expect(name).toHaveValue('g');await expect(lesson.locator('.lesson-dependency-tree')).toHaveCount(2);await expect(lesson.locator('.lesson-dependency-tree').first()).toContainText('g');
 await draft.fill('2*x + 0.5');await expect(lesson).toHaveAttribute('data-rule','x^2 - 1');await check(after,x=>x*x-1);await lesson.getByRole('button',{name:'Redefine g',exact:true}).click();await expect(lesson).toHaveAttribute('data-revision','2');await expect(lesson).toHaveAttribute('data-a','4.50');await expect(lesson).toHaveAttribute('data-b','0.50');await check(before,x=>x*x-1);await check(after,x=>2*x+.5);
 await expect(lesson.locator('.dependent-table')).toContainText('A = f(2) = 4.50');await expect(lesson.locator('.updated-card')).toContainText('B = f(0) = 0.50');
 await draft.fill('1/x');await lesson.getByRole('button',{name:'Redefine g',exact:true}).click();await expect(lesson).toHaveAttribute('data-a','0.50');await expect(lesson).toHaveAttribute('data-b','undefined');await expect(after.locator('[data-series-id="function"] polyline')).toHaveCount(2);await check(after,x=>1/x);
 await expect(after.locator('[data-series-id="guide-B"]')).toHaveCount(0);
 for(const invalid of ['x+(', 'x@2', '']){await draft.fill(invalid);await expect(lesson).toHaveAttribute('data-valid','false');await expect(lesson.getByRole('button',{name:'Redefine g',exact:true})).toBeDisabled();await expect(lesson).toHaveAttribute('data-rule','1/x');}
 await draft.fill('x+1');await lesson.getByRole('button',{name:'Clear object definition'}).click();await expect(draft).toHaveValue('');
 await draft.fill('x^2 - 1');await lesson.getByRole('button',{name:'Redefine g',exact:true}).click();await check(after,x=>x*x-1);
 for(const graph of [before,after]){const frame=graph.locator('[data-graph-family]'),original=await frame.getAttribute('data-x-min');await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await expect(frame).not.toHaveAttribute('data-x-min',original!);await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();expect(Number(await frame.getAttribute('data-x-min'))).toBeCloseTo(Number(original));await graph.locator('svg').focus();await page.keyboard.press('ArrowRight');await expect(frame).not.toHaveAttribute('data-x-min',original!);await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min',original!);}
 for(const text of ['View as table','Sitemap','Docs','About']){const actions=Number(await lesson.getAttribute('data-actions'));await lesson.getByRole('button',{name:text,exact:true}).click();await expect(lesson).toHaveAttribute('data-actions',String(actions+1));}
 await page.reload({waitUntil:'domcontentloaded'});await lesson.waitFor();await expect(lesson).toHaveAttribute('data-revision','1');await expect(name).toHaveValue('f');await check(before,x=>x+1);await check(after,x=>x*x-1);
 expect(await lesson.locator('.dependent-row').first().evaluate(e=>e.getBoundingClientRect().width)).toBeGreaterThanOrEqual(599);
 for(const dark of [false,true]){await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);await page.screenshot({path:`test-evidence/shared-lesson-graphs/29/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});}
 expect(errors).toEqual([]);
});


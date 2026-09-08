import {test,expect} from '@playwright/test';
for(const [width,height] of [[1440,900],[768,1024],[390,844]])test(`inequality regions and boundaries are correct at ${width}`,async({page,context})=>{
 test.setTimeout(90000);page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(45000);await context.grantPermissions(['clipboard-read','clipboard-write']);await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
 await page.goto('/lessons/core-workspaces/31-inequality-input',{waitUntil:'domcontentloaded'});const lesson=page.locator('[data-dedicated-lesson="31"]');await lesson.waitFor({timeout:45000});const input=lesson.getByRole('textbox',{name:'Inequality input'}),graph=lesson.locator('.comparison-panel [data-lesson-graph-workspace]'),frame=graph.locator('[data-graph-family]'),line=lesson.locator('[data-graph-family="number-line"]');
 const verify=async(operator:string,boundary:number)=>{
  const included=operator.includes('=');await expect(lesson).toHaveAttribute('data-solution-operator',operator);await expect(lesson).toHaveAttribute('data-boundary',Number.isInteger(boundary)?String(boundary):boundary.toFixed(2));await expect(lesson).toHaveAttribute('data-inclusive',String(included));
  const min=Number(await line.getAttribute('data-min')),max=Number(await line.getAttribute('data-max'));
  await expect(line.locator('.lesson-number-boundary')).toHaveCount(boundary>=min&&boundary<=max?1:0);if(boundary>=min&&boundary<=max)await expect(line.locator('.lesson-number-boundary')).toHaveAttribute('data-included',String(included));
  const start=operator.startsWith('<')?min:Math.max(min,boundary),end=operator.startsWith('<')?Math.min(max,boundary):max;
  await expect(line.locator('[data-region]')).toHaveCount(operator!=='='&&end>start?1:0);
  if(operator!=='='&&end>start){expect(Number(await line.locator('[data-region]').getAttribute('data-start'))).toBeCloseTo(start);expect(Number(await line.locator('[data-region]').getAttribute('data-end'))).toBeCloseTo(end);}
  await expect(graph.locator('[data-series-id="solution-region"]')).toHaveCount(operator==='='?0:((operator.startsWith('<')?boundary>Number(await frame.getAttribute('data-x-min')):boundary<Number(await frame.getAttribute('data-x-max')))?1:0));
  const circle=graph.locator('circle[role="button"]');if(await circle.count())await expect(circle).toHaveAttribute('data-included',String(included));
  const expected=operator==='<'?[true,false,false]:operator==='<='?[true,true,false]:operator==='>'?[false,false,true]:operator==='>='?[false,true,true]:[false,true,false];
  for(let i=0;i<3;i++)await expect(lesson.locator('.test-points article').nth(i).locator('strong')).toHaveText(expected[i]?'TRUE':'FALSE');
 };
 await expect(input).toHaveValue('2x + 3 < 11');await verify('<',4);await expect(line.getByRole('slider')).toHaveCount(0);
 for(const [op,display] of [['<','<'],['<=','≤'],['>','>'],['>=','≥'],['=','=']]){await lesson.locator('.operators').getByRole('button',{name:display,exact:true}).click();await verify(op,4);}
 for(const [value,op,b] of [['-2*x+3 < 11','>',-4],['-2*x+3 >= 11','<=',-4],['0.5*x+0.25 <= 1','<=',1.5],['x > 20','>',20],['x < 20','<',20],['x >= -20','>=',-20],['x < -20','<',-20]] as const){await input.fill(value);await verify(op,b);}
 for(const [example,op,b] of [['2x + 1 < 5','<',2],['3(x - 2) <= 9','<=',5]] as const){await lesson.locator('.inequality-side button').filter({hasText:example}).click();await verify(op,b);}
 await lesson.locator('.inequality-side button').filter({hasText:'x^2 - 4 >= 0'}).click();await expect(lesson).toHaveAttribute('data-valid','false');await expect(graph).toContainText('Reference example');
 await lesson.getByRole('button',{name:'Clear inequality input'}).click();await expect(input).toHaveValue('');await lesson.getByRole('button',{name:'Reset',exact:true}).click();await verify('<',4);
 const original=await frame.getAttribute('data-x-min');await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await expect(frame).not.toHaveAttribute('data-x-min',original!);await verify('<',4);await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();await graph.locator('svg').focus();await page.keyboard.press('ArrowRight');await expect(frame).not.toHaveAttribute('data-x-min',original!);await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min',original!);
 await lesson.getByRole('button',{name:'Share',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('2x + 3 < 11');await lesson.getByRole('button',{name:'Reset',exact:true}).click();await expect(lesson).toHaveAttribute('data-actions','0');
 for(const dark of [false,true]){await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);await page.screenshot({path:`test-evidence/shared-lesson-graphs/31/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});}
 expect(errors).toEqual([]);
});

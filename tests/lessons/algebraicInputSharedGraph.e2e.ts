import {test,expect} from '@playwright/test';

for(const [width,height] of [[1440,900],[768,1024],[390,844]])test(`algebraic input preserves evaluation and graph domains at ${width}`,async({page,context})=>{
  test.setTimeout(90000);page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(45000);
  await context.grantPermissions(['clipboard-read','clipboard-write']);await page.setViewportSize({width,height});
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
  await page.goto('/lessons/core-workspaces/28-algebraic-input',{waitUntil:'domcontentloaded'});
  const lesson=page.locator('[data-dedicated-lesson="28"]');await lesson.waitFor({timeout:45000});
  const graph=lesson.locator('[data-lesson-graph-workspace]'),frame=graph.locator('[data-graph-family="cartesian"]'),input=lesson.getByRole('textbox',{name:'Algebra function input'}),create=lesson.getByRole('button').filter({hasText:'Create graph'});
  const points=()=>graph.locator('[data-series-id="function"] polyline').evaluateAll(elements=>elements.map(element=>{
    const svg=(element as SVGPolylineElement).ownerSVGElement!,v=svg.viewBox.baseVal,frame=svg.closest('[data-graph-family]')!;
    const xmin=Number(frame.getAttribute('data-x-min')),xmax=Number(frame.getAttribute('data-x-max')),ymin=Number(frame.getAttribute('data-y-min')),ymax=Number(frame.getAttribute('data-y-max'));
    return [...(element as SVGPolylineElement).points].map(p=>({x:xmin+(p.x-48)/(v.width-72)*(xmax-xmin),y:ymax-(p.y-24)/(v.height-64)*(ymax-ymin)}));
  }));
  await expect(input).toHaveValue('f(x) = x^2 - 4');await expect(lesson).toHaveAttribute('data-graph-count','0');
  let segments=await points();expect(segments).toHaveLength(1);expect(segments[0]).toHaveLength(121);for(const p of segments[0])expect(p.y).toBeCloseTo(p.x*p.x-4,4);
  await expect(lesson.locator('.parsed-graph footer')).toContainText('Roots:');await expect(lesson.locator('.parsed-graph footer')).toContainText('-2 and 2');
  await expect(lesson.locator('.key-points')).toContainText('f(0) = -4');
  await create.click();await expect(lesson).toHaveAttribute('data-graph-count','1');await expect(lesson).toHaveAttribute('data-editing','false');
  await lesson.getByRole('button',{name:'Edit input',exact:true}).click();await expect(input).toBeFocused();
  for(const expression of ['g(t) = t^2 - 1','f(x) = 2*x + 1','f(x) = sin(x)','f(x) = sqrt(x)']){
    await input.fill(expression);await expect(lesson).toHaveAttribute('data-valid','true');await expect(create).toBeEnabled();
    segments=await points();expect(segments.flat().length).toBeGreaterThan(50);
    for(const p of segments.flat()){const expected=expression.startsWith('g')?p.x*p.x-1:expression.includes('2*x')?2*p.x+1:expression.includes('sin')?Math.sin(p.x):Math.sqrt(Math.max(0,p.x));expect(p.y).toBeCloseTo(expected,3);}
    if(expression.startsWith('g'))await expect(graph.locator('.lesson-cartesian-ticks')).toContainText('t');
  }
  await input.fill('f(x) = 1/x');segments=await points();expect(segments).toHaveLength(2);expect(segments.flat()).toHaveLength(120);for(const segment of segments)expect(segment.every(p=>p.x<0)||segment.every(p=>p.x>0)).toBe(true);await expect(lesson.locator('.parsed-graph footer')).toContainText('Roots:  none');
  await input.fill('f(x) = tan(x)');segments=await points();expect(segments.length).toBeGreaterThan(2);for(const segment of segments)for(let i=1;i<segment.length;i++)expect(Math.abs(segment[i].y-segment[i-1].y)).toBeLessThan(100);
  for(const value of ['f(x) = (x+2','f(x) = y+1','f(x) = x@2','']){await input.fill(value);await expect(lesson).toHaveAttribute('data-valid','false');await expect(create).toBeDisabled();await expect(graph.locator('[data-series-id]')).toHaveCount(0);await expect(graph.locator('circle[role="button"]')).toHaveCount(0);}
  await lesson.getByRole('button',{name:'Reset',exact:true}).click();await expect(input).toHaveValue('f(x) = x^2 - 4');await expect(lesson).toHaveAttribute('data-graph-count','0');
  const original=await frame.getAttribute('data-x-min');await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await expect(frame).not.toHaveAttribute('data-x-min',original!);await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();expect(Number(await frame.getAttribute('data-x-min'))).toBeCloseTo(Number(original));
  await graph.locator('svg').focus();await page.keyboard.press('ArrowRight');await expect(frame).not.toHaveAttribute('data-x-min',original!);await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min',original!);
  await lesson.getByRole('button',{name:'Clear algebra input'}).click();await expect(input).toHaveValue('');await lesson.getByRole('button',{name:'Reset',exact:true}).click();
  await lesson.getByRole('button',{name:'Share',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('f(x) = x^2 - 4');
  for(const name of ['English','Sitemap','Docs','About']){const n=Number(await lesson.getAttribute('data-actions'));await lesson.getByRole('button').filter({hasText:name}).click();await expect(lesson).toHaveAttribute('data-actions',String(n+1));}
  for(const dark of [false,true]){await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);await graph.locator('svg').evaluate(e=>e.scrollIntoView({block:'center',behavior:'instant'}));await graph.screenshot({path:`test-evidence/shared-lesson-graphs/28/graph-${width}-${dark?'dark':'light'}.png`});await page.screenshot({path:`test-evidence/shared-lesson-graphs/28/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});}
  expect(errors).toEqual([]);
});

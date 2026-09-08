import { test, expect } from "@playwright/test";

for(const [width,height] of [[1440,900],[768,1024],[390,844]]) {
  test(`dependency diagram and variable controls at ${width}`,async({page,context})=>{
    test.setTimeout(60000);
    await context.grantPermissions(['clipboard-read','clipboard-write']);
    await page.setViewportSize({width,height});
    const errors:string[]=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
    await page.goto('/lessons/core-workspaces/20-variable-explorer',{waitUntil:'domcontentloaded'});
    const lesson=page.locator('[data-dedicated-lesson="20"]');
    await lesson.waitFor({timeout:45000});
    const check=async(x:number)=>{
      await expect(lesson).toHaveAttribute('data-x',String(x));
      await expect(lesson).toHaveAttribute('data-y',String(2*x+3));
      await expect(lesson.locator('.lesson-chain-node')).toHaveText(['x','2x','+3','y']);
    };
    await check(1);
    const slider=lesson.getByRole('slider',{name:'Active variable x drag control'});
    await expect(slider).toHaveAttribute('min','-5');await expect(slider).toHaveAttribute('max','5');await expect(slider).toHaveAttribute('step','1');
    await slider.focus();await page.keyboard.press('Home');await check(-5);
    await page.keyboard.press('End');await check(5);
    for(const value of [-1,0,1,2,3]){await lesson.locator('.variable-control nav').getByRole('button',{name:String(value),exact:true}).click();await check(value);}
    await lesson.getByRole('button',{name:'Symbolic trace',exact:true}).click();await expect(lesson).toHaveAttribute('data-symbolic','false');
    await lesson.getByRole('button',{name:'Numeric values',exact:true}).click();await expect(lesson).toHaveAttribute('data-symbolic','true');
    await lesson.locator('.variable-actions').getByRole('button',{name:/Workspace/}).click();await expect(lesson).toHaveAttribute('data-workspace-open','true');
    await lesson.locator('.variable-actions').getByRole('button',{name:/Workspace/}).click();await expect(lesson).toHaveAttribute('data-workspace-open','false');
    await lesson.getByRole('button',{name:'Share',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('x = 3; y = 2(3) + 3 = 9');
    for(const [index,label] of ['Interact','Explore','Explain','Examples','Formulas','Know more'].entries()) {
      await lesson.locator('.variable-tabs').getByRole('button',{name:new RegExp(label+'$')}).click();
      await expect(lesson).toHaveAttribute('data-view',String(index));
      const journeyTab=page.getByRole('tab',{name:'Interaction + visualization',exact:true});
      if(await journeyTab.count()) await journeyTab.click();
    }
    await lesson.getByRole('button',{name:'Reset',exact:true}).click();await check(1);
    for(const dark of [false,true]) {
      await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:`test-evidence/shared-lesson-graphs/20/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});
    }
    expect(errors).toEqual([]);
  });
}

for (const [width, height] of [[1440,900],[768,1024],[390,844]]) {
  test(`exponential graph retains lesson data and interactions at ${width}`, async ({page, context}) => {
    test.setTimeout(60000);
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.setViewportSize({width,height});
    const errors: string[]=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',e=>{if(e.type()==='error') errors.push(e.text());});
    await page.goto('/lessons/core-workspaces/9-exponential-calculations', {waitUntil:'domcontentloaded'});
    const lesson=page.locator('[data-dedicated-lesson="9"]');
    const graph=lesson.locator('[data-lesson-graph-workspace]');
    await expect(lesson).toHaveAttribute('data-output','256');
    const checkBars=async(base:number, exponent:number)=>{
      await expect(lesson).toHaveAttribute('data-output',String(base**exponent));
      await expect(graph.locator('.lesson-bar')).toHaveCount(exponent+1);
      const actual=await graph.locator('.lesson-bar').evaluateAll(bars=>bars.map(b=>({value:Number(b.getAttribute('data-value')),fraction:Number(b.getAttribute('data-fraction'))})));
      expect(actual).toEqual(Array.from({length:exponent+1},(_,i)=>({value:base**i,fraction:Math.max(8,(base**i/(base**exponent))*100)/100})));
    };
    await checkBars(2,8);
    await lesson.getByRole('button',{name:'Increase Base',exact:true}).click();
    await checkBars(3,8);
    await lesson.getByRole('button',{name:'Decrease Base',exact:true}).click();
    await lesson.getByRole('button',{name:'Decrease Exponent',exact:true}).click();
    await checkBars(2,7);
    await lesson.getByRole('button',{name:'Increase Exponent',exact:true}).click();
    const slider=lesson.getByRole('slider',{name:'Exponent drag control'});
    await expect(slider).toHaveAttribute('min','0');
    await expect(slider).toHaveAttribute('max','8');
    await slider.focus();
    await page.keyboard.press('Home');
    await checkBars(2,0);
    await page.keyboard.press('End');
    await checkBars(2,8);
    for(let i=0;i<=8;i++) {
      await lesson.locator('.exponential-drag button').nth(i).click();
      await checkBars(2,i);
    }
    await lesson.getByRole('button',{name:'Animate growth',exact:true}).click();
    await expect(lesson).toHaveAttribute('data-animating','true');
    await expect(graph.locator('.lesson-bar[data-revealed="false"]').last()).toBeVisible();
    await expect(lesson).toHaveAttribute('data-animating','false',{timeout:5000});
    await expect(graph.locator('.lesson-bar[data-revealed="true"]')).toHaveCount(9);
    const lastBar=graph.locator('.lesson-bar').last();
    await lastBar.click();
    await expect(graph.locator('output')).toHaveText('2^8 = 256');
    await graph.locator('.lesson-bar').first().focus();
    await expect(graph.locator('output')).toHaveText('2^0 = 1');
    await page.keyboard.press('Tab');
    await expect(graph.locator('.lesson-bar').nth(1)).toBeFocused();
    const answer=lesson.getByRole('textbox');
    await answer.fill('0');
    await lesson.getByRole('button',{name:'Check',exact:true}).click();
    await expect(lesson).toHaveAttribute('data-feedback','incorrect');
    await answer.fill('81');
    await lesson.getByRole('button',{name:'Check',exact:true}).click();
    await expect(lesson).toHaveAttribute('data-feedback','correct');
    for(const expected of [125,64,81]) {
      await lesson.getByRole('button',{name:'New problem',exact:true}).click();
      await answer.fill(String(expected));
      await lesson.getByRole('button',{name:'Check',exact:true}).click();
      await expect(lesson).toHaveAttribute('data-feedback','correct');
    }
    await lesson.getByRole('button',{name:/Share/}).click();
    expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('2^8 = 256');
    for(const name of ['Explain','Examples','Formulas','Know more']) {
      await lesson.locator('.target-exponential-tabs').getByRole('button',{name,exact:true}).click();
      await expect(page.locator('.lesson-page-shell')).not.toHaveAttribute('data-lesson-view','interaction');
      const journeyTab=page.getByRole('tab',{name:'Interaction + visualization',exact:true});
      if(await journeyTab.count()) await journeyTab.click();
      else await lesson.locator('.target-exponential-tabs').getByRole('button').filter({hasText:'Interact'}).click();
    }
    await lesson.getByRole('button',{name:'Reset',exact:true}).click();
    await checkBars(2,8);
    for(const dark of [false,true]) {
      await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:`test-evidence/shared-lesson-graphs/9/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});
    }
    expect(errors).toEqual([]);
  });
}

for (const [width,height] of [[1440,900],[768,1024],[390,844]]) {
  test(`hyperbolic curves, graph navigation and drag at ${width}`,async({page,context})=>{
    test.setTimeout(60000);
    await context.grantPermissions(['clipboard-read','clipboard-write']);
    await page.setViewportSize({width,height});
    const errors:string[]=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
    await page.goto('/lessons/core-workspaces/12-hyperbolic-functions', {waitUntil:'domcontentloaded'});
    const lesson=page.locator('[data-dedicated-lesson="12"]');
    const graph=lesson.locator('[data-lesson-graph-workspace]');
    const canvas=graph.locator('svg');
    const frame=graph.locator('[data-graph-family="cartesian"]');
    const check=async(x:number)=>{
      await expect(lesson).toHaveAttribute('data-x',String(x));
      await expect(lesson).toHaveAttribute('data-positive',String(Number(Math.exp(x).toFixed(3))));
      await expect(lesson).toHaveAttribute('data-negative',String(Number(Math.exp(-x).toFixed(3))));
      await expect(lesson).toHaveAttribute('data-output',String(Number(Math.sinh(x).toFixed(3))));
    };
    await check(1);
    const sample=await graph.locator('[data-series-id="positive"] polyline').evaluate(element=>{
      const line=element as SVGPolylineElement;
      const box=line.ownerSVGElement!.viewBox.baseVal;
      return {x:line.points.getItem(40).x,y:line.points.getItem(40).y,width:box.width,height:box.height,count:line.points.numberOfItems};
    });
    expect(sample.count).toBe(81);
    expect(sample.x).toBeCloseTo(48+(sample.width-72)/2,4);
    expect(sample.y).toBeCloseTo(24+12/13*(sample.height-64),4);
    const slider=lesson.getByRole('slider',{name:'Hyperbolic x drag control'});
    await expect(slider).toHaveAttribute('min','-2');
    await expect(slider).toHaveAttribute('max','2');
    await expect(slider).toHaveAttribute('step','0.1');
    await slider.focus(); await page.keyboard.press('Home'); await check(-2);
    await page.keyboard.press('End'); await check(2);
    await page.keyboard.press('ArrowLeft'); await check(1.9);
    await lesson.getByRole('button',{name:'Reset',exact:true}).click(); await check(1);
    const point=graph.locator('circle[role="button"]').first();
    await point.focus(); await page.keyboard.press('ArrowLeft'); await check(.9);
    await point.scrollIntoViewIfNeeded();
    const box=await point.boundingBox();
    if(!box)throw new Error('Missing graph point');
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
    await page.mouse.down(); await page.mouse.move(box.x+box.width/2+35,box.y+box.height/2,{steps:4}); await page.mouse.up();
    await expect(lesson).not.toHaveAttribute('data-x','0.9');
    await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();
    await expect(frame).toHaveAttribute('data-x-min','-2');
    await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();
    await expect(frame).toHaveAttribute('data-x-min','-2.5');
    await canvas.focus(); await page.keyboard.press('ArrowRight');
    await expect(frame).toHaveAttribute('data-x-min','-2');
    await page.keyboard.press('0'); await expect(frame).toHaveAttribute('data-x-min','-2.5');
    await canvas.scrollIntoViewIfNeeded();
    const area=await canvas.boundingBox();
    if(!area)throw new Error('Missing graph');
    await page.mouse.move(area.x+area.width*.4,area.y+area.height*.3);
    await page.mouse.down(); await page.mouse.move(area.x+area.width*.4+25,area.y+area.height*.3,{steps:4});await page.mouse.up();
    await expect(frame).not.toHaveAttribute('data-x-min','-2.5');
    await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();
    await expect(frame).toHaveAttribute('data-x-min','-2.5');
    await expect(frame).toHaveAttribute('data-y-max','13');
    await lesson.getByRole('button',{name:'Reset',exact:true}).click();await check(1);
    for(let i=1;i<=4;i++) {
      await lesson.getByRole('button',{name:'New practice',exact:true}).click();
      await expect(lesson).toHaveAttribute('data-practice',String(i%4));
      await lesson.getByRole('button',{name:'Reveal answer',exact:true}).click();
      await expect(lesson).toHaveAttribute('data-revealed','true');
      await lesson.getByRole('button',{name:'Hide answer',exact:true}).click();
      await expect(lesson).toHaveAttribute('data-revealed','false');
    }
    await lesson.getByRole('button',{name:/Share/}).click();
    expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('sinh(1) = 1.175');
    for(const dark of [false,true]) {
      await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:`test-evidence/shared-lesson-graphs/12/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});
    }
    expect(errors).toEqual([]);
  });
}

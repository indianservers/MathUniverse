import { test, expect } from '@playwright/test';

for(const [width,height] of [[1440,900],[768,1024],[390,844]]) {
  test(`dependent midpoint, hierarchy and point controls at ${width}`,async({page,context})=>{
    test.setTimeout(90000);page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(45000);
    await page.setViewportSize({width,height});
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
    await page.goto('/lessons/core-workspaces/25-dependent-and-independent-objects',{waitUntil:'domcontentloaded'});
    const lesson=page.locator('[data-dedicated-lesson="25"]');await lesson.waitFor({timeout:45000});
    const graph=lesson.locator('[data-lesson-graph-workspace]').first();
    const frame=graph.locator('[data-graph-family="cartesian"]');
    const fmt=(value:number)=>Number.isInteger(value)?String(value):value.toFixed(1);
    const read=async()=>({ax:Number(await lesson.getAttribute('data-ax')),ay:Number(await lesson.getAttribute('data-ay')),bx:Number(await lesson.getAttribute('data-bx')),by:Number(await lesson.getAttribute('data-by'))});
    const check=async()=>{
      const {ax,ay,bx,by}=await read();
      await expect(lesson).toHaveAttribute('data-mx',String((ax+bx)/2));await expect(lesson).toHaveAttribute('data-my',String((ay+by)/2));await expect(lesson).toHaveAttribute('data-length',fmt(Math.hypot(bx-ax,by-ay)));
      await expect(lesson.locator('.lesson-dependency-node')).toHaveText(['A','B','Segment AB','Midpoint M',`Label M(${fmt((ax+bx)/2)}, ${fmt((ay+by)/2)})`]);
      const points=await graph.locator('circle[role="button"]').evaluateAll(circles=>circles.map(e=>({x:(e as SVGCircleElement).cx.baseVal.value,y:(e as SVGCircleElement).cy.baseVal.value})));
      expect(points).toHaveLength(3);expect(points[2].x).toBeCloseTo((points[0].x+points[1].x)/2,4);expect(points[2].y).toBeCloseTo((points[0].y+points[1].y)/2,4);
      for(const value of [ax,bx]){expect(value).toBeGreaterThanOrEqual(0);expect(value).toBeLessThanOrEqual(8);expect(Number.isInteger(value)).toBe(true);}
      for(const value of [ay,by]){expect(value).toBeGreaterThanOrEqual(-1);expect(value).toBeLessThanOrEqual(5);expect(Number.isInteger(value)).toBe(true);}
    };
    expect(await read()).toEqual({ax:1,ay:2,bx:5,by:2});await check();
    const original=await frame.getAttribute('data-x-min');expect(Number(original)).toBe(-80/72);expect(Number(await frame.getAttribute('data-y-max'))).toBe(300/52);
    for(const name of ['A','B'])for(const axis of ['x','y']){
      await lesson.getByRole('button',{name:`Increase ${name} ${axis}`,exact:true}).click();await check();
      await lesson.getByRole('button',{name:`Decrease ${name} ${axis}`,exact:true}).click();await check();
    }
    const a=lesson.getByTestId('dependency-handle-a'),b=lesson.getByTestId('dependency-handle-b');
    await a.focus();await page.keyboard.press('ArrowRight');await expect(lesson).toHaveAttribute('data-ax','2');await check();
    await page.keyboard.press('ArrowUp');await expect(lesson).toHaveAttribute('data-ay','3');await check();
    await a.scrollIntoViewIfNeeded();let box=await a.boundingBox();if(!box)throw new Error('Missing A');
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2-80,box.y+box.height/2+20,{steps:5});await page.mouse.up();await expect(lesson).not.toHaveAttribute('data-ax','2');await check();
    await b.scrollIntoViewIfNeeded();box=await b.boundingBox();if(!box)throw new Error('Missing B');
    const cdp=await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width/2+80,y:box.y+box.height/2-25}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(lesson).not.toHaveAttribute('data-bx','5');await check();
    await a.focus();for(let i=0;i<10;i++)await page.keyboard.press('ArrowLeft');await expect(lesson).toHaveAttribute('data-ax','0');
    for(let i=0;i<10;i++)await page.keyboard.press('ArrowDown');await expect(lesson).toHaveAttribute('data-ay','-1');await check();
    await b.focus();for(let i=0;i<10;i++)await page.keyboard.press('ArrowRight');await expect(lesson).toHaveAttribute('data-bx','8');
    for(let i=0;i<10;i++)await page.keyboard.press('ArrowUp');await expect(lesson).toHaveAttribute('data-by','5');await check();
    const before=await read();await graph.locator('circle[role="button"]').last().focus();await page.keyboard.press('Enter');await expect(graph.locator('output')).toContainText('(4, 2)');expect(await read()).toEqual(before);
    await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await expect(frame).not.toHaveAttribute('data-x-min',original!);
    await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();expect(Number(await frame.getAttribute('data-x-min'))).toBeCloseTo(Number(original));
    await graph.locator('svg').focus();await page.keyboard.press('ArrowRight');await expect(frame).not.toHaveAttribute('data-x-min',original!);
    await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min',original!);expect(await read()).toEqual(before);await check();
    // Bring both parents together: the dependent point must remain coincident.
    for(let i=0;i<8;i++)await lesson.getByRole('button',{name:'Decrease B x',exact:true}).click();
    for(let i=0;i<6;i++)await lesson.getByRole('button',{name:'Decrease B y',exact:true}).click();await check();await expect(lesson).toHaveAttribute('data-length','0');
    await page.reload({waitUntil:'domcontentloaded'});await lesson.waitFor();expect(await read()).toEqual({ax:1,ay:2,bx:5,by:2});await check();
    for(const dark of [false,true]){
      await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`test-evidence/shared-lesson-graphs/25/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});
    }
    expect(errors).toEqual([]);
  });
}

import { test, expect } from '@playwright/test';

for(const [width,height] of [[1440,900],[768,1024],[390,844]]) {
  test(`integer staircase and controls at ${width}`,async({page})=>{
    test.setTimeout(90000);
    page.setDefaultTimeout(10000);
    page.setDefaultNavigationTimeout(45000);
    await page.setViewportSize({width,height});
    const errors:string[]=[];
    page.on('pageerror',e=>errors.push(e.message));
    page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
    await page.goto('/lessons/core-workspaces/22-integer-sliders',{waitUntil:'domcontentloaded'});
    const lesson=page.locator('[data-dedicated-lesson="22"]');await lesson.waitFor({timeout:45000});
    const graph=lesson.locator('[data-lesson-graph-workspace]');
    const frame=graph.locator('[data-graph-family="cartesian"]');
    const check=async(x:number)=>{
      await expect(lesson).toHaveAttribute('data-x',String(x));await expect(lesson).toHaveAttribute('data-y',String(2*x+3));
    };
    await check(3);
    const original=await frame.getAttribute('data-x-min');
    expect(Number(original)).toBe(-38/29.6-5);
    expect(Number(await frame.getAttribute('data-y-max'))).toBe(204/9);
    const path=await graph.locator('[data-series-id="steps"] polyline').evaluate(e=>{
      const p=e as SVGPolylineElement,v=p.ownerSVGElement!.viewBox.baseVal;
      return {width:v.width,height:v.height,points:Array.from({length:p.points.numberOfItems},(_,i)=>({x:p.points.getItem(i).x,y:p.points.getItem(i).y}))};
    });
    const expected=Array.from({length:10},(_,i)=>i-5).flatMap(x=>[{x,y:2*x+3},{x:x+1,y:2*x+3},{x:x+1,y:2*(x+1)+3}]);
    expect(path.points).toHaveLength(expected.length);
    for(const [index,p] of path.points.entries()){
      expect((p.x-48)/(path.width-72)*(360/29.6)-38/29.6-5).toBeCloseTo(expected[index].x,4);
      expect(204/9-(p.y-24)/(path.height-64)*(250/9)).toBeCloseTo(expected[index].y,4);
    }
    const slider=lesson.getByRole('slider',{name:'Integer slider x drag control'});
    await expect(slider).toHaveAttribute('min','-5');await expect(slider).toHaveAttribute('max','5');await expect(slider).toHaveAttribute('step','1');
    const previous=lesson.locator('.integer-move').getByRole('button',{name:/Previous/});
    const next=lesson.locator('.integer-move').getByRole('button',{name:/Next/});
    await slider.focus();await page.keyboard.press('Home');await check(-5);await expect(previous).toBeDisabled();
    await page.keyboard.press('End');await check(5);await expect(next).toBeDisabled();
    await previous.click();await check(4);await next.click();await check(5);
    for(let x=-5;x<=5;x++){
      await lesson.locator('.integer-range').getByRole('button',{name:String(x),exact:true}).click();await check(x);
    }
    await lesson.locator('.integer-range').getByRole('button',{name:'3',exact:true}).click();
    const point=graph.locator('circle[role="button"]');await point.focus();await page.keyboard.press('ArrowLeft');await check(2);
    await point.scrollIntoViewIfNeeded();const box=await point.boundingBox();if(!box)throw new Error('Missing integer point');
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+45,box.y+box.height/2,{steps:4});await page.mouse.up();
    await expect(lesson).not.toHaveAttribute('data-x','2');expect(Number(await lesson.getAttribute('data-x'))%1).toBe(0);
    const xBeforeZoom=await lesson.getAttribute('data-x');
    await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await expect(frame).not.toHaveAttribute('data-x-min',original!);
    await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();expect(Number(await frame.getAttribute('data-x-min'))).toBeCloseTo(Number(original));
    await graph.locator('svg').focus();await page.keyboard.press('ArrowLeft');await expect(frame).not.toHaveAttribute('data-x-min',original!);
    await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min',original!);await expect(lesson).toHaveAttribute('data-x',xBeforeZoom!);
    for(const [index,label] of ['Interaction + visualization','Explain','Examples','Formulas','Know more'].entries()){
      await lesson.locator('.integer-tabs').getByRole('button').filter({hasText:label}).click();await expect(lesson).toHaveAttribute('data-view',String(index));
      const tab=page.getByRole('tab',{name:'Interaction + visualization',exact:true});if(await tab.count())await tab.click();
    }
    await lesson.locator('.integer-tabs').getByRole('button').filter({hasText:'Interaction + visualization'}).click();
    for(const [index,label] of ['Sitemap','Docs','About'].entries()){
      await lesson.getByRole('button',{name:label,exact:true}).click();await expect(lesson).toHaveAttribute('data-view',String(index));
      const tab=page.getByRole('tab',{name:'Interaction + visualization',exact:true});if(await tab.count())await tab.click();
      await lesson.locator('.integer-tabs').getByRole('button').filter({hasText:'Interaction + visualization'}).click();
    }
    await lesson.locator('.integer-tabs').getByRole('button',{name:'Interaction + visualization',exact:true}).click();
    await lesson.locator('.integer-range').getByRole('button',{name:'3',exact:true}).click();await check(3);
    await expect(lesson.locator('.integer-range').getByRole('button',{name:'3',exact:true})).toHaveAttribute('aria-pressed','true');
    for(const dark of [false,true]){
      await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:`test-evidence/shared-lesson-graphs/22/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});
    }
    expect(errors).toEqual([]);
  });
}

import { test, expect } from '@playwright/test';

const frames=[0,.5,1,1.5,2,2];
for(const [width,height] of [[1440,900],[768,1024],[390,844]]) {
  test(`animation graph retains frames, traces and timing at ${width}`,async({page})=>{
    test.setTimeout(90000);
    page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(45000);
    await page.setViewportSize({width,height});await page.clock.install();
    const errors:string[]=[];
    page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
    await page.goto('/lessons/core-workspaces/24-animation-controls',{waitUntil:'domcontentloaded'});
    const lesson=page.locator('[data-dedicated-lesson="24"]');await lesson.waitFor({timeout:45000});
    await expect(lesson).toHaveAttribute('data-playing','true');await expect(lesson).toHaveAttribute('data-speed','1x');await expect(lesson).toHaveAttribute('data-loop','true');
    await lesson.getByRole('button',{name:'Pause',exact:true}).click();
    await page.clock.pauseAt(await page.evaluate(()=>Date.now())+100);
    const graph=lesson.locator('[data-lesson-graph-workspace]');
    const frame=graph.locator('[data-graph-family="cartesian"]');
    const check=async(index:number)=>{
      const a=frames[index];
      await expect(lesson).toHaveAttribute('data-frame',String(index));await expect(lesson).toHaveAttribute('data-a',String(a));await expect(lesson).toHaveAttribute('data-output',String(2*a+1));
      const slopes=[...new Set([a,...frames.slice(Math.max(0,index-2),index).reverse()])].slice(0,3);
      await expect(graph.locator('[data-series-id]')).toHaveCount(slopes.length);
      await expect(graph.locator('circle[role="button"]')).toHaveCount(2);
      const traces=await graph.locator('[data-series-id] polyline').evaluateAll(lines=>lines.map(e=>{
        const line=e as SVGPolylineElement,v=line.ownerSVGElement!.viewBox.baseVal;
        return {width:v.width,height:v.height,points:Array.from({length:line.points.numberOfItems},(_,i)=>({x:line.points.getItem(i).x,y:line.points.getItem(i).y}))};
      }));
      for(const [i,line] of traces.entries())for(const [j,p] of line.points.entries()){
        const x=j===0?-5:5;
        expect((p.x-48)/(line.width-72)*640/55-302/55).toBeCloseTo(x,4);
        expect(349/55-(p.y-24)/(line.height-64)*560/55).toBeCloseTo(slopes[i]*x+1,4);
      }
    };
    for(let i=0;i<6;i++){
      await lesson.getByRole('button',{name:`Seek frame ${i}`,exact:true}).click();await check(i);
      await lesson.locator('.animation-table button').nth(5-i).click();await check(5-i);
    }
    await lesson.getByRole('button',{name:'Seek frame 0',exact:true}).click();await expect(lesson.getByRole('button',{name:'Step back',exact:true})).toBeDisabled();
    await lesson.getByRole('button',{name:'Step forward',exact:true}).click();await check(1);
    await lesson.getByRole('button',{name:'Step back',exact:true}).click();await check(0);
    for(const [speed,duration] of [['0.5x',2800],['1x',1800],['2x',900]] as const){
      await lesson.getByRole('combobox',{name:'Animation speed'}).selectOption(speed);
      await lesson.getByRole('button',{name:'Seek frame 0',exact:true}).click();
      await lesson.getByRole('button',{name:'Play',exact:true}).click();
      await page.clock.runFor(duration-1);await check(0);
      await page.clock.runFor(1);await check(1);
      await lesson.getByRole('button',{name:'Pause',exact:true}).click();await page.clock.runFor(duration*2);await check(1);
    }
    await lesson.getByRole('switch',{name:'Loop animation'}).click();await expect(lesson).toHaveAttribute('data-loop','false');
    await lesson.getByRole('button',{name:'Seek frame 5',exact:true}).click();await expect(lesson.getByRole('button',{name:'Step forward',exact:true})).toBeDisabled();
    await lesson.getByRole('button',{name:'Play',exact:true}).click();await page.clock.runFor(900);await check(5);await expect(lesson).toHaveAttribute('data-playing','false');
    await lesson.getByRole('button',{name:'Loop',exact:true}).click();await expect(lesson.getByRole('switch',{name:'Loop animation'})).toHaveAttribute('aria-checked','true');
    await lesson.getByRole('button',{name:'Play',exact:true}).click();await page.clock.runFor(900);await check(0);await lesson.getByRole('button',{name:'Pause',exact:true}).click();
    await lesson.getByRole('button',{name:'Seek frame 3',exact:true}).click();await check(3);
    const original=await frame.getAttribute('data-x-min');expect(Number(original)).toBe(-302/55);
    await graph.locator('circle[role="button"]').last().focus();await page.keyboard.press('Enter');await expect(graph.locator('output')).toContainText('(2, 4)');
    await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await expect(frame).not.toHaveAttribute('data-x-min',original!);
    await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();expect(Number(await frame.getAttribute('data-x-min'))).toBeCloseTo(Number(original));
    await graph.locator('svg').focus();await page.keyboard.press('ArrowRight');await expect(frame).not.toHaveAttribute('data-x-min',original!);
    await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min',original!);await check(3);
    for(const dark of [false,true]){
      await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
      // Page overflow alone misses children clipped by overflow:hidden panels.
      for(const selector of ['.animation-timeline','.animation-header','.animation-side','.animation-neighbors']) {
        const clipped=await lesson.locator(selector).evaluate(panel=>{
          const bounds=panel.getBoundingClientRect();
          return [...panel.querySelectorAll('button,select,a,b,em')].filter(control=>{
            const rect=control.getBoundingClientRect();
            return rect.width>0&&(rect.left<bounds.left-1||rect.right>bounds.right+1||rect.bottom>bounds.bottom+1);
          }).map(control=>control.textContent);
        });
        expect(clipped,`${selector} must not clip controls or labels`).toEqual([]);
      }
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:`test-evidence/shared-lesson-graphs/24/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});
    }
    expect(errors).toEqual([]);
  });
}

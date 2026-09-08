import { test, expect } from '@playwright/test';

for (const [width,height] of [[1440,900],[768,1024],[390,844]]) {
  test(`numeric slider graph preserves values and controls at ${width}`,async({page,context})=>{
    test.setTimeout(90000);
    await context.grantPermissions(['clipboard-read','clipboard-write']);
    await page.setViewportSize({width,height});
    const errors:string[]=[];
    page.on('pageerror',error=>errors.push(error.message));
    page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.goto('/lessons/core-workspaces/21-numeric-sliders',{waitUntil:'domcontentloaded'});
    const lesson=page.locator('[data-dedicated-lesson="21"]');
    await lesson.waitFor({timeout:45000});
    const graph=lesson.locator('[data-lesson-graph-workspace]');
    const frame=graph.locator('[data-graph-family="cartesian"]');
    const canvas=graph.locator('svg');
    const check=async(x:number,y=2*x+3)=>{
      await expect(lesson).toHaveAttribute('data-x',String(x));
      await expect(lesson).toHaveAttribute('data-y',String(Number(y.toFixed(1))));
    };
    await check(2);
    const originalView=await frame.getAttribute('data-x-min');
    expect(Number(originalView)).toBe(-50/8.4);
    expect(Number(await frame.getAttribute('data-y-max'))).toBe(50/4.15);
    const verifyProjection=async()=>{
      const geometry=await graph.evaluate(root=>{
        const point=root.querySelector('circle[role="button"]') as SVGCircleElement;
        const line=root.querySelector('[data-series-id="linear"] polyline') as SVGPolylineElement;
        const a=line.points.getItem(0),b=line.points.getItem(1);
        return {cx:point.cx.baseVal.value,cy:point.cy.baseVal.value,ax:a.x,ay:a.y,bx:b.x,by:b.y};
      });
      expect(geometry.cy).toBeCloseTo(geometry.ay+(geometry.cx-geometry.ax)/(geometry.bx-geometry.ax)*(geometry.by-geometry.ay),3);
    };
    await verifyProjection();
    const slider=lesson.getByRole('slider',{name:'Numeric slider x drag control'});
    await expect(slider).toHaveAttribute('min','-5');await expect(slider).toHaveAttribute('max','5');await expect(slider).toHaveAttribute('step','0.1');
    await slider.focus();await page.keyboard.press('Home');await check(-5);await verifyProjection();
    await page.keyboard.press('End');await check(5);
    await lesson.getByRole('button',{name:'Decrease x',exact:true}).click();await check(4.9);
    await lesson.getByRole('button',{name:'Increase x',exact:true}).click();await check(5);
    for(const x of [-2,0,2,4]){
      await lesson.locator('.numeric-pattern').getByRole('button',{name:new RegExp(`^x = ${x} `)}).click();await check(x);await verifyProjection();
    }
    const input=lesson.getByRole('spinbutton',{name:'Current x value',exact:true});
    await input.fill('1.3');await check(1.3);
    for(const step of ['0.5','1','0.1']){
      await lesson.getByRole('combobox',{name:'Step (precision)'}).selectOption(step);
      await expect(lesson).toHaveAttribute('data-step',step);
    }
    await check(1);
    await lesson.getByRole('spinbutton',{name:'Minimum slider value'}).fill('-3');await expect(lesson).toHaveAttribute('data-min','-3');
    await lesson.getByRole('spinbutton',{name:'Maximum slider value'}).fill('3');await expect(lesson).toHaveAttribute('data-max','3');
    await input.fill('20');await check(3);
    await input.fill('-20');await check(-3);
    await lesson.getByRole('button',{name:'Reset',exact:true}).click();await check(2);
    await expect(lesson).toHaveAttribute('data-min','-5');await expect(lesson).toHaveAttribute('data-max','5');await expect(lesson).toHaveAttribute('data-step','0.1');
    const point=graph.locator('circle[role="button"]');
    await point.focus();await page.keyboard.press('ArrowLeft');await check(1.9);await verifyProjection();
    await point.scrollIntoViewIfNeeded();
    const p=await point.boundingBox();if(!p)throw new Error('Missing point');
    await page.mouse.move(p.x+p.width/2,p.y+p.height/2);await page.mouse.down();await page.mouse.move(p.x+p.width/2-20,p.y+p.height/2,{steps:4});await page.mouse.up();
    await expect(lesson).not.toHaveAttribute('data-x','1.9');await verifyProjection();
    await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await expect(frame).not.toHaveAttribute('data-x-min',originalView!);
    await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();expect(Number(await frame.getAttribute('data-x-min'))).toBeCloseTo(Number(originalView));
    await canvas.focus();await page.keyboard.press('ArrowRight');await expect(frame).not.toHaveAttribute('data-x-min',originalView!);
    await page.keyboard.press('0');await expect(frame).toHaveAttribute('data-x-min',originalView!);
    await canvas.scrollIntoViewIfNeeded();const area=await canvas.boundingBox();if(!area)throw new Error('Missing canvas');
    const cdp=await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:area.x+area.width*.3,y:area.y+area.height*.3}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:area.x+area.width*.3+25,y:area.y+area.height*.3}]});
    await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    await expect(frame).not.toHaveAttribute('data-x-min',originalView!);
    await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min',originalView!);
    await lesson.getByRole('button',{name:'Reset',exact:true}).click();await check(2);
    await lesson.getByRole('button',{name:'Share',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('x = 2; y = 2(2) + 3 = 7');
    for(const name of ['Sitemap','Docs','About']){
      const actions=Number(await lesson.getAttribute('data-actions'));
      await lesson.getByRole('button',{name,exact:true}).click();await expect(lesson).toHaveAttribute('data-actions',String(actions+1));
    }
    for(const dark of [false,true]){
      await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);
      await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:`test-evidence/shared-lesson-graphs/21/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});
    }
    expect(errors).toEqual([]);
  });
}

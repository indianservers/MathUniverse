import {test,expect} from '@playwright/test';

const compare=(x:number,op:string,c:number)=>{switch(op){case '>=':return x>=c;case '>':return x>c;case '<=':return x<=c;case '<':return x<c;case '=':return x===c;default:return x!==c;}};
for(const [width,height] of [[1440,900],[768,1024],[390,844]]) {
  test(`conditional graph regions and visibility at ${width}`,async({page,context})=>{
    test.setTimeout(90000);page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(45000);await context.grantPermissions(['clipboard-read','clipboard-write']);
    await page.setViewportSize({width,height});const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
    await page.goto('/lessons/core-workspaces/26-conditional-visibility',{waitUntil:'domcontentloaded'});
    const lesson=page.locator('[data-dedicated-lesson="26"]');await lesson.waitFor({timeout:45000});
    const graph=lesson.locator('[data-graph-family="number-line"]');
    const slider=lesson.getByRole('slider',{name:'Visibility number line drag control'});
    const sideSlider=lesson.getByRole('slider',{name:'Conditional value x drag control'});
    const check=async()=>{
      const x=Number(await lesson.getAttribute('data-x')),c=Number(await lesson.getAttribute('data-boundary')),op=(await lesson.getAttribute('data-operator'))!;
      await expect(lesson).toHaveAttribute('data-visible',String(compare(x,op,c)));
      await expect(lesson.locator('.lesson-visibility-graph')).toHaveCount(3);
      for(const [i,value] of [x,c-.5,c+.5].entries())await expect(lesson.locator('.lesson-visibility-graph').nth(i)).toHaveAttribute('data-visible',String(compare(value,op,c)));
      const regions=await graph.locator('[data-region]').evaluateAll(nodes=>nodes.map(node=>({id:node.getAttribute('data-region')!,start:Number(node.getAttribute('data-start')),end:Number(node.getAttribute('data-end'))})));
      expect(regions[0].start).toBe(-5);expect(regions.at(-1)!.end).toBe(5);
      for(const region of regions)expect(region.id.startsWith('visible')).toBe(compare((region.start+region.end)/2,op,c));
      if(c>=-5&&c<=5)await expect(graph.locator('.lesson-number-boundary')).toHaveAttribute('data-included',String(compare(c,op,c)));
      else await expect(graph.locator('.lesson-number-boundary')).toHaveCount(0);
      await expect(slider).toHaveValue(String(x));await expect(sideSlider).toHaveValue(String(x));
    };
    await expect(lesson).toHaveAttribute('data-x','2.5');await expect(lesson).toHaveAttribute('data-boundary','2');await expect(lesson).toHaveAttribute('data-operator','>=');await check();
    for(const input of [slider,sideSlider]){await expect(input).toHaveAttribute('min','-5');await expect(input).toHaveAttribute('max','5');expect(Number(await input.getAttribute('step'))).toBe(.1);}
    for(const op of ['>=','>','<=','<','=','!=']){
      await lesson.getByRole('combobox',{name:'Condition operator'}).selectOption(op);await check();
      await slider.focus();for(let i=0;i<5;i++)await page.keyboard.press('ArrowLeft');await expect(lesson).toHaveAttribute('data-x','2');await check();
      for(let i=0;i<5;i++)await page.keyboard.press('ArrowLeft');await expect(lesson).toHaveAttribute('data-x','1.5');await check();
      for(let i=0;i<10;i++)await page.keyboard.press('ArrowRight');await expect(lesson).toHaveAttribute('data-x','2.5');
    }
    await sideSlider.focus();await page.keyboard.press('Home');await expect(lesson).toHaveAttribute('data-x','-5');await check();await page.keyboard.press('End');await expect(lesson).toHaveAttribute('data-x','5');await check();
    await lesson.getByRole('spinbutton',{name:'Condition boundary',exact:true}).fill('3');await expect(lesson.getByRole('spinbutton',{name:'Boundary c',exact:true})).toHaveValue('3');await check();
    for(const c of ['-10','10','2']){await lesson.getByRole('spinbutton',{name:'Boundary c',exact:true}).fill(c);await expect(lesson.getByRole('spinbutton',{name:'Condition boundary',exact:true})).toHaveValue(c);await check();}
    await slider.scrollIntoViewIfNeeded();const numberBox=await slider.boundingBox();if(!numberBox)throw new Error('Missing number-line input');
    await page.mouse.click(numberBox.x+numberBox.width*.25,numberBox.y+numberBox.height/2);expect(Number(await lesson.getAttribute('data-x'))).toBeLessThan(0);await check();
    await sideSlider.scrollIntoViewIfNeeded();const sideBox=await sideSlider.boundingBox();if(!sideBox)throw new Error('Missing linked input');
    const cdp=await context.newCDPSession(page);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sideBox.x+sideBox.width*.75,y:sideBox.y+sideBox.height/2}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
    expect(Number(await lesson.getAttribute('data-x'))).toBeGreaterThan(0);await check();
    await expect(lesson.getByRole('combobox',{name:'Condition variable'})).toHaveValue('x');
    const legend=lesson.getByRole('button',{name:/Legend/});await legend.click();await expect(lesson).toHaveAttribute('data-legend','true');await expect(lesson.locator('.lesson-graph-legend li')).toHaveCount(3);await legend.click();await expect(lesson.locator('.lesson-graph-legend li')).toHaveCount(0);
    await lesson.getByRole('button',{name:'Workspace',exact:true}).click();await expect(lesson).toHaveAttribute('data-workspace','true');await lesson.getByRole('button',{name:'Workspace',exact:true}).click();await expect(lesson).toHaveAttribute('data-workspace','false');
    const actions=Number(await lesson.getAttribute('data-actions'));await lesson.getByRole('button',{name:/English/}).click();await expect(lesson).toHaveAttribute('data-actions',String(actions+1));
    for(const [i,label] of ['Explore','Explain','Examples','Formulas','Know more'].entries()){
      await lesson.locator('.visibility-tabs').getByRole('button').filter({hasText:label}).click();await expect(lesson).toHaveAttribute('data-view',String(i));
      const tab=page.getByRole('tab',{name:'Interaction + visualization',exact:true});if(await tab.count())await tab.click();
    }
    await lesson.locator('.visibility-tabs').getByRole('button').filter({hasText:'Explore'}).click();
    await lesson.getByRole('button',{name:'Reset',exact:true}).click();await expect(lesson).toHaveAttribute('data-x','2.5');await expect(lesson).toHaveAttribute('data-operator','>=');await expect(lesson).toHaveAttribute('data-boundary','2');await check();
    await lesson.getByRole('button',{name:'Share',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('2.5 >= 2 -> TRUE');
    for(const dark of [false,true]){
      await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
      await page.screenshot({path:`test-evidence/shared-lesson-graphs/26/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});
    }
    expect(errors).toEqual([]);
  });
}

import {test,expect} from '@playwright/test';

const templates=['P = ({x}, {y}), distance = {d}','P = ({x}, {y}) | d = {d}','({x}, {y}) -> distance = {d}'];
const label=(index:number,x:number,y:number,coordinates:boolean,distance:boolean)=>{
  const point=`(${x}, ${y})`,d=Math.hypot(x,y).toFixed(2);
  if(!coordinates&&!distance)return 'P';
  if(!distance)return index===2?point:`P = ${point}`;
  if(!coordinates)return index===0?`P distance = ${d}`:index===1?`P d = ${d}`:`distance = ${d}`;
  return index===0?`P = ${point}, distance = ${d}`:index===1?`P = ${point} | d = ${d}`:`${point} -> distance = ${d}`;
};
for(const [width,height] of [[1440,900],[768,1024],[390,844]]) {
  test(`dynamic labels retain templates and geometry at ${width}`,async({page,context})=>{
    test.setTimeout(90000);page.setDefaultTimeout(10000);page.setDefaultNavigationTimeout(45000);await context.grantPermissions(['clipboard-read','clipboard-write']);await page.setViewportSize({width,height});
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',e=>{if(e.type()==='error')errors.push(e.text());});
    await page.goto('/lessons/core-workspaces/27-dynamic-labels',{waitUntil:'domcontentloaded'});
    const lesson=page.locator('[data-dedicated-lesson="27"]');await lesson.waitFor({timeout:45000});
    const graph=lesson.locator('[data-lesson-graph-workspace]').first(),frame=graph.locator('[data-graph-family="cartesian"]');
    const check=async()=>{
      const x=Number(await lesson.getAttribute('data-x')),y=Number(await lesson.getAttribute('data-y')),index=Number(await lesson.getAttribute('data-template')),coords=await lesson.getAttribute('data-coordinates')==='true',dist=await lesson.getAttribute('data-show-distance')==='true';
      await expect(lesson).toHaveAttribute('data-distance',Math.hypot(x,y).toFixed(2));
      await expect(lesson.locator('.template-output output').last()).toHaveText(label(index,x,y,coords,dist));
      await expect(lesson.locator('.preview-card .lesson-graph-heading p')).toHaveText(label(index,4,1,coords,dist));
      await expect(graph.locator('[data-series-id]')).toHaveCount(await lesson.getAttribute('data-projections')==='true'?3:0);
      if(await graph.getByTestId('dynamic-label-point-handle').count()){
        await expect(graph.getByTestId('dynamic-label-point-handle')).toHaveAttribute('aria-label',`${label(index,x,y,coords,dist)}: (${x}, ${y})`);
        const box=await graph.locator('.lesson-cartesian-annotation').evaluate(e=>{const b=(e as SVGTextElement).getBBox(),v=(e as SVGTextElement).ownerSVGElement!.viewBox.baseVal;return {left:b.x,right:b.x+b.width,width:v.width};});
        expect(box.left).toBeGreaterThanOrEqual(47);expect(box.right).toBeLessThanOrEqual(box.width-22);
      }
    };
    await expect(lesson).toHaveAttribute('data-x','3');await expect(lesson).toHaveAttribute('data-y','2');await check();
    const original=await frame.getAttribute('data-x-min');expect(Number(original)).toBe(-6);expect(Number(await frame.getAttribute('data-y-max'))).toBe(232/32);
    for(const [index,value] of templates.entries()){
      await lesson.getByRole('button',{name:value,exact:true}).click();await expect(lesson).toHaveAttribute('data-template',String(index));
      for(const coords of [false,true])for(const dist of [false,true]){
        for(const [name,state] of [['Show coordinates',coords],['Show distance from origin',dist]] as const){const control=lesson.getByRole('switch',{name,exact:true});if(await control.getAttribute('aria-checked')!==String(state))await control.click();}
        await check();
      }
    }
    await lesson.getByRole('switch',{name:'Show dashed projections',exact:true}).click();await check();await lesson.getByRole('switch',{name:'Show dashed projections',exact:true}).click();await check();
    for(const axis of ['x','y']){
      const input=lesson.getByRole('spinbutton',{name:`${axis}-coordinate value`,exact:true}),slider=lesson.getByRole('slider',{name:`${axis}-coordinate drag control`,exact:true});
      await expect(input).toHaveAttribute('min','-10');await expect(input).toHaveAttribute('max','10');await expect(slider).toHaveAttribute('step','1');
      await input.fill('3.6');await expect(lesson).toHaveAttribute(`data-${axis}`,'4');await check();
      await lesson.getByRole('button',{name:`Decrease ${axis}`,exact:true}).click();await expect(lesson).toHaveAttribute(`data-${axis}`,'3');
      await lesson.getByRole('button',{name:`Increase ${axis}`,exact:true}).click();await expect(lesson).toHaveAttribute(`data-${axis}`,'4');
      await slider.focus();await page.keyboard.press('Home');await expect(lesson).toHaveAttribute(`data-${axis}`,'-10');await check();await page.keyboard.press('End');await expect(lesson).toHaveAttribute(`data-${axis}`,'10');await check();
      await input.fill('20');await expect(lesson).toHaveAttribute(`data-${axis}`,'10');await input.fill('-20');await expect(lesson).toHaveAttribute(`data-${axis}`,'-10');
      await input.fill(axis==='x'?'3':'2');
    }
    await lesson.getByRole('button',{name:'Reset',exact:true}).click();await check();
    const point=graph.getByTestId('dynamic-label-point-handle');await point.focus();await page.keyboard.press('ArrowRight');await expect(lesson).toHaveAttribute('data-x','4');await check();
    await point.evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));let box=await point.boundingBox();if(!box)throw new Error('Missing P');
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2-40,box.y+box.height/2,{steps:4});await page.mouse.up();await expect(lesson).not.toHaveAttribute('data-x','4');await check();
    await point.evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));box=await point.boundingBox();if(!box)throw new Error('Missing P after mouse drag');
    const previousY=await lesson.getAttribute('data-y'),cdp=await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:box.x+box.width/2,y:box.y+box.height/2+40}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await expect(lesson).not.toHaveAttribute('data-y',previousY!);await check();
    await graph.getByRole('button',{name:'Zoom graph in',exact:true}).click();await expect(frame).not.toHaveAttribute('data-x-min',original!);await graph.getByRole('button',{name:'Zoom graph out',exact:true}).click();expect(Number(await frame.getAttribute('data-x-min'))).toBeCloseTo(Number(original));
    await graph.locator('svg').focus();await page.keyboard.press('ArrowRight');await expect(frame).not.toHaveAttribute('data-x-min',original!);await graph.getByRole('button',{name:'Reset graph view',exact:true}).click();await expect(frame).toHaveAttribute('data-x-min',original!);
    for(const [i,value] of ['Interaction','Explain','Examples','Formulas','Know more'].entries()){
      await lesson.locator('.labels-tabs').getByRole('button').filter({hasText:value}).click();await expect(lesson).toHaveAttribute('data-view',String(i));const tab=page.getByRole('tab',{name:'Interaction + visualization',exact:true});if(await tab.count())await tab.click();
    }
    await lesson.locator('.labels-tabs').getByRole('button').filter({hasText:'Interaction'}).click();await lesson.getByRole('button',{name:'Reset',exact:true}).click();await expect(lesson).toHaveAttribute('data-x','3');await expect(lesson).toHaveAttribute('data-y','2');await expect(lesson).toHaveAttribute('data-template','0');await check();
    await lesson.getByRole('button',{name:'Share',exact:true}).click();expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe('P = (3, 2), distance = 3.61');
    for(const name of ['Sitemap','Docs','About']){const actions=Number(await lesson.getAttribute('data-actions'));await lesson.getByRole('button',{name,exact:true}).click();await expect(lesson).toHaveAttribute('data-actions',String(actions+1));}
    for(const dark of [false,true]){await page.evaluate(value=>document.documentElement.classList.toggle('dark',value),dark);expect(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)).toBe(false);await graph.locator('svg').evaluate(element=>element.scrollIntoView({block:'center',behavior:'instant'}));await graph.locator('svg').screenshot({path:`test-evidence/shared-lesson-graphs/27/graph-${width}-${dark?'dark':'light'}.png`});await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.screenshot({path:`test-evidence/shared-lesson-graphs/27/tested-${width}-${dark?'dark':'light'}.png`,fullPage:true});}
    expect(errors).toEqual([]);
  });
}


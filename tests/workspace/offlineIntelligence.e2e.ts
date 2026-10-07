import { test, expect } from '@playwright/test';
test.setTimeout(120_000);

test('home chat close button stays visible after scrolling a generated triangle',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();
  await page.getByLabel('What would you like to create or solve?').fill('Create a triangle base 6 height 4');
  await page.getByRole('button',{name:'Run request',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Created 2D triangle'})).toBeVisible();
  await expect(page.getByLabel('Graph 3 expression')).toBeVisible();
  const close=page.getByRole('button',{name:'Close Ruhi',exact:true});
  const before=await close.boundingBox();
  await page.locator('.robo-panel-content').evaluate(node=>{node.scrollTop=node.scrollHeight;});
  expect(await page.locator('.robo-panel-content').evaluate(node=>node.scrollTop)).toBeGreaterThan(0);
  const after=await close.boundingBox();expect(after!.y).toBeCloseTo(before!.y);
  await expect(close).toBeVisible();await close.click();
  await expect(page.getByRole('dialog',{name:'Ruhi solver and drawing assistant'})).toHaveCount(0);
});

for(const path of ['/workspace/graph','/workspace/geometry','/workspace/3d','/math-lab/3d-graphing']) {
  test(`creates and transforms shapes in ${path}`,async({page})=>{
    const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto(path);await page.getByRole('button',{name:'Ask Math · Offline'}).click();
    await expect(page.getByRole('button',{name:/undo/i}).first()).toBeVisible();
    const three=path==='/workspace/3d'||path==='/math-lab/3d-graphing';
    const request=async(text:string,result:string)=>{await page.getByLabel('What would you like to create or solve?').fill(text);await page.getByRole('button',{name:'Run request',exact:true}).click();await expect(page.getByRole('status').filter({hasText:result})).toBeVisible();};
    await request(three?'Create a cuboid 6 by 4 by 3':'Create triangle base 6 height 4',three?'Created 3D cuboid':'Created 2D triangle');
    const shape=three?'cuboid':'triangle';
    const before=path==='/workspace/geometry'?await page.getByTestId('workspace-geometry-board').locator('polygon').last().getAttribute('points'):undefined;
    await request('Resize it to width 8 height 5',`Updated ${shape}`);
    await request('Rotate it 45 degrees',`Updated ${shape}`);
    if(three)await request('Tilt it 30 degrees around x axis',`Updated ${shape}`);
    await request('Make it purple',`Updated ${shape}`);
    if(path==='/workspace/graph')expect(await page.locator('input').evaluateAll(nodes=>nodes.map(n=>n.value).filter(v=>v.startsWith('param(')).length)).toBe(3);
    if(path==='/workspace/geometry'){await expect(page.getByTestId('workspace-geometry-board').locator('polygon')).toHaveCount(1);expect(await page.getByTestId('workspace-geometry-board').locator('polygon').last().getAttribute('points')).not.toBe(before);}
    if(path==='/workspace/3d')await expect(page.locator('.os-measurements')).toContainText('120.00');
    await page.screenshot({path:`artifacts/offline-intelligence/expanded-${path.replaceAll('/','-')}.png`});
    expect(errors).toEqual([]);
  });
}

test('robot solves posted problems and draws a graph in the active 2D workspace',async({page})=>{
  await page.goto('/workspace/graph');
  const robot=page.getByRole('button',{name:'Ask Math · Offline'});
  await expect(robot.locator('.math-robo')).toBeVisible();
  await robot.click();
  const panel=page.getByRole('dialog',{name:'Ruhi solver and drawing assistant'});
  await expect(panel).toBeVisible();
  const editor=page.getByLabel('What would you like to create or solve?');
  await expect(editor).toBeFocused();
  await editor.fill('2x + 5 = 15');
  await page.getByRole('button',{name:'Run request',exact:true}).click();
  await expect(panel.getByRole('status')).toContainText('x = 5');
  await panel.getByText('Show solution steps').click();
  await expect(panel.locator('ol li').first()).toBeVisible();
  await editor.fill('Can you draw a graph of y = x^3 - 2*x?');
  await page.getByRole('button',{name:'Run request',exact:true}).click();
  await expect(panel.getByRole('status')).toContainText('Added 2D graph: y = x^3 - 2*x');
  await expect(page.locator('.offline-assistant .geo-embedded-graph')).toHaveCount(0);
  await expect.poll(async()=>page.locator('input,textarea').evaluateAll(nodes=>nodes.map(n=>(n as HTMLInputElement).value))).toContain('x^3 - 2*x');
  await page.screenshot({path:'artifacts/offline-intelligence/math-robo-2d.png'});
  await editor.press('Escape');
  await expect(panel).toHaveCount(0);
  await expect(robot).toBeFocused();
});

test('home command library exposes triangle and editing examples',async({page})=>{
  await page.goto('/');await page.getByRole('button',{name:'Ask Math · Offline'}).click();
  await page.getByText('Command library · 520 examples', {exact:true}).click();
  await page.getByLabel('Find an example').fill('triangle');
  await page.getByRole('button',{name:'Create a triangle width 6 height 4 radius 2',exact:true}).click();
  await expect(page.getByLabel('What would you like to create or solve?')).toHaveValue('Create a triangle width 6 height 4 radius 2');
  await page.getByRole('button',{name:'Run request',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Created 2D triangle'})).toBeVisible();
});

test('robot panel fits a mobile 2D graph screen',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto('/workspace/graph');
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();
  const panel=page.getByRole('dialog',{name:'Ruhi solver and drawing assistant'});
  const box=await panel.boundingBox();
  expect(box).toBeTruthy();
  expect(box!.x).toBeGreaterThanOrEqual(0);expect(box!.x+box!.width).toBeLessThanOrEqual(390);
  await page.screenshot({path:'artifacts/offline-intelligence/math-robo-mobile.png'});
});

test('ordinary page embeds an editable graph and runs without network access',async({page,context})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Ask Math · Offline'}).click();
  // Warm bundled visual code before blocking all external access.
  await page.getByLabel('What would you like to create or solve?').fill('Embed plot sin(x)');
  await page.getByRole('button',{name:'Run request',exact:true}).click();
  await expect(page.getByText('Your requested visual · 2D Graph workspace')).toBeVisible();
  await expect(page.locator('.geo-embedded-graph svg[aria-label]').first()).toBeVisible();
  await context.setOffline(true);
  await page.getByLabel('What would you like to create or solve?').fill('Create a rectagle 6 by 4');
  await page.getByRole('button',{name:'Run request',exact:true}).click();
  await expect(page.getByRole('status').filter({hasText:'Width 6, height 4'})).toBeVisible();
  await expect(page.getByLabel('Graph 4 expression')).toBeVisible();
  // Embedded drawings must not be covered by the automatic selected-function pane.
  await expect(page.locator('.geo-embedded-graph .mws-inspector')).toHaveCount(0);
  await expect(page.locator('.geo-embedded-graph svg[aria-label]').first()).toBeVisible();
});

for (const [path,request,answer] of [
  ['/workspace/graph','Create rectangle 6 by 4','Created 2D rectangle'],
  ['/math-lab/3d-graphing','Plot z = x^2+y^2','Added 3D graph'],
  ['/workspace/geometry','Create circle radius 2','Created 2D circle'],
  ['/workspace/3d','Create sphere radius 2','Created 3D sphere'],
]) {
  test(`draws directly in ${path}`,async({page})=>{
    await page.goto(path);
    await page.getByRole('button',{name:'Ask Math · Offline'}).click();
    await page.waitForTimeout(1000);
    await page.getByLabel('What would you like to create or solve?').fill(request);
    await page.getByRole('button',{name:'Run request',exact:true}).click();
    await expect(page.getByRole('status').filter({hasText:answer})).toBeVisible();
    await expect(page.locator('.offline-assistant .geo-embedded-graph')).toHaveCount(0);
    await expect(page.getByRole('button',{name:/undo/i}).first()).toBeEnabled();
  });
}

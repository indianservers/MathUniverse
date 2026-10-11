import { expect, test, type Page } from '@playwright/test';
test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
test.setTimeout(120000);
async function panel(page: Page, tab: string) {
  await page.getByRole('button', { name: 'Mobile controls', exact: true }).tap();
  const p = page.getByRole('dialog', { name: 'Mobile controls', exact: true });
  await p.getByRole('navigation').getByRole('button', { name: tab, exact: true }).tap(); return p;
}
async function drag(page: Page, selector: string) {
  const b = (await page.locator(selector).boundingBox())!;
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: b.x + b.width * .02, y: b.y + b.height * .3 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: b.x + b.width * .98, y: b.y + b.height * .98 }] });
  await expect(page.locator('.mws-selection-box')).toBeVisible();
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await cdp.detach();
}
test('2D rectangle touch drag marks points without moving them', async ({page}) => {
  await page.goto('/workspace/geometry', { waitUntil: 'domcontentloaded' });
  const board = page.getByTestId('workspace-geometry-board'); await expect(board).toBeVisible();
  await page.getByRole('navigation', {name:'Essential geometry tools'}).getByRole('button',{name:'Point',exact:true}).tap();
  const b = (await board.boundingBox())!;
  await page.touchscreen.tap(b.x+b.width*.4,b.y+b.height*.6); await page.touchscreen.tap(b.x+b.width*.65,b.y+b.height*.7);
  const before = await board.locator('[data-point-id]').evaluateAll(nodes=>nodes.map(n=>[n.getAttribute('cx'),n.getAttribute('cy')]));
  const p = await panel(page,'View'); await p.getByRole('button',{name:'Rectangle select',exact:true}).tap();
  await drag(page,'.mws-rectangle-layer');
  await expect(p).toContainText('2 marked');
  expect(await board.locator('[data-point-id]').evaluateAll(nodes=>nodes.map(n=>[n.getAttribute('cx'),n.getAttribute('cy')]))).toEqual(before);
});
test('3D cube faces, rectangle selection and real surface placement', async ({page}) => {
  await page.goto('/workspace/3d', { waitUntil: 'domcontentloaded' });
  const cube=page.getByRole('navigation',{name:'3D orientation cube'});await expect(cube).toBeVisible();
  for(const face of ['front','right','back','left','top','bottom']) await cube.getByRole('button',{name:`View ${face} face`,exact:true}).tap();
  await cube.getByRole('button',{name:'View front face',exact:true}).tap();
  let p=await panel(page,'View');await p.getByRole('button',{name:'Rectangle select',exact:true}).tap();await drag(page,'.mws-rectangle-layer');
  await expect(p.locator('.mws-object-row input:checked').first()).toBeVisible();
  await p.locator('.mws-object-row').first().getByRole('button').first().tap();
  await p.getByRole('navigation').getByRole('button',{name:'Edit',exact:true}).tap();
  const old=await p.getByRole('spinbutton',{name:'Y position',exact:true}).inputValue();
  await p.getByRole('button',{name:'Place on another surface',exact:true}).tap();
  const layer=page.getByLabel('Surface placement canvas');await expect(layer).toBeVisible();const b=(await page.locator('canvas').first().boundingBox())!;
  for(const y of [.4,.45,.5,.55,.6,.65,.7,.8]) { for(const x of [.2,.3,.4,.5,.6,.7,.8]) { if(!await layer.count()) break; await page.touchscreen.tap(b.x+b.width*x,b.y+b.height*y); } if(!await layer.count()) break; }
  await expect(layer).toHaveCount(0);
  p=await panel(page,'Edit');
  const positions=await Promise.all(['X','Y','Z'].map(axis=>p.getByRole('spinbutton',{name:`${axis} position`,exact:true}).inputValue()));
  expect(positions.join(',')).not.toBe(`0,${old},0`);
  await page.getByRole('button',{name:'Undo mobile change',exact:true}).tap();
  await p.getByRole('button',{name:'Place on another surface',exact:true}).tap();
  await page.getByLabel('Surface placement canvas').getByRole('button',{name:'Cancel',exact:true}).tap();
  await expect(page.getByLabel('Surface placement canvas')).toHaveCount(0);
});

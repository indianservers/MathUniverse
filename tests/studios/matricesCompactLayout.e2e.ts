import { expect, test } from '@playwright/test';
import { matrixOperations } from '../../src/data/matrixOperations';

test('every matrix operation pairs inputs/visualization and explanation/answer on desktop',async({page})=>{
  test.setTimeout(120_000);
  await page.setViewportSize({width:1920,height:1080});
  const errors:string[]=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const operation of matrixOperations){
    await page.goto(operation.route);
    await expect(page.locator('.matrix-operation-page'),operation.id).toBeVisible();
    if(operation.id==='basics')continue;
    const controls=await page.locator('.matrix-operation-controls').boundingBox();
    const visualization=await page.locator('.matrix-operation-visualization').boundingBox();
    const steps=await page.locator('.matrix-operation-steps').boundingBox();
    const answer=await page.locator('.matrix-operation-solution .matrix-operation-answer').boundingBox();
    expect(controls,operation.id).not.toBeNull();
    expect(visualization!.x,operation.id).toBeGreaterThan(controls!.x+controls!.width);
    expect(Math.abs(visualization!.y-controls!.y),operation.id).toBeLessThan(2);
    expect(answer!.x,operation.id).toBeGreaterThan(steps!.x+steps!.width);
    expect(Math.abs(answer!.y-steps!.y),operation.id).toBeLessThan(2);
    expect(await page.locator('.matrix-operation-page').evaluate(el=>el.scrollWidth<=el.clientWidth+1),operation.id).toBe(true);
  }
  expect(errors).toEqual([]);
});

test('matrix pages stack safely on phones and transpose still updates and steps',async({page})=>{
  test.setTimeout(120_000);
  await page.setViewportSize({width:390,height:844});
  for(const operation of matrixOperations){
    await page.goto(operation.route);
    await expect(page.locator('.matrix-operation-page')).toBeVisible();
    expect(await page.locator('.matrix-operation-page').evaluate(el=>el.scrollWidth<=el.clientWidth+1),operation.id).toBe(true);
    if(operation.id==='basics')continue;
    const controls=await page.locator('.matrix-operation-controls').boundingBox();
    const visualization=await page.locator('.matrix-operation-visualization').boundingBox();
    const steps=await page.locator('.matrix-operation-steps').boundingBox();
    const answer=await page.locator('.matrix-operation-solution .matrix-operation-answer').boundingBox();
    expect(visualization!.y,operation.id).toBeGreaterThanOrEqual(controls!.y+controls!.height);
    expect(answer!.y,operation.id).toBeGreaterThanOrEqual(steps!.y+steps!.height);
  }
  await page.goto('/matrices/transpose');
  await page.getByRole('textbox',{name:'Matrix A row 1 column 2',exact:true}).fill('9');
  await expect(page.locator('.matrix-operation-answer .result-pop')).toHaveText(['1','4','9','5','3','6']);
  await page.getByRole('button',{name:'Next Step',exact:true}).click();
  await expect(page.locator('.matrix-operation-steps')).toContainText('Step 2 of 6');
  await page.setViewportSize({width:390,height:3600});
  await page.locator('.matrix-operation-page').evaluate(el=>el.scrollIntoView({block:'start'}));
  await page.locator('.matrix-operation-page').screenshot({path:'artifacts/matrices-compact-mobile.png'});
  await page.setViewportSize({width:1920,height:1600});
  await page.locator('.matrix-operation-page').screenshot({path:'artifacts/matrices-compact-desktop.png'});
});

import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

test('nine reference-style topic icons animate, respond to pointer input and open their labs',async({page})=>{
  const current=readFileSync('src/pages/AlgebraStudio.tsx','utf8');
  const original=execFileSync('git',['show','HEAD:src/pages/AlgebraStudio.tsx'],{encoding:'utf8'});
  const hero=/<CinematicHero id="algebra">[\s\S]*?<\/CinematicHero>/;
  expect(current.match(hero)?.[0].replaceAll('\r\n','\n')).toBe(original.match(hero)?.[0].replaceAll('\r\n','\n'));
  await page.setViewportSize({width:1672,height:1200});
  await page.goto('/algebra');
  const icons=page.locator('.alg-topic-art');
  await expect(icons).toHaveCount(9);
  for(const icon of await icons.all()) {
    await icon.scrollIntoViewIfNeeded();
    await expect(icon).toHaveClass(/is-visible/);
    expect(await icon.locator('img').evaluate((image:HTMLImageElement)=>image.complete&&image.naturalWidth>0)).toBe(true);
  }
  const first=icons.first();
  await first.hover();
  const box=await first.boundingBox();
  await page.mouse.move(box!.x+box!.width*.8,box!.y+box!.height*.2);
  expect(await first.evaluate(el=>getComputedStyle(el).getPropertyValue('--art-rotate-y').trim())).not.toBe('0deg');
  const image=first.locator('img');
  const before=await image.evaluate(el=>getComputedStyle(el).transform);
  await page.waitForTimeout(120);
  expect(await image.evaluate(el=>getComputedStyle(el).transform)).not.toBe(before);
  await page.locator('.alg-launch-grid').screenshot({path:'artifacts/algebra-animated-topic-icons-desktop.png'});
  await first.click();
  await expect(page).toHaveURL(/\/algebra\/expressions/);
});

test('icons fit mobile cards and stop animating with reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.setViewportSize({width:390,height:1800});
  await page.goto('/algebra');
  const grid=page.locator('.alg-launch-grid');
  await grid.scrollIntoViewIfNeeded();
  await page.locator('.alg-topic-art__image').evaluateAll(images=>Promise.all(images.map(image=>(image as HTMLImageElement).decode())));
  expect(await grid.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  for(const image of await page.locator('.alg-topic-art__image').all())expect(await image.evaluate(el=>getComputedStyle(el).animationName)).toBe('none');
  await grid.screenshot({path:'artifacts/algebra-animated-topic-icons-mobile.png'});
});

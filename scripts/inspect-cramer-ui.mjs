import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://127.0.0.1:2266/lessons/school/class-12/class-12-matrices-and-determinants-cramer-s-rule');
await page.locator('.cr10198-page').waitFor();
const checks = [];
for (const width of [1920,1536,1440,1366,1024,768,390,360]) {
  await page.setViewportSize({ width, height: 900 });
  checks.push({ width, clipped: await page.locator('.cr10198-page').evaluate(root => [...root.querySelectorAll('input,button,p,h1,h2,h3,.cr-matrix,.cr-work')].filter(e => e.scrollWidth > e.clientWidth + 2).map(e => ({ tag: e.tagName, class: e.className, text: e.textContent?.slice(0,50), width: e.clientWidth, scroll: e.scrollWidth }))) });
  if ([1920,768,360].includes(width)) {
    for (const name of ['cr-system','cr-build','cr-verify','cr-practice']) await page.locator(`.${name}`).screenshot({ path: `test-evidence/lesson-ui-ux/10198/detail-${width}-${name}.png` });
  }
}
writeFileSync('test-evidence/lesson-ui-ux/10198/clipping.json', JSON.stringify(checks, null, 2));
console.log(checks);
await browser.close();

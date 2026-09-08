import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const phase = process.argv[2] ?? 'baseline';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
const dir = 'test-evidence/lesson-ui-ux/10198';
mkdirSync(dir, { recursive: true });
await page.goto('http://127.0.0.1:2266/lessons/school/class-12/class-12-matrices-and-determinants-cramer-s-rule');
await page.locator('.cr10198-page').waitFor();
await page.evaluate(() => globalThis.document.fonts.ready);
const results = [];
for (const [width, height] of [[1920,1080],[1536,864],[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[360,800]]) {
  await page.setViewportSize({ width, height });
  await page.screenshot({ path: `${dir}/${phase}-${width}.png`, fullPage: true });
  results.push(await page.locator('.cr10198-page').evaluate((root, size) => ({ viewport: size, width: root.getBoundingClientRect().width, height: root.getBoundingClientRect().height, font: globalThis.getComputedStyle(root).fontSize, overflow: globalThis.document.documentElement.scrollWidth > globalThis.innerWidth, values: {...root.dataset}, tiny: [...root.querySelectorAll('p,button,input,h1,h2,h3')].filter(e => parseFloat(globalThis.getComputedStyle(e).fontSize) < 13).length, smallControls: [...root.querySelectorAll('button,input')].filter(e => e.getBoundingClientRect().height < 43).length }), { width, height }));
}
writeFileSync(`${dir}/${phase}.json`, JSON.stringify({ results, errors }, null, 2));
console.log(JSON.stringify({ results, errors }));
await browser.close();


import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-evidence/phase-3/3d-graph');
const results = { startedAt: new Date().toISOString(), steps: [], consoleErrors: [], pageErrors: [] };
const note = (name, data = {}) => results.steps.push({ name, at: new Date().toISOString(), ...data });
const domClick = locator => locator.evaluate(element => element.click());

const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-webgl'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
const page = await context.newPage();
page.on('console', message => { if (message.type() === 'error') results.consoleErrors.push(message.text()); });
page.on('pageerror', error => results.pageErrors.push(String(error)));

try {
  await page.goto('http://127.0.0.1:5173/math-lab/3d-graphing', { waitUntil: 'networkidle', timeout: 60_000 });
  await page.locator('.gs3d-status').waitFor({ timeout: 30_000 });
  note('desktop launch', { footer: await page.locator('.gs3d-status').innerText() });
  await page.screenshot({ path: path.join(outDir, '3DGR-001-desktop-launch.png'), fullPage: true });

  await domClick(page.getByRole('button', { name: 'properties', exact: true }));
  const sliders = page.locator('.gs3d-right-panel input[type="range"]');
  const sliderCount = await sliders.count();
  await sliders.nth(sliderCount - 1).fill('12');
  await page.waitForTimeout(500);
  note('mesh low resolution', { sliderCount, footer: await page.locator('.gs3d-status').innerText() });

  const add = page.getByRole('button', { name: 'Add expression', exact: true });
  const start = Date.now();
  for (let index = 1; index < 50; index += 1) {
    await domClick(add);
    if (index % 10 === 0) note('stress progress', { surfaces: index + 1, elapsedMs: Date.now() - start });
  }
  await page.waitForTimeout(2_000);
  note('50-surface stress', { elapsedMs: Date.now() - start, footer: await page.locator('.gs3d-status').innerText() });
  await page.screenshot({ path: path.join(outDir, '3DGR-065-50-surfaces.png'), fullPage: true });

  const activeCard = page.locator('.gs3d-expression.active');
  const expressionButton = activeCard.locator('.expression-text');
  await domClick(expressionButton);
  const edit = activeCard.getByRole('textbox', { name: /Edit .* expression/ });
  await edit.fill('(');
  await page.waitForTimeout(300);
  const invalidAlert = await activeCard.getByRole('alert').innerText().catch(() => 'no alert');
  note('invalid expression', { input: '(', alert: invalidAlert, footer: await page.locator('.gs3d-status').innerText() });
  await edit.fill('x+y');
  await edit.press('Enter');
  await page.waitForTimeout(300);
  note('invalid recovery', { recovered: !(await activeCard.getByRole('alert').isVisible().catch(() => false)) });

  await domClick(page.getByRole('button', { name: /Hide Surface 50/i })).catch(async () => {
    await domClick(activeCard.getByRole('button', { name: /^Hide / }));
  });
  const afterHide = await page.locator('.gs3d-status').innerText();
  await domClick(page.getByTitle(/^Undo/));
  const afterUndo = await page.locator('.gs3d-status').innerText();
  await domClick(page.getByTitle(/^Redo/));
  const afterRedo = await page.locator('.gs3d-status').innerText();
  note('hide undo redo', { afterHide, afterUndo, afterRedo });

  await domClick(page.getByRole('button', { name: 'Save', exact: true }));
  note('save stress scene', { localStorageKeys: await page.evaluate(() => Object.keys(localStorage)) });

  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(300);
  note('tablet responsive', {
    mobileNavVisible: await page.locator('.gs3d-mobile-nav').isVisible(),
    saveVisible: await page.getByRole('button', { name: 'Save', exact: true }).isVisible().catch(() => false),
    bodyScrollWidth: await page.evaluate(() => document.body.scrollWidth),
    viewportWidth: await page.evaluate(() => innerWidth),
  });
  await page.screenshot({ path: path.join(outDir, '3DGR-001-tablet-768x1024.png'), fullPage: true });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(300);
  note('mobile responsive', {
    mobileNavVisible: await page.locator('.gs3d-mobile-nav').isVisible(),
    saveVisible: await page.getByRole('button', { name: 'Save', exact: true }).isVisible().catch(() => false),
    undoVisible: await page.getByTitle(/^Undo/).isVisible().catch(() => false),
    bodyScrollWidth: await page.evaluate(() => document.body.scrollWidth),
    viewportWidth: await page.evaluate(() => innerWidth),
  });
  await page.screenshot({ path: path.join(outDir, '3DGR-001-mobile-390x844.png'), fullPage: true });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('.gs3d-status').waitFor();
  note('reload after explicit save', { footer: await page.locator('.gs3d-status').innerText() });
  await domClick(page.getByRole('button', { name: 'Settings', exact: true }));
  note('saved library entry', { settingsText: await page.locator('body').innerText().then(t => t.match(/Saved graphs[\s\S]{0,500}/)?.[0] || 'not found') });
  results.completedAt = new Date().toISOString();
} catch (error) {
  results.fatal = String(error?.stack || error);
  try { await page.screenshot({ path: path.join(outDir, '3DGR-ui-audit-failure.png'), fullPage: true }); } catch {}
  process.exitCode = 1;
} finally {
  await fs.writeFile(path.join(outDir, 'ui-audit-results.json'), JSON.stringify(results, null, 2));
  await browser.close();
}

import fs from 'node:fs/promises';
import { chromium } from 'playwright';

const directory = 'artifacts/lesson-review';
const output = process.env.LESSON_AUDIT_OUTPUT ?? 'pending-batch-validation';
const selectedIds = process.env.LESSON_AUDIT_IDS?.split(',').map(Number);
const register = JSON.parse(await fs.readFile(`${directory}/enhancement-register.json`, 'utf8'));
const pending = register.filter(lesson => selectedIds ? selectedIds.includes(lesson.id) : !lesson.reviewed).sort((a,b) => (a.id === 558 ? 1 : b.id === 558 ? -1 : 0));
console.log(`Starting ${pending.length} pending audits`);
const browser = await chromium.launch({ headless: true, timeout: 30000 });
console.log('Browser launched');
let results = [];
let saving = Promise.resolve();
try { results = JSON.parse(await fs.readFile(`${directory}/${output}.json`, 'utf8')).results.filter(r => r.passed); } catch { /* First audit run. */ }
const pages = await Promise.all(Array.from({length:4}, () => browser.newPage({ viewport: { width: 1365, height: 900 } })));
for (const page of pages) page.setDefaultTimeout(15000);
for (let offset = 0; offset < pending.length; offset += 50) {
  const batch = pending.slice(offset, offset + 50);
  let cursor = 0;
  await Promise.all(pages.map(async page => {
  while (cursor < batch.length) {
    const lesson = batch[cursor++];
    if (results.some(r => r.id === lesson.id && r.passed)) continue;
    console.log(`Opening ${lesson.id}`);
    const errors = [];
    const onError = error => errors.push(error.message);
    page.on('pageerror', onError);
    const result = { id: lesson.id, title: lesson.title, route: lesson.route, checkedAt: new Date().toISOString(), batch: offset / 50 + 1, checks: {}, errors };
    try {
      const response = await page.goto(`http://127.0.0.1:5176${lesson.route}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      console.log(`Loaded ${lesson.id}`);
      await page.locator('h1:visible').first().waitFor({ timeout: 60000 });
      await page.getByText('Loading lesson interaction', { exact: true }).waitFor({ state: 'hidden', timeout: 60000 });
      console.log(`Interaction ready ${lesson.id}`);
      result.checks.http = response.status() === 200;
      result.checks.heading = await page.locator('h1').allTextContents();
      const panel = page.locator('.lesson-study-session');
      result.checks.studyPanel = await panel.count() === 1;
      if (result.checks.studyPanel) {
        await panel.locator('.study-session-header button').click();
        await panel.getByRole('tab', { name: 'Practice', exact: true }).click();
        await panel.getByRole('button', { name: 'Check my answer', exact: true }).click();
        result.checks.emptyAnswerGuard = await panel.getByText('Enter an answer before checking.', { exact: true }).isVisible();
        result.checks.reasoningGuard = await panel.getByRole('button', { name: 'Show reasoning', exact: true }).isDisabled();
        await panel.getByRole('button', { name: 'Get a hint', exact: true }).click();
        result.checks.hint = await panel.locator('.study-hint').count() > 0;
        await panel.getByRole('button', { name: 'Reset study session', exact: true }).click();
        result.checks.undo = await panel.getByRole('button', { name: 'Undo reset', exact: true }).isVisible();
      }
      result.checks.desktopOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2);
      await page.setViewportSize({ width: 390, height: 844 });
      result.checks.mobileOverflow = await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 2);
      await page.setViewportSize({ width: 1365, height: 900 });
      const snapshot = await page.locator('body').ariaSnapshot();
      await fs.writeFile(`${directory}/page-${lesson.id}.json`, JSON.stringify({ ...result, snapshot }));
      result.passed = result.checks.http && result.checks.heading.length > 0 && result.checks.studyPanel && result.checks.emptyAnswerGuard && result.checks.reasoningGuard && result.checks.hint && result.checks.undo && result.checks.desktopOverflow && result.checks.mobileOverflow && errors.length === 0;
    } catch (error) { result.failure = error.message; result.passed = false; }
    page.off('pageerror', onError);
    results.push(result);
    console.log(JSON.stringify({ id: lesson.id, passed: result.passed, failure: result.failure, checks: result.checks, errors }));
    saving = saving.then(() => fs.writeFile(`${directory}/${output}.json`, JSON.stringify({ total: pending.length, completed: results.length, results }, null, 2)));
    await saving;
  }
  }));
  console.log(`Batch ${offset / 50 + 1}: ${batch.length} audited`);
}
await browser.close();
/* global document, innerWidth */

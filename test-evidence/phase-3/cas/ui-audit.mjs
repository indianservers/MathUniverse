import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

const outDir = path.resolve('test-evidence/phase-3/cas');
const audit = { startedAt: new Date().toISOString(), cases: [], consoleErrors: [], pageErrors: [] };
const cases = [
  [2,'simplify','2+3*4'], [3,'simplify','1/2+1/3'], [4,'simplify','1/3'], [5,'simplify','sqrt(16)+2^3'],
  [6,'simplify','pi+e+i'], [7,'simplify','(2+3)*4'], [8,'expand','2x+3(x+1)'],
  [10,'simplify','foo(@'], [11,'simplify','-(1/2-(3^2-sqrt(16)))'], [12,'simplify','2*x+3*x-y+y'],
  [13,'expand','(x+1)^2'], [14,'factor','x^2-5*x+6'], [15,'simplify','(x^2-1)/(x-1)'],
  [16,'rationalize','1/sqrt(2)'], [17,'simplify','(x^2)^3/x^-2'], [18,'simplify','log(x*y)'],
  [19,'verify-identity','sin(x)^2+cos(x)^2, 1, x'], [20,'polynomial-divide','x^3-1, x-1, x'],
  [21,'solve','x+3=5'], [22,'solve','2*(x+1)=8'], [23,'solve','x^2-5*x+6=0'],
  [24,'complex-solve','x^2+1=0'], [25,'complete-square','x^2+6*x+5, x'], [26,'solve','x^3-6*x^2+11*x-6=0'],
  [27,'numeric-solve','x^5-x-1=0'], [28,'solve','1/(x-1)=2'], [29,'solve','sqrt(x+1)=x-1'],
  [30,'solve','abs(x-2)=3'], [31,'solve','2^x=8'], [32,'solve','log(x)=2'], [33,'solve','sin(x)=1/2'],
  [34,'inequality','-2*x>4'], [35,'inequality','x^2-1<=0'], [36,'inequality','(x-1)/(x+2)>0'], [37,'inequality','abs(x)<3'],
  [38,'system','x+y=5; x-y=1'], [39,'system','x+y+z=6; x-y+z=2; x+y-z=4'], [40,'system','y=x^2; y=x+2'],
  [41,'substitute','x^2+1, x=3'], [42,'substitute','x^2+1, x=y+1'], [43,'solve','y=2*x+3, x'],
  [44,'simplify','domain(sqrt(x-1))'], [45,'simplify','sin(pi/6)+cos(pi/3)'], [46,'simplify','180*pi/180'],
  [47,'verify-identity','tan(x), sin(x)/cos(x), x'], [48,'simplify','triangle(3,4,5)'],
  [49,'limit','x^2, x, 2'], [50,'limit','(x^2-1)/(x-1), x, 1'], [51,'differentiate','x^5-3*x^2+7, x'],
  [52,'differentiate','(x^2+1)*sin(x)/x, x'], [53,'differentiate','sin(x^2), x'], [54,'implicit-differentiate','x^2+y^2=25, x, y'],
  [55,'differentiate','diff(diff(sin(x),x),x), x'], [56,'differentiate','x^3-3*x, x'],
  [57,'integrate','x^2+sin(x), x'], [58,'integrate','2*x*cos(x^2), x'], [59,'integrate','x*exp(x), x'],
  [60,'integrate','1/(x^2-1), x'], [61,'definite-integral','x^2, 0, 2, x'], [62,'taylor','sin(x), x, 0, 5'],
  [63,'ode',"y'=y, x, y"], [64,'complex-solve','x^2+1=0'], [65,'matrix','[[1,2],[3,4]]'],
  [66,'rref','[[1,1,5],[1,-1,1]]'], [67,'simplify','cross([1,0,0],[0,1,0])'], [68,'simplify','gcd(84,30)+lcm(6,8)'],
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true, permissions: ['clipboard-read','clipboard-write'] });
const page = await context.newPage();
page.on('console', message => { if (message.type() === 'error') audit.consoleErrors.push(message.text()); });
page.on('pageerror', error => audit.pageErrors.push(String(error)));

const composer = page.locator('.cas-composer textarea');
const operation = page.locator('.cas-composer select[aria-label="CAS operation"]');
const run = page.locator('.cas-composer button.primary');
const readSelected = async () => ({
  input: await page.locator('.cas-object-row.is-active .cas-object-copy strong').innerText().catch(() => ''),
  summary: await page.locator('.cas-object-row.is-active .cas-object-copy small').innerText().catch(() => ''),
  exact: await page.locator('.cas-studio-right .cas-result-box').first().innerText().catch(() => ''),
  detail: await page.locator('.cas-studio-right .cas-inspector-card').first().locator('p').last().innerText().catch(() => ''),
  objectCount: await page.locator('.cas-object-row').count(),
});

try {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('http://127.0.0.1:5173/workspace/data/cas', { waitUntil: 'networkidle', timeout: 60_000 });
  await page.getByTestId('workspace-cas-studio').waitFor({ timeout: 30_000 });
  audit.launch = { title: await page.title(), objectCount: await page.locator('.cas-object-row').count(), bodyText: (await page.locator('body').innerText()).slice(0, 1200) };
  await page.screenshot({ path: path.join(outDir, 'CAS-001-desktop-launch.png'), fullPage: true });

  // CAS-001: empty submission must not create a cell or crash.
  const beforeEmpty = await page.locator('.cas-object-row').count();
  await composer.fill('');
  await run.click();
  audit.cases.push({ id: 1, operation: 'empty submit', beforeEmpty, afterEmpty: await page.locator('.cas-object-row').count() });

  // CAS-009: actual mathematical keyboard insertion and subsequent editing.
  await composer.fill('');
  await page.locator('.cas-keyboard').getByRole('button', { name: 'sqrt()', exact: true }).click();
  const keyboardInserted = await composer.inputValue();
  await composer.fill('sqrt(9)');
  audit.cases.push({ id: 9, operation: 'keyboard/edit', keyboardInserted, edited: await composer.inputValue() });

  for (const [id, op, input] of cases) {
    await operation.selectOption(op);
    await composer.fill(input);
    const before = await page.locator('.cas-object-row').count();
    const started = Date.now();
    await run.click({ timeout: 20_000 });
    await page.waitForFunction(previous => document.querySelectorAll('.cas-object-row').length >= Math.min(previous + 1, 40), before, { timeout: 20_000 }).catch(() => {});
    audit.cases.push({ id, operation: op, requestedInput: input, elapsedMs: Date.now() - started, ...(await readSelected()) });
  }

  // CAS-069: clipboard, export, undo/redo, automatic persistence/reload.
  await page.getByRole('button', { name: 'Copy exact result' }).click();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText()).catch(() => 'clipboard unavailable');
  const downloadEvent = page.waitForEvent('download', { timeout: 5000 }).catch(() => null);
  await page.getByRole('button', { name: 'Export', exact: true }).first().click();
  const download = await downloadEvent;
  const beforeUndo = await page.locator('.cas-object-row').count();
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  const afterUndo = await page.locator('.cas-object-row').count();
  await page.getByRole('button', { name: 'Redo', exact: true }).click();
  const afterRedo = await page.locator('.cas-object-row').count();
  await page.reload({ waitUntil: 'networkidle' });
  audit.cases.push({ id: 69, operation: 'history/copy/export/persistence', clipboard, downloadSuggestedFilename: download ? download.suggestedFilename() : null, beforeUndo, afterUndo, afterRedo, afterReload: await page.locator('.cas-object-row').count() });
  await page.screenshot({ path: path.join(outDir, 'CAS-069-persisted-session.png'), fullPage: true });

  // CAS-070: submit 100 mixed inputs through the real composer. The product caps history at 40.
  const stressInputs = [
    ['simplify','12345678901234567890^2'], ['factor','x^8-1'], ['matrix','[[1,2,3],[4,5,6],[7,8,10]]'],
    ['simplify','((((((1+2)*3)-4)^2)+sqrt(81))/5)'], ['simplify','foo(@'], ['differentiate','sin(x^2)*exp(x), x'],
    ['integrate','x*exp(x), x'], ['solve','x^3-6*x^2+11*x-6=0'],
  ];
  let submitted = 0;
  const stressStarted = Date.now();
  let stressError = null;
  for (let index = 0; index < 100; index += 1) {
    const [op, input] = stressInputs[index % stressInputs.length];
    try {
      await operation.selectOption(op, { timeout: 10_000 });
      await composer.fill(`${input}${index % 4 === 0 ? `+0*${index}` : ''}`, { timeout: 10_000 });
      await run.click({ timeout: 15_000 });
      submitted += 1;
    } catch (error) {
      stressError = String(error);
      break;
    }
  }
  audit.cases.push({ id: 70, operation: '100-expression stress', submitted, elapsedMs: Date.now() - stressStarted, objectCount: await page.locator('.cas-object-row').count(), stressError, selected: await readSelected() });
  await page.screenshot({ path: path.join(outDir, 'CAS-070-100-submissions.png'), fullPage: true }).catch(() => {});

  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(250);
  audit.mobile = { bodyScrollWidth: await page.evaluate(() => document.body.scrollWidth), viewportWidth: await page.evaluate(() => innerWidth), panelNavVisible: await page.locator('.cas-mobile-panels').isVisible() };
  await page.screenshot({ path: path.join(outDir, 'CAS-001-mobile-390x844.png'), fullPage: true });
  audit.completedAt = new Date().toISOString();
} catch (error) {
  audit.fatal = String(error?.stack || error);
  await page.screenshot({ path: path.join(outDir, 'CAS-ui-audit-failure.png'), fullPage: true }).catch(() => {});
  process.exitCode = 1;
} finally {
  await fs.writeFile(path.join(outDir, 'ui-audit-results.json'), JSON.stringify(audit, null, 2));
  await browser.close();
}

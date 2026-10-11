import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1365, height: 900 } });
  await page.goto('http://127.0.0.1:5176/lessons/discrete-and-applied-mathematics/558-permutations');
  const model = page.locator('.perm558-page');
  await model.waitFor();
  const progress = model.getByRole('progressbar', { name: 'Distinct ordered selections discovered' });
  assert.equal(await progress.getAttribute('value'), '0');
  await model.getByRole('button', { name: 'Place A in the next empty slot', exact: true }).click();
  await model.getByRole('button', { name: 'Place B in the next empty slot', exact: true }).click();
  assert.equal(await progress.getAttribute('value'), '1');
  await model.getByRole('button', { name: 'Shuffle objects', exact: true }).click();
  assert.match(await model.getByTestId('permutation-slot-1').getAttribute('aria-label'), /Slot 1: A/);
  assert.match(await model.getByTestId('permutation-slot-2').getAttribute('aria-label'), /Slot 2: B/);
  await model.getByTestId('permutation-slot-1').focus();
  await page.keyboard.press('Enter');
  assert.match(await model.getByTestId('permutation-slot-1').getAttribute('aria-label'), /empty/);
  await model.getByRole('spinbutton', { name: 'Object count', exact: true }).fill('6');
  assert.equal(await progress.getAttribute('value'), '0');
  assert.equal(await model.locator('.perm558-objects').first().getByRole('button').count(), 6);
  assert.match(await model.locator('.perm558-tree').innerText(), /F/);
  await model.getByRole('combobox', { name: 'Selection order', exact: true }).selectOption('3');
  assert.equal(await model.locator('.perm558-board .perm558-slots button').count(), 3);
  assert.match(await model.getByTestId('permutation-slot-3').innerText(), /3rd/);
  await page.setViewportSize({ width: 390, height: 844 });
  await model.locator('.perm558-board').screenshot({ path: 'artifacts/lesson-review/558-native-mobile.png' });
  await fs.writeFile('artifacts/lesson-review/558-native-validation.json', JSON.stringify({ id: 558, passed: true, checks: ['Zero initial discovery progress', 'Completed arrangement increments progress', 'Shuffle preserves arrangement', 'Keyboard slot removal', 'Six-object choices and tree', 'Object-count reset', 'Three ordered slots and ordinal', 'Mobile board screenshot'] }, null, 2));
  console.log('Permutations native repair checks passed');
} finally { await browser.close(); }

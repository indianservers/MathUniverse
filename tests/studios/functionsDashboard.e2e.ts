import { test, expect } from '@playwright/test';

test('all five function dashboards match their reference models on desktop and mobile', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1680, height: 1050 });
  for (const mode of ['Families', 'Transformations', 'Composition', 'Inverse', 'Piecewise']) {
    await page.goto(`/algebra/functions?mode=${mode}`);
    const lab = page.locator('.functions-reference-dashboard'); await expect(lab).toHaveAttribute('data-mode-canvas', mode);
    await expect(lab.getByRole('img', { name: /Interactive function graph/ })).toBeVisible();
    if (mode === 'Piecewise') { await expect(lab.locator('.fn-insights')).toContainText('f(2) = 4'); await expect(lab.locator('.fn-behavior')).toContainText('jump'); }
    if (mode === 'Composition') await expect(lab.locator('.fn-function-machine')).toContainText('1.5');
    expect(await lab.evaluate(el => el.scrollWidth <= el.clientWidth + 1), mode).toBe(true);
    await page.evaluate(() => { document.documentElement.classList.remove('dark'); let node = document.querySelector('.functions-reference-dashboard')?.parentElement; while (node) { node.style.overflow = 'visible'; node.style.height = 'auto'; node.style.maxHeight = 'none'; node = node.parentElement; } });
    await lab.screenshot({ animations: 'disabled', path: `artifacts/functions-reference-dashboard-${mode.toLowerCase()}.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(lab.locator('.fn-controls')).toBeVisible();
    expect(await lab.evaluate(el => el.scrollWidth <= el.clientWidth + 1), `${mode} mobile`).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
    if (mode === 'Piecewise') await lab.screenshot({ animations: 'disabled', path: 'artifacts/functions-reference-dashboard-mobile.png' });
    await page.setViewportSize({ width: 1680, height: 1050 });
  }
  expect(errors).toEqual([]);
});

test('piecewise editing, endpoint ownership, evaluation and continuity are linked', async ({ page }) => {
  await page.goto('/algebra/functions?mode=Piecewise');
  const lab = page.locator('.functions-reference-dashboard');
  await lab.getByLabel('Piece 1 function', { exact: true }).fill('1.5x + 1');
  await expect(lab.locator('.fn-behavior')).toContainText('Continuous');
  await lab.getByRole('button', { name: 'Challenge', exact: false }).click();
  await lab.getByRole('button', { name: 'Check challenge', exact: true }).click();
  await expect(lab.locator('.fn-challenge')).toContainText('Correct!');
  await lab.getByLabel('Piece 1 interval', { exact: true }).selectOption('<=');
  await expect(lab.locator('.fn-insights')).toContainText('Overlapping pieces');
  await lab.getByLabel('Piece 1 interval', { exact: true }).selectOption('<');
  await lab.getByRole('button', { name: 'Add Another Piece', exact: true }).click();
  await expect(lab.locator('.fn-piece')).toHaveCount(3);
  await lab.getByLabel('x =', { exact: true }).fill('5');
  await lab.getByRole('button', { name: 'Evaluate', exact: true }).click();
  await expect(lab.locator('.fn-insights')).toContainText('f(5) = 6');
  await lab.getByRole('button', { name: 'Delete piece 3', exact: true }).click();
  await expect(lab.locator('.fn-piece')).toHaveCount(2);
  await expect(lab.locator('.fn-insights')).toContainText('No piece applies');
});

test('transformations, composition, inverse branches and saved experiments work', async ({ page }) => {
  test.setTimeout(90_000);
  await page.goto('/algebra/functions?mode=Transformations'); const lab = page.locator('.functions-reference-dashboard');
  await lab.getByLabel('h slider', { exact: true }).fill('3');
  await expect(lab.locator('.fn-transform-steps')).toContainText('h = 3');
  await lab.getByRole('button', { name: 'Save', exact: true }).click();
  await lab.getByRole('button', { name: 'Shift right 2', exact: true }).click();
  await lab.getByRole('button', { name: 'Restore saved experiment', exact: true }).click();
  await expect(lab.getByLabel('h slider', { exact: true })).toHaveValue('3');
  await lab.getByRole('button', { name: 'Composition', exact: true }).click();
  await lab.getByRole('button', { name: 'g ∘ f', exact: false }).click();
  await expect(lab.locator('.fn-function-machine')).toContainText('5');
  await lab.getByRole('button', { name: 'Inverse', exact: true }).click();
  await lab.getByLabel('Domain restriction', { exact: true }).selectOption('left');
  await expect(lab.locator('.fn-insights')).toContainText('Left branch');
  await lab.getByLabel('Show inverse function', { exact: true }).uncheck();
  await expect(lab.locator('.fn-legend')).not.toContainText('f⁻¹');
  await lab.getByLabel('Input x', { exact: true }).fill('1');
  const graph = lab.getByRole('img', { name: /Interactive function graph/ }); await graph.focus(); await page.keyboard.press('ArrowRight');
  await expect(lab.getByLabel('Input x', { exact: true })).toHaveValue('1.1');
});

test('sharing preserves the experiment and challenges check the requested task', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/algebra/functions?mode=Transformations');
  const lab = page.locator('.functions-reference-dashboard');
  await lab.getByLabel('h slider', { exact: true }).fill('-3');
  await lab.getByLabel('k slider', { exact: true }).fill('2');
  await lab.getByLabel('a slider', { exact: true }).fill('0.5');
  await lab.locator('.fn-learn-4').click();
  await lab.getByRole('button', { name: 'Check challenge', exact: true }).click();
  await expect(lab.locator('.fn-challenge')).toContainText('Correct!');
  await lab.getByRole('button', { name: 'Share', exact: true }).click();
  await expect(lab.locator('.fn-notice')).toContainText('Link copied');
  const link = await page.evaluate(() => navigator.clipboard.readText());
  await page.goto(link);
  await expect(lab.getByLabel('h slider', { exact: true })).toHaveValue('-3');
  await lab.getByRole('button', { name: 'Save', exact: true }).click();
  await page.goto('/algebra/functions?mode=Transformations');
  await lab.getByRole('button', { name: 'Restore saved experiment', exact: true }).click();
  await expect(lab.getByLabel('a slider', { exact: true })).toHaveValue('0.5');
  await lab.getByRole('button', { name: 'Composition', exact: true }).click();
  await lab.locator('.fn-learn-4').click();
  await lab.getByLabel('Your answer', { exact: true }).fill('1/2');
  await lab.getByRole('button', { name: 'Check challenge', exact: true }).click();
  await expect(lab.locator('.fn-challenge')).toContainText('Correct!');
});

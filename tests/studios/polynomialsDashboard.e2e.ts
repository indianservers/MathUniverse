import { test, expect } from '@playwright/test';
test('five polynomial modes render linked reference dashboards on desktop and mobile', async ({ page }) => {
  test.setTimeout(120_000); const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1680, height: 1050 });
  for (const mode of ['Roots', 'Factors', 'Division', 'End Behavior', 'Multiplicity']) {
    await page.goto(`/algebra/polynomials?mode=${encodeURIComponent(mode)}`); const lab = page.locator('.polynomials-reference-dashboard');
    await expect(lab).toHaveAttribute('data-mode-canvas', mode); await expect(lab.getByRole('img', { name: /Interactive polynomial graph/ })).toBeVisible();
    await expect(lab.getByLabel('Root 1', { exact: true })).toHaveValue('-3');
    if (mode === 'End Behavior') await expect(lab.locator('.poly-end-summary')).toContainText('Both ends rise.');
    if (mode === 'Division') await expect(lab.locator('.poly-analysis-inset')).toContainText('0.08, -0.24, -0.8, 1.92');
    expect(await lab.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await page.evaluate(() => { document.documentElement.classList.remove('dark'); let node = document.querySelector('.polynomials-reference-dashboard')?.parentElement; while (node) { node.style.overflow = 'visible'; node.style.height = 'auto'; node.style.maxHeight = 'none'; node = node.parentElement; } });
    await lab.screenshot({ animations: 'disabled', path: `artifacts/polynomials-reference-${mode.toLowerCase().replaceAll(' ', '-')}.png` });
    await page.setViewportSize({ width: 390, height: 844 }); await expect(lab.locator('.poly-builder')).toBeVisible();
    if (mode === 'Roots' || mode === 'Multiplicity') {
      await expect(lab.locator('.poly-table-wrap table')).toHaveCSS('display', 'table');
      expect(await lab.locator('.poly-table-wrap').evaluate(el => el.querySelector('table')!.clientWidth >= el.clientWidth - 2)).toBe(true);
    }
    expect(await lab.evaluate(el => el.scrollWidth <= el.clientWidth + 1), mode).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    if (mode === 'Multiplicity') await lab.screenshot({ animations: 'disabled', path: 'artifacts/polynomials-reference-mobile.png' });
    await page.setViewportSize({ width: 1680, height: 1050 });
  }
  expect(errors).toEqual([]);
});
test('multiplicity, repeated roots, challenges and zero-polynomial behavior update together', async ({ page }) => {
  await page.goto('/algebra/polynomials?mode=Multiplicity'); const lab = page.locator('.polynomials-reference-dashboard');
  await lab.getByLabel('Multiplicity 1', { exact: true }).fill('2');
  await expect(lab.locator('.poly-degree-caption')).toContainText('5');
  await expect(lab.locator('.poly-table-wrap tbody tr').first()).toContainText('Touches');
  await expect(lab.locator('.poly-reference-graph')).toContainText('Touches');
  await lab.locator('.poly-learn-4').click(); await lab.getByRole('button', { name: 'Check challenge', exact: true }).click();
  await expect(lab.locator('.poly-challenge')).toContainText('Correct!');
  await lab.getByLabel('Root 2', { exact: true }).fill('-3');
  await expect(lab.locator('.poly-table-wrap tbody tr')).toHaveCount(3);
  await expect(lab.locator('.poly-table-wrap tbody tr').first()).toContainText('Crosses');
  await lab.getByLabel('Leading coefficient', { exact: true }).fill('0');
  await expect(lab.locator('.poly-root-description')).toContainText('zero for every x');
  await expect(lab.getByRole('slider')).toHaveCount(0);
  await lab.getByRole('button', { name: 'Reset All', exact: true }).click();
  await expect(lab.getByRole('slider')).toHaveCount(4);
});
test('custom division, end behavior, graph dragging, and settings work', async ({ page }) => {
  await page.goto('/algebra/polynomials?mode=Division'); const lab = page.locator('.polynomials-reference-dashboard');
  await lab.getByLabel('Divisor root a', { exact: true }).fill('0');
  await expect(lab.locator('.poly-analysis-inset')).toContainText('1.92');
  await lab.getByLabel('Custom divisor', { exact: true }).check();
  await lab.getByLabel('Custom divisor polynomial', { exact: true }).fill('x^2 - 1');
  await expect(lab.locator('.poly-theorem')).toContainText('Polynomial division identity');
  await lab.getByLabel('Custom divisor polynomial', { exact: true }).fill('0');
  await expect(lab.locator('.poly-error')).toContainText('zero');
  await lab.getByRole('button', { name: 'End Behavior', exact: true }).click();
  await lab.getByLabel('Leading coefficient', { exact: true }).fill('-0.08');
  await expect(lab.locator('.poly-end-summary')).toContainText('Both ends fall.');
  await lab.getByRole('button', { name: '3', exact: true }).click();
  await expect(lab.locator('.poly-end-summary')).toContainText('Left rises; right falls.');
  const root = lab.getByRole('slider', { name: 'Drag root 1', exact: true }); await root.focus(); await page.keyboard.press('ArrowRight');
  await expect(lab.getByLabel('Root 1', { exact: true })).toHaveValue('-2.9');
  const box = await root.boundingBox(); expect(box).not.toBeNull(); await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2); await page.mouse.down(); await page.mouse.move(box!.x + box!.width / 2 + 40, box!.y + box!.height / 2, { steps: 5 }); await page.mouse.up();
  await expect(lab.getByLabel('Root 1', { exact: true })).not.toHaveValue('-2.9');
  await lab.getByRole('button', { name: 'Graph settings', exact: true }).click();
  await lab.getByLabel('Show annotations', { exact: true }).uncheck();
  await expect(lab.locator('.poly-reference-graph')).not.toContainText('Falls to');
});

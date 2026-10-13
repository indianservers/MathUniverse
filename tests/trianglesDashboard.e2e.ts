import { test, expect, type Page } from '@playwright/test';

async function open(page: Page, mode = 'explorer') {
  await page.goto(`/geometry/triangles?mode=${mode}`);
  await expect(page.locator('.tri-reference-tools')).toBeVisible();
}
async function slider(page: Page, label: string, value: number) {
  const input = page.locator('.tri-controls .msk-slider-row').filter({ has: page.locator('span', { hasText: label }) }).locator('input');
  await input.fill(String(value));
}
async function canvasPoint(page: Page, x: number, y: number) {
  const point = await page.locator('svg[data-workspace-presentation]').evaluate((svg, p) => {
    const s = svg as SVGSVGElement; const q = s.createSVGPoint(); q.x = p.x; q.y = p.y;
    const r = q.matrixTransform(s.getScreenCTM()!); return { x: r.x, y: r.y };
  }, { x, y });
  await page.mouse.click(point.x, point.y);
}

test('explorer uses real measurements, presets, dragging, reset, and drawing tools', async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 1100 });
  await open(page);
  await expect(page.locator('.tri-metric[data-metric="AB"] strong')).toHaveText('7.88');
  await expect(page.locator('.tri-metric[data-metric="Perimeter"] strong')).toHaveText('24.85');
  await page.locator('.tri-controls').getByRole('button', { name: 'Equilateral', exact: true }).click();
  await expect(page.locator('.tri-badges')).toContainText('Equilateral');
  await expect(page.locator('.tri-metric[data-metric="∠A"] strong')).toHaveText('60°');
  await page.locator('.tri-goal-actions').getByRole('button', { name: 'Reset', exact: true }).click();
  const vertex = page.locator('svg[data-workspace-presentation] .tri-vertex').first();
  const pos = await vertex.locator('circle').last().boundingBox();
  await page.mouse.move(pos!.x + pos!.width / 2, pos!.y + pos!.height / 2); await page.mouse.down();
  await page.mouse.move(pos!.x + 40, pos!.y + 15, { steps: 10 }); await page.mouse.up();
  await expect(page.locator('.tri-metric[data-metric="AB"] strong')).not.toHaveText('7.88');
  await page.locator('.tri-reference-tools').getByRole('button', { name: 'Measure', exact: true }).click();
  await canvasPoint(page, 220, 240); await canvasPoint(page, 328, 240);
  await expect(page.locator('.tri-tool-hint')).toContainText('3.00 units');
  await page.locator('.tri-reference-tools').getByRole('button', { name: 'Angle', exact: true }).click();
  await canvasPoint(page, 220, 240); await canvasPoint(page, 256, 240); await canvasPoint(page, 256, 204);
  await expect(page.locator('.tri-tool-hint')).toContainText('90.0°');
});

test('congruence criteria, similarity scaling, centers and triangle inequalities are mathematical', async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 1100 });
  await open(page, 'congruence');
  await expect(page.locator('.tri-insights')).toContainText('5.2 = 5.2');
  for (const criterion of ['SSS', 'SAS', 'ASA', 'AAS', 'RHS']) {
    await page.locator('.tri-criteria').getByRole('button', { name: criterion, exact: true }).click();
    await expect(page.locator('.tri-insights')).toContainText(`Congruent by ${criterion}`);
    if (criterion === 'ASA') await expect(page.locator('.tri-metric[data-metric="AB ↔ DE"] strong')).toHaveText('5.2 = 5.2');
    if (criterion === 'AAS') await expect(page.locator('.tri-metric[data-metric="BC ↔ EF"] strong')).toHaveText('4.4 = 4.4');
  }
  await page.locator('.tri-criteria').getByRole('button', { name: 'SSA (not a test)', exact: true }).click();
  await expect(page.locator('.tri-insights')).toContainText('SSA does not prove congruence');
  await open(page, 'similarity');
  await page.locator('.tri-controls').getByText('More transformations & presets', { exact: true }).click();
  await page.locator('.tri-controls').getByRole('button', { name: 'Double', exact: true }).click();
  await expect(page.locator('.tri-metric[data-metric="Area ratio"] strong')).toHaveText('4');
  await expect(page.locator('.tri-metric[data-metric="Perimeter ratio"] strong')).toHaveText('2');
  await expect(page.locator('.tri-metric[data-metric="k = DE/AB"] strong')).toHaveText('2');
  await open(page, 'centers');
  await page.locator('.tri-controls').getByRole('button', { name: 'Circumcenter', exact: true }).click();
  await page.locator('.tri-controls').getByRole('button', { name: 'Obtuse', exact: true }).click();
  await expect(page.locator('svg[data-workspace-presentation]')).toHaveAttribute('aria-label', /outside/);
  await page.locator('.tri-controls').getByRole('button', { name: 'Right', exact: true }).click();
  await expect(page.locator('svg[data-workspace-presentation]')).toHaveAttribute('aria-label', /hypotenuse midpoint/);
  await open(page, 'inequalities');
  await slider(page, 'Side a (BC)', 3); await slider(page, 'Side b (AC)', 4); await slider(page, 'Side c (AB)', 7);
  await expect(page.locator('.tri-insights')).toContainText('Degenerate triangle');
  const yCoordinates = await page.locator('svg[data-workspace-presentation] circle[r="5"]').evaluateAll(circles => circles.map(c => Number(c.getAttribute('cy'))));
  expect(yCoordinates).toHaveLength(3);
  expect(Math.max(...yCoordinates) - Math.min(...yCoordinates)).toBeLessThan(1e-8);
  await slider(page, 'Side c (AB)', 8);
  await expect(page.locator('.tri-insights')).toContainText('CANNOT FORM A TRIANGLE');
  await slider(page, 'Side c (AB)', 5);
  await expect(page.locator('.tri-insights')).toContainText('VALID TRIANGLE');
});

test('every mode keeps its controls and measurements available on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  for (const mode of ['explorer', 'congruence', 'similarity', 'centers', 'inequalities']) {
    await open(page, mode);
    await expect(page.locator('.tri-insights')).toBeVisible();
    await expect(page.locator('.tri-controls')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator('.tri-more-challenge summary').click();
    await expect(page.locator('.tri-challenge').getByRole('button', { name: 'Check', exact: true })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('centers layers, random triangle and precision controls update the construction', async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 1100 });
  await open(page, 'centers');
  await expect(page.locator('.tri-center-euler')).toContainText('collinear');
  const original = await page.locator('.tri-metric[data-metric="Circumcenter O"] strong').innerText();
  await page.getByLabel('Measurement precision').selectOption('4');
  await expect(page.locator('.tri-metric[data-metric="Circumcenter O"] strong')).not.toHaveText(original);
  const beforeRandom = await page.locator('.tri-metric[data-metric="Centroid G"] strong').innerText();
  await page.getByRole('button', { name: /Random triangle/ }).click();
  await expect(page.locator('.tri-metric[data-metric="Centroid G"] strong')).not.toHaveText(beforeRandom);
  await page.locator('.tri-controls').getByRole('button', { name: 'Equilateral', exact: true }).click();
  await expect(page.locator('.tri-center-euler')).toContainText('coincide');
});

test('each centers view exposes its construction and the similar copy is draggable', async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 1100 });
  await open(page, 'centers');
  for (const [mode, text] of [['Centroid', 'Midpoints'], ['Circumcenter', 'Perpendicular bisectors'], ['Incenter', 'Tangency points'], ['Orthocenter', 'Right angle markers']]) {
    await page.locator('.tri-controls').getByRole('button', { name: mode, exact: true }).click();
    await expect(page.locator('.tri-center-legend')).toContainText(text);
    await expect(page.locator('.tri-center-explanation b')).toHaveText(mode);
  }
  await open(page, 'similarity');
  const vertex = page.locator('svg[data-workspace-presentation] .tri-vertex').nth(3).locator('circle').last();
  const box = await vertex.boundingBox();
  const before = await page.locator('svg[data-workspace-presentation] polygon').first().getAttribute('points');
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2); await page.mouse.down();
  await page.mouse.move(box!.x + 25, box!.y + 15, { steps: 8 }); await page.mouse.up();
  await expect(page.locator('svg[data-workspace-presentation] polygon').first()).not.toHaveAttribute('points', before!);
  await expect(page.locator('.tri-metric[data-metric="Area ratio"] strong')).toHaveText('2.25');
});

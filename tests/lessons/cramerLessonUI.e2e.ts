import { test, expect } from '@playwright/test';

const route = '/lessons/school/class-12/class-12-matrices-and-determinants-cramer-s-rule';
const sizes = [[1920,1080],[1536,864],[1440,900],[1366,768],[1024,768],[768,1024],[390,844],[360,800]];

for (const [width, height] of sizes) {
  test(`Cramer's Rule preserves interactions at ${width} × ${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto(route);
    const lesson = page.locator('.cr10198-page');
    const values = async (expected: Record<string, string>) => {
      for (const [key, value] of Object.entries(expected)) await expect(lesson).toHaveAttribute(`data-${key}`, value);
    };
    await values({ delta: '-3', 'delta-x': '-6', 'delta-y': '-3', x: '2', y: '1', case: 'unique' });
    await lesson.getByRole('button', { name: 'Random system', exact: true }).click();
    await values({ delta: '-7', 'delta-x': '-12', 'delta-y': '1', x: String(12/7), y: String(-1/7) });
    await lesson.getByRole('button', { name: 'Swap equations', exact: true }).click();
    await values({ delta: '7', 'delta-x': '12', 'delta-y': '-1', x: String(12/7), y: String(-1/7) });
    await lesson.getByRole('button', { name: 'Reset', exact: true }).click();
    await values({ delta: '-3', x: '2', y: '1' });
    const setSystem = async (system: number[]) => {
      for (let i = 0; i < system.length; i++) {
        const input = lesson.getByRole('spinbutton', { name: `system value ${i + 1}`, exact: true });
        await input.fill(String(system[i]));
        await expect(input).toHaveValue(String(system[i]));
      }
    };
    await setSystem([1,2,3,2,4,6]);
    await values({ delta: '0', 'delta-x': '0', 'delta-y': '0', case: 'infinite', x: 'undefined', y: 'undefined' });
    await expect(lesson.locator('.cr-solve')).toContainText('Infinitely many solutions');
    await setSystem([1,2,3,2,4,7]);
    await values({ delta: '0', 'delta-x': '-2', 'delta-y': '1', case: 'none' });
    await setSystem([0,1,2,1,0,3]);
    await values({ delta: '-1', x: '3', y: '2', case: 'unique' });
    await expect(lesson.getByRole('img', { name: /Graph of the two equations/ })).toHaveAttribute('aria-label', /Intersection \(3, 2\)/);
    await setSystem([.5,1,2,-1,1,-1]);
    await values({ delta: '1.5', x: '2', y: '1' });
    await lesson.getByRole('button', { name: 'Reset', exact: true }).click();
    await values({ delta: '-3', x: '2', y: '1' });
    await lesson.getByRole('button', { name: 'Learn more', exact: true }).click();
    await expect(lesson.locator('.cr-zero')).toContainText('matrix is invertible');
    await lesson.locator('.cr-zero').getByRole('button', { name: 'Hide', exact: true }).click();
    await expect(lesson.locator('.cr-zero')).not.toContainText('matrix is invertible');
    await lesson.getByRole('button', { name: 'Show hints', exact: true }).click();
    await expect(lesson.locator('.cr-practice')).toContainText('Hint: Δ=-5');
    await lesson.getByRole('button', { name: 'Hide hints', exact: true }).click();
    await expect(lesson.locator('.cr-practice')).not.toContainText('Hint:');
    const answers = [[2.6,1.6],[17/9,25/9],[2.4,2.6],[27/7,10/7]];
    for (let i = 0; i < answers.length; i++) {
      const card = lesson.locator('.cr-practice article').nth(i);
      await card.getByRole('textbox', { name: `practice ${i+1} x`, exact: true }).fill('99');
      await card.getByRole('button', { name: 'Check', exact: true }).click();
      await expect(card).not.toContainText('Correct');
      await card.getByRole('textbox', { name: `practice ${i+1} x`, exact: true }).fill(String(answers[i][0]));
      await card.getByRole('textbox', { name: `practice ${i+1} y`, exact: true }).fill(String(answers[i][1]));
      await card.getByRole('button', { name: 'Check', exact: true }).click();
      await expect(card).toContainText('Correct');
    }
    await lesson.getByRole('button', { name: 'Check all', exact: true }).click();
    await expect(lesson.locator('.cr-practice article > span')).toHaveCount(4);
    await expect(lesson.locator('.cr-next a').first()).toHaveAttribute('href', '/lessons/school/class-12/class-12-matrices-and-determinants-determinant-properties');
    await expect(lesson.locator('.cr-next a').last()).toHaveAttribute('href', '/lessons/school/class-12/class-12-matrices-and-determinants-cramers-rule-3x3');
    for (const dark of [true, false]) {
      await page.evaluate(value => document.documentElement.classList.toggle('dark', value), dark);
      const layout = await lesson.evaluate(root => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        tiny: [...root.querySelectorAll('p,button,input,h1,h2,h3')].filter(e => parseFloat(getComputedStyle(e).fontSize) < 13).length,
        smallControls: [...root.querySelectorAll('button,input')].filter(e => e.getBoundingClientRect().height < 43).length,
        ink: getComputedStyle(root).color,
      }));
      expect(layout.overflow).toBe(false);
      expect(layout.tiny).toBe(0);
      expect(layout.smallControls).toBe(0);
      expect(layout.ink).toBe(dark ? 'rgb(229, 237, 247)' : 'rgb(36, 53, 75)');
      await page.screenshot({ path: `test-evidence/lesson-ui-ux/10198/tested-${width}-${dark ? 'dark' : 'light'}.png`, fullPage: true });
    }
    const firstInput = lesson.getByRole('spinbutton').first();
    await firstInput.focus();
    await page.keyboard.press('Tab');
    await expect(lesson.getByRole('spinbutton').nth(1)).toBeFocused();
    expect(await lesson.getByRole('spinbutton').nth(1).evaluate(e => getComputedStyle(e).outlineStyle)).toBe('solid');
    expect(errors).toEqual([]);
  });
}

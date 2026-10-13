import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = ['/algebra/equations','/algebraic-structures/structure-test','/geometry/triangles','/trigonometry/unit-circle','/calculus/derivatives','/number-systems/rational','/linear-algebra/vectors','/complex-numbers/argand-plane','/mathematical-modelling/motion','/discrete-world/primes','/set-theory/relations','/graph-theory','/probability-statistics/descriptive','/differential-equations/euler','/math-lab/continued-fractions','/math-lab/famous-problems','/math-lab/stats-inference','/math-lab/special-functions','/math-lab/differential-equations'];
test('all nineteen studios expose twelve enhancements', async ({page}) => {
  test.setTimeout(180_000);
  const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  for(const route of routes){
    await page.goto(route);
    const guide=page.locator('.lu-guide');
    await expect(guide,route).toHaveAttribute('data-enhancement-count','12');
    await expect(guide.locator('[data-enhancement]'),route).toHaveCount(12);
    await guide.getByRole('tab',{name:'Compare & distinguish'}).click();
    await expect(guide.locator('[data-enhancement="compare"] table')).toBeVisible();
    await expect(guide.locator('[data-enhancement="scenarios"] tbody tr')).toHaveCount(3);
  }
  expect(errors).toEqual([]);
});
test('specific sublabs, feedback, notes, keyboard and mobile layout',async({page})=>{
  test.setTimeout(90_000);
  await page.goto('/trigonometry/inverse/arccos');
  await expect(page.locator('.lu-guide h2')).toContainText('Arccos');
  await page.goto('/set-theory/hasse-diagram');
  await expect(page.locator('.lu-guide h2')).toContainText('Hasse Diagram');
  await page.goto('/number-systems/integers');
  await expect(page.locator('.lu-guide h2')).toContainText('Integers Explorer');
  await page.goto('/graph-theory');
  await page.getByRole('tablist',{name:'Graph Theory Studio tabs'}).getByRole('tab',{name:'Representations',exact:true}).click();
  await expect(page.locator('.lu-guide h2')).toContainText('Graph Representations');
  await page.goto('/algebra/equations');
  const guide=page.locator('.lu-guide');
  await guide.getByRole('tab',{name:'See the idea'}).focus();
  await page.keyboard.press('ArrowRight');
  await expect(guide.getByRole('tab',{name:'Compare & distinguish'})).toHaveAttribute('aria-selected','true');
  await guide.getByRole('tab',{name:'Try & check'}).click();
  await guide.getByLabel('Your numerical answer').fill('999');
  await guide.getByRole('button',{name:'Check',exact:true}).click();
  await expect(guide.getByRole('status')).toContainText('Try again');
  await guide.getByLabel('Your numerical answer').fill('4');
  await guide.getByRole('button',{name:'Check',exact:true}).click();
  await expect(guide.getByRole('status')).toContainText('Correct');
  await guide.getByLabel('Before exploring: my prediction').fill('The solution stays balanced.');
  await guide.getByRole('button',{name:'Reveal next step'}).click();
  await expect(guide.getByText('Choose the relationship',{exact:true})).toBeVisible();
  await page.reload();
  await page.locator('.lu-guide').getByRole('tab',{name:'Try & check'}).click();
  await expect(page.locator('.lu-guide').getByLabel('Before exploring: my prediction')).toHaveValue('The solution stays balanced.');
  const downloadPromise=page.waitForEvent('download');
  await page.locator('.lu-guide').getByRole('button',{name:'Download my notes'}).click();
  expect((await downloadPromise).suggestedFilename()).toBe('algebra-equations-learning-notes.json');
  await page.setViewportSize({width:390,height:844});
  await page.locator('.lu-guide').getByRole('tab',{name:'Compare & distinguish'}).click();
  const overflow=await page.locator('.lu-shell').evaluate(el=>el.scrollWidth>el.clientWidth+1);
  expect(overflow).toBe(false);
  const accessibility=await new AxeBuilder({page}).include('.lu-shell').withTags(['wcag2a','wcag2aa']).analyze();
  expect(accessibility.violations).toEqual([]);
  await page.evaluate(()=>document.documentElement.classList.add('dark'));
  for(const name of ['See the idea','Compare & distinguish','Try & check','Connect & remember']) {
    await page.locator('.lu-guide').getByRole('tab',{name}).click();
    const darkAccessibility=await new AxeBuilder({page}).include('.lu-shell').withTags(['wcag2a','wcag2aa']).analyze();
    expect(darkAccessibility.violations,`dark theme: ${name}`).toEqual([]);
  }
  await page.evaluate(()=>document.documentElement.classList.remove('dark'));
  await page.locator('.lu-guide').getByRole('tab',{name:'Compare & distinguish'}).click();
  await page.setViewportSize({width:390,height:2800});
  await page.locator('.lu-shell').scrollIntoViewIfNeeded();
  await page.locator('.lu-shell').screenshot({path:'artifacts/lab-enhancements-mobile.png'});
  await page.setViewportSize({width:1440,height:2400});
  await page.locator('.lu-shell').scrollIntoViewIfNeeded();
  await page.locator('.lu-shell').screenshot({path:'artifacts/lab-enhancements-desktop.png'});
});

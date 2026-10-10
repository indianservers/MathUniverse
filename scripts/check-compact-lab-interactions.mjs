import assert from 'node:assert/strict';
import { chromium } from 'playwright';
const browser=await chromium.launch();
try {
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const base=process.env.STUDIO_AUDIT_URL||'http://127.0.0.1:5190';
  await page.goto(base+'/trigonometry/identities?mode=Pythagorean&identity=cosecant');
  await page.locator('.ids-figure').waitFor();
  const figure=await page.locator('.ids-figure').boundingBox();
  assert(figure.y<600&&figure.y+figure.height<800,'Identity diagram must fit the first phone screen');
  assert.equal(await page.locator('.ids-picker').getAttribute('open'),null);
  await page.keyboard.press('Control+k');
  assert.equal(await page.locator('.ids-picker').getAttribute('open'),'');
  assert(await page.getByRole('searchbox',{name:'Search identities'}).evaluate(el=>el===document.activeElement));
  await page.getByRole('searchbox',{name:'Search identities'}).fill('secant');
  assert(await page.locator('.ids-identity-cards button').count()>0);
  await page.locator('.ids-picker > summary').tap();
  const angle=page.getByRole('textbox',{name:'Enter angle θ'});
  await angle.fill('45');await angle.press('Enter');
  assert.equal(await page.getByRole('slider',{name:'Drag point angle'}).getAttribute('aria-valuenow'),'45');
  assert.match(await page.locator('.ids-verdict').textContent(),/Matches at this angle/);
  await page.screenshot({path:'artifacts/studio-compact-identities.png'});
  for(const route of ['/calculus/derivatives','/linear-algebra/eigenvectors','/number-systems/fundamentals']) {
    console.log('Checking parameter toggle:',route);
    await page.goto(base+route);await page.getByRole('button',{name:/^Show controls/}).waitFor();
    const fields=page.locator('[data-compact-controls] input:not([type=checkbox]):not([type=range])');
    const before=await fields.evaluateAll(es=>es.map(e=>e.value));
    await page.getByRole('button',{name:/^Show controls/}).tap();
    assert.equal(await page.getByRole('button',{name:/^Hide controls/}).getAttribute('aria-expanded'),'true');
    assert(await page.locator('[data-compact-controls]').evaluateAll(es=>es.some(e=>e.getBoundingClientRect().height>0)));
    await page.getByRole('button',{name:/^Hide controls/}).tap();
    assert.deepEqual(await fields.evaluateAll(es=>es.map(e=>e.value)),before,'Folding must preserve parameters');
  }
  console.log('Passed: first-screen identity diagram, picker/search shortcut, live angle update, and persistent control toggles in three Studios.');
} finally {await browser.close();}

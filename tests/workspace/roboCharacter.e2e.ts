import { test, expect } from '@playwright/test';
import { ACTIONS, EXPRESSIONS } from '../../src/math-robo/character/engine';
test('all expressions and actions run on the live articulated rig', async ({ page }) => {
    test.setTimeout(90000);
    await page.goto('/?roboLab');
    const lab = page.getByRole('region', { name: 'Developer animation lab' }), robo = page.locator('.articulated-robo');
    await expect(lab).toBeVisible();
    for (const e of EXPRESSIONS) {
        await lab.getByLabel('Expression', { exact: true }).selectOption(e);
        await expect(robo).toHaveAttribute('data-expression', e);
    }
    for (const a of ACTIONS) {
        await lab.getByLabel('Action', { exact: true }).selectOption(a);
        await lab.getByRole('button', { name: 'Play action', exact: true }).click();
        await expect(robo).toHaveAttribute('data-action', a);
    }
    await lab.getByRole('button', { name: 'Cancel', exact: true }).click();
    await expect(robo).toHaveAttribute('data-action', 'idle');
    await page.screenshot({ path: 'artifacts/math-robo-character/lab-desktop.png' });
});
test('drag settles without opening the assistant and persists position', async ({ page }) => {
    await page.goto('/');
    const robot = page.getByRole('button', { name: 'Ask Math · Offline' });
    await expect(robot).toBeVisible();
    const box = (await robot.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x - 160, box.y - 130, { steps: 12 });
    await page.mouse.up();
    await expect(page.getByRole('dialog', { name: 'Ruhi solver and drawing assistant' })).toHaveCount(0);
    const stored = await page.evaluate(() => JSON.parse(localStorage.getItem('math-robo-position')!));
    expect(stored.x).toBeLessThan(box.x - 100);
    await page.reload();
    expect((await robot.boundingBox())!.x).toBeCloseTo(stored.x, 0);
    await robot.click();
    await expect(page.getByRole('dialog', { name: 'Ruhi solver and drawing assistant' })).toBeVisible();
});
test('real geometry command projects a target through the actual SVG matrix', async ({ page }) => {
    await page.goto('/workspace/geometry?roboLab');
    await expect(page.getByTestId('workspace-geometry-board')).toBeVisible();
    const lab = page.getByRole('region', { name: 'Developer animation lab' });
    await lab.getByLabel('Real graph x,y,z').fill('2,3,0');
    await lab.getByRole('button', { name: 'Point at coordinates' }).click();
    await expect(lab.getByRole('status')).toContainText('Actual screen target:');
    const actual = await page.getByTestId('workspace-geometry-board').evaluate((svg: SVGSVGElement) => { const p = new DOMPoint(400, 90).matrixTransform(svg.getScreenCTM()!); return { x: p.x, y: p.y }; });
    await expect(page.locator('.robo-target-marker')).toBeVisible();
    const marker = await page.locator('.robo-target-marker').boundingBox();
    expect(marker!.x + 9).toBeCloseTo(actual.x, 0);
    expect(marker!.y + 9).toBeCloseTo(actual.y, 0);
    await lab.getByRole('button', { name: 'Cancel', exact: true }).click();
    await page.getByRole('button', { name: 'Ask Math · Offline' }).click();
    await page.getByLabel('What would you like to create or solve?').fill('draw a circle radius 2');
    await page.getByRole('button', { name: 'Run request', exact: true }).click();
    await expect(page.getByTestId('workspace-geometry-board').locator('circle').first()).toBeVisible();
    await expect(page.locator('.robo-answer')).toBeVisible({ timeout: 30000 });
    await page.screenshot({ path: 'artifacts/math-robo-character/geometry-target.png' });
});
test('mobile reduced motion keeps the rig stable and touch repositions it', async ({ page, context }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const robot = page.getByRole('button', { name: 'Ask Math · Offline' });
    await robot.click();
    await expect(page.getByRole('dialog', { name: 'Ruhi solver and drawing assistant' })).toBeVisible();
    await expect(page.locator('.articulated-robo')).toHaveAttribute('data-action', 'idle');
    const body = page.locator('[data-part=body]');
    const pose = await body.getAttribute('transform');
    await page.waitForTimeout(200);
    expect(await body.getAttribute('transform')).toBe(pose);
    await page.getByRole('button', { name: 'Close Ruhi', exact: true }).click();
    const box = (await robot.boundingBox())!;
    const cdp = await context.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x + box.width / 2, y: box.y + box.height / 2 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: box.x - 60, y: box.y - 80 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    expect((await robot.boundingBox())!.x).toBeLessThan(box.x - 40);
    await cdp.detach();
    await robot.click();
    await page.screenshot({ path: 'artifacts/math-robo-character/mobile-reduced-motion.png' });
});
test('mouth starts with playback, pauses, resumes, and stops on cancellation', async ({ page }) => {
    await page.addInitScript(() => { const voice = { name: 'Local test', lang: 'en-US', localService: true, voiceURI: 'test' }; class Utterance {
        constructor(public text: string) { }
    } Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: Utterance }); Object.defineProperty(window, 'speechSynthesis', { value: { getVoices: () => [voice], addEventListener: () => { }, removeEventListener: () => { }, speak: (u: unknown) => Reflect.set(window, 'characterSpeech', u), cancel: () => { } } }); });
    await page.goto('/?roboLab');
    await page.getByRole('button', { name: 'Ask Math · Offline' }).click();
    const lab = page.getByRole('region', { name: 'Developer animation lab' });
    await lab.getByRole('button', { name: 'Test actual speech' }).click();
    const mouth = page.locator('[data-part=mouth]');
    await page.evaluate(() => Reflect.get(window, 'characterSpeech').onstart());
    await expect(page.locator('.articulated-robo')).toHaveAttribute('data-expression', 'speaking');
    await lab.getByLabel('Simulate event').selectOption('correct');
    await expect(page.locator('.articulated-robo')).toHaveAttribute('data-action','idle');
    const a = await mouth.getAttribute('d');
    await page.waitForTimeout(150);
    expect(await mouth.getAttribute('d')).not.toBe(a);
    await page.evaluate(() => Reflect.get(window, 'characterSpeech').onpause());
    await page.waitForTimeout(400);
    const paused = await mouth.getAttribute('d');
    await page.waitForTimeout(150);
    expect(await mouth.getAttribute('d')).toBe(paused);
    await page.evaluate(() => Reflect.get(window, 'characterSpeech').onresume());
    await page.getByRole('button', { name: 'Stop reading', exact: true }).click();
    await expect(page.locator('.articulated-robo')).toHaveAttribute('data-expression', 'listening');
});

test('3D targeting follows the live camera projection',async({page})=>{
 await page.goto('/workspace/3d?roboLab');const canvas=page.locator('canvas').first();await expect(canvas).toBeVisible();const lab=page.getByRole('region',{name:'Developer animation lab'});await lab.getByLabel('Real graph x,y,z').fill('1,1,1');await lab.getByRole('button',{name:'Point at coordinates'}).click();await expect(lab.getByRole('status')).toContainText('Actual screen target:');await expect(page.locator('.robo-target-marker')).toBeVisible();
 const before=await page.locator('.robo-target-marker').boundingBox();const box=(await canvas.boundingBox())!;await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+60,box.y+box.height/2+15,{steps:5});await page.mouse.up();const after=await page.locator('.robo-target-marker').boundingBox();expect(Math.hypot(after!.x-before!.x,after!.y-before!.y)).toBeGreaterThan(1);
});

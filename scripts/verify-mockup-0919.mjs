import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto((process.env.LESSON_AUDIT_URL||'http://127.0.0.1:5190')+'/lessons/advanced-concepts/2025-bessel-function',{waitUntil:'commit'});const lesson=page.locator('.bj2025');await lesson.waitFor();
await lesson.getByRole('button',{name:'Increase order'}).click();await expect(lesson.getByLabel('Bessel order',{exact:true})).toHaveValue('1');
await lesson.getByRole('button',{name:'(0,2)',exact:true}).click();await expect(lesson.locator('.bj-mode')).toContainText('1 interior nodal rings');
await lesson.getByLabel('Membrane view').selectOption('nodes');await expect(lesson.locator('canvas')).toHaveAttribute('aria-label',/nodal lines/);
await lesson.getByRole('button',{name:'Reset lab'}).click();await expect(lesson.getByLabel('Bessel order',{exact:true})).toHaveValue('0');
await lesson.locator('input[name="bessel-first-zero"][value="2.4048"]').check();await lesson.getByRole('button',{name:'Check answer',exact:true}).first().click();await expect(lesson.getByRole('status').first()).toHaveText('Correct.');
await lesson.getByLabel('Practice nodal radius',{exact:true}).fill('1');await lesson.getByRole('button',{name:'Check',exact:true}).click();await expect(lesson.getByRole('status').last()).toContainText('Correct');
await lesson.getByRole('button',{name:'Play',exact:true}).click();await expect(lesson.getByRole('button',{name:'Pause',exact:true})).toBeVisible();await lesson.getByRole('button',{name:'Pause',exact:true}).click();
const overflow=[];for(const width of [390,768,1440]){await page.setViewportSize({width,height:1100});overflow.push(await lesson.evaluate(el=>({width:innerWidth,client:el.clientWidth,scroll:el.scrollWidth})));}
for(const result of overflow)expect(result.scroll).toBeLessThanOrEqual(result.client);expect(errors).toEqual([]);await page.setViewportSize({width:1440,height:3000});await lesson.getByRole('button',{name:'Reset lab'}).click();await lesson.screenshot({path:'artifacts/0919-after-content.png'});
await fs.writeFile('audit/mockup-reverse/0919-verification.json',JSON.stringify({errors,overflow,interactions:['order','mode preset','nodal view','reset','quick check','practice input','animation'],status:'passed'},null,2));console.log(JSON.stringify({errors,overflow}));await browser.close();

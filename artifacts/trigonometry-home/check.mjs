import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true}), context=await browser.newContext(), page=await context.newPage(), errors=[], results=[];
page.on('pageerror',e=>errors.push(e.message));
for(const [width,height] of [[1920,1080],[1600,900],[1440,900],[1366,768],[1280,800],[1024,768],[768,1024],[390,844]]){
 await page.setViewportSize({width,height});await page.goto('http://127.0.0.1:5178/trigonometry');await page.locator('.tgh-home').waitFor();
 results.push({width,height,...await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,cards:document.querySelectorAll('.tgh-topic-grid>a').length,sidebar:!!document.querySelector('.msk-sidebar')}))});
 await page.screenshot({path:`artifacts/trigonometry-home/${width}.png`,fullPage:true});
}
await page.setViewportSize({width:1440,height:900});
await page.locator('[role=slider]').focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');
results.push({keyboard:await page.locator('[role=slider]').getAttribute('aria-valuenow')});
const slider=page.locator('[role=slider]'), box=await slider.boundingBox();
await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2,box.y+20,{steps:4});await page.mouse.up();results.push({dragAngle:await slider.getAttribute('aria-valuenow')});
for(const title of ['Theory & examples','In Simple words','Formulas','Real-time examples','Try these']){const tab=page.getByRole('tab',{name:title,exact:true});await tab.click();results.push({tab:title,selected:await tab.getAttribute('aria-selected')});}
await page.getByRole('button',{name:'View All Topics'}).click();
for(const link of await page.locator('.tgh-topic-grid>a').all()){results.push({href:await link.getAttribute('href')});}
const axe=await new AxeBuilder({page}).include('.tgh-home').withTags(['wcag2a','wcag2aa']).analyze();
for(const id of ['unit-circle','right-triangle','graphs','identities','inverse','oblique','waves','applications']){await page.goto(`http://127.0.0.1:5178/trigonometry/${id}`);await page.locator('.msk-shell').waitFor();results.push({route:id,lab:await page.locator('.msk-shell').count()});}
await page.emulateMedia({reducedMotion:'reduce'});await page.goto('http://127.0.0.1:5178/trigonometry');await page.locator('.tgh-scene.reduced').waitFor();const a=await page.locator('[role=slider]').getAttribute('aria-valuenow');await page.waitForTimeout(350);results.push({reducedMotionStable:a===await page.locator('[role=slider]').getAttribute('aria-valuenow')});
fs.writeFileSync('artifacts/trigonometry-home/results.json',JSON.stringify({results,errors,axe:axe.violations},null,2));
console.log(JSON.stringify({results,errors,axe:axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))},null,2));await browser.close();

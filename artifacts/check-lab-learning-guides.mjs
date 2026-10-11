import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});
const results=[];
try {
 for(const width of [390,1280]) {
  const page=await browser.newPage({viewport:{width,height:900}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  for(const route of ['/geometry/triangles','/geometry/circles','/geometry/construction','/trigonometry/unit-circle','/trigonometry/right-triangle','/algebra/equations','/probability-statistics/data-explorer','/probability-statistics/clt','/probability-statistics/confidence-intervals','/linear-algebra/row-reduction']) {
   await page.goto('http://127.0.0.1:5193'+route,{waitUntil:'domcontentloaded',timeout:120000});
   const guide=page.locator('.lab-learning-guide');
   await guide.waitFor({state:'attached',timeout:60000});
   const tabs=page.getByRole('tab',{name:'Interactive workspace',exact:true});
   if(await tabs.count())await tabs.click();
   await guide.locator('summary').click();
   await guide.locator('textarea').fill('I expect a preserved relationship because of the stated conditions.');
   await guide.getByRole('radio').first().check();
   await guide.getByRole('button',{name:'Check reasoning'}).click();
   await guide.getByRole('status').waitFor();
   const overflow=await guide.evaluate(el=>el.scrollWidth>el.clientWidth+1);
   results.push({route,width,feedback:await guide.getByRole('status').innerText(),overflow,errors:[...errors]});
   if(overflow||errors.length)throw new Error(JSON.stringify(results.at(-1)));
   if(route==='/geometry/triangles')await page.screenshot({path:`artifacts/lab-learning-guide-${width}.png`,fullPage:true});
  }
  await page.close();
 }
} finally {await browser.close();fs.writeFileSync('artifacts/lab-learning-guide-browser-results.json',JSON.stringify(results,null,2));}
console.log(JSON.stringify({checks:results.length,passed:true}));

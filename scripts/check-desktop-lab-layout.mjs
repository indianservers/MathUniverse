/* global document, innerWidth, getComputedStyle */
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';
const browser = await chromium.launch();
const results = [];
try {
 const page = await browser.newPage();
 for (const width of [390,1366,1920]) {
  await page.setViewportSize({width,height:900});
  await page.goto('http://127.0.0.1:5190/probability-statistics/interactive-distributions?mode=Binomial');
  await page.locator('.statistics-core').waitFor();
  const result = await page.evaluate(() => {
   const el=document.querySelector('.statistics-core'), outer=el.parentElement;
   const panels=[...el.children].map(n=>({x:n.getBoundingClientRect().x,width:n.getBoundingClientRect().width}));
   return {width:innerWidth,workspace:el.getBoundingClientRect().width,outer:outer.getBoundingClientRect().width,columns:getComputedStyle(el).gridTemplateColumns,panels,overflow:document.documentElement.scrollWidth>innerWidth+2};
  });
  if(result.workspace < result.outer*.98 || result.overflow || (width>=1024 && result.panels[1].x<=result.panels[0].x)) throw Error(JSON.stringify(result));
  results.push(result);
  await page.screenshot({path:`artifacts/distributions-${width}.png`,fullPage:true});
 }
} finally {await browser.close();}
writeFileSync('artifacts/distributions-layout.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));

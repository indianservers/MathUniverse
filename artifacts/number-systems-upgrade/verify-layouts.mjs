import {chromium} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true}),context=await browser.newContext(),page=await context.newPage(),errors=[],results=[],accessibility=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const paths=['','fundamentals','natural-whole','integers','rational','irrational','real-line','hierarchy','fractions-decimals-percentages','ordering-comparing','absolute-distance-intervals','properties-operations','formula-visualizer'];
for(const [width,height]of [[1366,768],[1440,900],[1600,900],[1920,1080],[768,1024],[390,844]]){
 await page.setViewportSize({width,height});
 for(let i=0;i<paths.length;i++){
 await page.goto('http://127.0.0.1:5178/number-systems/'+paths[i],{waitUntil:'domcontentloaded'});await page.locator('.np-studio').waitFor();await page.waitForTimeout(150);
 const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('.np-studio h1').length,buttons:[...document.querySelectorAll('.np-studio button')].filter(e=>e.getBoundingClientRect().height&&(!e.textContent.trim()&&!e.getAttribute('aria-label'))).length}));results.push({path:paths[i]||'home',width,height,...metrics,pass:metrics.scroll<=width+1&&metrics.h1===1&&metrics.buttons===0});
 if(width===1440||width===390){await page.evaluate(()=>{for(const selector of ['.studio-learning-content','.studio-learning-host','#main-content','#root']){const e=document.querySelector(selector);if(e){e.style.height='auto';e.style.maxHeight='none';e.style.overflow='visible';}}});await page.screenshot({path:`artifacts/number-systems-upgrade/${width===1440?'desktop':'mobile'}-${String(i+1).padStart(2,'0')}.png`,fullPage:true});}
 if(width===1440){const result=await new AxeBuilder({page}).include('.np-studio').withTags(['wcag2a','wcag2aa']).analyze();accessibility.push({path:paths[i]||'home',violations:result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}))});}
 }
 console.log(`Checked all 13 pages at ${width}×${height}`);
}
fs.writeFileSync('artifacts/number-systems-upgrade/responsive.json',JSON.stringify({results,errors,accessibility},null,2));console.log('Failures',results.filter(r=>!r.pass).length,'Errors',errors.length,'Axe',accessibility.flatMap(a=>a.violations).length);await browser.close();

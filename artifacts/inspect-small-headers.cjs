const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{const browser=await chromium.launch({headless:true});const catalog=require('../src/modules/lessons/catalog/unified/unifiedLessonIndex.generated.json').lessons;
for(const id of [10008,10197]){const page=await browser.newPage({viewport:{width:1440,height:900}});await page.goto('http://127.0.0.1:5216'+catalog.find(x=>x.id===id).route,{waitUntil:'domcontentloaded',timeout:30000});await page.waitForSelector('.standard-lesson-content h1',{state:'attached'});await page.waitForTimeout(200);console.log(JSON.stringify({id,items:await page.locator('.standard-lesson-content header:has(h1)').last().evaluate(h=>[h,...h.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().height>0).map(e=>({tag:e.tagName,cl:e.className,t:e.textContent.slice(0,65),w:Math.round(e.getBoundingClientRect().width),h:Math.round(e.getBoundingClientRect().height),d:getComputedStyle(e).display,margin:getComputedStyle(e).margin,padding:getComputedStyle(e).padding}))) }));await page.close();}await browser.close()})()




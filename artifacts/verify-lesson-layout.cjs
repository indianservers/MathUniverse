const {chromium}=require('playwright');
const fs=require('fs');
(async()=>{
const browser=await chromium.launch({headless:true});
const catalog=require('../src/modules/lessons/catalog/unified/unifiedLessonIndex.generated.json').lessons;
for(const id of [59,136,30002]){
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto((process.env.LESSON_AUDIT_URL||'http://127.0.0.1:5216')+catalog.find(x=>x.id===id).route,{waitUntil:'domcontentloaded'});
 await page.waitForFunction(()=>[...document.querySelectorAll('.standard-lesson-content h1')].some(e=>e.getBoundingClientRect().height>0));
 await page.waitForTimeout(250);
 for(const width of [1440,390]){
 await page.setViewportSize({width,height:900});
 await page.screenshot({path:`artifacts/lesson-final-${id}-${width}.png`});
 }
 if(id===59){
 await page.setViewportSize({width:1440,height:900});
 const slider=page.locator('.standard-lesson-content input[type=range]').first();
 if(await slider.count()){
 const initial=await slider.inputValue();await slider.focus();await slider.press('ArrowRight');const changed=await slider.inputValue();
 if(initial===changed)throw new Error('Integers slider did not respond');
 const reset=page.locator('.standard-lesson-content button').filter({hasText:/^Reset$/}).first();
 await reset.click();
 if(await slider.inputValue()!==initial)throw new Error('Integers reset failed');
 console.log('Integers slider and reset passed');
 }
 }
 const tabs=page.locator('.standard-lesson-frame > .lesson-section-toolbar [role=tab]');
 for(let n=0;n<await tabs.count();n++){await tabs.nth(n).click();if(await tabs.nth(n).getAttribute('aria-selected')!=='true')throw new Error('Canonical tab did not activate');}
 console.log(`Lesson ${id}: screenshots and native tab clicks passed`);
 await page.close();
}
await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});

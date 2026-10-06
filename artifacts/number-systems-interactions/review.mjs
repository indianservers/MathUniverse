import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:900}});
for(const id of ['home','fundamentals','natural-whole','integers','rational','irrational','real-line','hierarchy','fractions-decimals-percentages','ordering-comparing','absolute-distance-intervals','properties-operations','formula-visualizer']){
 await page.goto('http://127.0.0.1:5178/number-systems'+(id==='home'?'':'/'+id));await page.locator('.np-live').waitFor();
 await page.evaluate(()=>{for(const selector of ['.studio-learning-content','.studio-learning-host','#main-content','#root']){const e=document.querySelector(selector);if(e){e.style.height='auto';e.style.maxHeight='none';e.style.overflow='visible';}}});
 await page.locator('.np-live').screenshot({path:`artifacts/number-systems-interactions/${id}-full-experiment.png`});
}
await page.goto('http://127.0.0.1:5175/number-systems/integers');await page.locator('.np-live').waitFor();await page.locator('.np-live').getByRole('button',{name:'Predict',exact:true}).click();await page.locator('.np-live-prediction').scrollIntoViewIfNeeded();await page.screenshot({path:'artifacts/number-systems-interactions/predict-5175.png'});await browser.close();

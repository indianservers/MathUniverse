import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>console.log('ERROR',e.message));
await page.goto('http://127.0.0.1:5178/number-systems/integers');await page.locator('.np-live').waitFor();await page.screenshot({path:'artifacts/number-systems-interactions/integers-initial.png',fullPage:true});
console.log(await page.locator('.np-live').innerText());await browser.close();

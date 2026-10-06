import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true});const page=await browser.newPage({viewport:{width:1440,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const paths=['','fundamentals','natural-whole','integers','rational','irrational','real-line','hierarchy','fractions-decimals-percentages','ordering-comparing','absolute-distance-intervals','properties-operations','formula-visualizer'];
for(let i=0;i<paths.length;i++){await page.goto('http://127.0.0.1:5178/number-systems/'+paths[i]);await page.locator('.np-studio').waitFor({timeout:60000});await page.waitForTimeout(250);await page.screenshot({path:`artifacts/number-systems-upgrade/first-${String(i+1).padStart(2,'0')}.png`});console.log(paths[i]||'home');}
fs.writeFileSync('artifacts/number-systems-upgrade/browser-errors.json',JSON.stringify(errors,null,2));await browser.close();

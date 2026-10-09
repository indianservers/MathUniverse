import {chromium} from '@playwright/test';
import fs from 'node:fs';
import {freezeDevHotReload} from './ruhi-v53-browser-support.mjs';
const dir='reports/ruhi-chat-ui-v6';fs.mkdirSync(dir,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1080},reducedMotion:'reduce'});const errors=[];page.on('pageerror',e=>errors.push(String(e)));
try{
await freezeDevHotReload(page);
await page.goto('http://127.0.0.1:9867');await page.getByRole('button',{name:'Ask Math · Offline'}).click();await page.getByRole('dialog',{name:'Ruhi solver and drawing assistant',exact:true}).waitFor();await page.screenshot({path:dir+'/welcome-desktop.png'});
await page.getByRole('textbox',{name:'Ask Ruhi anything'}).fill('Plot sin(x)');await page.getByRole('button',{name:'Run request',exact:true}).click();await page.locator('.ruhi-assistant').first().waitFor({timeout:90000});await page.locator('.geo-embedded-graph-body').first().waitFor({timeout:90000});await page.waitForTimeout(1500);await page.screenshot({path:dir+'/graph2d-desktop.png'});console.log('ANSWER',await page.locator('.ruhi-assistant').innerText());
await page.locator('.ruhi-chat-header').getByRole('button',{name:'Help',exact:true}).click();await page.getByRole('searchbox',{name:'Search help'}).fill('3D');await page.screenshot({path:dir+'/help-desktop.png'});await page.getByRole('button',{name:'Close panel'}).click();await page.locator('.ruhi-chat-header').getByRole('button',{name:'Settings',exact:true}).click();await page.screenshot({path:dir+'/settings-desktop.png'});await page.getByRole('button',{name:'Close panel'}).click();
await page.setViewportSize({width:390,height:844});await page.screenshot({path:dir+'/graph2d-mobile.png'});console.log('OVERFLOW',await page.locator('.ruhi-chat-window').evaluate(el=>({width:el.clientWidth,scroll:el.scrollWidth,height:el.clientHeight})));console.log('ERRORS',JSON.stringify(errors));
}finally{await browser.close();}

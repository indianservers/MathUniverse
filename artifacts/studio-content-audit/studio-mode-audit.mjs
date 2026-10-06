import fs from 'node:fs';
import crypto from 'node:crypto';
import {chromium,expect} from '@playwright/test';
const inventory=JSON.parse(fs.readFileSync('artifacts/studio-content-audit/inventory.json','utf8'));
const previous=JSON.parse(fs.readFileSync('artifacts/studio-content-audit/mode-results.json','utf8'));
const queue=inventory.filter(r=>!r.route.includes('?')&&!previous.some(p=>p.route===r.route&&p.modes.length>0&&!p.error));
const browser=await chromium.launch({headless:true});const results=previous.filter(p=>p.modes.length>0&&!p.error);
async function worker(){const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(5000);
while(queue.length){const item=queue.shift();const result={route:item.route,modes:[]};try{await page.goto('http://127.0.0.1:4317'+item.route,{waitUntil:'domcontentloaded'});await page.locator('h1,h2').first().waitFor();const nav=page.locator('nav[aria-label*="mode" i],nav.cs-tabs,nav.gt-tabs').first();if(await nav.count()){const names=await nav.locator('button').allTextContents();for(const name of names){const b=nav.getByRole('button',{name,exact:true}).or(nav.getByRole('tab',{name,exact:true})).first();try{await b.click();const attr=await b.getAttribute('aria-selected')!==null?'aria-selected':'aria-pressed';await expect(b).toHaveAttribute(attr,'true',{timeout:2000});const panel=page.locator('.msk-lab,.la-lab,.cs-workspace,.cxs-lab').first();const panelHtml=await panel.count()?await panel.innerHTML():'';result.modes.push({name,passed:true,surfaceHash:crypto.createHash('sha256').update(panelHtml.replace(/data-[\w-]+="[^"]*"/g,'')).digest('hex')});}catch(e){result.modes.push({name,passed:false,error:e.message.slice(0,150)});}}}}catch(e){result.error=e.message.slice(0,180);}results.push(result);for(let a=0;a<5;a++){try{fs.writeFileSync('artifacts/studio-content-audit/mode-results.json',JSON.stringify(results,null,2));break;}catch(e){if(a===4)throw e;await new Promise(r=>setTimeout(r,200));}}console.log(results.length,result.route,result.modes.length);}
await context.close();}
await Promise.all([worker(),worker()]);await browser.close();

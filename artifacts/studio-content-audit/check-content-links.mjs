import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const b=await chromium.launch({headless:true});const p=await b.newPage();
await p.goto('http://127.0.0.1:5173/studios/curriculum');
const hrefs=await p.evaluate(async()=>{const {masteryCourses}=await import('/src/studios/curriculum/masteryContent.ts');return [...new Set(Object.values(masteryCourses).flatMap(c=>c.units.map(u=>u.href)))];});
const results=[];
for(const href of hrefs){await p.goto('http://127.0.0.1:5173'+href);await p.waitForTimeout(350);const text=await p.locator('body').innerText();results.push({href,missing:/Page not found|404 Not Found|This page does not exist/i.test(text),heading:await p.locator('h1').first().textContent().catch(()=>null)});}
await fs.writeFile('artifacts/studio-content-audit/content-link-check.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results.filter(r=>r.missing||!r.heading),null,2));await b.close();

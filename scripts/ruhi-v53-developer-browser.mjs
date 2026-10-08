import {chromium} from '@playwright/test';
import fs from 'node:fs';
import assert from 'node:assert/strict';
const dir='reports/ruhi-v5.3',browser=await chromium.launch({headless:true}),page=await browser.newPage();
const report={checks:[],errors:[]};
page.on('pageerror',e=>report.errors.push(String(e)));
try {
 await page.goto('http://127.0.0.1:9988/model-training');
 await page.getByRole('tab',{name:'2D NLP Audit',exact:true}).click();
 const panel=page.getByRole('article',{name:'Ruhi 2D NLP audit'});
 await panel.getByText('297 / 300',{exact:true}).first().waitFor();
 report.checks.push({name:'Historical audit renders 297/300 and separate 16.67% neural validation',passed:await panel.innerText().then(t=>t.includes('16.67%'))});
 await panel.getByText('297 / 300',{exact:true}).first().scrollIntoViewIfNeeded();
 await page.screenshot({path:`${dir}/developer-audit.png`,fullPage:true});
 await page.getByRole('tab',{name:'Dataset',exact:true}).click();
 await page.getByRole('button',{name:'Load bundled starter dataset',exact:true}).click();
 await page.locator('.mt-table-wrap tbody tr').first().waitFor();
 report.checks.push({name:'Starter dataset loads without training',passed:await page.locator('.mt-table-wrap tbody tr').count()>0});
 await page.getByRole('tab',{name:'Evaluate',exact:true}).click();
 await page.getByLabel('Inspect a phrase').fill('Draw a circle radius 5');
 await page.getByRole('button',{name:'Inspect semantics without execution',exact:true}).click();
 await page.locator('pre').filter({hasText:'heads'}).waitFor();
 report.checks.push({name:'Existing neural inference and typed plan inspect successfully',passed:await page.locator('pre').filter({hasText:'heads'}).innerText().then(t=>t.includes('CIRCLE'))});
 await page.getByRole('tab',{name:'Train',exact:true}).click();
 report.checks.push({name:'Training controls present only in private developer distribution',passed:await page.getByRole('button',{name:'Train v4 model',exact:true}).count()===1});
 await page.screenshot({path:`${dir}/developer-training-controls.png`,fullPage:true});
 assert.equal(report.errors.length,0);assert.ok(report.checks.every(c=>c.passed));
}catch(error){report.error=String(error);process.exitCode=1;}finally{fs.writeFileSync(`${dir}/developer-browser.json`,JSON.stringify(report,null,2));await browser.close();}

import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
const [id, phase='baseline'] = process.argv.slice(2);
const { items } = JSON.parse(await (await import('node:fs/promises')).readFile('test-evidence/shared-lesson-graphs/source-audit.json','utf8'));
const item=items.find(x=>String(x.id)===id);
if (!item) throw new Error('Unknown inventory lesson');
const browser=await chromium.launch();
try {
const page=await browser.newPage();
const loadTimeout=Number(process.env.LESSON_GRAPH_LOAD_TIMEOUT_MS??45000);
const errors=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('console',e=>{if(e.type()==='error') errors.push(e.text());});
const dir=`test-evidence/shared-lesson-graphs/${id}`;
mkdirSync(dir,{recursive:true});
await page.goto(`${process.env.PLAYWRIGHT_TEST_BASE_URL??'http://127.0.0.1:2266'}${item.route}`,{waitUntil:'domcontentloaded',timeout:loadTimeout});
const lesson=page.locator(`[data-dedicated-lesson="${id}"], .lesson-page-shell[data-lesson-id="${id}"] [data-testid^="2d-graphing-mockup-"]`).first();
await lesson.waitFor({timeout:loadTimeout});
if(process.argv.includes('--dark'))await page.evaluate(()=>globalThis.document.documentElement.classList.add('dark'));
const records=[];
for(const [width,height] of [[1440,900],[768,1024],[390,844]]) {
  await page.setViewportSize({width,height});
  await page.evaluate(()=>globalThis.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:`${dir}/${phase}-${width}.png`,fullPage:true});
  records.push(await lesson.evaluate((root,viewport)=>({viewport,state:{...root.dataset},overflow:globalThis.document.documentElement.scrollWidth>globalThis.innerWidth, controls:[...root.querySelectorAll('button,input,select')].map(e=>({tag:e.tagName,name:e.getAttribute('aria-label')??e.textContent,value:e.value,min:e.min,max:e.max,step:e.step})),bars:[...root.querySelectorAll('.exponential-chart > div')].map(e=>({text:e.textContent,height:e.querySelector('i')?.style.height})),graphs:[...root.querySelectorAll('svg')].filter(e=>e.querySelector('polyline,path,line')).map(e=>({viewBox:e.getAttribute('viewBox'),label:e.getAttribute('aria-label')}))}),{width,height}));
}
writeFileSync(`${dir}/${phase}.json`,JSON.stringify({records,errors},null,2));
console.log({id,phase,errors,overflow:records.map(x=>x.overflow)});
} finally {
  await browser.close();
}

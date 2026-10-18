/* global document, window, getComputedStyle, history, PopStateEvent */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const base = process.env.LESSON_AUDIT_URL || 'http://127.0.0.1:5186';
const output = process.env.LESSON_LAYOUT_OUTPUT || 'artifacts/lesson-layout-audit';
const catalog = JSON.parse(fs.readFileSync('src/modules/lessons/catalog/unified/unifiedLessonIndex.generated.json', 'utf8')).lessons;
const only = process.env.LESSON_AUDIT_ROUTES?.split(',');
const lessons = [...new Map(catalog.filter(x => !only || only.includes(x.route)).map(x => [x.route, x])).values()];
fs.mkdirSync(output, { recursive: true });
const checkpoints = process.env.LESSON_AUDIT_RESUME === '1'
  ? ['checks.json','checks.json.tmp'].flatMap(name => {try{return [JSON.parse(fs.readFileSync(path.join(output,name),'utf8'))];}catch{return [];}}) : [];
const results = (checkpoints.sort((a,b)=>b.length-a.length)[0] || [])
  .filter(x=>!x.error && !x.checks.some(c=>c.scrollbars.length || c.headers.some(h=>h.oversized || h.clipped)));
const completed = new Set(results.map(x => x.route));
const pending = lessons.filter(x => !completed.has(x.route));
let cursor = 0;
const browser = await chromium.launch({ headless: true, args:['--disk-cache-size=1048576'] });

function save() {
  const checkpoint = path.join(output, 'checks.json');
  fs.writeFileSync(checkpoint + '.tmp', JSON.stringify(results));
  // Windows scanners can briefly lock an existing destination. Keep the
  // complete temporary checkpoint available for resuming in that case.
  try {fs.copyFileSync(checkpoint + '.tmp', checkpoint);} catch(error) {console.warn(`Checkpoint copy deferred: ${error.code}`);}
  const failures = results.filter(x => x.error || x.checks.some(c => c.scrollbars.length || c.headers.some(h => h.oversized || h.clipped)));
  const summary = { total: lessons.length, completed: results.length, checks: results.reduce((n,x) => n + (x.checks?.length || 0), 0), errors: results.filter(x => x.error).length, failures: failures.length };
  fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2));
  fs.writeFileSync(path.join(output, 'failures.json'), JSON.stringify(failures, null, 2));
  console.log(JSON.stringify(summary));
}

async function inspect(page, width, tab) {
  return page.evaluate(({width,tab}) => {
    const root = document.querySelector('.standard-lesson-frame') || document.querySelector('[data-lesson-typography]');
    const visible = e => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden' && e.getBoundingClientRect().height > 0;
    const describe = e => ({ tag:e.tagName, className:e.getAttribute('class'), text:(e.textContent || '').replace(/\s+/g,' ').trim().slice(0,90), height:Math.round(e.getBoundingClientRect().height), scrollHeight:e.scrollHeight, overflowY:getComputedStyle(e).overflowY });
    const scrollbars = [document.body,...document.querySelectorAll('body *')].filter(e => e !== document.querySelector('#main-content') && e.clientHeight > 0 && e.scrollHeight > e.clientHeight + 3 && /^(auto|scroll)$/.test(getComputedStyle(e).overflowY) && visible(e)).map(describe);
    if(document.documentElement.scrollHeight>document.documentElement.clientHeight+3 && /^(auto|scroll)$/.test(getComputedStyle(document.documentElement).overflowY)) scrollbars.push(describe(document.documentElement));
    const titleContainers=[...root.querySelectorAll('h1')].filter(visible).map(h=>h.closest('header,[class*="-hero"],[class*="-header"],[class*="-intro"]') || (h.parentElement.querySelector('main,h2') ? h : h.parentElement));
    const headers = [...new Set([...titleContainers,...root.querySelectorAll('.adapter-frame-header')])].filter(visible).map(e => {
      const rect=e.getBoundingClientRect();
      const content=[...e.querySelectorAll('h1,button,select')].filter(visible);
      return {...describe(e),oversized:rect.height > (width < 600 ? 280 : 110),clipped:content.some(c => {const r=c.getBoundingClientRect();return r.bottom>rect.bottom+3||r.right>rect.right+3||r.left<rect.left-3;})};
    });
    return {width,tab,scrollbars,headers};
  }, {width,tab});
}

async function worker() {
  let page = await browser.newPage({ viewport:{width:1440,height:900} });
  let batchCount=0;
  while (cursor < pending.length) {
    const lesson=pending[cursor++];
    let deadline;
    try {
      if(batchCount===0) console.log(JSON.stringify({starting:lesson.id,route:lesson.route}));
      await Promise.race([(async()=>{
      if(page.url()==='about:blank') await page.goto(base+lesson.route,{waitUntil:'domcontentloaded',timeout:60000});
      else await page.evaluate(route=>{history.pushState({},'',route);window.dispatchEvent(new PopStateEvent('popstate'));},lesson.route);
      await page.waitForFunction(id => {
        const root=document.querySelector('.standard-lesson-frame');
        const content=root?.querySelector('.standard-lesson-content');
        return root?.getAttribute('data-standard-lesson-id')===String(id) && [...(content?.querySelectorAll('h1,h2')||[])].some(e=>e.getClientRects().length && getComputedStyle(e).visibility!=='hidden') && !content.querySelector('[aria-label="Loading lesson interaction"]') && !content.querySelector('.animate-spin') && !/Loading lesson \d/.test(content.textContent);
      },lesson.id,{timeout:45000});
      await page.waitForTimeout(70);
      const checks=[];
      const tabs=page.locator('.standard-lesson-frame > .lesson-section-toolbar [role="tab"]');
      const count=await tabs.count();
      for(const width of [1440,390]) {
        await page.setViewportSize({width,height:900});
        await page.waitForTimeout(35);
        for(let t=0;t<Math.max(count,1);t++) {
          if(count) {await tabs.nth(t).evaluate(e=>e.click());await page.waitForTimeout(25);}
          const tab=count?await tabs.nth(t).innerText():'default';
          checks.push(await inspect(page,width,tab));
          if(t===0 && process.env.LESSON_AUDIT_SCREENSHOTS==='1') await page.screenshot({path:path.join(output,`${lesson.id}-${width}.png`)});
        }
      }
      results.push({id:lesson.id,route:lesson.route,title:lesson.title,checks});
      })(),new Promise((_,reject)=>{deadline=setTimeout(()=>reject(new Error('Lesson layout audit exceeded 60 seconds')),60000);})]);
    } catch(error) {
      console.log(JSON.stringify({failed:lesson.id,error:String(error)}));
      results.push({id:lesson.id,route:lesson.route,error:String(error)});
      await page.context().close();page=await browser.newPage({viewport:{width:1440,height:900}});batchCount=0;
    }
    clearTimeout(deadline);
    if(++batchCount===20){await page.context().close();page=await browser.newPage({viewport:{width:1440,height:900}});batchCount=0;}
    if(results.length%10===0)save();
  }
  await page.close();
}
try { await Promise.all(Array.from({length:Number(process.env.LESSON_AUDIT_WORKERS || 3)},worker)); }
finally {save();await browser.close();}
if (results.length !== lessons.length || results.some(x => x.error || x.checks.some(c => c.scrollbars.length || c.headers.some(h => h.oversized || h.clipped)))) process.exitCode = 1;

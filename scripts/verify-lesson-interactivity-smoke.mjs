import {chromium,expect} from '@playwright/test';
import fs from 'node:fs/promises';
const index=Number(process.argv[2]);
const queue=JSON.parse(await fs.readFile('audit/lesson-interactivity/reverse-queue.json','utf8')).queue;
const sources=JSON.parse(await fs.readFile('audit/lesson-interactivity/source-map.json','utf8'));
const overrides=JSON.parse(await fs.readFile('audit/lesson-interactivity/route-overrides.json','utf8'));
const row=queue.find(r=>r.index===index),source=sources.find(r=>r.index===index);
const route=overrides[index]??source?.route??row?.route;
if(!route)throw new Error(`Lesson ${index}: route needs mapping`);
const browser=await chromium.launch({headless:true,args:['--no-proxy-server']});
const page=await browser.newPage({serviceWorkers:'block',viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
 await page.goto(`${process.env.LESSON_AUDIT_URL||'http://127.0.0.1:5188'}${route}`,{waitUntil:'commit'});
 const root=source?page.getByTestId(source.testId):page.locator('.standard-lesson-content').first();
 await root.waitFor({timeout:120000});
 const pause=root.getByRole('button',{name:/^Pause(?:\s|$)/i}).first();
 if(await pause.isVisible().catch(()=>false))await pause.click();
 const rotate=root.getByRole('checkbox',{name:/^(?:Auto.?rotate|Rotate solid|Rotate view|Auto.?rotation)$/i}).first();
 if(await rotate.isVisible().catch(()=>false)&&await rotate.isChecked())await rotate.uncheck();
 await page.evaluate(()=>document.fonts.ready);
 const snapshot=()=>root.evaluate(el=>{
  const excluded='button,nav,header,footer,.lesson-topic-study-board,.lesson-supplemental-study,[data-lesson-study-board]';
  const graphics=Array.from(el.querySelectorAll('svg,canvas,output,.math-expression,table,[data-result]')).filter(node=>!node.closest(excluded)).map(node=>node.tagName.toLowerCase()==='canvas'?node.toDataURL():node.tagName.toLowerCase()==='table'?node.textContent:node.outerHTML);
  const copy=el.cloneNode(true);copy.querySelectorAll(excluded+',input,select,textarea,[hidden],[role="status"],svg,canvas').forEach(n=>n.remove());
  const mathText=(copy.textContent||'').replace(/\s+/g,' ').trim();
  return JSON.stringify({graphics,mathText});
 });
 await page.waitForTimeout(700);
 let stable=await snapshot();
 for(let attempt=0;attempt<12;attempt++){await page.waitForTimeout(200);const current=await snapshot();if(current===stable)break;stable=current;}
 await page.waitForTimeout(150);
 if(stable!==await snapshot())throw new Error(`Lesson ${index}: animated view needs a custom activity check.`);
 let action=null;
 for(const selector of ['input[type=range]','input[type=number]','select']) {
  const controls=root.locator(selector);
  for(let i=0;i<Math.min(await controls.count(),6);i++) {
   const control=controls.nth(i);if(!await control.isVisible()||!await control.isEnabled())continue;
   const label=await control.getAttribute('aria-label')||await control.getAttribute('name')||selector;
   const before=await snapshot(),previous=await control.inputValue();
   if(selector==='select') {
    const values=await control.locator('option:not([disabled])').evaluateAll(options=>options.map(o=>o.value));
    const next=values.find(v=>v!==previous);if(next===undefined)continue;await control.selectOption(next);
   } else if(selector==='input[type=range]') {
    await control.focus();const max=Number(await control.getAttribute('max')??100);await control.press(Number(previous)>=max?'ArrowLeft':'ArrowRight');
   } else {
    const min=Number(await control.getAttribute('min')??-Infinity),max=Number(await control.getAttribute('max')??Infinity),step=Number(await control.getAttribute('step')||1)||1;
    const next=Number(previous)+step<=max?Number(previous)+step:Number(previous)-step;if(next<min||!Number.isFinite(next))continue;await control.fill(String(next));
   }
   try {await expect.poll(snapshot,{timeout:2000}).not.toBe(before);action={control:label,before:previous,after:await control.inputValue(),evidence:'Activity mathematics changed; inputs, buttons, navigation, hidden panels and supplemental study boards excluded.'};break;}catch{}
  }
  if(action)break;
 }
 if(!action) {
  const buttons=root.getByRole('button');
  let attempted=0;
  for(let i=0;i<await buttons.count()&&attempted<12;i++) {
   const button=buttons.nth(i);if(!await button.isVisible()||!await button.isEnabled())continue;
   const label=await button.getAttribute('aria-label')||await button.innerText();
   if(!label.trim()||/^(Interact|Learn|Example|Formula|Practice)$|share|download|export|import|delete|reset|undo|redo|help|workspace|fullscreen|full screen|expand|collapse|hint|back|next lesson|previous lesson|finish|complete|reveal|solution|show|hide|explain|settings|zoom/i.test(label))continue;
   if(await button.evaluate(el=>Boolean(el.closest('nav,[role=tablist],[role=tab],[class$="-tabs"]')||el.querySelector('.lucide-maximize,.lucide-maximize-2,.lucide-expand'))))continue;
   const before=await snapshot();attempted++;
   await button.click();
   try {await expect.poll(snapshot,{timeout:1800}).not.toBe(before);action={control:label,kind:'button-driven mathematical activity',evidence:'A mathematical graphic, formula, table or output changed; toolbar icons and input markup excluded.'};break;}catch{}
  }
 }
 if(!action)throw new Error(`Lesson ${index}: no verified mathematical response from a non-checkbox control; needs a custom activity check.`);
 const overflow=[];
 for(const width of [390,768,1440]) {await page.setViewportSize({width,height:1000});await expect.poll(()=>root.evaluate(el=>el.scrollWidth-el.clientWidth),{timeout:3000}).toBeLessThanOrEqual(0);const bounds=await root.evaluate(el=>({width:innerWidth,client:el.clientWidth,scroll:el.scrollWidth}));overflow.push(bounds);expect(bounds.scroll).toBeLessThanOrEqual(bounds.client);}
 expect(errors).toEqual([]);
 await fs.mkdir('audit/lesson-interactivity/evidence',{recursive:true});
 await fs.writeFile(`audit/lesson-interactivity/evidence/${String(index).padStart(4,'0')}.json`,JSON.stringify({status:'interaction-verified',route,action,overflow,errors,scope:'Interactivity and responsive smoke check; does not replace topic-specific mathematical regression tests.'},null,2));
 console.log(JSON.stringify({index,route,action,overflow,errors}));
} finally {await browser.close();}

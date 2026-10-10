import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { chromium } from 'playwright';

const root=process.cwd();
const source=fs.readFileSync(path.join(root,'src/studios/mockup/studioMockupCatalog.ts'),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {studioMockups}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const curriculum=fs.readFileSync('src/studios/curriculum/curriculumCatalog.ts','utf8');
const studios=[...curriculum.split('const scopes:')[0].matchAll(/\['([^']+)','([^']+)','([^']+)'/g)].map(([,id,name,base])=>({id,name,base}));
const belongs=url=>studios.some(s=>url.split('?')[0]===s.base||url.startsWith(s.base+'/'));
const app=fs.readFileSync('src/App.tsx','utf8');
const routes=new Set(studios.flatMap(s=>[s.base,`/studios/${s.id}/curriculum`]));
routes.add('/shapes');
for(const [,route] of app.matchAll(/path\s*=\s*"([^"]+)"/g))if(!route.includes(':')&&belongs('/'+route))routes.add('/'+route);
for(const studio of Object.values(studioMockups))for(const page of studio.pages)if(belongs(page.route))routes.add(page.route);
// Model labs are declared through a route loop rather than literal Route paths.
for(const slug of ['motion','population','epidemics','finance','optimization','networks','regression','periodic','numerical','comparison'])routes.add('/mathematical-modelling/'+slug);
const requested=process.env.STUDIO_AUDIT_ROUTES?.split(',');
const targets=requested||[...routes].sort();
const widths=(process.env.STUDIO_AUDIT_WIDTHS||'320,390,768').split(',').map(Number);
const baseURL=process.env.STUDIO_AUDIT_URL||'http://127.0.0.1:5190';
const output=process.env.STUDIO_AUDIT_OUTPUT||'artifacts/studio-mobile-audit.json';
const browser=await chromium.launch({headless:true});
const results=[];
let reported=0;
try {
 const page=await browser.newPage({viewport:{width:widths[0],height:844},isMobile:true,hasTouch:true});
 let errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const route of targets){
  errors=[];
  try {
   await page.goto(baseURL+route,{waitUntil:'domcontentloaded',timeout:60000});
   await page.locator('.studio-learning-host').waitFor({timeout:60000});
   await page.waitForFunction(()=>document.querySelector('.studio-learning-content')?.textContent.trim().length>100,{timeout:60000});
   await page.waitForTimeout(180);
   for(const width of widths){
    await page.setViewportSize({width,height:844});
    await page.waitForTimeout(60);
    const measure=()=>{
     const root=document.querySelector('.studio-learning-host');
     const visible=el=>{const r=el.getBoundingClientRect();const s=getComputedStyle(el);for(let ancestor=el.parentElement;ancestor;ancestor=ancestor.parentElement){if(ancestor.matches('details:not([open])')&&!ancestor.querySelector(':scope > summary')?.contains(el))return false;}return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none'&&s.clip!=='rect(0px, 0px, 0px, 0px)'&&!el.closest('[hidden],.sr-only,.vis-hidden,.visually-hidden,.coord-live-region,.katex-mathml');};
     const name=el=>`${el.tagName.toLowerCase()}.${String(el.className?.baseVal??el.className).trim().replaceAll(' ','.').slice(0,130)}`;
     const overflowing=[...root.querySelectorAll('*')].filter(el=>{
      if(!visible(el)||el.closest('svg')||el.matches('canvas,table,thead,tbody,tr,input,select,textarea'))return false;
      const mathScroller=el.closest('.katex,.katex-display');
      if(mathScroller&&getComputedStyle(mathScroller).overflowX==='auto')return false;
      const s=getComputedStyle(el);
      return el.clientWidth>0&&el.scrollWidth>el.clientWidth+3&&!['auto','scroll'].includes(s.overflowX);
     }).map(el=>({element:name(el),width:el.clientWidth,content:el.scrollWidth,text:el.textContent.trim().slice(0,60)}));
     const smallTargets=[...root.querySelectorAll('button,a,summary,input:not([type=hidden]),select,textarea')].filter(el=>visible(el)&&!el.disabled&&!el.matches('input[type=range],input[type=checkbox],input[type=radio]')).map(el=>({el,r:el.getBoundingClientRect()})).filter(({r})=>r.height<43||r.width<43).map(({el,r})=>({element:name(el),label:el.getAttribute('aria-label')||el.textContent.trim().slice(0,60),width:Math.round(r.width),height:Math.round(r.height)}));
     const plots=[...root.querySelectorAll('canvas,svg[viewBox],svg[role=img]')].filter(el=>visible(el)&&el.getBoundingClientRect().width>100).map(el=>({element:name(el),width:Math.round(el.getBoundingClientRect().width),height:Math.round(el.getBoundingClientRect().height)}));
     const shell=root.querySelector('.cs-shell');
     const styleIssues=shell&&!getComputedStyle(shell).getPropertyValue('--cs-ink').trim()?['Calculus shell stylesheet is missing']:[];
     const panel=root.querySelector('.focused-lab > [role="tabpanel"]');
     const mainPlot=[...root.querySelectorAll('canvas,svg[viewBox]')].find(el=>visible(el)&&el.getBoundingClientRect().width>180&&el.getBoundingClientRect().height>150);
     return {documentOverflow:document.documentElement.scrollWidth>innerWidth+2,overflowing,smallTargets,plots,styleIssues,scrollHeight:panel?.scrollHeight,viewportHeight:panel?.clientHeight,firstPlotTop:mainPlot?Math.round(mainPlot.getBoundingClientRect().top):null,bodyText:root.textContent.trim().slice(0,130)};
    };
    const measurement=await page.evaluate(measure);
    results.push({route,width,...measurement,smallTargets:width<768?measurement.smallTargets:[],errors:[...errors]});
    if(process.argv.includes('--controls')&&width<768) {
     const toggle=page.getByRole('button',{name:/^Show controls/});
     if(await toggle.count()) {
      await toggle.tap();await page.waitForTimeout(100);
      const state=await page.evaluate(measure);
      results.push({route,width,section:'Controls expanded',...state,errors:[...errors]});
      await page.getByRole('button',{name:/^Hide controls/}).tap();
     }
    }
    if(process.argv.includes('--sections')) {
     const tabs=page.locator('.lab-section-tabs button');
     const count=await tabs.count();
     const initial=await tabs.evaluateAll(es=>es.findIndex(e=>e.getAttribute('aria-selected')==='true'));
     for(let i=0;i<count;i++) {
      if(i===initial)continue;
      const tab=tabs.nth(i),section=await tab.textContent();
      await tab.tap();await page.waitForTimeout(100);
      const state=await page.evaluate(measure);
      results.push({route,width,section,...state,smallTargets:width<768?state.smallTargets:[],errors:[...errors]});
     }
     if(count)await tabs.nth(initial).tap();
    }
   }
  } catch(error){results.push({route,error:String(error)});}
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,JSON.stringify({studios,routes:targets,widths,results},null,2));
  if(results.length-reported>=20){console.log(`Checked ${results.length} route/viewport cases`);reported=results.length;}
 }
} finally {await browser.close();}
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify({studios,routes:targets,widths,results},null,2));
const failures=results.filter(r=>r.error||r.documentOverflow||r.overflowing?.length||r.errors?.length||r.styleIssues?.length);
console.log(JSON.stringify({cases:results.length,layoutFailures:failures.length,smallTargetCases:results.filter(r=>r.smallTargets?.length).length,output}));
console.log(JSON.stringify(failures.slice(0,12).map(r=>({route:r.route,width:r.width,error:r.error,overflow:r.overflowing?.slice(0,6),errors:r.errors})),null,2));
if((process.env.STUDIO_AUDIT_STRICT==='1'||process.argv.includes('--strict'))&&(failures.length||results.some(r=>r.smallTargets?.length)))process.exitCode=1;

import fs from 'node:fs';
import ts from 'typescript';
import { chromium } from '@playwright/test';
const out='artifacts/studio-content-audit';
fs.mkdirSync(out,{recursive:true});
const source=fs.readFileSync('src/studios/mockup/studioMockupCatalog.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {studioMockups}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const roots=['algebra','algebraic-structures','geometry','trigonometry','calculus','number-systems','linear-algebra','complex-numbers','mathematical-modelling','discrete-world','set-theory','graph-theory','probability-statistics','differential-equations'];
const app=fs.readFileSync('src/App.tsx','utf8');
const routes=new Map();
for(const def of Object.values(studioMockups))for(const p of def.pages)routes.set(p.route,{route:p.route,title:p.title,modes:p.modes});
for(const root of roots)routes.set('/'+root,{...routes.get('/'+root),route:'/'+root});
for(const m of app.matchAll(/path="([^"]+)"/g))if(roots.includes(m[1].split('/')[0])&&!m[1].includes(':'))routes.set('/'+m[1],{...routes.get('/'+m[1]),route:'/'+m[1]});
for(const m of app.matchAll(/\{\[([^\]]+)\]\.map\(\(slug\) => \(\s*<Route[^\n]*path=\{`([^$`]+)\$\{slug\}`\}/g)){
  if(roots.includes(m[2].split('/')[0]))for(const q of m[1].matchAll(/"([^"]+)"/g)){const route='/'+m[2]+q[1];routes.set(route,{...routes.get(route),route});}
}
const setSource=fs.readFileSync('src/modules/set-theory/SetTheoryModule.tsx','utf8');
for(const m of setSource.matchAll(/slug: "([^"]+)"/g)){const route='/set-theory/'+m[1];routes.set(route,{route});}
for(const [file,key,root] of [['src/data/geometryConcepts.ts','geometryConcepts','geometry'],['src/data/trigonometryConcepts.ts','trigonometryConcepts','trigonometry'],['src/modules/probability-statistics/data/distributionAtlas.ts','distributionSpecs','probability-statistics/distributions']]){
 const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
 const mod=await import('data:text/javascript;base64,'+Buffer.from(compiled).toString('base64'));
 for(const p of mod[key]){const route='/'+root+'/'+p.id;if(!routes.has(route))routes.set(route,{route,title:p.title||p.name});}
}
for(const slug of ['equation-explorer','direction-fields','homogeneous','growth','oscillations']){const route='/differential-equations/'+slug;routes.set(route,{route});}
for(const route of ['/geometry?tab=advanced','/trigonometry?tab=advanced','/complex-numbers?tab=advanced','/probability-statistics?tab=advanced','/linear-algebra?mode=advanced','/discrete-world?workbench=advanced'])routes.set(route,{route});
const previous=JSON.parse(fs.readFileSync(out+'/browser-results.json','utf8'));
const queue=[...routes.values()].filter(r=>!previous.some(p=>p.route===r.route&&!p.failure));fs.writeFileSync(out+'/inventory.json',JSON.stringify([...routes.values()],null,2));
const browser=await chromium.launch({headless:true});
const results=previous.filter(p=>!p.failure);
async function worker(){
 while(queue.length){const context=await browser.newContext();const page=await context.newPage();page.setDefaultTimeout(5000);const item=queue.shift();console.log('START',item.route);const errors=[];const onError=e=>errors.push(e.message);page.on('pageerror',onError);
  const result={...item,errors};
  try{await Promise.race([(async()=>{
   await page.goto('http://127.0.0.1:4317'+item.route,{waitUntil:'domcontentloaded',timeout:30000});
   await page.locator('h1,h2').first().waitFor({timeout:20000});
   result.actualPath=new URL(page.url()).pathname;
   result.headings=await page.locator('h1,h2,h3').allTextContents();
   result.controls=await page.locator('main input, main select, main textarea').evaluateAll(es=>es.map(e=>({type:e.type||e.tagName,label:e.getAttribute('aria-label')||e.id,disabled:e.disabled})));
   result.svg=await page.locator('main svg[role="img"],main canvas').count();
   result.words=(await page.locator('main').first().innerText()).split(/\s+/).length;
   result.modeChecks=[];
   for(const mode of item.modes||[]){
    const nav=page.locator('nav.msk-tabs').getByRole('button',{name:mode,exact:true});
    if(await nav.count()===1){await nav.click();result.modeChecks.push({mode,active:await nav.getAttribute('aria-pressed'),content:(await page.locator('[data-mode-canvas]').first().innerText().catch(()=>'' )).slice(0,160)});}
    else result.modeChecks.push({mode,unavailable:true});
   }
   const slider=page.locator('main input[type="range"]:enabled').first();
   if(await slider.count()){
    const before=await slider.inputValue();await slider.focus();await slider.press(before===await slider.getAttribute('max')?'ArrowLeft':'ArrowRight');
    result.slider={before,after:await slider.inputValue(),label:await slider.getAttribute('aria-label')};
   }
  })(),new Promise((_,reject)=>{const t=setTimeout(()=>reject(new Error('Route inspection exceeded 45 seconds')),45000);t.unref();})]);}catch(e){result.failure=String(e.message).slice(0,500);}
  page.off('pageerror',onError);results.push(result);for(let attempt=0;attempt<5;attempt++){try{fs.writeFileSync(out+'/browser-results.json',JSON.stringify(results,null,2));break;}catch(e){if(attempt===4)throw e;await new Promise(r=>setTimeout(r,200));}}
  console.log(results.length,item.route,result.failure?'FAIL':errors.length?'ERROR':'OK');await Promise.race([context.close(),new Promise(r=>setTimeout(r,3000))]);
 }
}
await Promise.all([worker(),worker(),worker()]);await browser.close();
console.log('TOTAL',results.length);


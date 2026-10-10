import fs from 'node:fs';
/* global document, window */
import ts from 'typescript';
import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const compiled=ts.transpileModule(fs.readFileSync('src/studios/investigations/catalog.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {investigations}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const base=process.env.STUDIO_INVESTIGATIONS_URL||'http://127.0.0.1:5191';
const browser=await chromium.launch({headless:true});
const results=[];
fs.mkdirSync('artifacts/studio-investigations',{recursive:true});
try{
 const page=await browser.newPage({viewport:{width:390,height:844},acceptDownloads:true});
 let errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const lab of investigations){
  errors=[];const route=`/studios/${lab.studio}/labs/${lab.id}`;
  await page.goto(base+route,{waitUntil:'domcontentloaded'});
  await page.getByRole('heading',{name:lab.title,exact:true}).waitFor({timeout:60000});
  assert.equal(await page.locator('.investigation-metrics').count(),0,'Evidence should wait for prediction/reveal.');
  await page.getByLabel('Your prediction and reason').fill('I will compare the relationship with a changed input.');
  await page.getByRole('button',{name:'Reveal and explore',exact:true}).click();
  await page.locator('.investigation-metrics').waitFor();
  assert.equal(await page.locator('.investigation-error').count(),0,lab.id);
  await page.getByRole('button',{name:'Capture baseline',exact:true}).click();
  const numeric=lab.fields.find(field=>typeof field.value==='number');
  if(numeric){const next=numeric.value+numeric.step<=numeric.max?numeric.value+numeric.step:numeric.value-numeric.step;await page.getByRole('spinbutton',{name:numeric.label,exact:true}).fill(String(next));await page.getByRole('button',{name:'Reset worked example',exact:true}).click();await page.locator('.investigation-metrics').waitFor();assert.equal(await page.locator('.investigation-error').count(),0);}
  await page.getByLabel('Transfer answer',{exact:true}).fill('');
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  assert.match(await page.locator('form + p[role=status]').textContent(),/Enter a finite number/);
  await page.getByRole('button',{name:'Show worked answer',exact:true}).click();
  const answer=await page.locator('.investigation-card').filter({has:page.getByRole('heading',{name:'4. Transfer check'})}).locator('p > b').textContent();
  await page.getByLabel('Transfer answer',{exact:true}).fill(answer.replaceAll(',',''));
  await page.getByRole('button',{name:'Check answer',exact:true}).click();
  assert.match(await page.locator('form + p[role=status]').textContent(),/^Correct/);
  const overflow=await page.locator('.studio-investigations').evaluate(el=>({own:el.scrollWidth-el.clientWidth,document:document.documentElement.scrollWidth-window.innerWidth}));
  assert(overflow.own<=2&&overflow.document<=2,`${lab.id}: horizontal overflow ${JSON.stringify(overflow)}`);
  assert.deepEqual(errors,[],lab.id);
  results.push({route,width:390,checked:true,errors,overflow});
  if(results.length%10===0)console.log(`Verified ${results.length}/57 mobile investigations.`);
 }
 for(const width of [320,1280]){
  await page.setViewportSize({width,height:900});
  for(const lab of investigations.filter(l=>['factorization','boundary','flow','fourier','regression'].includes(l.id))){await page.goto(base+`/studios/${lab.studio}/labs/${lab.id}`);await page.getByRole('button',{name:'Reveal and explore',exact:true}).click();await page.locator('.investigation-metrics').waitFor();assert(await page.locator('.studio-investigations').evaluate(el=>el.scrollWidth<=el.clientWidth+2));results.push({lab:lab.id,width,checked:true});}
 }
 await page.setViewportSize({width:390,height:844});
 await page.goto(base+'/studios/linear-algebra/labs/factorization');await page.getByRole('button',{name:'Reveal and explore',exact:true}).click();
 await page.getByRole('combobox',{name:'Factorization',exact:true}).selectOption('SVD');
 await page.getByRole('textbox',{name:'Matrix rows (semicolon separated)',exact:true}).fill('1,2,3;4,5,6');
 await page.locator('.investigation-metrics').waitFor();
 const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Download investigation report',exact:true}).click();const download=await downloadPromise;
 await download.saveAs('artifacts/studio-investigations/example-report.json');
 const report=JSON.parse(fs.readFileSync('artifacts/studio-investigations/example-report.json','utf8'));assert.equal(report.inputs.mode,'SVD');assert.equal(report.inputs.data,'1,2,3;4,5,6');assert(Number(report.result.metrics['Reconstruction residual'])<1e-8);
 await page.screenshot({path:'artifacts/studio-investigations/matrix-mobile.png',fullPage:true});
 await page.goto(base+'/studios/algebra/curriculum');await page.locator('a[href="/studios/algebra/labs/parameter"]').first().waitFor();
 await page.locator('a[href="/studios/algebra/labs/parameter"]').first().click();await page.getByRole('heading',{name:'Parameter cases',exact:true}).waitFor();
 await page.getByRole('button',{name:'Reveal and explore',exact:true}).click();await page.getByRole('spinbutton',{name:'Coefficient a',exact:true}).fill('');await page.getByRole('alert').filter({hasText:'Coefficient a'}).waitFor();await page.getByRole('spinbutton',{name:'Coefficient a',exact:true}).fill('0');await page.locator('.investigation-metrics').waitFor();assert.match(await page.locator('.investigation-metrics').textContent(),/All real x/);
 console.log(`Passed ${results.length} responsive route checks, transfer feedback, reset/recovery, SVD export and curriculum navigation.`);
}finally{fs.writeFileSync('artifacts/studio-investigations/browser-checks.json',JSON.stringify(results,null,2));await browser.close();}

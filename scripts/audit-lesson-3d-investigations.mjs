/* global document, innerWidth */
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { chromium } from 'playwright';

const directory='artifacts/lesson-3d-investigations';
await fs.mkdir(directory,{recursive:true});
const bundled=await build({entryPoints:['src/modules/lessons/three/lesson3DRegistry.ts'],bundle:true,platform:'node',format:'esm',write:false});
const {lesson3DInvestigations}=await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);
const catalog=JSON.parse(await fs.readFile('tmp/lesson-review-catalog.json','utf8'));
const selected=process.env.LESSON_3D_IDS?.split(',').map(Number);
const lessons=lesson3DInvestigations.filter(c=>!selected||selected.includes(c.id)).map(config=>({...config,...catalog.find(l=>l.id===config.id)}));
await fs.writeFile(`${directory}/rollout.json`,JSON.stringify(lesson3DInvestigations.map(config=>{const lesson=catalog.find(l=>l.id===config.id);return {...config,title:lesson.title,route:lesson.route};}),null,2));
const priority=new Set([191,192,404,405,422,423,424,10157,10158,318,319,350,376,377,10100]);
const output=selected?'targeted-validation':'browser-validation';
const browser=await chromium.launch({headless:true});
const results=[];
let saving=Promise.resolve();
try{
  const pages=await Promise.all(Array.from({length:selected?1:2},()=>browser.newPage({viewport:{width:1365,height:900}})));
  for(const page of pages)page.setDefaultTimeout(20000);
  for(let offset=0;offset<lessons.length;offset+=50){
    const batch=lessons.slice(offset,offset+50);let cursor=0;
    await Promise.all(pages.map(async page=>{
      while(cursor<batch.length){
        const lesson=batch[cursor++],errors=[];
        const onError=e=>errors.push(e.message);page.on('pageerror',onError);
        const result={id:lesson.id,title:lesson.title,family:lesson.family,operation:lesson.operation,batch:offset/50+1,checks:{},errors};
        try{
          console.log(`Opening 3D lesson ${lesson.id}`);
          await page.goto(`http://127.0.0.1:5176${lesson.route}`,{waitUntil:'commit',timeout:60000});
          const entry=page.locator(`[data-lesson-3d-id="${lesson.id}"]`);
          await entry.getByRole('button',{name:'Open 3D investigation',exact:true}).click({timeout:60000});
          const panel=page.getByTestId(`lesson-3d-investigation-${lesson.id}`);
          await panel.locator('canvas').waitFor({timeout:60000});
          await panel.locator('.l3d-readouts output').first().waitFor();
          const rect=await panel.locator('canvas').boundingBox();assert.ok(rect.width>=200&&rect.height>=200);result.checks.canvas=true;
          const initial=await panel.locator('.l3d-readouts').innerText();
          const numbers=panel.getByRole('spinbutton');
          if(lesson.id===364){
            const slider=panel.getByRole('slider',{name:'Target z component',exact:true});await slider.focus();await slider.press('ArrowRight');
          }else if(await numbers.count()){
            const field=numbers.nth(lesson.family==='geometry'?1:0),old=Number(await field.inputValue());
            await field.fill(String(old===1.7?0.7:1.7));await field.press('Tab');
          }else{
            const slider=panel.getByRole('slider').first();await slider.focus();await slider.press('ArrowRight');
          }
          await page.waitForTimeout(150);
          const changed=await panel.locator('.l3d-readouts').innerText();assert.notEqual(initial,changed,'Parameter must change the lesson-specific readout');result.checks.liveMathematics=true;
          const reflection=panel.getByRole('button',{name:'Mark prediction compared',exact:true});assert.ok(await reflection.isDisabled());result.checks.reflectionGuard=true;
          await panel.getByRole('textbox',{name:'3D investigation prediction',exact:true}).fill('I predict the parameter will change the measured result.');
          await panel.getByRole('textbox',{name:'3D investigation observation',exact:true}).fill('I compared the geometry with its updated equation and readout.');
          await reflection.click();assert.ok(await panel.getByText('Prediction and observation compared. This is a reflection, not an automatically graded answer.',{exact:true}).isVisible());result.checks.reflection=true;
          const top=panel.getByRole('button',{name:'Top (xy)',exact:true});await top.focus();await top.press('Enter');
          assert.equal(await top.getAttribute('aria-pressed'),'true');assert.equal(await panel.locator('.l3d-readouts').innerText(),changed);result.checks.keyboardCamera=true;
          await panel.getByRole('button',{name:'Reset 3D investigation',exact:true}).click();assert.equal(await panel.locator('.l3d-readouts').innerText(),initial);result.checks.reset=true;
          if(lesson.id===191){const area=await panel.getByText('Parallelogram area',{exact:true}).locator('..').innerText();await panel.getByRole('button',{name:'Swap u and v',exact:true}).click();assert.equal(await panel.getByText('Parallelogram area',{exact:true}).locator('..').innerText(),area);result.checks.crossProductSwap=true;}
          if(lesson.id===404){const fold=panel.getByRole('slider',{name:'Fold fraction',exact:true});await fold.focus();await fold.press('End');assert.ok((await panel.locator('.l3d-readouts').innerText()).includes('90°'));result.checks.fold=true;}
          if([10157,10158].includes(lesson.id)){await panel.getByRole('combobox',{name:'Line configuration',exact:true}).selectOption('Parallel');assert.ok((await panel.locator('.l3d-readouts').innerText()).includes('Parallel'));await panel.getByRole('combobox',{name:'Line configuration',exact:true}).selectOption('Coincident');assert.ok((await panel.locator('.l3d-readouts').innerText()).includes('Coincident'));result.checks.lineCases=true;}
          result.checks.desktopOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2);
          if(priority.has(lesson.id))await panel.screenshot({path:`${directory}/${lesson.id}-desktop.png`});
          await page.setViewportSize({width:390,height:844});
          result.checks.mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2);
          if(priority.has(lesson.id)){await panel.locator('.l3d-canvas').screenshot({path:`${directory}/${lesson.id}-mobile.png`});await page.evaluate(()=>document.documentElement.classList.add('dark'));await panel.locator('.l3d-canvas').screenshot({path:`${directory}/${lesson.id}-dark.png`});await page.evaluate(()=>document.documentElement.classList.remove('dark'));}
          result.snapshot=await panel.ariaSnapshot();
          await page.setViewportSize({width:1365,height:900});
          assert.equal(result.checks.desktopOverflow,true,'Desktop overflow');assert.equal(result.checks.mobileOverflow,true,'Mobile overflow');assert.equal(errors.length,0,'Browser runtime errors');result.passed=true;
        }catch(error){result.passed=false;result.failure=error.message;}
        page.off('pageerror',onError);results.push(result);console.log(JSON.stringify({id:result.id,passed:result.passed,checks:result.checks,failure:result.failure,errors}));
        saving=saving.then(()=>fs.writeFile(`${directory}/${output}.json`,JSON.stringify({total:lessons.length,completed:results.length,passed:results.filter(r=>r.passed).length,results},null,2)));await saving;
      }
    }));
    console.log(`3D batch ${offset/50+1}: ${batch.length} lessons checked`);
  }
}finally{await browser.close();}
if(results.some(r=>!r.passed))process.exitCode=1;

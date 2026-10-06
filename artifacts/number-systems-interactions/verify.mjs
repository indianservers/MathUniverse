import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs';
const browser=await chromium.launch({headless:true}),context=await browser.newContext({permissions:['clipboard-read','clipboard-write']}),page=await context.newPage(),errors=[],checks=[],layouts=[],axe=[];
page.on('pageerror',e=>{errors.push(e.message);console.log('PAGE ERROR',page.url(),e.message);});
const entries=[['home','7'],['fundamentals','N'],['natural-whole','4'],['integers','3'],['rational','0.75'],['irrational','1.414214'],['real-line','1'],['hierarchy','W'],['fractions-decimals-percentages','75'],['ordering-comparing','<'],['absolute-distance-intervals','yes'],['properties-operations','3'],['formula-visualizer','8']];
const url=id=>'http://127.0.0.1:5178/number-systems'+(id==='home'?'':'/'+id);
function assert(name,pass){checks.push({name,pass});if(!pass)console.log('FAIL',name);}
await page.setViewportSize({width:1440,height:1000});
for(const [id,answer] of entries){
 console.log('Interaction audit',id);
 await page.goto(url(id));const lab=page.locator('.np-live');await lab.waitFor();
 await lab.getByRole('button',{name:'Hide result & make a prediction'}).click();await lab.getByRole('textbox',{name:'Live model prediction'}).fill(answer);await lab.getByRole('button',{name:'Check prediction',exact:true}).click();assert(`${id}: answer graded against live defaults`,(await lab.locator('.np-live-feedback').innerText()).startsWith('Correct'));
 assert(`${id}: repeat award locked`,await lab.getByRole('button',{name:'Check prediction',exact:true}).isDisabled());
 await lab.getByRole('button',{name:'25 ways to interact with this lab'}).count().catch(()=>0);
 assert(`${id}: 25 enhancement checklist`,await lab.locator('.np-live-guide li').count()===25);
 const audit=await new AxeBuilder({page}).include('.np-live').withTags(['wcag2a','wcag2aa']).analyze();axe.push({id,violations:audit.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,message:n.failureSummary}))}))});
}
await page.goto(url('integers'));let lab=page.locator('.np-live');await lab.waitFor();
await lab.getByRole('textbox',{name:'Start A',exact:true}).fill('-7');await lab.getByRole('textbox',{name:'Change B',exact:true}).fill('-3');assert('integer inputs update result',(await lab.locator('.np-live-stage-heading').innerText()).includes('→ -10'));
await lab.getByRole('button',{name:'Subtract',exact:true}).click();assert('subtract negative live result',(await lab.locator('.np-live-stage-heading').innerText()).includes('→ -4'));
await lab.getByRole('button',{name:'Save experiment',exact:true}).click();await lab.getByRole('button',{name:'Increase Start A',exact:true}).click();assert('nudge changes model',await lab.getByRole('textbox',{name:'Start A',exact:true}).inputValue()==='-6');
await lab.getByRole('button',{name:'Undo',exact:true}).click();await expect(lab.getByRole('textbox',{name:'Start A',exact:true})).toHaveValue('-7');assert('undo restores displayed input',true);await lab.getByRole('button',{name:'Redo',exact:true}).click();await expect(lab.getByRole('textbox',{name:'Start A',exact:true})).toHaveValue('-6');assert('redo restores edited input',true);
await lab.getByRole('button',{name:'Restore saved',exact:true}).click();await expect(lab.getByRole('textbox',{name:'Start A',exact:true})).toHaveValue('-7');assert('saved model restored',true);
await lab.getByRole('button',{name:'Share model',exact:true}).click();const shared=page.url();await page.goto(shared);lab=page.locator('.np-live');await lab.waitFor();assert('share reload restores live input',await lab.getByRole('textbox',{name:'Start A',exact:true}).inputValue()==='-7');
await lab.getByRole('button',{name:'Notebook',exact:true}).click();await lab.getByRole('textbox',{name:'Observation',exact:true}).fill('Subtracting a negative moves to the right.');await lab.getByRole('button',{name:'Save observation',exact:true}).click();assert('notebook stores observed model',await lab.locator('.np-live-notebook article').count()===1);await lab.getByRole('button',{name:'Revisit model',exact:true}).click();assert('notebook reloads mathematical mode',(await lab.locator('.np-live-stage-heading').innerText()).includes('-7 − -3'));
await lab.getByRole('button',{name:'Play the steps',exact:false}).click();await page.waitForTimeout(2300);assert('playback reaches computed end',await lab.locator('.np-live-walk').innerText().then(t=>t.includes('Walker at -4')));
await lab.getByRole('button',{name:'Hide result & make a prediction'}).click();await lab.getByRole('button',{name:'Hint',exact:true}).click();assert('hint explains selected operation',(await lab.innerText()).includes('subtraction reverses'));await lab.getByRole('button',{name:'Show solution',exact:true}).click();assert('solution cannot award points',await lab.getByRole('button',{name:'Check prediction',exact:true}).isDisabled());
await lab.getByRole('button',{name:'Explore',exact:true}).click();await lab.getByRole('textbox',{name:'Start A',exact:true}).fill('2.5');assert('invalid integer input prevents stale model',await lab.locator('[role=alert]').count()===1&&await lab.locator('.np-live-stage-heading').count()===0);
await lab.getByRole('button',{name:'Reset experiment',exact:true}).click();await lab.locator('[aria-label="Number point A: -2"]').count();
const point=lab.locator('svg g[role=button]').first();await point.focus();await page.keyboard.press('ArrowRight');assert('keyboard point edit updates field',await lab.getByRole('textbox',{name:'Start A',exact:true}).inputValue()==='-1');
const handle=point.locator('circle').first(),box=await handle.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+50,box.y+box.height/2,{steps:6});await page.mouse.up();assert('pointer point edit updates field',await lab.getByRole('textbox',{name:'Start A',exact:true}).inputValue()!=='-1');
for(const [width,height] of [[1920,1080],[1440,900],[1366,768],[768,1024],[390,844]]){
 await page.setViewportSize({width,height});for(const [id] of entries){console.log('Viewport',width,id);await page.goto(url(id));await page.locator('.np-live').waitFor();const m=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,labOverflow:document.querySelector('.np-live').scrollWidth>document.querySelector('.np-live').clientWidth+1}));layouts.push({id,width,height,...m});if(width===1440||width===390){await page.screenshot({path:`artifacts/number-systems-interactions/${id}-${width}.png`,fullPage:true});}}
 console.log('Checked',width);
}
for(const id of ['home','integers']){await page.goto('http://127.0.0.1:5175/number-systems'+(id==='home'?'':'/'+id));await page.locator('.np-live').waitFor();assert(`requested 5175 ${id} has live interaction`,await page.locator('.np-live').count()===1);}
fs.writeFileSync('artifacts/number-systems-interactions/results.json',JSON.stringify({checks,layouts,axe,errors},null,2));console.log(JSON.stringify({checks:checks.length,failed:checks.filter(c=>!c.pass),overflow:layouts.filter(l=>l.overflow||l.labOverflow),axe:axe.filter(a=>a.violations.length),errors},null,2));await browser.close();

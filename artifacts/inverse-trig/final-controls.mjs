import {chromium,expect} from '@playwright/test';import assert from 'node:assert/strict';import fs from 'node:fs';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1366,height:900}});const issues=[];
p.on('pageerror',e=>issues.push(e.message));p.on('console',m=>{if(['error','warning'].includes(m.type()))issues.push(m.text());});
await p.goto('http://127.0.0.1:5178/trigonometry/inverse/arcsin',{waitUntil:'domcontentloaded',timeout:120000});
const input=p.getByLabel('Function input x',{exact:true});await input.fill('');await input.pressSequentially('-.5');assert.equal(Number(await input.inputValue()),-.5);assert.match(await p.getByLabel('Live principal angle').innerText(),/-30.00°/);
await input.fill('2');assert.equal(await input.inputValue(),'1');
const circle=p.locator('#ivt-geometry .ivt-circle');await circle.scrollIntoViewIfNeeded();const box=await circle.boundingBox();await p.mouse.click(box.x+box.width*.7,box.y+box.height*.32);assert.notEqual(await input.inputValue(),'1');
await p.getByLabel('Adjust function input x').focus();const before=Number(await input.inputValue());await p.getByLabel('Adjust function input x').press('ArrowLeft');await p.waitForTimeout(100);console.log({before,after:await input.inputValue(),slider:await p.getByLabel('Adjust function input x').inputValue()});assert(Number(await input.inputValue())<before);
assert.equal(await p.getByRole('heading',{name:'Inverse Trig: learn and explore',exact:true}).count(),1);
const tabs=p.getByRole('tablist',{name:'Inverse Trig explanations'});for(const name of ['Theory & examples','In Simple words','Formulas','Real-time examples','Try these'])assert.equal(await tabs.getByRole('tab',{name,exact:true}).count(),1);
await p.locator('.ivt-subnav').getByRole('link',{name:'Overview',exact:true}).click();
for(const name of ['Arcsin','Arccos','Arctan','Principal Values','Compositions']){await p.locator('.ivt-home-grid .ivt-topic').filter({has:p.getByRole('heading',{name,exact:true})}).click();await expect(p.locator('.ivt-studio h1')).toHaveText(name);await p.locator('.ivt-subnav').getByRole('link',{name:'Overview',exact:true}).click();await expect(p.locator('.ivt-studio h1')).toHaveText('Inverse Trigonometry');}
assert.deepEqual(issues,[]);fs.writeFileSync('artifacts/inverse-trig/final-controls.json',JSON.stringify({negativeTyping:true,domainClamping:true,circleDragging:true,keyboardSlider:true,allDashboardCards:true,preservedTabs:true,consoleIssues:issues},null,2));console.log('Final controls passed');await b.close();

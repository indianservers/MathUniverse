import { chromium } from '@playwright/test';
import fs from 'node:fs';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1672,height:1050}});
const errors=[];page.on('pageerror',error=>errors.push(error.message));
const report={routes:[],legacy:[],interactions:[],errors};
const base='http://127.0.0.1:5178/trigonometry/inverse';
for(const slug of ['', 'arcsin','arccos','arctan','principal-values','compositions']){
  if(!slug) await page.goto(base,{waitUntil:'domcontentloaded',timeout:120000}); else { await page.locator('.ivt-subnav').getByRole('link',{name: {'arcsin':'Arcsin','arccos':'Arccos','arctan':'Arctan','principal-values':'Principal Values','compositions':'Compositions'}[slug],exact:true}).click(); await page.waitForURL(`${base}/${slug}`); }
  const root=page.locator('.ivt-studio');await root.waitFor();await page.waitForTimeout(800);await root.locator('.ivt-header').scrollIntoViewIfNeeded();
  await page.screenshot({path:`artifacts/inverse-trig/${slug||'overview'}-desktop.png`,fullPage:true});
  report.routes.push({slug:slug||'overview',title:await root.locator('h1').innerText(),preserved:await page.getByRole('heading',{name:'Inverse Trig: learn and explore',exact:true}).count(),overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});
  if(['arcsin','arccos','arctan'].includes(slug)){
    const input=root.getByLabel('Function input x',{exact:true});await input.fill('.5');
    report.interactions.push({slug,half:await root.getByLabel('Live principal angle').innerText()});
    await root.getByLabel('Adjust function input x').fill(slug==='arctan'?'1':'-1');
    const graph=root.locator('#ivt-live-graph .ivt-graph');await graph.scrollIntoViewIfNeeded();const box=await graph.boundingBox();
    await page.mouse.move(box.x+box.width*.65,box.y+box.height*.45);await page.mouse.down();await page.mouse.move(box.x+box.width*.7,box.y+box.height*.4);await page.mouse.up();
    report.interactions.push({slug,draggedInput:await input.inputValue()});
    if(slug!=='arctan'){await input.fill('2');report.interactions.push({slug,clamped:await input.inputValue()});}
    await root.getByRole('button',{name:'Reset',exact:true}).click();
    await root.getByLabel('Your answer (rounded to 2 decimal places)').fill(slug==='arcsin'?'36.87':slug==='arccos'?'60':'56.31');await root.getByRole('button',{name:'Check Answer',exact:true}).click();
    report.interactions.push({slug,quiz:await root.locator('#ivt-quiz [role=status]').innerText()});
    if(slug==='arctan'){await root.getByLabel('Show asymptotes').uncheck();await root.getByLabel('Show asymptotes').check();}
  }
  if(slug==='principal-values'){
    await root.getByRole('group',{name:'Choose principal function'}).getByRole('button',{name:'Arctan',exact:true}).click();
    await root.getByLabel('Compare all three ranges').uncheck();report.interactions.push({slug,selectedRanges:await root.locator('.ivt-range-card').count(),rangeLabel:await root.locator('.ivt-numberline').getAttribute('aria-label')});
    await root.getByLabel('Original angle θ (degrees)',{exact:true}).fill('90');report.interactions.push({slug,pole:await root.locator('[role=alert]').innerText()});
    await root.getByRole('button',{name:'Reset',exact:true}).click();
  }
  if(slug==='compositions'){
    for(const [option,value] of [['arcsin:direct','.5'],['arccos:direct','-.25'],['arctan:direct','2'],['arcsin:reverse','135'],['arccos:reverse','225'],['arctan:reverse','135']]){
      await root.getByLabel('Choose a composition',{exact:true}).selectOption(option);await root.getByLabel('Composition input',{exact:true}).fill(value);report.interactions.push({slug,option,result:await root.locator('.ivt-composition-result').innerText()});
    }
    await root.getByLabel('Composition input',{exact:true}).fill('90');report.interactions.push({slug,pole:await root.locator('.ivt-composition-result').innerText()});
    await root.getByLabel('Composition angle unit').selectOption('radians');
    await root.getByRole('button',{name:'Reset',exact:true}).click();
  }
  await page.setViewportSize({width:390,height:844});await root.locator('.ivt-header').scrollIntoViewIfNeeded();await page.screenshot({path:`artifacts/inverse-trig/${slug||'overview'}-mobile.png`,fullPage:true});
  const mobileOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);
  report.routes.at(-1).mobileOverflow=mobileOverflow;await page.setViewportSize({width:1672,height:1050});
}
for(const [mode,slug] of [['Arcsin','arcsin'],['Arccos','arccos'],['Arctan','arctan'],['Principal Values','principal-values'],['Compositions','compositions']]){
  await page.goto(`${base}?mode=${encodeURIComponent(mode)}`,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForURL(`${base}/${slug}`);report.legacy.push({mode,url:page.url()});
}
fs.writeFileSync('artifacts/inverse-trig/browser-report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));await browser.close();

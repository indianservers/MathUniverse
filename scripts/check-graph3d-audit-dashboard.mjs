import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
  const page=await browser.newPage({viewport:{width:1440,height:1100},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  await page.goto('http://127.0.0.1:4317/src/graph-studio/command-audit/dashboard.html',{waitUntil:'domcontentloaded',timeout:120000});
  await expect(page.locator('tbody tr')).toHaveCount(150,{timeout:60000});
  const frame=page.frameLocator('#workspace');await frame.locator('#surface-3d-panel canvas').first().waitFor({state:'visible',timeout:120000});
  const row=page.locator('tbody tr').filter({has:page.locator('td').filter({hasText:/^121\. Create a cube, then make it blue\.$/})});
  await row.getByRole('button',{name:'Rerun',exact:true}).click();
  await expect.poll(()=>page.locator('#summary').textContent(),{timeout:60000}).not.toMatch(/^Running/);
  await expect(row.locator('td').nth(1)).toHaveText('passed');
  await frame.locator('#surface-3d-panel').screenshot({path:'reports/graph3d-command-audit/verified-blue-cube.png',timeout:15000});
  await page.screenshot({path:'reports/graph3d-command-audit/dashboard.png',timeout:15000});
  expect(errors).toEqual([]);
  await writeFile('reports/graph3d-command-audit/dashboard-check.json',JSON.stringify({passed:true,rows:150,singleCaseRerun:121,errors},null,2));
  console.log('Dashboard: 150 rows; case 121 rerun through iframe passed; no page errors.');
}finally{await browser.close();}

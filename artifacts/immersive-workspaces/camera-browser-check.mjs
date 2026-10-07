import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
const context=await browser.newContext({viewport:{width:1440,height:1000},permissions:['camera']});
await context.addInitScript(()=>{window.__cameraTracks=[];const original=navigator.mediaDevices?.getUserMedia.bind(navigator.mediaDevices);if(original)navigator.mediaDevices.getUserMedia=async constraints=>{const stream=await original(constraints);window.__cameraTracks.push(...stream.getTracks());return stream;};});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));const results=[];
for(const route of ['/workspace/graph','/workspace/geometry','/workspace/3d','/math-lab/3d-graphing']){
 await page.goto('http://127.0.0.1:5175'+route,{timeout:120000});await page.getByRole('button',{name:'Hand Gestures',exact:true}).waitFor({timeout:120000});
 const before=await page.locator('input[type=number]').evaluateAll(inputs=>inputs.map(i=>i.value));
 await page.getByRole('button',{name:'Hand Gestures',exact:true}).click();await expect(page.locator('.immersive-hud video')).toHaveJSProperty('readyState',4,{timeout:30000});
 await page.getByRole('button',{name:'Minimize immersive status'}).click();await page.getByRole('button',{name:'Minimize immersive status'}).click();
 const running=await page.evaluate(()=>window.__cameraTracks.filter(t=>t.readyState==='live').length);expect(running).toBe(1);
 await page.getByRole('button',{name:'Exit immersive modes'}).click();await expect.poll(()=>page.evaluate(()=>window.__cameraTracks.filter(t=>t.readyState==='live').length)).toBe(0);
 expect(await page.locator('input[type=number]').evaluateAll(inputs=>inputs.map(i=>i.value))).toEqual(before);
 await page.getByRole('button',{name:'AR',exact:true}).click();await expect(page.locator('.immersive-hud [role=status]').first()).toContainText(/not available/, {timeout:30000});await page.getByRole('button',{name:'Exit immersive modes'}).click();
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/immersive-workspaces/mobile-'+route.split('/').at(-1)+'.png'});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth);const buttons=await page.locator('.immersive-buttons button').evaluateAll(items=>items.map(item=>{const r=item.getBoundingClientRect();return {x:r.x,right:r.right,y:r.y,bottom:r.bottom}}));
 results.push({route,cameraStreams:running,cameraStopped:true,stateRetained:true,mobileOverflow:overflow,mobileButtons:buttons});await page.setViewportSize({width:1440,height:1000});
}
console.log(JSON.stringify({results,errors},null,2));await browser.close();

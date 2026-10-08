import {test,expect} from '@playwright/test';
test('streamed model downloads show real percentages while the page stays usable',async({page})=>{
 test.setTimeout(90000);
 await page.addInitScript(()=>{const original=window.fetch.bind(window);window.fetch=async(input,init)=>{const response=await original(input,init);const url=typeof input==='string'?input:input instanceof URL?input.href:input.url;if(!url.includes('/models/')||!url.endsWith('.bin')||!response.ok)return response;const bytes=new Uint8Array(await response.arrayBuffer());let offset=0;const headers=new Headers(response.headers);headers.delete('content-encoding');headers.set('content-length',String(bytes.length));return new Response(new ReadableStream({async pull(controller){await new Promise(resolve=>setTimeout(resolve,60));if(offset===bytes.length){controller.close();return;}controller.enqueue(bytes.slice(offset,offset+4096));offset=Math.min(bytes.length,offset+4096);}}),{headers,status:200});};});
 await page.goto('/');await page.getByRole('button',{name:'Ask Math · Offline'}).click();const downloads=page.getByRole('complementary',{name:'Model downloads'});await expect(downloads).toBeVisible();
 await expect.poll(async()=>downloads.locator('progress').evaluateAll(nodes=>nodes.some(node=>{const value=node.getAttribute('value');return value!==null&&Number(value)>0&&Number(value)<100;}))).toBe(true);
 await expect(downloads).toContainText(/\d+% loaded/);await page.getByLabel('What would you like to create or solve?').fill('draw a circle radius 2');await expect(page.getByLabel('What would you like to create or solve?')).toHaveValue('draw a circle radius 2');await page.screenshot({path:'artifacts/model-loading/download-progress.png'});
 await expect(downloads.locator('[data-phase="ready"]').first()).toBeVisible({timeout:60000});
});
test('failed model downloads show an actionable error instead of an endless loader',async({page})=>{
 await page.route('**/models/**/*.bin',route=>route.fulfill({status:503,body:'Unavailable'}));await page.goto('/');await page.getByRole('button',{name:'Ask Math · Offline'}).click();const error=page.locator('.model-download-card[data-phase="error"]').first();await expect(error).toContainText('Unable to load',{timeout:20000});await expect(error).toContainText('503');await error.getByRole('button',{name:/Dismiss/}).click();await expect(page.getByLabel('What would you like to create or solve?')).toBeEnabled();
});
test('actual AR worker reports downloads and initializes from downloaded assets',async({page})=>{
 test.setTimeout(90000);await page.goto('/');
 const result=await page.evaluate(async()=>{
  const worker=new Worker('/src/ar-math-lab/arHandTracking.worker.ts?worker_file&type=module',{type:'module'});
  return new Promise<{ready:boolean;progress:number;initializing:boolean;error?:string}>(resolve=>{let progress=0,initializing=false;const timer=setTimeout(()=>{worker.terminate();resolve({ready:false,progress,initializing,error:'Timed out'});},70000);worker.onmessage=({data})=>{if(data.type==='progress')progress++;if(data.type==='initializing')initializing=true;if(data.type==='ready'||data.type==='error'){clearTimeout(timer);worker.terminate();resolve({ready:data.type==='ready',progress,initializing,error:data.message});}};worker.onerror=event=>{clearTimeout(timer);worker.terminate();resolve({ready:false,progress,initializing,error:event.message});};worker.postMessage({type:'init',root:location.origin+'/ar-hand-tracking/'});});
 });expect(result.error).toBeUndefined();expect(result.ready).toBe(true);expect(result.progress).toBeGreaterThan(3);expect(result.initializing).toBe(true);
});

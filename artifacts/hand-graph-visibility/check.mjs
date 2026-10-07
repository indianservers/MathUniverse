import {chromium,expect} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
const page=await browser.newPage({viewport:{width:1440,height:1000},permissions:['camera']});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5175/math-lab/3d-graphing',{timeout:120000});
await page.getByRole('button',{name:'Hand Gestures',exact:true}).click();
await expect(page.locator('.immersive-hud video')).toHaveJSProperty('readyState',4,{timeout:30000});
await page.waitForTimeout(2000);
const result=await page.evaluate(async()=>{
 let f=document.querySelector('.immersive-buttons')[Object.keys(document.querySelector('.immersive-buttons')).find(k=>k.startsWith('__reactFiber'))];
 while(f&&!f.memoizedProps?.value?.adapter)f=f.return;
 const controller=f.memoizedProps.value,adapter=controller.adapter.current;
 const canvas=adapter.element().querySelector('canvas');let lost=0;canvas.addEventListener('webglcontextlost',()=>lost++);
 const read=()=>{const gl=canvas.getContext('webgl2');const pixels=new Uint8Array(canvas.width*canvas.height*4);gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);let colored=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]>60||pixels[i+1]>60||pixels[i+2]>80)colored++;return colored;};
 const before=read();
 for(let i=0;i<50;i++){adapter.navigate([.0005,0,0],1.002);await new Promise(r=>setTimeout(r,20));}
 // Feed recognized open palms through the actual engine and navigation frame path.
 for(let i=0;i<40;i++){
  const p=Array.from({length:21},()=>({x:.5+i*.0005,y:.6,z:0}));p[0].y=.75;p[2]={x:.4,y:.67,z:0};p[4]={x:.25,y:.55,z:0};
  for(let j=0;j<4;j++){p[5+j*4]={x:.44+j*.04,y:.6,z:0};p[6+j*4]={x:.44+j*.04,y:.54,z:0};p[8+j*4]={x:.44+j*.04,y:.3,z:0};}
  controller.nativeHands([{landmarks:p,handedness:'right',confidence:1}],100000+i*34);await new Promise(r=>setTimeout(r,20));
 }
 await new Promise(r=>setTimeout(r,100));
 return {sameCanvas:adapter.element().querySelector('canvas')===canvas,contextLost:lost,before,after:read(),hudBackground:getComputedStyle(document.querySelector('.immersive-hud')).backgroundColor,landmarks:!!document.querySelector('[data-testid=ar-hand-landmarks]')};
});
expect(result.sameCanvas).toBe(true);expect(result.contextLost).toBe(0);expect(result.after).toBeGreaterThan(1000);expect(result.hudBackground).toBe('rgb(255, 255, 255)');expect(errors).toEqual([]);
await page.screenshot({path:'artifacts/hand-graph-visibility/after.png'});console.log(JSON.stringify({...result,errors},null,2));await browser.close();

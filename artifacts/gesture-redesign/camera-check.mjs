import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
const page=await browser.newPage({viewport:{width:1440,height:1000},permissions:['camera']});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{const Original=window.Worker;window.Worker=class extends EventTarget{constructor(url,options){super();if(!String(url).includes('arHandTracking'))return new Original(url,options);window.__handWorker=this;}postMessage(message){if(message.type==='init')queueMicrotask(()=>this.onmessage?.({data:{type:'ready'}}));if(message.bitmap)message.bitmap.close();}terminate(){}};});
await page.goto('http://127.0.0.1:5175/modules/ar-math-lab',{timeout:120000});
await page.getByRole('button',{name:'Add 2D graph to AR scene',exact:true}).click();
await page.getByRole('button',{name:'Cube',exact:true}).click();await page.getByRole('button',{name:'Generate Solid',exact:true}).first().click();
await page.getByRole('button',{name:'Camera + hand gestures',exact:true}).click();await page.getByTestId('ar-camera-workspace').waitFor();await page.waitForTimeout(1500);
const result=await page.evaluate(async()=>{
 const button=[...document.querySelectorAll('button')].find(b=>b.textContent==='Hand gestures on');let f=button[Object.keys(button).find(k=>k.startsWith('__reactFiber'))];while(f&&!f.memoizedProps?.runtime)f=f.return;const runtime=f.memoizedProps.runtime;
 const read=()=>runtime.current.gestureObjects.map(o=>({name:o.name,transform:structuredClone(o.read())}));const original=read();let time=performance.now();
 const pose=(kind)=>{const up=kind==='index'?[1,0,0,0]:kind==='ok'?[0,1,1,1]:[0,0,0,0];const p=Array.from({length:21},()=>({x:.5,y:.65,z:0}));p[0]={x:.5,y:.75,z:0};p[9]={x:.5,y:.6,z:0};p[5]={x:.44,y:.6,z:0};p[17]={x:.58,y:.6,z:0};p[2]={x:.35,y:.67,z:0};p[4]=kind==='left'?{x:.15,y:.67,z:0}:{x:.53,y:.64,z:0};for(let j=0;j<4;j++){p[6+j*4]={x:.44+j*.04,y:.54,z:0};p[8+j*4]={x:.44+j*.04,y:up[j]?.3:.65,z:0};}if(kind==='ok')p[4]={...p[8]};return p;};
 const trace=[];const feed=async(kind,ms)=>{for(let i=0;i<ms;i+=34){window.__handWorker.onmessage({data:{type:'hands',timestamp:time+=34,landmarks:[pose(kind)],handedness:[[{categoryName:'Right',score:1}]]}});if(kind==='fist'&&i<120)trace.push({pose:runtime.current.state?.hands[0]?.pose,feedback:runtime.current.gesture,transform:read()});await new Promise(r=>setTimeout(r,8));}await new Promise(r=>setTimeout(r,100));};
 await feed('index',2000);const selection=runtime.current.gesture.selected;await feed('left',1200);const moved=read();await feed('fist',400);const held=read();await feed('ok',700);const reset=read();return {original,selection,moved,held,reset,feedback:runtime.current.gesture,trace};
});
console.log(JSON.stringify(result,null,2));expect(result.original.length).toBeGreaterThan(0);expect(result.moved[0]).not.toEqual(result.original[0]);expect(result.moved.slice(1)).toEqual(result.original.slice(1));expect(result.held).toEqual(result.moved);expect(result.reset).toEqual(result.original);expect(result.feedback.selected).toBe(result.selection);expect(errors).toEqual([]);
await page.screenshot({path:'artifacts/gesture-redesign/camera.png'});await writeFile('artifacts/gesture-redesign/camera.json',JSON.stringify({...result,errors},null,2));console.log(JSON.stringify({...result,errors},null,2));await browser.close();

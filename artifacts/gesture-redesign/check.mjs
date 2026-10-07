import {chromium,expect} from '@playwright/test';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({headless:true,args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream','--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
const results=[];
for(const route of ['/math-lab/3d-graphing','/workspace/3d','/workspace/graph','/workspace/geometry']){
 const page=await browser.newPage({viewport:{width:1440,height:1000},permissions:['camera']});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5175'+route,{timeout:120000});
 if(route==='/workspace/geometry'){
  await page.getByRole('button',{name:'Point',exact:true}).first().click();const box=await page.getByTestId('workspace-geometry-board').boundingBox();await page.mouse.click(box.x+box.width*.5,box.y+box.height*.5);await page.mouse.click(box.x+box.width*.6,box.y+box.height*.5);
 }
 await page.getByRole('button',{name:'Hand Gestures',exact:true}).click();await expect(page.locator('.immersive-hud video')).toHaveJSProperty('readyState',4,{timeout:30000});
 await page.locator('.immersive-hud').getByRole('button',{name:'Hand gestures on',exact:true,includeHidden:true}).evaluate(el=>el.click());await page.waitForTimeout(300);
 const outcome=await page.evaluate(async()=>{
  const el=document.querySelector('.immersive-buttons');let f=el[Object.keys(el).find(k=>k.startsWith('__reactFiber'))];while(f&&!f.memoizedProps?.value?.adapter)f=f.return;const controller=f.memoizedProps.value;
  let time=100000;const state=()=>document.querySelector('.gesture-feedback').innerText;
  const p=(pose)=>{const up={index:[1,0,0,0],fist:[0,0,0,0],palm:[1,1,1,1],victory:[1,1,0,0],three:[1,1,1,0],horns:[1,0,0,1],ok:[0,1,1,1],right:[0,0,0,0]}[pose];const points=Array.from({length:21},()=>({x:.5,y:.65,z:0}));points[0]={x:.5,y:.75,z:0};points[9]={x:.5,y:.6,z:0};points[5]={x:.44,y:.6,z:0};points[17]={x:.58,y:.6,z:0};points[2]={x:.35,y:.67,z:0};points[4]=pose==='palm'?{x:.15,y:.55,z:0}:pose==='right'?{x:.85,y:.67,z:0}:{x:.53,y:.64,z:0};for(let j=0;j<4;j++){points[6+j*4]={x:.44+j*.04,y:.54,z:0};points[8+j*4]={x:.44+j*.04,y:up[j]?.3:.65,z:0};}if(pose==='ok')points[4]={...points[8]};return points;};
  const feed=async(pose,ms)=>{for(let i=0;i<ms;i+=34){controller.nativeHands([{landmarks:p(pose),handedness:'right',confidence:1}],time+=34);await new Promise(r=>setTimeout(r,4));}await new Promise(r=>setTimeout(r,150));};
  const objects=()=>controller.adapter.current.gestureObjects?.();const read=()=>{const o=objects()?.find(o=>o.capabilities.move);return o?o.read():controller.adapter.current.transform(controller.adapter.current.targets()[0]?.objectId);};
  const canvas=controller.adapter.current.element().querySelector('canvas');let lost=0;canvas?.addEventListener('webglcontextlost',()=>lost++);
  const original=structuredClone(read());await feed('index',5000);const selectedOnce=state();await feed('right',1200);const moved=structuredClone(read());await feed('fist',500);const held=structuredClone(read());await feed('ok',700);const reset=structuredClone(read());
  const cycle=[];for(let n=0;n<(objects()?.length??controller.adapter.current.targets().length)+4;n++){await feed('fist',300);await feed('index',500);cycle.push(state().split('\n')[1]);if(cycle.at(-1)==='None')break;}
  const beforeMissing=state();controller.nativeHands([],time+=34);await new Promise(r=>setTimeout(r,150));const afterMissing=state();
  return {original,moved,held,reset,selectedOnce,cycle,beforeMissing,afterMissing,sameCanvas:!canvas||canvas===controller.adapter.current.element().querySelector('canvas'),contextLost:lost};
 });
 console.log(route,JSON.stringify(outcome));expect(outcome.selectedOnce).not.toContain('Selected\nNone');expect(outcome.moved).not.toEqual(outcome.original);expect(outcome.held).toEqual(outcome.moved);expect(outcome.reset).toEqual(outcome.original);expect(outcome.cycle).toContain('None');expect(outcome.sameCanvas).toBe(true);expect(outcome.contextLost).toBe(0);expect(errors).toEqual([]);
 await page.screenshot({path:`artifacts/gesture-redesign/${route.replaceAll('/','-')}.png`});results.push({route,...outcome,errors});await page.close();
}
await writeFile('artifacts/gesture-redesign/browser.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));await browser.close();

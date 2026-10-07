import {chromium,expect} from '@playwright/test';import fs from 'node:fs';
const b=await chromium.launch({args:['--use-fake-device-for-media-stream','--use-fake-ui-for-media-stream']});const p=await b.newPage({permissions:['camera'],viewport:{width:1366,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.addInitScript(()=>{
  const RealWorker=window.Worker;window.__testHands=true;window.__trackerError=false;
  window.Worker=class extends EventTarget{
    constructor(url,options){super();if(!String(url).includes('arHandTracking'))return new RealWorker(url,options);this.stopped=false;}
    postMessage(data){if(this.stopped)return;if(data.type==='init'){queueMicrotask(()=>this.onmessage?.({data:{type:'ready'}}));return;}if(data.type==='frame'){data.bitmap.close();if(window.__freezeTracker)return;setTimeout(()=>{if(this.stopped)return;if(window.__trackerError){window.__trackerError=false;this.onmessage?.({data:{type:'error'}});return;}const landmarks=Array.from({length:21},(_,i)=>({x:.2+(i%4)*.035,y:.4+Math.floor(i/4)*.025,z:0}));this.onmessage?.({data:{type:'hands',timestamp:data.time,processingMs:1,landmarks:window.__testHands?[landmarks]:[],handedness:[[{categoryName:'Right',score:.99}]]}});},10);}}
    terminate(){this.stopped=true;}
  };
});
await p.goto('http://127.0.0.1:5178/modules/ar-math-lab',{waitUntil:'domcontentloaded',timeout:120000});
const nav=p.getByRole('navigation',{name:'AR view modes'});await nav.waitFor();for(const name of ['Camera + hand gestures','AR + hand gestures','3D Preview','Exit'])await expect(nav.getByRole('button',{name,exact:true})).toBeVisible();
await nav.getByRole('button',{name:'Camera + hand gestures',exact:true}).click();const stage=p.getByTestId('ar-camera-stage'),canvas=p.getByTestId('ar-hand-landmarks');await canvas.waitFor();await expect(p.getByText('1 hand recognized — colored joints show live detection.',{exact:true})).toBeVisible();
await expect(p.getByLabel('Mirror camera',{exact:true})).toBeChecked();await expect.poll(async()=>p.evaluate(()=>{
  const c=document.querySelector('[data-testid=ar-hand-landmarks]'),v=document.querySelector('video'),stage=document.querySelector('[data-testid=ar-camera-stage]');let x=.8,y=.4;const va=v.videoWidth/v.videoHeight,sa=stage.clientWidth/stage.clientHeight;if(va>sa)x=1-(.5+(.2-.5)*va/sa);else y=.5+(.4-.5)*sa/va;return c.getContext('2d').getImageData(Math.round(x*c.width),Math.round(y*c.height),1,1).data[3];
})).toBeGreaterThan(0);
await p.getByLabel('Mirror camera',{exact:true}).uncheck();await expect.poll(async()=>p.evaluate(()=>{
  const c=document.querySelector('[data-testid=ar-hand-landmarks]'),v=document.querySelector('video'),stage=document.querySelector('[data-testid=ar-camera-stage]');let x=.2,y=.4;const va=v.videoWidth/v.videoHeight,sa=stage.clientWidth/stage.clientHeight;if(va>sa)x=.5+(.2-.5)*va/sa;else y=.5+(.4-.5)*sa/va;return c.getContext('2d').getImageData(Math.round(x*c.width),Math.round(y*c.height),1,1).data[3];
})).toBeGreaterThan(0);
await p.getByLabel('Show hand points',{exact:true}).uncheck();await expect(canvas).toHaveCount(0);await p.getByLabel('Show hand points',{exact:true}).check();
await p.evaluate(()=>window.__testHands=false);await expect(p.getByText('0 hands recognized — colored joints show live detection.',{exact:true})).toBeVisible();
await expect.poll(async()=>canvas.evaluate(c=>c.getContext('2d').getImageData(0,0,c.width,c.height).data.some((value,i)=>i%4===3&&value>0))).toBe(false);
await p.evaluate(()=>window.__testHands=true);await expect(p.getByText('1 hand recognized — colored joints show live detection.',{exact:true})).toBeVisible();
await p.getByRole('button',{name:'Hand gestures on',exact:true}).click();await expect(p.getByText('Hand tracking inactive.',{exact:true})).toBeVisible();await p.getByRole('button',{name:'Hand gestures off',exact:true}).click();await expect(p.getByText('1 hand recognized — colored joints show live detection.',{exact:true})).toBeVisible();
await p.evaluate(()=>window.__trackerError=true);await p.getByRole('button',{name:'Retry hand tracking',exact:true}).waitFor();await p.getByRole('button',{name:'Retry hand tracking',exact:true}).click();await expect(p.getByText('1 hand recognized — colored joints show live detection.',{exact:true})).toBeVisible();
await p.evaluate(()=>window.__freezeTracker=true);await expect(p.getByText('0 hands recognized — colored joints show live detection.',{exact:true})).toBeVisible();await p.getByRole('button',{name:'Retry hand tracking',exact:true}).waitFor();await p.evaluate(()=>window.__freezeTracker=false);await p.getByRole('button',{name:'Retry hand tracking',exact:true}).click();await expect(p.getByText('1 hand recognized — colored joints show live detection.',{exact:true})).toBeVisible();
await stage.scrollIntoViewIfNeeded();await stage.screenshot({path:'artifacts/ar-hand-feedback/tracking-points.png'});await p.setViewportSize({width:390,height:844});await nav.scrollIntoViewIfNeeded();await p.screenshot({path:'artifacts/ar-hand-feedback/mobile-mode-controls.png'});
const report={syntheticTracking:true,mirroredPixelAlignment:true,unmirroredPixelAlignment:true,noStaleDots:true,pauseResume:true,retry:true,stalledTrackerRecovery:true,modeButtons:await nav.getByRole('button').count(),stageButtons:await stage.getByRole('button').count(),mobileOverflow:await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors};fs.writeFileSync('artifacts/ar-hand-feedback/report.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));await b.close();

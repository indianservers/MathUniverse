import {chromium} from '@playwright/test';
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-webgl']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
for(const route of ['/workspace/graph','/workspace/geometry','/workspace/3d','/math-lab/3d-graphing']){
 await page.goto('http://127.0.0.1:5175'+route,{timeout:120000});await page.getByRole('button',{name:'Hand Gestures',exact:true}).waitFor({timeout:120000});
 console.log(route,await page.locator('.immersive-buttons').count(),await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,buttons:[...document.querySelectorAll('.immersive-buttons button')].map(b=>({label:b.getAttribute('aria-label'),rect:b.getBoundingClientRect().toJSON()}))})));
 await page.getByRole('button',{name:'AR',exact:true}).click();console.log('AR',await page.locator('.immersive-hud [role=status]').first().innerText());
 await page.getByRole('button',{name:'Exit immersive modes',exact:true}).click();
 await page.screenshot({path:'artifacts/immersive-workspaces/'+route.split('/').at(-1)+'.png'});
}
console.log('errors',errors);await browser.close();

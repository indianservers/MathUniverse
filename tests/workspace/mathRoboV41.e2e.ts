import {test,expect,type Page} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
test.use({video:'off',screenshot:'off',trace:'off',launchOptions:{args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}});
const paths={geometry2d:'/workspace/geometry',graph2d:'/workspace/graph',geometry3d:'/workspace/3d',graph3d:'/math-lab/3d-graphing'};
async function ask(page:Page,phrase:string){await page.getByLabel('What would you like to create or solve?').fill(phrase);await page.getByRole('button',{name:'Run request',exact:true}).click();await expect(page.getByRole('button',{name:'Run request',exact:true})).toBeEnabled({timeout:30000});return page.locator('.robo-answer').innerText();}
for(const [mode,path] of Object.entries(paths))test(`v4.1 real ${mode} context, geometry and refusal`,async({page})=>{
 test.setTimeout(240000);await page.goto(path);await page.getByRole('button',{name:'Ask Math · Offline'}).click();await expect(page.locator('.robo-learning-status')).toContainText('TensorFlow.js ready',{timeout:60000});
 const records:{phrase:string;answer:string}[]=[];const count=()=>page.locator('.offline-assistant').getAttribute('data-robo-scene-count'),hash=()=>page.locator('.offline-assistant').getAttribute('data-robo-scene-hash');
 const run=async(phrase:string,answer:RegExp)=>{const text=await ask(page,phrase);records.push({phrase,answer:text});await mkdir('artifacts/math-robo-v4.1',{recursive:true});await writeFile(`artifacts/math-robo-v4.1/browser-${mode}-progress.json`,JSON.stringify(records,null,2));expect(text,phrase).toMatch(answer);};
 const read=async(phrase:string,answer:RegExp)=>{const before=await hash();await run(phrase,answer);expect(await hash(),phrase).toBe(await page.locator('.offline-assistant').getAttribute('data-robo-before-hash'));void before;};
 await page.waitForTimeout(1000);await run('Delete all objects',/cleared/i);
 if(mode.endsWith('2d')){
  await run('Draw a rectangle 4 by 6.',/created/i);await read('What is its area?',/24/);await read('Where is its center?',/center/i);await run('Mark the center.',/marked/i);await run('Move it 3 units right.',/move/i);await run('Rotate it 30 degrees.',/rotate/i);await read('What is its area now?',/24/);
  await run('Delete all objects',/cleared/i);await run('Draw a line from (0,0) to (6,6).',/created/i);await read('What is its midpoint?',/\[3,3\]/);await run('Mark it.',/marked/i);await run('Draw a perpendicular line through that point.',/constructed|created/i);
  await run('Delete all objects',/cleared/i);await run('Draw two circles radius 5.',/created/i);expect(await count()).toBe('2');await run('Move the second one 10 units right.',/move/i);await read('Are they tangent?',/true|yes/i);await read('Where do they touch?',/5/);
  await run('Delete all objects',/cleared/i);await run('Draw triangle A(0,0), B(6,0), C(3,4).',/created/i);await read('What type of triangle is it?',/isosceles/i);await read('What is the midpoint of AB?',/\[3,0\]/);await run('Draw the median from C.',/constructed|created/i);
  await run('Delete all objects',/cleared/i);await run('Draw a circle.',/created|radius|provide/i);await run('Delete all objects',/cleared/i);await run('Draw two circles radius 5',/created/i);await read('Delete the circle.',/several|select|specify/i);
  await run('Delete all objects',/cleared/i);await read('Draw a line.',/provide|endpoints/i);await run('Draw a line from (0,0) to (6,6)',/created/i);await read('What is the midpoint of that line?',/midpoint/i);const before=Number(await count());await run('Mark its midpoint.',/marked/i);expect(Number(await count())).toBe(before+1);await read('Make it perpendicular.',/reference|provide|need/i);
  await run('Delete all objects',/cleared/i);await run('Draw a triangle.',/created/i);await run('Actually undo that.',/undid/i);await run('Draw a square instead.',/created/i);await run('Make it twice as large.',/scale/i);await read('Move it left.',/how far/i);await run('1 unit',/move/i);await read("What's its area?",/area/i);
 }else{
  await run('Draw a sphere radius 5',/created/i);await read('What is its volume?',/523/);await run('Move it 3 units right and 2 up',/move/i);await run('Rotate it 90 degrees',/rotate/i);await read('What is its volume?',/523/);await run('Duplicate it',/duplicated/i);await run('Make the copy red',/changed/i);await run('Delete the original',/deleted/i);await run('Undo that',/undid/i);await read('Count objects',/2/);
 }
 for(const phrase of ['Maybe delete that circle','What happens if I draw a circle?','Do not delete everything'])await read(phrase,/clarify|unsupported|not available|provide/i);
 await mkdir('artifacts/math-robo-v4.1',{recursive:true});await writeFile(`artifacts/math-robo-v4.1/browser-${mode}.json`,JSON.stringify({mode,passed:true,records},null,2));
});

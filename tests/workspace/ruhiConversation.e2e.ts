import {test,expect,type Page} from '@playwright/test';
test.use({video:'off',screenshot:'off',trace:'off',launchOptions:{args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']}});
const paths={geometry2d:'/workspace/geometry',graph2d:'/workspace/graph',geometry3d:'/workspace/3d',graph3d:'/math-lab/3d-graphing'};
async function ask(page:Page,text:string){await page.getByLabel('What would you like to create or solve?').fill(text);await page.getByRole('button',{name:'Run request',exact:true}).click();await expect(page.getByRole('button',{name:'Run request',exact:true})).toBeEnabled({timeout:30000});return page.locator('.robo-answer').innerText();}
for(const [mode,path] of Object.entries(paths))test(`Ruhi ${mode} real multi-turn continuation`,async({page})=>{
  test.setTimeout(150000);await page.goto(path);await page.getByRole('button',{name:'Ask Math · Offline'}).click();await expect(page.locator('.robo-learning-status')).toContainText('TensorFlow.js ready',{timeout:60000});await page.waitForTimeout(1000);
  await ask(page,'Delete all objects');expect(await ask(page,mode.endsWith('3d')?'Draw a sphere radius 5':'Draw a circle radius 5')).toMatch(/created/i);
  const before=await page.locator('.offline-assistant').getAttribute('data-robo-scene-hash');expect(await ask(page,'Move it right')).toMatch(/how far/i);expect(await page.locator('.offline-assistant').getAttribute('data-robo-scene-hash')).toBe(before);
  expect(await ask(page,'3 units')).toMatch(/move/i);const moved=await page.locator('.offline-assistant').getAttribute('data-robo-scene-hash');expect(moved).not.toBe(before);expect(await page.locator('.offline-assistant').getAttribute('data-robo-scene-count')).toBe('1');
  expect(await ask(page,'Now rotate it')).toMatch(/degrees/i);expect(await ask(page,'30 degrees')).toMatch(/rotate/i);
  expect(await ask(page,mode.endsWith('3d')?'Move it 2 units forward':'Move it 2 units up')).toMatch(/move/i);
  expect(await ask(page,'Reflect it')).toMatch(mode.endsWith('3d')?/which plane/i:/which axis/i);expect(await ask(page,mode.endsWith('3d')?'xy plane':'x-axis')).toMatch(/reflect/i);
  const reflected=JSON.parse(await page.locator('.offline-assistant').getAttribute('data-robo-scene-hash')??'[]');expect(reflected[0].position[mode.endsWith('3d')?2:1]).toBe(-2);
  expect(await ask(page,mode.endsWith('3d')?'Find its volume':'Find its area')).toMatch(mode.endsWith('3d')?/523/:/78/);expect(await ask(page,'why')).toMatch(mode.endsWith('3d')?/πr³/:/πr²/);
  expect(await ask(page,'Move it left')).toMatch(/how far/i);expect(await ask(page,'No, right')).toMatch(/how far/i);expect(await ask(page,'3 units')).toMatch(/move/i);
  const corrected=JSON.parse(await page.locator('.offline-assistant').getAttribute('data-robo-scene-hash')??'[]');expect(corrected[0].position[0]).toBe(6);
  expect(await ask(page,'Move it to point 4')).toMatch(/destination coordinates/i);expect(await ask(page,mode.endsWith('3d')?'1,2,3':'1,2')).toMatch(/move/i);
  const relocated=JSON.parse(await page.locator('.offline-assistant').getAttribute('data-robo-scene-hash')??'[]');expect(relocated[0].position).toEqual(mode.endsWith('3d')?[1,2,3]:[1,2]);
  expect(await ask(page,'Move it left')).toMatch(/how far/i);expect(await ask(page,'forget that')).toMatch(/context cleared/i);expect(await page.locator('.offline-assistant').getAttribute('data-robo-scene-count')).toBe('1');
});

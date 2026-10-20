import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const root='artifacts/upcoming-mockups';
await fs.mkdir(root,{recursive:true});
const index=JSON.parse(await fs.readFile('src/modules/lessons/authored/authoredLessonIndex.generated.json','utf8'));
const lessons=[];
for(const batch of [1,2])lessons.push(...JSON.parse(await fs.readFile(`src/modules/lessons/authored/batches/batch-0${batch}.generated.json`,'utf8')).lessons.filter(l=>l.lessonId>=30001&&l.lessonId<=30040));
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1536,height:1024},reducedMotion:'reduce'});
const errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 for(const lesson of lessons){
  await page.setViewportSize({width:1536,height:1024});
  await page.goto(`http://127.0.0.1:5173/lessons/planned/${lesson.lessonId}`,{waitUntil:'commit',timeout:120000});
  const lab=page.locator(`[data-upcoming-lab="${lesson.lessonId}"]`);
  await lab.waitFor({timeout:180000});
  await expect(lab.locator('h1')).toHaveText(lesson.title);
  await expect(page).toHaveURL(new RegExp(index.lessons.find(l=>l.lessonId===lesson.lessonId).route+'$'));
  await expect(lab.getByRole('alert')).toHaveCount(0);
  const control=lesson.interactive.controls.find(c=>c.min!==c.max);
  const input=lab.getByRole('spinbutton',{name:control.label,exact:true});
  const initial=await input.inputValue();
  await input.fill(String(control.max));
  await expect(lab.getByRole('alert')).toHaveCount(0);
  await input.fill(String(control.max+control.step));
  await expect(lab.getByRole('alert')).toBeVisible();
  await lab.getByRole('button',{name:'Reset',exact:true}).click();
  await expect(input).toHaveValue(initial);
  await expect(lab.getByRole('alert')).toHaveCount(0);
  for(const tab of ['Explain','Examples','Formulas','Know more']){
   await lab.getByRole('tab',{name:tab,exact:true}).click();
   await expect(lab.getByRole('tab',{name:tab,exact:true})).toHaveAttribute('aria-selected','true');
   await expect(lab.getByRole('tabpanel')).not.toBeEmpty();
  }
  const practice=lab.locator('.ul-practice').first();
  await practice.getByRole('textbox',{name:'Your answer'}).fill('deliberately wrong');
  await practice.getByRole('button',{name:'Check',exact:true}).click();
  await expect(practice.getByRole('status')).toContainText('Try again');
  await practice.getByRole('textbox',{name:'Your answer'}).fill(lesson.practice[0].expected);
  await practice.getByRole('button',{name:'Check',exact:true}).click();
  await expect(practice.getByRole('status')).toContainText('Correct!');
  await lab.getByRole('tab',{name:'Interaction + visualization',exact:true}).click();
  await page.screenshot({path:`${root}/${lesson.lessonId}-desktop.png`,animations:'disabled'});
  await page.setViewportSize({width:390,height:844});
  const overflow=await lab.evaluate(e=>e.scrollWidth>e.clientWidth+1);
  expect(overflow,`Lesson ${lesson.lessonId} mobile overflow`).toBe(false);
  await page.screenshot({path:`${root}/${lesson.lessonId}-mobile.png`,animations:'disabled'});
  await lab.locator('.ul-builder').scrollIntoViewIfNeeded();
  await page.screenshot({path:`${root}/${lesson.lessonId}-mobile-tool.png`,animations:'disabled'});
  results.push({id:lesson.lessonId,title:lesson.title,controls:true,validation:true,reset:true,tabs:true,practice:true,mobileOverflow:overflow});
  console.log(`PASS ${lesson.lessonId} ${lesson.title}`);
 }
 expect(errors).toEqual([]);
 await page.setViewportSize({width:1536,height:1024});
 await page.goto('http://127.0.0.1:5173/lessons/planned/30008',{waitUntil:'commit'});
 const canvas=page.locator('.ul-cube-scene canvas');
 await canvas.waitFor();
 const before=await canvas.screenshot();
 const box=await canvas.boundingBox();
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);
 await page.mouse.down();await page.mouse.move(box.x+box.width/2+100,box.y+box.height/2+50,{steps:20});await page.mouse.up();
 const after=await canvas.screenshot();
 expect(before.equals(after),'Three.js cube responds to drag').toBe(false);
 await page.goto('http://127.0.0.1:5173/lessons/upcoming',{waitUntil:'commit'});
 const search=page.getByRole('textbox',{name:'Search',exact:true});
 await search.waitFor();await search.fill('30002');
 await expect(page.getByRole('heading',{name:'Perfect-square digit and factor patterns',exact:true})).toBeVisible();
 await expect(page.locator('img[src="/assets/upcoming-lessons/30007.webp"]')).toBeVisible();
 await search.fill('30028');
 await expect(page.locator('img[src="/assets/upcoming-lessons/30018.webp"]')).toBeVisible();
 await search.fill('30018');
 await expect(page.getByRole('heading',{name:'Repeated doubling and exponential growth',exact:true})).toBeVisible();
 await expect(page.locator('article img')).toHaveCount(0);
 await fs.writeFile(`${root}/verification.json`,JSON.stringify({results,errors,catalogMapping:true,cubeDrag:true},null,2));
 console.log(`Verified ${results.length} lessons, desktop and mobile, and corrected catalog mapping.`);
}finally{await browser.close();}

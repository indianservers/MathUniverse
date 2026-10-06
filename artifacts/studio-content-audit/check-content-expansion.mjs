import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5173/studios/curriculum');
await page.getByRole('heading',{name:'Studio learning paths',exact:true}).waitFor();
const courses=await page.evaluate(async()=>{
 const {masteryCourses}=await import('/src/studios/curriculum/masteryContent.ts');
 const {curriculumStudios,chaptersFor}=await import('/src/studios/curriculum/curriculumCatalog.ts');
 return curriculumStudios.map(s=>({...s,course:masteryCourses[s.id],chapterCount:chaptersFor(s.id).length}));
});
const results=[];
for(const s of courses){
 await page.goto(`http://127.0.0.1:5173/studios/${s.id}/curriculum`);
 await page.getByRole('heading',{name:'Guided lessons and practice',exact:true}).waitFor();
 for(const u of s.course.units){
  await page.getByRole('navigation',{name:'Guided lessons',exact:true}).getByRole('button',{name:u.title,exact:false}).click();
  const article=page.locator('.guided-course article');
  await article.getByRole('heading',{name:u.title,exact:true}).waitFor();
  await article.getByLabel('Challenge answer',{exact:true}).fill(String(u.calculation.answer));
  await article.getByRole('button',{name:'Check',exact:true}).click();
  await article.getByText('Correct — this concept check is solved.',{exact:true}).waitFor();
  await article.getByRole('button',{name:'Explain the flaw, then reveal the correction'}).click();
  if(!await article.getByText(u.explanation,{exact:false}).isVisible())throw Error(`Missing correction ${s.id}/${u.id}`);
 }
 await page.setViewportSize({width:390,height:844});
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2);
 results.push({id:s.id,name:s.name,lessons:s.course.units.length,referenceChapters:s.chapterCount,exercisesPassed:5,mobileOverflow:overflow});
 if(s.id==='probability-statistics')await page.screenshot({path:'artifacts/studio-content-audit/content-statistics-mobile.png',fullPage:true});
 await page.setViewportSize({width:1440,height:1000});
 console.log(s.id,'OK');
}
await fs.writeFile('artifacts/studio-content-audit/content-expansion-browser.json',JSON.stringify({results,errors},null,2));
await browser.close();
if(errors.length||results.some(r=>r.mobileOverflow))process.exitCode=1;

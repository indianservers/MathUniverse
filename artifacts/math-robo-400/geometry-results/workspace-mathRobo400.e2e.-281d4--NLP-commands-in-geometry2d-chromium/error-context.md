# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: workspace\mathRobo400.e2e.ts >> 100 real NLP commands in geometry2d
- Location: tests\workspace\mathRobo400.e2e.ts:46:64

# Error details

```
TimeoutError: page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:9867/workspace/geometry", waiting until "domcontentloaded"

```

# Test source

```ts
  1  | import {test,expect,type Page} from '@playwright/test';
  2  | import {mkdir,writeFile} from 'node:fs/promises';
  3  | type Step={phrase:string;answer:RegExp;delta?:number;reject?:boolean;value?:number[]};
  4  | const paths={geometry2d:'/workspace/geometry',geometry3d:'/workspace/3d',graph2d:'/workspace/graph',graph3d:'/math-lab/3d-graphing'};
  5  | const verbs=['Create','Draw','Make','Add','Sketch','Please draw','Can you create','Build','Show me','I need'];
  6  | const moves=['Move it 3 units right and 2 up','Translate that shape (2,3)','Move it 2 units left','Move that object up 4 units','Move it to (4,0)'];
  7  | function scenarios(mode:keyof typeof paths):Step[][]{
  8  |   return Array.from({length:10},(_,i)=>{
  9  |     const n=i+1;
  10 |     if(mode==='graph2d')return [
  11 |       {phrase:`${['Plot','Graph','Draw a graph of','Show graph of','Please plot'][i%5]} y=x^2-${n*n}`,answer:/Created/i,delta:1},
  12 |       {phrase:['Find its roots','What are the roots?','Find the x intercepts','Calculate its roots','Where does it cross the x-axis?'][i%5],answer:/roots|intercept/i,delta:0},
  13 |       {phrase:['Make it blue','Color that graph red','Change its color to green','Set its color to purple','Recolor it orange'][i%5],answer:/Changed/i,delta:0},
  14 |       {phrase:'Hide that graph',answer:/Hidden/i,delta:0},{phrase:'Show it',answer:/Showing/i,delta:0},
  15 |       {phrase:['Duplicate it','Copy it','Make a copy of it','Duplicate that graph','Please duplicate it'][i%5],answer:/Duplicated/i,delta:1},
  16 |       {phrase:'Make the copy red',answer:/Changed/i,delta:0},{phrase:'Delete the original',answer:/Deleted/i,delta:-1},
  17 |       {phrase:'Undo that',answer:/Undid/i,delta:1},{phrase:'Count objects',answer:/2/,delta:0}];
  18 |     if(mode==='graph3d')return [
  19 |       {phrase:`${['Plot','Graph','Draw a graph of','Please plot','Show graph of'][i%5]} z=x^2+y^2+${n}`,answer:/Created/i,delta:1},
  20 |       {phrase:'Make it blue',answer:/Changed/i,delta:0},{phrase:'Move that surface (2,3,1)',answer:/move/i,delta:0},
  21 |       {phrase:'Rotate it 30 degrees',answer:/rotate/i,delta:0},{phrase:'Hide it',answer:/Hidden/i,delta:0},
  22 |       {phrase:'Show that object',answer:/Showing/i,delta:0},{phrase:'Duplicate it',answer:/Duplicated/i,delta:1},
  23 |       {phrase:'Delete the original',answer:/Deleted/i,delta:-1},{phrase:'Undo that',answer:/Undid/i,delta:1},
  24 |       {phrase:'Count objects',answer:/2/,delta:0}];
  25 |     const d3=mode==='geometry3d';
  26 |     const shape=d3?['sphere','cube','cuboid','cylinder','cone'][i%5]:['triangle','rectangle','circle','square','line'][i%5];
  27 |     const creation=d3?`${verbs[i]} a ${shape} ${shape==='sphere'||shape==='cylinder'||shape==='cone'?`radius ${n} height 6`:`width ${n+2} height 6 depth 4`}`:
  28 |       shape==='line'?`${verbs[i]} a line from (0,0) to (6,8)`:shape==='triangle'?`${verbs[i]} a triangle`:`${verbs[i]} a ${shape} ${shape==='circle'?`radius ${n}`:`${n+2} by 6`}`;
  29 |     const query=d3?'Find its volume':shape==='line'?'What is its length?':shape==='triangle'?'What is its centroid?':'What is its area?';
  30 |     return [{phrase:creation,answer:/Created/i,delta:1},
  31 |       {phrase:shape==='triangle'?'Move that triangle to (4,0)':d3?['Move it up 5 units','Translate that object (2,3,1)','Move it 3 units right','Move it to (4,0,2)','Move that shape 2 units down'][i%5]:moves[i%5],answer:/move/i,delta:0},
  32 |       {phrase:['Make it blue','Change its color to red','Color that shape green','Recolor it purple','Set its color to orange'][i%5],answer:/Changed/i,delta:0},
  33 |       {phrase:i===0&&!d3?'Move that triangle to point 4':'Rotate it 45 degrees',answer:i===0&&!d3?/provide|clarif|point|ambig|coordinate/i:/rotate/i,delta:0,reject:i===0&&!d3},
  34 |       {phrase:query,answer:d3?/Volume/i:shape==='line'?/10/:shape==='triangle'?/centroid/i:/Area/i,delta:0,value:shape==='triangle'?[4,0]:undefined},
  35 |       {phrase:['Duplicate it','Copy it','Make a copy of it','Please duplicate it','Duplicate that object'][i%5],answer:/Duplicated/i,delta:1},
  36 |       {phrase:'Make the copy red',answer:/Changed/i,delta:0},{phrase:'Delete the original',answer:/Deleted/i,delta:-1},
  37 |       {phrase:'Undo that',answer:/Undid/i,delta:1},{phrase:'Count objects',answer:/2/,delta:0}];
  38 |   });
  39 | }
  40 | async function ask(page:Page,phrase:string){
  41 |   await page.getByLabel('What would you like to create or solve?').fill(phrase);
  42 |   await page.getByRole('button',{name:'Run request',exact:true}).click();
  43 |   await expect(page.getByRole('button',{name:'Run request',exact:true})).toBeEnabled({timeout:30000});
  44 |   return (await page.locator('.robo-answer').innerText()).trim();
  45 | }
  46 | for(const mode of Object.keys(paths) as (keyof typeof paths)[])test(`100 real NLP commands in ${mode}`,async({page})=>{
  47 |   test.setTimeout(600000);await mkdir('artifacts/math-robo-400',{recursive:true});
> 48 |   await page.goto(paths[mode],{waitUntil:'domcontentloaded',timeout:60000});await page.getByRole('button',{name:'Ask Math · Offline'}).click();
     |              ^ TimeoutError: page.goto: Timeout 60000ms exceeded.
  49 |   await expect(page.locator('.robo-learning-status')).toContainText('TensorFlow.js ready',{timeout:60000});
  50 |   const records:unknown[]=[];let failures=0;
  51 |   const count=async()=>Number(await page.locator('.offline-assistant').getAttribute('data-robo-scene-count'));
  52 |   for(const [scenario,steps] of scenarios(mode).entries()){
  53 |     await ask(page,'Delete all objects');
  54 |     for(const [index,step] of steps.entries()){
  55 |       const before=await count(),start=Date.now();let answer='',error='';
  56 |       try{answer=await ask(page,step.phrase);const after=await count();if(!step.answer.test(answer))error=`Expected ${step.answer}; received ${answer}`;if(step.delta!==undefined&&after-before!==step.delta)error+=` Object delta ${after-before}, expected ${step.delta}.`;
  57 |         if(step.value){const value=JSON.parse(answer.match(/\[[^\]]+\]/)?.[0]??'null');if(!Array.isArray(value)||step.value.some((n,i)=>Math.abs(n-value[i])>1e-8))error+=' Numeric result differs beyond tolerance.';}
  58 |         if(step.reject){const inspector=page.getByText('Developer inspector',{exact:true});await inspector.click();const status=await page.locator('details').filter({has:inspector}).innerText();if(/Status: success/.test(status))error+=' Ambiguous destination was accepted.';await inspector.click();}
  59 |       }catch(reason){error=String(reason);}
  60 |       if(error)failures++;records.push({number:scenario*10+index+1,scenario:scenario+1,phrase:step.phrase,answer,passed:!error,error,before,after:await count(),milliseconds:Date.now()-start});
  61 |       await writeFile(`artifacts/math-robo-400/${mode}-progress.json`,JSON.stringify({mode,completed:records.length,failed:failures,records},null,2));
  62 |       console.log(`${mode} ${records.length}/100 ${error?'FAIL':'PASS'} ${step.phrase}`);
  63 |     }
  64 |   }
  65 |   await writeFile(`artifacts/math-robo-400/${mode}.json`,JSON.stringify({mode,commands:100,passed:100-failures,failed:failures,records},null,2));
  66 |   expect(failures,`${mode}: inspect artifacts/math-robo-400/${mode}.json`).toBe(0);
  67 |   await page.screenshot({path:`artifacts/math-robo-400/${mode}.png`,timeout:15000}).catch(error=>console.log(`Optional screenshot unavailable: ${error}`));
  68 | });
  69 | 
```
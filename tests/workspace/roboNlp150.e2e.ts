import {test,expect} from '@playwright/test';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {nlp150Corpus} from '../../src/offline-intelligence/nlp150Corpus';
import type {IntelligenceMode} from '../../src/offline-intelligence/languageEngine';
test.use({trace:'off',video:'off'});
test.describe.configure({mode:'parallel'});

for(const [mode,path] of [['graph2d','/workspace/graph'],['graph3d','/math-lab/3d-graphing'],['geometry2d','/workspace/geometry'],['geometry3d','/workspace/3d']] as [IntelligenceMode,string][]) {
  test(`150 NLP commands draw and interact directly in ${mode}`,async({page})=>{
    test.setTimeout(900000);
    page.setDefaultTimeout(30000);
    const errors:string[]=[],report:Array<Record<string,unknown>>=[];
    if(process.env.ROBO_NLP_RESUME==='1') {
      try {
        let saved=JSON.parse(await readFile(`artifacts/offline-intelligence/nlp150/${mode}-progress.json`,'utf8'));
        try {
          const final=JSON.parse(await readFile(`artifacts/offline-intelligence/nlp150/${mode}.json`,'utf8'));
          if(final.passed===150)saved=final.cases;
        } catch { /* No complete previous run. */ }
        if(Array.isArray(saved))report.push(...saved);
      } catch { /* First run for this workspace. */ }
    }
    page.on('pageerror',error=>errors.push(error.message));
    const open=async()=>{
      await page.goto(path);
      await page.getByRole('button',{name:'Ask Math · Offline'}).click();
      await expect(page.locator('.robo-learning-status')).toContainText('TensorFlow.js ready',{timeout:60000});
    };
    const request=async(text:string)=>{
      const before=await page.locator('.robo-answer').count()?await page.locator('.robo-answer').getAttribute('data-response-id'):null;
      await page.getByLabel('What would you like to create or solve?').fill(text);
      await expect(page.getByLabel('What would you like to create or solve?')).toHaveValue(text);
      await page.getByRole('button',{name:'Run request',exact:true}).click();
      await expect.poll(async()=>{
        const value=await page.locator('.robo-answer').getAttribute('data-response-id').catch(()=>null);
        const working=await page.getByRole('button',{name:'Working…',exact:true}).count();
        return value!==null&&value!==before&&!working;
      },{timeout:30000}).toBe(true);
      return (await page.locator('.robo-answer [role="status"]').innerText());
    };
    await open();
    let attempted=0;
    for(const item of nlp150Corpus(mode)) {
      const previous=report.find(row=>row.id===item.id);
      if(previous?.passed)continue;
      if(attempted>0&&attempted%10===0) {
        await page.evaluate(()=>{
          for(const key of Object.keys(localStorage))if(!key.startsWith('math-robo-'))localStorage.removeItem(key);
          sessionStorage.clear();
        });
        await open();
      }
      attempted++;
      const priorErrors=previous?.error?[...(Array.isArray(previous.priorErrors)?previous.priorErrors:[]),previous.error]:[];
      const replace=(value:Record<string,unknown>)=>{
        const index=report.findIndex(row=>row.id===item.id);
        const result={...value,attempts:Number(previous?.attempts??(previous?1:0))+1,priorErrors};
        if(index>=0)report[index]=result;else report.push(result);
      };
      try {
        if(item.seed)expect(await request(item.seed)).toMatch(/^Created /);
        const response=await request(item.request);
        if(item.message)expect(response.toLowerCase()).toContain(item.message.toLowerCase());
        else if(item.kind)expect(response.toLowerCase()).toMatch(new RegExp(`(?:created|added).*${item.kind==='plot'?'graph':item.kind}`));
        await expect(page.locator('.offline-assistant .geo-embedded-graph,.offline-assistant .geo-embedded-solid')).toHaveCount(0);
        if(item.kind) {
          if(mode==='graph2d')expect(await page.locator('input').evaluateAll(nodes=>nodes.map(n=>n.value).filter(v=>v.includes('param(')||v.includes('^2=')||v.includes('sin(')||v.includes('cos(')||/\([\d., -]+\)/.test(v)||v.includes('x')))).not.toHaveLength(0);
          if(mode==='geometry2d')expect(await page.getByTestId('workspace-geometry-board').locator('[data-object-id],[data-point-id]').count()).toBeGreaterThan(0);
          if(mode==='graph3d')expect(await page.getByLabel('Expressions and layers').locator('input').count()).toBeGreaterThan(0);
          if(mode==='geometry3d')await expect(page.locator('.os-measurements')).toBeVisible();
        }
        replace({...item,response,passed:true});
      } catch(error) {replace({...item,passed:false,error:error instanceof Error?error.message:String(error)});}
      if(item.id%25===0) {
        console.log(`${mode}: checked ${item.id}/150, ${report.filter(item=>!item.passed).length} failures`);
        await mkdir('artifacts/offline-intelligence/nlp150',{recursive:true});
        await writeFile(`artifacts/offline-intelligence/nlp150/${mode}-progress.json`,JSON.stringify(report,null,2));
      }
      await mkdir('artifacts/offline-intelligence/nlp150',{recursive:true});
      await writeFile(`artifacts/offline-intelligence/nlp150/${mode}-progress.json`,JSON.stringify(report,null,2));
    }
    await mkdir('artifacts/offline-intelligence/nlp150',{recursive:true});
    await page.screenshot({path:`artifacts/offline-intelligence/nlp150/${mode}.png`});
    report.sort((a,b)=>Number(a.id)-Number(b.id));
    await writeFile(`artifacts/offline-intelligence/nlp150/${mode}-progress.json`,JSON.stringify(report,null,2));
    await writeFile(`artifacts/offline-intelligence/nlp150/${mode}.json`,JSON.stringify({mode,path,total:150,passed:report.filter(item=>item.passed).length,errors,cases:report},null,2));
    expect(report).toHaveLength(150);
    expect(report.filter(item=>!item.passed)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

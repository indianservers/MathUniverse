import {chromium} from '@playwright/test';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';

const base=process.env.GRAPH3D_AUDIT_URL??'http://127.0.0.1:4317';
const directory=path.resolve('reports/graph3d-command-audit');
await mkdir(directory,{recursive:true});
const corpus=JSON.parse(await readFile('src/graph-studio/command-audit/corpus.json','utf8'));
const selected=process.argv.slice(2).map(Number).filter(Number.isFinite);
const hardware=process.env.GRAPH3D_AUDIT_HARDWARE==='1';
const browser=await chromium.launch({headless:true,args:hardware?['--enable-webgl']:['--enable-webgl','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const errors=[];
async function persist(file,value){
  const data=JSON.stringify(value,null,2);
  for(let attempt=0;;attempt++)try{await writeFile(file,data);return;}catch(error){if(attempt>=9)throw error;await new Promise(resolve=>setTimeout(resolve,100*(attempt+1)));}
}
page.on('pageerror',error=>{errors.push(String(error));console.error('Browser error:',String(error));});
let consoleErrors=0;
page.on('console',message=>{if(message.type()==='error'&&consoleErrors++<5)console.error(message.text().slice(0,500));});
async function loadApp(){
  await page.goto(base+'/math-lab/3d-graphing',{waitUntil:'domcontentloaded',timeout:120000});
  await page.locator('#surface-3d-panel canvas').first().waitFor({state:'visible',timeout:120000});
  // Preference in this isolated browser, avoiding 750ms per setup action.
  await page.evaluate(async()=>{const {ruhiMotion}=await import('/src/math-robo/animation/RuhiCinematicMotionEngine.ts');ruhiMotion.enabled=false;});
}
const results=[];
try{
  await loadApp();
  const graphicsRenderer=await page.locator('#surface-3d-panel canvas').first().evaluate(canvas=>{const context=canvas.getContext('webgl2')??canvas.getContext('webgl');const extension=context?.getExtension('WEBGL_debug_renderer_info');return extension?context.getParameter(extension.UNMASKED_RENDERER_WEBGL):'WebGL (renderer name unavailable)';});
  for(const fixture of corpus.filter(c=>!selected.length||selected.includes(c.id))){
    let result;
    try{result=await page.evaluate(async id=>{const {runAuditCase}=await import('/src/graph-studio/command-audit/browserAudit.ts');return runAuditCase(id);},fixture.id);}
    catch(error){
      if(/context was destroyed|workspace did not mount|NETWORK|navigation/i.test(String(error))){
        try{await loadApp();result=await page.evaluate(async id=>{const {runAuditCase}=await import('/src/graph-studio/command-audit/browserAudit.ts');return runAuditCase(id);},fixture.id);result.harnessRecovery=String(error);}
        catch(retryError){result={...fixture,status:'failed',errorCategory:'harness',rootCause:String(retryError)};}
      }else result={...fixture,status:'failed',errorCategory:'harness',rootCause:String(error)};
    }
    if(result.status==='failed'){
      result.screenshot=`${fixture.id}.png`;
      await page.locator('#surface-3d-panel').screenshot({path:path.join(directory,result.screenshot)}).catch(()=>{});
    }
    results.push(result);
    await persist(path.join(directory,selected.length?'targeted.json':'results.json'),{generatedAt:new Date().toISOString(),url:base,browser:`Chromium / ${graphicsRenderer}`,coverage:'Full runSemanticAssistant → real mounted graph3d workspace → Three.js scene inspection. Frustum/finite-mesh assertions do not establish pixel-perfect visual correctness.',errors,results});
    console.log(`${fixture.id}: ${result.status} ${result.rootCause??''}`);
  }
  await page.screenshot({path:path.join(directory,'final-workspace.png')});
}finally{await browser.close();}
console.log(JSON.stringify(results.reduce((a,r)=>(a[r.status]=(a[r.status]??0)+1,a),{})));
if(results.some(r=>r.status==='failed'))process.exitCode=1;


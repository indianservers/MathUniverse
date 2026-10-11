import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { PerspectiveCamera, Vector3 } from 'three';
import { build } from 'esbuild';

const bundled=await build({stdin:{contents:"export {buildInvestigation,initialInvestigation,investigationFrame} from './src/modules/lessons/three/lesson3DModels'; export {investigation3DFor} from './src/modules/lessons/three/lesson3DRegistry';",resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'esm',write:false});
const {buildInvestigation,initialInvestigation,investigationFrame,investigation3DFor}=await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);

const browser=await chromium.launch();
try{
  const page=await browser.newPage({viewport:{width:1365,height:900}});
  const catalog=JSON.parse(await fs.readFile('tmp/lesson-review-catalog.json','utf8'));
  const results=[];
  for(const id of [191,422]){
    const lesson=catalog.find(l=>l.id===id);
    await page.goto(`http://127.0.0.1:5176${lesson.route}`,{waitUntil:'commit'});
    const entry=page.locator(`[data-lesson-3d-id="${id}"]`);
    await entry.getByRole('button',{name:'Open 3D investigation',exact:true}).click({timeout:60000});
    const canvas=entry.locator('canvas');await canvas.waitFor();await canvas.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    const rect=await canvas.boundingBox(),camera=new PerspectiveCamera(45,rect.width/rect.height,0.05,200);
    const config=investigation3DFor(id),state=initialInvestigation(config),frame=investigationFrame(buildInvestigation(config,state),state.surface);
    const target=new Vector3(frame.center[0],frame.center[2],-frame.center[1]),vertical=Math.PI/4,horizontal=2*Math.atan(Math.tan(vertical/2)*rect.width/rect.height),distance=frame.radius/Math.sin(Math.min(vertical,horizontal)/2)*1.12;
    camera.position.copy(target.clone().addScaledVector(new Vector3(1,0.8,1).normalize(),distance));camera.lookAt(target);camera.updateMatrixWorld();
    const point=(id===191?new Vector3(2,1,-1):new Vector3(1,0.6,-1)).project(camera);
    const x=rect.x+(point.x+1)*rect.width/2,y=rect.y+(1-point.y)*rect.height/2;
    const field=entry.getByRole('spinbutton',{name:id===191?'Vector u x':'Surface contact point x',exact:true}),before=await field.inputValue();
    await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+45,y+20,{steps:10});await page.mouse.up();
    const after=await field.inputValue();assert.notEqual(after,before,`Lesson ${id} point drag changes coordinates`);
    await entry.locator('.l3d-canvas').screenshot({path:`artifacts/lesson-3d-investigations/${id}-drag.png`});results.push({id,before,after,passed:true});
  }
  await fs.writeFile('artifacts/lesson-3d-investigations/drag-validation.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results));
}finally{await browser.close();}

import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out="test-evidence/lesson-ui-upgrade",refs="D:/Math App Screenshots for UI Update/Updated UI",baseUrl=process.env.LESSON_BASE_URL??"http://127.0.0.1:2245",route="/lessons/trigonometry/262-cosine-graph";
await mkdir(out,{recursive:true});
const reference=(await readdir(refs)).find((name)=>name.startsWith("0319-"));
if(reference)await copyFile(path.join(refs,reference),path.join(out,"0319-reference.png"));
const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1003,height:1568},deviceScaleFactor:1}),messages=[];
page.on("console",(message)=>{if(["error","warning"].includes(message.type()))messages.push(`${message.type()}: ${message.text()}`);});
await page.goto(`${baseUrl}${route}`,{waitUntil:"networkidle",timeout:60_000});
const surface=page.locator("[data-dedicated-lesson='262']");await surface.waitFor();
const state=async()=>surface.evaluate((element)=>({theta:Number(element.dataset.theta),currentX:Number(element.dataset.currentX),currentY:Number(element.dataset.currentY),amplitude:Number(element.dataset.amplitude),period:Number(element.dataset.period),phaseShift:Number(element.dataset.phaseShift),verticalShift:Number(element.dataset.verticalShift),practiceChoice:element.dataset.practiceChoice,practiceResult:element.dataset.practiceResult}));
const checks={initial:await state()};
if(Math.abs(checks.initial.theta-Math.PI/3)>1e-5||Math.abs(checks.initial.currentX-.5)>1e-5||Math.abs(checks.initial.currentY-.5)>1e-5||Math.abs(checks.initial.period-Math.PI*2)>1e-5)throw new Error(`Initial cosine model failed: ${JSON.stringify(checks.initial)}`);
async function drag(testId,dx,dy){const locator=page.getByTestId(testId),box=await locator.boundingBox();if(!box)throw new Error(`${testId} has no box`);await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+dx,box.y+box.height/2+dy,{steps:8});await page.mouse.up();}
await drag("cosine-unit-circle-handle",47,82);checks.circleDrag=await state();
if(Math.min(Math.abs(checks.circleDrag.theta),Math.abs(checks.circleDrag.theta-Math.PI*2))>.08||Math.abs(checks.circleDrag.currentX-1)>.01||Math.abs(checks.circleDrag.currentY-1)>.01)throw new Error(`Circle projection drag failed: ${JSON.stringify(checks.circleDrag)}`);
const beforeGraph=await state();await drag("cosine-main-graph-handle",-85,0);checks.graphDrag=await state();
if(Math.abs(checks.graphDrag.theta-beforeGraph.theta)<.4||Math.abs(checks.graphDrag.currentY-Math.cos(checks.graphDrag.theta))>1e-5)throw new Error(`Cosine graph drag failed: ${JSON.stringify({beforeGraph,after:checks.graphDrag})}`);

await page.getByRole("button",{name:"Increase Amplitude (A)"}).click();checks.increment=await state();if(Math.abs(checks.increment.amplitude-1.1)>.001)throw new Error("Parameter stepper failed");
await page.getByRole("slider",{name:"Amplitude (A)"}).fill("2");await page.getByRole("slider",{name:"Period factor (B)"}).fill("2");
const phase=page.getByRole("slider",{name:"Phase shift (C)"});await phase.focus();for(let index=0;index<4;index+=1)await phase.press("ArrowRight");
await page.getByRole("slider",{name:"Vertical shift (D)"}).fill("1");checks.transformed=await state();
if(checks.transformed.amplitude!==2||Math.abs(checks.transformed.period-Math.PI)>1e-5||Math.abs(checks.transformed.phaseShift-Math.PI/3)>.01||checks.transformed.verticalShift!==1)throw new Error(`Cosine transforms failed: ${JSON.stringify(checks.transformed)}`);

await page.getByLabel("A. y = cos x − 1").check();await page.getByRole("button",{name:"Check",exact:true}).click();checks.incorrect=await state();if(checks.incorrect.practiceResult!=="incorrect")throw new Error("Incorrect graph choice failed");
await page.getByLabel("C. y = 2 cos(x + π/2)").check();await page.getByRole("button",{name:"Check",exact:true}).click();checks.correct=await state();if(checks.correct.practiceResult!=="correct"||checks.correct.practiceChoice!=="c")throw new Error("Correct graph choice failed");
await page.getByRole("button",{name:"Reset",exact:true}).click();checks.reset=await state();if(Math.abs(checks.reset.theta-Math.PI/3)>1e-5||checks.reset.amplitude!==1||checks.reset.practiceResult!=="correct")throw new Error("Reset failed");
const metrics=await page.evaluate(()=>{const bounds=(selector)=>globalThis.document.querySelector(selector)?.getBoundingClientRect(),surfaceBounds=bounds("[data-dedicated-lesson='262']"),workspace=bounds(".target-cosine-workspace"),controls=bounds(".target-cosine-controls"),practice=bounds(".target-cosine-practice"),nav=bounds(".target-cosine-nav");return{viewport:{width:globalThis.innerWidth,height:globalThis.innerHeight},document:{width:globalThis.document.documentElement.scrollWidth,height:globalThis.document.documentElement.scrollHeight},horizontalOverflow:globalThis.document.documentElement.scrollWidth>globalThis.innerWidth,surfaceTop:surfaceBounds?.top??null,surfaceBottom:surfaceBounds?.bottom??null,workspaceTop:workspace?.top??null,workspaceBottom:workspace?.bottom??null,controlsTop:controls?.top??null,controlsBottom:controls?.bottom??null,practiceTop:practice?.top??null,practiceBottom:practice?.bottom??null,navTop:nav?.top??null,navBottom:nav?.bottom??null};});
await page.screenshot({path:path.join(out,"0319-desktop.png"),fullPage:false});
const validation={mockup:"0319",lessonId:262,route,reference:reference??null,objectModel:await surface.getAttribute("data-object-model"),checks,metrics,consoleMessages:messages,passed:!metrics.horizontalOverflow&&messages.length===0};await writeFile(path.join(out,"0319-dedicated-target-validation.json"),JSON.stringify(validation,null,2));console.log(JSON.stringify(validation,null,2));await browser.close();

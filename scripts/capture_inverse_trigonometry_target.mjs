import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root=process.cwd(),out=path.join(root,"test-evidence","lesson-ui-upgrade"),reference="D:\\Math App Screenshots for UI Update\\Updated UI\\0011-interactive-foundational-advanced-scientific-calculator-inverse-trigonometry-redesigned.png",url=process.env.LESSON_URL??"http://localhost:2245/lessons/core-workspaces/11-inverse-trigonometry";
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1068,height:1472}}),consoleMessages=[];
page.on("console",m=>{if(["error","warning"].includes(m.type()))consoleMessages.push(`${m.type()}: ${m.text()}`)});
await page.goto(url,{waitUntil:"domcontentloaded"});const node=page.getByTestId("calculator-mockup-0011");await node.waitFor();
const state=()=>node.evaluate(e=>Object.fromEntries(["data-ratio","data-mode","data-angle","data-degrees","data-practice-ratio","data-feedback","data-view"].map(n=>[n.replace("data-",""),e.getAttribute(n)])));
const checks={initial:await state()};
await page.getByLabel("Inverse sine ratio drag control").fill("0.75");checks.ratio=await state();
await page.getByRole("button",{name:"RAD",exact:true}).click();checks.radians=await state();
await page.getByRole("button",{name:/Reset/}).click();
const circle=page.getByLabel("Draggable inverse sine unit circle"),box=await circle.boundingBox();
if(box){const cx=box.x+box.width/2,cy=box.y+box.height/2;await page.mouse.move(cx+box.width*.303,cy-box.height*.175);await page.mouse.down();await page.mouse.move(cx+box.width*.303,cy+box.height*.175,{steps:6});await page.mouse.up();}
checks.rayDrag=await state();
await page.getByRole("button",{name:/Reset/}).click();checks.reset=await state();
await page.getByRole("button",{name:"Examples",exact:true}).click();checks.view=await state();
await page.getByLabel("Inverse sine practice ratio").fill("0.5");checks.practice=await state();
await page.getByLabel("Inverse trigonometry practice answer").fill("45");await page.locator(".inverse-practice aside button").click();checks.wrong=await state();
await page.getByLabel("Inverse trigonometry practice answer").fill("30");await page.locator(".inverse-practice aside button").click();checks.correct=await state();
await page.reload({waitUntil:"domcontentloaded"});await node.waitFor();
const metrics=await page.evaluate(()=>{const region=s=>{const r=document.querySelector(s)?.getBoundingClientRect();return r?{top:r.top,bottom:r.bottom,height:r.height,left:r.left,right:r.right,width:r.width}:null};return{viewport:{width:innerWidth,height:innerHeight},document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},horizontalOverflow:document.documentElement.scrollWidth>innerWidth,surface:region(".target-inverse-page"),regions:{header:region(".inverse-header"),tabs:region(".inverse-tabs"),lab:region(".inverse-lab"),models:region(".inverse-models"),result:region(".inverse-result"),range:region(".inverse-range"),practice:region(".inverse-practice"),neighbors:region(".inverse-neighbors"),footer:region(".inverse-footer")}}});
const passed=checks.initial.ratio==="0.5"&&checks.initial.angle==="30"&&checks.ratio.ratio==="0.75"&&checks.radians.mode==="RAD"&&Number(checks.rayDrag.ratio)<0&&checks.reset.angle==="30"&&checks.view.view==="2"&&checks.practice["practice-ratio"]==="0.5"&&checks.wrong.feedback==="incorrect"&&checks.correct.feedback==="correct"&&!metrics.horizontalOverflow&&consoleMessages.length===0;
await page.screenshot({path:path.join(out,"0011-desktop.png")});await copyFile(reference,path.join(out,"0011-reference.png"));const report={mockup:"0011",lessonId:11,route:"/lessons/core-workspaces/11-inverse-trigonometry",objectModel:"draggable-ratio-principal-angle-unit-circle-triangle-range-verification-practice-model",checks,metrics,consoleMessages,passed};await writeFile(path.join(out,"0011-dedicated-target-validation.json"),`${JSON.stringify(report,null,2)}\n`);console.log(JSON.stringify(report,null,2));await browser.close();process.exit(passed?0:1);

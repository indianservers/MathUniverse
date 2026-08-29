/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root=process.cwd(),evidence=path.join(root,"test-evidence","lesson-ui-upgrade"),reference="D:\\Math App Screenshots for UI Update\\Updated UI\\0351-interactive-intermediate-advanced-cas-workspace-complex-calculations-redesigned.png",url=process.env.LESSON_URL??"http://127.0.0.1:2255/lessons/symbolic-mathematics/445-complex-calculations";
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1023,height:1537}}),consoleMessages=[];
page.on("console",message=>{if(["error","warning"].includes(message.type()))consoleMessages.push(`${message.type()}: ${message.text()}`)});
await page.goto(url,{waitUntil:"domcontentloaded",timeout:180000});
const lesson=page.getByTestId("symbolic-cas-mockup-0351");await lesson.waitFor({timeout:600000});
const state=()=>lesson.evaluate(node=>Object.fromEntries(["z","w","result","operation","feedback","actions"].map(key=>[key,node.getAttribute(`data-${key}`)])));
const checks={initial:await state()};
await lesson.getByLabel("Real part a").fill("1");await lesson.getByLabel("Imaginary part b").fill("-2");await lesson.getByLabel("Real part c").fill("3");await lesson.getByLabel("Imaginary part d").fill("4");checks.multiplied=await state();
await lesson.getByLabel("Show grid").check();checks.gridVisible=await lesson.locator('svg[aria-label*="Argand"] g[stroke="#e7edf5"]').isVisible();
await lesson.getByLabel("Complex operation").selectOption("add");checks.added=await state();
await lesson.getByLabel("Complex operation").selectOption("divide");checks.divided=await state();
await lesson.locator('[data-lesson-control="complex-clear"]').click();checks.cleared=await state();
await lesson.getByLabel("Practice real answer").fill("0");await lesson.getByLabel("Practice imaginary answer").fill("5");await lesson.locator('[data-lesson-control="complex-check"]').click();checks.rejected=await state();
await lesson.getByLabel("Practice real answer").fill("1");await lesson.locator('[data-lesson-control="complex-check"]').click();checks.accepted=await state();
await lesson.locator('[data-lesson-control="complex-hint"]').click();checks.hintVisible=await lesson.getByText(/Use \(a\+bi\)/).isVisible();
await page.getByTitle("Reset lesson progress").dispatchEvent("click");await page.waitForFunction(()=>document.querySelector('[data-testid="symbolic-cas-mockup-0351"]')?.getAttribute("data-actions")==="0");checks.reset=await state();
const navigation={previousHref:await lesson.getByRole("link",{name:/Previous/}).getAttribute("href"),nextHref:await lesson.getByRole("link",{name:/Next/}).getAttribute("href")};
await page.evaluate(()=>{document.querySelectorAll("*").forEach(element=>{element.scrollLeft=0;element.scrollTop=0});scrollTo(0,0)});await page.waitForTimeout(100);
const metrics=await page.evaluate(()=>{const rect=selector=>{const element=document.querySelector(selector);if(!element)return null;const box=element.getBoundingClientRect();return Object.fromEntries(["top","left","width","height","bottom"].map(key=>[key,Math.round(box[key])]))};return{document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},overflow:document.documentElement.scrollWidth>innerWidth,sidebar:rect('[data-testid="desktop-sidebar"]'),header:rect(".lesson-shell-header"),tabs:rect('.lesson-page-shell>nav[role="tablist"]'),workspace:rect(".cc445-workspace"),flow:rect(".cc445-flow"),learning:rect(".cc445-learning"),practice:rect(".cc445-practice"),adjacent:rect(".cc445-nav"),footer:rect('footer[aria-label="Site footer"]')}});
const passed=checks.initial.z==="2,3"&&checks.initial.w==="-1,4"&&checks.initial.result==="-14,5"&&checks.multiplied.result==="11,-2"&&checks.gridVisible&&checks.added.result==="4,2"&&checks.divided.operation==="divide"&&checks.cleared.z==="0,0"&&checks.cleared.w==="0,0"&&checks.rejected.feedback==="incorrect"&&checks.accepted.feedback==="correct"&&checks.hintVisible&&checks.reset.z==="2,3"&&checks.reset.result==="-14,5"&&checks.reset.actions==="0"&&navigation.previousHref==="/lessons/symbolic-mathematics/444-matrix-operations"&&navigation.nextHref==="/lessons/symbolic-mathematics/446-assumptions"&&metrics.document.width===1023&&Math.abs(metrics.document.height-1537)<=3&&!metrics.overflow&&metrics.sidebar?.width===208&&consoleMessages.length===0;
const report={mockup:"0351",lessonId:445,checks,navigation,metrics,consoleMessages,passed};
await page.screenshot({path:path.join(evidence,"0351-desktop.png"),fullPage:true});await copyFile(reference,path.join(evidence,"0351-reference.png"));await writeFile(path.join(evidence,"0351-dedicated-target-validation.json"),`${JSON.stringify(report,null,2)}\n`);await browser.close();console.log(JSON.stringify(report,null,2));if(!passed)process.exitCode=1;

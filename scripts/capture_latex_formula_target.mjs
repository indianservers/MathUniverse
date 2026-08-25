import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root=process.cwd(),out=path.join(root,"test-evidence","lesson-ui-upgrade");
const reference="D:\\Math App Screenshots for UI Update\\Updated UI\\0038-interactive-foundational-advanced-algebra-and-dynamic-variables-latex-formula-display-redesigned.png";
const url=process.env.LESSON_URL??"http://localhost:2245/lessons/core-workspaces/38-latex-formula-display";
const browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1217,height:1292}}),consoleMessages=[];
page.on("console",message=>{if(["error","warning"].includes(message.type()))consoleMessages.push(`${message.type()}: ${message.text()}`)});
await page.goto(url,{waitUntil:"domcontentloaded",timeout:180000});
const node=page.getByTestId("algebra-mockup-0038");await node.waitFor({timeout:180000});
const state=()=>node.evaluate(element=>Object.fromEntries(["data-source","data-exponent","data-valid","data-balanced","data-exponent-detected","data-plus-spaced","data-workspace","data-library-expanded","data-actions"].map(name=>[name.replace("data-",""),element.getAttribute(name)])));
const checks={initial:await state()};
await page.getByLabel("Exponent drag control").fill("5");checks.slider=await state();
await page.getByLabel("Exponent numeric value").fill("10");checks.numeric=await state();
await page.getByLabel("LaTeX source").fill("x^{10");checks.invalid=await state();checks.invalidCopy=await page.locator(".formula-error").textContent();
await page.getByLabel("LaTeX source").fill("\\frac{1}{2}");checks.fraction=await state();
await page.getByLabel("LaTeX source").fill("");await page.locator(".library-card article").filter({hasText:"Square root"}).getByRole("button",{name:"Insert"}).click();checks.sqrtInsert=await state();
await page.getByLabel("LaTeX source").fill("");await page.locator(".library-card article").filter({hasText:"Integral"}).getByRole("button",{name:"Insert"}).click();checks.integralInsert=await state();
await page.getByRole("button",{name:/View all structures/}).click();checks.library=await state();
await page.getByRole("button",{name:/Copy LaTeX/}).click();await page.waitForTimeout(100);checks.copy=await state();
await node.getByRole("button",{name:"Workspace"}).click();checks.workspace=await state();
await node.getByRole("button",{name:/Share/}).click();await page.waitForTimeout(100);checks.share=await state();
await node.getByRole("button",{name:"Reset"}).click();checks.reset=await state();
const metrics=await page.evaluate(()=>{const region=selector=>{const rect=document.querySelector(selector)?.getBoundingClientRect();return rect?{top:rect.top,bottom:rect.bottom,height:rect.height,left:rect.left,right:rect.right,width:rect.width}:null};return{viewport:{width:innerWidth,height:innerHeight},document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight},horizontalOverflow:document.documentElement.scrollWidth>innerWidth,surface:region(".latex-page"),regions:{shell:region(".latex-shell"),header:region(".latex-header"),layout:region(".latex-layout"),source:region(".source-card"),render:region(".render-card"),side:region(".latex-side"),grouping:region(".grouping-card"),checklist:region(".checklist-card"),library:region(".library-card"),navigation:region(".latex-navigation"),footer:region(".latex-footer")}}});
const passed=checks.initial.source==="x^{2}+3x+2"&&checks.initial.exponent==="2"&&checks.initial.valid==="true"&&checks.initial.balanced==="true"&&checks.slider.source==="x^{5}+3x+2"&&checks.slider.exponent==="5"&&checks.numeric.source==="x^{10}+3x+2"&&checks.numeric.exponent==="10"&&checks.invalid.valid==="false"&&checks.invalid.balanced==="false"&&checks.invalidCopy?.includes("Syntax needs attention")&&checks.fraction.source==="\\frac{1}{2}"&&checks.fraction.valid==="true"&&checks.sqrtInsert.source==="\\sqrt{x}"&&checks.sqrtInsert.valid==="true"&&checks.integralInsert.source==="\\int_{a}^{b} f(x)\\,dx"&&checks.integralInsert.valid==="true"&&checks.library["library-expanded"]==="true"&&Number(checks.copy.actions)>=8&&checks.workspace.workspace==="true"&&Number(checks.share.actions)>=10&&checks.reset.source==="x^{2}+3x+2"&&checks.reset.exponent==="2"&&checks.reset.workspace==="false"&&!metrics.horizontalOverflow&&consoleMessages.length===0;
await page.screenshot({path:path.join(out,"0038-desktop.png")});await copyFile(reference,path.join(out,"0038-reference.png"));
const report={mockup:"0038",lessonId:38,route:"/lessons/core-workspaces/38-latex-formula-display",objectModel:"editable-katex-source-exponent-group-slider-validation-comparison-library-insertion-model",checks,metrics,consoleMessages,passed};await writeFile(path.join(out,"0038-dedicated-target-validation.json"),`${JSON.stringify(report,null,2)}\n`);console.log(JSON.stringify(report,null,2));await browser.close();process.exit(passed?0:1);

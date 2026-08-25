import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0037-interactive-foundational-advanced-algebra-and-dynamic-variables-dynamic-text-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/core-workspaces/37-dynamic-text";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1217, height: 1292 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0037");
await node.waitFor({ timeout: 180000 });
const state = () => node.evaluate((element) => Object.fromEntries(["data-template","data-x","data-y","data-z","data-rendered","data-placeholders","data-tab","data-workspace","data-extra-variable","data-actions"].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };
await page.getByLabel("Linked x drag control").fill("5");
checks.slider = await state();
checks.sliderPreview = await page.locator(".rendered-text").textContent();
await page.getByLabel("Linked x numeric value").fill("-3");
checks.negative = await state();
await page.getByLabel("Dynamic text template").fill("x={x}; y={y}; z={z}");
checks.customTemplate = await state();
checks.customPreview = await page.locator(".rendered-text").textContent();
await page.getByRole("button", { name: "Add variable" }).click();
checks.addVariable = await state();
await page.getByRole("button", { name: /x \+ y/ }).click();
checks.insertZ = await state();
await page.getByRole("button", { name: /Clear/ }).click();
checks.clear = await state();
await page.locator(".variables-card button").filter({ hasText: "Input value" }).click();
await page.locator(".variables-card button").filter({ hasText: "Output" }).click();
checks.rebuilt = await state();
await page.locator(".dynamic-tabs button").nth(3).click();
checks.tab = await state();
await node.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await state();
await node.getByRole("button", { name: /Share/ }).click();
await page.waitForTimeout(100);
checks.share = await state();
await node.getByRole("button", { name: "Reset" }).click();
checks.reset = await state();
const metrics = await page.evaluate(() => {
  const region = (selector) => { const rect = document.querySelector(selector)?.getBoundingClientRect(); return rect ? { top:rect.top,bottom:rect.bottom,height:rect.height,left:rect.left,right:rect.right,width:rect.width } : null; };
  return { viewport:{width:innerWidth,height:innerHeight}, document:{width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}, horizontalOverflow:document.documentElement.scrollWidth>innerWidth, surface:region(".dynamic-text-page"), regions:{header:region(".dynamic-header"),tabs:region(".dynamic-tabs"),layout:region(".dynamic-layout"),template:region(".template-column"),preview:region(".preview-column"),values:region(".value-column"),editor:region(".template-editor"),live:region(".live-preview"),another:region(".another-preview"),navigation:region(".dynamic-navigation"),footer:region(".dynamic-footer")} };
});
const passed = checks.initial.x==="2"&&checks.initial.y==="7"&&checks.initial.rendered==="When x = 2, the output 2x + 3 is 7."&&checks.initial.placeholders==="{x},{y}"&&
  checks.slider.x==="5"&&checks.slider.y==="13"&&checks.sliderPreview?.includes("When x = 5")&&checks.sliderPreview?.includes("is 13")&&
  checks.negative.x==="-3"&&checks.negative.y==="-3"&&checks.customTemplate.z==="-6"&&checks.customTemplate.placeholders==="{x},{y},{z}"&&checks.customPreview==="x=-3; y=-3; z=-6"&&
  checks.addVariable["extra-variable"]==="true"&&checks.insertZ.template?.endsWith("{z}")&&checks.clear.template===""&&checks.clear.placeholders===""&&checks.rebuilt.template==="{x}{y}"&&
  checks.tab.tab==="3"&&checks.workspace.workspace==="true"&&Number(checks.share.actions)>=11&&checks.reset.template==="When x = {x}, the output 2x + 3 is {y}."&&checks.reset.x==="2"&&checks.reset.tab==="0"&&checks.reset.workspace==="false"&&!metrics.horizontalOverflow&&consoleMessages.length===0;
await page.screenshot({ path:path.join(out,"0037-desktop.png") });
await copyFile(reference,path.join(out,"0037-reference.png"));
const report={mockup:"0037",lessonId:37,route:"/lessons/core-workspaces/37-dynamic-text",objectModel:"editable-placeholder-template-linked-affine-variable-live-preview-comparison-state-model",checks,metrics,consoleMessages,passed};
await writeFile(path.join(out,"0037-dedicated-target-validation.json"),`${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify(report,null,2));
await browser.close();
process.exit(passed?0:1);

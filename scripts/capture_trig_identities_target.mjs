import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade";
const refs = "D:/Math App Screenshots for UI Update/Updated UI";
const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const route = "/lessons/trigonometry/266-trig-identities";
await mkdir(out, { recursive: true });
const reference = (await readdir(refs)).find((name) => name.startsWith("0323-"));
if (reference) await copyFile(path.join(refs, reference), path.join(out, "0323-reference.png"));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1023, height: 1537 }, deviceScaleFactor: 1 });
const messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
const surface = page.locator("[data-dedicated-lesson='266']");
await surface.waitFor();
const state = async () => surface.evaluate((element) => ({
  angle: Number(element.dataset.angle),
  sin: Number(element.dataset.sin),
  cos: Number(element.dataset.cos),
  lhs: element.dataset.lhs === "undefined" ? null : Number(element.dataset.lhs),
  rhs: element.dataset.rhs === "undefined" ? null : Number(element.dataset.rhs),
  difference: element.dataset.difference === "undefined" ? null : Number(element.dataset.difference),
  defined: element.dataset.defined === "true",
  stage: element.dataset.stage,
  autoVerify: element.dataset.autoVerify === "true",
  practiceResult: element.dataset.practiceResult,
  stepsShown: element.dataset.stepsShown === "true",
  openChallenge: element.dataset.openChallenge,
}));
const checks = { initial: await state() };
if (Math.abs(checks.initial.angle - 60) > 1e-5 || Math.abs(checks.initial.sin - Math.sqrt(3) / 2) > 1e-5 || Math.abs(checks.initial.cos - .5) > 1e-5 || Math.abs(checks.initial.lhs - Math.sqrt(3)) > 1e-5 || Math.abs(checks.initial.rhs - Math.sqrt(3)) > 1e-5 || checks.initial.difference !== 0) throw new Error(`Initial identity model failed: ${JSON.stringify(checks.initial)}`);

async function drag(testId, dx, dy) {
  const locator = page.getByTestId(testId), box = await locator.boundingBox();
  if (!box) throw new Error(`${testId} has no box`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + dx, box.y + box.height / 2 + dy, { steps: 8 });
  await page.mouse.up();
}
await drag("identity-circle-handle", 18, 13);
checks.circleDrag = await state();
if (Math.abs(checks.circleDrag.angle - checks.initial.angle) < 5 || Math.abs(checks.circleDrag.sin - Math.sin(checks.circleDrag.angle * Math.PI / 180)) > 1e-5 || Math.abs(checks.circleDrag.cos - Math.cos(checks.circleDrag.angle * Math.PI / 180)) > 1e-5 || Math.abs(checks.circleDrag.lhs - checks.circleDrag.rhs) > 1e-8) throw new Error(`Identity circle drag failed: ${JSON.stringify(checks.circleDrag)}`);
await page.getByRole("slider", { name: "Identity angle", exact: true }).fill("45");
checks.fortyFive = await state();
if (Math.abs(checks.fortyFive.lhs - 1) > 1e-5 || Math.abs(checks.fortyFive.rhs - 1) > 1e-5 || !checks.fortyFive.defined) throw new Error("45-degree identity failed");
await page.getByRole("slider", { name: "Identity angle", exact: true }).fill("90");
checks.undefined90 = await state();
if (checks.undefined90.defined || checks.undefined90.lhs !== null || checks.undefined90.rhs !== null || checks.undefined90.difference !== null) throw new Error("Identity domain guard failed at 90 degrees");
await page.getByRole("slider", { name: "Identity angle", exact: true }).fill("60");
await page.getByRole("checkbox", { name: "Automatic verification", exact: true }).uncheck();
checks.autoOff = await state();
if (checks.autoOff.autoVerify) throw new Error("Automatic verification toggle failed");
await page.getByRole("checkbox", { name: "Automatic verification", exact: true }).check();

await page.getByRole("button", { name: /Explain/ }).first().click();
checks.explainStage = await state();
if (checks.explainStage.stage !== "explain") throw new Error("Explain stage failed");
await page.getByRole("button", { name: /Explore & Verify/ }).first().click();

await page.getByLabel("Identity practice answer").fill("tan θ");
await page.getByRole("button", { name: "Check My Answer", exact: true }).click();
checks.practiceWrong = await state();
if (checks.practiceWrong.practiceResult !== "incorrect") throw new Error("Incorrect practice path failed");
await page.getByLabel("Identity practice answer").fill("cosec θ");
await page.getByRole("button", { name: "Check My Answer", exact: true }).click();
checks.practiceCorrect = await state();
if (checks.practiceCorrect.practiceResult !== "correct") throw new Error("Equivalent cosecant answer failed");
await page.getByRole("button", { name: /Show Step-by-Step/, exact: false }).click();
checks.steps = await state();
if (!checks.steps.stepsShown) throw new Error("Step-by-step proof failed");
await page.getByRole("button", { name: /2\. .*sec²θ/, exact: false }).click();
checks.challenge2 = await state();
if (checks.challenge2.openChallenge !== "2") throw new Error("Second challenge accordion failed");
await page.getByRole("button", { name: /3\. .*Show that/, exact: false }).click();
checks.challenge3 = await state();
if (checks.challenge3.openChallenge !== "3") throw new Error("Third challenge accordion failed");
await page.locator(".target-identities-header").getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
if (Math.abs(checks.reset.angle - 60) > 1e-5 || checks.reset.stage !== "explore" || !checks.reset.autoVerify || checks.reset.practiceResult !== "idle" || checks.reset.stepsShown || checks.reset.openChallenge !== "none") throw new Error("Lesson reset failed");
await page.evaluate(() => {
  globalThis.scrollTo(0, 0);
  globalThis.document.querySelectorAll("*").forEach((element) => {
    if (element.scrollTop) element.scrollTop = 0;
    if (element.scrollLeft) element.scrollLeft = 0;
  });
});
await page.waitForTimeout(250);

const metrics = await page.evaluate(() => {
  const bounds = (selector) => globalThis.document.querySelector(selector)?.getBoundingClientRect();
  const surfaceBounds = bounds("[data-dedicated-lesson='266']"), header = bounds(".target-identities-header"), tabs = bounds(".target-identities-tabs"), lab = bounds(".target-identities-lab"), notice = bounds(".target-identities-notice"), learning = bounds(".target-identities-learning"), nav = bounds(".target-identities-nav"), siteFooter = bounds("footer[aria-label='Site footer']"), sidebarProgress = bounds("[data-testid='desktop-sidebar-progress']");
  return { viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight }, document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight }, horizontalOverflow: globalThis.document.documentElement.scrollWidth > globalThis.innerWidth, surfaceTop: surfaceBounds?.top ?? null, surfaceBottom: surfaceBounds?.bottom ?? null, headerTop: header?.top ?? null, headerBottom: header?.bottom ?? null, tabsTop: tabs?.top ?? null, tabsBottom: tabs?.bottom ?? null, labTop: lab?.top ?? null, labBottom: lab?.bottom ?? null, noticeTop: notice?.top ?? null, noticeBottom: notice?.bottom ?? null, learningTop: learning?.top ?? null, learningBottom: learning?.bottom ?? null, navTop: nav?.top ?? null, navBottom: nav?.bottom ?? null, siteFooterTop: siteFooter?.top ?? null, siteFooterBottom: siteFooter?.bottom ?? null, sidebarProgressTop: sidebarProgress?.top ?? null, sidebarProgressBottom: sidebarProgress?.bottom ?? null };
});
await page.screenshot({ path: path.join(out, "0323-desktop.png"), fullPage: false });
const validation = { mockup: "0323", lessonId: 266, route, reference: reference ?? null, objectModel: await surface.getAttribute("data-object-model"), checks, metrics, consoleMessages: messages, passed: !metrics.horizontalOverflow && messages.length === 0 };
await writeFile(path.join(out, "0323-dedicated-target-validation.json"), JSON.stringify(validation, null, 2));
console.log(JSON.stringify(validation, null, 2));
await browser.close();

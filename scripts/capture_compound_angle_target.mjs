import { copyFile, mkdir, readdir, writeFile } from "fs/promises";
import path from "path";
import { chromium } from "playwright";

const out = "test-evidence/lesson-ui-upgrade",
  refs = "D:/Math App Screenshots for UI Update/Updated UI",
  baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245",
  route = "/lessons/trigonometry/267-compound-angle-formulae";
await mkdir(out, { recursive: true });
const reference = (await readdir(refs)).find((name) =>
  name.startsWith("0324-"),
);
if (reference)
  await copyFile(
    path.join(refs, reference),
    path.join(out, "0324-reference.png"),
  );
const browser = await chromium.launch(),
  page = await browser.newPage({
    viewport: { width: 985, height: 1597 },
    deviceScaleFactor: 1,
  }),
  messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(`${baseUrl}${route}`, {
  waitUntil: "networkidle",
  timeout: 60_000,
});
const surface = page.locator("[data-dedicated-lesson='267']");
await surface.waitFor();
const state = async () =>
  surface.evaluate((element) => ({
    alpha: Number(element.dataset.alpha),
    beta: Number(element.dataset.beta),
    sum: Number(element.dataset.sum),
    difference: Number(element.dataset.difference),
    cosSum: Number(element.dataset.cosSum),
    sinSum: Number(element.dataset.sinSum),
    cosDifference: Number(element.dataset.cosDifference),
    sinDifference: Number(element.dataset.sinDifference),
    projections: element.dataset.projections === "true",
    coordinates: element.dataset.coordinates === "true",
    grid: element.dataset.grid === "true",
    challengeIndex: Number(element.dataset.challengeIndex),
    choice:
      element.dataset.choice === "none" ? null : Number(element.dataset.choice),
    practiceResult: element.dataset.practiceResult,
  }));
const checks = { initial: await state() };
const verify = (value, label) => {
  const ar = (value.alpha * Math.PI) / 180,
    br = (value.beta * Math.PI) / 180;
  if (
    Math.abs(value.sum - (value.alpha + value.beta)) > 1e-5 ||
    Math.abs(value.difference - (value.alpha - value.beta)) > 1e-5 ||
    Math.abs(value.cosSum - Math.cos(ar + br)) > 1e-5 ||
    Math.abs(value.sinSum - Math.sin(ar + br)) > 1e-5 ||
    Math.abs(value.cosDifference - Math.cos(ar - br)) > 1e-5 ||
    Math.abs(value.sinDifference - Math.sin(ar - br)) > 1e-5
  )
    throw new Error(`${label} compound model failed: ${JSON.stringify(value)}`);
};
verify(checks.initial, "Initial");
if (
  Math.abs(checks.initial.alpha - 40) > 1e-5 ||
  Math.abs(checks.initial.beta - 75) > 1e-5 ||
  checks.initial.practiceResult !== "correct"
)
  throw new Error("Initial compound state failed");
async function drag(testId, dx, dy) {
  const locator = page.getByTestId(testId),
    box = await locator.boundingBox();
  if (!box) throw new Error(`${testId} has no box`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width / 2 + dx,
    box.y + box.height / 2 + dy,
    { steps: 8 },
  );
  await page.mouse.up();
}
await drag("compound-alpha-handle", -22, -12);
checks.alphaDrag = await state();
verify(checks.alphaDrag, "Alpha drag");
if (
  Math.abs(checks.alphaDrag.alpha - checks.initial.alpha) < 5 ||
  Math.abs(checks.alphaDrag.beta - checks.initial.beta) > 1e-5
)
  throw new Error("Alpha handle did not remain independent");
const beforeBeta = await state();
await drag("compound-beta-handle", 22, 10);
checks.betaDrag = await state();
verify(checks.betaDrag, "Beta drag");
if (
  Math.abs(checks.betaDrag.beta - beforeBeta.beta) < 5 ||
  Math.abs(checks.betaDrag.alpha - beforeBeta.alpha) > 1e-5
)
  throw new Error("Beta handle did not remain independent");
await page.getByLabel("Alpha angle").fill("45");
await page.getByLabel("Beta angle").fill("30");
checks.fortyFiveThirty = await state();
verify(checks.fortyFiveThirty, "45/30 exact");
if (
  Math.abs(checks.fortyFiveThirty.sum - 75) > 1e-5 ||
  Math.abs(checks.fortyFiveThirty.difference - 15) > 1e-5
)
  throw new Error("Editable angle controls failed");
await page.getByLabel("Show projections").uncheck();
await page.getByLabel("Show coordinates").uncheck();
await page.getByLabel("Show grid").check();
checks.displayToggles = await state();
if (
  checks.displayToggles.projections ||
  checks.displayToggles.coordinates ||
  !checks.displayToggles.grid
)
  throw new Error("Projection display controls failed");
const options = page.locator(".target-compound-practice article>div button");
await options.nth(1).click();
checks.practiceWrong = await state();
if (
  checks.practiceWrong.practiceResult !== "incorrect" ||
  checks.practiceWrong.choice !== 1
)
  throw new Error("Incorrect practice path failed");
await options.nth(0).click();
checks.practiceCorrect = await state();
if (
  checks.practiceCorrect.practiceResult !== "correct" ||
  checks.practiceCorrect.choice !== 0
)
  throw new Error("Correct practice path failed");
await page.getByRole("button", { name: "New Challenge", exact: true }).click();
checks.newChallenge = await state();
if (
  checks.newChallenge.challengeIndex !== 1 ||
  checks.newChallenge.choice !== null ||
  checks.newChallenge.practiceResult !== "idle"
)
  throw new Error("New challenge failed");
await options.nth(0).click();
checks.secondCorrect = await state();
if (checks.secondCorrect.practiceResult !== "correct")
  throw new Error("Second challenge answer failed");
await page.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
if (
  Math.abs(checks.reset.alpha - 40) > 1e-5 ||
  Math.abs(checks.reset.beta - 75) > 1e-5 ||
  !checks.reset.projections ||
  !checks.reset.coordinates ||
  checks.reset.grid ||
  checks.reset.challengeIndex !== 0 ||
  checks.reset.choice !== 0 ||
  checks.reset.practiceResult !== "correct"
)
  throw new Error("Reset failed");
await page.evaluate(() => {
  globalThis.scrollTo(0, 0);
  globalThis.document.querySelectorAll("*").forEach((element) => {
    if (element.scrollTop) element.scrollTop = 0;
    if (element.scrollLeft) element.scrollLeft = 0;
  });
});
await page.waitForTimeout(250);
const metrics = await page.evaluate(() => {
  const bounds = (selector) =>
      globalThis.document.querySelector(selector)?.getBoundingClientRect(),
    surfaceBounds = bounds("[data-dedicated-lesson='267']"),
    header = bounds(".target-compound-header"),
    flow = bounds(".target-compound-flow"),
    workspace = bounds(".target-compound-workspace"),
    formulas = bounds(".target-compound-formulas"),
    learning = bounds(".target-compound-learning"),
    practice = bounds(".target-compound-practice"),
    nav = bounds(".target-compound-nav"),
    extra = bounds("[data-testid='desktop-sidebar-compound-links']"),
    premium = bounds("[data-testid='desktop-sidebar-premium']");
  return {
    viewport: {
      width: globalThis.innerWidth,
      height: globalThis.innerHeight,
    },
    document: {
      width: globalThis.document.documentElement.scrollWidth,
      height: globalThis.document.documentElement.scrollHeight,
    },
    horizontalOverflow:
      globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    surfaceTop: surfaceBounds?.top ?? null,
    surfaceBottom: surfaceBounds?.bottom ?? null,
    headerTop: header?.top ?? null,
    headerBottom: header?.bottom ?? null,
    flowTop: flow?.top ?? null,
    flowBottom: flow?.bottom ?? null,
    workspaceTop: workspace?.top ?? null,
    workspaceBottom: workspace?.bottom ?? null,
    formulasTop: formulas?.top ?? null,
    formulasBottom: formulas?.bottom ?? null,
    learningTop: learning?.top ?? null,
    learningBottom: learning?.bottom ?? null,
    practiceTop: practice?.top ?? null,
    practiceBottom: practice?.bottom ?? null,
    navTop: nav?.top ?? null,
    navBottom: nav?.bottom ?? null,
    sidebarLinksTop: extra?.top ?? null,
    sidebarLinksBottom: extra?.bottom ?? null,
    premiumTop: premium?.top ?? null,
    premiumBottom: premium?.bottom ?? null,
  };
});
await page.screenshot({
  path: path.join(out, "0324-desktop.png"),
  fullPage: false,
});
const validation = {
  mockup: "0324",
  lessonId: 267,
  route,
  reference: reference ?? null,
  objectModel: await surface.getAttribute("data-object-model"),
  checks,
  metrics,
  consoleMessages: messages,
  passed: !metrics.horizontalOverflow && messages.length === 0,
};
await writeFile(
  path.join(out, "0324-dedicated-target-validation.json"),
  JSON.stringify(validation, null, 2),
);
console.log(JSON.stringify(validation, null, 2));
await browser.close();

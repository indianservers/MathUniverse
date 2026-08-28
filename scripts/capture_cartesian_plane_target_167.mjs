import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0224-interactive-intermediate-coordinate-geometry-cartesian-plane-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2254/lessons/geometry/167-cartesian-plane";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1014, height: 1551 } });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180_000 });
const lesson = page.getByTestId("geometry-mockup-0224");
await lesson.waitFor({ timeout: 600_000 });
const state = () => lesson.evaluate((element) => Object.fromEntries(["x", "y", "quadrant", "stage", "practice", "correct"].map((name) => [name, element.getAttribute(`data-${name}`)])));
const checks = { initial: await state() };

await lesson.getByLabel("Point x coordinate").fill("-4");
await lesson.getByLabel("Point y coordinate").fill("3");
await lesson.getByTestId("cartesian-demo-point").press("ArrowRight");
await lesson.getByTestId("cartesian-demo-point").press("ArrowDown");
checks.keyboard = await state();

await lesson.getByRole("button", { name: "Reset", exact: true }).click();
const demoBox = await lesson.getByTestId("cartesian-demo-point").boundingBox();
await page.mouse.move(demoBox.x + demoBox.width / 2, demoBox.y + demoBox.height / 2);
await page.mouse.down();
await page.mouse.move(demoBox.x + demoBox.width / 2 - 124, demoBox.y + demoBox.height / 2 - 62, { steps: 8 });
await page.mouse.up();
checks.pointerDrag = await state();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();

for (const label of ["Show grid", "Show axes", "Show quadrant colors"]) await lesson.getByLabel(label).uncheck();
await lesson.getByLabel("Show tick labels").check();
checks.visibility = await lesson.locator('input[type="checkbox"]').evaluateAll((inputs) => inputs.map((input) => input.checked));
for (const label of ["Show grid", "Show axes", "Show quadrant colors"]) await lesson.getByLabel(label).check();
await lesson.getByLabel("Show tick labels").uncheck();
for (const label of ["Manipulate", "Pattern", "Rule", "Try it", "Observe"]) await lesson.getByRole("button", { name: label }).click();

const practice = lesson.locator(".cp167-practice");
const grid = practice.getByRole("img", { name: "Practice Cartesian plane" });
const gridBox = await grid.boundingBox();
const plot = async (index, x, y) => {
  await practice.locator("aside button").nth(index).click();
  await grid.click({ position: { x: gridBox.width * (230 + x * 31) / 460, y: gridBox.height * (205 - y * 31) / 410 } });
};
await grid.click();
await practice.getByRole("button", { name: "Check", exact: true }).click();
checks.wrongText = await practice.locator("output").textContent();
await practice.getByRole("button", { name: "Clear All" }).click();
const targets = [[2, -3], [-5, 4], [-2, -2], [4, 1]];
for (let index = 0; index < targets.length; index += 1) await plot(index, ...targets[index]);
checks.allPlaced = await state();

const practicePoint = lesson.getByTestId("practice-point-0");
const practiceBox = await practicePoint.boundingBox();
await page.mouse.move(practiceBox.x + practiceBox.width / 2, practiceBox.y + practiceBox.height / 2);
await page.mouse.down();
await page.mouse.move(practiceBox.x + practiceBox.width / 2 + 31, practiceBox.y + practiceBox.height / 2, { steps: 5 });
await page.mouse.up();
checks.practiceDrag = await state();
await practicePoint.press("ArrowLeft");
await practice.locator("aside button").nth(3).click();
await practice.getByRole("button", { name: "Delete" }).click();
checks.deleted = await state();
await plot(3, 4, 1);
await practice.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
checks.correctText = await practice.locator("output").textContent();
await practice.getByRole("button", { name: "Show Solution" }).click();
checks.solutionCount = await lesson.locator(".practice-label").count();
await practice.getByRole("button", { name: "Show Solution" }).click();
await practice.getByRole("button", { name: "Clear All" }).click();

await lesson.getByRole("button", { name: "Share" }).click();
checks.share = await lesson.locator(".cp167-header output").textContent();
await lesson.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await lesson.locator(".cp167-header output").textContent();
await lesson.getByRole("button", { name: "Reset", exact: true }).click();
await page.evaluate(() => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; });

const previousHref = await lesson.locator(".cp167-nav a").first().getAttribute("href");
const nextHref = await lesson.locator(".cp167-nav a").last().getAttribute("href");
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const box = document.querySelector(selector)?.getBoundingClientRect();
    return box ? { top: box.top, bottom: box.bottom, left: box.left, right: box.right, width: box.width, height: box.height } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    regions: { page: region(".cp167-page"), header: region(".cp167-header"), stages: region(".cp167-stages"), explore: region(".cp167-explore"), learning: region(".cp167-learning"), practice: region(".cp167-practice"), navigation: region(".cp167-nav") },
  };
});
const geometryPassed = metrics.viewport.width === 1014 && metrics.viewport.height === 1551 && metrics.document.width === 1014 && metrics.document.height === 1551 && Math.round(metrics.regions.page?.left) === 209 && Math.round(metrics.regions.page?.top) === 105 && Math.abs(metrics.regions.explore?.top - 321) <= 1 && Math.abs(metrics.regions.navigation?.bottom - 1531) <= 6;
const passed = checks.initial.x === "3" && checks.initial.y === "2" && checks.keyboard.x === "-3" && checks.keyboard.y === "2" && checks.pointerDrag.x === "-1" && checks.pointerDrag.y === "4" && checks.visibility.join() === "false,false,false,true" && checks.wrongText?.includes("Not yet") && checks.allPlaced.correct === "true" && checks.practiceDrag.practice?.startsWith("3:-3") && checks.deleted.practice?.endsWith(",") && checks.correct.correct === "true" && checks.correctText?.includes("Correct") && checks.solutionCount === 4 && checks.share?.includes("copied") && checks.workspace?.includes("opened") && previousHref === "/lessons/graphs-and-functions/166-graph-matching" && nextHref === "/lessons/geometry/168-plotting-points" && geometryPassed && !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0224-desktop.png") });
await copyFile(reference, path.join(out, "0224-reference.png"));
const report = { mockup: "0224", lessonId: 167, route: "/lessons/geometry/167-cartesian-plane", checks, navigation: { previousHref, nextHref }, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0224-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);

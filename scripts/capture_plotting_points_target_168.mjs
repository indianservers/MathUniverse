import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(), out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0225-interactive-intermediate-coordinate-geometry-plotting-points-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2254/lessons/geometry/168-plotting-points";
const browser = await chromium.launch({ headless: true }), context = await browser.newContext({ viewport: { width: 1024, height: 1536 } }), page = await context.newPage(), consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180_000 });
const lesson = page.getByTestId("geometry-mockup-0225");
await lesson.waitFor({ timeout: 600_000 });
const state = () => lesson.evaluate((element) => Object.fromEntries(["points", "mode", "snap", "pan", "stage", "treasure"].map((name) => [name, element.getAttribute(`data-${name}`)])));
const checks = { initial: await state() };

await lesson.getByLabel("A x coordinate").fill("-3"); await lesson.getByLabel("A y coordinate").fill("4"); checks.inputs = await state();
await lesson.getByTestId("plot-point-0").press("ArrowRight"); await lesson.getByTestId("plot-point-0").press("ArrowDown"); checks.keyboard = await state();
const pointBox = await lesson.getByTestId("plot-point-0").boundingBox();
await page.mouse.move(pointBox.x + pointBox.width / 2, pointBox.y + pointBox.height / 2); await page.mouse.down(); await page.mouse.move(pointBox.x + pointBox.width / 2 + 70, pointBox.y + pointBox.height / 2 + 35, { steps: 7 }); await page.mouse.up(); checks.pointerDrag = await state();
await lesson.getByLabel("Snap to grid").uncheck(); await lesson.getByTestId("plot-point-0").press("ArrowRight"); checks.halfStep = await state();
await lesson.getByLabel("Pan tool").click();
const grid = lesson.getByRole("img", { name: "Editable plotting plane" }), gridBox = await grid.boundingBox();
await page.mouse.move(gridBox.x + 180, gridBox.y + 170); await page.mouse.down(); await page.mouse.move(gridBox.x + 215, gridBox.y + 190, { steps: 5 }); await page.mouse.up(); checks.pan = await state();
await lesson.getByLabel("Point tool").click(); await grid.click({ position: { x: gridBox.width / 2, y: gridBox.height / 2 } }); checks.plot = await state();
await lesson.getByLabel("Delete point A").click(); checks.delete = await state(); await lesson.getByRole("button", { name: "Clear All" }).click(); checks.clear = await state();
for (const label of ["Observe", "Notice", "Understand", "Try", "Manipulate"]) await lesson.getByRole("button", { name: new RegExp(label) }).click();
await lesson.getByRole("button", { name: /Plot T/ }).click(); checks.treasure = await state();
await lesson.getByRole("button", { name: "Bookmark lesson" }).click(); checks.bookmark = await lesson.locator(".pp168-header output").textContent(); await lesson.getByRole("button", { name: "Share" }).click(); checks.share = await lesson.locator(".pp168-header output").textContent(); await lesson.getByRole("button", { name: "Workspace" }).click(); checks.workspace = await lesson.locator(".pp168-header output").textContent();
await page.reload({ waitUntil: "domcontentloaded" }); await lesson.waitFor({ timeout: 600_000 }); await page.evaluate(() => { document.documentElement.scrollTop = 0; document.body.scrollTop = 0; }); checks.reset = await state();
const previousHref = await lesson.locator(".pp168-nav a").first().getAttribute("href"), nextHref = await lesson.locator(".pp168-nav a").last().getAttribute("href");
const metrics = await page.evaluate(() => { const region = (selector) => { const box = document.querySelector(selector)?.getBoundingClientRect(); return box ? { top: box.top, bottom: box.bottom, left: box.left, right: box.right, width: box.width, height: box.height } : null; }; return { viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight, regions: { page: region(".pp168-page"), header: region(".pp168-header"), stages: region(".pp168-stages"), workspace: region(".pp168-workspace"), plot: region(".pp168-grid"), challenge: region(".pp168-challenge"), navigation: region(".pp168-nav") } }; });
const geometryPassed = metrics.viewport.width === 1024 && metrics.viewport.height === 1536 && metrics.document.width === 1024 && metrics.document.height === 1536 && Math.round(metrics.regions.page.left) === 215 && Math.abs(metrics.regions.header.top - 103) <= 1 && Math.abs(metrics.regions.navigation.bottom - 1518) <= 2;
const passed = checks.initial.points === "3:2,-4:1,-2:-3,5:-2" && checks.inputs.points.startsWith("-3:4") && checks.keyboard.points.startsWith("-2:3") && checks.pointerDrag.points.startsWith("0:2") && checks.halfStep.points.startsWith("0.5:2") && checks.pan.mode === "pan" && checks.pan.pan !== "0:0" && checks.plot.mode === "point" && checks.delete.points.startsWith(",") && checks.clear.points === ",,," && checks.treasure.treasure === "true" && checks.bookmark?.includes("bookmarked") && checks.share?.includes("copied") && checks.workspace?.includes("opened") && checks.reset.points === "3:2,-4:1,-2:-3,5:-2" && previousHref === "/lessons/geometry/167-cartesian-plane" && nextHref === "/lessons/geometry/169-distance-between-points" && geometryPassed && !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0225-desktop.png") }); await copyFile(reference, path.join(out, "0225-reference.png"));
const report = { mockup: "0225", lessonId: 168, route: "/lessons/geometry/168-plotting-points", checks, navigation: { previousHref, nextHref }, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0225-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`); console.log(JSON.stringify(report, null, 2)); await browser.close(); process.exit(passed ? 0 : 1);

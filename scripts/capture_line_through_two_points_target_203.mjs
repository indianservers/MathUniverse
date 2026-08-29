import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0260-interactive-foundational-advanced-dynamic-geometry-constructions-line-through-two-points-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2255/lessons/geometry/203-line-through-two-points";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1478, height: 1064 } });
const messages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) messages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("dynamic-geometry-mockup-0260");
await lesson.waitFor({ timeout: 600000 });
const state = () => lesson.evaluate((node) => Object.fromEntries(["model", "a", "b", "slope", "equation", "zoom", "pan", "tab", "steps"].map((key) => [key, node.getAttribute(`data-${key}`)])));
const checks = { initial: await state() };
const point = lesson.getByTestId("line-point-a").locator("circle");
const box = await point.boundingBox();
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 + 78, box.y + box.height / 2 - 39, { steps: 8 });
await page.mouse.up();
checks.dragged = await state();
await lesson.getByLabel("B x coordinate").fill(checks.dragged.a.split(":")[0]);
checks.vertical = await state();
await lesson.getByRole("button", { name: "Reset points", exact: true }).click();
const canvas = await lesson.getByRole("img", { name: "Infinite line through draggable points A and B on a coordinate plane" }).boundingBox();
await page.mouse.move(canvas.x + canvas.width - 35, canvas.y + 390);
await page.mouse.down();
await page.mouse.move(canvas.x + canvas.width - 15, canvas.y + 415, { steps: 5 });
await page.mouse.up();
await lesson.getByRole("button", { name: "Zoom +", exact: true }).click();
checks.viewChanged = await state();
await lesson.getByRole("button", { name: "Fit", exact: true }).click();
checks.fit = await state();
await lesson.getByText("Coordinates", { exact: true }).click();
checks.coordinatesHidden = !(await lesson.getByText("A(-3, -1)", { exact: true }).isVisible().catch(() => false));
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.challenge = await lesson.getByRole("status").textContent();
await lesson.getByRole("button", { name: "Remove step 2", exact: true }).click();
checks.removedStep = await state();
await lesson.getByRole("button", { name: "Clear steps", exact: true }).click();
checks.cleared = await state();
await lesson.getByRole("button", { name: "Restore steps", exact: true }).click();
checks.restored = await state();
for (const name of ["Equation & Slope", "Collinearity", "Examples", "Summary", "Explore"])
  await lesson.getByRole("button", { name, exact: true }).click();
checks.tabs = await state();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const box = globalThis.document.querySelector(selector)?.getBoundingClientRect();
    return box ? { top: box.top, left: box.left, width: box.width, height: box.height, bottom: box.bottom } : null;
  };
  return {
    document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight },
    viewport: { width: globalThis.innerWidth, height: globalThis.innerHeight },
    horizontalOverflow: globalThis.document.documentElement.scrollWidth > globalThis.innerWidth,
    regions: { header: region(".lt203-header"), tabs: region(".lt203-tabs"), main: region(".lt203-main"), nav: region(".lt203-nav") },
  };
});
const previousHref = await lesson.locator(".lt203-nav a").first().getAttribute("href");
const nextHref = await lesson.locator(".lt203-nav a").last().getAttribute("href");
const geometry =
  metrics.document.width === 1478 && metrics.document.height <= 1064 &&
  Math.round(metrics.regions.header.top) === 111 && Math.round(metrics.regions.header.left) === 285 &&
  Math.round(metrics.regions.header.width) === 1173 && Math.round(metrics.regions.nav.bottom) <= 1064;
const passed =
  checks.initial.model === "two-distinct-points-unique-infinite-line" &&
  checks.initial.a === "-3:-1" && checks.initial.b === "4:3" &&
  Math.abs(Number(checks.initial.slope) - 4 / 7) < 1e-10 &&
  checks.dragged.a !== checks.initial.a && checks.dragged.slope !== checks.initial.slope &&
  checks.vertical.slope === "undefined" && checks.vertical.equation.startsWith("x =") &&
  checks.viewChanged.zoom === "1.2" && checks.viewChanged.pan !== "0:0" &&
  checks.fit.zoom === "1" && checks.fit.pan === "0:0" && checks.coordinatesHidden &&
  checks.challenge?.startsWith("Correct") && checks.removedStep.steps === "3" &&
  checks.cleared.steps === "0" && checks.restored.steps === "4" && checks.tabs.tab === "Explore" &&
  previousHref === "/lessons/geometry/202-attach-detach-point" && nextHref === "/lessons/geometry/204-segment" &&
  geometry && !metrics.horizontalOverflow && messages.length === 0;
await page.screenshot({ path: path.join(out, "0260-desktop.png"), fullPage: true });
await copyFile(reference, path.join(out, "0260-reference.png"));
const report = { mockup: "0260", lessonId: 203, checks, navigation: { previousHref, nextHref }, metrics, consoleMessages: messages, passed };
await writeFile(path.join(out, "0260-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);

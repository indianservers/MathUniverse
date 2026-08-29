import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0333-interactive-intermediate-advanced-trigonometry-polar-trigonometry-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2255/lessons/trigonometry/276-polar-trigonometry";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1024, height: 1536 } });
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("trigonometry-mockup-0333");
await lesson.waitFor({ timeout: 600000 });
const state = () => lesson.evaluate((node) => Object.fromEntries(["radius","theta","x","y","view","curve","stage","trace-count","feedback","language","share-count"].map((key) => [key, node.getAttribute(`data-${key}`)])));
const checks = { initial: await state() };

const handle = lesson.getByTestId("polar-point-handle");
const box = await handle.boundingBox();
if (!box) throw new Error("Polar point handle unavailable");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x + box.width / 2 - 55, box.y + box.height / 2 - 42, { steps: 8 });
await page.mouse.up();
checks.dragged = await state();

const radiusInput = lesson.getByLabel("r (radius) exact value");
const thetaInput = lesson.getByLabel("theta (angle) exact value");
await radiusInput.fill("-2"); await radiusInput.press("Enter");
await thetaInput.fill("30"); await thetaInput.press("Enter");
checks.negativeRadius = await state();

for (const name of ["Cartesian Grid", "Trace Curve", "Polar Grid"]) await lesson.getByRole("button", { name, exact: true }).click();
checks.views = await state();
await lesson.getByLabel("Polar curve", { exact: true }).selectOption("sin"); checks.sineCurve = await state();
await lesson.getByLabel("Polar curve", { exact: true }).selectOption("double"); checks.doubleCurve = await state();
await lesson.getByRole("button", { name: "Clear Trace" }).click(); checks.traceCleared = await state();

checks.stages = [];
for (const [index, name] of ["Interaction", "Explain", "Examples", "Formulas", "Know more"].entries()) {
  await lesson.getByRole("button", { name, exact: true }).click();
  checks.stages.push({ expected: String(index), actual: (await state()).stage });
}
await lesson.getByLabel("Lesson language").selectOption("Hindi (Hindi)");
await lesson.getByRole("button", { name: "Share" }).click();
await page.waitForFunction(() => globalThis.document.querySelector('[data-testid="trigonometry-mockup-0333"]')?.getAttribute("data-share-count") === "1");
checks.languageAndShare = await state();

const practice = lesson.locator("#polar-practice");
await practice.getByLabel("Practice x coordinate").fill("1");
await practice.getByLabel("Practice y coordinate").fill("-2");
await practice.getByRole("button", { name: "Check Answer" }).click(); checks.rejected = await state();
await practice.getByLabel("Practice x coordinate").fill("1.5");
await practice.getByLabel("Practice y coordinate").fill("-2.598");
await practice.getByRole("button", { name: "Check Answer" }).click(); checks.accepted = await state();

await lesson.getByRole("button", { name: "Reset", exact: true }).click(); checks.reset = await state();
await page.reload({ waitUntil: "domcontentloaded", timeout: 180000 });
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(200);

const navigation = {
  workspaceHref: await lesson.getByRole("link", { name: "Workspace" }).getAttribute("href"),
  previousHref: await lesson.getByRole("link", { name: /Previous/ }).getAttribute("href"),
  nextHref: await lesson.getByRole("link", { name: /Next Lesson/ }).getAttribute("href"),
};
const metrics = await page.evaluate(() => {
  const rect = (selector) => { const element = globalThis.document.querySelector(selector); if (!element) return null; const box = element.getBoundingClientRect(); return { top: box.top, left: box.left, width: box.width, height: box.height, bottom: box.bottom }; };
  return {
    document: { width: globalThis.document.documentElement.scrollWidth, height: globalThis.document.documentElement.scrollHeight },
    overflow: globalThis.document.documentElement.scrollWidth > globalThis.window.innerWidth,
    sidebar: rect('[data-testid="desktop-sidebar"]'),
    surface: rect('[data-testid="trigonometry-mockup-0333"]'),
    header: rect(".polar276-header"), stages: rect(".polar276-stages"), lab: rect(".polar276-lab"),
    flow: rect(".polar276-flow"), learning: rect(".polar276-learning"), practice: rect(".polar276-practice"),
    adjacent: rect(".polar276-adjacent"), footer: rect('footer[aria-label="Site footer"]'),
  };
});
const approximately = (actual, expected, tolerance = 0.01) => Math.abs(Number(actual) - expected) <= tolerance;
const passed =
  approximately(checks.initial.radius, Math.sqrt(3)) && approximately(checks.initial.theta, 30) && approximately(checks.initial.x, 1.5) && approximately(checks.initial.y, Math.sqrt(3) / 2) &&
  checks.dragged.theta !== checks.initial.theta && Number(checks.dragged["trace-count"]) > 0 &&
  approximately(checks.negativeRadius.x, -Math.sqrt(3), 0.001) && approximately(checks.negativeRadius.y, -1, 0.001) &&
  checks.views.view === "polar" && checks.sineCurve.curve === "sin" && checks.doubleCurve.curve === "double" && checks.traceCleared["trace-count"] === "0" &&
  checks.stages.every((item) => item.expected === item.actual) && checks.languageAndShare.language === "Hindi (Hindi)" && checks.languageAndShare["share-count"] === "1" &&
  checks.rejected.feedback === "incorrect" && checks.accepted.feedback === "correct" && checks.reset.radius === checks.initial.radius && checks.reset.theta === checks.initial.theta && checks.reset.feedback === "idle" &&
  navigation.workspaceHref === "/workspace/trigonometry" && navigation.previousHref === "/lessons/trigonometry/275-harmonic-motion" && navigation.nextHref === "/lessons/trigonometry/277-trigonometric-identities" &&
  metrics.document.width === 1024 && metrics.document.height === 1536 && metrics.sidebar?.width === 207 && metrics.surface?.top === 98 && !metrics.overflow && consoleMessages.length === 0;

const report = { mockup: "0333", lessonId: 276, checks, navigation, metrics, consoleMessages, passed };
await page.screenshot({ path: path.join(evidence, "0333-desktop.png"), fullPage: true });
await copyFile(reference, path.join(evidence, "0333-reference.png"));
await writeFile(path.join(evidence, "0333-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
await browser.close();
console.log(JSON.stringify(report, null, 2));
if (!passed) process.exitCode = 1;

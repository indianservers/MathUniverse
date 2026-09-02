/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(),
  evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0629-interactive-intermediate-advanced-combinatorics-graph-theory-and-logic-hamiltonian-paths-and-cycles-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2256/lessons/discrete-and-applied-mathematics/572-hamiltonian-paths-and-cycles";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1006, height: 1564 } }),
  consoleMessages = [];
page.setDefaultTimeout(60000);
page.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`${m.type()}: ${m.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("discrete-mockup-0629");
await lesson.waitFor({ timeout: 600000 });
await page.waitForTimeout(500);
const keys = [
    "route",
    "visitedCount",
    "valid",
    "canComplete",
    "isPath",
    "isCycle",
    "edgeCount",
    "positions",
    "graded",
    "actions",
  ],
  state = () =>
    lesson.evaluate(
      (node, names) =>
        Object.fromEntries(names.map((name) => [name, node.dataset[name]])),
      keys,
    ),
  checks = { initial: await state() };
await lesson.getByTestId("hamiltonian-vertex-E").click();
await lesson.getByTestId("hamiltonian-vertex-D").click();
checks.path = await state();
await lesson.getByTestId("hamiltonian-vertex-A").click();
checks.cycle = await state();
await lesson.getByRole("button", { name: /Undo last step/ }).click();
checks.undo = await state();
await lesson.getByRole("button", { name: /Clear/ }).click();
await lesson.getByTestId("hamiltonian-vertex-C").click();
checks.nonEdge = await state();
checks.nonEdgeMessage = await lesson
  .getByText(/not adjacent/)
  .first()
  .isVisible();
await lesson.getByTestId("hamiltonian-vertex-B").click();
await lesson.getByTestId("hamiltonian-vertex-A").click();
checks.revisit = await state();
checks.revisitMessage = await lesson
  .getByText(/already visited/)
  .first()
  .isVisible();
const before = checks.revisit.positions,
  vertex = await lesson.getByTestId("hamiltonian-vertex-C").boundingBox();
if (!vertex) throw new Error("C missing");
await page.mouse.move(
  vertex.x + vertex.width / 2,
  vertex.y + vertex.height / 2,
);
await page.mouse.down();
await page.mouse.move(
  vertex.x + vertex.width / 2 + 35,
  vertex.y + vertex.height / 2 + 20,
  { steps: 8 },
);
await page.mouse.up();
checks.dragged = await state();
checks.dragChanged = checks.dragged.positions !== before;
await lesson.getByRole("button", { name: /Randomize graph/ }).click();
checks.random = await state();
await lesson.getByLabel("Show step-by-step order").uncheck();
checks.stepsOff = !(await lesson
  .getByLabel("Show step-by-step order")
  .isChecked());
await lesson.getByRole("button", { name: "Formula", exact: true }).click();
checks.formulaVisible = await lesson
  .getByText(/visited vertices/)
  .first()
  .isVisible();
await lesson.getByRole("button", { name: "Interact", exact: true }).click();
await lesson.getByLabel("Hamiltonian challenge route").fill("A-C-B");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.wrong = await state();
await lesson.getByLabel("Hamiltonian challenge route").fill("A-B-E-D-C");
await lesson.getByRole("button", { name: "Check", exact: true }).click();
checks.correct = await state();
await lesson.getByRole("button", { name: /Show answer/ }).click();
checks.answerVisible = await lesson
  .getByText("A → B → E → D → C")
  .last()
  .isVisible();
await page.reload({ waitUntil: "domcontentloaded" });
await lesson.waitFor();
checks.final = await state();
await page.evaluate(() => scrollTo(0, 0));
const rect = async (s) => {
  const b = await lesson.locator(s).boundingBox();
  return b
    ? {
        top: Math.round(b.y),
        left: Math.round(b.x),
        width: Math.round(b.width),
        height: Math.round(b.height),
        bottom: Math.round(b.y + b.height),
      }
    : null;
};
const metrics = {
  document: await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
  })),
  overflow: await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
  hero: await rect(".ha572-hero"),
  tabs: await rect(".ha572-tabs"),
  sequence: await rect(".ha572-sequence"),
  builder: await rect(".ha572-builder"),
  analysis: await rect(".ha572-analysis"),
  worked: await rect(".ha572-worked"),
  challenge: await rect(".ha572-challenge"),
  adjacent: await rect(".ha572-adjacent"),
};
await page.screenshot({
  path: path.join(evidence, "0629-desktop.png"),
  fullPage: false,
});
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
mobile.on("console", (m) => {
  if (["error", "warning"].includes(m.type()))
    consoleMessages.push(`mobile ${m.type()}: ${m.text()}`);
});
await mobile.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
await mobile.getByTestId("discrete-mockup-0629").waitFor({ timeout: 600000 });
await mobile.waitForTimeout(400);
const mobileMetrics = {
  documentWidth: await mobile.evaluate(
    () => document.documentElement.scrollWidth,
  ),
  overflow: await mobile.evaluate(
    () => document.documentElement.scrollWidth > innerWidth,
  ),
};
await mobile.screenshot({
  path: path.join(evidence, "0629-mobile.png"),
  fullPage: true,
});
const passed =
  checks.initial.route === "A,B,C" &&
  checks.initial.canComplete === "true" &&
  checks.path.route === "A,B,C,E,D" &&
  checks.path.isPath === "true" &&
  checks.cycle.isCycle === "true" &&
  checks.undo.isPath === "true" &&
  checks.nonEdge.route === "A" &&
  checks.nonEdgeMessage &&
  checks.revisit.route === "A,B" &&
  checks.revisitMessage &&
  checks.dragChanged &&
  checks.random.edgeCount === "7" &&
  checks.stepsOff &&
  checks.formulaVisible &&
  checks.wrong.graded === "false" &&
  checks.correct.graded === "true" &&
  checks.answerVisible &&
  checks.final.route === "A,B,C" &&
  metrics.document.width === 1006 &&
  metrics.document.height === 1564 &&
  !metrics.overflow &&
  mobileMetrics.documentWidth <= 390 &&
  !mobileMetrics.overflow &&
  consoleMessages.length === 0;
await copyFile(reference, path.join(evidence, "0629-reference.png"));
await writeFile(
  path.join(evidence, "0629-validation.json"),
  `${JSON.stringify({ passed, url, checks, metrics, mobileMetrics, consoleMessages }, null, 2)}\n`,
);
await browser.close();
if (!passed) process.exitCode = 1;

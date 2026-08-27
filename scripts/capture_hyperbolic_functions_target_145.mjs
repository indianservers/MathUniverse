import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0202-interactive-intermediate-advanced-functions-hyperbolic-functions-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/145-hyperbolic-functions";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1536, height: 1024 },
  }),
  page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0202");
await node.waitFor({ timeout: 600000 });
const attrs = [
  "t",
  "exp",
  "inverse-exp",
  "sinh",
  "cosh",
  "tanh",
  "identity",
  "challenge-t",
  "challenge-error",
  "challenge-correct",
  "span",
  "visible",
  "actions",
];
const state = () =>
  node.evaluate(
    (element, names) =>
      Object.fromEntries(
        names.map((name) => [name, element.getAttribute(`data-${name}`)]),
      ),
    attrs,
  );
const checks = { initial: await state() };
const dragRange = async (name, delta) => {
  const slider = node.getByRole("slider", { name, exact: true }),
    box = await slider.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + box.width * delta, y, { steps: 9 });
  await page.mouse.up();
};
await dragRange("Hyperbolic parameter t", 0.18);
checks.parameterSlider = await state();
const reload = async () => {
  await page.reload({ waitUntil: "domcontentloaded" });
  await node.waitFor();
};
const dragHandle = async (name, dx, dy) => {
  const handle = node.getByRole("slider", { name, exact: true }),
    box = await handle.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  const x = box.x + box.width / 2,
    y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y + dy, { steps: 10 });
  await page.mouse.up();
  return handle;
};
await reload();
const hyperbola = await dragHandle("Drag point on unit hyperbola", 0, 48);
checks.hyperbolaDrag = await state();
await hyperbola.focus();
await hyperbola.press("ArrowUp");
checks.hyperbolaKeyboard = await state();
await reload();
const probe = await dragHandle("Drag hyperbolic graph probe", -60, 0);
checks.probeDrag = await state();
await probe.focus();
await probe.press("ArrowRight");
checks.probeKeyboard = await state();
const toggles = await node.locator(".hyp145-plot>nav input").all();
for (const toggle of toggles) await toggle.uncheck();
checks.allCurvesHidden = {
  state: await state(),
  paths: await node
    .locator(
      ".hyp145-graph path.sinh,.hyp145-graph path.cosh,.hyp145-graph path.tanh,.hyp145-graph path.exp,.hyp145-graph path.inverse-exp",
    )
    .count(),
};
for (const toggle of toggles) await toggle.check();
checks.curvesRestored = await state();
await node
  .getByRole("button", { name: "Zoom in hyperbolic graph", exact: true })
  .click();
checks.zoomIn = await state();
await node
  .getByRole("button", { name: "Zoom out hyperbolic graph", exact: true })
  .click();
checks.zoomOut = await state();
await dragRange("Hyperbolic challenge t", -0.2);
await node.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.challengeWrong = await state();
const challenge = node.getByRole("slider", {
  name: "Hyperbolic challenge t",
  exact: true,
});
await challenge.focus();
await challenge.press("Home");
for (let index = 0; index < 255; index++) await challenge.press("ArrowRight");
await node.getByRole("button", { name: "Check Answer", exact: true }).click();
checks.challengeCorrect = await state();
await node.getByRole("button", { name: "Bookmark", exact: true }).click();
checks.bookmarkVisible = await node
  .getByRole("button", { name: "Saved", exact: true })
  .isVisible();
await node.getByRole("button", { name: "Fullscreen", exact: true }).click();
checks.fullscreen = await node.evaluate((element) =>
  element.classList.contains("fullscreen"),
);
await node.getByRole("button", { name: "Exit", exact: true }).click();
await node.getByRole("button", { name: "Examples", exact: true }).click();
checks.examplesActive = await node
  .locator(".hyp145-tabs button.active")
  .innerText();
await node
  .getByRole("button", { name: "Reset hyperbolic graph view", exact: true })
  .click();
await page.reload({ waitUntil: "domcontentloaded" });
await node.waitFor();
checks.reset = await state();
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect
      ? {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        }
      : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: {
      width: document.documentElement.scrollWidth,
      height: document.documentElement.scrollHeight,
    },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    regions: {
      page: region(".hyp145-page"),
      header: region(".hyp145-header"),
      upper: region(".hyp145-upper"),
      hyperbola: region(".hyp145-hyperbola"),
      graph: region(".hyp145-graph"),
      lower: region(".hyp145-lower"),
      rail: region(".hyp145-rail"),
    },
  };
});
const valid = (snapshot) => {
  const t = Number(snapshot.t),
    exp = Math.exp(t),
    inverse = Math.exp(-t),
    sinh = (exp - inverse) / 2,
    cosh = (exp + inverse) / 2;
  return (
    Math.abs(Number(snapshot.exp) - exp) < 1e-9 &&
    Math.abs(Number(snapshot["inverse-exp"]) - inverse) < 1e-9 &&
    Math.abs(Number(snapshot.sinh) - sinh) < 1e-9 &&
    Math.abs(Number(snapshot.cosh) - cosh) < 1e-9 &&
    Math.abs(Number(snapshot.tanh) - sinh / cosh) < 1e-9 &&
    Math.abs(Number(snapshot.identity) - 1) < 1e-9
  );
};
const passed =
  checks.initial.t === "1.2" &&
  valid(checks.initial) &&
  [
    "parameterSlider",
    "hyperbolaDrag",
    "hyperbolaKeyboard",
    "probeDrag",
    "probeKeyboard",
  ].every((key) => valid(checks[key])) &&
  checks.parameterSlider.t !== checks.initial.t &&
  checks.hyperbolaDrag.t !== checks.initial.t &&
  checks.probeDrag.t !== checks.initial.t &&
  checks.allCurvesHidden.paths === 0 &&
  checks.allCurvesHidden.state.visible === "" &&
  checks.curvesRestored.visible === "sinh,cosh,tanh,exp,inverseExp" &&
  Number(checks.zoomIn.span) < Number(checks.initial.span) &&
  checks.zoomOut.span === checks.initial.span &&
  checks.challengeWrong["challenge-correct"] === "false" &&
  checks.challengeCorrect["challenge-correct"] === "true" &&
  Math.abs(Number(checks.challengeCorrect["challenge-t"]) - 0.55) < 0.011 &&
  checks.bookmarkVisible &&
  checks.fullscreen &&
  checks.examplesActive === "Examples" &&
  checks.reset.t === checks.initial.t &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0202-desktop.png") });
await copyFile(reference, path.join(out, "0202-reference.png"));
const report = {
  mockup: "0202",
  lessonId: 145,
  route: "/lessons/graphs-and-functions/145-hyperbolic-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0202-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);

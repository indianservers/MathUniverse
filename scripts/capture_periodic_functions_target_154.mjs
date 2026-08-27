import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0211-interactive-intermediate-advanced-functions-periodic-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/154-periodic-functions";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1315, height: 1197 },
    permissions: ["clipboard-write"],
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0211");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "amplitude",
    "frequency",
    "midline",
    "period",
    "x",
    "fx",
    "matching",
    "finder",
    "tab",
    "bookmarked",
    "shared",
    "menu",
    "language",
    "saved",
  ],
  state = () =>
    node.evaluate(
      (element, names) =>
        Object.fromEntries(
          names.map((name) => [name, element.getAttribute(`data-${name}`)]),
        ),
      attrs,
    ),
  reload = async () => {
    await page.reload({ waitUntil: "domcontentloaded" });
    await node.waitFor();
  };
const valid = (item) => {
  const a = Number(item.amplitude),
    b = Number(item.frequency),
    d = Number(item.midline),
    x = Number(item.x),
    period = (2 * Math.PI) / b,
    fx = a * Math.sin(b * x) + d,
    matching = a * Math.sin(b * (x + period)) + d;
  return (
    Math.abs(Number(item.period) - period) < 1e-8 &&
    Math.abs(Number(item.fx) - fx) < 1e-8 &&
    Math.abs(Number(item.matching) - matching) < 1e-8 &&
    Math.abs(Number(item.fx) - Number(item.matching)) < 1e-8
  );
};
const dragRange = async (name, delta) => {
  const slider = node.getByRole("slider", { name, exact: true }),
    box = await slider.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    box.x + box.width * (0.5 + delta),
    box.y + box.height / 2,
    { steps: 10 },
  );
  await page.mouse.up();
};
const checks = { initial: await state() };
await dragRange("Periodic amplitude", 0.18);
checks.amplitudeRange = await state();
await dragRange("Periodic frequency", 0.15);
checks.frequencyRange = await state();
await dragRange("Periodic midline", -0.2);
checks.midlineRange = await state();
await reload();
const probe = node.getByRole("slider", {
    name: "Drag periodic matching point",
    exact: true,
  }),
  box = await probe.boundingBox();
if (!box) throw new Error("Periodic graph probe unavailable");
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
await page.mouse.down();
await page.mouse.move(box.x - 65, box.y + box.height / 2, { steps: 12 });
await page.mouse.up();
checks.probeDrag = await state();
await probe.focus();
await probe.press("ArrowRight");
checks.probeKeyboard = await state();
const finder = node.getByRole("switch", { name: "Period Finder", exact: true });
await finder.click();
checks.finderOff = {
  state: await state(),
  count: await node.getByTestId("period-cycle-shading").count(),
};
await finder.click();
checks.finderRestored = {
  state: await state(),
  visible: await node.getByTestId("period-cycle-shading").isVisible(),
};
await node.getByRole("button", { name: /Understand/ }).click();
checks.understandTab = await state();
await node.getByRole("button", { name: /Summary/ }).click();
checks.summaryTab = await state();
await node
  .getByRole("combobox", { name: "Periodic lesson language" })
  .selectOption("es");
checks.spanish = await state();
await node.getByRole("button", { name: "Bookmark", exact: true }).click();
checks.bookmarked = await state();
await node.getByRole("button", { name: "Share", exact: true }).click();
checks.shareNotice = await node
  .getByText("Lesson link copied", { exact: true })
  .isVisible();
await node.getByText("Lesson link copied", { exact: true }).click();
checks.shareClosed = (await state()).shared === "false";
await node
  .getByRole("button", { name: "More lesson actions", exact: true })
  .click();
checks.menuOpen = (await state()).menu === "true";
await node.getByRole("button", { name: "Add to my list", exact: true }).click();
checks.menuSaved = await state();
await node
  .getByRole("button", { name: "Added to My List", exact: true })
  .click();
checks.listRemoved = (await state()).saved === "false";
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
await reload();
const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const r = document.querySelector(selector)?.getBoundingClientRect();
    return r
      ? {
          top: r.top,
          bottom: r.bottom,
          left: r.left,
          right: r.right,
          width: r.width,
          height: r.height,
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
      page: region(".per154-page"),
      intro: region(".per154-intro"),
      tabs: region(".per154-tabs"),
      workspace: region(".per154-workspace"),
      explorer: region(".per154-explorer"),
      graph: region(".per154-graph"),
      controls: region(".per154-controls"),
      concepts: region(".per154-concepts"),
      neighbors: region(".per154-neighbors"),
    },
  };
});
const passed =
  checks.initial.amplitude === "1.5" &&
  checks.initial.frequency === "2" &&
  checks.initial.midline === "0.5" &&
  Math.abs(Number(checks.initial.period) - Math.PI) < 1e-8 &&
  Math.abs(Number(checks.initial.x) - Math.PI / 4) < 1e-8 &&
  valid(checks.initial) &&
  [
    checks.amplitudeRange,
    checks.frequencyRange,
    checks.midlineRange,
    checks.probeDrag,
    checks.probeKeyboard,
    checks.understandTab,
    checks.summaryTab,
    checks.spanish,
    checks.bookmarked,
    checks.menuSaved,
    checks.reset,
  ].every(valid) &&
  checks.amplitudeRange.amplitude !== "1.5" &&
  checks.frequencyRange.frequency !== "2" &&
  checks.midlineRange.midline !== "0.5" &&
  checks.probeDrag.x !== checks.initial.x &&
  Number(checks.probeKeyboard.x) > Number(checks.probeDrag.x) &&
  checks.finderOff.state.finder === "false" &&
  checks.finderOff.count === 0 &&
  checks.finderRestored.state.finder === "true" &&
  checks.finderRestored.visible &&
  checks.understandTab.tab === "understand" &&
  checks.summaryTab.tab === "summary" &&
  checks.spanish.language === "es" &&
  checks.bookmarked.bookmarked === "true" &&
  checks.shareNotice &&
  checks.shareClosed &&
  checks.menuOpen &&
  checks.menuSaved.saved === "true" &&
  checks.listRemoved &&
  checks.reset.amplitude === "1.5" &&
  checks.reset.frequency === "2" &&
  checks.reset.midline === "0.5" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0211-desktop.png") });
await copyFile(reference, path.join(out, "0211-reference.png"));
const report = {
  mockup: "0211",
  lessonId: 154,
  route: "/lessons/graphs-and-functions/154-periodic-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0211-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);

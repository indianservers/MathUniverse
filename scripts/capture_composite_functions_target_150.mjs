import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference =
    "D:\\Math App Screenshots for UI Update\\Updated UI\\0207-interactive-intermediate-advanced-functions-composite-functions-redesigned.png",
  url =
    process.env.LESSON_URL ??
    "http://127.0.0.1:2254/lessons/graphs-and-functions/150-composite-functions";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1205, height: 1306 },
    permissions: ["clipboard-write"],
  }),
  page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0207");
await node.waitFor({ timeout: 600000 });
const attrs = [
    "x",
    "inner-shift",
    "outer-scale",
    "order",
    "inner",
    "result",
    "fog",
    "gof",
    "workspace",
  ],
  state = () =>
    node.evaluate(
      (element, names) =>
        Object.fromEntries(
          names.map((name) => [name, element.getAttribute(`data-${name}`)]),
        ),
      attrs,
    );
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
const dragHandle = async (name, dx) => {
  const handle = node.getByRole("slider", { name, exact: true }),
    box = await handle.boundingBox();
  if (!box) throw new Error(`${name} unavailable`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2 + dx, box.y + box.height / 2, {
    steps: 12,
  });
  await page.mouse.up();
  return handle;
};
const reload = async () => {
  await page.reload({ waitUntil: "domcontentloaded" });
  await node.waitFor();
};
const checks = { initial: await state() };
await dragRange("Composite input x", -0.22);
checks.inputRange = await state();
await dragRange("Composite inner shift", 0.2);
checks.shiftRange = await state();
await dragRange("Composite outer scale", 0.2);
checks.scaleRange = await state();
await reload();
const probe = await dragHandle("Drag composite input probe", -90);
checks.probeDrag = await state();
await probe.focus();
await probe.press("ArrowRight");
checks.probeKeyboard = await state();
await reload();
await node.getByRole("button", { name: "g ∘ f", exact: true }).click();
checks.gofTarget = await state();
await node.getByRole("button", { name: "f ∘ g", exact: true }).click();
checks.fogRestored = await state();
await dragRange("Composite inner shift", -0.2);
await dragRange("Composite outer scale", 0.25);
checks.transformedFog = await state();
await node.getByRole("button", { name: "g ∘ f", exact: true }).click();
checks.transformedGof = await state();
await node.getByRole("button", { name: "Workspace", exact: true }).click();
checks.workspaceOpen = (await state()).workspace === "true";
await node.getByText(/Composite workspace active/).click();
checks.workspaceClosed = (await state()).workspace === "false";
await node.getByRole("button", { name: "Share", exact: true }).click();
checks.shareNotice = await node
  .getByText("Lesson link copied", { exact: true })
  .isVisible();
await node.getByRole("button", { name: "Reset", exact: true }).click();
checks.reset = await state();
const metrics = await page.evaluate(() => {
  const region = (s) => {
    const r = document.querySelector(s)?.getBoundingClientRect();
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
      page: region(".comp150-page"),
      breadcrumb: region(".comp150-breadcrumb"),
      header: region(".comp150-header"),
      machine: region(".comp150-machine"),
      body: region(".comp150-body"),
      graph: region(".comp150-graph"),
      insights: region(".comp150-insights"),
    },
  };
});
const valid = (s) => {
  const x = Number(s.x),
    h = Number(s["inner-shift"]),
    a = Number(s["outer-scale"]),
    fog = a * (x + h) ** 2,
    gof = a * x * x + h,
    inner = s.order === "fog" ? x + h : a * x * x,
    result = s.order === "fog" ? fog : gof;
  return (
    Math.abs(Number(s.inner) - inner) < 1e-8 &&
    Math.abs(Number(s.result) - result) < 1e-8 &&
    Math.abs(Number(s.fog) - fog) < 1e-8 &&
    Math.abs(Number(s.gof) - gof) < 1e-8
  );
};
const passed =
  checks.initial.x === "2" &&
  checks.initial["inner-shift"] === "1" &&
  checks.initial["outer-scale"] === "1" &&
  checks.initial.order === "fog" &&
  checks.initial.inner === "3" &&
  checks.initial.result === "9" &&
  [
    checks.inputRange,
    checks.shiftRange,
    checks.scaleRange,
    checks.probeDrag,
    checks.probeKeyboard,
    checks.gofTarget,
    checks.fogRestored,
    checks.transformedFog,
    checks.transformedGof,
  ].every(valid) &&
  checks.inputRange.x !== checks.initial.x &&
  checks.shiftRange["inner-shift"] !== "1" &&
  checks.scaleRange["outer-scale"] !== "1" &&
  checks.probeDrag.x !== checks.initial.x &&
  Number(checks.probeKeyboard.x) > Number(checks.probeDrag.x) &&
  checks.gofTarget.order === "gof" &&
  checks.gofTarget.result === "5" &&
  checks.fogRestored.result === "9" &&
  checks.transformedFog.result !== checks.transformedGof.result &&
  checks.workspaceOpen &&
  checks.workspaceClosed &&
  checks.shareNotice &&
  checks.reset.x === checks.initial.x &&
  checks.reset.result === checks.initial.result &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0207-desktop.png") });
await copyFile(reference, path.join(out, "0207-reference.png"));
const report = {
  mockup: "0207",
  lessonId: 150,
  route: "/lessons/graphs-and-functions/150-composite-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0207-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);

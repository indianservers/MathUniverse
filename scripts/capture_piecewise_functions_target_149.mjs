import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0206-interactive-intermediate-advanced-functions-piecewise-functions-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/149-piecewise-functions";
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
const node = page.getByTestId("graph-mockup-0206");
await node.waitFor({ timeout: 600000 });
const attrs = [
  "x",
  "switch-one",
  "switch-two",
  "shift",
  "branch",
  "result",
  "visible",
  "tab",
  "workspace",
];
const state = () =>
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
await dragRange("Piecewise vertical shift", 0.22);
checks.verticalShift = await state();
await node
  .getByRole("spinbutton", {
    name: "First piecewise switch point",
    exact: true,
  })
  .fill("-1");
checks.firstInput = await state();
await node
  .getByRole("spinbutton", {
    name: "Second piecewise switch point",
    exact: true,
  })
  .fill("3");
checks.secondInput = await state();
await reload();
const probe = await dragHandle("Drag piecewise x probe", -190);
checks.probeDrag = await state();
await probe.focus();
await probe.press("ArrowRight");
checks.probeKeyboard = await state();
await reload();
const first = await dragHandle("Drag first piecewise switch point", 60);
checks.firstBoundaryDrag = await state();
await first.focus();
await first.press("ArrowLeft");
checks.firstBoundaryKeyboard = await state();
await reload();
const second = await dragHandle("Drag second piecewise switch point", 60);
checks.secondBoundaryDrag = await state();
await second.focus();
await second.press("ArrowLeft");
checks.secondBoundaryKeyboard = await state();
await reload();
await dragHandle("Drag piecewise x probe", -85);
checks.firstBoundaryOwnership = await state();
await reload();
const rightProbe = await dragHandle("Drag piecewise x probe", 42);
await rightProbe.focus();
await rightProbe.press("ArrowLeft");
checks.rightBoundaryOwnership = await state();
const branchButtons = node.locator(".piece149-controls>button");
await branchButtons.nth(0).click();
checks.leftHidden = await state();
checks.leftPathCount = await node
  .locator(".piece149-graph .left-branch")
  .count();
await branchButtons.nth(0).click();
checks.leftRestored = await state();
await node.getByRole("button", { name: "Examples", exact: true }).click();
checks.examplesTab = await state();
await node.getByRole("button", { name: /English \(English\)/ }).click();
checks.languageChanged = await node
  .getByRole("button", { name: /Hindi/ })
  .isVisible();
await node.getByRole("button", { name: "Workspace", exact: true }).click();
checks.workspaceOpen = (await state()).workspace === "true";
await node.getByText(/Piecewise workspace active/).click();
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
      page: region(".piece149-page"),
      breadcrumb: region(".piece149-breadcrumb"),
      header: region(".piece149-header"),
      tabs: region(".piece149-tabs"),
      lab: region(".piece149-lab"),
      graph: region(".piece149-graph"),
      insights: region(".piece149-insights"),
      adjacent: region(".piece149-adjacent"),
    },
  };
});
const valid = (s) => {
  const x = Number(s.x),
    a = Number(s["switch-one"]),
    b = Number(s["switch-two"]),
    k = Number(s.shift),
    branch = x < a ? "left" : x < b ? "middle" : "right",
    result =
      branch === "left" ? -x - 1 + k : branch === "middle" ? x * x + k : 3 + k;
  return (
    s.branch === branch && Math.abs(Number(s.result) - result) < 1e-8 && a < b
  );
};
const passed =
  checks.initial.x === "1.4" &&
  checks.initial.branch === "middle" &&
  Math.abs(Number(checks.initial.result) - 1.96) < 1e-9 &&
  [
    checks.verticalShift,
    checks.firstInput,
    checks.secondInput,
    checks.probeDrag,
    checks.probeKeyboard,
    checks.firstBoundaryDrag,
    checks.firstBoundaryKeyboard,
    checks.secondBoundaryDrag,
    checks.secondBoundaryKeyboard,
    checks.firstBoundaryOwnership,
    checks.rightBoundaryOwnership,
  ].every(valid) &&
  checks.verticalShift.shift !== "0" &&
  checks.firstInput["switch-one"] === "-1" &&
  checks.secondInput["switch-two"] === "3" &&
  checks.probeDrag.x !== checks.initial.x &&
  Number(checks.probeKeyboard.x) > Number(checks.probeDrag.x) &&
  checks.firstBoundaryDrag["switch-one"] !== "0" &&
  Number(checks.firstBoundaryKeyboard["switch-one"]) <
    Number(checks.firstBoundaryDrag["switch-one"]) &&
  checks.secondBoundaryDrag["switch-two"] !== "2" &&
  Number(checks.secondBoundaryKeyboard["switch-two"]) <
    Number(checks.secondBoundaryDrag["switch-two"]) &&
  checks.firstBoundaryOwnership.branch === "middle" &&
  checks.firstBoundaryOwnership.x ===
    checks.firstBoundaryOwnership["switch-one"] &&
  checks.rightBoundaryOwnership.branch === "right" &&
  checks.rightBoundaryOwnership.x ===
    checks.rightBoundaryOwnership["switch-two"] &&
  !checks.leftHidden.visible.includes("left") &&
  checks.leftPathCount === 0 &&
  checks.leftRestored.visible.includes("left") &&
  checks.examplesTab.tab === "Examples" &&
  checks.languageChanged &&
  checks.workspaceOpen &&
  checks.workspaceClosed &&
  checks.shareNotice &&
  checks.reset.x === checks.initial.x &&
  checks.reset.visible === "left,middle,right" &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0206-desktop.png") });
await copyFile(reference, path.join(out, "0206-reference.png"));
const report = {
  mockup: "0206",
  lessonId: 149,
  route: "/lessons/graphs-and-functions/149-piecewise-functions",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0206-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);

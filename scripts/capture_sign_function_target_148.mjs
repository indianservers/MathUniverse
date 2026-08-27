import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerHeight, innerWidth */
const root = process.cwd(),
  out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference =
  "D:\\Math App Screenshots for UI Update\\Updated UI\\0205-interactive-intermediate-advanced-functions-sign-function-redesigned.png";
const url =
  process.env.LESSON_URL ??
  "http://127.0.0.1:2254/lessons/graphs-and-functions/148-sign-function";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1334, height: 1179 },
  permissions: ["clipboard-write"],
});
const page = await context.newPage(),
  consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type()))
    consoleMessages.push(`${message.type()}: ${message.text()}`);
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("graph-mockup-0205");
await node.waitFor({ timeout: 600000 });
const attrs = ["x", "threshold", "scale", "result", "region", "workspace"];
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
await dragRange("Sign graph input scale", 0.25);
checks.scaleRange = await state();
await dragRange("Sign threshold shift", 0.25);
checks.thresholdRange = await state();
await reload();
const inputHandle = await dragHandle("Drag sign input cursor", 180);
checks.inputDrag = await state();
await inputHandle.focus();
await inputHandle.press("ArrowRight");
checks.inputKeyboard = await state();
await reload();
const thresholdHandle = await dragHandle("Drag sign zero threshold", 85);
checks.thresholdDrag = await state();
await thresholdHandle.focus();
await thresholdHandle.press("ArrowLeft");
checks.thresholdKeyboard = await state();
const shortcuts = node.locator(".sign148-header footer button");
await shortcuts.nth(1).click();
checks.zeroShortcut = await state();
await shortcuts.nth(0).click();
checks.negativeShortcut = await state();
await shortcuts.nth(2).click();
checks.positiveShortcut = await state();
await node.getByText("x = threshold", { exact: true }).click();
checks.zeroCase = await state();
await node.getByRole("button", { name: /English \(English\)/ }).click();
checks.languageChanged = await node
  .getByRole("button", { name: /Hindi/ })
  .isVisible();
await node.getByRole("button", { name: "Workspace", exact: true }).click();
checks.workspaceOpen = (await state()).workspace === "true";
await node.getByText(/Interactive sign workspace active/).click();
checks.workspaceClosed = (await state()).workspace === "false";
await node.getByRole("button", { name: "Share", exact: true }).click();
checks.shareNotice = await node
  .getByText("Lesson link copied", { exact: true })
  .isVisible();
await node.getByRole("button", { name: "Reset", exact: true }).click();
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
      page: region(".sign148-page"),
      breadcrumb: region(".sign148-breadcrumb"),
      header: region(".sign148-header"),
      plot: region(".sign148-plot"),
      graph: region(".sign148-graph"),
      rail: region(".sign148-rail"),
      insights: region(".sign148-insights"),
    },
  };
});
const valid = (snapshot) => {
  const x = Number(snapshot.x),
    h = Number(snapshot.threshold),
    expected = Math.abs(x - h) < 1e-9 ? 0 : x < h ? -1 : 1;
  return (
    Number(snapshot.result) === expected &&
    snapshot.region ===
      (expected < 0 ? "negative" : expected > 0 ? "positive" : "zero")
  );
};
const passed =
  checks.initial.x === "-2.4" &&
  checks.initial.threshold === "0" &&
  checks.initial.scale === "10" &&
  checks.initial.result === "-1" &&
  [
    checks.scaleRange,
    checks.thresholdRange,
    checks.inputDrag,
    checks.inputKeyboard,
    checks.thresholdDrag,
    checks.thresholdKeyboard,
    checks.zeroShortcut,
    checks.negativeShortcut,
    checks.positiveShortcut,
    checks.zeroCase,
  ].every(valid) &&
  checks.scaleRange.scale !== checks.initial.scale &&
  checks.thresholdRange.threshold !== checks.initial.threshold &&
  checks.inputDrag.x !== checks.initial.x &&
  Number(checks.inputKeyboard.x) > Number(checks.inputDrag.x) &&
  checks.thresholdDrag.threshold !== checks.initial.threshold &&
  Number(checks.thresholdKeyboard.threshold) <
    Number(checks.thresholdDrag.threshold) &&
  checks.zeroShortcut.result === "0" &&
  checks.negativeShortcut.result === "-1" &&
  checks.positiveShortcut.result === "1" &&
  checks.zeroCase.result === "0" &&
  checks.languageChanged &&
  checks.workspaceOpen &&
  checks.workspaceClosed &&
  checks.shareNotice &&
  checks.reset.x === checks.initial.x &&
  checks.reset.result === checks.initial.result &&
  !metrics.horizontalOverflow &&
  consoleMessages.length === 0;
await page.screenshot({ path: path.join(out, "0205-desktop.png") });
await copyFile(reference, path.join(out, "0205-reference.png"));
const report = {
  mockup: "0205",
  lessonId: 148,
  route: "/lessons/graphs-and-functions/148-sign-function",
  checks,
  metrics,
  consoleMessages,
  passed,
};
await writeFile(
  path.join(out, "0205-dedicated-target-validation.json"),
  `${JSON.stringify(report, null, 2)}\n`,
);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);

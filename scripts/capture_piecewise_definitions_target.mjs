import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */

const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0035-interactive-foundational-advanced-algebra-and-dynamic-variables-piecewise-definitions-redesigned.png";
const url = process.env.LESSON_URL ?? "http://localhost:2245/lessons/core-workspaces/35-piecewise-definitions";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1217, height: 1292 } });
const consoleMessages = [];
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`);
});

await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const node = page.getByTestId("algebra-mockup-0035");
await node.waitFor({ timeout: 180000 });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-x", "data-value", "data-branch", "data-left-active", "data-workspace", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));

const checks = { initial: await state() };
await page.getByLabel("Piecewise x value").fill("-2");
checks.negative = await state();
await page.getByRole("button", { name: "Decrease x" }).click();
checks.decreased = await state();
await page.locator(".select-branch button").nth(1).click();
checks.rightBranch = await state();
await page.getByLabel("Piecewise x value").fill("0");
checks.boundary = await state();
await page.locator(".piecewise-graph").click({ position: { x: 114, y: 180 } });
checks.graphProbe = await state();
await page.getByLabel("Lesson language").click();
checks.language = await page.getByLabel("Lesson language").textContent();
await node.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await state();
await node.getByRole("button", { name: /Share/ }).click();
await page.waitForTimeout(100);
checks.share = await state();
await node.getByRole("button", { name: "Reset" }).click();
checks.reset = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight },
    document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight },
    horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    surface: region(".piecewise-page"),
    regions: {
      shell: region(".piecewise-shell"), header: region(".piecewise-header"), layout: region(".piecewise-layout"),
      graph: region(".piecewise-graph-card"), boundaries: region(".boundary-card"), side: region(".piecewise-side"),
      navigation: region(".piecewise-navigation"), footer: region(".piecewise-footer"),
    },
  };
});

const passed = checks.initial.x === "1" && checks.initial.value === "2" && checks.initial.branch === "right" &&
  checks.negative.x === "-2" && checks.negative.value === "1" && checks.negative.branch === "left" &&
  checks.decreased.x === "-3" && checks.decreased.value === "0" &&
  checks.rightBranch.x === "1" && checks.rightBranch.value === "2" &&
  checks.boundary.x === "0" && checks.boundary.value === "0" && checks.boundary.branch === "right" &&
  checks.graphProbe.x === "-4" && checks.graphProbe.value === "-1" && checks.graphProbe.branch === "left" &&
  checks.language?.includes("Hindi") && checks.workspace.workspace === "true" && Number(checks.share.actions) >= 8 &&
  checks.reset.x === "1" && checks.reset.value === "2" && checks.reset.workspace === "false" &&
  !metrics.horizontalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0035-desktop.png") });
await copyFile(reference, path.join(out, "0035-reference.png"));
const report = {
  mockup: "0035", lessonId: 35, route: "/lessons/core-workspaces/35-piecewise-definitions",
  objectModel: "two-branch-piecewise-condition-endpoint-inclusion-evaluation-draggable-graph-probe-boundary-check-model",
  checks, metrics, consoleMessages, passed,
};
await writeFile(path.join(out, "0035-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await browser.close();
process.exit(passed ? 0 : 1);

/* global document, innerWidth, scrollTo */
import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";
const root = process.cwd(), evidence = path.join(root, "test-evidence", "lesson-ui-upgrade"),
  reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0532-interactive-advanced-matrices-and-linear-algebra-matrix-builder-redesigned.png",
  url = process.env.LESSON_URL ?? "http://127.0.0.1:2256/lessons/advanced-mathematics/347-matrix-builder";
const browser = await chromium.launch({ headless: true }), page = await browser.newPage({ viewport: { width: 864, height: 1821 } }), consoleMessages = [];
page.setDefaultTimeout(15000);
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) consoleMessages.push(`${m.type()}: ${m.text()}`); });
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 180000 });
const lesson = page.getByTestId("matrix-mockup-0532"); await lesson.waitFor({ timeout: 600000 });
const keys = ["matrix", "rows", "cols", "selected", "valid", "tab", "quick-order", "quick-entry", "actions"];
const state = () => lesson.evaluate((n, a) => Object.fromEntries(a.map((k) => [k, n.getAttribute(`data-${k}`)])), keys);
const checks = { initial: await state() };
await lesson.getByLabel("Row 1 column 1").fill("9"); checks.edit = await state();
await lesson.getByRole("button", { name: "Transpose (T)" }).click(); checks.transpose = await state();
await lesson.getByRole("button", { name: "Augment with" }).click(); checks.augment = await state();
await lesson.getByRole("button", { name: "Fill Identity" }).click(); checks.identity = await state();
await lesson.getByRole("button", { name: "Decrease rows" }).click(); checks.resize = await state();
await lesson.getByRole("button", { name: "Reset Lab" }).click();
const cell = lesson.locator('[data-drag="matrix-cell-0-0"]'), box = await cell.boundingBox();
if (!box) throw Error("Matrix drag cell missing");
await page.mouse.move(box.x + 3, box.y + 3); await page.mouse.down(); await page.mouse.move(box.x + 3, box.y - 25, { steps: 5 }); await page.mouse.up(); checks.drag = await state();
await lesson.getByRole("button", { name: "3 x 2", exact: true }).click(); checks.rejected = await state();
await lesson.getByRole("button", { name: "2 x 3", exact: true }).click();
await lesson.getByRole("button", { name: "Visualizations", exact: true }).click(); checks.accepted = await state();
await page.getByTitle("Reset lesson progress").dispatchEvent("click"); await page.waitForFunction(() => document.querySelector('[data-testid="matrix-mockup-0532"]')?.getAttribute("data-actions") === "0"); checks.shellReset = await state();
await page.evaluate(() => { scrollTo(0, 0); document.querySelectorAll("*").forEach((n) => { if (n.scrollLeft) n.scrollLeft = 0; }); });
const rect = async (s) => { const b = await page.locator(s).first().boundingBox(); return b ? { top: Math.round(b.y), left: Math.round(b.x), width: Math.round(b.width), height: Math.round(b.height), bottom: Math.round(b.y + b.height) } : null; };
const metrics = { document: await page.evaluate(() => ({ width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight })), overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), hero: await rect(".mat347-hero"), tabs: await rect(".mat347-tabs"), builder: await rect(".mat347-builder"), notes: await rect(".mat347-notes"), check: await rect(".mat347-check"), adjacent: await rect(".lesson-adjacent-nav"), footer: await rect('footer[aria-label="Site footer"]') };
const passed = checks.initial.matrix === "[[2,-1,3],[4,0,5]]" && checks.edit.matrix === "[[9,-1,3],[4,0,5]]" && checks.transpose.matrix === "[[9,4],[-1,0],[3,5]]" && checks.augment.matrix === "[[9,4,7],[-1,0,-2],[3,5,0]]" && checks.identity.matrix === "[[1,0,0],[0,1,0],[0,0,1]]" && checks.resize.rows === "2" && checks.drag.matrix !== checks.initial.matrix && checks.rejected["quick-order"] === "incorrect" && checks.accepted["quick-order"] === "correct" && checks.accepted.tab === "Visualizations" && checks.shellReset.actions === "0" && metrics.document.height === 1821 && !metrics.overflow && consoleMessages.length === 0;
await page.screenshot({ path: path.join(evidence, "0532-desktop.png"), fullPage: true }); await copyFile(reference, path.join(evidence, "0532-reference.png"));
await writeFile(path.join(evidence, "0532-dedicated-target-validation.json"), JSON.stringify({ mockup: "0532", lessonId: 347, checks, metrics, consoleMessages, passed }, null, 2));
await browser.close(); if (!passed) process.exitCode = 1;

import { chromium } from "playwright";
import { copyFile, writeFile } from "node:fs/promises";
import path from "node:path";

/* global document, innerWidth, innerHeight */
const root = process.cwd();
const out = path.join(root, "test-evidence", "lesson-ui-upgrade");
const reference = "D:\\Math App Screenshots for UI Update\\Updated UI\\0073-interactive-foundational-intermediate-fractions-decimals-ratios-and-percentages-scale-drawings-redesigned.png";
const url = process.env.LESSON_URL ?? "http://127.0.0.1:2250/lessons/numbers-and-arithmetic/91-scale-drawings";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1074, height: 1464 }, permissions: ["clipboard-read", "clipboard-write"] });
const page = await context.newPage();
const consoleMessages = [];
page.on("console", (message) => { if (["error", "warning"].includes(message.type())) consoleMessages.push(`${message.type()}: ${message.text()}`); });
await page.goto(url, { waitUntil: "commit", timeout: 180000 });
const node = page.getByTestId("number-mockup-0073");
await node.waitFor({ timeout: 600000 });
await page.waitForFunction(() => { const image = document.querySelector('.scale91-map img'); return image?.complete && image.naturalWidth > 0; });
const state = () => node.evaluate((element) => Object.fromEntries([
  "data-map-length", "data-scale", "data-real-length", "data-point-a", "data-point-b", "data-tab", "data-share-state", "data-workspace-state", "data-dragging", "data-actions",
].map((name) => [name.replace("data-", ""), element.getAttribute(name)])));
const checks = { initial: await state() };

await page.getByRole("spinbutton", { name: "Scale kilometers per centimeter" }).fill("10");
checks.scaleEdited = await state();
await page.getByLabel("Scale ruler 2 cm", { exact: true }).click();
checks.ruler = await state();
await node.getByRole("button", { name: "Reset" }).click();
const actionsBeforeDrag = Number((await state()).actions);
await page.getByRole("button", { name: "Route point A" }).dragTo(page.getByRole("button", { name: "Route point B" }));
checks.dragged = await state();
checks.dragRecorded = Number(checks.dragged.actions) > actionsBeforeDrag;
await node.getByRole("button", { name: "Reset" }).click();
await page.getByLabel("Real distance 10 kilometers", { exact: true }).click();
checks.distance = await state();
await node.getByRole("button", { name: /Explain/ }).click();
checks.explain = await state();
await node.getByRole("button", { name: "Share" }).click();
await page.waitForFunction(() => document.querySelector('[data-testid="number-mockup-0073"]')?.getAttribute("data-share-state") !== "Share");
checks.share = await state();
await node.getByRole("button", { name: "Workspace" }).click();
checks.workspace = await state();
await page.reload({ waitUntil: "commit" });
await node.waitFor();
checks.restored = await state();

const metrics = await page.evaluate(() => {
  const region = (selector) => {
    const rect = document.querySelector(selector)?.getBoundingClientRect();
    return rect ? { top: rect.top, bottom: rect.bottom, height: rect.height, left: rect.left, right: rect.right, width: rect.width } : null;
  };
  return {
    viewport: { width: innerWidth, height: innerHeight }, document: { width: document.documentElement.scrollWidth, height: document.documentElement.scrollHeight }, horizontalOverflow: document.documentElement.scrollWidth > innerWidth, verticalOverflow: document.documentElement.scrollHeight > innerHeight,
    surface: region(".scale91-page"), regions: { header: region(".scale91-header"), tabs: region(".scale91-tabs"), workspace: region(".scale91-workspace"), info: region(".scale91-info"), map: region(".scale91-map"), center: region(".scale91-center"), ruler: region(".scale91-ruler"), calculation: region(".scale91-calc"), distance: region(".scale91-distance"), key: region(".scale91-key"), caption: region(".scale91-caption"), tags: region(".scale91-tags"), navigation: region(".scale91-navigation"), footer: region(".scale91-footer") },
  };
});
const passed =
  checks.initial["map-length"] === "4" && checks.initial.scale === "5" && checks.initial["real-length"] === "20" && checks.initial["point-a"] === "80,12" && checks.initial["point-b"] === "14,71" &&
  checks.scaleEdited.scale === "10" && checks.scaleEdited["real-length"] === "40" &&
  checks.ruler["map-length"] === "2" && checks.ruler.scale === "10" && checks.ruler["real-length"] === "20" &&
  checks.dragged["map-length"] === "1.5" && checks.dragged["real-length"] === "7.5" && checks.dragRecorded &&
  checks.distance["map-length"] === "2" && checks.distance["real-length"] === "10" &&
  checks.explain.tab === "Explain" && checks.share["share-state"] !== "Share" && checks.workspace["workspace-state"] === "open" &&
  checks.restored["map-length"] === "4" && checks.restored.scale === "5" && checks.restored["real-length"] === "20" && checks.restored.tab === "Interaction + visualization" &&
  !metrics.horizontalOverflow && !metrics.verticalOverflow && consoleMessages.length === 0;

await page.screenshot({ path: path.join(out, "0073-desktop.png") });
await copyFile(reference, path.join(out, "0073-reference.png"));
const report = { mockup: "0073", lessonId: 91, route: "/lessons/numbers-and-arithmetic/91-scale-drawings", objectModel: "editable-map-length-scale-draggable-route-endpoints-ruler-calculation-real-distance-key-information-model", asset: "public/assets/lessons/scale-drawings-city-map.png", checks, metrics, consoleMessages, passed };
await writeFile(path.join(out, "0073-dedicated-target-validation.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
await Promise.race([browser.close().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 3000))]);
process.exit(passed ? 0 : 1);

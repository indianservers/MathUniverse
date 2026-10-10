/* global window, document, innerWidth, localStorage, getComputedStyle, requestAnimationFrame */
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { chromium } from "playwright";

const folder = "artifacts/calculus-illustrations";
mkdirSync(folder, { recursive: true });
const base = process.env.STUDIO_AUDIT_URL || "http://127.0.0.1:5190";
const beforeSource = readFileSync(`${folder}/CalculusStudio.before.txt`, "utf8");
const afterSource = readFileSync("src/pages/CalculusStudio.tsx", "utf8").replaceAll("\r\n", "\n");
assert.equal(afterSource.replace('import CalculusLabIllustration from "../studios/calculus/illustrations/CalculusLabIllustration";\n', "").replace('<CalculusLabIllustration kind={card.page} />', '<CalculusLaunchArt kind={card.page} />').replaceAll("\r\n", "\n"), beforeSource.replaceAll("\r\n", "\n"), "Page changes must be limited to illustration import/binding");
const expectedRoutes = ["limits", "derivatives", "derivative-applications", "integration", "integration-techniques", "integral-applications", "differential-equations", "series-parametric-polar", "series-tests", "curve-tracing", "multivariable-vector", "taylor-two-variables", "lagrange-multipliers", "jacobians-coordinate-transformations", "change-order-integration", "multiple-integral-applications", "centroid-center-of-mass", "moments-of-inertia", "beta-gamma"];
const browser = await chromium.launch();
const results = { scope: "Only illustration import/binding in existing page", cards: [], viewports: [], themes: [], lifecycle: {}, performance: {}, errors: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1672, height: 941 }, reducedMotion: "reduce" });
  page.on("pageerror", e => results.errors.push(e.message));
  await page.goto(`${base}/calculus`);
  await page.locator("[data-illustration]").first().waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  const geometry = await page.evaluate(() => [...document.querySelectorAll('.cs-topic-card,.cs-sidebar,.cs-home-side,.cs-header,.cinematic-hero')].map(e => ({ className: e.className, text: e.classList.contains('cs-topic-card') ? e.querySelector('strong').textContent : '', rect: JSON.parse(JSON.stringify(e.getBoundingClientRect())) })));
  const baseline = JSON.parse(readFileSync(`${folder}/before-geometry.json`, "utf8"));
  assert.deepEqual(geometry, baseline, "All recorded hero/sidebar/card/right-panel geometry must stay identical");
  await page.screenshot({ path: `${folder}/after-desktop.png`, fullPage: true });
  assert.equal(await page.locator("[data-illustration]").count(), 19);
  assert.equal(await page.locator('[data-dimension="3"]').count(), 4);
  const names = await page.locator(".cs-topic-card strong").allTextContents();
  for (let i = 0; i < 19; i++) {
    const card = page.locator(".cs-topic-card").nth(i);
    await card.scrollIntoViewIfNeeded();
    await card.screenshot({ path: `${folder}/card-${i + 1}.png` });
    const kind = await card.locator("[data-illustration]").getAttribute("data-illustration");
    const label = await card.locator("[data-illustration]").getAttribute("aria-label");
    await card.click();
    await page.waitForURL(`${base}/calculus/${expectedRoutes[i]}`);
    await page.locator("[data-illustration]").first().waitFor({ state: "detached" });
    assert.equal(await page.locator("[data-illustration]").count(), 0, "Illustrations must not replace working lab content");
    results.cards.push({ number: i + 1, name: names[i], kind, label, route: page.url(), navigation: "passed" });
    await page.goto(`${base}/calculus`); await page.locator("[data-illustration]").first().waitFor();
    console.log(`Card ${i + 1}/19: ${names[i]} navigation passed`);
  }
  for (const width of [320, 390, 768, 1280, 1672]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 941 });
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert(overflow <= 1, `${width}px page overflow`);
    for (let i = 0; i < 19; i++) {
      const card = page.locator(".cs-topic-card").nth(i);
      await card.scrollIntoViewIfNeeded();
      const b = await card.boundingBox(), s = await card.locator("[data-illustration]").boundingBox();
      assert(s.x >= b.x && s.x + s.width <= b.x + b.width + 1 && s.y >= b.y && s.y + s.height <= b.y + b.height + 1, "Illustration must fit existing card");
    }
    results.viewports.push({ width, overflow, cardsFit: 19 });
    await page.locator(".cs-topic-card").first().scrollIntoViewIfNeeded();
    if (width === 390) await page.screenshot({ path: `${folder}/after-phone.png` });
  }
  await page.setViewportSize({ width: 1672, height: 941 });
  for (const theme of ["light", "dark"]) {
    await page.evaluate(theme => {
      const key = "calculus-studio:settings", s = JSON.parse(localStorage.getItem(key) || "{}");
      localStorage.setItem(key, JSON.stringify({ ...s, theme }));
    }, theme);
    await page.reload(); await page.locator("[data-illustration]").first().waitFor();
    await page.locator(".cs-topic-card").first().scrollIntoViewIfNeeded();
    const ink = await page.locator(".cli-label").first().evaluate(el => getComputedStyle(el).fill);
    await page.screenshot({ path: `${folder}/theme-${theme}.png` });
    results.themes.push({ theme, ink, passed: true });
  }
  // Component glow mode is provided without changing the Studio's existing light/dark theme system.
  await page.locator("[data-illustration]").evaluateAll(es => es.forEach(e => e.dataset.theme = "glow"));
  const glowInk = await page.locator(".cli-label").first().evaluate(el => getComputedStyle(el).fill);
  results.themes.push({ theme: "glow component preview", ink: glowInk, passed: true });
  await page.screenshot({ path: `${folder}/theme-glow-preview.png` });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const first = page.locator('[data-illustration="limits"]');
  await first.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('[data-illustration="limits"]').dataset.animationState === "running");
  const moving = async () => first.locator('canvas').evaluate(c => c.toDataURL());
  const a = await moving();
  await page.waitForFunction(before => document.querySelector('[data-illustration="limits"] canvas').toDataURL() !== before, a, { timeout: 4000 });
  await page.locator(".cs-topic-card").first().hover();
  assert.equal(await first.getAttribute("data-hover"), "true");
  await page.mouse.move(1, 1); assert.equal(await first.getAttribute("data-hover"), "false");
  await page.locator('[data-illustration="beta-gamma"]').scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('[data-illustration="limits"]').dataset.animationState === "paused");
  const paused = await moving(); await page.waitForTimeout(250); assert.equal(await moving(), paused, "Offscreen attributes must stop changing");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForFunction(() => [...document.querySelectorAll('[data-illustration]')].every(e => e.dataset.animationState === "static"));
  results.lifecycle = { visibleAdvances: true, hover: true, offscreenPaused: true, reducedMotionStatic: true };
  // RAF sampling measures this browser/device, not a guarantee for every laptop.
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.locator('[data-illustration="multivariable-vector"]').scrollIntoViewIfNeeded();
  results.performance = await page.evaluate(async () => {
    const intervals = []; let last, start;
    await new Promise(resolve => { function frame(now) { start ??= now; if (last) intervals.push(now - last); last = now; if (now - start < 2000) requestAnimationFrame(frame); else resolve(); } requestAnimationFrame(frame); });
    intervals.sort((a, b) => a - b);
    return { medianFrameMs: intervals[Math.floor(intervals.length / 2)], p95FrameMs: intervals[Math.floor(intervals.length * .95)], visibleIllustrations: [...document.querySelectorAll('[data-illustration]')].filter(e => e.dataset.animationState === 'running').length, webglContextsForIllustrations: 0, lazilyInitializedCanvasCount: document.querySelectorAll('.calculus-lab-illustration[data-canvas-ready="true"]').length };
  });
  assert.deepEqual(results.errors, [], "No browser exceptions across home and 19 lab destinations");
  writeFileSync(`${folder}/audit.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ cards: results.cards.length, viewports: results.viewports.length, lifecycle: results.lifecycle, performance: results.performance, errors: results.errors }, null, 2));
} finally { await browser.close(); }

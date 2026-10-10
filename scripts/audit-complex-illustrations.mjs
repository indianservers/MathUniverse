/* global document, window, scrollY, innerWidth, NodeFilter */
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";
const dir = "artifacts/complex-illustrations", base = process.env.STUDIO_AUDIT_URL || "http://127.0.0.1:5190";
const before = readFileSync(`${dir}/ComplexNumbersStudio.before.txt`, "utf8").replaceAll("\r\n", "\n");
const after = readFileSync("src/pages/ComplexNumbersStudio.tsx", "utf8").replaceAll("\r\n", "\n");
assert.equal(after.replace('import ComplexLabIllustration from "../studios/complex/illustrations/ComplexLabIllustration";\n', "").replace('                      <ComplexLabIllustration kind={item.id} />\n', ""), before, "Only illustration import/binding may change");
const browser = await chromium.launch(), report = { scope: true, geometry: false, cards: [], viewports: [], lifecycle: {}, errors: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1672, height: 941 }, reducedMotion: "reduce" });
  page.on("pageerror", e => report.errors.push(e.message));
  await page.goto(`${base}/complex-numbers`); await page.locator('[data-fitted="true"]').first().waitFor();
  await page.evaluate(() => window.scrollTo(0, 0));
  const geometry = await page.evaluate(() => [...document.querySelectorAll('.cxs-topic-card,.cxs-sidebar,.cinematic-hero,.cxs-header,.cxs-home-aside,.cxs-learning-strip,.cxs-concept-map,.cxs-map-overflow,.cxs-flow,.cxs-topic-card b,.cxs-topic-card p,.cxs-topic-card em,.cxs-topic-card nav')].map(e => {
    const clone = e.cloneNode(true); clone.querySelectorAll('.complex-card-illustration').forEach(n => n.remove());
    return { selector: e.className, text: clone.textContent, box: { x: e.getBoundingClientRect().x, y: e.getBoundingClientRect().y + scrollY, width: e.getBoundingClientRect().width, height: e.getBoundingClientRect().height } };
  }));
  assert.deepEqual(geometry, JSON.parse(readFileSync(`${dir}/before.json`, "utf8")), "Hero, chrome, cards, text, right rail and bottom geometry must match baseline"); report.geometry = true;
  await page.screenshot({ path: `${dir}/after.png`, fullPage: true });
  assert.equal(await page.locator("[data-complex-illustration]").count(), 9);
  const destinations = await page.locator('.cxs-topic-card > .msk-card-hit').evaluateAll(es => es.map(e => ({ route: e.getAttribute('href'), name: e.getAttribute('aria-label') })));
  for (let i = 0; i < 9; i++) {
    const card = page.locator('.cxs-topic-card').nth(i); await card.scrollIntoViewIfNeeded();
    if (i === 7) await page.waitForFunction(() => document.querySelector('[data-complex-illustration="fractals"]').dataset.canvasReady === 'true');
    await card.screenshot({ path: `${dir}/card-${i + 1}.png` });
    await card.locator(':scope > a:not(.msk-card-hit)').click({ position: { x: 8, y: 8 } }); await page.waitForURL(base + destinations[i].route);
    await page.locator('[data-complex-illustration]').first().waitFor({ state: 'detached' });
    report.cards.push({ ...destinations[i], navigation: true });
    await page.goto(`${base}/complex-numbers`); await page.locator('[data-fitted="true"]').first().waitFor();
    console.log(`Card ${i + 1}/9 navigation passed`);
  }
  for (const width of [320, 390, 768, 1280, 1672]) {
    await page.setViewportSize({ width, height: width < 768 ? 844 : 941 });
    await page.waitForTimeout(150);
    const checks = [];
    for (let i = 0; i < 9; i++) {
      const card = page.locator('.cxs-topic-card').nth(i); await card.scrollIntoViewIfNeeded();
      const fit = await card.evaluate(card => {
        const el = card.querySelector('.complex-card-illustration'), r = el.getBoundingClientRect(), c = card.getBoundingClientRect(), overlaps = [];
        const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT); let node;
        while ((node = walker.nextNode())) {
          if (!node.textContent.trim() || el.contains(node)) continue;
          const range = document.createRange(); range.selectNodeContents(node);
          for (const t of range.getClientRects()) if (r.left < t.right && r.right > t.left && r.top < t.bottom && r.bottom > t.top) overlaps.push(node.textContent);
        }
        return { kind: el.dataset.complexIllustration, width: r.width, height: r.height, inside: r.left >= c.left && r.right <= c.right + 1 && r.top >= c.top && r.bottom <= c.bottom + 1, overlaps };
      });
      assert(fit.inside && fit.width >= 18 && fit.height >= 18, `${width}px ${fit.kind} must fit`);
      assert.deepEqual(fit.overlaps, [], `${width}px ${fit.kind} must not cover text`); checks.push(fit);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth); assert(overflow <= 1);
    report.viewports.push({ width, checks, overflow });
    if (width === 390) { await page.locator('.cxs-topic-card').first().scrollIntoViewIfNeeded(); await page.screenshot({ path: `${dir}/phone.png` }); }
  }
  await page.setViewportSize({ width: 1672, height: 941 }); await page.emulateMedia({ reducedMotion: "no-preference" });
  const first = page.locator('[data-complex-illustration="argand-plane"]'); await first.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('[data-complex-illustration="argand-plane"]').dataset.animationState === 'running');
  const pixels = async () => first.locator('canvas').evaluate(c => c.toDataURL());
  const original = await pixels(); await page.waitForTimeout(300); assert.notEqual(await pixels(), original);
  await page.locator('.cxs-topic-card').first().hover(); assert.equal(await first.getAttribute('data-hover'), 'true');
  await page.mouse.move(1, 1); assert.equal(await first.getAttribute('data-hover'), 'false');
  await page.setViewportSize({ width: 1672, height: 300 });
  await page.locator('.cxs-topic-card').last().scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector('[data-complex-illustration="argand-plane"]').dataset.animationState === 'paused');
  const paused = await pixels(); await page.waitForTimeout(300); assert.equal(await pixels(), paused);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForFunction(() => [...document.querySelectorAll('[data-complex-illustration]')].every(e => e.dataset.animationState === 'static'));
  report.lifecycle = { visibleAdvances: true, hover: true, offscreenPaused: true, reducedMotionStatic: true };
  assert.deepEqual(report.errors, []); writeFileSync(`${dir}/audit.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ cards: 9, viewports: 5, geometry: report.geometry, lifecycle: report.lifecycle, errors: report.errors }, null, 2));
} finally { await browser.close(); }

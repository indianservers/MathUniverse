/* global document, requestAnimationFrame */
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
const base = process.env.STUDIO_AUDIT_URL || "http://127.0.0.1:5190";
const browser = await chromium.launch();
const measurements = [];
try {
  for (const mode of ["baseline", "upgraded"]) {
    const page = await browser.newPage({ viewport: { width: 1672, height: 941 }, reducedMotion: "no-preference" });
    if (mode === "baseline") await page.route("**/src/pages/CalculusStudio.tsx*", async route => {
      const response = await route.fetch();
      const body = await response.text();
      // Restore ONLY the old illustration child in the browser response; workspace untouched.
      const old = body.replaceAll("jsxDEV(CalculusLabIllustration,", "jsxDEV(CalculusLaunchArt,");
      assert.notEqual(old, body);
      await route.fulfill({ response, body: old });
    });
    await page.goto(`${base}/calculus`);
    await page.locator(".cs-topic-card").nth(10).scrollIntoViewIfNeeded();
    await page.mouse.move(1, 1);
    await page.waitForTimeout(1000);
    const session = process.env.PROFILE && mode === "upgraded" ? await page.context().newCDPSession(page) : null;
    if (session) { await session.send("Profiler.enable"); await session.send("Profiler.start"); }
    const result = await page.evaluate(async () => {
      const gaps = [], longTasks = [];
      const observer = new PerformanceObserver(list => list.getEntries().forEach(e => longTasks.push(e.duration)));
      observer.observe({ type: "longtask", buffered: false });
      let last, start;
      await new Promise(resolve => { function frame(now) { start ??= now; if (last) gaps.push(now - last); last = now; if (now - start < 4000) requestAnimationFrame(frame); else resolve(); } requestAnimationFrame(frame); });
      observer.disconnect(); gaps.sort((a, b) => a - b);
      return { medianFrameMs: gaps[Math.floor(gaps.length / 2)], p95FrameMs: gaps[Math.floor(gaps.length * .95)], approximateFPS: 1000 / (gaps.reduce((s, t) => s + t, 0) / gaps.length), longTasks: longTasks.length, longestTaskMs: Math.max(0, ...longTasks), activeIllustrations: [...document.querySelectorAll('[data-illustration]')].filter(e => e.dataset.animationState === 'running').length };
    });
    measurements.push({ mode, ...result });
    if (session) {
      const { profile } = await session.send("Profiler.stop");
      const hottest = profile.nodes.filter(n => n.hitCount).sort((a, b) => b.hitCount - a.hitCount).slice(0, 20).map(n => ({ name: n.callFrame.functionName, url: n.callFrame.url, hits: n.hitCount }));
      writeFileSync("artifacts/calculus-illustrations/profile.json", JSON.stringify(hottest, null, 2));
    }
    await page.close();
  }
  writeFileSync("artifacts/calculus-illustrations/performance.json", JSON.stringify(measurements, null, 2));
  console.log(JSON.stringify(measurements, null, 2));
} finally { await browser.close(); }

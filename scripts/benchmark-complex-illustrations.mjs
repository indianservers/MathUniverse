/* global document, requestAnimationFrame */
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";
const base = process.env.STUDIO_AUDIT_URL || "http://127.0.0.1:5190", browser = await chromium.launch(), results = [];
try {
  for (const mode of ["baseline", "upgraded"]) {
    const page = await browser.newPage({ viewport: { width: 1672, height: 941 }, reducedMotion: "no-preference" });
    if (mode === "baseline") await page.route('**/src/studios/complex/illustrations/ComplexLabIllustration.tsx*', async route => {
      const response = await route.fetch(); await route.fulfill({ response, body: 'export default function ComplexLabIllustration(){return null;}' });
    });
    await page.goto(base + '/complex-numbers'); await page.locator('.cxs-topic-grid').evaluate(el => el.scrollIntoView({ block: 'start' })); await page.mouse.move(1, 1); await page.waitForTimeout(1200);
    const result = await page.evaluate(async () => {
      const intervals = [], long = [];
      const observer = new PerformanceObserver(list => list.getEntries().forEach(e => long.push(e.duration))); observer.observe({ type: 'longtask', buffered: false });
      let start, last;
      await new Promise(resolve => { function frame(now) { start ??= now; if (last) intervals.push(now - last); last = now; if (now - start < 4000) requestAnimationFrame(frame); else resolve(); } requestAnimationFrame(frame); }); observer.disconnect(); intervals.sort((a, b) => a - b);
      return { fps: 1000 / (intervals.reduce((s, t) => s + t, 0) / intervals.length), medianFrameMs: intervals[Math.floor(intervals.length / 2)], p95FrameMs: intervals[Math.floor(intervals.length * .95)], longTasks: long.length, longestTaskMs: Math.max(0, ...long), active: [...document.querySelectorAll('[data-complex-illustration]')].filter(e => e.dataset.animationState === 'running').length };
    });
    results.push({ mode, ...result }); await page.close();
  }
  writeFileSync('artifacts/complex-illustrations/performance.json', JSON.stringify(results, null, 2)); console.log(JSON.stringify(results, null, 2));
} finally { await browser.close(); }

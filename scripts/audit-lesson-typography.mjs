/* global document, window, getComputedStyle, Node */
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const data = JSON.parse(fs.readFileSync('tmp/lesson-audit-data.json', 'utf8'));
const lessons = ['core', 'school', 'advanced'].flatMap(catalog => data[catalog].map(lesson => ({ ...lesson, catalog })));
const base = process.env.LESSON_AUDIT_URL || 'http://127.0.0.1:5191';
const output = 'artifacts/lesson-typography';
fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const results = [];
let cursor = 0;
const workers = Number(process.env.LESSON_AUDIT_WORKERS || 2);
const only = process.env.LESSON_AUDIT_ROUTES?.split(',');
const targets = only ? lessons.filter(lesson => only.includes(lesson.route)) : lessons;

async function inspect(page, lesson, width) {
  await page.setViewportSize({ width, height: 900 });
  await page.evaluate(() => new Promise(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve))));
  return page.evaluate(() => {
    const root = document.querySelector('[data-lesson-typography]');
    const textElements = [...root.querySelectorAll('*')].filter(element =>
      !element.closest('script, style, .katex-mathml, [aria-hidden="true"]') &&
      ([...element.childNodes].some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim()) ||
        element.matches('input, textarea, select')));
    const small = textElements.map(element => ({
      tag: element.tagName,
      className: element.getAttribute('class'),
      text: (element.textContent || element.getAttribute('placeholder') || '').trim().slice(0, 85),
      size: parseFloat(getComputedStyle(element).fontSize),
      style: element.getAttribute('style'),
      fontAttribute: element.getAttribute('font-size'),
    })).filter(item => item.size > 0 && item.size < 11.99);
    const visible = textElements.filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== 'hidden');
    return {
      width: window.innerWidth,
      textElements: textElements.length,
      small,
      overflow: visible.filter(element => {
        if (element.closest('nav, .katex-mathml')) return false;
        for (let ancestor = element.parentElement; ancestor && ancestor !== root; ancestor = ancestor.parentElement) {
          if (/(auto|scroll)/.test(getComputedStyle(ancestor).overflowX)) return false;
        }
        return element.getBoundingClientRect().right > window.innerWidth + 2;
      }).slice(0, 12).map(element => ({ className: element.getAttribute('class'), text: element.textContent.trim().slice(0, 60) })),
    };
  });
}

async function worker() {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(base + targets[0].route, { waitUntil: 'domcontentloaded', timeout: 120000 });
  while (cursor < targets.length) {
    const lesson = targets[cursor++];
    try {
      await page.evaluate(route => { window.history.pushState({}, '', route); window.dispatchEvent(new PopStateEvent('popstate')); }, lesson.route);
      await page.waitForFunction(route => {
        const root = document.querySelector('[data-lesson-typography]');
        return window.location.pathname === route && root?.getAttribute('data-lesson-typography') === route && root.querySelector('h1') &&
          !root.querySelector('[aria-label*="Loading"], .animate-spin');
      }, lesson.route, { timeout: 60000 });
      // Lazy lesson imports and tab-specific styles settle before measuring.
      await page.waitForTimeout(120);
      const checks = [];
      for (const width of [390, 1280]) checks.push(await inspect(page, lesson, width));
      results.push({ route: lesson.route, title: lesson.title, catalog: lesson.catalog, checks });
    } catch (error) {
      results.push({ route: lesson.route, title: lesson.title, error: String(error) });
    }
    if (results.length % 25 === 0 || results.length === targets.length) {
      fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify(results, null, 2));
      console.log(JSON.stringify({ completed: results.length, total: targets.length, small: results.filter(result => result.checks?.some(check => check.small.length)).length, errors: results.filter(result => result.error).length }));
    }
  }
  await page.close();
}

try { await Promise.all(Array.from({ length: workers }, () => worker())); }
finally { await browser.close(); }
const summary = {
  lessons: results.length,
  checks: results.reduce((sum, result) => sum + (result.checks?.length || 0), 0),
  undersized: results.filter(result => result.checks?.some(check => check.small.length)).map(result => result.route),
  errors: results.filter(result => result.error),
  overflow: results.filter(result => result.checks?.some(check => check.overflow.length)).map(result => result.route),
};
fs.writeFileSync(path.join(output, 'checks.json'), JSON.stringify(results, null, 2));
fs.writeFileSync(path.join(output, 'summary.json'), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary));
assert.equal(summary.lessons, targets.length);
assert.equal(summary.errors.length, 0, 'Every lesson must load');
assert.equal(summary.undersized.length, 0, 'Every lesson must meet the 12px floor');

import assert from 'node:assert/strict';
import { test } from 'node:test';
import postcss from 'postcss';
import lessonFontFloor from './lesson-font-floor.mjs';

test('scoped typography preserves cascade, shorthand, important rules and breakpoints', async () => {
  const input = '.page{font:9px/1.5 Arial}.page small{font-size:8px!important}.page h1{font-size:32px}@media(max-width:600px){.page h1{font-size:24px}}.page::before{font-size:.5em}.hidden{font-size:0}@keyframes fade{0%{font-size:10px}}';
  const result = await postcss([lessonFontFloor()]).process(input, { from: undefined });
  const rules = [];
  result.root.walkRules(rule => rules.push(rule));
  const floors = rules.filter(rule => rule.selector.includes('data-lesson-typography'));
  assert.equal(floors.length, 5);
  assert.deepEqual(floors.map(rule => rule.nodes[0].value), ['max(12px, 9px)', 'max(12px, 8px)', 'max(12px, 32px)', 'max(12px, 24px)', 'max(12px, .5em)']);
  assert.equal(floors[1].nodes[0].important, true);
  assert.equal(floors[3].parent.name, 'media');
  assert.ok(floors[4].selector.endsWith('::before'));
  assert.ok(result.css.includes('.hidden{font-size:0}'));
  assert.ok(result.css.includes('0%{font-size:10px}'));
});

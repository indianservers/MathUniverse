import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import LabLearningGuide from './LabLearningGuide';
import { labLearningGuides } from './labLearningGuides';
import { NumericPractice } from '../investigations/StudioInvestigations';

describe('additive lab learning guides', () => {
 it('leaves unsupported pages alone', () => {
  expect(renderToString(<LabLearningGuide route="/geometry/unknown" />)).toBe('');
 });
 it.each(Object.entries(labLearningGuides))('%s has one justified answer and starts folded without revealing feedback', (route, guide) => {
  expect(guide.feedback).toHaveLength(guide.choices.length);
  expect(guide.correct).toBeGreaterThanOrEqual(0);
  expect(guide.correct).toBeLessThan(guide.choices.length);
  const html = renderToString(<LabLearningGuide route={route} />);
  expect(html).toContain('Worked example');
  expect(html).not.toContain('<details open');
  expect(html).not.toContain('role="status"');
  expect(html).toContain('disabled=""');
  expect(html.match(/type="radio"/g)).toHaveLength(guide.choices.length);
 });
 it('provides an existing derivation as a hint without revealing the numeric answer', () => {
  const html = renderToString(<NumericPractice quiz={{prompt:'Compute the result',answer:987654,reason:'Multiply the given quantities.'}} onSolved={() => {}} />);
  expect(html).toContain('Need a reasoning hint?');
  expect(html).toContain('Multiply the given quantities.');
  expect(html).not.toContain('987654');
 });
});

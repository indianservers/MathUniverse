import { describe, expect, it } from 'vitest';
import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { enhancedLabs, enhancementSections, resolveEnhancedLab } from './labEnhancementRegistry';
import { curriculumStudios } from '../curriculum/curriculumCatalog';
import { studioMockups } from '../mockup/studioMockupCatalog';
import { investigations } from '../investigations/catalog';
import { UnderstandingGuide } from './LabUnderstanding';
import { studioComparisons } from './studioComparisons';
import { additionalLabContent } from './additionalLabContent';
import { labs as numberLabs } from '../number-systems/premium/catalog';

describe('every-studio learning enhancements', () => {
  it('covers all nineteen studios with valid case and comparison content', () => {
    expect(curriculumStudios).toHaveLength(19);
    expect(new Set(enhancedLabs.map(l=>l.key)).size).toBe(enhancedLabs.length);
    for (const studio of curriculumStudios) {
      const labs = enhancedLabs.filter(l=>l.studioId===studio.id);
      expect(labs.length,studio.id).toBeGreaterThan(0);
      expect(studioComparisons[studio.id],studio.id).toBeDefined();
      for (const lab of labs) {
        expect(lab.copy.examples,lab.key).toHaveLength(3);
        for (const example of lab.copy.examples) {
          expect(example.title,lab.key).toBeTruthy();
          expect(example.setup,lab.key).toBeTruthy();
          expect(example.result,lab.key).toBeTruthy();
        }
        expect(lab.formulas).toHaveLength(3);
        if (lab.numeric) expect(Number.isFinite(lab.numeric.expected),lab.key).toBe(true);
      }
    }
  });
  it('resolves every catalog lab and investigation to its own content', () => {
    for (const studio of Object.values(studioMockups)) for (const page of studio.pages.filter(p=>!['home','ar'].includes(p.id))) {
      expect(resolveEnhancedLab(page.route)?.title,page.route).toBe(page.label);
    }
    for (const lab of investigations) expect(resolveEnhancedLab(`/studios/${lab.studio}/labs/${lab.id}`)?.title).toBe(lab.title);
    for (const item of additionalLabContent) expect(resolveEnhancedLab(item.href)?.title,item.href).toBe(item.title);
    for (const lab of numberLabs) expect(resolveEnhancedLab(`/number-systems/${lab.id}`),lab.id).toBeDefined();
    expect(resolveEnhancedLab('/graph-theory','?tab=representations')?.title).toBe('Graph Representations');
    expect(resolveEnhancedLab('/unrelated')).toBeUndefined();
  });
  it('renders twelve distinct enhancements for a lab from every studio', () => {
    for (const lab of enhancedLabs) {
      const html = renderToString(<MemoryRouter><UnderstandingGuide lab={lab}/></MemoryRouter>);
      for (const section of enhancementSections) expect(html,`${lab.key}/${section}`).toContain(`data-enhancement="${section}"`);
      expect(html).toContain('data-enhancement-count="12"');
      expect(html).not.toMatch(/>undefined</);
    }
  });
});

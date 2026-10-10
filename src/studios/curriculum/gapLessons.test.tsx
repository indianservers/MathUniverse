import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { studioGapContent } from './gapLessons';
import { curriculumStudios, chaptersFor, studioForPath } from './curriculumCatalog';
import { GuidedCourse } from './GuidedCourse';
import StudioGapChecklist from './StudioGapChecklist';
import {labsForStudio} from '../investigations/catalog';

describe('audited Studio teaching gaps', () => {
  it('places every addition in its own course and reference library with a working deep link', () => {
    expect(Object.keys(studioGapContent).sort()).toEqual(curriculumStudios.map(studio => studio.id).sort());
    for (const studio of curriculumStudios) {
      const gap = studioGapContent[studio.id];
      const chapters = chaptersFor(studio.id);
      for (const lesson of gap.lessons) {
        expect(studioForPath(lesson.href)?.id).toBe(studio.id);
        expect(chapters.find(chapter => chapter.id === `guided-${lesson.id}`)?.exercise?.expected).toBe(lesson.calculation.answer);
        const html = renderToStaticMarkup(<MemoryRouter initialEntries={[`/studios/${studio.id}/curriculum?lesson=${lesson.id}`]}><GuidedCourse studioId={studio.id}/></MemoryRouter>);
        expect(html).toContain(`<h2>${lesson.title}</h2>`);
        expect(html).toContain(lesson.problem.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'));
      }
      const checklist = renderToStaticMarkup(<MemoryRouter><StudioGapChecklist studioId={studio.id}/></MemoryRouter>);
      for(const lab of labsForStudio(studio.id))expect(checklist).toContain(`/studios/${studio.id}/labs/${lab.id}`);
      expect(checklist).toContain('Check each lab');
      gap.lessons.forEach(lesson => expect(checklist).toContain(`?lesson=${lesson.id}`));
    }
  });

  it('checks representative transfer answers using independent mathematical calculations', () => {
    const answer = (studio: string, index: number) => studioGapContent[studio].lessons[index].calculation.answer;
    expect(answer('algebra', 0)).toBe(6 / -3);
    expect(answer('geometry', 1)).toBe((10 / 2) ** 2 - (8 / 2) ** 2);
    expect(answer('linear-algebra', 1)).toBe(1 / 0.01);
    expect(answer('mathematical-modelling', 1)).toBe((2 ** 2 + 0 ** 2) / 2);
    expect(answer('probability-statistics', 1)).toBe(Math.ceil(((1.96 + 0.84) * 10 / 2) ** 2));
    expect(answer('stats-inference', 0)).toBe(5 ** 2 / 25 + 5 ** 2 / 25);
    expect(answer('continued-fractions', 1)).toBe(2 ** 2 + 3);
    expect(answer('special-functions', 1)).toBe(1 / (2 * 5));
    expect(answer('advanced-differential-equations', 0)).toBe(2 / 50);
    let current = 3, transitions = 0;
    while (current !== 1) { current = current % 2 ? 3 * current + 1 : current / 2; transitions++; }
    expect(answer('famous-problems', 0)).toBe(transitions);
  });
});

import { describe, expect, it } from 'vitest';
import { masteryCourses } from './masteryContent';
import { curriculumStudios, chaptersFor, studioForPath } from './curriculumCatalog';
describe('guided curriculum delivery',()=>{
 it('delivers the core course and content-gap lessons for every main and advanced studio',()=>{
  expect(curriculumStudios).toHaveLength(19);
  expect(Object.keys(masteryCourses)).toHaveLength(19);
  for(const studio of curriculumStudios){
   const c=masteryCourses[studio.id];expect(c.units).toHaveLength(7);
   expect(new Set(c.units.map(u=>u.id)).size).toBe(c.units.length);
   expect(c.outcomes.length).toBeGreaterThanOrEqual(2);
   expect(c.capstone.solution.length).toBeGreaterThan(60);
   for(const u of c.units){
    expect(u.solution.length).toBeGreaterThanOrEqual(3);
    expect(u.conditions.trim()).not.toBe('');
    expect(Number.isFinite(u.calculation.answer)).toBe(true);
    expect(chaptersFor(studio.id).some(ch=>ch.id===`guided-${u.id}`)).toBe(true);
   }
  }
 });
 it('routes the advanced DE collection to its own course',()=>{
  expect(studioForPath('/math-lab/differential-equations')?.id).toBe('advanced-differential-equations');
  expect(masteryCourses['advanced-differential-equations']).not.toBe(masteryCourses['differential-equations']);
 });
});

import {describe,expect,it} from 'vitest';
import {unifiedLessons,unifiedCategories,adjacentUnifiedLessons,lessonById,lessonByRoute} from './unifiedLessons';
import {searchLessons,matchesLessonSearch} from './searchLessons';
describe('complete lesson inventory',()=>{
 it('assigns one category and stable unique identity to every registered lesson',()=>{
  expect(unifiedLessons).toHaveLength(1367);expect(unifiedCategories.length).toBeGreaterThanOrEqual(16);
  expect(new Set(unifiedLessons.map(l=>l.id)).size).toBe(1367);
  expect(new Set(unifiedLessons.map(l=>l.route)).size).toBe(1367);
  expect(unifiedCategories.reduce((n,c)=>n+c.count,0)).toBe(1367);
  for(const l of unifiedLessons){expect(Number.isInteger(l.id)&&l.id>0).toBe(true);expect(unifiedCategories.some(c=>c.slug===l.categorySlug)).toBe(true);expect(lessonByRoute(l.route)?.id).toBe(l.id);}
 });
 it('places representative lessons in the right mathematical categories',()=>{
  for(const [id,category] of [[287,'Limits and Derivatives'],[308,'Integrals'],[566,'Graph Theory'],[591,'Finance and Optimization'],[30104,'Ratios and Proportion'],[30291,'Geometry'],[32025,'Machine Learning and AI'],[32033,'Quantum Mathematics']] as const)expect(lessonById(id)?.category).toBe(category);
 });
 it('searches all IDs, including draft concepts and formulas',()=>{
  for(const lesson of unifiedLessons)expect(searchLessons(String(lesson.id))[0]?.id).toBe(lesson.id);
  expect(matchesLessonSearch(30089,'corner contribution')).toBe(true);
  expect(matchesLessonSearch(32028,'pseudocount')).toBe(true);
  expect(searchLessons('cayley hamilton').some(l=>l.id===32005)).toBe(true);
  expect(searchLessons('TF-IDF').some(l=>l.id===32021)).toBe(true);
 });
 it('keeps adjacent navigation within a category without self links',()=>{
  for(const lesson of unifiedLessons){const adjacent=adjacentUnifiedLessons(lesson.id);for(const candidate of [adjacent.previous,adjacent.next])if(candidate){expect(candidate.id).not.toBe(lesson.id);expect(candidate.categorySlug).toBe(lesson.categorySlug);}}
 });
});

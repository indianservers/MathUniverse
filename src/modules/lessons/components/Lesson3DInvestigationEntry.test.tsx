import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { lessonCatalog } from '../catalog/lessonCatalog';
import { schoolLessonCatalog } from '../catalog/school/schoolSyllabusCatalog';
import { lesson3DInvestigations } from '../three/lesson3DRegistry';
import Lesson3DInvestigationEntry from './Lesson3DInvestigationEntry';
function renderRoute(route:string){return renderToStaticMarkup(<MemoryRouter initialEntries={[route]}><Routes><Route path="/lessons/:categorySlug/:lessonSlug" element={<Lesson3DInvestigationEntry/>}/><Route path="/lessons/school/:levelSlug/:lessonSlug" element={<Lesson3DInvestigationEntry/>}/></Routes></MemoryRouter>);}
describe('3D investigation route integration',()=>{
  it.each([0,1,2])('renders collapsed, lesson-specific entries without creating WebGL contexts in batch %i',batch=>{
    for(const config of lesson3DInvestigations.slice(batch*50,(batch+1)*50)){const lesson=lessonCatalog.find(l=>l.id===config.id)??schoolLessonCatalog.find(l=>l.numericId===config.id)!;const html=renderRoute(lesson.route);expect(html,`lesson ${config.id}`).toContain('data-lesson-3d-investigation');expect(html).toContain(`Explore ${lesson.title.replace(/&/g,'&amp;').replace(/'/g,'&#x27;')} in 3D`);expect(html).toContain('aria-expanded="false"');expect(html).not.toContain('<canvas');}
  });
  it('does not add the 3D investigation to unrelated lessons',()=>{expect(renderRoute(lessonCatalog.find(l=>l.id===1)!.route)).toBe('');});
});

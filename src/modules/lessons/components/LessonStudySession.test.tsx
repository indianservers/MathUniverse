import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe,expect,it } from 'vitest';
import { lessonCatalog } from '../catalog/lessonCatalog';
import { schoolLessonCatalog } from '../catalog/school/schoolSyllabusCatalog';
import { advancedConceptLessons } from '../catalog/advanced/advancedConceptLessons';
import { getStrengthenedFoundationLesson } from '../strengthening/foundationNumberContent';
import { batchOneStudyChecks } from '../strengthening/studyBatchOne';
import { gradeStudyAnswer } from '../engine/lessonStudySession';
import LessonStudySession, { makeStudyQuestions, resolveStudyLessonId } from './LessonStudySession';
describe('first study batch',()=>{
  it('builds valid, separate question banks and resolves routes across all 919 lessons',()=>{
    const catalog=[...lessonCatalog,...advancedConceptLessons,...schoolLessonCatalog];
    expect(catalog).toHaveLength(919);
    for(const item of catalog){
      const id='numericId' in item?item.numericId:item.id;
      const lesson=getStrengthenedFoundationLesson(id)!;
      expect(lesson,`lesson ${id} content`).toBeDefined();
      const questions=makeStudyQuestions(lesson);
      expect(questions.length,`lesson ${id} practice`).toBeGreaterThan(2);
      expect(new Set(questions.map(q=>q.id)).size,`lesson ${id} duplicate keys`).toBe(questions.length);
      for(const question of questions){
        expect(question.prompt.trim(),`lesson ${id} prompt`).not.toBe('');
        expect(question.answer.trim(),`lesson ${id} answer`).not.toBe('');
        if(question.kind!=='reflection')expect(gradeStudyAnswer(question,question.answer),`lesson ${id}: ${question.id}`).toBe('correct');
      }
      const parts=item.route.split('/');
      expect(resolveStudyLessonId({categorySlug:parts[2],levelSlug:parts[3],lessonSlug:parts.at(-1)}),`lesson ${id} route`).toBe(id);
    }
  });
  it('has distinct topic checks and complete practice content for every lesson in batch one',()=>{
    const ids=lessonCatalog.filter(l=>l.id<=50).map(l=>l.id).sort((a,b)=>a-b);
    expect(ids).toEqual(Array.from({length:50},(_,i)=>i+1));
    const prompts=new Set<string>();
    for(const id of ids){
      const lesson=getStrengthenedFoundationLesson(id)!;const questions=makeStudyQuestions(lesson);
      expect(questions.length,`lesson ${id}`).toBeGreaterThan(2);
      expect(new Set(questions.map(q=>q.id)).size,`lesson ${id} duplicate keys`).toBe(questions.length);
      const check=batchOneStudyChecks[id];expect(check,`lesson ${id}`).toBeDefined();
      expect(gradeStudyAnswer(check,check.answer),`lesson ${id} answer`).toBe('correct');
      prompts.add(check.prompt);
    }
    expect(prompts.size).toBe(50);
  });
  it('starts with no false mastery and keeps question answers out of the opening view',()=>{
    const lesson=lessonCatalog.find(l=>l.id===33)!;
    const html=renderToStaticMarkup(<MemoryRouter initialEntries={[lesson.route]}><Routes><Route path="/lessons/:categorySlug/:lessonSlug" element={<LessonStudySession/>}/></Routes></MemoryRouter>);
    expect(html).toContain('Practice and remember Matrices');expect(html).toContain('0 of');
    expect(html).toContain('aria-expanded="false"');expect(html).not.toContain('Find the determinant');
  });
});

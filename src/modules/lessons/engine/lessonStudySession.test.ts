import { describe, expect, it, vi, afterEach } from 'vitest';
import { gradeStudyAnswer, newStudySession, questionKind, readStudySession, studyEvidence, type StudyQuestion } from './lessonStudySession';
const question = (answer:string,kind:StudyQuestion['kind']='number'):StudyQuestion => ({id:'q',prompt:'Find the result',answer,kind,hints:['Consider the rule'],solution:['Apply the rule'],level:'foundation'});
afterEach(()=>vi.unstubAllGlobals());
describe('study answer grading and learning evidence',()=>{
  it('accepts equivalent fractions, mixed numbers, arithmetic, and Unicode signs',()=>{
    for(const value of ['1.5','3/2','6÷4','1 1/2'])expect(gradeStudyAnswer(question('3/2'),value)).toBe('correct');
    expect(gradeStudyAnswer(question('-7/3'),'-2 1/3')).toBe('correct');
    expect(gradeStudyAnswer(question('-4'),'−4')).toBe('correct');
    expect(gradeStudyAnswer(question('5'),'√25')).toBe('correct');
  });
  it('rejects blank, malformed, nonfinite, or code-like answers',()=>{
    expect(gradeStudyAnswer(question('0'),' ')).toBe('empty');
    for(const value of ['1/0','0/0','Infinity','alert(1)','(2+','NaN'])expect(gradeStudyAnswer(question('0'),value)).toBe('incorrect');
    expect(gradeStudyAnswer(question('3/2'),'1.49')).toBe('incorrect');
  });
  it('preserves coordinate order, tuple length, signs, and declared approximation tolerance',()=>{
    const q=question('(3,4)','tuple');
    expect(gradeStudyAnswer(q,'(6/2, 2+2)')).toBe('correct');
    expect(gradeStudyAnswer(q,'(4,3)')).toBe('incorrect');
    expect(gradeStudyAnswer(q,'(3,4,0)')).toBe('incorrect');
    expect(gradeStudyAnswer({...question('1.175'),tolerance:.001},'1.1752')).toBe('correct');
  });
  it('does not pretend to grade arbitrary prose, proofs, or symbolic expressions',()=>{
    expect(questionKind('explain the principal-value restriction')).toBe('reflection');
    expect(questionKind('x^2+2x+1')).toBe('reflection');
    expect(gradeStudyAnswer(question('Reasoned explanation','reflection'),'A different valid explanation')).toBe('compare');
    expect(gradeStudyAnswer(question('yes','text'),'YES.')).toBe('correct');
    expect(gradeStudyAnswer(question('yes','text'),'yesterday')).toBe('incorrect');
  });
  it('counts independent results and keeps revealed or supported answers in review',()=>{
    const q=question('5');const session=newStudySession();
    session.attempts.q={answer:'5',attempts:1,correct:true,assisted:false,revealed:false};
    expect(studyEvidence([q],session).ready).toBe(true);
    session.attempts.q.assisted=true;
    expect(studyEvidence([q],session).ready).toBe(false);
    expect(studyEvidence([q],session).needsReview).toHaveLength(1);
    expect(studyEvidence([],session).ready).toBe(false);
  });
  it('recovers from blocked storage and discards malformed stored records',()=>{
    vi.stubGlobal('localStorage',{getItem:()=>{throw Error('blocked');}});
    expect(readStudySession(1)).toEqual(newStudySession());
    vi.stubGlobal('localStorage',{getItem:()=>JSON.stringify({version:1,attempts:{bad:{correct:true}},reflection:42,prerequisites:['Counting',false],predictions:{p:'Two',bad:7}})});
    const saved=readStudySession(1);
    expect(saved.attempts).toEqual({});expect(saved.reflection).toBe('');expect(saved.prerequisites).toEqual(['Counting']);expect(saved.predictions).toEqual({p:'Two'});
  });
});

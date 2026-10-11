import { evaluateExpression } from '../../../utils/calculator';

export type StudyQuestion = {
  id: string;
  prompt: string;
  answer: string;
  hints: string[];
  solution: string[];
  kind: 'number' | 'quantity' | 'tuple' | 'set' | 'text' | 'reflection';
  acceptable?: string[];
  tolerance?: number;
  level: 'foundation' | 'application' | 'challenge';
};
export type StudyAttempt = { answer: string; attempts: number; correct: boolean; assisted: boolean; revealed: boolean };
export type StudySession = {
  version: 1;
  questionId: string;
  attempts: Record<string, StudyAttempt>;
  prerequisites: string[];
  predictions: Record<string, string>;
  observations: Record<string, string>;
  completedSteps: string[];
  reflection: string;
  reviewAt: number | null;
};
export function newStudySession(): StudySession {
  return { version: 1, questionId: '', attempts: {}, prerequisites: [], predictions: {}, observations: {}, completedSteps: [], reflection: '', reviewAt: null };
}
export function studyStorageKey(id: number) { return `math-universe:study-session:v1:${id}`; }
export function readStudySession(id: number): StudySession {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(studyStorageKey(id)) ?? 'null');
    if (!value || typeof value !== 'object') return newStudySession();
    const saved = value as Partial<StudySession>;
    if (saved.version !== 1 || !saved.attempts || typeof saved.attempts !== 'object' || Array.isArray(saved.attempts)) return newStudySession();
    const attempts: Record<string, StudyAttempt> = {};
    for (const [key, raw] of Object.entries(saved.attempts)) {
      if (raw && typeof raw.answer === 'string' && Number.isInteger(raw.attempts) && raw.attempts >= 0 && typeof raw.correct === 'boolean' && typeof raw.assisted === 'boolean' && typeof raw.revealed === 'boolean') attempts[key] = raw;
    }
    const strings = (v: unknown): string[] => Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
    const dictionary = (v: unknown): Record<string, string> => v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.entries(v).filter(([,x])=>typeof x === 'string')) : {};
    return { ...newStudySession(), attempts, questionId: typeof saved.questionId === 'string' ? saved.questionId : '', prerequisites: strings(saved.prerequisites), completedSteps: strings(saved.completedSteps), predictions: dictionary(saved.predictions), observations: dictionary(saved.observations), reflection: typeof saved.reflection === 'string' ? saved.reflection : '', reviewAt: typeof saved.reviewAt === 'number' && Number.isFinite(saved.reviewAt) ? saved.reviewAt : null };
  } catch { return newStudySession(); }
}
const normalize = (v: string) => v.trim().toLowerCase().replace(/[−–]/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/\s+/g,'').replace(/[.!]$/,'');
function numeric(v: string): number | null {
  const input = v.trim().replace(/[−–]/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/π/g,'pi').replace(/√\s*\(([^)]+)\)/g,'sqrt($1)').replace(/√(\d+(?:\.\d+)?)/g,'sqrt($1)');
  const mixed = input.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) { const denominator = Number(mixed[3]); if (!denominator) return null; return (mixed[1].startsWith('-') ? -1 : 1) * (Math.abs(Number(mixed[1])) + Number(mixed[2]) / denominator); }
  if (input.length > 100) return null;
  if (/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(input)) { const value=Number(input); return Number.isFinite(value)?value:null; }
  const tokens=input.replace(/\bpi\b|\bsqrt(?=\()/g,'0');
  if (!/^[\d\s.+\-*/^()]+$/.test(tokens)) return null;
  try { const n = Number(evaluateExpression(input, 'RAD')); return Number.isFinite(n) ? n : null; } catch { return null; }
}
function quantity(value:string) {
  const match=value.trim().match(/^(.+?)\s*(°|deg(?:rees?)?|rad(?:ians?)?|%)$/i);
  if(!match)return null;
  const amount=numeric(match[1]);if(amount===null)return null;
  const unit=match[2].toLowerCase();
  return unit==='%'?{dimension:'ratio',value:amount/100}: {dimension:'angle',value:unit==='°'||unit.startsWith('deg')?amount*Math.PI/180:amount};
}
const tupleParts=(s:string)=>s.trim().replace(/^[([<]\s*/,'').replace(/\s*[)\]>]$/,'').split(',');
export function gradeStudyAnswer(question: StudyQuestion, answer: string): 'correct' | 'incorrect' | 'empty' | 'compare' {
  if (!answer.trim()) return 'empty';
  if (question.kind === 'reflection') return 'compare';
  const expected = [question.answer, ...(question.acceptable ?? [])];
  if (question.kind === 'text') return expected.some(v => normalize(v) === normalize(answer)) ? 'correct' : 'incorrect';
  const sameNumber = (a: string,b: string) => {const x=numeric(a), y=numeric(b); return x !== null && y !== null && Math.abs(x-y) <= (question.tolerance ?? 1e-10) * Math.max(1,Math.abs(y));};
  if (question.kind === 'number') return expected.some(v=>sameNumber(answer,v)) ? 'correct' : 'incorrect';
  const sameValue=(a:string,b:string)=>{
    const target=quantity(b);if(!target)return sameNumber(a,b);
    const actual=quantity(a);const bare=numeric(a);
    const value=actual?.value??(target.dimension==='ratio'?bare:null);
    return value!==null&&value!==undefined&&(!actual||actual.dimension===target.dimension)&&Math.abs(value-target.value)<=(question.tolerance??1e-10)*Math.max(1,Math.abs(target.value));
  };
  if(question.kind==='quantity')return expected.some(v=>sameValue(answer,v))?'correct':'incorrect';
  const actual = tupleParts(answer);
  return expected.some(v=>{const target=tupleParts(v);if(target.length!==actual.length||target.length<2)return false;
    if(question.kind==='tuple')return target.every((x,i)=>sameValue(actual[i],x));
    const remaining=[...actual];return target.every(x=>{const index=remaining.findIndex(a=>sameValue(a,x));if(index<0)return false;remaining.splice(index,1);return true;});
  }) ? 'correct' : 'incorrect';
}
export function questionKind(answer: string,prompt=''): StudyQuestion['kind'] {
  if (numeric(answer) !== null) return 'number';
  if (quantity(answer)) return 'quantity';
  const parts=tupleParts(answer);
  if(parts.length>1&&parts.every(v=>numeric(v)!==null||quantity(v)!==null))return /\b(roots|solutions|angles|solve)\b/i.test(prompt)&&!/\b(coordinates|ordered|point|vector)\b/i.test(prompt)?'set':'tuple';
  if (/^(?:yes|no|true|false|exact|approximate)$/i.test(answer.trim())) return 'text';
  return 'reflection';
}
export function studyEvidence(questions: StudyQuestion[], session: StudySession) {
  const scored = questions.filter(q=>q.kind !== 'reflection');
  const independent = scored.filter(q=>{const a=session.attempts[q.id];return a?.correct && !a.assisted && !a.revealed;});
  const needsReview = questions.filter(q=>{const a=session.attempts[q.id];return a && (!a.correct || a.assisted || a.revealed);});
  return { independent: independent.length, total: scored.length, needsReview, ready: scored.length > 0 && independent.length === scored.length };
}

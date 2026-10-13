import corpus from './lessonSearchCorpus.generated.json';
import {unifiedLessons,type UnifiedLesson} from './unifiedLessons';
const texts=new Map(corpus.map(l=>[l.id,l.text]));
export const normalizeLessonSearch=(query:string)=>query.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,' ').trim();
export function matchesLessonSearch(id:number,query:string){const terms=normalizeLessonSearch(query).split(/\s+/).filter(Boolean),text=texts.get(id)??'';return terms.every(term=>text.includes(term));}
export function searchLessons(query:string):UnifiedLesson[]{
 const normalized=normalizeLessonSearch(query);if(!normalized)return unifiedLessons;
 const numeric=normalized.match(/^(?:lesson\s+)?(\d+)$/)?.[1];
 const exact=numeric?unifiedLessons.find(l=>String(l.id)===numeric):undefined;if(exact)return [exact];
 return unifiedLessons.filter(l=>matchesLessonSearch(l.id,query)).sort((a,b)=>score(b,normalized)-score(a,normalized)||a.id-b.id);
}
function score(l:UnifiedLesson,query:string){return String(l.id)===query?1000:normalizeLessonSearch(l.title)===query?500:normalizeLessonSearch(l.title).includes(query)?200:normalizeLessonSearch(l.topic).includes(query)?100:0;}

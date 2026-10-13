import index from './unifiedLessonIndex.generated.json';
export const unifiedLessons=index.lessons;
export const unifiedCategories=index.categories;
export type UnifiedLesson=(typeof unifiedLessons)[number];
export function lessonById(id:number){return unifiedLessons.find(l=>l.id===id);}
export function lessonByRoute(route:string){return unifiedLessons.find(l=>l.route===route);}
export function adjacentUnifiedLessons(id:number){
 const current=lessonById(id);if(!current)return {previous:null,next:null};
 const candidates=unifiedLessons.filter(l=>l.categorySlug===current.categorySlug).sort((a,b)=>a.id-b.id);
 const position=candidates.findIndex(l=>l.id===id);
 return {previous:candidates[position-1]??null,next:candidates[position+1]??null};
}

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { seeds } from './authored-lesson-seeds.mjs';
import './register-authored-school-lessons.mjs';
import './register-authored-advanced-lessons.mjs';
import './expand-authored-lesson-examples.mjs';
import './enrich-authored-lessons-reverse.mjs';

const registryPath='src/modules/lessons/catalog/upcoming/apCurriculumRegistry.generated.json';
const contentPath='src/modules/lessons/authored/authoredLessons.generated.json';
const registry=JSON.parse(readFileSync(registryPath,'utf8'));
const categoriesById=new Map(JSON.parse(readFileSync('src/modules/lessons/catalog/unified/unifiedLessonIndex.generated.json','utf8')).lessons.map(l=>[l.id,l.categorySlug]));
const slug=title=>title.normalize('NFKD').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const previous=existsSync(contentPath)?JSON.parse(readFileSync(contentPath,'utf8')):{lessons:[]};
const content=new Map(previous.lessons.map(x=>[x.lessonId,x]));
const flag=process.argv.indexOf('--batch');
const selected=flag>=0?Number(process.argv[flag+1]):null;
const batchCount=Math.ceil(registry.upcomingLessons.length/25);
for(let batch=1;batch<=batchCount;batch++){
 if(selected!==null&&batch!==selected)continue;
 const reservations=registry.upcomingLessons.slice((batch-1)*25,batch*25);
 const missing=reservations.filter(x=>!seeds.has(x.lessonId));
 if(missing.length)throw new Error(`Batch ${batch} needs authored content for: ${missing.map(x=>`${x.lessonId} (${x.topicName})`).join(', ')}`);
 for(const row of reservations){
  const authored=seeds.get(row.lessonId);
  if(authored.examples.length<2||authored.practice.length<3||authored.sections.length<3||!authored.interactive.model)throw new Error(`Incomplete teaching contract: ${row.lessonId}`);
  const source=registry.sources.find(x=>x.id===row.sourceId);
  const higherUrl=row.sourceId.startsWith('JNTUK-CSE-R25')?'https://files-cdn.jntufastupdates.com/wpdm/2026/03/48041/R25-M.Tech-CSE-Syllabus.pdf':row.sourceId.startsWith('JNTUK-AIDS-R25')?'https://files-cdn.jntufastupdates.com/wpdm/2026/03/48028/R25-M.Tech-AI-DS-Syllabus.pdf':row.sourceId==='BIE-IB-2023'?'https://bieap.apcfss.in/Uploads/Materials/MATHEMATICS_IB_I_YR.pdf':'';
  const pageAnchor=row.pdfPage??(Number(row.sourceId.match(/pp(\d+)/)?.[1]??0)||null);
  const route=`/lessons/${categoriesById.get(row.lessonId)??'concepts'}/${row.lessonId}-${slug(row.topicName)}`;
  content.set(row.lessonId,{lessonId:row.lessonId,title:row.topicName,level:row.level,chapter:row.chapterName,route,sourceStatus:row.sourceStatus,sourceId:row.sourceId,sourceYear:row.sourceYear,sourceUrl:source?.url??higherUrl,pdfPage:pageAnchor,kind:row.kind,batch,...authored,relatedLessonIds:row.relatedLessonIds??[],reviewStatus:'Content and source review pending'});
 }
 console.log(`Batch ${batch}/${batchCount}: authored ${reservations.length} lesson drafts.`);
}
const lessons=registry.upcomingLessons.filter(x=>content.has(x.lessonId)).map(x=>content.get(x.lessonId));
mkdirSync('src/modules/lessons/authored',{recursive:true});
writeFileSync(contentPath,JSON.stringify({updatedOn:'2026-10-12',batchSize:25,lessons},null,2)+'\n');
mkdirSync('src/modules/lessons/authored/batches',{recursive:true});
for(let batch=1;batch<=batchCount;batch++)writeFileSync(`src/modules/lessons/authored/batches/batch-${String(batch).padStart(2,'0')}.generated.json`,JSON.stringify({batch,lessons:lessons.filter(lesson=>lesson.batch===batch)},null,2)+'\n');
writeFileSync('src/modules/lessons/authored/authoredLessonIndex.generated.json',JSON.stringify({lessons:lessons.map(({lessonId,batch,title,route})=>({lessonId,batch,title,route}))},null,2)+'\n');
for(const row of [...registry.upcomingLessons,...registry.schoolTopics]){if(content.has(row.lessonId)){row.contentStatus='Drafted';row.interactiveStatus='Implemented—verification pending';row.practiceStatus='Drafted';row.assessmentStatus='Drafted';}}
writeFileSync(registryPath,JSON.stringify(registry,null,2)+'\n');
writeFileSync('reports/AP_SCHOOL_TOPIC_PLAN.json',JSON.stringify(registry,null,2)+'\n');
const batches=Array.from({length:batchCount},(_,i)=>({batch:i+1,lessonIds:registry.upcomingLessons.slice(i*25,(i+1)*25).map(x=>x.lessonId),authored:registry.upcomingLessons.slice(i*25,(i+1)*25).filter(x=>content.has(x.lessonId)).length}));
writeFileSync('reports/AP_LESSON_CONTENT_BATCHES.json',JSON.stringify({total:registry.upcomingLessons.length,authored:lessons.length,remaining:registry.upcomingLessons.length-lessons.length,batches},null,2)+'\n');
await import('./build-unified-lesson-index.mjs');

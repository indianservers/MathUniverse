import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { chapters as chapterSeeds, sources as sourceSeeds, supplements } from './ap-school-topic-plan.mjs';

const output = 'src/modules/lessons/catalog/upcoming/apCurriculumRegistry.generated.json';
const previous = existsSync(output) ? JSON.parse(readFileSync(output,'utf8')) : {upcomingLessons:[]};
const retainedIds = new Map(previous.upcomingLessons.map(x=>[x.topicKey,x.lessonId]));
function array(path){const s=readFileSync(path,'utf8');return JSON.parse(s.slice(s.indexOf('= [')+2).replace(/\]\s*(?:as const\s*)?satisfies[\s\S]*$/,']'));}
const catalog = [...[1,2,3,4].flatMap(p=>array(`src/modules/lessons/catalog/phase${p}.generated.ts`)),...array('src/modules/lessons/catalog/school/schoolSyllabusLessons.generated.ts')];
const normalize=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const slug=s=>normalize(s).replaceAll(' ','-');
const byTitle=new Map(catalog.map(x=>[normalize(x.title),x]));
const relatedRules=[
 [/square|cube|root/i,['Powers and Roots','Prime Factorisation']],
 [/exponen|powers of|scientific notation/i,['Indices','Exponential Functions']],
 [/numeral|positional|base of|bases|place value/i,['Base Systems','Place Value']],
 [/divisib|parity|multiples|remainder/i,['Divisibility Rules','Multiples','Modular Arithmetic']],
 [/distribut|expansion|identit|binomial/i,['Expanding Brackets','Double Brackets','Identities']],
 [/ratio|proportion|unit.rate|unitary|scaling images/i,['Ratio Models','Proportion','Unit Rates','Scale Drawings']],
 [/coordinate|cartesian|quadrants|plotting points|abscissa/i,['Cartesian Plane','Plotting Points']],
 [/linear equation|substitution method|elimination method|coefficient.ratio/i,['Linear Equations','Simultaneous Linear Equations']],
 [/quadratic|discriminant/i,['Quadratic Equations']],
 [/trigonometric|trigonometry|hypotenuse/i,['Right-Triangle Ratios','Exact Trig Values','Trig Identities']],
 [/similarity|similar triangles|proportionality theorem/i,['Dilation from Point']],
 [/congruence|cpct/i,['SAS Congruence','ASA Congruence','SSS Congruence','RHS Congruence']],
 [/probability|sample space|outcomes|complementary/i,['Sample Spaces','Events','Probability Scale','Complement Rule']],
 [/histogram|frequency polygon|grouped data|class intervals/i,['Histogram','Frequency Polygon','Grouped Frequency Tables']],
 [/grouped.mode|modal class/i,['Mode']],
 [/grouped.median|median.class/i,['Median','Median from an Ogive']],
 [/cone|sphere|surface area|volume|capacity/i,['Volume','Surface Area','Combined Solids']],
];
const taken=new Set([...catalog.map(x=>x.numericId??x.id),...Array.from({length:25},(_,i)=>2001+i),...retainedIds.values()]);
let nextSchool=30001,nextHigher=32001;
function idFor(key,higher=false){if(retainedIds.has(key))return retainedIds.get(key);let n=higher?nextHigher:nextSchool;while(taken.has(n))n++;taken.add(n);if(higher)nextHigher=n+1;else nextSchool=n+1;return n;}
const sources=sourceSeeds.map(source=>{
 const pagesPath=`tmp/ap-school-sources/${source.file}.pages.json`;
 const pages=JSON.parse(readFileSync(pagesPath,'utf8')).map(p=>({...p,text:p.text.replace(/\/G(\d+)/g,(_,n)=>Number(n)<256?String.fromCharCode(Number(n)):' ')}));
 const pdf=readFileSync(`tmp/ap-school-sources/${source.file}.pdf`);
 return {...source,pdfPages:pages.length,sha256:createHash('sha256').update(pdf).digest('hex'),pages};
});
const schoolTopics=[],upcomingLessons=[];
function addTopic(chapter,topic,kind='Concept'){
 const source=sources.find(x=>x.id===chapter.sourceId);
 if(!source||!Number.isInteger(topic.pdfPage)||topic.pdfPage<1||topic.pdfPage>source.pdfPages)throw new Error(`Invalid source/page: ${chapter.name} ${topic.topicName}`);
 const topicKey=`${source.id}:${chapter.number}:${slug(topic.topicName)}`;
 const matched=topic.existingTitle?byTitle.get(normalize(topic.existingTitle)):byTitle.get(normalize(topic.topicName));
 const level=`Class ${source.grade}`;
 const pageName=matched?matched.title:`${level}: ${topic.topicName}`;
 const lessonId=matched?(matched.numericId??matched.id):idFor(topicKey);
 const plannedRoute=matched?matched.route:`/lessons/school/class-${source.grade}/${lessonId}-${slug(topic.topicName)}`;
 const record={topicKey,level,grade:source.grade,chapterNumber:chapter.number,chapterName:chapter.name,topicName:topic.topicName,kind,section:topic.section,sourceId:source.id,sourceYear:source.academicYear,sourceStatus:source.verification,pdfPage:topic.pdfPage,lessonId,pageName,plannedRoute,status:matched?'Existing—review required':'Upcoming',existingLessonId:matched?(matched.numericId??matched.id):null,existingLessonTitle:matched?.title??'',existingLessonRoute:matched?.route??'',coverageVerified:'No',mockupStatus:matched?'Review existing lesson':'Awaiting mockup',mockupFile:'',contentStatus:matched?'Review required':'Not started',practiceStatus:'Not verified',assessmentStatus:'Not verified',notes:source.academicYear==='2025-2026'?'Prior-edition topic. Confirm the current Semester 2 source before authoring.':matched?'Explicit catalog mapping candidate. Review topic depth, grade suitability, examples, practice and assessment.':'Dedicated topic lesson or assessment is not mapped in the catalog.',referenceNote:'PDF page is a section/chapter anchor; topic wording is an authored breakdown.'};
 const related=[...new Set(relatedRules.filter(([pattern])=>pattern.test(topic.topicName)).flatMap(([,titles])=>titles))].map(title=>byTitle.get(normalize(title))).filter(Boolean);
 record.relatedLessonIds=related.map(x=>x.numericId??x.id);
 record.relatedLessonTitles=related.map(x=>x.title);
 schoolTopics.push(record);
 if(!matched)upcomingLessons.push({...record,reason:record.notes});
}
for(const chapter of chapterSeeds){
 for(const topic of chapter.topics)addTopic(chapter,topic);
 // Separate assessed practice from concept presence for textbook-replacement planning.
 const page=chapter.topics[0].pdfPage;
 addTopic(chapter,{topicName:`${chapter.name}: guided examples and applications`,pdfPage:page,section:'Chapter learning outcomes',existingTitle:''},'Guided practice');
 addTopic(chapter,{topicName:`${chapter.name}: mastery assessment and revision`,pdfPage:page,section:'Chapter learning outcomes',existingTitle:''},'Assessment');
 const source=sources.find(x=>x.id===chapter.sourceId);
 const end=source.grade===8&&source.semester===1?434:source.grade===9&&source.semester===1?216:source.grade===10&&source.semester===1?278:source.grade===10?242:source.grade===8?162:212;
 const exercises=new Map();
 for(const p of source.pages.filter(p=>p.pdfPage<end)){
  const expression=/(?:EXERCISE\s+|Figure\s+it\s+[Oo]ut\s*[-–]?\s*)(\d{1,2}\.\d+)/g;
  for(const match of p.text.matchAll(expression))if(Number(match[1].split('.')[0])===chapter.number&&!exercises.has(match[1]))exercises.set(match[1],p.pdfPage);
 }
 for(const [section,pdfPage] of exercises)addTopic(chapter,{topicName:`${chapter.name}: practice set ${section}`,pdfPage,section:`Exercise / Figure it Out ${section}`,existingTitle:''},'Practice set');
}
for(const [sourceId,number,name,pdfPage,topicName] of supplements)addTopic({sourceId,number,name},{topicName,pdfPage,section:'Learning competencies / appendix',existingTitle:''},'Supplement');
// Keep the earlier university gap groups as separate authoring work, not school requirements.
const higher=JSON.parse(readFileSync('reports/AP_JNTUK_LESSON_COVERAGE_EVIDENCE.json','utf8')).rows.filter(x=>x.status!=='LESSON_CANDIDATE');
for(const row of higher){
 const topicKey=`higher:${slug(row.stage)}:${slug(row.concept)}`;
 const lessonId=idFor(topicKey,true);
 upcomingLessons.push({topicKey,lessonId,level:row.stage,grade:null,chapterNumber:null,chapterName:row.stage,topicName:row.concept,pageName:`${row.stage}: ${row.concept}`,plannedRoute:`/lessons/planned/${lessonId}-${slug(row.concept)}`,status:'Upcoming',kind:'Concept sequence',sourceId:row.source,sourceYear:row.source.includes('R25')?'R25 / 2025-2026':'Verification pending',sourceStatus:row.source.includes('R25')?'University-authored mirrored PDF; programme verification pending':'Current applicability requires verification',section:row.source,pdfPage:null,existingLessonId:null,existingLessonTitle:'',existingLessonRoute:'',coverageVerified:'No',mockupStatus:'Awaiting mockup',mockupFile:'',contentStatus:'Not started',practiceStatus:'Not verified',assessmentStatus:'Not verified',notes:row.status==='NO_EVIDENCE_FOUND'?'No relevant match in the earlier source screening.':'Supporting material exists; a dedicated catalog lesson was not mapped.',reason:row.status==='NO_EVIDENCE_FOUND'?'No relevant match in the earlier source screening.':'Supporting material exists; a dedicated catalog lesson was not mapped.'});
}
const chapters=chapterSeeds.map(c=>{const r=schoolTopics.filter(t=>t.sourceId===c.sourceId&&t.chapterNumber===c.number);return{sourceId:c.sourceId,grade:r[0].grade,chapterNumber:c.number,chapterName:c.name,sourceYear:r[0].sourceYear,sourceStatus:r[0].sourceStatus,topics:r.length,mapped:r.filter(t=>t.status!=='Upcoming').length,upcoming:r.filter(t=>t.status==='Upcoming').length,verified:0,sourcePdfPage:c.topics[0].pdfPage};});
if(new Set(schoolTopics.map(x=>x.topicKey)).size!==schoolTopics.length)throw new Error('Duplicate topic keys');
if(new Set(upcomingLessons.map(x=>x.lessonId)).size!==upcomingLessons.length)throw new Error('Duplicate upcoming IDs');
if(upcomingLessons.some(x=>catalog.some(y=>(y.numericId??y.id)===x.lessonId)))throw new Error('ID collision');
const registry={generatedOn:'2026-10-12',academicYear:'2026-2027',scope:'AP Classes 8–10 plus previously flagged AP Intermediate/JNTUK groups',annualCoverageStatus:'Not certified: current AP Class 8 and 9 Semester 2 documents are not listed in the queried portal; prior editions retained separately.',method:'Manually decomposed chapter sections, source practice families, and learning competencies. Exact-title/explicit catalog mapping candidates only. Every outcome still needs teaching and assessment review. Individual exercise questions are not yet inventoried.',sources:sources.map(({pages,...s})=>s),chapters,schoolTopics,upcomingLessons,summary:{schoolTopics:schoolTopics.length,schoolMapped:schoolTopics.filter(t=>t.status!=='Upcoming').length,schoolUpcoming:schoolTopics.filter(t=>t.status==='Upcoming').length,higherUpcoming:higher.length,totalUpcoming:upcomingLessons.length,verifiedTopics:0}};
const retainedProgress=new Map(previous.upcomingLessons.map(row=>[row.lessonId,row]));
for(const row of [...upcomingLessons,...schoolTopics]){
 const prior=retainedProgress.get(row.lessonId);if(!prior)continue;
 for(const field of ['contentStatus','interactiveStatus','practiceStatus','assessmentStatus','mockupStatus','mockupFile'])if(prior[field]!==undefined)row[field]=prior[field];
}
mkdirSync('src/modules/lessons/catalog/upcoming',{recursive:true});
writeFileSync(output,JSON.stringify(registry,null,2)+'\n');
mkdirSync('reports',{recursive:true});
writeFileSync('reports/AP_SCHOOL_TOPIC_PLAN.json',JSON.stringify(registry,null,2)+'\n');
console.log(JSON.stringify({summary:registry.summary,byGrade:[8,9,10].map(grade=>({grade,topics:schoolTopics.filter(t=>t.grade===grade).length,upcoming:schoolTopics.filter(t=>t.grade===grade&&t.status==='Upcoming').length})),idRange:[Math.min(...upcomingLessons.map(x=>x.lessonId)),Math.max(...upcomingLessons.map(x=>x.lessonId))]},null,2));

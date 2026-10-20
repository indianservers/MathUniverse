import fs from 'node:fs/promises';import path from 'node:path';
const state=JSON.parse(await fs.readFile('audit/lesson-interactivity/reverse-queue.json','utf8'));
const catalog=JSON.parse(await fs.readFile('src/modules/lessons/catalog/unified/unifiedLessonIndex.generated.json','utf8')).lessons;
const files=await fs.readdir('src/modules/lessons',{recursive:true});
const matches=[];
for(const file of files.filter(f=>f.endsWith('.tsx')&&!f.endsWith('.test.tsx'))){const source=await fs.readFile(path.join('src/modules/lessons',file),'utf8');for(const hit of source.matchAll(/data-testid=["']([^"']*mockup-(\d{4}))["']/g)){const row=state.queue.find(q=>q.index===Number(hit[2]));if(!row)continue;const id=file.match(/Lesson(\d+)\.tsx$/)?.[1];const lesson=id?catalog.find(l=>l.id===Number(id)):null;matches.push({index:row.index,source:path.join('src/modules/lessons',file).replaceAll('\\','/'),testId:hit[1],route:lesson?.route??row.route});}}
await fs.writeFile('audit/lesson-interactivity/source-map.json',JSON.stringify(matches,null,2));console.log({sources:matches.length,routes:matches.filter(m=>m.route).length});

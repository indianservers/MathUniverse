import fs from 'node:fs/promises';
import path from 'node:path';
const prior = JSON.parse(await fs.readFile('audit/mockup-reverse/progress.json','utf8'));
const catalog=JSON.parse(await fs.readFile('src/modules/lessons/catalog/unified/unifiedLessonIndex.generated.json','utf8')).lessons;
const slug = text=>text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const files = await fs.readdir('scripts');
const dir='audit/lesson-interactivity';
await fs.mkdir(dir,{recursive:true});
let saved={};try{saved=JSON.parse(await fs.readFile(`${dir}/reverse-queue.json`,'utf8'));}catch{}
const sources=JSON.parse(await fs.readFile('audit/lesson-interactivity/source-map.json','utf8'));
const overrides=JSON.parse(await fs.readFile('audit/lesson-interactivity/route-overrides.json','utf8'));
const queue = [];
for(const item of prior.queue.slice().sort((a,b)=>b.index-a.index)){
  const name=item.filename.replace(/-redesigned\.png$/,'');
  let candidates=catalog.filter(l=>name.endsWith(`-${slug(l.title)}`));
  if(candidates.length!==1){const routed=catalog.filter(l=>name.endsWith('-'+l.route.split('/').at(-1).replace(/^\d+-/,'')));if(routed.length===1)candidates=routed;}
  if(candidates.length>1&&name.includes('-school-'))candidates=candidates.filter(l=>l.route.includes('/school/'));
  if(candidates.length>1&&name.includes('-advanced-advanced-'))candidates=candidates.filter(l=>l.route.includes('/advanced-concepts/'));
  const existing=saved.queue?.find(r=>r.index===item.index);
  const script=files.find(f=>f===`verify-mockup-${String(item.index).padStart(4,'0')}.mjs`);
  const verifierRoute=script?(await fs.readFile(`scripts/${script}`,'utf8')).match(/['"](\/lessons\/[^'"]+)['"]/ )?.[1]:null;
  const mappedRoute=overrides[item.index]??sources.find(source=>source.index===item.index)?.route??verifierRoute;
  if(mappedRoute){const match=catalog.find(l=>l.route===mappedRoute);if(match)candidates=[match];}
  queue.push({index:item.index,filename:item.filename,route:candidates.length===1?candidates[0].route:null,title:candidates.length===1?candidates[0].title:null,verifier:script?`scripts/${script}`:null,status:existing?.status??'pending',...(existing?.verification?{verification:existing.verification}:{})});
}
await fs.writeFile(`${dir}/reverse-queue.json`,JSON.stringify({order:'0919 to 0001; one lesson at a time',scope:'Existing visual queue only',criteria:['A topic-specific action changes a mathematical representation or result','Controls include meaningful interactions beyond checkboxes','Correct results and input boundaries','Responsive and accessible interactions'],queue},null,2));
console.log(JSON.stringify({lessons:queue.length,routesMapped:queue.filter(q=>q.route).length,withBrowserVerifier:queue.filter(q=>q.verifier).length,next:queue.find(q=>q.status==='pending')},null,2));

import fs from 'node:fs/promises';
import {Workbook,SpreadsheetFile} from '@oai/artifact-tool';
const root='C:/Indian Servers/Math Universe Visualizations';
const out=root+'/outputs/pending-lessons';
const read=async p=>JSON.parse(await fs.readFile(root+'/'+p,'utf8'));
const catalog=await read('src/modules/lessons/catalog/unified/unifiedLessonIndex.generated.json');
const registry=await read('src/modules/lessons/catalog/upcoming/apCurriculumRegistry.generated.json');
const pending=catalog.lessons.filter(l=>l.status==='Upcoming').sort((a,b)=>a.id-b.id);
const reg=new Map(registry.upcomingLessons.map(l=>[l.lessonId,l]));
const authored=new Map();
for(const file of await fs.readdir(root+'/src/modules/lessons/authored/batches')){
 if(!file.endsWith('.json'))continue;
 const batch=await read('src/modules/lessons/authored/batches/'+file);
 for(const l of batch.lessons??[])authored.set(l.lessonId,l);
}
if(pending.length!==registry.summary.totalUpcoming||new Set(pending.map(l=>l.id)).size!==pending.length)throw Error('Count mismatch');
const rows=pending.map(l=>{
 const r=reg.get(l.id),a=authored.get(l.id);
 if(!r||!a?.objectives?.length)throw Error('Missing details '+l.id);
 return [l.id,l.title,r.chapterName,a.objectives.join('\n'),l.level,l.category,l.status,r.contentStatus,r.interactiveStatus,l.route];
});
const wb=Workbook.create();const s=wb.worksheets.add('Pending Lessons');s.showGridLines=false;s.tabColor='#243B53';
const end=rows.length+5;
s.getRange(`A1:J${end}`).format.font={name:'Arial',size:10,color:'#243B53'};
s.getRange('A2').values=[['Upcoming and pending lessons']];s.getRange('A2').format.font={size:16,bold:true};
s.getRange('A3').values=[['448 lessons']];
s.getRange('B3').values=[['Catalog status: Upcoming. Topic coverage uses authored lesson objectives. As of 19 Oct 2026.']];
s.getRange('A5:J5').values=[['Lesson ID','Lesson Name','Chapter Name','Topics to be Covered','Level','Category','Catalog Status','Content Status','Interactive Status','Lesson Page']];
s.getRange(`A6:J${end}`).values=rows;
const table=s.tables.add(`A5:J${end}`,true,'PendingLessons');table.showFilterButton=true;
s.getRange('A5:J5').format={fill:'#243B53',font:{bold:true,color:'#FFFFFF'},rowHeight:30,wrapText:true,horizontalAlignment:'center',verticalAlignment:'center'};
const widths=[12,48,36,100,27,30,16,18,40,80];
for(let i=0;i<10;i++)s.getRangeByIndexes(4,i,end-4,1).format.columnWidth=widths[i];
s.getRange(`A6:J${end}`).format.wrapText=true;
s.getRange(`A6:J${end}`).format.verticalAlignment='top';
s.getRange(`A6:J${end}`).format.rowHeight=66;
s.getRange(`A6:A${end}`).setNumberFormat('0');
for(let i=0;i<rows.length;i++){
 const lines=Math.max(...rows[i].map((v,j)=>String(v).split('\n').reduce((n,t)=>n+Math.max(1,Math.ceil(t.length/(widths[j]-2))),0)));
 if(lines>4)s.getRange(`A${i+6}:J${i+6}`).format.rowHeight=lines*14+10;
}
s.freezePanes.freezeRows(5);
wb.recalculate();
console.log('Verified rows:',rows.length,'with authored objectives:',rows.filter(r=>r[3]).length);
console.log((await wb.inspect({kind:'table',range:'Pending Lessons!A5:D7',tableMaxRows:3,tableMaxCols:4,maxChars:1800})).ndjson);
const preview=await wb.render({sheetName:s.name,range:'A1:D9',scale:1,format:'png'});
await fs.writeFile(out+'/preview.png',new Uint8Array(await preview.arrayBuffer()));
await (await SpreadsheetFile.exportXlsx(wb)).save(out+'/Upcoming_Pending_Lessons.xlsx');

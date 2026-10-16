import questions from './bulkEditQuestions250.json';
import {COLORS} from '../../offline-intelligence/shapeCatalog';
import type {SemanticRow} from './types';
/** Labels and expected parameters are authored independently of the runtime parser. */
export function bulkEditTrainingRows():SemanticRow[]{
 return questions.map(row=>{
  const mode='geometry2d' as const;
  const objects:NonNullable<SemanticRow['context']>['objects']=[];
  for(const [kind,index] of ['circle','line','triangle','polygon','point'].map((kind,index)=>[kind,index] as const))for(let i=0;i<3;i++){
   const x=index*10+i*2,y=i*3,position=[x,y],id=`${kind}_${i}`;
   const vertices=kind==='line'?[[x,y],[x+1,y+2]]:kind==='triangle'?[[x,y],[x+1,y],[x,y+1]]:kind==='polygon'?[[x,y],[x+1,y],[x+1,y+1],[x,y+1]]:undefined;
   objects.push({id,label:id,type:kind,mode,position,vertices,radius:1,style:{color:COLORS[i===2?'green':'blue']},parameters:{roboExplicitVertices:true,roboVisible:row.action!=='SHOW',roboLocked:row.action==='UNLOCK',linearExtent:kind==='line'?'line':undefined}});
  }
  const target={type:row.type,...(row.selected?{selected:true}:{}),...(row.sourceColor?{color:row.sourceColor}:{})};
  return {phrase:row.question,mode,action:row.action,subAction:row.subAction,target,parameters:{...row.parameters,multiple:true,bulkEdit:true},context:{objects,selected:objects.filter(o=>o.id.endsWith('_0')).map(o=>o.id)},source:'user-bulk-edit-250',group:`bulk-edit-250:${row.id}`};
 });
}

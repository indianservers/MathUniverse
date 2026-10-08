import {COMMAND_ALIASES} from './commandLanguage';
export type CommandVariant={phrase:string;action:string;subAction:string};
const specs:[string,string,string,string][]=[
 ['create','CREATE','CIRCLE','a circle of radius 5'],['delete','DELETE','OBJECT','it'],['move','MOVE','OBJECT','it right by 3'],['rotate','ROTATE','OBJECT','it by 30 degrees'],
 ['scale','SCALE','UNIFORM','it by 2'],['select','SELECT','OBJECT','the rectangle'],['deselect','DESELECT','ALL',''],['duplicate','DUPLICATE','OBJECT','that'],
 ['reflect','REFLECT','Y_AXIS','it across the y-axis'],['change','CHANGE','COLOR','it to blue'],['hide','HIDE','OBJECT','it'],['show','SHOW','OBJECT','it'],
 ['find','FIND','AREA','its area'],['undo','UNDO','LAST',''],['redo','REDO','LAST',''],
];
const wrappers=[(s:string)=>s,(s:string)=>`Please ${s}.`,(s:string)=>`Can you ${s}?`,(s:string)=>`Could you ${s}?`,(s:string)=>`Would you ${s}?`,(s:string)=>`Will you ${s}?`,(s:string)=>`Kindly ${s}.`,(s:string)=>`I want you to ${s}.`,(s:string)=>`I need you to ${s}.`,(s:string)=>`I would like you to ${s}.`,(s:string)=>`${s} please!`,(s:string)=>`Please could you ${s}?`,(s:string)=>s.toUpperCase()];
export function commandVariants():CommandVariant[]{
 return specs.flatMap(([key,action,subAction,tail])=>{
  const verbs=[key,...(COMMAND_ALIASES[key]??[])];
  if(key==='create')verbs.push('draw','make','plot');
  return verbs.flatMap(verb=>wrappers.map(wrap=>({phrase:wrap(`${verb}${tail?' '+tail:''}`),action,subAction}))).slice(0,50);
 });
}

import {targetFromPhrase} from './targetResolver';
import questions from './kidGeometry3d300.json';
import {geometryQuestionGrammar,type GeometrySlots} from './geometryQuestionGrammar';
import type {MathRoboCommand} from './types';
const clean=(s:string)=>s.replace(/[’‘]/g,"'").replace(/^(?:please|kindly|can you|could you)\s+/i,'');
const rows=questions.map(row=>({...row,question:clean(row.question)}));
const key=(s:string)=>clean(s).toLowerCase().replace(/[?.!]+$/,'').replace(/\s+/g,' ').trim();
const exact=new Map(rows.map(row=>[key(row.question),geometryQuestionGrammar([row])]));
const templates=rows.flatMap(row=>{const slot=row.question.match(/\b(?:[A-Z]+|[cds])\b|[−-]?\d+(?:\.\d+)?/);return slot?[{prefix:key(row.question.slice(0,slot.index)),match:geometryQuestionGrammar([row])}]:[];});
const cache=new Map<string,GeometrySlots|undefined>();
export function matchKidGeometry3d(text:string):GeometrySlots|undefined{
 if(text.length>512)return;
 const k=key(text);if(cache.has(k))return cache.get(k);
 const valid=(v:GeometrySlots|undefined)=>v&&!Object.values(v.names).some(name=>['it','this','that','them','these','those','its','selected','another','object','shape','solid'].includes(name));
 let result=exact.get(k)?.(clean(text));if(!valid(result))result=undefined;
 if(!result)for(const t of templates){if(!k.startsWith(t.prefix))continue;result=t.match(clean(text));if(valid(result))break;result=undefined;}
 if(cache.size>=2048)cache.clear();cache.set(k,result);return result;
}
export function parseKidGeometry3d(c:MathRoboCommand):MathRoboCommand|undefined{
 if(c.mode!=='geometry3d')return;
 const opacity=c.normalizedPhrase.match(/^(?:set|change) (?:its|the (?:sphere|cube|cylinder|cone)) opacity to ([+-]?(?:\d+(?:\.\d+)?|\.\d+))(%?)$/);
 if(opacity){c.action='CHANGE';c.subAction='OPACITY';c.target=targetFromPhrase(c.normalizedPhrase);c.parameters={opacity:Number(opacity[1])/(opacity[2]?100:1)};return c;}
 const lesson=matchKidGeometry3d(c.rawPhrase);if(!lesson)return;
 const row=questions[lesson.id-1];c.action=row.mutates?'CONSTRUCT':'FIND';c.subAction='KID_3D';c.parameters={kid3d:lesson};
 if([149,150,153,291,292].includes(lesson.id)){
  c.action=lesson.id===291?'SCALE':'ROTATE';c.subAction=lesson.id===291?'UNIFORM':'OBJECT';c.target=lesson.id===150?{type:'cube'}:[291,292].includes(lesson.id)?'lastReferenced':'selected';
  c.parameters={kid3d:lesson,...(lesson.id===149?{angle:lesson.numbers[0]}:{}),kidRequireAxis:true};
 }
 if(lesson.id===153){c.target={type:'cube'};c.parameters.multiple=true;c.parameters.anchor='origin';}
 if([136,270,280].includes(lesson.id)){c.action='MOVE';c.subAction='OBJECT';c.target=lesson.id===280?{type:'point',name:lesson.names.B??'B'}:'selected';c.parameters={kid3d:lesson,...(lesson.id===270?{multiple:true}:{})};}
 if(lesson.id===169){c.action='CHANGE';c.subAction='WIDTH';c.target={type:'cuboid'};c.parameters={kid3d:lesson,kidRequireWidth:true};}
 if(lesson.id===188){c.action='CHANGE';c.subAction='OPACITY';c.target={type:'cylinder'};}
 if([293,294,295].includes(lesson.id)){c.action=lesson.id===294?'REDO':'UNDO';c.subAction='LAST';c.parameters={kid3d:lesson,...(lesson.id===295?{onlyColor:true}:{})};}
 return c;
}

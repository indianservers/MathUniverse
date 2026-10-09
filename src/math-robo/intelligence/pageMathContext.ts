import {pageKnowledge} from './contextKnowledge';
import type {RoboSceneContext} from './types';
export interface PageMathContext {
  schemaVersion:1;scope:string;route:string;topic?:string;vocabulary:string;
  selectedObjects:{id:string;type:string;label?:string;angleDegrees?:number;expression?:string}[];
  assumptions:string[];constraints:string[];
  reviewed?:{definition:string;formula?:string;proof?:string;example?:string;source:string};
  coverage:'reviewed-topic'|'workspace-only';
}
/** Adapter over existing reviewed metadata and native scene; no inferred page theorem. */
export function pageMathContext(route:string,scene:RoboSceneContext):PageMathContext{
  const page=pageKnowledge(route);return {schemaVersion:1,scope:`${scene.activeMode}:${route}`,route,topic:page?.title,vocabulary:page?.vocabulary??'',selectedObjects:scene.objects.filter(o=>scene.selectedIds.includes(o.id)).map(o=>({id:o.id,type:o.type,label:o.label,angleDegrees:o.command.roboAngle?.degrees,expression:o.command.expression})),assumptions:[],constraints:scene.objects.flatMap(o=>o.command.roboDependency?[`${o.id}: ${o.command.roboDependency.kind}(${o.command.roboDependency.parents.map(p=>p.objectId).join(', ')})`]:[]),reviewed:page?.definition?{definition:page.definition,formula:page.formula,proof:page.proof,example:page.example,source:page.source}:undefined,coverage:page?.definition?'reviewed-topic':'workspace-only'};
}
export function groundedPageQuestion(question:string,context:PageMathContext):{status:'success'|'unsupported'|'ambiguous';message:string}|undefined{
  const q=question.toLowerCase().trim().replace(/[?.]+$/,'');
  if(/^what is (?:this|the selected) angle$/.test(q)){const angles=context.selectedObjects.filter(o=>o.angleDegrees!==undefined);return angles.length===1?{status:'success',message:`The selected angle measures ${angles[0].angleDegrees} degrees.`}:{status:'ambiguous',message:'Select one angle to read its current measurement.'};}
  if(/^what is (?:this|the selected) expression$/.test(q)){const expressions=context.selectedObjects.filter(o=>o.expression);return expressions.length===1?{status:'success',message:expressions[0].expression!}:{status:'ambiguous',message:'Select one expression or graph.'};}
  const kind=/^(?:explain this(?: (?:page|topic))?|what are we studying here)$/.test(q)?'definition':/^what is (?:the |this )?formula$/.test(q)?'formula':/^(?:prove this|show the proof for this topic)$/.test(q)?'proof':/^give an example of this topic$/.test(q)?'example':undefined;
  if(!kind)return undefined;
  const text=context.reviewed?.[kind];return text?{status:'success',message:`${context.topic}: ${text}`}:{status:'unsupported',message:`No reviewed ${kind} is registered for this page. Ask a specific mathematical question or select a workspace object.`};
}

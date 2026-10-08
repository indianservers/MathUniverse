import { interpretVisualRequest } from '../../offline-intelligence/commands';
import { contextualRequest } from '../../offline-intelligence/objectConversation';
import { FLAT_SHAPES,SOLID_SHAPES } from '../../offline-intelligence/shapeCatalog';
import { operationFor } from './actionRegistry';
import { resolveTarget } from './targetResolver';
import type { MathRoboPlan,RoboSceneContext } from './types';
export const V3_MIGRATION=Object.fromEntries([...FLAT_SHAPES,...SOLID_SHAPES,'point','line','plot','midpoint','length','tangent','anchor','update','unsupported'].map(label=>[label,{action:label==='midpoint'||label==='length'?'FIND':label==='tangent'?'CONSTRUCT':label==='update'?'CHANGE':label==='plot'?'PLOT':label==='unsupported'?'UNSUPPORTED':'CREATE',subAction:label==='plot'?'FUNCTION':label==='update'?'COLOR':label.toUpperCase()}]));
export function migrateCompatibilityPlan(plan:MathRoboPlan,scene:Readonly<RoboSceneContext>):MathRoboPlan {
  if(plan.commands.length!==1)return plan;const c=plan.commands[0],text=c.normalizedPhrase;
  // Missing semantic slots belong to the conversational follow-up engine.
  if(['MOVE','ROTATE','SCALE'].includes(c.action)&&operationFor(c.action,c.subAction)?.implemented)return plan;
  if(c.action==='CREATE'&&/\b(start|starting|begin)\b.*\b(end|vertex|corner)\b/.test(text)){
    const result=contextualRequest(c.rawPhrase,c.mode,scene.objects.map(o=>({command:o.command,vertices:o.vertices})));
    if(result?.command)c.parameters={legacy:result.command,width:result.command.width,height:result.command.height,radius:result.command.radius,points:result.command.points};
  }
  const op=operationFor(c.action,c.subAction),missing=op?.required.some(key=>c.parameters[key]===undefined);
  if((!op?.implemented||missing)&&/\b(resize|scale|enlarge|shrink|grow|increase|decrease|reduce|double|halve|rotate|turn|tilt|recolor|colour|color|move|translate|bigger|smaller)\b/.test(text)&&!/^(?:what|find|is|are)/.test(text)){
    try{
      const target=resolveTarget(c.target,scene as RoboSceneContext),before=target.command,after=interpretVisualRequest(c.rawPhrase,c.mode,before).command;
      if(after?.action==='update'){
        c.target=target.id;
        if(after.color!==before.color){c.action='CHANGE';c.subAction='COLOR';c.parameters={color:after.color};}
        else if(after.scale!==before.scale){c.action='SCALE';c.subAction='UNIFORM';c.parameters={factor:(after.scale??1)/(before.scale??1)};}
        else if(JSON.stringify(after.rotation)!==JSON.stringify(before.rotation??[0,0,0])){const axis=(after.rotation??[0,0,0]).findIndex((n,i)=>n!==(before.rotation?.[i]??0));c.action='ROTATE';c.subAction='OBJECT';c.parameters={axis:'xyz'[axis],angle:after.rotation![axis]-(before.rotation?.[axis]??0)};}
        else if(JSON.stringify(after.points)!==JSON.stringify(before.points)){c.action='MOVE';c.subAction='OBJECT';const a=before.points[0]??(c.mode.endsWith('3d')?[0,0,0]:[0,0]);c.parameters={vector:after.points[0].map((n,i)=>n-a[i])};}
        else {c.action='RESIZE';c.subAction='OBJECT';c.parameters={width:after.width,height:after.height,radius:after.radius,depth:after.depth};}
      }
    }catch{/* Preserve ambiguity/validation; compatibility must never pick a random target. */}
  }
  return plan;
}

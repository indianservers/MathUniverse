import {pointDistanceNames} from './pointDistanceLanguage';
import type {PendingCommand} from './conversationEngine';
import type {MathRoboPlan,RoboSceneContext,RoboObjectDescriptor} from './types';

export function isDistanceFollowup(text:string,scene:RoboSceneContext):boolean{
  const q=text.trim().replace(/[?.!]+$/,'').toLowerCase();
  return /^(?:again|recalculate(?: (?:the )?distance)?|what about now|and now|why|how|explain(?: that| in detail| briefly)?|show (?:the )?(?:steps|calculation)|how did you get that|(?:measure|calculate|find) another (?:pair|distance)|(?:what about|how about|and) .+|(?:is it|is the distance|my answer is)\s+-?\d+(?:\.\d+)?(?:\s+units?)?)$/.test(q)||scene.objects.some(o=>o.type==='point'&&(o.id===text.trim()||o.label?.toLowerCase()===q));
}

export function distanceConversation(text:string,plan:MathRoboPlan,scene:RoboSceneContext,pending:PendingCommand|undefined,last:string[]|undefined):{plan:MathRoboPlan;pending?:PendingCommand;message?:string}|undefined{
  const raw=text.trim().replace(/[?.!]+$/,''),q=raw.toLowerCase(),command=plan.commands[0];
  const points=scene.objects.filter(o=>o.type==='point'&&o.command.roboVisible!==false&&(!o.command.roboDefinitionState||o.command.roboDefinitionState.status==='defined'));
  const find=(token:string)=>{const exact=points.find(o=>o.id===token);if(exact)return [exact];return points.filter(o=>o.label?.toLowerCase()===token.toLowerCase());};
  const active=pending?.slot==='distancePoints';
  const named=command?.subAction==='DISTANCE'?pointDistanceNames(text):undefined;
  const another=/^(?:measure|calculate|find) another (?:pair|distance)$/.test(q);
  const followPair=last&&q.match(/^(?:what about|how about|and) (.+)$/)?.[1];
  const revised=followPair?pointDistanceNames('distance between '+followPair):undefined;
  const repeat=last&&!active&&/^(?:again|recalculate(?: (?:the )?distance)?|what about now|and now|why|how|explain(?: that| in detail| briefly)?|show (?:the )?(?:steps|calculation)|how did you get that)$/.test(q);
  const check=last&&!active&&q.match(/^(?:is it|is the distance|my answer is)\s+(-?\d+(?:\.\d+)?)(?:\s+units?)?$/);
  const distanceRequest=(points.length>0||/\bpoints?\b/i.test(text))&&plan.commands.length===1&&command?.action==='FIND'&&command.subAction==='DISTANCE'&&!/\b(?:origin|lines?|parallel|circle|plane)\b/i.test(text);
  const explicit=!!named||!!revised||another||!!repeat||!!check||distanceRequest;
  const bare=last&&/^(?:point\s+)?[a-z][a-z0-9_]*$/i.test(raw)&&find(raw.replace(/^point\s+/i,'')).length>0;
  if(!active&&!explicit&&!bare)return;
  if(active&&/^(?:cancel|stop|no|never mind|nevermind)$/.test(q))return {plan:{...pending.plan,commands:[]},message:'Distance request cancelled.'};
  // A fresh, explicit task replaces the measurement; choosing a point never does.
  if(active&&!explicit&&!/^(?:select|use|choose)\b/.test(q)&&/^(?:move|translate|rotate|draw|create|delete|clear|color|colour|scale|reflect|undo|redo|find|calculate|what|where|how)\b/.test(q))return {plan};
  const next:MathRoboPlan=structuredClone(explicit?plan:active?pending.plan:plan);
  const seed=next.commands[0]??command;
  if(!seed)return;
  next.commands=[{...seed,action:'FIND',subAction:'DISTANCE',requiresExecution:true,target:{type:'point'},targets:undefined,parameters:{multiple:true},confidence:{overall:1,action:1,subAction:1},source:{action:'rule',subAction:'rule'}}];
  const c=next.commands[0];
  let chosen:string[]=explicit?[]:active?(pending.plan.commands[0].parameters.distancePointIds as string[]??[]):[];
  chosen=chosen.filter(id=>points.some(o=>o.id===id));
  const ask=(notice='')=>{
    c.parameters.distancePointIds=chosen;
    const first=points.find(o=>o.id===chosen[0]);
    const question=notice+(first?`First point: ${first.label??first.id} (${first.position.join(', ')}). Choose the second point to calculate the distance.`:'Choose two points to measure their distance. Choose the first point, or reply with both names, such as “C and D”.');
    const waiting:PendingCommand={plan:structuredClone(next),index:0,slot:'distancePoints',question,options:points.filter(o=>!chosen.includes(o.id)).map(o=>o.id),references:[...chosen]};
    return {plan:next,pending:waiting,message:question};
  };
  const complete=()=>{c.targets=chosen.map(id=>({type:'point',id}));delete c.parameters.distancePointIds;if(check)c.parameters.expectedDistance=Number(check[1]);return {plan:next};};
  if(repeat||check){chosen=last!.filter(id=>points.some(o=>o.id===id));return chosen.length===2?complete():ask('A previously measured point is no longer available. ');}
  const names=named??revised;
  if(names){for(const label of names){const matches=find(label);if(matches.length!==1)return ask(matches.length?`More than one point is named ${label.toUpperCase()}. Choose the intended point. `:`Point ${label.toUpperCase()} was not found on this board. `);if(!chosen.includes(matches[0].id))chosen.push(matches[0].id);}return chosen.length===2?complete():ask('Choose two different points. ');}
  if(distanceRequest&&!another){const selected=points.filter(o=>scene.selectedIds.includes(o.id));if(selected.length>2)return ask('More than two points are selected. ');chosen=selected.map(o=>o.id);if(chosen.length===2)return complete();if(chosen.length===1)return ask();
    const partial=raw.match(/\b(?:from|between|of)\s+(?:point\s+)?([a-z][a-z0-9_]*)$/i)?.[1];if(partial&&find(partial).length===1){chosen=[find(partial)[0].id];return ask();}
    if(points.length===2){chosen=points.map(o=>o.id);return complete();}
  }
  if(another)return ask();
  let reply=raw.replace(/^(?:select|use|choose)\s+/i,'').replace(/^(?:and|then)\s+/i,'').replace(/\bpoints?\s+/gi,'').trim();
  const ordinal=reply.toLowerCase().match(/^(?:the )?(first|second|third|fourth)(?: one)?$/)?.[1];
  if(active&&(ordinal||/^\d+$/.test(reply))){const i=ordinal?['first','second','third','fourth'].indexOf(ordinal):Number(reply)-1;reply=pending.options[i]??'';}
  const tokens=points.some(o=>o.id===reply)?[reply]:reply.split(/\s*(?:,|\band\b|\bto\b|&)\s*/i).filter(Boolean);
  if(!tokens.length||tokens.length>2)return ask('Please choose point names from the list. ');
  const additions:RoboObjectDescriptor[]=[];
  for(const token of tokens){const matches=find(token);if(matches.length!==1)return ask(matches.length?'That label matches several points. Choose a point from the list. ':'That is not an available point. Choose a point from the list. ');additions.push(matches[0]);}
  for(const point of additions){if(chosen.includes(point.id))return ask(`${point.label??point.id} is already chosen. `);chosen.push(point.id);}
  return chosen.length===2?complete():ask();
}

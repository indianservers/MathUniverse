import {COLORS} from '../../offline-intelligence/shapeCatalog';
import type {MathRoboCommand,RoboTarget} from './types';
const entities='circles?|triangles?|polygons?|points?|lines?|segments?|rays?|vectors?|rectangles?|squares?|spheres?|cubes?|objects?|shapes?';
const colors=Object.keys(COLORS).sort((a,b)=>b.length-a.length).join('|');
/** Explicit group scopes never fall back to the previously referenced object. */
export function parseBulkEdit(command:MathRoboCommand):MathRoboCommand|undefined{
 const t=command.normalizedPhrase.replace(/^(?:please|kindly|can you|could you)\s+/,'').replace(/[.!?]+$/,'');
 const scope=t.match(new RegExp(`\\b(all(?: of)?(?: the)?|every|each(?: of the)?|both(?: of the)?|the selected)\\s+(selected\\s+)?(?:(${colors})\\s+)?(${entities})\\b`));
 if(!scope)return;
 // Refuse unimplemented exclusions instead of editing a broader set.
 if(/\b(?:except|excluding|but|other than)\b/.test(t)){command.action='CHANGE';command.subAction='COLOR';command.parameters.multiple=true;command.parameters.bulkEdit=true;command.parameters.parseError='Name the exact group to edit; exclusions in this bulk-edit form are not supported yet.';return command;}
 const noun=scope[4].replace(/s$/,''),type=['object','shape'].includes(noun)?undefined:noun==='segment'?'line':noun;
 const target:Exclude<RoboTarget,string>={...(type?{type}:{}),...(scope[3]?{color:scope[3]}:{}),...(/selected/.test(scope[0])?{selected:true}:{}),...(noun==='segment'?{linearExtent:'segment' as const}:{})};
 const p=command.parameters;let action='',subAction='OBJECT';
 const palette=[...t.replace(scope[0],'').matchAll(new RegExp(`\\b(${colors})\\b`,'g'))];
 const color=palette.at(-1)?.[1];
 if(/^(?:hide|conceal)\b/.test(t)||/^(?:make|set)\b.*\binvisible$/.test(t))action='HIDE';
 else if(/^(?:show|reveal|unhide|display)\b/.test(t)||/^(?:make|set)\b.*\bvisible$/.test(t))action='SHOW';
 else if(/^(?:unlock|unfreeze)\b/.test(t)||/^(?:make|set)\b.*\b(?:unlocked|movable)$/.test(t))action='UNLOCK';
 else if(/^(?:lock|freeze)\b/.test(t)||/^(?:make|set)\b.*\b(?:locked|immovable)$/.test(t))action='LOCK';
 else if(/\b(?:thicker|thinner|stroke width|line width|outline width)\b/.test(t)){
  action='CHANGE';subAction='LINE_WIDTH';
  const width=t.match(/(?:width(?: of)?|to)\s+(\d+(?:\.\d+)?)\s*(?:px|pixels?)?$/)?.[1];
  if(width)p.lineWidth=Number(width);else if(/thicker/.test(t))p.lineWidthFactor=2;else if(/thinner/.test(t))p.lineWidthFactor=.5;else p.parseError='Provide a stroke width in pixels.';
 }else if(color&&/^(?:change|set|make|color|colour|recolor|recolour|paint|fill|give|use|apply)\b/.test(t)){
  action='CHANGE';subAction=/\b(?:fill|interior|inside)\b/.test(t)?'FILL_COLOR':/\b(?:outlines?|strokes?|borders?)\b/.test(t)?'STROKE_COLOR':'COLOR';p.color=color;
 }else return;
 command.action=action;command.subAction=subAction;command.target=target;p.multiple=true;p.bulkEdit=true;
 return command;
}

import { interpretVisualRequest } from '../../offline-intelligence/commands';
import { COLORS, FLAT_SHAPES, SOLID_SHAPES } from '../../offline-intelligence/shapeCatalog';
import { LANGUAGE_ACTIONS, normalizeAction } from './actionRegistry';
import { coordinates, directionVector, normalizeLanguage, NUMBER_PATTERN, numberAfter, parseNumber } from './numberParser';
import { targetFromPhrase } from './targetResolver';
import type { MathRoboCommand, MathRoboPlan, RoboMode, RoboTarget } from './types';
import {parseExtensions} from './semanticExtensions';
import {classifyRequest} from './requestClassifier';
const queryWords: Record<string,string> = { 'surface area':'SURFACE_AREA','x intercept':'X_INTERCEPT','y intercept':'Y_INTERCEPT','midpoint':'MIDPOINT','distance':'DISTANCE','how far':'DISTANCE','length':'LENGTH','circumference':'CIRCUMFERENCE','perimeter':'PERIMETER','area':'AREA','volume':'VOLUME','slope':'SLOPE','center':'CENTER','centre':'CENTER','radius':'RADIUS','diameter':'DIAMETER','centroid':'CENTROID','roots':'ROOTS','root':'ROOTS','intersect':'INTERSECTION','intersection':'INTERSECTION' };
export function splitUtterance(phrase:string):string[] {
  // Mask coordinate/function parentheses, then split only before an action word.
  let depth=0;const marks:Array<number>=[];
  const verbs='join|connect|put|draw|create|make|mark|show|hide|find|calculate|move|translate|rotate|reflect|scale|resize|change|set|select|deselect|delete|remove|duplicate|copy|plot|check|compare|count|undo|redo|what|where|are|is|construct|color|colour';
  const separator=new RegExp(`^(?:[,;]\\s*|\\s+(?:and|then|after that|next|also|but|followed by)\\s+)(?=(?:${verbs})\\b)`,'i');
  for(let i=0;i<phrase.length;i++){if(phrase[i]==='('||phrase[i]==='['||phrase[i]==='{')depth++;if(phrase[i]===')'||phrase[i]===']'||phrase[i]==='}')depth--;if(depth===0){const match=phrase.slice(i).match(separator);if(match){marks.push(i,i+match[0].length);i+=match[0].length-1;}}}
  if(!marks.length)return [phrase.trim()];const result:string[]=[];let start=0;
  for(let i=0;i<marks.length;i+=2){result.push(phrase.slice(start,marks[i]).trim());start=marks[i+1];}result.push(phrase.slice(start).trim());return result.filter(Boolean);
}
function detectedVerb(text:string) {
  const aliases:Record<string,string>={embed:'PLOT',sketch:'DRAW',build:'CREATE',make:'CREATE',turn:'ROTATE',recolor:'CHANGE',colour:'COLOR',enlarge:'SCALE',halve:'SCALE',double:'SCALE'};
  const word=text.replace(/^(?:please|can you|could you|i need|i want)\s+/,'').match(/^([a-z]+)/)?.[1]??'';
  return aliases[word]??(LANGUAGE_ACTIONS.includes(word.toUpperCase())?word.toUpperCase():'');
}
export function parseSemanticCommand(rawPhrase:string,mode:RoboMode):MathRoboCommand {
  const text=normalizeLanguage(rawPhrase).replace(/[?.]+$/,'').replace(/^(?:please|kindly|can you|could you)\s+/,'').replace(/\s+please$/,'').replace(/\bwhose radius is\b/g,'radius').replace(/\br\s*=\s*/g,'radius ').replace(/\br\s+(?=\d)/g,'radius ').replace(/radius-(\d+)/g,'radius $1').replace(/\b(\d+(?:\.\d+)?) units? radius\b/g,'radius $1').replace(/^draw c with /,'draw circle with ').replace(/^put a circle/,'create a circle');
  const dimension=mode.endsWith('3d')?3:2;
  const command:MathRoboCommand={id:crypto.randomUUID(),rawPhrase,normalizedPhrase:text,detectedAction:detectedVerb(text),action:'',subAction:'',mode,parameters:{},confidence:{overall:1,action:1,subAction:1,parameters:1},source:{action:'rule',subAction:'rule'},requiresExecution:true};
  const p=command.parameters;
  const color=text.match(new RegExp(`\\b(${Object.keys(COLORS).join('|')})\\b`))?.[1];
  const query=/\b(?:cross|crosses|crossing)\b.*\bx[ -]axis\b/.test(text)?'X_INTERCEPT':/\b(?:cross|crosses|crossing)\b.*\by[ -]axis\b/.test(text)?'Y_INTERCEPT':Object.entries(queryWords).find(([word])=>new RegExp(`\\b${word.replace(' intercept','[ -]intercepts?')}\\b`).test(text))?.[1];
  const isCompare=/^which.*(?:larger|smaller)|\bcompare\b/.test(text);
  const isQuery=!isCompare&&(/^(?:what|where|how|tell me)|\b(find|measure|calculate)\b/.test(text));
  const pts=coordinates(text,dimension);
  const target=targetFromPhrase(text);
  command.target=target;
  if(['CONVERSATION','AMBIGUOUS'].includes(classifyRequest(rawPhrase))||(classifyRequest(rawPhrase)==='UNSUPPORTED'&&!command.detectedAction&&!/^[xyz]\s*=|^[0-9(]/.test(text))){command.action='UNSUPPORTED';command.subAction='OBJECT';command.confidence.overall=0;command.requiresExecution=false;return command;}
  const extended=parseExtensions(command);if(extended)return extended;
  if(classifyRequest(rawPhrase)==='EXPLANATION_REQUEST'){command.action='UNSUPPORTED';command.subAction='OBJECT';command.requiresExecution=false;return command;}
  if(new RegExp(`^(?:show|display)(?: me)?\\s+(?:a |an )?(?:${[...FLAT_SHAPES,...SOLID_SHAPES].join('|')})\\b`).test(text)){
    const create=parseSemanticCommand(text.replace(/^(?:show|display)(?: me)?/,'Create'),mode);return {...create,rawPhrase,detectedAction:'SHOW'};
  }
  if(/^create (?:a )?point at (?:the )?(midpoint|center|intersection|it)/.test(text)){command.action='MARK';command.subAction=query??'POINT';command.target=query==='MIDPOINT'?{type:'line',index:-1}:query==='CENTER'?{type:'circle',reference:'lastReferenced'}:'$previousResult';return command;}
  if(/^(?:undo|redo)\b/.test(text)){command.action=text.startsWith('undo')?'UNDO':'REDO';command.subAction='LAST';return command;}
  if(classifyRequest(rawPhrase)!=='QUERY'&&/\b(perpendicular|parallel|tangent)\b/.test(text)&&/\b(draw|create|construct|add|put)\b|^(?:perpendicular|parallel|tangent)/.test(text)){
    command.action='CONSTRUCT';command.subAction=/bisector/.test(text)?'PERPENDICULAR_BISECTOR':/perpendicular/.test(text)?'PERPENDICULAR':/parallel/.test(text)?'PARALLEL':'TANGENT';
    command.target=typeof target==='object'&&target.name?target:{type:command.subAction==='TANGENT'?'circle':'line',index:-1};p.through=/midpoint/.test(text)?'midpoint':'previousResult';p.position=pts[0];p.angle=numberAfter(text,'angle|at')??0;return command;
  }
  if(/^(?:are|is|check|test|verify)\b/.test(text)) {
    command.action='CHECK';command.subAction=/perpendicular/.test(text)?'PERPENDICULAR':/parallel/.test(text)?'PARALLEL':/inside/.test(text)?'POINT_INSIDE':/on.*circle/.test(text)?'POINT_ON_CIRCLE':/on.*line/.test(text)?'POINT_ON_LINE':/equal.*area/.test(text)?'EQUAL_AREA':/equal.*length/.test(text)?'EQUAL_LENGTH':/intersect/.test(text)?'INTERSECTING':'UNSUPPORTED';p.multiple=true;const pointName=text.match(/\b(?:point\s+|if\s+)([a-z]\d*)\s+(?:is|on|inside)/)?.[1];if(pointName&&command.subAction.startsWith('POINT_'))command.targets=[pointName,{type:command.subAction==='POINT_ON_LINE'?'line':'circle',index:-1}];return command;
  }
  if(classifyRequest(rawPhrase)==='COMMAND'&&/\b(mark|show|display)\b/.test(text)&&(query||/\b(it|those|intersection points)\b/.test(text))) {
    command.action=/\bmark\b/.test(text)?'MARK':'SHOW';command.subAction=query??(/mark/.test(text)?'POINT':'OBJECT');
    if(command.subAction==='POINT')command.target='$previousResult';return command;
  }
  if(isQuery&&query){command.action='FIND';command.subAction=query;p.multiple=['DISTANCE','INTERSECTION'].includes(query);
    const names=text.match(/between\s+([a-z][\w]*)\s+and\s+([a-z][\w]*)/);if(names)command.targets=[names[1],names[2]];
    if(query==='INTERSECTION'&&/line.*circle|circle.*line/.test(text))command.targets=[{type:'line',index:-1},{type:'circle',index:-1}];
    if(query==='DISTANCE')command.target={type:/point/.test(text)?'point':'line'};
    return command;
  }
  if(/\b(which|compare)\b/.test(text)){command.action='COMPARE';command.subAction=query??'SIZE';p.multiple=true;return command;}
  if(/^count\b|^how many/.test(text)){command.action='COUNT';command.subAction=/vertices/.test(text)?'VERTICES':/points/.test(text)?'POINTS':/lines/.test(text)?'LINES':/shapes/.test(text)?'SHAPES':'OBJECTS';return command;}
  if(classifyRequest(rawPhrase)==='QUERY'||isQuery){command.action='UNSUPPORTED';command.subAction='OBJECT';command.requiresExecution=false;return command;}
  if(/\b(delete|remove|clear|reset)\b/.test(text)){command.action='DELETE';command.subAction=/all|everything|clear|reset/.test(text)?'ALL':'OBJECT';p.multiple=/\b(both|them|those)\b/.test(text);return command;}
  if(/^deselect/.test(text)){command.action='DESELECT';command.subAction='ALL';return command;}
  if(/^select\b/.test(text)){command.action='SELECT';command.subAction=/all|everything/.test(text)?'ALL':'OBJECT';p.multiple=/\bboth\b/.test(text);return command;}
  if((/^hide\b|^show\b|^display\b/.test(text))&&!/\bgraph\s+of\b|[yz]\s*=/.test(text)){command.action=text.startsWith('hide')?'HIDE':'SHOW';command.subAction='OBJECT';return command;}
  if(/^duplicate\b|^copy\b|\bmake a copy\b/.test(text)){command.action='DUPLICATE';command.subAction='OBJECT';return command;}
  if(/\breflect|\bflip/.test(text)){command.action='REFLECT';command.subAction=/xy[ -]?plane/.test(text)?'XY_PLANE':/xz[ -]?plane/.test(text)?'XZ_PLANE':/yz[ -]?plane/.test(text)?'YZ_PLANE':/x[ -]?axis/.test(text)?'X_AXIS':/y[ -]?axis/.test(text)?'Y_AXIS':/origin/.test(text)?'ORIGIN':'LINE';return command;}
  if(/\b(move|translate)\b/.test(text)){command.action='MOVE';command.subAction='OBJECT';p.vector=pts[0]??directionVector(text,dimension);p.multiple=/\b(them|those|both|everything|all objects)\b/.test(text);[p.dx,p.dy,p.dz]=p.vector;if(/\bto\b/.test(text)&&pts.length)p.absolute=true;
    if(!pts.length&&p.vector.every(value=>value===0))p.parseError=`Provide ${dimension} destination coordinates, such as ${dimension===3?'(4,0,0)':'(4,0)'}, or a movement direction and distance.`;
    return command;}
  if(/\b(rotate|turn|tilt)\b/.test(text)&&!color){command.action='ROTATE';command.subAction='OBJECT';const angle=text.replace(/\b[a-z]+\d+\b/g,'').match(new RegExp(NUMBER_PATTERN));p.angle=angle?parseNumber(angle[0]):undefined;if(/radians/.test(text)&&p.angle!==undefined)p.angle=p.angle*180/Math.PI;if(/clockwise/.test(text)&&!/counterclockwise|anticlockwise/.test(text)&&p.angle!==undefined)p.angle=-p.angle;p.axis=text.match(/\b([xyz])[ -]?axis/)?.[1]??'z';return command;}
  if(/\b(scale|double|halve|twice|enlarge|shrink)\b/.test(text)){command.action='SCALE';command.subAction='UNIFORM';p.factor=/double|twice/.test(text)?2:/halve/.test(text)?.5:numberAfter(text,'by|factor|scale|shrink');return command;}
  if(/\b(change|set|resize|make|color|colour|recolor|rename|label)\b/.test(text)&&(!/\b(draw|create|add)\b/.test(text))&&(color||/its|\bit\b|that|this|change|set|resize|rename/.test(text))){
    command.action=/resize/.test(text)?'RESIZE':'CHANGE';command.subAction=command.action==='RESIZE'?'OBJECT':color?'COLOR':/diameter/.test(text)?'DIAMETER':/radius/.test(text)?'RADIUS':/width/.test(text)?'WIDTH':/height/.test(text)?'HEIGHT':/depth/.test(text)?'DEPTH':/label|rename/.test(text)?'LABEL':/coordinates/.test(text)?'COORDINATES':pts.length?'POSITION':'OBJECT';
    p.color=color;for(const key of ['width','height','depth','radius','diameter'] as const)p[key]=numberAfter(text,key);p.position=pts[0];p.label=text.match(/(?:label|rename).*?(?:to|as)\s+([\w-]+)$/)?.[1];return command;
  }
  if(/\b(plot|graph)\b|[yz]\s*=/.test(text)&&!isQuery){
    command.action='PLOT';command.subAction=dimension===3?'SURFACE_3D':'FUNCTION';p.expression=text.replace(/^(?:plot|graph|draw (?:a )?graph of|show graph of|create a graph of|embed graph of)\s*/,'').replace(/^[yz]\s*=\s*/,'').trim().replace(/(\d)([xy])/g,'$1*$2');p.color=color;return command;
  }
  const kind=text.match(new RegExp(`\\b(${[...FLAT_SHAPES,...SOLID_SHAPES,'point','line','segment','ray','vector','plane','arc','sector'].join('|')})s?\\b`))?.[1];
  if(kind&&(!isQuery||/^create|^draw/.test(text))){
    command.action='CREATE';command.subAction=(kind==='segment'?'line':kind).toUpperCase();
    let canonical=text.replace(new RegExp(NUMBER_PATTERN,'g'),value=>String(parseNumber(value)));
    canonical=canonical.replace(new RegExp(`\\b${kind}s\\b`,'g'),kind);
    if(new RegExp(`\\b${kind}s\\b`).test(text))p.count=numberAfter(text,'draw|create|make|add')??2;
    if(kind==='line'&&pts.length===2)canonical=`Draw line (${pts[0].join(',')}) to (${pts[1].join(',')})`;
    if(kind==='point'&&pts.length===1)canonical=`Create point (${pts[0].join(',')})`;
    const legacy=interpretVisualRequest(canonical,mode);if(legacy.command){p.legacy=legacy.command;p.width=legacy.command.width;p.height=legacy.command.height;p.radius=legacy.command.radius;p.depth=legacy.command.depth;p.sides=legacy.command.sides;}else p.parseError=legacy.message;
    if(/centered there|centred there|at that point|at the midpoint/.test(text))p.atPreviousResult=true;
    p.color=color;const name=rawPhrase.match(/\b(?:point|line|circle)\s+([A-Za-z]\d*|[A-Za-z]{2})\b/)?.[1];p.label=name&&!['to','at','of','on','by','is','as','in'].includes(name.toLowerCase())?name:undefined;
    const numbers=text.match(new RegExp(`(${NUMBER_PATTERN})\\s*(?:by|×)\\s*(${NUMBER_PATTERN})`));
    if(numbers){p.width=parseNumber(numbers[1]);p.height=parseNumber(numbers[2]);}
    for(const key of ['width','height','depth','radius','diameter','sides'] as const){const value=numberAfter(text,key);if(value!==undefined)p[key]=value;}
    const side=numberAfter(text,'side|side length');if(side!==undefined)p.width=side;
    if(kind==='triangle'&&/equilateral/.test(text)&&side!==undefined){p.points=[[0,0],[side,0],[side/2,side*Math.sqrt(3)/2]];p.height=side*Math.sqrt(3)/2;}
    if(kind==='square'||kind==='cube')p.height=p.depth=p.width;
    if(pts.length)p.points=pts;
    const labels=[...rawPhrase.matchAll(/\b([A-Za-z]\d*)\s*\(/g)].map(match=>match[1]);if(kind==='triangle'&&labels.length===3)p.vertexLabels=labels;
    const namedTriangle=rawPhrase.match(/\btriangle\s+([A-Za-z]{3})\b/);if(kind==='triangle'&&namedTriangle){p.vertexLabels=namedTriangle[1].toUpperCase().split('');p.label=namedTriangle[1].toUpperCase();}
    return command;
  }
  command.action=normalizeAction(command.detectedAction||'UNHANDLED');command.subAction='OBJECT';command.confidence.overall=command.action==='UNHANDLED'?0:1;return command;
}
export function parseSemanticPlan(phrase:string,mode:RoboMode):MathRoboPlan {
  const commands=splitUtterance(phrase).map(part=>parseSemanticCommand(part,mode));
  return {rawPhrase:phrase,commands,confidence:Math.min(...commands.map(c=>c.confidence.overall))};
}
export function explicitTargets(command:MathRoboCommand):RoboTarget[]|undefined { return command.targets; }

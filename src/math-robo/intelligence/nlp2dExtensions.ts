import {coordinates,numberAfter,NUMBER_PATTERN,parseNumber} from './numberParser';
import {COLORS} from '../../offline-intelligence/shapeCatalog';
import {targetFromPhrase} from './targetResolver';
import type {MathRoboCommand} from './types';
/** General compositional grammar. No dataset IDs or sentence/answer table. */
export function parse2dLanguage(c:MathRoboCommand):MathRoboCommand|undefined{
 if(c.mode.endsWith('3d'))return;
 const t=c.normalizedPhrase,p=c.parameters,pts=coordinates(t,2),set=(action:string,subAction:string)=>{c.action=action;c.subAction=subAction;c.target??=targetFromPhrase(t);return c;};
 if(/^mark (?:it|that)(?: as)?\s+[a-z][\w-]*[.!?]*$/.test(t)){p.label=c.rawPhrase.match(/(?:as\s+)?([\w-]+)[.!?]*$/)?.[1];c.target='$previousResult';return set('MARK','POINT');}
 if(/^mark\b.*\b(?:their|intersection)\b/.test(t)&&/intersection/.test(t)){p.intersectionRequested=!/those|these/.test(t);p.multiple=true;return set('MARK','INTERSECTION');}
 if(/^(?:connect|join)\b.*\bboth points\b.*\borigin\b/.test(t)){p.originConnections=true;p.count=2;return set('CREATE','SEGMENT');}
 if(/^(?:draw|construct|create)\b.*\bperpendicular\b.*\bbase\b/.test(t)){p.throughPoint=t.match(/from\s+([a-z]\d*)/)?.[1];p.conversationReferenceProvided=true;c.target='$edge:bottom';return set('CONSTRUCT','PERPENDICULAR');}
 if(/^reflect\b/.test(t)&&/leave.*original|keep.*original/.test(t)){p.copy=true;c.target=targetFromPhrase(t.replace(/leave.*original.*|keep.*original.*/,'').replace(/\bcopy\b/g,''));return set('REFLECT',/y.axis/.test(t)?'Y_AXIS':'X_AXIS');}
 if(/^(?:draw|construct|create)\b.*\bperpendicular\b.*\bvertex\s+[abc]\b.*\bside\s+[abc]{2}\b/.test(t)){p.from=t.match(/vertex\s+([abc])\b/)?.[1]?.toUpperCase();c.target={type:'triangle',index:-1};return set('CONSTRUCT','ALTITUDE');}
 if(/^extend\b.*\b(?:x|y).axis\b/.test(t)){p.axisIntersection=/x.axis/.test(t)?'x':'y';p.factor=1;c.target={type:'line',index:-1};return set('EXTEND','OBJECT');}
 if(/^(?:color|colour|paint)\b.*\bdifferently\b/.test(t))return set('CHANGE','COLOR');
 if(/\bundo\b.*\bonly\b.*\bcolou?r\b/.test(t)){p.onlyColor=true;return set('UNDO','LAST');}
 if(/\bsides? thicker\b/.test(t)){p.lineWidthFactor=2;p.styleTarget='rays';return set('CHANGE','LINE_WIDTH');}
 if(/\bangle mark\b/.test(t)){p.color=Object.keys(COLORS).find(color=>new RegExp(`\\b${color}\\b`).test(t));p.styleTarget='angleArc';return set('CHANGE','STROKE_COLOR');}
 if(/^(?:draw|create|construct)\s+(?:an? )?angle\b/.test(t)){p.angle=numberAfter(t,'angle(?: of)?');return set('CREATE','ANGLE');}
 if(/\b(?:all (?:3|three)|all its) angles\b/.test(t)){p.impossibleAngles=true;c.target={type:'triangle',reference:'lastReferenced'};return set('CHANGE','ANGLE');}
 if(/\bangle\b/.test(t)&&/^(?:on triangle|set|change|make|increase|decrease|adjust|open|close|widen|narrow)\b/.test(t)||/^(?:increase|decrease)\b.*\bdegrees?\b/.test(t)){
  const name=t.match(/triangle\s+([a-z]\d*)/)?.[1];if(name)c.target={type:'triangle',name};
  p.vertex=t.match(/(?:angle|vertex)\s+([abc])\b/)?.[1]?.toUpperCase();
  const amount=t.match(new RegExp(`(?:to|by)\\s*(?:another\\s+)?(${NUMBER_PATTERN})`))?.[1]??t.match(new RegExp(`(${NUMBER_PATTERN})\\s*(?:more\\s+)?degrees?`))?.[1];if(amount)p.angle=parseNumber(amount);
  p.angleOperation=/\bto\b/.test(t)?'set':/decrease|reduce|close|narrow/.test(t)?'decrement':/increase|open|widen/.test(t)?'increment':'set';if(/percent|%/.test(t))p.angleOperation=String(p.angleOperation)+'Percent';
  return set('CHANGE','ANGLE');
 }
 const shape=t.match(/^(?:draw|create|make|sketch|construct|add|insert|generate|trace)\s+(?:a |an |the )?(?:regular )?(rectangle|square|ellipse|parallelogram|rhombus|pentagon|hexagon)\b/)?.[1];
 if(/^(?:draw|plot|graph)\s+(?:(?:the |a )?line\s+)?y\s*=/.test(t)){p.expression=t.split('=')[1].replace(/\s+on (?:the )?coordinate plane.*$/,'').trim().replace(/(\d)\s*(?=x\b)/g,'$1*');return set('PLOT','FUNCTION');}
 if(/^(?:construct|mark|draw|create)\b.*\bcentroid\b/.test(t))return set('MARK','CENTROID');
 if(/^(?:construct|draw|create)\b.*\bcircle\b.*\btangent\b.*\ball (?:3|three) sides\b/.test(t)){c.target={type:'triangle',index:-1};return set('CONSTRUCT','INCIRCLE');}
 if(/^(?:connect|join)\b.*\bincenter\b.*\bvertex\b/.test(t)){p.triangleCenter='INCENTER';p.vertex=t.match(/vertex\s+([a-z]\d*)/)?.[1];c.target={type:'triangle',index:-1};return set('CREATE','SEGMENT');}
 if(/^(?:mark|find|draw|create)\b.*\bmidpoint\b.*\bsegment\b/.test(t)){const name=t.match(/segment\s+([a-z][a-z0-9]*)/)?.[1];if(name){c.target={type:'line',name};return set('MARK','MIDPOINT');}}
 if(/^if\b.*\blines intersect\b/.test(t)){p.multiple=true;p.color=Object.keys(COLORS).find(color=>new RegExp(`\\b${color}\\b`).test(t));return set('CONSTRUCT','CONDITIONAL_INTERSECTION');}
 if(/^(?:make|color|colour|paint)\b.*\bmidpoint marker\b/.test(t)){p.color=Object.keys(COLORS).find(color=>new RegExp(`\\b${color}\\b`).test(t));c.target={type:'point',index:-1};return set('CHANGE','STROKE_COLOR');}
 if(shape&&(/lower.left|starting at|horizontal radius|circumradius/.test(t))){
  const width=numberAfter(t,'width|side'),height=numberAfter(t,'height'),r=numberAfter(t,'circumradius'),origin=pts[0]??[0,0];
  if(/regular trapezoid/.test(t)){p.parseError='A regular trapezoid needs a precise definition or vertices.';return set('CREATE','TRAPEZOID');}
  if(r!==undefined&&['parallelogram','rhombus'].includes(shape)){p.points=Array.from({length:4},(_,i)=>[origin[0]+r*Math.cos(Math.PI/4+i*Math.PI/2),origin[1]+r*Math.sin(Math.PI/4+i*Math.PI/2)]);p.explicitVertices=true;return set('CREATE','POLYGON');}
  p.position=origin;p.width=width;p.height=shape==='square'?width:height;
  if(/lower.left|starting at/.test(t)){if(width!==undefined&&p.height!==undefined)p.position=[origin[0]+width/2,origin[1]+p.height/2];}
  if(shape==='ellipse'){const rx=numberAfter(t,'horizontal radius'),ry=numberAfter(t,'vertical radius');if(rx!==undefined)p.width=rx*2;if(ry!==undefined)p.height=ry*2;}
  if(r!==undefined)p.radius=r;
  return set('CREATE',shape.toUpperCase());
 }
 if(/^(?:plot|graph|draw)\b/.test(t)&&/\bf\(x\)\s*=/.test(t)){p.expression=t.split('=')[1].trim();return set('PLOT','FUNCTION');}
 if(/^(?:show|draw|create|plot)\b.*\b(?:line with slope|slope.*y.intercept)\b/.test(t)){const slope=numberAfter(t,'slope'),intercept=numberAfter(t,'y.intercept');if(slope!==undefined&&intercept!==undefined){p.expression=`${slope}*x+(${intercept})`;return set('PLOT','FUNCTION');}}
 if(/^(?:label|rename|call|name)\b/.test(t)){p.label=c.rawPhrase.match(/(?:as|to|it|point|marker)\s+([\w-]+)[.!?]*$/i)?.[1];return set('CHANGE','LABEL');}
 if(/\b(?:outline|border|stroke|interior|fill)\b/.test(t)&&/^(?:change|make|paint|color|colour|recolor|shade|fill|outline)\b/.test(t)){
  const color=Object.keys(COLORS).sort((a,b)=>b.length-a.length).find(color=>new RegExp(`\\b${color}\\b`).test(t));p.color=color;return set('CHANGE',/interior|fill/.test(t)?'FILL_COLOR':'STROKE_COLOR');
 }
 const times=t.match(new RegExp(`(?:make|scale).*?(${NUMBER_PATTERN})\\s*times`));if(times){p.factor=parseNumber(times[1]);return set('SCALE','UNIFORM');}
 if(/^rotate\b/.test(t)&&/\b(?:origin|vertex)\b/.test(t)){p.angle=numberAfter(t,'rotate (?:the selected triangle )?|rotate.*?')??parseNumber(t.match(new RegExp(NUMBER_PATTERN))?.[0]??'');p.angle*= /clockwise/.test(t)&&!/counterclockwise|anticlockwise/.test(t)?-1:1;p.anchor=/vertex/.test(t)?'vertex': 'origin';p.vertex=t.match(/vertex\s+([a-z]\d*)/)?.[1]?.toUpperCase();return set('ROTATE','OBJECT');}
}
export function rewrite2dLanguage(phrase:string){
 phrase=phrase.replace(/^(?:actually|instead)[, ]+/i,'');
 const scoped=phrase.match(/^On triangle\s+([\w-]+),\s*(.+)$/i);if(scoped)phrase=`${scoped[2]} of triangle ${scoped[1]}`;
 const intersection=phrase.match(/^Find (?:the )?intersection of\s+(y\s*=\s*.+?)\s+and\s+(y\s*=\s*.+?)(?:,|;)\s*(?:put|place|draw|mark)\b.*?\b(?:call|label) it\s+([\w-]+)[.!?]*$/i);
 if(intersection)return `Plot ${intersection[1]}; Plot ${intersection[2]}; Find the intersection; Mark it; Label it as ${intersection[3]}`;
 return phrase.replace(/\.\s+(?=(?:reflect|move|rotate|make|draw|create|delete)\b)/gi,'; ').replace(/\bthen\s+construct its centroid\b/gi,'then mark its centroid').replace(/\blabel it\s+(?!as\b)([\w-]+)/gi,'label it as $1');
}

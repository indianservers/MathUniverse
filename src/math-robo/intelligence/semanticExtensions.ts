import {coordinates,numberAfter,parseNumber,NUMBER_PATTERN} from './numberParser';
import {interpretVisualRequest} from '../../offline-intelligence/commands';
import type {MathRoboCommand,RoboTarget} from './types';
export function parseExtensions(command:MathRoboCommand):MathRoboCommand|undefined{
  const t=command.normalizedPhrase,p=command.parameters,d=command.mode.endsWith('3d')?3:2,pts=coordinates(t,d);
  const set=(action:string,subAction:string)=>{command.action=action;command.subAction=subAction;return command;};
  const percentage=t.match(new RegExp(String.raw`(${NUMBER_PATTERN})\s*%`));
  if(percentage&&/\b(?:scale|enlarge|shrink|bigger|larger|smaller|reduce)\b/.test(t)){
    const seed={kind:'circle' as const,dimension:'2d' as const,points:[[0,0]],width:2,height:2,radius:1,color:'#22d3ee',scale:1};
    const percentLiteral=`${parseNumber(percentage[1])}%`,request=/bigger|larger|smaller/.test(t)?`${/smaller/.test(t)?'shrink':'enlarge'} it by ${percentLiteral}`:t.replace(percentage[0],percentLiteral);
    p.factor=interpretVisualRequest(request,command.mode,seed).command?.scale;
    return set('SCALE','UNIFORM');
  }
  if(/\bmidpoint\b/.test(t)&&/^(?:create|mark|draw|find|what)\b/.test(t)){
    const pair=t.match(/(?:of|between)\s+(?:points?\s+)?([a-z]\d*)\s+and\s+([a-z]\d*)\b/);
    if(pair||/^(?:create|mark|draw) (?:a |the )?midpoint [a-z]\d*$/.test(t)){
      command.target=pair?`$points:${pair[1]}:${pair[2]}`:'$points';
      p.label=t.match(/^create (?:a |the )?midpoint ([a-z]\d*)\b/)?.[1]?.toUpperCase();
      return set(/^(?:create|mark|draw)/.test(t)?'MARK':'FIND','MIDPOINT');
    }
  }
  if(/\b(?:twice|double|half)\b.*\b(?:wide|width|tall|height)\b/.test(t)){p[/wide|width/.test(t)?'widthFactor':'heightFactor']=/half/.test(t)?.5:2;return set('RESIZE','OBJECT');}
  if(/\binner triangle\b.*\brelationship\b|\brelationship\b.*\binner triangle\b/.test(t))return set('CHECK','MEDIAL_TRIANGLE');
  if(/^(?:join|connect)\b/.test(t)){p.fromMarkedPoints=true;return set('CREATE','TRIANGLE');}
  if(/^mark\b.*\b(?:all (?:3|three)|every|each)\b.*\bmidpoints?\b|^mark\b.*\bmidpoint.*every side\b/.test(t)){command.target={type:'triangle',reference:'lastReferenced'};return set('MARK','SIDE_MIDPOINTS');}
  if(/\bcoordinates?\b.*\b(?:center|centre)\b/.test(t))return set('FIND','CENTER');
  if(/^(?:mark (?:that|the) point|place a point where)/.test(t)){command.target='$previousResult';if(/intersect/.test(t))p.intersectionRequested=true;return set('MARK','POINT');}
  if(/^where\b.*\bmeet\b/.test(t)){p.multiple=true;return set('FIND','INTERSECTION');}
  if(/^is\b.*\b(horizontal|vertical)\b/.test(t)){p.orientation=t.match(/horizontal|vertical/)![0];command.target={type:'line',reference:'lastReferenced'};return set('CHECK','ORIENTATION');}
  if(/\bmake\b.*\bthese\b.*\bparallel\b/.test(t)){p.multiple=true;p.relation='PARALLEL';return set('CHANGE','RELATION');}
  if(/^(?:actually\s+)?(?:undo|go back)/.test(t))return set('UNDO','LAST');
  if(/^(?:explain|why|show steps|how did you|how was)/.test(t)&&!/parallel|perpendicular|right angled/.test(t)){p.responseDepth=/short|compact/.test(t)?'compact':/step|detail/.test(t)?'detailed':'standard';return set('EXPLAIN','PREVIOUS');}
  if(/\b(make another|another one|duplicate this one)\b/.test(t))return set('DUPLICATE','OBJECT');
  if(/^use\b/.test(t))return set('SELECT','OBJECT');
  if(/^(?:lock|unlock)\b/.test(t))return set(t.startsWith('unlock')?'UNLOCK':'LOCK','OBJECT');
  if(/^extend\b/.test(t)){p.factor=numberAfter(t,'by|factor')??2;return set('EXTEND','OBJECT');}
  if(/\bmake\b.*\b(?:them|both|those|lines|circles)\b.*\b(parallel|perpendicular|tangent)\b/.test(t)){p.relation=t.match(/parallel|perpendicular|tangent/)![0].toUpperCase();p.multiple=true;return set('CHANGE','RELATION');}
  if(/^(?:make|set|change)\b.*\bperpendicular\b/.test(t)){p.parseError='I need a reference point or another line.';return set('CHANGE','RELATION');}
  if(/\b(midpoint|halfway)\b.*\b(every|each|all)\b.*\bside\b|\b(every|each|all) side.*midpoint/.test(t)){return set(/^mark|^create|^place/.test(t)?'MARK':'FIND',/^mark|^create|^place/.test(t)?'SIDE_MIDPOINTS':'COORDINATES');}
  if(/^(?:mark it\b|mark those\b|create (?:the )?midpoint|place a point at)/.test(t)){command.target='$previousResult';return set('MARK','POINT');}
  if(/\b(median|altitude|incircle|circumcircle|angle bisector|projection|normal)\b/.test(t)&&/^(?:draw|create|construct|put|project)\b/.test(t)){
    const match=t.match(/median|altitude|incircle|circumcircle|angle bisector|projection|normal/)![0];p.from=t.match(/from\s+([a-z]\d*)\b/)?.[1];p.position=pts[0];
    const names=t.match(/(?:of|from)\s+([a-z]\d*)\s+(?:onto|on|to)\s+(?:line\s+)?([a-z]{1,2}\d*)\b/);if(names)command.targets=[names[1],names[2]];
    if(['median','altitude','incircle','circumcircle'].includes(match))command.target={type:'triangle',reference:'lastReferenced'};
    return set('CONSTRUCT',match.replace(' ','_').toUpperCase());
  }
  if(/\b(touch|touching)\b/.test(t)&&/^(?:where|find|what)/.test(t)){p.multiple=true;command.target={type:'circle'};return set('FIND','TOUCHING_POINT');}
  if(/^(?:are|is|check|verify|why|test)\b/.test(t)){
    const relation=/tangent/.test(t)?'TANGENT':/collinear/.test(t)?'COLLINEAR':/outside/.test(t)?'POINT_OUTSIDE':/right angled|right triangle/.test(t)?'RIGHT_TRIANGLE':/equal angles/.test(t)?'EQUAL_ANGLES':undefined;
    if(relation){p.multiple=relation!=='RIGHT_TRIANGLE';if(relation==='TANGENT')command.target={type:'circle'};if(relation==='RIGHT_TRIANGLE')command.target={type:'triangle',reference:'lastReferenced'};const names=t.match(/points?\s+([a-z]\d*)\s*,?\s*([a-z]\d*)\s+(?:and\s+)?([a-z]\d*)\b/);if(names)command.targets=names.slice(1);return set('CHECK',relation);}
    if(/^why/.test(t)&&/parallel|perpendicular/.test(t)){p.multiple=true;p.explain=true;return set('CHECK',/perpendicular/.test(t)?'PERPENDICULAR':'PARALLEL');}
  }
  if(/^(?:what|where|find|calculate|measure|which|tell me)\b/.test(t)){
    const kind=/(?:type|kind).*triangle|triangle.*(?:type|kind)/.test(t)?'TRIANGLE_TYPE':/longest side/.test(t)?'LONGEST_SIDE':/largest angle/.test(t)?'LARGEST_ANGLE':/incenter/.test(t)?'INCENTER':/circumcenter/.test(t)?'CIRCUMCENTER':/orthocenter/.test(t)?'ORTHOCENTER':/coordinate/.test(t)?'COORDINATES':/equation|point[ -]slope|slope[ -]intercept form/.test(t)?'EQUATION':/projection|foot of perpendicular/.test(t)?'PROJECTION':/\bangle\b/.test(t)?'ANGLE':undefined;
    if(kind){if(['TRIANGLE_TYPE','LONGEST_SIDE','LARGEST_ANGLE','INCENTER','CIRCUMCENTER','ORTHOCENTER'].includes(kind))command.target={type:'triangle',reference:'lastReferenced'};if(['ANGLE','PROJECTION'].includes(kind))p.multiple=true;const names=t.match(/(?:between|of)\s+([a-z]{1,2}\d*)\s+(?:and|onto)\s+([a-z]{1,2}\d*)\b/);if(names)command.targets=names.slice(1);return set('FIND',kind);}
    const segment=t.match(/\b(?:of|meet|intersect|cut)\s+([a-z]{2})\b/);if(segment)command.target=segment[1];
  }
  if(/^(?:make|set|change)\b/.test(t)&&/\b(length|slope)\b/.test(t)){const kind=/length/.test(t)?'LENGTH':'SLOPE';p[kind.toLowerCase()]=numberAfter(t,kind.toLowerCase());return set('CHANGE',kind);}
  if(/\breflect|\bflip/.test(t)&&/y\s*=\s*x/.test(t))return set('REFLECT','DIAGONAL');
  if(/\b(make|reduce)\b.*\b(bigger|larger|smaller|reduce)\b/.test(t)){return set('SCALE','UNIFORM');}
  if(/\b(draw|create|make)\b.*\btriangle\b.*\bsides?\b/.test(t)){
    const numbers=t.slice(t.indexOf('side')).match(new RegExp(NUMBER_PATTERN,'g'))?.map(parseNumber);
    if(numbers?.length===3){const [a,b,c]=numbers,x=(a*a+c*c-b*b)/(2*c),y2=a*a-x*x;
      if(a+b<=c||a+c<=b||b+c<=a||y2<=0)p.parseError=`Those side lengths cannot form a triangle: the sum of two sides must exceed the third.`;
      else {p.points=[[0,0],[c,0],[x,Math.sqrt(y2)]];p.width=c;p.height=Math.sqrt(y2);}
      return set('CREATE','TRIANGLE');
    }
  }
  return undefined;
}
export function namesInQuery(t:string):RoboTarget[]|undefined{const names=t.match(/\bbetween\s+([a-z]{1,2}\d*)\s+and\s+([a-z]{1,2}\d*)\b/);return names?.slice(1);}

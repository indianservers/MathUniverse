import {normalizeLanguage} from './numberParser';
import {pointDistanceNames} from './pointDistanceLanguage';
import {nearestPointCoordinates} from './nearestPointLanguage';
import {matchGeometryLesson} from './geometryCurriculum';
import {matchExtendedGeometry} from './geometryExtendedCurriculum';
export type RequestKind='COMMAND'|'QUERY'|'EXPLANATION_REQUEST'|'CONVERSATION'|'UNSUPPORTED'|'AMBIGUOUS';
export function classifyRequest(raw:string):RequestKind{
  const text=normalizeLanguage(raw).replace(/^(?:please|kindly|can you|could you)\s+/,'');
  const extended=matchExtendedGeometry(raw);if(extended)return extended.id>=176&&extended.id<=217?'COMMAND':'QUERY';
  const lesson=matchGeometryLesson(raw);if(lesson)return lesson.id<=135?'QUERY':'COMMAND';
  if(pointDistanceNames(raw))return 'QUERY';
  if(nearestPointCoordinates(raw))return 'QUERY';
  if(/^(?:twice|half) as (?:big|large|small)\b/.test(text))return 'COMMAND';
  if(/^(?:maybe|perhaps|i might|i like|i love|i think|tell me about|this .*looks|do you think|what is geometry)\b/.test(text))return /maybe.*(?:delete|remove)/.test(text)?'AMBIGUOUS':'CONVERSATION';
  if(/^(?:explain|why|show steps|show me why|show why|how did you|how was)/.test(text))return 'EXPLANATION_REQUEST';
  if(/^(?:tell me (?!about)|what|where|how|which|is|are|does|find|calculate|measure|check|test|verify|compare|count)\b/.test(text))return 'QUERY';
  if(/^(?:draw|create|make|mark|show|display|hide|delete|remove|clear|reset|select|deselect|use|move|translate|rotate|turn|tilt|reflect|flip|scale|resize|change|set|color|colour|recolor|rename|label|duplicate|copy|plot|graph|embed|construct|add|insert|place|sketch|build|lock|unlock|extend|stretch|double|halve|enlarge|shrink|undo|redo|go back|put|join|connect|actually undo|i need|i want|circle|rectangle|triangle|line|point|sphere|cube)\b/.test(text))return 'COMMAND';
  return 'UNSUPPORTED';
}

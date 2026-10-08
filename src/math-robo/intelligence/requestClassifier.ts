import {normalizeLanguage} from './numberParser';
export type RequestKind='COMMAND'|'QUERY'|'EXPLANATION_REQUEST'|'CONVERSATION'|'UNSUPPORTED'|'AMBIGUOUS';
export function classifyRequest(raw:string):RequestKind{
  const text=normalizeLanguage(raw).replace(/^(?:please|kindly|can you|could you)\s+/,'');
  if(/^(?:maybe|perhaps|i might|i like|i love|i think|tell me about|this .*looks|do you think|what is geometry)\b/.test(text))return /maybe.*(?:delete|remove)/.test(text)?'AMBIGUOUS':'CONVERSATION';
  if(/^(?:explain|why|show steps|show me why|show why|how did you|how was)/.test(text))return 'EXPLANATION_REQUEST';
  if(/^(?:tell me (?!about)|what|where|how|which|is|are|does|find|calculate|measure|check|test|verify|compare|count)\b/.test(text))return 'QUERY';
  if(/^(?:draw|create|make|mark|show|display|hide|delete|remove|clear|reset|select|deselect|use|move|translate|rotate|turn|tilt|reflect|flip|scale|resize|change|set|color|colour|recolor|rename|label|duplicate|copy|plot|graph|embed|construct|add|insert|place|sketch|build|lock|unlock|extend|stretch|double|halve|enlarge|shrink|undo|redo|go back|put|join|connect|actually undo|i need|i want|circle|rectangle|triangle|line|point|sphere|cube)\b/.test(text))return 'COMMAND';
  return 'UNSUPPORTED';
}

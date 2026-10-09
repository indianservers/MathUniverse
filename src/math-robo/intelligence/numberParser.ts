import {normalizeCommandSurface} from './commandLanguage';
import { compileFunctionExpression } from '../../utils/functionParser';
const wordValues: Record<string,number> = {zero:0,one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,thirty:30,forty:40,fifty:50,sixty:60,seventy:70,eighty:80,ninety:90};
export function normalizeLanguage(phrase:string) {
  const typos:Record<string,string>={rectagle:'rectangle',rectangel:'rectangle',circel:'circle',circl:'circle',perpandicular:'perpendicular',perpendiculer:'perpendicular',intersecton:'intersection',radious:'radius',diametre:'diameter',diamter:'diameter',lenght:'length',midpont:'midpoint',paralel:'parallel',triangel:'triangle',coodinate:'coordinate',pls:'please',rad:'radius'};
  return normalizeCommandSurface(phrase.toLowerCase().replace(/\b(?:rectagle|rectangel|circel|circl|perpandicular|perpendiculer|intersecton|radious|diametre|diamter|lenght|midpont|paralel|triangel|coodinate|pls|rad)\b/g,value=>typos[value])
    .replace(/\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[ -](one|two|three|four|five|six|seven|eight|nine)\b/g,(_,a:string,b:string)=>String(wordValues[a]+wordValues[b]))
    .replace(/co-ordinate/g,'coordinate').replace(/\b(three|one|two|four|five|six|seven|eight|nine|zero) point (zero|one|two|three|four|five|six|seven|eight|nine)\b/g,(_,a:string,b:string)=>`${wordValues[a]}.${wordValues[b]}`)
    .replace(/\bnegative\s+/g,'-').replace(/°/g,' degrees').replace(/\bwhat's\b/g,'what is').replace(/\bthat's\b/g,'that is')
    .replace(/,{2,}/g,' ').replace(/!+/g,'').replace(/\s+/g,' ').trim()
    .replace(/mid[ -]point/g,'midpoint').replace(/one half/g,'0.5').replace(/three quarters/g,'0.75').replace(/minus\s+/g,'-')
    .replace(/\b(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)\b/g, word=>String(wordValues[word]))
    .replace(/\b(that|this|another|other|previous|first|second|third|fourth|red|blue|green) 1\b/g,'$1 one')
    .replace(/\bcomma\b/g,',').replace(/\bsquared\b/g,'^2').replace(/\bcubed\b/g,'^3').replace(/\bplus\b/g,'+')
    .replace(/\bput (?:a |another )?(?:point|dot)\b/g,'create point').replace(/\bdot\b/g,'point')
    .replace(/\b(right|left|up|down|forward|backward)\s+another\s+/g,'$1 ')
    .replace(/\b(from|to)\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)(?=\s|[.!?]|$)/g,'$1 ($2,$3)')
    .replace(/\b(\d+(?:\.\d+)?)\s+x\s+(\d+(?:\.\d+)?)\b/g,'$1 by $2')
    .replace(/^and (?=(?:its|the|that|this)\b)/,'what is ').replace(/\bdrwa\b/g,'draw').replace(/mid poit/g,'midpoint').replace(/\braduis\b/g,'radius').replace(/\bintigrate\b/g,'integrate').replace(/\b([xyz]) square\b/g,'$1^2'));
}
export const NUMBER_PATTERN = '-?(?:sqrt\\(\\d+(?:\\.\\d+)?\\)|√\\d+(?:\\.\\d+)?|(?:\\d+(?:\\.\\d+)?\\s*\\*?\\s*)?(?:π|pi)|\\d+(?:\\.\\d+)?)(?:\\s*\\/\\s*\\d+(?:\\.\\d+)?)?';
export function parseNumber(value:string):number {
  const normalized=normalizeLanguage(value).trim().replace(/√(\d+(?:\.\d+)?)/g,'sqrt($1)').replace(/π/g,'pi').replace(/(\d)\s*(pi)/g,'$1*$2');
  if (!new RegExp(`^${NUMBER_PATTERN.replace(/π\|pi/,'pi')}$`,'i').test(normalized.replace('*pi','pi'))) throw new Error(`Invalid number: ${value}`);
  const result=compileFunctionExpression(normalized)(0);
  if (!Number.isFinite(result)) throw new Error('Use finite numbers; division by zero is invalid.');
  return result;
}
export function numberAfter(text:string,keyword:string):number|undefined {
  const match=text.match(new RegExp(`\\b(?:${keyword})\\s*(?:of|is|=|to|by)?\\s*(${NUMBER_PATTERN})`,'i'));
  return match ? parseNumber(match[1]) : undefined;
}
export function coordinates(text:string,dimension:number):number[][] {
  const tuples=[...text.matchAll(/\(([^()]*(?:sqrt\([^)]*\)[^()]*)?)\)/g)].filter(match=>match[1].includes(','));
  if (tuples.length) return tuples.map(match=>match[1].split(',').map(value=>parseNumber(value.trim())));
  const point=new RegExp(`(${NUMBER_PATTERN})\\s*,\\s*(${NUMBER_PATTERN})${dimension===3?`\\s*,\\s*(${NUMBER_PATTERN})`:''}`,'g');
  return [...text.matchAll(point)].map(match=>match.slice(1).map(parseNumber));
}
export function directionVector(text:string,dimension:number) {
  const vector=Array<number>(dimension).fill(0);
  for(const [axis,positive,negative] of [[0,'right','left'],[1,'up','down'],[2,'forward','backward|back']] as const) {
    if(axis>=dimension)continue;
    for(const [direction,sign] of [[positive,1],[negative,-1]] as const) {
      const a=text.match(new RegExp(`(?<![a-z0-9_])(${NUMBER_PATTERN})\\s*(?:units?|cm|mm|m)?\\s*(?:${direction})\\b`));
      const b=text.match(new RegExp(`\\b(?:${direction})\\s*(?:by)?\\s*(${NUMBER_PATTERN})`));
      if(a||b)vector[axis]+=sign*parseNumber((b??a)![1]);
    }
    const coordinate=text.match(new RegExp(`(${NUMBER_PATTERN})\\s*(?:units?\\s*)?(positive|negative)\\s*${'xyz'[axis]}`));
    if(coordinate)vector[axis]+=parseNumber(coordinate[1])*(coordinate[2]==='negative'?-1:1);
  }
  return vector;
}

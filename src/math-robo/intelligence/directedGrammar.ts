import {coordinates} from './numberParser';
import type {MathRoboCommand} from './types';

type Token={kind:'word';value:string}|{kind:'coordinate';value:number[]};
/** Balanced lexical scanner: numerical notation is delegated to the existing number parser. */
function tokenize(text:string,dimension:number):Token[]{
  const tokens:Token[]=[];
  for(let i=0;i<text.length;){
    if(text[i]==='('){let depth=1,end=i+1;while(end<text.length&&depth){if(text[end]==='(')depth++;if(text[end]===')')depth--;end++;}
      const points=coordinates(text.slice(i,end),dimension);if(points.length===1)tokens.push({kind:'coordinate',value:points[0]});i=end;
    }else if(/[a-z]/.test(text[i])){let end=i+1;while(end<text.length&&/[a-z0-9_-]/.test(text[end]))end++;tokens.push({kind:'word',value:text.slice(i,end)});i=end;}
    else i++;
  }
  return tokens;
}
export function parseDirectedGrammar(command:MathRoboCommand):MathRoboCommand|undefined{
  const tokens=tokenize(command.normalizedPhrase,command.mode.endsWith('3d')?3:2),first=tokens[0];
  if(first?.kind!=='word'||!['create','draw','make','construct','plot','add','sketch'].includes(first.value))return;
  const entity=tokens.find(t=>t.kind==='word'&&['ray','vector'].includes(t.value));if(!entity||entity.kind!=='word')return;
  const points=tokens.filter((t):t is Extract<Token,{kind:'coordinate'}>=>t.kind==='coordinate').map(t=>t.value);
  const words=tokens.filter(t=>t.kind==='word').map(t=>t.value),kind=entity.value;
  const roles=kind==='ray'?['origin','through']:['tail','head'];
  if(words.includes('direction')||words.includes('components')){roles[1]='direction';if(points.length===2)points[1]=points[0].map((n,i)=>n+points[1][i]);}
  command.action='CREATE';command.subAction=kind.toUpperCase();command.parameters.points=points;
  command.parameters.entityRoles=roles;
  if(points.length&&points.length!==2)command.parameters.parseError='Provide an origin and a through point, or a tail and a head.';
  return command;
}

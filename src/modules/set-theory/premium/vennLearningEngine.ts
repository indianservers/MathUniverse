import { parseBuilder } from './math';
export type Model={universe:string[];setA:string[];setB:string[];setC:string[]};
export const membership=(s:Model,x:string)=>(s.setA.includes(x)?1:0)|(s.setB.includes(x)?2:0)|(s.setC.includes(x)?4:0);
export const regionName=(m:number)=>m===0?'Outside A, B and C':['A','B','C'].map((s,i)=>m&(1<<i)?s:`${s}ᶜ`).join(' ∩ ');
export const regionMeaning=(m:number)=>m===0?'Belongs to none of the sets.':`Belongs to ${['A','B','C'].filter((_,i)=>m&(1<<i)).join(' and ')}${m!==7?`, but not ${['A','B','C'].filter((_,i)=>!(m&(1<<i))).join(' or ')}`:''}.`;
/** A small Boolean expression parser; no executable user input. */
export function expressionMasks(input:string):number[]{
 const tokens=input.replace(/\s/g,'').match(/A|B|C|U|∅|∪|∩|△|−|-|ᶜ|'|\(|\)/g)??[];
 if(tokens.join('')!==input.replace(/\s/g,''))throw Error('Use A, B, C, U, ∅, ∪, ∩, −, △, complements and parentheses.');
 const evaluate=(mask:number)=>{let index=0;
  const atom=():boolean=>{let value:boolean;const token=tokens[index++];if(token==='('){value=union();if(tokens[index++]!==')')throw Error('Close the parentheses.');}else if(['A','B','C'].includes(token))value=Boolean(mask&(1<<['A','B','C'].indexOf(token)));else if(token==='U')value=true;else if(token==='∅')value=false;else throw Error('Expected a set or parentheses.');while(tokens[index]==='ᶜ'||tokens[index]==="'"){index++;value=!value;}return value;};
  const intersection=():boolean=>{let left=atom();while(['∩','−','-'].includes(tokens[index])){const op=tokens[index++],right=atom();left=op==='∩'?left&&right:left&&!right;}return left;};
  const union=():boolean=>{let left=intersection();while(['∪','△'].includes(tokens[index])){const op=tokens[index++],right=intersection();left=op==='∪'?left||right:left!==right;}return left;};
  const result=union();if(index!==tokens.length)throw Error('Unexpected symbol. Check the expression.');return result;
 };
 return Array.from({length:8},(_,i)=>i).filter(evaluate);
}
export const resultFor=(s:Model,input:string)=>{const masks=expressionMasks(input);return s.universe.filter(x=>masks.includes(membership(s,x)));};
export function compareAnswers(expected:string[],actual:string[]){const missing=expected.filter(x=>!actual.includes(x)),extra=actual.filter(x=>!expected.includes(x));return {correct:!missing.length&&!extra.length,missing,extra};}
export function relationships(a:string[],b:string[]){const common=a.filter(x=>b.includes(x)),aOnly=a.filter(x=>!b.includes(x)),bOnly=b.filter(x=>!a.includes(x));return {common,aOnly,bOnly,equal:!aOnly.length&&!bOnly.length,subset:!aOnly.length,properSubset:!aOnly.length&&bOnly.length>0,disjoint:!common.length};}
export const lessons=[
 {title:'Membership',expression:'A',prompt:'Select every element belonging to A.',why:'Membership is a yes/no property. A number can belong to more than one set.'},
 {title:'Union',expression:'A ∪ B',prompt:'Predict all elements in A or B, including both.',why:'“Or” includes both. Shared elements appear once in a set.'},
 {title:'Intersection',expression:'A ∩ B',prompt:'Select only elements belonging to both A and B.',why:'Intersection requires both conditions to be true.'},
 {title:'Difference',expression:'A − B',prompt:'Select elements in A that are not in B.',why:'Order matters: A − B and B − A can give different answers.'},
 {title:'Complement',expression:'Aᶜ',prompt:'Select elements of U that are outside A.',why:'Complements are relative to the universe, including elements in other circles.'},
 {title:'Three sets',expression:'A ∩ B ∩ C',prompt:'Select elements satisfying all three conditions.',why:'A triple intersection is also part of each pairwise intersection.'},
];
export type Scenario={title:string;names:[string,string,string,string];model:Model;rules:[string,string,string]};
const numeric=Array.from({length:12},(_,i)=>String(i+1));
function numericModel():Model{return {universe:numeric,setA:parseBuilder('even',numeric),setB:parseBuilder('prime',numeric),setC:parseBuilder('x mod 3 = 0',numeric)};}
export const scenarios:Scenario[]=[
 {title:'Number detectives',names:['Numbers 1–12','Even','Prime','Multiple of 3'],model:numericModel(),rules:['even','prime','x mod 3 = 0']},
 {title:'Sports club',names:['Club members','Football','Cricket','Swimming'],model:{universe:['Asha','Ben','Chen','Dia','Eli','Fara'],setA:['Asha','Ben','Dia'],setB:['Ben','Chen','Dia'],setC:['Dia','Eli']},rules:['Asha, Ben, Dia','Ben, Chen, Dia','Dia, Eli']},
 {title:'Languages spoken',names:['Friends','English','Hindi','Telugu'],model:{universe:['Asha','Ben','Chen','Dia','Eli','Fara'],setA:['Asha','Ben','Chen','Dia'],setB:['Asha','Dia','Eli'],setC:['Dia','Eli','Fara']},rules:['Asha, Ben, Chen, Dia','Asha, Dia, Eli','Dia, Eli, Fara']},
 {title:'Food preferences',names:['Guests','Fruit','Vegetables','Grains'],model:{universe:['Asha','Ben','Chen','Dia','Eli','Fara'],setA:['Asha','Ben','Fara'],setB:['Ben','Chen','Fara'],setC:['Dia','Eli','Fara']},rules:['Asha, Ben, Fara','Ben, Chen, Fara','Dia, Eli, Fara']},
 {title:'Library borrowing',names:['Readers','Fiction','Science','History'],model:{universe:['Asha','Ben','Chen','Dia','Eli','Fara'],setA:['Asha','Ben','Dia'],setB:['Ben','Chen','Dia'],setC:['Dia','Eli','Fara']},rules:['Asha, Ben, Dia','Ben, Chen, Dia','Dia, Eli, Fara']},
 {title:'Shape cards',names:['Shapes','Red','Round','Large'],model:{universe:['🔴','🔵','🟥','🟦','small-red','small-blue'],setA:['🔴','🟥','small-red'],setB:['🔴','🔵'],setC:['🔴','🔵','🟥','🟦']},rules:['🔴, 🟥, small-red','🔴, 🔵','🔴, 🔵, 🟥, 🟦']},
 {title:'Word cards',names:['Words','Starts with c','Has a','Three letters'],model:{universe:['cat','car','dog','cake','apple','cup'],setA:['cat','car','cake','cup'],setB:['cat','car','cake','apple'],setC:['cat','car','dog','cup']},rules:['cat, car, cake, cup','cat, car, cake, apple','cat, car, dog, cup']},
];
export function ruleModel(universe:string[],rules:string[]):Model{return {universe,setA:parseBuilder(rules[0],universe),setB:parseBuilder(rules[1],universe),setC:parseBuilder(rules[2],universe)};}
export function changeExplanation(before:Model,after:Model,expression?:string){const messages=after.universe.flatMap(x=>{const old=membership(before,x),next=membership(after,x);if(old===next)return [];return [`${x}: ${['A','B','C'].flatMap((s,i)=>(old&(1<<i))===(next&(1<<i))?[]:[`${next&(1<<i)?'entered':'left'} ${s}`]).join(', ')}.`];});if(expression){const old=resultFor(before,expression),next=resultFor(after,expression);const added=next.filter(x=>!old.includes(x)),removed=old.filter(x=>!next.includes(x));if(added.length)messages.push(`${added.join(', ')} now qualifies for ${expression}.`);if(removed.length)messages.push(`${removed.join(', ')} no longer qualifies for ${expression}.`);}return messages.length?messages.join(' '):'Memberships stayed the same; only the arrangement changed.';}
export type Mastery=Record<string,{attempts:number;correct:number}>;
export function weakestConcept(mastery:Mastery){return lessons.reduce((best,lesson)=>{const score=(title:string)=>{const p=mastery[title];return p?p.correct/p.attempts:0;};return score(lesson.title)<score(best.title)?lesson:best;},lessons[0]);}

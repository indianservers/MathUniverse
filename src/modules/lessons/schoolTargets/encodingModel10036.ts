export const peAlphabet10036='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
export type PeOperation10036='Shift'|'Mirror'|'Swap'|'Jump';
export type PeRule10036={operation:PeOperation10036;amount:number;direction:'Left'|'Right'};
export const peDefault10036:PeRule10036={operation:'Shift',amount:2,direction:'Right'};
const mod=(n:number)=>((n%26)+26)%26;
export function peEncode10036(raw:string,rule:PeRule10036){
 const input=raw.trim().toUpperCase();
 if(!/^[A-Za-z]{1,24}$/.test(raw.trim()))return{valid:false as const,input,output:'',steps:[],error:input?'Use 1–24 letters A–Z, with no internal spaces or symbols.':'Enter a word to encode.'};
 if(!Number.isInteger(rule.amount)||Math.abs(rule.amount)>1000||!['Shift','Mirror','Swap','Jump'].includes(rule.operation))return{valid:false as const,input,output:'',steps:[],error:'Unsupported rule.'};
 const steps=[...input].map((letter,i)=>{const source=rule.operation==='Swap'?(i%2?i-1:i+1<input.length?i+1:i):i,original=input[source],position=peAlphabet10036.indexOf(original)+1,distance=rule.operation==='Jump'?rule.amount+i:rule.amount,signed=(rule.direction==='Right'?1:-1)*distance,newPosition=rule.operation==='Mirror'?27-position:rule.operation==='Swap'?position:mod(position-1+signed)+1;return{index:i,source,original,position,newPosition,letter:peAlphabet10036[newPosition-1],shift:rule.operation==='Shift'||rule.operation==='Jump'?signed:null};});
 return{valid:true as const,input,output:steps.map(s=>s.letter).join(''),steps,error:''};
}
export function peDescription10036(r:PeRule10036){return r.operation==='Mirror'?'Mirror the alphabet: A↔Z, B↔Y, … (p →27−p)':r.operation==='Swap'?'Swap neighbouring word positions 1↔2, 3↔4, …; leave an odd last letter unchanged':r.operation==='Jump'?`Shift letters ${r.direction==='Right'?'forward':'backward'} by ${r.amount}, ${r.amount+1}, ${r.amount+2}, …; wrap A–Z`:`Shift each letter ${r.direction==='Right'?'forward':'backward'} by ${r.amount}; wrap A–Z`;}
export function peParse10036(raw:string):PeRule10036|null{
 const text=raw.trim().toLowerCase().replace(/−/g,'-').replace(/\s+/g,' ');
 if(/^(mirror|atbash|mirror each letter across the alphabet)$/.test(text))return{operation:'Mirror',amount:0,direction:'Right'};
 if(/^(swap|swap (each )?(neighbouring|neighboring|adjacent) pairs?)$/.test(text))return{operation:'Swap',amount:0,direction:'Right'};
 const compact=text.match(/^(shift|jump)?\s*([+-])\s*(\d{1,3})$/),prose=text.match(/^(shift|jump)(?: each letter)? (forward|backward)(?: by)? (\d{1,3})$/);
 if(compact)return{operation:compact[1]==='jump'?'Jump':'Shift',amount:Number(compact[3]),direction:compact[2]==='-'?'Left':'Right'};
 if(prose)return{operation:prose[1]==='jump'?'Jump':'Shift',amount:Number(prose[3]),direction:prose[2]==='backward'?'Left':'Right'};
 return null;
}
export const peExamples10036=[['CAT','ECV'],['BOOK','DQQM'],['SUN','UWP']];
export function peChallenge10036(ruleText:string,word:string,answer:string){const rule=peParse10036(ruleText),model=peEncode10036(word,peDefault10036),matches=rule?peExamples10036.map(([a,b])=>peEncode10036(a,rule).output===b):[false,false,false],answerModel=peEncode10036(answer,{operation:'Shift',amount:0,direction:'Right'});return{rule,matches,ruleMatches:matches.every(Boolean),model,answerValid:answerModel.valid,correct:matches.every(Boolean)&&model.valid&&answerModel.valid&&answerModel.input===model.output};}

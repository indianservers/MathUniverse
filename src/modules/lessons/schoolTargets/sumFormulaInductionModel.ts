export const sfSteps=['A','B','C','D','E']as const;export type SFStep=typeof sfSteps[number];export type SFSlots=Array<SFStep|null>;
export function sfPlace(slots:SFSlots,step:SFStep,destination?:number){if(!sfSteps.includes(step))return slots;const from=slots.indexOf(step),to=destination??slots.findIndex(v=>v===null);if(to<0||to>4||!Number.isInteger(to))return slots;const out=[...slots],displaced=out[to];out[to]=step;if(from>=0&&from!==to)out[from]=displaced;return out;}
export const sfValid=(s:string)=>s.trim()!==''&&Number.isInteger(Number(s))&&Number(s)>=1&&Number(s)<=8;
export function sfDots(k:number,complete=false){const rows=k+(complete?1:0);return Array.from({length:rows},(_,row)=>Array.from({length:row+1},(_,col)=>({row,col,x:150+(col-row/2)*22,y:25+row*17,added:row===k}))).flat();}

export function sfCorrect(slots:SFSlots){return slots.length===5&&((slots[0]==='A'&&slots[1]==='B')||(slots[0]==='B'&&slots[1]==='A'))&&slots[2]==='C'&&slots[3]==='D'&&slots[4]==='E';}

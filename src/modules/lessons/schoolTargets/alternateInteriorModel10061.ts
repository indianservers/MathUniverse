import{pcModel10063,type PCState10063}from'./parallelConverseModel10063';
export const aiStart10061:PCState10063={angle:63,offset:0,l:0,m:0};
export function aiModel10061(g:PCState10063){const m=pcModel10063(g),values={3:180-m.pairs[0][0],4:m.pairs[0][0],5:180-m.pairs[0][1],6:m.pairs[0][1]};return{...m,values,equal:m.proper&&g.l===g.m};}
export function aiPairs10061(pairs:boolean[]){return pairs.length===4&&pairs[0]&&pairs[1]&&!pairs[2]&&!pairs[3];}

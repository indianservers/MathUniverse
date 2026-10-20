import{pcModel10063,pcClamp10063,type PCState10063}from'./parallelConverseModel10063';
export const ssInitial10062:PCState10063={angle:62,offset:0,l:0,m:0};
export function ssModel10062(g:PCState10063,pair=0){const m=pcModel10063(g),values=pair===0?m.pairs[2]:[180-m.pairs[0][0],m.pairs[0][1]],sum=values[0]+values[1];return{...m,values,sum,balanced:m.proper&&g.l===g.m};}
export function ssEdit10062(g:PCState10063,pair:number,index:number,value:number,locked:boolean){let next={...g};if(index===0)next.angle=pair===0?value+g.l:180+g.l-value;else if(locked)next.angle=pair===0?180-value+g.l:value+g.l;else next.m=pair===0?value+g.angle-180:g.angle-value;next=pcClamp10063(next);if(locked)next.m=next.l;return next;}
export function ssTiltDraft10062(raw:string){const n=Number(raw),mantissa=raw.trim().split(/e/i)[0],exactZero=/^[+-]?(?:0+(?:\.0*)?|\.0+)$/.test(mantissa);return raw.trim()!==''&&Number.isFinite(n)&&n>=-20&&n<=20&&(n!==0||exactZero);}

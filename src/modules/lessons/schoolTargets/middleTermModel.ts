import{ciChoose}from'./combinatorialInterpretationModel';
export function mtVariables(n:number,r:number){const factor=(v:string,p:number)=>p===0?'':p===1?v:`${v}^{${p}}`;return factor('x',n-r)+factor('y',r)||'1';}
export function mtTerm(n:number,r:number){const c=ciChoose(n,r),v=mtVariables(n,r);return v==='1'?String(c):`${c===1?'':c}${v}`;}
export function mtModel(n:number){const even=n%2===0,positions=even?[n/2+1]:[(n+1)/2,(n+3)/2],indices=positions.map(p=>p-1),coefficients=Array.from({length:n+1},(_,r)=>ciChoose(n,r));return{even,positions,indices,coefficients,terms:coefficients.map((_,r)=>mtTerm(n,r))};}
export const mtValid=(s:string)=>s.trim()!==''&&Number.isInteger(Number(s))&&Number(s)>=0&&Number(s)<=10;

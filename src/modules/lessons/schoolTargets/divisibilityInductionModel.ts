export function diModel(n:number){const power=7n**BigInt(n),value=power-1n,quotient=value/6n,remainder=value%6n,shown=Number(quotient>12n?12n:quotient);return{power,value,quotient,remainder,shown,omitted:quotient-BigInt(shown),nextValue:7n*power-1n,nextQuotient:7n*quotient+1n};}
export const diValid=(s:string)=>s.trim()!==''&&Number.isInteger(Number(s))&&Number(s)>=1&&Number(s)<=7;

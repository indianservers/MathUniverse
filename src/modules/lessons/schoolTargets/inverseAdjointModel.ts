export type InverseMatrix=number[][];
export const minorDet=(m:InverseMatrix)=>{const p=m[0][0]*m[1][1],q=m[0][1]*m[1][0];return Math.abs(p-q)<=32*Number.EPSILON*(Math.abs(p)+Math.abs(q))?0:p-q;};
const sub=(m:InverseMatrix,r:number,c:number)=>m.filter((_,i)=>i!==r).map(row=>row.filter((_,j)=>j!==c));
export const determinant3=(m:InverseMatrix)=>{const terms=m[0].map((v,c)=>v*(c%2?-1:1)*minorDet(sub(m,0,c)));const sum=terms.reduce((a,b)=>a+b,0);return Math.abs(sum)<=32*Number.EPSILON*terms.reduce((a,b)=>a+Math.abs(b),0)?0:sum;};
export const cofactorMatrix=(m:InverseMatrix)=>m.map((row,r)=>row.map((_,c)=>(((r+c)%2?-1:1)*minorDet(sub(m,r,c)))||0));
export const transposeMatrix=(m:InverseMatrix)=>m[0].map((_,c)=>m.map(row=>row[c]));
export const matrixProduct=(a:InverseMatrix,b:InverseMatrix)=>a.map(row=>b[0].map((_,c)=>row.reduce((sum,v,k)=>sum+v*b[k][c],0)));
export const identityVerified=(m:InverseMatrix)=>m.every((row,r)=>row.every((v,c)=>Number.isFinite(v)&&Math.abs(v-(r===c?1:0))<1e-8));
function ratio(n:number):[bigint,bigint]{const [mantissa,exp="0"]=String(n).toLowerCase().split("e");const digits=mantissa.split(".");const power=Number(exp)-(digits[1]?.length||0);const value=BigInt(digits.join(""));return power>=0?[value*10n**BigInt(power),1n]:[value,10n**BigInt(-power)];}
export function inverseFraction(n:number,d=1){if(!Number.isFinite(n)||!Number.isFinite(d)||d===0)return "undefined";if(n===0)return "0";const [nn,nd]=ratio(n),[dn,dd]=ratio(d);let a=nn*dd,b=nd*dn;if(b<0n){a=-a;b=-b;}let x=a<0n?-a:a,y=b;while(y){const t=x%y;x=y;y=t;}a/=x;b/=x;return b===1n?String(a):`${a}/${b}`;}

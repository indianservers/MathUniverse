import{ciChoose,ciTerm}from'./combinatorialInterpretationModel';
export function gtFactorial(n:number){let v=1;for(let i=2;i<=n;i++)v*=i;return v;}
export function gtModel(n:number,k:number){const r=k-1,a=n-r,b=r,c=ciChoose(n,r),term=ciTerm(n,r),sup='⁰¹²³⁴⁵⁶⁷⁸⁹',plain=term.replace(/\{(\d+)\}/g,(_,s:string)=>s.split('').map(c=>sup[Number(c)]).join('')).replace(/\^/g,'');return{r,a,b,c,term,plain};}
export const gtValid=(s:string,min:number,max:number)=>s.trim()!==''&&Number.isInteger(Number(s))&&Number(s)>=min&&Number(s)<=max;
export function gtExample(n:number,k:number,cursor:number){const examples=[[5,3],[8,6],[6,2]];for(let j=0;j<examples.length;j++){const i=(cursor+j)%examples.length,[nn,kk]=examples[i];if(nn!==n||kk!==k)return{n:nn,k:kk,cursor:(i+1)%examples.length};}return{n:7,k:4,cursor:0};}

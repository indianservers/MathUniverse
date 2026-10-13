export const mod=(a:number,n:number)=>((a%n)+n)%n;
export function gcd(a:number,b:number):number{while(b)[a,b]=[b,a%b];return Math.abs(a);}
export function modularStructure(n:number,k:number){const residues=Array.from({length:n},(_,i)=>i),d=gcd(n,k),subgroup=residues.filter(i=>i%d===0),cosets=Array.from({length:d},(_,i)=>subgroup.map(x=>mod(x+i,n))),units=residues.filter(x=>gcd(x,n)===1),zeroDivisors=residues.filter(x=>x>0&&gcd(x,n)>1);return {residues,d,subgroup,cosets,units,zeroDivisors,field:units.length===n-1};}
export const divisors=(n:number)=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
export const inverseMod=(a:number,n:number)=>Array.from({length:n},(_,i)=>i).find(b=>mod(a*b,n)===1);
export function powerMod(a:number,b:number,n:number):number|undefined{if(b<0){const inverse=inverseMod(a,n);return inverse===undefined?undefined:powerMod(inverse,-b,n);}let result=1;for(let i=0;i<b;i++)result=mod(result*a,n);return result;}
export type FiniteGroup={labels:string[];table:number[][];identity:number;name:string;operation:string};
export function finiteGroup(kind:string,n:number):FiniteGroup{
 if(kind==='S₃'){
 const permutations=[[0,1,2],[1,0,2],[0,2,1],[2,1,0],[1,2,0],[2,0,1]];
 return {labels:['e','(12)','(23)','(13)','(123)','(132)'],identity:0,name:'S₃',operation:'Permutation composition',table:permutations.map(a=>permutations.map(b=>permutations.findIndex(p=>p.every((x,i)=>x===a[b[i]]))))};
 }
 if(kind==='D₄')return {labels:['e','r','r²','r³','s','rs','r²s','r³s'],identity:0,name:'D₄',operation:'Symmetries of a square',table:Array.from({length:8},(_,a)=>Array.from({length:8},(_,b)=>mod(a%4+(a<4?1:-1)*(b%4),4)+4*((Math.floor(a/4)+Math.floor(b/4))%2)))};
 return {labels:Array.from({length:n},(_,i)=>String(i)),identity:0,name:`ℤ/${n}ℤ`,operation:`Addition mod ${n}`,table:Array.from({length:n},(_,a)=>Array.from({length:n},(_,b)=>mod(a+b,n)))};
}
export function generatedSubgroup(group:FiniteGroup,generators:number[]){const set=new Set([group.identity,...generators]);let changed=true;while(changed){changed=false;for(const a of [...set])for(const b of [...set]){const c=group.table[a][b];if(!set.has(c)){set.add(c);changed=true;}}}return [...set].sort((a,b)=>a-b);}
export function allSubgroups(group:FiniteGroup){const known=new Map<string,number[]>();const add=(h:number[])=>{const key=h.join(',');if(known.has(key))return;known.set(key,h);for(let a=0;a<group.labels.length;a++)if(!h.includes(a))add(generatedSubgroup(group,[...h,a]));};add([group.identity]);return [...known.values()].sort((a,b)=>a.length-b.length);}
export function groupOrder(group:FiniteGroup,a:number){let result=group.identity;for(let i=1;i<=group.labels.length;i++){result=group.table[result][a];if(result===group.identity)return i;}return 0;}
export function residueMap(n:number,m:number,q:number){const map=(x:number)=>mod(q*x,m),wellDefined=mod(q*n,m)===0,domain=Array.from({length:n},(_,i)=>i),image=[...new Set(domain.map(map))].sort((a,b)=>a-b),kernel=domain.filter(x=>map(x)===0);let witness:[number,number]|null=null;for(let a=0;a<n&&!witness;a++)for(let b=0;b<n;b++)if(map(mod(a+b,n))!==mod(map(a)+map(b),m)){witness=[a,b];break;}return {map,wellDefined,image,kernel,onto:wellDefined&&image.length===m,oneToOne:wellDefined&&image.length===n,preserves:wellDefined&&witness===null,witness};}

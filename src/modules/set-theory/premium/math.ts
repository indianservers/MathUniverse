import { applySetOperation, cartesianProduct, coverRelations, functionProperties, hasseLevels, powerSet, relationProperties, uniqueElements, type OrderedPair } from '../setTheoryEngine';
export const setText=(values:string[])=>values.length?`{ ${values.join(', ')} }`:'∅';
export const pairText=(pairs:OrderedPair[])=>pairs.map(([a,b])=>`(${a}, ${b})`).join('; ');
export const keyPair=([a,b]:OrderedPair)=>JSON.stringify([a,b]);
export const dedupePairs=(pairs:OrderedPair[])=>[...new Map(pairs.map(p=>[keyPair(p),p])).values()];
export function parseRoster(input:string):string[]{
 let s=input.trim();if(!s||s==='∅'||s==='{}')return [];
 s=s.replace(/^\w+\s*=\s*/,'');
 if(s.startsWith('{')){if(!s.endsWith('}'))throw Error('Close the set with }.');s=s.slice(1,-1).trim();}
 if(/[{}|]/.test(s))throw Error('Use roster values here, or switch to set-builder form.');
 const range=s.match(/^(-?\d+)\s*,?\s*(?:\.\.\.|…|\.\.)\s*,?\s*(-?\d+)$/);
 if(range){const lo=Number(range[1]),hi=Number(range[2]);if(hi<lo||hi-lo>40)throw Error('Use an increasing integer range of at most 41 elements.');return Array.from({length:hi-lo+1},(_,i)=>String(lo+i));}
 const values=uniqueElements(s.split(/[,\s]+/));if(values.length>24)throw Error('Use at most 24 elements in this interactive view.');
 if(values.some(v=>v.length>14))throw Error('Use element labels of at most 14 characters.');return values;
}
export function parseBuilder(input:string,universe:string[]){
 let s=input.trim().replace(/^\w+\s*=\s*/,'').replace(/^\{/,'').replace(/\}$/,'').trim();
 s=s.replace(/^x\s*(?:∈|in)\s*U\s*(?:\||:)\s*/i,'').replace(/^x\s*\|\s*/,'').trim();
 if(/^(?:x\s+is\s+)?even$/i.test(s))return universe.filter(x=>Number.isSafeInteger(Number(x))&&Number(x)%2===0);
 if(/^(?:x\s+is\s+)?odd$/i.test(s))return universe.filter(x=>Number.isSafeInteger(Number(x))&&Math.abs(Number(x)%2)===1);
 if(/^(?:x\s+is\s+)?prime$/i.test(s)){if(universe.some(x=>Number(x)>1000000))throw Error('Prime filtering supports integers up to 1,000,000.');return universe.filter(x=>{const n=Number(x);if(!Number.isSafeInteger(n)||n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;});}
 const interval=s.match(/^(-?\d+(?:\.\d+)?)\s*(<=|≤|<)\s*x\s*(<=|≤|<)\s*(-?\d+(?:\.\d+)?)$/);
 if(interval)return universe.filter(x=>{const n=Number(x);return Number.isFinite(n)&&(interval[2]==='<'?n>Number(interval[1]):n>=Number(interval[1]))&&(interval[3]==='<'?n<Number(interval[4]):n<=Number(interval[4]));});
 const comparison=s.match(/^x\s*(<=|>=|≤|≥|<|>|=)\s*(-?\d+(?:\.\d+)?)$/);
 if(comparison)return universe.filter(x=>{const a=Number(x),b=Number(comparison[2]);if(!Number.isFinite(a))return false;return comparison[1]==='<'?a<b:comparison[1]==='>'?a>b:['<=','≤'].includes(comparison[1])?a<=b:['>=','≥'].includes(comparison[1])?a>=b:a===b;});
 const mod=s.match(/^x\s*(?:mod|%)\s*(\d+)\s*=\s*(-?\d+)$/i);
 if(mod){const m=Number(mod[1]);if(m===0)throw Error('The modulus must be positive.');return universe.filter(x=>Number.isSafeInteger(Number(x))&&((Number(x)%m)+m)%m===((Number(mod[2])%m)+m)%m);}
 throw Error('Supported predicates: x is even, x is odd, x is prime, 1 ≤ x ≤ 3, x > 2, or x mod 3 = 1.');
}
export function parseRelation(input:string,a:string[],b:string[]){
 if(!input.trim()||input.trim()==='∅'||input.trim()==='{}')return [];
 const s=input.trim().replace(/^\w+\s*=\s*/,'').replace(/^\{/,'').replace(/\}$/,'');
 const parts=s.match(/\([^()]+\)/g);
 let pairs:OrderedPair[];
 if(parts){if(s.replace(/\([^()]+\)/g,'').replace(/[;,\s]/g,''))throw Error('Use pairs such as (1, 2); (2, 3).');pairs=parts.map(part=>{const v=part.slice(1,-1).split(',').map(x=>x.trim());if(v.length!==2||!v.every(Boolean))throw Error('Each ordered pair needs exactly two elements.');return v as OrderedPair;});}
 else pairs=s.split(/[;\n]+/).map(x=>{const v=x.trim().split(/,|→|->/).map(y=>y.trim());if(v.length!==2||!v.every(Boolean))throw Error('Each pair needs exactly two elements.');return v as OrderedPair;});
 if(pairs.some(([x,y])=>!a.includes(x)||!b.includes(y)))throw Error('Every pair must belong to A × B. Add missing elements to the sets first.');return dedupePairs(pairs);
}
export const expressions=['A ∪ B','A ∩ B','A − B','B − A','Aᶜ','Bᶜ','A △ B','A ∩ B ∩ C','A ∪ B ∪ C'] as const;
export type Expression=typeof expressions[number];
export function expressionResult(op:Expression,u:string[],a:string[],b:string[],c:string[]=[]){
 if(op==='A ∩ B ∩ C')return applySetOperation('intersection',u,applySetOperation('intersection',u,a,b),c);
 if(op==='A ∪ B ∪ C')return applySetOperation('union',u,applySetOperation('union',u,a,b),c);
 if(op==='B − A')return applySetOperation('difference',u,b,a);
 if(op==='Bᶜ')return applySetOperation('complement',u,b,a);
 const ids={'A ∪ B':'union','A ∩ B':'intersection','A − B':'difference','Aᶜ':'complement','A △ B':'symmetric-difference'} as const;
 return applySetOperation(ids[op as keyof typeof ids],u,a,b);
}
export const maskMatches=(op:Expression,mask:number)=>expressionResult(op,['x'],mask&1?['x']:[],mask&2?['x']:[],mask&4?['x']:[]).length>0;
export type Property={name:string;value:boolean|null;why:string};
export function analyzeRelation(a:string[],b:string[],input:OrderedPair[]):Property[]{
 const p=dedupePairs(input),has=(x:string,y:string)=>p.some(([s,t])=>s===x&&t===y);
 const same=a.length===b.length&&a.every(x=>b.includes(x));
 if(!same)return ['Reflexive','Irreflexive','Symmetric','Asymmetric','Antisymmetric','Transitive','Equivalence relation','Partial order'].map(name=>({name,value:null,why:'These endorelation properties require A = B. The current relation is between different sets.'}));
 const valid=p.every(([x,y])=>a.includes(x)&&a.includes(y));
 if(!valid)return [{name:'Valid relation',value:false,why:'Remove pairs outside A × A before testing properties.'}];
 const missing=a.find(x=>!has(x,x)),loop=a.find(x=>has(x,x));
 const sym=p.find(([x,y])=>!has(y,x)),both=p.find(([x,y])=>x!==y&&has(y,x));
 let trans: string|undefined;for(const [x,y] of p)for(const [z,w] of p)if(y===z&&!has(x,w))trans=`(${x},${y}) and (${y},${w}) exist, but (${x},${w}) is missing.`;
 const base:Property[]=[
 {name:'Reflexive',value:missing===undefined,why:missing===undefined?'Every (a,a) is present.':`(${missing},${missing}) is missing.`},
 {name:'Irreflexive',value:loop===undefined,why:loop===undefined?'No diagonal pair is present.':`(${loop},${loop}) is present.`},
 {name:'Symmetric',value:!sym,why:sym?`(${sym[0]},${sym[1]}) exists but (${sym[1]},${sym[0]}) is missing.`:'Every pair has its reversed pair.'},
 {name:'Asymmetric',value:!both&&loop===undefined,why:loop!==undefined?'A self-loop violates asymmetry.':both?'A distinct pair and its reverse both exist.':'No pair has a reverse, including loops.'},
 {name:'Antisymmetric',value:!both,why:both?`(${both[0]},${both[1]}) and its reverse connect distinct elements.`:'Mutual relatedness occurs only for equal elements.'},
 {name:'Transitive',value:!trans,why:trans||'Every two-step relation has the required direct pair.'}];
 const props=relationProperties(a,p);return [...base,{name:'Equivalence relation',value:props.equivalence,why:'Requires reflexive, symmetric and transitive.'},{name:'Partial order',value:props.partialOrder,why:'Requires reflexive, antisymmetric and transitive.'}];
}
export function analyzeOrder(domain:string[],pairs:OrderedPair[],selected:string[]){
 const valid=relationProperties(domain,pairs).partialOrder&&pairs.every(([a,b])=>domain.includes(a)&&domain.includes(b));
 const le=(a:string,b:string)=>pairs.some(([x,y])=>x===a&&y===b);
 const minima=domain.filter(x=>!domain.some(y=>y!==x&&le(y,x))),maxima=domain.filter(x=>!domain.some(y=>y!==x&&le(x,y)));
 const lower=domain.filter(x=>selected.every(y=>le(x,y))),upper=domain.filter(x=>selected.every(y=>le(y,x)));
 const meet=lower.find(x=>lower.every(y=>le(y,x))),join=upper.find(x=>upper.every(y=>le(x,y)));
 const lattice=valid&&domain.length>0&&cartesianProduct(domain,domain).every(([a,b])=>{
  const lows=domain.filter(x=>le(x,a)&&le(x,b)),ups=domain.filter(x=>le(a,x)&&le(b,x));
  return lows.some(x=>lows.every(y=>le(y,x)))&&ups.some(x=>ups.every(y=>le(x,y)));
 });
 return {valid,minima,maxima,least:domain.find(x=>domain.every(y=>le(x,y))),greatest:domain.find(x=>domain.every(y=>le(y,x))),lower,upper,meet,join,lattice,chain:valid&&selected.every(a=>selected.every(b=>le(a,b)||le(b,a))),antichain:valid&&selected.every(a=>selected.every(b=>a===b||(!le(a,b)&&!le(b,a)))),covers:valid?coverRelations(domain,pairs):[],levels:valid?hasseLevels(domain,pairs):[]};
}
export function mappingAnalysis(a:string[],b:string[],pairs:OrderedPair[]){
 const p=dedupePairs(pairs),base=functionProperties(a,b,p);return {...base,into:base.isFunction&&!base.surjective,manyToOne:base.isFunction&&!base.injective,oneToMany:a.some(x=>p.filter(([s])=>s===x).length>1),range:uniqueElements(p.map(([,y])=>y)),inverse:base.bijective?p.map(([x,y])=>[y,x] as OrderedPair):null};
}
export function checkedPower(values:string[]){if(values.length>8)throw Error('Enumerating all subsets is limited to 8 elements (256 subsets). The cardinality formula remains valid for larger finite sets.');return powerSet(values);}
export const divisibility=(n:number)=>{const domain=Array.from({length:n},(_,i)=>String(i+1)).filter(x=>n%Number(x)===0);return {domain,pairs:cartesianProduct(domain,domain).filter(([a,b])=>Number(b)%Number(a)===0)};};
export const booleanOrder=(alphabet:string[])=>{const subsets=powerSet(alphabet),domain=subsets.map(setText);return {domain,pairs:cartesianProduct(domain,domain).filter(([a,b])=>subsets[domain.indexOf(a)].every(x=>subsets[domain.indexOf(b)].includes(x)))};};

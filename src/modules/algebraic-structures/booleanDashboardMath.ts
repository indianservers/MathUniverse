export function minimalBooleanForm(variables:string[], rows:Array<{values:Record<string,boolean>;result:boolean}>, positive=true) {
  const wanted=rows.map((r,i)=>r.result===positive?i:-1).filter(i=>i>=0);
  if(!wanted.length)return positive?'0':'1';if(wanted.length===rows.length)return positive?'1':'0';
  const cubes:Array<{pattern:number[];cover:number;literals:number}>=[];
  for(let code=0;code<3**variables.length;code++){let value=code;const pattern=variables.map(()=>{const digit=value%3;value=Math.floor(value/3);return digit-1;});let cover=0,valid=true;
    rows.forEach((r,i)=>{if(pattern.every((digit,j)=>digit===-1||Number(r.values[variables[j]])===digit)){if(r.result!==positive)valid=false;else cover|=1<<i;}});
    if(valid&&cover)cubes.push({pattern,cover,literals:pattern.filter(x=>x!==-1).length});
  }
  const primes=cubes.filter(c=>!cubes.some(q=>q!==c&&(q.cover|c.cover)===q.cover&&q.literals<c.literals));
  const target=wanted.reduce((mask,i)=>mask|(1<<i),0);let best:number[]=[];let bestCost=Infinity;
  const search=(covered:number,chosen:number[],literalCount:number)=>{const cost=chosen.length*100+literalCount;if(cost>=bestCost)return;if(covered===target){best=chosen;bestCost=cost;return;}const missing=wanted.find(i=>!(covered&(1<<i)))!;primes.forEach((p,i)=>{if(p.cover&(1<<missing))search(covered|p.cover,[...chosen,i],literalCount+p.literals);});};search(0,[],0);
  return best.map(i=>'('+primes[i].pattern.flatMap((digit,j)=>digit===-1?[]:[positive?(digit?variables[j]:'!'+variables[j]):(digit?'!'+variables[j]:variables[j])]).join(positive?' & ':' | ')+')').join(positive?' | ':' & ');
}
export function booleanKmap(variables:string[],rows:Array<{values:Record<string,boolean>;result:boolean}>){
 const rowBits=Math.max(0,variables.length-2), colBits=Math.min(2,variables.length);const gray=(i:number)=>i^(i>>1);
 const rowLabels=Array.from({length:2**rowBits},(_,i)=>rowBits?gray(i).toString(2).padStart(rowBits,'0'):'');
 const colLabels=Array.from({length:2**colBits},(_,i)=>colBits?gray(i).toString(2).padStart(colBits,'0'):'');
 return {rowLabels,colLabels,rowNames:variables.slice(0,rowBits).join(''),colNames:variables.slice(rowBits).join(''),cells:rowLabels.map(r=>colLabels.map(c=>{const bits=r+c;return rows.find(row=>variables.every((v,i)=>Number(row.values[v])===Number(bits[i])))?.result??false;}))};
}

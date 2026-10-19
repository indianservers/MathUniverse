import type{StepRow}from './groupedMeanStepModel';
export function moveGroupedMidpoint(rows:StepRow[],id:number,value:number){
 const i=rows.findIndex(r=>r.id===id);if(i<0||!Number.isFinite(value))return rows;
 const row=rows[i],prev=rows[i-1],next=rows[i+1],width=row.upper-row.lower,joinedPrev=prev&&Math.abs(prev.upper-row.lower)<1e-9,joinedNext=next&&Math.abs(next.lower-row.upper)<1e-9;
 const eps=Math.min(1e-6,width/1000),lo=prev?(joinedPrev?prev.lower+eps:prev.upper)+width/2:-1e9,hi=next?(joinedNext?next.upper-eps:next.lower)-width/2:1e9;
 const center=Math.max(lo,Math.min(hi,value)),lower=center-width/2,upper=center+width/2;
 return rows.map((r,j)=>j===i?{...r,lower,upper}:j===i-1&&joinedPrev?{...r,upper:lower}:j===i+1&&joinedNext?{...r,lower:upper}:r);
}

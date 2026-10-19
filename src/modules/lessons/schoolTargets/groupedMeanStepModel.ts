export type StepRow={id:number;lower:number;upper:number;frequency:number};
export function groupedMeanStepModel(rows:StepRow[],A:number,h:number){
 const valid=rows.length>0&&Number.isFinite(A)&&Number.isFinite(h)&&h>0&&rows.every((r,i)=>Number.isFinite(r.lower)&&Number.isFinite(r.upper)&&r.upper>r.lower&&Number.isInteger(r.frequency)&&r.frequency>=0&&(i===0||r.lower>=rows[i-1].upper));
 const enriched=rows.map(r=>{const midpoint=(r.lower+r.upper)/2,deviation=(midpoint-A)/h;return{...r,midpoint,deviation,product:r.frequency*deviation,width:r.upper-r.lower};});
 const totalFrequency=rows.reduce((s,r)=>s+r.frequency,0),totalStep=enriched.reduce((s,r)=>s+r.product,0),mean=valid&&totalFrequency?enriched.reduce((s,r)=>s+r.frequency*r.midpoint,0)/totalFrequency:null;
 const widths=enriched.map(r=>r.width),sameWidths=valid&&widths.every(w=>Math.abs(w-widths[0])<=1e-9*Math.max(1,Math.abs(w),Math.abs(widths[0]))),equalWidth=sameWidths&&Math.abs(widths[0]-h)<=1e-9*Math.max(1,h);
 return{enriched,totalFrequency,totalStep,mean,widths,sameWidths,equalWidth,valid};
}

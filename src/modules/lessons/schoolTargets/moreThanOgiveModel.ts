import{medianOgiveModel,moveOgivePoint}from'./medianOgiveModel';
export type MoreRow={id:number;boundary:number;frequency:number};
export function moreThanModel(rows:MoreRow[],upper:number){const m=medianOgiveModel([...rows.map(r=>r.boundary),upper],rows.map(r=>r.frequency)),points=rows.map((r,i)=>({...r,cf:m.more[i]}));points.push({id:Math.max(...rows.map(r=>r.id))+1,boundary:upper,frequency:0,cf:0});return{...m,points};}
export function moreThanYMax(N:number){if(N<=0)return 1;const raw=N/6,u=10**Math.floor(Math.log10(raw)),step=[1,2,5,10].find(k=>k*u>=raw)!*u;return 7*step;}
export function moveMorePoint(rows:MoreRow[],index:number,more:number){const total=rows.reduce((s,r)=>s+r.frequency,0),f=moveOgivePoint(rows.map(r=>r.frequency),index,total-more);return rows.map((r,i)=>({...r,frequency:f[i]}));}

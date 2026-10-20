import {evaluateSpreadsheetGrid,shiftSpreadsheetFormula,type SpreadsheetGrid} from '../../../workspace/spreadsheetKernel';
export function parseLessonCsv(text:string):SpreadsheetGrid {
 text=text.replace(/^\uFEFF/,'');
 const rows:string[][]=[];let row:string[]=[],cell='',quoted=false,closed=false;
 const finishCell=()=>{row.push(cell);cell='';closed=false;};
 for(let i=0;i<text.length;i++){
  const char=text[i];
  if(quoted){if(char==='"'){if(text[i+1]==='"'){cell+='"';i++;}else{quoted=false;closed=true;}}else cell+=char;continue;}
  if(char==='"'){if(cell||closed)throw new Error('A quote must begin a CSV field.');quoted=true;}
  else if(char===',')finishCell();
  else if(char==='\n'||char==='\r'){if(char==='\r'&&text[i+1]==='\n')i++;finishCell();rows.push(row);row=[];}
  else {if(closed&&char.trim())throw new Error('Separate quoted fields with a comma.');if(!closed)cell+=char;}
 }
 if(quoted)throw new Error('Close the quoted field before importing.');
 if(cell||row.length||closed){finishCell();rows.push(row);}
 if(rows.length<2)throw new Error('Include a header and at least one data row.');
 const width=Math.max(...rows.map(r=>r.length));if(width>8||rows.length>50)throw new Error('Use at most 8 columns and 50 rows in this lesson.');
 return rows.map(r=>Array.from({length:width},(_,i)=>r[i]??''));
}
export function sortLessonGrid(grid:SpreadsheetGrid,column:number,descending=false):SpreadsheetGrid {
 const evaluated=evaluateSpreadsheetGrid(grid).values;
 const rows=grid.slice(1).map((row,index)=>({row,source:index+1}));
 rows.sort((a,b)=>{const left=evaluated[a.source]?.[column]??'',right=evaluated[b.source]?.[column]??'';const numeric=left.trim()!==''&&right.trim()!==''&&Number.isFinite(Number(left))&&Number.isFinite(Number(right));return(numeric?Number(left)-Number(right):left.localeCompare(right,undefined,{numeric:true}))*(descending?-1:1);});
 return [grid[0]??[],...rows.map(({row,source},index)=>row.map(value=>shiftSpreadsheetFormula(value,index+1-source,0)))];
}
export function numericColumn(values:string[][],column:number){return values.slice(1).map(row=>row[column]??'').filter(value=>value.trim()!==''&&Number.isFinite(Number(value))).map(Number);}
export function sheetSummary(values:number[]){if(!values.length)return null;const sorted=[...values].sort((a,b)=>a-b),n=values.length,sum=values.reduce((s,x)=>s+x,0);return{n,sum,mean:sum/n,median:n%2?sorted[Math.floor(n/2)]:(sorted[n/2-1]+sorted[n/2])/2,min:sorted[0],max:sorted[n-1],range:sorted[n-1]-sorted[0]};}
export function sheetRegression(points:{x:number;y:number}[]){if(points.length<2)return null;const mx=points.reduce((s,p)=>s+p.x,0)/points.length,my=points.reduce((s,p)=>s+p.y,0)/points.length,xx=points.reduce((s,p)=>s+(p.x-mx)**2,0);if(xx===0)return null;const slope=points.reduce((s,p)=>s+(p.x-mx)*(p.y-my),0)/xx,intercept=my-slope*mx,sse=points.reduce((s,p)=>s+(p.y-slope*p.x-intercept)**2,0),sst=points.reduce((s,p)=>s+(p.y-my)**2,0);return{slope,intercept,sse,r2:sst>0?1-sse/sst:null};}

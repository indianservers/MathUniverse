import {useEffect,useState} from 'react';
export type GroupedData={bounds:number[];frequencies:number[]};
export function validateGroupedData(data:GroupedData){
 if(data.bounds.length!==data.frequencies.length+1||!data.frequencies.length)return 'Provide one more boundary than frequencies.';
 if(data.bounds.some((n,i)=>!Number.isFinite(n)||(i>0&&n<=data.bounds[i-1])))return 'Class boundaries must be finite numbers in strictly increasing order.';
 if(data.frequencies.some(n=>!Number.isInteger(n)||n<0||n>1000000))return 'Frequencies must be whole numbers from 0 to 1,000,000.';
 if(data.frequencies.reduce((s,n)=>s+n,0)===0)return 'At least one class must have a positive frequency.';
 return '';
}
export default function GroupedDataEditor({data,defaults,onChange}:{data:GroupedData;defaults:GroupedData;onChange:(data:GroupedData)=>void}){
 const signature=JSON.stringify(data),[bounds,setBounds]=useState(data.bounds.map(String)),[frequencies,setFrequencies]=useState(data.frequencies.map(String));
 useEffect(()=>{setBounds(data.bounds.map(String));setFrequencies(data.frequencies.map(String));},[signature]);
 const parse=(b:string[],f:string[]):GroupedData=>({bounds:b.map(x=>x.trim()===''?NaN:Number(x)),frequencies:f.map(x=>x.trim()===''?NaN:Number(x))});
 const error=validateGroupedData(parse(bounds,frequencies));
 function update(b:string[],f:string[]){setBounds(b);setFrequencies(f);const next=parse(b,f);if(!validateGroupedData(next))onChange(next);}
 const inputStyle={width:'100%',minWidth:0,padding:'8px',border:'1px solid #94a3b8',borderRadius:'6px',background:'transparent',color:'inherit',fontSize:'16px'};
 return <section aria-label="Edit grouped data" className="rounded-xl border bg-white p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100" style={{height:'auto',margin:'12px 0',fontSize:'14px',lineHeight:1.6}}><h2 className="text-lg font-black">Edit your data</h2><p className="my-2">Change class boundaries and frequencies. Curves, cumulative frequencies, N/2 and the median update together. A grouped median estimates positions within each class.</p><div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'10px'}}>{bounds.map((b,i)=><label key={`b${i}`}>Boundary {i+1}<input aria-label={`Data boundary ${i+1}`} type="number" step="any" value={b} style={inputStyle} onChange={e=>update(bounds.map((v,j)=>i===j?e.target.value:v),frequencies)}/></label>)}{frequencies.map((f,i)=><label key={`f${i}`}>Frequency: {bounds[i]} to {bounds[i+1]}<input aria-label={`Data frequency ${i+1}`} type="number" min="0" max="1000000" step="1" value={f} style={inputStyle} onChange={e=>update(bounds,frequencies.map((v,j)=>i===j?e.target.value:v))}/></label>)}</div>{error&&<p role="alert" className="my-3 font-bold text-red-700 dark:text-red-300">{error} The graph retains the last valid data until this is corrected.</p>}<div className="mt-3 flex flex-wrap gap-3"> <button type="button" disabled={!!error||frequencies.length>=12} onClick={()=>update([...bounds,String(Number(bounds.at(-1))+Number(bounds.at(-1))-Number(bounds.at(-2)))],[...frequencies,'1'])}>Add class</button><button type="button" disabled={!!error||frequencies.length<=1} onClick={()=>update(bounds.slice(0,-1),frequencies.slice(0,-1))}>Remove last class</button><button type="button" onClick={()=>update(defaults.bounds.map(String),defaults.frequencies.map(String))}>Restore original data</button></div></section>;
}

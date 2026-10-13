import {useState} from 'react';
import type {LessonModelResult} from './authoredLessonTypes';
import {conceptVisual} from './conceptVisualModels';

const format=(n:number)=>Number.isFinite(n)?Number(n.toPrecision(5)).toString():'undefined';
export default function ConceptVisualization({model,values,result,onChange}:{model:string;values:Record<string,number>;result:LessonModelResult;onChange:(values:Record<string,number>)=>void}){
 const visual=conceptVisual(model,values,result);
 const [showValues,setShowValues]=useState(true);
 const [basis,setBasis]=useState<'Z'|'X'>('Z');
 const colors=['#0891b2','#7c3aed','#d97706','#db2777'];
 const text=(x:number,y:number,label:string)=><text x={x} y={y} fill="currentColor" fontSize="13">{label}</text>;
 let drawing;
 if(visual.kind==='existing')drawing=null;
 else if(visual.curves?.length){
  const points=visual.curves.flatMap(c=>c.points).filter(p=>p.every(Number.isFinite));
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);
  const loX=Math.min(0,...xs),hiX=Math.max(1,...xs),loY=Math.min(0,...ys),hiY=Math.max(1,...ys);
  const px=(x:number)=>60+(x-loX)/(hiX-loX)*410,py=(y:number)=>240-(y-loY)/(hiY-loY)*210;
  drawing=<><path d={`M60 ${py(0)} H470 M${px(0)} 30 V240`} stroke="currentColor" opacity=".4"/>{visual.curves.map((c,i)=><g key={c.label}><polyline fill="none" stroke={colors[i%4]} strokeWidth="3" points={c.points.filter(p=>p.every(Number.isFinite)).map(([x,y])=>`${px(x)},${py(y)}`).join(' ')}><title>{c.label}</title></polyline>{text(65,265+i*18,c.label)}</g>)}{showValues&&<>{text(5,35,format(hiY))}{text(5,240,format(loY))}{text(60,255,format(loX))}{text(450,255,format(hiX))}</>}</>;
 }else if(visual.matrix){
  const rows=visual.matrix.length,cols=visual.matrix[0].length,size=Math.min(190/rows,360/cols),max=Math.max(1,...visual.matrix.flat().map(Math.abs));
  drawing=<>{visual.matrix.map((row,i)=>row.map((n,j)=><g key={`${i}-${j}`}><rect x={80+j*size} y={30+i*size} width={size-2} height={size-2} fill={n<0?colors[3]:colors[0]} opacity={.15+.75*Math.abs(n)/max}/>{showValues&&text(85+j*size,50+i*size,visual.kind==='confusion'&&i===1&&j===1?'Not supplied':format(n))}<title>{`${visual.kind==='quantum-pair'?`|${i}${j}⟩ probability`:visual.kind==='confusion'?visual.labels[i*2+j]:`Row ${i+1}, column ${j+1}`}: ${visual.kind==='confusion'&&i===1&&j===1?'not supplied':format(n)}`}</title></g>))}{text(80,245,visual.kind==='quantum-pair'?'Rows: first qubit; columns: second qubit':visual.kind==='operation-table'?'Row and column are residues; cell is the operation result':'Each cell shows its signed value')}</>;
 }else if(visual.kind==='bloch'){
  const theta=values.a*Math.PI/180,phi=values.b*Math.PI/180,x=Math.sin(theta)*Math.cos(phi),y=Math.sin(theta)*Math.sin(phi),z=Math.cos(theta);
  drawing=<><circle cx="260" cy="140" r="100" fill="none" stroke="currentColor" opacity=".4"/><ellipse cx="260" cy="140" rx="100" ry="30" fill="none" stroke="currentColor" opacity=".4"/><path d="M260 40 V240 M150 140 H370" stroke="currentColor" opacity=".3"/><line x1="260" y1="140" x2={260+85*x+35*y} y2={140-95*z+15*y} stroke={colors[0]} strokeWidth="4"/><circle cx={260+85*x+35*y} cy={140-95*z+15*y} r="6" fill={colors[1]}/>{text(270,35,'|0⟩')}{text(270,255,'|1⟩')}{text(20,280,`Bloch vector (${format(x)}, ${format(y)}, ${format(z)})`)}</>;
 }else if(visual.kind==='factor'){
  drawing=<>{visual.numbers.map((n,i)=><g key={i}><circle cx={50+(i%8)*60} cy={70+Math.floor(i/8)*70} r="24" fill={colors[Math.floor(i/2)%4]} opacity=".65"/>{showValues&&text(42+(i%8)*60,75+Math.floor(i/8)*70,format(n))}<title>{`Prime factor ${i+1}: ${n}`}</title></g>)}{text(25,285,'Each chip is a prime factor; multiply all chips to reconstruct n.')}{text(25,310,'Matching pairs explain square-root extraction.')}</>;
 }else if(visual.kind==='circles'){
  const [d,r1,r2,axis]=visual.numbers,lo=Math.min(-r1,d-r2,axis),hi=Math.max(r1,d+r2,axis),scale=Math.min(380/(hi-lo||1),100/Math.max(r1,r2)),px=(x:number)=>60+(x-lo)*scale;
  drawing=<><circle cx={px(0)} cy="140" r={r1*scale} fill="none" stroke={colors[0]} strokeWidth="3"/><circle cx={px(d)} cy="140" r={r2*scale} fill="none" stroke={colors[1]} strokeWidth="3"/><path d={`M${px(axis)} 25 V255`} stroke={colors[2]} strokeWidth="3" strokeDasharray="6 4"/>{showValues&&text(35,285,`Radical axis x = ${format(axis)}`)}{text(35,310,'The dashed line has equal power relative to both circles.')}</>;
 }else if(visual.kind==='parse-tree'){
  drawing=<><path d="M260 60 L140 145 M260 60 L380 145 M140 145 V235 M380 145 V235" fill="none" stroke={colors[0]} strokeWidth="3"/>{text(250,50,'S')}{text(130,140,'A')}{text(370,140,'B')}{text(130,255,'x')}{text(370,255,'y')}{showValues&&<>{text(25,100,`S → AB: ${format(visual.numbers[0])}`)}{text(25,190,`A → x: ${format(visual.numbers[1])}`)}{text(335,190,`B → y: ${format(visual.numbers[2])}`)}</>}{text(25,300,`Tree probability = ${visual.numbers.map(format).join(' × ')}`)}</>;
 }else if(['gradient','distance-vector','scatter'].includes(visual.kind)){
  const nums=visual.numbers,scale=90/Math.max(1,...nums.map(Math.abs)),sx=(x:number)=>260+x*scale,sy=(y:number)=>150-y*scale;
  drawing=<><path d="M80 150 H450 M260 30 V260" stroke="currentColor" opacity=".4"/><line x1="260" y1="150" x2={sx(nums[0])} y2={sy(nums[1])} stroke={colors[0]} strokeWidth="4"/><circle cx={sx(nums[0])} cy={sy(nums[1])} r="5" fill={colors[0]}/>{visual.kind==='scatter'&&<><line x1="260" y1="150" x2={sx(nums[2])} y2={sy(nums[3])} stroke={colors[1]} strokeWidth="3"/><circle cx={sx(nums[2])} cy={sy(nums[3])} r="5" fill={colors[1]}/></>}{showValues&&text(30,290,visual.kind==='scatter'?`Original (${format(nums[0])}, ${format(nums[1])}); whitened (${format(nums[2])}, ${format(nums[3])})`:`Vector (${format(nums[0])}, ${format(nums[1])})`)}</>;
 }else if(visual.kind==='convolution'){
  drawing=<>{visual.numbers.slice(0,3).map((n,i)=><g key={i}><rect x={95+i*110} y="35" width="90" height="70" fill={colors[0]} opacity=".2"/>{text(110+i*110,75,format(n))}</g>)}<path d="M140 110 L195 190 M250 110 L195 190 M250 110 L305 190 M360 110 L305 190" stroke={colors[1]} strokeWidth="2"/>{text(95,145,'Kernel [1, −1] slides over adjacent cells')}{showValues&&<>{text(165,220,format(visual.numbers[3]))}{text(290,220,format(visual.numbers[4]))}</>}{text(50,275,'Left response = first − second; right = second − third')}</>;
 }else if(visual.kind==='histogram'){
  const widths=model==='histogram'?[values.w1??10,values.w2??20]:[values.width??10,values.width??10,values.width??10],density=visual.numbers,max=Math.max(1,...density),scale=420/widths.reduce((s,n)=>s+n,0);let left=50;
  drawing=<><path d="M50 240 H475" stroke="currentColor"/>{widths.map((width,i)=>{const start=left;left+=width*scale;const height=density[i]/max*180;return <g key={i}><rect x={start} y={240-height} width={width*scale} height={height} fill={colors[i]} opacity=".65" stroke="currentColor"/><title>{`Class ${i+1}: width ${width}; height ${format(density[i])}`}</title>{showValues&&text(start+5,230-height,format(density[i]))}</g>;})}{text(50,275,model==='histogram'?'Height = frequency ÷ class width':'Equal class widths: heights proportional to frequencies')}{text(50,300,'Adjacent bars represent continuous class intervals.')}</>;
 }else if(visual.kind==='fraction'||visual.kind==='attention'){
  const nums=visual.numbers.slice(0,visual.kind==='attention'?2:undefined).filter(n=>Number.isFinite(n)&&n>=0),total=nums.reduce((s,n)=>s+n,0);
  let left=50;
  drawing=<>{nums.map((n,i)=>{const width=total?420*n/total:0,start=left;left+=width;return <g key={i}><rect x={start} y="80" width={width} height="75" fill={colors[i%4]} opacity=".8"/><title>{`${visual.labels[i]}: ${format(n)} / ${format(total)}`}</title>{showValues&&text(50,195+i*22,`${visual.labels[i]}: ${format(n)} / ${format(total)} = ${format(n/total)}`)}</g>;})}{text(50,40,'Parts of the whole (normalized to 1)')}</>;
 }else if(visual.kind==='tangent'&&visual.numbers[1]<=visual.numbers[0]){
  const [r,d]=visual.numbers,scale=100/r;
  drawing=<><circle cx="250" cy="140" r="100" fill="none" stroke={colors[0]} strokeWidth="3"/><circle cx={250+d*scale} cy="140" r="5" fill={colors[1]}/>{d===r&&<path d="M350 30 V250" stroke={colors[1]} strokeWidth="3"/>}{text(40,280,d===r?'Point on circle: one tangent, touching segment length 0':'Point inside circle: no real tangent segment')}</>;
 }else if(visual.kind==='height'||visual.kind==='tangent'){
  const distance=visual.kind==='height'?visual.numbers[0]:visual.numbers[1],rise=visual.kind==='height'?distance*Math.tan(visual.numbers[1]*Math.PI/180):visual.numbers[0],base=visual.kind==='height'?distance:Math.sqrt(Math.max(0,distance*distance-rise*rise)),scale=Math.min(350/(base||1),180/(rise||1));
  drawing=<><polygon points={`70,230 ${70+base*scale},230 ${70+base*scale},${230-rise*scale}`} fill="#0891b2" fillOpacity=".15" stroke={colors[0]} strokeWidth="3"/><path d={`M${70+base*scale-15} 230 v-15 h15`} fill="none" stroke="currentColor"/>{text(70,260,`Horizontal segment: ${format(base)}`)}{text(70,285,`Vertical segment: ${format(rise)}`)}{text(70,310,visual.kind==='height'?`Eye height ${format(visual.numbers[2])} is added separately`:`Hypotenuse OP: ${format(distance)}`)}</>;
 }else if(visual.kind==='solid'){
  drawing=model==='cuboid'?<><path d="M100 110 H300 V250 H100 Z M100 110 L180 50 H380 V190 L300 250 M300 110 L380 50 M380 190 H300" fill="#0891b2" fillOpacity=".12" stroke={colors[0]} strokeWidth="3"/>{text(100,285,`Dimensions: ${visual.numbers.map(format).join(' × ')}`)}{text(100,310,'Schematic view; lengths are listed below.')}</>:<><ellipse cx="260" cy="70" rx="100" ry="35" fill="#0891b2" fillOpacity=".2" stroke={colors[0]}/>{model==='sphere'?<circle cx="260" cy="140" r="100" fill="none" stroke={colors[0]} strokeWidth="3"/>:<><path d="M160 70 V220 M360 70 V220" stroke={colors[0]} strokeWidth="3"/><ellipse cx="260" cy="220" rx="100" ry="35" fill="none" stroke={colors[0]}/></>}{text(70,285,`Radius: ${format(visual.numbers[0])}`)}{text(70,310,'Schematic shape; use the calculated dimensions.')}</>;
 }else if(['angles','unit-circle','axes','sector'].includes(visual.kind)){
  const angle=(visual.kind==='axes'?visual.numbers[2]:visual.kind==='sector'?visual.numbers[1]:visual.numbers[0])??0,t=angle*Math.PI/180;
  drawing=<><circle cx="260" cy="140" r="100" fill="none" stroke="currentColor" opacity=".4"/>{visual.kind==='sector'&&angle>0&&angle<360&&<path d={`M260 140 L360 140 A100 100 0 ${angle>180?1:0} 0 ${260+100*Math.cos(t)} ${140-100*Math.sin(t)} Z`} fill={colors[0]} opacity=".25"/>}<path d="M150 140 H370 M260 30 V250" stroke="currentColor" opacity=".3"/><line x1="260" y1="140" x2={260+100*Math.cos(t)} y2={140-100*Math.sin(t)} stroke={colors[0]} strokeWidth="4"/>{text(30,275,`Angle from positive horizontal axis: ${format(angle)}°`)}</>;
 }else if(visual.kind==='area-growth'){
  const [a,b,h,k]=visual.numbers.map(Math.abs),scale=Math.min(330/(a+h||1),190/(b+k||1));
  drawing=<>{[[a,b,0,0,'ab'],[h,b,a,0,'bh'],[a,k,0,b,'ak'],[h,k,a,b,'hk']].map(([w,d,x,y,label],i)=><g key={i}><rect x={80+Number(x)*scale} y={25+Number(y)*scale} width={Number(w)*scale} height={Number(d)*scale} fill={colors[i]} opacity=".6" stroke="currentColor"/><title>{`${label}: ${format(Number(w)*Number(d))}`}</title></g>)}{text(30,255,'Original area + two strips + corner')}{text(30,278,'Hover each region for its area; lengths use magnitudes.')}</>;
 }else if(visual.kind==='curve'){
  drawing=<><path d="M50 140 H470 M260 30 V260" stroke="currentColor" opacity=".4"/><line x1="310" y1="30" x2="310" y2="260" stroke={colors[0]} strokeWidth="3"/>{text(40,290,`Vertical line x = ${format(model==='linear-system'?(values.p??7)/values.a:-(values.c??0)/values.a)}`)}</>;
 }else if(visual.kind==='number-line'){
  const nums=visual.numbers.filter(Number.isFinite),lo=Math.min(...nums)-1,hi=Math.max(...nums)+1;
  drawing=<><path d="M40 145 H475" stroke="currentColor"/>{nums.map((n,i)=><g key={i}><circle cx={40+(n-lo)/(hi-lo)*435} cy="145" r="6" fill={colors[i%4]}/>{showValues&&text(35,205+i*20,`${visual.labels[i]??'Value'}: ${format(n)}`)}<title>{format(n)}</title></g>)}</>;
 }else{
  let entries=result.outputs.map(o=>({label:o.label,value:Number(o.value),display:o.value}));
  if(visual.kind==='quantum-single'){
   const a=values.a,b=values.b,total=a*a+b*b,p=basis==='Z'?a*a/total:(a+b)**2/(2*total);
   entries=[{label:basis==='Z'?'P(0)':'P(+)',value:p,display:format(p)},{label:basis==='Z'?'P(1)':'P(−)',value:1-p,display:format(1-p)}];
  }
  const finite=entries.filter(e=>Number.isFinite(e.value)),max=Math.max(1,...finite.map(e=>Math.abs(e.value))),height=Math.min(40,210/Math.max(1,finite.length));
  drawing=<>{finite.map((e,i)=><g key={e.label}><rect x={230} y={25+i*height} width={Math.abs(e.value)/max*230} height={height-5} fill={colors[i%4]} opacity=".75"/>{text(10,42+i*height,e.label)}{showValues&&text(235,42+i*height,e.display)}<title>{`${e.label}: ${e.display}`}</title></g>)}{text(15,280,'Bar length represents magnitude; signed values are labelled.')}</>;
 }
 const buttonClass='rounded-lg border px-3 py-2 text-sm font-bold';
 return <figure className="space-y-3 rounded-xl border border-cyan-300 bg-cyan-50/40 p-4 dark:border-cyan-700 dark:bg-cyan-950/20" data-testid="concept-visualization"><h3 className="font-black">{visual.title}</h3>{drawing&&<><svg role="img" aria-label={visual.title} viewBox="0 0 520 330" className="w-full max-h-96">{drawing}</svg><button className={buttonClass} onClick={()=>setShowValues(!showValues)}>{showValues?'Hide values and predict':'Reveal values'}</button></>}{model==='pg-32033'&&<div className="flex flex-wrap gap-2">{[[0,'Product |00⟩'],[45,'Bell state'],[90,'Product |11⟩']].map(([angle,label])=><button className={buttonClass} key={label} onClick={()=>onChange({a:Number(angle)})}>{label}</button>)}</div>}{model==='pg-32032'&&<div className="flex flex-wrap gap-2">{['X','Z','H'].map(gate=><button className={buttonClass} key={gate} onClick={()=>{const t=values.a*Math.PI/180,p=values.b*Math.PI/180,x=Math.sin(t)*Math.cos(p),y=Math.sin(t)*Math.sin(p),z=Math.cos(t);onChange(gate==='X'?{a:180-values.a,b:(360-values.b)%360}:gate==='Z'?{b:(values.b+180)%360}:{a:Math.acos(Math.max(-1,Math.min(1,x)))*180/Math.PI,b:(Math.atan2(-y,z)*180/Math.PI+360)%360});}}>Apply {gate} gate</button>)}</div>}{model==='pg-32031'&&<div className="flex flex-wrap gap-2">{(['Z','X'] as const).map(b=><button className={buttonClass} aria-pressed={basis===b} key={b} onClick={()=>setBasis(b)}>Measure in {b} basis</button>)}</div>}<figcaption className="text-base leading-7">{visual.explanation}</figcaption></figure>;
}

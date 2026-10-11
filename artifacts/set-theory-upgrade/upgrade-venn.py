from pathlib import Path
p=Path('src/modules/set-theory/premium/VennCanvas.tsx')
s=p.read_text(encoding='utf-8')
s=s.replace(" const history=useRef<Snapshot[]>([])"," const [selectionActive,setSelectionActive]=useState(false),[selectionColor,setSelectionColor]=useState('#ff8a00');\n const selectRegion=(mask:number)=>{setRegion(mask);setSelectionActive(true);};\n const inspectElement=(item:string|null)=>{setInspected(item);if(item!==null)selectRegion(membership(store,item));};\n const history=useRef<Snapshot[]>([])")
s=s.replace("radius:circles[0].r,setRadius:r=>updateCircle('A',{r}),", "radius:circles[0].r,setRadius:r=>updateCircle('A',{r}),setCircleRadius:(id,r)=>updateCircle(id,{r}),selectionActive,selectionColor,setSelectionColor,clearSelection:()=>{setSelectionActive(false);setInspected(null);},")
s=s.replace('notice,inspected,setInspected,region,setRegion,','notice,inspected,setInspected:inspectElement,region,setRegion:selectRegion,')
s=s.replace('setRegion(mask);if(paint)', 'selectRegion(mask);if(paint)')
s=s.replace('onFocus={()=>setInspected(item)}','onFocus={()=>inspectElement(item)}')
s=s.replace('setInspected(item);setRegion(membership(store,item));','inspectElement(item);')
s=s.replace('className="st-draggable"><circle cx={points[item].x}', 'className={`st-draggable ${selectionActive&&membership(store,item)===region?"vu-region-member":""} ${inspected===item?"vu-selected-element":""}`}><circle cx={points[item].x}')
marker=" {circles.filter(c=>!beginner||c.id!=='C').map"
overlay=''' {!compact&&selectionActive&&(()=>{let node:React.ReactNode=<rect x="20" y="20" width="680" height="460" fill={selectionColor} fillOpacity=".5" mask={`url(#${uid}-exclude-${region})`}/>;circles.forEach((c,i)=>{if(region&(1<<i))node=<g clipPath={`url(#${uid}-clip-${c.id})`}>{node}</g>;});return <g data-inspected-region={region} className="vu-region-glow" style={{color:selectionColor}} pointerEvents="none">{node}</g>;})()}
'''
s=s.replace(marker,overlay+marker)
s=s.replace(' {!compact&&inspected', ' {!compact&&inspected')
s=s.replace(' <svg ref={svgRef}', ''' {!compact&&selectionActive&&<div className="vu-selection-summary" role="status"><b>Inspecting: {regionName(region)}</b><span>{regionMeaning(region)}</span><button onClick={()=>{setSelectionActive(false);setInspected(null);}}>Clear highlight</button></div>}
 <svg ref={svgRef}''')
s=s.replace('export type VennApi={','export type VennApi={setCircleRadius:(id:string,r:number)=>void;selectionActive:boolean;selectionColor:string;setSelectionColor:(color:string)=>void;clearSelection:()=>void;')
p.write_text(s,encoding='utf-8')
p=Path('src/modules/set-theory/premium/Venn.tsx');s=p.read_text(encoding='utf-8')
s="import { VennClarity, RadiusControls } from './VennClarity';\nimport './vennClarity.css';\n"+s
start=s.index('<label className="st-range">Set A radius')
end=s.index('</label>',start)+len('</label>')
s=s[:start]+'<RadiusControls api={api}/>'+s[end:]
s=s.replace('<aside className="st-stack">','<aside className="st-stack"><VennClarity api={api} expression={expression} setExpression={setExpression}/>')
p.write_text(s,encoding='utf-8')
p=Path('src/modules/set-theory/premium/VennLearning.tsx');s=p.read_text(encoding='utf-8')
s=s.replace('<Card title="Region inspector">','<div className={`vu-linked-card vu-inspector ${api.selectionActive?"is-selected":""}`}><Card title="Region inspector"><p className="vu-eyebrow">Select a region → see its orange glow on the diagram</p>')
s=s.replace('</p></Card><Card title="Element passport">','</p><button onClick={api.clearSelection}>Clear selection</button><label>Highlight color<select aria-label="Region highlight color" value={api.selectionColor} onChange={e=>api.setSelectionColor(e.target.value)}><option value="#ff8a00">Amber</option><option value="#e11d48">Rose</option><option value="#2563eb">Blue</option></select></label></Card></div><Card title="Element passport">',1)
s=s.replace('<Card title="Live linked representations">','<div className={`vu-linked-card vu-linked ${api.inspected!==null?"is-selected":""}`}><Card title="Live linked representations"><p className="vu-eyebrow">Diagram ↔ rosters ↔ membership table · select an element to link every view</p>')
s=s.replace('<tr key={x} onClick={()=>api.setInspected(x)}>','<tr key={x} className={api.inspected===x?"vu-table-selected":api.selectionActive&&membership(model,x)===api.region?"vu-table-region":""} onClick={()=>api.setInspected(x)}>')
s=s.replace("{set.includes(x)?'Yes':'No'}","{set.includes(x)?'✓ Yes':'— No'}")
s=s.replace('</div></Card><Card title="Rules and scenarios">','</div><p role="status">{api.inspected?`Linked element: ${api.inspected} · ${regionMeaning(membership(model,api.inspected))}`:"Choose a table row or an object in the diagram."}</p></Card></div><Card title="Rules and scenarios">',1)
p.write_text(s,encoding='utf-8')

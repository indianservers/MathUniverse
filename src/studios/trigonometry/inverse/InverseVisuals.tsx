import { useId, useRef, useState, type PointerEvent } from 'react';
import { bounds, clamp, colors, composition, degrees, format, inverseValue, piLabel, type InverseKind } from './inverseMath';

const W = 540, H = 310, L = 55, R = 510, T = 27, B = 270;
function localPoint(event: PointerEvent<SVGSVGElement>) {
  const matrix = event.currentTarget.getScreenCTM();
  if (!matrix) return null;
  const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(matrix.inverse());
  return { x: point.x, y: point.y };
}
export function InverseFunctionGraph({ kind, value, onChange, asymptotes = true, preview = false, reverse, composed = false }: {
  kind: InverseKind; value: number; onChange?: (x: number) => void; asymptotes?: boolean; preview?: boolean; reverse?: boolean; composed?: boolean;
}) {
  const [zoom,setZoom]=useState(1),[grid,setGrid]=useState(true);
  const svgRef=useRef<SVGSVGElement>(null);
  const marker = useId().replace(/:/g, '');
  const extent = composed && reverse ? Math.max(Math.PI * 2, Math.abs(value) * 1.1) : kind === 'arctan' ? Math.max(5, Math.abs(value) * 1.15) : 1.15;
  const xmin = -extent, xmax = extent;
  const ymin = composed && !reverse ? -extent : kind === 'arccos' ? -.15 : -Math.PI / 2 - .2;
  const ymax = composed && !reverse ? extent : kind === 'arccos' ? Math.PI + .2 : Math.PI / 2 + .2;
  const px = (x: number) => L + (x - xmin) / (xmax - xmin) * (R - L);
  const py = (y: number) => B - (y - ymin) / (ymax - ymin) * (B - T);
  const evaluate = (x: number) => composed ? composition(kind, !!reverse, x).output : inverseValue(kind, x);
  const domainMin = composed && reverse || kind === 'arctan' ? xmin : -1;
  const domainMax = composed && reverse || kind === 'arctan' ? xmax : 1;
  let path = '', previous: number | null = null;
  for (let i = 0; i <= 360; i++) {
    const x = domainMin + (domainMax - domainMin) * i / 360, y = evaluate(x);
    if (y === null || !Number.isFinite(y)) { previous = null; continue; }
    path += `${previous === null || Math.abs(y - previous) > 1 ? 'M' : 'L'}${px(x).toFixed(2)},${py(y).toFixed(2)} `;
    previous = y;
  }
  const output = evaluate(value);
  const changeFromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const point = localPoint(event);
    if (!point || !onChange) return;
    onChange(clamp(xmin + (point.x - L) / (R - L) * (xmax - xmin), domainMin, domainMax));
  };
  const xTicks = composed && reverse || kind === 'arctan' ? [-extent, -extent / 2, 0, extent / 2, extent] : [-1, -.5, 0, .5, 1];
  const yTicks = composed && !reverse ? [-extent, 0, extent] : kind === 'arccos' ? [0, Math.PI / 2, Math.PI] : [-Math.PI / 2, 0, Math.PI / 2];
  const width=W/zoom,height=H/zoom,left=clamp(px(value)-width/2,0,W-width),top=clamp(py(output??0)-height/2,0,H-height);
  return <div className="ivt-plot-wrap">{!preview&&<div className="ivt-svg-tools"><button disabled={zoom>=2} onClick={()=>setZoom(z=>Math.min(2,z+.25))} aria-label="Zoom graph in">Zoom +</button><button disabled={zoom<=1} onClick={()=>setZoom(z=>Math.max(1,z-.25))} aria-label="Zoom graph out">Zoom −</button><button onClick={()=>setZoom(1)}>Fit graph</button><label><input type="checkbox" checked={grid} onChange={e=>setGrid(e.target.checked)}/>Grid</label><button onClick={()=>saveSvg(svgRef.current,`${kind}-graph.svg`)}>Export SVG</button>{onChange&&<span>Focus graph: ← → step, Shift for finer steps, Home/End for boundaries.</span>}</div>}<svg ref={svgRef} viewBox={`${left} ${top} ${width} ${height}`} className={`ivt-graph ${preview ? 'ivt-preview' : ''}`} tabIndex={onChange?0:undefined} role={onChange?'slider':'img'} aria-valuemin={onChange?domainMin:undefined} aria-valuemax={onChange?domainMax:undefined} aria-valuenow={onChange?value:undefined} aria-valuetext={onChange?`${value}; output ${output===null?'undefined':format(output)} radians`:undefined} onKeyDown={e=>{if(!onChange)return;const step=(domainMax-domainMin)/(e.shiftKey?1000:100);if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();onChange(clamp(value+(e.key==='ArrowRight'?step:-step),domainMin,domainMax));}if(e.key==='Home'||e.key==='End'){e.preventDefault();onChange(e.key==='Home'?domainMin:domainMax);}}} aria-label={`${kind} ${composed ? reverse ? 'reverse composition' : 'direct composition' : 'function'} graph. ${output === null ? 'Undefined at current input.' : `Input ${format(value)}, output ${format(output)}.`}`}
    onPointerDown={onChange ? event => { event.currentTarget.setPointerCapture(event.pointerId); changeFromPointer(event); } : undefined}
    onPointerMove={onChange ? event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) changeFromPointer(event); } : undefined}
    onPointerUp={onChange ? event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); } : undefined}>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 10 5 0 10Z" fill="#172955" /></marker></defs>
    {grid&&xTicks.map(x => <line key={x} x1={px(x)} x2={px(x)} y1={T} y2={B} className="ivt-gridline" />)}
    {grid&&yTicks.map(y => <line key={y} x1={L} x2={R} y1={py(y)} y2={py(y)} className="ivt-gridline" />)}
    <path d={`M${L - 8} ${py(0)}H${R + 8}M${px(0)} ${B + 12}V${T - 10}`} className="ivt-axis" markerEnd={`url(#${marker})`} />
    <path d={`M${L} ${py(0)}H${R + 8}`} className="ivt-axis" markerEnd={`url(#${marker})`} />
    {xTicks.map(x => <g key={x}><path d={`M${px(x)} ${py(0) - 4}v8`} className="ivt-axis" /><text x={px(x)} y={py(0) + 23} textAnchor="middle">{composed && reverse ? piLabel(x) : Number(x.toFixed(1))}</text></g>)}
    {yTicks.filter(y => y !== 0).map(y => <text key={y} x={px(0) - 12} y={py(y) + 5} textAnchor="end">{composed && !reverse ? Number(y.toFixed(1)) : piLabel(y)}</text>)}
    <text x={R + 14} y={py(0) + 5}>x</text><text x={px(0) + 12} y={T - 10}>{composed && !reverse ? 'y' : 'y (radians)'}</text>
    {kind === 'arctan' && !composed && asymptotes && [-Math.PI / 2, Math.PI / 2].map(y => <g key={y}><line x1={L} x2={R} y1={py(y)} y2={py(y)} stroke={colors[kind]} strokeDasharray="7 5" opacity=".5" /><text x={R} y={py(y) - 6} textAnchor="end" fill={colors[kind]}>y = {piLabel(y)}</text></g>)}
    <path d={path} fill="none" stroke={colors[kind]} strokeWidth="3.2" strokeLinecap="round" />
    {kind !== 'arctan' && !(composed && reverse) && [-1, 1].map(x => <circle key={x} cx={px(x)} cy={py(evaluate(x)!)} r="4.5" fill={colors[kind]} />)}
    {output !== null && Math.abs(value) <= extent && <g className="ivt-active-point"><path d={`M${px(value)} ${py(0)}V${py(output)}H${px(0)}`} fill="none" stroke="#167bff" strokeDasharray="5 5" strokeWidth="1.5" /><circle cx={px(value)} cy={py(output)} r="10" fill="#fff" stroke="#9bc9ff" strokeWidth="2" /><circle cx={px(value)} cy={py(output)} r="6" fill={colors[kind]} />{!preview && <text x={clamp(px(value), 125, 420)} y={clamp(py(output) - 17, 18, B - 10)} textAnchor="middle" className="ivt-point-label">({format(value, 2)}, {format(output, 3)})</text>}</g>}
  </svg></div>;
}

export function InverseTrigUnitCircle({ kind, theta, onChange, comparisonAngle, preview = false }: {kind: InverseKind; theta: number; onChange?: (x: number) => void; comparisonAngle?: number; preview?: boolean}) {
  const cx = 155, cy = 148, r = 98, [min, max] = bounds[kind];
  const xy = (angle: number, radius = r) => [cx + radius * Math.cos(angle), cy - radius * Math.sin(angle)];
  const [sx, sy] = xy(min), [ex, ey] = xy(max), [x, y] = xy(theta), [ax, ay] = xy(theta, 29);
  const sector = `M${cx} ${cy}L${sx} ${sy}A${r} ${r} 0 0 0 ${ex} ${ey}Z`;
  const pointer = (event: PointerEvent<SVGSVGElement>) => {
    const p = localPoint(event); if (!p || !onChange) return;
    let a = Math.atan2(cy - p.y, p.x - cx);
    if (kind === 'arccos' && a < 0) a = p.x < cx ? Math.PI : 0;
    else if (kind !== 'arccos' && Math.abs(a) > Math.PI / 2) a = Math.sign(a) * Math.PI / 2;
    a = clamp(a, min + (kind === 'arctan' ? .001 : 0), max - (kind === 'arctan' ? .001 : 0));
    onChange(a);
  };
  return <svg viewBox="0 0 310 282" className={`ivt-circle ${preview ? 'ivt-preview' : ''}`} tabIndex={onChange?0:undefined} role={onChange?'slider':'img'} aria-valuemin={onChange?degrees(min):undefined} aria-valuemax={onChange?degrees(max):undefined} aria-valuenow={onChange?degrees(theta):undefined} onKeyDown={e=>{if(!onChange)return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key)){e.preventDefault();const edge=kind==='arctan'?.001:0;onChange(clamp(e.key==='Home'?min:e.key==='End'?max:theta+(['ArrowRight','ArrowUp'].includes(e.key)?1:-1)*Math.PI/180*(e.shiftKey?.1:1),min+edge,max-edge));}}} aria-label={`${kind} principal sector ${kind === 'arccos' ? 'upper' : 'right'} semicircle; angle ${format(degrees(theta), 2)} degrees, coordinate (${format(Math.cos(theta), 3)}, ${format(Math.sin(theta), 3)}).`}
    onPointerDown={onChange ? e => { e.currentTarget.setPointerCapture(e.pointerId); pointer(e); } : undefined}
    onPointerMove={onChange ? e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) pointer(e); } : undefined}
    onPointerUp={onChange ? e => { if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId); } : undefined}>
    <path d={sector} fill={colors[kind]} fillOpacity=".085" />
    <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1f376b" strokeWidth="1.4" />
    <path d={`M${sx} ${sy}A${r} ${r} 0 0 0 ${ex} ${ey}`} fill="none" stroke={colors[kind]} strokeWidth="2.5" />
    {[min, max].map(a => {const [u,v]=xy(a);return <circle key={a} cx={u} cy={v} r="4" fill={kind==='arctan'?'#fff':colors[kind]} stroke={colors[kind]} strokeWidth="1.8" />;})}
    <path d={`M30 ${cy}H280M${cx} 268V22`} className="ivt-axis" /><path d="M273 143l8 5-8 5M150 29l5-8 5 8" className="ivt-axis" />
    <text x="286" y="151">x</text><text x="165" y="23">y</text><text x="257" y="169">1</text><text x="35" y="169">−1</text><text x="164" y="48">1</text><text x="166" y="261">−1</text>
    {comparisonAngle !== undefined && (() => {const [u,v]=xy(comparisonAngle);return <g><path d={`M${cx} ${cy}L${u} ${v}`} stroke="#8997b2" strokeDasharray="4 4"/><circle cx={u} cy={v} r="5" fill="#8f9bb5"/><text x={u} y={v<cy?v-13:v+22} textAnchor="middle" fontSize="13">{piLabel(comparisonAngle)} (original)</text></g>;})()}
    <path d={`M${cx} ${cy}L${x} ${y}M${x} ${y}V${cy}M${x} ${y}H${cx}`} fill="none" stroke="#087cff" strokeWidth="1.8" strokeDasharray="0 0 4 4" />
    <path d={`M${cx} ${cy}L${x} ${y}`} stroke="#087cff" strokeWidth="2.4" />
    {Math.abs(theta)>1e-8&&<path d={`M${cx+29} ${cy}A29 29 0 ${Math.abs(theta)>Math.PI?1:0} ${theta<0?1:0} ${ax} ${ay}`} fill="none" stroke="#087cff" strokeWidth="1.5" />}
    <circle cx={x} cy={y} r="6" fill={colors[kind]} stroke="#fff" strokeWidth="2" />
    <text x={cx + 35 * Math.cos(theta/2)} y={cy - 35 * Math.sin(theta/2) - 4} fill="#087cff">θ</text>
    {!preview&&<text x="155" y="281" textAnchor="middle" fontSize="13">(cos θ, sin θ) = ({format(Math.cos(theta), 2)}, {format(Math.sin(theta), 2)})</text>}
  </svg>;
}

export function PrincipalRangeNumberLine({kind}: {kind: InverseKind}) {
  const [min,max]=bounds[kind], x=(n:number)=>35+(n+Math.PI/2)/(Math.PI*1.5)*230;
  return <svg viewBox="0 0 300 86" className="ivt-numberline" role="img" aria-label={`${kind}: ${kind==='arctan'?'open':'closed'} endpoints, ${kind==='arccos'?'0 to π':'−π/2 to π/2'}`}><path d="M15 35H285" className="ivt-axis"/><path d={`M${x(min)} 35H${x(max)}`} stroke={colors[kind]} strokeWidth="4"/>{[min,max].map(n=><g key={n}><circle cx={x(n)} cy="35" r="5" fill={kind==='arctan'?'#fff':colors[kind]} stroke={colors[kind]} strokeWidth="2"/><text x={x(n)} y="64" textAnchor="middle">{piLabel(n)}</text></g>)}{min!==0&&<text x={x(0)} y="64" textAnchor="middle">0</text>}</svg>;
}

export function RatioTriangle({value}: {value:number}) {
  const scale=140/Math.max(1,Math.abs(value)), cx=65, cy=value>=0?185:65, x=cx+scale,y=cy-value*scale;
  const theta=Math.atan(value), a=cx+27*Math.cos(theta), b=cy-27*Math.sin(theta);
  return <svg viewBox="0 0 320 270" className="ivt-triangle" role="img" aria-label={`Right triangle with adjacent 1 and signed opposite ${format(value,2)}. Angle ${format(degrees(theta),2)} degrees.`}><path d={`M${cx} ${cy}L${x} ${y}V${cy}Z`} fill="#00b982" fillOpacity=".12" stroke="#008c69" strokeWidth="2.5"/><path d={`M${x-10} ${cy}v${value<0?10:-10}h10`} className="ivt-axis"/><circle cx={x} cy={y} r="5" fill="#008c69"/><path d={`M${cx+27} ${cy}A27 27 0 0 ${theta<0?1:0} ${a} ${b}`} stroke="#008c69" fill="none"/><text x={cx+32} y={cy+(value<0?24:-12)}>θ</text><text x={(cx+x)/2} y={cy+(value<0?-17:24)} textAnchor="middle">adjacent = 1</text><text x={x+10} y={(cy+y)/2}>opposite</text><text x={x+10} y={(cy+y)/2+22}>= {format(value,2)}</text><text x="160" y="252" textAnchor="middle">tan θ = x / 1 = x (signed ratio)</text></svg>;
}

export function AlpineScene() {
  const id=useId().replace(/:/g,'');
  return <svg className="ivt-alpine" viewBox="0 0 1000 290" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id={id} x2="0" y2="1"><stop stopColor="#85b8eb"/><stop offset="1" stopColor="#eef8ff"/></linearGradient></defs><rect width="1000" height="290" fill={`url(#${id})`}/><circle cx="190" cy="70" r="48" fill="#fff" opacity=".22"/><path d="M0 245 120 150 178 196 300 45 380 159 445 92 540 190 630 35 700 145 770 90 910 212 1000 130V290H0Z" fill="#8cb6df" opacity=".6"/><path d="m180 196 120-151 80 114-38-19-28-51-20 32-27-7-38 65Zm360-6 90-155 70 110-32-18-27-53-24 45-20-12-31 51ZM700 145l70-55 58 78-34-17-28-35-22 29Z" fill="#fff" opacity=".85"/><path d="M0 280 215 228 318 258 480 167 560 238 675 189 850 264 1000 223V290H0Z" fill="#c4e1f2"/><path d="M0 279q250-25 450 3t550-14v22H0Z" fill="#f5fbff" opacity=".8"/></svg>;
}

function saveSvg(svg:SVGSVGElement|null,name:string){if(!svg)return;const copy=svg.cloneNode(true) as SVGSVGElement;copy.setAttribute('xmlns','http://www.w3.org/2000/svg');const originals=[svg,...svg.querySelectorAll('*')],clones=[copy,...copy.querySelectorAll('*')];originals.forEach((el,i)=>{const style=getComputedStyle(el);for(const attr of ['fill','stroke','stroke-width','font-size','font-family','font-weight'])clones[i].setAttribute(attr,style.getPropertyValue(attr));});const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)],{type:'image/svg+xml'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}

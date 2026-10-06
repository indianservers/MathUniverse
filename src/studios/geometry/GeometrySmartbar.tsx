import { useRef, useState } from "react";
import { ZoomIn, ZoomOut, Maximize2, Contrast, Type, MoreHorizontal } from "lucide-react";
type Props={zoom:number;onZoom:(value:number)=>void;contrast:boolean;onContrast:()=>void;largeLabels:boolean;onLabels:()=>void;compact:boolean;onCompact:()=>void};
export default function GeometrySmartbar(p:Props){
 const ref=useRef<HTMLDivElement>(null);const [menu,setMenu]=useState(false);const [status,setStatus]=useState('');const [help,setHelp]=useState(false);
 const root=()=>ref.current?.closest<HTMLElement>('.geo-lesson-workspace');
 const svg=()=>root()?.querySelector('svg');
 const copy=async(text:string)=>{try{await navigator.clipboard.writeText(text);setStatus('Copied');}catch{setStatus('Clipboard unavailable');}};
 const download=()=>{const figure=svg();if(!figure)return;const url=URL.createObjectURL(new Blob([figure.outerHTML],{type:'image/svg+xml'}));const link=document.createElement('a');link.href=url;link.download='geometry-figure.svg';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Figure downloaded');};
 const fullscreen=async()=>{try{if(document.fullscreenElement===root())await document.exitFullscreen();else await root()?.requestFullscreen();}catch{setStatus('Fullscreen unavailable');}};
 return <div ref={ref} className="geo-smartbar" role="toolbar" aria-label="Figure smartbar">
 <button aria-label="Zoom in" title="Zoom in" onClick={()=>p.onZoom(Math.min(3,p.zoom+.2))}><ZoomIn/></button>
 <button aria-label="Zoom out" title="Zoom out" onClick={()=>p.onZoom(Math.max(.5,p.zoom-.2))}><ZoomOut/></button>
 <button aria-label="Fit figure" title="Fit figure" onClick={()=>p.onZoom(1)}><Maximize2/></button>
 <button aria-label="High contrast" title="High contrast" aria-pressed={p.contrast} onClick={p.onContrast}><Contrast/></button>
 <button aria-label="Large labels" title="Large labels" aria-pressed={p.largeLabels} onClick={p.onLabels}><Type/></button>
 <button aria-label="More figure tools" title="More figure tools" aria-expanded={menu} onClick={()=>setMenu(v=>!v)}><MoreHorizontal/></button>
 {menu&&<div className="geo-smartbar-menu"><button onClick={()=>void fullscreen()}>Fullscreen</button><button aria-pressed={p.compact} onClick={p.onCompact}>{p.compact?'Taller figure':'Compact figure'}</button><button onClick={()=>void copy(Array.from(root()?.querySelectorAll('svg text')??[]).map(e=>e.textContent).join('\n'))}>Copy measurements</button><button onClick={()=>void copy(window.location.href)}>Copy shareable URL</button><button onClick={download}>Download SVG</button><button onClick={()=>window.print()}>Print worksheet</button><button onClick={()=>setHelp(v=>!v)}>Keyboard shortcuts</button>{help&&<p>Wheel or +/− to zoom; 0 fits the figure. Tab to reach controls. Drag points to explore.</p>}<button onClick={()=>setMenu(false)}>Close menu</button></div>}
 <span className="vis-hidden" role="status">{status}</span></div>;
}

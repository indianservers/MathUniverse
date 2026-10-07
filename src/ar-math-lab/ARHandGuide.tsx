import GestureActionTable from './hand-intelligence/GestureActionTable';
import { useEffect, useState } from 'react';

export default function ARHandGuide({ native = false,forceOpen }: { native?: boolean;forceOpen?:boolean }) {
 const [open, setOpen] = useState(false);
 useEffect(()=>{const toggle=()=>setOpen(v=>!v);window.addEventListener('math-hand-guide-toggle',toggle);return()=>window.removeEventListener('math-hand-guide-toggle',toggle);},[]);
 useEffect(()=>{if(forceOpen!==undefined)setOpen(forceOpen);},[forceOpen]);
 return <div className="relative">
  <button type="button" className="min-h-11 rounded border border-cyan-300 px-3 text-xs font-bold" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>Hand guide</button>
  {open&&<div className="mt-2 w-full max-w-lg rounded-xl border border-cyan-400/50 bg-slate-950 p-3 text-xs text-white">
   <p className="mb-2 font-bold">How to use your hands</p>
   <GestureActionTable/>

   <p className="mt-2 text-cyan-200">{native?'Native hand tracking requires device support. Camera mode also supports camera-based hands.':'Use good light, keep fingertips visible, and move steadily. The status confirms when an object is grabbed. If tracking is lost, open your palm, pause, and close your fist again.'}</p>
   <button type="button" className="mt-2 min-h-11 rounded border px-3" onClick={()=>setOpen(false)}>Close guide</button>
  </div>}
 </div>;
}

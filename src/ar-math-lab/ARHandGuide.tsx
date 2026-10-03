import { useState } from 'react';

export default function ARHandGuide({ native = false }: { native?: boolean }) {
 const [open, setOpen] = useState(false);
 return <div className="relative">
  <button type="button" className="min-h-11 rounded border border-cyan-300 px-3 text-xs font-bold" aria-expanded={open} onClick={()=>setOpen(value=>!value)}>Hand guide</button>
  {open&&<div className={`absolute right-0 z-30 w-72 max-w-[80vw] max-h-[60vh] overflow-y-auto rounded-xl border border-cyan-400/50 bg-slate-950 p-3 text-xs text-white shadow-xl ${native?'bottom-full mb-1':'top-full mt-1'}`}>
   <p className="mb-2 font-bold">How to use your hands</p>
   <ol className="list-decimal space-y-1 pl-4">
    <li>{native?'Scan a surface and tap the ring to place your object.':'Start the camera and choose a graph or geometry object.'}</li>
    <li>{native?'Pinch thumb and index near the object to grab it.':'Keep your whole hand visible. Pinch thumb and index to grab the selected object.'}</li>
    <li>Keep pinching and move your hand to drag.</li>
    <li>Pinch with both hands. Spread apart to expand; bring together to shrink. Twist to rotate.</li>
    {!native&&<li>For one-hand zoom, choose Resize, then pinch and move up to enlarge or down to shrink.</li>}
    <li>Open your fingers to release.</li>
   </ol>
   <p className="mt-2 text-cyan-200">{native?'Native hand tracking requires device support. Camera mode also supports camera-based hands.':'Use good light, keep fingertips visible, and move steadily. Green dots show a grab. If tracking is lost, open your fingers and pinch again.'}</p>
   <button type="button" className="mt-2 min-h-11 rounded border px-3" onClick={()=>setOpen(false)}>Close guide</button>
  </div>}
 </div>;
}

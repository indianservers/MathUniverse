import {useSyncExternalStore} from 'react';
import {ruhiMotion} from './RuhiCinematicMotionEngine';
export function CinematicMotionControls(){
 const state=useSyncExternalStore(ruhiMotion.subscribe,ruhiMotion.snapshot,ruhiMotion.snapshot);
 return <fieldset style={{display:'flex',gap:6,flexWrap:'wrap',fontSize:12,padding:8,borderRadius:8}}><legend>Ruhi Cinematic Motion Engine</legend>
 <label><input type="checkbox" checked={ruhiMotion.enabled} onChange={e=>{ruhiMotion.configure({enabled:e.target.checked});}}/> Cinematic</label>
 <label>Speed <select value={ruhiMotion.speed} onChange={e=>{ruhiMotion.configure({speed:Number(e.target.value)});}}>{[.5,1,1.5,2].map(n=><option key={n} value={n}>{n}×</option>)}</select></label>
 <label><input type="checkbox" checked={ruhiMotion.reducedMotion} onChange={e=>{ruhiMotion.configure({reducedMotion:e.target.checked});}}/> Reduced motion</label>
 <button type="button" disabled={state.status==='idle'} onClick={()=>state.status==='paused'?ruhiMotion.resume():ruhiMotion.pause()}>{state.status==='paused'?'Resume':'Pause'}</button>
 <button type="button" disabled={state.status==='idle'} onClick={()=>ruhiMotion.skip()}>Skip</button>
 <button type="button" disabled={state.status==='idle'} onClick={()=>ruhiMotion.cancel()}>Cancel</button>
 <button type="button" disabled={state.status!=='idle'||!ruhiMotion.canReplay} onClick={()=>{void ruhiMotion.replay()?.catch(()=>{});}}>Replay</button>
 <label><input type="checkbox" checked={ruhiMotion.glow} onChange={e=>ruhiMotion.configure({glow:e.target.checked})}/> Glow</label>
 <label><input type="checkbox" checked={ruhiMotion.trails} onChange={e=>ruhiMotion.configure({trails:e.target.checked})}/> 2D trails</label>
 <span aria-live="polite">{state.status} {state.status==='idle'?'':`${Math.round(state.progress*100)}%`}</span>
 </fieldset>;
}

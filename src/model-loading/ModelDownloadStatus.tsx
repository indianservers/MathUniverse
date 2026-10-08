import {useSyncExternalStore} from 'react';
import {modelLoads} from './modelLoadStore';
import './modelLoading.css';
export default function ModelDownloadStatus(){
 const loads=useSyncExternalStore(modelLoads.subscribe,modelLoads.getSnapshot,modelLoads.getSnapshot);
 if(!loads.length)return null;
 return <aside className="model-downloads" aria-label="Model downloads">{loads.map(load=>{
  const progress=load.progress,percent=load.phase==='ready'?100:progress?.percent;
  return <section key={load.id} className="model-download-card" data-phase={load.phase}>
   <div className="model-download-title"><strong>{load.label}</strong>{(load.phase==='error'||load.phase==='ready')&&<button aria-label={`Dismiss ${load.label} download status`} onClick={()=>modelLoads.dismiss(load.id)}>×</button>}</div>
   <p role="status">{load.phase==='error'?`Unable to load. ${load.error}`:load.phase==='ready'?'Ready · 100% loaded':load.phase==='initializing'?'Download complete · initializing model…':`Downloading ${progress?.asset??'model…'}${percent!==undefined?` · ${percent}% loaded`:''}`}</p>
   {load.phase!=='error'&&<progress aria-label={`${load.label} ${load.phase==='initializing'?'initialization':'download'} progress`} max={100} value={load.phase==='initializing'?undefined:percent}/>}
   {load.phase==='downloading'&&progress&&<small>{(progress.loaded/1048576).toFixed(2)}{progress.total?` / ${(progress.total/1048576).toFixed(2)}`:''} MB{progress.total?'':' downloaded · size not supplied by server'}</small>}
  </section>;
 })}</aside>;
}

import { useState } from 'react';
import { HandIntelligenceRecorder } from './HandIntelligenceRecorder';
import { recordingInputs, replayCases, replayInputs, replaySequence } from './replay';
import type { HandIntelligenceState, IntelligenceProfile } from './types';

const download=(name:string,text:string,type:string)=>{const url=URL.createObjectURL(new Blob([text],{type}));const link=document.createElement('a');link.href=url;link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
export default function HandIntelligenceDeveloperPanel({recorder,state,fps,profile}:{recorder:HandIntelligenceRecorder;state?:HandIntelligenceState;fps:number;profile:IntelligenceProfile}){
  const [label,setLabel]=useState('grab'),[recording,setRecording]=useState(false),[fixture,setFixture]=useState<string>(replayCases[0]);
  const [replay,setReplay]=useState<ReturnType<typeof replaySequence>>([]),[error,setError]=useState('');
  const run=(inputs:Parameters<typeof replaySequence>[0])=>{try{setReplay(replaySequence(inputs,profile));setError('');}catch(e){setError(e instanceof Error?e.message:'Replay failed');}};
  return <section aria-label="Hand intelligence developer tools" className="space-y-3 rounded-lg border border-slate-500 p-3">
    <h3 className="font-bold">Hand intelligence diagnostics</h3>
    <p>{fps} measured tracking FPS · Intent: {state?.primaryIntent??'idle'} · confidence {(state?.interactionConfidence??0).toFixed(2)} · target {state?.targetObjectId??'none'} · phase {state?.phase??'idle'}</p>
    <p>{state?.reasons.join(' · ')}</p>
    <div className="flex flex-wrap items-center gap-2">
      <label>Sequence label <select aria-label="Recording intent label" className="bg-slate-950 p-2" value={label} onChange={e=>setLabel(e.target.value)}>{['idle','point','touch','grab','move','rotate','resize','stretch','push','release','inspect','accidental'].map(v=><option key={v}>{v}</option>)}</select></label>
      <button type="button" className="min-h-10 rounded border px-3" onClick={()=>{if(recording)recorder.stop();else recorder.start(label);setRecording(!recording);}}>{recording?'Stop local recording':'Record local features'}</button>
      <span>{recorder.count}/1800 frames · no images, no upload</span>
      <button type="button" disabled={!recorder.count} className="min-h-10 rounded border px-3 disabled:opacity-40" onClick={()=>download('hand-features.json',recorder.exportJSON(),'application/json')}>Export recording JSON</button>
      <button type="button" disabled={!recorder.count} className="min-h-10 rounded border px-3 disabled:opacity-40" onClick={()=>download('hand-features.csv',recorder.exportCSV(),'text/csv')}>Export recording CSV</button>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <label>Test sequence <select aria-label="Hand replay fixture" className="bg-slate-950 p-2" value={fixture} onChange={e=>setFixture(e.target.value)}>{replayCases.map(v=><option key={v}>{v}</option>)}</select></label>
      <button type="button" className="min-h-10 rounded border px-3" onClick={()=>run(replayInputs(fixture))}>Replay fixture</button>
      <label className="rounded border p-2">Replay a local JSON recording<input aria-label="Replay local hand recording" type="file" accept="application/json,.json" className="block max-w-full" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;try{if(file.size>10_000_000)throw new Error('Recording exceeds 10 MB.');run(recordingInputs(HandIntelligenceRecorder.parse(await file.text())));}catch(err){setError(err instanceof Error?err.message:'Invalid recording');}}}/></label>
    </div>
    {error&&<p role="alert" className="text-rose-300">{error}</p>}
    {replay.length>0&&<div className="overflow-x-auto"><p>Replayed {replay.length} frames. {replay.filter(f=>f.state.targetLocked).length} held frames; {replay.filter(f=>f.result.semanticEdit).length} mathematical edits.</p><table className="w-full text-left"><thead><tr>{['Time','Intent','Confidence','Target','Phase','Transform / mathematical edit'].map(t=><th key={t} className="p-1">{t}</th>)}</tr></thead><tbody>{replay.filter((_,i)=>i%Math.max(1,Math.floor(replay.length/12))===0).map((f,i)=><tr key={i}><td>{Math.round(f.state.timestamp)}</td><td>{f.state.primaryIntent}</td><td>{f.state.interactionConfidence.toFixed(2)}</td><td>{f.state.targetObjectId??'none'}</td><td>{f.state.phase}</td><td>{f.result.semanticEdit?JSON.stringify(f.result.semanticEdit):`XYZ ${f.transform.position.map(v=>v.toFixed(2)).join(', ')} · size ${f.transform.scale.toFixed(2)}`}</td></tr>)}</tbody></table></div>}
  </section>;
}

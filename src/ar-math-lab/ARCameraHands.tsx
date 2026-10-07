import { useEffect, useRef, useState, type RefObject } from 'react';
import type { ARSceneState } from './types';
import ARHandGuide from './ARHandGuide';
import { HandIntelligenceEngine } from './hand-intelligence/HandIntelligenceEngine';
import { SpatialHandEngine } from './hand-intelligence/SpatialHandEngine';
import { SpatialProcessingLayer } from './hand-intelligence/SpatialProcessingLayer';
import { HandIntelligenceRecorder } from './hand-intelligence/HandIntelligenceRecorder';
import HandIntelligenceDeveloperPanel from './hand-intelligence/HandIntelligenceDeveloperPanel';
import type { CameraHandRuntime, IntelligenceFrameInput, IntelligenceProfile, SemanticEdit, HandIntelligenceState, ManipulationResult, ObjectAffordance } from './hand-intelligence/types';
import type { HandPoint } from './arHandGestures';

type Props = {
  video: RefObject<HTMLVideoElement>; stage: RefObject<HTMLDivElement>; stream: MediaStream | null;
  scene: ARSceneState; onChange: (delta: Partial<ARSceneState>) => void; objectId: string | null;
  runtime: RefObject<CameraHandRuntime>; mirrored?: boolean; onSemanticEdit?: (edit: SemanticEdit) => void; drawing?: boolean; interaction?: { mapPoint?:(point:HandPoint)=>HandPoint; profile?: IntelligenceProfile; engines: { intelligence: HandIntelligenceEngine; spatial: SpatialHandEngine }; targets: () => ObjectAffordance[]; transform: (state: HandIntelligenceState) => CameraHandRuntime["transform"]; frame: (state: HandIntelligenceState, result: ManipulationResult) => void };
};
export default function ARCameraHands({ video, stage, stream, scene, onChange, objectId, runtime, onSemanticEdit, drawing, mirrored=false, interaction }: Props) {
  const [enabled, setEnabled] = useState(true), [status, setStatus] = useState('Starting hand tracking…');
  const [retry, setRetry] = useState(0), [failed, setFailed] = useState(false), [profile, setProfile] = useState<IntelligenceProfile>('balanced');
  const [recognized,setRecognized]=useState(0),[poseLabel,setPoseLabel]=useState('');
  const gestureHistory=useRef<{past:CameraHandRuntime["transform"][];future:CameraHandRuntime["transform"][];start?:CameraHandRuntime["transform"];object?:string|null}>({past:[],future:[]});
  const [guideOpen,setGuideOpen]=useState(false);
  const [debug, setDebug] = useState(false), [snapshot, setSnapshot] = useState<CameraHandRuntime['state']>(), [fps, setFps] = useState(0);
  const [intelligenceEngine] = useState(() => interaction?.engines.intelligence ?? new HandIntelligenceEngine());
  const [spatialEngine] = useState(() => interaction?.engines.spatial ?? new SpatialHandEngine());
  const engine = useRef(intelligenceEngine), spatial = useRef(spatialEngine), recorder = useRef(new HandIntelligenceRecorder());
  const latest = useRef({ scene, onChange, onSemanticEdit, drawing, objectId, interaction }); latest.current = { scene, onChange, onSemanticEdit, drawing, objectId, interaction };
  const debugRef = useRef(debug); debugRef.current = debug;
  useEffect(() => { (interaction?.engines.intelligence ?? engine.current).setProfile(interaction?.profile ?? profile); }, [profile, interaction?.profile]);
  useEffect(() => {
    const intelligence = interaction?.engines.intelligence ?? engine.current, solver = interaction?.engines.spatial ?? spatial.current;
    const clearTracking=()=>{intelligence.reset();solver.reset();setRecognized(0);const live=runtime.current;if(live){live.state=undefined;live.result=undefined;live.landmarks=[];live.landmarksAt=undefined;}};
    clearTracking();setFailed(false);
    if (!enabled || !stream) return;
    if (typeof Worker === 'undefined' || typeof createImageBitmap === 'undefined' || typeof OffscreenCanvas === 'undefined') {
      setStatus('Hand tracking unavailable in this browser. Use touch controls.'); return;
    }
    let pendingEdit: SemanticEdit | undefined;
    let alive = true, ready = false, busy = false, raf = 0, last = 0, lastVideo = -1, lastUI = 0, lastCommit = 0, lastFrame = 0, averageFrame = 33, processingMs=0;
    const worker = new Worker(new URL('./arHandTracking.worker.ts', import.meta.url), { type: 'module' });
    setStatus('Loading on-device hand tracking…');
    const fail = () => {
      ready = false; busy = false; clearTracking(); setFailed(true);
      setStatus('Hand tracker could not start. Retry hand tracking or use touch controls.'); clearTimeout(timeout); worker.terminate();
    };
    const timeout = window.setTimeout(() => { if (!ready) fail(); }, 30000);
    worker.onmessage = event => {
      if (!alive) return;
      if (event.data.type === 'ready') { ready = true; clearTimeout(timeout); setStatus('Point to select. Pause over the object and close your fist to grab.'); }
      if (event.data.type === 'error') fail();
      if (event.data.type !== 'hands') return;
      busy = false;
      if (document.hidden) { clearTracking(); return; }
      const live = runtime.current, element = video.current, area = stage.current;
      if (!live || !element || !area) return;
      const time = event.data.timestamp as number;
      processingMs=processingMs*.8+(event.data.processingMs??0)*.2;
      if (lastFrame) averageFrame = averageFrame * .85 + (time - lastFrame) * .15;
      lastFrame = time;
      const videoAspect = element.videoWidth / Math.max(1, element.videoHeight), viewAspect = latest.current.interaction ? videoAspect : area.clientWidth / Math.max(1, area.clientHeight);
      const landmarks = event.data.landmarks as HandPoint[][];
      const input: IntelligenceFrameInput = {
        timestamp: time, camera: true, selectedObjectId: latest.current.objectId ?? undefined, tool: latest.current.drawing ? 'draw' : 'auto',
        latencyMs: Math.min(150, performance.now() - time + 16), targets: latest.current.interaction?.targets() ?? live.targets,
        hands: landmarks.map((points, i) => ({
          landmarks: points.map(p => { const mapped = SpatialProcessingLayer.coverPoint([p.x, p.y, p.z], videoAspect, viewAspect, mirrored); const point={ x: mapped[0], y: mapped[1], z: mapped[2] };return latest.current.interaction?.mapPoint?.(point)??point; }),
          handedness: event.data.handedness[i]?.[0]?.categoryName ?? 'unknown', confidence: event.data.handedness[i]?.[0]?.score ?? .85,
        })),
      };
      live.landmarks=input.hands.map(h=>h.landmarks??[]);live.landmarksAt=performance.now();
      const state = intelligence.update(input);
      if (latest.current.interaction) live.transform = latest.current.interaction.transform(state);
      const history=gestureHistory.current;if(history.object!==latest.current.objectId){history.past=[];history.future=[];history.start=undefined;history.object=latest.current.objectId;}
      if(!latest.current.interaction&&state.targetLocked&&!live.state?.targetLocked)history.start=structuredClone(live.transform);
      if(!latest.current.interaction&&!state.targetLocked&&history.start){history.past.push(history.start);history.past=history.past.slice(-30);history.future=[];history.start=undefined;}
      const result = solver.solve(state, live.transform, true, intelligence.profile);
      if(state.command&&!latest.current.interaction){const command=state.command;let transform:CameraHandRuntime['transform']|undefined;
       if(command==='undo'&&history.past.length){history.future.push(structuredClone(live.transform));transform=history.past.pop();}
       if(command==='redo'&&history.future.length){history.past.push(structuredClone(live.transform));transform=history.future.pop();}
       if(command==='fit'){history.past.push(structuredClone(live.transform));history.future=[];transform={position:[0,0,0],rotation:[0,0,0],scale:1};}
       if(transform){live.transform=transform;solver.reset();latest.current.onChange({objectPosition:transform.position,objectRotation:transform.rotation,objectScale:transform.scale});}
       if(command==='labels')latest.current.onChange({showLabels:!latest.current.scene.showLabels});
       if(command==='grid')latest.current.onChange({showGrid:!latest.current.scene.showGrid});
       if(command==='activate')latest.current.onChange({placementReady:true});
       if(command==='help')setGuideOpen(v=>!v);
      }
      latest.current.interaction?.frame(state, result);
      live.state = state; live.result = result;
      if (result.transform) live.transform = result.transform;
      if (result.semanticEdit) {
        const edit=result.semanticEdit;
        if (edit.delta && pendingEdit?.delta && pendingEdit.objectId===edit.objectId && pendingEdit.index===edit.index)
          pendingEdit={...edit,delta:edit.delta.map((v,i)=>v+pendingEdit!.delta![i]) as [number,number,number]};
        else pendingEdit=edit;
      }
      recorder.current.capture(input, state, result);
      // The Three.js bridge reads the live transform every render. React only receives bounded commits/feedback.
      const commit = time - lastCommit >= 120 || state.primaryIntent === 'release';
      if (commit) {
        lastCommit = time;
        if (result.transform || state.primaryIntent === 'release') latest.current.onChange({ objectPosition: live.transform.position, objectRotation: live.transform.rotation, objectScale: live.transform.scale, placementReady: true });
        if (pendingEdit) { latest.current.onSemanticEdit?.(pendingEdit); pendingEdit=undefined; }
      }
      if (time - lastUI > 180) {
        lastUI = time; setRecognized(input.hands.length); setPoseLabel(state.hands.filter(h=>!h.missing).map(h=>h.pose??'tracking').join(' · ')); setFps(Math.round(1000 / Math.max(1, averageFrame))); if (debugRef.current) setSnapshot(state);
        setStatus(latest.current.drawing ? 'Drawing tool active. Choose Place or Rotate to resume hands.' : !input.hands.length ? 'Show your whole hand in good light.' : !objectId ? 'Add a graph or geometry object to interact.' :
          result.inspection ? `Inspecting (${result.inspection.position.map(v => v.toFixed(2)).join(', ')})` : state.targetLocked ? state.activeHandIds.length === 2 ? 'Holding with two hands — spread, turn, or move together.' : 'Holding — move or turn your wrist. Open fingers to release.' : state.phase === 'grab-ready' ? 'Ready to pick up. Keep your fist steady.' : 'Reach over the displayed object, pause, then close your fist. Point to inspect a graph.');
      }
    };
    worker.onerror = fail;
    worker.postMessage({ type: 'init', root: new URL(import.meta.env.BASE_URL + 'ar-hand-tracking/', location.origin).href });
    const loop = (time: number) => {
      if (!alive) return; raf = requestAnimationFrame(loop);
      const element = video.current;
      if (document.hidden) { clearTracking(); return; }
      if(time-last>750&&runtime.current?.landmarks?.length){clearTracking();setStatus('Tracking interrupted. Waiting for a fresh camera frame…');}
      if(busy&&time-last>3500){fail();return;}
      if (!ready || busy || time - last < 1000 / 30 - 1 || !element || element.readyState < 2 || !element.videoWidth || element.currentTime === lastVideo) return;
      busy = true; last = time; lastVideo = element.currentTime;
      const width=processingMs>35?320:480;
      void createImageBitmap(element, { resizeWidth: width, resizeHeight: Math.max(1, Math.round(width * element.videoHeight / element.videoWidth)) }).then(bitmap => {
        if (!alive) { bitmap.close(); return; } worker.postMessage({ type: 'frame', bitmap, time }, [bitmap]);
      }).catch(() => { busy = false; clearTracking(); });
    };
    raf = requestAnimationFrame(loop);
    return () => { alive = false; clearTimeout(timeout); cancelAnimationFrame(raf); worker.terminate(); clearTracking(); };
  }, [enabled, stream, video, stage, runtime, retry, mirrored]);
  return <div className="space-y-2 rounded-lg bg-slate-900 p-3 text-xs text-white">
    <p aria-live="polite">{poseLabel ? `Recognized gesture: ${poseLabel}` : "No recognized hand pose yet."}</p><div className="flex flex-wrap items-start gap-2">
      <button type="button" className="min-h-11 rounded border border-cyan-400 px-3 font-bold disabled:opacity-40" disabled={!stream} aria-pressed={enabled} onClick={() => setEnabled(v => !v)}>Hand gestures {enabled ? 'on' : 'off'}</button>
      <label className="flex min-h-11 items-center gap-2">Response <select aria-label="Hand intelligence profile" className="rounded border border-slate-500 bg-slate-950 p-2" value={profile} onChange={e => setProfile(e.target.value as IntelligenceProfile)}><option value="precision">Precision</option><option value="balanced">Balanced</option><option value="play">Play</option></select></label>
      {failed && <button type="button" className="min-h-11 rounded border px-3" onClick={() => setRetry(v => v + 1)}>Retry hand tracking</button>}
      <ARHandGuide forceOpen={guideOpen} />
      {import.meta.env.DEV && <button type="button" className="min-h-11 rounded border px-3" aria-expanded={debug} onClick={() => setDebug(v => !v)}>Developer hand tools</button>}
    </div>
    <p className="font-bold text-emerald-300" aria-live="polite">{enabled&&stream?`${recognized} ${recognized===1?'hand':'hands'} recognized — colored joints show live detection.`:'Hand tracking inactive.'}</p>
    <p role="status">{enabled && stream ? status : stream ? 'Hand tracking paused.' : 'Start the camera to detect hands automatically.'}</p>
    <p className="text-slate-300">Camera hands use screen-relative contact; tracked AR uses device world coordinates. Play changes response; it does not enable physics throwing.</p>
    {import.meta.env.DEV && debug && <HandIntelligenceDeveloperPanel recorder={recorder.current} state={snapshot} fps={fps} profile={profile} />}
  </div>;
}

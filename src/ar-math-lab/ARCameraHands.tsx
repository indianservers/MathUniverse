import {startModelLoad} from '../model-loading/modelLoadStore';
import { GestureController } from './hand-intelligence/GestureController';
import GestureHUD from './hand-intelligence/GestureHUD';
import { idleState } from './hand-intelligence/HandIntelligenceEngine';
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
  scene: ARSceneState; onChange: (delta: Partial<ARSceneState>) => void; objectId: string | null; objectName?: string;
  runtime: RefObject<CameraHandRuntime>; mirrored?: boolean; onSemanticEdit?: (edit: SemanticEdit) => void; drawing?: boolean; interaction?: { processHands?:(hands:import("./hand-intelligence/types").RawHand[],time:number)=>HandIntelligenceState; mapPoint?:(point:HandPoint)=>HandPoint; profile?: IntelligenceProfile; engines: { intelligence: HandIntelligenceEngine; spatial: SpatialHandEngine }; targets: () => ObjectAffordance[]; transform: (state: HandIntelligenceState) => CameraHandRuntime["transform"]; frame: (state: HandIntelligenceState, result: ManipulationResult) => void };
};
export default function ARCameraHands({ video, stage, stream, scene, onChange, objectId, runtime, onSemanticEdit, drawing, mirrored=false, interaction, objectName }: Props) {
  const controller=useRef(new GestureController());
  const [enabled, setEnabled] = useState(true), [status, setStatus] = useState('Starting hand tracking…');
  const [retry, setRetry] = useState(0), [failed, setFailed] = useState(false), [profile, setProfile] = useState<IntelligenceProfile>('balanced');
  const [recognized,setRecognized]=useState(0),[poseLabel,setPoseLabel]=useState('');
  const [debug, setDebug] = useState(false), [snapshot, setSnapshot] = useState<CameraHandRuntime['state']>(), [fps, setFps] = useState(0);
  const [intelligenceEngine] = useState(() => interaction?.engines.intelligence ?? new HandIntelligenceEngine());
  const [spatialEngine] = useState(() => interaction?.engines.spatial ?? new SpatialHandEngine());
  const engine = useRef(intelligenceEngine), spatial = useRef(spatialEngine), recorder = useRef(new HandIntelligenceRecorder());
  const latest = useRef({ scene, onChange, onSemanticEdit, drawing, objectId, interaction, objectName }); latest.current = { scene, onChange, onSemanticEdit, drawing, objectId, interaction, objectName };
  const debugRef = useRef(debug); debugRef.current = debug;
  useEffect(() => { (interaction?.engines.intelligence ?? engine.current).setProfile(interaction?.profile ?? profile); }, [profile, interaction?.profile]);
  useEffect(() => {
    const intelligence = interaction?.engines.intelligence ?? engine.current, solver = interaction?.engines.spatial ?? spatial.current;
    const clearTracking=()=>{controller.current.stop();latest.current.interaction?.processHands?.([],performance.now());if(runtime.current&&!latest.current.interaction?.processHands)runtime.current.gesture=controller.current.update([],performance.now());intelligence.reset();solver.reset();setRecognized(0);const live=runtime.current;if(live){live.state=undefined;live.result=undefined;live.landmarks=[];live.landmarksAt=undefined;}};
    clearTracking();setFailed(false);
    if (!enabled || !stream) return;
    if (typeof Worker === 'undefined' || typeof createImageBitmap === 'undefined' || typeof OffscreenCanvas === 'undefined') {
      setStatus('Hand tracking unavailable in this browser. Use touch controls.'); return;
    }
    let alive = true, ready = false, busy = false, raf = 0, last = 0, lastVideo = -1, lastUI = 0, lastFrame = 0, averageFrame = 33, processingMs=0;
    const worker = new Worker(new URL('./arHandTracking.worker.ts', import.meta.url), { type: 'module' });
    setStatus('Downloading on-device hand tracking…');
    const modelLoad=startModelLoad('Hand gestures / AR');
    const fail = () => {
      ready = false; busy = false; clearTracking(); setFailed(true);
      setStatus('Hand tracker could not start. Retry hand tracking or use touch controls.'); modelLoad.fail(new Error('Retry hand tracking or use touch controls.'));clearTimeout(timeout); worker.terminate();
    };
    let timeout = window.setTimeout(() => { if (!ready) fail(); }, 90000);
    const keepLoading=()=>{clearTimeout(timeout);timeout=window.setTimeout(()=>{if(!ready)fail();},90000);};
    worker.onmessage = event => {
      if (!alive) return;
      if(event.data.type==='progress'){keepLoading();modelLoad.progress(event.data.progress);setStatus(`Downloading ${event.data.progress.asset}${event.data.progress.percent!==undefined?` · ${event.data.progress.percent}% loaded`:''}…`);return;}
      if(event.data.type==='initializing'){keepLoading();modelLoad.initializing();setStatus('Download complete · initializing hand tracking…');return;}
      if (event.data.type === 'ready') { modelLoad.finish();ready = true; clearTimeout(timeout); setStatus('Show index finger to select. A fist stops all changes.'); }
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
          // Recognition uses uncropped camera landmarks; screen cropping must not change the pose.
          landmarks: points.map(p=>({...p,x:mirrored?1-p.x:p.x})),
          handedness: event.data.handedness[i]?.[0]?.categoryName ?? 'unknown', confidence: event.data.handedness[i]?.[0]?.score ?? .85,
        })),
      };
      live.landmarks=landmarks.map(points=>points.map(p=>{const mapped=SpatialProcessingLayer.coverPoint([p.x,p.y,p.z],videoAspect,viewAspect,mirrored);const point={x:mapped[0],y:mapped[1],z:mapped[2]};return latest.current.interaction?.mapPoint?.(point)??point;}));live.landmarksAt=performance.now();
      let state:HandIntelligenceState;
      if(latest.current.interaction?.processHands)state=latest.current.interaction.processHands(input.hands,time);
      else{
       const current=latest.current,id=current.objectId;
       controller.current.registry.sync(live.gestureObjects??(id?[{id,name:current.objectName??'Mathematical object',kind:'3d',capabilities:{move:true,scale:true,rotate:true,tilt:true,reset:true},
        read:()=>live.transform,write:transform=>{live.transform=transform;current.onChange({objectPosition:transform.position,objectRotation:transform.rotation,objectScale:transform.scale});},select:()=>undefined}]:[]));
       const features=intelligence.features.update(input.hands,time,true,profile);
       state={...idleState(time),hands:features};
       live.gesture=controller.current.update(current.drawing?[]:features,time);
      }
      live.state=state;live.result={transform:null};
      if(time-lastUI>180){lastUI=time;setRecognized(input.hands.length);setPoseLabel(live.gesture?.gesture??'Detecting…');setFps(Math.round(1000/Math.max(1,averageFrame)));if(debugRef.current)setSnapshot(state);setStatus(latest.current.drawing?'Drawing tool active. Choose Place or Rotate to resume gestures.':input.hands.length?'Keep one hand visible. Hold gestures steady.':'Show your whole hand in good light.');}

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
    return () => { alive = false; modelLoad.cancel(); clearTimeout(timeout); cancelAnimationFrame(raf); worker.terminate(); clearTracking(); };
  }, [enabled, stream, video, stage, runtime, retry, mirrored]);
  return <div className="space-y-2 rounded-lg bg-slate-900 p-3 text-xs text-white">
    {!interaction&&<GestureHUD runtime={runtime}/>}<p aria-live="polite">{poseLabel ? `Recognized gesture: ${poseLabel}` : "No recognized hand pose yet."}</p><div className="flex flex-wrap items-start gap-2">
      <button type="button" className="min-h-11 rounded border border-cyan-400 px-3 font-bold disabled:opacity-40" disabled={!stream} aria-pressed={enabled} onClick={() => setEnabled(v => !v)}>Hand gestures {enabled ? 'on' : 'off'}</button>
      <label className="flex min-h-11 items-center gap-2">Response <select aria-label="Hand intelligence profile" className="rounded border border-slate-500 bg-slate-950 p-2" value={profile} onChange={e => setProfile(e.target.value as IntelligenceProfile)}><option value="precision">Precision</option><option value="balanced">Balanced</option><option value="play">Play</option></select></label>
      {failed && <button type="button" className="min-h-11 rounded border px-3" onClick={() => setRetry(v => v + 1)}>Retry hand tracking</button>}
      <ARHandGuide />
      {import.meta.env.DEV && <button type="button" className="min-h-11 rounded border px-3" aria-expanded={debug} onClick={() => setDebug(v => !v)}>Developer hand tools</button>}
    </div>
    <p className="font-bold text-emerald-300" aria-live="polite">{enabled&&stream?`${recognized} ${recognized===1?'hand':'hands'} recognized — colored joints show live detection.`:'Hand tracking inactive.'}</p>
    <p role="status">{enabled && stream ? status : stream ? 'Hand tracking paused.' : 'Start the camera to detect hands automatically.'}</p>
    <p className="text-slate-300">Use one hand. Index selects, open palm enlarges, victory shrinks, and a fist stops.</p>
    {import.meta.env.DEV && debug && <HandIntelligenceDeveloperPanel recorder={recorder.current} state={snapshot} fps={fps} profile={profile} />}
  </div>;
}

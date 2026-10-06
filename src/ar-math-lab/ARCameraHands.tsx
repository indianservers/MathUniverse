import { useEffect, useRef, useState, type RefObject } from 'react';
import type { ARSceneState } from './types';
import ARHandGuide from './ARHandGuide';
import { HandIntelligenceEngine } from './hand-intelligence/HandIntelligenceEngine';
import { SpatialHandEngine } from './hand-intelligence/SpatialHandEngine';
import { SpatialProcessingLayer } from './hand-intelligence/SpatialProcessingLayer';
import { HandIntelligenceRecorder } from './hand-intelligence/HandIntelligenceRecorder';
import HandIntelligenceDeveloperPanel from './hand-intelligence/HandIntelligenceDeveloperPanel';
import type { CameraHandRuntime, IntelligenceFrameInput, IntelligenceProfile, SemanticEdit } from './hand-intelligence/types';
import type { HandPoint } from './arHandGestures';

type Props = {
  video: RefObject<HTMLVideoElement>; stage: RefObject<HTMLDivElement>; stream: MediaStream | null;
  scene: ARSceneState; onChange: (delta: Partial<ARSceneState>) => void; objectId: string | null;
  runtime: RefObject<CameraHandRuntime>; onSemanticEdit?: (edit: SemanticEdit) => void; drawing?: boolean;
};
export default function ARCameraHands({ video, stage, stream, scene, onChange, objectId, runtime, onSemanticEdit, drawing }: Props) {
  const [enabled, setEnabled] = useState(true), [status, setStatus] = useState('Starting hand tracking…');
  const [retry, setRetry] = useState(0), [failed, setFailed] = useState(false), [profile, setProfile] = useState<IntelligenceProfile>('balanced');
  const [debug, setDebug] = useState(false), [snapshot, setSnapshot] = useState<CameraHandRuntime['state']>(), [fps, setFps] = useState(0);
  const engine = useRef(new HandIntelligenceEngine()), spatial = useRef(new SpatialHandEngine()), recorder = useRef(new HandIntelligenceRecorder());
  const latest = useRef({ scene, onChange, onSemanticEdit, drawing }); latest.current = { scene, onChange, onSemanticEdit, drawing };
  const debugRef = useRef(debug); debugRef.current = debug;
  useEffect(() => { engine.current.setProfile(profile); }, [profile]);
  useEffect(() => {
    const intelligence = engine.current, solver = spatial.current;
    intelligence.reset(); solver.reset(); setFailed(false);
    if (!enabled || !stream) return;
    if (typeof Worker === 'undefined' || typeof createImageBitmap === 'undefined' || typeof OffscreenCanvas === 'undefined') {
      setStatus('Hand tracking unavailable in this browser. Use touch controls.'); return;
    }
    let pendingEdit: SemanticEdit | undefined;
    let alive = true, ready = false, busy = false, raf = 0, last = 0, lastVideo = -1, lastUI = 0, lastCommit = 0, lastFrame = 0, averageFrame = 33, processingMs=0;
    const worker = new Worker(new URL('./arHandTracking.worker.ts', import.meta.url), { type: 'module' });
    setStatus('Loading on-device hand tracking…');
    const fail = () => {
      ready = false; busy = false; engine.current.reset(); spatial.current.reset(); setFailed(true);
      setStatus('Hand tracker could not start. Retry hand tracking or use touch controls.'); clearTimeout(timeout); worker.terminate();
    };
    const timeout = window.setTimeout(() => { if (!ready) fail(); }, 30000);
    worker.onmessage = event => {
      if (!alive) return;
      if (event.data.type === 'ready') { ready = true; clearTimeout(timeout); setStatus('Reach toward the object, pause, then pinch to pick it up.'); }
      if (event.data.type === 'error') fail();
      if (event.data.type !== 'hands') return;
      busy = false;
      if (document.hidden) { engine.current.reset(); spatial.current.reset(); return; }
      const live = runtime.current, element = video.current, area = stage.current;
      if (!live || !element || !area) return;
      const time = event.data.timestamp as number;
      processingMs=processingMs*.8+(event.data.processingMs??0)*.2;
      if (lastFrame) averageFrame = averageFrame * .85 + (time - lastFrame) * .15;
      lastFrame = time;
      const videoAspect = element.videoWidth / Math.max(1, element.videoHeight), viewAspect = area.clientWidth / Math.max(1, area.clientHeight);
      const landmarks = event.data.landmarks as HandPoint[][];
      const input: IntelligenceFrameInput = {
        timestamp: time, camera: true, selectedObjectId: objectId ?? undefined, tool: latest.current.drawing ? 'draw' : 'auto',
        latencyMs: Math.min(150, performance.now() - time + 16), targets: live.targets,
        hands: landmarks.map((points, i) => ({
          landmarks: points.map(p => { const mapped = SpatialProcessingLayer.coverPoint([p.x, p.y, p.z], videoAspect, viewAspect); return { x: mapped[0], y: mapped[1], z: mapped[2] }; }),
          handedness: event.data.handedness[i]?.[0]?.categoryName ?? 'unknown', confidence: event.data.handedness[i]?.[0]?.score ?? .85,
        })),
      };
      const state = engine.current.update(input), result = spatial.current.solve(state, live.transform, true, engine.current.profile);
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
        lastUI = time; setFps(Math.round(1000 / Math.max(1, averageFrame))); if (debugRef.current) setSnapshot(state);
        setStatus(latest.current.drawing ? 'Drawing tool active. Choose Place or Rotate to resume hands.' : !input.hands.length ? 'Show your whole hand in good light.' : !objectId ? 'Add a graph or geometry object to interact.' :
          result.inspection ? `Inspecting (${result.inspection.position.map(v => v.toFixed(2)).join(', ')})` : state.targetLocked ? state.activeHandIds.length === 2 ? 'Holding with two hands — spread, turn, or move together.' : 'Holding — move or turn your wrist. Open fingers to release.' : state.phase === 'grab-ready' ? 'Ready to pick up. Keep your pinch steady.' : 'Reach over the displayed object, pause, then pinch. Point to inspect a graph.');
      }
    };
    worker.onerror = fail;
    worker.postMessage({ type: 'init', root: new URL(import.meta.env.BASE_URL + 'ar-hand-tracking/', location.origin).href });
    const loop = (time: number) => {
      if (!alive) return; raf = requestAnimationFrame(loop);
      const element = video.current;
      if (document.hidden) { engine.current.reset(); spatial.current.reset(); return; }
      if (!ready || busy || time - last < 1000 / 30 - 1 || !element || element.readyState < 2 || !element.videoWidth || element.currentTime === lastVideo) return;
      busy = true; last = time; lastVideo = element.currentTime;
      const width=processingMs>35?320:480;
      void createImageBitmap(element, { resizeWidth: width, resizeHeight: Math.max(1, Math.round(width * element.videoHeight / element.videoWidth)) }).then(bitmap => {
        if (!alive) { bitmap.close(); return; } worker.postMessage({ type: 'frame', bitmap, time }, [bitmap]);
      }).catch(() => { busy = false; engine.current.reset(); spatial.current.reset(); });
    };
    raf = requestAnimationFrame(loop);
    return () => { alive = false; clearTimeout(timeout); cancelAnimationFrame(raf); worker.terminate(); intelligence.reset(); solver.reset(); };
  }, [enabled, stream, objectId, video, stage, runtime, retry]);
  return <div className="space-y-2 rounded-lg bg-slate-900 p-3 text-xs text-white">
    <div className="flex flex-wrap items-start gap-2">
      <button type="button" className="min-h-11 rounded border border-cyan-400 px-3 font-bold disabled:opacity-40" disabled={!stream} aria-pressed={enabled} onClick={() => setEnabled(v => !v)}>Hand gestures {enabled ? 'on' : 'off'}</button>
      <label className="flex min-h-11 items-center gap-2">Response <select aria-label="Hand intelligence profile" className="rounded border border-slate-500 bg-slate-950 p-2" value={profile} onChange={e => setProfile(e.target.value as IntelligenceProfile)}><option value="precision">Precision</option><option value="balanced">Balanced</option><option value="play">Play</option></select></label>
      {failed && <button type="button" className="min-h-11 rounded border px-3" onClick={() => setRetry(v => v + 1)}>Retry hand tracking</button>}
      <ARHandGuide />
      {import.meta.env.DEV && <button type="button" className="min-h-11 rounded border px-3" aria-expanded={debug} onClick={() => setDebug(v => !v)}>Developer hand tools</button>}
    </div>
    <p role="status">{enabled && stream ? status : stream ? 'Hand tracking paused.' : 'Start the camera to detect hands automatically.'}</p>
    <p className="text-slate-300">Camera hands use screen-relative contact; tracked AR uses device world coordinates. Play changes response; it does not enable physics throwing.</p>
    {import.meta.env.DEV && debug && <HandIntelligenceDeveloperPanel recorder={recorder.current} state={snapshot} fps={fps} profile={profile} />}
  </div>;
}

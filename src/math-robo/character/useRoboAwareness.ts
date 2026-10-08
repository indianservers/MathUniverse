import { useEffect, useRef, useState, type RefObject } from 'react';
import type { IntelligenceMode } from '../../offline-intelligence/commands';
import { subscribeRoboScene } from '../../offline-intelligence/workspaceBridge';
import { roboEvents } from './engine';
import { sampleAwareness, type AwarenessSnapshot } from './spatialAwareness';

export function useRoboAwareness(launcher: RefObject<HTMLButtonElement>, mode: IntelligenceMode, route: string, moving: boolean, getMovement:()=>AwarenessSnapshot['movement']) {
  const [snapshot, setSnapshot] = useState<AwarenessSnapshot>();
  const current = useRef<AwarenessSnapshot>();
  const motion=useRef(getMovement);motion.current=getMovement;
  const sample = () => {
    if (!launcher.current) return;
    try { const next = sampleAwareness(launcher.current, mode, route);next.movement=motion.current(); current.current = next; setSnapshot(next); return next; }
    catch (error) { roboEvents.report(error); }
  };
  const sampleRef = useRef(sample); sampleRef.current = sample;
  useEffect(() => {
    let frame = 0;
    const schedule = () => { if (!frame) frame = requestAnimationFrame(() => { frame = 0; sampleRef.current(); }); };
    const timer = setInterval(() => { if (!document.hidden) sampleRef.current(); }, moving ? 250 : 1000);
    const off = subscribeRoboScene(changed => { if (changed === mode) schedule(); });
    window.addEventListener('scroll', schedule, true); window.addEventListener('resize', schedule);
    schedule();
    return () => { clearInterval(timer); cancelAnimationFrame(frame); off(); window.removeEventListener('scroll', schedule, true); window.removeEventListener('resize', schedule); };
  }, [launcher, mode, route, moving]);
  return { snapshot, refresh: sample, get: () => current.current };
}

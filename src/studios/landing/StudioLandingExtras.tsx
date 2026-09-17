import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  firstHourReady,
  makeClassPin,
  readClassPin,
  writeClassPin,
} from "./studioLandingSession";
import "./studioLanding.css";

export function ClassPinPanel({ onPush }: { onPush?: (route: string) => void }) {
  const [pin, setPin] = useState(readClassPin);
  return (
    <section className="sl-pin" aria-label="Local class pin">
      <h3>Local class pin</h3>
      <p>No account. Share this session pin so a class can open the same lab.</p>
      <p><strong>{pin || "—"}</strong></p>
      <div className="sl-chips">
        <button type="button" className="sl-chip" onClick={() => setPin(makeClassPin())}>New pin</button>
        <button type="button" className="sl-chip" onClick={() => { const next = window.prompt("Enter class pin", pin) ?? pin; setPin(writeClassPin(next.trim().toUpperCase())); }}>Join pin</button>
        {onPush ? <button type="button" className="sl-chip" onClick={() => onPush("/geometry/construction")}>Push Construction</button> : null}
      </div>
    </section>
  );
}

export function FirstHourNote({ completed, lastOpenedAt, lockedLabel, unlockHint }: {
  completed: string[];
  lastOpenedAt: number;
  lockedLabel: string;
  unlockHint: string;
}) {
  if (firstHourReady(completed, lastOpenedAt)) return null;
  return (
    <p className="sl-banner" role="status">{lockedLabel} waits until you open {unlockHint}.</p>
  );
}

export function GeometryWeekStrip() {
  return (
    <section className="sl-week" aria-label="This week">
      <div>
        <h3>This week</h3>
        <p>Board-aligned: one lab, one lesson.</p>
      </div>
      <div className="sl-chips">
        <Link className="sl-mini-link" to="/geometry/triangles">Triangles lab</Link>
        <Link className="sl-mini-link" to="/lessons">Open a geometry lesson</Link>
      </div>
    </section>
  );
}

export function DiscreteAlsoIn() {
  return (
    <section className="sl-also" aria-label="Also in this studio">
      <Link to="/discrete-world/sets">Sets & Relations · also a dedicated Set Theory studio</Link>
      <Link to="/set-theory">Open Set Theory Studio</Link>
      <Link to="/discrete-world/graphs">Graph Networks · also Graph Theory Studio</Link>
      <Link to="/graph-theory">Open Graph Theory Studio</Link>
    </section>
  );
}

export function ModellingDatasetsMeta({ title, n, units, kind }: { title: string; n: number; units: string; kind: "measured" | "fictional" }) {
  return (
    <small className="sl-kicker">{title}: n={n} · {units} · {kind}</small>
  );
}

export function ObserveStrip({ items }: { items: Array<{ title: string; text: string }> }) {
  return (
    <section className="as-home-loop" aria-label="Learning loop">
      {items.map((item) => (
        <span key={item.title}><b>{item.title}</b><small>{item.text}</small></span>
      ))}
    </section>
  );
}

export function useLocalSearch<T>(items: T[], query: string, haystack: (item: T) => string) {
  return useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) => haystack(item).toLowerCase().includes(needle));
  }, [items, query, haystack]);
}

export function CameraGate({ allowed, children, fallback }: { allowed: boolean; children: ReactNode; fallback: ReactNode }) {
  if (!allowed) return <>{fallback}</>;
  return <>{children}</>;
}

export function useCameraAllowed() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    if (!navigator.mediaDevices?.getUserMedia) return;
    navigator.permissions?.query?.({ name: "camera" as PermissionName }).then((status) => {
      setOk(status.state === "granted");
    }).catch(() => setOk(false));
  }, []);
  return ok;
}

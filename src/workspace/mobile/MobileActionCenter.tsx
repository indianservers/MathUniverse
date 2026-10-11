import { useEffect, useRef, useState, type ReactNode } from "react";
import { Eye, EyeOff, Lock, Unlock, List, HelpCircle, Undo2, Redo2, X } from "lucide-react";
import WorkspaceBottomSheet from "./WorkspaceBottomSheet";
import type { WorkspaceOverlayApi } from "./useWorkspaceOverlay";

export type MobileObject = {
  id: string; name: string; kind: string; selected?: boolean; visible: boolean; locked?: boolean;
  select: () => void; visibility?: () => void; lock?: () => void; remove: () => void;
};
export type MobileNotice = { message: string; undo?: () => void } | null;
export function useMobileActions(enabled: boolean, undo: () => void) {
  const undoRef=useRef(undo);undoRef.current=undo;
  const [notice, setNotice] = useState<MobileNotice>(null);
  const [confirmation, setConfirmation] = useState<{ count: number; run: () => void } | null>(null);
  useEffect(() => { if (!notice) return; const timer = window.setTimeout(() => setNotice(null), 8000); return () => clearTimeout(timer); }, [notice]);
  return {
    notice, confirmation, dismiss: () => setNotice(null), cancelClear: () => setConfirmation(null),
    deleted: (run: () => void, message = "Object deleted") => { run(); if (enabled) setNotice({ message, undo:()=>undoRef.current() }); },
    clear: (count: number, run: () => void) => { if (enabled) setConfirmation({ count, run }); else run(); },
    confirmClear: () => { confirmation?.run(); setConfirmation(null); setNotice({ message: "Workspace cleared", undo:()=>undoRef.current() }); },
  };
}

export default function MobileActionCenter({ overlay, objects, undo, redo, canUndo = true, canRedo = true, cancel, instructions, edit, view, add, onClear, actions, onBulkSelect, removeMany }: {
  overlay: WorkspaceOverlayApi; objects: MobileObject[]; undo: () => void; redo: () => void;
  canUndo?: boolean; canRedo?: boolean; cancel: () => void; instructions: string;
  edit?: ReactNode; view?: ReactNode; add?: ReactNode; onClear: () => void;
  actions: ReturnType<typeof useMobileActions>; onBulkSelect?: (ids: string[]) => void; removeMany?: (ids: string[]) => void;
}) {
  const [tab, setTab] = useState("Objects");
  const [search, setSearch] = useState("");
  const [marked, setMarked] = useState<string[]>([]);
  const [tip, setTip] = useState("");
  const previousInstruction = useRef(instructions);
  useEffect(() => {
    if (previousInstruction.current === instructions) return;
    previousInstruction.current = instructions; setTip(instructions);
    const timer = setTimeout(() => setTip(""), 5000); return () => clearTimeout(timer);
  }, [instructions]);
  useEffect(() => {
    if (!overlay.isMobile) return;
    const selected = (event: Event) => { const ids = (event as CustomEvent<string[]>).detail; setMarked(ids); setTab("Objects"); };
    window.addEventListener('mws-rectangle-selection', selected);
    return () => window.removeEventListener('mws-rectangle-selection', selected);
  }, [overlay.isMobile]);
  const selectedKey=objects.filter(o=>o.selected).map(o=>o.id).join("|");
  const lastSelected=useRef(selectedKey);
  useEffect(()=>{if(lastSelected.current!==selectedKey && overlay.isOpen("mobile-actions")){setTab("Edit");}lastSelected.current=selectedKey;},[selectedKey,overlay]);
  useEffect(()=>{if(!overlay.isMobile)return;const unavailable=(event:Event)=>{setTip((event as CustomEvent<string>).detail);};window.addEventListener("mws-unavailable",unavailable);return()=>window.removeEventListener("mws-unavailable",unavailable);},[overlay.isMobile]);
  useEffect(()=>{if(!overlay.isMobile)return;const edit=()=>setTab("Edit");window.addEventListener("mws-show-edit",edit);return()=>window.removeEventListener("mws-show-edit",edit);},[overlay.isMobile]);
  if (!overlay.isMobile) return null;
  const filtered = objects.filter(o => `${o.name} ${o.kind}`.toLowerCase().includes(search.toLowerCase()));
  const chosen = objects.filter(o => marked.includes(o.id));
  const mark = (id: string) => { const next = marked.includes(id) ? marked.filter(x => x !== id) : [...marked, id]; setMarked(next); onBulkSelect?.(next); };
  return <>
    <div className="mws-quick-actions" data-mws-toolbar="true">
      <button type="button" onClick={() => { setTab("Objects"); overlay.toggle("mobile-actions"); }} aria-label="Mobile controls"><List /><span>Objects & tools</span></button>
      <button type="button" aria-label="Undo mobile change" disabled={!canUndo} onClick={undo}><Undo2 /></button>
      <button type="button" aria-label="Redo mobile change" disabled={!canRedo} onClick={redo}><Redo2 /></button>
    </div>
    {tip && <div className="mws-tool-tip" data-mws-panel="tip" role="status">{tip}<button type="button" aria-label="Dismiss tool tip" onClick={() => setTip("")}><X /></button></div>}
    <WorkspaceBottomSheet open={overlay.isOpen("mobile-actions")} title="Mobile controls" onClose={overlay.close}>
      <nav className="mws-action-tabs" aria-label="Mobile control sections">{["Objects", "Add", "Edit", "View", "Help"].map(name => <button key={name} type="button" aria-pressed={tab === name} onClick={() => setTab(name)}>{name}</button>)}</nav>
      {tab === "Objects" && <section className="mws-object-browser">
        <label>Search objects<input type="search" value={search} onChange={e => setSearch(e.target.value)} placeholder="Name or object type" /></label>
        <p>{objects.length} objects · {chosen.length} marked</p>
        <div className="mws-action-grid">
          <button type="button" onClick={() => { const ids = filtered.map(o => o.id); setMarked(ids); onBulkSelect?.(ids); }}>Mark all results</button>
          <button type="button" disabled={!chosen.length} onClick={() => { setMarked([]); onBulkSelect?.([]); }}>Unmark all</button>
          <button type="button" disabled={!chosen.length} onClick={() => chosen.filter(o => !o.visible).forEach(o => o.visibility?.())}>Show marked</button>
          <button type="button" disabled={!chosen.length} onClick={() => chosen.filter(o => o.visible).forEach(o => o.visibility?.())}>Hide marked</button>
          <button type="button" disabled={!chosen.length} onClick={() => actions.deleted(() => { if(removeMany)removeMany(chosen.map(o=>o.id));else chosen.forEach(o => o.remove()); setMarked([]); }, `${chosen.length} objects deleted`)}>Delete marked</button>
          <button type="button" disabled={!objects.length} onClick={onClear}>Clear all ({objects.length})</button>
        </div>
        {!filtered.length && <p>No matching objects.</p>}
        {filtered.map(o => <div className="mws-object-row" key={o.id}>
          <input type="checkbox" aria-label={`Mark ${o.name}`} checked={marked.includes(o.id)} onChange={() => mark(o.id)} />
          <button type="button" aria-pressed={!!o.selected} onClick={() => { o.select(); setTab("Edit"); }}><strong>{o.name}</strong><small>{o.kind}</small></button>
          <button type="button" aria-label={`${o.visible ? "Hide" : "Show"} ${o.name}`} disabled={!o.visibility} onClick={o.visibility}>{o.visible ? <Eye /> : <EyeOff />}</button>
          <button type="button" aria-label={`${o.locked ? "Unlock" : "Lock"} ${o.name}`} disabled={!o.lock} onClick={o.lock}>{o.locked ? <Lock /> : <Unlock />}</button>
        </div>)}
        <p>Overlapping objects? Choose the exact object from this list.</p>
      </section>}
      {tab === "Add" && <section className="mws-action-content">{add ?? <p>Use the Add or construction button on the bottom toolbar.</p>}</section>}
      {tab === "Edit" && <section className="mws-action-content">{edit ?? <p>Select an object to edit its properties.</p>}</section>}
      {tab === "View" && <section className="mws-action-content">{view}</section>}
      {tab === "Help" && <section className="mws-action-content"><HelpCircle /><p>{instructions}</p><p>Tap to select. Pinch with two fingers to zoom. Use Pan to move the canvas. In 3D, Orbit rotates the camera; Move edits the selected object.</p><p>Use Objects to select crowded or hidden objects. Mark multiple rows to operate on a group. Drag the panel handle up to expand it or down to make it compact.</p><button type="button" onClick={() => { cancel(); overlay.close(); }}>Cancel current construction</button></section>}
    </WorkspaceBottomSheet>
    {actions.notice && <div className="mws-notice" data-mws-panel="notification" role="status"><span>{actions.notice.message}</span>{actions.notice.undo && <button type="button" onClick={() => { actions.notice?.undo?.(); actions.dismiss(); }}>Undo deletion</button>}<button type="button" aria-label="Dismiss notification" onClick={actions.dismiss}><X /></button></div>}
    <WorkspaceBottomSheet open={!!actions.confirmation} title="Clear workspace?" onClose={actions.cancelClear}><p>Remove all {actions.confirmation?.count} objects, including default objects?</p><button type="button" onClick={actions.confirmClear}>Clear all objects</button><button type="button" onClick={actions.cancelClear}>Keep objects</button></WorkspaceBottomSheet>
  </>;
}

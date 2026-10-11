import { useState, type PointerEvent } from "react";

export type SelectionRect = { left: number; top: number; right: number; bottom: number };
export default function MobileRectangleSelection({ onSelect, onCancel }: { onSelect: (rect: SelectionRect) => void; onCancel: () => void }) {
  const [drag, setDrag] = useState<{ id: number; x: number; y: number; endX: number; endY: number } | null>(null);
  const point = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)), y: Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height)) };
  };
  return <div className="mws-rectangle-layer" aria-label="Rectangle selection canvas" onPointerDown={event => {
    event.preventDefault(); event.stopPropagation();
    if (drag) return;
    const p = point(event); event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ id: event.pointerId, ...p, endX: p.x, endY: p.y });
  }} onPointerMove={event => {
    if (!drag || drag.id !== event.pointerId) return;
    const p = point(event); setDrag({ ...drag, endX: p.x, endY: p.y });
  }} onPointerUp={event => {
    if (!drag || drag.id !== event.pointerId) return;
    const p = point(event);
    onSelect({ left: Math.min(drag.x, p.x), right: Math.max(drag.x, p.x), top: Math.min(drag.y, p.y), bottom: Math.max(drag.y, p.y) }); setDrag(null);
  }} onPointerCancel={() => { setDrag(null); onCancel(); }}>
    <div className="mws-selection-hint">Drag a rectangle to select. <button type="button" onPointerDown={e => e.stopPropagation()} onClick={onCancel}>Cancel</button></div>
    {drag && <div className="mws-selection-box" style={{ left: `${Math.min(drag.x, drag.endX) * 100}%`, top: `${Math.min(drag.y, drag.endY) * 100}%`, width: `${Math.abs(drag.x - drag.endX) * 100}%`, height: `${Math.abs(drag.y - drag.endY) * 100}%` }} />}
  </div>;
}

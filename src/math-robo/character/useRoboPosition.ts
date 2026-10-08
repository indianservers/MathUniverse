import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { roboEvents } from './engine';
const clamp = (p: {
    x: number;
    y: number;
}) => ({ x: Math.max(8, Math.min(innerWidth - 84, p.x)), y: Math.max(8, Math.min(innerHeight - 96, p.y)) });
export function useRoboPosition() {
    const [position, setPosition] = useState<{
        x: number;
        y: number;
    } | undefined>(() => { try {
        const p = JSON.parse(localStorage.getItem('math-robo-position') ?? 'null');
        return p && Number.isFinite(p.x) && Number.isFinite(p.y) ? clamp(p) : undefined;
    }
    catch {
        return;
    } });
    const drag = useRef<{
        id: number;
        x: number;
        y: number;
        left: number;
        top: number;
    } | undefined>();
    const moved = useRef(false);
    useEffect(() => { const resize = () => setPosition(p => p ? clamp(p) : p); window.addEventListener('resize', resize); return () => window.removeEventListener('resize', resize); }, []);
    const finish = (e: PointerEvent<HTMLButtonElement>) => { if (!drag.current)
        return; drag.current = undefined; if (e.currentTarget.hasPointerCapture(e.pointerId))
        e.currentTarget.releasePointerCapture(e.pointerId); if (moved.current) {
        roboEvents.emit({ type: 'activity' });
        try {
            localStorage.setItem('math-robo-position', JSON.stringify(position));
        }
        catch { /* Persistence optional. */ }
    } };
    return { panelStyle: position ? { position: 'fixed', left: Math.max(12, Math.min(innerWidth - 432, position.x)), top: Math.max(12, Math.min(innerHeight - 420, position.y + 100)), bottom: 'auto', right: 'auto', maxHeight: 'min(400px, calc(100dvh - 24px))' } as CSSProperties : undefined, style: position ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' } as CSSProperties : undefined, wasDragged: () => { const value = moved.current; moved.current = false; return value; }, handlers: { onPointerDown: (e: PointerEvent<HTMLButtonElement>) => { if (e.button !== 0)
                return; const rect = e.currentTarget.getBoundingClientRect(); drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, left: rect.left, top: rect.top }; moved.current = false; e.currentTarget.setPointerCapture(e.pointerId); }, onPointerMove: (e: PointerEvent<HTMLButtonElement>) => { const d = drag.current; if (!d || d.id !== e.pointerId)
                return; if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 5)
                moved.current = true; if (moved.current)
                setPosition(clamp({ x: d.left + e.clientX - d.x, y: d.top + e.clientY - d.y })); }, onPointerUp: finish, onPointerCancel: finish } };
}

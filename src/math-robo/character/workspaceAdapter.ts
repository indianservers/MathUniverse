import type { RoboResult } from '../intelligence/types';
import type { IntelligenceMode, VisualCommand } from '../../offline-intelligence/commands';
import { outlineVertices } from '../../offline-intelligence/languageEngine';
import { roboEvents, type Target } from './engine';
type Projector = (point: number[]) => Target | undefined;
const projectors = new Map<IntelligenceMode, Projector[]>();
export function registerRoboProjector(mode: IntelligenceMode, project: Projector) { const entries = projectors.get(mode) ?? []; entries.push(project); projectors.set(mode, entries); return () => { const remaining = projectors.get(mode)?.filter(p => p !== project) ?? []; if (remaining.length)
    projectors.set(mode, remaining);
else
    projectors.delete(mode); }; }
export function projectRoboPoint(mode: IntelligenceMode, point: number[]) { try{const target = projectors.get(mode)?.at(-1)?.(point); return target && Number.isFinite(target.x) && Number.isFinite(target.y) ? target : undefined;}catch(error){roboEvents.report(error);return;} }
export function svgClientPoint(svg: SVGSVGElement | null, point: Target): Target | undefined { const matrix = svg?.getScreenCTM(); if (!matrix)
    return; const p = new DOMPoint(point.x, point.y).matrixTransform(matrix); const r = svg!.getBoundingClientRect(); if (p.x < r.left || p.x > r.right || p.y < r.top || p.y > r.bottom)
    return; return { x: p.x, y: p.y }; }
export function animateRoboCommand(mode: IntelligenceMode, command: VisualCommand) {
    try {
    const points=command.kind==='line'?outlineVertices(command):command.dimension==='2d'&&command.kind==='circle'?outlineVertices(command):[command.points[0]??[0,0,0]];
    const target=(progress=0)=>{const index=progress*(points.length-1),a=points[Math.floor(index)],b=points[Math.min(points.length-1,Math.floor(index)+1)],ratio=index-Math.floor(index);return projectRoboPoint(mode,a.map((v,i)=>v+((b[i]??v)-v)*ratio));};
    roboEvents.emit({type:'workspace',kind:command.kind,target});
    }catch(error){roboEvents.report(error);}
}
export function animateRoboResult(mode: IntelligenceMode, result: RoboResult) {
    if (result.status !== 'success')
        return;
    const query = result.plan.commands.find(c => ['MIDPOINT', 'CENTER', 'CENTROID', 'INTERSECTION', 'Y_INTERCEPT'].includes(c.subAction));
    if (query && Array.isArray(result.value)) {
        const values = Array.isArray(result.value[0]) ? result.value as number[][] : [result.value as number[]];
        const points = values.filter(p => p.length >= 2 && p.every(v => typeof v === 'number' && Number.isFinite(v)));
        const point = points[0];
        if (point)
            roboEvents.emit({ type: 'workspace', kind: 'point', target: () => projectRoboPoint(mode, point) });
    }
    const transform = result.plan.commands.find(c => ['ROTATE', 'MOVE', 'TRANSLATE', 'SCALE'].includes(c.action));
    if (transform)
        roboEvents.emit({ type: 'workspace', kind: transform.action.toLowerCase() });
}

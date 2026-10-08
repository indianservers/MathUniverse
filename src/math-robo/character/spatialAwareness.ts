import type { IntelligenceMode } from '../../offline-intelligence/commands';
import { readRoboScene } from '../../offline-intelligence/workspaceBridge';
import { outlineVertices } from '../../offline-intelligence/languageEngine';
import { projectRoboPoint } from './workspaceAdapter';
import type { Target } from './engine';

export type SpatialSample = { screen: Target; world?: number[] };
export type SpatialObject = {
  id: string; label: string; kind: string; samples: Array<SpatialSample | undefined>;
  closed?: boolean; filled?: boolean; hit?: boolean; boundsOnly?: boolean; selected?: boolean;
};
export type NearbyObject = {
  id: string; label: string; kind: string; screenDistancePx: number; graphDistance?: number;
  closest: Target; onObject: boolean; approximate: boolean; selected: boolean;
};
export type UIElement = { kind: string; label: string; distancePx: number; target: Target; element: Element };
export type AwarenessSnapshot = {
  route: string; mode: IntelligenceMode; anchor: Target; graphPosition?: number[];
  movement?:{action:string;destination:Target};
  currentElement?: Omit<UIElement, 'element'>; nearbyElements: Array<Omit<UIElement, 'element'>>;
  onObject?: NearbyObject; nearbyObjects: NearbyObject[]; sampledAt: number;
};
type SpatialProvider = (anchor: Target) => SpatialObject[];
type Unprojector = (point: Target) => number[] | undefined;
const providers = new Map<IntelligenceMode, SpatialProvider[]>();
const inverses = new Map<IntelligenceMode, Unprojector[]>();
function register<T>(map: Map<IntelligenceMode, T[]>, mode: IntelligenceMode, value: T) {
  const list = map.get(mode) ?? []; list.push(value); map.set(mode, list);
  return () => { const next = map.get(mode)?.filter(v => v !== value) ?? []; if (next.length) map.set(mode, next); else map.delete(mode); };
}
export const registerRoboSpatialProvider = (mode: IntelligenceMode, provider: SpatialProvider) => register(providers, mode, provider);
export const registerRoboUnprojector = (mode: IntelligenceMode, inverse: Unprojector) => register(inverses, mode, inverse);

export function readSVGSpatialObjects(svg: SVGSVGElement | null, anchor: Target, metadata: (id: string, kind: string) => { label?: string; selected?: boolean }): SpatialObject[] {
  const boardMatrix = svg?.getScreenCTM(); if (!svg || !boardMatrix) return [];
  const inverse = boardMatrix.inverse(), rect = svg.getBoundingClientRect();
  const topHit = document.elementsFromPoint(anchor.x, anchor.y).filter(e => !e.closest(excluded)).map(e => e.closest('[data-object-id],[data-point-id]')).find(Boolean);
  const hitId = topHit?.getAttribute('data-object-id') ?? topHit?.getAttribute('data-point-id');
  return [...svg.querySelectorAll<SVGGeometryElement>('[data-object-id],[data-point-id]')].flatMap(element => {
    const rawId = element.getAttribute('data-object-id') ?? element.getAttribute('data-point-id')!, kind = element.getAttribute('data-object-type') ?? 'point';
    const matrix = element.getScreenCTM(); if (!matrix || getComputedStyle(element).opacity === '0') return [];
    const info = metadata(rawId, kind), count = kind === 'point' ? 1 : 65;
    const length = kind === 'point' ? 0 : element.getTotalLength();
    const samples = Array.from({ length: count }, (_, i) => {
      const p = kind === 'point' ? new DOMPoint(Number(element.getAttribute('cx')), Number(element.getAttribute('cy'))) : element.getPointAtLength(length * i / (count - 1));
      const screen = new DOMPoint(p.x, p.y).matrixTransform(matrix);
      if (screen.x < rect.left || screen.x > rect.right || screen.y < rect.top || screen.y > rect.bottom) return;
      const board = screen.matrixTransform(inverse);
      return { screen: { x: screen.x, y: screen.y }, world: [(board.x - 320) / 40, (210 - board.y) / 40] };
    });
    const closed = ['circle','polygon','ellipse'].includes(kind);
    return [{ id: rawId.replace(/-shape$/, ''), label: info.label ?? rawId, kind, samples, closed,
      filled: closed && getComputedStyle(element).fill !== 'none', selected: info.selected, hit: rawId === hitId }];
  }).sort((a, b) => Number(b.hit) - Number(a.hit));
}

export function nearestOnSegment(p: Target, a: Target, b: Target) {
  const dx = b.x - a.x, dy = b.y - a.y, length = dx * dx + dy * dy;
  const t = length ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / length)) : 0;
  const point = { x: a.x + t * dx, y: a.y + t * dy };
  return { point, t, distance: Math.hypot(p.x - point.x, p.y - point.y) };
}
export function insidePolygon(p: Target, polygon: Target[]) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[i], b = polygon[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
export function objectProximity(anchor: Target, object: SpatialObject, graphPosition?: number[]): NearbyObject | undefined {
  let distance = Infinity, closest = anchor, graphDistance = Infinity;
  const samples = object.samples;
  for (let i = 0; i < samples.length; i++) {
    const a = samples[i]; if (!a) continue;
    const b = samples[i + 1] ?? (object.closed && i === samples.length - 1 ? samples[0] : undefined);
    const candidate = nearestOnSegment(anchor, a.screen, b?.screen ?? a.screen);
    if (candidate.distance < distance) { distance = candidate.distance; closest = candidate.point; }
    if (graphPosition && a.world) {
      const world = nearestOnSegment({ x: graphPosition[0], y: graphPosition[1] }, { x: a.world[0], y: a.world[1] }, { x: b?.world?.[0] ?? a.world[0], y: b?.world?.[1] ?? a.world[1] });
      graphDistance = Math.min(graphDistance, world.distance);
    }
  }
  if (!Number.isFinite(distance)) return;
  const enclosed = object.filled && object.closed && samples.every(Boolean) && insidePolygon(anchor, samples.map(s => s!.screen));
  const onObject = !!object.hit || (!object.boundsOnly && (enclosed || distance <= 10));
  if (enclosed || object.hit) { distance = 0; closest = anchor; if (enclosed) graphDistance = 0; }
  return { id: object.id, label: object.label, kind: object.kind, screenDistancePx: distance,
    graphDistance: Number.isFinite(graphDistance) ? graphDistance : undefined, closest, onObject,
    approximate: !!object.boundsOnly || samples.length > 2, selected: !!object.selected };
}

const excluded = '.offline-assistant,.robo-test-lab,.robo-target-marker,[data-robo-ignore]';
const semantic = 'button,[role="button"],[role="tab"],h1,h2,h3,h4,h5,h6,[role="heading"],a[href],label,input,textarea,select,canvas,svg,p,[role="img"]';
const compact = (text: string) => text.replace(/\s+/g, ' ').trim().slice(0, 100);
export function describeUI(element: Element, anchor: Target): UIElement | undefined {
  if (element.closest(excluded) || element.closest('[hidden],[aria-hidden="true"]')) return;
  const rect = element.getBoundingClientRect(), style = getComputedStyle(element);
  if (!rect.width || !rect.height || style.visibility === 'hidden' || style.display === 'none' || rect.bottom < 0 || rect.top > innerHeight || rect.right < 0 || rect.left > innerWidth) return;
  const role = element.getAttribute('role'), tag = element.tagName.toLowerCase();
  const kind = role === 'tab' || element.hasAttribute('aria-selected') && tag === 'button' ? 'tab' : role === 'heading' || /^h[1-6]$/.test(tag) ? 'heading' : role === 'button' || tag === 'button' ? 'button' : ['canvas', 'svg'].includes(tag) ? 'graph' : tag === 'a' ? 'link' : ['input','textarea','select'].includes(tag) ? 'field' : 'text';
  const labelledBy=element.getAttribute('aria-labelledby')?.split(/\s+/).map(id=>document.getElementById(id)?.textContent??'').join(' ').trim();
  const label = compact(element.getAttribute('aria-label') ?? (labelledBy||undefined) ?? element.getAttribute('title') ?? (kind === 'graph' ? element.closest('[aria-label]')?.getAttribute('aria-label') ?? 'mathematical workspace' : element.textContent ?? ''));
  if (!label && kind !== 'field') return;
  const dx = Math.max(rect.left - anchor.x, 0, anchor.x - rect.right), dy = Math.max(rect.top - anchor.y, 0, anchor.y - rect.bottom);
  return { kind, label: label || 'input field', distancePx: Math.hypot(dx, dy), target: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }, element };
}
export function visibleUI(anchor: Target): UIElement[] {
  return [...document.querySelectorAll(semantic)].slice(0, 1800).map(el => describeUI(el, anchor)).filter((e): e is UIElement => !!e).sort((a, b) => a.distancePx - b.distancePx);
}
function currentUI(anchor: Target) {
  for (const element of document.elementsFromPoint(anchor.x, anchor.y)) {
    if (element.closest(excluded)) continue;
    const candidate = element.closest(semantic);
    if (candidate) { const result = describeUI(candidate, anchor); if (result) return result; }
  }
}
export function robotAnchor(launcher: HTMLElement): Target {
  // Use a stable foot-level anchor. Gait oscillations must not change the destination or awareness.
  const rect = launcher.getBoundingClientRect();
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height * .91 };
}
export function readSpatialObjects(mode: IntelligenceMode, anchor: Target): SpatialObject[] {
  const supplied = providers.get(mode)?.at(-1)?.(anchor) ?? [];
  const snapshot = readRoboScene(mode), ids = new Set(supplied.map(o => o.id));
  const legacy = snapshot.objects.filter(o => !ids.has(o.command.objectId ?? '') && o.command.roboVisible !== false && o.command.kind !== 'plot').slice(0, 100).flatMap(live => {
    const { command } = live;
    if (command.dimension === '3d') return []; // Depth/hits come from the actual Three.js renderer, never guessed.
    const actual = 'vertices' in live ? live.vertices as number[][] | undefined : undefined;
    const vertices = command.kind === 'circle' ? outlineVertices(command) : actual ?? outlineVertices(command), samples = vertices.map(world => { const screen = projectRoboPoint(mode, world); return screen ? { screen, world } : undefined; });
    return [{ id: command.objectId ?? '', label: command.roboLabel ?? command.objectId ?? command.kind, kind: command.kind, samples,
      closed: !['point','line'].includes(command.kind), filled: !['point','line'].includes(command.kind), selected: snapshot.selectedIds?.includes(command.objectId ?? '') }];
  });
  return [...supplied, ...legacy];
}
export function sampleAwareness(launcher: HTMLElement, mode: IntelligenceMode, route: string): AwarenessSnapshot {
  const anchor = robotAnchor(launcher), graphPosition = inverses.get(mode)?.at(-1)?.(anchor);
  const objects = readSpatialObjects(mode, anchor).map(o => objectProximity(anchor, o, graphPosition)).filter((o): o is NearbyObject => !!o).sort((a, b) => a.screenDistancePx - b.screenDistancePx);
  const strip = ({ element: _element, ...rest }: UIElement) => rest;
  const current = currentUI(anchor);
  return { route, mode, anchor, graphPosition, currentElement: current ? strip(current) : undefined,
    nearbyElements: visibleUI(anchor).slice(0, 5).map(strip), onObject: current?.kind==='graph'?objects.find(o => o.onObject):undefined, nearbyObjects: objects.slice(0, 8), sampledAt: Date.now() };
}
export function describeAwareness(snapshot: AwarenessSnapshot) {
  const location = snapshot.onObject ? `${snapshot.mode.endsWith('3d')?'over the projected':'on'} ${snapshot.onObject.kind} “${snapshot.onObject.label}”` : snapshot.currentElement ? `over the ${snapshot.currentElement.kind} “${snapshot.currentElement.label}”` : 'over the page background';
  const nearest = snapshot.nearbyObjects[0];
  const moving=snapshot.movement?snapshot.movement.action==='jump'?'jumping, currently ':`${snapshot.movement.action.startsWith('crawl')?'crawling':'walking'} ${snapshot.movement.action.replace(/^(walk|crawl)/,'').toLowerCase()}, currently `:'';
  return `I’m ${moving}${location}.${nearest && !snapshot.onObject ? ` The nearest visible object is ${nearest.kind} “${nearest.label}”, ${Math.round(nearest.screenDistancePx)} screen pixels away${nearest.approximate&&snapshot.mode.endsWith('3d')?' to its projected bounds':''}${nearest.graphDistance !== undefined ? ` (approximately ${nearest.graphDistance.toFixed(2)} graph units)` : ''}.` : ''}`;
}
export function describeNearby(snapshot:AwarenessSnapshot){
  const objects=snapshot.nearbyObjects.slice(0,5).map(o=>`${o.kind} “${o.label}”: ${Math.round(o.screenDistancePx)} screen pixels${o.graphDistance!==undefined?` (approximately ${o.graphDistance.toFixed(2)} graph units)`:''}${o.approximate&&snapshot.mode.endsWith('3d')?' to projected bounds':''}`);
  const elements=snapshot.nearbyElements.filter(e=>e.kind!=='graph').slice(0,4).map(e=>`${e.kind} “${e.label}”: ${Math.round(e.distancePx)} screen pixels`);
  return [objects.length?`Nearby visible objects: ${objects.join('; ')}.`:'No mathematical objects are currently visible near me.',elements.length?`Nearby interface elements: ${elements.join('; ')}.`:describeAwareness(snapshot)].join(' ');
}

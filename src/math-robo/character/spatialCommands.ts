import type { Direction } from './useRoboPosition';
import { objectProximity, readSpatialObjects, visibleUI, type AwarenessSnapshot, type NearbyObject } from './spatialAwareness';
import type { Target } from './engine';

export type SpatialRequest = { type: 'where' } | {type:'nearby'} | {type:'stop'} |
  { type: 'move'; direction: Direction; crawl: boolean; distance: number } |
  { type: 'target' | 'distance'; name: string; crawl: boolean };

/** Only self-location and robot locomotion. Mathematical move/distance commands stay with the existing engine. */
export function parseSpatialRequest(raw: string): SpatialRequest | undefined {
  const named = /^\s*(?:ruhi|robo|robot)\b/i.test(raw);
  const text = raw.trim().replace(/^(?:ruhi|robo|robot)[,:]?\s*/i, '').replace(/^(?:please\s+|(?:can|could|would) you\s+)/i, '').replace(/[.!?]+$/, '').trim().replace(/\s+(?:right\s+)?now$/i,'');
  if (/^(?:where are you(?: now| standing)?|where is (?:ruhi|robo|robot)|what are you (?:on|standing on|over)|which (?:element|button|tab|heading|object) are you (?:on|over))$/i.test(text)) return { type: 'where' };
  if (/^(?:what (?:is|are the objects) (?:near you|nearby)|what objects are near you|near ?by objects|what is around you)$/i.test(text)) return { type: 'nearby' };
  if (/^(?:stop|cancel)(?: (?:walking|crawling|moving|movement))$/i.test(text) || named && /^(?:stop|cancel)$/i.test(text)) return { type: 'stop' };
  if(/^crawl(?: animation)?$/i.test(text))return {type:'move',direction:'right',crawl:true,distance:120};
  const movement = text.match(/^(walk(?:ing)?|crawl(?:ing)?|move|go)\s+(?:to (?:the )?)?(left|right|up|top|down|bottom)(?:\s+(?:by\s+)?(\d+(?:\.\d+)?)\s*(?:px|pixels)?)?$/i);
  if (movement && (named || /^(walk|crawl)/i.test(movement[1]))) {
    const direction = movement[2].toLowerCase();
    return { type: 'move', direction: (direction === 'top' ? 'up' : direction === 'bottom' ? 'down' : direction) as Direction, crawl: /^crawl/i.test(movement[1]), distance: Math.max(1, Math.min(2000, Number(movement[3] ?? 120))) };
  }
  const target = text.match(/^(walk|crawl|go|move)\s+to\s+(.+)$/i);
  if (target && (named || /^(walk|crawl)$/i.test(target[1]))) return { type: 'target', name: target[2], crawl: /^crawl/i.test(target[1]) };
  const distance = text.match(/^(?:how far are you from|(?:what is )?your distance to|distance from you to)\s+(.+)$/i) ?? (named ? text.match(/^distance to\s+(.+)$/i) : null);
  if (distance) return { type: 'distance', name: distance[1], crawl: false };
}

export type ResolvedTarget = { label: string; kind: string; point: Target; distancePx: number; graphDistance?: number; boundsOnly?: boolean };
export type TargetResolution = { target?: ResolvedTarget; choices: string[] };
const normalize = (name: string) => name.toLowerCase().replace(/[“”"']/g, '').replace(/^the\s+/, '').replace(/\s+/g, ' ').trim();
export function matchTargetNames<T extends { label: string; kind: string; id?: string }>(query: string, candidates: T[]): T[] {
  const name = normalize(query), typeWords = ['button','tab','heading','text','link','field','object','graph','circle','line','point','sphere','cube','curve','plot'];
  const specified = typeWords.find(kind => name.startsWith(`${kind} `) || name.endsWith(` ${kind}`) || name === kind);
  const label = specified ? name.replace(new RegExp(`^${specified}\\s*|\\s*${specified}$`, 'g'), '').trim() : name;
  const eligible = candidates.filter(c => !specified || specified === 'object' || c.kind === specified || specified === 'curve' && c.kind === 'plot');
  const exact = eligible.filter(c => label && [normalize(c.label),normalize(c.label).replace(new RegExp(`^${c.kind}\\s+`),''),normalize(c.id ?? '')].includes(label));
  if (exact.length) return exact;
  return eligible.filter(c => !label || normalize(c.label).includes(label) || normalize(c.id ?? '') === label);
}
export function resolveSpatialTarget(snapshot: AwarenessSnapshot, name: string): TargetResolution {
  const objects = readSpatialObjects(snapshot.mode, snapshot.anchor).map(o => objectProximity(snapshot.anchor, o, snapshot.graphPosition)).filter((o): o is NearbyObject => !!o);
  const graph = objects.map(o => ({ ...o, point: o.closest, distancePx: o.screenDistancePx, boundsOnly: o.approximate }));
  const ui = visibleUI(snapshot.anchor).map(e => ({ ...e, point: e.target, distancePx: e.distancePx }));
  let matches: ResolvedTarget[];
  if (/^(?:the )?(?:nearest|closest) object$/i.test(name)) matches = graph.sort((a, b) => a.distancePx - b.distancePx).slice(0, 1);
  else if (/^(?:the )?selected object$/i.test(name)) matches = graph.filter(o => o.selected);
  else matches = matchTargetNames(name, [...graph, ...ui]);
  return matches.length === 1 ? { target: matches[0], choices: [] } : { choices: [...new Set(matches.map(m => `${m.kind} “${m.label}”`))].slice(0, 6) };
}

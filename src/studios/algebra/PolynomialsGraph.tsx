import { useId, useRef, type PointerEvent } from 'react';
import { endBehavior, groupedRoots, pn, rootColors, type RootFactor } from './polynomialsDashboardMath';
export type PolynomialView = { xmin: number; xmax: number; ymin: number; ymax: number };
export function fitPolynomial(roots: RootFactor[], leading: number): PolynomialView {
  if (!roots.length || !leading) return { xmin: -7, xmax: 7, ymin: -3, ymax: 3 };
  const low = Math.min(...roots.map(root => root.value)), high = Math.max(...roots.map(root => root.value));
  const span = Math.max(4, high - low), margin = span * .35;
  const innerSamples = Array.from({ length: 201 }, (_, i) => leading * roots.reduce((y, root) => y * (low + (high - low) * i / 200 - root.value) ** root.multiplicity, 1));
  const height = Math.max(1, ...innerSamples.map(Math.abs)) * 1.8;
  return { xmin: Math.min(-1, low - margin), xmax: Math.max(1, high + margin), ymin: -height, ymax: height };
}
export default function PolynomialsGraph({ roots, leading, view, mode, grid, labels, annotations, onMove }: { roots: RootFactor[]; leading: number; view: PolynomialView; mode: string; grid: boolean; labels: boolean; annotations: boolean; onMove: (id: number, value: number) => void }) {
  const id = useId().replace(/:/g, '');
  const svg = useRef<SVGSVGElement>(null);
  const drag = useRef<{ id: number; view: PolynomialView } | null>(null);
  const { xmin, xmax, ymin, ymax } = view;
  const px = (x: number) => 39 + (x - xmin) / (xmax - xmin) * 682;
  const py = (y: number) => 424 - (y - ymin) / (ymax - ymin) * 388;
  const evaluate = (x: number) => leading * roots.reduce((product, root) => product * (x - root.value) ** root.multiplicity, 1);
  const groups = groupedRoots(roots);
  const degree = roots.reduce((n, root) => n + root.multiplicity, 0);
  const ends = endBehavior(degree, leading);
  const samples = Array.from({ length: 601 }, (_, i) => { const x = xmin + i / 600 * (xmax - xmin); return { x, y: evaluate(x) }; });
  const path = samples.map((point, i) => `${i ? 'L' : 'M'}${px(point.x).toFixed(2)},${Math.max(-5000, Math.min(5000, py(point.y))).toFixed(2)}`).join(' ');
  const tickStep = (span: number) => { const raw = span / 12, power = 10 ** Math.floor(Math.log10(raw)); return [1, 2, 5, 10].find(n => n * power >= raw)! * power; };
  const ticks = (min: number, max: number) => { const step = tickStep(max - min); return Array.from({ length: Math.ceil((max - min) / step) + 1 }, (_, i) => Math.ceil(min / step) * step + i * step).filter(value => value <= max + 1e-8); };
  const move = (event: PointerEvent<SVGSVGElement>) => { if (!drag.current) return; const box = event.currentTarget.getBoundingClientRect(), v = drag.current.view; const x = v.xmin + ((event.clientX - box.left) / box.width * 760 - 39) / 682 * (v.xmax - v.xmin); onMove(drag.current.id, Math.max(-20, Math.min(20, Math.round(x * 10) / 10))); };
  const arrow = (left: boolean) => {
    const up = left ? ends.leftUp : ends.rightUp;
    const side = samples.filter(point => left ? point.x < Math.min(...roots.map(root => root.value)) : point.x > Math.max(...roots.map(root => root.value)));
    const target = (up ? ymax : ymin) * .85;
    const ordered = left ? side.slice().reverse() : side;
    const tip = ordered.find(point => up ? point.y >= target : point.y <= target) ?? ordered.at(-1);
    if (!tip) return null;
    const tx = px(tip.x), ty = py(tip.y), ex = tx + (left ? -12 : 12), ey = ty + (up ? -23 : 23);
    return <g><path d={`M${tx} ${ty}L${ex} ${ey}`} stroke="#00a9c8" strokeWidth="4" markerEnd={`url(#${id}-arrow)`} /><rect x={left ? 44 : 630} y={up ? 46 : 341} width="90" height="43" rx="9" fill="#e4f5ff" stroke="#d7ecff" /><text x={left ? 89 : 675} y={(up ? 46 : 341) + 17} textAnchor="middle" fill="#0784ef" fontSize="11" fontWeight="650">{up ? 'Rises' : 'Falls'} to {up ? '+∞' : '−∞'}</text><text x={left ? 89 : 675} y={(up ? 46 : 341) + 33} textAnchor="middle" fill="#0784ef" fontSize="10">as x → {left ? '−∞' : '+∞'}</text></g>;
  };
  return <svg ref={svg} className="poly-reference-graph" viewBox="0 0 760 460" preserveAspectRatio="none" role="img" aria-label="Interactive polynomial graph with draggable roots" onPointerMove={move} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
    <defs><clipPath id={`${id}-clip`}><rect x="31" y="27" width="698" height="410" rx="4" /></clipPath><pattern id={`${id}-grid`} width={682 / (xmax - xmin) * tickStep(xmax - xmin)} height={388 / (ymax - ymin) * tickStep(ymax - ymin)} patternUnits="userSpaceOnUse" x={px(0)} y={py(0)}><path d={`M${682 / (xmax - xmin) * tickStep(xmax - xmin)} 0H0V${388 / (ymax - ymin) * tickStep(ymax - ymin)}`} stroke="#dcecf8" fill="none" strokeWidth=".75" /></pattern><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10L3 5Z" fill="#00a9c8" /></marker></defs>
    <rect x="31" y="27" width="698" height="410" fill="#fbfeff" />{grid && <rect x="31" y="27" width="698" height="410" fill={`url(#${id}-grid)`} />}
    <g clipPath={`url(#${id}-clip)`}><path d={`M31 ${py(0)}H729M${px(0)} 27V437`} stroke="#344387" strokeWidth="1.3" />{ticks(xmin, xmax).map((n, i) => <g key={i}><path d={`M${px(n)} ${py(0) - 4}v8`} stroke="#677ab4" />{!(labels && leading && groups.some(root => Math.abs(root.value - n) < 1e-8)) && <text x={px(n)} y={py(0) + 20} textAnchor="middle" fontSize="12" fill="#3d5390">{pn(n)}</text>}</g>)}{ticks(ymin, ymax).filter(n => Math.abs(n) > 1e-8).map((n, i) => <g key={i}><path d={`M${px(0) - 4} ${py(n)}h8`} stroke="#677ab4" /><text x={px(0) - 12} y={py(n) + 4} textAnchor="end" fontSize="12" fill="#3d5390">{pn(n)}</text></g>)}<path d={path} stroke="#00a5c4" strokeWidth="3" fill="none" strokeLinecap="round" /></g>
    <path d={`M729 ${py(0)}l-8 -4v8ZM31 ${py(0)}l8 -4v8ZM${px(0)} 27l-4 8h8Z`} fill="#20326c" /><text x="733" y={py(0) + 16} fontSize="14" fontWeight="700" fill="#14245c">x</text><text x={px(0) + 12} y="29" fontSize="14" fontWeight="700" fill="#14245c">y</text>
    {leading !== 0 && groups.filter(root => root.value >= xmin && root.value <= xmax).map((root, i) => {
      const color = rootColors[roots.findIndex(item => item.id === root.id) % rootColors.length];
      const x = px(root.value), y = py(0), labelY = y - 76 - (i % 2 ? 0 : 4);
      return <g key={root.id}>{mode === 'Multiplicity' && annotations && <g><rect x={x - 48} y={labelY} width="96" height="42" rx="8" fill={color} fillOpacity=".08" stroke={color} strokeOpacity=".3" /><text x={x} y={labelY + 17} textAnchor="middle" fill={color} fontSize="12" fontWeight="650">{root.multiplicity % 2 ? 'Crosses' : 'Touches'}</text><text x={x} y={labelY + 32} textAnchor="middle" fill={color} fontSize="11">(multiplicity {root.multiplicity})</text><path d={`M${x + 5} ${labelY + 46}Q${x - 4} ${y - 28} ${x} ${y - 12}`} stroke={color} strokeWidth="1.8" fill="none" /><path d={`M${x - 5} ${y - 19}L${x} ${y - 11}L${x + 5} ${y - 19}`} stroke={color} strokeWidth="1.8" fill="none" /></g>}
        <circle className="poly-root-handle" cx={x} cy={y} r="7.7" fill="#ff9d0b" stroke="white" strokeWidth="1.5" role="slider" tabIndex={0} aria-label={`Drag root ${roots.findIndex(item => item.id === root.id) + 1}`} aria-valuenow={root.value} aria-valuemin={-20} aria-valuemax={20} onPointerDown={e => { e.preventDefault(); drag.current = { id: root.id, view }; svg.current?.setPointerCapture(e.pointerId); }} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); onMove(root.id, Math.max(-20, Math.min(20, Math.round((root.value + (e.key === 'ArrowRight' ? .1 : -.1)) * 10) / 10))); } }} />{labels && <text x={x} y={y + 23} textAnchor="middle" fontSize="13" fontWeight="750" fill="#1c327b">{pn(root.value)}</text>}</g>;
    })}
    {mode === 'End Behavior' && annotations && !ends.special && roots.length > 0 && <>{arrow(true)}{arrow(false)}</>}
    {mode !== 'End Behavior' && <g><rect x="578" y="36" width="141" height="45" rx="9" fill="white" fillOpacity=".92" stroke="#d8eaff" /><circle cx="592" cy="53" r="5" fill="#06a7c7" /><text x="602" y="52" fontSize="11" fill="#4c659b">Leading coefficient</text><text x="602" y="69" fontSize="12" fontWeight="650" fill="#253d90">{pn(leading)} ({leading > 0 ? 'positive' : leading < 0 ? 'negative' : 'zero'})</text></g>}
  </svg>;
}

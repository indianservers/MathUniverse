import { useId, type PointerEvent } from 'react';
import { num } from './functionsDashboardMath';
export type Curve = { key: string; label: string; color: string; evaluate: (x: number) => number; dashed?: boolean; min?: number | null; max?: number | null; endpoints?: { x: number; y: number; closed: boolean }[] };
export default function FunctionsGraph({ curves, points = [], grid, showPoints, showIntervals, zoom, onProbe, probe }: { curves: Curve[]; points?: { x: number; y: number; color: string; label?: string }[]; grid: boolean; showPoints: boolean; showIntervals: boolean; zoom: number; onProbe: (x: number) => void; probe: number }) {
  const id = useId().replace(/:/g, '');
  const xmin = -7 / zoom, xmax = 7 / zoom, ymin = -4 / zoom, ymax = 8 / zoom;
  const px = (x: number) => 42 + (x - xmin) / (xmax - xmin) * 676;
  const py = (y: number) => 428 - (y - ymin) / (ymax - ymin) * 392;
  const paths = (curve: Curve) => {
    let path = '', previousY = NaN, previousX = NaN;
    const start = Math.max(xmin, curve.min ?? xmin), end = Math.min(xmax, curve.max ?? xmax);
    if (end < start) return '';
    for (let i = 0; i <= 500; i++) {
      const x = start + i / 500 * (end - start), y = curve.evaluate(x);
      if (!Number.isFinite(y) || Math.abs(y) > 1000 / zoom) { previousY = NaN; continue; }
      const jump = Number.isFinite(previousY) && Math.abs(py(y) - py(previousY)) > 150 && y * previousY < 0;
      path += `${!Number.isFinite(previousY) || jump || x === previousX ? 'M' : 'L'}${px(x).toFixed(2)},${py(y).toFixed(2)} `;
      previousY = y; previousX = x;
    }
    return path;
  };
  const updateProbe = (event: PointerEvent<SVGSVGElement>) => { const box = event.currentTarget.getBoundingClientRect(); const x = xmin + ((event.clientX - box.left) / box.width * 760 - 42) / 676 * (xmax - xmin); onProbe(Math.round(x * 10) / 10); };
  const visible = (x: number, y: number) => Number.isFinite(y) && x >= xmin && x <= xmax && y >= ymin && y <= ymax;
  const step = zoom < .8 ? 2 : 1;
  const xTicks = Array.from({ length: Math.ceil((xmax - xmin) / step) + 1 }, (_, i) => Math.ceil(xmin / step) * step + i * step).filter(x => x <= xmax);
  const yTicks = Array.from({ length: Math.ceil((ymax - ymin) / step) + 1 }, (_, i) => Math.ceil(ymin / step) * step + i * step).filter(y => y <= ymax);
  return <svg className="fn-graph" viewBox="0 0 760 470" role="img" aria-label="Interactive function graph. Click or drag to move the input point." onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); updateProbe(e); }} onPointerMove={e => { if (e.buttons === 1) updateProbe(e); }} tabIndex={0} onKeyDown={e => { if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); onProbe(Math.round((probe + (e.key === 'ArrowRight' ? .1 : -.1)) * 10) / 10); } }}>
    <defs><clipPath id={`${id}-plot`}><rect x="30" y="28" width="701" height="413" rx="3" /></clipPath><pattern id={`${id}-grid`} width={676 / (xmax - xmin) / 2} height={392 / (ymax - ymin) / 2} patternUnits="userSpaceOnUse" x={px(0)} y={py(0)}><path d={`M${676 / (xmax - xmin) / 2} 0H0V${392 / (ymax - ymin) / 2}`} fill="none" stroke="#dcecf8" strokeWidth=".7" /></pattern></defs>
    <rect x="30" y="28" width="701" height="413" rx="5" fill="#f9fdff" />{grid && <rect x="30" y="28" width="701" height="413" fill={`url(#${id}-grid)`} />}
    {showIntervals && curves.map(curve => <g key={curve.key}>{[curve.min, curve.max].filter((x): x is number => x !== null && x !== undefined && x >= xmin && x <= xmax).map((x, i) => <path key={i} d={`M${px(x)} 28V441`} stroke={curve.color} strokeOpacity=".2" strokeDasharray="4 5" />)}</g>)}
    <path d={`M30 ${py(0)}H730M${px(0)} 28V441`} stroke="#172660" strokeWidth="1.3" /><path d={`M730 ${py(0)}l-8 -4v8ZM30 ${py(0)}l8 -4v8ZM${px(0)} 28l-4 8h8Z`} fill="#172660" />
    {xTicks.map(x => <g key={x}><path d={`M${px(x)} ${py(0) - 4}v8`} stroke="#536399" />{x % (step * 2) === 0 && <text x={px(x)} y={py(0) + 21} textAnchor="middle" fill="#405387" fontSize="12">{num(x)}</text>}</g>)}{yTicks.map(y => <g key={y}><path d={`M${px(0) - 4} ${py(y)}h8`} stroke="#536399" />{y && y % (step * 2) === 0 ? <text x={px(0) - 14} y={py(y) + 4} textAnchor="end" fill="#405387" fontSize="12">{num(y)}</text> : null}</g>)}<text x="729" y={py(0) - 12} fill="#15215b" fontSize="13" fontStyle="italic">x</text><text x={px(0) + 14} y="25" fill="#15215b" fontSize="13" fontStyle="italic">y</text>
    <g clipPath={`url(#${id}-plot)`}>{curves.map(curve => <path key={curve.key} d={paths(curve)} stroke={curve.color} strokeWidth="2.8" fill="none" strokeDasharray={curve.dashed ? '5 5' : undefined} strokeLinecap="round" />)}</g>
    {showPoints && <g>{curves.flatMap(curve => (curve.endpoints ?? []).filter(p => visible(p.x, p.y)).map((point, i) => <circle key={`${curve.key}-${i}`} cx={px(point.x)} cy={py(point.y)} r="6.8" fill={point.closed ? curve.color : 'white'} stroke={curve.color} strokeWidth="2.5" />))}{points.filter(p => visible(p.x, p.y)).map((point, i) => <g key={i}><circle cx={px(point.x)} cy={py(point.y)} r="7" fill={point.color} stroke="white" strokeWidth="2" /><g transform={`translate(${Math.min(620, Math.max(35, px(point.x) + (i % 2 ? -100 : 12)))},${Math.min(421, Math.max(42, py(point.y) + (i % 2 ? -38 : 15)))})`}><rect width="100" height="29" rx="7" fill="white" fillOpacity=".94" stroke={point.color} strokeOpacity=".45" /><text x="50" y="19" textAnchor="middle" fill={point.color} fontSize="12" fontWeight="650">{point.label ?? `(${num(point.x)}, ${num(point.y)})`}</text></g></g>)}</g>}
  </svg>;
}

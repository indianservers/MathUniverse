import { forwardRef, useLayoutEffect, useRef, useState, type ComponentProps, type PointerEvent } from 'react';
import { Circle, Maximize2, MousePointer2, Pencil, Ruler, Slash, Triangle } from 'lucide-react';
import GeometryLessonCanvas from '../GeometryLessonCanvas';
import { useStudioModel } from '../../phase1/StudioModelProvider';
import { angleAt, dist, type Pt } from './triangleGeometry';
type Props = ComponentProps<typeof GeometryLessonCanvas> & { fitBounds?: Pt[]; legend?: string[][] };
type Mark = { tool: string; points: Pt[]; text?: string };
const tools = ['Move', 'Point', 'Line', 'Angle', 'Measure', 'Annotate'] as const;
export default forwardRef<SVGSVGElement, Props>(function TriangleReferenceCanvas({ children, fitBounds, legend, ...props }, ref) {
  const [tool, setTool] = useState<typeof tools[number]>('Move');
  const [pending, setPending] = useState<Pt[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [text, setText] = useState('My observation');
  const [status, setStatus] = useState('');
  const model = useStudioModel();
  const rootRef = useRef<HTMLDivElement>(null);
  const [aspect, setAspect] = useState(2.4);
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const resize = () => {
      const svg = root.querySelector('svg[data-workspace-presentation]');
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      if (rect.width && rect.height) setAspect(rect.width / rect.height);
    };
    const observer = new ResizeObserver(resize); observer.observe(root); resize();
    return () => observer.disconnect();
  }, []);
  let fittedBox = props.viewBox;
  if (fitBounds?.length) {
    const points = [...props.scene.construction.points, ...fitBounds];
    const minX = Math.min(...points.map(p => p.x)), maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y)), maxY = Math.max(...points.map(p => p.y));
    const width = Math.max(maxX - minX + 70, (maxY - minY + 70) * aspect, 120);
    const height = width / aspect;
    fittedBox = `${(minX + maxX - width) / 2} ${(minY + maxY - height) / 2} ${width} ${height}`;
  }
  const pointer = (event: PointerEvent<HTMLDivElement>) => {
    if (tool === 'Move' || !(event.target instanceof SVGElement)) return;
    const svg = event.target.closest<SVGSVGElement>('svg[data-workspace-presentation]');
    if (!svg) return;
    event.preventDefault(); event.stopPropagation();
    const matrix = svg.getScreenCTM(); if (!matrix) return;
    const raw = svg.createSVGPoint(); raw.x = event.clientX; raw.y = event.clientY;
    const point = raw.matrixTransform(matrix.inverse()); const next = [...pending, { x: point.x, y: point.y }];
    const count = tool === 'Angle' ? 3 : tool === 'Line' || tool === 'Measure' ? 2 : 1;
    if (next.length === count) {
      setMarks([...marks, { tool, points: next, text: tool === 'Annotate' ? text : undefined }]); setPending([]);
      setStatus(tool === 'Measure' ? `Distance: ${(dist(next[0], next[1]) / props.scene.unitScale).toFixed(2)} units.` : tool === 'Angle' ? `Angle: ${angleAt(next[1], next[0], next[2]).toFixed(1)}°.` : `${tool} added.`);
    } else { setPending(next); setStatus(`Select ${count - next.length} more point${count - next.length === 1 ? '' : 's'}.`); }
  };
  return <div ref={rootRef} className={`tri-reference-canvas ${props.activityId?.startsWith('centers-') ? 'tri-center-workspace' : ''}`} onPointerDownCapture={pointer}>
    {(legend || props.activityId?.startsWith('centers-')) && <div className="tri-canvas-history"><button aria-label="Undo construction change" onClick={() => model?.ledger.undo()}>↶</button><button aria-label="Redo construction change" onClick={() => model?.ledger.redo()}>↷</button></div>}
    {(legend || props.activityId?.startsWith('centers-')) && <div className="tri-center-legend" aria-label="Construction color legend">{(legend ?? [['Triangle (ABC)', '#147df2'], ['Circumcircle (O)', '#147df2'], ['Incircle (I)', '#ff9500'], ['Medians (G)', '#10b981'], ['Altitudes (H)', '#8b45f4'], ['Euler line', '#ff32cc']]).map(([label, color]) => <span key={label}><i style={{ background: color }} />{label}</span>)}</div>}
    <div className="tri-reference-tools"><div><Triangle /><span><b>{legend || props.activityId?.startsWith('centers-') ? 'Interactive Workspace' : 'Interactive Triangle Canvas'}</b><small>{legend || props.activityId?.startsWith('centers-') ? 'Drag the vertices to see every construction and measurement update in real time.' : 'Drag vertices · Measure · Explore · Discover'}</small></span></div><nav aria-label="Triangle drawing tools">{tools.map((item, i) => { const Icon = [MousePointer2, Circle, Slash, Triangle, Ruler, Pencil][i]; return <button key={item} type="button" aria-pressed={tool === item} onClick={() => { setTool(item); setPending([]); setStatus(item === 'Move' ? 'Drag the original vertices to reshape the triangle.' : item === 'Angle' ? 'Choose three points; the middle point is the angle vertex.' : `Click the canvas to add ${item.toLowerCase()} marks.`); }}><Icon />{item}</button>; })}<button type="button" aria-label="Fullscreen triangle canvas" onClick={event => { const root = event.currentTarget.closest('.tri-reference-canvas'); if (document.fullscreenElement) void document.exitFullscreen(); else void root?.requestFullscreen().catch(() => setStatus('Fullscreen unavailable.')); }}><Maximize2 /></button></nav></div>
    {tool === 'Annotate' && <label className="tri-annotation-text">Annotation text<input aria-label="Annotation text" value={text} onChange={e => setText(e.target.value)} /></label>}
    {tool !== 'Move' && <p className="tri-tool-hint">{status}<button onClick={() => { setMarks([]); setPending([]); setStatus('Drawing marks cleared.'); }}>Clear drawing marks</button></p>}
    <GeometryLessonCanvas {...props} viewBox={fittedBox} scene={{ ...props.scene, camera: { ...props.scene.camera, width: 720, height: 720 / aspect } }} ref={ref} showToolbar={false} fitObjects={!fitBounds?.length}>
      {children}<g aria-label="Your drawing marks">{marks.map((mark, i) => { const a = mark.points[0], b = mark.points[1], c = mark.points[2]; return <g key={i} fill="#0089ee" stroke="#0089ee" strokeWidth="1.8">{mark.tool === 'Point' && <><circle cx={a.x} cy={a.y} r="4" /><text x={a.x + 7} y={a.y - 7} stroke="none" fontSize="12">P{i + 1}</text></>}{(mark.tool === 'Line' || mark.tool === 'Measure') && <><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} />{mark.tool === 'Measure' && <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 9} stroke="none" fontSize="13">{(dist(a, b) / props.scene.unitScale).toFixed(2)} units</text>}</>}{mark.tool === 'Angle' && <><polyline points={`${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`} fill="none" /><text x={b.x + 10} y={b.y - 12} stroke="none" fontSize="13">{angleAt(b, a, c).toFixed(1)}°</text></>}{mark.tool === 'Annotate' && <text x={a.x} y={a.y} stroke="none" fontSize="13">{mark.text}</text>}</g>; })}{pending.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ff9b0d" />)}</g>
    </GeometryLessonCanvas>
    <div className="tri-canvas-features"><span><MousePointer2 /><b>Drag vertices<small>Move A, B, or C</small></b></span><span><Ruler /><b>Real-time measurements<small>Sides and angles update</small></b></span><span><Triangle /><b>Explore special cases<small>Try a right triangle</small></b></span><span><Pencil /><b>Visual feedback<small>Matching marks show properties</small></b></span></div>
  </div>;
});

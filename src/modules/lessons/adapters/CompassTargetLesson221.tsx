import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleDot,
  Copy,
  Crosshair,
  Info,
  MousePointer2,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { LessonAdapterProps } from "../types";

type Point = { x: number; y: number };
type Tool = "select" | "point" | "circle" | "copy";
type Drag = "center" | "radius" | "practice" | null;

const initialCenter = { x: 2, y: 1 };
const initialRadius = 3;

export default function CompassTargetLesson221({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [center, setCenter] = useState<Point>(initialCenter);
  const [radius, setRadius] = useState(initialRadius);
  const [tool, setTool] = useState<Tool>("select");
  const [drag, setDrag] = useState<Drag>(null);
  const [showRadius, setShowRadius] = useState(true);
  const [snap, setSnap] = useState(true);
  const [showCircle, setShowCircle] = useState(true);
  const [editingCenter, setEditingCenter] = useState(false);
  const [practicePoint, setPracticePoint] = useState<Point>({ x: 3, y: 3 });
  const [practiceStarted, setPracticeStarted] = useState(false);
  const [practiceChecked, setPracticeChecked] = useState(false);
  const surfaceRef = useRef<HTMLElement>(null);

  const radiusPoint = useMemo(
    () => ({ x: center.x + radius, y: center.y }),
    [center, radius],
  );
  const practiceDistance = Math.hypot(
    practicePoint.x - 3,
    practicePoint.y + 1,
  );
  const practiceCorrect = Math.abs(practiceDistance - 4) < 0.18;

  const reset = () => {
    setCenter(initialCenter);
    setRadius(initialRadius);
    setTool("select");
    setShowRadius(true);
    setSnap(true);
    setShowCircle(true);
    setEditingCenter(false);
    setPracticePoint({ x: 3, y: 3 });
    setPracticeStarted(false);
    setPracticeChecked(false);
    onInteraction();
  };

  useEffect(() => {
    setCenter(initialCenter);
    setRadius(initialRadius);
    setTool("select");
    setShowRadius(true);
    setSnap(true);
    setShowCircle(true);
    setEditingCenter(false);
    setPracticePoint({ x: 3, y: 3 });
    setPracticeStarted(false);
    setPracticeChecked(false);
  }, [resetToken]);

  const updateCenter = (next: Point) => {
    setCenter({
      x: clamp(snap ? Math.round(next.x) : next.x, -5, 4),
      y: clamp(snap ? Math.round(next.y) : next.y, -3, 4),
    });
    onInteraction();
  };

  return (
    <section
      ref={surfaceRef}
      className="space-y-3 pb-1"
      style={{ marginTop: -7 }}
      data-testid="dynamic-geometry-mockup-0278"
      data-dedicated-lesson="221"
      data-object-model="compass-distance-transfer"
      data-direct-interaction="true"
      aria-label="Compass dedicated interactive geometry model"
    >
      <span className="sr-only">Live Verification. Check Construction.</span>

      <header className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-cyan-700">
              <CompassMark />
            </div>
            <div>
              <h1 className="text-[27px] font-black leading-8 text-slate-950">Compass</h1>
              <p className="mt-1 text-[10px] text-slate-700">Transfer distances using a compass.</p>
            </div>
          </div>
          <button type="button" className="target-icon-button" aria-label="Reset compass lesson" onClick={reset}>
            <RotateCcw />
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[8px] font-bold text-slate-700">
          {['Dynamic Geometry Construction', 'Construction Studio', 'Geometry Tools', 'English (English)', '6-10 min'].map((item) => (
            <span key={item} className="rounded-md border border-slate-200 px-3 py-2">{item}</span>
          ))}
        </div>
      </header>

      <nav className="grid grid-cols-5 overflow-hidden rounded-xl border border-slate-200 bg-white text-[11px] text-slate-700 shadow-sm">
        {['Interact', 'Observe', 'Rule', 'Examples', 'Practice'].map((label, index) => (
          <button
            type="button"
            key={label}
            className={`h-11 border-b-2 font-bold ${index === 0 ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-transparent'}`}
            onClick={() => {
              document.getElementById(index === 4 ? 'compass-practice' : `compass-panel-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
              onInteraction();
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      <section id="compass-panel-0" className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <p className="mb-2 text-[8px] font-black uppercase text-cyan-700">- Compass Workspace</p>
        <div className="grid gap-3 lg:grid-cols-[minmax(0,2fr)_minmax(205px,1fr)]">
          <div>
            <div className="mb-2 flex flex-wrap gap-2">
              <ToolButton active={tool === 'select'} label="Select" icon={<MousePointer2 />} onClick={() => setTool('select')} />
              <ToolButton active={tool === 'point'} label="Point" icon={<Crosshair />} onClick={() => setTool('point')} />
              <ToolButton active={tool === 'circle'} label="Circle (Center)" icon={<CircleDot />} onClick={() => setTool('circle')} />
              <ToolButton active={tool === 'copy'} label="Copy Distance" icon={<Copy />} onClick={() => setTool('copy')} />
              <ToolButton label="Clear" icon={<Trash2 />} onClick={() => { setShowCircle(false); onInteraction(); }} />
            </div>
            <CompassCanvas
              center={center}
              radius={radius}
              radiusPoint={radiusPoint}
              showCircle={showCircle}
              showRadius={showRadius}
              tool={tool}
              drag={drag}
              snap={snap}
              onDrag={setDrag}
              onCenter={updateCenter}
              onRadius={(value) => { setRadius(clamp(value, 1, 5)); setShowCircle(true); onInteraction(); }}
            />
            <div className="mt-2 flex items-center gap-2 rounded-md border border-cyan-300 bg-cyan-50 px-3 py-2 text-[9px] text-slate-700">
              <Info className="h-3.5 w-3.5 shrink-0 text-cyan-700" />
              Place the compass point at any location. Adjust the opening. Draw an arc.
            </div>
          </div>

          <aside className="space-y-3">
            <Panel title="Compass Controls">
              <p className="text-[9px] font-bold">Opening (radius)</p>
              <p className="mt-2 font-serif text-[17px] font-bold italic">r = {radius.toFixed(2)} units</p>
              <div className="mt-2 flex items-center gap-2">
                <button type="button" className="target-round-button" aria-label="Decrease compass radius" onClick={() => { setRadius((v) => clamp(v - 0.25, 1, 5)); onInteraction(); }}>-</button>
                <input aria-label="Opening radius" className="min-w-0 flex-1 accent-blue-600" type="range" min="1" max="5" step="0.05" value={radius} onChange={(event) => { setRadius(Number(event.target.value)); setShowCircle(true); onInteraction(); }} />
                <button type="button" className="target-round-button" aria-label="Increase compass radius" onClick={() => { setRadius((v) => clamp(v + 0.25, 1, 5)); onInteraction(); }}>+</button>
              </div>
              <div className="mt-3 grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" className={`h-8 rounded-md border text-[10px] ${radius === value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 bg-slate-50'}`} onClick={() => { setRadius(value); setShowCircle(true); onInteraction(); }}>{value}</button>)}
              </div>
              <Toggle label="Show radius" checked={showRadius} onChange={setShowRadius} />
              <Toggle label="Snap to grid" checked={snap} onChange={setSnap} />
            </Panel>
            <Panel title="Center Point">
              <div className="flex items-center justify-between">
                <p className="font-serif text-[16px] font-bold">B&nbsp; ({format(center.x)}, {format(center.y)})</p>
                <button type="button" className="p-1 text-slate-700" aria-label="Edit center coordinates" onClick={() => setEditingCenter((value) => !value)}><Pencil className="h-4 w-4" /></button>
              </div>
              {editingCenter ? (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Coordinate label="x" value={center.x} onChange={(x) => updateCenter({ ...center, x })} />
                  <Coordinate label="y" value={center.y} onChange={(y) => updateCenter({ ...center, y })} />
                </div>
              ) : (
                <><p className="mt-3 text-[8px] font-bold">Coordinates</p><p className="mt-1 font-serif text-[11px] font-bold">x = {center.x.toFixed(2)} &nbsp;&nbsp;&nbsp; y = {center.y.toFixed(2)}</p></>
              )}
            </Panel>
          </aside>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[2fr_1fr] [&>section]:min-h-[128px]">
          <Panel title="What Happened?">
            <ResultLine>A circle of radius <i>r</i> = {radius.toFixed(2)} units was drawn with center at <i>B</i> ({format(center.x)}, {format(center.y)}).</ResultLine>
            <ResultLine>All points on the circle are exactly {radius.toFixed(2)} units from <i>B</i>.</ResultLine>
          </Panel>
          <Panel title="Step History">
            <ol className="space-y-2 text-[9px] text-slate-700">
              <li>1&nbsp;&nbsp; Set center at <i>B</i> ({format(center.x)}, {format(center.y)})</li>
              <li>2&nbsp;&nbsp; Set radius <i>r</i> = {radius.toFixed(2)}</li>
              <li className="rounded-md border border-blue-300 bg-blue-50 px-2 py-1">3&nbsp;&nbsp; Draw circle</li>
            </ol>
          </Panel>
        </div>
      </section>

      <section className="grid gap-3 lg:grid-cols-3" style={{ marginTop: 8 }}>
        <InfoCard id="compass-panel-1" title="How It Works">
          <p>Copy a distance from one place to another.</p>
          <Steps />
          <MiniTransfer />
        </InfoCard>
        <InfoCard id="compass-panel-2" title="The Rule">
          <p>A compass copies a distance exactly.</p>
          <Formula>If the compass opening is <i>r</i>, then any arc or circle drawn has radius <i>r</i>.</Formula>
          <p>For any point <i>P</i> on the circle,</p><MathBox>BP = r</MathBox>
          <p>Copying to a new point <i>A</i> gives</p><MathBox>AP = r</MathBox>
        </InfoCard>
        <InfoCard id="compass-panel-3" title="Distance Insight">
          <p>Distance formula (in the plane)</p>
          <p>If <i>B</i> (x1, y1) and <i>P</i> (x2, y2) lie on the circle with radius <i>r</i>,</p>
          <Formula>BP = sqrt((x2 - x1)^2 + (y2 - y1)^2) = r</Formula>
          <MiniCircle />
        </InfoCard>
      </section>

      <section id="compass-practice" className="rounded-xl border border-slate-200 bg-white px-3 pb-2 pt-2 shadow-sm" style={{ marginTop: 8 }}>
        <p className="mb-0 text-[8px] font-black uppercase leading-3 text-cyan-700">- Try It Yourself</p>
        <div className="grid gap-3 lg:grid-cols-[1fr_1.55fr_.8fr]">
          <div className="text-[9px] text-slate-700">
            <p className="font-bold">Copy the distance AB to point C.</p>
            {['Measure AB.', 'Copy this distance at C.', 'Mark the new point D on the arc.', 'Verify CD = AB.'].map((item, index) => <p key={item} className="mt-3"><b className="mr-2 rounded-full bg-blue-100 px-1.5 py-1 text-blue-700">{index + 1}</b>{item}</p>)}
          </div>
          <PracticeCanvas point={practicePoint} visible={practiceStarted} drag={drag} onDrag={setDrag} onPoint={(point) => { setPracticePoint(point); setPracticeStarted(true); setPracticeChecked(false); onInteraction(); }} />
          <div className="rounded-lg border border-slate-200 p-3 text-[9px]">
            <p className="font-bold">Measure AB</p><p className="mt-2 font-serif text-[13px]">AB = &nbsp; <b>4.00</b> units</p>
            <hr className="my-1" /><p className="font-bold">Your result</p><p className="mt-1 font-serif text-[13px]">CD = &nbsp; <b>{practiceDistance.toFixed(2)}</b> units</p>
            <button type="button" className="mt-2 w-full rounded-md bg-cyan-600 py-1.5 text-[9px] font-bold text-white" onClick={() => { setPracticeChecked(true); onInteraction(); }}><Check className="mr-1 inline h-3 w-3" />Check</button>
            <button type="button" className="mt-1 w-full text-[9px] text-cyan-700" onClick={() => { setPracticePoint({ x: 3, y: 3 }); setPracticeStarted(false); setPracticeChecked(false); onInteraction(); }}><RotateCcw className="mr-1 inline h-3 w-3" />Reset</button>
            {practiceChecked && <p role="status" className={`mt-2 text-center font-bold ${practiceCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>{practiceCorrect ? 'Correct - CD = AB.' : 'Move D onto the radius-4 arc.'}</p>}
          </div>
        </div>
      </section>

      <nav className="grid grid-cols-2 gap-3" style={{ marginTop: 8 }} aria-label="Adjacent lessons">
        <a href="/lessons/geometry/220-circle-through-three-points" className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 text-[9px] shadow-sm">
          <ArrowLeft className="h-4 w-4" /><span><b className="block text-[7px] uppercase text-slate-500">Previous</b>Circle Through Three Points</span>
        </a>
        <a href="/lessons/geometry/222-semicircle" className="flex h-12 items-center justify-end gap-3 rounded-lg border border-slate-200 bg-white px-4 text-right text-[9px] shadow-sm">
          <span><b className="block text-[7px] uppercase text-slate-500">Next</b>Semicircle</span><ArrowRight className="h-4 w-4" />
        </a>
      </nav>
    </section>
  );
}

function CompassCanvas(props: { center: Point; radius: number; radiusPoint: Point; showCircle: boolean; showRadius: boolean; tool: Tool; drag: Drag; snap: boolean; onDrag: (drag: Drag) => void; onCenter: (point: Point) => void; onRadius: (radius: number) => void }) {
  const toPoint = (event: ReactPointerEvent<SVGSVGElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    return { x: -7 + ((event.clientX - box.left) / box.width) * 14, y: 5 - ((event.clientY - box.top) / box.height) * 10 };
  };
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!props.drag) return;
    const point = toPoint(event);
    if (props.drag === 'center') props.onCenter(point);
    if (props.drag === 'radius') props.onRadius(Math.hypot(point.x - props.center.x, point.y - props.center.y));
  };
  const click = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (props.tool === 'point' || props.tool === 'circle' || props.tool === 'copy') props.onCenter(toPoint(event));
  };
  return <svg aria-label="Interactive compass plane with draggable center and opening" className="h-[322px] w-full touch-none rounded-lg border border-slate-200 bg-white" viewBox="0 0 700 500" onPointerMove={move} onPointerUp={() => props.onDrag(null)} onPointerCancel={() => props.onDrag(null)} onPointerDown={click}>
    <defs><pattern id="compass-grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#dce8f4" strokeWidth="1" /></pattern></defs>
    <rect width="700" height="500" fill="url(#compass-grid)" /><line x1="0" y1="250" x2="700" y2="250" stroke="#64748b" /><line x1="350" y1="0" x2="350" y2="500" stroke="#64748b" />
    {[-6,-4,-2,2,4,6].map(x => <text key={`x${x}`} x={350+x*50} y="270" textAnchor="middle" fontSize="12" fill="#334155">{x}</text>)}
    {[-4,-2,2,4].map(y => <text key={`y${y}`} x="338" y={254-y*50} textAnchor="end" fontSize="12" fill="#334155">{y}</text>)}
    {props.showCircle && <circle cx={350+props.center.x*50} cy={250-props.center.y*50} r={props.radius*50} fill="none" stroke="#2583ff" strokeWidth="2" strokeDasharray="7 5" />}
    {props.showRadius && <line x1={350+props.center.x*50} y1={250-props.center.y*50} x2={350+props.radiusPoint.x*50} y2={250-props.radiusPoint.y*50} stroke="#475569" strokeWidth="2" />}
    <CompassInstrument center={props.center} radius={props.radius} />
    <circle data-testid="compass-center-point" cx={350+props.center.x*50} cy={250-props.center.y*50} r="8" fill="#0759a5" className="cursor-move" onPointerDown={(event) => { event.stopPropagation(); event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId); props.onDrag('center'); }} />
    <circle data-testid="compass-radius-handle" cx={350+props.radiusPoint.x*50} cy={250-props.radiusPoint.y*50} r="9" fill="#0891b2" className="cursor-ew-resize" onPointerDown={(event) => { event.stopPropagation(); event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId); props.onDrag('radius'); }} />
    <text x={363+props.center.x*50} y={254-props.center.y*50} fontSize="13" fill="#0f172a">B ({format(props.center.x)}, {format(props.center.y)})</text>
  </svg>;
}

function CompassInstrument({ center, radius }: { center: Point; radius: number }) {
  const cx = 350 + center.x * 50, cy = 250 - center.y * 50, right = cx + radius * 50;
  const topX = (cx + right) / 2, topY = cy - Math.min(180, 75 + radius * 24);
  return <g aria-label="Compass instrument">
    <line x1={topX} y1={topY} x2={cx} y2={cy} stroke="#a3a3a3" strokeWidth="11" strokeLinecap="round" />
    <line x1={topX} y1={topY} x2={right} y2={cy} stroke="#9ca3af" strokeWidth="11" strokeLinecap="round" />
    <line x1={right-10} y1={cy-35} x2={right} y2={cy} stroke="#0785a7" strokeWidth="13" />
    <line x1={topX} y1={topY-30} x2={topX} y2={topY+5} stroke="#08789b" strokeWidth="9" strokeLinecap="round" />
    <circle cx={topX} cy={topY} r="13" fill="#08789b" /><circle cx={topX} cy={topY} r="4" fill="#f97316" />
  </g>;
}

function PracticeCanvas({ point, visible, drag, onDrag, onPoint }: { point: Point; visible: boolean; drag: Drag; onDrag: (drag: Drag) => void; onPoint: (point: Point) => void }) {
  const move = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (drag !== 'practice') return;
    const box = event.currentTarget.getBoundingClientRect();
    onPoint({ x: clamp(-6 + ((event.clientX-box.left)/box.width)*12, -5.5, 5.5), y: clamp(4 - ((event.clientY-box.top)/box.height)*8, -3.5, 3.5) });
  };
  return <svg aria-label="Compass distance transfer practice plane" className="h-[160px] w-full touch-none rounded-lg border border-slate-200" viewBox="0 0 480 240" onPointerMove={move} onPointerUp={() => onDrag(null)}>
    <defs><pattern id="practice-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#e3edf6" /></pattern></defs><rect width="480" height="240" fill="url(#practice-grid)" /><line x1="0" y1="120" x2="480" y2="120" stroke="#64748b" /><line x1="240" y1="0" x2="240" y2="240" stroke="#64748b" />
    <circle cx="120" cy="90" r="6" fill="#0759a5" /><text x="86" y="75" fontSize="13">A (-3, 1)</text><circle cx="360" cy="90" r="6" fill="#0759a5" /><text x="365" y="75" fontSize="13">B (3, 1)</text><circle cx="360" cy="150" r="6" fill="#7c3aed" /><text x="365" y="170" fontSize="13">C (3, -1)</text>
    <circle cx={240+point.x*40} cy={120-point.y*30} r="8" fill="#f97316" opacity={visible ? 1 : 0} className="cursor-move" data-testid="compass-practice-point-d" onPointerDown={(event) => { event.currentTarget.ownerSVGElement?.setPointerCapture(event.pointerId); onDrag('practice'); }} />{visible && <text x={250+point.x*40} y={116-point.y*30} fontSize="12">D</text>}
  </svg>;
}

function ToolButton({ active=false, label, icon, onClick }: { active?: boolean; label: string; icon: React.ReactNode; onClick: () => void }) { return <button type="button" aria-pressed={active} className={`flex h-9 items-center gap-2 rounded-md border px-3 text-[9px] font-bold ${active ? 'border-cyan-500 bg-cyan-50 text-cyan-700' : 'border-slate-200 bg-white text-slate-700'}`} onClick={() => { onClick(); }}>{cloneSized(icon)}{label}</button>; }
function Panel({ title, children }: { title: string; children: React.ReactNode }) { return <section className="rounded-xl border border-slate-200 bg-white p-3"><h2 className="mb-3 text-[8px] font-black uppercase text-cyan-700">- {title}</h2>{children}</section>; }
function InfoCard({ id, title, children }: { id: string; title: string; children: React.ReactNode }) { return <section id={id} className="min-h-[265px] rounded-xl border border-slate-200 bg-white p-3 text-[9px] leading-4 text-slate-700 shadow-sm"><h2 className="mb-2 text-[8px] font-black uppercase text-cyan-700">- {title}</h2><div className="space-y-2">{children}</div></section>; }
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label className="mt-3 flex items-center justify-between text-[9px]"><span>{label}</span><input type="checkbox" className="h-4 w-8 accent-cyan-600" checked={checked} onChange={(event) => onChange(event.target.checked)} /></label>; }
function Coordinate({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label className="text-[8px] font-bold">{label}<input aria-label={`Center ${label}`} className="mt-1 w-full rounded border px-2 py-1 text-[10px]" type="number" min="-5" max="5" step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>; }
function ResultLine({ children }: { children: React.ReactNode }) { return <p className="mb-2 flex items-start gap-2 text-[9px] text-slate-700"><Check className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full bg-emerald-50 p-0.5 text-emerald-600" />{children}</p>; }
function Formula({ children }: { children: React.ReactNode }) { return <div className="rounded-md border border-slate-300 bg-slate-50 px-3 py-2 text-center font-serif text-[11px]">{children}</div>; }
function MathBox({ children }: { children: React.ReactNode }) { return <p className="mx-auto w-fit rounded-md border border-purple-400 px-3 py-1 font-serif text-[14px] italic">{children}</p>; }
function Steps() { return <div>{['Set the center at a point B.', 'Open the compass to radius r.', 'Draw an arc or circle.', 'Without changing the opening, place the compass at a new point A.', 'Draw an arc. It will have the same radius r.'].map((text, index) => <p key={text} className="mt-2 flex gap-2"><b className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-cyan-600 text-[8px] text-white">{index+1}</b>{text}</p>)}</div>; }
function MiniTransfer() { return <svg className="mt-1 h-16 w-full" viewBox="0 0 240 70"><circle cx="65" cy="36" r="30" fill="none" stroke="#2583ff" strokeDasharray="4 4" /><circle cx="175" cy="36" r="30" fill="none" stroke="#7c3aed" strokeDasharray="4 4" /><line x1="65" y1="36" x2="85" y2="13" stroke="#64748b" /><line x1="175" y1="36" x2="195" y2="13" stroke="#64748b" /><circle cx="65" cy="36" r="3" fill="#0759a5" /><circle cx="175" cy="36" r="3" fill="#7c3aed" /><text x="60" y="54" fontSize="9">B</text><text x="170" y="54" fontSize="9">A</text></svg>; }
function MiniCircle() { return <svg className="mx-auto h-[90px] w-full" viewBox="0 0 180 100"><circle cx="90" cy="55" r="38" fill="none" stroke="#7c3aed" strokeDasharray="4 4" /><line x1="90" y1="55" x2="120" y2="28" stroke="#334155" /><circle cx="90" cy="55" r="4" fill="#0759a5" /><circle cx="120" cy="28" r="4" fill="#2563eb" /><text x="67" y="72" fontSize="10">B (x1, y1)</text><text x="125" y="24" fontSize="10">P (x2, y2)</text></svg>; }
function CompassMark() { return <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="2" /><path d="m11 7-5 13M13 7l5 13M8 15h8" /></svg>; }
function cloneSized(node: React.ReactNode) { return <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{node}</span>; }
function clamp(value: number, min: number, max: number) { return Math.min(max, Math.max(min, value)); }
function format(value: number) { return Number(value.toFixed(1)).toString(); }

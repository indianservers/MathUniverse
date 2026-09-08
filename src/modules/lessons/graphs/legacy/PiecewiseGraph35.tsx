import type {PointerEvent as ReactPointerEvent} from "react";
export function PiecewiseGraph({ x, value, onProbe }: { x: number; value: number; onProbe: (event: ReactPointerEvent<SVGSVGElement>) => void }) {
  const px = (input: number) => 250 + input * 33;
  const py = (input: number) => 180 - input * 27;
  return <svg
    className="piecewise-graph"
    viewBox="0 0 530 370"
    role="img"
    aria-label="Interactive piecewise function graph"
    onPointerDown={onProbe}
    onPointerMove={(event) => { if (event.buttons === 1) onProbe(event); }}
  >
    <defs><pattern id="piecewise-grid" width="33" height="27" patternUnits="userSpaceOnUse"><path d="M33 0H0V27" fill="none" stroke="#e9eef3" strokeWidth="1" /></pattern></defs>
    <rect x="10" y="10" width="500" height="340" fill="url(#piecewise-grid)" />
    <line x1="10" y1="180" x2="515" y2="180" className="axis" /><path d="M515 180l-9-5v10z" />
    <line x1="250" y1="350" x2="250" y2="5" className="axis" /><path d="M250 5l-5 9h10z" />
    {[-6,-4,-2,0,2,4,6].map((tick) => <g key={`x${tick}`}><line x1={px(tick)} y1="174" x2={px(tick)} y2="186" /><text x={px(tick)-8} y="201">{tick}</text></g>)}
    {[-6,-4,-2,2,4,6].map((tick) => <g key={`y${tick}`}><line x1="244" y1={py(tick)} x2="256" y2={py(tick)} /><text x="228" y={py(tick)+4}>{tick}</text></g>)}
    <text x="520" y="186" className="axis-label">x</text><text x="246" y="8" className="axis-label">y</text>
    <line x1={px(-7)} y1={py(-4)} x2={px(0)} y2={py(3)} className="left-branch" />
    <circle cx={px(0)} cy={py(3)} r="8" className="open-end" />
    <line x1={px(0)} y1={py(0)} x2={px(3.5)} y2={py(7)} className="right-branch" />
    <circle cx={px(0)} cy={py(0)} r="7" className="closed-end" />
    <text x="56" y="112" className="left-label">y = x + 3&nbsp; for x&lt;0</text>
    <text x="360" y="62" className="right-label">y = 2x&nbsp; for x&gt;=0</text>
    <line x1={px(x)} y1="180" x2={px(x)} y2={py(value)} className="probe-guide" />
    <circle cx={px(x)} cy={py(value)} r="7" className={x < 0 ? "probe left" : "probe right"} />
  </svg>;
}


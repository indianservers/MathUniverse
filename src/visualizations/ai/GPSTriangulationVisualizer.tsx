import { useState } from "react";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";
import { distance2D, roundTo } from "../../utils/math";

const satellites = [{ x: 70, y: 70 }, { x: 330, y: 90 }, { x: 210, y: 285 }];

export default function GPSTriangulationVisualizer() {
  const [x, setX] = useState(190);
  const [y, setY] = useState(170);
  return (
    <SectionCard title="GPS Triangulation Visualizer" description="GPS estimates location using distances from multiple satellites and geometry.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <SliderControl label="User x" value={x} min={50} max={350} step={1} onChange={setX} />
          <SliderControl label="User y" value={y} min={50} max={300} step={1} onChange={setY} />
          <div className="grid gap-2 text-sm">{satellites.map((sat, i) => <div key={i} className="rounded-2xl bg-slate-100 p-3 dark:bg-white/10">Satellite {i + 1}: {roundTo(distance2D(x, y, sat.x, sat.y), 1)} units</div>)}</div>
        </div>
        <div className="rounded-2xl bg-white p-3 dark:bg-slate-950/60">
          <svg viewBox="0 0 420 340" className="h-[360px] w-full">
            <rect x="20" y="20" width="380" height="300" rx="24" fill="rgba(34,211,238,.08)" />
            {satellites.map((sat, i) => <g key={i}><circle cx={sat.x} cy={sat.y} r={distance2D(x, y, sat.x, sat.y)} fill="none" stroke={["#22d3ee", "#8b5cf6", "#f59e0b"][i]} strokeOpacity=".32" strokeWidth="3" /><circle cx={sat.x} cy={sat.y} r="9" fill={["#22d3ee", "#8b5cf6", "#f59e0b"][i]} /><text x={sat.x + 10} y={sat.y - 10} fill="#64748b">S{i + 1}</text></g>)}
            <circle cx={x} cy={y} r="10" fill="#ef4444" /><text x={x + 12} y={y - 12} fill="#ef4444" fontWeight="700">You</text>
          </svg>
        </div>
      </div>
    </SectionCard>
  );
}

import { useEffect, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { complexMultiply, complexToPolar, eulerPoint, type Complex } from "../../../utils/complex";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";

const sx = (x: number) => 300 + x * 46; const sy = (y: number) => 180 - y * 46;
export default function ComplexLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [real, setReal] = useState(2); const [imaginary, setImaginary] = useState(1); const [angle, setAngle] = useState(45);
  useEffect(() => { setReal(2); setImaginary(1); setAngle(45); }, [resetToken]);
  const z: Complex = { a: real, b: imaginary }; const multiplier = eulerPoint(angle * Math.PI / 180); const product = complexMultiply(z, multiplier); const polar = complexToPolar(real, imaginary);
  const shown = /multiply|rotation|euler|polar|argument|root/i.test(lesson.title) ? product : z;
  const update = (setter: (value: number) => void) => (value: number) => { setter(value); onInteraction(); };
  return <AdapterFrame title={`${lesson.title} · complex plane`} value={`${shown.a.toFixed(2)} ${shown.b >= 0 ? "+" : "−"} ${Math.abs(shown.b).toFixed(2)}i`} footer="Modulus, argument, Euler point, and multiplication are computed by the existing complex-number engine.">
    <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]"><div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900"><svg viewBox="0 0 600 360" className="h-[310px] w-full" role="img" aria-label="Interactive complex plane"><Grid /><line x1="300" y1="180" x2={sx(z.a)} y2={sy(z.b)} stroke="#94a3b8" strokeWidth="3" strokeDasharray="7 5" /><line x1="300" y1="180" x2={sx(product.a)} y2={sy(product.b)} stroke="#06b6d4" strokeWidth="4" /><circle cx={sx(z.a)} cy={sy(z.b)} r="7" fill="#94a3b8" /><circle cx={sx(product.a)} cy={sy(product.b)} r="8" fill="#06b6d4" /><text x={sx(product.a)+10} y={sy(product.b)-8} fill="#0891b2" fontWeight="900">z·eⁱᶿ</text></svg></div><div className="space-y-3"><SliderGroup title="Complex input"><SliderControl density="compact" label="Real" value={real} min={-5} max={5} step={.25} onChange={update(setReal)} /><SliderControl density="compact" label="Imaginary" value={imaginary} min={-3} max={3} step={.25} onChange={update(setImaginary)} /><SliderControl density="compact" label="Rotation θ" value={angle} min={-180} max={180} step={1} unit="°" onChange={update(setAngle)} /></SliderGroup><div className="grid grid-cols-2 gap-2"><Metric label="|z|" value={polar.r.toFixed(3)} /><Metric label="arg z" value={`${(polar.theta*180/Math.PI).toFixed(1)}°`} /><Metric label="Product Re" value={product.a.toFixed(3)} /><Metric label="Product Im" value={product.b.toFixed(3)} /></div></div></div>
  </AdapterFrame>;
}
function Grid() { return <g>{Array.from({length:13},(_,i)=><line key={`v${i}`} x1={i*46+24} x2={i*46+24} y1="0" y2="360" stroke="#cbd5e1" opacity=".3"/>)}{Array.from({length:9},(_,i)=><line key={`h${i}`} x1="0" x2="600" y1={i*46-4} y2={i*46-4} stroke="#cbd5e1" opacity=".3"/>)}<line x1="0" x2="600" y1="180" y2="180" stroke="#64748b"/><line x1="300" x2="300" y1="0" y2="360" stroke="#64748b"/></g>; }
function Metric({label,value}:{label:string;value:string}) { return <div className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">{label}</span><strong className="font-mono text-xs">{value}</strong></div>; }

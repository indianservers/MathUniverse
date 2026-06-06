import { motion } from "framer-motion";
import { useState } from "react";
import FormulaBlock from "../../components/ui/FormulaBlock";
import SectionCard from "../../components/ui/SectionCard";
import SliderControl from "../../components/ui/SliderControl";

const layers: Array<[number, number[]]> = [[70, [85, 150, 215]], [220, [60, 120, 180, 240]], [370, [120, 200]]];

export default function NeuralNetworkVisualizer() {
  const [intensity, setIntensity] = useState(1);
  const lines = layers[0][1].flatMap((y1) => layers[1][1].map((y2) => [layers[0][0], y1, layers[1][0], y2] as const)).concat(layers[1][1].flatMap((y1) => layers[2][1].map((y2) => [layers[1][0], y1, layers[2][0], y2] as const)));

  return (
    <SectionCard title="Neural Network Visualizer" description="A neural network uses matrix multiplication, weighted sums, activation functions, and optimization.">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="space-y-4">
          <FormulaBlock title="Layer Formula" formula="output=activation(Wx+b)" />
          <SliderControl label="Weight intensity / speed" value={intensity} min={0.5} max={3} step={0.1} onChange={setIntensity} />
          <div className="rounded-2xl bg-slate-100 p-4 text-sm dark:bg-white/10">
            <p className="font-mono">x = [x1, x2, x3]</p>
            <p className="mt-2 font-mono">W = 4 x 3 weight matrix</p>
            <p className="mt-2 font-mono">b = learned bias vector</p>
          </div>
        </div>
        <div className="rounded-xl bg-slate-950 p-4 shadow-inner shadow-cyan-950/30">
          <svg viewBox="0 0 440 300" className="h-[340px] w-full">
            <defs>
              <radialGradient id="neural-bg" cx="50%" cy="45%" r="72%">
                <stop offset="0%" stopColor="#12395a" stopOpacity="0.72" />
                <stop offset="56%" stopColor="#07182d" stopOpacity="0.94" />
                <stop offset="100%" stopColor="#020617" />
              </radialGradient>
              <filter id="neural-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="2.5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            </defs>
            <rect x="0" y="0" width="440" height="300" fill="url(#neural-bg)" />
            {lines.map(([x1, y1, x2, y2], index) => (
              <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#67e8f9" strokeOpacity={0.18 + 0.2 * intensity} strokeWidth={1 + intensity} />
            ))}
            {lines.slice(0, 10).map(([x1, y1, x2, y2], index) => (
              <motion.circle key={`pulse-${index}`} r="4" fill="#22d3ee" initial={{ cx: x1, cy: y1, opacity: 0 }} animate={{ cx: [x1, x2], cy: [y1, y2], opacity: [0, 1, 0] }} transition={{ duration: 2.2 / intensity, repeat: Infinity, delay: index * 0.11 }} />
            ))}
            {layers.map(([x, ys], layer) => (ys as number[]).map((y, index) => <circle key={`${layer}-${index}`} cx={x as number} cy={y} r="18" fill={layer === 0 ? "#22d3ee" : layer === 1 ? "#8b5cf6" : "#f59e0b"} stroke="#020617" strokeWidth="2" filter="url(#neural-glow)" />))}
            <text x="42" y="285" fill="#bae6fd">input</text><text x="186" y="285" fill="#bae6fd">hidden</text><text x="340" y="285" fill="#bae6fd">output</text>
          </svg>
        </div>
      </div>
    </SectionCard>
  );
}

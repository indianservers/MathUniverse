import { Activity, BrainCircuit, Camera, HeartPulse, Image, KeyRound, MapPin, Radar, Route, TrendingDown } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard";

const cards = [
  ["Neural networks", BrainCircuit, "Weighted sums and activations", "Pattern recognition"],
  ["Gradient descent", TrendingDown, "Derivatives and optimization", "Model training"],
  ["Signal processing", Activity, "Waves and frequency", "Audio and sensors"],
  ["Image compression", Image, "Matrices and approximations", "Storage and streaming"],
  ["GPS", MapPin, "Geometry and triangulation", "Navigation"],
  ["Cryptography", KeyRound, "Modular arithmetic", "Secure communication"],
  ["Robotics", Route, "Graphs and vectors", "Autonomous motion"],
  ["Computer graphics", Camera, "Linear algebra", "Rendering"],
  ["Radar systems", Radar, "Waves and timing", "Detection"],
  ["Medical imaging", HeartPulse, "Transforms and statistics", "Diagnostics"],
] as const;

export default function AIApplicationsGrid() {
  return (
    <SectionCard title="AI and Real-Life Applications">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map(([title, Icon, math, use]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white/70 p-4 transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
            <Icon className="h-6 w-6 text-cyan-500" />
            <h3 className="mt-3 font-bold">{title}</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{math}</p>
            <p className="mt-3 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold dark:bg-white/10">{use}</p>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}

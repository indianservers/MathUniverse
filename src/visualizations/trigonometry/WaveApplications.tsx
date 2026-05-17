import { Activity, Cpu, MapPin, Radio, Satellite, Volume2, Waves } from "lucide-react";
import SectionCard from "../../components/ui/SectionCard";

const cards = [
  ["Sound waves", Volume2, "Pitch and loudness are wave frequency and amplitude."],
  ["Electrical engineering", Cpu, "Alternating current is modeled with sinusoidal signals."],
  ["Radar systems", Radio, "Reflected waves reveal distance and motion."],
  ["GPS", Satellite, "Timing signals locate position on Earth."],
  ["Ocean waves", Waves, "Wave models predict tides, energy, and motion."],
  ["Signal processing", Activity, "Filters isolate useful frequencies from noise."],
  ["Neural frequency analysis", MapPin, "Models can learn patterns across frequency bands."],
] as const;

export default function WaveApplications() {
  return (
    <SectionCard title="Wave Applications">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, Icon, text]) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-3"><Icon className="h-5 w-5 text-cyan-500" /><h3 className="font-semibold">{title}</h3></div>
            <svg viewBox="0 0 120 28" className="mt-3 h-8 w-full"><path d="M0 14 C 15 0, 25 28, 40 14 S 65 0, 80 14 S 105 28, 120 14" fill="none" stroke="#06b6d4" strokeWidth="3" /></svg>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

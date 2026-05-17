import { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
};

export default function StatCard({ label, value, icon: Icon, accent }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-5 hover:-translate-y-0.5 hover:border-cyan-200/80 dark:hover:border-cyan-400/25">
      <div className="flex items-center gap-4">
        <div className={`rounded-2xl bg-gradient-to-br ${accent} p-3 text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}

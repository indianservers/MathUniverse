import { ReactNode } from "react";
import SectionCard from "./SectionCard";

type GraphCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function GraphCard({ title, description, children }: GraphCardProps) {
  return (
    <SectionCard title={title} description={description} className="min-w-0">
      <div className="h-[320px] min-h-[300px] min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950/60 sm:h-[360px] sm:p-3">
        {children}
      </div>
    </SectionCard>
  );
}

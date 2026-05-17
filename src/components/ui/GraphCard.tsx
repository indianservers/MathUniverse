import { ReactNode, useRef } from "react";
import SectionCard from "./SectionCard";
import VisualizationTools from "./VisualizationTools";

type GraphCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export default function GraphCard({ title, description, children }: GraphCardProps) {
  const exportRef = useRef<HTMLElement>(null);

  return (
    <section ref={exportRef} data-visualization-card>
      <SectionCard title={title} description={description} className="min-w-0">
        <VisualizationTools title={title} targetRef={exportRef}>
          <div className="h-[320px] min-h-[300px] min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 dark:border-white/10 dark:bg-slate-950/60 sm:h-[360px] sm:p-3">
            {children}
          </div>
        </VisualizationTools>
      </SectionCard>
    </section>
  );
}

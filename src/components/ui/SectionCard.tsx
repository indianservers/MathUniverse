import { ReactNode } from "react";
import { clsx } from "clsx";

type SectionCardProps = {
  id?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  compact?: boolean;
  headerAction?: ReactNode;
};

export default function SectionCard({ id, title, description, children, className, compact = false, headerAction }: SectionCardProps) {
  return (
    <section id={id} className={clsx("glass-card group/section relative overflow-hidden rounded-xl p-3 hover:border-cyan-200/80 dark:hover:border-cyan-400/25", compact ? "md:p-3" : "md:p-4", className)}>
      <div className="gradient-line absolute left-0 top-0 w-full" />
      {(title || description || headerAction) && (
        <div className={clsx("flex items-start gap-3", compact ? "mb-2" : "mb-3")}>
          <span className="mt-1.5 hidden h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50 sm:block" />
          <div className="min-w-0 flex-1">
            {title && <h2 className={clsx("break-words font-semibold text-slate-950 dark:text-white", compact ? "text-base" : "text-lg")}>{title}</h2>}
            {description && <p className={clsx("mt-0.5 max-w-4xl text-slate-600 dark:text-slate-300", compact ? "line-clamp-2 text-xs leading-5" : "text-sm leading-5")}>{description}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

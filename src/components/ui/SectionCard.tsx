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
  tone?: "default" | "spotlight";
};

export default function SectionCard({ id, title, description, children, className, compact = false, headerAction, tone = "default" }: SectionCardProps) {
  const spotlight = tone === "spotlight";
  return (
    <section
      id={id}
      className={clsx(
        "group/section relative overflow-hidden rounded-xl p-3",
        spotlight
          ? "spotlight-card border border-cyan-200/30 bg-slate-950 text-white shadow-2xl shadow-cyan-950/20"
          : "glass-card hover:border-cyan-200/80 dark:hover:border-cyan-400/25",
        compact ? "md:p-3" : "md:p-4",
        className
      )}
    >
      <div className={clsx("absolute left-0 top-0 w-full", spotlight ? "h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" : "gradient-line")} />
      {(title || description || headerAction) && (
        <div className={clsx("flex items-start gap-3", compact ? "mb-2" : "mb-3")}>
          <span className={clsx("mt-1.5 hidden h-1.5 w-1.5 shrink-0 rounded-full shadow-sm sm:block", spotlight ? "bg-cyan-200 shadow-cyan-200/50" : "bg-cyan-400 shadow-cyan-400/50")} />
          <div className="min-w-0 flex-1">
            {title && <h2 className={clsx("break-words font-semibold", spotlight ? "text-white" : "text-slate-950 dark:text-white", compact ? "text-base" : "text-lg")}>{title}</h2>}
            {description && <p className={clsx("mt-0.5 max-w-4xl", spotlight ? "text-cyan-50/80" : "text-slate-600 dark:text-slate-300", compact ? "line-clamp-2 text-xs leading-5" : "text-sm leading-5")}>{description}</p>}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

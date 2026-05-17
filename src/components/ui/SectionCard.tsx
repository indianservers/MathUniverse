import { ReactNode } from "react";
import { clsx } from "clsx";

type SectionCardProps = {
  id?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export default function SectionCard({ id, title, description, children, className }: SectionCardProps) {
  return (
    <section id={id} className={clsx("glass-card group/section relative overflow-hidden rounded-2xl p-5 md:p-6 hover:border-cyan-200/80 dark:hover:border-cyan-400/25", className)}>
      <div className="gradient-line absolute left-0 top-0 w-full" />
      {(title || description) && (
        <div className="mb-5 flex items-start gap-3">
          <span className="mt-2 hidden h-2 w-2 shrink-0 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50 sm:block" />
          <div className="min-w-0">
            {title && <h2 className="break-words text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>}
            {description && <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>}
          </div>
        </div>
      )}
      {children}
    </section>
  );
}

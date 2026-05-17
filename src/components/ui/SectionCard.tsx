import { ReactNode } from "react";
import { clsx } from "clsx";

type SectionCardProps = {
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
};

export default function SectionCard({ title, description, children, className }: SectionCardProps) {
  return (
    <section className={clsx("glass-card rounded-2xl p-5 md:p-6", className)}>
      {(title || description) && (
        <div className="mb-5">
          {title && <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>}
          {description && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>}
        </div>
      )}
      {children}
    </section>
  );
}

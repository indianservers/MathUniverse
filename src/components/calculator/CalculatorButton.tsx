type CalculatorButtonProps = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "accent" | "danger";
  title?: string;
};

const variants = {
  primary: "bg-slate-950 text-white hover:bg-cyan-600 dark:bg-white dark:text-slate-950 dark:hover:bg-cyan-200",
  secondary: "bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
  accent: "bg-cyan-500 text-white hover:bg-cyan-600",
  danger: "bg-rose-500 text-white hover:bg-rose-600",
};

export default function CalculatorButton({ label, onClick, variant = "secondary", title }: CalculatorButtonProps) {
  return <button type="button" title={title ?? label} aria-label={title ?? label} onClick={onClick} className={`rounded-2xl px-3 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 ${variants[variant]}`}>{label}</button>;
}

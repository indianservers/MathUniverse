type MathLabelProps = {
  x: number;
  y: number;
  children: string;
  tone?: "cyan" | "amber" | "emerald" | "slate";
};

const toneClass = {
  cyan: "fill-cyan-700 dark:fill-cyan-100",
  amber: "fill-amber-700 dark:fill-amber-100",
  emerald: "fill-emerald-700 dark:fill-emerald-100",
  slate: "fill-slate-700 dark:fill-slate-100",
};

export default function MathLabel({ x, y, children, tone = "cyan" }: MathLabelProps) {
  return (
    <text x={x} y={y} className={`${toneClass[tone]} text-[15px] font-black`} textAnchor="middle">
      {children}
    </text>
  );
}

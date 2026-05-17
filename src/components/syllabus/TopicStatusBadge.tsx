import type { SyllabusStatus } from "../../data/syllabus";

const styles: Record<SyllabusStatus, string> = {
  available: "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200",
  mapped: "border-cyan-300 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200",
  future: "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200",
};

export default function TopicStatusBadge({ status }: { status: SyllabusStatus }) {
  const label = status === "available" ? "Available Lab" : status === "mapped" ? "Mapped Topic" : "Future Lab";
  return <span className={`rounded-full border px-3 py-1 text-xs font-bold ${styles[status]}`}>{label}</span>;
}

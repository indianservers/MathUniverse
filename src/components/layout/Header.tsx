import { Menu } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { TeacherModeToggle } from "../ui/UiFeedback";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-slate-50/82 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f]/82 md:px-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onMenuClick}
          className="tooltip-icon inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white lg:hidden"
          aria-label="Open navigation"
          data-tooltip="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 px-3 lg:px-0">
          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Interactive math lab</p>
          <p className="hidden truncate text-xs text-slate-500 dark:text-slate-400 sm:block">Visual explanations, simulations, and quizzes</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block"><TeacherModeToggle /></div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

import { Menu } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-slate-50/80 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-[#07111f]/80 md:px-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden lg:block">
          <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-300">Interactive math lab</p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}

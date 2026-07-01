import { Menu } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { TeacherModeToggle } from "../ui/UiFeedback";
import { AccessibilitySettings, CommandPalette, HeaderStats, KeyboardShortcutsPanel } from "./GlobalUx";

type HeaderProps = {
  mobileMenuOpen: boolean;
  onMenuClick: () => void;
};

export default function Header({ mobileMenuOpen, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/25 bg-[linear-gradient(90deg,rgba(7,24,39,0.88),rgba(13,38,58,0.84),rgba(42,40,90,0.78))] px-4 py-3 text-white shadow-xl shadow-cyan-950/10 backdrop-blur-2xl dark:border-white/10 md:px-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onMenuClick}
          className="tooltip-icon inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white shadow-sm transition hover:bg-white/15 lg:hidden"
          aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          data-tooltip={mobileMenuOpen ? "Close navigation" : "Open navigation"}
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0 px-3 lg:px-0">
          <p className="text-sm font-black text-cyan-100">Interactive Math Lab</p>
          <p className="hidden truncate text-xs font-semibold text-white/65 sm:block">Visual proofs, simulations, graphing, and practice</p>
        </div>
        <div className="flex items-center gap-1.5">
          <CommandPalette />
          <HeaderStats />
          <div className="hidden sm:block"><TeacherModeToggle /></div>
          <KeyboardShortcutsPanel />
          <AccessibilitySettings />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

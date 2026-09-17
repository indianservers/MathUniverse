import { useLocation } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import { TeacherModeToggle } from "../ui/UiFeedback";
import {
  AccessibilitySettings,
  CommandPalette,
  HeaderStats,
  KeyboardShortcutsPanel,
} from "./GlobalUx";

export default function Header() {
  const location = useLocation();
  const studioHasOwnTeacher = /^\/(?:discrete-world|geometry|trigonometry|linear-algebra)(?:\/|$)/.test(location.pathname);
  return (
    <header className="sticky top-0 z-30 border-b border-white/25 bg-[linear-gradient(105deg,rgba(3,105,161,0.94),rgba(67,56,202,0.92)_52%,rgba(147,51,234,0.9))] px-4 py-2 text-white shadow-xl shadow-indigo-950/20 backdrop-blur-2xl dark:border-white/10 md:px-8">
      <div className="flex items-center justify-between">
        <div className="min-w-0 pr-2">
          <p className="text-sm font-black text-cyan-100">
            Interactive Math Lab
          </p>
          <p className="hidden truncate text-xs font-semibold text-white/65 sm:block">
            Visual proofs, simulations, graphing, and practice
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <CommandPalette />
          <HeaderStats />
          {studioHasOwnTeacher ? null : (
            <div className="hidden sm:block [&>button]:!min-h-10 [&>button]:!whitespace-nowrap [&>button]:!rounded-xl [&>button]:!px-3 [&>button]:!py-2 [&>button]:!text-xs">
              <TeacherModeToggle />
            </div>
          )}
          {studioHasOwnTeacher ? null : <KeyboardShortcutsPanel />}
          <AccessibilitySettings />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

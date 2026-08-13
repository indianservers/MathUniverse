import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import MobileNav from "./MobileNav";
import Sidebar from "./Sidebar";

type MainNavigationProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

/** The canonical application navigation for full-page labs and visualizers. */
export default function MainNavigation({ mobileOpen, onClose }: MainNavigationProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = mobileOpen ?? internalOpen;

  useEffect(() => {
    if (mobileOpen !== undefined) return;
    const handleOpen = () => setInternalOpen(true);
    document.addEventListener("open-main-navigation", handleOpen);
    return () => document.removeEventListener("open-main-navigation", handleOpen);
  }, [mobileOpen]);

  return (
    <>
      <Sidebar />
      {mobileOpen === undefined && (
        <button
          type="button"
          onClick={() => setInternalOpen(true)}
          className="fixed left-2 top-2 z-[70] grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/40 bg-slate-950/90 text-cyan-100 shadow-xl backdrop-blur lg:hidden"
          aria-label="Open main menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      )}
      <MobileNav open={open} onClose={onClose ?? (() => setInternalOpen(false))} />
    </>
  );
}

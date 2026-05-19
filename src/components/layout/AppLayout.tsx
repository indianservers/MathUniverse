import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import MobileNav from "./MobileNav";
import MobileLearningDock from "./MobileLearningDock";
import Sidebar from "./Sidebar";
import { BackToPreviousButton } from "../ui/UiFeedback";
import { navItems } from "./navItems";
import { BackToTopButton, BreadcrumbTrail } from "./GlobalUx";

const recentToolsKey = "math-universe-recent-tools";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const showBack = location.pathname.split("/").filter(Boolean).length > 1;

  useEffect(() => {
    const currentRoute = navItems.find((item) => !item.isExternal && item.route === location.pathname)?.route;
    if (!currentRoute) return;
    try {
      const current = JSON.parse(localStorage.getItem(recentToolsKey) ?? "[]");
      const list = Array.isArray(current) ? current.filter((item): item is string => typeof item === "string") : [];
      localStorage.setItem(recentToolsKey, JSON.stringify([currentRoute, ...list.filter((item) => item !== currentRoute)].slice(0, 8)));
    } catch {
      localStorage.setItem(recentToolsKey, JSON.stringify([currentRoute]));
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_34%)]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-2xl focus:bg-slate-950 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white dark:focus:bg-white dark:focus:text-slate-950">Skip to content</a>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="min-w-0 flex-1">
          <Header onMenuClick={() => setMobileOpen(true)} />
          <main id="main-content" className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-5 md:px-8 md:py-8">
            <div key={location.pathname} className="page-transition space-y-4">
              <BreadcrumbTrail />
              {showBack && <BackToPreviousButton label="Back" />}
              <Outlet />
            </div>
          </main>
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <MobileLearningDock />
      <BackToTopButton />
    </div>
  );
}

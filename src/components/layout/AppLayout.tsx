import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import MobileNav from "./MobileNav";
import MobileLearningDock from "./MobileLearningDock";
import Sidebar from "./Sidebar";
import { navItems } from "./navItems";
import { BackToTopButton, BreadcrumbTrail, UndoToastHost } from "./GlobalUx";
import { ArrowLeft, Github, Mail, Map, Maximize2, Minimize2, Sparkles } from "lucide-react";
import { APP_VERSION } from "../../appVersion";

function InlinePageNav({ showBack }: { showBack: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === "/") return null;
  return (
    <div className="flex items-center gap-2">
      {showBack && (
        <button type="button" onClick={() => navigate(-1)} className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300" aria-label="Go back">
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
      )}
      <BreadcrumbTrail />
    </div>
  );
}

const recentToolsKey = "math-universe-recent-tools";

function AppFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mx-auto w-full max-w-[1440px] px-3 pb-24 pt-3 sm:px-4 md:px-5 md:pb-8" aria-label="Site footer">
      <div className="rounded-xl border border-slate-200 bg-white/78 p-4 text-sm shadow-xl shadow-slate-200/45 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 dark:shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="flex items-center gap-2 font-black text-slate-950 dark:text-white">
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Math Universe
            </p>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600 dark:text-slate-300">
              Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a className="action-secondary" href="/sitemap"><Map className="h-4 w-4" />Sitemap</a>
            <a className="action-secondary" href="/documentation"><Github className="h-4 w-4" />Docs</a>
            <a className="action-secondary" href="/about"><Mail className="h-4 w-4" />About</a>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-[11px] font-bold uppercase text-slate-500 dark:border-white/10 dark:text-slate-400">
          <span>Version {APP_VERSION}</span>
          <span>&copy; {year} Math Universe</span>
        </div>
      </div>
    </footer>
  );
}

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mainFullscreen, setMainFullscreen] = useState(false);
  const mainContentRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const showBack = location.pathname.split("/").filter(Boolean).length > 1;
  const isWorkspaceRoute = location.pathname === "/workspace" || location.pathname.startsWith("/workspace/");

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onFullscreenChange = () => setMainFullscreen(document.fullscreenElement === mainContentRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleMainFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await mainContentRef.current?.requestFullscreen?.();
  };

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

  if (isWorkspaceRoute) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_34%)]">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-2xl focus:bg-slate-950 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white dark:focus:bg-white dark:focus:text-slate-950">Skip to content</a>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <main ref={mainContentRef} id="main-content" className="app-fullscreen-target min-h-screen w-full p-2">
              <div key={location.pathname} className="page-transition min-h-screen">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <MobileLearningDock />
        <div className="fixed bottom-3 left-3 z-40 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-black text-slate-500 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-300 lg:bottom-4">
          v{APP_VERSION}
        </div>
        <UndoToastHost />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_34%)]">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-2xl focus:bg-slate-950 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white dark:focus:bg-white dark:focus:text-slate-950">Skip to content</a>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header mobileMenuOpen={mobileOpen} onMenuClick={() => setMobileOpen((value) => !value)} />
          <main
            ref={mainContentRef}
            id="main-content"
            className="app-fullscreen-target mx-auto w-full max-w-[1440px] flex-1 px-3 pb-6 pt-3 sm:px-4 md:px-5 md:pt-4"
          >
            <button
              type="button"
              onClick={() => void toggleMainFullscreen()}
              className="app-fullscreen-button"
              title={mainFullscreen ? "Exit full screen" : "Full screen this module"}
              aria-label={mainFullscreen ? "Exit full screen" : "Full screen this module"}
            >
              {mainFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span>{mainFullscreen ? "Exit" : "Full"}</span>
            </button>
            <div key={location.pathname} className="page-transition space-y-2.5">
              <InlinePageNav showBack={showBack} />
              <Outlet />
            </div>
          </main>
          <AppFooter />
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <MobileLearningDock />
      <div className="fixed bottom-3 left-3 z-40 rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-[11px] font-black text-slate-500 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-950/80 dark:text-slate-300 lg:bottom-4">
        v{APP_VERSION}
      </div>
      <BackToTopButton />
      <UndoToastHost />
    </div>
  );
}

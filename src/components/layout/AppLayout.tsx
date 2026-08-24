import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import MobileNav from "./MobileNav";
import MobileLearningDock from "./MobileLearningDock";
import Sidebar from "./Sidebar";
import { navItems } from "./navItems";
import { BackToTopButton, BreadcrumbTrail, UndoToastHost } from "./GlobalUx";
import {
  ArrowLeft,
  Github,
  Mail,
  Map,
  Maximize2,
  Minimize2,
  Sparkles,
} from "lucide-react";
import MathWorkspaceLayout from "../workspace/MathWorkspaceLayout";
import { findMathWorkspace } from "../../workspace/mathWorkspaces";

function InlinePageNav({ showBack }: { showBack: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === "/") return null;
  return (
    <div className="flex items-center gap-2">
      {showBack && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-300 hover:text-cyan-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
          aria-label="Go back"
        >
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
  const location = useLocation();
  const isRightTriangleTarget =
    location.pathname === "/lessons/trigonometry/259-right-triangle-ratios";
  const isTangentTarget = location.pathname === "/lessons/geometry/212-tangent";
  const isTriangleConstructorTarget =
    location.pathname === "/lessons/geometry/214-triangle-constructor";
  const isRegularPolygonTarget =
    location.pathname === "/lessons/geometry/215-regular-polygon";
  const isRigidPolygonTarget =
    location.pathname === "/lessons/geometry/216-rigid-polygon";
  const isCompassTarget = location.pathname === "/lessons/geometry/221-compass";
  const isSemicircleTarget =
    location.pathname === "/lessons/geometry/222-semicircle";
  const isCircularArcTarget =
    location.pathname === "/lessons/geometry/223-circular-arc";
  const isCircumcircularArcTarget =
    location.pathname === "/lessons/geometry/224-circumcircular-arc";
  const isCircularSectorTarget =
    location.pathname === "/lessons/geometry/225-circular-sector";
  const isConicFiveTarget =
    location.pathname === "/lessons/geometry/226-conic-through-five-points";
  const isEllipseTarget = location.pathname === "/lessons/geometry/227-ellipse";
  const isHyperbolaTarget = location.pathname === "/lessons/geometry/228-hyperbola";
  const isParabolaTarget = location.pathname === "/lessons/geometry/229-parabola";
  const isDistanceTarget =
    location.pathname === "/lessons/geometry/230-distance-length";
  const isAreaTarget = location.pathname === "/lessons/geometry/231-area";
  const isAngleTarget = location.pathname === "/lessons/geometry/232-angle";
  const isFixedAngleTarget =
    location.pathname === "/lessons/geometry/233-fixed-angle";
  const isRelationTarget =
    location.pathname === "/lessons/geometry/234-relation-checker";
  const isStepsTarget =
    location.pathname === "/lessons/geometry/235-construction-steps";
  const isTranslationTarget =
    location.pathname === "/lessons/geometry/236-translation-by-vector";
  const isReflectionTarget =
    location.pathname === "/lessons/geometry/237-reflection-in-line";
  const isPointReflectionTarget =
    location.pathname === "/lessons/geometry/238-reflection-in-point";
  const isCircleReflectionTarget =
    location.pathname === "/lessons/geometry/239-reflection-in-circle";
  const isGeneralPolygonTarget =
    location.pathname === "/lessons/geometry/217-general-polygon";
  const isCircleCentreRadiusTarget =
    location.pathname === "/lessons/geometry/219-circle-centre-and-radius";
  if (isAreaTarget || isFixedAngleTarget || isTranslationTarget || isReflectionTarget) return null;
  if (isRelationTarget) {
    return (
      <footer className="mx-auto h-[99px] w-full max-w-[1440px] px-[13px] pt-1" aria-label="Site footer">
        <div className="relative h-[92px] rounded-lg border border-slate-200 bg-white/80 px-4 py-3 shadow-sm">
          <p className="flex items-center gap-2 text-[10px] font-black text-slate-950">
            <Sparkles className="h-4 w-4 text-cyan-500" /> Math Universe
          </p>
          <p className="mt-1 max-w-[500px] text-[7px] leading-3 text-slate-600">
            Interactive math labs, visual proofs, NCERT explorations, graphing,
            CAS-style tools, and classroom-ready activities.
          </p>
          <div className="absolute right-3 top-3 flex gap-2">
            <a className="target-geometry-action" href="/sitemap"><Map /> Sitemap</a>
            <a className="target-geometry-action" href="/documentation"><Github /> Docs</a>
            <a className="target-geometry-action" href="/about"><Mail /> About</a>
          </div>
          <p className="mt-2 text-[6px] font-bold uppercase text-slate-500">
            &copy; {year} Indian Servers Private Limited. No right to reproduce it.
          </p>
          <p className="mt-1 text-[6px] text-slate-500">
            www.IndianServers.com &nbsp;&nbsp; info@IndianServers.com
          </p>
        </div>
      </footer>
    );
  }
  if (isPointReflectionTarget || isCircleReflectionTarget) {
    return (
      <footer className={`mx-auto w-full max-w-[1440px] pt-0 ${isCircleReflectionTarget ? "h-[96px] pl-[10px] pr-[13px]" : "h-[118px] pl-[24px] pr-[19px]"}`} aria-label="Site footer">
        <div className={`relative rounded-lg border border-slate-200 bg-white/80 px-4 py-3 shadow-sm ${isCircleReflectionTarget ? "h-[88px]" : "h-[106px]"}`}>
          <p className="flex items-center gap-2 text-[10px] font-black text-slate-950"><Sparkles className="h-4 w-4 text-cyan-500" /> Math Universe</p>
          <p className="mt-1 max-w-[500px] text-[7px] leading-3 text-slate-600">Interactive math labs, visual proofs, NCERT explorations, graphing, CAS-style tools, and classroom-ready activities.</p>
          <div className="absolute right-4 top-3 flex gap-2"><a className="target-geometry-action" href="/sitemap"><Map /> Sitemap</a><a className="target-geometry-action" href="/documentation"><Github /> Docs</a><a className="target-geometry-action" href="/about"><Mail /> About</a></div>
          <p className="mt-3 border-t border-slate-200 pt-2 text-[6px] font-bold uppercase text-slate-500">&copy; {year} Indian Servers Private Limited. No rights to reproduce it.</p>
          <p className="mt-1 text-[6px] text-slate-500">www.IndianServers.com &nbsp;&nbsp; info@IndianServers.com</p>
        </div>
      </footer>
    );
  }
  const usesTargetCompactFooter =
    isRightTriangleTarget ||
    location.pathname === "/lessons/geometry/205-segment-with-given-length" ||
    (!isCircularArcTarget && !isCircumcircularArcTarget && !isCircularSectorTarget && !isEllipseTarget && !isParabolaTarget && !isDistanceTarget && !isAngleTarget && !isStepsTarget && ![
      "/lessons/geometry/210-perpendicular-bisector",
      "/lessons/geometry/212-tangent",
      "/lessons/geometry/214-triangle-constructor",
      "/lessons/geometry/215-regular-polygon",
      "/lessons/geometry/216-rigid-polygon",
    ].includes(location.pathname) &&
      /^\/lessons\/geometry\/2(?:0[6-9]|[12][0-9]|3[0-5])-/.test(
        location.pathname,
      ));
  const ultraCompact =
    location.pathname === "/lessons/geometry/201-midpoint-or-centre" ||
    isRightTriangleTarget;
  const compact =
    location.pathname === "/lessons/geometry/199-point-on-object" ||
    location.pathname === "/lessons/geometry/204-segment" ||
    ultraCompact;
  if (
    location.pathname === "/lessons/geometry/200-intersection-point" ||
    location.pathname === "/lessons/geometry/203-line-through-two-points" ||
    location.pathname === "/lessons/geometry/218-circle-centre-and-point" ||
    location.pathname === "/lessons/geometry/220-circle-through-three-points"
  )
    return null;
  if (usesTargetCompactFooter) {
    return (
      <footer
        className={`mx-auto w-full max-w-[1440px] ${isConicFiveTarget ? "h-[53px] px-[14px] py-0" : isHyperbolaTarget ? "h-[110px] px-4 pt-[12px]" : isSemicircleTarget ? "h-[92px] px-4 pb-0 pt-[7px]" : isCompassTarget || isGeneralPolygonTarget || isCircleCentreRadiusTarget ? "h-[93px] px-4 py-1" : "h-[65px] px-5 py-1"}`}
        aria-label="Site footer"
      >
        <div className="grid h-full grid-cols-[minmax(0,1fr)_auto] items-center rounded-lg border border-slate-200 bg-white/80 px-3 shadow-sm">
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-[10px] font-black text-slate-950">
              <Sparkles className="h-3.5 w-3.5 text-cyan-500" /> Math Universe
            </p>
            <p className="truncate text-[7px] leading-2 text-slate-500">
              Interactive math labs, visual proofs, NCERT explorations,
              graphing, CAS-style tools, and classroom-ready activities.
            </p>
            <p className="mt-0.5 text-[6px] font-bold uppercase leading-2 text-slate-400">
              © {year} Indian Servers Private Limited. No right to reproduce it.
            </p>
            <p className="text-[6px] leading-2 text-slate-400">
              www.IndianServers.com · info@IndianServers.com
            </p>
          </div>
          <div className="flex gap-1.5">
            <a
              className="action-secondary !min-h-7 !rounded-md !px-2 !py-1 !text-[9px]"
              href="/sitemap"
            >
              <Map className="h-3 w-3" />
              Sitemap
            </a>
            <a
              className="action-secondary !min-h-7 !rounded-md !px-2 !py-1 !text-[9px]"
              href="/documentation"
            >
              <Github className="h-3 w-3" />
              Docs
            </a>
            <a
              className="action-secondary !min-h-7 !rounded-md !px-2 !py-1 !text-[9px]"
              href="/about"
            >
              <Mail className="h-3 w-3" />
              About
            </a>
          </div>
        </div>
      </footer>
    );
  }
  if (isRegularPolygonTarget || isRigidPolygonTarget || isCircularArcTarget || isCircumcircularArcTarget || isCircularSectorTarget || isEllipseTarget || isParabolaTarget || isDistanceTarget || isAngleTarget || isStepsTarget) {
    return (
      <footer
        className={`mx-auto w-full max-w-[1440px] ${isStepsTarget ? "h-[89px] px-[14px] pt-0" : isAngleTarget ? "h-[109px] px-[11px] pt-2" : isDistanceTarget ? "h-[78px] px-4" : isCircularSectorTarget ? "h-[145px] px-4 pt-[14px]" : isParabolaTarget ? "h-[133px] px-[19px] pt-[15px]" : isEllipseTarget ? "h-[108px] px-[14px] pt-[6px]" : isCircumcircularArcTarget ? "h-[100px] px-3 pt-1" : `px-5 ${isRigidPolygonTarget || isCircularArcTarget ? "h-[120px] pt-1" : "h-[142px] pt-[22px]"}`}`}
        aria-label="Site footer"
      >
        <div className={`grid grid-cols-[minmax(0,1fr)_auto_250px] items-center gap-5 rounded-lg border border-slate-200 bg-white/80 px-4 shadow-sm ${isStepsTarget ? "h-[80px]" : isAngleTarget ? "h-[97px]" : isDistanceTarget ? "h-[78px]" : isCircularSectorTarget ? "h-[119px]" : isParabolaTarget ? "h-[118px]" : isEllipseTarget ? "h-[102px]" : isCircumcircularArcTarget ? "h-[92px]" : isRigidPolygonTarget || isCircularArcTarget ? "h-[112px]" : "h-[90px]"}`}>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[10px] font-black text-slate-950">
              <Sparkles className="h-4 w-4 text-cyan-500" /> Math Universe
            </p>
            <p className="mt-1 max-w-[260px] text-[8px] leading-3 text-slate-600">
              Interactive math labs, visual proofs, NCERT explorations,
              graphing, CAS-style tools, and classroom-ready activities.
            </p>
          </div>
          <div className="flex gap-2">
            <a className="target-geometry-action" href="/sitemap">
              <Map /> Sitemap
            </a>
            <a className="target-geometry-action" href="/documentation">
              <Github /> Docs
            </a>
            <a className="target-geometry-action" href="/about">
              <Mail /> About
            </a>
          </div>
          <div className="text-[8px] font-bold text-slate-500">
            <p className="uppercase">
              &copy; {year} Indian Servers Private Limited.
            </p>
            <p className="mt-1 uppercase">No right to reproduce it.</p>
            <p className="mt-3 normal-case">
              www.IndianServers.com &nbsp; info@IndianServers.com
            </p>
          </div>
        </div>
      </footer>
    );
  }
  return (
    <footer
      className={`mx-auto w-full max-w-[1440px] px-3 sm:px-4 md:px-5 ${isRightTriangleTarget ? "py-1" : isTangentTarget || isTriangleConstructorTarget ? "py-[10px]" : ultraCompact ? "py-1.5" : compact ? "py-[9px]" : "py-[22px]"}`}
      aria-label="Site footer"
    >
      <div
        className={`rounded-xl border border-slate-200 bg-white/78 px-3 text-sm shadow-xl shadow-slate-200/45 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/60 dark:shadow-black/20 ${isRightTriangleTarget ? "py-1" : "py-2"}`}
      >
        <div
          className={`flex flex-col md:flex-row md:items-center md:justify-between ${isRightTriangleTarget ? "gap-1" : "gap-3"}`}
        >
          <div className="min-w-0 md:max-w-[410px]">
            <p
              className={`flex items-center gap-2 font-black text-slate-950 dark:text-white ${isRightTriangleTarget ? "text-[10px]" : compact ? "text-xs" : ""}`}
            >
              <Sparkles className="h-4 w-4 text-cyan-500" />
              Math Universe
            </p>
            <p
              className={
                isRightTriangleTarget
                  ? "max-w-2xl text-[8px] leading-[9px] text-slate-600 dark:text-slate-300"
                  : compact
                    ? "mt-0.5 max-w-2xl text-[9px] leading-3 text-slate-600 dark:text-slate-300"
                    : "mt-1 max-w-2xl text-xs leading-4 text-slate-600 dark:text-slate-300"
              }
            >
              Interactive math labs, visual proofs, NCERT explorations,
              graphing, CAS-style tools, and classroom-ready activities.
            </p>
          </div>
          <div className="flex shrink-0 flex-nowrap gap-2">
            <a
              className={`action-secondary !rounded-lg ${isRightTriangleTarget ? "!min-h-7 !px-2 !py-1 !text-[9px]" : "!min-h-9 !px-3 !py-2 !text-xs"}`}
              href="/sitemap"
            >
              <Map className="h-4 w-4" />
              Sitemap
            </a>
            <a
              className={`action-secondary !rounded-lg ${isRightTriangleTarget ? "!min-h-7 !px-2 !py-1 !text-[9px]" : "!min-h-9 !px-3 !py-2 !text-xs"}`}
              href="/documentation"
            >
              <Github className="h-4 w-4" />
              Docs
            </a>
            <a
              className={`action-secondary !rounded-lg ${isRightTriangleTarget ? "!min-h-7 !px-2 !py-1 !text-[9px]" : "!min-h-9 !px-3 !py-2 !text-xs"}`}
              href="/about"
            >
              <Mail className="h-4 w-4" />
              About
            </a>
          </div>
        </div>
        <div
          className={`flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 font-bold uppercase text-slate-500 dark:border-white/10 dark:text-slate-400 ${isRightTriangleTarget ? "mt-0 pt-0 text-[7px] leading-2" : "mt-1 pt-1 text-[9px] leading-3"}`}
        >
          <span>
            &copy; {year} Indian Servers Private Limited. No right to reproduce
            it.
          </span>
        </div>
        <p
          className={`font-semibold text-slate-500 dark:text-slate-400 ${isRightTriangleTarget ? "text-[7px] leading-2" : "mt-1 text-[9px] leading-3"}`}
        >
          www.IndianServers.com info@IndianServers.com
        </p>
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
  const isWorkspaceRoute =
    location.pathname === "/workspace" ||
    location.pathname.startsWith("/workspace/");
  const isStudioRoute =
    location.pathname === "/math-lab/3d-graphing" ||
    location.pathname === "/math-lab/graphing-calculator" ||
    location.pathname === "/workspace/graph" ||
    location.pathname === "/workspace/3d" ||
    location.pathname === "/workspace/geometry" ||
    location.pathname.startsWith("/workspace/data") ||
    location.pathname === "/shapes";
  const isCalculusLabRoute =
    location.pathname === "/math/limits-continuity" ||
    location.pathname === "/math/derivatives" ||
    location.pathname === "/math/derivatives/formula-visualizer" ||
    location.pathname === "/math/integration" ||
    location.pathname === "/math/integration/formula-visualizer";
  const currentMathWorkspace = findMathWorkspace(location.pathname);
  const isCompassTarget = location.pathname === "/lessons/geometry/221-compass";
  const isSemicircleTarget =
    location.pathname === "/lessons/geometry/222-semicircle";
  const isCircularArcTarget =
    location.pathname === "/lessons/geometry/223-circular-arc";
  const isCircumcircularArcTarget =
    location.pathname === "/lessons/geometry/224-circumcircular-arc";
  const isCircularSectorTarget =
    location.pathname === "/lessons/geometry/225-circular-sector";
  const isConicFiveTarget =
    location.pathname === "/lessons/geometry/226-conic-through-five-points";
  const isEllipseTarget = location.pathname === "/lessons/geometry/227-ellipse";
  const isHyperbolaTarget = location.pathname === "/lessons/geometry/228-hyperbola";
  const isParabolaTarget = location.pathname === "/lessons/geometry/229-parabola";
  const isDistanceTarget =
    location.pathname === "/lessons/geometry/230-distance-length";
  const isAreaTarget = location.pathname === "/lessons/geometry/231-area";
  const isAngleTarget = location.pathname === "/lessons/geometry/232-angle";
  const isFixedAngleTarget =
    location.pathname === "/lessons/geometry/233-fixed-angle";
  const isRelationTarget =
    location.pathname === "/lessons/geometry/234-relation-checker";
  const isStepsTarget =
    location.pathname === "/lessons/geometry/235-construction-steps";
  const isTranslationTarget =
    location.pathname === "/lessons/geometry/236-translation-by-vector";
  const isReflectionTarget =
    location.pathname === "/lessons/geometry/237-reflection-in-line";
  const isPointReflectionTarget =
    location.pathname === "/lessons/geometry/238-reflection-in-point";
  const isCircleReflectionTarget =
    location.pathname === "/lessons/geometry/239-reflection-in-circle";
  const isRigidPolygonTarget =
    location.pathname === "/lessons/geometry/216-rigid-polygon";
  const isGeneralPolygonTarget =
    location.pathname === "/lessons/geometry/217-general-polygon";
  const isCircleCentreRadiusTarget =
    location.pathname === "/lessons/geometry/219-circle-centre-and-radius";
  const isCircleThreePointsTarget =
    location.pathname === "/lessons/geometry/220-circle-through-three-points";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onFullscreenChange = () =>
      setMainFullscreen(document.fullscreenElement === mainContentRef.current);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleMainFullscreen = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    await mainContentRef.current?.requestFullscreen?.();
  };

  useEffect(() => {
    const currentRoute = navItems.find(
      (item) => !item.isExternal && item.route === location.pathname,
    )?.route;
    if (!currentRoute) return;
    try {
      const current = JSON.parse(localStorage.getItem(recentToolsKey) ?? "[]");
      const list = Array.isArray(current)
        ? current.filter((item): item is string => typeof item === "string")
        : [];
      localStorage.setItem(
        recentToolsKey,
        JSON.stringify(
          [currentRoute, ...list.filter((item) => item !== currentRoute)].slice(
            0,
            8,
          ),
        ),
      );
    } catch {
      localStorage.setItem(recentToolsKey, JSON.stringify([currentRoute]));
    }
  }, [location.pathname]);

  if (isCalculusLabRoute) {
    return (
      <main id="main-content" className="h-dvh overflow-auto bg-slate-50">
        <Outlet />
        <UndoToastHost />
      </main>
    );
  }

  if (isStudioRoute) {
    return (
      <main
        id="main-content"
        className="math-workspace-host h-dvh overflow-hidden bg-[#030914]"
      >
        {currentMathWorkspace ? (
          <MathWorkspaceLayout workspace={currentMathWorkspace}>
            <Outlet />
          </MathWorkspaceLayout>
        ) : (
          <div className="math-workspace-page h-full min-h-0">
            <Outlet />
          </div>
        )}
        <UndoToastHost />
      </main>
    );
  }

  if (isWorkspaceRoute) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_34%)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-2xl focus:bg-slate-950 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white dark:focus:bg-white dark:focus:text-slate-950"
        >
          Skip to content
        </a>
        <div className="app-layout-rail flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <main
              ref={mainContentRef}
              id="main-content"
              className="app-fullscreen-target min-h-screen w-full p-1 pb-24 sm:p-2 lg:pb-2"
            >
              <div
                key={location.pathname}
                className="page-transition min-h-screen min-w-0 overflow-x-clip"
              >
                <Outlet />
              </div>
            </main>
            <AppFooter />
          </div>
        </div>
        <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
        <MobileLearningDock />
        <UndoToastHost />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_34%)] ${isDistanceTarget ? "target-distance-app" : isAreaTarget ? "target-area-app" : isAngleTarget ? "target-angle-app" : isFixedAngleTarget ? "target-fixed-angle-app" : isRelationTarget ? "target-relation-app" : isStepsTarget ? "target-steps-app" : isTranslationTarget ? "target-translation-app" : isReflectionTarget ? "target-reflection-app" : isPointReflectionTarget ? "target-point-reflection-app" : isCircleReflectionTarget ? "target-circle-reflection-app" : ""}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-2xl focus:bg-slate-950 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white dark:focus:bg-white dark:focus:text-slate-950"
      >
        Skip to content
      </a>
      <div className="app-layout-rail flex min-h-screen">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            mobileMenuOpen={mobileOpen}
            onMenuClick={() => setMobileOpen((value) => !value)}
          />
          <main
            ref={mainContentRef}
            id="main-content"
              className={`app-fullscreen-target mx-auto w-full max-w-[1440px] flex-1 pb-24 pt-2 md:pb-0 md:pt-4 ${isCompassTarget || isSemicircleTarget || isRigidPolygonTarget ? "px-3" : isGeneralPolygonTarget || isCircleCentreRadiusTarget ? "px-4" : isCircularArcTarget ? "pl-[23px] pr-4" : isCircumcircularArcTarget ? "pl-[6px] pr-3" : isCircularSectorTarget ? "pl-[6px] pr-4" : isConicFiveTarget ? "px-[14px]" : isEllipseTarget ? "pl-[13px] pr-[14px]" : isHyperbolaTarget ? "pl-[9px] pr-4" : isParabolaTarget ? "pl-[23px] pr-[19px]" : isDistanceTarget ? "pl-[17px] pr-4" : isAreaTarget ? "pl-[18px] pr-[11px]" : isAngleTarget ? "pl-[11px] pr-[3px]" : isFixedAngleTarget ? "pl-[12px] pr-[13px]" : isRelationTarget ? "pl-[18px] pr-[17px]" : isStepsTarget ? "pl-[14px] pr-[16px]" : isTranslationTarget ? "pl-[25px] pr-[34px]" : isReflectionTarget ? "px-[19px]" : isPointReflectionTarget ? "pl-[24px] pr-[19px]" : isCircleReflectionTarget ? "pl-[10px] pr-[13px]" : isCircleThreePointsTarget ? "px-6" : "px-2 sm:px-4 md:px-5"}`}
          >
            {!location.pathname.startsWith("/lessons/") && (
              <button
                type="button"
                onClick={() => void toggleMainFullscreen()}
                className="app-fullscreen-button"
                title={
                  mainFullscreen
                    ? "Exit full screen"
                    : "Full screen this module"
                }
                aria-label={
                  mainFullscreen
                    ? "Exit full screen"
                    : "Full screen this module"
                }
              >
                {mainFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
                <span>{mainFullscreen ? "Exit" : "Full"}</span>
              </button>
            )}
            <div
              key={location.pathname}
              className="page-transition min-w-0 space-y-1.5 overflow-x-clip"
            >
              <InlinePageNav showBack={showBack} />
              <Outlet />
            </div>
          </main>
          <AppFooter />
        </div>
      </div>
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <MobileLearningDock />
      <BackToTopButton />
      <UndoToastHost />
    </div>
  );
}

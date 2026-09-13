import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import MobileLearningDock from "./MobileLearningDock";
import { navItems } from "./navItems";
import { BackToTopButton, BreadcrumbTrail, UndoToastHost } from "./GlobalUx";
import { ArrowLeft, Maximize2, Minimize2 } from "lucide-react";
import MathWorkspaceLayout from "../workspace/MathWorkspaceLayout";
import { findMathWorkspace } from "../../workspace/mathWorkspaces";
import { StudioLessonLinks, configForPath } from "../lessons/StudioLessonLinks";

function InlinePageNav({ showBack, hidden = false }: { showBack: boolean; hidden?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === "/" || hidden) return null;
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
  return (
    <footer className="w-full px-3 py-0.5" aria-label="Site footer">
      <div className="mx-auto flex min-h-6 max-w-[1440px] items-center justify-between gap-4 overflow-x-auto whitespace-nowrap border-t border-slate-200 px-1 text-[9px] font-semibold text-slate-500 dark:border-white/10 dark:text-slate-400">
        <p className="shrink-0">
          &copy; {year} Indian Servers Private Limited · Math Universe ·
          www.IndianServers.com · info@IndianServers.com
        </p>
        <nav
          className="flex shrink-0 items-center gap-2"
          aria-label="Footer links"
        >
          <a
            className="hover:text-cyan-700 dark:hover:text-cyan-300"
            href="/sitemap"
          >
            Sitemap
          </a>
          <span aria-hidden="true">·</span>
          <a
            className="hover:text-cyan-700 dark:hover:text-cyan-300"
            href="/documentation"
          >
            Docs
          </a>
          <span aria-hidden="true">·</span>
          <a
            className="hover:text-cyan-700 dark:hover:text-cyan-300"
            href="/about"
          >
            About
          </a>
        </nav>
      </div>
    </footer>
  );
}
export default function AppLayout() {
  const [mainFullscreen, setMainFullscreen] = useState(false);
  const mainContentRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const showBack = location.pathname.split("/").filter(Boolean).length > 1;
  // StudioPageShell renders its own breadcrumb. Keep the shared trail for
  // ordinary pages, but avoid showing two trails on shell based pages.
  const hasOwnStudioBreadcrumb = /^\/(?:algebra|calculus|geometry|combinatorics|complex-numbers|set-theory|statistics|linear-algebra|matrices|number-systems|trigonometry|truth-table|mathematical-modelling|studio-projects|daily-challenge|worked-examples|discrete-world)(?:\/|$)/.test(location.pathname) || ["/probability-statistics", "/mathematical-logic"].includes(location.pathname);
  const isWorkspaceRoute =
    location.pathname === "/workspace" ||
    location.pathname.startsWith("/workspace/");
  const isVisualProofLessonRoute = /^\/visual-proofs\/[^/]+\/[^/]+\/?$/.test(
    location.pathname,
  );
  const isStudioRoute =
    location.pathname === "/algebra" ||
    location.pathname.startsWith("/algebra/") ||
    location.pathname === "/math-lab/3d-graphing" ||
    location.pathname === "/math-lab/graphing-calculator" ||
    location.pathname === "/workspace/graph" ||
    location.pathname === "/workspace/3d" ||
    location.pathname === "/workspace/geometry" ||
    location.pathname.startsWith("/workspace/data") ||
    location.pathname === "/shapes";
  const isMatrixLauncher = location.pathname === "/matrices";
  const isCalculusLabRoute =
    location.pathname === "/calculus" ||
    location.pathname.startsWith("/calculus/") ||
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
  const isHyperbolaTarget =
    location.pathname === "/lessons/geometry/228-hyperbola";
  const isParabolaTarget =
    location.pathname === "/lessons/geometry/229-parabola";
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
  const isRotationPointTarget =
    location.pathname === "/lessons/geometry/240-rotation-around-point";
  const isDilationPointTarget =
    location.pathname === "/lessons/geometry/241-dilation-from-point";
  const isMatrixTransformationTarget =
    location.pathname === "/lessons/geometry/242-matrix-transformation";
  const isCompositeTransformationTarget =
    location.pathname === "/lessons/geometry/243-composite-transformations";
  const isTransformationMappingTarget =
    location.pathname === "/lessons/geometry/244-transformation-mapping";
  const isInvariantsTarget =
    location.pathname === "/lessons/geometry/245-invariants";
  const isSymmetryExplorerTarget =
    location.pathname === "/lessons/geometry/246-symmetry-explorer";
  const isLocusGeneratorTarget =
    location.pathname === "/lessons/geometry/247-locus-generator";
  const isEquidistantLociTarget =
    location.pathname === "/lessons/geometry/248-equidistant-loci";
  const isMovingLinkageTarget =
    location.pathname === "/lessons/geometry/249-moving-linkage-loci";
  const isEnvelopeLinesTarget =
    location.pathname === "/lessons/geometry/250-envelope-of-lines";
  const isDynamicTraceTarget =
    location.pathname === "/lessons/geometry/251-dynamic-trace";
  const isConjectureTestingTarget =
    location.pathname === "/lessons/geometry/252-conjecture-testing";
  const isExactProofTarget =
    location.pathname === "/lessons/geometry/253-exact-proof";
  const isCollinearityTestTarget =
    location.pathname === "/lessons/geometry/254-collinearity-test";
  const isConcurrencyTestTarget =
    location.pathname === "/lessons/geometry/255-concurrency-test";
  const isConcyclicityTestTarget =
    location.pathname === "/lessons/geometry/256-concyclicity-test";
  const isAngleMeasurementTarget =
    location.pathname === "/lessons/trigonometry/257-angle-measurement";
  const isRigidPolygonTarget =
    location.pathname === "/lessons/geometry/216-rigid-polygon";
  const isGeneralPolygonTarget =
    location.pathname === "/lessons/geometry/217-general-polygon";
  const isCircleCentreRadiusTarget =
    location.pathname === "/lessons/geometry/219-circle-centre-and-radius";
  const isCircleThreePointsTarget =
    location.pathname === "/lessons/geometry/220-circle-through-three-points";

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

  if (isVisualProofLessonRoute) {
    return (
      <main id="main-content" className="h-dvh overflow-hidden bg-[#fbfaf6]">
        <Outlet />
        <UndoToastHost />
      </main>
    );
  }

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
        <div className="app-layout-rail flex min-h-screen min-w-0">
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
        <MobileLearningDock />
        <UndoToastHost />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.14),transparent_30%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_top_right,rgba(139,92,246,0.12),transparent_34%)] ${isDistanceTarget ? "target-distance-app" : isAreaTarget ? "target-area-app" : isAngleTarget ? "target-angle-app" : isFixedAngleTarget ? "target-fixed-angle-app" : isRelationTarget ? "target-relation-app" : isStepsTarget ? "target-steps-app" : isTranslationTarget ? "target-translation-app" : isReflectionTarget ? "target-reflection-app" : isPointReflectionTarget ? "target-point-reflection-app" : isCircleReflectionTarget ? "target-circle-reflection-app" : isRotationPointTarget ? "target-rotation-app" : isDilationPointTarget ? "target-dilation-app" : isMatrixTransformationTarget ? "target-matrix-app" : isCompositeTransformationTarget ? "target-composite-app" : isTransformationMappingTarget ? "target-mapping-app" : isInvariantsTarget ? "target-invariants-app" : isSymmetryExplorerTarget ? "target-symmetry-app" : isLocusGeneratorTarget ? "target-locus-app" : isEquidistantLociTarget ? "target-equidistant-app" : isMovingLinkageTarget ? "target-linkage-app" : isEnvelopeLinesTarget ? "target-envelope-app" : isDynamicTraceTarget ? "target-trace-app" : isConjectureTestingTarget ? "target-conjecture-app" : isExactProofTarget ? "target-proof-app" : isCollinearityTestTarget ? "target-collinear-app" : isConcurrencyTestTarget ? "target-concurrency-app" : isConcyclicityTestTarget ? "target-concyclic-app" : isAngleMeasurementTarget ? "target-angle-measurement-app" : ""}`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-2xl focus:bg-slate-950 focus:px-4 focus:py-3 focus:text-sm focus:font-semibold focus:text-white dark:focus:bg-white dark:focus:text-slate-950"
      >
        Skip to content
      </a>
      <div className="app-layout-rail flex min-h-screen min-w-0">
        <div className="flex min-w-0 flex-1 flex-col">
          {isMatrixLauncher ? null : <Header />}
          <main
            ref={mainContentRef}
            id="main-content"
            className={`app-fullscreen-target w-full max-w-none flex-1 ${isMatrixLauncher ? "pb-24 pt-0 md:pb-0 md:pt-0 px-0" : `pb-24 pt-2 md:pb-0 md:pt-4 ${isCompassTarget || isSemicircleTarget || isRigidPolygonTarget ? "px-3" : isGeneralPolygonTarget || isCircleCentreRadiusTarget ? "px-4" : isCircularArcTarget ? "pl-[23px] pr-4" : isCircumcircularArcTarget ? "pl-[6px] pr-3" : isCircularSectorTarget ? "pl-[6px] pr-4" : isConicFiveTarget ? "px-[14px]" : isEllipseTarget ? "pl-[13px] pr-[14px]" : isHyperbolaTarget ? "pl-[9px] pr-4" : isParabolaTarget ? "pl-[23px] pr-[19px]" : isDistanceTarget ? "pl-[17px] pr-4" : isAreaTarget ? "pl-[18px] pr-[11px]" : isAngleTarget ? "pl-[11px] pr-[3px]" : isFixedAngleTarget ? "pl-[12px] pr-[13px]" : isRelationTarget ? "pl-[18px] pr-[17px]" : isStepsTarget ? "pl-[14px] pr-[16px]" : isTranslationTarget ? "pl-[25px] pr-[34px]" : isReflectionTarget ? "px-[19px]" : isPointReflectionTarget ? "pl-[24px] pr-[19px]" : isCircleReflectionTarget ? "pl-[10px] pr-[13px]" : isRotationPointTarget ? "px-[20px]" : isDilationPointTarget ? "pl-[20px] pr-[16px]" : isMatrixTransformationTarget ? "px-[16px]" : isCompositeTransformationTarget ? "px-[12px]" : isTransformationMappingTarget ? "px-[12px]" : isInvariantsTarget || isSymmetryExplorerTarget || isLocusGeneratorTarget || isEquidistantLociTarget || isMovingLinkageTarget || isEnvelopeLinesTarget || isDynamicTraceTarget || isConjectureTestingTarget || isExactProofTarget || isCollinearityTestTarget || isConcurrencyTestTarget || isConcyclicityTestTarget || isAngleMeasurementTarget ? "px-[10px]" : isCircleThreePointsTarget ? "px-6" : "px-2 sm:px-4 md:px-5"}`}`}
          >
            <button
              type="button"
              onClick={() => void toggleMainFullscreen()}
              className={`app-fullscreen-button${location.pathname.startsWith("/lessons/") ? " app-fullscreen-button-lesson" : ""}`}
              title={mainFullscreen ? "Exit full screen" : "Full screen this lesson or module"}
              aria-label={mainFullscreen ? "Exit full screen" : "Full screen this lesson or module"}
            >
              {mainFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
              <span>{mainFullscreen ? "Exit" : "Full"}</span>
            </button>
            <div
              key={location.pathname}
              className="page-transition min-w-0 space-y-1.5 overflow-x-clip"
            >
              <InlinePageNav showBack={showBack} hidden={hasOwnStudioBreadcrumb} />
              <Outlet />
              {!hasOwnStudioBreadcrumb && !location.pathname.startsWith("/lessons") && configForPath(location.pathname) ? <StudioLessonLinks pathname={location.pathname} /> : null}
            </div>
          </main>
          <AppFooter />
        </div>
      </div>
      <MobileLearningDock />
      <BackToTopButton />
      <UndoToastHost />
    </div>
  );
}

import { clsx } from "clsx";
import { Maximize2, Minimize2 } from "lucide-react";
import { ReactNode, useEffect, useRef, useState } from "react";

type SectionCardProps = {
  id?: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  compact?: boolean;
  headerAction?: ReactNode;
  tone?: "default" | "spotlight";
  allowFullscreen?: boolean;
};

export default function SectionCard({ id, title, description, children, className, compact = false, headerAction, tone = "default", allowFullscreen = false }: SectionCardProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenOffset, setFullscreenOffset] = useState({ x: 0, y: 0 });
  const spotlight = tone === "spotlight";

  useEffect(() => {
    if (!allowFullscreen) return undefined;
    const handleFullscreenChange = () => {
      const isNativeFullscreen = document.fullscreenElement === sectionRef.current;
      setFullscreen(isNativeFullscreen);
      if (isNativeFullscreen) setFullscreenOffset({ x: 0, y: 0 });
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [allowFullscreen]);

  useEffect(() => {
    if (!fullscreen) return undefined;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && document.fullscreenElement !== sectionRef.current) setFullscreen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [fullscreen]);

  useEffect(() => {
    if (!fullscreen || document.fullscreenElement === sectionRef.current) return undefined;
    const frame = requestAnimationFrame(() => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (Math.abs(rect.x) > 1 || Math.abs(rect.y) > 1) {
        setFullscreenOffset((offset) => ({ x: offset.x - rect.x, y: offset.y - rect.y }));
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [fullscreen, fullscreenOffset.x, fullscreenOffset.y]);

  async function toggleFullscreen() {
    if (!allowFullscreen || !sectionRef.current) return;
    if (fullscreen) {
      if (document.fullscreenElement === sectionRef.current) await document.exitFullscreen();
      setFullscreen(false);
      setFullscreenOffset({ x: 0, y: 0 });
      return;
    }
    setFullscreenOffset({ x: 0, y: 0 });
    setFullscreen(true);
    try {
      await sectionRef.current.requestFullscreen();
      if (document.fullscreenElement === sectionRef.current) setFullscreenOffset({ x: 0, y: 0 });
    } catch {
      setFullscreen(true);
    }
  }

  const fullscreenButton = allowFullscreen ? (
    <button
      type="button"
      className="tool-button h-9 w-9 shrink-0 justify-center p-0"
      onClick={toggleFullscreen}
      title={fullscreen ? "Exit full screen" : "Full screen"}
      aria-label={fullscreen ? "Exit full screen" : "Open card full screen"}
    >
      {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
    </button>
  ) : null;

  return (
    <section
      ref={sectionRef}
      id={id}
      style={fullscreen ? { position: "fixed", inset: 0, zIndex: 80, transform: `translate(${fullscreenOffset.x}px, ${fullscreenOffset.y}px)` } : undefined}
      className={clsx(
        "group/section relative min-w-0 max-w-full overflow-hidden rounded-xl p-3",
        spotlight
          ? "spotlight-card"
          : "glass-card hover:border-cyan-200/80 dark:hover:border-cyan-400/25",
        compact ? "md:p-3" : "md:p-4",
        fullscreen && "h-screen w-screen overflow-auto rounded-none p-4 md:p-6",
        className
      )}
    >
      <div className={clsx("absolute left-0 top-0 w-full", spotlight ? "h-px bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" : "gradient-line")} />
      {(title || description || headerAction || fullscreenButton) && (
        <div className={clsx("flex items-start gap-3", compact ? "mb-2" : "mb-3")}>
          <span className={clsx("mt-1.5 hidden h-1.5 w-1.5 shrink-0 rounded-full shadow-sm sm:block", spotlight ? "bg-cyan-200 shadow-cyan-200/50" : "bg-cyan-400 shadow-cyan-400/50")} />
          <div className="min-w-0 flex-1">
            {title && <h2 className={clsx("break-words font-semibold", spotlight ? "text-slate-950 dark:text-white" : "text-slate-950 dark:text-white", compact ? "text-base" : "text-lg")}>{title}</h2>}
            {description && <p className={clsx("mt-0.5 max-w-4xl", spotlight ? "text-slate-600 dark:text-cyan-50/80" : "text-slate-600 dark:text-slate-300", compact ? "line-clamp-2 text-xs leading-5" : "text-sm leading-5")}>{description}</p>}
          </div>
          {(headerAction || fullscreenButton) && <div className="flex shrink-0 items-center gap-2">{headerAction}{fullscreenButton}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

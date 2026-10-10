import { useEffect, useRef, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import LessonSimpleEnglishGuide from "./LessonSimpleEnglishGuide";
import LessonStudySession from "./LessonStudySession";
import {
  applyDedicatedTabVisibility,
  normalizeLessonTab,
  readActiveLessonTab,
} from "./dedicatedLessonTabs";

export default function DedicatedLessonTabHost({
  children,
  className,
  testId,
}: {
  children: ReactNode;
  className?: string;
  testId?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const apply = (label?: string) => {
      applyDedicatedTabVisibility(root, label ?? readActiveLessonTab(root));
    };

    const onClick = (event: Event) => {
      const click = event as MouseEvent;
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      const href = anchor?.getAttribute("href");
      if (anchor && href?.startsWith("/lessons/") && !event.defaultPrevented && click.button === 0 && !click.ctrlKey && !click.metaKey && !click.shiftKey && !click.altKey && !anchor.hasAttribute("download") && (!anchor.target || anchor.target === "_self")) {
        event.preventDefault();
        navigate(href);
        return;
      }
      const button = (event.target as HTMLElement | null)?.closest("button");
      if (!button || !button.closest("nav")) return;
      const label = button.textContent?.trim() ?? "";
      if (!normalizeLessonTab(label)) return;
      window.requestAnimationFrame(() => apply(label));
    };

    apply();
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, [navigate]);

  return (
    <div ref={rootRef} className={className} data-testid={testId}>
      <LessonSimpleEnglishGuide />
      {children}
      <LessonStudySession />
    </div>
  );
}

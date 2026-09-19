import { useEffect, useRef, type ReactNode } from "react";
import LessonSimpleEnglishGuide from "./LessonSimpleEnglishGuide";
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

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const apply = (label?: string) => {
      applyDedicatedTabVisibility(root, label ?? readActiveLessonTab(root));
    };

    const onClick = (event: Event) => {
      const button = (event.target as HTMLElement | null)?.closest("button");
      if (!button || !button.closest("nav")) return;
      const label = button.textContent?.trim() ?? "";
      if (!normalizeLessonTab(label)) return;
      window.requestAnimationFrame(() => apply(label));
    };

    apply();
    root.addEventListener("click", onClick);
    return () => root.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={rootRef} className={className} data-testid={testId}>
      <LessonSimpleEnglishGuide />
      {children}
    </div>
  );
}

import type { HTMLAttributes, ReactNode } from "react";
import "./LessonStudio.css";

/** Opt-in presentation primitives. Values and interaction state stay in the lesson. */
export function LessonStudioFrame({ children }: { children: ReactNode }) {
  return <div className="lesson-studio-frame">{children}</div>;
}

export function LessonStudioPanel({ as: Tag = "section", className = "", ...props }: HTMLAttributes<HTMLElement> & { as?: "section" | "article" | "aside" }) {
  return <Tag className={`lesson-studio-panel ${className}`} {...props} />;
}

export function LessonStudioGrid({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`lesson-studio-grid ${className}`} {...props} />;
}

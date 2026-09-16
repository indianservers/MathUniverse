import type { ReactNode } from "react";
import { MockupLearningStrip } from "../mockup/MockupStudioChrome";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { useLabMode } from "../mockup/studioLabKit";
import { LinearLabHeader } from "./linearAlgebraUi";

export function LinearAlgebraLabChrome({
  page,
  pills = false,
  wide = false,
  play = false,
  header,
  children,
}: {
  page: StudioMockupPage;
  pills?: boolean;
  wide?: boolean;
  play?: boolean;
  header?: ReactNode;
  children: (mode: string, setMode: (mode: string) => void) => ReactNode;
}) {
  const { tabs, mode, setMode } = useLabMode(page);
  return (
    <div className={`la-lab-root${wide ? " is-wide" : ""}${play ? " is-play" : ""}`}>
      {header ?? <LinearLabHeader page={page} />}
      <div className="msk-dash-banner la-mode-flag" data-lab-mode={mode} data-studio-kernel="1">
        <b>{page.title} · {mode}</b>
        <small>{page.subtitle}</small>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{page.title} mode {mode}</p>
      {pills ? (
        <nav className="la-pills" aria-label={`${page.title} modes`}>
          {tabs.map((item) => (
            <button key={item} type="button" className={item === mode ? "active" : ""} aria-pressed={item === mode} onClick={() => setMode(item)}>
              {item}
            </button>
          ))}
        </nav>
      ) : null}
      <div className="la-lab" data-mode-canvas={mode}>{children(mode, setMode)}</div>
      <MockupLearningStrip page={page} mode={mode} />
    </div>
  );
}

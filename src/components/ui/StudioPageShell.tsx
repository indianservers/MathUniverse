import { Clock3, Gauge, Share2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { shareStudio } from "../../utils/shareStudio";

export type StudioStatusChip = {
  id: string;
  label: string;
  value?: string | number;
  tone?: "cyan" | "violet" | "green" | "orange" | "red" | "slate";
};

export type StudioPageShellProps = {
  title: string;
  subtitle: string;
  breadcrumbs?: string[];
  difficulty?: string;
  estimatedMinutes?: number;
  progress?: number;
  status?: StudioStatusChip[];
  tabs?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
  onShare?: () => void | Promise<void>;
  showHeader?: boolean;
};

export default function StudioPageShell({
  breadcrumbs = [],
  children,
  className = "",
  difficulty,
  estimatedMinutes,
  onShare,
  progress,
  status = [],
  subtitle,
  tabs,
  title,
  toolbar,
  showHeader = true,
}: StudioPageShellProps) {
  const [shareStatus, setShareStatus] = useState("");
  useEffect(() => {
    document.title = `${title} | Math Universe`;
  }, [title]);

  const share = async () => {
    if (onShare) {
      try {
        await onShare();
      } catch {
        setShareStatus("Sharing failed. Please try again.");
      }
    } else setShareStatus(await shareStudio(title));
  };

  return (
    <main className={`studio-shell ${className}`}>
      {showHeader ? (
        <header className="studio-shell-header">
          <div className="studio-shell-title">
            {breadcrumbs.length ? (
              <nav aria-label="Breadcrumb">
                {breadcrumbs.map((item, index) => (
                  <span key={`${item}-${index}`}>
                    {index > 0 && <b>&gt;</b>}
                    {item}
                  </span>
                ))}
              </nav>
            ) : null}
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="studio-shell-actions">
            {typeof progress === "number" ? (
              <span className="studio-chip tone-cyan">
                <i />
                In progress - {Math.round(progress)}%
              </span>
            ) : null}
            {status.map((chip) => (
              <span
                key={chip.id}
                className={`studio-chip tone-${chip.tone ?? "slate"}`}
              >
                <i />
                {chip.label}
                {chip.value !== undefined ? ` - ${chip.value}` : ""}
              </span>
            ))}
            {difficulty ? (
              <span className="studio-chip tone-cyan">
                <Gauge />
                {difficulty}
              </span>
            ) : null}
            {estimatedMinutes ? (
              <span className="studio-chip tone-violet">
                <Clock3 />
                {estimatedMinutes} min
              </span>
            ) : null}
            <button type="button" onClick={() => void share()}>
              <Share2 />
              Share setup
            </button>
            {shareStatus && (
              <p role="status" style={{ overflowWrap: "anywhere" }}>
                {shareStatus}
              </p>
            )}
          </div>
        </header>
      ) : null}
      {tabs ? <div className="studio-shell-tabs">{tabs}</div> : null}
      {toolbar ? <div className="studio-shell-toolbar">{toolbar}</div> : null}
      <section className="studio-shell-body">{children}</section>
    </main>
  );
}

import { Clock3, Gauge, Share2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { shareStudio } from "../../utils/shareStudio";

const breadcrumbRoutes: Record<string, string> = {
  Home: "/", "Math Topics": "/learn", Studio: "/math-lab",
  "Number & Discrete Mathematics": "/discrete-world",
  "Discrete Mathematics": "/discrete-world",
  Practice: "/quiz", Algebra: "/algebra",
  "Complex Numbers": "/complex-numbers", Combinatorics: "/combinatorics",
  "Daily Challenge": "/daily-challenge", Matrices: "/matrices", Operations: "/matrices",
  "Number Systems": "/number-systems", "Probability & Statistics": "/statistics",
  "Set Theory": "/set-theory", "Set Theory and Relations": "/set-theory",
  "Mathematical Logic": "/mathematical-logic", Logic: "/mathematical-logic",
  "Worked Examples": "/worked-examples", "Mathematical Modelling": "/mathematical-modelling",
  "Advanced Workbench": "/mathematical-modelling/advanced", "Project Center": "/studio-projects",
};

export type StudioStatusChip = {
  id: string;
  label: string;
  value?: string | number;
  tone?: "cyan" | "violet" | "green" | "orange" | "red" | "slate";
};

export type StudioPageShellProps = {
  title: string;
  titleBadge?: ReactNode;
  subtitle: string;
  breadcrumbs?: string[];
  difficulty?: string;
  estimatedMinutes?: number;
  progress?: number;
  status?: StudioStatusChip[];
  tabs?: ReactNode;
  guide?: ReactNode;
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
  guide,
  title,
  titleBadge,
  toolbar,
  showHeader = true,
}: StudioPageShellProps) {
  const { pathname } = useLocation();
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
                    {index > 0 && <b aria-hidden="true">&gt;</b>}
                    <Link to={breadcrumbRoutes[item] ?? pathname}
                      aria-current={(breadcrumbRoutes[item] ?? pathname) === pathname ? "page" : undefined}>
                      {item}
                    </Link>
                  </span>
                ))}
              </nav>
            ) : null}
            <div className="studio-shell-heading">
              <h1>{title}</h1>
              {titleBadge}
            </div>
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
      {guide ? <section className="studio-shell-guide" aria-label="Studio guide">{guide}</section> : null}
    </main>
  );
}

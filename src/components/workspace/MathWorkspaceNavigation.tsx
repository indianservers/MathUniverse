import { Check, ChevronDown, ChevronRight, Grid3X3, Home } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { iconMap } from "../layout/navItems";
import { findMathWorkspace, mathWorkspaceGroupLabels, mathWorkspaces, workspaceById, type MathWorkspaceGroup, type MathWorkspaceId, type MathWorkspacePayload } from "../../workspace/mathWorkspaces";

const workspaceGroups: MathWorkspaceGroup[] = ["calculate", "construct-graph", "explore"];

export function MathWorkspaceChrome({ compact = false }: { compact?: boolean }) {
  const location = useLocation();
  const current = findMathWorkspace(location.pathname);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open]);

  if (!current) return null;
  const CurrentIcon = iconMap[current.icon];

  return (
    <div className={`math-workspace-chrome ${compact ? "math-workspace-chrome-compact" : ""}`} data-testid="math-workspace-chrome">
      <nav className="math-workspace-breadcrumb" aria-label="Workspace breadcrumb">
        <Link to="/" aria-label="Home"><Home className="h-3.5 w-3.5" /></Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <Link to="/?section=math-workspaces">Math Workspaces</Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span aria-current="page">{current.name}</span>
      </nav>

      <div className="math-workspace-switcher" ref={menuRef}>
        <button
          type="button"
          id="math-workspace-switcher-trigger"
          className="math-workspace-switcher-trigger"
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="math-workspace-current-icon" style={{ "--workspace-accent": current.accent } as CSSProperties}>
            <CurrentIcon className="h-4 w-4" />
          </span>
          <span>{current.name}</span>
          <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div className="math-workspace-switcher-menu" role="menu" aria-label="Switch math workspace">
            <div className="math-workspace-switcher-title"><Grid3X3 className="h-4 w-4" />Math Workspaces</div>
            {workspaceGroups.map((group) => (
              <div key={group} className="math-workspace-switcher-group">
                <p>{mathWorkspaceGroupLabels[group]}</p>
                {mathWorkspaces.filter((workspace) => workspace.group === group).map((workspace) => {
                  const Icon = iconMap[workspace.icon];
                  const active = workspace.id === current.id;
                  return active ? (
                    <div key={workspace.id} className="math-workspace-switcher-item is-active" role="menuitem" aria-current="page">
                      <span className="math-workspace-menu-icon" style={{ "--workspace-accent": workspace.accent } as CSSProperties}><Icon className="h-4 w-4" /></span>
                      <span><strong>{workspace.name}</strong><small>{workspace.shortDescription}</small></span>
                      <Check className="ml-auto h-4 w-4" />
                    </div>
                  ) : (
                    <Link key={workspace.id} to={workspace.route} className="math-workspace-switcher-item" role="menuitem">
                      <span className="math-workspace-menu-icon" style={{ "--workspace-accent": workspace.accent } as CSSProperties}><Icon className="h-4 w-4" /></span>
                      <span><strong>{workspace.name}</strong><small>{workspace.shortDescription}</small></span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function MathWorkspacesHomeSection() {
  return (
    <section id="math-workspaces" className="math-workspaces-home" aria-labelledby="math-workspaces-title">
      <div className="math-workspaces-home-heading">
        <div>
          <p><Grid3X3 className="h-4 w-4" />Connected studios</p>
          <h2 id="math-workspaces-title">Math Workspaces</h2>
          <span>Calculate, construct, graph and explore mathematics in connected interactive studios.</span>
        </div>
        <span className="math-workspaces-suite-count">6 workspaces</span>
      </div>
      <div className="math-workspaces-card-grid">
        {mathWorkspaces.map((workspace) => {
          return (
            <Link key={workspace.id} to={workspace.route} className="math-workspace-card" style={{ "--workspace-accent": workspace.accent } as CSSProperties}>
              <span className="math-workspace-card-formula" aria-hidden="true">{workspace.formula}</span>
              <span className="math-workspace-card-icon"><img src={workspace.artwork} alt="" /></span>
              <span className="math-workspace-card-copy">
                <span className="math-workspace-card-title"><strong>{workspace.name}</strong><em>{workspace.badge}</em></span>
                <small>{workspace.description}</small>
              </span>
              <span className="math-workspace-card-action">Open Workspace <ChevronRight className="h-4 w-4" /></span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function ContextualWorkspaceLink({ target, payload, children, className = "" }: {
  target: MathWorkspaceId;
  payload: MathWorkspacePayload;
  children: ReactNode;
  className?: string;
}) {
  const workspace = workspaceById(target);
  if (!workspace) return null;
  return <Link to={workspace.route} state={{ mathWorkspacePayload: payload }} className={className}>{children}</Link>;
}

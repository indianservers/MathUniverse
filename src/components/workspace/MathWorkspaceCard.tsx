import { Link } from "react-router-dom";
import type { CSSProperties } from "react";
import type { MathWorkspaceDefinition } from "../../workspace/mathWorkspaces";
import {
  WorkspaceIcon,
  WorkspaceIllustration,
  mathWorkspaceCardTheme,
} from "./MathWorkspaceIllustrations";
import "./MathWorkspaceCard.css";

export function FeatureChip({ label }: { label: string }) {
  return <span className="mwc-chip">{label}</span>;
}

export function WorkspaceCTA() {
  return (
    <span className="mwc-cta">
      <span>Open Workspace</span>
      <span className="mwc-cta-arrow" aria-hidden="true">
        →
      </span>
    </span>
  );
}

export default function MathWorkspaceCard({
  workspace,
}: {
  workspace: MathWorkspaceDefinition;
}) {
  const theme = mathWorkspaceCardTheme[workspace.id];
  return (
    <Link
      to={workspace.route}
      className="math-workspace-card mwc-card"
      data-workspace={workspace.id}
      style={
        {
          "--workspace-accent": theme.accent,
          "--mwc-accent": theme.accent,
          "--mwc-accent-strong": theme.accentStrong,
          "--mwc-tint": theme.tint,
        } as CSSProperties
      }
    >
      <span className="mwc-formula" aria-hidden="true">
        {workspace.formula}
      </span>
      <div className="mwc-copy">
        <WorkspaceIcon id={workspace.id} className="mwc-icon" />
        <span className="mwc-title">
          <strong>{workspace.name}</strong>
          <em>{workspace.badge}</em>
        </span>
        <small>{workspace.description}</small>
        <span className="mwc-chips">
          {workspace.features.map((feature) => (
            <FeatureChip key={feature} label={feature} />
          ))}
        </span>
        <WorkspaceCTA />
      </div>
      <WorkspaceIllustration id={workspace.id} className="mwc-art" />
    </Link>
  );
}

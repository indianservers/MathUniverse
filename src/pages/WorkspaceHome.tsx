import { ArrowRight, Box, Braces, ChartSpline, Cuboid, Grid3X3, Orbit, Shapes, Sigma, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { WorkspaceSuiteBar } from "../components/workspace/MathWorkspaceNavigation";
import { mathWorkspaces, type MathWorkspaceDefinition } from "../workspace/mathWorkspaces";

const iconByWorkspace = {
  cas: Sigma,
  geometry: Shapes,
  "geometry-3d": Cuboid,
  graphs: ChartSpline,
  "graphs-3d": Orbit,
  shapes: Box,
};

export default function WorkspaceHome() {
  return (
    <main className="workspace-home-shell" data-testid="workspace-suite-home">
      <WorkspaceSuiteBar />
      <section className="workspace-home-hero">
        <div className="workspace-home-copy">
          <span className="workspace-home-eyebrow"><Sparkles />CONNECTED MATH TOOLS</span>
          <h1>One workspace.<br /><em>Six ways to explore.</em></h1>
          <p>Graph, construct, calculate, and investigate without leaving the same focused studio environment.</p>
          <div className="workspace-home-actions">
            <Link to="/workspace/graph">Open Graphs <ArrowRight /></Link>
            <a href="#workspace-tools">View all tools <Grid3X3 /></a>
          </div>
        </div>
        <div className="workspace-home-preview" aria-label="Preview of connected mathematical workspace tools">
          <div className="workspace-preview-grid" />
          <svg viewBox="0 0 680 360" role="img" aria-label="Function curve, geometric construction, and three dimensional surface preview">
            <path d="M26 290 C118 288 145 214 224 219 S350 314 444 172 S574 74 652 42" className="workspace-preview-curve" />
            <polygon points="125,248 225,106 318,248" className="workspace-preview-shape" />
            <circle cx="225" cy="106" r="7" /><circle cx="125" cy="248" r="7" /><circle cx="318" cy="248" r="7" />
            <path d="M402 238 C464 170 527 166 625 222 M402 238 C473 269 550 273 625 222 M402 238 L402 285 M625 222 L625 269 M402 285 C473 317 550 319 625 269" className="workspace-preview-surface" />
          </svg>
          <div className="workspace-preview-formula"><Braces /><span>f(x) = x² − 2x</span></div>
          <div className="workspace-preview-status"><i />All studios ready</div>
        </div>
      </section>

      <section className="workspace-home-tools" id="workspace-tools" aria-labelledby="workspace-tools-title">
        <header>
          <div><span>THE WORKSPACE SUITE</span><h2 id="workspace-tools-title">Choose your tool</h2></div>
          <p>Every studio shares the same compact navigation, focused canvas, and connected mathematical objects.</p>
        </header>
        <div className="workspace-home-grid">
          {mathWorkspaces.map((workspace) => <WorkspaceCard workspace={workspace} key={workspace.id} />)}
        </div>
      </section>
    </main>
  );
}

function WorkspaceCard({ workspace }: { workspace: MathWorkspaceDefinition }) {
  const Icon = iconByWorkspace[workspace.id];
  return (
    <Link to={workspace.route} className="workspace-home-card" style={{ "--card-accent": workspace.accent } as CSSProperties}>
      <span className="workspace-home-card-icon"><Icon /></span>
      <span className="workspace-home-card-content"><small>{workspace.badge}</small><strong>{workspace.name}</strong><span>{workspace.description}</span></span>
      <span className="workspace-home-card-open">Open studio <ArrowRight /></span>
      <span className="workspace-home-card-formula">{workspace.formula}</span>
    </Link>
  );
}

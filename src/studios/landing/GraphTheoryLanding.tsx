import { Link } from "react-router-dom";
import { HandshakeTeaser } from "./StudioLandingTeasers";
import "../landing/studioLanding.css";

export default function GraphTheoryLanding() {
  return (
    <section className="gt-landing" aria-label="Graph Theory landing">
      <div className="gt-landing-grid">
        <HandshakeTeaser />
        <div className="sl-chips">
          <Link className="sl-mini-link" to="/graph-theory?mode=bipartite">Bipartite 2-color</Link>
          <Link className="sl-mini-link" to="/graph-theory?mode=euler">Euler vs Hamiltonian</Link>
          <Link className="sl-mini-link" to="/graph-theory?mode=tree">Grow a spanning tree</Link>
          <Link className="sl-mini-link" to="/graph-theory?mode=path">Shortest path</Link>
          <Link className="sl-mini-link" to="/graph-theory?mode=planar">Uncross edges</Link>
          <Link className="sl-mini-link" to="/graph-theory?directed=1">Directed</Link>
          <Link className="sl-mini-link" to="/graph-theory?directed=0">Undirected</Link>
          <Link className="sl-mini-link" to="/graph-theory?mode=iso">Same shape?</Link>
          <Link className="sl-mini-link" to="/graph-theory?mode=flow">Min-cut</Link>
          <Link className="sl-mini-link" to="/discrete-world/graphs">Discrete Graph Networks</Link>
        </div>
      </div>
    </section>
  );
}

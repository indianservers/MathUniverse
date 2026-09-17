import { Home, LayoutDashboard } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function StudioHomeButtons({
  studioTo,
  studioLabel = "Studio Home",
}: {
  studioTo: string;
  studioLabel?: string;
}) {
  const location = useLocation();
  const studioActive = location.pathname === studioTo || location.pathname === `${studioTo}/`;
  return (
    <nav className="studio-home-btns" aria-label="Home shortcuts">
      <Link className="studio-home-btn" to="/" title="Math Universe home">
        <Home />
        <span>Home</span>
      </Link>
      <Link className={`studio-home-btn${studioActive ? " is-current" : ""}`} to={studioTo} title={studioLabel} aria-current={studioActive ? "page" : undefined}>
        <LayoutDashboard />
        <span>{studioLabel}</span>
      </Link>
    </nav>
  );
}

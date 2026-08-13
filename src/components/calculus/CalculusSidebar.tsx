import { BookOpen, Box, Calculator, ChevronDown, Grid3X3, Hash, Home, Network, Presentation, ScanLine, Shapes, Sigma, Sparkles, Waves, X, type LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

type CalculusSidebarProps = {
  mobileOpen: boolean;
  onClose: () => void;
  variant?: "calculus" | "main";
};

type CalculusNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const calculusLessons: CalculusNavigationItem[] = [
  { label: "Limits", href: "/math/limits-continuity", icon: Sigma },
  { label: "Derivatives", href: "/math/derivatives", icon: Sigma },
  { label: "Derivative Formula Atlas", href: "/math/derivatives/formula-visualizer", icon: Sparkles },
  { label: "Integration", href: "/math/integration", icon: Sigma },
  { label: "Integration Formula Atlas", href: "/math/integration/formula-visualizer", icon: Sparkles },
  { label: "Slope Fields", href: "/math/slope-fields", icon: Sigma },
];

const mainNavigation: CalculusNavigationItem[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Math Workspace", href: "/workspace", icon: Grid3X3 },
  { label: "AI Board", href: "/board", icon: Sparkles },
  { label: "Concept Map", href: "/concept-map", icon: Network },
  { label: "Advanced Study", href: "/advanced-concepts", icon: BookOpen },
  { label: "AR Math Lab", href: "/ar-math-lab", icon: ScanLine },
  { label: "Teacher Studio", href: "/teacher-studio", icon: Presentation },
];

const mathTopics: CalculusNavigationItem[] = [
  { label: "Algebra", href: "/algebra", icon: Calculator },
  { label: "Number Systems", href: "/number-systems", icon: Hash },
  { label: "Geometry", href: "/geometry", icon: Shapes },
  { label: "Trigonometry", href: "/trigonometry", icon: Waves },
];

export default function CalculusSidebar({ mobileOpen, onClose, variant = "calculus" }: CalculusSidebarProps) {
  const { pathname } = useLocation();

  return (
    <>
      {mobileOpen && (
        <button className="limits-nav-backdrop" aria-label="Close navigation" onClick={onClose} />
      )}
      <aside className={`limits-sidebar ${variant === "main" ? "is-main" : ""} ${mobileOpen ? "is-open" : ""}`} aria-label={variant === "main" ? "Main navigation" : "Calculus navigation"}>
        <Link className="limits-brand" to={variant === "main" ? "/" : "/calculus"} onClick={onClose}>
          <Box aria-hidden="true" />
          <span>{variant === "main" ? "Math Universe" : "Interactive Math Lab"}</span>
        </Link>
        <button className="limits-nav-close" onClick={onClose} aria-label="Close navigation">
          <X />
        </button>

        <nav>
          {variant === "main" && <>
            <div className="limits-main-links">
              {mainNavigation.map(({label,href,icon:Icon})=><Link key={href} to={href} className={pathname===href?"is-selected":""} aria-current={pathname===href?"page":undefined} onClick={onClose}><Icon/><span>{label}</span>{pathname===href&&<i aria-hidden="true"/>}</Link>)}
            </div>
            <div className="limits-nav-heading limits-main-heading" aria-label="Math Topics section">
              <Calculator aria-hidden="true" />
              <span>Math Topics</span>
              <ChevronDown aria-hidden="true" />
            </div>
            <div className="limits-main-links limits-topic-links">
              {mathTopics.map(({label,href,icon:Icon})=><Link key={href} to={href} className={pathname===href?"is-selected":""} aria-current={pathname===href?"page":undefined} onClick={onClose}><Icon/><span>{label}</span>{pathname===href&&<i aria-hidden="true"/>}</Link>)}
            </div>
          </>}
          <div className="limits-nav-heading" aria-label="Calculus section, expanded">
            <Sigma aria-hidden="true" />
            <span>Calculus</span>
            <ChevronDown aria-hidden="true" />
          </div>
          <Link
            className={`limits-overview ${pathname === "/calculus" ? "is-selected" : ""}`}
            to="/calculus"
            onClick={onClose}
          >
            <BookOpen aria-hidden="true" />
            <span>Overview + Formula Atlas</span>
            {pathname === "/calculus" && <i aria-hidden="true" />}
          </Link>

          <div className="limits-nav-heading limits-core" aria-label="Core Calculus section, expanded">
            <Sigma aria-hidden="true" />
            <span>Core Calculus</span>
            <ChevronDown aria-hidden="true" />
          </div>
          <div className="limits-lesson-list">
            {calculusLessons.map(({ label, href, icon: Icon }) => {
              const selected = pathname === href;
              return (
                <Link
                  key={href}
                  to={href}
                  className={selected ? "is-selected" : ""}
                  aria-current={selected ? "page" : undefined}
                  onClick={onClose}
                >
                  <Icon aria-hidden="true" />
                  <span>{label}</span>
                  {selected && <i aria-hidden="true" />}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}

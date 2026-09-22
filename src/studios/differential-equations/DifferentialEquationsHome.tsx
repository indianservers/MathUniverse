import { Link } from "react-router-dom";
import { StudioLabCard } from "../mockup/studioHomeLayouts";
import type { StudioMockupDefinition, StudioMockupPage } from "../mockup/studioMockupCatalog";
import "./differentialEquations.css";

const groups: Array<{ title: string; ids: string[] }> = [
  { title: "Foundations", ids: ["explorer", "slope-fields", "initial-value", "method-selector"] },
  { title: "First-order equations", ids: ["separable", "homogeneous-first-order", "exact", "linear-first-order", "bernoulli"] },
  { title: "Higher-order equations", ids: ["higher-order-linear", "undetermined-coefficients", "variation-of-parameters", "cauchy-euler"] },
  { title: "Systems and trajectories", ids: ["systems", "phase-plane"] },
  { title: "Numerical methods", ids: ["euler", "heun", "rk4"] },
  { title: "Engineering models", ids: ["growth-models", "newton-cooling", "mechanical-oscillations", "lcr-circuit"] },
];

export default function DifferentialEquationsHome({ studio }: { studio: StudioMockupDefinition }) {
  const labs = new Map(studio.pages.filter((page) => page.id !== "home").map((page) => [page.id, page]));
  return (
    <div className="odes-groups">
      {groups.map((group) => (
        <section key={group.title}>
          <h2>{group.title}</h2>
          <div className="msk-launch">
            {group.ids.map((id, index) => {
              const item = labs.get(id);
              return item ? <StudioLabCard key={id} item={item as StudioMockupPage} index={index} studioId={studio.id} cta="Open lab" /> : null;
            })}
          </div>
        </section>
      ))}
      <p><Link to="/calculus/differential-equations">The original Calculus differential-equations page remains available.</Link></p>
    </div>
  );
}

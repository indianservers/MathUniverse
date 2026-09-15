import { useMemo, useState } from "react";
import {
  enhancementCounts,
  enhancementsFor,
  type EnhancementKind,
  type StudioEnhancement,
} from "./calculusStudioEnhancements";
import type { CalculusStudioPage } from "./calculusStudioSession";
import { studioRoutes } from "./calculusStudioSession";
import { Link } from "react-router-dom";

const kindLabel: Record<EnhancementKind, string> = {
  ui: "UI",
  ux: "UX",
  content: "Content",
};

export default function CalculusEnhancementIdeas({ page }: { page: CalculusStudioPage }) {
  const [kind, setKind] = useState<EnhancementKind | "all">("all");
  const [open, setOpen] = useState(page !== "home");
  const items = useMemo(() => {
    const list = enhancementsFor(page);
    return kind === "all" ? list : list.filter((item) => item.kind === kind);
  }, [kind, page]);
  const counts = enhancementCounts(page);
  const title = page === "home" ? "50+ UI, UX, and content upgrades" : "UI, UX, and content upgrades";

  return (
    <section className="cs-card cs-enhancements" aria-labelledby="cs-enhancements-title">
      <header>
        <div>
          <h2 id="cs-enhancements-title">{title}</h2>
          <p>
            {counts.total} ideas · {counts.ui} UI · {counts.ux} UX · {counts.content} content
            {page === "home" ? " · 20+ in every studio" : " in this studio"}
          </p>
        </div>
        <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
          {open ? "Hide list" : "Show list"}
        </button>
      </header>
      {open ? (
        <>
          <div className="cs-enhancement-filters" role="tablist" aria-label="Enhancement type">
            {(["all", "ui", "ux", "content"] as const).map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                className={kind === item ? "active" : ""}
                aria-selected={kind === item}
                onClick={() => setKind(item)}
              >
                {item === "all" ? `All (${counts.total})` : `${kindLabel[item]} (${counts[item]})`}
              </button>
            ))}
          </div>
          {page === "home" ? <HomeByTopic /> : <EnhancementList items={items} />}
        </>
      ) : null}
    </section>
  );
}

function HomeByTopic() {
  return (
    <div className="cs-enhancement-topics">
      {(["limits", "derivatives", "derivative-applications", "integration", "integration-techniques", "integral-applications", "differential-equations", "series-parametric-polar", "multivariable-vector", "advanced"] as const).map((page) => {
        const items = enhancementsFor(page);
        const counts = enhancementCounts(page);
        return (
          <article key={page} className="cs-enhancement-topic">
            <h3>
              <Link to={studioRoutes[page]}>{topicTitle(page)}</Link>
              <small>{counts.total} ideas</small>
            </h3>
            <EnhancementList items={items} />
          </article>
        );
      })}
    </div>
  );
}

function EnhancementList({ items }: { items: StudioEnhancement[] }) {
  return (
    <ol className="cs-enhancement-list">
      {items.map((item) => (
        <li key={item.id}>
          <b data-kind={item.kind}>{kindLabel[item.kind]}</b>
          <strong>{item.title}</strong>
          <span>{item.detail}</span>
        </li>
      ))}
    </ol>
  );
}

function topicTitle(page: Exclude<CalculusStudioPage, "home">) {
  const titles: Record<Exclude<CalculusStudioPage, "home">, string> = {
    limits: "Limits",
    derivatives: "d⁄dx Derivatives",
    "derivative-applications": "Derivative Applications",
    integration: "∫ Integration",
    "integration-techniques": "Integration Techniques",
    "integral-applications": "Integral Applications",
    "differential-equations": "Differential Equations",
    "series-parametric-polar": "Σ Series / Parametric / Polar",
    "multivariable-vector": "Multivariable / Vector",
    advanced: "Advanced Calculus",
  };
  return titles[page];
}

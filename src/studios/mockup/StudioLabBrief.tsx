import type { StudioMockupPage } from "./studioMockupCatalog";
import { studioTheoryContent } from "./studioTheoryContent";
import "./StudioLabBrief.css";

export default function StudioLabBrief({ studioId, page }: { studioId: string; page: StudioMockupPage }) {
  if (page.id === "home") return null;
  const theory = studioTheoryContent[studioId]?.[page.id];
  if (!theory) return null;
  return (
    <section className="studio-lab-brief" aria-label={`${page.label} lab guide`}>
      <div className="studio-lab-brief__concept">
        <span>ABOUT THIS LAB</span>
        <strong>{page.description}</strong>
        <p>{theory.principle}</p>
      </div>
      <div className="studio-lab-brief__try">
        <span>TRY THIS</span>
        <p>{page.learning.try}{page.learning.try.trim().length < 25 ? ` ${theory.method}` : ""}</p>
      </div>
    </section>
  );
}

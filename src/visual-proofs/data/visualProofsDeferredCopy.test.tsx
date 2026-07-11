import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import CategoryCard from "../components/CategoryCard";
import ProofCard from "../components/ProofCard";
import { visualProofCategories } from "./visualProofCategories";
import { visualProofsIndex } from "./visualProofsIndex";

const bannedDeferredCopy = /coming soon|placeholder|under construction|not implemented/i;

describe("Visual Proofs deferred route copy", () => {
  it("keeps roadmap metadata honest without unfinished wording", () => {
    for (const proof of visualProofsIndex) {
      const visibleMetadata = [
        proof.title,
        proof.shortDescription,
        proof.longDescription,
        proof.estimatedTime,
        proof.tags.join(" "),
      ].join(" ");

      expect(visibleMetadata, proof.route).not.toMatch(bannedDeferredCopy);
    }
  });

  it("renders planned proof cards as roadmap routes", () => {
    const plannedProof = { ...visualProofsIndex[0], status: "coming-soon" as const, estimatedTime: "Roadmap" };
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <ProofCard proof={plannedProof} />
      </MemoryRouter>,
    );

    expect(html).toContain("Planned proof");
    expect(html).toContain("Open Roadmap");
    expect(html).not.toMatch(bannedDeferredCopy);
  });

  it("renders planned category cards without coming-soon labels", () => {
    const plannedCategory = { ...visualProofCategories[0], status: "coming-soon" as const };
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <CategoryCard category={plannedCategory} />
      </MemoryRouter>,
    );

    expect(html).toContain("Planned");
    expect(html).not.toMatch(bannedDeferredCopy);
  });
});

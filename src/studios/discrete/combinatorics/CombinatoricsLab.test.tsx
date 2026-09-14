import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "../../mockup/MockupStudioApp";

function renderCombo(url: string) {
  return renderToString(
    <MemoryRouter initialEntries={[url]}>
      <MockupStudioApp studioId="discrete" />
    </MemoryRouter>,
  );
}

describe("Combinatorics Lab", () => {
  it("keeps Number & Discrete chrome and defaults to Arrangements", () => {
    const html = renderCombo("/discrete-world/combinatorics");
    expect(html).toContain("Combinatorics Lab");
    expect(html).toContain("Number &amp; Discrete");
    expect(html).toContain("Order matters");
    expect(html).toContain("Arrangement stage");
    expect(html).not.toContain("C(5,3) sits in Pascal row");
  });

  it("opens each mode with a distinct visualization", () => {
    const arrangements = renderCombo("/discrete-world/combinatorics?mode=arrangements");
    const selections = renderCombo("/discrete-world/combinatorics?mode=selections");
    const pigeon = renderCombo("/discrete-world/combinatorics?mode=pigeonhole");
    const ie = renderCombo("/discrete-world/combinatorics?mode=inclusion-exclusion");
    const tree = renderCombo("/discrete-world/combinatorics?mode=generating-tree");

    expect(arrangements).toContain("Arrangement stage");
    expect(arrangements).toContain("P(n,r)");
    expect(arrangements).toContain("Ordered slots");
    expect(arrangements).toContain("4 choices");
    expect(selections).toContain("Selection tray");
    expect(selections).toContain("C(n,r)");
    expect(pigeon).toContain("Containers");
    expect(pigeon).toContain("ceil(n/m)");
    expect(ie).toContain("Venn diagram");
    expect(ie).toContain("|A ∪ B|");
    expect(tree).toContain("Generating tree");
    expect(tree).toContain("Valid leaves");
  });

  it("accepts catalog labels and Pascal lives under Selections", () => {
    expect(renderCombo("/discrete-world/combinatorics?mode=Arrangements")).toContain("Arrangement stage");
    const pascal = renderCombo("/discrete-world/combinatorics?mode=selections&kind=pascal");
    expect(pascal).toContain("Pascal connection");
    expect(pascal).toContain("C(n,k)=C(n−1,k−1)+C(n−1,k)");
    expect(renderCombo("/discrete-world/combinatorics?mode=Inclusion-Exclusion")).toContain("Venn diagram");
    expect(renderCombo("/discrete-world/combinatorics?mode=Generating Tree")).toContain("Binary strings");
  });
});

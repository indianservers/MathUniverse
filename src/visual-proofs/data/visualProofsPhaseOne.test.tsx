import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { VisualProofShell } from "../components/VisualProofShell";
import { phaseTwoRouteSlugs } from "../proofs/phase-two/phaseTwoProofConfigs";
import { visualProofCategories } from "./visualProofCategories";
import { getVisualProof, visualProofsIndex } from "./visualProofsIndex";

describe("Visual Proofs phase architecture metadata", () => {
  it("keeps the documented route inventory intact", () => {
    expect(visualProofsIndex).toHaveLength(185);
    expect(visualProofsIndex.filter((proof) => proof.status === "available")).toHaveLength(185);
    expect(visualProofsIndex.filter((proof) => proof.status === "coming-soon")).toHaveLength(0);
    expect(visualProofCategories).toHaveLength(18);
  });

  it("adds future upgrade metadata to every proof without breaking routes", () => {
    for (const proof of visualProofsIndex) {
      expect(proof.route).toBe(`/visual-proofs/${proof.categorySlug}/${proof.slug}`);
      expect(proof.proofLearningModel).toBeTruthy();
      expect(proof.proofUpgradeStatus).toBeTruthy();
      expect(typeof proof.misconceptionCheckCount).toBe("number");
      expect(typeof proof.hasTeacherMode).toBe("boolean");
      expect(typeof proof.hasKeyboardControls).toBe("boolean");
      expect(typeof proof.hasStateInspector).toBe("boolean");
      expect(typeof proof.hasOlympyardPracticeExit).toBe("boolean");
      expect(typeof proof.hasVisualRegressionTest).toBe("boolean");
    }
  });

  it("marks the phase two beginner cluster as upgraded", () => {
    for (const [categorySlug, proofSlug] of phaseTwoRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof?.hasKeyboardControls).toBe(true);
      expect(proof?.hasStateInspector).toBe(true);
      expect(proof?.hasTeacherMode).toBe(true);
      expect(proof?.hasOlympyardPracticeExit).toBe(true);
    }
  });

  it("renders the shared VisualProofShell landmarks used by phase two routes", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter>
        <VisualProofShell
          title="Shell smoke proof"
          difficulty="Beginner"
          category="Smoke"
          route="/visual-proofs/smoke/proof"
          steps={[{ id: "one", title: "One", description: "First step", focusLabel: "visual" }]}
          activeStep={0}
          canvasContent={<div>primary visual</div>}
          formulaPanel={<section>formula panel</section>}
          controlsContent={<button type="button">Reset</button>}
          stateInspector={<section>inspector</section>}
        />
      </MemoryRouter>,
    );
    expect(html).toContain("data-visual-proof-canvas");
    expect(html).toContain("data-visual-proof-controls");
    expect(html).toContain("Step timeline");
  });
});

import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import MockupStudioApp from "../mockup/MockupStudioApp";
import { allStudiosAtLeast, scoredStudios, studioMean } from "./studioWorldClassScore";

describe("studio world-class score bar", () => {
  it("reports bounded provisional ratings without enforcing invented excellence",()=>{expect(scoredStudios).toHaveLength(19);expect(allStudiosAtLeast(90)).toBe(false);for(const studio of scoredStudios){expect(studioMean(studio)).toBeGreaterThan(0);expect(studioMean(studio)).toBeLessThanOrEqual(100);}});

  it("scored mockup labs expose their selected mode canvas", () => {
    const samples: Array<[string, string]> = [
      ["geometry", "/geometry/proofs"],
      ["trigonometry", "/trigonometry/graphs"],
      ["trigonometry", "/trigonometry/identities"],
      ["linear-algebra", "/linear-algebra/vectors"],
      ["complex-numbers", "/complex-numbers/polar-forms"],
      ["modelling", "/mathematical-modelling/population"],
      ["discrete", "/discrete-world/modular-arithmetic"],
    ];
    for (const [studioId, route] of samples) {
      const html = renderToString(
        <MemoryRouter initialEntries={[route]}>
          <MockupStudioApp studioId={studioId} />
        </MemoryRouter>,
      );


      expect(html, route).toContain("data-mode-canvas");
    }
  });
});

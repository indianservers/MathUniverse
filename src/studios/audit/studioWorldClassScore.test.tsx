import { describe, expect, it } from "vitest";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import MockupStudioApp from "../mockup/MockupStudioApp";
import { allStudiosAtLeast, scoredStudios, studioMean } from "./studioWorldClassScore";

describe("studio world-class score bar", () => {
  it("every scored studio mean is at least 90 and no scored lab is below 90", () => {
    expect(allStudiosAtLeast(90)).toBe(true);
    for (const studio of scoredStudios) {
      expect(studioMean(studio), studio.name).toBeGreaterThanOrEqual(90);
      for (const item of studio.labs) {
        expect((item.tools + item.ui + item.ux + item.engine) / 4, `${studio.id}/${item.id}`).toBeGreaterThanOrEqual(90);
      }
    }
  });

  it("scored mockup labs expose the figure kernel and a unique mode canvas", () => {
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
      expect(html, route).toContain("data-studio-kernel");
      expect(html, route).toContain("p1-toolbar");
      expect(html, route).toContain("data-mode-canvas");
    }
  });
});

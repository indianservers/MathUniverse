import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { honestProgressLabel, landingProgressPercent, relativeOpened } from "./studioLandingSession";
import { hasLandingTeaser, LandingTeaser } from "./StudioLandingTeasers";
import MockupStudioApp from "../mockup/MockupStudioApp";

describe("studio landing kit", () => {
  it("never fakes empty progress as 42%", () => {
    expect(honestProgressLabel(0, false)).toBe("0% · not started");
    expect(landingProgressPercent(10, [])).toBe(0);
    expect(relativeOpened(0)).toBe("Not started yet");
  });

  it("registers live teasers for each mockup studio", () => {
    expect(hasLandingTeaser("geometry", "construction")).toBe(true);
    expect(hasLandingTeaser("trigonometry", "identities")).toBe(true);
    expect(hasLandingTeaser("linear-algebra", "eigenvectors")).toBe(true);
    expect(hasLandingTeaser("complex-numbers", "roots")).toBe(true);
    expect(hasLandingTeaser("modelling", "epidemics")).toBe(true);
    expect(hasLandingTeaser("discrete", "primes")).toBe(true);
    expect(hasLandingTeaser("statistics", "descriptive")).toBe(true);
  });

  it("renders a teaser without crashing", () => {
    const html = renderToString(<LandingTeaser studioId="geometry" labId="construction" />);
    expect(html).toContain("Drag A");
  });
});

describe("studio homes gained landing extras", () => {
  it("geometry home has a live bisector and class pin", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/geometry"]}><MockupStudioApp studioId="geometry" /></MemoryRouter>);
    expect(html).toContain("Local class pin");
    expect(html).toContain("This week");
    expect(html).toContain("Prove this");
  });

  it("modelling home does not claim a fake 2h edit", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/mathematical-modelling"]}><MockupStudioApp studioId="modelling" /></MemoryRouter>);
    expect(html).not.toContain("Last edited 2h ago");
    expect(html).toContain("Not started yet");
  });

  it("statistics home lists toy datasets", () => {
    const html = renderToString(<MemoryRouter initialEntries={["/probability-statistics"]}><MockupStudioApp studioId="statistics" /></MemoryRouter>);
    expect(html).toContain("Heights");
    expect(html).not.toContain("Overall progress 42%");
  });
});

import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import InquirySimulationLabs from "./InquirySimulationLabs";

describe("InquirySimulationLabs", () => {
  it("renders Grade 6 guidance, prediction controls, and live summary support", () => {
    const html = renderToStaticMarkup(<InquirySimulationLabs />);

    expect(html).toContain("Try this first");
    expect(html).toContain("Common mistake");
    expect(html).toContain("role=\"radiogroup\"");
    expect(html).toContain("aria-live=\"polite\"");
    expect(html).toContain("Teacher notes");
  });

  it("keeps keyboard-friendly buttons for lab switching and prediction choices", () => {
    const html = renderToStaticMarkup(<InquirySimulationLabs />);

    expect(html).toContain("Ramp Slope Inquiry");
    expect(html).toContain("Slope increases");
    expect(html).toContain("role=\"radio\"");
    expect(html).toContain("Check prediction");
  });
});

import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import StudioProjectCenter from "./StudioProjectCenter";

describe("Studio Project Center", () => {
  it("renders ten working platform capabilities and four labelled controls", () => {
    const html = renderToString(<MemoryRouter><StudioProjectCenter /></MemoryRouter>);
    expect(html.match(/data-enhancement-id="PLATFORM-/g)).toHaveLength(10);
    expect(html.match(/<input/g)).toHaveLength(4);
    expect(html).toContain("Shared project format");
    expect(html).toContain("Teacher activities and analytics");
    expect(html).toContain("Adaptive performance");
  });
});

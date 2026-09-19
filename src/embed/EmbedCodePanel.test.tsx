import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import EmbedCodePanel from "./EmbedCodePanel";
import { defaultScene } from "./engine";

describe("EmbedCodePanel", () => {
  it("shows iframe, script, URL, and preview for a graph scene", () => {
    const markup = renderToStaticMarkup(
      <EmbedCodePanel scene={defaultScene("twodgraph")} origin="https://maths.indianservers.com" onClose={() => undefined} />,
    );
    expect(markup).toContain("Embed on a website");
    expect(markup).toContain("Copy iframe");
    expect(markup).toContain("Copy script");
    expect(markup).toContain("Copy URL");
    expect(markup).toContain("/embed.html?kind=twodgraph");
    expect(markup).toContain("TwoDGraph.embed");
  });
});

import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import MockupStudioApp from "./MockupStudioApp";

describe("trigonometry home topic links", () => {
  it("makes each visible topic a single link containing its icon and title", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/trigonometry"]}>
        <MockupStudioApp studioId="trigonometry" />
      </MemoryRouter>,
    );
    const topics = ["unit-circle", "right-triangle", "graphs", "identities", "inverse", "oblique", "waves", "applications"];
    expect(html.match(/class="msk-trig-topic-tile"/g)).toHaveLength(topics.length);
    for (const id of topics) {
      const card = html.match(new RegExp(`<a class="msk-trig-topic-tile"[^>]*data-lab-id="${id}"[^>]*>[\\s\\S]*?<\\/a>`))?.[0];
      expect(card, id).toBeTruthy();
      expect(card).toContain(`href="/trigonometry/${id}"`);
      expect(card).toContain("<svg");
      expect(card).toContain("<strong>");
    }
  });
});

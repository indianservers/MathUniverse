import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import SetTheory from "./SetTheory";

describe("Set Theory studio route", () => {
  it("renders the dedicated studio without throwing", () => {
    const html = renderToString(
      <MemoryRouter initialEntries={["/set-theory"]}>
        <SetTheory />
      </MemoryRouter>,
    );
    expect(html).toContain("Set Theory Studio");
    expect(html).toContain("Set Theory landing");
  });
});

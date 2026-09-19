import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppFooter, HOME_APP_VERSION } from "./AppLayout";

describe("home page footer", () => {
  it("shows Version 1.001 on the home page", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/"]}>
        <AppFooter />
      </MemoryRouter>,
    );
    expect(HOME_APP_VERSION).toBe("1.001");
    expect(html).toContain("Version 1.001");
    expect(html).toContain('data-testid="home-app-version"');
  });

  it("does not show the home version stamp on other pages", () => {
    const html = renderToStaticMarkup(
      <MemoryRouter initialEntries={["/about"]}>
        <AppFooter />
      </MemoryRouter>,
    );
    expect(html).not.toContain("Version 1.001");
  });
});

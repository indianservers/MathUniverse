import { describe, expect, it } from "vitest";
import { continueComplexHref, COMPLEX_SEARCH_ALIASES, readComplexSession } from "./complexStudioSession";

describe("complex studio session", () => {
  it("resumes Argand Plane and maps polar aliases", () => {
    const session = readComplexSession();
    expect(continueComplexHref(session)).toBe("/complex-numbers/argand-plane");
    expect(COMPLEX_SEARCH_ALIASES.cis?.id).toBe("polar-forms");
    expect(COMPLEX_SEARCH_ALIASES.julia?.mode).toBe("Julia Set");
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { copyStudioLink, shareStudio } from "./shareStudio";

afterEach(() => vi.unstubAllGlobals());
describe("studio sharing feedback", () => {
  it("copies the actual link and reports success", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    expect(await shareStudio("Studio", "https://example.test/?mode=roots")).toBe("Link copied.");
    expect(writeText).toHaveBeenCalledWith("https://example.test/?mode=roots");
  });
  it("provides a selectable link when clipboard access is denied", async () => {
    vi.stubGlobal("navigator", { clipboard: { writeText: vi.fn().mockRejectedValue(new Error("Denied")) } });
    expect(await copyStudioLink("https://example.test/")).toBe("Copy this link: https://example.test/");
  });
  it("handles native share cancellation without an unhandled rejection", async () => {
    vi.stubGlobal("navigator", { share: vi.fn().mockRejectedValue(Object.assign(new Error("Cancelled"), { name: "AbortError" })) });
    expect(await shareStudio("Studio", "https://example.test/")).toBe("Sharing cancelled.");
  });
});

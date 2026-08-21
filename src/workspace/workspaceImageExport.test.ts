import { describe, expect, it, vi } from "vitest";
import { copyPreparedImage, imageFilename, nativeSharePreparedImage, releasePreparedImage } from "./workspaceImageExport";

describe("workspace image export helpers", () => {
  it("creates dated PNG and JPEG filenames", () => {
    vi.useFakeTimers(); vi.setSystemTime(new Date("2026-08-20T10:30:00"));
    expect(imageFilename("2d-geometry", "png")).toBe("2d-geometry-2026-08-20-1030.png");
    expect(imageFilename("cas-workspace", "jpeg")).toBe("cas-workspace-2026-08-20-1030.jpg");
    vi.useRealTimers();
  });

  it("releases image preview URLs", () => {
    const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    releasePreparedImage({ blob: new Blob(), filename: "x.png", width: 10, height: 10, format: "png", scale: 1, background: "white", previewUrl: "blob:test" });
    expect(revoke).toHaveBeenCalledWith("blob:test");
    revoke.mockRestore();
  });

  it("returns clear fallbacks when clipboard and native file sharing are unavailable", async () => {
    const image = { blob: new Blob(["image"], { type: "image/png" }), filename: "x.png", width: 10, height: 10, format: "png" as const, scale: 1 as const, background: "white" as const, previewUrl: "blob:test" };
    await expect(copyPreparedImage(image)).rejects.toThrow("Copy Image is not supported");
    await expect(nativeSharePreparedImage(image, "Test")).rejects.toThrow("Image sharing is not supported");
  });
});

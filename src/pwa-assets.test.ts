import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("PWA assets", () => {
  it("declares a browser-only install manifest", () => {
    const manifest = JSON.parse(readFileSync(resolve("public/manifest.webmanifest"), "utf8")) as { name: string; display: string; icons: { src: string }[] };

    expect(manifest.name).toBe("Math Universe");
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.some((icon) => icon.src === "/math-universe-icon.svg")).toBe(true);
  });

  it("caches the app shell and asset chunks in the service worker", () => {
    const serviceWorker = readFileSync(resolve("public/sw.js"), "utf8");

    expect(serviceWorker).toContain("math-universe-v3-2026-06-10");
    expect(serviceWorker).toContain("/manifest.webmanifest");
    expect(serviceWorker).toContain("/assets/");
    expect(serviceWorker).toContain("request.mode === \"navigate\"");
  });
});

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

  it("keeps the temporary no-cache service worker contract", () => {
    const serviceWorker = readFileSync(resolve("public/sw.js"), "utf8");

    expect(serviceWorker).toContain("caches.delete");
    expect(serviceWorker).toContain("self.registration.unregister");
    expect(serviceWorker).toContain("client.navigate(client.url)");
    expect(serviceWorker).toContain("self.addEventListener(\"fetch\"");
    expect(serviceWorker).not.toContain("math-universe-v3-2026-06-10");
    expect(serviceWorker).not.toContain("request.mode === \"navigate\"");
  });
});

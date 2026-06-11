import { describe, expect, it } from "vitest";
import { mobileNativeCapabilities, mobileNativeCommandPlan, mobileNativeReadinessScore } from "./mobileNativeReadiness";

describe("mobile native readiness", () => {
  it("tracks launch-critical mobile native capabilities", () => {
    expect(mobileNativeCapabilities.map((item) => item.id)).toEqual([
      "capacitor-shell",
      "native-runtime-bridge",
      "safe-area-layout",
      "offline-shell",
      "store-assets",
    ]);
    expect(mobileNativeReadinessScore()).toBe(70);
  });

  it("documents the native app command flow", () => {
    expect(mobileNativeCommandPlan()).toContain("npm run mobile:sync");
    expect(mobileNativeCommandPlan()).toContain("npm run mobile:open:android");
    expect(mobileNativeCommandPlan()).toContain("npm run mobile:open:ios");
  });
});

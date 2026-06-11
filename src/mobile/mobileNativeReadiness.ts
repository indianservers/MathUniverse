export type MobileNativeCapability = {
  id: string;
  title: string;
  status: "ready" | "partial" | "planned";
  evidence: string;
};

export const mobileNativeCapabilities: MobileNativeCapability[] = [
  {
    id: "capacitor-shell",
    title: "Android/iOS shell",
    status: "ready",
    evidence: "Capacitor config points native builds at the Vite dist bundle with app id com.indianservers.mathuniverse.",
  },
  {
    id: "native-runtime-bridge",
    title: "Native runtime bridge",
    status: "ready",
    evidence: "Startup detects native platforms, applies platform CSS classes, configures status bar, keyboard, and hardware back handling.",
  },
  {
    id: "safe-area-layout",
    title: "Safe-area layout",
    status: "ready",
    evidence: "Native shell CSS respects env(safe-area-inset-*) and hides bottom floating UI while the keyboard is open.",
  },
  {
    id: "offline-shell",
    title: "Offline shell",
    status: "partial",
    evidence: "PWA manifest and service worker assets exist; native offline packaging uses bundled dist assets after mobile sync.",
  },
  {
    id: "store-assets",
    title: "Store assets",
    status: "planned",
    evidence: "Native platform folders can be generated; store screenshots, adaptive icons, signing, and release metadata remain release tasks.",
  },
];

export function mobileNativeReadinessScore(capabilities = mobileNativeCapabilities) {
  const weights = { ready: 1, partial: 0.5, planned: 0 };
  const earned = capabilities.reduce((total, item) => total + weights[item.status], 0);
  return Math.round((earned / capabilities.length) * 100);
}

export function mobileNativeCommandPlan() {
  return [
    "npm run mobile:add:android",
    "npm run mobile:add:ios",
    "npm run mobile:sync",
    "npm run mobile:open:android",
    "npm run mobile:open:ios",
  ];
}

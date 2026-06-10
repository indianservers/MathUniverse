import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["math-universe-icon.svg", "robots.txt", "sitemap.xml"],
      manifest: {
        name: "Math Universe",
        short_name: "Math Universe",
        description: "Browser-only interactive math labs, simulations, and workspaces.",
        theme_color: "#07111f",
        background_color: "#07111f",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/math-universe-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("@react-three")) return "vendor-react-3d";
          if (id.includes("three")) return "vendor-three";
          if (id.includes("recharts")) return "vendor-charts";
          if (id.includes("nerdamer")) return "vendor-cas";
          if (id.includes("katex")) return "vendor-math-rendering";
          if (id.includes("lucide-react")) return "vendor-icons";
          return undefined;
        },
      },
    },
  },
});

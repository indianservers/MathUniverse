import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
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

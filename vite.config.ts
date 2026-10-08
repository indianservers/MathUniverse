/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import {loadEnv} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({command,mode})=>({
  plugins: [react(),{
    name:'exclude-student-training',enforce:'pre',
    transform(_code,id){const env=loadEnv(mode,process.cwd(),'VITE_');if(command==='build'&&env.VITE_ENABLE_MODEL_TRAINING!=='true'&&id.replace(/\\/g,'/').endsWith('/src/pages/ModelTraining.tsx'))return 'export default function TrainingDisabled(){return null;}';},
    generateBundle(_options,bundle){const env=loadEnv(mode,process.cwd(),'VITE_');if(command==='build'&&env.VITE_ENABLE_MODEL_TRAINING!=='true')for(const [name] of Object.entries(bundle))if(/(?:^|\/)training\.worker-/.test(name))delete bundle[name];}
  }],
  test: {
    setupFiles: ["./src/test/setup.ts"],
  },
  worker: {format:'es'},
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
}));

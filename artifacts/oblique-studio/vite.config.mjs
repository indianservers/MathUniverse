import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';
export default defineConfig({plugins:[react()],publicDir:false,build:{outDir:'artifacts/oblique-studio/production',lib:{entry:resolve('src/studios/trigonometry/oblique/ObliqueStudio.tsx'),formats:['es'],fileName:'oblique-studio'},rollupOptions:{external:['react','react-dom','react-router-dom']},minify:'esbuild'}});

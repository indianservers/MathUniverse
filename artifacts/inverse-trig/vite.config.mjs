import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'node:path';
export default defineConfig({plugins:[react()],publicDir:false,build:{outDir:'artifacts/inverse-trig/production',lib:{entry:resolve('src/studios/trigonometry/inverse/InverseTrigStudio.tsx'),formats:['es'],fileName:'inverse-trig'},rollupOptions:{external:['react','react-dom','react-router-dom']},minify:'esbuild'}});

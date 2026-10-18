import { defineConfig, mergeConfig, loadEnv } from 'vite';
import applicationConfig from '../vite.config.ts';
export default defineConfig(environment => {
  const config=applicationConfig(environment);
  // Match the application's production training exclusion, reading env once.
  config.plugins=config.plugins.filter(plugin=>plugin?.name!=='exclude-student-training');
  if(environment.command==='build' && loadEnv(environment.mode,process.cwd(),'VITE_').VITE_ENABLE_MODEL_TRAINING!=='true') config.plugins.push({
    name:'audit-student-training-exclusion',enforce:'pre',
    transform(_code,id){if(id.replaceAll('\\','/').endsWith('/src/pages/ModelTraining.tsx'))return 'export default function TrainingDisabled(){return null;}';},
    generateBundle(_options,bundle){for(const name of Object.keys(bundle))if(/(?:^|\/)training\.worker-/.test(name))delete bundle[name];},
  });
  let transformed=0;
  if(environment.command==='build')config.plugins.push({name:'audit-build-progress',enforce:'post',transform(){if(++transformed%250===0)console.log(`Audit build: ${transformed} modules transformed`);}});
  return mergeConfig(config, {
  cacheDir: 'node_modules/.vite-lesson-layout-audit',
  optimizeDeps: { entries: ['index.html'] },
  server: { hmr: false, watch: { ignored: ['**/artifacts/**', '**/dist*/**', '**/audit/**'] } },
  });
});

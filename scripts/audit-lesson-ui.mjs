import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { createServer } from 'vite';

// Read the live catalogs rather than inferring routes from filenames.
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { lessonCatalog } = await server.ssrLoadModule('/src/modules/lessons/catalog/lessonCatalog.ts');
  const { schoolLessonCatalog } = await server.ssrLoadModule('/src/modules/lessons/catalog/school/schoolSyllabusCatalog.ts');
  const { advancedConceptLessons } = await server.ssrLoadModule('/src/modules/lessons/catalog/advanced/advancedConceptLessons.ts');
  const routes = [...lessonCatalog, ...schoolLessonCatalog, ...advancedConceptLessons].map(x => ({ id: x.numericId ?? x.id, name: x.title, route: x.route, shared: x.adapter ?? (x.numericId >= 10000 ? 'SchoolLessonPage' : 'AdvancedConceptLessonPage') }));
  const files = readdirSync('src/modules/lessons', { recursive: true }).filter(x => /\.(css|tsx)$/.test(x));
  const findings = files.flatMap(file => {
    const source = readFileSync(`src/modules/lessons/${file}`, 'utf8');
    const tiny = [...source.matchAll(/(?:font-size:\s*|text-\[)([0-9]+)px/g)].filter(x => +x[1] < 13).length;
    const fixed = [...source.matchAll(/min-height:\s*([0-9]+)px/g)].filter(x => +x[1] >= 180).length;
    return tiny || fixed ? [{ file, tinyDeclarations: tiny, largeMinimumHeights: fixed }] : [];
  });
  const graphInventory = readFileSync('docs/GRAPH_LESSON_INVENTORY.md', 'utf8');
  mkdirSync('test-evidence/lesson-ui-ux', { recursive: true });
  writeFileSync('test-evidence/lesson-ui-ux/inventory.json', JSON.stringify({ routes, findings, graphInventoryLinks: [...graphInventory.matchAll(/\]\(http[^)]+\)/g)].length }, null, 2));
  const report = `# Lesson UI / UX redesign status\n\n## Audit before redesign\n\n- [x] Enumerate live catalogs: ${lessonCatalog.length} core, ${schoolLessonCatalog.length} school, ${advancedConceptLessons.length} advanced (${routes.length} total).\n- [x] Read GRAPH_LESSON_INVENTORY.md; source inventory is not browser verification.\n- [x] Inspect route families in App.tsx, LessonShell, SchoolLessonPage, AdvancedConceptLessonPage, LessonSurface and AdapterFrame.\n- [x] Inspect shared typography, cards, controls and responsive rules in index.css. Existing broad !important rules force full width and can defeat local styles.\n- [x] Scan dedicated CSS / TSX: ${findings.length} files flagged for small type or artificial minimum height (see inventory.json).\n- [x] Identify pilot: Cramer's Rule 10198; 8px body, 7–13px labels, 735px artboard, 380px determinant cards, four narrow practice columns, missing dark palette, negative top offsets.\n- [ ] Browser-review every route and record its own baseline before editing it.\n- [ ] Verify every interaction and all eight requested viewport sizes per lesson.\n- [ ] Recheck shared consumers, tests, lint and production build.\n\n## Shared system and rollout\n\nExisting LessonShell / LessonSectionJourney own navigation; AdapterFrame and SectionCard provide panels; FormulaBlock / MathExpression provide notation. Dedicated targets often bypass these. Pilot an opt-in LessonStudio presentation layer (shell, panels, responsive grids, controls and result tokens). Preserve engines and opt in one lesson at a time. Do not globally alter graph geometry, hide content, or mark source scans as visual verification.\n\n## Per-lesson tracking\n\nAn em dash means not tested / no evidence yet. Every pending route requires a browser baseline, individual review and interaction checks. Detailed pilot evidence is linked below when available.\n\n| Lesson ID | Lesson name | Route | Baseline screenshot | Main UI/UX problems | Shared components used | Lesson-specific changes | Controls tested | Desktop status | Tablet status | Mobile status | Console status | Final screenshot | Final status | Notes |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n` + routes.map(x => `| ${x.id} | ${x.name.replaceAll('|', '\\|')} | ${x.route} | — | Browser audit pending | ${x.shared} | — | — | Not started | Not started | Not started | — | — | Not started | Source inventory only |`).join('\n') + '\n';
  // Never replace accumulated browser evidence with a fresh source-only report.
  if (!existsSync('docs/LESSON_UI_UX_REDESIGN_STATUS.md')) writeFileSync('docs/LESSON_UI_UX_REDESIGN_STATUS.md', report);
  console.log(JSON.stringify({ routes: routes.length, flaggedFiles: findings.length }));
} finally { await server.close(); }

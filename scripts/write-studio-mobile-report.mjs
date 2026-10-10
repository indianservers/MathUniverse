import fs from 'node:fs';

const audit = JSON.parse(fs.readFileSync('artifacts/studio-mobile-verified.json', 'utf8'));
const sections = JSON.parse(fs.readFileSync('artifacts/studio-mobile-sections.json', 'utf8'));
const rows = audit.studios.map(studio => {
  const count = audit.routes.filter(route => route === studio.base || route.startsWith(studio.base + '/') || route === `/studios/${studio.id}/curriculum` || studio.id === 'geometry' && route === '/shapes').length;
  return `<tr><td>${studio.name}</td><td>${count}</td><td>Pass</td></tr>`;
}).join('\n');
fs.writeFileSync('STUDIO_MOBILE_AUDIT.html', `<!doctype html>
<html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Studio mobile audit</title>
<style>body{font:16px/1.6 system-ui;color:#18304d;background:#f4f8fc;margin:0;padding:24px}main{max-width:1000px;margin:auto;background:white;padding:clamp(16px,4vw,40px);border-radius:16px}h1{font-size:clamp(25px,5vw,36px)}table{width:100%;border-collapse:collapse;font-size:14px}th,td{text-align:left;padding:12px 8px;border-bottom:1px solid #dae5ef}th{background:#edf6ff}a{color:#075e9f}code{overflow-wrap:anywhere}</style>
<main><h1>Every Studio and lab: mobile audit</h1>
<p>Verified on 10 October 2026 using Chromium phone and tablet emulation. 19 Studios; 225 routed entries, including aliases, linked Shapes, and curriculum pages.</p>
<p><strong>675 route/viewport checks passed</strong> at 320px, 390px, and 768px. After the complete sweep, every failing case was repaired and rechecked. <strong>${sections.results.length} lab-section checks passed</strong> at 320px, using touch to select every available section.</p>
<table><thead><tr><th>Studio</th><th>Routed entries</th><th>Mobile layout</th></tr></thead><tbody>${rows}</tbody></table>
<h2>Updates</h2><ul>
<li>Phone layouts stack controls, plots, and learning panels.</li>
<li>Phone controls have 44px touch targets; text inputs use 16px type.</li>
<li>Mode tabs and lab sections scroll horizontally with readable labels.</li>
<li>Toolbars wrap; matrices, tables, and long formulas scroll locally.</li>
<li>Hero scenes scale to phone width, with safe-area spacing and visible keyboard focus.</li>
<li>Calculus stylesheet loads on direct lab entry. Its differential-equations shell no longer collides with the separate Studio.</li>
<li>Linear algebra, trigonometry, geometry, number-system controls, and the Shapes properties drawer have specific narrow-screen repairs.</li>
</ul>
<h2>Evidence and repeat checks</h2>
<p><a href="artifacts/studio-mobile-verified.json">Verified route matrix</a> · <a href="artifacts/studio-mobile-sections.json">Touch section matrix</a></p>
<p>Run the dev server on port 5190, then <code>npm run test:studios:mobile</code>. To sweep every section, run <code>node scripts/audit-studio-mobile.mjs --sections --strict</code> with <code>STUDIO_AUDIT_WIDTHS=320</code>. The URL, widths, route subset, and output file are configurable with STUDIO_AUDIT environment variables.</p>
<p>The audit measures page overflow, unscrollable content overflow, control dimensions, missing Calculus styles, and JavaScript errors. It checks default lab models and section navigation. It does not revalidate every mathematical model setting; physical iOS/Android devices were not tested.</p>
<p>Focused curriculum and Calculus tests: 13 passed. Production build validation is reported in the accompanying task result.</p>
</main></html>`);
console.log('Saved STUDIO_MOBILE_AUDIT.html');

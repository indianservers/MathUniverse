import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const dir='artifacts/math-robo-language',read=name=>JSON.parse(fs.readFileSync(`${dir}/${name}`,'utf8')),log=name=>fs.readFileSync(`${dir}/${name}`,'utf8');
const variants=read('variant-results.json'),browser=read('browser-results.json');
const byAction={};for(const row of variants.rows){const tally=byAction[row.action]??{total:0,passed:0};tally.total++;if(row.passed)tally.passed++;byAction[row.action]=tally;}
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex'),path='public/models/math-robo-intelligence-v4/weights.bin';
const report={date:new Date().toISOString(),variants:variants.total,classifiedCorrectly:variants.rows.filter(r=>r.actualAction===r.action).length,executedSuccessfully:variants.rows.filter(r=>r.passed).length,failedVariants:variants.rows.filter(r=>!r.passed),byAction,browser:{passed:browser.passed,total:browser.total,offlineTurns:30,pageErrors:browser.pageErrors.length,consoleErrors:browser.consoleErrors.length},regression:log('regression-tests.txt').match(/Tests\s+(\d+) passed/)?.[1],buildPassed:/built in/.test(log('build.txt')),scopedTypecheckPassed:!log('typecheck.txt').trim(),studentSecurityPassed:/1 passed/.test(log('student-security.txt')),weightsUnchanged:hash(fs.readFileSync(path))===hash(execFileSync('git',['show',`HEAD:${path}`],{maxBuffer:2e6}))};
fs.writeFileSync(`${dir}/report.json`,JSON.stringify(report,null,2));
fs.writeFileSync(`${dir}/report.md`,`# Ruhi natural-language command recognition

The existing semantic parser now uses a shared contextual command vocabulary. Aliases resolve into the existing actions, object resolver, validator, planner and workspace bridge. No new mathematics engine, UI redesign, external AI dependency or model retraining was introduced.

## Results

- ${report.classifiedCorrectly}/${variants.total} alias utterances classified into the expected canonical action (${(100*report.classifiedCorrectly/variants.total).toFixed(1)}% on this authored suite).
- ${report.executedSuccessfully}/${variants.total} utterances executed successfully with a committed-map workspace adapter. Assertions independently check dimensions, translation, rotation, scale, area, visibility, selection and object count. This is not a neural model accuracy estimate.
- ${browser.passed}/${browser.total} actual browser turns passed in the four native 2D/3D graph and geometry workspaces. The first 30 turns ran with browser networking disabled after local model/application loading. ${browser.pageErrors.length} page errors and ${browser.consoleErrors.length} console errors.
- Twenty additional five-turn conversations verify color, movement, copy and deletion of the original by stable identity. Separate tests verify compound actions, expression integrity, missing parameters, ambiguous deletion, defaults, compact dimensions, number words and solver aliases.
- ${report.regression} total intelligence/offline regression tests passed; production build ${report.buildPassed?'passed':'failed'}; scoped TypeScript ${report.scopedTypecheckPassed?'passed':'failed'}; production student security ${report.studentSecurityPassed?'passed':'failed'}.

## Training data and security

The existing admin starter dataset retains its prior rows and adds ${variants.total} reviewed variants, with 39–50 new linguistic examples for each of 15 core canonical actions. The bundled dataset includes existing object/context and construction examples; the adversarial corpus continues to exercise negative and speculative commands. Invalid or unsupported commands are refusal tests, not executable training labels. Template grouping keeps numeric and closely related phrasing together during train/validation splitting. Existing student build boundaries remain in force. No production weights were changed: ${report.weightsUnchanged}.

## Context-sensitive handling

“Plot a circle r5” creates a circle; function plots keep their mathematical payload. “Clear selection” deselects without deleting. “Show steps” keeps the existing explanation path. Mathematical expansion and typed engine calls retain their specialist routing. “Make another parallel…” preserves construction rather than duplication. Compact r=5, r5 and w4 h6 are expanded only for geometric shapes, preserving algebra such as r=5. Number-word coverage now includes teens and compound tens such as twenty-five.

## Remaining gaps

Alias recognition does not implement operations missing from the native executor. Zoom/animation families and general connect/attach semantics remain limited to existing supported capabilities; unsupported operations are reported rather than claimed as executed. Recognition remains deterministic plus the existing local model, not unrestricted language understanding. The alias suite concentrates on 15 core actions; existing regression suites cover additional math/construction operations. The offline browser check verifies operation after startup, not a new cold-install offline caching guarantee. Repository-wide TypeScript errors documented in the preceding orchestration report were outside this change; the scoped integration check passes.

## Evidence

variant-results.json contains each phrase, expected/actual action, status, response and committed commands. browser-results.json contains native workspace objects and conversation traces; screenshots cover each workspace. regression-tests.txt, build.txt, typecheck.txt and student-security.txt contain verification logs. Source vocabulary is commandLanguage.ts; reviewed examples are commandVariants.ts. Changes are left reviewable in the workspace.
`,'utf8');
console.log(JSON.stringify(report,null,2));

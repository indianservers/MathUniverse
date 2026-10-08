import fs from 'node:fs';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
const dir='artifacts/ruhi-context',read=name=>JSON.parse(fs.readFileSync(`${dir}/${name}`,'utf8')),log=name=>fs.readFileSync(`${dir}/${name}`,'utf8');
const evaluation=read('model-evaluation.json'),heldout=read('held-out-results.json'),browser=read('browser-results.json'),calibration=read('calibration.json'),falseActions=read('false-action-results.json'),cpu=read('cpu-performance.json'),pages=read('page-inventory.json'),chosen=evaluation.benchmarks.find(b=>b.hidden===evaluation.selectedHidden);
const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex'),v4path='public/models/math-robo-intelligence-v4/weights.bin';
const accepted=heldout.results.filter(r=>r.prediction.accepted),latencies=heldout.results.map(r=>r.prediction.inferenceMs).sort((a,b)=>a-b);
const report={date:new Date().toISOString(),architecture:{name:'RuhiContextNet',featureWidth:848,hidden:evaluation.selectedHidden,heads:['17 contextual intents','9 contextual meanings'],parameters:chosen.parameters,weightBytes:fs.statSync('public/models/ruhi-context-v1/weights.bin').size},dataset:{rows:evaluation.rows,train:evaluation.train,calibration:evaluation.calibration,test:evaluation.test,heldOutTemplateGroups:new Set(heldout.results.map(r=>r.group)).size,heldOutContexts:new Set(heldout.results.map(r=>r.pageId)).size},metrics:{intentAccuracy:heldout.intentAccuracy,contextInterpretationAccuracy:heldout.contextAccuracy,terminologyDisambiguationAccuracy:heldout.terminologyAccuracy,jointAccuracy:heldout.results.filter(r=>r.intent===r.prediction.intent&&r.meaning===r.prediction.meaning).length/heldout.rows,acceptedCoverage:accepted.length/heldout.rows,acceptedJointPrecision:accepted.filter(r=>r.intent===r.prediction.intent&&r.meaning===r.prediction.meaning).length/accepted.length,calibrationAcceptedJointPrecision:calibration.acceptedJointPrecision,endToEndBrowserAnswers:{passed:browser.passed,total:browser.total,scope:'Authored acceptance conversations, not held-out corpus accuracy'},nativeSimulationPassed:browser.simulation.passed,falseActions},performance:{cpu,browser:browser.performance,modelFetchesAcrossNavigation:browser.modelRequests,heldoutP95Ms:latencies[Math.floor(latencies.length*.95)]},coverage:{discoveredPages:pages.pages,lessonRecords:pages.lessons,reviewedSpecialistMeanings:5,definitionRecords:pages.records.filter(r=>r.definition).length},verification:{regressions:log('regression-tests.txt').match(/Tests\s+(\d+) passed/)?.[1],contextAndBoundaryTests:log('context-tests.txt').match(/Tests\s+(\d+) passed/)?.[1],nativeRegressionBrowser:/BROWSER 35 35/.test(log('native-regression-browser.txt')),productionBuild:/built in/.test(log('build.txt')),typecheck:!log('typecheck.txt').trim(),trainingPanelTypecheck:!log('typecheck-ui.txt').trim(),studentSecurity:/1 passed/.test(log('student-security.txt')),v4WeightsUnchanged:hash(fs.readFileSync(v4path))===hash(execFileSync('git',['show',`HEAD:${v4path}`],{maxBuffer:2e6}))}};
fs.writeFileSync(`${dir}/final-report.json`,JSON.stringify(report,null,2));
const pct=n=>(n*100).toFixed(1)+'%';
fs.writeFileSync(`${dir}/final-report.md`,`# Ruhi TensorFlow.js contextual intelligence

Ruhi now combines the unchanged v4 action model with a separate, actually trained TensorFlow.js contextual classifier. The context model ranks intent and meaning using the question, page vocabulary, previous topic, selection types and simulation features. Grounded records and existing engines provide answers; the classifier is not a knowledge database. Drawing, plotting, specialist calculations and pending parameter answers keep their existing validated execution path.

## Measured quality

| Measure | Result |
|---|---|
| Held-out contextual questions | ${heldout.rows} |
| Intent classification | ${pct(heldout.intentAccuracy)} |
| Context/meaning classification | ${pct(heldout.contextAccuracy)} |
| Joint intent + meaning | ${pct(report.metrics.jointAccuracy)} |
| Ambiguous terminology subset | ${pct(heldout.terminologyAccuracy)} |
| Confidence-accepted held-out coverage | ${pct(report.metrics.acceptedCoverage)} |
| Confidence-accepted held-out joint precision | ${pct(report.metrics.acceptedJointPrecision)} |
| Calibration accepted joint precision | ${pct(calibration.acceptedJointPrecision)} |
| Real browser acceptance answers | ${browser.passed}/${browser.total} |
| Native Pigeonhole simulation | ${browser.simulation.passed?'Passed':'Failed'}: actual boxes [${browser.simulation.bins.join(', ')}] |
| False simulation actions in 15 negative/read-only/uncertain tests | ${falseActions.falseActions} |

**The 95% contextual target was not achieved.** Classification quality is measured separately from the successful authored application scenarios. Definitions can remain mathematically correct even when a requested response style is misclassified. Class-specific thresholds were fitted only on calibration rows, including conservative abstention; calibration precision does not guarantee the same precision on unseen phrasing.

Both linear and 64-unit architectures were trained and measured. Calibration joint accuracy selected the 64-unit network (${pct(chosen.selectionScore)}), without choosing by test score. It has ${chosen.parameters.toLocaleString()} parameters and ${report.architecture.weightBytes.toLocaleString()} bytes of weights. The first unbalanced benchmark is retained in initial-model-evaluation.json; balanced intent/meaning sampling and varied contextual flags corrected its weak rare-meaning performance. Final training used ${evaluation.rows} source rows: ${evaluation.train} train, ${evaluation.calibration} calibration, ${evaluation.test} untouched test. Semantic syntax groups stay entirely within one split. Concepts/context vocabulary recur across splits; this is a template-held-out benchmark, not a claim of independent unseen-domain or natural student-language accuracy.

## Real application evidence

The browser verified Pigeonhole explanation, Explain this → Example → Why, graph-theoretic tree, computing tree, explicit biological override, uncertainty, page transitions and two warm offline turns. Ten objects in three boxes updated the mounted React PigeonholeLab to [4,3,3]; existing ceilDivision/evenOccupancy and independent committed-state checks produced the guaranteed occupancy of four. The context model loaded once across SPA navigation. Existing character answer/uncertainty/workspace events remain connected.

There is no standalone Data Structures route. Scenario C used the existing /discrete-world/algorithms page as a computing context; this is disclosed rather than claiming a nonexistent page was tested. The Graph Theory module also contains a native binary/AVL/expression tree visualization, but that panel is not separately connected to the contextual simulation bridge.

Reference tests cover the previous topic, selected stable object IDs, current topic and follow-up chains. Their focused assertions passed; they are not a statistically broad reference-resolution accuracy estimate. The context adapter has no destructive workspace executor. Existing mathematical actions independently validate parameters/capabilities and verify committed state regardless of neural confidence.

## Actual page and knowledge coverage

Automatic discovery found ${pages.pages} navigation/lesson records, including ${pages.lessons} real lessons. ${report.coverage.definitionRecords} records have ingested definitions/summaries. Lesson formulas and worked connections are reused from existing content. Five reviewed specialist meaning records cover pigeonholes, graph trees, computing trees, real trees and ordinary pigeonholes. Only pigeonhole and graph-tree records currently carry reviewed contextual proofs.

Discovery is not the same as full conversational/action coverage. Not every discovered studio has a reviewed definition, proof, example, practice family or native simulation adapter. Runtime can explain available lesson records; missing records/actions are reported explicitly. The training corpus samples actual introductory lesson contexts plus the contextual terminology records, rather than covering all 1,056 pages in training. The independent held-out set spans ${report.dataset.heldOutContexts} context IDs and ${report.dataset.heldOutTemplateGroups} syntax groups. Generated lesson prose was ingested from repository content, not independently re-audited for mathematical completeness in this task.

## Offline performance

Browser backend: ${browser.performance?.backend??'unavailable'}, mean warm inference ${browser.performance?.meanMs.toFixed(3)??'unavailable'} ms, p95 ${browser.performance?.p95Ms.toFixed(3)??'unavailable'} ms over 150 predictions. Tensor count ${browser.performance?.tensorsBefore} → ${browser.performance?.tensorsAfter}, with no inference growth. Node CPU mean: ${cpu.meanMs.toFixed(3)} ms over 150 predictions. CPU-compatible operation was verified; the existing TFJS backend setup can use supported WebGL. Loading is cached, tensors use tidy, and administrator training runs in a worker.

The mobile screenshot is a 390×844 viewport on desktop hardware, not a physical mobile-device performance benchmark. Low-end phones and cold-install offline caching remain unverified. Warm offline behavior after model/page loading passed.

## Training, distribution and model files

The administrator browser check loaded all 6,888 rows and received worker epoch/loss progress while the main thread remained responsive; that check was stopped after verifying worker operation. Complete training and model benchmarking were performed in the local training runner.

The existing Training Lab now has a Context Intelligence section for loading discovered-page rows, guarded JSONL import, worker training, candidate metrics, reviewed export and candidate rollback. Candidates persist separately at indexeddb://ruhi-context-v1-candidate; student inference uses the immutable bundled /models/ruhi-context-v1/model.json. Export gates require a reviewed candidate reaching 95% held-out joint accuracy, which the current contextual model does not reach. Initial task-authorized model artifacts are available for the tested runtime and inspection; further broad production distribution should account for the reported quality gap.

Weights: public/models/ruhi-context-v1/weights.bin. Architecture/calibration/version: public/models/ruhi-context-v1/model.json. Existing v4 weights unchanged from Git HEAD: ${report.verification.v4WeightsUnchanged}. No v4 dataset rows or capabilities were removed.

The app is browser-only. Training APIs reject student builds; production routes exclude the Training Lab. This build/distribution separation cannot strongly authorize an administrator against somebody controlling their own browser. There is no backend publishing endpoint to secure. Publishing a version means an administrator reviews/export artifacts, updates the immutable bundled version and distributes a rebuilt student app. Candidate rollback restores the bundled version; rollback of a distributed release requires redistribution of the prior bundle. Fine-tuning from an existing contextual checkpoint and automatic multi-version production rollback are not implemented.

## Verification and remaining gaps

- ${report.verification.regressions} intelligence/offline regression tests passed; ${report.verification.contextAndBoundaryTests} focused contextual/security tests passed.
- The original native 35-turn four-workspace browser suite passed after repairing matrix-call and numeric-continuation priority.
- Production build: ${report.verification.productionBuild}; scoped intelligence TypeScript: ${report.verification.typecheck}; context training panel TypeScript: ${report.verification.trainingPanelTypecheck}; student production security: ${report.verification.studentSecurity}.
- Full-project TypeScript errors documented by the earlier orchestration audit remain outside this scoped integration; no clean repository-wide typecheck is claimed.
- Generalization is below target. Broad proof generation, arbitrary page-control changes, all-studio simulations, unrestricted general chat and complete contextual practice coverage remain unsupported. Existing specialist math/practice engines continue to handle their established commands.

Evidence: audit.md; page-inventory.json; dataset.jsonl; model-evaluation.json; held-out-results.json; calibration.json; browser-results.json/screenshots; cpu-performance.json; false-action-results.json; regression/build/typecheck/security logs. Changes remain reviewable in the workspace.
`,'utf8');console.log(JSON.stringify(report,null,2));

import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const files = collect(join(root, "src")).filter((file) => /\.test\.(ts|tsx)$/.test(file)).sort();
const batchSize = 10;
const batches = Array.from({ length: Math.ceil(files.length / batchSize) }, (_, index) => files.slice(index * batchSize, (index + 1) * batchSize));
const results = [];

mkdirSync(join(root, "artifacts"), { recursive: true });
for (const [index, batch] of batches.entries()) {
  const startedAt = Date.now();
  const relativeFiles = batch.map((file) => relative(root, file).replaceAll("\\", "/"));
  const run = spawnSync(process.execPath, [join(root, "node_modules/vitest/vitest.mjs"), "run", "--maxWorkers=1", "--reporter=json", ...relativeFiles], {
    cwd: root,
    encoding: "utf8",
    timeout: 120_000,
    maxBuffer: 50 * 1024 * 1024,
  });
  let summary = null;
  try { summary = JSON.parse(run.stdout); } catch { /* stderr and raw output are retained below */ }
  results.push({
    batch: index + 1,
    files: relativeFiles,
    durationMs: Date.now() - startedAt,
    exitCode: run.status,
    signal: run.signal,
    timedOut: run.error?.code === "ETIMEDOUT",
    summary: summary ? {
      totalSuites: summary.numTotalTestSuites,
      passedSuites: summary.numPassedTestSuites,
      failedSuites: summary.numFailedTestSuites,
      totalTests: summary.numTotalTests,
      passedTests: summary.numPassedTests,
      failedTests: summary.numFailedTests,
      success: summary.success,
      failures: summary.testResults.flatMap((file) => file.assertionResults
        .filter((assertion) => assertion.status === "failed")
        .map((assertion) => ({ file: relative(root, file.name).replaceAll("\\", "/"), name: assertion.fullName, messages: assertion.failureMessages }))),
    } : null,
    stderr: run.stderr.slice(-4000),
    stdoutTail: summary ? "" : run.stdout.slice(-4000),
  });
  process.stdout.write(`Batch ${index + 1}/${batches.length}: ${run.status === 0 ? "pass" : run.error?.code === "ETIMEDOUT" ? "timeout" : "fail"}\n`);
}

const totals = results.reduce((sum, result) => ({
  suites: sum.suites + (result.summary?.totalSuites ?? 0),
  passedSuites: sum.passedSuites + (result.summary?.passedSuites ?? 0),
  failedSuites: sum.failedSuites + (result.summary?.failedSuites ?? 0),
  tests: sum.tests + (result.summary?.totalTests ?? 0),
  passedTests: sum.passedTests + (result.summary?.passedTests ?? 0),
  failedTests: sum.failedTests + (result.summary?.failedTests ?? 0),
  timedOutBatches: sum.timedOutBatches + Number(result.timedOut),
}), { suites: 0, passedSuites: 0, failedSuites: 0, tests: 0, passedTests: 0, failedTests: 0, timedOutBatches: 0 });

const report = { generatedAt: new Date().toISOString(), fileCount: files.length, batchSize, totals, results };
writeFileSync(join(root, "artifacts/phase3-full-tests.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(totals));
process.exitCode = results.every((result) => result.exitCode === 0 && result.summary?.success) ? 0 : 1;

function collect(directory) {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    return statSync(path).isDirectory() ? collect(path) : [path];
  });
}

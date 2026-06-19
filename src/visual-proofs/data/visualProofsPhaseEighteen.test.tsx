import { describe, expect, it } from "vitest";
import type { PhaseTwoProofConfig } from "../components/PhaseTwoProofExperience";
import {
  correlationScatterplotPhaseEighteenConfig,
  histogramFrequencyPhaseEighteenConfig,
  meanBalancePhaseEighteenConfig,
  medianQuartilesPhaseEighteenConfig,
  normalEmpiricalRulePhaseEighteenConfig,
  phaseEighteenConfigs,
  phaseEighteenRouteSlugs,
  regressionLeastSquaresPhaseEighteenConfig,
  samplingDistributionPhaseEighteenConfig,
  varianceStandardDeviationPhaseEighteenConfig,
} from "../proofs/phase-eighteen/phaseEighteenProofConfigs";
import { getVisualProof, getVisualProofsByCategory } from "./visualProofsIndex";
import { visualProofsRouteSmokeManifest } from "./visualProofsRouteSmokeManifest";

describe("Visual Proofs phase eighteen statistics launch", () => {
  it("creates all eight Phase 18 statistics routes as upgraded data-display experiences", () => {
    for (const [categorySlug, proofSlug] of phaseEighteenRouteSlugs) {
      const proof = getVisualProof(categorySlug, proofSlug);
      expect(proof?.route).toBe(`/visual-proofs/${categorySlug}/${proofSlug}`);
      expect(proof?.status).toBe("available");
      expect(proof?.proofUpgradeStatus).toBe("phase-upgraded");
      expect(proof?.proofLearningModel).toBe("data-display");
      expect(proof?.misconceptionCheckCount).toBeGreaterThanOrEqual(1);
      expect(proof?.hasKeyboardControls).toBe(true);
      expect(proof?.hasStateInspector).toBe(true);
      expect(proof?.hasTeacherMode).toBe(true);
      expect(proof?.hasOlympyardPracticeExit).toBe(true);
      expect(proof?.hasFormulaTokens).toBe(true);
      expect(proof?.hasPredictionPrompt).toBe(true);
      expect(proof?.hasSnapshotSupport).toBe(true);
      expect(proof?.hasVisualRegressionTest).toBe(false);
      expect(proof?.expectedVisualKind).toBe("svg");
      expect(proof?.expectedPrimarySelector).toBe('[data-testid="visual-proof-primary-visual"] svg');
    }
  });

  it("keeps statistics free of generic coming-soon starter as the main experience", () => {
    const statisticsProofs = getVisualProofsByCategory("statistics");
    const manifestRoutes = visualProofsRouteSmokeManifest.map((entry) => entry.route);
    expect(statisticsProofs).toHaveLength(8);
    expect(statisticsProofs.every((proof) => proof.status === "available")).toBe(true);
    expect(statisticsProofs.some((proof) => proof.slug === "starter-visual-proof")).toBe(false);
    expect(statisticsProofs.every((proof) => proof.proofUpgradeStatus === "phase-upgraded")).toBe(true);
    expect(statisticsProofs.every((proof) => proof.proofLearningModel === "data-display")).toBe(true);
    expect(manifestRoutes).toEqual(expect.arrayContaining(phaseEighteenRouteSlugs.map(routeFromSlug)));
  });

  it("adds prompt, misconception, formula, value, invariant, and visual contracts", () => {
    for (const config of phaseEighteenConfigs) {
      const values = defaultValues(config);
      expect(config.prediction.question).toContain("?");
      expect(config.prediction.options?.some((option) => option.correct)).toBe(true);
      expect(config.misconception.options.some((option) => option.correct)).toBe(true);
      expect(config.formulaTokens(values).length).toBeGreaterThanOrEqual(3);
      expect(config.liveValues(values).length).toBeGreaterThanOrEqual(4);
      expect(config.invariants(values).length).toBeGreaterThanOrEqual(1);
      expect(config.renderVisual).toBeTypeOf("function");
    }
  });

  it("exposes route-specific Phase 18 data-display contracts", () => {
    expect((meanBalancePhaseEighteenConfig as PhaseEighteenConfigWithKey).phaseEighteenModelKey).toBe("balance-deviation");
    expect(tokenIds(meanBalancePhaseEighteenConfig)).toEqual(expect.arrayContaining(["sum-x-i", "n", "mean", "deviations"]));
    expect((medianQuartilesPhaseEighteenConfig as PhaseEighteenConfigWithKey).phaseEighteenModelKey).toBe("sorted-quartile-boxplot");
    expect(tokenIds(medianQuartilesPhaseEighteenConfig)).toEqual(expect.arrayContaining(["median", "Q1", "Q3", "IQR"]));
    expect((varianceStandardDeviationPhaseEighteenConfig as PhaseEighteenConfigWithKey).phaseEighteenModelKey).toBe("squared-deviation");
    expect(tokenIds(varianceStandardDeviationPhaseEighteenConfig)).toEqual(expect.arrayContaining(["x-i-minus-mu", "squared-term", "sum", "divide-by-n", "square-root"]));
    expect((histogramFrequencyPhaseEighteenConfig as PhaseEighteenConfigWithKey).phaseEighteenModelKey).toBe("bin-frequency");
    expect(tokenIds(histogramFrequencyPhaseEighteenConfig)).toEqual(expect.arrayContaining(["bin", "frequency", "data-count"]));
    expect((samplingDistributionPhaseEighteenConfig as PhaseEighteenConfigWithKey).phaseEighteenModelKey).toBe("repeated-sample-mean");
    expect(tokenIds(samplingDistributionPhaseEighteenConfig)).toEqual(expect.arrayContaining(["sample-mean", "population-mean", "sample-size-n"]));
    expect((normalEmpiricalRulePhaseEighteenConfig as PhaseEighteenConfigWithKey).phaseEighteenModelKey).toBe("mean-sigma-empirical-rule");
    expect(tokenIds(normalEmpiricalRulePhaseEighteenConfig)).toEqual(expect.arrayContaining(["mu", "sigma", "68-percent", "95-percent", "99-7-percent"]));
    expect((correlationScatterplotPhaseEighteenConfig as PhaseEighteenConfigWithKey).phaseEighteenModelKey).toBe("r-trend-spread");
    expect(tokenIds(correlationScatterplotPhaseEighteenConfig)).toEqual(expect.arrayContaining(["r", "trend-line", "spread-around-line"]));
    expect((regressionLeastSquaresPhaseEighteenConfig as PhaseEighteenConfigWithKey).phaseEighteenModelKey).toBe("residual-least-squares");
    expect(tokenIds(regressionLeastSquaresPhaseEighteenConfig)).toEqual(expect.arrayContaining(["residual", "residual-squared", "sum-residual-squared", "least-squares"]));
  });

  it("keeps live values aligned to balance, quartile, spread, bins, sampling, normal, correlation, and regression goals", () => {
    const dataValues = { x1: 3, x2: 6, x3: 8, x4: 12, x5: 15, x6: 18 };
    expect(meanBalancePhaseEighteenConfig.liveValues(dataValues).map((item) => item.id)).toEqual(expect.arrayContaining(["data-values", "n", "sum", "mean", "deviations"]));
    expect(medianQuartilesPhaseEighteenConfig.liveValues(dataValues).map((item) => item.id)).toEqual(expect.arrayContaining(["sorted-data", "Q1", "median", "Q3", "IQR"]));
    expect(varianceStandardDeviationPhaseEighteenConfig.liveValues(dataValues).map((item) => item.id)).toEqual(expect.arrayContaining(["mean-mu", "squared-deviations", "variance", "standard-deviation"]));
    expect(histogramFrequencyPhaseEighteenConfig.liveValues({ ...dataValues, binCount: 5 }).map((item) => item.id)).toEqual(expect.arrayContaining(["bin-count", "bin-width", "frequencies", "total-count"]));
    expect(samplingDistributionPhaseEighteenConfig.liveValues({ sampleSize: 3, samples: 24 }).map((item) => item.id)).toEqual(expect.arrayContaining(["population-mean", "latest-sample", "latest-sample-mean", "spread-of-sample-means"]));
    expect(normalEmpiricalRulePhaseEighteenConfig.liveValues({ mu: 10, sigma: 3 }).map((item) => item.id)).toEqual(expect.arrayContaining(["mu", "sigma", "interval-1-sigma", "empirical-rule-percentages"]));
    expect(correlationScatterplotPhaseEighteenConfig.liveValues({ r: -0.7, noise: 0.8 }).find((item) => item.id === "slope-direction")?.value).toBe("negative");
    expect(regressionLeastSquaresPhaseEighteenConfig.liveValues({ slope: 0.7, intercept: 1.5 }).map((item) => item.id)).toEqual(expect.arrayContaining(["residuals", "squared-residuals", "total-squared-error", "best-fit-comparison"]));
  });
});

type PhaseEighteenConfigWithKey = PhaseTwoProofConfig & { phaseEighteenModelKey: string };

function defaultValues(config: PhaseTwoProofConfig) {
  return Object.fromEntries(config.parameters.map((parameter) => [parameter.id, parameter.defaultValue]));
}

function tokenIds(config: PhaseTwoProofConfig) {
  return config.formulaTokens(defaultValues(config)).map((token) => token.id);
}

function routeFromSlug([categorySlug, proofSlug]: readonly [string, string]) {
  return `/visual-proofs/${categorySlug}/${proofSlug}`;
}

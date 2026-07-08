import { theoremCategories } from "../data/theoremLibrary";
import { visualProofsIndex } from "../visual-proofs/data/visualProofsIndex";
import type { TheoremLibraryItem } from "../data/theoremLibrary";
import type { VisualProof } from "../visual-proofs/data/proofTypes";

export type ProofExplanationSurface = "visual-proof" | "theorem";
export type ProofExplanationSeverity = "error" | "warning";

export type ProofExplanationIssue = {
  surface: ProofExplanationSurface;
  id: string;
  title: string;
  severity: ProofExplanationSeverity;
  message: string;
};

export type ProofExplanationAuditReport = {
  visualProofCount: number;
  phaseUpgradedVisualProofCount: number;
  theoremCount: number;
  theoremDraftReadyCount: number;
  theoremNotDraftReadyCount: number;
  theoremPlannedCount: number;
  issues: ProofExplanationIssue[];
  errors: ProofExplanationIssue[];
  warnings: ProofExplanationIssue[];
  ready: boolean;
};

const MIN_SHORT_DESCRIPTION_LENGTH = 18;
const MIN_LONG_DESCRIPTION_LENGTH = 40;
const MIN_PHASE_UPGRADED_VISUAL_LONG_DESCRIPTION_LENGTH = 110;
const MIN_THEOREM_EXPLANATION_LENGTH = 32;

function trimmedLength(value: string | undefined) {
  return value?.trim().length ?? 0;
}

function issue(
  surface: ProofExplanationSurface,
  severity: ProofExplanationSeverity,
  id: string,
  title: string,
  message: string,
): ProofExplanationIssue {
  return { surface, severity, id, title, message };
}

function auditVisualProof(proof: VisualProof): ProofExplanationIssue[] {
  const proofIssues: ProofExplanationIssue[] = [];
  const proofId = `${proof.categorySlug}/${proof.slug}`;

  if (trimmedLength(proof.shortDescription) < MIN_SHORT_DESCRIPTION_LENGTH) {
    proofIssues.push(
      issue("visual-proof", "error", proofId, proof.title, "Short description is missing or too thin."),
    );
  }

  if (trimmedLength(proof.longDescription) < MIN_LONG_DESCRIPTION_LENGTH) {
    proofIssues.push(
      issue("visual-proof", "error", proofId, proof.title, "Long description needs a clearer student-facing explanation."),
    );
  }

  if (proof.longDescription.trim() === proof.shortDescription.trim()) {
    proofIssues.push(
      issue("visual-proof", "warning", proofId, proof.title, "Long description repeats the short description."),
    );
  }

  if (proof.prerequisites.length === 0) {
    proofIssues.push(
      issue("visual-proof", "warning", proofId, proof.title, "Prerequisites are empty; teacher mode may lack setup context."),
    );
  }

  if (proof.learningOutcomes.length < 2) {
    proofIssues.push(
      issue("visual-proof", "warning", proofId, proof.title, "Learning outcomes should list at least two measurable takeaways."),
    );
  }

  if (proof.proofUpgradeStatus === "phase-upgraded") {
    if (trimmedLength(proof.longDescription) < MIN_PHASE_UPGRADED_VISUAL_LONG_DESCRIPTION_LENGTH) {
      proofIssues.push(
        issue(
          "visual-proof",
          "warning",
          proofId,
          proof.title,
          "Phase-upgraded proof needs a fuller classroom-ready visual explanation.",
        ),
      );
    }

    if (!proof.proofLearningModel) {
      proofIssues.push(
        issue("visual-proof", "error", proofId, proof.title, "Phase-upgraded proof is missing a learning model."),
      );
    }

    if (!proof.expectedPrimarySelector || !proof.expectedVisualKind || !proof.expectedMinimumVisualElements) {
      proofIssues.push(
        issue(
          "visual-proof",
          "warning",
          proofId,
          proof.title,
          "Phase-upgraded proof should keep visual QA selector metadata complete.",
        ),
      );
    }

    if (!proof.hasPredictionPrompt || !proof.hasFormulaTokens || !proof.hasSnapshotSupport) {
      proofIssues.push(
        issue(
          "visual-proof",
          "warning",
          proofId,
          proof.title,
          "Phase-upgraded proof should expose prediction, formula, and snapshot capabilities where applicable.",
        ),
      );
    }
  }

  return proofIssues;
}

function auditTheoremProof(theorem: TheoremLibraryItem, categoryId: string): ProofExplanationIssue[] {
  const theoremIssues: ProofExplanationIssue[] = [];
  const theoremId = `${categoryId}/${theorem.slug}`;

  if (trimmedLength(theorem.statement) === 0) {
    theoremIssues.push(
      issue("theorem", "error", theoremId, theorem.title, "Theorem statement is missing."),
    );
  } else if (trimmedLength(theorem.statement) < MIN_THEOREM_EXPLANATION_LENGTH) {
    theoremIssues.push(
      issue("theorem", "warning", theoremId, theorem.title, "Theorem statement is terse and should be expanded."),
    );
  }

  if (trimmedLength(theorem.whyItMatters) < MIN_THEOREM_EXPLANATION_LENGTH) {
    theoremIssues.push(
      issue("theorem", "warning", theoremId, theorem.title, "Why-it-matters explanation should be more useful."),
    );
  }

  if (theorem.proofStatus === "planned" || theorem.proofStatus === "scaffold-ready") {
    theoremIssues.push(
      issue("theorem", "warning", theoremId, theorem.title, "Proof is not draft-ready yet and needs a step-by-step proof draft."),
    );
    return theoremIssues;
  }

  if (trimmedLength(theorem.proofIdea) < MIN_THEOREM_EXPLANATION_LENGTH) {
    theoremIssues.push(
      issue("theorem", "error", theoremId, theorem.title, "Draft-ready theorem needs a proof idea."),
    );
  }

  if (!theorem.proofSteps || theorem.proofSteps.length < 3) {
    theoremIssues.push(
      issue("theorem", "error", theoremId, theorem.title, "Draft-ready theorem needs at least three proof steps."),
    );
  }

  theorem.proofSteps?.forEach((step, index) => {
    if (trimmedLength(step.title) === 0 || trimmedLength(step.explanation) === 0) {
      theoremIssues.push(
        issue("theorem", "error", theoremId, theorem.title, `Proof step ${index + 1} is missing a title or explanation.`),
      );
    } else if (trimmedLength(step.explanation) < MIN_THEOREM_EXPLANATION_LENGTH) {
      theoremIssues.push(
        issue("theorem", "warning", theoremId, theorem.title, `Proof step ${index + 1} needs a clearer explanation.`),
      );
    }

    if (trimmedLength(step.representation) < 12) {
      theoremIssues.push(
        issue("theorem", "warning", theoremId, theorem.title, `Proof step ${index + 1} needs a visual representation note.`),
      );
    }
  });

  if (trimmedLength(theorem.examMemory) < 16) {
    theoremIssues.push(
      issue("theorem", "warning", theoremId, theorem.title, "Exam memory note is missing or too short."),
    );
  }

  if (!theorem.commonMistakes || theorem.commonMistakes.length === 0) {
    theoremIssues.push(
      issue("theorem", "warning", theoremId, theorem.title, "Common mistakes list is missing."),
    );
  }

  return theoremIssues;
}

export function buildProofExplanationAuditReport(): ProofExplanationAuditReport {
  const visualIssues = visualProofsIndex.flatMap(auditVisualProof);
  const theoremItems = theoremCategories.flatMap((category) =>
    category.theorems.map((theorem) => ({ theorem, categoryId: category.id })),
  );
  const theoremIssues = theoremItems.flatMap(({ theorem, categoryId }) => auditTheoremProof(theorem, categoryId));
  const issues = [...visualIssues, ...theoremIssues];
  const errors = issues.filter((auditIssue) => auditIssue.severity === "error");
  const warnings = issues.filter((auditIssue) => auditIssue.severity === "warning");

  return {
    visualProofCount: visualProofsIndex.length,
    phaseUpgradedVisualProofCount: visualProofsIndex.filter((proof) => proof.proofUpgradeStatus === "phase-upgraded").length,
    theoremCount: theoremItems.length,
    theoremDraftReadyCount: theoremItems.filter(({ theorem }) => theorem.proofStatus === "draft-ready" || theorem.proofStatus === "visual-ready").length,
    theoremNotDraftReadyCount: theoremItems.filter(({ theorem }) => theorem.proofStatus !== "draft-ready" && theorem.proofStatus !== "visual-ready").length,
    theoremPlannedCount: theoremItems.filter(({ theorem }) => theorem.proofStatus === "planned").length,
    issues,
    errors,
    warnings,
    ready: errors.length === 0,
  };
}

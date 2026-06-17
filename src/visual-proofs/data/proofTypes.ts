import type { ReactNode } from "react";

export type VisualProofStatus = "available" | "coming-soon";

export type VisualProofDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type ProofLearningModel =
  | "area-rearrangement"
  | "tile-model"
  | "angle-model"
  | "coordinate-grid"
  | "graph-limit"
  | "number-model"
  | "pattern-model"
  | "simulation-board"
  | "data-display"
  | "vector-field"
  | "measurement-scene"
  | "transformation-grid"
  | "growth-scale"
  | "applied-system";

export type ProofUpgradeStatus = "legacy" | "shell-ready" | "phase-upgraded" | "premium";
export type VisualProofExpectedVisualKind = "svg" | "canvas" | "html";

export type VisualProofCategory = {
  title: string;
  slug: string;
  description: string;
  difficultyRange: string;
  targetAudience: string;
  iconName: string;
  proofCount: number;
  status: VisualProofStatus;
};

export type VisualProofComponentKey =
  | "CircleAreaUnrollingProof"
  | "PythagoreanAreaRearrangementProof"
  | "TriangleAreaHalfRectangleProof"
  | "TriangleAngleSumProof"
  | "ExteriorAngleTheoremProof"
  | "SimilarTrianglesProof"
  | "CircleCircumferenceUnwrappingProof"
  | "SectorAreaFormulaProof"
  | "ParallelogramAreaShearingProof"
  | "TrapezoidAreaDuplicationProof"
  | "PolygonInteriorAngleSumProof"
  | "SquareOfSumProof"
  | "SquareOfDifferenceProof"
  | "DifferenceOfSquaresProof"
  | "ProductOfBinomialsProof"
  | "DistributiveLawAreaModelProof"
  | "ThreeTermSquareProof"
  | "CompletingTheSquareProof"
  | "QuadraticFactorizationAreaModelProof"
  | "PerfectSquareTrinomialRecognitionProof"
  | "CubeOfSumProof"
  | "CubeOfDifferenceProof"
  | "SumAndDifferenceProductProof"
  | "RightTriangleTrigRatiosProof"
  | "UnitCircleSineCosineProof"
  | "PythagoreanTrigIdentityProof"
  | "TangentRatioIdentityProof"
  | "RadiansArcRadiusProof"
  | "ArcLengthFormulaProof"
  | "TrigGraphsFromUnitCircleProof"
  | "CosineAngleAdditionProof"
  | "SineAngleAdditionProof"
  | "DoubleAngleIdentitiesProof"
  | "SineRuleProof"
  | "CosineRuleProof"
  | "ComplementaryAngleIdentitiesProof"
  | "TriangleAreaSineFormulaProof"
  | "SmallAngleApproximationProof"
  | "DistanceFormulaProof"
  | "MidpointFormulaProof"
  | "SectionFormulaProof"
  | "SlopeFormulaProof"
  | "SlopeInterceptLineEquationProof"
  | "PointSlopeLineEquationProof"
  | "ParallelLinesSlopeProof"
  | "PerpendicularLinesSlopeProof"
  | "TriangleAreaCoordinatesProof"
  | "CircleEquationProof"
  | "TranslationOfPointsProof"
  | "ReflectionAcrossAxesProof"
  | "RotationAboutOriginProof"
  | "ScalingDilationOriginProof"
  | "CoordinateProofPythagoreanProof"
  | "LimitApproachesPointProof"
  | "DerivativeSlopeOfTangentProof"
  | "SecantBecomesTangentProof"
  | "DerivativePowerRuleProof"
  | "ProductRuleVisualProof"
  | "ChainRuleVisualProof"
  | "MeanValueTheoremProof"
  | "RiemannSumsAreaUnderCurveProof"
  | "DefiniteIntegralAccumulatedAreaProof"
  | "FundamentalTheoremCalculusProof"
  | "IntegrationByPartsVisualProof"
  | "DerivativeOfSineProof"
  | "DerivativeOfExponentialProof"
  | "TaylorSeriesApproximationProof"
  | "OptimizationDerivativeMaxMinProof"
  | "EvenOddPairingProof"
  | "DivisibilityEqualGroupingProof"
  | "PrimesNonRectangularArraysProof"
  | "CompositesRectangularArraysProof"
  | "FundamentalTheoremArithmeticProof"
  | "EuclidInfinitelyManyPrimesProof"
  | "GcdEuclideanAlgorithmProof"
  | "LcmGridAlignmentProof"
  | "ModularArithmeticClockProof"
  | "RemainderPatternCyclesProof"
  | "DivisibilityBy3And9Proof"
  | "IrrationalitySqrt2Proof"
  | "ArithmeticProgressionEqualStepsProof"
  | "SumFirstNNaturalNumbersProof"
  | "SumFirstNOddNumbersProof"
  | "SumArithmeticProgressionProof"
  | "GeometricProgressionScalingProof"
  | "FiniteGeometricSeriesSumProof"
  | "InfiniteGeometricSeriesConvergenceProof"
  | "TriangularNumbersProof"
  | "SquareNumbersOddLayersProof"
  | "FibonacciSequenceTilingProof"
  | "FibonacciSpiralApproximationProof"
  | "SumOfFibonacciNumbersProof"
  | "PascalTriangleBinomialCoefficientsProof"
  | "VisualInductionDominoGrowthProof"
  | "HarmonicSeriesGrowthIntuitionProof"
  | "ComingSoonProof";

export type VisualProof = {
  id: string;
  title: string;
  slug: string;
  categorySlug: string;
  shortDescription: string;
  longDescription: string;
  difficulty: VisualProofDifficulty;
  level: string;
  tags: string[];
  estimatedTime: string;
  prerequisites: string[];
  learningOutcomes: string[];
  route: string;
  status: VisualProofStatus;
  componentKey: VisualProofComponentKey;
  thumbnailKey?: VisualProofComponentKey;
  proofLearningModel?: ProofLearningModel;
  proofUpgradeStatus?: ProofUpgradeStatus;
  misconceptionCheckCount?: number;
  hasTeacherMode?: boolean;
  hasKeyboardControls?: boolean;
  hasStateInspector?: boolean;
  hasOlympyardPracticeExit?: boolean;
  hasVisualRegressionTest?: boolean;
  hasFormulaTokens?: boolean;
  hasPredictionPrompt?: boolean;
  hasSnapshotSupport?: boolean;
  expectedVisualKind?: VisualProofExpectedVisualKind;
  expectedPrimarySelector?: string;
  expectedMinimumVisualElements?: number;
  expectedInteractiveControls?: string[];
};

export type ProofStep = {
  id: string;
  title: string;
  description: string;
  focusLabel: string;
  state?: "completed" | "current" | "locked";
  formula?: string;
  insight?: string;
  challengePrompt?: string;
};

export type ProofParameter = {
  id: string;
  label: string;
  value: number | string | boolean;
  unit?: string;
  exactValue?: string;
  roundedValue?: string;
};

export type ProofLiveValue = {
  id: string;
  label: string;
  value: number | string;
  exactValue?: string;
  roundedValue?: string;
  unit?: string;
  warning?: string;
};

export type ProofInvariant = {
  id: string;
  label: string;
  holds: boolean;
  explanation: string;
};

export type ProofMisconceptionCheck = {
  id: string;
  prompt: string;
  correctAnswer: string;
  targetedFeedback: string;
  stepId?: string;
};

export type ProofSnapshotState = {
  route: string;
  activeStep: number;
  parameters: ProofParameter[];
  liveValues: ProofLiveValue[];
  invariants: ProofInvariant[];
  capturedAt?: string;
};

export type VisualProofShellProps = {
  title: string;
  difficulty: VisualProofDifficulty;
  category: string;
  route: string;
  steps: ProofStep[];
  activeStep: number;
  onStepChange?: (stepIndex: number) => void;
  canvasContent: ReactNode;
  formulaPanel: ReactNode;
  controlsContent?: ReactNode;
  stateInspector?: ReactNode;
  summary?: string;
  practiceExit?: ReactNode;
};

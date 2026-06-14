export type VisualProofStatus = "available" | "coming-soon";

export type VisualProofDifficulty = "Beginner" | "Intermediate" | "Advanced";

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
};

export type ProofStep = {
  id: string;
  title: string;
  description: string;
  focusLabel: string;
};

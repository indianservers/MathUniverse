import type { VisualProofComponentKey } from "../data/proofTypes";
import { polygonPoints, regularPolygonPoints } from "../utils/geometryMath";

type GeometryProofThumbnailProps = {
  thumbnailKey?: VisualProofComponentKey;
};

export default function GeometryProofThumbnail({ thumbnailKey }: GeometryProofThumbnailProps) {
  if (!thumbnailKey) return null;

  return (
    <svg viewBox="0 0 160 92" className="h-24 w-full rounded-lg bg-slate-950/95" role="img" aria-label="Proof thumbnail">
      <rect x="0" y="0" width="160" height="92" rx="8" fill="#020617" />
      {renderThumbnail(thumbnailKey)}
    </svg>
  );
}

function renderThumbnail(key: VisualProofComponentKey) {
  switch (key) {
    case "PythagoreanAreaRearrangementProof":
      return (
        <>
          <polygon points="26,68 26,24 70,68" fill="#22d3ee" opacity="0.75" />
          <rect x="78" y="20" width="44" height="44" fill="none" stroke="#f59e0b" strokeWidth="5" transform="rotate(45 100 42)" />
          <text x="105" y="82" fill="#e0f2fe" fontSize="12" fontWeight="800">a^2+b^2</text>
        </>
      );
    case "TriangleAreaHalfRectangleProof":
      return (
        <>
          <rect x="24" y="18" width="100" height="58" fill="none" stroke="#22d3ee" strokeWidth="4" strokeDasharray="7 5" />
          <polygon points="24,76 124,76 70,18" fill="#f59e0b" opacity="0.85" />
        </>
      );
    case "TriangleAngleSumProof":
      return (
        <>
          <polygon points="28,72 126,72 78,18" fill="#0f172a" stroke="#22d3ee" strokeWidth="4" />
          <path d="M 42 72 A 16 16 0 0 1 54 60" stroke="#f59e0b" strokeWidth="5" fill="none" />
          <path d="M 68 29 A 20 20 0 0 1 88 29" stroke="#22c55e" strokeWidth="5" fill="none" />
          <path d="M 110 60 A 16 16 0 0 1 118 72" stroke="#a78bfa" strokeWidth="5" fill="none" />
        </>
      );
    case "ExteriorAngleTheoremProof":
      return (
        <>
          <polygon points="30,70 102,70 68,22" fill="#0f172a" stroke="#22d3ee" strokeWidth="4" />
          <line x1="102" y1="70" x2="142" y2="70" stroke="#e2e8f0" strokeWidth="4" />
          <path d="M 110 70 A 24 24 0 0 1 92 48" stroke="#ef4444" strokeWidth="6" fill="none" />
        </>
      );
    case "SimilarTrianglesProof":
      return (
        <>
          <polygon points="25,72 70,72 48,38" fill="none" stroke="#22d3ee" strokeWidth="4" />
          <polygon points="82,72 142,72 112,25" fill="none" stroke="#f59e0b" strokeWidth="4" />
        </>
      );
    case "CircleCircumferenceUnwrappingProof":
      return (
        <>
          <circle cx="50" cy="48" r="26" fill="none" stroke="#22d3ee" strokeWidth="5" />
          <line x1="86" y1="72" x2="140" y2="72" stroke="#f59e0b" strokeWidth="6" />
          <circle cx="50" cy="22" r="5" fill="#ef4444" />
        </>
      );
    case "SectorAreaFormulaProof":
      return (
        <>
          <circle cx="78" cy="48" r="32" fill="none" stroke="#22d3ee" strokeWidth="4" />
          <path d="M 78 48 L 78 16 A 32 32 0 0 1 110 48 Z" fill="#f59e0b" opacity="0.9" />
        </>
      );
    case "ParallelogramAreaShearingProof":
      return (
        <>
          <polygon points="34,70 112,70 132,28 54,28" fill="#22d3ee" opacity="0.65" stroke="#67e8f9" strokeWidth="3" />
          <rect x="46" y="28" width="78" height="42" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="6 5" />
        </>
      );
    case "TrapezoidAreaDuplicationProof":
      return (
        <>
          <polygon points="30,70 94,70 78,34 44,34" fill="#22d3ee" opacity="0.7" />
          <polygon points="94,34 144,34 130,70 94,70" fill="#f59e0b" opacity="0.8" />
        </>
      );
    case "PolygonInteriorAngleSumProof": {
      const points = regularPolygonPoints(5, 78, 48, 34);
      return (
        <>
          <polygon points={polygonPoints(points)} fill="none" stroke="#22d3ee" strokeWidth="4" />
          <line x1={points[0].x} y1={points[0].y} x2={points[2].x} y2={points[2].y} stroke="#f59e0b" strokeWidth="3" />
          <line x1={points[0].x} y1={points[0].y} x2={points[3].x} y2={points[3].y} stroke="#f59e0b" strokeWidth="3" />
        </>
      );
    }
    case "CircleAreaUnrollingProof":
    case "CircleToTriangleProof":
      return (
        <>
          <circle cx="48" cy="46" r="30" fill="none" stroke="#22d3ee" strokeWidth="5" />
          <path d="M 88 72 L 140 72 L 114 28 Z" fill="#f59e0b" opacity="0.8" />
        </>
      );
    case "SquareOfSumProof":
      return <GridThumb labels={["a^2", "ab", "ab", "b^2"]} />;
    case "SquareOfDifferenceProof":
      return <RemovedSquareThumb label="(a-b)^2" />;
    case "DifferenceOfSquaresProof":
      return <RemovedSquareThumb label="a^2-b^2" />;
    case "ProductOfBinomialsProof":
      return <GridThumb labels={["x^2", "bx", "ax", "ab"]} />;
    case "DistributiveLawAreaModelProof":
      return <GridThumb labels={["ac", "bc", "ad", "bd"]} />;
    case "ThreeTermSquareProof":
      return (
        <>
          {Array.from({ length: 9 }, (_, index) => {
            const x = 34 + (index % 3) * 30;
            const y = 10 + Math.floor(index / 3) * 24;
            return <rect key={index} x={x} y={y} width="30" height="24" fill={index % 2 ? "#fde68a" : "#22d3ee"} opacity="0.78" stroke="#e0f2fe" />;
          })}
        </>
      );
    case "CompletingTheSquareProof":
      return (
        <>
          <rect x="32" y="18" width="46" height="46" fill="#22d3ee" opacity="0.8" />
          <rect x="78" y="18" width="28" height="46" fill="#f59e0b" opacity="0.8" />
          <rect x="32" y="64" width="46" height="18" fill="#f59e0b" opacity="0.8" />
          <rect x="78" y="64" width="28" height="18" fill="none" stroke="#c4b5fd" strokeWidth="4" strokeDasharray="5 4" />
        </>
      );
    case "QuadraticFactorizationAreaModelProof":
      return <GridThumb labels={["x^2", "nx", "mx", "mn"]} />;
    case "PerfectSquareTrinomialRecognitionProof":
      return <GridThumb labels={["x^2", "ax", "ax", "a^2"]} />;
    case "CubeOfSumProof":
    case "CubeOfDifferenceProof":
      return (
        <>
          <polygon points="44,58 92,58 112,42 64,42" fill="#22d3ee" opacity="0.85" />
          <polygon points="92,58 112,42 112,74 92,86" fill="#f59e0b" opacity="0.75" />
          <polygon points="44,58 92,58 92,86 44,86" fill="#a78bfa" opacity="0.75" />
          <text x="104" y="26" fill="#e0f2fe" fontSize="12" fontWeight="800">{key === "CubeOfSumProof" ? "(a+b)^3" : "(a-b)^3"}</text>
        </>
      );
    case "SumAndDifferenceProductProof":
      return <RemovedSquareThumb label="(a+b)(a-b)" />;
    case "RightTriangleTrigRatiosProof":
    case "ComplementaryAngleIdentitiesProof":
      return <TrigTriangleThumb complement={key === "ComplementaryAngleIdentitiesProof"} />;
    case "UnitCircleSineCosineProof":
    case "PythagoreanTrigIdentityProof":
    case "TangentRatioIdentityProof":
      return <UnitCircleThumb tangent={key === "TangentRatioIdentityProof"} />;
    case "RadiansArcRadiusProof":
    case "ArcLengthFormulaProof":
      return <ArcThumb label={key === "ArcLengthFormulaProof" ? "s=rθ" : "θ=s/r"} />;
    case "TrigGraphsFromUnitCircleProof":
      return <TrigGraphThumb />;
    case "CosineAngleAdditionProof":
    case "SineAngleAdditionProof":
    case "DoubleAngleIdentitiesProof":
      return <RotationThumb label={key === "DoubleAngleIdentitiesProof" ? "2θ" : "α+β"} />;
    case "SineRuleProof":
    case "LawOfCosinesCircleConstructionProof":
      return <TriangleCircleThumb />;
    case "CosineRuleProof":
    case "TriangleAreaSineFormulaProof":
      return <ProjectionTriangleThumb label={key === "TriangleAreaSineFormulaProof" ? "1/2ab sin C" : "c²"} />;
    case "SmallAngleApproximationProof":
      return <SmallAngleThumb />;
    case "DistanceFormulaProof":
    case "SlopeFormulaProof":
      return <CoordinateSegmentThumb slope={key === "SlopeFormulaProof"} />;
    case "MidpointFormulaProof":
    case "SectionFormulaProof":
      return <CoordinateMidpointThumb section={key === "SectionFormulaProof"} />;
    case "SlopeInterceptLineEquationProof":
    case "PointSlopeLineEquationProof":
      return <CoordinateLineThumb point={key === "PointSlopeLineEquationProof"} />;
    case "ParallelLinesSlopeProof":
      return <ParallelLinesThumb />;
    case "PerpendicularLinesSlopeProof":
      return <PerpendicularLinesThumb />;
    case "TriangleAreaCoordinatesProof":
      return <CoordinateTriangleThumb />;
    case "CircleEquationProof":
      return <CoordinateCircleThumb />;
    case "TranslationOfPointsProof":
      return <CoordinateTransformThumb mode="translate" />;
    case "ReflectionAcrossAxesProof":
      return <CoordinateTransformThumb mode="reflect" />;
    case "RotationAboutOriginProof":
      return <CoordinateTransformThumb mode="rotate" />;
    case "ScalingDilationOriginProof":
      return <CoordinateTransformThumb mode="scale" />;
    case "CoordinateProofPythagoreanProof":
      return <CoordinatePythagoreanThumb />;
    case "LimitApproachesPointProof":
      return <CalcGraphThumb mode="limit" />;
    case "DerivativeSlopeOfTangentProof":
    case "DerivativeOfSineProof":
    case "DerivativeOfExponentialProof":
      return <CalcGraphThumb mode="tangent" />;
    case "SecantBecomesTangentProof":
      return <CalcGraphThumb mode="secants" />;
    case "DerivativePowerRuleProof":
      return <CalcGraphThumb mode="power" />;
    case "ProductRuleVisualProof":
    case "IntegrationByPartsVisualProof":
      return <CalcRectangleThumb />;
    case "ChainRuleVisualProof":
      return <CalcChainThumb />;
    case "MeanValueTheoremProof":
      return <CalcGraphThumb mode="mvt" />;
    case "RiemannSumsAreaUnderCurveProof":
    case "DefiniteIntegralAccumulatedAreaProof":
    case "FundamentalTheoremCalculusProof":
      return <CalcAreaThumb />;
    case "TaylorSeriesApproximationProof":
      return <CalcTaylorThumb />;
    case "OptimizationDerivativeMaxMinProof":
      return <CalcOptimizationThumb />;
    case "EvenOddPairingProof":
    case "DivisibilityEqualGroupingProof":
      return <NumberDotsThumb grouped={key === "DivisibilityEqualGroupingProof"} />;
    case "PrimesNonRectangularArraysProof":
    case "CompositesRectangularArraysProof":
      return <NumberArrayThumb composite={key === "CompositesRectangularArraysProof"} />;
    case "FundamentalTheoremArithmeticProof":
      return <FactorTreeThumb />;
    case "EuclidInfinitelyManyPrimesProof":
      return <EuclidThumb />;
    case "GcdEuclideanAlgorithmProof":
      return <GcdThumb />;
    case "LcmGridAlignmentProof":
      return <LcmThumb />;
    case "ModularArithmeticClockProof":
    case "RemainderPatternCyclesProof":
      return <ModuloThumb cycle={key === "RemainderPatternCyclesProof"} />;
    case "DivisibilityBy3And9Proof":
      return <DigitSumThumb />;
    case "IrrationalitySqrt2Proof":
      return <SqrtTwoThumb />;
    case "ArithmeticProgressionEqualStepsProof":
      return <SequenceLineThumb />;
    case "SumFirstNNaturalNumbersProof":
      return <NaturalSumRectangleThumb />;
    case "TriangularNumbersProof":
      return <TriangularSequenceThumb />;
    case "SumFirstNOddNumbersProof":
    case "SquareNumbersOddLayersProof":
      return <SquareLayerThumb />;
    case "SumArithmeticProgressionProof":
      return <SeriesBarsThumb paired />;
    case "GeometricProgressionScalingProof":
    case "FiniteGeometricSeriesSumProof":
      return <SeriesBarsThumb paired={false} />;
    case "InfiniteGeometricSeriesConvergenceProof":
      return <InfiniteHalvesThumb />;
    case "FibonacciSequenceTilingProof":
    case "FibonacciSpiralApproximationProof":
    case "SumOfFibonacciNumbersProof":
      return <FibonacciThumb spiral={key === "FibonacciSpiralApproximationProof"} />;
    case "PascalTriangleBinomialCoefficientsProof":
      return <PascalThumb />;
    case "VisualInductionDominoGrowthProof":
      return <InductionThumb />;
    case "HarmonicSeriesGrowthIntuitionProof":
      return <HarmonicThumb />;
    default:
      return <text x="80" y="52" fill="#e0f2fe" textAnchor="middle" fontSize="12" fontWeight="800">Visual proof</text>;
  }
}

function GridThumb({ labels }: { labels: string[] }) {
  const fills = ["#22d3ee", "#f59e0b", "#a78bfa", "#22c55e"];
  return (
    <>
      {labels.map((label, index) => {
        const x = 30 + (index % 2) * 50;
        const y = 14 + Math.floor(index / 2) * 32;
        return (
          <g key={label + index}>
            <rect x={x} y={y} width="50" height="32" fill={fills[index]} opacity="0.78" stroke="#e0f2fe" />
            <text x={x + 25} y={y + 20} fill="#020617" textAnchor="middle" fontSize="10" fontWeight="900">{label}</text>
          </g>
        );
      })}
    </>
  );
}

function RemovedSquareThumb({ label }: { label: string }) {
  return (
    <>
      <rect x="34" y="16" width="76" height="60" fill="#22d3ee" opacity="0.76" stroke="#e0f2fe" strokeWidth="3" />
      <rect x="82" y="48" width="28" height="28" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="5 4" />
      <text x="92" y="28" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">{label}</text>
    </>
  );
}

function TrigTriangleThumb({ complement }: { complement: boolean }) {
  return (
    <>
      <polygon points="28,74 124,74 124,22" fill="#22d3ee" opacity="0.75" stroke="#e0f2fe" strokeWidth="3" />
      <path d="M 48 74 A 20 20 0 0 0 66 64" stroke="#f59e0b" strokeWidth="4" fill="none" />
      <line x1="124" y1="74" x2="124" y2="22" stroke="#ef4444" strokeWidth="4" />
      <line x1="28" y1="74" x2="124" y2="74" stroke="#22c55e" strokeWidth="4" />
      <text x="74" y="38" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">{complement ? "90°-θ" : "sin cos tan"}</text>
    </>
  );
}

function UnitCircleThumb({ tangent }: { tangent: boolean }) {
  return (
    <>
      <circle cx="70" cy="48" r="30" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <line x1="40" y1="48" x2="104" y2="48" stroke="#64748b" strokeWidth="2" />
      <line x1="70" y1="78" x2="70" y2="16" stroke="#64748b" strokeWidth="2" />
      <line x1="70" y1="48" x2="94" y2="30" stroke="#f59e0b" strokeWidth="4" />
      <line x1="94" y1="30" x2="94" y2="48" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 3" />
      <line x1="70" y1="48" x2="94" y2="48" stroke="#22c55e" strokeWidth="3" />
      {tangent && <line x1="100" y1="16" x2="100" y2="80" stroke="#a78bfa" strokeWidth="3" />}
      <text x="124" y="50" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">{tangent ? "tan" : "(cos,sin)"}</text>
    </>
  );
}

function ArcThumb({ label }: { label: string }) {
  return (
    <>
      <circle cx="72" cy="54" r="34" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <line x1="72" y1="54" x2="106" y2="54" stroke="#22c55e" strokeWidth="4" />
      <line x1="72" y1="54" x2="91" y2="26" stroke="#22c55e" strokeWidth="4" />
      <path d="M 106 54 A 34 34 0 0 0 91 26" stroke="#f59e0b" strokeWidth="7" fill="none" />
      <text x="118" y="76" fill="#e0f2fe" textAnchor="middle" fontSize="12" fontWeight="900">{label}</text>
    </>
  );
}

function TrigGraphThumb() {
  return (
    <>
      <circle cx="43" cy="48" r="24" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <line x1="43" y1="48" x2="62" y2="33" stroke="#f59e0b" strokeWidth="3" />
      <polyline points="82,48 94,26 106,48 118,70 130,48 142,26" fill="none" stroke="#ef4444" strokeWidth="4" />
      <polyline points="82,26 94,48 106,70 118,48 130,26 142,48" fill="none" stroke="#22c55e" strokeWidth="3" />
    </>
  );
}

function RotationThumb({ label }: { label: string }) {
  return (
    <>
      <circle cx="70" cy="50" r="32" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <line x1="70" y1="50" x2="105" y2="50" stroke="#64748b" strokeWidth="2" />
      <line x1="70" y1="50" x2="92" y2="28" stroke="#22c55e" strokeWidth="4" />
      <line x1="70" y1="50" x2="54" y2="22" stroke="#ef4444" strokeWidth="4" />
      <path d="M 102 50 A 32 32 0 0 0 54 22" stroke="#f59e0b" strokeWidth="4" fill="none" />
      <text x="122" y="74" fill="#e0f2fe" textAnchor="middle" fontSize="12" fontWeight="900">{label}</text>
    </>
  );
}

function TriangleCircleThumb() {
  return (
    <>
      <circle cx="78" cy="48" r="34" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <polygon points="44,62 116,62 84,18" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
      <line x1="78" y1="48" x2="112" y2="48" stroke="#22c55e" strokeWidth="3" />
      <text x="118" y="28" fill="#e0f2fe" fontSize="11" fontWeight="900">2R</text>
    </>
  );
}

function ProjectionTriangleThumb({ label }: { label: string }) {
  return (
    <>
      <polygon points="28,72 126,72 72,24" fill="#22d3ee" opacity="0.75" stroke="#e0f2fe" strokeWidth="3" />
      <line x1="72" y1="24" x2="72" y2="72" stroke="#ef4444" strokeWidth="4" strokeDasharray="5 4" />
      <path d="M 48 72 A 22 22 0 0 0 62 55" stroke="#f59e0b" strokeWidth="4" fill="none" />
      <text x="110" y="28" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">{label}</text>
    </>
  );
}

function SmallAngleThumb() {
  return (
    <>
      <circle cx="64" cy="68" r="46" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <line x1="64" y1="68" x2="118" y2="68" stroke="#e0f2fe" strokeWidth="3" />
      <line x1="64" y1="68" x2="116" y2="52" stroke="#f59e0b" strokeWidth="3" />
      <line x1="116" y1="68" x2="116" y2="52" stroke="#ef4444" strokeWidth="4" />
      <line x1="126" y1="68" x2="126" y2="48" stroke="#a78bfa" strokeWidth="4" />
      <text x="78" y="24" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">sin θ≈θ</text>
    </>
  );
}

function MiniGrid() {
  return (
    <>
      {Array.from({ length: 5 }, (_, index) => <line key={`v${index}`} x1={30 + index * 24} y1="12" x2={30 + index * 24} y2="82" stroke="#334155" strokeWidth="1" />)}
      {Array.from({ length: 4 }, (_, index) => <line key={`h${index}`} x1="18" y1={22 + index * 18} x2="142" y2={22 + index * 18} stroke="#334155" strokeWidth="1" />)}
      <line x1="18" y1="58" x2="142" y2="58" stroke="#94a3b8" strokeWidth="2" />
      <line x1="78" y1="12" x2="78" y2="82" stroke="#94a3b8" strokeWidth="2" />
    </>
  );
}

function CoordinateSegmentThumb({ slope }: { slope: boolean }) {
  return (
    <>
      <MiniGrid />
      <line x1="42" y1="68" x2="118" y2="26" stroke="#22d3ee" strokeWidth="4" />
      <line x1="42" y1="68" x2="118" y2="68" stroke="#f59e0b" strokeWidth="3" strokeDasharray="4 3" />
      <line x1="118" y1="68" x2="118" y2="26" stroke="#ef4444" strokeWidth="3" strokeDasharray="4 3" />
      <circle cx="42" cy="68" r="5" fill="#ef4444" />
      <circle cx="118" cy="26" r="5" fill="#ef4444" />
      <text x="86" y="18" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">{slope ? "rise/run" : "distance"}</text>
    </>
  );
}

function CoordinateMidpointThumb({ section }: { section: boolean }) {
  return (
    <>
      <MiniGrid />
      <line x1="34" y1="66" x2="126" y2="30" stroke="#22d3ee" strokeWidth="4" />
      <circle cx="34" cy="66" r="5" fill="#ef4444" />
      <circle cx="126" cy="30" r="5" fill="#ef4444" />
      <circle cx={section ? 72 : 80} cy={section ? 51 : 48} r="6" fill="#a78bfa" />
      <text x="82" y="18" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">{section ? "m:n" : "midpoint"}</text>
    </>
  );
}

function CoordinateLineThumb({ point }: { point: boolean }) {
  return (
    <>
      <MiniGrid />
      <line x1="28" y1="72" x2="134" y2="24" stroke="#22d3ee" strokeWidth="4" />
      <circle cx={point ? 82 : 78} cy={point ? 47 : 58} r="5" fill="#ef4444" />
      <text x="116" y="78" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">{point ? "point-slope" : "y=mx+c"}</text>
    </>
  );
}

function ParallelLinesThumb() {
  return (
    <>
      <MiniGrid />
      <line x1="24" y1="66" x2="132" y2="26" stroke="#22d3ee" strokeWidth="4" />
      <line x1="24" y1="82" x2="132" y2="42" stroke="#f59e0b" strokeWidth="4" />
    </>
  );
}

function PerpendicularLinesThumb() {
  return (
    <>
      <MiniGrid />
      <line x1="34" y1="74" x2="124" y2="24" stroke="#22d3ee" strokeWidth="4" />
      <line x1="55" y1="24" x2="112" y2="78" stroke="#ef4444" strokeWidth="4" />
      <rect x="77" y="46" width="10" height="10" fill="none" stroke="#e0f2fe" strokeWidth="2" />
    </>
  );
}

function CoordinateTriangleThumb() {
  return (
    <>
      <MiniGrid />
      <polygon points="36,70 124,64 84,20" fill="#22d3ee" opacity="0.7" stroke="#e0f2fe" strokeWidth="3" />
      <text x="112" y="25" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">area</text>
    </>
  );
}

function CoordinateCircleThumb() {
  return (
    <>
      <MiniGrid />
      <circle cx="82" cy="48" r="28" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <line x1="82" y1="48" x2="110" y2="34" stroke="#f59e0b" strokeWidth="4" />
      <circle cx="82" cy="48" r="5" fill="#a78bfa" />
      <text x="116" y="78" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">circle</text>
    </>
  );
}

function CoordinateTransformThumb({ mode }: { mode: "translate" | "reflect" | "rotate" | "scale" }) {
  return (
    <>
      <MiniGrid />
      <circle cx="58" cy="60" r="6" fill="#22d3ee" />
      <circle cx={mode === "reflect" ? 102 : mode === "rotate" ? 92 : mode === "scale" ? 116 : 106} cy={mode === "reflect" ? 60 : mode === "rotate" ? 30 : mode === "scale" ? 38 : 36} r="6" fill="#ef4444" />
      <line x1="58" y1="60" x2={mode === "reflect" ? 102 : mode === "rotate" ? 92 : mode === "scale" ? 116 : 106} y2={mode === "reflect" ? 60 : mode === "rotate" ? 30 : mode === "scale" ? 38 : 36} stroke="#f59e0b" strokeWidth="3" markerEnd="url(#thumb-arrow)" />
      <defs><marker id="thumb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#f59e0b" /></marker></defs>
      <text x="82" y="18" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">{mode}</text>
    </>
  );
}

function CoordinatePythagoreanThumb() {
  return (
    <>
      <MiniGrid />
      <polygon points="54,68 120,68 54,26" fill="#22d3ee" opacity="0.75" stroke="#e0f2fe" strokeWidth="3" />
      <line x1="120" y1="68" x2="54" y2="26" stroke="#ef4444" strokeWidth="4" />
      <text x="112" y="24" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">a²+b²</text>
    </>
  );
}

function CalcAxes() {
  return (
    <>
      <line x1="18" y1="66" x2="142" y2="66" stroke="#64748b" strokeWidth="2" />
      <line x1="38" y1="14" x2="38" y2="82" stroke="#64748b" strokeWidth="2" />
    </>
  );
}

function CalcGraphThumb({ mode }: { mode: "limit" | "tangent" | "secants" | "power" | "mvt" }) {
  return (
    <>
      <CalcAxes />
      <path d="M 24 72 C 48 18, 76 20, 134 34" fill="none" stroke="#22d3ee" strokeWidth="4" />
      {(mode === "tangent" || mode === "power") && <line x1="58" y1="58" x2="122" y2="24" stroke="#ef4444" strokeWidth="4" />}
      {mode === "secants" && (
        <>
          <line x1="44" y1="52" x2="122" y2="30" stroke="#f59e0b" strokeWidth="3" />
          <line x1="58" y1="44" x2="108" y2="28" stroke="#ef4444" strokeWidth="3" />
        </>
      )}
      {mode === "limit" && (
        <>
          <circle cx="70" cy="34" r="5" fill="#f59e0b" />
          <circle cx="95" cy="28" r="5" fill="#ef4444" />
          <line x1="82" y1="14" x2="82" y2="78" stroke="#a78bfa" strokeWidth="2" strokeDasharray="4 3" />
        </>
      )}
      {mode === "mvt" && (
        <>
          <line x1="34" y1="58" x2="130" y2="34" stroke="#f59e0b" strokeWidth="3" />
          <line x1="58" y1="48" x2="112" y2="34" stroke="#ef4444" strokeWidth="3" />
        </>
      )}
      <text x="110" y="80" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">{mode}</text>
    </>
  );
}

function CalcRectangleThumb() {
  return (
    <>
      <rect x="34" y="38" width="58" height="34" fill="#22d3ee" opacity="0.75" stroke="#e0f2fe" />
      <rect x="92" y="38" width="22" height="34" fill="#f59e0b" opacity="0.8" stroke="#e0f2fe" />
      <rect x="34" y="20" width="58" height="18" fill="#22c55e" opacity="0.75" stroke="#e0f2fe" />
      <rect x="92" y="20" width="22" height="18" fill="#ef4444" opacity="0.75" stroke="#e0f2fe" />
      <text x="118" y="80" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">uv</text>
    </>
  );
}

function CalcChainThumb() {
  return (
    <>
      <rect x="24" y="34" width="32" height="24" rx="5" fill="#22d3ee" />
      <rect x="66" y="34" width="32" height="24" rx="5" fill="#f59e0b" />
      <rect x="108" y="34" width="32" height="24" rx="5" fill="#22c55e" />
      <line x1="56" y1="46" x2="66" y2="46" stroke="#e0f2fe" strokeWidth="3" />
      <line x1="98" y1="46" x2="108" y2="46" stroke="#e0f2fe" strokeWidth="3" />
      <text x="82" y="78" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">dy/dx</text>
    </>
  );
}

function CalcAreaThumb() {
  return (
    <>
      <CalcAxes />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={38 + i * 12} y={54 - i * 3} width="11" height={66 - (54 - i * 3)} fill="#f59e0b" opacity="0.5" />)}
      <path d="M 28 66 C 52 58, 78 28, 132 34" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <text x="116" y="80" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">∫ area</text>
    </>
  );
}

function CalcTaylorThumb() {
  return (
    <>
      <CalcAxes />
      <path d="M 28 66 C 48 22, 86 22, 132 54" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <path d="M 28 70 C 58 42, 88 38, 132 50" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="5 4" />
      <text x="116" y="80" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">Taylor</text>
    </>
  );
}

function CalcOptimizationThumb() {
  return (
    <>
      <CalcAxes />
      <path d="M 24 66 C 46 18, 72 18, 92 66 C 105 88, 126 60, 138 34" fill="none" stroke="#22d3ee" strokeWidth="4" />
      <circle cx="58" cy="28" r="5" fill="#ef4444" />
      <circle cx="104" cy="68" r="5" fill="#a78bfa" />
      <text x="112" y="18" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">f'=0</text>
    </>
  );
}

function NumberDotsThumb({ grouped }: { grouped: boolean }) {
  return (
    <>
      {Array.from({ length: 18 }, (_, index) => <circle key={index} cx={28 + (index % 6) * 18} cy={24 + Math.floor(index / 6) * 18} r="6" fill={index === 17 && !grouped ? "#f97316" : "#22d3ee"} />)}
      {grouped && Array.from({ length: 3 }, (_, index) => <rect key={index} x={20 + index * 42} y="16" width="34" height="54" rx="8" fill="none" stroke="#f59e0b" strokeWidth="3" />)}
      <text x="124" y="78" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">{grouped ? "a=bq+r" : "2k+1"}</text>
    </>
  );
}

function NumberArrayThumb({ composite }: { composite: boolean }) {
  const cols = composite ? 5 : 13;
  return (
    <>
      {Array.from({ length: composite ? 20 : 13 }, (_, index) => <circle key={index} cx={26 + (index % cols) * 10} cy={26 + Math.floor(index / cols) * 14} r="4" fill="#22d3ee" />)}
      <rect x="18" y="18" width={composite ? 54 : 132} height={composite ? 52 : 14} fill="none" stroke="#f59e0b" strokeWidth="3" />
      <text x="112" y="78" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">{composite ? "a x b" : "prime"}</text>
    </>
  );
}

function FactorTreeThumb() {
  return (
    <>
      <circle cx="80" cy="18" r="12" fill="#f59e0b" />
      <circle cx="50" cy="48" r="12" fill="#22c55e" />
      <circle cx="110" cy="48" r="12" fill="#f59e0b" />
      <circle cx="96" cy="76" r="10" fill="#22c55e" />
      <circle cx="124" cy="76" r="10" fill="#22c55e" />
      <line x1="80" y1="30" x2="50" y2="36" stroke="#e0f2fe" strokeWidth="3" />
      <line x1="80" y1="30" x2="110" y2="36" stroke="#e0f2fe" strokeWidth="3" />
      <line x1="110" y1="60" x2="96" y2="66" stroke="#e0f2fe" strokeWidth="3" />
      <line x1="110" y1="60" x2="124" y2="66" stroke="#e0f2fe" strokeWidth="3" />
    </>
  );
}

function EuclidThumb() {
  return (
    <>
      {[2, 3, 5, 7].map((prime, index) => <text key={prime} x={34 + index * 26} y="34" fill="#22d3ee" fontSize="14" fontWeight="900">{prime}</text>)}
      <text x="80" y="58" fill="#e0f2fe" textAnchor="middle" fontSize="12" fontWeight="900">p1p2...pn + 1</text>
      <text x="80" y="78" fill="#f59e0b" textAnchor="middle" fontSize="11" fontWeight="900">remainder 1</text>
    </>
  );
}

function GcdThumb() {
  return (
    <>
      <rect x="28" y="24" width="104" height="18" rx="5" fill="#22d3ee" />
      <rect x="28" y="52" width="66" height="18" rx="5" fill="#f97316" />
      <text x="108" y="80" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">gcd</text>
    </>
  );
}

function LcmThumb() {
  return (
    <>
      <line x1="22" y1="34" x2="138" y2="34" stroke="#64748b" strokeWidth="3" />
      <line x1="22" y1="62" x2="138" y2="62" stroke="#64748b" strokeWidth="3" />
      {[42, 66, 90, 114].map((x) => <circle key={`a-${x}`} cx={x} cy="34" r="5" fill="#22d3ee" />)}
      {[54, 86, 118].map((x) => <circle key={`b-${x}`} cx={x} cy="62" r="5" fill="#f97316" />)}
      <line x1="118" y1="20" x2="118" y2="74" stroke="#22c55e" strokeWidth="4" />
    </>
  );
}

function ModuloThumb({ cycle }: { cycle: boolean }) {
  return (
    <>
      <circle cx="72" cy="48" r="31" fill="none" stroke="#22d3ee" strokeWidth="4" />
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2 - Math.PI / 2;
        return <circle key={index} cx={72 + Math.cos(angle) * 31} cy={48 + Math.sin(angle) * 31} r="5" fill={index === 3 ? "#f97316" : "#e0f2fe"} />;
      })}
      {cycle && <path d="M 72 17 A 31 31 0 1 1 43 60" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 4" />}
      <text x="124" y="78" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">mod m</text>
    </>
  );
}

function DigitSumThumb() {
  return (
    <>
      {["5", "3", "8", "2"].map((digit, index) => <text key={digit + index} x={38 + index * 24} y="42" fill="#22d3ee" fontSize="18" fontWeight="900">{digit}</text>)}
      <text x="80" y="66" fill="#f59e0b" textAnchor="middle" fontSize="12" fontWeight="900">5+3+8+2</text>
      <text x="118" y="82" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">mod 9</text>
    </>
  );
}

function SqrtTwoThumb() {
  return (
    <>
      <rect x="36" y="20" width="52" height="52" fill="#22d3ee" opacity="0.55" stroke="#e0f2fe" strokeWidth="3" />
      <line x1="36" y1="72" x2="88" y2="20" stroke="#f97316" strokeWidth="4" />
      <text x="118" y="48" fill="#e0f2fe" textAnchor="middle" fontSize="11" fontWeight="900">sqrt2</text>
      <text x="118" y="66" fill="#f59e0b" textAnchor="middle" fontSize="10" fontWeight="900">not p/q</text>
    </>
  );
}

function SequenceLineThumb() {
  return (
    <>
      <line x1="24" y1="48" x2="138" y2="48" stroke="#64748b" strokeWidth="3" />
      {[34, 58, 82, 106, 130].map((x) => <circle key={x} cx={x} cy="48" r="7" fill="#22d3ee" />)}
      <text x="84" y="76" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">+d +d +d</text>
    </>
  );
}

function TriangularSequenceThumb() {
  const dots = [];
  for (let row = 1; row <= 5; row += 1) for (let col = 0; col < row; col += 1) dots.push([62 + col * 12 - row * 6, 18 + row * 12]);
  return (
    <>
      {dots.map(([x, y], index) => <circle key={index} cx={x} cy={y} r="4" fill="#22d3ee" />)}
      <text x="112" y="72" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">n(n+1)/2</text>
    </>
  );
}

function NaturalSumRectangleThumb() {
  const size = 11;
  const startX = 34;
  const baseY = 72;
  const blueCells = Array.from({ length: 5 }).flatMap((_, row) =>
    Array.from({ length: row + 1 }, (__, col) => ({ x: startX + col * size, y: baseY - (row + 1) * size })),
  );
  const pinkCells = Array.from({ length: 5 }).flatMap((_, row) =>
    Array.from({ length: 5 - row }, (__, col) => ({ x: startX + (row + col) * size, y: baseY - (row + 2) * size })),
  );
  return (
    <>
      <rect x="26" y="12" width="74" height="70" rx="8" fill="#020617" stroke="#334155" strokeWidth="2" />
      {pinkCells.map((cell, index) => <rect key={`pink-${index}`} x={cell.x} y={cell.y} width={size} height={size} fill="#dc7580" stroke="#f8fafc" strokeWidth="0.8" />)}
      {blueCells.map((cell, index) => <rect key={`blue-${index}`} x={cell.x} y={cell.y} width={size} height={size} fill="#4338ca" stroke="#f8fafc" strokeWidth="0.8" />)}
      <text x="118" y="36" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">1+...+n</text>
      <text x="118" y="55" fill="#f59e0b" textAnchor="middle" fontSize="10" fontWeight="900">n(n+1)/2</text>
    </>
  );
}

function SquareLayerThumb() {
  return (
    <>
      {Array.from({ length: 25 }, (_, index) => {
        const row = Math.floor(index / 5);
        const col = index % 5;
        return <rect key={index} x={34 + col * 12} y={18 + row * 12} width="10" height="10" fill={Math.max(row, col) % 2 ? "#22d3ee" : "#f97316"} />;
      })}
      <text x="118" y="72" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">odd layers</text>
    </>
  );
}

function SeriesBarsThumb({ paired }: { paired: boolean }) {
  return (
    <>
      {[46, 58, 70, 44, 30, 20].map((height, index) => <rect key={index} x={28 + index * 18} y={78 - height} width="12" height={height} rx="3" fill={index % 2 ? "#22d3ee" : "#8b5cf6"} />)}
      {paired && <path d="M 34 18 C 60 5, 92 5, 118 18" fill="none" stroke="#f59e0b" strokeWidth="3" />}
      <text x="118" y="82" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">{paired ? "pair" : "sum"}</text>
    </>
  );
}

function InfiniteHalvesThumb() {
  return (
    <>
      <rect x="30" y="16" width="70" height="70" fill="#020617" stroke="#e0f2fe" strokeWidth="2" />
      <rect x="30" y="16" width="35" height="70" fill="#4338ca" stroke="#8dd3d0" strokeWidth="1" />
      <rect x="65" y="51" width="35" height="35" fill="#3ba5a0" stroke="#8dd3d0" strokeWidth="1" />
      <rect x="65" y="16" width="17.5" height="35" fill="#4338ca" stroke="#8dd3d0" strokeWidth="1" />
      <rect x="82.5" y="33.5" width="17.5" height="17.5" fill="#3ba5a0" stroke="#8dd3d0" strokeWidth="1" />
      <text x="118" y="38" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">1/2+1/4</text>
      <text x="118" y="58" fill="#f59e0b" textAnchor="middle" fontSize="12" fontWeight="900">= 1</text>
    </>
  );
}

function FibonacciThumb({ spiral }: { spiral: boolean }) {
  return (
    <>
      <rect x="28" y="50" width="16" height="16" fill="#22d3ee" />
      <rect x="44" y="50" width="16" height="16" fill="#f97316" />
      <rect x="60" y="34" width="32" height="32" fill="#22c55e" opacity="0.8" />
      <rect x="92" y="18" width="48" height="48" fill="#8b5cf6" opacity="0.75" />
      {spiral && <path d="M 28 66 Q 28 50 44 50 Q 60 50 60 34 Q 92 34 92 18" fill="none" stroke="#e0f2fe" strokeWidth="3" />}
    </>
  );
}

function PascalThumb() {
  return (
    <>
      {Array.from({ length: 5 }, (_, row) => Array.from({ length: row + 1 }, (_, col) => <circle key={`${row}-${col}`} cx={80 + (col - row / 2) * 22} cy={18 + row * 14} r="7" fill={row === 4 && col === 2 ? "#f97316" : "#22d3ee"} />))}
      <text x="118" y="82" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">C(n,k)</text>
    </>
  );
}

function InductionThumb() {
  return (
    <>
      {Array.from({ length: 7 }, (_, index) => <rect key={index} x={32 + index * 16} y={26 + index * 3} width="10" height="44" rx="3" fill={index === 0 ? "#f97316" : "#22d3ee"} transform={`rotate(${index * 5} ${37 + index * 16} ${48 + index * 3})`} />)}
      <text x="84" y="82" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">P(k) =&gt; P(k+1)</text>
    </>
  );
}

function HarmonicThumb() {
  return (
    <>
      {Array.from({ length: 18 }, (_, index) => <rect key={index} x={24 + index * 7} y={76 - 46 / (index + 1)} width="5" height={46 / (index + 1)} fill={Math.floor(Math.log2(index + 1)) % 2 ? "#22d3ee" : "#8b5cf6"} />)}
      <text x="112" y="34" fill="#e0f2fe" textAnchor="middle" fontSize="10" fontWeight="900">1/n</text>
      <text x="112" y="52" fill="#f59e0b" textAnchor="middle" fontSize="10" fontWeight="900">diverges</text>
    </>
  );
}

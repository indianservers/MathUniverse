import { Link, useParams } from "react-router-dom";
import FormulaPanel from "../components/FormulaPanel";
import StepPanel from "../components/StepPanel";
import VisualProofLayout from "../components/VisualProofLayout";
import { getVisualProofCategory } from "../data/visualProofCategories";
import { getVisualProof } from "../data/visualProofsIndex";
import CompletingTheSquareProof from "../proofs/algebra/CompletingTheSquareProof";
import CubeOfDifferenceProof from "../proofs/algebra/CubeOfDifferenceProof";
import CubeOfSumProof from "../proofs/algebra/CubeOfSumProof";
import DifferenceOfSquaresProof from "../proofs/algebra/DifferenceOfSquaresProof";
import DistributiveLawAreaModelProof from "../proofs/algebra/DistributiveLawAreaModelProof";
import PerfectSquareTrinomialRecognitionProof from "../proofs/algebra/PerfectSquareTrinomialRecognitionProof";
import ProductOfBinomialsProof from "../proofs/algebra/ProductOfBinomialsProof";
import QuadraticFactorizationAreaModelProof from "../proofs/algebra/QuadraticFactorizationAreaModelProof";
import SquareOfDifferenceProof from "../proofs/algebra/SquareOfDifferenceProof";
import SquareOfSumProof from "../proofs/algebra/SquareOfSumProof";
import SumAndDifferenceProductProof from "../proofs/algebra/SumAndDifferenceProductProof";
import ThreeTermSquareProof from "../proofs/algebra/ThreeTermSquareProof";
import CircleAreaUnrollingProof from "../proofs/CircleAreaUnrollingProof";
import ChainRuleVisualProof from "../proofs/calculus/ChainRuleVisualProof";
import DefiniteIntegralAccumulatedAreaProof from "../proofs/calculus/DefiniteIntegralAccumulatedAreaProof";
import DerivativeOfExponentialProof from "../proofs/calculus/DerivativeOfExponentialProof";
import DerivativeOfSineProof from "../proofs/calculus/DerivativeOfSineProof";
import DerivativePowerRuleProof from "../proofs/calculus/DerivativePowerRuleProof";
import DerivativeSlopeOfTangentProof from "../proofs/calculus/DerivativeSlopeOfTangentProof";
import FundamentalTheoremCalculusProof from "../proofs/calculus/FundamentalTheoremCalculusProof";
import IntegrationByPartsVisualProof from "../proofs/calculus/IntegrationByPartsVisualProof";
import LimitApproachesPointProof from "../proofs/calculus/LimitApproachesPointProof";
import MeanValueTheoremProof from "../proofs/calculus/MeanValueTheoremProof";
import OptimizationDerivativeMaxMinProof from "../proofs/calculus/OptimizationDerivativeMaxMinProof";
import ProductRuleVisualProof from "../proofs/calculus/ProductRuleVisualProof";
import RiemannSumsAreaUnderCurveProof from "../proofs/calculus/RiemannSumsAreaUnderCurveProof";
import SecantBecomesTangentProof from "../proofs/calculus/SecantBecomesTangentProof";
import TaylorSeriesApproximationProof from "../proofs/calculus/TaylorSeriesApproximationProof";
import CompositesRectangularArraysProof from "../proofs/number-theory/CompositesRectangularArraysProof";
import DivisibilityBy3And9Proof from "../proofs/number-theory/DivisibilityBy3And9Proof";
import DivisibilityEqualGroupingProof from "../proofs/number-theory/DivisibilityEqualGroupingProof";
import EuclidInfinitelyManyPrimesProof from "../proofs/number-theory/EuclidInfinitelyManyPrimesProof";
import EvenOddPairingProof from "../proofs/number-theory/EvenOddPairingProof";
import FundamentalTheoremArithmeticProof from "../proofs/number-theory/FundamentalTheoremArithmeticProof";
import GcdEuclideanAlgorithmProof from "../proofs/number-theory/GcdEuclideanAlgorithmProof";
import IrrationalitySqrt2Proof from "../proofs/number-theory/IrrationalitySqrt2Proof";
import LcmGridAlignmentProof from "../proofs/number-theory/LcmGridAlignmentProof";
import ModularArithmeticClockProof from "../proofs/number-theory/ModularArithmeticClockProof";
import PrimesNonRectangularArraysProof from "../proofs/number-theory/PrimesNonRectangularArraysProof";
import RemainderPatternCyclesProof from "../proofs/number-theory/RemainderPatternCyclesProof";
import ArithmeticProgressionEqualStepsProof from "../proofs/sequences-series/ArithmeticProgressionEqualStepsProof";
import FibonacciSequenceTilingProof from "../proofs/sequences-series/FibonacciSequenceTilingProof";
import FibonacciSpiralApproximationProof from "../proofs/sequences-series/FibonacciSpiralApproximationProof";
import FiniteGeometricSeriesSumProof from "../proofs/sequences-series/FiniteGeometricSeriesSumProof";
import GeometricProgressionScalingProof from "../proofs/sequences-series/GeometricProgressionScalingProof";
import HarmonicSeriesGrowthIntuitionProof from "../proofs/sequences-series/HarmonicSeriesGrowthIntuitionProof";
import InfiniteGeometricSeriesConvergenceProof from "../proofs/sequences-series/InfiniteGeometricSeriesConvergenceProof";
import PascalTriangleBinomialCoefficientsProof from "../proofs/sequences-series/PascalTriangleBinomialCoefficientsProof";
import SquareNumbersOddLayersProof from "../proofs/sequences-series/SquareNumbersOddLayersProof";
import SumArithmeticProgressionProof from "../proofs/sequences-series/SumArithmeticProgressionProof";
import SumFirstNNaturalNumbersProof from "../proofs/sequences-series/SumFirstNNaturalNumbersProof";
import SumFirstNOddNumbersProof from "../proofs/sequences-series/SumFirstNOddNumbersProof";
import SumOfFibonacciNumbersProof from "../proofs/sequences-series/SumOfFibonacciNumbersProof";
import TriangularNumbersProof from "../proofs/sequences-series/TriangularNumbersProof";
import VisualInductionDominoGrowthProof from "../proofs/sequences-series/VisualInductionDominoGrowthProof";
import CircleEquationProof from "../proofs/coordinate-geometry/CircleEquationProof";
import CoordinateProofPythagoreanProof from "../proofs/coordinate-geometry/CoordinateProofPythagoreanProof";
import DistanceFormulaProof from "../proofs/coordinate-geometry/DistanceFormulaProof";
import MidpointFormulaProof from "../proofs/coordinate-geometry/MidpointFormulaProof";
import ParallelLinesSlopeProof from "../proofs/coordinate-geometry/ParallelLinesSlopeProof";
import PerpendicularLinesSlopeProof from "../proofs/coordinate-geometry/PerpendicularLinesSlopeProof";
import PointSlopeLineEquationProof from "../proofs/coordinate-geometry/PointSlopeLineEquationProof";
import ReflectionAcrossAxesProof from "../proofs/coordinate-geometry/ReflectionAcrossAxesProof";
import RotationAboutOriginProof from "../proofs/coordinate-geometry/RotationAboutOriginProof";
import ScalingDilationOriginProof from "../proofs/coordinate-geometry/ScalingDilationOriginProof";
import SectionFormulaProof from "../proofs/coordinate-geometry/SectionFormulaProof";
import SlopeFormulaProof from "../proofs/coordinate-geometry/SlopeFormulaProof";
import SlopeInterceptLineEquationProof from "../proofs/coordinate-geometry/SlopeInterceptLineEquationProof";
import TranslationOfPointsProof from "../proofs/coordinate-geometry/TranslationOfPointsProof";
import TriangleAreaCoordinatesProof from "../proofs/coordinate-geometry/TriangleAreaCoordinatesProof";
import CircleCircumferenceUnwrappingProof from "../proofs/geometry/CircleCircumferenceUnwrappingProof";
import ExteriorAngleTheoremProof from "../proofs/geometry/ExteriorAngleTheoremProof";
import ParallelogramAreaShearingProof from "../proofs/geometry/ParallelogramAreaShearingProof";
import PolygonInteriorAngleSumProof from "../proofs/geometry/PolygonInteriorAngleSumProof";
import PythagoreanAreaRearrangementProof from "../proofs/geometry/PythagoreanAreaRearrangementProof";
import SectorAreaFormulaProof from "../proofs/geometry/SectorAreaFormulaProof";
import SimilarTrianglesProof from "../proofs/geometry/SimilarTrianglesProof";
import TrapezoidAreaDuplicationProof from "../proofs/geometry/TrapezoidAreaDuplicationProof";
import TriangleAngleSumProof from "../proofs/geometry/TriangleAngleSumProof";
import TriangleAreaHalfRectangleProof from "../proofs/geometry/TriangleAreaHalfRectangleProof";
import ArcLengthFormulaProof from "../proofs/trigonometry/ArcLengthFormulaProof";
import ComplementaryAngleIdentitiesProof from "../proofs/trigonometry/ComplementaryAngleIdentitiesProof";
import CosineAngleAdditionProof from "../proofs/trigonometry/CosineAngleAdditionProof";
import CosineRuleProof from "../proofs/trigonometry/CosineRuleProof";
import DoubleAngleIdentitiesProof from "../proofs/trigonometry/DoubleAngleIdentitiesProof";
import PythagoreanTrigIdentityProof from "../proofs/trigonometry/PythagoreanTrigIdentityProof";
import RadiansArcRadiusProof from "../proofs/trigonometry/RadiansArcRadiusProof";
import RightTriangleTrigRatiosProof from "../proofs/trigonometry/RightTriangleTrigRatiosProof";
import SineAngleAdditionProof from "../proofs/trigonometry/SineAngleAdditionProof";
import SineRuleProof from "../proofs/trigonometry/SineRuleProof";
import SmallAngleApproximationProof from "../proofs/trigonometry/SmallAngleApproximationProof";
import TangentRatioIdentityProof from "../proofs/trigonometry/TangentRatioIdentityProof";
import TriangleAreaSineFormulaProof from "../proofs/trigonometry/TriangleAreaSineFormulaProof";
import TrigGraphsFromUnitCircleProof from "../proofs/trigonometry/TrigGraphsFromUnitCircleProof";
import UnitCircleSineCosineProof from "../proofs/trigonometry/UnitCircleSineCosineProof";

export default function VisualProofPage() {
  const { categorySlug = "", proofSlug = "" } = useParams();
  const category = getVisualProofCategory(categorySlug);
  const proof = getVisualProof(categorySlug, proofSlug);

  if (!category || !proof) {
    return (
      <section className="rounded-xl border border-slate-200 bg-white/88 p-6 dark:border-white/10 dark:bg-white/[0.05]">
        <h1 className="text-2xl font-black text-slate-950 dark:text-white">Proof not found</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          This proof route is not registered in the Visual Proofs index.
        </p>
        <Link to="/visual-proofs" className="action-primary mt-4 rounded-xl">Open Visual Proofs</Link>
      </section>
    );
  }

  switch (proof.componentKey) {
    case "CircleAreaUnrollingProof":
      return <CircleAreaUnrollingProof category={category} proof={proof} />;
    case "PythagoreanAreaRearrangementProof":
      return <PythagoreanAreaRearrangementProof category={category} proof={proof} />;
    case "TriangleAreaHalfRectangleProof":
      return <TriangleAreaHalfRectangleProof category={category} proof={proof} />;
    case "TriangleAngleSumProof":
      return <TriangleAngleSumProof category={category} proof={proof} />;
    case "ExteriorAngleTheoremProof":
      return <ExteriorAngleTheoremProof category={category} proof={proof} />;
    case "SimilarTrianglesProof":
      return <SimilarTrianglesProof category={category} proof={proof} />;
    case "CircleCircumferenceUnwrappingProof":
      return <CircleCircumferenceUnwrappingProof category={category} proof={proof} />;
    case "SectorAreaFormulaProof":
      return <SectorAreaFormulaProof category={category} proof={proof} />;
    case "ParallelogramAreaShearingProof":
      return <ParallelogramAreaShearingProof category={category} proof={proof} />;
    case "TrapezoidAreaDuplicationProof":
      return <TrapezoidAreaDuplicationProof category={category} proof={proof} />;
    case "PolygonInteriorAngleSumProof":
      return <PolygonInteriorAngleSumProof category={category} proof={proof} />;
    case "SquareOfSumProof":
      return <SquareOfSumProof category={category} proof={proof} />;
    case "SquareOfDifferenceProof":
      return <SquareOfDifferenceProof category={category} proof={proof} />;
    case "DifferenceOfSquaresProof":
      return <DifferenceOfSquaresProof category={category} proof={proof} />;
    case "ProductOfBinomialsProof":
      return <ProductOfBinomialsProof category={category} proof={proof} />;
    case "DistributiveLawAreaModelProof":
      return <DistributiveLawAreaModelProof category={category} proof={proof} />;
    case "ThreeTermSquareProof":
      return <ThreeTermSquareProof category={category} proof={proof} />;
    case "CompletingTheSquareProof":
      return <CompletingTheSquareProof category={category} proof={proof} />;
    case "QuadraticFactorizationAreaModelProof":
      return <QuadraticFactorizationAreaModelProof category={category} proof={proof} />;
    case "PerfectSquareTrinomialRecognitionProof":
      return <PerfectSquareTrinomialRecognitionProof category={category} proof={proof} />;
    case "CubeOfSumProof":
      return <CubeOfSumProof category={category} proof={proof} />;
    case "CubeOfDifferenceProof":
      return <CubeOfDifferenceProof category={category} proof={proof} />;
    case "SumAndDifferenceProductProof":
      return <SumAndDifferenceProductProof category={category} proof={proof} />;
    case "RightTriangleTrigRatiosProof":
      return <RightTriangleTrigRatiosProof category={category} proof={proof} />;
    case "UnitCircleSineCosineProof":
      return <UnitCircleSineCosineProof category={category} proof={proof} />;
    case "PythagoreanTrigIdentityProof":
      return <PythagoreanTrigIdentityProof category={category} proof={proof} />;
    case "TangentRatioIdentityProof":
      return <TangentRatioIdentityProof category={category} proof={proof} />;
    case "RadiansArcRadiusProof":
      return <RadiansArcRadiusProof category={category} proof={proof} />;
    case "ArcLengthFormulaProof":
      return <ArcLengthFormulaProof category={category} proof={proof} />;
    case "TrigGraphsFromUnitCircleProof":
      return <TrigGraphsFromUnitCircleProof category={category} proof={proof} />;
    case "CosineAngleAdditionProof":
      return <CosineAngleAdditionProof category={category} proof={proof} />;
    case "SineAngleAdditionProof":
      return <SineAngleAdditionProof category={category} proof={proof} />;
    case "DoubleAngleIdentitiesProof":
      return <DoubleAngleIdentitiesProof category={category} proof={proof} />;
    case "SineRuleProof":
      return <SineRuleProof category={category} proof={proof} />;
    case "CosineRuleProof":
      return <CosineRuleProof category={category} proof={proof} />;
    case "ComplementaryAngleIdentitiesProof":
      return <ComplementaryAngleIdentitiesProof category={category} proof={proof} />;
    case "TriangleAreaSineFormulaProof":
      return <TriangleAreaSineFormulaProof category={category} proof={proof} />;
    case "SmallAngleApproximationProof":
      return <SmallAngleApproximationProof category={category} proof={proof} />;
    case "DistanceFormulaProof":
      return <DistanceFormulaProof category={category} proof={proof} />;
    case "MidpointFormulaProof":
      return <MidpointFormulaProof category={category} proof={proof} />;
    case "SectionFormulaProof":
      return <SectionFormulaProof category={category} proof={proof} />;
    case "SlopeFormulaProof":
      return <SlopeFormulaProof category={category} proof={proof} />;
    case "SlopeInterceptLineEquationProof":
      return <SlopeInterceptLineEquationProof category={category} proof={proof} />;
    case "PointSlopeLineEquationProof":
      return <PointSlopeLineEquationProof category={category} proof={proof} />;
    case "ParallelLinesSlopeProof":
      return <ParallelLinesSlopeProof category={category} proof={proof} />;
    case "PerpendicularLinesSlopeProof":
      return <PerpendicularLinesSlopeProof category={category} proof={proof} />;
    case "TriangleAreaCoordinatesProof":
      return <TriangleAreaCoordinatesProof category={category} proof={proof} />;
    case "CircleEquationProof":
      return <CircleEquationProof category={category} proof={proof} />;
    case "TranslationOfPointsProof":
      return <TranslationOfPointsProof category={category} proof={proof} />;
    case "ReflectionAcrossAxesProof":
      return <ReflectionAcrossAxesProof category={category} proof={proof} />;
    case "RotationAboutOriginProof":
      return <RotationAboutOriginProof category={category} proof={proof} />;
    case "ScalingDilationOriginProof":
      return <ScalingDilationOriginProof category={category} proof={proof} />;
    case "CoordinateProofPythagoreanProof":
      return <CoordinateProofPythagoreanProof category={category} proof={proof} />;
    case "LimitApproachesPointProof":
      return <LimitApproachesPointProof category={category} proof={proof} />;
    case "DerivativeSlopeOfTangentProof":
      return <DerivativeSlopeOfTangentProof category={category} proof={proof} />;
    case "SecantBecomesTangentProof":
      return <SecantBecomesTangentProof category={category} proof={proof} />;
    case "DerivativePowerRuleProof":
      return <DerivativePowerRuleProof category={category} proof={proof} />;
    case "ProductRuleVisualProof":
      return <ProductRuleVisualProof category={category} proof={proof} />;
    case "ChainRuleVisualProof":
      return <ChainRuleVisualProof category={category} proof={proof} />;
    case "MeanValueTheoremProof":
      return <MeanValueTheoremProof category={category} proof={proof} />;
    case "RiemannSumsAreaUnderCurveProof":
      return <RiemannSumsAreaUnderCurveProof category={category} proof={proof} />;
    case "DefiniteIntegralAccumulatedAreaProof":
      return <DefiniteIntegralAccumulatedAreaProof category={category} proof={proof} />;
    case "FundamentalTheoremCalculusProof":
      return <FundamentalTheoremCalculusProof category={category} proof={proof} />;
    case "IntegrationByPartsVisualProof":
      return <IntegrationByPartsVisualProof category={category} proof={proof} />;
    case "DerivativeOfSineProof":
      return <DerivativeOfSineProof category={category} proof={proof} />;
    case "DerivativeOfExponentialProof":
      return <DerivativeOfExponentialProof category={category} proof={proof} />;
    case "TaylorSeriesApproximationProof":
      return <TaylorSeriesApproximationProof category={category} proof={proof} />;
    case "OptimizationDerivativeMaxMinProof":
      return <OptimizationDerivativeMaxMinProof category={category} proof={proof} />;
    case "EvenOddPairingProof":
      return <EvenOddPairingProof category={category} proof={proof} />;
    case "DivisibilityEqualGroupingProof":
      return <DivisibilityEqualGroupingProof category={category} proof={proof} />;
    case "PrimesNonRectangularArraysProof":
      return <PrimesNonRectangularArraysProof category={category} proof={proof} />;
    case "CompositesRectangularArraysProof":
      return <CompositesRectangularArraysProof category={category} proof={proof} />;
    case "FundamentalTheoremArithmeticProof":
      return <FundamentalTheoremArithmeticProof category={category} proof={proof} />;
    case "EuclidInfinitelyManyPrimesProof":
      return <EuclidInfinitelyManyPrimesProof category={category} proof={proof} />;
    case "GcdEuclideanAlgorithmProof":
      return <GcdEuclideanAlgorithmProof category={category} proof={proof} />;
    case "LcmGridAlignmentProof":
      return <LcmGridAlignmentProof category={category} proof={proof} />;
    case "ModularArithmeticClockProof":
      return <ModularArithmeticClockProof category={category} proof={proof} />;
    case "RemainderPatternCyclesProof":
      return <RemainderPatternCyclesProof category={category} proof={proof} />;
    case "DivisibilityBy3And9Proof":
      return <DivisibilityBy3And9Proof category={category} proof={proof} />;
    case "IrrationalitySqrt2Proof":
      return <IrrationalitySqrt2Proof category={category} proof={proof} />;
    case "ArithmeticProgressionEqualStepsProof":
      return <ArithmeticProgressionEqualStepsProof category={category} proof={proof} />;
    case "SumFirstNNaturalNumbersProof":
      return <SumFirstNNaturalNumbersProof category={category} proof={proof} />;
    case "SumFirstNOddNumbersProof":
      return <SumFirstNOddNumbersProof category={category} proof={proof} />;
    case "SumArithmeticProgressionProof":
      return <SumArithmeticProgressionProof category={category} proof={proof} />;
    case "GeometricProgressionScalingProof":
      return <GeometricProgressionScalingProof category={category} proof={proof} />;
    case "FiniteGeometricSeriesSumProof":
      return <FiniteGeometricSeriesSumProof category={category} proof={proof} />;
    case "InfiniteGeometricSeriesConvergenceProof":
      return <InfiniteGeometricSeriesConvergenceProof category={category} proof={proof} />;
    case "TriangularNumbersProof":
      return <TriangularNumbersProof category={category} proof={proof} />;
    case "SquareNumbersOddLayersProof":
      return <SquareNumbersOddLayersProof category={category} proof={proof} />;
    case "FibonacciSequenceTilingProof":
      return <FibonacciSequenceTilingProof category={category} proof={proof} />;
    case "FibonacciSpiralApproximationProof":
      return <FibonacciSpiralApproximationProof category={category} proof={proof} />;
    case "SumOfFibonacciNumbersProof":
      return <SumOfFibonacciNumbersProof category={category} proof={proof} />;
    case "PascalTriangleBinomialCoefficientsProof":
      return <PascalTriangleBinomialCoefficientsProof category={category} proof={proof} />;
    case "VisualInductionDominoGrowthProof":
      return <VisualInductionDominoGrowthProof category={category} proof={proof} />;
    case "HarmonicSeriesGrowthIntuitionProof":
      return <HarmonicSeriesGrowthIntuitionProof category={category} proof={proof} />;
    default:
      return <ComingSoonProof category={category} proof={proof} />;
  }
}

function ComingSoonProof({ category, proof }: { category: NonNullable<ReturnType<typeof getVisualProofCategory>>; proof: NonNullable<ReturnType<typeof getVisualProof>> }) {
  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={
        <div className="flex min-h-[360px] items-center justify-center bg-slate-950 p-6 text-center text-white">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-cyan-200">Coming soon</p>
            <h2 className="mt-3 text-3xl font-black">Dedicated proof route reserved</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-cyan-50/75">
              This page is intentionally route-ready so future visual proofs can be added without changing the architecture.
            </p>
          </div>
        </div>
      }
      controls={<PlaceholderPanel title="Controls" body="Interactive controls will appear here when this proof is implemented." />}
      steps={
        <StepPanel
          activeStep={0}
          steps={[
            {
              id: "planned",
              title: "Proof planned",
              description: "This proof is included in the index and will receive its own SVG or canvas visualization in a later phase.",
              focusLabel: "planned",
            },
          ]}
        />
      }
      formula={<FormulaPanel formulas={["Detailed derivation coming soon"]} />}
      conceptNotes={<p>This placeholder keeps the route, metadata, and page layout consistent while the proof library grows.</p>}
      reflectionQuestions={["Which visual transformation would make this proof easiest to understand?", "What prerequisite idea should be shown first?"]}
    />
  );
}

function PlaceholderPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]">
      <h2 className="text-base font-black text-slate-950 dark:text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
    </section>
  );
}

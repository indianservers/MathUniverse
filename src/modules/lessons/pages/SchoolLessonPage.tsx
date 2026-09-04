import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ListChecks,
  Route,
  SearchCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  adjacentSchoolLessons,
  findSchoolLesson,
} from "../catalog/school/schoolSyllabusCatalog";
import SchoolLessonInteractiveLab from "../components/SchoolLessonInteractiveLab";
import DecimalExpansionTargetLesson10040 from "../schoolTargets/DecimalExpansionTargetLesson10040";
import TerminatingDecimalsTargetLesson10041 from "../schoolTargets/TerminatingDecimalsTargetLesson10041";
import RationalIrrationalTargetLesson10042 from "../schoolTargets/RationalIrrationalTargetLesson10042";
import SuccessiveMagnificationTargetLesson10043 from "../schoolTargets/SuccessiveMagnificationTargetLesson10043";
import RationalisationTargetLesson10044 from "../schoolTargets/RationalisationTargetLesson10044";
import NthRootsTargetLesson10045 from "../schoolTargets/NthRootsTargetLesson10045";
import GraphicalZerosTargetLesson10046 from "../schoolTargets/GraphicalZerosTargetLesson10046";
import PolynomialDivisionTargetLesson10047 from "../schoolTargets/PolynomialDivisionTargetLesson10047";
import RemainderTheoremTargetLesson10048 from "../schoolTargets/RemainderTheoremTargetLesson10048";
import FactorTheoremTargetLesson10049 from "../schoolTargets/FactorTheoremTargetLesson10049";
import ZerosCoefficientsTargetLesson10050 from "../schoolTargets/ZerosCoefficientsTargetLesson10050";
import CubicIdentitiesTargetLesson10051 from "../schoolTargets/CubicIdentitiesTargetLesson10051";
import FactorisationPracticeTargetLesson10052 from "../schoolTargets/FactorisationPracticeTargetLesson10052";
import EuclideanFoundationsTargetLesson10053 from "../schoolTargets/EuclideanFoundationsTargetLesson10053";
import EuclidPostulatesTargetLesson10054 from "../schoolTargets/EuclidPostulatesTargetLesson10054";
import FifthPostulateEquivalenceTargetLesson10055 from "../schoolTargets/FifthPostulateEquivalenceTargetLesson10055";
import AxiomTheoremTargetLesson10056 from "../schoolTargets/AxiomTheoremTargetLesson10056";
import ProofStructureTargetLesson10057 from "../schoolTargets/ProofStructureTargetLesson10057";
import VerticalAnglesTargetLesson10058 from "../schoolTargets/VerticalAnglesTargetLesson10058";
import LinearPairTargetLesson10059 from "../schoolTargets/LinearPairTargetLesson10059";
import CorrespondingAnglesTargetLesson10060 from "../schoolTargets/CorrespondingAnglesTargetLesson10060";
import AlternateInteriorTargetLesson10061 from "../schoolTargets/AlternateInteriorTargetLesson10061";
import SameSideInteriorTargetLesson10062 from "../schoolTargets/SameSideInteriorTargetLesson10062";
import ParallelConverseTargetLesson10063 from "../schoolTargets/ParallelConverseTargetLesson10063";
import TriangleAngleSumTargetLesson10064 from "../schoolTargets/TriangleAngleSumTargetLesson10064";
import ExteriorAngleTargetLesson10065 from "../schoolTargets/ExteriorAngleTargetLesson10065";
import SasCongruenceTargetLesson10066 from "../schoolTargets/SasCongruenceTargetLesson10066";
import AsaCongruenceTargetLesson10067 from "../schoolTargets/AsaCongruenceTargetLesson10067";
import AasCongruenceTargetLesson10068 from "../schoolTargets/AasCongruenceTargetLesson10068";
import SssCongruenceTargetLesson10069 from "../schoolTargets/SssCongruenceTargetLesson10069";
import RhsCongruenceTargetLesson10070 from "../schoolTargets/RhsCongruenceTargetLesson10070";
import EqualSidesAnglesTargetLesson10071 from "../schoolTargets/EqualSidesAnglesTargetLesson10071";
import TriangleInequalityTargetLesson10072 from "../schoolTargets/TriangleInequalityTargetLesson10072";
import ParallelogramSidesTargetLesson10073 from "../schoolTargets/ParallelogramSidesTargetLesson10073";
import ParallelogramAnglesTargetLesson10074 from "../schoolTargets/ParallelogramAnglesTargetLesson10074";
import ParallelogramDiagonalsTargetLesson10075 from "../schoolTargets/ParallelogramDiagonalsTargetLesson10075";
import ParallelogramConditionsTargetLesson10076 from "../schoolTargets/ParallelogramConditionsTargetLesson10076";
import MidpointTheoremTargetLesson10077 from "../schoolTargets/MidpointTheoremTargetLesson10077";
import MidpointConverseTargetLesson10078 from "../schoolTargets/MidpointConverseTargetLesson10078";
import HeronFormulaTargetLesson10079 from "../schoolTargets/HeronFormulaTargetLesson10079";
import SemiPerimeterTargetLesson10080 from "../schoolTargets/SemiPerimeterTargetLesson10080";
import CoordinateHeronTargetLesson10081 from "../schoolTargets/CoordinateHeronTargetLesson10081";
import CombinedSolidsTargetLesson10082 from "../schoolTargets/CombinedSolidsTargetLesson10082";
import DistanceFormulaTargetLesson10083 from "../schoolTargets/DistanceFormulaTargetLesson10083";
import MidpointFormulaTargetLesson10084 from "../schoolTargets/MidpointFormulaTargetLesson10084";
import InternalSectionFormulaTargetLesson10085 from "../schoolTargets/InternalSectionFormulaTargetLesson10085";
import PlaceValueTargetLesson10001 from "../schoolTargets/PlaceValueTargetLesson10001";
import NumberNamingTargetLesson10002 from "../schoolTargets/NumberNamingTargetLesson10002";
import EstimationRoundingTargetLesson10003 from "../schoolTargets/EstimationRoundingTargetLesson10003";
import ErrorBoundsTargetLesson10004 from "../schoolTargets/ErrorBoundsTargetLesson10004";
import MixedUnitsTargetLesson10005 from "../schoolTargets/MixedUnitsTargetLesson10005";
import PictographTargetLesson10006 from "../schoolTargets/PictographTargetLesson10006";
import BarGraphTargetLesson10007 from "../schoolTargets/BarGraphTargetLesson10007";
import SurveyFrequencyTargetLesson10008 from "../schoolTargets/SurveyFrequencyTargetLesson10008";
import MisleadingGraphTargetLesson10009 from "../schoolTargets/MisleadingGraphTargetLesson10009";
import NumberPatternTargetLesson10010 from "../schoolTargets/NumberPatternTargetLesson10010";
import ShapePatternTargetLesson10011 from "../schoolTargets/ShapePatternTargetLesson10011";
import RuleMachineTargetLesson10012 from "../schoolTargets/RuleMachineTargetLesson10012";
import DivisibilityTargetLesson10013 from "../schoolTargets/DivisibilityTargetLesson10013";
import DigitalRootTargetLesson10014 from "../schoolTargets/DigitalRootTargetLesson10014";
import RemainderTargetLesson10015 from "../schoolTargets/RemainderTargetLesson10015";
import UnitRateTargetLesson10016 from "../schoolTargets/UnitRateTargetLesson10016";
import RatioTableTargetLesson10017 from "../schoolTargets/RatioTableTargetLesson10017";
import BillsTaxTargetLesson10018 from "../schoolTargets/BillsTaxTargetLesson10018";
import ProfitLossTargetLesson10019 from "../schoolTargets/ProfitLossTargetLesson10019";
import HouseholdBudgetTargetLesson10020 from "../schoolTargets/HouseholdBudgetTargetLesson10020";
import ScaleFactorTargetLesson10021 from "../schoolTargets/ScaleFactorTargetLesson10021";
import CopyLineSegmentTargetLesson10022 from "../schoolTargets/CopyLineSegmentTargetLesson10022";
import CopyAngleTargetLesson10023 from "../schoolTargets/CopyAngleTargetLesson10023";
import PerpendicularBisectorTargetLesson10024 from "../schoolTargets/PerpendicularBisectorTargetLesson10024";
import AngleBisectorTargetLesson10025 from "../schoolTargets/AngleBisectorTargetLesson10025";
import PerpendicularPointTargetLesson10026 from "../schoolTargets/PerpendicularPointTargetLesson10026";
import ParallelLineTargetLesson10027 from "../schoolTargets/ParallelLineTargetLesson10027";
import TriangleSssTargetLesson10028 from "../schoolTargets/TriangleSssTargetLesson10028";
import TriangleSasTargetLesson10029 from "../schoolTargets/TriangleSasTargetLesson10029";
import TriangleAsaTargetLesson10030 from "../schoolTargets/TriangleAsaTargetLesson10030";
import RightTriangleRhsTargetLesson10031 from "../schoolTargets/RightTriangleRhsTargetLesson10031";
import DoubleBarGraphTargetLesson10032 from "../schoolTargets/DoubleBarGraphTargetLesson10032";
import MeanMedianModePathTargetLesson10033 from "../schoolTargets/MeanMedianModePathTargetLesson10033";
import RangeSpreadTargetLesson10034 from "../schoolTargets/RangeSpreadTargetLesson10034";
import FlowchartLogicTargetLesson10035 from "../schoolTargets/FlowchartLogicTargetLesson10035";
import PatternEncodingTargetLesson10036 from "../schoolTargets/PatternEncodingTargetLesson10036";
import MagicSquaresTargetLesson10037 from "../schoolTargets/MagicSquaresTargetLesson10037";
import RouteMapTargetLesson10038 from "../schoolTargets/RouteMapTargetLesson10038";
import TabularPatternTargetLesson10039 from "../schoolTargets/TabularPatternTargetLesson10039";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { SchoolLessonContent } from "../syllabus/lessonSyllabusTypes";

const DECIMAL_EXPANSION_ROUTE_SLUG =
  "class-9-real-numbers-decimal-expansion-of-rational-numbers";

export default function SchoolLessonPage() {
  const { levelSlug: routeLevelSlug, lessonSlug } = useParams();
  const lesson = findSchoolLesson(routeLevelSlug, lessonSlug);
  if (!lesson) return <LessonNotFound />;
  if (lesson.slug === DECIMAL_EXPANSION_ROUTE_SLUG)
    return <DecimalExpansionTargetLesson10040 lesson={lesson} />;
  if (lesson.numericId === 10041)
    return <TerminatingDecimalsTargetLesson10041 lesson={lesson} />;
  if (lesson.numericId === 10042)
    return <RationalIrrationalTargetLesson10042 lesson={lesson} />;
  if (lesson.numericId === 10043)
    return <SuccessiveMagnificationTargetLesson10043 lesson={lesson} />;
  if (lesson.numericId === 10044)
    return <RationalisationTargetLesson10044 lesson={lesson} />;
  if (lesson.numericId === 10045)
    return <NthRootsTargetLesson10045 lesson={lesson} />;
  if (lesson.numericId === 10046)
    return <GraphicalZerosTargetLesson10046 lesson={lesson} />;
  if (lesson.numericId === 10047)
    return <PolynomialDivisionTargetLesson10047 lesson={lesson} />;
  if (lesson.numericId === 10048)
    return <RemainderTheoremTargetLesson10048 lesson={lesson} />;
  if (lesson.numericId === 10049)
    return <FactorTheoremTargetLesson10049 lesson={lesson} />;
  if (lesson.numericId === 10050)
    return <ZerosCoefficientsTargetLesson10050 lesson={lesson} />;
  if (lesson.numericId === 10051)
    return <CubicIdentitiesTargetLesson10051 lesson={lesson} />;
  if (lesson.numericId === 10052)
    return <FactorisationPracticeTargetLesson10052 lesson={lesson} />;
  if (lesson.numericId === 10053)
    return <EuclideanFoundationsTargetLesson10053 lesson={lesson} />;
  if (lesson.numericId === 10054)
    return <EuclidPostulatesTargetLesson10054 lesson={lesson} />;
  if (lesson.numericId === 10055)
    return <FifthPostulateEquivalenceTargetLesson10055 lesson={lesson} />;
  if (lesson.numericId === 10056)
    return <AxiomTheoremTargetLesson10056 lesson={lesson} />;
  if (lesson.numericId === 10057)
    return <ProofStructureTargetLesson10057 lesson={lesson} />;
  if (lesson.numericId === 10058)
    return <VerticalAnglesTargetLesson10058 lesson={lesson} />;
  if (lesson.numericId === 10059)
    return <LinearPairTargetLesson10059 lesson={lesson} />;
  if (lesson.numericId === 10060)
    return <CorrespondingAnglesTargetLesson10060 lesson={lesson} />;
  if (lesson.numericId === 10061)
    return <AlternateInteriorTargetLesson10061 lesson={lesson} />;
  if (lesson.numericId === 10062)
    return <SameSideInteriorTargetLesson10062 lesson={lesson} />;
  if (lesson.numericId === 10063)
    return <ParallelConverseTargetLesson10063 lesson={lesson} />;
  if (lesson.numericId === 10064)
    return <TriangleAngleSumTargetLesson10064 lesson={lesson} />;
  if (lesson.numericId === 10065)
    return <ExteriorAngleTargetLesson10065 lesson={lesson} />;
  if (lesson.numericId === 10066)
    return <SasCongruenceTargetLesson10066 lesson={lesson} />;
  if (lesson.numericId === 10067)
    return <AsaCongruenceTargetLesson10067 lesson={lesson} />;
  if (lesson.numericId === 10068)
    return <AasCongruenceTargetLesson10068 lesson={lesson} />;
  if (lesson.numericId === 10069)
    return <SssCongruenceTargetLesson10069 lesson={lesson} />;
  if (lesson.numericId === 10070)
    return <RhsCongruenceTargetLesson10070 lesson={lesson} />;
  if (lesson.numericId === 10071)
    return <EqualSidesAnglesTargetLesson10071 lesson={lesson} />;
  if (lesson.numericId === 10072)
    return <TriangleInequalityTargetLesson10072 lesson={lesson} />;
  if (lesson.numericId === 10073)
    return <ParallelogramSidesTargetLesson10073 lesson={lesson} />;
  if (lesson.numericId === 10074)
    return <ParallelogramAnglesTargetLesson10074 lesson={lesson} />;
  if (lesson.numericId === 10075)
    return <ParallelogramDiagonalsTargetLesson10075 lesson={lesson} />;
  if (lesson.numericId === 10076)
    return <ParallelogramConditionsTargetLesson10076 lesson={lesson} />;
  if (lesson.numericId === 10077)
    return <MidpointTheoremTargetLesson10077 lesson={lesson} />;
  if (lesson.numericId === 10078)
    return <MidpointConverseTargetLesson10078 lesson={lesson} />;
  if (lesson.numericId === 10079)
    return <HeronFormulaTargetLesson10079 lesson={lesson} />;
  if (lesson.numericId === 10080)
    return <SemiPerimeterTargetLesson10080 lesson={lesson} />;
  if (lesson.numericId === 10081)
    return <CoordinateHeronTargetLesson10081 lesson={lesson} />;
  if (lesson.numericId === 10082)
    return <CombinedSolidsTargetLesson10082 lesson={lesson} />;
  if (lesson.numericId === 10083)
    return <DistanceFormulaTargetLesson10083 lesson={lesson} />;
  if (lesson.numericId === 10084)
    return <MidpointFormulaTargetLesson10084 lesson={lesson} />;
  if (lesson.numericId === 10085)
    return <InternalSectionFormulaTargetLesson10085 lesson={lesson} />;
  if (lesson.numericId === 10001)
    return <PlaceValueTargetLesson10001 lesson={lesson} />;
  if (lesson.numericId === 10002)
    return <NumberNamingTargetLesson10002 lesson={lesson} />;
  if (lesson.numericId === 10003)
    return <EstimationRoundingTargetLesson10003 lesson={lesson} />;
  if (lesson.numericId === 10004)
    return <ErrorBoundsTargetLesson10004 lesson={lesson} />;
  if (lesson.numericId === 10005)
    return <MixedUnitsTargetLesson10005 lesson={lesson} />;
  if (lesson.numericId === 10006)
    return <PictographTargetLesson10006 lesson={lesson} />;
  if (lesson.numericId === 10007)
    return <BarGraphTargetLesson10007 lesson={lesson} />;
  if (lesson.numericId === 10008)
    return <SurveyFrequencyTargetLesson10008 lesson={lesson} />;
  if (lesson.numericId === 10009)
    return <MisleadingGraphTargetLesson10009 lesson={lesson} />;
  if (lesson.numericId === 10010)
    return <NumberPatternTargetLesson10010 lesson={lesson} />;
  if (lesson.numericId === 10011)
    return <ShapePatternTargetLesson10011 lesson={lesson} />;
  if (lesson.numericId === 10012)
    return <RuleMachineTargetLesson10012 lesson={lesson} />;
  if (lesson.numericId === 10013)
    return <DivisibilityTargetLesson10013 lesson={lesson} />;
  if (lesson.numericId === 10014)
    return <DigitalRootTargetLesson10014 lesson={lesson} />;
  if (lesson.numericId === 10015)
    return <RemainderTargetLesson10015 lesson={lesson} />;
  if (lesson.numericId === 10016)
    return <UnitRateTargetLesson10016 lesson={lesson} />;
  if (lesson.numericId === 10017)
    return <RatioTableTargetLesson10017 lesson={lesson} />;
  if (lesson.numericId === 10018)
    return <BillsTaxTargetLesson10018 lesson={lesson} />;
  if (lesson.numericId === 10019)
    return <ProfitLossTargetLesson10019 lesson={lesson} />;
  if (lesson.numericId === 10020)
    return <HouseholdBudgetTargetLesson10020 lesson={lesson} />;
  if (lesson.numericId === 10021)
    return <ScaleFactorTargetLesson10021 lesson={lesson} />;
  if (lesson.numericId === 10022)
    return <CopyLineSegmentTargetLesson10022 lesson={lesson} />;
  if (lesson.numericId === 10023)
    return <CopyAngleTargetLesson10023 lesson={lesson} />;
  if (lesson.numericId === 10024)
    return <PerpendicularBisectorTargetLesson10024 lesson={lesson} />;
  if (lesson.numericId === 10025)
    return <AngleBisectorTargetLesson10025 lesson={lesson} />;
  if (lesson.numericId === 10026)
    return <PerpendicularPointTargetLesson10026 lesson={lesson} />;
  if (lesson.numericId === 10027)
    return <ParallelLineTargetLesson10027 lesson={lesson} />;
  if (lesson.numericId === 10028)
    return <TriangleSssTargetLesson10028 lesson={lesson} />;
  if (lesson.numericId === 10029)
    return <TriangleSasTargetLesson10029 lesson={lesson} />;
  if (lesson.numericId === 10030)
    return <TriangleAsaTargetLesson10030 lesson={lesson} />;
  if (lesson.numericId === 10031)
    return <RightTriangleRhsTargetLesson10031 lesson={lesson} />;
  if (lesson.numericId === 10032)
    return <DoubleBarGraphTargetLesson10032 lesson={lesson} />;
  if (lesson.numericId === 10033)
    return <MeanMedianModePathTargetLesson10033 lesson={lesson} />;
  if (lesson.numericId === 10034)
    return <RangeSpreadTargetLesson10034 lesson={lesson} />;
  if (lesson.numericId === 10035)
    return <FlowchartLogicTargetLesson10035 lesson={lesson} />;
  if (lesson.numericId === 10036)
    return <PatternEncodingTargetLesson10036 lesson={lesson} />;
  if (lesson.numericId === 10037)
    return <MagicSquaresTargetLesson10037 lesson={lesson} />;
  if (lesson.numericId === 10038)
    return <RouteMapTargetLesson10038 lesson={lesson} />;
  if (lesson.numericId === 10039)
    return <TabularPatternTargetLesson10039 lesson={lesson} />;
  const adjacent = adjacentSchoolLessons(lesson);
  const strengthened = getStrengthenedFoundationLesson(lesson.numericId);
  const content = strengthened
    ? strengthenedSchoolContent(strengthened)
    : lesson.content;
  const objectives =
    strengthened?.learningObjectives ?? lesson.metadata.learningObjectives;

  return (
    <div className="space-y-4" data-testid="school-lesson-page">
      <header className="rounded-3xl border border-cyan-100 bg-white p-5 shadow-xl shadow-cyan-950/5 dark:border-white/10 dark:bg-slate-950/75">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-600 dark:text-cyan-300">
              {lesson.metadata.academicLevel} - {lesson.metadata.conceptFamily}
            </p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">
              {lesson.title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              {content.summary}
            </p>
          </div>
          <Link className="action-secondary" to="/lessons/school">
            <ArrowLeft className="h-4 w-4" />
            School lessons
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip label={`${lesson.metadata.estimatedMinutes} min`} />
          <Chip label={lesson.metadata.difficulty} />
          <Chip label={lesson.metadata.lessonType} />
          {lesson.metadata.engineDependencies?.map((engine) => (
            <Chip key={engine} label={engine} />
          ))}
        </div>
      </header>

      <SchoolLessonInteractiveLab lesson={lesson} />

      <main className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <QualitySection
            lessonTitle={lesson.title}
            family={lesson.metadata.conceptFamily}
          />
          <Section
            icon={<BookOpen className="h-4 w-4" />}
            title="Learn"
            items={content.learn}
          />
          <Section
            icon={<Route className="h-4 w-4" />}
            title="Explore"
            items={content.explore}
          />
          <Section
            icon={<ListChecks className="h-4 w-4" />}
            title="Practice"
            items={content.practice}
          />
          {content.proofChecklist ? (
            <Section
              icon={<SearchCheck className="h-4 w-4" />}
              title="Proof checklist"
              items={content.proofChecklist}
            />
          ) : null}
          {content.constructionChecklist ? (
            <Section
              icon={<SearchCheck className="h-4 w-4" />}
              title="Construction checklist"
              items={content.constructionChecklist}
            />
          ) : null}
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20">
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <h2 className="flex items-center gap-2 text-sm font-black uppercase text-cyan-600 dark:text-cyan-300">
              <ClipboardCheck className="h-4 w-4" />
              Objectives
            </h2>
            <ul className="mt-3 space-y-2">
              {objectives.map((objective) => (
                <li
                  key={objective}
                  className="flex gap-2 text-sm leading-6 text-slate-600 dark:text-slate-300"
                >
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
                  {objective}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
            <h2 className="text-sm font-black uppercase text-cyan-600 dark:text-cyan-300">
              Syllabus tags
            </h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {lesson.metadata.syllabusTags.map((tag) => (
                <span
                  key={`${tag.board}-${tag.level}`}
                  className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black text-slate-600 dark:bg-white/10 dark:text-slate-300"
                >
                  {tag.board}
                </span>
              ))}
            </div>
          </section>
          <Section
            icon={<ClipboardCheck className="h-4 w-4" />}
            title="Assessment prompts"
            items={content.assessmentPrompts}
          />
        </aside>
      </main>

      <nav
        className="grid gap-3 sm:grid-cols-2"
        aria-label="Adjacent school lessons"
      >
        {adjacent.previous ? (
          <Link
            className="action-secondary justify-start"
            to={adjacent.previous.route}
          >
            <ArrowLeft className="h-4 w-4" />
            {adjacent.previous.title}
          </Link>
        ) : (
          <span />
        )}
        {adjacent.next ? (
          <Link
            className="action-secondary justify-end text-right"
            to={adjacent.next.route}
          >
            {adjacent.next.title}
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}

function strengthenedSchoolContent(
  lesson: NonNullable<ReturnType<typeof getStrengthenedFoundationLesson>>,
): SchoolLessonContent {
  return {
    summary: lesson.introduction,
    learn: [
      lesson.basicIdea,
      lesson.howItWorks,
      `Common mistake: ${lesson.misconceptions[0].mistake} Correction: ${lesson.misconceptions[0].correction}`,
    ],
    explore: lesson.guidedExploration.map((step) => step.prompt),
    practice: lesson.practice.slice(1, 4).map((item) => item.prompt),
    assessmentPrompts: [
      lesson.challenge.prompt,
      ...lesson.exitCheck.map((item) => item.prompt),
      `Give one real-life use: ${lesson.realLifeExamples[0].context}.`,
    ],
    proofChecklist:
      lesson.lessonType === "proof"
        ? [
            "Write the given statement clearly.",
            "Name the accepted definition, axiom, postulate, or theorem used.",
            "Give a reason for each step.",
            "Check that the conclusion proves exactly what was asked.",
          ]
        : undefined,
    constructionChecklist:
      lesson.topic.includes("Geometry") && lesson.lessonType === "procedure"
        ? [
            "Draw the given object first.",
            "Keep compass width fixed when equal lengths are needed.",
            "Mark intersection points clearly.",
            "Check the required equal length, angle, or parallel condition.",
          ]
        : undefined,
  };
}

function Section({
  icon,
  title,
  items,
}: {
  icon: JSX.Element;
  title: string;
  items: string[];
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/70">
      <h2 className="flex items-center gap-2 text-sm font-black uppercase text-cyan-600 dark:text-cyan-300">
        {icon}
        {title}
      </h2>
      <ol className="mt-3 space-y-2">
        {items.map((item, index) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-6 text-slate-600 dark:text-slate-300"
          >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-50 text-xs font-black text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-100">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function QualitySection({
  lessonTitle,
  family,
}: {
  lessonTitle: string;
  family: string;
}) {
  return (
    <section className="rounded-2xl border border-violet-200 bg-violet-50/70 p-4 dark:border-violet-300/20 dark:bg-violet-300/10">
      <h2 className="text-sm font-black uppercase text-violet-800 dark:text-violet-100">
        Lesson arc
      </h2>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <article className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
          <h3 className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">
            Hook
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
            Start with a prediction about {lessonTitle}, then change one input
            in the lab and name what stayed fixed.
          </p>
        </article>
        <article className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
          <h3 className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">
            Worked connection
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
            Connect the visual pattern to the formula, diagram, table, or proof
            language used in {family}.
          </p>
        </article>
        <article className="rounded-xl bg-white/85 p-3 dark:bg-slate-950/50">
          <h3 className="text-xs font-black uppercase text-slate-600 dark:text-slate-300">
            Exit check
          </h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-slate-700 dark:text-slate-200">
            Ask for one correct example, one non-example, and one sentence
            explaining why the method works.
          </p>
        </article>
      </div>
    </section>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600 dark:bg-white/10 dark:text-slate-300">
      {label}
    </span>
  );
}

function LessonNotFound() {
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
      <h1 className="text-2xl font-black">School lesson not found</h1>
      <p className="mt-2 text-sm">
        This generated school lesson is not registered.
      </p>
      <Link className="action-secondary mt-4" to="/lessons/school">
        Open school lessons
      </Link>
    </div>
  );
}

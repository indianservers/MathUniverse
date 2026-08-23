import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { factorsOf, formatFactorization, primeFactorization } from "../../../visual-proofs/utils/numberTheoryMath";
import AdapterFrame from "../components/AdapterFrame";
import { getStrengthenedFoundationLesson } from "../strengthening/foundationNumberContent";
import type { LessonAdapterProps } from "../types";

export default function NumberLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const strengthened = getStrengthenedFoundationLesson(lesson.id);
  const [n, setN] = useState(initialN(lesson.id));
  const [m, setM] = useState(initialM(lesson.id));
  const isFraction = /fraction|decimal|ratio|proportion|rate|percentage|change|scale/i.test(`${lesson.topic} ${lesson.title}`);
  const isPercent = lesson.id === 88;
  const range = rangeFor(lesson.id, isFraction);
  const lessonText = comparisonLessonText(lesson.id);

  useEffect(() => { setN(initialN(lesson.id)); setM(initialM(lesson.id)); }, [lesson.id, resetToken]);
  const changeN = (value: number) => { setN(Math.round(value)); onInteraction(); };
  const changeM = (value: number) => { setM(Math.round(value)); onInteraction(); };
  const fraction = isPercent ? Math.min(1, n / 100) : Math.min(1, m / Math.max(1, n));
  const factors = useMemo(() => factorsOf(Math.abs(n) || 1), [n]);
  const factorization = useMemo(() => formatFactorization(primeFactorization(Math.max(2, Math.abs(n)))), [n]);

  if (lesson.id === 69) {
    return <HcfGcdExperience lessonTitle={lesson.title} n={n} m={m} range={range} changeN={changeN} changeM={changeM} />;
  }

  return (
    <AdapterFrame title={`${lesson.title} manipulative`} value={isPercent ? `${n}%` : isFraction ? `${m}/${n}` : String(n)} footer={strengthened?.interaction.learningPurpose ?? "Uses the existing number-theory utilities for factors, prime factorisation, GCD, and LCM."}>
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-900">
          {isPercent ? <PercentModel percent={n} /> : isFraction ? <FractionModel numerator={m} denominator={n} fraction={fraction} /> : <NumberModel value={n} factors={factors} lessonId={lesson.id} />}
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-cyan-50 p-3 text-sm font-bold text-cyan-900 ring-1 ring-cyan-100 dark:bg-cyan-400/10 dark:text-cyan-100 dark:ring-cyan-400/20">
            {lessonText}
          </div>
          <NumberConceptTrace lessonId={lesson.id} n={n} m={m} factors={factors} factorization={factorization} />
          <SliderGroup title="Change the mathematics">
            <SliderControl density="compact" label={isPercent ? "percent" : isFraction ? "denominator" : "number"} value={n} min={range.nMin} max={range.nMax} step={1} onChange={changeN} />
            {!isPercent ? <SliderControl density="compact" label={isFraction ? "numerator" : "compare"} value={m} min={range.mMin} max={range.mMax} step={1} onChange={changeM} /> : null}
          </SliderGroup>
          <div className="grid grid-cols-2 gap-2">
            <Metric label={isPercent ? "fraction" : isFraction ? "decimal" : "classification"} value={isPercent ? `${n}/100` : isFraction ? (m / n).toFixed(3) : classificationFor(lesson.id, n)} />
            <Metric label={isPercent ? "decimal" : isFraction ? "percent" : "compare"} value={isPercent ? (n / 100).toFixed(2) : isFraction ? `${((m / n) * 100).toFixed(1)}%` : compareText(n, m)} />
            <Metric label={isFraction || isPercent ? "parts shown" : "prime factors"} value={isFraction || isPercent ? String(isPercent ? n : Math.min(m, n)) : factorization} />
            <Metric label={isFraction || isPercent ? "whole" : "factor count"} value={isFraction || isPercent ? "1" : String(factors.length)} />
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

function HcfGcdExperience({ lessonTitle, n, m, range, changeN, changeM }: { lessonTitle: string; n: number; m: number; range: ReturnType<typeof rangeFor>; changeN: (value: number) => void; changeM: (value: number) => void }) {
  const first = Math.max(1, Math.abs(Math.round(n)));
  const second = Math.max(1, Math.abs(Math.round(m)));
  const firstFactors = useMemo(() => factorsOf(first), [first]);
  const secondFactors = useMemo(() => factorsOf(second), [second]);
  const shared = useMemo(() => firstFactors.filter((factor) => secondFactors.includes(factor)), [firstFactors, secondFactors]);
  const greatest = shared.at(-1) ?? 1;
  const firstOnly = firstFactors.filter((factor) => !shared.includes(factor));
  const secondOnly = secondFactors.filter((factor) => !shared.includes(factor));
  const firstGroups = first / greatest;
  const secondGroups = second / greatest;
  const steps = euclideanSteps(first, second);

  return (
    <AdapterFrame title={`${lessonTitle} visual lab`} value={`gcd(${first}, ${second}) = ${greatest}`} footer="HCF is the greatest shared factor. GCD is the greatest number that divides both numbers exactly. Use the shared factors and Euclidean algorithm to verify it.">
      <section className="hcf-lab" aria-label="HCF and GCD interactive visual lab">
        <div className="hcf-hero">
          <div>
            <p className="hcf-kicker">Numbers and number theory</p>
            <h2>Find the largest shared divisor.</h2>
            <p>Compare every factor of both numbers. The biggest factor in the overlap is the HCF, also called the GCD.</p>
          </div>
          <div className="hcf-answer-card">
            <span>HCF/GCD</span>
            <strong>{greatest}</strong>
            <small>{greatest} divides {first} into {firstGroups} equal groups and {second} into {secondGroups} equal groups.</small>
          </div>
        </div>

        <div className="hcf-workspace">
          <div className="hcf-visual-panel">
            <HcfVennDiagram first={first} second={second} firstOnly={firstOnly} secondOnly={secondOnly} shared={shared} greatest={greatest} />
            <div className="hcf-factor-rows">
              <FactorRow label={`Factors of ${first}`} factors={firstFactors} shared={shared} greatest={greatest} tone="blue" />
              <FactorRow label={`Factors of ${second}`} factors={secondFactors} shared={shared} greatest={greatest} tone="orange" />
            </div>
            <GroupingModel first={first} second={second} gcdValue={greatest} />
          </div>

          <aside className="hcf-side-panel">
            <section className="hcf-explain-card">
              <span>Concept trace</span>
              <h3>Shared-factor intersection</h3>
              <p>The overlap contains factors that divide both numbers. Choose the greatest value in that overlap.</p>
            </section>

            <section className="hcf-controls-card">
              <h3>Change the numbers</h3>
              <SliderControl density="compact" label="first number" value={first} min={range.nMin} max={range.nMax} step={1} onChange={changeN} />
              <SliderControl density="compact" label="second number" value={second} min={range.mMin} max={range.mMax} step={1} onChange={changeM} />
            </section>

            <section className="hcf-euclid-card">
              <span>Fast method</span>
              <h3>Euclidean algorithm</h3>
              <div>
                {steps.map((step) => (
                  <p key={`${step.a}-${step.b}-${step.remainder}`}>
                    <strong>{step.a}</strong> = {step.b} x {step.quotient} + <b>{step.remainder}</b>
                  </p>
                ))}
              </div>
              <small>When the remainder becomes 0, the previous divisor is the GCD: {greatest}.</small>
            </section>

            <div className="hcf-metrics">
              <Metric label="first factorization" value={factorizationText(first)} />
              <Metric label="second factorization" value={factorizationText(second)} />
              <Metric label="common factors" value={shared.join(", ")} />
              <Metric label="largest shared" value={String(greatest)} />
            </div>
          </aside>
        </div>
      </section>
    </AdapterFrame>
  );
}

function HcfVennDiagram({ first, second, firstOnly, secondOnly, shared, greatest }: { first: number; second: number; firstOnly: number[]; secondOnly: number[]; shared: number[]; greatest: number }) {
  return (
    <div className="hcf-venn-card">
      <div className="hcf-venn-labels">
        <span>{first}</span>
        <strong>Shared factors</strong>
        <span>{second}</span>
      </div>
      <div className="hcf-venn">
        <div className="hcf-circle is-first">
          {firstOnly.slice(0, 8).map((factor) => <FactorBubble key={`first-${factor}`} factor={factor} />)}
        </div>
        <div className="hcf-circle is-second">
          {secondOnly.slice(0, 8).map((factor) => <FactorBubble key={`second-${factor}`} factor={factor} />)}
        </div>
        <div className="hcf-shared-stack">
          {shared.map((factor) => <FactorBubble key={`shared-${factor}`} factor={factor} highlight={factor === greatest} />)}
        </div>
      </div>
    </div>
  );
}

function FactorRow({ label, factors, shared, greatest, tone }: { label: string; factors: number[]; shared: number[]; greatest: number; tone: "blue" | "orange" }) {
  return (
    <div className={`hcf-factor-row is-${tone}`}>
      <strong>{label}</strong>
      <div>
        {factors.map((factor) => (
          <span key={factor} className={`${shared.includes(factor) ? "is-shared" : ""} ${factor === greatest ? "is-greatest" : ""}`}>{factor}</span>
        ))}
      </div>
    </div>
  );
}

function FactorBubble({ factor, highlight = false }: { factor: number; highlight?: boolean }) {
  return <span className={highlight ? "is-greatest" : ""}>{factor}</span>;
}

function GroupingModel({ first, second, gcdValue }: { first: number; second: number; gcdValue: number }) {
  const firstGroups = Math.min(12, first / gcdValue);
  const secondGroups = Math.min(12, second / gcdValue);
  return (
    <div className="hcf-grouping-card">
      <div>
        <h3>Largest equal groups</h3>
        <p>Use group size {gcdValue}. No leftovers for either number.</p>
      </div>
      <div className="hcf-group-rows">
        <GroupRow label={String(first)} groups={firstGroups} gcdValue={gcdValue} tone="blue" />
        <GroupRow label={String(second)} groups={secondGroups} gcdValue={gcdValue} tone="orange" />
      </div>
    </div>
  );
}

function GroupRow({ label, groups, gcdValue, tone }: { label: string; groups: number; gcdValue: number; tone: "blue" | "orange" }) {
  return (
    <div className={`hcf-group-row is-${tone}`}>
      <strong>{label}</strong>
      <div>{Array.from({ length: groups }, (_, index) => <span key={index}>{gcdValue}</span>)}</div>
    </div>
  );
}

function NumberConceptTrace({ lessonId, n, m, factors, factorization }: { lessonId: number; n: number; m: number; factors: number[]; factorization: string }) {
  const trace = numberConceptTraceFor(lessonId, n, m, factors, factorization);
  return (
    <section className="rounded-2xl border border-sky-100 bg-gradient-to-br from-white via-sky-50/70 to-cyan-50 p-3 dark:border-sky-300/20 dark:from-slate-950 dark:via-sky-300/10 dark:to-cyan-300/10" aria-label={`${trace.title} number concept trace`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-[10px] font-black uppercase tracking-wide text-sky-700 dark:text-sky-200">Concept trace</p>
          <h3 className="text-sm font-black text-slate-950 dark:text-white">{trace.title}</h3>
        </div>
        <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase text-sky-700 shadow-sm dark:bg-white/10 dark:text-sky-100">{trace.badge}</span>
      </div>
      <div className="mt-3 grid gap-2">
        {trace.rows.map((row) => (
          <div key={row.label} className="rounded-xl border border-slate-200 bg-white/85 p-2 dark:border-white/10 dark:bg-slate-950/55">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-300">{row.label}</span>
              <strong className="max-w-[150px] truncate font-mono text-sm text-slate-950 dark:text-white">{row.value}</strong>
            </div>
            <p className="mt-1 text-xs font-semibold leading-5 text-slate-600 dark:text-slate-300">{row.note}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 rounded-xl bg-sky-100/70 p-2 text-xs font-black leading-5 text-sky-950 dark:bg-sky-300/10 dark:text-sky-100">{trace.validity}</p>
    </section>
  );
}

type NumberConceptTraceSpec = {
  title: string;
  badge: string;
  validity: string;
  rows: Array<{ label: string; value: string; note: string }>;
};

function numberConceptTraceFor(lessonId: number, n: number, m: number, factors: number[], factorization: string): NumberConceptTraceSpec {
  const common = (title: string, badge: string, rows: NumberConceptTraceSpec["rows"], validity: string): NumberConceptTraceSpec => ({ title, badge, rows, validity });
  if (lessonId === 57) return common("Counting-number membership", "N starts at 1", [
    { label: "Selected", value: String(n), note: "A natural number counts one or more whole objects." },
    { label: "First value", value: "1", note: "This lesson uses the school convention that natural numbers start at 1." },
    { label: "Not included", value: "0, fractions", note: "Zero means none; fractions do not count whole objects." },
  ], "Natural-number visuals must show counting membership, not factor analysis.");
  if (lessonId === 58) return common("Whole-number membership", "0 included", [
    { label: "Selected", value: String(n), note: "Whole numbers include zero and counting numbers." },
    { label: "First value", value: "0", note: "Zero belongs because it names an empty count." },
    { label: "Excluded", value: "negative/fraction", note: "Whole numbers do not include parts or values below zero." },
  ], "Whole-number visuals must make zero visible as part of the set.");
  if (lessonId === 59) return common("Integer direction from zero", "signed steps", [
    { label: "Selected", value: String(n), note: n < 0 ? "Negative integers sit left of zero." : n > 0 ? "Positive integers sit right of zero." : "Zero is neither positive nor negative." },
    { label: "Opposite", value: String(-n), note: "Opposites are the same distance from zero in different directions." },
    { label: "Compare", value: compareText(n, m), note: "Farther right on the number line means greater." },
  ], "Integer visuals must show sign, direction, and order.");
  if (lessonId === 60) return common("Rational as ratio", "a/b", [
    { label: "Numerator", value: String(n), note: "The top value counts chosen parts." },
    { label: "Denominator", value: String(Math.max(1, m)), note: "The denominator must not be zero." },
    { label: "Decimal", value: (n / Math.max(1, m)).toFixed(3), note: "A rational value can be written as division of integers." },
  ], "Rational-number visuals must keep numerator and non-zero denominator visible.");
  if (lessonId === 61) return common("Irrational square-root check", "non-perfect square", [
    { label: "Radicand", value: String(n), note: "Check whether the number under the root is a perfect square." },
    { label: "Nearest square", value: nearestSquareText(n), note: "Non-perfect squares produce non-ending, non-repeating decimals." },
    { label: "Classification", value: classificationFor(lessonId, n), note: "The visual should explain why exact square roots are special." },
  ], "Irrational-number visuals must separate exact roots from decimal approximations.");
  if (lessonId === 62) return common("Real number-line placement", "ordered line", [
    { label: "Selected", value: String(n), note: "Every real number has a position on the number line." },
    { label: "Left/right", value: n < 0 ? "left of 0" : n > 0 ? "right of 0" : "at 0", note: "Order is represented by horizontal position." },
    { label: "Compare", value: compareText(n, m), note: "The number line gives a visual comparison." },
  ], "Real-number visuals should prioritize position and order.");
  if (lessonId === 63) return common("Complex plane coordinates", "a+bi", [
    { label: "Real part", value: String(n), note: "The real part moves horizontally." },
    { label: "Imaginary part", value: String(Math.abs(m)), note: "The imaginary part moves vertically." },
    { label: "Point", value: `${n}+${Math.abs(m)}i`, note: "Complex numbers need a plane, not only a number line." },
  ], "Complex-number visuals must show real and imaginary axes.");
  if (lessonId === 64) return common("Place-value expansion", "digits", [
    { label: "Number", value: String(n), note: "Each digit gets value from its position." },
    { label: "Expanded", value: expandedPlaceValue(n), note: "Expanded form shows digit times place." },
    { label: "Chosen digit", value: String(m), note: "A digit changes value when its place changes." },
  ], "Place-value visuals should expose digit-place products.");
  if (lessonId === 65) return common("Factor pair check", "divides exactly", [
    { label: "Number", value: String(n), note: "A factor must divide this number exactly." },
    { label: "Candidate", value: String(m), note: "Test the candidate by division." },
    { label: "Remainder", value: String(n % Math.max(1, m)), note: "Remainder zero means the candidate is a factor." },
  ], "Factor visuals must show exact division and remainder.");
  if (lessonId === 66) return common("Multiple skip-count list", "products", [
    { label: "Base", value: String(n), note: "Multiples are products of this base." },
    { label: "First multiples", value: multiplesText(n), note: "Skip-counting reveals the list." },
    { label: "Candidate", value: String(m), note: `${m} is ${m % Math.max(1, n) === 0 ? "" : "not "}a multiple of ${n}.` },
  ], "Multiple visuals should show product lists, not factor chips only.");
  if (lessonId === 67) return common("Prime factor-count test", "two factors", [
    { label: "Number", value: String(n), note: "Prime numbers have exactly two positive factors." },
    { label: "Factors", value: factors.join(", "), note: "Count the positive divisors." },
    { label: "Decision", value: isPrime(n) ? "prime" : "not prime", note: "Only 1 and itself means prime." },
  ], "Prime visuals must reveal why the factor count matters.");
  if (lessonId === 68) return common("Prime factor tree", "split to primes", [
    { label: "Number", value: String(n), note: "Start from the composite number." },
    { label: "Prime factors", value: factorization, note: "Keep splitting until every factor is prime." },
    { label: "Check", value: factorization, note: "Multiplying prime factors should rebuild the number." },
  ], "Prime-factorisation visuals must show decomposition and rebuild.");
  if (lessonId === 69) return common("Shared-factor intersection", "HCF/GCD", [
    { label: "First number", value: String(n), note: "List factors for the first number." },
    { label: "Second number", value: String(m), note: "List factors for the second number." },
    { label: "Greatest shared", value: String(gcd(n, m)), note: "The HCF/GCD is the largest common factor." },
  ], "HCF visuals should compare two factor sets.");
  if (lessonId === 70) return common("Shared-multiple ladder", "LCM", [
    { label: "First number", value: String(n), note: "Generate multiples of the first number." },
    { label: "Second number", value: String(m), note: "Generate multiples of the second number." },
    { label: "First shared", value: String(lcm(n, m)), note: "The LCM is the first common positive multiple." },
  ], "LCM visuals should show converging multiple lists.");
  if (lessonId === 71) return common("Divisibility rule audit", "digit sum", [
    { label: "Number", value: String(n), note: "Use the rule for the chosen divisor." },
    { label: "Digit sum", value: String(digitSum(n)), note: "For 9, the digit sum must be divisible by 9." },
    { label: "Decision", value: n % 9 === 0 ? "divisible by 9" : "not divisible by 9", note: "The rule must match exact division." },
  ], "Divisibility visuals must connect shortcut and actual divisibility.");
  if (lessonId === 72) return common("Remainder clock", "mod", [
    { label: "Dividend", value: String(n), note: "This is the number being divided." },
    { label: "Modulus", value: String(Math.max(1, m)), note: "The modulus sets the cycle size." },
    { label: "Remainder", value: String(n % Math.max(1, m)), note: "Modulo keeps the leftover after full cycles." },
  ], "Modular arithmetic visuals should show cycles and remainder.");
  if (lessonId === 73) return common("Base-place conversion", "place powers", [
    { label: "Digits", value: String(n), note: "Read each digit in the chosen base." },
    { label: "Base", value: String(Math.max(2, m)), note: "Each place is a power of the base." },
    { label: "Caution", value: "digit < base", note: "Every digit must be allowed in that base." },
  ], "Base-system visuals must show place powers and valid digits.");
  if (lessonId === 74) return common("Nested-fraction layers", "inside out", [
    { label: "Whole part", value: String(n), note: "Continued fractions begin with a whole layer." },
    { label: "Next denominator", value: String(m), note: "The next layer sits inside a denominator." },
    { label: "Method", value: "inside outward", note: "Evaluate the deepest fraction first." },
  ], "Continued-fraction visuals should expose nested layers.");
  if (lessonId === 75) return common("Equal-parts fraction model", "same whole", [
    { label: "Denominator", value: String(n), note: "The whole is split into this many equal parts." },
    { label: "Numerator", value: String(m), note: "This many parts are selected." },
    { label: "Value", value: `${m}/${n}`, note: "The fraction compares selected parts with one whole." },
  ], "Fraction-model visuals must show equal parts of the same whole.");
  if (lessonId === 76) return common("Equivalent-fraction scaling", "same factor", [
    { label: "Original", value: `${n}/${m}`, note: "Start from one fraction." },
    { label: "Scale by", value: "2", note: "Multiply numerator and denominator by the same non-zero number." },
    { label: "Equivalent", value: `${n * 2}/${m * 2}`, note: "The value stays the same." },
  ], "Equivalent-fraction visuals must show same-factor scaling.");
  if (lessonId === 77) return common("Common-unit comparison", "compare", [
    { label: "Fraction A", value: `${n}/${m}`, note: "Convert or cross-check with a common unit." },
    { label: "Fraction B", value: `${m}/${n + m}`, note: "Compare using consistent wholes." },
    { label: "Decimal A", value: (n / Math.max(1, m)).toFixed(3), note: "Decimal form is one valid comparison view." },
  ], "Fraction comparison visuals must make common units explicit.");
  if (lessonId === 78) return common("Fraction-operation denominator check", "operate", [
    { label: "First denominator", value: String(n), note: "Addition/subtraction need common denominators." },
    { label: "Second denominator", value: String(m), note: "Unlike denominators must be converted first." },
    { label: "Common denominator", value: String(lcm(n, m)), note: "Use the least common multiple for a clean denominator." },
  ], "Fraction-operation visuals must prevent adding denominators directly.");
  if (lessonId === 79) return common("Decimal place-value alignment", "tenths/hundredths", [
    { label: "First decimal", value: (n / 100).toFixed(2), note: "Trailing zeros help align places." },
    { label: "Second decimal", value: (m / 100).toFixed(2), note: "Compare tenths before hundredths." },
    { label: "Decision", value: compareText(n, m), note: "Aligned place values decide the order." },
  ], "Decimal comparison visuals must align places.");
  if (lessonId === 80) return common("Decimal-operation columns", "align point", [
    { label: "First value", value: (n / 10).toFixed(1), note: "Write decimals in columns." },
    { label: "Second value", value: (m / 100).toFixed(2), note: "Line up decimal points." },
    { label: "Sum", value: ((n / 10) + (m / 100)).toFixed(2), note: "Operate place by place." },
  ], "Decimal-operation visuals should show column alignment.");
  if (lessonId === 81) return common("Fraction-decimal bridge", "divide", [
    { label: "Fraction", value: `${n}/${m}`, note: "A fraction is division." },
    { label: "Division", value: `${n} / ${m}`, note: "Divide numerator by denominator." },
    { label: "Decimal", value: (n / Math.max(1, m)).toFixed(3), note: "The decimal names the same value." },
  ], "Conversion visuals should show value preserved across forms.");
  if (lessonId === 82) return common("Recurring remainder loop", "repeat", [
    { label: "Fraction", value: `${n}/${m}`, note: "Some divisions do not terminate." },
    { label: "Remainder idea", value: "repeats", note: "A repeated remainder creates repeating digits." },
    { label: "Decimal sample", value: (n / Math.max(1, m)).toFixed(6), note: "A calculator display may truncate the repeating pattern." },
  ], "Recurring-decimal visuals must distinguish rounded display from exact repeat.");
  if (lessonId === 83) return common("Ratio order model", "a:b", [
    { label: "First part", value: String(n), note: "The first part represents one quantity." },
    { label: "Second part", value: String(m), note: "The second part represents another quantity." },
    { label: "Total parts", value: String(n + m), note: "Share models use the total number of ratio parts." },
  ], "Ratio visuals must preserve order and part-to-part meaning.");
  if (lessonId === 84) return common("Proportion equal-ratio check", "scale", [
    { label: "Known ratio", value: `${n}:${m}`, note: "Use a single scale factor." },
    { label: "Cross product", value: `${n}x? = ${m}x?`, note: "Equivalent ratios have matching cross-products." },
    { label: "Scale rule", value: "same factor", note: "Both parts must scale together." },
  ], "Proportion visuals should expose equal-ratio structure.");
  if (lessonId === 85) return common("Direct proportion table", "y=kx", [
    { label: "Quantity", value: String(n), note: "More input creates proportionally more output." },
    { label: "Cost", value: String(m), note: "Find the constant rate first." },
    { label: "Unit rate", value: (m / Math.max(1, n)).toFixed(2), note: "Direct proportion keeps y/x constant." },
  ], "Direct-proportion visuals need a constant multiplier table.");
  if (lessonId === 86) return common("Inverse proportion product", "xy=k", [
    { label: "Product", value: String(n), note: "The product stays constant." },
    { label: "One value", value: String(m), note: "Increasing one side decreases the other." },
    { label: "Other value", value: (n / Math.max(1, m)).toFixed(2), note: "Divide the constant product by the chosen value." },
  ], "Inverse-proportion visuals must show constant product.");
  if (lessonId === 87) return common("Unit-rate per-one model", "per 1", [
    { label: "Total", value: String(n), note: "Start from the full quantity or cost." },
    { label: "Units", value: String(m), note: "Divide by the number of units." },
    { label: "Per one", value: (n / Math.max(1, m)).toFixed(2), note: "The unit rate names one unit's share." },
  ], "Unit-rate visuals should always show the per-one division.");
  if (lessonId === 88) return common("Hundred-grid percent model", "out of 100", [
    { label: "Percent", value: `${n}%`, note: "Percent means parts per hundred." },
    { label: "Fraction", value: `${n}/100`, note: "The denominator is the fixed whole of 100." },
    { label: "Decimal", value: (n / 100).toFixed(2), note: "Divide by 100 to get decimal form." },
  ], "Percentage visuals must show grid, fraction, and decimal together.");
  if (lessonId === 89) return common("Percentage-change baseline", "original base", [
    { label: "Original", value: String(n), note: "Percentage change uses the original as base." },
    { label: "New", value: String(m), note: "Compare new amount with original amount." },
    { label: "Change %", value: `${(((m - n) / Math.max(1, n)) * 100).toFixed(1)}%`, note: "Change divided by original, then multiplied by 100." },
  ], "Percentage-change visuals must identify the base amount.");
  if (lessonId === 90) return common("Compound-change stages", "latest base", [
    { label: "Start", value: String(n), note: "Begin with the original amount." },
    { label: "Rate", value: `${m}%`, note: "Each stage multiplies the latest amount." },
    { label: "After two stages", value: (n * (1 + m / 100) * (1 + m / 100)).toFixed(2), note: "Compound change updates the base every time." },
  ], "Compound-change visuals must show stage-by-stage updating.");
  if (lessonId === 91) return common("Scale-factor drawing", "same multiplier", [
    { label: "Map length", value: `${n} cm`, note: "Measure the drawing length." },
    { label: "Scale", value: `1 cm : ${m} km`, note: "Use one consistent scale factor." },
    { label: "Real length", value: `${n * m} km`, note: "Multiply map length by the scale." },
  ], "Scale-drawing visuals must connect drawing length, scale, and real length.");
  return common("Number concept trace", "checked", [
    { label: "Value", value: String(n), note: "Inspect the selected number." },
    { label: "Compare", value: String(m), note: "Use a second value when comparison matters." },
    { label: "Classification", value: classificationFor(lessonId, n), note: "The result should match the lesson rule." },
  ], "Every number lesson needs a concept-specific trace.");
}

function FractionModel({ numerator, denominator, fraction }: { numerator: number; denominator: number; fraction: number }) {
  const pieces = Math.min(24, Math.max(2, denominator));
  const filled = Math.min(pieces, Math.round(fraction * pieces));
  return (
    <div className="flex min-h-[300px] flex-col justify-center gap-8" role="img" aria-label={`${numerator} divided by ${denominator} equals ${(numerator / denominator).toFixed(3)}`}>
      <div className="grid h-24 overflow-hidden rounded-2xl border-2 border-slate-700" style={{ gridTemplateColumns: `repeat(${pieces}, minmax(0, 1fr))` }}>
        {Array.from({ length: pieces }, (_, index) => <div key={index} className={index < filled ? "border-r border-white/60 bg-cyan-500" : "border-r border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-800"} />)}
      </div>
      <div className="relative h-4 rounded-full bg-slate-200 dark:bg-slate-700"><div className="absolute inset-y-0 left-0 rounded-full bg-amber-400" style={{ width: `${Math.min(100, fraction * 100)}%` }} /></div>
      <p className="text-center font-mono text-2xl font-black">{numerator}/{denominator} = {(numerator / denominator).toFixed(3)}</p>
    </div>
  );
}

function NumberModel({ value, factors, lessonId }: { value: number; factors: number[]; lessonId: number }) {
  const position = ((value + 60) / 120) * 100;
  const ticks = lessonId === 59 ? [-10, -5, 0, 5, 10] : lessonId === 58 ? [0, 5, 10, 15, 20] : [1, 5, 10, 15, 20];
  return (
    <div className="flex min-h-[300px] flex-col justify-center gap-8" role="img" aria-label={`Number ${value}; ${classificationFor(lessonId, value)}; factors ${factors.join(", ")}`}>
      <div className="relative mx-4 h-2 rounded-full bg-slate-300 dark:bg-slate-700">
        <span className="absolute -top-4 h-10 w-10 -translate-x-1/2 rounded-full border-4 border-white bg-cyan-500 shadow" style={{ left: `${Math.min(100, Math.max(0, position))}%` }} />
        {ticks.map((tick) => <span key={tick} className="absolute top-5 -translate-x-1/2 text-xs font-bold" style={{ left: `${Math.min(100, Math.max(0, ((tick + 60) / 120) * 100))}%` }}>{tick}</span>)}
      </div>
      <div className="rounded-xl bg-white p-3 text-center dark:bg-white/10">
        <p className="text-sm font-black text-slate-700 dark:text-slate-100">{classificationFor(lessonId, value)}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-300">{comparisonLessonText(lessonId)}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">{factors.map((factor) => <span key={factor} className="rounded-xl bg-cyan-100 px-3 py-2 font-mono font-black text-cyan-900 dark:bg-cyan-400/15 dark:text-cyan-100">{factor}</span>)}</div>
    </div>
  );
}

function PercentModel({ percent }: { percent: number }) {
  return (
    <div className="flex min-h-[300px] flex-col justify-center gap-5" role="img" aria-label={`${percent} percent equals ${percent} out of 100 and decimal ${(percent / 100).toFixed(2)}`}>
      <div className="grid grid-cols-10 gap-1">
        {Array.from({ length: 100 }, (_, index) => <span key={index} className={index < percent ? "aspect-square rounded-sm bg-cyan-500" : "aspect-square rounded-sm bg-white ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700"} />)}
      </div>
      <p className="text-center font-mono text-2xl font-black">{percent}% = {percent}/100 = {(percent / 100).toFixed(2)}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="min-w-0 rounded-xl bg-slate-100 p-2 dark:bg-white/10"><span className="block text-[10px] font-bold uppercase text-slate-500">{label}</span><strong className="block truncate font-mono text-sm">{value}</strong></div>;
}

function initialN(lessonId: number) {
  if (lessonId === 57) return 5;
  if (lessonId === 58) return 0;
  if (lessonId === 59) return -4;
  if (lessonId === 60) return 3;
  if (lessonId === 61) return 2;
  if (lessonId === 62) return -5;
  if (lessonId === 63) return 3;
  if (lessonId === 64) return 5381;
  if (lessonId === 65) return 42;
  if (lessonId === 66) return 9;
  if (lessonId === 67) return 17;
  if (lessonId === 68) return 24;
  if (lessonId === 69) return 18;
  if (lessonId === 70) return 6;
  if (lessonId === 71) return 234;
  if (lessonId === 72) return 23;
  if (lessonId === 73) return 110;
  if (lessonId === 74) return 2;
  if (lessonId === 75) return 4;
  if (lessonId === 76) return 3;
  if (lessonId === 77) return 3;
  if (lessonId === 78) return 2;
  if (lessonId === 79) return 50;
  if (lessonId === 80) return 34;
  if (lessonId === 81) return 3;
  if (lessonId === 82) return 3;
  if (lessonId === 83) return 2;
  if (lessonId === 84) return 2;
  if (lessonId === 85) return 3;
  if (lessonId === 86) return 24;
  if (lessonId === 87) return 300;
  if (lessonId === 89) return 80;
  if (lessonId === 90) return 100;
  if (lessonId === 91) return 4;
  if (lessonId === 88) return 25;
  return 8 + lessonId % 16;
}

function initialM(lessonId: number) {
  if (lessonId === 60) return 4;
  if (lessonId === 61) return 3;
  if (lessonId === 64) return 5;
  if (lessonId === 65) return 6;
  if (lessonId === 66) return 36;
  if (lessonId === 67) return 2;
  if (lessonId === 68) return 3;
  if (lessonId === 69) return 24;
  if (lessonId === 70) return 8;
  if (lessonId === 71) return 9;
  if (lessonId === 72) return 7;
  if (lessonId === 73) return 2;
  if (lessonId === 74) return 3;
  if (lessonId === 75) return 3;
  if (lessonId === 76) return 4;
  if (lessonId === 77) return 4;
  if (lessonId === 78) return 3;
  if (lessonId === 79) return 47;
  if (lessonId === 80) return 125;
  if (lessonId === 81) return 4;
  if (lessonId === 82) return 9;
  if (lessonId === 83) return 3;
  if (lessonId === 84) return 9;
  if (lessonId === 85) return 90;
  if (lessonId === 86) return 8;
  if (lessonId === 87) return 5;
  if (lessonId === 89) return 100;
  if (lessonId === 90) return 10;
  if (lessonId === 91) return 5;
  return 3 + lessonId % 9;
}

function rangeFor(lessonId: number, isFraction: boolean) {
  if (lessonId === 57) return { nMin: 1, nMax: 30, mMin: 1, mMax: 30 };
  if (lessonId === 58) return { nMin: 0, nMax: 30, mMin: 0, mMax: 30 };
  if (lessonId === 59) return { nMin: -30, nMax: 30, mMin: -30, mMax: 30 };
  if (lessonId === 64) return { nMin: 100, nMax: 9999, mMin: 0, mMax: 9 };
  if ([65, 66, 67, 68, 69, 70].includes(lessonId)) return { nMin: 2, nMax: 100, mMin: 1, mMax: 100 };
  if ([71, 72, 73, 74, 76, 77, 78, 79, 80, 81].includes(lessonId)) return { nMin: 1, nMax: 250, mMin: 1, mMax: 100 };
  if ([82, 83, 84, 85, 86, 87, 89, 90, 91].includes(lessonId)) return { nMin: 1, nMax: 500, mMin: 1, mMax: 500 };
  if (lessonId === 88) return { nMin: 0, nMax: 100, mMin: 0, mMax: 0 };
  if (isFraction) return { nMin: 2, nMax: 60, mMin: 1, mMax: 30 };
  return { nMin: 2, nMax: 60, mMin: 1, mMax: 30 };
}

function classificationFor(lessonId: number, value: number) {
  if (lessonId === 57) return value >= 1 && Number.isInteger(value) ? "natural counting number" : "not natural here";
  if (lessonId === 58) return value >= 0 && Number.isInteger(value) ? "whole number" : "not whole";
  if (lessonId === 59) return Number.isInteger(value) ? value > 0 ? "positive integer" : value < 0 ? "negative integer" : "zero integer" : "not an integer";
  if (lessonId === 60) return `${value}/${Math.max(1, Math.abs(value + 1))} is rational when denominator is not zero`;
  if (lessonId === 61) return value >= 0 ? `sqrt(${value}) may be irrational unless ${value} is a perfect square` : "negative radicand is not real";
  if (lessonId === 62) return "real number-line value";
  if (lessonId === 63) return `complex point ${value}+${Math.abs(value + 1)}i`;
  if (lessonId === 64) return `expanded form uses digit places`;
  if (lessonId === 65) return "factor check: exact divisors split the number";
  if (lessonId === 66) return "multiple check: products make skip-count lists";
  if (lessonId === 67) return isPrime(value) ? "prime number" : "not prime";
  if (lessonId === 68) return `prime factors: ${factorizationText(value)}`;
  if (lessonId === 69) return "HCF/GCD uses shared factors";
  if (lessonId === 70) return "LCM uses shared multiples";
  if (lessonId === 71) return value % 9 === 0 ? "divisible by 9 using digit sum" : "not divisible by 9";
  if (lessonId === 72) return `remainder model: ${value} mod ${Math.max(1, Math.abs(value - 16))}`;
  if (lessonId === 73) return "base-system place values";
  if (lessonId === 74) return "continued fraction layer";
  if (lessonId === 75) return "fraction model shows equal parts of one whole";
  if (lessonId === 76) return "equivalent fraction scaling";
  if (lessonId === 77) return "fraction comparison";
  if (lessonId === 78) return "fraction operation needs valid denominator rules";
  if (lessonId === 79) return "decimal place-value comparison";
  if (lessonId === 80) return "decimal operation alignment";
  if (lessonId === 81) return "fraction and decimal name the same rational value";
  if (lessonId === 82) return "recurring decimal pattern";
  if (lessonId === 83) return "ratio compares quantities in order";
  if (lessonId === 84) return "proportion keeps equal ratios";
  if (lessonId === 85) return "direct proportion uses a constant multiplier";
  if (lessonId === 86) return "inverse proportion keeps product constant";
  if (lessonId === 87) return "unit rate means per one unit";
  if (lessonId === 88) return "percent model uses a 100-grid";
  if (lessonId === 89) return "percentage change uses original as base";
  if (lessonId === 90) return "compound change updates the base each period";
  if (lessonId === 91) return "scale drawing uses one scale factor";
  return "number";
}

function compareText(value: number, compare: number) {
  if (value === compare) return `${value} = ${compare}`;
  return value > compare ? `${value} > ${compare}` : `${value} < ${compare}`;
}

function nearestSquareText(value: number) {
  const root = Math.max(0, Math.round(Math.sqrt(Math.max(0, value))));
  return `${root}^2=${root * root}`;
}

function expandedPlaceValue(value: number) {
  const digits = String(Math.abs(Math.round(value))).split("").map(Number);
  const parts = digits.map((digit, index) => {
    const place = 10 ** (digits.length - index - 1);
    return digit ? `${digit}x${place}` : "";
  }).filter(Boolean);
  return parts.length ? parts.join(" + ") : "0";
}

function multiplesText(value: number) {
  const base = Math.max(1, Math.abs(Math.round(value)));
  return [1, 2, 3, 4].map((factor) => base * factor).join(", ");
}

function digitSum(value: number) {
  return String(Math.abs(Math.round(value))).split("").reduce((total, digit) => total + Number(digit), 0);
}

function gcd(left: number, right: number) {
  let a = Math.abs(Math.round(left));
  let b = Math.abs(Math.round(right));
  while (b) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a || 1;
}

function euclideanSteps(left: number, right: number) {
  const steps: Array<{ a: number; b: number; quotient: number; remainder: number }> = [];
  let a = Math.max(Math.abs(Math.round(left)), Math.abs(Math.round(right)));
  let b = Math.min(Math.abs(Math.round(left)), Math.abs(Math.round(right)));
  if (!b) return steps;
  while (b && steps.length < 8) {
    const quotient = Math.floor(a / b);
    const remainder = a % b;
    steps.push({ a, b, quotient, remainder });
    a = b;
    b = remainder;
  }
  return steps;
}

function lcm(left: number, right: number) {
  const a = Math.abs(Math.round(left));
  const b = Math.abs(Math.round(right));
  if (!a || !b) return 0;
  return (a * b) / gcd(a, b);
}

function comparisonLessonText(lessonId: number) {
  if (lessonId === 57) return "Natural numbers start at 1 in this lesson.";
  if (lessonId === 58) return "Whole numbers include zero.";
  if (lessonId === 59) return "Farther right means greater.";
  if (lessonId === 60) return "Rational numbers can be written as a/b.";
  if (lessonId === 61) return "Non-ending, non-repeating decimals are irrational.";
  if (lessonId === 62) return "Real numbers lie on the number line.";
  if (lessonId === 63) return "Complex numbers use a real part and an imaginary part.";
  if (lessonId === 64) return "A digit's place changes its value.";
  if (lessonId === 65) return "Factors divide exactly.";
  if (lessonId === 66) return "Multiples are made by multiplying.";
  if (lessonId === 67) return "Prime numbers have exactly two positive factors.";
  if (lessonId === 68) return "Keep splitting until all factors are prime.";
  if (lessonId === 69) return "HCF is the greatest shared factor.";
  if (lessonId === 70) return "LCM is the first shared positive multiple.";
  if (lessonId === 71) return "Use the rule for the chosen divisor only.";
  if (lessonId === 72) return "Keep the remainder, not the quotient.";
  if (lessonId === 73) return "Digits must be allowed in the chosen base.";
  if (lessonId === 74) return "Evaluate nested fractions from inside outward.";
  if (lessonId === 75) return "Fraction models show selected parts of one whole.";
  if (lessonId === 76) return "Scale numerator and denominator by the same non-zero factor.";
  if (lessonId === 77) return "Compare fractions using common units.";
  if (lessonId === 78) return "Common denominators are needed for addition and subtraction.";
  if (lessonId === 79) return "Trailing zeros can help compare decimals.";
  if (lessonId === 80) return "Line up decimal points for addition and subtraction.";
  if (lessonId === 81) return "Divide numerator by denominator to get decimal form.";
  if (lessonId === 82) return "A repeating remainder creates a recurring decimal.";
  if (lessonId === 83) return "Ratio order matters.";
  if (lessonId === 84) return "Both ratios must scale by the same factor.";
  if (lessonId === 85) return "Direct proportion has form y = kx.";
  if (lessonId === 86) return "Inverse proportion has constant product.";
  if (lessonId === 87) return "Divide by the number of units to find per one.";
  if (lessonId === 88) return "Percent means out of 100.";
  if (lessonId === 89) return "Use original amount as the base.";
  if (lessonId === 90) return "Apply each percent change to the latest amount.";
  if (lessonId === 91) return "Scale every length by the same factor.";
  return "Use the selected value to inspect number facts.";
}

function isPrime(value: number) {
  const n = Math.abs(Math.round(value));
  if (n <= 1) return false;
  for (let factor = 2; factor * factor <= n; factor += 1) {
    if (n % factor === 0) return false;
  }
  return true;
}

function factorizationText(value: number) {
  return formatFactorization(primeFactorization(Math.max(2, Math.abs(Math.round(value)))));
}

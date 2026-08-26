import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import NumberLessonAdapter from "./NumberLessonAdapter";

describe("NumberLessonAdapter", () => {
  it("renders lesson 57 as a dedicated natural-number membership workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 57)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0039"');
    expect(html).toContain('data-dedicated-lesson="57"');
    expect(html).toContain('data-object-model="selected-natural-counting-tray-number-line-one-more-membership-drag-classification-comparison-model"');
    expect(html).toContain('data-selected="5"');
    expect(html).toContain('data-next="6"');
    expect(html).toContain('data-classification-correct="true"');
    expect(html).toContain('aria-label="Selected natural number drag control"');
    expect(html).toContain("Membership: Natural numbers vs. not included");
  });
  it("renders lesson 58 as a dedicated zero-inclusive whole-number workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 58)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0040"');
    expect(html).toContain('data-dedicated-lesson="58"');
    expect(html).toContain('data-object-model="zero-inclusive-whole-set-selector-number-line-exclusion-empty-count-staircase-comparison-practice-model"');
    expect(html).toContain('data-selected="0"');
    expect(html).toContain('data-comparison="&lt;"');
    expect(html).toContain('aria-label="Increase selected number"');
    expect(html).toContain("Zero means ‘no objects’ — still a count");
  });
  it("renders lesson 59 as a dedicated signed-integer workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 59)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0041"');
    expect(html).toContain('data-dedicated-lesson="59"');
    expect(html).toContain('data-object-model="signed-integer-number-line-opposite-temperature-ledger-order-comparison-model"');
    expect(html).toContain('data-selected="-4"');
    expect(html).toContain('data-opposite="4"');
    expect(html).toContain('aria-label="Selected integer drag control"');
    expect(html).toContain("Real-life context: Bank ledger");
  });
  it("renders lesson 60 as a dedicated rational-number equivalence workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 60)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0042"');
    expect(html).toContain('data-dedicated-lesson="60"');
    expect(html).toContain('data-object-model="numerator-denominator-reduction-mixed-decimal-strip-number-line-membership-practice-model"');
    expect(html).toContain('data-numerator="4"');
    expect(html).toContain('data-denominator="3"');
    expect(html).toContain('aria-label="Denominator"');
    expect(html).toContain("Membership in the rational numbers");
  });
  it("renders lesson 61 as a dedicated irrational-root workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 61)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0043"');
    expect(html).toContain('data-dedicated-lesson="61"');
    expect(html).toContain('data-object-model="radicand-perfect-square-bounds-geometric-diagonal-number-line-decimal-sort-comparison-model"');
    expect(html).toContain('data-radicand="2"');
    expect(html).toContain('data-lower-square="1"');
    expect(html).toContain('aria-label="Select radicand"');
    expect(html).toContain("Sort into Rational vs Irrational");
  });
  it("renders lesson 62 as a dedicated real-number hierarchy workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 62)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0044"');
    expect(html).toContain('data-dedicated-lesson="62"');
    expect(html).toContain('data-object-model="selected-real-number-hierarchy-classification-draggable-number-line-placement-comparison-model"');
    expect(html).toContain('data-selected="-5"');
    expect(html).toContain('data-integer="true"');
    expect(html).toContain("Sort these numbers on the real number line");
    expect(html).toContain('draggable="true"');
  });
  it("renders lesson 63 as a dedicated complex-plane workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 63)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0045"');
    expect(html).toContain('data-dedicated-lesson="63"');
    expect(html).toContain('data-object-model="complex-coefficients-draggable-plane-point-conjugate-vector-modulus-argument-projection-model"');
    expect(html).toContain('data-real="3"');
    expect(html).toContain('data-imaginary="2"');
    expect(html).toContain('data-modulus="3.606"');
    expect(html).toContain('aria-label="Drag complex number point"');
    expect(html).toContain('aria-label="Real part"');
    expect(html).toContain("Conjugate (reflection)");
  });
  it("renders lesson 64 as a dedicated exact place-value workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 64)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0046"');
    expect(html).toContain('data-dedicated-lesson="64"');
    expect(html).toContain('data-object-model="editable-four-digit-place-columns-draggable-digit-swap-exact-base-ten-block-expanded-form-practice-model"');
    expect(html).toContain('data-number="5381"');
    expect(html).toContain('data-selected-place="thousands"');
    expect(html).toContain('data-selected-value="5000"');
    expect(html).toContain('data-block-counts="5,3,8,1"');
    expect(html).toContain('aria-label="Four digit number"');
    expect(html).toContain('draggable="true"');
    expect(html).toContain("Explore place value with exact base-ten blocks");
  });
  it("renders lesson 65 as a dedicated factor-pair array workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 65)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0047"');
    expect(html).toContain('data-dedicated-lesson="65"');
    expect(html).toContain('data-object-model="editable-number-candidate-exact-divisibility-counter-array-factor-pairs-draggable-arrangement-remainder-practice-model"');
    expect(html).toContain('data-number="42"');
    expect(html).toContain('data-candidate="6"');
    expect(html).toContain('data-remainder="0"');
    expect(html).toContain('data-factor-pairs="1x42,2x21,3x14,6x7"');
    expect(html).toContain('aria-label="Factor pair array drop zone"');
    expect(html).toContain('aria-label="Candidate divisor"');
    expect(html).toContain("Explore factors with the array model");
  });
  it("renders lesson 66 as a dedicated skip-counting workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 66)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0048"');
    expect(html).toContain('data-dedicated-lesson="66"');
    expect(html).toContain('data-object-model="editable-base-candidate-exact-skip-count-number-line-draggable-product-repeated-addition-quotient-remainder-non-example-model"');
    expect(html).toContain('data-base="9"');
    expect(html).toContain('data-candidate="36"');
    expect(html).toContain('data-quotient="4"');
    expect(html).toContain('data-remainder="0"');
    expect(html).toContain('data-products="9,18,27,36,45"');
    expect(html).toContain('aria-label="Candidate multiple drag control"');
    expect(html).toContain('aria-label="Base number"');
    expect(html).toContain("Multiples on the number line");
  });
  it("renders lesson 67 as a dedicated prime factor-count workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 67)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0049"');
    expect(html).toContain('data-dedicated-lesson="67"');
    expect(html).toContain('data-object-model="editable-number-divisor-scanner-exact-factor-count-draggable-counter-equal-group-quotient-remainder-prime-composite-practice-model"');
    expect(html).toContain('data-number="17"');
    expect(html).toContain('data-selected-divisor="17"');
    expect(html).toContain('data-factors="1,17"');
    expect(html).toContain('data-factor-count="2"');
    expect(html).toContain('data-is-prime="true"');
    expect(html).toContain('aria-label="Number to test"');
    expect(html).toContain('aria-label="Group counters by divisor 3"');
    expect(html).toContain("Test divisors by grouping counters");
  });
  it("renders lesson 68 as a dedicated recursive factor-tree workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 68)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0050"');
    expect(html).toContain('data-dedicated-lesson="68"');
    expect(html).toContain('data-object-model="editable-composite-recursive-binary-factor-tree-prime-leaves-split-steps-exponent-compression-rebuild-slider-candidate-frequency-practice-model"');
    expect(html).toContain('data-number="24"');
    expect(html).toContain('data-prime-factors="2,2,2,3"');
    expect(html).toContain('data-exponent-form="2^3 × 3"');
    expect(html).toContain('data-split-steps="24x6x4,6x2x3,4x2x2"');
    expect(html).toContain('data-rebuilt-product="24"');
    expect(html).toContain('aria-label="Rebuild prime factors"');
    expect(html).toContain('aria-label="Candidate prime divisor"');
    expect(html).toContain("Keep splitting until every factor is prime");
  });
  it("renders lesson 69 as a dedicated shared-factor HCF workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 69)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0051"');
    expect(html).toContain('data-dedicated-lesson="69"');
    expect(html).toContain('data-object-model="editable-number-pair-factor-set-venn-intersection-prime-exponent-overlap-draggable-shared-candidate-equal-group-greatest-divisor-practice-model"');
    expect(html).toContain('data-first="18"');
    expect(html).toContain('data-second="24"');
    expect(html).toContain('data-shared-factors="1,2,3,6"');
    expect(html).toContain('data-hcf="6"');
    expect(html).toContain('data-first-primes="2,3,3"');
    expect(html).toContain('data-second-primes="2,2,2,3"');
    expect(html).toContain('aria-label="HCF candidate drop zone"');
    expect(html).toContain('aria-label="First number"');
    expect(html).toContain("Equal groups (visual proof)");
  });
  it("renders lesson 70 as a dedicated shared-multiple LCM workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 70)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0052"');
    expect(html).toContain('data-dedicated-lesson="70"');
    expect(html).toContain('data-object-model="editable-number-pair-synchronized-multiple-jump-lines-generated-lists-draggable-shared-landing-prime-power-ladder-least-common-multiple-practice-model"');
    expect(html).toContain('data-first="6"');
    expect(html).toContain('data-second="8"');
    expect(html).toContain('data-lcm="24"');
    expect(html).toContain('data-first-multiples="6,12,18,24,30"');
    expect(html).toContain('data-second-multiples="8,16,24,32,40"');
    expect(html).toContain('data-lcm-primes="2,2,2,3"');
    expect(html).toContain('aria-label="First shared landing drop zone"');
    expect(html).toContain('aria-label="First number"');
    expect(html).toContain("Watch the multiples land together");
  });
  it("renders lesson 71 as a dedicated divisibility-rule machine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 71)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0053"');
    expect(html).toContain('data-dedicated-lesson="71"');
    expect(html).toContain('data-object-model="editable-three-digit-number-rule-selector-draggable-digit-reorder-rule-specific-evidence-machine-exact-division-misconception-practice-model"');
    expect(html).toContain('data-number="234"');
    expect(html).toContain('data-digits="2,3,4"');
    expect(html).toContain('data-divisor="9"');
    expect(html).toContain('data-digit-sum="9"');
    expect(html).toContain('data-divisible="true"');
    expect(html).toContain('data-remainder="0"');
    expect(html).toContain('aria-label="Run divisibility machine"');
    expect(html).toContain('aria-label="Digit 1: 2"');
    expect(html).toContain('aria-label="Number to test"');
    expect(html).toContain("Use the rule for the chosen divisor only");
  });
  it("renders lesson 72 as a dedicated modular-arithmetic remainder clock", () => {
    const lesson = lessonCatalog.find((item) => item.id === 72)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0054"');
    expect(html).toContain('data-dedicated-lesson="72"');
    expect(html).toContain('data-object-model="editable-dividend-modulus-remainder-clock-draggable-cycle-position-quotient-remainder-decomposition-grouped-cycles-misconception-practice-model"');
    expect(html).toContain('data-dividend="23"');
    expect(html).toContain('data-modulus="7"');
    expect(html).toContain('data-quotient="3"');
    expect(html).toContain('data-remainder="2"');
    expect(html).toContain('data-equation="23=3x7+2"');
    expect(html).toContain('aria-label="Remainder position 2"');
    expect(html).toContain('aria-label="Dividend"');
    expect(html).toContain('aria-label="Modulus"');
    expect(html).toContain("Keep the remainder");
  });
  it("renders lesson 73 as a dedicated base-place conversion board", () => {
    const lesson = lessonCatalog.find((item) => item.id === 73)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0055"');
    expect(html).toContain('data-dedicated-lesson="73"');
    expect(html).toContain('data-object-model="editable-base-three-digit-place-value-board-draggable-digit-order-allowed-digit-palette-calculated-products-decimal-sum-number-line-practice-model"');
    expect(html).toContain('data-number="110"');
    expect(html).toContain('data-digits="1,1,0"');
    expect(html).toContain('data-base="2"');
    expect(html).toContain('data-place-values="4,2,1"');
    expect(html).toContain('data-products="4,2,0"');
    expect(html).toContain('data-decimal="6"');
    expect(html).toContain('aria-label="Digit 1: 1"');
    expect(html).toContain('aria-label="Base-system number"');
    expect(html).toContain("Every digit must be less than the base");
  });
  it("renders lesson 74 as a dedicated inside-out continued-fraction evaluator", () => {
    const lesson = lessonCatalog.find((item) => item.id === 74)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0056"');
    expect(html).toContain('data-dedicated-lesson="74"');
    expect(html).toContain('data-object-model="editable-draggable-partial-quotients-exact-rational-inside-out-layers-convergents-decimal-number-line-practice-model"');
    expect(html).toContain('data-terms="1,2,3"');
    expect(html).toContain('data-inner="1/3"');
    expect(html).toContain('data-middle="7/3"');
    expect(html).toContain('data-convergents="1,3/2,10/7"');
    expect(html).toContain('data-result="10/7"');
    expect(html).toContain('data-decimal="1.429"');
    expect(html).toContain('aria-label="Partial quotient 2: 3"');
    expect(html).toContain('aria-label="Edit partial quotient 2"');
    expect(html).toContain("Evaluate nested fractions from inside outward");
  });
  it("renders lesson 75 as a dedicated linked fraction-model laboratory", () => {
    const lesson = lessonCatalog.find((item) => item.id === 75)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0057"');
    expect(html).toContain('data-dedicated-lesson="75"');
    expect(html).toContain('data-object-model="linked-numerator-denominator-drag-ranges-clickable-area-circle-equivalent-set-number-line-decimal-percent-practice-model"');
    expect(html).toContain('data-numerator="3"');
    expect(html).toContain('data-denominator="4"');
    expect(html).toContain('data-value="0.7500"');
    expect(html).toContain('data-decimal="0.75"');
    expect(html).toContain('data-percent="75%"');
    expect(html).toContain('data-set-selected="9"');
    expect(html).toContain('data-set-total="12"');
    expect(html).toContain('aria-label="Drag to set denominator"');
    expect(html).toContain('aria-label="Drag to set numerator"');
    expect(html).toContain("All models are linked");
  });
  it("renders lesson 76 as a dedicated equivalent-fraction scaling proof", () => {
    const lesson = lessonCatalog.find((item) => item.id === 76)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0058"');
    expect(html).toContain('data-dedicated-lesson="76"');
    expect(html).toContain('data-object-model="editable-original-fraction-shared-draggable-scale-factor-linked-segmented-bars-number-lines-products-equivalence-practice-model"');
    expect(html).toContain('data-numerator="3"');
    expect(html).toContain('data-denominator="4"');
    expect(html).toContain('data-factor="2"');
    expect(html).toContain('data-scaled-numerator="6"');
    expect(html).toContain('data-scaled-denominator="8"');
    expect(html).toContain('data-value="0.7500"');
    expect(html).toContain('aria-label="Original numerator"');
    expect(html).toContain('aria-label="Scale factor 2; click to cycle or drag"');
    expect(html).toContain("Both fractions occupy the same number-line point");
  });
  it("renders lesson 77 as a dedicated common-unit fraction comparison", () => {
    const lesson = lessonCatalog.find((item) => item.id === 77)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0059"');
    expect(html).toContain('data-dedicated-lesson="77"');
    expect(html).toContain('data-object-model="dual-editable-fractions-draggable-unit-bars-lcm-common-units-cross-product-ordering-shared-number-line-practice-model"');
    expect(html).toContain('data-fraction-a="3/4"');
    expect(html).toContain('data-fraction-b="4/7"');
    expect(html).toContain('data-common-denominator="28"');
    expect(html).toContain('data-common-a="21"');
    expect(html).toContain('data-common-b="16"');
    expect(html).toContain('data-comparison="&gt;"');
    expect(html).toContain('aria-label="Fraction A numerator"');
    expect(html).toContain('aria-label="Fraction B bar part 4"');
    expect(html).toContain("The LCM creates equal-sized parts");
  });
  it("renders lesson 78 as a dedicated fraction-operation proof", () => {
    const lesson = lessonCatalog.find((item) => item.id === 78)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0060"');
    expect(html).toContain('data-dedicated-lesson="78"');
    expect(html).toContain('data-object-model="dual-editable-draggable-fraction-bars-four-operation-engine-lcm-conversion-reciprocal-reduction-result-practice-model"');
    expect(html).toContain('data-first="1/2"');
    expect(html).toContain('data-second="1/3"');
    expect(html).toContain('data-operation="Add"');
    expect(html).toContain('data-common-denominator="6"');
    expect(html).toContain('data-converted-first="3"');
    expect(html).toContain('data-converted-second="2"');
    expect(html).toContain('data-result="5/6"');
    expect(html).toContain('aria-label="First fraction numerator"');
    expect(html).toContain('aria-label="Second bar part 1"');
    expect(html).toContain("Multiplication works across; division uses the reciprocal");
  });
  it("renders lesson 79 as a dedicated decimal place-value comparison", () => {
    const lesson = lessonCatalog.find((item) => item.id === 79)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0061"');
    expect(html).toContain('data-dedicated-lesson="79"');
    expect(html).toContain('data-object-model="exact-hundredths-dual-editable-decimals-place-chart-draggable-hundred-grids-deciding-digit-number-line-trailing-zero-practice-model"');
    expect(html).toContain('data-first="0.50"');
    expect(html).toContain('data-second="0.47"');
    expect(html).toContain('data-first-count="50"');
    expect(html).toContain('data-second-count="47"');
    expect(html).toContain('data-first-digits="0,5,0"');
    expect(html).toContain('data-second-digits="0,4,7"');
    expect(html).toContain('data-deciding-place="Tenths"');
    expect(html).toContain('data-comparison="&gt;"');
    expect(html).toContain('aria-label="First decimal"');
    expect(html).toContain('aria-label="Second hundred grid cell 47"');
    expect(html).toContain("Compare the first unequal place");
  });
  it("renders lesson 80 as a dedicated aligned decimal-operation proof", () => {
    const lesson = lessonCatalog.find((item) => item.id === 80)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0062"');
    expect(html).toContain('data-dedicated-lesson="80"');
    expect(html).toContain('data-object-model="dual-editable-hundredths-aligned-place-columns-draggable-digits-base-ten-blocks-calculated-sum-misalignment-practice-model"');
    expect(html).toContain('data-first="3.40"');
    expect(html).toContain('data-second="1.25"');
    expect(html).toContain('data-operation="Add"');
    expect(html).toContain('data-result="4.65"');
    expect(html).toContain('data-first-digits="3,4,0"');
    expect(html).toContain('data-result-digits="4,6,5"');
    expect(html).toContain('data-misaligned="3.65"');
    expect(html).toContain('aria-label="First decimal value"');
    expect(html).toContain('aria-label="Second decimal hundredths digit 5"');
    expect(html).toContain("Line up decimal points for addition and subtraction");
  });
  it("renders lesson 81 as a dedicated fraction-decimal-percent bridge", () => {
    const lesson = lessonCatalog.find((item) => item.id === 81)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0063"');
    expect(html).toContain('data-dedicated-lesson="81"');
    expect(html).toContain('data-object-model="editable-reduced-fraction-division-trace-clickable-draggable-strip-hundred-grid-decimal-percent-number-line-terminating-practice-model"');
    expect(html).toContain('data-numerator="3"');
    expect(html).toContain('data-denominator="4"');
    expect(html).toContain('data-reduced="3/4"');
    expect(html).toContain('data-decimal="0.75"');
    expect(html).toContain('data-percent="75%"');
    expect(html).toContain('data-selected-cells="75"');
    expect(html).toContain('data-terminating="true"');
    expect(html).toContain('aria-label="Fraction numerator"');
    expect(html).toContain('aria-label="Fraction strip part 4"');
    expect(html).toContain("The value stays the same across forms");
  });
  it("renders lesson 82 as a dedicated recurring-remainder machine", () => {
    const lesson = lessonCatalog.find((item) => item.id === 82)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0064"');
    expect(html).toContain('data-dedicated-lesson="82"');
    expect(html).toContain('data-object-model="editable-fraction-long-division-remainder-cycle-detection-draggable-repeat-tiles-exact-overbar-rounded-warning-practice-model"');
    expect(html).toContain('data-numerator="1"');
    expect(html).toContain('data-denominator="3"');
    expect(html).toContain('data-decimal="0.333…"');
    expect(html).toContain('data-cycle="3"');
    expect(html).toContain('data-remainders="1"');
    expect(html).toContain('data-recurring="true"');
    expect(html).toContain('data-visible-repeats="4"');
    expect(html).toContain('aria-label="Recurring decimal numerator"');
    expect(html).toContain('aria-label="Repeating digit tile 4"');
    expect(html).toContain("A repeated remainder creates a recurring decimal");
  });
  it("renders lesson 83 as a dedicated linked ratio-model workspace", () => {
    const lesson = lessonCatalog.find((item) => item.id === 83)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0065"');
    expect(html).toContain('data-dedicated-lesson="83"');
    expect(html).toContain('data-object-model="dual-editable-part-count-draggable-token-tape-diagram-scaled-batch-double-number-line-preserved-relationship-practice-model"');
    expect(html).toContain('data-blue="2"');
    expect(html).toContain('data-red="3"');
    expect(html).toContain('data-total="5"');
    expect(html).toContain('data-scale="2"');
    expect(html).toContain('data-scaled-blue="4"');
    expect(html).toContain('data-scaled-red="6"');
    expect(html).toContain('aria-label="First blue ratio part"');
    expect(html).toContain('aria-label="red ratio token 3"');
    expect(html).toContain("both parts must scale together");
  });
  it("renders lesson 84 as a dedicated equivalent-ratio solver", () => {
    const lesson = lessonCatalog.find((item) => item.id === 84)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0066"');
    expect(html).toContain('data-dedicated-lesson="84"');
    expect(html).toContain('data-object-model="editable-known-target-ratio-shared-scale-factor-draggable-tape-units-cross-product-step-summary-solved-value-practice-model"');
    expect(html).toContain('data-known-first="2"');
    expect(html).toContain('data-known-second="9"');
    expect(html).toContain('data-target-first="6"');
    expect(html).toContain('data-target-second="27"');
    expect(html).toContain('data-scale="3"');
    expect(html).toContain('data-cross-left="54"');
    expect(html).toContain('data-cross-right="54"');
    expect(html).toContain('aria-label="knownFirst tape unit 2"');
    expect(html).toContain('aria-label="Copy proportion"');
    expect(html).toContain("Both ratios must scale by the same factor");
  });
  it("renders lesson 85 as a dedicated direct-proportion model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 85)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0067"');
    expect(html).toContain('data-dedicated-lesson="85"');
    expect(html).toContain('data-object-model="editable-constant-multiplier-linked-table-draggable-coordinate-points-origin-line-unit-rate-equation-practice-model"');
    expect(html).toContain('data-quantity="3"');
    expect(html).toContain('data-rate="30"');
    expect(html).toContain('data-cost="90"');
    expect(html).toContain('aria-label="Current quantity x"');
    expect(html).toContain('aria-label="Constant of proportion k"');
    expect(html).toContain('aria-label="Graph point 4"');
    expect(html).toContain("The graph passes through the origin");
  });
  it("renders lesson 86 as a dedicated inverse-proportion model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 86)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0068"');
    expect(html).toContain('data-dedicated-lesson="86"');
    expect(html).toContain('data-object-model="editable-constant-product-reciprocal-table-draggable-curve-points-work-sharing-task-arrays-formula-quick-check-practice-model"');
    expect(html).toContain('data-product="24"');
    expect(html).toContain('data-workers="8"');
    expect(html).toContain('data-days="3"');
    expect(html).toContain('aria-label="Current workers x"');
    expect(html).toContain('aria-label="Inverse graph point 8"');
    expect(html).toContain('aria-label="3-worker task 24"');
    expect(html).toContain("keeps xy constant");
  });
  it("renders lesson 87 as a dedicated unit-rate equal-sharing model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 87)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0069"');
    expect(html).toContain('data-dedicated-lesson="87"');
    expect(html).toContain('data-object-model="editable-total-unit-count-draggable-rice-bags-equal-sharing-cards-unit-rate-table-double-number-line-practice-model"');
    expect(html).toContain('data-total="300"');
    expect(html).toContain('data-units="5"');
    expect(html).toContain('data-unit-rate="60"');
    expect(html).toContain('aria-label="Total cost rupees"');
    expect(html).toContain('aria-label="Rice bag 5"');
    expect(html).toContain('unit-rates-rice-bag.png');
    expect(html).toContain("Divide by the number of units");
  });
  it("renders lesson 88 as a dedicated percentage hundred-grid model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 88)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0070"');
    expect(html).toContain('data-dedicated-lesson="88"');
    expect(html).toContain('data-object-model="editable-percent-draggable-hundred-grid-equivalent-fraction-decimal-slider-number-line-part-of-quantity-practice-model"');
    expect(html).toContain('data-percent="25"');
    expect(html).toContain('data-decimal="0.25"');
    expect(html).toContain('data-numerator="1"');
    expect(html).toContain('data-denominator="4"');
    expect(html).toContain('data-part="20"');
    expect(html).toContain('aria-label="Percentage value"');
    expect(html).toContain('aria-label="Hundred grid cell 100"');
    expect(html).toContain('aria-label="Quantity dot 80"');
    expect(html).toContain("Percent means parts per hundred");
  });
  it("renders lesson 89 as a dedicated percentage-change baseline model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 89)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0071"');
    expect(html).toContain('data-dedicated-lesson="89"');
    expect(html).toContain('data-object-model="dual-editable-original-new-draggable-before-after-bars-percentage-change-breakdown-number-line-baseline-warning-practice-model"');
    expect(html).toContain('data-original="80"');
    expect(html).toContain('data-new="100"');
    expect(html).toContain('data-change="20"');
    expect(html).toContain('data-percent="25"');
    expect(html).toContain('data-direction="increase"');
    expect(html).toContain('aria-label="Original amount"');
    expect(html).toContain('aria-label="New amount bar"');
    expect(html).toContain('aria-label="New number line point"');
    expect(html).toContain("Use the original amount as the base");
  });
  it("renders lesson 90 as a dedicated sequential compound-change model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 90)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0072"');
    expect(html).toContain('data-dedicated-lesson="90"');
    expect(html).toContain('data-object-model="editable-start-rate-stage-count-draggable-compound-bars-sequential-latest-base-formula-result-misconception-model"');
    expect(html).toContain('data-start="100"');
    expect(html).toContain('data-rate="10"');
    expect(html).toContain('data-stages="2"');
    expect(html).toContain('data-multiplier="1.1"');
    expect(html).toContain('data-final="121"');
    expect(html).toContain('data-compound="21"');
    expect(html).toContain('aria-label="Compound starting amount"');
    expect(html).toContain('aria-label="Compound stage 1 amount bar"');
    expect(html).toContain("Apply each percent change to the latest amount");
  });
  it("renders lesson 91 as a dedicated draggable scale-drawing map model", () => {
    const lesson = lessonCatalog.find((item) => item.id === 91)!;
    const html = renderToStaticMarkup(<NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />);
    expect(html).toContain('data-testid="number-mockup-0073"');
    expect(html).toContain('data-dedicated-lesson="91"');
    expect(html).toContain('data-object-model="editable-map-length-scale-draggable-route-endpoints-ruler-calculation-real-distance-key-information-model"');
    expect(html).toContain('data-map-length="4"');
    expect(html).toContain('data-scale="5"');
    expect(html).toContain('data-real-length="20"');
    expect(html).toContain('aria-label="Route point A"');
    expect(html).toContain('aria-label="Scale kilometers per centimeter"');
    expect(html).toContain('aria-label="Scale ruler 2 cm"');
    expect(html).toContain('scale-drawings-city-map.png');
    expect(html).toContain("Scale every length by the same factor");
  });
  const lessonSpecificCases = [
    [57, "Natural Numbers", "Natural numbers start at 1"],
    [58, "Whole Numbers", "Whole numbers include zero"],
    [59, "Integers", "Farther right means greater"],
    [60, "Rational Numbers", "Rational numbers can be written as a/b"],
    [61, "Irrational Numbers", "Non-ending, non-repeating decimals are irrational"],
    [62, "Real Numbers", "Real numbers lie on the number line"],
    [63, "Complex Numbers", "real part and an imaginary part"],
    [64, "Place Value", "digit's place changes its value"],
    [65, "Factors", "Factors divide exactly"],
    [66, "Multiples", "Multiples are made by multiplying"],
    [67, "Prime Numbers", "Prime numbers have exactly two positive factors"],
    [68, "Prime Factorisation", "Keep splitting until all factors are prime"],
    [69, "HCF/GCD", "HCF is the greatest shared factor"],
    [70, "LCM", "LCM is the first shared positive multiple"],
    [71, "Divisibility Rules", "Use the rule for the chosen divisor only"],
    [72, "Modular Arithmetic", "Keep the remainder, not the quotient"],
    [73, "Base Systems", "Digits must be allowed in the chosen base"],
    [74, "Continued Fractions", "Evaluate nested fractions from inside outward"],
    [75, "Fraction Models", "Fraction models show selected parts of one whole"],
    [76, "Equivalent Fractions", "Scale numerator and denominator by the same non-zero factor"],
    [77, "Comparing Fractions", "Compare fractions using common units"],
    [78, "Fraction Operations", "Common denominators are needed for addition and subtraction"],
    [79, "Decimal Place Value", "Trailing zeros can help compare decimals"],
    [80, "Decimal Operations", "Line up decimal points for addition and subtraction"],
    [81, "Fraction-Decimal Conversion", "Divide numerator by denominator to get decimal form"],
    [82, "Recurring Decimals", "A repeating remainder creates a recurring decimal"],
    [83, "Ratio Models", "Ratio order matters"],
    [84, "Proportion", "Both ratios must scale by the same factor"],
    [85, "Direct Proportion", "Direct proportion has form y = kx"],
    [86, "Inverse Proportion", "Inverse proportion has constant product"],
    [87, "Unit Rates", "Divide by the number of units to find per one"],
    [88, "Percentages", "Percent means out of 100"],
    [89, "Percentage Change", "Use original amount as the base"],
    [90, "Compound Change", "Apply each percent change to the latest amount"],
    [91, "Scale Drawings", "Scale every length by the same factor"],
  ] as const;

  it.each(lessonSpecificCases)("renders %s with lesson-specific number visuals", (lessonId, title, snippet) => {
    const lesson = lessonCatalog.find((item) => item.id === lessonId)!;
    const html = renderToStaticMarkup(
      <NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
    ).replaceAll("&#x27;", "'");

    expect(html).toContain(title);
    expect(html).toContain(snippet);
    expect(html).not.toContain("Use the selected value to inspect number facts.");
  });

  it("renders phase 3 number concept traces for lessons 57 through 91", () => {
    const expectedTraces: Record<number, string> = {
      57: "Counting-number membership",
      58: "Whole-number membership",
      59: "Integer direction from zero",
      60: "Rational as ratio",
      61: "Irrational square-root check",
      62: "Real number-line placement",
      63: "Complex plane coordinates",
      64: "Place-value expansion",
      65: "Factor pair check",
      66: "Multiple skip-count list",
      67: "Prime factor-count test",
      68: "Prime factor tree",
      69: "Shared-factor intersection",
      70: "Shared-multiple ladder",
      71: "Divisibility rule audit",
      72: "Remainder clock",
      73: "Base-place conversion",
      74: "Nested-fraction layers",
      75: "Equal-parts fraction model",
      76: "Equivalent-fraction scaling",
      77: "Common-unit comparison",
      78: "Fraction-operation denominator check",
      79: "Decimal place-value alignment",
      80: "Decimal-operation columns",
      81: "Fraction-decimal bridge",
      82: "Recurring remainder loop",
      83: "Ratio order model",
      84: "Proportion equal-ratio check",
      85: "Direct proportion table",
      86: "Inverse proportion product",
      87: "Unit-rate per-one model",
      88: "Hundred-grid percent model",
      89: "Percentage-change baseline",
      90: "Compound-change stages",
      91: "Scale-factor drawing",
    };

    for (const [idText, snippet] of Object.entries(expectedTraces)) {
      const lesson = lessonCatalog.find((item) => item.id === Number(idText))!;
      const html = renderToStaticMarkup(
        <NumberLessonAdapter lesson={lesson} resetToken={0} onInteraction={vi.fn()} />,
      );

      expect(html, lesson.title).toContain("Concept trace");
      expect(html, lesson.title).toContain(snippet);
      expect(html, lesson.title).not.toContain("Number concept trace");
    }
  });
});

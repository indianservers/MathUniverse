import type { StudioLearningCopy, StudioMockupPage } from "../../mockup/studioMockupCatalog";

const loop = (observe: string, understand: string, why: string, tryText: string, challenge: string): StudioLearningCopy => ({
  observe, understand, why, try: tryText, challenge,
});

export const NUMBER_SENSE_MODES = ["Integers", "Fractions", "Decimals", "Ratios", "Powers", "Scales"] as const;
export type NumberSenseMode = (typeof NUMBER_SENSE_MODES)[number];

export const MODE_HEADING: Record<NumberSenseMode, string> = {
  Integers: "Integers on a number line",
  Fractions: "Fractions on a number line",
  Decimals: "Decimals and place value",
  Ratios: "Ratios on a double number line",
  Powers: "Powers as repeated multiplication",
  Scales: "Scales, units, and zoom",
};

export const MODE_BANNER: Record<NumberSenseMode, string> = {
  Integers: "Count equal units, compare signs, and hop to add.",
  Fractions: "Equal parts of one whole — equivalent fractions share a point.",
  Decimals: "Tenths and hundredths sit between the integers.",
  Ratios: "A ratio compares two quantities; 2:3 is not the point 2.",
  Powers: "Each step multiplies by the base; equal gaps would mean adding.",
  Scales: "The numbers stay put; the unit or window can change.",
};

export const LEARNING: Record<NumberSenseMode, StudioLearningCopy> = {
  Integers: loop(
    "Watch the unit ticks and the highlighted hop from the start point.",
    "Integers are equally spaced. Left of 0 is smaller, even when the numeral looks bigger.",
    "Proof: each orange arc is one unit hop. |a − b| equals the hop count, never the signed difference.",
    "Drag a point or press ← →. Try a hop of +5 from −3.",
    "Which is greater, −7 or −2?",
  ),
  Fractions: loop(
    "Watch the bar fill as numerator and denominator change, then find the same height on the line.",
    "k × a / k × b is the same point as a/b. 3/2 and 1 1/2 name one place.",
    "Fair comparison needs a common denominator so the parts are the same size.",
    "Set denominator 5, then raise k so 2/5 becomes 4/10 on the same mark.",
    "Which is larger, 3/5 or 2/3?",
  ),
  Decimals: loop(
    "Read ones, tenths, and hundredths on the grid lighting the same number as the point.",
    "0.7 is seven tenths; 0.65 is six tenths and five hundredths, so 0.70 > 0.65.",
    "1/10 = 0.1 and 1/100 = 0.01 because each place is ten times the place to its right.",
    "Round 1.26 to 1 d.p. and watch the point snap.",
    "Which is larger, 0.7 or 0.65?",
  ),
  Ratios: loop(
    "Read 2 along the top line against 3 on the bottom — the pair, not a single tick.",
    "Scaling by k keeps the ratio: 2:3, 4:6, and 6:9 are equivalent. 3:2 is a different order.",
    "A ratio compares multiplicatively. Percent is the same idea with a total of 100.",
    "Raise the multiplier and watch both bars grow in the same 2:3 split.",
    "Simplify 12:18.",
  ),
  Powers: loop(
    "Read each point as base^exponent, not as a bare integer.",
    "2³ means 2 × 2 × 2. 2⁰ = 1 and 2⁻¹ = 1/2 continue the same pattern through 1.",
    "On a linear axis the gaps grow. Equal spacing belongs on a log axis, where each step is ×base.",
    "Switch base 2 / 10 and drag the exponent. Compare linear vs log.",
    "What is 2⁴?",
  ),
  Scales: loop(
    "Zoom the window or switch linear/log — 7 does not move; the unit does.",
    "A map scale 1 cm : 5 km is a ratio. 3 cm then represents 15 km.",
    "mm, cm, and m are the same length in different units: 1 m = 100 cm = 1000 mm.",
    "Set 1 cm = 5 km and scale a 3 cm segment.",
    "If 1 cm represents 5 km, what does 3 cm represent?",
  ),
};

export const MISCONCEPTIONS: Record<NumberSenseMode, { claim: string; ask: string; reveal: string }> = {
  Integers: {
    claim: "−7 is greater than −2 because 7 is bigger than 2.",
    ask: "Which point sits farther left on the line?",
    reveal: "−7 is farther left, so −7 < −2. The sign tells direction from 0.",
  },
  Fractions: {
    claim: "1/8 is larger than 1/4 because 8 is larger than 4.",
    ask: "If the whole is cut into more pieces, is each piece bigger or smaller?",
    reveal: "More equal parts means smaller parts. 1/8 < 1/4. Compare 2/8 and 2/4 after a common denominator.",
  },
  Decimals: {
    claim: "0.65 is larger than 0.7 because 65 is larger than 7.",
    ask: "How many hundredths is each number?",
    reveal: "0.7 = 0.70 = 70 hundredths. 0.65 = 65 hundredths. So 0.7 > 0.65.",
  },
  Ratios: {
    claim: "The ratio 2:3 is the number 2, or the same as 3:2.",
    ask: "If red:blue = 2:3, what happens if we swap the colours?",
    reveal: "2:3 means 2 of the first for every 3 of the second. 3:2 reverses the comparison.",
  },
  Powers: {
    claim: "2, 4, 8 should sit equally far apart because we add 2, then 4.",
    ask: "Is each step adding the base or multiplying by the base?",
    reveal: "2 → 4 → 8 multiplies by 2. Linear distance doubles each time. Equal gaps need a log scale.",
  },
  Scales: {
    claim: "Zooming in makes 7 a bigger number.",
    ask: "Did the point labelled 7 leave the tick for 7?",
    reveal: "Zoom changes the window, not the value. 7 is still 7. A map scale is a ratio, not a new number system.",
  },
};

export type SenseChallenge = {
  prompt: string;
  expected: number | string;
  hint: string;
  placeholder: string;
  success: string;
  work: string;
  load?: Partial<{ a: number; b: number; k: number; num: number; den: number; dec: number; exp: number; zoom: number; km: number; cm: number }>;
};

export const CHALLENGE_BANKS: Record<NumberSenseMode, SenseChallenge[]> = {
  Integers: [
    { prompt: "Which is greater, −7 or −2? Enter the greater number.", expected: -2, hint: "Farther left is smaller. −2 is closer to 0 than −7.", placeholder: "−2", success: "Correct — −2 sits to the right of −7.", work: "On the line, −7 is left of −2, so −7 < −2.", load: { a: -7, b: -2 } },
    { prompt: "What is |−8|?", expected: 8, hint: "Absolute value is distance from 0.", placeholder: "8", success: "Correct — |−8| = 8 units from 0.", work: "|n| counts steps to the origin." },
    { prompt: "What is the opposite of −3?", expected: 3, hint: "Fold across 0.", placeholder: "3", success: "Correct — the opposite of −3 is 3.", work: "Opposites sit equally far from 0 on opposite sides." },
    { prompt: "Compute −2 + (−5).", expected: -7, hint: "Two hops left: 2 then 5.", placeholder: "−7", success: "Correct — both hops go left, landing at −7.", work: "−2 + (−5) = −7." },
    { prompt: "How many units from −3 to 2?", expected: 5, hint: "|2 − (−3)|.", placeholder: "5", success: "Correct — five unit steps.", work: "|2 − (−3)| = 5." },
    { prompt: "Which is smaller, −9 or −4?", expected: -9, hint: "Farther left is smaller.", placeholder: "−9", success: "Correct — −9 < −4.", work: "−9 is farther from 0 on the negative side." },
    { prompt: "A lift at −1 goes up 4 floors. Where does it stop?", expected: 3, hint: "−1 + 4.", placeholder: "3", success: "Correct — −1 + 4 = 3.", work: "Start at −1, hop +4." },
    { prompt: "Temperature −6° then rises 2°. New reading?", expected: -4, hint: "−6 + 2.", placeholder: "−4", success: "Correct — still below 0 at −4°.", work: "−6 + 2 = −4." },
  ],
  Fractions: [
    { prompt: "Which is larger, 3/5 or 2/3? Enter the larger fraction.", expected: "2/3", hint: "Common denominator 15: 9/15 vs 10/15.", placeholder: "2/3", success: "Correct — 2/3 = 10/15 and 3/5 = 9/15.", work: "3/5 = 9/15, 2/3 = 10/15, so 2/3 is larger." },
    { prompt: "Write 4/10 in simplest form.", expected: "2/5", hint: "Divide by gcd 2.", placeholder: "2/5", success: "Correct — 4/10 = 2/5.", work: "gcd(4,10)=2." },
    { prompt: "Write 3/2 as a mixed number (like 1 1/2).", expected: "1 1/2", hint: "How many wholes in 3 halves?", placeholder: "1 1/2", success: "Correct — 3/2 = 1 1/2, same point.", work: "3 ÷ 2 = 1 remainder 1." },
    { prompt: "Which is equivalent to 1/2? Enter 2/4, 2/3, or 3/5.", expected: "2/4", hint: "Same point on the line.", placeholder: "2/4", success: "Correct — 2/4 sits on 1/2.", work: "Multiply 1/2 by 2/2." },
    { prompt: "1/8 compared with 1/4: enter the smaller fraction.", expected: "1/8", hint: "More equal parts means smaller parts.", placeholder: "1/8", success: "Correct — 1/8 < 1/4.", work: "Eighths are smaller than fourths." },
    { prompt: "3/5 of 15 is?", expected: 9, hint: "15 ÷ 5 × 3.", placeholder: "9", success: "Correct — three fifths of 15 is 9.", work: "Each fifth is 3; three of them make 9." },
    { prompt: "Common denominator of 3/5 and 2/3?", expected: 15, hint: "5 × 3.", placeholder: "15", success: "Correct — fifteenths.", work: "lcm(5,3)=15." },
    { prompt: "Is 6/9 equal to 2/3? Enter yes or no.", expected: "yes", hint: "Divide 6 and 9 by 3.", placeholder: "yes", success: "Correct — 6/9 = 2/3.", work: "Same simplified fraction." },
  ],
  Decimals: [
    { prompt: "Which is larger, 0.7 or 0.65?", expected: 0.7, hint: "Compare hundredths: 0.70 vs 0.65.", placeholder: "0.7", success: "Correct — 0.7 = 70 hundredths, 0.65 = 65 hundredths.", work: "Line up tenths: 7 tenths vs 6 tenths." },
    { prompt: "Round 1.26 to 1 decimal place.", expected: 1.3, hint: "Look at the hundredths digit 6.", placeholder: "1.3", success: "Correct — 1.26 rounds to 1.3.", work: "6 ≥ 5 so the tenths digit rises." },
    { prompt: "How many hundredths is 0.8?", expected: 80, hint: "0.80.", placeholder: "80", success: "Correct — 0.8 = 80 hundredths.", work: "8 tenths = 80 hundredths." },
    { prompt: "Order smallest: enter the smallest of 0.8, 0.75, 0.805.", expected: 0.75, hint: "Thousandths: 800, 750, 805.", placeholder: "0.75", success: "Correct — 0.75 is smallest.", work: "0.750 < 0.800 < 0.805." },
    { prompt: "0.65 as a fraction in tenths and hundredths: enter 13/20 or 65/100.", expected: "13/20", hint: "65/100 simplify.", placeholder: "13/20", success: "Correct — 65/100 = 13/20.", work: "gcd 5." },
    { prompt: "What is 6 tenths + 5 hundredths as a decimal?", expected: 0.65, hint: "Place-value house.", placeholder: "0.65", success: "Correct — 0.65.", work: "6/10 + 5/100 = 0.65." },
    { prompt: "₹0.70 vs ₹0.65: enter the greater amount.", expected: 0.7, hint: "Money uses hundredths.", placeholder: "0.7", success: "Correct — 70 paise > 65 paise.", work: "Same as 0.70 > 0.65." },
    { prompt: "Round 2.5 to 0 decimal places (whole number).", expected: 3, hint: "Half rounds away from 0 in this lab.", placeholder: "3", success: "Correct — 2.5 rounds to 3.", work: "round-half-up." },
  ],
  Ratios: [
    { prompt: "Simplify 12:18. Enter the ratio a:b.", expected: "2:3", hint: "Divide both parts by gcd 6.", placeholder: "2:3", success: "Correct — 12:18 = 2:3.", work: "gcd(12,18)=6, so 2:3.", load: { a: 12, b: 18, k: 1 } },
    { prompt: "If 2:3 and the first part is 4, what is the second?", expected: 6, hint: "×2 on both parts.", placeholder: "6", success: "Correct — 4:6 keeps 2:3.", work: "Missing value: 4 × 3 / 2 = 6.", load: { a: 2, b: 3, k: 2 } },
    { prompt: "Which is NOT equivalent to 2:3? Enter 4:6, 6:9, or 3:2.", expected: "3:2", hint: "Order matters.", placeholder: "3:2", success: "Correct — 3:2 reverses the comparison.", work: "4:6 and 6:9 are 2:3; 3:2 is different." },
    { prompt: "2:3 as a percent of the whole (first share). Enter 40.", expected: 40, hint: "2 out of 5.", placeholder: "40", success: "Correct — 2/(2+3)=40%.", work: "Part-whole, not 2/3." },
    { prompt: "2 is what percent of 3? Enter the whole number 67.", expected: 67, hint: "2/3 of 100, nearest whole.", placeholder: "67", success: "Correct — about 67%, which is not the 40% share.", work: "percent-of vs share-of-total." },
    { prompt: "Unit rate: 1 of first matches how many of second in 2:3?", expected: 1.5, hint: "3 ÷ 2.", placeholder: "1.5", success: "Correct — 1 : 1.5.", work: "b/a = 3/2." },
    { prompt: "Recipe 2:3 scaled by 4. Enter the new ratio.", expected: "8:12", hint: "Multiply both by 4.", placeholder: "8:12", success: "Correct — still 2:3 in simplest form.", work: "Equivalent, not yet simplified.", load: { a: 2, b: 3, k: 4 } },
    { prompt: "12 red and 18 blue. Simplest red:blue?", expected: "2:3", hint: "Same as 12:18.", placeholder: "2:3", success: "Correct — 12:18 = 2:3.", work: "Load the juice mix onto the tape.", load: { a: 12, b: 18 } },
    { prompt: "Continue 2,3 then 4,? Enter the missing number.", expected: 6, hint: "Keep 2:3.", placeholder: "6", success: "Correct — next pair is 4:6.", work: "Table of equivalent ratios." },
    { prompt: "Are 10:15 and 2:3 the same comparison? yes or no.", expected: "yes", hint: "Simplify 10:15.", placeholder: "yes", success: "Correct — both simplify to 2:3.", work: "gcd 5." },
  ],
  Powers: [
    { prompt: "What is 2⁴?", expected: 16, hint: "2 × 2 × 2 × 2, four factors of 2.", placeholder: "16", success: "Correct — 2⁴ = 16.", work: "Four factors of 2.", load: { exp: 4 } },
    { prompt: "What is 2⁰?", expected: 1, hint: "Empty product / continue dividing by 2.", placeholder: "1", success: "Correct — 2⁰ = 1.", work: "2¹/2 = 2⁰ = 1." },
    { prompt: "What is 2⁻¹ as a decimal?", expected: 0.5, hint: "1/2.", placeholder: "0.5", success: "Correct — 2⁻¹ = 1/2 = 0.5.", work: "Negative exponent is reciprocal." },
    { prompt: "What is 10³?", expected: 1000, hint: "Three tens multiplied.", placeholder: "1000", success: "Correct — 10³ = 1000.", work: "Scientific place-value." },
    { prompt: "10⁻² as a decimal?", expected: 0.01, hint: "Hundredth.", placeholder: "0.01", success: "Correct — 0.01.", work: "1/100." },
    { prompt: "Which step is ×2 from 4? Enter 8 or 6.", expected: 8, hint: "Multiply, do not add 2.", placeholder: "8", success: "Correct — 4 × 2 = 8, not 4+2.", work: "Linear gaps grow." },
    { prompt: "3⁻¹ as a fraction a/b.", expected: "1/3", hint: "Reciprocal of 3.", placeholder: "1/3", success: "Correct — 1/3.", work: "b⁻¹ = 1/b." },
    { prompt: "2⁵?", expected: 32, hint: "32.", placeholder: "32", success: "Correct — 32.", work: "2×2×2×2×2." },
  ],
  Scales: [
    { prompt: "If 1 cm represents 5 km, what does 3 cm represent?", expected: 15, hint: "Multiply the map length by 5 km per centimetre.", placeholder: "15", success: "Correct — 3 × 5 = 15 km.", work: "Map scale is a ratio.", load: { km: 5, cm: 3 } },
    { prompt: "2.5 m in cm?", expected: 250, hint: "1 m = 100 cm.", placeholder: "250", success: "Correct — 250 cm.", work: "×100." },
    { prompt: "4 cm on a 1 cm : 5 km map, in km?", expected: 20, hint: "4×5.", placeholder: "20", success: "Correct — 20 km.", work: "Same ratio." },
    { prompt: "1 cm : 5 km as 1:n. Enter n (500000).", expected: 500000, hint: "5 km = 500 000 cm.", placeholder: "500000", success: "Correct — RF 1:500000.", work: "Representative fraction." },
    { prompt: "Does zooming in change the number 7? yes or no.", expected: "no", hint: "The window moves, the value does not.", placeholder: "no", success: "Correct — 7 stays 7.", work: "Zoom ≠ new number system." },
    { prompt: "Enlarge a 2 cm segment by k=3. New length in cm?", expected: 6, hint: "2×3.", placeholder: "6", success: "Correct — 6 cm.", work: "Scale drawing." },
    { prompt: "3 m in mm?", expected: 3000, hint: "1 m = 1000 mm.", placeholder: "3000", success: "Correct — 3000 mm.", work: "Metric ladder." },
    { prompt: "2 km in m?", expected: 2000, hint: "1 km = 1000 m.", placeholder: "2000", success: "Correct — 2000 m.", work: "Map units meet SI units." },
  ],
};

export const CHALLENGES: Record<NumberSenseMode, SenseChallenge> = {
  Integers: CHALLENGE_BANKS.Integers[0]!,
  Fractions: CHALLENGE_BANKS.Fractions[0]!,
  Decimals: CHALLENGE_BANKS.Decimals[0]!,
  Ratios: CHALLENGE_BANKS.Ratios[0]!,
  Powers: CHALLENGE_BANKS.Powers[0]!,
  Scales: CHALLENGE_BANKS.Scales[0]!,
};

export const TEACH: Record<NumberSenseMode, { label: string; href: string }> = {
  Integers: { label: "NCERT Class 7 Integers", href: "/ncert/class-7-integers" },
  Fractions: { label: "Fractions, decimals, and percent", href: "/formulas/fractions-decimals-percent" },
  Decimals: { label: "Fractions, decimals, and percent", href: "/formulas/fractions-decimals-percent" },
  Ratios: { label: "NCERT proportional reasoning", href: "/ncert/class-8-proportional-reasoning-2?tab=equivalent-ratios" },
  Powers: { label: "NCERT Class 7 Exponents", href: "/ncert/class-7-exponents" },
  Scales: { label: "Map scale and representative fraction", href: "/ncert/class-8-proportional-reasoning-2?tab=equivalent-ratios" },
};

export const SHORTCUTS = [
  { keys: "← →", action: "Nudge a draggable integer or decimal" },
  { keys: "0", action: "Snap the selected integer to the origin" },
  { keys: "[ ]", action: "Ratios: change the multiplier k" },
  { keys: "S", action: "Ratios: swap order" },
  { keys: "Alt+← / Alt+→", action: "Previous / next mode" },
  { keys: "Home / End", action: "First / last mode tab" },
  { keys: "Enter", action: "Check the challenge" },
  { keys: "Ctrl/⌘ Z", action: "Undo last figure change" },
  { keys: "Ctrl/⌘ K", action: "Search labs" },
];

export const MODE_HINTS: Record<NumberSenseMode, string> = {
  Integers: "← → nudge A or B · 0 snap to origin · Alt+← / Alt+→ change mode · Enter checks the challenge",
  Fractions: "Denominator resizes the parts · Try applies k · Alt+← / Alt+→ change mode",
  Decimals: "Drag the blue point · snap 0.01 · Enter checks · Alt+← / Alt+→ change mode",
  Ratios: "[ ] changes k · S swaps order · drag the pair cursor · not the Ordered 2 < 3 trap",
  Powers: "Toggle linear/log or split view · exponent slider · Alt+← / Alt+→",
  Scales: "Zoom is a window · map strip is a ratio · Alt+← / Alt+→",
};

export const SIMPLE_BANNER: Record<NumberSenseMode, string> = {
  Integers: "Equal steps. Left of 0 is smaller.",
  Fractions: "Same point can have many names.",
  Decimals: "Tenths are bigger than hundredths.",
  Ratios: "A pair, not one number. Order matters.",
  Powers: "Each hop multiplies by the base.",
  Scales: "Zoom does not change the number.",
};

export const GLOSSARY: Record<NumberSenseMode, { term: string; meaning: string }[]> = {
  Integers: [
    { term: "origin", meaning: "0 — neither positive nor negative." },
    { term: "opposite", meaning: "Same distance from 0, other side." },
  ],
  Fractions: [
    { term: "equivalent", meaning: "Different names for one point." },
    { term: "denominator", meaning: "How many equal parts in one whole." },
  ],
  Decimals: [
    { term: "tenth", meaning: "1/10 = 0.1." },
    { term: "hundredth", meaning: "1/100 = 0.01." },
  ],
  Ratios: [
    { term: "unit rate", meaning: "How many of the second per 1 of the first." },
    { term: "equivalent ratio", meaning: "Same comparison after ×k." },
  ],
  Powers: [
    { term: "exponent", meaning: "How many times the base is a factor." },
    { term: "log axis", meaning: "Equal gaps mean × base." },
  ],
  Scales: [
    { term: "representative fraction", meaning: "Map 1 : n in the same unit." },
    { term: "window", meaning: "What you see; not a new value." },
  ],
};

export const NCERT_LOAD: Record<NumberSenseMode, { label: string; note: string }> = {
  Integers: { label: "Class 7 Integers example", note: "Load −3 and +2 with a +5 hop." },
  Fractions: { label: "Equivalent fractions example", note: "Load 2/5 and k=2 → 4/10." },
  Decimals: { label: "Place value example", note: "Load 0.65 vs 0.7." },
  Ratios: { label: "NCERT equivalent ratios", note: "Load 2:3 and multiplier 3." },
  Powers: { label: "Class 7 Exponents example", note: "Load 2³ then 2⁰." },
  Scales: { label: "Map scale example", note: "Load 1 cm : 5 km and 3 cm." },
};

export const QUEST_STEPS = [
  "Same 2:3 as a ratio pair",
  "2 of 5 as a fraction of a mix",
  "40% share of the whole",
  "Map 2 cm : 3 km in the same idea",
] as const;

export function numberSenseModeLearning(page: StudioMockupPage, mode?: string): StudioLearningCopy {
  if (page.id !== "number-sense" || !mode) return page.learning;
  return LEARNING[mode as NumberSenseMode] ?? page.learning;
}

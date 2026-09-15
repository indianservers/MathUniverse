import type { StrengthenedLesson, WorkedExample } from "./strengthenedLessonSchema";

type HandOverlay = {
  introduction: string;
  definition: string;
  basicIdea: string;
  howItWorks: string;
  whyItWorks: string;
  worked: Array<Pick<WorkedExample, "prompt" | "steps" | "answer">>;
};

const overlays: Record<number, HandOverlay> = {
  1: {
    introduction:
      "The Basic Calculator evaluates a typed arithmetic expression by following BODMAS, not left-to-right guessing. For (12 + 8) / 4 the brackets make 20 first, then division gives 5. Shop totals, recipe scaling, and shared fares all use the same ordered trace. A common error is reading 12 + 8 / 4 as 5; the live strip shows why brackets change the value.",
    definition:
      "A basic calculator expression is a finite string of numbers and operations that has one value once brackets, orders, division/multiplication, and addition/subtraction are applied from left to right in that priority.",
    basicIdea:
      "Every symbol has a job: brackets group, powers raise, × and ÷ share a level, and + and − share a later level. The calculator does not invent a new order for each problem.",
    howItWorks:
      "Type or tap the expression. The Basic Calculator first marks each bracket pair, then each order, then each × or ÷ from the left, then each + or −. The trace lists the intermediate values so (12 + 8) / 4 becomes 20 / 4 and then 5.",
    whyItWorks:
      "One agreed order makes (12 + 8) / 4 and 12 + 8 / 4 different on purpose. The Basic Calculator shows both the symbols and the intermediate numbers so the chosen BODMAS path can be checked.",
    worked: [
      { prompt: "Evaluate (18 − 6) × 2 + 4.", steps: ["Brackets: 18 − 6 = 12.", "Multiply: 12 × 2 = 24.", "Add: 24 + 4 = 28."], answer: "28" },
      { prompt: "Evaluate 36 ÷ (3 + 3) + 5.", steps: ["Brackets: 3 + 3 = 6.", "Divide: 36 ÷ 6 = 6.", "Add: 6 + 5 = 11."], answer: "11" },
      { prompt: "Evaluate 7 + 4 × 6 − 3.", steps: ["Multiply first: 4 × 6 = 24.", "Add: 7 + 24 = 31.", "Subtract: 31 − 3 = 28."], answer: "28" },
    ],
  },
  2: {
    introduction:
      "The Fraction Calculator adds 1/2 and 3/4 as exact parts. It rewrites 1/2 as 2/4, then adds only numerators to get 5/4, which is 1 1/4 or 1.25. Pizza slices, measuring cups, and shared prices use the same LCD bars. Adding denominators to make 4/6 is the error the labelled bars are built to stop.",
    definition:
      "A fraction a/b is the exact quotient of integer a by a non-zero integer b. Two fractions are added only after they are rewritten with one common positive denominator, and only those rewritten numerators are combined.",
    basicIdea:
      "Equal-sized pieces are the only pieces that can be stacked. The LCD is the smallest piece size that both original fractions can be cut into.",
    howItWorks:
      "Enter both fractions. The Fraction Calculator finds LCD(b, d) for a/b + c/d, multiplies each numerator by the matching scale factor, adds those numerators, then simplifies. The cyan and violet bars keep the same total length so 2/4 + 3/4 is visibly 5/4.",
    whyItWorks:
      "Halves and fourths are different widths. Rewriting 1/2 as 2/4 does not change the amount; it only matches the piece size so the count 2 + 3 is meaningful.",
    worked: [
      { prompt: "Add 1/2 + 3/4.", steps: ["LCD of 2 and 4 is 4.", "1/2 = 2/4.", "2/4 + 3/4 = 5/4."], answer: "5/4" },
      { prompt: "Add 2/3 + 1/6.", steps: ["LCD of 3 and 6 is 6.", "2/3 = 4/6.", "4/6 + 1/6 = 5/6."], answer: "5/6" },
      { prompt: "Add 3/5 + 1/10.", steps: ["LCD of 5 and 10 is 10.", "3/5 = 6/10.", "6/10 + 1/10 = 7/10."], answer: "7/10" },
    ],
  },
  3: {
    introduction:
      "Mixed Numbers writes a whole amount and a leftover part together, such as 2 1/3. That mark means 2 + 1/3, which is 7/3, not 2 × 1/3. Baking 2 1/2 cakes, cutting 3 1/4 metres of wood, and timing 1 1/2 hours all use this split. The blocks and strips show the whole rectangles and the leftover third side by side.",
    definition:
      "A mixed number a b/c, with whole number a ≥ 0 and proper fraction b/c, equals the sum a + b/c. Its improper form is (a·c + b)/c, provided c ≠ 0.",
    basicIdea:
      "The whole part is complete units. The fraction is the leftover piece of the next unit. Conversion only changes the writing, not the length.",
    howItWorks:
      "Enter each mixed number. The lab converts a b/c into (ac + b)/c, matches denominators if two mixed numbers are added, then offers the exact improper value, mixed value, and decimal check.",
    whyItWorks:
      "Two cakes plus one-third of a cake is seven thirds of a cake. Treating the space in 2 1/3 as multiplication would shrink the amount to 2/3, which the block model contradicts.",
    worked: [
      { prompt: "Write 2 1/3 as an improper fraction.", steps: ["2 = 6/3.", "6/3 + 1/3 = 7/3.", "The leftover third stays in the numerator."], answer: "7/3" },
      { prompt: "Write 11/4 as a mixed number.", steps: ["11 ÷ 4 = 2 remainder 3.", "The whole part is 2.", "The leftover is 3/4."], answer: "2 3/4" },
      { prompt: "Add 1 1/2 + 2 1/4.", steps: ["1 1/2 = 3/2 = 6/4.", "2 1/4 = 9/4.", "6/4 + 9/4 = 15/4 = 3 3/4."], answer: "3 3/4" },
    ],
  },
  4: {
    introduction:
      "The Percentage Calculator reads p% as p hundredths of a base. 15% of 240 is (15/100)×240 = 36, shown on a hundred grid, a percent scale, and part/whole bars. Discounts, marks, and battery charge use the same three numbers: percent, base, and part. Using 15 instead of 0.15 is the error the grid is labelled to catch.",
    definition:
      "A percentage p% is the ratio p/100. The part corresponding to p% of a base x is (p/100)x. Conversely, a part a of a base x is the percent (a/x)×100 when x ≠ 0.",
    basicIdea:
      "Hundredths are a shared language for different wholes. 15 out of 100, 36 out of 240, and 3 out of 20 can all be 15%.",
    howItWorks:
      "Drag or type the percent and the base. The Percentage Calculator shades p cells of the hundred grid, marks p on the 0–100 scale, and draws a part bar of length (p/100)x next to the whole bar of length x.",
    whyItWorks:
      "Percent comparison stays fair because every percent uses the same 100-cell ruler. Changing the base stretches the part bar, but the shaded cell count for the same p stays 15 out of 100.",
    worked: [
      { prompt: "Find 15% of 240.", steps: ["15% = 15/100 = 0.15.", "0.15 × 240 = 36.", "The part is 36."], answer: "36" },
      { prompt: "45 out of 50 as a percent.", steps: ["Part ÷ base = 45/50.", "45/50 = 0.9.", "0.9 × 100 = 90."], answer: "90%" },
      { prompt: "A ₹800 shirt is reduced by 25%. Find the sale price.", steps: ["Discount = 0.25 × 800 = 200.", "Sale price = 800 − 200.", "The sale price is 600."], answer: "600" },
    ],
  },
  5: {
    introduction:
      "The Ratio Calculator compares two counts in the form a : b and then simplifies by their GCF. 8 : 12 becomes 2 : 3 because both parts divide by 4. The lab shows GCF groups, tape bars, a tile array, and a double number line. Recipe mixes, map keys, and class votes use the same simplified pair. Adding 8 + 12 and calling 20 the ratio is the labelled mistake.",
    definition:
      "A ratio a : b, with a and b not both zero, compares two quantities of the same kind. Its simplest form is (a/g) : (b/g) where g = gcd(|a|, |b|). Equivalent ratios share the same reduced pair.",
    basicIdea:
      "A ratio is a pairing, not a single total. Scaling both parts by the same factor keeps the comparison; adding the parts destroys it.",
    howItWorks:
      "Enter or drag the two parts. The Ratio Calculator computes the GCF, draws equal groups, and lines both parts on a double number line so 8 and 12 sit above 2 and 3 after dividing by 4.",
    whyItWorks:
      "If 4 red tiles match 6 blue tiles in each bundle, 2 bundles give 8 and 12. The pairing 2 to 3 is the same pairing as 8 to 12, which the double number line makes visible.",
    worked: [
      { prompt: "Simplify 8 : 12.", steps: ["gcd(8, 12) = 4.", "8 ÷ 4 = 2 and 12 ÷ 4 = 3.", "The simplest ratio is 2 : 3."], answer: "2 : 3" },
      { prompt: "Are 10 : 15 and 2 : 3 equivalent?", steps: ["10/15 = 2/3.", "Both reduce to 2 : 3.", "Yes, they are equivalent."], answer: "yes" },
      { prompt: "A mix uses 2 cups juice to 5 cups water. How much water for 8 cups juice?", steps: ["Scale factor = 8/2 = 4.", "Water = 5 × 4 = 20.", "The mix is 8 : 20."], answer: "20 cups" },
    ],
  },
  6: {
    introduction:
      "Powers and Roots links a base-and-exponent product with the inverse root. 2^5 is five factors of 2, which is 32; the fifth root of 32 returns 2. Area grids show squares, a cube model shows 2^3 = 8, and the repeated-factor chain lists 2 × 2 × 2 × 2 × 2. Growth of bacteria, pixel resolution, and side-from-area problems use the same pair of operations.",
    definition:
      "For a real base a and a positive integer n, a^n is the product of n factors of a. If n is even and a ≥ 0, or n is odd, the principal n-th root of a^n is a. In particular √(a^2) = |a|.",
    basicIdea:
      "A power stacks equal factors. A root undoes that stack and asks for the matching factor. The grid and cube keep the count of factors visible.",
    howItWorks:
      "Set the base and the exponent or the radicand and the root index. The lab draws the factor chain, the square or cube packing, and the combined expression so 3^2 = 9 sits next to √9 = 3.",
    whyItWorks:
      "Nine unit squares make a 3-by-3 square, so the side is the square root. Changing the exponent changes the number of layers, not a hidden multiplication by the exponent itself.",
    worked: [
      { prompt: "Evaluate 2^5.", steps: ["2^5 = 2 × 2 × 2 × 2 × 2.", "The product is 32.", "Five factors of 2 make 32."], answer: "32" },
      { prompt: "Evaluate √81.", steps: ["9 × 9 = 81.", "The principal square root is 9.", "√81 = 9."], answer: "9" },
      { prompt: "Evaluate 5^3.", steps: ["5 × 5 = 25.", "25 × 5 = 125.", "5^3 = 125."], answer: "125" },
    ],
  },
  7: {
    introduction:
      "Scientific Notation writes a number as a coefficient times a power of ten, such as 4.5 × 10^{-4} for 0.00045. The coefficient stays at least 1 and less than 10 while the exponent counts the decimal-point shifts. Star distances, cell sizes, and calculator overflow all use this compact form. The number-line marker and shift arrows show each move of the point.",
    definition:
      "A number is in scientific notation when it is written a × 10^k with 1 ≤ |a| < 10 and k an integer. Moving the decimal point one place left increases k by 1; moving it one place right decreases k by 1.",
    basicIdea:
      "The exponent stores how many tens were factored out. The coefficient stores the significant digits that remain.",
    howItWorks:
      "Enter the coefficient and exponent, or start from ordinary form. The Scientific Notation lab shifts the decimal, updates 10^k, and places the value on a logarithmic-style number line so 4.5 × 10^{-4} sits four places left of 4.5.",
    whyItWorks:
      "Multiplying by 10^{-4} is exactly four tenths-shifts. Keeping the coefficient in [1, 10) makes two scientific numbers easy to compare by exponent first, then coefficient.",
    worked: [
      { prompt: "Write 0.00045 in scientific notation.", steps: ["0.00045 = 4.5 × 0.0001.", "0.0001 = 10^{-4}.", "0.00045 = 4.5 × 10^{-4}."], answer: "4.5 × 10^{-4}" },
      { prompt: "Write 3.2 × 10^4 in ordinary form.", steps: ["10^4 = 10000.", "3.2 × 10000 = 32000.", "The ordinary form is 32000."], answer: "32000" },
      { prompt: "Compare 2.1 × 10^3 and 8.4 × 10^2.", steps: ["2.1 × 10^3 = 2100.", "8.4 × 10^2 = 840.", "2100 > 840."], answer: "2.1 × 10^3 is greater" },
    ],
  },
  8: {
    introduction:
      "Logarithms undo exponentiation: log_b(a) is the exponent that raises b to a. So log_2(8) = 3 because 2^3 = 8. The power ladder, inverse-operation proof, and drag ranges keep base, exponent, and power in one picture. Earthquake scales, pH, and compound-growth inversion use the same undo step. A frequent slip is treating log as division by the base.",
    definition:
      "For base b > 0, b ≠ 1, and argument a > 0, log_b(a) = c if and only if b^c = a. Common cases are log_10 and the natural log ln with base e.",
    basicIdea:
      "A logarithm is an exponent with a name. The ladder 2, 4, 8, 16 is both a power list and a log list.",
    howItWorks:
      "Drag or step the base, exponent, or power. The Logarithms lab updates the other two so the triple (b, c, a) always satisfies b^c = a, and the inverse arrows show log then power returning to the start.",
    whyItWorks:
      "Because the exponential map is one-to-one on the reals for a fixed allowed base, each positive a has exactly one exponent c. The ladder makes that unique height visible.",
    worked: [
      { prompt: "Evaluate log_2(8).", steps: ["2^3 = 8.", "The missing exponent is 3.", "log_2(8) = 3."], answer: "3" },
      { prompt: "Evaluate log_10(1000).", steps: ["10^3 = 1000.", "The exponent is 3.", "log_10(1000) = 3."], answer: "3" },
      { prompt: "Solve 3^x = 81.", steps: ["81 = 3^4.", "So x = 4.", "Equivalently x = log_3(81)."], answer: "4" },
    ],
  },
  9: {
    introduction:
      "Exponential Calculations follow a repeated-factor chain a^n and a growth chart. 2^6 is six doublings from 1, which is 64. The staircase animation, live factor list, and graded practice use the same base and exponent. Populations, compound interest, and pixel counts grow this way. Adding the exponent to the base, as in 2 + 6 = 8, is the labelled error.",
    definition:
      "An exponential calculation with base a and integer exponent n ≥ 1 is the product of n factors of a. For n = 0 the value is 1 when a ≠ 0. Growth from a starting amount A at rate r per stage is A(1 + r)^n.",
    basicIdea:
      "Each extra exponent adds one more multiplication by the same base, not one more addition.",
    howItWorks:
      "Set the base and exponent. The lab multiplies the running product, adds a stair, and plots the growth points (0, 1), (1, a), (2, a^2), … so 2^6 is the sixth doubling mark at 64.",
    whyItWorks:
      "Repeated multiplication compounds. After k steps the value is a^k, which is why the chart is a curve (or discrete geometric sequence), not a straight addition line.",
    worked: [
      { prompt: "Evaluate 2^6.", steps: ["Start at 1.", "Double six times: 2, 4, 8, 16, 32, 64.", "2^6 = 64."], answer: "64" },
      { prompt: "A culture doubles every hour from 5 cells. How many after 3 hours?", steps: ["After 1 hour: 10.", "After 2 hours: 20.", "After 3 hours: 40."], answer: "40" },
      { prompt: "Evaluate 3^4.", steps: ["3 × 3 = 9.", "9 × 3 = 27.", "27 × 3 = 81."], answer: "81" },
    ],
  },
  10: {
    introduction:
      "The Trigonometric Calculator reads an angle on the unit circle and reports sine, cosine, and tangent. At 30° the point is (√3/2, 1/2), so sin 30° = 1/2. The dual-angle model, exact-value triangles, and DEG/RAD switch keep the same point. Ramps, circular motion, and bearings use these ratios. Mixing degrees with a radian formula is the labelled trap.",
    definition:
      "On the unit circle, an angle θ measured from the positive x-axis has cosine equal to the x-coordinate and sine equal to the y-coordinate of the terminal point. Tangent is sine/cosine when cosine ≠ 0.",
    basicIdea:
      "Trigonometry is coordinates on a circle of radius 1, not a new kind of multiplication. Special angles have exact coordinates.",
    howItWorks:
      "Drag either angle. The lab updates the radius point, the reference triangle, DEG and RAD readouts, and the exact-value table so 30° and π/6 name the same point.",
    whyItWorks:
      "Similar right triangles on the unit circle have hypotenuse 1, so opposite/hypotenuse collapses to the y-coordinate. Changing the unit from degrees to radians only rescales the same turn.",
    worked: [
      { prompt: "Find sin 30°.", steps: ["30° is a special angle.", "The opposite side of the 30-60-90 triangle is half the hypotenuse.", "sin 30° = 1/2."], answer: "1/2" },
      { prompt: "Find cos 60°.", steps: ["cos 60° = adjacent/hypotenuse.", "In the 30-60-90 triangle that ratio is 1/2.", "cos 60° = 1/2."], answer: "1/2" },
      { prompt: "Convert 180° to radians.", steps: ["π radians = 180°.", "180° × π/180 = π.", "The radian measure is π."], answer: "π" },
    ],
  },
  11: {
    introduction:
      "Inverse Trigonometry recovers an angle from a ratio. If sin θ = 1/2 and θ is the principal value, then θ = 30° or π/6. The sine-ratio slider, unit-circle ray, and principal-range band show why other angles such as 150° are not the calculator’s first answer. Survey heights and ramp design use this reverse look-up.",
    definition:
      "The principal inverse sine, arcsin x or sin^{-1} x, is the unique angle θ in [−90°, 90°] (or [−π/2, π/2]) such that sin θ = x for x in [−1, 1]. Inverse cosine and tangent use their own principal intervals.",
    basicIdea:
      "Many angles share a sine, but the inverse function must pick one. The lab always picks the principal one and then names the others as extra solutions if needed.",
    howItWorks:
      "Drag the sine ratio. The Inverse Trigonometry lab computes the principal angle, draws the right triangle and the unit-circle ray, and lists DEG/RAD values with a verification sin(θ) = x.",
    whyItWorks:
      "Sine is one-to-one on [−90°, 90°], so the principal inverse is a true function. The unit circle still shows the second-quadrant twin, which is why 150° appears as a related angle, not the principal output.",
    worked: [
      { prompt: "Find the principal value of sin^{-1}(1/2).", steps: ["sin 30° = 1/2.", "30° lies in [−90°, 90°].", "sin^{-1}(1/2) = 30°."], answer: "30°" },
      { prompt: "Find cos^{-1}(0) in degrees.", steps: ["cos 90° = 0.", "90° is the principal value in [0°, 180°].", "cos^{-1}(0) = 90°."], answer: "90°" },
      { prompt: "A ramp has opposite 3 and hypotenuse 6. Find the principal elevation angle.", steps: ["sin θ = 3/6 = 1/2.", "Principal θ = 30°.", "The elevation is 30°."], answer: "30°" },
    ],
  },
  12: {
    introduction:
      "Hyperbolic Functions use exponentials: sinh x = (e^x − e^{−x})/2 and cosh x = (e^x + e^{−x})/2. At x = 0, sinh 0 = 0 and cosh 0 = 1. The dual-exponential curves, difference construction, and hyperbola context keep the identities visible. Catenary cables and some special-relativity maps use these functions. Treating sinh like ordinary sine of a circle angle is the named slip.",
    definition:
      "The hyperbolic sine and cosine are sinh x = (e^x − e^{−x})/2 and cosh x = (e^x + e^{−x})/2. They satisfy cosh^2 x − sinh^2 x = 1, the rectangular-hyperbola identity, not the circle identity.",
    basicIdea:
      "Hyperbolic functions are built from growth and decay exponentials. Their graph is not a sine wave, even though the names look similar.",
    howItWorks:
      "Drag x. The lab plots e^x and e^{−x}, averages or halves their difference, and probes both hyperbolic curves so the point (cosh x, sinh x) rides the right branch of u^2 − v^2 = 1.",
    whyItWorks:
      "Adding the two exponentials cancels the odd part and leaves cosh; subtracting cancels the even part and leaves sinh. That is why the identities are algebraic consequences of the exponential definitions, not circle geometry.",
    worked: [
      { prompt: "Evaluate sinh 0.", steps: ["e^0 = 1 and e^{−0} = 1.", "sinh 0 = (1 − 1)/2.", "sinh 0 = 0."], answer: "0" },
      { prompt: "Evaluate cosh 0.", steps: ["(e^0 + e^0)/2 = (1 + 1)/2.", "The value is 1.", "cosh 0 = 1."], answer: "1" },
      { prompt: "Check cosh^2 0 − sinh^2 0.", steps: ["cosh 0 = 1 and sinh 0 = 0.", "1^2 − 0^2 = 1.", "The hyperbola identity holds."], answer: "1" },
    ],
  },
  13: {
    introduction:
      "Factorial, Permutation and Combination count arrangements. 5! = 120, 5P2 = 20 ordered pairs, and 5C2 = 10 unordered pairs. Draggable slots, n and r inputs, and comparison cards keep the three formulas apart. Seating, passwords, and team selection use them. Using n! for an unordered team is the error the cards are labelled to catch.",
    definition:
      "n! is the product 1 × 2 × … × n for integer n ≥ 0, with 0! = 1. The permutation nPr = n! / (n − r)! counts ordered selections. The combination nCr = n! / (r!(n − r)!) counts unordered selections, for 0 ≤ r ≤ n.",
    basicIdea:
      "Order matters for permutations and does not matter for combinations. Factorial is the special case of lining up all n items.",
    howItWorks:
      "Set n and r and choose a mode. The lab fills distinct slots, multiplies the falling product for permutations, and divides by r! when the same set is counted in many orders.",
    whyItWorks:
      "There are 5 choices then 4 choices for an ordered pair, which is 20. Each unordered pair {A, B} was counted twice as (A, B) and (B, A), so 20 / 2! = 10 combinations.",
    worked: [
      { prompt: "Evaluate 5!.", steps: ["5! = 5 × 4 × 3 × 2 × 1.", "The product is 120.", "5! = 120."], answer: "120" },
      { prompt: "How many ordered pairs from 5 students?", steps: ["5P2 = 5! / 3! = 120 / 6.", "5 × 4 = 20.", "There are 20 ordered pairs."], answer: "20" },
      { prompt: "How many 2-person teams from 5 students?", steps: ["5C2 = 5! / (2! 3!) = 120 / 12.", "5C2 = 10.", "Order does not matter."], answer: "10" },
    ],
  },
  14: {
    introduction:
      "Absolute Value is distance from zero. |−7| = 7 and |7| = 7, shown by a signed point, its mirror, and a number-line arc. Temperatures below zero, bank debits, and error sizes use this nonnegative distance. Dropping the bars and keeping the sign is the labelled mistake.",
    definition:
      "The absolute value |x| equals x when x ≥ 0 and equals −x when x < 0. Equivalently, |x| is the distance between x and 0 on the number line, so |x| ≥ 0 for every real x.",
    basicIdea:
      "Absolute value forgets direction and keeps size. The mirror point on the other side of zero has the same distance.",
    howItWorks:
      "Drag the signed point. The Absolute Value lab draws the mirror, the distance arc, and the nonnegative output so |−4| and |4| both read 4.",
    whyItWorks:
      "Distance cannot be negative. The two-sided definition |x| = −x for negatives is exactly the length of the left-hand segment from −x to 0.",
    worked: [
      { prompt: "Evaluate |−7|.", steps: ["−7 is 7 units left of 0.", "Distance is 7.", "|−7| = 7."], answer: "7" },
      { prompt: "Evaluate |4 − 9|.", steps: ["4 − 9 = −5.", "|−5| = 5.", "The distance between 4 and 9 is 5."], answer: "5" },
      { prompt: "Solve |x| = 3.", steps: ["Distance from 0 is 3.", "x = 3 or x = −3.", "Two solutions."], answer: "x = 3 or x = −3" },
    ],
  },
  15: {
    introduction:
      "Rounding and Precision cuts a number to an agreed place and names the leftover error. 22/7 rounded to 2 decimal places is 3.14 because the next digit is 2, which is less than 5. The number-line zoom, next-digit flag, and error bar show why 3.15 would be the wrong 2-place report. Money, measurements, and calculator displays all choose a precision.",
    definition:
      "To round a decimal to n places, look at digit n + 1. If that digit is 5 or more, increase digit n by 1; otherwise leave digit n. The rounding error is the exact value minus the rounded value.",
    basicIdea:
      "Rounding is a rule about the next unused digit, not a guess. Precision is how many digits you keep.",
    howItWorks:
      "Enter an exact fraction and choose the place. The lab writes the decimal expansion, highlights the deciding digit, marks the rounded value on a local number line, and reports the signed error.",
    whyItWorks:
      "Keeping every number to the same place lets two measurements be compared. The half-up rule at digit 5 is a convention that removes ties the same way every time.",
    worked: [
      { prompt: "Round 22/7 to 2 decimal places.", steps: ["22/7 = 3.142857…", "The third decimal digit is 2, which is less than 5.", "2-place rounding is 3.14."], answer: "3.14" },
      { prompt: "Round 2.756 to 2 decimal places.", steps: ["The third decimal digit is 6 ≥ 5.", "Increase the second digit 5 by 1.", "The rounded value is 2.76."], answer: "2.76" },
      { prompt: "Round 1482 to the nearest ten.", steps: ["The ones digit is 2 < 5.", "The tens digit stays 8.", "1482 rounds to 1480."], answer: "1480" },
    ],
  },
  16: {
    introduction:
      "The Constants Library stores high-precision names such as π, e, and the golden ratio φ. With π ≈ 3.14159 a circle of radius 2 has circumference 4π ≈ 12.566. Dedicated circle, exponential, and pentagon models, plus a precision slider, show why early rounding of π to 22/7 is only an approximation. Science formulas should keep the named constant until the last step.",
    definition:
      "A mathematical constant is a fixed real number with a standard symbol. In this lesson π is the circle ratio C/D, e is the base of natural growth, and φ = (1 + √5)/2 is the golden ratio.",
    basicIdea:
      "A symbol such as π is exact. A decimal such as 3.14 is a rounded stand-in. The library lets you choose how many digits to reveal without changing the symbol.",
    howItWorks:
      "Select a constant and a precision. The lab draws the matching geometric model, writes the truncated decimal, and compares an early-rounded substitute so 22/7 − π is a visible error.",
    whyItWorks:
      "Keeping π symbolic until the last multiplication avoids stacking rounding error. The circle model shows C = 2πr is a definition, not a measured guess.",
    worked: [
      { prompt: "A circle has radius 2. Find the exact circumference.", steps: ["C = 2πr.", "C = 2π(2) = 4π.", "Leave π unexpanded."], answer: "4π" },
      { prompt: "Using π ≈ 3.14, estimate that circumference.", steps: ["4 × 3.14 = 12.56.", "This is an approximation.", "The estimate is 12.56."], answer: "12.56" },
      { prompt: "Evaluate φ = (1 + √5)/2 to 3 decimal places.", steps: ["√5 ≈ 2.236.", "1 + 2.236 = 3.236.", "3.236 / 2 = 1.618."], answer: "1.618" },
    ],
  },
  17: {
    introduction:
      "Calculation History keeps each evaluated line so a later step can reuse an earlier result. If line 1 is 12 + 8 = 20 and line 2 is 20 ÷ 4 = 5, recalling line 2 must return 5, not 20. Pin, copy, inspect, and dependency-chain checks stop a learner from grabbing the wrong row. Multi-step homework and lab logs need this provenance.",
    definition:
      "A calculation history is an ordered list of evaluated expressions, each storing its input string, its result, and optional links to earlier rows that supplied values. Recalling a row returns that row’s own result.",
    basicIdea:
      "History is not a pile of numbers. Each row has a source expression and a result, and reuse must name the row.",
    howItWorks:
      "Evaluate an expression to append a row. Select a row to reuse, copy, pin, or inspect. The lab highlights the dependency chain so a later division that used 20 still points at the addition that produced 20.",
    whyItWorks:
      "Storing both the expression and the result makes an audit possible. Without provenance, 20 could be a typed constant or a previous sum, and the next step could reuse the wrong quantity.",
    worked: [
      { prompt: "History has 12 + 8 = 20 then 20 ÷ 4 = 5. What does row 2 recall?", steps: ["Row 1 result is 20.", "Row 2 evaluates 20 ÷ 4.", "Row 2 recalls 5."], answer: "5" },
      { prompt: "A third row computes 5 × 3 using row 2. What is the result?", steps: ["Row 2 value is 5.", "5 × 3 = 15.", "Row 3 result is 15."], answer: "15" },
      { prompt: "If row 1 is edited from 12 + 8 to 12 + 10, what should a linked row 2 become?", steps: ["New row 1 is 22.", "Row 2 was 20 ÷ 4.", "A live link would recompute 22 ÷ 4 = 5.5."], answer: "5.5" },
    ],
  },
  18: {
    introduction:
      "Exact and Decimal Modes keep a radical such as √2 exact until a chosen number of decimal places is requested. √2 stays √2 in exact mode and becomes 1.41 when 2 decimal places are asked. The unit-square diagonal, number-line marker, and expansion table show the leftover error. Mixing 1.41 back into an exact proof is the labelled mistake.",
    definition:
      "Exact mode stores a value in closed form (integers, fractions, radicals, or symbols). Decimal mode writes a rounded expansion to n places. The two modes name the same real number only up to the rounding error of the chosen place.",
    basicIdea:
      "Exact form is the identity of the number. A decimal is a report of that number at a precision.",
    howItWorks:
      "Toggle exact or decimal and move the 2–16 place slider. The lab keeps the unit-square diagonal as √2, writes the truncated decimal, and plots both marks so the gap is the rounding error.",
    whyItWorks:
      "√2 is irrational, so no finite decimal is equal to it. Exact mode refuses to pretend otherwise; decimal mode makes the pretence visible and quantified.",
    worked: [
      { prompt: "Write √2 in exact mode.", steps: ["The diagonal of a unit square is √2.", "Exact mode keeps the radical.", "The exact value is √2."], answer: "√2" },
      { prompt: "Write √2 to 2 decimal places.", steps: ["√2 = 1.41421…", "The third digit is 4 < 5.", "2-place form is 1.41."], answer: "1.41" },
      { prompt: "A square has side √2. Find its exact area.", steps: ["Area = (√2)^2.", "(√2)^2 = 2.", "Keep 2, not 1.41^2."], answer: "2" },
    ],
  },
  19: {
    introduction:
      "Algebra Workspace stores named rules such as y = 2x + 3 and updates every dependent output when x moves. At x = 4, substitution gives y = 11. The dependency graph, live table, and parsed-rule checks keep the arrows honest. Price formulas and science relations are the same idea. Editing one node but not its dependents is the named error.",
    definition:
      "An algebra workspace is a finite set of named expressions together with a substitution map. If a rule y = 2x + 3 is stored and x is assigned a number c, then y must evaluate to 2c + 3 in the same workspace state.",
    basicIdea:
      "A letter is a shared mailbox. Every rule that reads x must see the same current number.",
    howItWorks:
      "Type or select a rule, then drag x. The workspace validates the parse, substitutes, fills the test table, and redraws the dependency arrows from x to 2x to y.",
    whyItWorks:
      "Substitution is a homomorphism: replacing x by 4 in every occurrence is the only way 2x + 3 stays a single function of one input.",
    worked: [
      { prompt: "Expand 4(x + 3) in the workspace.", steps: ["4(x + 3) = 4·x + 4·3.", "4·3 = 12.", "The expanded rule is 4x + 12."], answer: "4x + 12" },
      { prompt: "If y = 2x + 3 and x = 4, find y.", steps: ["Substitute x = 4.", "y = 2(4) + 3 = 8 + 3.", "y = 11."], answer: "11" },
      { prompt: "If y = 2x + 3 and y = 17, find x.", steps: ["2x + 3 = 17.", "2x = 14.", "x = 7."], answer: "7" },
    ],
  },
  20: {
    introduction:
      "Variable Explorer isolates one slider x and shows every linked stage: input, rule y = 2x + 3, substitution, and output. At x = −2 the chain is 2(−2) + 3 = −1. The dependency graph and value table update together. Ticket totals and recipe yields are the same one-source idea. Changing x in only one box is the labelled fault.",
    definition:
      "A variable explorer binds a single independent symbol x to a number in a closed interval and evaluates each dependent expression with that same x. In this lesson the featured rule is y = 2x + 3.",
    basicIdea:
      "One slider is the only source of x. The graph, the table, and the four-stage strip must agree.",
    howItWorks:
      "Drag x on [−5, 5]. The explorer writes the four stages, highlights the matching table column, and lights the dependency nodes x → 2x → +3 → y.",
    whyItWorks:
      "If any stage used a stale x, the table, the graph, and the output would disagree. Forcing one source makes disagreement visible as a bug, not as three different lessons.",
    worked: [
      { prompt: "Evaluate 3x + 5 when x = −2.", steps: ["x = −2.", "3(−2) + 5 = −6 + 5.", "The value is −1."], answer: "−1" },
      { prompt: "For y = 2x + 3, find y when x = 1.", steps: ["2(1) + 3 = 5.", "The table column x = 1 shows y = 5.", "y = 5."], answer: "5" },
      { prompt: "For y = 2x + 3, what x gives y = 9?", steps: ["2x + 3 = 9.", "2x = 6.", "x = 3."], answer: "3" },
    ],
  },
  21: {
    introduction:
      "Numeric Sliders let x move continuously inside a chosen range with a chosen step. With y = 2x + 3, moving x from 2 to 2.1 raises y from 7 to 7.2. The live substitution strip, pattern chips, and coordinate graph share one x. Volume knobs and sensor readouts behave the same way. Ignoring the step and typing 2.13 when step is 0.1 is the labelled error.",
    definition:
      "A numeric slider is a control that produces a real value x in [min, max] snapped to a positive step h, so x = min + kh for an integer k. Linked outputs must recompute from that snapped x.",
    basicIdea:
      "The handle is the input. Precision is the step. Every linked formula uses the displayed x, not a hidden extra digit.",
    howItWorks:
      "Drag x, edit min/max, or pick step 0.1, 0.5, or 1. The lab snaps x, substitutes into y = 2x + 3, and moves the labelled point (x, y) on the graph.",
    whyItWorks:
      "A continuous-looking slider is still a discrete list of allowed values once a step is set. Snapping keeps the typed box, the handle, and the graph point at the same number.",
    worked: [
      { prompt: "If y = 2x + 3 and x = 2, find y.", steps: ["2(2) + 3 = 7.", "The linked result is 7.", "y = 7."], answer: "7" },
      { prompt: "x increases from 2 to 3. How much does y = 2x + 3 increase?", steps: ["y(2) = 7 and y(3) = 9.", "The change is 2.", "Each +1 in x adds +2 in y."], answer: "2" },
      { prompt: "With step 0.5, which values between 0 and 1 are allowed?", steps: ["Allowed x = 0, 0.5, 1.", "0.25 is not a multiple of the step from 0.", "Three allowed values."], answer: "0, 0.5, 1" },
    ],
  },
  22: {
    introduction:
      "Integer Sliders snap x to whole numbers only. For y = 2x + 3 the staircase visits (0, 3), (1, 5), (2, 7), (3, 9). Previous/next buttons, tick clicks, and the iteration table refuse 2.5. Counting people, floors, and discrete time steps need this snap. Treating the graph as a solid line without the corners is the labelled mistake.",
    definition:
      "An integer slider produces x in a finite set of consecutive integers, here {−5, −4, …, 5}. The featured rule y = 2x + 3 is evaluated only at those integers, and the plot is the staircase through those lattice points.",
    basicIdea:
      "Whole-number inputs make a dotted graph, then a staircase if you connect horizontally and vertically between them.",
    howItWorks:
      "Click a tick, drag until it snaps, or press previous/next. The lab updates substitution, the four-row iteration table, and the labelled point (x, 2x + 3).",
    whyItWorks:
      "You cannot have 2.5 people in a discrete count. The snap and the staircase both encode that restriction, so the algebra and the picture stay in the same set.",
    worked: [
      { prompt: "For y = 2x + 3 and integer x = 3, find y.", steps: ["2(3) + 3 = 9.", "The selected lattice point is (3, 9).", "y = 9."], answer: "9" },
      { prompt: "List y = 2x + 3 for x = 0, 1, 2, 3.", steps: ["x = 0 → 3.", "x = 1 → 5, x = 2 → 7.", "x = 3 → 9."], answer: "3, 5, 7, 9" },
      { prompt: "From x = 4, what is the next allowed slider value if the max is 5?", steps: ["Integer step is 1.", "4 + 1 = 5.", "The next value is 5."], answer: "5" },
    ],
  },
  23: {
    introduction:
      "Angle Sliders turn a handle around the unit circle and report degrees, radians, and sine. At 90° the ray is on the positive y-axis, the sine-wave probe is at 1, and the radian reading is π/2. Common-angle chips jump to 0°, 30°, 45°, 60°, 90°. Gears, clocks, and bearings share this control. Mixing a degree number into a radian sine formula is the labelled trap.",
    definition:
      "An angle slider produces a directed turn θ from the positive x-axis. In this lesson θ lives in [0°, 360°], with radian form θ·π/180, and the linked sine is the y-coordinate of the unit-circle point.",
    basicIdea:
      "The same turn has two numeric names, degrees and radians, and one geometric point on the circle.",
    howItWorks:
      "Drag the ray or a common-angle chip. The lab updates the degree/radian pair, the sine-wave probe, and the coordinate labels so 180° and π sit at (−1, 0).",
    whyItWorks:
      "A full turn is 360° and also 2π radians. The slider is one physical ray; the two readouts are unit conversions of that same ray.",
    worked: [
      { prompt: "Convert 90° to radians.", steps: ["θ_rad = 90 × π/180.", "90/180 = 1/2.", "The radian measure is π/2."], answer: "π/2" },
      { prompt: "Find sin 90°.", steps: ["The unit-circle point is (0, 1).", "Sine is the y-coordinate.", "sin 90° = 1."], answer: "1" },
      { prompt: "Convert π radians to degrees.", steps: ["π radians = 180°.", "The ray points to (−1, 0).", "The degree measure is 180°."], answer: "180°" },
    ],
  },
  24: {
    introduction:
      "Animation Controls play a parameter through frames. A run from 1 to 9 in steps of 2 shows the five frames 1, 3, 5, 7, 9. Play/pause, speed, loop, and timeline seeking keep the same affine samples on the graph. Motion paths and time-based labs need this clock. Counting the last frame twice when looping is the labelled error.",
    definition:
      "An animation control is a discrete time index k = 0, 1, …, n − 1 together with a rule x_k = x_0 + k·h. Playback advances k at a chosen speed; looping returns to k = 0 after the last frame without adding an extra distinct sample.",
    basicIdea:
      "A frame is one stored value. The playhead names the current frame; it does not create new mathematics.",
    howItWorks:
      "Set the start, end, and step, then press play or drag the timeline. The lab retains traces of each affine sample and highlights the current (x_k, y_k).",
    whyItWorks:
      "The number of frames is n = (last − first)/step + 1. That fence-post count is why 1 through 9 by 2 is five frames, not four.",
    worked: [
      { prompt: "An animation runs from 1 to 9 in steps of 2. How many frames?", steps: ["The values are 1, 3, 5, 7, 9.", "n = (9 − 1)/2 + 1 = 5.", "There are 5 frames."], answer: "5" },
      { prompt: "If frame 0 is x = 1 and the step is 2, what is frame 3?", steps: ["x_k = 1 + k·2.", "x_3 = 1 + 6 = 7.", "Frame 3 shows 7."], answer: "7" },
      { prompt: "A 4-frame loop at 2 frames per second lasts how long for one cycle?", steps: ["4 frames / 2 frames per second = 2 seconds.", "Looping restarts at t = 2.", "One cycle is 2 seconds."], answer: "2 s" },
    ],
  },
  25: {
    introduction:
      "Dependent and Independent Objects mark parents that you drag and children that you cannot type. If A and B are free points, the midpoint M = ((x_A + x_B)/2, (y_A + y_B)/2) and the segment length update when either parent moves. From A = (0, 0) and B = (4, 2), M is (2, 1) and length is √20. Locked child fields show the dependency. Editing M directly would break the definition.",
    definition:
      "An independent object has coordinates (or values) chosen by the user. A dependent object is computed from parents by a fixed rule. In this lesson the child segment, midpoint, and Euclidean length are functions of two parent points.",
    basicIdea:
      "Parents move. Children follow. A lock icon means the value is calculated, not typed.",
    howItWorks:
      "Drag or step the two parent points. The lab recomputes the segment, the midpoint formula stack, the length, and the hierarchy diagram so M cannot drift from the parents.",
    whyItWorks:
      "The midpoint formula is an average. If M were independently editable, it would no longer be the midpoint of A and B, so the picture would lie about the definition.",
    worked: [
      { prompt: "A = (0, 0), B = (4, 2). Find the midpoint.", steps: ["M_x = (0 + 4)/2 = 2.", "M_y = (0 + 2)/2 = 1.", "M = (2, 1)."], answer: "(2, 1)" },
      { prompt: "The same points. Find AB.", steps: ["Δx = 4, Δy = 2.", "AB = √(16 + 4) = √20.", "√20 = 2√5."], answer: "√20" },
      { prompt: "If y = x² and x changes from 2 to 4, how does y change?", steps: ["y(2) = 4.", "y(4) = 16.", "Δy = 12."], answer: "y changes from 4 to 16" },
    ],
  },
  26: {
    introduction:
      "Conditional Visibility shows or hides an object from a Boolean test on x. If the rule is x > 2, the number line lights the open ray (2, ∞) and the object is visible only there. Two sliders, six operators, and a before/after proof keep the boundary honest. Dashboard alerts and geometry hide/show rules use the same test. Including the endpoint when the operator is > is the labelled error.",
    definition:
      "A visibility condition is a Boolean expression in one real variable, such as x > 2 or 0 ≤ x ≤ 5. The controlled object is shown exactly on the solution set of that inequality and hidden on the complement.",
    basicIdea:
      "A closed endpoint is a filled dot and a visible object. An open endpoint is a hollow dot and a hidden object at that single x.",
    howItWorks:
      "Edit the operator and the boundary numbers, then move x. The lab shades the truth region, toggles the object, and writes the before/after proof for the current x.",
    whyItWorks:
      "The inequality is a set. Visibility is membership in that set. Keeping the endpoint convention on the number line stops x = 2 from appearing visible when the rule said x > 2.",
    worked: [
      { prompt: "For the rule x > 2, is the object visible at x = 2?", steps: ["x = 2 does not satisfy x > 2.", "The endpoint is open.", "The object is hidden."], answer: "hidden" },
      { prompt: "For 0 ≤ x ≤ 5, is x = 0 visible?", steps: ["0 ≤ 0 ≤ 5 is true.", "The left endpoint is closed.", "The object is visible."], answer: "visible" },
      { prompt: "How many integers x satisfy −1 < x < 4?", steps: ["Integers 0, 1, 2, 3.", "−1 and 4 are excluded.", "There are 4 integers."], answer: "4" },
    ],
  },
  27: {
    introduction:
      "Dynamic Labels print a live string from coordinates. A point at (3, 4) can show the template “P(x, y)” as P(3, 4) and the distance template as 5. Token chips, steppers, and projection toggles keep the printed text equal to the calculated values. Maps and construction captions use this. Leaving a stale “P(3, 4)” after the point moved to (6, 8) is the labelled fault.",
    definition:
      "A dynamic label is a template string with tokens such as x, y, or distance that are replaced by the current numerical values of a linked object. When the object moves, the printed label must change in the same update.",
    basicIdea:
      "The label is not decoration. It is a calculated caption that must match the coordinates used to draw the point.",
    howItWorks:
      "Drag the point or edit x and y. The lab substitutes the chosen template, updates the distance from the origin, and previews coordinate, distance, and projection toggles together.",
    whyItWorks:
      "A caption that does not update is a second, conflicting source of truth. Binding tokens to the same state as the point keeps the picture and the text as one object.",
    worked: [
      { prompt: "Point P = (3, 4). What does the template P(x, y) print?", steps: ["x = 3 and y = 4.", "Replace the tokens.", "The label is P(3, 4)."], answer: "P(3, 4)" },
      { prompt: "The same point. What distance from the origin does the distance token show?", steps: ["r = √(3^2 + 4^2).", "√(9 + 16) = √25.", "The distance is 5."], answer: "5" },
      { prompt: "P moves from (3, 4) to (6, 8). What is the new distance?", steps: ["r = √(36 + 64) = √100.", "The new distance is 10.", "The label must change from 5 to 10."], answer: "10" },
    ],
  },
  28: {
    introduction:
      "Algebraic Input parses a typed function, samples it, and names key points. For f(x) = x^2 − 4 the graph crosses the x-axis at −2 and 2, the y-intercept is −4, and the vertex is (0, −4). Syntax checks, create/edit/clear, and the sampled plot refuse a broken string. Science formulas start the same way. Typing 2x = 4 when a function of x was asked is the labelled mix-up.",
    definition:
      "Algebraic input is a parsed expression f(x) together with a sampling window. Roots are solutions of f(x) = 0, the y-intercept is f(0), and a vertex of a quadratic ax^2 + bx + c is at x = −b/(2a).",
    basicIdea:
      "A well-formed expression becomes a graph. A syntax error is not a graph; it is a message.",
    howItWorks:
      "Type the notation, fix any parse error, then read the sampled curve and the calculated roots, vertex, and intercepts. Create, edit, clear, share, and reset all act on that same parsed object.",
    whyItWorks:
      "Parsing before plotting stops 2x+ from being drawn as if it were 2x. The key-point calculations use the same expression the samples use, so the labels sit on the curve.",
    worked: [
      { prompt: "For f(x) = x^2 − 4, find the roots.", steps: ["x^2 − 4 = 0.", "(x − 2)(x + 2) = 0.", "x = 2 or x = −2."], answer: "x = −2, 2" },
      { prompt: "For the same f, find f(0).", steps: ["f(0) = 0 − 4.", "The y-intercept is −4.", "f(0) = −4."], answer: "−4" },
      { prompt: "For f(x) = x^2 − 4, find the vertex.", steps: ["a = 1, b = 0.", "x_v = 0.", "f(0) = −4, so the vertex is (0, −4)."], answer: "(0, −4)" },
    ],
  },
  29: {
    introduction:
      "Object Redefinition keeps the same object name while swapping its rule. At x = 4, y_old = 2x + 1 = 9 and y_new = 3x − 2 = 10, so the identity “y” jumps by 1. Dual graphs, the dependency tree, and the redefine transaction show dependents updating. Construction software uses this when a circle’s radius definition changes. Making a second object instead of redefining the first is the labelled confusion.",
    definition:
      "Redefinition is a transaction that keeps an object’s identity and outgoing dependents, but replaces its defining expression. After the transaction, every dependent is recomputed from the new rule at the current parameter values.",
    basicIdea:
      "The name stays. The formula changes. Children of that name must refresh.",
    howItWorks:
      "Edit the new rule and confirm redefine. The lab evaluates old and new graphs, writes both values at the current x, and rebuilds the dependency tree so nothing still points at the retired formula.",
    whyItWorks:
      "Identity is what other objects attach to. If redefinition created a new name, those attachments would dangle. Keeping the name and changing the rule is what “the same circle, new radius” means.",
    worked: [
      { prompt: "At x = 4, redefine y from 2x + 1 to 3x − 2. Find both values.", steps: ["y_old = 2(4) + 1 = 9.", "y_new = 3(4) − 2 = 10.", "Δy = 1."], answer: "old y = 9; new y = 10" },
      { prompt: "A circle radius changes from 3 to 5. Find both areas.", steps: ["A_1 = π(3)^2 = 9π.", "A_2 = π(5)^2 = 25π.", "ΔA = 16π."], answer: "9π and 25π" },
      { prompt: "B = A + (2, 1). A is redefined from (1, 2) to (−1, 4). Find new B.", steps: ["B_old = (3, 3).", "A_new = (−1, 4).", "B_new = (1, 5)."], answer: "B = (1, 5)" },
    ],
  },
  30: {
    introduction:
      "Equation Input parses two sides joined by “=”. For 2x + 3 = 11 the equal-operation steps subtract 3 then divide by 2 to get x = 4, and the balance weights plus the dual-graph intersection both show that solution. Implicit multiplication, examples, and a substitution checklist keep 2x written as 2 × x. Typing only 2x + 3 with no equals sign is the labelled error.",
    definition:
      "An equation is a statement L(x) = R(x). A solution is a number that makes both sides equal. A linear equation ax + b = c with a ≠ 0 has the unique solution x = (c − b)/a. Equal operations applied to both sides preserve the solution set.",
    basicIdea:
      "An equation is a balance, not a single expression. Every legal step does the same thing to both pans.",
    howItWorks:
      "Type both sides. The lab inserts implicit multiplication, generates the equal-operation steps, updates the balance weights, and plots both sides so their intersection is the solution.",
    whyItWorks:
      "If both pans change by the same amount, they still match. That is why subtracting 3 from 2x + 3 = 11 and from 11 keeps a true equation whose solution is still x = 4.",
    worked: [
      { prompt: "Solve 2x + 3 = 11.", steps: ["Subtract 3: 2x = 8.", "Divide by 2: x = 4.", "Check: 2(4) + 3 = 11."], answer: "x = 4" },
      { prompt: "Solve 5x − 7 = 18.", steps: ["Add 7: 5x = 25.", "Divide by 5: x = 5.", "Check: 5(5) − 7 = 18."], answer: "x = 5" },
      { prompt: "The graphs of y = 2x + 3 and y = 11 meet where?", steps: ["Set 2x + 3 = 11.", "x = 4.", "The intersection is (4, 11)."], answer: "(4, 11)" },
    ],
  },
};

export function applyCoreWorkspaceHandOverlay(lesson: StrengthenedLesson): StrengthenedLesson {
  const overlay = overlays[Number(lesson.id)];
  if (!overlay) return lesson;
  const workedExamples: WorkedExample[] = [
    ...overlay.worked.map((example, index) => ({
      id: `${lesson.id}-hand-worked-${index + 1}`,
      prompt: example.prompt,
      steps: example.steps,
      answer: example.answer,
    })),
    ...lesson.workedExamples.filter(
      (example) =>
        !overlay.worked.some(
          (item) => item.prompt.trim().toLowerCase() === example.prompt.trim().toLowerCase(),
        ),
    ),
  ];
  return {
    ...lesson,
    introduction: overlay.introduction,
    basicIdea: overlay.basicIdea,
    howItWorks: overlay.howItWorks,
    whyItWorks: overlay.whyItWorks,
    definitions: [
      { id: `${lesson.id}-hand-definition`, statement: overlay.definition },
      ...lesson.definitions,
    ],
    workedExamples,
  };
}

export const coreWorkspaceHandAuthoredLessonIds = Object.keys(overlays).map(Number);

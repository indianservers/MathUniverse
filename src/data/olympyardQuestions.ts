import type { OlympyardDifficulty, OlympyardGradeBand } from "./olympyardTopics";

export type OlympyardQuestionType =
  | "mcq"
  | "visual-mcq"
  | "numeric"
  | "click-match"
  | "pattern"
  | "geometry-marker"
  | "step-fill";

export type OlympyardChoice = {
  id: string;
  label: string;
  correct?: boolean;
  feedback?: string;
  visual?: string;
};

export type OlympyardHint = {
  level: 1 | 2 | 3 | 4;
  title: string;
  body: string;
};

export type OlympyardMatchPair = {
  leftId: string;
  left: string;
  rightId: string;
  right: string;
};

export type OlympyardQuestion = {
  id: string;
  topicId: string;
  gradeBand: OlympyardGradeBand;
  difficulty: OlympyardDifficulty;
  type: OlympyardQuestionType;
  title: string;
  prompt: string;
  visualModel?: string;
  visualState?: Record<string, unknown>;
  choices?: OlympyardChoice[];
  matchingPairs?: OlympyardMatchPair[];
  pattern?: { sequence: Array<string | number>; blankIndex: number };
  stepFill?: { steps: string[]; blanks: string[] };
  answer: string | number | string[] | Record<string, string>;
  tolerance?: number;
  feedback?: {
    correct: string;
    incorrect: string;
  };
  hints: OlympyardHint[];
  solutionSteps: string[];
  commonMistake?: string;
  estimatedSeconds?: number;
};

export type OlympyardValidationResult = {
  correct: boolean;
  feedback: string;
  normalizedAnswer?: unknown;
};

type QuestionSeed = Omit<OlympyardQuestion, "id" | "topicId" | "hints" | "feedback" | "commonMistake" | "estimatedSeconds"> & {
  hintText?: [string, string, string, string];
  correctFeedback?: string;
  incorrectFeedback?: string;
  commonMistake?: string;
  estimatedSeconds?: number;
};

type TopicBank = {
  topicId: string;
  visualModel: string;
  seeds: QuestionSeed[];
};

const topicBanks: TopicBank[] = [
  {
    topicId: "number-sense",
    visualModel: "Place-value cards and number lines",
    seeds: [
      mcq("Place value jump", "Which number is 100 more than 4,286?", "4,386", ["4,296", "5,286", "4,186"], "class-3-4", "warm-up", ["Write 4,286 in columns.", "Add one hundred.", "Keep the other places unchanged.", "The result is 4,386."]),
      numeric("Number-line midpoint", "What number is exactly halfway between 28 and 46?", 37, "class-3-4", "basic", ["Find the total gap: 46 - 28 = 18.", "Half the gap is 9.", "Move 9 from 28.", "The midpoint is 37."], { numberLine: [28, 37, 46] }),
      mcq("Expanded form", "Which expression equals 6,305?", "6,000 + 300 + 5", ["6,000 + 30 + 5", "600 + 300 + 5", "6,000 + 300 + 50"], "class-3-4", "basic", ["Split by place value.", "The hundreds digit is 3.", "The tens digit is 0.", "So 6,305 = 6,000 + 300 + 5."]),
      numeric("Round to nearest ten", "Round 847 to the nearest ten.", 850, "class-3-4", "warm-up", ["Look at the ones digit.", "7 means round up.", "The tens value 840 becomes 850.", "847 rounds to 850."], { numberLine: [840, 847, 850] }),
      pattern("Skip-count tile", "Complete the pattern: 12, 16, 20, __, 28", [12, 16, 20, "__", 28], "24", "class-3-4", "warm-up", ["The pattern adds 4 each time.", "20 + 4 = 24.", "Then 24 + 4 = 28.", "The missing term is 24."]),
      mcq("Compare quickly", "Which number is greatest?", "9,091", ["9,019", "9,090", "9,009"], "class-3-4", "basic", ["Compare thousands first.", "All have 9 thousands.", "Compare hundreds, tens, then ones.", "9,091 is greatest."]),
      numeric("Digit value", "In 72,548, what is the value of the digit 5?", 500, "class-3-4", "warm-up", ["Locate the 5.", "It is in the hundreds place.", "Five hundreds equals 500.", "The value is 500."], { blocks: "5 hundreds" }),
    ],
  },
  {
    topicId: "arithmetic-tricks",
    visualModel: "Operation chips and friendly-number splits",
    seeds: [
      numeric("Make 100", "Compute 98 + 47 by making 100 first.", 145, "class-3-4", "warm-up", ["Move 2 from 47 to 98.", "98 becomes 100.", "47 becomes 45.", "100 + 45 = 145."]),
      numeric("Quarter trick", "What is 25 x 16?", 400, "class-5-6", "basic", ["25 is one quarter of 100.", "16 quarters make 4 hundreds.", "Or 16 x 100 / 4.", "The product is 400."]),
      mcq("Near 50", "What is 49 x 6?", "294", ["304", "284", "245"], "class-5-6", "basic", ["Use 50 x 6 = 300.", "49 is one less than 50.", "Subtract 6 once.", "49 x 6 = 294."]),
      numeric("Double and halve", "Use double-and-half to compute 18 x 25.", 450, "class-5-6", "intermediate", ["Double 25 to 50.", "Halve 18 to 9.", "9 x 50 is easier.", "The answer is 450."]),
      mcq("Digit sum check", "Which answer is impossible for 37 x 6?", "212", ["222", "37 x 3 x 2", "220 + 2"], "class-5-6", "intermediate", ["37 x 6 = 222.", "Use digit sum: 3+7=10, 10 x 6 has digit sum like 60.", "222 has digit sum 6.", "212 has digit sum 5, so it is impossible."]),
      numeric("Subtract from 1000", "Compute 1000 - 376.", 624, "class-5-6", "basic", ["Subtract from 999 first.", "999 - 376 = 623.", "Add 1 back.", "1000 - 376 = 624."]),
      numeric("Square near 20", "Compute 21 x 21.", 441, "class-5-6", "intermediate", ["Use (20 + 1)^2.", "20^2 = 400.", "2 x 20 x 1 = 40.", "400 + 40 + 1 = 441."]),
    ],
  },
  {
    topicId: "fractions-decimals",
    visualModel: "Fraction strips, decimal grids, and equivalent chips",
    seeds: [
      clickMatch("Equivalent fraction match", "Match each fraction to its decimal.", [
        ["half", "1/2", "fifty", "0.5"],
        ["quarter", "1/4", "twentyfive", "0.25"],
        ["threequarter", "3/4", "seventyfive", "0.75"],
      ], "class-5-6", "basic", ["Convert each fraction separately.", "Half is 0.5.", "One quarter is 0.25.", "Three quarters is 0.75."]),
      mcq("Bigger fraction", "Which fraction is larger?", "3/5", ["2/5", "1/5", "0/5"], "class-3-4", "warm-up", ["The denominators are equal.", "Compare numerators only.", "3 parts is more than 2 parts.", "3/5 is larger."]),
      numeric("Decimal to percent", "What percent is 0.35?", 35, "class-5-6", "basic", ["Multiply by 100.", "0.35 x 100 = 35.", "Attach percent.", "The answer is 35%."]),
      numeric("Fraction of a number", "Find 3/4 of 28.", 21, "class-5-6", "intermediate", ["First find one quarter.", "28 / 4 = 7.", "Three quarters is 3 x 7.", "The answer is 21."]),
      mcq("Simplify fraction", "Simplify 18/24.", "3/4", ["2/3", "6/8", "9/12"], "class-5-6", "basic", ["Find a common factor.", "Both 18 and 24 divide by 6.", "18/6 = 3 and 24/6 = 4.", "18/24 = 3/4."]),
      numeric("Add like fractions", "What is 2/9 + 4/9? Give the numerator of the answer.", 6, "class-5-6", "warm-up", ["Denominators match.", "Add only numerators.", "2 + 4 = 6.", "The answer is 6/9, so numerator is 6."]),
      mcq("Decimal order", "Which decimal is smallest?", "0.09", ["0.19", "0.9", "0.90"], "class-5-6", "basic", ["Line decimals by place value.", "0.09 is nine hundredths.", "0.19 is nineteen hundredths.", "0.09 is smallest."]),
    ],
  },
  {
    topicId: "ratios-proportions",
    visualModel: "Ratio bars and double number lines",
    seeds: [
      numeric("Shared ratio", "A red:blue ratio is 2:3. If red is 8, how many blue are there?", 12, "class-5-6", "basic", ["2 ratio parts equal 8.", "One part equals 4.", "Blue has 3 parts.", "3 x 4 = 12."]),
      mcq("Equivalent ratio", "Which ratio is equivalent to 4:6?", "2:3", ["3:2", "8:10", "4:12"], "class-5-6", "warm-up", ["Divide both parts by 2.", "4 becomes 2.", "6 becomes 3.", "So 4:6 = 2:3."]),
      numeric("Recipe scale", "A recipe uses 3 cups flour for 2 cups sugar. How much flour for 8 cups sugar?", 12, "class-5-6", "intermediate", ["2 cups sugar becomes 8.", "Scale factor is 4.", "Multiply flour by 4.", "3 x 4 = 12."]),
      numeric("Unit rate", "A cyclist travels 45 km in 3 hours. What is the speed in km/h?", 15, "class-5-6", "basic", ["Unit rate means per 1 hour.", "Divide distance by time.", "45 / 3 = 15.", "Speed is 15 km/h."]),
      mcq("Proportion check", "Which pair has the same ratio as 5:8?", "15:24", ["10:18", "20:28", "25:35"], "class-7-8", "intermediate", ["Scale both parts by the same number.", "5 x 3 = 15.", "8 x 3 = 24.", "15:24 matches."]),
      numeric("Map scale", "On a map, 1 cm means 5 km. What distance is 7 cm?", 35, "class-5-6", "basic", ["Each centimeter represents 5 km.", "There are 7 centimeters.", "Multiply 7 by 5.", "Distance is 35 km."]),
      numeric("Inverse check", "If 4 workers finish in 6 days, how many worker-days is the job?", 24, "class-7-8", "advanced", ["Worker-days multiply workers by days.", "4 workers for 6 days.", "4 x 6 = 24.", "The job is 24 worker-days."]),
    ],
  },
  {
    topicId: "patterns-sequences",
    visualModel: "Growing tiles and term cards",
    seeds: [
      pattern("Growing by three", "Complete the pattern: 3, 6, 9, __, 15", [3, 6, 9, "__", 15], "12", "class-3-4", "warm-up", ["The pattern adds 3.", "9 + 3 = 12.", "12 + 3 = 15.", "The blank is 12."]),
      numeric("Term rule", "A pattern follows 2n + 1. What is term 6?", 13, "class-5-6", "basic", ["Use n = 6.", "2n + 1 becomes 2 x 6 + 1.", "12 + 1 = 13.", "Term 6 is 13."]),
      pattern("Alternating colors", "Complete: red, blue, red, blue, __", ["red", "blue", "red", "blue", "__"], "red", "class-1-2", "warm-up", ["The colors alternate.", "After blue comes red.", "The first and third are red.", "The blank is red."]),
      numeric("Square numbers", "What comes next: 1, 4, 9, 16, __?", 25, "class-5-6", "basic", ["These are square numbers.", "1^2, 2^2, 3^2, 4^2.", "Next is 5^2.", "The answer is 25."]),
      mcq("Difference pattern", "Which rule fits 5, 10, 20, 40?", "multiply by 2", ["add 5", "add 10", "multiply by 5"], "class-5-6", "intermediate", ["Check each gap.", "10 is double 5.", "20 is double 10.", "Rule is multiply by 2."]),
      numeric("Triangular dots", "The first four triangular dot counts are 1, 3, 6, 10. What is next?", 15, "class-5-6", "intermediate", ["The added dots are 2, 3, 4.", "Next add 5.", "10 + 5 = 15.", "The next count is 15."]),
      stepFill("Find the rule", "Fill the two steps for 7, 11, 15, 19.", ["Common difference", "Next term"], ["add 4", "23"], "class-5-6", "basic", ["Compare neighbors.", "11 - 7 = 4.", "19 + 4 = 23.", "The rule is add 4 and next term is 23."]),
    ],
  },
  {
    topicId: "logical-reasoning",
    visualModel: "Truth grids, clue cards, and elimination tables",
    seeds: [
      mcq("Two clues", "A is taller than B. C is shorter than B. Who is tallest?", "A", ["B", "C", "Cannot decide"], "class-3-4", "warm-up", ["Make a height order.", "A is above B.", "C is below B.", "So A is tallest."]),
      mcq("Truth statement", "If every square is a rectangle, which statement is always true?", "A square has four right angles.", ["Every rectangle is a square.", "A square has five sides.", "No square is a rectangle."], "class-5-6", "basic", ["Use the definition.", "A rectangle has four right angles.", "A square is a special rectangle.", "So a square has four right angles."]),
      clickMatch("Clue match", "Match each child to the only possible fruit.", [["ana", "Ana dislikes apples", "banana", "Banana"], ["ben", "Ben chooses the red fruit", "apple", "Apple"], ["cara", "Cara wants citrus", "orange", "Orange"]], "class-3-4", "basic", ["Use one clue at a time.", "Red fruit is apple.", "Citrus is orange.", "Ana gets banana."]),
      mcq("Odd one out", "Which does not belong: 2, 4, 8, 9, 16?", "9", ["2", "4", "8"], "class-3-4", "warm-up", ["Most numbers are powers of 2.", "2, 4, 8, 16 double each time.", "9 breaks the pattern.", "9 does not belong."]),
      numeric("Grid count", "A 2 by 3 grid has how many small boxes?", 6, "class-3-4", "warm-up", ["Count rows and columns.", "2 rows, 3 columns.", "2 x 3 = 6.", "There are 6 boxes."], { tableValues: [[1, 2, 3], [4, 5, 6]] }),
      mcq("If-then", "If it rains, Maya carries an umbrella. It rains today. What follows?", "Maya carries an umbrella.", ["It cannot rain.", "Maya never carries umbrellas.", "The umbrella causes rain."], "class-5-6", "basic", ["Read the if-then rule.", "The condition happens.", "So the result follows.", "Maya carries an umbrella."]),
      numeric("Case count", "A code has one letter A or B, then one digit 1, 2, or 3. How many codes?", 6, "class-5-6", "intermediate", ["There are 2 letter choices.", "There are 3 digit choices.", "Multiply choices.", "2 x 3 = 6."]),
    ],
  },
  {
    topicId: "number-theory",
    visualModel: "Prime grids, factor trees, and remainder clocks",
    seeds: [
      mcq("Prime check", "Which number is prime?", "29", ["21", "27", "35"], "class-5-6", "basic", ["Check small divisors.", "29 is not divisible by 2, 3, or 5.", "It has only 1 and itself.", "29 is prime."]),
      numeric("Remainder clock", "What is the remainder when 38 is divided by 5?", 3, "class-5-6", "warm-up", ["Find a multiple of 5 near 38.", "35 is 5 x 7.", "38 - 35 = 3.", "The remainder is 3."], { clockMod: 5 }),
      numeric("Factor count", "How many positive factors does 12 have?", 6, "class-5-6", "basic", ["List factors in pairs.", "1, 12; 2, 6; 3, 4.", "That gives 6 factors.", "12 has 6 factors."]),
      mcq("Composite number", "Which number is composite?", "49", ["47", "43", "41"], "class-5-6", "basic", ["Composite means more than two factors.", "49 = 7 x 7.", "The others are prime here.", "49 is composite."]),
      numeric("LCM from primes", "Find LCM of 6 and 8.", 24, "class-5-6", "intermediate", ["6 = 2 x 3.", "8 = 2 x 2 x 2.", "Use highest powers: 2^3 and 3.", "LCM = 24."]),
      numeric("GCD from factors", "Find GCD of 18 and 30.", 6, "class-5-6", "intermediate", ["List common factors.", "18 factors include 1,2,3,6,9,18.", "30 factors include 1,2,3,5,6,10,15,30.", "Greatest common factor is 6."]),
      mcq("Parity rule", "Odd + odd equals what type of number?", "even", ["odd", "prime always", "multiple of 5 always"], "class-3-4", "warm-up", ["Try examples.", "3 + 5 = 8.", "Odd numbers pair leftovers.", "Odd + odd is even."]),
    ],
  },
  {
    topicId: "divisibility-rules",
    visualModel: "Digit cards and remainder checks",
    seeds: [
      mcq("Divisible by 3", "Which card is divisible by 3?", "231", ["124", "415", "502"], "class-5-6", "basic", ["Add digits.", "2 + 3 + 1 = 6.", "6 is divisible by 3.", "231 is divisible by 3."]),
      mcq("Divisible by 5", "Which number is divisible by 5?", "740", ["742", "746", "748"], "class-3-4", "warm-up", ["Check the last digit.", "Divisible by 5 ends in 0 or 5.", "740 ends in 0.", "740 works."]),
      mcq("Divisible by 9", "Which number is divisible by 9?", "729", ["723", "725", "721"], "class-5-6", "basic", ["Add digits.", "7 + 2 + 9 = 18.", "18 is divisible by 9.", "729 works."]),
      numeric("Missing digit", "Find the digit x so 42x is divisible by 3 and x is smallest.", 0, "class-5-6", "intermediate", ["Digit sum is 4 + 2 + x = 6 + x.", "A multiple of 3 is needed.", "6 already works.", "Smallest x is 0."]),
      mcq("Divisible by 4", "Which number is divisible by 4?", "316", ["314", "318", "322"], "class-5-6", "basic", ["Check the last two digits.", "16 is divisible by 4.", "So 316 is divisible by 4.", "316 works."]),
      numeric("Remainder by 10", "What is the remainder when 987 is divided by 10?", 7, "class-3-4", "warm-up", ["Dividing by 10 leaves the ones digit.", "The ones digit is 7.", "980 is divisible by 10.", "Remainder is 7."]),
      mcq("Rule selection", "To test divisibility by 11, what do we compare?", "alternating digit sums", ["last digit only", "number of zeros", "first digit only"], "class-7-8", "advanced", ["The 11 rule alternates digits.", "Subtract alternating sums.", "A multiple of 11 means the difference fits.", "Use alternating digit sums."]),
    ],
  },
  {
    topicId: "factors-multiples",
    visualModel: "Arrays, factor ladders, and multiple tracks",
    seeds: [
      numeric("Array factors", "How many columns are in a 4 by 6 array?", 6, "class-3-4", "warm-up", ["An array is rows by columns.", "4 by 6 means 4 rows and 6 columns.", "Columns count is 6.", "Answer is 6."]),
      numeric("Common multiple", "What is the smallest common multiple of 4 and 6?", 12, "class-5-6", "basic", ["Multiples of 4: 4, 8, 12.", "Multiples of 6: 6, 12.", "First common one is 12.", "LCM is 12."]),
      mcq("Factor of 36", "Which is a factor of 36?", "9", ["8", "10", "14"], "class-5-6", "warm-up", ["A factor divides exactly.", "36 / 9 = 4.", "No remainder.", "9 is a factor."]),
      numeric("Factor pair", "If one factor pair of 42 is 6 and __, what is the missing factor?", 7, "class-3-4", "basic", ["Use multiplication.", "6 x ? = 42.", "42 / 6 = 7.", "The missing factor is 7."]),
      numeric("HCF", "Find the highest common factor of 16 and 24.", 8, "class-5-6", "intermediate", ["Factors of 16 include 1,2,4,8,16.", "Factors of 24 include 1,2,3,4,6,8,12,24.", "Highest common factor is 8.", "Answer is 8."]),
      mcq("Multiple or factor", "In 7 x 8 = 56, what is 56?", "a multiple of 7", ["a factor of 7", "smaller than 7", "not related to 7"], "class-3-4", "basic", ["Products are multiples.", "56 is made from 7 x 8.", "So 56 is a multiple of 7.", "It is not a factor of 7."]),
      numeric("List multiples", "How many multiples of 5 are between 1 and 30 inclusive?", 6, "class-5-6", "basic", ["List them: 5,10,15,20,25,30.", "Count the list.", "There are 6.", "Answer is 6."]),
    ],
  },
  {
    topicId: "geometry-reasoning",
    visualModel: "Marked diagrams and construction clues",
    seeds: [
      geometry("Triangle angle", "Two angles of a triangle are 50° and 60°. Mark the third angle.", "70", ["60", "80", "90"], "class-5-6", "basic", ["Triangle angles total 180°.", "50 + 60 = 110.", "180 - 110 = 70.", "Third angle is 70°."]),
      mcq("Parallel lines", "If two parallel lines are cut by a transversal, corresponding angles are:", "equal", ["always 90°", "always 180°", "unrelated"], "class-7-8", "intermediate", ["Recall the parallel line rule.", "Corresponding positions match.", "Parallel lines keep those angles equal.", "They are equal."]),
      mcq("Square property", "Which property must every square have?", "four equal sides", ["exactly one right angle", "three sides", "no parallel sides"], "class-3-4", "warm-up", ["A square has four sides.", "All four are equal.", "It also has right angles.", "Four equal sides is required."]),
      numeric("Polygon sides", "A hexagon has how many sides?", 6, "class-3-4", "warm-up", ["Hexa means six.", "A hexagon is a six-sided polygon.", "Count six edges.", "Answer is 6."]),
      geometry("Exterior angle", "A triangle has remote interior angles 35° and 80°. What is the exterior angle?", "115", ["100", "125", "45"], "class-7-8", "advanced", ["Exterior angle equals sum of remote interiors.", "35 + 80 = 115.", "So exterior angle is 115°.", "Mark 115°."]),
      mcq("Symmetry line", "Which shape always has exactly 4 lines of symmetry?", "square", ["rectangle that is not a square", "scalene triangle", "parallelogram"], "class-5-6", "basic", ["Think of folds.", "A square folds across two diagonals and two midlines.", "That makes 4.", "Square is correct."]),
      numeric("Right angle sum", "How many degrees are in two right angles?", 180, "class-3-4", "warm-up", ["One right angle is 90°.", "Two right angles means 2 x 90.", "That equals 180°.", "Answer is 180."]),
    ],
  },
  {
    topicId: "area-perimeter",
    visualModel: "Grid tiles, boundary traces, and composite regions",
    seeds: [
      numeric("Rectangle area", "A rectangle is 8 cm long and 3 cm wide. What is its area?", 24, "class-5-6", "basic", ["Use area = length x width.", "Substitute 8 and 3.", "8 x 3 = 24.", "Area is 24 square cm."], { rows: 3, columns: 8 }),
      numeric("Rectangle perimeter", "A rectangle has length 9 and width 4. What is its perimeter?", 26, "class-5-6", "basic", ["Perimeter is boundary length.", "Use 2 x (9 + 4).", "9 + 4 = 13.", "Perimeter is 26."]),
      numeric("Square area", "A square has side 7. What is its area?", 49, "class-5-6", "warm-up", ["Square area is side x side.", "Use 7 x 7.", "7 x 7 = 49.", "Area is 49."]),
      mcq("Area vs perimeter", "Which unit fits area?", "square centimeters", ["centimeters", "degrees", "seconds"], "class-3-4", "warm-up", ["Area covers surface.", "Surface uses square units.", "Length units are for perimeter.", "Use square centimeters."]),
      numeric("Triangle area", "A triangle has base 10 and height 6. What is its area?", 30, "class-7-8", "intermediate", ["Triangle area is half base times height.", "10 x 6 = 60.", "Half of 60 is 30.", "Area is 30."]),
      numeric("Missing side", "A rectangle has area 36 and length 9. What is its width?", 4, "class-5-6", "intermediate", ["Area = length x width.", "36 = 9 x width.", "36 / 9 = 4.", "Width is 4."]),
      numeric("Composite tiles", "A shape has 5 full grid squares and 2 half squares. What is its area in square units?", 6, "class-5-6", "intermediate", ["Two half squares make one full square.", "5 full + 1 full = 6.", "Area is 6.", "Answer is 6 square units."], { blocks: "5 full + 2 halves" }),
    ],
  },
  {
    topicId: "counting-combinatorics",
    visualModel: "Counting trees, slots, and organized lists",
    seeds: [
      numeric("Outfit count", "There are 3 shirts and 2 caps. How many outfits?", 6, "class-5-6", "basic", ["Each shirt pairs with each cap.", "Use multiplication.", "3 x 2 = 6.", "There are 6 outfits."]),
      numeric("Two-digit codes", "How many two-digit codes can be made from digits 1, 2, 3 if repetition is allowed?", 9, "class-5-6", "intermediate", ["There are 3 choices for first digit.", "There are 3 choices for second digit.", "Multiply 3 x 3.", "There are 9 codes."]),
      mcq("No repetition", "How many ways to arrange A, B, C in a row?", "6", ["3", "9", "12"], "class-7-8", "intermediate", ["There are 3 choices first.", "Then 2 choices.", "Then 1 choice.", "3 x 2 x 1 = 6."]),
      numeric("Handshake small", "Four students each shake hands with every other student once. How many handshakes?", 6, "class-7-8", "advanced", ["Pair students, not ordered turns.", "4 choose 2.", "4 x 3 / 2 = 6.", "There are 6 handshakes."]),
      numeric("Path choices", "A robot can choose Up or Right for 4 moves. How many move strings?", 16, "class-7-8", "intermediate", ["Each move has 2 choices.", "There are 4 moves.", "2^4 = 16.", "There are 16 strings."]),
      mcq("Counting principle", "A menu has 2 starters, 3 mains, and 2 drinks. How many full meals?", "12", ["7", "10", "14"], "class-5-6", "basic", ["Choose one from each group.", "Multiply choices.", "2 x 3 x 2 = 12.", "There are 12 meals."]),
      numeric("Select pair", "How many pairs can be chosen from 5 points?", 10, "class-7-8", "advanced", ["A pair uses 2 points.", "Use 5 choose 2.", "5 x 4 / 2 = 10.", "There are 10 pairs."]),
    ],
  },
  {
    topicId: "probability-puzzles",
    visualModel: "Dice grids, spinners, and sample-space bars",
    seeds: [
      numeric("Coin chance", "A fair coin is tossed once. What is the number of possible outcomes?", 2, "class-3-4", "warm-up", ["A coin has heads and tails.", "Those are two outcomes.", "Count them.", "Answer is 2."]),
      mcq("Dice even", "A fair die is rolled. What is the probability of an even number?", "3/6", ["2/6", "1/6", "5/6"], "class-5-6", "basic", ["Even outcomes are 2, 4, 6.", "There are 3 favorable outcomes.", "There are 6 total outcomes.", "Probability is 3/6."]),
      numeric("Spinner sectors", "A spinner has 8 equal sectors, 3 are blue. How many non-blue sectors are there?", 5, "class-5-6", "basic", ["Total sectors are 8.", "Blue sectors are 3.", "Non-blue = 8 - 3.", "Answer is 5."], { spinner: { total: 8, blue: 3 } }),
      mcq("Certain event", "A bag has only red balls. Picking a red ball is:", "certain", ["impossible", "unlikely", "even chance"], "class-3-4", "warm-up", ["All balls are red.", "Every pick gives red.", "That event must happen.", "It is certain."]),
      numeric("Two coins", "Two fair coins are tossed. How many equally likely outcomes are there?", 4, "class-5-6", "intermediate", ["First coin has 2 choices.", "Second coin has 2 choices.", "2 x 2 = 4.", "Outcomes are HH, HT, TH, TT."]),
      mcq("Card color", "A box has 4 green cards and 1 yellow card. Which is more likely?", "green", ["yellow", "same chance", "impossible"], "class-3-4", "warm-up", ["Compare counts.", "There are 4 green and 1 yellow.", "More green means green is more likely.", "Green is correct."]),
      numeric("Sample space count", "A die and a coin are used together. How many combined outcomes?", 12, "class-5-6", "intermediate", ["Die has 6 outcomes.", "Coin has 2 outcomes.", "Multiply 6 x 2.", "There are 12 combined outcomes."]),
    ],
  },
  {
    topicId: "data-interpretation",
    visualModel: "Tables, bar charts, and quick comparison markers",
    seeds: [
      numeric("Table total", "A table shows apples: 12, bananas: 9, oranges: 6. How many fruits total?", 27, "class-3-4", "warm-up", ["Add all entries.", "12 + 9 = 21.", "21 + 6 = 27.", "Total is 27."], { tableValues: { apples: 12, bananas: 9, oranges: 6 } }),
      mcq("Highest bar", "In a bar chart, Red = 8, Blue = 13, Green = 10. Which is highest?", "Blue", ["Red", "Green", "All same"], "class-3-4", "warm-up", ["Compare the bar heights.", "13 is greater than 10 and 8.", "Blue has 13.", "Blue is highest."]),
      numeric("Range", "Scores are 7, 12, 9, 15. What is the range?", 8, "class-5-6", "basic", ["Range = highest - lowest.", "Highest is 15.", "Lowest is 7.", "15 - 7 = 8."]),
      numeric("Mean", "Find the mean of 4, 6, 8.", 6, "class-5-6", "basic", ["Add the numbers.", "4 + 6 + 8 = 18.", "Divide by 3.", "Mean is 6."]),
      mcq("Misleading graph", "A bar chart starts at 90 instead of 0. What should you check?", "the axis scale", ["the title only", "the color only", "the paper size"], "class-7-8", "intermediate", ["Graphs can exaggerate differences.", "The vertical axis matters.", "Check where it starts.", "Check the axis scale."]),
      numeric("Difference from chart", "Class A collected 34 books and Class B collected 26. How many more did A collect?", 8, "class-3-4", "basic", ["Compare by subtraction.", "34 - 26 = 8.", "A collected 8 more.", "Answer is 8."]),
      mcq("Median", "What is the median of 3, 9, 5?", "5", ["3", "9", "17"], "class-5-6", "intermediate", ["Order the values.", "3, 5, 9.", "The middle value is 5.", "Median is 5."]),
    ],
  },
  {
    topicId: "clock-calendar",
    visualModel: "Clock faces, week cycles, and modular calendars",
    seeds: [
      numeric("Clock angle", "At 3:00, what is the smaller angle between the hands?", 90, "class-5-6", "basic", ["At 3:00 the minute hand is at 12.", "The hour hand is at 3.", "Each hour mark is 30°.", "3 marks make 90°."]),
      mcq("Week cycle", "If today is Monday, what day is 10 days later?", "Thursday", ["Wednesday", "Friday", "Sunday"], "class-3-4", "basic", ["A week repeats every 7 days.", "10 days later is 3 days after Monday.", "Tuesday, Wednesday, Thursday.", "Answer is Thursday."]),
      numeric("Minutes after", "What time is 45 minutes after 2:20? Give the hour.", 3, "class-3-4", "warm-up", ["20 + 45 = 65 minutes.", "That is 1 hour and 5 minutes.", "2:20 becomes 3:05.", "The hour is 3."]),
      numeric("Calendar remainder", "What is the remainder when 31 days are divided into weeks?", 3, "class-5-6", "basic", ["A week has 7 days.", "28 days make 4 weeks.", "31 - 28 = 3.", "Remainder is 3 days."]),
      mcq("Quarter hour", "Which time is a quarter past 6?", "6:15", ["6:45", "6:30", "5:45"], "class-3-4", "warm-up", ["A quarter hour is 15 minutes.", "Past means after the hour.", "Quarter past 6 is 6:15.", "Answer is 6:15."]),
      numeric("Clock marks", "How many degrees are between neighboring hour marks on a clock?", 30, "class-5-6", "basic", ["A full clock is 360°.", "There are 12 hour gaps.", "360 / 12 = 30.", "Each gap is 30°."]),
      numeric("Elapsed time", "A test starts at 9:10 and ends at 9:55. How many minutes long is it?", 45, "class-3-4", "basic", ["Same hour, so subtract minutes.", "55 - 10 = 45.", "The test is 45 minutes.", "Answer is 45."]),
    ],
  },
  {
    topicId: "algebraic-thinking",
    visualModel: "Balance scales, boxes, and rule machines",
    seeds: [
      numeric("Mystery box", "x + 7 = 15. What is x?", 8, "class-5-6", "basic", ["Undo +7 by subtracting 7.", "15 - 7 = 8.", "So x = 8.", "Check: 8 + 7 = 15."]),
      mcq("Expression value", "If n = 4, what is 3n + 2?", "14", ["9", "12", "18"], "class-5-6", "basic", ["Substitute n = 4.", "3n means 3 x 4.", "12 + 2 = 14.", "Value is 14."]),
      numeric("Balance scale", "Two boxes and 6 weigh 20. If boxes are equal, what does one box weigh?", 7, "class-5-6", "intermediate", ["Remove 6 from both sides.", "20 - 6 = 14.", "Two boxes weigh 14.", "One box weighs 7."]),
      pattern("Rule machine", "A rule adds 5. Complete: input 2 gives 7, input 4 gives 9, input 6 gives __.", [7, 9, "__"], "11", "class-3-4", "warm-up", ["The output is input + 5.", "Use input 6.", "6 + 5 = 11.", "The blank is 11."]),
      mcq("Like terms", "Which term is like 5x?", "2x", ["2y", "5", "x^2"], "class-7-8", "intermediate", ["Like terms have the same variable part.", "5x and 2x both have x.", "2y and x^2 differ.", "2x is like 5x."]),
      numeric("Equation step", "Solve 4x = 28.", 7, "class-5-6", "basic", ["Undo multiplication by 4.", "Divide 28 by 4.", "28 / 4 = 7.", "x = 7."]),
      stepFill("Two-step equation", "Fill the solving steps for 2x + 3 = 11.", ["Subtract 3", "Divide by 2"], ["8", "4"], "class-7-8", "intermediate", ["First undo +3.", "11 - 3 = 8.", "Then divide by 2.", "x = 4."]),
    ],
  },
  {
    topicId: "word-problems",
    visualModel: "Story boards, bar models, and answer checks",
    seeds: [
      numeric("Shared candies", "Riya has 18 candies and gives 5 to a friend. How many remain?", 13, "class-3-4", "warm-up", ["Giving away means subtract.", "18 - 5 = 13.", "13 remain.", "Answer is 13."]),
      numeric("Equal groups", "24 pencils are packed equally into 6 boxes. How many in each box?", 4, "class-3-4", "basic", ["Equal groups means divide.", "24 / 6 = 4.", "Each box has 4.", "Answer is 4."]),
      numeric("More than", "A book has 48 pages. Tara reads 17. How many pages are left?", 31, "class-3-4", "basic", ["Left means total minus read.", "48 - 17 = 31.", "31 pages remain.", "Answer is 31."]),
      mcq("Choose operation", "A packet costs 12 rupees. What is the cost of 5 packets?", "60", ["17", "7", "50"], "class-3-4", "basic", ["Repeated equal cost means multiply.", "12 x 5 = 60.", "Cost is 60 rupees.", "Answer is 60."]),
      numeric("Age puzzle", "A father is 32 years older than his son. The son is 9. How old is the father?", 41, "class-5-6", "warm-up", ["Older means add.", "32 + 9 = 41.", "Father is 41.", "Answer is 41."]),
      numeric("Two-step story", "A shop sells 8 notebooks in the morning and 11 in the evening. Each costs 10 rupees. What is the total money?", 190, "class-5-6", "intermediate", ["First find total notebooks.", "8 + 11 = 19.", "Each is 10 rupees.", "19 x 10 = 190."]),
      mcq("Hidden comparison", "A rope is 30 m. A piece of 12 m is cut off. What question is answered by 30 - 12?", "length left", ["total before cutting", "number of pieces always", "cost per meter"], "class-5-6", "basic", ["Subtraction shows what remains.", "30 is original length.", "12 is removed.", "30 - 12 gives length left."]),
    ],
  },
  {
    topicId: "mixed-mock-test",
    visualModel: "Mixed challenge queue and review trail",
    seeds: [
      mcq("Mixed review: divisibility", "Which number is divisible by 2 and 5?", "40", ["42", "45", "47"], "class-5-6", "warm-up", ["Divisible by 2 means even.", "Divisible by 5 means ends in 0 or 5.", "40 ends in 0 and is even.", "40 works."]),
      numeric("Mixed review: ratio", "If 2 pens cost 18 rupees, what do 5 pens cost at the same rate?", 45, "class-5-6", "basic", ["One pen costs 9.", "Five pens cost 5 x 9.", "5 x 9 = 45.", "Answer is 45."]),
      numeric("Mixed review: area", "A square garden has side 6 m. What is its area?", 36, "class-5-6", "basic", ["Square area is side x side.", "6 x 6 = 36.", "Area is 36 square m.", "Answer is 36."]),
      pattern("Mixed review: sequence", "Complete: 2, 5, 8, __, 14", [2, 5, 8, "__", 14], "11", "class-5-6", "warm-up", ["The pattern adds 3.", "8 + 3 = 11.", "11 + 3 = 14.", "Blank is 11."]),
      mcq("Mixed review: probability", "A die is rolled. Which result is impossible?", "7", ["1", "4", "6"], "class-5-6", "warm-up", ["A normal die has 1 to 6.", "7 is not on the die.", "So 7 is impossible.", "Answer is 7."]),
      numeric("Mixed review: algebra", "Solve x - 4 = 10.", 14, "class-5-6", "basic", ["Undo -4 by adding 4.", "10 + 4 = 14.", "x = 14.", "Check: 14 - 4 = 10."]),
      mcq("Mixed review: logic", "All roses are flowers. Some flowers are yellow. What must be true?", "All roses are flowers.", ["All flowers are roses.", "All roses are yellow.", "No flowers are roses."], "class-7-8", "intermediate", ["Use only guaranteed facts.", "The first sentence directly says all roses are flowers.", "Yellow applies only to some flowers.", "Only all roses are flowers must be true."]),
    ],
  },
];

export const olympyardQuestions: OlympyardQuestion[] = topicBanks.flatMap((bank) =>
  bank.seeds.map((seed, index) => enrichQuestion(bank, seed, index + 1)),
);

export const sampleOlympyardQuestions = olympyardQuestions.slice(0, 5);

export function questionsForOlympyardTopic(topicId: string | null | undefined) {
  if (!topicId) return olympyardQuestions;
  return olympyardQuestions.filter((question) => question.topicId === topicId);
}

export function filterOlympyardQuestions(
  questions: OlympyardQuestion[],
  grade: "all" | OlympyardGradeBand,
  difficulty: "all" | OlympyardDifficulty,
) {
  return questions.filter((question) =>
    (grade === "all" || question.gradeBand === grade) &&
    (difficulty === "all" || question.difficulty === difficulty),
  );
}

export function olympyardQuestionCount(topicId: string) {
  return questionsForOlympyardTopic(topicId).length;
}

export function olympyardTopicQuestionCounts() {
  return olympyardQuestions.reduce<Record<string, number>>((counts, question) => {
    counts[question.topicId] = (counts[question.topicId] ?? 0) + 1;
    return counts;
  }, {});
}

export function validateOlympyardAnswer(question: OlympyardQuestion, userAnswer: unknown): OlympyardValidationResult {
  if (question.type === "numeric") return validateNumeric(question, userAnswer);
  if (question.type === "mcq" || question.type === "visual-mcq" || question.type === "geometry-marker") return validateChoiceLike(question, userAnswer);
  if (question.type === "click-match") return validateMatchPairs(question, userAnswer);
  if (question.type === "step-fill") return validateListAnswer(question, userAnswer);
  if (question.type === "pattern") return validateExact(question, userAnswer);
  return validateExact(question, userAnswer);
}

export function revealNextHintCount(current: number, total: number) {
  return Math.min(Math.max(0, current) + 1, Math.max(0, total));
}

export function solutionRevealState(revealed: boolean, attempted: boolean, requested = false) {
  return revealed || requested || attempted;
}

export function hasOnlyFiniteQuestionValues(value: unknown): boolean {
  if (typeof value === "number") return Number.isFinite(value);
  if (Array.isArray(value)) return value.every(hasOnlyFiniteQuestionValues);
  if (value && typeof value === "object") return Object.values(value).every(hasOnlyFiniteQuestionValues);
  return true;
}

function enrichQuestion(bank: TopicBank, seed: QuestionSeed, index: number): OlympyardQuestion {
  const id = `oy-${bank.topicId}-${String(index).padStart(2, "0")}`;
  const visualModel = seed.visualModel ?? bank.visualModel;
  const hints = seed.hintText
    ? defaultHints(...seed.hintText)
    : defaultHints(
      `Use the ${visualModel.toLowerCase()} to organize the information.`,
      "Name the operation or rule before calculating.",
      seed.solutionSteps[0],
      seed.solutionSteps.at(-1) ?? "Check the result against the prompt.",
    );
  return {
    ...seed,
    id,
    topicId: bank.topicId,
    visualModel,
    hints,
    feedback: {
      correct: seed.correctFeedback ?? "Correct. Your reasoning matches the visual model.",
      incorrect: seed.incorrectFeedback ?? "Not yet. Use one hint, then compare your answer with the visual structure.",
    },
    commonMistake: seed.commonMistake ?? "A common mistake is using the first visible operation without checking what the question is asking.",
    estimatedSeconds: seed.estimatedSeconds ?? secondsFor(seed.difficulty),
  };
}

function mcq(
  title: string,
  prompt: string,
  answer: string,
  distractors: string[],
  gradeBand: OlympyardGradeBand,
  difficulty: OlympyardDifficulty,
  solutionSteps: string[],
  visualState?: Record<string, unknown>,
): QuestionSeed {
  const choices = [answer, ...distractors].map((label, index) => ({
    id: String.fromCharCode(97 + index),
    label,
    correct: index === 0,
    feedback: index === 0 ? "This matches the worked reasoning." : "This choice misses one condition in the prompt.",
  }));
  return { type: "mcq", title, prompt, gradeBand, difficulty, choices, answer: "a", solutionSteps, visualState };
}

function geometry(title: string, prompt: string, answer: string, distractors: string[], gradeBand: OlympyardGradeBand, difficulty: OlympyardDifficulty, solutionSteps: string[]): QuestionSeed {
  return { ...mcq(title, prompt, answer, distractors, gradeBand, difficulty, solutionSteps, { geometryDiagram: title }), type: "geometry-marker" };
}

function numeric(
  title: string,
  prompt: string,
  answer: number,
  gradeBand: OlympyardGradeBand,
  difficulty: OlympyardDifficulty,
  solutionSteps: string[],
  visualState?: Record<string, unknown>,
): QuestionSeed {
  return { type: "numeric", title, prompt, gradeBand, difficulty, answer, tolerance: 0, solutionSteps, visualState };
}

function pattern(
  title: string,
  prompt: string,
  sequence: Array<string | number>,
  answer: string,
  gradeBand: OlympyardGradeBand,
  difficulty: OlympyardDifficulty,
  solutionSteps: string[],
): QuestionSeed {
  return {
    type: "pattern",
    title,
    prompt,
    gradeBand,
    difficulty,
    pattern: { sequence, blankIndex: sequence.findIndex((item) => item === "__") },
    answer,
    solutionSteps,
    visualState: { patternSequence: sequence.join(", ") },
  };
}

function clickMatch(
  title: string,
  prompt: string,
  pairs: Array<[string, string, string, string]>,
  gradeBand: OlympyardGradeBand,
  difficulty: OlympyardDifficulty,
  solutionSteps: string[],
): QuestionSeed {
  const matchingPairs = pairs.map(([leftId, left, rightId, right]) => ({ leftId, left, rightId, right }));
  const answer = Object.fromEntries(matchingPairs.map((pair) => [pair.leftId, pair.rightId]));
  return { type: "click-match", title, prompt, gradeBand, difficulty, matchingPairs, answer, solutionSteps, visualState: { matchPairs: pairs.length } };
}

function stepFill(
  title: string,
  prompt: string,
  steps: string[],
  blanks: string[],
  gradeBand: OlympyardGradeBand,
  difficulty: OlympyardDifficulty,
  solutionSteps: string[],
): QuestionSeed {
  return { type: "step-fill", title, prompt, gradeBand, difficulty, stepFill: { steps, blanks }, answer: blanks, solutionSteps, visualState: { steps: steps.length } };
}

function secondsFor(difficulty: OlympyardDifficulty) {
  if (difficulty === "warm-up") return 30;
  if (difficulty === "basic") return 45;
  if (difficulty === "intermediate") return 70;
  if (difficulty === "advanced") return 100;
  return 40;
}

function validateNumeric(question: OlympyardQuestion, userAnswer: unknown): OlympyardValidationResult {
  const value = typeof userAnswer === "number" ? userAnswer : Number(String(userAnswer ?? "").trim());
  const expected = Number(question.answer);
  const tolerance = question.tolerance ?? 0.001;
  const correct = Number.isFinite(value) && Number.isFinite(expected) && Math.abs(value - expected) <= tolerance;
  return result(question, correct, value);
}

function validateChoiceLike(question: OlympyardQuestion, userAnswer: unknown): OlympyardValidationResult {
  const expected = Array.isArray(question.answer)
    ? normalizeStringSet(question.answer)
    : normalizeStringSet([String(question.answer)]);
  const received = normalizeStringSet(Array.isArray(userAnswer) ? userAnswer.map(String) : [String(userAnswer ?? "")]);
  return result(question, sameSet(expected, received), Array.from(received));
}

function validateMatchPairs(question: OlympyardQuestion, userAnswer: unknown): OlympyardValidationResult {
  const expected = normalizeRecord(question.answer);
  const received = normalizeRecord(userAnswer);
  const correct = Object.keys(expected).length > 0 &&
    Object.keys(expected).every((key) => expected[key] === received[key]) &&
    Object.keys(received).every((key) => key in expected);
  return result(question, correct, received);
}

function validateListAnswer(question: OlympyardQuestion, userAnswer: unknown): OlympyardValidationResult {
  const expected = Array.isArray(question.answer) ? question.answer.map(normalizeText) : [normalizeText(question.answer)];
  const received = Array.isArray(userAnswer) ? userAnswer.map(normalizeText) : [normalizeText(userAnswer)];
  return result(question, expected.length === received.length && expected.every((item, index) => item === received[index]), received);
}

function validateExact(question: OlympyardQuestion, userAnswer: unknown): OlympyardValidationResult {
  const expected = Array.isArray(question.answer) ? question.answer.map(normalizeText) : [normalizeText(question.answer)];
  const received = Array.isArray(userAnswer) ? userAnswer.map(normalizeText) : [normalizeText(userAnswer)];
  return result(question, expected.length === received.length && expected.every((item, index) => item === received[index]), userAnswer);
}

function normalizeRecord(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [normalizeText(key), normalizeText(entry)]));
}

function normalizeStringSet(values: string[]) {
  return new Set(values.map(normalizeText).filter(Boolean));
}

function normalizeText(value: unknown) {
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function sameSet(left: Set<string>, right: Set<string>) {
  return left.size === right.size && Array.from(left).every((item) => right.has(item));
}

function result(question: OlympyardQuestion, correct: boolean, normalizedAnswer: unknown): OlympyardValidationResult {
  return {
    correct,
    feedback: correct
      ? question.feedback?.correct ?? "Correct. Your reasoning matches the target."
      : question.feedback?.incorrect ?? "Not yet. Try one hint and check the visual again.",
    normalizedAnswer,
  };
}

function defaultHints(visual: string, concept: string, method: string, solution: string): OlympyardHint[] {
  return [
    { level: 1, title: "Visual nudge", body: visual },
    { level: 2, title: "Concept nudge", body: concept },
    { level: 3, title: "Method hint", body: method },
    { level: 4, title: "Solution step", body: solution },
  ];
}

export type QuizDifficulty = "Easy" | "Medium" | "Hard";

export type QuizQuestion = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty: QuizDifficulty;
};

type Fact = {
  prompt: string;
  answer: string;
  distractors: string[];
  explanation: string;
  difficulty?: QuizDifficulty;
};

type NumericPattern = {
  label: string;
  difficulty?: QuizDifficulty;
  build: (variant: number) => Omit<QuizQuestion, "id" | "topic" | "difficulty"> & { difficulty?: QuizDifficulty };
};

type ConceptBank = {
  topic: string;
  slug: string;
  difficulty: QuizDifficulty;
  facts: Fact[];
  numeric: NumericPattern[];
};

const optionIndex = (seed: number) => seed % 4;
const round = (value: number, digits = 2) => Number(value.toFixed(digits));
const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);

function placeAnswer(answer: string, distractors: string[], seed: number) {
  const unique = Array.from(new Set(distractors.filter((item) => item !== answer)));
  const options = unique.slice(0, 3);
  while (options.length < 3) options.push(`Not ${answer}`);
  const index = optionIndex(seed);
  options.splice(index, 0, answer);
  return { options, correctAnswerIndex: index };
}

function factQuestion(bank: ConceptBank, fact: Fact, index: number, variant: number): QuizQuestion {
  const stems = [
    `In ${bank.topic}, ${fact.prompt}`,
    `Choose the correct statement for ${bank.topic}: ${fact.prompt}`,
    `${fact.prompt} This belongs to which correct idea?`,
  ];
  const { options, correctAnswerIndex } = placeAnswer(fact.answer, fact.distractors, index + variant);
  return {
    id: `${bank.slug}-fact-${index}-${variant}`,
    topic: bank.topic,
    question: stems[variant % stems.length],
    options,
    correctAnswerIndex,
    explanation: fact.explanation,
    difficulty: fact.difficulty ?? bank.difficulty,
  };
}

function numericQuestion(bank: ConceptBank, pattern: NumericPattern, index: number, variant: number): QuizQuestion {
  const question = pattern.build(variant);
  return {
    id: `${bank.slug}-calc-${index}-${variant}`,
    topic: bank.topic,
    difficulty: question.difficulty ?? pattern.difficulty ?? bank.difficulty,
    ...question,
  };
}

const banks: ConceptBank[] = [
  {
    topic: "Number Systems",
    slug: "num",
    difficulty: "Easy",
    facts: [
      { prompt: "a rational number is best described as", answer: "a number expressible as p/q with q not zero", distractors: ["a number that never has a decimal form", "only a positive counting number", "only a square root"], explanation: "Rational numbers are ratios of integers p and q where q is not zero." },
      { prompt: "an irrational decimal expansion is", answer: "non-terminating and non-repeating", distractors: ["terminating only", "always negative", "always a fraction with denominator 10"], explanation: "Irrational numbers cannot be written as p/q and their decimals do not terminate or repeat." },
      { prompt: "the hierarchy N subset W subset Z subset Q subset R means", answer: "natural numbers sit inside larger real-number sets", distractors: ["irrationals are outside real numbers", "integers exclude whole numbers", "rationals exclude integers"], explanation: "Natural, whole, integer, and rational numbers are nested inside the real numbers." },
      { prompt: "a terminating decimal in lowest terms has denominator factors", answer: "only 2 and/or 5", distractors: ["only 3 and/or 7", "any prime number", "no prime factors"], explanation: "Base 10 uses 2 x 5, so only factors 2 and 5 terminate." },
      { prompt: "between two distinct real numbers there are", answer: "infinitely many rational and irrational numbers", distractors: ["no other numbers", "only integers", "only one midpoint"], explanation: "The real line is dense: more numbers lie between any two different real values." },
    ],
    numeric: [
      { label: "fraction-simplify", build: (v) => { const a = 6 + v; const b = 12 + 2 * v; const g = gcd(a, b); const answer = `${a / g}/${b / g}`; return { question: `Simplify ${a}/${b}.`, ...placeAnswer(answer, [`${a}/${b}`, `${b / g}/${a / g}`, `${a + g}/${b}`], v), explanation: `Divide numerator and denominator by gcd ${g}.` }; } },
      { label: "decimal", build: (v) => { const q = [2, 4, 5, 8, 10][v % 5]; const p = 1 + (v % (q - 1)); const answer = round(p / q, 4).toString(); return { question: `Convert ${p}/${q} to decimal.`, ...placeAnswer(answer, [round((p + 1) / q, 4).toString(), round(p / (q + 1), 4).toString(), `${p}.${q}`], v + 2), explanation: `Compute p divided by q: ${p} / ${q} = ${answer}.` }; } },
      { label: "perfect-square", build: (v) => { const n = 2 + v; const value = n * n; return { question: `sqrt(${value}) is classified as`, ...placeAnswer("rational", ["irrational", "not real", "undefined"], v + 3), explanation: `${value} is a perfect square, so its square root is integer ${n}.` }; } },
      { label: "midpoint", build: (v) => { const a = -3 + (v % 7); const b = a + 2 + (v % 4); const answer = round((a + b) / 2, 2).toString(); return { question: `Find one number between ${a} and ${b} using the midpoint.`, ...placeAnswer(answer, [String(a + b), String(b - a), String(a - b)], v + 4), explanation: `The midpoint is (${a}+${b})/2 = ${answer}.` }; } },
      { label: "integer-order", build: (v) => { const a = -8 + v; const b = a + 5; return { question: `Which number is greater: ${a} or ${b}?`, ...placeAnswer(String(b), [String(a), "They are equal", "Cannot compare"], v + 5), explanation: `On the number line, ${b} is to the right of ${a}.` }; } },
    ],
  },
  {
    topic: "Algebra",
    slug: "alg",
    difficulty: "Medium",
    facts: [
      { prompt: "in y = mx + c, m represents", answer: "slope", distractors: ["area", "radius", "root"], explanation: "m is the constant rate of change of a line." },
      { prompt: "the graph of y = ax^2 + bx + c is a", answer: "parabola", distractors: ["circle", "straight line", "histogram"], explanation: "A quadratic function graphs as a parabola." },
      { prompt: "a negative discriminant means", answer: "no real roots", distractors: ["two real roots", "one repeated real root", "infinitely many roots"], explanation: "If b^2 - 4ac is negative, roots are complex." },
      { prompt: "the solution of two linear equations appears visually as", answer: "the intersection point of two lines", distractors: ["only the y-axis", "the larger slope", "the area under a curve"], explanation: "A shared point satisfies both equations." },
      { prompt: "factoring rewrites an expression as", answer: "a product of simpler factors", distractors: ["a decimal expansion only", "a derivative", "a probability"], explanation: "Factoring converts sums into products where possible." },
    ],
    numeric: [
      { label: "linear-evaluate", build: (v) => { const m = 2 + (v % 4); const c = -3 + (v % 5); const x = 1 + (v % 6); const y = m * x + c; return { question: `For y=${m}x+${c}, find y when x=${x}.`, ...placeAnswer(String(y), [String(y + m), String(y - c), String(m + c)], v), explanation: `Substitute x=${x}: y=${m}(${x})+${c}=${y}.` }; } },
      { label: "solve-linear", build: (v) => { const x = 2 + (v % 9); const a = 2 + (v % 5); const b = 1 + (v % 4); const rhs = a * x + b; return { question: `Solve ${a}x + ${b} = ${rhs}.`, ...placeAnswer(String(x), [String(x + 1), String(rhs - b), String(a)], v + 1), explanation: `Subtract ${b}, then divide by ${a}; x=${x}.` }; } },
      { label: "quadratic-root", build: (v) => { const r1 = 1 + (v % 5); const r2 = r1 + 2; const sum = r1 + r2; const product = r1 * r2; return { question: `For x^2 - ${sum}x + ${product}=0, one root is ${r1}. What is the other?`, ...placeAnswer(String(r2), [String(sum), String(product), String(r1 - r2)], v + 2), explanation: `The roots multiply to ${product} and add to ${sum}, so the other root is ${r2}.` }; } },
      { label: "ap", build: (v) => { const a = 3 + (v % 5); const d = 2 + (v % 4); const n = 4 + (v % 8); const answer = a + (n - 1) * d; return { question: `In an arithmetic progression with first term ${a} and difference ${d}, find a_${n}.`, ...placeAnswer(String(answer), [String(answer + d), String(a * n), String(d * n)], v + 3), explanation: `a_n=a+(n-1)d=${a}+${n - 1}(${d})=${answer}.` }; } },
      { label: "gp", build: (v) => { const a = 2 + (v % 3); const r = 2 + (v % 3); const n = 3 + (v % 4); const answer = a * r ** (n - 1); return { question: `In GP with first term ${a} and ratio ${r}, find term ${n}.`, ...placeAnswer(String(answer), [String(answer * r), String(a + (n - 1) * r), String(a * r)], v + 4), explanation: `a_n=ar^(n-1)=${a}x${r}^${n - 1}=${answer}.` }; } },
    ],
  },
  {
    topic: "Functions & Graphs",
    slug: "fun",
    difficulty: "Medium",
    facts: [
      { prompt: "the domain of a function is", answer: "the set of allowed input values", distractors: ["the set of slopes only", "only the maximum value", "the graph color"], explanation: "Domain lists all input values for which the function is defined." },
      { prompt: "the range of a function is", answer: "the set of output values", distractors: ["only x-values", "the number of axes", "the period only"], explanation: "Range describes possible y-values." },
      { prompt: "a vertical line test checks whether", answer: "a graph represents a function", distractors: ["a graph has area", "a number is prime", "a matrix is invertible"], explanation: "A vertical line should meet a function graph at most once." },
      { prompt: "shifting f(x) upward by k gives", answer: "f(x)+k", distractors: ["f(x-k)", "kf(x)", "f(kx)"], explanation: "Adding outside the function moves the graph vertically." },
      { prompt: "an even function has symmetry about", answer: "the y-axis", distractors: ["the x-axis", "the origin only", "the line y=x only"], explanation: "Even functions satisfy f(-x)=f(x)." },
    ],
    numeric: [
      { label: "evaluate", build: (v) => { const x = -3 + (v % 7); const y = x * x + 2; return { question: `If f(x)=x^2+2, find f(${x}).`, ...placeAnswer(String(y), [String(x + 2), String(2 * x), String(y + 2)], v), explanation: `f(${x})=${x}^2+2=${y}.` }; } },
      { label: "slope", build: (v) => { const x1 = v % 5; const y1 = 2 * x1 + 1; const x2 = x1 + 2; const y2 = 2 * x2 + 1; return { question: `Find slope through (${x1},${y1}) and (${x2},${y2}).`, ...placeAnswer("2", ["1", "3", "0"], v + 1), explanation: `Slope = (${y2}-${y1})/(${x2}-${x1}) = 2.` }; } },
      { label: "intercept", build: (v) => { const c = -4 + (v % 9); return { question: `What is the y-intercept of y=3x+${c}?`, ...placeAnswer(String(c), ["3", String(-c), "0"], v + 2), explanation: "The y-intercept is the value when x=0." }; } },
      { label: "transform", build: (v) => { const k = 1 + (v % 6); return { question: `The graph y=f(x)+${k} is shifted`, ...placeAnswer(`${k} units up`, [`${k} units right`, `${k} units down`, `${k} times wider`], v + 3), explanation: "Adding outside f shifts the graph upward." }; } },
      { label: "domain-radical", build: (v) => { const a = -5 + (v % 9); return { question: `For f(x)=sqrt(x-${a}), the domain condition is`, ...placeAnswer(`x >= ${a}`, [`x <= ${a}`, `x != ${a}`, "all real numbers"], v + 4), explanation: "The expression inside a square root must be non-negative." }; } },
    ],
  },
  {
    topic: "Geometry",
    slug: "geo",
    difficulty: "Easy",
    facts: [
      { prompt: "Pythagoras theorem states", answer: "a^2 + b^2 = c^2 in a right triangle", distractors: ["A=pi r^2", "V=s^3", "sin theta = x"], explanation: "The square on the hypotenuse equals the sum of squares on the legs." },
      { prompt: "angles in a Euclidean triangle sum to", answer: "180 degrees", distractors: ["90 degrees", "270 degrees", "360 degrees"], explanation: "Every Euclidean triangle has angle sum 180 degrees." },
      { prompt: "perimeter means", answer: "total boundary length", distractors: ["inside area only", "center point", "vertical height only"], explanation: "Perimeter is the distance around a shape." },
      { prompt: "circle area is", answer: "pi r^2", distractors: ["2 pi r", "4 pi r^2", "s^2"], explanation: "Circle area depends on radius squared." },
      { prompt: "volume measures", answer: "space occupied by a 3D object", distractors: ["only boundary length", "only slope", "only angle"], explanation: "Volume is a three-dimensional measure." },
    ],
    numeric: [
      { label: "rectangle-area", build: (v) => { const l = 4 + v; const w = 2 + (v % 7); const answer = l * w; return { question: `Find area of a rectangle ${l} by ${w}.`, ...placeAnswer(String(answer), [String(2 * (l + w)), String(l + w), String(l * l)], v), explanation: `Area = length x width = ${answer}.` }; } },
      { label: "triangle-area", build: (v) => { const base = 6 + 2 * (v % 8); const h = 3 + (v % 7); const answer = (base * h) / 2; return { question: `Find triangle area with base ${base} and height ${h}.`, ...placeAnswer(String(answer), [String(base * h), String(base + h), String(2 * base + h)], v + 1), explanation: `Area = 1/2 x base x height = ${answer}.` }; } },
      { label: "circle-circ", build: (v) => { const r = 2 + (v % 8); return { question: `Circumference of radius ${r} is`, ...placeAnswer(`${2 * r}pi`, [`${r}pi`, `${r * r}pi`, `${4 * r}pi`], v + 2), explanation: `Circumference = 2pi r = ${2 * r}pi.` }; } },
      { label: "cube-volume", build: (v) => { const s = 2 + (v % 7); const answer = s ** 3; return { question: `Volume of cube with side ${s} is`, ...placeAnswer(String(answer), [String(6 * s * s), String(s * s), String(3 * s)], v + 3), explanation: `Cube volume = s^3 = ${answer}.` }; } },
      { label: "angle", build: (v) => { const a = 40 + (v % 5) * 10; const b = 50 + (v % 4) * 5; const answer = 180 - a - b; return { question: `Two triangle angles are ${a} and ${b}. Find the third.`, ...placeAnswer(`${answer} degrees`, [`${a + b} degrees`, `${180 - a} degrees`, `${180 - b} degrees`], v + 4), explanation: `Triangle angles add to 180 degrees.` }; } },
    ],
  },
  {
    topic: "Coordinate Geometry",
    slug: "coord",
    difficulty: "Medium",
    facts: [
      { prompt: "the distance formula comes from", answer: "Pythagoras theorem", distractors: ["Bayes theorem", "matrix determinant only", "Euler identity"], explanation: "Horizontal and vertical differences form a right triangle." },
      { prompt: "slope is calculated as", answer: "change in y divided by change in x", distractors: ["x1+x2", "product of coordinates", "distance squared"], explanation: "Slope = rise/run." },
      { prompt: "the midpoint of a segment averages", answer: "x-coordinates and y-coordinates", distractors: ["only slopes", "only lengths", "only angles"], explanation: "Midpoint = ((x1+x2)/2, (y1+y2)/2)." },
      { prompt: "parallel non-vertical lines have", answer: "equal slopes", distractors: ["opposite reciprocal slopes", "zero distance", "equal intercepts only"], explanation: "Parallel lines share direction, hence the same slope." },
      { prompt: "perpendicular non-vertical lines have slopes whose product is", answer: "-1", distractors: ["0", "1", "2"], explanation: "Perpendicular slopes are negative reciprocals." },
    ],
    numeric: [
      { label: "distance", build: (v) => { const x = 3 + (v % 4); const y = 4 + (v % 4); const d = round(Math.hypot(x, y), 2); return { question: `Distance from (0,0) to (${x},${y}) is about`, ...placeAnswer(String(d), [String(x + y), String(x * y), String(y - x)], v), explanation: `Use sqrt(${x}^2+${y}^2) = ${d}.` }; } },
      { label: "midpoint", build: (v) => { const x1 = v; const y1 = v + 2; const x2 = v + 4; const y2 = v + 8; const answer = `(${(x1 + x2) / 2},${(y1 + y2) / 2})`; return { question: `Midpoint of (${x1},${y1}) and (${x2},${y2}) is`, ...placeAnswer(answer, [`(${x1 + x2},${y1 + y2})`, `(${x2 - x1},${y2 - y1})`, `(${x1},${y2})`], v + 1), explanation: "Average the x-values and y-values." }; } },
      { label: "slope", build: (v) => { const m = 1 + (v % 5); const x1 = 1; const y1 = 2; const x2 = 4; const y2 = y1 + m * 3; return { question: `Slope through (${x1},${y1}) and (${x2},${y2}) is`, ...placeAnswer(String(m), [String(m + 1), String(3), String(y2 - y1)], v + 2), explanation: `Slope = (${y2}-${y1})/(${x2}-${x1}) = ${m}.` }; } },
      { label: "circle", build: (v) => { const r = 2 + (v % 8); return { question: `Circle centered at origin with radius ${r} has equation`, ...placeAnswer(`x^2 + y^2 = ${r * r}`, [`x + y = ${r}`, `x^2 - y^2 = ${r}`, `x^2 + y^2 = ${r}`], v + 3), explanation: "A circle centered at origin satisfies x^2+y^2=r^2." }; } },
      { label: "line", build: (v) => { const m = 2 + (v % 4); const c = -2 + (v % 5); return { question: `The line with slope ${m} and y-intercept ${c} is`, ...placeAnswer(`y=${m}x+${c}`, [`y=${c}x+${m}`, `x=${m}y+${c}`, `y=${m + c}x`], v + 4), explanation: "Slope-intercept form is y=mx+c." }; } },
    ],
  },
  {
    topic: "Trigonometry",
    slug: "trig",
    difficulty: "Medium",
    facts: [
      { prompt: "on the unit circle, sin theta is the", answer: "y-coordinate", distractors: ["x-coordinate", "radius squared", "area"], explanation: "Unit-circle sine is vertical coordinate." },
      { prompt: "on the unit circle, cos theta is the", answer: "x-coordinate", distractors: ["y-coordinate", "diameter", "arc area only"], explanation: "Unit-circle cosine is horizontal coordinate." },
      { prompt: "tan theta equals", answer: "sin theta / cos theta", distractors: ["cos theta / sin theta", "1 / sin theta", "sin theta + cos theta"], explanation: "Tangent is the ratio of sine to cosine." },
      { prompt: "sin^2 theta + cos^2 theta equals", answer: "1", distractors: ["0", "2", "tan theta"], explanation: "This is the fundamental Pythagorean identity." },
      { prompt: "pi radians equals", answer: "180 degrees", distractors: ["90 degrees", "270 degrees", "360 degrees"], explanation: "pi radians is half a full turn." },
    ],
    numeric: [
      { label: "degrees-radians", build: (v) => { const degrees = [30, 45, 60, 90, 180][v % 5]; const answer = degrees === 180 ? "pi" : `${degrees}/180 pi`; return { question: `${degrees} degrees equals`, ...placeAnswer(answer, [`${degrees}pi`, `${180 / degrees}pi`, `${degrees}/90 pi`], v), explanation: "Convert degrees to radians using degrees x pi/180." }; } },
      { label: "tan", build: (v) => { const s = [1, 3, 4, 5][v % 4]; const c = [2, 4, 5, 6][v % 4]; return { question: `If sin theta=${s}/${c} and cos theta=1/2, tan theta is`, ...placeAnswer(`${(2 * s)}/${c}`, [`${s}/${2 * c}`, `${c}/${2 * s}`, `${s + c}/2`], v + 1), explanation: "tan theta = sin theta / cos theta." }; } },
      { label: "identity", build: (v) => { const sin2 = [0.25, 0.36, 0.49, 0.64][v % 4]; const cos2 = round(1 - sin2, 2); return { question: `If sin^2 theta=${sin2}, then cos^2 theta is`, ...placeAnswer(String(cos2), [String(sin2), String(round(1 + sin2, 2)), String(round(2 - sin2, 2))], v + 2), explanation: "Use sin^2 theta + cos^2 theta = 1." }; } },
      { label: "period", build: (v) => { const k = 1 + (v % 6); return { question: `The period of sin(${k}x) is`, ...placeAnswer(`2pi/${k}`, [`${k}pi`, `pi/${k}`, "2pi"], v + 3), explanation: "For sin(kx), period = 2pi/k." }; } },
      { label: "amplitude", build: (v) => { const a = 2 + (v % 7); return { question: `Amplitude of y=${a}sin x is`, ...placeAnswer(String(a), ["1", String(2 * a), "pi"], v + 4), explanation: "Amplitude is the absolute value of the multiplier outside sine." }; } },
    ],
  },
  {
    topic: "Calculus",
    slug: "calc",
    difficulty: "Hard",
    facts: [
      { prompt: "a derivative measures", answer: "instantaneous rate of change", distractors: ["total count only", "randomness", "matrix size"], explanation: "A derivative is local slope." },
      { prompt: "a definite integral often represents", answer: "accumulated signed area", distractors: ["only one point", "only a matrix inverse", "only a probability"], explanation: "Integration accumulates small pieces across an interval." },
      { prompt: "a limit describes", answer: "approached value", distractors: ["only exact equality", "a password", "a graph color"], explanation: "Limits study behavior as input gets close to a value." },
      { prompt: "the chain rule is used for", answer: "composite functions", distractors: ["only prime numbers", "only triangles", "only counting arrangements"], explanation: "The chain rule differentiates f(g(x))." },
      { prompt: "the second derivative indicates", answer: "concavity or acceleration", distractors: ["only y-intercept", "only domain", "only sample size"], explanation: "Second derivative measures how the first derivative changes." },
    ],
    numeric: [
      { label: "power-derivative", build: (v) => { const n = 2 + (v % 8); return { question: `d/dx x^${n} equals`, ...placeAnswer(`${n}x^${n - 1}`, [`x^${n - 1}`, `${n - 1}x^${n}`, `${n}x^${n}`], v), explanation: "Power rule: d/dx x^n = n x^(n-1)." }; } },
      { label: "constant-multiple", build: (v) => { const a = 2 + (v % 7); const n = 2 + (v % 5); return { question: `d/dx ${a}x^${n} equals`, ...placeAnswer(`${a * n}x^${n - 1}`, [`${a}x^${n - 1}`, `${n}x^${a - 1}`, `${a + n}x`], v + 1), explanation: "Multiply the power-rule result by the constant." }; } },
      { label: "integral-power", build: (v) => { const n = 1 + (v % 6); return { question: `Integral of x^${n} dx is`, ...placeAnswer(`x^${n + 1}/${n + 1} + C`, [`${n}x^${n - 1}+C`, `x^${n}+C`, `${n + 1}x^${n}+C`], v + 2), explanation: "Increase the power by 1 and divide by the new power." }; } },
      { label: "limit-linear", build: (v) => { const a = 2 + (v % 6); const b = -3 + (v % 7); const x = 1 + (v % 5); const answer = a * x + b; return { question: `lim x->${x} (${a}x+${b}) equals`, ...placeAnswer(String(answer), [String(a + b), String(x), String(answer + a)], v + 3), explanation: "For continuous linear functions, substitute the approaching value." }; } },
      { label: "motion", build: (v) => { const a = 2 + (v % 5); const t = 1 + (v % 6); const answer = 2 * a * t; return { question: `If s(t)=${a}t^2, velocity at t=${t} is`, ...placeAnswer(String(answer), [String(a * t * t), String(a * t), String(2 * a)], v + 4), explanation: "Velocity is derivative of position: s'(t)=2at." }; } },
    ],
  },
  {
    topic: "Complex Numbers",
    slug: "cx",
    difficulty: "Hard",
    facts: [
      { prompt: "i^2 equals", answer: "-1", distractors: ["1", "0", "i"], explanation: "The imaginary unit is defined by i^2=-1." },
      { prompt: "the modulus of a+bi is", answer: "sqrt(a^2+b^2)", distractors: ["a+b", "ab", "a-b"], explanation: "Modulus is distance from the origin." },
      { prompt: "Euler formula states", answer: "e^(i theta)=cos theta + i sin theta", distractors: ["a^2+b^2=c^2", "y=mx+c", "A=pi r^2"], explanation: "Euler's formula links complex exponentials and rotation." },
      { prompt: "multiplying complex numbers in polar form", answer: "multiplies moduli and adds arguments", distractors: ["adds moduli and multiplies arguments", "keeps both unchanged", "always gives a real number"], explanation: "Polar multiplication scales and rotates." },
      { prompt: "the conjugate of a+bi is", answer: "a-bi", distractors: ["-a+bi", "b+ai", "-a-bi"], explanation: "Conjugation flips the sign of the imaginary part." },
    ],
    numeric: [
      { label: "modulus", build: (v) => { const a = 3 + (v % 5); const b = 4 + (v % 5); const answer = round(Math.hypot(a, b), 2).toString(); return { question: `Find |${a}+${b}i|.`, ...placeAnswer(answer, [String(a + b), String(a * b), String(b - a)], v), explanation: `Modulus = sqrt(${a}^2+${b}^2).` }; } },
      { label: "add", build: (v) => { const a = 1 + v; const b = 2 + (v % 5); const c = 3 + (v % 4); const d = -1 - (v % 3); const answer = `${a + c}+${b + d}i`; return { question: `(${a}+${b}i)+(${c}${d}i) equals`, ...placeAnswer(answer, [`${a + c}+${b - d}i`, `${a * c}+${b * d}i`, `${a - c}+${b + d}i`], v + 1), explanation: "Add real parts and imaginary parts separately." }; } },
      { label: "multiply-i", build: (v) => { const a = 2 + v; const b = 1 + (v % 6); return { question: `i(${a}+${b}i) equals`, ...placeAnswer(`${-b}+${a}i`, [`${b}+${a}i`, `${a}+${b}i`, `${-a}+${b}i`], v + 2), explanation: `i(a+bi)=ai+b i^2=-b+ai.` }; } },
      { label: "conjugate-product", build: (v) => { const a = 2 + (v % 5); const b = 1 + (v % 7); return { question: `(${a}+${b}i)(${a}-${b}i) equals`, ...placeAnswer(String(a * a + b * b), [String(a * a - b * b), `${2 * a * b}i`, String(a + b)], v + 3), explanation: "z times conjugate z equals |z|^2." }; } },
      { label: "argument-axis", build: (v) => { const y = 1 + v; return { question: `The point ${y}i lies on the`, ...placeAnswer("positive imaginary axis", ["positive real axis", "negative real axis", "negative imaginary axis"], v + 4), explanation: "A pure positive imaginary number has real part 0 and positive imaginary part." }; } },
    ],
  },
  {
    topic: "Linear Algebra",
    slug: "lin",
    difficulty: "Hard",
    facts: [
      { prompt: "a vector has", answer: "magnitude and direction", distractors: ["only color", "only probability", "only perimeter"], explanation: "Vectors represent directed quantities." },
      { prompt: "the dot product measures", answer: "alignment between vectors", distractors: ["only volume", "only randomness", "only determinant"], explanation: "Dot product is tied to projection and angle." },
      { prompt: "a basis is", answer: "a linearly independent spanning set", distractors: ["any repeated vector list", "only zero vectors", "only eigenvalues"], explanation: "Basis vectors build the space without redundancy." },
      { prompt: "an eigenvector", answer: "keeps its direction under a transformation", distractors: ["always becomes zero", "always rotates 90 degrees", "is always random"], explanation: "Eigenvectors may scale but stay on their span." },
      { prompt: "span means", answer: "all linear combinations of given vectors", distractors: ["only vector length", "only one coordinate", "only matrix trace"], explanation: "Span describes every vector reachable by combinations." },
    ],
    numeric: [
      { label: "magnitude", build: (v) => { const x = 3 + (v % 6); const y = 4 + (v % 6); const answer = round(Math.hypot(x, y), 2).toString(); return { question: `Magnitude of vector <${x},${y}> is`, ...placeAnswer(answer, [String(x + y), String(x * y), String(y - x)], v), explanation: "Use sqrt(x^2+y^2)." }; } },
      { label: "dot", build: (v) => { const a = [1 + v, 2 + (v % 4)]; const b = [3, 1 + (v % 5)]; const answer = a[0] * b[0] + a[1] * b[1]; return { question: `<${a[0]},${a[1]}> dot <${b[0]},${b[1]}> equals`, ...placeAnswer(String(answer), [String(a[0] + b[0]), String(a[1] * b[1]), String(answer + 1)], v + 1), explanation: "Dot product multiplies matching components and adds." }; } },
      { label: "scale", build: (v) => { const k = 2 + (v % 5); const x = 1 + (v % 4); const y = 2 + (v % 3); return { question: `${k}<${x},${y}> equals`, ...placeAnswer(`<${k * x},${k * y}>`, [`<${k + x},${k + y}>`, `<${x},${y}>`, `<${x * y},${k}>`], v + 2), explanation: "Scalar multiplication scales each component." }; } },
      { label: "det-area", build: (v) => { const a = 2 + (v % 4); const d = 3 + (v % 5); const answer = a * d; return { question: `The diagonal matrix [[${a},0],[0,${d}]] scales area by`, ...placeAnswer(String(answer), [String(a + d), String(a - d), String(1)], v + 3), explanation: "The determinant gives area scale; here det = ad." }; } },
      { label: "projection", build: (v) => { const x = 2 + (v % 6); return { question: `Projection of <${x},0> on the x-axis is`, ...placeAnswer(`<${x},0>`, [`<0,${x}>`, "<0,0>", `<${-x},0>`], v + 4), explanation: "A vector already on the x-axis projects to itself." }; } },
    ],
  },
  {
    topic: "Matrices",
    slug: "mat",
    difficulty: "Medium",
    facts: [
      { prompt: "matrix addition requires", answer: "same dimensions", distractors: ["same determinant only", "only square matrices", "no matching size"], explanation: "Matrices add entry by entry, so sizes must match." },
      { prompt: "matrix multiplication AB is defined when", answer: "columns of A equal rows of B", distractors: ["rows of A equal rows of B", "A and B have equal determinants", "both are diagonal only"], explanation: "Inner dimensions must match." },
      { prompt: "the identity matrix acts like", answer: "1 for matrix multiplication", distractors: ["0 for matrix addition", "a random matrix", "only a rotation"], explanation: "AI=IA=A when dimensions match." },
      { prompt: "a zero determinant means a square matrix is", answer: "singular", distractors: ["always identity", "always diagonal", "always orthogonal"], explanation: "Zero determinant means no inverse." },
      { prompt: "row reduction is used to solve", answer: "linear systems", distractors: ["only circle area", "only trigonometric periods", "only sampling error"], explanation: "Elementary row operations simplify systems." },
    ],
    numeric: [
      { label: "det2", build: (v) => { const a = 1 + v; const b = 2; const c = 1; const d = 3 + (v % 5); const answer = a * d - b * c; return { question: `det [[${a},${b}],[${c},${d}]] equals`, ...placeAnswer(String(answer), [String(a * d + b * c), String(a + d), String(b - c)], v), explanation: "For 2x2, determinant = ad - bc." }; } },
      { label: "add-entry", build: (v) => { const a = 1 + v; const b = 3 + (v % 6); return { question: `If A_11=${a} and B_11=${b}, then (A+B)_11 is`, ...placeAnswer(String(a + b), [String(a * b), String(a - b), String(b - a)], v + 1), explanation: "Matrix addition is entrywise." }; } },
      { label: "scalar-entry", build: (v) => { const k = 2 + (v % 5); const a = 3 + (v % 7); return { question: `If A_12=${a}, then (${k}A)_12 is`, ...placeAnswer(String(k * a), [String(k + a), String(a), String(k - a)], v + 2), explanation: "Scalar multiplication multiplies every entry." }; } },
      { label: "identity", build: (v) => { const a = 2 + v; return { question: `For A=[[${a},1],[0,${a + 1}]], AI equals`, ...placeAnswer("A", ["I", "0", "2A"], v + 3), explanation: "Multiplying by identity leaves a matrix unchanged." }; } },
      { label: "trace", build: (v) => { const a = 1 + v; const d = 4 + (v % 5); return { question: `Trace of [[${a},2],[3,${d}]] is`, ...placeAnswer(String(a + d), [String(a * d - 6), String(a + 2 + 3 + d), String(d - a)], v + 4), explanation: "Trace is the sum of diagonal entries." }; } },
    ],
  },
  {
    topic: "Probability",
    slug: "prob",
    difficulty: "Medium",
    facts: [
      { prompt: "probability values lie between", answer: "0 and 1", distractors: ["-1 and 1 only", "1 and infinity", "any negative number"], explanation: "Probability cannot be less than 0 or greater than 1." },
      { prompt: "for equally likely outcomes, probability is", answer: "favourable outcomes / total outcomes", distractors: ["total / favourable", "mean x median", "area x volume"], explanation: "Classical probability counts favourable cases over all cases." },
      { prompt: "independent events satisfy", answer: "P(A and B)=P(A)P(B)", distractors: ["P(A and B)=P(A)+P(B)", "P(A)=P(B)", "P(A or B)=0"], explanation: "Independence means one event does not change the probability of the other." },
      { prompt: "complement probability is", answer: "1 - P(A)", distractors: ["P(A)+1", "P(A)/2", "P(A)^2"], explanation: "A and not-A exhaust the sample space." },
      { prompt: "conditional probability is written as", answer: "P(A|B)", distractors: ["A dot B", "A cross B", "det(A)"], explanation: "P(A|B) means probability of A given B." },
    ],
    numeric: [
      { label: "die", build: (v) => { const target = 1 + (v % 6); return { question: `Probability of rolling ${target} on a fair die is`, ...placeAnswer("1/6", ["1/2", "1/3", "5/6"], v), explanation: "A fair die has six equally likely faces." }; } },
      { label: "coin", build: (v) => { const tosses = 2 + (v % 4); return { question: `Probability of all heads in ${tosses} fair coin tosses is`, ...placeAnswer(`1/${2 ** tosses}`, [`${tosses}/2`, `1/${tosses}`, `${2 ** tosses - 1}/${2 ** tosses}`], v + 1), explanation: `There are ${2 ** tosses} equally likely outcomes and one all-heads outcome.` }; } },
      { label: "complement", build: (v) => { const num = 1 + (v % 8); const den = 10; return { question: `If P(A)=${num}/${den}, then P(not A) is`, ...placeAnswer(`${den - num}/${den}`, [`${num}/${den}`, `${num + 1}/${den}`, `${den}/${num}`], v + 2), explanation: "Use P(not A)=1-P(A)." }; } },
      { label: "cards", build: (v) => { const suits = ["hearts", "spades", "clubs", "diamonds"]; const suit = suits[v % 4]; return { question: `Probability of drawing ${suit} from a standard deck is`, ...placeAnswer("13/52", ["4/52", "1/52", "26/52"], v + 3), explanation: "Each suit has 13 cards out of 52." }; } },
      { label: "or", build: (v) => { const a = 2 + (v % 3); const b = 3 + (v % 3); return { question: `If mutually exclusive events have probabilities ${a}/20 and ${b}/20, P(A or B) is`, ...placeAnswer(`${a + b}/20`, [`${a * b}/20`, `${Math.abs(a - b)}/20`, `${a}/20`], v + 4), explanation: "For mutually exclusive events, add probabilities." }; } },
    ],
  },
  {
    topic: "Statistics",
    slug: "stat",
    difficulty: "Medium",
    facts: [
      { prompt: "mean is", answer: "sum of values divided by number of values", distractors: ["middle value only", "most frequent value", "largest minus smallest"], explanation: "Mean is the arithmetic average." },
      { prompt: "median is", answer: "middle value after ordering", distractors: ["sum divided by count", "most frequent value", "standard deviation"], explanation: "Median is central position in ordered data." },
      { prompt: "mode is", answer: "most frequent value", distractors: ["largest value", "smallest value", "mean squared"], explanation: "Mode is the value that appears most often." },
      { prompt: "range is", answer: "maximum minus minimum", distractors: ["mean plus median", "mode minus mean", "total frequency"], explanation: "Range measures spread from smallest to largest." },
      { prompt: "standard deviation measures", answer: "spread around the mean", distractors: ["only the center", "only sample size", "only correlation sign"], explanation: "Standard deviation quantifies variation." },
    ],
    numeric: [
      { label: "mean", build: (v) => { const a = 2 + v; const b = a + 2; const c = a + 4; const answer = (a + b + c) / 3; return { question: `Mean of ${a}, ${b}, ${c} is`, ...placeAnswer(String(answer), [String(a + b + c), String(b - a), String(c)], v), explanation: "Add values and divide by 3." }; } },
      { label: "median", build: (v) => { const a = 1 + v; const answer = a + 3; return { question: `Median of ${a}, ${a + 3}, ${a + 8} is`, ...placeAnswer(String(answer), [String(a), String(a + 8), String(a + 11)], v + 1), explanation: "The middle ordered value is the median." }; } },
      { label: "range", build: (v) => { const min = -2 + v; const max = min + 7 + (v % 5); return { question: `Range of a data set with min ${min} and max ${max} is`, ...placeAnswer(String(max - min), [String(max + min), String(max), String(min)], v + 2), explanation: "Range = maximum - minimum." }; } },
      { label: "frequency", build: (v) => { const mode = 2 + (v % 5); return { question: `In data ${mode}, ${mode}, ${mode}, ${mode + 1}, ${mode + 2}, the mode is`, ...placeAnswer(String(mode), [String(mode + 1), String(mode + 2), "no mode"], v + 3), explanation: "The mode occurs most often." }; } },
      { label: "weighted", build: (v) => { const x = 2 + (v % 5); const y = x + 4; const answer = (2 * x + y) / 3; return { question: `Mean of ${x}, ${x}, ${y} is`, ...placeAnswer(String(round(answer, 2)), [String(x + y), String(y), String(x)], v + 4), explanation: "Add all three values and divide by 3." }; } },
    ],
  },
  {
    topic: "Combinatorics",
    slug: "comb",
    difficulty: "Hard",
    facts: [
      { prompt: "the multiplication principle counts", answer: "choices made in sequence", distractors: ["only averages", "only slopes", "only real roots"], explanation: "If one choice has m ways and another n ways, together there are mn ways." },
      { prompt: "n! means", answer: "product of integers from 1 to n", distractors: ["n+n", "n squared", "n divided by 2"], explanation: "Factorial counts arrangements of n distinct items." },
      { prompt: "permutation cares about", answer: "order", distractors: ["only area", "only sample mean", "only radius"], explanation: "Permutations are ordered arrangements." },
      { prompt: "combination ignores", answer: "order", distractors: ["total count", "membership", "selection size"], explanation: "Combinations choose groups without order." },
      { prompt: "binomial coefficients appear in", answer: "Pascal's triangle", distractors: ["only unit circles", "only matrix trace", "only histograms"], explanation: "Pascal's triangle lists n choose r values." },
    ],
    numeric: [
      { label: "factorial", build: (v) => { const n = 3 + (v % 5); const answer = Array.from({ length: n }, (_, i) => i + 1).reduce((p, x) => p * x, 1); return { question: `${n}! equals`, ...placeAnswer(String(answer), [String(n * n), String(n + n), String(answer / n)], v), explanation: `${n}! is the product 1 through ${n}.` }; } },
      { label: "perm", build: (v) => { const n = 5 + (v % 5); const r = 2; const answer = n * (n - 1); return { question: `Number of ordered selections of 2 from ${n} distinct objects is`, ...placeAnswer(String(answer), [String(n + r), String(n), String((n * (n - 1)) / 2)], v + 1), explanation: `nP2 = n(n-1) = ${answer}.` }; } },
      { label: "comb", build: (v) => { const n = 5 + (v % 6); const answer = (n * (n - 1)) / 2; return { question: `Number of unordered pairs from ${n} objects is`, ...placeAnswer(String(answer), [String(n * (n - 1)), String(n + 2), String(n)], v + 2), explanation: `nC2 = n(n-1)/2 = ${answer}.` }; } },
      { label: "binary", build: (v) => { const n = 3 + (v % 7); return { question: `Number of binary strings of length ${n} is`, ...placeAnswer(String(2 ** n), [String(2 * n), String(n ** 2), String(n + 2)], v + 3), explanation: "Each position has 2 choices, so total is 2^n." }; } },
      { label: "arrange", build: (v) => { const n = 3 + (v % 5); const answer = Array.from({ length: n }, (_, i) => i + 1).reduce((p, x) => p * x, 1); return { question: `Ways to arrange ${n} distinct books in a row is`, ...placeAnswer(String(answer), [String(n * n), String(2 ** n), String(n + 1)], v + 4), explanation: "Arranging n distinct objects gives n! ways." }; } },
    ],
  },
  {
    topic: "Set Theory",
    slug: "set",
    difficulty: "Medium",
    facts: [
      { prompt: "A union B means", answer: "elements in A or B or both", distractors: ["only elements in both", "elements in neither", "ordered pairs only"], explanation: "Union collects everything from either set." },
      { prompt: "A intersection B means", answer: "elements common to both A and B", distractors: ["all elements outside A", "only first elements", "the larger set only"], explanation: "Intersection keeps shared elements." },
      { prompt: "the complement of A contains", answer: "elements in the universal set but not in A", distractors: ["only elements in A", "only empty-set members", "only ordered pairs"], explanation: "Complement is relative to a universal set." },
      { prompt: "the empty set has", answer: "no elements", distractors: ["one zero element always", "infinitely many elements", "only negative numbers"], explanation: "The empty set contains nothing." },
      { prompt: "a subset relation A subset B means", answer: "every element of A is in B", distractors: ["A and B are disjoint", "B has no elements", "A is always larger"], explanation: "Subset means inclusion of all elements." },
    ],
    numeric: [
      { label: "union-count", build: (v) => { const a = 5 + v; const b = 6 + (v % 5); const inter = 2 + (v % 3); const answer = a + b - inter; return { question: `If |A|=${a}, |B|=${b}, |A intersection B|=${inter}, find |A union B|.`, ...placeAnswer(String(answer), [String(a + b), String(inter), String(a + b + inter)], v), explanation: "Use |A union B|=|A|+|B|-|A intersection B|." }; } },
      { label: "complement-count", build: (v) => { const u = 20 + v; const a = 5 + (v % 8); return { question: `If |U|=${u} and |A|=${a}, then |A complement| is`, ...placeAnswer(String(u - a), [String(u + a), String(a), String(u)], v + 1), explanation: "Complement count is universal count minus set count." }; } },
      { label: "power-set", build: (v) => { const n = 2 + (v % 6); return { question: `A set with ${n} elements has how many subsets?`, ...placeAnswer(String(2 ** n), [String(n * n), String(n + 1), String(2 * n)], v + 2), explanation: "Each element is either included or not, so 2^n subsets." }; } },
      { label: "cartesian", build: (v) => { const a = 2 + (v % 5); const b = 3 + (v % 6); return { question: `If |A|=${a} and |B|=${b}, then |A x B| is`, ...placeAnswer(String(a * b), [String(a + b), String(Math.abs(a - b)), String(2 ** a)], v + 3), explanation: "Cartesian product count multiplies set sizes." }; } },
      { label: "intersection", build: (v) => { const union = 15 + v; const a = 8 + (v % 5); const b = union - a + 3; const answer = a + b - union; return { question: `If |A union B|=${union}, |A|=${a}, |B|=${b}, find |A intersection B|.`, ...placeAnswer(String(answer), [String(a + b), String(union - a), String(union - b)], v + 4), explanation: "Rearrange the union formula." }; } },
    ],
  },
  {
    topic: "AI Applications",
    slug: "ai",
    difficulty: "Medium",
    facts: [
      { prompt: "gradient descent moves", answer: "downhill on a loss surface", distractors: ["randomly upward only", "only along a circle", "only through prime numbers"], explanation: "Gradient descent updates parameters opposite the gradient." },
      { prompt: "a neural network layer often computes", answer: "activation(Wx+b)", distractors: ["pi r^2", "a^2+b^2", "n!"], explanation: "Layers use weights, inputs, bias, and activation." },
      { prompt: "matrix multiplication in AI helps compute", answer: "many weighted sums efficiently", distractors: ["only triangle angles", "only dice rolls", "only square roots"], explanation: "Matrix operations batch linear combinations." },
      { prompt: "signal processing studies", answer: "waves and frequencies", distractors: ["only polygons", "only card suits", "only integer factors"], explanation: "Signals can be decomposed into frequency components." },
      { prompt: "GPS positioning uses", answer: "distances from satellites", distractors: ["only matrix trace", "only median", "only complex conjugates"], explanation: "Triangulation/trilateration uses distance constraints." },
    ],
    numeric: [
      { label: "linear-neuron", build: (v) => { const w = 2 + (v % 5); const x = 3 + (v % 4); const b = -2 + (v % 5); const answer = w * x + b; return { question: `For neuron z=wx+b with w=${w}, x=${x}, b=${b}, find z.`, ...placeAnswer(String(answer), [String(w + x + b), String(w * x), String(x + b)], v), explanation: "Compute wx+b." }; } },
      { label: "loss", build: (v) => { const pred = 3 + v; const actual = pred + 2; const answer = (pred - actual) ** 2; return { question: `Squared error for prediction ${pred} and actual ${actual} is`, ...placeAnswer(String(answer), [String(actual - pred), String(pred + actual), String(actual ** 2)], v + 1), explanation: "Squared error = (prediction - actual)^2." }; } },
      { label: "update", build: (v) => { const weight = 10 + v; const lr = 0.1; const grad = 2 + (v % 5); const answer = round(weight - lr * grad, 2).toString(); return { question: `Gradient update w=${weight}, learning rate 0.1, gradient ${grad} gives new w`, ...placeAnswer(answer, [String(weight + lr * grad), String(grad), String(weight)], v + 2), explanation: "Use w_new = w - learning_rate x gradient." }; } },
      { label: "accuracy", build: (v) => { const total = 20 + v; const correct = total - (v % 5) - 1; const answer = `${round((correct / total) * 100, 1)}%`; return { question: `Accuracy for ${correct} correct out of ${total} is`, ...placeAnswer(answer, [`${correct}%`, `${total - correct}%`, `${round((total / correct) * 100, 1)}%`], v + 3), explanation: "Accuracy = correct / total x 100%." }; } },
      { label: "matrix-layer", build: (v) => { const inputs = 3 + (v % 4); const neurons = 4 + (v % 5); return { question: `A dense layer with ${inputs} inputs and ${neurons} neurons has how many weights?`, ...placeAnswer(String(inputs * neurons), [String(inputs + neurons), String(neurons), String(inputs)], v + 4), explanation: "Each neuron has one weight per input." }; } },
    ],
  },
];

function generateBank(bank: ConceptBank) {
  const questions: QuizQuestion[] = [];
  for (let variant = 0; variant < 15; variant += 1) {
    bank.facts.forEach((fact, index) => questions.push(factQuestion(bank, fact, index, variant)));
    bank.numeric.forEach((pattern, index) => questions.push(numericQuestion(bank, pattern, index, variant)));
  }
  return questions.slice(0, 75);
}

export const quizTopics = banks.map((bank) => bank.topic);

export const quizData: QuizQuestion[] = banks.flatMap(generateBank);

export const quizTopicCounts: Record<string, number> = quizTopics.reduce((counts, topic) => {
  counts[topic] = quizData.filter((question) => question.topic === topic).length;
  return counts;
}, {} as Record<string, number>);

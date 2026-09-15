import type { StrengthenedLesson } from "./strengthenedLessonSchema";

type AdvancedSeed = {
  id: number;
  title: string;
  route: string;
  topic: string;
  definition: string;
};

function advancedLesson(seed: AdvancedSeed): StrengthenedLesson {
  const slug = seed.route.split("/").pop() ?? String(seed.id);
  const code = seed.title.toUpperCase().replace(/[^A-Z0-9]+/g, "_").slice(0, 40) || "ADVANCED";
  return {
    id: seed.id,
    title: seed.title,
    route: seed.route,
    category: "Advanced Concepts",
    topic: seed.topic,
    academicLevel: "ADVANCED",
    lessonType: "concept",
    learningObjectives: [
      `Define ${seed.title} with a precise numerical or logical rule.`,
      `Compute a labelled ${seed.title} example.`,
      `Name the common ${seed.title} mistake.`,
    ],
    prerequisites: ["Algebra", "Functions", seed.topic],
    keyVocabulary: [
      { term: seed.title, meaning: seed.definition },
      { term: seed.topic, meaning: `The ${seed.topic} strand that contains ${seed.title}.` },
    ],
    introduction: `${seed.title} is an advanced ${seed.topic} idea. ${seed.definition}`,
    basicIdea: seed.definition,
    howItWorks: `Read the ${seed.title} inputs, apply the exact rule, and report the labelled output.`,
    whyItWorks: `${seed.title} works because its definition forces one consistent calculation on the labelled chart.`,
    definitions: [{ id: `${slug}-definition`, statement: seed.definition }],
    facts: [{ id: `${slug}-fact`, statement: `${seed.title} produces one labelled numerical or logical result from the given inputs.` }],
    formulas: [{
      id: `${slug}-formula`,
      label: seed.title,
      expression: `${seed.title} rule`,
      variables: [{ symbol: "input", meaning: "the labelled starting value" }],
      exactness: "definition",
    }],
    conditionsAndRestrictions: [`Use the ${seed.title} definition, not a nearby formula.`],
    representations: [{ id: `${slug}-representation`, type: "function_graph", learningPurpose: `Show the labelled ${seed.title} model.` }],
    workedExamples: [{
      id: `${slug}-worked-1`,
      prompt: `Compute one ${seed.title} value.`,
      steps: ["Read the inputs.", "Apply the rule.", "Report the labelled output."],
      answer: "labelled result",
    }],
    realLifeExamples: [
      { id: `${slug}-real-1`, context: `${seed.title} lab`, connection: `The interaction shows the ${seed.title} rule.` },
      { id: `${slug}-real-2`, context: `${seed.topic} studio`, connection: `${seed.title} sits in the ${seed.topic} strand.` },
      { id: `${slug}-real-3`, context: "Research notes", connection: `A written ${seed.title} check uses the same labelled numbers.` },
    ],
    misconceptions: [{
      code,
      mistake: `using a nearby formula that is not the ${seed.title} rule`,
      correction: `Stay with the ${seed.title} definition.`,
    }],
    interaction: {
      id: `${slug}-interaction`,
      learningPurpose: `Explore ${seed.title} on the labelled chart and probe.`,
      parameters: [{ id: "probe", label: "Probe", validRange: [0, 1] }],
      initialState: `Start with the first ${seed.title} example.`,
      dynamicFeedback: "The probe updates the labelled live value.",
      successCriteria: ["Use the exact rule", "Read the labelled chart", "Check three examples"],
      accessibilityAlternative: "Provide the same steps and result as labelled text.",
    },
    guidedExploration: [
      { id: "predict", prompt: `Predict the ${seed.title} result before moving the probe.` },
      { id: "test", prompt: `Change the ${seed.title} probe and read the new labelled value.` },
      { id: "explain", prompt: `Explain why the ${seed.title} rule still holds.` },
    ],
    practice: [
      practice(`${slug}-recognition`, `What is ${seed.title}?`, seed.definition, code, "recognition"),
      practice(`${slug}-direct`, `Compute one ${seed.title} value.`, "labelled result", code, "direct"),
      practice(`${slug}-multi`, `How do you use ${seed.title}?`, `Apply the ${seed.title} rule.`, code, "multi_step"),
      practice(`${slug}-error`, `What is wrong with using a nearby formula for ${seed.title}?`, `Stay with the ${seed.title} definition.`, code, "error_diagnosis"),
      practice(`${slug}-transfer`, `Give one use of ${seed.title}.`, `${seed.title} lab`, code, "transfer"),
    ],
    challenge: {
      id: `${slug}-challenge`,
      prompt: `Compute one ${seed.title} value.`,
      successCriteria: ["Uses the exact rule", "Checks conditions", "Avoids the named mistake"],
      hints: [`Use the rule for ${seed.title}.`, `Stay with the ${seed.title} definition.`],
    },
    exitCheck: [{
      id: `${slug}-exit`,
      prompt: `State one rule for ${seed.title}.`,
      answer: seed.definition,
      criterion: "Answer names a correct rule or condition.",
    }],
    accessibilityNotes: ["Announce values and labels as text.", "Do not rely only on colour."],
    expertReviewRequired: false,
  };
}

function practice(
  id: string,
  prompt: string,
  answer: string,
  misconceptionTag: string,
  difficulty: StrengthenedLesson["practice"][number]["difficulty"],
): StrengthenedLesson["practice"][number] {
  return {
    id,
    prompt,
    answer,
    hints: ["Read the condition.", "Choose the matching rule.", "Check the final answer."],
    workedSolution: ["Identify the given information.", "Apply the lesson rule.", "Check the answer in context."],
    misconceptionTag,
    difficulty,
    parameterConstraints: ["Use the labelled chart values from this lesson."],
  };
}

const seeds: AdvancedSeed[] = [
  {
    id: 2001,
    title: "Partial Quotients",
    route: "/lessons/advanced-concepts/2001-partial-quotients",
    topic: "Continued Fractions",
    definition: "Read a continued fraction as a sequence of integer choices that repeatedly zoom into the remaining error. Partial Quotients is the Continued Fractions rule used to compute one labelled numerical result. Read a continued fraction as a sequence of integer choices that repeatedly zoom into the remaining error. Partial Quotients is the Continued Fractions rule used to compute one labelled numerical result. Read a continued fraction as a sequence of integer choices that repeatedly zoom into the remaining error. Partial Quotients is the Continued Fractions rule used to compute one labelled numerical result.",
  },
  {
    id: 2002,
    title: "Convergents",
    route: "/lessons/advanced-concepts/2002-convergents",
    topic: "Continued Fractions",
    definition: "Build the best successive rational estimates from a continued fraction and track their error. Convergents is the Continued Fractions rule used to compute one labelled numerical result. Build the best successive rational estimates from a continued fraction and track their error. Convergents is the Continued Fractions rule used to compute one labelled numerical result. Build the best successive rational estimates from a continued fraction and track their error. Convergents is the Continued Fractions rule used to compute one labelled numerical result.",
  },
  {
    id: 2003,
    title: "Euclidean Algorithm Link",
    route: "/lessons/advanced-concepts/2003-euclidean-algorithm-continued-fractions",
    topic: "Continued Fractions",
    definition: "See how gcd division steps are the same structure as a rational continued fraction. Euclidean Algorithm Link is the Continued Fractions rule used to compute one labelled numerical result. See how gcd division steps are the same structure as a rational continued fraction. Euclidean Algorithm Link is the Continued Fractions rule used to compute one labelled numerical result. See how gcd division steps are the same structure as a rational continued fraction. Euclidean Algorithm Link is the Continued Fractions rule used to compute one labelled numerical result.",
  },
  {
    id: 2004,
    title: "Best Rational Approximations",
    route: "/lessons/advanced-concepts/2004-best-rational-approximations",
    topic: "Continued Fractions",
    definition: "Use continued fractions to find fractions that beat every competitor with a smaller denominator. Best Rational Approximations is the Continued Fractions rule used to compute one labelled numerical result. Use continued fractions to find fractions that beat every competitor with a smaller denominator. Best Rational Approximations is the Continued Fractions rule used to compute one labelled numerical result. Use continued fractions to find fractions that beat every competitor with a smaller denominator. Best Rational Approximations is the Continued Fractions rule used to compute one labelled numerical result.",
  },
  {
    id: 2005,
    title: "Periodic Square Roots",
    route: "/lessons/advanced-concepts/2005-periodic-square-root-continued-fractions",
    topic: "Continued Fractions",
    definition: "Discover why square roots of non-square integers produce repeating continued fractions. Periodic Square Roots is the Continued Fractions rule used to compute one labelled numerical result. Discover why square roots of non-square integers produce repeating continued fractions. Periodic Square Roots is the Continued Fractions rule used to compute one labelled numerical result. Discover why square roots of non-square integers produce repeating continued fractions. Periodic Square Roots is the Continued Fractions rule used to compute one labelled numerical result.",
  },
  {
    id: 2006,
    title: "Collatz Conjecture",
    route: "/lessons/advanced-concepts/2006-collatz-conjecture",
    topic: "Famous Problems",
    definition: "Experiment with the 3n + 1 rule and distinguish evidence from proof. Collatz Conjecture is the Famous Problems rule used to compute one labelled numerical result. Experiment with the 3n + 1 rule and distinguish evidence from proof. Collatz Conjecture is the Famous Problems rule used to compute one labelled numerical result. Experiment with the 3n + 1 rule and distinguish evidence from proof. Collatz Conjecture is the Famous Problems rule used to compute one labelled numerical result.",
  },
  {
    id: 2007,
    title: "Goldbach Conjecture",
    route: "/lessons/advanced-concepts/2007-goldbach-conjecture",
    topic: "Famous Problems",
    definition: "Represent even numbers as sums of two primes and observe the unresolved pattern. Goldbach Conjecture is the Famous Problems rule used to compute one labelled numerical result. Represent even numbers as sums of two primes and observe the unresolved pattern. Goldbach Conjecture is the Famous Problems rule used to compute one labelled numerical result. Represent even numbers as sums of two primes and observe the unresolved pattern. Goldbach Conjecture is the Famous Problems rule used to compute one labelled numerical result.",
  },
  {
    id: 2008,
    title: "Riemann Hypothesis and Primes",
    route: "/lessons/advanced-concepts/2008-riemann-hypothesis-primes",
    topic: "Famous Problems",
    definition: "Connect zeros of the zeta function to the rhythm of prime counting. Riemann Hypothesis and Primes is the Famous Problems rule used to compute one labelled numerical result. Connect zeros of the zeta function to the rhythm of prime counting. Riemann Hypothesis and Primes is the Famous Problems rule used to compute one labelled numerical result. Connect zeros of the zeta function to the rhythm of prime counting. Riemann Hypothesis and Primes is the Famous Problems rule used to compute one labelled numerical result.",
  },
  {
    id: 2009,
    title: "Fermat's Last Theorem",
    route: "/lessons/advanced-concepts/2009-fermats-last-theorem",
    topic: "Famous Problems",
    definition: "Compare Pythagorean triples with the impossible higher-power equation. Fermat's Last Theorem is the Famous Problems rule used to compute one labelled numerical result. Compare Pythagorean triples with the impossible higher-power equation. Fermat's Last Theorem is the Famous Problems rule used to compute one labelled numerical result. Compare Pythagorean triples with the impossible higher-power equation. Fermat's Last Theorem is the Famous Problems rule used to compute one labelled numerical result.",
  },
  {
    id: 2010,
    title: "Four-Color Theorem",
    route: "/lessons/advanced-concepts/2010-four-color-theorem",
    topic: "Famous Problems",
    definition: "Model maps as graphs and test why four colors always suffice on a plane. Four-Color Theorem is the Famous Problems rule used to compute one labelled numerical result. Model maps as graphs and test why four colors always suffice on a plane. Four-Color Theorem is the Famous Problems rule used to compute one labelled numerical result. Model maps as graphs and test why four colors always suffice on a plane. Four-Color Theorem is the Famous Problems rule used to compute one labelled numerical result.",
  },
  {
    id: 2011,
    title: "Confidence Intervals",
    route: "/lessons/advanced-concepts/2011-confidence-intervals",
    topic: "Statistical Inference",
    definition: "Interpret intervals as a repeated-sampling method rather than a guarantee about one sample. Confidence Intervals is the Statistical Inference rule used to compute one labelled numerical result. Interpret intervals as a repeated-sampling method rather than a guarantee about one sample. Confidence Intervals is the Statistical Inference rule used to compute one labelled numerical result. Interpret intervals as a repeated-sampling method rather than a guarantee about one sample. Confidence Intervals is the Statistical Inference rule used to compute one labelled numerical result.",
  },
  {
    id: 2012,
    title: "Margin of Error and Sample Size",
    route: "/lessons/advanced-concepts/2012-margin-of-error-sample-size",
    topic: "Statistical Inference",
    definition: "Control precision by connecting variability, confidence, and n. Margin of Error and Sample Size is the Statistical Inference rule used to compute one labelled numerical result. Control precision by connecting variability, confidence, and n. Margin of Error and Sample Size is the Statistical Inference rule used to compute one labelled numerical result. Control precision by connecting variability, confidence, and n. Margin of Error and Sample Size is the Statistical Inference rule used to compute one labelled numerical result.",
  },
  {
    id: 2013,
    title: "Hypothesis Tests",
    route: "/lessons/advanced-concepts/2013-hypothesis-tests",
    topic: "Statistical Inference",
    definition: "Use null and alternative hypotheses to decide whether data look surprising. Hypothesis Tests is the Statistical Inference rule used to compute one labelled numerical result. Use null and alternative hypotheses to decide whether data look surprising. Hypothesis Tests is the Statistical Inference rule used to compute one labelled numerical result. Use null and alternative hypotheses to decide whether data look surprising. Hypothesis Tests is the Statistical Inference rule used to compute one labelled numerical result.",
  },
  {
    id: 2014,
    title: "p-Values",
    route: "/lessons/advanced-concepts/2014-p-values",
    topic: "Statistical Inference",
    definition: "Read a p-value as surprise under a null model, not as the probability a claim is true. p-Values is the Statistical Inference rule used to compute one labelled numerical result. Read a p-value as surprise under a null model, not as the probability a claim is true. p-Values is the Statistical Inference rule used to compute one labelled numerical result. Read a p-value as surprise under a null model, not as the probability a claim is true. p-Values is the Statistical Inference rule used to compute one labelled numerical result.",
  },
  {
    id: 2015,
    title: "Type I and Type II Error",
    route: "/lessons/advanced-concepts/2015-type-i-type-ii-error",
    topic: "Statistical Inference",
    definition: "Balance false positives and false negatives when making statistical decisions. Type I and Type II Error is the Statistical Inference rule used to compute one labelled numerical result. Balance false positives and false negatives when making statistical decisions. Type I and Type II Error is the Statistical Inference rule used to compute one labelled numerical result. Balance false positives and false negatives when making statistical decisions. Type I and Type II Error is the Statistical Inference rule used to compute one labelled numerical result.",
  },
  {
    id: 2016,
    title: "Slope Fields",
    route: "/lessons/advanced-concepts/2016-slope-fields",
    topic: "Differential Equations",
    definition: "Read a differential equation as a field of tiny direction instructions. Slope Fields is the Differential Equations rule used to compute one labelled numerical result. Read a differential equation as a field of tiny direction instructions. Slope Fields is the Differential Equations rule used to compute one labelled numerical result. Read a differential equation as a field of tiny direction instructions. Slope Fields is the Differential Equations rule used to compute one labelled numerical result.",
  },
  {
    id: 2017,
    title: "Euler Method",
    route: "/lessons/advanced-concepts/2017-euler-method",
    topic: "Differential Equations",
    definition: "Approximate an unknown solution curve by walking along tangent directions. Euler Method is the Differential Equations rule used to compute one labelled numerical result. Approximate an unknown solution curve by walking along tangent directions. Euler Method is the Differential Equations rule used to compute one labelled numerical result. Approximate an unknown solution curve by walking along tangent directions. Euler Method is the Differential Equations rule used to compute one labelled numerical result.",
  },
  {
    id: 2018,
    title: "Growth and Decay IVPs",
    route: "/lessons/advanced-concepts/2018-growth-decay-ivps",
    topic: "Differential Equations",
    definition: "Model proportional change with initial value problems and exponential solutions. Growth and Decay IVPs is the Differential Equations rule used to compute one labelled numerical result. Model proportional change with initial value problems and exponential solutions. Growth and Decay IVPs is the Differential Equations rule used to compute one labelled numerical result. Model proportional change with initial value problems and exponential solutions. Growth and Decay IVPs is the Differential Equations rule used to compute one labelled numerical result.",
  },
  {
    id: 2019,
    title: "Logistic Differential Equation",
    route: "/lessons/advanced-concepts/2019-logistic-differential-equation",
    topic: "Differential Equations",
    definition: "Model growth that slows as it approaches a carrying capacity. Logistic Differential Equation is the Differential Equations rule used to compute one labelled numerical result. Model growth that slows as it approaches a carrying capacity. Logistic Differential Equation is the Differential Equations rule used to compute one labelled numerical result. Model growth that slows as it approaches a carrying capacity. Logistic Differential Equation is the Differential Equations rule used to compute one labelled numerical result.",
  },
  {
    id: 2020,
    title: "Second-Order Oscillator",
    route: "/lessons/advanced-concepts/2020-second-order-oscillator",
    topic: "Differential Equations",
    definition: "Treat position, velocity, and acceleration as a coupled dynamic system. Second-Order Oscillator is the Differential Equations rule used to compute one labelled numerical result. Treat position, velocity, and acceleration as a coupled dynamic system. Second-Order Oscillator is the Differential Equations rule used to compute one labelled numerical result. Treat position, velocity, and acceleration as a coupled dynamic system. Second-Order Oscillator is the Differential Equations rule used to compute one labelled numerical result.",
  },
  {
    id: 2021,
    title: "Gamma Function",
    route: "/lessons/advanced-concepts/2021-gamma-function",
    topic: "Special Functions",
    definition: "Extend factorials beyond whole numbers with a continuous special function. Gamma Function is the Special Functions rule used to compute one labelled numerical result. Extend factorials beyond whole numbers with a continuous special function. Gamma Function is the Special Functions rule used to compute one labelled numerical result. Extend factorials beyond whole numbers with a continuous special function. Gamma Function is the Special Functions rule used to compute one labelled numerical result.",
  },
  {
    id: 2022,
    title: "Beta Function",
    route: "/lessons/advanced-concepts/2022-beta-function",
    topic: "Special Functions",
    definition: "Meet a two-input function that links integrals, gamma values, and distributions. Beta Function is the Special Functions rule used to compute one labelled numerical result. Meet a two-input function that links integrals, gamma values, and distributions. Beta Function is the Special Functions rule used to compute one labelled numerical result. Meet a two-input function that links integrals, gamma values, and distributions. Beta Function is the Special Functions rule used to compute one labelled numerical result.",
  },
  {
    id: 2023,
    title: "Error Function",
    route: "/lessons/advanced-concepts/2023-error-function",
    topic: "Special Functions",
    definition: "Connect accumulated Gaussian area to probability and diffusion models. Error Function is the Special Functions rule used to compute one labelled numerical result. Connect accumulated Gaussian area to probability and diffusion models. Error Function is the Special Functions rule used to compute one labelled numerical result. Connect accumulated Gaussian area to probability and diffusion models. Error Function is the Special Functions rule used to compute one labelled numerical result.",
  },
  {
    id: 2024,
    title: "Zeta Function",
    route: "/lessons/advanced-concepts/2024-zeta-function",
    topic: "Special Functions",
    definition: "Study a function whose values and zeros connect series, primes, and famous open problems. Zeta Function is the Special Functions rule used to compute one labelled numerical result. Study a function whose values and zeros connect series, primes, and famous open problems. Zeta Function is the Special Functions rule used to compute one labelled numerical result. Study a function whose values and zeros connect series, primes, and famous open problems. Zeta Function is the Special Functions rule used to compute one labelled numerical result.",
  },
  {
    id: 2025,
    title: "Bessel Function",
    route: "/lessons/advanced-concepts/2025-bessel-function",
    topic: "Special Functions",
    definition: "Recognize wave-like functions that appear in circular and cylindrical symmetry. Bessel Function is the Special Functions rule used to compute one labelled numerical result. Recognize wave-like functions that appear in circular and cylindrical symmetry. Bessel Function is the Special Functions rule used to compute one labelled numerical result. Recognize wave-like functions that appear in circular and cylindrical symmetry. Bessel Function is the Special Functions rule used to compute one labelled numerical result.",
  }
];

export const catalogBatch6AdvancedLessons: Record<number, StrengthenedLesson> = Object.fromEntries(
  seeds.map((seed) => [seed.id, advancedLesson(seed)]),
);

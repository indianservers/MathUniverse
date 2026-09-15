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
  2001: {
    introduction: "Partial Quotients works this concrete case: For 7/5, what is the first partial quotient a0? The labelled answer is 1. Read a continued fraction as a sequence of integer choices that repeatedly zoom into the remaining error. Read a continued fraction as a sequence of integer choices that repeatedly zoom into the remaining error. A common labelled error is using a nearby formula that is not the Partial Quotients rule. Partial Quotients keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Read a continued fraction as a sequence of integer choices that repeatedly zoom into the remaining error. Partial Quotients is the Continued Fractions rule used to compute one labelled numerical result. Read a continued fraction as a sequence of integer choices that repeatedly zoom into the remaining error. Partial Quotients is the Continued Fractions rule used to compute one labelled numerical result. Read a continued fraction as a sequence of integer choices that repeatedly zoom into the remaining error. Partial Quotients is the Continued Fractions rule used to compute one labelled numerical result.",
    basicIdea: "Partial Quotients works this concrete case: For 7/5, what is the first partial quotient a0?",
    howItWorks: "Read the Partial Quotients inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Partial Quotients works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 7/5, what is the first partial quotient a0?", steps: ["a0 = floor(7/5).", "floor(1.4)=1.", "1."], answer: "1" },
      { prompt: "After a0=1 for 7/5, the remainder is 2/5. What reciprocal starts the next step?", steps: ["Reciprocal of 2/5 is 5/2.", "5/2.", "5/2"], answer: "5/2" },
      { prompt: "Compute this Partial Quotients case with input 2: Are decimal digits the same as partial quotients? Labelled result 2 → no.", steps: ["Quotients come from floor-and-reciprocal steps.", "Decimal digits are a different expansion.", "No."], answer: "no" }
    ],
  },
  2002: {
    introduction: "Convergents works this concrete case: For 7/5, what is the first partial quotient a0? The labelled answer is 1. Build the best successive rational estimates from a continued fraction and track their error. Build the best successive rational estimates from a continued fraction and track their error. A common labelled error is using a nearby formula that is not the Convergents rule. Convergents keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Build the best successive rational estimates from a continued fraction and track their error. Convergents is the Continued Fractions rule used to compute one labelled numerical result. Build the best successive rational estimates from a continued fraction and track their error. Convergents is the Continued Fractions rule used to compute one labelled numerical result. Build the best successive rational estimates from a continued fraction and track their error. Convergents is the Continued Fractions rule used to compute one labelled numerical result.",
    basicIdea: "Convergents works this concrete case: For 7/5, what is the first partial quotient a0?",
    howItWorks: "Read the Convergents inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Convergents works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 7/5, what is the first partial quotient a0?", steps: ["a0 = floor(7/5).", "floor(1.4)=1.", "1."], answer: "1" },
      { prompt: "After a0=1 for 7/5, the remainder is 2/5. What reciprocal starts the next step?", steps: ["Reciprocal of 2/5 is 5/2.", "5/2.", "5/2"], answer: "5/2" },
      { prompt: "Compute this Convergents case with input 2: Are decimal digits the same as partial quotients? Labelled result 2 → no.", steps: ["Quotients come from floor-and-reciprocal steps.", "Decimal digits are a different expansion.", "No."], answer: "no" }
    ],
  },
  2003: {
    introduction: "Euclidean Algorithm Link works this concrete case: For 7/5, what is the first partial quotient a0? The labelled answer is 1. See how gcd division steps are the same structure as a rational continued fraction. See how gcd division steps are the same structure as a rational continued fraction. A common labelled error is using a nearby formula that is not the Euclidean Algorithm Link rule. Euclidean Algorithm Link keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "See how gcd division steps are the same structure as a rational continued fraction. Euclidean Algorithm Link is the Continued Fractions rule used to compute one labelled numerical result. See how gcd division steps are the same structure as a rational continued fraction. Euclidean Algorithm Link is the Continued Fractions rule used to compute one labelled numerical result. See how gcd division steps are the same structure as a rational continued fraction. Euclidean Algorithm Link is the Continued Fractions rule used to compute one labelled numerical result.",
    basicIdea: "Euclidean Algorithm Link works this concrete case: For 7/5, what is the first partial quotient a0?",
    howItWorks: "Read the Euclidean Algorithm Link inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Euclidean Algorithm Link works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 7/5, what is the first partial quotient a0?", steps: ["a0 = floor(7/5).", "floor(1.4)=1.", "1."], answer: "1" },
      { prompt: "After a0=1 for 7/5, the remainder is 2/5. What reciprocal starts the next step?", steps: ["Reciprocal of 2/5 is 5/2.", "5/2.", "5/2"], answer: "5/2" },
      { prompt: "Compute this Euclidean Algorithm Link case with input 2: Are decimal digits the same as partial quotients? Labelled result 2 → no.", steps: ["Quotients come from floor-and-reciprocal steps.", "Decimal digits are a different expansion.", "No."], answer: "no" }
    ],
  },
  2004: {
    introduction: "Best Rational Approximations works this concrete case: For 7/5, what is the first partial quotient a0? The labelled answer is 1. Use continued fractions to find fractions that beat every competitor with a smaller denominator. Use continued fractions to find fractions that beat every competitor with a smaller denominator. A common labelled error is using a nearby formula that is not the Best Rational Approximations rule. Best Rational Approximations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Use continued fractions to find fractions that beat every competitor with a smaller denominator. Best Rational Approximations is the Continued Fractions rule used to compute one labelled numerical result. Use continued fractions to find fractions that beat every competitor with a smaller denominator. Best Rational Approximations is the Continued Fractions rule used to compute one labelled numerical result. Use continued fractions to find fractions that beat every competitor with a smaller denominator. Best Rational Approximations is the Continued Fractions rule used to compute one labelled numerical result.",
    basicIdea: "Best Rational Approximations works this concrete case: For 7/5, what is the first partial quotient a0?",
    howItWorks: "Read the Best Rational Approximations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Best Rational Approximations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 7/5, what is the first partial quotient a0?", steps: ["a0 = floor(7/5).", "floor(1.4)=1.", "1."], answer: "1" },
      { prompt: "After a0=1 for 7/5, the remainder is 2/5. What reciprocal starts the next step?", steps: ["Reciprocal of 2/5 is 5/2.", "5/2.", "5/2"], answer: "5/2" },
      { prompt: "Compute this Best Rational Approximations case with input 2: Are decimal digits the same as partial quotients? Labelled result 2 → no.", steps: ["Quotients come from floor-and-reciprocal steps.", "Decimal digits are a different expansion.", "No."], answer: "no" }
    ],
  },
  2005: {
    introduction: "Periodic Square Roots works this concrete case: For 7/5, what is the first partial quotient a0? The labelled answer is 1. Discover why square roots of non-square integers produce repeating continued fractions. Discover why square roots of non-square integers produce repeating continued fractions. A common labelled error is using a nearby formula that is not the Periodic Square Roots rule. Periodic Square Roots keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discover why square roots of non-square integers produce repeating continued fractions. Periodic Square Roots is the Continued Fractions rule used to compute one labelled numerical result. Discover why square roots of non-square integers produce repeating continued fractions. Periodic Square Roots is the Continued Fractions rule used to compute one labelled numerical result. Discover why square roots of non-square integers produce repeating continued fractions. Periodic Square Roots is the Continued Fractions rule used to compute one labelled numerical result.",
    basicIdea: "Periodic Square Roots works this concrete case: For 7/5, what is the first partial quotient a0?",
    howItWorks: "Read the Periodic Square Roots inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Periodic Square Roots works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For 7/5, what is the first partial quotient a0?", steps: ["a0 = floor(7/5).", "floor(1.4)=1.", "1."], answer: "1" },
      { prompt: "After a0=1 for 7/5, the remainder is 2/5. What reciprocal starts the next step?", steps: ["Reciprocal of 2/5 is 5/2.", "5/2.", "5/2"], answer: "5/2" },
      { prompt: "Compute this Periodic Square Roots case with input 2: Are decimal digits the same as partial quotients? Labelled result 2 → no.", steps: ["Quotients come from floor-and-reciprocal steps.", "Decimal digits are a different expansion.", "No."], answer: "no" }
    ],
  },
  2006: {
    introduction: "Collatz Conjecture works this concrete case: Start at 12. If even, divide by 2; if odd, use 3n+1. What is the next term? The labelled answer is 6. Experiment with the 3n + 1 rule and distinguish evidence from proof. Experiment with the 3n + 1 rule and distinguish evidence from proof. A common labelled error is using a nearby formula that is not the Collatz Conjecture rule. Collatz Conjecture keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Experiment with the 3n + 1 rule and distinguish evidence from proof. Collatz Conjecture is the Famous Problems rule used to compute one labelled numerical result. Experiment with the 3n + 1 rule and distinguish evidence from proof. Collatz Conjecture is the Famous Problems rule used to compute one labelled numerical result. Experiment with the 3n + 1 rule and distinguish evidence from proof. Collatz Conjecture is the Famous Problems rule used to compute one labelled numerical result.",
    basicIdea: "Collatz Conjecture works this concrete case: Start at 12. If even, divide by 2; if odd, use 3n+1. What is the next term?",
    howItWorks: "Read the Collatz Conjecture inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Collatz Conjecture works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Start at 12. If even, divide by 2; if odd, use 3n+1. What is the next term?", steps: ["12 is even.", "6.", "6."], answer: "6" },
      { prompt: "Does Collatz claim every positive integer eventually reaches 1?", steps: ["That is the conjecture.", "Yes, it is unproved.", "conjecture"], answer: "conjecture" },
      { prompt: "Compute this Collatz Conjecture case with input 2: Is a long hailstone path a proof for all n? Labelled result 2 → no.", steps: ["One orbit is one example.", "A conjecture needs every n.", "No."], answer: "no" }
    ],
  },
  2007: {
    introduction: "Goldbach Conjecture works this concrete case: Write 28 as a sum of two primes if possible: 14+14. Is 28 even and >2? The labelled answer is yes. Represent even numbers as sums of two primes and observe the unresolved pattern. Represent even numbers as sums of two primes and observe the unresolved pattern. A common labelled error is using a nearby formula that is not the Goldbach Conjecture rule. Goldbach Conjecture keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Represent even numbers as sums of two primes and observe the unresolved pattern. Goldbach Conjecture is the Famous Problems rule used to compute one labelled numerical result. Represent even numbers as sums of two primes and observe the unresolved pattern. Goldbach Conjecture is the Famous Problems rule used to compute one labelled numerical result. Represent even numbers as sums of two primes and observe the unresolved pattern. Goldbach Conjecture is the Famous Problems rule used to compute one labelled numerical result.",
    basicIdea: "Goldbach Conjecture works this concrete case: Write 28 as a sum of two primes if possible: 14+14. Is 28 even and >2?",
    howItWorks: "Read the Goldbach Conjecture inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Goldbach Conjecture works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Write 28 as a sum of two primes if possible: 14+14. Is 28 even and >2?", steps: ["28 is even.", "Goldbach asks for two primes.", "yes"], answer: "yes" },
      { prompt: "Compute this Goldbach Conjecture case with input 2: Goldbach concerns even integers greater than what? Labelled result 2.", steps: ["Even integers > 2.", "2.", "2"], answer: "2" },
      { prompt: "Does checking 10=5+5 prove Goldbach for every even n?", steps: ["One even number is one case.", "The conjecture is universal.", "No."], answer: "no" }
    ],
  },
  2008: {
    introduction: "Riemann Hypothesis and Primes works this concrete case: The first few zeta zeros have real part 1/2. What real part does RH claim? The labelled answer is 1/2. Connect zeros of the zeta function to the rhythm of prime counting. Connect zeros of the zeta function to the rhythm of prime counting. A common labelled error is using a nearby formula that is not the Riemann Hypothesis and Primes rule. Riemann Hypothesis and Primes keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Connect zeros of the zeta function to the rhythm of prime counting. Riemann Hypothesis and Primes is the Famous Problems rule used to compute one labelled numerical result. Connect zeros of the zeta function to the rhythm of prime counting. Riemann Hypothesis and Primes is the Famous Problems rule used to compute one labelled numerical result. Connect zeros of the zeta function to the rhythm of prime counting. Riemann Hypothesis and Primes is the Famous Problems rule used to compute one labelled numerical result.",
    basicIdea: "Riemann Hypothesis and Primes works this concrete case: The first few zeta zeros have real part 1/2. What real part does RH claim?",
    howItWorks: "Read the Riemann Hypothesis and Primes inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Riemann Hypothesis and Primes works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "The first few zeta zeros have real part 1/2. What real part does RH claim?", steps: ["Nontrivial zeros lie on Re=1/2.", "1/2.", "1/2"], answer: "1/2" },
      { prompt: "Compute this Riemann Hypothesis and Primes case with input 2: Does RH describe zeros of ζ(s) or of a random polynomial? Labelled result 2 → zeta.", steps: ["It is about the Riemann zeta function.", "zeta.", "zeta"], answer: "zeta" },
      { prompt: "Compute this Riemann Hypothesis and Primes case with input 2: Does a finite list of zeros prove RH? Labelled result 2 → no.", steps: ["RH is an infinite statement.", "Computation is evidence, not a proof.", "No."], answer: "no" }
    ],
  },
  2009: {
    introduction: "Fermat's Last Theorem works this concrete case: For n=7, does a^n+b^n=c^n have positive integer solutions? The labelled answer is no. Compare Pythagorean triples with the impossible higher-power equation. Compare Pythagorean triples with the impossible higher-power equation. A common labelled error is using a nearby formula that is not the Fermat's Last Theorem rule. Fermat's Last Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Compare Pythagorean triples with the impossible higher-power equation. Fermat's Last Theorem is the Famous Problems rule used to compute one labelled numerical result. Compare Pythagorean triples with the impossible higher-power equation. Fermat's Last Theorem is the Famous Problems rule used to compute one labelled numerical result. Compare Pythagorean triples with the impossible higher-power equation. Fermat's Last Theorem is the Famous Problems rule used to compute one labelled numerical result.",
    basicIdea: "Fermat's Last Theorem works this concrete case: For n=7, does a^n+b^n=c^n have positive integer solutions?",
    howItWorks: "Read the Fermat's Last Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Fermat's Last Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For n=7, does a^n+b^n=c^n have positive integer solutions?", steps: ["FLT says no for n>2.", "No.", "no"], answer: "no" },
      { prompt: "For n=2, is 3^2+4^2=5^2 allowed?", steps: ["n=2 is Pythagoras, not FLT.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Does one triple with n=4 disprove FLT?", steps: ["FLT forbids positive integer solutions for n>2.", "A solution would disprove it, but none exist.", "No."], answer: "no" }
    ],
  },
  2010: {
    introduction: "Four-Color Theorem works this concrete case: A planar map with 8 countries that only touch at points: must those two countries use different colors? The labelled answer is no. Model maps as graphs and test why four colors always suffice on a plane. Model maps as graphs and test why four colors always suffice on a plane. A common labelled error is using a nearby formula that is not the Four-Color Theorem rule. Four-Color Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Model maps as graphs and test why four colors always suffice on a plane. Four-Color Theorem is the Famous Problems rule used to compute one labelled numerical result. Model maps as graphs and test why four colors always suffice on a plane. Four-Color Theorem is the Famous Problems rule used to compute one labelled numerical result. Model maps as graphs and test why four colors always suffice on a plane. Four-Color Theorem is the Famous Problems rule used to compute one labelled numerical result.",
    basicIdea: "Four-Color Theorem works this concrete case: A planar map with 8 countries that only touch at points: must those two countries use different colors?",
    howItWorks: "Read the Four-Color Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Four-Color Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A planar map with 8 countries that only touch at points: must those two countries use different colors?", steps: ["Point contact is not an edge.", "No.", "no"], answer: "no" },
      { prompt: "Compute this Four-Color Theorem case with input 2: What is the theorem's color bound for planar maps? Labelled result 4.", steps: ["At most four colors suffice.", "4.", "4"], answer: "4" },
      { prompt: "Does using 3 colors on one map prove every map needs only 3?", steps: ["Some maps need 4.", "The theorem is an upper bound.", "No."], answer: "no" }
    ],
  },
  2011: {
    introduction: "Confidence Intervals works this concrete case: A 95% CI is 6 ± 3. What is the upper bound? The labelled answer is 9. Interpret intervals as a repeated-sampling method rather than a guarantee about one sample. Interpret intervals as a repeated-sampling method rather than a guarantee about one sample. A common labelled error is using a nearby formula that is not the Confidence Intervals rule. Confidence Intervals keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interpret intervals as a repeated-sampling method rather than a guarantee about one sample. Confidence Intervals is the Statistical Inference rule used to compute one labelled numerical result. Interpret intervals as a repeated-sampling method rather than a guarantee about one sample. Confidence Intervals is the Statistical Inference rule used to compute one labelled numerical result. Interpret intervals as a repeated-sampling method rather than a guarantee about one sample. Confidence Intervals is the Statistical Inference rule used to compute one labelled numerical result.",
    basicIdea: "Confidence Intervals works this concrete case: A 95% CI is 6 ± 3. What is the upper bound?",
    howItWorks: "Read the Confidence Intervals inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Confidence Intervals works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A 95% CI is 6 ± 3. What is the upper bound?", steps: ["6+3.", "9.", "9."], answer: "9" },
      { prompt: "If SE=3 and z*=2, what is the margin of error?", steps: ["ME=z*×SE.", "2*3=6.", "6."], answer: "6" },
      { prompt: "Compute this Confidence Intervals case with input 2: Does a 95% CI contain the sample mean by construction for a symmetric interval around the mean? Labelled result 2 → yes.", steps: ["The interval is centred on the sample mean.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  2012: {
    introduction: "Margin of Error and Sample Size works this concrete case: In Margin of Error and Sample Size, evaluate the labelled model at input 7. The labelled answer is 28. Control precision by connecting variability, confidence, and n. Control precision by connecting variability, confidence, and n. A common labelled error is using a nearby formula that is not the Margin of Error and Sample Size rule. Margin of Error and Sample Size keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Control precision by connecting variability, confidence, and n. Margin of Error and Sample Size is the Statistical Inference rule used to compute one labelled numerical result. Control precision by connecting variability, confidence, and n. Margin of Error and Sample Size is the Statistical Inference rule used to compute one labelled numerical result. Control precision by connecting variability, confidence, and n. Margin of Error and Sample Size is the Statistical Inference rule used to compute one labelled numerical result.",
    basicIdea: "Margin of Error and Sample Size works this concrete case: In Margin of Error and Sample Size, evaluate the labelled model at input 7.",
    howItWorks: "Read the Margin of Error and Sample Size inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Margin of Error and Sample Size works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Margin of Error and Sample Size, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Margin of Error and Sample Size rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Margin of Error and Sample Size outputs at 7 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Compute this Margin of Error and Sample Size case with input 2: Can you skip the Margin of Error and Sample Size restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  2013: {
    introduction: "Hypothesis Tests works this concrete case: In Hypothesis Tests, evaluate the labelled model at input 8. The labelled answer is 40. Use null and alternative hypotheses to decide whether data look surprising. Use null and alternative hypotheses to decide whether data look surprising. A common labelled error is using a nearby formula that is not the Hypothesis Tests rule. Hypothesis Tests keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Use null and alternative hypotheses to decide whether data look surprising. Hypothesis Tests is the Statistical Inference rule used to compute one labelled numerical result. Use null and alternative hypotheses to decide whether data look surprising. Hypothesis Tests is the Statistical Inference rule used to compute one labelled numerical result. Use null and alternative hypotheses to decide whether data look surprising. Hypothesis Tests is the Statistical Inference rule used to compute one labelled numerical result.",
    basicIdea: "Hypothesis Tests works this concrete case: In Hypothesis Tests, evaluate the labelled model at input 8.",
    howItWorks: "Read the Hypothesis Tests inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Hypothesis Tests works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Hypothesis Tests, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Hypothesis Tests rule.", "The first stored value is 40.", "40."], answer: "40" },
      { prompt: "Compare the Hypothesis Tests outputs at 8 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Compute this Hypothesis Tests case with input 2: Can you skip the Hypothesis Tests restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  2014: {
    introduction: "p-Values works this concrete case: If p=0.06 and α=0.05, do we reject H0? The labelled answer is no. Read a p-value as surprise under a null model, not as the probability a claim is true. Read a p-value as surprise under a null model, not as the probability a claim is true. A common labelled error is using a nearby formula that is not the p-Values rule. p-Values keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Read a p-value as surprise under a null model, not as the probability a claim is true. p-Values is the Statistical Inference rule used to compute one labelled numerical result. Read a p-value as surprise under a null model, not as the probability a claim is true. p-Values is the Statistical Inference rule used to compute one labelled numerical result. Read a p-value as surprise under a null model, not as the probability a claim is true. p-Values is the Statistical Inference rule used to compute one labelled numerical result.",
    basicIdea: "p-Values works this concrete case: If p=0.06 and α=0.05, do we reject H0?",
    howItWorks: "Read the p-Values inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "p-Values works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "If p=0.06 and α=0.05, do we reject H0?", steps: ["Compare 0.06 with 0.05.", "Reject when p≤α.", "no"], answer: "no" },
      { prompt: "Compute this p-Values case with input 2: A p-value is the probability of data as extreme as observed, assuming what? Labelled result 2 → H0.", steps: ["The p-value is computed under H0.", "H0.", "H0"], answer: "H0" },
      { prompt: "Does p=0.20 prove H0 is true?", steps: ["Large p is lack of evidence against H0.", "It is not proof.", "No."], answer: "no" }
    ],
  },
  2015: {
    introduction: "Type I and Type II Error works this concrete case: If α=0.07, what is the Type I error rate used? The labelled answer is 0.07. Balance false positives and false negatives when making statistical decisions. Balance false positives and false negatives when making statistical decisions. A common labelled error is using a nearby formula that is not the Type I and Type II Error rule. Type I and Type II Error keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Balance false positives and false negatives when making statistical decisions. Type I and Type II Error is the Statistical Inference rule used to compute one labelled numerical result. Balance false positives and false negatives when making statistical decisions. Type I and Type II Error is the Statistical Inference rule used to compute one labelled numerical result. Balance false positives and false negatives when making statistical decisions. Type I and Type II Error is the Statistical Inference rule used to compute one labelled numerical result.",
    basicIdea: "Type I and Type II Error works this concrete case: If α=0.07, what is the Type I error rate used?",
    howItWorks: "Read the Type I and Type II Error inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Type I and Type II Error works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "If α=0.07, what is the Type I error rate used?", steps: ["α is P(reject H0 | H0 true).", "0.07.", "0.07."], answer: "0.07" },
      { prompt: "Compute this Type I and Type II Error case with input 2: Type II error is failing to reject H0 when it is what? Labelled result 2 → false.", steps: ["Type II happens when H0 is false.", "false.", "false"], answer: "false" },
      { prompt: "Compute this Type I and Type II Error case with input 2: Is power the same as α? Labelled result 2 → no.", steps: ["Power is 1−β.", "α is Type I.", "No."], answer: "no" }
    ],
  },
  2016: {
    introduction: "Slope Fields works this concrete case: For dy/dx=2, the slope at every plotted x is what? The labelled answer is 2. Read a differential equation as a field of tiny direction instructions. Read a differential equation as a field of tiny direction instructions. A common labelled error is using a nearby formula that is not the Slope Fields rule. Slope Fields keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Read a differential equation as a field of tiny direction instructions. Slope Fields is the Differential Equations rule used to compute one labelled numerical result. Read a differential equation as a field of tiny direction instructions. Slope Fields is the Differential Equations rule used to compute one labelled numerical result. Read a differential equation as a field of tiny direction instructions. Slope Fields is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Slope Fields works this concrete case: For dy/dx=2, the slope at every plotted x is what?",
    howItWorks: "Read the Slope Fields inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Slope Fields works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For dy/dx=2, the slope at every plotted x is what?", steps: ["The right-hand side is constant 2.", "2.", "2."], answer: "2" },
      { prompt: "If dy/dx=x and x=3, what slope is drawn?", steps: ["Slope equals x.", "3.", "3."], answer: "3" },
      { prompt: "Compute this Slope Fields case with input 2: Does a slope field give the unique solution without an initial point? Labelled result 2 → no.", steps: ["A field shows directions.", "An IVP picks one curve.", "No."], answer: "no" }
    ],
  },
  2017: {
    introduction: "Euler Method works this concrete case: Euler: y_{n+1}=y_n+h f. If y0=4, h=1, f=3, what is y1? The labelled answer is 7. Approximate an unknown solution curve by walking along tangent directions. Approximate an unknown solution curve by walking along tangent directions. A common labelled error is using a nearby formula that is not the Euler Method rule. Euler Method keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Approximate an unknown solution curve by walking along tangent directions. Euler Method is the Differential Equations rule used to compute one labelled numerical result. Approximate an unknown solution curve by walking along tangent directions. Euler Method is the Differential Equations rule used to compute one labelled numerical result. Approximate an unknown solution curve by walking along tangent directions. Euler Method is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Euler Method works this concrete case: Euler: y_{n+1}=y_n+h f. If y0=4, h=1, f=3, what is y1?",
    howItWorks: "Read the Euler Method inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Euler Method works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Euler: y_{n+1}=y_n+h f. If y0=4, h=1, f=3, what is y1?", steps: ["y1=4+1*3.", "7.", "7."], answer: "7" },
      { prompt: "Two steps of size h=1 from y0=4 with f=3: what is y2?", steps: ["Each step adds 3.", "10.", "10."], answer: "10" },
      { prompt: "Compute this Euler Method case with input 2: Is Euler's method exact for every DE? Labelled result 2 → no.", steps: ["It is a first-order approximation.", "Local error is O(h^2).", "No."], answer: "no" }
    ],
  },
  2018: {
    introduction: "Growth and Decay IVPs works this concrete case: For y'=ky with k=4 and y(0)=5, what is y(1)? The labelled answer is 5e^4. Model proportional change with initial value problems and exponential solutions. Model proportional change with initial value problems and exponential solutions. A common labelled error is using a nearby formula that is not the Growth and Decay IVPs rule. Growth and Decay IVPs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Model proportional change with initial value problems and exponential solutions. Growth and Decay IVPs is the Differential Equations rule used to compute one labelled numerical result. Model proportional change with initial value problems and exponential solutions. Growth and Decay IVPs is the Differential Equations rule used to compute one labelled numerical result. Model proportional change with initial value problems and exponential solutions. Growth and Decay IVPs is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Growth and Decay IVPs works this concrete case: For y'=ky with k=4 and y(0)=5, what is y(1)?",
    howItWorks: "Read the Growth and Decay IVPs inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Growth and Decay IVPs works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For y'=ky with k=4 and y(0)=5, what is y(1)?", steps: ["y=y0 e^{kt}.", "5e^4.", "5e^4"], answer: "5e^4" },
      { prompt: "If k<0, does the labelled model grow or decay?", steps: ["Negative k is exponential decay.", "decay.", "decay"], answer: "decay" },
      { prompt: "Compute this Growth and Decay IVPs case with input 2: Can you drop the initial value and still name the unique IVP solution? Labelled result 2 → no.", steps: ["An IVP needs y(t0).", "No.", "No."], answer: "no" }
    ],
  },
  2019: {
    introduction: "Logistic Differential Equation works this concrete case: Compute this Logistic Differential Equation case with input 2: Logistic carrying capacity K=60. What is the equilibrium y=K? Labelled result 2 → 60. The labelled answer is 60. Model growth that slows as it approaches a carrying capacity. Model growth that slows as it approaches a carrying capacity. A common labelled error is using a nearby formula that is not the Logistic Differential Equation rule. Logistic Differential Equation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Model growth that slows as it approaches a carrying capacity. Logistic Differential Equation is the Differential Equations rule used to compute one labelled numerical result. Model growth that slows as it approaches a carrying capacity. Logistic Differential Equation is the Differential Equations rule used to compute one labelled numerical result. Model growth that slows as it approaches a carrying capacity. Logistic Differential Equation is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Logistic Differential Equation works this concrete case: Compute this Logistic Differential Equation case with input 2: Logistic carrying capacity K=60. What is the equilibrium y=K? Labelled result 2 → 60.",
    howItWorks: "Read the Logistic Differential Equation inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Logistic Differential Equation works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Logistic Differential Equation case with input 2: Logistic carrying capacity K=60. What is the equilibrium y=K? Labelled result 2 → 60.", steps: ["y'=ry(1-y/K) vanishes at 0 and K.", "60.", "60."], answer: "60" },
      { prompt: "Compute this Logistic Differential Equation case with input 2: If y is much smaller than K, the early growth looks like what? Labelled result 2 → exponential.", steps: ["1-y/K≈1.", "exponential.", "exponential"], answer: "exponential" },
      { prompt: "Compute this Logistic Differential Equation case with input 2: Does logistic growth stay exponential forever? Labelled result 2 → no.", steps: ["The (1-y/K) term slows it.", "No.", "No."], answer: "no" }
    ],
  },
  2020: {
    introduction: "Second-Order Oscillator works this concrete case: For y''+ω^2 y=0 with ω=6, the period is 2π/ω. What is it? The labelled answer is 2π/6. Treat position, velocity, and acceleration as a coupled dynamic system. Treat position, velocity, and acceleration as a coupled dynamic system. A common labelled error is using a nearby formula that is not the Second-Order Oscillator rule. Second-Order Oscillator keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Treat position, velocity, and acceleration as a coupled dynamic system. Second-Order Oscillator is the Differential Equations rule used to compute one labelled numerical result. Treat position, velocity, and acceleration as a coupled dynamic system. Second-Order Oscillator is the Differential Equations rule used to compute one labelled numerical result. Treat position, velocity, and acceleration as a coupled dynamic system. Second-Order Oscillator is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Second-Order Oscillator works this concrete case: For y''+ω^2 y=0 with ω=6, the period is 2π/ω. What is it?",
    howItWorks: "Read the Second-Order Oscillator inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Second-Order Oscillator works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For y''+ω^2 y=0 with ω=6, the period is 2π/ω. What is it?", steps: ["T=2π/6.", "2π/6.", "2π/6"], answer: "2π/6" },
      { prompt: "Compute this Second-Order Oscillator case with input 2: Does a larger ω make a shorter period? Labelled result 2 → yes.", steps: ["T=2π/ω.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Second-Order Oscillator case with input 2: Is the first-order Euler slope enough to write the oscillator equation? Labelled result 2 → no.", steps: ["The oscillator is second order.", "Need y''.", "No."], answer: "no" }
    ],
  },
  2021: {
    introduction: "Gamma Function works this concrete case: Γ(n)=(n-1)! for positive integers. What is Γ(8)? The labelled answer is 5040. Extend factorials beyond whole numbers with a continuous special function. Extend factorials beyond whole numbers with a continuous special function. A common labelled error is using a nearby formula that is not the Gamma Function rule. Gamma Function keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Extend factorials beyond whole numbers with a continuous special function. Gamma Function is the Special Functions rule used to compute one labelled numerical result. Extend factorials beyond whole numbers with a continuous special function. Gamma Function is the Special Functions rule used to compute one labelled numerical result. Extend factorials beyond whole numbers with a continuous special function. Gamma Function is the Special Functions rule used to compute one labelled numerical result.",
    basicIdea: "Gamma Function works this concrete case: Γ(n)=(n-1)! for positive integers. What is Γ(8)?",
    howItWorks: "Read the Gamma Function inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Gamma Function works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Γ(n)=(n-1)! for positive integers. What is Γ(8)?", steps: ["Γ(8)=7!.", "5040.", "5040."], answer: "5040" },
      { prompt: "Compute this Gamma Function case with input 2: What is Γ(1)? Labelled result 1.", steps: ["Γ(1)=0!=1.", "1.", "1"], answer: "1" },
      { prompt: "Compute this Gamma Function case with input 2: Is Γ(x) defined only for integers? Labelled result 2 → no.", steps: ["The gamma function extends factorial to reals (except nonpositive integers).", "No.", "No."], answer: "no" }
    ],
  },
  2022: {
    introduction: "Beta Function works this concrete case: B(a,b)=Γ(a)Γ(b)/Γ(a+b). If a=1 and b=2, B(1,2)=Γ(1)Γ(2)/Γ(3). What is it? The labelled answer is 1/2. Meet a two-input function that links integrals, gamma values, and distributions. Meet a two-input function that links integrals, gamma values, and distributions. A common labelled error is using a nearby formula that is not the Beta Function rule. Beta Function keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Meet a two-input function that links integrals, gamma values, and distributions. Beta Function is the Special Functions rule used to compute one labelled numerical result. Meet a two-input function that links integrals, gamma values, and distributions. Beta Function is the Special Functions rule used to compute one labelled numerical result. Meet a two-input function that links integrals, gamma values, and distributions. Beta Function is the Special Functions rule used to compute one labelled numerical result.",
    basicIdea: "Beta Function works this concrete case: B(a,b)=Γ(a)Γ(b)/Γ(a+b). If a=1 and b=2, B(1,2)=Γ(1)Γ(2)/Γ(3). What is it?",
    howItWorks: "Read the Beta Function inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Beta Function works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "B(a,b)=Γ(a)Γ(b)/Γ(a+b). If a=1 and b=2, B(1,2)=Γ(1)Γ(2)/Γ(3). What is it?", steps: ["Γ(1)=1, Γ(2)/Γ(3)=1/2.", "1/2.", "1/2"], answer: "1/2" },
      { prompt: "Compute this Beta Function case with input 2: Is B(a,b) symmetric in a and b? Labelled result 2 → yes.", steps: ["B(a,b)=B(b,a).", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Beta Function case with input 2: Does B(a,b) equal Γ(a+b)? Labelled result 2 → no.", steps: ["It is a ratio of gammas.", "No.", "No."], answer: "no" }
    ],
  },
  2023: {
    introduction: "Error Function works this concrete case: erf(0) equals what? The labelled answer is 0. Connect accumulated Gaussian area to probability and diffusion models. Connect accumulated Gaussian area to probability and diffusion models. A common labelled error is using a nearby formula that is not the Error Function rule. Error Function keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Connect accumulated Gaussian area to probability and diffusion models. Error Function is the Special Functions rule used to compute one labelled numerical result. Connect accumulated Gaussian area to probability and diffusion models. Error Function is the Special Functions rule used to compute one labelled numerical result. Connect accumulated Gaussian area to probability and diffusion models. Error Function is the Special Functions rule used to compute one labelled numerical result.",
    basicIdea: "Error Function works this concrete case: erf(0) equals what?",
    howItWorks: "Read the Error Function inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Error Function works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "erf(0) equals what?", steps: ["The integrand is odd and the interval collapses.", "0.", "0"], answer: "0" },
      { prompt: "Compute this Error Function case with input 2: What value does erf(x) approach as x→∞? Labelled result 1.", steps: ["erf is a scaled integral of e^{-t^2}.", "1.", "1"], answer: "1" },
      { prompt: "Compute this Error Function case with input 2: Is erf(x) a probability itself without scaling? Labelled result 2 → no.", steps: ["Normal probabilities use erf after scaling by √2.", "No.", "No."], answer: "no" }
    ],
  },
  2024: {
    introduction: "Zeta Function works this concrete case: ζ(2)=π^2/6. Is ζ(2) greater than 1? The labelled answer is yes. Study a function whose values and zeros connect series, primes, and famous open problems. Study a function whose values and zeros connect series, primes, and famous open problems. A common labelled error is using a nearby formula that is not the Zeta Function rule. Zeta Function keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Study a function whose values and zeros connect series, primes, and famous open problems. Zeta Function is the Special Functions rule used to compute one labelled numerical result. Study a function whose values and zeros connect series, primes, and famous open problems. Zeta Function is the Special Functions rule used to compute one labelled numerical result. Study a function whose values and zeros connect series, primes, and famous open problems. Zeta Function is the Special Functions rule used to compute one labelled numerical result.",
    basicIdea: "Zeta Function works this concrete case: ζ(2)=π^2/6. Is ζ(2) greater than 1?",
    howItWorks: "Read the Zeta Function inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Zeta Function works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "ζ(2)=π^2/6. Is ζ(2) greater than 1?", steps: ["The series 1+1/4+1/9+... > 1.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Zeta Function case with input 2: For even integers, are many zeta values known in closed form? Labelled result 2 → yes.", steps: ["Even zeta values involve π^{2k}.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Does ζ(-1)=-1/12 mean the series 1+2+3+... converges ordinarily?", steps: ["Analytic continuation is not ordinary summation.", "No.", "No."], answer: "no" }
    ],
  },
  2025: {
    introduction: "Bessel Function works this concrete case: J0(0) equals what? The labelled answer is 1. Recognize wave-like functions that appear in circular and cylindrical symmetry. Recognize wave-like functions that appear in circular and cylindrical symmetry. A common labelled error is using a nearby formula that is not the Bessel Function rule. Bessel Function keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Recognize wave-like functions that appear in circular and cylindrical symmetry. Bessel Function is the Special Functions rule used to compute one labelled numerical result. Recognize wave-like functions that appear in circular and cylindrical symmetry. Bessel Function is the Special Functions rule used to compute one labelled numerical result. Recognize wave-like functions that appear in circular and cylindrical symmetry. Bessel Function is the Special Functions rule used to compute one labelled numerical result.",
    basicIdea: "Bessel Function works this concrete case: J0(0) equals what?",
    howItWorks: "Read the Bessel Function inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Bessel Function works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "J0(0) equals what?", steps: ["J0 is regular and normalized at 0.", "1.", "1"], answer: "1" },
      { prompt: "For integer n>0, J_n(0) equals what?", steps: ["Positive integer orders vanish at 0.", "0.", "0"], answer: "0" },
      { prompt: "Compute this Bessel Function case with input 2: Are Bessel zeros equally spaced like sine zeros? Labelled result 2 → no.", steps: ["Spacing changes and amplitude decays.", "No.", "No."], answer: "no" }
    ],
  },
  10057: {
    introduction: "Proof Structure and Logical Statements works this concrete case: A triangle has angles 50° and 40°. Find the third angle. The labelled answer is 90. Class 9 Euclidean Geometry: Teach Proof Structure and Logical Statements as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Proof Structure and Logical Statements rule with live values. A common labelled error is writing proof steps without reasons. Proof Structure and Logical Statements keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A proof is a chain of logical statements where each important step has a valid reason. Valid rules preserve truth from one step to the next. Class 9 Euclidean Geometry: Teach Proof Structure and Logical Statements as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Proof Structure and Logical Statements rule with live values. Proof Structure and Logical Statements is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Proof Structure and Logical Statements works this concrete case: A triangle has angles 50° and 40°. Find the third angle.",
    howItWorks: "Write the given facts, state each claim, add a reason, and finish with the required conclusion.",
    whyItWorks: "Valid rules preserve truth from one step to the next.",
    worked: [
      { prompt: "A triangle has angles 50° and 40°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-40.", "90."], answer: "90" },
      { prompt: "Compute this Proof Structure and Logical Statements case with input 2: Does a theorem need proof? Labelled result 2 → yes.", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Proof Structure and Logical Statements case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10058: {
    introduction: "Vertically Opposite Angles works this concrete case: A triangle has angles 50° and 50°. Find the third angle. The labelled answer is 80. Class 9 Euclidean Geometry: Teach Vertically Opposite Angles as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Vertically Opposite Angles rule with live values. A common labelled error is thinking adjacent angles are vertically opposite. Vertically Opposite Angles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Vertically opposite angles are opposite angles made by two intersecting lines, and they are equal. Both angles are supplements of the same angle, so they are equal. Class 9 Euclidean Geometry: Teach Vertically Opposite Angles as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Vertically Opposite Angles rule with live values. Vertically Opposite Angles is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Vertically Opposite Angles works this concrete case: A triangle has angles 50° and 50°. Find the third angle.",
    howItWorks: "Find the intersecting lines, form two linear pairs, then subtract from 180 degrees.",
    whyItWorks: "Both angles are supplements of the same angle, so they are equal.",
    worked: [
      { prompt: "A triangle has angles 50° and 50°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-50.", "80."], answer: "80" },
      { prompt: "Compute this Vertically Opposite Angles case with input 2: Does a theorem need proof? Labelled result 2 → yes.", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Vertically Opposite Angles case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10059: {
    introduction: "Linear Pair Axiom and Converse works this concrete case: A triangle has angles 50° and 60°. Find the third angle. The labelled answer is 70. Class 9 Euclidean Geometry: Teach Linear Pair Axiom and Converse as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Linear Pair Axiom and Converse rule with live values. A common labelled error is using the converse without checking adjacent angles. Linear Pair Axiom and Converse keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A linear pair has adjacent angles whose non-common arms form a straight line, so their sum is 180 degrees. A straight angle measures 180 degrees, so adjacent parts on it add to 180 degrees. Class 9 Euclidean Geometry: Teach Linear Pair Axiom and Converse as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Linear Pair Axiom and Converse rule with live values. Linear Pair Axiom and Converse is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Linear Pair Axiom and Converse works this concrete case: A triangle has angles 50° and 60°. Find the third angle.",
    howItWorks: "Check adjacency and straight arms, add the angles, then use the converse when the sum is 180 degrees.",
    whyItWorks: "A straight angle measures 180 degrees, so adjacent parts on it add to 180 degrees.",
    worked: [
      { prompt: "A triangle has angles 50° and 60°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-60.", "70."], answer: "70" },
      { prompt: "Compute this Linear Pair Axiom and Converse case with input 2: Does a theorem need proof? Labelled result 2 → yes.", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Linear Pair Axiom and Converse case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10060: {
    introduction: "Corresponding Angles works this concrete case: A triangle has angles 50° and 70°. Find the third angle. The labelled answer is 60. Class 9 Euclidean Geometry: Teach Corresponding Angles as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Corresponding Angles rule with live values. A common labelled error is pairing angles that are not in matching positions. Corresponding Angles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Corresponding angles occupy matching positions when a transversal cuts two lines. For parallel lines, a transversal makes equal corresponding angles because the line directions match. Class 9 Euclidean Geometry: Teach Corresponding Angles as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Corresponding Angles rule with live values. Corresponding Angles is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Corresponding Angles works this concrete case: A triangle has angles 50° and 70°. Find the third angle.",
    howItWorks: "Find the transversal, match the same corner position, then compare the angles.",
    whyItWorks: "For parallel lines, a transversal makes equal corresponding angles because the line directions match.",
    worked: [
      { prompt: "A triangle has angles 50° and 70°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-70.", "60."], answer: "60" },
      { prompt: "Compute this Corresponding Angles case with input 2: Does a theorem need proof? Labelled result 2 → yes.", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Corresponding Angles case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10061: {
    introduction: "Alternate Interior Angles works this concrete case: A triangle has angles 50° and 80°. Find the third angle. The labelled answer is 50. Class 9 Euclidean Geometry: Teach Alternate Interior Angles as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Alternate Interior Angles rule with live values. A common labelled error is choosing an outside angle by mistake. Alternate Interior Angles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Alternate interior angles lie inside two lines on opposite sides of a transversal. When the lines are parallel, the same direction change makes alternate interior angles equal. Class 9 Euclidean Geometry: Teach Alternate Interior Angles as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Alternate Interior Angles rule with live values. Alternate Interior Angles is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Alternate Interior Angles works this concrete case: A triangle has angles 50° and 80°. Find the third angle.",
    howItWorks: "Find the interior region, choose opposite sides of the transversal, then compare the pair.",
    whyItWorks: "When the lines are parallel, the same direction change makes alternate interior angles equal.",
    worked: [
      { prompt: "A triangle has angles 50° and 80°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-80.", "50."], answer: "50" },
      { prompt: "Compute this Alternate Interior Angles case with input 2: Does a theorem need proof? Labelled result 2 → yes.", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Alternate Interior Angles case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10062: {
    introduction: "Interior Angles on the Same Side works this concrete case: A triangle has angles 50° and 90°. Find the third angle. The labelled answer is 40. Class 9 Euclidean Geometry: Teach Interior Angles on the Same Side as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Interior Angles on the Same Side rule with live values. A common labelled error is thinking same-side interior angles are equal. Interior Angles on the Same Side keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Same-side interior angles lie between two lines on the same side of a transversal. For parallel lines, these angles form a pair whose measures add to a straight angle. Class 9 Euclidean Geometry: Teach Interior Angles on the Same Side as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Interior Angles on the Same Side rule with live values. Interior Angles on the Same Side is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Interior Angles on the Same Side works this concrete case: A triangle has angles 50° and 90°. Find the third angle.",
    howItWorks: "Find both interior angles on one side, then add their measures.",
    whyItWorks: "For parallel lines, these angles form a pair whose measures add to a straight angle.",
    worked: [
      { prompt: "A triangle has angles 50° and 90°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-90.", "40."], answer: "40" },
      { prompt: "Compute this Interior Angles on the Same Side case with input 2: Does a theorem need proof? Labelled result 2 → yes.", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Interior Angles on the Same Side case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10063: {
    introduction: "Parallel Line Converse Theorems works this concrete case: A triangle has angles 50° and 100°. Find the third angle. The labelled answer is 30. Class 9 Euclidean Geometry: Teach Parallel Line Converse Theorems as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parallel Line Converse Theorems rule with live values. A common labelled error is using a theorem when the proof needs its reverse statement. Parallel Line Converse Theorems keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Parallel line converse theorems use angle facts to prove that two lines are parallel. A converse reverses a known parallel-line theorem under stated conditions. Class 9 Euclidean Geometry: Teach Parallel Line Converse Theorems as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parallel Line Converse Theorems rule with live values. Parallel Line Converse Theorems is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Parallel Line Converse Theorems works this concrete case: A triangle has angles 50° and 100°. Find the third angle.",
    howItWorks: "Check the angle relation, match it to the correct converse, then conclude the lines are parallel.",
    whyItWorks: "A converse reverses a known parallel-line theorem under stated conditions.",
    worked: [
      { prompt: "A triangle has angles 50° and 100°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-100.", "30."], answer: "30" },
      { prompt: "Compute this Parallel Line Converse Theorems case with input 2: Does a theorem need proof? Labelled result 2 → yes.", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Parallel Line Converse Theorems case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10064: {
    introduction: "Triangle Angle Sum Theorem works this concrete case: A triangle has angles 50° and 30°. Find the third angle. The labelled answer is 100. Class 9 Euclidean Geometry: Teach Triangle Angle Sum Theorem as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Triangle Angle Sum Theorem rule with live values. A common labelled error is thinking the theorem works only for the drawn triangle. Triangle Angle Sum Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The three interior angles of any Euclidean triangle sum to 180 degrees. Parallel-line angle facts place the three triangle angles on one straight line. Class 9 Euclidean Geometry: Teach Triangle Angle Sum Theorem as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Triangle Angle Sum Theorem rule with live values. Triangle Angle Sum Theorem is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Triangle Angle Sum Theorem works this concrete case: A triangle has angles 50° and 30°. Find the third angle.",
    howItWorks: "Draw a line through one vertex parallel to the opposite side, then use alternate interior angles and a straight angle.",
    whyItWorks: "Parallel-line angle facts place the three triangle angles on one straight line.",
    worked: [
      { prompt: "A triangle has angles 50° and 30°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-30.", "100."], answer: "100" },
      { prompt: "Compute this Triangle Angle Sum Theorem case with input 2: Does a theorem need proof? Labelled result 2 → yes.", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Triangle Angle Sum Theorem case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10065: {
    introduction: "Exterior Angle Theorem works this concrete case: A triangle has angles 50° and 40°. Find the third angle. The labelled answer is 90. Class 9 Euclidean Geometry: Teach Exterior Angle Theorem as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Exterior Angle Theorem rule with live values. A common labelled error is adding the adjacent interior angle instead of the two opposite angles. Exterior Angle Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A triangle exterior angle equals the sum of the two opposite interior angles. The exterior angle and nearby interior angle form 180 degrees, matching the remaining two angles. Class 9 Euclidean Geometry: Teach Exterior Angle Theorem as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Exterior Angle Theorem rule with live values. Exterior Angle Theorem is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Exterior Angle Theorem works this concrete case: A triangle has angles 50° and 40°. Find the third angle.",
    howItWorks: "Extend one side, use the linear pair, then replace the third interior angle using the triangle angle sum.",
    whyItWorks: "The exterior angle and nearby interior angle form 180 degrees, matching the remaining two angles.",
    worked: [
      { prompt: "A triangle has angles 50° and 40°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-40.", "90."], answer: "90" },
      { prompt: "Compute this Exterior Angle Theorem case with input 2: Does a theorem need proof? Labelled result 2 → yes.", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Exterior Angle Theorem case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10066: {
    introduction: "SAS Congruence works this concrete case: Compute this SAS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 9 Triangle Proofs: Teach SAS Congruence as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the SAS Congruence rule with live values. A common labelled error is using an angle that is not between the two given sides. SAS Congruence keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "SAS congruence says two triangles are congruent when two sides and the included angle are equal. The included angle fixes how the two equal sides open, so the triangle shape is forced. Class 9 Triangle Proofs: Teach SAS Congruence as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the SAS Congruence rule with live values. SAS Congruence is the Triangle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "SAS Congruence works this concrete case: Compute this SAS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Match two side pairs, check the angle between them, then conclude corresponding parts are equal.",
    whyItWorks: "The included angle fixes how the two equal sides open, so the triangle shape is forced.",
    worked: [
      { prompt: "Compute this SAS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this SAS Congruence case with input 2: Add 50° and 60°. What is the sum? Labelled result 2 → 110.", steps: ["50+60.", "110.", "110."], answer: "110" },
      { prompt: "Compute this SAS Congruence case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10067: {
    introduction: "ASA Congruence works this concrete case: Compute this ASA Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 9 Triangle Proofs: Teach ASA Congruence as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the ASA Congruence rule with live values. A common labelled error is using a side that is not between the two angles. ASA Congruence keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "ASA congruence says two triangles are congruent when two angles and the included side are equal. Two angles fix the directions, and the included side fixes the size. Class 9 Triangle Proofs: Teach ASA Congruence as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the ASA Congruence rule with live values. ASA Congruence is the Triangle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "ASA Congruence works this concrete case: Compute this ASA Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Match two angle pairs, check the side between them, then name the congruent triangles in order.",
    whyItWorks: "Two angles fix the directions, and the included side fixes the size.",
    worked: [
      { prompt: "Compute this ASA Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this ASA Congruence case with input 2: Add 60° and 70°. What is the sum? Labelled result 2 → 130.", steps: ["60+70.", "130.", "130."], answer: "130" },
      { prompt: "Compute this ASA Congruence case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10068: {
    introduction: "AAS Congruence works this concrete case: Compute this AAS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 9 Triangle Proofs: Teach AAS Congruence as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the AAS Congruence rule with live values. A common labelled error is ignoring whether the given side corresponds correctly. AAS Congruence keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "AAS congruence says two triangles are congruent when two angles and a non-included corresponding side are equal. Two equal angles force the third angle equal, reducing the case to ASA. Class 9 Triangle Proofs: Teach AAS Congruence as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the AAS Congruence rule with live values. AAS Congruence is the Triangle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "AAS Congruence works this concrete case: Compute this AAS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Match two angle pairs and one corresponding side, then use angle sum if the third angle is needed.",
    whyItWorks: "Two equal angles force the third angle equal, reducing the case to ASA.",
    worked: [
      { prompt: "Compute this AAS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this AAS Congruence case with input 2: Add 70° and 20°. What is the sum? Labelled result 2 → 90.", steps: ["70+20.", "90.", "90."], answer: "90" },
      { prompt: "Compute this AAS Congruence case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10069: {
    introduction: "SSS Congruence works this concrete case: Compute this SSS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 9 Triangle Proofs: Teach SSS Congruence as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the SSS Congruence rule with live values. A common labelled error is thinking an angle must also be given for SSS. SSS Congruence keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "SSS congruence says two triangles are congruent when all three pairs of corresponding sides are equal. Three fixed side lengths force one triangle shape in Euclidean geometry. Class 9 Triangle Proofs: Teach SSS Congruence as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the SSS Congruence rule with live values. SSS Congruence is the Triangle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "SSS Congruence works this concrete case: Compute this SSS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Match the three side pairs, keep the order correct, then conclude congruence.",
    whyItWorks: "Three fixed side lengths force one triangle shape in Euclidean geometry.",
    worked: [
      { prompt: "Compute this SSS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this SSS Congruence case with input 2: Add 80° and 30°. What is the sum? Labelled result 2 → 110.", steps: ["80+30.", "110.", "110."], answer: "110" },
      { prompt: "Compute this SSS Congruence case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10070: {
    introduction: "RHS Congruence works this concrete case: Compute this RHS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 9 Triangle Proofs: Teach RHS Congruence as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the RHS Congruence rule with live values. A common labelled error is using RHS on triangles that are not right triangles. RHS Congruence keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "RHS congruence applies to right triangles with equal hypotenuse and one equal corresponding side. A right angle and hypotenuse-side data fix the remaining side by the Pythagorean relation. Class 9 Triangle Proofs: Teach RHS Congruence as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the RHS Congruence rule with live values. RHS Congruence is the Triangle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "RHS Congruence works this concrete case: Compute this RHS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Check both right angles, match hypotenuses, match one side, then conclude congruence.",
    whyItWorks: "A right angle and hypotenuse-side data fix the remaining side by the Pythagorean relation.",
    worked: [
      { prompt: "Compute this RHS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this RHS Congruence case with input 2: Add 90° and 40°. What is the sum? Labelled result 2 → 130.", steps: ["90+40.", "130.", "130."], answer: "130" },
      { prompt: "Compute this RHS Congruence case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10071: {
    introduction: "Equal Sides and Equal Angles works this concrete case: Compute this Equal Sides and Equal Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 9 Triangle Proofs: Teach Equal Sides and Equal Angles as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Equal Sides and Equal Angles rule with live values. A common labelled error is matching an angle beside a side instead of opposite it. Equal Sides and Equal Angles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "In a triangle, equal sides have equal opposite angles, and equal angles have equal opposite sides. Symmetry in the triangle makes the opposite parts correspond exactly. Class 9 Triangle Proofs: Teach Equal Sides and Equal Angles as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Equal Sides and Equal Angles rule with live values. Equal Sides and Equal Angles is the Triangle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Equal Sides and Equal Angles works this concrete case: Compute this Equal Sides and Equal Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Identify the equal sides or angles, then match the opposite parts across the triangle.",
    whyItWorks: "Symmetry in the triangle makes the opposite parts correspond exactly.",
    worked: [
      { prompt: "Compute this Equal Sides and Equal Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Equal Sides and Equal Angles case with input 2: Add 100° and 50°. What is the sum? Labelled result 2 → 150.", steps: ["100+50.", "150.", "150."], answer: "150" },
      { prompt: "Compute this Equal Sides and Equal Angles case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10072: {
    introduction: "Triangle Inequality works this concrete case: Compute this Triangle Inequality case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 9 Triangle Proofs: Teach Triangle Inequality as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Triangle Inequality rule with live values. A common labelled error is checking only one pair of sides. Triangle Inequality keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The triangle inequality says the sum of any two side lengths of a triangle is greater than the third side. A direct path between two points is shorter than any broken path through a third point. Class 9 Triangle Proofs: Teach Triangle Inequality as a Class 9 Triangle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Triangle Inequality rule with live values. Triangle Inequality is the Triangle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Triangle Inequality works this concrete case: Compute this Triangle Inequality case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Add each pair of side lengths and compare it with the remaining side.",
    whyItWorks: "A direct path between two points is shorter than any broken path through a third point.",
    worked: [
      { prompt: "Compute this Triangle Inequality case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Triangle Inequality case with input 2: Add 30° and 60°. What is the sum? Labelled result 2 → 90.", steps: ["30+60.", "90.", "90."], answer: "90" },
      { prompt: "Compute this Triangle Inequality case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10073: {
    introduction: "Parallelogram Opposite Sides works this concrete case: If slopes AB and BC both equal 7, are A, B, C collinear? The labelled answer is yes. Class 9 Quadrilateral Proofs: Teach Parallelogram Opposite Sides as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parallelogram Opposite Sides rule with live values. A common labelled error is thinking the fact needs right angles. Parallelogram Opposite Sides keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "In a parallelogram, both pairs of opposite sides are equal. The diagonal creates congruent triangles because opposite sides are parallel. Class 9 Quadrilateral Proofs: Teach Parallelogram Opposite Sides as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parallelogram Opposite Sides rule with live values. Parallelogram Opposite Sides is the Quadrilateral Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Parallelogram Opposite Sides works this concrete case: If slopes AB and BC both equal 7, are A, B, C collinear?",
    howItWorks: "Draw a diagonal, use parallel-line angles, prove two triangles congruent, then match sides.",
    whyItWorks: "The diagonal creates congruent triangles because opposite sides are parallel.",
    worked: [
      { prompt: "If slopes AB and BC both equal 7, are A, B, C collinear?", steps: ["Equal consecutive slopes.", "The points share one line.", "yes"], answer: "yes" },
      { prompt: "Does one measured diagram prove a theorem for all cases?", steps: ["Measurement is one example.", "Proof needs general reasons.", "No."], answer: "no" },
      { prompt: "Triangle area 0 for points with x=4,5,6 on y=7. Collinear?", steps: ["Zero area means one line.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10074: {
    introduction: "Parallelogram Opposite Angles works this concrete case: Compute this Parallelogram Opposite Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 9 Quadrilateral Proofs: Teach Parallelogram Opposite Angles as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parallelogram Opposite Angles rule with live values. A common labelled error is thinking adjacent angles are equal in every parallelogram. Parallelogram Opposite Angles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "In a parallelogram, opposite angles are equal. Parallel opposite sides create equal alternate interior angle pairs. Class 9 Quadrilateral Proofs: Teach Parallelogram Opposite Angles as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parallelogram Opposite Angles rule with live values. Parallelogram Opposite Angles is the Quadrilateral Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Parallelogram Opposite Angles works this concrete case: Compute this Parallelogram Opposite Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Use a diagonal or parallel-line angle facts, then match the opposite angles.",
    whyItWorks: "Parallel opposite sides create equal alternate interior angle pairs.",
    worked: [
      { prompt: "Compute this Parallelogram Opposite Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Parallelogram Opposite Angles case with input 2: Add 50° and 20°. What is the sum? Labelled result 2 → 70.", steps: ["50+20.", "70.", "70."], answer: "70" },
      { prompt: "Compute this Parallelogram Opposite Angles case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10075: {
    introduction: "Parallelogram Diagonals works this concrete case: If slopes AB and BC both equal 3, are A, B, C collinear? The labelled answer is yes. Class 9 Quadrilateral Proofs: Teach Parallelogram Diagonals as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parallelogram Diagonals rule with live values. A common labelled error is thinking parallelogram diagonals are always equal. Parallelogram Diagonals keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The diagonals of a parallelogram bisect each other. Parallel sides give equal angle pairs, so the crossing point is the midpoint of both diagonals. Class 9 Quadrilateral Proofs: Teach Parallelogram Diagonals as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parallelogram Diagonals rule with live values. Parallelogram Diagonals is the Quadrilateral Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Parallelogram Diagonals works this concrete case: If slopes AB and BC both equal 3, are A, B, C collinear?",
    howItWorks: "Draw both diagonals, prove the small triangles congruent, then match the diagonal parts.",
    whyItWorks: "Parallel sides give equal angle pairs, so the crossing point is the midpoint of both diagonals.",
    worked: [
      { prompt: "If slopes AB and BC both equal 3, are A, B, C collinear?", steps: ["Equal consecutive slopes.", "The points share one line.", "yes"], answer: "yes" },
      { prompt: "Does one measured diagram prove a theorem for all cases?", steps: ["Measurement is one example.", "Proof needs general reasons.", "No."], answer: "no" },
      { prompt: "Triangle area 0 for points with x=6,7,8 on y=3. Collinear?", steps: ["Zero area means one line.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10076: {
    introduction: "Conditions for a Quadrilateral to Be a Parallelogram works this concrete case: If slopes AB and BC both equal 4, are A, B, C collinear? The labelled answer is yes. Class 9 Quadrilateral Proofs: Teach Conditions for a Quadrilateral to Be a Parallelogram as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Conditions for a Quadrilateral to Be a Parallelogram rule with live values. A common labelled error is using an unrelated equal side or angle to prove parallelogram. Conditions for a Quadrilateral to Be a Parallelogram keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A quadrilateral is a parallelogram when a valid converse condition proves both opposite sides are parallel. Each condition forces the two pairs of opposite sides to behave like parallel sides. Class 9 Quadrilateral Proofs: Teach Conditions for a Quadrilateral to Be a Parallelogram as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Conditions for a Quadrilateral to Be a Parallelogram rule with live values. Conditions for a Quadrilateral to Be a Parallelogram is the Quadrilateral Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Conditions for a Quadrilateral to Be a Parallelogram works this concrete case: If slopes AB and BC both equal 4, are A, B, C collinear?",
    howItWorks: "Check one accepted condition, such as diagonals bisecting each other, then conclude parallelogram.",
    whyItWorks: "Each condition forces the two pairs of opposite sides to behave like parallel sides.",
    worked: [
      { prompt: "If slopes AB and BC both equal 4, are A, B, C collinear?", steps: ["Equal consecutive slopes.", "The points share one line.", "yes"], answer: "yes" },
      { prompt: "Does one measured diagram prove a theorem for all cases?", steps: ["Measurement is one example.", "Proof needs general reasons.", "No."], answer: "no" },
      { prompt: "Triangle area 0 for points with x=7,8,9 on y=4. Collinear?", steps: ["Zero area means one line.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10077: {
    introduction: "Midpoint Theorem works this concrete case: If slopes AB and BC both equal 5, are A, B, C collinear? The labelled answer is yes. Class 9 Quadrilateral Proofs: Teach Midpoint Theorem as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Midpoint Theorem rule with live values. A common labelled error is remembering parallel but forgetting half the third side. Midpoint Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The segment joining midpoints of two sides of a triangle is parallel to the third side and half its length. Halving two sides in the same triangle creates a smaller similar triangle. Class 9 Quadrilateral Proofs: Teach Midpoint Theorem as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Midpoint Theorem rule with live values. Midpoint Theorem is the Quadrilateral Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Midpoint Theorem works this concrete case: If slopes AB and BC both equal 5, are A, B, C collinear?",
    howItWorks: "Mark the two midpoints, join them, then use similarity or parallelogram reasoning.",
    whyItWorks: "Halving two sides in the same triangle creates a smaller similar triangle.",
    worked: [
      { prompt: "If slopes AB and BC both equal 5, are A, B, C collinear?", steps: ["Equal consecutive slopes.", "The points share one line.", "yes"], answer: "yes" },
      { prompt: "Does one measured diagram prove a theorem for all cases?", steps: ["Measurement is one example.", "Proof needs general reasons.", "No."], answer: "no" },
      { prompt: "Triangle area 0 for points with x=8,9,10 on y=5. Collinear?", steps: ["Zero area means one line.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10078: {
    introduction: "Converse of Midpoint Theorem works this concrete case: If slopes AB and BC both equal 6, are A, B, C collinear? The labelled answer is yes. Class 9 Quadrilateral Proofs: Teach Converse of Midpoint Theorem as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Converse of Midpoint Theorem rule with live values. A common labelled error is assuming bisection without proving the line is parallel. Converse of Midpoint Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The converse says a line through the midpoint of one triangle side and parallel to another side bisects the third side. Parallel lines create matching triangles, so the proportional split becomes equal halves. Class 9 Quadrilateral Proofs: Teach Converse of Midpoint Theorem as a Class 9 Quadrilateral Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Converse of Midpoint Theorem rule with live values. Converse of Midpoint Theorem is the Quadrilateral Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Converse of Midpoint Theorem works this concrete case: If slopes AB and BC both equal 6, are A, B, C collinear?",
    howItWorks: "Identify the midpoint, check the parallel line, then conclude the other side is bisected.",
    whyItWorks: "Parallel lines create matching triangles, so the proportional split becomes equal halves.",
    worked: [
      { prompt: "If slopes AB and BC both equal 6, are A, B, C collinear?", steps: ["Equal consecutive slopes.", "The points share one line.", "yes"], answer: "yes" },
      { prompt: "Does one measured diagram prove a theorem for all cases?", steps: ["Measurement is one example.", "Proof needs general reasons.", "No."], answer: "no" },
      { prompt: "Triangle area 0 for points with x=9,10,11 on y=6. Collinear?", steps: ["Zero area means one line.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10079: {
    introduction: "Heron's Formula Derivation works this concrete case: Compute this Heron's Formula Derivation case with input 2: In Heron's Formula Derivation, evaluate the labelled model at input 10. Labelled result 2 → 70. The labelled answer is 70. Class 9 Mensuration: Teach Heron's Formula Derivation as a Class 9 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Heron's Formula Derivation rule with live values. A common labelled error is using the full perimeter where semi-perimeter is needed. Heron's Formula Derivation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Heron's formula finds the area of a triangle from its three side lengths. The formula follows from altitude-area relations and algebra using side lengths. Class 9 Mensuration: Teach Heron's Formula Derivation as a Class 9 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Heron's Formula Derivation rule with live values. Heron's Formula Derivation is the Mensuration rule used to compute one labelled numerical result.",
    basicIdea: "Heron's Formula Derivation works this concrete case: Compute this Heron's Formula Derivation case with input 2: In Heron's Formula Derivation, evaluate the labelled model at input 10. Labelled result 2 → 70.",
    howItWorks: "Find the semi-perimeter s, then compute the square root of s(s-a)(s-b)(s-c).",
    whyItWorks: "The formula follows from altitude-area relations and algebra using side lengths.",
    worked: [
      { prompt: "Compute this Heron's Formula Derivation case with input 2: In Heron's Formula Derivation, evaluate the labelled model at input 10. Labelled result 2 → 70.", steps: ["Substitute 10 into the Heron's Formula Derivation rule.", "The first stored value is 70.", "70."], answer: "70" },
      { prompt: "Compute this Heron's Formula Derivation case with input 2: Compare the Heron's Formula Derivation outputs at 10 and 17. What is the difference? Labelled result 7.", steps: ["Second input 17.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Compute this Heron's Formula Derivation case with input 2: Can you skip the Heron's Formula Derivation restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10080: {
    introduction: "Semi-Perimeter Lab works this concrete case: Simple interest on 300 at 2% for 2 years? The labelled answer is 12. Class 9 Mensuration: Teach Semi-Perimeter Lab as a Class 9 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Semi-Perimeter Lab rule with live values. A common labelled error is using the perimeter as s. Semi-Perimeter Lab keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The semi-perimeter of a triangle is half the sum of its three side lengths. Half the perimeter gives a compact value used in triangle area relations. Class 9 Mensuration: Teach Semi-Perimeter Lab as a Class 9 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Semi-Perimeter Lab rule with live values. Semi-Perimeter Lab is the Mensuration rule used to compute one labelled numerical result.",
    basicIdea: "Semi-Perimeter Lab works this concrete case: Simple interest on 300 at 2% for 2 years?",
    howItWorks: "Add the three sides, divide by 2, then use s in formulas such as Heron's formula.",
    whyItWorks: "Half the perimeter gives a compact value used in triangle area relations.",
    worked: [
      { prompt: "Simple interest on 300 at 2% for 2 years?", steps: ["I=PRT/100.", "300*2*2/100=12.", "12."], answer: "12" },
      { prompt: "Amount after 1 year compound on 300 at 2%?", steps: ["A=P(1+r).", "300*(1+2/100).", "306."], answer: "306" },
      { prompt: "Is simple interest the same as compound interest after 2 years?", steps: ["Compound adds interest on interest.", "They differ after year 1.", "No."], answer: "no" }
    ],
  },
  10081: {
    introduction: "Coordinate Area versus Heron's Formula works this concrete case: Find the labelled coordinate area versus heron's formula for base 4 and height 3. The labelled answer is 12. Class 9 Mensuration: Teach Coordinate Area versus Heron's Formula as a Class 9 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Coordinate Area versus Heron's Formula rule with live values. A common labelled error is mixing coordinate values into Heron's formula without side lengths. Coordinate Area versus Heron's Formula keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Coordinate area and Heron's formula are two exact ways to find a triangle's area. Both methods measure the same region, so correct exact work gives the same area. Class 9 Mensuration: Teach Coordinate Area versus Heron's Formula as a Class 9 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Coordinate Area versus Heron's Formula rule with live values. Coordinate Area versus Heron's Formula is the Mensuration rule used to compute one labelled numerical result.",
    basicIdea: "Coordinate Area versus Heron's Formula works this concrete case: Find the labelled coordinate area versus heron's formula for base 4 and height 3.",
    howItWorks: "Use coordinates directly, or find side lengths first and then use Heron's formula.",
    whyItWorks: "Both methods measure the same region, so correct exact work gives the same area.",
    worked: [
      { prompt: "Find the labelled coordinate area versus heron's formula for base 4 and height 3.", steps: ["Use the Coordinate Area versus Heron's Formula formula.", "4 and 3 are the measured sides.", "The value is 12."], answer: "12" },
      { prompt: "If the height doubles from 3 to 6, what happens to this area model?", steps: ["Area scales with perpendicular height.", "New height 6.", "It doubles."], answer: "doubles" },
      { prompt: "Is perimeter 4+3 the same as coordinate area versus heron's formula?", steps: ["Perimeter is boundary length.", "Area is interior measure.", "No."], answer: "no" }
    ],
  },
  10082: {
    introduction: "Combined Solids works this concrete case: Cube edge 5. Find the volume. The labelled answer is 125. Class 9 Mensuration: Teach Combined Solids as a Class 9 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Combined Solids rule with live values. A common labelled error is counting a joined face as exposed surface area. Combined Solids keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A combined solid is made by joining or removing simple solids such as cubes, cylinders, cones, or hemispheres. Area and volume are additive when pieces do not overlap in the counted region. Class 9 Mensuration: Teach Combined Solids as a Class 9 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Combined Solids rule with live values. Combined Solids is the Mensuration rule used to compute one labelled numerical result.",
    basicIdea: "Combined Solids works this concrete case: Cube edge 5. Find the volume.",
    howItWorks: "Split the shape into simple solids, find each needed area or volume, then add or subtract correctly.",
    whyItWorks: "Area and volume are additive when pieces do not overlap in the counted region.",
    worked: [
      { prompt: "Cube edge 5. Find the volume.", steps: ["V=s^3.", "5^3=125.", "125."], answer: "125" },
      { prompt: "Cube edge 5. Find the surface area.", steps: ["SA=6s^2.", "6*25=150.", "150."], answer: "150" },
      { prompt: "Compute this Combined Solids case with input 2: Is surface area measured in cubic units? Labelled result 2 → no.", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  10083: {
    introduction: "Distance Formula works this concrete case: In Distance Formula, evaluate the labelled model at input 6. The labelled answer is 30. Class 10 Coordinate Geometry: Teach Distance Formula as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Distance Formula rule with live values. A common labelled error is forgetting the square root after adding squared differences. Distance Formula keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The distance formula gives the length between two points in the coordinate plane. The horizontal and vertical differences form a right triangle, so the Pythagorean theorem gives the distance. Class 10 Coordinate Geometry: Teach Distance Formula as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Distance Formula rule with live values. Distance Formula is the Coordinate Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Distance Formula works this concrete case: In Distance Formula, evaluate the labelled model at input 6.",
    howItWorks: "Subtract coordinates, square both differences, add them, and take the square root.",
    whyItWorks: "The horizontal and vertical differences form a right triangle, so the Pythagorean theorem gives the distance.",
    worked: [
      { prompt: "In Distance Formula, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Distance Formula rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Distance Formula outputs at 6 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Compute this Distance Formula case with input 2: Can you skip the Distance Formula restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10084: {
    introduction: "Midpoint Formula works this concrete case: In Midpoint Formula, evaluate the labelled model at input 7. The labelled answer is 42. Class 10 Coordinate Geometry: Teach Midpoint Formula as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Midpoint Formula rule with live values. A common labelled error is adding coordinates but forgetting to divide by 2. Midpoint Formula keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The midpoint formula gives the point halfway between two coordinate points. A midpoint is equally far from both endpoints along each coordinate direction. Class 10 Coordinate Geometry: Teach Midpoint Formula as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Midpoint Formula rule with live values. Midpoint Formula is the Coordinate Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Midpoint Formula works this concrete case: In Midpoint Formula, evaluate the labelled model at input 7.",
    howItWorks: "Average the x-coordinates and average the y-coordinates.",
    whyItWorks: "A midpoint is equally far from both endpoints along each coordinate direction.",
    worked: [
      { prompt: "In Midpoint Formula, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Midpoint Formula rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Midpoint Formula outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Compute this Midpoint Formula case with input 2: Can you skip the Midpoint Formula restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10085: {
    introduction: "Internal Section Formula works this concrete case: In Internal Section Formula, evaluate the labelled model at input 8. The labelled answer is 56. Class 10 Coordinate Geometry: Teach Internal Section Formula as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Internal Section Formula rule with live values. A common labelled error is using the same endpoint's ratio part instead of the opposite part. Internal Section Formula keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The internal section formula finds a point that divides a segment between two endpoints in a given ratio. Weighted averages place the point inside the segment at the required ratio. Class 10 Coordinate Geometry: Teach Internal Section Formula as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Internal Section Formula rule with live values. Internal Section Formula is the Coordinate Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Internal Section Formula works this concrete case: In Internal Section Formula, evaluate the labelled model at input 8.",
    howItWorks: "Multiply each endpoint coordinate by the opposite ratio part, add, then divide by the total ratio.",
    whyItWorks: "Weighted averages place the point inside the segment at the required ratio.",
    worked: [
      { prompt: "In Internal Section Formula, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Internal Section Formula rule.", "The first stored value is 56.", "56."], answer: "56" },
      { prompt: "Compare the Internal Section Formula outputs at 8 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Compute this Internal Section Formula case with input 2: Can you skip the Internal Section Formula restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10086: {
    introduction: "External Section Formula works this concrete case: In External Section Formula, evaluate the labelled model at input 9. The labelled answer is 18. Class 10 Coordinate Geometry: Teach External Section Formula as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the External Section Formula rule with live values. A common labelled error is using the internal formula for an outside division point. External Section Formula keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The external section formula finds a point outside a segment that divides the line externally in a given ratio. External division places the point beyond an endpoint while preserving the directed ratio. Class 10 Coordinate Geometry: Teach External Section Formula as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the External Section Formula rule with live values. External Section Formula is the Coordinate Geometry rule used to compute one labelled numerical result.",
    basicIdea: "External Section Formula works this concrete case: In External Section Formula, evaluate the labelled model at input 9.",
    howItWorks: "Use weighted coordinate differences, then divide by the difference of the ratio parts.",
    whyItWorks: "External division places the point beyond an endpoint while preserving the directed ratio.",
    worked: [
      { prompt: "In External Section Formula, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the External Section Formula rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the External Section Formula outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this External Section Formula case with input 2: Can you skip the External Section Formula restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10087: {
    introduction: "Area of Triangle Using Coordinates works this concrete case: Find the labelled area of triangle using coordinates for base 10 and height 3. The labelled answer is 15. Class 10 Coordinate Geometry: Teach Area of Triangle Using Coordinates as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Area of Triangle Using Coordinates rule with live values. A common labelled error is keeping a negative area after substitution. Area of Triangle Using Coordinates keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The coordinate area formula gives a triangle's area from its three vertex coordinates. The formula adds and subtracts rectangle-like parts around the triangle. Class 10 Coordinate Geometry: Teach Area of Triangle Using Coordinates as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Area of Triangle Using Coordinates rule with live values. Area of Triangle Using Coordinates is the Coordinate Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Area of Triangle Using Coordinates works this concrete case: Find the labelled area of triangle using coordinates for base 10 and height 3.",
    howItWorks: "Substitute coordinates in order, compute the signed sum, take absolute value, then divide by 2.",
    whyItWorks: "The formula adds and subtracts rectangle-like parts around the triangle.",
    worked: [
      { prompt: "Find the labelled area of triangle using coordinates for base 10 and height 3.", steps: ["Use the Area of Triangle Using Coordinates formula.", "10 and 3 are the measured sides.", "The value is 15."], answer: "15" },
      { prompt: "If the height doubles from 3 to 6, what happens to this area model?", steps: ["Area scales with perpendicular height.", "New height 6.", "It doubles."], answer: "doubles" },
      { prompt: "Is perimeter 10+3 the same as area of triangle using coordinates?", steps: ["Perimeter is boundary length.", "Area is interior measure.", "No."], answer: "no" }
    ],
  },
  10088: {
    introduction: "Collinearity Using Coordinate Area works this concrete case: Find the labelled collinearity using coordinate area for base 3 and height 4. The labelled answer is 12. Class 10 Coordinate Geometry: Teach Collinearity Using Coordinate Area as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Collinearity Using Coordinate Area rule with live values. A common labelled error is thinking collinearity means all points are the same point. Collinearity Using Coordinate Area keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Three points are collinear when they lie on one straight line, which makes triangle area zero. A straight-line set of three points encloses no triangular region. Class 10 Coordinate Geometry: Teach Collinearity Using Coordinate Area as a Class 10 Coordinate Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Collinearity Using Coordinate Area rule with live values. Collinearity Using Coordinate Area is the Coordinate Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Collinearity Using Coordinate Area works this concrete case: Find the labelled collinearity using coordinate area for base 3 and height 4.",
    howItWorks: "Use the coordinate area formula; if the area is zero, the three points are collinear.",
    whyItWorks: "A straight-line set of three points encloses no triangular region.",
    worked: [
      { prompt: "Find the labelled collinearity using coordinate area for base 3 and height 4.", steps: ["Use the Collinearity Using Coordinate Area formula.", "3 and 4 are the measured sides.", "The value is 12."], answer: "12" },
      { prompt: "If the height doubles from 4 to 8, what happens to this area model?", steps: ["Area scales with perpendicular height.", "New height 8.", "It doubles."], answer: "doubles" },
      { prompt: "Is perimeter 3+4 the same as collinearity using coordinate area?", steps: ["Perimeter is boundary length.", "Area is interior measure.", "No."], answer: "no" }
    ],
  },
  10089: {
    introduction: "Equal Chords and Equal Angles works this concrete case: Compute this Equal Chords and Equal Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 10 Circle Proofs: Teach Equal Chords and Equal Angles as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Equal Chords and Equal Angles rule with live values. A common labelled error is comparing chords from different circles without extra facts. Equal Chords and Equal Angles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Equal chords of a circle subtend equal angles at the centre, and equal central angles subtend equal chords. All radii of the same circle are equal, so congruent triangles connect chord length and central angle. Class 10 Circle Proofs: Teach Equal Chords and Equal Angles as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Equal Chords and Equal Angles rule with live values. Equal Chords and Equal Angles is the Circle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Equal Chords and Equal Angles works this concrete case: Compute this Equal Chords and Equal Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Join chord endpoints to the centre, prove the radii triangles congruent, then match angles or chords.",
    whyItWorks: "All radii of the same circle are equal, so congruent triangles connect chord length and central angle.",
    worked: [
      { prompt: "Compute this Equal Chords and Equal Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Equal Chords and Equal Angles case with input 2: Add 40° and 50°. What is the sum? Labelled result 2 → 90.", steps: ["40+50.", "90.", "90."], answer: "90" },
      { prompt: "Compute this Equal Chords and Equal Angles case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10090: {
    introduction: "Perpendicular from Centre to Chord works this concrete case: If slopes AB and BC both equal 6, are A, B, C collinear? The labelled answer is yes. Class 10 Circle Proofs: Teach Perpendicular from Centre to Chord as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Perpendicular from Centre to Chord rule with live values. A common labelled error is thinking any line from the centre bisects a chord. Perpendicular from Centre to Chord keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The perpendicular from the centre of a circle to a chord bisects the chord. Equal radii and a shared perpendicular create congruent right triangles. Class 10 Circle Proofs: Teach Perpendicular from Centre to Chord as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Perpendicular from Centre to Chord rule with live values. Perpendicular from Centre to Chord is the Circle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Perpendicular from Centre to Chord works this concrete case: If slopes AB and BC both equal 6, are A, B, C collinear?",
    howItWorks: "Join the centre to the chord endpoints, use equal radii, then prove the two right triangles congruent.",
    whyItWorks: "Equal radii and a shared perpendicular create congruent right triangles.",
    worked: [
      { prompt: "If slopes AB and BC both equal 6, are A, B, C collinear?", steps: ["Equal consecutive slopes.", "The points share one line.", "yes"], answer: "yes" },
      { prompt: "Does one measured diagram prove a theorem for all cases?", steps: ["Measurement is one example.", "Proof needs general reasons.", "No."], answer: "no" },
      { prompt: "Triangle area 0 for points with x=5,6,7 on y=6. Collinear?", steps: ["Zero area means one line.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10091: {
    introduction: "Angle Subtended by an Arc works this concrete case: Compute this Angle Subtended by an Arc case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 10 Circle Proofs: Teach Angle Subtended by an Arc as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle Subtended by an Arc rule with live values. A common labelled error is calling the curved arc itself the angle. Angle Subtended by an Arc keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An arc subtends an angle at a point when lines from the arc endpoints meet at that point. The angle depends on how the endpoints are seen from the chosen point. Class 10 Circle Proofs: Teach Angle Subtended by an Arc as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle Subtended by an Arc rule with live values. Angle Subtended by an Arc is the Circle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Angle Subtended by an Arc works this concrete case: Compute this Angle Subtended by an Arc case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Identify the arc endpoints, draw the two joining segments, then read the angle they form.",
    whyItWorks: "The angle depends on how the endpoints are seen from the chosen point.",
    worked: [
      { prompt: "Compute this Angle Subtended by an Arc case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Angle Subtended by an Arc case with input 2: Add 60° and 70°. What is the sum? Labelled result 2 → 130.", steps: ["60+70.", "130.", "130."], answer: "130" },
      { prompt: "Compute this Angle Subtended by an Arc case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10092: {
    introduction: "Angle in a Semicircle works this concrete case: Simple interest on 700 at 2% for 2 years? The labelled answer is 28. Class 10 Circle Proofs: Teach Angle in a Semicircle as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle in a Semicircle rule with live values. A common labelled error is using a chord that is not a diameter. Angle in a Semicircle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The angle in a semicircle is a right angle. The diameter subtends 180 degrees at the centre, so the angle at the circle is half of it. Class 10 Circle Proofs: Teach Angle in a Semicircle as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle in a Semicircle rule with live values. Angle in a Semicircle is the Circle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Angle in a Semicircle works this concrete case: Simple interest on 700 at 2% for 2 years?",
    howItWorks: "Use the diameter as the hypotenuse and join the point on the circle to both endpoints.",
    whyItWorks: "The diameter subtends 180 degrees at the centre, so the angle at the circle is half of it.",
    worked: [
      { prompt: "Simple interest on 700 at 2% for 2 years?", steps: ["I=PRT/100.", "700*2*2/100=28.", "28."], answer: "28" },
      { prompt: "Amount after 1 year compound on 700 at 2%?", steps: ["A=P(1+r).", "700*(1+2/100).", "714."], answer: "714" },
      { prompt: "Is simple interest the same as compound interest after 2 years?", steps: ["Compound adds interest on interest.", "They differ after year 1.", "No."], answer: "no" }
    ],
  },
  10093: {
    introduction: "Angles in the Same Segment works this concrete case: Compute this Angles in the Same Segment case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 10 Circle Proofs: Teach Angles in the Same Segment as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angles in the Same Segment rule with live values. A common labelled error is using angles standing on different chords. Angles in the Same Segment keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Angles in the same segment of a circle are equal. Both angles are half of the same central angle subtended by the chord. Class 10 Circle Proofs: Teach Angles in the Same Segment as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angles in the Same Segment rule with live values. Angles in the Same Segment is the Circle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Angles in the Same Segment works this concrete case: Compute this Angles in the Same Segment case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Check that both angles stand on the same chord and their vertices lie on the same arc segment.",
    whyItWorks: "Both angles are half of the same central angle subtended by the chord.",
    worked: [
      { prompt: "Compute this Angles in the Same Segment case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Angles in the Same Segment case with input 2: Add 80° and 30°. What is the sum? Labelled result 2 → 110.", steps: ["80+30.", "110.", "110."], answer: "110" },
      { prompt: "Compute this Angles in the Same Segment case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10094: {
    introduction: "Cyclic Quadrilateral works this concrete case: If slopes AB and BC both equal 4, are A, B, C collinear? The labelled answer is yes. Class 10 Circle Proofs: Teach Cyclic Quadrilateral as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Cyclic Quadrilateral rule with live values. A common labelled error is thinking any round-looking quadrilateral is cyclic. Cyclic Quadrilateral keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A cyclic quadrilateral has all four vertices on one circle. Points on the same circle share angle relationships made by common arcs and chords. Class 10 Circle Proofs: Teach Cyclic Quadrilateral as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Cyclic Quadrilateral rule with live values. Cyclic Quadrilateral is the Circle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Cyclic Quadrilateral works this concrete case: If slopes AB and BC both equal 4, are A, B, C collinear?",
    howItWorks: "Check that each vertex lies on the circle, then use circle angle facts for its angles.",
    whyItWorks: "Points on the same circle share angle relationships made by common arcs and chords.",
    worked: [
      { prompt: "If slopes AB and BC both equal 4, are A, B, C collinear?", steps: ["Equal consecutive slopes.", "The points share one line.", "yes"], answer: "yes" },
      { prompt: "Does one measured diagram prove a theorem for all cases?", steps: ["Measurement is one example.", "Proof needs general reasons.", "No."], answer: "no" },
      { prompt: "Triangle area 0 for points with x=9,10,11 on y=4. Collinear?", steps: ["Zero area means one line.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10095: {
    introduction: "Opposite Angles of a Cyclic Quadrilateral works this concrete case: Compute this Opposite Angles of a Cyclic Quadrilateral case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 10 Circle Proofs: Teach Opposite Angles of a Cyclic Quadrilateral as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Opposite Angles of a Cyclic Quadrilateral rule with live values. A common labelled error is thinking opposite cyclic angles are equal. Opposite Angles of a Cyclic Quadrilateral keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Opposite angles of a cyclic quadrilateral sum to 180 degrees. Together the opposite angles stand on arcs that complete the full circle. Class 10 Circle Proofs: Teach Opposite Angles of a Cyclic Quadrilateral as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Opposite Angles of a Cyclic Quadrilateral rule with live values. Opposite Angles of a Cyclic Quadrilateral is the Circle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Opposite Angles of a Cyclic Quadrilateral works this concrete case: Compute this Opposite Angles of a Cyclic Quadrilateral case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Identify the opposite angle pair, then use the arcs around the circle to show they are supplementary.",
    whyItWorks: "Together the opposite angles stand on arcs that complete the full circle.",
    worked: [
      { prompt: "Compute this Opposite Angles of a Cyclic Quadrilateral case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Opposite Angles of a Cyclic Quadrilateral case with input 2: Add 100° and 50°. What is the sum? Labelled result 2 → 150.", steps: ["100+50.", "150.", "150."], answer: "150" },
      { prompt: "Compute this Opposite Angles of a Cyclic Quadrilateral case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10096: {
    introduction: "Tangent Perpendicular to Radius works this concrete case: Compute this Tangent Perpendicular to Radius case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 10 Circle Proofs: Teach Tangent Perpendicular to Radius as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangent Perpendicular to Radius rule with live values. A common labelled error is drawing the radius to a different point on the tangent. Tangent Perpendicular to Radius keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A tangent to a circle is perpendicular to the radius at the point of contact. The tangent touches at one point, so the radius to that closest point meets it at 90 degrees. Class 10 Circle Proofs: Teach Tangent Perpendicular to Radius as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangent Perpendicular to Radius rule with live values. Tangent Perpendicular to Radius is the Circle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Tangent Perpendicular to Radius works this concrete case: Compute this Tangent Perpendicular to Radius case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Mark the contact point, draw the radius to it, then use the closest-distance idea.",
    whyItWorks: "The tangent touches at one point, so the radius to that closest point meets it at 90 degrees.",
    worked: [
      { prompt: "Compute this Tangent Perpendicular to Radius case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangent Perpendicular to Radius case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangent Perpendicular to Radius case with input 2: Does Tangent Perpendicular to Radius treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10097: {
    introduction: "Tangent Lengths from an External Point works this concrete case: Compute this Tangent Lengths from an External Point case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 10 Circle Proofs: Teach Tangent Lengths from an External Point as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangent Lengths from an External Point rule with live values. A common labelled error is using a line that cuts the circle as a tangent. Tangent Lengths from an External Point keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Tangent segments drawn from the same external point to a circle are equal. Both radii are perpendicular to tangents and share the same hypotenuse from centre to external point. Class 10 Circle Proofs: Teach Tangent Lengths from an External Point as a Class 10 Circle Proofs concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangent Lengths from an External Point rule with live values. Tangent Lengths from an External Point is the Circle Proofs rule used to compute one labelled numerical result.",
    basicIdea: "Tangent Lengths from an External Point works this concrete case: Compute this Tangent Lengths from an External Point case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Join the external point and centre, draw radii to contact points, then prove right triangles congruent.",
    whyItWorks: "Both radii are perpendicular to tangents and share the same hypotenuse from centre to external point.",
    worked: [
      { prompt: "Compute this Tangent Lengths from an External Point case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangent Lengths from an External Point case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangent Lengths from an External Point case with input 2: Does Tangent Lengths from an External Point treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10098: {
    introduction: "Angle of Elevation works this concrete case: Compute this Angle of Elevation case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 10 Trigonometry Applications: Teach Angle of Elevation as a Class 10 Trigonometry Applications concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle of Elevation rule with live values. A common labelled error is measuring the angle from the vertical line. Angle of Elevation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An angle of elevation is the angle made when looking upward from a horizontal line. The angle measures how steeply the line of sight rises above eye level. Class 10 Trigonometry Applications: Teach Angle of Elevation as a Class 10 Trigonometry Applications concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle of Elevation rule with live values. Angle of Elevation is the Trigonometry Applications rule used to compute one labelled numerical result.",
    basicIdea: "Angle of Elevation works this concrete case: Compute this Angle of Elevation case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Draw the horizontal line, draw the upward line of sight, then form a right triangle.",
    whyItWorks: "The angle measures how steeply the line of sight rises above eye level.",
    worked: [
      { prompt: "Compute this Angle of Elevation case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Angle of Elevation case with input 2: Add 50° and 20°. What is the sum? Labelled result 2 → 70.", steps: ["50+20.", "70.", "70."], answer: "70" },
      { prompt: "Compute this Angle of Elevation case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10099: {
    introduction: "Angle of Depression works this concrete case: Compute this Angle of Depression case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 10 Trigonometry Applications: Teach Angle of Depression as a Class 10 Trigonometry Applications concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle of Depression rule with live values. A common labelled error is measuring from the ground instead of the observer's horizontal line. Angle of Depression keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An angle of depression is the angle made when looking downward from a horizontal line. It measures how steeply the sight line falls below eye level. Class 10 Trigonometry Applications: Teach Angle of Depression as a Class 10 Trigonometry Applications concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle of Depression rule with live values. Angle of Depression is the Trigonometry Applications rule used to compute one labelled numerical result.",
    basicIdea: "Angle of Depression works this concrete case: Compute this Angle of Depression case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Draw a horizontal line from the observer, draw the downward line of sight, then build a right triangle.",
    whyItWorks: "It measures how steeply the sight line falls below eye level.",
    worked: [
      { prompt: "Compute this Angle of Depression case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Angle of Depression case with input 2: Add 60° and 30°. What is the sum? Labelled result 2 → 90.", steps: ["60+30.", "90.", "90."], answer: "90" },
      { prompt: "Compute this Angle of Depression case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10100: {
    introduction: "Shadow-Length Modelling works this concrete case: Compute this Shadow-Length Modelling case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 10 Trigonometry Applications: Teach Shadow-Length Modelling as a Class 10 Trigonometry Applications concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Shadow-Length Modelling rule with live values. A common labelled error is putting shadow length over height for tangent. Shadow-Length Modelling keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Shadow-length modelling uses a right triangle formed by object height, shadow length, and sunlight. The vertical object and horizontal ground form a right triangle with the light ray. Class 10 Trigonometry Applications: Teach Shadow-Length Modelling as a Class 10 Trigonometry Applications concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Shadow-Length Modelling rule with live values. Shadow-Length Modelling is the Trigonometry Applications rule used to compute one labelled numerical result.",
    basicIdea: "Shadow-Length Modelling works this concrete case: Compute this Shadow-Length Modelling case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Draw the height and shadow, mark the sun angle, then use tan(theta)=height/shadow.",
    whyItWorks: "The vertical object and horizontal ground form a right triangle with the light ray.",
    worked: [
      { prompt: "Compute this Shadow-Length Modelling case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Shadow-Length Modelling case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Shadow-Length Modelling case with input 2: Does Shadow-Length Modelling treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10101: {
    introduction: "Two-Observer Height Problems works this concrete case: Compute this Two-Observer Height Problems case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 10 Trigonometry Applications: Teach Two-Observer Height Problems as a Class 10 Trigonometry Applications concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Two-Observer Height Problems rule with live values. A common labelled error is using only one observer when two equations are needed. Two-Observer Height Problems keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Two-observer height problems use two sight lines to find a height or distance. Two observations give enough information to connect height and horizontal distances. Class 10 Trigonometry Applications: Teach Two-Observer Height Problems as a Class 10 Trigonometry Applications concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Two-Observer Height Problems rule with live values. Two-Observer Height Problems is the Trigonometry Applications rule used to compute one labelled numerical result.",
    basicIdea: "Two-Observer Height Problems works this concrete case: Compute this Two-Observer Height Problems case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Draw both right triangles, assign unknown distances, write two trigonometric equations, then solve together.",
    whyItWorks: "Two observations give enough information to connect height and horizontal distances.",
    worked: [
      { prompt: "Compute this Two-Observer Height Problems case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Two-Observer Height Problems case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Does Two-Observer Height Problems treat 90° the same as 90 radians?", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10102: {
    introduction: "Grouped Mean by Direct Method works this concrete case: Find the mean of 9, 6, 5, 10. The labelled answer is 7.5. Class 10 Statistics: Teach Grouped Mean by Direct Method as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Grouped Mean by Direct Method rule with live values. A common labelled error is averaging class marks without using frequencies. Grouped Mean by Direct Method keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The direct method finds grouped mean by multiplying each class mark by its frequency. A grouped mean is a weighted average where frequency tells how many values each class represents. Class 10 Statistics: Teach Grouped Mean by Direct Method as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Grouped Mean by Direct Method rule with live values. Grouped Mean by Direct Method is the Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Grouped Mean by Direct Method works this concrete case: Find the mean of 9, 6, 5, 10.",
    howItWorks: "Find class marks, multiply by frequencies, add all products, then divide by total frequency.",
    whyItWorks: "A grouped mean is a weighted average where frequency tells how many values each class represents.",
    worked: [
      { prompt: "Find the mean of 9, 6, 5, 10.", steps: ["Sum=30.", "Count=4.", "7.5."], answer: "7.5" },
      { prompt: "If one value increases by 6, how does the mean change?", steps: ["The total rises by 6.", "Mean rises by 6/4.", "1.5."], answer: "1.5" },
      { prompt: "Must the mean be one of the data values?", steps: ["The mean is a balance point.", "It can sit between values.", "No."], answer: "no" }
    ],
  },
  10103: {
    introduction: "Grouped Mean by Assumed Mean works this concrete case: Find the mean of 10, 7, 6, 11. The labelled answer is 8.5. Class 10 Statistics: Teach Grouped Mean by Assumed Mean as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Grouped Mean by Assumed Mean rule with live values. A common labelled error is computing only sum(fd)/sum(f) and stopping. Grouped Mean by Assumed Mean keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The assumed mean method finds grouped mean using deviations from a chosen central value. It simplifies arithmetic because deviations are smaller than the original class marks. Class 10 Statistics: Teach Grouped Mean by Assumed Mean as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Grouped Mean by Assumed Mean rule with live values. Grouped Mean by Assumed Mean is the Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Grouped Mean by Assumed Mean works this concrete case: Find the mean of 10, 7, 6, 11.",
    howItWorks: "Choose assumed mean A, find d=x-A, compute fd, add fd, then use A + sum(fd)/sum(f).",
    whyItWorks: "It simplifies arithmetic because deviations are smaller than the original class marks.",
    worked: [
      { prompt: "Find the mean of 10, 7, 6, 11.", steps: ["Sum=34.", "Count=4.", "8.5."], answer: "8.5" },
      { prompt: "If one value increases by 7, how does the mean change?", steps: ["The total rises by 7.", "Mean rises by 7/4.", "1.75."], answer: "1.75" },
      { prompt: "Must the mean be one of the data values?", steps: ["The mean is a balance point.", "It can sit between values.", "No."], answer: "no" }
    ],
  },
  10104: {
    introduction: "Grouped Mean by Step Deviation works this concrete case: Find the mean of 3, 2, 7, 4. The labelled answer is 4. Class 10 Statistics: Teach Grouped Mean by Step Deviation as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Grouped Mean by Step Deviation rule with live values. A common labelled error is forgetting to multiply the final correction by h. Grouped Mean by Step Deviation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The step deviation method finds grouped mean using u = (x-A)/h for equal class width h. Scaling deviations by h makes arithmetic smaller while preserving the weighted average. Class 10 Statistics: Teach Grouped Mean by Step Deviation as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Grouped Mean by Step Deviation rule with live values. Grouped Mean by Step Deviation is the Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Grouped Mean by Step Deviation works this concrete case: Find the mean of 3, 2, 7, 4.",
    howItWorks: "Choose A and h, find u, compute fu, add fu, then use A + h sum(fu)/sum(f).",
    whyItWorks: "Scaling deviations by h makes arithmetic smaller while preserving the weighted average.",
    worked: [
      { prompt: "Find the mean of 3, 2, 7, 4.", steps: ["Sum=16.", "Count=4.", "4."], answer: "4" },
      { prompt: "If one value increases by 2, how does the mean change?", steps: ["The total rises by 2.", "Mean rises by 2/4.", "0.5."], answer: "0.5" },
      { prompt: "Must the mean be one of the data values?", steps: ["The mean is a balance point.", "It can sit between values.", "No."], answer: "no" }
    ],
  },
  10105: {
    introduction: "Less-Than Cumulative Frequency works this concrete case: In Less-Than Cumulative Frequency, evaluate the labelled model at input 4. The labelled answer is 12. Class 10 Statistics: Teach Less-Than Cumulative Frequency as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Less-Than Cumulative Frequency rule with live values. A common labelled error is resetting the count at each class. Less-Than Cumulative Frequency keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Less-than cumulative frequency counts observations below each upper class boundary. Each new total includes all previous classes plus the current class. Class 10 Statistics: Teach Less-Than Cumulative Frequency as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Less-Than Cumulative Frequency rule with live values. Less-Than Cumulative Frequency is the Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Less-Than Cumulative Frequency works this concrete case: In Less-Than Cumulative Frequency, evaluate the labelled model at input 4.",
    howItWorks: "Start from the lowest class and keep adding frequencies as the upper boundary increases.",
    whyItWorks: "Each new total includes all previous classes plus the current class.",
    worked: [
      { prompt: "In Less-Than Cumulative Frequency, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Less-Than Cumulative Frequency rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Less-Than Cumulative Frequency outputs at 4 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Compute this Less-Than Cumulative Frequency case with input 2: Can you skip the Less-Than Cumulative Frequency restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10106: {
    introduction: "More-Than Cumulative Frequency works this concrete case: In More-Than Cumulative Frequency, evaluate the labelled model at input 5. The labelled answer is 20. Class 10 Statistics: Teach More-Than Cumulative Frequency as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the More-Than Cumulative Frequency rule with live values. A common labelled error is adding upward as in a less-than table. More-Than Cumulative Frequency keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "More-than cumulative frequency counts observations at or above each lower class boundary. Higher lower boundaries remove observations from earlier classes. Class 10 Statistics: Teach More-Than Cumulative Frequency as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the More-Than Cumulative Frequency rule with live values. More-Than Cumulative Frequency is the Statistics rule used to compute one labelled numerical result.",
    basicIdea: "More-Than Cumulative Frequency works this concrete case: In More-Than Cumulative Frequency, evaluate the labelled model at input 5.",
    howItWorks: "Start with the total frequency, then subtract classes as the lower boundary rises.",
    whyItWorks: "Higher lower boundaries remove observations from earlier classes.",
    worked: [
      { prompt: "In More-Than Cumulative Frequency, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the More-Than Cumulative Frequency rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the More-Than Cumulative Frequency outputs at 5 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Compute this More-Than Cumulative Frequency case with input 2: Can you skip the More-Than Cumulative Frequency restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10107: {
    introduction: "Less-Than Ogive works this concrete case: In Less-Than Ogive, evaluate the labelled model at input 6. The labelled answer is 30. Class 10 Statistics: Teach Less-Than Ogive as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Less-Than Ogive rule with live values. A common labelled error is using a nearby formula that is not the Less-Than Ogive rule. Less-Than Ogive keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 10 Statistics: Teach Less-Than Ogive as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Less-Than Ogive rule with live values. Less-Than Ogive is the Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Less-Than Ogive works this concrete case: In Less-Than Ogive, evaluate the labelled model at input 6.",
    howItWorks: "Read the Less-Than Ogive inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Less-Than Ogive works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Less-Than Ogive, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Less-Than Ogive rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Less-Than Ogive outputs at 6 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Compute this Less-Than Ogive case with input 2: Can you skip the Less-Than Ogive restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10108: {
    introduction: "More-Than Ogive works this concrete case: In More-Than Ogive, evaluate the labelled model at input 7. The labelled answer is 42. Class 10 Statistics: Teach More-Than Ogive as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the More-Than Ogive rule with live values. A common labelled error is using a nearby formula that is not the More-Than Ogive rule. More-Than Ogive keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 10 Statistics: Teach More-Than Ogive as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the More-Than Ogive rule with live values. More-Than Ogive is the Statistics rule used to compute one labelled numerical result.",
    basicIdea: "More-Than Ogive works this concrete case: In More-Than Ogive, evaluate the labelled model at input 7.",
    howItWorks: "Read the More-Than Ogive inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "More-Than Ogive works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In More-Than Ogive, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the More-Than Ogive rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the More-Than Ogive outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Compute this More-Than Ogive case with input 2: Can you skip the More-Than Ogive restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10109: {
    introduction: "Median from an Ogive works this concrete case: Find the median of 5, 7, 8. The labelled answer is 7. Class 10 Statistics: Teach Median from an Ogive as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Median from an Ogive rule with live values. A common labelled error is using N instead of N/2. Median from an Ogive keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The median from an ogive is read by locating N/2 on the cumulative frequency axis. The median is the middle value, and N/2 marks the middle position in ordered data. Class 10 Statistics: Teach Median from an Ogive as a Class 10 Statistics concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Median from an Ogive rule with live values. Median from an Ogive is the Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Median from an Ogive works this concrete case: Find the median of 5, 7, 8.",
    howItWorks: "Find N/2, draw across to the ogive, then drop to the value axis.",
    whyItWorks: "The median is the middle value, and N/2 marks the middle position in ordered data.",
    worked: [
      { prompt: "Find the median of 5, 7, 8.", steps: ["Order the list.", "The middle is 7.", "7."], answer: "7" },
      { prompt: "Median of 5, 7, 8, 10?", steps: ["Average the two middle values.", "(7+8)/2.", "7.5."], answer: "7.5" },
      { prompt: "Compute this Median from an Ogive case with input 2: Do you find the median before sorting? Labelled result 2 → no.", steps: ["Median uses position.", "Sort first.", "No."], answer: "no" }
    ],
  },
  10110: {
    introduction: "Frustum of a Cone works this concrete case: In Frustum of a Cone, evaluate the labelled model at input 9. The labelled answer is 18. Class 10 Mensuration: Teach Frustum of a Cone as a Class 10 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Frustum of a Cone rule with live values. A common labelled error is using the cone formula without the two radii. Frustum of a Cone keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A frustum of a cone is the part left when a smaller cone is cut off parallel to the base. Parallel cutting leaves two similar circular faces connected by a slant surface. Class 10 Mensuration: Teach Frustum of a Cone as a Class 10 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Frustum of a Cone rule with live values. Frustum of a Cone is the Mensuration rule used to compute one labelled numerical result.",
    basicIdea: "Frustum of a Cone works this concrete case: In Frustum of a Cone, evaluate the labelled model at input 9.",
    howItWorks: "Identify both radii and slant height, then use the frustum surface area or volume formula.",
    whyItWorks: "Parallel cutting leaves two similar circular faces connected by a slant surface.",
    worked: [
      { prompt: "In Frustum of a Cone, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Frustum of a Cone rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Frustum of a Cone outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this Frustum of a Cone case with input 2: Can you skip the Frustum of a Cone restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10111: {
    introduction: "Combined Solids works this concrete case: Compute this Combined Solids case with input 2: Cube edge 10. Find the volume. Labelled result 2 → 1000. The labelled answer is 1000. Class 10 Mensuration: Teach Combined Solids as a Class 10 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Combined Solids rule with live values. A common labelled error is counting hidden joined faces as exposed area. Combined Solids keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A combined solid joins or removes simple solids such as cones, cylinders, spheres, and frustums. Volume and exposed surface area can be built from non-overlapping pieces. Class 10 Mensuration: Teach Combined Solids as a Class 10 Mensuration concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Combined Solids rule with live values. Combined Solids is the Mensuration rule used to compute one labelled numerical result.",
    basicIdea: "Combined Solids works this concrete case: Compute this Combined Solids case with input 2: Cube edge 10. Find the volume. Labelled result 2 → 1000.",
    howItWorks: "Split the shape into simple parts, calculate each needed measure, then add or subtract correctly.",
    whyItWorks: "Volume and exposed surface area can be built from non-overlapping pieces.",
    worked: [
      { prompt: "Compute this Combined Solids case with input 2: Cube edge 10. Find the volume. Labelled result 2 → 1000.", steps: ["V=s^3.", "10^3=1000.", "1000."], answer: "1000" },
      { prompt: "Compute this Combined Solids case with input 2: Cube edge 10. Find the surface area. Labelled result 2 → 600.", steps: ["SA=6s^2.", "6*100=600.", "600."], answer: "600" },
      { prompt: "Compute this Combined Solids case with input 2: Is surface area measured in cubic units? Labelled result 2 → no.", steps: ["Surface area is square units.", "Volume is cubic.", "No."], answer: "no" }
    ],
  },
  10112: {
    introduction: "Types of Relations works this concrete case: In Types of Relations, evaluate the labelled model at input 3. The labelled answer is 12. Class 11 Relations and Functions: Teach Types of Relations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Types of Relations rule with live values. A common labelled error is using a nearby formula that is not the Types of Relations rule. Types of Relations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach Types of Relations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Types of Relations rule with live values. Types of Relations is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Types of Relations works this concrete case: In Types of Relations, evaluate the labelled model at input 3.",
    howItWorks: "Read the Types of Relations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Types of Relations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Types of Relations, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Types of Relations rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Types of Relations outputs at 3 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Compute this Types of Relations case with input 2: Can you skip the Types of Relations restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10113: {
    introduction: "Reflexive Relations works this concrete case: In Reflexive Relations, evaluate the labelled model at input 4. The labelled answer is 20. Class 11 Relations and Functions: Teach Reflexive Relations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Reflexive Relations rule with live values. A common labelled error is using a nearby formula that is not the Reflexive Relations rule. Reflexive Relations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach Reflexive Relations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Reflexive Relations rule with live values. Reflexive Relations is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Reflexive Relations works this concrete case: In Reflexive Relations, evaluate the labelled model at input 4.",
    howItWorks: "Read the Reflexive Relations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Reflexive Relations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Reflexive Relations, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Reflexive Relations rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Reflexive Relations outputs at 4 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Compute this Reflexive Relations case with input 2: Can you skip the Reflexive Relations restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10114: {
    introduction: "Symmetric Relations works this concrete case: In Symmetric Relations, evaluate the labelled model at input 5. The labelled answer is 30. Class 11 Relations and Functions: Teach Symmetric Relations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Symmetric Relations rule with live values. A common labelled error is using a nearby formula that is not the Symmetric Relations rule. Symmetric Relations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach Symmetric Relations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Symmetric Relations rule with live values. Symmetric Relations is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Symmetric Relations works this concrete case: In Symmetric Relations, evaluate the labelled model at input 5.",
    howItWorks: "Read the Symmetric Relations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Symmetric Relations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Symmetric Relations, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Symmetric Relations rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Symmetric Relations outputs at 5 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Compute this Symmetric Relations case with input 2: Can you skip the Symmetric Relations restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10115: {
    introduction: "Transitive Relations works this concrete case: In Transitive Relations, evaluate the labelled model at input 6. The labelled answer is 42. Class 11 Relations and Functions: Teach Transitive Relations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Transitive Relations rule with live values. A common labelled error is using a nearby formula that is not the Transitive Relations rule. Transitive Relations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach Transitive Relations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Transitive Relations rule with live values. Transitive Relations is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Transitive Relations works this concrete case: In Transitive Relations, evaluate the labelled model at input 6.",
    howItWorks: "Read the Transitive Relations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Transitive Relations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Transitive Relations, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Transitive Relations rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Transitive Relations outputs at 6 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Compute this Transitive Relations case with input 2: Can you skip the Transitive Relations restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10116: {
    introduction: "Equivalence Relations works this concrete case: In Equivalence Relations, evaluate the labelled model at input 7. The labelled answer is 14. Class 11 Relations and Functions: Teach Equivalence Relations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Equivalence Relations rule with live values. A common labelled error is using a nearby formula that is not the Equivalence Relations rule. Equivalence Relations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach Equivalence Relations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Equivalence Relations rule with live values. Equivalence Relations is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Equivalence Relations works this concrete case: In Equivalence Relations, evaluate the labelled model at input 7.",
    howItWorks: "Read the Equivalence Relations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Equivalence Relations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Equivalence Relations, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Equivalence Relations rule.", "The first stored value is 14.", "14."], answer: "14" },
      { prompt: "Compare the Equivalence Relations outputs at 7 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this Equivalence Relations case with input 2: Can you skip the Equivalence Relations restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10117: {
    introduction: "One-One Functions works this concrete case: f(x)=x+3. If f(a)=f(b), must a=b? The labelled answer is yes. Class 11 Relations and Functions: Teach One-One Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the One-One Functions rule with live values. A common labelled error is using a nearby formula that is not the One-One Functions rule. One-One Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach One-One Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the One-One Functions rule with live values. One-One Functions is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "One-One Functions works this concrete case: f(x)=x+3. If f(a)=f(b), must a=b?",
    howItWorks: "Read the One-One Functions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "One-One Functions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "f(x)=x+3. If f(a)=f(b), must a=b?", steps: ["A horizontal shift is injective.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is f:R→R, f(x)=x^2 onto?", steps: ["Negatives are missed.", "No.", "No."], answer: "no" },
      { prompt: "Does one-one alone guarantee an inverse on the given codomain?", steps: ["Need onto as well for a two-sided inverse.", "No.", "No."], answer: "no" }
    ],
  },
  10118: {
    introduction: "Many-One Functions works this concrete case: f(x)=x+4. If f(a)=f(b), must a=b? The labelled answer is yes. Class 11 Relations and Functions: Teach Many-One Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Many-One Functions rule with live values. A common labelled error is using a nearby formula that is not the Many-One Functions rule. Many-One Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach Many-One Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Many-One Functions rule with live values. Many-One Functions is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Many-One Functions works this concrete case: f(x)=x+4. If f(a)=f(b), must a=b?",
    howItWorks: "Read the Many-One Functions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Many-One Functions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "f(x)=x+4. If f(a)=f(b), must a=b?", steps: ["A horizontal shift is injective.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is f:R→R, f(x)=x^2 onto?", steps: ["Negatives are missed.", "No.", "No."], answer: "no" },
      { prompt: "Does one-one alone guarantee an inverse on the given codomain?", steps: ["Need onto as well for a two-sided inverse.", "No.", "No."], answer: "no" }
    ],
  },
  10119: {
    introduction: "Into Functions works this concrete case: Compute this Into Functions case with input 2: In Into Functions, evaluate the labelled model at input 10. Labelled result 2 → 50. The labelled answer is 50. Class 11 Relations and Functions: Teach Into Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Into Functions rule with live values. A common labelled error is using a nearby formula that is not the Into Functions rule. Into Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach Into Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Into Functions rule with live values. Into Functions is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Into Functions works this concrete case: Compute this Into Functions case with input 2: In Into Functions, evaluate the labelled model at input 10. Labelled result 2 → 50.",
    howItWorks: "Read the Into Functions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Into Functions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Into Functions case with input 2: In Into Functions, evaluate the labelled model at input 10. Labelled result 2 → 50.", steps: ["Substitute 10 into the Into Functions rule.", "The first stored value is 50.", "50."], answer: "50" },
      { prompt: "Compute this Into Functions case with input 2: Compare the Into Functions outputs at 10 and 15. What is the difference? Labelled result 5.", steps: ["Second input 15.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Compute this Into Functions case with input 2: Can you skip the Into Functions restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10120: {
    introduction: "Onto Functions works this concrete case: f(x)=x+6. If f(a)=f(b), must a=b? The labelled answer is yes. Class 11 Relations and Functions: Teach Onto Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Onto Functions rule with live values. A common labelled error is using a nearby formula that is not the Onto Functions rule. Onto Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach Onto Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Onto Functions rule with live values. Onto Functions is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Onto Functions works this concrete case: f(x)=x+6. If f(a)=f(b), must a=b?",
    howItWorks: "Read the Onto Functions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Onto Functions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "f(x)=x+6. If f(a)=f(b), must a=b?", steps: ["A horizontal shift is injective.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is f:R→R, f(x)=x^2 onto?", steps: ["Negatives are missed.", "No.", "No."], answer: "no" },
      { prompt: "Does one-one alone guarantee an inverse on the given codomain?", steps: ["Need onto as well for a two-sided inverse.", "No.", "No."], answer: "no" }
    ],
  },
  10121: {
    introduction: "Composition of Functions works this concrete case: In Composition of Functions, evaluate the labelled model at input 4. The labelled answer is 28. Class 11 Relations and Functions: Teach Composition of Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Composition of Functions rule with live values. A common labelled error is applying f before g in f(g(x)). Composition of Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Composition of functions means applying one function after another, such as (f o g)(x)=f(g(x)). The output of the first function becomes the input of the next function. Class 11 Relations and Functions: Teach Composition of Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Composition of Functions rule with live values. Composition of Functions is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Composition of Functions works this concrete case: In Composition of Functions, evaluate the labelled model at input 4.",
    howItWorks: "Apply the inside function first, then put that result into the outside function.",
    whyItWorks: "The output of the first function becomes the input of the next function.",
    worked: [
      { prompt: "In Composition of Functions, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Composition of Functions rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Composition of Functions outputs at 4 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Compute this Composition of Functions case with input 2: Can you skip the Composition of Functions restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10122: {
    introduction: "Invertible Functions works this concrete case: f(x)=x+2. If f(a)=f(b), must a=b? The labelled answer is yes. Class 11 Relations and Functions: Teach Invertible Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Invertible Functions rule with live values. A common labelled error is using a nearby formula that is not the Invertible Functions rule. Invertible Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach Invertible Functions as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Invertible Functions rule with live values. Invertible Functions is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Invertible Functions works this concrete case: f(x)=x+2. If f(a)=f(b), must a=b?",
    howItWorks: "Read the Invertible Functions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Invertible Functions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "f(x)=x+2. If f(a)=f(b), must a=b?", steps: ["A horizontal shift is injective.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is f:R→R, f(x)=x^2 onto?", steps: ["Negatives are missed.", "No.", "No."], answer: "no" },
      { prompt: "Does one-one alone guarantee an inverse on the given codomain?", steps: ["Need onto as well for a two-sided inverse.", "No.", "No."], answer: "no" }
    ],
  },
  10123: {
    introduction: "Binary Operations works this concrete case: In Binary Operations, evaluate the labelled model at input 6. The labelled answer is 18. Class 11 Relations and Functions: Teach Binary Operations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Binary Operations rule with live values. A common labelled error is using a nearby formula that is not the Binary Operations rule. Binary Operations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Relations and Functions: Teach Binary Operations as a Class 11 Relations and Functions concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Binary Operations rule with live values. Binary Operations is the Relations and Functions rule used to compute one labelled numerical result.",
    basicIdea: "Binary Operations works this concrete case: In Binary Operations, evaluate the labelled model at input 6.",
    howItWorks: "Read the Binary Operations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Binary Operations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Binary Operations, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Binary Operations rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Binary Operations outputs at 6 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Compute this Binary Operations case with input 2: Can you skip the Binary Operations restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10124: {
    introduction: "Domain and Range of Trigonometric Functions works this concrete case: Compute this Domain and Range of Trigonometric Functions case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 11 Trigonometry: Teach Domain and Range of Trigonometric Functions as a Class 11 Trigonometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Domain and Range of Trigonometric Functions rule with live values. A common labelled error is using a nearby formula that is not the Domain and Range of Trigonometric Functions rule. Domain and Range of Trigonometric Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Trigonometry: Teach Domain and Range of Trigonometric Functions as a Class 11 Trigonometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Domain and Range of Trigonometric Functions rule with live values. Domain and Range of Trigonometric Functions is the Trigonometry rule used to compute one labelled numerical result.",
    basicIdea: "Domain and Range of Trigonometric Functions works this concrete case: Compute this Domain and Range of Trigonometric Functions case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Read the Domain and Range of Trigonometric Functions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Domain and Range of Trigonometric Functions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Domain and Range of Trigonometric Functions case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Domain and Range of Trigonometric Functions case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Domain and Range of Trigonometric Functions case with input 2: Does Domain and Range of Trigonometric Functions treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10125: {
    introduction: "Transformation of Trigonometric Graphs works this concrete case: Compute this Transformation of Trigonometric Graphs case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 11 Trigonometry: Teach Transformation of Trigonometric Graphs as a Class 11 Trigonometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Transformation of Trigonometric Graphs rule with live values. A common labelled error is using a nearby formula that is not the Transformation of Trigonometric Graphs rule. Transformation of Trigonometric Graphs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Trigonometry: Teach Transformation of Trigonometric Graphs as a Class 11 Trigonometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Transformation of Trigonometric Graphs rule with live values. Transformation of Trigonometric Graphs is the Trigonometry rule used to compute one labelled numerical result.",
    basicIdea: "Transformation of Trigonometric Graphs works this concrete case: Compute this Transformation of Trigonometric Graphs case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Read the Transformation of Trigonometric Graphs inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Transformation of Trigonometric Graphs works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Transformation of Trigonometric Graphs case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Transformation of Trigonometric Graphs case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Transformation of Trigonometric Graphs case with input 2: Does Transformation of Trigonometric Graphs treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10126: {
    introduction: "General Solutions of Trigonometric Equations works this concrete case: Compute this General Solutions of Trigonometric Equations case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 11 Trigonometry: Teach General Solutions of Trigonometric Equations as a Class 11 Trigonometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the General Solutions of Trigonometric Equations rule with live values. A common labelled error is listing only one angle. General Solutions of Trigonometric Equations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A general solution lists all angles that satisfy a trigonometric equation. Trig functions repeat, so one solution creates infinitely many by periodicity. Class 11 Trigonometry: Teach General Solutions of Trigonometric Equations as a Class 11 Trigonometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the General Solutions of Trigonometric Equations rule with live values. General Solutions of Trigonometric Equations is the Trigonometry rule used to compute one labelled numerical result.",
    basicIdea: "General Solutions of Trigonometric Equations works this concrete case: Compute this General Solutions of Trigonometric Equations case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Find principal solutions, then add the correct period pattern.",
    whyItWorks: "Trig functions repeat, so one solution creates infinitely many by periodicity.",
    worked: [
      { prompt: "Compute this General Solutions of Trigonometric Equations case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this General Solutions of Trigonometric Equations case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this General Solutions of Trigonometric Equations case with input 2: Does General Solutions of Trigonometric Equations treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10127: {
    introduction: "Principal Solutions works this concrete case: Compute this Principal Solutions case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 11 Trigonometry: Teach Principal Solutions as a Class 11 Trigonometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Principal Solutions rule with live values. A common labelled error is giving all periodic solutions. Principal Solutions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A principal solution is a selected solution in the principal interval for a trigonometric equation. Principal intervals give one standard set of answers before adding periods. Class 11 Trigonometry: Teach Principal Solutions as a Class 11 Trigonometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Principal Solutions rule with live values. Principal Solutions is the Trigonometry rule used to compute one labelled numerical result.",
    basicIdea: "Principal Solutions works this concrete case: Compute this Principal Solutions case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Solve the equation, then keep only values in the stated principal interval.",
    whyItWorks: "Principal intervals give one standard set of answers before adding periods.",
    worked: [
      { prompt: "Compute this Principal Solutions case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Principal Solutions case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Principal Solutions case with input 2: Does Principal Solutions treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10128: {
    introduction: "Logic of Mathematical Induction works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value? The labelled answer is 1. Class 11 Mathematical Induction: Teach Logic of Mathematical Induction as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Logic of Mathematical Induction rule with live values. A common labelled error is skipping the base case. Logic of Mathematical Induction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Mathematical induction proves statements for all natural numbers from a starting case and a repeating step. The proof works like a chain where each true case forces the next case. Class 11 Mathematical Induction: Teach Logic of Mathematical Induction as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Logic of Mathematical Induction rule with live values. Logic of Mathematical Induction is the Mathematical Induction rule used to compute one labelled numerical result.",
    basicIdea: "Logic of Mathematical Induction works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?",
    howItWorks: "Prove the base case, assume the statement for k, then prove it for k+1.",
    whyItWorks: "The proof works like a chain where each true case forces the next case.",
    worked: [
      { prompt: "Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", steps: ["1=1*2/2.", "1.", "1"], answer: "1" },
      { prompt: "If P(3) is assumed, the inductive step proves which next case?", steps: ["Assume P(3), prove P(4).", "4.", "4."], answer: "4" },
      { prompt: "Does checking n=1,2,3 finish an induction proof?", steps: ["Induction needs the general step.", "No.", "No."], answer: "no" }
    ],
  },
  10129: {
    introduction: "Base Case and Inductive Step works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value? The labelled answer is 1. Class 11 Mathematical Induction: Teach Base Case and Inductive Step as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Base Case and Inductive Step rule with live values. A common labelled error is proving only P(k+1). Base Case and Inductive Step keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The base case starts an induction proof, and the inductive step moves truth from k to k+1. Together they create an unbroken chain of true statements. Class 11 Mathematical Induction: Teach Base Case and Inductive Step as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Base Case and Inductive Step rule with live values. Base Case and Inductive Step is the Mathematical Induction rule used to compute one labelled numerical result.",
    basicIdea: "Base Case and Inductive Step works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?",
    howItWorks: "Verify the first case, assume P(k), then use that assumption to prove P(k+1).",
    whyItWorks: "Together they create an unbroken chain of true statements.",
    worked: [
      { prompt: "Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", steps: ["1=1*2/2.", "1.", "1"], answer: "1" },
      { prompt: "If P(4) is assumed, the inductive step proves which next case?", steps: ["Assume P(4), prove P(5).", "5.", "5."], answer: "5" },
      { prompt: "Does checking n=1,2,3 finish an induction proof?", steps: ["Induction needs the general step.", "No.", "No."], answer: "no" }
    ],
  },
  10130: {
    introduction: "Sum Formula by Induction works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value? The labelled answer is 1. Class 11 Mathematical Induction: Teach Sum Formula by Induction as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Sum Formula by Induction rule with live values. A common labelled error is forgetting to add the k+1 term. Sum Formula by Induction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A sum formula by induction proves a pattern for a finite sum such as 1+2+...+n. The next sum equals the old sum plus one new term. Class 11 Mathematical Induction: Teach Sum Formula by Induction as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Sum Formula by Induction rule with live values. Sum Formula by Induction is the Mathematical Induction rule used to compute one labelled numerical result.",
    basicIdea: "Sum Formula by Induction works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?",
    howItWorks: "Check n=1, assume the formula for k, add the next term, and simplify to the k+1 formula.",
    whyItWorks: "The next sum equals the old sum plus one new term.",
    worked: [
      { prompt: "Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", steps: ["1=1*2/2.", "1.", "1"], answer: "1" },
      { prompt: "If P(5) is assumed, the inductive step proves which next case?", steps: ["Assume P(5), prove P(6).", "6.", "6."], answer: "6" },
      { prompt: "Does checking n=1,2,3 finish an induction proof?", steps: ["Induction needs the general step.", "No.", "No."], answer: "no" }
    ],
  },
  10131: {
    introduction: "Divisibility by Induction works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value? The labelled answer is 1. Class 11 Mathematical Induction: Teach Divisibility by Induction as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Divisibility by Induction rule with live values. A common labelled error is testing a few values as proof. Divisibility by Induction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Divisibility by induction proves that an expression is divisible by a fixed number for all natural numbers. Algebra separates the known divisible part from a new divisible part. Class 11 Mathematical Induction: Teach Divisibility by Induction as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Divisibility by Induction rule with live values. Divisibility by Induction is the Mathematical Induction rule used to compute one labelled numerical result.",
    basicIdea: "Divisibility by Induction works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?",
    howItWorks: "Check the first case, assume divisibility for k, then rewrite the k+1 case using the assumption.",
    whyItWorks: "Algebra separates the known divisible part from a new divisible part.",
    worked: [
      { prompt: "Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", steps: ["1=1*2/2.", "1.", "1"], answer: "1" },
      { prompt: "If P(6) is assumed, the inductive step proves which next case?", steps: ["Assume P(6), prove P(7).", "7.", "7."], answer: "7" },
      { prompt: "Does checking n=1,2,3 finish an induction proof?", steps: ["Induction needs the general step.", "No.", "No."], answer: "no" }
    ],
  },
  10132: {
    introduction: "Inequality by Induction works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value? The labelled answer is 1. Class 11 Mathematical Induction: Teach Inequality by Induction as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Inequality by Induction rule with live values. A common labelled error is multiplying by a negative without reversing the inequality. Inequality by Induction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inequality by induction proves an inequality is true for all natural numbers in a stated range. Order is preserved when valid positive quantities are added or multiplied. Class 11 Mathematical Induction: Teach Inequality by Induction as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Inequality by Induction rule with live values. Inequality by Induction is the Mathematical Induction rule used to compute one labelled numerical result.",
    basicIdea: "Inequality by Induction works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?",
    howItWorks: "Check the starting value, assume the inequality for k, then prove the stronger or next statement.",
    whyItWorks: "Order is preserved when valid positive quantities are added or multiplied.",
    worked: [
      { prompt: "Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", steps: ["1=1*2/2.", "1.", "1"], answer: "1" },
      { prompt: "If P(7) is assumed, the inductive step proves which next case?", steps: ["Assume P(7), prove P(8).", "8.", "8."], answer: "8" },
      { prompt: "Does checking n=1,2,3 finish an induction proof?", steps: ["Induction needs the general step.", "No.", "No."], answer: "no" }
    ],
  },
  10133: {
    introduction: "Strong Induction Introduction works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value? The labelled answer is 1. Class 11 Mathematical Induction: Teach Strong Induction Introduction as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Strong Induction Introduction rule with live values. A common labelled error is assuming only P(k) when earlier cases are needed. Strong Induction Introduction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Strong induction assumes all earlier true cases up to k to prove the next case. Some problems need more than the immediately previous case. Class 11 Mathematical Induction: Teach Strong Induction Introduction as a Class 11 Mathematical Induction concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Strong Induction Introduction rule with live values. Strong Induction Introduction is the Mathematical Induction rule used to compute one labelled numerical result.",
    basicIdea: "Strong Induction Introduction works this concrete case: Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?",
    howItWorks: "Prove starting cases, assume P(1) through P(k), then prove P(k+1).",
    whyItWorks: "Some problems need more than the immediately previous case.",
    worked: [
      { prompt: "Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", steps: ["1=1*2/2.", "1.", "1"], answer: "1" },
      { prompt: "If P(8) is assumed, the inductive step proves which next case?", steps: ["Assume P(8), prove P(9).", "9.", "9."], answer: "9" },
      { prompt: "Does checking n=1,2,3 finish an induction proof?", steps: ["Induction needs the general step.", "No.", "No."], answer: "no" }
    ],
  },
  10134: {
    introduction: "Binomial Expansion works this concrete case: In Binomial Expansion, evaluate the labelled model at input 9. The labelled answer is 18. Class 11 Binomial Theorem: Teach Binomial Expansion as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Binomial Expansion rule with live values. A common labelled error is writing all coefficients as 1. Binomial Expansion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The binomial expansion gives a formula for expanding (a+b)^n using binomial coefficients. Coefficients count the ways to choose which factors contribute b. Class 11 Binomial Theorem: Teach Binomial Expansion as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Binomial Expansion rule with live values. Binomial Expansion is the Binomial Theorem rule used to compute one labelled numerical result.",
    basicIdea: "Binomial Expansion works this concrete case: In Binomial Expansion, evaluate the labelled model at input 9.",
    howItWorks: "Write terms with powers of a decreasing and powers of b increasing, using coefficients nCr.",
    whyItWorks: "Coefficients count the ways to choose which factors contribute b.",
    worked: [
      { prompt: "In Binomial Expansion, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Binomial Expansion rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Binomial Expansion outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this Binomial Expansion case with input 2: Can you skip the Binomial Expansion restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10135: {
    introduction: "General Term works this concrete case: Compute this General Term case with input 2: In General Term, evaluate the labelled model at input 10. Labelled result 2 → 30. The labelled answer is 30. Class 11 Binomial Theorem: Teach General Term as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the General Term rule with live values. A common labelled error is confusing r with r+1 in the term number. General Term keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The general term of a binomial expansion gives the r-th pattern term without writing every term. Each term chooses r copies of b and n-r copies of a. Class 11 Binomial Theorem: Teach General Term as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the General Term rule with live values. General Term is the Binomial Theorem rule used to compute one labelled numerical result.",
    basicIdea: "General Term works this concrete case: Compute this General Term case with input 2: In General Term, evaluate the labelled model at input 10. Labelled result 2 → 30.",
    howItWorks: "Use T_(r+1)=nCr a^(n-r)b^r, then substitute r.",
    whyItWorks: "Each term chooses r copies of b and n-r copies of a.",
    worked: [
      { prompt: "Compute this General Term case with input 2: In General Term, evaluate the labelled model at input 10. Labelled result 2 → 30.", steps: ["Substitute 10 into the General Term rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compute this General Term case with input 2: Compare the General Term outputs at 10 and 13. What is the difference? Labelled result 3.", steps: ["Second input 13.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Compute this General Term case with input 2: Can you skip the General Term restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10136: {
    introduction: "Middle Term works this concrete case: In Middle Term, evaluate the labelled model at input 3. The labelled answer is 12. Class 11 Binomial Theorem: Teach Middle Term as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Middle Term rule with live values. A common labelled error is always choosing only one middle term. Middle Term keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The middle term is the central term or central pair in a binomial expansion. The number of terms decides whether one or two terms sit in the centre. Class 11 Binomial Theorem: Teach Middle Term as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Middle Term rule with live values. Middle Term is the Binomial Theorem rule used to compute one labelled numerical result.",
    basicIdea: "Middle Term works this concrete case: In Middle Term, evaluate the labelled model at input 3.",
    howItWorks: "Count n+1 terms; if n is even choose one middle term, and if n is odd choose two middle terms.",
    whyItWorks: "The number of terms decides whether one or two terms sit in the centre.",
    worked: [
      { prompt: "In Middle Term, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Middle Term rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Middle Term outputs at 3 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Compute this Middle Term case with input 2: Can you skip the Middle Term restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10137: {
    introduction: "Independent Term works this concrete case: In Independent Term, evaluate the labelled model at input 4. The labelled answer is 20. Class 11 Binomial Theorem: Teach Independent Term as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Independent Term rule with live values. A common labelled error is choosing the constant-looking coefficient before checking powers. Independent Term keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An independent term in an expansion is the term whose variable power is zero. A variable to power zero equals 1, so that term has no variable factor. Class 11 Binomial Theorem: Teach Independent Term as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Independent Term rule with live values. Independent Term is the Binomial Theorem rule used to compute one labelled numerical result.",
    basicIdea: "Independent Term works this concrete case: In Independent Term, evaluate the labelled model at input 4.",
    howItWorks: "Write the general term, set the variable exponent to 0, solve for r, then substitute.",
    whyItWorks: "A variable to power zero equals 1, so that term has no variable factor.",
    worked: [
      { prompt: "In Independent Term, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Independent Term rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Independent Term outputs at 4 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Compute this Independent Term case with input 2: Can you skip the Independent Term restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10138: {
    introduction: "Binomial Approximation works this concrete case: If a measurement is 5.0 ± 0.6, what is the upper bound? The labelled answer is 5.6. Class 11 Binomial Theorem: Teach Binomial Approximation as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Binomial Approximation rule with live values. A common labelled error is using it for large x without checking accuracy. Binomial Approximation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Binomial approximation uses early terms of (1+x)^n when x is small. Small powers of x become very small, so later terms may be ignored for an approximation. Class 11 Binomial Theorem: Teach Binomial Approximation as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Binomial Approximation rule with live values. Binomial Approximation is the Binomial Theorem rule used to compute one labelled numerical result.",
    basicIdea: "Binomial Approximation works this concrete case: If a measurement is 5.0 ± 0.6, what is the upper bound?",
    howItWorks: "Keep the needed first terms, usually 1+nx for a first approximation, then estimate.",
    whyItWorks: "Small powers of x become very small, so later terms may be ignored for an approximation.",
    worked: [
      { prompt: "If a measurement is 5.0 ± 0.6, what is the upper bound?", steps: ["Upper = value + error.", "5.6.", "5.6."], answer: "5.6" },
      { prompt: "Absolute error from 5 reported as 6?", steps: ["|reported-true|.", "1.", "1."], answer: "1" },
      { prompt: "Compute this Binomial Approximation case with input 2: Is a smaller absolute error always a smaller percent error? Labelled result 2 → no.", steps: ["Percent error divides by the true size.", "A tiny true value can inflate percent error.", "No."], answer: "no" }
    ],
  },
  10139: {
    introduction: "Pascal Identity works this concrete case: In Pascal Identity, evaluate the labelled model at input 6. The labelled answer is 42. Class 11 Binomial Theorem: Teach Pascal Identity as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Pascal Identity rule with live values. A common labelled error is adding entries from the wrong row. Pascal Identity keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Pascal identity says nCr = (n-1)C(r-1) + (n-1)Cr. A choice of r objects either includes a fixed object or does not include it. Class 11 Binomial Theorem: Teach Pascal Identity as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Pascal Identity rule with live values. Pascal Identity is the Binomial Theorem rule used to compute one labelled numerical result.",
    basicIdea: "Pascal Identity works this concrete case: In Pascal Identity, evaluate the labelled model at input 6.",
    howItWorks: "Read the two parent entries above a Pascal triangle entry, then add them.",
    whyItWorks: "A choice of r objects either includes a fixed object or does not include it.",
    worked: [
      { prompt: "In Pascal Identity, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Pascal Identity rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Pascal Identity outputs at 6 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Compute this Pascal Identity case with input 2: Can you skip the Pascal Identity restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10140: {
    introduction: "Combinatorial Interpretation works this concrete case: In Combinatorial Interpretation, evaluate the labelled model at input 7. The labelled answer is 14. Class 11 Binomial Theorem: Teach Combinatorial Interpretation as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Combinatorial Interpretation rule with live values. A common labelled error is treating nCr as only a symbol. Combinatorial Interpretation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The combinatorial interpretation explains binomial coefficients as counts of choices. The coefficient counts how many ways a term can be formed from n factors. Class 11 Binomial Theorem: Teach Combinatorial Interpretation as a Class 11 Binomial Theorem concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Combinatorial Interpretation rule with live values. Combinatorial Interpretation is the Binomial Theorem rule used to compute one labelled numerical result.",
    basicIdea: "Combinatorial Interpretation works this concrete case: In Combinatorial Interpretation, evaluate the labelled model at input 7.",
    howItWorks: "Connect nCr to choosing r objects from n objects, then use counting to explain the formula.",
    whyItWorks: "The coefficient counts how many ways a term can be formed from n factors.",
    worked: [
      { prompt: "In Combinatorial Interpretation, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Combinatorial Interpretation rule.", "The first stored value is 14.", "14."], answer: "14" },
      { prompt: "Compare the Combinatorial Interpretation outputs at 7 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this Combinatorial Interpretation case with input 2: Can you skip the Combinatorial Interpretation restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10141: {
    introduction: "Parabola Standard Forms works this concrete case: In Parabola Standard Forms, evaluate the labelled model at input 8. The labelled answer is 24. Class 11 Conic Sections: Teach Parabola Standard Forms as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parabola Standard Forms rule with live values. A common labelled error is using a nearby formula that is not the Parabola Standard Forms rule. Parabola Standard Forms keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Conic Sections: Teach Parabola Standard Forms as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parabola Standard Forms rule with live values. Parabola Standard Forms is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Parabola Standard Forms works this concrete case: In Parabola Standard Forms, evaluate the labelled model at input 8.",
    howItWorks: "Read the Parabola Standard Forms inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Parabola Standard Forms works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Parabola Standard Forms, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Parabola Standard Forms rule.", "The first stored value is 24.", "24."], answer: "24" },
      { prompt: "Compare the Parabola Standard Forms outputs at 8 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Compute this Parabola Standard Forms case with input 2: Can you skip the Parabola Standard Forms restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10142: {
    introduction: "Focus-Directrix Definition works this concrete case: In Focus-Directrix Definition, evaluate the labelled model at input 9. The labelled answer is 36. Class 11 Conic Sections: Teach Focus-Directrix Definition as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Focus-Directrix Definition rule with live values. A common labelled error is using a nearby formula that is not the Focus-Directrix Definition rule. Focus-Directrix Definition keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Conic Sections: Teach Focus-Directrix Definition as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Focus-Directrix Definition rule with live values. Focus-Directrix Definition is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Focus-Directrix Definition works this concrete case: In Focus-Directrix Definition, evaluate the labelled model at input 9.",
    howItWorks: "Read the Focus-Directrix Definition inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Focus-Directrix Definition works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Focus-Directrix Definition, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Focus-Directrix Definition rule.", "The first stored value is 36.", "36."], answer: "36" },
      { prompt: "Compare the Focus-Directrix Definition outputs at 9 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Compute this Focus-Directrix Definition case with input 2: Can you skip the Focus-Directrix Definition restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10143: {
    introduction: "Ellipse Standard Forms works this concrete case: Compute this Ellipse Standard Forms case with input 2: In Ellipse Standard Forms, evaluate the labelled model at input 10. Labelled result 2 → 50. The labelled answer is 50. Class 11 Conic Sections: Teach Ellipse Standard Forms as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Ellipse Standard Forms rule with live values. A common labelled error is using a nearby formula that is not the Ellipse Standard Forms rule. Ellipse Standard Forms keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Conic Sections: Teach Ellipse Standard Forms as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Ellipse Standard Forms rule with live values. Ellipse Standard Forms is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Ellipse Standard Forms works this concrete case: Compute this Ellipse Standard Forms case with input 2: In Ellipse Standard Forms, evaluate the labelled model at input 10. Labelled result 2 → 50.",
    howItWorks: "Read the Ellipse Standard Forms inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Ellipse Standard Forms works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Ellipse Standard Forms case with input 2: In Ellipse Standard Forms, evaluate the labelled model at input 10. Labelled result 2 → 50.", steps: ["Substitute 10 into the Ellipse Standard Forms rule.", "The first stored value is 50.", "50."], answer: "50" },
      { prompt: "Compute this Ellipse Standard Forms case with input 2: Compare the Ellipse Standard Forms outputs at 10 and 15. What is the difference? Labelled result 5.", steps: ["Second input 15.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Compute this Ellipse Standard Forms case with input 2: Can you skip the Ellipse Standard Forms restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10144: {
    introduction: "Hyperbola Standard Forms works this concrete case: In Hyperbola Standard Forms, evaluate the labelled model at input 3. The labelled answer is 18. Class 11 Conic Sections: Teach Hyperbola Standard Forms as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Hyperbola Standard Forms rule with live values. A common labelled error is using a nearby formula that is not the Hyperbola Standard Forms rule. Hyperbola Standard Forms keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Conic Sections: Teach Hyperbola Standard Forms as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Hyperbola Standard Forms rule with live values. Hyperbola Standard Forms is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Hyperbola Standard Forms works this concrete case: In Hyperbola Standard Forms, evaluate the labelled model at input 3.",
    howItWorks: "Read the Hyperbola Standard Forms inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Hyperbola Standard Forms works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Hyperbola Standard Forms, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Hyperbola Standard Forms rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Hyperbola Standard Forms outputs at 3 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Compute this Hyperbola Standard Forms case with input 2: Can you skip the Hyperbola Standard Forms restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10145: {
    introduction: "Eccentricity works this concrete case: In Eccentricity, evaluate the labelled model at input 4. The labelled answer is 28. Class 11 Conic Sections: Teach Eccentricity as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Eccentricity rule with live values. A common labelled error is using a nearby formula that is not the Eccentricity rule. Eccentricity keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 11 Conic Sections: Teach Eccentricity as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Eccentricity rule with live values. Eccentricity is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Eccentricity works this concrete case: In Eccentricity, evaluate the labelled model at input 4.",
    howItWorks: "Read the Eccentricity inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Eccentricity works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Eccentricity, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Eccentricity rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Eccentricity outputs at 4 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Compute this Eccentricity case with input 2: Can you skip the Eccentricity restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10146: {
    introduction: "Parametric Coordinates works this concrete case: In Parametric Coordinates, evaluate the labelled model at input 5. The labelled answer is 10. Class 11 Conic Sections: Teach Parametric Coordinates as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parametric Coordinates rule with live values. A common labelled error is treating the parameter as a fixed constant for the whole curve. Parametric Coordinates keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Parametric coordinates describe points on a curve using a parameter instead of one direct equation. A changing parameter traces the curve point by point. Class 11 Conic Sections: Teach Parametric Coordinates as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Parametric Coordinates rule with live values. Parametric Coordinates is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Parametric Coordinates works this concrete case: In Parametric Coordinates, evaluate the labelled model at input 5.",
    howItWorks: "Choose a parameter value, substitute into x and y formulas, then plot the point.",
    whyItWorks: "A changing parameter traces the curve point by point.",
    worked: [
      { prompt: "In Parametric Coordinates, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Parametric Coordinates rule.", "The first stored value is 10.", "10."], answer: "10" },
      { prompt: "Compare the Parametric Coordinates outputs at 5 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this Parametric Coordinates case with input 2: Can you skip the Parametric Coordinates restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10147: {
    introduction: "Tangent to a Parabola works this concrete case: Compute this Tangent to a Parabola case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 11 Conic Sections: Teach Tangent to a Parabola as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangent to a Parabola rule with live values. A common labelled error is using the normal formula instead. Tangent to a Parabola keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The tangent to a parabola touches the parabola at one point and has a standard equation at a parameter value. The tangent shares the curve's direction at the point of contact. Class 11 Conic Sections: Teach Tangent to a Parabola as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangent to a Parabola rule with live values. Tangent to a Parabola is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Tangent to a Parabola works this concrete case: Compute this Tangent to a Parabola case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Identify the point parameter t, then substitute into the tangent formula.",
    whyItWorks: "The tangent shares the curve's direction at the point of contact.",
    worked: [
      { prompt: "Compute this Tangent to a Parabola case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangent to a Parabola case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangent to a Parabola case with input 2: Does Tangent to a Parabola treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10148: {
    introduction: "Normal to a Parabola works this concrete case: In Normal to a Parabola, evaluate the labelled model at input 7. The labelled answer is 28. Class 11 Conic Sections: Teach Normal to a Parabola as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Normal to a Parabola rule with live values. A common labelled error is using a different parameter for tangent and normal. Normal to a Parabola keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The normal to a parabola is the line perpendicular to the tangent at the point of contact. Perpendicular slopes connect the tangent and normal at the same point. Class 11 Conic Sections: Teach Normal to a Parabola as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Normal to a Parabola rule with live values. Normal to a Parabola is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Normal to a Parabola works this concrete case: In Normal to a Parabola, evaluate the labelled model at input 7.",
    howItWorks: "Identify parameter t, then substitute into the normal equation.",
    whyItWorks: "Perpendicular slopes connect the tangent and normal at the same point.",
    worked: [
      { prompt: "In Normal to a Parabola, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Normal to a Parabola rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Normal to a Parabola outputs at 7 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Compute this Normal to a Parabola case with input 2: Can you skip the Normal to a Parabola restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10149: {
    introduction: "Tangent to an Ellipse works this concrete case: Compute this Tangent to an Ellipse case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 11 Conic Sections: Teach Tangent to an Ellipse as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangent to an Ellipse rule with live values. A common labelled error is using circle tangent formulas for every ellipse. Tangent to an Ellipse keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The tangent to an ellipse touches the ellipse at one point and can be written from the point of contact. The tangent gives the single straight-line direction at that ellipse point. Class 11 Conic Sections: Teach Tangent to an Ellipse as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangent to an Ellipse rule with live values. Tangent to an Ellipse is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Tangent to an Ellipse works this concrete case: Compute this Tangent to an Ellipse case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Use the contact point or parameter, then substitute in the ellipse tangent formula.",
    whyItWorks: "The tangent gives the single straight-line direction at that ellipse point.",
    worked: [
      { prompt: "Compute this Tangent to an Ellipse case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangent to an Ellipse case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangent to an Ellipse case with input 2: Does Tangent to an Ellipse treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10150: {
    introduction: "Tangent to a Hyperbola works this concrete case: Compute this Tangent to a Hyperbola case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 11 Conic Sections: Teach Tangent to a Hyperbola as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangent to a Hyperbola rule with live values. A common labelled error is using the ellipse plus-sign tangent formula. Tangent to a Hyperbola keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The tangent to a hyperbola touches one branch at one point and follows a standard point form. The tangent has exactly one contact point with the conic at that location. Class 11 Conic Sections: Teach Tangent to a Hyperbola as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangent to a Hyperbola rule with live values. Tangent to a Hyperbola is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Tangent to a Hyperbola works this concrete case: Compute this Tangent to a Hyperbola case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Use the point of contact, then substitute into the hyperbola tangent formula.",
    whyItWorks: "The tangent has exactly one contact point with the conic at that location.",
    worked: [
      { prompt: "Compute this Tangent to a Hyperbola case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangent to a Hyperbola case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangent to a Hyperbola case with input 2: Does Tangent to a Hyperbola treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10151: {
    introduction: "Conic Identification from General Equation works this concrete case: Compute this Conic Identification from General Equation case with input 2: Solve 7x = 70. Labelled result 2 → 10. The labelled answer is 10. Class 11 Conic Sections: Teach Conic Identification from General Equation as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Conic Identification from General Equation rule with live values. A common labelled error is classifying before checking signs and coefficients. Conic Identification from General Equation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Conic identification classifies a second-degree equation as circle, parabola, ellipse, or hyperbola. The squared-term pattern controls the conic shape. Class 11 Conic Sections: Teach Conic Identification from General Equation as a Class 11 Conic Sections concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Conic Identification from General Equation rule with live values. Conic Identification from General Equation is the Conic Sections rule used to compute one labelled numerical result.",
    basicIdea: "Conic Identification from General Equation works this concrete case: Compute this Conic Identification from General Equation case with input 2: Solve 7x = 70. Labelled result 2 → 10.",
    howItWorks: "Inspect the x^2 and y^2 coefficients and signs, then complete squares when needed.",
    whyItWorks: "The squared-term pattern controls the conic shape.",
    worked: [
      { prompt: "Compute this Conic Identification from General Equation case with input 2: Solve 7x = 70. Labelled result 2 → 10.", steps: ["Divide by 7.", "x=10.", "10."], answer: "10" },
      { prompt: "Expand 7(x+5).", steps: ["7x+35.", "7x+35.", "7x+35."], answer: "7x+35" },
      { prompt: "Is x=10 a root of (x-10)(x-5)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10152: {
    introduction: "Direction Ratios works this concrete case: In Direction Ratios, evaluate the labelled model at input 3. The labelled answer is 6. Class 12 Three-Dimensional Geometry: Teach Direction Ratios as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Direction Ratios rule with live values. A common labelled error is using a nearby formula that is not the Direction Ratios rule. Direction Ratios keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Direction Ratios as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Direction Ratios rule with live values. Direction Ratios is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Direction Ratios works this concrete case: In Direction Ratios, evaluate the labelled model at input 3.",
    howItWorks: "Read the Direction Ratios inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Direction Ratios works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Direction Ratios, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Direction Ratios rule.", "The first stored value is 6.", "6."], answer: "6" },
      { prompt: "Compare the Direction Ratios outputs at 3 and 5. What is the difference?", steps: ["Second input 5.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this Direction Ratios case with input 2: Can you skip the Direction Ratios restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10153: {
    introduction: "Direction Cosines works this concrete case: Compute this Direction Cosines case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 12 Three-Dimensional Geometry: Teach Direction Cosines as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Direction Cosines rule with live values. A common labelled error is using a nearby formula that is not the Direction Cosines rule. Direction Cosines keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Direction Cosines as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Direction Cosines rule with live values. Direction Cosines is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Direction Cosines works this concrete case: Compute this Direction Cosines case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Read the Direction Cosines inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Direction Cosines works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Direction Cosines case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Direction Cosines case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Direction Cosines case with input 2: Does Direction Cosines treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10154: {
    introduction: "Line Through Two Points in 3D works this concrete case: In Line Through Two Points in 3D, evaluate the labelled model at input 5. The labelled answer is 20. Class 12 Three-Dimensional Geometry: Teach Line Through Two Points in 3D as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Line Through Two Points in 3D rule with live values. A common labelled error is using a nearby formula that is not the Line Through Two Points in 3D rule. Line Through Two Points in 3D keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Line Through Two Points in 3D as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Line Through Two Points in 3D rule with live values. Line Through Two Points in 3D is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Line Through Two Points in 3D works this concrete case: In Line Through Two Points in 3D, evaluate the labelled model at input 5.",
    howItWorks: "Read the Line Through Two Points in 3D inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Line Through Two Points in 3D works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Line Through Two Points in 3D, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Line Through Two Points in 3D rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Line Through Two Points in 3D outputs at 5 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Line Through Two Points in 3D restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10155: {
    introduction: "Vector Equation of a Line works this concrete case: Compute this Vector Equation of a Line case with input 2: Solve 5x = 30. Labelled result 6. The labelled answer is 6. Class 12 Three-Dimensional Geometry: Teach Vector Equation of a Line as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Vector Equation of a Line rule with live values. A common labelled error is using a nearby formula that is not the Vector Equation of a Line rule. Vector Equation of a Line keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Vector Equation of a Line as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Vector Equation of a Line rule with live values. Vector Equation of a Line is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Vector Equation of a Line works this concrete case: Compute this Vector Equation of a Line case with input 2: Solve 5x = 30. Labelled result 6.",
    howItWorks: "Read the Vector Equation of a Line inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Vector Equation of a Line works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Vector Equation of a Line case with input 2: Solve 5x = 30. Labelled result 6.", steps: ["Divide by 5.", "x=6.", "6."], answer: "6" },
      { prompt: "Expand 5(x+9).", steps: ["5x+45.", "5x+45.", "5x+45."], answer: "5x+45" },
      { prompt: "Is x=6 a root of (x-6)(x-9)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10156: {
    introduction: "Cartesian Equation of a Line works this concrete case: If A has 7 elements, |P(A)| is? The labelled answer is 128. Class 12 Three-Dimensional Geometry: Teach Cartesian Equation of a Line as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Cartesian Equation of a Line rule with live values. A common labelled error is using a nearby formula that is not the Cartesian Equation of a Line rule. Cartesian Equation of a Line keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Cartesian Equation of a Line as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Cartesian Equation of a Line rule with live values. Cartesian Equation of a Line is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Cartesian Equation of a Line works this concrete case: If A has 7 elements, |P(A)| is?",
    howItWorks: "Read the Cartesian Equation of a Line inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Cartesian Equation of a Line works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "If A has 7 elements, |P(A)| is?", steps: ["A power set has 2^n subsets.", "2^7=128.", "128."], answer: "128" },
      { prompt: "|A union B| if |A|=7, |B|=6, |A intersect B|=2?", steps: ["|A union B|=|A|+|B|-|A intersect B|.", "11.", "11."], answer: "11" },
      { prompt: "Compute this Cartesian Equation of a Line case with input 2: Is the empty set a subset of every set? Labelled result 2 → yes.", steps: ["∅ is a subset of every set.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10157: {
    introduction: "Skew Lines works this concrete case: In Skew Lines, evaluate the labelled model at input 8. The labelled answer is 56. Class 12 Three-Dimensional Geometry: Teach Skew Lines as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Skew Lines rule with live values. A common labelled error is using a nearby formula that is not the Skew Lines rule. Skew Lines keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Skew Lines as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Skew Lines rule with live values. Skew Lines is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Skew Lines works this concrete case: In Skew Lines, evaluate the labelled model at input 8.",
    howItWorks: "Read the Skew Lines inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Skew Lines works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Skew Lines, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Skew Lines rule.", "The first stored value is 56.", "56."], answer: "56" },
      { prompt: "Compare the Skew Lines outputs at 8 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Compute this Skew Lines case with input 2: Can you skip the Skew Lines restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10158: {
    introduction: "Shortest Distance Between Lines works this concrete case: In Shortest Distance Between Lines, evaluate the labelled model at input 9. The labelled answer is 18. Class 12 Three-Dimensional Geometry: Teach Shortest Distance Between Lines as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Shortest Distance Between Lines rule with live values. A common labelled error is using a nearby formula that is not the Shortest Distance Between Lines rule. Shortest Distance Between Lines keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Shortest Distance Between Lines as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Shortest Distance Between Lines rule with live values. Shortest Distance Between Lines is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Shortest Distance Between Lines works this concrete case: In Shortest Distance Between Lines, evaluate the labelled model at input 9.",
    howItWorks: "Read the Shortest Distance Between Lines inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Shortest Distance Between Lines works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Shortest Distance Between Lines, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Shortest Distance Between Lines rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Shortest Distance Between Lines outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this Shortest Distance Between Lines case with input 2: Can you skip the Shortest Distance Between Lines restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10159: {
    introduction: "Plane Equation works this concrete case: Compute this Plane Equation case with input 2: Solve 3x = 30. Labelled result 2 → 10. The labelled answer is 10. Class 12 Three-Dimensional Geometry: Teach Plane Equation as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Plane Equation rule with live values. A common labelled error is using a nearby formula that is not the Plane Equation rule. Plane Equation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Plane Equation as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Plane Equation rule with live values. Plane Equation is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Plane Equation works this concrete case: Compute this Plane Equation case with input 2: Solve 3x = 30. Labelled result 2 → 10.",
    howItWorks: "Read the Plane Equation inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Plane Equation works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Plane Equation case with input 2: Solve 3x = 30. Labelled result 2 → 10.", steps: ["Divide by 3.", "x=10.", "10."], answer: "10" },
      { prompt: "Expand 3(x+6).", steps: ["3x+18.", "3x+18.", "3x+18."], answer: "3x+18" },
      { prompt: "Is x=10 a root of (x-10)(x-6)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10160: {
    introduction: "Point-Normal Form works this concrete case: In Point-Normal Form, evaluate the labelled model at input 3. The labelled answer is 12. Class 12 Three-Dimensional Geometry: Teach Point-Normal Form as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Point-Normal Form rule with live values. A common labelled error is using a nearby formula that is not the Point-Normal Form rule. Point-Normal Form keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Point-Normal Form as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Point-Normal Form rule with live values. Point-Normal Form is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Point-Normal Form works this concrete case: In Point-Normal Form, evaluate the labelled model at input 3.",
    howItWorks: "Read the Point-Normal Form inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Point-Normal Form works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Point-Normal Form, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Point-Normal Form rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Point-Normal Form outputs at 3 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Compute this Point-Normal Form case with input 2: Can you skip the Point-Normal Form restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10161: {
    introduction: "Intercept Form of a Plane works this concrete case: In Intercept Form of a Plane, evaluate the labelled model at input 4. The labelled answer is 20. Class 12 Three-Dimensional Geometry: Teach Intercept Form of a Plane as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Intercept Form of a Plane rule with live values. A common labelled error is using a nearby formula that is not the Intercept Form of a Plane rule. Intercept Form of a Plane keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Intercept Form of a Plane as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Intercept Form of a Plane rule with live values. Intercept Form of a Plane is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Intercept Form of a Plane works this concrete case: In Intercept Form of a Plane, evaluate the labelled model at input 4.",
    howItWorks: "Read the Intercept Form of a Plane inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Intercept Form of a Plane works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Intercept Form of a Plane, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Intercept Form of a Plane rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Intercept Form of a Plane outputs at 4 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Compute this Intercept Form of a Plane case with input 2: Can you skip the Intercept Form of a Plane restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10162: {
    introduction: "Distance from Point to Plane works this concrete case: In Distance from Point to Plane, evaluate the labelled model at input 5. The labelled answer is 30. Class 12 Three-Dimensional Geometry: Teach Distance from Point to Plane as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Distance from Point to Plane rule with live values. A common labelled error is using a nearby formula that is not the Distance from Point to Plane rule. Distance from Point to Plane keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Distance from Point to Plane as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Distance from Point to Plane rule with live values. Distance from Point to Plane is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Distance from Point to Plane works this concrete case: In Distance from Point to Plane, evaluate the labelled model at input 5.",
    howItWorks: "Read the Distance from Point to Plane inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Distance from Point to Plane works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Distance from Point to Plane, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Distance from Point to Plane rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Distance from Point to Plane outputs at 5 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Compute this Distance from Point to Plane case with input 2: Can you skip the Distance from Point to Plane restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10163: {
    introduction: "Angle Between Two Planes works this concrete case: Compute this Angle Between Two Planes case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 12 Three-Dimensional Geometry: Teach Angle Between Two Planes as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle Between Two Planes rule with live values. A common labelled error is using a nearby formula that is not the Angle Between Two Planes rule. Angle Between Two Planes keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Angle Between Two Planes as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle Between Two Planes rule with live values. Angle Between Two Planes is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Angle Between Two Planes works this concrete case: Compute this Angle Between Two Planes case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Read the Angle Between Two Planes inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Angle Between Two Planes works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Angle Between Two Planes case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Angle Between Two Planes case with input 2: Add 60° and 70°. What is the sum? Labelled result 2 → 130.", steps: ["60+70.", "130.", "130."], answer: "130" },
      { prompt: "Compute this Angle Between Two Planes case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10164: {
    introduction: "Angle Between Line and Plane works this concrete case: Compute this Angle Between Line and Plane case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90. The labelled answer is 90. Class 12 Three-Dimensional Geometry: Teach Angle Between Line and Plane as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle Between Line and Plane rule with live values. A common labelled error is using a nearby formula that is not the Angle Between Line and Plane rule. Angle Between Line and Plane keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Three-Dimensional Geometry: Teach Angle Between Line and Plane as a Class 12 Three-Dimensional Geometry concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Angle Between Line and Plane rule with live values. Angle Between Line and Plane is the Three-Dimensional Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Angle Between Line and Plane works this concrete case: Compute this Angle Between Line and Plane case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.",
    howItWorks: "Read the Angle Between Line and Plane inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Angle Between Line and Plane works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Angle Between Line and Plane case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Compute this Angle Between Line and Plane case with input 2: Add 70° and 20°. What is the sum? Labelled result 2 → 90.", steps: ["70+20.", "90.", "90."], answer: "90" },
      { prompt: "Compute this Angle Between Line and Plane case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10165: {
    introduction: "Left-Hand and Right-Hand Limits works this concrete case: Estimate lim x→8 of (x-8)/(x-8) after cancelling. The labelled answer is 1. Class 12 Formal Calculus: Teach Left-Hand and Right-Hand Limits as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Left-Hand and Right-Hand Limits rule with live values. A common labelled error is using a nearby formula that is not the Left-Hand and Right-Hand Limits rule. Left-Hand and Right-Hand Limits keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Left-Hand and Right-Hand Limits as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Left-Hand and Right-Hand Limits rule with live values. Left-Hand and Right-Hand Limits is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Left-Hand and Right-Hand Limits works this concrete case: Estimate lim x→8 of (x-8)/(x-8) after cancelling.",
    howItWorks: "Read the Left-Hand and Right-Hand Limits inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Left-Hand and Right-Hand Limits works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Estimate lim x→8 of (x-8)/(x-8) after cancelling.", steps: ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], answer: "1" },
      { prompt: "Does a hole at x=8 make the two-sided limit fail if both sides match?", steps: ["A hole can still have a limit.", "The function value may be missing.", "No."], answer: "no" },
      { prompt: "If left=3 and right=4, does the two-sided limit exist?", steps: ["Sides must agree.", "3≠4.", "No."], answer: "no" }
    ],
  },
  10166: {
    introduction: "Continuity at a Point works this concrete case: In Continuity at a Point, evaluate the labelled model at input 9. The labelled answer is 36. Class 12 Formal Calculus: Teach Continuity at a Point as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Continuity at a Point rule with live values. A common labelled error is using a nearby formula that is not the Continuity at a Point rule. Continuity at a Point keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Continuity at a Point as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Continuity at a Point rule with live values. Continuity at a Point is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Continuity at a Point works this concrete case: In Continuity at a Point, evaluate the labelled model at input 9.",
    howItWorks: "Read the Continuity at a Point inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Continuity at a Point works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Continuity at a Point, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Continuity at a Point rule.", "The first stored value is 36.", "36."], answer: "36" },
      { prompt: "Compare the Continuity at a Point outputs at 9 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Compute this Continuity at a Point case with input 2: Can you skip the Continuity at a Point restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10167: {
    introduction: "Continuity on an Interval works this concrete case: A 95% CI is 10 ± 5. What is the upper bound? The labelled answer is 15. Class 12 Formal Calculus: Teach Continuity on an Interval as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Continuity on an Interval rule with live values. A common labelled error is using a nearby formula that is not the Continuity on an Interval rule. Continuity on an Interval keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Continuity on an Interval as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Continuity on an Interval rule with live values. Continuity on an Interval is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Continuity on an Interval works this concrete case: A 95% CI is 10 ± 5. What is the upper bound?",
    howItWorks: "Read the Continuity on an Interval inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Continuity on an Interval works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A 95% CI is 10 ± 5. What is the upper bound?", steps: ["10+5.", "15.", "15."], answer: "15" },
      { prompt: "If SE=5 and z*=2, what is the margin of error?", steps: ["ME=z*×SE.", "2*5=10.", "10."], answer: "10" },
      { prompt: "Compute this Continuity on an Interval case with input 2: Does a 95% CI contain the sample mean by construction for a symmetric interval around the mean? Labelled result 2 → yes.", steps: ["The interval is centred on the sample mean.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10168: {
    introduction: "Removable Discontinuity works this concrete case: In Removable Discontinuity, evaluate the labelled model at input 3. The labelled answer is 18. Class 12 Formal Calculus: Teach Removable Discontinuity as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Removable Discontinuity rule with live values. A common labelled error is using a nearby formula that is not the Removable Discontinuity rule. Removable Discontinuity keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Removable Discontinuity as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Removable Discontinuity rule with live values. Removable Discontinuity is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Removable Discontinuity works this concrete case: In Removable Discontinuity, evaluate the labelled model at input 3.",
    howItWorks: "Read the Removable Discontinuity inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Removable Discontinuity works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Removable Discontinuity, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Removable Discontinuity rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Removable Discontinuity outputs at 3 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Compute this Removable Discontinuity case with input 2: Can you skip the Removable Discontinuity restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10169: {
    introduction: "Jump Discontinuity works this concrete case: In Jump Discontinuity, evaluate the labelled model at input 4. The labelled answer is 28. Class 12 Formal Calculus: Teach Jump Discontinuity as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Jump Discontinuity rule with live values. A common labelled error is using a nearby formula that is not the Jump Discontinuity rule. Jump Discontinuity keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Jump Discontinuity as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Jump Discontinuity rule with live values. Jump Discontinuity is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Jump Discontinuity works this concrete case: In Jump Discontinuity, evaluate the labelled model at input 4.",
    howItWorks: "Read the Jump Discontinuity inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Jump Discontinuity works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Jump Discontinuity, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Jump Discontinuity rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Jump Discontinuity outputs at 4 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Compute this Jump Discontinuity case with input 2: Can you skip the Jump Discontinuity restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10170: {
    introduction: "Infinite Discontinuity works this concrete case: In Infinite Discontinuity, evaluate the labelled model at input 5. The labelled answer is 10. Class 12 Formal Calculus: Teach Infinite Discontinuity as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Infinite Discontinuity rule with live values. A common labelled error is using a nearby formula that is not the Infinite Discontinuity rule. Infinite Discontinuity keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Infinite Discontinuity as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Infinite Discontinuity rule with live values. Infinite Discontinuity is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Infinite Discontinuity works this concrete case: In Infinite Discontinuity, evaluate the labelled model at input 5.",
    howItWorks: "Read the Infinite Discontinuity inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Infinite Discontinuity works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Infinite Discontinuity, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Infinite Discontinuity rule.", "The first stored value is 10.", "10."], answer: "10" },
      { prompt: "Compare the Infinite Discontinuity outputs at 5 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this Infinite Discontinuity case with input 2: Can you skip the Infinite Discontinuity restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10171: {
    introduction: "Differentiability versus Continuity works this concrete case: In Differentiability versus Continuity, evaluate the labelled model at input 6. The labelled answer is 18. Class 12 Formal Calculus: Teach Differentiability versus Continuity as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Differentiability versus Continuity rule with live values. A common labelled error is using a nearby formula that is not the Differentiability versus Continuity rule. Differentiability versus Continuity keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Differentiability versus Continuity as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Differentiability versus Continuity rule with live values. Differentiability versus Continuity is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Differentiability versus Continuity works this concrete case: In Differentiability versus Continuity, evaluate the labelled model at input 6.",
    howItWorks: "Read the Differentiability versus Continuity inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Differentiability versus Continuity works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Differentiability versus Continuity, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Differentiability versus Continuity rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Differentiability versus Continuity outputs at 6 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Compute this Differentiability versus Continuity case with input 2: Can you skip the Differentiability versus Continuity restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10172: {
    introduction: "Rolle's Theorem works this concrete case: In Rolle's Theorem, evaluate the labelled model at input 7. The labelled answer is 28. Class 12 Formal Calculus: Teach Rolle's Theorem as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Rolle's Theorem rule with live values. A common labelled error is using a nearby formula that is not the Rolle's Theorem rule. Rolle's Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Rolle's Theorem as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Rolle's Theorem rule with live values. Rolle's Theorem is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Rolle's Theorem works this concrete case: In Rolle's Theorem, evaluate the labelled model at input 7.",
    howItWorks: "Read the Rolle's Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Rolle's Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Rolle's Theorem, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Rolle's Theorem rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Rolle's Theorem outputs at 7 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Compute this Rolle's Theorem case with input 2: Can you skip the Rolle's Theorem restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10173: {
    introduction: "Lagrange Mean Value Theorem works this concrete case: Find the mean of 8, 5, 6, 9. The labelled answer is 7. Class 12 Formal Calculus: Teach Lagrange Mean Value Theorem as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Lagrange Mean Value Theorem rule with live values. A common labelled error is using a nearby formula that is not the Lagrange Mean Value Theorem rule. Lagrange Mean Value Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Lagrange Mean Value Theorem as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Lagrange Mean Value Theorem rule with live values. Lagrange Mean Value Theorem is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Lagrange Mean Value Theorem works this concrete case: Find the mean of 8, 5, 6, 9.",
    howItWorks: "Read the Lagrange Mean Value Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Lagrange Mean Value Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find the mean of 8, 5, 6, 9.", steps: ["Sum=28.", "Count=4.", "7."], answer: "7" },
      { prompt: "If one value increases by 5, how does the mean change?", steps: ["The total rises by 5.", "Mean rises by 5/4.", "1.25."], answer: "1.25" },
      { prompt: "Must the mean be one of the data values?", steps: ["The mean is a balance point.", "It can sit between values.", "No."], answer: "no" }
    ],
  },
  10174: {
    introduction: "Rate of Change works this concrete case: Differentiate f(x)=x^6. What is f'(9)? The labelled answer is 354294. Class 12 Formal Calculus: Teach Rate of Change as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Rate of Change rule with live values. A common labelled error is using a nearby formula that is not the Rate of Change rule. Rate of Change keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Rate of Change as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Rate of Change rule with live values. Rate of Change is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Rate of Change works this concrete case: Differentiate f(x)=x^6. What is f'(9)?",
    howItWorks: "Read the Rate of Change inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Rate of Change works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Differentiate f(x)=x^6. What is f'(9)?", steps: ["f'(x)=6x^5.", "Substitute x=9.", "354294."], answer: "354294" },
      { prompt: "Average rate of f(x)=x^2 from 9 to 10.", steps: ["Δy=19.", "Δx=1.", "19."], answer: "19" },
      { prompt: "Compute this Rate of Change case with input 2: Is the derivative the same as the average slope on a long interval? Labelled result 2 → no.", steps: ["Derivative is instantaneous.", "Average slope uses a secant.", "No."], answer: "no" }
    ],
  },
  10175: {
    introduction: "Tangents and Normals works this concrete case: Compute this Tangents and Normals case with input 2: Find sin 30°. Labelled result 1/2. The labelled answer is 1/2. Class 12 Formal Calculus: Teach Tangents and Normals as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangents and Normals rule with live values. A common labelled error is using a nearby formula that is not the Tangents and Normals rule. Tangents and Normals keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Tangents and Normals as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Tangents and Normals rule with live values. Tangents and Normals is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Tangents and Normals works this concrete case: Compute this Tangents and Normals case with input 2: Find sin 30°. Labelled result 1/2.",
    howItWorks: "Read the Tangents and Normals inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Tangents and Normals works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Tangents and Normals case with input 2: Find sin 30°. Labelled result 1/2.", steps: ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangents and Normals case with input 2: Find cos 60°. Labelled result 1/2.", steps: ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], answer: "1/2" },
      { prompt: "Compute this Tangents and Normals case with input 2: Does Tangents and Normals treat 90° the same as 90 radians? Labelled result 2 → no.", steps: ["Degrees and radians are different units.", "Convert before evaluating.", "No."], answer: "no" }
    ],
  },
  10176: {
    introduction: "Increasing and Decreasing Functions works this concrete case: In Increasing and Decreasing Functions, evaluate the labelled model at input 3. The labelled answer is 6. Class 12 Formal Calculus: Teach Increasing and Decreasing Functions as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Increasing and Decreasing Functions rule with live values. A common labelled error is using a nearby formula that is not the Increasing and Decreasing Functions rule. Increasing and Decreasing Functions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Increasing and Decreasing Functions as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Increasing and Decreasing Functions rule with live values. Increasing and Decreasing Functions is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Increasing and Decreasing Functions works this concrete case: In Increasing and Decreasing Functions, evaluate the labelled model at input 3.",
    howItWorks: "Read the Increasing and Decreasing Functions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Increasing and Decreasing Functions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Increasing and Decreasing Functions, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Increasing and Decreasing Functions rule.", "The first stored value is 6.", "6."], answer: "6" },
      { prompt: "Compare the Increasing and Decreasing Functions outputs at 3 and 5. What is the difference?", steps: ["Second input 5.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this Increasing and Decreasing Functions case with input 2: Can you skip the Increasing and Decreasing Functions restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10177: {
    introduction: "Local Maxima and Minima works this concrete case: In Local Maxima and Minima, evaluate the labelled model at input 4. The labelled answer is 12. Class 12 Formal Calculus: Teach Local Maxima and Minima as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Local Maxima and Minima rule with live values. A common labelled error is using a nearby formula that is not the Local Maxima and Minima rule. Local Maxima and Minima keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Local Maxima and Minima as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Local Maxima and Minima rule with live values. Local Maxima and Minima is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Local Maxima and Minima works this concrete case: In Local Maxima and Minima, evaluate the labelled model at input 4.",
    howItWorks: "Read the Local Maxima and Minima inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Local Maxima and Minima works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Local Maxima and Minima, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Local Maxima and Minima rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Local Maxima and Minima outputs at 4 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Compute this Local Maxima and Minima case with input 2: Can you skip the Local Maxima and Minima restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10178: {
    introduction: "Absolute Maxima and Minima works this concrete case: In Absolute Maxima and Minima, evaluate the labelled model at input 5. The labelled answer is 20. Class 12 Formal Calculus: Teach Absolute Maxima and Minima as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Absolute Maxima and Minima rule with live values. A common labelled error is using a nearby formula that is not the Absolute Maxima and Minima rule. Absolute Maxima and Minima keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Absolute Maxima and Minima as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Absolute Maxima and Minima rule with live values. Absolute Maxima and Minima is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Absolute Maxima and Minima works this concrete case: In Absolute Maxima and Minima, evaluate the labelled model at input 5.",
    howItWorks: "Read the Absolute Maxima and Minima inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Absolute Maxima and Minima works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Absolute Maxima and Minima, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Absolute Maxima and Minima rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Absolute Maxima and Minima outputs at 5 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Compute this Absolute Maxima and Minima case with input 2: Can you skip the Absolute Maxima and Minima restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10179: {
    introduction: "Approximation Using Differentials works this concrete case: If a measurement is 6.0 ± 0.5, what is the upper bound? The labelled answer is 6.5. Class 12 Formal Calculus: Teach Approximation Using Differentials as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Approximation Using Differentials rule with live values. A common labelled error is using a nearby formula that is not the Approximation Using Differentials rule. Approximation Using Differentials keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Approximation Using Differentials as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Approximation Using Differentials rule with live values. Approximation Using Differentials is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Approximation Using Differentials works this concrete case: If a measurement is 6.0 ± 0.5, what is the upper bound?",
    howItWorks: "Read the Approximation Using Differentials inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Approximation Using Differentials works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "If a measurement is 6.0 ± 0.5, what is the upper bound?", steps: ["Upper = value + error.", "6.5.", "6.5."], answer: "6.5" },
      { prompt: "Absolute error from 6 reported as 7?", steps: ["|reported-true|.", "1.", "1."], answer: "1" },
      { prompt: "Compute this Approximation Using Differentials case with input 2: Is a smaller absolute error always a smaller percent error? Labelled result 2 → no.", steps: ["Percent error divides by the true size.", "A tiny true value can inflate percent error.", "No."], answer: "no" }
    ],
  },
  10180: {
    introduction: "Integration by Substitution works this concrete case: In Integration by Substitution, evaluate the labelled model at input 7. The labelled answer is 42. Class 12 Formal Calculus: Teach Integration by Substitution as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Integration by Substitution rule with live values. A common labelled error is using a nearby formula that is not the Integration by Substitution rule. Integration by Substitution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Integration by Substitution as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Integration by Substitution rule with live values. Integration by Substitution is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Integration by Substitution works this concrete case: In Integration by Substitution, evaluate the labelled model at input 7.",
    howItWorks: "Read the Integration by Substitution inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Integration by Substitution works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Integration by Substitution, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Integration by Substitution rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Integration by Substitution outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Compute this Integration by Substitution case with input 2: Can you skip the Integration by Substitution restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10181: {
    introduction: "Integration by Parts works this concrete case: In Integration by Parts, evaluate the labelled model at input 8. The labelled answer is 56. Class 12 Formal Calculus: Teach Integration by Parts as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Integration by Parts rule with live values. A common labelled error is using a nearby formula that is not the Integration by Parts rule. Integration by Parts keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Integration by Parts as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Integration by Parts rule with live values. Integration by Parts is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Integration by Parts works this concrete case: In Integration by Parts, evaluate the labelled model at input 8.",
    howItWorks: "Read the Integration by Parts inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Integration by Parts works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Integration by Parts, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Integration by Parts rule.", "The first stored value is 56.", "56."], answer: "56" },
      { prompt: "Compare the Integration by Parts outputs at 8 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Compute this Integration by Parts case with input 2: Can you skip the Integration by Parts restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10182: {
    introduction: "Integration by Partial Fractions works this concrete case: In Integration by Partial Fractions, evaluate the labelled model at input 9. The labelled answer is 18. Class 12 Formal Calculus: Teach Integration by Partial Fractions as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Integration by Partial Fractions rule with live values. A common labelled error is using a nearby formula that is not the Integration by Partial Fractions rule. Integration by Partial Fractions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Integration by Partial Fractions as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Integration by Partial Fractions rule with live values. Integration by Partial Fractions is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Integration by Partial Fractions works this concrete case: In Integration by Partial Fractions, evaluate the labelled model at input 9.",
    howItWorks: "Read the Integration by Partial Fractions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Integration by Partial Fractions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Integration by Partial Fractions, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Integration by Partial Fractions rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Integration by Partial Fractions outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Compute this Integration by Partial Fractions case with input 2: Can you skip the Integration by Partial Fractions restriction and still trust the chart? Labelled result 2 → no.", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10183: {
    introduction: "Definite Integral Properties works this concrete case: Find ∫ 3x dx from 0 to 10. The labelled answer is 150. Class 12 Formal Calculus: Teach Definite Integral Properties as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Definite Integral Properties rule with live values. A common labelled error is using a nearby formula that is not the Definite Integral Properties rule. Definite Integral Properties keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Definite Integral Properties as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Definite Integral Properties rule with live values. Definite Integral Properties is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Definite Integral Properties works this concrete case: Find ∫ 3x dx from 0 to 10.",
    howItWorks: "Read the Definite Integral Properties inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Definite Integral Properties works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find ∫ 3x dx from 0 to 10.", steps: ["Antiderivative 3/2 x^2.", "Evaluate at 10 minus 0.", "150."], answer: "150" },
      { prompt: "If F'=3, what is F(10)-F(0) when F(t)=3t?", steps: ["F(10)=30.", "F(0)=0.", "30."], answer: "30" },
      { prompt: "Compute this Definite Integral Properties case with input 2: Does a definite integral always equal a rectangle area? Labelled result 2 → no.", steps: ["It is a signed net area.", "Shape need not be a rectangle.", "No."], answer: "no" }
    ],
  },
  10184: {
    introduction: "Area Under a Curve works this concrete case: Find the labelled area under a curve for base 3 and height 4. The labelled answer is 12. Class 12 Formal Calculus: Teach Area Under a Curve as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Area Under a Curve rule with live values. A common labelled error is using a nearby formula that is not the Area Under a Curve rule. Area Under a Curve keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Area Under a Curve as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Area Under a Curve rule with live values. Area Under a Curve is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Area Under a Curve works this concrete case: Find the labelled area under a curve for base 3 and height 4.",
    howItWorks: "Read the Area Under a Curve inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Area Under a Curve works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find the labelled area under a curve for base 3 and height 4.", steps: ["Use the Area Under a Curve formula.", "3 and 4 are the measured sides.", "The value is 12."], answer: "12" },
      { prompt: "If the height doubles from 4 to 8, what happens to this area model?", steps: ["Area scales with perpendicular height.", "New height 8.", "It doubles."], answer: "doubles" },
      { prompt: "Is perimeter 3+4 the same as area under a curve?", steps: ["Perimeter is boundary length.", "Area is interior measure.", "No."], answer: "no" }
    ],
  },
  10185: {
    introduction: "Area Between Curves works this concrete case: Find the labelled area between curves for base 4 and height 5. The labelled answer is 20. Class 12 Formal Calculus: Teach Area Between Curves as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Area Between Curves rule with live values. A common labelled error is using a nearby formula that is not the Area Between Curves rule. Area Between Curves keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Formal Calculus: Teach Area Between Curves as a Class 12 Formal Calculus concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Area Between Curves rule with live values. Area Between Curves is the Formal Calculus rule used to compute one labelled numerical result.",
    basicIdea: "Area Between Curves works this concrete case: Find the labelled area between curves for base 4 and height 5.",
    howItWorks: "Read the Area Between Curves inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Area Between Curves works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find the labelled area between curves for base 4 and height 5.", steps: ["Use the Area Between Curves formula.", "4 and 5 are the measured sides.", "The value is 20."], answer: "20" },
      { prompt: "If the height doubles from 5 to 10, what happens to this area model?", steps: ["Area scales with perpendicular height.", "New height 10.", "It doubles."], answer: "doubles" },
      { prompt: "Is perimeter 4+5 the same as area between curves?", steps: ["Perimeter is boundary length.", "Area is interior measure.", "No."], answer: "no" }
    ],
  },
  10186: {
    introduction: "Formation of Differential Equations works this concrete case: Compute this Formation of Differential Equations case with input 2: Solve 6x = 30. Labelled result 5. The labelled answer is 5. Class 12 Differential Equations: Teach Formation of Differential Equations as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Formation of Differential Equations rule with live values. A common labelled error is using a nearby formula that is not the Formation of Differential Equations rule. Formation of Differential Equations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Differential Equations: Teach Formation of Differential Equations as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Formation of Differential Equations rule with live values. Formation of Differential Equations is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Formation of Differential Equations works this concrete case: Compute this Formation of Differential Equations case with input 2: Solve 6x = 30. Labelled result 5.",
    howItWorks: "Read the Formation of Differential Equations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Formation of Differential Equations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Formation of Differential Equations case with input 2: Solve 6x = 30. Labelled result 5.", steps: ["Divide by 6.", "x=5.", "5."], answer: "5" },
      { prompt: "Expand 6(x+5).", steps: ["6x+30.", "6x+30.", "6x+30."], answer: "6x+30" },
      { prompt: "Is x=5 a root of (x-5)(x-5)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10187: {
    introduction: "Order and Degree works this concrete case: Compute this Order and Degree case with input 2: Solve 7x = 42. Labelled result 6. The labelled answer is 6. Class 12 Differential Equations: Teach Order and Degree as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Order and Degree rule with live values. A common labelled error is using a nearby formula that is not the Order and Degree rule. Order and Degree keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Differential Equations: Teach Order and Degree as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Order and Degree rule with live values. Order and Degree is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Order and Degree works this concrete case: Compute this Order and Degree case with input 2: Solve 7x = 42. Labelled result 6.",
    howItWorks: "Read the Order and Degree inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Order and Degree works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Order and Degree case with input 2: Solve 7x = 42. Labelled result 6.", steps: ["Divide by 7.", "x=6.", "6."], answer: "6" },
      { prompt: "Expand 7(x+6).", steps: ["7x+42.", "7x+42.", "7x+42."], answer: "7x+42" },
      { prompt: "Is x=6 a root of (x-6)(x-6)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10188: {
    introduction: "Variable-Separable Equations works this concrete case: Compute this Variable-Separable Equations case with input 2: Solve 2x = 14. Labelled result 7. The labelled answer is 7. Class 12 Differential Equations: Teach Variable-Separable Equations as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Variable-Separable Equations rule with live values. A common labelled error is using a nearby formula that is not the Variable-Separable Equations rule. Variable-Separable Equations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Differential Equations: Teach Variable-Separable Equations as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Variable-Separable Equations rule with live values. Variable-Separable Equations is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Variable-Separable Equations works this concrete case: Compute this Variable-Separable Equations case with input 2: Solve 2x = 14. Labelled result 7.",
    howItWorks: "Read the Variable-Separable Equations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Variable-Separable Equations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Variable-Separable Equations case with input 2: Solve 2x = 14. Labelled result 7.", steps: ["Divide by 2.", "x=7.", "7."], answer: "7" },
      { prompt: "Expand 2(x+7).", steps: ["2x+14.", "2x+14.", "2x+14."], answer: "2x+14" },
      { prompt: "Is x=7 a root of (x-7)(x-7)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10189: {
    introduction: "Homogeneous First-Order Equations works this concrete case: Compute this Homogeneous First-Order Equations case with input 2: Solve 3x = 24. Labelled result 8. The labelled answer is 8. Class 12 Differential Equations: Teach Homogeneous First-Order Equations as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Homogeneous First-Order Equations rule with live values. A common labelled error is using a nearby formula that is not the Homogeneous First-Order Equations rule. Homogeneous First-Order Equations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Differential Equations: Teach Homogeneous First-Order Equations as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Homogeneous First-Order Equations rule with live values. Homogeneous First-Order Equations is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Homogeneous First-Order Equations works this concrete case: Compute this Homogeneous First-Order Equations case with input 2: Solve 3x = 24. Labelled result 8.",
    howItWorks: "Read the Homogeneous First-Order Equations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Homogeneous First-Order Equations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Homogeneous First-Order Equations case with input 2: Solve 3x = 24. Labelled result 8.", steps: ["Divide by 3.", "x=8.", "8."], answer: "8" },
      { prompt: "Expand 3(x+8).", steps: ["3x+24.", "3x+24.", "3x+24."], answer: "3x+24" },
      { prompt: "Is x=8 a root of (x-8)(x-8)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10190: {
    introduction: "Linear First-Order Equations works this concrete case: Compute this Linear First-Order Equations case with input 2: Solve 4x = 36. Labelled result 9. The labelled answer is 9. Class 12 Differential Equations: Teach Linear First-Order Equations as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Linear First-Order Equations rule with live values. A common labelled error is using a nearby formula that is not the Linear First-Order Equations rule. Linear First-Order Equations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Differential Equations: Teach Linear First-Order Equations as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Linear First-Order Equations rule with live values. Linear First-Order Equations is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Linear First-Order Equations works this concrete case: Compute this Linear First-Order Equations case with input 2: Solve 4x = 36. Labelled result 9.",
    howItWorks: "Read the Linear First-Order Equations inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Linear First-Order Equations works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Linear First-Order Equations case with input 2: Solve 4x = 36. Labelled result 9.", steps: ["Divide by 4.", "x=9.", "9."], answer: "9" },
      { prompt: "Expand 4(x+9).", steps: ["4x+36.", "4x+36.", "4x+36."], answer: "4x+36" },
      { prompt: "Is x=9 a root of (x-9)(x-9)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10191: {
    introduction: "General and Particular Solutions works this concrete case: Compute this General and Particular Solutions case with input 2: Solve 5x = 50. Labelled result 2 → 10. The labelled answer is 10. Class 12 Differential Equations: Teach General and Particular Solutions as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the General and Particular Solutions rule with live values. A common labelled error is using a nearby formula that is not the General and Particular Solutions rule. General and Particular Solutions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Differential Equations: Teach General and Particular Solutions as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the General and Particular Solutions rule with live values. General and Particular Solutions is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "General and Particular Solutions works this concrete case: Compute this General and Particular Solutions case with input 2: Solve 5x = 50. Labelled result 2 → 10.",
    howItWorks: "Read the General and Particular Solutions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "General and Particular Solutions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this General and Particular Solutions case with input 2: Solve 5x = 50. Labelled result 2 → 10.", steps: ["Divide by 5.", "x=10.", "10."], answer: "10" },
      { prompt: "Expand 5(x+10).", steps: ["5x+50.", "5x+50.", "5x+50."], answer: "5x+50" },
      { prompt: "Is x=10 a root of (x-10)(x-10)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10192: {
    introduction: "Direction Fields works this concrete case: Compute this Direction Fields case with input 2: Solve 6x = 18. Labelled result 3. The labelled answer is 3. Class 12 Differential Equations: Teach Direction Fields as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Direction Fields rule with live values. A common labelled error is using a nearby formula that is not the Direction Fields rule. Direction Fields keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Differential Equations: Teach Direction Fields as a Class 12 Differential Equations concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Direction Fields rule with live values. Direction Fields is the Differential Equations rule used to compute one labelled numerical result.",
    basicIdea: "Direction Fields works this concrete case: Compute this Direction Fields case with input 2: Solve 6x = 18. Labelled result 3.",
    howItWorks: "Read the Direction Fields inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Direction Fields works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Direction Fields case with input 2: Solve 6x = 18. Labelled result 3.", steps: ["Divide by 6.", "x=3.", "3."], answer: "3" },
      { prompt: "Expand 6(x+4).", steps: ["6x+24.", "6x+24.", "6x+24."], answer: "6x+24" },
      { prompt: "Is x=3 a root of (x-3)(x-4)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10193: {
    introduction: "Minors and Cofactors works this concrete case: Find det([[4,7],[0,5]]). The labelled answer is 20. Class 12 Matrices and Determinants: Teach Minors and Cofactors as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Minors and Cofactors rule with live values. A common labelled error is using a nearby formula that is not the Minors and Cofactors rule. Minors and Cofactors keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Matrices and Determinants: Teach Minors and Cofactors as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Minors and Cofactors rule with live values. Minors and Cofactors is the Matrices and Determinants rule used to compute one labelled numerical result.",
    basicIdea: "Minors and Cofactors works this concrete case: Find det([[4,7],[0,5]]).",
    howItWorks: "Read the Minors and Cofactors inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Minors and Cofactors works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find det([[4,7],[0,5]]).", steps: ["4*5-7*0.", "20.", "20."], answer: "20" },
      { prompt: "Compute this Minors and Cofactors case with input 2: What is the size of a 7 by 5 product if inner sizes match? Labelled result 7 by 5.", steps: ["Rows from the first matrix.", "Columns from the second.", "7 by 5."], answer: "7 by 5" },
      { prompt: "Can you add a 2×3 matrix to a 3×2 matrix?", steps: ["Addition needs the same shape.", "2×3 ≠ 3×2.", "No."], answer: "no" }
    ],
  },
  10194: {
    introduction: "Adjoint of a Matrix works this concrete case: Find det([[5,2],[0,6]]). The labelled answer is 30. Class 12 Matrices and Determinants: Teach Adjoint of a Matrix as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Adjoint of a Matrix rule with live values. A common labelled error is using a nearby formula that is not the Adjoint of a Matrix rule. Adjoint of a Matrix keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Matrices and Determinants: Teach Adjoint of a Matrix as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Adjoint of a Matrix rule with live values. Adjoint of a Matrix is the Matrices and Determinants rule used to compute one labelled numerical result.",
    basicIdea: "Adjoint of a Matrix works this concrete case: Find det([[5,2],[0,6]]).",
    howItWorks: "Read the Adjoint of a Matrix inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Adjoint of a Matrix works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find det([[5,2],[0,6]]).", steps: ["5*6-2*0.", "30.", "30."], answer: "30" },
      { prompt: "Compute this Adjoint of a Matrix case with input 2: What is the size of a 2 by 6 product if inner sizes match? Labelled result 2 by 6.", steps: ["Rows from the first matrix.", "Columns from the second.", "2 by 6."], answer: "2 by 6" },
      { prompt: "Can you add a 2×3 matrix to a 3×2 matrix?", steps: ["Addition needs the same shape.", "2×3 ≠ 3×2.", "No."], answer: "no" }
    ],
  },
  10195: {
    introduction: "Inverse by Adjoint works this concrete case: Find det([[6,3],[0,7]]). The labelled answer is 42. Class 12 Matrices and Determinants: Teach Inverse by Adjoint as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Inverse by Adjoint rule with live values. A common labelled error is using a nearby formula that is not the Inverse by Adjoint rule. Inverse by Adjoint keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Matrices and Determinants: Teach Inverse by Adjoint as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Inverse by Adjoint rule with live values. Inverse by Adjoint is the Matrices and Determinants rule used to compute one labelled numerical result.",
    basicIdea: "Inverse by Adjoint works this concrete case: Find det([[6,3],[0,7]]).",
    howItWorks: "Read the Inverse by Adjoint inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Inverse by Adjoint works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find det([[6,3],[0,7]]).", steps: ["6*7-3*0.", "42.", "42."], answer: "42" },
      { prompt: "Compute this Inverse by Adjoint case with input 2: What is the size of a 3 by 7 product if inner sizes match? Labelled result 3 by 7.", steps: ["Rows from the first matrix.", "Columns from the second.", "3 by 7."], answer: "3 by 7" },
      { prompt: "Can you add a 2×3 matrix to a 3×2 matrix?", steps: ["Addition needs the same shape.", "2×3 ≠ 3×2.", "No."], answer: "no" }
    ],
  },
  10196: {
    introduction: "Determinants and Geometric Area works this concrete case: Find the labelled determinants and geometric area for base 7 and height 4. The labelled answer is 28. Class 12 Matrices and Determinants: Teach Determinants and Geometric Area as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Determinants and Geometric Area rule with live values. A common labelled error is using a nearby formula that is not the Determinants and Geometric Area rule. Determinants and Geometric Area keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Matrices and Determinants: Teach Determinants and Geometric Area as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Determinants and Geometric Area rule with live values. Determinants and Geometric Area is the Matrices and Determinants rule used to compute one labelled numerical result.",
    basicIdea: "Determinants and Geometric Area works this concrete case: Find the labelled determinants and geometric area for base 7 and height 4.",
    howItWorks: "Read the Determinants and Geometric Area inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Determinants and Geometric Area works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find the labelled determinants and geometric area for base 7 and height 4.", steps: ["Use the Determinants and Geometric Area formula.", "7 and 4 are the measured sides.", "The value is 28."], answer: "28" },
      { prompt: "If the height doubles from 4 to 8, what happens to this area model?", steps: ["Area scales with perpendicular height.", "New height 8.", "It doubles."], answer: "doubles" },
      { prompt: "Is perimeter 7+4 the same as determinants and geometric area?", steps: ["Perimeter is boundary length.", "Area is interior measure.", "No."], answer: "no" }
    ],
  },
  10197: {
    introduction: "Solving Linear Equations by Matrices works this concrete case: Find det([[8,5],[0,9]]). The labelled answer is 72. Class 12 Matrices and Determinants: Teach Solving Linear Equations by Matrices as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Solving Linear Equations by Matrices rule with live values. A common labelled error is using a nearby formula that is not the Solving Linear Equations by Matrices rule. Solving Linear Equations by Matrices keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Matrices and Determinants: Teach Solving Linear Equations by Matrices as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Solving Linear Equations by Matrices rule with live values. Solving Linear Equations by Matrices is the Matrices and Determinants rule used to compute one labelled numerical result.",
    basicIdea: "Solving Linear Equations by Matrices works this concrete case: Find det([[8,5],[0,9]]).",
    howItWorks: "Read the Solving Linear Equations by Matrices inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Solving Linear Equations by Matrices works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find det([[8,5],[0,9]]).", steps: ["8*9-5*0.", "72.", "72."], answer: "72" },
      { prompt: "Compute this Solving Linear Equations by Matrices case with input 2: What is the size of a 5 by 9 product if inner sizes match? Labelled result 5 by 9.", steps: ["Rows from the first matrix.", "Columns from the second.", "5 by 9."], answer: "5 by 9" },
      { prompt: "Can you add a 2×3 matrix to a 3×2 matrix?", steps: ["Addition needs the same shape.", "2×3 ≠ 3×2.", "No."], answer: "no" }
    ],
  },
  10198: {
    introduction: "Cramer's Rule works this concrete case: Find det([[9,6],[0,10]]). The labelled answer is 90. Class 12 Matrices and Determinants: Teach Cramer's Rule as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Cramer's Rule rule with live values. A common labelled error is using a nearby formula that is not the Cramer's Rule rule. Cramer's Rule keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Matrices and Determinants: Teach Cramer's Rule as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Cramer's Rule rule with live values. Cramer's Rule is the Matrices and Determinants rule used to compute one labelled numerical result.",
    basicIdea: "Cramer's Rule works this concrete case: Find det([[9,6],[0,10]]).",
    howItWorks: "Read the Cramer's Rule inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Cramer's Rule works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find det([[9,6],[0,10]]).", steps: ["9*10-6*0.", "90.", "90."], answer: "90" },
      { prompt: "Compute this Cramer's Rule case with input 2: What is the size of a 6 by 10 product if inner sizes match? Labelled result 6 by 10.", steps: ["Rows from the first matrix.", "Columns from the second.", "6 by 10."], answer: "6 by 10" },
      { prompt: "Can you add a 2×3 matrix to a 3×2 matrix?", steps: ["Addition needs the same shape.", "2×3 ≠ 3×2.", "No."], answer: "no" }
    ],
  },
  10199: {
    introduction: "Consistency of Linear Systems works this concrete case: Find det([[10,7],[0,4]]). The labelled answer is 40. Class 12 Matrices and Determinants: Teach Consistency of Linear Systems as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Consistency of Linear Systems rule with live values. A common labelled error is using a nearby formula that is not the Consistency of Linear Systems rule. Consistency of Linear Systems keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Matrices and Determinants: Teach Consistency of Linear Systems as a Class 12 Matrices and Determinants concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Consistency of Linear Systems rule with live values. Consistency of Linear Systems is the Matrices and Determinants rule used to compute one labelled numerical result.",
    basicIdea: "Consistency of Linear Systems works this concrete case: Find det([[10,7],[0,4]]).",
    howItWorks: "Read the Consistency of Linear Systems inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Consistency of Linear Systems works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find det([[10,7],[0,4]]).", steps: ["10*4-7*0.", "40.", "40."], answer: "40" },
      { prompt: "Compute this Consistency of Linear Systems case with input 2: What is the size of a 7 by 4 product if inner sizes match? Labelled result 7 by 4.", steps: ["Rows from the first matrix.", "Columns from the second.", "7 by 4."], answer: "7 by 4" },
      { prompt: "Can you add a 2×3 matrix to a 3×2 matrix?", steps: ["Addition needs the same shape.", "2×3 ≠ 3×2.", "No."], answer: "no" }
    ],
  },
  10200: {
    introduction: "Formulating Linear Programming Problems works this concrete case: A feasible polygon has corner values 3, 5, 7. If we maximise, which is largest? The labelled answer is 7. Class 12 Linear Programming: Teach Formulating Linear Programming Problems as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Formulating Linear Programming Problems rule with live values. A common labelled error is using a nearby formula that is not the Formulating Linear Programming Problems rule. Formulating Linear Programming Problems keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Linear Programming: Teach Formulating Linear Programming Problems as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Formulating Linear Programming Problems rule with live values. Formulating Linear Programming Problems is the Linear Programming rule used to compute one labelled numerical result.",
    basicIdea: "Formulating Linear Programming Problems works this concrete case: A feasible polygon has corner values 3, 5, 7. If we maximise, which is largest?",
    howItWorks: "Read the Formulating Linear Programming Problems inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Formulating Linear Programming Problems works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A feasible polygon has corner values 3, 5, 7. If we maximise, which is largest?", steps: ["Compare 3, 5, 7.", "7.", "7."], answer: "7" },
      { prompt: "Compute this Formulating Linear Programming Problems case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", steps: ["The extreme-value theorem for LPP uses corners.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Formulating Linear Programming Problems case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", steps: ["No feasible point exists.", "No.", "No."], answer: "no" }
    ],
  },
  10201: {
    introduction: "Feasible Region works this concrete case: A feasible polygon has corner values 4, 7, 10. If we maximise, which is largest? The labelled answer is 10. Class 12 Linear Programming: Teach Feasible Region as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Feasible Region rule with live values. A common labelled error is using a nearby formula that is not the Feasible Region rule. Feasible Region keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Linear Programming: Teach Feasible Region as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Feasible Region rule with live values. Feasible Region is the Linear Programming rule used to compute one labelled numerical result.",
    basicIdea: "Feasible Region works this concrete case: A feasible polygon has corner values 4, 7, 10. If we maximise, which is largest?",
    howItWorks: "Read the Feasible Region inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Feasible Region works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A feasible polygon has corner values 4, 7, 10. If we maximise, which is largest?", steps: ["Compare 4, 7, 10.", "10.", "10."], answer: "10" },
      { prompt: "Compute this Feasible Region case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", steps: ["The extreme-value theorem for LPP uses corners.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Feasible Region case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", steps: ["No feasible point exists.", "No.", "No."], answer: "no" }
    ],
  },
  10202: {
    introduction: "Corner-Point Method works this concrete case: A feasible polygon has corner values 5, 9, 13. If we maximise, which is largest? The labelled answer is 13. Class 12 Linear Programming: Teach Corner-Point Method as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Corner-Point Method rule with live values. A common labelled error is using a nearby formula that is not the Corner-Point Method rule. Corner-Point Method keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Linear Programming: Teach Corner-Point Method as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Corner-Point Method rule with live values. Corner-Point Method is the Linear Programming rule used to compute one labelled numerical result.",
    basicIdea: "Corner-Point Method works this concrete case: A feasible polygon has corner values 5, 9, 13. If we maximise, which is largest?",
    howItWorks: "Read the Corner-Point Method inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Corner-Point Method works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A feasible polygon has corner values 5, 9, 13. If we maximise, which is largest?", steps: ["Compare 5, 9, 13.", "13.", "13."], answer: "13" },
      { prompt: "Compute this Corner-Point Method case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", steps: ["The extreme-value theorem for LPP uses corners.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Corner-Point Method case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", steps: ["No feasible point exists.", "No.", "No."], answer: "no" }
    ],
  },
  10203: {
    introduction: "Bounded Feasible Region works this concrete case: A feasible polygon has corner values 6, 11, 16. If we maximise, which is largest? The labelled answer is 16. Class 12 Linear Programming: Teach Bounded Feasible Region as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Bounded Feasible Region rule with live values. A common labelled error is using a nearby formula that is not the Bounded Feasible Region rule. Bounded Feasible Region keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Linear Programming: Teach Bounded Feasible Region as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Bounded Feasible Region rule with live values. Bounded Feasible Region is the Linear Programming rule used to compute one labelled numerical result.",
    basicIdea: "Bounded Feasible Region works this concrete case: A feasible polygon has corner values 6, 11, 16. If we maximise, which is largest?",
    howItWorks: "Read the Bounded Feasible Region inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Bounded Feasible Region works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A feasible polygon has corner values 6, 11, 16. If we maximise, which is largest?", steps: ["Compare 6, 11, 16.", "16.", "16."], answer: "16" },
      { prompt: "Compute this Bounded Feasible Region case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", steps: ["The extreme-value theorem for LPP uses corners.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Bounded Feasible Region case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", steps: ["No feasible point exists.", "No.", "No."], answer: "no" }
    ],
  },
  10204: {
    introduction: "Unbounded Feasible Region works this concrete case: A feasible polygon has corner values 7, 13, 19. If we maximise, which is largest? The labelled answer is 19. Class 12 Linear Programming: Teach Unbounded Feasible Region as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Unbounded Feasible Region rule with live values. A common labelled error is using a nearby formula that is not the Unbounded Feasible Region rule. Unbounded Feasible Region keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Linear Programming: Teach Unbounded Feasible Region as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Unbounded Feasible Region rule with live values. Unbounded Feasible Region is the Linear Programming rule used to compute one labelled numerical result.",
    basicIdea: "Unbounded Feasible Region works this concrete case: A feasible polygon has corner values 7, 13, 19. If we maximise, which is largest?",
    howItWorks: "Read the Unbounded Feasible Region inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Unbounded Feasible Region works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A feasible polygon has corner values 7, 13, 19. If we maximise, which is largest?", steps: ["Compare 7, 13, 19.", "19.", "19."], answer: "19" },
      { prompt: "Compute this Unbounded Feasible Region case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", steps: ["The extreme-value theorem for LPP uses corners.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Unbounded Feasible Region case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", steps: ["No feasible point exists.", "No.", "No."], answer: "no" }
    ],
  },
  10205: {
    introduction: "Multiple Optimal Solutions works this concrete case: A feasible polygon has corner values 8, 15, 22. If we maximise, which is largest? The labelled answer is 22. Class 12 Linear Programming: Teach Multiple Optimal Solutions as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Multiple Optimal Solutions rule with live values. A common labelled error is using a nearby formula that is not the Multiple Optimal Solutions rule. Multiple Optimal Solutions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Linear Programming: Teach Multiple Optimal Solutions as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Multiple Optimal Solutions rule with live values. Multiple Optimal Solutions is the Linear Programming rule used to compute one labelled numerical result.",
    basicIdea: "Multiple Optimal Solutions works this concrete case: A feasible polygon has corner values 8, 15, 22. If we maximise, which is largest?",
    howItWorks: "Read the Multiple Optimal Solutions inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Multiple Optimal Solutions works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A feasible polygon has corner values 8, 15, 22. If we maximise, which is largest?", steps: ["Compare 8, 15, 22.", "22.", "22."], answer: "22" },
      { prompt: "Compute this Multiple Optimal Solutions case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", steps: ["The extreme-value theorem for LPP uses corners.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Multiple Optimal Solutions case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", steps: ["No feasible point exists.", "No.", "No."], answer: "no" }
    ],
  },
  10206: {
    introduction: "Infeasible Problems works this concrete case: A feasible polygon has corner values 9, 11, 13. If we maximise, which is largest? The labelled answer is 13. Class 12 Linear Programming: Teach Infeasible Problems as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Infeasible Problems rule with live values. A common labelled error is using a nearby formula that is not the Infeasible Problems rule. Infeasible Problems keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Linear Programming: Teach Infeasible Problems as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Infeasible Problems rule with live values. Infeasible Problems is the Linear Programming rule used to compute one labelled numerical result.",
    basicIdea: "Infeasible Problems works this concrete case: A feasible polygon has corner values 9, 11, 13. If we maximise, which is largest?",
    howItWorks: "Read the Infeasible Problems inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Infeasible Problems works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A feasible polygon has corner values 9, 11, 13. If we maximise, which is largest?", steps: ["Compare 9, 11, 13.", "13.", "13."], answer: "13" },
      { prompt: "Compute this Infeasible Problems case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", steps: ["The extreme-value theorem for LPP uses corners.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Infeasible Problems case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", steps: ["No feasible point exists.", "No.", "No."], answer: "no" }
    ],
  },
  10207: {
    introduction: "Diet Problem works this concrete case: Compute this Diet Problem case with input 2: A feasible polygon has corner values 10, 13, 16. If we maximise, which is largest? Labelled result 2 → 16. The labelled answer is 16. Class 12 Linear Programming: Teach Diet Problem as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Diet Problem rule with live values. A common labelled error is using a nearby formula that is not the Diet Problem rule. Diet Problem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Linear Programming: Teach Diet Problem as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Diet Problem rule with live values. Diet Problem is the Linear Programming rule used to compute one labelled numerical result.",
    basicIdea: "Diet Problem works this concrete case: Compute this Diet Problem case with input 2: A feasible polygon has corner values 10, 13, 16. If we maximise, which is largest? Labelled result 2 → 16.",
    howItWorks: "Read the Diet Problem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Diet Problem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Compute this Diet Problem case with input 2: A feasible polygon has corner values 10, 13, 16. If we maximise, which is largest? Labelled result 2 → 16.", steps: ["Compare 10, 13, 16.", "16.", "16."], answer: "16" },
      { prompt: "Compute this Diet Problem case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", steps: ["The extreme-value theorem for LPP uses corners.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Diet Problem case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", steps: ["No feasible point exists.", "No.", "No."], answer: "no" }
    ],
  },
  10208: {
    introduction: "Production Planning Problem works this concrete case: A feasible polygon has corner values 3, 7, 11. If we maximise, which is largest? The labelled answer is 11. Class 12 Linear Programming: Teach Production Planning Problem as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Production Planning Problem rule with live values. A common labelled error is using a nearby formula that is not the Production Planning Problem rule. Production Planning Problem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Linear Programming: Teach Production Planning Problem as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Production Planning Problem rule with live values. Production Planning Problem is the Linear Programming rule used to compute one labelled numerical result.",
    basicIdea: "Production Planning Problem works this concrete case: A feasible polygon has corner values 3, 7, 11. If we maximise, which is largest?",
    howItWorks: "Read the Production Planning Problem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Production Planning Problem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A feasible polygon has corner values 3, 7, 11. If we maximise, which is largest?", steps: ["Compare 3, 7, 11.", "11.", "11."], answer: "11" },
      { prompt: "Compute this Production Planning Problem case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", steps: ["The extreme-value theorem for LPP uses corners.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Production Planning Problem case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", steps: ["No feasible point exists.", "No.", "No."], answer: "no" }
    ],
  },
  10209: {
    introduction: "Transportation-Style LPP Introduction works this concrete case: A feasible polygon has corner values 4, 9, 14. If we maximise, which is largest? The labelled answer is 14. Class 12 Linear Programming: Teach Transportation-Style LPP Introduction as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Transportation-Style LPP Introduction rule with live values. A common labelled error is using a nearby formula that is not the Transportation-Style LPP Introduction rule. Transportation-Style LPP Introduction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Linear Programming: Teach Transportation-Style LPP Introduction as a Class 12 Linear Programming concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Transportation-Style LPP Introduction rule with live values. Transportation-Style LPP Introduction is the Linear Programming rule used to compute one labelled numerical result.",
    basicIdea: "Transportation-Style LPP Introduction works this concrete case: A feasible polygon has corner values 4, 9, 14. If we maximise, which is largest?",
    howItWorks: "Read the Transportation-Style LPP Introduction inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Transportation-Style LPP Introduction works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A feasible polygon has corner values 4, 9, 14. If we maximise, which is largest?", steps: ["Compare 4, 9, 14.", "14.", "14."], answer: "14" },
      { prompt: "Compute this Transportation-Style LPP Introduction case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", steps: ["The extreme-value theorem for LPP uses corners.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Compute this Transportation-Style LPP Introduction case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", steps: ["No feasible point exists.", "No.", "No."], answer: "no" }
    ],
  },
  10210: {
    introduction: "Conditional Probability works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Class 12 Probability: Teach Conditional Probability as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Conditional Probability rule with live values. A common labelled error is using a nearby formula that is not the Conditional Probability rule. Conditional Probability keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Conditional Probability as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Conditional Probability rule with live values. Conditional Probability is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Conditional Probability works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "Read the Conditional Probability inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Conditional Probability works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  10211: {
    introduction: "Multiplication Rule works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Class 12 Probability: Teach Multiplication Rule as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Multiplication Rule rule with live values. A common labelled error is using a nearby formula that is not the Multiplication Rule rule. Multiplication Rule keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Multiplication Rule as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Multiplication Rule rule with live values. Multiplication Rule is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Multiplication Rule works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "Read the Multiplication Rule inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Multiplication Rule works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  10212: {
    introduction: "Independent Events works this concrete case: A fair die. P(score ≤ 2)? The labelled answer is 2/6. Class 12 Probability: Teach Independent Events as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Independent Events rule with live values. A common labelled error is using a nearby formula that is not the Independent Events rule. Independent Events keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Independent Events as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Independent Events rule with live values. Independent Events is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Independent Events works this concrete case: A fair die. P(score ≤ 2)?",
    howItWorks: "Read the Independent Events inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Independent Events works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  10213: {
    introduction: "Total Probability Theorem works this concrete case: A fair die. P(score ≤ 3)? The labelled answer is 3/6. Class 12 Probability: Teach Total Probability Theorem as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Total Probability Theorem rule with live values. A common labelled error is using a nearby formula that is not the Total Probability Theorem rule. Total Probability Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Total Probability Theorem as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Total Probability Theorem rule with live values. Total Probability Theorem is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Total Probability Theorem works this concrete case: A fair die. P(score ≤ 3)?",
    howItWorks: "Read the Total Probability Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Total Probability Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  10214: {
    introduction: "Bayes' Theorem works this concrete case: A fair die. P(score ≤ 4)? The labelled answer is 4/6. Class 12 Probability: Teach Bayes' Theorem as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Bayes' Theorem rule with live values. A common labelled error is using a nearby formula that is not the Bayes' Theorem rule. Bayes' Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Bayes' Theorem as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Bayes' Theorem rule with live values. Bayes' Theorem is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Bayes' Theorem works this concrete case: A fair die. P(score ≤ 4)?",
    howItWorks: "Read the Bayes' Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Bayes' Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  10215: {
    introduction: "Random Variables works this concrete case: A fair die. P(score ≤ 5)? The labelled answer is 5/6. Class 12 Probability: Teach Random Variables as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Random Variables rule with live values. A common labelled error is using a nearby formula that is not the Random Variables rule. Random Variables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Random Variables as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Random Variables rule with live values. Random Variables is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Random Variables works this concrete case: A fair die. P(score ≤ 5)?",
    howItWorks: "Read the Random Variables inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Random Variables works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  10216: {
    introduction: "Probability Distribution of a Random Variable works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Class 12 Probability: Teach Probability Distribution of a Random Variable as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Probability Distribution of a Random Variable rule with live values. A common labelled error is using a nearby formula that is not the Probability Distribution of a Random Variable rule. Probability Distribution of a Random Variable keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Probability Distribution of a Random Variable as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Probability Distribution of a Random Variable rule with live values. Probability Distribution of a Random Variable is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Probability Distribution of a Random Variable works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "Read the Probability Distribution of a Random Variable inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Probability Distribution of a Random Variable works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  10217: {
    introduction: "Expected Value works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Class 12 Probability: Teach Expected Value as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Expected Value rule with live values. A common labelled error is using a nearby formula that is not the Expected Value rule. Expected Value keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Expected Value as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Expected Value rule with live values. Expected Value is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Expected Value works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "Read the Expected Value inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Expected Value works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  10218: {
    introduction: "Variance works this concrete case: A fair die. P(score ≤ 2)? The labelled answer is 2/6. Class 12 Probability: Teach Variance as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Variance rule with live values. A common labelled error is using a nearby formula that is not the Variance rule. Variance keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Variance as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Variance rule with live values. Variance is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Variance works this concrete case: A fair die. P(score ≤ 2)?",
    howItWorks: "Read the Variance inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Variance works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  10219: {
    introduction: "Bernoulli Trials works this concrete case: For Bin(6, 1/2), what is the mean np? The labelled answer is 3. Class 12 Probability: Teach Bernoulli Trials as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Bernoulli Trials rule with live values. A common labelled error is using a nearby formula that is not the Bernoulli Trials rule. Bernoulli Trials keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Bernoulli Trials as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Bernoulli Trials rule with live values. Bernoulli Trials is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Bernoulli Trials works this concrete case: For Bin(6, 1/2), what is the mean np?",
    howItWorks: "Read the Bernoulli Trials inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Bernoulli Trials works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For Bin(6, 1/2), what is the mean np?", steps: ["np=6*(1/2).", "3.", "3."], answer: "3" },
      { prompt: "C(5,2) for a binomial coefficient in P(X=2) is what?", steps: ["C(5,2)=10.", "10.", "10."], answer: "10" },
      { prompt: "Compute this Bernoulli Trials case with input 2: If trials are dependent, does the binomial PMF still apply automatically? Labelled result 2 → no.", steps: ["Independence is an assumption.", "No.", "No."], answer: "no" }
    ],
  },
  10220: {
    introduction: "Binomial Distribution works this concrete case: For Bin(7, 1/2), what is the mean np? The labelled answer is 3.5. Class 12 Probability: Teach Binomial Distribution as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Binomial Distribution rule with live values. A common labelled error is using a nearby formula that is not the Binomial Distribution rule. Binomial Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 12 Probability: Teach Binomial Distribution as a Class 12 Probability concept with syllabus-aligned exploration, practice, and assessment. The interaction shows the Binomial Distribution rule with live values. Binomial Distribution is the Probability rule used to compute one labelled numerical result.",
    basicIdea: "Binomial Distribution works this concrete case: For Bin(7, 1/2), what is the mean np?",
    howItWorks: "Read the Binomial Distribution inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Binomial Distribution works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "For Bin(7, 1/2), what is the mean np?", steps: ["np=7*(1/2).", "3.5.", "3.5."], answer: "3.5" },
      { prompt: "C(5,2) for a binomial coefficient in P(X=2) is what?", steps: ["C(5,2)=10.", "10.", "10."], answer: "10" },
      { prompt: "Compute this Binomial Distribution case with input 2: If trials are dependent, does the binomial PMF still apply automatically? Labelled result 2 → no.", steps: ["Independence is an assumption.", "No.", "No."], answer: "no" }
    ],
  }
};

export function applyBatch6HandOverlay(lesson: StrengthenedLesson): StrengthenedLesson {
  const overlay = overlays[Number(lesson.id)];
  if (!overlay) return lesson;
  const workedExamples: WorkedExample[] = [
    ...overlay.worked.map((example, index) => ({
      id: `${lesson.id}-batch6-worked-${index + 1}`,
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
      { id: `${lesson.id}-batch6-definition`, statement: overlay.definition },
      ...lesson.definitions,
    ],
    workedExamples,
  };
}

export const batch6HandAuthoredLessonIds = Object.keys(overlays).map(Number).sort((left, right) => left - right);

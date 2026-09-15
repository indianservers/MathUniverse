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
  531: {
    introduction: "F Distribution works this concrete case: F distributions need how many degrees-of-freedom values? The labelled answer is two. Compare variances. Adjusts numerator and denominator degrees of freedom. A common labelled error is using only one degrees-of-freedom value. F Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In F Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "F Distribution works this concrete case: F distributions need how many degrees-of-freedom values?",
    howItWorks: "concept",
    whyItWorks: "The F distribution is a right-skewed distribution used for ratios of variance estimates.",
    worked: [
      { prompt: "F distributions need how many degrees-of-freedom values?", steps: ["concept", "Read the labelled result.", "two"], answer: "two" },
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" }
    ],
  },
  532: {
    introduction: "Exponential Distribution works this concrete case: Exponential distribution models count or waiting time? The labelled answer is waiting time. Model waiting times. Adjusts rate or scale. A common labelled error is using exponential distribution for counts instead of waiting times. Exponential Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Exponential Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Exponential Distribution works this concrete case: Exponential distribution models count or waiting time?",
    howItWorks: "concept",
    whyItWorks: "The exponential distribution models waiting time until the next event in a Poisson process.",
    worked: [
      { prompt: "Exponential distribution models count or waiting time?", steps: ["concept", "Read the labelled result.", "waiting time"], answer: "waiting time" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=6/10, what is P(A')?", steps: ["1-6/10.", "4/10.", "4/10."], answer: "4/10" }
    ],
  },
  533: {
    introduction: "Gamma Distribution works this concrete case: Gamma generalises exponential to several what? The labelled answer is events. Model positive waiting times. Adjusts shape and scale. A common labelled error is using gamma but thinking it only waits for one event. Gamma Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Gamma Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Gamma Distribution works this concrete case: Gamma generalises exponential to several what?",
    howItWorks: "concept",
    whyItWorks: "The gamma distribution models waiting time until several events occur in a Poisson process.",
    worked: [
      { prompt: "Gamma generalises exponential to several what?", steps: ["concept", "Read the labelled result.", "events"], answer: "events" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" }
    ],
  },
  534: {
    introduction: "Weibull Distribution works this concrete case: Which parameter controls Weibull risk shape? The labelled answer is shape. Model reliability. Adjusts shape and scale. A common labelled error is assuming failure risk must stay constant. Weibull Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Weibull Distribution, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Weibull Distribution works this concrete case: Which parameter controls Weibull risk shape?",
    howItWorks: "concept",
    whyItWorks: "The Weibull distribution models lifetimes where failure risk can increase, decrease, or stay constant.",
    worked: [
      { prompt: "Which parameter controls Weibull risk shape?", steps: ["concept", "Read the labelled result.", "shape"], answer: "shape" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  535: {
    introduction: "Standardisation works this concrete case: A fair die. P(score ≤ 3)? The labelled answer is 3/6. Convert to standard normal units. Transforms x-values into z-scores. A common labelled error is subtracting the mean but not dividing by standard deviation. Standardisation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Standardisation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Standardisation works this concrete case: A fair die. P(score ≤ 3)?",
    howItWorks: "procedure",
    whyItWorks: "Standardisation changes a value into a z-score by measuring distance from the mean in standard deviations.",
    worked: [
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  536: {
    introduction: "Distribution Simulation works this concrete case: Is one simulation exactly the same as the theoretical model? The labelled answer is no. Compare theoretical and empirical behaviour. Generates samples and overlays histograms. A common labelled error is thinking one simulation is the exact distribution. Distribution Simulation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Probability and Distributions In Distribution Simulation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Distribution Simulation works this concrete case: Is one simulation exactly the same as the theoretical model?",
    howItWorks: "tool",
    whyItWorks: "Distribution simulation generates random values from a chosen probability distribution.",
    worked: [
      { prompt: "Is one simulation exactly the same as the theoretical model?", steps: ["tool", "Read the labelled result.", "no"], answer: "no" },
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" }
    ],
  },
  537: {
    introduction: "Sampling Distributions works this concrete case: Sampling distributions describe sample statistics or raw values? The labelled answer is statistics. Understand sample variability. Generates repeated samples and plots statistics. A common labelled error is confusing the raw data distribution with the sampling distribution. Sampling Distributions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Sampling Distributions, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Sampling Distributions works this concrete case: Sampling distributions describe sample statistics or raw values?",
    howItWorks: "concept",
    whyItWorks: "A sampling distribution is the distribution of a statistic over many possible samples.",
    worked: [
      { prompt: "Sampling distributions describe sample statistics or raw values?", steps: ["concept", "Read the labelled result.", "statistics"], answer: "statistics" },
      { prompt: "Sample n=40. SE of the mean if σ=5 is σ/√n. Find SE.", steps: ["√n=√40.", "5/√40.", "5/√40."], answer: "5/√40" },
      { prompt: "Does the CLT say every sample is normal?", steps: ["It describes the sampling distribution of the mean.", "Individual samples can be skewed.", "No."], answer: "no" }
    ],
  },
  538: {
    introduction: "Central Limit Theorem works this concrete case: The central limit theorem is mainly about sample what? The labelled answer is means. Observe normal approximation. Changes sample size and source distribution. A common labelled error is thinking the raw data must be normal. Central Limit Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Central Limit Theorem, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Central Limit Theorem works this concrete case: The central limit theorem is mainly about sample what?",
    howItWorks: "concept",
    whyItWorks: "The central limit theorem says sample means tend to be approximately normal for large samples under suitable conditions.",
    worked: [
      { prompt: "The central limit theorem is mainly about sample what?", steps: ["concept", "Read the labelled result.", "means"], answer: "means" },
      { prompt: "Sample n=50. SE of the mean if σ=6 is σ/√n. Find SE.", steps: ["√n=√50.", "6/√50.", "6/√50."], answer: "6/√50" },
      { prompt: "Does the CLT say every sample is normal?", steps: ["It describes the sampling distribution of the mean.", "Individual samples can be skewed.", "No."], answer: "no" }
    ],
  },
  539: {
    introduction: "Confidence Interval for Mean works this concrete case: A confidence interval estimates a population what? The labelled answer is mean. Estimate a population mean. Calculates and visualises interval coverage. A common labelled error is saying there is a fixed probability the true mean is inside after data are observed. Confidence Interval for Mean keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Confidence Interval for Mean, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Confidence Interval for Mean works this concrete case: A confidence interval estimates a population what?",
    howItWorks: "procedure",
    whyItWorks: "A confidence interval for a mean estimates a population mean with a margin of error.",
    worked: [
      { prompt: "A confidence interval estimates a population what?", steps: ["procedure", "Read the labelled result.", "mean"], answer: "mean" },
      { prompt: "A 95% CI is 6 ± 7. What is the upper bound?", steps: ["6+7.", "13.", "13."], answer: "13" },
      { prompt: "If SE=7 and z*=2, what is the margin of error?", steps: ["ME=z*×SE.", "2*7=14.", "14."], answer: "14" }
    ],
  },
  540: {
    introduction: "Confidence Interval for Proportion works this concrete case: p-hat equals successes divided by what? The labelled answer is sample size. Estimate a population proportion. Builds intervals from count data. A common labelled error is using the success count without dividing by sample size. Confidence Interval for Proportion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Confidence Interval for Proportion, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Confidence Interval for Proportion works this concrete case: p-hat equals successes divided by what?",
    howItWorks: "procedure",
    whyItWorks: "A confidence interval for a proportion estimates a population fraction or percent.",
    worked: [
      { prompt: "p-hat equals successes divided by what?", steps: ["procedure", "Read the labelled result.", "sample size"], answer: "sample size" },
      { prompt: "A 95% CI is 7 ± 2. What is the upper bound?", steps: ["7+2.", "9.", "9."], answer: "9" },
      { prompt: "If SE=2 and z*=2, what is the margin of error?", steps: ["ME=z*×SE.", "2*2=4.", "4."], answer: "4" }
    ],
  },
  541: {
    introduction: "Difference of Means Interval works this concrete case: This interval estimates a difference between two population what? The labelled answer is means. Compare populations. Calculates independent or paired intervals. A common labelled error is using a two-sample interval for naturally paired data. Difference of Means Interval keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Difference of Means Interval, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Difference of Means Interval works this concrete case: This interval estimates a difference between two population what?",
    howItWorks: "procedure",
    whyItWorks: "A difference of means interval estimates the difference between two population means.",
    worked: [
      { prompt: "This interval estimates a difference between two population what?", steps: ["procedure", "Read the labelled result.", "means"], answer: "means" },
      { prompt: "Find the mean of 8, 3, 6, 9.", steps: ["Sum=26.", "Count=4.", "6.5."], answer: "6.5" },
      { prompt: "If one value increases by 3, how does the mean change?", steps: ["The total rises by 3.", "Mean rises by 3/4.", "0.75."], answer: "0.75" }
    ],
  },
  542: {
    introduction: "Difference of Proportions Interval works this concrete case: This interval compares two population what? The labelled answer is proportions. Compare categorical rates. Calculates intervals from two samples. A common labelled error is pooling proportions for a confidence interval without reason. Difference of Proportions Interval keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Difference of Proportions Interval, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Difference of Proportions Interval works this concrete case: This interval compares two population what?",
    howItWorks: "procedure",
    whyItWorks: "A difference of proportions interval estimates the difference between two population proportions.",
    worked: [
      { prompt: "This interval compares two population what?", steps: ["procedure", "Read the labelled result.", "proportions"], answer: "proportions" },
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" }
    ],
  },
  543: {
    introduction: "One-Sample z-Test works this concrete case: A z-test compares the statistic with which standard distribution? The labelled answer is normal. Test a mean with known sigma. Displays statistic, p-value and rejection region. A common labelled error is using a z-test without checking conditions. One-Sample z-Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In One-Sample z-Test, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "One-Sample z-Test works this concrete case: A z-test compares the statistic with which standard distribution?",
    howItWorks: "procedure",
    whyItWorks: "A one-sample z-test tests a population mean or proportion using a standard normal reference when z conditions are met.",
    worked: [
      { prompt: "A z-test compares the statistic with which standard distribution?", steps: ["procedure", "Read the labelled result.", "normal"], answer: "normal" },
      { prompt: "If z=10 and the critical value is 5, is |z| past the cutoff?", steps: ["|10|=10.", "Compare with 5.", "yes"], answer: "yes" },
      { prompt: "df=8. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" }
    ],
  },
  544: {
    introduction: "One-Sample t-Test works this concrete case: A one-sample t-test uses sample standard what? The labelled answer is deviation. Test a mean with estimated sigma. Adjusts sample information and degrees of freedom. A common labelled error is pretending population standard deviation is known when it is not. One-Sample t-Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In One-Sample t-Test, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "One-Sample t-Test works this concrete case: A one-sample t-test uses sample standard what?",
    howItWorks: "procedure",
    whyItWorks: "A one-sample t-test tests a population mean when population standard deviation is unknown.",
    worked: [
      { prompt: "A one-sample t-test uses sample standard what?", steps: ["procedure", "Read the labelled result.", "deviation"], answer: "deviation" },
      { prompt: "If z=3 and the critical value is 6, is |z| past the cutoff?", steps: ["|3|=3.", "Compare with 6.", "no"], answer: "no" },
      { prompt: "df=9. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" }
    ],
  },
  545: {
    introduction: "Two-Sample t-Test works this concrete case: Two-sample t-tests need independent samples or paired samples? The labelled answer is independent. Compare independent means. Supports equal or unequal variance assumptions. A common labelled error is using a two-sample t-test for matched before-and-after data. Two-Sample t-Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Two-Sample t-Test, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Two-Sample t-Test works this concrete case: Two-sample t-tests need independent samples or paired samples?",
    howItWorks: "procedure",
    whyItWorks: "A two-sample t-test compares two population means using two independent samples.",
    worked: [
      { prompt: "Two-sample t-tests need independent samples or paired samples?", steps: ["procedure", "Read the labelled result.", "independent"], answer: "independent" },
      { prompt: "If z=4 and the critical value is 7, is |z| past the cutoff?", steps: ["|4|=4.", "Compare with 7.", "no"], answer: "no" },
      { prompt: "df=10. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" }
    ],
  },
  546: {
    introduction: "Paired t-Test works this concrete case: A paired t-test first computes within-pair what? The labelled answer is differences. Compare matched observations. Uses difference scores. A common labelled error is testing two paired columns as if they are independent. Paired t-Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Paired t-Test, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Paired t-Test works this concrete case: A paired t-test first computes within-pair what?",
    howItWorks: "procedure",
    whyItWorks: "A paired t-test tests the mean of differences from matched pairs.",
    worked: [
      { prompt: "A paired t-test first computes within-pair what?", steps: ["procedure", "Read the labelled result.", "differences"], answer: "differences" },
      { prompt: "If z=5 and the critical value is 2, is |z| past the cutoff?", steps: ["|5|=5.", "Compare with 2.", "yes"], answer: "yes" },
      { prompt: "df=4. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" }
    ],
  },
  547: {
    introduction: "One-Proportion Test works this concrete case: A one-proportion test checks one population what? The labelled answer is proportion. Test a population proportion. Displays exact or normal-approximation results. A common labelled error is using p-hat instead of the null proportion in the test standard error. One-Proportion Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In One-Proportion Test, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "One-Proportion Test works this concrete case: A one-proportion test checks one population what?",
    howItWorks: "procedure",
    whyItWorks: "A one-proportion test checks a claim about one population proportion.",
    worked: [
      { prompt: "A one-proportion test checks one population what?", steps: ["procedure", "Read the labelled result.", "proportion"], answer: "proportion" },
      { prompt: "If z=6 and the critical value is 3, is |z| past the cutoff?", steps: ["|6|=6.", "Compare with 3.", "yes"], answer: "yes" },
      { prompt: "df=5. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" }
    ],
  },
  548: {
    introduction: "Two-Proportion Test works this concrete case: For an equality test, two-proportion z-tests use a pooled what? The labelled answer is proportion. Compare two proportions. Displays pooled test statistics. A common labelled error is not pooling proportions for an equality test. Two-Proportion Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Two-Proportion Test, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Two-Proportion Test works this concrete case: For an equality test, two-proportion z-tests use a pooled what?",
    howItWorks: "procedure",
    whyItWorks: "A two-proportion test checks whether two population proportions differ.",
    worked: [
      { prompt: "For an equality test, two-proportion z-tests use a pooled what?", steps: ["procedure", "Read the labelled result.", "proportion"], answer: "proportion" },
      { prompt: "If z=7 and the critical value is 4, is |z| past the cutoff?", steps: ["|7|=7.", "Compare with 4.", "yes"], answer: "yes" },
      { prompt: "df=6. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" }
    ],
  },
  549: {
    introduction: "Chi-Square Goodness-of-Fit works this concrete case: Goodness-of-fit compares observed and expected what? The labelled answer is counts. Compare observed and expected counts. Calculates contributions by category. A common labelled error is using percentages without expected counts. Chi-Square Goodness-of-Fit keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Chi-Square Goodness-of-Fit, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Chi-Square Goodness-of-Fit works this concrete case: Goodness-of-fit compares observed and expected what?",
    howItWorks: "procedure",
    whyItWorks: "A chi-square goodness-of-fit test checks whether observed category counts match expected counts.",
    worked: [
      { prompt: "Goodness-of-fit compares observed and expected what?", steps: ["procedure", "Read the labelled result.", "counts"], answer: "counts" },
      { prompt: "If z=8 and the critical value is 5, is |z| past the cutoff?", steps: ["|8|=8.", "Compare with 5.", "yes"], answer: "yes" },
      { prompt: "df=7. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" }
    ],
  },
  550: {
    introduction: "Chi-Square Independence works this concrete case: Chi-square independence uses a two-way what? The labelled answer is table. Test categorical association. Uses contingency tables and expected counts. A common labelled error is treating association as proof of cause. Chi-Square Independence keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Chi-Square Independence, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Chi-Square Independence works this concrete case: Chi-square independence uses a two-way what?",
    howItWorks: "procedure",
    whyItWorks: "A chi-square independence test checks whether two categorical variables are associated.",
    worked: [
      { prompt: "Chi-square independence uses a two-way what?", steps: ["procedure", "Read the labelled result.", "table"], answer: "table" },
      { prompt: "If z=9 and the critical value is 6, is |z| past the cutoff?", steps: ["|9|=9.", "Compare with 6.", "yes"], answer: "yes" },
      { prompt: "df=8. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" }
    ],
  },
  551: {
    introduction: "Variance Tests works this concrete case: Variance tests are sensitive to spread and what? The labelled answer is outliers. Test population spread. Uses chi-square or F procedures. A common labelled error is using variance tests without checking strong assumptions. Variance Tests keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In Variance Tests, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Variance Tests works this concrete case: Variance tests are sensitive to spread and what?",
    howItWorks: "procedure",
    whyItWorks: "Variance tests check claims about population variance or compare variances between groups.",
    worked: [
      { prompt: "Variance tests are sensitive to spread and what?", steps: ["procedure", "Read the labelled result.", "outliers"], answer: "outliers" },
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" }
    ],
  },
  552: {
    introduction: "ANOVA works this concrete case: ANOVA compares several population what? The labelled answer is means. Compare three or more means. Displays between- and within-group variation. A common labelled error is doing many pairwise tests instead of one overall ANOVA first. ANOVA keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inferential Statistics In ANOVA, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "ANOVA works this concrete case: ANOVA compares several population what?",
    howItWorks: "procedure",
    whyItWorks: "ANOVA tests whether several population means are equal by comparing between-group and within-group variation.",
    worked: [
      { prompt: "ANOVA compares several population what?", steps: ["procedure", "Read the labelled result.", "means"], answer: "means" },
      { prompt: "A fair die. P(score ≤ 2)?", steps: ["Favourable faces: 2.", "2/6.", "2/6."], answer: "2/6" },
      { prompt: "If P(A)=2/10, what is P(A')?", steps: ["1-2/10.", "8/10.", "8/10."], answer: "8/10" }
    ],
  },
  553: {
    introduction: "p-Value Visualiser works this concrete case: Does a p-value give the probability the null is true? The labelled answer is no. Understand tail probability. Shades p-value regions under the null distribution. A common labelled error is saying the p-value is the probability the null hypothesis is true. p-Value Visualiser keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Data and Probability In p-Value Visualiser, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "p-Value Visualiser works this concrete case: Does a p-value give the probability the null is true?",
    howItWorks: "Inferential Statistics",
    whyItWorks: "visual_exploration",
    worked: [
      { prompt: "Does a p-value give the probability the null is true?", steps: ["Inferential Statistics", "Read the labelled result.", "no"], answer: "no" },
      { prompt: "A fair die. P(score ≤ 3)?", steps: ["Favourable faces: 3.", "3/6.", "3/6."], answer: "3/6" },
      { prompt: "If P(A)=3/10, what is P(A')?", steps: ["1-3/10.", "7/10.", "7/10."], answer: "7/10" }
    ],
  },
  554: {
    introduction: "Type I and Type II Errors works this concrete case: Which error is a false alarm: Type I or Type II? The labelled answer is Type I. Understand decision risks. Shows overlapping null and alternative distributions. A common labelled error is swapping Type I and Type II errors. Type I and Type II Errors keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Data and Probability In Type I and Type II Errors, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Type I and Type II Errors works this concrete case: Which error is a false alarm: Type I or Type II?",
    howItWorks: "Inferential Statistics",
    whyItWorks: "concept",
    worked: [
      { prompt: "Which error is a false alarm: Type I or Type II?", steps: ["Inferential Statistics", "Read the labelled result.", "Type I"], answer: "Type I" },
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" }
    ],
  },
  555: {
    introduction: "Power of a Test works this concrete case: Power equals 1 minus which error probability? The labelled answer is Type II. Explore detection capability. Changes sample size, effect and significance level. A common labelled error is confusing power with the significance level alpha. Power of a Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Data and Probability In Power of a Test, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Power of a Test works this concrete case: Power equals 1 minus which error probability?",
    howItWorks: "Inferential Statistics",
    whyItWorks: "concept",
    worked: [
      { prompt: "Power equals 1 minus which error probability?", steps: ["Inferential Statistics", "Read the labelled result.", "Type II"], answer: "Type II" },
      { prompt: "A fair die. P(score ≤ 5)?", steps: ["Favourable faces: 5.", "5/6.", "5/6."], answer: "5/6" },
      { prompt: "If P(A)=5/10, what is P(A')?", steps: ["1-5/10.", "5/10.", "5/10."], answer: "5/10" }
    ],
  },
  556: {
    introduction: "Fundamental Counting Principle works this concrete case: In Fundamental Counting Principle, evaluate the labelled model at input 7. The labelled answer is 42. Count sequential choices. Builds branching choice diagrams. A common labelled error is adding stage counts instead of multiplying them. Fundamental Counting Principle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Fundamental Counting Principle, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Fundamental Counting Principle works this concrete case: In Fundamental Counting Principle, evaluate the labelled model at input 7.",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "In Fundamental Counting Principle, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Fundamental Counting Principle rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Fundamental Counting Principle outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Fundamental Counting Principle restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  557: {
    introduction: "Factorials works this concrete case: Solve 7x = 56. The labelled answer is 8. Count arrangements. Animates ordering of distinct objects. A common labelled error is thinking 0! equals 0. Factorials keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Factorials, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Factorials works this concrete case: Solve 7x = 56.",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "Solve 7x = 56.", steps: ["Divide by 7.", "x=8.", "8."], answer: "8" },
      { prompt: "Expand 7(x+8).", steps: ["7x+56.", "7x+56.", "7x+56."], answer: "7x+56" },
      { prompt: "Is x=8 a root of (x-8)(x-8)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  558: {
    introduction: "Permutations works this concrete case: In Permutations, evaluate the labelled model at input 9. The labelled answer is 18. Count ordered selections. Generates arrangements and formula values. A common labelled error is using combinations when order matters. Permutations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Permutations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Permutations works this concrete case: In Permutations, evaluate the labelled model at input 9.",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "procedure",
    worked: [
      { prompt: "In Permutations, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Permutations rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Permutations outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Permutations restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  559: {
    introduction: "Permutations with Repetition works this concrete case: In Permutations with Repetition, evaluate the labelled model at input 10. The labelled answer is 30. Handle repeated objects. Groups identical items and adjusts counts. A common labelled error is decreasing choices even though repetition is allowed. Permutations with Repetition keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Permutations with Repetition, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Permutations with Repetition works this concrete case: In Permutations with Repetition, evaluate the labelled model at input 10.",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "procedure",
    worked: [
      { prompt: "In Permutations with Repetition, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Permutations with Repetition rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Permutations with Repetition outputs at 10 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Permutations with Repetition restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  560: {
    introduction: "Circular Permutations works this concrete case: In Circular Permutations, evaluate the labelled model at input 3. The labelled answer is 12. Count circular arrangements. Rotates equivalent arrangements. A common labelled error is counting rotated versions as different circular arrangements. Circular Permutations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Circular Permutations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Circular Permutations works this concrete case: In Circular Permutations, evaluate the labelled model at input 3.",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "procedure",
    worked: [
      { prompt: "In Circular Permutations, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Circular Permutations rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Circular Permutations outputs at 3 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Circular Permutations restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  561: {
    introduction: "Combinations works this concrete case: In Combinations, evaluate the labelled model at input 4. The labelled answer is 20. Count unordered selections. Builds selectable subsets. A common labelled error is counting AB and BA as different combinations. Combinations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Combinations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Combinations works this concrete case: In Combinations, evaluate the labelled model at input 4.",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "procedure",
    worked: [
      { prompt: "In Combinations, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Combinations rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Combinations outputs at 4 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Combinations restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  562: {
    introduction: "Pascal's Triangle works this concrete case: What is the middle row of 1, 3, 3, 1 made by adding? The labelled answer is two above. Explore coefficients and patterns. Generates rows and highlights identities. A common labelled error is adding numbers from the same row instead of the two above. Pascal's Triangle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Pascal's Triangle, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Pascal's Triangle works this concrete case: What is the middle row of 1, 3, 3, 1 made by adding?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "visual_exploration",
    worked: [
      { prompt: "What is the middle row of 1, 3, 3, 1 made by adding?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "two above"], answer: "two above" },
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 50° and 60°. What is the sum?", steps: ["50+60.", "110.", "110."], answer: "110" }
    ],
  },
  563: {
    introduction: "Inclusion–Exclusion works this concrete case: In Inclusion–Exclusion, evaluate the labelled model at input 6. The labelled answer is 42. Correct overlapping counts. Uses Venn diagrams and formulas. A common labelled error is adding overlapping sets and keeping the overlap twice. Inclusion–Exclusion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Inclusion–Exclusion, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Inclusion–Exclusion works this concrete case: In Inclusion–Exclusion, evaluate the labelled model at input 6.",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "procedure",
    worked: [
      { prompt: "In Inclusion–Exclusion, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Inclusion–Exclusion rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Inclusion–Exclusion outputs at 6 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Inclusion–Exclusion restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  564: {
    introduction: "Pigeonhole Principle works this concrete case: 13 people guarantee two share a birth what? The labelled answer is month. Understand guaranteed repetition. Distributes objects into containers. A common labelled error is using the principle when objects are not more than boxes. Pigeonhole Principle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Pigeonhole Principle, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Pigeonhole Principle works this concrete case: 13 people guarantee two share a birth what?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "proof",
    worked: [
      { prompt: "13 people guarantee two share a birth what?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "month"], answer: "month" },
      { prompt: "In Pigeonhole Principle, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Pigeonhole Principle rule.", "The first stored value is 14.", "14."], answer: "14" },
      { prompt: "Compare the Pigeonhole Principle outputs at 7 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "2."], answer: "2" }
    ],
  },
  565: {
    introduction: "Vertex and Edge Builder works this concrete case: In a graph, what connects two vertices? The labelled answer is edge. Create mathematical networks. Adds, moves and connects vertices. A common labelled error is confusing a connection with a point. Vertex and Edge Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Vertex and Edge Builder, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Vertex and Edge Builder works this concrete case: In a graph, what connects two vertices?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "tool",
    worked: [
      { prompt: "In a graph, what connects two vertices?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "edge"], answer: "edge" },
      { prompt: "In Vertex and Edge Builder, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Vertex and Edge Builder rule.", "The first stored value is 24.", "24."], answer: "24" },
      { prompt: "Compare the Vertex and Edge Builder outputs at 8 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "3."], answer: "3" }
    ],
  },
  566: {
    introduction: "Directed Graphs works this concrete case: What shows direction in a directed graph? The labelled answer is arrow. Model one-way relationships. Displays arrowed edges. A common labelled error is treating directed edges as if arrows do not matter. Directed Graphs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Directed Graphs, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Directed Graphs works this concrete case: What shows direction in a directed graph?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "What shows direction in a directed graph?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "arrow"], answer: "arrow" },
      { prompt: "In Directed Graphs, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Directed Graphs rule.", "The first stored value is 36.", "36."], answer: "36" },
      { prompt: "Compare the Directed Graphs outputs at 9 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "4."], answer: "4" }
    ],
  },
  567: {
    introduction: "Weighted Graphs works this concrete case: In a weighted graph, what number goes on an edge? The labelled answer is weight. Represent costs or distances. Adds editable edge weights. A common labelled error is choosing a path by fewest edges when weights matter. Weighted Graphs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Weighted Graphs, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Weighted Graphs works this concrete case: In a weighted graph, what number goes on an edge?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "In a weighted graph, what number goes on an edge?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "weight"], answer: "weight" },
      { prompt: "In Weighted Graphs, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Weighted Graphs rule.", "The first stored value is 50.", "50."], answer: "50" },
      { prompt: "Compare the Weighted Graphs outputs at 10 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "5."], answer: "5" }
    ],
  },
  568: {
    introduction: "Degree of a Vertex works this concrete case: Degree counts edges touching a what? The labelled answer is vertex. Measure connectivity. Counts incident edges. A common labelled error is counting neighbouring vertices instead of incident edges in every case. Degree of a Vertex keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Degree of a Vertex, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Degree of a Vertex works this concrete case: Degree counts edges touching a what?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "Degree counts edges touching a what?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "vertex"], answer: "vertex" },
      { prompt: "In Degree of a Vertex, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Degree of a Vertex rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Degree of a Vertex outputs at 3 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "6."], answer: "6" }
    ],
  },
  569: {
    introduction: "Paths and Cycles works this concrete case: A cycle returns to its starting what? The labelled answer is vertex. Explore routes. Highlights valid walks, trails and cycles. A common labelled error is listing vertices that are not connected by edges. Paths and Cycles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Paths and Cycles, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Paths and Cycles works this concrete case: A cycle returns to its starting what?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "A cycle returns to its starting what?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "vertex"], answer: "vertex" },
      { prompt: "In Paths and Cycles, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Paths and Cycles rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Paths and Cycles outputs at 4 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "7."], answer: "7" }
    ],
  },
  570: {
    introduction: "Connected Components works this concrete case: Vertices in one component are joined by some what? The labelled answer is path. Identify separated regions. Colours graph components. A common labelled error is thinking vertices need a direct edge to be in the same component. Connected Components keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Connected Components, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Connected Components works this concrete case: Vertices in one component are joined by some what?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "Vertices in one component are joined by some what?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "path"], answer: "path" },
      { prompt: "In Connected Components, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Connected Components rule.", "The first stored value is 10.", "10."], answer: "10" },
      { prompt: "Compare the Connected Components outputs at 5 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "2."], answer: "2" }
    ],
  },
  571: {
    introduction: "Euler Paths and Circuits works this concrete case: Euler paths use every edge exactly how many times? The labelled answer is once. Traverse every edge. Checks conditions and animates routes. A common labelled error is thinking Euler means visiting every vertex once. Euler Paths and Circuits keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Euler Paths and Circuits, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Euler Paths and Circuits works this concrete case: Euler paths use every edge exactly how many times?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "procedure",
    worked: [
      { prompt: "Euler paths use every edge exactly how many times?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "once"], answer: "once" },
      { prompt: "In Euler Paths and Circuits, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Euler Paths and Circuits rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Euler Paths and Circuits outputs at 6 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "3."], answer: "3" }
    ],
  },
  572: {
    introduction: "Hamiltonian Paths and Cycles works this concrete case: Hamiltonian paths visit every vertex exactly how many times? The labelled answer is once. Visit every vertex. Searches and animates candidate routes. A common labelled error is confusing Hamiltonian with Euler paths. Hamiltonian Paths and Cycles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Hamiltonian Paths and Cycles, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Hamiltonian Paths and Cycles works this concrete case: Hamiltonian paths visit every vertex exactly how many times?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "Hamiltonian paths visit every vertex exactly how many times?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "once"], answer: "once" },
      { prompt: "In Hamiltonian Paths and Cycles, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Hamiltonian Paths and Cycles rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Hamiltonian Paths and Cycles outputs at 7 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "4."], answer: "4" }
    ],
  },
  573: {
    introduction: "Trees works this concrete case: In Trees, evaluate the labelled model at input 8. The labelled answer is 40. Explore acyclic networks. Builds and validates tree structures. A common labelled error is calling any branching picture a tree without checking cycles and connectedness. Trees keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Trees, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Trees works this concrete case: In Trees, evaluate the labelled model at input 8.",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "In Trees, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Trees rule.", "The first stored value is 40.", "40."], answer: "40" },
      { prompt: "Compare the Trees outputs at 8 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Trees restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  574: {
    introduction: "Minimum Spanning Tree works this concrete case: An MST connects all vertices with minimum total what? The labelled answer is weight. Connect at minimum cost. Runs Prim or Kruskal step by step. A common labelled error is confusing a minimum spanning tree with one shortest route. Minimum Spanning Tree keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Minimum Spanning Tree, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Minimum Spanning Tree works this concrete case: An MST connects all vertices with minimum total what?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "procedure",
    worked: [
      { prompt: "An MST connects all vertices with minimum total what?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "weight"], answer: "weight" },
      { prompt: "In Minimum Spanning Tree, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Minimum Spanning Tree rule.", "The first stored value is 54.", "54."], answer: "54" },
      { prompt: "Compare the Minimum Spanning Tree outputs at 9 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "6."], answer: "6" }
    ],
  },
  575: {
    introduction: "Shortest Path works this concrete case: In a weighted graph, shortest path minimises total what? The labelled answer is weight. Find least-cost routes. Runs Dijkstra interactively. A common labelled error is choosing fewest edges even when weights differ. Shortest Path keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Shortest Path, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Shortest Path works this concrete case: In a weighted graph, shortest path minimises total what?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "procedure",
    worked: [
      { prompt: "In a weighted graph, shortest path minimises total what?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "weight"], answer: "weight" },
      { prompt: "In Shortest Path, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Shortest Path rule.", "The first stored value is 70.", "70."], answer: "70" },
      { prompt: "Compare the Shortest Path outputs at 10 and 17. What is the difference?", steps: ["Second input 17.", "Difference uses the same rule.", "7."], answer: "7" }
    ],
  },
  576: {
    introduction: "Graph Colouring works this concrete case: How many colours does a triangle K3 require? The labelled answer is 3. Avoid adjacent colour conflicts. Lets learners colour vertices and checks validity. A common labelled error is calling the number of colours in one valid attempt the chromatic number. Graph Colouring keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A proper vertex colouring assigns colours to vertices so adjacent vertices always receive different colours. In Graph Colouring, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Graph Colouring works this concrete case: How many colours does a triangle K3 require?",
    howItWorks: "Colour high-conflict vertices first, check every edge after each choice, reuse a colour only on non-adjacent vertices, and prove minimality with a lower bound.",
    whyItWorks: "Each edge encodes one incompatibility constraint, so a colouring is valid exactly when no edge has equal colours at both endpoints.",
    worked: [
      { prompt: "How many colours does a triangle K3 require?", steps: ["Every pair of its three vertices is adjacent.", "No two vertices can reuse a colour.", "Three colours work and fewer cannot."], answer: "3" },
      { prompt: "In Graph Colouring, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Graph Colouring rule.", "The first stored value is 6.", "6."], answer: "6" },
      { prompt: "Compare the Graph Colouring outputs at 3 and 5. What is the difference?", steps: ["Second input 5.", "Difference uses the same rule.", "2."], answer: "2" }
    ],
  },
  577: {
    introduction: "Bipartite Graphs works this concrete case: In a bipartite graph, edges go between how many groups? The labelled answer is two. Split vertices into two sets. Tests and displays two-colour partitions. A common labelled error is allowing an edge within the same group. Bipartite Graphs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Bipartite Graphs, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Bipartite Graphs works this concrete case: In a bipartite graph, edges go between how many groups?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "In a bipartite graph, edges go between how many groups?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "two"], answer: "two" },
      { prompt: "In Bipartite Graphs, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Bipartite Graphs rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Bipartite Graphs outputs at 4 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "3."], answer: "3" }
    ],
  },
  578: {
    introduction: "Planar Graphs works this concrete case: Planarity asks if some drawing has no edge what? The labelled answer is crossings. Explore crossing-free drawings. Allows vertex dragging and checks planarity concepts. A common labelled error is calling a graph non-planar just because one drawing has crossings. Planar Graphs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Planar Graphs, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Planar Graphs works this concrete case: Planarity asks if some drawing has no edge what?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "Planarity asks if some drawing has no edge what?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "crossings"], answer: "crossings" },
      { prompt: "In Planar Graphs, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Planar Graphs rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Planar Graphs outputs at 5 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "4."], answer: "4" }
    ],
  },
  579: {
    introduction: "Network Flow works this concrete case: Flow on an edge cannot exceed its what? The labelled answer is capacity. Model capacities. Animates flow and bottlenecks. A common labelled error is sending more flow through an edge than its capacity. Network Flow keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Network Flow, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Network Flow works this concrete case: Flow on an edge cannot exceed its what?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "procedure",
    worked: [
      { prompt: "Flow on an edge cannot exceed its what?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "capacity"], answer: "capacity" },
      { prompt: "In Network Flow, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Network Flow rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Network Flow outputs at 6 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "5."], answer: "5" }
    ],
  },
  580: {
    introduction: "Travelling Salesperson works this concrete case: A travelling salesperson tour must return to the what? The labelled answer is start. Explore route optimisation. Compares route lengths. A common labelled error is forgetting to return to the starting city. Travelling Salesperson keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Travelling Salesperson, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Travelling Salesperson works this concrete case: A travelling salesperson tour must return to the what?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "modelling",
    worked: [
      { prompt: "A travelling salesperson tour must return to the what?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "start"], answer: "start" },
      { prompt: "In Travelling Salesperson, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Travelling Salesperson rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Travelling Salesperson outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" }
    ],
  },
  581: {
    introduction: "Adjacency Matrix works this concrete case: An adjacency matrix must be square: yes or no? The labelled answer is yes. Connect graphs and matrices. Updates matrix entries from edges. A common labelled error is reading a matrix without matching row and column labels. Adjacency Matrix keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Adjacency Matrix, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Adjacency Matrix works this concrete case: An adjacency matrix must be square: yes or no?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "An adjacency matrix must be square: yes or no?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "yes"], answer: "yes" },
      { prompt: "Find det([[8,7],[0,4]]).", steps: ["8*4-7*0.", "32.", "32."], answer: "32" },
      { prompt: "What is the size of a 7 by 4 product if inner sizes match?", steps: ["Rows from the first matrix.", "Columns from the second.", "7 by 4."], answer: "7 by 4" }
    ],
  },
  582: {
    introduction: "Set Builder works this concrete case: Write {2,4,6,8} in set-builder notation. The labelled answer is {x in N | x is even and 2<=x<=8}. Create and manipulate sets. Adds elements and symbolic conditions. A common labelled error is writing a condition without stating whether x is integer, real, or another type. Set Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Set-builder notation describes a set by a variable, its domain, and a condition that every member satisfies. In Set Builder, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Set Builder works this concrete case: Write {2,4,6,8} in set-builder notation.",
    howItWorks: "Choose a variable, state its universe or number set, write the membership bar, add the exact condition, and test boundary values against the rule.",
    whyItWorks: "The predicate after the bar acts as a membership test, so the notation includes exactly the domain elements for which that predicate is true.",
    worked: [
      { prompt: "Write {2,4,6,8} in set-builder notation.", steps: ["Use natural numbers as the domain.", "Require x to be even.", "Restrict x between 2 and 8 inclusive."], answer: "{x in N | x is even and 2<=x<=8}" },
      { prompt: "In Set Builder, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Set Builder rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Set Builder outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" }
    ],
  },
  583: {
    introduction: "Union, Intersection and Difference works this concrete case: Let A={1,2,3} and B={3,4}. Find A union B, A intersection B, and A-B. The labelled answer is A union B={1,2,3,4}; A intersection B={3}; A-B={1,2}. Understand set operations. Uses linked Venn regions and element lists. A common labelled error is assuming A-B equals B-A. Union, Intersection and Difference keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Union collects elements in either set, intersection keeps elements in both, and difference keeps elements in the first set but not the second.",
    basicIdea: "Union, Intersection and Difference works this concrete case: Let A={1,2,3} and B={3,4}. Find A union B, A intersection B, and A-B.",
    howItWorks: "Check each candidate element against both sets, then apply OR for union, AND for intersection, or first-set AND NOT second-set for difference.",
    whyItWorks: "Set operations are logical rules applied element by element, which is why Venn shading and roster results agree.",
    worked: [
      { prompt: "Let A={1,2,3} and B={3,4}. Find A union B, A intersection B, and A-B.", steps: ["Collect each distinct element for the union.", "Keep 3 for the intersection.", "Remove B's elements from A for the difference."], answer: "A union B={1,2,3,4}; A intersection B={3}; A-B={1,2}" },
      { prompt: "In Union, Intersection and Difference, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Union, Intersection and Difference rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Union, Intersection and Difference outputs at 10 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "3."], answer: "3" }
    ],
  },
  584: {
    introduction: "Complement works this concrete case: A set complement depends on the universal what? The labelled answer is set. Understand universal-set exclusion. Shades outside a selected set. A common labelled error is finding a complement without knowing the universal set. Complement keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Complement, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Complement works this concrete case: A set complement depends on the universal what?",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "A set complement depends on the universal what?", steps: ["Combinatorics, Graph Theory and Logic", "Read the labelled result.", "set"], answer: "set" },
      { prompt: "In Complement, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Complement rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Complement outputs at 3 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "4."], answer: "4" }
    ],
  },
  585: {
    introduction: "Cartesian Product works this concrete case: In Cartesian Product, evaluate the labelled model at input 4. The labelled answer is 20. Generate ordered pairs. Builds pair grids. A common labelled error is treating ordered pairs like unordered sets. Cartesian Product keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discrete and Applied Mathematics In Cartesian Product, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cartesian Product works this concrete case: In Cartesian Product, evaluate the labelled model at input 4.",
    howItWorks: "Combinatorics, Graph Theory and Logic",
    whyItWorks: "concept",
    worked: [
      { prompt: "In Cartesian Product, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Cartesian Product rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Cartesian Product outputs at 4 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Cartesian Product restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  586: {
    introduction: "Subsets and Power Sets works this concrete case: Find the power set of {a,b}. The labelled answer is {empty set,{a},{b},{a,b}}. Explore containment. Generates all subsets for small sets. A common labelled error is leaving the empty set out of a power set. Subsets and Power Sets keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A is a subset of B when every element of A is in B; the power set of B is the set of all subsets of B. In Subsets and Power Sets, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Subsets and Power Sets works this concrete case: Find the power set of {a,b}.",
    howItWorks: "Test each candidate element for subset status; to build a power set, enumerate choices systematically by subset size or binary include/exclude patterns.",
    whyItWorks: "Each of n elements has two independent choices, included or excluded, producing 2^n distinct subsets.",
    worked: [
      { prompt: "Find the power set of {a,b}.", steps: ["Include the empty choice.", "Include each one-element subset.", "Include the full set."], answer: "{empty set,{a},{b},{a,b}}" },
      { prompt: "In Subsets and Power Sets, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Subsets and Power Sets rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Subsets and Power Sets outputs at 5 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "6."], answer: "6" }
    ],
  },
  587: {
    introduction: "Truth Tables works this concrete case: Classify p OR NOT p. The labelled answer is Tautology. Evaluate logical expressions. Builds rows automatically. A common labelled error is checking only one convenient assignment. Truth Tables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A truth table lists every truth-value assignment to propositions and evaluates a logical expression on each row. In Truth Tables, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Truth Tables works this concrete case: Classify p OR NOT p.",
    howItWorks: "Create 2^n rows for n propositions, fill atomic truth values in a regular pattern, evaluate inner connectives first, and classify the final column.",
    whyItWorks: "Every possible assignment appears once, so the final column proves the expression's behaviour over the complete finite domain.",
    worked: [
      { prompt: "Classify p OR NOT p.", steps: ["Use rows p=T and p=F.", "When p=T the disjunction is true.", "When p=F"], answer: "Tautology" },
      { prompt: "In Truth Tables, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Truth Tables rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Truth Tables outputs at 6 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "7."], answer: "7" }
    ],
  },
  588: {
    introduction: "Logical Connectives works this concrete case: Evaluate p implies q when p is true and q is false. The labelled answer is False. Understand AND, OR, NOT and implication. Uses switches and truth outputs. A common labelled error is reading mathematical OR as exactly one of the statements. Logical Connectives keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Logical connectives combine or modify propositions: NOT negates, AND requires both, OR requires at least one, and implication fails only when its premise is true and conclusion false.",
    basicIdea: "Logical Connectives works this concrete case: Evaluate p implies q when p is true and q is false.",
    howItWorks: "Identify the main connective, evaluate any negations and grouped subexpressions, then apply that connective's truth rule to the resulting values.",
    whyItWorks: "Each connective is defined by a fixed truth function, so the same input truth values always produce the same output.",
    worked: [
      { prompt: "Evaluate p implies q when p is true and q is false.", steps: ["The premise p is true.", "The conclusion q is false.", "This is the one assignment that makes implication false."], answer: "False" },
      { prompt: "In Logical Connectives, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Logical Connectives rule.", "The first stored value is 14.", "14."], answer: "14" },
      { prompt: "Compare the Logical Connectives outputs at 7 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "2."], answer: "2" }
    ],
  },
  589: {
    introduction: "Quantifiers works this concrete case: Over the integers, is every x such that x^2>=0? The labelled answer is True. Understand universal and existential claims. Tests statements over finite domains. A common labelled error is using several successful examples as proof of a universal statement. Quantifiers keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The universal quantifier claims a predicate holds for every domain element; the existential quantifier claims it holds for at least one.",
    basicIdea: "Quantifiers works this concrete case: Over the integers, is every x such that x^2>=0?",
    howItWorks: "State the domain, evaluate the predicate, search for a counterexample to test a universal claim, or provide one explicit witness to establish an existential claim.",
    whyItWorks: "The domain fixes the cases being discussed, and the quantifier determines whether all cases or at least one case must satisfy the predicate.",
    worked: [
      { prompt: "Over the integers, is every x such that x^2>=0?", steps: ["The domain is all integers.", "The square of every real number is non-negative.", "Therefore every integer satisfies the predicate."], answer: "True" },
      { prompt: "In Quantifiers, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Quantifiers rule.", "The first stored value is 24.", "24."], answer: "24" },
      { prompt: "Compare the Quantifiers outputs at 8 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "3."], answer: "3" }
    ],
  },
  590: {
    introduction: "Proof Methods works this concrete case: If slopes AB and BC both equal 4, are A, B, C collinear? The labelled answer is yes. Learn mathematical reasoning. Provides interactive templates for direct proof, contradiction, contrapositive and induction. A common labelled error is using a nearby formula that is not the Proof Methods rule. Proof Methods keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Proof Methods is the Combinatorics, Graph Theory and Logic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Proof Methods works this concrete case: If slopes AB and BC both equal 4, are A, B, C collinear?",
    howItWorks: "Read the Proof Methods inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Proof Methods works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "If slopes AB and BC both equal 4, are A, B, C collinear?", steps: ["Equal consecutive slopes.", "The points share one line.", "yes"], answer: "yes" },
      { prompt: "Does one measured diagram prove a theorem for all cases?", steps: ["Measurement is one example.", "Proof needs general reasons.", "No."], answer: "no" },
      { prompt: "Triangle area 0 for points with x=9,10,11 on y=4. Collinear?", steps: ["Zero area means one line.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  591: {
    introduction: "Simple Interest works this concrete case: Find the simple interest on 5000 rupees at 6% per year for 3 years. The labelled answer is 900 rupees interest; 5900 rupees amount. Model linear accumulation. Changes principal, rate and time and plots balance. A common labelled error is using P(1+r)^t for a simple-interest question. Simple Interest keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Simple interest is calculated only on the original principal, so equal time periods add equal interest amounts. In Simple Interest, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Simple Interest works this concrete case: Find the simple interest on 5000 rupees at 6% per year for 3 years.",
    howItWorks: "Convert the percentage rate to a decimal, match the rate period to the time unit, compute I=Prt, and add the principal to obtain A=P+I.",
    whyItWorks: "Because every period uses the same original principal rather than an updated balance, the interest grows by the constant amount Pr per period.",
    worked: [
      { prompt: "Find the simple interest on 5000 rupees at 6% per year for 3 years.", steps: ["Convert 6% to 0.06.", "Compute I=5000(0.06)(3).", "Add only if the final amount is requested."], answer: "900 rupees interest; 5900 rupees amount" },
      { prompt: "In Simple Interest, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Simple Interest rule.", "The first stored value is 50.", "50."], answer: "50" },
      { prompt: "Compare the Simple Interest outputs at 10 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "5."], answer: "5" }
    ],
  },
  592: {
    introduction: "Compound Interest works this concrete case: In Compound Interest, evaluate the labelled model at input 3. The labelled answer is 18. Model repeated growth. Compares compounding frequencies. A common labelled error is using a nearby formula that is not the Compound Interest rule. Compound Interest keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Compound Interest is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Compound Interest works this concrete case: In Compound Interest, evaluate the labelled model at input 3.",
    howItWorks: "Read the Compound Interest inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Compound Interest works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Compound Interest, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Compound Interest rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Compound Interest outputs at 3 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Compound Interest restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  593: {
    introduction: "Effective Interest Rate works this concrete case: In Effective Interest Rate, evaluate the labelled model at input 4. The labelled answer is 28. Compare nominal rates. Converts nominal rates to effective annual rates. A common labelled error is using a nearby formula that is not the Effective Interest Rate rule. Effective Interest Rate keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Effective Interest Rate is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Effective Interest Rate works this concrete case: In Effective Interest Rate, evaluate the labelled model at input 4.",
    howItWorks: "Read the Effective Interest Rate inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Effective Interest Rate works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Effective Interest Rate, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Effective Interest Rate rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Effective Interest Rate outputs at 4 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Effective Interest Rate restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  594: {
    introduction: "Present Value works this concrete case: In Present Value, evaluate the labelled model at input 5. The labelled answer is 10. Discount future cash flows. Moves cash flows on a timeline. A common labelled error is using a nearby formula that is not the Present Value rule. Present Value keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Present Value is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Present Value works this concrete case: In Present Value, evaluate the labelled model at input 5.",
    howItWorks: "Read the Present Value inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Present Value works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Present Value, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Present Value rule.", "The first stored value is 10.", "10."], answer: "10" },
      { prompt: "Compare the Present Value outputs at 5 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Present Value restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  595: {
    introduction: "Future Value works this concrete case: In Future Value, evaluate the labelled model at input 6. The labelled answer is 18. Accumulate current values. Calculates future balances. A common labelled error is using a nearby formula that is not the Future Value rule. Future Value keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Future Value is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Future Value works this concrete case: In Future Value, evaluate the labelled model at input 6.",
    howItWorks: "Read the Future Value inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Future Value works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Future Value, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Future Value rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Future Value outputs at 6 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Future Value restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  596: {
    introduction: "Annuities works this concrete case: In Annuities, evaluate the labelled model at input 7. The labelled answer is 28. Model regular payments. Builds payment timelines and accumulated values. A common labelled error is using a nearby formula that is not the Annuities rule. Annuities keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Annuities is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Annuities works this concrete case: In Annuities, evaluate the labelled model at input 7.",
    howItWorks: "Read the Annuities inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Annuities works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Annuities, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Annuities rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Annuities outputs at 7 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Annuities restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  597: {
    introduction: "Loans and EMIs works this concrete case: In Loans and EMIs, evaluate the labelled model at input 8. The labelled answer is 40. Understand instalment loans. Splits payments into principal and interest. A common labelled error is using a nearby formula that is not the Loans and EMIs rule. Loans and EMIs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Loans and EMIs is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Loans and EMIs works this concrete case: In Loans and EMIs, evaluate the labelled model at input 8.",
    howItWorks: "Read the Loans and EMIs inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Loans and EMIs works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Loans and EMIs, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Loans and EMIs rule.", "The first stored value is 40.", "40."], answer: "40" },
      { prompt: "Compare the Loans and EMIs outputs at 8 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Loans and EMIs restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  598: {
    introduction: "Amortisation Table works this concrete case: In Amortisation Table, evaluate the labelled model at input 9. The labelled answer is 54. Track loan balances. Generates period-by-period schedules. A common labelled error is using a nearby formula that is not the Amortisation Table rule. Amortisation Table keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Amortisation Table is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Amortisation Table works this concrete case: In Amortisation Table, evaluate the labelled model at input 9.",
    howItWorks: "Read the Amortisation Table inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Amortisation Table works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Amortisation Table, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Amortisation Table rule.", "The first stored value is 54.", "54."], answer: "54" },
      { prompt: "Compare the Amortisation Table outputs at 9 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Amortisation Table restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  599: {
    introduction: "Depreciation works this concrete case: In Depreciation, evaluate the labelled model at input 10. The labelled answer is 70. Compare asset-value methods. Plots straight-line and reducing-balance values. A common labelled error is using a nearby formula that is not the Depreciation rule. Depreciation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Depreciation is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Depreciation works this concrete case: In Depreciation, evaluate the labelled model at input 10.",
    howItWorks: "Read the Depreciation inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Depreciation works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Depreciation, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Depreciation rule.", "The first stored value is 70.", "70."], answer: "70" },
      { prompt: "Compare the Depreciation outputs at 10 and 17. What is the difference?", steps: ["Second input 17.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Depreciation restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  600: {
    introduction: "Inflation works this concrete case: In Inflation, evaluate the labelled model at input 3. The labelled answer is 6. Understand purchasing-power change. Adjusts prices across time. A common labelled error is using a nearby formula that is not the Inflation rule. Inflation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inflation is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Inflation works this concrete case: In Inflation, evaluate the labelled model at input 3.",
    howItWorks: "Read the Inflation inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Inflation works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Inflation, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Inflation rule.", "The first stored value is 6.", "6."], answer: "6" },
      { prompt: "Compare the Inflation outputs at 3 and 5. What is the difference?", steps: ["Second input 5.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Inflation restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  601: {
    introduction: "Currency Conversion works this concrete case: In Currency Conversion, evaluate the labelled model at input 4. The labelled answer is 12. Apply exchange rates. Converts amounts with editable rates. A common labelled error is using a nearby formula that is not the Currency Conversion rule. Currency Conversion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Currency Conversion is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Currency Conversion works this concrete case: In Currency Conversion, evaluate the labelled model at input 4.",
    howItWorks: "Read the Currency Conversion inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Currency Conversion works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Currency Conversion, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Currency Conversion rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Currency Conversion outputs at 4 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Currency Conversion restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  602: {
    introduction: "Profit, Loss, Markup and Margin works this concrete case: In Profit, Loss, Markup and Margin, evaluate the labelled model at input 5. The labelled answer is 20. Distinguish commercial measures. Links cost, selling price, profit, markup and margin. A common labelled error is using a nearby formula that is not the Profit, Loss, Markup and Margin rule. Profit, Loss, Markup and Margin keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Profit, Loss, Markup and Margin is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Profit, Loss, Markup and Margin works this concrete case: In Profit, Loss, Markup and Margin, evaluate the labelled model at input 5.",
    howItWorks: "Read the Profit, Loss, Markup and Margin inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Profit, Loss, Markup and Margin works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Profit, Loss, Markup and Margin, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Profit, Loss, Markup and Margin rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Profit, Loss, Markup and Margin outputs at 5 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Profit, Loss, Markup and Margin restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  603: {
    introduction: "Break-Even Analysis works this concrete case: In Break-Even Analysis, evaluate the labelled model at input 6. The labelled answer is 30. Find revenue-cost equality. Plots cost and revenue lines and marks break-even. A common labelled error is using a nearby formula that is not the Break-Even Analysis rule. Break-Even Analysis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Break-Even Analysis is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Break-Even Analysis works this concrete case: In Break-Even Analysis, evaluate the labelled model at input 6.",
    howItWorks: "Read the Break-Even Analysis inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Break-Even Analysis works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Break-Even Analysis, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Break-Even Analysis rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Break-Even Analysis outputs at 6 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Break-Even Analysis restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  604: {
    introduction: "Tax and Discounts works this concrete case: In Tax and Discounts, evaluate the labelled model at input 7. The labelled answer is 42. Apply sequential percentage changes. Shows order effects and final price. A common labelled error is using a nearby formula that is not the Tax and Discounts rule. Tax and Discounts keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Tax and Discounts is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Tax and Discounts works this concrete case: In Tax and Discounts, evaluate the labelled model at input 7.",
    howItWorks: "Read the Tax and Discounts inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Tax and Discounts works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Tax and Discounts, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Tax and Discounts rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Tax and Discounts outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Tax and Discounts restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  605: {
    introduction: "Investment Comparison works this concrete case: In Investment Comparison, evaluate the labelled model at input 8. The labelled answer is 56. Compare scenarios. Plots multiple growth paths and risk assumptions. A common labelled error is using a nearby formula that is not the Investment Comparison rule. Investment Comparison keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Investment Comparison is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Investment Comparison works this concrete case: In Investment Comparison, evaluate the labelled model at input 8.",
    howItWorks: "Read the Investment Comparison inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Investment Comparison works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Investment Comparison, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Investment Comparison rule.", "The first stored value is 56.", "56."], answer: "56" },
      { prompt: "Compare the Investment Comparison outputs at 8 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Investment Comparison restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  606: {
    introduction: "Model Builder works this concrete case: In Model Builder, evaluate the labelled model at input 9. The labelled answer is 18. Translate scenarios into equations. Defines variables, assumptions and relationships. A common labelled error is using a nearby formula that is not the Model Builder rule. Model Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Model Builder is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Model Builder works this concrete case: In Model Builder, evaluate the labelled model at input 9.",
    howItWorks: "Read the Model Builder inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Model Builder works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Model Builder, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Model Builder rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Model Builder outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Model Builder restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  607: {
    introduction: "Linear Models works this concrete case: In Linear Models, evaluate the labelled model at input 10. The labelled answer is 30. Represent constant change. Fits or constructs linear relationships. A common labelled error is using a nearby formula that is not the Linear Models rule. Linear Models keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Linear Models is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Linear Models works this concrete case: In Linear Models, evaluate the labelled model at input 10.",
    howItWorks: "Read the Linear Models inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Linear Models works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Linear Models, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Linear Models rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Linear Models outputs at 10 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Linear Models restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  608: {
    introduction: "Quadratic Models works this concrete case: In Quadratic Models, evaluate the labelled model at input 3. The labelled answer is 12. Represent curved trajectories or optimisation. Adjusts coefficients and interprets features. A common labelled error is using a nearby formula that is not the Quadratic Models rule. Quadratic Models keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Quadratic Models is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Quadratic Models works this concrete case: In Quadratic Models, evaluate the labelled model at input 3.",
    howItWorks: "Read the Quadratic Models inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Quadratic Models works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Quadratic Models, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Quadratic Models rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Quadratic Models outputs at 3 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Quadratic Models restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  609: {
    introduction: "Exponential and Logistic Models works this concrete case: In Exponential and Logistic Models, evaluate the labelled model at input 4. The labelled answer is 20. Represent growth processes. Compares unlimited and constrained growth. A common labelled error is using a nearby formula that is not the Exponential and Logistic Models rule. Exponential and Logistic Models keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Exponential and Logistic Models is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Exponential and Logistic Models works this concrete case: In Exponential and Logistic Models, evaluate the labelled model at input 4.",
    howItWorks: "Read the Exponential and Logistic Models inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Exponential and Logistic Models works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Exponential and Logistic Models, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Exponential and Logistic Models rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Exponential and Logistic Models outputs at 4 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Exponential and Logistic Models restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  610: {
    introduction: "Periodic Models works this concrete case: In Periodic Models, evaluate the labelled model at input 5. The labelled answer is 30. Represent cycles. Fits trigonometric functions to seasonal data. A common labelled error is using a nearby formula that is not the Periodic Models rule. Periodic Models keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Periodic Models is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Periodic Models works this concrete case: In Periodic Models, evaluate the labelled model at input 5.",
    howItWorks: "Read the Periodic Models inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Periodic Models works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Periodic Models, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Periodic Models rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Periodic Models outputs at 5 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Periodic Models restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  611: {
    introduction: "Piecewise Models works this concrete case: In Piecewise Models, evaluate the labelled model at input 6. The labelled answer is 42. Represent rule changes. Creates interval-specific formulas. A common labelled error is using a nearby formula that is not the Piecewise Models rule. Piecewise Models keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Piecewise Models is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Piecewise Models works this concrete case: In Piecewise Models, evaluate the labelled model at input 6.",
    howItWorks: "Read the Piecewise Models inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Piecewise Models works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Piecewise Models, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Piecewise Models rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Piecewise Models outputs at 6 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Piecewise Models restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  612: {
    introduction: "Parameter Estimation works this concrete case: In Parameter Estimation, evaluate the labelled model at input 7. The labelled answer is 14. Fit model inputs. Uses sliders or regression to reduce error. A common labelled error is using a nearby formula that is not the Parameter Estimation rule. Parameter Estimation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Parameter Estimation is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Parameter Estimation works this concrete case: In Parameter Estimation, evaluate the labelled model at input 7.",
    howItWorks: "Read the Parameter Estimation inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Parameter Estimation works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Parameter Estimation, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Parameter Estimation rule.", "The first stored value is 14.", "14."], answer: "14" },
      { prompt: "Compare the Parameter Estimation outputs at 7 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Parameter Estimation restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  613: {
    introduction: "Dimensional Analysis works this concrete case: In Dimensional Analysis, evaluate the labelled model at input 8. The labelled answer is 24. Check unit consistency. Tracks units through formulas. A common labelled error is using a nearby formula that is not the Dimensional Analysis rule. Dimensional Analysis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Dimensional Analysis is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Dimensional Analysis works this concrete case: In Dimensional Analysis, evaluate the labelled model at input 8.",
    howItWorks: "Read the Dimensional Analysis inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Dimensional Analysis works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Dimensional Analysis, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Dimensional Analysis rule.", "The first stored value is 24.", "24."], answer: "24" },
      { prompt: "Compare the Dimensional Analysis outputs at 8 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Dimensional Analysis restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  614: {
    introduction: "Sensitivity Analysis works this concrete case: In Sensitivity Analysis, evaluate the labelled model at input 9. The labelled answer is 36. Understand input impact. Changes one or more assumptions and compares outputs. A common labelled error is using a nearby formula that is not the Sensitivity Analysis rule. Sensitivity Analysis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Sensitivity Analysis is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Sensitivity Analysis works this concrete case: In Sensitivity Analysis, evaluate the labelled model at input 9.",
    howItWorks: "Read the Sensitivity Analysis inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Sensitivity Analysis works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Sensitivity Analysis, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Sensitivity Analysis rule.", "The first stored value is 36.", "36."], answer: "36" },
      { prompt: "Compare the Sensitivity Analysis outputs at 9 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Sensitivity Analysis restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  615: {
    introduction: "Residual and Error Analysis works this concrete case: Residual at x=10 if y=10 and ŷ=5. The labelled answer is 5. Evaluate model quality. Plots prediction errors. A common labelled error is using a nearby formula that is not the Residual and Error Analysis rule. Residual and Error Analysis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Residual and Error Analysis is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Residual and Error Analysis works this concrete case: Residual at x=10 if y=10 and ŷ=5.",
    howItWorks: "Read the Residual and Error Analysis inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Residual and Error Analysis works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Residual at x=10 if y=10 and ŷ=5.", steps: ["residual=y-ŷ.", "10-5=5.", "5."], answer: "5" },
      { prompt: "If slope=5 and intercept=10, find ŷ(10).", steps: ["ŷ=5x+10.", "5*10+10.", "60."], answer: "60" },
      { prompt: "Does a residual of 0 at one point prove the line fits every point?", steps: ["One zero residual is one hit.", "Check all residuals.", "No."], answer: "no" }
    ],
  },
  616: {
    introduction: "Scenario Comparison works this concrete case: In Scenario Comparison, evaluate the labelled model at input 3. The labelled answer is 18. Compare assumptions. Displays multiple models side by side. A common labelled error is using a nearby formula that is not the Scenario Comparison rule. Scenario Comparison keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Scenario Comparison is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Scenario Comparison works this concrete case: In Scenario Comparison, evaluate the labelled model at input 3.",
    howItWorks: "Read the Scenario Comparison inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Scenario Comparison works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Scenario Comparison, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Scenario Comparison rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Scenario Comparison outputs at 3 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Scenario Comparison restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  617: {
    introduction: "Linear Programming works this concrete case: In Linear Programming, evaluate the labelled model at input 4. The labelled answer is 28. Optimise under constraints. Shades feasible regions and tests objective values. A common labelled error is using a nearby formula that is not the Linear Programming rule. Linear Programming keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Linear Programming is the Financial Mathematics and Modelling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Linear Programming works this concrete case: In Linear Programming, evaluate the labelled model at input 4.",
    howItWorks: "Read the Linear Programming inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Linear Programming works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Linear Programming, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Linear Programming rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Linear Programming outputs at 4 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Linear Programming restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  618: {
    introduction: "Slider Component works this concrete case: A checkbox is best for how many states? The labelled answer is 2. Expose adjustable parameters. Adds configurable numeric or angle sliders. A common labelled error is leaving the slider without a clear range. Slider Component keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Slider Component, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Slider Component works this concrete case: A checkbox is best for how many states?",
    howItWorks: "A slider is a control that lets a learner choose a number from a fixed range.",
    whyItWorks: "Set a minimum, maximum, step size, label, and linked value.",
    worked: [
      { prompt: "A checkbox is best for how many states?", steps: ["A slider is a control that lets a learner choose a number from a fixed range.", "Read the labelled result.", "2"], answer: "2" },
      { prompt: "A slider from 0 to 50 with step 2: how many steps from 0 to max?", steps: ["50/2.", "25.", "25."], answer: "25" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  619: {
    introduction: "Checkbox works this concrete case: A checkbox is best for how many states? The labelled answer is 2. Control visibility and states. Toggles objects, hints or solution layers. A common labelled error is using one checkbox for many choices. Checkbox keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Checkbox, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Checkbox works this concrete case: A checkbox is best for how many states?",
    howItWorks: "A checkbox is a control for a yes-or-no choice.",
    whyItWorks: "Use it to show, hide, enable, or disable one feature.",
    worked: [
      { prompt: "A checkbox is best for how many states?", steps: ["A checkbox is a control for a yes-or-no choice.", "Read the labelled result.", "2"], answer: "2" },
      { prompt: "A slider from 0 to 60 with step 3: how many steps from 0 to max?", steps: ["60/3.", "20.", "20."], answer: "20" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  620: {
    introduction: "Button works this concrete case: What should a button label describe? The labelled answer is action. Trigger actions. Runs reset, randomise, reveal or animation commands. A common labelled error is using a button label like click here. Button keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Button, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Button works this concrete case: What should a button label describe?",
    howItWorks: "A button runs one clear command when the learner activates it.",
    whyItWorks: "Give the button a short label and connect it to one action.",
    worked: [
      { prompt: "What should a button label describe?", steps: ["A button runs one clear command when the learner activates it.", "Read the labelled result.", "action"], answer: "action" },
      { prompt: "A slider from 0 to 70 with step 4: how many steps from 0 to max?", steps: ["70/4.", "17.", "17."], answer: "17" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  621: {
    introduction: "Input Box works this concrete case: What must an input box check? The labelled answer is format. Accept learner responses. Links entered values or expressions to objects. A common labelled error is accepting any typed text as correct. Input Box keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Input Box, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Input Box works this concrete case: What must an input box check?",
    howItWorks: "An input box lets a learner type a number, word, or expression.",
    whyItWorks: "Choose the accepted format and validate the typed answer.",
    worked: [
      { prompt: "What must an input box check?", steps: ["An input box lets a learner type a number, word, or expression.", "Read the labelled result.", "format"], answer: "format" },
      { prompt: "A slider from 0 to 80 with step 5: how many steps from 0 to max?", steps: ["80/5.", "16.", "16."], answer: "16" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  622: {
    introduction: "Drop-Down List works this concrete case: A drop-down list should contain prepared what? The labelled answer is choices. Select cases or datasets. Switches functions, objects or scenarios. A common labelled error is putting too many unrelated choices in one list. Drop-Down List keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Drop-Down List, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Drop-Down List works this concrete case: A drop-down list should contain prepared what?",
    howItWorks: "A drop-down list lets a learner choose one option from a prepared list.",
    whyItWorks: "Write clear choices and connect the selected choice to feedback.",
    worked: [
      { prompt: "A drop-down list should contain prepared what?", steps: ["A drop-down list lets a learner choose one option from a prepared list.", "Read the labelled result.", "choices"], answer: "choices" },
      { prompt: "A slider from 0 to 90 with step 6: how many steps from 0 to max?", steps: ["90/6.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  623: {
    introduction: "Dynamic Text works this concrete case: Dynamic text changes when linked values do what? The labelled answer is change. Create live explanations. Embeds changing values and formulas in instructional text. A common labelled error is typing a value that should update by hand. Dynamic Text keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Dynamic Text, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Dynamic Text works this concrete case: Dynamic text changes when linked values do what?",
    howItWorks: "Dynamic text is text that updates when linked values change.",
    whyItWorks: "Bind the text to a variable, answer, or object property.",
    worked: [
      { prompt: "Dynamic text changes when linked values do what?", steps: ["Dynamic text is text that updates when linked values change.", "Read the labelled result.", "change"], answer: "change" },
      { prompt: "A slider from 0 to 100 with step 7: how many steps from 0 to max?", steps: ["100/7.", "14.", "14."], answer: "14" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  624: {
    introduction: "Formula Display works this concrete case: What should be defined in a formula display? The labelled answer is symbols. Present mathematical notation. Renders LaTeX expressions. A common labelled error is showing symbols without meanings. Formula Display keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Formula Display, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Formula Display works this concrete case: What should be defined in a formula display?",
    howItWorks: "A formula display shows a mathematical rule in readable notation.",
    whyItWorks: "Use clear symbols, define variables, and link values when needed.",
    worked: [
      { prompt: "What should be defined in a formula display?", steps: ["A formula display shows a mathematical rule in readable notation.", "Read the labelled result.", "symbols"], answer: "symbols" },
      { prompt: "A slider from 0 to 30 with step 2: how many steps from 0 to max?", steps: ["30/2.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  625: {
    introduction: "Image Object works this concrete case: What text should an image include for accessibility? The labelled answer is alt text. Add contextual visuals. Places diagrams or backgrounds. A common labelled error is adding an image without text description. Image Object keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Image Object, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Image Object works this concrete case: What text should an image include for accessibility?",
    howItWorks: "An image object places a picture in the lesson workspace.",
    whyItWorks: "Set source, size, position, and alt text.",
    worked: [
      { prompt: "What text should an image include for accessibility?", steps: ["An image object places a picture in the lesson workspace.", "Read the labelled result.", "alt text"], answer: "alt text" },
      { prompt: "A slider from 0 to 40 with step 3: how many steps from 0 to max?", steps: ["40/3.", "13.", "13."], answer: "13" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  626: {
    introduction: "Audio and Video works this concrete case: What should spoken video include? The labelled answer is captions. Support multimedia learning. Embeds explanations or demonstrations. A common labelled error is using video without captions. Audio and Video keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Audio and Video, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Audio and Video works this concrete case: What should spoken video include?",
    howItWorks: "Audio and video objects play recorded sound or moving media.",
    whyItWorks: "Add controls, captions, and a clear learning purpose.",
    worked: [
      { prompt: "What should spoken video include?", steps: ["Audio and video objects play recorded sound or moving media.", "Read the labelled result.", "captions"], answer: "captions" },
      { prompt: "A slider from 0 to 50 with step 4: how many steps from 0 to max?", steps: ["50/4.", "12.", "12."], answer: "12" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  627: {
    introduction: "Pen and Highlighter works this concrete case: What should a highlight show? The labelled answer is learning target. Annotate work. Allows freehand drawing and emphasis. A common labelled error is highlighting without a learning target. Pen and Highlighter keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Pen and Highlighter, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Pen and Highlighter works this concrete case: What should a highlight show?",
    howItWorks: "Pen and highlighter tools let learners mark important parts.",
    whyItWorks: "Choose colour, thickness, and whether marks can be erased.",
    worked: [
      { prompt: "What should a highlight show?", steps: ["Pen and highlighter tools let learners mark important parts.", "Read the labelled result.", "learning target"], answer: "learning target" },
      { prompt: "A slider from 0 to 60 with step 5: how many steps from 0 to max?", steps: ["60/5.", "12.", "12."], answer: "12" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  628: {
    introduction: "Tables works this concrete case: What should table columns have? The labelled answer is headings. Present organised values. Creates editable or calculated tables. A common labelled error is using numbers without row or column labels. Tables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Tables, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Tables works this concrete case: What should table columns have?",
    howItWorks: "A table organises values into rows and columns.",
    whyItWorks: "Set headings, units, editable cells, and feedback rules.",
    worked: [
      { prompt: "What should table columns have?", steps: ["A table organises values into rows and columns.", "Read the labelled result.", "headings"], answer: "headings" },
      { prompt: "A slider from 0 to 70 with step 6: how many steps from 0 to max?", steps: ["70/6.", "11.", "11."], answer: "11" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  629: {
    introduction: "Multiple Pages works this concrete case: Why use multiple pages? The labelled answer is split. Build lesson sequences. Combines several canvases in one activity. A common labelled error is putting every task on one crowded page. Multiple Pages keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Multiple Pages, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Multiple Pages works this concrete case: Why use multiple pages?",
    howItWorks: "Multiple pages split a lesson into ordered screens.",
    whyItWorks: "Give each page one clear purpose and keep state consistent.",
    worked: [
      { prompt: "Why use multiple pages?", steps: ["Multiple pages split a lesson into ordered screens.", "Read the labelled result.", "split"], answer: "split" },
      { prompt: "A slider from 0 to 80 with step 7: how many steps from 0 to max?", steps: ["80/7.", "11.", "11."], answer: "11" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  630: {
    introduction: "Reset Construction works this concrete case: Reset should restore what state? The labelled answer is starting. Restore initial state. Returns all objects and values to defaults. A common labelled error is resetting only one object. Reset Construction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Reset Construction, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Reset Construction works this concrete case: Reset should restore what state?",
    howItWorks: "Reset construction returns a lesson to a known starting state.",
    whyItWorks: "Store the starting state and restore all linked values.",
    worked: [
      { prompt: "Reset should restore what state?", steps: ["Reset construction returns a lesson to a known starting state.", "Read the labelled result.", "starting"], answer: "starting" },
      { prompt: "A slider from 0 to 90 with step 2: how many steps from 0 to max?", steps: ["90/2.", "45.", "45."], answer: "45" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  631: {
    introduction: "Undo and Redo works this concrete case: Undo needs an action what? The labelled answer is history. Support experimentation. Reverses or restores actions. A common labelled error is trying to undo without storing actions. Undo and Redo keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Undo and Redo, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Undo and Redo works this concrete case: Undo needs an action what?",
    howItWorks: "Undo reverses the last action, and redo reapplies it.",
    whyItWorks: "Record actions in order and step backward or forward safely.",
    worked: [
      { prompt: "Undo needs an action what?", steps: ["Undo reverses the last action, and redo reapplies it.", "Read the labelled result.", "history"], answer: "history" },
      { prompt: "A slider from 0 to 100 with step 3: how many steps from 0 to max?", steps: ["100/3.", "33.", "33."], answer: "33" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  632: {
    introduction: "Object Locking works this concrete case: Object locking prevents accidental what? The labelled answer is changes. Protect instructional elements. Prevents accidental movement or editing. A common labelled error is locking objects learners must manipulate. Object Locking keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Object Locking, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Object Locking works this concrete case: Object locking prevents accidental what?",
    howItWorks: "Object locking prevents selected objects from being changed by accident.",
    whyItWorks: "Lock fixed objects and leave learning objects editable.",
    worked: [
      { prompt: "Object locking prevents accidental what?", steps: ["Object locking prevents selected objects from being changed by accident.", "Read the labelled result.", "changes"], answer: "changes" },
      { prompt: "A slider from 0 to 30 with step 4: how many steps from 0 to max?", steps: ["30/4.", "7.", "7."], answer: "7" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  633: {
    introduction: "Conditional Feedback works this concrete case: Conditional feedback depends on learner what? The labelled answer is answer. Respond to learner input. Shows targeted messages based on correctness. A common labelled error is giving only correct or wrong messages. Conditional Feedback keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Conditional Feedback, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Conditional Feedback works this concrete case: Conditional feedback depends on learner what?",
    howItWorks: "Conditional feedback changes message based on a learner action or answer.",
    whyItWorks: "Write rules for correct, close, and incorrect states.",
    worked: [
      { prompt: "Conditional feedback depends on learner what?", steps: ["Conditional feedback changes message based on a learner action or answer.", "Read the labelled result.", "answer"], answer: "answer" },
      { prompt: "A slider from 0 to 40 with step 5: how many steps from 0 to max?", steps: ["40/5.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  634: {
    introduction: "Custom Tool Builder works this concrete case: A custom tool needs inputs and what? The labelled answer is outputs. Reuse construction procedures. Packages selected inputs and outputs as a tool. A common labelled error is building a tool without clear inputs. Custom Tool Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Custom Tool Builder, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Custom Tool Builder works this concrete case: A custom tool needs inputs and what?",
    howItWorks: "A custom tool packages repeated construction steps into one reusable tool.",
    whyItWorks: "Choose inputs, outputs, and the exact construction steps.",
    worked: [
      { prompt: "A custom tool needs inputs and what?", steps: ["A custom tool packages repeated construction steps into one reusable tool.", "Read the labelled result.", "outputs"], answer: "outputs" },
      { prompt: "A slider from 0 to 50 with step 6: how many steps from 0 to max?", steps: ["50/6.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  635: {
    introduction: "Command Library works this concrete case: What should you check before using a command? The labelled answer is syntax. Expose advanced functionality. Provides searchable commands by domain. A common labelled error is typing command inputs without checking order. Command Library keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Command Library, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Command Library works this concrete case: What should you check before using a command?",
    howItWorks: "A command library is a set of ready commands for creating or changing objects.",
    whyItWorks: "Search the command, read its inputs, and apply it carefully.",
    worked: [
      { prompt: "What should you check before using a command?", steps: ["A command library is a set of ready commands for creating or changing objects.", "Read the labelled result.", "syntax"], answer: "syntax" },
      { prompt: "A slider from 0 to 60 with step 7: how many steps from 0 to max?", steps: ["60/7.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  636: {
    introduction: "Object Scripting works this concrete case: A script must be attached to the correct what? The labelled answer is event. Create responsive activities. Runs code on click, update or drag. A common labelled error is putting a script on the wrong event. Object Scripting keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Object Scripting, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Object Scripting works this concrete case: A script must be attached to the correct what?",
    howItWorks: "Object scripting runs small code actions when an object changes or is clicked.",
    whyItWorks: "Attach the script to the correct event and test the result.",
    worked: [
      { prompt: "A script must be attached to the correct what?", steps: ["Object scripting runs small code actions when an object changes or is clicked.", "Read the labelled result.", "event"], answer: "event" },
      { prompt: "A slider from 0 to 70 with step 2: how many steps from 0 to max?", steps: ["70/2.", "35.", "35."], answer: "35" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  637: {
    introduction: "Randomisation works this concrete case: Randomisation needs limits and what? The labelled answer is constraints. Generate varied practice. Creates new values, points or datasets. A common labelled error is randomising values that make bad questions. Randomisation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Randomisation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Randomisation works this concrete case: Randomisation needs limits and what?",
    howItWorks: "Randomisation creates varied values or questions within chosen limits.",
    whyItWorks: "Set a range, constraints, and saved answer key.",
    worked: [
      { prompt: "Randomisation needs limits and what?", steps: ["Randomisation creates varied values or questions within chosen limits.", "Read the labelled result.", "constraints"], answer: "constraints" },
      { prompt: "A slider from 0 to 80 with step 3: how many steps from 0 to max?", steps: ["80/3.", "26.", "26."], answer: "26" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  638: {
    introduction: "Automatic Checking works this concrete case: Automatic checking compares response with an answer what? The labelled answer is rule. Validate learner constructions. Tests mathematical conditions rather than fixed positions. A common labelled error is rejecting correct equivalent answers. Automatic Checking keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Automatic Checking, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Automatic Checking works this concrete case: Automatic checking compares response with an answer what?",
    howItWorks: "Automatic checking compares a learner response with an accepted answer rule.",
    whyItWorks: "Define accepted answers, tolerance, and feedback messages.",
    worked: [
      { prompt: "Automatic checking compares response with an answer what?", steps: ["Automatic checking compares a learner response with an accepted answer rule.", "Read the labelled result.", "rule"], answer: "rule" },
      { prompt: "A slider from 0 to 90 with step 4: how many steps from 0 to max?", steps: ["90/4.", "22.", "22."], answer: "22" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  639: {
    introduction: "Import and Export works this concrete case: What should be checked before importing? The labelled answer is file type. Share authored activities. Saves, loads and distributes constructions. A common labelled error is importing a file without checking format. Import and Export keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Interactive Authoring In Import and Export, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Import and Export works this concrete case: What should be checked before importing?",
    howItWorks: "Import brings content in, and export saves content out.",
    whyItWorks: "Check file type, data fields, and compatibility.",
    worked: [
      { prompt: "What should be checked before importing?", steps: ["Import brings content in, and export saves content out.", "Read the labelled result.", "file type"], answer: "file type" },
      { prompt: "A slider from 0 to 100 with step 5: how many steps from 0 to max?", steps: ["100/5.", "20.", "20."], answer: "20" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  640: {
    introduction: "Concept Introduction works this concrete case: A concept introduction should begin with the main what? The labelled answer is idea. Introduce definitions and notation. Combines concise text, animation and examples. A common labelled error is starting with many rules before meaning. Concept Introduction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Lesson and Assessment Pages In Concept Introduction, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Concept Introduction works this concrete case: A concept introduction should begin with the main what?",
    howItWorks: "A concept introduction gives the first clear meaning of a new idea.",
    whyItWorks: "State the idea, show one model, and connect it to a need.",
    worked: [
      { prompt: "A concept introduction should begin with the main what?", steps: ["A concept introduction gives the first clear meaning of a new idea.", "Read the labelled result.", "idea"], answer: "idea" },
      { prompt: "A slider from 0 to 30 with step 6: how many steps from 0 to max?", steps: ["30/6.", "5.", "5."], answer: "5" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  641: {
    introduction: "Visualise works this concrete case: A useful visual should show a mathematical what? The labelled answer is relationship. Build conceptual understanding. Shows a dynamic model before formal procedure. A common labelled error is using a visual that does not explain the idea. Visualise keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Lesson and Assessment Pages In Visualise, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Visualise works this concrete case: A useful visual should show a mathematical what?",
    howItWorks: "Visualise means showing an idea with a picture, graph, model, or animation.",
    whyItWorks: "Choose a visual that matches the exact concept.",
    worked: [
      { prompt: "A useful visual should show a mathematical what?", steps: ["Visualise means showing an idea with a picture, graph, model, or animation.", "Read the labelled result.", "relationship"], answer: "relationship" },
      { prompt: "A slider from 0 to 40 with step 7: how many steps from 0 to max?", steps: ["40/7.", "5.", "5."], answer: "5" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  642: {
    introduction: "Manipulative Laboratory works this concrete case: A manipulative lab needs controls and a focused what? The labelled answer is question. Learn by changing objects. Allows dragging, resizing, rotating and parameter changes. A common labelled error is letting learners change things without a question. Manipulative Laboratory keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Lesson and Assessment Pages In Manipulative Laboratory, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Manipulative Laboratory works this concrete case: A manipulative lab needs controls and a focused what?",
    howItWorks: "A manipulative laboratory lets learners test ideas by changing objects.",
    whyItWorks: "Provide controls, observations, and a focused question.",
    worked: [
      { prompt: "A manipulative lab needs controls and a focused what?", steps: ["A manipulative laboratory lets learners test ideas by changing objects.", "Read the labelled result.", "question"], answer: "question" },
      { prompt: "A slider from 0 to 50 with step 2: how many steps from 0 to max?", steps: ["50/2.", "25.", "25."], answer: "25" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  643: {
    introduction: "Guided Exploration works this concrete case: Guided exploration should use a clear what? The labelled answer is sequence. Direct discovery. Provides sequenced prompts and checks. A common labelled error is asking random questions without order. Guided Exploration keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Lesson and Assessment Pages In Guided Exploration, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Guided Exploration works this concrete case: Guided exploration should use a clear what?",
    howItWorks: "Guided exploration leads learners through a sequence of observations.",
    whyItWorks: "Ask learners to predict, test, observe, and explain.",
    worked: [
      { prompt: "Guided exploration should use a clear what?", steps: ["Guided exploration leads learners through a sequence of observations.", "Read the labelled result.", "sequence"], answer: "sequence" },
      { prompt: "A slider from 0 to 60 with step 3: how many steps from 0 to max?", steps: ["60/3.", "20.", "20."], answer: "20" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  644: {
    introduction: "Predict–Test–Explain works this concrete case: In Predict-Test-Explain, what comes before testing? The labelled answer is prediction. Develop reasoning. Records a prediction before revealing model behaviour. A common labelled error is testing first and predicting later. Predict–Test–Explain keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Lesson and Assessment Pages In Predict–Test–Explain, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Predict–Test–Explain works this concrete case: In Predict-Test-Explain, what comes before testing?",
    howItWorks: "Predict-Test-Explain asks learners to guess, check, and explain the result.",
    whyItWorks: "Record the prediction before testing the model.",
    worked: [
      { prompt: "In Predict-Test-Explain, what comes before testing?", steps: ["Predict-Test-Explain asks learners to guess, check, and explain the result.", "Read the labelled result.", "prediction"], answer: "prediction" },
      { prompt: "A slider from 0 to 70 with step 4: how many steps from 0 to max?", steps: ["70/4.", "17.", "17."], answer: "17" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  645: {
    introduction: "Worked Example works this concrete case: A worked example should include steps and what? The labelled answer is reasons. Demonstrate complete solutions. Animates steps with mathematical justification. A common labelled error is showing steps without saying why. Worked Example keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Lesson and Assessment Pages In Worked Example, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Worked Example works this concrete case: A worked example should include steps and what?",
    howItWorks: "A worked example shows a complete solution with clear steps.",
    whyItWorks: "Write each step, reason, and final answer.",
    worked: [
      { prompt: "A worked example should include steps and what?", steps: ["A worked example shows a complete solution with clear steps.", "Read the labelled result.", "reasons"], answer: "reasons" },
      { prompt: "A slider from 0 to 80 with step 5: how many steps from 0 to max?", steps: ["80/5.", "16.", "16."], answer: "16" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  646: {
    introduction: "Step-by-Step Practice works this concrete case: Step-by-step practice checks middle what? The labelled answer is steps. Scaffold procedures. Requires one valid step at a time. A common labelled error is asking only for the final answer. Step-by-Step Practice keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Lesson and Assessment Pages In Step-by-Step Practice, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Step-by-Step Practice works this concrete case: Step-by-step practice checks middle what?",
    howItWorks: "Step-by-step practice breaks a task into small checked actions.",
    whyItWorks: "Ask for one step at a time and give feedback.",
    worked: [
      { prompt: "Step-by-step practice checks middle what?", steps: ["Step-by-step practice breaks a task into small checked actions.", "Read the labelled result.", "steps"], answer: "steps" },
      { prompt: "A slider from 0 to 90 with step 6: how many steps from 0 to max?", steps: ["90/6.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  647: {
    introduction: "Construction Challenge works this concrete case: A construction challenge must state success what? The labelled answer is conditions. Assess geometric competence. Requires a valid construction satisfying conditions. A common labelled error is giving a build task without success conditions. Construction Challenge keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Lesson and Assessment Pages In Construction Challenge, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Construction Challenge works this concrete case: A construction challenge must state success what?",
    howItWorks: "A construction challenge asks learners to build an object that meets conditions.",
    whyItWorks: "State the goal, allowed tools, and success checks.",
    worked: [
      { prompt: "A construction challenge must state success what?", steps: ["A construction challenge asks learners to build an object that meets conditions.", "Read the labelled result.", "conditions"], answer: "conditions" },
      { prompt: "A slider from 0 to 100 with step 7: how many steps from 0 to max?", steps: ["100/7.", "14.", "14."], answer: "14" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  648: {
    introduction: "Graph Matching works this concrete case: What step should error diagnosis find first? The labelled answer is wrong. Connect equations and representations. Matches equations, tables, graphs or transformations. A common labelled error is matching only by rough appearance. Graph Matching keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Graph matching asks learners to make a graph fit a target graph or situation. In Graph Matching, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Graph Matching works this concrete case: What step should error diagnosis find first?",
    howItWorks: "Show the target, let learners change parameters, and compare important features.",
    whyItWorks: "Matching focuses attention on slope, intercepts, shape, and scale.",
    worked: [
      { prompt: "What step should error diagnosis find first?", steps: ["Show the target, let learners change parameters, and compare important features.", "Read the labelled result.", "wrong"], answer: "wrong" },
      { prompt: "A slider from 0 to 30 with step 2: how many steps from 0 to max?", steps: ["30/2.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  649: {
    introduction: "Error Diagnosis works this concrete case: What step should error diagnosis find first? The labelled answer is wrong. Correct misconceptions. Presents plausible incorrect work for analysis. A common labelled error is checking only whether the final answer is wrong. Error Diagnosis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Error diagnosis asks learners to find and correct a mistake. In Error Diagnosis, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Error Diagnosis works this concrete case: What step should error diagnosis find first?",
    howItWorks: "Show the work, ask where the first wrong step appears, and require a correction.",
    whyItWorks: "Finding an error builds deeper understanding than only giving an answer.",
    worked: [
      { prompt: "What step should error diagnosis find first?", steps: ["Show the work, ask where the first wrong step appears, and require a correction.", "Read the labelled result.", "wrong"], answer: "wrong" },
      { prompt: "A slider from 0 to 40 with step 3: how many steps from 0 to max?", steps: ["40/3.", "13.", "13."], answer: "13" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  650: {
    introduction: "Multiple Representations works this concrete case: Multiple representations should show the same what? The labelled answer is idea. Connect mathematical forms. Synchronises symbolic, numerical, graphical and verbal views. A common labelled error is showing forms that do not update together. Multiple Representations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Multiple representations show the same idea in more than one form. In Multiple Representations, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Multiple Representations works this concrete case: Multiple representations should show the same what?",
    howItWorks: "Link a table, graph, equation, diagram, or words so changes agree.",
    whyItWorks: "Seeing the same idea in different forms helps transfer learning.",
    worked: [
      { prompt: "Multiple representations should show the same what?", steps: ["Link a table, graph, equation, diagram, or words so changes agree.", "Read the labelled result.", "idea"], answer: "idea" },
      { prompt: "A slider from 0 to 50 with step 4: how many steps from 0 to max?", steps: ["50/4.", "12.", "12."], answer: "12" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  651: {
    introduction: "Real-World Application works this concrete case: What should real-world variables include? The labelled answer is units. Apply mathematics authentically. Embeds practical contexts and data. A common labelled error is adding a story that does not affect the mathematics. Real-World Application keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A real-world application connects a concept to a realistic situation. In Real-World Application, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Real-World Application works this concrete case: What should real-world variables include?",
    howItWorks: "Define the context, variables, units, and question.",
    whyItWorks: "Applications show why the mathematics is useful outside the lesson.",
    worked: [
      { prompt: "What should real-world variables include?", steps: ["Define the context, variables, units, and question.", "Read the labelled result.", "units"], answer: "units" },
      { prompt: "A slider from 0 to 60 with step 5: how many steps from 0 to max?", steps: ["60/5.", "12.", "12."], answer: "12" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  652: {
    introduction: "Open Investigation works this concrete case: An open investigation needs criteria for what? The labelled answer is explanation. Encourage exploration. Provides goals without fixed procedures. A common labelled error is leaving learners with no way to judge their result. Open Investigation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An open investigation lets learners explore a question with more than one path. In Open Investigation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Open Investigation works this concrete case: An open investigation needs criteria for what?",
    howItWorks: "Give a clear question, useful tools, and criteria for a good explanation.",
    whyItWorks: "Open tasks develop reasoning and communication.",
    worked: [
      { prompt: "An open investigation needs criteria for what?", steps: ["Give a clear question, useful tools, and criteria for a good explanation.", "Read the labelled result.", "explanation"], answer: "explanation" },
      { prompt: "A slider from 0 to 70 with step 6: how many steps from 0 to max?", steps: ["70/6.", "11.", "11."], answer: "11" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  653: {
    introduction: "Dynamic Question Generator works this concrete case: Dynamic questions need constraints to stay what? The labelled answer is valid. Provide repeated practice. Randomises values while preserving learning objectives. A common labelled error is generating values that break the question. Dynamic Question Generator keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A dynamic question generator creates varied questions from rules. In Dynamic Question Generator, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Dynamic Question Generator works this concrete case: Dynamic questions need constraints to stay what?",
    howItWorks: "Set allowed values, answer rules, and checks for invalid cases.",
    whyItWorks: "Generated questions give repeated practice without hand-writing every item.",
    worked: [
      { prompt: "Dynamic questions need constraints to stay what?", steps: ["Set allowed values, answer rules, and checks for invalid cases.", "Read the labelled result.", "valid"], answer: "valid" },
      { prompt: "A slider from 0 to 80 with step 7: how many steps from 0 to max?", steps: ["80/7.", "11.", "11."], answer: "11" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  654: {
    introduction: "Mastery Challenge works this concrete case: Mastery challenges should show independent what? The labelled answer is understanding. Integrate related skills. Combines several concepts in one task. A common labelled error is testing only recall in a mastery task. Mastery Challenge keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A mastery challenge checks whether learners can use a skill independently. In Mastery Challenge, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Mastery Challenge works this concrete case: Mastery challenges should show independent what?",
    howItWorks: "Require the key steps, final answer, and explanation.",
    whyItWorks: "Mastery tasks show readiness to move on.",
    worked: [
      { prompt: "Mastery challenges should show independent what?", steps: ["Require the key steps, final answer, and explanation.", "Read the labelled result.", "understanding"], answer: "understanding" },
      { prompt: "A slider from 0 to 90 with step 2: how many steps from 0 to max?", steps: ["90/2.", "45.", "45."], answer: "45" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  655: {
    introduction: "Exit Ticket works this concrete case: An exit ticket should be short and what? The labelled answer is focused. Check essential understanding. Uses a brief end-of-page assessment. A common labelled error is making the exit ticket a full test. Exit Ticket keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An exit ticket is a short final check at the end of a lesson. In Exit Ticket, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Exit Ticket works this concrete case: An exit ticket should be short and what?",
    howItWorks: "Ask one focused question tied to the lesson objective.",
    whyItWorks: "It helps the teacher see who is ready and who needs help.",
    worked: [
      { prompt: "An exit ticket should be short and what?", steps: ["Ask one focused question tied to the lesson objective.", "Read the labelled result.", "focused"], answer: "focused" },
      { prompt: "A slider from 0 to 100 with step 3: how many steps from 0 to max?", steps: ["100/3.", "33.", "33."], answer: "33" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  656: {
    introduction: "Revision Summary works this concrete case: A revision summary should keep only key what? The labelled answer is ideas. Consolidate key knowledge. Displays formulas, definitions, examples and common errors. A common labelled error is putting the whole lesson into the summary. Revision Summary keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A revision summary collects the key ideas, rules, and common mistakes. In Revision Summary, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Revision Summary works this concrete case: A revision summary should keep only key what?",
    howItWorks: "List the main rule, one example, and one warning.",
    whyItWorks: "Summaries help learners review without rereading the whole lesson.",
    worked: [
      { prompt: "A revision summary should keep only key what?", steps: ["List the main rule, one example, and one warning.", "Read the labelled result.", "ideas"], answer: "ideas" },
      { prompt: "A slider from 0 to 30 with step 4: how many steps from 0 to max?", steps: ["30/4.", "7.", "7."], answer: "7" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  657: {
    introduction: "Drag and Manipulate works this concrete case: Drag and manipulate should support mouse and what? The labelled answer is keyboard. Make mathematics directly interactive. Supports precise dragging of points, graphs and objects. A common labelled error is supporting only mouse dragging. Drag and Manipulate keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Drag and manipulate lets learners move objects directly. In Drag and Manipulate, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Drag and Manipulate works this concrete case: Drag and manipulate should support mouse and what?",
    howItWorks: "Support pointer, touch, and keyboard movement.",
    whyItWorks: "Direct movement helps learners connect action with visible change.",
    worked: [
      { prompt: "Drag and manipulate should support mouse and what?", steps: ["Support pointer, touch, and keyboard movement.", "Read the labelled result.", "keyboard"], answer: "keyboard" },
      { prompt: "A slider from 0 to 40 with step 5: how many steps from 0 to max?", steps: ["40/5.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  658: {
    introduction: "Zoom and Pan works this concrete case: Zoom changes the view or object? The labelled answer is view. Navigate large constructions. Supports touch, mouse and keyboard navigation. A common labelled error is thinking zoom changes the object itself. Zoom and Pan keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Zoom and pan change the visible part of a workspace. In Zoom and Pan, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Zoom and Pan works this concrete case: Zoom changes the view or object?",
    howItWorks: "Keep scale readable and provide a way back to the original view.",
    whyItWorks: "View controls help inspect small details without changing the math object.",
    worked: [
      { prompt: "Zoom changes the view or object?", steps: ["Keep scale readable and provide a way back to the original view.", "Read the labelled result.", "view"], answer: "view" },
      { prompt: "A slider from 0 to 50 with step 6: how many steps from 0 to max?", steps: ["50/6.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  659: {
    introduction: "Reset View works this concrete case: Reset view should restore pan and what? The labelled answer is zoom. Recover standard framing. Returns axes and camera to a default view. A common labelled error is deleting learner work when only the view should reset. Reset View keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Reset view returns the screen to a known camera or layout. In Reset View, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Reset View works this concrete case: Reset view should restore pan and what?",
    howItWorks: "Restore pan, zoom, and focus without changing saved work.",
    whyItWorks: "Learners can recover from getting lost in a workspace.",
    worked: [
      { prompt: "Reset view should restore pan and what?", steps: ["Restore pan, zoom, and focus without changing saved work.", "Read the labelled result.", "zoom"], answer: "zoom" },
      { prompt: "A slider from 0 to 60 with step 7: how many steps from 0 to max?", steps: ["60/7.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  660: {
    introduction: "Undo and Redo works this concrete case: Undo and redo need an action what? The labelled answer is history. Encourage safe experimentation. Maintains an action history. A common labelled error is keeping unclear or unsafe action history. Undo and Redo keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Undo and redo move backward and forward through recent actions. In Undo and Redo, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Undo and Redo works this concrete case: Undo and redo need an action what?",
    howItWorks: "Store a safe action history and update the display after each step.",
    whyItWorks: "History controls let learners fix mistakes without starting over.",
    worked: [
      { prompt: "Undo and redo need an action what?", steps: ["Store a safe action history and update the display after each step.", "Read the labelled result.", "history"], answer: "history" },
      { prompt: "A slider from 0 to 70 with step 2: how many steps from 0 to max?", steps: ["70/2.", "35.", "35."], answer: "35" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  661: {
    introduction: "Animation Player works this concrete case: An animation player needs play and what? The labelled answer is pause. Observe continuous change. Provides play, pause, speed and step controls. A common labelled error is running animation without pause control. Animation Player keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An animation player runs a changing model over time. In Animation Player, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Animation Player works this concrete case: An animation player needs play and what?",
    howItWorks: "Provide play, pause, speed, and reset controls.",
    whyItWorks: "Animation reveals patterns that unfold step by step.",
    worked: [
      { prompt: "An animation player needs play and what?", steps: ["Provide play, pause, speed, and reset controls.", "Read the labelled result.", "pause"], answer: "pause" },
      { prompt: "A slider from 0 to 80 with step 3: how many steps from 0 to max?", steps: ["80/3.", "26.", "26."], answer: "26" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  662: {
    introduction: "Snap Controls works this concrete case: Snap controls help with what? The labelled answer is precision. Improve construction precision. Snaps to grid, points, angles or objects. A common labelled error is snapping objects without telling the learner. Snap Controls keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Snap controls move objects to exact points, grids, or angles. In Snap Controls, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Snap Controls works this concrete case: Snap controls help with what?",
    howItWorks: "Choose snap size and show when snapping is active.",
    whyItWorks: "Snapping improves precision while keeping manipulation easy.",
    worked: [
      { prompt: "Snap controls help with what?", steps: ["Choose snap size and show when snapping is active.", "Read the labelled result.", "precision"], answer: "precision" },
      { prompt: "A slider from 0 to 90 with step 4: how many steps from 0 to max?", steps: ["90/4.", "22.", "22."], answer: "22" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  663: {
    introduction: "Trace and Locus works this concrete case: Trace shows the object's what? The labelled answer is path. Observe motion and dependency. Records paths of moving objects. A common labelled error is confusing the path with the moving object. Trace and Locus keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Trace shows a moving object's path, and locus shows all positions satisfying a condition. In Trace and Locus, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Trace and Locus works this concrete case: Trace shows the object's what?",
    howItWorks: "Record positions as the object moves and explain the condition.",
    whyItWorks: "Paths reveal hidden relationships over motion.",
    worked: [
      { prompt: "Trace shows the object's what?", steps: ["Record positions as the object moves and explain the condition.", "Read the labelled result.", "path"], answer: "path" },
      { prompt: "A slider from 0 to 100 with step 5: how many steps from 0 to max?", steps: ["100/5.", "20.", "20."], answer: "20" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  664: {
    introduction: "Exact and Decimal Output works this concrete case: Rounded decimals should be labelled as what? The labelled answer is approximate. Connect representations. Displays symbolic and approximate answers. A common labelled error is treating a rounded decimal as exact. Exact and Decimal Output keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Exact output preserves symbolic form, while decimal output gives an approximation. In Exact and Decimal Output, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Exact and Decimal Output works this concrete case: Rounded decimals should be labelled as what?",
    howItWorks: "Show which mode is active and round decimals clearly.",
    whyItWorks: "Mode labels prevent learners from confusing exact and approximate answers.",
    worked: [
      { prompt: "Rounded decimals should be labelled as what?", steps: ["Show which mode is active and round decimals clearly.", "Read the labelled result.", "approximate"], answer: "approximate" },
      { prompt: "A slider from 0 to 30 with step 6: how many steps from 0 to max?", steps: ["30/6.", "5.", "5."], answer: "5" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  665: {
    introduction: "Linked Views works this concrete case: Linked views should share one what? The labelled answer is state. Synchronise representations. Keeps algebra, graph, table, CAS and 3D views connected. A common labelled error is letting views show different values. Linked Views keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Linked views show the same object in different panels. In Linked Views, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Linked Views works this concrete case: Linked views should share one what?",
    howItWorks: "Update all views from the same state.",
    whyItWorks: "Linked views connect diagram, graph, table, and algebra without contradictions.",
    worked: [
      { prompt: "Linked views should share one what?", steps: ["Update all views from the same state.", "Read the labelled result.", "state"], answer: "state" },
      { prompt: "A slider from 0 to 40 with step 7: how many steps from 0 to max?", steps: ["40/7.", "5.", "5."], answer: "5" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  666: {
    introduction: "Save, Duplicate and Share works this concrete case: Duplicate protects the original by making a what? The labelled answer is copy. Support continuity and collaboration. Stores activities and creates shareable copies. A common labelled error is editing the original when a copy was needed. Save, Duplicate and Share keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Save stores work, duplicate makes a copy, and share sends access to others. In Save, Duplicate and Share, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Save, Duplicate and Share works this concrete case: Duplicate protects the original by making a what?",
    howItWorks: "Preserve state, title, permissions, and version information.",
    whyItWorks: "These actions help teachers reuse work without losing originals.",
    worked: [
      { prompt: "Duplicate protects the original by making a what?", steps: ["Preserve state, title, permissions, and version information.", "Read the labelled result.", "copy"], answer: "copy" },
      { prompt: "A slider from 0 to 50 with step 2: how many steps from 0 to max?", steps: ["50/2.", "25.", "25."], answer: "25" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  667: {
    introduction: "Export works this concrete case: Export should preserve needed what? The labelled answer is information. Reuse outputs elsewhere. Exports images, SVG, PDF-ready content and data. A common labelled error is exporting only a picture when data is required. Export keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Export saves work into another file or format. In Export, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Export works this concrete case: Export should preserve needed what?",
    howItWorks: "Choose the format and check that important data is included.",
    whyItWorks: "Export lets work move into reports, slides, or other systems.",
    worked: [
      { prompt: "Export should preserve needed what?", steps: ["Choose the format and check that important data is included.", "Read the labelled result.", "information"], answer: "information" },
      { prompt: "A slider from 0 to 60 with step 3: how many steps from 0 to max?", steps: ["60/3.", "20.", "20."], answer: "20" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  668: {
    introduction: "Teacher Presentation Mode works this concrete case: Presentation mode needs large readable what? The labelled answer is controls. Support classroom display. Enlarges controls and hides editing complexity. A common labelled error is using tiny learner controls on a classroom screen. Teacher Presentation Mode keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Teacher presentation mode shows lesson content clearly for a class display. In Teacher Presentation Mode, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Teacher Presentation Mode works this concrete case: Presentation mode needs large readable what?",
    howItWorks: "Use large controls, focused views, and hidden answers until needed.",
    whyItWorks: "Presentation mode supports whole-class explanation and discussion.",
    worked: [
      { prompt: "Presentation mode needs large readable what?", steps: ["Use large controls, focused views, and hidden answers until needed.", "Read the labelled result.", "controls"], answer: "controls" },
      { prompt: "A slider from 0 to 70 with step 4: how many steps from 0 to max?", steps: ["70/4.", "17.", "17."], answer: "17" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  669: {
    introduction: "Learner Practice Mode works this concrete case: Learner practice mode should give useful what? The labelled answer is feedback. Focus on solving. Shows task, workspace, hints and submission. A common labelled error is collecting answers without telling learners what to fix. Learner Practice Mode keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Learner practice mode gives students tasks, attempts, and feedback. In Learner Practice Mode, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Learner Practice Mode works this concrete case: Learner practice mode should give useful what?",
    howItWorks: "Track answers, hints, progress, and next steps.",
    whyItWorks: "Practice mode supports independent learning with feedback.",
    worked: [
      { prompt: "Learner practice mode should give useful what?", steps: ["Track answers, hints, progress, and next steps.", "Read the labelled result.", "feedback"], answer: "feedback" },
      { prompt: "A slider from 0 to 80 with step 5: how many steps from 0 to max?", steps: ["80/5.", "16.", "16."], answer: "16" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  670: {
    introduction: "Exam Mode works this concrete case: Exam mode should follow assessment what? The labelled answer is rules. Provide restricted calculator access. Disables external communication and records exam status. A common labelled error is leaving hints enabled during an exam. Exam Mode keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Exam mode limits tools so assessment conditions are fair. In Exam Mode, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Exam Mode works this concrete case: Exam mode should follow assessment what?",
    howItWorks: "Disable hints, sharing, and unrelated aids according to rules.",
    whyItWorks: "Controlled conditions help make results comparable.",
    worked: [
      { prompt: "Exam mode should follow assessment what?", steps: ["Disable hints, sharing, and unrelated aids according to rules.", "Read the labelled result.", "rules"], answer: "rules" },
      { prompt: "A slider from 0 to 90 with step 6: how many steps from 0 to max?", steps: ["90/6.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  671: {
    introduction: "Keyboard Navigation works this concrete case: Keyboard navigation needs visible what? The labelled answer is focus. Ensure non-pointer access. Provides shortcuts and focus order. A common labelled error is making controls keyboard reachable but not visibly focused. Keyboard Navigation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Keyboard navigation lets learners use the interface without a mouse. In Keyboard Navigation, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Keyboard Navigation works this concrete case: Keyboard navigation needs visible what?",
    howItWorks: "Provide tab order, focus styles, and arrow-key actions.",
    whyItWorks: "Keyboard support is essential for accessibility and precision.",
    worked: [
      { prompt: "Keyboard navigation needs visible what?", steps: ["Provide tab order, focus styles, and arrow-key actions.", "Read the labelled result.", "focus"], answer: "focus" },
      { prompt: "A slider from 0 to 100 with step 7: how many steps from 0 to max?", steps: ["100/7.", "14.", "14."], answer: "14" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  672: {
    introduction: "Screen Reader Support works this concrete case: Screen reader support needs meaningful what? The labelled answer is labels. Improve accessibility. Labels objects, controls and equations. A common labelled error is putting important feedback only in colour or position. Screen Reader Support keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Screen reader support gives meaningful spoken text for interface elements. In Screen Reader Support, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Screen Reader Support works this concrete case: Screen reader support needs meaningful what?",
    howItWorks: "Use labels, roles, live text, and clear descriptions.",
    whyItWorks: "It lets learners who cannot see the screen understand and operate the lesson.",
    worked: [
      { prompt: "Screen reader support needs meaningful what?", steps: ["Use labels, roles, live text, and clear descriptions.", "Read the labelled result.", "labels"], answer: "labels" },
      { prompt: "A slider from 0 to 30 with step 2: how many steps from 0 to max?", steps: ["30/2.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  673: {
    introduction: "High Contrast and Large Text works this concrete case: High contrast improves what? The labelled answer is readability. Support visual accessibility. Offers accessible themes and scalable text. A common labelled error is using colour alone to show meaning. High Contrast and Large Text keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "High contrast and large text improve readability. In High Contrast and Large Text, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "High Contrast and Large Text works this concrete case: High contrast improves what?",
    howItWorks: "Keep colour contrast strong and allow text to scale without overlap.",
    whyItWorks: "Readable displays help many learners, including low-vision users.",
    worked: [
      { prompt: "High contrast improves what?", steps: ["Keep colour contrast strong and allow text to scale without overlap.", "Read the labelled result.", "readability"], answer: "readability" },
      { prompt: "A slider from 0 to 40 with step 3: how many steps from 0 to max?", steps: ["40/3.", "13.", "13."], answer: "13" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  674: {
    introduction: "Multi-Language Terminology works this concrete case: Multi-language terms must keep the same what? The labelled answer is meaning. Support broad curricula. Localises instructions and mathematical vocabulary. A common labelled error is translating words without checking mathematical meaning. Multi-Language Terminology keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Multi-language terminology shows important terms in more than one language. In Multi-Language Terminology, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Multi-Language Terminology works this concrete case: Multi-language terms must keep the same what?",
    howItWorks: "Keep the mathematical meaning stable across translations.",
    whyItWorks: "Clear terminology helps learners connect home language and school language.",
    worked: [
      { prompt: "Multi-language terms must keep the same what?", steps: ["Keep the mathematical meaning stable across translations.", "Read the labelled result.", "meaning"], answer: "meaning" },
      { prompt: "A slider from 0 to 50 with step 4: how many steps from 0 to max?", steps: ["50/4.", "12.", "12."], answer: "12" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" }
    ],
  },
  10001: {
    introduction: "Place Value Explorer works this concrete case: What is the value of the hundreds digit in 4791? The labelled answer is 700. Place Value Explorer fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Place Value Explorer fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Place Value Explorer rule. Place Value Explorer keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Place Value Explorer is the Numbers and Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Place Value Explorer works this concrete case: What is the value of the hundreds digit in 4791?",
    howItWorks: "Read the Place Value Explorer inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Place Value Explorer works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "What is the value of the hundreds digit in 4791?", steps: ["The hundreds digit is 7.", "7 hundreds = 700.", "700."], answer: "700" },
      { prompt: "Write 4 thousands + 7 hundreds + 9 tens + 1 one as a number.", steps: ["4*1000 + 7*100 + 9*10 + 1.", "4791.", "4791."], answer: "4791" },
      { prompt: "Does the digit 4 always mean four ones?", steps: ["Place decides value.", "4 in tens is 40.", "No."], answer: "no" }
    ],
  },
  10002: {
    introduction: "Indian and International Number Naming Systems works this concrete case: In Indian and International Number Naming Systems, evaluate the labelled model at input 5. The labelled answer is 10. Indian and International Number Naming Systems fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Indian and International Number Naming Systems fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Indian and International Number Naming Systems rule. Indian and International Number Naming Systems keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Indian and International Number Naming Systems is the Numbers and Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Indian and International Number Naming Systems works this concrete case: In Indian and International Number Naming Systems, evaluate the labelled model at input 5.",
    howItWorks: "Read the Indian and International Number Naming Systems inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Indian and International Number Naming Systems works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Indian and International Number Naming Systems, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Indian and International Number Naming Systems rule.", "The first stored value is 10.", "10."], answer: "10" },
      { prompt: "Compare the Indian and International Number Naming Systems outputs at 5 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Indian and International Number Naming Systems restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10003: {
    introduction: "Estimation and Rounding Lab works this concrete case: In Estimation and Rounding Lab, evaluate the labelled model at input 6. The labelled answer is 18. Estimation and Rounding Lab fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Estimation and Rounding Lab fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Estimation and Rounding Lab rule. Estimation and Rounding Lab keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Estimation and Rounding Lab is the Numbers and Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Estimation and Rounding Lab works this concrete case: In Estimation and Rounding Lab, evaluate the labelled model at input 6.",
    howItWorks: "Read the Estimation and Rounding Lab inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Estimation and Rounding Lab works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Estimation and Rounding Lab, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Estimation and Rounding Lab rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Estimation and Rounding Lab outputs at 6 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Estimation and Rounding Lab restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10004: {
    introduction: "Approximation and Error Bounds works this concrete case: In Approximation and Error Bounds, evaluate the labelled model at input 7. The labelled answer is 28. Approximation and Error Bounds fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Approximation and Error Bounds fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Approximation and Error Bounds rule. Approximation and Error Bounds keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Approximation and Error Bounds is the Numbers and Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Approximation and Error Bounds works this concrete case: In Approximation and Error Bounds, evaluate the labelled model at input 7.",
    howItWorks: "Read the Approximation and Error Bounds inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Approximation and Error Bounds works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Approximation and Error Bounds, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Approximation and Error Bounds rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Approximation and Error Bounds outputs at 7 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Approximation and Error Bounds restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10005: {
    introduction: "Mixed Units and Unit Conversion works this concrete case: In Mixed Units and Unit Conversion, evaluate the labelled model at input 8. The labelled answer is 40. Mixed Units and Unit Conversion fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Mixed Units and Unit Conversion fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Mixed Units and Unit Conversion rule. Mixed Units and Unit Conversion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Mixed Units and Unit Conversion is the Numbers and Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Mixed Units and Unit Conversion works this concrete case: In Mixed Units and Unit Conversion, evaluate the labelled model at input 8.",
    howItWorks: "Read the Mixed Units and Unit Conversion inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Mixed Units and Unit Conversion works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Mixed Units and Unit Conversion, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Mixed Units and Unit Conversion rule.", "The first stored value is 40.", "40."], answer: "40" },
      { prompt: "Compare the Mixed Units and Unit Conversion outputs at 8 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Mixed Units and Unit Conversion restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10006: {
    introduction: "Pictograph Builder works this concrete case: In Pictograph Builder, evaluate the labelled model at input 9. The labelled answer is 54. Pictograph Builder fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Pictograph Builder fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Pictograph Builder rule. Pictograph Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Pictograph Builder is the Data Handling rule that produces one labelled numerical result from the given inputs. In Pictograph Builder, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Pictograph Builder works this concrete case: In Pictograph Builder, evaluate the labelled model at input 9.",
    howItWorks: "Read the Pictograph Builder inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Pictograph Builder works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Pictograph Builder, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Pictograph Builder rule.", "The first stored value is 54.", "54."], answer: "54" },
      { prompt: "Compare the Pictograph Builder outputs at 9 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Pictograph Builder restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10007: {
    introduction: "Bar Graph Builder works this concrete case: In Bar Graph Builder, evaluate the labelled model at input 10. The labelled answer is 70. Bar Graph Builder fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Bar Graph Builder fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Bar Graph Builder rule. Bar Graph Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Bar Graph Builder is the Data Handling rule that produces one labelled numerical result from the given inputs. In Bar Graph Builder, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Bar Graph Builder works this concrete case: In Bar Graph Builder, evaluate the labelled model at input 10.",
    howItWorks: "Read the Bar Graph Builder inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Bar Graph Builder works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Bar Graph Builder, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Bar Graph Builder rule.", "The first stored value is 70.", "70."], answer: "70" },
      { prompt: "Compare the Bar Graph Builder outputs at 10 and 17. What is the difference?", steps: ["Second input 17.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Bar Graph Builder restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10008: {
    introduction: "Survey to Frequency Table works this concrete case: In Survey to Frequency Table, evaluate the labelled model at input 3. The labelled answer is 6. Survey to Frequency Table fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Survey to Frequency Table fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Survey to Frequency Table rule. Survey to Frequency Table keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Survey to Frequency Table is the Data Handling rule that produces one labelled numerical result from the given inputs. In Survey to Frequency Table, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Survey to Frequency Table works this concrete case: In Survey to Frequency Table, evaluate the labelled model at input 3.",
    howItWorks: "Read the Survey to Frequency Table inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Survey to Frequency Table works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Survey to Frequency Table, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Survey to Frequency Table rule.", "The first stored value is 6.", "6."], answer: "6" },
      { prompt: "Compare the Survey to Frequency Table outputs at 3 and 5. What is the difference?", steps: ["Second input 5.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Survey to Frequency Table restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10009: {
    introduction: "Misleading Graph Detection works this concrete case: In Misleading Graph Detection, evaluate the labelled model at input 4. The labelled answer is 12. Misleading Graph Detection fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Misleading Graph Detection fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Misleading Graph Detection rule. Misleading Graph Detection keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Misleading Graph Detection is the Data Handling rule that produces one labelled numerical result from the given inputs. In Misleading Graph Detection, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Misleading Graph Detection works this concrete case: In Misleading Graph Detection, evaluate the labelled model at input 4.",
    howItWorks: "Read the Misleading Graph Detection inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Misleading Graph Detection works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Misleading Graph Detection, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Misleading Graph Detection rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Misleading Graph Detection outputs at 4 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Misleading Graph Detection restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10010: {
    introduction: "Number Pattern Completion works this concrete case: In Number Pattern Completion, evaluate the labelled model at input 5. The labelled answer is 20. Number Pattern Completion fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Number Pattern Completion fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Number Pattern Completion rule. Number Pattern Completion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Number Pattern Completion is the Patterns rule that produces one labelled numerical result from the given inputs. In Number Pattern Completion, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Number Pattern Completion works this concrete case: In Number Pattern Completion, evaluate the labelled model at input 5.",
    howItWorks: "Read the Number Pattern Completion inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Number Pattern Completion works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Number Pattern Completion, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Number Pattern Completion rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Number Pattern Completion outputs at 5 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Number Pattern Completion restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10011: {
    introduction: "Shape Pattern Completion works this concrete case: In Shape Pattern Completion, evaluate the labelled model at input 6. The labelled answer is 30. Shape Pattern Completion fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Shape Pattern Completion fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Shape Pattern Completion rule. Shape Pattern Completion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Shape Pattern Completion is the Patterns rule that produces one labelled numerical result from the given inputs. In Shape Pattern Completion, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Shape Pattern Completion works this concrete case: In Shape Pattern Completion, evaluate the labelled model at input 6.",
    howItWorks: "Read the Shape Pattern Completion inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Shape Pattern Completion works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Shape Pattern Completion, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Shape Pattern Completion rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Shape Pattern Completion outputs at 6 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Shape Pattern Completion restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10012: {
    introduction: "Input-Output Rule Machines works this concrete case: In Input-Output Rule Machines, evaluate the labelled model at input 7. The labelled answer is 42. Input-Output Rule Machines fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Input-Output Rule Machines fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Input-Output Rule Machines rule. Input-Output Rule Machines keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Input-Output Rule Machines is the Patterns rule that produces one labelled numerical result from the given inputs. In Input-Output Rule Machines, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Input-Output Rule Machines works this concrete case: In Input-Output Rule Machines, evaluate the labelled model at input 7.",
    howItWorks: "Read the Input-Output Rule Machines inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Input-Output Rule Machines works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Input-Output Rule Machines, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Input-Output Rule Machines rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Input-Output Rule Machines outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Input-Output Rule Machines restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10013: {
    introduction: "Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 works this concrete case: In Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11, evaluate the labelled model at input 8. The labelled answer is 56. Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 rule. Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 is the Numbers and Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 works this concrete case: In Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11, evaluate the labelled model at input 8.",
    howItWorks: "Read the Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 rule.", "The first stored value is 56.", "56."], answer: "56" },
      { prompt: "Compare the Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 outputs at 8 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10014: {
    introduction: "Digital Root and Divisibility works this concrete case: In Digital Root and Divisibility, evaluate the labelled model at input 9. The labelled answer is 18. Digital Root and Divisibility fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Digital Root and Divisibility fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Digital Root and Divisibility rule. Digital Root and Divisibility keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Digital Root and Divisibility is the Numbers and Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Digital Root and Divisibility works this concrete case: In Digital Root and Divisibility, evaluate the labelled model at input 9.",
    howItWorks: "Read the Digital Root and Divisibility inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Digital Root and Divisibility works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Digital Root and Divisibility, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Digital Root and Divisibility rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Digital Root and Divisibility outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Digital Root and Divisibility restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10015: {
    introduction: "Remainder Reasoning works this concrete case: In Remainder Reasoning, evaluate the labelled model at input 10. The labelled answer is 30. Remainder Reasoning fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Remainder Reasoning fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Remainder Reasoning rule. Remainder Reasoning keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Remainder Reasoning is the Numbers and Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Remainder Reasoning works this concrete case: In Remainder Reasoning, evaluate the labelled model at input 10.",
    howItWorks: "Read the Remainder Reasoning inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Remainder Reasoning works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Remainder Reasoning, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Remainder Reasoning rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Remainder Reasoning outputs at 10 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Remainder Reasoning restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10016: {
    introduction: "Unit Rate Table Lab works this concrete case: In Unit Rate Table Lab, evaluate the labelled model at input 3. The labelled answer is 12. Unit Rate Table Lab fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Unit Rate Table Lab fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Unit Rate Table Lab rule. Unit Rate Table Lab keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Unit Rate Table Lab is the Numbers and Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Unit Rate Table Lab works this concrete case: In Unit Rate Table Lab, evaluate the labelled model at input 3.",
    howItWorks: "Read the Unit Rate Table Lab inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Unit Rate Table Lab works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Unit Rate Table Lab, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Unit Rate Table Lab rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Unit Rate Table Lab outputs at 3 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Unit Rate Table Lab restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10017: {
    introduction: "Ratio Tables works this concrete case: In Ratio Tables, evaluate the labelled model at input 4. The labelled answer is 20. Ratio Tables fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Ratio Tables fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Ratio Tables rule. Ratio Tables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Ratio Tables is the Numbers and Arithmetic rule that produces one labelled numerical result from the given inputs. In Ratio Tables, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Ratio Tables works this concrete case: In Ratio Tables, evaluate the labelled model at input 4.",
    howItWorks: "Read the Ratio Tables inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Ratio Tables works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Ratio Tables, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Ratio Tables rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Ratio Tables outputs at 4 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Ratio Tables restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10018: {
    introduction: "Bills, Discounts and Tax works this concrete case: In Bills, Discounts and Tax, evaluate the labelled model at input 5. The labelled answer is 30. Bills, Discounts and Tax fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Bills, Discounts and Tax fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Bills, Discounts and Tax rule. Bills, Discounts and Tax keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Bills, Discounts and Tax is the Applied Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Bills, Discounts and Tax works this concrete case: In Bills, Discounts and Tax, evaluate the labelled model at input 5.",
    howItWorks: "Read the Bills, Discounts and Tax inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Bills, Discounts and Tax works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Bills, Discounts and Tax, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Bills, Discounts and Tax rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Bills, Discounts and Tax outputs at 5 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Bills, Discounts and Tax restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10019: {
    introduction: "Profit, Loss and Marked Price works this concrete case: In Profit, Loss and Marked Price, evaluate the labelled model at input 6. The labelled answer is 42. Profit, Loss and Marked Price fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Profit, Loss and Marked Price fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Profit, Loss and Marked Price rule. Profit, Loss and Marked Price keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Profit, Loss and Marked Price is the Applied Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Profit, Loss and Marked Price works this concrete case: In Profit, Loss and Marked Price, evaluate the labelled model at input 6.",
    howItWorks: "Read the Profit, Loss and Marked Price inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Profit, Loss and Marked Price works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Profit, Loss and Marked Price, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Profit, Loss and Marked Price rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Profit, Loss and Marked Price outputs at 6 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Profit, Loss and Marked Price restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10020: {
    introduction: "Household Budget Arithmetic works this concrete case: In Household Budget Arithmetic, evaluate the labelled model at input 7. The labelled answer is 14. Household Budget Arithmetic fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Household Budget Arithmetic fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Household Budget Arithmetic rule. Household Budget Arithmetic keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Household Budget Arithmetic is the Applied Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Household Budget Arithmetic works this concrete case: In Household Budget Arithmetic, evaluate the labelled model at input 7.",
    howItWorks: "Read the Household Budget Arithmetic inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Household Budget Arithmetic works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Household Budget Arithmetic, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Household Budget Arithmetic rule.", "The first stored value is 14.", "14."], answer: "14" },
      { prompt: "Compare the Household Budget Arithmetic outputs at 7 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Household Budget Arithmetic restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10021: {
    introduction: "Scale Factor in Maps and Recipes works this concrete case: Solve 3x = 24. The labelled answer is 8. Scale Factor in Maps and Recipes fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Scale Factor in Maps and Recipes fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Scale Factor in Maps and Recipes rule. Scale Factor in Maps and Recipes keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Scale Factor in Maps and Recipes is the Applied Arithmetic rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Scale Factor in Maps and Recipes works this concrete case: Solve 3x = 24.",
    howItWorks: "Read the Scale Factor in Maps and Recipes inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Scale Factor in Maps and Recipes works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Solve 3x = 24.", steps: ["Divide by 3.", "x=8.", "8."], answer: "8" },
      { prompt: "Expand 3(x+8).", steps: ["3x+24.", "3x+24.", "3x+24."], answer: "3x+24" },
      { prompt: "Is x=8 a root of (x-8)(x-8)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10022: {
    introduction: "Copying a Line Segment works this concrete case: In Copying a Line Segment, evaluate the labelled model at input 9. The labelled answer is 36. Copying a Line Segment fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Copying a Line Segment fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Copying a Line Segment rule. Copying a Line Segment keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Copying a Line Segment is the Practical Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Copying a Line Segment works this concrete case: In Copying a Line Segment, evaluate the labelled model at input 9.",
    howItWorks: "Read the Copying a Line Segment inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Copying a Line Segment works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Copying a Line Segment, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Copying a Line Segment rule.", "The first stored value is 36.", "36."], answer: "36" },
      { prompt: "Compare the Copying a Line Segment outputs at 9 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Copying a Line Segment restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10023: {
    introduction: "Copying an Angle works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Copying an Angle fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Copying an Angle fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Copying an Angle rule. Copying an Angle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Copying an Angle is the Practical Geometry rule that produces one labelled numerical result from the given inputs. In Copying an Angle, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Copying an Angle works this concrete case: A right angle is what fraction of a 360° turn?",
    howItWorks: "Read the Copying an Angle inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Copying an Angle works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 100° and 50°. What is the sum?", steps: ["100+50.", "150.", "150."], answer: "150" },
      { prompt: "Do longer rays make a larger angle?", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10024: {
    introduction: "Perpendicular Bisector Construction works this concrete case: In Perpendicular Bisector Construction, evaluate the labelled model at input 3. The labelled answer is 18. Perpendicular Bisector Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Perpendicular Bisector Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Perpendicular Bisector Construction rule. Perpendicular Bisector Construction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Perpendicular Bisector Construction is the Practical Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Perpendicular Bisector Construction works this concrete case: In Perpendicular Bisector Construction, evaluate the labelled model at input 3.",
    howItWorks: "Read the Perpendicular Bisector Construction inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Perpendicular Bisector Construction works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Perpendicular Bisector Construction, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Perpendicular Bisector Construction rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Perpendicular Bisector Construction outputs at 3 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Perpendicular Bisector Construction restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10025: {
    introduction: "Angle Bisector Construction works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Angle Bisector Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Angle Bisector Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Angle Bisector Construction rule. Angle Bisector Construction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Angle Bisector Construction is the Practical Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Angle Bisector Construction works this concrete case: A right angle is what fraction of a 360° turn?",
    howItWorks: "Read the Angle Bisector Construction inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Angle Bisector Construction works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 40° and 70°. What is the sum?", steps: ["40+70.", "110.", "110."], answer: "110" },
      { prompt: "Do longer rays make a larger angle?", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10026: {
    introduction: "Perpendicular Through a Point works this concrete case: In Perpendicular Through a Point, evaluate the labelled model at input 5. The labelled answer is 10. Perpendicular Through a Point fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Perpendicular Through a Point fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Perpendicular Through a Point rule. Perpendicular Through a Point keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Perpendicular Through a Point is the Practical Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Perpendicular Through a Point works this concrete case: In Perpendicular Through a Point, evaluate the labelled model at input 5.",
    howItWorks: "Read the Perpendicular Through a Point inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Perpendicular Through a Point works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Perpendicular Through a Point, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Perpendicular Through a Point rule.", "The first stored value is 10.", "10."], answer: "10" },
      { prompt: "Compare the Perpendicular Through a Point outputs at 5 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Perpendicular Through a Point restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10027: {
    introduction: "Parallel Line Construction works this concrete case: In Parallel Line Construction, evaluate the labelled model at input 6. The labelled answer is 18. Parallel Line Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Parallel Line Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Parallel Line Construction rule. Parallel Line Construction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Parallel Line Construction is the Practical Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Parallel Line Construction works this concrete case: In Parallel Line Construction, evaluate the labelled model at input 6.",
    howItWorks: "Read the Parallel Line Construction inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Parallel Line Construction works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Parallel Line Construction, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Parallel Line Construction rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Parallel Line Construction outputs at 6 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Parallel Line Construction restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10028: {
    introduction: "Triangle Construction by SSS works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Triangle Construction by SSS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Triangle Construction by SSS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Triangle Construction by SSS rule. Triangle Construction by SSS keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Triangle Construction by SSS is the Practical Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Triangle Construction by SSS works this concrete case: A right angle is what fraction of a 360° turn?",
    howItWorks: "Read the Triangle Construction by SSS inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Triangle Construction by SSS works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 70° and 40°. What is the sum?", steps: ["70+40.", "110.", "110."], answer: "110" },
      { prompt: "Do longer rays make a larger angle?", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10029: {
    introduction: "Triangle Construction by SAS works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Triangle Construction by SAS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Triangle Construction by SAS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Triangle Construction by SAS rule. Triangle Construction by SAS keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Triangle Construction by SAS is the Practical Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Triangle Construction by SAS works this concrete case: A right angle is what fraction of a 360° turn?",
    howItWorks: "Read the Triangle Construction by SAS inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Triangle Construction by SAS works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 80° and 50°. What is the sum?", steps: ["80+50.", "130.", "130."], answer: "130" },
      { prompt: "Do longer rays make a larger angle?", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10030: {
    introduction: "Triangle Construction by ASA works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Triangle Construction by ASA fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Triangle Construction by ASA fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Triangle Construction by ASA rule. Triangle Construction by ASA keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Triangle Construction by ASA is the Practical Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Triangle Construction by ASA works this concrete case: A right angle is what fraction of a 360° turn?",
    howItWorks: "Read the Triangle Construction by ASA inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Triangle Construction by ASA works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 90° and 60°. What is the sum?", steps: ["90+60.", "150.", "150."], answer: "150" },
      { prompt: "Do longer rays make a larger angle?", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10031: {
    introduction: "Right Triangle Construction by RHS works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Right Triangle Construction by RHS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Right Triangle Construction by RHS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Right Triangle Construction by RHS rule. Right Triangle Construction by RHS keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Right Triangle Construction by RHS is the Practical Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Right Triangle Construction by RHS works this concrete case: A right angle is what fraction of a 360° turn?",
    howItWorks: "Read the Right Triangle Construction by RHS inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Right Triangle Construction by RHS works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 100° and 70°. What is the sum?", steps: ["100+70.", "170.", "170."], answer: "170" },
      { prompt: "Do longer rays make a larger angle?", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  10032: {
    introduction: "Double Bar Graph Comparison works this concrete case: In Double Bar Graph Comparison, evaluate the labelled model at input 3. The labelled answer is 6. Double Bar Graph Comparison fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Double Bar Graph Comparison fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Double Bar Graph Comparison rule. Double Bar Graph Comparison keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Double Bar Graph Comparison is the Data Handling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Double Bar Graph Comparison works this concrete case: In Double Bar Graph Comparison, evaluate the labelled model at input 3.",
    howItWorks: "Read the Double Bar Graph Comparison inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Double Bar Graph Comparison works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Double Bar Graph Comparison, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Double Bar Graph Comparison rule.", "The first stored value is 6.", "6."], answer: "6" },
      { prompt: "Compare the Double Bar Graph Comparison outputs at 3 and 5. What is the difference?", steps: ["Second input 5.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Double Bar Graph Comparison restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10033: {
    introduction: "Mean Median and Mode Practice Path works this concrete case: Find the mean of 4, 3, 6, 5. The labelled answer is 4.5. Mean Median and Mode Practice Path fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Mean Median and Mode Practice Path fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Mean Median and Mode Practice Path rule. Mean Median and Mode Practice Path keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Mean Median and Mode Practice Path is the Data Handling rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Mean Median and Mode Practice Path works this concrete case: Find the mean of 4, 3, 6, 5.",
    howItWorks: "Read the Mean Median and Mode Practice Path inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Mean Median and Mode Practice Path works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find the mean of 4, 3, 6, 5.", steps: ["Sum=18.", "Count=4.", "4.5."], answer: "4.5" },
      { prompt: "If one value increases by 3, how does the mean change?", steps: ["The total rises by 3.", "Mean rises by 3/4.", "0.75."], answer: "0.75" },
      { prompt: "Must the mean be one of the data values?", steps: ["The mean is a balance point.", "It can sit between values.", "No."], answer: "no" }
    ],
  },
  10034: {
    introduction: "Range and Spread Explorer works this concrete case: In Range and Spread Explorer, evaluate the labelled model at input 5. The labelled answer is 20. Range and Spread Explorer fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Range and Spread Explorer fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Range and Spread Explorer rule. Range and Spread Explorer keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Range and Spread Explorer is the Data Handling rule that produces one labelled numerical result from the given inputs. In Range and Spread Explorer, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Range and Spread Explorer works this concrete case: In Range and Spread Explorer, evaluate the labelled model at input 5.",
    howItWorks: "Read the Range and Spread Explorer inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Range and Spread Explorer works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Range and Spread Explorer, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Range and Spread Explorer rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Range and Spread Explorer outputs at 5 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Range and Spread Explorer restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10035: {
    introduction: "Flowchart Logic works this concrete case: In Flowchart Logic, evaluate the labelled model at input 6. The labelled answer is 30. Flowchart Logic fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Flowchart Logic fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Flowchart Logic rule. Flowchart Logic keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Flowchart Logic is the Information Processing rule that produces one labelled numerical result from the given inputs. In Flowchart Logic, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Flowchart Logic works this concrete case: In Flowchart Logic, evaluate the labelled model at input 6.",
    howItWorks: "Read the Flowchart Logic inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Flowchart Logic works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Flowchart Logic, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Flowchart Logic rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Flowchart Logic outputs at 6 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Flowchart Logic restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10036: {
    introduction: "Pattern Encoding works this concrete case: In Pattern Encoding, evaluate the labelled model at input 7. The labelled answer is 42. Pattern Encoding fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Pattern Encoding fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Pattern Encoding rule. Pattern Encoding keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Pattern Encoding is the Information Processing rule that produces one labelled numerical result from the given inputs. In Pattern Encoding, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Pattern Encoding works this concrete case: In Pattern Encoding, evaluate the labelled model at input 7.",
    howItWorks: "Read the Pattern Encoding inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Pattern Encoding works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Pattern Encoding, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Pattern Encoding rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Pattern Encoding outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Pattern Encoding restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10037: {
    introduction: "Magic Squares works this concrete case: In Magic Squares, evaluate the labelled model at input 8. The labelled answer is 56. Magic Squares fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Magic Squares fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Magic Squares rule. Magic Squares keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Magic Squares is the Information Processing rule that produces one labelled numerical result from the given inputs. In Magic Squares, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Magic Squares works this concrete case: In Magic Squares, evaluate the labelled model at input 8.",
    howItWorks: "Read the Magic Squares inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Magic Squares works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Magic Squares, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Magic Squares rule.", "The first stored value is 56.", "56."], answer: "56" },
      { prompt: "Compare the Magic Squares outputs at 8 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Magic Squares restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10038: {
    introduction: "Route Map Reasoning works this concrete case: In Route Map Reasoning, evaluate the labelled model at input 9. The labelled answer is 18. Route Map Reasoning fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Route Map Reasoning fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Route Map Reasoning rule. Route Map Reasoning keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Route Map Reasoning is the Information Processing rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Route Map Reasoning works this concrete case: In Route Map Reasoning, evaluate the labelled model at input 9.",
    howItWorks: "Read the Route Map Reasoning inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Route Map Reasoning works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Route Map Reasoning, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Route Map Reasoning rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Route Map Reasoning outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Route Map Reasoning restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10039: {
    introduction: "Tabular Pattern Completion works this concrete case: In Tabular Pattern Completion, evaluate the labelled model at input 10. The labelled answer is 30. Tabular Pattern Completion fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Tabular Pattern Completion fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Tabular Pattern Completion rule. Tabular Pattern Completion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Tabular Pattern Completion is the Information Processing rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Tabular Pattern Completion works this concrete case: In Tabular Pattern Completion, evaluate the labelled model at input 10.",
    howItWorks: "Read the Tabular Pattern Completion inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Tabular Pattern Completion works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Tabular Pattern Completion, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Tabular Pattern Completion rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Tabular Pattern Completion outputs at 10 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Tabular Pattern Completion restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10040: {
    introduction: "Decimal Expansion of Rational Numbers works this concrete case: In Decimal Expansion of Rational Numbers, evaluate the labelled model at input 3. The labelled answer is 12. Decimal Expansion of Rational Numbers fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Decimal Expansion of Rational Numbers fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Decimal Expansion of Rational Numbers rule. Decimal Expansion of Rational Numbers keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Decimal Expansion of Rational Numbers is the Real Numbers rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Decimal Expansion of Rational Numbers works this concrete case: In Decimal Expansion of Rational Numbers, evaluate the labelled model at input 3.",
    howItWorks: "Read the Decimal Expansion of Rational Numbers inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Decimal Expansion of Rational Numbers works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Decimal Expansion of Rational Numbers, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Decimal Expansion of Rational Numbers rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Decimal Expansion of Rational Numbers outputs at 3 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Decimal Expansion of Rational Numbers restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10041: {
    introduction: "Terminating and Non-Terminating Decimals works this concrete case: In Terminating and Non-Terminating Decimals, evaluate the labelled model at input 4. The labelled answer is 20. Terminating and Non-Terminating Decimals fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Terminating and Non-Terminating Decimals fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Terminating and Non-Terminating Decimals rule. Terminating and Non-Terminating Decimals keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Terminating and Non-Terminating Decimals is the Real Numbers rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Terminating and Non-Terminating Decimals works this concrete case: In Terminating and Non-Terminating Decimals, evaluate the labelled model at input 4.",
    howItWorks: "Read the Terminating and Non-Terminating Decimals inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Terminating and Non-Terminating Decimals works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Terminating and Non-Terminating Decimals, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Terminating and Non-Terminating Decimals rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Terminating and Non-Terminating Decimals outputs at 4 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Terminating and Non-Terminating Decimals restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10042: {
    introduction: "Rational and Irrational Classification works this concrete case: In Rational and Irrational Classification, evaluate the labelled model at input 5. The labelled answer is 30. Rational and Irrational Classification fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Rational and Irrational Classification fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Rational and Irrational Classification rule. Rational and Irrational Classification keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Rational and Irrational Classification is the Real Numbers rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Rational and Irrational Classification works this concrete case: In Rational and Irrational Classification, evaluate the labelled model at input 5.",
    howItWorks: "Read the Rational and Irrational Classification inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Rational and Irrational Classification works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Rational and Irrational Classification, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Rational and Irrational Classification rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Rational and Irrational Classification outputs at 5 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Rational and Irrational Classification restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10043: {
    introduction: "Successive Magnification on the Number Line works this concrete case: In Successive Magnification on the Number Line, evaluate the labelled model at input 6. The labelled answer is 42. Successive Magnification on the Number Line fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Successive Magnification on the Number Line fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Successive Magnification on the Number Line rule. Successive Magnification on the Number Line keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Successive Magnification on the Number Line is the Real Numbers rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Successive Magnification on the Number Line works this concrete case: In Successive Magnification on the Number Line, evaluate the labelled model at input 6.",
    howItWorks: "Read the Successive Magnification on the Number Line inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Successive Magnification on the Number Line works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Successive Magnification on the Number Line, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Successive Magnification on the Number Line rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Successive Magnification on the Number Line outputs at 6 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Successive Magnification on the Number Line restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10044: {
    introduction: "Rationalisation of Denominators works this concrete case: In Rationalisation of Denominators, evaluate the labelled model at input 7. The labelled answer is 14. Rationalisation of Denominators fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Rationalisation of Denominators fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Rationalisation of Denominators rule. Rationalisation of Denominators keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Rationalisation of Denominators is the Real Numbers rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Rationalisation of Denominators works this concrete case: In Rationalisation of Denominators, evaluate the labelled model at input 7.",
    howItWorks: "Read the Rationalisation of Denominators inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Rationalisation of Denominators works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Rationalisation of Denominators, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Rationalisation of Denominators rule.", "The first stored value is 14.", "14."], answer: "14" },
      { prompt: "Compare the Rationalisation of Denominators outputs at 7 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Rationalisation of Denominators restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10045: {
    introduction: "nth Roots and Radical Meaning works this concrete case: Find the mean of 8, 3, 4, 9. The labelled answer is 6. nth Roots and Radical Meaning fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. nth Roots and Radical Meaning fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the nth Roots and Radical Meaning rule. nth Roots and Radical Meaning keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "nth Roots and Radical Meaning is the Real Numbers rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "nth Roots and Radical Meaning works this concrete case: Find the mean of 8, 3, 4, 9.",
    howItWorks: "Read the nth Roots and Radical Meaning inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "nth Roots and Radical Meaning works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find the mean of 8, 3, 4, 9.", steps: ["Sum=24.", "Count=4.", "6."], answer: "6" },
      { prompt: "If one value increases by 3, how does the mean change?", steps: ["The total rises by 3.", "Mean rises by 3/4.", "0.75."], answer: "0.75" },
      { prompt: "Must the mean be one of the data values?", steps: ["The mean is a balance point.", "It can sit between values.", "No."], answer: "no" }
    ],
  },
  10046: {
    introduction: "Graphical Zeros of Polynomials works this concrete case: In Graphical Zeros of Polynomials, evaluate the labelled model at input 9. The labelled answer is 36. Graphical Zeros of Polynomials fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Graphical Zeros of Polynomials fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Graphical Zeros of Polynomials rule. Graphical Zeros of Polynomials keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Graphical Zeros of Polynomials is the Polynomials rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Graphical Zeros of Polynomials works this concrete case: In Graphical Zeros of Polynomials, evaluate the labelled model at input 9.",
    howItWorks: "Read the Graphical Zeros of Polynomials inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Graphical Zeros of Polynomials works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Graphical Zeros of Polynomials, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Graphical Zeros of Polynomials rule.", "The first stored value is 36.", "36."], answer: "36" },
      { prompt: "Compare the Graphical Zeros of Polynomials outputs at 9 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Graphical Zeros of Polynomials restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10047: {
    introduction: "Polynomial Division works this concrete case: In Polynomial Division, evaluate the labelled model at input 10. The labelled answer is 50. Polynomial Division fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Polynomial Division fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Polynomial Division rule. Polynomial Division keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Polynomial Division is the Polynomials rule that produces one labelled numerical result from the given inputs. In Polynomial Division, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Polynomial Division works this concrete case: In Polynomial Division, evaluate the labelled model at input 10.",
    howItWorks: "Read the Polynomial Division inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Polynomial Division works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Polynomial Division, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Polynomial Division rule.", "The first stored value is 50.", "50."], answer: "50" },
      { prompt: "Compare the Polynomial Division outputs at 10 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Polynomial Division restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10048: {
    introduction: "Remainder Theorem works this concrete case: In Remainder Theorem, evaluate the labelled model at input 3. The labelled answer is 18. Remainder Theorem fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Remainder Theorem fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Remainder Theorem rule. Remainder Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Remainder Theorem is the Polynomials rule that produces one labelled numerical result from the given inputs. In Remainder Theorem, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Remainder Theorem works this concrete case: In Remainder Theorem, evaluate the labelled model at input 3.",
    howItWorks: "Read the Remainder Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Remainder Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Remainder Theorem, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Remainder Theorem rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Remainder Theorem outputs at 3 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Remainder Theorem restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10049: {
    introduction: "Factor Theorem works this concrete case: Solve 7x = 28. The labelled answer is 4. Factor Theorem fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Factor Theorem fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Factor Theorem rule. Factor Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Factor Theorem is the Polynomials rule that produces one labelled numerical result from the given inputs. In Factor Theorem, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Factor Theorem works this concrete case: Solve 7x = 28.",
    howItWorks: "Read the Factor Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Factor Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Solve 7x = 28.", steps: ["Divide by 7.", "x=4.", "4."], answer: "4" },
      { prompt: "Expand 7(x+8).", steps: ["7x+56.", "7x+56.", "7x+56."], answer: "7x+56" },
      { prompt: "Is x=4 a root of (x-4)(x-8)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10050: {
    introduction: "Relationship Between Zeros and Coefficients works this concrete case: In Relationship Between Zeros and Coefficients, evaluate the labelled model at input 5. The labelled answer is 10. Relationship Between Zeros and Coefficients fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Relationship Between Zeros and Coefficients fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Relationship Between Zeros and Coefficients rule. Relationship Between Zeros and Coefficients keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Relationship Between Zeros and Coefficients is the Polynomials rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Relationship Between Zeros and Coefficients works this concrete case: In Relationship Between Zeros and Coefficients, evaluate the labelled model at input 5.",
    howItWorks: "Read the Relationship Between Zeros and Coefficients inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Relationship Between Zeros and Coefficients works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Relationship Between Zeros and Coefficients, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Relationship Between Zeros and Coefficients rule.", "The first stored value is 10.", "10."], answer: "10" },
      { prompt: "Compare the Relationship Between Zeros and Coefficients outputs at 5 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Relationship Between Zeros and Coefficients restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10051: {
    introduction: "Cubic Algebraic Identities works this concrete case: In Cubic Algebraic Identities, evaluate the labelled model at input 6. The labelled answer is 18. Cubic Algebraic Identities fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Cubic Algebraic Identities fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Cubic Algebraic Identities rule. Cubic Algebraic Identities keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Cubic Algebraic Identities is the Polynomials rule that produces one labelled numerical result from the given inputs. In Cubic Algebraic Identities, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Cubic Algebraic Identities works this concrete case: In Cubic Algebraic Identities, evaluate the labelled model at input 6.",
    howItWorks: "Read the Cubic Algebraic Identities inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Cubic Algebraic Identities works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Cubic Algebraic Identities, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Cubic Algebraic Identities rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Cubic Algebraic Identities outputs at 6 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Cubic Algebraic Identities restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10052: {
    introduction: "Polynomial Factorisation Practice works this concrete case: Solve 4x = 28. The labelled answer is 7. Polynomial Factorisation Practice fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Polynomial Factorisation Practice fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Polynomial Factorisation Practice rule. Polynomial Factorisation Practice keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Polynomial Factorisation Practice is the Polynomials rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Polynomial Factorisation Practice works this concrete case: Solve 4x = 28.",
    howItWorks: "Read the Polynomial Factorisation Practice inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Polynomial Factorisation Practice works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Solve 4x = 28.", steps: ["Divide by 4.", "x=7.", "7."], answer: "7" },
      { prompt: "Expand 4(x+4).", steps: ["4x+16.", "4x+16.", "4x+16."], answer: "4x+16" },
      { prompt: "Is x=7 a root of (x-7)(x-4)=0?", steps: ["A factor zero makes the product zero.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  10053: {
    introduction: "Definitions Axioms and Postulates works this concrete case: In Definitions Axioms and Postulates, evaluate the labelled model at input 8. The labelled answer is 40. Definitions Axioms and Postulates fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Definitions Axioms and Postulates fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Definitions Axioms and Postulates rule. Definitions Axioms and Postulates keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Definitions Axioms and Postulates is the Euclidean Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Definitions Axioms and Postulates works this concrete case: In Definitions Axioms and Postulates, evaluate the labelled model at input 8.",
    howItWorks: "Read the Definitions Axioms and Postulates inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Definitions Axioms and Postulates works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Definitions Axioms and Postulates, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Definitions Axioms and Postulates rule.", "The first stored value is 40.", "40."], answer: "40" },
      { prompt: "Compare the Definitions Axioms and Postulates outputs at 8 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Definitions Axioms and Postulates restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10054: {
    introduction: "Euclid's Five Postulates works this concrete case: In Euclid's Five Postulates, evaluate the labelled model at input 9. The labelled answer is 54. Euclid's Five Postulates fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Euclid's Five Postulates fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Euclid's Five Postulates rule. Euclid's Five Postulates keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Euclid's Five Postulates is the Euclidean Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Euclid's Five Postulates works this concrete case: In Euclid's Five Postulates, evaluate the labelled model at input 9.",
    howItWorks: "Read the Euclid's Five Postulates inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Euclid's Five Postulates works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Euclid's Five Postulates, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Euclid's Five Postulates rule.", "The first stored value is 54.", "54."], answer: "54" },
      { prompt: "Compare the Euclid's Five Postulates outputs at 9 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Euclid's Five Postulates restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10055: {
    introduction: "Equivalent Forms of the Fifth Postulate works this concrete case: In Equivalent Forms of the Fifth Postulate, evaluate the labelled model at input 10. The labelled answer is 70. Equivalent Forms of the Fifth Postulate fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Equivalent Forms of the Fifth Postulate fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Equivalent Forms of the Fifth Postulate rule. Equivalent Forms of the Fifth Postulate keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Equivalent Forms of the Fifth Postulate is the Euclidean Geometry rule that produces one labelled numerical result from the given inputs.",
    basicIdea: "Equivalent Forms of the Fifth Postulate works this concrete case: In Equivalent Forms of the Fifth Postulate, evaluate the labelled model at input 10.",
    howItWorks: "Read the Equivalent Forms of the Fifth Postulate inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Equivalent Forms of the Fifth Postulate works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Equivalent Forms of the Fifth Postulate, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Equivalent Forms of the Fifth Postulate rule.", "The first stored value is 70.", "70."], answer: "70" },
      { prompt: "Compare the Equivalent Forms of the Fifth Postulate outputs at 10 and 17. What is the difference?", steps: ["Second input 17.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Equivalent Forms of the Fifth Postulate restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  10056: {
    introduction: "Axiom versus Theorem works this concrete case: In Axiom versus Theorem, evaluate the labelled model at input 3. The labelled answer is 6. Axiom versus Theorem fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Axiom versus Theorem fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Axiom versus Theorem rule. Axiom versus Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Axiom versus Theorem is the Euclidean Geometry rule that produces one labelled numerical result from the given inputs. In Axiom versus Theorem, that statement is the exact rule used on the labelled chart and in the three numerical examples.",
    basicIdea: "Axiom versus Theorem works this concrete case: In Axiom versus Theorem, evaluate the labelled model at input 3.",
    howItWorks: "Read the Axiom versus Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Axiom versus Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "In Axiom versus Theorem, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Axiom versus Theorem rule.", "The first stored value is 6.", "6."], answer: "6" },
      { prompt: "Compare the Axiom versus Theorem outputs at 3 and 5. What is the difference?", steps: ["Second input 5.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Axiom versus Theorem restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  }
};

export function applyBatch5HandOverlay(lesson: StrengthenedLesson): StrengthenedLesson {
  const overlay = overlays[Number(lesson.id)];
  if (!overlay) return lesson;
  const workedExamples: WorkedExample[] = [
    ...overlay.worked.map((example, index) => ({
      id: `${lesson.id}-batch5-worked-${index + 1}`,
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
      { id: `${lesson.id}-batch5-definition`, statement: overlay.definition },
      ...lesson.definitions,
    ],
    workedExamples,
  };
}

export const batch5HandAuthoredLessonIds = Object.keys(overlays).map(Number).sort((left, right) => left - right);

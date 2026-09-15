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
    introduction: "F Distribution works this concrete case: If between-group MS=6 and within-group MS=5, what is F? The labelled answer is 6/5. Compare variances. Adjusts numerator and denominator degrees of freedom. A common labelled error is using only one degrees-of-freedom value. F Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The F distribution is a right-skewed distribution used for ratios of variance estimates. Variance ratios are non-negative, so F values cannot be negative. Adjusts numerator and denominator degrees of freedom. F Distribution is the Probability and Distributions rule used to compute one labelled numerical result.",
    basicIdea: "F Distribution works this concrete case: If between-group MS=6 and within-group MS=5, what is F?",
    howItWorks: "Use numerator and denominator degrees of freedom before reading probabilities.",
    whyItWorks: "Variance ratios are non-negative, so F values cannot be negative.",
    worked: [
      { prompt: "If between-group MS=6 and within-group MS=5, what is F?", steps: ["F=MS_B/MS_W.", "6/5.", "6/5."], answer: "6/5" },
      { prompt: "An F test uses numerator df=6 and denominator df=25. How many df values are needed?", steps: ["F needs both numerator and denominator df.", "2.", "2."], answer: "2" },
      { prompt: "Can an F statistic be negative?", steps: ["F is a ratio of variances.", "Variances are ≥ 0.", "No."], answer: "no" }
    ],
  },
  532: {
    introduction: "Exponential Distribution works this concrete case: If the rate is 6 events per hour, what is the mean wait? The labelled answer is 1/6. Model waiting times. Adjusts rate or scale. A common labelled error is using exponential distribution for counts instead of waiting times. Exponential Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The exponential distribution models waiting time until the next event in a Poisson process. It is memoryless, meaning past waiting does not change the remaining waiting-time distribution. Exponential Distribution is the Probability and Distributions rule used to compute one labelled numerical result.",
    basicIdea: "Exponential Distribution works this concrete case: If the rate is 6 events per hour, what is the mean wait?",
    howItWorks: "Identify the event rate, then calculate probabilities for waiting times.",
    whyItWorks: "It is memoryless, meaning past waiting does not change the remaining waiting-time distribution.",
    worked: [
      { prompt: "If the rate is 6 events per hour, what is the mean wait?", steps: ["Mean wait=1/λ.", "1/6.", "1/6."], answer: "1/6" },
      { prompt: "P(wait > 0) for a continuous exponential wait?", steps: ["The waiting time starts at 0.", "P(T>0)=1.", "1."], answer: "1" },
      { prompt: "Does extra waiting change the remaining exponential wait?", steps: ["Exponential is memoryless.", "The remaining wait has the same law.", "No."], answer: "no" }
    ],
  },
  533: {
    introduction: "Gamma Distribution works this concrete case: Exponential is gamma with shape 1. Time until 7 events uses shape what? The labelled answer is 7. Model positive waiting times. Adjusts shape and scale. A common labelled error is using gamma but thinking it only waits for one event. Gamma Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The gamma distribution models waiting time until several events occur in a Poisson process. It generalises the exponential distribution from one event to several events. Gamma Distribution is the Probability and Distributions rule used to compute one labelled numerical result.",
    basicIdea: "Gamma Distribution works this concrete case: Exponential is gamma with shape 1. Time until 7 events uses shape what?",
    howItWorks: "Set the shape for the target number of events and the rate or scale parameter.",
    whyItWorks: "It generalises the exponential distribution from one event to several events.",
    worked: [
      { prompt: "Exponential is gamma with shape 1. Time until 7 events uses shape what?", steps: ["Shape counts the target events.", "7.", "7."], answer: "7" },
      { prompt: "If each event has mean wait 1/8, mean time until 7 events is?", steps: ["Mean=shape/rate.", "7/8.", "7/8."], answer: "7/8" },
      { prompt: "Is gamma only for a single event?", steps: ["Gamma waits for several events.", "Exponential is the one-event case.", "No."], answer: "no" }
    ],
  },
  534: {
    introduction: "Weibull Distribution works this concrete case: If Weibull shape=9 > 1, does failure risk increase? The labelled answer is yes. Model reliability. Adjusts shape and scale. A common labelled error is assuming failure risk must stay constant. Weibull Distribution keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The Weibull distribution models lifetimes where failure risk can increase, decrease, or stay constant. The shape parameter controls how risk changes over time. Weibull Distribution is the Probability and Distributions rule used to compute one labelled numerical result.",
    basicIdea: "Weibull Distribution works this concrete case: If Weibull shape=9 > 1, does failure risk increase?",
    howItWorks: "Choose shape and scale parameters, then interpret the failure-rate pattern.",
    whyItWorks: "The shape parameter controls how risk changes over time.",
    worked: [
      { prompt: "If Weibull shape=9 > 1, does failure risk increase?", steps: ["Shape > 1 means wear-out.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Shape=1 is the exponential case. What risk pattern is that?", steps: ["Shape 1 keeps a constant hazard.", "constant.", "constant"], answer: "constant" },
      { prompt: "Must Weibull risk stay constant?", steps: ["Shape can raise or lower risk.", "Only shape 1 is constant.", "No."], answer: "no" }
    ],
  },
  535: {
    introduction: "Standardisation works this concrete case: Find z if x=20, μ=10, σ=3. The labelled answer is 10/3. Convert to standard normal units. Transforms x-values into z-scores. A common labelled error is subtracting the mean but not dividing by standard deviation. Standardisation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Standardisation changes a value into a z-score by measuring distance from the mean in standard deviations. It lets values from different scales be compared on one standard scale. Standardisation is the Probability and Distributions rule used to compute one labelled numerical result.",
    basicIdea: "Standardisation works this concrete case: Find z if x=20, μ=10, σ=3.",
    howItWorks: "Subtract the mean, then divide by the standard deviation.",
    whyItWorks: "It lets values from different scales be compared on one standard scale.",
    worked: [
      { prompt: "Find z if x=20, μ=10, σ=3.", steps: ["z=(x-μ)/σ.", "(20-10)/3.", "10/3."], answer: "10/3" },
      { prompt: "A z-score of 0 means the value equals what?", steps: ["z=0 when x=μ.", "the mean.", "mean"], answer: "mean" },
      { prompt: "Is subtracting the mean enough to standardise?", steps: ["A z-score also divides by σ.", "Centering alone is not enough.", "No."], answer: "no" }
    ],
  },
  536: {
    introduction: "Distribution Simulation works this concrete case: A fair die. P(score ≤ 4)? The labelled answer is 4/6. Compare theoretical and empirical behaviour. Generates samples and overlays histograms. A common labelled error is thinking one simulation is the exact distribution. Distribution Simulation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Distribution simulation generates random values from a chosen probability distribution. Simulation shows how random samples vary around the theoretical distribution. Compare theoretical and empirical behaviour. Generates samples and overlays histograms. Distribution Simulation is the Probability and Distributions rule used to compute one labelled numerical result.",
    basicIdea: "Distribution Simulation works this concrete case: A fair die. P(score ≤ 4)?",
    howItWorks: "Choose the model, set valid parameters, generate samples, and compare the simulated shape with theory.",
    whyItWorks: "Simulation shows how random samples vary around the theoretical distribution.",
    worked: [
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  537: {
    introduction: "Sampling Distributions works this concrete case: Sample n=40. SE of the mean if σ=5 is σ/√n. Find SE. The labelled answer is 5/√40. Understand sample variability. Generates repeated samples and plots statistics. A common labelled error is confusing the raw data distribution with the sampling distribution. Sampling Distributions keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A sampling distribution is the distribution of a statistic over many possible samples. Statistics vary from sample to sample, and their pattern tells us uncertainty. Generates repeated samples and plots statistics. Sampling Distributions is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Sampling Distributions works this concrete case: Sample n=40. SE of the mean if σ=5 is σ/√n. Find SE.",
    howItWorks: "Take many equal-size samples, compute the statistic each time, and study the statistic values.",
    whyItWorks: "Statistics vary from sample to sample, and their pattern tells us uncertainty.",
    worked: [
      { prompt: "Sample n=40. SE of the mean if σ=5 is σ/√n. Find SE.", steps: ["√n=√40.", "5/√40.", "5/√40."], answer: "5/√40" },
      { prompt: "Does the CLT say every sample is normal?", steps: ["It describes the sampling distribution of the mean.", "Individual samples can be skewed.", "No."], answer: "no" },
      { prompt: "If n increases from 4 to 16, SE is multiplied by what?", steps: ["SE scales as 1/√n.", "√4=2 so SE halves.", "1/2."], answer: "1/2" }
    ],
  },
  538: {
    introduction: "Central Limit Theorem works this concrete case: Sample n=50. SE of the mean if σ=6 is σ/√n. Find SE. The labelled answer is 6/√50. Observe normal approximation. Changes sample size and source distribution. A common labelled error is thinking the raw data must be normal. Central Limit Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The central limit theorem says sample means tend to be approximately normal for large samples under suitable conditions. Averages smooth random variation, so their distribution becomes more regular. Changes sample size and source distribution. Central Limit Theorem is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Central Limit Theorem works this concrete case: Sample n=50. SE of the mean if σ=6 is σ/√n. Find SE.",
    howItWorks: "Take large independent samples, compute their means, and compare the mean distribution with a normal shape.",
    whyItWorks: "Averages smooth random variation, so their distribution becomes more regular.",
    worked: [
      { prompt: "Sample n=50. SE of the mean if σ=6 is σ/√n. Find SE.", steps: ["√n=√50.", "6/√50.", "6/√50."], answer: "6/√50" },
      { prompt: "Does the CLT say every sample is normal?", steps: ["It describes the sampling distribution of the mean.", "Individual samples can be skewed.", "No."], answer: "no" },
      { prompt: "If n increases from 5 to 20, SE is multiplied by what?", steps: ["SE scales as 1/√n.", "√4=2 so SE halves.", "1/2."], answer: "1/2" }
    ],
  },
  539: {
    introduction: "Confidence Interval for Mean works this concrete case: A 95% CI is 6 ± 7. What is the upper bound? The labelled answer is 13. Estimate a population mean. Calculates and visualises interval coverage. A common labelled error is saying there is a fixed probability the true mean is inside after data are observed. Confidence Interval for Mean keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A confidence interval for a mean estimates a population mean with a margin of error. Repeated correct intervals capture the true mean at the stated long-run rate. Calculates and visualises interval coverage. Confidence Interval for Mean is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Confidence Interval for Mean works this concrete case: A 95% CI is 6 ± 7. What is the upper bound?",
    howItWorks: "Compute sample mean, standard error, critical value, and margin of error.",
    whyItWorks: "Repeated correct intervals capture the true mean at the stated long-run rate.",
    worked: [
      { prompt: "A 95% CI is 6 ± 7. What is the upper bound?", steps: ["6+7.", "13.", "13."], answer: "13" },
      { prompt: "If SE=7 and z*=2, what is the margin of error?", steps: ["ME=z*×SE.", "2*7=14.", "14."], answer: "14" },
      { prompt: "Does a 95% CI contain the sample mean by construction for a symmetric interval around the mean?", steps: ["The interval is centred on the sample mean.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  540: {
    introduction: "Confidence Interval for Proportion works this concrete case: A 95% CI is 7 ± 2. What is the upper bound? The labelled answer is 9. Estimate a population proportion. Builds intervals from count data. A common labelled error is using the success count without dividing by sample size. Confidence Interval for Proportion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A confidence interval for a proportion estimates a population fraction or percent. Sample proportions vary, so the interval shows plausible population proportions. Confidence Interval for Proportion is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Confidence Interval for Proportion works this concrete case: A 95% CI is 7 ± 2. What is the upper bound?",
    howItWorks: "Compute sample proportion, standard error, critical value, and margin of error.",
    whyItWorks: "Sample proportions vary, so the interval shows plausible population proportions.",
    worked: [
      { prompt: "A 95% CI is 7 ± 2. What is the upper bound?", steps: ["7+2.", "9.", "9."], answer: "9" },
      { prompt: "If SE=2 and z*=2, what is the margin of error?", steps: ["ME=z*×SE.", "2*2=4.", "4."], answer: "4" },
      { prompt: "Does a 95% CI contain the sample mean by construction for a symmetric interval around the mean?", steps: ["The interval is centred on the sample mean.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  541: {
    introduction: "Difference of Means Interval works this concrete case: Find the mean of 8, 3, 6, 9. The labelled answer is 6.5. Compare populations. Calculates independent or paired intervals. A common labelled error is using a two-sample interval for naturally paired data. Difference of Means Interval keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A difference of means interval estimates the difference between two population means. Two samples have uncertainty, so both contribute to the interval width. Calculates independent or paired intervals. Difference of Means Interval is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Difference of Means Interval works this concrete case: Find the mean of 8, 3, 6, 9.",
    howItWorks: "Compute the two sample means, subtract them, and add a margin of error for the difference.",
    whyItWorks: "Two samples have uncertainty, so both contribute to the interval width.",
    worked: [
      { prompt: "Find the mean of 8, 3, 6, 9.", steps: ["Sum=26.", "Count=4.", "6.5."], answer: "6.5" },
      { prompt: "If one value increases by 3, how does the mean change?", steps: ["The total rises by 3.", "Mean rises by 3/4.", "0.75."], answer: "0.75" },
      { prompt: "Must the mean be one of the data values?", steps: ["The mean is a balance point.", "It can sit between values.", "No."], answer: "no" }
    ],
  },
  542: {
    introduction: "Difference of Proportions Interval works this concrete case: A fair die. P(score ≤ 4)? The labelled answer is 4/6. Compare categorical rates. Calculates intervals from two samples. A common labelled error is pooling proportions for a confidence interval without reason. Difference of Proportions Interval keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A difference of proportions interval estimates the difference between two population proportions. Each sample proportion varies, so the difference has its own uncertainty. Difference of Proportions Interval is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Difference of Proportions Interval works this concrete case: A fair die. P(score ≤ 4)?",
    howItWorks: "Compute two sample proportions, subtract them, and use a standard error for the difference.",
    whyItWorks: "Each sample proportion varies, so the difference has its own uncertainty.",
    worked: [
      { prompt: "A fair die. P(score ≤ 4)?", steps: ["Favourable faces: 4.", "4/6.", "4/6."], answer: "4/6" },
      { prompt: "If P(A)=4/10, what is P(A')?", steps: ["1-4/10.", "6/10.", "6/10."], answer: "6/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  543: {
    introduction: "One-Sample z-Test works this concrete case: If z=10 and the critical value is 5, is |z| past the cutoff? The labelled answer is yes. Test a mean with known sigma. Displays statistic, p-value and rejection region. A common labelled error is using a z-test without checking conditions. One-Sample z-Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A one-sample z-test tests a population mean or proportion using a standard normal reference when z conditions are met. Standardising the statistic shows how unusual it is if the null hypothesis is true. Displays statistic, p-value and rejection region. One-Sample z-Test is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "One-Sample z-Test works this concrete case: If z=10 and the critical value is 5, is |z| past the cutoff?",
    howItWorks: "State hypotheses, compute the z statistic, find the p-value, and compare with alpha.",
    whyItWorks: "Standardising the statistic shows how unusual it is if the null hypothesis is true.",
    worked: [
      { prompt: "If z=10 and the critical value is 5, is |z| past the cutoff?", steps: ["|10|=10.", "Compare with 5.", "yes"], answer: "yes" },
      { prompt: "df=8. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" },
      { prompt: "Does failing to reject H0 prove H0 is true?", steps: ["Not rejecting is not proof.", "It is a lack of evidence against H0.", "No."], answer: "no" }
    ],
  },
  544: {
    introduction: "One-Sample t-Test works this concrete case: If z=3 and the critical value is 6, is |z| past the cutoff? The labelled answer is no. Test a mean with estimated sigma. Adjusts sample information and degrees of freedom. A common labelled error is pretending population standard deviation is known when it is not. One-Sample t-Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A one-sample t-test tests a population mean when population standard deviation is unknown. The t distribution accounts for estimating spread from the sample. Adjusts sample information and degrees of freedom. One-Sample t-Test is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "One-Sample t-Test works this concrete case: If z=3 and the critical value is 6, is |z| past the cutoff?",
    howItWorks: "State hypotheses, compute t from sample mean and sample standard deviation, then find the p-value.",
    whyItWorks: "The t distribution accounts for estimating spread from the sample.",
    worked: [
      { prompt: "If z=3 and the critical value is 6, is |z| past the cutoff?", steps: ["|3|=3.", "Compare with 6.", "no"], answer: "no" },
      { prompt: "df=9. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" },
      { prompt: "Does failing to reject H0 prove H0 is true?", steps: ["Not rejecting is not proof.", "It is a lack of evidence against H0.", "No."], answer: "no" }
    ],
  },
  545: {
    introduction: "Two-Sample t-Test works this concrete case: If z=4 and the critical value is 7, is |z| past the cutoff? The labelled answer is no. Compare independent means. Supports equal or unequal variance assumptions. A common labelled error is using a two-sample t-test for matched before-and-after data. Two-Sample t-Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A two-sample t-test compares two population means using two independent samples. The method measures whether the observed mean difference is large relative to sampling variation. Supports equal or unequal variance assumptions. Two-Sample t-Test is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Two-Sample t-Test works this concrete case: If z=4 and the critical value is 7, is |z| past the cutoff?",
    howItWorks: "State hypotheses, compare sample means, compute a t statistic, and read the p-value.",
    whyItWorks: "The method measures whether the observed mean difference is large relative to sampling variation.",
    worked: [
      { prompt: "If z=4 and the critical value is 7, is |z| past the cutoff?", steps: ["|4|=4.", "Compare with 7.", "no"], answer: "no" },
      { prompt: "df=10. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" },
      { prompt: "Does failing to reject H0 prove H0 is true?", steps: ["Not rejecting is not proof.", "It is a lack of evidence against H0.", "No."], answer: "no" }
    ],
  },
  546: {
    introduction: "Paired t-Test works this concrete case: If z=5 and the critical value is 2, is |z| past the cutoff? The labelled answer is yes. Compare matched observations. Uses difference scores. A common labelled error is testing two paired columns as if they are independent. Paired t-Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A paired t-test tests the mean of differences from matched pairs. Pairing removes person-to-person or item-to-item variation before testing. Paired t-Test is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Paired t-Test works this concrete case: If z=5 and the critical value is 2, is |z| past the cutoff?",
    howItWorks: "Subtract within each pair, then run a one-sample t-test on the differences.",
    whyItWorks: "Pairing removes person-to-person or item-to-item variation before testing.",
    worked: [
      { prompt: "If z=5 and the critical value is 2, is |z| past the cutoff?", steps: ["|5|=5.", "Compare with 2.", "yes"], answer: "yes" },
      { prompt: "df=4. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" },
      { prompt: "Does failing to reject H0 prove H0 is true?", steps: ["Not rejecting is not proof.", "It is a lack of evidence against H0.", "No."], answer: "no" }
    ],
  },
  547: {
    introduction: "One-Proportion Test works this concrete case: If z=6 and the critical value is 3, is |z| past the cutoff? The labelled answer is yes. Test a population proportion. Displays exact or normal-approximation results. A common labelled error is using p-hat instead of the null proportion in the test standard error. One-Proportion Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A one-proportion test checks a claim about one population proportion. It tests whether the observed success rate is unusual if the claim is true. Displays exact or normal-approximation results. One-Proportion Test is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "One-Proportion Test works this concrete case: If z=6 and the critical value is 3, is |z| past the cutoff?",
    howItWorks: "State the null proportion, compute p-hat, standardise with the null value, and find the p-value.",
    whyItWorks: "It tests whether the observed success rate is unusual if the claim is true.",
    worked: [
      { prompt: "If z=6 and the critical value is 3, is |z| past the cutoff?", steps: ["|6|=6.", "Compare with 3.", "yes"], answer: "yes" },
      { prompt: "df=5. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" },
      { prompt: "Does failing to reject H0 prove H0 is true?", steps: ["Not rejecting is not proof.", "It is a lack of evidence against H0.", "No."], answer: "no" }
    ],
  },
  548: {
    introduction: "Two-Proportion Test works this concrete case: If z=7 and the critical value is 4, is |z| past the cutoff? The labelled answer is yes. Compare two proportions. Displays pooled test statistics. A common labelled error is not pooling proportions for an equality test. Two-Proportion Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A two-proportion test checks whether two population proportions differ. Pooling represents the common proportion assumed by the null hypothesis. Two-Proportion Test is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Two-Proportion Test works this concrete case: If z=7 and the critical value is 4, is |z| past the cutoff?",
    howItWorks: "Compute two sample proportions, pool under the null when testing equality, then find the z statistic.",
    whyItWorks: "Pooling represents the common proportion assumed by the null hypothesis.",
    worked: [
      { prompt: "If z=7 and the critical value is 4, is |z| past the cutoff?", steps: ["|7|=7.", "Compare with 4.", "yes"], answer: "yes" },
      { prompt: "df=6. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" },
      { prompt: "Does failing to reject H0 prove H0 is true?", steps: ["Not rejecting is not proof.", "It is a lack of evidence against H0.", "No."], answer: "no" }
    ],
  },
  549: {
    introduction: "Chi-Square Goodness-of-Fit works this concrete case: If z=8 and the critical value is 5, is |z| past the cutoff? The labelled answer is yes. Compare observed and expected counts. Calculates contributions by category. A common labelled error is using percentages without expected counts. Chi-Square Goodness-of-Fit keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A chi-square goodness-of-fit test checks whether observed category counts match expected counts. Large differences between observed and expected counts make the statistic large. Chi-Square Goodness-of-Fit is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Chi-Square Goodness-of-Fit works this concrete case: If z=8 and the critical value is 5, is |z| past the cutoff?",
    howItWorks: "Compute expected counts, sum squared differences divided by expected counts, and read the chi-square p-value.",
    whyItWorks: "Large differences between observed and expected counts make the statistic large.",
    worked: [
      { prompt: "If z=8 and the critical value is 5, is |z| past the cutoff?", steps: ["|8|=8.", "Compare with 5.", "yes"], answer: "yes" },
      { prompt: "df=7. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" },
      { prompt: "Does failing to reject H0 prove H0 is true?", steps: ["Not rejecting is not proof.", "It is a lack of evidence against H0.", "No."], answer: "no" }
    ],
  },
  550: {
    introduction: "Chi-Square Independence works this concrete case: If z=9 and the critical value is 6, is |z| past the cutoff? The labelled answer is yes. Test categorical association. Uses contingency tables and expected counts. A common labelled error is treating association as proof of cause. Chi-Square Independence keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A chi-square independence test checks whether two categorical variables are associated. If variables are independent, observed counts should be close to expected counts from row and column totals. Uses contingency tables and expected counts. Chi-Square Independence is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Chi-Square Independence works this concrete case: If z=9 and the critical value is 6, is |z| past the cutoff?",
    howItWorks: "Use a two-way table, compute expected counts from margins, then compare observed and expected counts.",
    whyItWorks: "If variables are independent, observed counts should be close to expected counts from row and column totals.",
    worked: [
      { prompt: "If z=9 and the critical value is 6, is |z| past the cutoff?", steps: ["|9|=9.", "Compare with 6.", "yes"], answer: "yes" },
      { prompt: "df=8. For a two-sided t-test, how many tails?", steps: ["Two-sided uses both tails.", "2.", "2."], answer: "2" },
      { prompt: "Does failing to reject H0 prove H0 is true?", steps: ["Not rejecting is not proof.", "It is a lack of evidence against H0.", "No."], answer: "no" }
    ],
  },
  551: {
    introduction: "Variance Tests works this concrete case: A fair die. P(score ≤ 6)? The labelled answer is 6/6. Test population spread. Uses chi-square or F procedures. A common labelled error is using variance tests without checking strong assumptions. Variance Tests keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Variance tests check claims about population variance or compare variances between groups. Squared deviations make variance tests sensitive to spread and outliers. Variance Tests is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Variance Tests works this concrete case: A fair die. P(score ≤ 6)?",
    howItWorks: "Choose the correct chi-square or F test, check assumptions, compute the statistic, and read the p-value.",
    whyItWorks: "Squared deviations make variance tests sensitive to spread and outliers.",
    worked: [
      { prompt: "A fair die. P(score ≤ 6)?", steps: ["Favourable faces: 6.", "6/6.", "6/6."], answer: "6/6" },
      { prompt: "If P(A)=7/10, what is P(A')?", steps: ["1-7/10.", "3/10.", "3/10."], answer: "3/10" },
      { prompt: "Can a probability be 1.4?", steps: ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], answer: "no" }
    ],
  },
  552: {
    introduction: "ANOVA works this concrete case: If between-group MS=3 and within-group MS=2, what is F? The labelled answer is 3/2. Compare three or more means. Displays between- and within-group variation. A common labelled error is doing many pairwise tests instead of one overall ANOVA first. ANOVA keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "ANOVA tests whether several population means are equal by comparing between-group and within-group variation. If group means differ more than expected from within-group variation, the F statistic becomes large. Displays between- and within-group variation. ANOVA is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "ANOVA works this concrete case: If between-group MS=3 and within-group MS=2, what is F?",
    howItWorks: "State group mean hypotheses, compute an F statistic, and use the F distribution for the p-value.",
    whyItWorks: "If group means differ more than expected from within-group variation, the F statistic becomes large.",
    worked: [
      { prompt: "If between-group MS=3 and within-group MS=2, what is F?", steps: ["F=MS_B/MS_W.", "3/2.", "3/2."], answer: "3/2" },
      { prompt: "An F test uses numerator df=3 and denominator df=10. How many df values are needed?", steps: ["F needs both numerator and denominator df.", "2.", "2."], answer: "2" },
      { prompt: "Can an F statistic be negative?", steps: ["F is a ratio of variances.", "Variances are ≥ 0.", "No."], answer: "no" }
    ],
  },
  553: {
    introduction: "p-Value Visualiser works this concrete case: If p=0.03 and α=0.05, do we reject H0? The labelled answer is yes. Understand tail probability. Shades p-value regions under the null distribution. A common labelled error is saying the p-value is the probability the null hypothesis is true. p-Value Visualiser keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A p-value visualiser shows how unusual a test statistic is if the null hypothesis is true. The shaded area is the p-value, so smaller shaded area means stronger evidence against the null. Shades p-value regions under the null distribution. p-Value Visualiser is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "p-Value Visualiser works this concrete case: If p=0.03 and α=0.05, do we reject H0?",
    howItWorks: "Set the null model, place the observed statistic, and shade results at least as extreme.",
    whyItWorks: "The shaded area is the p-value, so smaller shaded area means stronger evidence against the null.",
    worked: [
      { prompt: "If p=0.03 and α=0.05, do we reject H0?", steps: ["Compare 0.03 with 0.05.", "Reject when p≤α.", "yes"], answer: "yes" },
      { prompt: "A p-value is the probability of data as extreme as observed, assuming what?", steps: ["The p-value is computed under H0.", "H0.", "H0"], answer: "H0" },
      { prompt: "Does p=0.20 prove H0 is true?", steps: ["Large p is lack of evidence against H0.", "It is not proof.", "No."], answer: "no" }
    ],
  },
  554: {
    introduction: "Type I and Type II Errors works this concrete case: If α=0.04, what is the Type I error rate used? The labelled answer is 0.04. Understand decision risks. Shows overlapping null and alternative distributions. A common labelled error is swapping Type I and Type II errors. Type I and Type II Errors keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A Type I error rejects a true null hypothesis, and a Type II error fails to reject a false null hypothesis. Tests use samples, so wrong decisions can happen even when the method is valid. Shows overlapping null and alternative distributions. Type I and Type II Errors is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Type I and Type II Errors works this concrete case: If α=0.04, what is the Type I error rate used?",
    howItWorks: "Identify the real state and the test decision, then name the matching error type.",
    whyItWorks: "Tests use samples, so wrong decisions can happen even when the method is valid.",
    worked: [
      { prompt: "If α=0.04, what is the Type I error rate used?", steps: ["α is P(reject H0 | H0 true).", "0.04.", "0.04."], answer: "0.04" },
      { prompt: "Type II error is failing to reject H0 when it is what?", steps: ["Type II happens when H0 is false.", "false.", "false"], answer: "false" },
      { prompt: "Is power the same as α?", steps: ["Power is 1−β.", "α is Type I.", "No."], answer: "no" }
    ],
  },
  555: {
    introduction: "Power of a Test works this concrete case: If β=0.5, what is the power? The labelled answer is 0.5. Explore detection capability. Changes sample size, effect and significance level. A common labelled error is confusing power with the significance level alpha. Power of a Test keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The power of a test is the probability of rejecting the null hypothesis when a specific alternative is true. Higher power means the test is better at detecting a real effect. Changes sample size, effect and significance level. Power of a Test is the Inferential Statistics rule used to compute one labelled numerical result.",
    basicIdea: "Power of a Test works this concrete case: If β=0.5, what is the power?",
    howItWorks: "Choose an alternative value, then find the chance the test rejects under that alternative.",
    whyItWorks: "Higher power means the test is better at detecting a real effect.",
    worked: [
      { prompt: "If β=0.5, what is the power?", steps: ["Power=1-β.", "1-0.5.", "0.5."], answer: "0.5" },
      { prompt: "Larger n=60 usually does what to power?", steps: ["More data shrinks SE.", "Power increases.", "increases"], answer: "increases" },
      { prompt: "Is power the Type I error rate?", steps: ["Power is 1−β.", "α is Type I.", "No."], answer: "no" }
    ],
  },
  556: {
    introduction: "Fundamental Counting Principle works this concrete case: Compute P(7,6). The labelled answer is 5040. Count sequential choices. Builds branching choice diagrams. A common labelled error is adding stage counts instead of multiplying them. Fundamental Counting Principle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Count choices for each stage, then multiply the stage counts. Fundamental Counting Principle is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Fundamental Counting Principle works this concrete case: Compute P(7,6).",
    howItWorks: "The fundamental counting principle multiplies the number of choices at each independent stage.",
    whyItWorks: "Count choices for each stage, then multiply the stage counts.",
    worked: [
      { prompt: "Compute P(7,6).", steps: ["P(n,k)=n!/(n-k)!.", "5040.", "5040."], answer: "5040" },
      { prompt: "If order matters, is P(7,6) larger than C(7,6) for k>1?", steps: ["Permutations count arrangements.", "Yes when k>1.", "yes"], answer: "yes" },
      { prompt: "Does a permutation ignore order?", steps: ["Permutations count order.", "No.", "No."], answer: "no" }
    ],
  },
  557: {
    introduction: "Factorials works this concrete case: Compute 7!. The labelled answer is 5040. Count arrangements. Animates ordering of distinct objects. A common labelled error is thinking 0! equals 0. Factorials keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Write n!, then multiply n x (n-1) x ... x 1. Factorials is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Factorials works this concrete case: Compute 7!.",
    howItWorks: "A factorial multiplies a positive whole number by every positive whole number below it.",
    whyItWorks: "Write n!, then multiply n x (n-1) x ... x 1.",
    worked: [
      { prompt: "Compute 7!.", steps: ["7!=7×6×5×4×3×2×1.", "5040.", "5040."], answer: "5040" },
      { prompt: "How many ways can 7 distinct books be lined up?", steps: ["Permutations of 7 are 7!.", "5040.", "5040."], answer: "5040" },
      { prompt: "Is 0! equal to 0?", steps: ["Empty product is 1.", "0!=1.", "No."], answer: "no" }
    ],
  },
  558: {
    introduction: "Permutations works this concrete case: Compute P(9,2). The labelled answer is 72. Count ordered selections. Generates arrangements and formula values. A common labelled error is using combinations when order matters. Permutations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Choose ordered positions one at a time, decreasing the choices after each pick. Generates arrangements and formula values. Permutations is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Permutations works this concrete case: Compute P(9,2).",
    howItWorks: "A permutation is an arrangement where order matters.",
    whyItWorks: "Choose ordered positions one at a time, decreasing the choices after each pick.",
    worked: [
      { prompt: "Compute P(9,2).", steps: ["P(n,k)=n!/(n-k)!.", "72.", "72."], answer: "72" },
      { prompt: "If order matters, is P(9,2) larger than C(9,2) for k>1?", steps: ["Permutations count arrangements.", "Yes when k>1.", "yes"], answer: "yes" },
      { prompt: "Does a permutation ignore order?", steps: ["Permutations count order.", "No.", "No."], answer: "no" }
    ],
  },
  559: {
    introduction: "Permutations with Repetition works this concrete case: Compute P(10,3). The labelled answer is 720. Handle repeated objects. Groups identical items and adjusts counts. A common labelled error is decreasing choices even though repetition is allowed. Permutations with Repetition keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Count choices per position and multiply, keeping the same number of choices if repetition is allowed. Groups identical items and adjusts counts. Permutations with Repetition is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Permutations with Repetition works this concrete case: Compute P(10,3).",
    howItWorks: "Permutations with repetition count ordered choices when an item may be used more than once.",
    whyItWorks: "Count choices per position and multiply, keeping the same number of choices if repetition is allowed.",
    worked: [
      { prompt: "Compute P(10,3).", steps: ["P(n,k)=n!/(n-k)!.", "720.", "720."], answer: "720" },
      { prompt: "If order matters, is P(10,3) larger than C(10,3) for k>1?", steps: ["Permutations count arrangements.", "Yes when k>1.", "yes"], answer: "yes" },
      { prompt: "Does a permutation ignore order?", steps: ["Permutations count order.", "No.", "No."], answer: "no" }
    ],
  },
  560: {
    introduction: "Circular Permutations works this concrete case: Compute P(5,3). The labelled answer is 60. Count circular arrangements. Rotates equivalent arrangements. A common labelled error is counting rotated versions as different circular arrangements. Circular Permutations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Fix one object as a reference, then arrange the remaining objects. Circular Permutations is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Circular Permutations works this concrete case: Compute P(5,3).",
    howItWorks: "Circular permutations count arrangements around a circle where rotations are considered the same.",
    whyItWorks: "Fix one object as a reference, then arrange the remaining objects.",
    worked: [
      { prompt: "Compute P(5,3).", steps: ["P(n,k)=n!/(n-k)!.", "60.", "60."], answer: "60" },
      { prompt: "If order matters, is P(5,3) larger than C(5,3) for k>1?", steps: ["Permutations count arrangements.", "Yes when k>1.", "yes"], answer: "yes" },
      { prompt: "Does a permutation ignore order?", steps: ["Permutations count order.", "No.", "No."], answer: "no" }
    ],
  },
  561: {
    introduction: "Combinations works this concrete case: Compute C(6,4). The labelled answer is 15. Count unordered selections. Builds selectable subsets. A common labelled error is counting AB and BA as different combinations. Combinations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Choose r objects from n objects and divide out the repeated orders. Combinations is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Combinations works this concrete case: Compute C(6,4).",
    howItWorks: "A combination is a selection where order does not matter.",
    whyItWorks: "Choose r objects from n objects and divide out the repeated orders.",
    worked: [
      { prompt: "Compute C(6,4).", steps: ["C(n,k)=n!/(k!(n-k)!).", "15.", "15."], answer: "15" },
      { prompt: "Does C(6,4) equal C(6,2)?", steps: ["Combinations are symmetric.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Does order matter in a combination?", steps: ["Combinations ignore order.", "No.", "No."], answer: "no" }
    ],
  },
  562: {
    introduction: "Pascal's Triangle works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Explore coefficients and patterns. Generates rows and highlights identities. A common labelled error is adding numbers from the same row instead of the two above. Pascal's Triangle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Start with 1s on the edges, then add neighbouring numbers to fill inside entries. Generates rows and highlights identities. Pascal's Triangle is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Pascal's Triangle works this concrete case: A right angle is what fraction of a 360° turn?",
    howItWorks: "Pascal's triangle is a triangular array where each inside number is the sum of the two numbers above it.",
    whyItWorks: "Start with 1s on the edges, then add neighbouring numbers to fill inside entries.",
    worked: [
      { prompt: "A right angle is what fraction of a 360° turn?", steps: ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], answer: "90" },
      { prompt: "Add 50° and 60°. What is the sum?", steps: ["50+60.", "110.", "110."], answer: "110" },
      { prompt: "Do longer rays make a larger angle?", steps: ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], answer: "no" }
    ],
  },
  563: {
    introduction: "Inclusion–Exclusion works this concrete case: In Inclusion–Exclusion, evaluate the labelled model at input 6. The labelled answer is 42. Correct overlapping counts. Uses Venn diagrams and formulas. A common labelled error is adding overlapping sets and keeping the overlap twice. Inclusion–Exclusion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Add the set sizes, then subtract the intersection that was counted twice. Inclusion–Exclusion is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Inclusion–Exclusion works this concrete case: In Inclusion–Exclusion, evaluate the labelled model at input 6.",
    howItWorks: "Inclusion-exclusion counts objects in overlapping sets without double-counting the overlap.",
    whyItWorks: "Add the set sizes, then subtract the intersection that was counted twice.",
    worked: [
      { prompt: "In Inclusion–Exclusion, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Inclusion–Exclusion rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Inclusion–Exclusion outputs at 6 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Inclusion–Exclusion restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  564: {
    introduction: "Pigeonhole Principle works this concrete case: Compute P(7,2). The labelled answer is 42. Understand guaranteed repetition. Distributes objects into containers. A common labelled error is using the principle when objects are not more than boxes. Pigeonhole Principle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Compare the number of objects with the number of boxes. Pigeonhole Principle is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Pigeonhole Principle works this concrete case: Compute P(7,2).",
    howItWorks: "The pigeonhole principle says if more objects than boxes are assigned to boxes, at least one box gets more than one object.",
    whyItWorks: "Compare the number of objects with the number of boxes.",
    worked: [
      { prompt: "Compute P(7,2).", steps: ["P(n,k)=n!/(n-k)!.", "42.", "42."], answer: "42" },
      { prompt: "If order matters, is P(7,2) larger than C(7,2) for k>1?", steps: ["Permutations count arrangements.", "Yes when k>1.", "yes"], answer: "yes" },
      { prompt: "Does a permutation ignore order?", steps: ["Permutations count order.", "No.", "No."], answer: "no" }
    ],
  },
  565: {
    introduction: "Vertex and Edge Builder works this concrete case: A complete graph K_10 has how many edges? The labelled answer is 45. Create mathematical networks. Adds, moves and connects vertices. A common labelled error is confusing a connection with a point. Vertex and Edge Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Place vertices, then add edges only between intended pairs. Vertex and Edge Builder is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Vertex and Edge Builder works this concrete case: A complete graph K_10 has how many edges?",
    howItWorks: "A graph has vertices as points and edges as connections between vertices.",
    whyItWorks: "Place vertices, then add edges only between intended pairs.",
    worked: [
      { prompt: "A complete graph K_10 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "45.", "45."], answer: "45" },
      { prompt: "A tree with 11 vertices has how many edges?", steps: ["A tree has n-1 edges.", "10.", "10."], answer: "10" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  566: {
    introduction: "Directed Graphs works this concrete case: A complete graph K_11 has how many edges? The labelled answer is 55. Model one-way relationships. Displays arrowed edges. A common labelled error is treating directed edges as if arrows do not matter. Directed Graphs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Read each arrow from its start vertex to its end vertex. Directed Graphs is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Directed Graphs works this concrete case: A complete graph K_11 has how many edges?",
    howItWorks: "A directed graph has edges with arrows showing direction.",
    whyItWorks: "Read each arrow from its start vertex to its end vertex.",
    worked: [
      { prompt: "A complete graph K_11 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "55.", "55."], answer: "55" },
      { prompt: "A tree with 12 vertices has how many edges?", steps: ["A tree has n-1 edges.", "11.", "11."], answer: "11" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  567: {
    introduction: "Weighted Graphs works this concrete case: A complete graph K_12 has how many edges? The labelled answer is 66. Represent costs or distances. Adds editable edge weights. A common labelled error is choosing a path by fewest edges when weights matter. Weighted Graphs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Read the edge weight before comparing routes or totals. Weighted Graphs is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Weighted Graphs works this concrete case: A complete graph K_12 has how many edges?",
    howItWorks: "A weighted graph has numbers on edges to show cost, distance, time, or strength.",
    whyItWorks: "Read the edge weight before comparing routes or totals.",
    worked: [
      { prompt: "A complete graph K_12 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "66.", "66."], answer: "66" },
      { prompt: "A tree with 13 vertices has how many edges?", steps: ["A tree has n-1 edges.", "12.", "12."], answer: "12" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  568: {
    introduction: "Degree of a Vertex works this concrete case: A complete graph K_5 has how many edges? The labelled answer is 10. Measure connectivity. Counts incident edges. A common labelled error is counting neighbouring vertices instead of incident edges in every case. Degree of a Vertex keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Count every edge touching the vertex, with a loop counting twice in standard graph theory. Degree of a Vertex is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Degree of a Vertex works this concrete case: A complete graph K_5 has how many edges?",
    howItWorks: "The degree of a vertex is the number of edges incident to it in an undirected graph.",
    whyItWorks: "Count every edge touching the vertex, with a loop counting twice in standard graph theory.",
    worked: [
      { prompt: "A complete graph K_5 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "10.", "10."], answer: "10" },
      { prompt: "A tree with 6 vertices has how many edges?", steps: ["A tree has n-1 edges.", "5.", "5."], answer: "5" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  569: {
    introduction: "Paths and Cycles works this concrete case: In Paths and Cycles, evaluate the labelled model at input 4. The labelled answer is 28. Explore routes. Highlights valid walks, trails and cycles. A common labelled error is listing vertices that are not connected by edges. Paths and Cycles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Follow adjacent vertices in order and check whether the route closes back at the start. Highlights valid walks, trails and cycles. Paths and Cycles is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Paths and Cycles works this concrete case: In Paths and Cycles, evaluate the labelled model at input 4.",
    howItWorks: "A path is a sequence of connected vertices, and a cycle is a path that returns to its start.",
    whyItWorks: "Follow adjacent vertices in order and check whether the route closes back at the start.",
    worked: [
      { prompt: "In Paths and Cycles, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Paths and Cycles rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Paths and Cycles outputs at 4 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Paths and Cycles restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  570: {
    introduction: "Connected Components works this concrete case: In Connected Components, evaluate the labelled model at input 5. The labelled answer is 10. Identify separated regions. Colours graph components. A common labelled error is thinking vertices need a direct edge to be in the same component. Connected Components keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Trace paths from a vertex to find all reachable vertices, then repeat for unreached vertices. Connected Components is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Connected Components works this concrete case: In Connected Components, evaluate the labelled model at input 5.",
    howItWorks: "A connected component is a largest group of vertices where each pair is connected by some path.",
    whyItWorks: "Trace paths from a vertex to find all reachable vertices, then repeat for unreached vertices.",
    worked: [
      { prompt: "In Connected Components, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Connected Components rule.", "The first stored value is 10.", "10."], answer: "10" },
      { prompt: "Compare the Connected Components outputs at 5 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Connected Components restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  571: {
    introduction: "Euler Paths and Circuits works this concrete case: A complete graph K_8 has how many edges? The labelled answer is 28. Traverse every edge. Checks conditions and animates routes. A common labelled error is thinking Euler means visiting every vertex once. Euler Paths and Circuits keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Check connectedness and count vertices of odd degree. Euler Paths and Circuits is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Euler Paths and Circuits works this concrete case: A complete graph K_8 has how many edges?",
    howItWorks: "An Euler path uses every edge exactly once; an Euler circuit also starts and ends at the same vertex.",
    whyItWorks: "Check connectedness and count vertices of odd degree.",
    worked: [
      { prompt: "A complete graph K_8 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "28.", "28."], answer: "28" },
      { prompt: "A tree with 9 vertices has how many edges?", steps: ["A tree has n-1 edges.", "8.", "8."], answer: "8" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  572: {
    introduction: "Hamiltonian Paths and Cycles works this concrete case: A complete graph K_9 has how many edges? The labelled answer is 36. Visit every vertex. Searches and animates candidate routes. A common labelled error is confusing Hamiltonian with Euler paths. Hamiltonian Paths and Cycles keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Look for a route that includes each vertex once, then check whether it closes. Hamiltonian Paths and Cycles is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Hamiltonian Paths and Cycles works this concrete case: A complete graph K_9 has how many edges?",
    howItWorks: "A Hamiltonian path visits every vertex exactly once; a Hamiltonian cycle returns to the start.",
    whyItWorks: "Look for a route that includes each vertex once, then check whether it closes.",
    worked: [
      { prompt: "A complete graph K_9 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "36.", "36."], answer: "36" },
      { prompt: "A tree with 10 vertices has how many edges?", steps: ["A tree has n-1 edges.", "9.", "9."], answer: "9" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  573: {
    introduction: "Trees works this concrete case: In Trees, evaluate the labelled model at input 8. The labelled answer is 40. Explore acyclic networks. Builds and validates tree structures. A common labelled error is calling any branching picture a tree without checking cycles and connectedness. Trees keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Check that every vertex is reachable and no closed loop exists. Trees is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Trees works this concrete case: In Trees, evaluate the labelled model at input 8.",
    howItWorks: "A tree is a connected graph with no cycles.",
    whyItWorks: "Check that every vertex is reachable and no closed loop exists.",
    worked: [
      { prompt: "In Trees, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Trees rule.", "The first stored value is 40.", "40."], answer: "40" },
      { prompt: "Compare the Trees outputs at 8 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Trees restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  574: {
    introduction: "Minimum Spanning Tree works this concrete case: A complete graph K_11 has how many edges? The labelled answer is 55. Connect at minimum cost. Runs Prim or Kruskal step by step. A common labelled error is confusing a minimum spanning tree with one shortest route. Minimum Spanning Tree keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Add low-weight edges while avoiding cycles until all vertices are connected. Minimum Spanning Tree is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Minimum Spanning Tree works this concrete case: A complete graph K_11 has how many edges?",
    howItWorks: "A minimum spanning tree connects all vertices of a weighted graph with the smallest possible total edge weight and no cycles.",
    whyItWorks: "Add low-weight edges while avoiding cycles until all vertices are connected.",
    worked: [
      { prompt: "A complete graph K_11 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "55.", "55."], answer: "55" },
      { prompt: "A tree with 12 vertices has how many edges?", steps: ["A tree has n-1 edges.", "11.", "11."], answer: "11" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  575: {
    introduction: "Shortest Path works this concrete case: A complete graph K_12 has how many edges? The labelled answer is 66. Find least-cost routes. Runs Dijkstra interactively. A common labelled error is choosing fewest edges even when weights differ. Shortest Path keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Add edge weights along possible routes and choose the smallest valid total. Shortest Path is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Shortest Path works this concrete case: A complete graph K_12 has how many edges?",
    howItWorks: "A shortest path is a route between chosen vertices with minimum total weight or length.",
    whyItWorks: "Add edge weights along possible routes and choose the smallest valid total.",
    worked: [
      { prompt: "A complete graph K_12 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "66.", "66."], answer: "66" },
      { prompt: "A tree with 13 vertices has how many edges?", steps: ["A tree has n-1 edges.", "12.", "12."], answer: "12" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  576: {
    introduction: "Graph Colouring works this concrete case: A complete graph K_5 has how many edges? The labelled answer is 10. Avoid adjacent colour conflicts. Lets learners colour vertices and checks validity. A common labelled error is calling the number of colours in one valid attempt the chromatic number. Graph Colouring keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A proper vertex colouring assigns colours to vertices so adjacent vertices always receive different colours. Each edge encodes one incompatibility constraint, so a colouring is valid exactly when no edge has equal colours at both endpoints. Lets learners colour vertices and checks validity. Graph Colouring is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Graph Colouring works this concrete case: A complete graph K_5 has how many edges?",
    howItWorks: "Colour high-conflict vertices first, check every edge after each choice, reuse a colour only on non-adjacent vertices, and prove minimality with a lower bound.",
    whyItWorks: "Each edge encodes one incompatibility constraint, so a colouring is valid exactly when no edge has equal colours at both endpoints.",
    worked: [
      { prompt: "A complete graph K_5 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "10.", "10."], answer: "10" },
      { prompt: "A tree with 6 vertices has how many edges?", steps: ["A tree has n-1 edges.", "5.", "5."], answer: "5" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  577: {
    introduction: "Bipartite Graphs works this concrete case: A complete graph K_6 has how many edges? The labelled answer is 15. Split vertices into two sets. Tests and displays two-colour partitions. A common labelled error is allowing an edge within the same group. Bipartite Graphs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Try to colour vertices with two colours so no edge joins same-colour vertices. Tests and displays two-colour partitions. Bipartite Graphs is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Bipartite Graphs works this concrete case: A complete graph K_6 has how many edges?",
    howItWorks: "A bipartite graph has vertices split into two groups, with edges only between groups.",
    whyItWorks: "Try to colour vertices with two colours so no edge joins same-colour vertices.",
    worked: [
      { prompt: "A complete graph K_6 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "15.", "15."], answer: "15" },
      { prompt: "A tree with 7 vertices has how many edges?", steps: ["A tree has n-1 edges.", "6.", "6."], answer: "6" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  578: {
    introduction: "Planar Graphs works this concrete case: A complete graph K_7 has how many edges? The labelled answer is 21. Explore crossing-free drawings. Allows vertex dragging and checks planarity concepts. A common labelled error is calling a graph non-planar just because one drawing has crossings. Planar Graphs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Try to redraw the graph without crossing edges. Allows vertex dragging and checks planarity concepts. Planar Graphs is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Planar Graphs works this concrete case: A complete graph K_7 has how many edges?",
    howItWorks: "A planar graph can be drawn in the plane so edges meet only at vertices.",
    whyItWorks: "Try to redraw the graph without crossing edges.",
    worked: [
      { prompt: "A complete graph K_7 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "21.", "21."], answer: "21" },
      { prompt: "A tree with 8 vertices has how many edges?", steps: ["A tree has n-1 edges.", "7.", "7."], answer: "7" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  579: {
    introduction: "Network Flow works this concrete case: A complete graph K_8 has how many edges? The labelled answer is 28. Model capacities. Animates flow and bottlenecks. A common labelled error is sending more flow through an edge than its capacity. Network Flow keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Respect each edge capacity and conserve flow at intermediate vertices. Network Flow is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Network Flow works this concrete case: A complete graph K_8 has how many edges?",
    howItWorks: "Network flow studies how much quantity can move from a source to a sink through directed edges with capacities.",
    whyItWorks: "Respect each edge capacity and conserve flow at intermediate vertices.",
    worked: [
      { prompt: "A complete graph K_8 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "28.", "28."], answer: "28" },
      { prompt: "A tree with 9 vertices has how many edges?", steps: ["A tree has n-1 edges.", "8.", "8."], answer: "8" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  580: {
    introduction: "Travelling Salesperson works this concrete case: In Travelling Salesperson, evaluate the labelled model at input 7. The labelled answer is 42. Explore route optimisation. Compares route lengths. A common labelled error is forgetting to return to the starting city. Travelling Salesperson keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "List or search possible tours and compare total distances. Travelling Salesperson is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Travelling Salesperson works this concrete case: In Travelling Salesperson, evaluate the labelled model at input 7.",
    howItWorks: "The travelling salesperson problem asks for a shortest tour that visits each city once and returns to the start.",
    whyItWorks: "List or search possible tours and compare total distances.",
    worked: [
      { prompt: "In Travelling Salesperson, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Travelling Salesperson rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Travelling Salesperson outputs at 7 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Travelling Salesperson restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  581: {
    introduction: "Adjacency Matrix works this concrete case: A complete graph K_10 has how many edges? The labelled answer is 45. Connect graphs and matrices. Updates matrix entries from edges. A common labelled error is reading a matrix without matching row and column labels. Adjacency Matrix keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Label rows and columns by vertices, then enter 1 or a weight when an edge exists. Adjacency Matrix is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Adjacency Matrix works this concrete case: A complete graph K_10 has how many edges?",
    howItWorks: "An adjacency matrix is a square table that records which vertices are connected.",
    whyItWorks: "Label rows and columns by vertices, then enter 1 or a weight when an edge exists.",
    worked: [
      { prompt: "A complete graph K_10 has how many edges?", steps: ["K_n has n(n-1)/2 edges.", "45.", "45."], answer: "45" },
      { prompt: "A tree with 11 vertices has how many edges?", steps: ["A tree has n-1 edges.", "10.", "10."], answer: "10" },
      { prompt: "Can a simple graph have a loop at one vertex?", steps: ["Simple graphs forbid loops.", "No.", "No."], answer: "no" }
    ],
  },
  582: {
    introduction: "Set Builder works this concrete case: If A has 9 elements, |P(A)| is? The labelled answer is 512. Create and manipulate sets. Adds elements and symbolic conditions. A common labelled error is writing a condition without stating whether x is integer, real, or another type. Set Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Set-builder notation describes a set by a variable, its domain, and a condition that every member satisfies. The predicate after the bar acts as a membership test, so the notation includes exactly the domain elements for which that predicate is true. Set Builder is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Set Builder works this concrete case: If A has 9 elements, |P(A)| is?",
    howItWorks: "Choose a variable, state its universe or number set, write the membership bar, add the exact condition, and test boundary values against the rule.",
    whyItWorks: "The predicate after the bar acts as a membership test, so the notation includes exactly the domain elements for which that predicate is true.",
    worked: [
      { prompt: "If A has 9 elements, |P(A)| is?", steps: ["A power set has 2^n subsets.", "2^9=512.", "512."], answer: "512" },
      { prompt: "|A union B| if |A|=9, |B|=2, |A intersect B|=2?", steps: ["|A union B|=|A|+|B|-|A intersect B|.", "9.", "9."], answer: "9" },
      { prompt: "Is the empty set a subset of every set?", steps: ["∅ is a subset of every set.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  583: {
    introduction: "Union, Intersection and Difference works this concrete case: In Union, Intersection and Difference, evaluate the labelled model at input 10. The labelled answer is 30. Understand set operations. Uses linked Venn regions and element lists. A common labelled error is assuming A-B equals B-A. Union, Intersection and Difference keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Union collects elements in either set, intersection keeps elements in both, and difference keeps elements in the first set but not the second. Set operations are logical rules applied element by element, which is why Venn shading and roster results agree. Uses linked Venn regions and element lists. Union, Intersection and Difference is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Union, Intersection and Difference works this concrete case: In Union, Intersection and Difference, evaluate the labelled model at input 10.",
    howItWorks: "Check each candidate element against both sets, then apply OR for union, AND for intersection, or first-set AND NOT second-set for difference.",
    whyItWorks: "Set operations are logical rules applied element by element, which is why Venn shading and roster results agree.",
    worked: [
      { prompt: "In Union, Intersection and Difference, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Union, Intersection and Difference rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Union, Intersection and Difference outputs at 10 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Union, Intersection and Difference restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  584: {
    introduction: "Complement works this concrete case: If A has 3 elements, |P(A)| is? The labelled answer is 8. Understand universal-set exclusion. Shades outside a selected set. A common labelled error is finding a complement without knowing the universal set. Complement keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Start with the universal set and remove the elements of the given set. Complement is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Complement works this concrete case: If A has 3 elements, |P(A)| is?",
    howItWorks: "The complement of a set contains all elements in the universal set that are not in the set.",
    whyItWorks: "Start with the universal set and remove the elements of the given set.",
    worked: [
      { prompt: "If A has 3 elements, |P(A)| is?", steps: ["A power set has 2^n subsets.", "2^3=8.", "8."], answer: "8" },
      { prompt: "|A union B| if |A|=3, |B|=4, |A intersect B|=2?", steps: ["|A union B|=|A|+|B|-|A intersect B|.", "5.", "5."], answer: "5" },
      { prompt: "Is the empty set a subset of every set?", steps: ["∅ is a subset of every set.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  585: {
    introduction: "Cartesian Product works this concrete case: If A has 4 elements, |P(A)| is? The labelled answer is 16. Generate ordered pairs. Builds pair grids. A common labelled error is treating ordered pairs like unordered sets. Cartesian Product keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Pair every element of A with every element of B in order. Cartesian Product is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Cartesian Product works this concrete case: If A has 4 elements, |P(A)| is?",
    howItWorks: "The Cartesian product A x B is the set of all ordered pairs with first element from A and second from B.",
    whyItWorks: "Pair every element of A with every element of B in order.",
    worked: [
      { prompt: "If A has 4 elements, |P(A)| is?", steps: ["A power set has 2^n subsets.", "2^4=16.", "16."], answer: "16" },
      { prompt: "|A union B| if |A|=4, |B|=5, |A intersect B|=2?", steps: ["|A union B|=|A|+|B|-|A intersect B|.", "7.", "7."], answer: "7" },
      { prompt: "Is the empty set a subset of every set?", steps: ["∅ is a subset of every set.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  586: {
    introduction: "Subsets and Power Sets works this concrete case: If A has 5 elements, |P(A)| is? The labelled answer is 32. Explore containment. Generates all subsets for small sets. A common labelled error is leaving the empty set out of a power set. Subsets and Power Sets keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A is a subset of B when every element of A is in B; the power set of B is the set of all subsets of B. Each of n elements has two independent choices, included or excluded, producing 2^n distinct subsets. Subsets and Power Sets is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Subsets and Power Sets works this concrete case: If A has 5 elements, |P(A)| is?",
    howItWorks: "Test each candidate element for subset status; to build a power set, enumerate choices systematically by subset size or binary include/exclude patterns.",
    whyItWorks: "Each of n elements has two independent choices, included or excluded, producing 2^n distinct subsets.",
    worked: [
      { prompt: "If A has 5 elements, |P(A)| is?", steps: ["A power set has 2^n subsets.", "2^5=32.", "32."], answer: "32" },
      { prompt: "|A union B| if |A|=5, |B|=6, |A intersect B|=2?", steps: ["|A union B|=|A|+|B|-|A intersect B|.", "9.", "9."], answer: "9" },
      { prompt: "Is the empty set a subset of every set?", steps: ["∅ is a subset of every set.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  587: {
    introduction: "Truth Tables works this concrete case: In Truth Tables, evaluate the labelled model at input 6. The labelled answer is 42. Evaluate logical expressions. Builds rows automatically. A common labelled error is checking only one convenient assignment. Truth Tables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A truth table lists every truth-value assignment to propositions and evaluates a logical expression on each row. Every possible assignment appears once, so the final column proves the expression's behaviour over the complete finite domain. Truth Tables is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Truth Tables works this concrete case: In Truth Tables, evaluate the labelled model at input 6.",
    howItWorks: "Create 2^n rows for n propositions, fill atomic truth values in a regular pattern, evaluate inner connectives first, and classify the final column.",
    whyItWorks: "Every possible assignment appears once, so the final column proves the expression's behaviour over the complete finite domain.",
    worked: [
      { prompt: "In Truth Tables, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Truth Tables rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Truth Tables outputs at 6 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Truth Tables restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  588: {
    introduction: "Logical Connectives works this concrete case: In Logical Connectives, evaluate the labelled model at input 7. The labelled answer is 14. Understand AND, OR, NOT and implication. Uses switches and truth outputs. A common labelled error is reading mathematical OR as exactly one of the statements. Logical Connectives keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Logical connectives combine or modify propositions: NOT negates, AND requires both, OR requires at least one, and implication fails only when its premise is true and conclusion false. Each connective is defined by a fixed truth function, so the same input truth values always produce the same output. Understand AND, OR, NOT and implication. Logical Connectives is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Logical Connectives works this concrete case: In Logical Connectives, evaluate the labelled model at input 7.",
    howItWorks: "Identify the main connective, evaluate any negations and grouped subexpressions, then apply that connective's truth rule to the resulting values.",
    whyItWorks: "Each connective is defined by a fixed truth function, so the same input truth values always produce the same output.",
    worked: [
      { prompt: "In Logical Connectives, evaluate the labelled model at input 7.", steps: ["Substitute 7 into the Logical Connectives rule.", "The first stored value is 14.", "14."], answer: "14" },
      { prompt: "Compare the Logical Connectives outputs at 7 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Logical Connectives restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  589: {
    introduction: "Quantifiers works this concrete case: In Quantifiers, evaluate the labelled model at input 8. The labelled answer is 24. Understand universal and existential claims. Tests statements over finite domains. A common labelled error is using several successful examples as proof of a universal statement. Quantifiers keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The universal quantifier claims a predicate holds for every domain element; the existential quantifier claims it holds for at least one. The domain fixes the cases being discussed, and the quantifier determines whether all cases or at least one case must satisfy the predicate. Understand universal and existential claims. Quantifiers is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Quantifiers works this concrete case: In Quantifiers, evaluate the labelled model at input 8.",
    howItWorks: "State the domain, evaluate the predicate, search for a counterexample to test a universal claim, or provide one explicit witness to establish an existential claim.",
    whyItWorks: "The domain fixes the cases being discussed, and the quantifier determines whether all cases or at least one case must satisfy the predicate.",
    worked: [
      { prompt: "In Quantifiers, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Quantifiers rule.", "The first stored value is 24.", "24."], answer: "24" },
      { prompt: "Compare the Quantifiers outputs at 8 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Quantifiers restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  590: {
    introduction: "Proof Methods works this concrete case: If slopes AB and BC both equal 4, are A, B, C collinear? The labelled answer is yes. Learn mathematical reasoning. Provides interactive templates for direct proof, contradiction, contrapositive and induction. A common labelled error is using one example as proof of a general statement. Proof Methods keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Proof methods are planned ways to show that a mathematical statement must be true. A proof works because each step follows from a definition, known fact, or previous step. Provides interactive templates for direct proof, contradiction, contrapositive and induction. Proof Methods is the Combinatorics, Graph Theory and Logic rule used to compute one labelled numerical result.",
    basicIdea: "Proof Methods works this concrete case: If slopes AB and BC both equal 4, are A, B, C collinear?",
    howItWorks: "Choose the method that matches the statement, write assumptions clearly, and justify every step.",
    whyItWorks: "A proof works because each step follows from a definition, known fact, or previous step.",
    worked: [
      { prompt: "If slopes AB and BC both equal 4, are A, B, C collinear?", steps: ["Equal consecutive slopes.", "The points share one line.", "yes"], answer: "yes" },
      { prompt: "Does one measured diagram prove a theorem for all cases?", steps: ["Measurement is one example.", "Proof needs general reasons.", "No."], answer: "no" },
      { prompt: "Triangle area 0 for points with x=9,10,11 on y=4. Collinear?", steps: ["Zero area means one line.", "Yes.", "yes"], answer: "yes" }
    ],
  },
  591: {
    introduction: "Simple Interest works this concrete case: Simple interest on 1000 at 5% for 2 years? The labelled answer is 100. Model linear accumulation. Changes principal, rate and time and plots balance. A common labelled error is using P(1+r)^t for a simple-interest question. Simple Interest keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Simple interest is calculated only on the original principal, so equal time periods add equal interest amounts. Because every period uses the same original principal rather than an updated balance, the interest grows by the constant amount Pr per period. Changes principal, rate and time and plots balance. Simple Interest is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Simple Interest works this concrete case: Simple interest on 1000 at 5% for 2 years?",
    howItWorks: "Convert the percentage rate to a decimal, match the rate period to the time unit, compute I=Prt, and add the principal to obtain A=P+I.",
    whyItWorks: "Because every period uses the same original principal rather than an updated balance, the interest grows by the constant amount Pr per period.",
    worked: [
      { prompt: "Simple interest on 1000 at 5% for 2 years?", steps: ["I=PRT/100.", "1000*5*2/100=100.", "100."], answer: "100" },
      { prompt: "Amount after 1 year compound on 1000 at 5%?", steps: ["A=P(1+r).", "1000*(1+5/100).", "1050."], answer: "1050" },
      { prompt: "Is simple interest the same as compound interest after 2 years?", steps: ["Compound adds interest on interest.", "They differ after year 1.", "No."], answer: "no" }
    ],
  },
  592: {
    introduction: "Compound Interest works this concrete case: Simple interest on 300 at 6% for 2 years? The labelled answer is 36. Model repeated growth. Compares compounding frequencies. A common labelled error is using simple interest when interest is compounded. Compound Interest keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Compound interest adds interest to the balance, so future interest is earned on earlier interest. It grows faster than simple interest because the base amount can increase after each compounding period. Compound Interest is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Compound Interest works this concrete case: Simple interest on 300 at 6% for 2 years?",
    howItWorks: "Choose principal, rate, compounding frequency, and time, then multiply by the growth factor.",
    whyItWorks: "It grows faster than simple interest because the base amount can increase after each compounding period.",
    worked: [
      { prompt: "Simple interest on 300 at 6% for 2 years?", steps: ["I=PRT/100.", "300*6*2/100=36.", "36."], answer: "36" },
      { prompt: "Amount after 1 year compound on 300 at 6%?", steps: ["A=P(1+r).", "300*(1+6/100).", "318."], answer: "318" },
      { prompt: "Is simple interest the same as compound interest after 2 years?", steps: ["Compound adds interest on interest.", "They differ after year 1.", "No."], answer: "no" }
    ],
  },
  593: {
    introduction: "Effective Interest Rate works this concrete case: Simple interest on 400 at 7% for 2 years? The labelled answer is 56. Compare nominal rates. Converts nominal rates to effective annual rates. A common labelled error is treating the quoted nominal rate as the effective rate. Effective Interest Rate keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "The effective annual rate is the one-year growth rate after compounding is included. More frequent compounding can make the true annual growth higher than the quoted nominal rate. Converts nominal rates to effective annual rates. Effective Interest Rate is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Effective Interest Rate works this concrete case: Simple interest on 400 at 7% for 2 years?",
    howItWorks: "Convert the nominal rate by applying the compounding frequency for one year.",
    whyItWorks: "More frequent compounding can make the true annual growth higher than the quoted nominal rate.",
    worked: [
      { prompt: "Simple interest on 400 at 7% for 2 years?", steps: ["I=PRT/100.", "400*7*2/100=56.", "56."], answer: "56" },
      { prompt: "Amount after 1 year compound on 400 at 7%?", steps: ["A=P(1+r).", "400*(1+7/100).", "428."], answer: "428" },
      { prompt: "Is simple interest the same as compound interest after 2 years?", steps: ["Compound adds interest on interest.", "They differ after year 1.", "No."], answer: "no" }
    ],
  },
  594: {
    introduction: "Present Value works this concrete case: Simple interest on 500 at 2% for 2 years? The labelled answer is 20. Discount future cash flows. Moves cash flows on a timeline. A common labelled error is reading a future amount as its present value. Present Value keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Present value is the amount today that is equivalent to a future cash flow at a chosen discount rate. Money available today can earn returns, so a future amount is worth less today when the discount rate is positive. Present Value is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Present Value works this concrete case: Simple interest on 500 at 2% for 2 years?",
    howItWorks: "Divide the future value by the growth factor for the time period.",
    whyItWorks: "Money available today can earn returns, so a future amount is worth less today when the discount rate is positive.",
    worked: [
      { prompt: "Simple interest on 500 at 2% for 2 years?", steps: ["I=PRT/100.", "500*2*2/100=20.", "20."], answer: "20" },
      { prompt: "Amount after 1 year compound on 500 at 2%?", steps: ["A=P(1+r).", "500*(1+2/100).", "510."], answer: "510" },
      { prompt: "Is simple interest the same as compound interest after 2 years?", steps: ["Compound adds interest on interest.", "They differ after year 1.", "No."], answer: "no" }
    ],
  },
  595: {
    introduction: "Future Value works this concrete case: Simple interest on 600 at 3% for 2 years? The labelled answer is 36. Accumulate current values. Calculates future balances. A common labelled error is discounting when the problem asks for a future amount. Future Value keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Future value is what a present amount becomes after earning growth for a period of time. A positive return increases the amount by repeated multiplication or accumulation. Future Value is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Future Value works this concrete case: Simple interest on 600 at 3% for 2 years?",
    howItWorks: "Multiply the present value by the growth factor for the time period.",
    whyItWorks: "A positive return increases the amount by repeated multiplication or accumulation.",
    worked: [
      { prompt: "Simple interest on 600 at 3% for 2 years?", steps: ["I=PRT/100.", "600*3*2/100=36.", "36."], answer: "36" },
      { prompt: "Amount after 1 year compound on 600 at 3%?", steps: ["A=P(1+r).", "600*(1+3/100).", "618."], answer: "618" },
      { prompt: "Is simple interest the same as compound interest after 2 years?", steps: ["Compound adds interest on interest.", "They differ after year 1.", "No."], answer: "no" }
    ],
  },
  596: {
    introduction: "Annuities works this concrete case: Simple interest on 700 at 4% for 2 years? The labelled answer is 56. Model regular payments. Builds payment timelines and accumulated values. A common labelled error is treating an annuity as one single payment. Annuities keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An annuity is a stream of equal payments made at regular time intervals. Payments made at different times earn interest for different lengths of time. Builds payment timelines and accumulated values. Annuities is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Annuities works this concrete case: Simple interest on 700 at 4% for 2 years?",
    howItWorks: "Choose payment, rate, and number of payments, then add the time value of every payment.",
    whyItWorks: "Payments made at different times earn interest for different lengths of time.",
    worked: [
      { prompt: "Simple interest on 700 at 4% for 2 years?", steps: ["I=PRT/100.", "700*4*2/100=56.", "56."], answer: "56" },
      { prompt: "Amount after 1 year compound on 700 at 4%?", steps: ["A=P(1+r).", "700*(1+4/100).", "728."], answer: "728" },
      { prompt: "Is simple interest the same as compound interest after 2 years?", steps: ["Compound adds interest on interest.", "They differ after year 1.", "No."], answer: "no" }
    ],
  },
  597: {
    introduction: "Loans and EMIs works this concrete case: Simple interest on 800 at 5% for 2 years? The labelled answer is 80. Understand instalment loans. Splits payments into principal and interest. A common labelled error is using annual rate directly as the monthly rate. Loans and EMIs keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An EMI is an equal monthly payment used to repay a loan with interest over time. Each payment covers interest plus part of the principal. Splits payments into principal and interest. Loans and EMIs is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Loans and EMIs works this concrete case: Simple interest on 800 at 5% for 2 years?",
    howItWorks: "Convert the annual rate to a monthly rate, count months, and apply the EMI formula.",
    whyItWorks: "Each payment covers interest plus part of the principal.",
    worked: [
      { prompt: "Simple interest on 800 at 5% for 2 years?", steps: ["I=PRT/100.", "800*5*2/100=80.", "80."], answer: "80" },
      { prompt: "Amount after 1 year compound on 800 at 5%?", steps: ["A=P(1+r).", "800*(1+5/100).", "840."], answer: "840" },
      { prompt: "Is simple interest the same as compound interest after 2 years?", steps: ["Compound adds interest on interest.", "They differ after year 1.", "No."], answer: "no" }
    ],
  },
  598: {
    introduction: "Amortisation Table works this concrete case: Simple interest on 900 at 6% for 2 years? The labelled answer is 108. Track loan balances. Generates period-by-period schedules. A common labelled error is thinking the interest part is always the same. Amortisation Table keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An amortisation table shows how each loan payment is split between interest and principal. Interest falls over time when the balance falls. Amortisation Table is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Amortisation Table works this concrete case: Simple interest on 900 at 6% for 2 years?",
    howItWorks: "For each period, calculate interest on the opening balance, subtract principal paid, and update the closing balance.",
    whyItWorks: "Interest falls over time when the balance falls.",
    worked: [
      { prompt: "Simple interest on 900 at 6% for 2 years?", steps: ["I=PRT/100.", "900*6*2/100=108.", "108."], answer: "108" },
      { prompt: "Amount after 1 year compound on 900 at 6%?", steps: ["A=P(1+r).", "900*(1+6/100).", "954."], answer: "954" },
      { prompt: "Is simple interest the same as compound interest after 2 years?", steps: ["Compound adds interest on interest.", "They differ after year 1.", "No."], answer: "no" }
    ],
  },
  599: {
    introduction: "Depreciation works this concrete case: In Depreciation, evaluate the labelled model at input 10. The labelled answer is 70. Compare asset-value methods. Plots straight-line and reducing-balance values. A common labelled error is adding depreciation when value should fall. Depreciation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Depreciation models how an asset loses value over time. Many assets become less valuable because of age, use, or newer alternatives. Plots straight-line and reducing-balance values. Depreciation is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Depreciation works this concrete case: In Depreciation, evaluate the labelled model at input 10.",
    howItWorks: "Choose an initial value, depreciation rate, and time, then reduce value each period.",
    whyItWorks: "Many assets become less valuable because of age, use, or newer alternatives.",
    worked: [
      { prompt: "In Depreciation, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Depreciation rule.", "The first stored value is 70.", "70."], answer: "70" },
      { prompt: "Compare the Depreciation outputs at 10 and 17. What is the difference?", steps: ["Second input 17.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Depreciation restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  600: {
    introduction: "Inflation works this concrete case: In Inflation, evaluate the labelled model at input 3. The labelled answer is 6. Understand purchasing-power change. Adjusts prices across time. A common labelled error is always subtracting inflation from prices. Inflation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Inflation is a rise in general price level, so the same money buys less over time. Prices compound when each year's rise is applied to the new price. Inflation is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Inflation works this concrete case: In Inflation, evaluate the labelled model at input 3.",
    howItWorks: "Apply the inflation rate to move a price from one year to another.",
    whyItWorks: "Prices compound when each year's rise is applied to the new price.",
    worked: [
      { prompt: "In Inflation, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Inflation rule.", "The first stored value is 6.", "6."], answer: "6" },
      { prompt: "Compare the Inflation outputs at 3 and 5. What is the difference?", steps: ["Second input 5.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Inflation restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  601: {
    introduction: "Currency Conversion works this concrete case: In Currency Conversion, evaluate the labelled model at input 4. The labelled answer is 12. Apply exchange rates. Converts amounts with editable rates. A common labelled error is using the exchange rate in the wrong direction. Currency Conversion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Currency conversion changes money from one currency to another using an exchange rate. Exchange rates compare the value of one currency with another. Currency Conversion is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Currency Conversion works this concrete case: In Currency Conversion, evaluate the labelled model at input 4.",
    howItWorks: "Multiply by the exchange rate and then include any stated fee or charge.",
    whyItWorks: "Exchange rates compare the value of one currency with another.",
    worked: [
      { prompt: "In Currency Conversion, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Currency Conversion rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Currency Conversion outputs at 4 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Currency Conversion restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  602: {
    introduction: "Profit, Loss, Markup and Margin works this concrete case: SP=100, CP=80. Find the profit. The labelled answer is 20. Distinguish commercial measures. Links cost, selling price, profit, markup and margin. A common labelled error is using markup and margin as the same percent. Profit, Loss, Markup and Margin keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Profit is selling price minus cost; loss occurs when selling price is below cost. Markup uses cost as base, while margin uses selling price as base. Links cost, selling price, profit, markup and margin. Profit, Loss, Markup and Margin is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Profit, Loss, Markup and Margin works this concrete case: SP=100, CP=80. Find the profit.",
    howItWorks: "Compare cost and selling price, then divide by the correct base for markup or margin.",
    whyItWorks: "Markup uses cost as base, while margin uses selling price as base.",
    worked: [
      { prompt: "SP=100, CP=80. Find the profit.", steps: ["Profit=SP-CP.", "20.", "20."], answer: "20" },
      { prompt: "A 4% tax on 500?", steps: ["Tax=rate×amount.", "20.", "20."], answer: "20" },
      { prompt: "Is selling price always greater than cost price?", steps: ["A loss has SP < CP.", "No.", "No."], answer: "no" }
    ],
  },
  603: {
    introduction: "Break-Even Analysis works this concrete case: In Break-Even Analysis, evaluate the labelled model at input 6. The labelled answer is 30. Find revenue-cost equality. Plots cost and revenue lines and marks break-even. A common labelled error is ignoring fixed cost when finding break-even. Break-Even Analysis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Break-even is the point where total revenue equals total cost. Before break-even there is loss; after break-even there can be profit. Plots cost and revenue lines and marks break-even. Break-Even Analysis is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Break-Even Analysis works this concrete case: In Break-Even Analysis, evaluate the labelled model at input 6.",
    howItWorks: "Set revenue equal to fixed cost plus variable cost, then solve for units.",
    whyItWorks: "Before break-even there is loss; after break-even there can be profit.",
    worked: [
      { prompt: "In Break-Even Analysis, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Break-Even Analysis rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Break-Even Analysis outputs at 6 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Break-Even Analysis restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  604: {
    introduction: "Tax and Discounts works this concrete case: SP=140, CP=112. Find the profit. The labelled answer is 28. Apply sequential percentage changes. Shows order effects and final price. A common labelled error is applying tax or discount to the wrong base price. Tax and Discounts keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Discount lowers a marked price, while tax adds a percent to the taxable amount. Percent changes depend on the base amount used at that step. Tax and Discounts is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Tax and Discounts works this concrete case: SP=140, CP=112. Find the profit.",
    howItWorks: "Apply discount first when stated, then apply tax to the discounted price.",
    whyItWorks: "Percent changes depend on the base amount used at that step.",
    worked: [
      { prompt: "SP=140, CP=112. Find the profit.", steps: ["Profit=SP-CP.", "28.", "28."], answer: "28" },
      { prompt: "A 6% tax on 700?", steps: ["Tax=rate×amount.", "42.", "42."], answer: "42" },
      { prompt: "Is selling price always greater than cost price?", steps: ["A loss has SP < CP.", "No.", "No."], answer: "no" }
    ],
  },
  605: {
    introduction: "Investment Comparison works this concrete case: In Investment Comparison, evaluate the labelled model at input 8. The labelled answer is 56. Compare scenarios. Plots multiple growth paths and risk assumptions. A common labelled error is comparing investments over different time periods without adjustment. Investment Comparison keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Investment comparison checks which option gives the better result under stated assumptions. A fair comparison keeps common assumptions equal. Plots multiple growth paths and risk assumptions. Investment Comparison is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Investment Comparison works this concrete case: In Investment Comparison, evaluate the labelled model at input 8.",
    howItWorks: "Use the same starting amount and time, calculate each plan, and compare final values and risk notes.",
    whyItWorks: "A fair comparison keeps common assumptions equal.",
    worked: [
      { prompt: "In Investment Comparison, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Investment Comparison rule.", "The first stored value is 56.", "56."], answer: "56" },
      { prompt: "Compare the Investment Comparison outputs at 8 and 15. What is the difference?", steps: ["Second input 15.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Investment Comparison restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  606: {
    introduction: "Model Builder works this concrete case: In Model Builder, evaluate the labelled model at input 9. The labelled answer is 18. Translate scenarios into equations. Defines variables, assumptions and relationships. A common labelled error is thinking a model is exactly the real world. Model Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A model builder turns a real situation into variables, assumptions, and equations. Models help us predict and test scenarios, but they depend on assumptions. Defines variables, assumptions and relationships. Model Builder is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Model Builder works this concrete case: In Model Builder, evaluate the labelled model at input 9.",
    howItWorks: "Name the input, write the rule, calculate outputs, and compare with the context.",
    whyItWorks: "Models help us predict and test scenarios, but they depend on assumptions.",
    worked: [
      { prompt: "In Model Builder, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Model Builder rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Model Builder outputs at 9 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "2."], answer: "2" },
      { prompt: "Can you skip the Model Builder restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  607: {
    introduction: "Linear Models works this concrete case: In Linear Models, evaluate the labelled model at input 10. The labelled answer is 30. Represent constant change. Fits or constructs linear relationships. A common labelled error is using a linear model when the change is not constant. Linear Models keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A linear model changes by a constant amount for each equal step in input. The graph is a straight line because the rate of change is constant. Fits or constructs linear relationships. Linear Models is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Linear Models works this concrete case: In Linear Models, evaluate the labelled model at input 10.",
    howItWorks: "Find the starting value and constant change, then write y = mx + b.",
    whyItWorks: "The graph is a straight line because the rate of change is constant.",
    worked: [
      { prompt: "In Linear Models, evaluate the labelled model at input 10.", steps: ["Substitute 10 into the Linear Models rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Linear Models outputs at 10 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Linear Models restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  608: {
    introduction: "Quadratic Models works this concrete case: In Quadratic Models, evaluate the labelled model at input 3. The labelled answer is 12. Represent curved trajectories or optimisation. Adjusts coefficients and interprets features. A common labelled error is using a straight-line model for curved change. Quadratic Models keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A quadratic model has a squared term, so its graph is a parabola. The squared term makes the rate of change itself change. Represent curved trajectories or optimisation. Adjusts coefficients and interprets features. Quadratic Models is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Quadratic Models works this concrete case: In Quadratic Models, evaluate the labelled model at input 3.",
    howItWorks: "Use the coefficients and input value to calculate ax^2 + bx + c.",
    whyItWorks: "The squared term makes the rate of change itself change.",
    worked: [
      { prompt: "In Quadratic Models, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Quadratic Models rule.", "The first stored value is 12.", "12."], answer: "12" },
      { prompt: "Compare the Quadratic Models outputs at 3 and 7. What is the difference?", steps: ["Second input 7.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Quadratic Models restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  609: {
    introduction: "Exponential and Logistic Models works this concrete case: In Exponential and Logistic Models, evaluate the labelled model at input 4. The labelled answer is 20. Represent growth processes. Compares unlimited and constrained growth. A common labelled error is using exponential growth forever when a limit exists. Exponential and Logistic Models keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Exponential models grow by a constant factor, while logistic models slow as they approach a limit. Repeated multiplication gives exponential change; limits cause logistic levelling. Compares unlimited and constrained growth. Exponential and Logistic Models is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Exponential and Logistic Models works this concrete case: In Exponential and Logistic Models, evaluate the labelled model at input 4.",
    howItWorks: "Choose whether the situation has unlimited factor growth or a carrying capacity.",
    whyItWorks: "Repeated multiplication gives exponential change; limits cause logistic levelling.",
    worked: [
      { prompt: "In Exponential and Logistic Models, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Exponential and Logistic Models rule.", "The first stored value is 20.", "20."], answer: "20" },
      { prompt: "Compare the Exponential and Logistic Models outputs at 4 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "5."], answer: "5" },
      { prompt: "Can you skip the Exponential and Logistic Models restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  610: {
    introduction: "Periodic Models works this concrete case: In Periodic Models, evaluate the labelled model at input 5. The labelled answer is 30. Represent cycles. Fits trigonometric functions to seasonal data. A common labelled error is treating a repeating pattern as only an upward or downward trend. Periodic Models keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A periodic model repeats a pattern after a fixed interval called a period. Cycles repeat because the same conditions return after each period. Fits trigonometric functions to seasonal data. Periodic Models is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Periodic Models works this concrete case: In Periodic Models, evaluate the labelled model at input 5.",
    howItWorks: "Find the baseline, amplitude, and period, then match the repeating cycle.",
    whyItWorks: "Cycles repeat because the same conditions return after each period.",
    worked: [
      { prompt: "In Periodic Models, evaluate the labelled model at input 5.", steps: ["Substitute 5 into the Periodic Models rule.", "The first stored value is 30.", "30."], answer: "30" },
      { prompt: "Compare the Periodic Models outputs at 5 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Periodic Models restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  611: {
    introduction: "Piecewise Models works this concrete case: In Piecewise Models, evaluate the labelled model at input 6. The labelled answer is 42. Represent rule changes. Creates interval-specific formulas. A common labelled error is using the wrong formula for the input interval. Piecewise Models keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A piecewise model uses different formulas on different input intervals. One rule may not describe every part of a real situation. Piecewise Models is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Piecewise Models works this concrete case: In Piecewise Models, evaluate the labelled model at input 6.",
    howItWorks: "Find which interval contains the input, then use only that interval's rule.",
    whyItWorks: "One rule may not describe every part of a real situation.",
    worked: [
      { prompt: "In Piecewise Models, evaluate the labelled model at input 6.", steps: ["Substitute 6 into the Piecewise Models rule.", "The first stored value is 42.", "42."], answer: "42" },
      { prompt: "Compare the Piecewise Models outputs at 6 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Piecewise Models restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  612: {
    introduction: "Parameter Estimation works this concrete case: Round 7080 to the nearest hundred. The labelled answer is 7100. Fit model inputs. Uses sliders or regression to reduce error. A common labelled error is expecting estimates to match every data point exactly. Parameter Estimation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Parameter estimation chooses model values that make predictions fit observed data. Good parameters reduce error while keeping the model meaningful. Uses sliders or regression to reduce error. Parameter Estimation is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Parameter Estimation works this concrete case: Round 7080 to the nearest hundred.",
    howItWorks: "Pick a model form, estimate its parameters, then compare predictions with observations.",
    whyItWorks: "Good parameters reduce error while keeping the model meaningful.",
    worked: [
      { prompt: "Round 7080 to the nearest hundred.", steps: ["Look at the tens digit 8.", "8≥5 so round up.", "7100."], answer: "7100" },
      { prompt: "Estimate 133 by rounding 19 to 20.", steps: ["7*20=140.", "140.", "140."], answer: "140" },
      { prompt: "Do you inspect every digit before choosing the rounding place?", steps: ["Choose the place first.", "Then look only at the next digit.", "No."], answer: "no" }
    ],
  },
  613: {
    introduction: "Dimensional Analysis works this concrete case: In Dimensional Analysis, evaluate the labelled model at input 8. The labelled answer is 24. Check unit consistency. Tracks units through formulas. A common labelled error is calculating with numbers but ignoring units. Dimensional Analysis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Dimensional analysis checks that units combine correctly in a calculation. A formula is meaningful only when its units make sense. Dimensional Analysis is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Dimensional Analysis works this concrete case: In Dimensional Analysis, evaluate the labelled model at input 8.",
    howItWorks: "Write units beside numbers, cancel matching units, and check the final unit.",
    whyItWorks: "A formula is meaningful only when its units make sense.",
    worked: [
      { prompt: "In Dimensional Analysis, evaluate the labelled model at input 8.", steps: ["Substitute 8 into the Dimensional Analysis rule.", "The first stored value is 24.", "24."], answer: "24" },
      { prompt: "Compare the Dimensional Analysis outputs at 8 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "3."], answer: "3" },
      { prompt: "Can you skip the Dimensional Analysis restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  614: {
    introduction: "Sensitivity Analysis works this concrete case: In Sensitivity Analysis, evaluate the labelled model at input 9. The labelled answer is 36. Understand input impact. Changes one or more assumptions and compares outputs. A common labelled error is changing many assumptions at once and blaming one input. Sensitivity Analysis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Sensitivity analysis studies how an output changes when one input assumption changes. It shows which assumptions matter most to a model result. Changes one or more assumptions and compares outputs. Sensitivity Analysis is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Sensitivity Analysis works this concrete case: In Sensitivity Analysis, evaluate the labelled model at input 9.",
    howItWorks: "Change one input at a time while holding others fixed, then measure the output difference.",
    whyItWorks: "It shows which assumptions matter most to a model result.",
    worked: [
      { prompt: "In Sensitivity Analysis, evaluate the labelled model at input 9.", steps: ["Substitute 9 into the Sensitivity Analysis rule.", "The first stored value is 36.", "36."], answer: "36" },
      { prompt: "Compare the Sensitivity Analysis outputs at 9 and 13. What is the difference?", steps: ["Second input 13.", "Difference uses the same rule.", "4."], answer: "4" },
      { prompt: "Can you skip the Sensitivity Analysis restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  615: {
    introduction: "Residual and Error Analysis works this concrete case: Residual at x=10 if y=10 and ŷ=5. The labelled answer is 5. Evaluate model quality. Plots prediction errors. A common labelled error is ignoring the sign of a residual. Residual and Error Analysis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A residual is observed value minus predicted value. Residuals show where a model overestimates or underestimates data. Residual and Error Analysis is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Residual and Error Analysis works this concrete case: Residual at x=10 if y=10 and ŷ=5.",
    howItWorks: "Calculate the prediction, subtract it from the observation, and inspect the pattern of residuals.",
    whyItWorks: "Residuals show where a model overestimates or underestimates data.",
    worked: [
      { prompt: "Residual at x=10 if y=10 and ŷ=5.", steps: ["residual=y-ŷ.", "10-5=5.", "5."], answer: "5" },
      { prompt: "If slope=5 and intercept=10, find ŷ(10).", steps: ["ŷ=5x+10.", "5*10+10.", "60."], answer: "60" },
      { prompt: "Does a residual of 0 at one point prove the line fits every point?", steps: ["One zero residual is one hit.", "Check all residuals.", "No."], answer: "no" }
    ],
  },
  616: {
    introduction: "Scenario Comparison works this concrete case: In Scenario Comparison, evaluate the labelled model at input 3. The labelled answer is 18. Compare assumptions. Displays multiple models side by side. A common labelled error is comparing scenarios with hidden different starting values. Scenario Comparison keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Scenario comparison tests different assumptions to see how outcomes change. It helps decision-making when the future is uncertain. Scenario Comparison is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Scenario Comparison works this concrete case: In Scenario Comparison, evaluate the labelled model at input 3.",
    howItWorks: "Build a base case, change assumptions for each scenario, and compare outputs fairly.",
    whyItWorks: "It helps decision-making when the future is uncertain.",
    worked: [
      { prompt: "In Scenario Comparison, evaluate the labelled model at input 3.", steps: ["Substitute 3 into the Scenario Comparison rule.", "The first stored value is 18.", "18."], answer: "18" },
      { prompt: "Compare the Scenario Comparison outputs at 3 and 9. What is the difference?", steps: ["Second input 9.", "Difference uses the same rule.", "6."], answer: "6" },
      { prompt: "Can you skip the Scenario Comparison restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  617: {
    introduction: "Linear Programming works this concrete case: In Linear Programming, evaluate the labelled model at input 4. The labelled answer is 28. Optimise under constraints. Shades feasible regions and tests objective values. A common labelled error is choosing the largest objective value without checking constraints. Linear Programming keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Linear programming optimises a linear objective while satisfying linear constraints. For linear objectives over a bounded polygon, an optimum occurs at a corner point. Shades feasible regions and tests objective values. Linear Programming is the Financial Mathematics and Modelling rule used to compute one labelled numerical result.",
    basicIdea: "Linear Programming works this concrete case: In Linear Programming, evaluate the labelled model at input 4.",
    howItWorks: "Graph or list the feasible region, then test the objective at feasible corner points.",
    whyItWorks: "For linear objectives over a bounded polygon, an optimum occurs at a corner point.",
    worked: [
      { prompt: "In Linear Programming, evaluate the labelled model at input 4.", steps: ["Substitute 4 into the Linear Programming rule.", "The first stored value is 28.", "28."], answer: "28" },
      { prompt: "Compare the Linear Programming outputs at 4 and 11. What is the difference?", steps: ["Second input 11.", "Difference uses the same rule.", "7."], answer: "7" },
      { prompt: "Can you skip the Linear Programming restriction and still trust the chart?", steps: ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], answer: "no" }
    ],
  },
  618: {
    introduction: "Slider Component works this concrete case: A slider from 0 to 50 with step 2: how many steps from 0 to max? The labelled answer is 25. Expose adjustable parameters. Adds configurable numeric or angle sliders. A common labelled error is leaving the slider without a clear range. Slider Component keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A slider is a control that lets a learner choose a number from a fixed range. A range prevents impossible values and makes change visible. Adds configurable numeric or angle sliders. Slider Component is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Slider Component works this concrete case: A slider from 0 to 50 with step 2: how many steps from 0 to max?",
    howItWorks: "Set a minimum, maximum, step size, label, and linked value.",
    whyItWorks: "A range prevents impossible values and makes change visible.",
    worked: [
      { prompt: "A slider from 0 to 50 with step 2: how many steps from 0 to max?", steps: ["50/2.", "25.", "25."], answer: "25" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  619: {
    introduction: "Checkbox works this concrete case: A slider from 0 to 60 with step 3: how many steps from 0 to max? The labelled answer is 20. Control visibility and states. Toggles objects, hints or solution layers. A common labelled error is using one checkbox for many choices. Checkbox keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A checkbox is a control for a yes-or-no choice. Binary controls help learners compare two states clearly. Toggles objects, hints or solution layers. Checkbox is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Checkbox works this concrete case: A slider from 0 to 60 with step 3: how many steps from 0 to max?",
    howItWorks: "Use it to show, hide, enable, or disable one feature.",
    whyItWorks: "Binary controls help learners compare two states clearly.",
    worked: [
      { prompt: "A slider from 0 to 60 with step 3: how many steps from 0 to max?", steps: ["60/3.", "20.", "20."], answer: "20" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  620: {
    introduction: "Button works this concrete case: A slider from 0 to 70 with step 4: how many steps from 0 to max? The labelled answer is 17. Trigger actions. Runs reset, randomise, reveal or animation commands. A common labelled error is using a button label like click here. Button keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A button runs one clear command when the learner activates it. A single command reduces confusion and supports repeatable practice. Runs reset, randomise, reveal or animation commands. Button is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Button works this concrete case: A slider from 0 to 70 with step 4: how many steps from 0 to max?",
    howItWorks: "Give the button a short label and connect it to one action.",
    whyItWorks: "A single command reduces confusion and supports repeatable practice.",
    worked: [
      { prompt: "A slider from 0 to 70 with step 4: how many steps from 0 to max?", steps: ["70/4.", "17.", "17."], answer: "17" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  621: {
    introduction: "Input Box works this concrete case: A slider from 0 to 80 with step 5: how many steps from 0 to max? The labelled answer is 16. Accept learner responses. Links entered values or expressions to objects. A common labelled error is accepting any typed text as correct. Input Box keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An input box lets a learner type a number, word, or expression. Validation gives feedback while preserving exact learner input. Links entered values or expressions to objects. Input Box is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Input Box works this concrete case: A slider from 0 to 80 with step 5: how many steps from 0 to max?",
    howItWorks: "Choose the accepted format and validate the typed answer.",
    whyItWorks: "Validation gives feedback while preserving exact learner input.",
    worked: [
      { prompt: "A slider from 0 to 80 with step 5: how many steps from 0 to max?", steps: ["80/5.", "16.", "16."], answer: "16" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  622: {
    introduction: "Drop-Down List works this concrete case: A slider from 0 to 90 with step 6: how many steps from 0 to max? The labelled answer is 15. Select cases or datasets. Switches functions, objects or scenarios. A common labelled error is putting too many unrelated choices in one list. Drop-Down List keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A drop-down list lets a learner choose one option from a prepared list. Prepared choices reduce typing errors and focus attention. Switches functions, objects or scenarios. Drop-Down List is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Drop-Down List works this concrete case: A slider from 0 to 90 with step 6: how many steps from 0 to max?",
    howItWorks: "Write clear choices and connect the selected choice to feedback.",
    whyItWorks: "Prepared choices reduce typing errors and focus attention.",
    worked: [
      { prompt: "A slider from 0 to 90 with step 6: how many steps from 0 to max?", steps: ["90/6.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  623: {
    introduction: "Dynamic Text works this concrete case: A slider from 0 to 100 with step 7: how many steps from 0 to max? The labelled answer is 14. Create live explanations. Embeds changing values and formulas in instructional text. A common labelled error is typing a value that should update by hand. Dynamic Text keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Dynamic text is text that updates when linked values change. Learners can read the changing result without guessing. Embeds changing values and formulas in instructional text. Dynamic Text is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Dynamic Text works this concrete case: A slider from 0 to 100 with step 7: how many steps from 0 to max?",
    howItWorks: "Bind the text to a variable, answer, or object property.",
    whyItWorks: "Learners can read the changing result without guessing.",
    worked: [
      { prompt: "A slider from 0 to 100 with step 7: how many steps from 0 to max?", steps: ["100/7.", "14.", "14."], answer: "14" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  624: {
    introduction: "Formula Display works this concrete case: A slider from 0 to 30 with step 2: how many steps from 0 to max? The labelled answer is 15. Present mathematical notation. Renders LaTeX expressions. A common labelled error is showing symbols without meanings. Formula Display keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A formula display shows a mathematical rule in readable notation. Readable formulas connect the visual model to exact mathematics. Formula Display is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Formula Display works this concrete case: A slider from 0 to 30 with step 2: how many steps from 0 to max?",
    howItWorks: "Use clear symbols, define variables, and link values when needed.",
    whyItWorks: "Readable formulas connect the visual model to exact mathematics.",
    worked: [
      { prompt: "A slider from 0 to 30 with step 2: how many steps from 0 to max?", steps: ["30/2.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  625: {
    introduction: "Image Object works this concrete case: A slider from 0 to 40 with step 3: how many steps from 0 to max? The labelled answer is 13. Add contextual visuals. Places diagrams or backgrounds. A common labelled error is adding an image without text description. Image Object keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An image object places a picture in the lesson workspace. Images support learning when they are clear and accessible. Image Object is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Image Object works this concrete case: A slider from 0 to 40 with step 3: how many steps from 0 to max?",
    howItWorks: "Set source, size, position, and alt text.",
    whyItWorks: "Images support learning when they are clear and accessible.",
    worked: [
      { prompt: "A slider from 0 to 40 with step 3: how many steps from 0 to max?", steps: ["40/3.", "13.", "13."], answer: "13" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  626: {
    introduction: "Audio and Video works this concrete case: A slider from 0 to 50 with step 4: how many steps from 0 to max? The labelled answer is 12. Support multimedia learning. Embeds explanations or demonstrations. A common labelled error is using video without captions. Audio and Video keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Audio and video objects play recorded sound or moving media. Captions and controls let learners review at their own pace. Audio and Video is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Audio and Video works this concrete case: A slider from 0 to 50 with step 4: how many steps from 0 to max?",
    howItWorks: "Add controls, captions, and a clear learning purpose.",
    whyItWorks: "Captions and controls let learners review at their own pace.",
    worked: [
      { prompt: "A slider from 0 to 50 with step 4: how many steps from 0 to max?", steps: ["50/4.", "12.", "12."], answer: "12" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  627: {
    introduction: "Pen and Highlighter works this concrete case: A slider from 0 to 60 with step 5: how many steps from 0 to max? The labelled answer is 12. Annotate work. Allows freehand drawing and emphasis. A common labelled error is highlighting without a learning target. Pen and Highlighter keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Pen and highlighter tools let learners mark important parts. Marking supports attention, comparison, and correction. Pen and Highlighter is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Pen and Highlighter works this concrete case: A slider from 0 to 60 with step 5: how many steps from 0 to max?",
    howItWorks: "Choose colour, thickness, and whether marks can be erased.",
    whyItWorks: "Marking supports attention, comparison, and correction.",
    worked: [
      { prompt: "A slider from 0 to 60 with step 5: how many steps from 0 to max?", steps: ["60/5.", "12.", "12."], answer: "12" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  628: {
    introduction: "Tables works this concrete case: A slider from 0 to 70 with step 6: how many steps from 0 to max? The labelled answer is 11. Present organised values. Creates editable or calculated tables. A common labelled error is using numbers without row or column labels. Tables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A table organises values into rows and columns. Tables make patterns and comparisons easy to scan. Tables is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Tables works this concrete case: A slider from 0 to 70 with step 6: how many steps from 0 to max?",
    howItWorks: "Set headings, units, editable cells, and feedback rules.",
    whyItWorks: "Tables make patterns and comparisons easy to scan.",
    worked: [
      { prompt: "A slider from 0 to 70 with step 6: how many steps from 0 to max?", steps: ["70/6.", "11.", "11."], answer: "11" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  629: {
    introduction: "Multiple Pages works this concrete case: A slider from 0 to 80 with step 7: how many steps from 0 to max? The labelled answer is 11. Build lesson sequences. Combines several canvases in one activity. A common labelled error is putting every task on one crowded page. Multiple Pages keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Multiple pages split a lesson into ordered screens. Small pages reduce overload and support step-by-step learning. Combines several canvases in one activity. Multiple Pages is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Multiple Pages works this concrete case: A slider from 0 to 80 with step 7: how many steps from 0 to max?",
    howItWorks: "Give each page one clear purpose and keep state consistent.",
    whyItWorks: "Small pages reduce overload and support step-by-step learning.",
    worked: [
      { prompt: "A slider from 0 to 80 with step 7: how many steps from 0 to max?", steps: ["80/7.", "11.", "11."], answer: "11" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  630: {
    introduction: "Reset Construction works this concrete case: A slider from 0 to 90 with step 2: how many steps from 0 to max? The labelled answer is 45. Restore initial state. Returns all objects and values to defaults. A common labelled error is resetting only one object. Reset Construction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Reset construction returns a lesson to a known starting state. Reset lets learners try again without rebuilding the activity. Returns all objects and values to defaults. Reset Construction is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Reset Construction works this concrete case: A slider from 0 to 90 with step 2: how many steps from 0 to max?",
    howItWorks: "Store the starting state and restore all linked values.",
    whyItWorks: "Reset lets learners try again without rebuilding the activity.",
    worked: [
      { prompt: "A slider from 0 to 90 with step 2: how many steps from 0 to max?", steps: ["90/2.", "45.", "45."], answer: "45" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  631: {
    introduction: "Undo and Redo works this concrete case: A slider from 0 to 100 with step 3: how many steps from 0 to max? The labelled answer is 33. Support experimentation. Reverses or restores actions. A common labelled error is trying to undo without storing actions. Undo and Redo keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Undo reverses the last action, and redo reapplies it. Action history helps learners correct mistakes without losing work. Undo and Redo is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Undo and Redo works this concrete case: A slider from 0 to 100 with step 3: how many steps from 0 to max?",
    howItWorks: "Record actions in order and step backward or forward safely.",
    whyItWorks: "Action history helps learners correct mistakes without losing work.",
    worked: [
      { prompt: "A slider from 0 to 100 with step 3: how many steps from 0 to max?", steps: ["100/3.", "33.", "33."], answer: "33" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  632: {
    introduction: "Object Locking works this concrete case: A slider from 0 to 30 with step 4: how many steps from 0 to max? The labelled answer is 7. Protect instructional elements. Prevents accidental movement or editing. A common labelled error is locking objects learners must manipulate. Object Locking keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Object locking prevents selected objects from being changed by accident. Locking protects instructions, axes, and reference shapes. Prevents accidental movement or editing. Object Locking is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Object Locking works this concrete case: A slider from 0 to 30 with step 4: how many steps from 0 to max?",
    howItWorks: "Lock fixed objects and leave learning objects editable.",
    whyItWorks: "Locking protects instructions, axes, and reference shapes.",
    worked: [
      { prompt: "A slider from 0 to 30 with step 4: how many steps from 0 to max?", steps: ["30/4.", "7.", "7."], answer: "7" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  633: {
    introduction: "Conditional Feedback works this concrete case: A slider from 0 to 40 with step 5: how many steps from 0 to max? The labelled answer is 8. Respond to learner input. Shows targeted messages based on correctness. A common labelled error is giving only correct or wrong messages. Conditional Feedback keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Conditional feedback changes message based on a learner action or answer. Feedback helps learners know what to fix next. Shows targeted messages based on correctness. Conditional Feedback is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Conditional Feedback works this concrete case: A slider from 0 to 40 with step 5: how many steps from 0 to max?",
    howItWorks: "Write rules for correct, close, and incorrect states.",
    whyItWorks: "Feedback helps learners know what to fix next.",
    worked: [
      { prompt: "A slider from 0 to 40 with step 5: how many steps from 0 to max?", steps: ["40/5.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  634: {
    introduction: "Custom Tool Builder works this concrete case: A slider from 0 to 50 with step 6: how many steps from 0 to max? The labelled answer is 8. Reuse construction procedures. Packages selected inputs and outputs as a tool. A common labelled error is building a tool without clear inputs. Custom Tool Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A custom tool packages repeated construction steps into one reusable tool. Custom tools save time and keep repeated work consistent. Packages selected inputs and outputs as a tool. Custom Tool Builder is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Custom Tool Builder works this concrete case: A slider from 0 to 50 with step 6: how many steps from 0 to max?",
    howItWorks: "Choose inputs, outputs, and the exact construction steps.",
    whyItWorks: "Custom tools save time and keep repeated work consistent.",
    worked: [
      { prompt: "A slider from 0 to 50 with step 6: how many steps from 0 to max?", steps: ["50/6.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  635: {
    introduction: "Command Library works this concrete case: A slider from 0 to 60 with step 7: how many steps from 0 to max? The labelled answer is 8. Expose advanced functionality. Provides searchable commands by domain. A common labelled error is typing command inputs without checking order. Command Library keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A command library is a set of ready commands for creating or changing objects. Commands make complex actions exact and repeatable. Command Library is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Command Library works this concrete case: A slider from 0 to 60 with step 7: how many steps from 0 to max?",
    howItWorks: "Search the command, read its inputs, and apply it carefully.",
    whyItWorks: "Commands make complex actions exact and repeatable.",
    worked: [
      { prompt: "A slider from 0 to 60 with step 7: how many steps from 0 to max?", steps: ["60/7.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  636: {
    introduction: "Object Scripting works this concrete case: A slider from 0 to 70 with step 2: how many steps from 0 to max? The labelled answer is 35. Create responsive activities. Runs code on click, update or drag. A common labelled error is putting a script on the wrong event. Object Scripting keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Object scripting runs small code actions when an object changes or is clicked. Scripts automate feedback, updates, and special interactions. Object Scripting is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Object Scripting works this concrete case: A slider from 0 to 70 with step 2: how many steps from 0 to max?",
    howItWorks: "Attach the script to the correct event and test the result.",
    whyItWorks: "Scripts automate feedback, updates, and special interactions.",
    worked: [
      { prompt: "A slider from 0 to 70 with step 2: how many steps from 0 to max?", steps: ["70/2.", "35.", "35."], answer: "35" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  637: {
    introduction: "Randomisation works this concrete case: A slider from 0 to 80 with step 3: how many steps from 0 to max? The labelled answer is 26. Generate varied practice. Creates new values, points or datasets. A common labelled error is randomising values that make bad questions. Randomisation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Randomisation creates varied values or questions within chosen limits. Controlled variety gives practice without impossible cases. Randomisation is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Randomisation works this concrete case: A slider from 0 to 80 with step 3: how many steps from 0 to max?",
    howItWorks: "Set a range, constraints, and saved answer key.",
    whyItWorks: "Controlled variety gives practice without impossible cases.",
    worked: [
      { prompt: "A slider from 0 to 80 with step 3: how many steps from 0 to max?", steps: ["80/3.", "26.", "26."], answer: "26" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  638: {
    introduction: "Automatic Checking works this concrete case: A slider from 0 to 90 with step 4: how many steps from 0 to max? The labelled answer is 22. Validate learner constructions. Tests mathematical conditions rather than fixed positions. A common labelled error is rejecting correct equivalent answers. Automatic Checking keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Automatic checking compares a learner response with an accepted answer rule. Checking gives fast feedback and supports independent practice. Tests mathematical conditions rather than fixed positions. Automatic Checking is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Automatic Checking works this concrete case: A slider from 0 to 90 with step 4: how many steps from 0 to max?",
    howItWorks: "Define accepted answers, tolerance, and feedback messages.",
    whyItWorks: "Checking gives fast feedback and supports independent practice.",
    worked: [
      { prompt: "A slider from 0 to 90 with step 4: how many steps from 0 to max?", steps: ["90/4.", "22.", "22."], answer: "22" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  639: {
    introduction: "Import and Export works this concrete case: A slider from 0 to 100 with step 5: how many steps from 0 to max? The labelled answer is 20. Share authored activities. Saves, loads and distributes constructions. A common labelled error is importing a file without checking format. Import and Export keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Import brings content in, and export saves content out. Import and export help teachers share and reuse activities. Saves, loads and distributes constructions. Import and Export is the Interactive Authoring rule used to compute one labelled numerical result.",
    basicIdea: "Import and Export works this concrete case: A slider from 0 to 100 with step 5: how many steps from 0 to max?",
    howItWorks: "Check file type, data fields, and compatibility.",
    whyItWorks: "Import and export help teachers share and reuse activities.",
    worked: [
      { prompt: "A slider from 0 to 100 with step 5: how many steps from 0 to max?", steps: ["100/5.", "20.", "20."], answer: "20" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  640: {
    introduction: "Concept Introduction works this concrete case: A slider from 0 to 30 with step 6: how many steps from 0 to max? The labelled answer is 5. Introduce definitions and notation. Combines concise text, animation and examples. A common labelled error is starting with many rules before meaning. Concept Introduction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A concept introduction gives the first clear meaning of a new idea. A strong introduction gives learners a mental hook before practice. Combines concise text, animation and examples. Concept Introduction is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Concept Introduction works this concrete case: A slider from 0 to 30 with step 6: how many steps from 0 to max?",
    howItWorks: "State the idea, show one model, and connect it to a need.",
    whyItWorks: "A strong introduction gives learners a mental hook before practice.",
    worked: [
      { prompt: "A slider from 0 to 30 with step 6: how many steps from 0 to max?", steps: ["30/6.", "5.", "5."], answer: "5" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  641: {
    introduction: "Visualise works this concrete case: A slider from 0 to 40 with step 7: how many steps from 0 to max? The labelled answer is 5. Build conceptual understanding. Shows a dynamic model before formal procedure. A common labelled error is using a visual that does not explain the idea. Visualise keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Visualise means showing an idea with a picture, graph, model, or animation. Good visuals reveal structure that text alone may hide. Shows a dynamic model before formal procedure. Visualise is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Visualise works this concrete case: A slider from 0 to 40 with step 7: how many steps from 0 to max?",
    howItWorks: "Choose a visual that matches the exact concept.",
    whyItWorks: "Good visuals reveal structure that text alone may hide.",
    worked: [
      { prompt: "A slider from 0 to 40 with step 7: how many steps from 0 to max?", steps: ["40/7.", "5.", "5."], answer: "5" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  642: {
    introduction: "Manipulative Laboratory works this concrete case: A slider from 0 to 50 with step 2: how many steps from 0 to max? The labelled answer is 25. Learn by changing objects. Allows dragging, resizing, rotating and parameter changes. A common labelled error is letting learners change things without a question. Manipulative Laboratory keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A manipulative laboratory lets learners test ideas by changing objects. Hands-on change builds understanding through evidence. Allows dragging, resizing, rotating and parameter changes. Manipulative Laboratory is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Manipulative Laboratory works this concrete case: A slider from 0 to 50 with step 2: how many steps from 0 to max?",
    howItWorks: "Provide controls, observations, and a focused question.",
    whyItWorks: "Hands-on change builds understanding through evidence.",
    worked: [
      { prompt: "A slider from 0 to 50 with step 2: how many steps from 0 to max?", steps: ["50/2.", "25.", "25."], answer: "25" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  643: {
    introduction: "Guided Exploration works this concrete case: A slider from 0 to 60 with step 3: how many steps from 0 to max? The labelled answer is 20. Direct discovery. Provides sequenced prompts and checks. A common labelled error is asking random questions without order. Guided Exploration keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Guided exploration leads learners through a sequence of observations. Guidance keeps exploration purposeful and reduces guessing. Guided Exploration is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Guided Exploration works this concrete case: A slider from 0 to 60 with step 3: how many steps from 0 to max?",
    howItWorks: "Ask learners to predict, test, observe, and explain.",
    whyItWorks: "Guidance keeps exploration purposeful and reduces guessing.",
    worked: [
      { prompt: "A slider from 0 to 60 with step 3: how many steps from 0 to max?", steps: ["60/3.", "20.", "20."], answer: "20" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  644: {
    introduction: "Predict–Test–Explain works this concrete case: A slider from 0 to 70 with step 4: how many steps from 0 to max? The labelled answer is 17. Develop reasoning. Records a prediction before revealing model behaviour. A common labelled error is testing first and predicting later. Predict–Test–Explain keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Predict-Test-Explain asks learners to guess, check, and explain the result. This method exposes thinking and helps correct misconceptions. Records a prediction before revealing model behaviour. Predict–Test–Explain is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Predict–Test–Explain works this concrete case: A slider from 0 to 70 with step 4: how many steps from 0 to max?",
    howItWorks: "Record the prediction before testing the model.",
    whyItWorks: "This method exposes thinking and helps correct misconceptions.",
    worked: [
      { prompt: "A slider from 0 to 70 with step 4: how many steps from 0 to max?", steps: ["70/4.", "17.", "17."], answer: "17" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  645: {
    introduction: "Worked Example works this concrete case: A slider from 0 to 80 with step 5: how many steps from 0 to max? The labelled answer is 16. Demonstrate complete solutions. Animates steps with mathematical justification. A common labelled error is showing steps without saying why. Worked Example keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A worked example shows a complete solution with clear steps. Worked examples model expert thinking for new learners. Animates steps with mathematical justification. Worked Example is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Worked Example works this concrete case: A slider from 0 to 80 with step 5: how many steps from 0 to max?",
    howItWorks: "Write each step, reason, and final answer.",
    whyItWorks: "Worked examples model expert thinking for new learners.",
    worked: [
      { prompt: "A slider from 0 to 80 with step 5: how many steps from 0 to max?", steps: ["80/5.", "16.", "16."], answer: "16" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  646: {
    introduction: "Step-by-Step Practice works this concrete case: A slider from 0 to 90 with step 6: how many steps from 0 to max? The labelled answer is 15. Scaffold procedures. Requires one valid step at a time. A common labelled error is asking only for the final answer. Step-by-Step Practice keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Step-by-step practice breaks a task into small checked actions. Small steps help learners build accuracy and confidence. Step-by-Step Practice is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Step-by-Step Practice works this concrete case: A slider from 0 to 90 with step 6: how many steps from 0 to max?",
    howItWorks: "Ask for one step at a time and give feedback.",
    whyItWorks: "Small steps help learners build accuracy and confidence.",
    worked: [
      { prompt: "A slider from 0 to 90 with step 6: how many steps from 0 to max?", steps: ["90/6.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  647: {
    introduction: "Construction Challenge works this concrete case: A slider from 0 to 100 with step 7: how many steps from 0 to max? The labelled answer is 14. Assess geometric competence. Requires a valid construction satisfying conditions. A common labelled error is giving a build task without success conditions. Construction Challenge keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A construction challenge asks learners to build an object that meets conditions. Challenges connect planning, action, and mathematical constraints. Requires a valid construction satisfying conditions. Construction Challenge is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Construction Challenge works this concrete case: A slider from 0 to 100 with step 7: how many steps from 0 to max?",
    howItWorks: "State the goal, allowed tools, and success checks.",
    whyItWorks: "Challenges connect planning, action, and mathematical constraints.",
    worked: [
      { prompt: "A slider from 0 to 100 with step 7: how many steps from 0 to max?", steps: ["100/7.", "14.", "14."], answer: "14" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  648: {
    introduction: "Graph Matching works this concrete case: A slider from 0 to 30 with step 2: how many steps from 0 to max? The labelled answer is 15. Connect equations and representations. Matches equations, tables, graphs or transformations. A common labelled error is matching only by rough appearance. Graph Matching keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Graph matching asks learners to make a graph fit a target graph or situation. Matching focuses attention on slope, intercepts, shape, and scale. Matches equations, tables, graphs or transformations. Graph Matching is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Graph Matching works this concrete case: A slider from 0 to 30 with step 2: how many steps from 0 to max?",
    howItWorks: "Show the target, let learners change parameters, and compare important features.",
    whyItWorks: "Matching focuses attention on slope, intercepts, shape, and scale.",
    worked: [
      { prompt: "A slider from 0 to 30 with step 2: how many steps from 0 to max?", steps: ["30/2.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  649: {
    introduction: "Error Diagnosis works this concrete case: A slider from 0 to 40 with step 3: how many steps from 0 to max? The labelled answer is 13. Correct misconceptions. Presents plausible incorrect work for analysis. A common labelled error is checking only whether the final answer is wrong. Error Diagnosis keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Error diagnosis asks learners to find and correct a mistake. Finding an error builds deeper understanding than only giving an answer. Presents plausible incorrect work for analysis. Error Diagnosis is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Error Diagnosis works this concrete case: A slider from 0 to 40 with step 3: how many steps from 0 to max?",
    howItWorks: "Show the work, ask where the first wrong step appears, and require a correction.",
    whyItWorks: "Finding an error builds deeper understanding than only giving an answer.",
    worked: [
      { prompt: "A slider from 0 to 40 with step 3: how many steps from 0 to max?", steps: ["40/3.", "13.", "13."], answer: "13" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  650: {
    introduction: "Multiple Representations works this concrete case: A slider from 0 to 50 with step 4: how many steps from 0 to max? The labelled answer is 12. Connect mathematical forms. Synchronises symbolic, numerical, graphical and verbal views. A common labelled error is showing forms that do not update together. Multiple Representations keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Multiple representations show the same idea in more than one form. Seeing the same idea in different forms helps transfer learning. Synchronises symbolic, numerical, graphical and verbal views. Multiple Representations is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Multiple Representations works this concrete case: A slider from 0 to 50 with step 4: how many steps from 0 to max?",
    howItWorks: "Link a table, graph, equation, diagram, or words so changes agree.",
    whyItWorks: "Seeing the same idea in different forms helps transfer learning.",
    worked: [
      { prompt: "A slider from 0 to 50 with step 4: how many steps from 0 to max?", steps: ["50/4.", "12.", "12."], answer: "12" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  651: {
    introduction: "Real-World Application works this concrete case: A slider from 0 to 60 with step 5: how many steps from 0 to max? The labelled answer is 12. Apply mathematics authentically. Embeds practical contexts and data. A common labelled error is adding a story that does not affect the mathematics. Real-World Application keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A real-world application connects a concept to a realistic situation. Applications show why the mathematics is useful outside the lesson. Real-World Application is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Real-World Application works this concrete case: A slider from 0 to 60 with step 5: how many steps from 0 to max?",
    howItWorks: "Define the context, variables, units, and question.",
    whyItWorks: "Applications show why the mathematics is useful outside the lesson.",
    worked: [
      { prompt: "A slider from 0 to 60 with step 5: how many steps from 0 to max?", steps: ["60/5.", "12.", "12."], answer: "12" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  652: {
    introduction: "Open Investigation works this concrete case: A slider from 0 to 70 with step 6: how many steps from 0 to max? The labelled answer is 11. Encourage exploration. Provides goals without fixed procedures. A common labelled error is leaving learners with no way to judge their result. Open Investigation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An open investigation lets learners explore a question with more than one path. Open tasks develop reasoning and communication. Provides goals without fixed procedures. Open Investigation is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Open Investigation works this concrete case: A slider from 0 to 70 with step 6: how many steps from 0 to max?",
    howItWorks: "Give a clear question, useful tools, and criteria for a good explanation.",
    whyItWorks: "Open tasks develop reasoning and communication.",
    worked: [
      { prompt: "A slider from 0 to 70 with step 6: how many steps from 0 to max?", steps: ["70/6.", "11.", "11."], answer: "11" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  653: {
    introduction: "Dynamic Question Generator works this concrete case: A slider from 0 to 80 with step 7: how many steps from 0 to max? The labelled answer is 11. Provide repeated practice. Randomises values while preserving learning objectives. A common labelled error is generating values that break the question. Dynamic Question Generator keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A dynamic question generator creates varied questions from rules. Generated questions give repeated practice without hand-writing every item. Randomises values while preserving learning objectives. Dynamic Question Generator is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Dynamic Question Generator works this concrete case: A slider from 0 to 80 with step 7: how many steps from 0 to max?",
    howItWorks: "Set allowed values, answer rules, and checks for invalid cases.",
    whyItWorks: "Generated questions give repeated practice without hand-writing every item.",
    worked: [
      { prompt: "A slider from 0 to 80 with step 7: how many steps from 0 to max?", steps: ["80/7.", "11.", "11."], answer: "11" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  654: {
    introduction: "Mastery Challenge works this concrete case: A slider from 0 to 90 with step 2: how many steps from 0 to max? The labelled answer is 45. Integrate related skills. Combines several concepts in one task. A common labelled error is testing only recall in a mastery task. Mastery Challenge keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A mastery challenge checks whether learners can use a skill independently. Mastery tasks show readiness to move on. Mastery Challenge is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Mastery Challenge works this concrete case: A slider from 0 to 90 with step 2: how many steps from 0 to max?",
    howItWorks: "Require the key steps, final answer, and explanation.",
    whyItWorks: "Mastery tasks show readiness to move on.",
    worked: [
      { prompt: "A slider from 0 to 90 with step 2: how many steps from 0 to max?", steps: ["90/2.", "45.", "45."], answer: "45" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  655: {
    introduction: "Exit Ticket works this concrete case: A slider from 0 to 100 with step 3: how many steps from 0 to max? The labelled answer is 33. Check essential understanding. Uses a brief end-of-page assessment. A common labelled error is making the exit ticket a full test. Exit Ticket keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An exit ticket is a short final check at the end of a lesson. It helps the teacher see who is ready and who needs help. Exit Ticket is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Exit Ticket works this concrete case: A slider from 0 to 100 with step 3: how many steps from 0 to max?",
    howItWorks: "Ask one focused question tied to the lesson objective.",
    whyItWorks: "It helps the teacher see who is ready and who needs help.",
    worked: [
      { prompt: "A slider from 0 to 100 with step 3: how many steps from 0 to max?", steps: ["100/3.", "33.", "33."], answer: "33" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  656: {
    introduction: "Revision Summary works this concrete case: A slider from 0 to 30 with step 4: how many steps from 0 to max? The labelled answer is 7. Consolidate key knowledge. Displays formulas, definitions, examples and common errors. A common labelled error is putting the whole lesson into the summary. Revision Summary keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "A revision summary collects the key ideas, rules, and common mistakes. Summaries help learners review without rereading the whole lesson. Displays formulas, definitions, examples and common errors. Revision Summary is the Lesson and Assessment Pages rule used to compute one labelled numerical result.",
    basicIdea: "Revision Summary works this concrete case: A slider from 0 to 30 with step 4: how many steps from 0 to max?",
    howItWorks: "List the main rule, one example, and one warning.",
    whyItWorks: "Summaries help learners review without rereading the whole lesson.",
    worked: [
      { prompt: "A slider from 0 to 30 with step 4: how many steps from 0 to max?", steps: ["30/4.", "7.", "7."], answer: "7" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  657: {
    introduction: "Drag and Manipulate works this concrete case: A slider from 0 to 40 with step 5: how many steps from 0 to max? The labelled answer is 8. Make mathematics directly interactive. Supports precise dragging of points, graphs and objects. A common labelled error is supporting only mouse dragging. Drag and Manipulate keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Drag and manipulate lets learners move objects directly. Direct movement helps learners connect action with visible change. Supports precise dragging of points, graphs and objects. Drag and Manipulate is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Drag and Manipulate works this concrete case: A slider from 0 to 40 with step 5: how many steps from 0 to max?",
    howItWorks: "Support pointer, touch, and keyboard movement.",
    whyItWorks: "Direct movement helps learners connect action with visible change.",
    worked: [
      { prompt: "A slider from 0 to 40 with step 5: how many steps from 0 to max?", steps: ["40/5.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  658: {
    introduction: "Zoom and Pan works this concrete case: A slider from 0 to 50 with step 6: how many steps from 0 to max? The labelled answer is 8. Navigate large constructions. Supports touch, mouse and keyboard navigation. A common labelled error is thinking zoom changes the object itself. Zoom and Pan keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Zoom and pan change the visible part of a workspace. View controls help inspect small details without changing the math object. Supports touch, mouse and keyboard navigation. Zoom and Pan is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Zoom and Pan works this concrete case: A slider from 0 to 50 with step 6: how many steps from 0 to max?",
    howItWorks: "Keep scale readable and provide a way back to the original view.",
    whyItWorks: "View controls help inspect small details without changing the math object.",
    worked: [
      { prompt: "A slider from 0 to 50 with step 6: how many steps from 0 to max?", steps: ["50/6.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  659: {
    introduction: "Reset View works this concrete case: A slider from 0 to 60 with step 7: how many steps from 0 to max? The labelled answer is 8. Recover standard framing. Returns axes and camera to a default view. A common labelled error is deleting learner work when only the view should reset. Reset View keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Reset view returns the screen to a known camera or layout. Learners can recover from getting lost in a workspace. Returns axes and camera to a default view. Reset View is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Reset View works this concrete case: A slider from 0 to 60 with step 7: how many steps from 0 to max?",
    howItWorks: "Restore pan, zoom, and focus without changing saved work.",
    whyItWorks: "Learners can recover from getting lost in a workspace.",
    worked: [
      { prompt: "A slider from 0 to 60 with step 7: how many steps from 0 to max?", steps: ["60/7.", "8.", "8."], answer: "8" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  660: {
    introduction: "Undo and Redo works this concrete case: A slider from 0 to 70 with step 2: how many steps from 0 to max? The labelled answer is 35. Encourage safe experimentation. Maintains an action history. A common labelled error is keeping unclear or unsafe action history. Undo and Redo keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Undo and redo move backward and forward through recent actions. History controls let learners fix mistakes without starting over. Undo and Redo is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Undo and Redo works this concrete case: A slider from 0 to 70 with step 2: how many steps from 0 to max?",
    howItWorks: "Store a safe action history and update the display after each step.",
    whyItWorks: "History controls let learners fix mistakes without starting over.",
    worked: [
      { prompt: "A slider from 0 to 70 with step 2: how many steps from 0 to max?", steps: ["70/2.", "35.", "35."], answer: "35" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  661: {
    introduction: "Animation Player works this concrete case: A slider from 0 to 80 with step 3: how many steps from 0 to max? The labelled answer is 26. Observe continuous change. Provides play, pause, speed and step controls. A common labelled error is running animation without pause control. Animation Player keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An animation player runs a changing model over time. Animation reveals patterns that unfold step by step. Provides play, pause, speed and step controls. Animation Player is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Animation Player works this concrete case: A slider from 0 to 80 with step 3: how many steps from 0 to max?",
    howItWorks: "Provide play, pause, speed, and reset controls.",
    whyItWorks: "Animation reveals patterns that unfold step by step.",
    worked: [
      { prompt: "A slider from 0 to 80 with step 3: how many steps from 0 to max?", steps: ["80/3.", "26.", "26."], answer: "26" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  662: {
    introduction: "Snap Controls works this concrete case: A slider from 0 to 90 with step 4: how many steps from 0 to max? The labelled answer is 22. Improve construction precision. Snaps to grid, points, angles or objects. A common labelled error is snapping objects without telling the learner. Snap Controls keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Snap controls move objects to exact points, grids, or angles. Snapping improves precision while keeping manipulation easy. Snaps to grid, points, angles or objects. Snap Controls is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Snap Controls works this concrete case: A slider from 0 to 90 with step 4: how many steps from 0 to max?",
    howItWorks: "Choose snap size and show when snapping is active.",
    whyItWorks: "Snapping improves precision while keeping manipulation easy.",
    worked: [
      { prompt: "A slider from 0 to 90 with step 4: how many steps from 0 to max?", steps: ["90/4.", "22.", "22."], answer: "22" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  663: {
    introduction: "Trace and Locus works this concrete case: A slider from 0 to 100 with step 5: how many steps from 0 to max? The labelled answer is 20. Observe motion and dependency. Records paths of moving objects. A common labelled error is confusing the path with the moving object. Trace and Locus keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Trace shows a moving object's path, and locus shows all positions satisfying a condition. Paths reveal hidden relationships over motion. Trace and Locus is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Trace and Locus works this concrete case: A slider from 0 to 100 with step 5: how many steps from 0 to max?",
    howItWorks: "Record positions as the object moves and explain the condition.",
    whyItWorks: "Paths reveal hidden relationships over motion.",
    worked: [
      { prompt: "A slider from 0 to 100 with step 5: how many steps from 0 to max?", steps: ["100/5.", "20.", "20."], answer: "20" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  664: {
    introduction: "Exact and Decimal Output works this concrete case: A slider from 0 to 30 with step 6: how many steps from 0 to max? The labelled answer is 5. Connect representations. Displays symbolic and approximate answers. A common labelled error is treating a rounded decimal as exact. Exact and Decimal Output keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Exact output preserves symbolic form, while decimal output gives an approximation. Mode labels prevent learners from confusing exact and approximate answers. Displays symbolic and approximate answers. Exact and Decimal Output is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Exact and Decimal Output works this concrete case: A slider from 0 to 30 with step 6: how many steps from 0 to max?",
    howItWorks: "Show which mode is active and round decimals clearly.",
    whyItWorks: "Mode labels prevent learners from confusing exact and approximate answers.",
    worked: [
      { prompt: "A slider from 0 to 30 with step 6: how many steps from 0 to max?", steps: ["30/6.", "5.", "5."], answer: "5" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  665: {
    introduction: "Linked Views works this concrete case: A slider from 0 to 40 with step 7: how many steps from 0 to max? The labelled answer is 5. Synchronise representations. Keeps algebra, graph, table, CAS and 3D views connected. A common labelled error is letting views show different values. Linked Views keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Linked views show the same object in different panels. Linked views connect diagram, graph, table, and algebra without contradictions. Keeps algebra, graph, table, CAS and 3D views connected. Linked Views is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Linked Views works this concrete case: A slider from 0 to 40 with step 7: how many steps from 0 to max?",
    howItWorks: "Read the Linked Views inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Linked views connect diagram, graph, table, and algebra without contradictions.",
    worked: [
      { prompt: "A slider from 0 to 40 with step 7: how many steps from 0 to max?", steps: ["40/7.", "5.", "5."], answer: "5" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  666: {
    introduction: "Save, Duplicate and Share works this concrete case: A slider from 0 to 50 with step 2: how many steps from 0 to max? The labelled answer is 25. Support continuity and collaboration. Stores activities and creates shareable copies. A common labelled error is editing the original when a copy was needed. Save, Duplicate and Share keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Save stores work, duplicate makes a copy, and share sends access to others. These actions help teachers reuse work without losing originals. Stores activities and creates shareable copies. Save, Duplicate and Share is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Save, Duplicate and Share works this concrete case: A slider from 0 to 50 with step 2: how many steps from 0 to max?",
    howItWorks: "Preserve state, title, permissions, and version information.",
    whyItWorks: "These actions help teachers reuse work without losing originals.",
    worked: [
      { prompt: "A slider from 0 to 50 with step 2: how many steps from 0 to max?", steps: ["50/2.", "25.", "25."], answer: "25" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  667: {
    introduction: "Export works this concrete case: A slider from 0 to 60 with step 3: how many steps from 0 to max? The labelled answer is 20. Reuse outputs elsewhere. Exports images, SVG, PDF-ready content and data. A common labelled error is exporting only a picture when data is required. Export keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Export saves work into another file or format. Export lets work move into reports, slides, or other systems. Exports images, SVG, PDF-ready content and data. Export is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Export works this concrete case: A slider from 0 to 60 with step 3: how many steps from 0 to max?",
    howItWorks: "Choose the format and check that important data is included.",
    whyItWorks: "Export lets work move into reports, slides, or other systems.",
    worked: [
      { prompt: "A slider from 0 to 60 with step 3: how many steps from 0 to max?", steps: ["60/3.", "20.", "20."], answer: "20" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  668: {
    introduction: "Teacher Presentation Mode works this concrete case: A slider from 0 to 70 with step 4: how many steps from 0 to max? The labelled answer is 17. Support classroom display. Enlarges controls and hides editing complexity. A common labelled error is using tiny learner controls on a classroom screen. Teacher Presentation Mode keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Teacher presentation mode shows lesson content clearly for a class display. Presentation mode supports whole-class explanation and discussion. Enlarges controls and hides editing complexity. Teacher Presentation Mode is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Teacher Presentation Mode works this concrete case: A slider from 0 to 70 with step 4: how many steps from 0 to max?",
    howItWorks: "Use large controls, focused views, and hidden answers until needed.",
    whyItWorks: "Presentation mode supports whole-class explanation and discussion.",
    worked: [
      { prompt: "A slider from 0 to 70 with step 4: how many steps from 0 to max?", steps: ["70/4.", "17.", "17."], answer: "17" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  669: {
    introduction: "Learner Practice Mode works this concrete case: A slider from 0 to 80 with step 5: how many steps from 0 to max? The labelled answer is 16. Focus on solving. Shows task, workspace, hints and submission. A common labelled error is collecting answers without telling learners what to fix. Learner Practice Mode keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Learner practice mode gives students tasks, attempts, and feedback. Practice mode supports independent learning with feedback. Shows task, workspace, hints and submission. Learner Practice Mode is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Learner Practice Mode works this concrete case: A slider from 0 to 80 with step 5: how many steps from 0 to max?",
    howItWorks: "Track answers, hints, progress, and next steps.",
    whyItWorks: "Practice mode supports independent learning with feedback.",
    worked: [
      { prompt: "A slider from 0 to 80 with step 5: how many steps from 0 to max?", steps: ["80/5.", "16.", "16."], answer: "16" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  670: {
    introduction: "Exam Mode works this concrete case: A slider from 0 to 90 with step 6: how many steps from 0 to max? The labelled answer is 15. Provide restricted calculator access. Disables external communication and records exam status. A common labelled error is leaving hints enabled during an exam. Exam Mode keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Exam mode limits tools so assessment conditions are fair. Controlled conditions help make results comparable. Disables external communication and records exam status. Exam Mode is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Exam Mode works this concrete case: A slider from 0 to 90 with step 6: how many steps from 0 to max?",
    howItWorks: "Disable hints, sharing, and unrelated aids according to rules.",
    whyItWorks: "Controlled conditions help make results comparable.",
    worked: [
      { prompt: "A slider from 0 to 90 with step 6: how many steps from 0 to max?", steps: ["90/6.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  671: {
    introduction: "Keyboard Navigation works this concrete case: A slider from 0 to 100 with step 7: how many steps from 0 to max? The labelled answer is 14. Ensure non-pointer access. Provides shortcuts and focus order. A common labelled error is making controls keyboard reachable but not visibly focused. Keyboard Navigation keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Keyboard navigation lets learners use the interface without a mouse. Keyboard support is essential for accessibility and precision. Keyboard Navigation is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Keyboard Navigation works this concrete case: A slider from 0 to 100 with step 7: how many steps from 0 to max?",
    howItWorks: "Provide tab order, focus styles, and arrow-key actions.",
    whyItWorks: "Keyboard support is essential for accessibility and precision.",
    worked: [
      { prompt: "A slider from 0 to 100 with step 7: how many steps from 0 to max?", steps: ["100/7.", "14.", "14."], answer: "14" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  672: {
    introduction: "Screen Reader Support works this concrete case: A slider from 0 to 30 with step 2: how many steps from 0 to max? The labelled answer is 15. Improve accessibility. Labels objects, controls and equations. A common labelled error is putting important feedback only in colour or position. Screen Reader Support keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Screen reader support gives meaningful spoken text for interface elements. It lets learners who cannot see the screen understand and operate the lesson. Screen Reader Support is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Screen Reader Support works this concrete case: A slider from 0 to 30 with step 2: how many steps from 0 to max?",
    howItWorks: "Use labels, roles, live text, and clear descriptions.",
    whyItWorks: "It lets learners who cannot see the screen understand and operate the lesson.",
    worked: [
      { prompt: "A slider from 0 to 30 with step 2: how many steps from 0 to max?", steps: ["30/2.", "15.", "15."], answer: "15" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  673: {
    introduction: "High Contrast and Large Text works this concrete case: A slider from 0 to 40 with step 3: how many steps from 0 to max? The labelled answer is 13. Support visual accessibility. Offers accessible themes and scalable text. A common labelled error is using colour alone to show meaning. High Contrast and Large Text keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "High contrast and large text improve readability. Readable displays help many learners, including low-vision users. Offers accessible themes and scalable text. High Contrast and Large Text is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "High Contrast and Large Text works this concrete case: A slider from 0 to 40 with step 3: how many steps from 0 to max?",
    howItWorks: "Keep colour contrast strong and allow text to scale without overlap.",
    whyItWorks: "Readable displays help many learners, including low-vision users.",
    worked: [
      { prompt: "A slider from 0 to 40 with step 3: how many steps from 0 to max?", steps: ["40/3.", "13.", "13."], answer: "13" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  674: {
    introduction: "Multi-Language Terminology works this concrete case: A slider from 0 to 50 with step 4: how many steps from 0 to max? The labelled answer is 12. Support broad curricula. Localises instructions and mathematical vocabulary. A common labelled error is translating words without checking mathematical meaning. Multi-Language Terminology keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Multi-language terminology shows important terms in more than one language. Clear terminology helps learners connect home language and school language. Localises instructions and mathematical vocabulary. Multi-Language Terminology is the Common Tools and Accessibility rule used to compute one labelled numerical result.",
    basicIdea: "Multi-Language Terminology works this concrete case: A slider from 0 to 50 with step 4: how many steps from 0 to max?",
    howItWorks: "Keep the mathematical meaning stable across translations.",
    whyItWorks: "Clear terminology helps learners connect home language and school language.",
    worked: [
      { prompt: "A slider from 0 to 50 with step 4: how many steps from 0 to max?", steps: ["50/4.", "12.", "12."], answer: "12" },
      { prompt: "If a control is off, should the live value still update?", steps: ["Disabled controls do not change state.", "No.", "no"], answer: "no" },
      { prompt: "Is a picture export the same as saving the mathematical objects?", steps: ["An image can drop exact data.", "Save the construction too.", "No."], answer: "no" }
    ],
  },
  10001: {
    introduction: "Place Value Explorer works this concrete case: What is the value of the hundreds digit in 4791? The labelled answer is 700. Class 6 Numbers and Arithmetic: Teach Place Value Explorer as a Class 6 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Place Value Explorer fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is reading only the digit and ignoring its place. Place Value Explorer keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Place value tells the value of a digit from its position in a number. Each place is ten times the place to its right in our base-ten system. Class 6 Numbers and Arithmetic: Teach Place Value Explorer as a Class 6 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Place Value Explorer fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Place Value Explorer is the Numbers and Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Place Value Explorer works this concrete case: What is the value of the hundreds digit in 4791?",
    howItWorks: "Read digits from right to left as ones, tens, hundreds, thousands, and larger places.",
    whyItWorks: "Each place is ten times the place to its right in our base-ten system.",
    worked: [
      { prompt: "What is the value of the hundreds digit in 4791?", steps: ["The hundreds digit is 7.", "7 hundreds = 700.", "700."], answer: "700" },
      { prompt: "Write 4 thousands + 7 hundreds + 9 tens + 1 one as a number.", steps: ["4*1000 + 7*100 + 9*10 + 1.", "4791.", "4791."], answer: "4791" },
      { prompt: "Does the digit 4 always mean four ones?", steps: ["Place decides value.", "4 in tens is 40.", "No."], answer: "no" }
    ],
  },
  10002: {
    introduction: "Indian and International Number Naming Systems works this concrete case: In the Indian system, how many zeros in 1 lakh? The labelled answer is 5. Class 6 Numbers and Arithmetic: Teach Indian and International Number Naming Systems as a Class 6 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Indian and International Number Naming Systems fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is mixing lakh-crore commas with million-billion names. Indian and International Number Naming Systems keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Indian and International number systems group digits differently after the hundreds place. Grouping helps people read large numbers quickly and consistently. Class 6 Numbers and Arithmetic: Teach Indian and International Number Naming Systems as a Class 6 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Indian and International Number Naming Systems fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Indian and International Number Naming Systems is the Numbers and Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Indian and International Number Naming Systems works this concrete case: In the Indian system, how many zeros in 1 lakh?",
    howItWorks: "Place commas using the chosen system, then read each group with its name.",
    whyItWorks: "Grouping helps people read large numbers quickly and consistently.",
    worked: [
      { prompt: "In the Indian system, how many zeros in 1 lakh?", steps: ["1 lakh = 100000.", "5.", "5."], answer: "5" },
      { prompt: "Write one million with international commas.", steps: ["Groups of 3.", "1,000,000.", "1,000,000"], answer: "1,000,000" },
      { prompt: "Is 1,00,000 the international grouping for one lakh?", steps: ["International grouping writes 100,000.", "Indian grouping is 1,00,000.", "No."], answer: "no" }
    ],
  },
  10003: {
    introduction: "Estimation and Rounding Lab works this concrete case: Round 6080 to the nearest hundred. The labelled answer is 6100. Class 6 Numbers and Arithmetic: Teach Estimation and Rounding Lab as a Class 6 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Estimation and Rounding Lab fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is changing many digits before choosing the rounding place. Estimation and Rounding Lab keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Estimation gives a close, useful answer without exact calculation; rounding changes a number to a nearby place value. Rounding works because nearby numbers can stand for the exact number when an approximate answer is enough. Class 6 Numbers and Arithmetic: Teach Estimation and Rounding Lab as a Class 6 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Estimation and Rounding Lab fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Estimation and Rounding Lab is the Numbers and Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Estimation and Rounding Lab works this concrete case: Round 6080 to the nearest hundred.",
    howItWorks: "Choose the rounding place, look at the digit to its right, then round down or up.",
    whyItWorks: "Rounding works because nearby numbers can stand for the exact number when an approximate answer is enough.",
    worked: [
      { prompt: "Round 6080 to the nearest hundred.", steps: ["Look at the tens digit 8.", "8≥5 so round up.", "6100."], answer: "6100" },
      { prompt: "Estimate 114 by rounding 19 to 20.", steps: ["6*20=120.", "120.", "120."], answer: "120" },
      { prompt: "Do you inspect every digit before choosing the rounding place?", steps: ["Choose the place first.", "Then look only at the next digit.", "No."], answer: "no" }
    ],
  },
  10004: {
    introduction: "Approximation and Error Bounds works this concrete case: If a measurement is 7.0 ± 0.4, what is the upper bound? The labelled answer is 7.4. Class 6 Numbers and Arithmetic: Teach Approximation and Error Bounds as a Class 6 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Approximation and Error Bounds fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Approximation and Error Bounds rule. Approximation and Error Bounds keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 6 Numbers and Arithmetic: Teach Approximation and Error Bounds as a Class 6 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Approximation and Error Bounds fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Approximation and Error Bounds is the Numbers and Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Approximation and Error Bounds works this concrete case: If a measurement is 7.0 ± 0.4, what is the upper bound?",
    howItWorks: "Read the Approximation and Error Bounds inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Approximation and Error Bounds works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "If a measurement is 7.0 ± 0.4, what is the upper bound?", steps: ["Upper = value + error.", "7.4.", "7.4."], answer: "7.4" },
      { prompt: "Absolute error from 7 reported as 8?", steps: ["|reported-true|.", "1.", "1."], answer: "1" },
      { prompt: "Is a smaller absolute error always a smaller percent error?", steps: ["Percent error divides by the true size.", "A tiny true value can inflate percent error.", "No."], answer: "no" }
    ],
  },
  10005: {
    introduction: "Mixed Units and Unit Conversion works this concrete case: In Mixed Units and Unit Conversion, evaluate the labelled model at input 8. The labelled answer is 40. Class 6 Numbers and Arithmetic: Teach Mixed Units and Unit Conversion as a Class 6 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Mixed Units and Unit Conversion fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Mixed Units and Unit Conversion rule. Mixed Units and Unit Conversion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 6 Numbers and Arithmetic: Teach Mixed Units and Unit Conversion as a Class 6 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Mixed Units and Unit Conversion fills a Class 6 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Mixed Units and Unit Conversion is the Numbers and Arithmetic rule used to compute one labelled numerical result.",
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
    introduction: "Pictograph Builder works this concrete case: If one icon = 6 students and 4 icons are shown, how many students? The labelled answer is 24. Class 6 Data Handling: Teach Pictograph Builder as a Class 6 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Pictograph Builder fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Pictograph Builder rule. Pictograph Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 6 Data Handling: Teach Pictograph Builder as a Class 6 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Pictograph Builder fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Pictograph Builder is the Data Handling rule used to compute one labelled numerical result.",
    basicIdea: "Pictograph Builder works this concrete case: If one icon = 6 students and 4 icons are shown, how many students?",
    howItWorks: "Read the Pictograph Builder inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Pictograph Builder works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "If one icon = 6 students and 4 icons are shown, how many students?", steps: ["4*6.", "24.", "24."], answer: "24" },
      { prompt: "A bar of height 90 vs 60: what is the difference?", steps: ["90-60.", "30.", "30."], answer: "30" },
      { prompt: "Can a pictograph hide the scale and still be read exactly?", steps: ["The key tells the value of one icon.", "Without the key the count is incomplete.", "No."], answer: "no" }
    ],
  },
  10007: {
    introduction: "Bar Graph Builder works this concrete case: If one icon = 7 students and 4 icons are shown, how many students? The labelled answer is 28. Class 6 Data Handling: Teach Bar Graph Builder as a Class 6 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Bar Graph Builder fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Bar Graph Builder rule. Bar Graph Builder keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 6 Data Handling: Teach Bar Graph Builder as a Class 6 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Bar Graph Builder fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Bar Graph Builder is the Data Handling rule used to compute one labelled numerical result.",
    basicIdea: "Bar Graph Builder works this concrete case: If one icon = 7 students and 4 icons are shown, how many students?",
    howItWorks: "Read the Bar Graph Builder inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Bar Graph Builder works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "If one icon = 7 students and 4 icons are shown, how many students?", steps: ["4*7.", "28.", "28."], answer: "28" },
      { prompt: "A bar of height 100 vs 70: what is the difference?", steps: ["100-70.", "30.", "30."], answer: "30" },
      { prompt: "Can a pictograph hide the scale and still be read exactly?", steps: ["The key tells the value of one icon.", "Without the key the count is incomplete.", "No."], answer: "no" }
    ],
  },
  10008: {
    introduction: "Survey to Frequency Table works this concrete case: In Survey to Frequency Table, evaluate the labelled model at input 3. The labelled answer is 6. Class 6 Data Handling: Teach Survey to Frequency Table as a Class 6 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Survey to Frequency Table fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Survey to Frequency Table rule. Survey to Frequency Table keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 6 Data Handling: Teach Survey to Frequency Table as a Class 6 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Survey to Frequency Table fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Survey to Frequency Table is the Data Handling rule used to compute one labelled numerical result.",
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
    introduction: "Misleading Graph Detection works this concrete case: In Misleading Graph Detection, evaluate the labelled model at input 4. The labelled answer is 12. Class 6 Data Handling: Teach Misleading Graph Detection as a Class 6 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Misleading Graph Detection fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Misleading Graph Detection rule. Misleading Graph Detection keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 6 Data Handling: Teach Misleading Graph Detection as a Class 6 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Misleading Graph Detection fills a Class 6 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Misleading Graph Detection is the Data Handling rule used to compute one labelled numerical result.",
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
    introduction: "Number Pattern Completion works this concrete case: In Number Pattern Completion, evaluate the labelled model at input 5. The labelled answer is 20. Class 6 Patterns: Teach Number Pattern Completion as a Class 6 Patterns concept with syllabus-aligned exploration, practice, and assessment. Number Pattern Completion fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Number Pattern Completion rule. Number Pattern Completion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 6 Patterns: Teach Number Pattern Completion as a Class 6 Patterns concept with syllabus-aligned exploration, practice, and assessment. Number Pattern Completion fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Number Pattern Completion is the Patterns rule used to compute one labelled numerical result.",
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
    introduction: "Shape Pattern Completion works this concrete case: In Shape Pattern Completion, evaluate the labelled model at input 6. The labelled answer is 30. Class 6 Patterns: Teach Shape Pattern Completion as a Class 6 Patterns concept with syllabus-aligned exploration, practice, and assessment. Shape Pattern Completion fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Shape Pattern Completion rule. Shape Pattern Completion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 6 Patterns: Teach Shape Pattern Completion as a Class 6 Patterns concept with syllabus-aligned exploration, practice, and assessment. Shape Pattern Completion fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Shape Pattern Completion is the Patterns rule used to compute one labelled numerical result.",
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
    introduction: "Input-Output Rule Machines works this concrete case: In Input-Output Rule Machines, evaluate the labelled model at input 7. The labelled answer is 42. Class 6 Patterns: Teach Input-Output Rule Machines as a Class 6 Patterns concept with syllabus-aligned exploration, practice, and assessment. Input-Output Rule Machines fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Input-Output Rule Machines rule. Input-Output Rule Machines keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 6 Patterns: Teach Input-Output Rule Machines as a Class 6 Patterns concept with syllabus-aligned exploration, practice, and assessment. Input-Output Rule Machines fills a Class 6 Patterns syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Input-Output Rule Machines is the Patterns rule used to compute one labelled numerical result.",
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
    introduction: "Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 works this concrete case: Is 82 divisible by 2? The labelled answer is yes. Class 7 Numbers and Arithmetic: Teach Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 as a Class 7 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 rule. Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Numbers and Arithmetic: Teach Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 as a Class 7 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 is the Numbers and Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 works this concrete case: Is 82 divisible by 2?",
    howItWorks: "Read the Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Is 82 divisible by 2?", steps: ["A number is divisible by 2 if it is even.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Digit sum of 877: is it a multiple of 3 if the number is?", steps: ["A number is divisible by 3 iff digit sum is.", "22.", "22."], answer: "22" },
      { prompt: "Does divisibility by 2 require checking every digit?", steps: ["Only the ones digit matters for 2.", "No.", "No."], answer: "no" }
    ],
  },
  10014: {
    introduction: "Digital Root and Divisibility works this concrete case: Is 92 divisible by 2? The labelled answer is yes. Class 7 Numbers and Arithmetic: Teach Digital Root and Divisibility as a Class 7 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Digital Root and Divisibility fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Digital Root and Divisibility rule. Digital Root and Divisibility keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Numbers and Arithmetic: Teach Digital Root and Divisibility as a Class 7 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Digital Root and Divisibility fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Digital Root and Divisibility is the Numbers and Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Digital Root and Divisibility works this concrete case: Is 92 divisible by 2?",
    howItWorks: "Read the Digital Root and Divisibility inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Digital Root and Divisibility works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Is 92 divisible by 2?", steps: ["A number is divisible by 2 if it is even.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Digit sum of 928: is it a multiple of 3 if the number is?", steps: ["A number is divisible by 3 iff digit sum is.", "19.", "19."], answer: "19" },
      { prompt: "Does divisibility by 2 require checking every digit?", steps: ["Only the ones digit matters for 2.", "No.", "No."], answer: "no" }
    ],
  },
  10015: {
    introduction: "Remainder Reasoning works this concrete case: In Remainder Reasoning, evaluate the labelled model at input 10. The labelled answer is 30. Class 7 Numbers and Arithmetic: Teach Remainder Reasoning as a Class 7 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Remainder Reasoning fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Remainder Reasoning rule. Remainder Reasoning keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Numbers and Arithmetic: Teach Remainder Reasoning as a Class 7 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Remainder Reasoning fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Remainder Reasoning is the Numbers and Arithmetic rule used to compute one labelled numerical result.",
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
    introduction: "Unit Rate Table Lab works this concrete case: 12 km in 3 hours. What is the unit rate? The labelled answer is 4. Class 7 Numbers and Arithmetic: Teach Unit Rate Table Lab as a Class 7 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Unit Rate Table Lab fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Unit Rate Table Lab rule. Unit Rate Table Lab keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Numbers and Arithmetic: Teach Unit Rate Table Lab as a Class 7 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Unit Rate Table Lab fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Unit Rate Table Lab is the Numbers and Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Unit Rate Table Lab works this concrete case: 12 km in 3 hours. What is the unit rate?",
    howItWorks: "Read the Unit Rate Table Lab inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Unit Rate Table Lab works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "12 km in 3 hours. What is the unit rate?", steps: ["Divide by 3.", "4 km/h.", "4."], answer: "4" },
      { prompt: "Scale the ratio 3:4 by 3.", steps: ["9:12.", "9:12.", "9:12."], answer: "9:12" },
      { prompt: "Can you add the two ratio parts to get a unit rate?", steps: ["A unit rate divides a quantity by 1 unit.", "Adding parts is not the rate.", "No."], answer: "no" }
    ],
  },
  10017: {
    introduction: "Ratio Tables works this concrete case: 20 km in 4 hours. What is the unit rate? The labelled answer is 5. Class 7 Numbers and Arithmetic: Teach Ratio Tables as a Class 7 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Ratio Tables fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Ratio Tables rule. Ratio Tables keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Numbers and Arithmetic: Teach Ratio Tables as a Class 7 Numbers and Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Ratio Tables fills a Class 7 Numbers and Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Ratio Tables is the Numbers and Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Ratio Tables works this concrete case: 20 km in 4 hours. What is the unit rate?",
    howItWorks: "Read the Ratio Tables inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Ratio Tables works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "20 km in 4 hours. What is the unit rate?", steps: ["Divide by 4.", "5 km/h.", "5."], answer: "5" },
      { prompt: "Scale the ratio 4:5 by 3.", steps: ["12:15.", "12:15.", "12:15."], answer: "12:15" },
      { prompt: "Can you add the two ratio parts to get a unit rate?", steps: ["A unit rate divides a quantity by 1 unit.", "Adding parts is not the rate.", "No."], answer: "no" }
    ],
  },
  10018: {
    introduction: "Bills, Discounts and Tax works this concrete case: SP=100, CP=80. Find the profit. The labelled answer is 20. Class 7 Applied Arithmetic: Teach Bills, Discounts and Tax as a Class 7 Applied Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Bills, Discounts and Tax fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Bills, Discounts and Tax rule. Bills, Discounts and Tax keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Applied Arithmetic: Teach Bills, Discounts and Tax as a Class 7 Applied Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Bills, Discounts and Tax fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Bills, Discounts and Tax is the Applied Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Bills, Discounts and Tax works this concrete case: SP=100, CP=80. Find the profit.",
    howItWorks: "Read the Bills, Discounts and Tax inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Bills, Discounts and Tax works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "SP=100, CP=80. Find the profit.", steps: ["Profit=SP-CP.", "20.", "20."], answer: "20" },
      { prompt: "A 6% tax on 500?", steps: ["Tax=rate×amount.", "30.", "30."], answer: "30" },
      { prompt: "Is selling price always greater than cost price?", steps: ["A loss has SP < CP.", "No.", "No."], answer: "no" }
    ],
  },
  10019: {
    introduction: "Profit, Loss and Marked Price works this concrete case: SP=120, CP=96. Find the profit. The labelled answer is 24. Class 7 Applied Arithmetic: Teach Profit, Loss and Marked Price as a Class 7 Applied Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Profit, Loss and Marked Price fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Profit, Loss and Marked Price rule. Profit, Loss and Marked Price keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Applied Arithmetic: Teach Profit, Loss and Marked Price as a Class 7 Applied Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Profit, Loss and Marked Price fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Profit, Loss and Marked Price is the Applied Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Profit, Loss and Marked Price works this concrete case: SP=120, CP=96. Find the profit.",
    howItWorks: "Read the Profit, Loss and Marked Price inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Profit, Loss and Marked Price works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "SP=120, CP=96. Find the profit.", steps: ["Profit=SP-CP.", "24.", "24."], answer: "24" },
      { prompt: "A 7% tax on 600?", steps: ["Tax=rate×amount.", "42.", "42."], answer: "42" },
      { prompt: "Is selling price always greater than cost price?", steps: ["A loss has SP < CP.", "No.", "No."], answer: "no" }
    ],
  },
  10020: {
    introduction: "Household Budget Arithmetic works this concrete case: SP=140, CP=112. Find the profit. The labelled answer is 28. Class 7 Applied Arithmetic: Teach Household Budget Arithmetic as a Class 7 Applied Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Household Budget Arithmetic fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Household Budget Arithmetic rule. Household Budget Arithmetic keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Applied Arithmetic: Teach Household Budget Arithmetic as a Class 7 Applied Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Household Budget Arithmetic fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Household Budget Arithmetic is the Applied Arithmetic rule used to compute one labelled numerical result.",
    basicIdea: "Household Budget Arithmetic works this concrete case: SP=140, CP=112. Find the profit.",
    howItWorks: "Read the Household Budget Arithmetic inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Household Budget Arithmetic works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "SP=140, CP=112. Find the profit.", steps: ["Profit=SP-CP.", "28.", "28."], answer: "28" },
      { prompt: "A 2% tax on 700?", steps: ["Tax=rate×amount.", "14.", "14."], answer: "14" },
      { prompt: "Is selling price always greater than cost price?", steps: ["A loss has SP < CP.", "No.", "No."], answer: "no" }
    ],
  },
  10021: {
    introduction: "Scale Factor in Maps and Recipes works this concrete case: Solve 3x = 24. The labelled answer is 8. Class 7 Applied Arithmetic: Teach Scale Factor in Maps and Recipes as a Class 7 Applied Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Scale Factor in Maps and Recipes fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Scale Factor in Maps and Recipes rule. Scale Factor in Maps and Recipes keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Applied Arithmetic: Teach Scale Factor in Maps and Recipes as a Class 7 Applied Arithmetic concept with syllabus-aligned exploration, practice, and assessment. Scale Factor in Maps and Recipes fills a Class 7 Applied Arithmetic syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Scale Factor in Maps and Recipes is the Applied Arithmetic rule used to compute one labelled numerical result.",
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
    introduction: "Copying a Line Segment works this concrete case: In Copying a Line Segment, evaluate the labelled model at input 9. The labelled answer is 36. Class 7 Practical Geometry: Teach Copying a Line Segment as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Copying a Line Segment fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Copying a Line Segment rule. Copying a Line Segment keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Practical Geometry: Teach Copying a Line Segment as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Copying a Line Segment fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Copying a Line Segment is the Practical Geometry rule used to compute one labelled numerical result.",
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
    introduction: "Copying an Angle works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Class 7 Practical Geometry: Teach Copying an Angle as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Copying an Angle fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Copying an Angle rule. Copying an Angle keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Practical Geometry: Teach Copying an Angle as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Copying an Angle fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Copying an Angle is the Practical Geometry rule used to compute one labelled numerical result.",
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
    introduction: "Perpendicular Bisector Construction works this concrete case: In Perpendicular Bisector Construction, evaluate the labelled model at input 3. The labelled answer is 18. Class 7 Practical Geometry: Teach Perpendicular Bisector Construction as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Perpendicular Bisector Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Perpendicular Bisector Construction rule. Perpendicular Bisector Construction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Practical Geometry: Teach Perpendicular Bisector Construction as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Perpendicular Bisector Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Perpendicular Bisector Construction is the Practical Geometry rule used to compute one labelled numerical result.",
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
    introduction: "Angle Bisector Construction works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Class 7 Practical Geometry: Teach Angle Bisector Construction as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Angle Bisector Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Angle Bisector Construction rule. Angle Bisector Construction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Practical Geometry: Teach Angle Bisector Construction as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Angle Bisector Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Angle Bisector Construction is the Practical Geometry rule used to compute one labelled numerical result.",
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
    introduction: "Perpendicular Through a Point works this concrete case: In Perpendicular Through a Point, evaluate the labelled model at input 5. The labelled answer is 10. Class 7 Practical Geometry: Teach Perpendicular Through a Point as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Perpendicular Through a Point fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Perpendicular Through a Point rule. Perpendicular Through a Point keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Practical Geometry: Teach Perpendicular Through a Point as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Perpendicular Through a Point fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Perpendicular Through a Point is the Practical Geometry rule used to compute one labelled numerical result.",
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
    introduction: "Parallel Line Construction works this concrete case: In Parallel Line Construction, evaluate the labelled model at input 6. The labelled answer is 18. Class 7 Practical Geometry: Teach Parallel Line Construction as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Parallel Line Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Parallel Line Construction rule. Parallel Line Construction keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 7 Practical Geometry: Teach Parallel Line Construction as a Class 7 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Parallel Line Construction fills a Class 7 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Parallel Line Construction is the Practical Geometry rule used to compute one labelled numerical result.",
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
    introduction: "Triangle Construction by SSS works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Class 8 Practical Geometry: Teach Triangle Construction by SSS as a Class 8 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Triangle Construction by SSS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Triangle Construction by SSS rule. Triangle Construction by SSS keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Practical Geometry: Teach Triangle Construction by SSS as a Class 8 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Triangle Construction by SSS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Triangle Construction by SSS is the Practical Geometry rule used to compute one labelled numerical result.",
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
    introduction: "Triangle Construction by SAS works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Class 8 Practical Geometry: Teach Triangle Construction by SAS as a Class 8 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Triangle Construction by SAS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Triangle Construction by SAS rule. Triangle Construction by SAS keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Practical Geometry: Teach Triangle Construction by SAS as a Class 8 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Triangle Construction by SAS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Triangle Construction by SAS is the Practical Geometry rule used to compute one labelled numerical result.",
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
    introduction: "Triangle Construction by ASA works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Class 8 Practical Geometry: Teach Triangle Construction by ASA as a Class 8 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Triangle Construction by ASA fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Triangle Construction by ASA rule. Triangle Construction by ASA keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Practical Geometry: Teach Triangle Construction by ASA as a Class 8 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Triangle Construction by ASA fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Triangle Construction by ASA is the Practical Geometry rule used to compute one labelled numerical result.",
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
    introduction: "Right Triangle Construction by RHS works this concrete case: A right angle is what fraction of a 360° turn? The labelled answer is 90. Class 8 Practical Geometry: Teach Right Triangle Construction by RHS as a Class 8 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Right Triangle Construction by RHS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Right Triangle Construction by RHS rule. Right Triangle Construction by RHS keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Practical Geometry: Teach Right Triangle Construction by RHS as a Class 8 Practical Geometry concept with syllabus-aligned exploration, practice, and assessment. Right Triangle Construction by RHS fills a Class 8 Practical Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Right Triangle Construction by RHS is the Practical Geometry rule used to compute one labelled numerical result.",
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
    introduction: "Double Bar Graph Comparison works this concrete case: If one icon = 2 students and 4 icons are shown, how many students? The labelled answer is 8. Class 8 Data Handling: Teach Double Bar Graph Comparison as a Class 8 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Double Bar Graph Comparison fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Double Bar Graph Comparison rule. Double Bar Graph Comparison keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Data Handling: Teach Double Bar Graph Comparison as a Class 8 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Double Bar Graph Comparison fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Double Bar Graph Comparison is the Data Handling rule used to compute one labelled numerical result.",
    basicIdea: "Double Bar Graph Comparison works this concrete case: If one icon = 2 students and 4 icons are shown, how many students?",
    howItWorks: "Read the Double Bar Graph Comparison inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Double Bar Graph Comparison works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "If one icon = 2 students and 4 icons are shown, how many students?", steps: ["4*2.", "8.", "8."], answer: "8" },
      { prompt: "A bar of height 30 vs 20: what is the difference?", steps: ["30-20.", "10.", "10."], answer: "10" },
      { prompt: "Can a pictograph hide the scale and still be read exactly?", steps: ["The key tells the value of one icon.", "Without the key the count is incomplete.", "No."], answer: "no" }
    ],
  },
  10033: {
    introduction: "Mean Median and Mode Practice Path works this concrete case: Find the mean of 4, 3, 6, 5. The labelled answer is 4.5. Class 8 Data Handling: Teach Mean Median and Mode Practice Path as a Class 8 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Mean Median and Mode Practice Path fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Mean Median and Mode Practice Path rule. Mean Median and Mode Practice Path keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Data Handling: Teach Mean Median and Mode Practice Path as a Class 8 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Mean Median and Mode Practice Path fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Mean Median and Mode Practice Path is the Data Handling rule used to compute one labelled numerical result.",
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
    introduction: "Range and Spread Explorer works this concrete case: In Range and Spread Explorer, evaluate the labelled model at input 5. The labelled answer is 20. Class 8 Data Handling: Teach Range and Spread Explorer as a Class 8 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Range and Spread Explorer fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Range and Spread Explorer rule. Range and Spread Explorer keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Data Handling: Teach Range and Spread Explorer as a Class 8 Data Handling concept with syllabus-aligned exploration, practice, and assessment. Range and Spread Explorer fills a Class 8 Data Handling syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Range and Spread Explorer is the Data Handling rule used to compute one labelled numerical result.",
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
    introduction: "Flowchart Logic works this concrete case: In Flowchart Logic, evaluate the labelled model at input 6. The labelled answer is 30. Class 8 Information Processing: Teach Flowchart Logic as a Class 8 Information Processing concept with syllabus-aligned exploration, practice, and assessment. Flowchart Logic fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Flowchart Logic rule. Flowchart Logic keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Information Processing: Teach Flowchart Logic as a Class 8 Information Processing concept with syllabus-aligned exploration, practice, and assessment. Flowchart Logic fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Flowchart Logic is the Information Processing rule used to compute one labelled numerical result.",
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
    introduction: "Pattern Encoding works this concrete case: In Pattern Encoding, evaluate the labelled model at input 7. The labelled answer is 42. Class 8 Information Processing: Teach Pattern Encoding as a Class 8 Information Processing concept with syllabus-aligned exploration, practice, and assessment. Pattern Encoding fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Pattern Encoding rule. Pattern Encoding keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Information Processing: Teach Pattern Encoding as a Class 8 Information Processing concept with syllabus-aligned exploration, practice, and assessment. Pattern Encoding fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Pattern Encoding is the Information Processing rule used to compute one labelled numerical result.",
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
    introduction: "Magic Squares works this concrete case: In Magic Squares, evaluate the labelled model at input 8. The labelled answer is 56. Class 8 Information Processing: Teach Magic Squares as a Class 8 Information Processing concept with syllabus-aligned exploration, practice, and assessment. Magic Squares fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Magic Squares rule. Magic Squares keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Information Processing: Teach Magic Squares as a Class 8 Information Processing concept with syllabus-aligned exploration, practice, and assessment. Magic Squares fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Magic Squares is the Information Processing rule used to compute one labelled numerical result.",
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
    introduction: "Route Map Reasoning works this concrete case: In Route Map Reasoning, evaluate the labelled model at input 9. The labelled answer is 18. Class 8 Information Processing: Teach Route Map Reasoning as a Class 8 Information Processing concept with syllabus-aligned exploration, practice, and assessment. Route Map Reasoning fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Route Map Reasoning rule. Route Map Reasoning keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Information Processing: Teach Route Map Reasoning as a Class 8 Information Processing concept with syllabus-aligned exploration, practice, and assessment. Route Map Reasoning fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Route Map Reasoning is the Information Processing rule used to compute one labelled numerical result.",
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
    introduction: "Tabular Pattern Completion works this concrete case: In Tabular Pattern Completion, evaluate the labelled model at input 10. The labelled answer is 30. Class 8 Information Processing: Teach Tabular Pattern Completion as a Class 8 Information Processing concept with syllabus-aligned exploration, practice, and assessment. Tabular Pattern Completion fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Tabular Pattern Completion rule. Tabular Pattern Completion keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 8 Information Processing: Teach Tabular Pattern Completion as a Class 8 Information Processing concept with syllabus-aligned exploration, practice, and assessment. Tabular Pattern Completion fills a Class 8 Information Processing syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Tabular Pattern Completion is the Information Processing rule used to compute one labelled numerical result.",
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
    introduction: "Decimal Expansion of Rational Numbers works this concrete case: Find √9. The labelled answer is 3. Class 9 Real Numbers: Teach Decimal Expansion of Rational Numbers as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. Decimal Expansion of Rational Numbers fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Decimal Expansion of Rational Numbers rule. Decimal Expansion of Rational Numbers keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Real Numbers: Teach Decimal Expansion of Rational Numbers as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. Decimal Expansion of Rational Numbers fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Decimal Expansion of Rational Numbers is the Real Numbers rule used to compute one labelled numerical result.",
    basicIdea: "Decimal Expansion of Rational Numbers works this concrete case: Find √9.",
    howItWorks: "Read the Decimal Expansion of Rational Numbers inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Decimal Expansion of Rational Numbers works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find √9.", steps: ["Square root of a square.", "3.", "3."], answer: "3" },
      { prompt: "Is 1/16 a terminating decimal in base 10?", steps: ["Denomination after cancelling 2s and 5s.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is 1/3 a terminating decimal?", steps: ["1/3=0.333...", "It repeats.", "No."], answer: "no" }
    ],
  },
  10041: {
    introduction: "Terminating and Non-Terminating Decimals works this concrete case: Find √16. The labelled answer is 4. Class 9 Real Numbers: Teach Terminating and Non-Terminating Decimals as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. Terminating and Non-Terminating Decimals fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Terminating and Non-Terminating Decimals rule. Terminating and Non-Terminating Decimals keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Real Numbers: Teach Terminating and Non-Terminating Decimals as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. Terminating and Non-Terminating Decimals fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Terminating and Non-Terminating Decimals is the Real Numbers rule used to compute one labelled numerical result.",
    basicIdea: "Terminating and Non-Terminating Decimals works this concrete case: Find √16.",
    howItWorks: "Read the Terminating and Non-Terminating Decimals inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Terminating and Non-Terminating Decimals works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find √16.", steps: ["Square root of a square.", "4.", "4."], answer: "4" },
      { prompt: "Is 1/32 a terminating decimal in base 10?", steps: ["Denomination after cancelling 2s and 5s.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is 1/3 a terminating decimal?", steps: ["1/3=0.333...", "It repeats.", "No."], answer: "no" }
    ],
  },
  10042: {
    introduction: "Rational and Irrational Classification works this concrete case: In Rational and Irrational Classification, evaluate the labelled model at input 5. The labelled answer is 30. Class 9 Real Numbers: Teach Rational and Irrational Classification as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. Rational and Irrational Classification fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Rational and Irrational Classification rule. Rational and Irrational Classification keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Real Numbers: Teach Rational and Irrational Classification as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. Rational and Irrational Classification fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Rational and Irrational Classification is the Real Numbers rule used to compute one labelled numerical result.",
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
    introduction: "Successive Magnification on the Number Line works this concrete case: In Successive Magnification on the Number Line, evaluate the labelled model at input 6. The labelled answer is 42. Class 9 Real Numbers: Teach Successive Magnification on the Number Line as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. Successive Magnification on the Number Line fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Successive Magnification on the Number Line rule. Successive Magnification on the Number Line keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Real Numbers: Teach Successive Magnification on the Number Line as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. Successive Magnification on the Number Line fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Successive Magnification on the Number Line is the Real Numbers rule used to compute one labelled numerical result.",
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
    introduction: "Rationalisation of Denominators works this concrete case: Find √49. The labelled answer is 7. Class 9 Real Numbers: Teach Rationalisation of Denominators as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. Rationalisation of Denominators fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Rationalisation of Denominators rule. Rationalisation of Denominators keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Real Numbers: Teach Rationalisation of Denominators as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. Rationalisation of Denominators fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Rationalisation of Denominators is the Real Numbers rule used to compute one labelled numerical result.",
    basicIdea: "Rationalisation of Denominators works this concrete case: Find √49.",
    howItWorks: "Read the Rationalisation of Denominators inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Rationalisation of Denominators works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find √49.", steps: ["Square root of a square.", "7.", "7."], answer: "7" },
      { prompt: "Is 1/4 a terminating decimal in base 10?", steps: ["Denomination after cancelling 2s and 5s.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is 1/3 a terminating decimal?", steps: ["1/3=0.333...", "It repeats.", "No."], answer: "no" }
    ],
  },
  10045: {
    introduction: "nth Roots and Radical Meaning works this concrete case: Find √64. The labelled answer is 8. Class 9 Real Numbers: Teach nth Roots and Radical Meaning as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. nth Roots and Radical Meaning fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the nth Roots and Radical Meaning rule. nth Roots and Radical Meaning keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Real Numbers: Teach nth Roots and Radical Meaning as a Class 9 Real Numbers concept with syllabus-aligned exploration, practice, and assessment. nth Roots and Radical Meaning fills a Class 9 Real Numbers syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. nth Roots and Radical Meaning is the Real Numbers rule used to compute one labelled numerical result.",
    basicIdea: "nth Roots and Radical Meaning works this concrete case: Find √64.",
    howItWorks: "Read the nth Roots and Radical Meaning inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "nth Roots and Radical Meaning works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Find √64.", steps: ["Square root of a square.", "8.", "8."], answer: "8" },
      { prompt: "Is 1/8 a terminating decimal in base 10?", steps: ["Denomination after cancelling 2s and 5s.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is 1/3 a terminating decimal?", steps: ["1/3=0.333...", "It repeats.", "No."], answer: "no" }
    ],
  },
  10046: {
    introduction: "Graphical Zeros of Polynomials works this concrete case: A cubic can have at most how many real zeros? The labelled answer is 3. Class 9 Polynomials: Teach Graphical Zeros of Polynomials as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Graphical Zeros of Polynomials fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Graphical Zeros of Polynomials rule. Graphical Zeros of Polynomials keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Polynomials: Teach Graphical Zeros of Polynomials as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Graphical Zeros of Polynomials fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Graphical Zeros of Polynomials is the Polynomials rule used to compute one labelled numerical result.",
    basicIdea: "Graphical Zeros of Polynomials works this concrete case: A cubic can have at most how many real zeros?",
    howItWorks: "Read the Graphical Zeros of Polynomials inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Graphical Zeros of Polynomials works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A cubic can have at most how many real zeros?", steps: ["Degree 3.", "3.", "3"], answer: "3" },
      { prompt: "Divide 2x^2+9x by x. What is the quotient?", steps: ["2x+9.", "2x+9.", "2x+9."], answer: "2x+9" },
      { prompt: "Does every cubic have 3 real zeros?", steps: ["Some zeros can be complex.", "No.", "No."], answer: "no" }
    ],
  },
  10047: {
    introduction: "Polynomial Division works this concrete case: A cubic can have at most how many real zeros? The labelled answer is 3. Class 9 Polynomials: Teach Polynomial Division as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Polynomial Division fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Polynomial Division rule. Polynomial Division keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Polynomials: Teach Polynomial Division as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Polynomial Division fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Polynomial Division is the Polynomials rule used to compute one labelled numerical result.",
    basicIdea: "Polynomial Division works this concrete case: A cubic can have at most how many real zeros?",
    howItWorks: "Read the Polynomial Division inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Polynomial Division works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A cubic can have at most how many real zeros?", steps: ["Degree 3.", "3.", "3"], answer: "3" },
      { prompt: "Divide 2x^2+10x by x. What is the quotient?", steps: ["2x+10.", "2x+10.", "2x+10."], answer: "2x+10" },
      { prompt: "Does every cubic have 3 real zeros?", steps: ["Some zeros can be complex.", "No.", "No."], answer: "no" }
    ],
  },
  10048: {
    introduction: "Remainder Theorem works this concrete case: Remainder when P(x)=x^2+6 is divided by x-3? The labelled answer is 15. Class 9 Polynomials: Teach Remainder Theorem as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Remainder Theorem fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Remainder Theorem rule. Remainder Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Polynomials: Teach Remainder Theorem as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Remainder Theorem fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Remainder Theorem is the Polynomials rule used to compute one labelled numerical result.",
    basicIdea: "Remainder Theorem works this concrete case: Remainder when P(x)=x^2+6 is divided by x-3?",
    howItWorks: "Read the Remainder Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Remainder Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "Remainder when P(x)=x^2+6 is divided by x-3?", steps: ["Remainder=P(3).", "15.", "15."], answer: "15" },
      { prompt: "If P(3)=0, what is the remainder on division by x-3?", steps: ["Remainder theorem: remainder is P(a).", "0.", "0"], answer: "0" },
      { prompt: "Is the remainder the same as the quotient?", steps: ["Remainder is P(a); quotient is the other factor.", "No.", "No."], answer: "no" }
    ],
  },
  10049: {
    introduction: "Factor Theorem works this concrete case: If P(4)=0, is x-4 a factor? The labelled answer is yes. Class 9 Polynomials: Teach Factor Theorem as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Factor Theorem fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Factor Theorem rule. Factor Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Polynomials: Teach Factor Theorem as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Factor Theorem fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Factor Theorem is the Polynomials rule used to compute one labelled numerical result.",
    basicIdea: "Factor Theorem works this concrete case: If P(4)=0, is x-4 a factor?",
    howItWorks: "Read the Factor Theorem inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Factor Theorem works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "If P(4)=0, is x-4 a factor?", steps: ["Factor theorem: P(a)=0 iff x-a is a factor.", "Yes.", "yes"], answer: "yes" },
      { prompt: "P(x)=x^2-16. Is x-4 a factor?", steps: ["P(4)=16-16=0.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Does P(a)=a prove x-a is a factor?", steps: ["The value must be 0.", "No.", "No."], answer: "no" }
    ],
  },
  10050: {
    introduction: "Relationship Between Zeros and Coefficients works this concrete case: A cubic can have at most how many real zeros? The labelled answer is 3. Class 9 Polynomials: Teach Relationship Between Zeros and Coefficients as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Relationship Between Zeros and Coefficients fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Relationship Between Zeros and Coefficients rule. Relationship Between Zeros and Coefficients keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Polynomials: Teach Relationship Between Zeros and Coefficients as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Relationship Between Zeros and Coefficients fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Relationship Between Zeros and Coefficients is the Polynomials rule used to compute one labelled numerical result.",
    basicIdea: "Relationship Between Zeros and Coefficients works this concrete case: A cubic can have at most how many real zeros?",
    howItWorks: "Read the Relationship Between Zeros and Coefficients inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Relationship Between Zeros and Coefficients works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A cubic can have at most how many real zeros?", steps: ["Degree 3.", "3.", "3"], answer: "3" },
      { prompt: "Divide 2x^2+5x by x. What is the quotient?", steps: ["2x+5.", "2x+5.", "2x+5."], answer: "2x+5" },
      { prompt: "Does every cubic have 3 real zeros?", steps: ["Some zeros can be complex.", "No.", "No."], answer: "no" }
    ],
  },
  10051: {
    introduction: "Cubic Algebraic Identities works this concrete case: A cubic can have at most how many real zeros? The labelled answer is 3. Class 9 Polynomials: Teach Cubic Algebraic Identities as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Cubic Algebraic Identities fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Cubic Algebraic Identities rule. Cubic Algebraic Identities keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Polynomials: Teach Cubic Algebraic Identities as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Cubic Algebraic Identities fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Cubic Algebraic Identities is the Polynomials rule used to compute one labelled numerical result.",
    basicIdea: "Cubic Algebraic Identities works this concrete case: A cubic can have at most how many real zeros?",
    howItWorks: "Read the Cubic Algebraic Identities inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Cubic Algebraic Identities works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A cubic can have at most how many real zeros?", steps: ["Degree 3.", "3.", "3"], answer: "3" },
      { prompt: "Divide 2x^2+6x by x. What is the quotient?", steps: ["2x+6.", "2x+6.", "2x+6."], answer: "2x+6" },
      { prompt: "Does every cubic have 3 real zeros?", steps: ["Some zeros can be complex.", "No.", "No."], answer: "no" }
    ],
  },
  10052: {
    introduction: "Polynomial Factorisation Practice works this concrete case: A cubic can have at most how many real zeros? The labelled answer is 3. Class 9 Polynomials: Teach Polynomial Factorisation Practice as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Polynomial Factorisation Practice fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Polynomial Factorisation Practice rule. Polynomial Factorisation Practice keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Polynomials: Teach Polynomial Factorisation Practice as a Class 9 Polynomials concept with syllabus-aligned exploration, practice, and assessment. Polynomial Factorisation Practice fills a Class 9 Polynomials syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Polynomial Factorisation Practice is the Polynomials rule used to compute one labelled numerical result.",
    basicIdea: "Polynomial Factorisation Practice works this concrete case: A cubic can have at most how many real zeros?",
    howItWorks: "Read the Polynomial Factorisation Practice inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Polynomial Factorisation Practice works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A cubic can have at most how many real zeros?", steps: ["Degree 3.", "3.", "3"], answer: "3" },
      { prompt: "Divide 2x^2+7x by x. What is the quotient?", steps: ["2x+7.", "2x+7.", "2x+7."], answer: "2x+7" },
      { prompt: "Does every cubic have 3 real zeros?", steps: ["Some zeros can be complex.", "No.", "No."], answer: "no" }
    ],
  },
  10053: {
    introduction: "Definitions Axioms and Postulates works this concrete case: A triangle has angles 50° and 80°. Find the third angle. The labelled answer is 50. Class 9 Euclidean Geometry: Teach Definitions Axioms and Postulates as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. Definitions Axioms and Postulates fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is using a nearby formula that is not the Definitions Axioms and Postulates rule. Definitions Axioms and Postulates keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Class 9 Euclidean Geometry: Teach Definitions Axioms and Postulates as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. Definitions Axioms and Postulates fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Definitions Axioms and Postulates is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Definitions Axioms and Postulates works this concrete case: A triangle has angles 50° and 80°. Find the third angle.",
    howItWorks: "Read the Definitions Axioms and Postulates inputs, apply the exact rule, and report the labelled output.",
    whyItWorks: "Definitions Axioms and Postulates works because the definition forces one consistent calculation.",
    worked: [
      { prompt: "A triangle has angles 50° and 80°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-80.", "50."], answer: "50" },
      { prompt: "Does a theorem need proof?", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is an axiom proved inside the same system?", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10054: {
    introduction: "Euclid's Five Postulates works this concrete case: A triangle has angles 50° and 90°. Find the third angle. The labelled answer is 40. Class 9 Euclidean Geometry: Teach Euclid's Five Postulates as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. Euclid's Five Postulates fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is trying to prove Euclid's postulates inside Euclidean geometry. Euclid's Five Postulates keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Euclid's five postulates are accepted starting rules about drawing lines, extending lines, circles, right angles, and parallel lines. A proof system needs starting rules before later theorems can be proved. Class 9 Euclidean Geometry: Teach Euclid's Five Postulates as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. Euclid's Five Postulates fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Euclid's Five Postulates is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Euclid's Five Postulates works this concrete case: A triangle has angles 50° and 90°. Find the third angle.",
    howItWorks: "Read each postulate, identify what it allows, then use it only as an accepted starting statement.",
    whyItWorks: "A proof system needs starting rules before later theorems can be proved.",
    worked: [
      { prompt: "A triangle has angles 50° and 90°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-90.", "40."], answer: "40" },
      { prompt: "Does a theorem need proof?", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is an axiom proved inside the same system?", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10055: {
    introduction: "Equivalent Forms of the Fifth Postulate works this concrete case: A triangle has angles 50° and 100°. Find the third angle. The labelled answer is 30. Class 9 Euclidean Geometry: Teach Equivalent Forms of the Fifth Postulate as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. Equivalent Forms of the Fifth Postulate fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is thinking two statements are equivalent just because they sound similar. Equivalent Forms of the Fifth Postulate keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "Equivalent forms of the fifth postulate are statements with the same logical force as the Euclidean parallel postulate. Equivalent statements are interchangeable because each can be proved from the other. Class 9 Euclidean Geometry: Teach Equivalent Forms of the Fifth Postulate as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. Equivalent Forms of the Fifth Postulate fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Equivalent Forms of the Fifth Postulate is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Equivalent Forms of the Fifth Postulate works this concrete case: A triangle has angles 50° and 100°. Find the third angle.",
    howItWorks: "Compare both statements, then check whether each one can imply the other.",
    whyItWorks: "Equivalent statements are interchangeable because each can be proved from the other.",
    worked: [
      { prompt: "A triangle has angles 50° and 100°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-100.", "30."], answer: "30" },
      { prompt: "Does a theorem need proof?", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is an axiom proved inside the same system?", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
    ],
  },
  10056: {
    introduction: "Axiom versus Theorem works this concrete case: A triangle has angles 50° and 30°. Find the third angle. The labelled answer is 100. Class 9 Euclidean Geometry: Teach Axiom versus Theorem as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. Axiom versus Theorem fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. A common labelled error is calling every true statement a theorem. Axiom versus Theorem keeps one numerical story on the labelled chart, the interactive probe, and the three worked calculations so the original interaction canvas does not have to change.",
    definition: "An axiom is accepted without proof, while a theorem is proved from accepted facts. Logical systems need axioms as starting points and theorems as proved results. Class 9 Euclidean Geometry: Teach Axiom versus Theorem as a Class 9 Euclidean Geometry concept with syllabus-aligned exploration, practice, and assessment. Axiom versus Theorem fills a Class 9 Euclidean Geometry syllabus gap. The lesson introduces the concept, connects it to an interactive representation, and checks mastery with targeted practice. Axiom versus Theorem is the Euclidean Geometry rule used to compute one labelled numerical result.",
    basicIdea: "Axiom versus Theorem works this concrete case: A triangle has angles 50° and 30°. Find the third angle.",
    howItWorks: "Classify the statement, list accepted facts, then decide whether proof is required.",
    whyItWorks: "Logical systems need axioms as starting points and theorems as proved results.",
    worked: [
      { prompt: "A triangle has angles 50° and 30°. Find the third angle.", steps: ["Angles sum to 180°.", "180-50-30.", "100."], answer: "100" },
      { prompt: "Does a theorem need proof?", steps: ["A theorem is proved from axioms.", "Yes.", "yes"], answer: "yes" },
      { prompt: "Is an axiom proved inside the same system?", steps: ["An axiom is an accepted start.", "No.", "No."], answer: "no" }
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

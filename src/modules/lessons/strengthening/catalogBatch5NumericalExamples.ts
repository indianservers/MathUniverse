type NumericalExampleSeed = readonly [prompt: string, steps: readonly string[], answer: string];

function calculation(
  prompt: string,
  working: string,
  result: string,
  answer: string = result,
): NumericalExampleSeed {
  return [
    prompt,
    [String.raw`\displaystyle ${working}`, String.raw`\displaystyle ${result}`, String.raw`\displaystyle \boxed{${result}}`],
    answer,
  ];
}

export const batch5NumericalExamples: Readonly<Record<number, readonly NumericalExampleSeed[]>> = {
  531: [
    calculation("If between-group MS=6 and within-group MS=5, what is F?", "F=MS_B/MS_W.", "6/5.", "6/5"),
    calculation("An F test uses numerator df=6 and denominator df=25. How many df values are needed?", "F needs both numerator and denominator df.", "2.", "2"),
    calculation("Can an F statistic be negative?", "F is a ratio of variances.", "no.", "no"),
  ],
  532: [
    calculation("If the rate is 6 events per hour, what is the mean wait?", "Mean wait=1/λ.", "1/6.", "1/6"),
    calculation("P(wait > 0) for a continuous exponential wait?", "The waiting time starts at 0.", "1.", "1"),
    calculation("Does extra waiting change the remaining exponential wait?", "Exponential is memoryless.", "no.", "no"),
  ],
  533: [
    calculation("Exponential is gamma with shape 1. Time until 7 events uses shape what?", "Shape counts the target events.", "7.", "7"),
    calculation("If each event has mean wait 1/8, mean time until 7 events is?", "Mean=shape/rate.", "7/8.", "7/8"),
    calculation("Is gamma only for a single event?", "Gamma waits for several events.", "no.", "no"),
  ],
  534: [
    calculation("If Weibull shape=9 > 1, does failure risk increase?", "Shape > 1 means wear-out.", "yes.", "yes"),
    calculation("Shape=1 is the exponential case. What risk pattern is that?", "Shape 1 keeps a constant hazard.", "constant.", "constant"),
    calculation("Must Weibull risk stay constant?", "Shape can raise or lower risk.", "no.", "no"),
  ],
  535: [
    calculation("Find z if x=20, μ=10, σ=3.", "z=(x-μ)/σ.", "10/3.", "10/3"),
    calculation("A z-score of 0 means the value equals what?", "z=0 when x=μ.", "mean.", "mean"),
    calculation("Is subtracting the mean enough to standardise?", "A z-score also divides by σ.", "no.", "no"),
  ],
  536: [
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  537: [
    calculation("Sample n=40. SE of the mean if σ=5 is σ/√n. Find SE.", "√n=√40.", "5/√40.", "5/√40"),
    calculation("Does the CLT say every sample is normal?", "It describes the sampling distribution of the mean.", "no.", "no"),
    calculation("If n increases from 4 to 16, SE is multiplied by what?", "SE scales as 1/√n.", "1/2.", "1/2"),
  ],
  538: [
    calculation("Sample n=50. SE of the mean if σ=6 is σ/√n. Find SE.", "√n=√50.", "6/√50.", "6/√50"),
    calculation("Does the CLT say every sample is normal?", "It describes the sampling distribution of the mean.", "no.", "no"),
    calculation("If n increases from 5 to 20, SE is multiplied by what?", "SE scales as 1/√n.", "1/2.", "1/2"),
  ],
  539: [
    calculation("A 95% CI is 6 ± 7. What is the upper bound?", "6+7.", "13.", "13"),
    calculation("If SE=7 and z*=2, what is the margin of error?", "ME=z*×SE.", "14.", "14"),
    calculation("Does a 95% CI contain the sample mean by construction for a symmetric interval around the mean?", "The interval is centred on the sample mean.", "yes.", "yes"),
  ],
  540: [
    calculation("A 95% CI is 7 ± 2. What is the upper bound?", "7+2.", "9.", "9"),
    calculation("If SE=2 and z*=2, what is the margin of error?", "ME=z*×SE.", "4.", "4"),
    calculation("Does a 95% CI contain the sample mean by construction for a symmetric interval around the mean?", "The interval is centred on the sample mean.", "yes.", "yes"),
  ],
  541: [
    calculation("Find the mean of 8, 3, 6, 9.", "Sum=26.", "6.5.", "6.5"),
    calculation("If one value increases by 3, how does the mean change?", "The total rises by 3.", "0.75.", "0.75"),
    calculation("Must the mean be one of the data values?", "The mean is a balance point.", "no.", "no"),
  ],
  542: [
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  543: [
    calculation("If z=10 and the critical value is 5, is |z| past the cutoff?", "|10|=10.", "yes.", "yes"),
    calculation("df=8. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
    calculation("Does failing to reject H0 prove H0 is true?", "Not rejecting is not proof.", "no.", "no"),
  ],
  544: [
    calculation("If z=3 and the critical value is 6, is |z| past the cutoff?", "|3|=3.", "no.", "no"),
    calculation("df=9. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
    calculation("Does failing to reject H0 prove H0 is true?", "Not rejecting is not proof.", "no.", "no"),
  ],
  545: [
    calculation("If z=4 and the critical value is 7, is |z| past the cutoff?", "|4|=4.", "no.", "no"),
    calculation("df=10. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
    calculation("Does failing to reject H0 prove H0 is true?", "Not rejecting is not proof.", "no.", "no"),
  ],
  546: [
    calculation("If z=5 and the critical value is 2, is |z| past the cutoff?", "|5|=5.", "yes.", "yes"),
    calculation("df=4. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
    calculation("Does failing to reject H0 prove H0 is true?", "Not rejecting is not proof.", "no.", "no"),
  ],
  547: [
    calculation("If z=6 and the critical value is 3, is |z| past the cutoff?", "|6|=6.", "yes.", "yes"),
    calculation("df=5. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
    calculation("Does failing to reject H0 prove H0 is true?", "Not rejecting is not proof.", "no.", "no"),
  ],
  548: [
    calculation("If z=7 and the critical value is 4, is |z| past the cutoff?", "|7|=7.", "yes.", "yes"),
    calculation("df=6. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
    calculation("Does failing to reject H0 prove H0 is true?", "Not rejecting is not proof.", "no.", "no"),
  ],
  549: [
    calculation("If z=8 and the critical value is 5, is |z| past the cutoff?", "|8|=8.", "yes.", "yes"),
    calculation("df=7. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
    calculation("Does failing to reject H0 prove H0 is true?", "Not rejecting is not proof.", "no.", "no"),
  ],
  550: [
    calculation("If z=9 and the critical value is 6, is |z| past the cutoff?", "|9|=9.", "yes.", "yes"),
    calculation("df=8. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
    calculation("Does failing to reject H0 prove H0 is true?", "Not rejecting is not proof.", "no.", "no"),
  ],
  551: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  552: [
    calculation("If between-group MS=3 and within-group MS=2, what is F?", "F=MS_B/MS_W.", "3/2.", "3/2"),
    calculation("An F test uses numerator df=3 and denominator df=10. How many df values are needed?", "F needs both numerator and denominator df.", "2.", "2"),
    calculation("Can an F statistic be negative?", "F is a ratio of variances.", "no.", "no"),
  ],
  553: [
    calculation("If p=0.03 and α=0.05, do we reject H0?", "Compare 0.03 with 0.05.", "yes.", "yes"),
    calculation("A p-value is the probability of data as extreme as observed, assuming what?", "The p-value is computed under H0.", "H0.", "H0"),
    calculation("Does p=0.20 prove H0 is true?", "Large p is lack of evidence against H0.", "no.", "no"),
  ],
  554: [
    calculation("If α=0.04, what is the Type I error rate used?", "α is P(reject H0 | H0 true).", "0.04.", "0.04"),
    calculation("Type II error is failing to reject H0 when it is what?", "Type II happens when H0 is false.", "false.", "false"),
    calculation("Is power the same as α?", "Power is 1−β.", "no.", "no"),
  ],
  555: [
    calculation("If β=0.5, what is the power?", "Power=1-β.", "0.5.", "0.5"),
    calculation("Larger n=60 usually does what to power?", "More data shrinks SE.", "increases.", "increases"),
    calculation("Is power the Type I error rate?", "Power is 1−β.", "no.", "no"),
  ],
  556: [
    calculation("Compute P(7,6).", "P(n,k)=n!/(n-k)!.", "5040.", "5040"),
    calculation("If order matters, is P(7,6) larger than C(7,6) for k>1?", "Permutations count arrangements.", "yes.", "yes"),
    calculation("Does a permutation ignore order?", "Permutations count order.", "no.", "no"),
  ],
  557: [
    calculation("Compute 7!.", "7!=7×6×5×4×3×2×1.", "5040.", "5040"),
    calculation("How many ways can 7 distinct books be lined up?", "Permutations of 7 are 7!.", "5040.", "5040"),
    calculation("Is 0! equal to 0?", "Empty product is 1.", "no.", "no"),
  ],
  558: [
    calculation("Compute P(9,2).", "P(n,k)=n!/(n-k)!.", "72.", "72"),
    calculation("If order matters, is P(9,2) larger than C(9,2) for k>1?", "Permutations count arrangements.", "yes.", "yes"),
    calculation("Does a permutation ignore order?", "Permutations count order.", "no.", "no"),
  ],
  559: [
    calculation("Compute P(10,3).", "P(n,k)=n!/(n-k)!.", "720.", "720"),
    calculation("If order matters, is P(10,3) larger than C(10,3) for k>1?", "Permutations count arrangements.", "yes.", "yes"),
    calculation("Does a permutation ignore order?", "Permutations count order.", "no.", "no"),
  ],
  560: [
    calculation("Compute P(5,3).", "P(n,k)=n!/(n-k)!.", "60.", "60"),
    calculation("If order matters, is P(5,3) larger than C(5,3) for k>1?", "Permutations count arrangements.", "yes.", "yes"),
    calculation("Does a permutation ignore order?", "Permutations count order.", "no.", "no"),
  ],
  561: [
    calculation("Compute C(6,4).", "C(n,k)=n!/(k!(n-k)!).", "15.", "15"),
    calculation("Does C(6,4) equal C(6,2)?", "Combinations are symmetric.", "yes.", "yes"),
    calculation("Does order matter in a combination?", "Combinations ignore order.", "no.", "no"),
  ],
  562: [
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 50° and 60°. What is the sum?", "50+60.", "110.", "110"),
    calculation("Do longer rays make a larger angle?", "Angle is turn, not ray length.", "no.", "no"),
  ],
  563: [
    calculation("In Inclusion–Exclusion, evaluate the labelled model at input 6.", "Substitute 6 into the Inclusion–Exclusion rule.", "42.", "42"),
    calculation("Compare the Inclusion–Exclusion outputs at 6 and 13. What is the difference?", "Second input 13.", "7.", "7"),
    calculation("Can you skip the Inclusion–Exclusion restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  564: [
    calculation("Compute P(7,2).", "P(n,k)=n!/(n-k)!.", "42.", "42"),
    calculation("If order matters, is P(7,2) larger than C(7,2) for k>1?", "Permutations count arrangements.", "yes.", "yes"),
    calculation("Does a permutation ignore order?", "Permutations count order.", "no.", "no"),
  ],
  565: [
    calculation("A complete graph K_10 has how many edges?", "K_n has n(n-1)/2 edges.", "45.", "45"),
    calculation("A tree with 11 vertices has how many edges?", "A tree has n-1 edges.", "10.", "10"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  566: [
    calculation("A complete graph K_11 has how many edges?", "K_n has n(n-1)/2 edges.", "55.", "55"),
    calculation("A tree with 12 vertices has how many edges?", "A tree has n-1 edges.", "11.", "11"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  567: [
    calculation("A complete graph K_12 has how many edges?", "K_n has n(n-1)/2 edges.", "66.", "66"),
    calculation("A tree with 13 vertices has how many edges?", "A tree has n-1 edges.", "12.", "12"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  568: [
    calculation("A complete graph K_5 has how many edges?", "K_n has n(n-1)/2 edges.", "10.", "10"),
    calculation("A tree with 6 vertices has how many edges?", "A tree has n-1 edges.", "5.", "5"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  569: [
    calculation("In Paths and Cycles, evaluate the labelled model at input 4.", "Substitute 4 into the Paths and Cycles rule.", "28.", "28"),
    calculation("Compare the Paths and Cycles outputs at 4 and 11. What is the difference?", "Second input 11.", "7.", "7"),
    calculation("Can you skip the Paths and Cycles restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  570: [
    calculation("In Connected Components, evaluate the labelled model at input 5.", "Substitute 5 into the Connected Components rule.", "10.", "10"),
    calculation("Compare the Connected Components outputs at 5 and 7. What is the difference?", "Second input 7.", "2.", "2"),
    calculation("Can you skip the Connected Components restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  571: [
    calculation("A complete graph K_8 has how many edges?", "K_n has n(n-1)/2 edges.", "28.", "28"),
    calculation("A tree with 9 vertices has how many edges?", "A tree has n-1 edges.", "8.", "8"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  572: [
    calculation("A complete graph K_9 has how many edges?", "K_n has n(n-1)/2 edges.", "36.", "36"),
    calculation("A tree with 10 vertices has how many edges?", "A tree has n-1 edges.", "9.", "9"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  573: [
    calculation("In Trees, evaluate the labelled model at input 8.", "Substitute 8 into the Trees rule.", "40.", "40"),
    calculation("Compare the Trees outputs at 8 and 13. What is the difference?", "Second input 13.", "5.", "5"),
    calculation("Can you skip the Trees restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  574: [
    calculation("A complete graph K_11 has how many edges?", "K_n has n(n-1)/2 edges.", "55.", "55"),
    calculation("A tree with 12 vertices has how many edges?", "A tree has n-1 edges.", "11.", "11"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  575: [
    calculation("A complete graph K_12 has how many edges?", "K_n has n(n-1)/2 edges.", "66.", "66"),
    calculation("A tree with 13 vertices has how many edges?", "A tree has n-1 edges.", "12.", "12"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  576: [
    calculation("A complete graph K_5 has how many edges?", "K_n has n(n-1)/2 edges.", "10.", "10"),
    calculation("A tree with 6 vertices has how many edges?", "A tree has n-1 edges.", "5.", "5"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  577: [
    calculation("A complete graph K_6 has how many edges?", "K_n has n(n-1)/2 edges.", "15.", "15"),
    calculation("A tree with 7 vertices has how many edges?", "A tree has n-1 edges.", "6.", "6"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  578: [
    calculation("A complete graph K_7 has how many edges?", "K_n has n(n-1)/2 edges.", "21.", "21"),
    calculation("A tree with 8 vertices has how many edges?", "A tree has n-1 edges.", "7.", "7"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  579: [
    calculation("A complete graph K_8 has how many edges?", "K_n has n(n-1)/2 edges.", "28.", "28"),
    calculation("A tree with 9 vertices has how many edges?", "A tree has n-1 edges.", "8.", "8"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  580: [
    calculation("In Travelling Salesperson, evaluate the labelled model at input 7.", "Substitute 7 into the Travelling Salesperson rule.", "42.", "42"),
    calculation("Compare the Travelling Salesperson outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
    calculation("Can you skip the Travelling Salesperson restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  581: [
    calculation("A complete graph K_10 has how many edges?", "K_n has n(n-1)/2 edges.", "45.", "45"),
    calculation("A tree with 11 vertices has how many edges?", "A tree has n-1 edges.", "10.", "10"),
    calculation("Can a simple graph have a loop at one vertex?", "Simple graphs forbid loops.", "no.", "no"),
  ],
  582: [
    calculation("If A has 9 elements, |P(A)| is?", "A power set has 2^n subsets.", "512.", "512"),
    calculation("|A union B| if |A|=9, |B|=2, |A intersect B|=2?", "|A union B|=|A|+|B|-|A intersect B|.", "9.", "9"),
    calculation("Is the empty set a subset of every set?", "∅ is a subset of every set.", "yes.", "yes"),
  ],
  583: [
    calculation("In Union, Intersection and Difference, evaluate the labelled model at input 10.", "Substitute 10 into the Union, Intersection and Difference rule.", "30.", "30"),
    calculation("Compare the Union, Intersection and Difference outputs at 10 and 13. What is the difference?", "Second input 13.", "3.", "3"),
    calculation("Can you skip the Union, Intersection and Difference restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  584: [
    calculation("If A has 3 elements, |P(A)| is?", "A power set has 2^n subsets.", "8.", "8"),
    calculation("|A union B| if |A|=3, |B|=4, |A intersect B|=2?", "|A union B|=|A|+|B|-|A intersect B|.", "5.", "5"),
    calculation("Is the empty set a subset of every set?", "∅ is a subset of every set.", "yes.", "yes"),
  ],
  585: [
    calculation("If A has 4 elements, |P(A)| is?", "A power set has 2^n subsets.", "16.", "16"),
    calculation("|A union B| if |A|=4, |B|=5, |A intersect B|=2?", "|A union B|=|A|+|B|-|A intersect B|.", "7.", "7"),
    calculation("Is the empty set a subset of every set?", "∅ is a subset of every set.", "yes.", "yes"),
  ],
  586: [
    calculation("If A has 5 elements, |P(A)| is?", "A power set has 2^n subsets.", "32.", "32"),
    calculation("|A union B| if |A|=5, |B|=6, |A intersect B|=2?", "|A union B|=|A|+|B|-|A intersect B|.", "9.", "9"),
    calculation("Is the empty set a subset of every set?", "∅ is a subset of every set.", "yes.", "yes"),
  ],
  587: [
    calculation("In Truth Tables, evaluate the labelled model at input 6.", "Substitute 6 into the Truth Tables rule.", "42.", "42"),
    calculation("Compare the Truth Tables outputs at 6 and 13. What is the difference?", "Second input 13.", "7.", "7"),
    calculation("Can you skip the Truth Tables restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  588: [
    calculation("In Logical Connectives, evaluate the labelled model at input 7.", "Substitute 7 into the Logical Connectives rule.", "14.", "14"),
    calculation("Compare the Logical Connectives outputs at 7 and 9. What is the difference?", "Second input 9.", "2.", "2"),
    calculation("Can you skip the Logical Connectives restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  589: [
    calculation("In Quantifiers, evaluate the labelled model at input 8.", "Substitute 8 into the Quantifiers rule.", "24.", "24"),
    calculation("Compare the Quantifiers outputs at 8 and 11. What is the difference?", "Second input 11.", "3.", "3"),
    calculation("Can you skip the Quantifiers restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  590: [
    calculation("If slopes AB and BC both equal 4, are A, B, C collinear?", "Equal consecutive slopes.", "yes.", "yes"),
    calculation("Does one measured diagram prove a theorem for all cases?", "Measurement is one example.", "no.", "no"),
    calculation("Triangle area 0 for points with x=9,10,11 on y=4. Collinear?", "Zero area means one line.", "yes.", "yes"),
  ],
  591: [
    calculation("Simple interest on 1000 at 5% for 2 years?", "I=PRT/100.", "100.", "100"),
    calculation("Amount after 1 year compound on 1000 at 5%?", "A=P(1+r).", "1050.", "1050"),
    calculation("Is simple interest the same as compound interest after 2 years?", "Compound adds interest on interest.", "no.", "no"),
  ],
  592: [
    calculation("Simple interest on 300 at 6% for 2 years?", "I=PRT/100.", "36.", "36"),
    calculation("Amount after 1 year compound on 300 at 6%?", "A=P(1+r).", "318.", "318"),
    calculation("Is simple interest the same as compound interest after 2 years?", "Compound adds interest on interest.", "no.", "no"),
  ],
  593: [
    calculation("Simple interest on 400 at 7% for 2 years?", "I=PRT/100.", "56.", "56"),
    calculation("Amount after 1 year compound on 400 at 7%?", "A=P(1+r).", "428.", "428"),
    calculation("Is simple interest the same as compound interest after 2 years?", "Compound adds interest on interest.", "no.", "no"),
  ],
  594: [
    calculation("Simple interest on 500 at 2% for 2 years?", "I=PRT/100.", "20.", "20"),
    calculation("Amount after 1 year compound on 500 at 2%?", "A=P(1+r).", "510.", "510"),
    calculation("Is simple interest the same as compound interest after 2 years?", "Compound adds interest on interest.", "no.", "no"),
  ],
  595: [
    calculation("Simple interest on 600 at 3% for 2 years?", "I=PRT/100.", "36.", "36"),
    calculation("Amount after 1 year compound on 600 at 3%?", "A=P(1+r).", "618.", "618"),
    calculation("Is simple interest the same as compound interest after 2 years?", "Compound adds interest on interest.", "no.", "no"),
  ],
  596: [
    calculation("Simple interest on 700 at 4% for 2 years?", "I=PRT/100.", "56.", "56"),
    calculation("Amount after 1 year compound on 700 at 4%?", "A=P(1+r).", "728.", "728"),
    calculation("Is simple interest the same as compound interest after 2 years?", "Compound adds interest on interest.", "no.", "no"),
  ],
  597: [
    calculation("Simple interest on 800 at 5% for 2 years?", "I=PRT/100.", "80.", "80"),
    calculation("Amount after 1 year compound on 800 at 5%?", "A=P(1+r).", "840.", "840"),
    calculation("Is simple interest the same as compound interest after 2 years?", "Compound adds interest on interest.", "no.", "no"),
  ],
  598: [
    calculation("Simple interest on 900 at 6% for 2 years?", "I=PRT/100.", "108.", "108"),
    calculation("Amount after 1 year compound on 900 at 6%?", "A=P(1+r).", "954.", "954"),
    calculation("Is simple interest the same as compound interest after 2 years?", "Compound adds interest on interest.", "no.", "no"),
  ],
  599: [
    calculation("In Depreciation, evaluate the labelled model at input 10.", "Substitute 10 into the Depreciation rule.", "70.", "70"),
    calculation("Compare the Depreciation outputs at 10 and 17. What is the difference?", "Second input 17.", "7.", "7"),
    calculation("Can you skip the Depreciation restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  600: [
    calculation("In Inflation, evaluate the labelled model at input 3.", "Substitute 3 into the Inflation rule.", "6.", "6"),
    calculation("Compare the Inflation outputs at 3 and 5. What is the difference?", "Second input 5.", "2.", "2"),
    calculation("Can you skip the Inflation restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  601: [
    calculation("In Currency Conversion, evaluate the labelled model at input 4.", "Substitute 4 into the Currency Conversion rule.", "12.", "12"),
    calculation("Compare the Currency Conversion outputs at 4 and 7. What is the difference?", "Second input 7.", "3.", "3"),
    calculation("Can you skip the Currency Conversion restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  602: [
    calculation("SP=100, CP=80. Find the profit.", "Profit=SP-CP.", "20.", "20"),
    calculation("A 4% tax on 500?", "Tax=rate×amount.", "20.", "20"),
    calculation("Is selling price always greater than cost price?", "A loss has SP < CP.", "no.", "no"),
  ],
  603: [
    calculation("In Break-Even Analysis, evaluate the labelled model at input 6.", "Substitute 6 into the Break-Even Analysis rule.", "30.", "30"),
    calculation("Compare the Break-Even Analysis outputs at 6 and 11. What is the difference?", "Second input 11.", "5.", "5"),
    calculation("Can you skip the Break-Even Analysis restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  604: [
    calculation("SP=140, CP=112. Find the profit.", "Profit=SP-CP.", "28.", "28"),
    calculation("A 6% tax on 700?", "Tax=rate×amount.", "42.", "42"),
    calculation("Is selling price always greater than cost price?", "A loss has SP < CP.", "no.", "no"),
  ],
  605: [
    calculation("In Investment Comparison, evaluate the labelled model at input 8.", "Substitute 8 into the Investment Comparison rule.", "56.", "56"),
    calculation("Compare the Investment Comparison outputs at 8 and 15. What is the difference?", "Second input 15.", "7.", "7"),
    calculation("Can you skip the Investment Comparison restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  606: [
    calculation("In Model Builder, evaluate the labelled model at input 9.", "Substitute 9 into the Model Builder rule.", "18.", "18"),
    calculation("Compare the Model Builder outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
    calculation("Can you skip the Model Builder restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  607: [
    calculation("In Linear Models, evaluate the labelled model at input 10.", "Substitute 10 into the Linear Models rule.", "30.", "30"),
    calculation("Compare the Linear Models outputs at 10 and 13. What is the difference?", "Second input 13.", "3.", "3"),
    calculation("Can you skip the Linear Models restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  608: [
    calculation("In Quadratic Models, evaluate the labelled model at input 3.", "Substitute 3 into the Quadratic Models rule.", "12.", "12"),
    calculation("Compare the Quadratic Models outputs at 3 and 7. What is the difference?", "Second input 7.", "4.", "4"),
    calculation("Can you skip the Quadratic Models restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  609: [
    calculation("In Exponential and Logistic Models, evaluate the labelled model at input 4.", "Substitute 4 into the Exponential and Logistic Models rule.", "20.", "20"),
    calculation("Compare the Exponential and Logistic Models outputs at 4 and 9. What is the difference?", "Second input 9.", "5.", "5"),
    calculation("Can you skip the Exponential and Logistic Models restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  610: [
    calculation("In Periodic Models, evaluate the labelled model at input 5.", "Substitute 5 into the Periodic Models rule.", "30.", "30"),
    calculation("Compare the Periodic Models outputs at 5 and 11. What is the difference?", "Second input 11.", "6.", "6"),
    calculation("Can you skip the Periodic Models restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  611: [
    calculation("In Piecewise Models, evaluate the labelled model at input 6.", "Substitute 6 into the Piecewise Models rule.", "42.", "42"),
    calculation("Compare the Piecewise Models outputs at 6 and 13. What is the difference?", "Second input 13.", "7.", "7"),
    calculation("Can you skip the Piecewise Models restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  612: [
    calculation("Round 7080 to the nearest hundred.", "Look at the tens digit 8.", "7100.", "7100"),
    calculation("Estimate 133 by rounding 19 to 20.", "7*20=140.", "140.", "140"),
    calculation("Do you inspect every digit before choosing the rounding place?", "Choose the place first.", "no.", "no"),
  ],
  613: [
    calculation("In Dimensional Analysis, evaluate the labelled model at input 8.", "Substitute 8 into the Dimensional Analysis rule.", "24.", "24"),
    calculation("Compare the Dimensional Analysis outputs at 8 and 11. What is the difference?", "Second input 11.", "3.", "3"),
    calculation("Can you skip the Dimensional Analysis restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  614: [
    calculation("In Sensitivity Analysis, evaluate the labelled model at input 9.", "Substitute 9 into the Sensitivity Analysis rule.", "36.", "36"),
    calculation("Compare the Sensitivity Analysis outputs at 9 and 13. What is the difference?", "Second input 13.", "4.", "4"),
    calculation("Can you skip the Sensitivity Analysis restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  615: [
    calculation("Residual at x=10 if y=10 and ŷ=5.", "residual=y-ŷ.", "5.", "5"),
    calculation("If slope=5 and intercept=10, find ŷ(10).", "ŷ=5x+10.", "60.", "60"),
    calculation("Does a residual of 0 at one point prove the line fits every point?", "One zero residual is one hit.", "no.", "no"),
  ],
  616: [
    calculation("In Scenario Comparison, evaluate the labelled model at input 3.", "Substitute 3 into the Scenario Comparison rule.", "18.", "18"),
    calculation("Compare the Scenario Comparison outputs at 3 and 9. What is the difference?", "Second input 9.", "6.", "6"),
    calculation("Can you skip the Scenario Comparison restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  617: [
    calculation("In Linear Programming, evaluate the labelled model at input 4.", "Substitute 4 into the Linear Programming rule.", "28.", "28"),
    calculation("Compare the Linear Programming outputs at 4 and 11. What is the difference?", "Second input 11.", "7.", "7"),
    calculation("Can you skip the Linear Programming restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  618: [
    calculation("A slider from 0 to 50 with step 2: how many steps from 0 to max?", "50/2.", "25.", "25"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  619: [
    calculation("A slider from 0 to 60 with step 3: how many steps from 0 to max?", "60/3.", "20.", "20"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  620: [
    calculation("A slider from 0 to 70 with step 4: how many steps from 0 to max?", "70/4.", "17.", "17"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  621: [
    calculation("A slider from 0 to 80 with step 5: how many steps from 0 to max?", "80/5.", "16.", "16"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  622: [
    calculation("A slider from 0 to 90 with step 6: how many steps from 0 to max?", "90/6.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  623: [
    calculation("A slider from 0 to 100 with step 7: how many steps from 0 to max?", "100/7.", "14.", "14"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  624: [
    calculation("A slider from 0 to 30 with step 2: how many steps from 0 to max?", "30/2.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  625: [
    calculation("A slider from 0 to 40 with step 3: how many steps from 0 to max?", "40/3.", "13.", "13"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  626: [
    calculation("A slider from 0 to 50 with step 4: how many steps from 0 to max?", "50/4.", "12.", "12"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  627: [
    calculation("A slider from 0 to 60 with step 5: how many steps from 0 to max?", "60/5.", "12.", "12"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  628: [
    calculation("A slider from 0 to 70 with step 6: how many steps from 0 to max?", "70/6.", "11.", "11"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  629: [
    calculation("A slider from 0 to 80 with step 7: how many steps from 0 to max?", "80/7.", "11.", "11"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  630: [
    calculation("A slider from 0 to 90 with step 2: how many steps from 0 to max?", "90/2.", "45.", "45"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  631: [
    calculation("A slider from 0 to 100 with step 3: how many steps from 0 to max?", "100/3.", "33.", "33"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  632: [
    calculation("A slider from 0 to 30 with step 4: how many steps from 0 to max?", "30/4.", "7.", "7"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  633: [
    calculation("A slider from 0 to 40 with step 5: how many steps from 0 to max?", "40/5.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  634: [
    calculation("A slider from 0 to 50 with step 6: how many steps from 0 to max?", "50/6.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  635: [
    calculation("A slider from 0 to 60 with step 7: how many steps from 0 to max?", "60/7.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  636: [
    calculation("A slider from 0 to 70 with step 2: how many steps from 0 to max?", "70/2.", "35.", "35"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  637: [
    calculation("A slider from 0 to 80 with step 3: how many steps from 0 to max?", "80/3.", "26.", "26"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  638: [
    calculation("A slider from 0 to 90 with step 4: how many steps from 0 to max?", "90/4.", "22.", "22"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  639: [
    calculation("A slider from 0 to 100 with step 5: how many steps from 0 to max?", "100/5.", "20.", "20"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  640: [
    calculation("A slider from 0 to 30 with step 6: how many steps from 0 to max?", "30/6.", "5.", "5"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  641: [
    calculation("A slider from 0 to 40 with step 7: how many steps from 0 to max?", "40/7.", "5.", "5"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  642: [
    calculation("A slider from 0 to 50 with step 2: how many steps from 0 to max?", "50/2.", "25.", "25"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  643: [
    calculation("A slider from 0 to 60 with step 3: how many steps from 0 to max?", "60/3.", "20.", "20"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  644: [
    calculation("A slider from 0 to 70 with step 4: how many steps from 0 to max?", "70/4.", "17.", "17"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  645: [
    calculation("A slider from 0 to 80 with step 5: how many steps from 0 to max?", "80/5.", "16.", "16"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  646: [
    calculation("A slider from 0 to 90 with step 6: how many steps from 0 to max?", "90/6.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  647: [
    calculation("A slider from 0 to 100 with step 7: how many steps from 0 to max?", "100/7.", "14.", "14"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  648: [
    calculation("A slider from 0 to 30 with step 2: how many steps from 0 to max?", "30/2.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  649: [
    calculation("A slider from 0 to 40 with step 3: how many steps from 0 to max?", "40/3.", "13.", "13"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  650: [
    calculation("A slider from 0 to 50 with step 4: how many steps from 0 to max?", "50/4.", "12.", "12"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  651: [
    calculation("A slider from 0 to 60 with step 5: how many steps from 0 to max?", "60/5.", "12.", "12"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  652: [
    calculation("A slider from 0 to 70 with step 6: how many steps from 0 to max?", "70/6.", "11.", "11"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  653: [
    calculation("A slider from 0 to 80 with step 7: how many steps from 0 to max?", "80/7.", "11.", "11"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  654: [
    calculation("A slider from 0 to 90 with step 2: how many steps from 0 to max?", "90/2.", "45.", "45"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  655: [
    calculation("A slider from 0 to 100 with step 3: how many steps from 0 to max?", "100/3.", "33.", "33"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  656: [
    calculation("A slider from 0 to 30 with step 4: how many steps from 0 to max?", "30/4.", "7.", "7"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  657: [
    calculation("A slider from 0 to 40 with step 5: how many steps from 0 to max?", "40/5.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  658: [
    calculation("A slider from 0 to 50 with step 6: how many steps from 0 to max?", "50/6.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  659: [
    calculation("A slider from 0 to 60 with step 7: how many steps from 0 to max?", "60/7.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  660: [
    calculation("A slider from 0 to 70 with step 2: how many steps from 0 to max?", "70/2.", "35.", "35"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  661: [
    calculation("A slider from 0 to 80 with step 3: how many steps from 0 to max?", "80/3.", "26.", "26"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  662: [
    calculation("A slider from 0 to 90 with step 4: how many steps from 0 to max?", "90/4.", "22.", "22"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  663: [
    calculation("A slider from 0 to 100 with step 5: how many steps from 0 to max?", "100/5.", "20.", "20"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  664: [
    calculation("A slider from 0 to 30 with step 6: how many steps from 0 to max?", "30/6.", "5.", "5"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  665: [
    calculation("A slider from 0 to 40 with step 7: how many steps from 0 to max?", "40/7.", "5.", "5"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  666: [
    calculation("A slider from 0 to 50 with step 2: how many steps from 0 to max?", "50/2.", "25.", "25"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  667: [
    calculation("A slider from 0 to 60 with step 3: how many steps from 0 to max?", "60/3.", "20.", "20"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  668: [
    calculation("A slider from 0 to 70 with step 4: how many steps from 0 to max?", "70/4.", "17.", "17"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  669: [
    calculation("A slider from 0 to 80 with step 5: how many steps from 0 to max?", "80/5.", "16.", "16"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  670: [
    calculation("A slider from 0 to 90 with step 6: how many steps from 0 to max?", "90/6.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  671: [
    calculation("A slider from 0 to 100 with step 7: how many steps from 0 to max?", "100/7.", "14.", "14"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  672: [
    calculation("A slider from 0 to 30 with step 2: how many steps from 0 to max?", "30/2.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  673: [
    calculation("A slider from 0 to 40 with step 3: how many steps from 0 to max?", "40/3.", "13.", "13"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  674: [
    calculation("A slider from 0 to 50 with step 4: how many steps from 0 to max?", "50/4.", "12.", "12"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
    calculation("Is a picture export the same as saving the mathematical objects?", "An image can drop exact data.", "no.", "no"),
  ],
  10001: [
    calculation("What is the value of the hundreds digit in 4791?", "The hundreds digit is 7.", "700.", "700"),
    calculation("Write 4 thousands + 7 hundreds + 9 tens + 1 one as a number.", "4*1000 + 7*100 + 9*10 + 1.", "4791.", "4791"),
    calculation("Does the digit 4 always mean four ones?", "Place decides value.", "no.", "no"),
  ],
  10002: [
    calculation("In the Indian system, how many zeros in 1 lakh?", "1 lakh = 100000.", "5.", "5"),
    calculation("Write one million with international commas.", "Groups of 3.", "1,000,000.", "1,000,000"),
    calculation("Is 1,00,000 the international grouping for one lakh?", "International grouping writes 100,000.", "no.", "no"),
  ],
  10003: [
    calculation("Round 6080 to the nearest hundred.", "Look at the tens digit 8.", "6100.", "6100"),
    calculation("Estimate 114 by rounding 19 to 20.", "6*20=120.", "120.", "120"),
    calculation("Do you inspect every digit before choosing the rounding place?", "Choose the place first.", "no.", "no"),
  ],
  10004: [
    calculation("If a measurement is 7.0 ± 0.4, what is the upper bound?", "Upper = value + error.", "7.4.", "7.4"),
    calculation("Absolute error from 7 reported as 8?", "|reported-true|.", "1.", "1"),
    calculation("Is a smaller absolute error always a smaller percent error?", "Percent error divides by the true size.", "no.", "no"),
  ],
  10005: [
    calculation("In Mixed Units and Unit Conversion, evaluate the labelled model at input 8.", "Substitute 8 into the Mixed Units and Unit Conversion rule.", "40.", "40"),
    calculation("Compare the Mixed Units and Unit Conversion outputs at 8 and 13. What is the difference?", "Second input 13.", "5.", "5"),
    calculation("Can you skip the Mixed Units and Unit Conversion restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10006: [
    calculation("If one icon = 6 students and 4 icons are shown, how many students?", "4*6.", "24.", "24"),
    calculation("A bar of height 90 vs 60: what is the difference?", "90-60.", "30.", "30"),
    calculation("Can a pictograph hide the scale and still be read exactly?", "The key tells the value of one icon.", "no.", "no"),
  ],
  10007: [
    calculation("If one icon = 7 students and 4 icons are shown, how many students?", "4*7.", "28.", "28"),
    calculation("A bar of height 100 vs 70: what is the difference?", "100-70.", "30.", "30"),
    calculation("Can a pictograph hide the scale and still be read exactly?", "The key tells the value of one icon.", "no.", "no"),
  ],
  10008: [
    calculation("In Survey to Frequency Table, evaluate the labelled model at input 3.", "Substitute 3 into the Survey to Frequency Table rule.", "6.", "6"),
    calculation("Compare the Survey to Frequency Table outputs at 3 and 5. What is the difference?", "Second input 5.", "2.", "2"),
    calculation("Can you skip the Survey to Frequency Table restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10009: [
    calculation("In Misleading Graph Detection, evaluate the labelled model at input 4.", "Substitute 4 into the Misleading Graph Detection rule.", "12.", "12"),
    calculation("Compare the Misleading Graph Detection outputs at 4 and 7. What is the difference?", "Second input 7.", "3.", "3"),
    calculation("Can you skip the Misleading Graph Detection restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10010: [
    calculation("In Number Pattern Completion, evaluate the labelled model at input 5.", "Substitute 5 into the Number Pattern Completion rule.", "20.", "20"),
    calculation("Compare the Number Pattern Completion outputs at 5 and 9. What is the difference?", "Second input 9.", "4.", "4"),
    calculation("Can you skip the Number Pattern Completion restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10011: [
    calculation("In Shape Pattern Completion, evaluate the labelled model at input 6.", "Substitute 6 into the Shape Pattern Completion rule.", "30.", "30"),
    calculation("Compare the Shape Pattern Completion outputs at 6 and 11. What is the difference?", "Second input 11.", "5.", "5"),
    calculation("Can you skip the Shape Pattern Completion restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10012: [
    calculation("In Input-Output Rule Machines, evaluate the labelled model at input 7.", "Substitute 7 into the Input-Output Rule Machines rule.", "42.", "42"),
    calculation("Compare the Input-Output Rule Machines outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
    calculation("Can you skip the Input-Output Rule Machines restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10013: [
    calculation("Is 82 divisible by 2?", "A number is divisible by 2 if it is even.", "yes.", "yes"),
    calculation("Digit sum of 877: is it a multiple of 3 if the number is?", "A number is divisible by 3 iff digit sum is.", "22.", "22"),
    calculation("Does divisibility by 2 require checking every digit?", "Only the ones digit matters for 2.", "no.", "no"),
  ],
  10014: [
    calculation("Is 92 divisible by 2?", "A number is divisible by 2 if it is even.", "yes.", "yes"),
    calculation("Digit sum of 928: is it a multiple of 3 if the number is?", "A number is divisible by 3 iff digit sum is.", "19.", "19"),
    calculation("Does divisibility by 2 require checking every digit?", "Only the ones digit matters for 2.", "no.", "no"),
  ],
  10015: [
    calculation("In Remainder Reasoning, evaluate the labelled model at input 10.", "Substitute 10 into the Remainder Reasoning rule.", "30.", "30"),
    calculation("Compare the Remainder Reasoning outputs at 10 and 13. What is the difference?", "Second input 13.", "3.", "3"),
    calculation("Can you skip the Remainder Reasoning restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10016: [
    calculation("12 km in 3 hours. What is the unit rate?", "Divide by 3.", "4.", "4"),
    calculation("Scale the ratio 3:4 by 3.", "9:12.", "9:12.", "9:12"),
    calculation("Can you add the two ratio parts to get a unit rate?", "A unit rate divides a quantity by 1 unit.", "no.", "no"),
  ],
  10017: [
    calculation("20 km in 4 hours. What is the unit rate?", "Divide by 4.", "5.", "5"),
    calculation("Scale the ratio 4:5 by 3.", "12:15.", "12:15.", "12:15"),
    calculation("Can you add the two ratio parts to get a unit rate?", "A unit rate divides a quantity by 1 unit.", "no.", "no"),
  ],
  10018: [
    calculation("SP=100, CP=80. Find the profit.", "Profit=SP-CP.", "20.", "20"),
    calculation("A 6% tax on 500?", "Tax=rate×amount.", "30.", "30"),
    calculation("Is selling price always greater than cost price?", "A loss has SP < CP.", "no.", "no"),
  ],
  10019: [
    calculation("SP=120, CP=96. Find the profit.", "Profit=SP-CP.", "24.", "24"),
    calculation("A 7% tax on 600?", "Tax=rate×amount.", "42.", "42"),
    calculation("Is selling price always greater than cost price?", "A loss has SP < CP.", "no.", "no"),
  ],
  10020: [
    calculation("SP=140, CP=112. Find the profit.", "Profit=SP-CP.", "28.", "28"),
    calculation("A 2% tax on 700?", "Tax=rate×amount.", "14.", "14"),
    calculation("Is selling price always greater than cost price?", "A loss has SP < CP.", "no.", "no"),
  ],
  10021: [
    calculation("Solve 3x = 24.", "Divide by 3.", "8.", "8"),
    calculation("Expand 3(x+8).", "3x+24.", "3x+24.", "3x+24"),
    calculation("Is x=8 a root of (x-8)(x-8)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10022: [
    calculation("In Copying a Line Segment, evaluate the labelled model at input 9.", "Substitute 9 into the Copying a Line Segment rule.", "36.", "36"),
    calculation("Compare the Copying a Line Segment outputs at 9 and 13. What is the difference?", "Second input 13.", "4.", "4"),
    calculation("Can you skip the Copying a Line Segment restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10023: [
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 100° and 50°. What is the sum?", "100+50.", "150.", "150"),
    calculation("Do longer rays make a larger angle?", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10024: [
    calculation("In Perpendicular Bisector Construction, evaluate the labelled model at input 3.", "Substitute 3 into the Perpendicular Bisector Construction rule.", "18.", "18"),
    calculation("Compare the Perpendicular Bisector Construction outputs at 3 and 9. What is the difference?", "Second input 9.", "6.", "6"),
    calculation("Can you skip the Perpendicular Bisector Construction restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10025: [
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 40° and 70°. What is the sum?", "40+70.", "110.", "110"),
    calculation("Do longer rays make a larger angle?", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10026: [
    calculation("In Perpendicular Through a Point, evaluate the labelled model at input 5.", "Substitute 5 into the Perpendicular Through a Point rule.", "10.", "10"),
    calculation("Compare the Perpendicular Through a Point outputs at 5 and 7. What is the difference?", "Second input 7.", "2.", "2"),
    calculation("Can you skip the Perpendicular Through a Point restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10027: [
    calculation("In Parallel Line Construction, evaluate the labelled model at input 6.", "Substitute 6 into the Parallel Line Construction rule.", "18.", "18"),
    calculation("Compare the Parallel Line Construction outputs at 6 and 9. What is the difference?", "Second input 9.", "3.", "3"),
    calculation("Can you skip the Parallel Line Construction restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10028: [
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 70° and 40°. What is the sum?", "70+40.", "110.", "110"),
    calculation("Do longer rays make a larger angle?", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10029: [
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 80° and 50°. What is the sum?", "80+50.", "130.", "130"),
    calculation("Do longer rays make a larger angle?", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10030: [
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 90° and 60°. What is the sum?", "90+60.", "150.", "150"),
    calculation("Do longer rays make a larger angle?", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10031: [
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 100° and 70°. What is the sum?", "100+70.", "170.", "170"),
    calculation("Do longer rays make a larger angle?", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10032: [
    calculation("If one icon = 2 students and 4 icons are shown, how many students?", "4*2.", "8.", "8"),
    calculation("A bar of height 30 vs 20: what is the difference?", "30-20.", "10.", "10"),
    calculation("Can a pictograph hide the scale and still be read exactly?", "The key tells the value of one icon.", "no.", "no"),
  ],
  10033: [
    calculation("Find the mean of 4, 3, 6, 5.", "Sum=18.", "4.5.", "4.5"),
    calculation("If one value increases by 3, how does the mean change?", "The total rises by 3.", "0.75.", "0.75"),
    calculation("Must the mean be one of the data values?", "The mean is a balance point.", "no.", "no"),
  ],
  10034: [
    calculation("In Range and Spread Explorer, evaluate the labelled model at input 5.", "Substitute 5 into the Range and Spread Explorer rule.", "20.", "20"),
    calculation("Compare the Range and Spread Explorer outputs at 5 and 9. What is the difference?", "Second input 9.", "4.", "4"),
    calculation("Can you skip the Range and Spread Explorer restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10035: [
    calculation("In Flowchart Logic, evaluate the labelled model at input 6.", "Substitute 6 into the Flowchart Logic rule.", "30.", "30"),
    calculation("Compare the Flowchart Logic outputs at 6 and 11. What is the difference?", "Second input 11.", "5.", "5"),
    calculation("Can you skip the Flowchart Logic restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10036: [
    calculation("In Pattern Encoding, evaluate the labelled model at input 7.", "Substitute 7 into the Pattern Encoding rule.", "42.", "42"),
    calculation("Compare the Pattern Encoding outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
    calculation("Can you skip the Pattern Encoding restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10037: [
    calculation("In Magic Squares, evaluate the labelled model at input 8.", "Substitute 8 into the Magic Squares rule.", "56.", "56"),
    calculation("Compare the Magic Squares outputs at 8 and 15. What is the difference?", "Second input 15.", "7.", "7"),
    calculation("Can you skip the Magic Squares restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10038: [
    calculation("In Route Map Reasoning, evaluate the labelled model at input 9.", "Substitute 9 into the Route Map Reasoning rule.", "18.", "18"),
    calculation("Compare the Route Map Reasoning outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
    calculation("Can you skip the Route Map Reasoning restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10039: [
    calculation("In Tabular Pattern Completion, evaluate the labelled model at input 10.", "Substitute 10 into the Tabular Pattern Completion rule.", "30.", "30"),
    calculation("Compare the Tabular Pattern Completion outputs at 10 and 13. What is the difference?", "Second input 13.", "3.", "3"),
    calculation("Can you skip the Tabular Pattern Completion restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10040: [
    calculation("Find √9.", "Square root of a square.", "3.", "3"),
    calculation("Is 1/16 a terminating decimal in base 10?", "Denomination after cancelling 2s and 5s.", "yes.", "yes"),
    calculation("Is 1/3 a terminating decimal?", "1/3=0.333...", "no.", "no"),
  ],
  10041: [
    calculation("Find √16.", "Square root of a square.", "4.", "4"),
    calculation("Is 1/32 a terminating decimal in base 10?", "Denomination after cancelling 2s and 5s.", "yes.", "yes"),
    calculation("Is 1/3 a terminating decimal?", "1/3=0.333...", "no.", "no"),
  ],
  10042: [
    calculation("In Rational and Irrational Classification, evaluate the labelled model at input 5.", "Substitute 5 into the Rational and Irrational Classification rule.", "30.", "30"),
    calculation("Compare the Rational and Irrational Classification outputs at 5 and 11. What is the difference?", "Second input 11.", "6.", "6"),
    calculation("Can you skip the Rational and Irrational Classification restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10043: [
    calculation("In Successive Magnification on the Number Line, evaluate the labelled model at input 6.", "Substitute 6 into the Successive Magnification on the Number Line rule.", "42.", "42"),
    calculation("Compare the Successive Magnification on the Number Line outputs at 6 and 13. What is the difference?", "Second input 13.", "7.", "7"),
    calculation("Can you skip the Successive Magnification on the Number Line restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10044: [
    calculation("Find √49.", "Square root of a square.", "7.", "7"),
    calculation("Is 1/4 a terminating decimal in base 10?", "Denomination after cancelling 2s and 5s.", "yes.", "yes"),
    calculation("Is 1/3 a terminating decimal?", "1/3=0.333...", "no.", "no"),
  ],
  10045: [
    calculation("Find √64.", "Square root of a square.", "8.", "8"),
    calculation("Is 1/8 a terminating decimal in base 10?", "Denomination after cancelling 2s and 5s.", "yes.", "yes"),
    calculation("Is 1/3 a terminating decimal?", "1/3=0.333...", "no.", "no"),
  ],
  10046: [
    calculation("A cubic can have at most how many real zeros?", "Degree 3.", "3.", "3"),
    calculation("Divide 2x^2+9x by x. What is the quotient?", "2x+9.", "2x+9.", "2x+9"),
    calculation("Does every cubic have 3 real zeros?", "Some zeros can be complex.", "no.", "no"),
  ],
  10047: [
    calculation("A cubic can have at most how many real zeros?", "Degree 3.", "3.", "3"),
    calculation("Divide 2x^2+10x by x. What is the quotient?", "2x+10.", "2x+10.", "2x+10"),
    calculation("Does every cubic have 3 real zeros?", "Some zeros can be complex.", "no.", "no"),
  ],
  10048: [
    calculation("Remainder when P(x)=x^2+6 is divided by x-3?", "Remainder=P(3).", "15.", "15"),
    calculation("If P(3)=0, what is the remainder on division by x-3?", "Remainder theorem: remainder is P(a).", "0.", "0"),
    calculation("Is the remainder the same as the quotient?", "Remainder is P(a); quotient is the other factor.", "no.", "no"),
  ],
  10049: [
    calculation("If P(4)=0, is x-4 a factor?", "Factor theorem: P(a)=0 iff x-a is a factor.", "yes.", "yes"),
    calculation("P(x)=x^2-16. Is x-4 a factor?", "P(4)=16-16=0.", "yes.", "yes"),
    calculation("Does P(a)=a prove x-a is a factor?", "The value must be 0.", "no.", "no"),
  ],
  10050: [
    calculation("A cubic can have at most how many real zeros?", "Degree 3.", "3.", "3"),
    calculation("Divide 2x^2+5x by x. What is the quotient?", "2x+5.", "2x+5.", "2x+5"),
    calculation("Does every cubic have 3 real zeros?", "Some zeros can be complex.", "no.", "no"),
  ],
  10051: [
    calculation("A cubic can have at most how many real zeros?", "Degree 3.", "3.", "3"),
    calculation("Divide 2x^2+6x by x. What is the quotient?", "2x+6.", "2x+6.", "2x+6"),
    calculation("Does every cubic have 3 real zeros?", "Some zeros can be complex.", "no.", "no"),
  ],
  10052: [
    calculation("A cubic can have at most how many real zeros?", "Degree 3.", "3.", "3"),
    calculation("Divide 2x^2+7x by x. What is the quotient?", "2x+7.", "2x+7.", "2x+7"),
    calculation("Does every cubic have 3 real zeros?", "Some zeros can be complex.", "no.", "no"),
  ],
  10053: [
    calculation("A triangle has angles 50° and 80°. Find the third angle.", "Angles sum to 180°.", "50.", "50"),
    calculation("Does a theorem need proof?", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Is an axiom proved inside the same system?", "An axiom is an accepted start.", "no.", "no"),
  ],
  10054: [
    calculation("A triangle has angles 50° and 90°. Find the third angle.", "Angles sum to 180°.", "40.", "40"),
    calculation("Does a theorem need proof?", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Is an axiom proved inside the same system?", "An axiom is an accepted start.", "no.", "no"),
  ],
  10055: [
    calculation("A triangle has angles 50° and 100°. Find the third angle.", "Angles sum to 180°.", "30.", "30"),
    calculation("Does a theorem need proof?", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Is an axiom proved inside the same system?", "An axiom is an accepted start.", "no.", "no"),
  ],
  10056: [
    calculation("A triangle has angles 50° and 30°. Find the third angle.", "Angles sum to 180°.", "100.", "100"),
    calculation("Does a theorem need proof?", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Is an axiom proved inside the same system?", "An axiom is an accepted start.", "no.", "no"),
  ]
};

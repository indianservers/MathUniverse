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
    calculation("F distributions need how many degrees-of-freedom values?", "concept", "two.", "two"),
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
  ],
  532: [
    calculation("Exponential distribution models count or waiting time?", "concept", "waiting time.", "waiting time"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
  ],
  533: [
    calculation("Gamma generalises exponential to several what?", "concept", "events.", "events"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
  ],
  534: [
    calculation("Which parameter controls Weibull risk shape?", "concept", "shape.", "shape"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  535: [
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  536: [
    calculation("Is one simulation exactly the same as the theoretical model?", "tool", "no.", "no"),
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
  ],
  537: [
    calculation("Sampling distributions describe sample statistics or raw values?", "concept", "statistics.", "statistics"),
    calculation("Sample n=40. SE of the mean if σ=5 is σ/√n. Find SE.", "√n=√40.", "5/√40.", "5/√40"),
    calculation("Does the CLT say every sample is normal?", "It describes the sampling distribution of the mean.", "no.", "no"),
  ],
  538: [
    calculation("The central limit theorem is mainly about sample what?", "concept", "means.", "means"),
    calculation("Sample n=50. SE of the mean if σ=6 is σ/√n. Find SE.", "√n=√50.", "6/√50.", "6/√50"),
    calculation("Does the CLT say every sample is normal?", "It describes the sampling distribution of the mean.", "no.", "no"),
  ],
  539: [
    calculation("A confidence interval estimates a population what?", "procedure", "mean.", "mean"),
    calculation("A 95% CI is 6 ± 7. What is the upper bound?", "6+7.", "13.", "13"),
    calculation("If SE=7 and z*=2, what is the margin of error?", "ME=z*×SE.", "14.", "14"),
  ],
  540: [
    calculation("p-hat equals successes divided by what?", "procedure", "sample size.", "sample size"),
    calculation("A 95% CI is 7 ± 2. What is the upper bound?", "7+2.", "9.", "9"),
    calculation("If SE=2 and z*=2, what is the margin of error?", "ME=z*×SE.", "4.", "4"),
  ],
  541: [
    calculation("This interval estimates a difference between two population what?", "procedure", "means.", "means"),
    calculation("Find the mean of 8, 3, 6, 9.", "Sum=26.", "6.5.", "6.5"),
    calculation("If one value increases by 3, how does the mean change?", "The total rises by 3.", "0.75.", "0.75"),
  ],
  542: [
    calculation("This interval compares two population what?", "procedure", "proportions.", "proportions"),
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
  ],
  543: [
    calculation("A z-test compares the statistic with which standard distribution?", "procedure", "normal.", "normal"),
    calculation("If z=10 and the critical value is 5, is |z| past the cutoff?", "|10|=10.", "yes.", "yes"),
    calculation("df=8. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
  ],
  544: [
    calculation("A one-sample t-test uses sample standard what?", "procedure", "deviation.", "deviation"),
    calculation("If z=3 and the critical value is 6, is |z| past the cutoff?", "|3|=3.", "no.", "no"),
    calculation("df=9. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
  ],
  545: [
    calculation("Two-sample t-tests need independent samples or paired samples?", "procedure", "independent.", "independent"),
    calculation("If z=4 and the critical value is 7, is |z| past the cutoff?", "|4|=4.", "no.", "no"),
    calculation("df=10. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
  ],
  546: [
    calculation("A paired t-test first computes within-pair what?", "procedure", "differences.", "differences"),
    calculation("If z=5 and the critical value is 2, is |z| past the cutoff?", "|5|=5.", "yes.", "yes"),
    calculation("df=4. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
  ],
  547: [
    calculation("A one-proportion test checks one population what?", "procedure", "proportion.", "proportion"),
    calculation("If z=6 and the critical value is 3, is |z| past the cutoff?", "|6|=6.", "yes.", "yes"),
    calculation("df=5. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
  ],
  548: [
    calculation("For an equality test, two-proportion z-tests use a pooled what?", "procedure", "proportion.", "proportion"),
    calculation("If z=7 and the critical value is 4, is |z| past the cutoff?", "|7|=7.", "yes.", "yes"),
    calculation("df=6. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
  ],
  549: [
    calculation("Goodness-of-fit compares observed and expected what?", "procedure", "counts.", "counts"),
    calculation("If z=8 and the critical value is 5, is |z| past the cutoff?", "|8|=8.", "yes.", "yes"),
    calculation("df=7. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
  ],
  550: [
    calculation("Chi-square independence uses a two-way what?", "procedure", "table.", "table"),
    calculation("If z=9 and the critical value is 6, is |z| past the cutoff?", "|9|=9.", "yes.", "yes"),
    calculation("df=8. For a two-sided t-test, how many tails?", "Two-sided uses both tails.", "2.", "2"),
  ],
  551: [
    calculation("Variance tests are sensitive to spread and what?", "procedure", "outliers.", "outliers"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
  ],
  552: [
    calculation("ANOVA compares several population what?", "procedure", "means.", "means"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  553: [
    calculation("Does a p-value give the probability the null is true?", "Inferential Statistics", "no.", "no"),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  554: [
    calculation("Which error is a false alarm: Type I or Type II?", "Inferential Statistics", "Type I.", "Type I"),
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
  ],
  555: [
    calculation("Power equals 1 minus which error probability?", "Inferential Statistics", "Type II.", "Type II"),
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
  ],
  556: [
    calculation("In Fundamental Counting Principle, evaluate the labelled model at input 7.", "Substitute 7 into the Fundamental Counting Principle rule.", "42.", "42"),
    calculation("Compare the Fundamental Counting Principle outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
    calculation("Can you skip the Fundamental Counting Principle restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  557: [
    calculation("Solve 7x = 56.", "Divide by 7.", "8.", "8"),
    calculation("Expand 7(x+8).", "7x+56.", "7x+56.", "7x+56"),
    calculation("Is x=8 a root of (x-8)(x-8)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  558: [
    calculation("In Permutations, evaluate the labelled model at input 9.", "Substitute 9 into the Permutations rule.", "18.", "18"),
    calculation("Compare the Permutations outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
    calculation("Can you skip the Permutations restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  559: [
    calculation("In Permutations with Repetition, evaluate the labelled model at input 10.", "Substitute 10 into the Permutations with Repetition rule.", "30.", "30"),
    calculation("Compare the Permutations with Repetition outputs at 10 and 13. What is the difference?", "Second input 13.", "3.", "3"),
    calculation("Can you skip the Permutations with Repetition restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  560: [
    calculation("In Circular Permutations, evaluate the labelled model at input 3.", "Substitute 3 into the Circular Permutations rule.", "12.", "12"),
    calculation("Compare the Circular Permutations outputs at 3 and 7. What is the difference?", "Second input 7.", "4.", "4"),
    calculation("Can you skip the Circular Permutations restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  561: [
    calculation("In Combinations, evaluate the labelled model at input 4.", "Substitute 4 into the Combinations rule.", "20.", "20"),
    calculation("Compare the Combinations outputs at 4 and 9. What is the difference?", "Second input 9.", "5.", "5"),
    calculation("Can you skip the Combinations restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  562: [
    calculation("What is the middle row of 1, 3, 3, 1 made by adding?", "Combinatorics, Graph Theory and Logic", "two above.", "two above"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 50° and 60°. What is the sum?", "50+60.", "110.", "110"),
  ],
  563: [
    calculation("In Inclusion–Exclusion, evaluate the labelled model at input 6.", "Substitute 6 into the Inclusion–Exclusion rule.", "42.", "42"),
    calculation("Compare the Inclusion–Exclusion outputs at 6 and 13. What is the difference?", "Second input 13.", "7.", "7"),
    calculation("Can you skip the Inclusion–Exclusion restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  564: [
    calculation("13 people guarantee two share a birth what?", "Combinatorics, Graph Theory and Logic", "month.", "month"),
    calculation("In Pigeonhole Principle, evaluate the labelled model at input 7.", "Substitute 7 into the Pigeonhole Principle rule.", "14.", "14"),
    calculation("Compare the Pigeonhole Principle outputs at 7 and 9. What is the difference?", "Second input 9.", "2.", "2"),
  ],
  565: [
    calculation("In a graph, what connects two vertices?", "Combinatorics, Graph Theory and Logic", "edge.", "edge"),
    calculation("In Vertex and Edge Builder, evaluate the labelled model at input 8.", "Substitute 8 into the Vertex and Edge Builder rule.", "24.", "24"),
    calculation("Compare the Vertex and Edge Builder outputs at 8 and 11. What is the difference?", "Second input 11.", "3.", "3"),
  ],
  566: [
    calculation("What shows direction in a directed graph?", "Combinatorics, Graph Theory and Logic", "arrow.", "arrow"),
    calculation("In Directed Graphs, evaluate the labelled model at input 9.", "Substitute 9 into the Directed Graphs rule.", "36.", "36"),
    calculation("Compare the Directed Graphs outputs at 9 and 13. What is the difference?", "Second input 13.", "4.", "4"),
  ],
  567: [
    calculation("In a weighted graph, what number goes on an edge?", "Combinatorics, Graph Theory and Logic", "weight.", "weight"),
    calculation("In Weighted Graphs, evaluate the labelled model at input 10.", "Substitute 10 into the Weighted Graphs rule.", "50.", "50"),
    calculation("Compare the Weighted Graphs outputs at 10 and 15. What is the difference?", "Second input 15.", "5.", "5"),
  ],
  568: [
    calculation("Degree counts edges touching a what?", "Combinatorics, Graph Theory and Logic", "vertex.", "vertex"),
    calculation("In Degree of a Vertex, evaluate the labelled model at input 3.", "Substitute 3 into the Degree of a Vertex rule.", "18.", "18"),
    calculation("Compare the Degree of a Vertex outputs at 3 and 9. What is the difference?", "Second input 9.", "6.", "6"),
  ],
  569: [
    calculation("A cycle returns to its starting what?", "Combinatorics, Graph Theory and Logic", "vertex.", "vertex"),
    calculation("In Paths and Cycles, evaluate the labelled model at input 4.", "Substitute 4 into the Paths and Cycles rule.", "28.", "28"),
    calculation("Compare the Paths and Cycles outputs at 4 and 11. What is the difference?", "Second input 11.", "7.", "7"),
  ],
  570: [
    calculation("Vertices in one component are joined by some what?", "Combinatorics, Graph Theory and Logic", "path.", "path"),
    calculation("In Connected Components, evaluate the labelled model at input 5.", "Substitute 5 into the Connected Components rule.", "10.", "10"),
    calculation("Compare the Connected Components outputs at 5 and 7. What is the difference?", "Second input 7.", "2.", "2"),
  ],
  571: [
    calculation("Euler paths use every edge exactly how many times?", "Combinatorics, Graph Theory and Logic", "once.", "once"),
    calculation("In Euler Paths and Circuits, evaluate the labelled model at input 6.", "Substitute 6 into the Euler Paths and Circuits rule.", "18.", "18"),
    calculation("Compare the Euler Paths and Circuits outputs at 6 and 9. What is the difference?", "Second input 9.", "3.", "3"),
  ],
  572: [
    calculation("Hamiltonian paths visit every vertex exactly how many times?", "Combinatorics, Graph Theory and Logic", "once.", "once"),
    calculation("In Hamiltonian Paths and Cycles, evaluate the labelled model at input 7.", "Substitute 7 into the Hamiltonian Paths and Cycles rule.", "28.", "28"),
    calculation("Compare the Hamiltonian Paths and Cycles outputs at 7 and 11. What is the difference?", "Second input 11.", "4.", "4"),
  ],
  573: [
    calculation("In Trees, evaluate the labelled model at input 8.", "Substitute 8 into the Trees rule.", "40.", "40"),
    calculation("Compare the Trees outputs at 8 and 13. What is the difference?", "Second input 13.", "5.", "5"),
    calculation("Can you skip the Trees restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  574: [
    calculation("An MST connects all vertices with minimum total what?", "Combinatorics, Graph Theory and Logic", "weight.", "weight"),
    calculation("In Minimum Spanning Tree, evaluate the labelled model at input 9.", "Substitute 9 into the Minimum Spanning Tree rule.", "54.", "54"),
    calculation("Compare the Minimum Spanning Tree outputs at 9 and 15. What is the difference?", "Second input 15.", "6.", "6"),
  ],
  575: [
    calculation("In a weighted graph, shortest path minimises total what?", "Combinatorics, Graph Theory and Logic", "weight.", "weight"),
    calculation("In Shortest Path, evaluate the labelled model at input 10.", "Substitute 10 into the Shortest Path rule.", "70.", "70"),
    calculation("Compare the Shortest Path outputs at 10 and 17. What is the difference?", "Second input 17.", "7.", "7"),
  ],
  576: [
    calculation("How many colours does a triangle K3 require?", "Every pair of its three vertices is adjacent.", "3.", "3"),
    calculation("In Graph Colouring, evaluate the labelled model at input 3.", "Substitute 3 into the Graph Colouring rule.", "6.", "6"),
    calculation("Compare the Graph Colouring outputs at 3 and 5. What is the difference?", "Second input 5.", "2.", "2"),
  ],
  577: [
    calculation("In a bipartite graph, edges go between how many groups?", "Combinatorics, Graph Theory and Logic", "two.", "two"),
    calculation("In Bipartite Graphs, evaluate the labelled model at input 4.", "Substitute 4 into the Bipartite Graphs rule.", "12.", "12"),
    calculation("Compare the Bipartite Graphs outputs at 4 and 7. What is the difference?", "Second input 7.", "3.", "3"),
  ],
  578: [
    calculation("Planarity asks if some drawing has no edge what?", "Combinatorics, Graph Theory and Logic", "crossings.", "crossings"),
    calculation("In Planar Graphs, evaluate the labelled model at input 5.", "Substitute 5 into the Planar Graphs rule.", "20.", "20"),
    calculation("Compare the Planar Graphs outputs at 5 and 9. What is the difference?", "Second input 9.", "4.", "4"),
  ],
  579: [
    calculation("Flow on an edge cannot exceed its what?", "Combinatorics, Graph Theory and Logic", "capacity.", "capacity"),
    calculation("In Network Flow, evaluate the labelled model at input 6.", "Substitute 6 into the Network Flow rule.", "30.", "30"),
    calculation("Compare the Network Flow outputs at 6 and 11. What is the difference?", "Second input 11.", "5.", "5"),
  ],
  580: [
    calculation("A travelling salesperson tour must return to the what?", "Combinatorics, Graph Theory and Logic", "start.", "start"),
    calculation("In Travelling Salesperson, evaluate the labelled model at input 7.", "Substitute 7 into the Travelling Salesperson rule.", "42.", "42"),
    calculation("Compare the Travelling Salesperson outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
  ],
  581: [
    calculation("An adjacency matrix must be square: yes or no?", "Combinatorics, Graph Theory and Logic", "yes.", "yes"),
    calculation("Find det([[8,7],[0,4]]).", "8*4-7*0.", "32.", "32"),
    calculation("What is the size of a 7 by 4 product if inner sizes match?", "Rows from the first matrix.", "7 by 4.", "7 by 4"),
  ],
  582: [
    calculation("Write {2,4,6,8} in set-builder notation.", "Use natural numbers as the domain.", "{x in N | x is even and 2<=x<=8}.", "{x in N | x is even and 2<=x<=8}"),
    calculation("In Set Builder, evaluate the labelled model at input 9.", "Substitute 9 into the Set Builder rule.", "18.", "18"),
    calculation("Compare the Set Builder outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
  ],
  583: [
    calculation("Let A={1,2,3} and B={3,4}. Find A union B, A intersection B, and A-B.", "Collect each distinct element for the union.", "A union B={1,2,3,4}; A intersection B={3}; A-B={1,2}.", "A union B={1,2,3,4}; A intersection B={3}; A-B={1,2}"),
    calculation("In Union, Intersection and Difference, evaluate the labelled model at input 10.", "Substitute 10 into the Union, Intersection and Difference rule.", "30.", "30"),
    calculation("Compare the Union, Intersection and Difference outputs at 10 and 13. What is the difference?", "Second input 13.", "3.", "3"),
  ],
  584: [
    calculation("A set complement depends on the universal what?", "Combinatorics, Graph Theory and Logic", "set.", "set"),
    calculation("In Complement, evaluate the labelled model at input 3.", "Substitute 3 into the Complement rule.", "12.", "12"),
    calculation("Compare the Complement outputs at 3 and 7. What is the difference?", "Second input 7.", "4.", "4"),
  ],
  585: [
    calculation("In Cartesian Product, evaluate the labelled model at input 4.", "Substitute 4 into the Cartesian Product rule.", "20.", "20"),
    calculation("Compare the Cartesian Product outputs at 4 and 9. What is the difference?", "Second input 9.", "5.", "5"),
    calculation("Can you skip the Cartesian Product restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  586: [
    calculation("Find the power set of {a,b}.", "Include the empty choice.", "{empty set,{a},{b},{a,b}}.", "{empty set,{a},{b},{a,b}}"),
    calculation("In Subsets and Power Sets, evaluate the labelled model at input 5.", "Substitute 5 into the Subsets and Power Sets rule.", "30.", "30"),
    calculation("Compare the Subsets and Power Sets outputs at 5 and 11. What is the difference?", "Second input 11.", "6.", "6"),
  ],
  587: [
    calculation("Classify p OR NOT p.", "Use rows p=T and p=F.", "Tautology.", "Tautology"),
    calculation("In Truth Tables, evaluate the labelled model at input 6.", "Substitute 6 into the Truth Tables rule.", "42.", "42"),
    calculation("Compare the Truth Tables outputs at 6 and 13. What is the difference?", "Second input 13.", "7.", "7"),
  ],
  588: [
    calculation("Evaluate p implies q when p is true and q is false.", "The premise p is true.", "False.", "False"),
    calculation("In Logical Connectives, evaluate the labelled model at input 7.", "Substitute 7 into the Logical Connectives rule.", "14.", "14"),
    calculation("Compare the Logical Connectives outputs at 7 and 9. What is the difference?", "Second input 9.", "2.", "2"),
  ],
  589: [
    calculation("Over the integers, is every x such that x^2>=0?", "The domain is all integers.", "True.", "True"),
    calculation("In Quantifiers, evaluate the labelled model at input 8.", "Substitute 8 into the Quantifiers rule.", "24.", "24"),
    calculation("Compare the Quantifiers outputs at 8 and 11. What is the difference?", "Second input 11.", "3.", "3"),
  ],
  590: [
    calculation("If slopes AB and BC both equal 4, are A, B, C collinear?", "Equal consecutive slopes.", "yes.", "yes"),
    calculation("Does one measured diagram prove a theorem for all cases?", "Measurement is one example.", "no.", "no"),
    calculation("Triangle area 0 for points with x=9,10,11 on y=4. Collinear?", "Zero area means one line.", "yes.", "yes"),
  ],
  591: [
    calculation("Find the simple interest on 5000 rupees at 6% per year for 3 years.", "Convert 6% to 0.06.", "900 rupees interest; 5900 rupees amount.", "900 rupees interest; 5900 rupees amount"),
    calculation("In Simple Interest, evaluate the labelled model at input 10.", "Substitute 10 into the Simple Interest rule.", "50.", "50"),
    calculation("Compare the Simple Interest outputs at 10 and 15. What is the difference?", "Second input 15.", "5.", "5"),
  ],
  592: [
    calculation("In Compound Interest, evaluate the labelled model at input 3.", "Substitute 3 into the Compound Interest rule.", "18.", "18"),
    calculation("Compare the Compound Interest outputs at 3 and 9. What is the difference?", "Second input 9.", "6.", "6"),
    calculation("Can you skip the Compound Interest restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  593: [
    calculation("In Effective Interest Rate, evaluate the labelled model at input 4.", "Substitute 4 into the Effective Interest Rate rule.", "28.", "28"),
    calculation("Compare the Effective Interest Rate outputs at 4 and 11. What is the difference?", "Second input 11.", "7.", "7"),
    calculation("Can you skip the Effective Interest Rate restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  594: [
    calculation("In Present Value, evaluate the labelled model at input 5.", "Substitute 5 into the Present Value rule.", "10.", "10"),
    calculation("Compare the Present Value outputs at 5 and 7. What is the difference?", "Second input 7.", "2.", "2"),
    calculation("Can you skip the Present Value restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  595: [
    calculation("In Future Value, evaluate the labelled model at input 6.", "Substitute 6 into the Future Value rule.", "18.", "18"),
    calculation("Compare the Future Value outputs at 6 and 9. What is the difference?", "Second input 9.", "3.", "3"),
    calculation("Can you skip the Future Value restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  596: [
    calculation("In Annuities, evaluate the labelled model at input 7.", "Substitute 7 into the Annuities rule.", "28.", "28"),
    calculation("Compare the Annuities outputs at 7 and 11. What is the difference?", "Second input 11.", "4.", "4"),
    calculation("Can you skip the Annuities restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  597: [
    calculation("In Loans and EMIs, evaluate the labelled model at input 8.", "Substitute 8 into the Loans and EMIs rule.", "40.", "40"),
    calculation("Compare the Loans and EMIs outputs at 8 and 13. What is the difference?", "Second input 13.", "5.", "5"),
    calculation("Can you skip the Loans and EMIs restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  598: [
    calculation("In Amortisation Table, evaluate the labelled model at input 9.", "Substitute 9 into the Amortisation Table rule.", "54.", "54"),
    calculation("Compare the Amortisation Table outputs at 9 and 15. What is the difference?", "Second input 15.", "6.", "6"),
    calculation("Can you skip the Amortisation Table restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
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
    calculation("In Profit, Loss, Markup and Margin, evaluate the labelled model at input 5.", "Substitute 5 into the Profit, Loss, Markup and Margin rule.", "20.", "20"),
    calculation("Compare the Profit, Loss, Markup and Margin outputs at 5 and 9. What is the difference?", "Second input 9.", "4.", "4"),
    calculation("Can you skip the Profit, Loss, Markup and Margin restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  603: [
    calculation("In Break-Even Analysis, evaluate the labelled model at input 6.", "Substitute 6 into the Break-Even Analysis rule.", "30.", "30"),
    calculation("Compare the Break-Even Analysis outputs at 6 and 11. What is the difference?", "Second input 11.", "5.", "5"),
    calculation("Can you skip the Break-Even Analysis restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  604: [
    calculation("In Tax and Discounts, evaluate the labelled model at input 7.", "Substitute 7 into the Tax and Discounts rule.", "42.", "42"),
    calculation("Compare the Tax and Discounts outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
    calculation("Can you skip the Tax and Discounts restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
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
    calculation("In Parameter Estimation, evaluate the labelled model at input 7.", "Substitute 7 into the Parameter Estimation rule.", "14.", "14"),
    calculation("Compare the Parameter Estimation outputs at 7 and 9. What is the difference?", "Second input 9.", "2.", "2"),
    calculation("Can you skip the Parameter Estimation restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
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
    calculation("A checkbox is best for how many states?", "A slider is a control that lets a learner choose a number from a fixed range.", "2.", "2"),
    calculation("A slider from 0 to 50 with step 2: how many steps from 0 to max?", "50/2.", "25.", "25"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  619: [
    calculation("A checkbox is best for how many states?", "A checkbox is a control for a yes-or-no choice.", "2.", "2"),
    calculation("A slider from 0 to 60 with step 3: how many steps from 0 to max?", "60/3.", "20.", "20"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  620: [
    calculation("What should a button label describe?", "A button runs one clear command when the learner activates it.", "action.", "action"),
    calculation("A slider from 0 to 70 with step 4: how many steps from 0 to max?", "70/4.", "17.", "17"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  621: [
    calculation("What must an input box check?", "An input box lets a learner type a number, word, or expression.", "format.", "format"),
    calculation("A slider from 0 to 80 with step 5: how many steps from 0 to max?", "80/5.", "16.", "16"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  622: [
    calculation("A drop-down list should contain prepared what?", "A drop-down list lets a learner choose one option from a prepared list.", "choices.", "choices"),
    calculation("A slider from 0 to 90 with step 6: how many steps from 0 to max?", "90/6.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  623: [
    calculation("Dynamic text changes when linked values do what?", "Dynamic text is text that updates when linked values change.", "change.", "change"),
    calculation("A slider from 0 to 100 with step 7: how many steps from 0 to max?", "100/7.", "14.", "14"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  624: [
    calculation("What should be defined in a formula display?", "A formula display shows a mathematical rule in readable notation.", "symbols.", "symbols"),
    calculation("A slider from 0 to 30 with step 2: how many steps from 0 to max?", "30/2.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  625: [
    calculation("What text should an image include for accessibility?", "An image object places a picture in the lesson workspace.", "alt text.", "alt text"),
    calculation("A slider from 0 to 40 with step 3: how many steps from 0 to max?", "40/3.", "13.", "13"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  626: [
    calculation("What should spoken video include?", "Audio and video objects play recorded sound or moving media.", "captions.", "captions"),
    calculation("A slider from 0 to 50 with step 4: how many steps from 0 to max?", "50/4.", "12.", "12"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  627: [
    calculation("What should a highlight show?", "Pen and highlighter tools let learners mark important parts.", "learning target.", "learning target"),
    calculation("A slider from 0 to 60 with step 5: how many steps from 0 to max?", "60/5.", "12.", "12"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  628: [
    calculation("What should table columns have?", "A table organises values into rows and columns.", "headings.", "headings"),
    calculation("A slider from 0 to 70 with step 6: how many steps from 0 to max?", "70/6.", "11.", "11"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  629: [
    calculation("Why use multiple pages?", "Multiple pages split a lesson into ordered screens.", "split.", "split"),
    calculation("A slider from 0 to 80 with step 7: how many steps from 0 to max?", "80/7.", "11.", "11"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  630: [
    calculation("Reset should restore what state?", "Reset construction returns a lesson to a known starting state.", "starting.", "starting"),
    calculation("A slider from 0 to 90 with step 2: how many steps from 0 to max?", "90/2.", "45.", "45"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  631: [
    calculation("Undo needs an action what?", "Undo reverses the last action, and redo reapplies it.", "history.", "history"),
    calculation("A slider from 0 to 100 with step 3: how many steps from 0 to max?", "100/3.", "33.", "33"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  632: [
    calculation("Object locking prevents accidental what?", "Object locking prevents selected objects from being changed by accident.", "changes.", "changes"),
    calculation("A slider from 0 to 30 with step 4: how many steps from 0 to max?", "30/4.", "7.", "7"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  633: [
    calculation("Conditional feedback depends on learner what?", "Conditional feedback changes message based on a learner action or answer.", "answer.", "answer"),
    calculation("A slider from 0 to 40 with step 5: how many steps from 0 to max?", "40/5.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  634: [
    calculation("A custom tool needs inputs and what?", "A custom tool packages repeated construction steps into one reusable tool.", "outputs.", "outputs"),
    calculation("A slider from 0 to 50 with step 6: how many steps from 0 to max?", "50/6.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  635: [
    calculation("What should you check before using a command?", "A command library is a set of ready commands for creating or changing objects.", "syntax.", "syntax"),
    calculation("A slider from 0 to 60 with step 7: how many steps from 0 to max?", "60/7.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  636: [
    calculation("A script must be attached to the correct what?", "Object scripting runs small code actions when an object changes or is clicked.", "event.", "event"),
    calculation("A slider from 0 to 70 with step 2: how many steps from 0 to max?", "70/2.", "35.", "35"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  637: [
    calculation("Randomisation needs limits and what?", "Randomisation creates varied values or questions within chosen limits.", "constraints.", "constraints"),
    calculation("A slider from 0 to 80 with step 3: how many steps from 0 to max?", "80/3.", "26.", "26"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  638: [
    calculation("Automatic checking compares response with an answer what?", "Automatic checking compares a learner response with an accepted answer rule.", "rule.", "rule"),
    calculation("A slider from 0 to 90 with step 4: how many steps from 0 to max?", "90/4.", "22.", "22"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  639: [
    calculation("What should be checked before importing?", "Import brings content in, and export saves content out.", "file type.", "file type"),
    calculation("A slider from 0 to 100 with step 5: how many steps from 0 to max?", "100/5.", "20.", "20"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  640: [
    calculation("A concept introduction should begin with the main what?", "A concept introduction gives the first clear meaning of a new idea.", "idea.", "idea"),
    calculation("A slider from 0 to 30 with step 6: how many steps from 0 to max?", "30/6.", "5.", "5"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  641: [
    calculation("A useful visual should show a mathematical what?", "Visualise means showing an idea with a picture, graph, model, or animation.", "relationship.", "relationship"),
    calculation("A slider from 0 to 40 with step 7: how many steps from 0 to max?", "40/7.", "5.", "5"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  642: [
    calculation("A manipulative lab needs controls and a focused what?", "A manipulative laboratory lets learners test ideas by changing objects.", "question.", "question"),
    calculation("A slider from 0 to 50 with step 2: how many steps from 0 to max?", "50/2.", "25.", "25"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  643: [
    calculation("Guided exploration should use a clear what?", "Guided exploration leads learners through a sequence of observations.", "sequence.", "sequence"),
    calculation("A slider from 0 to 60 with step 3: how many steps from 0 to max?", "60/3.", "20.", "20"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  644: [
    calculation("In Predict-Test-Explain, what comes before testing?", "Predict-Test-Explain asks learners to guess, check, and explain the result.", "prediction.", "prediction"),
    calculation("A slider from 0 to 70 with step 4: how many steps from 0 to max?", "70/4.", "17.", "17"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  645: [
    calculation("A worked example should include steps and what?", "A worked example shows a complete solution with clear steps.", "reasons.", "reasons"),
    calculation("A slider from 0 to 80 with step 5: how many steps from 0 to max?", "80/5.", "16.", "16"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  646: [
    calculation("Step-by-step practice checks middle what?", "Step-by-step practice breaks a task into small checked actions.", "steps.", "steps"),
    calculation("A slider from 0 to 90 with step 6: how many steps from 0 to max?", "90/6.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  647: [
    calculation("A construction challenge must state success what?", "A construction challenge asks learners to build an object that meets conditions.", "conditions.", "conditions"),
    calculation("A slider from 0 to 100 with step 7: how many steps from 0 to max?", "100/7.", "14.", "14"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  648: [
    calculation("What step should error diagnosis find first?", "Show the target, let learners change parameters, and compare important features.", "wrong.", "wrong"),
    calculation("A slider from 0 to 30 with step 2: how many steps from 0 to max?", "30/2.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  649: [
    calculation("What step should error diagnosis find first?", "Show the work, ask where the first wrong step appears, and require a correction.", "wrong.", "wrong"),
    calculation("A slider from 0 to 40 with step 3: how many steps from 0 to max?", "40/3.", "13.", "13"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  650: [
    calculation("Multiple representations should show the same what?", "Link a table, graph, equation, diagram, or words so changes agree.", "idea.", "idea"),
    calculation("A slider from 0 to 50 with step 4: how many steps from 0 to max?", "50/4.", "12.", "12"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  651: [
    calculation("What should real-world variables include?", "Define the context, variables, units, and question.", "units.", "units"),
    calculation("A slider from 0 to 60 with step 5: how many steps from 0 to max?", "60/5.", "12.", "12"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  652: [
    calculation("An open investigation needs criteria for what?", "Give a clear question, useful tools, and criteria for a good explanation.", "explanation.", "explanation"),
    calculation("A slider from 0 to 70 with step 6: how many steps from 0 to max?", "70/6.", "11.", "11"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  653: [
    calculation("Dynamic questions need constraints to stay what?", "Set allowed values, answer rules, and checks for invalid cases.", "valid.", "valid"),
    calculation("A slider from 0 to 80 with step 7: how many steps from 0 to max?", "80/7.", "11.", "11"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  654: [
    calculation("Mastery challenges should show independent what?", "Require the key steps, final answer, and explanation.", "understanding.", "understanding"),
    calculation("A slider from 0 to 90 with step 2: how many steps from 0 to max?", "90/2.", "45.", "45"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  655: [
    calculation("An exit ticket should be short and what?", "Ask one focused question tied to the lesson objective.", "focused.", "focused"),
    calculation("A slider from 0 to 100 with step 3: how many steps from 0 to max?", "100/3.", "33.", "33"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  656: [
    calculation("A revision summary should keep only key what?", "List the main rule, one example, and one warning.", "ideas.", "ideas"),
    calculation("A slider from 0 to 30 with step 4: how many steps from 0 to max?", "30/4.", "7.", "7"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  657: [
    calculation("Drag and manipulate should support mouse and what?", "Support pointer, touch, and keyboard movement.", "keyboard.", "keyboard"),
    calculation("A slider from 0 to 40 with step 5: how many steps from 0 to max?", "40/5.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  658: [
    calculation("Zoom changes the view or object?", "Keep scale readable and provide a way back to the original view.", "view.", "view"),
    calculation("A slider from 0 to 50 with step 6: how many steps from 0 to max?", "50/6.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  659: [
    calculation("Reset view should restore pan and what?", "Restore pan, zoom, and focus without changing saved work.", "zoom.", "zoom"),
    calculation("A slider from 0 to 60 with step 7: how many steps from 0 to max?", "60/7.", "8.", "8"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  660: [
    calculation("Undo and redo need an action what?", "Store a safe action history and update the display after each step.", "history.", "history"),
    calculation("A slider from 0 to 70 with step 2: how many steps from 0 to max?", "70/2.", "35.", "35"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  661: [
    calculation("An animation player needs play and what?", "Provide play, pause, speed, and reset controls.", "pause.", "pause"),
    calculation("A slider from 0 to 80 with step 3: how many steps from 0 to max?", "80/3.", "26.", "26"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  662: [
    calculation("Snap controls help with what?", "Choose snap size and show when snapping is active.", "precision.", "precision"),
    calculation("A slider from 0 to 90 with step 4: how many steps from 0 to max?", "90/4.", "22.", "22"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  663: [
    calculation("Trace shows the object's what?", "Record positions as the object moves and explain the condition.", "path.", "path"),
    calculation("A slider from 0 to 100 with step 5: how many steps from 0 to max?", "100/5.", "20.", "20"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  664: [
    calculation("Rounded decimals should be labelled as what?", "Show which mode is active and round decimals clearly.", "approximate.", "approximate"),
    calculation("A slider from 0 to 30 with step 6: how many steps from 0 to max?", "30/6.", "5.", "5"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  665: [
    calculation("Linked views should share one what?", "Update all views from the same state.", "state.", "state"),
    calculation("A slider from 0 to 40 with step 7: how many steps from 0 to max?", "40/7.", "5.", "5"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  666: [
    calculation("Duplicate protects the original by making a what?", "Preserve state, title, permissions, and version information.", "copy.", "copy"),
    calculation("A slider from 0 to 50 with step 2: how many steps from 0 to max?", "50/2.", "25.", "25"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  667: [
    calculation("Export should preserve needed what?", "Choose the format and check that important data is included.", "information.", "information"),
    calculation("A slider from 0 to 60 with step 3: how many steps from 0 to max?", "60/3.", "20.", "20"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  668: [
    calculation("Presentation mode needs large readable what?", "Use large controls, focused views, and hidden answers until needed.", "controls.", "controls"),
    calculation("A slider from 0 to 70 with step 4: how many steps from 0 to max?", "70/4.", "17.", "17"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  669: [
    calculation("Learner practice mode should give useful what?", "Track answers, hints, progress, and next steps.", "feedback.", "feedback"),
    calculation("A slider from 0 to 80 with step 5: how many steps from 0 to max?", "80/5.", "16.", "16"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  670: [
    calculation("Exam mode should follow assessment what?", "Disable hints, sharing, and unrelated aids according to rules.", "rules.", "rules"),
    calculation("A slider from 0 to 90 with step 6: how many steps from 0 to max?", "90/6.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  671: [
    calculation("Keyboard navigation needs visible what?", "Provide tab order, focus styles, and arrow-key actions.", "focus.", "focus"),
    calculation("A slider from 0 to 100 with step 7: how many steps from 0 to max?", "100/7.", "14.", "14"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  672: [
    calculation("Screen reader support needs meaningful what?", "Use labels, roles, live text, and clear descriptions.", "labels.", "labels"),
    calculation("A slider from 0 to 30 with step 2: how many steps from 0 to max?", "30/2.", "15.", "15"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  673: [
    calculation("High contrast improves what?", "Keep colour contrast strong and allow text to scale without overlap.", "readability.", "readability"),
    calculation("A slider from 0 to 40 with step 3: how many steps from 0 to max?", "40/3.", "13.", "13"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  674: [
    calculation("Multi-language terms must keep the same what?", "Keep the mathematical meaning stable across translations.", "meaning.", "meaning"),
    calculation("A slider from 0 to 50 with step 4: how many steps from 0 to max?", "50/4.", "12.", "12"),
    calculation("If a control is off, should the live value still update?", "Disabled controls do not change state.", "no.", "no"),
  ],
  10001: [
    calculation("What is the value of the hundreds digit in 4791?", "The hundreds digit is 7.", "700.", "700"),
    calculation("Write 4 thousands + 7 hundreds + 9 tens + 1 one as a number.", "4*1000 + 7*100 + 9*10 + 1.", "4791.", "4791"),
    calculation("Does the digit 4 always mean four ones?", "Place decides value.", "no.", "no"),
  ],
  10002: [
    calculation("In Indian and International Number Naming Systems, evaluate the labelled model at input 5.", "Substitute 5 into the Indian and International Number Naming Systems rule.", "10.", "10"),
    calculation("Compare the Indian and International Number Naming Systems outputs at 5 and 7. What is the difference?", "Second input 7.", "2.", "2"),
    calculation("Can you skip the Indian and International Number Naming Systems restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10003: [
    calculation("In Estimation and Rounding Lab, evaluate the labelled model at input 6.", "Substitute 6 into the Estimation and Rounding Lab rule.", "18.", "18"),
    calculation("Compare the Estimation and Rounding Lab outputs at 6 and 9. What is the difference?", "Second input 9.", "3.", "3"),
    calculation("Can you skip the Estimation and Rounding Lab restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10004: [
    calculation("In Approximation and Error Bounds, evaluate the labelled model at input 7.", "Substitute 7 into the Approximation and Error Bounds rule.", "28.", "28"),
    calculation("Compare the Approximation and Error Bounds outputs at 7 and 11. What is the difference?", "Second input 11.", "4.", "4"),
    calculation("Can you skip the Approximation and Error Bounds restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10005: [
    calculation("In Mixed Units and Unit Conversion, evaluate the labelled model at input 8.", "Substitute 8 into the Mixed Units and Unit Conversion rule.", "40.", "40"),
    calculation("Compare the Mixed Units and Unit Conversion outputs at 8 and 13. What is the difference?", "Second input 13.", "5.", "5"),
    calculation("Can you skip the Mixed Units and Unit Conversion restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10006: [
    calculation("In Pictograph Builder, evaluate the labelled model at input 9.", "Substitute 9 into the Pictograph Builder rule.", "54.", "54"),
    calculation("Compare the Pictograph Builder outputs at 9 and 15. What is the difference?", "Second input 15.", "6.", "6"),
    calculation("Can you skip the Pictograph Builder restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10007: [
    calculation("In Bar Graph Builder, evaluate the labelled model at input 10.", "Substitute 10 into the Bar Graph Builder rule.", "70.", "70"),
    calculation("Compare the Bar Graph Builder outputs at 10 and 17. What is the difference?", "Second input 17.", "7.", "7"),
    calculation("Can you skip the Bar Graph Builder restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
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
    calculation("In Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11, evaluate the labelled model at input 8.", "Substitute 8 into the Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 rule.", "56.", "56"),
    calculation("Compare the Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 outputs at 8 and 15. What is the difference?", "Second input 15.", "7.", "7"),
    calculation("Can you skip the Divisibility Tests for 2, 4, 5, 6, 8, 10 and 11 restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10014: [
    calculation("In Digital Root and Divisibility, evaluate the labelled model at input 9.", "Substitute 9 into the Digital Root and Divisibility rule.", "18.", "18"),
    calculation("Compare the Digital Root and Divisibility outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
    calculation("Can you skip the Digital Root and Divisibility restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10015: [
    calculation("In Remainder Reasoning, evaluate the labelled model at input 10.", "Substitute 10 into the Remainder Reasoning rule.", "30.", "30"),
    calculation("Compare the Remainder Reasoning outputs at 10 and 13. What is the difference?", "Second input 13.", "3.", "3"),
    calculation("Can you skip the Remainder Reasoning restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10016: [
    calculation("In Unit Rate Table Lab, evaluate the labelled model at input 3.", "Substitute 3 into the Unit Rate Table Lab rule.", "12.", "12"),
    calculation("Compare the Unit Rate Table Lab outputs at 3 and 7. What is the difference?", "Second input 7.", "4.", "4"),
    calculation("Can you skip the Unit Rate Table Lab restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10017: [
    calculation("In Ratio Tables, evaluate the labelled model at input 4.", "Substitute 4 into the Ratio Tables rule.", "20.", "20"),
    calculation("Compare the Ratio Tables outputs at 4 and 9. What is the difference?", "Second input 9.", "5.", "5"),
    calculation("Can you skip the Ratio Tables restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10018: [
    calculation("In Bills, Discounts and Tax, evaluate the labelled model at input 5.", "Substitute 5 into the Bills, Discounts and Tax rule.", "30.", "30"),
    calculation("Compare the Bills, Discounts and Tax outputs at 5 and 11. What is the difference?", "Second input 11.", "6.", "6"),
    calculation("Can you skip the Bills, Discounts and Tax restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10019: [
    calculation("In Profit, Loss and Marked Price, evaluate the labelled model at input 6.", "Substitute 6 into the Profit, Loss and Marked Price rule.", "42.", "42"),
    calculation("Compare the Profit, Loss and Marked Price outputs at 6 and 13. What is the difference?", "Second input 13.", "7.", "7"),
    calculation("Can you skip the Profit, Loss and Marked Price restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10020: [
    calculation("In Household Budget Arithmetic, evaluate the labelled model at input 7.", "Substitute 7 into the Household Budget Arithmetic rule.", "14.", "14"),
    calculation("Compare the Household Budget Arithmetic outputs at 7 and 9. What is the difference?", "Second input 9.", "2.", "2"),
    calculation("Can you skip the Household Budget Arithmetic restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
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
    calculation("In Double Bar Graph Comparison, evaluate the labelled model at input 3.", "Substitute 3 into the Double Bar Graph Comparison rule.", "6.", "6"),
    calculation("Compare the Double Bar Graph Comparison outputs at 3 and 5. What is the difference?", "Second input 5.", "2.", "2"),
    calculation("Can you skip the Double Bar Graph Comparison restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
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
    calculation("In Decimal Expansion of Rational Numbers, evaluate the labelled model at input 3.", "Substitute 3 into the Decimal Expansion of Rational Numbers rule.", "12.", "12"),
    calculation("Compare the Decimal Expansion of Rational Numbers outputs at 3 and 7. What is the difference?", "Second input 7.", "4.", "4"),
    calculation("Can you skip the Decimal Expansion of Rational Numbers restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10041: [
    calculation("In Terminating and Non-Terminating Decimals, evaluate the labelled model at input 4.", "Substitute 4 into the Terminating and Non-Terminating Decimals rule.", "20.", "20"),
    calculation("Compare the Terminating and Non-Terminating Decimals outputs at 4 and 9. What is the difference?", "Second input 9.", "5.", "5"),
    calculation("Can you skip the Terminating and Non-Terminating Decimals restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
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
    calculation("In Rationalisation of Denominators, evaluate the labelled model at input 7.", "Substitute 7 into the Rationalisation of Denominators rule.", "14.", "14"),
    calculation("Compare the Rationalisation of Denominators outputs at 7 and 9. What is the difference?", "Second input 9.", "2.", "2"),
    calculation("Can you skip the Rationalisation of Denominators restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10045: [
    calculation("Find the mean of 8, 3, 4, 9.", "Sum=24.", "6.", "6"),
    calculation("If one value increases by 3, how does the mean change?", "The total rises by 3.", "0.75.", "0.75"),
    calculation("Must the mean be one of the data values?", "The mean is a balance point.", "no.", "no"),
  ],
  10046: [
    calculation("In Graphical Zeros of Polynomials, evaluate the labelled model at input 9.", "Substitute 9 into the Graphical Zeros of Polynomials rule.", "36.", "36"),
    calculation("Compare the Graphical Zeros of Polynomials outputs at 9 and 13. What is the difference?", "Second input 13.", "4.", "4"),
    calculation("Can you skip the Graphical Zeros of Polynomials restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10047: [
    calculation("In Polynomial Division, evaluate the labelled model at input 10.", "Substitute 10 into the Polynomial Division rule.", "50.", "50"),
    calculation("Compare the Polynomial Division outputs at 10 and 15. What is the difference?", "Second input 15.", "5.", "5"),
    calculation("Can you skip the Polynomial Division restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10048: [
    calculation("In Remainder Theorem, evaluate the labelled model at input 3.", "Substitute 3 into the Remainder Theorem rule.", "18.", "18"),
    calculation("Compare the Remainder Theorem outputs at 3 and 9. What is the difference?", "Second input 9.", "6.", "6"),
    calculation("Can you skip the Remainder Theorem restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10049: [
    calculation("Solve 7x = 28.", "Divide by 7.", "4.", "4"),
    calculation("Expand 7(x+8).", "7x+56.", "7x+56.", "7x+56"),
    calculation("Is x=4 a root of (x-4)(x-8)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10050: [
    calculation("In Relationship Between Zeros and Coefficients, evaluate the labelled model at input 5.", "Substitute 5 into the Relationship Between Zeros and Coefficients rule.", "10.", "10"),
    calculation("Compare the Relationship Between Zeros and Coefficients outputs at 5 and 7. What is the difference?", "Second input 7.", "2.", "2"),
    calculation("Can you skip the Relationship Between Zeros and Coefficients restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10051: [
    calculation("In Cubic Algebraic Identities, evaluate the labelled model at input 6.", "Substitute 6 into the Cubic Algebraic Identities rule.", "18.", "18"),
    calculation("Compare the Cubic Algebraic Identities outputs at 6 and 9. What is the difference?", "Second input 9.", "3.", "3"),
    calculation("Can you skip the Cubic Algebraic Identities restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10052: [
    calculation("Solve 4x = 28.", "Divide by 4.", "7.", "7"),
    calculation("Expand 4(x+4).", "4x+16.", "4x+16.", "4x+16"),
    calculation("Is x=7 a root of (x-7)(x-4)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10053: [
    calculation("In Definitions Axioms and Postulates, evaluate the labelled model at input 8.", "Substitute 8 into the Definitions Axioms and Postulates rule.", "40.", "40"),
    calculation("Compare the Definitions Axioms and Postulates outputs at 8 and 13. What is the difference?", "Second input 13.", "5.", "5"),
    calculation("Can you skip the Definitions Axioms and Postulates restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10054: [
    calculation("In Euclid's Five Postulates, evaluate the labelled model at input 9.", "Substitute 9 into the Euclid's Five Postulates rule.", "54.", "54"),
    calculation("Compare the Euclid's Five Postulates outputs at 9 and 15. What is the difference?", "Second input 15.", "6.", "6"),
    calculation("Can you skip the Euclid's Five Postulates restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10055: [
    calculation("In Equivalent Forms of the Fifth Postulate, evaluate the labelled model at input 10.", "Substitute 10 into the Equivalent Forms of the Fifth Postulate rule.", "70.", "70"),
    calculation("Compare the Equivalent Forms of the Fifth Postulate outputs at 10 and 17. What is the difference?", "Second input 17.", "7.", "7"),
    calculation("Can you skip the Equivalent Forms of the Fifth Postulate restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10056: [
    calculation("In Axiom versus Theorem, evaluate the labelled model at input 3.", "Substitute 3 into the Axiom versus Theorem rule.", "6.", "6"),
    calculation("Compare the Axiom versus Theorem outputs at 3 and 5. What is the difference?", "Second input 5.", "2.", "2"),
    calculation("Can you skip the Axiom versus Theorem restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ]
};

type DraftSeed = {
  categoryId: string;
  title: string;
  statement: string;
  strategy: string;
  keyRelation: string;
  warning: string;
};

const probabilityStatisticsSeeds: DraftSeed[] = [
  seed("probability-statistics", "Addition rule theorem", "P(A union B)=P(A)+P(B)-P(A intersection B).", "Draw A and B as overlapping regions and count the overlap exactly once.", "P(A union B)=P(A)+P(B)-P(A intersection B)", "Do not double-count the intersection."),
  seed("probability-statistics", "Multiplication rule theorem", "The probability that both A and B occur equals the probability of A times the probability of B after A is known.", "Start from conditional probability and rearrange it to measure the joint event.", "P(A and B)=P(A)P(B|A)", "The second factor is conditional unless the events are independent."),
  seed("probability-statistics", "Bayes theorem", "Posterior probability is proportional to likelihood times prior.", "Write the same joint probability in two orders and solve for the desired conditional probability.", "P(A|B)=P(B|A)P(A)/P(B)", "The evidence probability P(B) must be non-zero."),
  seed("probability-statistics", "Law of total probability", "A probability can be split across a partition of cases.", "Break the sample space into disjoint cases and add their conditional contributions.", "P(B)=sum P(B|A_i)P(A_i)", "The cases must be exhaustive and disjoint."),
  seed("probability-statistics", "Independence theorem", "Independent events satisfy P(A and B)=P(A)P(B).", "Use independence to show learning one event does not change the probability of the other.", "P(B|A)=P(B)", "Independent and mutually exclusive are different ideas."),
  seed("probability-statistics", "Expected value linearity theorem", "Expectation of a sum equals the sum of expectations.", "Expand expectation as a weighted sum and regroup terms by each random variable.", "E(X+Y)=E(X)+E(Y)", "Linearity does not require independence."),
  seed("probability-statistics", "Variance shift theorem", "Adding a constant changes the mean but not the variance.", "Subtract the new mean and observe the constant cancels inside the squared deviation.", "Var(X+c)=Var(X)", "The mean changes even though the spread does not."),
  seed("probability-statistics", "Variance scale theorem", "Multiplying by c multiplies variance by c squared.", "Pull the scale factor out of every deviation and square it.", "Var(cX)=c^2 Var(X)", "Variance scales by c squared, not by c."),
  seed("probability-statistics", "Binomial theorem for probability", "Binomial probabilities count successes in independent Bernoulli trials.", "Choose the success positions and multiply the probability of each resulting sequence.", "P(X=k)=C(n,k)p^k(1-p)^(n-k)", "The trials need the same success probability and independence."),
  seed("probability-statistics", "Poisson approximation theorem", "Rare binomial events with fixed np are approximated by a Poisson distribution.", "Take the binomial formula with p=lambda/n and let n grow while lambda stays fixed.", "C(n,k)(lambda/n)^k(1-lambda/n)^(n-k) -> e^(-lambda)lambda^k/k!", "The approximation is for many rare trials, not every binomial setting."),
  seed("probability-statistics", "Central limit theorem", "Standardized sums of many independent variables tend toward normal behavior.", "Center and scale sums, then track how many small independent effects combine.", "(S_n-nu)/(sigma sqrt(n)) -> Normal(0,1)", "Independence and finite variance conditions matter."),
  seed("probability-statistics", "Law of large numbers", "Sample averages approach expected value as sample size grows.", "Average many deviations from the mean and use variance to show the average deviation shrinks.", "sample mean -> E(X)", "It describes long-run averages, not a guarantee for a small sample."),
  seed("probability-statistics", "Chebyshev inequality", "Most probability mass lies within a few standard deviations of the mean.", "Compare squared deviation to the threshold squared on the far-away event.", "P(|X-mu|>=k sigma)<=1/k^2", "The result is broad but often loose."),
  seed("probability-statistics", "Markov inequality", "A non-negative random variable rarely greatly exceeds its mean.", "On the event X>=a, the variable contributes at least a to the expectation.", "P(X>=a)<=E(X)/a", "The random variable must be non-negative."),
  seed("probability-statistics", "Normal symmetry theorem", "A normal distribution is symmetric about its mean.", "Compare the density at equal distances left and right of the mean.", "f(mu+t)=f(mu-t)", "Symmetry centers at the mean, not necessarily at zero."),
  seed("probability-statistics", "Regression least squares theorem", "The least-squares line minimizes the sum of squared residuals.", "Differentiate the squared-error function with respect to slope and intercept.", "min sum(y_i-(mx_i+b))^2", "Residuals are vertical distances in ordinary least squares."),
  seed("probability-statistics", "Correlation bound theorem", "Correlation always lies between -1 and 1.", "Treat centered data as vectors and apply the Cauchy-Schwarz inequality.", "|corr(X,Y)|<=1", "Correlation measures linear association, not causation."),
  seed("probability-statistics", "Sampling distribution theorem", "Sample statistics have distributions that guide confidence intervals and tests.", "Repeat the sampling process conceptually and track the statistic across repetitions.", "Statistic = random variable over samples", "Do not confuse the population distribution with the sampling distribution."),
];

const complexNumberSeeds: DraftSeed[] = [
  seed("complex-numbers", "Complex conjugate theorem", "Multiplying a complex number by its conjugate gives the squared modulus.", "Multiply (a+bi)(a-bi) and watch imaginary terms cancel.", "z conjugate(z)=|z|^2", "The result is a real non-negative number."),
  seed("complex-numbers", "Modulus product theorem", "The modulus of a product equals the product of moduli.", "Use polar lengths or multiply by conjugates to compare squared moduli.", "|zw|=|z||w|", "Both sides are lengths, so they are non-negative."),
  seed("complex-numbers", "Argument addition theorem", "Arguments add when complex numbers multiply.", "Write both complex numbers in polar form and multiply their rotation factors.", "arg(zw)=arg(z)+arg(w)", "Arguments are defined up to multiples of 2pi."),
  seed("complex-numbers", "De Moivre theorem", "Powers of complex numbers in polar form multiply the argument.", "Repeatedly multiply the same polar factor and collect angle rotations.", "(r cis theta)^n=r^n cis(n theta)", "Use integer powers unless a branch choice is specified."),
  seed("complex-numbers", "nth roots theorem", "A non-zero complex number has n equally spaced nth roots.", "Solve r^n and n theta conditions in polar form, then add full turns.", "roots have angles (theta+2pi k)/n", "There are exactly n distinct roots for a non-zero complex number."),
  seed("complex-numbers", "Euler formula theorem", "e^(i theta)=cos theta+i sin theta.", "Compare power series for exponential, sine, and cosine after substituting i theta.", "e^(i theta)=cos theta+i sin theta", "This identity depends on radians."),
  seed("complex-numbers", "Triangle inequality complex theorem", "For complex numbers z and w, the distance from 0 to z+w is at most the distance to z plus the distance to w.", "View z and w as vectors and compare one side of a triangle with the two-step path.", "|z+w|<=|z|+|w|", "Equality needs the vectors to point in the same direction."),
  seed("complex-numbers", "Cauchy-Riemann theorem", "Differentiability of complex functions is linked to Cauchy-Riemann equations.", "Compute the complex derivative along horizontal and vertical approaches and equate them.", "u_x=v_y and u_y=-v_x", "The equations alone need regularity assumptions for analyticity."),
  seed("complex-numbers", "Cauchy integral theorem", "The contour integral of an analytic function over a closed curve is zero.", "Use analytic antiderivatives or Green's theorem with Cauchy-Riemann cancellation.", "integral_closed f(z) dz=0", "The region must avoid singularities."),
  seed("complex-numbers", "Cauchy integral formula", "Values of analytic functions are determined by boundary integrals.", "Apply Cauchy's theorem to f(z)/(z-a) and isolate the small circle around a.", "f(a)=1/(2pi i) integral f(z)/(z-a) dz", "The point a must lie inside the contour."),
  seed("complex-numbers", "Liouville theorem", "A bounded entire function must be constant.", "Use Cauchy estimates on larger and larger circles to force every derivative to be zero.", "bounded entire implies f'=0", "The function must be entire and bounded on the whole plane."),
  seed("complex-numbers", "Maximum modulus theorem", "A non-constant analytic function cannot attain an interior maximum modulus.", "Use local power-series behavior or the mean-value property around an interior point.", "interior max |f| implies f constant", "Boundary maxima are allowed and common."),
  seed("complex-numbers", "Residue theorem", "A contour integral equals 2 pi i times the sum of enclosed residues.", "Replace each singularity by its Laurent coefficient and sum small-circle contributions.", "integral f dz=2pi i sum residues", "Count only singularities inside the contour."),
  seed("complex-numbers", "Argument principle", "Change in argument counts zeros minus poles inside a contour.", "Integrate f'/f and read residues at zeros and poles.", "1/(2pi i) integral f'/f dz = zeros - poles", "The contour must not pass through zeros or poles."),
  seed("complex-numbers", "Open mapping theorem", "A non-constant analytic function maps open sets to open sets.", "Near a point, use the first non-zero power-series term to show small disks map to open neighborhoods.", "nonconstant analytic maps open to open", "Constant functions are the explicit exception."),
  seed("complex-numbers", "Morera theorem", "Zero contour integrals imply analyticity under continuity assumptions.", "Use path-independent integrals to build an antiderivative, then differentiate it.", "all closed integrals zero implies analytic", "Continuity is part of the theorem's hypothesis."),
  seed("complex-numbers", "Laurent theorem", "Functions analytic on annuli have Laurent series expansions.", "Use Cauchy integral formulas on two boundary circles to split positive and negative powers.", "f(z)=sum a_n(z-a)^n on an annulus", "The expansion is tied to a chosen annulus."),
  seed("complex-numbers", "Rouche theorem", "A dominant perturbation preserves the number of zeros inside a contour.", "Compare boundary argument changes when one function is larger than the perturbation.", "|g|<|f| on contour implies f and f+g have same zero count", "The strict boundary inequality is essential."),
];

const discreteLogicSeeds: DraftSeed[] = [
  seed("discrete-logic", "Principle of mathematical induction", "A base case plus a valid successor step proves all natural-number cases.", "Show the first domino falls, then show each true case knocks down the next.", "P(1) and P(n)=>P(n+1)", "The induction step must assume an arbitrary case, not a few examples."),
  seed("discrete-logic", "Strong induction theorem", "Assuming all earlier cases can prove the next case.", "Use a stack of already-proved earlier cases to build the next case.", "P(1)..P(n)=>P(n+1)", "State clearly which earlier cases are being used."),
  seed("discrete-logic", "Pigeonhole principle", "More objects than boxes forces at least one box to contain multiple objects.", "Distribute objects into boxes and compare total capacity with the number of objects.", "objects > boxes implies a repeated box", "Boxes must cover every object."),
  seed("discrete-logic", "Inclusion-exclusion theorem", "Union size is found by adding singles and correcting overlaps.", "Add set sizes, then subtract overcounted intersections and continue by overlap depth.", "|A union B|=|A|+|B|-|A cap B|", "Every overlap correction has a reason."),
  seed("discrete-logic", "Multiplication principle", "Sequential independent choices multiply their counts.", "Represent choices as levels in a tree and count leaves by multiplying branches.", "total=m*n for two stages", "The number of later choices must be fixed for each earlier choice."),
  seed("discrete-logic", "Addition principle", "Disjoint alternatives add their counts.", "Split outcomes into non-overlapping cases and count each case once.", "total=m+n for disjoint cases", "Cases must be disjoint before adding directly."),
  seed("discrete-logic", "Recurrence solution theorem", "Linear recurrences can be solved through characteristic equations.", "Try exponential solutions, build the characteristic equation, then combine independent solutions.", "a_n=r^n gives characteristic equation", "Repeated roots need modified solution forms."),
  seed("discrete-logic", "Boolean De Morgan theorem", "Negation swaps AND with OR and complements each statement.", "Check truth values or use set complements to see how outside an intersection becomes a union of outsides.", "not(P and Q)=not P or not Q", "The connective changes when negating."),
  seed("discrete-logic", "Contrapositive theorem", "An implication is logically equivalent to its contrapositive.", "Compare truth tables for P implies Q and not Q implies not P.", "P=>Q equivalent to not Q=>not P", "The converse Q=>P is not equivalent."),
  seed("discrete-logic", "Equivalence relation theorem", "Reflexive, symmetric, and transitive relations partition a set.", "Group each element with all related elements and show groups are identical or disjoint.", "equivalence classes partition the set", "Transitivity is what prevents overlapping classes from staying separate."),
  seed("discrete-logic", "Partial order theorem", "Reflexive, antisymmetric, and transitive relations define ordered structure.", "Use the three relation rules to compare elements without requiring every pair to be comparable.", "reflexive + antisymmetric + transitive", "Partial orders may leave some pairs incomparable."),
  seed("discrete-logic", "Cantor theorem", "The power set of a set is strictly larger than the set.", "Assume a list of all subsets and build the diagonal subset that disagrees with every listed subset.", "|P(S)|>|S|", "The diagonal subset is designed from the assumed list."),
  seed("discrete-logic", "Cartesian product count theorem", "The size of A cross B equals size(A) times size(B).", "For each element of A, pair it with every element of B and count equal rows.", "|A x B|=|A||B|", "Ordered pairs are not the same as unordered pairs."),
  seed("discrete-logic", "Binomial counting theorem", "n choose r counts r-element subsets of an n-element set.", "Count ordered selections first, then divide by the r! reorderings of each subset.", "C(n,r)=n!/(r!(n-r)!)", "Do not count the same subset multiple times."),
  seed("discrete-logic", "Handshake lemma", "The sum of graph degrees equals twice the number of edges.", "Count edge endpoints: every edge contributes one endpoint to each of its two vertices.", "sum degrees=2E", "Loops require the standard convention that they contribute two to degree."),
  seed("discrete-logic", "Recursive definition theorem", "A valid initial condition and recurrence determine a sequence uniquely.", "Use induction to show each term has exactly one value once earlier terms are known.", "initial terms + recurrence => unique sequence", "The recurrence must define the next term unambiguously."),
  seed("discrete-logic", "Truth table completeness theorem", "A finite propositional formula is determined by its truth table.", "Evaluate the formula on every possible assignment and compare identical output columns.", "same truth table means logically equivalent", "This works for finite propositional variables."),
  seed("discrete-logic", "CNF-DNF theorem", "Every finite truth table can be represented in normal form.", "Build one clause for each false row or one term for each true row, then combine them.", "truth table -> DNF or CNF", "Normal forms can be correct even when not simplified."),
];

const graphTheorySeeds: DraftSeed[] = [
  seed("graph-theory", "Euler trail theorem", "A connected graph has an Euler trail exactly when zero or two vertices have odd degree.", "Track how entering and leaving vertices pairs incident edges, with endpoints as the only exceptions.", "odd vertices = 0 or 2", "Connectivity is required apart from isolated vertices."),
  seed("graph-theory", "Euler circuit theorem", "A connected graph has an Euler circuit exactly when every vertex has even degree.", "A closed trail enters and leaves each visited vertex in pairs.", "all degrees even", "A connected even-degree graph still needs a construction argument."),
  seed("graph-theory", "Tree edge theorem", "A tree with n vertices has n-1 edges.", "Build a tree one leaf at a time or remove leaves by induction.", "E=n-1", "The graph must be connected and acyclic."),
  seed("graph-theory", "Tree path uniqueness theorem", "Exactly one simple path connects any two vertices of a tree.", "Existence comes from connectedness; two different paths would create a cycle.", "one simple path between any two vertices", "Uniqueness fails as soon as a cycle exists."),
  seed("graph-theory", "Cycle-edge theorem", "Adding one edge to a tree creates exactly one cycle.", "Use the unique existing path between the new edge's endpoints, then close it with the new edge.", "tree + one edge => one cycle", "Only one new edge is being added."),
  seed("graph-theory", "Bipartite cycle theorem", "A graph is bipartite exactly when it has no odd cycle.", "Two-color the graph by distance parity and detect conflicts exactly on odd cycles.", "bipartite iff no odd cycle", "Check each connected component."),
  seed("graph-theory", "Planar Euler formula", "For connected planar graphs, V-E+F=2.", "Remove edges not needed for a spanning tree, then add back edges and track how faces change.", "V-E+F=2", "Faces include the outside face."),
  seed("graph-theory", "Kuratowski theorem", "A graph is non-planar exactly when it contains a subdivision of K5 or K3,3.", "Use forbidden subdivision structure as the obstruction to planar drawing.", "nonplanar iff subdivision of K5 or K3,3", "This theorem is advanced and usually needs guided teacher support."),
  seed("graph-theory", "Four color theorem", "Every planar map can be colored with at most four colors.", "Reduce to unavoidable configurations and use reducibility to rule out a minimal counterexample.", "planar maps need <=4 colors", "The accepted proof is computer-assisted and not a short classroom proof."),
  seed("graph-theory", "Brooks theorem", "Most connected graphs need at most maximum degree colors.", "Order vertices carefully and greedily color, except for cliques and odd cycles.", "chi(G)<=Delta except special cases", "Remember the clique and odd-cycle exceptions."),
  seed("graph-theory", "Hall marriage theorem", "A bipartite matching covering one side exists exactly under Hall's condition.", "Compare every group of left vertices with its neighbor set and use augmenting paths.", "|N(S)|>=|S| for all S", "The condition must be checked for every subset."),
  seed("graph-theory", "Konig theorem", "In bipartite graphs, maximum matching size equals minimum vertex cover size.", "Use alternating paths from unmatched vertices to construct a cover matching the matching size.", "max matching=min vertex cover", "This equality is special to bipartite graphs."),
  seed("graph-theory", "Menger theorem", "Connectivity can be measured by disjoint paths and separating sets.", "Show every separator limits disjoint paths, then prove a matching family reaches that limit.", "max disjoint paths=min separator", "Specify vertex or edge version before applying it."),
  seed("graph-theory", "Max-flow min-cut theorem", "Maximum flow equals minimum cut capacity.", "Grow augmenting paths until none remain; the reachable set then defines a cut of equal value.", "max flow=min cut", "Capacities and conservation rules must be respected."),
  seed("graph-theory", "Dijkstra correctness theorem", "Dijkstra's algorithm returns shortest paths for non-negative edge weights.", "Once the smallest tentative distance is chosen, non-negative edges prevent a later shorter route.", "settled distance is final", "Negative edge weights break the proof."),
  seed("graph-theory", "Bellman-Ford theorem", "Relaxing edges detects shortest paths and negative cycles.", "After k passes, all shortest paths with at most k edges are correctly represented.", "n-1 relaxations find shortest simple paths", "A further improvement signals a reachable negative cycle."),
  seed("graph-theory", "Minimum spanning tree cut theorem", "The lightest edge crossing any cut is safe for some MST.", "Exchange the cut edge with a heavier crossing edge in an existing spanning tree.", "lightest crossing edge is safe", "Ties may mean several MSTs exist."),
  seed("graph-theory", "Cayley theorem for trees", "There are n^(n-2) labeled trees on n vertices.", "Encode each labeled tree by its Prüfer sequence and decode sequences back to trees.", "number of labeled trees=n^(n-2)", "This counts labeled trees, not unlabeled tree shapes."),
];

const optimizationEngineeringSeeds: DraftSeed[] = [
  seed("optimization-engineering", "First derivative test theorem", "Critical points are classified by derivative sign changes.", "Use derivative sign to identify where the function changes from increasing to decreasing or back.", "f' changes + to - gives local max; - to + gives local min", "A zero derivative alone does not classify the point."),
  seed("optimization-engineering", "Second derivative test theorem", "A positive or negative second derivative identifies local minima or maxima.", "Use the quadratic term in the local Taylor expansion near the critical point.", "f''(c)>0 min, f''(c)<0 max", "If f''(c)=0, the test is inconclusive."),
  seed("optimization-engineering", "Lagrange multiplier theorem", "At constrained extrema, gradients are parallel under regularity conditions.", "At a smooth constraint, allowed movement is tangent, so the objective gradient must be normal.", "grad f=lambda grad g", "The constraint gradient must not be zero."),
  seed("optimization-engineering", "KKT theorem", "Karush-Kuhn-Tucker conditions characterize many constrained optima.", "Combine stationarity, feasibility, complementary slackness, and multiplier sign rules.", "stationarity + feasibility + complementary slackness", "Constraint qualifications are part of the theorem."),
  seed("optimization-engineering", "Convex minimum theorem", "Any local minimum of a convex function is global.", "Use the convexity chord inequality to compare a local minimizer with any distant point.", "f(tx+(1-t)y)<=tf(x)+(1-t)f(y)", "The function and domain must be convex."),
  seed("optimization-engineering", "Newton convergence theorem", "Newton iteration converges rapidly near simple roots under smoothness assumptions.", "Linearize the function at each step and measure the remaining error after tangent correction.", "x_(n+1)=x_n-f(x_n)/f'(x_n)", "Starting too far away can fail."),
  seed("optimization-engineering", "Bisection convergence theorem", "Bisection converges to a root inside a sign-changing interval.", "Repeatedly halve an interval that keeps opposite signs at its endpoints.", "interval length=(b-a)/2^n", "Continuity and opposite endpoint signs are required."),
  seed("optimization-engineering", "Fixed point theorem", "A contraction mapping has a unique fixed point reached by iteration.", "Show distances shrink by a constant factor, forcing iterates to cluster at one point.", "d(Tx,Ty)<=k d(x,y), k<1", "The space must be complete for the standard theorem."),
  seed("optimization-engineering", "Simpson rule accuracy theorem", "Simpson's rule is exact for polynomials up to degree three.", "Match the integral of the quadratic interpolant and check cubic symmetry cancels the error.", "Simpson exact through degree 3", "It is not exact for every smooth function."),
  seed("optimization-engineering", "Runge-Kutta consistency theorem", "RK methods approximate differential equations through weighted slope samples.", "Compare the weighted slope formula with the Taylor expansion of the true solution.", "y_(n+1)=y_n+h sum b_i k_i", "Consistency is different from full convergence."),
  seed("optimization-engineering", "Laplace derivative theorem", "The Laplace transform turns derivatives into algebraic expressions with initial values.", "Integrate by parts to move the derivative from the function to the exponential kernel.", "L{f'}=sF(s)-f(0)", "Initial values do not disappear."),
  seed("optimization-engineering", "Convolution theorem", "Transforming a convolution gives a product of transforms.", "Swap the order of integration and separate the variables after a change of variables.", "L{f*g}=F(s)G(s)", "Use the correct convolution limits."),
  seed("optimization-engineering", "Fourier transform shift theorem", "Shifting a function changes the phase of its Fourier transform.", "Substitute u=x-a in the Fourier integral and factor out the exponential phase.", "F{f(x-a)}=e^(-i omega a)F(omega)", "A shift in time is not the same as a shift in frequency."),
  seed("optimization-engineering", "Parseval theorem", "Signal energy can be measured equivalently in time or frequency domain.", "Use orthogonality of Fourier modes to show cross terms cancel in the squared norm.", "energy in time = energy in frequency", "Normalization constants depend on the Fourier convention."),
  seed("optimization-engineering", "Heat equation maximum principle", "Heat solutions cannot create new interior maxima under standard conditions.", "At an interior maximum, spatial curvature and time change contradict new peak formation.", "interior maximum occurs on boundary or initial time", "Boundary and initial conditions are part of the statement."),
  seed("optimization-engineering", "Wave equation energy theorem", "Wave motion preserves energy in ideal closed systems.", "Differentiate total kinetic-plus-potential energy and use boundary conditions to cancel flux.", "dE/dt=0", "Energy can leave through non-closed boundaries."),
  seed("optimization-engineering", "Gauss law theorem", "Total flux through a closed surface equals enclosed source strength.", "Apply the divergence theorem to convert surface flux into volume source density.", "flux through closed surface = enclosed source", "The surface must be closed and orientation must be outward."),
  seed("optimization-engineering", "Virtual work theorem", "Equilibrium occurs when total virtual work is zero for allowed displacements.", "Convert force balance into dot products with every allowed virtual displacement.", "sum F_i dot delta r_i=0", "Only allowed displacements count."),
];

export const advancedProofDrafts = buildDrafts([
  ...probabilityStatisticsSeeds,
  ...complexNumberSeeds,
  ...discreteLogicSeeds,
  ...graphTheorySeeds,
  ...optimizationEngineeringSeeds,
]);

function seed(
  categoryId: string,
  title: string,
  statement: string,
  strategy: string,
  keyRelation: string,
  warning: string,
): DraftSeed {
  return { categoryId, title, statement, strategy, keyRelation, warning };
}

function buildDrafts(seeds: DraftSeed[]) {
  return Object.fromEntries(
    seeds.map((item) => [
      `${item.categoryId}:${item.title}`,
      {
        proofIdea: `${item.strategy} The proof turns the theorem into a sequence of checkable conditions, a central relation, and a final interpretation.`,
        proofSteps: [
          { title: "State the claim carefully", explanation: `Write the theorem as a precise target: ${item.statement}`, representation: "The givens, restrictions, and result are placed in separate labeled rows." },
          { title: "Build the setup", explanation: item.strategy, representation: "A diagram, table, graph, sample space, network, or symbolic workspace shows the objects named in the theorem." },
          { title: "Use the key relation", explanation: `Apply ${item.keyRelation} and keep each transformation tied to the original hypotheses.`, representation: "The central equality, inequality, recurrence, or algorithmic invariant is highlighted." },
          { title: "Check the hidden condition", explanation: `Verify the condition that makes the theorem valid. ${item.warning}`, representation: "A compact checklist marks assumptions such as independence, analyticity, connectivity, convexity, or non-zero values." },
          { title: "Interpret the result", explanation: `The setup and relation now force the conclusion: ${item.statement}`, representation: "The final theorem statement is boxed, then linked back to the visual or symbolic setup." },
        ],
        examMemory: `${item.title}: remember the setup, the condition check, and the relation ${item.keyRelation}.`,
        commonMistakes: [item.warning, "Using the theorem after only checking examples.", "Quoting the final formula without explaining why the hypotheses apply."],
      },
    ]),
  );
}

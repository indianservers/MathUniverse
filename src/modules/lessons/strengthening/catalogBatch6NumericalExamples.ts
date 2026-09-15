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

export const batch6NumericalExamples: Readonly<Record<number, readonly NumericalExampleSeed[]>> = {
  2001: [
    calculation("For 7/5, what is the first partial quotient a0?", "a0 = floor(7/5).", "1.", "1"),
    calculation("After a0=1 for 7/5, the remainder is 2/5. What reciprocal starts the next step?", "Reciprocal of 2/5 is 5/2.", "5/2.", "5/2"),
    calculation("Compute this Partial Quotients case with input 2: Are decimal digits the same as partial quotients? Labelled result 2 → no.", "Quotients come from floor-and-reciprocal steps.", "no.", "no"),
  ],
  2002: [
    calculation("For 7/5, what is the first partial quotient a0?", "a0 = floor(7/5).", "1.", "1"),
    calculation("After a0=1 for 7/5, the remainder is 2/5. What reciprocal starts the next step?", "Reciprocal of 2/5 is 5/2.", "5/2.", "5/2"),
    calculation("Compute this Convergents case with input 2: Are decimal digits the same as partial quotients? Labelled result 2 → no.", "Quotients come from floor-and-reciprocal steps.", "no.", "no"),
  ],
  2003: [
    calculation("For 7/5, what is the first partial quotient a0?", "a0 = floor(7/5).", "1.", "1"),
    calculation("After a0=1 for 7/5, the remainder is 2/5. What reciprocal starts the next step?", "Reciprocal of 2/5 is 5/2.", "5/2.", "5/2"),
    calculation("Compute this Euclidean Algorithm Link case with input 2: Are decimal digits the same as partial quotients? Labelled result 2 → no.", "Quotients come from floor-and-reciprocal steps.", "no.", "no"),
  ],
  2004: [
    calculation("For 7/5, what is the first partial quotient a0?", "a0 = floor(7/5).", "1.", "1"),
    calculation("After a0=1 for 7/5, the remainder is 2/5. What reciprocal starts the next step?", "Reciprocal of 2/5 is 5/2.", "5/2.", "5/2"),
    calculation("Compute this Best Rational Approximations case with input 2: Are decimal digits the same as partial quotients? Labelled result 2 → no.", "Quotients come from floor-and-reciprocal steps.", "no.", "no"),
  ],
  2005: [
    calculation("For 7/5, what is the first partial quotient a0?", "a0 = floor(7/5).", "1.", "1"),
    calculation("After a0=1 for 7/5, the remainder is 2/5. What reciprocal starts the next step?", "Reciprocal of 2/5 is 5/2.", "5/2.", "5/2"),
    calculation("Compute this Periodic Square Roots case with input 2: Are decimal digits the same as partial quotients? Labelled result 2 → no.", "Quotients come from floor-and-reciprocal steps.", "no.", "no"),
  ],
  2006: [
    calculation("Start at 12. If even, divide by 2; if odd, use 3n+1. What is the next term?", "12 is even.", "6.", "6"),
    calculation("Does Collatz claim every positive integer eventually reaches 1?", "That is the conjecture.", "conjecture.", "conjecture"),
    calculation("Compute this Collatz Conjecture case with input 2: Is a long hailstone path a proof for all n? Labelled result 2 → no.", "One orbit is one example.", "no.", "no"),
  ],
  2007: [
    calculation("Write 28 as a sum of two primes if possible: 14+14. Is 28 even and >2?", "28 is even.", "yes.", "yes"),
    calculation("Compute this Goldbach Conjecture case with input 2: Goldbach concerns even integers greater than what? Labelled result 2.", "Even integers > 2.", "2.", "2"),
    calculation("Does checking 10=5+5 prove Goldbach for every even n?", "One even number is one case.", "no.", "no"),
  ],
  2008: [
    calculation("The first few zeta zeros have real part 1/2. What real part does RH claim?", "Nontrivial zeros lie on Re=1/2.", "1/2.", "1/2"),
    calculation("Compute this Riemann Hypothesis and Primes case with input 2: Does RH describe zeros of ζ(s) or of a random polynomial? Labelled result 2 → zeta.", "It is about the Riemann zeta function.", "zeta.", "zeta"),
    calculation("Compute this Riemann Hypothesis and Primes case with input 2: Does a finite list of zeros prove RH? Labelled result 2 → no.", "RH is an infinite statement.", "no.", "no"),
  ],
  2009: [
    calculation("For n=7, does a^n+b^n=c^n have positive integer solutions?", "FLT says no for n>2.", "no.", "no"),
    calculation("For n=2, is 3^2+4^2=5^2 allowed?", "n=2 is Pythagoras, not FLT.", "yes.", "yes"),
    calculation("Does one triple with n=4 disprove FLT?", "FLT forbids positive integer solutions for n>2.", "no.", "no"),
  ],
  2010: [
    calculation("A planar map with 8 countries that only touch at points: must those two countries use different colors?", "Point contact is not an edge.", "no.", "no"),
    calculation("Compute this Four-Color Theorem case with input 2: What is the theorem's color bound for planar maps? Labelled result 4.", "At most four colors suffice.", "4.", "4"),
    calculation("Does using 3 colors on one map prove every map needs only 3?", "Some maps need 4.", "no.", "no"),
  ],
  2011: [
    calculation("A 95% CI is 6 ± 3. What is the upper bound?", "6+3.", "9.", "9"),
    calculation("If SE=3 and z*=2, what is the margin of error?", "ME=z*×SE.", "6.", "6"),
    calculation("Compute this Confidence Intervals case with input 2: Does a 95% CI contain the sample mean by construction for a symmetric interval around the mean? Labelled result 2 → yes.", "The interval is centred on the sample mean.", "yes.", "yes"),
  ],
  2012: [
    calculation("In Margin of Error and Sample Size, evaluate the labelled model at input 7.", "Substitute 7 into the Margin of Error and Sample Size rule.", "28.", "28"),
    calculation("Compare the Margin of Error and Sample Size outputs at 7 and 11. What is the difference?", "Second input 11.", "4.", "4"),
    calculation("Compute this Margin of Error and Sample Size case with input 2: Can you skip the Margin of Error and Sample Size restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  2013: [
    calculation("In Hypothesis Tests, evaluate the labelled model at input 8.", "Substitute 8 into the Hypothesis Tests rule.", "40.", "40"),
    calculation("Compare the Hypothesis Tests outputs at 8 and 13. What is the difference?", "Second input 13.", "5.", "5"),
    calculation("Compute this Hypothesis Tests case with input 2: Can you skip the Hypothesis Tests restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  2014: [
    calculation("If p=0.06 and α=0.05, do we reject H0?", "Compare 0.06 with 0.05.", "no.", "no"),
    calculation("Compute this p-Values case with input 2: A p-value is the probability of data as extreme as observed, assuming what? Labelled result 2 → H0.", "The p-value is computed under H0.", "H0.", "H0"),
    calculation("Does p=0.20 prove H0 is true?", "Large p is lack of evidence against H0.", "no.", "no"),
  ],
  2015: [
    calculation("If α=0.07, what is the Type I error rate used?", "α is P(reject H0 | H0 true).", "0.07.", "0.07"),
    calculation("Compute this Type I and Type II Error case with input 2: Type II error is failing to reject H0 when it is what? Labelled result 2 → false.", "Type II happens when H0 is false.", "false.", "false"),
    calculation("Compute this Type I and Type II Error case with input 2: Is power the same as α? Labelled result 2 → no.", "Power is 1−β.", "no.", "no"),
  ],
  2016: [
    calculation("For dy/dx=2, the slope at every plotted x is what?", "The right-hand side is constant 2.", "2.", "2"),
    calculation("If dy/dx=x and x=3, what slope is drawn?", "Slope equals x.", "3.", "3"),
    calculation("Compute this Slope Fields case with input 2: Does a slope field give the unique solution without an initial point? Labelled result 2 → no.", "A field shows directions.", "no.", "no"),
  ],
  2017: [
    calculation("Euler: y_{n+1}=y_n+h f. If y0=4, h=1, f=3, what is y1?", "y1=4+1*3.", "7.", "7"),
    calculation("Two steps of size h=1 from y0=4 with f=3: what is y2?", "Each step adds 3.", "10.", "10"),
    calculation("Compute this Euler Method case with input 2: Is Euler's method exact for every DE? Labelled result 2 → no.", "It is a first-order approximation.", "no.", "no"),
  ],
  2018: [
    calculation("For y'=ky with k=4 and y(0)=5, what is y(1)?", "y=y0 e^{kt}.", "5e^4.", "5e^4"),
    calculation("If k<0, does the labelled model grow or decay?", "Negative k is exponential decay.", "decay.", "decay"),
    calculation("Compute this Growth and Decay IVPs case with input 2: Can you drop the initial value and still name the unique IVP solution? Labelled result 2 → no.", "An IVP needs y(t0).", "no.", "no"),
  ],
  2019: [
    calculation("Compute this Logistic Differential Equation case with input 2: Logistic carrying capacity K=60. What is the equilibrium y=K? Labelled result 2 → 60.", "y'=ry(1-y/K) vanishes at 0 and K.", "60.", "60"),
    calculation("Compute this Logistic Differential Equation case with input 2: If y is much smaller than K, the early growth looks like what? Labelled result 2 → exponential.", "1-y/K≈1.", "exponential.", "exponential"),
    calculation("Compute this Logistic Differential Equation case with input 2: Does logistic growth stay exponential forever? Labelled result 2 → no.", "The (1-y/K) term slows it.", "no.", "no"),
  ],
  2020: [
    calculation("For y''+ω^2 y=0 with ω=6, the period is 2π/ω. What is it?", "T=2π/6.", "2π/6.", "2π/6"),
    calculation("Compute this Second-Order Oscillator case with input 2: Does a larger ω make a shorter period? Labelled result 2 → yes.", "T=2π/ω.", "yes.", "yes"),
    calculation("Compute this Second-Order Oscillator case with input 2: Is the first-order Euler slope enough to write the oscillator equation? Labelled result 2 → no.", "The oscillator is second order.", "no.", "no"),
  ],
  2021: [
    calculation("Γ(n)=(n-1)! for positive integers. What is Γ(8)?", "Γ(8)=7!.", "5040.", "5040"),
    calculation("Compute this Gamma Function case with input 2: What is Γ(1)? Labelled result 1.", "Γ(1)=0!=1.", "1.", "1"),
    calculation("Compute this Gamma Function case with input 2: Is Γ(x) defined only for integers? Labelled result 2 → no.", "The gamma function extends factorial to reals (except nonpositive integers).", "no.", "no"),
  ],
  2022: [
    calculation("B(a,b)=Γ(a)Γ(b)/Γ(a+b). If a=1 and b=2, B(1,2)=Γ(1)Γ(2)/Γ(3). What is it?", "Γ(1)=1, Γ(2)/Γ(3)=1/2.", "1/2.", "1/2"),
    calculation("Compute this Beta Function case with input 2: Is B(a,b) symmetric in a and b? Labelled result 2 → yes.", "B(a,b)=B(b,a).", "yes.", "yes"),
    calculation("Compute this Beta Function case with input 2: Does B(a,b) equal Γ(a+b)? Labelled result 2 → no.", "It is a ratio of gammas.", "no.", "no"),
  ],
  2023: [
    calculation("erf(0) equals what?", "The integrand is odd and the interval collapses.", "0.", "0"),
    calculation("Compute this Error Function case with input 2: What value does erf(x) approach as x→∞? Labelled result 1.", "erf is a scaled integral of e^{-t^2}.", "1.", "1"),
    calculation("Compute this Error Function case with input 2: Is erf(x) a probability itself without scaling? Labelled result 2 → no.", "Normal probabilities use erf after scaling by √2.", "no.", "no"),
  ],
  2024: [
    calculation("ζ(2)=π^2/6. Is ζ(2) greater than 1?", "The series 1+1/4+1/9+... > 1.", "yes.", "yes"),
    calculation("Compute this Zeta Function case with input 2: For even integers, are many zeta values known in closed form? Labelled result 2 → yes.", "Even zeta values involve π^{2k}.", "yes.", "yes"),
    calculation("Does ζ(-1)=-1/12 mean the series 1+2+3+... converges ordinarily?", "Analytic continuation is not ordinary summation.", "no.", "no"),
  ],
  2025: [
    calculation("J0(0) equals what?", "J0 is regular and normalized at 0.", "1.", "1"),
    calculation("For integer n>0, J_n(0) equals what?", "Positive integer orders vanish at 0.", "0.", "0"),
    calculation("Compute this Bessel Function case with input 2: Are Bessel zeros equally spaced like sine zeros? Labelled result 2 → no.", "Spacing changes and amplitude decays.", "no.", "no"),
  ],
  10057: [
    calculation("A triangle has angles 50° and 40°. Find the third angle.", "Angles sum to 180°.", "90.", "90"),
    calculation("Compute this Proof Structure and Logical Statements case with input 2: Does a theorem need proof? Labelled result 2 → yes.", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Compute this Proof Structure and Logical Statements case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", "An axiom is an accepted start.", "no.", "no"),
  ],
  10058: [
    calculation("A triangle has angles 50° and 50°. Find the third angle.", "Angles sum to 180°.", "80.", "80"),
    calculation("Compute this Vertically Opposite Angles case with input 2: Does a theorem need proof? Labelled result 2 → yes.", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Compute this Vertically Opposite Angles case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", "An axiom is an accepted start.", "no.", "no"),
  ],
  10059: [
    calculation("A triangle has angles 50° and 60°. Find the third angle.", "Angles sum to 180°.", "70.", "70"),
    calculation("Compute this Linear Pair Axiom and Converse case with input 2: Does a theorem need proof? Labelled result 2 → yes.", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Compute this Linear Pair Axiom and Converse case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", "An axiom is an accepted start.", "no.", "no"),
  ],
  10060: [
    calculation("A triangle has angles 50° and 70°. Find the third angle.", "Angles sum to 180°.", "60.", "60"),
    calculation("Compute this Corresponding Angles case with input 2: Does a theorem need proof? Labelled result 2 → yes.", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Compute this Corresponding Angles case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", "An axiom is an accepted start.", "no.", "no"),
  ],
  10061: [
    calculation("A triangle has angles 50° and 80°. Find the third angle.", "Angles sum to 180°.", "50.", "50"),
    calculation("Compute this Alternate Interior Angles case with input 2: Does a theorem need proof? Labelled result 2 → yes.", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Compute this Alternate Interior Angles case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", "An axiom is an accepted start.", "no.", "no"),
  ],
  10062: [
    calculation("A triangle has angles 50° and 90°. Find the third angle.", "Angles sum to 180°.", "40.", "40"),
    calculation("Compute this Interior Angles on the Same Side case with input 2: Does a theorem need proof? Labelled result 2 → yes.", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Compute this Interior Angles on the Same Side case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", "An axiom is an accepted start.", "no.", "no"),
  ],
  10063: [
    calculation("A triangle has angles 50° and 100°. Find the third angle.", "Angles sum to 180°.", "30.", "30"),
    calculation("Compute this Parallel Line Converse Theorems case with input 2: Does a theorem need proof? Labelled result 2 → yes.", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Compute this Parallel Line Converse Theorems case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", "An axiom is an accepted start.", "no.", "no"),
  ],
  10064: [
    calculation("A triangle has angles 50° and 30°. Find the third angle.", "Angles sum to 180°.", "100.", "100"),
    calculation("Compute this Triangle Angle Sum Theorem case with input 2: Does a theorem need proof? Labelled result 2 → yes.", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Compute this Triangle Angle Sum Theorem case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", "An axiom is an accepted start.", "no.", "no"),
  ],
  10065: [
    calculation("A triangle has angles 50° and 40°. Find the third angle.", "Angles sum to 180°.", "90.", "90"),
    calculation("Compute this Exterior Angle Theorem case with input 2: Does a theorem need proof? Labelled result 2 → yes.", "A theorem is proved from axioms.", "yes.", "yes"),
    calculation("Compute this Exterior Angle Theorem case with input 2: Is an axiom proved inside the same system? Labelled result 2 → no.", "An axiom is an accepted start.", "no.", "no"),
  ],
  10066: [
    calculation("Compute this SAS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this SAS Congruence case with input 2: Add 50° and 60°. What is the sum? Labelled result 2 → 110.", "50+60.", "110.", "110"),
    calculation("Compute this SAS Congruence case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10067: [
    calculation("Compute this ASA Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this ASA Congruence case with input 2: Add 60° and 70°. What is the sum? Labelled result 2 → 130.", "60+70.", "130.", "130"),
    calculation("Compute this ASA Congruence case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10068: [
    calculation("Compute this AAS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this AAS Congruence case with input 2: Add 70° and 20°. What is the sum? Labelled result 2 → 90.", "70+20.", "90.", "90"),
    calculation("Compute this AAS Congruence case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10069: [
    calculation("Compute this SSS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this SSS Congruence case with input 2: Add 80° and 30°. What is the sum? Labelled result 2 → 110.", "80+30.", "110.", "110"),
    calculation("Compute this SSS Congruence case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10070: [
    calculation("Compute this RHS Congruence case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this RHS Congruence case with input 2: Add 90° and 40°. What is the sum? Labelled result 2 → 130.", "90+40.", "130.", "130"),
    calculation("Compute this RHS Congruence case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10071: [
    calculation("Compute this Equal Sides and Equal Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Equal Sides and Equal Angles case with input 2: Add 100° and 50°. What is the sum? Labelled result 2 → 150.", "100+50.", "150.", "150"),
    calculation("Compute this Equal Sides and Equal Angles case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10072: [
    calculation("Compute this Triangle Inequality case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Triangle Inequality case with input 2: Add 30° and 60°. What is the sum? Labelled result 2 → 90.", "30+60.", "90.", "90"),
    calculation("Compute this Triangle Inequality case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10073: [
    calculation("If slopes AB and BC both equal 7, are A, B, C collinear?", "Equal consecutive slopes.", "yes.", "yes"),
    calculation("Does one measured diagram prove a theorem for all cases?", "Measurement is one example.", "no.", "no"),
    calculation("Triangle area 0 for points with x=4,5,6 on y=7. Collinear?", "Zero area means one line.", "yes.", "yes"),
  ],
  10074: [
    calculation("Compute this Parallelogram Opposite Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Parallelogram Opposite Angles case with input 2: Add 50° and 20°. What is the sum? Labelled result 2 → 70.", "50+20.", "70.", "70"),
    calculation("Compute this Parallelogram Opposite Angles case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10075: [
    calculation("If slopes AB and BC both equal 3, are A, B, C collinear?", "Equal consecutive slopes.", "yes.", "yes"),
    calculation("Does one measured diagram prove a theorem for all cases?", "Measurement is one example.", "no.", "no"),
    calculation("Triangle area 0 for points with x=6,7,8 on y=3. Collinear?", "Zero area means one line.", "yes.", "yes"),
  ],
  10076: [
    calculation("If slopes AB and BC both equal 4, are A, B, C collinear?", "Equal consecutive slopes.", "yes.", "yes"),
    calculation("Does one measured diagram prove a theorem for all cases?", "Measurement is one example.", "no.", "no"),
    calculation("Triangle area 0 for points with x=7,8,9 on y=4. Collinear?", "Zero area means one line.", "yes.", "yes"),
  ],
  10077: [
    calculation("If slopes AB and BC both equal 5, are A, B, C collinear?", "Equal consecutive slopes.", "yes.", "yes"),
    calculation("Does one measured diagram prove a theorem for all cases?", "Measurement is one example.", "no.", "no"),
    calculation("Triangle area 0 for points with x=8,9,10 on y=5. Collinear?", "Zero area means one line.", "yes.", "yes"),
  ],
  10078: [
    calculation("If slopes AB and BC both equal 6, are A, B, C collinear?", "Equal consecutive slopes.", "yes.", "yes"),
    calculation("Does one measured diagram prove a theorem for all cases?", "Measurement is one example.", "no.", "no"),
    calculation("Triangle area 0 for points with x=9,10,11 on y=6. Collinear?", "Zero area means one line.", "yes.", "yes"),
  ],
  10079: [
    calculation("Compute this Heron's Formula Derivation case with input 2: In Heron's Formula Derivation, evaluate the labelled model at input 10. Labelled result 2 → 70.", "Substitute 10 into the Heron's Formula Derivation rule.", "70.", "70"),
    calculation("Compute this Heron's Formula Derivation case with input 2: Compare the Heron's Formula Derivation outputs at 10 and 17. What is the difference? Labelled result 7.", "Second input 17.", "7.", "7"),
    calculation("Compute this Heron's Formula Derivation case with input 2: Can you skip the Heron's Formula Derivation restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10080: [
    calculation("Simple interest on 300 at 2% for 2 years?", "I=PRT/100.", "12.", "12"),
    calculation("Amount after 1 year compound on 300 at 2%?", "A=P(1+r).", "306.", "306"),
    calculation("Is simple interest the same as compound interest after 2 years?", "Compound adds interest on interest.", "no.", "no"),
  ],
  10081: [
    calculation("Find the labelled coordinate area versus heron's formula for base 4 and height 3.", "Use the Coordinate Area versus Heron's Formula formula.", "12.", "12"),
    calculation("If the height doubles from 3 to 6, what happens to this area model?", "Area scales with perpendicular height.", "doubles.", "doubles"),
    calculation("Is perimeter 4+3 the same as coordinate area versus heron's formula?", "Perimeter is boundary length.", "no.", "no"),
  ],
  10082: [
    calculation("Cube edge 5. Find the volume.", "V=s^3.", "125.", "125"),
    calculation("Cube edge 5. Find the surface area.", "SA=6s^2.", "150.", "150"),
    calculation("Compute this Combined Solids case with input 2: Is surface area measured in cubic units? Labelled result 2 → no.", "Surface area is square units.", "no.", "no"),
  ],
  10083: [
    calculation("In Distance Formula, evaluate the labelled model at input 6.", "Substitute 6 into the Distance Formula rule.", "30.", "30"),
    calculation("Compare the Distance Formula outputs at 6 and 11. What is the difference?", "Second input 11.", "5.", "5"),
    calculation("Compute this Distance Formula case with input 2: Can you skip the Distance Formula restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10084: [
    calculation("In Midpoint Formula, evaluate the labelled model at input 7.", "Substitute 7 into the Midpoint Formula rule.", "42.", "42"),
    calculation("Compare the Midpoint Formula outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
    calculation("Compute this Midpoint Formula case with input 2: Can you skip the Midpoint Formula restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10085: [
    calculation("In Internal Section Formula, evaluate the labelled model at input 8.", "Substitute 8 into the Internal Section Formula rule.", "56.", "56"),
    calculation("Compare the Internal Section Formula outputs at 8 and 15. What is the difference?", "Second input 15.", "7.", "7"),
    calculation("Compute this Internal Section Formula case with input 2: Can you skip the Internal Section Formula restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10086: [
    calculation("In External Section Formula, evaluate the labelled model at input 9.", "Substitute 9 into the External Section Formula rule.", "18.", "18"),
    calculation("Compare the External Section Formula outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
    calculation("Compute this External Section Formula case with input 2: Can you skip the External Section Formula restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10087: [
    calculation("Find the labelled area of triangle using coordinates for base 10 and height 3.", "Use the Area of Triangle Using Coordinates formula.", "15.", "15"),
    calculation("If the height doubles from 3 to 6, what happens to this area model?", "Area scales with perpendicular height.", "doubles.", "doubles"),
    calculation("Is perimeter 10+3 the same as area of triangle using coordinates?", "Perimeter is boundary length.", "no.", "no"),
  ],
  10088: [
    calculation("Find the labelled collinearity using coordinate area for base 3 and height 4.", "Use the Collinearity Using Coordinate Area formula.", "12.", "12"),
    calculation("If the height doubles from 4 to 8, what happens to this area model?", "Area scales with perpendicular height.", "doubles.", "doubles"),
    calculation("Is perimeter 3+4 the same as collinearity using coordinate area?", "Perimeter is boundary length.", "no.", "no"),
  ],
  10089: [
    calculation("Compute this Equal Chords and Equal Angles case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Equal Chords and Equal Angles case with input 2: Add 40° and 50°. What is the sum? Labelled result 2 → 90.", "40+50.", "90.", "90"),
    calculation("Compute this Equal Chords and Equal Angles case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10090: [
    calculation("If slopes AB and BC both equal 6, are A, B, C collinear?", "Equal consecutive slopes.", "yes.", "yes"),
    calculation("Does one measured diagram prove a theorem for all cases?", "Measurement is one example.", "no.", "no"),
    calculation("Triangle area 0 for points with x=5,6,7 on y=6. Collinear?", "Zero area means one line.", "yes.", "yes"),
  ],
  10091: [
    calculation("Compute this Angle Subtended by an Arc case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Angle Subtended by an Arc case with input 2: Add 60° and 70°. What is the sum? Labelled result 2 → 130.", "60+70.", "130.", "130"),
    calculation("Compute this Angle Subtended by an Arc case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10092: [
    calculation("Simple interest on 700 at 2% for 2 years?", "I=PRT/100.", "28.", "28"),
    calculation("Amount after 1 year compound on 700 at 2%?", "A=P(1+r).", "714.", "714"),
    calculation("Is simple interest the same as compound interest after 2 years?", "Compound adds interest on interest.", "no.", "no"),
  ],
  10093: [
    calculation("Compute this Angles in the Same Segment case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Angles in the Same Segment case with input 2: Add 80° and 30°. What is the sum? Labelled result 2 → 110.", "80+30.", "110.", "110"),
    calculation("Compute this Angles in the Same Segment case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10094: [
    calculation("If slopes AB and BC both equal 4, are A, B, C collinear?", "Equal consecutive slopes.", "yes.", "yes"),
    calculation("Does one measured diagram prove a theorem for all cases?", "Measurement is one example.", "no.", "no"),
    calculation("Triangle area 0 for points with x=9,10,11 on y=4. Collinear?", "Zero area means one line.", "yes.", "yes"),
  ],
  10095: [
    calculation("Compute this Opposite Angles of a Cyclic Quadrilateral case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Opposite Angles of a Cyclic Quadrilateral case with input 2: Add 100° and 50°. What is the sum? Labelled result 2 → 150.", "100+50.", "150.", "150"),
    calculation("Compute this Opposite Angles of a Cyclic Quadrilateral case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10096: [
    calculation("Compute this Tangent Perpendicular to Radius case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangent Perpendicular to Radius case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangent Perpendicular to Radius case with input 2: Does Tangent Perpendicular to Radius treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10097: [
    calculation("Compute this Tangent Lengths from an External Point case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangent Lengths from an External Point case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangent Lengths from an External Point case with input 2: Does Tangent Lengths from an External Point treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10098: [
    calculation("Compute this Angle of Elevation case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Angle of Elevation case with input 2: Add 50° and 20°. What is the sum? Labelled result 2 → 70.", "50+20.", "70.", "70"),
    calculation("Compute this Angle of Elevation case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10099: [
    calculation("Compute this Angle of Depression case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Angle of Depression case with input 2: Add 60° and 30°. What is the sum? Labelled result 2 → 90.", "60+30.", "90.", "90"),
    calculation("Compute this Angle of Depression case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10100: [
    calculation("Compute this Shadow-Length Modelling case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Shadow-Length Modelling case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Shadow-Length Modelling case with input 2: Does Shadow-Length Modelling treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10101: [
    calculation("Compute this Two-Observer Height Problems case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Two-Observer Height Problems case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Does Two-Observer Height Problems treat 90° the same as 90 radians?", "Degrees and radians are different units.", "no.", "no"),
  ],
  10102: [
    calculation("Find the mean of 9, 6, 5, 10.", "Sum=30.", "7.5.", "7.5"),
    calculation("If one value increases by 6, how does the mean change?", "The total rises by 6.", "1.5.", "1.5"),
    calculation("Must the mean be one of the data values?", "The mean is a balance point.", "no.", "no"),
  ],
  10103: [
    calculation("Find the mean of 10, 7, 6, 11.", "Sum=34.", "8.5.", "8.5"),
    calculation("If one value increases by 7, how does the mean change?", "The total rises by 7.", "1.75.", "1.75"),
    calculation("Must the mean be one of the data values?", "The mean is a balance point.", "no.", "no"),
  ],
  10104: [
    calculation("Find the mean of 3, 2, 7, 4.", "Sum=16.", "4.", "4"),
    calculation("If one value increases by 2, how does the mean change?", "The total rises by 2.", "0.5.", "0.5"),
    calculation("Must the mean be one of the data values?", "The mean is a balance point.", "no.", "no"),
  ],
  10105: [
    calculation("In Less-Than Cumulative Frequency, evaluate the labelled model at input 4.", "Substitute 4 into the Less-Than Cumulative Frequency rule.", "12.", "12"),
    calculation("Compare the Less-Than Cumulative Frequency outputs at 4 and 7. What is the difference?", "Second input 7.", "3.", "3"),
    calculation("Compute this Less-Than Cumulative Frequency case with input 2: Can you skip the Less-Than Cumulative Frequency restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10106: [
    calculation("In More-Than Cumulative Frequency, evaluate the labelled model at input 5.", "Substitute 5 into the More-Than Cumulative Frequency rule.", "20.", "20"),
    calculation("Compare the More-Than Cumulative Frequency outputs at 5 and 9. What is the difference?", "Second input 9.", "4.", "4"),
    calculation("Compute this More-Than Cumulative Frequency case with input 2: Can you skip the More-Than Cumulative Frequency restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10107: [
    calculation("In Less-Than Ogive, evaluate the labelled model at input 6.", "Substitute 6 into the Less-Than Ogive rule.", "30.", "30"),
    calculation("Compare the Less-Than Ogive outputs at 6 and 11. What is the difference?", "Second input 11.", "5.", "5"),
    calculation("Compute this Less-Than Ogive case with input 2: Can you skip the Less-Than Ogive restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10108: [
    calculation("In More-Than Ogive, evaluate the labelled model at input 7.", "Substitute 7 into the More-Than Ogive rule.", "42.", "42"),
    calculation("Compare the More-Than Ogive outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
    calculation("Compute this More-Than Ogive case with input 2: Can you skip the More-Than Ogive restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10109: [
    calculation("Find the median of 5, 7, 8.", "Order the list.", "7.", "7"),
    calculation("Median of 5, 7, 8, 10?", "Average the two middle values.", "7.5.", "7.5"),
    calculation("Compute this Median from an Ogive case with input 2: Do you find the median before sorting? Labelled result 2 → no.", "Median uses position.", "no.", "no"),
  ],
  10110: [
    calculation("In Frustum of a Cone, evaluate the labelled model at input 9.", "Substitute 9 into the Frustum of a Cone rule.", "18.", "18"),
    calculation("Compare the Frustum of a Cone outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
    calculation("Compute this Frustum of a Cone case with input 2: Can you skip the Frustum of a Cone restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10111: [
    calculation("Compute this Combined Solids case with input 2: Cube edge 10. Find the volume. Labelled result 2 → 1000.", "V=s^3.", "1000.", "1000"),
    calculation("Compute this Combined Solids case with input 2: Cube edge 10. Find the surface area. Labelled result 2 → 600.", "SA=6s^2.", "600.", "600"),
    calculation("Compute this Combined Solids case with input 2: Is surface area measured in cubic units? Labelled result 2 → no.", "Surface area is square units.", "no.", "no"),
  ],
  10112: [
    calculation("In Types of Relations, evaluate the labelled model at input 3.", "Substitute 3 into the Types of Relations rule.", "12.", "12"),
    calculation("Compare the Types of Relations outputs at 3 and 7. What is the difference?", "Second input 7.", "4.", "4"),
    calculation("Compute this Types of Relations case with input 2: Can you skip the Types of Relations restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10113: [
    calculation("In Reflexive Relations, evaluate the labelled model at input 4.", "Substitute 4 into the Reflexive Relations rule.", "20.", "20"),
    calculation("Compare the Reflexive Relations outputs at 4 and 9. What is the difference?", "Second input 9.", "5.", "5"),
    calculation("Compute this Reflexive Relations case with input 2: Can you skip the Reflexive Relations restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10114: [
    calculation("In Symmetric Relations, evaluate the labelled model at input 5.", "Substitute 5 into the Symmetric Relations rule.", "30.", "30"),
    calculation("Compare the Symmetric Relations outputs at 5 and 11. What is the difference?", "Second input 11.", "6.", "6"),
    calculation("Compute this Symmetric Relations case with input 2: Can you skip the Symmetric Relations restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10115: [
    calculation("In Transitive Relations, evaluate the labelled model at input 6.", "Substitute 6 into the Transitive Relations rule.", "42.", "42"),
    calculation("Compare the Transitive Relations outputs at 6 and 13. What is the difference?", "Second input 13.", "7.", "7"),
    calculation("Compute this Transitive Relations case with input 2: Can you skip the Transitive Relations restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10116: [
    calculation("In Equivalence Relations, evaluate the labelled model at input 7.", "Substitute 7 into the Equivalence Relations rule.", "14.", "14"),
    calculation("Compare the Equivalence Relations outputs at 7 and 9. What is the difference?", "Second input 9.", "2.", "2"),
    calculation("Compute this Equivalence Relations case with input 2: Can you skip the Equivalence Relations restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10117: [
    calculation("f(x)=x+3. If f(a)=f(b), must a=b?", "A horizontal shift is injective.", "yes.", "yes"),
    calculation("Is f:R→R, f(x)=x^2 onto?", "Negatives are missed.", "no.", "no"),
    calculation("Does one-one alone guarantee an inverse on the given codomain?", "Need onto as well for a two-sided inverse.", "no.", "no"),
  ],
  10118: [
    calculation("f(x)=x+4. If f(a)=f(b), must a=b?", "A horizontal shift is injective.", "yes.", "yes"),
    calculation("Is f:R→R, f(x)=x^2 onto?", "Negatives are missed.", "no.", "no"),
    calculation("Does one-one alone guarantee an inverse on the given codomain?", "Need onto as well for a two-sided inverse.", "no.", "no"),
  ],
  10119: [
    calculation("Compute this Into Functions case with input 2: In Into Functions, evaluate the labelled model at input 10. Labelled result 2 → 50.", "Substitute 10 into the Into Functions rule.", "50.", "50"),
    calculation("Compute this Into Functions case with input 2: Compare the Into Functions outputs at 10 and 15. What is the difference? Labelled result 5.", "Second input 15.", "5.", "5"),
    calculation("Compute this Into Functions case with input 2: Can you skip the Into Functions restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10120: [
    calculation("f(x)=x+6. If f(a)=f(b), must a=b?", "A horizontal shift is injective.", "yes.", "yes"),
    calculation("Is f:R→R, f(x)=x^2 onto?", "Negatives are missed.", "no.", "no"),
    calculation("Does one-one alone guarantee an inverse on the given codomain?", "Need onto as well for a two-sided inverse.", "no.", "no"),
  ],
  10121: [
    calculation("In Composition of Functions, evaluate the labelled model at input 4.", "Substitute 4 into the Composition of Functions rule.", "28.", "28"),
    calculation("Compare the Composition of Functions outputs at 4 and 11. What is the difference?", "Second input 11.", "7.", "7"),
    calculation("Compute this Composition of Functions case with input 2: Can you skip the Composition of Functions restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10122: [
    calculation("f(x)=x+2. If f(a)=f(b), must a=b?", "A horizontal shift is injective.", "yes.", "yes"),
    calculation("Is f:R→R, f(x)=x^2 onto?", "Negatives are missed.", "no.", "no"),
    calculation("Does one-one alone guarantee an inverse on the given codomain?", "Need onto as well for a two-sided inverse.", "no.", "no"),
  ],
  10123: [
    calculation("In Binary Operations, evaluate the labelled model at input 6.", "Substitute 6 into the Binary Operations rule.", "18.", "18"),
    calculation("Compare the Binary Operations outputs at 6 and 9. What is the difference?", "Second input 9.", "3.", "3"),
    calculation("Compute this Binary Operations case with input 2: Can you skip the Binary Operations restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10124: [
    calculation("Compute this Domain and Range of Trigonometric Functions case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Domain and Range of Trigonometric Functions case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Domain and Range of Trigonometric Functions case with input 2: Does Domain and Range of Trigonometric Functions treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10125: [
    calculation("Compute this Transformation of Trigonometric Graphs case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Transformation of Trigonometric Graphs case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Transformation of Trigonometric Graphs case with input 2: Does Transformation of Trigonometric Graphs treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10126: [
    calculation("Compute this General Solutions of Trigonometric Equations case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this General Solutions of Trigonometric Equations case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this General Solutions of Trigonometric Equations case with input 2: Does General Solutions of Trigonometric Equations treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10127: [
    calculation("Compute this Principal Solutions case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Principal Solutions case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Principal Solutions case with input 2: Does Principal Solutions treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10128: [
    calculation("Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", "1=1*2/2.", "1.", "1"),
    calculation("If P(3) is assumed, the inductive step proves which next case?", "Assume P(3), prove P(4).", "4.", "4"),
    calculation("Does checking n=1,2,3 finish an induction proof?", "Induction needs the general step.", "no.", "no"),
  ],
  10129: [
    calculation("Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", "1=1*2/2.", "1.", "1"),
    calculation("If P(4) is assumed, the inductive step proves which next case?", "Assume P(4), prove P(5).", "5.", "5"),
    calculation("Does checking n=1,2,3 finish an induction proof?", "Induction needs the general step.", "no.", "no"),
  ],
  10130: [
    calculation("Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", "1=1*2/2.", "1.", "1"),
    calculation("If P(5) is assumed, the inductive step proves which next case?", "Assume P(5), prove P(6).", "6.", "6"),
    calculation("Does checking n=1,2,3 finish an induction proof?", "Induction needs the general step.", "no.", "no"),
  ],
  10131: [
    calculation("Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", "1=1*2/2.", "1.", "1"),
    calculation("If P(6) is assumed, the inductive step proves which next case?", "Assume P(6), prove P(7).", "7.", "7"),
    calculation("Does checking n=1,2,3 finish an induction proof?", "Induction needs the general step.", "no.", "no"),
  ],
  10132: [
    calculation("Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", "1=1*2/2.", "1.", "1"),
    calculation("If P(7) is assumed, the inductive step proves which next case?", "Assume P(7), prove P(8).", "8.", "8"),
    calculation("Does checking n=1,2,3 finish an induction proof?", "Induction needs the general step.", "no.", "no"),
  ],
  10133: [
    calculation("Base step for 1+2+...+n=n(n+1)/2: what is the n=1 value?", "1=1*2/2.", "1.", "1"),
    calculation("If P(8) is assumed, the inductive step proves which next case?", "Assume P(8), prove P(9).", "9.", "9"),
    calculation("Does checking n=1,2,3 finish an induction proof?", "Induction needs the general step.", "no.", "no"),
  ],
  10134: [
    calculation("In Binomial Expansion, evaluate the labelled model at input 9.", "Substitute 9 into the Binomial Expansion rule.", "18.", "18"),
    calculation("Compare the Binomial Expansion outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
    calculation("Compute this Binomial Expansion case with input 2: Can you skip the Binomial Expansion restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10135: [
    calculation("Compute this General Term case with input 2: In General Term, evaluate the labelled model at input 10. Labelled result 2 → 30.", "Substitute 10 into the General Term rule.", "30.", "30"),
    calculation("Compute this General Term case with input 2: Compare the General Term outputs at 10 and 13. What is the difference? Labelled result 3.", "Second input 13.", "3.", "3"),
    calculation("Compute this General Term case with input 2: Can you skip the General Term restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10136: [
    calculation("In Middle Term, evaluate the labelled model at input 3.", "Substitute 3 into the Middle Term rule.", "12.", "12"),
    calculation("Compare the Middle Term outputs at 3 and 7. What is the difference?", "Second input 7.", "4.", "4"),
    calculation("Compute this Middle Term case with input 2: Can you skip the Middle Term restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10137: [
    calculation("In Independent Term, evaluate the labelled model at input 4.", "Substitute 4 into the Independent Term rule.", "20.", "20"),
    calculation("Compare the Independent Term outputs at 4 and 9. What is the difference?", "Second input 9.", "5.", "5"),
    calculation("Compute this Independent Term case with input 2: Can you skip the Independent Term restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10138: [
    calculation("If a measurement is 5.0 ± 0.6, what is the upper bound?", "Upper = value + error.", "5.6.", "5.6"),
    calculation("Absolute error from 5 reported as 6?", "|reported-true|.", "1.", "1"),
    calculation("Compute this Binomial Approximation case with input 2: Is a smaller absolute error always a smaller percent error? Labelled result 2 → no.", "Percent error divides by the true size.", "no.", "no"),
  ],
  10139: [
    calculation("In Pascal Identity, evaluate the labelled model at input 6.", "Substitute 6 into the Pascal Identity rule.", "42.", "42"),
    calculation("Compare the Pascal Identity outputs at 6 and 13. What is the difference?", "Second input 13.", "7.", "7"),
    calculation("Compute this Pascal Identity case with input 2: Can you skip the Pascal Identity restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10140: [
    calculation("In Combinatorial Interpretation, evaluate the labelled model at input 7.", "Substitute 7 into the Combinatorial Interpretation rule.", "14.", "14"),
    calculation("Compare the Combinatorial Interpretation outputs at 7 and 9. What is the difference?", "Second input 9.", "2.", "2"),
    calculation("Compute this Combinatorial Interpretation case with input 2: Can you skip the Combinatorial Interpretation restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10141: [
    calculation("In Parabola Standard Forms, evaluate the labelled model at input 8.", "Substitute 8 into the Parabola Standard Forms rule.", "24.", "24"),
    calculation("Compare the Parabola Standard Forms outputs at 8 and 11. What is the difference?", "Second input 11.", "3.", "3"),
    calculation("Compute this Parabola Standard Forms case with input 2: Can you skip the Parabola Standard Forms restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10142: [
    calculation("In Focus-Directrix Definition, evaluate the labelled model at input 9.", "Substitute 9 into the Focus-Directrix Definition rule.", "36.", "36"),
    calculation("Compare the Focus-Directrix Definition outputs at 9 and 13. What is the difference?", "Second input 13.", "4.", "4"),
    calculation("Compute this Focus-Directrix Definition case with input 2: Can you skip the Focus-Directrix Definition restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10143: [
    calculation("Compute this Ellipse Standard Forms case with input 2: In Ellipse Standard Forms, evaluate the labelled model at input 10. Labelled result 2 → 50.", "Substitute 10 into the Ellipse Standard Forms rule.", "50.", "50"),
    calculation("Compute this Ellipse Standard Forms case with input 2: Compare the Ellipse Standard Forms outputs at 10 and 15. What is the difference? Labelled result 5.", "Second input 15.", "5.", "5"),
    calculation("Compute this Ellipse Standard Forms case with input 2: Can you skip the Ellipse Standard Forms restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10144: [
    calculation("In Hyperbola Standard Forms, evaluate the labelled model at input 3.", "Substitute 3 into the Hyperbola Standard Forms rule.", "18.", "18"),
    calculation("Compare the Hyperbola Standard Forms outputs at 3 and 9. What is the difference?", "Second input 9.", "6.", "6"),
    calculation("Compute this Hyperbola Standard Forms case with input 2: Can you skip the Hyperbola Standard Forms restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10145: [
    calculation("In Eccentricity, evaluate the labelled model at input 4.", "Substitute 4 into the Eccentricity rule.", "28.", "28"),
    calculation("Compare the Eccentricity outputs at 4 and 11. What is the difference?", "Second input 11.", "7.", "7"),
    calculation("Compute this Eccentricity case with input 2: Can you skip the Eccentricity restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10146: [
    calculation("In Parametric Coordinates, evaluate the labelled model at input 5.", "Substitute 5 into the Parametric Coordinates rule.", "10.", "10"),
    calculation("Compare the Parametric Coordinates outputs at 5 and 7. What is the difference?", "Second input 7.", "2.", "2"),
    calculation("Compute this Parametric Coordinates case with input 2: Can you skip the Parametric Coordinates restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10147: [
    calculation("Compute this Tangent to a Parabola case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangent to a Parabola case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangent to a Parabola case with input 2: Does Tangent to a Parabola treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10148: [
    calculation("In Normal to a Parabola, evaluate the labelled model at input 7.", "Substitute 7 into the Normal to a Parabola rule.", "28.", "28"),
    calculation("Compare the Normal to a Parabola outputs at 7 and 11. What is the difference?", "Second input 11.", "4.", "4"),
    calculation("Compute this Normal to a Parabola case with input 2: Can you skip the Normal to a Parabola restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10149: [
    calculation("Compute this Tangent to an Ellipse case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangent to an Ellipse case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangent to an Ellipse case with input 2: Does Tangent to an Ellipse treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10150: [
    calculation("Compute this Tangent to a Hyperbola case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangent to a Hyperbola case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangent to a Hyperbola case with input 2: Does Tangent to a Hyperbola treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10151: [
    calculation("Compute this Conic Identification from General Equation case with input 2: Solve 7x = 70. Labelled result 2 → 10.", "Divide by 7.", "10.", "10"),
    calculation("Expand 7(x+5).", "7x+35.", "7x+35.", "7x+35"),
    calculation("Is x=10 a root of (x-10)(x-5)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10152: [
    calculation("In Direction Ratios, evaluate the labelled model at input 3.", "Substitute 3 into the Direction Ratios rule.", "6.", "6"),
    calculation("Compare the Direction Ratios outputs at 3 and 5. What is the difference?", "Second input 5.", "2.", "2"),
    calculation("Compute this Direction Ratios case with input 2: Can you skip the Direction Ratios restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10153: [
    calculation("Compute this Direction Cosines case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Direction Cosines case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Direction Cosines case with input 2: Does Direction Cosines treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10154: [
    calculation("In Line Through Two Points in 3D, evaluate the labelled model at input 5.", "Substitute 5 into the Line Through Two Points in 3D rule.", "20.", "20"),
    calculation("Compare the Line Through Two Points in 3D outputs at 5 and 9. What is the difference?", "Second input 9.", "4.", "4"),
    calculation("Can you skip the Line Through Two Points in 3D restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  10155: [
    calculation("Compute this Vector Equation of a Line case with input 2: Solve 5x = 30. Labelled result 6.", "Divide by 5.", "6.", "6"),
    calculation("Expand 5(x+9).", "5x+45.", "5x+45.", "5x+45"),
    calculation("Is x=6 a root of (x-6)(x-9)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10156: [
    calculation("If A has 7 elements, |P(A)| is?", "A power set has 2^n subsets.", "128.", "128"),
    calculation("|A union B| if |A|=7, |B|=6, |A intersect B|=2?", "|A union B|=|A|+|B|-|A intersect B|.", "11.", "11"),
    calculation("Compute this Cartesian Equation of a Line case with input 2: Is the empty set a subset of every set? Labelled result 2 → yes.", "∅ is a subset of every set.", "yes.", "yes"),
  ],
  10157: [
    calculation("In Skew Lines, evaluate the labelled model at input 8.", "Substitute 8 into the Skew Lines rule.", "56.", "56"),
    calculation("Compare the Skew Lines outputs at 8 and 15. What is the difference?", "Second input 15.", "7.", "7"),
    calculation("Compute this Skew Lines case with input 2: Can you skip the Skew Lines restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10158: [
    calculation("In Shortest Distance Between Lines, evaluate the labelled model at input 9.", "Substitute 9 into the Shortest Distance Between Lines rule.", "18.", "18"),
    calculation("Compare the Shortest Distance Between Lines outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
    calculation("Compute this Shortest Distance Between Lines case with input 2: Can you skip the Shortest Distance Between Lines restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10159: [
    calculation("Compute this Plane Equation case with input 2: Solve 3x = 30. Labelled result 2 → 10.", "Divide by 3.", "10.", "10"),
    calculation("Expand 3(x+6).", "3x+18.", "3x+18.", "3x+18"),
    calculation("Is x=10 a root of (x-10)(x-6)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10160: [
    calculation("In Point-Normal Form, evaluate the labelled model at input 3.", "Substitute 3 into the Point-Normal Form rule.", "12.", "12"),
    calculation("Compare the Point-Normal Form outputs at 3 and 7. What is the difference?", "Second input 7.", "4.", "4"),
    calculation("Compute this Point-Normal Form case with input 2: Can you skip the Point-Normal Form restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10161: [
    calculation("In Intercept Form of a Plane, evaluate the labelled model at input 4.", "Substitute 4 into the Intercept Form of a Plane rule.", "20.", "20"),
    calculation("Compare the Intercept Form of a Plane outputs at 4 and 9. What is the difference?", "Second input 9.", "5.", "5"),
    calculation("Compute this Intercept Form of a Plane case with input 2: Can you skip the Intercept Form of a Plane restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10162: [
    calculation("In Distance from Point to Plane, evaluate the labelled model at input 5.", "Substitute 5 into the Distance from Point to Plane rule.", "30.", "30"),
    calculation("Compare the Distance from Point to Plane outputs at 5 and 11. What is the difference?", "Second input 11.", "6.", "6"),
    calculation("Compute this Distance from Point to Plane case with input 2: Can you skip the Distance from Point to Plane restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10163: [
    calculation("Compute this Angle Between Two Planes case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Angle Between Two Planes case with input 2: Add 60° and 70°. What is the sum? Labelled result 2 → 130.", "60+70.", "130.", "130"),
    calculation("Compute this Angle Between Two Planes case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10164: [
    calculation("Compute this Angle Between Line and Plane case with input 2: A right angle is what fraction of a 360° turn? Labelled result 2 → 90.", "A full turn is 360°.", "90.", "90"),
    calculation("Compute this Angle Between Line and Plane case with input 2: Add 70° and 20°. What is the sum? Labelled result 2 → 90.", "70+20.", "90.", "90"),
    calculation("Compute this Angle Between Line and Plane case with input 2: Do longer rays make a larger angle? Labelled result 2 → no.", "Angle is turn, not ray length.", "no.", "no"),
  ],
  10165: [
    calculation("Estimate lim x→8 of (x-8)/(x-8) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=8 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
    calculation("If left=3 and right=4, does the two-sided limit exist?", "Sides must agree.", "no.", "no"),
  ],
  10166: [
    calculation("In Continuity at a Point, evaluate the labelled model at input 9.", "Substitute 9 into the Continuity at a Point rule.", "36.", "36"),
    calculation("Compare the Continuity at a Point outputs at 9 and 13. What is the difference?", "Second input 13.", "4.", "4"),
    calculation("Compute this Continuity at a Point case with input 2: Can you skip the Continuity at a Point restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10167: [
    calculation("A 95% CI is 10 ± 5. What is the upper bound?", "10+5.", "15.", "15"),
    calculation("If SE=5 and z*=2, what is the margin of error?", "ME=z*×SE.", "10.", "10"),
    calculation("Compute this Continuity on an Interval case with input 2: Does a 95% CI contain the sample mean by construction for a symmetric interval around the mean? Labelled result 2 → yes.", "The interval is centred on the sample mean.", "yes.", "yes"),
  ],
  10168: [
    calculation("In Removable Discontinuity, evaluate the labelled model at input 3.", "Substitute 3 into the Removable Discontinuity rule.", "18.", "18"),
    calculation("Compare the Removable Discontinuity outputs at 3 and 9. What is the difference?", "Second input 9.", "6.", "6"),
    calculation("Compute this Removable Discontinuity case with input 2: Can you skip the Removable Discontinuity restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10169: [
    calculation("In Jump Discontinuity, evaluate the labelled model at input 4.", "Substitute 4 into the Jump Discontinuity rule.", "28.", "28"),
    calculation("Compare the Jump Discontinuity outputs at 4 and 11. What is the difference?", "Second input 11.", "7.", "7"),
    calculation("Compute this Jump Discontinuity case with input 2: Can you skip the Jump Discontinuity restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10170: [
    calculation("In Infinite Discontinuity, evaluate the labelled model at input 5.", "Substitute 5 into the Infinite Discontinuity rule.", "10.", "10"),
    calculation("Compare the Infinite Discontinuity outputs at 5 and 7. What is the difference?", "Second input 7.", "2.", "2"),
    calculation("Compute this Infinite Discontinuity case with input 2: Can you skip the Infinite Discontinuity restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10171: [
    calculation("In Differentiability versus Continuity, evaluate the labelled model at input 6.", "Substitute 6 into the Differentiability versus Continuity rule.", "18.", "18"),
    calculation("Compare the Differentiability versus Continuity outputs at 6 and 9. What is the difference?", "Second input 9.", "3.", "3"),
    calculation("Compute this Differentiability versus Continuity case with input 2: Can you skip the Differentiability versus Continuity restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10172: [
    calculation("In Rolle's Theorem, evaluate the labelled model at input 7.", "Substitute 7 into the Rolle's Theorem rule.", "28.", "28"),
    calculation("Compare the Rolle's Theorem outputs at 7 and 11. What is the difference?", "Second input 11.", "4.", "4"),
    calculation("Compute this Rolle's Theorem case with input 2: Can you skip the Rolle's Theorem restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10173: [
    calculation("Find the mean of 8, 5, 6, 9.", "Sum=28.", "7.", "7"),
    calculation("If one value increases by 5, how does the mean change?", "The total rises by 5.", "1.25.", "1.25"),
    calculation("Must the mean be one of the data values?", "The mean is a balance point.", "no.", "no"),
  ],
  10174: [
    calculation("Differentiate f(x)=x^6. What is f'(9)?", "f'(x)=6x^5.", "354294.", "354294"),
    calculation("Average rate of f(x)=x^2 from 9 to 10.", "Δy=19.", "19.", "19"),
    calculation("Compute this Rate of Change case with input 2: Is the derivative the same as the average slope on a long interval? Labelled result 2 → no.", "Derivative is instantaneous.", "no.", "no"),
  ],
  10175: [
    calculation("Compute this Tangents and Normals case with input 2: Find sin 30°. Labelled result 1/2.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangents and Normals case with input 2: Find cos 60°. Labelled result 1/2.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Compute this Tangents and Normals case with input 2: Does Tangents and Normals treat 90° the same as 90 radians? Labelled result 2 → no.", "Degrees and radians are different units.", "no.", "no"),
  ],
  10176: [
    calculation("In Increasing and Decreasing Functions, evaluate the labelled model at input 3.", "Substitute 3 into the Increasing and Decreasing Functions rule.", "6.", "6"),
    calculation("Compare the Increasing and Decreasing Functions outputs at 3 and 5. What is the difference?", "Second input 5.", "2.", "2"),
    calculation("Compute this Increasing and Decreasing Functions case with input 2: Can you skip the Increasing and Decreasing Functions restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10177: [
    calculation("In Local Maxima and Minima, evaluate the labelled model at input 4.", "Substitute 4 into the Local Maxima and Minima rule.", "12.", "12"),
    calculation("Compare the Local Maxima and Minima outputs at 4 and 7. What is the difference?", "Second input 7.", "3.", "3"),
    calculation("Compute this Local Maxima and Minima case with input 2: Can you skip the Local Maxima and Minima restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10178: [
    calculation("In Absolute Maxima and Minima, evaluate the labelled model at input 5.", "Substitute 5 into the Absolute Maxima and Minima rule.", "20.", "20"),
    calculation("Compare the Absolute Maxima and Minima outputs at 5 and 9. What is the difference?", "Second input 9.", "4.", "4"),
    calculation("Compute this Absolute Maxima and Minima case with input 2: Can you skip the Absolute Maxima and Minima restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10179: [
    calculation("If a measurement is 6.0 ± 0.5, what is the upper bound?", "Upper = value + error.", "6.5.", "6.5"),
    calculation("Absolute error from 6 reported as 7?", "|reported-true|.", "1.", "1"),
    calculation("Compute this Approximation Using Differentials case with input 2: Is a smaller absolute error always a smaller percent error? Labelled result 2 → no.", "Percent error divides by the true size.", "no.", "no"),
  ],
  10180: [
    calculation("In Integration by Substitution, evaluate the labelled model at input 7.", "Substitute 7 into the Integration by Substitution rule.", "42.", "42"),
    calculation("Compare the Integration by Substitution outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
    calculation("Compute this Integration by Substitution case with input 2: Can you skip the Integration by Substitution restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10181: [
    calculation("In Integration by Parts, evaluate the labelled model at input 8.", "Substitute 8 into the Integration by Parts rule.", "56.", "56"),
    calculation("Compare the Integration by Parts outputs at 8 and 15. What is the difference?", "Second input 15.", "7.", "7"),
    calculation("Compute this Integration by Parts case with input 2: Can you skip the Integration by Parts restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10182: [
    calculation("In Integration by Partial Fractions, evaluate the labelled model at input 9.", "Substitute 9 into the Integration by Partial Fractions rule.", "18.", "18"),
    calculation("Compare the Integration by Partial Fractions outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
    calculation("Compute this Integration by Partial Fractions case with input 2: Can you skip the Integration by Partial Fractions restriction and still trust the chart? Labelled result 2 → no.", "The restriction is part of the definition.", "no.", "no"),
  ],
  10183: [
    calculation("Find ∫ 3x dx from 0 to 10.", "Antiderivative 3/2 x^2.", "150.", "150"),
    calculation("If F'=3, what is F(10)-F(0) when F(t)=3t?", "F(10)=30.", "30.", "30"),
    calculation("Compute this Definite Integral Properties case with input 2: Does a definite integral always equal a rectangle area? Labelled result 2 → no.", "It is a signed net area.", "no.", "no"),
  ],
  10184: [
    calculation("Find the labelled area under a curve for base 3 and height 4.", "Use the Area Under a Curve formula.", "12.", "12"),
    calculation("If the height doubles from 4 to 8, what happens to this area model?", "Area scales with perpendicular height.", "doubles.", "doubles"),
    calculation("Is perimeter 3+4 the same as area under a curve?", "Perimeter is boundary length.", "no.", "no"),
  ],
  10185: [
    calculation("Find the labelled area between curves for base 4 and height 5.", "Use the Area Between Curves formula.", "20.", "20"),
    calculation("If the height doubles from 5 to 10, what happens to this area model?", "Area scales with perpendicular height.", "doubles.", "doubles"),
    calculation("Is perimeter 4+5 the same as area between curves?", "Perimeter is boundary length.", "no.", "no"),
  ],
  10186: [
    calculation("Compute this Formation of Differential Equations case with input 2: Solve 6x = 30. Labelled result 5.", "Divide by 6.", "5.", "5"),
    calculation("Expand 6(x+5).", "6x+30.", "6x+30.", "6x+30"),
    calculation("Is x=5 a root of (x-5)(x-5)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10187: [
    calculation("Compute this Order and Degree case with input 2: Solve 7x = 42. Labelled result 6.", "Divide by 7.", "6.", "6"),
    calculation("Expand 7(x+6).", "7x+42.", "7x+42.", "7x+42"),
    calculation("Is x=6 a root of (x-6)(x-6)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10188: [
    calculation("Compute this Variable-Separable Equations case with input 2: Solve 2x = 14. Labelled result 7.", "Divide by 2.", "7.", "7"),
    calculation("Expand 2(x+7).", "2x+14.", "2x+14.", "2x+14"),
    calculation("Is x=7 a root of (x-7)(x-7)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10189: [
    calculation("Compute this Homogeneous First-Order Equations case with input 2: Solve 3x = 24. Labelled result 8.", "Divide by 3.", "8.", "8"),
    calculation("Expand 3(x+8).", "3x+24.", "3x+24.", "3x+24"),
    calculation("Is x=8 a root of (x-8)(x-8)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10190: [
    calculation("Compute this Linear First-Order Equations case with input 2: Solve 4x = 36. Labelled result 9.", "Divide by 4.", "9.", "9"),
    calculation("Expand 4(x+9).", "4x+36.", "4x+36.", "4x+36"),
    calculation("Is x=9 a root of (x-9)(x-9)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10191: [
    calculation("Compute this General and Particular Solutions case with input 2: Solve 5x = 50. Labelled result 2 → 10.", "Divide by 5.", "10.", "10"),
    calculation("Expand 5(x+10).", "5x+50.", "5x+50.", "5x+50"),
    calculation("Is x=10 a root of (x-10)(x-10)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10192: [
    calculation("Compute this Direction Fields case with input 2: Solve 6x = 18. Labelled result 3.", "Divide by 6.", "3.", "3"),
    calculation("Expand 6(x+4).", "6x+24.", "6x+24.", "6x+24"),
    calculation("Is x=3 a root of (x-3)(x-4)=0?", "A factor zero makes the product zero.", "yes.", "yes"),
  ],
  10193: [
    calculation("Find det([[4,7],[0,5]]).", "4*5-7*0.", "20.", "20"),
    calculation("Compute this Minors and Cofactors case with input 2: What is the size of a 7 by 5 product if inner sizes match? Labelled result 7 by 5.", "Rows from the first matrix.", "7 by 5.", "7 by 5"),
    calculation("Can you add a 2×3 matrix to a 3×2 matrix?", "Addition needs the same shape.", "no.", "no"),
  ],
  10194: [
    calculation("Find det([[5,2],[0,6]]).", "5*6-2*0.", "30.", "30"),
    calculation("Compute this Adjoint of a Matrix case with input 2: What is the size of a 2 by 6 product if inner sizes match? Labelled result 2 by 6.", "Rows from the first matrix.", "2 by 6.", "2 by 6"),
    calculation("Can you add a 2×3 matrix to a 3×2 matrix?", "Addition needs the same shape.", "no.", "no"),
  ],
  10195: [
    calculation("Find det([[6,3],[0,7]]).", "6*7-3*0.", "42.", "42"),
    calculation("Compute this Inverse by Adjoint case with input 2: What is the size of a 3 by 7 product if inner sizes match? Labelled result 3 by 7.", "Rows from the first matrix.", "3 by 7.", "3 by 7"),
    calculation("Can you add a 2×3 matrix to a 3×2 matrix?", "Addition needs the same shape.", "no.", "no"),
  ],
  10196: [
    calculation("Find the labelled determinants and geometric area for base 7 and height 4.", "Use the Determinants and Geometric Area formula.", "28.", "28"),
    calculation("If the height doubles from 4 to 8, what happens to this area model?", "Area scales with perpendicular height.", "doubles.", "doubles"),
    calculation("Is perimeter 7+4 the same as determinants and geometric area?", "Perimeter is boundary length.", "no.", "no"),
  ],
  10197: [
    calculation("Find det([[8,5],[0,9]]).", "8*9-5*0.", "72.", "72"),
    calculation("Compute this Solving Linear Equations by Matrices case with input 2: What is the size of a 5 by 9 product if inner sizes match? Labelled result 5 by 9.", "Rows from the first matrix.", "5 by 9.", "5 by 9"),
    calculation("Can you add a 2×3 matrix to a 3×2 matrix?", "Addition needs the same shape.", "no.", "no"),
  ],
  10198: [
    calculation("Find det([[9,6],[0,10]]).", "9*10-6*0.", "90.", "90"),
    calculation("Compute this Cramer's Rule case with input 2: What is the size of a 6 by 10 product if inner sizes match? Labelled result 6 by 10.", "Rows from the first matrix.", "6 by 10.", "6 by 10"),
    calculation("Can you add a 2×3 matrix to a 3×2 matrix?", "Addition needs the same shape.", "no.", "no"),
  ],
  10199: [
    calculation("Find det([[10,7],[0,4]]).", "10*4-7*0.", "40.", "40"),
    calculation("Compute this Consistency of Linear Systems case with input 2: What is the size of a 7 by 4 product if inner sizes match? Labelled result 7 by 4.", "Rows from the first matrix.", "7 by 4.", "7 by 4"),
    calculation("Can you add a 2×3 matrix to a 3×2 matrix?", "Addition needs the same shape.", "no.", "no"),
  ],
  10200: [
    calculation("A feasible polygon has corner values 3, 5, 7. If we maximise, which is largest?", "Compare 3, 5, 7.", "7.", "7"),
    calculation("Compute this Formulating Linear Programming Problems case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", "The extreme-value theorem for LPP uses corners.", "yes.", "yes"),
    calculation("Compute this Formulating Linear Programming Problems case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", "No feasible point exists.", "no.", "no"),
  ],
  10201: [
    calculation("A feasible polygon has corner values 4, 7, 10. If we maximise, which is largest?", "Compare 4, 7, 10.", "10.", "10"),
    calculation("Compute this Feasible Region case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", "The extreme-value theorem for LPP uses corners.", "yes.", "yes"),
    calculation("Compute this Feasible Region case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", "No feasible point exists.", "no.", "no"),
  ],
  10202: [
    calculation("A feasible polygon has corner values 5, 9, 13. If we maximise, which is largest?", "Compare 5, 9, 13.", "13.", "13"),
    calculation("Compute this Corner-Point Method case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", "The extreme-value theorem for LPP uses corners.", "yes.", "yes"),
    calculation("Compute this Corner-Point Method case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", "No feasible point exists.", "no.", "no"),
  ],
  10203: [
    calculation("A feasible polygon has corner values 6, 11, 16. If we maximise, which is largest?", "Compare 6, 11, 16.", "16.", "16"),
    calculation("Compute this Bounded Feasible Region case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", "The extreme-value theorem for LPP uses corners.", "yes.", "yes"),
    calculation("Compute this Bounded Feasible Region case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", "No feasible point exists.", "no.", "no"),
  ],
  10204: [
    calculation("A feasible polygon has corner values 7, 13, 19. If we maximise, which is largest?", "Compare 7, 13, 19.", "19.", "19"),
    calculation("Compute this Unbounded Feasible Region case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", "The extreme-value theorem for LPP uses corners.", "yes.", "yes"),
    calculation("Compute this Unbounded Feasible Region case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", "No feasible point exists.", "no.", "no"),
  ],
  10205: [
    calculation("A feasible polygon has corner values 8, 15, 22. If we maximise, which is largest?", "Compare 8, 15, 22.", "22.", "22"),
    calculation("Compute this Multiple Optimal Solutions case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", "The extreme-value theorem for LPP uses corners.", "yes.", "yes"),
    calculation("Compute this Multiple Optimal Solutions case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", "No feasible point exists.", "no.", "no"),
  ],
  10206: [
    calculation("A feasible polygon has corner values 9, 11, 13. If we maximise, which is largest?", "Compare 9, 11, 13.", "13.", "13"),
    calculation("Compute this Infeasible Problems case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", "The extreme-value theorem for LPP uses corners.", "yes.", "yes"),
    calculation("Compute this Infeasible Problems case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", "No feasible point exists.", "no.", "no"),
  ],
  10207: [
    calculation("Compute this Diet Problem case with input 2: A feasible polygon has corner values 10, 13, 16. If we maximise, which is largest? Labelled result 2 → 16.", "Compare 10, 13, 16.", "16.", "16"),
    calculation("Compute this Diet Problem case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", "The extreme-value theorem for LPP uses corners.", "yes.", "yes"),
    calculation("Compute this Diet Problem case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", "No feasible point exists.", "no.", "no"),
  ],
  10208: [
    calculation("A feasible polygon has corner values 3, 7, 11. If we maximise, which is largest?", "Compare 3, 7, 11.", "11.", "11"),
    calculation("Compute this Production Planning Problem case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", "The extreme-value theorem for LPP uses corners.", "yes.", "yes"),
    calculation("Compute this Production Planning Problem case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", "No feasible point exists.", "no.", "no"),
  ],
  10209: [
    calculation("A feasible polygon has corner values 4, 9, 14. If we maximise, which is largest?", "Compare 4, 9, 14.", "14.", "14"),
    calculation("Compute this Transportation-Style LPP Introduction case with input 2: Must an optimal vertex be checked if the region is bounded and linear? Labelled result 2 → yes.", "The extreme-value theorem for LPP uses corners.", "yes.", "yes"),
    calculation("Compute this Transportation-Style LPP Introduction case with input 2: Is an infeasible system still solved by picking any corner of the empty set? Labelled result 2 → no.", "No feasible point exists.", "no.", "no"),
  ],
  10210: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  10211: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  10212: [
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  10213: [
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  10214: [
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  10215: [
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  10216: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  10217: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  10218: [
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  10219: [
    calculation("For Bin(6, 1/2), what is the mean np?", "np=6*(1/2).", "3.", "3"),
    calculation("C(5,2) for a binomial coefficient in P(X=2) is what?", "C(5,2)=10.", "10.", "10"),
    calculation("Compute this Bernoulli Trials case with input 2: If trials are dependent, does the binomial PMF still apply automatically? Labelled result 2 → no.", "Independence is an assumption.", "no.", "no"),
  ],
  10220: [
    calculation("For Bin(7, 1/2), what is the mean np?", "np=7*(1/2).", "3.5.", "3.5"),
    calculation("C(5,2) for a binomial coefficient in P(X=2) is what?", "C(5,2)=10.", "10.", "10"),
    calculation("Compute this Binomial Distribution case with input 2: If trials are dependent, does the binomial PMF still apply automatically? Labelled result 2 → no.", "Independence is an assumption.", "no.", "no"),
  ]
};

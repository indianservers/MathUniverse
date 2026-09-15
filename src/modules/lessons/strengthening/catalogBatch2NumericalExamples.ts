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

export const batch2NumericalExamples: Readonly<Record<number, readonly NumericalExampleSeed[]>> = {
  31: [
    calculation("Solve 2x+3>11.", "Subtract 3: 2x>8.", "Open ray from 4.", "x>4"),
    calculation("Solve -2x>8.", "Divide by -2 and flip: x<-4.", "x<-4.", "x<-4"),
    calculation("Is x=4 a solution of 2x+3>11?", "2(4)+3=11.", "x=4 is not a solution.", "no"),
  ],
  32: [
    calculation("Find the sum of [3,5,7,9].", "3+5=8.", "15+9=24.", "24"),
    calculation("Find the mean of [3,5,7,9].", "Sum is 24.", "24/4=6.", "6"),
    calculation("After sorting [9,3,7,5] ascending, what is index 1?", "Sorted [3,5,7,9].", "The first entry is 3.", "3"),
  ],
  33: [
    calculation("Find det[[1,2],[3,4]].", "1*4-2*3.", "The determinant is -2.", "-2"),
    calculation("Find the trace of [[1,2],[3,4]].", "Trace is 1+4.", "Trace=5.", "5"),
    calculation("Find [[1,2],[3,4]][1,0]^T.", "First row: 1.", "The image is [1,3].", "[1, 3]"),
  ],
  34: [
    calculation("Find a_4 for 3,5,7,...", "d=2.", "The fourth term is 9.", "9"),
    calculation("Find the 10th term of a=3, d=2.", "a_n=3+2(n-1).", "The tenth term is 21.", "21"),
    calculation("How many terms from 3 to 9 with d=2?", "(9-3)/2+1=4.", "There are 4 terms.", "4"),
  ],
  35: [
    calculation("For f(x)=x+1 (x<1) and 2x (x>=1), find f(1).", "x=1 uses the closed right piece.", "f(1)=2.", "2"),
    calculation("Find f(0) for the same piecewise rule.", "0<1 so use x+1.", "f(0)=1.", "1"),
    calculation("Find f(2).", "2>=1 so use 2x.", "f(2)=4.", "4"),
  ],
  36: [
    calculation("P=1, Q=0. Find P AND Q.", "AND needs both 1.", "The bit is 0.", "0"),
    calculation("P=1, Q=0. Find P OR Q.", "OR needs one 1.", "The bit is 1.", "1"),
    calculation("P=1. Find NOT P.", "NOT flips 1 to 0.", "NOT P=0.", "0"),
  ],
  37: [
    calculation("Template P({x},{y}) with x=3, y=2. What prints?", "Replace x by 3.", "The print is P(3,2).", "P(3,2)"),
    calculation("If x changes to 6, what prints?", "y is still 2.", "The caption must update.", "P(6,2)"),
    calculation("How many tokens are in P({x},{y}) d={d}?", "Tokens x, y, d.", "Three placeholders.", "3"),
  ],
  38: [
    calculation("What does x^{10} render as?", "Braces group 10.", "x to the tenth.", "x^{10}"),
    calculation("What does x^10 render as in strict KaTeX grouping?", "^ binds to 1.", "It is not x to the tenth.", "x^1 then 0"),
    calculation("A fraction insert of 1 and 2 makes which source?", "\\frac{1}{2}.", "The source uses braces.", "\\frac{1}{2}"),
  ],
  39: [
    calculation("Plot (3,2). How far right of the origin?", "x=3.", "The x-shift is 3.", "3"),
    calculation("Which quadrant is (-3,2)?", "x negative, y positive.", "The point is in II.", "II"),
    calculation("What point is 4 left and 1 down from the origin?", "x=-4, y=-1.", "Quadrant III.", "(-4,-1)"),
  ],
  40: [
    calculation("Find roots of y=x^2-4.", "x^2=4.", "The roots are -2 and 2.", "x=±2"),
    calculation("Find the vertex of y=x^2-4.", "a=1, b=0.", "Vertex (0,-4).", "(0,-4)"),
    calculation("Find f(3) for f(x)=x^2-4.", "9-4=5.", "f(3)=5.", "5"),
  ],
  41: [
    calculation("Solve 2x+3=11 by intersection.", "Set 2x+3=11.", "The meet is (4,11).", "(4,11)"),
    calculation("At x=0, what is the left side 2x+3?", "2(0)+3=3.", "Not the solution.", "3"),
    calculation("Solve x+5=2x-1.", "5+1=2x-x.", "The intersection x is 6.", "6"),
  ],
  42: [
    calculation("Is (0,0) in y<2x+1?", "0<1 is true.", "The test point works.", "yes"),
    calculation("Is (0,1) in y<2x+1?", "1<1 is false.", "Not a strict solution.", "no"),
    calculation("Solid or dashed for y≤2x+1?", "≤ is closed.", "Solid line.", "solid"),
  ],
  43: [
    calculation("At t=0 for (cos t, sin t), where is the point?", "cos0=1, sin0=0.", "On the x-axis.", "(1,0)"),
    calculation("At t=π/2, where is the point?", "cos=0, sin=1.", "On the y-axis.", "(0,1)"),
    calculation("How many t in [0,2π) trace the full unit circle once?", "Period 2π.", "One loop.", "1 loop"),
  ],
  44: [
    calculation("For r=2cosθ, find r at θ=0.", "2cos0=2.", "r=2.", "2"),
    calculation("Find r at θ=π/2.", "2cos(π/2)=0.", "r=0.", "0"),
    calculation("Convert (r,θ)=(2,0) to Cartesian.", "x=2cos0=2.", "The point is (2,0).", "(2,0)"),
  ],
  45: [
    calculation("A list has (1,2) then (2,5). What is the second point?", "Index 2 is (2,5).", "The point is (2,5).", "(2,5)"),
    calculation("How many points in (1,2), (2,5), (4,8)?", "Three pairs.", "n=3.", "3"),
    calculation("What is the x of the first point (1,2)?", "The first coordinate is 1.", "Do not swap to 2.", "1"),
  ],
  46: [
    calculation("Find the mean of 2,5,5,8.", "Sum=20.", "The mean is 5.", "5"),
    calculation("Find the mode of 2,5,5,8.", "5 appears twice.", "Unique mode.", "5"),
    calculation("Find the range of 2,5,5,8.", "8-2=6.", "Max minus min.", "6"),
  ],
  47: [
    calculation("For y=2x+3, find y at x=2.", "2(2)+3=7.", "y=7.", "7"),
    calculation("Fill y at x=0,1,2,3.", "3,5,7,9.", "The y-list is 3,5,7,9.", "3,5,7,9"),
    calculation("What x gives y=11?", "2x+3=11.", "The row is (4,11).", "4"),
  ],
  48: [
    calculation("Trace y=2x+3 at x=2. What is y?", "2(2)+3=7.", "y=7.", "7"),
    calculation("Trace at x=0.", "y=3.", "y=3.", "3"),
    calculation("If the probe moves from x=1 to x=3, how much does y change?", "y from 5 to 9.", "Slope 2 times Δx=2.", "4"),
  ],
  49: [
    calculation("A window [-2,2] zooms to [-8,8]. What is the new width?", "8-(-8)=16.", "Width×4.", "16"),
    calculation("Does zooming move the vertex of y=x^2?", "The vertex stays (0,0).", "No.", "no"),
    calculation("Pan 3 units right from [0,4]. What is the new x window?", "[3,7].", "The window is [3,7].", "[3,7]"),
  ],
  50: [
    calculation("Tick step 2 on [0,10]. How many labels?", "0,2,4,6,8,10.", "Count is 6.", "6"),
    calculation("Tick step 5 on [0,20]. List the labels.", "0,5,10,15,20.", "Step 5.", "0,5,10,15,20"),
    calculation("If a log tick reads 100, what data value is that?", "The label is 100.", "100.", "100"),
  ],
  51: [
    calculation("Major 1, minor 0.5 on [0,2]. How many minor lines inside?", "At 0.5 and 1.5.", "Not counting the majors.", "2"),
    calculation("Ten minor gaps of 0.5 cover what length?", "10*0.5=5.", "Not 10.", "5"),
    calculation("If minor step is 0, how many minor lines?", "Minor is off.", "Count is 0.", "0"),
  ],
  52: [
    calculation("View A is [-2,2], view B is [-8,8]. Is the vertex of y=x^2 the same?", "Both show (0,0).", "Yes.", "yes"),
    calculation("If a point is dragged to (1,1) in A, where is it in B?", "Still (1,1).", "(1,1).", "(1,1)"),
    calculation("How many cameras are there in two graphics views?", "Two cameras.", "2.", "2"),
  ],
  53: [
    calculation("List special points of y=x^2-4.", "Roots ±2.", "Three special points.", "(-2,0),(2,0),(0,-4)"),
    calculation("Find x of the vertex of x^2-4.", "-b/2a=0.", "The vertex x is 0.", "0"),
    calculation("Is (1,-3) a vertex of x^2-4?", "f(1)=-3 but vertex is (0,-4).", "Not the vertex.", "no"),
  ],
  54: [
    calculation("Inspect y=2x+3 at x=3.", "y=9.", "Readout (3,9).", "9"),
    calculation("Inspect at x=0.", "y=3.", "y=3.", "3"),
    calculation("What slope should the inspector report for 2x+3?", "The coefficient of x is 2.", "2.", "2"),
  ],
  55: [
    calculation("For y=ax+3 at x=2, a=1, find y.", "1*2+3=5.", "The value is 5.", "5"),
    calculation("The same x with a=2.", "2*2+3=7.", "The line steepened.", "7"),
    calculation("What a makes y=11 at x=4?", "4a+3=11.", "a=2.", "2"),
  ],
  56: [
    calculation("An 800×600 export of window [-2,2]×[-2,2]: what is the x-max in data?", "x-max is still 2.", "2.", "2"),
    calculation("A 400×300 export of the same window: is (2,5) still (2,5)?", "Yes.", "yes", "yes"),
    calculation("If width doubles from 400 to 800, what happens to the mathematical window?", "It stays the same.", "unchanged", "unchanged"),
  ],
  57: [
    calculation("Is 7 a natural number?", "Natural numbers start at 1.", "Yes.", "yes"),
    calculation("What is the successor of 18?", "18+1=19.", "19.", "19"),
    calculation("A shelf has 9 books and you add 3. What natural number is the total?", "9+3=12.", "12.", "12"),
  ],
  58: [
    calculation("Is 0 a whole number?", "Whole numbers include 0.", "Yes.", "yes"),
    calculation("Write the whole number before 1.", "The previous whole is 0.", "0.", "0"),
    calculation("A score goes from 0 to 6. What whole number is the new score?", "0+6=6.", "6.", "6"),
  ],
  59: [
    calculation("Which is greater: -2 or -7?", "-2 is farther right.", "-2.", "-2"),
    calculation("Start at -2 and move 5 steps right.", "-2+5=3.", "3.", "3"),
    calculation("Write the integer for 6 m below sea level.", "Below is negative.", "-6.", "-6"),
  ],
  60: [
    calculation("Is 0.75 rational?", "0.75=3/4.", "yes", "yes"),
    calculation("Write 2/4 in lowest terms.", "gcd=2.", "1/2.", "1/2"),
    calculation("Place 3/4 and 1/2 on a line. Which is farther right?", "3/4=0.75>0.5.", "3/4.", "3/4"),
  ],
  61: [
    calculation("Which is irrational: 1/2 or √2?", "√2 is not a ratio of integers.", "√2.", "√2"),
    calculation("Between which integers does √2 sit?", "1^2=1, 2^2=4.", "1 and 2.", "1 and 2"),
    calculation("A 1-by-1 square has diagonal?", "√(1+1)=√2.", "√2.", "√2"),
  ],
  62: [
    calculation("Is √2 real?", "Irrationals are real.", "yes", "yes"),
    calculation("Is -3 real?", "Integers are real.", "yes", "yes"),
    calculation("On the real line, which is greater: -1 or 0.5?", "-1 is left of 0.5.", "0.5.", "0.5"),
  ],
  63: [
    calculation("For 3+4i, find the modulus.", "√(9+16)=√25=5.", "5.", "5"),
    calculation("Find the conjugate of 3+4i.", "Sign of i flips.", "3-4i.", "3-4i"),
    calculation("Find (3+4i)+(1-2i).", "4+2i.", "4+2i.", "4+2i"),
  ],
  64: [
    calculation("In 5,381 what is the value of digit 5?", "Thousands place.", "5000.", "5000"),
    calculation("In 407, what is the value of 4?", "Hundreds.", "400.", "400"),
    calculation("Expanded form of 2305?", "2000+300+5.", "2000+300+5.", "2000+300+5"),
  ],
  65: [
    calculation("Is 6 a factor of 42?", "42/6=7.", "yes", "yes"),
    calculation("List factor pairs of 12.", "1×12, 2×6, 3×4.", "1,2,3,4,6,12.", "1,2,3,4,6,12"),
    calculation("Is 5 a factor of 18?", "18=3×6, remainder 3.", "no", "no"),
  ],
  66: [
    calculation("Is 36 a multiple of 9?", "9×4=36.", "yes", "yes"),
    calculation("List the first four multiples of 6.", "6,12,18,24.", "6,12,18,24.", "6,12,18,24"),
    calculation("Is 14 a multiple of 6?", "6×2=12, 6×3=18.", "no", "no"),
  ],
  67: [
    calculation("Is 17 prime?", "Factors only 1 and 17.", "yes", "yes"),
    calculation("Is 15 prime?", "15=3×5.", "no", "no"),
    calculation("How many primes are ≤10?", "2,3,5,7.", "4.", "4"),
  ],
  68: [
    calculation("Prime factorise 12.", "12=2×2×3.", "2×2×3.", "2×2×3"),
    calculation("Prime factorise 18.", "18=2×3×3.", "2×3×3.", "2×3×3"),
    calculation("How many prime factors of 8 counted with multiplicity?", "2×2×2.", "3.", "3"),
  ],
  69: [
    calculation("HCF of 18 and 24.", "Common factors 1,2,3,6.", "6.", "6"),
    calculation("HCF of 7 and 15.", "Both prime to each other.", "1.", "1"),
    calculation("HCF of 12 and 18.", "2^2×3 and 2×3^2.", "6.", "6"),
  ],
  70: [
    calculation("LCM of 6 and 8.", "6,12,18,24 and 8,16,24.", "24.", "24"),
    calculation("LCM of 4 and 10.", "20.", "20.", "20"),
    calculation("LCM of 3 and 5.", "15.", "15.", "15"),
  ],
  71: [
    calculation("Is 234 divisible by 9?", "2+3+4=9.", "yes", "yes"),
    calculation("Is 124 divisible by 4?", "Last two digits 24.", "yes", "yes"),
    calculation("Is 35 divisible by 5?", "Ends in 5.", "yes", "yes"),
  ],
  72: [
    calculation("23 mod 7.", "23=3×7+2.", "2.", "2"),
    calculation("17 mod 5.", "3×5+2.", "2.", "2"),
    calculation("(5+8) mod 6.", "13=2×6+1.", "1.", "1"),
  ],
  73: [
    calculation("Binary 110 in base ten.", "4+2+0=6.", "6.", "6"),
    calculation("What is 1×3^2+2×3+0 in base ten?", "9+6=15.", "15.", "15"),
    calculation("How many digits 0-1 are allowed in base 2?", "Two digits.", "2.", "2"),
  ],
  74: [
    calculation("Evaluate 2+1/3.", "2=6/3.", "7/3.", "7/3"),
    calculation("First convergent of [1;2]?", "1+1/2=3/2.", "3/2.", "3/2"),
    calculation("1+1/(2+1/2) as a fraction.", "2+1/2=5/2.", "1+2/5=7/5.", "7/5"),
  ],
  75: [
    calculation("Set a model to 3/4. What decimal is that?", "3÷4=0.75.", "0.75.", "0.75"),
    calculation("A circle split into 8 with 2 shaded is which fraction?", "2/8=1/4.", "1/4.", "1/4"),
    calculation("3 of 5 equal bars is which fraction?", "3/5.", "3/5.", "3/5"),
  ],
  76: [
    calculation("Which is equivalent to 3/4: 6/8 or 6/4?", "×2 on 3 and 4.", "6/8.", "6/8"),
    calculation("Scale 2/5 by 3.", "6/15.", "6/15.", "6/15"),
    calculation("Are 4/6 and 2/3 equivalent?", "4/6÷2=2/3.", "yes", "yes"),
  ],
  77: [
    calculation("Which is greater: 3/4 or 2/3?", "9/12 vs 8/12.", "3/4.", "3/4"),
    calculation("Compare 1/2 and 2/5.", "5/10 vs 4/10.", "1/2.", "1/2"),
    calculation("Order 1/3, 1/2, 1/4 from least.", "1/4,1/3,1/2.", "1/4,1/3,1/2.", "1/4,1/3,1/2"),
  ],
  78: [
    calculation("What is 1/2+1/3?", "3/6+2/6=5/6.", "5/6.", "5/6"),
    calculation("What is 3/4-1/4?", "2/4=1/2.", "1/2.", "1/2"),
    calculation("What is (2/3)×(3/5)?", "6/15=2/5.", "2/5.", "2/5"),
  ],
  79: [
    calculation("Which is greater: 0.5 or 0.47?", "0.50>0.47.", "0.5.", "0.5"),
    calculation("The tenths digit of 3.86?", "8.", "8.", "8"),
    calculation("0.07 as hundredths?", "7 hundredths.", "7.", "7"),
  ],
  80: [
    calculation("3.4+1.25.", "3.40+1.25=4.65.", "4.65.", "4.65"),
    calculation("5.0-1.25.", "3.75.", "3.75.", "3.75"),
    calculation("0.6×0.5.", "0.30.", "0.3.", "0.3"),
  ],
  81: [
    calculation("Convert 3/4 to a decimal.", "3÷4=0.75.", "0.75.", "0.75"),
    calculation("Convert 0.2 to a fraction.", "2/10=1/5.", "1/5.", "1/5"),
    calculation("Convert 1/8 to a decimal.", "0.125.", "0.125.", "0.125"),
  ],
  82: [
    calculation("Which is exact for 1/3: 0.333 or 0.333...?", "The 3 repeats forever.", "0.333...", "0.333..."),
    calculation("Write 2/9 as a recurring decimal.", "0.222...", "0.2̅.", "0.222..."),
    calculation("1/6 as a recurring decimal?", "0.1666...", "0.1̅6.", "0.1666..."),
  ],
  83: [
    calculation("2:3 scaled by 5.", "10:15.", "10:15.", "10:15"),
    calculation("Simplify 8:12.", "2:3.", "2:3.", "2:3"),
    calculation("A tape of 2 red to 5 blue has how many parts?", "7 parts.", "7.", "7"),
  ],
  84: [
    calculation("Solve 2/3=x/9.", "×3 on 2.", "6.", "6"),
    calculation("Solve 4/5=8/x.", "4x=40.", "10.", "10"),
    calculation("If 3/n=12/20, find n.", "3×20=12n.", "5.", "5"),
  ],
  85: [
    calculation("3 kg cost 90. What do 5 kg cost?", "30 per kg.", "150.", "150"),
    calculation("y=4x. Find y when x=7.", "28.", "28.", "28"),
    calculation("If 2 hours give 10 km, how far in 6 hours at the same speed?", "30 km.", "30.", "30"),
  ],
  86: [
    calculation("xy=24 and x=8. Find y.", "y=3.", "3.", "3"),
    calculation("If 4 workers take 6 days, 8 workers take how many at inverse rate?", "3 days.", "3.", "3"),
    calculation("xy=12, x=3. Find y.", "4.", "4.", "4"),
  ],
  87: [
    calculation("5 kg cost 300. Cost per kg?", "60.", "60.", "60"),
    calculation("180 km in 3 h. Unit rate?", "60 km/h.", "60.", "60"),
    calculation("₹45 for 9 items. Price each?", "5.", "5.", "5"),
  ],
  88: [
    calculation("25% of 80.", "20.", "20.", "20"),
    calculation("15% of 200.", "30.", "30.", "30"),
    calculation("40 is what percent of 160?", "25%.", "25.", "25"),
  ],
  89: [
    calculation("Price from 80 to 100. Percentage increase?", "25%.", "25.", "25"),
    calculation("From 50 to 40. Percentage decrease?", "20%.", "20.", "20"),
    calculation("A 200 g mass becomes 230 g. Percent change?", "15%.", "15.", "15"),
  ],
  90: [
    calculation("Start 100, increase 10% twice.", "121.", "121.", "121"),
    calculation("Start 200, decrease 10% then increase 10%.", "198.", "198.", "198"),
    calculation("1.05^2 × 400.", "441.", "441.", "441"),
  ],
  91: [
    calculation("Scale 1 cm=5 km. 4 cm is how far?", "20 km.", "20.", "20"),
    calculation("1:100000. 3 cm on the map is how many metres?", "3000 m.", "3000.", "3000"),
    calculation("A 12 km road at 1 cm to 2 km is how long on the map?", "6 cm.", "6.", "6"),
  ],
  92: [
    calculation("Tiles for 2x+3: how many unit tiles?", "3 unit tiles.", "3.", "3"),
    calculation("Combine 3x and -x.", "2x.", "2x.", "2x"),
    calculation("Zero pair: +1 and -1. Net?", "0.", "0.", "0"),
  ],
  93: [
    calculation("Simplify 3x+5x.", "8x.", "8x.", "8x"),
    calculation("Simplify 7y-2y+4.", "5y+4.", "5y+4.", "5y+4"),
    calculation("Are 2x and 2y like terms?", "Different letters.", "no", "no"),
  ],
  94: [
    calculation("Evaluate 2x+1 at x=4.", "8+1=9.", "9.", "9"),
    calculation("Evaluate 3a-5 at a=2.", "6-5=1.", "1.", "1"),
    calculation("Evaluate x^2 at x=-3.", "9.", "9.", "9"),
  ],
  95: [
    calculation("Expand 4(x+3).", "4x+12.", "4x+12.", "4x+12"),
    calculation("Expand -2(x-5).", "-2x+10.", "-2x+10.", "-2x+10"),
    calculation("Expand 3(2x+1).", "6x+3.", "6x+3.", "6x+3"),
  ],
  96: [
    calculation("Expand (x+2)(x+3).", "x^2+5x+6.", "x^2+5x+6.", "x^2+5x+6"),
    calculation("Expand (x+4)(x-4).", "x^2-16.", "x^2-16.", "x^2-16"),
    calculation("Expand (2x+1)(x+3).", "2x^2+7x+3.", "2x^2+7x+3.", "2x^2+7x+3"),
  ],
  97: [
    calculation("Factor x^2+5x+6.", "(x+2)(x+3).", "(x+2)(x+3).", "(x+2)(x+3)"),
    calculation("Factor 6x+9.", "3(2x+3).", "3(2x+3).", "3(2x+3)"),
    calculation("Factor x^2-9.", "(x-3)(x+3).", "(x-3)(x+3).", "(x-3)(x+3)"),
  ],
  98: [
    calculation("What value is excluded from (x+1)/(x-2)?", "x-2=0.", "2.", "2"),
    calculation("Simplify (2x)/4.", "x/2.", "x/2.", "x/2"),
    calculation("(x^2-1)/(x-1) for x≠1.", "x+1.", "x+1.", "x+1"),
  ],
  99: [
    calculation("Simplify x^3×x^4.", "x^7.", "x^7.", "x^7"),
    calculation("Simplify (x^2)^3.", "x^6.", "x^6.", "x^6"),
    calculation("Simplify x^5/x^2.", "x^3.", "x^3.", "x^3"),
  ],
  100: [
    calculation("Simplify √18.", "3√2.", "3√2.", "3√2"),
    calculation("√8+√2.", "2√2+√2=3√2.", "3√2.", "3√2"),
    calculation("(√3)^2.", "3.", "3.", "3"),
  ],
  101: [
    calculation("Rationalise 1/√2.", "√2/2.", "√2/2.", "√2/2"),
    calculation("Rationalise 3/√5.", "3√5/5.", "3√5/5.", "3√5/5"),
    calculation("Rationalise 1/(√3-1).", "(√3+1)/2.", "(√3+1)/2.", "(√3+1)/2"),
  ],
  102: [
    calculation("Add (x^2+3x)+(2x^2-x).", "3x^2+2x.", "3x^2+2x.", "3x^2+2x"),
    calculation("(x+1)(x+2) as a polynomial.", "x^2+3x+2.", "x^2+3x+2.", "x^2+3x+2"),
    calculation("Degree of 4x^3-x+7.", "3.", "3.", "3"),
  ],
  103: [
    calculation("Divide x^2+5x+6 by x+2 using synthetic  -2.", "Coefficients 1,5,6.", "x+3 remainder 0.", "x+3"),
    calculation("Divide x^2-1 by x-1 at 1.", "1,0,-1.", "x+1 remainder 0.", "x+1"),
    calculation("Synthetic 2 on 1,-3,2.", "1, -1, 0.", "x-1.", "x-1"),
  ],
  104: [
    calculation("Remainder of x^2-1 divided by x-1.", "f(1)=0.", "0.", "0"),
    calculation("Remainder of x^2+x+1 at x=1.", "1+1+1=3.", "3.", "3"),
    calculation("f(x)=x^3-8, remainder at x=2.", "8-8=0.", "0.", "0"),
  ],
  105: [
    calculation("Is x-2 a factor of x^2-4?", "f(2)=0.", "yes", "yes"),
    calculation("Is x+1 a factor of x^2+5x+6?", "f(-1)=1-5+6=2≠0.", "no", "no"),
    calculation("Find a factor of x^2-5x+6.", "f(2)=0 so x-2.", "x-2.", "x-2"),
  ],
  106: [
    calculation("Check (x+1)^2=x^2+2x+1 at x=3.", "16 vs 9+6+1=16.", "16=16.", "16=16"),
    calculation("Is x^2-1=(x-1)(x+1) an identity?", "Yes for all x.", "yes", "yes"),
    calculation("Evaluate both sides of a+b=b+a at a=2,b=5.", "7=7.", "7.", "7"),
  ],
  107: [
    calculation("Solve x+7=12.", "x=5.", "5.", "5"),
    calculation("Solve 3x=18.", "x=6.", "6.", "6"),
    calculation("Solve x-4=9.", "x=13.", "13.", "13"),
  ],
  108: [
    calculation("Solve 2x+3=11.", "2x=8.", "4.", "4"),
    calculation("Solve 5x-7=18.", "5x=25.", "5.", "5"),
    calculation("Solve 3(x-2)=12.", "x-2=4.", "6.", "6"),
  ],
  109: [
    calculation("Solve x/2+1=4.", "x/2=3.", "6.", "6"),
    calculation("Solve (x+3)/5=2.", "x+3=10.", "7.", "7"),
    calculation("Solve 2/3 x=8.", "x=12.", "12.", "12"),
  ],
  110: [
    calculation("Solve I=V/R for R.", "R=V/I.", "R=V/I.", "R=V/I"),
    calculation("Solve A=lw for w.", "w=A/l.", "w=A/l.", "w=A/l"),
    calculation("Solve y=mx+c for x.", "x=(y-c)/m.", "(y-c)/m.", "(y-c)/m"),
  ],
  111: [
    calculation("Solve 2x+3=11.", "x=4.", "4.", "4"),
    calculation("Solve 4-x=9.", "-x=5.", "-5.", "-5"),
    calculation("A line y=2x+3 hits y=11 at what x?", "x=4.", "4.", "4"),
  ],
  112: [
    calculation("Solve x+y=5, x-y=1.", "2x=6, x=3, y=2.", "(3,2).", "(3,2)"),
    calculation("Solve 2x+y=7, x-y=2.", "3x=9, x=3, y=1.", "(3,1).", "(3,1)"),
    calculation("If 3x+2y=12 and y=3, find x.", "3x+6=12.", "2.", "2"),
  ],
  113: [
    calculation("x+y+z=6, x=1, y=2. Find z.", "z=3.", "3.", "3"),
    calculation("A 3×3 system with unique solution has how many planes meeting at a point?", "Three planes.", "3.", "3"),
    calculation("If x=1,y=-1,z=4 satisfy x+y+z=?", "1-1+4=4.", "4.", "4"),
  ],
  114: [
    calculation("Solve x^2-5x+6=0.", "(x-2)(x-3)=0.", "2,3.", "2,3"),
    calculation("Solve x^2=9.", "x=±3.", "±3.", "±3"),
    calculation("Discriminant of x^2-4x+4.", "16-16=0.", "0.", "0"),
  ],
  115: [
    calculation("Solve x^3-8=0.", "x=2.", "2.", "2"),
    calculation("A cubic can have how many real roots at most?", "3.", "3.", "3"),
    calculation("If (x-1)(x-2)(x-3)=0, list roots.", "1,2,3.", "1,2,3.", "1,2,3"),
  ],
  116: [
    calculation("Solve 1/x=1/2.", "x=2.", "2.", "2"),
    calculation("Solve (x+1)/(x-1)=2.", "x+1=2x-2.", "3.", "3"),
    calculation("Excluded value of 1/(x-4)=3?", "x≠4.", "x=13/3, x≠4.", "13/3"),
  ],
  117: [
    calculation("Solve √x=5.", "x=25.", "25.", "25"),
    calculation("Solve √(x-1)=3.", "x-1=9.", "10.", "10"),
    calculation("Is x=4 a solution of √x=-2?", "√x≥0.", "no", "no"),
  ],
  118: [
    calculation("Solve 2^x=8.", "x=3.", "3.", "3"),
    calculation("Solve 10^x=1000.", "x=3.", "3.", "3"),
    calculation("Solve e^x=1.", "x=0.", "0.", "0"),
  ],
  119: [
    calculation("Solve log_2 x=3.", "x=8.", "8.", "8"),
    calculation("Solve ln x=0.", "x=1.", "1.", "1"),
    calculation("Solve log_10 x=2.", "x=100.", "100.", "100"),
  ],
  120: [
    calculation("Solve sin θ=1/2 in [0,180°].", "30° and 150°.", "30°,150°.", "30°,150°"),
    calculation("Solve cos θ=0 in [0,180°].", "90°.", "90°.", "90°"),
    calculation("Solve tan θ=1 in [0,180°).", "45°.", "45°.", "45°"),
  ],
  121: [
    calculation("Solve |x|=3.", "x=3 or x=-3.", "±3.", "±3"),
    calculation("Solve |x-2|=5.", "x-2=±5.", "7,-3.", "7,-3"),
    calculation("Solve |2x|=8.", "2x=±8.", "±4.", "±4"),
  ],
  122: [
    calculation("Solve x+3<7.", "x<4.", "x<4.", "x<4"),
    calculation("Solve 2x≥10.", "x≥5.", "x≥5.", "x≥5"),
    calculation("Is 4 a solution of x<4?", "No, open.", "no", "no"),
  ],
  123: [
    calculation("Solve 1<x<4 for integers.", "2,3.", "2,3.", "2,3"),
    calculation("Solve x≤-1 or x≥2. Is 0 in the set?", "No.", "no", "no"),
    calculation("How many integers satisfy -1≤x≤2?", "-1,0,1,2.", "4.", "4"),
  ],
  124: [
    calculation("Solve x^2-1<0.", "(x-1)(x+1)<0.", "(-1,1).", "(-1,1)"),
    calculation("Solve x^2≥9.", "x≤-3 or x≥3.", "(-∞,-3]∪[3,∞).", "x≤-3 or x≥3"),
    calculation("Is x=0 a solution of x^2-1<0?", "-1<0 yes.", "yes", "yes"),
  ],
  125: [
    calculation("Sign of (x-1)(x-2)(x-3) on (2,3)?", "Negative then... wait: three factors, two negative? x=2.5: +,+,− → −.", "negative", "negative"),
    calculation("Roots of (x-1)(x-2)(x-3)=0.", "1,2,3.", "1,2,3.", "1,2,3"),
    calculation("Is x=4 a positive product of those factors?", "+++ yes.", "yes", "yes"),
  ],
  126: [
    calculation("Is (0,0) in y>x+1?", "0>1 false.", "no", "no"),
    calculation("Is (0,2) in y>x+1?", "2>1 true.", "yes", "yes"),
    calculation("Boundary of y≥x: solid or dashed?", "≥ closed.", "solid", "solid"),
  ],
  127: [
    calculation("y≥0, x≥0, x+y≤4. Is (1,1) feasible?", "Yes, 2≤4.", "yes", "yes"),
    calculation("Is (5,0) feasible for x+y≤4, x,y≥0?", "5>4.", "no", "no"),
    calculation("Corner (0,4) of x+y=4, x,y≥0. Value of x+2y?", "8.", "8.", "8"),
  ],
  128: [
    calculation("A solver starts at x=1 for x^2=2. One Newton step: x-(1-2)/2=1.5.", "1.5.", "1.5.", "1.5"),
    calculation("Bisection on [1,2] for x^2-2. Midpoint?", "1.5.", "1.5.", "1.5"),
    calculation("If f(1)=-1 and f(2)=2, a root lies in which interval?", "(1,2).", "(1,2).", "(1,2)"),
  ],
  129: [
    calculation("Does x → x^2 assign one output to each real input?", "Yes.", "yes", "yes"),
    calculation("Does x^2=y as x in terms of y give two x for y=4?", "±2.", "no", "no"),
    calculation("f(3) if f(x)=2x+1.", "7.", "7.", "7"),
  ],
  130: [
    calculation("Domain of 1/(x-2).", "x≠2.", "x≠2.", "x≠2"),
    calculation("Range of y=x^2.", "y≥0.", "[0,∞).", "[0,∞)"),
    calculation("Domain of √(x-3).", "x≥3.", "[3,∞).", "x≥3"),
  ]
};

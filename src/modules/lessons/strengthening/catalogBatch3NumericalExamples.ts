import { asWorkedMathStep } from "./workedMathStep";

type NumericalExampleSeed = readonly [prompt: string, steps: readonly string[], answer: string];

function calculation(
  prompt: string,
  working: string,
  result: string,
  answer: string = result,
): NumericalExampleSeed {
  return [
    prompt,
    [asWorkedMathStep(working), asWorkedMathStep(result), asWorkedMathStep(String.raw`\boxed{${result}}`)],
    answer,
  ];
}

export const batch3NumericalExamples: Readonly<Record<number, readonly NumericalExampleSeed[]>> = {
  131: [
    calculation("If f(x)=x^2+1, find f(2).", "Replace x by 2.", "f(2)=5.", "5"),
    calculation("If f(x)=3x-2, find f(4).", "3*4-2.", "f(4)=10.", "10"),
    calculation("Does f(2) mean f times 2?", "f is a name, not a factor.", "No.", "no"),
  ],
  132: [
    calculation("Does y=x^2 pass the vertical-line test?", "A vertical line hits once.", "Yes.", "yes"),
    calculation("Does x^2+y^2=1 pass?", "x=0 hits (0,1) and (0,-1).", "No.", "no"),
    calculation("Should you use a horizontal line to test a function of x?", "The test freezes x.", "No.", "no"),
  ],
  133: [
    calculation("For y=2x+3, find f(4).", "2*4+3.", "11.", "11"),
    calculation("What is the slope of y=2x+3?", "The coefficient of x is 2.", "2.", "2"),
    calculation("Does y=2x+3 pass through the origin?", "f(0)=3.", "No.", "no"),
  ],
  134: [
    calculation("Find the roots of y=x^2-4.", "x^2=4.", "x=±2.", "x=±2"),
    calculation("Find the vertex of y=x^2-4.", "Axis x=0.", "(0,-4).", "(0,-4)"),
    calculation("Find f(3) for f(x)=x^2-4.", "9-4=5.", "5.", "5"),
  ],
  135: [
    calculation("Find f(-2) for f(x)=x^3.", "(-2)^3=-8.", "-8.", "-8"),
    calculation("Find the real roots of x^3-x=0.", "x(x-1)(x+1)=0.", "-1,0,1.", "-1, 0, 1"),
    calculation("Is the parent cubic a U-shape?", "x^3 is S-shaped.", "No.", "no"),
  ],
  136: [
    calculation("How many real roots can a degree-4 polynomial have at most?", "Degree n allows at most n roots.", "4.", "4"),
    calculation("Solve (x^2-1)(x^2-4)=0.", "x^2=1 or x^2=4.", "±1, ±2.", "±1, ±2"),
    calculation("Must a degree-5 polynomial have 5 real roots?", "Degree is a maximum.", "No.", "no"),
  ],
  137: [
    calculation("Find 1/2.", "The reciprocal of 2 is 1/2.", "1/2.", "1/2"),
    calculation("Is x=0 allowed in y=1/x?", "Denominator would be 0.", "No.", "no"),
    calculation("Find 1/4.", "1/4=0.25.", "1/4.", "1/4"),
  ],
  138: [
    calculation("What x is excluded from (x+1)/(x-2)?", "Set x-2=0.", "2.", "2"),
    calculation("Find f(0) for f(x)=(x+1)/(x-2).", "(1)/(-2)=-1/2.", "-1/2.", "-1/2"),
    calculation("After cancelling (x-2), is x=2 allowed?", "The original denominator is still 0.", "No.", "no"),
  ],
  139: [
    calculation("Find √9.", "3*3=9.", "3.", "3"),
    calculation("Is x=-1 in the real domain of √x?", "Radicand must be ≥0.", "No.", "no"),
    calculation("Find √4.", "2*2=4.", "2.", "2"),
  ],
  140: [
    calculation("Find ∛(-8).", "(-2)^3=-8.", "-2.", "-2"),
    calculation("Find ∛8.", "2^3=8.", "2.", "2"),
    calculation("Are negative inputs allowed for cube roots?", "Cubing keeps sign.", "yes", "yes"),
  ],
  141: [
    calculation("Find |-4|.", "Distance from 0 to -4 is 4.", "4.", "4"),
    calculation("Find the vertex of y=|x-2|.", "Inside zero at x=2.", "(2,0).", "(2,0)"),
    calculation("Find |3|.", "3 is already positive.", "3.", "3"),
  ],
  142: [
    calculation("Find 2^3.", "2*2*2=8.", "8.", "8"),
    calculation("Find 2^0.", "Any nonzero to the 0 is 1.", "1.", "1"),
    calculation("Does 2^x add 2 each step?", "It multiplies by 2.", "No.", "no"),
  ],
  143: [
    calculation("Find log2(8).", "2^3=8.", "3.", "3"),
    calculation("Find ln 1.", "e^0=1.", "0.", "0"),
    calculation("Is log(0) a real number?", "The input must be positive.", "no", "no"),
  ],
  144: [
    calculation("Find sin 30°.", "Unit-circle height is 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60°=1/2.", "1/2.", "1/2"),
    calculation("Find sin 90°.", "The top of the unit circle is 1.", "1.", "1"),
  ],
  145: [
    calculation("Find cosh 0.", "(e^0+e^0)/2=1.", "1.", "1"),
    calculation("Find sinh 0.", "(1-1)/2=0.", "0.", "0"),
    calculation("Is cosh periodic like cos?", "cosh grows and does not repeat.", "no", "no"),
  ],
  146: [
    calculation("Find floor(3.7).", "Greatest integer ≤3.7 is 3.", "3.", "3"),
    calculation("Find floor(-1.2).", "Greatest integer ≤-1.2 is -2.", "-2.", "-2"),
    calculation("Find floor(4).", "4 is already an integer.", "4.", "4"),
  ],
  147: [
    calculation("Find ceil(3.2).", "Least integer ≥3.2 is 4.", "4.", "4"),
    calculation("Find ceil(-1.2).", "Least integer ≥-1.2 is -1.", "-1.", "-1"),
    calculation("23 students, 10 per bus. How many buses?", "ceil(23/10)=ceil(2.3)=3.", "3.", "3"),
  ],
  148: [
    calculation("Find sgn(-8).", "-8<0.", "-1.", "-1"),
    calculation("Find sgn(5).", "5>0.", "1.", "1"),
    calculation("Find sgn(0).", "Zero is the middle value.", "0.", "0"),
  ],
  149: [
    calculation("f(x)=x for x<0 and x^2 for x≥0. Find f(3).", "3≥0 so use x^2.", "9.", "9"),
    calculation("Find f(-2) for the same rule.", "-2<0 so use x.", "-2.", "-2"),
    calculation("Find f(0).", "0 uses the closed x^2 piece.", "0.", "0"),
  ],
  150: [
    calculation("f(x)=2x, g(x)=x+3. Find f(g(4)).", "g(4)=7.", "14.", "14"),
    calculation("Find g(f(4)) for the same pair.", "f(4)=8.", "11.", "11"),
    calculation("Is f(g(x)) always g(f(x))?", "14≠11 here.", "No.", "no"),
  ],
  151: [
    calculation("Find the inverse of f(x)=2x+3.", "y=2x+3.", "y=(x-3)/2.", "(x-3)/2"),
    calculation("If f(2)=7, what is f^{-1}(7)?", "Inverse swaps pairs.", "2.", "2"),
    calculation("Is the inverse of f the reciprocal 1/f?", "Inverse undoes the rule.", "No.", "no"),
  ],
  152: [
    calculation("Is f(x)=x^2 even or odd?", "f(-x)=x^2=f(x).", "even", "even"),
    calculation("Is f(x)=x^3 even or odd?", "f(-x)=-x^3=-f(x).", "odd", "odd"),
    calculation("Find (-3)^2 and 3^2.", "Both are 9.", "9 and 9.", "9, 9"),
  ],
  153: [
    calculation("Is y=2x+1 increasing?", "Slope 2>0.", "Yes.", "yes"),
    calculation("Is y=-x+4 decreasing?", "Slope -1<0.", "Yes.", "yes"),
    calculation("Do we read increasing from right to left?", "The definition uses increasing x.", "No.", "no"),
  ],
  154: [
    calculation("What is the period of sin x in radians?", "sin(x+2π)=sin x.", "2π.", "2π"),
    calculation("What is the period of tan x?", "tan(x+π)=tan x.", "π.", "π"),
    calculation("Is every wavy graph periodic?", "The pattern must repeat exactly.", "no", "no"),
  ],
  155: [
    calculation("a1=3, a_n=a_{n-1}+2. Find a4.", "3,5,7,9.", "9.", "9"),
    calculation("Find a3 for the same rule.", "3,5,7.", "7.", "7"),
    calculation("Can you start without a1?", "The recurrence needs a seed.", "no", "no"),
  ],
  156: [
    calculation("Move y=x^2 up 3. Where is the vertex?", "(0,0) plus 3 in y.", "(0,3).", "(0,3)"),
    calculation("What is (1,1) mapped to under +3?", "y becomes 4.", "(1,4).", "(1,4)"),
    calculation("Does +3 outside move the graph sideways?", "Outside addition changes y.", "no", "no"),
  ],
  157: [
    calculation("What does f(x-2) do to y=x^2?", "x-2=0 at x=2.", "right 2", "right 2"),
    calculation("Where is the vertex of (x-2)^2?", "x=2, y=0.", "(2,0).", "(2,0)"),
    calculation("Does f(x-2) move left?", "Inside subtraction moves right.", "no", "no"),
  ],
  158: [
    calculation("What is 3x^2 at x=1?", "3*1=3.", "3.", "3"),
    calculation("What does y=2f(x) do?", "Multiply outputs by 2.", "vertical stretch 2", "vertical stretch 2"),
    calculation("Does a vertical stretch change x-values?", "Only y is multiplied.", "no", "no"),
  ],
  159: [
    calculation("What does f(2x) do to width?", "Reciprocal of 2 is 1/2.", "compression 1/2", "compression 1/2"),
    calculation("On y=x^2, f(2x) at x=1 equals the old value at which x?", "2x=2 when x=1.", "2.", "2"),
    calculation("Does f(2x) stretch horizontally by 2?", "It compresses by 1/2.", "no", "no"),
  ],
  160: [
    calculation("Reflect (2,3) in the x-axis.", "Keep x=2.", "(2,-3).", "(2,-3)"),
    calculation("What is y=-x^2 at x=2?", "-(4)=-4.", "-4.", "-4"),
    calculation("Does x-axis reflection change x?", "Only y flips sign.", "no", "no"),
  ],
  161: [
    calculation("Reflect (2,3) in the y-axis.", "x becomes -2.", "(-2,3).", "(-2,3)"),
    calculation("What is f(-x) doing?", "Left-right flip.", "y-axis reflection", "y-axis reflection"),
    calculation("Does y-axis reflection change y?", "Only x flips sign.", "no", "no"),
  ],
  162: [
    calculation("Vertex of y=2(x-1)^2+3?", "h=1, k=3.", "(1,3).", "(1,3)"),
    calculation("What does x-1 do in that formula?", "Inside shift.", "right 1", "right 1"),
    calculation("What does the outside 2 do?", "Vertical stretch by 2.", "stretch 2", "stretch 2"),
  ],
  163: [
    calculation("Double 2 then add 3.", "2*2=4.", "7.", "7"),
    calculation("Add 3 to 2 then double.", "2+3=5.", "10.", "10"),
    calculation("Do those two orders match?", "7≠10.", "No.", "no"),
  ],
  164: [
    calculation("In y=ax+b, which parameter shifts the line vertically?", "b is added to every y.", "b", "b"),
    calculation("If a=2 and b=3, find y at x=4.", "2*4+3=11.", "11.", "11"),
    calculation("Is a the input variable?", "a is a parameter.", "No.", "no"),
  ],
  165: [
    calculation("What is the quadratic parent?", "Simplest squared rule.", "y=x^2.", "y=x^2"),
    calculation("What is the absolute-value parent?", "Simplest V.", "y=|x|.", "y=|x|"),
    calculation("Is (x-2)^2 a parent?", "It is already shifted.", "no", "no"),
  ],
  166: [
    calculation("For y=2x+1, what is the y-intercept?", "x=0 gives 1.", "1.", "1"),
    calculation("Does (2,5) lie on y=2x+1?", "2*2+1=5.", "yes", "yes"),
    calculation("Is one shared point enough to match a graph?", "Need shape and another point.", "no", "no"),
  ],
  167: [
    calculation("Which quadrant is (3,-2)?", "x>0, y<0.", "IV.", "IV"),
    calculation("Which quadrant is (-3,2)?", "x<0, y>0.", "II.", "II"),
    calculation("What is the origin?", "x=0, y=0.", "(0,0).", "(0,0)"),
  ],
  168: [
    calculation("Plot (4,1). How far right?", "x=4.", "4.", "4"),
    calculation("Where is (0,-3)?", "On the negative y-axis.", "(0,-3).", "(0,-3)"),
    calculation("Do you count y before x?", "x first, then y.", "no", "no"),
  ],
  169: [
    calculation("Distance from (0,0) to (3,4).", "√(9+16)=√25.", "5.", "5"),
    calculation("Distance from (1,1) to (4,5).", "Δx=3, Δy=4.", "5.", "5"),
    calculation("Is the distance 3+4=7?", "Use the hypotenuse.", "no", "no"),
  ],
  170: [
    calculation("Midpoint of (0,0) and (4,2).", "x-average 2.", "(2,1).", "(2,1)"),
    calculation("Midpoint of (1,3) and (5,7).", "x=3, y=5.", "(3,5).", "(3,5)"),
    calculation("Is the midpoint only an x-average?", "Both coordinates are averaged.", "no", "no"),
  ],
  171: [
    calculation("1:1 section of (0,0) to (6,0).", "Halfway.", "(3,0).", "(3,0)"),
    calculation("1:2 section of (0,0) to (6,0).", "2/(1+2)*6=4 from B, so x=2.", "(2,0).", "(2,0)"),
    calculation("2:1 section of (0,0) to (6,0).", "Closer to B.", "(4,0).", "(4,0)"),
  ],
  172: [
    calculation("Slope from (0,1) to (2,5).", "Rise 4, run 2.", "2.", "2"),
    calculation("Slope from (1,2) to (3,8).", "Rise 6, run 2.", "3.", "3"),
    calculation("If you subtract in opposite orders, what happens to m?", "The sign flips.", "sign flips", "sign flips"),
  ],
  173: [
    calculation("Line through (0,1) with slope 2.", "y-1=2x.", "y=2x+1.", "y=2x+1"),
    calculation("Does (3,7) lie on y=2x+1?", "2*3+1=7.", "yes", "yes"),
    calculation("Is y=2x the same line?", "It misses (0,1).", "no", "no"),
  ],
  174: [
    calculation("Are y=2x and y=2x+3 parallel?", "Both slopes are 2.", "yes", "yes"),
    calculation("Are y=2x and y=3x parallel?", "Slopes 2 and 3 differ.", "no", "no"),
    calculation("What vertical gap is between y=2x and y=2x+3?", "Intercept difference 3.", "3.", "3"),
  ],
  175: [
    calculation("Perpendicular slope to m=2.", "-1/2.", "-1/2.", "-1/2"),
    calculation("Product of 2 and -1/2.", "2*(-1/2)=-1.", "-1.", "-1"),
    calculation("Is the perpendicular to y=2x also slope 2?", "That would be parallel.", "no", "no"),
  ],
  176: [
    calculation("Angle between y=x and the x-axis.", "m1=1, m2=0.", "45°.", "45°"),
    calculation("tanθ for m1=1, m2=0.", "|(0-1)/(1+0)|=1.", "1.", "1"),
    calculation("Do you subtract slopes only?", "Need the full tan formula.", "no", "no"),
  ],
  177: [
    calculation("Distance from (0,0) to 3x+4y-12=0.", "|-12|/5.", "2.4.", "2.4"),
    calculation("What is √(3^2+4^2)?", "√25=5.", "5.", "5"),
    calculation("Is the distance just 12?", "Divide by the norm 5.", "no", "no"),
  ],
  178: [
    calculation("Does (3,4) lie on x^2+y^2=25?", "9+16=25.", "yes", "yes"),
    calculation("What radius is x^2+y^2=25?", "r^2=25.", "5.", "5"),
    calculation("Is one point the whole locus?", "The locus is the full set.", "no", "no"),
  ],
  179: [
    calculation("Map (1,3) by (x,y)→(x+2,y-1).", "x becomes 3.", "(3,2).", "(3,2)"),
    calculation("Map (0,0) by the same rule.", "(2,-1).", "(2,-1).", "(2,-1)"),
    calculation("Do you apply the rule to only one coordinate?", "Both coordinates change.", "no", "no"),
  ],
  180: [
    calculation("Convert (r,θ)=(3,0°) to Cartesian.", "x=3 cos 0=3.", "(3,0).", "(3,0)"),
    calculation("Convert (3,90°).", "x=0, y=3.", "(0,3).", "(0,3)"),
    calculation("Is (3,90°) the Cartesian point (3,90)?", "Convert with cos and sin.", "no", "no"),
  ],
  181: [
    calculation("For x=t, y=2t, find the point at t=3.", "x=3, y=6.", "(3,6).", "(3,6)"),
    calculation("What Cartesian line is x=t, y=2t?", "y=2x.", "y=2x.", "y=2x"),
    calculation("Find the point at t=0.", "(0,0).", "(0,0).", "(0,0)"),
  ],
  182: [
    calculation("Barycentric midpoint of AB.", "Weights 1/2, 1/2, 0.", "(1/2,1/2,0).", "(1/2, 1/2, 0)"),
    calculation("Barycentric centroid.", "Equal thirds.", "(1/3,1/3,1/3).", "(1/3, 1/3, 1/3)"),
    calculation("Must the three weights sum to 1?", "They are shares of a whole.", "yes", "yes"),
  ],
  183: [
    calculation("Magnitude of <3,4>.", "√(9+16)=5.", "5.", "5"),
    calculation("Is <3,4> a scalar?", "It has direction.", "no", "no"),
    calculation("What are the components of the arrow to (3,4)?", "<3,4>.", "<3, 4>.", "<3, 4>"),
  ],
  184: [
    calculation("Write <3,4> in i,j form.", "3i+4j.", "3i+4j.", "3i+4j"),
    calculation("What is the i-component of <3,4>?", "The x-part is 3.", "3.", "3"),
    calculation("Is the single number 7 the component form?", "Components stay separate.", "no", "no"),
  ],
  185: [
    calculation("Position vector of A(2,3).", "OA=<2,3>.", "<2, 3>.", "<2, 3>"),
    calculation("Where is the tail of a position vector?", "At the origin.", "origin", "origin"),
    calculation("If A is (2,3), what point is the tip of OA?", "(2,3).", "(2,3).", "(2,3)"),
  ],
  186: [
    calculation("Add <1,2>+<3,4>.", "x: 1+3=4.", "<4, 6>.", "<4, 6>"),
    calculation("Is the resultant length √5+5?", "Add components, then the length.", "no", "no"),
    calculation("Add <0,1>+<2,0>.", "<2,1>.", "<2, 1>.", "<2, 1>"),
  ],
  187: [
    calculation("Compute <5,1>-<2,3>.", "5-2=3.", "<3, -2>.", "<3, -2>"),
    calculation("What is <2,3>-<5,1>?", "The opposite difference.", "<-3, 2>.", "<-3, 2>"),
    calculation("Is a-b the same as b-a?", "They are opposites.", "no", "no"),
  ],
  188: [
    calculation("Compute 3<2,1>.", "3*2=6.", "<6, 3>.", "<6, 3>"),
    calculation("Compute -<2,1>.", "Opposite direction.", "<-2, -1>.", "<-2, -1>"),
    calculation("Is 3<2,1> equal to <5,4>?", "That added 3 instead of scaling.", "no", "no"),
  ],
  189: [
    calculation("Find |<3,4>|.", "√25=5.", "5.", "5"),
    calculation("Find the unit vector of <3,4>.", "Divide by 5.", "<3/5, 4/5>.", "<3/5, 4/5>"),
    calculation("Is <3,4> already a unit vector?", "Its length is 5, not 1.", "no", "no"),
  ],
  190: [
    calculation("Compute <1,2>·<3,4>.", "1*3+2*4.", "11.", "11"),
    calculation("If a·b=0, what angle is that?", "cos θ=0.", "90°.", "90°"),
    calculation("Is the dot product a vector?", "It is a scalar.", "no", "no"),
  ],
  191: [
    calculation("What is i×j?", "Right-hand rule.", "k.", "k"),
    calculation("|<3,0,0>×<0,2,0>|?", "Area of the 3-by-2 rectangle.", "6.", "6"),
    calculation("Is a×b the same as a·b=11?", "Cross is a vector (or 2D area).", "no", "no"),
  ],
  192: [
    calculation("Project <2,2> onto <1,0>.", "Shadow on the x-axis.", "<2, 0>.", "<2, 0>"),
    calculation("Is the projection a scalar only?", "It is a vector along b.", "no", "no"),
    calculation("proj of <4,0> onto <1,0>.", "Already along b.", "<4, 0>.", "<4, 0>"),
  ],
  193: [
    calculation("Compute 2<1,0>+3<0,1>.", "<2,0>+<0,3>.", "<2, 3>.", "<2, 3>"),
    calculation("Is the combination the scalar 5?", "Add the scaled vectors.", "no", "no"),
    calculation("Compute 1<3,1>+0<0,1>.", "<3, 1>.", "<3, 1>.", "<3, 1>"),
  ],
  194: [
    calculation("r=<1,2>+t<2,0>. Point at t=0.", "Just a.", "(1,2).", "(1,2)"),
    calculation("Point at t=2.", "<1,2>+<4,0>=<5,2>.", "(5,2).", "(5,2)"),
    calculation("Is t only 0 or 1?", "Any real t is on the line.", "no", "no"),
  ],
  195: [
    calculation("n=<0,0,1>, a=<0,0,3>. What plane?", "n·(r-a)=0.", "z=3.", "z=3"),
    calculation("Is a direction in the plane a normal?", "Normal is perpendicular to the plane.", "no", "no"),
    calculation("Does (1,2,3) lie on z=3?", "The z-coordinate is 3.", "yes", "yes"),
  ],
  196: [
    calculation("v_A=8 east, v_B=3 east. Find v_AB.", "8-3=5.", "5 east", "5 east"),
    calculation("If B goes 3 west and A 8 east, relative speed?", "8-(-3)=11.", "11.", "11"),
    calculation("Do you add 8+3 when both go east?", "Same direction uses a difference.", "no", "no"),
  ],
  197: [
    calculation("3 N east and 4 N north. Resultant?", "3-4-5 triangle.", "5 N.", "5 N"),
    calculation("Is the net force 3+4=7 N?", "Add as vectors.", "no", "no"),
    calculation("Equilibrium net force?", "The vector sum is 0.", "0.", "0"),
  ],
  198: [
    calculation("How many degrees of freedom has a free plane point?", "x and y are independent.", "2.", "2"),
    calculation("Can a free point move from (1,2) to (4,-1)?", "No constraint binds it.", "yes", "yes"),
    calculation("Is a point on x^2+y^2=1 free?", "The circle constrains it.", "no", "no"),
  ],
  199: [
    calculation("Is (5,0) on x^2+y^2=25?", "25+0=25.", "yes", "yes"),
    calculation("Is (6,0) on that circle?", "36≠25.", "no", "no"),
    calculation("Can a point on the circle slide to (0,5)?", "0+25=25.", "yes", "yes"),
  ],
  200: [
    calculation("Solve y=x+1 and y=-x+3.", "x+1=-x+3.", "(1,2).", "(1,2)"),
    calculation("Check (1,2) in both lines.", "2=2 and 2=2.", "yes", "yes"),
    calculation("Is (0,1) the intersection?", "It lies only on the first line.", "no", "no"),
  ],
  201: [
    calculation("Midpoint of (-4,2) and (4,-1).", "x-average 0.", "(0, 0.5).", "(0, 0.5)"),
    calculation("Distance from the midpoint to (-4,2).", "Δx=4, Δy=1.5.", "equal", "equal"),
    calculation("Is (0,2) the midpoint?", "y was not averaged.", "no", "no"),
  ],
  202: [
    calculation("An attached point on r=5: is (6,0) legal?", "36≠25.", "No.", "no"),
    calculation("After detach, is (6,0) legal?", "The point is free.", "yes", "yes"),
    calculation("Does attach add a constraint?", "The parent object binds the point.", "yes", "yes"),
  ],
  203: [
    calculation("Line through (0,1) and (2,5).", "m=(5-1)/(2-0)=2.", "y=2x+1.", "y=2x+1"),
    calculation("Slope of that line.", "4/2=2.", "2.", "2"),
    calculation("Do two distinct points determine more than one line?", "Uniqueness.", "no", "no"),
  ],
  204: [
    calculation("Length of the segment from (0,0) to (5,0).", "Δx=5.", "5.", "5"),
    calculation("Is (6,0) on that segment?", "t would be 1.2>1.", "no", "no"),
    calculation("Is a segment the same as the whole line?", "A segment is finite.", "no", "no"),
  ],
  205: [
    calculation("Copy length 5 onto a ray. How far is the new end?", "The compass opening is 5.", "5.", "5"),
    calculation("If you mark 3 instead, is the copy correct?", "3≠5.", "no", "no"),
    calculation("What tool holds the length?", "A compass opening.", "compass", "compass"),
  ],
  206: [
    calculation("Ray from 0 through 4: is 8 on the ray?", "8=2*4, t=2≥0.", "yes", "yes"),
    calculation("Is -2 on that ray?", "Opposite half-line.", "no", "no"),
    calculation("Is the start 0 on the ray?", "A ray includes its origin.", "yes", "yes"),
  ],
  207: [
    calculation("Path A-B-C with lengths 3 and 4. Path length?", "3+4=7.", "7.", "7"),
    calculation("Is an open polyline a polygon?", "It is not closed.", "no", "no"),
    calculation("How many ends does an open polyline have?", "A start and a finish.", "2.", "2"),
  ],
  208: [
    calculation("Perpendicular to y=2x through the origin.", "m=-1/2.", "y=-x/2.", "y=-x/2"),
    calculation("Product of 2 and -1/2.", "-1.", "-1.", "-1"),
    calculation("Should the new line also have slope 2?", "That is parallel.", "no", "no"),
  ],
  209: [
    calculation("Parallel to y=2x through (0,3).", "Same slope 2.", "y=2x+3.", "y=2x+3"),
    calculation("Does (1,5) lie on y=2x+3?", "2+3=5.", "yes", "yes"),
    calculation("Do you change the slope to hit the point?", "Copy the slope; change the intercept.", "no", "no"),
  ],
  210: [
    calculation("Perp bisector of (0,0) and (4,0).", "Midpoint (2,0).", "x=2.", "x=2"),
    calculation("Is a point on x=2 equidistant from 0 and 4 on the x-axis?", "Yes, by construction.", "yes", "yes"),
    calculation("Can the perp miss the midpoint?", "Then it is not the bisector.", "no", "no"),
  ],
  211: [
    calculation("Bisect an 80° angle.", "80/2=40.", "40° and 40°.", "40°, 40°"),
    calculation("Bisect 90°.", "45° and 45°.", "45°, 45°.", "45°, 45°"),
    calculation("Is 30° and 50° a bisector of 80°?", "The halves must be equal.", "no", "no"),
  ],
  212: [
    calculation("Tangent at (5,0) on x^2+y^2=25.", "Radius is along the x-axis.", "x=5.", "x=5"),
    calculation("How many times does a tangent meet the circle?", "Exactly one point.", "1.", "1"),
    calculation("Is a two-hit secant a tangent?", "Tangent hits once.", "no", "no"),
  ],
  213: [
    calculation("Must a best-fit line pass through every data point?", "It minimises residuals.", "no", "no"),
    calculation("Trend of (1,2),(2,3),(3,5) is nearest which slope?", "Rise about 3 over run 2.", "1.5", "1.5"),
    calculation("Are three non-collinear points on one exact line?", "No exact interpolant.", "no", "no"),
  ],
  214: [
    calculation("Do sides 3,4,5 form a triangle?", "3+4>5 and 9+16=25.", "yes", "yes"),
    calculation("Do sides 1,2,5 form a triangle?", "1+2=3<5.", "no", "no"),
    calculation("What is 3^2+4^2?", "9+16=25=5^2.", "25.", "25"),
  ],
  215: [
    calculation("Exterior angle of a regular hexagon.", "360/6=60.", "60°.", "60°"),
    calculation("Interior angle of a regular hexagon.", "180-60=120.", "120°.", "120°"),
    calculation("Exterior of a square?", "360/4=90.", "90°.", "90°"),
  ],
  216: [
    calculation("After a rigid turn, what are sides 3,4,5?", "Distances are preserved.", "3, 4, 5", "3, 4, 5"),
    calculation("Does a rigid motion change angles?", "Isometries keep angles.", "no", "no"),
    calculation("If a side stretches during a drag, is it rigid?", "Length changed.", "no", "no"),
  ],
  217: [
    calculation("Perimeter of sides 2,3,4,5.", "2+3+4+5=14.", "14.", "14"),
    calculation("Is A-B-C-D without D-A a polygon?", "It is open.", "no", "no"),
    calculation("What extra side closes A-B-C-D?", "D to A.", "DA", "DA"),
  ],
  218: [
    calculation("Radius from (0,0) to (3,4).", "√(9+16)=5.", "5.", "5"),
    calculation("Does (5,0) lie on that circle?", "25=25.", "yes", "yes"),
    calculation("If P moves, does r stay the old 5 automatically?", "r is |CP| now.", "no", "no"),
  ],
  219: [
    calculation("Circle centre (0,0), r=4. Is (4,0) on it?", "Distance 4.", "yes", "yes"),
    calculation("Is (5,0) on it?", "Distance 5≠4.", "no", "no"),
    calculation("If the diameter is 8, what is r?", "Half of 8.", "4.", "4"),
  ],
  220: [
    calculation("Circumcentre of (0,0),(6,0),(0,8).", "Bisectors x=3 and y=4.", "(3,4).", "(3,4)"),
    calculation("Circumradius from (3,4) to (0,0).", "√(9+16)=5.", "5.", "5"),
    calculation("Do three collinear points determine a circle?", "No unique circumcentre.", "no", "no"),
  ],
  221: [
    calculation("Copy radius 5. What opening do you keep?", "The source radius.", "5.", "5"),
    calculation("If the hinge closes to 3, is the copy equal?", "3≠5.", "no", "no"),
    calculation("What must stay fixed during the swing?", "The compass opening.", "opening", "opening"),
  ],
  222: [
    calculation("Arc measure of a semicircle.", "Half of 360°.", "180°.", "180°"),
    calculation("Area of a semicircle with r=2.", "(1/2)π*4=2π.", "2π.", "2π"),
    calculation("Is a 60° arc a semicircle?", "It is not 180°.", "no", "no"),
  ],
  223: [
    calculation("Arc length r=2, θ=3 rad.", "s=rθ=6.", "6.", "6"),
    calculation("Is the chord the arc length?", "The arc follows the curve.", "no", "no"),
    calculation("If θ=90° and r=2, first convert θ.", "90°=π/2.", "π.", "π"),
  ],
  224: [
    calculation("If the circumradius is 5, what r does the arc use?", "The same circumcircle.", "5.", "5"),
    calculation("May you draw the arc on a circle of radius 3?", "That is a different circle.", "no", "no"),
    calculation("What must you construct first?", "The circumcircle.", "circumcircle", "circumcircle"),
  ],
  225: [
    calculation("Sector area r=2, θ=2 rad.", "(1/2)*4*2=4.", "4.", "4"),
    calculation("Is the sector only the curved edge?", "It includes the region.", "no", "no"),
    calculation("Sector area r=4, θ=1/2.", "(1/2)*16*(1/2)=4.", "4.", "4"),
  ],
  226: [
    calculation("How many suitable points determine a general conic?", "Five independent conditions.", "5.", "5"),
    calculation("Do four points determine a unique conic?", "Under-determined.", "no", "no"),
    calculation("How many coefficients does Ax^2+...+F=0 have up to scale?", "Six, minus scale.", "5", "5"),
  ],
  227: [
    calculation("Ellipse with 2a=10. What is the constant sum?", "PF1+PF2=10.", "10.", "10"),
    calculation("If 2c=6 and a=5, find b.", "b^2=25-9=16.", "4.", "4"),
    calculation("Do you use a constant difference for an ellipse?", "That is a hyperbola.", "no", "no"),
  ],
  228: [
    calculation("Hyperbola with |PF1-PF2|=6. What is 2a?", "The constant difference.", "6.", "6"),
    calculation("How many branches does a hyperbola have?", "Two open branches.", "2.", "2"),
    calculation("Do you use a distance sum for a hyperbola?", "That is an ellipse.", "no", "no"),
  ],
  229: [
    calculation("Focus (0,1), directrix y=-1. Where is the vertex?", "Halfway at (0,0).", "(0,0).", "(0,0)"),
    calculation("Does a parabola have two foci?", "One focus and a directrix.", "no", "no"),
    calculation("For y=x^2/4, what is the focus?", "4p=4 so p=1.", "(0,1).", "(0,1)"),
  ],
  230: [
    calculation("Distance from (1,4) to (4,8).", "Δx=3, Δy=4.", "5.", "5"),
    calculation("Can length be negative?", "Distance is non-negative.", "no", "no"),
    calculation("Is the length 3+4=7?", "Use the hypotenuse.", "no", "no"),
  ]
};

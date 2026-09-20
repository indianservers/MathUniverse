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

export const batch4NumericalExamples: Readonly<Record<number, readonly NumericalExampleSeed[]>> = {
  231: [
    calculation("Find triangle area with base 6 and height 4.", "Use A=1/2 bh.", "12.", "12"),
    calculation("Find the labelled area for base 10 and height 5.", "Use the Area formula.", "50.", "50"),
    calculation("If the height doubles from 5 to 10, what happens to this area model?", "Area scales with perpendicular height.", "doubles.", "doubles"),
  ],
  232: [
    calculation("How many degrees are in a right angle?", "A right angle is a quarter turn.", "90.", "90"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 30° and 60°. What is the sum?", "30+60.", "90.", "90"),
  ],
  233: [
    calculation("If a fixed angle is 60 degrees, what is its measure after dragging?", "Fixed means constant.", "60.", "60"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 40° and 70°. What is the sum?", "40+70.", "110.", "110"),
  ],
  234: [
    calculation("What should perpendicular lines measure?", "Perpendicular means meeting at a right angle.", "90.", "90"),
    calculation("In Relation Checker, evaluate the labelled model at input 5.", "Substitute 5 into the Relation Checker rule.", "10.", "10"),
    calculation("Compare the Relation Checker outputs at 5 and 7. What is the difference?", "Second input 7.", "2.", "2"),
  ],
  235: [
    calculation("Can a perpendicular bisector be built before its segment?", "It depends on the segment.", "no.", "no"),
    calculation("In Construction Steps, evaluate the labelled model at input 6.", "Substitute 6 into the Construction Steps rule.", "18.", "18"),
    calculation("Compare the Construction Steps outputs at 6 and 9. What is the difference?", "Second input 9.", "3.", "3"),
  ],
  236: [
    calculation("Translate (2,3) by (4,-1).", "Add x-components: 2+4=6.", "(6,2).", "(6,2)"),
    calculation("Translate ( 7, 4 ) by vector <9, 1>.", "Add the vector.", "(16, 5).", "(16, 5)"),
    calculation("Rotate ( 7, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 7).", "(0, 7)"),
  ],
  237: [
    calculation("What is special about the mirror line for P and P'?", "P and P' are matching points.", "perpendicular bisector.", "perpendicular bisector"),
    calculation("Translate ( 8, 5 ) by vector <10, 1>.", "Add the vector.", "(18, 6).", "(18, 6)"),
    calculation("Rotate ( 8, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 8).", "(0, 8)"),
  ],
  238: [
    calculation("If C is midpoint of PP', what transformation is shown?", "P and P' are opposite through C.", "point reflection.", "point reflection"),
    calculation("Translate ( 9, 6 ) by vector <4, 1>.", "Add the vector.", "(13, 7).", "(13, 7)"),
    calculation("Rotate ( 9, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 9).", "(0, 9)"),
  ],
  239: [
    calculation("If r=6 and OP=3, find OP'.", "Use OP*OP'=r^2.", "12.", "12"),
    calculation("Translate ( 10, 7 ) by vector <5, 1>.", "Add the vector.", "(15, 8).", "(15, 8)"),
    calculation("Rotate ( 10, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 10).", "(0, 10)"),
  ],
  240: [
    calculation("After rotation, what happens to distance from centre?", "Rotation is rigid.", "unchanged.", "unchanged"),
    calculation("Translate ( 3, 2 ) by vector <6, 1>.", "Add the vector.", "(9, 3).", "(9, 3)"),
    calculation("Rotate ( 3, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 3).", "(0, 3)"),
  ],
  241: [
    calculation("If OP=4 and k=3, find OP'.", "Use OP'=k*OP.", "12.", "12"),
    calculation("Translate ( 4, 3 ) by vector <7, 1>.", "Add the vector.", "(11, 4).", "(11, 4)"),
    calculation("Rotate ( 4, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 4).", "(0, 4)"),
  ],
  242: [
    calculation("If A doubles x and y, where does (2,3) go?", "Double the x-coordinate.", "(4,6).", "(4,6)"),
    calculation("Find det([[5,4],[0,8]]).", "5*8-4*0.", "40.", "40"),
    calculation("What is the size of a 4 by 8 product if inner sizes match?", "Rows from the first matrix.", "4 by 8.", "4 by 8"),
  ],
  243: [
    calculation("Why track one point in a composition?", "The image is built step by step.", "check order.", "check order"),
    calculation("Translate ( 6, 5 ) by vector <9, 1>.", "Add the vector.", "(15, 6).", "(15, 6)"),
    calculation("Rotate ( 6, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 6).", "(0, 6)"),
  ],
  244: [
    calculation("What does A -> A' mean?", "A is the original point.", "A maps to A'.", "A maps to A'"),
    calculation("Translate ( 7, 6 ) by vector <10, 1>.", "Add the vector.", "(17, 7).", "(17, 7)"),
    calculation("Rotate ( 7, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 7).", "(0, 7)"),
  ],
  245: [
    calculation("Does dilation preserve length?", "Dilation multiplies distances by a scale factor.", "no.", "no"),
    calculation("Translate ( 8, 7 ) by vector <4, 1>.", "Add the vector.", "(12, 8).", "(12, 8)"),
    calculation("Rotate ( 8, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 8).", "(0, 8)"),
  ],
  246: [
    calculation("What must happen after a symmetry transformation?", "Transform the shape.", "exact match.", "exact match"),
    calculation("Translate ( 9, 2 ) by vector <5, 1>.", "Add the vector.", "(14, 3).", "(14, 3)"),
    calculation("Rotate ( 9, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 9).", "(0, 9)"),
  ],
  247: [
    calculation("What is the locus of points 5 units from O?", "Fixed distance from one point is a circle.", "circle.", "circle"),
    calculation("Points at distance 10 from a fixed point form what?", "Equal distance from one point.", "circle.", "circle"),
    calculation("Points equidistant from two points lie on what?", "Equal distance from A and B.", "perpendicular bisector.", "perpendicular bisector"),
  ],
  248: [
    calculation("What is the locus equidistant from two points A and B?", "Points must satisfy PA=PB.", "perpendicular bisector.", "perpendicular bisector"),
    calculation("Points at distance 3 from a fixed point form what?", "Equal distance from one point.", "circle.", "circle"),
    calculation("Points equidistant from two points lie on what?", "Equal distance from A and B.", "perpendicular bisector.", "perpendicular bisector"),
  ],
  249: [
    calculation("What controls a moving-linkage locus?", "The point is attached to a linkage.", "constraints.", "constraints"),
    calculation("Translate ( 4, 5 ) by vector <8, 1>.", "Add the vector.", "(12, 6).", "(12, 6)"),
    calculation("Rotate ( 4, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 4).", "(0, 4)"),
  ],
  250: [
    calculation("Does one line make an envelope?", "An envelope needs a family of lines.", "no.", "no"),
    calculation("Translate ( 5, 6 ) by vector <9, 1>.", "Add the vector.", "(14, 7).", "(14, 7)"),
    calculation("Rotate ( 5, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 5).", "(0, 5)"),
  ],
  251: [
    calculation("What does a dynamic trace record?", "A point moves.", "path.", "path"),
    calculation("Translate ( 6, 7 ) by vector <10, 1>.", "Add the vector.", "(16, 8).", "(16, 8)"),
    calculation("Rotate ( 6, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 6).", "(0, 6)"),
  ],
  252: [
    calculation("Can many examples replace proof?", "Examples can support a claim.", "no.", "no"),
    calculation("Translate ( 7, 2 ) by vector <4, 1>.", "Add the vector.", "(11, 3).", "(11, 3)"),
    calculation("Rotate ( 7, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 7).", "(0, 7)"),
  ],
  253: [
    calculation("Is measuring one diagram an exact proof?", "One diagram is only one case.", "no.", "no"),
    calculation("Translate ( 8, 3 ) by vector <5, 1>.", "Add the vector.", "(13, 4).", "(13, 4)"),
    calculation("Rotate ( 8, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 8).", "(0, 8)"),
  ],
  254: [
    calculation("If triangle area ABC is 0, what does that suggest?", "Three non-collinear points make area.", "collinear.", "collinear"),
    calculation("Translate ( 9, 4 ) by vector <6, 1>.", "Add the vector.", "(15, 5).", "(15, 5)"),
    calculation("Rotate ( 9, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 9).", "(0, 9)"),
  ],
  255: [
    calculation("Are three lines concurrent if only two meet at P?", "Two lines always meet or are parallel.", "no.", "no"),
    calculation("Translate ( 10, 5 ) by vector <7, 1>.", "Add the vector.", "(17, 6).", "(17, 6)"),
    calculation("Rotate ( 10, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 10).", "(0, 10)"),
  ],
  256: [
    calculation("What must be true for four points to be concyclic?", "One circle must pass through them.", "one circle.", "one circle"),
    calculation("Translate ( 3, 6 ) by vector <8, 1>.", "Add the vector.", "(11, 7).", "(11, 7)"),
    calculation("Rotate ( 3, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 3).", "(0, 3)"),
  ],
  257: [
    calculation("Convert 180 degrees to radians.", "180 degrees equals pi radians by definition.", "pi.", "pi"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 40° and 70°. What is the sum?", "40+70.", "110.", "110"),
  ],
  258: [
    calculation("What are coordinates at 0 degrees?", "The point is on the positive x-axis.", "(1,0).", "(1,0)"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  259: [
    calculation("If opposite=3 and hypotenuse=5, find sin theta.", "Use sin=opposite/hypotenuse.", "0.6.", "0.6"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 60° and 30°. What is the sum?", "60+30.", "90.", "90"),
  ],
  260: [
    calculation("Find sin 30 degrees.", "Use the 30-60-90 triangle.", "1/2.", "1/2"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  261: [
    calculation("What is the period of y=sin x?", "One full unit-circle turn is 2 pi.", "2 pi.", "2 pi"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  262: [
    calculation("What is cos 0?", "At 0 degrees", "1.", "1"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  263: [
    calculation("Why is tan 90 degrees undefined?", "tan=sin/cos.", "cos is 0.", "cos is 0"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  264: [
    calculation("If cos theta=1/2, find sec theta.", "sec=1/cos.", "2.", "2"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  265: [
    calculation("Find sin^-1(1/2) in degrees.", "Ask which principal angle has sine 1/2.", "30.", "30"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  266: [
    calculation("Why does sin^2 theta + cos^2 theta equal 1?", "The unit-circle point is (cos theta", "unit circle.", "unit circle"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  267: [
    calculation("Is sin(A+B)=sin A+sin B true?", "Sine is not distributive over angle addition.", "false.", "false"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 60° and 50°. What is the sum?", "60+50.", "110.", "110"),
  ],
  268: [
    calculation("If sin A=1/2 and cos A=sqrt(3)/2, find sin 2A.", "Use sin 2A=2 sin A cos A.", "sqrt(3)/2.", "sqrt(3)/2"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 70° and 60°. What is the sum?", "70+60.", "130.", "130"),
  ],
  269: [
    calculation("Solve sin theta=1/2 for 0<=theta<360.", "Reference angle is 30 degrees.", "30, 150.", "30, 150"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  270: [
    calculation("In the sine rule, side a pairs with which angle?", "The formula uses a/sin A.", "A.", "A"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  271: [
    calculation("What does the cosine rule become when C=90 degrees?", "cos 90=0.", "Pythagoras.", "Pythagoras"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  272: [
    calculation("Find area when a=6, b=4, C=90 degrees.", "Use A=1/2 ab sin C.", "12.", "12"),
    calculation("Find the labelled triangle area formula for base 3 and height 4.", "Use the Triangle Area Formula formula.", "6.", "6"),
    calculation("If the height doubles from 4 to 8, what happens to this area model?", "Area scales with perpendicular height.", "doubles.", "doubles"),
  ],
  273: [
    calculation("How is a bearing measured?", "Start from north.", "clockwise from north.", "clockwise from north"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 40° and 50°. What is the sum?", "40+50.", "90.", "90"),
  ],
  274: [
    calculation("Is elevation measured above or below horizontal?", "Elevation means looking up.", "above.", "above"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 50° and 60°. What is the sum?", "50+60.", "110.", "110"),
  ],
  275: [
    calculation("If peak is 5 and midline is 2, what is amplitude?", "Amplitude is distance from midline to peak.", "3.", "3"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  276: [
    calculation("If r=2 and theta=0, find (x,y).", "Use x=r cos theta and y=r sin theta.", "(2,0).", "(2,0)"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  277: [
    calculation("If f(x) approaches 4 near x=2, what is the limit?", "Check values close to 2.", "4.", "4"),
    calculation("Estimate lim x→8 of (x-8)/(x-8) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=8 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  278: [
    calculation("If left limit is 2 and right limit is 5, does the two-sided limit exist?", "Compare the two one-sided limits.", "no.", "no"),
    calculation("Estimate lim x→9 of (x-9)/(x-9) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=9 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  279: [
    calculation("What happens to 1/x as x approaches 0 from the right?", "Positive x-values get very small.", "infinity.", "infinity"),
    calculation("Estimate lim x→10 of (x-10)/(x-10) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=10 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  280: [
    calculation("What does y=1/x approach as x goes to infinity?", "As x grows", "0.", "0"),
    calculation("Estimate lim x→3 of (x-3)/(x-3) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=3 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  281: [
    calculation("If limit is 3 but f(a)=5, is the function continuous at a?", "The limit exists.", "no.", "no"),
    calculation("Estimate lim x→4 of (x-4)/(x-4) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=4 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  282: [
    calculation("If left and right limits disagree, what type can it be?", "The graph approaches different values.", "jump.", "jump"),
    calculation("Estimate lim x→5 of (x-5)/(x-5) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=5 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  283: [
    calculation("What does epsilon control?", "Epsilon is around the output value.", "output closeness.", "output closeness"),
    calculation("Estimate lim x→6 of (x-6)/(x-6) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=6 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  284: [
    calculation("For f(x)=x^2 from 1 to 3, find average rate.", "f(3)=9 and f(1)=1.", "4.", "4"),
    calculation("Estimate lim x→7 of (x-7)/(x-7) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=7 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  285: [
    calculation("For f(x)=x^2, what is f'(2)?", "Derivative is 2x.", "4.", "4"),
    calculation("Estimate lim x→8 of (x-8)/(x-8) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=8 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  286: [
    calculation("Why not set h=0 immediately?", "The quotient has division by h.", "division by zero.", "division by zero"),
    calculation("Estimate lim x→9 of (x-9)/(x-9) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=9 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  287: [
    calculation("For f(x)=x^2 at x=2, what is tangent slope?", "Derivative is 2x.", "4.", "4"),
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
  ],
  288: [
    calculation("If tangent slope is 2, what is normal slope?", "Take negative reciprocal.", "-1/2.", "-1/2"),
    calculation("Estimate lim x→3 of (x-3)/(x-3) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=3 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  289: [
    calculation("If f is increasing, what sign can f' have?", "Increasing means positive local slope.", "positive.", "positive"),
    calculation("Estimate lim x→4 of (x-4)/(x-4) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=4 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  290: [
    calculation("For f(x)=x^3, find f''(x).", "f'(x)=3x^2.", "6x.", "6x"),
    calculation("Estimate lim x→5 of (x-5)/(x-5) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=5 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  291: [
    calculation("Differentiate x^2 sin x.", "u=x^2", "2x sin x + x^2 cos x.", "2x sin x + x^2 cos x"),
    calculation("Estimate lim x→6 of (x-6)/(x-6) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=6 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  292: [
    calculation("What is the denominator in the quotient rule?", "The rule is (u'v-uv')/v^2.", "v^2.", "v^2"),
    calculation("Estimate lim x→7 of (x-7)/(x-7) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=7 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  293: [
    calculation("Differentiate (3x+1)^2.", "Outside is square.", "6(3x+1).", "6(3x+1)"),
    calculation("Estimate lim x→8 of (x-8)/(x-8) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=8 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  294: [
    calculation("Differentiate y^2 with respect to x.", "y depends on x.", "2y dy/dx.", "2y dy/dx"),
    calculation("Estimate lim x→9 of (x-9)/(x-9) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=9 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  295: [
    calculation("If dy/dt=6 and dx/dt=2, find dy/dx.", "Use dy/dx=(dy/dt)/(dx/dt).", "3.", "3"),
    calculation("Estimate lim x→10 of (x-10)/(x-10) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=10 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  296: [
    calculation("If f'(2)=0, what is x=2 called?", "Derivative is zero.", "critical point.", "critical point"),
    calculation("Estimate lim x→3 of (x-3)/(x-3) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=3 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  297: [
    calculation("If f'(x)>0 on an interval, what is f doing?", "Positive derivative means positive slope.", "increasing.", "increasing"),
    calculation("Estimate lim x→4 of (x-4)/(x-4) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=4 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  298: [
    calculation("Can a local maximum fail to be global?", "Local compares nearby values only.", "yes.", "yes"),
    calculation("Estimate lim x→5 of (x-5)/(x-5) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=5 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  299: [
    calculation("If f''(x)>0, what is the concavity?", "Positive second derivative means slopes increase.", "concave up.", "concave up"),
    calculation("Estimate lim x→6 of (x-6)/(x-6) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=6 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  300: [
    calculation("Is f''=0 enough to prove inflection?", "It gives a candidate.", "no.", "no"),
    calculation("Estimate lim x→7 of (x-7)/(x-7) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=7 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  301: [
    calculation("Why compare endpoints in optimisation?", "The best value may occur at a boundary.", "boundary can win.", "boundary can win"),
    calculation("Estimate lim x→8 of (x-8)/(x-8) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=8 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  302: [
    calculation("If A=pi r^2, what is dA/dt?", "Differentiate with respect to t.", "2pi r dr/dt.", "2pi r dr/dt"),
    calculation("Estimate lim x→9 of (x-9)/(x-9) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=9 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  303: [
    calculation("If s(t)=t^2, find v(t).", "Velocity is s'(t).", "2t.", "2t"),
    calculation("Estimate lim x→10 of (x-10)/(x-10) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=10 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  304: [
    calculation("What must not be zero in Newton's method?", "The formula divides by f'(x_n).", "f'(x_n).", "f'(x_n)"),
    calculation("Estimate lim x→3 of (x-3)/(x-3) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=3 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  305: [
    calculation("What is the first Taylor polynomial for f near a?", "Degree 1 uses value and first derivative.", "tangent line.", "tangent line"),
    calculation("Estimate lim x→4 of (x-4)/(x-4) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=4 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  306: [
    calculation("Find the labelled area by rectangles for base 5 and height 2.", "Use the Area by Rectangles formula.", "10.", "10"),
    calculation("If the height doubles from 2 to 4, what happens to this area model?", "Area scales with perpendicular height.", "doubles.", "doubles"),
    calculation("Is perimeter 5+2 the same as area by rectangles?", "Perimeter is boundary length.", "no.", "no"),
  ],
  307: [
    calculation("Find ∫ 3x dx from 0 to 6.", "Antiderivative 3/2 x^2.", "54.", "54"),
    calculation("If F'=3, what is F(6)-F(0) when F(t)=3t?", "F(6)=18.", "18.", "18"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  308: [
    calculation("Find ∫ 4x dx from 0 to 7.", "Antiderivative 2.0 x^2.", "98.", "98"),
    calculation("If F'=4, what is F(7)-F(0) when F(t)=4t?", "F(7)=28.", "28.", "28"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  309: [
    calculation("Find ∫ 5x dx from 0 to 8.", "Antiderivative 5/2 x^2.", "160.", "160"),
    calculation("If F'=5, what is F(8)-F(0) when F(t)=5t?", "F(8)=40.", "40.", "40"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  310: [
    calculation("Find ∫ 6x dx from 0 to 9.", "Antiderivative 3.0 x^2.", "243.", "243"),
    calculation("If F'=6, what is F(9)-F(0) when F(t)=6t?", "F(9)=54.", "54.", "54"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  311: [
    calculation("Find the labelled area between curves for base 10 and height 7.", "Use the Area Between Curves formula.", "70.", "70"),
    calculation("If the height doubles from 7 to 14, what happens to this area model?", "Area scales with perpendicular height.", "doubles.", "doubles"),
    calculation("Is perimeter 10+7 the same as area between curves?", "Perimeter is boundary length.", "no.", "no"),
  ],
  312: [
    calculation("Find ∫ 2x dx from 0 to 3.", "Antiderivative 1.0 x^2.", "9.", "9"),
    calculation("If F'=2, what is F(3)-F(0) when F(t)=2t?", "F(3)=6.", "6.", "6"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  313: [
    calculation("Find ∫ 3x dx from 0 to 4.", "Antiderivative 3/2 x^2.", "24.", "24"),
    calculation("If F'=3, what is F(4)-F(0) when F(t)=3t?", "F(4)=12.", "12.", "12"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  314: [
    calculation("Find ∫ 4x dx from 0 to 5.", "Antiderivative 2.0 x^2.", "50.", "50"),
    calculation("If F'=4, what is F(5)-F(0) when F(t)=4t?", "F(5)=20.", "20.", "20"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  315: [
    calculation("Find ∫ 5x dx from 0 to 6.", "Antiderivative 5/2 x^2.", "90.", "90"),
    calculation("If F'=5, what is F(6)-F(0) when F(t)=5t?", "F(6)=30.", "30.", "30"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  316: [
    calculation("Find ∫ 6x dx from 0 to 7.", "Antiderivative 3.0 x^2.", "147.", "147"),
    calculation("If F'=6, what is F(7)-F(0) when F(t)=6t?", "F(7)=42.", "42.", "42"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  317: [
    calculation("Find ∫ 7x dx from 0 to 8.", "Antiderivative 7/2 x^2.", "224.", "224"),
    calculation("If F'=7, what is F(8)-F(0) when F(t)=7t?", "F(8)=56.", "56.", "56"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  318: [
    calculation("Find ∫ 2x dx from 0 to 9.", "Antiderivative 1.0 x^2.", "81.", "81"),
    calculation("If F'=2, what is F(9)-F(0) when F(t)=2t?", "F(9)=18.", "18.", "18"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  319: [
    calculation("Find ∫ 3x dx from 0 to 10.", "Antiderivative 3/2 x^2.", "150.", "150"),
    calculation("If F'=3, what is F(10)-F(0) when F(t)=3t?", "F(10)=30.", "30.", "30"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  320: [
    calculation("Find ∫ 4x dx from 0 to 3.", "Antiderivative 2.0 x^2.", "18.", "18"),
    calculation("If F'=4, what is F(3)-F(0) when F(t)=4t?", "F(3)=12.", "12.", "12"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  321: [
    calculation("Find ∫ 5x dx from 0 to 4.", "Antiderivative 5/2 x^2.", "40.", "40"),
    calculation("If F'=5, what is F(4)-F(0) when F(t)=5t?", "F(4)=20.", "20.", "20"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  322: [
    calculation("Find ∫ 6x dx from 0 to 5.", "Antiderivative 3.0 x^2.", "75.", "75"),
    calculation("If F'=6, what is F(5)-F(0) when F(t)=6t?", "F(5)=30.", "30.", "30"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  323: [
    calculation("Find ∫ 7x dx from 0 to 6.", "Antiderivative 7/2 x^2.", "126.", "126"),
    calculation("If F'=7, what is F(6)-F(0) when F(t)=7t?", "F(6)=42.", "42.", "42"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  324: [
    calculation("Find ∫ 2x dx from 0 to 7.", "Antiderivative 1.0 x^2.", "49.", "49"),
    calculation("If F'=2, what is F(7)-F(0) when F(t)=2t?", "F(7)=14.", "14.", "14"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  325: [
    calculation("Find ∫ 3x dx from 0 to 8.", "Antiderivative 3/2 x^2.", "96.", "96"),
    calculation("If F'=3, what is F(8)-F(0) when F(t)=3t?", "F(8)=24.", "24.", "24"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  326: [
    calculation("Find ∫ 4x dx from 0 to 9.", "Antiderivative 2.0 x^2.", "162.", "162"),
    calculation("If F'=4, what is F(9)-F(0) when F(t)=4t?", "F(9)=36.", "36.", "36"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  327: [
    calculation("Find ∫ 5x dx from 0 to 10.", "Antiderivative 5/2 x^2.", "250.", "250"),
    calculation("If F'=5, what is F(10)-F(0) when F(t)=5t?", "F(10)=50.", "50.", "50"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  328: [
    calculation("Find ∫ 6x dx from 0 to 3.", "Antiderivative 3.0 x^2.", "27.", "27"),
    calculation("If F'=6, what is F(3)-F(0) when F(t)=6t?", "F(3)=18.", "18.", "18"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  329: [
    calculation("Find ∫ 7x dx from 0 to 4.", "Antiderivative 7/2 x^2.", "56.", "56"),
    calculation("If F'=7, what is F(4)-F(0) when F(t)=7t?", "F(4)=28.", "28.", "28"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  330: [
    calculation("Find ∫ 2x dx from 0 to 5.", "Antiderivative 1.0 x^2.", "25.", "25"),
    calculation("If F'=2, what is F(5)-F(0) when F(t)=2t?", "F(5)=10.", "10.", "10"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  331: [
    calculation("Find ∫ 3x dx from 0 to 6.", "Antiderivative 3/2 x^2.", "54.", "54"),
    calculation("If F'=3, what is F(6)-F(0) when F(t)=3t?", "F(6)=18.", "18.", "18"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  332: [
    calculation("Find ∫ 4x dx from 0 to 7.", "Antiderivative 2.0 x^2.", "98.", "98"),
    calculation("If F'=4, what is F(7)-F(0) when F(t)=4t?", "F(7)=28.", "28.", "28"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  333: [
    calculation("Find ∫ 5x dx from 0 to 8.", "Antiderivative 5/2 x^2.", "160.", "160"),
    calculation("If F'=5, what is F(8)-F(0) when F(t)=5t?", "F(8)=40.", "40.", "40"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  334: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 6 odd numbers.", "1+3+...+11.", "36.", "36"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  335: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 7 odd numbers.", "1+3+...+13.", "49.", "49"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  336: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 2 odd numbers.", "1+3+...+3.", "4.", "4"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  337: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 3 odd numbers.", "1+3+...+5.", "9.", "9"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  338: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 4 odd numbers.", "1+3+...+7.", "16.", "16"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  339: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 5 odd numbers.", "1+3+...+9.", "25.", "25"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  340: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 6 odd numbers.", "1+3+...+11.", "36.", "36"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  341: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 7 odd numbers.", "1+3+...+13.", "49.", "49"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  342: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 2 odd numbers.", "1+3+...+3.", "4.", "4"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  343: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 3 odd numbers.", "1+3+...+5.", "9.", "9"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  344: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 4 odd numbers.", "1+3+...+7.", "16.", "16"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  345: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 5 odd numbers.", "1+3+...+9.", "25.", "25"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  346: [
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 6 odd numbers.", "1+3+...+11.", "36.", "36"),
    calculation("Is a sequence the same as its series of partial sums?", "A sequence is a list.", "no.", "no"),
  ],
  347: [
    calculation("In a_23, which number names the row?", "Rows go across and columns go down.", "2.", "2"),
    calculation("Find det([[6,7],[0,8]]).", "6*8-7*0.", "48.", "48"),
    calculation("What is the size of a 7 by 8 product if inner sizes match?", "Rows from the first matrix.", "7 by 8.", "7 by 8"),
  ],
  348: [
    calculation("If entries are 3 and 5, what is their sum?", "Matrices must have the same dimensions.", "8.", "8"),
    calculation("Find det([[7,2],[0,9]]).", "7*9-2*0.", "63.", "63"),
    calculation("What is the size of a 2 by 9 product if inner sizes match?", "Rows from the first matrix.", "2 by 9.", "2 by 9"),
  ],
  349: [
    calculation("If k=3 and an entry is 4, what is the new entry?", "Multiply each entry by the scalar.", "12.", "12"),
    calculation("In Scalar Multiplication, evaluate the labelled model at input 8.", "Substitute 8 into the Scalar Multiplication rule.", "24.", "24"),
    calculation("Compare the Scalar Multiplication outputs at 8 and 11. What is the difference?", "Second input 11.", "3.", "3"),
  ],
  350: [
    calculation("What is A times I?", "Columns of the first matrix must match rows of the second.", "A.", "A"),
    calculation("Find det([[9,4],[0,4]]).", "9*4-4*0.", "36.", "36"),
    calculation("What is the size of a 4 by 4 product if inner sizes match?", "Rows from the first matrix.", "4 by 4.", "4 by 4"),
  ],
  351: [
    calculation("What is A times I?", "It has 1s on the main diagonal and 0s elsewhere.", "A.", "A"),
    calculation("Find det([[10,5],[0,5]]).", "10*5-5*0.", "50.", "50"),
    calculation("What is the size of a 5 by 5 product if inner sizes match?", "Rows from the first matrix.", "5 by 5.", "5 by 5"),
  ],
  352: [
    calculation("In a transpose, row 1 becomes what?", "Entry a_ij moves to position a_ji.", "column 1.", "column 1"),
    calculation("In Transpose, evaluate the labelled model at input 3.", "Substitute 3 into the Transpose rule.", "18.", "18"),
    calculation("Compare the Transpose outputs at 3 and 9. What is the difference?", "Second input 9.", "6.", "6"),
  ],
  353: [
    calculation("In RREF, what value is each pivot?", "For a 2 by 2 matrix, det [[a,b],[c,d]]=ad-bc.", "1.", "1"),
    calculation("Find det([[4,7],[0,7]]).", "4*7-7*0.", "28.", "28"),
    calculation("What is the size of a 7 by 7 product if inner sizes match?", "Rows from the first matrix.", "7 by 7.", "7 by 7"),
  ],
  354: [
    calculation("In RREF, what value is each pivot?", "An inverse exists only when the determinant is non-zero.", "1.", "1"),
    calculation("Find det([[5,2],[0,8]]).", "5*8-2*0.", "40.", "40"),
    calculation("What is the size of a 2 by 8 product if inner sizes match?", "Rows from the first matrix.", "2 by 8.", "2 by 8"),
  ],
  355: [
    calculation("In RREF, what value is each pivot?", "Swap rows, scale a row by a non-zero number, or add a multiple of one row to another.", "1.", "1"),
    calculation("In Row Operations, evaluate the labelled model at input 6.", "Substitute 6 into the Row Operations rule.", "18.", "18"),
    calculation("Compare the Row Operations outputs at 6 and 9. What is the difference?", "Second input 9.", "3.", "3"),
  ],
  356: [
    calculation("In RREF, what value is each pivot?", "Each pivot column has one leading 1 and zeros elsewhere.", "1.", "1"),
    calculation("In RREF, evaluate the labelled model at input 7.", "Substitute 7 into the RREF rule.", "28.", "28"),
    calculation("Compare the RREF outputs at 7 and 11. What is the difference?", "Second input 11.", "4.", "4"),
  ],
  357: [
    calculation("In [A|b], what does b represent?", "The final column represents the right-hand side.", "constants.", "constants"),
    calculation("In Augmented Matrices, evaluate the labelled model at input 8.", "Substitute 8 into the Augmented Matrices rule.", "40.", "40"),
    calculation("Compare the Augmented Matrices outputs at 8 and 13. What is the difference?", "Second input 13.", "5.", "5"),
  ],
  358: [
    calculation("A basis for a plane has how many vectors?", "A matrix sends input vectors to output vectors linearly.", "2.", "2"),
    calculation("Translate ( 9, 6 ) by vector <5, 1>.", "Add the vector.", "(14, 7).", "(14, 7)"),
    calculation("Rotate ( 9, 0 ) by 90° about the origin.", "(x,y) → (−y,x).", "(0, 9).", "(0, 9)"),
  ],
  359: [
    calculation("Find the eigenvalues of diag(3, 2).", "Compute det(A-lambda I)=(3-lambda)(2-lambda).", "3 and 2.", "3 and 2"),
    calculation("Find det([[10,7],[0,6]]).", "10*6-7*0.", "60.", "60"),
    calculation("What is the size of a 7 by 6 product if inner sizes match?", "Rows from the first matrix.", "7 by 6.", "7 by 6"),
  ],
  360: [
    calculation("A basis for a plane has how many vectors?", "Dimension is the number of vectors in a basis.", "2.", "2"),
    calculation("In Basis and Dimension, evaluate the labelled model at input 3.", "Substitute 3 into the Basis and Dimension rule.", "6.", "6"),
    calculation("Compare the Basis and Dimension outputs at 3 and 5. What is the difference?", "Second input 5.", "2.", "2"),
  ],
  361: [
    calculation("In Linear Independence, evaluate the labelled model at input 4.", "Substitute 4 into the Linear Independence rule.", "12.", "12"),
    calculation("Compare the Linear Independence outputs at 4 and 7. What is the difference?", "Second input 7.", "3.", "3"),
    calculation("Can you skip the Linear Independence restriction and still trust the chart?", "The restriction is part of the definition.", "no.", "no"),
  ],
  362: [
    calculation("Least squares minimises squared what?", "Adding vectors or scaling them must stay inside the set.", "residuals.", "residuals"),
    calculation("Find |( 5, 4 )|.", "√(5^2+4^2).", "√41.", "√41"),
    calculation("Dot ( 5, 4 ) with (1, 0).", "x-component only.", "5.", "5"),
  ],
  363: [
    calculation("Least squares minimises squared what?", "Subtract projections onto earlier vectors.", "residuals.", "residuals"),
    calculation("In Gram–Schmidt, evaluate the labelled model at input 6.", "Substitute 6 into the Gram–Schmidt rule.", "30.", "30"),
    calculation("Compare the Gram–Schmidt outputs at 6 and 11. What is the difference?", "Second input 11.", "5.", "5"),
  ],
  364: [
    calculation("Least squares minimises squared what?", "Minimise the sum of squared residuals.", "residuals.", "residuals"),
    calculation("In Least Squares, evaluate the labelled model at input 7.", "Substitute 7 into the Least Squares rule.", "42.", "42"),
    calculation("Compare the Least Squares outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
  ],
  365: [
    calculation("Find |8+7i|.", "√(8^2+7^2).", "√113.", "√113"),
    calculation("(8+7i)+(5-7i). What is the real part?", "8+5.", "13.", "13"),
    calculation("Is the modulus of a complex number allowed to be negative?", "Modulus is a distance.", "no.", "no"),
  ],
  366: [
    calculation("Find |9+2i|.", "√(9^2+2^2).", "√85.", "√85"),
    calculation("(9+2i)+(6-2i). What is the real part?", "9+6.", "15.", "15"),
    calculation("Is the modulus of a complex number allowed to be negative?", "Modulus is a distance.", "no.", "no"),
  ],
  367: [
    calculation("What is the conjugate of 3+2i?", "Add component by component.", "3-2i.", "3-2i"),
    calculation("Find |10+3i|.", "√(10^2+3^2).", "√109.", "√109"),
    calculation("(10+3i)+(7-3i). What is the real part?", "10+7.", "17.", "17"),
  ],
  368: [
    calculation("What is the conjugate of 3+2i?", "Multiply terms, then replace i^2 by -1.", "3-2i.", "3-2i"),
    calculation("Find |3+4i|.", "√(3^2+4^2).", "√25.", "√25"),
    calculation("(3+4i)+(8-4i). What is the real part?", "3+8.", "11.", "11"),
  ],
  369: [
    calculation("What is the conjugate of 3+2i?", "The conjugate of a+bi is a-bi.", "3-2i.", "3-2i"),
    calculation("Find |4+5i|.", "√(4^2+5^2).", "√41.", "√41"),
    calculation("(4+5i)+(9-5i). What is the real part?", "4+9.", "13.", "13"),
  ],
  370: [
    calculation("What is |3+4i|?", "Use r=sqrt(a^2+b^2) and theta=atan2(b,a).", "5.", "5"),
    calculation("Find |5+6i|.", "√(5^2+6^2).", "√61.", "√61"),
    calculation("(5+6i)+(10-6i). What is the real part?", "5+10.", "15.", "15"),
  ],
  371: [
    calculation("For r=2 and theta=0, what is z?", "z=r(cos theta+i sin theta).", "2.", "2"),
    calculation("Find |6+7i|.", "√(6^2+7^2).", "√85.", "√85"),
    calculation("(6+7i)+(4-7i). What is the real part?", "6+4.", "10.", "10"),
  ],
  372: [
    calculation("What is e^(i0)?", "re^(i theta)=r(cos theta+i sin theta).", "1.", "1"),
    calculation("Find |7+2i|.", "√(7^2+2^2).", "√53.", "√53"),
    calculation("(7+2i)+(5-2i). What is the real part?", "7+5.", "12.", "12"),
  ],
  373: [
    calculation("If z=2e^(i theta), what is the modulus of z^3?", "Use De Moivre: [r(cos theta+i sin theta)]^n=r^n(cos ntheta+i sin ntheta).", "8.", "8"),
    calculation("Find |8+3i|.", "√(8^2+3^2).", "√73.", "√73"),
    calculation("(8+3i)+(6-3i). What is the real part?", "8+6.", "14.", "14"),
  ],
  374: [
    calculation("How many cube roots does a non-zero complex number have?", "The n roots have modulus r^(1/n) and angles (theta+2k pi)/n.", "3.", "3"),
    calculation("Find |9+4i|.", "√(9^2+4^2).", "√97.", "√97"),
    calculation("(9+4i)+(7-4i). What is the real part?", "9+7.", "16.", "16"),
  ],
  375: [
    calculation("In w=1/z, which input is not allowed?", "Non-real complex roots of real-coefficient polynomials occur in conjugate pairs.", "0.", "0"),
    calculation("Find |10+5i|.", "√(10^2+5^2).", "√125.", "√125"),
    calculation("(10+5i)+(8-5i). What is the real part?", "10+8.", "18.", "18"),
  ],
  376: [
    calculation("In w=1/z, which input is not allowed?", "Use w=(az+b)/(cz+d), with cz+d not zero.", "0.", "0"),
    calculation("Find |3+6i|.", "√(3^2+6^2).", "√45.", "√45"),
    calculation("(3+6i)+(9-6i). What is the real part?", "3+9.", "12.", "12"),
  ],
  377: [
    calculation("For f(z)=z+1 and z=2+i, what is f(z)?", "Track both real and imaginary parts of the output.", "3+i.", "3+i"),
    calculation("Find |4+7i|.", "√(4^2+7^2).", "√65.", "√65"),
    calculation("(4+7i)+(10-7i). What is the real part?", "4+10.", "14.", "14"),
  ],
  378: [
    calculation("How many coordinates locate a 3D point?", "Use ordered triples (x,y,z).", "3.", "3"),
    calculation("Cube edge 5. Find the volume.", "V=s^3.", "125.", "125"),
    calculation("Cube edge 5. Find the surface area.", "SA=6s^2.", "150.", "150"),
  ],
  379: [
    calculation("For P=(2,3,4), what is z?", "The point (a,b,c) has x=a, y=b, and z=c.", "4.", "4"),
    calculation("Cube edge 6. Find the volume.", "V=s^3.", "216.", "216"),
    calculation("Cube edge 6. Find the surface area.", "SA=6s^2.", "216.", "216"),
  ],
  380: [
    calculation("What extra object does a point need to define a 3D line?", "Use the 3D distance formula.", "direction.", "direction"),
    calculation("Cube edge 7. Find the volume.", "V=s^3.", "343.", "343"),
    calculation("Cube edge 7. Find the surface area.", "SA=6s^2.", "294.", "294"),
  ],
  381: [
    calculation("What extra object does a point need to define a 3D line?", "Use r=a+lambda v.", "direction.", "direction"),
    calculation("Cube edge 8. Find the volume.", "V=s^3.", "512.", "512"),
    calculation("Cube edge 8. Find the surface area.", "SA=6s^2.", "384.", "384"),
  ],
  382: [
    calculation("What vector is perpendicular to a plane?", "A normal vector gives the plane equation.", "normal.", "normal"),
    calculation("Cube edge 9. Find the volume.", "V=s^3.", "729.", "729"),
    calculation("Cube edge 9. Find the surface area.", "SA=6s^2.", "486.", "486"),
  ],
  383: [
    calculation("If plane normals have dot product 0, what is the plane relationship?", "Parallel planes have parallel normals; perpendicular planes have perpendicular normals.", "perpendicular.", "perpendicular"),
    calculation("Cube edge 10. Find the volume.", "V=s^3.", "1000.", "1000"),
    calculation("Cube edge 10. Find the surface area.", "SA=6s^2.", "600.", "600"),
  ],
  384: [
    calculation("What parameter is solved in a line-plane intersection?", "Substitute the line equation into the plane equation.", "lambda.", "lambda"),
    calculation("Cube edge 3. Find the volume.", "V=s^3.", "27.", "27"),
    calculation("Cube edge 3. Find the surface area.", "SA=6s^2.", "54.", "54"),
  ],
  385: [
    calculation("Two non-parallel planes usually meet in what?", "Solve both plane equations together.", "line.", "line"),
    calculation("Cube edge 4. Find the volume.", "V=s^3.", "64.", "64"),
    calculation("Cube edge 4. Find the surface area.", "SA=6s^2.", "96.", "96"),
  ],
  386: [
    calculation("Which vectors give the angle between lines?", "Use the dot product formula.", "direction.", "direction"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 50° and 40°. What is the sum?", "50+40.", "90.", "90"),
  ],
  387: [
    calculation("Which vectors give the angle between planes?", "Use normals in the dot product formula.", "normal.", "normal"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 60° and 50°. What is the sum?", "60+50.", "110.", "110"),
  ],
  388: [
    calculation("Line-plane angle uses line direction and plane what?", "It is complementary to the angle between the line direction and plane normal.", "normal.", "normal"),
    calculation("A right angle is what fraction of a 360° turn?", "A full turn is 360°.", "90.", "90"),
    calculation("Add 70° and 60°. What is the sum?", "70+60.", "130.", "130"),
  ],
  389: [
    calculation("Point-to-plane distance is measured in what direction?", "Use the absolute plane equation divided by normal length.", "perpendicular.", "perpendicular"),
    calculation("Cube edge 8. Find the volume.", "V=s^3.", "512.", "512"),
    calculation("Cube edge 8. Find the surface area.", "SA=6s^2.", "384.", "384"),
  ],
  390: [
    calculation("Cube edge 9. Find the volume.", "V=s^3.", "729.", "729"),
    calculation("Cube edge 9. Find the surface area.", "SA=6s^2.", "486.", "486"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  391: [
    calculation("Cube edge 10. Find the volume.", "V=s^3.", "1000.", "1000"),
    calculation("Cube edge 10. Find the surface area.", "SA=6s^2.", "600.", "600"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  392: [
    calculation("How many faces does a tetrahedron have?", "Volume is length times width times height.", "4.", "4"),
    calculation("Cube edge 3. Find the volume.", "V=s^3.", "27.", "27"),
    calculation("Cube edge 3. Find the surface area.", "SA=6s^2.", "54.", "54"),
  ],
  393: [
    calculation("How many faces does a tetrahedron have?", "Volume is base area times height.", "4.", "4"),
    calculation("Cube edge 4. Find the volume.", "V=s^3.", "64.", "64"),
    calculation("Cube edge 4. Find the surface area.", "SA=6s^2.", "96.", "96"),
  ],
  394: [
    calculation("How many faces does a tetrahedron have?", "Volume is one third base area times height.", "4.", "4"),
    calculation("Cube edge 5. Find the volume.", "V=s^3.", "125.", "125"),
    calculation("Cube edge 5. Find the surface area.", "SA=6s^2.", "150.", "150"),
  ],
  395: [
    calculation("How many faces does a tetrahedron have?", "A regular tetrahedron has all edges equal.", "4.", "4"),
    calculation("Cube edge 6. Find the volume.", "V=s^3.", "216.", "216"),
    calculation("Cube edge 6. Find the surface area.", "SA=6s^2.", "216.", "216"),
  ],
  396: [
    calculation("How many Platonic solids are there?", "There are exactly five Platonic solids.", "5.", "5"),
    calculation("Cube edge 7. Find the volume.", "V=s^3.", "343.", "343"),
    calculation("Cube edge 7. Find the surface area.", "SA=6s^2.", "294.", "294"),
  ],
  397: [
    calculation("Cube edge 8. Find the volume.", "V=s^3.", "512.", "512"),
    calculation("Cube edge 8. Find the surface area.", "SA=6s^2.", "384.", "384"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  398: [
    calculation("Cube edge 9. Find the volume.", "V=s^3.", "729.", "729"),
    calculation("Cube edge 9. Find the surface area.", "SA=6s^2.", "486.", "486"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  399: [
    calculation("Cube edge 10. Find the volume.", "V=s^3.", "1000.", "1000"),
    calculation("Cube edge 10. Find the surface area.", "SA=6s^2.", "600.", "600"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  400: [
    calculation("Cube edge 3. Find the volume.", "V=s^3.", "27.", "27"),
    calculation("Cube edge 3. Find the surface area.", "SA=6s^2.", "54.", "54"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  401: [
    calculation("Cube edge 4. Find the volume.", "V=s^3.", "64.", "64"),
    calculation("Cube edge 4. Find the surface area.", "SA=6s^2.", "96.", "96"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  402: [
    calculation("Cube edge 5. Find the volume.", "V=s^3.", "125.", "125"),
    calculation("Cube edge 5. Find the surface area.", "SA=6s^2.", "150.", "150"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  403: [
    calculation("Cube edge 6. Find the volume.", "V=s^3.", "216.", "216"),
    calculation("Cube edge 6. Find the surface area.", "SA=6s^2.", "216.", "216"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  404: [
    calculation("Find the surface area of a 3 by 2 by 1 cuboid from its net.", "Pair the congruent faces: 3x2", "22 square units.", "22 square units"),
    calculation("Cube edge 7. Find the volume.", "V=s^3.", "343.", "343"),
    calculation("Cube edge 7. Find the surface area.", "SA=6s^2.", "294.", "294"),
  ],
  405: [
    calculation("Cube edge 8. Find the volume.", "V=s^3.", "512.", "512"),
    calculation("Cube edge 8. Find the surface area.", "SA=6s^2.", "384.", "384"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  406: [
    calculation("Cube edge 9. Find the volume.", "V=s^3.", "729.", "729"),
    calculation("Cube edge 9. Find the surface area.", "SA=6s^2.", "486.", "486"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  407: [
    calculation("Cube edge 10. Find the volume.", "V=s^3.", "1000.", "1000"),
    calculation("Cube edge 10. Find the surface area.", "SA=6s^2.", "600.", "600"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  408: [
    calculation("Cube edge 3. Find the volume.", "V=s^3.", "27.", "27"),
    calculation("Cube edge 3. Find the surface area.", "SA=6s^2.", "54.", "54"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  409: [
    calculation("Cube edge 4. Find the volume.", "V=s^3.", "64.", "64"),
    calculation("Cube edge 4. Find the surface area.", "SA=6s^2.", "96.", "96"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  410: [
    calculation("Cube edge 5. Find the volume.", "V=s^3.", "125.", "125"),
    calculation("Cube edge 5. Find the surface area.", "SA=6s^2.", "150.", "150"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  411: [
    calculation("Cube edge 6. Find the volume.", "V=s^3.", "216.", "216"),
    calculation("Cube edge 6. Find the surface area.", "SA=6s^2.", "216.", "216"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  412: [
    calculation("Cube edge 7. Find the volume.", "V=s^3.", "343.", "343"),
    calculation("Cube edge 7. Find the surface area.", "SA=6s^2.", "294.", "294"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  413: [
    calculation("Cube edge 8. Find the volume.", "V=s^3.", "512.", "512"),
    calculation("Cube edge 8. Find the surface area.", "SA=6s^2.", "384.", "384"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  414: [
    calculation("Cube edge 9. Find the volume.", "V=s^3.", "729.", "729"),
    calculation("Cube edge 9. Find the surface area.", "SA=6s^2.", "486.", "486"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  415: [
    calculation("Cube edge 10. Find the volume.", "V=s^3.", "1000.", "1000"),
    calculation("Cube edge 10. Find the surface area.", "SA=6s^2.", "600.", "600"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  416: [
    calculation("Cube edge 3. Find the volume.", "V=s^3.", "27.", "27"),
    calculation("Cube edge 3. Find the surface area.", "SA=6s^2.", "54.", "54"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  417: [
    calculation("Cube edge 4. Find the volume.", "V=s^3.", "64.", "64"),
    calculation("Cube edge 4. Find the surface area.", "SA=6s^2.", "96.", "96"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  418: [
    calculation("Cube edge 5. Find the volume.", "V=s^3.", "125.", "125"),
    calculation("Cube edge 5. Find the surface area.", "SA=6s^2.", "150.", "150"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  419: [
    calculation("Cube edge 6. Find the volume.", "V=s^3.", "216.", "216"),
    calculation("Cube edge 6. Find the surface area.", "SA=6s^2.", "216.", "216"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  420: [
    calculation("Cube edge 7. Find the volume.", "V=s^3.", "343.", "343"),
    calculation("Cube edge 7. Find the surface area.", "SA=6s^2.", "294.", "294"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  421: [
    calculation("Cube edge 8. Find the volume.", "V=s^3.", "512.", "512"),
    calculation("Cube edge 8. Find the surface area.", "SA=6s^2.", "384.", "384"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  422: [
    calculation("Differentiate f(x)=x^4. What is f'(9)?", "f'(x)=4x^3.", "2916.", "2916"),
    calculation("Average rate of f(x)=x^2 from 9 to 10.", "Δy=19.", "19.", "19"),
    calculation("Is the derivative the same as the average slope on a long interval?", "Derivative is instantaneous.", "no.", "no"),
  ],
  423: [
    calculation("Cube edge 10. Find the volume.", "V=s^3.", "1000.", "1000"),
    calculation("Cube edge 10. Find the surface area.", "SA=6s^2.", "600.", "600"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  424: [
    calculation("Find sin 30°.", "sin 30° = 1/2.", "1/2.", "1/2"),
    calculation("Find cos 60°.", "cos 60° = 1/2.", "1/2.", "1/2"),
    calculation("Does Tangent Plane treat 90° the same as 90 radians?", "Degrees and radians are different units.", "no.", "no"),
  ],
  425: [
    calculation("Cube edge 4. Find the volume.", "V=s^3.", "64.", "64"),
    calculation("Cube edge 4. Find the surface area.", "SA=6s^2.", "96.", "96"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  426: [
    calculation("Find ∫ 2x dx from 0 to 5.", "Antiderivative 1.0 x^2.", "25.", "25"),
    calculation("If F'=2, what is F(5)-F(0) when F(t)=2t?", "F(5)=10.", "10.", "10"),
    calculation("Does a definite integral always equal a rectangle area?", "It is a signed net area.", "no.", "no"),
  ],
  427: [
    calculation("Cube edge 6. Find the volume.", "V=s^3.", "216.", "216"),
    calculation("Cube edge 6. Find the surface area.", "SA=6s^2.", "216.", "216"),
    calculation("Is surface area measured in cubic units?", "Surface area is square units.", "no.", "no"),
  ],
  428: [
    calculation("Symbolic evaluation should preserve exact what?", "Enter the expression, choose exact mode, and check restrictions.", "form.", "form"),
    calculation("In Symbolic Evaluation, evaluate the labelled model at input 7.", "Substitute 7 into the Symbolic Evaluation rule.", "28.", "28"),
    calculation("Compare the Symbolic Evaluation outputs at 7 and 11. What is the difference?", "Second input 11.", "4.", "4"),
  ],
  429: [
    calculation("Simplify must keep the same what?", "Combine like terms, reduce common factors, and preserve restrictions.", "value.", "value"),
    calculation("Solve 5x = 40.", "Divide by 5.", "8.", "8"),
    calculation("Expand 5(x+6).", "5x+30.", "5x+30.", "5x+30"),
  ],
  430: [
    calculation("When expanding, multiply every inside what?", "Multiply each required term and combine like terms after expansion.", "term.", "term"),
    calculation("Solve 6x = 54.", "Divide by 6.", "9.", "9"),
    calculation("Expand 6(x+7).", "6x+42.", "6x+42.", "6x+42"),
  ],
  431: [
    calculation("How can you check a factorisation?", "Find common factors or patterns, then multiply back to check.", "expand.", "expand"),
    calculation("Solve 7x = 70.", "Divide by 7.", "10.", "10"),
    calculation("Expand 7(x+8).", "7x+56.", "7x+56.", "7x+56"),
  ],
  432: [
    calculation("When substituting, replace how many matching variables?", "Replace every matching variable, then follow order of operations.", "every.", "every"),
    calculation("In Substitute, evaluate the labelled model at input 3.", "Substitute 3 into the Substitute rule.", "6.", "6"),
    calculation("Compare the Substitute outputs at 3 and 5. What is the difference?", "Second input 5.", "2.", "2"),
  ],
  433: [
    calculation("A solution should make the equation what?", "Use valid inverse steps and check candidate answers.", "true.", "true"),
    calculation("Solve 3x = 12.", "Divide by 3.", "4.", "4"),
    calculation("Expand 3(x+10).", "3x+30.", "3x+30.", "3x+30"),
  ],
  434: [
    calculation("Numerical solve gives exact or approximate answers?", "Choose a starting range or guess and check the residual.", "approximate.", "approximate"),
    calculation("Solve 4x = 20.", "Divide by 4.", "5.", "5"),
    calculation("Expand 4(x+4).", "4x+16.", "4x+16.", "4x+16"),
  ],
  435: [
    calculation("A system solution must satisfy how many equations?", "Use substitution, elimination, or matrices, then check every equation.", "all.", "all"),
    calculation("Solve 5x = 30.", "Divide by 5.", "6.", "6"),
    calculation("Expand 5(x+5).", "5x+25.", "5x+25.", "5x+25"),
  ],
  436: [
    calculation("Before elimination, coefficients should be matched or what?", "Combine equations so one variable cancels.", "opposites.", "opposites"),
    calculation("In Eliminate Variables, evaluate the labelled model at input 7.", "Substitute 7 into the Eliminate Variables rule.", "42.", "42"),
    calculation("Compare the Eliminate Variables outputs at 7 and 13. What is the difference?", "Second input 13.", "6.", "6"),
  ],
  437: [
    calculation("Partial fractions starts by factoring what?", "Factor the denominator, set unknown constants, and solve for them.", "denominator.", "denominator"),
    calculation("In Partial Fractions, evaluate the labelled model at input 8.", "Substitute 8 into the Partial Fractions rule.", "56.", "56"),
    calculation("Compare the Partial Fractions outputs at 8 and 15. What is the difference?", "Second input 15.", "7.", "7"),
  ],
  438: [
    calculation("Polynomial division orders terms by descending what?", "Divide leading terms, multiply back, subtract, and repeat.", "powers.", "powers"),
    calculation("In Polynomial Division, evaluate the labelled model at input 9.", "Substitute 9 into the Polynomial Division rule.", "18.", "18"),
    calculation("Compare the Polynomial Division outputs at 9 and 11. What is the difference?", "Second input 11.", "2.", "2"),
  ],
  439: [
    calculation("A derivative measures rate of what?", "Apply derivative rules and state the variable of differentiation.", "change.", "change"),
    calculation("Differentiate f(x)=x^3. What is f'(10)?", "f'(x)=3x^2.", "300.", "300"),
    calculation("Average rate of f(x)=x^2 from 10 to 11.", "Δy=21.", "21.", "21"),
  ],
  440: [
    calculation("An indefinite integral needs what constant?", "Find an antiderivative or add tiny pieces, then apply limits if given.", "C.", "C"),
    calculation("Find ∫ 4x dx from 0 to 3.", "Antiderivative 2.0 x^2.", "18.", "18"),
    calculation("If F'=4, what is F(3)-F(0) when F(t)=4t?", "F(3)=12.", "12.", "12"),
  ],
  441: [
    calculation("A limit describes what a function approaches?", "Check behaviour from the needed side or sides.", "value.", "value"),
    calculation("Estimate lim x→4 of (x-4)/(x-4) after cancelling.", "Cancel the common factor for x≠{x}.", "1.", "1"),
    calculation("Does a hole at x=4 make the two-sided limit fail if both sides match?", "A hole can still have a limit.", "no.", "no"),
  ],
  442: [
    calculation("A series expansion should state its what?", "Choose the centre and number of terms.", "centre.", "centre"),
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 6 odd numbers.", "1+3+...+11.", "36.", "36"),
  ],
  443: [
    calculation("Solve y'=2x with y(0)=3.", "Integrate: y=x^2+C.", "y=x^2+3.", "y=x^2+3"),
    calculation("Solve 7x = 42.", "Divide by 7.", "6.", "6"),
    calculation("Expand 7(x+6).", "7x+42.", "7x+42.", "7x+42"),
  ],
  444: [
    calculation("Matrix operations must check what first?", "Check dimensions before adding, multiplying, or inverting.", "dimensions.", "dimensions"),
    calculation("Find det([[7,2],[0,7]]).", "7*7-2*0.", "49.", "49"),
    calculation("What is the size of a 2 by 7 product if inner sizes match?", "Rows from the first matrix.", "2 by 7.", "2 by 7"),
  ],
  445: [
    calculation("What is i squared?", "Handle i using i^2=-1 and keep real and imaginary parts clear.", "-1.", "-1"),
    calculation("Find |8+3i|.", "√(8^2+3^2).", "√73.", "√73"),
    calculation("(8+3i)+(8-3i). What is the real part?", "8+8.", "16.", "16"),
  ],
  446: [
    calculation("Assumptions describe a variable's what?", "State domains such as real, positive, integer, or nonzero.", "domain.", "domain"),
    calculation("In Assumptions, evaluate the labelled model at input 9.", "Substitute 9 into the Assumptions rule.", "36.", "36"),
    calculation("Compare the Assumptions outputs at 9 and 13. What is the difference?", "Second input 13.", "4.", "4"),
  ],
  447: [
    calculation("Numeric mode usually gives an what?", "Show the active mode and keep rounded answers labelled.", "approximation.", "approximation"),
    calculation("In Exact / Numeric Toggle, evaluate the labelled model at input 10.", "Substitute 10 into the Exact / Numeric Toggle rule.", "50.", "50"),
    calculation("Compare the Exact / Numeric Toggle outputs at 10 and 15. What is the difference?", "Second input 15.", "5.", "5"),
  ],
  448: [
    calculation("Step-by-step algebra should include steps and what?", "Reveal one algebra step with its reason.", "reasons.", "reasons"),
    calculation("In Step-by-Step Algebra, evaluate the labelled model at input 3.", "Substitute 3 into the Step-by-Step Algebra rule.", "18.", "18"),
    calculation("Compare the Step-by-Step Algebra outputs at 3 and 9. What is the difference?", "Second input 9.", "6.", "6"),
  ],
  449: [
    calculation("CAS-to-graph should carry symbolic what?", "Update the graph from the exact expression and show restrictions.", "restrictions.", "restrictions"),
    calculation("In CAS-to-Graph Link, evaluate the labelled model at input 4.", "Substitute 4 into the CAS-to-Graph Link rule.", "28.", "28"),
    calculation("Compare the CAS-to-Graph Link outputs at 4 and 11. What is the difference?", "Second input 11.", "7.", "7"),
  ],
  450: [
    calculation("What should a data grid include at the top?", "Enter one value per cell and keep headings clear.", "headings.", "headings"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  451: [
    calculation("Spreadsheet formulas usually start with what symbol?", "Start with equals, refer to cells, and check the computed result.", "=.", "="),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  452: [
    calculation("After copying a formula, what should be checked?", "Copy the formula and check how references changed.", "references.", "references"),
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
  ],
  453: [
    calculation("Relative references change when copied: yes or no?", "Use plain cell names such as A2 when movement should adjust.", "yes.", "yes"),
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
  ],
  454: [
    calculation("What symbol marks an absolute reference?", "Use dollar signs, such as $A$1, for fixed cells.", "$.", "$"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
  ],
  455: [
    calculation("When sorting data, select the whole what?", "Select the full table and choose ascending or descending order.", "table.", "table"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
  ],
  456: [
    calculation("Filtering hides rows but does not what them?", "Choose the condition and keep hidden rows unchanged.", "delete.", "delete"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  457: [
    calculation("A list from cells should preserve data what?", "Select the range and preserve order and data type.", "type.", "type"),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  458: [
    calculation("Points from columns pair values by matching what?", "Choose matching columns and pair values row by row.", "rows.", "rows"),
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
  ],
  459: [
    calculation("A matrix cell range must be what shape?", "Select a rectangular range and keep row and column order.", "rectangular.", "rectangular"),
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
  ],
  460: [
    calculation("A frequency table counts how often values what?", "List values or classes and count each occurrence.", "appear.", "appear"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
  ],
  461: [
    calculation("Summary statistics often describe centre and what?", "Compute measures such as mean, median, mode, range, or standard deviation.", "spread.", "spread"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
  ],
  462: [
    calculation("Which chart is best for paired number data?", "tool", "scatter plot.", "scatter plot"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  463: [
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  464: [
    calculation("A dynamic link should update when the source what changes?", "tool", "cell.", "cell"),
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
  ],
  465: [
    calculation("What separator does a normal CSV file use?", "tool", "comma.", "comma"),
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
  ],
  466: [
    calculation("What should usually be included when exporting a table?", "tool", "headings.", "headings"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
  ],
  467: [
    calculation("Is favourite colour categorical or numerical?", "concept", "categorical.", "categorical"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
  ],
  468: [
    calculation("A frequency table records how many times values what?", "concept", "occur.", "occur"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  469: [
    calculation("Grouped tables use non-overlapping what?", "concept", "intervals.", "intervals"),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  470: [
    calculation("What must you do before finding the median?", "concept", "sort.", "sort"),
    calculation("Find the mean of 9, 4, 5, 10.", "Sum=28.", "7.", "7"),
    calculation("If one value increases by 4, how does the mean change?", "The total rises by 4.", "1.", "1"),
  ],
  471: [
    calculation("What must you do before finding the median?", "concept", "sort.", "sort"),
    calculation("Find the median of 5, 6, 10.", "Order the list.", "6.", "6"),
    calculation("Median of 5, 6, 10, 12?", "Average the two middle values.", "8.", "8"),
  ],
  472: [
    calculation("What is the mode of 2, 3, 3, 5?", "concept", "3.", "3"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
  ],
  473: [
    calculation("Find the mean of 4, 7, 8, 5.", "Sum=24.", "6.", "6"),
    calculation("If one value increases by 7, how does the mean change?", "The total rises by 7.", "1.75.", "1.75"),
    calculation("Must the mean be one of the data values?", "The mean is a balance point.", "no.", "no"),
  ],
  474: [
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  475: [
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  476: [
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  477: [
    calculation("Does the 80th percentile always mean score 80?", "concept", "no.", "no"),
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
  ],
  478: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  479: [
    calculation("Should you check an outlier before deleting it?", "concept", "yes.", "yes"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
  ],
  480: [
    calculation("Find the five-number summary of 1, 2, 4, 7, 9.", "The data are already sorted.", "(1, 1.5, 4, 8, 9).", "(1, 1.5, 4, 8, 9)"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  481: [
    calculation("In a dot plot, repeated values are shown by stacking what?", "visual_exploration", "dots.", "dots"),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  482: [
    calculation("In 67, if tens are stems, what is the leaf?", "visual_exploration", "7.", "7"),
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
  ],
  483: [
    calculation("Do histogram bars usually touch?", "visual_exploration", "yes.", "yes"),
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
  ],
  484: [
    calculation("A frequency polygon plots frequencies at class what?", "visual_exploration", "midpoints.", "midpoints"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
  ],
  485: [
    calculation("Cumulative frequency uses running what?", "visual_exploration", "totals.", "totals"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
  ],
  486: [
    calculation("A pie chart should show parts of one what?", "visual_exploration", "whole.", "whole"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  487: [
    calculation("A scatter plot uses paired what?", "visual_exploration", "numbers.", "numbers"),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  488: [
    calculation("Which axis usually shows time?", "visual_exploration", "horizontal.", "horizontal"),
    calculation("For 2, 4, 8, ... what is term 4?", "Each term doubles.", "16.", "16"),
    calculation("Sum of first 4 odd numbers.", "1+3+...+7.", "16.", "16"),
  ],
  489: [
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  490: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  491: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  492: [
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  493: [
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  494: [
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  495: [
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  496: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  497: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  498: [
    calculation("Besides error size, what should model comparison check?", "modelling", "context.", "context"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  499: [
    calculation("Which is usually safer: interpolation or extrapolation?", "concept", "interpolation.", "interpolation"),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  500: [
    calculation("How many outcomes are in one fair die roll?", "concept", "6.", "6"),
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
  ],
  501: [
    calculation("For a die, how many outcomes are in the event even?", "concept", "3.", "3"),
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
  ],
  502: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  503: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  504: [
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  505: [
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  506: [
    calculation("Does one fair coin toss affect the next toss?", "concept", "no.", "no"),
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
  ],
  507: [
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  508: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  509: [
    calculation("In a tree diagram, do you add or multiply along one path?", "visual_exploration", "multiply.", "multiply"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
  ],
  510: [
    calculation("Where do outcomes in both A and B go?", "visual_exploration", "overlap.", "overlap"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  511: [
    calculation("A two-way table has row totals and column what?", "visual_exploration", "totals.", "totals"),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  512: [
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  513: [
    calculation("Do more trials usually reduce random noise?", "concept", "yes.", "yes"),
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
  ],
  514: [
    calculation("Do more trials usually reduce random noise?", "tool", "yes.", "yes"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
  ],
  515: [
    calculation("The law of large numbers is about long-run what?", "concept", "frequency.", "frequency"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
  ],
  516: [
    calculation("What must you choose before entering parameters?", "tool", "distribution.", "distribution"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  517: [
    calculation("A probability plot checks data against a theoretical what?", "visual_exploration", "distribution.", "distribution"),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  518: [
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  519: [
    calculation("Tail questions often ask above or below a what?", "procedure", "cutoff.", "cutoff"),
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
  ],
  520: [
    calculation("Inverse probability returns a cutoff what?", "procedure", "value.", "value"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
  ],
  521: [
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  522: [
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  523: [
    calculation("Hypergeometric draws are with or without replacement?", "concept", "without.", "without"),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  524: [
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  525: [
    calculation("A fair die. P(score ≤ 5)?", "Favourable faces: 5.", "5/6.", "5/6"),
    calculation("If P(A)=5/10, what is P(A')?", "1-5/10.", "5/10.", "5/10"),
    calculation("Can a probability be 1.4?", "Probabilities lie in [0,1].", "no.", "no"),
  ],
  526: [
    calculation("Negative binomial needs a fixed target number of what?", "concept", "successes.", "successes"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=6/10, what is P(A')?", "1-6/10.", "4/10.", "4/10"),
  ],
  527: [
    calculation("In a uniform distribution, allowed outcomes are equally what?", "concept", "likely.", "likely"),
    calculation("A fair die. P(score ≤ 6)?", "Favourable faces: 6.", "6/6.", "6/6"),
    calculation("If P(A)=7/10, what is P(A')?", "1-7/10.", "3/10.", "3/10"),
  ],
  528: [
    calculation("The normal distribution is symmetric around its what?", "concept", "mean.", "mean"),
    calculation("A fair die. P(score ≤ 2)?", "Favourable faces: 2.", "2/6.", "2/6"),
    calculation("If P(A)=2/10, what is P(A')?", "1-2/10.", "8/10.", "8/10"),
  ],
  529: [
    calculation("The t distribution has heavier what than the normal?", "concept", "tails.", "tails"),
    calculation("A fair die. P(score ≤ 3)?", "Favourable faces: 3.", "3/6.", "3/6"),
    calculation("If P(A)=3/10, what is P(A')?", "1-3/10.", "7/10.", "7/10"),
  ],
  530: [
    calculation("Can a chi-square statistic be negative?", "concept", "no.", "no"),
    calculation("A fair die. P(score ≤ 4)?", "Favourable faces: 4.", "4/6.", "4/6"),
    calculation("If P(A)=4/10, what is P(A')?", "1-4/10.", "6/10.", "6/10"),
  ]
};

import type { LessonWorkedExample } from "../components/LessonSectionJourney";

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

export const coreWorkspaceBatch1NumericalExamples: Readonly<Record<number, readonly NumericalExampleSeed[]>> = {
  1: [
    calculation("Evaluate (18-6)*2+4.", "(18-6)\\times 2+4", "28"),
    calculation("Evaluate 36/(3+3)+5.", "36\\div(3+3)+5", "11"),
    calculation("Evaluate 7+4*6-3.", "7+4\\times 6-3", "28"),
  ],
  2: [
    calculation("Add 1/2 + 3/4.", "\\frac12+\\frac34=\\frac24+\\frac34", "\\frac54", "5/4"),
    calculation("Add 2/3 + 1/6.", "\\frac23+\\frac16=\\frac46+\\frac16", "\\frac56", "5/6"),
    calculation("Add 3/5 + 1/10.", "\\frac35+\\frac1{10}=\\frac6{10}+\\frac1{10}", "\\frac7{10}", "7/10"),
  ],
  3: [
    calculation("Write 2 1/3 as an improper fraction.", "2\\tfrac13=\\frac63+\\frac13", "\\frac73", "7/3"),
    calculation("Write 11/4 as a mixed number.", "\\frac{11}4=2+\\frac34", "2\\tfrac34", "2 3/4"),
    calculation("Add 1 1/2 + 2 1/4.", "\\frac32+\\frac94=\\frac64+\\frac94", "\\frac{15}4", "3 3/4"),
  ],
  4: [
    calculation("Find 15% of 240.", "0.15\\times 240", "36"),
    calculation("Write 45 out of 50 as a percent.", "\\frac{45}{50}\\times 100", "90", "90%"),
    calculation("A ₹800 shirt is reduced by 25%. Find the sale price.", "800-0.25(800)", "600"),
  ],
  5: [
    calculation("Simplify 8 : 12.", "\\gcd(8,12)=4", "2:3", "2 : 3"),
    calculation("A 2:5 juice mix uses 8 cups juice. Find the water.", "8\\times\\frac52", "20", "20 cups"),
    calculation("Scale 3 : 4 by 5.", "3\\times5:4\\times5", "15:20", "15 : 20"),
  ],
  6: [
    calculation("Evaluate 2^5.", "2\\times2\\times2\\times2\\times2", "32"),
    calculation("Evaluate \\sqrt{81}.", "9\\times9=81", "9"),
    calculation("Evaluate 5^3.", "5\\times5\\times5", "125"),
  ],
  7: [
    calculation("Write 0.00045 in scientific notation.", "0.00045=4.5\\times10^{-4}", "4.5\\times10^{-4}"),
    calculation("Write 3.2 \\times 10^4 in ordinary form.", "3.2\\times10000", "32000"),
    calculation("Compare 2.1 \\times 10^3 and 8.4 \\times 10^2.", "2100>840", "2.1\\times10^3"),
  ],
  8: [
    calculation("Evaluate \\log_2 8.", "2^3=8", "3"),
    calculation("Evaluate \\log_{10} 1000.", "10^3=1000", "3"),
    calculation("Solve 3^x = 81.", "81=3^4", "4"),
  ],
  9: [
    calculation("Evaluate 2^6.", "2\\times2\\times2\\times2\\times2\\times2", "64"),
    calculation("A culture of 5 cells doubles for 3 hours. Find the count.", "5\\times2^3", "40"),
    calculation("Evaluate 3^4.", "3\\times3\\times3\\times3", "81"),
  ],
  10: [
    calculation("Find \\sin 30^\\circ.", "\\sin 30^\\circ=1/2", "1/2"),
    calculation("Find \\cos 60^\\circ.", "\\cos 60^\\circ=1/2", "1/2"),
    calculation("Convert 180^\\circ to radians.", "180^\\circ=\\pi", "\\pi"),
  ],
  11: [
    calculation("Find the principal value of \\sin^{-1}(1/2).", "\\sin 30^\\circ=1/2", "30^\\circ", "30°"),
    calculation("Find \\cos^{-1}(0) in degrees.", "\\cos 90^\\circ=0", "90^\\circ", "90°"),
    calculation("A ramp has opposite 3 and hypotenuse 6. Find the elevation.", "\\sin\\theta=1/2", "30^\\circ", "30°"),
  ],
  12: [
    calculation("Evaluate \\sinh 0.", "\\sinh 0=(1-1)/2", "0"),
    calculation("Evaluate \\cosh 0.", "\\cosh 0=(1+1)/2", "1"),
    calculation("Check \\cosh^2 0 - \\sinh^2 0.", "1^2-0^2", "1"),
  ],
  13: [
    calculation("Evaluate 5!.", "5\\times4\\times3\\times2\\times1", "120"),
    calculation("How many ordered pairs from 5 students?", "{}^{5}P_{2}=5\\times4", "20"),
    calculation("How many 2-person teams from 5 students?", "{}^{5}C_{2}=10", "10"),
  ],
  14: [
    calculation("Evaluate |-7|.", "|-7|=7", "7"),
    calculation("Evaluate |4-9|.", "|-5|=5", "5"),
    calculation("Solve |x|=3.", "x=\\pm3", "x = 3 or x = -3"),
  ],
  15: [
    calculation("Round 22/7 to 2 decimal places.", "3.142857\\ldots", "3.14"),
    calculation("Round 2.756 to 2 decimal places.", "6\\ge5", "2.76"),
    calculation("Round 1482 to the nearest ten.", "2<5", "1480"),
  ],
  16: [
    calculation("A circle of radius 2 has exact circumference.", "C=2\\pi(2)", "4\\pi"),
    calculation("Estimate that circumference using \\pi \\approx 3.14.", "4\\times3.14", "12.56"),
    calculation("Evaluate \\varphi=(1+\\sqrt5)/2 to 3 decimal places.", "3.236/2", "1.618"),
  ],
  17: [
    calculation("History has 12+8=20 then 20÷4=5. What does row 2 recall?", "20\\div4", "5"),
    calculation("A third row computes 5×3 using row 2. Find the result.", "5\\times3", "15"),
    calculation("If row 1 becomes 12+10, what is a linked  ÷4 row?", "22\\div4", "5.5"),
  ],
  18: [
    calculation("Write \\sqrt2 in exact mode.", "\\sqrt2", "\\sqrt2"),
    calculation("Write \\sqrt2 to 2 decimal places.", "1.41421\\ldots", "1.41"),
    calculation("A square has side \\sqrt2. Find its exact area.", "(\\sqrt2)^2", "2"),
  ],
  19: [
    calculation("Expand 4(x+3).", "4x+12", "4x+12"),
    calculation("If y=2x+3 and x=4, find y.", "2(4)+3", "11"),
    calculation("If y=2x+3 and y=17, find x.", "2x=14", "7"),
  ],
  20: [
    calculation("Evaluate 3x+5 when x=-2.", "3(-2)+5", "-1"),
    calculation("For y=2x+3, find y when x=1.", "2(1)+3", "5"),
    calculation("For y=2x+3, what x gives y=9?", "2x=6", "3"),
  ],
  21: [
    calculation("If y=2x+3 and x=2, find y.", "2(2)+3", "7"),
    calculation("x increases from 2 to 3. How much does y=2x+3 increase?", "9-7", "2"),
    calculation("With step 0.5, how many values are allowed from 0 to 1?", "0,0.5,1", "3"),
  ],
  22: [
    calculation("For y=2x+3 and integer x=3, find y.", "2(3)+3", "9"),
    calculation("List y=2x+3 for x=0,1,2,3.", "3,5,7,9", "3, 5, 7, 9"),
    calculation("From x=4, what is the next integer slider value if the max is 5?", "4+1", "5"),
  ],
  23: [
    calculation("Convert 90° to radians.", "90\\pi/180", "\\pi/2"),
    calculation("Find sin 90°.", "\\sin 90^\\circ=1", "1"),
    calculation("Convert π radians to degrees.", "\\pi=180^\\circ", "180°"),
  ],
  24: [
    calculation("An animation runs from 1 to 9 in steps of 2. How many frames?", "(9-1)/2+1", "5"),
    calculation("If frame 0 is x=1 and the step is 2, what is frame 3?", "1+3\\times2", "7"),
    calculation("A 4-frame loop at 2 frames per second lasts how long?", "4/2", "2"),
  ],
  25: [
    calculation("A=(0,0), B=(4,2). Find the midpoint.", "((0+4)/2,(0+2)/2)", "(2, 1)"),
    calculation("The same points. Find AB.", "\\sqrt{16+4}", "\\sqrt20"),
    calculation("If y=x^2 and x changes from 2 to 4, find Δy.", "16-4", "12"),
  ],
  26: [
    calculation("For x>2, is the object visible at x=2?", "2\\not>2", "hidden"),
    calculation("For 0≤x≤5, is x=0 visible?", "0\\le0\\le5", "visible"),
    calculation("How many integers satisfy -1<x<4?", "0,1,2,3", "4"),
  ],
  27: [
    calculation("P=(3,4). What does P(x,y) print?", "P(3,4)", "P(3, 4)"),
    calculation("The same point. Find the distance from the origin.", "\\sqrt{9+16}", "5"),
    calculation("P moves to (6,8). Find the new distance.", "\\sqrt{36+64}", "10"),
  ],
  28: [
    calculation("For f(x)=x^2-4, find the roots.", "x=\\pm2", "x = -2, 2"),
    calculation("For the same f, find f(0).", "0-4", "-4"),
    calculation("For f(x)=x^2-4, find the vertex.", "(0,-4)", "(0, -4)"),
  ],
  29: [
    calculation("At x=4, redefine y from 2x+1 to 3x-2.", "9\\to10", "old y = 9; new y = 10"),
    calculation("A circle radius changes from 3 to 5. Find both areas.", "9\\pi\\to25\\pi", "9π and 25π"),
    calculation("B=A+(2,1). A is redefined from (1,2) to (-1,4). Find new B.", "(-1,4)+(2,1)", "B = (1, 5)"),
  ],
  30: [
    calculation("Solve 2x+3=11.", "x=4", "x = 4"),
    calculation("Solve 5x-7=18.", "x=5", "x = 5"),
    calculation("The graphs y=2x+3 and y=11 meet where?", "(4,11)", "(4, 11)"),
  ],
};

export function asLessonWorkedExamples(lessonId: number): LessonWorkedExample[] {
  return (coreWorkspaceBatch1NumericalExamples[lessonId] ?? []).map(([prompt, steps, answer], index) => ({
    id: `batch1-numerical-${lessonId}-${index + 1}`,
    prompt,
    steps: [...steps],
    answer,
  }));
}

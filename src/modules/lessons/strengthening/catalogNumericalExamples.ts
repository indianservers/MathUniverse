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

const numericalExamplesByLesson: Readonly<Record<number, readonly NumericalExampleSeed[]>> = {
  7: [[
    "Write 0.00045 in scientific notation.",
    [String.raw`\displaystyle 0.00045 = 4.5 \times 0.0001`, String.raw`\displaystyle 0.0001 = 10^{-4}`, String.raw`\displaystyle 0.00045 = 4.5 \times 10^{-4}`],
    String.raw`4.5 \times 10^{-4}`,
  ]],
  13: [[
    "How many ordered pairs can be chosen from 5 different students?",
    [String.raw`\displaystyle {}^{5}P_{2} = \frac{5!}{(5-2)!}`, String.raw`\displaystyle {}^{5}P_{2} = \frac{120}{6}`, String.raw`\displaystyle {}^{5}P_{2} = 20`],
    "20 ordered pairs",
  ]],
  17: [[
    "A history contains 12 + 8 = 20 and then 20 ÷ 4 = 5. What result is recalled from the second entry?",
    [String.raw`\displaystyle 12 + 8 = 20`, String.raw`\displaystyle \frac{20}{4} = 5`, String.raw`\displaystyle \text{recalled result} = 5`],
    "5",
  ]],
  19: [[
    "Use the Algebra Workspace to expand 4(x + 3).",
    [String.raw`\displaystyle 4(x+3) = 4\cdot x + 4\cdot 3`, String.raw`\displaystyle 4\cdot 3 = 12`, String.raw`\displaystyle 4(x+3) = 4x+12`],
    String.raw`4x+12`,
  ]],
  20: [[
    "In the Variable Explorer, evaluate 3x + 5 when x = -2.",
    [String.raw`\displaystyle x=-2`, String.raw`\displaystyle 3x+5 = 3(-2)+5`, String.raw`\displaystyle -6+5=-1`],
    "-1",
  ]],
  24: [[
    "An animation runs from 1 to 9 in steps of 2. How many displayed frames are there?",
    [String.raw`\displaystyle 1,\ 3,\ 5,\ 7,\ 9`, String.raw`\displaystyle n = \frac{9-1}{2}+1`, String.raw`\displaystyle n=5`],
    "5 frames",
  ]],
  25: [[
    "The dependent object is y = x². If x changes from 2 to 4, how does y change?",
    [String.raw`\displaystyle y(2)=2^2=4`, String.raw`\displaystyle y(4)=4^2=16`, String.raw`\displaystyle \Delta y = 16-4=12`],
    "y changes from 4 to 16",
  ]],
  29: [
    [
      "At x = 4, redefine y from 2x + 1 to 3x - 2. Find the old and new values.",
      [String.raw`\displaystyle y_{\text{old}}=2(4)+1=9`, String.raw`\displaystyle y_{\text{new}}=3(4)-2=10`, String.raw`\displaystyle \Delta y=10-9=1`],
      "old y = 9; new y = 10",
    ],
    [
      "A circle is redefined from radius 3 to radius 5. Find both areas.",
      [String.raw`\displaystyle A_{1}=\pi(3)^2=9\pi`, String.raw`\displaystyle A_{2}=\pi(5)^2=25\pi`, String.raw`\displaystyle \Delta A=25\pi-9\pi=16\pi`],
      String.raw`9\pi\text{ and }25\pi`,
    ],
    [
      "B is defined by B = A + (2, 1). If A is redefined from (1, 2) to (-1, 4), find the new B.",
      [String.raw`\displaystyle B_{\text{old}}=(1,2)+(2,1)=(3,3)`, String.raw`\displaystyle A_{\text{new}}=(-1,4)`, String.raw`\displaystyle B_{\text{new}}=(-1,4)+(2,1)=(1,5)`],
      "B = (1, 5)",
    ],
  ],
  32: [[
    "Find the sum of the list [3, 5, 7, 9].",
    [String.raw`\displaystyle L=[3,5,7,9]`, String.raw`\displaystyle \sum L=3+5+7+9`, String.raw`\displaystyle \sum L=24`],
    "24",
  ]],
  36: [
    ["Let P = 1 and Q = 0. Find P AND Q.", [String.raw`\displaystyle P=1,\ Q=0`, String.raw`\displaystyle P\land Q=1\land 0`, String.raw`\displaystyle P\land Q=0`], "0 (false)"],
    ["Let P = 1 and Q = 0. Find P OR Q.", [String.raw`\displaystyle P=1,\ Q=0`, String.raw`\displaystyle P\lor Q=1\lor 0`, String.raw`\displaystyle P\lor Q=1`], "1 (true)"],
    ["Let P = 1. Find NOT P.", [String.raw`\displaystyle P=1`, String.raw`\displaystyle \neg P=\neg 1`, String.raw`\displaystyle \neg P=0`], "0 (false)"],
  ],
  38: [[
    "Display and evaluate three-fourths plus one-fourth in LaTeX.",
    [String.raw`\displaystyle \frac{3}{4}+\frac{1}{4}`, String.raw`\displaystyle \frac{3+1}{4}=\frac{4}{4}`, String.raw`\displaystyle \frac{4}{4}=1`],
    "1",
  ]],
  40: [
    ["For f(x) = -x + 4, find the plotted value at x = 3.", [String.raw`\displaystyle f(3)=-(3)+4`, String.raw`\displaystyle f(3)=-3+4`, String.raw`\displaystyle f(3)=1`], "1"],
    ["For g(x) = x² - 1, find the plotted value at x = -2.", [String.raw`\displaystyle g(-2)=(-2)^2-1`, String.raw`\displaystyle g(-2)=4-1`, String.raw`\displaystyle g(-2)=3`], "3"],
  ],
  41: [[
    "Does (3, 7) lie on the graph y = 2x + 1?",
    [String.raw`\displaystyle y=2(3)+1`, String.raw`\displaystyle y=6+1=7`, String.raw`\displaystyle (3,7)\text{ satisfies }y=2x+1`],
    "yes",
  ]],
  43: [[
    "For x = 2t + 1 and y = t - 3, find the point when t = 4.",
    [String.raw`\displaystyle x=2(4)+1=9`, String.raw`\displaystyle y=4-3=1`, String.raw`\displaystyle (x,y)=(9,1)`],
    "(9, 1)",
  ]],
  44: [
    ["Convert the polar point (r, θ) = (4, 0) to Cartesian coordinates.", [String.raw`\displaystyle x=r\cos\theta=4\cos 0=4`, String.raw`\displaystyle y=r\sin\theta=4\sin 0=0`, String.raw`\displaystyle (x,y)=(4,0)`], "(4, 0)"],
    ["Convert the polar point (r, θ) = (2, π/2) to Cartesian coordinates.", [String.raw`\displaystyle x=2\cos\frac{\pi}{2}=0`, String.raw`\displaystyle y=2\sin\frac{\pi}{2}=2`, String.raw`\displaystyle (x,y)=(0,2)`], "(0, 2)"],
  ],
  46: [[
    "The plotted points are (1, 3), (2, 5), and (3, 7). Find the slope between consecutive points.",
    [String.raw`\displaystyle m_{1}=\frac{5-3}{2-1}=2`, String.raw`\displaystyle m_{2}=\frac{7-5}{3-2}=2`, String.raw`\displaystyle m=2\text{ for both intervals}`],
    "slope 2",
  ]],
  47: [[
    "Complete the value y when x = -2 for the table y = x².",
    [String.raw`\displaystyle y=x^2`, String.raw`\displaystyle y=(-2)^2`, String.raw`\displaystyle y=4`],
    "4",
  ]],
  48: [[
    "Trace y = x² - 4 at x = 3.",
    [String.raw`\displaystyle y=3^2-4`, String.raw`\displaystyle y=9-4`, String.raw`\displaystyle y=5`],
    "(3, 5)",
  ]],
  49: [[
    "After zooming, the x-window is [-2, 2]. Find its width.",
    [String.raw`\displaystyle x_{\max}=2`, String.raw`\displaystyle x_{\min}=-2`, String.raw`\displaystyle \text{width}=2-(-2)=4`],
    "4",
  ]],
  50: [
    ["The y-axis runs from -3 to 9. Find its displayed interval length.", [String.raw`\displaystyle y_{\max}=9`, String.raw`\displaystyle y_{\min}=-3`, String.raw`\displaystyle 9-(-3)=12`], "12"],
    ["An axis runs from 0 to 10 with ticks every 2 units. How many labelled ticks appear including both ends?", [String.raw`\displaystyle 0,\ 2,\ 4,\ 6,\ 8,\ 10`, String.raw`\displaystyle n=\frac{10-0}{2}+1`, String.raw`\displaystyle n=6`], "6 ticks"],
  ],
  52: [[
    "Two linked graphics views show y = x². What y-value should both display at x = 3?",
    [String.raw`\displaystyle y=x^2`, String.raw`\displaystyle y=3^2=9`, String.raw`\displaystyle y_{\text{view 1}}=y_{\text{view 2}}=9`],
    "9 in both views",
  ]],
  54: [
    ["The Graph Inspector reads points (1, 4) and (3, 10). Find the slope between them.", [String.raw`\displaystyle m=\frac{10-4}{3-1}`, String.raw`\displaystyle m=\frac{6}{2}`, String.raw`\displaystyle m=3`], "3"],
    ["At x = -2, the inspector reports y = 7. Write the inspected coordinate.", [String.raw`\displaystyle x=-2`, String.raw`\displaystyle y=7`, String.raw`\displaystyle P=(-2,7)`], "(-2, 7)"],
  ],
  55: [[
    "For y = ax + 1, change a from 2 to 5. Find y at x = 3 before and after the change.",
    [String.raw`\displaystyle y_{a=2}=2(3)+1=7`, String.raw`\displaystyle y_{a=5}=5(3)+1=16`, String.raw`\displaystyle \Delta y=16-7=9`],
    "y changes from 7 to 16",
  ]],
  56: [
    ["Export y = 2x + 1 over -5 ≤ x ≤ 5. What is the width of the exported x-range?", [String.raw`\displaystyle x_{\min}=-5`, String.raw`\displaystyle x_{\max}=5`, String.raw`\displaystyle 5-(-5)=10`], "10 units"],
    ["An exported graph is 1200 pixels wide and 800 pixels high. Find its aspect ratio in simplest form.", [String.raw`\displaystyle 1200:800`, String.raw`\displaystyle \frac{1200}{400}:\frac{800}{400}`, String.raw`\displaystyle 3:2`], "3:2"],
    ["A graph export uses 300 pixels per inch. How many pixels are needed for a 4-inch width?", [String.raw`\displaystyle 300\ \mathrm{px\,in^{-1}}`, String.raw`\displaystyle 300\times 4=1200`, String.raw`\displaystyle \text{width}=1200\ \text{px}`], "1200 pixels"],
  ],
  110: [
    ["Make w the subject of A = lw, then find w when A = 48 and l = 6.", [String.raw`\displaystyle A=lw`, String.raw`\displaystyle w=\frac{A}{l}`, String.raw`\displaystyle w=\frac{48}{6}=8`], "w = 8"],
    ["Make a the subject of v = u + at, then find a when v = 25, u = 5, and t = 4.", [String.raw`\displaystyle v-u=at`, String.raw`\displaystyle a=\frac{v-u}{t}`, String.raw`\displaystyle a=\frac{25-5}{4}=5`], "a = 5"],
  ],
  125: [
    ["Solve (x - 2)(x + 1) > 0.", [String.raw`\displaystyle (x-2)(x+1)=0`, String.raw`\displaystyle x=-1,\ 2`, String.raw`\displaystyle (x-2)(x+1)>0\text{ for }x<-1\text{ or }x>2`], String.raw`(-\infty,-1)\cup(2,\infty)`],
    ["Solve x² - 9 ≤ 0.", [String.raw`\displaystyle x^2-9=(x-3)(x+3)`, String.raw`\displaystyle x=-3,\ 3`, String.raw`\displaystyle (x-3)(x+3)\le 0\text{ for }-3\le x\le 3`], String.raw`[-3,3]`],
  ],
  126: [
    ["Test whether (1, 2) satisfies y < 2x + 1.", [String.raw`\displaystyle 2x+1=2(1)+1=3`, String.raw`\displaystyle y=2`, String.raw`\displaystyle 2<3\Rightarrow (1,2)\text{ satisfies the inequality}`], "yes"],
    ["Test whether (0, 2) satisfies y < 2x + 1.", [String.raw`\displaystyle 2x+1=2(0)+1=1`, String.raw`\displaystyle y=2`, String.raw`\displaystyle 2\not<1\Rightarrow (0,2)\text{ does not satisfy the inequality}`], "no"],
  ],
  127: [
    ["Test (2, 3) in the system y ≥ x and y ≤ 4.", [String.raw`\displaystyle 3\ge 2`, String.raw`\displaystyle 3\le 4`, String.raw`\displaystyle (2,3)\text{ satisfies both inequalities}`], "(2, 3) is feasible"],
    ["Find where the boundary lines y = x and y = 4 intersect.", [String.raw`\displaystyle y=4`, String.raw`\displaystyle x=y=4`, String.raw`\displaystyle (x,y)=(4,4)`], "(4, 4)"],
  ],
  129: [["For f(x) = 3x - 2, find f(5).", [String.raw`\displaystyle f(5)=3(5)-2`, String.raw`\displaystyle f(5)=15-2`, String.raw`\displaystyle f(5)=13`], "13"]],
  130: [["Find the domain and range of y = √(x - 4).", [String.raw`\displaystyle x-4\ge 0\Rightarrow x\ge 4`, String.raw`\displaystyle \sqrt{x-4}\ge 0`, String.raw`\displaystyle D=[4,\infty),\ R=[0,\infty)`], String.raw`D=[4,\infty),\ R=[0,\infty)`]],
  132: [
    ["Use x = 3 on the circle x² + y² = 25. Does the circle pass the vertical-line test?", [String.raw`\displaystyle 3^2+y^2=25`, String.raw`\displaystyle y^2=16\Rightarrow y=\pm4`, String.raw`\displaystyle x=3\text{ gives two }y\text{-values}`], "no"],
    ["Use x = -2 on y = x². How many y-values occur?", [String.raw`\displaystyle y=(-2)^2`, String.raw`\displaystyle y=4`, String.raw`\displaystyle x=-2\text{ gives exactly one }y\text{-value}`], "one y-value; it passes"],
    ["Use x = 9 on x = y². Does the graph pass the vertical-line test?", [String.raw`\displaystyle 9=y^2`, String.raw`\displaystyle y=\pm3`, String.raw`\displaystyle x=9\text{ gives two }y\text{-values}`], "no"],
  ],
  141: [["Evaluate |-7 + 2|.", [String.raw`\displaystyle |-7+2|`, String.raw`\displaystyle |-5|`, String.raw`\displaystyle |-5|=5`], "5"]],
  143: [["Evaluate log₃(81).", [String.raw`\displaystyle 81=3^4`, String.raw`\displaystyle \log_{3}(81)=4`, String.raw`\displaystyle 3^4=81`], "4"]],
  145: [
    ["Evaluate cosh(0).", [String.raw`\displaystyle \cosh x=\frac{e^x+e^{-x}}{2}`, String.raw`\displaystyle \cosh 0=\frac{1+1}{2}`, String.raw`\displaystyle \cosh 0=1`], "1"],
    ["Evaluate sinh(0).", [String.raw`\displaystyle \sinh x=\frac{e^x-e^{-x}}{2}`, String.raw`\displaystyle \sinh 0=\frac{1-1}{2}`, String.raw`\displaystyle \sinh 0=0`], "0"],
  ],
  149: [["If f(x) = x + 2 for x < 1 and f(x) = 3x for x ≥ 1, find f(4).", [String.raw`\displaystyle 4\ge 1`, String.raw`\displaystyle f(4)=3(4)`, String.raw`\displaystyle f(4)=12`], "12"]],
  150: [["If f(x) = x² and g(x) = x - 1, find g(f(3)).", [String.raw`\displaystyle f(3)=3^2=9`, String.raw`\displaystyle g(f(3))=g(9)`, String.raw`\displaystyle g(9)=9-1=8`], "8"]],
  151: [["If f(x) = 2x + 3, find f⁻¹(11).", [String.raw`\displaystyle y=2x+3`, String.raw`\displaystyle x=\frac{y-3}{2}`, String.raw`\displaystyle f^{-1}(11)=\frac{11-3}{2}=4`], "4"]],
  153: [
    ["Show that f(x) = x² decreases from x = -2 to x = -1.", [String.raw`\displaystyle f(-2)=(-2)^2=4`, String.raw`\displaystyle f(-1)=(-1)^2=1`, String.raw`\displaystyle -2<-1\text{ and }4>1\Rightarrow f\text{ decreases}`], "decreasing"],
    ["Show that f(x) = x² increases from x = 1 to x = 2.", [String.raw`\displaystyle f(1)=1`, String.raw`\displaystyle f(2)=4`, String.raw`\displaystyle 1<2\text{ and }1<4\Rightarrow f\text{ increases}`], "increasing"],
    ["Determine whether f(x) = -3x + 2 increases or decreases from x = 0 to x = 2.", [String.raw`\displaystyle f(0)=2`, String.raw`\displaystyle f(2)=-6+2=-4`, String.raw`\displaystyle 2>-4\Rightarrow f\text{ decreases}`], "decreasing"],
  ],
  155: [["For a₁ = 1, a₂ = 1, and aₙ = aₙ₋₁ + aₙ₋₂, find a₅.", [String.raw`\displaystyle a_3=1+1=2`, String.raw`\displaystyle a_4=2+1=3`, String.raw`\displaystyle a_5=3+2=5`], "5"]],
  157: [["Translate f(x) = x² three units right and evaluate the new function at x = 5.", [String.raw`\displaystyle g(x)=f(x-3)=(x-3)^2`, String.raw`\displaystyle g(5)=(5-3)^2`, String.raw`\displaystyle g(5)=4`], "4"]],
  160: [["Reflect y = x² + 1 in the x-axis and find the reflected y-value at x = 2.", [String.raw`\displaystyle g(x)=-f(x)=-(x^2+1)`, String.raw`\displaystyle g(2)=-(2^2+1)`, String.raw`\displaystyle g(2)=-5`], "-5"]],
  161: [["Reflect y = 2x + 1 in the y-axis and find the reflected y-value at x = 3.", [String.raw`\displaystyle g(x)=f(-x)=2(-x)+1`, String.raw`\displaystyle g(x)=-2x+1`, String.raw`\displaystyle g(3)=-6+1=-5`], "-5"]],
  162: [["Move y = x two units right and three units up. Find the transformed value at x = 4.", [String.raw`\displaystyle g(x)=f(x-2)+3`, String.raw`\displaystyle g(x)=x-2+3=x+1`, String.raw`\displaystyle g(4)=5`], "5"]],
  163: [["Starting at P(1, 2), compare reflecting in the x-axis then moving up 3 with doing the translation first.", [String.raw`\displaystyle (1,2)\to(1,-2)\to(1,1)`, String.raw`\displaystyle (1,2)\to(1,5)\to(1,-5)`, String.raw`\displaystyle (1,1)\ne(1,-5)`], "the results are (1, 1) and (1, -5)" ]],
  164: [
    ["For y = ax + 1 at x = 2, compare a = 1 and a = 3.", [String.raw`\displaystyle y_{a=1}=1(2)+1=3`, String.raw`\displaystyle y_{a=3}=3(2)+1=7`, String.raw`\displaystyle \Delta y=7-3=4`], "3 and 7"],
    ["For y = x² + c, use x = 1 and c = -2.", [String.raw`\displaystyle y=1^2+(-2)`, String.raw`\displaystyle y=1-2`, String.raw`\displaystyle y=-1`], "-1"],
    ["For y = bˣ at x = 2, compare b = 2 and b = 3.", [String.raw`\displaystyle y_{b=2}=2^2=4`, String.raw`\displaystyle y_{b=3}=3^2=9`, String.raw`\displaystyle \Delta y=9-4=5`], "4 and 9"],
  ],
  166: [["Match the points (0, 1) and (2, 5) to their linear rule.", [String.raw`\displaystyle m=\frac{5-1}{2-0}=2`, String.raw`\displaystyle b=1`, String.raw`\displaystyle y=2x+1`], String.raw`y=2x+1`]],
  167: [["Locate P(-3, 4) on the Cartesian plane and identify its quadrant.", [String.raw`\displaystyle x=-3<0`, String.raw`\displaystyle y=4>0`, String.raw`\displaystyle (-,+)\Rightarrow \text{Quadrant II}`], "Quadrant II"]],
  168: [["Plot A(-2, 3), then move 4 units right and 1 unit down. Find the new point.", [String.raw`\displaystyle x'=-2+4=2`, String.raw`\displaystyle y'=3-1=2`, String.raw`\displaystyle A'=(2,2)`], "(2, 2)"]],
  169: [["Find the distance between A(1, 2) and B(4, 6).", [String.raw`\displaystyle d=\sqrt{(4-1)^2+(6-2)^2}`, String.raw`\displaystyle d=\sqrt{9+16}`, String.raw`\displaystyle d=5`], "5"]],
  170: [["Find the midpoint of A(-4, 2) and B(6, 8).", [String.raw`\displaystyle x_M=\frac{-4+6}{2}=1`, String.raw`\displaystyle y_M=\frac{2+8}{2}=5`, String.raw`\displaystyle M=(1,5)`], "(1, 5)"]],
  173: [["Find the equation of the line through (1, 3) with slope 2.", [String.raw`\displaystyle y-3=2(x-1)`, String.raw`\displaystyle y-3=2x-2`, String.raw`\displaystyle y=2x+1`], String.raw`y=2x+1`]],
  174: [
    ["Are y = 3x + 1 and y = 3x - 5 parallel?", [String.raw`\displaystyle m_1=3`, String.raw`\displaystyle m_2=3`, String.raw`\displaystyle m_1=m_2\Rightarrow \text{parallel}`], "yes"],
    ["Find the line parallel to y = -2x + 5 through (1, 4).", [String.raw`\displaystyle m=-2`, String.raw`\displaystyle y-4=-2(x-1)`, String.raw`\displaystyle y=-2x+6`], String.raw`y=-2x+6`],
  ],
  177: [["Find the perpendicular distance from P(0, 3) to the line y = 0.", [String.raw`\displaystyle y_P=3`, String.raw`\displaystyle y_{\text{line}}=0`, String.raw`\displaystyle d=|3-0|=3`], "3"]],
  178: [
    ["Check whether P(3, 4) lies on the locus x² + y² = 25.", [String.raw`\displaystyle 3^2+4^2=9+16`, String.raw`\displaystyle 9+16=25`, String.raw`\displaystyle (3,4)\text{ lies on the locus}`], "yes"],
    ["Check whether P(2, 2) lies on the locus of points equidistant from the coordinate axes.", [String.raw`\displaystyle d_x=|y|=2`, String.raw`\displaystyle d_y=|x|=2`, String.raw`\displaystyle d_x=d_y`], "yes"],
  ],
  179: [["Rotate P(2, 1) by 90° anticlockwise about the origin.", [String.raw`\displaystyle (x,y)\to(-y,x)`, String.raw`\displaystyle (2,1)\to(-1,2)`, String.raw`\displaystyle P'=(-1,2)`], "(-1, 2)"]],
  180: [["Convert the polar point (5, π) to Cartesian coordinates.", [String.raw`\displaystyle x=5\cos\pi=-5`, String.raw`\displaystyle y=5\sin\pi=0`, String.raw`\displaystyle (x,y)=(-5,0)`], "(-5, 0)"]],
  181: [["For x = 1 + t and y = 2t, find the point at t = 3.", [String.raw`\displaystyle x=1+3=4`, String.raw`\displaystyle y=2(3)=6`, String.raw`\displaystyle (x,y)=(4,6)`], "(4, 6)"]],
  182: [["Find the centroid of the triangle with vertices (0, 0), (6, 0), and (0, 3).", [String.raw`\displaystyle x_G=\frac{0+6+0}{3}=2`, String.raw`\displaystyle y_G=\frac{0+0+3}{3}=1`, String.raw`\displaystyle G=(2,1)`], "(2, 1)"]],
  184: [["Find the component form of vector AB for A(1, 2) and B(5, 7).", [String.raw`\displaystyle \overrightarrow{AB}=(5-1,7-2)`, String.raw`\displaystyle \overrightarrow{AB}=(4,5)`, String.raw`\displaystyle \overrightarrow{AB}=\langle4,5\rangle`], String.raw`\langle4,5\rangle`]],
  185: [["Write the position vector of P(-3, 4).", [String.raw`\displaystyle O=(0,0)`, String.raw`\displaystyle \overrightarrow{OP}=(-3-0,4-0)`, String.raw`\displaystyle \overrightarrow{OP}=\langle-3,4\rangle`], String.raw`\langle-3,4\rangle`]],
  186: [["Add u = ⟨2, 1⟩ and v = ⟨-1, 3⟩.", [String.raw`\displaystyle u+v=\langle2+(-1),1+3\rangle`, String.raw`\displaystyle u+v=\langle1,4\rangle`, String.raw`\displaystyle \langle1,4\rangle`], String.raw`\langle1,4\rangle`]],
  187: [["Subtract v = ⟨1, -3⟩ from u = ⟨5, 2⟩.", [String.raw`\displaystyle u-v=\langle5-1,2-(-3)\rangle`, String.raw`\displaystyle u-v=\langle4,5\rangle`, String.raw`\displaystyle \langle4,5\rangle`], String.raw`\langle4,5\rangle`]],
  188: [["Multiply v = ⟨3, -1⟩ by -2.", [String.raw`\displaystyle -2v=-2\langle3,-1\rangle`, String.raw`\displaystyle -2v=\langle-6,2\rangle`, String.raw`\displaystyle \langle-6,2\rangle`], String.raw`\langle-6,2\rangle`]],
  190: [["Find the dot product of u = ⟨2, 3⟩ and v = ⟨4, -1⟩.", [String.raw`\displaystyle u\cdot v=2(4)+3(-1)`, String.raw`\displaystyle u\cdot v=8-3`, String.raw`\displaystyle u\cdot v=5`], "5"]],
  192: [["Project a = ⟨3, 4⟩ onto the x-axis vector b = ⟨1, 0⟩.", [String.raw`\displaystyle \operatorname{proj}_{b}a=\frac{a\cdot b}{b\cdot b}b`, String.raw`\displaystyle \frac{3}{1}\langle1,0\rangle`, String.raw`\displaystyle \operatorname{proj}_{b}a=\langle3,0\rangle`], String.raw`\langle3,0\rangle`]],
  193: [["Find 2u - v when u = ⟨1, 2⟩ and v = ⟨3, -1⟩.", [String.raw`\displaystyle 2u=\langle2,4\rangle`, String.raw`\displaystyle 2u-v=\langle2-3,4-(-1)\rangle`, String.raw`\displaystyle 2u-v=\langle-1,5\rangle`], String.raw`\langle-1,5\rangle`]],
  194: [["On r = ⟨1, 2⟩ + t⟨3, -1⟩, find the point at t = 2.", [String.raw`\displaystyle r=\langle1,2\rangle+2\langle3,-1\rangle`, String.raw`\displaystyle r=\langle1+6,2-2\rangle`, String.raw`\displaystyle r=\langle7,0\rangle`], "(7, 0)"]],
  195: [
    ["Find the plane with normal ⟨0, 0, 1⟩ at signed distance 4 from the origin.", [String.raw`\displaystyle n\cdot r=d`, String.raw`\displaystyle 0x+0y+1z=4`, String.raw`\displaystyle z=4`], String.raw`z=4`],
    ["Find the plane through (1, 2, 3) with normal ⟨2, -1, 1⟩.", [String.raw`\displaystyle 2(x-1)-(y-2)+(z-3)=0`, String.raw`\displaystyle 2x-y+z-3=0`, String.raw`\displaystyle 2x-y+z=3`], String.raw`2x-y+z=3`],
  ],
  196: [["A moves with velocity ⟨5, 2⟩ and B with ⟨2, -1⟩. Find A's velocity relative to B.", [String.raw`\displaystyle v_{A\mid B}=v_A-v_B`, String.raw`\displaystyle v_{A\mid B}=\langle5-2,2-(-1)\rangle`, String.raw`\displaystyle v_{A\mid B}=\langle3,3\rangle`], String.raw`\langle3,3\rangle`]],
  197: [["Combine perpendicular forces ⟨4, 0⟩ N and ⟨0, 3⟩ N and find the resultant magnitude.", [String.raw`\displaystyle F=\langle4,0\rangle+\langle0,3\rangle=\langle4,3\rangle`, String.raw`\displaystyle |F|=\sqrt{4^2+3^2}`, String.raw`\displaystyle |F|=5\ \mathrm N`], "5 N"]],
  198: [
    ["Move a free point P(2, 3) by vector ⟨-1, 4⟩.", [String.raw`\displaystyle P'=(2-1,3+4)`, String.raw`\displaystyle P'=(1,7)`, String.raw`\displaystyle \Delta P=\langle-1,4\rangle`], "(1, 7)"],
    ["A free point is at P(3, 4). Find its distance from the origin.", [String.raw`\displaystyle OP=\sqrt{3^2+4^2}`, String.raw`\displaystyle OP=\sqrt{25}`, String.raw`\displaystyle OP=5`], "5"],
    ["Place a free point halfway between A(-2, 1) and B(4, 5).", [String.raw`\displaystyle x=\frac{-2+4}{2}=1`, String.raw`\displaystyle y=\frac{1+5}{2}=3`, String.raw`\displaystyle P=(1,3)`], "(1, 3)"],
  ],
  199: [
    ["A point lies on y = 2x + 1 with x = 3. Find its coordinates.", [String.raw`\displaystyle y=2(3)+1`, String.raw`\displaystyle y=7`, String.raw`\displaystyle P=(3,7)`], "(3, 7)"],
    ["A point lies on x² + y² = 25 with x = 3. Find its possible y-values.", [String.raw`\displaystyle 3^2+y^2=25`, String.raw`\displaystyle y^2=16`, String.raw`\displaystyle y=\pm4`], String.raw`y=\pm4`],
    ["A point is halfway along the segment from A(0, 0) to B(6, 3). Find it.", [String.raw`\displaystyle P=A+\frac12(B-A)`, String.raw`\displaystyle P=(0,0)+\frac12(6,3)`, String.raw`\displaystyle P=(3,\frac32)`], String.raw`(3,\frac32)`],
  ],
  200: [
    ["Find the intersection of y = 2x + 1 and y = -x + 7.", [String.raw`\displaystyle 2x+1=-x+7`, String.raw`\displaystyle 3x=6\Rightarrow x=2`, String.raw`\displaystyle y=2(2)+1=5`], "(2, 5)"],
    ["Find where x = 3 intersects x² + y² = 25.", [String.raw`\displaystyle 3^2+y^2=25`, String.raw`\displaystyle y^2=16\Rightarrow y=\pm4`, String.raw`\displaystyle (x,y)=(3,4),(3,-4)`], "(3, 4) and (3, -4)"],
    ["Find the intersections of y = x² and y = 4.", [String.raw`\displaystyle x^2=4`, String.raw`\displaystyle x=\pm2`, String.raw`\displaystyle (x,y)=(-2,4),(2,4)`], "(-2, 4) and (2, 4)"],
  ],
  201: [
    ["Find the midpoint of A(-2, 6) and B(4, 0).", [String.raw`\displaystyle x_M=\frac{-2+4}{2}=1`, String.raw`\displaystyle y_M=\frac{6+0}{2}=3`, String.raw`\displaystyle M=(1,3)`], "(1, 3)"],
    ["Find the centre of x² + y² - 6x + 4y - 12 = 0.", [String.raw`\displaystyle x^2-6x+y^2+4y=12`, String.raw`\displaystyle (x-3)^2+(y+2)^2=25`, String.raw`\displaystyle C=(3,-2)`], "(3, -2)"],
  ],
  202: [
    ["Attach P to y = x² at x = 2. Find P.", [String.raw`\displaystyle y=x^2`, String.raw`\displaystyle y=2^2=4`, String.raw`\displaystyle P=(2,4)`], "(2, 4)"],
    ["Attach P to x² + y² = 25 with x = 0. Find its possible positions.", [String.raw`\displaystyle 0^2+y^2=25`, String.raw`\displaystyle y=\pm5`, String.raw`\displaystyle P=(0,5)\text{ or }(0,-5)`], "(0, 5) or (0, -5)"],
    ["Detach P(3, 4), then translate it by ⟨2, -1⟩. Find the free point's new position.", [String.raw`\displaystyle P'=(3,4)+\langle2,-1\rangle`, String.raw`\displaystyle P'=(3+2,4-1)`, String.raw`\displaystyle P'=(5,3)`], "(5, 3)"],
  ],
  203: [
    ["Find the line through (0, 2) and (3, 8).", [String.raw`\displaystyle m=\frac{8-2}{3-0}=2`, String.raw`\displaystyle b=2`, String.raw`\displaystyle y=2x+2`], String.raw`y=2x+2`],
    ["Find the line through (4, -1) and (4, 5).", [String.raw`\displaystyle x_1=x_2=4`, String.raw`\displaystyle \Delta x=0`, String.raw`\displaystyle x=4`], String.raw`x=4`],
  ],
  204: [
    ["Find the length of segment AB for A(1, 1) and B(4, 5).", [String.raw`\displaystyle AB=\sqrt{(4-1)^2+(5-1)^2}`, String.raw`\displaystyle AB=\sqrt{9+16}`, String.raw`\displaystyle AB=5`], "5"],
    ["Find the midpoint of the segment from A(-3, 2) to B(5, 6).", [String.raw`\displaystyle x_M=\frac{-3+5}{2}=1`, String.raw`\displaystyle y_M=\frac{2+6}{2}=4`, String.raw`\displaystyle M=(1,4)`], "(1, 4)"],
    ["Find the point one-third of the way from A(0, 0) to B(6, 3).", [String.raw`\displaystyle P=A+\frac13(B-A)`, String.raw`\displaystyle P=\frac13(6,3)`, String.raw`\displaystyle P=(2,1)`], "(2, 1)"],
  ],
  205: [
    ["Construct a horizontal segment of length 5 from A(1, 2) to the right. Find B.", [String.raw`\displaystyle \overrightarrow{AB}=\langle5,0\rangle`, String.raw`\displaystyle B=(1,2)+(5,0)`, String.raw`\displaystyle B=(6,2)`], "(6, 2)"],
    ["From the origin, construct a length-10 segment in direction ⟨3, 4⟩.", [String.raw`\displaystyle |\langle3,4\rangle|=5`, String.raw`\displaystyle 10\frac{\langle3,4\rangle}{5}=\langle6,8\rangle`, String.raw`\displaystyle B=(6,8)`], "(6, 8)"],
    ["Check whether A(-1, 2) and B(7, 8) form a segment of length 10.", [String.raw`\displaystyle AB=\sqrt{(7+1)^2+(8-2)^2}`, String.raw`\displaystyle AB=\sqrt{64+36}`, String.raw`\displaystyle AB=10`], "yes"],
  ],
  206: [
    ["Write the ray from A(1, 2) through B(3, 5) and find its point at t = 2.", [String.raw`\displaystyle r(t)=(1,2)+t(2,3),\ t\ge0`, String.raw`\displaystyle r(2)=(1,2)+(4,6)`, String.raw`\displaystyle r(2)=(5,8)`], "(5, 8)"],
    ["Does P(-1, -1) lie on the ray from A(1, 2) through B(3, 5)?", [String.raw`\displaystyle (-1,-1)=(1,2)+t(2,3)`, String.raw`\displaystyle t=-1`, String.raw`\displaystyle -1<0\Rightarrow P\text{ is not on the ray}`], "no"],
    ["On r(t) = (0, 0) + t(2, 1), find the distance from the origin at t = 3.", [String.raw`\displaystyle r(3)=(6,3)`, String.raw`\displaystyle d=\sqrt{6^2+3^2}`, String.raw`\displaystyle d=3\sqrt5`], String.raw`3\sqrt5`],
  ],
  207: [
    ["Find the length of the polyline through (0, 0), (3, 4), and (6, 4).", [String.raw`\displaystyle L_1=\sqrt{3^2+4^2}=5`, String.raw`\displaystyle L_2=\sqrt{3^2+0^2}=3`, String.raw`\displaystyle L=5+3=8`], "8"],
    ["Find the net displacement along the polyline (1, 1) → (4, 2) → (2, 5).", [String.raw`\displaystyle \Delta_1=\langle3,1\rangle`, String.raw`\displaystyle \Delta_2=\langle-2,3\rangle`, String.raw`\displaystyle \Delta=\langle1,4\rangle`], String.raw`\langle1,4\rangle`],
    ["Close the polyline (0, 0) → (4, 0) → (4, 3). Find its perimeter.", [String.raw`\displaystyle L_1=4,\ L_2=3`, String.raw`\displaystyle L_3=\sqrt{4^2+3^2}=5`, String.raw`\displaystyle P=4+3+5=12`], "12"],
  ],
  209: [
    ["Find the line through (1, 2) parallel to y = 3x - 4.", [String.raw`\displaystyle m=3`, String.raw`\displaystyle y-2=3(x-1)`, String.raw`\displaystyle y=3x-1`], String.raw`y=3x-1`],
    ["Check whether the lines through (0, 1),(2, 5) and (1, -2),(3, 2) are parallel.", [String.raw`\displaystyle m_1=\frac{5-1}{2-0}=2`, String.raw`\displaystyle m_2=\frac{2-(-2)}{3-1}=2`, String.raw`\displaystyle m_1=m_2\Rightarrow\text{parallel}`], "yes"],
    ["Find the distance between y = 2x + 1 and y = 2x - 5.", [String.raw`\displaystyle 2x-y+1=0`, String.raw`\displaystyle 2x-y-5=0`, String.raw`\displaystyle d=\frac{|1-(-5)|}{\sqrt{2^2+(-1)^2}}=\frac6{\sqrt5}`], String.raw`\frac6{\sqrt5}`],
  ],
  211: [
    ["Bisect a 90° angle. Find each new angle.", [String.raw`\displaystyle \theta=90^\circ`, String.raw`\displaystyle \frac{\theta}{2}=\frac{90^\circ}{2}`, String.raw`\displaystyle \frac{\theta}{2}=45^\circ`], "45°"],
    ["A triangle has angles 50° and 60°. Bisect the third angle.", [String.raw`\displaystyle C=180^\circ-50^\circ-60^\circ=70^\circ`, String.raw`\displaystyle \frac C2=\frac{70^\circ}{2}`, String.raw`\displaystyle \frac C2=35^\circ`], "35°"],
    ["The positive coordinate axes form a right angle. Give a point on its internal bisector y = x when x = 3.", [String.raw`\displaystyle y=x`, String.raw`\displaystyle x=3\Rightarrow y=3`, String.raw`\displaystyle P=(3,3)`], "(3, 3)"],
  ],
  212: [
    ["From a point 13 units from a circle's centre, find the tangent length when the radius is 5.", [String.raw`\displaystyle OP^2=OT^2+PT^2`, String.raw`\displaystyle PT=\sqrt{13^2-5^2}`, String.raw`\displaystyle PT=12`], "12"],
    ["Find the tangent to y = x² at x = 2.", [String.raw`\displaystyle y(2)=4`, String.raw`\displaystyle m=2x\big|_{x=2}=4`, String.raw`\displaystyle y-4=4(x-2)\Rightarrow y=4x-4`], String.raw`y=4x-4`],
  ],
  213: [
    ["Find the best-fit rule for the exact linear data (1, 3), (2, 5), (3, 7), then predict x = 4.", [String.raw`\displaystyle m=\frac{5-3}{2-1}=2`, String.raw`\displaystyle y=2x+1`, String.raw`\displaystyle y(4)=9`], "9"],
    ["For the fitted line y = 2x + 1, find the residual of the observed point (3, 8).", [String.raw`\displaystyle \hat y=2(3)+1=7`, String.raw`\displaystyle e=y-\hat y`, String.raw`\displaystyle e=8-7=1`], "1"],
  ],
  214: [
    ["Construct a 3–4–5 triangle and find its area.", [String.raw`\displaystyle 3^2+4^2=5^2`, String.raw`\displaystyle A=\frac12(3)(4)`, String.raw`\displaystyle A=6`], "6"],
    ["Two sides are 5 and 7 with included angle 60°. Find the third side.", [String.raw`\displaystyle c^2=5^2+7^2-2(5)(7)\cos60^\circ`, String.raw`\displaystyle c^2=25+49-35=39`, String.raw`\displaystyle c=\sqrt{39}`], String.raw`\sqrt{39}`],
    ["A triangle has angles 50° and 60°. Find the third angle needed for construction.", [String.raw`\displaystyle A+B+C=180^\circ`, String.raw`\displaystyle C=180^\circ-50^\circ-60^\circ`, String.raw`\displaystyle C=70^\circ`], "70°"],
  ],
  215: [
    ["Find each interior angle of a regular hexagon.", [String.raw`\displaystyle S=(6-2)180^\circ=720^\circ`, String.raw`\displaystyle \theta=\frac{720^\circ}{6}`, String.raw`\displaystyle \theta=120^\circ`], "120°"],
    ["Find the area of a regular square with side 5.", [String.raw`\displaystyle A=s^2`, String.raw`\displaystyle A=5^2`, String.raw`\displaystyle A=25`], "25"],
  ],
  216: [
    ["Translate a rigid 3–4–5 triangle by ⟨2, -1⟩. What are its side lengths afterward?", [String.raw`\displaystyle (3,4,5)\xrightarrow{\langle2,-1\rangle}(3,4,5)`, String.raw`\displaystyle \Delta L=0`, String.raw`\displaystyle L'=3,4,5`], "3, 4, and 5"],
    ["Rotate the square (0,0),(2,0),(2,2),(0,2) by 90° about the origin. Find the image of (2, 0).", [String.raw`\displaystyle (x,y)\to(-y,x)`, String.raw`\displaystyle (2,0)\to(0,2)`, String.raw`\displaystyle P'=(0,2)`], "(0, 2)"],
    ["A rigid triangle has sides 5, 5, and 6. One vertex moves, but the sides stay fixed. Find its perimeter.", [String.raw`\displaystyle P=5+5+6`, String.raw`\displaystyle P=16`, String.raw`\displaystyle \Delta P=0`], "16"],
  ],
  217: [
    ["A quadrilateral has angles 80°, 90°, 110°, and x°. Find x.", [String.raw`\displaystyle 80+90+110+x=360`, String.raw`\displaystyle 280+x=360`, String.raw`\displaystyle x=80^\circ`], "80°"],
    ["Find the sum of the interior angles of a pentagon.", [String.raw`\displaystyle S=(n-2)180^\circ`, String.raw`\displaystyle S=(5-2)180^\circ`, String.raw`\displaystyle S=540^\circ`], "540°"],
    ["Find the area of the polygon (0,0),(4,0),(4,3),(0,3).", [String.raw`\displaystyle A=\text{length}\times\text{width}`, String.raw`\displaystyle A=4\times3`, String.raw`\displaystyle A=12`], "12"],
  ],
  218: [["A circle has centre C(2, -1) and passes through P(5, 3). Find its radius and equation.", [String.raw`\displaystyle r=\sqrt{(5-2)^2+(3+1)^2}=5`, String.raw`\displaystyle (x-h)^2+(y-k)^2=r^2`, String.raw`\displaystyle (x-2)^2+(y+1)^2=25`], String.raw`r=5,\ (x-2)^2+(y+1)^2=25`]],
  219: [
    ["Write the equation of the circle with centre (-2, 3) and radius 4.", [String.raw`\displaystyle (x-h)^2+(y-k)^2=r^2`, String.raw`\displaystyle h=-2,\ k=3,\ r=4`, String.raw`\displaystyle (x+2)^2+(y-3)^2=16`], String.raw`(x+2)^2+(y-3)^2=16`],
    ["Find the area of a circle with radius 7.", [String.raw`\displaystyle A=\pi r^2`, String.raw`\displaystyle A=\pi(7)^2`, String.raw`\displaystyle A=49\pi`], String.raw`49\pi`],
  ],
  220: [
    ["Find the circle through (5, 0), (0, 5), and (-5, 0).", [String.raw`\displaystyle C=(0,0)`, String.raw`\displaystyle r=5`, String.raw`\displaystyle x^2+y^2=25`], String.raw`x^2+y^2=25`],
    ["Find the circumcentre of the right triangle (0, 0), (4, 0), (0, 3).", [String.raw`\displaystyle \text{hypotenuse endpoints}=(4,0),(0,3)`, String.raw`\displaystyle C=\left(\frac{4+0}{2},\frac{0+3}{2}\right)`, String.raw`\displaystyle C=(2,\frac32),\ r=\frac52`], String.raw`C=(2,\frac32),\ r=\frac52`],
    ["Verify that (3, 4), (-3, 4), and (0, -5) lie on one circle centred at the origin.", [String.raw`\displaystyle 3^2+4^2=25`, String.raw`\displaystyle (-3)^2+4^2=25`, String.raw`\displaystyle 0^2+(-5)^2=25`], String.raw`x^2+y^2=25`],
  ],
  221: [
    ["A compass is set by A(0, 0) and B(3, 4). What radius does it transfer?", [String.raw`\displaystyle AB=\sqrt{3^2+4^2}`, String.raw`\displaystyle AB=\sqrt{25}`, String.raw`\displaystyle AB=5`], "5"],
    ["Two compass circles have radius 5 and centres (-3, 0) and (3, 0). Find their intersections.", [String.raw`\displaystyle x=0`, String.raw`\displaystyle 3^2+y^2=5^2\Rightarrow y=\pm4`, String.raw`\displaystyle P=(0,4),(0,-4)`], "(0, 4) and (0, -4)"],
  ],
  223: [
    ["Find the length of a 60° arc in a circle of radius 6.", [String.raw`\displaystyle L=\frac{60^\circ}{360^\circ}(2\pi\cdot6)`, String.raw`\displaystyle L=\frac16(12\pi)`, String.raw`\displaystyle L=2\pi`], String.raw`2\pi`],
    ["Find the chord of a 60° arc in a circle of radius 5.", [String.raw`\displaystyle c=2r\sin\frac{\theta}{2}`, String.raw`\displaystyle c=10\sin30^\circ`, String.raw`\displaystyle c=5`], "5"],
  ],
  224: [
    ["In a circle of radius 5, find the minor arc length subtended by a 72° central angle.", [String.raw`\displaystyle L=\frac{72^\circ}{360^\circ}(2\pi\cdot5)`, String.raw`\displaystyle L=\frac15(10\pi)`, String.raw`\displaystyle L=2\pi`], String.raw`2\pi`],
    ["An inscribed angle is 35°. Find the measure of its intercepted circumcircular arc.", [String.raw`\displaystyle m\widehat{AB}=2\angle ACB`, String.raw`\displaystyle m\widehat{AB}=2(35^\circ)`, String.raw`\displaystyle m\widehat{AB}=70^\circ`], "70°"],
    ["A semicircular arc has radius 4. Find its length.", [String.raw`\displaystyle L=\frac{180^\circ}{360^\circ}(2\pi\cdot4)`, String.raw`\displaystyle L=\frac12(8\pi)`, String.raw`\displaystyle L=4\pi`], String.raw`4\pi`],
  ],
  225: [["Find the area of a 90° sector of radius 6.", [String.raw`\displaystyle A=\frac{90^\circ}{360^\circ}\pi(6)^2`, String.raw`\displaystyle A=\frac14(36\pi)`, String.raw`\displaystyle A=9\pi`], String.raw`9\pi`]],
  226: [
    ["Find the conic through (5,0), (-5,0), (0,5), (0,-5), and (3,4).", [String.raw`\displaystyle 5^2+0^2=25`, String.raw`\displaystyle 0^2+5^2=25,\quad3^2+4^2=25`, String.raw`\displaystyle x^2+y^2=25`], String.raw`x^2+y^2=25`],
    ["Five points have x-values -2,-1,0,1,2 and y = x². Identify their conic.", [String.raw`\displaystyle (-2,4),(-1,1),(0,0),(1,1),(2,4)`, String.raw`\displaystyle y=x^2`, String.raw`\displaystyle \text{the conic is a parabola}`], String.raw`y=x^2`],
  ],
  228: [["Verify that (3, 0) lies on x²/9 - y²/4 = 1.", [String.raw`\displaystyle \frac{3^2}{9}-\frac{0^2}{4}`, String.raw`\displaystyle \frac99-0=1`, String.raw`\displaystyle (3,0)\text{ lies on the hyperbola}`], "yes"]],
  229: [["Find the vertex of y = x² - 4x + 3.", [String.raw`\displaystyle y=x^2-4x+4-1`, String.raw`\displaystyle y=(x-2)^2-1`, String.raw`\displaystyle V=(2,-1)`], "(2, -1)"]],
  230: [
    ["Find the distance from A(-2, 1) to B(4, 9).", [String.raw`\displaystyle d=\sqrt{(4+2)^2+(9-1)^2}`, String.raw`\displaystyle d=\sqrt{36+64}`, String.raw`\displaystyle d=10`], "10"],
    ["Find the length of the path (0,0) → (3,4) → (3,8).", [String.raw`\displaystyle L_1=\sqrt{3^2+4^2}=5`, String.raw`\displaystyle L_2=|8-4|=4`, String.raw`\displaystyle L=5+4=9`], "9"],
  ],
  231: [
    ["Find the area of a triangle with base 8 and perpendicular height 5.", [String.raw`\displaystyle A=\frac12bh`, String.raw`\displaystyle A=\frac12(8)(5)`, String.raw`\displaystyle A=20`], "20"],
    ["Find the area of a circle of radius 3.", [String.raw`\displaystyle A=\pi r^2`, String.raw`\displaystyle A=\pi(3)^2`, String.raw`\displaystyle A=9\pi`], String.raw`9\pi`],
  ],
  232: [
    ["Find the angle between u = ⟨1,0⟩ and v = ⟨1,√3⟩.", [String.raw`\displaystyle u\cdot v=1`, String.raw`\displaystyle |u||v|=1\cdot2=2`, String.raw`\displaystyle \cos\theta=\frac12\Rightarrow\theta=60^\circ`], "60°"],
    ["Find the angle between lines with slopes 1 and -1.", [String.raw`\displaystyle m_1m_2=(1)(-1)=-1`, String.raw`\displaystyle \text{the lines are perpendicular}`, String.raw`\displaystyle \theta=90^\circ`], "90°"],
  ],
  233: [
    ["A ray of length 4 makes a fixed 60° angle with the x-axis. Find its endpoint from the origin.", [String.raw`\displaystyle x=4\cos60^\circ=2`, String.raw`\displaystyle y=4\sin60^\circ=2\sqrt3`, String.raw`\displaystyle P=(2,2\sqrt3)`], String.raw`(2,2\sqrt3)`],
    ["Rotate the length-5 vector ⟨5,0⟩ through a fixed angle of 30°.", [String.raw`\displaystyle x'=5\cos30^\circ=\frac{5\sqrt3}{2}`, String.raw`\displaystyle y'=5\sin30^\circ=\frac52`, String.raw`\displaystyle v'=\left\langle\frac{5\sqrt3}{2},\frac52\right\rangle`], String.raw`\left\langle\frac{5\sqrt3}{2},\frac52\right\rangle`],
  ],
  234: [["Check whether y = 2x + 1 and y = -x/2 + 4 are perpendicular.", [String.raw`\displaystyle m_1=2`, String.raw`\displaystyle m_2=-\frac12`, String.raw`\displaystyle m_1m_2=-1\Rightarrow\text{perpendicular}`], "yes"]],
  235: [
    ["Construct the perpendicular bisector of A(0,0) and B(6,0). Find its equation.", [String.raw`\displaystyle M=\left(\frac{0+6}{2},0\right)=(3,0)`, String.raw`\displaystyle AB\text{ is horizontal}`, String.raw`\displaystyle \text{perpendicular bisector: }x=3`], String.raw`x=3`],
    ["Construct an equilateral triangle on A(0,0), B(4,0). Find the upper third vertex.", [String.raw`\displaystyle x_C=\frac{0+4}{2}=2`, String.raw`\displaystyle h=\sqrt{4^2-2^2}=2\sqrt3`, String.raw`\displaystyle C=(2,2\sqrt3)`], String.raw`(2,2\sqrt3)`],
    ["Divide a segment of length 10 internally in the ratio 2:3. Find the first part.", [String.raw`\displaystyle 2+3=5`, String.raw`\displaystyle L_1=\frac25(10)`, String.raw`\displaystyle L_1=4`], "4"],
  ],
  236: [
    ["Translate P(-2,3) by vector ⟨5,-1⟩.", [String.raw`\displaystyle P'=(-2,3)+\langle5,-1\rangle`, String.raw`\displaystyle P'=(-2+5,3-1)`, String.raw`\displaystyle P'=(3,2)`], "(3, 2)"],
    ["Translate A(0,0), B(4,0), C(0,3) by ⟨2,1⟩. Find the new vertices.", [String.raw`\displaystyle A'=(2,1)`, String.raw`\displaystyle B'=(6,1)`, String.raw`\displaystyle C'=(2,4)`], "A′(2,1), B′(6,1), C′(2,4)"],
  ],
  237: [
    ["Reflect P(4,-3) in the y-axis.", [String.raw`\displaystyle (x,y)\to(-x,y)`, String.raw`\displaystyle (4,-3)\to(-4,-3)`, String.raw`\displaystyle P'=(-4,-3)`], "(-4, -3)"],
    ["Reflect Q(-2,5) in the line y = x.", [String.raw`\displaystyle (x,y)\to(y,x)`, String.raw`\displaystyle (-2,5)\to(5,-2)`, String.raw`\displaystyle Q'=(5,-2)`], "(5, -2)"],
  ],
  238: [
    ["Reflect P(5,1) in the point C(2,3).", [String.raw`\displaystyle P'=2C-P`, String.raw`\displaystyle P'=(4,6)-(5,1)`, String.raw`\displaystyle P'=(-1,5)`], "(-1, 5)"],
    ["Reflect Q(-3,4) in the origin.", [String.raw`\displaystyle (x,y)\to(-x,-y)`, String.raw`\displaystyle (-3,4)\to(3,-4)`, String.raw`\displaystyle Q'=(3,-4)`], "(3, -4)"],
  ],
  239: [["Invert P at distance 3 from the centre in a circle of radius 6. Find the image distance.", [String.raw`\displaystyle OP\cdot OP'=r^2`, String.raw`\displaystyle 3(OP')=6^2`, String.raw`\displaystyle OP'=12`], "12"]],
  240: [
    ["Rotate P(3,1) by 90° anticlockwise about the origin.", [String.raw`\displaystyle (x,y)\to(-y,x)`, String.raw`\displaystyle (3,1)\to(-1,3)`, String.raw`\displaystyle P'=(-1,3)`], "(-1, 3)"],
    ["Rotate Q(4,-2) by 180° about C(1,1).", [String.raw`\displaystyle Q'=2C-Q`, String.raw`\displaystyle Q'=(2,2)-(4,-2)`, String.raw`\displaystyle Q'=(-2,4)`], "(-2, 4)"],
    ["Rotate ⟨2,0⟩ by 60° anticlockwise.", [String.raw`\displaystyle x'=2\cos60^\circ=1`, String.raw`\displaystyle y'=2\sin60^\circ=\sqrt3`, String.raw`\displaystyle v'=\langle1,\sqrt3\rangle`], String.raw`\langle1,\sqrt3\rangle`],
  ],
  241: [["Dilate P(3,4) from C(1,1) by scale factor -2.", [String.raw`\displaystyle P'=C-2(P-C)`, String.raw`\displaystyle P'=(1,1)-2(2,3)`, String.raw`\displaystyle P'=(-3,-5)`], "(-3, -5)"]],
  242: [["Apply the matrix [[0,-1],[1,0]] to P(3,-2).", [String.raw`\displaystyle \begin{pmatrix}0&-1\\1&0\end{pmatrix}\begin{pmatrix}3\\-2\end{pmatrix}`, String.raw`\displaystyle =\begin{pmatrix}2\\3\end{pmatrix}`, String.raw`\displaystyle P'=(2,3)`], "(2, 3)"]],
  243: [
    ["Translate P(1,2) by ⟨3,0⟩, then rotate 90° anticlockwise about the origin.", [String.raw`\displaystyle (1,2)\to(4,2)`, String.raw`\displaystyle (4,2)\to(-2,4)`, String.raw`\displaystyle P'=(-2,4)`], "(-2, 4)"],
    ["Reflect P(-1,3) in the x-axis, then dilate from the origin by factor 2.", [String.raw`\displaystyle (-1,3)\to(-1,-3)`, String.raw`\displaystyle (-1,-3)\to(-2,-6)`, String.raw`\displaystyle P'=(-2,-6)`], "(-2, -6)"],
  ],
  244: [
    ["Map P(1,2) under T(x,y) = (x+2,y-1).", [String.raw`\displaystyle T(1,2)=(1+2,2-1)`, String.raw`\displaystyle T(1,2)=(3,1)`, String.raw`\displaystyle P'=(3,1)`], "(3, 1)"],
    ["Map P(2,-1) under T(x,y) = (2x,3y).", [String.raw`\displaystyle T(2,-1)=(2(2),3(-1))`, String.raw`\displaystyle T(2,-1)=(4,-3)`, String.raw`\displaystyle P'=(4,-3)`], "(4, -3)"],
    ["Map P(3,4) under the reflection T(x,y) = (-x,y).", [String.raw`\displaystyle T(3,4)=(-3,4)`, String.raw`\displaystyle x'=-3,\ y'=4`, String.raw`\displaystyle P'=(-3,4)`], "(-3, 4)"],
  ],
  245: [
    ["Translate A(0,0), B(3,4) by ⟨5,-2⟩ and verify that distance is invariant.", [String.raw`\displaystyle AB=\sqrt{3^2+4^2}=5`, String.raw`\displaystyle A'=(5,-2),\ B'=(8,2)`, String.raw`\displaystyle A'B'=\sqrt{3^2+4^2}=5`], "distance remains 5"],
    ["Reflect a triangle of area 12 in the y-axis. What is its image area?", [String.raw`\displaystyle |\det R|=1`, String.raw`\displaystyle A'=|\det R|A`, String.raw`\displaystyle A'=1(12)=12`], "12"],
  ],
  246: [
    ["Reflect P(3,2) across the y-axis and pair the symmetric points.", [String.raw`\displaystyle (x,y)\to(-x,y)`, String.raw`\displaystyle (3,2)\to(-3,2)`, String.raw`\displaystyle P'=(-3,2)`], "(3,2) and (-3,2)"],
    ["Find the rotational symmetry order of a square.", [String.raw`\displaystyle 360^\circ\div90^\circ=4`, String.raw`\displaystyle 90^\circ,180^\circ,270^\circ,360^\circ`, String.raw`\displaystyle \text{order}=4`], "4"],
    ["Verify y = x² is symmetric about the y-axis using x = 3.", [String.raw`\displaystyle f(3)=3^2=9`, String.raw`\displaystyle f(-3)=(-3)^2=9`, String.raw`\displaystyle f(-3)=f(3)`], "both values are 9"],
  ],
  247: [
    ["Generate the locus of points 5 units from the origin.", [String.raw`\displaystyle \sqrt{x^2+y^2}=5`, String.raw`\displaystyle x^2+y^2=25`, String.raw`\displaystyle \text{locus: circle of radius }5`], String.raw`x^2+y^2=25`],
    ["Generate the locus of points 2 units from the y-axis on its right side.", [String.raw`\displaystyle d=|x|`, String.raw`\displaystyle x=2`, String.raw`\displaystyle \text{locus: vertical line }x=2`], String.raw`x=2`],
  ],
  248: [
    ["Find the locus equidistant from A(0,0) and B(6,0).", [String.raw`\displaystyle M=(3,0)`, String.raw`\displaystyle AB\text{ is horizontal}`, String.raw`\displaystyle \text{locus: }x=3`], String.raw`x=3`],
    ["Check whether P(4,4) is equidistant from the coordinate axes.", [String.raw`\displaystyle d_x=|y|=4`, String.raw`\displaystyle d_y=|x|=4`, String.raw`\displaystyle d_x=d_y`], "yes"],
    ["Find the locus of points 3 units from C(2,-1).", [String.raw`\displaystyle CP=3`, String.raw`\displaystyle (x-2)^2+(y+1)^2=3^2`, String.raw`\displaystyle (x-2)^2+(y+1)^2=9`], String.raw`(x-2)^2+(y+1)^2=9`],
  ],
  249: [
    ["A rod of length 5 pivots at the origin. Find the endpoint locus.", [String.raw`\displaystyle OP=5`, String.raw`\displaystyle x^2+y^2=5^2`, String.raw`\displaystyle x^2+y^2=25`], String.raw`x^2+y^2=25`],
    ["Two linked rods have lengths 3 and 4. Find the greatest and least endpoint distances from the pivot.", [String.raw`\displaystyle d_{\max}=3+4=7`, String.raw`\displaystyle d_{\min}=|4-3|=1`, String.raw`\displaystyle 1\le d\le7`], "1 to 7"],
    ["An ellipse linkage keeps distances to two foci summing to 10. If one distance is 4, find the other.", [String.raw`\displaystyle d_1+d_2=10`, String.raw`\displaystyle 4+d_2=10`, String.raw`\displaystyle d_2=6`], "6"],
  ],
  250: [
    ["For the line family x cos θ + y sin θ = 4, find the member at θ = 0.", [String.raw`\displaystyle x\cos0+y\sin0=4`, String.raw`\displaystyle x(1)+y(0)=4`, String.raw`\displaystyle x=4`], String.raw`x=4`],
    ["For the same family, find the member at θ = π/2.", [String.raw`\displaystyle x\cos\frac\pi2+y\sin\frac\pi2=4`, String.raw`\displaystyle x(0)+y(1)=4`, String.raw`\displaystyle y=4`], String.raw`y=4`],
    ["Identify the envelope of x cos θ + y sin θ = 4.", [String.raw`\displaystyle \text{each line is }4\text{ units from the origin}`, String.raw`\displaystyle r=4`, String.raw`\displaystyle x^2+y^2=16`], String.raw`x^2+y^2=16`],
  ],
  251: [
    ["Trace y = x² at x = -2, -1, 0, 1, 2.", [String.raw`\displaystyle y(-2)=4,\ y(-1)=1`, String.raw`\displaystyle y(0)=0,\ y(1)=1`, String.raw`\displaystyle y(2)=4`], "(-2,4), (-1,1), (0,0), (1,1), (2,4)"],
    ["Trace y = 2x + 1 from x = 0 to x = 3.", [String.raw`\displaystyle y(0)=1,\ y(1)=3`, String.raw`\displaystyle y(2)=5,\ y(3)=7`, String.raw`\displaystyle \Delta y=2\text{ per unit of }x`], "(0,1), (1,3), (2,5), (3,7)"],
    ["Trace x² + y² = 25 at x = 3.", [String.raw`\displaystyle 3^2+y^2=25`, String.raw`\displaystyle y^2=16`, String.raw`\displaystyle y=\pm4`], "(3, 4) and (3, -4)"],
  ],
  252: [
    ["Test the conjecture that the sum of the first n odd numbers is n² for n = 4.", [String.raw`\displaystyle 1+3+5+7=16`, String.raw`\displaystyle 4^2=16`, String.raw`\displaystyle 1+3+5+7=4^2`], "verified for n = 4"],
    ["Test the triangle-angle conjecture on angles 45°, 55°, and 80°.", [String.raw`\displaystyle 45^\circ+55^\circ+80^\circ`, String.raw`\displaystyle 100^\circ+80^\circ`, String.raw`\displaystyle =180^\circ`], "the angles sum to 180°"],
    ["Find a counterexample to the conjecture n² + n + 41 is always prime using n = 41.", [String.raw`\displaystyle 41^2+41+41`, String.raw`\displaystyle =41(41+1+1)`, String.raw`\displaystyle =41\cdot43=1763`], "1763 is composite"],
  ],
  253: [
    ["Verify the identity (a + b)² = a² + 2ab + b² for a = 2, b = 3.", [String.raw`\displaystyle (2+3)^2=25`, String.raw`\displaystyle 2^2+2(2)(3)+3^2=4+12+9`, String.raw`\displaystyle 25=25`], "both sides equal 25"],
    ["Check the Pythagorean equality for side lengths 3, 4, and 5.", [String.raw`\displaystyle 3^2+4^2=9+16`, String.raw`\displaystyle 5^2=25`, String.raw`\displaystyle 3^2+4^2=5^2`], "25 = 25"],
    ["Illustrate why n(n + 1) is even using n = 7.", [String.raw`\displaystyle n(n+1)=7(8)`, String.raw`\displaystyle 7(8)=56`, String.raw`\displaystyle 56=2(28)`], "56 is even"],
  ],
  254: [["Test whether (1,2), (3,6), and (5,10) are collinear.", [String.raw`\displaystyle m_{12}=\frac{6-2}{3-1}=2`, String.raw`\displaystyle m_{23}=\frac{10-6}{5-3}=2`, String.raw`\displaystyle m_{12}=m_{23}\Rightarrow\text{collinear}`], "yes"]],
  255: [
    ["Find the concurrency point of the medians of the triangle (0,0), (6,0), (0,3).", [String.raw`\displaystyle x_G=\frac{0+6+0}{3}=2`, String.raw`\displaystyle y_G=\frac{0+0+3}{3}=1`, String.raw`\displaystyle G=(2,1)`], "(2, 1)"],
    ["Find the common point of x = 0, y = 0, and y = x.", [String.raw`\displaystyle x=0`, String.raw`\displaystyle y=0`, String.raw`\displaystyle (0,0)\text{ also satisfies }y=x`], "(0, 0)"],
  ],
  256: [
    ["Check whether (3,4), (-3,4), (-3,-4), and (3,-4) are concyclic.", [String.raw`\displaystyle 3^2+4^2=25`, String.raw`\displaystyle (-3)^2+(\pm4)^2=25`, String.raw`\displaystyle x^2+y^2=25\text{ contains all four points}`], "yes"],
    ["A quadrilateral has opposite angles 70° and 110°. Check concyclicity.", [String.raw`\displaystyle 70^\circ+110^\circ=180^\circ`, String.raw`\displaystyle \angle A+\angle C=180^\circ`, String.raw`\displaystyle \text{the quadrilateral is cyclic}`], "yes"],
    ["Check whether (5,0), (0,5), (-5,0), and (0,-5) lie on one circle.", [String.raw`\displaystyle 5^2+0^2=25`, String.raw`\displaystyle 0^2+(\pm5)^2=25`, String.raw`\displaystyle x^2+y^2=25`], "yes"],
  ],
  259: [["In a 5–12–13 right triangle, find sin θ, cos θ, and tan θ when the opposite side is 5.", [String.raw`\displaystyle \sin\theta=\frac5{13}`, String.raw`\displaystyle \cos\theta=\frac{12}{13}`, String.raw`\displaystyle \tan\theta=\frac5{12}`], String.raw`\sin\theta=\frac5{13},\ \cos\theta=\frac{12}{13},\ \tan\theta=\frac5{12}`]],
  265: [["Evaluate sin⁻¹(1/2) using the principal value in degrees.", [String.raw`\displaystyle \sin30^\circ=\frac12`, String.raw`\displaystyle \sin^{-1}\left(\frac12\right)=30^\circ`, String.raw`\displaystyle 30^\circ\in[-90^\circ,90^\circ]`], "30°"]],
  267: [
    ["Use a compound-angle formula to find sin 75°.", [String.raw`\displaystyle \sin75^\circ=\sin(45^\circ+30^\circ)`, String.raw`\displaystyle =\frac{\sqrt2}{2}\frac{\sqrt3}{2}+\frac{\sqrt2}{2}\frac12`, String.raw`\displaystyle =\frac{\sqrt6+\sqrt2}{4}`], String.raw`\frac{\sqrt6+\sqrt2}{4}`],
    ["Use a compound-angle formula to find cos 15°.", [String.raw`\displaystyle \cos15^\circ=\cos(45^\circ-30^\circ)`, String.raw`\displaystyle =\frac{\sqrt2}{2}\frac{\sqrt3}{2}+\frac{\sqrt2}{2}\frac12`, String.raw`\displaystyle =\frac{\sqrt6+\sqrt2}{4}`], String.raw`\frac{\sqrt6+\sqrt2}{4}`],
  ],
  269: [["Solve cos x = 0 for 0 ≤ x ≤ 2π.", [String.raw`\displaystyle \cos x=0`, String.raw`\displaystyle x=\frac\pi2+k\pi`, String.raw`\displaystyle x=\frac\pi2,\frac{3\pi}{2}`], String.raw`\frac\pi2,\frac{3\pi}{2}`]],
  270: [
    ["In a triangle, a = 5 opposite A = 30° and B = 90°. Find b.", [String.raw`\displaystyle \frac{a}{\sin A}=\frac{b}{\sin B}`, String.raw`\displaystyle \frac5{\sin30^\circ}=\frac b{\sin90^\circ}`, String.raw`\displaystyle b=10`], "10"],
    ["In a triangle, a = 6 opposite A = 30° and B = 45°. Find b.", [String.raw`\displaystyle b=\frac{6\sin45^\circ}{\sin30^\circ}`, String.raw`\displaystyle b=\frac{6\left(\frac{\sqrt2}{2}\right)}{\frac12}`, String.raw`\displaystyle b=6\sqrt2`], String.raw`6\sqrt2`],
    ["Given a = 5, A = 30°, and b = 5√3, find the acute angle B.", [String.raw`\displaystyle \frac{\sin B}{5\sqrt3}=\frac{\sin30^\circ}{5}`, String.raw`\displaystyle \sin B=\frac{\sqrt3}{2}`, String.raw`\displaystyle B=60^\circ`], "60°"],
  ],
  273: [
    ["Travel 10 km on bearing 060°. Find the east and north components.", [String.raw`\displaystyle E=10\sin60^\circ=5\sqrt3`, String.raw`\displaystyle N=10\cos60^\circ=5`, String.raw`\displaystyle (E,N)=(5\sqrt3,5)`], String.raw`5\sqrt3\text{ km east, }5\text{ km north}`],
    ["What bearing represents due east?", [String.raw`\displaystyle \text{north}=000^\circ`, String.raw`\displaystyle \text{clockwise quarter-turn}=90^\circ`, String.raw`\displaystyle \text{bearing}=090^\circ`], "090°"],
    ["A travels from P to Q on bearing 045°. Find the reverse bearing from Q to P.", [String.raw`\displaystyle 045^\circ+180^\circ`, String.raw`\displaystyle =225^\circ`, String.raw`\displaystyle \text{reverse bearing}=225^\circ`], "225°"],
  ],
  274: [
    ["From 20 m away, the angle of elevation to a tower top is 45°. Find the height.", [String.raw`\displaystyle \tan45^\circ=\frac h{20}`, String.raw`\displaystyle 1=\frac h{20}`, String.raw`\displaystyle h=20\ \mathrm m`], "20 m"],
    ["From a 10 m cliff, the angle of depression to a boat is 30°. Find the horizontal distance.", [String.raw`\displaystyle \tan30^\circ=\frac{10}{d}`, String.raw`\displaystyle d=\frac{10}{\tan30^\circ}`, String.raw`\displaystyle d=10\sqrt3\ \mathrm m`], String.raw`10\sqrt3\text{ m}`],
    ["A 5 m pole casts a 12 m shadow. Find the sun's elevation angle.", [String.raw`\displaystyle \tan\theta=\frac5{12}`, String.raw`\displaystyle \theta=\tan^{-1}\left(\frac5{12}\right)`, String.raw`\displaystyle \theta\approx22.6^\circ`], "approximately 22.6°"],
  ],
  275: [
    ["For x(t) = 4 cos(πt), find the displacement at t = 1/2.", [String.raw`\displaystyle x\left(\frac12\right)=4\cos\frac\pi2`, String.raw`\displaystyle \cos\frac\pi2=0`, String.raw`\displaystyle x\left(\frac12\right)=0`], "0"],
    ["For x(t) = 4 cos(πt), find the velocity at t = 1/2.", [String.raw`\displaystyle v(t)=-4\pi\sin(\pi t)`, String.raw`\displaystyle v\left(\frac12\right)=-4\pi\sin\frac\pi2`, String.raw`\displaystyle v\left(\frac12\right)=-4\pi`], String.raw`-4\pi`],
  ],
  276: [["Convert the polar point (6, 60°) to Cartesian coordinates.", [String.raw`\displaystyle x=6\cos60^\circ=3`, String.raw`\displaystyle y=6\sin60^\circ=3\sqrt3`, String.raw`\displaystyle (x,y)=(3,3\sqrt3)`], String.raw`(3,3\sqrt3)`]],
  277: [
    ["Estimate lim as x → 2 of (x² - 4)/(x - 2) using x = 1.9 and 2.1.", [String.raw`\displaystyle f(x)=x+2\quad(x\ne2)`, String.raw`\displaystyle f(1.9)=3.9,\quad f(2.1)=4.1`, String.raw`\displaystyle \lim_{x\to2}f(x)=4`], "4"],
    ["Estimate lim as x → ∞ of 1/x using x = 10, 100, 1000.", [String.raw`\displaystyle \frac1{10}=0.1`, String.raw`\displaystyle \frac1{100}=0.01,\quad\frac1{1000}=0.001`, String.raw`\displaystyle \lim_{x\to\infty}\frac1x=0`], "0"],
  ],
  278: [["For f(x) = 0 when x < 0 and f(x) = 1 when x ≥ 0, find both one-sided limits at 0.", [String.raw`\displaystyle \lim_{x\to0^-}f(x)=0`, String.raw`\displaystyle \lim_{x\to0^+}f(x)=1`, String.raw`\displaystyle 0\ne1\Rightarrow\lim_{x\to0}f(x)\text{ does not exist}`], "left limit 0; right limit 1"]],
  279: [
    ["Find lim as x → 0 of 1/x².", [String.raw`\displaystyle x=0.1\Rightarrow\frac1{x^2}=100`, String.raw`\displaystyle x=0.01\Rightarrow\frac1{x^2}=10000`, String.raw`\displaystyle \lim_{x\to0}\frac1{x^2}=+\infty`], String.raw`+\infty`],
    ["Find lim as x → 2 of -1/(x - 2)².", [String.raw`\displaystyle (x-2)^2\to0^+`, String.raw`\displaystyle \frac{-1}{(x-2)^2}<0`, String.raw`\displaystyle \lim_{x\to2}\frac{-1}{(x-2)^2}=-\infty`], String.raw`-\infty`],
  ],
  280: [["Find lim as x → ∞ of (3x² + 1)/(x² - 2).", [String.raw`\displaystyle \frac{3x^2+1}{x^2-2}=\frac{3+\frac1{x^2}}{1-\frac2{x^2}}`, String.raw`\displaystyle \frac1{x^2}\to0`, String.raw`\displaystyle \lim_{x\to\infty}\frac{3x^2+1}{x^2-2}=3`], "3"]],
  281: [["Check continuity at x = 1 for f(x) = x + 1 when x < 1 and f(x) = 2x when x ≥ 1.", [String.raw`\displaystyle \lim_{x\to1^-}f(x)=1+1=2`, String.raw`\displaystyle \lim_{x\to1^+}f(x)=2(1)=2`, String.raw`\displaystyle f(1)=2\Rightarrow f\text{ is continuous}`], "continuous at x = 1"]],
  282: [
    ["Classify the discontinuity of (x² - 1)/(x - 1) at x = 1.", [String.raw`\displaystyle \frac{x^2-1}{x-1}=x+1\quad(x\ne1)`, String.raw`\displaystyle \lim_{x\to1}(x+1)=2`, String.raw`\displaystyle \text{finite limit with a hole}\Rightarrow\text{removable}`], "removable"],
    ["Classify the discontinuity of the floor function at x = 2.", [String.raw`\displaystyle \lim_{x\to2^-}\lfloor x\rfloor=1`, String.raw`\displaystyle \lim_{x\to2^+}\lfloor x\rfloor=2`, String.raw`\displaystyle 1\ne2\Rightarrow\text{jump}`], "jump"],
    ["Classify the discontinuity of 1/(x - 3) at x = 3.", [String.raw`\displaystyle \lim_{x\to3^-}\frac1{x-3}=-\infty`, String.raw`\displaystyle \lim_{x\to3^+}\frac1{x-3}=+\infty`, String.raw`\displaystyle x=3\text{ is an infinite discontinuity}`], "infinite"],
  ],
  283: [
    ["For f(x) = 2x + 1 at x = 3, use ε = 0.2 and find a suitable δ.", [String.raw`\displaystyle |f(x)-7|=|2x-6|=2|x-3|`, String.raw`\displaystyle 2|x-3|<0.2`, String.raw`\displaystyle |x-3|<0.1\Rightarrow\delta=0.1`], "δ = 0.1"],
    ["For f(x) = 3x at x = 2, use ε = 0.3 and find δ.", [String.raw`\displaystyle |f(x)-6|=3|x-2|`, String.raw`\displaystyle 3|x-2|<0.3`, String.raw`\displaystyle |x-2|<0.1\Rightarrow\delta=0.1`], "δ = 0.1"],
    ["For f(x) = x² at x = 2, verify δ = 0.1 works for ε = 0.5.", [String.raw`\displaystyle |x-2|<0.1\Rightarrow1.9<x<2.1`, String.raw`\displaystyle |x+2|<4.1`, String.raw`\displaystyle |x^2-4|=|x-2||x+2|<0.1(4.1)=0.41<0.5`], "δ = 0.1 works"],
  ],
  284: [["Find the average rate of change of f(x) = x² from x = 1 to x = 4.", [String.raw`\displaystyle \frac{f(4)-f(1)}{4-1}`, String.raw`\displaystyle =\frac{16-1}{3}`, String.raw`\displaystyle =5`], "5"]],
  285: [
    ["Find the instantaneous rate of change of f(x) = x² at x = 3.", [String.raw`\displaystyle f'(x)=2x`, String.raw`\displaystyle f'(3)=2(3)`, String.raw`\displaystyle f'(3)=6`], "6"],
    ["For position s(t) = t³, find instantaneous velocity at t = 2.", [String.raw`\displaystyle v(t)=s'(t)=3t^2`, String.raw`\displaystyle v(2)=3(2)^2`, String.raw`\displaystyle v(2)=12`], "12"],
  ],
  287: [
    ["Find the tangent to y = x² at x = 1.", [String.raw`\displaystyle y(1)=1,\quad y'=2x`, String.raw`\displaystyle m=y'(1)=2`, String.raw`\displaystyle y-1=2(x-1)\Rightarrow y=2x-1`], String.raw`y=2x-1`],
    ["Find the tangent to y = sin x at x = 0.", [String.raw`\displaystyle y(0)=0`, String.raw`\displaystyle m=\cos0=1`, String.raw`\displaystyle y=x`], String.raw`y=x`],
  ],
  288: [
    ["Find the normal to y = x² at x = 1.", [String.raw`\displaystyle m_t=2`, String.raw`\displaystyle m_n=-\frac12`, String.raw`\displaystyle y-1=-\frac12(x-1)`], String.raw`y-1=-\frac12(x-1)`],
    ["Find the normal to y = sin x at x = 0.", [String.raw`\displaystyle m_t=\cos0=1`, String.raw`\displaystyle m_n=-1`, String.raw`\displaystyle y=-x`], String.raw`y=-x`],
  ],
  289: [
    ["For f(x) = x², calculate derivative-graph points at x = -2, 0, 2.", [String.raw`\displaystyle f'(x)=2x`, String.raw`\displaystyle f'(-2)=-4,\ f'(0)=0`, String.raw`\displaystyle f'(2)=4`], "(-2,-4), (0,0), (2,4)"],
    ["For f(x) = x³, calculate derivative-graph values at x = -1, 0, 1.", [String.raw`\displaystyle f'(x)=3x^2`, String.raw`\displaystyle f'(-1)=3,\ f'(0)=0`, String.raw`\displaystyle f'(1)=3`], "3, 0, 3"],
    ["For f(x) = sin x, find derivative-graph values at x = 0, π/2, π.", [String.raw`\displaystyle f'(x)=\cos x`, String.raw`\displaystyle f'(0)=1,\ f'\left(\frac\pi2\right)=0`, String.raw`\displaystyle f'(\pi)=-1`], "1, 0, -1"],
  ],
  290: [["For y = x⁴, find the third derivative at x = 2.", [String.raw`\displaystyle y'=4x^3`, String.raw`\displaystyle y''=12x^2,\quad y'''=24x`, String.raw`\displaystyle y'''(2)=48`], "48"]],
  291: [
    ["Differentiate y = x² sin x and evaluate y′ at x = 0.", [String.raw`\displaystyle y'=2x\sin x+x^2\cos x`, String.raw`\displaystyle y'(0)=2(0)\sin0+0^2\cos0`, String.raw`\displaystyle y'(0)=0`], "0"],
    ["Differentiate y = (x + 1)x² and evaluate y′ at x = 2.", [String.raw`\displaystyle y'=1\cdot x^2+(x+1)2x`, String.raw`\displaystyle y'=3x^2+2x`, String.raw`\displaystyle y'(2)=12+4=16`], "16"],
  ],
  293: [
    ["Differentiate y = (3x + 1)⁴ and evaluate at x = 0.", [String.raw`\displaystyle y'=4(3x+1)^3\cdot3`, String.raw`\displaystyle y'=12(3x+1)^3`, String.raw`\displaystyle y'(0)=12`], "12"],
    ["Differentiate y = sin(x²) and evaluate at x = 0.", [String.raw`\displaystyle y'=\cos(x^2)\cdot2x`, String.raw`\displaystyle y'(0)=2(0)\cos0`, String.raw`\displaystyle y'(0)=0`], "0"],
  ],
  295: [
    ["For x = t² + 1 and y = t³, find dy/dx at t = 2.", [String.raw`\displaystyle \frac{dx}{dt}=2t,\quad\frac{dy}{dt}=3t^2`, String.raw`\displaystyle \frac{dy}{dx}=\frac{3t^2}{2t}=\frac{3t}{2}`, String.raw`\displaystyle \left.\frac{dy}{dx}\right|_{t=2}=3`], "3"],
    ["For x = cos t and y = sin t, find dy/dx at t = π/4.", [String.raw`\displaystyle \frac{dx}{dt}=-\sin t,\quad\frac{dy}{dt}=\cos t`, String.raw`\displaystyle \frac{dy}{dx}=-\cot t`, String.raw`\displaystyle \left.\frac{dy}{dx}\right|_{\frac\pi4}=-1`], "-1"],
  ],
  298: [
    ["Find the local minimum of f(x) = x² - 4x + 3.", [String.raw`\displaystyle f'(x)=2x-4=0\Rightarrow x=2`, String.raw`\displaystyle f''(2)=2>0`, String.raw`\displaystyle f(2)=4-8+3=-1`], "minimum -1 at x = 2"],
    ["Find the local maximum of f(x) = -x² + 6x.", [String.raw`\displaystyle f'(x)=-2x+6=0\Rightarrow x=3`, String.raw`\displaystyle f''(3)=-2<0`, String.raw`\displaystyle f(3)=-9+18=9`], "maximum 9 at x = 3"],
    ["Find the local extrema of f(x) = x³ - 3x.", [String.raw`\displaystyle f'(x)=3x^2-3=0\Rightarrow x=\pm1`, String.raw`\displaystyle f(-1)=2,\quad f(1)=-2`, String.raw`\displaystyle \text{local max }2;\ \text{local min }-2`], "maximum 2 at x = -1; minimum -2 at x = 1"],
  ],
  301: [
    ["A rectangle has perimeter 20. Find the dimensions that maximise its area.", [String.raw`\displaystyle 2x+2y=20\Rightarrow y=10-x`, String.raw`\displaystyle A=x(10-x)=10x-x^2`, String.raw`\displaystyle A'=10-2x=0\Rightarrow x=y=5,\ A=25`], "5 by 5; maximum area 25"],
    ["An open box has square base x and height 12 - 2x. Maximise its volume.", [String.raw`\displaystyle V=x^2(12-2x)=12x^2-2x^3`, String.raw`\displaystyle V'=24x-6x^2=6x(4-x)`, String.raw`\displaystyle x=4,\ h=4,\ V=64`], "maximum volume 64"],
    ["Minimise f(x) = x + 16/x for x > 0.", [String.raw`\displaystyle f'(x)=1-\frac{16}{x^2}=0`, String.raw`\displaystyle x^2=16\Rightarrow x=4`, String.raw`\displaystyle f(4)=4+\frac{16}{4}=8`], "minimum 8 at x = 4"],
  ],
  302: [
    ["A circle's radius grows at 2 centimetres per second. Find dA/dt when r = 3 cm.", [String.raw`\displaystyle A=\pi r^2`, String.raw`\displaystyle \frac{dA}{dt}=2\pi r\frac{dr}{dt}`, String.raw`\displaystyle \frac{dA}{dt}=2\pi(3)(2)=12\pi\ \mathrm{cm^2\,s^{-1}}`], String.raw`12\pi\ \mathrm{cm^2\,s^{-1}}`],
    ["A sphere's radius grows at 1 centimetre per second. Find dV/dt when r = 2 cm.", [String.raw`\displaystyle V=\frac43\pi r^3`, String.raw`\displaystyle \frac{dV}{dt}=4\pi r^2\frac{dr}{dt}`, String.raw`\displaystyle \frac{dV}{dt}=4\pi(2)^2(1)=16\pi\ \mathrm{cm^3\,s^{-1}}`], String.raw`16\pi\ \mathrm{cm^3\,s^{-1}}`],
  ],
  303: [["For s(t) = t³ - 6t² + 9t, find when the particle is at rest.", [String.raw`\displaystyle v(t)=s'(t)=3t^2-12t+9`, String.raw`\displaystyle 3(t-1)(t-3)=0`, String.raw`\displaystyle t=1\text{ or }t=3`], "t = 1 and t = 3"]],
  304: [
    ["Use Newton's method for x² - 2 = 0 from x₀ = 1. Find x₁ and x₂.", [String.raw`\displaystyle x_{n+1}=\frac12\left(x_n+\frac2{x_n}\right)`, String.raw`\displaystyle x_1=\frac12(1+2)=1.5`, String.raw`\displaystyle x_2=\frac12\left(\frac32+\frac43\right)=\frac{17}{12}\approx1.4167`], "x₁ = 1.5; x₂ ≈ 1.4167"],
    ["Use one Newton step for x² - 9 = 0 from x₀ = 4.", [String.raw`\displaystyle x_1=x_0-\frac{x_0^2-9}{2x_0}`, String.raw`\displaystyle x_1=4-\frac7{8}`, String.raw`\displaystyle x_1=\frac{25}{8}=3.125`], "3.125"],
  ],
  305: [["Use the degree-2 Taylor polynomial of eˣ at 0 to approximate e⁰·¹.", [String.raw`\displaystyle P_2(x)=1+x+\frac{x^2}{2}`, String.raw`\displaystyle P_2(0.1)=1+0.1+\frac{0.01}{2}`, String.raw`\displaystyle P_2(0.1)=1.105`], "1.105"]],
  306: [
    ["Use four right-endpoint rectangles for f(x) = x on [0,4].", [String.raw`\displaystyle \Delta x=1`, String.raw`\displaystyle R_4=1(1+2+3+4)`, String.raw`\displaystyle R_4=10`], "10"],
    ["Use four left-endpoint rectangles for f(x) = x on [0,4].", [String.raw`\displaystyle \Delta x=1`, String.raw`\displaystyle L_4=1(0+1+2+3)`, String.raw`\displaystyle L_4=6`], "6"],
    ["Use two midpoint rectangles for f(x) = x² on [0,2].", [String.raw`\displaystyle \Delta x=1,\quad m_1=0.5,\ m_2=1.5`, String.raw`\displaystyle M_2=1[(0.5)^2+(1.5)^2]`, String.raw`\displaystyle M_2=0.25+2.25=2.5`], "2.5"],
  ],
  307: [
    ["Compute the right Riemann sum for f(x)=x² on [0,2] with n=2.", [String.raw`\displaystyle \Delta x=1`, String.raw`\displaystyle R_2=1[f(1)+f(2)]`, String.raw`\displaystyle R_2=1+4=5`], "5"],
    ["Compute the left Riemann sum for f(x)=x² on [0,2] with n=2.", [String.raw`\displaystyle \Delta x=1`, String.raw`\displaystyle L_2=1[f(0)+f(1)]`, String.raw`\displaystyle L_2=0+1=1`], "1"],
    ["Compute the midpoint Riemann sum for f(x)=2x on [0,3] with n=3.", [String.raw`\displaystyle \Delta x=1,\quad m=0.5,1.5,2.5`, String.raw`\displaystyle M_3=1[1+3+5]`, String.raw`\displaystyle M_3=9`], "9"],
  ],
  308: [
    ["Evaluate the definite integral from 0 to 3 of 2x dx.", [String.raw`\displaystyle \int_0^3 2x\,dx=[x^2]_0^3`, String.raw`\displaystyle =3^2-0^2`, String.raw`\displaystyle =9`], "9"],
    ["Evaluate the definite integral from -1 to 1 of x² dx.", [String.raw`\displaystyle \int_{-1}^{1}x^2\,dx=\left[\frac{x^3}{3}\right]_{-1}^{1}`, String.raw`\displaystyle =\frac13-\left(-\frac13\right)`, String.raw`\displaystyle =\frac23`], String.raw`\frac23`],
    ["Evaluate the definite integral from 0 to π of sin x dx.", [String.raw`\displaystyle \int_0^\pi\sin x\,dx=[-\cos x]_0^\pi`, String.raw`\displaystyle =-\cos\pi+\cos0`, String.raw`\displaystyle =1+1=2`], "2"],
  ],
  309: [
    ["Find the indefinite integral of 3x².", [String.raw`\displaystyle \int3x^2\,dx`, String.raw`\displaystyle =3\frac{x^3}{3}`, String.raw`\displaystyle =x^3+C`], String.raw`x^3+C`],
    ["Find the indefinite integral of 2 cos x.", [String.raw`\displaystyle \frac{d}{dx}(2\sin x)=2\cos x`, String.raw`\displaystyle \int2\cos x\,dx=2\sin x+C`, String.raw`\displaystyle 2\sin x+C`], String.raw`2\sin x+C`],
    ["Find the indefinite integral of 1/x.", [String.raw`\displaystyle \frac{d}{dx}\ln|x|=\frac1x`, String.raw`\displaystyle \int\frac1x\,dx=\ln|x|+C`, String.raw`\displaystyle x\ne0`], String.raw`\ln|x|+C`],
  ],
  310: [
    ["Differentiate F(x) = integral from 0 to x of t² dt, then find F′(2).", [String.raw`\displaystyle F'(x)=x^2`, String.raw`\displaystyle F'(2)=2^2`, String.raw`\displaystyle F'(2)=4`], "4"],
    ["Use an antiderivative to evaluate the integral from 1 to 4 of 2x dx.", [String.raw`\displaystyle F(x)=x^2`, String.raw`\displaystyle \int_1^4 2x\,dx=F(4)-F(1)`, String.raw`\displaystyle =16-1=15`], "15"],
    ["Differentiate G(x) = integral from 1 to 3x of t² dt.", [String.raw`\displaystyle G'(x)=(3x)^2\frac{d}{dx}(3x)`, String.raw`\displaystyle G'(x)=9x^2\cdot3`, String.raw`\displaystyle G'(x)=27x^2`], String.raw`27x^2`],
  ],
  311: [
    ["Find the area between y = x and y = x² on [0,1].", [String.raw`\displaystyle A=\int_0^1(x-x^2)\,dx`, String.raw`\displaystyle =\left[\frac{x^2}{2}-\frac{x^3}{3}\right]_0^1`, String.raw`\displaystyle A=\frac12-\frac13=\frac16`], String.raw`\frac16`],
    ["Find the area between y = 4 and y = x² from x = -2 to x = 2.", [String.raw`\displaystyle A=\int_{-2}^{2}(4-x^2)\,dx`, String.raw`\displaystyle =\left[4x-\frac{x^3}{3}\right]_{-2}^{2}`, String.raw`\displaystyle A=\frac{32}{3}`], String.raw`\frac{32}{3}`],
    ["Find the area between y = 2x and y = x² on [0,2].", [String.raw`\displaystyle A=\int_0^2(2x-x^2)\,dx`, String.raw`\displaystyle =\left[x^2-\frac{x^3}{3}\right]_0^2`, String.raw`\displaystyle A=4-\frac83=\frac43`], String.raw`\frac43`],
  ],
  312: [
    ["Integrate 2x(x² + 1)³ using substitution.", [String.raw`\displaystyle u=x^2+1,\quad du=2x\,dx`, String.raw`\displaystyle \int u^3\,du=\frac{u^4}{4}+C`, String.raw`\displaystyle =\frac{(x^2+1)^4}{4}+C`], String.raw`\frac{(x^2+1)^4}{4}+C`],
    ["Evaluate the integral from 0 to 1 of 2x e^(x²) dx.", [String.raw`\displaystyle u=x^2,\quad du=2x\,dx`, String.raw`\displaystyle \int_0^1e^u\,du=[e^u]_0^1`, String.raw`\displaystyle =e-1`], String.raw`e-1`],
    ["Integrate cos x · sin²x.", [String.raw`\displaystyle u=\sin x,\quad du=\cos x\,dx`, String.raw`\displaystyle \int u^2\,du=\frac{u^3}{3}+C`, String.raw`\displaystyle =\frac{\sin^3x}{3}+C`], String.raw`\frac{\sin^3x}{3}+C`],
  ],
  313: [
    ["Integrate 2x eˣ by parts.", [String.raw`\displaystyle 2\int xe^x dx`, String.raw`\displaystyle =2\left(xe^x-\int e^x dx\right)`, String.raw`\displaystyle =2e^x(x-1)+C`], String.raw`2e^x(x-1)+C`],
    ["Integrate 3x cos x by parts.", [String.raw`\displaystyle 3\int x\cos x\,dx`, String.raw`\displaystyle =3\left(x\sin x-\int\sin x\,dx\right)`, String.raw`\displaystyle =3x\sin x+3\cos x+C`], String.raw`3x\sin x+3\cos x+C`],
    ["Integrate 2 ln x by parts.", [String.raw`\displaystyle 2\int\ln x\,dx`, String.raw`\displaystyle =2\left(x\ln x-\int1\,dx\right)`, String.raw`\displaystyle =2x\ln x-2x+C`], String.raw`2x\ln x-2x+C`],
  ],
  314: [
    ["Decompose 1/[x(x + 1)] into partial fractions.", [String.raw`\displaystyle \frac1{x(x+1)}=\frac A x+\frac B{x+1}`, String.raw`\displaystyle 1=A(x+1)+Bx`, String.raw`\displaystyle A=1,\ B=-1`], String.raw`\frac1x-\frac1{x+1}`],
    ["Decompose (3x + 5)/[(x + 1)(x + 2)].", [String.raw`\displaystyle 3x+5=A(x+2)+B(x+1)`, String.raw`\displaystyle A+B=3,\quad2A+B=5`, String.raw`\displaystyle A=2,\ B=1`], String.raw`\frac2{x+1}+\frac1{x+2}`],
    ["Decompose 1/(x² - 1).", [String.raw`\displaystyle \frac1{(x-1)(x+1)}=\frac A{x-1}+\frac B{x+1}`, String.raw`\displaystyle A=\frac12,\ B=-\frac12`, String.raw`\displaystyle \frac1{x^2-1}=\frac12\left(\frac1{x-1}-\frac1{x+1}\right)`], String.raw`\frac12\left(\frac1{x-1}-\frac1{x+1}\right)`],
  ],
  315: [
    ["Evaluate the improper integral from 1 to ∞ of 1/x² dx.", [String.raw`\displaystyle \int_1^b x^{-2}dx=\left[-\frac1x\right]_1^b`, String.raw`\displaystyle =1-\frac1b`, String.raw`\displaystyle \lim_{b\to\infty}\left(1-\frac1b\right)=1`], "1"],
    ["Evaluate the improper integral from 0 to 1 of 1/√x dx.", [String.raw`\displaystyle \int_a^1x^{-\frac12}\,dx=\left[2\sqrt x\right]_a^1`, String.raw`\displaystyle =2-2\sqrt a`, String.raw`\displaystyle \lim_{a\to0^+}(2-2\sqrt a)=2`], "2"],
    ["Determine whether the integral from 1 to ∞ of 1/x dx converges.", [String.raw`\displaystyle \int_1^b\frac1x dx=[\ln x]_1^b`, String.raw`\displaystyle =\ln b`, String.raw`\displaystyle \lim_{b\to\infty}\ln b=\infty\Rightarrow\text{diverges}`], "diverges"],
  ],
  316: [
    ["Use the trapezoidal rule with n = 2 for f(x) = x² on [0,2].", [String.raw`\displaystyle h=1`, String.raw`\displaystyle T_2=\frac12[f(0)+2f(1)+f(2)]`, String.raw`\displaystyle T_2=\frac12(0+2+4)=3`], "3"],
    ["Use Simpson's rule with n = 2 for f(x) = x² on [0,2].", [String.raw`\displaystyle h=1`, String.raw`\displaystyle S_2=\frac13[f(0)+4f(1)+f(2)]`, String.raw`\displaystyle S_2=\frac13(0+4+4)=\frac83`], String.raw`\frac83`],
  ],
  317: [
    ["A solid has square cross-sections of side x for 0 ≤ x ≤ 2. Find its volume.", [String.raw`\displaystyle A(x)=x^2`, String.raw`\displaystyle V=\int_0^2x^2\,dx`, String.raw`\displaystyle V=\left[\frac{x^3}{3}\right]_0^2=\frac83`], String.raw`\frac83`],
    ["Rotate y = x on [0,2] about the x-axis. Find the volume by disks.", [String.raw`\displaystyle V=\pi\int_0^2x^2\,dx`, String.raw`\displaystyle V=\pi\left[\frac{x^3}{3}\right]_0^2`, String.raw`\displaystyle V=\frac{8\pi}{3}`], String.raw`\frac{8\pi}{3}`],
    ["A washer has outer radius 3, inner radius 1, and thickness 5. Find its volume.", [String.raw`\displaystyle A=\pi(3^2-1^2)=8\pi`, String.raw`\displaystyle V=Ah`, String.raw`\displaystyle V=8\pi(5)=40\pi`], String.raw`40\pi`],
  ],
  319: [
    ["Rotate y = x on [0,2] about the y-axis. Find volume by shells.", [String.raw`\displaystyle V=2\pi\int_0^2x(x)\,dx`, String.raw`\displaystyle V=2\pi\left[\frac{x^3}{3}\right]_0^2`, String.raw`\displaystyle V=\frac{16\pi}{3}`], String.raw`\frac{16\pi}{3}`],
    ["Rotate y = 4 - x² on [0,2] about the y-axis. Find volume by shells.", [String.raw`\displaystyle V=2\pi\int_0^2x(4-x^2)\,dx`, String.raw`\displaystyle V=2\pi\left[2x^2-\frac{x^4}{4}\right]_0^2`, String.raw`\displaystyle V=8\pi`], String.raw`8\pi`],
  ],
  320: [["Find the arc length of y = 3x from x = 0 to x = 2.", [String.raw`\displaystyle L=\int_0^2\sqrt{1+(y')^2}\,dx`, String.raw`\displaystyle L=\int_0^2\sqrt{1+9}\,dx`, String.raw`\displaystyle L=2\sqrt{10}`], String.raw`2\sqrt{10}`]],
  321: [
    ["Rotate y = x on [0,1] about the x-axis. Find the surface area.", [String.raw`\displaystyle S=2\pi\int_0^1x\sqrt{1+1^2}\,dx`, String.raw`\displaystyle S=2\pi\sqrt2\left[\frac{x^2}{2}\right]_0^1`, String.raw`\displaystyle S=\pi\sqrt2`], String.raw`\pi\sqrt2`],
    ["Find the lateral surface area of a cylinder of radius 3 and height 5.", [String.raw`\displaystyle S=2\pi rh`, String.raw`\displaystyle S=2\pi(3)(5)`, String.raw`\displaystyle S=30\pi`], String.raw`30\pi`],
  ],
  322: [
    ["For F(x) = integral from 0 to x of 2t dt, find F(3).", [String.raw`\displaystyle F(x)=[t^2]_0^x=x^2`, String.raw`\displaystyle F(3)=3^2`, String.raw`\displaystyle F(3)=9`], "9"],
    ["Velocity is v(t) = 3t². Find accumulated displacement from t = 0 to t = 2.", [String.raw`\displaystyle s=\int_0^2 3t^2\,dt`, String.raw`\displaystyle s=[t^3]_0^2`, String.raw`\displaystyle s=8`], "8"],
    ["A quantity accumulates at rate r(t) = t + 1. Find its increase from 0 to 4.", [String.raw`\displaystyle A=\int_0^4(t+1)dt`, String.raw`\displaystyle A=\left[\frac{t^2}{2}+t\right]_0^4`, String.raw`\displaystyle A=8+4=12`], "12"],
  ],
  323: [
    ["Find the direction-field slope for y′ = x at (2,1).", [String.raw`\displaystyle y'=x`, String.raw`\displaystyle y'\big|_{(2,1)}=2`, String.raw`\displaystyle m=2`], "2"],
    ["Find the direction-field slope for y′ = y at (0,-3).", [String.raw`\displaystyle y'=y`, String.raw`\displaystyle y'\big|_{(0,-3)}=-3`, String.raw`\displaystyle m=-3`], "-3"],
    ["Find the direction-field slope for y′ = x - y at (4,1).", [String.raw`\displaystyle y'=x-y`, String.raw`\displaystyle y'\big|_{(4,1)}=4-1`, String.raw`\displaystyle m=3`], "3"],
  ],
  324: [
    ["Use one Euler step for y′ = y, y(0)=1, with h=0.1.", [String.raw`\displaystyle y_1=y_0+h f(x_0,y_0)`, String.raw`\displaystyle y_1=1+0.1(1)`, String.raw`\displaystyle y_1=1.1`], "1.1"],
    ["Use one Euler step for y′ = x + y, y(0)=1, with h=0.5.", [String.raw`\displaystyle f(0,1)=0+1=1`, String.raw`\displaystyle y_1=1+0.5(1)`, String.raw`\displaystyle y_1=1.5`], "1.5"],
  ],
  325: [
    ["Solve y′ = 2x with y(0)=1, then find y(2).", [String.raw`\displaystyle dy=2x\,dx`, String.raw`\displaystyle y=x^2+C,\quad C=1`, String.raw`\displaystyle y(2)=4+1=5`], "5"],
    ["Solve y′ = y with y(0)=2, then find y(ln 2).", [String.raw`\displaystyle \frac{dy}{y}=dx`, String.raw`\displaystyle y=2e^x`, String.raw`\displaystyle y(\ln2)=2e^{\ln2}=4`], "4"],
    ["Solve y′ = -2xy with y(0)=3, then find y(1).", [String.raw`\displaystyle \frac{dy}{y}=-2x\,dx`, String.raw`\displaystyle y=3e^{-x^2}`, String.raw`\displaystyle y(1)=\frac3e`], String.raw`\frac3e`],
  ],
  326: [
    ["Solve y′ + y = 0 with y(0) = 2, then find y(ln 2).", [String.raw`\displaystyle y'+y=0`, String.raw`\displaystyle y=Ce^{-x},\quad C=2`, String.raw`\displaystyle y(\ln2)=2e^{-\ln2}=1`], "1"],
    ["Solve y′ - 2y = 0 with y(0) = 3, then find y(1).", [String.raw`\displaystyle y'=2y`, String.raw`\displaystyle y=Ce^{2x},\quad C=3`, String.raw`\displaystyle y(1)=3e^2`], String.raw`3e^2`],
    ["Solve y′ + y = x with y(0) = 0, then find y(1).", [String.raw`\displaystyle (e^xy)'=xe^x`, String.raw`\displaystyle y=x-1+Ce^{-x},\quad C=1`, String.raw`\displaystyle y(1)=e^{-1}=\frac1e`], String.raw`\frac1e`],
  ],
  327: [
    ["For P′ = 0.2P(1 - P/100), find the growth rate when P = 50.", [String.raw`\displaystyle P'=0.2(50)\left(1-\frac{50}{100}\right)`, String.raw`\displaystyle P'=10\left(\frac12\right)`, String.raw`\displaystyle P'=5`], "5 units per time"],
    ["For P(t)=100/(1+9e⁻⁰·²ᵗ), find when P reaches 50.", [String.raw`\displaystyle 50=\frac{100}{1+9e^{-0.2t}}`, String.raw`\displaystyle 9e^{-0.2t}=1`, String.raw`\displaystyle t=\frac{\ln9}{0.2}=5\ln9`], String.raw`5\ln9`],
    ["For P(t)=100/(1+4e⁻⁰·¹ᵗ), estimate P(5).", [String.raw`\displaystyle P(5)=\frac{100}{1+4e^{-0.5}}`, String.raw`\displaystyle e^{-0.5}\approx0.6065`, String.raw`\displaystyle P(5)\approx29.18`], "approximately 29.18"],
  ],
  328: [
    ["Solve y″ + y = 0 with y(0)=0 and y′(0)=2.", [String.raw`\displaystyle y=A\cos x+B\sin x`, String.raw`\displaystyle A=0,\quad B=2`, String.raw`\displaystyle y=2\sin x`], String.raw`y=2\sin x`],
    ["Solve y″ - 4y = 0 with y(0)=1 and y′(0)=0.", [String.raw`\displaystyle y=Ae^{2x}+Be^{-2x}`, String.raw`\displaystyle A+B=1,\quad2A-2B=0`, String.raw`\displaystyle y=\frac{e^{2x}+e^{-2x}}2=\cosh2x`], String.raw`y=\cosh2x`],
    ["Solve y″ = 6x with y(0)=0 and y′(0)=1.", [String.raw`\displaystyle y'=3x^2+C_1,\quad C_1=1`, String.raw`\displaystyle y=x^3+x+C_2,\quad C_2=0`, String.raw`\displaystyle y=x^3+x`], String.raw`y=x^3+x`],
  ],
  329: [
    ["For x′ = x and y′ = -y, find the phase-plane vector at (2,3).", [String.raw`\displaystyle x'=2`, String.raw`\displaystyle y'=-3`, String.raw`\displaystyle (x',y')=(2,-3)`], "(2, -3)"],
    ["For x′ = y and y′ = -x, find the vector and energy x²+y² at (3,4).", [String.raw`\displaystyle (x',y')=(4,-3)`, String.raw`\displaystyle E=x^2+y^2`, String.raw`\displaystyle E=3^2+4^2=25`], "vector (4,-3); energy 25"],
    ["Find the equilibria of x′ = x(1-x), y′ = -y.", [String.raw`\displaystyle x(1-x)=0\Rightarrow x=0,1`, String.raw`\displaystyle -y=0\Rightarrow y=0`, String.raw`\displaystyle (x,y)=(0,0),(1,0)`], "(0, 0) and (1, 0)"],
  ],
  330: [
    ["Classify the equilibria of x′ = x(1 - x).", [String.raw`\displaystyle f(x)=0\Rightarrow x=0,1`, String.raw`\displaystyle f'(x)=1-2x`, String.raw`\displaystyle f'(0)=1>0\text{ unstable};\quad f'(1)=-1<0\text{ stable}`], "0 unstable; 1 stable"],
    ["Classify the equilibrium of x′ = -2x.", [String.raw`\displaystyle -2x=0\Rightarrow x=0`, String.raw`\displaystyle f'(0)=-2<0`, String.raw`\displaystyle x=0\text{ is stable}`], "x = 0 is stable"],
    ["For x′ = x², inspect the flow near equilibrium x = 0 using x = -1 and x = 1.", [String.raw`\displaystyle f(-1)=1>0`, String.raw`\displaystyle f(1)=1>0`, String.raw`\displaystyle \text{flow points right on both sides}\Rightarrow\text{semistable}`], "x = 0 is semistable"],
  ],
  331: [
    ["For xₙ₊₁ = 2xₙ + 1 with x₀ = 1, find x₁, x₂, x₃.", [String.raw`\displaystyle x_1=2(1)+1=3`, String.raw`\displaystyle x_2=2(3)+1=7`, String.raw`\displaystyle x_3=2(7)+1=15`], "3, 7, 15"],
    ["For xₙ₊₁ = xₙ/2 with x₀ = 16, find x₃.", [String.raw`\displaystyle x_1=\frac{16}{2}=8`, String.raw`\displaystyle x_2=\frac82=4`, String.raw`\displaystyle x_3=\frac42=2`], "2"],
  ],
  333: [
    ["Iterate xₙ₊₁ = 2xₙ(1-xₙ) twice from x₀ = 0.25.", [String.raw`\displaystyle x_1=2(0.25)(0.75)=0.375`, String.raw`\displaystyle x_2=2(0.375)(0.625)`, String.raw`\displaystyle x_2=0.46875`], "0.46875"],
    ["Iterate xₙ₊₁ = 3.2xₙ(1-xₙ) twice from x₀ = 0.5.", [String.raw`\displaystyle x_1=3.2(0.5)(0.5)=0.8`, String.raw`\displaystyle x_2=3.2(0.8)(0.2)`, String.raw`\displaystyle x_2=0.512`], "0.512"],
    ["Compare one logistic-map step at r = 4 from x₀ = 0.200 and x₀ = 0.201.", [String.raw`\displaystyle x_1=4(0.2)(0.8)=0.64`, String.raw`\displaystyle \tilde x_1=4(0.201)(0.799)=0.642396`, String.raw`\displaystyle |\tilde x_1-x_1|=0.002396`], "0.64 and 0.642396"],
  ],
  335: [
    ["Find the 10th term of 5, 8, 11, ...", [String.raw`\displaystyle a_1=5,\quad d=3`, String.raw`\displaystyle a_{10}=a_1+9d`, String.raw`\displaystyle a_{10}=5+27=32`], "32"],
    ["Find the 15th term of 12, 8, 4, ...", [String.raw`\displaystyle a_1=12,\quad d=-4`, String.raw`\displaystyle a_{15}=12+14(-4)`, String.raw`\displaystyle a_{15}=-44`], "-44"],
  ],
  337: [
    ["For a₁=2 and aₙ₊₁=3aₙ-1, find a₄.", [String.raw`\displaystyle a_2=3(2)-1=5`, String.raw`\displaystyle a_3=3(5)-1=14`, String.raw`\displaystyle a_4=3(14)-1=41`], "41"],
    ["For a₁=10 and aₙ₊₁=aₙ/2, find a₄.", [String.raw`\displaystyle a_2=5`, String.raw`\displaystyle a_3=\frac52=2.5`, String.raw`\displaystyle a_4=\frac54=1.25`], "1.25"],
  ],
  339: [
    ["Evaluate the sum from k=1 to 5 of k².", [String.raw`\displaystyle \sum_{k=1}^{5}k^2=1^2+2^2+3^2+4^2+5^2`, String.raw`\displaystyle =1+4+9+16+25`, String.raw`\displaystyle =55`], "55"],
    ["Evaluate the sum from k=0 to 4 of 2ᵏ.", [String.raw`\displaystyle \sum_{k=0}^{4}2^k=1+2+4+8+16`, String.raw`\displaystyle =31`, String.raw`\displaystyle \frac{2^5-1}{2-1}=31`], "31"],
  ],
  340: [
    ["Find the sum of the first 20 positive integers.", [String.raw`\displaystyle S_n=\frac{n}{2}(a_1+a_n)`, String.raw`\displaystyle S_{20}=\frac{20}{2}(1+20)`, String.raw`\displaystyle S_{20}=10(21)=210`], "210"],
    ["Find the sum of the first 10 terms of 5, 8, 11, ...", [String.raw`\displaystyle a=5,\quad d=3,\quad n=10`, String.raw`\displaystyle S_{10}=\frac{10}{2}[2(5)+9(3)]`, String.raw`\displaystyle S_{10}=5(37)=185`], "185"],
  ],
  343: [
    ["Use the first four terms of 1 + x + x² + ··· to approximate 1/(1-x) at x = 1/2.", [String.raw`\displaystyle S_4=1+\frac12+\frac14+\frac18`, String.raw`\displaystyle S_4=\frac{15}{8}`, String.raw`\displaystyle S_4=1.875`], "1.875"],
    ["Find the radius of convergence of the power series Σ(x/3)ⁿ.", [String.raw`\displaystyle \left|\frac{x}{3}\right|<1`, String.raw`\displaystyle |x|<3`, String.raw`\displaystyle R=3`], "3"],
  ],
  346: [
    ["A balance follows aₙ₊₁ = 1.05aₙ + 100 with a₀ = 1000. Find a₁.", [String.raw`\displaystyle a_1=1.05(1000)+100`, String.raw`\displaystyle a_1=1050+100`, String.raw`\displaystyle a_1=1150`], "1150"],
    ["A population doubles each period: aₙ₊₁ = 2aₙ, a₀ = 50. Find a₃.", [String.raw`\displaystyle a_1=2(50)=100`, String.raw`\displaystyle a_2=200`, String.raw`\displaystyle a_3=400`], "400"],
  ],
  347: [
    ["Build a 2×3 matrix whose rows are (1,2,3) and (4,5,6).", [String.raw`\displaystyle r_1=(1,2,3)`, String.raw`\displaystyle r_2=(4,5,6)`, String.raw`\displaystyle A=\begin{pmatrix}1&2&3\\4&5&6\end{pmatrix}`], String.raw`\begin{pmatrix}1&2&3\\4&5&6\end{pmatrix}`],
    ["Build the 2×2 diagonal matrix with diagonal entries 3 and -1.", [String.raw`\displaystyle a_{11}=3,\quad a_{22}=-1`, String.raw`\displaystyle a_{12}=a_{21}=0`, String.raw`\displaystyle D=\begin{pmatrix}3&0\\0&-1\end{pmatrix}`], String.raw`\begin{pmatrix}3&0\\0&-1\end{pmatrix}`],
  ],
  348: [
    ["Add A=[[1,2],[3,4]] and B=[[5,6],[7,8]].", [String.raw`\displaystyle A+B=\begin{pmatrix}1+5&2+6\\3+7&4+8\end{pmatrix}`, String.raw`\displaystyle =\begin{pmatrix}6&8\\10&12\end{pmatrix}`, String.raw`\displaystyle A+B=\begin{pmatrix}6&8\\10&12\end{pmatrix}`], String.raw`\begin{pmatrix}6&8\\10&12\end{pmatrix}`],
    ["Subtract B=[[2,1],[0,3]] from A=[[7,4],[5,9]].", [String.raw`\displaystyle A-B=\begin{pmatrix}7-2&4-1\\5-0&9-3\end{pmatrix}`, String.raw`\displaystyle =\begin{pmatrix}5&3\\5&6\end{pmatrix}`, String.raw`\displaystyle A-B=\begin{pmatrix}5&3\\5&6\end{pmatrix}`], String.raw`\begin{pmatrix}5&3\\5&6\end{pmatrix}`],
  ],
  349: [
    ["Multiply A=[[1,-2],[3,0]] by scalar 4.", [String.raw`\displaystyle 4A=4\begin{pmatrix}1&-2\\3&0\end{pmatrix}`, String.raw`\displaystyle 4A=\begin{pmatrix}4&-8\\12&0\end{pmatrix}`, String.raw`\displaystyle \text{each entry is multiplied by }4`], String.raw`\begin{pmatrix}4&-8\\12&0\end{pmatrix}`],
    ["Multiply B=[[2,5],[-1,3]] by scalar -2.", [String.raw`\displaystyle -2B=-2\begin{pmatrix}2&5\\-1&3\end{pmatrix}`, String.raw`\displaystyle -2B=\begin{pmatrix}-4&-10\\2&-6\end{pmatrix}`, String.raw`\displaystyle \text{each entry is multiplied by }-2`], String.raw`\begin{pmatrix}-4&-10\\2&-6\end{pmatrix}`],
  ],
  350: [
    ["Multiply A=[[1,2],[3,4]] by B=[[2,0],[1,2]].", [String.raw`\displaystyle AB=\begin{pmatrix}1(2)+2(1)&1(0)+2(2)\\3(2)+4(1)&3(0)+4(2)\end{pmatrix}`, String.raw`\displaystyle AB=\begin{pmatrix}4&4\\10&8\end{pmatrix}`, String.raw`\displaystyle AB=\begin{pmatrix}4&4\\10&8\end{pmatrix}`], String.raw`\begin{pmatrix}4&4\\10&8\end{pmatrix}`],
    ["Multiply row vector [2, -1] by column vector [[3],[4]].", [String.raw`\displaystyle \begin{pmatrix}2&-1\end{pmatrix}\begin{pmatrix}3\\4\end{pmatrix}`, String.raw`\displaystyle =2(3)+(-1)(4)`, String.raw`\displaystyle =2`], "2"],
  ],
  352: [
    ["Transpose the matrix [[1,2,3],[4,5,6]].", [String.raw`\displaystyle A=\begin{pmatrix}1&2&3\\4&5&6\end{pmatrix}`, String.raw`\displaystyle (A^T)_{ij}=A_{ji}`, String.raw`\displaystyle A^T=\begin{pmatrix}1&4\\2&5\\3&6\end{pmatrix}`], String.raw`\begin{pmatrix}1&4\\2&5\\3&6\end{pmatrix}`],
    ["Transpose the symmetric matrix [[2,-1],[-1,3]].", [String.raw`\displaystyle A=\begin{pmatrix}2&-1\\-1&3\end{pmatrix}`, String.raw`\displaystyle A^T=\begin{pmatrix}2&-1\\-1&3\end{pmatrix}`, String.raw`\displaystyle A^T=A`], "unchanged"],
  ],
  354: [["Find the inverse of A=[[2,1],[1,1]].", [String.raw`\displaystyle \det A=2(1)-1(1)=1`, String.raw`\displaystyle A^{-1}=\frac1{\det A}\begin{pmatrix}1&-1\\-1&2\end{pmatrix}`, String.raw`\displaystyle A^{-1}=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}`], String.raw`\begin{pmatrix}1&-1\\-1&2\end{pmatrix}`]],
  355: [
    ["Apply R₂ → R₂ - 3R₁ to [[1,2],[3,7]].", [String.raw`\displaystyle R_2-3R_1=(3,7)-3(1,2)`, String.raw`\displaystyle =(0,1)`, String.raw`\displaystyle \begin{pmatrix}1&2\\0&1\end{pmatrix}`], String.raw`\begin{pmatrix}1&2\\0&1\end{pmatrix}`],
    ["Swap the two rows of [[2,5],[-1,4]].", [String.raw`\displaystyle R_1\leftrightarrow R_2`, String.raw`\displaystyle R_1=(-1,4),\quad R_2=(2,5)`, String.raw`\displaystyle \begin{pmatrix}-1&4\\2&5\end{pmatrix}`], String.raw`\begin{pmatrix}-1&4\\2&5\end{pmatrix}`],
  ],
  357: [
    ["Write the augmented matrix for x + y = 5 and 2x - y = 1.", [String.raw`\displaystyle x+y=5`, String.raw`\displaystyle 2x-y=1`, String.raw`\displaystyle \left(\begin{array}{cc|c}1&1&5\\2&-1&1\end{array}\right)`], String.raw`\left(\begin{array}{cc|c}1&1&5\\2&-1&1\end{array}\right)`],
    ["Row-reduce [[1,1|5],[2,-1|1]] and solve the system.", [String.raw`\displaystyle R_2\to R_2-2R_1\Rightarrow(0,-3|-9)`, String.raw`\displaystyle y=3`, String.raw`\displaystyle x=5-3=2`], "x = 2, y = 3"],
    ["Use the augmented matrix [[1,1|2],[2,2|5]] to identify consistency.", [String.raw`\displaystyle R_2\to R_2-2R_1`, String.raw`\displaystyle (0,0|1)`, String.raw`\displaystyle 0=1\Rightarrow\text{no solution}`], "inconsistent; no solution"],
  ],
  358: [
    ["Apply T(x,y) = (2x,3y) to (1,-2).", [String.raw`\displaystyle T(1,-2)=(2(1),3(-2))`, String.raw`\displaystyle T(1,-2)=(2,-6)`, String.raw`\displaystyle \begin{pmatrix}2&0\\0&3\end{pmatrix}\begin{pmatrix}1\\-2\end{pmatrix}=\begin{pmatrix}2\\-6\end{pmatrix}`], "(2, -6)"],
    ["Project (4,5) onto the x-axis using a linear transformation.", [String.raw`\displaystyle P=\begin{pmatrix}1&0\\0&0\end{pmatrix}`, String.raw`\displaystyle P\begin{pmatrix}4\\5\end{pmatrix}=\begin{pmatrix}4\\0\end{pmatrix}`, String.raw`\displaystyle T(4,5)=(4,0)`], "(4, 0)"],
  ],
  360: [
    ["Find the dimension of R³ using its standard basis.", [String.raw`\displaystyle e_1=(1,0,0)`, String.raw`\displaystyle e_2=(0,1,0),\quad e_3=(0,0,1)`, String.raw`\displaystyle \dim(\mathbb R^3)=3`], "3"],
    ["Find the dimension of span{(1,0),(0,1),(1,1)}.", [String.raw`\displaystyle (1,1)=(1,0)+(0,1)`, String.raw`\displaystyle (1,0),(0,1)\text{ are independent}`, String.raw`\displaystyle \dim=2`], "2"],
  ],
  361: [
    ["Test whether (1,2) and (2,4) are linearly independent.", [String.raw`\displaystyle (2,4)=2(1,2)`, String.raw`\displaystyle 2(1,2)-(2,4)=(0,0)`, String.raw`\displaystyle \text{nonzero coefficients}\Rightarrow\text{dependent}`], "dependent"],
    ["Test whether (1,2) and (3,4) are linearly independent.", [String.raw`\displaystyle \det\begin{pmatrix}1&3\\2&4\end{pmatrix}=4-6`, String.raw`\displaystyle \det=-2\ne0`, String.raw`\displaystyle \text{vectors are independent}`], "independent"],
  ],
  362: [
    ["Give a basis and dimension for polynomials of degree at most 2.", [String.raw`\displaystyle p(x)=a+bx+cx^2`, String.raw`\displaystyle \mathcal B=\{1,x,x^2\}`, String.raw`\displaystyle \dim P_2=3`], "basis {1,x,x²}; dimension 3"],
    ["Give a standard basis and dimension for 2×2 real matrices.", [String.raw`\displaystyle E_{11},E_{12},E_{21},E_{22}`, String.raw`\displaystyle A=aE_{11}+bE_{12}+cE_{21}+dE_{22}`, String.raw`\displaystyle \dim M_{2\times2}=4`], "dimension 4"],
    ["Find a basis for the solution space x + y = 0.", [String.raw`\displaystyle y=-x`, String.raw`\displaystyle (x,y)=x(1,-1)`, String.raw`\displaystyle \mathcal B=\{(1,-1)\},\quad\dim=1`], "basis {(1,-1)}; dimension 1"],
  ],
  363: [
    ["Apply Gram–Schmidt to u₁=(1,0), u₂=(1,1).", [String.raw`\displaystyle e_1=(1,0)`, String.raw`\displaystyle v_2=u_2-(u_2\cdot e_1)e_1=(1,1)-(1,0)=(0,1)`, String.raw`\displaystyle e_2=(0,1)`], "(1,0), (0,1)"],
    ["Orthonormalise u₁=(1,1), u₂=(1,-1).", [String.raw`\displaystyle u_1\cdot u_2=1-1=0`, String.raw`\displaystyle |u_1|=|u_2|=\sqrt2`, String.raw`\displaystyle e_1=\frac1{\sqrt2}(1,1),\ e_2=\frac1{\sqrt2}(1,-1)`], String.raw`\frac1{\sqrt2}(1,1),\ \frac1{\sqrt2}(1,-1)`],
  ],
  364: [
    ["Find the least-squares line through (0,1), (1,3), (2,5).", [String.raw`\displaystyle m=\frac{3-1}{1-0}=2`, String.raw`\displaystyle b=1`, String.raw`\displaystyle \hat y=2x+1\text{ with zero residuals}`], String.raw`\hat y=2x+1`],
    ["Fit a constant to data 2, 4, 8 by least squares.", [String.raw`\displaystyle \bar y=\frac{2+4+8}{3}`, String.raw`\displaystyle \bar y=\frac{14}{3}`, String.raw`\displaystyle \hat y=\frac{14}{3}`], String.raw`\frac{14}{3}`],
    ["For fitted values (2,5,8) and observations (3,4,10), find the residual vector.", [String.raw`\displaystyle e=y-\hat y`, String.raw`\displaystyle e=(3-2,4-5,10-8)`, String.raw`\displaystyle e=(1,-1,2)`], "(1, -1, 2)"],
  ],
  365: [
    ["Plot z = -3 + 4i on the complex plane and find |z|.", [String.raw`\displaystyle z\leftrightarrow(-3,4)`, String.raw`\displaystyle |z|=\sqrt{(-3)^2+4^2}`, String.raw`\displaystyle |z|=5`], "point (-3,4); modulus 5"],
    ["Find the modulus and argument of z = 2 - 2i.", [String.raw`\displaystyle |z|=\sqrt{2^2+(-2)^2}=2\sqrt2`, String.raw`\displaystyle \tan\theta=\frac{-2}{2}=-1`, String.raw`\displaystyle \theta=-\frac\pi4`], String.raw`|z|=2\sqrt2,\ \arg z=-\frac\pi4`],
  ],
  367: [
    ["Add (3 + 2i) and (-1 + 5i).", [String.raw`\displaystyle (3+2i)+(-1+5i)`, String.raw`\displaystyle =(3-1)+(2+5)i`, String.raw`\displaystyle =2+7i`], String.raw`2+7i`],
    ["Add (-4 - 3i) and (6 + i).", [String.raw`\displaystyle (-4-3i)+(6+i)`, String.raw`\displaystyle =(-4+6)+(-3+1)i`, String.raw`\displaystyle =2-2i`], String.raw`2-2i`],
  ],
  369: [
    ["Find the conjugate of z = -3 + 4i and multiply z by it.", [String.raw`\displaystyle \bar z=-3-4i`, String.raw`\displaystyle z\bar z=(-3)^2+4^2`, String.raw`\displaystyle z\bar z=25`], "conjugate -3 - 4i; product 25"],
    ["Simplify (2 + i)/(2 - i) using a conjugate.", [String.raw`\displaystyle \frac{2+i}{2-i}\frac{2+i}{2+i}`, String.raw`\displaystyle =\frac{(2+i)^2}{2^2+1^2}`, String.raw`\displaystyle =\frac{3+4i}{5}`], String.raw`\frac35+\frac45i`],
  ],
  371: [
    ["Write z = 1 + i in polar form.", [String.raw`\displaystyle r=\sqrt{1^2+1^2}=\sqrt2`, String.raw`\displaystyle \theta=\tan^{-1}(1)=\frac\pi4`, String.raw`\displaystyle z=\sqrt2\left(\cos\frac\pi4+i\sin\frac\pi4\right)`], String.raw`\sqrt2\operatorname{cis}\frac\pi4`],
    ["Write z = -√3 + i in polar form.", [String.raw`\displaystyle r=\sqrt{3+1}=2`, String.raw`\displaystyle \theta=\frac{5\pi}{6}`, String.raw`\displaystyle z=2\left(\cos\frac{5\pi}{6}+i\sin\frac{5\pi}{6}\right)`], String.raw`2\operatorname{cis}\frac{5\pi}{6}`],
  ],
  372: [
    ["Evaluate e^(iπ) using Euler form.", [String.raw`\displaystyle e^{i\pi}=\cos\pi+i\sin\pi`, String.raw`\displaystyle =-1+i(0)`, String.raw`\displaystyle e^{i\pi}=-1`], "-1"],
    ["Convert 2e^(iπ/3) to rectangular form.", [String.raw`\displaystyle 2e^{i\frac\pi3}=2\left(\cos\frac\pi3+i\sin\frac\pi3\right)`, String.raw`\displaystyle =2\left(\frac12+i\frac{\sqrt3}{2}\right)`, String.raw`\displaystyle =1+i\sqrt3`], String.raw`1+i\sqrt3`],
  ],
  373: [
    ["Evaluate (1 + i)⁴ using polar form.", [String.raw`\displaystyle 1+i=\sqrt2\operatorname{cis}\frac\pi4`, String.raw`\displaystyle (1+i)^4=4\operatorname{cis}\pi`, String.raw`\displaystyle (1+i)^4=-4`], "-4"],
    ["Evaluate (√3 + i)³ using De Moivre's theorem.", [String.raw`\displaystyle \sqrt3+i=2\operatorname{cis}\frac\pi6`, String.raw`\displaystyle (\sqrt3+i)^3=8\operatorname{cis}\frac\pi2`, String.raw`\displaystyle =8i`], String.raw`8i`],
  ],
  375: [
    ["Find the complex roots of z² + 1 = 0.", [String.raw`\displaystyle z^2=-1`, String.raw`\displaystyle -1=e^{i(\pi+2k\pi)}`, String.raw`\displaystyle z=\pm i`], String.raw`z=\pm i`],
    ["Find all roots of z³ = 8.", [String.raw`\displaystyle 8=8e^{i2k\pi}`, String.raw`\displaystyle z=2e^{i\frac{2k\pi}{3}},\quad k=0,1,2`, String.raw`\displaystyle z=2,-1+i\sqrt3,-1-i\sqrt3`], String.raw`2,-1\pm i\sqrt3`],
  ],
  376: [
    ["Apply w = 1/z to z = 1 + i.", [String.raw`\displaystyle w=\frac1{1+i}\frac{1-i}{1-i}`, String.raw`\displaystyle w=\frac{1-i}{2}`, String.raw`\displaystyle w=\frac12-\frac12i`], String.raw`\frac{1-i}{2}`],
    ["Apply w = (z - 1)/(z + 1) to z = i.", [String.raw`\displaystyle w=\frac{i-1}{i+1}`, String.raw`\displaystyle w=\frac{(i-1)(1-i)}{(i+1)(1-i)}`, String.raw`\displaystyle w=\frac{2i}{2}=i`], String.raw`i`],
  ],
  377: [
    ["Evaluate f(z) = z² at z = 1 + i.", [String.raw`\displaystyle f(1+i)=(1+i)^2`, String.raw`\displaystyle =1+2i+i^2`, String.raw`\displaystyle =2i`], String.raw`2i`],
    ["Evaluate f(z) = eᶻ at z = iπ.", [String.raw`\displaystyle e^{i\pi}=\cos\pi+i\sin\pi`, String.raw`\displaystyle =-1+0i`, String.raw`\displaystyle =-1`], "-1"],
  ],
  398: [["Find the volume of a cone with radius 3 and height 4.", [String.raw`\displaystyle V=\frac13\pi r^2h`, String.raw`\displaystyle V=\frac13\pi(3)^2(4)`, String.raw`\displaystyle V=12\pi`], String.raw`12\pi`]],
  400: [["Find the total surface area of a solid hemisphere of radius 4.", [String.raw`\displaystyle S=2\pi r^2+\pi r^2`, String.raw`\displaystyle S=3\pi(4)^2`, String.raw`\displaystyle S=48\pi`], String.raw`48\pi`]],
  401: [["Find the volume of a conical frustum with radii 5 and 3 and height 4.", [String.raw`\displaystyle V=\frac13\pi h(R^2+Rr+r^2)`, String.raw`\displaystyle V=\frac13\pi(4)(25+15+9)`, String.raw`\displaystyle V=\frac{196\pi}{3}`], String.raw`\frac{196\pi}{3}`]],
  402: [["Rotate y = x from x = 0 to x = 2 about the x-axis and find the surface area.", [String.raw`\displaystyle S=2\pi\int_0^2 x\sqrt{1+(1)^2}\,dx`, String.raw`\displaystyle S=2\pi\sqrt2\left[\frac{x^2}{2}\right]_0^2`, String.raw`\displaystyle S=4\pi\sqrt2`], String.raw`4\pi\sqrt2`]],
  404: [["A cube net has 6 squares of side 3 cm. Find its total area.", [String.raw`\displaystyle A_{\text{one face}}=3^2=9`, String.raw`\displaystyle A_{\text{net}}=6(9)`, String.raw`\displaystyle A_{\text{net}}=54\text{ cm}^2`], String.raw`54\text{ cm}^2`]],
  405: [["A plane cuts a cube of side 6 parallel to a face. Find the cross-sectional area.", [String.raw`\displaystyle \text{cross-section}=6\times6`, String.raw`\displaystyle A=36`, String.raw`\displaystyle A=36\text{ square units}`], String.raw`36\text{ square units}`]],
  407: [["Find the surface area of a rectangular prism measuring 3 by 4 by 5.", [String.raw`\displaystyle S=2(lw+lh+wh)`, String.raw`\displaystyle S=2(3\cdot4+3\cdot5+4\cdot5)`, String.raw`\displaystyle S=94`], "94 square units"]],
  409: [["An X-ray view shows all 12 edges of a cube of length 4. Find their total length.", [String.raw`\displaystyle n=12`, String.raw`\displaystyle L=12(4)`, String.raw`\displaystyle L=48`], "48 units"]],
  410: [["Rotate a camera from 25° to 70°. Find the rotation angle.", [String.raw`\displaystyle \Delta\theta=70^\circ-25^\circ`, String.raw`\displaystyle \Delta\theta=45^\circ`, String.raw`\displaystyle 45^\circ=\frac\pi4\text{ rad}`], String.raw`45^\circ`]],
  411: [["A cuboid is 8 by 5 by 3. Find the area seen in its top orthographic view.", [String.raw`\displaystyle \text{top view}=8\times5`, String.raw`\displaystyle A=40`, String.raw`\displaystyle A=40\text{ square units}`], "40 square units"]],
  413: [["Evaluate the surface z = x² + 2y at (3, 4).", [String.raw`\displaystyle z=3^2+2(4)`, String.raw`\displaystyle z=9+8`, String.raw`\displaystyle z=17`], "17"]],
  418: [["Convert cylindrical coordinates (r, θ, z) = (4, π/3, 2) to Cartesian coordinates.", [String.raw`\displaystyle x=r\cos\theta=4\cos\frac\pi3=2`, String.raw`\displaystyle y=r\sin\theta=4\sin\frac\pi3=2\sqrt3`, String.raw`\displaystyle (x,y,z)=(2,2\sqrt3,2)`], String.raw`(2,2\sqrt3,2)`]],
  420: [["Find the contour of z = x² + y² at height z = 25.", [String.raw`\displaystyle x^2+y^2=25`, String.raw`\displaystyle r=\sqrt{25}=5`, String.raw`\displaystyle \text{the contour is a circle of radius }5`], "circle of radius 5"]],
  422: [["For f(x,y) = x²y + 3y, find ∂f/∂x at (2, 1).", [String.raw`\displaystyle f_x=2xy`, String.raw`\displaystyle f_x(2,1)=2(2)(1)`, String.raw`\displaystyle f_x(2,1)=4`], "4"]],
  423: [["Find the gradient of f(x,y) = x² + 3y² at (2, -1).", [String.raw`\displaystyle \nabla f=(2x,6y)`, String.raw`\displaystyle \nabla f(2,-1)=(4,-6)`, String.raw`\displaystyle |\nabla f|=\sqrt{4^2+(-6)^2}=2\sqrt{13}`], String.raw`(4,-6)`]],
  424: [["Find the tangent plane to z = x² + y² at (1, 2, 5).", [String.raw`\displaystyle f_x=2x=2,\qquad f_y=2y=4`, String.raw`\displaystyle z-5=2(x-1)+4(y-2)`, String.raw`\displaystyle z=2x+4y-5`], String.raw`z=2x+4y-5`]],
  425: [["Find a normal vector to z = x² + y² at (1, 2, 5).", [String.raw`\displaystyle F(x,y,z)=x^2+y^2-z`, String.raw`\displaystyle \nabla F=(2x,2y,-1)`, String.raw`\displaystyle \nabla F(1,2,5)=(2,4,-1)`], String.raw`(2,4,-1)`]],
  427: [["Find the minimum of f(x,y) = (x - 2)² + (y + 1)² + 3.", [String.raw`\displaystyle (x-2)^2\ge0,\qquad(y+1)^2\ge0`, String.raw`\displaystyle x=2,\qquad y=-1`, String.raw`\displaystyle f_{\min}=3`], "minimum 3 at (2, -1)"]],
  428: [["Evaluate 2x² - 3y when x = 4 and y = 5.", [String.raw`\displaystyle 2(4)^2-3(5)`, String.raw`\displaystyle =32-15`, String.raw`\displaystyle =17`], "17"]],
  430: [["Expand (2x - 3)(x + 4).", [String.raw`\displaystyle (2x-3)(x+4)=2x^2+8x-3x-12`, String.raw`\displaystyle =2x^2+5x-12`, String.raw`\displaystyle \text{check at }x=1:\;-5=-5`], String.raw`2x^2+5x-12`]],
  431: [["Factor 6x² + 11x + 3.", [String.raw`\displaystyle 6x^2+11x+3=6x^2+9x+2x+3`, String.raw`\displaystyle =3x(2x+3)+1(2x+3)`, String.raw`\displaystyle =(3x+1)(2x+3)`], String.raw`(3x+1)(2x+3)`]],
  433: [["Solve 5x - 7 = 18.", [String.raw`\displaystyle 5x=18+7`, String.raw`\displaystyle 5x=25`, String.raw`\displaystyle x=\frac{25}{5}=5`], String.raw`x=5`]],
  434: [["Numerically solve x² = 10 to three decimal places.", [String.raw`\displaystyle x=\sqrt{10}`, String.raw`\displaystyle \sqrt{10}=3.162277\ldots`, String.raw`\displaystyle x\approx3.162`], String.raw`x\approx3.162`]],
  435: [
    ["Solve x + y = 7 and x - y = 1.", [String.raw`\displaystyle 2x=8`, String.raw`\displaystyle x=4`, String.raw`\displaystyle y=7-4=3`], String.raw`x=4,\ y=3`],
    ["Solve 2x + y = 8 and x - y = 1.", [String.raw`\displaystyle (2x+y)+(x-y)=8+1`, String.raw`\displaystyle 3x=9\Rightarrow x=3`, String.raw`\displaystyle y=8-2(3)=2`], String.raw`x=3,\ y=2`],
  ],
  436: [
    ["Eliminate y from 2x + y = 9 and 3x - y = 6.", [String.raw`\displaystyle (2x+y)+(3x-y)=9+6`, String.raw`\displaystyle 5x=15`, String.raw`\displaystyle x=3,\quad y=3`], String.raw`x=3,\ y=3`],
    ["Eliminate x from x + 2y = 11 and x - y = 2.", [String.raw`\displaystyle (x+2y)-(x-y)=11-2`, String.raw`\displaystyle 3y=9\Rightarrow y=3`, String.raw`\displaystyle x=2+y=5`], String.raw`x=5,\ y=3`],
    ["Eliminate y from 4x + 3y = 18 and 2x + 3y = 12.", [String.raw`\displaystyle (4x+3y)-(2x+3y)=18-12`, String.raw`\displaystyle 2x=6\Rightarrow x=3`, String.raw`\displaystyle 6+3y=12\Rightarrow y=2`], String.raw`x=3,\ y=2`],
  ],
  437: [
    ["Decompose 5/(x(x + 2)) into partial fractions.", [String.raw`\displaystyle \frac5{x(x+2)}=\frac A x+\frac B{x+2}`, String.raw`\displaystyle 5=A(x+2)+Bx`, String.raw`\displaystyle A=\frac52,\quad B=-\frac52`], String.raw`\frac{5}{2x}-\frac{5}{2(x+2)}`],
    ["Decompose (3x + 5)/((x + 1)(x + 2)).", [String.raw`\displaystyle 3x+5=A(x+2)+B(x+1)`, String.raw`\displaystyle A+B=3,\quad2A+B=5`, String.raw`\displaystyle A=2,\quad B=1`], String.raw`\frac2{x+1}+\frac1{x+2}`],
    ["Decompose (2x + 3)/(x² - 1).", [String.raw`\displaystyle \frac{2x+3}{(x-1)(x+1)}=\frac A{x-1}+\frac B{x+1}`, String.raw`\displaystyle A+B=2,\quad A-B=3`, String.raw`\displaystyle A=\frac52,\quad B=-\frac12`], String.raw`\frac{5}{2(x-1)}-\frac{1}{2(x+1)}`],
  ],
  438: [
    ["Divide 2x³ + 3x² - 5 by x + 2.", [String.raw`\displaystyle 2x^3+3x^2+0x-5`, String.raw`\displaystyle (x+2)(2x^2-x+2)=2x^3+3x^2+4`, String.raw`\displaystyle \text{remainder}=-9`], String.raw`2x^2-x+2-\frac9{x+2}`],
    ["Divide x³ - 8 by x - 2.", [String.raw`\displaystyle x^3-8=x^3-2^3`, String.raw`\displaystyle =(x-2)(x^2+2x+4)`, String.raw`\displaystyle \text{remainder}=0`], String.raw`x^2+2x+4`],
  ],
  439: [
    ["Differentiate f(x) = 3x⁴ - 2x² + 7.", [String.raw`\displaystyle f'(x)=12x^3-4x`, String.raw`\displaystyle f'(2)=12(8)-8`, String.raw`\displaystyle f'(2)=88`], String.raw`f'(x)=12x^3-4x`],
    ["Differentiate y = (2x + 1)³.", [String.raw`\displaystyle \frac{dy}{dx}=3(2x+1)^2\cdot2`, String.raw`\displaystyle \frac{dy}{dx}=6(2x+1)^2`, String.raw`\displaystyle y'(1)=54`], String.raw`6(2x+1)^2`],
    ["Find the slope of y = 1/x at x = 2.", [String.raw`\displaystyle y=x^{-1}`, String.raw`\displaystyle y'=-x^{-2}=-\frac1{x^2}`, String.raw`\displaystyle y'(2)=-\frac14`], String.raw`-\frac14`],
  ],
  440: [
    ["Evaluate ∫₀² 3x² dx.", [String.raw`\displaystyle \int_0^2 3x^2\,dx=[x^3]_0^2`, String.raw`\displaystyle =2^3-0^3`, String.raw`\displaystyle =8`], "8"],
    ["Evaluate ∫₁⁴ 1/√x dx.", [String.raw`\displaystyle \int_1^4 x^{-\frac12}\,dx=\left[2\sqrt x\right]_1^4`, String.raw`\displaystyle =2(2)-2(1)`, String.raw`\displaystyle =2`], "2"],
    ["Find ∫(4x³ - 2x) dx.", [String.raw`\displaystyle \int(4x^3-2x)\,dx`, String.raw`\displaystyle =x^4-x^2+C`, String.raw`\displaystyle \frac d{dx}(x^4-x^2)=4x^3-2x`], String.raw`x^4-x^2+C`],
  ],
  441: [
    ["Evaluate lim(x→3) (x² - 9)/(x - 3).", [String.raw`\displaystyle \frac{x^2-9}{x-3}=\frac{(x-3)(x+3)}{x-3}`, String.raw`\displaystyle =x+3`, String.raw`\displaystyle \lim_{x\to3}(x+3)=6`], "6"],
    ["Evaluate lim(x→0) sin x/x.", [String.raw`\displaystyle \lim_{x\to0}\frac{\sin x}{x}`, String.raw`\displaystyle \text{use the standard trigonometric limit}`, String.raw`\displaystyle =1`], "1"],
    ["Evaluate lim(x→∞) (5x² + 1)/(2x² - 3).", [String.raw`\displaystyle \frac{5+x^{-2}}{2-3x^{-2}}`, String.raw`\displaystyle x^{-2}\to0`, String.raw`\displaystyle \text{limit}=\frac52`], String.raw`\frac52`],
  ],
  442: [
    ["Use the geometric series to expand 1/(1 - x) through x⁴.", [String.raw`\displaystyle \frac1{1-x}=\sum_{n=0}^{\infty}x^n`, String.raw`\displaystyle =1+x+x^2+x^3+x^4+\cdots`, String.raw`\displaystyle \text{at }x=\frac12:\;1+\frac12+\frac14+\cdots=2`], String.raw`1+x+x^2+x^3+x^4+\cdots`],
    ["Find the first four terms of eˣ at x = 1.", [String.raw`\displaystyle e^x=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots`, String.raw`\displaystyle e\approx1+1+\frac12+\frac16`, String.raw`\displaystyle e\approx\frac83`], String.raw`\frac83`],
  ],
  443: [["Solve dy/dx = 3x² with y(0) = 2.", [String.raw`\displaystyle y=\int3x^2\,dx=x^3+C`, String.raw`\displaystyle 2=0^3+C\Rightarrow C=2`, String.raw`\displaystyle y=x^3+2`], String.raw`y=x^3+2`]],
  444: [
    ["Add matrices [[1,2],[3,4]] and [[5,6],[7,8]].", [String.raw`\displaystyle A+B=\begin{pmatrix}1+5&2+6\\3+7&4+8\end{pmatrix}`, String.raw`\displaystyle A+B=\begin{pmatrix}6&8\\10&12\end{pmatrix}`, String.raw`\displaystyle \operatorname{tr}(A+B)=18`], String.raw`\begin{pmatrix}6&8\\10&12\end{pmatrix}`],
    ["Multiply [[1,2],[0,3]] by [[2,1],[4,0]].", [String.raw`\displaystyle AB=\begin{pmatrix}1(2)+2(4)&1(1)+2(0)\\0(2)+3(4)&0(1)+3(0)\end{pmatrix}`, String.raw`\displaystyle AB=\begin{pmatrix}10&1\\12&0\end{pmatrix}`, String.raw`\displaystyle \det(AB)=-12`], String.raw`\begin{pmatrix}10&1\\12&0\end{pmatrix}`],
    ["Find the determinant of [[4,1],[2,3]].", [String.raw`\displaystyle \det A=4(3)-1(2)`, String.raw`\displaystyle \det A=12-2`, String.raw`\displaystyle \det A=10`], "10"],
  ],
  446: [
    ["Assuming x > 0, simplify √(x²) for x = 7.", [String.raw`\displaystyle \sqrt{x^2}=|x|`, String.raw`\displaystyle x=7>0\Rightarrow|x|=x`, String.raw`\displaystyle \sqrt{7^2}=7`], "7"],
    ["Assuming a ≠ 0, solve ax = 12 when a = 3.", [String.raw`\displaystyle x=\frac{12}{a}`, String.raw`\displaystyle x=\frac{12}{3}`, String.raw`\displaystyle x=4`], "4"],
  ],
  448: [
    ["Solve 3(x - 2) + 5 = 14 step by step.", [String.raw`\displaystyle 3x-6+5=14`, String.raw`\displaystyle 3x=15`, String.raw`\displaystyle x=5`], String.raw`x=5`],
    ["Simplify 2(3x + 4) - (x - 1).", [String.raw`\displaystyle 6x+8-x+1`, String.raw`\displaystyle (6x-x)+(8+1)`, String.raw`\displaystyle 5x+9`], String.raw`5x+9`],
    ["Solve (x + 3)/4 = 5.", [String.raw`\displaystyle x+3=20`, String.raw`\displaystyle x=20-3`, String.raw`\displaystyle x=17`], String.raw`x=17`],
  ],
  449: [
    ["For y = x² - 4, find the x-intercepts shown by its graph.", [String.raw`\displaystyle x^2-4=0`, String.raw`\displaystyle (x-2)(x+2)=0`, String.raw`\displaystyle x=-2,\ 2`], String.raw`(-2,0)\text{ and }(2,0)`],
    ["For y = 2x + 3, calculate the plotted point when x = 4.", [String.raw`\displaystyle y=2(4)+3`, String.raw`\displaystyle y=8+3`, String.raw`\displaystyle y=11`], String.raw`(4,11)`],
    ["For y = x³ - x, find three exact points where the graph crosses the x-axis.", [String.raw`\displaystyle x^3-x=x(x^2-1)`, String.raw`\displaystyle x(x-1)(x+1)=0`, String.raw`\displaystyle x=-1,0,1`], String.raw`(-1,0),(0,0),(1,0)`],
  ],
  450: [
    ["Enter x-values 1, 2, 3 into y = 2x + 1 and complete the y-column.", [String.raw`\displaystyle y(1)=2(1)+1=3`, String.raw`\displaystyle y(2)=2(2)+1=5`, String.raw`\displaystyle y(3)=2(3)+1=7`], String.raw`y=3,5,7`],
    ["A data grid contains 4, 7, 9, 10. Find its mean.", [String.raw`\displaystyle \bar x=\frac{4+7+9+10}{4}`, String.raw`\displaystyle \bar x=\frac{30}{4}`, String.raw`\displaystyle \bar x=7.5`], "7.5"],
    ["A two-column grid has points (1, 3), (2, 5), (3, 7). Find the rule.", [String.raw`\displaystyle \Delta y=2\text{ when }\Delta x=1`, String.raw`\displaystyle m=\frac{2}{1}=2`, String.raw`\displaystyle y=2x+1`], String.raw`y=2x+1`],
  ],
  452: [
    calculation("Copy the formula A2 + 3 from row 2 to row 5.", String.raw`A_2+3\xrightarrow{\text{down }3\text{ rows}}A_5+3`, String.raw`A_5+3`),
    calculation("Fill the sequence 4, 7, 10 into the next two cells.", String.raw`d=7-4=3`, String.raw`4,7,10,13,16`),
  ],
  455: [
    calculation("Sort 8, 3, 11, 5 in ascending order.", String.raw`\{8,3,11,5\}\xrightarrow{\text{ascending}}`, String.raw`\{3,5,8,11\}`),
    calculation("Sort 2.4, 1.9, 3.1 in descending order.", String.raw`\{2.4,1.9,3.1\}\xrightarrow{\text{descending}}`, String.raw`\{3.1,2.4,1.9\}`),
    calculation("Sort the rows (A, 72), (B, 91), (C, 65) by score from greatest to least.", String.raw`91>72>65`, String.raw`(B,91),(A,72),(C,65)`),
  ],
  456: [
    calculation("Filter 4, 9, 12, 3, 15 to keep values greater than 8.", String.raw`x>8`, String.raw`\{9,12,15\}`),
    calculation("Filter 10, 14, 17, 20 to keep even values.", String.raw`x\equiv0\pmod2`, String.raw`\{10,14,20\}`),
  ],
  457: [
    calculation("Create a list from cells containing 3, 6, 9, 12 and find its length.", String.raw`L=\{3,6,9,12\}`, String.raw`|L|=4`, "4"),
    calculation("Create a list from 5, 8, 11 and find its sum.", String.raw`L=\{5,8,11\}`, String.raw`\sum L=24`, "24"),
  ],
  458: [
    calculation("Form points from x-column 1, 2, 3 and y-column 4, 7, 10.", String.raw`P_i=(x_i,y_i)`, String.raw`\{(1,4),(2,7),(3,10)\}`),
    calculation("The columns contain x = -2, 0, 2 and y = 4, 0, 4. List the points.", String.raw`P_i=(x_i,y_i)`, String.raw`\{(-2,4),(0,0),(2,4)\}`),
    calculation("For points (1, 5), (2, 8), (3, 11), find the change in y per unit x.", String.raw`\frac{\Delta y}{\Delta x}=\frac{8-5}{2-1}`, String.raw`3`, "3"),
  ],
  459: [
    calculation("Build a 2×2 matrix from rows (1, 2) and (3, 4).", String.raw`R_1=(1,2),\ R_2=(3,4)`, String.raw`\begin{pmatrix}1&2\\3&4\end{pmatrix}`),
    calculation("Build a 2×3 matrix from the cells 2, 4, 6, 1, 3, 5.", String.raw`R_1=(2,4,6),\ R_2=(1,3,5)`, String.raw`\begin{pmatrix}2&4&6\\1&3&5\end{pmatrix}`),
  ],
  460: [
    calculation("Make a frequency table for 1, 2, 2, 3, 3, 3.", String.raw`f(x)=\#\{x\}`, String.raw`f(1)=1,\ f(2)=2,\ f(3)=3`),
    calculation("Count the frequencies in 4, 4, 5, 6, 6, 6, 7.", String.raw`n=7`, String.raw`f(4)=2,\ f(5)=1,\ f(6)=3,\ f(7)=1`),
    calculation("A table has frequencies 2, 5, and 3. Find the total number of observations.", String.raw`N=2+5+3`, String.raw`N=10`, "10"),
  ],
  461: [
    calculation("For 2, 4, 6, 8, find the mean.", String.raw`\bar x=\frac{2+4+6+8}{4}`, String.raw`\bar x=5`, "5"),
    calculation("For 3, 3, 7, 9, find the median.", String.raw`\operatorname{median}=\frac{3+7}{2}`, String.raw`5`, "5"),
    calculation("For 5, 6, 6, 8, find the mode and range.", String.raw`\operatorname{mode}=6,\quad R=8-5`, String.raw`\operatorname{mode}=6,\ R=3`),
  ],
  462: [
    calculation("A bar chart uses values 4, 7, 5. Find the total bar height.", String.raw`4+7+5`, String.raw`16`, "16"),
    calculation("In a pie chart, 15 of 60 responses choose A. Find the sector angle.", String.raw`\frac{15}{60}\times360^\circ`, String.raw`90^\circ`),
    calculation("A line chart rises from 12 to 18. Find the percentage increase.", String.raw`\frac{18-12}{12}\times100\%`, String.raw`50\%`),
  ],
  463: [
    calculation("Fit a line through (1, 3) and (4, 9).", String.raw`m=\frac{9-3}{4-1}=2,\quad b=1`, String.raw`y=2x+1`),
    calculation("For the model y = 3x - 2, predict y when x = 5.", String.raw`y=3(5)-2`, String.raw`y=13`, "13"),
    calculation("An observed value is 12 and its fitted value is 10.5. Find the residual.", String.raw`e=y-\hat y=12-10.5`, String.raw`e=1.5`, "1.5"),
  ],
  464: [
    calculation("Cell B2 equals 7 and C2 contains =2*B2. Find C2.", String.raw`C_2=2B_2=2(7)`, String.raw`C_2=14`, "14"),
    calculation("Cell A1 changes from 4 to 9 and B1 contains =A1+3. Find the new B1.", String.raw`B_1=9+3`, String.raw`B_1=12`, "12"),
    calculation("Cell D4 contains =B4-C4 with B4 = 18 and C4 = 11. Find D4.", String.raw`D_4=18-11`, String.raw`D_4=7`, "7"),
  ],
  465: [
    calculation("A CSV row is 3,5,8. Find its row total after import.", String.raw`3+5+8`, String.raw`16`, "16"),
    calculation("A CSV column contains 2, 6, 10. Find its mean.", String.raw`\bar x=\frac{2+6+10}{3}`, String.raw`6`, "6"),
    calculation("An imported CSV has 25 data rows plus one header. How many rows appear?", String.raw`25+1`, String.raw`26`, "26 rows"),
  ],
  466: [
    calculation("Export a table with 8 rows and 4 columns. How many data cells are exported?", String.raw`8\times4`, String.raw`32`, "32 cells"),
    calculation("A dataset has 120 records; 15 are omitted before export. How many remain?", String.raw`120-15`, String.raw`105`, "105 records"),
    calculation("Three exported columns contain 50 entries each. Count all entries.", String.raw`3\times50`, String.raw`150`, "150 entries"),
  ],
  467: [
    calculation("Classify 42 as a numerical data value and double it.", String.raw`42\in\mathbb R,\quad2(42)`, String.raw`84`, "84"),
    calculation("Convert the text value '3.5' to a number and add 2.", String.raw`3.5+2`, String.raw`5.5`, "5.5"),
    calculation("A Boolean column has 1, 0, 1, 1. Count the true values.", String.raw`1+0+1+1`, String.raw`3`, "3 true values"),
  ],
  468: [
    calculation("Find the frequency of 5 in 2, 5, 5, 7, 5, 8.", String.raw`f(5)=\#\{5,5,5\}`, String.raw`f(5)=3`, "3"),
    calculation("Frequencies are 4, 6, 3, and 2. Find their total.", String.raw`N=4+6+3+2`, String.raw`N=15`, "15"),
  ],
  469: [
    calculation("Group 3, 7, 12, 16, 19 into intervals 0–9 and 10–19.", String.raw`0\!\text{--}\!9:\{3,7\},\quad10\!\text{--}\!19:\{12,16,19\}`, String.raw`f_1=2,\ f_2=3`),
    calculation("A class 20–29 contains 4 values and class 30–39 contains 6. Find the total.", String.raw`N=4+6`, String.raw`N=10`, "10"),
  ],
  470: [
    calculation("Find the mean of 6, 9, and 12.", String.raw`\bar x=\frac{6+9+12}{3}`, String.raw`\bar x=9`, "9"),
    calculation("The mean of 5 numbers is 8. Find their sum.", String.raw`\sum x=n\bar x=5(8)`, String.raw`\sum x=40`, "40"),
  ],
  471: [
    calculation("Find the median of 2, 5, 7, 9, 12.", String.raw`n=5\Rightarrow\text{middle position}=3`, String.raw`\operatorname{median}=7`, "7"),
    calculation("Find the median of 4, 6, 8, 10.", String.raw`\operatorname{median}=\frac{6+8}{2}`, String.raw`7`, "7"),
    calculation("Find the median of 9, 3, 7, 1, 5.", String.raw`1,3,5,7,9`, String.raw`\operatorname{median}=5`, "5"),
  ],
  472: [
    calculation("Find the mode of 3, 5, 5, 5, 8, 9.", String.raw`f(5)=3>f(3)=f(8)=f(9)=1`, String.raw`\operatorname{mode}=5`, "5"),
    calculation("Find the modes of 2, 2, 4, 4, 7.", String.raw`f(2)=f(4)=2`, String.raw`\operatorname{modes}=2,4`, "2 and 4"),
  ],
  473: [
    calculation("Scores 70 and 90 have weights 2 and 3. Find the weighted mean.", String.raw`\bar x_w=\frac{2(70)+3(90)}{2+3}`, String.raw`\bar x_w=82`, "82"),
    calculation("Prices 10 and 16 have quantities 4 and 6. Find the weighted mean price.", String.raw`\bar x_w=\frac{4(10)+6(16)}{10}`, String.raw`\bar x_w=13.6`, "13.6"),
    calculation("Grades 8, 7, 9 have weights 1, 2, 1. Find the weighted mean.", String.raw`\bar x_w=\frac{1(8)+2(7)+1(9)}{4}`, String.raw`\bar x_w=\frac{31}{4}=7.75`, "7.75"),
  ],
  474: [
    calculation("Find the range of 4, 11, 7, 19, 6.", String.raw`R=19-4`, String.raw`R=15`, "15"),
    calculation("A dataset has minimum -3 and maximum 12. Find its range.", String.raw`R=12-(-3)`, String.raw`R=15`, "15"),
  ],
  475: [calculation("For 1, 3, 5, 7, 9, find the IQR using Q₁ = 2 and Q₃ = 8.", String.raw`\operatorname{IQR}=Q_3-Q_1=8-2`, String.raw`\operatorname{IQR}=6`, "6")],
  476: [
    calculation("Find the population variance of 2, 4, 6.", String.raw`\bar x=4,\quad\sigma^2=\frac{(2-4)^2+(4-4)^2+(6-4)^2}{3}`, String.raw`\sigma^2=\frac83`, String.raw`\frac83`),
    calculation("Find the population standard deviation when the variance is 25.", String.raw`\sigma=\sqrt{\sigma^2}=\sqrt{25}`, String.raw`\sigma=5`, "5"),
    calculation("For 5, 5, 5, find the variance and standard deviation.", String.raw`x_i-\bar x=0\text{ for every }i`, String.raw`\sigma^2=0,\quad\sigma=0`),
  ],
  478: [
    calculation("Find the z-score of x = 70 when μ = 60 and σ = 5.", String.raw`z=\frac{x-\mu}{\sigma}=\frac{70-60}{5}`, String.raw`z=2`, "2"),
    calculation("Find x when z = -1.5, μ = 50, and σ = 4.", String.raw`x=\mu+z\sigma=50+(-1.5)(4)`, String.raw`x=44`, "44"),
    calculation("Find the z-score of a value equal to the mean 12 when σ = 3.", String.raw`z=\frac{12-12}{3}`, String.raw`z=0`, "0"),
  ],
  481: [
    calculation("For data 1, 2, 2, 4, how many dots are placed above 2?", String.raw`f(2)=2`, String.raw`2\text{ dots}`, "2 dots"),
    calculation("A dot plot has frequencies 1, 3, 2 at values 4, 5, 6. Count all dots.", String.raw`N=1+3+2`, String.raw`N=6`, "6 dots"),
    calculation("A dot plot shows 2, 3, 3, 5. Find its range.", String.raw`R=5-2`, String.raw`R=3`, "3"),
  ],
  482: [calculation("In the stem-and-leaf entry 4 | 2 5 8, find the largest value.", String.raw`4|8=48`, String.raw`\max=48`, "48")],
  483: [
    calculation("A histogram class 0–10 has frequency 6. What is its bar height?", String.raw`h=f=6`, String.raw`h=6`, "6"),
    calculation("Histogram frequencies are 3, 7, 5. Find the sample size.", String.raw`N=3+7+5`, String.raw`N=15`, "15"),
    calculation("A class of width 5 has frequency 20. Find its frequency density.", String.raw`d=\frac{20}{5}`, String.raw`d=4`, "4"),
  ],
  484: [
    calculation("Plot a frequency-polygon point for class midpoint 15 with frequency 8.", String.raw`P=(\text{midpoint},f)`, String.raw`P=(15,8)`),
    calculation("Find the midpoint of class 20–30 for a frequency polygon.", String.raw`m=\frac{20+30}{2}`, String.raw`m=25`, "25"),
    calculation("Frequencies at midpoints 5, 15, 25 are 2, 6, 4. List the plotted points.", String.raw`P_i=(m_i,f_i)`, String.raw`(5,2),(15,6),(25,4)`),
  ],
  485: [
    calculation("Frequencies are 3, 5, 2. Find the cumulative frequencies.", String.raw`3,\quad3+5,\quad3+5+2`, String.raw`3,8,10`),
    calculation("An ogive ends at cumulative frequency 40. Find the sample size.", String.raw`N=F_{\text{last}}`, String.raw`N=40`, "40"),
  ],
  486: [
    calculation("A category has 12 of 48 items. Find its pie-chart angle.", String.raw`\theta=\frac{12}{48}\times360^\circ`, String.raw`\theta=90^\circ`),
    calculation("Bar heights are 7, 4, and 9. Find their total.", String.raw`7+4+9`, String.raw`20`, "20"),
    calculation("A pie sector is 72°. Find its percentage.", String.raw`\frac{72^\circ}{360^\circ}\times100\%`, String.raw`20\%`),
  ],
  487: [
    calculation("List the scatter-plot point for x = 3 and y = 8.", String.raw`P=(x,y)`, String.raw`P=(3,8)`),
    calculation("For points (1, 2) and (5, 10), find the trend slope.", String.raw`m=\frac{10-2}{5-1}`, String.raw`m=2`, "2"),
    calculation("For model y = 2x + 1, find the plotted value at x = 6.", String.raw`y=2(6)+1`, String.raw`y=13`, "13"),
  ],
  488: [
    calculation("A time series rises from 80 to 92. Find the change.", String.raw`\Delta y=92-80`, String.raw`\Delta y=12`, "12"),
    calculation("Monthly values are 10, 14, 13, 18. Find the greatest month-to-month rise.", String.raw`\Delta=4,-1,5`, String.raw`\max\Delta=5`, "5"),
    calculation("A value grows from 200 to 230. Find the percentage growth.", String.raw`\frac{230-200}{200}\times100\%`, String.raw`15\%`),
  ],
  490: [
    calculation("Find the line through (0, 2) and (3, 8).", String.raw`m=\frac{8-2}{3-0}=2,\quad b=2`, String.raw`y=2x+2`),
    calculation("Use y = 1.5x + 4 to predict y at x = 6.", String.raw`y=1.5(6)+4`, String.raw`y=13`, "13"),
    calculation("Observed y is 9 and predicted y is 10.2. Find the residual.", String.raw`e=9-10.2`, String.raw`e=-1.2`, "-1.2"),
  ],
  491: [
    calculation("For y = x² + 2x + 1, predict y when x = 3.", String.raw`y=3^2+2(3)+1`, String.raw`y=16`, "16"),
    calculation("A quadratic model is y = 2x² - 3. Find y at x = -2.", String.raw`y=2(-2)^2-3`, String.raw`y=5`, "5"),
  ],
  492: [
    calculation("For y = 3(2ˣ), find y when x = 4.", String.raw`y=3(2^4)`, String.raw`y=48`, "48"),
    calculation("A quantity follows y = 100(1.05)ᵗ. Find y at t = 2.", String.raw`y=100(1.05)^2`, String.raw`y=110.25`, "110.25"),
    calculation("Data doubles from 5 to 10 in one step. Find the exponential growth factor.", String.raw`b=\frac{10}{5}`, String.raw`b=2`, "2"),
  ],
  493: [
    calculation("For y = 2 + 3 ln x, find y at x = e².", String.raw`y=2+3\ln(e^2)`, String.raw`y=8`, "8"),
    calculation("For y = 5 log₁₀x, find y at x = 100.", String.raw`y=5\log_{10}(100)`, String.raw`y=10`, "10"),
    calculation("Evaluate y = 4 + ln x at x = 1.", String.raw`y=4+\ln1`, String.raw`y=4`, "4"),
  ],
  494: [
    calculation("For y = 3x², find y when x = 4.", String.raw`y=3(4)^2`, String.raw`y=48`, "48"),
    calculation("If y = axᵇ and y = 20 when x = 2, b = 2, find a.", String.raw`a=\frac{20}{2^2}`, String.raw`a=5`, "5"),
    calculation("A power model is y = 2x⁻¹. Find y at x = 8.", String.raw`y=2(8^{-1})`, String.raw`y=\frac14`, String.raw`\frac14`),
  ],
  495: [
    calculation("For P(t) = 100/(1 + 9e⁻ᵗ), find P(0).", String.raw`P(0)=\frac{100}{1+9e^0}`, String.raw`P(0)=10`, "10"),
    calculation("A logistic model has carrying capacity 500. Find its limiting value.", String.raw`\lim_{t\to\infty}P(t)=K`, String.raw`K=500`, "500"),
  ],
  496: [
    calculation("For y = 4 sin x, find y at x = π/2.", String.raw`y=4\sin\frac\pi2`, String.raw`y=4`, "4"),
    calculation("A model y = 3 cos(2x) has angular frequency 2. Find its period.", String.raw`T=\frac{2\pi}{2}`, String.raw`T=\pi`, String.raw`\pi`),
    calculation("For y = 2 sin x + 5, find the maximum value.", String.raw`y_{\max}=5+2`, String.raw`y_{\max}=7`, "7"),
  ],
  497: [
    calculation("Observed values are 5, 8 and fitted values are 4.5, 8.2. Find residuals.", String.raw`e=y-\hat y`, String.raw`e_1=0.5,\ e_2=-0.2`),
    calculation("Residuals are -1, 2, 0, -1. Find their mean.", String.raw`\bar e=\frac{-1+2+0-1}{4}`, String.raw`\bar e=0`, "0"),
    calculation("A point has observed y = 14 and residual -2. Find its fitted value.", String.raw`\hat y=y-e=14-(-2)`, String.raw`\hat y=16`, "16"),
  ],
  498: [
    calculation("Model A has SSE = 18 and model B has SSE = 11. Which fits better by SSE?", String.raw`11<18`, String.raw`\operatorname{SSE}_B=11`, "model B"),
    calculation("A line predicts 12 with error 3; a quadratic predicts 12 with error 1. Find both squared errors.", String.raw`3^2=9,\quad1^2=1`, String.raw`1<9`, "quadratic model"),
    calculation("Model A has R² = 0.82 and B has R² = 0.94. Choose the larger value.", String.raw`0.94>0.82`, String.raw`R_B^2=0.94`, "model B"),
  ],
  499: [
    calculation("Interpolate halfway between (2, 6) and (4, 10).", String.raw`x=3,\quad y=6+\frac{3-2}{4-2}(10-6)`, String.raw`y=8`, "8"),
    calculation("Using y = 3x + 1 fitted on 0 ≤ x ≤ 5, extrapolate to x = 7.", String.raw`y=3(7)+1`, String.raw`y=22`, "22"),
  ],
  500: [calculation("Two coin tosses have four equally likely outcomes. Find P(exactly one head).", String.raw`S=\{HH,HT,TH,TT\},\quad E=\{HT,TH\}`, String.raw`P(E)=\frac24=\frac12`, String.raw`\frac12`)],
  501: [calculation("A die is rolled. Let E be the event of an even result. List E and find P(E).", String.raw`E=\{2,4,6\},\quad |S|=6`, String.raw`P(E)=\frac36=\frac12`, String.raw`\frac12`)],
  504: [
    calculation("For a die, find P(rolling 1 or 2).", String.raw`P(1\cup2)=P(1)+P(2)`, String.raw`\frac16+\frac16=\frac13`, String.raw`\frac13`),
    calculation("If P(A)=0.4, P(B)=0.5, and P(A∩B)=0.2, find P(A∪B).", String.raw`P(A\cup B)=0.4+0.5-0.2`, String.raw`P(A\cup B)=0.7`, "0.7"),
    calculation("A card is a heart or a king. Find the probability.", String.raw`P(H\cup K)=\frac{13}{52}+\frac4{52}-\frac1{52}`, String.raw`P(H\cup K)=\frac4{13}`, String.raw`\frac4{13}`),
  ],
  505: [
    calculation("A fair coin is tossed twice. Find P(two heads).", String.raw`P(HH)=\frac12\cdot\frac12`, String.raw`P(HH)=\frac14`, String.raw`\frac14`),
    calculation("A die is rolled and a coin tossed. Find P(6 and head).", String.raw`P(6\cap H)=\frac16\cdot\frac12`, String.raw`P(6\cap H)=\frac1{12}`, String.raw`\frac1{12}`),
  ],
  506: [
    calculation("If P(A)=0.3 and P(B)=0.4 are independent, find P(A∩B).", String.raw`P(A\cap B)=P(A)P(B)=0.3(0.4)`, String.raw`P(A\cap B)=0.12`, "0.12"),
    calculation("A coin and die are independent. Find P(head and even).", String.raw`P(H\cap E)=\frac12\cdot\frac36`, String.raw`P(H\cap E)=\frac14`, String.raw`\frac14`),
    calculation("Independent events have probabilities 0.8 and 0.5. Find P(neither).", String.raw`P(A^c\cap B^c)=(1-0.8)(1-0.5)`, String.raw`P(A^c\cap B^c)=0.1`, "0.1"),
  ],
  508: [
    calculation("In a class, 12 of 20 students play sport and 5 of those play cricket. Find P(cricket | sport).", String.raw`P(C\mid S)=\frac{5}{12}`, String.raw`P(C\mid S)\approx0.417`, String.raw`\frac5{12}`),
    calculation("If P(A∩B)=0.18 and P(B)=0.6, find P(A | B).", String.raw`P(A\mid B)=\frac{P(A\cap B)}{P(B)}=\frac{0.18}{0.6}`, String.raw`P(A\mid B)=0.3`, "0.3"),
  ],
  509: [
    calculation("A tree has P(H)=1/2 on each of two tosses. Find the HH branch probability.", String.raw`P(HH)=\frac12\cdot\frac12`, String.raw`P(HH)=\frac14`, String.raw`\frac14`),
    calculation("A bag gives red with probability 3/5, then blue with probability 2/5 with replacement. Find P(RB).", String.raw`P(RB)=\frac35\cdot\frac25`, String.raw`P(RB)=\frac6{25}`, String.raw`\frac6{25}`),
    calculation("A tree gives pass probability 0.8 twice independently. Find P(at least one fail).", String.raw`1-P(PP)=1-(0.8)^2`, String.raw`0.36`, "0.36"),
  ],
  510: [
    calculation("In a Venn diagram, n(A)=18, n(B)=15, and n(A∩B)=6. Find n(A∪B).", String.raw`n(A\cup B)=18+15-6`, String.raw`n(A\cup B)=27`, "27"),
    calculation("Out of 40 people, 22 like tea, 19 coffee, and 8 both. Find how many like neither.", String.raw`n(T\cup C)=22+19-8=33`, String.raw`40-33=7`, "7"),
    calculation("If n(A∪B)=30, n(A)=17, and n(B)=20, find n(A∩B).", String.raw`n(A\cap B)=17+20-30`, String.raw`n(A\cap B)=7`, "7"),
  ],
  511: [
    calculation("A two-way table has 18 girls and 22 boys. Find the class total.", String.raw`N=18+22`, String.raw`N=40`, "40"),
    calculation("Of 30 students, 12 are girls who cycle. Find P(girl and cycles).", String.raw`P(G\cap C)=\frac{12}{30}`, String.raw`P(G\cap C)=\frac25`, String.raw`\frac25`),
    calculation("In a table, 15 of 24 sports players are boys. Find P(boy | sports).", String.raw`P(B\mid S)=\frac{15}{24}`, String.raw`P(B\mid S)=\frac58`, String.raw`\frac58`),
  ],
  512: [
    calculation("A test has sensitivity 0.9, prevalence 0.1, and P(positive)=0.18. Find P(disease | positive).", String.raw`P(D\mid+)=\frac{0.9(0.1)}{0.18}`, String.raw`P(D\mid+)=0.5`, "0.5"),
    calculation("Machines A and B make 60% and 40% of parts with defect rates 2% and 5%. Find P(A | defect).", String.raw`P(A\mid D)=\frac{0.6(0.02)}{0.6(0.02)+0.4(0.05)}`, String.raw`P(A\mid D)=\frac38`, String.raw`\frac38`),
    calculation("Boxes 1 and 2 are chosen equally; their red probabilities are 1/4 and 3/4. Find P(box 2 | red).", String.raw`P(B_2\mid R)=\frac{\frac12\frac34}{\frac12\frac14+\frac12\frac34}`, String.raw`P(B_2\mid R)=\frac34`, String.raw`\frac34`),
  ],
  513: [
    calculation("A game pays 10 with probability 0.3 and 0 otherwise. Find E(X).", String.raw`E(X)=10(0.3)+0(0.7)`, String.raw`E(X)=3`, "3"),
    calculation("A fair die is rolled. Find its expected value.", String.raw`E(X)=\frac{1+2+3+4+5+6}{6}`, String.raw`E(X)=3.5`, "3.5"),
    calculation("A ticket wins 50 with probability 0.02 and costs 2. Find expected net value.", String.raw`E=50(0.02)-2`, String.raw`E=-1`, "-1"),
  ],
  514: [
    calculation("A simulation gives 47 heads in 100 tosses. Estimate P(head).", String.raw`\hat p=\frac{47}{100}`, String.raw`\hat p=0.47`, "0.47"),
    calculation("A die simulation records 83 sixes in 500 rolls. Estimate P(6).", String.raw`\hat p=\frac{83}{500}`, String.raw`\hat p=0.166`, "0.166"),
    calculation("In 200 trials, an event occurs 36 times. Find its simulated probability.", String.raw`\hat p=\frac{36}{200}`, String.raw`\hat p=0.18`, "0.18"),
  ],
  515: [
    calculation("A coin simulation gives 480 heads in 1000 tosses. Find the relative frequency.", String.raw`\hat p=\frac{480}{1000}`, String.raw`\hat p=0.48`, "0.48"),
    calculation("After 10,000 die rolls, 1,690 are sixes. Compare the relative frequency with 1/6.", String.raw`\hat p=\frac{1690}{10000}=0.169`, String.raw`\left|0.169-\frac16\right|\approx0.0023`, "difference ≈ 0.0023"),
  ],
  516: [
    calculation("Use a binomial calculator for n = 4, p = 0.5, and X = 2.", String.raw`P(X=2)=\binom42(0.5)^2(0.5)^2`, String.raw`P(X=2)=\frac38`, String.raw`\frac38`),
    calculation("For X ~ N(50, 10²), standardise x = 70.", String.raw`z=\frac{70-50}{10}`, String.raw`z=2`, "2"),
  ],
  517: [
    calculation("A normal probability plot has ordered values 2, 4, 7. Find their mean.", String.raw`\bar x=\frac{2+4+7}{3}`, String.raw`\bar x=\frac{13}{3}`, String.raw`\frac{13}{3}`),
    calculation("Observed quantiles 1, 3, 5 match fitted quantiles 1.2, 2.8, 5.1. Find the largest absolute gap.", String.raw`|e|=0.2,0.2,0.1`, String.raw`\max|e|=0.2`, "0.2"),
    calculation("A probability plot line is y = 2x + 1. Find y at x = 1.5.", String.raw`y=2(1.5)+1`, String.raw`y=4`, "4"),
  ],
  519: [calculation("For a uniform distribution on 0 to 10, find P(2 ≤ X ≤ 7).", String.raw`P(2\le X\le7)=\frac{7-2}{10-0}`, String.raw`P=\frac12`, String.raw`\frac12`)],
  521: [calculation("For a Bernoulli trial with p = 0.7, find E(X).", String.raw`E(X)=p`, String.raw`E(X)=0.7`, "0.7")],
  522: [
    calculation("For X ~ Bin(5, 0.4), find P(X = 2).", String.raw`P(X=2)=\binom52(0.4)^2(0.6)^3`, String.raw`P(X=2)=0.3456`, "0.3456"),
    calculation("For X ~ Bin(20, 0.3), find the mean.", String.raw`\mu=np=20(0.3)`, String.raw`\mu=6`, "6"),
  ],
  523: [
    calculation("From 10 items with 4 defective, choose 3. Find P(exactly 1 defective).", String.raw`P(X=1)=\frac{\binom41\binom62}{\binom{10}3}`, String.raw`P(X=1)=\frac12`, String.raw`\frac12`),
    calculation("From 8 cards with 3 red, choose 2. Find P(both red).", String.raw`P=\frac{\binom32}{\binom82}`, String.raw`P=\frac3{28}`, String.raw`\frac3{28}`),
    calculation("For N = 20, K = 5, n = 4, find the hypergeometric mean.", String.raw`E(X)=n\frac KN=4\frac5{20}`, String.raw`E(X)=1`, "1"),
  ],
  524: [
    calculation("For X ~ Pois(3), find P(X = 0).", String.raw`P(X=0)=e^{-3}\frac{3^0}{0!}`, String.raw`P(X=0)=e^{-3}\approx0.0498`, "≈ 0.0498"),
    calculation("For X ~ Pois(2), find P(X = 1).", String.raw`P(X=1)=e^{-2}\frac{2^1}{1!}`, String.raw`P(X=1)=2e^{-2}\approx0.2707`, "≈ 0.2707"),
    calculation("A Poisson variable has λ = 7. Find its mean and variance.", String.raw`E(X)=\lambda,\quad\operatorname{Var}(X)=\lambda`, String.raw`E(X)=7,\quad\operatorname{Var}(X)=7`),
  ],
  525: [
    calculation("With success probability 0.25, find P(first success on trial 3).", String.raw`P(X=3)=(0.75)^2(0.25)`, String.raw`P(X=3)=0.140625`, "0.140625"),
    calculation("A geometric variable has p = 0.2. Find its mean.", String.raw`E(X)=\frac1p=\frac1{0.2}`, String.raw`E(X)=5`, "5"),
  ],
  527: [
    calculation("For X uniform on [2, 8], find P(3 ≤ X ≤ 6).", String.raw`P=\frac{6-3}{8-2}`, String.raw`P=\frac12`, String.raw`\frac12`),
    calculation("For X uniform on [4, 10], find E(X).", String.raw`E(X)=\frac{4+10}{2}`, String.raw`E(X)=7`, "7"),
  ],
  528: [
    calculation("For X ~ N(100, 15²), find the z-score of 130.", String.raw`z=\frac{130-100}{15}`, String.raw`z=2`, "2"),
    calculation("For Z ~ N(0,1), find P(Z ≤ 0).", String.raw`P(Z\le0)=\frac12`, String.raw`P(Z\le0)=0.5`, "0.5"),
    calculation("A normal distribution has μ = 40 and σ = 6. Find the interval within one standard deviation.", String.raw`[\mu-\sigma,\mu+\sigma]=[40-6,40+6]`, String.raw`[34,46]`),
  ],
  529: [
    calculation("For a t statistic with sample size 12, find the degrees of freedom.", String.raw`\nu=n-1=12-1`, String.raw`\nu=11`, "11"),
    calculation("A sample has mean 52, hypothesised mean 50, s = 4, n = 16. Find t.", String.raw`t=\frac{52-50}{\frac4{\sqrt{16}}}`, String.raw`t=2`, "2"),
    calculation("For n = 25 and s = 10, find the standard error used in a t calculation.", String.raw`SE=\frac{s}{\sqrt n}=\frac{10}{5}`, String.raw`SE=2`, "2"),
  ],
  530: [
    calculation("For a chi-square variable with 5 categories and no estimated parameters, find df.", String.raw`\nu=k-1=5-1`, String.raw`\nu=4`, "4"),
    calculation("For observed 12 and expected 10, find the chi-square contribution.", String.raw`\frac{(O-E)^2}{E}=\frac{(12-10)^2}{10}`, String.raw`0.4`, "0.4"),
    calculation("Add chi-square contributions 0.4, 1.2, and 0.9.", String.raw`\chi^2=0.4+1.2+0.9`, String.raw`\chi^2=2.5`, "2.5"),
  ],
  531: [
    calculation("Two sample variances are 20 and 5. Find the F statistic using the larger on top.", String.raw`F=\frac{20}{5}`, String.raw`F=4`, "4"),
    calculation("For numerator sample size 8 and denominator sample size 11, find F degrees of freedom.", String.raw`\nu_1=8-1,\quad\nu_2=11-1`, String.raw`(\nu_1,\nu_2)=(7,10)`),
    calculation("If s₁² = 18 and s₂² = 12, find F = s₁²/s₂².", String.raw`F=\frac{18}{12}`, String.raw`F=1.5`, "1.5"),
  ],
  532: [
    calculation("For an exponential distribution with λ = 0.5, find P(X > 4).", String.raw`P(X>4)=e^{-0.5(4)}`, String.raw`P(X>4)=e^{-2}\approx0.1353`, "≈ 0.1353"),
    calculation("For λ = 0.25, find the exponential mean.", String.raw`E(X)=\frac1\lambda`, String.raw`E(X)=4`, "4"),
    calculation("For λ = 2, evaluate the density at x = 1.", String.raw`f(1)=2e^{-2(1)}`, String.raw`f(1)=2e^{-2}\approx0.2707`, "≈ 0.2707"),
  ],
  533: [
    calculation("A gamma distribution has shape 3 and scale 2. Find its mean.", String.raw`E(X)=k\theta=3(2)`, String.raw`E(X)=6`, "6"),
    calculation("For gamma shape 4 and scale 1.5, find the variance.", String.raw`\operatorname{Var}(X)=k\theta^2=4(1.5)^2`, String.raw`\operatorname{Var}(X)=9`, "9"),
  ],
  534: [
    calculation("A Weibull distribution has shape k = 2 and scale λ = 5. Find F(5).", String.raw`F(5)=1-e^{-\left(\frac55\right)^2}`, String.raw`F(5)=1-e^{-1}\approx0.6321`, "≈ 0.6321"),
    calculation("For Weibull k = 1 and λ = 4, find the survival probability at x = 8.", String.raw`S(8)=e^{-\left(\frac84\right)}`, String.raw`S(8)=e^{-2}\approx0.1353`, "≈ 0.1353"),
    calculation("For k = 2, λ = 3, evaluate (x/λ)ᵏ at x = 6.", String.raw`\left(\frac x\lambda\right)^k=\left(\frac63\right)^2`, String.raw`4`, "4"),
  ],
  535: [
    calculation("Standardise x = 85 when μ = 70 and σ = 5.", String.raw`z=\frac{85-70}{5}`, String.raw`z=3`, "3"),
    calculation("Convert z = -2 to x when μ = 100 and σ = 8.", String.raw`x=\mu+z\sigma=100-2(8)`, String.raw`x=84`, "84"),
    calculation("Standardise x = 24 when μ = 24 and σ = 6.", String.raw`z=\frac{24-24}{6}`, String.raw`z=0`, "0"),
  ],
  536: [
    calculation("A normal simulation generates 400 values and 196 are below the mean. Estimate the proportion.", String.raw`\hat p=\frac{196}{400}`, String.raw`\hat p=0.49`, "0.49"),
    calculation("A binomial simulation has 300 trials and 87 successes. Estimate p.", String.raw`\hat p=\frac{87}{300}`, String.raw`\hat p=0.29`, "0.29"),
    calculation("Five simulated sample means are 9, 10, 11, 10, 10. Find their mean.", String.raw`\bar x=\frac{9+10+11+10+10}{5}`, String.raw`\bar x=10`, "10"),
  ],
  537: [
    calculation("A population has σ = 12. Find the standard error of the mean for n = 36.", String.raw`SE=\frac{\sigma}{\sqrt n}=\frac{12}{6}`, String.raw`SE=2`, "2"),
    calculation("A population proportion is p = 0.4 with n = 100. Find SE(p̂).", String.raw`SE=\sqrt{\frac{p(1-p)}n}=\sqrt{\frac{0.4(0.6)}{100}}`, String.raw`SE\approx0.049`, "≈ 0.049"),
    calculation("Sample means 18, 20, 22 have equal frequency. Find their centre.", String.raw`\bar x=\frac{18+20+22}{3}`, String.raw`20`, "20"),
  ],
  538: [
    calculation("A population has μ = 50 and σ = 10. For n = 25, find the sampling mean and SE.", String.raw`\mu_{\bar X}=50,\quad SE=\frac{10}{\sqrt{25}}`, String.raw`\mu_{\bar X}=50,\quad SE=2`),
    calculation("For σ = 18 and n = 81, find the standard error predicted by the CLT.", String.raw`SE=\frac{18}{\sqrt{81}}`, String.raw`SE=2`, "2"),
    calculation("A sample mean is 104 from μ = 100 with SE = 2. Find its z-score.", String.raw`z=\frac{104-100}{2}`, String.raw`z=2`, "2"),
  ],
  539: [
    calculation("Find a 95% z-interval for x̄ = 40, σ = 10, n = 100.", String.raw`40\pm1.96\frac{10}{\sqrt{100}}`, String.raw`[38.04,41.96]`),
    calculation("A mean is 72 with margin of error 3. Find the confidence interval.", String.raw`72\pm3`, String.raw`[69,75]`),
    calculation("For σ = 12, n = 36, and z* = 2, find the margin of error.", String.raw`E=2\frac{12}{\sqrt{36}}`, String.raw`E=4`, "4"),
  ],
  540: [
    calculation("In 100 trials, 60 succeed. Find p̂ and its 95% approximate interval using z* = 2.", String.raw`\hat p=0.6,\quad E=2\sqrt{\frac{0.6(0.4)}{100}}`, String.raw`0.6\pm0.098\Rightarrow[0.502,0.698]`),
    calculation("A sample proportion is 0.35 with margin 0.05. Find the interval.", String.raw`0.35\pm0.05`, String.raw`[0.30,0.40]`),
    calculation("For p̂ = 0.5 and n = 400, find the standard error.", String.raw`SE=\sqrt{\frac{0.5(0.5)}{400}}`, String.raw`SE=0.025`, "0.025"),
  ],
  541: [
    calculation("Means are 52 and 47 with standard errors 2 and 1.5. Find the difference and combined SE.", String.raw`\Delta=52-47=5,\quad SE=\sqrt{2^2+1.5^2}`, String.raw`\Delta=5,\quad SE=2.5`),
    calculation("A difference of means is 8 with margin 3. Find the interval.", String.raw`8\pm3`, String.raw`[5,11]`),
    calculation("Intervals for a mean difference use estimate -2 and margin 4. Find the endpoints.", String.raw`-2\pm4`, String.raw`[-6,2]`),
  ],
  542: [
    calculation("Sample proportions are 0.60 and 0.45. Find their difference.", String.raw`\hat p_1-\hat p_2=0.60-0.45`, String.raw`0.15`, "0.15"),
    calculation("A proportion difference is 0.12 with margin 0.08. Find the interval.", String.raw`0.12\pm0.08`, String.raw`[0.04,0.20]`),
    calculation("For p̂₁ = 0.5, n₁ = 100, p̂₂ = 0.4, n₂ = 100, find SE.", String.raw`SE=\sqrt{\frac{0.5(0.5)}{100}+\frac{0.4(0.6)}{100}}`, String.raw`SE=0.07`, "0.07"),
  ],
  543: [
    calculation("Test μ₀ = 50 using x̄ = 54, σ = 8, n = 16. Find z.", String.raw`z=\frac{54-50}{\frac8{\sqrt{16}}}`, String.raw`z=2`, "2"),
    calculation("Test μ₀ = 100 using x̄ = 97, σ = 12, n = 64. Find z.", String.raw`z=\frac{97-100}{\frac{12}{8}}`, String.raw`z=-2`, "-2"),
    calculation("A z-test statistic is 2.4. Find the two-sided p-value approximately.", String.raw`p=2P(Z\ge2.4)`, String.raw`p\approx0.0164`, "≈ 0.0164"),
  ],
  544: [
    calculation("Test μ₀ = 20 using x̄ = 23, s = 6, n = 16. Find t.", String.raw`t=\frac{23-20}{\frac6{\sqrt{16}}}`, String.raw`t=2`, "2"),
    calculation("For a one-sample t-test with n = 18, find df.", String.raw`\nu=n-1=18-1`, String.raw`\nu=17`, "17"),
    calculation("Test μ₀ = 75 using x̄ = 72, s = 5, n = 25. Find t.", String.raw`t=\frac{72-75}{\frac55}`, String.raw`t=-3`, "-3"),
  ],
  545: [
    calculation("Two means are 30 and 26 with combined SE = 2. Find t for zero difference.", String.raw`t=\frac{30-26}{2}`, String.raw`t=2`, "2"),
    calculation("Samples have means 18 and 21 and combined SE = 1.5. Find t.", String.raw`t=\frac{18-21}{1.5}`, String.raw`t=-2`, "-2"),
    calculation("A two-sample estimate is 5 with margin 2. Find its interval.", String.raw`5\pm2`, String.raw`[3,7]`),
  ],
  546: [
    calculation("Paired differences are 2, 4, 0, 2. Find their mean.", String.raw`\bar d=\frac{2+4+0+2}{4}`, String.raw`\bar d=2`, "2"),
    calculation("A paired sample has d̄ = 3, s_d = 4, n = 16. Find t.", String.raw`t=\frac3{\frac4{\sqrt{16}}}`, String.raw`t=3`, "3"),
    calculation("For 10 paired observations, find the degrees of freedom.", String.raw`\nu=n-1=10-1`, String.raw`\nu=9`, "9"),
  ],
  547: [calculation("Test p₀ = 0.5 using 60 successes in 100 trials. Find z.", String.raw`z=\frac{0.6-0.5}{\sqrt{\frac{0.5(0.5)}{100}}}`, String.raw`z=2`, "2")],
  548: [
    calculation("Samples have p̂₁ = 0.60 and p̂₂ = 0.45 with SE = 0.05. Find z.", String.raw`z=\frac{0.60-0.45}{0.05}`, String.raw`z=3`, "3"),
    calculation("Groups have 40 of 80 and 30 of 60 successes. Find the pooled proportion.", String.raw`\hat p=\frac{40+30}{80+60}`, String.raw`\hat p=0.5`, "0.5"),
    calculation("Two proportions differ by -0.08 with SE = 0.04. Find z.", String.raw`z=\frac{-0.08}{0.04}`, String.raw`z=-2`, "-2"),
  ],
  549: [
    calculation("Observed counts are 12 and 8; expected counts are 10 and 10. Find χ².", String.raw`\chi^2=\frac{(12-10)^2}{10}+\frac{(8-10)^2}{10}`, String.raw`\chi^2=0.8`, "0.8"),
    calculation("A goodness-of-fit test has 6 categories. Find df.", String.raw`\nu=k-1=6-1`, String.raw`\nu=5`, "5"),
    calculation("Observed counts 20, 30, 50 are compared with equal expected counts. Find each expected count.", String.raw`E=\frac{20+30+50}{3}`, String.raw`E=\frac{100}{3}`, String.raw`\frac{100}{3}`),
  ],
  550: [
    calculation("A 2×3 contingency table is tested for independence. Find df.", String.raw`\nu=(2-1)(3-1)`, String.raw`\nu=2`, "2"),
    calculation("A cell has row total 40, column total 30, and grand total 120. Find its expected count.", String.raw`E=\frac{40(30)}{120}`, String.raw`E=10`, "10"),
    calculation("For observed 14 and expected 10, find the cell's χ² contribution.", String.raw`\frac{(14-10)^2}{10}`, String.raw`1.6`, "1.6"),
  ],
  551: [
    calculation("A sample of 10 values has variance 12. Test σ₀² = 9 by finding χ².", String.raw`\chi^2=\frac{(n-1)s^2}{\sigma_0^2}=\frac{9(12)}9`, String.raw`\chi^2=12`, "12"),
    calculation("Two samples have variances 24 and 8. Find the F statistic.", String.raw`F=\frac{24}{8}`, String.raw`F=3`, "3"),
    calculation("For a variance test with n = 15, find the degrees of freedom.", String.raw`\nu=n-1=15-1`, String.raw`\nu=14`, "14"),
  ],
  552: [
    calculation("ANOVA has between-group sum of squares 24 and df = 3. Find MSB.", String.raw`MS_B=\frac{24}{3}`, String.raw`MS_B=8`, "8"),
    calculation("ANOVA has within-group sum of squares 40 and df = 20. Find MSW.", String.raw`MS_W=\frac{40}{20}`, String.raw`MS_W=2`, "2"),
    calculation("If MSB = 8 and MSW = 2, find the ANOVA F statistic.", String.raw`F=\frac{MS_B}{MS_W}=\frac82`, String.raw`F=4`, "4"),
  ],
  553: [
    calculation("A right-tail z-test gives z = 2. Find the approximate p-value.", String.raw`p=P(Z\ge2)`, String.raw`p\approx0.0228`, "≈ 0.0228"),
    calculation("A two-sided test has one-tail area 0.03. Find its p-value.", String.raw`p=2(0.03)`, String.raw`p=0.06`, "0.06"),
    calculation("At α = 0.05, compare p = 0.018 with α.", String.raw`0.018<0.05`, String.raw`\text{reject }H_0`, "reject H₀"),
  ],
  554: [
    calculation("If α = 0.05, what is the probability of a Type I error?", String.raw`P(\text{Type I})=\alpha`, String.raw`P=0.05`, "0.05"),
    calculation("If a test has power 0.82, find its Type II error probability β.", String.raw`\beta=1-\text{power}=1-0.82`, String.raw`\beta=0.18`, "0.18"),
    calculation("A test has α = 0.01 and β = 0.20. Find its power.", String.raw`\text{power}=1-\beta`, String.raw`\text{power}=0.80`, "0.80"),
  ],
  555: [calculation("A test has β = 0.12. Find its power.", String.raw`\text{power}=1-\beta=1-0.12`, String.raw`\text{power}=0.88`, "0.88")],
  556: [calculation("A meal has 4 starters, 3 mains, and 2 desserts. Count all possible meals.", String.raw`N=4\cdot3\cdot2`, String.raw`N=24`, "24")],
  558: [
    calculation("Arrange 5 distinct books on a shelf.", String.raw`5!=5\cdot4\cdot3\cdot2\cdot1`, String.raw`5!=120`, "120"),
    calculation("Choose and order 3 students from 7.", String.raw`{}^7P_3=\frac{7!}{(7-3)!}`, String.raw`{}^7P_3=210`, "210"),
    calculation("How many two-digit numbers use distinct digits from 1, 2, 3, 4?", String.raw`{}^4P_2=4\cdot3`, String.raw`{}^4P_2=12`, "12"),
  ],
  559: [
    calculation("Count distinct arrangements of LEVEL.", String.raw`\frac{5!}{2!2!}`, String.raw`30`, "30"),
    calculation("Count distinct arrangements of BANANA.", String.raw`\frac{6!}{3!2!}`, String.raw`60`, "60"),
  ],
  560: [
    calculation("Seat 6 people around a circular table.", String.raw`(6-1)!`, String.raw`120`, "120"),
    calculation("Arrange 8 beads on a circle when rotations count as identical.", String.raw`(8-1)!`, String.raw`5040`, "5040"),
  ],
  561: [
    calculation("Choose 3 students from 8.", String.raw`\binom83=\frac{8!}{3!5!}`, String.raw`\binom83=56`, "56"),
    calculation("Choose 2 toppings from 6.", String.raw`\binom62=\frac{6\cdot5}{2}`, String.raw`\binom62=15`, "15"),
  ],
  563: [
    calculation("If 18 students play cricket, 15 football, and 6 both, find how many play either.", String.raw`|C\cup F|=18+15-6`, String.raw`|C\cup F|=27`, "27"),
    calculation("Count integers from 1 to 30 divisible by 2 or 3.", String.raw`15+10-5`, String.raw`20`, "20"),
    calculation("If |A| = 25, |B| = 17, and |A∪B| = 34, find |A∩B|.", String.raw`|A\cap B|=25+17-34`, String.raw`|A\cap B|=8`, "8"),
  ],
  565: [
    calculation("Build a graph with vertices {A,B,C,D} and edges AB, BC, CD. Count vertices and edges.", String.raw`V=\{A,B,C,D\},\quad E=\{AB,BC,CD\}`, String.raw`|V|=4,\quad|E|=3`),
    calculation("Add edge DA to a graph with 4 vertices and 3 edges. Find the new edge count.", String.raw`|E'|=3+1`, String.raw`|E'|=4`, "4"),
    calculation("A complete graph has 5 vertices. Find its number of edges.", String.raw`|E|=\binom52`, String.raw`|E|=10`, "10"),
  ],
  566: [
    calculation("A directed graph has arcs A→B, B→C, A→C. Find the out-degree of A.", String.raw`d^+(A)=\#\{A\to B,A\to C\}`, String.raw`d^+(A)=2`, "2"),
    calculation("For arcs A→B, C→B, B→C, find the in-degree of B.", String.raw`d^-(B)=\#\{A\to B,C\to B\}`, String.raw`d^-(B)=2`, "2"),
    calculation("A directed graph has 7 arcs. Find the sum of all out-degrees.", String.raw`\sum_v d^+(v)=|E|`, String.raw`\sum_v d^+(v)=7`, "7"),
  ],
  567: [
    calculation("A path uses edges of weights 4, 7, and 2. Find its total weight.", String.raw`w=4+7+2`, String.raw`w=13`, "13"),
    calculation("Compare paths with weights 5 + 8 and 6 + 4. Choose the lighter path.", String.raw`5+8=13,\quad6+4=10`, String.raw`10<13`, "the path with weights 6 and 4"),
    calculation("An edge weight drops from 12 to 9. Find the change.", String.raw`\Delta w=9-12`, String.raw`\Delta w=-3`, "decrease of 3"),
  ],
  568: [
    calculation("Vertex A is incident to AB, AC, and AD. Find deg(A).", String.raw`d(A)=\#\{AB,AC,AD\}`, String.raw`d(A)=3`, "3"),
    calculation("A graph has degrees 2, 3, 3, 2. Verify the degree sum.", String.raw`\sum d(v)=2+3+3+2`, String.raw`\sum d(v)=10=2|E|`, "10"),
    calculation("A graph has 6 edges. Find the sum of all vertex degrees.", String.raw`\sum d(v)=2|E|=2(6)`, String.raw`\sum d(v)=12`, "12"),
  ],
  569: [
    calculation("A path A–B–C–D uses three edges. Find its length.", String.raw`\ell=|\{AB,BC,CD\}|`, String.raw`\ell=3`, "3"),
    calculation("Cycle A–B–C–A uses how many vertices and edges?", String.raw`V=\{A,B,C\},\quad E=\{AB,BC,CA\}`, String.raw`|V|=|E|=3`, "3 vertices and 3 edges"),
    calculation("A walk uses 8 edges. Find its length.", String.raw`\ell=|E_{\text{walk}}|`, String.raw`\ell=8`, "8"),
  ],
  570: [
    calculation("A graph separates into vertex groups {A,B,C}, {D,E}, and {F}. Count its connected components.", String.raw`\mathcal C=\{\{A,B,C\},\{D,E\},\{F\}\}`, String.raw`|\mathcal C|=3`, "3"),
    calculation("Adding one bridge joins two components. If the graph began with 4 components, how many remain?", String.raw`c'=4-1`, String.raw`c'=3`, "3"),
    calculation("A connected graph has 12 vertices. How many connected components does it have?", String.raw`G\text{ connected}`, String.raw`c(G)=1`, "1"),
  ],
  571: [
    calculation("A connected graph has vertex degrees 2, 2, 2, 2. Does it have an Euler circuit?", String.raw`\#\{v:d(v)\text{ odd}\}=0`, String.raw`\text{Euler circuit exists}`, "yes"),
    calculation("A connected graph has exactly 2 odd-degree vertices. What Euler traversal exists?", String.raw`\#\{v:d(v)\text{ odd}\}=2`, String.raw`\text{Euler path but no Euler circuit}`, "Euler path"),
    calculation("Degrees are 1, 1, 2, 2. Count the odd vertices.", String.raw`1,1\text{ are odd}`, String.raw`n_{\text{odd}}=2`, "2"),
  ],
  572: [
    calculation("A cycle visits A, B, C, D, A exactly once. How many vertices are in the Hamiltonian cycle?", String.raw`V=\{A,B,C,D\}`, String.raw`|V|=4`, "4"),
    calculation("The path A–C–B–D visits all 4 vertices once. Find its number of edges.", String.raw`\ell=|V|-1=4-1`, String.raw`\ell=3`, "3"),
    calculation("A Hamiltonian cycle on 7 vertices contains how many edges?", String.raw`|E_{\text{cycle}}|=|V|`, String.raw`|E_{\text{cycle}}|=7`, "7"),
  ],
  574: [
    calculation("A spanning tree uses edge weights 2, 3, and 5. Find its total weight.", String.raw`w(T)=2+3+5`, String.raw`w(T)=10`, "10"),
    calculation("A connected graph has 8 vertices. How many edges are in any spanning tree?", String.raw`|E_T|=|V|-1=8-1`, String.raw`|E_T|=7`, "7"),
    calculation("Kruskal selects weights 1, 4, 6, 7. Find the MST weight.", String.raw`w=1+4+6+7`, String.raw`w=18`, "18"),
  ],
  575: [
    calculation("Path A→B→D has weights 3 and 4. Find its distance.", String.raw`d=3+4`, String.raw`d=7`, "7"),
    calculation("Compare routes of total weights 12, 9, and 14. Find the shortest distance.", String.raw`\min\{12,9,14\}`, String.raw`9`, "9"),
    calculation("Dijkstra gives d(A)=0, d(B)=5, and edge BC = 2. Find the tentative distance to C through B.", String.raw`d(C)=d(B)+w(BC)=5+2`, String.raw`d(C)=7`, "7"),
  ],
  576: [calculation("A triangle graph has three mutually adjacent vertices. Find its chromatic number.", String.raw`\chi(K_3)=3`, String.raw`\chi=3`, "3")],
  577: [
    calculation("K₂,₃ has part sizes 2 and 3. Count its vertices and edges.", String.raw`|V|=2+3,\quad|E|=2\cdot3`, String.raw`|V|=5,\quad|E|=6`),
    calculation("A bipartite graph has parts of sizes 4 and 5 with every cross-edge. Find its edge count.", String.raw`|E|=4\cdot5`, String.raw`|E|=20`, "20"),
    calculation("A 6-cycle alternates between two colour classes. Find each class size.", String.raw`6=3+3`, String.raw`|U|=|W|=3`, "3 and 3"),
  ],
  578: [
    calculation("A connected planar graph has V = 6 and E = 9. Find F.", String.raw`V-E+F=2\Rightarrow F=2-6+9`, String.raw`F=5`, "5"),
    calculation("A planar graph has V = 8 and F = 6. Find E.", String.raw`E=V+F-2=8+6-2`, String.raw`E=12`, "12"),
    calculation("For a simple planar graph with V = 10, find the maximum E from E ≤ 3V - 6.", String.raw`E\le3(10)-6`, String.raw`E\le24`, "24"),
  ],
  579: [
    calculation("A path carries flows 7 and 5 on edges of capacities 10 and 6. Find its bottleneck capacity.", String.raw`\min\{10-7,6-5\}`, String.raw`1`, "1"),
    calculation("Two disjoint source-to-sink paths carry flows 4 and 7. Find the total flow.", String.raw`|f|=4+7`, String.raw`|f|=11`, "11"),
    calculation("A cut contains edges of capacities 3, 8, and 2. Find its capacity.", String.raw`c(S,T)=3+8+2`, String.raw`c(S,T)=13`, "13"),
  ],
  580: [
    calculation("A tour uses edges of lengths 4, 6, 5, and 7. Find its total length.", String.raw`L=4+6+5+7`, String.raw`L=22`, "22"),
    calculation("Compare tours of lengths 31, 27, and 35. Choose the shortest.", String.raw`\min\{31,27,35\}`, String.raw`27`, "27"),
    calculation("A nearest-neighbour tour visits 5 cities and returns to the start. How many legs does it use?", String.raw`\text{legs}=|V|`, String.raw`\text{legs}=5`, "5"),
  ],
  583: [calculation("Let A = {1,2,3,4} and B = {3,4,5}. Find A ∩ B and A ∖ B.", String.raw`A\cap B=\{3,4\}`, String.raw`A\setminus B=\{1,2\}`, "A ∩ B = {3,4}; A ∖ B = {1,2}")],
  584: [
    calculation("In U = {1,2,3,4,5,6}, find the complement of A = {2,4,6}.", String.raw`A^c=U\setminus A`, String.raw`A^c=\{1,3,5\}`),
    calculation("If |U| = 50 and |A| = 32, find |Aᶜ|.", String.raw`|A^c|=|U|-|A|=50-32`, String.raw`|A^c|=18`, "18"),
  ],
  585: [
    calculation("Let A = {1,2} and B = {x,y,z}. Find |A × B|.", String.raw`|A\times B|=|A||B|=2(3)`, String.raw`|A\times B|=6`, "6"),
    calculation("List {1,2} × {3,4}.", String.raw`A\times B=\{(a,b):a\in A,b\in B\}`, String.raw`\{(1,3),(1,4),(2,3),(2,4)\}`),
  ],
  586: [calculation("A set has 5 elements. How many subsets are in its power set?", String.raw`|\mathcal P(A)|=2^{|A|}=2^5`, String.raw`|\mathcal P(A)|=32`, "32")],
  588: [
    calculation("Let P = 1 and Q = 0. Evaluate P ∧ Q.", String.raw`1\land0`, String.raw`0`, "0 (false)"),
    calculation("Let P = 1 and Q = 0. Evaluate P ∨ Q.", String.raw`1\lor0`, String.raw`1`, "1 (true)"),
    calculation("Let P = 0. Evaluate ¬P.", String.raw`\neg0`, String.raw`1`, "1 (true)"),
  ],
  589: [
    calculation("Evaluate ∀x ∈ {1,2,3}, x < 4.", String.raw`1<4,\quad2<4,\quad3<4`, String.raw`\forall x\in\{1,2,3\},\ x<4`, "true"),
    calculation("Evaluate ∃x ∈ {2,4,6} such that x² = 16.", String.raw`4^2=16`, String.raw`\exists x=4`, "true; x = 4"),
  ],
  590: [
    calculation("Prove the sum of two odd numbers 2a+1 and 2b+1 is even.", String.raw`(2a+1)+(2b+1)=2(a+b+1)`, String.raw`2\mid\big((2a+1)+(2b+1)\big)`, "even"),
    calculation("Use contradiction to show no integer n satisfies n² = 2 with n = 3.", String.raw`3^2=9`, String.raw`9\ne2`, "n = 3 is not a solution"),
  ],
  592: [
    calculation("Invest ₹10,000 at 8% compounded annually for 2 years. Find the amount.", String.raw`A=10000(1+0.08)^2`, String.raw`A=11664`, "₹11,664"),
    calculation("Invest ₹5,000 at 6% compounded quarterly for 1 year. Find the amount.", String.raw`A=5000\left(1+\frac{0.06}{4}\right)^4`, String.raw`A\approx5306.82`, "₹5,306.82"),
    calculation("An amount grows from ₹20,000 at 5% annually for 3 years. Find the interest earned.", String.raw`I=20000(1.05)^3-20000`, String.raw`I=3152.50`, "₹3,152.50"),
  ],
  593: [
    calculation("A nominal rate is 12% compounded monthly. Find the effective annual rate.", String.raw`i_{\mathrm{eff}}=\left(1+\frac{0.12}{12}\right)^{12}-1`, String.raw`i_{\mathrm{eff}}\approx0.1268`, "≈ 12.68%"),
    calculation("A nominal rate is 8% compounded quarterly. Find the effective annual rate.", String.raw`i_{\mathrm{eff}}=\left(1+\frac{0.08}{4}\right)^4-1`, String.raw`i_{\mathrm{eff}}\approx0.0824`, "≈ 8.24%"),
    calculation("A half-year rate is 4%. Find the effective annual rate.", String.raw`i_{\mathrm{eff}}=(1.04)^2-1`, String.raw`i_{\mathrm{eff}}=0.0816`, "8.16%"),
  ],
  594: [
    calculation("Find the present value of ₹11,000 due in 1 year at 10%.", String.raw`PV=\frac{11000}{1.10}`, String.raw`PV=10000`, "₹10,000"),
    calculation("Find the present value of ₹12,100 due in 2 years at 10% annually.", String.raw`PV=\frac{12100}{(1.10)^2}`, String.raw`PV=10000`, "₹10,000"),
    calculation("Find the present value of ₹5,000 due in 3 years at 5% annually.", String.raw`PV=\frac{5000}{(1.05)^3}`, String.raw`PV\approx4319.19`, "≈ ₹4,319.19"),
  ],
  595: [
    calculation("Find the future value of ₹8,000 invested at 5% for 2 years.", String.raw`FV=8000(1.05)^2`, String.raw`FV=8820`, "₹8,820"),
    calculation("Find the future value of ₹15,000 at 4% for 3 years.", String.raw`FV=15000(1.04)^3`, String.raw`FV\approx16872.96`, "≈ ₹16,872.96"),
    calculation("₹6,000 becomes ₹7,260 in 2 years. Find the total growth factor.", String.raw`g=\frac{7260}{6000}`, String.raw`g=1.21`, "1.21"),
  ],
  596: [
    calculation("Deposit ₹1,000 at each year-end for 3 years at 10%. Find the annuity value.", String.raw`FV=1000\frac{(1.10)^3-1}{0.10}`, String.raw`FV=3310`, "₹3,310"),
    calculation("An annuity pays ₹500 for 4 periods with no interest. Find its total value.", String.raw`FV=500(4)`, String.raw`FV=2000`, "₹2,000"),
  ],
  597: [
    calculation("A ₹12,000 loan is repaid in 12 equal principal-only instalments. Find each instalment.", String.raw`EMI=\frac{12000}{12}`, String.raw`EMI=1000`, "₹1,000"),
    calculation("Find the monthly payment on ₹10,000 at 1% monthly for 2 months.", String.raw`EMI=10000\frac{0.01(1.01)^2}{(1.01)^2-1}`, String.raw`EMI\approx5075.12`, "≈ ₹5,075.12"),
    calculation("A ₹5,000 balance accrues 2% monthly interest. Find the first month's interest.", String.raw`I=5000(0.02)`, String.raw`I=100`, "₹100"),
  ],
  598: [
    calculation("A ₹10,000 loan charges ₹100 interest and receives a ₹1,000 payment. Find the new balance.", String.raw`B_1=10000+100-1000`, String.raw`B_1=9100`, "₹9,100"),
    calculation("A ₹9,100 balance charges 1% interest. Find that month's interest.", String.raw`I=9100(0.01)`, String.raw`I=91`, "₹91"),
    calculation("A payment is ₹1,000 and interest is ₹91. Find the principal repaid.", String.raw`P=1000-91`, String.raw`P=909`, "₹909"),
  ],
  599: [
    calculation("A ₹50,000 asset depreciates 20% in one year. Find its value.", String.raw`V=50000(1-0.20)`, String.raw`V=40000`, "₹40,000"),
    calculation("A ₹30,000 asset loses ₹4,000 yearly. Find its value after 3 years.", String.raw`V=30000-3(4000)`, String.raw`V=18000`, "₹18,000"),
  ],
  600: [
    calculation("A ₹100 item rises by 6% inflation. Find its new price.", String.raw`P=100(1.06)`, String.raw`P=106`, "₹106"),
    calculation("Prices rise 5% annually for 2 years. Find the price index starting from 100.", String.raw`I=100(1.05)^2`, String.raw`I=110.25`, "110.25"),
    calculation("Income rises 4% while inflation is 7%. Approximate the real change.", String.raw`r_{\mathrm{real}}\approx4\%-7\%`, String.raw`r_{\mathrm{real}}\approx-3\%`, "≈ -3%"),
  ],
  601: [
    calculation("Convert US$80 to rupees at ₹83 per US dollar.", String.raw`80\times83`, String.raw`6640`, "₹6,640"),
    calculation("Convert ₹9,960 to US dollars at ₹83 per US dollar.", String.raw`\frac{9960}{83}`, String.raw`120`, "US$120"),
    calculation("Convert €250 to rupees at ₹91.20 per euro.", String.raw`250\times91.20`, String.raw`22800`, "₹22,800"),
  ],
  602: [
    calculation("An item costs ₹800 and sells for ₹1,000. Find profit and profit percent.", String.raw`P=1000-800=200,\quad P\%=\frac{200}{800}\times100`, String.raw`P=200,\quad P\%=25\%`),
    calculation("An item costs ₹1,200 and sells for ₹1,080. Find the loss percent.", String.raw`L=1200-1080=120,\quad L\%=\frac{120}{1200}\times100`, String.raw`L\%=10\%`),
    calculation("A product costing ₹500 has a 30% markup. Find its selling price.", String.raw`SP=500(1+0.30)`, String.raw`SP=650`, "₹650"),
  ],
  603: [
    calculation("Fixed cost is ₹10,000, price ₹100, and variable cost ₹60. Find break-even units.", String.raw`q=\frac{10000}{100-60}`, String.raw`q=250`, "250 units"),
    calculation("Revenue is R = 80q and cost is C = 3,000 + 50q. Find break-even q.", String.raw`80q=3000+50q`, String.raw`q=100`, "100 units"),
    calculation("At q = 400, R = 120q and C = 20,000 + 70q. Find profit.", String.raw`\Pi=120(400)-[20000+70(400)]`, String.raw`\Pi=0`, "₹0"),
  ],
  604: [
    calculation("A ₹2,000 item has 18% tax. Find the final price.", String.raw`P=2000(1+0.18)`, String.raw`P=2360`, "₹2,360"),
    calculation("A ₹1,500 item has a 20% discount. Find the sale price.", String.raw`P=1500(1-0.20)`, String.raw`P=1200`, "₹1,200"),
  ],
  605: [
    calculation("Investment A returns 8% on ₹10,000; B returns 7% on ₹12,000. Compare one-year gains.", String.raw`G_A=10000(0.08)=800,\quad G_B=12000(0.07)=840`, String.raw`G_B-G_A=40`, "B earns ₹40 more"),
    calculation("Compare ₹5,000 at 10% simple interest and 9% compound interest for 2 years.", String.raw`A_S=5000(1+0.10\cdot2)=6000,\quad A_C=5000(1.09)^2`, String.raw`A_C=5940.50`, "simple interest gives ₹59.50 more"),
    calculation("A ₹20,000 investment becomes ₹23,000. Find its total return rate.", String.raw`r=\frac{23000-20000}{20000}\times100\%`, String.raw`r=15\%`),
  ],
  606: [
    calculation("Build a taxi model with fixed fare ₹50 and ₹12 per kilometre; find cost for 8 km.", String.raw`C(d)=50+12d,\quad C(8)=50+12(8)`, String.raw`C(8)=146`, "₹146"),
    calculation("Build an area model for a rectangle with width x and length x + 3; evaluate at x = 5.", String.raw`A(x)=x(x+3),\quad A(5)=5(8)`, String.raw`A(5)=40`, "40"),
    calculation("Build a population model starting at 500 and growing 4% yearly; find year 2.", String.raw`P(t)=500(1.04)^t,\quad P(2)=500(1.04)^2`, String.raw`P(2)=540.8`, "540.8"),
  ],
  607: [
    calculation("A line passes through (2, 5) and (6, 13). Find its equation.", String.raw`m=\frac{13-5}{6-2}=2,\quad b=1`, String.raw`y=2x+1`),
    calculation("For C = 40 + 7x, find C when x = 12.", String.raw`C=40+7(12)`, String.raw`C=124`, "124"),
    calculation("A linear model changes from 18 at x = 3 to 38 at x = 8. Find its slope.", String.raw`m=\frac{38-18}{8-3}`, String.raw`m=4`, "4"),
  ],
  608: [calculation("For h(t) = -5t² + 20t + 2, find h(2).", String.raw`h(2)=-5(2)^2+20(2)+2`, String.raw`h(2)=22`, "22")],
  609: [
    calculation("For P(t) = 200(1.1)ᵗ, find P(3).", String.raw`P(3)=200(1.1)^3`, String.raw`P(3)=266.2`, "266.2"),
    calculation("For L(t) = 100/(1 + 9e⁻ᵗ), find L(0).", String.raw`L(0)=\frac{100}{1+9}`, String.raw`L(0)=10`, "10"),
  ],
  610: [
    calculation("For y = 3 sin(πt/6), find y at t = 3.", String.raw`y=3\sin\frac{\pi(3)}6`, String.raw`y=3`, "3"),
    calculation("A periodic model has angular frequency π/4. Find its period.", String.raw`T=\frac{2\pi}{\frac\pi4}`, String.raw`T=8`, "8"),
  ],
  611: [
    calculation("For f(x) = x + 2 when x < 3 and 2x when x ≥ 3, find f(1).", String.raw`1<3\Rightarrow f(1)=1+2`, String.raw`f(1)=3`, "3"),
    calculation("For the same function, find f(5).", String.raw`5\ge3\Rightarrow f(5)=2(5)`, String.raw`f(5)=10`, "10"),
    calculation("A tariff is ₹50 for up to 5 units and ₹50 + ₹8(x - 5) above 5. Find the cost for 9 units.", String.raw`C(9)=50+8(9-5)`, String.raw`C(9)=82`, "₹82"),
  ],
  612: [
    calculation("For y = mx + b through (1, 4) and (3, 10), estimate m and b.", String.raw`m=\frac{10-4}{3-1}=3,\quad b=4-3(1)`, String.raw`m=3,\quad b=1`),
    calculation("Data follows y = ax² and includes (2, 20). Estimate a.", String.raw`20=a(2)^2`, String.raw`a=5`, "5"),
    calculation("For y = abˣ with y(0)=3 and y(1)=6, estimate a and b.", String.raw`a=3,\quad3b=6`, String.raw`a=3,\quad b=2`),
  ],
  613: [
    calculation("Convert 72 km/h to m/s.", String.raw`72\frac{\mathrm{km}}{\mathrm h}\times\frac{1000\,\mathrm m}{1\,\mathrm{km}}\times\frac{1\,\mathrm h}{3600\,\mathrm s}`, String.raw`20\frac{\mathrm m}{\mathrm s}`),
    calculation("Convert 2.5 metres to centimetres.", String.raw`2.5\,\mathrm m\times\frac{100\,\mathrm{cm}}{1\,\mathrm m}`, String.raw`250\,\mathrm{cm}`),
    calculation("A car travels at 15 m/s for 8 s. Find distance using units.", String.raw`d=15\frac{\mathrm m}{\mathrm s}(8\,\mathrm s)`, String.raw`d=120\,\mathrm m`),
  ],
  614: [
    calculation("For y = 4x + 3, find the change in y when x rises from 5 to 5.2.", String.raw`\Delta y=4(5.2)-4(5)`, String.raw`\Delta y=0.8`, "0.8"),
    calculation("For A = πr², estimate the relative area change when r rises 1%.", String.raw`\frac{\Delta A}{A}\approx2\frac{\Delta r}{r}`, String.raw`\frac{\Delta A}{A}\approx2\%`, "≈ 2%"),
    calculation("For y = 100/x, compare y at x = 10 and x = 11.", String.raw`y(10)=10,\quad y(11)=\frac{100}{11}`, String.raw`\Delta y\approx-0.909`, "≈ -0.909"),
  ],
  615: [
    calculation("Observed values are 8, 11 and predicted values are 7.5, 12. Find residuals.", String.raw`e_i=y_i-\hat y_i`, String.raw`e_1=0.5,\quad e_2=-1`),
    calculation("Residuals are 2, -1, and 3. Find SSE.", String.raw`SSE=2^2+(-1)^2+3^2`, String.raw`SSE=14`, "14"),
    calculation("Errors are -2, 1, 1. Find mean error.", String.raw`\bar e=\frac{-2+1+1}{3}`, String.raw`\bar e=0`, "0"),
  ],
  616: [
    calculation("Scenario A costs ₹120 per unit for 10 units; B costs ₹100 per unit plus ₹150 fixed. Compare totals.", String.raw`C_A=120(10)=1200,\quad C_B=100(10)+150=1150`, String.raw`C_A-C_B=50`, "B is ₹50 cheaper"),
    calculation("Best, base, and worst profits are ₹12,000, ₹8,000, and ₹3,000. Find the range.", String.raw`R=12000-3000`, String.raw`R=9000`, "₹9,000"),
    calculation("Demand scenarios 80, 100, 130 have probabilities 0.2, 0.5, 0.3. Find expected demand.", String.raw`E(D)=80(0.2)+100(0.5)+130(0.3)`, String.raw`E(D)=105`, "105"),
  ],
  617: [
    calculation("Maximise P = 3x + 2y at vertices (0,0), (4,0), (0,6).", String.raw`P=0,\ 12,\ 12`, String.raw`P_{\max}=12`, "12"),
    calculation("Minimise C = 5x + 4y at feasible vertices (2,1), (4,0), (0,5).", String.raw`C=14,\ 20,\ 20`, String.raw`C_{\min}=14`, "14 at (2,1)"),
    calculation("Constraints are x + y ≤ 8, x ≥ 0, y ≥ 0. Test point (3,4).", String.raw`3+4=7\le8`, String.raw`(3,4)\text{ is feasible}`, "feasible"),
  ],
  618: [
    calculation("A slider runs from 0 to 20 in steps of 2. How many selectable values are there?", String.raw`n=\frac{20-0}{2}+1`, String.raw`n=11`, "11"),
    calculation("A slider controls y = 3x + 1. Find y when the slider is x = 4.", String.raw`y=3(4)+1`, String.raw`y=13`, "13"),
  ],
  619: [
    calculation("A checkbox uses c = 1 when checked and c = 0 otherwise. Find 5c when checked.", String.raw`c=1\Rightarrow5c=5(1)`, String.raw`5c=5`, "5"),
    calculation("Three checkboxes have states 1, 0, 1. Count the selected options.", String.raw`1+0+1`, String.raw`2`, "2"),
  ],
  620: [
    calculation("Each button press increases a counter by 3. Starting at 2, press it 4 times.", String.raw`C=2+4(3)`, String.raw`C=14`, "14"),
    calculation("A reset button changes x from 17 to its initial value 5. Find the change.", String.raw`\Delta x=5-17`, String.raw`\Delta x=-12`, "-12"),
    calculation("A button doubles a value. Apply it three times to 2.", String.raw`2\cdot2^3`, String.raw`16`, "16"),
  ],
  621: [calculation("Enter x = -3 into the input box for f(x) = x² + 2.", String.raw`f(-3)=(-3)^2+2`, String.raw`f(-3)=11`, "11")],
  622: [
    calculation("A drop-down selects radius r = 4. Find the circle area.", String.raw`A=\pi r^2=\pi(4)^2`, String.raw`A=16\pi`, String.raw`16\pi`),
    calculation("Choose operation × from a drop-down for inputs 6 and 7.", String.raw`6\times7`, String.raw`42`, "42"),
    calculation("A scale drop-down selects 150%. Apply it to length 8.", String.raw`L=1.5(8)`, String.raw`L=12`, "12"),
  ],
  623: [
    calculation("Dynamic text shows y = 2x + 5. What value appears when x = 6?", String.raw`y=2(6)+5`, String.raw`y=17`, "17"),
    calculation("A dynamic label displays the distance between (1,2) and (4,6).", String.raw`d=\sqrt{(4-1)^2+(6-2)^2}`, String.raw`d=5`, "5"),
    calculation("Dynamic text displays the mean of 3, 7, and 8.", String.raw`\bar x=\frac{3+7+8}{3}`, String.raw`\bar x=6`, "6"),
  ],
  624: [calculation("Display one-half plus one-third as a LaTeX fraction and evaluate it.", String.raw`\frac12+\frac13=\frac36+\frac26`, String.raw`\frac56`, String.raw`\frac56`)],
  625: [
    calculation("An image is 800 by 600 pixels. Scale both dimensions by 50%.", String.raw`800(0.5)\times600(0.5)`, String.raw`400\times300`, "400 × 300 pixels"),
    calculation("An image width grows from 320 to 480 pixels. Find the scale factor.", String.raw`s=\frac{480}{320}`, String.raw`s=1.5`, "1.5"),
    calculation("A 1200-pixel-wide image is cropped by 150 pixels on each side. Find the new width.", String.raw`1200-2(150)`, String.raw`900`, "900 pixels"),
  ],
  626: [
    calculation("A 90-second video plays at 1.5× speed. Find its viewing time.", String.raw`t=\frac{90}{1.5}`, String.raw`t=60\text{ s}`, "60 seconds"),
    calculation("An audio clip lasts 2 minutes 30 seconds. Convert the duration to seconds.", String.raw`2(60)+30`, String.raw`150\text{ s}`, "150 seconds"),
    calculation("A video has 24 frames per second for 10 seconds. Find its frame count.", String.raw`24(10)`, String.raw`240\text{ frames}`, "240 frames"),
  ],
  627: [
    calculation("A pen draws segments of lengths 3, 4, and 5. Find the total drawn length.", String.raw`L=3+4+5`, String.raw`L=12`, "12"),
    calculation("A highlighter covers 35 of 140 words. Find the highlighted percentage.", String.raw`\frac{35}{140}\times100\%`, String.raw`25\%`),
    calculation("A stroke is 6 pixels wide and 120 pixels long. Find its approximate rectangular area.", String.raw`A=6(120)`, String.raw`A=720\text{ px}^2`, "720 px²"),
  ],
  628: [
    calculation("A table has 6 rows and 4 columns. Find its number of data cells.", String.raw`6\times4`, String.raw`24`, "24"),
    calculation("The values in a table column are 5, 8, 11, 16. Find their sum.", String.raw`5+8+11+16`, String.raw`40`, "40"),
    calculation("A 3×5 table gains 2 rows. Find its new cell count.", String.raw`(3+2)\times5`, String.raw`25`, "25"),
  ],
  629: [
    calculation("A lesson has 8 pages with 3 examples per page. Count all examples.", String.raw`8(3)`, String.raw`24`, "24"),
    calculation("You are on page 4 of 10. How many pages remain after the current page?", String.raw`10-4`, String.raw`6`, "6"),
    calculation("Pages contain 5, 7, and 4 questions. Find the total.", String.raw`5+7+4`, String.raw`16`, "16"),
  ],
  630: [
    calculation("A construction begins at x = 2, changes to x = 9, then resets. Find the reset value.", String.raw`x_{\mathrm{reset}}=x_0`, String.raw`x_{\mathrm{reset}}=2`, "2"),
    calculation("Reset returns a radius from 12 to 5. Find the radius change.", String.raw`\Delta r=5-12`, String.raw`\Delta r=-7`, "-7"),
    calculation("Three sliders reset from 7, 4, 9 to 1, 1, 1. Find the sum after reset.", String.raw`1+1+1`, String.raw`3`, "3"),
  ],
  631: [
    calculation("A value changes 3 → 8 → 11. One undo is pressed. What value returns?", String.raw`3\to8\to11\xrightarrow{\mathrm{undo}}8`, String.raw`8`, "8"),
    calculation("After undo returns 8, redo is pressed. What value appears?", String.raw`8\xrightarrow{\mathrm{redo}}11`, String.raw`11`, "11"),
    calculation("Five edits are made and two are undone. How many applied edits remain?", String.raw`5-2`, String.raw`3`, "3"),
  ],
  632: [
    calculation("A locked point is at (3,5). A drag request adds (2,-1). What coordinates remain?", String.raw`(3,5)_{\mathrm{locked}}+(2,-1)_{\mathrm{ignored}}`, String.raw`(3,5)`),
    calculation("Of 12 objects, 7 are locked. How many remain editable?", String.raw`12-7`, String.raw`5`, "5"),
    calculation("An unlocked slider moves from 4 to 9, while a locked slider stays at 6. Find their new sum.", String.raw`9+6`, String.raw`15`, "15"),
  ],
  633: [
    calculation("Feedback says correct when x² = 25 and x = 5. Evaluate the condition.", String.raw`5^2=25`, String.raw`25=25\Rightarrow\text{correct}`, "correct"),
    calculation("A score of 7 needs at least 8 to pass. Which feedback appears?", String.raw`7<8`, String.raw`\text{try again}`, "try again"),
    calculation("An answer 3.98 is accepted within 0.05 of 4. Find its error.", String.raw`|3.98-4|=0.02`, String.raw`0.02<0.05\Rightarrow\text{accepted}`, "accepted"),
  ],
  634: [
    calculation("A custom midpoint tool receives (2,4) and (8,10). Find its output.", String.raw`M=\left(\frac{2+8}{2},\frac{4+10}{2}\right)`, String.raw`M=(5,7)`),
    calculation("A custom area tool receives radius 3. Find its circle-area output.", String.raw`A=\pi(3)^2`, String.raw`A=9\pi`, String.raw`9\pi`),
    calculation("A custom slope tool receives (1,2) and (5,10). Find its output.", String.raw`m=\frac{10-2}{5-1}`, String.raw`m=2`, "2"),
  ],
  635: [
    calculation("Use the Distance command on (0,0) and (6,8).", String.raw`d=\sqrt{6^2+8^2}`, String.raw`d=10`, "10"),
    calculation("Use the Mean command on 4, 7, and 10.", String.raw`\operatorname{Mean}=\frac{4+7+10}{3}`, String.raw`7`, "7"),
    calculation("Use the Factor command on x² - 9.", String.raw`x^2-9=x^2-3^2`, String.raw`(x-3)(x+3)`),
  ],
  636: [
    calculation("A script increments x by 2 three times from x = 1. Find the final x.", String.raw`x=1+3(2)`, String.raw`x=7`, "7"),
    calculation("A script sets y = x² whenever x changes. Find y after x becomes -4.", String.raw`y=(-4)^2`, String.raw`y=16`, "16"),
    calculation("A script halves a value on each click. Find the value after 3 clicks from 80.", String.raw`80\left(\frac12\right)^3`, String.raw`10`, "10"),
  ],
  637: [
    calculation("A random integer generator selects uniformly from 1 to 6. Find P(rolling 4).", String.raw`P(X=4)=\frac16`, String.raw`\frac16`, String.raw`\frac16`),
    calculation("A randomiser produced 23 successes in 50 trials. Estimate p.", String.raw`\hat p=\frac{23}{50}`, String.raw`\hat p=0.46`, "0.46"),
    calculation("A random integer is chosen from 3 through 9 inclusive. Count possible outputs.", String.raw`9-3+1`, String.raw`7`, "7"),
  ],
  638: [
    calculation("Automatic checking accepts answers within 0.01. Is 2.995 accepted for 3?", String.raw`|2.995-3|=0.005`, String.raw`0.005<0.01\Rightarrow\text{accepted}`, "accepted"),
    calculation("A quiz has 8 automatically checked questions and 6 are correct. Find the score percent.", String.raw`\frac68\times100\%`, String.raw`75\%`),
  ],
  639: [
    calculation("Import 6 rows with 4 values each. Count imported values.", String.raw`6(4)`, String.raw`24`, "24"),
    calculation("Export 125 records after filtering out 18. Count exported records.", String.raw`125-18`, String.raw`107`, "107"),
    calculation("An imported file is 2.4 MB and an exported file is 1.8 MB. Find the size reduction.", String.raw`2.4-1.8`, String.raw`0.6\text{ MB}`, "0.6 MB"),
  ],
  640: [
    calculation("Introduce ratio with 6 red and 9 blue counters. Simplify red : blue.", String.raw`6:9=\frac63:\frac93`, String.raw`2:3`),
    calculation("Introduce slope using rise 8 and run 4.", String.raw`m=\frac{8}{4}`, String.raw`m=2`, "2"),
    calculation("Introduce percentage using 15 correct answers out of 20.", String.raw`\frac{15}{20}\times100\%`, String.raw`75\%`),
  ],
  641: [
    calculation("Visualise y = 2x + 1 by finding the point when x = 3.", String.raw`y=2(3)+1`, String.raw`(x,y)=(3,7)`),
    calculation("Visualise 3/4 of a whole divided into 12 equal parts. Count shaded parts.", String.raw`\frac34(12)`, String.raw`9`, "9"),
    calculation("Visualise a square of side 5. Find the area represented.", String.raw`A=5^2`, String.raw`A=25`, "25"),
  ],
  642: [
    calculation("Use 18 counters to make equal groups of 3. Count the groups.", String.raw`\frac{18}{3}`, String.raw`6`, "6"),
    calculation("Join fraction pieces 1/4 and 2/4. Find the total.", String.raw`\frac14+\frac24`, String.raw`\frac34`, String.raw`\frac34`),
    calculation("Build a 3 by 7 rectangle with unit tiles. Count the tiles.", String.raw`3\times7`, String.raw`21`, "21"),
  ],
  643: [
    calculation("Explore y = x² at x = 1, 2, 3. List the outputs.", String.raw`1^2,\ 2^2,\ 3^2`, String.raw`1,4,9`),
    calculation("Test triangle angles 50°, 60°, and 70°. Find their sum.", String.raw`50^\circ+60^\circ+70^\circ`, String.raw`180^\circ`),
    calculation("Change a circle radius from 2 to 4 and compare areas.", String.raw`\frac{\pi(4)^2}{\pi(2)^2}`, String.raw`4`, "area becomes 4 times as large"),
  ],
  644: [
    calculation("Predict y for y = 3x - 1 at x = 4, then test it.", String.raw`y=3(4)-1`, String.raw`y=11`, "11"),
    calculation("Predict whether 29 is prime, then test divisors up to √29.", String.raw`\sqrt{29}\approx5.39,\quad29\not\equiv0\pmod{2,3,5}`, String.raw`29\text{ is prime}`, "prime"),
    calculation("Predict the next term of 2, 6, 18, then test the ratio.", String.raw`r=\frac62=\frac{18}{6}=3`, String.raw`18(3)=54`, "54"),
  ],
  645: [
    calculation("Worked example: solve 4x + 3 = 19.", String.raw`4x=16`, String.raw`x=4`, "4"),
    calculation("Worked example: add 2/3 and 1/6.", String.raw`\frac23+\frac16=\frac46+\frac16`, String.raw`\frac56`, String.raw`\frac56`),
    calculation("Worked example: find the area of a triangle with base 8 and height 5.", String.raw`A=\frac12(8)(5)`, String.raw`A=20`, "20"),
  ],
  646: [
    calculation("Practice step by step: solve 2(x + 4) = 18.", String.raw`x+4=9`, String.raw`x=5`, "5"),
    calculation("Practice step by step: simplify 3a + 5a - 2.", String.raw`3a+5a-2`, String.raw`8a-2`),
    calculation("Practice step by step: evaluate (12 - 4)/2.", String.raw`\frac{12-4}{2}=\frac82`, String.raw`4`, "4"),
  ],
  647: [
    calculation("Construct a square of side 6 and find its perimeter.", String.raw`P=4(6)`, String.raw`P=24`, "24"),
    calculation("Construct an equilateral triangle of side 5 and find its perimeter.", String.raw`P=3(5)`, String.raw`P=15`, "15"),
    calculation("Construct a circle of radius 7 and find its circumference.", String.raw`C=2\pi(7)`, String.raw`C=14\pi`, String.raw`14\pi`),
  ],
  648: [
    calculation("Match y = 2x + 1 to the graph point at x = 2.", String.raw`y=2(2)+1`, String.raw`(2,5)`),
    calculation("Match y = x² to the graph point at x = -3.", String.raw`y=(-3)^2`, String.raw`(-3,9)`),
    calculation("Match y = 4 to its y-intercept.", String.raw`x=0\Rightarrow y=4`, String.raw`(0,4)`),
  ],
  649: [
    calculation("A student writes 2/3 + 1/4 = 3/7. Calculate the correct sum.", String.raw`\frac23+\frac14=\frac8{12}+\frac3{12}`, String.raw`\frac{11}{12}`, String.raw`\frac{11}{12}`),
    calculation("A student solves 3x = 12 as x = 36. Diagnose by calculating x correctly.", String.raw`x=\frac{12}{3}`, String.raw`x=4`, "4"),
    calculation("A student claims 2³ = 6. Evaluate 2³ correctly.", String.raw`2^3=2\cdot2\cdot2`, String.raw`8`, "8"),
  ],
  650: [
    calculation("Represent 3/4 as a decimal and percentage.", String.raw`\frac34=0.75`, String.raw`0.75=75\%`, "0.75 and 75%"),
    calculation("Represent y = 2x + 1 as a table value at x = 3 and a coordinate.", String.raw`y=2(3)+1=7`, String.raw`(x,y)=(3,7)`),
    calculation("Represent the ratio 2 : 5 as a fraction and decimal.", String.raw`2:5=\frac25`, String.raw`\frac25=0.4`, "2/5 and 0.4"),
  ],
  651: [
    calculation("A shop discounts ₹1,200 by 15%. Find the sale price.", String.raw`P=1200(1-0.15)`, String.raw`P=1020`, "₹1,020"),
    calculation("A 240 km journey takes 4 hours. Find average speed.", String.raw`v=\frac{240}{4}`, String.raw`v=60\ \mathrm{km\,h^{-1}}`, "60 kilometres per hour"),
    calculation("A recipe for 4 uses 300 g flour. Find the flour for 10 people.", String.raw`m=300\frac{10}{4}`, String.raw`m=750\text{ g}`, "750 g"),
  ],
  652: [
    calculation("Investigate rectangles of perimeter 20: find the area when length is 6.", String.raw`2(l+w)=20\Rightarrow w=4`, String.raw`A=6(4)=24`, "24"),
    calculation("Investigate y = x² - 4 for x = -2, 0, 2.", String.raw`y(-2)=0,\quad y(0)=-4,\quad y(2)=0`, String.raw`\{0,-4,0\}`),
    calculation("Investigate the sequence 3, 7, 11, 15. Find its 20th term.", String.raw`a_{20}=3+(20-1)4`, String.raw`a_{20}=79`, "79"),
  ],
  653: [
    calculation("A generator chooses a = 4 and b = 7 for ax + b with x = 3. Evaluate it.", String.raw`4(3)+7`, String.raw`19`, "19"),
    calculation("A generated fraction question asks for 2/5 + 1/10.", String.raw`\frac25+\frac1{10}=\frac4{10}+\frac1{10}`, String.raw`\frac12`, String.raw`\frac12`),
    calculation("A generator chooses radius 6 for a circle-area question.", String.raw`A=\pi(6)^2`, String.raw`A=36\pi`, String.raw`36\pi`),
  ],
  654: [
    calculation("Mastery challenge: solve 3x - 5 = 19.", String.raw`3x=24`, String.raw`x=8`, "8"),
    calculation("Mastery challenge: find the midpoint of (-2,4) and (8,10).", String.raw`M=\left(\frac{-2+8}{2},\frac{4+10}{2}\right)`, String.raw`M=(3,7)`),
    calculation("Mastery challenge: find 35% of 240.", String.raw`0.35(240)`, String.raw`84`, "84"),
  ],
  655: [
    calculation("Exit ticket: evaluate 2³ + 5.", String.raw`2^3+5=8+5`, String.raw`13`, "13"),
    calculation("Exit ticket: solve x/4 = 6.", String.raw`\frac x4=6\Rightarrow x=4(6)`, String.raw`x=24`, "24"),
    calculation("Exit ticket: find the mean of 5, 7, 9.", String.raw`\bar x=\frac{5+7+9}{3}`, String.raw`\bar x=7`, "7"),
  ],
  656: [
    calculation("Revision: simplify 4a + 3a - 2.", String.raw`4a+3a-2`, String.raw`7a-2`),
    calculation("Revision: find the area of a triangle with base 10 and height 7.", String.raw`A=\frac12(10)(7)`, String.raw`A=35`, "35"),
    calculation("Revision: solve 2x + 9 = 21.", String.raw`2x=12`, String.raw`x=6`, "6"),
  ],
  657: [
    calculation("Drag point (2,3) by vector (4,-1). Find its new position.", String.raw`(2,3)+(4,-1)`, String.raw`(6,2)`),
    calculation("Drag a radius slider from 3 to 5. Find the change in circle area.", String.raw`\Delta A=\pi(5)^2-\pi(3)^2`, String.raw`\Delta A=16\pi`, String.raw`16\pi`),
    calculation("Drag a vertex of a 4 by 6 rectangle to make its length 9. Find the new area.", String.raw`A=4(9)`, String.raw`A=36`, "36"),
  ],
  658: [
    calculation("Zoom a 5 cm segment by a scale factor of 2.4. Find its displayed length.", String.raw`L'=2.4(5)`, String.raw`L'=12\text{ cm}`, "12 cm"),
    calculation("A graph window width changes from 20 units to 8 units. Find the zoom factor.", String.raw`z=\frac{20}{8}`, String.raw`z=2.5`, "2.5"),
    calculation("Pan the graph point (3,-2) by vector (-5,4). Find its screen position.", String.raw`(3,-2)+(-5,4)`, String.raw`(-2,2)`),
  ],
  659: [calculation("Reset a view from scale 250% to 100%. Find the percentage-point change.", String.raw`100\%-250\%`, String.raw`-150\%`, "decrease of 150 percentage points")],
  660: [
    calculation("A value changes 5 → 12 → 20. Press undo once.", String.raw`5\to12\to20\xrightarrow{\mathrm{undo}}12`, String.raw`12`, "12"),
    calculation("After the undo returns 12, press redo.", String.raw`12\xrightarrow{\mathrm{redo}}20`, String.raw`20`, "20"),
    calculation("Seven actions are recorded and three are undone. Count active actions.", String.raw`7-3`, String.raw`4`, "4"),
  ],
  661: [
    calculation("An animation has 120 frames at 30 frames per second. Find its duration.", String.raw`t=\frac{120}{30}`, String.raw`t=4\text{ s}`, "4 seconds"),
    calculation("Play a 90-second animation at 1.5× speed. Find the viewing time.", String.raw`t=\frac{90}{1.5}`, String.raw`t=60\text{ s}`, "60 seconds"),
    calculation("An animation advances 5 units per frame for 8 frames. Find total movement.", String.raw`d=5(8)`, String.raw`d=40`, "40"),
  ],
  662: [
    calculation("Snap an angle of 47° to the nearest 15° increment.", String.raw`47^\circ\approx3(15^\circ)`, String.raw`45^\circ`),
    calculation("Snap x = 3.74 to a grid spacing of 0.5.", String.raw`3.74\approx7(0.5)`, String.raw`x=3.5`, "3.5"),
  ],
  663: [
    calculation("Trace the point (t, t²) at t = -2, 0, 2.", String.raw`(-2,4),\quad(0,0),\quad(2,4)`, String.raw`y=x^2`),
    calculation("A point stays 5 units from the origin. Write its locus equation.", String.raw`\sqrt{x^2+y^2}=5`, String.raw`x^2+y^2=25`),
    calculation("Trace x = 2t, y = 3t for t = 4.", String.raw`x=2(4),\quad y=3(4)`, String.raw`(x,y)=(8,12)`),
  ],
  665: [
    calculation("A table sets x = 4 and a linked graph uses y = x² - 1. Find the linked point.", String.raw`y=4^2-1`, String.raw`(4,15)`),
    calculation("A slider changes radius from 2 to 6 and a linked area view updates. Find the new area.", String.raw`A=\pi(6)^2`, String.raw`A=36\pi`, String.raw`36\pi`),
  ],
  666: [
    calculation("Save 3 versions, duplicate 2 of them, and count all stored items.", String.raw`3+2`, String.raw`5`, "5"),
    calculation("A shared copy begins with 8 objects and adds 4. Count its objects.", String.raw`8+4`, String.raw`12`, "12"),
    calculation("A file of 6 MB is duplicated 3 times. Find total storage including the original.", String.raw`(1+3)(6)`, String.raw`24\text{ MB}`, "24 MB"),
  ],
  667: [
    calculation("Export a 1200 by 800 image at half scale. Find its dimensions.", String.raw`1200(0.5)\times800(0.5)`, String.raw`600\times400`, "600 × 400"),
    calculation("Export 250 rows after removing 35 hidden rows. Count exported rows.", String.raw`250-35`, String.raw`215`, "215"),
    calculation("Export a 3-minute animation at 20 frames per second. Count frames.", String.raw`3(60)(20)`, String.raw`3600`, "3,600 frames"),
  ],
  668: [
    calculation("Presentation mode shows 12 slides for 5 minutes. Find average seconds per slide.", String.raw`\frac{5(60)}{12}`, String.raw`25\text{ s}`, "25 seconds"),
    calculation("A teacher reveals 4 steps at 15-second intervals. Find the time to the fourth reveal.", String.raw`4(15)`, String.raw`60\text{ s}`, "60 seconds"),
    calculation("A class of 36 forms groups of 4 for a presentation activity. Count groups.", String.raw`\frac{36}{4}`, String.raw`9`, "9"),
  ],
  669: [
    calculation("A learner answers 18 of 24 practice questions correctly. Find the score.", String.raw`\frac{18}{24}\times100\%`, String.raw`75\%`),
    calculation("Practice mode awards 5 XP for each of 7 correct answers. Find XP earned.", String.raw`5(7)`, String.raw`35`, "35 XP"),
    calculation("A learner needs 80% on 20 questions. Find the minimum correct count.", String.raw`0.80(20)`, String.raw`16`, "16"),
  ],
  670: [
    calculation("An exam has 40 questions in 60 minutes. Find average minutes per question.", String.raw`\frac{60}{40}`, String.raw`1.5\text{ min}`, "1.5 minutes"),
    calculation("A 75-mark exam has sections worth 30, 25, and 20 marks. Verify the total.", String.raw`30+25+20`, String.raw`75`, "75"),
    calculation("A student scores 63 out of 75. Find the percentage.", String.raw`\frac{63}{75}\times100\%`, String.raw`84\%`),
  ],
  671: [
    calculation("Press the right-arrow key 6 times with a step of 0.5. Find total movement.", String.raw`6(0.5)`, String.raw`3`, "3 units"),
    calculation("A keyboard sequence moves point (2,3) left 4 units and up 2 units.", String.raw`(2,3)+(-4,2)`, String.raw`(-2,5)`),
    calculation("There are 9 focusable controls. Starting at control 2, press Tab 5 times without wrapping.", String.raw`2+5`, String.raw`7`, "control 7"),
  ],
  672: [
    calculation("A screen reader announces the fraction 3/8. Convert it to a decimal for the spoken result.", String.raw`\frac38`, String.raw`0.375`, "0.375"),
    calculation("A chart description lists values 4, 9, and 7. Announce their total.", String.raw`4+9+7`, String.raw`20`, "20"),
    calculation("A table has 5 rows and 3 columns. Announce its cell count.", String.raw`5(3)`, String.raw`15`, "15 cells"),
  ],
  673: [
    calculation("Large text scales 16 px by 150%. Find the new size.", String.raw`16(1.5)`, String.raw`24\text{ px}`, "24 px"),
    calculation("A contrast ratio rises from 3:1 to 7:1. Find the numerical increase.", String.raw`7-3`, String.raw`4`, "4"),
    calculation("A 20 px label is enlarged by 25%. Find its size.", String.raw`20(1.25)`, String.raw`25\text{ px}`, "25 px"),
  ],
  674: [
    calculation("The English term 'square' has 6 letters and its Hindi term 'वर्ग' has 4 code points. Find the count difference.", String.raw`6-4`, String.raw`2`, "2"),
    calculation("A glossary has 25 terms translated into 4 languages. Count translation entries.", String.raw`25(4)`, String.raw`100`, "100"),
    calculation("Three languages show the same value 1/2. Express the shared numerical value in LaTeX.", String.raw`\frac12`, String.raw`0.5`, String.raw`\frac12`),
  ],
  2001: [
    calculation("Use partial quotients to divide 156 by 12.", String.raw`156-10(12)=36,\quad36-3(12)=0`, String.raw`156\div12=10+3=13`, "13"),
    calculation("Use partial quotients to divide 728 by 14.", String.raw`728-50(14)=28,\quad28-2(14)=0`, String.raw`728\div14=52`, "52"),
    calculation("Use partial quotients for 437 ÷ 9.", String.raw`437-40(9)=77,\quad77-8(9)=5`, String.raw`437=9(48)+5`, "48 remainder 5"),
  ],
  2002: [
    calculation("Find the first three convergents of [1;2,2,2,…].", String.raw`1,\quad1+\frac12=\frac32,\quad1+\frac1{2+\frac12}=\frac75`, String.raw`1,\frac32,\frac75`),
    calculation("Find the convergents of [3;4,2].", String.raw`3,\quad3+\frac14=\frac{13}{4}`, String.raw`3+\frac1{4+\frac12}=\frac{29}{9}`),
    calculation("Compare 22/7 with π≈3.14159 by absolute error.", String.raw`\left|\frac{22}{7}-3.14159\right|`, String.raw`\approx0.001267`, "≈ 0.001267"),
  ],
  2003: [
    calculation("Use the Euclidean algorithm to find gcd(252,105).", String.raw`252=2(105)+42,\quad105=2(42)+21`, String.raw`\gcd(252,105)=21`, "21"),
    calculation("Find gcd(119,34) and express the last division.", String.raw`119=3(34)+17,\quad34=2(17)`, String.raw`\gcd(119,34)=17`, "17"),
    calculation("Find gcd(414,662).", String.raw`662=1(414)+248,\ 414=1(248)+166,\ 248=1(166)+82,\ 166=2(82)+2`, String.raw`\gcd(414,662)=2`, "2"),
  ],
  2004: [
    calculation("Compare 7/5 and 10/7 as approximations to √2≈1.414214.", String.raw`\left|\frac75-\sqrt2\right|\approx0.014214,\quad\left|\frac{10}{7}-\sqrt2\right|\approx0.014357`, String.raw`\frac75\text{ is closer}`),
    calculation("Find the error of 355/113 as an approximation to π.", String.raw`\left|\frac{355}{113}-\pi\right|`, String.raw`\approx2.67\times10^{-7}`),
    calculation("Among 3/2 and 7/5, choose the closer approximation to √2.", String.raw`\left|\frac32-\sqrt2\right|\approx0.0858,\quad\left|\frac75-\sqrt2\right|\approx0.0142`, String.raw`\frac75`),
  ],
  2005: [
    calculation("Write the continued fraction of √2 through four partial quotients.", String.raw`\sqrt2=[1;\overline2]`, String.raw`[1;2,2,2]`),
    calculation("Use [1;2,2] to approximate √2.", String.raw`1+\frac1{2+\frac12}`, String.raw`\frac75=1.4`, String.raw`\frac75`),
    calculation("For √3=[1;1,2,1,2,…], calculate [1;1,2].", String.raw`1+\frac1{1+\frac12}`, String.raw`\frac53`, String.raw`\frac53`),
  ],
  2006: [
    calculation("Generate the Collatz sequence from 6 until 1.", String.raw`6\to3\to10\to5\to16\to8\to4\to2\to1`, String.raw`8\text{ steps}`, "8 steps"),
    calculation("Apply five Collatz steps starting from 11.", String.raw`11\to34\to17\to52\to26\to13`, String.raw`13`, "13"),
    calculation("Count steps from 8 to 1 in the Collatz map.", String.raw`8\to4\to2\to1`, String.raw`3\text{ steps}`, "3 steps"),
  ],
  2007: [
    calculation("Write 28 as a sum of two primes.", String.raw`28=5+23`, String.raw`5,23`),
    calculation("List all unordered prime pairs summing to 20.", String.raw`20=3+17=7+13`, String.raw`\{3,17\},\{7,13\}`),
    calculation("Verify Goldbach's claim for 42 with one prime pair.", String.raw`42=19+23`, String.raw`19\text{ and }23\text{ are prime}`),
  ],
  2008: [
    calculation("Evaluate ζ(2) using its known closed form.", String.raw`\zeta(2)=\sum_{n=1}^{\infty}\frac1{n^2}`, String.raw`\zeta(2)=\frac{\pi^2}{6}`),
    calculation("Calculate the first four terms of ζ(2).", String.raw`1+\frac14+\frac19+\frac1{16}`, String.raw`\frac{205}{144}\approx1.4236`),
    calculation("Count primes not exceeding 20 for comparison with π(x).", String.raw`\{2,3,5,7,11,13,17,19\}`, String.raw`\pi(20)=8`, "8"),
  ],
  2009: [
    calculation("Verify the Pythagorean case 3²+4²=5² for exponent 2.", String.raw`3^2+4^2=9+16`, String.raw`25=5^2`),
    calculation("Check that 3³+4³ is not 5³.", String.raw`3^3+4^3=27+64=91`, String.raw`91\ne125`),
    calculation("For n=4, compare 2⁴+3⁴ with 4⁴.", String.raw`2^4+3^4=16+81=97`, String.raw`97\ne256`),
  ],
  2010: [
    calculation("A cycle graph C₅ is a map adjacency graph. Find its chromatic number.", String.raw`5\text{ is odd}\Rightarrow\chi(C_5)=3`, String.raw`3`, "3"),
    calculation("A square grid cell adjacency graph C₄ needs how many colours?", String.raw`4\text{ is even}\Rightarrow\chi(C_4)=2`, String.raw`2`, "2"),
    calculation("The complete planar graph K₄ needs how many colours?", String.raw`\chi(K_4)=4`, String.raw`4`, "4"),
  ],
  2011: [
    calculation("Find a 95% z-confidence interval for x̄=50, σ=10, n=100.", String.raw`50\pm1.96\frac{10}{\sqrt{100}}`, String.raw`[48.04,51.96]`),
    calculation("A mean estimate is 72 with margin 4. Find its confidence interval.", String.raw`72\pm4`, String.raw`[68,76]`),
    calculation("For x̄=20, SE=1.5, and z*=2, find the interval.", String.raw`20\pm2(1.5)`, String.raw`[17,23]`),
  ],
  2012: [
    calculation("Find sample size for margin E=0.05, z*=1.96, σ=0.4.", String.raw`n=\left(\frac{1.96(0.4)}{0.05}\right)^2`, String.raw`n\approx245.86\Rightarrow246`, "246"),
    calculation("For a proportion with p=0.5, z*=2, E=0.1, find n.", String.raw`n=\frac{2^2(0.5)(0.5)}{0.1^2}`, String.raw`n=100`, "100"),
    calculation("If sample size quadruples from 100 to 400, how does margin of error change?", String.raw`E\propto\frac1{\sqrt n},\quad\frac{E_{400}}{E_{100}}=\frac{10}{20}`, String.raw`E_{400}=\frac12E_{100}`, "halves"),
  ],
  2013: [
    calculation("Test μ₀=100 using x̄=104, σ=8, n=16. Find z.", String.raw`z=\frac{104-100}{\frac8{\sqrt{16}}}`, String.raw`z=2`, "2"),
    calculation("A two-sided z-test gives z=2.5. Find the approximate p-value.", String.raw`p=2P(Z\ge2.5)`, String.raw`p\approx0.0124`, "≈ 0.0124"),
    calculation("Compare p=0.032 with α=0.05.", String.raw`0.032<0.05`, String.raw`\text{reject }H_0`, "reject H₀"),
  ],
  2014: [
    calculation("A right-tail test has area 0.018 beyond its statistic. Find p.", String.raw`p=0.018`, String.raw`p<0.05`, "0.018"),
    calculation("A two-sided test has one-tail area 0.041. Find p.", String.raw`p=2(0.041)`, String.raw`p=0.082`, "0.082"),
    calculation("At α=0.01, decide using p=0.006.", String.raw`0.006<0.01`, String.raw`\text{reject }H_0`, "reject H₀"),
  ],
  2015: [
    calculation("A test uses α=0.05. Find its Type I error probability.", String.raw`P(\text{Type I})=\alpha`, String.raw`0.05`, "0.05"),
    calculation("A test has power 0.9. Find β.", String.raw`\beta=1-0.9`, String.raw`0.1`, "0.1"),
    calculation("With α=0.02 and β=0.15, state power.", String.raw`1-\beta=1-0.15`, String.raw`0.85`, "0.85"),
  ],
  2016: [
    calculation("For dy/dx=x+y, find slope at (1,2).", String.raw`m=1+2`, String.raw`m=3`, "3"),
    calculation("For dy/dx=x-y, find slope at (3,5).", String.raw`m=3-5`, String.raw`m=-2`, "-2"),
    calculation("For dy/dx=xy, find slopes at (2,0) and (2,3).", String.raw`m_1=2(0)=0,\quad m_2=2(3)`, String.raw`m_1=0,\quad m_2=6`),
  ],
  2017: [
    calculation("Use one Euler step for y'=x+y, y(0)=1, h=0.1.", String.raw`y_1=1+0.1(0+1)`, String.raw`y_1=1.1`, "1.1"),
    calculation("Use Euler's method for y'=2y, y(0)=3, h=0.25 for one step.", String.raw`y_1=3+0.25(6)`, String.raw`y_1=4.5`, "4.5"),
    calculation("For y'=-y, y(0)=4, h=0.5, take two Euler steps.", String.raw`y_1=4+0.5(-4)=2,\quad y_2=2+0.5(-2)`, String.raw`y_2=1`, "1"),
  ],
  2018: [
    calculation("Solve y'=0.2y with y(0)=50 and find y(5).", String.raw`y=50e^{0.2t}`, String.raw`y(5)=50e\approx135.91`, "≈ 135.91"),
    calculation("A quantity decays by y'=-0.3y from y(0)=100. Find y(4).", String.raw`y=100e^{-0.3t}`, String.raw`y(4)=100e^{-1.2}\approx30.12`, "≈ 30.12"),
    calculation("For y'=ky, y(0)=20 and y(2)=80, find k.", String.raw`80=20e^{2k}\Rightarrow e^{2k}=4`, String.raw`k=\ln2`, String.raw`\ln2`),
  ],
  2019: [
    calculation("For P'=0.5P(1-P/100), find growth rate at P=20.", String.raw`P'=0.5(20)(1-0.2)`, String.raw`P'=8`, "8"),
    calculation("For carrying capacity 500, find the equilibrium populations.", String.raw`P'=rP\left(1-\frac{P}{500}\right)=0`, String.raw`P=0,500`),
    calculation("Evaluate P(t)=100/(1+9e⁻ᵗ) at t=0.", String.raw`P(0)=\frac{100}{1+9}`, String.raw`P(0)=10`, "10"),
  ],
  2020: [
    calculation("For x''+9x=0, find angular frequency and period.", String.raw`\omega=3,\quad T=\frac{2\pi}{3}`, String.raw`T=\frac{2\pi}{3}`),
    calculation("Evaluate x(t)=4cos(2t) at t=π/4.", String.raw`x\left(\frac\pi4\right)=4\cos\frac\pi2`, String.raw`x=0`, "0"),
    calculation("For x(t)=3sin(5t), find maximum displacement.", String.raw`|x(t)|\le3`, String.raw`A=3`, "3"),
  ],
  2021: [
    calculation("Evaluate Γ(5).", String.raw`\Gamma(5)=(5-1)!`, String.raw`\Gamma(5)=24`, "24"),
    calculation("Evaluate Γ(1/2).", String.raw`\Gamma\left(\frac12\right)`, String.raw`\sqrt\pi`, String.raw`\sqrt\pi`),
    calculation("Use Γ(z+1)=zΓ(z) to find Γ(7/2).", String.raw`\Gamma\left(\frac72\right)=\frac52\frac32\frac12\sqrt\pi`, String.raw`\frac{15\sqrt\pi}{8}`),
  ],
  2022: [
    calculation("Evaluate B(2,3).", String.raw`B(2,3)=\frac{\Gamma(2)\Gamma(3)}{\Gamma(5)}`, String.raw`B(2,3)=\frac1{12}`, String.raw`\frac1{12}`),
    calculation("Evaluate B(1,4) from its integral.", String.raw`B(1,4)=\int_0^1(1-t)^3dt`, String.raw`B(1,4)=\frac14`, String.raw`\frac14`),
    calculation("Use symmetry to compare B(3,5) and B(5,3).", String.raw`B(x,y)=B(y,x)`, String.raw`B(3,5)=B(5,3)`),
  ],
  2023: [
    calculation("Evaluate erf(0).", String.raw`\operatorname{erf}(0)=\frac2{\sqrt\pi}\int_0^0e^{-t^2}dt`, String.raw`0`, "0"),
    calculation("Use odd symmetry and erf(1)≈0.8427 to find erf(-1).", String.raw`\operatorname{erf}(-1)=-\operatorname{erf}(1)`, String.raw`\approx-0.8427`, "≈ -0.8427"),
    calculation("Find erfc(1) when erf(1)≈0.8427.", String.raw`\operatorname{erfc}(1)=1-0.8427`, String.raw`0.1573`, "0.1573"),
  ],
  2024: [
    calculation("Evaluate ζ(2).", String.raw`\zeta(2)=\sum_{n=1}^{\infty}\frac1{n^2}`, String.raw`\frac{\pi^2}{6}`),
    calculation("Evaluate ζ(0) by analytic continuation.", String.raw`\zeta(0)`, String.raw`-\frac12`, String.raw`-\frac12`),
    calculation("Approximate ζ(3) with its first four terms.", String.raw`1+\frac18+\frac1{27}+\frac1{64}`, String.raw`\approx1.17766`, "≈ 1.17766"),
  ],
  2025: [
    calculation("Evaluate the Bessel function J₀ at x=0.", String.raw`J_0(0)=\sum_{m=0}^{\infty}\frac{(-1)^m(0)^{2m}}{(m!)^2 2^{2m}}`, String.raw`J_0(0)=1`, "1"),
    calculation("Evaluate J₁(0).", String.raw`J_1(0)=0`, String.raw`0`, "0"),
    calculation("Use the first two terms to approximate J₀(1).", String.raw`J_0(1)\approx1-\frac{1^2}{4}+\frac{1^4}{64}`, String.raw`J_0(1)\approx0.765625`, "≈ 0.765625"),
  ],
  10002: [calculation("Write 7,45,32,106 in the international naming system.", String.raw`7,45,32,106=74,532,106`, String.raw`\text{seventy-four million five hundred thirty-two thousand one hundred six}`, "74,532,106")],
  10003: [
    calculation("Round 48,736 to the nearest thousand.", String.raw`48,736\xrightarrow{\text{nearest }1000}`, String.raw`49,000`, "49,000"),
    calculation("Estimate 398 × 51 by rounding to convenient tens.", String.raw`398\times51\approx400\times50`, String.raw`20,000`, "20,000"),
  ],
  10004: [
    calculation("A length rounds to 8.4 cm to the nearest 0.1 cm. State its error interval.", String.raw`8.4-0.05\le L<8.4+0.05`, String.raw`8.35\le L<8.45`),
    calculation("A mass is measured as 25 kg with maximum error 0.2 kg. Find its relative error bound.", String.raw`\frac{0.2}{25}`, String.raw`0.008=0.8\%`, "0.8%"),
  ],
  10006: [calculation("A pictograph key is 1 symbol = 4 books. What do 7 symbols represent?", String.raw`7\times4`, String.raw`28`, "28 books")],
  10007: [
    calculation("Build a bar graph for values 6, 9, and 4. Find the total bar height.", String.raw`6+9+4`, String.raw`19`, "19"),
    calculation("A bar represents 35 students at a scale of 1 cm = 5 students. Find its height.", String.raw`h=\frac{35}{5}`, String.raw`h=7\text{ cm}`, "7 cm"),
    calculation("Two bars have heights 12 and 8. Find their difference.", String.raw`12-8`, String.raw`4`, "4"),
  ],
  10008: [
    calculation("Survey responses are A, B, A, C, A, B. Build their frequencies.", String.raw`f(A)=3,\quad f(B)=2,\quad f(C)=1`, String.raw`N=6`),
    calculation("A survey has frequencies 14, 9, and 7. Find the sample size.", String.raw`N=14+9+7`, String.raw`N=30`, "30"),
    calculation("Out of 40 survey responses, 18 choose option X. Find its relative frequency.", String.raw`\frac{18}{40}`, String.raw`0.45`, "0.45"),
  ],
  10009: [
    calculation("A graph axis begins at 90 and a value rises from 94 to 98. Find the actual percentage rise.", String.raw`\frac{98-94}{94}\times100\%`, String.raw`\approx4.26\%`, "≈ 4.26%"),
    calculation("A pictogram uses one symbol for 10 but shows a half-symbol. Find its value.", String.raw`\frac12(10)`, String.raw`5`, "5"),
    calculation("A bar of value 60 is drawn twice as tall as a bar of value 40. Find the correct height ratio.", String.raw`\frac{60}{40}`, String.raw`1.5`, "1.5 : 1"),
  ],
  10011: [
    calculation("A shape pattern has 2, 5, 8, 11 tiles. Find the next number.", String.raw`d=3,\quad11+3`, String.raw`14`, "14"),
    calculation("A pattern has 1, 4, 9, 16 dots. Find the fifth figure's dots.", String.raw`a_n=n^2,\quad a_5=5^2`, String.raw`25`, "25"),
    calculation("A matchstick pattern uses 4, 7, 10 sticks. Find the 10th term.", String.raw`a_{10}=4+9(3)`, String.raw`31`, "31"),
  ],
  10012: [
    calculation("A rule machine multiplies by 3 then adds 2. Find the output for 5.", String.raw`3(5)+2`, String.raw`17`, "17"),
    calculation("A rule machine maps 2→7 and 5→16 using y = 3x + b. Find b.", String.raw`7=3(2)+b`, String.raw`b=1`, "1"),
  ],
  10015: [
    calculation("Divide 47 by 6 and find the remainder.", String.raw`47=6(7)+5`, String.raw`r=5`, "5"),
    calculation("Find the remainder when 3²⁰ is divided by 8.", String.raw`3^2\equiv1\pmod8\Rightarrow3^{20}=(3^2)^{10}`, String.raw`r=1`, "1"),
  ],
  10017: [calculation("Complete the ratio table 3 : 5 = 12 : x.", String.raw`\frac35=\frac{12}{x}\Rightarrow3x=60`, String.raw`x=20`, "20")],
  10018: [
    calculation("A ₹2,400 bill receives a 15% discount, then 5% tax. Find the final bill.", String.raw`B=2400(0.85)(1.05)`, String.raw`B=2142`, "₹2,142"),
    calculation("A ₹1,250 bill includes 18% tax. Find the pre-tax amount.", String.raw`P=\frac{1250}{1.18}`, String.raw`P\approx1059.32`, "≈ ₹1,059.32"),
  ],
  10019: [
    calculation("A marked price is ₹1,500 with 20% discount; cost price is ₹1,000. Find profit.", String.raw`SP=1500(0.8)=1200,\quad P=1200-1000`, String.raw`P=200`, "₹200"),
    calculation("An item costs ₹800 and sells at 10% loss. Find selling price.", String.raw`SP=800(1-0.10)`, String.raw`SP=720`, "₹720"),
  ],
  10020: [
    calculation("A household earns ₹45,000 and spends ₹12,000, ₹9,500, ₹6,000, and ₹4,500. Find savings.", String.raw`S=45000-(12000+9500+6000+4500)`, String.raw`S=13000`, "₹13,000"),
    calculation("A ₹30,000 budget allocates 35% to rent. Find the rent allocation.", String.raw`R=0.35(30000)`, String.raw`R=10500`, "₹10,500"),
  ],
  10021: [calculation("A map scale is 1 : 50,000. Convert 6 cm on the map to actual kilometres.", String.raw`d=6(50000)\text{ cm}=300000\text{ cm}`, String.raw`d=3\text{ km}`, "3 km")],
  10022: [
    calculation("Copy a line segment AB = 7.5 cm. What must the copied length CD be?", String.raw`CD=AB`, String.raw`CD=7.5\text{ cm}`, "7.5 cm"),
    calculation("A copied segment measures 6.02 cm while the original is 6.00 cm. Find the error.", String.raw`|6.02-6.00|`, String.raw`0.02\text{ cm}`, "0.02 cm"),
    calculation("Copy consecutive segments 4 cm and 3 cm on one ray. Find the total constructed length.", String.raw`4+3`, String.raw`7\text{ cm}`, "7 cm"),
  ],
  10023: [
    calculation("Copy a 68° angle. What should the constructed angle measure?", String.raw`m\angle PQR=68^\circ`, String.raw`68^\circ`),
    calculation("A copied angle is 91° instead of 90°. Find the construction error.", String.raw`|91^\circ-90^\circ|`, String.raw`1^\circ`),
    calculation("Copy a 42° angle twice adjacent to each other. Find the combined angle.", String.raw`42^\circ+42^\circ`, String.raw`84^\circ`),
  ],
  10024: [
    calculation("A segment has endpoints at x = 2 and x = 10. Locate its perpendicular bisector on the x-axis.", String.raw`x_M=\frac{2+10}{2}`, String.raw`x=6`, "x = 6"),
    calculation("A chord is 16 cm long and its perpendicular bisector cuts it in half. Find each half.", String.raw`\frac{16}{2}`, String.raw`8\text{ cm}`, "8 cm"),
  ],
  10025: [
    calculation("Bisect a 70° angle. Find each new angle.", String.raw`\frac{70^\circ}{2}`, String.raw`35^\circ`),
    calculation("An angle bisector divides 126° into two equal parts. Find one part.", String.raw`\frac{126^\circ}{2}`, String.raw`63^\circ`),
    calculation("One half of a bisected angle is 28°. Find the original angle.", String.raw`2(28^\circ)`, String.raw`56^\circ`),
  ],
  10027: [
    calculation("Construct a line through P parallel to a line making 35° with a transversal. Find the corresponding angle at P.", String.raw`\theta_P=35^\circ`, String.raw`35^\circ`),
    calculation("Parallel lines have alternate interior angle 72°. Find its partner angle.", String.raw`\theta'=72^\circ`, String.raw`72^\circ`),
    calculation("A same-side interior angle is 118° between parallel lines. Find the other.", String.raw`180^\circ-118^\circ`, String.raw`62^\circ`),
  ],
  10028: [
    calculation("Can sides 5 cm, 6 cm, and 8 cm form an SSS triangle?", String.raw`5+6>8,\quad5+8>6,\quad6+8>5`, String.raw`\text{triangle exists}`, "yes"),
    calculation("Construct an SSS triangle with sides 4, 4, and 6. Find its perimeter.", String.raw`P=4+4+6`, String.raw`P=14\text{ cm}`, "14 cm"),
  ],
  10029: [
    calculation("Construct a triangle with sides 5 cm and 7 cm including angle 60°. Find its area.", String.raw`A=\frac12(5)(7)\sin60^\circ`, String.raw`A=\frac{35\sqrt3}{4}\text{ cm}^2`, String.raw`\frac{35\sqrt3}{4}\text{ cm}^2`),
    calculation("Two SAS triangles have sides 4, 6 and included angle 90°. Find each area.", String.raw`A=\frac12(4)(6)\sin90^\circ`, String.raw`A=12`, "12 square units"),
    calculation("For sides 8 and 10 with included angle 30°, find the third side squared.", String.raw`c^2=8^2+10^2-2(8)(10)\cos30^\circ`, String.raw`c^2=164-80\sqrt3`),
  ],
  10030: [
    calculation("Construct a triangle with angles 50° and 60°. Find the third angle.", String.raw`180^\circ-50^\circ-60^\circ`, String.raw`70^\circ`),
    calculation("ASA data gives side 8 between angles 45° and 75°. Find the third angle.", String.raw`180^\circ-45^\circ-75^\circ`, String.raw`60^\circ`),
  ],
  10031: [
    calculation("Construct an RHS triangle with hypotenuse 10 cm and one leg 6 cm. Find the other leg.", String.raw`b=\sqrt{10^2-6^2}`, String.raw`b=8\text{ cm}`, "8 cm"),
    calculation("An RHS triangle has legs 5 and 12. Find its hypotenuse.", String.raw`c=\sqrt{5^2+12^2}`, String.raw`c=13`, "13"),
    calculation("Find the area of a right triangle with legs 9 and 12.", String.raw`A=\frac12(9)(12)`, String.raw`A=54`, "54"),
  ],
  10032: [
    calculation("A double bar graph shows boys 18 and girls 22. Find the difference.", String.raw`22-18`, String.raw`4`, "4"),
    calculation("Two bars for 2025 are 35 and 28; for 2026 they are 41 and 32. Find each annual total.", String.raw`T_{2025}=35+28=63,\quad T_{2026}=41+32`, String.raw`T_{2026}=73`, "63 and 73"),
    calculation("Category A rises from 24 to 30 between two bars. Find its percentage increase.", String.raw`\frac{30-24}{24}\times100\%`, String.raw`25\%`),
  ],
  10033: [
    calculation("For 2, 4, 4, 7, 8, find mean, median, and mode.", String.raw`\bar x=\frac{25}{5}=5,\quad\operatorname{median}=4`, String.raw`\operatorname{mode}=4`, "mean 5, median 4, mode 4"),
    calculation("For 3, 5, 7, 9, find mean and median.", String.raw`\bar x=\frac{24}{4}=6`, String.raw`\operatorname{median}=\frac{5+7}{2}=6`, "mean 6, median 6"),
  ],
  10034: [
    calculation("Find the range of 6, 9, 14, 21.", String.raw`R=21-6`, String.raw`R=15`, "15"),
    calculation("Datasets A and B have ranges 8 and 13. Which is more spread by range?", String.raw`13>8`, String.raw`R_B=13`, "dataset B"),
  ],
  10035: [
    calculation("A flowchart doubles x then subtracts 3. Find the output for x = 7.", String.raw`2(7)-3`, String.raw`11`, "11"),
    calculation("A decision flow sends x > 5 to x². Find the output for x = 8.", String.raw`8>5\Rightarrow8^2`, String.raw`64`, "64"),
    calculation("A loop adds 4 three times from 2. Find the final value.", String.raw`2+3(4)`, String.raw`14`, "14"),
  ],
  10036: [
    calculation("Encode A = 1, B = 2, C = 3. Find the sum encoding of CAB.", String.raw`C+A+B=3+1+2`, String.raw`6`, "6"),
    calculation("A binary pattern 1011 represents what decimal number?", String.raw`1(2^3)+0(2^2)+1(2^1)+1`, String.raw`11`, "11"),
    calculation("A repeating code is 2, 5, 8, 11. Find the 12th code value.", String.raw`a_{12}=2+11(3)`, String.raw`35`, "35"),
  ],
  10037: [
    calculation("A 3×3 magic square uses 1 through 9. Find its magic sum.", String.raw`M=\frac{1+2+\cdots+9}{3}`, String.raw`M=15`, "15"),
    calculation("Complete a magic-square row 8, 1, x with sum 15.", String.raw`8+1+x=15`, String.raw`x=6`, "6"),
    calculation("A 4×4 normal magic square uses 1 through 16. Find its magic sum.", String.raw`M=\frac{1+2+\cdots+16}{4}`, String.raw`M=34`, "34"),
  ],
  10038: [
    calculation("A route goes 3 km east and 4 km north. Find straight-line displacement.", String.raw`d=\sqrt{3^2+4^2}`, String.raw`d=5\text{ km}`, "5 km"),
    calculation("Route A is 6 + 8 km and route B is 5 + 7 km. Find the shorter route.", String.raw`L_A=14,\quad L_B=12`, String.raw`L_B<L_A`, "route B by 2 km"),
    calculation("A map route has scale 1 cm = 2 km and length 7.5 cm. Find actual distance.", String.raw`7.5(2)`, String.raw`15\text{ km}`, "15 km"),
  ],
  10039: [
    calculation("Complete a table where x = 1,2,3 and y = 2x + 1.", String.raw`y=3,5,7`, String.raw`(1,3),(2,5),(3,7)`),
    calculation("Table values are 4, 9, 16, 25 for n = 2,3,4,5. Find the rule.", String.raw`4=2^2,\ 9=3^2,\ 16=4^2,\ 25=5^2`, String.raw`a_n=n^2`),
  ],
  10043: [
    calculation("Magnify the interval from 1.41 to 1.42 by a factor of 100. Find its displayed width.", String.raw`(1.42-1.41)(100)`, String.raw`1`, "1 display unit"),
    calculation("Locate √2 ≈ 1.4142 after four decimal magnifications. State the approximation.", String.raw`1.4142<\sqrt2<1.4143`, String.raw`\sqrt2\approx1.4142`),
  ],
  10045: [
    calculation("Find the fourth root of 81.", String.raw`\sqrt[4]{81}=\sqrt[4]{3^4}`, String.raw`3`, "3"),
    calculation("Simplify the cube root of 216.", String.raw`\sqrt[3]{216}=\sqrt[3]{6^3}`, String.raw`6`, "6"),
  ],
  10047: [
    calculation("Divide x³ - 1 by x - 1.", String.raw`x^3-1=(x-1)(x^2+x+1)`, String.raw`x^2+x+1`),
    calculation("Divide 2x³ + 3x² - 5x + 6 by x + 2 and find the remainder.", String.raw`P(-2)=2(-8)+3(4)-5(-2)+6`, String.raw`P(-2)=12`, "remainder 12"),
  ],
  10048: [calculation("Find the remainder when P(x) = 2x³ - x + 5 is divided by x - 2.", String.raw`P(2)=2(2)^3-2+5`, String.raw`P(2)=19`, "19")],
  10051: [calculation("Expand (x + 2)³ using the cubic identity.", String.raw`(x+2)^3=x^3+3x^2(2)+3x(2)^2+2^3`, String.raw`x^3+6x^2+12x+8`)],
  10052: [
    calculation("Factor x² - 11x + 30.", String.raw`-5-6=-11,\quad(-5)(-6)=30`, String.raw`(x-5)(x-6)`),
    calculation("Factor 2x² + 7x + 3.", String.raw`2x^2+6x+x+3`, String.raw`(2x+1)(x+3)`),
  ],
  10053: [
    calculation("Using the axiom 'equals added to equals are equal', add 4 to both sides of 7 = 7.", String.raw`7+4=7+4`, String.raw`11=11`),
    calculation("A postulate gives one straight line through two points A(1,2) and B(4,6). Find its slope.", String.raw`m=\frac{6-2}{4-1}`, String.raw`m=\frac43`, String.raw`\frac43`),
    calculation("Use the whole-is-greater axiom on a segment of 12 cm containing a 5 cm part.", String.raw`12>5`, String.raw`\text{whole exceeds part by }7\text{ cm}`, "7 cm"),
  ],
  10054: [
    calculation("Two points (0,0) and (3,4) determine a straight segment. Find its length.", String.raw`d=\sqrt{3^2+4^2}`, String.raw`d=5`, "5"),
    calculation("Extend a 6 cm segment by 4 cm according to the second postulate. Find total length.", String.raw`6+4`, String.raw`10\text{ cm}`, "10 cm"),
    calculation("Draw a circle with centre O and radius 7 cm. Find its diameter.", String.raw`d=2r=2(7)`, String.raw`d=14\text{ cm}`, "14 cm"),
  ],
  10055: [
    calculation("A transversal makes interior angles 70° and 110°. Verify the fifth-postulate condition.", String.raw`70^\circ+110^\circ`, String.raw`180^\circ\Rightarrow\text{parallel}`),
    calculation("Interior angles on one side are 65° and 100°. Compare their sum with 180°.", String.raw`65^\circ+100^\circ`, String.raw`165^\circ<180^\circ`),
    calculation("Through a point outside a line, count the parallel lines in Euclidean geometry.", String.raw`n_{\parallel}=1`, String.raw`1`, "1"),
  ],
  10056: [
    calculation("Use the axiom a = b and b = 9 to determine a.", String.raw`a=b,\quad b=9`, String.raw`a=9`, "9"),
    calculation("Apply the theorem that triangle angles sum to 180° when two angles are 45° and 65°.", String.raw`C=180^\circ-45^\circ-65^\circ`, String.raw`C=70^\circ`),
    calculation("Use Pythagoras on legs 6 and 8 to find the theorem's hypotenuse result.", String.raw`c=\sqrt{6^2+8^2}`, String.raw`c=10`, "10"),
  ],
  10057: [
    calculation("Given x is even and x = 14, verify x² is even.", String.raw`14^2=196`, String.raw`196=2(98)`),
    calculation("For an implication x > 5 ⇒ x² > 25, test x = 7.", String.raw`7>5,\quad7^2=49`, String.raw`49>25`),
    calculation("Use a counterexample to reject 'all primes are odd'.", String.raw`2\text{ is prime}`, String.raw`2\text{ is even}`, "counterexample: 2"),
  ],
  10058: [calculation("One of two vertically opposite angles is 137°. Find the other.", String.raw`\theta'=137^\circ`, String.raw`137^\circ`)],
  10060: [
    calculation("Parallel lines are cut by a transversal; one corresponding angle is 58°. Find its partner.", String.raw`\theta_{\mathrm{corr}}=58^\circ`, String.raw`58^\circ`),
    calculation("A corresponding angle is 112°. Find the adjacent acute angle.", String.raw`180^\circ-112^\circ`, String.raw`68^\circ`),
    calculation("Corresponding angles are 3x + 5 and 5x - 35. Find x.", String.raw`3x+5=5x-35`, String.raw`x=20`, "20"),
  ],
  10061: [
    calculation("An alternate interior angle is 73°. Find its partner between parallel lines.", String.raw`\theta_{\mathrm{alt}}=73^\circ`, String.raw`73^\circ`),
    calculation("Alternate angles are 4x - 7 and 3x + 11. Find x.", String.raw`4x-7=3x+11`, String.raw`x=18`, "18"),
    calculation("An alternate interior obtuse angle is 124°. Find the related acute angle.", String.raw`180^\circ-124^\circ`, String.raw`56^\circ`),
  ],
  10062: [calculation("Same-side interior angles are 2x + 10 and 4x + 20. Find x.", String.raw`2x+10+4x+20=180`, String.raw`x=25`, "25")],
  10063: [
    calculation("Corresponding angles are both 64°. What does the converse imply about the two lines?", String.raw`64^\circ=64^\circ`, String.raw`\ell_1\parallel\ell_2`, "parallel"),
    calculation("Alternate interior angles are 3x and x + 40. Find x and infer parallelism.", String.raw`3x=x+40`, String.raw`x=20,\quad\ell_1\parallel\ell_2`),
    calculation("Same-side angles are 105° and 75°. Verify the converse condition.", String.raw`105^\circ+75^\circ`, String.raw`180^\circ\Rightarrow\ell_1\parallel\ell_2`),
  ],
  10066: [
    calculation("Two triangles have sides 5 and 8 with included angle 60°. Use SAS to compare their third sides.", String.raw`c^2=5^2+8^2-2(5)(8)\cos60^\circ`, String.raw`c=7`),
    calculation("SAS triangles have AB = DE = 6, AC = DF = 9, and included angles 45°. Find the corresponding side ratio.", String.raw`\frac{AB}{DE}=\frac69,\quad\frac{AC}{DF}=\frac99`, String.raw`AB:DE=AC:DF=1:1`),
    calculation("Two SAS-congruent triangles have one area 24 cm². Find the other's area.", String.raw`\triangle_1\cong\triangle_2\Rightarrow A_2=A_1`, String.raw`A_2=24\text{ cm}^2`, "24 cm²"),
  ],
  10067: [
    calculation("ASA data gives angles 50° and 70° with included side 8 cm. Find the third angle.", String.raw`180^\circ-50^\circ-70^\circ`, String.raw`60^\circ`),
    calculation("Two ASA-congruent triangles have corresponding side 11 cm. Find its matching side.", String.raw`s'=s`, String.raw`s'=11\text{ cm}`, "11 cm"),
    calculation("In ASA triangles, angles A = 42°, B = 68°. Find C in both triangles.", String.raw`C=180^\circ-42^\circ-68^\circ`, String.raw`C=70^\circ`),
  ],
  10068: [
    calculation("AAS data gives angles 35° and 85°. Find the third angle.", String.raw`180^\circ-35^\circ-85^\circ`, String.raw`60^\circ`),
    calculation("Two AAS-congruent triangles have perimeters 27 cm and P. Find P.", String.raw`P=27\text{ cm}`, String.raw`27\text{ cm}`),
    calculation("AAS-congruent triangles have corresponding angles 2x + 10 and 4x - 30. Find x.", String.raw`2x+10=4x-30`, String.raw`x=20`, "20"),
  ],
  10069: [
    calculation("Two triangles have side triples (5,7,9) and (5,7,9). Use SSS to find the perimeter of each.", String.raw`P=5+7+9`, String.raw`P=21`, "21"),
    calculation("SSS-congruent triangles have a corresponding side 3x + 1 and 16. Find x.", String.raw`3x+1=16`, String.raw`x=5`, "5"),
  ],
  10070: [
    calculation("Two right triangles have hypotenuse 13 and one leg 5. Find the other leg for the RHS check.", String.raw`b=\sqrt{13^2-5^2}`, String.raw`b=12`, "12"),
    calculation("RHS-congruent triangles have hypotenuse 10 and a leg 6. Find their common area.", String.raw`b=\sqrt{10^2-6^2}=8,\quad A=\frac12(6)(8)`, String.raw`A=24`, "24"),
    calculation("Corresponding legs in RHS triangles are 2x + 3 and 15. Find x.", String.raw`2x+3=15`, String.raw`x=6`, "6"),
  ],
  10071: [
    calculation("An isosceles triangle has equal sides 7 cm and base angles 55°. Find the vertex angle.", String.raw`180^\circ-2(55^\circ)`, String.raw`70^\circ`),
    calculation("Equal angles in a triangle are 48° each. Find the angle opposite the unequal side.", String.raw`180^\circ-48^\circ-48^\circ`, String.raw`84^\circ`),
    calculation("Two equal sides are 9 cm and the base is 12 cm. Find the perimeter.", String.raw`9+9+12`, String.raw`30\text{ cm}`, "30 cm"),
  ],
  10072: [
    calculation("Can lengths 4, 7, and 12 form a triangle?", String.raw`4+7=11<12`, String.raw`\text{no triangle}`, "no"),
    calculation("Find the integer range for third side x when the other sides are 6 and 10.", String.raw`|10-6|<x<10+6`, String.raw`4<x<16`),
  ],
  10073: [
    calculation("A parallelogram has adjacent sides 8 cm and 5 cm. Find its perimeter.", String.raw`P=2(8+5)`, String.raw`P=26\text{ cm}`, "26 cm"),
    calculation("One side is 3x + 2 and its opposite is 20. Find x.", String.raw`3x+2=20`, String.raw`x=6`, "6"),
    calculation("Opposite sides are 12 cm and 12 cm, 7 cm and 7 cm. Find total boundary length.", String.raw`12+12+7+7`, String.raw`38\text{ cm}`, "38 cm"),
  ],
  10074: [
    calculation("One angle of a parallelogram is 68°. Find the opposite angle.", String.raw`\angle C=\angle A`, String.raw`\angle C=68^\circ`),
    calculation("One angle is 112°. Find each adjacent angle.", String.raw`180^\circ-112^\circ`, String.raw`68^\circ`),
    calculation("Opposite angles are 4x + 5 and 6x - 25. Find x.", String.raw`4x+5=6x-25`, String.raw`x=15`, "15"),
  ],
  10075: [
    calculation("Diagonals of a parallelogram bisect each other. If AO = 6 cm, find AC.", String.raw`AC=2(AO)=2(6)`, String.raw`AC=12\text{ cm}`, "12 cm"),
    calculation("One diagonal has halves 3x - 1 and 14. Find x.", String.raw`3x-1=14`, String.raw`x=5`, "5"),
    calculation("Diagonal halves are 8 cm and 5 cm for the two diagonals. Find both full diagonals.", String.raw`d_1=2(8),\quad d_2=2(5)`, String.raw`d_1=16,\quad d_2=10`, "16 cm and 10 cm"),
  ],
  10076: [
    calculation("A quadrilateral has diagonals that bisect each other into lengths 5,5 and 7,7. Identify the condition.", String.raw`AO=OC=5,\quad BO=OD=7`, String.raw`\text{diagonals bisect each other}\Rightarrow\text{parallelogram}`),
    calculation("Opposite sides measure 8,8 and 11,11. Find the perimeter and infer the shape condition.", String.raw`P=8+8+11+11`, String.raw`P=38,\quad\text{opposite sides equal}`, "38"),
    calculation("One pair of opposite sides is equal and parallel, each 9 cm. State the parallelogram test numerically.", String.raw`AB=CD=9,\quad AB\parallel CD`, String.raw`ABCD\text{ is a parallelogram}`),
  ],
  10077: [
    calculation("In triangle ABC, D and E are midpoints of AB and AC. If BC = 14 cm, find DE.", String.raw`DE=\frac12BC`, String.raw`DE=7\text{ cm}`, "7 cm"),
    calculation("If the midpoint segment is 6.5 cm, find the parallel third side.", String.raw`BC=2(DE)=2(6.5)`, String.raw`BC=13\text{ cm}`, "13 cm"),
  ],
  10078: [
    calculation("A line through the midpoint of one side is parallel to a 16 cm side. Find the intercepted segment.", String.raw`DE=\frac12(16)`, String.raw`DE=8\text{ cm}`, "8 cm"),
    calculation("D is midpoint of AB with AD = DB = 5; DE ∥ BC and AC = 18. Find AE.", String.raw`AE=\frac12AC`, String.raw`AE=9`, "9"),
    calculation("AE = EC = 7 and D lies on AB with DE ∥ BC. Find AC and infer D's position.", String.raw`AC=7+7=14`, String.raw`AD=DB`, "AC = 14; D is midpoint"),
  ],
  10079: [calculation("Use Heron's formula for sides 5, 5, and 6.", String.raw`s=\frac{5+5+6}{2}=8,\quad A=\sqrt{8(3)(3)(2)}`, String.raw`A=12`, "12")],
  10080: [calculation("Find the semiperimeter of a triangle with sides 9, 12, and 15.", String.raw`s=\frac{9+12+15}{2}`, String.raw`s=18`, "18")],
  10081: [
    calculation("Find the area of triangle (0,0), (4,0), (0,3) using coordinates.", String.raw`A=\frac12|0(0-3)+4(3-0)+0(0-0)|`, String.raw`A=6`, "6"),
    calculation("For the same triangle, use Heron's formula with sides 3,4,5.", String.raw`s=6,\quad A=\sqrt{6(3)(2)(1)}`, String.raw`A=6`, "6"),
    calculation("Compare coordinate area 12.5 with Heron area 12.5. Find the difference.", String.raw`|12.5-12.5|`, String.raw`0`, "0"),
  ],
  10082: [
    calculation("A solid combines a cylinder r = 3, h = 5 and a hemisphere r = 3. Find volume.", String.raw`V=\pi(3)^2(5)+\frac23\pi(3)^3`, String.raw`V=63\pi`, String.raw`63\pi`),
    calculation("A toy combines a cone r = 3, h = 4 and a hemisphere r = 3. Find volume.", String.raw`V=\frac13\pi(3)^2(4)+\frac23\pi(3)^3`, String.raw`V=30\pi`, String.raw`30\pi`),
    calculation("A cube of side 6 has a hemisphere of radius 3 removed. Find remaining volume.", String.raw`V=6^3-\frac23\pi(3)^3`, String.raw`V=216-18\pi`, String.raw`216-18\pi`),
  ],
  10083: [
    calculation("Find the distance between (-2,3) and (4,11).", String.raw`d=\sqrt{(4+2)^2+(11-3)^2}`, String.raw`d=10`, "10"),
    calculation("Find the distance from (5,-7) to the origin.", String.raw`d=\sqrt{5^2+(-7)^2}`, String.raw`d=\sqrt{74}`, String.raw`\sqrt{74}`),
  ],
  10085: [
    calculation("Divide A(1,2) to B(7,8) internally in ratio 2:1.", String.raw`P=\left(\frac{2(7)+1(1)}3,\frac{2(8)+1(2)}3\right)`, String.raw`P=(5,6)`),
    calculation("Find the midpoint as the internal 1:1 division of (-4,6) and (2,10).", String.raw`P=\left(\frac{-4+2}{2},\frac{6+10}{2}\right)`, String.raw`P=(-1,8)`),
  ],
  10086: [
    calculation("Divide A(1,2) and B(5,6) externally in ratio 3:1.", String.raw`P=\left(\frac{3(5)-1(1)}{3-1},\frac{3(6)-1(2)}{3-1}\right)`, String.raw`P=(7,8)`),
    calculation("Find the external 2:1 division point of A(-1,3) and B(4,8).", String.raw`P=\left(\frac{2(4)-1(-1)}{1},\frac{2(8)-1(3)}{1}\right)`, String.raw`P=(9,13)`),
  ],
  10087: [calculation("Find the area of triangle (1,1), (5,1), (3,6).", String.raw`A=\frac12|1(1-6)+5(6-1)+3(1-1)|`, String.raw`A=10`, "10")],
  10088: [
    calculation("Test whether (1,2), (3,6), and (5,10) are collinear using area.", String.raw`A=\frac12|1(6-10)+3(10-2)+5(2-6)|`, String.raw`A=0\Rightarrow\text{collinear}`, "collinear"),
    calculation("Test (0,0), (2,3), and (4,5) for collinearity.", String.raw`A=\frac12|0+2(5)+4(-3)|`, String.raw`A=1\ne0`, "not collinear"),
  ],
  10089: [
    calculation("Equal chords AB and CD subtend angles 72° and x at the centre. Find x.", String.raw`AB=CD\Rightarrow x=72^\circ`, String.raw`x=72^\circ`),
    calculation("A chord subtends 100° at the centre. An equal chord subtends 4x + 8 degrees. Find x.", String.raw`4x+8=100`, String.raw`x=23`, "23"),
    calculation("Two equal chords subtend equal angles of 64°. Find their angle difference.", String.raw`64^\circ-64^\circ`, String.raw`0^\circ`),
  ],
  10090: [
    calculation("A radius 13 cm is perpendicular to a chord whose half-length is 5 cm. Find centre-to-chord distance.", String.raw`d=\sqrt{13^2-5^2}`, String.raw`d=12\text{ cm}`, "12 cm"),
    calculation("A chord is 16 cm and is 6 cm from the centre. Find the radius.", String.raw`r=\sqrt{8^2+6^2}`, String.raw`r=10\text{ cm}`, "10 cm"),
    calculation("A perpendicular from the centre bisects a 20 cm chord. Find each half.", String.raw`\frac{20}{2}`, String.raw`10\text{ cm}`, "10 cm"),
  ],
  10091: [
    calculation("An arc subtends 120° at the centre. Find the angle it subtends at the circumference.", String.raw`\theta=\frac12(120^\circ)`, String.raw`60^\circ`),
    calculation("An inscribed angle is 38°. Find the central angle over the same arc.", String.raw`\theta_c=2(38^\circ)`, String.raw`76^\circ`),
    calculation("A semicircular arc subtends 180° at the centre. Find its inscribed angle.", String.raw`\frac12(180^\circ)`, String.raw`90^\circ`),
  ],
  10093: [
    calculation("Two angles in the same segment stand on the same chord. If one is 47°, find the other.", String.raw`\theta_2=\theta_1`, String.raw`47^\circ`),
    calculation("Angles 3x + 5 and 5x - 25 lie in the same segment. Find x.", String.raw`3x+5=5x-25`, String.raw`x=15`, "15"),
    calculation("Same-segment angles are 68° each. Find their sum.", String.raw`68^\circ+68^\circ`, String.raw`136^\circ`),
  ],
  10094: [
    calculation("One angle of a cyclic quadrilateral is 112°. Find its opposite angle.", String.raw`180^\circ-112^\circ`, String.raw`68^\circ`),
    calculation("Opposite cyclic angles are 3x + 10 and 5x + 10. Find x.", String.raw`3x+10+5x+10=180`, String.raw`x=20`, "20"),
  ],
  10097: [
    calculation("From external point P, tangents PA and PB touch a circle. If PA = 9 cm, find PB.", String.raw`PA=PB`, String.raw`PB=9\text{ cm}`, "9 cm"),
    calculation("Tangent lengths are 3x + 2 and 5x - 10. Find x.", String.raw`3x+2=5x-10`, String.raw`x=6`, "6"),
    calculation("A tangent is 12 cm and centre distance is 13 cm. Find the radius.", String.raw`r=\sqrt{13^2-12^2}`, String.raw`r=5\text{ cm}`, "5 cm"),
  ],
  10098: [
    calculation("From 20 m away, the angle of elevation to a tower top is 45°. Find height.", String.raw`h=20\tan45^\circ`, String.raw`h=20\text{ m}`, "20 m"),
    calculation("A pole casts a 10 m line of sight at 30° elevation. Find vertical height.", String.raw`h=10\sin30^\circ`, String.raw`h=5\text{ m}`, "5 m"),
    calculation("A tower is 30 m high and viewed at 60° elevation. Find horizontal distance.", String.raw`d=\frac{30}{\tan60^\circ}`, String.raw`d=10\sqrt3\text{ m}`, String.raw`10\sqrt3\text{ m}`),
  ],
  10099: [
    calculation("From a 40 m cliff, angle of depression to a boat is 45°. Find horizontal distance.", String.raw`d=\frac{40}{\tan45^\circ}`, String.raw`d=40\text{ m}`, "40 m"),
    calculation("An observer 30 m high sees a point at 30° depression. Find horizontal distance.", String.raw`d=\frac{30}{\tan30^\circ}`, String.raw`d=30\sqrt3\text{ m}`, String.raw`30\sqrt3\text{ m}`),
    calculation("A building is 24 m high and horizontal distance is 24 m. Find angle of depression.", String.raw`\tan\theta=\frac{24}{24}=1`, String.raw`\theta=45^\circ`),
  ],
  10100: [
    calculation("A 6 m pole casts a 6√3 m shadow. Find the sun's elevation angle.", String.raw`\tan\theta=\frac{6}{6\sqrt3}=\frac1{\sqrt3}`, String.raw`\theta=30^\circ`),
    calculation("At 45° elevation, a tree casts a 12 m shadow. Find its height.", String.raw`h=12\tan45^\circ`, String.raw`h=12\text{ m}`, "12 m"),
    calculation("A 10 m tree casts a 10/√3 m shadow. Find elevation angle.", String.raw`\tan\theta=\frac{10}{\frac{10}{\sqrt3}}=\sqrt3`, String.raw`\theta=60^\circ`),
  ],
  10101: [
    calculation("Two observers 20 m apart view a tower on the same side at 45° and 30°. Find the nearer distance x.", String.raw`x\tan45^\circ=(x+20)\tan30^\circ`, String.raw`x=10(\sqrt3+1)\text{ m}`),
    calculation("Observers are 30 m apart; nearer angle is 60° and farther angle 30°. Find tower height.", String.raw`h=x\sqrt3=(x+30)\frac1{\sqrt3}`, String.raw`x=15,\quad h=15\sqrt3\text{ m}`, String.raw`15\sqrt3\text{ m}`),
    calculation("A tower is 24 m high. One observer sees 45° elevation. Find their distance from its base.", String.raw`d=\frac{24}{\tan45^\circ}`, String.raw`d=24\text{ m}`, "24 m"),
  ],
  10102: [
    calculation("Class midpoints 5, 15, 25 have frequencies 2, 3, 5. Find grouped mean directly.", String.raw`\bar x=\frac{2(5)+3(15)+5(25)}{2+3+5}`, String.raw`\bar x=18`, "18"),
    calculation("Midpoints 10, 20, 30 have frequencies 4, 2, 4. Find the direct mean.", String.raw`\bar x=\frac{4(10)+2(20)+4(30)}{10}`, String.raw`\bar x=20`, "20"),
    calculation("For Σfx = 840 and Σf = 35, find the grouped mean.", String.raw`\bar x=\frac{\sum fx}{\sum f}=\frac{840}{35}`, String.raw`\bar x=24`, "24"),
  ],
  10103: [
    calculation("With assumed mean A = 20, Σfd = 30, and Σf = 10, find the mean.", String.raw`\bar x=A+\frac{\sum fd}{\sum f}=20+\frac{30}{10}`, String.raw`\bar x=23`, "23"),
    calculation("Use A = 50, Σfd = -24, and Σf = 12.", String.raw`\bar x=50+\frac{-24}{12}`, String.raw`\bar x=48`, "48"),
    calculation("Midpoints 10, 20, 30 have frequencies 2, 5, 3. Use A = 20.", String.raw`\sum fd=2(-10)+5(0)+3(10)=10`, String.raw`\bar x=20+\frac{10}{10}=21`, "21"),
  ],
  10104: [
    calculation("Use A = 40, class width h = 10, Σfu = 8, and Σf = 20.", String.raw`\bar x=A+h\frac{\sum fu}{\sum f}=40+10\frac8{20}`, String.raw`\bar x=44`, "44"),
    calculation("Use A = 25, h = 5, Σfu = -6, and Σf = 15.", String.raw`\bar x=25+5\frac{-6}{15}`, String.raw`\bar x=23`, "23"),
    calculation("For A = 60, h = 20, and Σfu/Σf = 0.35, find the mean.", String.raw`\bar x=60+20(0.35)`, String.raw`\bar x=67`, "67"),
  ],
  10105: [
    calculation("Frequencies for classes up to 10, 20, 30 are 4, 7, 5. Find less-than cumulative frequencies.", String.raw`4,\quad4+7,\quad4+7+5`, String.raw`4,11,16`),
    calculation("Less-than cumulative counts are 6, 15, 23. Find the frequency of the third class.", String.raw`f_3=23-15`, String.raw`f_3=8`, "8"),
  ],
  10106: [
    calculation("Class frequencies are 3, 5, 7 from low to high. Find more-than cumulative frequencies.", String.raw`15,\quad15-3,\quad15-3-5`, String.raw`15,12,7`),
    calculation("More-than cumulative counts are 30, 22, 13. Find the second class frequency.", String.raw`f_2=22-13`, String.raw`f_2=9`, "9"),
  ],
  10107: [
    calculation("Plot a less-than ogive point when upper boundary is 20 and cumulative frequency is 14.", String.raw`P=(\text{upper boundary},F)`, String.raw`P=(20,14)`),
    calculation("Frequencies 5, 8, 7 give cumulative values for boundaries 10, 20, 30. List the ogive points.", String.raw`F=5,13,20`, String.raw`(10,5),(20,13),(30,20)`),
    calculation("A less-than ogive ends at (50, 40). Find sample size.", String.raw`N=F_{\mathrm{last}}`, String.raw`N=40`, "40"),
  ],
  10108: [
    calculation("Plot a more-than ogive point at lower boundary 10 with cumulative frequency 32.", String.raw`P=(\text{lower boundary},F)`, String.raw`P=(10,32)`),
    calculation("Frequencies 4, 6, 10 yield total 20. List more-than cumulative counts.", String.raw`20,\quad20-4,\quad20-4-6`, String.raw`20,16,10`),
    calculation("A more-than ogive drops from 50 to 38 between two boundaries. Find class frequency.", String.raw`f=50-38`, String.raw`f=12`, "12"),
  ],
  10110: [
    calculation("Find the volume of a frustum with R = 5, r = 2, h = 6.", String.raw`V=\frac13\pi(6)(5^2+5\cdot2+2^2)`, String.raw`V=78\pi`, String.raw`78\pi`),
    calculation("Find the curved surface area of a frustum with R = 6, r = 3, slant height 5.", String.raw`S=\pi(R+r)l=\pi(9)(5)`, String.raw`S=45\pi`, String.raw`45\pi`),
  ],
  10111: [
    calculation("A cylinder r = 2, h = 6 is topped by a hemisphere r = 2. Find volume.", String.raw`V=\pi(2)^2(6)+\frac23\pi(2)^3`, String.raw`V=\frac{88\pi}{3}`, String.raw`\frac{88\pi}{3}`),
    calculation("A cone r = 3, h = 4 sits on a cylinder r = 3, h = 5. Find volume.", String.raw`V=\frac13\pi(3)^2(4)+\pi(3)^2(5)`, String.raw`V=57\pi`, String.raw`57\pi`),
    calculation("A cube of side 4 is attached to a cylinder r = 2, h = 3. Find total volume.", String.raw`V=4^3+\pi(2)^2(3)`, String.raw`V=64+12\pi`, String.raw`64+12\pi`),
  ],
  10112: [
    calculation("For A = {1,2}, list the identity relation.", String.raw`I_A=\{(a,a):a\in A\}`, String.raw`I_A=\{(1,1),(2,2)\}`),
    calculation("For R = {(1,2),(2,1)}, test symmetry.", String.raw`(1,2)\in R\Rightarrow(2,1)\in R`, String.raw`R\text{ is symmetric}`),
    calculation("For R = {(1,2),(2,3),(1,3)}, test the shown transitive chain.", String.raw`(1,2),(2,3)\in R\Rightarrow(1,3)\in R`, String.raw`\text{chain is transitive}`),
  ],
  10113: [
    calculation("Is R = {(1,1),(2,2),(3,3),(1,2)} reflexive on {1,2,3}?", String.raw`(1,1),(2,2),(3,3)\in R`, String.raw`R\text{ is reflexive}`),
    calculation("Add missing pairs to make R = {(1,1)} reflexive on {1,2,3}.", String.raw`I_A=\{(1,1),(2,2),(3,3)\}`, String.raw`\text{add }(2,2),(3,3)`),
  ],
  10114: [
    calculation("Is R = {(1,2),(2,1),(2,3),(3,2)} symmetric?", String.raw`R^{-1}=R`, String.raw`R\text{ is symmetric}`),
    calculation("For R = {(1,3)}, add the pair needed for symmetry.", String.raw`(1,3)\Rightarrow(3,1)`, String.raw`\text{add }(3,1)`),
  ],
  10115: [
    calculation("For R = {(1,2),(2,3)}, identify the pair needed for transitivity.", String.raw`(1,2),(2,3)\Rightarrow(1,3)`, String.raw`\text{add }(1,3)`),
    calculation("Test transitivity of ≤ on {1,2,3} using 1 ≤ 2 and 2 ≤ 3.", String.raw`1\le2\land2\le3`, String.raw`1\le3`),
    calculation("R contains (2,4), (4,8), and (2,8). Verify this chain.", String.raw`(2,4)\circ(4,8)=(2,8)`, String.raw`\text{transitive chain holds}`),
  ],
  10116: [
    calculation("Show congruence modulo 3 groups 1 and 4 together.", String.raw`4-1=3=3(1)`, String.raw`1\equiv4\pmod3`),
    calculation("For equality on {1,2}, list its equivalence classes.", String.raw`[1]=\{1\},\quad[2]=\{2\}`, String.raw`\{\{1\},\{2\}\}`),
    calculation("Modulo 2 on {0,1,2,3}, list the two classes.", String.raw`[0]=\{0,2\},\quad[1]=\{1,3\}`, String.raw`\{\{0,2\},\{1,3\}\}`),
  ],
  10117: [
    calculation("For f(x)=2x+1, compare f(2) and f(5) to demonstrate one-one behavior.", String.raw`f(2)=5,\quad f(5)=11`, String.raw`5\ne11`),
    calculation("Solve f(a)=f(b) for f(x)=3x-4.", String.raw`3a-4=3b-4`, String.raw`a=b`),
  ],
  10118: [
    calculation("For f(x)=x², show two inputs with the same output.", String.raw`f(2)=2^2=4,\quad f(-2)=(-2)^2=4`, String.raw`f(2)=f(-2)`),
    calculation("For f(x)=|x|, compare inputs -5 and 5.", String.raw`f(-5)=5,\quad f(5)=5`, String.raw`f(-5)=f(5)`),
  ],
  10119: [
    calculation("Map f:{1,2}→{1,2,3} by f(x)=x. Count unused codomain elements.", String.raw`\operatorname{range}(f)=\{1,2\}`, String.raw`|\{3\}|=1`, "1"),
    calculation("For f(x)=x² from {-2,-1,0,1,2} to {0,1,2,3,4}, find the unused outputs.", String.raw`\operatorname{range}=\{0,1,4\}`, String.raw`\text{unused}=\{2,3\}`),
    calculation("A function has codomain size 6 and range size 4. How many codomain values are missed?", String.raw`6-4`, String.raw`2`, "2"),
  ],
  10120: [
    calculation("For f:{1,2,3}→{2,4,6}, f(x)=2x, list the range.", String.raw`f(1)=2,\ f(2)=4,\ f(3)=6`, String.raw`\operatorname{range}=\{2,4,6\}`),
    calculation("For f(x)=x-1 from {1,2,3,4} to {0,1,2,3}, count preimages of codomain values.", String.raw`0\leftarrow1,\ 1\leftarrow2,\ 2\leftarrow3,\ 3\leftarrow4`, String.raw`\text{each has one preimage}`),
    calculation("A finite function maps 5 domain elements onto a 5-element codomain one-to-one. Find range size.", String.raw`|\operatorname{range}|=|\operatorname{codomain}|`, String.raw`5`, "5"),
  ],
  10121: [
    calculation("Let f(x)=2x+1 and g(x)=x². Find (f∘g)(3).", String.raw`g(3)=9,\quad f(9)=19`, String.raw`(f\circ g)(3)=19`, "19"),
    calculation("For the same functions, find (g∘f)(2).", String.raw`f(2)=5,\quad g(5)=25`, String.raw`(g\circ f)(2)=25`, "25"),
  ],
  10122: [
    calculation("Find the inverse of f(x)=3x-5.", String.raw`y=3x-5\Rightarrow x=\frac{y+5}{3}`, String.raw`f^{-1}(x)=\frac{x+5}{3}`),
    calculation("Verify the inverse of f(x)=2x+4 at x=10.", String.raw`f^{-1}(10)=\frac{10-4}{2}=3`, String.raw`f(3)=10`),
    calculation("Find f⁻¹(17) for f(x)=4x+1.", String.raw`f^{-1}(17)=\frac{17-1}{4}`, String.raw`4`, "4"),
  ],
  10123: [
    calculation("Define a*b = a + b + 1. Find 3*5.", String.raw`3*5=3+5+1`, String.raw`9`, "9"),
    calculation("For a*b = ab - 2, find 4*6.", String.raw`4*6=4(6)-2`, String.raw`22`, "22"),
    calculation("For a*b = a - b, compare 7*2 and 2*7.", String.raw`7*2=5,\quad2*7=-5`, String.raw`7*2\ne2*7`),
  ],
  10124: [
    calculation("Find the range value of sin x at x = π/2.", String.raw`\sin\frac\pi2`, String.raw`1`, "1"),
    calculation("Is x = π/2 in the domain of tan x?", String.raw`\cos\frac\pi2=0`, String.raw`\tan\frac\pi2\text{ is undefined}`, "undefined"),
  ],
  10125: [
    calculation("For y = 2 sin x, find amplitude and y at x = π/2.", String.raw`A=2,\quad y=2\sin\frac\pi2`, String.raw`A=2,\quad y=2`),
    calculation("For y = cos(x - π/3), find the horizontal shift.", String.raw`x\mapsto x-\frac\pi3`, String.raw`\text{shift right }\frac\pi3`, String.raw`\frac\pi3\text{ right}`),
  ],
  10126: [
    calculation("Solve sin x = 1/2 in general form.", String.raw`x=\frac\pi6+2n\pi\quad\text{or}\quad x=\frac{5\pi}{6}+2n\pi`, String.raw`n\in\mathbb Z`),
    calculation("Solve cos x = 0 in general form.", String.raw`x=\frac\pi2+n\pi`, String.raw`n\in\mathbb Z`),
  ],
  10127: [
    calculation("Find principal solutions of sin x = √3/2 on [0, 2π).", String.raw`x=\frac\pi3,\quad\pi-\frac\pi3`, String.raw`x=\frac\pi3,\frac{2\pi}{3}`),
    calculation("Find principal solutions of tan x = 1 on [0, 2π).", String.raw`x=\frac\pi4+n\pi`, String.raw`x=\frac\pi4,\frac{5\pi}{4}`),
  ],
  10128: [calculation("For P(n): 1 + 3 + … + (2n - 1) = n², verify the base case n = 1.", String.raw`LHS=1,\quad RHS=1^2`, String.raw`1=1`)],
  10131: [calculation("Verify the induction claim 7 divides 8ⁿ - 1 for n = 3.", String.raw`8^3-1=512-1`, String.raw`511=7(73)`)],
  10132: [
    calculation("Verify 2ⁿ ≥ n + 1 for n = 4.", String.raw`2^4=16,\quad4+1=5`, String.raw`16\ge5`),
    calculation("Assume 2ᵏ ≥ k + 1. Show the numerical step from k = 5 to 6.", String.raw`2^6=2(2^5)=64`, String.raw`64\ge7`),
    calculation("Verify n! ≥ 2ⁿ⁻¹ for n = 5.", String.raw`5!=120,\quad2^{4}=16`, String.raw`120\ge16`),
  ],
  10133: [calculation("Use strong induction data F₁ = 1, F₂ = 1 to calculate F₃.", String.raw`F_3=F_2+F_1`, String.raw`F_3=2`, "2")],
  10134: [
    calculation("Expand (x + 2)⁴.", String.raw`\sum_{r=0}^4\binom4r x^{4-r}2^r`, String.raw`x^4+8x^3+24x^2+32x+16`),
    calculation("Expand (2x - 1)³.", String.raw`(2x)^3-3(2x)^2+3(2x)-1`, String.raw`8x^3-12x^2+6x-1`),
  ],
  10136: [calculation("Find the middle term of (x + 2)⁶.", String.raw`T_4=\binom63x^3(2)^3`, String.raw`T_4=160x^3`, String.raw`160x^3`)],
  10140: [
    calculation("Interpret C(6,2) as choosing 2 students from 6 and evaluate.", String.raw`\binom62=\frac{6!}{2!4!}`, String.raw`15`, "15"),
    calculation("Count 3-element subsets of a 7-element set.", String.raw`\binom73`, String.raw`35`, "35"),
    calculation("Use C(5,2)=C(5,3) and evaluate both sides.", String.raw`\binom52=10,\quad\binom53=10`, String.raw`10=10`),
  ],
  10141: [calculation("For y² = 16x, find the focal length and focus.", String.raw`4a=16\Rightarrow a=4`, String.raw`F=(4,0)`)],
  10142: [
    calculation("A parabola has focus (3,0) and directrix x = -3. Find its equation.", String.raw`a=3\Rightarrow y^2=4ax`, String.raw`y^2=12x`),
    calculation("Check that point (3,6) is equidistant from focus (3,0) and directrix x = -3.", String.raw`PF=6,\quad d(P,x=-3)=|3+3|`, String.raw`6=6`),
  ],
  10143: [calculation("For x²/25 + y²/9 = 1, find the semi-axes and c.", String.raw`a=5,\quad b=3,\quad c=\sqrt{25-9}`, String.raw`c=4`, "a = 5, b = 3, c = 4")],
  10144: [
    calculation("For x²/16 - y²/9 = 1, find a, b, and c.", String.raw`a=4,\quad b=3,\quad c=\sqrt{16+9}`, String.raw`c=5`, "a = 4, b = 3, c = 5"),
    calculation("Find the asymptotes of x²/25 - y²/4 = 1.", String.raw`y=\pm\frac ba x=\pm\frac25x`, String.raw`y=\pm\frac25x`),
  ],
  10146: [
    calculation("For parabola y² = 4ax with a = 2, find the parametric point at t = 3.", String.raw`P=(at^2,2at)=(2\cdot9,4\cdot3)`, String.raw`P=(18,12)`),
    calculation("For circle x = 5 cos t, y = 5 sin t, find the point at t = π/2.", String.raw`x=5\cos\frac\pi2=0,\quad y=5\sin\frac\pi2=5`, String.raw`P=(0,5)`),
  ],
  10147: [
    calculation("Find the tangent to y² = 8x at parameter t = 2.", String.raw`a=2,\quad ty=x+at^2`, String.raw`2y=x+8`),
    calculation("Find the tangent to y² = 4x at point (1,2).", String.raw`yy_1=2a(x+x_1),\quad2y=2(x+1)`, String.raw`y=x+1`),
  ],
  10148: [
    calculation("Find the normal to y² = 4x at parameter t = 1.", String.raw`y=-tx+2at+at^3,\quad a=1`, String.raw`y=-x+3`),
    calculation("For y² = 8x, find the normal at t = 2.", String.raw`a=2,\quad y=-2x+2(2)(2)+2(8)`, String.raw`y=-2x+24`),
  ],
  10149: [
    calculation("Find the tangent to x²/25 + y²/9 = 1 at (4, 9/5).", String.raw`\frac{4x}{25}+\frac{\left(\frac95\right)y}{9}=1`, String.raw`\frac{4x}{25}+\frac y5=1`),
    calculation("Find the tangent to x²/16 + y²/9 = 1 at (4,0).", String.raw`\frac{4x}{16}+0=1`, String.raw`x=4`),
  ],
  10150: [
    calculation("Find the tangent to x²/9 - y²/16 = 1 at (3,0).", String.raw`\frac{3x}{9}-0=1`, String.raw`x=3`),
    calculation("For x²/4 - y²/5 = 1, write the tangent at (x₁,y₁).", String.raw`\frac{xx_1}{4}-\frac{yy_1}{5}`, String.raw`\frac{xx_1}{4}-\frac{yy_1}{5}=1`),
  ],
  10151: [calculation("Identify the conic 9x² + 16y² = 144 and write standard form.", String.raw`\frac{x^2}{16}+\frac{y^2}{9}=1`, String.raw`\text{ellipse}`)],
  10165: [
    calculation("For f(x)=|x|/x, find the left- and right-hand limits at 0.", String.raw`\lim_{x\to0^-}f(x)=-1,\quad\lim_{x\to0^+}f(x)=1`, String.raw`-1\ne1`),
    calculation("For f(x)=x², find both one-sided limits at x=3.", String.raw`\lim_{x\to3^-}x^2=9,\quad\lim_{x\to3^+}x^2=9`, String.raw`\lim_{x\to3}x^2=9`, "9"),
    calculation("For f(x)=1/(x-2), describe the one-sided limits at 2.", String.raw`\lim_{x\to2^-}\frac1{x-2}=-\infty,\quad\lim_{x\to2^+}\frac1{x-2}=+\infty`, String.raw`\text{two-sided limit does not exist}`),
  ],
  10166: [
    calculation("Check continuity of f(x)=x²+1 at x=2.", String.raw`\lim_{x\to2}f(x)=5,\quad f(2)=5`, String.raw`\lim_{x\to2}f(x)=f(2)`),
    calculation("Let f(x)=(x²-1)/(x-1) for x≠1 and f(1)=2. Check continuity.", String.raw`\lim_{x\to1}(x+1)=2`, String.raw`\lim_{x\to1}f(x)=f(1)=2`),
    calculation("Find k for continuity at 0 when f(x)=kx+3 for x≤0 and x²+k for x>0.", String.raw`3=k`, String.raw`k=3`, "3"),
  ],
  10167: [
    calculation("Is f(x)=1/(x-2) continuous on [0,4]?", String.raw`2\in[0,4]\text{ and denominator}=0`, String.raw`\text{not continuous}`),
    calculation("Check f(x)=√x on [0,9].", String.raw`x\ge0\text{ on }[0,9]`, String.raw`f\text{ is continuous on }[0,9]`),
    calculation("Find where f(x)=(x+1)/(x-3) is continuous in [-2,5].", String.raw`x\ne3`, String.raw`[-2,3)\cup(3,5]`),
  ],
  10168: [
    calculation("Remove the discontinuity of (x²-4)/(x-2) at x=2 by defining f(2).", String.raw`\frac{(x-2)(x+2)}{x-2}=x+2`, String.raw`f(2)=4`, "4"),
    calculation("Find the hole value for (x²-9)/(x-3) at x=3.", String.raw`\lim_{x\to3}(x+3)`, String.raw`6`, "6"),
    calculation("For (x²+x-6)/(x-2), locate the removable discontinuity and its y-value.", String.raw`\frac{(x+3)(x-2)}{x-2}=x+3`, String.raw`(2,5)`),
  ],
  10169: [
    calculation("For f(x)=1 when x<0 and 3 when x≥0, find the jump size at 0.", String.raw`J=3-1`, String.raw`J=2`, "2"),
    calculation("A piecewise function has left limit -2 and right limit 5. Find jump size.", String.raw`J=5-(-2)`, String.raw`J=7`, "7"),
    calculation("At x=4, one-sided limits are 6 and 6. Does a jump occur?", String.raw`6-6=0`, String.raw`\text{no jump}`),
  ],
  10170: [
    calculation("Locate the infinite discontinuity of f(x)=1/(x-5).", String.raw`x-5=0`, String.raw`x=5`, "5"),
    calculation("Find the vertical asymptotes of 1/(x²-9).", String.raw`x^2-9=(x-3)(x+3)=0`, String.raw`x=\pm3`),
    calculation("Evaluate the right-hand behavior of 2/x at x=0.", String.raw`\lim_{x\to0^+}\frac2x`, String.raw`+\infty`),
  ],
  10171: [
    calculation("Show f(x)=|x| is continuous but not differentiable at 0.", String.raw`\lim_{x\to0}|x|=0=f(0),\quad f'_-(0)=-1,\ f'_+(0)=1`, String.raw`f'_-(0)\ne f'_+(0)`),
    calculation("For f(x)=x², compare one-sided derivatives at 0.", String.raw`f'(x)=2x`, String.raw`f'_-(0)=f'_+(0)=0`),
    calculation("A function has left derivative 2 and right derivative 5 at x=1. Is it differentiable there?", String.raw`2\ne5`, String.raw`\text{not differentiable}`),
  ],
  10172: [
    calculation("Apply Rolle's theorem to f(x)=x²-4x+3 on [1,3]. Find c.", String.raw`f'(x)=2x-4=0`, String.raw`c=2`, "2"),
    calculation("For f(x)=sin x on [0,π], find c where f'(c)=0.", String.raw`f'(x)=\cos x=0`, String.raw`c=\frac\pi2`, String.raw`\frac\pi2`),
  ],
  10173: [
    calculation("Apply Lagrange MVT to f(x)=x² on [1,3]. Find c.", String.raw`\frac{f(3)-f(1)}{3-1}=4,\quad f'(c)=2c`, String.raw`c=2`, "2"),
    calculation("Apply MVT to f(x)=x³ on [0,2].", String.raw`\frac{8-0}{2}=4,\quad3c^2=4`, String.raw`c=\frac2{\sqrt3}`, String.raw`\frac2{\sqrt3}`),
    calculation("For f(x)=2x+5 on [1,6], find the MVT value of f'(c).", String.raw`\frac{17-7}{6-1}`, String.raw`f'(c)=2`, "2"),
  ],
  10174: [
    calculation("Position is s(t)=3t²+2t. Find velocity at t=4.", String.raw`v(t)=s'(t)=6t+2`, String.raw`v(4)=26`, "26"),
    calculation("A circle radius grows at 2 centimetres per second. Find area rate when r=5 cm.", String.raw`\frac{dA}{dt}=2\pi r\frac{dr}{dt}`, String.raw`\frac{dA}{dt}=20\pi\ \mathrm{cm^2\,s^{-1}}`, String.raw`20\pi\ \mathrm{cm^2\,s^{-1}}`),
    calculation("Temperature T(t)=80-3t changes with time. Find its rate.", String.raw`\frac{dT}{dt}=-3`, String.raw`-3\text{ degrees per unit time}`),
  ],
  10175: [
    calculation("Find tangent and normal slopes to y=x² at x=2.", String.raw`m_t=2x=4,\quad m_n=-\frac14`, String.raw`m_t=4,\quad m_n=-\frac14`),
    calculation("Find the tangent to y=x³ at (1,1).", String.raw`m=3(1)^2=3,\quad y-1=3(x-1)`, String.raw`y=3x-2`),
    calculation("Find the normal to y=2x+5 through (1,7).", String.raw`m_n=-\frac12,\quad y-7=-\frac12(x-1)`, String.raw`y=-\frac12x+\frac{15}{2}`),
  ],
  10176: [
    calculation("Find where f(x)=x²-4x is increasing or decreasing.", String.raw`f'(x)=2x-4`, String.raw`f\downarrow\text{ on }(-\infty,2),\quad f\uparrow\text{ on }(2,\infty)`),
    calculation("For f(x)=x³, determine the sign of f'(x).", String.raw`f'(x)=3x^2\ge0`, String.raw`f\text{ is increasing on }\mathbb R`),
    calculation("For f(x)=-x², determine monotonicity around 0.", String.raw`f'(x)=-2x`, String.raw`f\uparrow\text{ for }x<0,\quad f\downarrow\text{ for }x>0`),
  ],
  10177: [
    calculation("Find the local extremum of f(x)=x²-6x+5.", String.raw`f'(x)=2x-6=0\Rightarrow x=3`, String.raw`f(3)=-4\text{ is a local minimum}`),
    calculation("Find the local extremum of f(x)=-x²+4x+1.", String.raw`f'(x)=-2x+4=0\Rightarrow x=2`, String.raw`f(2)=5\text{ is a local maximum}`),
    calculation("For f(x)=x³-3x, find critical points.", String.raw`f'(x)=3x^2-3=0`, String.raw`x=\pm1`),
  ],
  10178: [
    calculation("Find absolute extrema of f(x)=x² on [-2,3].", String.raw`f(-2)=4,\quad f(0)=0,\quad f(3)=9`, String.raw`f_{\min}=0,\quad f_{\max}=9`),
    calculation("Find absolute extrema of f(x)=2x+1 on [1,5].", String.raw`f(1)=3,\quad f(5)=11`, String.raw`f_{\min}=3,\quad f_{\max}=11`),
    calculation("For f(x)=x³-3x on [-2,2], compare endpoints and critical points ±1.", String.raw`f(-2)=-2,\ f(-1)=2,\ f(1)=-2,\ f(2)=2`, String.raw`f_{\min}=-2,\quad f_{\max}=2`),
  ],
  10179: [
    calculation("Approximate √4.1 using differentials at x=4.", String.raw`dy=\frac1{2\sqrt4}(0.1)=0.025`, String.raw`\sqrt{4.1}\approx2.025`),
    calculation("Approximate (1.02)³ using f(x)=x³ near 1.", String.raw`dy=3(1)^2(0.02)=0.06`, String.raw`(1.02)^3\approx1.06`),
    calculation("Estimate the change in circle area when r changes from 10 to 10.1.", String.raw`dA=2\pi r\,dr=2\pi(10)(0.1)`, String.raw`dA=2\pi`, String.raw`2\pi`),
  ],
  10180: [
    calculation("Evaluate ∫ 2x(x²+1)³ dx by substitution.", String.raw`u=x^2+1,\quad du=2x\,dx`, String.raw`\int u^3du=\frac{(x^2+1)^4}{4}+C`),
    calculation("Evaluate ∫₀¹ 3x² e^(x³) dx.", String.raw`u=x^3,\quad du=3x^2dx`, String.raw`[e^u]_0^1=e-1`),
    calculation("Evaluate ∫ cos(2x) dx.", String.raw`u=2x,\quad du=2dx`, String.raw`\frac12\sin(2x)+C`),
  ],
  10181: [
    calculation("Evaluate ∫ x eˣ dx.", String.raw`u=x,\ dv=e^xdx\Rightarrow du=dx,\ v=e^x`, String.raw`e^x(x-1)+C`),
    calculation("Evaluate ∫₀^π x cos x dx.", String.raw`[x\sin x+\cos x]_0^\pi`, String.raw`-2`, "-2"),
    calculation("Evaluate ∫₀¹ x dx using integration by parts with v=x.", String.raw`\int_0^1x\,dx=[x^2]_0^1-\int_0^1x\,dx`, String.raw`\int_0^1x\,dx=\frac12`, String.raw`\frac12`),
  ],
  10182: [
    calculation("Evaluate ∫ 1/(x²-1) dx using partial fractions.", String.raw`\frac1{x^2-1}=\frac12\left(\frac1{x-1}-\frac1{x+1}\right)`, String.raw`\frac12\ln\left|\frac{x-1}{x+1}\right|+C`),
    calculation("Evaluate ∫ 3/((x+1)(x+2)) dx.", String.raw`\frac3{(x+1)(x+2)}=\frac3{x+1}-\frac3{x+2}`, String.raw`3\ln\left|\frac{x+1}{x+2}\right|+C`),
    calculation("Decompose (2x+3)/(x²+3x+2).", String.raw`\frac{2x+3}{(x+1)(x+2)}=\frac1{x+1}+\frac1{x+2}`, String.raw`\frac1{x+1}+\frac1{x+2}`),
  ],
  10183: [
    calculation("Given ∫₀³ f(x)dx = 7, find ∫₃⁰ f(x)dx.", String.raw`\int_3^0f(x)dx=-\int_0^3f(x)dx`, String.raw`-7`, "-7"),
    calculation("If ∫₀² f = 5 and ∫₂⁵ f = 8, find ∫₀⁵ f.", String.raw`\int_0^5f=\int_0^2f+\int_2^5f`, String.raw`13`, "13"),
    calculation("Evaluate ∫₋₂² x³ dx using symmetry.", String.raw`x^3\text{ is odd}`, String.raw`0`, "0"),
  ],
  10184: [
    calculation("Find area under y=x from x=0 to x=4.", String.raw`A=\int_0^4x\,dx`, String.raw`A=\left[\frac{x^2}{2}\right]_0^4=8`, "8"),
    calculation("Find area under y=x² from 0 to 3.", String.raw`A=\int_0^3x^2dx`, String.raw`A=\left[\frac{x^3}{3}\right]_0^3=9`, "9"),
    calculation("Find area under y=5 from x=1 to x=6.", String.raw`A=\int_1^65\,dx`, String.raw`A=25`, "25"),
  ],
  10185: [
    calculation("Find area between y=2x and y=x on [0,3].", String.raw`A=\int_0^3(2x-x)dx`, String.raw`A=\frac92`, String.raw`\frac92`),
    calculation("Find area between y=4 and y=x² on [-2,2].", String.raw`A=\int_{-2}^{2}(4-x^2)dx`, String.raw`A=\frac{32}{3}`, String.raw`\frac{32}{3}`),
    calculation("Find area between y=x+2 and y=x on [1,5].", String.raw`A=\int_1^52\,dx`, String.raw`A=8`, "8"),
  ],
  10186: [
    calculation("Form a differential equation from y = Ae²ˣ by eliminating A.", String.raw`\frac{dy}{dx}=2Ae^{2x}`, String.raw`\frac{dy}{dx}=2y`),
    calculation("Eliminate constants from y = mx + c.", String.raw`\frac{dy}{dx}=m,\quad\frac{d^2y}{dx^2}=0`, String.raw`\frac{d^2y}{dx^2}=0`),
    calculation("Form the differential equation for circles x²+y²=a².", String.raw`2x+2y\frac{dy}{dx}=0`, String.raw`x+y\frac{dy}{dx}=0`),
  ],
  10187: [
    calculation("Find order and degree of (d²y/dx²)³ + dy/dx = 0.", String.raw`\text{highest derivative}=\frac{d^2y}{dx^2}`, String.raw`\text{order}=2,\quad\text{degree}=3`),
    calculation("Find order and degree of d³y/dx³ + 4y = 0.", String.raw`\left(\frac{d^3y}{dx^3}\right)^1`, String.raw`\text{order}=3,\quad\text{degree}=1`),
    calculation("Find order and degree of (dy/dx)² = 9x.", String.raw`\left(\frac{dy}{dx}\right)^2`, String.raw`\text{order}=1,\quad\text{degree}=2`),
  ],
  10188: [
    calculation("Solve dy/dx = 3x²y by separation.", String.raw`\frac{dy}{y}=3x^2dx`, String.raw`y=Ce^{x^3}`),
    calculation("Solve dy/dx = x/y.", String.raw`y\,dy=x\,dx`, String.raw`y^2-x^2=C`),
    calculation("Solve dy/dx = 2x with y(0)=5.", String.raw`y=x^2+C,\quad5=C`, String.raw`y=x^2+5`),
  ],
  10189: [
    calculation("Solve dy/dx = y/x with y(1) = 3.", String.raw`y=Cx,\quad3=C(1)`, String.raw`y=3x`),
    calculation("For dy/dx = (x+y)/x, substitute y=vx.", String.raw`v+x\frac{dv}{dx}=1+v`, String.raw`x\frac{dv}{dx}=1`),
    calculation("Solve the reduced equation x dv/dx = 1.", String.raw`dv=\frac{dx}{x}`, String.raw`v=\ln|x|+C`),
  ],
  10190: [
    calculation("Solve dy/dx + y = eˣ.", String.raw`IF=e^x,\quad\frac d{dx}(ye^x)=e^{2x}`, String.raw`y=\frac12e^x+Ce^{-x}`),
    calculation("Solve dy/dx + 2y = 4.", String.raw`IF=e^{2x},\quad\frac d{dx}(ye^{2x})=4e^{2x}`, String.raw`y=2+Ce^{-2x}`),
    calculation("Solve dy/dx - y = 0 with y(0)=3.", String.raw`y=Ce^x,\quad C=3`, String.raw`y=3e^x`),
  ],
  10191: [
    calculation("For dy/dx = 2x, write the general solution and the particular solution through (0,4).", String.raw`y=x^2+C,\quad4=C`, String.raw`y=x^2+4`),
    calculation("For y = Ce³ˣ, use y(0)=5 to find C.", String.raw`5=Ce^0`, String.raw`C=5`, "5"),
    calculation("For y = x² + C, use point (2,9) to find the particular solution.", String.raw`9=4+C`, String.raw`y=x^2+5`),
  ],
  10192: [
    calculation("For dy/dx = x, find the field slope at (2,3).", String.raw`m=x=2`, String.raw`m=2`, "2"),
    calculation("For dy/dx = x - y, find the slope at (3,1).", String.raw`m=3-1`, String.raw`m=2`, "2"),
    calculation("For dy/dx = y, find slopes at y = -2, 0, 4.", String.raw`m=y`, String.raw`m=-2,0,4`),
  ],
  10193: [
    calculation("Find minor M₁₁ and cofactor C₁₁ of [[2,3],[5,7]].", String.raw`M_{11}=7,\quad C_{11}=(-1)^2(7)`, String.raw`C_{11}=7`, "7"),
    calculation("Find cofactor C₁₂ of [[2,3],[5,7]].", String.raw`M_{12}=5,\quad C_{12}=(-1)^3(5)`, String.raw`C_{12}=-5`, "-5"),
  ],
  10194: [
    calculation("Find adjoint of A=[[2,1],[3,4]].", String.raw`\operatorname{adj}A=\begin{pmatrix}4&-1\\-3&2\end{pmatrix}`, String.raw`\begin{pmatrix}4&-1\\-3&2\end{pmatrix}`),
    calculation("Find adjoint of [[5,2],[1,3]].", String.raw`\operatorname{adj}A=\begin{pmatrix}3&-2\\-1&5\end{pmatrix}`, String.raw`\begin{pmatrix}3&-2\\-1&5\end{pmatrix}`),
    calculation("For A=[[1,0],[0,6]], verify A adj(A)=det(A)I.", String.raw`\operatorname{adj}A=\begin{pmatrix}6&0\\0&1\end{pmatrix}`, String.raw`A\operatorname{adj}A=6I`),
  ],
  10195: [
    calculation("Find inverse of [[2,1],[1,1]] by adjoint.", String.raw`\det A=1,\quad\operatorname{adj}A=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}`, String.raw`A^{-1}=\begin{pmatrix}1&-1\\-1&2\end{pmatrix}`),
    calculation("Find inverse of [[4,0],[0,2]].", String.raw`\det A=8,\quad\operatorname{adj}A=\begin{pmatrix}2&0\\0&4\end{pmatrix}`, String.raw`A^{-1}=\begin{pmatrix}\frac14&0\\0&\frac12\end{pmatrix}`),
  ],
  10196: [
    calculation("Use determinant to find area of the parallelogram spanned by (3,1) and (2,4).", String.raw`A=\left|\begin{matrix}3&2\\1&4\end{matrix}\right|`, String.raw`A=|12-2|=10`, "10"),
    calculation("Find triangle area from vectors (4,0) and (0,6).", String.raw`A=\frac12\left|\begin{matrix}4&0\\0&6\end{matrix}\right|`, String.raw`A=12`, "12"),
    calculation("Points (0,0), (2,3), (4,6) form a determinant area. Evaluate it.", String.raw`A=\frac12|2(6)-4(3)|`, String.raw`A=0`, "0"),
  ],
  10197: [
    calculation("Solve x+y=5 and 2x-y=1 using matrices.", String.raw`\begin{pmatrix}1&1\\2&-1\end{pmatrix}\begin{pmatrix}x\\y\end{pmatrix}=\begin{pmatrix}5\\1\end{pmatrix}`, String.raw`x=2,\quad y=3`),
    calculation("Solve 3x+2y=12 and x-y=1.", String.raw`x=y+1\Rightarrow3(y+1)+2y=12`, String.raw`x=3,\quad y=2`),
    calculation("Verify solution (4,1) for 2x+y=9 and x-y=3.", String.raw`2(4)+1=9,\quad4-1=3`, String.raw`9=9,\quad3=3`),
  ],
  10198: [
    calculation("Use Cramer's rule for x+y=7 and x-y=1.", String.raw`D=-2,\quad D_x=-8,\quad D_y=-6`, String.raw`x=4,\quad y=3`),
    calculation("Solve 2x+y=8 and x+2y=7 by Cramer's rule.", String.raw`D=3,\quad D_x=9,\quad D_y=6`, String.raw`x=3,\quad y=2`),
    calculation("For D=5, Dₓ=15, Dᵧ=-10, find x and y.", String.raw`x=\frac{D_x}{D},\quad y=\frac{D_y}{D}`, String.raw`x=3,\quad y=-2`),
  ],
  10199: [
    calculation("Classify x+y=4 and 2x+2y=8 using ranks.", String.raw`\operatorname{rank}A=\operatorname{rank}[A|B]=1<2`, String.raw`\text{infinitely many solutions}`),
    calculation("Classify x+y=2 and 2x+2y=5.", String.raw`\operatorname{rank}A=1<\operatorname{rank}[A|B]=2`, String.raw`\text{no solution}`),
    calculation("Classify x+y=5 and x-y=1.", String.raw`\det A=-2\ne0`, String.raw`\text{unique solution }(3,2)`),
  ],
  10200: [
    calculation("Formulate profit for x tables at ₹300 and y chairs at ₹200.", String.raw`P=300x+200y`, String.raw`\max P=300x+200y`),
    calculation("A workshop has 40 labour hours; tables use 4 and chairs 2. Write the constraint.", String.raw`4x+2y\le40`, String.raw`2x+y\le20`),
    calculation("At least 10 total units are required. Write the constraint with non-negativity.", String.raw`x+y\ge10`, String.raw`x\ge0,\quad y\ge0`),
  ],
  10201: [
    calculation("For x+y≤6, x≥0, y≥0, list the feasible-region vertices.", String.raw`x+y=6\text{ meets axes at }(6,0),(0,6)`, String.raw`(0,0),(6,0),(0,6)`),
    calculation("Test whether (2,3) lies in x+2y≤8.", String.raw`2+2(3)=8`, String.raw`8\le8\Rightarrow\text{feasible}`, "feasible"),
    calculation("Test (4,3) against 2x+y≤10 and x+y≤8.", String.raw`2(4)+3=11>10`, String.raw`\text{not feasible}`),
  ],
  10202: [
    calculation("Maximise Z=3x+2y over vertices (0,0), (4,0), (2,3), (0,5).", String.raw`Z=0,12,12,10`, String.raw`Z_{\max}=12`, "12"),
    calculation("Minimise C=4x+5y at vertices (1,2), (3,0), (0,4).", String.raw`C=14,12,20`, String.raw`C_{\min}=12\text{ at }(3,0)`, "12"),
    calculation("For Z=2x+7y, evaluate the corner (3,4).", String.raw`Z=2(3)+7(4)`, String.raw`Z=34`, "34"),
  ],
  10203: [
    calculation("The region 0≤x≤4 and 0≤y≤3 is bounded. Find its area.", String.raw`A=4(3)`, String.raw`A=12`, "12"),
    calculation("List vertices of the bounded region x≥0, y≥0, x+y≤5.", String.raw`x+y=5`, String.raw`(0,0),(5,0),(0,5)`),
    calculation("Maximise x+y over 0≤x≤2, 0≤y≤6.", String.raw`Z(2,6)=2+6`, String.raw`Z_{\max}=8`, "8"),
  ],
  10204: [
    calculation("For x≥0, y≥0, x+y≥4, show point (10,10) remains feasible.", String.raw`10+10=20\ge4`, String.raw`\text{feasible}`),
    calculation("Minimise Z=x+y on x+y≥6, x,y≥0.", String.raw`Z=x+y\ge6`, String.raw`Z_{\min}=6`, "6"),
  ],
  10205: [
    calculation("Maximise Z=x+y when a feasible edge runs from (2,4) to (5,1). Compare endpoints.", String.raw`Z(2,4)=6,\quad Z(5,1)=6`, String.raw`Z=6\text{ along the edge}`),
    calculation("Objective Z=2x+4y is parallel to boundary x+2y=8. Find Z on that boundary.", String.raw`Z=2(x+2y)`, String.raw`Z=16`, "16"),
    calculation("Two adjacent corners give Z=24 and Z=24. What does the connecting edge contain?", String.raw`24=24`, String.raw`\text{infinitely many optimal points}`),
  ],
  10206: [
    calculation("Check feasibility of x≥5 and x≤3.", String.raw`x\ge5\land x\le3`, String.raw`\varnothing`, "infeasible"),
    calculation("Check x+y≤2 and x+y≥7.", String.raw`x+y\le2\land x+y\ge7`, String.raw`\varnothing`, "infeasible"),
  ],
  10207: [
    calculation("Food A gives 3 protein units and B gives 2; require at least 12. Write the constraint.", String.raw`3x+2y\ge12`, String.raw`x,y\ge0`),
    calculation("Minimise cost C=₹40x+₹30y at feasible points (4,0), (2,3), (0,6).", String.raw`C=160,170,180`, String.raw`C_{\min}=160`, "₹160"),
  ],
  10208: [
    calculation("Products A and B earn ₹50 and ₹70. Write profit for x and y units.", String.raw`P=50x+70y`, String.raw`\max P=50x+70y`),
    calculation("At corner (8,5), calculate P=50x+70y.", String.raw`P=50(8)+70(5)`, String.raw`P=750`, "₹750"),
  ],
  10209: [
    calculation("Shipping 4 units at ₹3 each and 6 at ₹5 each, find total cost.", String.raw`C=4(3)+6(5)`, String.raw`C=42`, "₹42"),
    calculation("Supply nodes hold 20 and 30 units; demands are 15, 18, 17. Verify balance.", String.raw`20+30=50,\quad15+18+17=50`, String.raw`50=50`),
    calculation("A route ships x units at ₹8 each. Write its cost and evaluate at x=12.", String.raw`C=8x,\quad C(12)=8(12)`, String.raw`C=96`, "₹96"),
  ],
  10210: [
    calculation("If P(A∩B)=0.24 and P(B)=0.6, find P(A|B).", String.raw`P(A\mid B)=\frac{0.24}{0.6}`, String.raw`P(A\mid B)=0.4`, "0.4"),
    calculation("From 20 students, 12 play sport and 5 of those swim. Find P(swim|sport).", String.raw`P(Sw\mid Sp)=\frac5{12}`, String.raw`\frac5{12}`, String.raw`\frac5{12}`),
  ],
  10211: [
    calculation("If P(A)=0.5 and P(B|A)=0.3, find P(A∩B).", String.raw`P(A\cap B)=P(A)P(B\mid A)`, String.raw`0.5(0.3)=0.15`, "0.15"),
    calculation("A bag gives red with probability 3/5, then blue given red with probability 1/2. Find P(RB).", String.raw`P(RB)=\frac35\cdot\frac12`, String.raw`\frac3{10}`, String.raw`\frac3{10}`),
    calculation("Find P(A∩B) when P(B)=0.4 and P(A|B)=0.75.", String.raw`P(A\cap B)=0.4(0.75)`, String.raw`0.3`, "0.3"),
  ],
  10212: [
    calculation("Independent events have P(A)=0.6 and P(B)=0.5. Find P(A∩B).", String.raw`P(A\cap B)=0.6(0.5)`, String.raw`0.3`, "0.3"),
    calculation("A coin and die are independent. Find P(head and 6).", String.raw`\frac12\cdot\frac16`, String.raw`\frac1{12}`, String.raw`\frac1{12}`),
    calculation("For independent A and B with P(A)=0.2, P(B)=0.4, find P(neither).", String.raw`(1-0.2)(1-0.4)`, String.raw`0.48`, "0.48"),
  ],
  10213: [
    calculation("Partition probabilities are 0.4 and 0.6; event probabilities are 0.2 and 0.5. Find total P(E).", String.raw`P(E)=0.4(0.2)+0.6(0.5)`, String.raw`P(E)=0.38`, "0.38"),
    calculation("Machines make 70% and 30% with defect rates 1% and 4%. Find P(defect).", String.raw`P(D)=0.7(0.01)+0.3(0.04)`, String.raw`P(D)=0.019`, "0.019"),
    calculation("Three boxes chosen with probabilities 0.2,0.3,0.5 give red with 0.1,0.4,0.6. Find P(red).", String.raw`P(R)=0.2(0.1)+0.3(0.4)+0.5(0.6)`, String.raw`P(R)=0.44`, "0.44"),
  ],
  10214: [
    calculation("Disease prevalence is 0.1, sensitivity 0.9, and P(positive)=0.18. Find P(disease|positive).", String.raw`P(D\mid+)=\frac{0.9(0.1)}{0.18}`, String.raw`0.5`, "0.5"),
    calculation("Boxes A and B are equally likely; red probabilities are 0.2 and 0.8. Find P(B|red).", String.raw`P(B\mid R)=\frac{0.5(0.8)}{0.5(0.2)+0.5(0.8)}`, String.raw`0.8`, "0.8"),
    calculation("A factory has lines A 60% at 2% defects and B 40% at 5%. Find P(B|defect).", String.raw`P(B\mid D)=\frac{0.4(0.05)}{0.6(0.02)+0.4(0.05)}`, String.raw`\frac58`, String.raw`\frac58`),
  ],
  10215: [
    calculation("A random variable X is the number of heads in two tosses. List its values.", String.raw`X(HH)=2,\quad X(HT)=X(TH)=1,\quad X(TT)=0`, String.raw`X\in\{0,1,2\}`),
    calculation("For die outcome ω, define X=2ω. List possible X values.", String.raw`\omega\in\{1,2,3,4,5,6\}`, String.raw`X\in\{2,4,6,8,10,12\}`),
  ],
  10217: [
    calculation("X takes 0,1,2 with probabilities 0.2,0.5,0.3. Find E(X).", String.raw`E(X)=0(0.2)+1(0.5)+2(0.3)`, String.raw`E(X)=1.1`, "1.1"),
    calculation("A game pays ₹10 with probability 0.25 and ₹0 otherwise. Find expected payout.", String.raw`E=10(0.25)+0(0.75)`, String.raw`E=2.5`, "₹2.50"),
  ],
  10218: [
    calculation("X takes 0 and 2 equally likely. Find variance.", String.raw`E(X)=1,\quad E(X^2)=2`, String.raw`\operatorname{Var}(X)=2-1^2=1`, "1"),
    calculation("A random variable has E(X)=3 and E(X²)=13. Find variance.", String.raw`\operatorname{Var}(X)=13-3^2`, String.raw`4`, "4"),
  ],
  10219: [
    calculation("A Bernoulli trial has p=0.7. Find mean and variance.", String.raw`E(X)=p=0.7,\quad\operatorname{Var}(X)=p(1-p)`, String.raw`\operatorname{Var}(X)=0.21`),
    calculation("For p=0.4, find P(failure) in one Bernoulli trial.", String.raw`q=1-p=1-0.4`, String.raw`q=0.6`, "0.6"),
  ],
  10220: [
    calculation("For X~Bin(5,0.4), find P(X=2).", String.raw`P(X=2)=\binom52(0.4)^2(0.6)^3`, String.raw`P(X=2)=0.3456`, "0.3456"),
    calculation("For X~Bin(12,0.25), find the mean.", String.raw`E(X)=np=12(0.25)`, String.raw`E(X)=3`, "3"),
  ],
};

export function getSupplementalNumericalExamples(lessonId: number): LessonWorkedExample[] {
  return (numericalExamplesByLesson[lessonId] ?? []).map(([prompt, steps, answer], index) => ({
    id: `catalog-numerical-${lessonId}-${index + 1}`,
    prompt,
    steps: [...steps],
    answer,
  }));
}

export const lessonsWithSupplementalNumericalExamples = Object.keys(numericalExamplesByLesson).map(Number);

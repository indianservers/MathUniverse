export type ChartKind = "bars" | "line" | "number-line" | "circle" | "fraction";

export type StudySpec = {
  chart: ChartKind;
  chartTitle: string;
  xLabel: string;
  yLabel: string;
  seriesLabel: string;
  liveLabel: string;
  liveValue: (t: number) => string;
  bars: Array<{ label: string; value: number; color: string }>;
  points: Array<{ x: number; y: number }>;
};

function spec(
  chart: ChartKind,
  chartTitle: string,
  xLabel: string,
  yLabel: string,
  seriesLabel: string,
  liveValue: (t: number) => string,
  bars: Array<[string, number, string]>,
  points: Array<[number, number]>,
): StudySpec {
  return {
    chart,
    chartTitle,
    xLabel,
    yLabel,
    seriesLabel,
    liveLabel: seriesLabel,
    liveValue,
    bars: bars.map(([label, value, color]) => ({ label, value, color })),
    points: points.map(([x, y]) => ({ x, y })),
  };
}

export const batch3StudySpecs: Record<number, StudySpec> = {
  131: spec("line", "f(x)=x^2+1 at x=2", "x", "f(x)", "f(2)", (t) => String((((-2+t*4)**2)+1).toFixed(1)), [
    ["f(2)", 5, "#268ff1"], ["f(0)", 1, "#23b56e"], ["f(-2)", 5, "#8d4ce4"]
  ], [[-2, 5], [0, 1], [2, 5]]),
  132: spec("line", "x^2 passes, circle fails", "x", "y", "Hits", (t) => (t<0.5 ? "1 hit" : "2 hits"), [
    ["x^2", 1, "#268ff1"], ["circle", 2, "#eaa711"], ["x=2", 1, "#23b56e"]
  ], [[-2, 4], [0, 0], [2, 4]]),
  133: spec("line", "y=2x+3", "x", "y", "2x+3", (t) => String(2*Math.round(-1+t*6)+3), [
    ["slope", 2, "#268ff1"], ["intercept", 3, "#23b56e"], ["f(4)", 11, "#8d4ce4"]
  ], [[-1, 1], [0, 3], [4, 11]]),
  134: spec("line", "y=x^2-4 vertex (0,-4)", "x", "y", "x^2-4", (t) => String((((-3+t*6)**2)-4).toFixed(1)), [
    ["roots", 0, "#268ff1"], ["vertex", -4, "#23b56e"], ["f(3)", 5, "#8d4ce4"]
  ], [[-2, 0], [0, -4], [2, 0], [3, 5]]),
  135: spec("line", "y=x^3-x roots -1,0,1", "x", "y", "x^3-x", (t) => String((((-2+t*4)**3)-(-2+t*4)).toFixed(1)), [
    ["f(-2)", -8, "#268ff1"], ["f(-1)", 0, "#23b56e"], ["f(1)", 0, "#8d4ce4"]
  ], [[-2, -6], [-1, 0], [0, 0], [1, 0]]),
  136: spec("line", "(x^2-1)(x^2-4) four roots", "x", "y", "Degree 4", (t) => String((((-3+t*6)**2-1)*((-3+t*6)**2-4)).toFixed(1)), [
    ["roots", 4, "#268ff1"], ["degree", 4, "#23b56e"], ["turns", 3, "#8d4ce4"]
  ], [[-2, 0], [-1, 0], [1, 0], [2, 0]]),
  137: spec("line", "y=1/x branches", "x", "1/x", "Asymptotes", (t) => (Math.abs(t-0.5)<0.05 ? "undefined" : (1/(-3+t*6)).toFixed(2)), [
    ["f(1)", 1, "#268ff1"], ["f(2)", 0.5, "#23b56e"], ["f(4)", 0.25, "#8d4ce4"]
  ], [[-2, -0.5], [1, 1], [2, 0.5], [4, 0.25]]),
  138: spec("line", "(x+1)/(x-2) exclude x=2", "x", "y", "Restriction", (t) => (Math.abs(-2+t*6-2)<0.15 ? "excluded" : (((-2+t*6)+1)/((-2+t*6)-2)).toFixed(2)), [
    ["exclude", 2, "#eaa711"], ["f(0)", -0.5, "#268ff1"], ["f(5)", 2, "#23b56e"]
  ], [[0, -0.5], [1, -2], [5, 2]]),
  139: spec("line", "y=√x from (0,0)", "x", "√x", "Domain x≥0", (t) => (t<=0 ? "0" : Math.sqrt(t*9).toFixed(2)), [
    ["√0", 0, "#268ff1"], ["√4", 2, "#23b56e"], ["√9", 3, "#8d4ce4"]
  ], [[0, 0], [4, 2], [9, 3]]),
  140: spec("line", "y=∛x through the origin", "x", "∛x", "All real x", (t) => Math.cbrt(-8+t*16).toFixed(2), [
    ["∛8", 2, "#268ff1"], ["∛-8", -2, "#23b56e"], ["∛0", 0, "#8d4ce4"]
  ], [[-8, -2], [0, 0], [8, 2]]),
  141: spec("line", "y=|x-2| V at (2,0)", "x", "|x-2|", "Distance", (t) => String(Math.abs(-2+t*8-2).toFixed(1)), [
    ["|3|", 3, "#268ff1"], ["|-4|", 4, "#23b56e"], ["vertex", 0, "#8d4ce4"]
  ], [[0, 2], [2, 0], [5, 3]]),
  142: spec("line", "y=2^x doubling", "x", "2^x", "Multiplier 2", (t) => String(2**Math.round(t*5)), [
    ["2^0", 1, "#268ff1"], ["2^3", 8, "#23b56e"], ["2^5", 32, "#8d4ce4"]
  ], [[0, 1], [3, 8], [5, 32]]),
  143: spec("line", "log2(8)=3", "x", "log2 x", "Undo 2^x", (t) => (Math.log2(1+t*15)).toFixed(2), [
    ["log2 8", 3, "#268ff1"], ["ln 1", 0, "#23b56e"], ["log10 100", 2, "#8d4ce4"]
  ], [[1, 0], [8, 3], [16, 4]]),
  144: spec("circle", "sin 30° = 1/2", "θ", "sin", "Unit circle", (t) => `sin ${Math.round(t*90)}° = ${Math.sin((t*Math.PI)/2).toFixed(2)}`, [
    ["sin 30°", 0.5, "#268ff1"], ["cos 60°", 0.5, "#23b56e"], ["sin 90°", 1, "#8d4ce4"]
  ], [[30, 0.5], [60, 0.5], [90, 1]]),
  145: spec("line", "cosh x = (e^x+e^{-x})/2", "x", "cosh", "Catenary", (t) => ((Math.exp(t*2-1)+Math.exp(-(t*2-1)))/2).toFixed(2), [
    ["cosh 0", 1, "#268ff1"], ["sinh 0", 0, "#23b56e"], ["cosh 1", 1.54, "#8d4ce4"]
  ], [[-1, 1.54], [0, 1], [1, 1.54]]),
  146: spec("bars", "floor(3.7)=3, floor(-1.2)=-2", "x", "floor x", "Greatest integer ≤ x", (t) => String(Math.floor(-2+t*6)), [
    ["3.7→3", 3, "#268ff1"], ["-1.2→-2", -2, "#23b56e"], ["4→4", 4, "#8d4ce4"]
  ], [[3.7, 3], [-1.2, -2], [4, 4]]),
  147: spec("bars", "ceil(3.2)=4, ceil(-1.2)=-1", "x", "ceil x", "Least integer ≥ x", (t) => String(Math.ceil(-2+t*6)), [
    ["3.2→4", 4, "#268ff1"], ["-1.2→-1", -1, "#23b56e"], ["5→5", 5, "#8d4ce4"]
  ], [[3.2, 4], [-1.2, -1], [5, 5]]),
  148: spec("bars", "sgn(-8)=-1, sgn(5)=1", "x", "sgn x", "Direction only", (t) => String(Math.sign(-4+t*8)), [
    ["sgn 5", 1, "#268ff1"], ["sgn -8", -1, "#23b56e"], ["sgn 0", 0, "#8d4ce4"]
  ], [[-8, -1], [0, 0], [5, 1]]),
  149: spec("line", "x if x<0 else x^2", "x", "f(x)", "Active case", (t) => { const x=-3+t*6; return String((x<0?x:x*x).toFixed(1)); }, [
    ["f(-2)", -2, "#268ff1"], ["f(0)", 0, "#23b56e"], ["f(3)", 9, "#8d4ce4"]
  ], [[-2, -2], [0, 0], [3, 9]]),
  150: spec("line", "f(g(4))=14 for 2x and x+3", "x", "(f∘g)(x)", "Inside first", (t) => String(2*(Math.round(t*5)+3)), [
    ["g(4)", 7, "#268ff1"], ["f(7)", 14, "#23b56e"], ["g(f(4))", 11, "#8d4ce4"]
  ], [[4, 14], [4, 11], [1, 8]]),
  151: spec("line", "f(x)=2x+3 and (x-3)/2", "x", "y", "Undo", (t) => String((2*(t*4)+3).toFixed(1)), [
    ["f(2)", 7, "#268ff1"], ["inv 7", 2, "#23b56e"], ["swap", 1, "#8d4ce4"]
  ], [[2, 7], [7, 2], [0, 3]]),
  152: spec("line", "x^2 even, x^3 odd", "x", "f(x)", "f(-x)", (t) => (t<0.5 ? "even" : "odd"), [
    ["(-3)^2", 9, "#268ff1"], ["3^2", 9, "#23b56e"], ["(-2)^3", -8, "#8d4ce4"]
  ], [[-3, 9], [3, 9], [-2, -8], [2, 8]]),
  153: spec("line", "2x+1 up, -x+4 down", "x", "y", "Left to right", (t) => String((2*(-2+t*6)+1).toFixed(1)), [
    ["2x+1", 2, "#268ff1"], ["-x+4", -1, "#23b56e"], ["x^2 left", -1, "#eaa711"]
  ], [[-2, -3], [0, 1], [3, 7]]),
  154: spec("line", "sin period 2π", "x", "sin x", "One cycle", (t) => Math.sin(t*6.2832).toFixed(2), [
    ["period", 6.28, "#268ff1"], ["sin 0", 0, "#23b56e"], ["sin π/2", 1, "#8d4ce4"]
  ], [[0, 0], [1.57, 1], [6.28, 0]]),
  155: spec("line", "a1=3, a_n=a_{n-1}+2", "n", "a_n", "Next from last", (t) => String(3+2*Math.round(t*4)), [
    ["a1", 3, "#268ff1"], ["a3", 7, "#23b56e"], ["a4", 9, "#8d4ce4"]
  ], [[1, 3], [2, 5], [3, 7], [4, 9]]),
  156: spec("line", "x^2+3 up 3", "x", "y", "Outside +k", (t) => String((((-2+t*4)**2)+3).toFixed(1)), [
    ["vertex", 3, "#268ff1"], ["(0,0)+3", 3, "#23b56e"], ["(1,1)+3", 4, "#8d4ce4"]
  ], [[-2, 7], [0, 3], [2, 7]]),
  157: spec("line", "(x-2)^2 right 2", "x", "y", "Inside x-h", (t) => String((((-1+t*6)-2)**2).toFixed(1)), [
    ["vertex", 2, "#268ff1"], ["old 0", 0, "#23b56e"], ["(2,0)", 0, "#8d4ce4"]
  ], [[0, 4], [2, 0], [4, 4]]),
  158: spec("line", "3x^2 stretch 3", "x", "y", "Outside factor", (t) => String((3*((-2+t*4)**2)).toFixed(1)), [
    ["x^2 at 1", 1, "#268ff1"], ["3x^2 at 1", 3, "#23b56e"], ["(1/2)x^2", 0.5, "#8d4ce4"]
  ], [[-1, 3], [0, 0], [1, 3]]),
  159: spec("line", "f(2x) compress 1/2", "x", "y", "Reciprocal width", (t) => String((((t*4-2)*2)**2).toFixed(1)), [
    ["f(x) at 2", 4, "#268ff1"], ["f(2x) at 1", 4, "#23b56e"], ["width", 0.5, "#8d4ce4"]
  ], [[2, 4], [1, 4], [0, 0]]),
  160: spec("line", "(2,3) maps to (2,-3)", "x", "y", "(x,y)→(x,-y)", (t) => String((-(1+t*4)).toFixed(1)), [
    ["(2,3)", 3, "#268ff1"], ["(2,-3)", -3, "#23b56e"], ["axis", 0, "#8d4ce4"]
  ], [[2, 3], [2, -3], [0, 0]]),
  161: spec("line", "(2,3) maps to (-2,3)", "x", "y", "(x,y)→(-x,y)", (t) => String(3), [
    ["(2,3)", 2, "#268ff1"], ["(-2,3)", -2, "#23b56e"], ["axis", 0, "#8d4ce4"]
  ], [[2, 3], [-2, 3], [0, 3]]),
  162: spec("line", "2(x-1)^2+3", "x", "y", "Inside then outside", (t) => String((2*((-1+t*4)-1)**2+3).toFixed(1)), [
    ["vertex", 3, "#268ff1"], ["h", 1, "#23b56e"], ["a", 2, "#8d4ce4"]
  ], [[1, 3], [2, 5], [0, 5]]),
  163: spec("bars", "Double 2 then add 3 = 7", "Step", "y", "Order", (t) => String([2,4,7][Math.round(t*2)]), [
    ["start", 2, "#268ff1"], ["×2", 4, "#23b56e"], ["+3", 7, "#8d4ce4"]
  ], [[0, 2], [1, 4], [2, 7]]),
  164: spec("line", "y=ax+b family", "x", "y", "a vs b", (t) => String(((1+t*3)*2+(t<0.5?1:4)).toFixed(1)), [
    ["a slope", 2, "#268ff1"], ["b shift", 3, "#23b56e"], ["x input", 4, "#8d4ce4"]
  ], [[0, 3], [2, 7], [4, 11]]),
  165: spec("line", "Parents x, x^2, √x, 1/x", "x", "y", "Simplest shape", (t) => (t<0.25 ? "x" : t<0.5 ? "x^2" : t<0.75 ? "√x" : "1/x"), [
    ["x^2", 1, "#268ff1"], ["|x|", 1, "#23b56e"], ["√x", 1, "#8d4ce4"]
  ], [[1, 1], [4, 2], [1, 1]]),
  166: spec("line", "Match y=2x+1", "x", "y", "Shape + points", (t) => String(2*Math.round(t*4)+1), [
    ["intercept", 1, "#268ff1"], ["slope", 2, "#23b56e"], ["(2,5)", 5, "#8d4ce4"]
  ], [[0, 1], [1, 3], [2, 5]]),
  167: spec("line", "(3,-2) in quadrant IV", "x", "y", "Quadrant", (t) => `(${Math.round(-3+t*6)},${Math.round(-2+t*4)})`, [
    ["QIV x", 3, "#268ff1"], ["QIV y", -2, "#23b56e"], ["origin", 0, "#8d4ce4"]
  ], [[3, -2], [-3, 2], [0, 0]]),
  168: spec("line", "Plot (4,1) and (0,-3)", "x", "y", "Grid steps", (t) => `(${Math.round(t*4)},${Math.round(-3+t*4)})`, [
    ["(4,1)", 1, "#268ff1"], ["(0,-3)", -3, "#23b56e"], ["(2,2)", 2, "#8d4ce4"]
  ], [[4, 1], [0, -3], [2, 2]]),
  169: spec("line", "(0,0) to (3,4) is 5", "Δx", "Δy", "Pythagoras", (t) => (Math.hypot(3*t,4*t)).toFixed(2), [
    ["Δx", 3, "#268ff1"], ["Δy", 4, "#23b56e"], ["d", 5, "#8d4ce4"]
  ], [[0, 0], [3, 4], [6, 8]]),
  170: spec("line", "(0,0) and (4,2) midpoint (2,1)", "x", "y", "Averages", (t) => `(${(t*4).toFixed(1)},${(t*2).toFixed(1)})`, [
    ["Mx", 2, "#268ff1"], ["My", 1, "#23b56e"], ["half", 2, "#8d4ce4"]
  ], [[0, 0], [2, 1], [4, 2]]),
  171: spec("line", "1:2 of (0,0) to (6,0) is (2,0)", "t", "x", "m:n split", (t) => String((6*t).toFixed(1)), [
    ["1:1", 3, "#268ff1"], ["1:2", 2, "#23b56e"], ["2:1", 4, "#8d4ce4"]
  ], [[2, 0], [3, 0], [4, 0]]),
  172: spec("line", "(0,1) to (2,5) slope 2", "x", "y", "rise/run", (t) => String((1+2*t*2).toFixed(1)), [
    ["rise", 4, "#268ff1"], ["run", 2, "#23b56e"], ["m", 2, "#8d4ce4"]
  ], [[0, 1], [2, 5], [3, 7]]),
  173: spec("line", "y-1=2(x-0) so y=2x+1", "x", "y", "Point-slope", (t) => String(2*Math.round(t*4)+1), [
    ["m", 2, "#268ff1"], ["b", 1, "#23b56e"], ["(3,7)", 7, "#8d4ce4"]
  ], [[0, 1], [2, 5], [3, 7]]),
  174: spec("line", "y=2x and y=2x+3", "x", "y", "Equal slopes", (t) => String(2*Math.round(t*3)), [
    ["m1", 2, "#268ff1"], ["m2", 2, "#23b56e"], ["gap", 3, "#8d4ce4"]
  ], [[0, 0], [0, 3], [2, 4]]),
  175: spec("line", "m=2 and m=-1/2", "x", "y", "Negative reciprocal", (t) => (t<0.5 ? "2" : "-0.5"), [
    ["m", 2, "#268ff1"], ["-1/m", -0.5, "#23b56e"], ["product", -1, "#8d4ce4"]
  ], [[0, 0], [2, 4], [2, -1]]),
  176: spec("line", "tanθ=|(m2-m1)/(1+m1 m2)|", "m", "tanθ", "Acute angle", (t) => (Math.abs((1-(t*2))/ (1+(t*2)*0 + 0.001))).toFixed(2), [
    ["m1", 1, "#268ff1"], ["m2", 0, "#23b56e"], ["tanθ", 1, "#8d4ce4"]
  ], [[0, 0], [1, 1], [1, 0]]),
  177: spec("bars", "|3*0+4*0-12|/5=2.4", "Piece", "Value", "Formula", (t) => (12/(5)).toFixed(2), [
    ["|c|", 12, "#268ff1"], ["norm", 5, "#23b56e"], ["d", 2.4, "#8d4ce4"]
  ], [[0, 2.4], [3, 0], [0, 3]]),
  178: spec("circle", "x^2+y^2=25 circle r=5", "x", "y", "Constraint", (t) => `(${(5*Math.cos(t*6.28)).toFixed(1)},${(5*Math.sin(t*6.28)).toFixed(1)})`, [
    ["r", 5, "#268ff1"], ["(3,4)", 5, "#23b56e"], ["(0,5)", 5, "#8d4ce4"]
  ], [[5, 0], [3, 4], [0, 5]]),
  179: spec("line", "(x,y)→(x+2,y-1)", "x", "y", "Image", (t) => `(${Math.round(1+t*2+2)},${Math.round(3-1)})`, [
    ["(1,3)", 3, "#268ff1"], ["(3,2)", 2, "#23b56e"], ["Δx", 2, "#8d4ce4"]
  ], [[1, 3], [3, 2], [5, 1]]),
  180: spec("circle", "(r,θ)=(3,0°) is (3,0)", "θ", "r", "x=r cos θ", (t) => `r=3, θ=${Math.round(t*90)}°`, [
    ["r", 3, "#268ff1"], ["x", 3, "#23b56e"], ["y at 90°", 3, "#8d4ce4"]
  ], [[3, 0], [0, 3], [-3, 0]]),
  181: spec("line", "x=t, y=2t line", "t", "point", "(t,2t)", (t) => `(${Math.round(t*4)},${Math.round(2*t*4)})`, [
    ["t=0", 0, "#268ff1"], ["t=2", 4, "#23b56e"], ["t=3", 6, "#8d4ce4"]
  ], [[0, 0], [2, 4], [3, 6]]),
  182: spec("bars", "Midpoint (1/2,1/2,0) on BC? ", "Weight", "Mass", "α+β+γ=1", (t) => (t<0.5 ? "1/2,1/2,0" : "1/3,1/3,1/3"), [
    ["α", 0.5, "#268ff1"], ["β", 0.5, "#23b56e"], ["centroid", 0.33, "#8d4ce4"]
  ], [[0.5, 0.5], [0.33, 0.33]]),
  183: spec("line", "<3,4> has magnitude 5", "x", "y", "Arrow", (t) => `(${Math.round(3*t)},${Math.round(4*t)})`, [
    ["x", 3, "#268ff1"], ["y", 4, "#23b56e"], ["|v|", 5, "#8d4ce4"]
  ], [[0, 0], [3, 4]]),
  184: spec("bars", "<3,4>=3i+4j", "Axis", "Component", "Basis", (t) => (t<0.5 ? "3i" : "4j"), [
    ["i", 3, "#268ff1"], ["j", 4, "#23b56e"], ["|v|", 5, "#8d4ce4"]
  ], [[3, 0], [0, 4], [3, 4]]),
  185: spec("line", "OA=<2,3> from origin", "x", "y", "From O", (t) => `(${Math.round(2*t)},${Math.round(3*t)})`, [
    ["x", 2, "#268ff1"], ["y", 3, "#23b56e"], ["|OA|", 3.61, "#8d4ce4"]
  ], [[0, 0], [2, 3]]),
  186: spec("line", "<1,2>+<3,4>=<4,6>", "x", "y", "Tip to tail", (t) => `(${Math.round(1+3*t)},${Math.round(2+4*t)})`, [
    ["sum x", 4, "#268ff1"], ["sum y", 6, "#23b56e"], ["|sum|", 7.21, "#8d4ce4"]
  ], [[1, 2], [4, 6], [3, 4]]),
  187: spec("line", "<5,1>-<2,3>=<3,-2>", "x", "y", "a-b", (t) => `(${Math.round(5-2*t)},${Math.round(1-3*t)})`, [
    ["Δx", 3, "#268ff1"], ["Δy", -2, "#23b56e"], ["|a-b|", 3.61, "#8d4ce4"]
  ], [[5, 1], [2, 3], [3, -2]]),
  188: spec("line", "3<2,1>=<6,3>", "k", "vector", "Scale", (t) => `(${Math.round(2+4*t)},${Math.round(1+2*t)})`, [
    ["k", 3, "#268ff1"], ["x", 6, "#23b56e"], ["y", 3, "#8d4ce4"]
  ], [[2, 1], [6, 3], [-2, -1]]),
  189: spec("bars", "|<3,4>|=5, unit <3/5,4/5>", "Part", "Value", "v/|v|", (t) => (t<0.5 ? "5" : "0.6"), [
    ["|v|", 5, "#268ff1"], ["û x", 0.6, "#23b56e"], ["û y", 0.8, "#8d4ce4"]
  ], [[3, 4], [0.6, 0.8]]),
  190: spec("bars", "<1,2>·<3,4>=11", "Term", "Value", "a·b", (t) => String([3,8,11][Math.round(t*2)]), [
    ["1*3", 3, "#268ff1"], ["2*4", 8, "#23b56e"], ["dot", 11, "#8d4ce4"]
  ], [[1, 3], [2, 8]]),
  191: spec("bars", "|i×j|=1, |a×b|=|a||b|sinθ", "Factor", "Value", "Perpendicular", (t) => String([1,6,6][Math.round(t*2)]), [
    ["|a|", 3, "#268ff1"], ["|b|", 2, "#23b56e"], ["|a×b|", 6, "#8d4ce4"]
  ], [[1, 0], [0, 1], [0, 0]]),
  192: spec("bars", "proj of <4,0> on <1,0> is <4,0>", "Part", "Value", "proj_b a", (t) => String((4*(t)).toFixed(1)), [
    ["(a·û)", 4, "#268ff1"], ["|b|", 1, "#23b56e"], ["proj", 4, "#8d4ce4"]
  ], [[4, 0], [2, 2], [2, 0]]),
  193: spec("line", "2<1,0>+3<0,1>=<2,3>", "x", "y", "Span", (t) => `(${Math.round(2*t)},${Math.round(3*t)})`, [
    ["2i", 2, "#268ff1"], ["3j", 3, "#23b56e"], ["sum", 5, "#eaa711"]
  ], [[2, 0], [0, 3], [2, 3]]),
  194: spec("line", "r=<1,2>+t<2,0>", "t", "point", "a+td", (t) => `(${1+2*Math.round(t*3)},2)`, [
    ["a", 1, "#268ff1"], ["d", 2, "#23b56e"], ["t=2", 5, "#8d4ce4"]
  ], [[1, 2], [3, 2], [5, 2]]),
  195: spec("bars", "n·(r-a)=0 with n=<0,0,1>", "Coord", "Value", "Normal", (t) => (t<0.5 ? "z=3" : "n·r=3"), [
    ["n z", 1, "#268ff1"], ["a z", 3, "#23b56e"], ["point z", 3, "#8d4ce4"]
  ], [[0, 0], [1, 1], [2, 3]]),
  196: spec("bars", "v_A=8, v_B=3, v_AB=5", "Velocity", "km/h", "v_A-v_B", (t) => String(Math.round(8-3)), [
    ["vA", 8, "#268ff1"], ["vB", 3, "#23b56e"], ["vAB", 5, "#8d4ce4"]
  ], [[8, 5], [3, 0]]),
  197: spec("line", "3 N east + 4 N north = 5 N", "Fx", "Fy", "Resultant", (t) => String((5*t).toFixed(1)), [
    ["Fx", 3, "#268ff1"], ["Fy", 4, "#23b56e"], ["|F|", 5, "#8d4ce4"]
  ], [[3, 0], [0, 4], [3, 4]]),
  198: spec("line", "Unconstrained (x,y)=(1,2)", "x", "y", "Two degrees", (t) => `(${Math.round(-2+t*6)},${Math.round(-1+t*4)})`, [
    ["x", 1, "#268ff1"], ["y", 2, "#23b56e"], ["dof", 2, "#8d4ce4"]
  ], [[1, 2], [-2, 3], [4, -1]]),
  199: spec("circle", "Constrained to x^2+y^2=25", "θ", "point", "On the circle", (t) => `(${(5*Math.cos(t*6.28)).toFixed(1)},${(5*Math.sin(t*6.28)).toFixed(1)})`, [
    ["r", 5, "#268ff1"], ["(5,0)", 5, "#23b56e"], ["(0,5)", 5, "#8d4ce4"]
  ], [[5, 0], [0, 5], [-5, 0]]),
  200: spec("line", "y=x+1 and y=-x+3 meet (1,2)", "x", "y", "Solve pair", (t) => `(${(t*2).toFixed(1)},${(1+t*2).toFixed(1)})`, [
    ["x", 1, "#268ff1"], ["y", 2, "#23b56e"], ["sum", 3, "#8d4ce4"]
  ], [[0, 1], [1, 2], [0, 3]]),
  201: spec("line", "(-4,2) and (4,-1) midpoint (0,0.5)", "x", "y", "Average", (t) => `(${(-4+8*t).toFixed(1)},${(2-3*t).toFixed(1)})`, [
    ["Mx", 0, "#268ff1"], ["My", 0.5, "#23b56e"], ["check", 4, "#8d4ce4"]
  ], [[-4, 2], [0, 0.5], [4, -1]]),
  202: spec("bars", "Bound vs free point", "State", "Constrained", "Bind flag", (t) => (t<0.5 ? "attached" : "free"), [
    ["attached", 1, "#268ff1"], ["free", 0, "#23b56e"], ["on circle", 1, "#8d4ce4"]
  ], [[0, 1], [1, 0]]),
  203: spec("line", "(0,1) and (2,5)", "x", "y", "Unique line", (t) => String(1+2*Math.round(t*3)), [
    ["m", 2, "#268ff1"], ["(0,1)", 1, "#23b56e"], ["(2,5)", 5, "#8d4ce4"]
  ], [[0, 1], [2, 5], [3, 7]]),
  204: spec("bars", "Segment AB of length 5", "End", "Coord", "Finite length", (t) => String((5*t).toFixed(1)), [
    ["A", 0, "#268ff1"], ["B", 5, "#23b56e"], ["length", 5, "#8d4ce4"]
  ], [[0, 0], [5, 0]]),
  205: spec("bars", "Copy length 5 onto a ray", "t", "Length", "Compass copy", (t) => String((5).toFixed(0)), [
    ["given", 5, "#268ff1"], ["copy", 5, "#23b56e"], ["short", 3, "#eaa711"]
  ], [[0, 0], [5, 0], [3, 0]]),
  206: spec("number-line", "Ray from 0 through 4", "x", "On ray", "t≥0", (t) => (t>=0 ? "on" : "off"), [
    ["start", 0, "#268ff1"], ["through", 4, "#23b56e"], ["beyond", 8, "#8d4ce4"]
  ], [[0, 1], [4, 1], [8, 1], [-2, 0]]),
  207: spec("line", "Path A-B-C lengths 3+4=7", "Edge", "Length", "Open chain", (t) => String([3,4,7][Math.round(t*2)]), [
    ["AB", 3, "#268ff1"], ["BC", 4, "#23b56e"], ["path", 7, "#8d4ce4"]
  ], [[0, 0], [3, 0], [3, 4]]),
  208: spec("line", "Through (0,0) to y=2x", "x", "y", "m=-1/2", (t) => String((-0.5*t*4).toFixed(1)), [
    ["given m", 2, "#268ff1"], ["perp m", -0.5, "#23b56e"], ["product", -1, "#8d4ce4"]
  ], [[0, 0], [2, 4], [2, -1]]),
  209: spec("line", "Through (0,3) parallel to y=2x", "x", "y", "Same slope", (t) => String((2*t*3+3).toFixed(1)), [
    ["m", 2, "#268ff1"], ["b", 3, "#23b56e"], ["(1,5)", 5, "#8d4ce4"]
  ], [[0, 3], [1, 5], [0, 0]]),
  210: spec("line", "Bisector of (0,0)(4,0) is x=2", "x", "y", "Midpoint + perp", (t) => "x=2", [
    ["mid", 2, "#268ff1"], ["perp m", 999, "#23b56e"], ["eq dist", 2, "#8d4ce4"]
  ], [[0, 0], [2, 0], [4, 0]]),
  211: spec("circle", "Bisector splits 80° into 40°+40°", "Ray", "Degrees", "Equal angles", (t) => String(Math.round(40)), [
    ["full", 80, "#268ff1"], ["half", 40, "#23b56e"], ["other", 40, "#8d4ce4"]
  ], [[0, 0], [40, 1], [80, 1]]),
  212: spec("circle", "Radius 5, tangent perp at (5,0)", "x", "y", "r ⊥ tangent", (t) => (t<0.5 ? "radius" : "tangent"), [
    ["r", 5, "#268ff1"], ["at touch", 5, "#23b56e"], ["slope prod", -1, "#8d4ce4"]
  ], [[0, 0], [5, 0], [5, 2]]),
  213: spec("line", "Points (1,2),(2,3),(3,5) trend", "x", "y", "Least squares", (t) => String((1.5+1.5*t*3).toFixed(1)), [
    ["m", 1.5, "#268ff1"], ["(2,3)", 3, "#23b56e"], ["residual", 0.5, "#eaa711"]
  ], [[1, 2], [2, 3], [3, 5]]),
  214: spec("bars", "SSS 3,4,5 right triangle", "Side", "Length", "SSS", (t) => String([3,4,5][Math.round(t*2)]), [
    ["a", 3, "#268ff1"], ["b", 4, "#23b56e"], ["c", 5, "#8d4ce4"]
  ], [[3, 4], [0, 0], [5, 0]]),
  215: spec("circle", "Regular hexagon exterior 60°", "n", "Angle", "Equal sides", (t) => String(Math.round(360/(3+t*3))), [
    ["n", 6, "#268ff1"], ["ext", 60, "#23b56e"], ["int", 120, "#8d4ce4"]
  ], [[6, 60], [4, 90], [3, 120]]),
  216: spec("bars", "Sides stay 3,4,5 while moving", "Side", "Length", "Invariant", (t) => String([3,4,5][Math.round(t*2)]), [
    ["a", 3, "#268ff1"], ["b", 4, "#23b56e"], ["c", 5, "#8d4ce4"]
  ], [[3, 3], [4, 4], [5, 5]]),
  217: spec("bars", "Perimeter 2+3+4+5=14", "Side", "Length", "Closed chain", (t) => String(2+3+4+5), [
    ["a", 2, "#268ff1"], ["b", 3, "#23b56e"], ["c", 4, "#8d4ce4"], ["d", 5, "#eaa711"]
  ], [[1, 2], [2, 3], [3, 4], [4, 5]]),
  218: spec("circle", "Centre (0,0), point (3,4), r=5", "x", "y", "r=|CP|", (t) => String(5), [
    ["r", 5, "#268ff1"], ["(3,4)", 5, "#23b56e"], ["(0,0)", 0, "#8d4ce4"]
  ], [[0, 0], [3, 4], [5, 0]]),
  219: spec("circle", "Centre (0,0), r=4", "x", "y", "Fixed r", (t) => String(4), [
    ["r", 4, "#268ff1"], ["(4,0)", 4, "#23b56e"], ["(0,4)", 4, "#8d4ce4"]
  ], [[4, 0], [0, 4], [-4, 0]]),
  220: spec("circle", "Circumcircle of (0,0),(6,0),(0,8)", "x", "y", "Perp bisectors", (t) => "r=5", [
    ["r", 5, "#268ff1"], ["O", 5, "#23b56e"], ["points", 3, "#8d4ce4"]
  ], [[0, 0], [6, 0], [0, 8], [3, 4]]),
  221: spec("circle", "Copy radius 5 to a new centre", "Copy", "r", "Equal opening", (t) => String(5), [
    ["source r", 5, "#268ff1"], ["copy r", 5, "#23b56e"], ["wrong", 3, "#eaa711"]
  ], [[5, 5], [3, 3]]),
  222: spec("circle", "180° arc, area (1/2)πr^2", "r", "Area", "Half disc", (t) => (0.5*Math.PI*(1+t*3)**2).toFixed(1), [
    ["arc°", 180, "#268ff1"], ["r=2 area", 6.28, "#23b56e"], ["full", 12.57, "#8d4ce4"]
  ], [[2, 6.28], [1, 1.57]]),
  223: spec("circle", "s=rθ with r=2, θ=3", "θ", "s", "Along the curve", (t) => (2*(1+t*2)).toFixed(1), [
    ["r", 2, "#268ff1"], ["θ", 3, "#23b56e"], ["s", 6, "#8d4ce4"]
  ], [[2, 6], [4, 4]]),
  224: spec("circle", "Arc on the circumcircle r=5", "Point", "r", "Same circle", (t) => String(5), [
    ["r", 5, "#268ff1"], ["A", 5, "#23b56e"], ["B", 5, "#8d4ce4"]
  ], [[5, 0], [3, 4], [0, 5]]),
  225: spec("circle", "A=(1/2)r^2 θ for r=2, θ=2", "θ", "Area", "Slice", (t) => (0.5*4*(0.5+t*2)).toFixed(1), [
    ["r", 2, "#268ff1"], ["θ", 2, "#23b56e"], ["A", 4, "#8d4ce4"]
  ], [[2, 4], [4, 8]]),
  226: spec("line", "Five points fix A..F up to scale", "Point", "On conic", "5 conditions", (t) => String(Math.round(1+t*4)), [
    ["points", 5, "#268ff1"], ["dof", 5, "#23b56e"], ["scale", 1, "#8d4ce4"]
  ], [[0, 1], [1, 0], [2, 1], [3, 4], [4, 0]]),
  227: spec("circle", "PF1+PF2=2a=10", "x", "sum", "Constant sum", (t) => String(10), [
    ["2a", 10, "#268ff1"], ["2b", 8, "#23b56e"], ["c", 3, "#8d4ce4"]
  ], [[-5, 0], [5, 0], [0, 4]]),
  228: spec("line", "|PF1-PF2|=6", "x", "diff", "Constant difference", (t) => String(6), [
    ["2a", 6, "#268ff1"], ["foci", 10, "#23b56e"], ["branches", 2, "#8d4ce4"]
  ], [[-5, 0], [5, 0], [8, 4]]),
  229: spec("line", "y=x^2/4p with focus (0,1)", "x", "y", "Focus = directrix", (t) => String((((-4+t*8)**2)/4).toFixed(1)), [
    ["focus", 1, "#268ff1"], ["directrix", -1, "#23b56e"], ["vertex", 0, "#8d4ce4"]
  ], [[-2, 1], [0, 0], [2, 1]]),
  230: spec("bars", "√((4-1)^2+(8-4)^2)=5", "Leg", "Value", "Straight segment", (t) => String(5), [
    ["Δx", 3, "#268ff1"], ["Δy", 4, "#23b56e"], ["d", 5, "#8d4ce4"]
  ], [[1, 4], [4, 8]]),
};

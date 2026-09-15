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

export const batch2StudySpecs: Record<number, StudySpec> = {
  31: spec("number-line", "Open ray for x > 4", "x", "True", "x>4", (t) => (t > 0.4 ? "visible" : "hidden"), [
    ["Hidden", 4, "#eaa711"], ["Open", 4, "#268ff1"], ["True", 8, "#23b56e"]
  ], [[-1, 0], [4, 0], [8, 1]]),
  32: spec("bars", "List summary of [3,5,7,9]", "Index", "Value", "Sum", (t) => String([3,5,7,9][Math.round(t*3)]), [
    ["3", 3, "#268ff1"], ["5", 5, "#23b56e"], ["7", 7, "#8d4ce4"], ["9", 9, "#eaa711"]
  ], [[1, 3], [2, 5], [3, 7], [4, 9]]),
  33: spec("bars", "2x2 matrix [[1,2],[3,4]]", "Entry", "Value", "det", (t) => String([1,2,3,4][Math.round(t*3)]), [
    ["a11", 1, "#268ff1"], ["a12", 2, "#23b56e"], ["a21", 3, "#8d4ce4"], ["det", -2, "#eaa711"]
  ], [[1, 1], [2, 2], [3, 3], [4, 4]]),
  34: spec("line", "Arithmetic sequence 3,5,7,9", "n", "a_n", "3+2(n-1)", (t) => String(3+2*Math.round(t*4)), [
    ["a1", 3, "#268ff1"], ["a2", 5, "#23b56e"], ["a4", 9, "#8d4ce4"]
  ], [[1, 3], [2, 5], [3, 7], [4, 9]]),
  35: spec("line", "Two-branch f(x)", "x", "f(x)", "Active branch", (t) => (t<0.5 ? "x+1" : "2x"), [
    ["Left", 1, "#268ff1"], ["Join", 2, "#23b56e"], ["Right", 4, "#8d4ce4"]
  ], [[-1, 0], [1, 2], [2, 4]]),
  36: spec("bars", "AND, OR, and NOT of P=1, Q=0", "Gate", "Bit", "P AND Q", (t) => String([0,1,0][Math.round(t*2)]), [
    ["AND", 0, "#268ff1"], ["OR", 1, "#23b56e"], ["NOT P", 0, "#8d4ce4"]
  ], [[0, 0], [1, 1], [2, 0]]),
  37: spec("bars", "Template tokens x,y,z", "Token", "Value", "Printed text", (t) => `P(${Math.round(1+t*4)},${Math.round(2+t*2)})`, [
    ["x", 3, "#268ff1"], ["y", 2, "#23b56e"], ["z", 5, "#8d4ce4"]
  ], [[1, 3], [2, 2], [3, 5]]),
  38: spec("bars", "KaTeX grouping for x^2", "Token", "Count", "Rendered", (t) => (t<0.5 ? "x^2" : "x^{10}"), [
    ["Braces", 2, "#268ff1"], ["Exponent", 2, "#23b56e"], ["Places", 2, "#eaa711"]
  ], [[1, 2], [2, 10]]),
  39: spec("line", "Point (3,2) on the plane", "x", "y", "Point", (t) => `(${Math.round(t*6)},${Math.round(t*4)})`, [
    ["x", 3, "#268ff1"], ["y", 2, "#23b56e"], ["origin", 0, "#eaa711"]
  ], [[0, 0], [3, 2], [6, 4]]),
  40: spec("line", "y = x^2 − 4", "x", "y", "f(x)", (t) => String((((-3+t*6)**2)-4).toFixed(1)), [
    ["roots", 0, "#268ff1"], ["vertex", -4, "#23b56e"], ["f(3)", 5, "#8d4ce4"]
  ], [[-2, 0], [0, -4], [2, 0], [3, 5]]),
  41: spec("line", "Intersection of 2x+3=11", "x", "y", "Both sides", (t) => String((2*(1+t*5)+3).toFixed(1)), [
    ["Left@4", 11, "#268ff1"], ["Right", 11, "#23b56e"], ["x", 4, "#eaa711"]
  ], [[0, 3], [4, 11], [6, 15]]),
  42: spec("number-line", "Half-plane y < 2x+1", "x", "y", "Test point", (t) => (2*t < 1+t ? "inside" : "outside"), [
    ["Line", 1, "#268ff1"], ["Inside", 1, "#23b56e"], ["Test", 0, "#eaa711"]
  ], [[0, 1], [1, 3], [2, 5]]),
  43: spec("line", "Circle x=cos t, y=sin t", "t", "Point", "t in [0,2π]", (t) => `(${Math.cos(t*6.28).toFixed(2)},${Math.sin(t*6.28).toFixed(2)})`, [
    ["t=0", 1, "#268ff1"], ["t=π/2", 1, "#23b56e"], ["t=π", -1, "#8d4ce4"]
  ], [[1, 0], [0, 1], [-1, 0], [0, -1]]),
  44: spec("circle", "r = 2 cos θ", "θ", "r", "Polar point", (t) => `r=${(2*Math.cos(t*3.14)).toFixed(2)}`, [
    ["θ=0", 2, "#268ff1"], ["θ=π/3", 1, "#23b56e"], ["θ=π/2", 0, "#eaa711"]
  ], [[0, 2], [1, 1], [1.57, 0]]),
  45: spec("line", "Plotted sample (2,5)", "x", "y", "Point list", (t) => `(${Math.round(1+t*4)},${Math.round(2+t*6)})`, [
    ["P1", 2, "#268ff1"], ["P2", 5, "#23b56e"], ["count", 3, "#eaa711"]
  ], [[1, 2], [2, 5], [4, 8]]),
  46: spec("bars", "Data set 2,5,5,8", "Index", "Value", "Mean", (t) => String([2,5,5,8][Math.round(t*3)]), [
    ["2", 2, "#268ff1"], ["5", 5, "#23b56e"], ["8", 8, "#8d4ce4"], ["mean", 5, "#eaa711"]
  ], [[1, 2], [2, 5], [3, 5], [4, 8]]),
  47: spec("bars", "y=2x+3 at x=0,1,2,3", "x", "y", "2x+3", (t) => String(2*Math.round(t*3)+3), [
    ["0", 3, "#268ff1"], ["1", 5, "#23b56e"], ["2", 7, "#8d4ce4"], ["3", 9, "#eaa711"]
  ], [[0, 3], [1, 5], [2, 7], [3, 9]]),
  48: spec("line", "Trace along y=2x+3", "x", "y", "Trace point", (t) => `(${(t*4).toFixed(1)},${(2*t*4+3).toFixed(1)})`, [
    ["x=1", 5, "#268ff1"], ["x=2", 7, "#23b56e"], ["x=3", 9, "#8d4ce4"]
  ], [[1, 5], [2, 7], [3, 9]]),
  49: spec("line", "Window from [-2,2] to [-8,8]", "x", "Visible width", "Window", (t) => String((4+t*12).toFixed(1)), [
    ["narrow", 4, "#268ff1"], ["wide", 16, "#23b56e"], ["pan", 3, "#eaa711"]
  ], [[-2, 4], [0, 8], [2, 16]]),
  50: spec("bars", "Axis ticks at 1,2,5", "Step", "Count", "Tick step", (t) => String([1,2,5][Math.round(t*2)]), [
    ["step 1", 1, "#268ff1"], ["step 2", 2, "#23b56e"], ["step 5", 5, "#8d4ce4"]
  ], [[1, 10], [2, 5], [5, 2]]),
  51: spec("bars", "Minor grid every 0.5", "Spacing", "Lines", "Minor step", (t) => String((0.5+t*1.5).toFixed(1)), [
    ["major", 1, "#268ff1"], ["minor", 0.5, "#23b56e"], ["off", 0, "#eaa711"]
  ], [[0.5, 20], [1, 10], [2, 5]]),
  52: spec("bars", "Two views of y=x^2", "View", "xMax", "Window pair", (t) => (t<0.5 ? "[-2,2]" : "[-8,8]"), [
    ["A", 2, "#268ff1"], ["B", 8, "#23b56e"], ["shared f", 1, "#8d4ce4"]
  ], [[1, 2], [2, 8]]),
  53: spec("line", "Vertex and intercepts of x^2-4", "x", "y", "Special", (t) => ["(-2,0)","(0,-4)","(2,0)"][Math.round(t*2)], [
    ["left root", 0, "#268ff1"], ["vertex", -4, "#23b56e"], ["right root", 0, "#8d4ce4"]
  ], [[-2, 0], [0, -4], [2, 0]]),
  54: spec("bars", "Inspected y at x=3", "x", "y", "Readout", (t) => String((2*Math.round(1+t*4)+3)), [
    ["x", 3, "#268ff1"], ["y", 9, "#23b56e"], ["slope", 2, "#8d4ce4"]
  ], [[1, 5], [3, 9], [4, 11]]),
  55: spec("line", "Family y=ax+3 for a=1,2,3", "x", "y", "a", (t) => String(Math.round(1+t*2)), [
    ["a=1", 1, "#268ff1"], ["a=2", 2, "#23b56e"], ["a=3", 3, "#8d4ce4"]
  ], [[0, 3], [2, 5], [2, 7], [2, 9]]),
  56: spec("bars", "Export size 800×600", "Side", "Pixels", "PNG size", (t) => `${Math.round(400+t*400)}px`, [
    ["width", 800, "#268ff1"], ["height", 600, "#23b56e"], ["dpi", 96, "#eaa711"]
  ], [[800, 600], [400, 300]]),
  57: spec("number-line", "Counting marks 1 to 12", "n", "Count", "Successor", (t) => String(1+Math.round(t*11)), [
    ["1", 1, "#268ff1"], ["7", 7, "#23b56e"], ["12", 12, "#8d4ce4"]
  ], [[1, 1], [7, 7], [12, 12]]),
  58: spec("number-line", "Whole marks including 0", "n", "Whole", "Before 1", (t) => String(Math.round(t*8)), [
    ["0", 0, "#eaa711"], ["1", 1, "#268ff1"], ["6", 6, "#23b56e"]
  ], [[0, 0], [1, 1], [6, 6]]),
  59: spec("number-line", "Signed order -7 to 3", "n", "Value", "Compare", (t) => String(Math.round(-7+t*10)), [
    ["-7", -7, "#268ff1"], ["-2", -2, "#23b56e"], ["3", 3, "#8d4ce4"]
  ], [[-7, -7], [-2, -2], [3, 3]]),
  60: spec("fraction", "3/4 versus 1/2", "Fraction", "Size", "3/4", (t) => (t<0.5 ? "1/2" : "3/4"), [
    ["1/2", 2, "#268ff1"], ["3/4", 3, "#23b56e"], ["gcd", 1, "#eaa711"]
  ], [[1, 2], [2, 3]]),
  61: spec("number-line", "√2 between 1 and 2", "x", "Bound", "√2", (t) => (1+t).toFixed(3), [
    ["1", 1, "#268ff1"], ["√2", 1.414, "#23b56e"], ["2", 2, "#8d4ce4"]
  ], [[1, 1], [1.414, 1.414], [2, 2]]),
  62: spec("number-line", "Reals from -1 to √2", "x", "Membership", "Compare", (t) => (-1+t*2.4).toFixed(2), [
    ["-1", -1, "#268ff1"], ["0.5", 0.5, "#23b56e"], ["√2", 1.41, "#8d4ce4"]
  ], [[-1, -1], [0.5, 0.5], [1.41, 1.41]]),
  63: spec("line", "3+4i in the plane", "Re", "Im", "Modulus", (t) => String(5), [
    ["Re", 3, "#268ff1"], ["Im", 4, "#23b56e"], ["|z|", 5, "#8d4ce4"]
  ], [[3, 4], [3, -4]]),
  64: spec("bars", "5381 place values", "Place", "Value", "Digit 5", (t) => String([5000,300,80,1][Math.round(t*3)]), [
    ["1000s", 5000, "#268ff1"], ["100s", 300, "#23b56e"], ["1s", 1, "#8d4ce4"]
  ], [[1, 5000], [2, 300], [4, 1]]),
  65: spec("bars", "Factors of 12", "Factor", "Pair", "12÷d", (t) => String([1,2,3,4,6,12][Math.round(t*5)]), [
    ["2", 2, "#268ff1"], ["3", 3, "#23b56e"], ["6", 6, "#8d4ce4"]
  ], [[2, 6], [3, 4], [4, 3]]),
  66: spec("number-line", "Multiples of 6", "k", "6k", "Skip count", (t) => String(6*(1+Math.round(t*3))), [
    ["6", 6, "#268ff1"], ["12", 12, "#23b56e"], ["24", 24, "#8d4ce4"]
  ], [[1, 6], [2, 12], [4, 24]]),
  67: spec("bars", "Primes ≤ 10", "p", "Count", "Prime test", (t) => String([2,3,5,7][Math.round(t*3)]), [
    ["2", 2, "#268ff1"], ["7", 7, "#23b56e"], ["17", 17, "#8d4ce4"]
  ], [[2, 1], [3, 1], [4, 1]]),
  68: spec("bars", "12=2×2×3", "Prime", "Power", "12", (t) => String([2,2,3][Math.round(t*2)]), [
    ["2", 2, "#268ff1"], ["3", 1, "#23b56e"], ["12", 12, "#8d4ce4"]
  ], [[2, 2], [3, 1]]),
  69: spec("bars", "HCF(18,24)=6", "n", "HCF", "Overlap", (t) => "6", [
    ["18", 18, "#268ff1"], ["24", 24, "#23b56e"], ["HCF", 6, "#8d4ce4"]
  ], [[18, 6], [24, 6]]),
  70: spec("number-line", "LCM(6,8)=24", "k", "Multiple", "First common", (t) => String([6,8,24][Math.round(t*2)]), [
    ["6", 6, "#268ff1"], ["8", 8, "#23b56e"], ["24", 24, "#8d4ce4"]
  ], [[6, 6], [8, 8], [24, 24]]),
  71: spec("bars", "Digit-sum test for 9", "Digits", "Sum", "234÷9", (t) => String(9), [
    ["2", 2, "#268ff1"], ["3", 3, "#23b56e"], ["4", 4, "#8d4ce4"], ["sum", 9, "#eaa711"]
  ], [[2, 2], [3, 3], [9, 9]]),
  72: spec("circle", "23 ≡ 2 (mod 7)", "n", "Remainder", "mod 7", (t) => String(Math.round(t*6)), [
    ["23", 23, "#268ff1"], ["q", 3, "#23b56e"], ["r", 2, "#8d4ce4"]
  ], [[23, 2], [17, 2]]),
  73: spec("bars", "Binary 110 = 6", "Place", "Value", "Base 2", (t) => String([4,2,0][Math.round(t*2)]), [
    ["4", 4, "#268ff1"], ["2", 2, "#23b56e"], ["total", 6, "#8d4ce4"]
  ], [[4, 4], [2, 2], [0, 0]]),
  74: spec("fraction", "2+1/3=7/3", "Depth", "Value", "Convergent", (t) => (t<0.5 ? "7/3" : "7/5"), [
    ["2", 2, "#268ff1"], ["1/3", 0.33, "#23b56e"], ["7/3", 2.33, "#8d4ce4"]
  ], [[1, 2], [2, 2.33]]),
  75: spec("fraction", "3/4 area model", "Part", "Size", "3/4", (t) => "3/4", [
    ["3", 3, "#268ff1"], ["4", 4, "#23b56e"], ["0.75", 0.75, "#8d4ce4"]
  ], [[3, 3], [4, 4]]),
  76: spec("fraction", "3/4=6/8", "Scale", "Fraction", "×2", (t) => (t<0.5 ? "3/4" : "6/8"), [
    ["3/4", 3, "#268ff1"], ["6/8", 6, "#23b56e"], ["scale", 2, "#eaa711"]
  ], [[1, 3], [2, 6]]),
  77: spec("fraction", "3/4 vs 2/3 in twelfths", "Fraction", "Twelfths", "Greater", (t) => (t<0.5 ? "8/12" : "9/12"), [
    ["2/3", 8, "#268ff1"], ["3/4", 9, "#23b56e"], ["LCM", 12, "#eaa711"]
  ], [[8, 8], [9, 9]]),
  78: spec("fraction", "1/2+1/3=5/6", "Part", "Sixths", "Sum", (t) => "5/6", [
    ["1/2", 3, "#268ff1"], ["1/3", 2, "#23b56e"], ["5/6", 5, "#8d4ce4"]
  ], [[3, 3], [2, 2], [5, 5]]),
  79: spec("bars", "3.86 tenths and hundredths", "Place", "Digit", "0.5 vs 0.47", (t) => (t<0.5 ? "0.47" : "0.50"), [
    ["tenths", 8, "#268ff1"], ["hundredths", 6, "#23b56e"], ["0.5", 50, "#8d4ce4"]
  ], [[0.47, 47], [0.5, 50]]),
  80: spec("bars", "3.40+1.25=4.65", "Addend", "Value", "Sum", (t) => "4.65", [
    ["3.40", 3.4, "#268ff1"], ["1.25", 1.25, "#23b56e"], ["4.65", 4.65, "#8d4ce4"]
  ], [[3.4, 3.4], [4.65, 4.65]]),
  81: spec("bars", "3/4 = 0.75", "Form", "Value", "Bridge", (t) => (t<0.5 ? "3/4" : "0.75"), [
    ["3/4", 0.75, "#268ff1"], ["0.75", 0.75, "#23b56e"], ["1/8", 0.125, "#8d4ce4"]
  ], [[0.75, 0.75], [0.125, 0.125]]),
  82: spec("bars", "1/3 = 0.333...", "Repeat", "Digit", "Bar notation", (t) => (t<0.5 ? "0.333" : "0.333..."), [
    ["0.333", 3, "#268ff1"], ["1/3", 3, "#23b56e"], ["2/9", 2, "#8d4ce4"]
  ], [[1, 3], [2, 2]]),
  83: spec("bars", "2:3 scaled to 10:15", "Part", "Count", "Tape", (t) => `${Math.round(2+t*8)}:${Math.round(3+t*12)}`, [
    ["2", 2, "#268ff1"], ["3", 3, "#23b56e"], ["parts", 5, "#eaa711"]
  ], [[2, 3], [10, 15]]),
  84: spec("line", "2/3 = x/9", "x", "Cross product", "Equality", (t) => String(Math.round(2+t*8)), [
    ["2/3", 2, "#268ff1"], ["6/9", 6, "#23b56e"], ["x", 6, "#8d4ce4"]
  ], [[3, 2], [9, 6]]),
  85: spec("line", "y = 4x", "x", "y", "k=4", (t) => String(4*Math.round(1+t*6)), [
    ["x=3", 12, "#268ff1"], ["x=7", 28, "#23b56e"], ["k", 4, "#8d4ce4"]
  ], [[0, 0], [3, 12], [7, 28]]),
  86: spec("line", "xy = 24", "x", "y", "Product", (t) => String((24/(2+t*6)).toFixed(1)), [
    ["x=8", 3, "#268ff1"], ["x=3", 8, "#23b56e"], ["product", 24, "#8d4ce4"]
  ], [[3, 8], [8, 3], [12, 2]]),
  87: spec("bars", "180 km in 3 h = 60 km/h", "Quantity", "Rate", "Per one", (t) => String(Math.round(60)), [
    ["km", 180, "#268ff1"], ["h", 3, "#23b56e"], ["km/h", 60, "#8d4ce4"]
  ], [[180, 60], [45, 5]]),
  88: spec("bars", "25% of 80 = 20", "Part", "Amount", "Hundredths", (t) => String(Math.round(0.25*(40+t*80))), [
    ["25%", 25, "#268ff1"], ["part", 20, "#23b56e"], ["base", 80, "#8d4ce4"]
  ], [[25, 20], [15, 30]]),
  89: spec("bars", "80 to 100 is +25%", "Price", "Change", "Relative", (t) => (t<0.5 ? "25%" : "20%"), [
    ["old", 80, "#268ff1"], ["new", 100, "#23b56e"], ["up", 25, "#8d4ce4"]
  ], [[80, 25], [50, 20]]),
  90: spec("bars", "100 then +10% twice = 121", "Year", "Value", "Multiplier", (t) => String(Math.round(100*(1.1**(1+t)))), [
    ["start", 100, "#268ff1"], ["year1", 110, "#23b56e"], ["year2", 121, "#8d4ce4"]
  ], [[0, 100], [1, 110], [2, 121]]),
  91: spec("bars", "1 cm = 5 km", "Map cm", "Real km", "Scale", (t) => String(5*Math.round(1+t*5)), [
    ["4 cm", 20, "#268ff1"], ["scale", 5, "#23b56e"], ["12 km", 6, "#8d4ce4"]
  ], [[4, 20], [6, 12]]),
  92: spec("bars", "2x + 3 tiles", "Tile", "Count", "Net", (t) => (t<0.5 ? "2x+3" : "5x-1"), [
    ["x", 2, "#268ff1"], ["unit", 3, "#23b56e"], ["zero", 0, "#eaa711"]
  ], [[2, 3], [5, 1]]),
  93: spec("bars", "3x + 5x = 8x", "Term", "Coefficient", "Collect", (t) => (t<0.5 ? "8x" : "5y+4"), [
    ["3x", 3, "#268ff1"], ["5x", 5, "#23b56e"], ["8x", 8, "#8d4ce4"]
  ], [[3, 3], [8, 8]]),
  94: spec("line", "2x+1 at x=4", "x", "Value", "f(x)", (t) => String(2*Math.round(t*4)+1), [
    ["x=2", 5, "#268ff1"], ["x=4", 9, "#23b56e"], ["x=-3", 9, "#8d4ce4"]
  ], [[2, 5], [4, 9], [-3, 9]]),
  95: spec("bars", "4(x+3) = 4x+12", "Term", "Value", "Distribute", (t) => "4x+12", [
    ["4x", 4, "#268ff1"], ["12", 12, "#23b56e"], ["check", 16, "#8d4ce4"]
  ], [[4, 4], [12, 12]]),
  96: spec("bars", "(x+2)(x+3) parts", "Product", "Degree", "FOIL", (t) => "x^2+5x+6", [
    ["x^2", 1, "#268ff1"], ["5x", 5, "#23b56e"], ["6", 6, "#8d4ce4"]
  ], [[1, 1], [2, 5], [3, 6]]),
  97: spec("bars", "x^2+5x+6 factors", "Factor", "Root", "Reverse", (t) => "(x+2)(x+3)", [
    ["2", 2, "#268ff1"], ["3", 3, "#23b56e"], ["sum", 5, "#8d4ce4"]
  ], [[2, 3], [3, 2]]),
  98: spec("fraction", "(x^2-1)/(x-1) = x+1", "x", "Value", "Cancel", (t) => (t<0.5 ? "undefined" : "x+1"), [
    ["exclude", 2, "#268ff1"], ["2x/4", 0.5, "#23b56e"], ["x+1", 1, "#8d4ce4"]
  ], [[2, 0], [0, 1]]),
  99: spec("bars", "x^3 x^4 = x^7", "Law", "Power", "Add", (t) => "x^7", [
    ["3+4", 7, "#268ff1"], ["2*3", 6, "#23b56e"], ["5-2", 3, "#8d4ce4"]
  ], [[7, 7], [6, 6], [3, 3]]),
  100: spec("bars", "√18 = 3√2", "Surd", "Coefficient", "Square factor", (t) => "3√2", [
    ["√18", 4.24, "#268ff1"], ["3√2", 4.24, "#23b56e"], ["(√3)^2", 3, "#8d4ce4"]
  ], [[18, 3], [8, 2]]),
  101: spec("fraction", "1/√2 = √2/2", "Form", "Value", "×√2/√2", (t) => "√2/2", [
    ["1/√2", 0.707, "#268ff1"], ["√2/2", 0.707, "#23b56e"], ["conj", 1.366, "#8d4ce4"]
  ], [[1, 0.707], [2, 0.707]]),
  102: spec("bars", "(x^2+3x)+(2x^2-x)", "Power", "Coefficient", "Like powers", (t) => "3x^2+2x", [
    ["x^2", 3, "#268ff1"], ["x", 2, "#23b56e"], ["deg", 3, "#8d4ce4"]
  ], [[2, 3], [1, 2], [0, 0]]),
  103: spec("bars", "x^2+5x+6 divided by x+2", "Step", "Value", "a=-2", (t) => "x+3", [
    ["bring", 1, "#268ff1"], ["mid", 3, "#23b56e"], ["rem", 0, "#8d4ce4"]
  ], [[1, 1], [2, 3], [3, 0]]),
  104: spec("bars", "f(1) for x^2+x+1", "a", "f(a)", "Remainder", (t) => String([0,3,0][Math.round(t*2)]), [
    ["f(1) on x^2-1", 0, "#268ff1"], ["x^2+x+1", 3, "#23b56e"], ["x^3-8", 0, "#8d4ce4"]
  ], [[1, 0], [1, 3], [2, 0]]),
  105: spec("bars", "f(2) for x^2-4", "Test", "f(a)", "Factor?", (t) => (t<0.5 ? "yes" : "no"), [
    ["x^2-4", 0, "#268ff1"], ["x^2+5x+6 at -1", 2, "#23b56e"], ["x-2", 0, "#8d4ce4"]
  ], [[2, 0], [-1, 2]]),
  106: spec("bars", "(x+1)^2 vs x^2+2x+1", "x", "Both sides", "Always", (t) => "16=16", [
    ["x=3 left", 16, "#268ff1"], ["x=3 right", 16, "#23b56e"], ["a+b", 7, "#8d4ce4"]
  ], [[3, 16], [2, 7]]),
  107: spec("number-line", "x+7=12 lands on 5", "x", "Balance", "Inverse", (t) => String(Math.round(5+t*8)), [
    ["x+7", 12, "#268ff1"], ["3x", 18, "#23b56e"], ["x-4", 9, "#8d4ce4"]
  ], [[5, 12], [6, 18], [13, 9]]),
  108: spec("line", "2x+3=11 at x=4", "x", "Side", "Peel", (t) => String(2*Math.round(1+t*5)+3), [
    ["left@4", 11, "#268ff1"], ["5x-7", 18, "#23b56e"], ["3(x-2)", 12, "#8d4ce4"]
  ], [[4, 11], [5, 18], [6, 12]]),
  109: spec("fraction", "x/2+1=4", "Step", "Value", "Clear", (t) => String(6), [
    ["x/2", 3, "#268ff1"], ["x", 6, "#23b56e"], ["2/3 x", 8, "#8d4ce4"]
  ], [[2, 3], [6, 6]]),
  110: spec("bars", "I=V/R rearranged", "Subject", "Form", "R=V/I", (t) => "R=V/I", [
    ["I", 2, "#268ff1"], ["V", 10, "#23b56e"], ["R", 5, "#8d4ce4"]
  ], [[2, 5], [10, 5]]),
  111: spec("line", "y=2x+3 meets y=11", "x", "y", "Power 1", (t) => String(2*Math.round(t*6)+3), [
    ["x=4", 11, "#268ff1"], ["4-x=9", -5, "#23b56e"], ["2x+3", 11, "#8d4ce4"]
  ], [[0, 3], [4, 11]]),
  112: spec("line", "x+y=5 and x-y=1", "x", "y", "Meet", (t) => "(3,2)", [
    ["x", 3, "#268ff1"], ["y", 2, "#23b56e"], ["2x+y", 7, "#8d4ce4"]
  ], [[3, 2], [3, 1]]),
  113: spec("bars", "x+y+z=6 with x=1,y=2", "Unknown", "Value", "Planes", (t) => String(3), [
    ["x", 1, "#268ff1"], ["y", 2, "#23b56e"], ["z", 3, "#8d4ce4"]
  ], [[1, 1], [2, 2], [3, 3]]),
  114: spec("line", "x^2-5x+6=0", "x", "y", "Roots", (t) => String((t*5)**2-5*(t*5)+6), [
    ["root 2", 0, "#268ff1"], ["root 3", 0, "#23b56e"], ["disc", 0, "#8d4ce4"]
  ], [[2, 0], [3, 0], [0, 6]]),
  115: spec("line", "(x-1)(x-2)(x-3)=0", "x", "y", "Three roots", (t) => String((1+t*3-1)*(1+t*3-2)*(1+t*3-3)), [
    ["1", 0, "#268ff1"], ["2", 0, "#23b56e"], ["3", 0, "#8d4ce4"]
  ], [[1, 0], [2, 0], [3, 0]]),
  116: spec("line", "1/x = 1/2", "x", "y", "Exclude", (t) => (t<0.2 ? "excluded" : String((1/(0.5+t*3)).toFixed(2))), [
    ["1/x=1/2", 2, "#268ff1"], ["(x+1)/(x-1)", 3, "#23b56e"], ["excl", 4, "#eaa711"]
  ], [[2, 0.5], [3, 2]]),
  117: spec("line", "√x = 5", "x", "√x", "Square", (t) => String(Math.round(25*t)), [
    ["√x=5", 25, "#268ff1"], ["√(x-1)=3", 10, "#23b56e"], ["√x=-2", 0, "#eaa711"]
  ], [[25, 5], [10, 3]]),
  118: spec("line", "2^x = 8", "x", "2^x", "Same base", (t) => String(2**Math.round(t*4)), [
    ["2^3", 8, "#268ff1"], ["10^3", 1000, "#23b56e"], ["e^0", 1, "#8d4ce4"]
  ], [[3, 8], [3, 1000], [0, 1]]),
  119: spec("line", "log2 x = 3", "x", "log", "Undo", (t) => String(2**Math.round(1+t*3)), [
    ["2^3", 8, "#268ff1"], ["e^0", 1, "#23b56e"], ["10^2", 100, "#8d4ce4"]
  ], [[8, 3], [1, 0], [100, 2]]),
  120: spec("circle", "sin θ = 1/2", "θ", "sin", "Quadrants", (t) => `${Math.round(t*180)}°`, [
    ["30°", 0.5, "#268ff1"], ["150°", 0.5, "#23b56e"], ["90°", 1, "#8d4ce4"]
  ], [[30, 0.5], [150, 0.5], [90, 1]]),
  121: spec("number-line", "|x|=3", "x", "|x|", "Two sides", (t) => String(Math.abs(-3+t*6)), [
    ["|3|", 3, "#268ff1"], ["|-3|", 3, "#23b56e"], ["|x-2|=5", 5, "#8d4ce4"]
  ], [[-3, 3], [3, 3], [7, 5]]),
  122: spec("number-line", "x+3<7 is x<4", "x", "True", "Open ray", (t) => (t<0.5 ? "x<4" : "x≥5"), [
    ["x<4", 4, "#268ff1"], ["x≥5", 5, "#23b56e"], ["open", 4, "#eaa711"]
  ], [[4, 0], [5, 1]]),
  123: spec("number-line", "1<x<4 integers", "x", "In set", "And / or", (t) => String([2,3][Math.round(t)]), [
    ["2", 2, "#268ff1"], ["3", 3, "#23b56e"], ["count", 4, "#8d4ce4"]
  ], [[2, 1], [3, 1], [-1, 1]]),
  124: spec("line", "x^2-1<0", "x", "x^2-1", "Between roots", (t) => String((( -2+t*4)**2-1).toFixed(1)), [
    ["inside", -1, "#268ff1"], ["x=0", -1, "#23b56e"], ["outside", 8, "#8d4ce4"]
  ], [[-1, 0], [0, -1], [1, 0]]),
  125: spec("line", "(x-1)(x-2)(x-3) sign", "x", "Product", "Sign chart", (t) => (t<0.5 ? "negative" : "positive"), [
    ["roots", 3, "#268ff1"], ["(2,3)", -1, "#23b56e"], ["x=4", 1, "#8d4ce4"]
  ], [[1, 0], [2, 0], [3, 0], [4, 6]]),
  126: spec("line", "y > x+1 half-plane", "x", "y", "Test (0,0)", (t) => (t<0.4 ? "outside" : "inside"), [
    ["boundary", 1, "#268ff1"], ["(0,0)", 0, "#eaa711"], ["(0,2)", 2, "#23b56e"]
  ], [[0, 1], [1, 2], [0, 2]]),
  127: spec("line", "x≥0, y≥0, x+y≤4", "x", "y", "Feasible", (t) => ((1+t)<4 ? "feasible" : "out"), [
    ["(1,1)", 1, "#268ff1"], ["(5,0)", 0, "#eaa711"], ["x+2y at (0,4)", 8, "#8d4ce4"]
  ], [[1, 1], [0, 4], [4, 0]]),
  128: spec("line", "Newton and bisection on x^2=2", "x", "f(x)", "Estimate", (t) => (1+t*0.5).toFixed(3), [
    ["Newton", 1.5, "#268ff1"], ["bisect", 1.5, "#23b56e"], ["sign", 1, "#8d4ce4"]
  ], [[1, -1], [1.5, 0.25], [2, 2]]),
  129: spec("line", "y = x^2 is a function", "x", "y", "Vertical line", (t) => String(((-2+t*4)**2).toFixed(1)), [
    ["f(3)", 7, "#268ff1"], ["x^2", 1, "#23b56e"], ["x from y=4", 2, "#eaa711"]
  ], [[-2, 4], [0, 0], [2, 4], [3, 7]]),
  130: spec("line", "Domain of 1/(x-2)", "x", "y", "Exclude 2", (t) => (Math.abs(t-0.5)<0.05 ? "undefined" : (1/(t*4-2)).toFixed(2)), [
    ["exclude", 2, "#eaa711"], ["x^2 min", 0, "#268ff1"], ["√(x-3)", 3, "#23b56e"]
  ], [[3, 0], [4, 1], [7, 2]]),
};

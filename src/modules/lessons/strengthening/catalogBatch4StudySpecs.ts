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

export const batch4StudySpecs: Record<number, StudySpec> = {
  231: spec("bars", "Area comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 16)), [
    ["case A", 12.0, "#268ff1"], ["case B", 50.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 50.0], [2, 5.0]]),
  232: spec("circle", "Angle turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 9.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 9.0], [2, 9.0]]),
  233: spec("circle", "Fixed Angle turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 60.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 60.0], [1, 9.0], [2, 11.0]]),
  234: spec("bars", "Relation Checker comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 28)), [
    ["case A", 9.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 10.0], [2, 2.0]]),
  235: spec("bars", "Construction Steps comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 12)), [
    ["case A", 18.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 3.0], [2, 5.0]]),
  236: spec("line", "Translation by Vector graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 6.0, "#268ff1"], ["case B", 16.0, "#23b56e"], ["case C", 0.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 16.0], [2, 0.0]]),
  237: spec("bars", "Reflection in Line comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 20)), [
    ["case A", 18.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 0.0], [2, 7.0]]),
  238: spec("bars", "Reflection in Point comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 13.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 13.0], [1, 0.0], [2, 8.0]]),
  239: spec("circle", "Reflection in Circle turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 12.0, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 0.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 15.0], [2, 0.0]]),
  240: spec("bars", "Rotation Around Point comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 12)), [
    ["case A", 9.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 0.0], [2, 10.0]]),
  241: spec("bars", "Dilation from Point comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 16)), [
    ["case A", 12.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 0.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 11.0], [2, 0.0]]),
  242: spec("line", "Matrix Transformation graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 4.0, "#268ff1"], ["case B", 40.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 40.0], [2, 4.0]]),
  243: spec("bars", "Composite Transformations comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 24)), [
    ["case A", 15.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 0.0], [2, 4.0]]),
  244: spec("bars", "Transformation Mapping comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 28)), [
    ["case A", 17.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 17.0], [1, 0.0], [2, 5.0]]),
  245: spec("bars", "Invariants comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 12)), [
    ["case A", 12.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 0.0], [2, 6.0]]),
  246: spec("bars", "Symmetry Explorer comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 16)), [
    ["case A", 14.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 0.0], [2, 7.0]]),
  247: spec("bars", "Locus Generator comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 20)), [
    ["case A", 5.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 10.0], [2, 8.0]]),
  248: spec("bars", "Equidistant Loci comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 24)), [
    ["case A", 3.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 8.0], [2, 9.0]]),
  249: spec("bars", "Moving-Linkage Loci comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 28)), [
    ["case A", 12.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 0.0], [2, 10.0]]),
  250: spec("bars", "Envelope of Lines comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 12)), [
    ["case A", 14.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 14.0], [1, 0.0], [2, 11.0]]),
  251: spec("bars", "Dynamic Trace comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 16)), [
    ["case A", 16.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 0.0], [2, 12.0]]),
  252: spec("bars", "Conjecture Testing comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 20)), [
    ["case A", 11.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 11.0], [1, 0.0], [2, 4.0]]),
  253: spec("bars", "Exact Proof comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 24)), [
    ["case A", 13.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 13.0], [1, 0.0], [2, 5.0]]),
  254: spec("bars", "Collinearity Test comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 28)), [
    ["case A", 0.0, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 0.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 15.0], [2, 0.0]]),
  255: spec("bars", "Concurrency Test comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 12)), [
    ["case A", 17.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 17.0], [1, 0.0], [2, 7.0]]),
  256: spec("bars", "Concyclicity Test comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 16)), [
    ["case A", 11.0, "#268ff1"], ["case B", 0.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 11.0], [1, 0.0], [2, 8.0]]),
  257: spec("circle", "Angle Measurement turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=7`, [
    ["case A", 18.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 9.0], [2, 11.0]]),
  258: spec("circle", "Unit Circle turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 1.0]]),
  259: spec("circle", "Right-Triangle Ratios turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=2`, [
    ["case A", 0.6, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 0.6], [1, 9.0], [2, 9.0]]),
  260: spec("circle", "Exact Trig Values turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 1.0]]),
  261: spec("circle", "Sine Graph turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 1.0]]),
  262: spec("circle", "Cosine Graph turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=5`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 1.0]]),
  263: spec("circle", "Tangent Graph turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=6`, [
    ["case A", 0.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 1.0], [2, 1.0]]),
  264: spec("circle", "Reciprocal Trig Functions turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=7`, [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 1.0]]),
  265: spec("circle", "Inverse Trig Functions turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 30.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 1.0], [2, 1.0]]),
  266: spec("circle", "Trig Identities turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=2`, [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 1.0]]),
  267: spec("circle", "Compound-Angle Formulae turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 9.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 11.0], [2, 10.0]]),
  268: spec("circle", "Double- and Half-Angle Formulae turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 3.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 13.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 9.0], [2, 13.0]]),
  269: spec("circle", "Trig Equations turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=5`, [
    ["case A", 30.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 1.0], [2, 1.0]]),
  270: spec("circle", "Sine Rule turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=6`, [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 4.0]]),
  271: spec("circle", "Cosine Rule turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=7`, [
    ["case A", 9.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 1.0], [2, 1.0]]),
  272: spec("circle", "Triangle Area Formula turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=8`, [
    ["case A", 12.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 6.0], [2, 4.0]]),
  273: spec("circle", "Bearings turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=2`, [
    ["case A", 9.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 9.0], [2, 7.0]]),
  274: spec("circle", "Elevation and Depression turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 9.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 11.0], [2, 8.0]]),
  275: spec("circle", "Harmonic Motion turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 3.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 1.0], [2, 1.0]]),
  276: spec("circle", "Polar Trigonometry turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=5`, [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 1.0]]),
  277: spec("line", "Informal Limits graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 4.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 1.0], [2, 8.0]]),
  278: spec("line", "One-Sided Limits graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 9.0]]),
  279: spec("line", "Infinite Limits graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 10.0]]),
  280: spec("line", "Limits at Infinity graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 0.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 1.0], [2, 3.0]]),
  281: spec("line", "Continuity at a Point graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 3.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 1.0], [2, 4.0]]),
  282: spec("line", "Types of Discontinuity graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 5.0], [2, 7.0]]),
  283: spec("line", "Epsilon–Delta Visualiser graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 6.0], [2, 8.0]]),
  284: spec("line", "Average Rate of Change graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 4.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 1.0], [2, 7.0]]),
  285: spec("line", "Instantaneous Rate of Change graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 4.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 1.0], [2, 8.0]]),
  286: spec("line", "Derivative from First Principles graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 0.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 1.0], [2, 9.0]]),
  287: spec("line", "Tangent Line graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 4.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 1.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 1.0], [2, 1.0]]),
  288: spec("line", "Normal Line graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", -1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, -1.0], [1, 1.0], [2, 3.0]]),
  289: spec("line", "Derivative Graph graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 4.0], [2, 5.0]]),
  290: spec("line", "Higher Derivatives graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 6.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 1.0], [2, 5.0]]),
  291: spec("line", "Product Rule graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 6.0]]),
  292: spec("line", "Quotient Rule graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 7.0]]),
  293: spec("line", "Chain Rule graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 6.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 1.0], [2, 8.0]]),
  294: spec("line", "Implicit Differentiation graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 9.0]]),
  295: spec("line", "Parametric Differentiation graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 3.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 1.0], [2, 10.0]]),
  296: spec("line", "Critical Points graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 3.0]]),
  297: spec("line", "Increasing / Decreasing graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 0.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 1.0], [2, 4.0]]),
  298: spec("line", "Local and Global Extrema graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 5.0], [2, 5.0]]),
  299: spec("line", "Concavity graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 0.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 1.0], [2, 6.0]]),
  300: spec("line", "Inflection Points graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 0.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 1.0], [2, 7.0]]),
  301: spec("line", "Optimisation graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 8.0], [2, 8.0]]),
  302: spec("line", "Related Rates graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 9.0]]),
  303: spec("line", "Motion Analysis graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 1.0], [2, 10.0]]),
  304: spec("line", "Newton's Method graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 3.0], [2, 11.0]]),
  305: spec("line", "Taylor Polynomial graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 4.0], [2, 12.0]]),
  306: spec("circle", "Area by Rectangles turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=7`, [
    ["case A", 10.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 2.0], [2, 5.0]]),
  307: spec("line", "Riemann Sums graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 54.0, "#268ff1"], ["case B", 18.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 54.0], [1, 18.0], [2, 5.0]]),
  308: spec("line", "Definite Integral graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 9.8, "#268ff1"], ["case B", 28.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 9.8], [1, 28.0], [2, 6.0]]),
  309: spec("line", "Indefinite Integral graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 16.0, "#268ff1"], ["case B", 40.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 40.0], [2, 7.0]]),
  310: spec("line", "Fundamental Theorem graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 24.3, "#268ff1"], ["case B", 54.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 24.3], [1, 54.0], [2, 8.0]]),
  311: spec("line", "Area Between Curves graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 70.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 70.0], [1, 7.0], [2, 10.0]]),
  312: spec("line", "Substitution graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 9.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 6.0], [2, 10.0]]),
  313: spec("fraction", "Integration by Parts parts", "part", "size", "share", (t) => `${1 + Math.round(t * 7)}/6`, [
    ["case A", 24.0, "#268ff1"], ["case B", 12.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 24.0], [1, 12.0], [2, 11.0]]),
  314: spec("fraction", "Partial Fractions parts", "part", "size", "share", (t) => `${1 + Math.round(t * 8)}/7`, [
    ["case A", 50.0, "#268ff1"], ["case B", 20.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 50.0], [1, 20.0], [2, 12.0]]),
  315: spec("line", "Improper Integrals graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 9.0, "#268ff1"], ["case B", 30.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 30.0], [2, 4.0]]),
  316: spec("fraction", "Numerical Integration parts", "part", "size", "share", (t) => `${1 + Math.round(t * 3)}/4`, [
    ["case A", 14.7, "#268ff1"], ["case B", 42.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 14.7], [1, 42.0], [2, 5.0]]),
  317: spec("line", "Volume by Slicing graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 22.4, "#268ff1"], ["case B", 56.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 22.4], [1, 56.0], [2, 6.0]]),
  318: spec("line", "Disc and Washer Methods graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 8.1, "#268ff1"], ["case B", 18.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 8.1], [1, 18.0], [2, 7.0]]),
  319: spec("line", "Shell Method graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 15.0, "#268ff1"], ["case B", 30.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 15.0], [1, 30.0], [2, 8.0]]),
  320: spec("line", "Arc Length graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 18.0, "#268ff1"], ["case B", 12.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 12.0], [2, 9.0]]),
  321: spec("line", "Surface Area of Revolution graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 40.0, "#268ff1"], ["case B", 20.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 40.0], [1, 20.0], [2, 10.0]]),
  322: spec("line", "Accumulation Functions graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 75.0, "#268ff1"], ["case B", 30.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 75.0], [1, 30.0], [2, 11.0]]),
  323: spec("line", "Direction Fields graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 12.6, "#268ff1"], ["case B", 42.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 12.6], [1, 42.0], [2, 12.0]]),
  324: spec("line", "Euler's Method graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 49.0, "#268ff1"], ["case B", 14.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 49.0], [1, 14.0], [2, 4.0]]),
  325: spec("line", "Separable Equations graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 9.6, "#268ff1"], ["case B", 24.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 9.6], [1, 24.0], [2, 5.0]]),
  326: spec("line", "First-Order Linear Equations graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 16.2, "#268ff1"], ["case B", 36.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 16.2], [1, 36.0], [2, 6.0]]),
  327: spec("line", "Logistic Growth graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 25.0, "#268ff1"], ["case B", 50.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 25.0], [1, 50.0], [2, 7.0]]),
  328: spec("line", "Second-Order Equations graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 27.0, "#268ff1"], ["case B", 18.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 27.0], [1, 18.0], [2, 8.0]]),
  329: spec("line", "Phase Plane graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 56.0, "#268ff1"], ["case B", 28.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 56.0], [1, 28.0], [2, 9.0]]),
  330: spec("line", "Equilibrium and Stability graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 25.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 25.0], [1, 10.0], [2, 10.0]]),
  331: spec("line", "Discrete Dynamical Systems graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 54.0, "#268ff1"], ["case B", 18.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 54.0], [1, 18.0], [2, 11.0]]),
  332: spec("line", "Cobweb Diagrams graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 9.8, "#268ff1"], ["case B", 28.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 9.8], [1, 28.0], [2, 12.0]]),
  333: spec("line", "Chaos and Bifurcation graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 16.0, "#268ff1"], ["case B", 40.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 40.0], [2, 4.0]]),
  334: spec("number-line", "Sequence Generator values", "index", "value", "live", (t) => String(7 + Math.round(t * 11)), [
    ["case A", 16.0, "#268ff1"], ["case B", 36.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 36.0], [2, 5.0]]),
  335: spec("number-line", "Arithmetic Sequences values", "index", "value", "live", (t) => String(8 + Math.round(t * 7)), [
    ["case A", 16.0, "#268ff1"], ["case B", 49.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 49.0], [2, 6.0]]),
  336: spec("number-line", "Geometric Sequences values", "index", "value", "live", (t) => String(2 + Math.round(t * 8)), [
    ["case A", 16.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 4.0], [2, 7.0]]),
  337: spec("number-line", "Recursive Sequences values", "index", "value", "live", (t) => String(3 + Math.round(t * 9)), [
    ["case A", 16.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 9.0], [2, 8.0]]),
  338: spec("number-line", "Fibonacci Sequence values", "index", "value", "live", (t) => String(4 + Math.round(t * 10)), [
    ["case A", 16.0, "#268ff1"], ["case B", 16.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 16.0], [2, 9.0]]),
  339: spec("number-line", "Sigma Notation values", "index", "value", "live", (t) => String(5 + Math.round(t * 11)), [
    ["case A", 16.0, "#268ff1"], ["case B", 25.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 25.0], [2, 10.0]]),
  340: spec("number-line", "Arithmetic Series values", "index", "value", "live", (t) => String(6 + Math.round(t * 7)), [
    ["case A", 16.0, "#268ff1"], ["case B", 36.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 36.0], [2, 11.0]]),
  341: spec("number-line", "Geometric Series values", "index", "value", "live", (t) => String(7 + Math.round(t * 8)), [
    ["case A", 16.0, "#268ff1"], ["case B", 49.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 49.0], [2, 12.0]]),
  342: spec("number-line", "Convergence and Divergence values", "index", "value", "live", (t) => String(8 + Math.round(t * 9)), [
    ["case A", 16.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 4.0], [2, 4.0]]),
  343: spec("number-line", "Power Series values", "index", "value", "live", (t) => String(2 + Math.round(t * 10)), [
    ["case A", 16.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 9.0], [2, 5.0]]),
  344: spec("number-line", "Taylor and Maclaurin Series values", "index", "value", "live", (t) => String(3 + Math.round(t * 11)), [
    ["case A", 16.0, "#268ff1"], ["case B", 16.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 16.0], [2, 6.0]]),
  345: spec("number-line", "Binomial Series values", "index", "value", "live", (t) => String(4 + Math.round(t * 7)), [
    ["case A", 16.0, "#268ff1"], ["case B", 25.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 25.0], [2, 7.0]]),
  346: spec("number-line", "Recurrence Modelling values", "index", "value", "live", (t) => String(5 + Math.round(t * 8)), [
    ["case A", 16.0, "#268ff1"], ["case B", 36.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 36.0], [2, 8.0]]),
  347: spec("line", "Matrix Builder graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 2.0, "#268ff1"], ["case B", 48.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 48.0], [2, 7.0]]),
  348: spec("line", "Matrix Addition and Subtraction graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 8.0, "#268ff1"], ["case B", 63.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 63.0], [2, 2.0]]),
  349: spec("bars", "Scalar Multiplication comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 28)), [
    ["case A", 12.0, "#268ff1"], ["case B", 24.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 24.0], [2, 3.0]]),
  350: spec("line", "Matrix Multiplication graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 36.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 36.0], [1, 4.0], [2, 12.0]]),
  351: spec("line", "Identity Matrix graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 50.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 50.0], [1, 5.0], [2, 4.0]]),
  352: spec("bars", "Transpose comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 20)), [
    ["case A", 1.0, "#268ff1"], ["case B", 18.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 18.0], [2, 6.0]]),
  353: spec("bars", "Determinant comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 24)), [
    ["case A", 1.0, "#268ff1"], ["case B", 28.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 28.0], [2, 7.0]]),
  354: spec("line", "Matrix Inverse graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 40.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 40.0], [2, 2.0]]),
  355: spec("fraction", "Row Operations parts", "part", "size", "share", (t) => `${1 + Math.round(t * 7)}/3`, [
    ["case A", 1.0, "#268ff1"], ["case B", 18.0, "#23b56e"], ["case C", 3.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 18.0], [2, 3.0]]),
  356: spec("bars", "RREF comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 16)), [
    ["case A", 1.0, "#268ff1"], ["case B", 28.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 28.0], [2, 4.0]]),
  357: spec("bars", "Augmented Matrices comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 20)), [
    ["case A", 40.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 40.0], [1, 5.0], [2, 10.0]]),
  358: spec("bars", "Linear Transformations comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 24)), [
    ["case A", 2.0, "#268ff1"], ["case B", 14.0, "#23b56e"], ["case C", 0.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 14.0], [2, 0.0]]),
  359: spec("line", "Eigenvalues and Eigenvectors graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 3.0, "#268ff1"], ["case B", 60.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 60.0], [2, 7.0]]),
  360: spec("bars", "Basis and Dimension comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 12)), [
    ["case A", 2.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 2.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 6.0], [2, 2.0]]),
  361: spec("bars", "Linear Independence comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 16)), [
    ["case A", 12.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 12.0], [1, 3.0], [2, 5.0]]),
  362: spec("line", "Vector Spaces graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 41.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 41.0], [1, 5.0], [2, 6.0]]),
  363: spec("bars", "Gram–Schmidt comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 24)), [
    ["case A", 30.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 5.0], [2, 7.0]]),
  364: spec("bars", "Least Squares comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 28)), [
    ["case A", 42.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 6.0], [2, 8.0]]),
  365: spec("number-line", "Complex Plane values", "index", "value", "live", (t) => String(3 + Math.round(t * 7)), [
    ["case A", 11.3, "#268ff1"], ["case B", 13.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 11.3], [1, 13.0], [2, 9.0]]),
  366: spec("number-line", "Real and Imaginary Parts values", "index", "value", "live", (t) => String(4 + Math.round(t * 8)), [
    ["case A", 8.5, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 8.5], [1, 15.0], [2, 10.0]]),
  367: spec("number-line", "Complex Addition values", "index", "value", "live", (t) => String(5 + Math.round(t * 9)), [
    ["case A", 3.0, "#268ff1"], ["case B", 10.9, "#23b56e"], ["case C", 17.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 10.9], [2, 17.0]]),
  368: spec("number-line", "Complex Multiplication values", "index", "value", "live", (t) => String(6 + Math.round(t * 10)), [
    ["case A", 3.0, "#268ff1"], ["case B", 25.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 25.0], [2, 11.0]]),
  369: spec("number-line", "Complex Conjugate values", "index", "value", "live", (t) => String(7 + Math.round(t * 11)), [
    ["case A", 3.0, "#268ff1"], ["case B", 41.0, "#23b56e"], ["case C", 13.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 41.0], [2, 13.0]]),
  370: spec("number-line", "Modulus and Argument values", "index", "value", "live", (t) => String(8 + Math.round(t * 7)), [
    ["case A", 5.0, "#268ff1"], ["case B", 61.0, "#23b56e"], ["case C", 15.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 61.0], [2, 15.0]]),
  371: spec("circle", "Polar Form turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=2`, [
    ["case A", 2.0, "#268ff1"], ["case B", 8.5, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.5], [2, 10.0]]),
  372: spec("number-line", "Euler Form values", "index", "value", "live", (t) => String(3 + Math.round(t * 9)), [
    ["case A", 1.0, "#268ff1"], ["case B", 53.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 53.0], [2, 12.0]]),
  373: spec("number-line", "Powers values", "index", "value", "live", (t) => String(4 + Math.round(t * 10)), [
    ["case A", 8.0, "#268ff1"], ["case B", 73.0, "#23b56e"], ["case C", 14.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 73.0], [2, 14.0]]),
  374: spec("number-line", "Roots values", "index", "value", "live", (t) => String(5 + Math.round(t * 11)), [
    ["case A", 3.0, "#268ff1"], ["case B", 9.7, "#23b56e"], ["case C", 16.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 9.7], [2, 16.0]]),
  375: spec("number-line", "Polynomial Roots values", "index", "value", "live", (t) => String(6 + Math.round(t * 7)), [
    ["case A", 0.0, "#268ff1"], ["case B", 12.5, "#23b56e"], ["case C", 18.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 12.5], [2, 18.0]]),
  376: spec("number-line", "Möbius Transformations values", "index", "value", "live", (t) => String(7 + Math.round(t * 8)), [
    ["case A", 0.0, "#268ff1"], ["case B", 45.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 45.0], [2, 12.0]]),
  377: spec("number-line", "Complex Functions values", "index", "value", "live", (t) => String(8 + Math.round(t * 9)), [
    ["case A", 3.0, "#268ff1"], ["case B", 65.0, "#23b56e"], ["case C", 14.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 65.0], [2, 14.0]]),
  378: spec("bars", "3D Coordinate System comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 3.0, "#268ff1"], ["case B", 12.5, "#23b56e"], ["case C", 15.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 12.5], [2, 15.0]]),
  379: spec("bars", "3D Points comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 28)), [
    ["case A", 4.0, "#268ff1"], ["case B", 21.6, "#23b56e"], ["case C", 21.6, "#8d4ce4"]
  ], [[0, 4.0], [1, 21.6], [2, 21.6]]),
  380: spec("bars", "Distance in 3D comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 12)), [
    ["case A", 3.0, "#268ff1"], ["case B", 34.3, "#23b56e"], ["case C", 29.4, "#8d4ce4"]
  ], [[0, 3.0], [1, 34.3], [2, 29.4]]),
  381: spec("bars", "Lines in 3D comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 16)), [
    ["case A", 3.0, "#268ff1"], ["case B", 51.2, "#23b56e"], ["case C", 38.4, "#8d4ce4"]
  ], [[0, 3.0], [1, 51.2], [2, 38.4]]),
  382: spec("bars", "Planes comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 20)), [
    ["case A", 72.9, "#268ff1"], ["case B", 48.6, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 72.9], [1, 48.6], [2, 8.0]]),
  383: spec("bars", "Parallel and Perpendicular Planes comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 24)), [
    ["case A", 0.0, "#268ff1"], ["case B", 100.0, "#23b56e"], ["case C", 60.0, "#8d4ce4"]
  ], [[0, 0.0], [1, 100.0], [2, 60.0]]),
  384: spec("bars", "Line–Plane Intersection comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 28)), [
    ["case A", 27.0, "#268ff1"], ["case B", 54.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 27.0], [1, 54.0], [2, 10.0]]),
  385: spec("bars", "Plane–Plane Intersection comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 12)), [
    ["case A", 64.0, "#268ff1"], ["case B", 9.6, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 64.0], [1, 9.6], [2, 11.0]]),
  386: spec("circle", "Angle Between Lines turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=3`, [
    ["case A", 9.0, "#268ff1"], ["case B", 9.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 9.0], [2, 12.0]]),
  387: spec("circle", "Angle Between Planes turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=4`, [
    ["case A", 9.0, "#268ff1"], ["case B", 11.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 11.0], [2, 4.0]]),
  388: spec("circle", "Angle Between Line and Plane turn and ratio", "θ", "value", "probe", (t) => `angle ${Math.round(t * 90)}°, r=5`, [
    ["case A", 9.0, "#268ff1"], ["case B", 13.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 13.0], [2, 5.0]]),
  389: spec("bars", "Point-to-Plane Distance comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 28)), [
    ["case A", 51.2, "#268ff1"], ["case B", 38.4, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 51.2], [1, 38.4], [2, 6.0]]),
  390: spec("line", "3D Vectors graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 72.9, "#268ff1"], ["case B", 48.6, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 72.9], [1, 48.6], [2, 7.0]]),
  391: spec("bars", "Cube comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 16)), [
    ["case A", 100.0, "#268ff1"], ["case B", 60.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 100.0], [1, 60.0], [2, 8.0]]),
  392: spec("bars", "Cuboid comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 20)), [
    ["case A", 4.0, "#268ff1"], ["case B", 27.0, "#23b56e"], ["case C", 54.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 27.0], [2, 54.0]]),
  393: spec("bars", "Prism comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 24)), [
    ["case A", 4.0, "#268ff1"], ["case B", 64.0, "#23b56e"], ["case C", 9.6, "#8d4ce4"]
  ], [[0, 4.0], [1, 64.0], [2, 9.6]]),
  394: spec("bars", "Pyramid comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 28)), [
    ["case A", 4.0, "#268ff1"], ["case B", 12.5, "#23b56e"], ["case C", 15.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 12.5], [2, 15.0]]),
  395: spec("bars", "Tetrahedron comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 12)), [
    ["case A", 4.0, "#268ff1"], ["case B", 21.6, "#23b56e"], ["case C", 21.6, "#8d4ce4"]
  ], [[0, 4.0], [1, 21.6], [2, 21.6]]),
  396: spec("bars", "Regular Polyhedra comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 16)), [
    ["case A", 5.0, "#268ff1"], ["case B", 34.3, "#23b56e"], ["case C", 29.4, "#8d4ce4"]
  ], [[0, 5.0], [1, 34.3], [2, 29.4]]),
  397: spec("bars", "Cylinder comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 20)), [
    ["case A", 51.2, "#268ff1"], ["case B", 38.4, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 51.2], [1, 38.4], [2, 5.0]]),
  398: spec("bars", "Cone comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 24)), [
    ["case A", 72.9, "#268ff1"], ["case B", 48.6, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 72.9], [1, 48.6], [2, 6.0]]),
  399: spec("bars", "Sphere comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 28)), [
    ["case A", 100.0, "#268ff1"], ["case B", 60.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 100.0], [1, 60.0], [2, 7.0]]),
  400: spec("bars", "Hemisphere comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 12)), [
    ["case A", 27.0, "#268ff1"], ["case B", 54.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 27.0], [1, 54.0], [2, 8.0]]),
  401: spec("bars", "Frustum comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 16)), [
    ["case A", 64.0, "#268ff1"], ["case B", 9.6, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 64.0], [1, 9.6], [2, 9.0]]),
  402: spec("bars", "Surface of Revolution comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 20)), [
    ["case A", 12.5, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 12.5], [1, 15.0], [2, 10.0]]),
  403: spec("bars", "Extrusion comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 24)), [
    ["case A", 21.6, "#268ff1"], ["case B", 21.6, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 21.6], [1, 21.6], [2, 11.0]]),
  404: spec("bars", "Nets of Solids comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 28)), [
    ["case A", 22.0, "#268ff1"], ["case B", 34.3, "#23b56e"], ["case C", 29.4, "#8d4ce4"]
  ], [[0, 22.0], [1, 34.3], [2, 29.4]]),
  405: spec("bars", "Cross-Sections comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 12)), [
    ["case A", 51.2, "#268ff1"], ["case B", 38.4, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 51.2], [1, 38.4], [2, 4.0]]),
  406: spec("bars", "Volume comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 16)), [
    ["case A", 72.9, "#268ff1"], ["case B", 48.6, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 72.9], [1, 48.6], [2, 5.0]]),
  407: spec("bars", "Surface Area comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 20)), [
    ["case A", 100.0, "#268ff1"], ["case B", 60.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 100.0], [1, 60.0], [2, 6.0]]),
  408: spec("bars", "Euler's Polyhedron Formula comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 24)), [
    ["case A", 27.0, "#268ff1"], ["case B", 54.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 27.0], [1, 54.0], [2, 7.0]]),
  409: spec("number-line", "Transparent / X-Ray Mode values", "index", "value", "live", (t) => String(5 + Math.round(t * 11)), [
    ["case A", 64.0, "#268ff1"], ["case B", 9.6, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 64.0], [1, 9.6], [2, 8.0]]),
  410: spec("bars", "Camera Controls comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 12)), [
    ["case A", 12.5, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 12.5], [1, 15.0], [2, 9.0]]),
  411: spec("line", "Orthographic Views graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 21.6, "#268ff1"], ["case B", 21.6, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 21.6], [1, 21.6], [2, 10.0]]),
  412: spec("bars", "AR Placement comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 20)), [
    ["case A", 34.3, "#268ff1"], ["case B", 29.4, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 34.3], [1, 29.4], [2, 11.0]]),
  413: spec("line", "Surface z=f(x,y) graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 51.2, "#268ff1"], ["case B", 38.4, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 51.2], [1, 38.4], [2, 12.0]]),
  414: spec("line", "Implicit Surfaces graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 72.9, "#268ff1"], ["case B", 48.6, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 72.9], [1, 48.6], [2, 4.0]]),
  415: spec("line", "Parametric Surfaces graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 100.0, "#268ff1"], ["case B", 60.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 100.0], [1, 60.0], [2, 5.0]]),
  416: spec("line", "Space Curves graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 27.0, "#268ff1"], ["case B", 54.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 27.0], [1, 54.0], [2, 6.0]]),
  417: spec("line", "Quadric Surfaces graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 64.0, "#268ff1"], ["case B", 9.6, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 64.0], [1, 9.6], [2, 7.0]]),
  418: spec("line", "Cylindrical Coordinates graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 12.5, "#268ff1"], ["case B", 15.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 12.5], [1, 15.0], [2, 8.0]]),
  419: spec("line", "Spherical Coordinates graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 21.6, "#268ff1"], ["case B", 21.6, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 21.6], [1, 21.6], [2, 9.0]]),
  420: spec("line", "Contour Curves graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 34.3, "#268ff1"], ["case B", 29.4, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 34.3], [1, 29.4], [2, 10.0]]),
  421: spec("line", "Level Surfaces graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 51.2, "#268ff1"], ["case B", 38.4, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 51.2], [1, 38.4], [2, 11.0]]),
  422: spec("line", "Partial Derivatives graph", "x", "y", "trace", (t) => (4 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 291.6, "#268ff1"], ["case B", 19.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 291.6], [1, 19.0], [2, 12.0]]),
  423: spec("line", "Gradient Vector graph", "x", "y", "trace", (t) => (5 * (-2 + t * 6) + 6).toFixed(1), [
    ["case A", 100.0, "#268ff1"], ["case B", 60.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 100.0], [1, 60.0], [2, 4.0]]),
  424: spec("line", "Tangent Plane graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 1.0], [2, 9.0]]),
  425: spec("line", "Normal Vector graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 64.0, "#268ff1"], ["case B", 9.6, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 64.0], [1, 9.6], [2, 6.0]]),
  426: spec("line", "Double Integrals graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 25.0, "#268ff1"], ["case B", 10.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 25.0], [1, 10.0], [2, 7.0]]),
  427: spec("line", "Multivariable Optimisation graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 5).toFixed(1), [
    ["case A", 21.6, "#268ff1"], ["case B", 21.6, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 21.6], [1, 21.6], [2, 8.0]]),
  428: spec("bars", "Symbolic Evaluation comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 24)), [
    ["case A", 28.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 4.0], [2, 9.0]]),
  429: spec("bars", "Simplify comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 28)), [
    ["case A", 8.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 8.0], [1, 5.0], [2, 10.0]]),
  430: spec("bars", "Expand comparison", "item", "value", "measure", (t) => String(Math.round(5 + t * 12)), [
    ["case A", 9.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 9.0], [1, 6.0], [2, 11.0]]),
  431: spec("bars", "Factor comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 16)), [
    ["case A", 10.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 10.0], [1, 7.0], [2, 12.0]]),
  432: spec("bars", "Substitute comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 20)), [
    ["case A", 6.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 2.0], [2, 4.0]]),
  433: spec("bars", "Solve comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 24)), [
    ["case A", 4.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 3.0], [2, 5.0]]),
  434: spec("bars", "Numerical Solve comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 28)), [
    ["case A", 5.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 4.0], [2, 6.0]]),
  435: spec("bars", "Solve Systems comparison", "item", "value", "measure", (t) => String(Math.round(3 + t * 12)), [
    ["case A", 6.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 5.0], [2, 7.0]]),
  436: spec("bars", "Eliminate Variables comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 16)), [
    ["case A", 42.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 42.0], [1, 6.0], [2, 8.0]]),
  437: spec("fraction", "Partial Fractions parts", "part", "size", "share", (t) => `${1 + Math.round(t * 5)}/5`, [
    ["case A", 56.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 56.0], [1, 7.0], [2, 9.0]]),
  438: spec("bars", "Polynomial Division comparison", "item", "value", "measure", (t) => String(Math.round(6 + t * 24)), [
    ["case A", 18.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 2.0], [2, 10.0]]),
  439: spec("line", "Derivatives graph", "x", "y", "trace", (t) => (7 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 30.0, "#268ff1"], ["case B", 21.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 30.0], [1, 21.0], [2, 11.0]]),
  440: spec("line", "Integrals graph", "x", "y", "trace", (t) => (8 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", 18.0, "#268ff1"], ["case B", 12.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 12.0], [2, 12.0]]),
  441: spec("line", "Limits graph", "x", "y", "trace", (t) => (2 * (-2 + t * 6) + 4).toFixed(1), [
    ["case A", 1.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 4.0], [2, 4.0]]),
  442: spec("number-line", "Series Expansions values", "index", "value", "live", (t) => String(3 + Math.round(t * 9)), [
    ["case A", 16.0, "#268ff1"], ["case B", 36.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 36.0], [2, 5.0]]),
  443: spec("bars", "Differential Equations comparison", "item", "value", "measure", (t) => String(Math.round(4 + t * 24)), [
    ["case A", 2.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 6.0], [2, 7.0]]),
  444: spec("fraction", "Matrix Operations parts", "part", "size", "share", (t) => `${1 + Math.round(t * 5)}/7`, [
    ["case A", 49.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 49.0], [1, 2.0], [2, 7.0]]),
  445: spec("line", "Complex Calculations graph", "x", "y", "trace", (t) => (6 * (-2 + t * 6) + 3).toFixed(1), [
    ["case A", -1.0, "#268ff1"], ["case B", 73.0, "#23b56e"], ["case C", 16.0, "#8d4ce4"]
  ], [[0, -1.0], [1, 73.0], [2, 16.0]]),
  446: spec("bars", "Assumptions comparison", "item", "value", "measure", (t) => String(Math.round(7 + t * 16)), [
    ["case A", 36.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 36.0], [1, 4.0], [2, 9.0]]),
  447: spec("bars", "Exact / Numeric Toggle comparison", "item", "value", "measure", (t) => String(Math.round(8 + t * 20)), [
    ["case A", 50.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 50.0], [1, 5.0], [2, 10.0]]),
  448: spec("bars", "Step-by-Step Algebra comparison", "item", "value", "measure", (t) => String(Math.round(2 + t * 24)), [
    ["case A", 18.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 18.0], [1, 6.0], [2, 11.0]]),
  449: spec("line", "CAS-to-Graph Link graph", "x", "y", "trace", (t) => (3 * (-2 + t * 6) + 7).toFixed(1), [
    ["case A", 28.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 28.0], [1, 7.0], [2, 12.0]]),
  450: spec("number-line", "Data Entry Grid values", "index", "value", "live", (t) => String(4 + Math.round(t * 7)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 4.0]]),
  451: spec("number-line", "Cell Formulas values", "index", "value", "live", (t) => String(5 + Math.round(t * 8)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 5.0]]),
  452: spec("number-line", "Fill and Copy values", "index", "value", "live", (t) => String(6 + Math.round(t * 9)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 6.0]]),
  453: spec("number-line", "Relative References values", "index", "value", "live", (t) => String(7 + Math.round(t * 10)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 7.0]]),
  454: spec("number-line", "Absolute References values", "index", "value", "live", (t) => String(8 + Math.round(t * 11)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 8.0]]),
  455: spec("number-line", "Sorting values", "index", "value", "live", (t) => String(2 + Math.round(t * 7)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 9.0]]),
  456: spec("number-line", "Filtering values", "index", "value", "live", (t) => String(3 + Math.round(t * 8)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 10.0]]),
  457: spec("number-line", "Lists from Cells values", "index", "value", "live", (t) => String(4 + Math.round(t * 9)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 11.0]]),
  458: spec("number-line", "Points from Columns values", "index", "value", "live", (t) => String(5 + Math.round(t * 10)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 12.0]]),
  459: spec("number-line", "Matrices from Cells values", "index", "value", "live", (t) => String(6 + Math.round(t * 11)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 4.0]]),
  460: spec("number-line", "Frequency Tables values", "index", "value", "live", (t) => String(7 + Math.round(t * 7)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 5.0]]),
  461: spec("number-line", "Summary Statistics values", "index", "value", "live", (t) => String(8 + Math.round(t * 8)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 6.0]]),
  462: spec("number-line", "Spreadsheet Charts values", "index", "value", "live", (t) => String(2 + Math.round(t * 9)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 7.0]]),
  463: spec("number-line", "Regression from Data values", "index", "value", "live", (t) => String(3 + Math.round(t * 10)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 1.4]]),
  464: spec("number-line", "Dynamic Cell Links values", "index", "value", "live", (t) => String(4 + Math.round(t * 11)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 9.0]]),
  465: spec("number-line", "Import CSV values", "index", "value", "live", (t) => String(5 + Math.round(t * 7)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 10.0]]),
  466: spec("number-line", "Export Data values", "index", "value", "live", (t) => String(6 + Math.round(t * 8)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 11.0]]),
  467: spec("number-line", "Data Types values", "index", "value", "live", (t) => String(7 + Math.round(t * 9)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 12.0]]),
  468: spec("number-line", "Frequency Tables values", "index", "value", "live", (t) => String(8 + Math.round(t * 10)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 4.0]]),
  469: spec("number-line", "Grouped Frequency Tables values", "index", "value", "live", (t) => String(2 + Math.round(t * 11)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 5.0]]),
  470: spec("number-line", "Mean values", "index", "value", "live", (t) => String(3 + Math.round(t * 7)), [
    ["case A", 7.0, "#268ff1"], ["case B", 1.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 1.0], [2, 6.0]]),
  471: spec("number-line", "Median values", "index", "value", "live", (t) => String(4 + Math.round(t * 8)), [
    ["case A", 6.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 8.0], [2, 7.0]]),
  472: spec("number-line", "Mode values", "index", "value", "live", (t) => String(5 + Math.round(t * 9)), [
    ["case A", 3.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 6.0], [2, 4.0]]),
  473: spec("number-line", "Weighted Mean values", "index", "value", "live", (t) => String(6 + Math.round(t * 10)), [
    ["case A", 6.0, "#268ff1"], ["case B", 1.75, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 1.75], [2, 9.0]]),
  474: spec("number-line", "Range values", "index", "value", "live", (t) => String(7 + Math.round(t * 11)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 1.4]]),
  475: spec("fraction", "Quartiles and IQR parts", "part", "size", "share", (t) => `${1 + Math.round(t * 8)}/3`, [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 1.4]]),
  476: spec("number-line", "Variance and Standard Deviation values", "index", "value", "live", (t) => String(2 + Math.round(t * 8)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 1.4]]),
  477: spec("fraction", "Percentiles parts", "part", "size", "share", (t) => `${1 + Math.round(t * 3)}/5`, [
    ["case A", 80.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 80.0], [1, 5.0], [2, 5.0]]),
  478: spec("number-line", "Z-Scores values", "index", "value", "live", (t) => String(4 + Math.round(t * 10)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 1.4]]),
  479: spec("number-line", "Outliers values", "index", "value", "live", (t) => String(5 + Math.round(t * 11)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 6.0]]),
  480: spec("number-line", "Box Plot values", "index", "value", "live", (t) => String(6 + Math.round(t * 7)), [
    ["case A", 1.0, "#268ff1"], ["case B", 2.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 1.0], [1, 2.0], [2, 8.0]]),
  481: spec("number-line", "Dot Plot values", "index", "value", "live", (t) => String(7 + Math.round(t * 8)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 8.0]]),
  482: spec("number-line", "Stem-and-Leaf Plot values", "index", "value", "live", (t) => String(8 + Math.round(t * 9)), [
    ["case A", 7.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 7.0], [1, 4.0], [2, 6.0]]),
  483: spec("number-line", "Histogram values", "index", "value", "live", (t) => String(2 + Math.round(t * 10)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 10.0]]),
  484: spec("number-line", "Frequency Polygon values", "index", "value", "live", (t) => String(3 + Math.round(t * 11)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 11.0]]),
  485: spec("number-line", "Cumulative Frequency Curve values", "index", "value", "live", (t) => String(4 + Math.round(t * 7)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 12.0]]),
  486: spec("number-line", "Bar and Pie Charts values", "index", "value", "live", (t) => String(5 + Math.round(t * 8)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 4.0]]),
  487: spec("number-line", "Scatter Plot values", "index", "value", "live", (t) => String(6 + Math.round(t * 9)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 5.0]]),
  488: spec("number-line", "Time-Series Plot values", "index", "value", "live", (t) => String(7 + Math.round(t * 10)), [
    ["case A", 16.0, "#268ff1"], ["case B", 16.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 16.0], [1, 16.0], [2, 6.0]]),
  489: spec("number-line", "Correlation Coefficient values", "index", "value", "live", (t) => String(8 + Math.round(t * 11)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 1.4]]),
  490: spec("number-line", "Linear Regression values", "index", "value", "live", (t) => String(2 + Math.round(t * 7)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 1.4]]),
  491: spec("number-line", "Polynomial Regression values", "index", "value", "live", (t) => String(3 + Math.round(t * 8)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 1.4]]),
  492: spec("number-line", "Exponential Regression values", "index", "value", "live", (t) => String(4 + Math.round(t * 9)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 1.4]]),
  493: spec("number-line", "Logarithmic Regression values", "index", "value", "live", (t) => String(5 + Math.round(t * 10)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 1.4]]),
  494: spec("number-line", "Power Regression values", "index", "value", "live", (t) => String(6 + Math.round(t * 11)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 1.4]]),
  495: spec("number-line", "Logistic Regression values", "index", "value", "live", (t) => String(7 + Math.round(t * 7)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 1.4]]),
  496: spec("number-line", "Sinusoidal Regression values", "index", "value", "live", (t) => String(8 + Math.round(t * 8)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 1.4]]),
  497: spec("number-line", "Residual Plot values", "index", "value", "live", (t) => String(2 + Math.round(t * 9)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 1.4]]),
  498: spec("number-line", "Model Comparison values", "index", "value", "live", (t) => String(3 + Math.round(t * 10)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 7.0]]),
  499: spec("number-line", "Interpolation and Extrapolation values", "index", "value", "live", (t) => String(4 + Math.round(t * 11)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 8.0]]),
  500: spec("number-line", "Sample Spaces values", "index", "value", "live", (t) => String(5 + Math.round(t * 7)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 6.0]]),
  501: spec("number-line", "Events values", "index", "value", "live", (t) => String(6 + Math.round(t * 8)), [
    ["case A", 3.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 5.0], [2, 5.0]]),
  502: spec("number-line", "Probability Scale values", "index", "value", "live", (t) => String(7 + Math.round(t * 9)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 1.4]]),
  503: spec("number-line", "Complement Rule values", "index", "value", "live", (t) => String(8 + Math.round(t * 10)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 1.4]]),
  504: spec("number-line", "Addition Rule values", "index", "value", "live", (t) => String(2 + Math.round(t * 11)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 1.4]]),
  505: spec("number-line", "Multiplication Rule values", "index", "value", "live", (t) => String(3 + Math.round(t * 7)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 1.4]]),
  506: spec("number-line", "Independent Events values", "index", "value", "live", (t) => String(4 + Math.round(t * 8)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 6.0]]),
  507: spec("number-line", "Mutually Exclusive Events values", "index", "value", "live", (t) => String(5 + Math.round(t * 9)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 1.4]]),
  508: spec("number-line", "Conditional Probability values", "index", "value", "live", (t) => String(6 + Math.round(t * 10)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 1.4]]),
  509: spec("number-line", "Tree Diagrams values", "index", "value", "live", (t) => String(7 + Math.round(t * 11)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 9.0]]),
  510: spec("number-line", "Venn Diagrams values", "index", "value", "live", (t) => String(8 + Math.round(t * 7)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 10.0]]),
  511: spec("number-line", "Two-Way Tables values", "index", "value", "live", (t) => String(2 + Math.round(t * 8)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 11.0]]),
  512: spec("number-line", "Bayes' Theorem values", "index", "value", "live", (t) => String(3 + Math.round(t * 9)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 1.4]]),
  513: spec("number-line", "Expected Value values", "index", "value", "live", (t) => String(4 + Math.round(t * 10)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 4.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 4.0]]),
  514: spec("number-line", "Simulation values", "index", "value", "live", (t) => String(5 + Math.round(t * 11)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 5.0]]),
  515: spec("number-line", "Law of Large Numbers values", "index", "value", "live", (t) => String(6 + Math.round(t * 7)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 6.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 6.0]]),
  516: spec("number-line", "Distribution Calculator values", "index", "value", "live", (t) => String(7 + Math.round(t * 8)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 7.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 7.0]]),
  517: spec("number-line", "Probability Plot values", "index", "value", "live", (t) => String(8 + Math.round(t * 9)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 8.0]]),
  518: spec("number-line", "Cumulative Distribution values", "index", "value", "live", (t) => String(2 + Math.round(t * 10)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 1.4]]),
  519: spec("number-line", "Interval / Tail Probability values", "index", "value", "live", (t) => String(3 + Math.round(t * 11)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 10.0]]),
  520: spec("number-line", "Inverse Probability values", "index", "value", "live", (t) => String(4 + Math.round(t * 7)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 11.0]]),
  521: spec("number-line", "Bernoulli Distribution values", "index", "value", "live", (t) => String(5 + Math.round(t * 8)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 1.4]]),
  522: spec("number-line", "Binomial Distribution values", "index", "value", "live", (t) => String(6 + Math.round(t * 9)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 1.4]]),
  523: spec("number-line", "Hypergeometric Distribution values", "index", "value", "live", (t) => String(7 + Math.round(t * 10)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 5.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 5.0]]),
  524: spec("number-line", "Poisson Distribution values", "index", "value", "live", (t) => String(8 + Math.round(t * 11)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 1.4]]),
  525: spec("number-line", "Geometric Distribution values", "index", "value", "live", (t) => String(2 + Math.round(t * 7)), [
    ["case A", 5.0, "#268ff1"], ["case B", 5.0, "#23b56e"], ["case C", 1.4, "#8d4ce4"]
  ], [[0, 5.0], [1, 5.0], [2, 1.4]]),
  526: spec("number-line", "Negative Binomial Distribution values", "index", "value", "live", (t) => String(3 + Math.round(t * 8)), [
    ["case A", 6.0, "#268ff1"], ["case B", 4.0, "#23b56e"], ["case C", 8.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 4.0], [2, 8.0]]),
  527: spec("number-line", "Uniform Distribution values", "index", "value", "live", (t) => String(4 + Math.round(t * 9)), [
    ["case A", 6.0, "#268ff1"], ["case B", 3.0, "#23b56e"], ["case C", 9.0, "#8d4ce4"]
  ], [[0, 6.0], [1, 3.0], [2, 9.0]]),
  528: spec("number-line", "Normal Distribution values", "index", "value", "live", (t) => String(5 + Math.round(t * 10)), [
    ["case A", 2.0, "#268ff1"], ["case B", 8.0, "#23b56e"], ["case C", 10.0, "#8d4ce4"]
  ], [[0, 2.0], [1, 8.0], [2, 10.0]]),
  529: spec("number-line", "Student t Distribution values", "index", "value", "live", (t) => String(6 + Math.round(t * 11)), [
    ["case A", 3.0, "#268ff1"], ["case B", 7.0, "#23b56e"], ["case C", 11.0, "#8d4ce4"]
  ], [[0, 3.0], [1, 7.0], [2, 11.0]]),
  530: spec("number-line", "Chi-Square Distribution values", "index", "value", "live", (t) => String(7 + Math.round(t * 7)), [
    ["case A", 4.0, "#268ff1"], ["case B", 6.0, "#23b56e"], ["case C", 12.0, "#8d4ce4"]
  ], [[0, 4.0], [1, 6.0], [2, 12.0]]),
};

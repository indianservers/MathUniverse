import { useEffect, useMemo, useState } from "react";
import FormulaPanel from "../../components/FormulaPanel";
import ProofControls from "../../components/ProofControls";
import StepPanel from "../../components/StepPanel";
import SymbolLegendPanel from "../../components/SymbolLegendPanel";
import VisualProofLayout from "../../components/VisualProofLayout";
import type { ProofStep, VisualProof, VisualProofCategory } from "../../data/proofTypes";

type Point = { x: number; y: number };

const steps: ProofStep[] = [
  {
    id: "draw-triangle",
    title: "Draw the triangle",
    description: "Start with the included angle theta. Side a and side b meet at the same joint, and side c closes the triangle.",
    focusLabel: "triangle a, b, c",
  },
  {
    id: "draw-circle",
    title: "Draw the circle",
    description: "Place the circle center at the left end of side a. Its radius is a, so the circle passes through the a-b joint.",
    focusLabel: "circle radius a",
  },
  {
    id: "extend-line",
    title: "Extend the line",
    description: "Extend the base through the circle. The left extra segment is also a, so the full diameter is 2a.",
    focusLabel: "extended diameter",
  },
  {
    id: "expand-side-a",
    title: "Expand a again",
    description: "Extend the side-c line downward until it touches the circle. Since the circle radius is a, this new segment from A to the circle is also a.",
    focusLabel: "second radius a",
  },
  {
    id: "expand-a-minus-c",
    title: "Expand a - c",
    description: "Now extend the same line upward past C until it reaches the circle. The remaining top segment is the difference a - c.",
    focusLabel: "a - c segment",
  },
  {
    id: "draw-helper-triangle",
    title: "Draw the helper triangle",
    description: "Join the left end of the diameter to the upper circle point, then join that point back to B. This dashed triangle is the next comparison shape.",
    focusLabel: "dashed helper triangle",
  },
  {
    id: "fill-helper-triangle",
    title: "Fill the helper triangle",
    description: "Shade the large helper triangle. Its base is the full diameter 2a, and its top edge is the new slanted helper side.",
    focusLabel: "yellow helper area",
  },
  {
    id: "separate-thales-triangle",
    title: "Separate the Thales triangle",
    description: "Move a copy of the yellow helper triangle to the side. Because its base is a diameter, Thales theorem makes the top angle a right angle.",
    focusLabel: "right-angled helper triangle",
  },
  {
    id: "measure-cosine-side",
    title: "Measure the cosine side",
    description: "In the right triangle, the side next to theta is the projection of the 2a diameter, so it has length 2a cos(theta).",
    focusLabel: "2a cos theta",
  },
  {
    id: "transfer-remainder",
    title: "Transfer the remainder",
    description: "The original side b already uses part of that slanted helper side. The leftover red piece is 2a cos(theta) - b.",
    focusLabel: "2a cos theta minus b",
  },
  {
    id: "intersecting-chords",
    title: "Use intersecting chords",
    description: "Two chords meet at C. The product of the two pieces on one chord equals the product of the two pieces on the other chord.",
    focusLabel: "intersecting chords theorem",
  },
  {
    id: "simplify-chords",
    title: "Simplify the products",
    description: "Expanding the chord equation gives 2ab cos(theta) - b squared = a squared - c squared.",
    focusLabel: "2ab cos theta - b squared",
  },
  {
    id: "rearrange-equation",
    title: "Rearrange the equation",
    description: "Move b squared to the right and c squared to the left. This gives 2ab cos(theta) + c squared = a squared + b squared.",
    focusLabel: "2ab cos theta plus c squared",
  },
  {
    id: "connect-formula",
    title: "Connect to the formula",
    description: "The construction prepares the correction term. When theta is 90 degrees, the cosine correction becomes zero.",
    focusLabel: "2ab cos theta",
  },
];

const formulas = [
  "Known sides around the angle: a and b",
  "Opposite side: c",
  "Law of cosines: c^2 = a^2 + b^2 - 2ab cos(theta)",
  "If theta = 90 degrees, cos(theta) = 0, so c^2 = a^2 + b^2",
];

export default function LawOfCosinesCircleConstructionProof({ category, proof }: { category: VisualProofCategory; proof: VisualProof }) {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [formulaVisible, setFormulaVisible] = useState(true);
  const [sideA, setSideA] = useState(5.2);
  const [sideB, setSideB] = useState(4.6);
  const [theta, setTheta] = useState(46);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const timer = window.setInterval(() => {
      setActiveStep((step) => {
        if (step >= steps.length - 1) {
          setIsPlaying(false);
          return step;
        }
        return step + 1;
      });
    }, 1200);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const geometry = useMemo(() => buildGeometry(sideA, sideB, theta), [sideA, sideB, theta]);
  const cSquared = sideA ** 2 + sideB ** 2 - 2 * sideA * sideB * Math.cos(degToRad(theta));
  const sideC = Math.sqrt(Math.max(0, cSquared));

  function reset() {
    setActiveStep(0);
    setIsPlaying(false);
    setLabelsVisible(true);
    setFormulaVisible(true);
    setSideA(5.2);
    setSideB(4.6);
    setTheta(46);
  }

  return (
    <VisualProofLayout
      category={category}
      proof={proof}
      visual={<ConstructionVisual geometry={geometry} activeStep={activeStep} labelsVisible={labelsVisible} sideA={sideA} sideB={sideB} sideC={sideC} theta={theta} />}
      controls={
        <div className="space-y-4">
          <ProofControls
            activeStep={activeStep}
            totalSteps={steps.length}
            isPlaying={isPlaying}
            labelsVisible={labelsVisible}
            formulaVisible={formulaVisible}
            playLabel="Play law of cosines construction"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onReset={reset}
            onPrevious={() => {
              setIsPlaying(false);
              setActiveStep((step) => Math.max(0, step - 1));
            }}
            onNext={() => {
              setIsPlaying(false);
              setActiveStep((step) => Math.min(steps.length - 1, step + 1));
            }}
            onToggleLabels={() => setLabelsVisible((value) => !value)}
            onToggleFormula={() => setFormulaVisible((value) => !value)}
          />
          <section className="rounded-xl border border-slate-200 bg-white/88 p-4 dark:border-white/10 dark:bg-white/[0.05]" aria-label="Construction measurements">
            <h2 className="text-base font-black text-slate-950 dark:text-white">Measurements</h2>
            <Slider label="side a" value={sideA} min={4.8} max={7} step={0.1} onChange={setSideA} />
            <Slider label="side b" value={sideB} min={3} max={5.3} step={0.1} onChange={setSideB} />
            <Slider label="theta" value={theta} min={25} max={55} step={1} suffix="deg" onChange={setTheta} />
            <div className="mt-3 rounded-lg bg-slate-950 px-3 py-2 text-sm font-black text-cyan-100">
              c = {sideC.toFixed(2)} | c^2 = {cSquared.toFixed(2)}
            </div>
          </section>
        </div>
      }
      steps={<StepPanel steps={steps} activeStep={activeStep} onSelectStep={(step) => { setIsPlaying(false); setActiveStep(step); }} />}
      symbolLegend={
        <SymbolLegendPanel
          meanings={[
            { symbol: "a", meaning: "base side from the circle center to the angle joint", value: sideA.toFixed(1) },
            { symbol: "b", meaning: "second side meeting side a at angle theta", value: sideB.toFixed(1) },
            { symbol: "c", meaning: "side opposite the included angle theta", value: sideC.toFixed(2) },
            { symbol: "theta", meaning: "included angle between sides a and b", value: theta, unit: "degrees" },
            { symbol: "2a", meaning: "diameter after extending the base through the circle", value: (2 * sideA).toFixed(1) },
            { symbol: "a-c", meaning: "remaining part of the circle radius after side c", value: Math.max(0, sideA - sideC).toFixed(2) },
          ]}
        />
      }
      formula={<FormulaPanel visible={formulaVisible} title="Law of cosines connection" formulas={formulas} />}
      conceptNotes={
        <div className="space-y-2">
          <p>The circle is not decoration: its radius is deliberately the same length as side a. That makes the right endpoint of a sit exactly on the circle.</p>
          <p>Extending the base creates a diameter of length 2a. This construction is a geometric setup for seeing why the opposite side c needs the correction term 2ab cos(theta).</p>
        </div>
      }
      reflectionQuestions={[
        "Which point is the joint where sides a and b meet?",
        "Why does the circle pass through that joint?",
        "What changes in the formula when theta becomes 90 degrees?",
      ]}
    />
  );
}

function ConstructionVisual({
  geometry,
  activeStep,
  labelsVisible,
  sideA,
  sideB,
  sideC,
  theta,
}: {
  geometry: ReturnType<typeof buildGeometry>;
  activeStep: number;
  labelsVisible: boolean;
  sideA: number;
  sideB: number;
  sideC: number;
  theta: number;
}) {
  const { leftPoint, joint, topPoint, extensionPoint, lowerCPoint, upperCPoint, helperPoint, circleRadius, circleCenter, cAngleDegrees, helperSideAngle } = geometry;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const showCircle = activeStep >= 1;
  const showExtension = activeStep >= 2;
  const showSecondA = activeStep >= 3;
  const showAMinusC = activeStep >= 4;
  const showHelperTriangle = activeStep >= 5;
  const showChordTheorem = activeStep >= 10;
  const showSimplifiedChordEquation = activeStep >= 11;
  const showRearrangedChordEquation = activeStep >= 12;
  const showHelperFill = activeStep >= 6 && !showChordTheorem;
  const showSeparatedTriangle = activeStep >= 7 && !showChordTheorem;
  const showCosineSide = activeStep >= 8;
  const showTransferredRemainder = activeStep >= 9;
  const showFormula = activeStep >= 13;
  const separated = buildSeparatedTriangle(geometry);

  return (
    <div className="bg-slate-950 p-2 sm:p-4" data-testid="visual-proof-primary-visual">
      <svg viewBox="0 0 900 540" role="img" aria-label="Animated law of cosines circle construction" className="h-[min(62vh,560px)] min-h-[420px] w-full rounded-xl bg-black">
        <defs>
          <filter id="law-cosines-soft-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <marker id="law-cosines-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#e0f2fe" />
          </marker>
        </defs>

        <rect x="0" y="0" width="900" height="540" fill="#020617" />
        <Grid />

        {showCircle ? (
          <g>
            <AnimatedCircle center={circleCenter} radius={circleRadius} circumference={circleCircumference} />
            <circle cx={circleCenter.x} cy={circleCenter.y} r="5" fill="#f0abfc" filter="url(#law-cosines-soft-glow)" />
            <AnimatedLine from={circleCenter} to={joint} color="#f0abfc" width={3} dash="8 7" delay="0.65s" />
            {labelsVisible ? <Label x={circleCenter.x + circleRadius / 2 - 14} y={circleCenter.y - 16} text="radius a" color="#f5d0fe" /> : null}
          </g>
        ) : null}

        {showExtension ? (
          <g>
            <AnimatedLine from={extensionPoint} to={joint} color="#e2e8f0" width={4} delay="0s" />
            <circle cx={extensionPoint.x} cy={extensionPoint.y} r="5" fill="#f0abfc" filter="url(#law-cosines-soft-glow)" />
            {labelsVisible ? (
              <>
                <Label x={(extensionPoint.x + leftPoint.x) / 2 - 10} y={joint.y + 38} text="a" />
                <Label x={(extensionPoint.x + joint.x) / 2 - 16} y={joint.y - 28} text="2a" color="#f5d0fe" />
              </>
            ) : null}
          </g>
        ) : null}

        {showSecondA ? (
          <g>
            <AnimatedLine from={leftPoint} to={lowerCPoint} color="#f8fafc" width={4} delay="0s" />
            <circle cx={lowerCPoint.x} cy={lowerCPoint.y} r="5" fill="#f0abfc" filter="url(#law-cosines-soft-glow)" />
            {labelsVisible ? (
              <RotatedLabel
                point={midpoint(leftPoint, lowerCPoint)}
                angle={cAngleDegrees}
                text="a"
                color="#f8fafc"
                dx={-22}
                dy={-10}
              />
            ) : null}
          </g>
        ) : null}

        {showAMinusC ? (
          <g>
            <AnimatedLine from={topPoint} to={upperCPoint} color="#f8fafc" width={4} delay="0s" />
            <circle cx={upperCPoint.x} cy={upperCPoint.y} r="5" fill="#f0abfc" filter="url(#law-cosines-soft-glow)" />
            {labelsVisible ? (
              <RotatedLabel
                point={midpoint(topPoint, upperCPoint)}
                angle={cAngleDegrees}
                text="a - c"
                color="#f8fafc"
                dx={10}
                dy={-10}
              />
            ) : null}
          </g>
        ) : null}

        <g>
          <polygon points={`${leftPoint.x},${leftPoint.y} ${joint.x},${joint.y} ${topPoint.x},${topPoint.y}`} fill="#0e7490" opacity="0.72" stroke="#e0f2fe" strokeWidth="4" strokeLinejoin="round" />
          {showHelperFill ? (
            <polygon
              points={`${extensionPoint.x},${extensionPoint.y} ${helperPoint.x},${helperPoint.y} ${joint.x},${joint.y}`}
              fill="#facc15"
              opacity="0.72"
              stroke="#fde047"
              strokeWidth="3"
              strokeDasharray="7 7"
              strokeLinejoin="round"
              style={{ animation: "lawCosinesFadeIn 650ms ease-out both" }}
            />
          ) : null}
          <AnimatedLine from={leftPoint} to={joint} color="#ffffff" delay="0s" />
          <AnimatedLine from={joint} to={topPoint} color="#ffffff" delay="0.16s" />
          <AnimatedLine from={topPoint} to={leftPoint} color="#ffffff" delay="0.32s" />
          <AngleArc center={joint} radius={44} theta={theta} />

          <PointDot point={leftPoint} label="A" />
          <PointDot point={joint} label="B" highlight />
          <PointDot point={topPoint} label="C" />

          {labelsVisible ? (
            <>
              <Label x={(leftPoint.x + joint.x) / 2 - 12} y={joint.y + 34} text="a" />
              <Label x={(joint.x + topPoint.x) / 2 + 14} y={(joint.y + topPoint.y) / 2 - 8} text="b" />
              <RotatedLabel point={midpoint(leftPoint, topPoint)} angle={cAngleDegrees} text="c" dx={-34} dy={-10} />
              <Label x={joint.x - 72} y={joint.y - 22} text="theta" color="#fef3c7" />
            </>
          ) : null}
        </g>

        {showHelperTriangle ? (
          <g>
            <AnimatedLine from={extensionPoint} to={helperPoint} color="#fde047" width={3} dash="7 7" delay="0s" />
            <AnimatedLine from={helperPoint} to={joint} color="#fde047" width={3} dash="7 7" delay="0.25s" />
            <circle cx={helperPoint.x} cy={helperPoint.y} r="4" fill="#fde047" filter="url(#law-cosines-soft-glow)" />
            {labelsVisible && !showHelperFill ? <Label x={(helperPoint.x + joint.x) / 2 + 14} y={(helperPoint.y + joint.y) / 2 - 10} text="helper" color="#fef08a" /> : null}
          </g>
        ) : null}

        {showChordTheorem ? (
          <g style={{ animation: "lawCosinesFadeIn 550ms ease-out both" }}>
            <AnimatedLine from={helperPoint} to={topPoint} color="#fb6a5b" width={5} delay="0s" />
            <AnimatedLine from={topPoint} to={joint} color="#67e8f9" width={5} delay="0.12s" />
            <AnimatedLine from={lowerCPoint} to={topPoint} color="#fb6a5b" width={5} delay="0.24s" />
            <AnimatedLine from={topPoint} to={upperCPoint} color="#67e8f9" width={5} delay="0.36s" />
            {labelsVisible ? (
              <>
                <RotatedLabel point={midpoint(helperPoint, topPoint)} angle={helperSideAngle} text="2a cos(theta) - b" color="#f8fafc" dx={-92} dy={-15} />
                <RotatedLabel point={midpoint(topPoint, upperCPoint)} angle={cAngleDegrees} text="a - c" color="#f8fafc" dx={14} dy={-10} />
                <RotatedLabel point={midpoint(lowerCPoint, topPoint)} angle={cAngleDegrees} text="a + c" color="#f8fafc" dx={-52} dy={-10} />
              </>
            ) : null}
          </g>
        ) : null}

        {showChordTheorem && !showFormula ? (
          <g style={{ animation: "lawCosinesFadeIn 600ms ease-out both" }}>
            <text x="604" y="140" fill="#f8fafc" fontSize="19" fontWeight="900">
              The intersecting chords theorem
            </text>
            <text x="680" y="170" fill="#f8fafc" fontSize="19" fontWeight="900">
              implies that
            </text>
            {showSimplifiedChordEquation ? (
              <>
                <text x="604" y={showRearrangedChordEquation ? 230 : 244} fill="#f8fafc" fontSize="28" fontWeight="900" fontFamily="Georgia, serif">
                  2ab cos(theta) - b^2
                </text>
                <text x="690" y={showRearrangedChordEquation ? 276 : 294} fill="#f8fafc" fontSize="28" fontWeight="900" fontFamily="Georgia, serif">
                  = a^2 - c^2
                </text>
                {showRearrangedChordEquation ? (
                  <g style={{ animation: "lawCosinesFadeIn 550ms ease-out both" }}>
                    <rect x="584" y="314" width="300" height="58" fill="none" stroke="#f8fafc" strokeWidth="3" />
                    <text x="598" y="353" fill="#f8fafc" fontSize="22" fontWeight="900" fontFamily="Georgia, serif">
                      2ab cos(theta) + c^2 = a^2 + b^2
                    </text>
                  </g>
                ) : null}
              </>
            ) : (
              <>
                <text x="590" y="222" fill="#f8fafc" fontSize="22" fontWeight="900" fontFamily="Georgia, serif">
                  (2a cos(theta) - b) . b
                </text>
                <text x="700" y="262" fill="#f8fafc" fontSize="22" fontWeight="900" fontFamily="Georgia, serif">
                  =
                </text>
                <text x="616" y="302" fill="#f8fafc" fontSize="22" fontWeight="900" fontFamily="Georgia, serif">
                  (a - c) . (a + c)
                </text>
              </>
            )}
          </g>
        ) : null}

        {showFormula ? (
          <g>
            <rect x="584" y="58" width="258" height="142" rx="18" fill="#0f172a" stroke="#67e8f9" strokeWidth="2" opacity="0.96" />
            <text x="610" y="92" fill="#67e8f9" fontSize="15" fontWeight="900">Law of Cosines</text>
            <text x="610" y="127" fill="#f8fafc" fontSize="22" fontWeight="900">c^2 = a^2 + b^2</text>
            <text x="610" y="158" fill="#f8fafc" fontSize="22" fontWeight="900">- 2ab cos(theta)</text>
            <text x="610" y="185" fill="#cbd5e1" fontSize="13" fontWeight="700">Here: a={sideA.toFixed(1)}, b={sideB.toFixed(1)}, c={sideC.toFixed(2)}</text>
          </g>
        ) : null}

        {!showChordTheorem ? (
          <g>
            <rect x="48" y="40" width="250" height="96" rx="18" fill="#020617" stroke="#164e63" strokeWidth="2" opacity="0.92" />
            <text x="72" y="74" fill="#67e8f9" fontSize="14" fontWeight="900">Step {activeStep + 1}: {steps[activeStep]?.title}</text>
            <text x="72" y="105" fill="#dbeafe" fontSize="15" fontWeight="800">
              {activeStep === 0
                ? "Draw triangle"
                : activeStep === 1
                  ? "Circle radius equals a"
                  : activeStep === 2
                    ? "Extend to full diameter"
                    : activeStep === 3
                      ? "Second radius is a"
                      : activeStep === 4
                        ? "Top piece is a - c"
                        : activeStep === 5
                          ? "Draw dashed helper"
                          : activeStep === 6
                            ? "Shade helper area"
                            : activeStep === 7
                              ? "Thales right triangle"
                              : activeStep === 8
                                ? "Adjacent side is 2a cos(theta)"
                                : "Leftover is 2a cos(theta) - b"}
            </text>
          </g>
        ) : null}

        {showTransferredRemainder ? (
          <g style={{ animation: "lawCosinesFadeIn 500ms ease-out both" }}>
            <AnimatedLine from={helperPoint} to={topPoint} color="#fb7185" width={5} delay="0s" />
            {labelsVisible ? (
              <RotatedLabel
                point={midpoint(helperPoint, topPoint)}
                angle={helperSideAngle}
                text="2a cos(theta) - b"
                color="#f8fafc"
                dx={-118}
                dy={-16}
              />
            ) : null}
          </g>
        ) : null}

        {showSeparatedTriangle ? (
          <g style={{ animation: "lawCosinesFadeIn 650ms ease-out both" }}>
            <polygon
              points={`${separated.left.x},${separated.left.y} ${separated.apex.x},${separated.apex.y} ${separated.right.x},${separated.right.y}`}
              fill="#facc15"
              opacity="0.9"
              stroke="#fde047"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <line x1={separated.left.x} y1={separated.left.y} x2={separated.right.x} y2={separated.right.y} stroke="#f8fafc" strokeWidth="3" />
            <line x1={separated.left.x} y1={separated.left.y} x2={separated.apex.x} y2={separated.apex.y} stroke="#fef08a" strokeWidth="3" />
            <line x1={separated.apex.x} y1={separated.apex.y} x2={separated.right.x} y2={separated.right.y} stroke="#fef08a" strokeWidth="3" />
            <AngleArc center={separated.right} radius={36} theta={theta} />
            {labelsVisible ? (
              <>
                {showCosineSide ? (
                  <>
                    <Label x={separated.left.x + separated.width * 0.5 - 14} y={separated.left.y + 38} text="2a" color="#f8fafc" />
                    <RotatedLabel point={midpoint(separated.apex, separated.right)} angle={separated.rightSideAngle} text="2a cos(theta)" color="#f8fafc" dx={20} dy={-10} />
                  </>
                ) : (
                  <>
                    <Label x={separated.left.x + separated.width * 0.25 - 8} y={separated.left.y + 38} text="a" color="#f8fafc" />
                    <Label x={separated.left.x + separated.width * 0.75 - 8} y={separated.left.y + 38} text="a" color="#f8fafc" />
                  </>
                )}
                <Label x={separated.right.x - 58} y={separated.right.y - 18} text="theta" color="#fef3c7" />
              </>
            ) : null}
            <text x="506" y="490" fill="#f8fafc" fontSize="17" fontWeight="900">
              Thales triangle theorem forces this triangle to be right-angled.
            </text>
          </g>
        ) : null}
      </svg>
    </div>
  );
}

function buildGeometry(sideA: number, sideB: number, theta: number) {
  const scale = 34;
  const joint = { x: 560, y: 285 };
  const leftPoint = { x: joint.x - sideA * scale, y: joint.y };
  const angleRad = degToRad(180 - theta);
  const topPoint = {
    x: joint.x + sideB * scale * Math.cos(angleRad),
    y: joint.y - sideB * scale * Math.sin(angleRad),
  };
  const circleRadius = sideA * scale;
  const circleCenter = leftPoint;
  const extensionPoint = { x: circleCenter.x - circleRadius, y: joint.y };
  const cVector = { x: topPoint.x - leftPoint.x, y: topPoint.y - leftPoint.y };
  const cLength = Math.hypot(cVector.x, cVector.y) || 1;
  const cUnit = { x: cVector.x / cLength, y: cVector.y / cLength };
  const lowerCPoint = { x: leftPoint.x - cUnit.x * circleRadius, y: leftPoint.y - cUnit.y * circleRadius };
  const upperCPoint = { x: leftPoint.x + cUnit.x * circleRadius, y: leftPoint.y + cUnit.y * circleRadius };
  const cAngleDegrees = (Math.atan2(cUnit.y, cUnit.x) * 180) / Math.PI;
  const bVector = { x: topPoint.x - joint.x, y: topPoint.y - joint.y };
  const bLength = Math.hypot(bVector.x, bVector.y) || 1;
  const bUnit = { x: bVector.x / bLength, y: bVector.y / bLength };
  const jointFromCenter = { x: joint.x - circleCenter.x, y: joint.y - circleCenter.y };
  const helperDistance = -2 * (jointFromCenter.x * bUnit.x + jointFromCenter.y * bUnit.y);
  const helperPoint = { x: joint.x + bUnit.x * helperDistance, y: joint.y + bUnit.y * helperDistance };
  const helperSideAngle = (Math.atan2(joint.y - helperPoint.y, joint.x - helperPoint.x) * 180) / Math.PI;
  return { leftPoint, joint, topPoint, circleCenter, circleRadius, extensionPoint, lowerCPoint, upperCPoint, helperPoint, cAngleDegrees, helperSideAngle };
}

function buildSeparatedTriangle(geometry: ReturnType<typeof buildGeometry>) {
  const { extensionPoint, joint, helperPoint } = geometry;
  const width = joint.x - extensionPoint.x;
  const scale = Math.min(0.98, 360 / width);
  const left = { x: 520, y: 342 };
  const separatedWidth = width * scale;
  const right = { x: left.x + separatedWidth, y: left.y };
  const sourceApexRatioX = (helperPoint.x - extensionPoint.x) / width;
  const apex = {
    x: left.x + sourceApexRatioX * separatedWidth,
    y: left.y - (extensionPoint.y - helperPoint.y) * scale,
  };
  const rightSideAngle = (Math.atan2(right.y - apex.y, right.x - apex.x) * 180) / Math.PI;
  return { left, right, apex, width: separatedWidth, rightSideAngle };
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  suffix = "",
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  suffix?: string;
  onChange: (value: number) => void;
}) {
  return (
    <label className="mt-3 block text-sm font-bold text-slate-700 dark:text-slate-200">
      <span className="flex items-center justify-between gap-3">
        {label}
        <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-600 dark:bg-slate-950/50 dark:text-slate-300">
          {value.toFixed(step < 1 ? 1 : 0)}{suffix ? ` ${suffix}` : ""}
        </span>
      </span>
      <input type="range" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} className="mt-2 w-full accent-cyan-500" />
    </label>
  );
}

function AnimatedCircle({ center, radius, circumference }: { center: Point; radius: number; circumference: number }) {
  return (
    <circle
      cx={center.x}
      cy={center.y}
      r={radius}
      fill="none"
      stroke="#f0abfc"
      strokeWidth="4"
      opacity="0.92"
      strokeLinecap="round"
      style={{
        strokeDasharray: circumference,
        strokeDashoffset: circumference,
        animation: "lawCosinesDraw 950ms ease-out both",
      }}
    />
  );
}

function AnimatedLine({
  from,
  to,
  color,
  delay,
  width = 4,
  dash,
}: {
  from: Point;
  to: Point;
  color: string;
  delay: string;
  width?: number;
  dash?: string;
}) {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      style={{
        strokeDasharray: dash ? `${dash}, ${length}` : length,
        strokeDashoffset: length,
        animation: `lawCosinesDraw 850ms ease-out ${delay} both`,
      }}
    />
  );
}

function PointDot({ point, label, highlight = false }: { point: Point; label: string; highlight?: boolean }) {
  return (
    <g>
      <circle cx={point.x} cy={point.y} r={highlight ? 9 : 6} fill={highlight ? "#facc15" : "#67e8f9"} filter="url(#law-cosines-soft-glow)" />
      <circle cx={point.x} cy={point.y} r={highlight ? 3 : 2.5} fill="#020617" />
      <text x={point.x + 12} y={point.y - 10} fill="#e0f2fe" fontSize="15" fontWeight="900">{label}</text>
    </g>
  );
}

function Label({ x, y, text, color = "#f8fafc" }: { x: number; y: number; text: string; color?: string }) {
  return (
    <text x={x} y={y} fill={color} fontSize="26" fontWeight="900" fontFamily="Georgia, serif">
      {text}
    </text>
  );
}

function RotatedLabel({
  point,
  angle,
  text,
  color = "#f8fafc",
  dx = 0,
  dy = 0,
}: {
  point: Point;
  angle: number;
  text: string;
  color?: string;
  dx?: number;
  dy?: number;
}) {
  return (
    <text
      x={point.x + dx}
      y={point.y + dy}
      fill={color}
      fontSize="26"
      fontWeight="900"
      fontFamily="Georgia, serif"
      transform={`rotate(${angle} ${point.x + dx} ${point.y + dy})`}
    >
      {text}
    </text>
  );
}

function midpoint(a: Point, b: Point) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function AngleArc({ center, radius, theta }: { center: Point; radius: number; theta: number }) {
  const start = { x: center.x - radius, y: center.y };
  const end = {
    x: center.x - radius * Math.cos(degToRad(theta)),
    y: center.y - radius * Math.sin(degToRad(theta)),
  };
  return (
    <path d={`M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`} fill="none" stroke="#fde68a" strokeWidth="4" strokeLinecap="round" />
  );
}

function Grid() {
  const lines = [];
  for (let x = 60; x <= 840; x += 60) {
    lines.push(<line key={`x-${x}`} x1={x} y1="0" x2={x} y2="540" stroke="#0e7490" strokeWidth="1" opacity="0.12" />);
  }
  for (let y = 60; y <= 480; y += 60) {
    lines.push(<line key={`y-${y}`} x1="0" y1={y} x2="900" y2={y} stroke="#0e7490" strokeWidth="1" opacity="0.12" />);
  }
  return <g>{lines}</g>;
}

function degToRad(degrees: number) {
  return (degrees * Math.PI) / 180;
}

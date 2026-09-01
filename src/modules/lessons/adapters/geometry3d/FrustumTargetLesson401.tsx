import { Edges, Line, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Box,
  CheckCircle2,
  Lightbulb,
  Maximize2,
  Minimize2,
  Move3D,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DoubleSide, type Group } from "three";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./FrustumTargetLesson401.css";

type Dimension = "top" | "bottom" | "height";

const initial = { topRadius: 2, bottomRadius: 5, height: 4 };

export default function FrustumTargetLesson401({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [topRadius, setTopRadius] = useState(initial.topRadius);
  const [bottomRadius, setBottomRadius] = useState(initial.bottomRadius);
  const [height, setHeight] = useState(initial.height);
  const [showRemoved, setShowRemoved] = useState(true);
  const [showNet, setShowNet] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [cameraReset, setCameraReset] = useState(0);
  const [challengeHeight, setChallengeHeight] = useState("");
  const [challengeVolume, setChallengeVolume] = useState("");
  const [checked, setChecked] = useState(false);
  const [actions, setActions] = useState(0);

  const difference = bottomRadius - topRadius;
  const slant = Math.hypot(difference, height);
  const volumeCoefficient =
    (height * (bottomRadius ** 2 + bottomRadius * topRadius + topRadius ** 2)) /
    3;
  const curvedCoefficient = (bottomRadius + topRadius) * slant;
  const totalCoefficient =
    curvedCoefficient + bottomRadius ** 2 + topRadius ** 2;
  const originalHeight = (height * bottomRadius) / difference;
  const removedHeight = (height * topRadius) / difference;
  const originalConeVolumeCoefficient =
    (bottomRadius ** 2 * originalHeight) / 3;
  const netAngle = (360 * difference) / slant;
  const correct =
    checked &&
    near(Number(challengeHeight), originalHeight) &&
    near(Number(challengeVolume), originalConeVolumeCoefficient);

  const act = (callback: () => void) => {
    callback();
    setChecked(false);
    setActions((value) => value + 1);
    onInteraction();
  };
  const updateTop = (value: number) =>
    act(() => setTopRadius(clamp(value, 0.1, bottomRadius - 0.1)));
  const updateBottom = (value: number) =>
    act(() => {
      const next = clamp(value, 0.2, 9.9);
      setBottomRadius(next);
      setTopRadius((current) => Math.min(current, next - 0.1));
    });
  const updateHeight = (value: number) =>
    act(() => setHeight(clamp(value, 0.1, 9.9)));
  const reset = () => {
    setTopRadius(initial.topRadius);
    setBottomRadius(initial.bottomRadius);
    setHeight(initial.height);
    setShowRemoved(true);
    setShowNet(true);
    setFullscreen(false);
    setCameraReset((value) => value + 1);
    setChallengeHeight("");
    setChallengeVolume("");
    setChecked(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);

  return (
    <section
      className="cs378-page fru401-page"
      data-testid="geometry3d-mockup-0586"
      data-object-model="threejs-dedicated-parametric-conical-frustum-direct-radius-height-handles-removed-cone-similar-triangles-dynamic-annular-sector-net-exact-volume-curved-total-area-original-cone-graded-challenge"
      data-top-radius={round(topRadius)}
      data-bottom-radius={round(bottomRadius)}
      data-height={round(height)}
      data-slant={round(slant)}
      data-volume-coefficient={round(volumeCoefficient)}
      data-curved-coefficient={round(curvedCoefficient)}
      data-total-coefficient={round(totalCoefficient)}
      data-original-height={round(originalHeight)}
      data-removed-height={round(removedHeight)}
      data-original-volume-coefficient={round(originalConeVolumeCoefficient)}
      data-net-angle={round(netAngle)}
      data-removed={showRemoved}
      data-net={showNet}
      data-fullscreen={fullscreen}
      data-checked={checked}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="fru401-hero">
        <div>
          <small>3D MATHEMATICS</small>
          <h1>Frustum of a Cone</h1>
          <p>Explore the geometry, measurements and formulas of a frustum.</p>
          <nav>
            <button onClick={() => act(() => setCameraReset((v) => v + 1))}>
              <Box size={13} /> Interactive 3D
            </button>
            <button
              onClick={() =>
                document
                  .querySelector(".fru401-dimensions")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
            >
              <Move3D size={13} /> Draggable measurements
            </button>
            <button onClick={() => act(() => setShowNet((value) => !value))}>
              <Box size={13} /> Unfoldable net
            </button>
            <button
              onClick={() =>
                document
                  .querySelector(".fru401-formulas")
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
            >
              <CheckCircle2 size={13} /> Live formulas
            </button>
          </nav>
        </div>
        <aside>
          <h2>Key idea</h2>
          <p>
            A frustum is formed by cutting a cone with a plane parallel to its
            base. Move the handles to explore how measurements and formulas
            change.
          </p>
        </aside>
      </header>

      <section className="fru401-lab">
        <article className="fru401-interactive">
          <header>
            <h2>Frustum (interactive)</h2>
            <nav>
              <button
                aria-label="Reset 3D view"
                title="Reset 3D view"
                onClick={() => act(() => setCameraReset((v) => v + 1))}
              >
                <Box size={16} />
              </button>
              <button
                aria-label={fullscreen ? "Exit full screen" : "Full screen"}
                title={fullscreen ? "Exit full screen" : "Full screen"}
                onClick={() => act(() => setFullscreen((value) => !value))}
              >
                {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </nav>
          </header>
          <div className={`fru401-stage ${fullscreen ? "expanded" : ""}`}>
            {fullscreen && (
              <button
                className="fru401-exit"
                aria-label="Exit full screen"
                onClick={() => act(() => setFullscreen(false))}
              >
                <Minimize2 size={17} />
              </button>
            )}
            <label className="fru401-removed-toggle">
              <span>Show removed cone</span>
              <input
                aria-label="Show removed cone"
                type="checkbox"
                checked={showRemoved}
                onChange={() => act(() => setShowRemoved((value) => !value))}
              />
            </label>
            <aside className="fru401-similar">
              <h3>Similar triangles</h3>
              <strong>△AOB ∼ △COD</strong>
              <p>
                <span>r</span>/<span>R</span> = <span>h′</span>/
                <span>h′ + h</span>
              </p>
              <hr />
              <small>Where</small>
              <p>s = slant height</p>
              <p>s = √((R − r)² + h²)</p>
            </aside>
            <Canvas
              key={cameraReset}
              data-testid="geometry3d-frustum-canvas"
              camera={{ position: [7, 5.5, 9], fov: 38 }}
              gl={{ antialias: true, preserveDrawingBuffer: true }}
            >
              <color attach="background" args={["#ffffff"]} />
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 8, 7]} intensity={2.4} />
              <FrustumModel
                topRadius={topRadius}
                bottomRadius={bottomRadius}
                height={height}
                showRemoved={showRemoved}
                onTop={updateTop}
                onBottom={updateBottom}
                onHeight={updateHeight}
              />
              <OrbitControls
                makeDefault
                enableDamping={false}
                minDistance={6}
                maxDistance={18}
                target={[0, 0.6, 0]}
              />
            </Canvas>
            <DragHandle
              label="Drag top radius handle"
              className="top"
              axis="x"
              onMove={(delta) => updateTop(topRadius + delta / 34)}
            />
            <DragHandle
              label="Drag bottom radius handle"
              className="bottom"
              axis="x"
              onMove={(delta) => updateBottom(bottomRadius + delta / 34)}
            />
            <DragHandle
              label="Drag height handle"
              className="height"
              axis="y"
              onMove={(delta) => updateHeight(height - delta / 27)}
            />
            <p className="fru401-drag-note">
              <span>☝</span> Drag the handles to change <b>r</b>, <b>R</b> and
              <b> h</b>.
            </p>
          </div>
          <div className="fru401-dimensions">
            <DimensionControl
              label="Top radius (r)"
              color="#1389df"
              value={topRadius}
              max={Math.max(0.2, bottomRadius - 0.1)}
              onChange={updateTop}
            />
            <DimensionControl
              label="Bottom radius (R)"
              color="#e51f2f"
              value={bottomRadius}
              max={9.9}
              onChange={updateBottom}
            />
            <DimensionControl
              label="Height (h)"
              color="#25a04b"
              value={height}
              max={9.9}
              onChange={updateHeight}
            />
          </div>
        </article>

        <article className="fru401-net">
          <header>
            <h2>Unfold net</h2>
            <label>
              <input
                aria-label="Unfold net"
                type="checkbox"
                checked={showNet}
                onChange={() => act(() => setShowNet((value) => !value))}
              />
            </label>
          </header>
          <FrustumNet
            topRadius={topRadius}
            bottomRadius={bottomRadius}
            slant={slant}
            visible={showNet}
          />
          <aside>
            <h3>Net (annular sector + bases)</h3>
            <p>• Outer radius of sector = sR/(R − r)</p>
            <p>• Inner radius of sector = sr/(R − r)</p>
            <p>• Central angle (θ) = 360° × (R − r)/s</p>
          </aside>
          <footer>
            <h3>Slant height</h3>
            <strong>s = √((R − r)² + h²) = {fmt(slant)}</strong>
          </footer>
        </article>
      </section>

      <section className="fru401-formulas">
        <h2>Formulas</h2>
        <div>
          <FormulaCard
            title="Volume"
            formula="V = πh(R² + Rr + r²) / 3"
            value={`${fmt(volumeCoefficient)}π`}
          />
          <FormulaCard
            title="Curved (lateral) surface area"
            formula="Acurved = π(R + r)s"
            value={`${fmt(curvedCoefficient)}π`}
          />
          <FormulaCard
            title="Total surface area"
            formula="Atotal = π(R + r)s + πR² + πr²"
            value={`${fmt(totalCoefficient)}π`}
          />
        </div>
        <p>Where π ≈ 3.14159</p>
      </section>

      <section className="fru401-worked">
        <h2>Worked example</h2>
        <p>
          Given R = {fmt(bottomRadius)}, r = {fmt(topRadius)}, h = {fmt(height)}
        </p>
        <div>
          <article>
            <h3>Slant height</h3>
            <p>
              s = √(({fmt(bottomRadius)} − {fmt(topRadius)})² + {fmt(height)}²)
              = {fmt(slant)}
            </p>
            <h3>Similar triangles ratio</h3>
            <p>
              r/R = h′/(h + h′) = {fmt(topRadius)}/{fmt(bottomRadius)}
            </p>
            <h3>Central angle (θ)</h3>
            <p>θ = 360° × (R − r)/s = {fmt(netAngle)}°</p>
          </article>
          <article>
            <h3>Volume</h3>
            <p>
              V = {fmt(volumeCoefficient)}π ≈ {fmt(volumeCoefficient * Math.PI)}
            </p>
            <h3>Curved surface area</h3>
            <p>
              Acurved = {fmt(curvedCoefficient)}π ≈{" "}
              {fmt(curvedCoefficient * Math.PI)}
            </p>
            <h3>Total surface area</h3>
            <p>
              Atotal = {fmt(totalCoefficient)}π ≈{" "}
              {fmt(totalCoefficient * Math.PI)}
            </p>
          </article>
        </div>
      </section>

      <section className="fru401-challenge">
        <div className="fru401-challenge-copy">
          <h2>Challenge: Recover the original cone</h2>
          <p>
            Given the frustum shown (R, r, h), restore the removed cone. Find
            the original cone’s height H and volume Vcone.
          </p>
          <p className="fru401-hint">
            <Lightbulb size={15} /> Hint: Use similar triangles.
          </p>
          <label>
            <b>Find H =</b>
            <input
              aria-label="Original cone height"
              inputMode="decimal"
              placeholder="Enter value"
              value={challengeHeight}
              onChange={(event) => {
                setChallengeHeight(event.target.value);
                setChecked(false);
              }}
            />
          </label>
          <label>
            <b>Find Vcone =</b>
            <input
              aria-label="Original cone volume coefficient"
              inputMode="decimal"
              placeholder="Coefficient of π"
              value={challengeVolume}
              onChange={(event) => {
                setChallengeVolume(event.target.value);
                setChecked(false);
              }}
            />
          </label>
          <button
            onClick={() => {
              setChecked(true);
              setActions((value) => value + 1);
              onInteraction();
            }}
          >
            Check answer
          </button>
        </div>
        <div className="fru401-given">
          <h3>Your frustum</h3>
          <p>R = {fmt(bottomRadius)}</p>
          <p>r = {fmt(topRadius)}</p>
          <p>h = {fmt(height)}</p>
          <p>s = {fmt(slant)}</p>
        </div>
        <ChallengeDiagram
          topRadius={topRadius}
          bottomRadius={bottomRadius}
          height={height}
          originalHeight={originalHeight}
        />
        <aside className={checked ? (correct ? "correct" : "incorrect") : ""}>
          <h3>
            Results{" "}
            {checked
              ? correct
                ? "(correct)"
                : "(try again)"
              : "(when correct)"}
          </h3>
          <p>H = {correct ? fmt(originalHeight) : "________"}</p>
          <p>
            Vcone ={" "}
            {correct ? `${fmt(originalConeVolumeCoefficient)}π` : "________"}
          </p>
        </aside>
      </section>

      <nav className="fru401-nav">
        <a href="/lessons/3d-mathematics/400-hemisphere">
          ←{" "}
          <span>
            Previous
            <br />
            <b>Hemisphere</b>
          </span>
        </a>
        <a href="/lessons/3d-mathematics/402-cone-slices-cross-sections">
          <span>
            Next
            <br />
            <b>Cone Slices &amp; Cross-sections</b>
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function DimensionControl({
  label,
  color,
  value,
  max,
  onChange,
}: {
  label: string;
  color: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label style={{ "--dimension-color": color } as React.CSSProperties}>
      <b>{label}</b>
      <span>
        <input
          aria-label={`${label} slider`}
          type="range"
          min="0.1"
          max={max}
          step="0.1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <input
          aria-label={label}
          type="number"
          min="0.1"
          max={max}
          step="0.1"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
      </span>
      <small>
        <i>0.1</i>
        <i>{fmt(max)}</i>
      </small>
    </label>
  );
}

function FormulaCard({
  title,
  formula,
  value,
}: {
  title: string;
  formula: string;
  value: string;
}) {
  return (
    <article>
      <h3>{title}</h3>
      <p>{formula}</p>
      <strong>{value}</strong>
    </article>
  );
}

function DragHandle({
  label,
  className,
  axis,
  onMove,
}: {
  label: string;
  className: string;
  axis: "x" | "y";
  onMove: (delta: number) => void;
}) {
  const active = useRef(false);
  return (
    <button
      className={`fru401-handle ${className}`}
      aria-label={label}
      title={label}
      onPointerDown={(event) => {
        active.current = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!active.current) return;
        onMove(axis === "x" ? event.movementX : event.movementY);
      }}
      onPointerUp={() => {
        active.current = false;
      }}
    />
  );
}

function FrustumModel({
  topRadius,
  bottomRadius,
  height,
  showRemoved,
  onTop,
  onBottom,
  onHeight,
}: {
  topRadius: number;
  bottomRadius: number;
  height: number;
  showRemoved: boolean;
  onTop: (value: number) => void;
  onBottom: (value: number) => void;
  onHeight: (value: number) => void;
}) {
  const group = useRef<Group>(null);
  const drag = useRef<Dimension | null>(null);
  const removedHeight = (height * topRadius) / (bottomRadius - topRadius);
  const visualRemovedHeight = removedHeight * 1.5;
  const scale = 3.5 / Math.max(bottomRadius, height, 3);
  const move = (dimension: Dimension, movementX: number, movementY: number) => {
    if (dimension === "top") onTop(topRadius + movementX / 35 / scale);
    if (dimension === "bottom") onBottom(bottomRadius + movementX / 35 / scale);
    if (dimension === "height") onHeight(height - movementY / 28 / scale);
  };
  const handleProps = (dimension: Dimension) => ({
    onPointerDown: (event: {
      stopPropagation: () => void;
      target: { setPointerCapture: (id: number) => void };
      pointerId: number;
    }) => {
      event.stopPropagation();
      drag.current = dimension;
      event.target.setPointerCapture(event.pointerId);
    },
    onPointerMove: (event: {
      stopPropagation: () => void;
      nativeEvent: PointerEvent;
    }) => {
      if (drag.current !== dimension) return;
      event.stopPropagation();
      move(dimension, event.nativeEvent.movementX, event.nativeEvent.movementY);
    },
    onPointerUp: (event: { stopPropagation: () => void }) => {
      event.stopPropagation();
      drag.current = null;
    },
  });
  return (
    <group
      ref={group}
      position={[0.65, 1.225, 0]}
      scale={[scale * 0.625, scale * 1.225, scale * 0.625]}
    >
      <mesh>
        <cylinderGeometry
          args={[topRadius, bottomRadius, height, 64, 1, false]}
        />
        <meshPhysicalMaterial
          color="#66b3f0"
          roughness={0.3}
          transparent
          opacity={0.72}
          side={DoubleSide}
        />
        <Edges color="#0757ad" threshold={15} />
      </mesh>
      {showRemoved && removedHeight < 20 && (
        <>
          <Line
            points={[
              [0, height / 2 + visualRemovedHeight, 0],
              [topRadius, height / 2, 0],
            ]}
            color="#536273"
            dashed
            dashSize={0.12}
            gapSize={0.09}
          />
          <Line
            points={[
              [0, height / 2 + visualRemovedHeight, 0],
              [-topRadius, height / 2, 0],
            ]}
            color="#536273"
            dashed
            dashSize={0.12}
            gapSize={0.09}
          />
          <Line
            points={[
              [0, height / 2 + visualRemovedHeight, 0],
              [0, height / 2, topRadius],
            ]}
            color="#7c8793"
            dashed
            dashSize={0.12}
            gapSize={0.09}
          />
        </>
      )}
      <Line
        points={[
          [0, -height / 2, 0],
          [bottomRadius, -height / 2, 0],
        ]}
        color="#e5202a"
        lineWidth={2}
      />
      <Line
        points={[
          [0, height / 2, 0],
          [topRadius, height / 2, 0],
        ]}
        color="#1489df"
        lineWidth={2}
      />
      <Line
        points={[
          [bottomRadius * 1.18, -height / 2, 0],
          [bottomRadius * 1.18, height / 2, 0],
        ]}
        color="#25a04b"
        lineWidth={2}
      />
      <mesh position={[topRadius, height / 2, 0]} {...handleProps("top")}>
        <sphereGeometry args={[0.18 / scale, 24, 16]} />
        <meshStandardMaterial color="#168de0" />
      </mesh>
      <mesh
        position={[bottomRadius, -height / 2, 0]}
        {...handleProps("bottom")}
      >
        <sphereGeometry args={[0.18 / scale, 24, 16]} />
        <meshStandardMaterial color="#e5202a" />
      </mesh>
      <mesh position={[bottomRadius * 1.18, 0, 0]} {...handleProps("height")}>
        <sphereGeometry args={[0.18 / scale, 24, 16]} />
        <meshStandardMaterial color="#2eaa55" />
      </mesh>
    </group>
  );
}

function FrustumNet({
  topRadius,
  bottomRadius,
  slant,
  visible,
}: {
  topRadius: number;
  bottomRadius: number;
  slant: number;
  visible: boolean;
}) {
  const difference = bottomRadius - topRadius;
  const angle = Math.min(350, (360 * difference) / slant);
  const outer = 130;
  const inner = outer * (topRadius / bottomRadius) * 0.8;
  const path = annularSectorPath(
    140,
    148,
    inner,
    outer,
    -90 - angle / 2,
    -90 + angle / 2,
  );
  return (
    <svg
      className={`fru401-net-svg ${visible ? "visible" : "folded"}`}
      viewBox="0 0 280 340"
      role="img"
      aria-label="Dynamic annular sector and circular bases"
    >
      {visible ? (
        <>
          <path d={path} fill="#dcd4ff" stroke="#4d4a75" />
          <text x="34" y="96">
            s
          </text>
          <text x="239" y="96">
            s
          </text>
          <circle
            cx="75"
            cy="193"
            r={20 + (28 * topRadius) / bottomRadius}
            fill="#dbeeff"
            stroke="#1475c9"
          />
          <line
            x1="75"
            y1="193"
            x2={75 + 20 + (28 * topRadius) / bottomRadius}
            y2="193"
            stroke="#1475c9"
          />
          <text x="74" y="188" fill="#1475c9">
            r
          </text>
          <circle cx="136" cy="285" r="63" fill="#ffe0e0" stroke="#df252d" />
          <line x1="136" y1="285" x2="199" y2="285" stroke="#df252d" />
          <text x="166" y="279" fill="#df252d">
            R
          </text>
        </>
      ) : (
        <g transform="translate(140 170)">
          <path
            d="M -62 70 L -30 -70 A 36 12 0 0 1 30 -70 L 62 70 A 68 18 0 0 1 -62 70"
            fill="#a9d8fa"
            stroke="#176ab0"
          />
          <ellipse cy="70" rx="62" ry="17" fill="#91c9ef" stroke="#176ab0" />
          <ellipse cy="-70" rx="30" ry="10" fill="#cbe8fb" stroke="#176ab0" />
        </g>
      )}
    </svg>
  );
}

function ChallengeDiagram({
  topRadius,
  bottomRadius,
  height,
  originalHeight,
}: {
  topRadius: number;
  bottomRadius: number;
  height: number;
  originalHeight: number;
}) {
  const apexY = 18,
    baseY = 195,
    topY = apexY + (177 * (originalHeight - height)) / originalHeight;
  return (
    <svg
      className="fru401-challenge-diagram"
      viewBox="0 0 220 220"
      aria-label="Original cone recovery diagram"
    >
      <line
        x1="110"
        y1={apexY}
        x2="35"
        y2={baseY}
        stroke="#536273"
        strokeDasharray="5 4"
      />
      <line
        x1="110"
        y1={apexY}
        x2="185"
        y2={baseY}
        stroke="#536273"
        strokeDasharray="5 4"
      />
      <path
        d={`M ${110 - (75 * topRadius) / bottomRadius} ${topY} L 35 ${baseY} Q 110 220 185 ${baseY} L ${110 + (75 * topRadius) / bottomRadius} ${topY} Q 110 ${topY + 17} ${110 - (75 * topRadius) / bottomRadius} ${topY}`}
        fill="#b7dcf4"
        stroke="#1767af"
      />
      <ellipse
        cx="110"
        cy={topY}
        rx={(75 * topRadius) / bottomRadius}
        ry="9"
        fill="#d8effc"
        stroke="#1767af"
      />
      <line x1="110" y1={apexY} x2="110" y2={baseY} stroke="#1673d1" />
      <line
        x1="110"
        y1={topY}
        x2={110 + (75 * topRadius) / bottomRadius}
        y2={topY}
        stroke="#1673d1"
      />
      <line x1="110" y1={baseY} x2="185" y2={baseY} stroke="#e32931" />
      <text x="116" y={(apexY + baseY) / 2} fill="#1673d1">
        H
      </text>
      <text x="133" y={topY - 5} fill="#1673d1">
        r
      </text>
      <text x="150" y={baseY - 6} fill="#e32931">
        R
      </text>
      <text x="192" y={(topY + baseY) / 2} fill="#299f4d">
        h
      </text>
    </svg>
  );
}

function annularSectorPath(
  cx: number,
  cy: number,
  inner: number,
  outer: number,
  start: number,
  end: number,
) {
  const p = (radius: number, degrees: number) => {
    const angle = (degrees * Math.PI) / 180;
    return [cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)];
  };
  const os = p(outer, start),
    oe = p(outer, end),
    ie = p(inner, end),
    is = p(inner, start);
  const large = end - start > 180 ? 1 : 0;
  return `M ${os[0]} ${os[1]} A ${outer} ${outer} 0 ${large} 1 ${oe[0]} ${oe[1]} L ${ie[0]} ${ie[1]} A ${inner} ${inner} 0 ${large} 0 ${is[0]} ${is[1]} Z`;
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
const round = (value: number) => Number(value.toFixed(4));
const fmt = (value: number) => Number(value.toFixed(2)).toString();
const near = (a: number, b: number) =>
  Number.isFinite(a) && Math.abs(a - b) < 0.02;

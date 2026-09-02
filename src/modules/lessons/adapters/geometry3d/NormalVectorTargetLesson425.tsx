import { Html, OrbitControls } from "@react-three/drei";
import { Canvas, type ThreeEvent } from "@react-three/fiber";
import {
  ArrowHelper,
  BufferGeometry,
  DoubleSide,
  Float32BufferAttribute,
  Vector3,
} from "three";
import { useEffect, useMemo, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./NormalVectorTargetLesson425.css";

type Vec = { x: number; y: number; z: number };
const startP: Vec = { x: 1, y: 2, z: 1 };
const startU: Vec = { x: 1, y: 2, z: 1 };
const startV: Vec = { x: 2, y: -1, z: 2 };
const cross = (a: Vec, b: Vec): Vec => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
const dot = (a: Vec, b: Vec) => a.x * b.x + a.y * b.y + a.z * b.z;
const length = (a: Vec) => Math.hypot(a.x, a.y, a.z);
const fix = (value: number, digits = 3) => Number(value.toFixed(digits));

export default function NormalVectorTargetLesson425({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [p, setP] = useState(startP);
  const [u, setU] = useState(startU);
  const [v, setV] = useState(startV);
  const [tab, setTab] = useState("Interact");
  const [viewKey, setViewKey] = useState(0);
  const [answer, setAnswer] = useState<Vec>({ x: 0, y: 0, z: 0 });
  const [graded, setGraded] = useState(false);
  const [actions, setActions] = useState(0);
  const n = cross(u, v);
  const du = dot(n, u);
  const dv = dot(n, v);
  const answerCross = cross({ x: 1, y: 1, z: 0 }, { x: 0, y: 2, z: 1 });
  const scale = Math.abs(answerCross.x) > 1e-8 ? answer.x / answerCross.x : 0;
  const correct =
    graded &&
    Math.abs(scale) > 1e-8 &&
    Math.abs(answer.y - scale * answerCross.y) < 0.01 &&
    Math.abs(answer.z - scale * answerCross.z) < 0.01;
  const act = (update: () => void) => {
    update();
    setActions((value) => value + 1);
    onInteraction();
  };
  const reset = () => {
    setP(startP);
    setU(startU);
    setV(startV);
    setTab("Interact");
    setViewKey((value) => value + 1);
    setAnswer({ x: 0, y: 0, z: 0 });
    setGraded(false);
    setActions(0);
  };
  useEffect(reset, [resetToken]);
  return (
    <section
      className="cs378-page nv425-page"
      aria-label="Normal vector"
      data-testid="geometry3d-mockup-0610"
      data-lesson-title="Normal Vector"
      data-guidance="Drag surface point P and edit two in-plane directions to recompute the perpendicular normal."
      data-object-model="threejs-dedicated-draggable-point-editable-spanning-vectors-generated-plane-cross-product-normal-two-dot-tests-scalar-multiple-grading"
      data-direct-interaction="true"
      data-px={fix(p.x)}
      data-py={fix(p.y)}
      data-pz={fix(p.z)}
      data-ux={fix(u.x)}
      data-uy={fix(u.y)}
      data-uz={fix(u.z)}
      data-vx={fix(v.x)}
      data-vy={fix(v.y)}
      data-vz={fix(v.z)}
      data-nx={fix(n.x)}
      data-ny={fix(n.y)}
      data-nz={fix(n.z)}
      data-du={fix(du)}
      data-dv={fix(dv)}
      data-graded={graded}
      data-correct={correct}
      data-actions={actions}
    >
      <header className="nv425-hero">
        <section>
          <small>3D MATHEMATICS</small>
          <h1>Normal Vector</h1>
          <p>Display perpendicular direction.</p>
          <div>
            <span>
              <b>Level</b>High School
            </span>
            <span>
              <b>Topic</b>3D Geometry
            </span>
            <span>
              <b>Subtopic</b>Planes &amp; Vectors
            </span>
            <span>
              <b>Est. Time</b>6-10 min
            </span>
            <span>
              <b>Lab Mode</b>Interactive
            </span>
          </div>
        </section>
        <aside>
          <button onClick={() => act(() => undefined)}>Add to Workspace</button>
          <button onClick={() => act(() => undefined)}>Share</button>
        </aside>
      </header>
      <nav className="nv425-tabs">
        {["Interact", "Learn", "Worked Example", "Formula", "Practice"].map(
          (name) => (
            <button
              key={name}
              className={tab === name ? "active" : ""}
              onClick={() => act(() => setTab(name))}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="nv425-lab">
        <header>
          <small>INTERACT</small>
          <h2>Explore the normal vector</h2>
          <p>
            Move the point and plane. The normal vector stays perpendicular to
            the surface.
          </p>
        </header>
        <div className="nv425-work">
          <article className="nv425-canvas">
            <NormalCanvas
              key={viewKey}
              p={p}
              u={u}
              v={v}
              n={n}
              onPoint={(next) => act(() => setP(next))}
              onOrbit={onInteraction}
            />
            <button onClick={() => act(() => setViewKey((value) => value + 1))}>
              Reset view
            </button>
            <div className="nv425-legend">
              <span>
                <i className="point" />P (point)
              </span>
              <span>
                <i className="plane" />
                Tangent plane
              </span>
              <span>
                <i className="directions" />
                u, v (in-plane dirs)
              </span>
              <span>
                <i className="normal" />n (normal vector)
              </span>
            </div>
            <p>Drag P to move the point. Rotate the view to explore.</p>
          </article>
          <Controls
            p={p}
            u={u}
            v={v}
            n={n}
            setP={(next) => act(() => setP(next))}
            setU={(next) => act(() => setU(next))}
            setV={(next) => act(() => setV(next))}
            recompute={() => act(() => undefined)}
          />
        </div>
        <section className="nv425-checks">
          <small>CHECK PERPENDICULARITY</small>
          <p>The normal vector is perpendicular to both in-plane directions.</p>
          <DotRow name="u" n={n} vector={u} result={du} />
          <DotRow name="v" n={n} vector={v} result={dv} />
          <strong
            className={
              Math.abs(du) < 1e-8 && Math.abs(dv) < 1e-8 ? "valid" : "invalid"
            }
          >
            {Math.abs(du) < 1e-8 && Math.abs(dv) < 1e-8
              ? "Both dot products are 0. So n is perpendicular to the tangent plane."
              : "The displayed normal is being recomputed from u x v."}
          </strong>
        </section>
      </section>
      <section className="nv425-middle">
        <article>
          <small>UNDERSTAND THE RULE</small>
          <p>
            For any nonzero vectors u and v in a plane, a normal vector to the
            plane is perpendicular to both u and v.
          </p>
          <div className="nv425-rule">
            <b>Key Rule</b>
            <p>n is normal to the plane spanned by u and v if</p>
            <output>n · u = 0 &nbsp;&nbsp; and &nbsp;&nbsp; n · v = 0</output>
          </div>
          <div className="nv425-alert">
            <b>Misconception Alert</b>
            <p>
              A vector perpendicular to u alone is not necessarily perpendicular
              to the plane. It must be perpendicular to two independent
              direction vectors in the plane.
            </p>
          </div>
        </article>
        <article>
          <small>WORKED EXAMPLE</small>
          <p>
            Find a normal vector to the plane through P(1, 2, 1) that is spanned
            by u=(1,2,1) and v=(2,-1,2).
          </p>
          <ol>
            <li>
              Compute the cross product <b>n=u x v.</b>
            </li>
            <li>
              <output>n = |i j k; 1 2 1; 2 -1 2| = (5,0,-5)</output>
            </li>
            <li>Verify: n·u=5+0-5=0 and n·v=10+0-10=0.</li>
            <li>Conclusion: n=(5,0,-5) is normal to the plane.</li>
          </ol>
        </article>
      </section>
      <section className="nv425-bottom">
        <article>
          <small>THE FORMULA</small>
          <h2>Normal Vector via Cross Product</h2>
          <p>Given two non-parallel direction vectors u and v in a plane:</p>
          <output>n = u x v</output>
          <p>is a normal vector to the plane.</p>
          <aside>
            Any nonzero scalar multiple of n is also a normal vector.
          </aside>
        </article>
        <article className="nv425-challenge">
          <small>TRY INDEPENDENTLY</small>
          <h2>Challenge</h2>
          <p>
            Let u=(1,1,0) and v=(0,2,1). Find a normal vector to the plane
            spanned by u and v.
          </p>
          <b>Your answer (vector n)</b>
          <div>
            {(["x", "y", "z"] as const).map((key) => (
              <input
                key={key}
                aria-label={`Challenge ${key}`}
                type="number"
                value={answer[key]}
                onChange={(event) =>
                  act(() => {
                    setAnswer({ ...answer, [key]: Number(event.target.value) });
                    setGraded(false);
                  })
                }
              />
            ))}
            {graded && (
              <strong className={correct ? "correct" : "wrong"}>
                {correct ? "Correct!" : "Try the cross product again."}
              </strong>
            )}
          </div>
          <button onClick={() => act(() => setGraded(true))}>
            Check Answer
          </button>
          <p>Accepted: any nonzero scalar multiple of (1,-1,2).</p>
        </article>
      </section>
      <nav className="nv425-adjacent">
        <button>
          <small>PREVIOUS</small>
          <b>Tangent Plane</b>
        </button>
        <button>
          <small>NEXT</small>
          <b>Double Integrals</b>
        </button>
      </nav>
    </section>
  );
}

function Controls({
  p,
  u,
  v,
  n,
  setP,
  setU,
  setV,
  recompute,
}: {
  p: Vec;
  u: Vec;
  v: Vec;
  n: Vec;
  setP: (value: Vec) => void;
  setU: (value: Vec) => void;
  setV: (value: Vec) => void;
  recompute: () => void;
}) {
  const fields = (name: string, value: Vec, change?: (value: Vec) => void) => (
    <div className="nv425-fields">
      {(["x", "y", "z"] as const).map((key) => (
        <input
          key={key}
          aria-label={`${name} ${key}`}
          type="number"
          step="0.1"
          value={fix(value[key])}
          readOnly={!change}
          onChange={
            change
              ? (event) =>
                  change({ ...value, [key]: Number(event.target.value) })
              : undefined
          }
        />
      ))}
    </div>
  );
  return (
    <aside className="nv425-controls">
      <small>CONTROLS</small>
      <h3>Point P</h3>
      {fields("Point P", p, setP)}
      <hr />
      <h3>Tangent directions</h3>
      <label>u (in plane)</label>
      {fields("Vector u", u, setU)}
      <label>v (in plane)</label>
      {fields("Vector v", v, setV)}
      <hr />
      <h3>Normal vector (n = u x v)</h3>
      {fields("Normal n", n)}
      <button onClick={recompute}>Recompute</button>
    </aside>
  );
}

function DotRow({
  name,
  n,
  vector,
  result,
}: {
  name: string;
  n: Vec;
  vector: Vec;
  result: number;
}) {
  return (
    <div className="nv425-dot">
      <b>n · {name} =</b>
      <span>{n.x}</span>
      <span>{n.y}</span>
      <span>{n.z}</span>
      <b>·</b>
      <span>{vector.x}</span>
      <span>{vector.y}</span>
      <span>{vector.z}</span>
      <b>=</b>
      <output>{result}</output>
      <strong>
        {Math.abs(result) < 1e-8 ? "Perpendicular" : "Not perpendicular"}
      </strong>
    </div>
  );
}

function NormalCanvas({
  p,
  u,
  v,
  n,
  onPoint,
  onOrbit,
}: {
  p: Vec;
  u: Vec;
  v: Vec;
  n: Vec;
  onPoint: (value: Vec) => void;
  onOrbit: () => void;
}) {
  const [drag, setDrag] = useState(false);
  const plane = useMemo(() => planeGeometry(p, u, v), [p, u, v]);
  const move = (event: ThreeEvent<PointerEvent>) => {
    if (!drag) return;
    event.stopPropagation();
    onPoint({ x: fix(event.point.x, 2), y: p.y, z: fix(event.point.z, 2) });
  };
  return (
    <Canvas
      camera={{ position: [7, 6, 8], fov: 42 }}
      onPointerUp={() => setDrag(false)}
    >
      <color attach="background" args={["#071a39"]} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 4]} intensity={1.8} />
      <gridHelper
        args={[9, 12, "#58708e", "#193552"]}
        position={[0, p.y - 2.3, 0]}
      />
      <axesHelper args={[4]} />
      <mesh geometry={plane}>
        <meshStandardMaterial
          color="#24b6ad"
          transparent
          opacity={0.5}
          side={DoubleSide}
        />
      </mesh>
      <VectorArrow origin={p} vector={u} color={0x31bd43} label="u" />
      <VectorArrow origin={p} vector={v} color={0xff4141} label="v" />
      <VectorArrow
        origin={p}
        vector={n}
        color={0x1687ff}
        label="n"
        normalized
      />
      <mesh
        position={[p.x, p.y, p.z]}
        onPointerMove={move}
        onPointerDown={(event) => {
          event.stopPropagation();
          (event.target as unknown as Element).setPointerCapture(
            event.pointerId,
          );
          setDrag(true);
          onOrbit();
        }}
        onPointerUp={(event) => {
          (event.target as unknown as Element).releasePointerCapture(
            event.pointerId,
          );
          setDrag(false);
        }}
      >
        <sphereGeometry args={[0.16, 20, 16]} />
        <meshStandardMaterial color="#fff" />
        <Html position={[0.25, 0.15, 0]} style={{ pointerEvents: "none" }}>
          <b className="nv425-label">P</b>
        </Html>
      </mesh>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, p.y - 0.02, 0]}
        onPointerMove={move}
      >
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <OrbitControls
        enabled={!drag}
        target={[p.x, p.y, p.z]}
        onStart={onOrbit}
      />
    </Canvas>
  );
}

function VectorArrow({
  origin,
  vector,
  color,
  label,
  normalized = false,
}: {
  origin: Vec;
  vector: Vec;
  color: number;
  label: string;
  normalized?: boolean;
}) {
  const arrow = useMemo(() => {
    const direction = new Vector3(vector.x, vector.y, vector.z);
    const magnitude = length(vector);
    if (magnitude < 1e-8) direction.set(0, 1, 0);
    else direction.normalize();
    return new ArrowHelper(
      direction,
      new Vector3(origin.x, origin.y, origin.z),
      normalized ? 2.8 : Math.min(3.2, magnitude),
      color,
      0.35,
      0.18,
    );
  }, [origin, vector, color, normalized]);
  const direction = new Vector3(vector.x, vector.y, vector.z).normalize();
  const distance = normalized ? 3 : Math.min(3.4, length(vector) + 0.25);
  return (
    <>
      <primitive object={arrow} />
      <Html
        position={[
          origin.x + direction.x * distance,
          origin.y + direction.y * distance,
          origin.z + direction.z * distance,
        ]}
        style={{ pointerEvents: "none" }}
      >
        <b
          className="nv425-label"
          style={{ color: `#${color.toString(16).padStart(6, "0")}` }}
        >
          {label}
        </b>
      </Html>
    </>
  );
}

function planeGeometry(p: Vec, u: Vec, v: Vec) {
  const un = new Vector3(u.x, u.y, u.z).normalize().multiplyScalar(2.3);
  const vn = new Vector3(v.x, v.y, v.z).normalize().multiplyScalar(2.3);
  const center = new Vector3(p.x, p.y, p.z);
  const corners = [
    center.clone().sub(un).sub(vn),
    center.clone().add(un).sub(vn),
    center.clone().sub(un).add(vn),
    center.clone().add(un).add(vn),
  ];
  const geometry = new BufferGeometry();
  geometry.setAttribute(
    "position",
    new Float32BufferAttribute(
      corners.flatMap((point) => [point.x, point.y, point.z]),
      3,
    ),
  );
  geometry.setIndex([0, 1, 2, 1, 3, 2]);
  geometry.computeVertexNormals();
  return geometry;
}

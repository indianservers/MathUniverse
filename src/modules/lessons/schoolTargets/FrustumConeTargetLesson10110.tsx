import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  Box,
  CircleDot,
  Info,
  Play,
  RotateCcw,
  Triangle,
  View,
} from "lucide-react";
import { useRef, useState } from "react";
import { DoubleSide, type Group } from "three";
import ThreeSceneWrapper from "../../../components/three/ThreeSceneWrapper";
import type { SchoolSyllabusLesson } from "../syllabus/lessonSyllabusTypes";
import "./FrustumConeTargetLesson10110.css";

const f2 = (value: number) => Number(value.toFixed(2));
type Preset = "perspective" | "front" | "top" | "side";
const cameras: Record<Preset, [number, number, number]> = {
  perspective: [9, 6, 10],
  front: [0, 2, 12],
  top: [0, 13, 0.1],
  side: [12, 2, 0],
};

function FrustumScene({
  R,
  r,
  h,
  animate,
  speed,
}: {
  R: number;
  r: number;
  h: number;
  animate: boolean;
  speed: number;
}) {
  const group = useRef<Group>(null);
  useFrame((_, delta) => {
    if (animate && group.current) group.current.rotation.y += delta * speed;
  });
  const scale = 0.6;
  const fullHeight = (h * R) / (R - r);
  return (
    <group ref={group}>
      <mesh position={[0, ((-h + fullHeight) * scale) / 2, 0]}>
        <coneGeometry args={[R * scale, fullHeight * scale, 64, 1, true]} />
        <meshStandardMaterial
          color="#b8d8ee"
          transparent
          opacity={0.12}
          roughness={0.15}
          side={DoubleSide}
        />
      </mesh>
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[r * scale, R * scale, h * scale, 64, 1, false]}
        />
        <meshStandardMaterial
          color="#19b9c4"
          transparent
          opacity={0.48}
          roughness={0.25}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, (-h * scale) / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[R * scale * 0.97, R * scale, 64]} />
        <meshBasicMaterial color="#ffc02b" />
      </mesh>
      <mesh position={[0, (h * scale) / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[r * scale * 0.94, r * scale, 64]} />
        <meshBasicMaterial color="#32e0e3" />
      </mesh>
      <gridHelper
        args={[10, 10, "#1a7180", "#173750"]}
        position={[0, (-h * scale) / 2 - 0.05, 0]}
      />
      <OrbitControls
        enablePan={false}
        enableZoom
        minDistance={6}
        maxDistance={18}
      />
    </group>
  );
}

export default function FrustumConeTargetLesson10110({
  lesson: _lesson,
}: {
  lesson: SchoolSyllabusLesson;
}) {
  const [R, setR] = useState(6);
  const [r, setSmallR] = useState(3);
  const [h, setH] = useState(8);
  const [unfold, setUnfold] = useState(true);
  const [animate, setAnimate] = useState(false);
  const [speed, setSpeed] = useState(0.5);
  const [preset, setPreset] = useState<Preset>("perspective");
  const [tab, setTab] = useState<"3d" | "net">("3d");
  const [actions, setActions] = useState(0);
  const slant = Math.sqrt(h * h + (R - r) * (R - r));
  const volume = (Math.PI * h * (R * R + R * r + r * r)) / 3;
  const csa = Math.PI * (R + r) * slant;
  const tsa = csa + Math.PI * R * R + Math.PI * r * r;
  const theta = (2 * Math.PI * (R - r)) / slant;
  const degrees = (theta * 180) / Math.PI;
  const outerSlant = (slant * R) / (R - r);
  const innerSlant = (slant * r) / (R - r);
  const act = (fn: () => void) => {
    fn();
    setActions((value) => value + 1);
  };
  const reset = () =>
    act(() => {
      setR(6);
      setSmallR(3);
      setH(8);
      setUnfold(true);
      setAnimate(false);
      setSpeed(0.5);
      setPreset("perspective");
      setTab("3d");
    });
  const polar = (radius: number, angle: number) => ({
    x: 180 + radius * Math.cos(angle),
    y: 180 + radius * Math.sin(angle),
  });
  const start = -Math.PI / 2 - theta / 2,
    end = -Math.PI / 2 + theta / 2,
    Ro = 135,
    Ri = 135 * (innerSlant / outerSlant);
  const a = polar(Ro, start),
    b = polar(Ro, end),
    c = polar(Ri, end),
    d = polar(Ri, start);
  const sector = `M${a.x},${a.y} A${Ro},${Ro} 0 ${theta > Math.PI ? 1 : 0} 1 ${b.x},${b.y} L${c.x},${c.y} A${Ri},${Ri} 0 ${theta > Math.PI ? 1 : 0} 0 ${d.x},${d.y} Z`;
  return (
    <section
      className="fru10110-page"
      data-testid="school-mockup-0784"
      data-object-model="dedicated-threejs-frustum-annular-net-engine"
      data-radius-base={R}
      data-radius-top={r}
      data-height={h}
      data-slant={f2(slant)}
      data-volume={f2(volume)}
      data-csa={f2(csa)}
      data-tsa={f2(tsa)}
      data-theta={f2(degrees)}
      data-unfold={String(unfold)}
      data-animate={String(animate)}
      data-view={preset}
      data-tab={tab}
      data-actions={actions}
    >
      <header className="fru10110-hero">
        <small>CLASS 10 · MENSURATION</small>
        <h1>Frustum of a Cone</h1>
        <p>
          Explore a cone cut by a plane parallel to the base. Adjust dimensions,
          see the 3D frustum and its net, and verify formulas.
        </p>
        <nav>
          <button
            className={tab === "3d" ? "active" : ""}
            onClick={() => act(() => setTab("3d"))}
          >
            3D VIEW
          </button>
          <button
            className={tab === "net" ? "active" : ""}
            onClick={() => act(() => setTab("net"))}
          >
            UNFOLDED NET
          </button>
        </nav>
        <button className="reset" onClick={reset}>
          <RotateCcw /> Reset lab
        </button>
      </header>
      <main className="fru10110-lab">
        <section className="fru10110-dims">
          <h2>DIMENSIONS</h2>
          {[
            ["R (base radius)", R, 1, 10, setR],
            ["r (top radius)", r, 0.5, Math.max(0.5, R - 0.5), setSmallR],
            ["h (vertical height)", h, 1, 15, setH],
          ].map(([label, value, min, max, setter]) => (
            <label key={String(label)}>
              {label}
              <b>{Number(value)}</b>
              <input
                aria-label={String(label)}
                type="range"
                min={Number(min)}
                max={Number(max)}
                step="0.5"
                value={Number(value)}
                onKeyDown={(event) => {
                  const direction =
                    event.key === "ArrowRight" || event.key === "ArrowUp"
                      ? 1
                      : event.key === "ArrowLeft" || event.key === "ArrowDown"
                        ? -1
                        : 0;
                  if (!direction) return;
                  event.preventDefault();
                  const next = Math.max(
                    Number(min),
                    Math.min(Number(max), Number(value) + direction * 0.5),
                  );
                  act(() => {
                    (setter as (v: number) => void)(next);
                    if (label === "R (base radius)" && r >= next)
                      setSmallR(Math.max(0.5, next - 0.5));
                  });
                }}
                onChange={(event) =>
                  act(() => {
                    const next = Number(event.target.value);
                    (setter as (v: number) => void)(next);
                    if (label === "R (base radius)" && r >= next)
                      setSmallR(Math.max(0.5, next - 0.5));
                  })
                }
              />
              <span>
                {Number(min)}
                <i>{Number(max)}</i>
              </span>
            </label>
          ))}
          <aside>
            <h2>DERIVED VALUES</h2>
            <strong>l = √(h² + (R − r)²)</strong>
            <p>
              l = √({h}² + ({R} − {r})²) ≈ <b>{f2(slant)}</b>
            </p>
          </aside>
        </section>
        <section className="fru10110-three">
          <h2>3D EXPLORER</h2>
          <div className={tab === "net" ? "muted" : ""}>
            <ThreeSceneWrapper
              key={preset}
              height="390px"
              mobileHeight="340px"
              cameraPosition={cameras[preset]}
              showHint={false}
              sceneSummary="Interactive three-dimensional frustum; drag to rotate and scroll to zoom"
            >
              <FrustumScene R={R} r={r} h={h} animate={animate} speed={speed} />
            </ThreeSceneWrapper>
          </div>
          <footer>
            <button onClick={() => act(() => setAnimate(!animate))}>
              <Play /> {animate ? "Pause" : "Animate"}
            </button>
            <input
              aria-label="Animation speed"
              type="range"
              min="0.1"
              max="1.5"
              step="0.1"
              value={speed}
              onChange={(event) =>
                act(() => setSpeed(Number(event.target.value)))
              }
            />
            <span>View</span>
            {(["perspective", "front", "top", "side"] as Preset[]).map(
              (view, index) => (
                <button
                  key={view}
                  className={preset === view ? "active" : ""}
                  aria-label={`${view} view`}
                  onClick={() => act(() => setPreset(view))}
                >
                  {[<Box />, <View />, <CircleDot />, <Triangle />][index]}
                </button>
              ),
            )}
          </footer>
        </section>
        <section className={`fru10110-net ${tab === "net" ? "selected" : ""}`}>
          <header>
            <h2>NET (UNFOLDED LATERAL SURFACE)</h2>
            <label>
              Unfold{" "}
              <input
                type="checkbox"
                checked={unfold}
                onChange={(event) => act(() => setUnfold(event.target.checked))}
              />
            </label>
          </header>
          <svg
            viewBox="0 0 360 360"
            aria-label="Annular sector net of the frustum"
          >
            <path d={sector} className={unfold ? "open" : "closed"} />
            <line x1="180" y1="180" x2={a.x} y2={a.y} />
            <line x1="180" y1="180" x2={b.x} y2={b.y} />
            <text x="145" y="36">
              2πR
            </text>
            <text x="150" y="150">
              2πr
            </text>
            <text x="174" y="203">
              θ
            </text>
          </svg>
          <aside>
            <strong>θ = 2π(R − r) / l = {f2(theta)} rad</strong>
            <p>θ ≈ {f2(degrees)}°</p>
            <small>
              Outer radius {f2(outerSlant)}, inner radius {f2(innerSlant)}
            </small>
          </aside>
        </section>
      </main>
      <section className="fru10110-results">
        <h2>RESULTS</h2>
        <article>
          <b>VOLUME</b>
          <strong>V = πh(R² + Rr + r²) / 3</strong>
          <p>≈ {f2(volume)} cubic units</p>
        </article>
        <article>
          <b>CURVED SURFACE AREA (LATERAL)</b>
          <strong>CSA = π(R + r)l</strong>
          <p>≈ {f2(csa)} square units</p>
        </article>
        <article>
          <b>TOTAL SURFACE AREA (INCLUDING BASES)</b>
          <strong>TSA = CSA + πR² + πr²</strong>
          <p>≈ {f2(tsa)} square units</p>
        </article>
        <aside>
          <b>IMPORTANT WARNING</b>
          <p>Do NOT use h in place of l for curved surface area.</p>
          <strong>Use l = √(h² + (R − r)²).</strong>
        </aside>
      </section>
      <footer className="fru10110-info">
        <Info /> All values update live as you move the sliders. Formulas use
        exact π and precise calculations.
      </footer>
    </section>
  );
}

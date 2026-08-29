import { Canvas } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { ArrowLeft, ArrowRight, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent } from "react";
import * as THREE from "three";
import type { LessonAdapterProps } from "../types";
import "./VectorPlaneTargetLesson195.css";
type P = { x: number; y: number; z: number };
const A0 = { x: 1, y: 1, z: 1 },
  U0 = { x: 2, y: 0, z: 1 },
  V0 = { x: 0, y: 2, z: 1 },
  clamp = (n: number, min = -4, max = 6) =>
    Math.max(min, Math.min(max, Math.round(n * 2) / 2)),
  add = (a: P, b: P) => ({ x: a.x + b.x, y: a.y + b.y, z: a.z + b.z }),
  scale = (p: P, k: number) => ({ x: p.x * k, y: p.y * k, z: p.z * k }),
  cross = (a: P, b: P) => ({
    x: a.y * b.z - a.z * b.y,
    y: a.z * b.x - a.x * b.z,
    z: a.x * b.y - a.y * b.x,
  }),
  point = (a: P, u: P, v: P, s: number, t: number) =>
    add(a, add(scale(u, s), scale(v, t))),
  fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1)),
  gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a)),
  simplify = (p: P) => {
    const d = gcd(gcd(p.x, p.y), p.z) || 1;
    return { x: p.x / d, y: p.y / d, z: p.z / d };
  };
function Arrow3({ p, color }: { p: P; color: string }) {
  const arrow = useMemo(
    () =>
      new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(),
        1,
        color,
        0.25,
        0.14,
      ),
    [color],
  );
  useEffect(() => {
    const d = new THREE.Vector3(p.x, p.z, p.y),
      l = d.length();
    arrow.setDirection(l ? d.normalize() : new THREE.Vector3(1, 0, 0));
    arrow.setLength(Math.max(0.001, l), 0.25, 0.14);
  }, [arrow, p]);
  return <primitive object={arrow} />;
}
function PlaneScene({
  a,
  u,
  v,
  s,
  t,
  grid,
  normal,
  view,
  onST,
}: {
  a: P;
  u: P;
  v: P;
  s: number;
  t: number;
  grid: boolean;
  normal: boolean;
  view: number;
  onST: (s: number, t: number) => void;
}) {
  const r = point(a, u, v, s, t),
    n = simplify(cross(u, v)),
    start = useRef<{ x: number; y: number; s: number; t: number } | null>(null),
    scene = (p: P): [number, number, number] => [p.x, p.z, p.y],
    geometry = useMemo(() => {
      const g = new THREE.BufferGeometry();
      const c = [
        point(a, u, v, -0.8, -0.8),
        point(a, u, v, 2.2, -0.8),
        point(a, u, v, 2.2, 2.2),
        point(a, u, v, -0.8, 2.2),
      ].map(scene);
      g.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(
          [...c[0], ...c[1], ...c[2], ...c[0], ...c[2], ...c[3]],
          3,
        ),
      );
      return g;
    }, [a, u, v]);
  return (
    <Canvas
      key={view}
      camera={{ position: [9, 8, 9], fov: 43 }}
      gl={{ antialias: true, preserveDrawingBuffer: true }}
    >
      <color attach="background" args={["#fff"]} />
      <ambientLight intensity={1.3} />
      <gridHelper args={[12, 12, "#b8c7d0", "#e3e9ed"]} />
      <Arrow3 p={{ x: 5, y: 0, z: 0 }} color="#222d3d" />
      <Arrow3 p={{ x: 0, y: 5, z: 0 }} color="#222d3d" />
      <Arrow3 p={{ x: 0, y: 0, z: 5 }} color="#222d3d" />
      <Html position={[5, 0, 0]} center><b className="vp195-axis">x</b></Html>
      <Html position={[0, 0, 5]} center><b className="vp195-axis">y</b></Html>
      <Html position={[0, 5, 0]} center><b className="vp195-axis">z</b></Html>
      <mesh geometry={geometry}>
        <meshBasicMaterial
          color="#7777ee"
          transparent
          opacity={0.28}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {grid &&
        [-1, 0, 1, 2].flatMap((i) => [
          <Line
            key={`u${i}`}
            points={[
              scene(point(a, u, v, -1, i)),
              scene(point(a, u, v, 2.5, i)),
            ]}
            color="#969bb5"
            dashed
            lineWidth={1}
          />,
          <Line
            key={`v${i}`}
            points={[
              scene(point(a, u, v, i, -1)),
              scene(point(a, u, v, i, 2.5)),
            ]}
            color="#969bb5"
            dashed
            lineWidth={1}
          />,
        ])}
      <group position={scene(a)}>
        <Arrow3 p={u} color="#0799bb" />
        <Arrow3 p={v} color="#6d35d4" />
        {normal && <Arrow3 p={n} color="#159447" />}
      </group>
      <Html position={scene(r)} center>
        <button
          data-testid="plane-r-tip"
          aria-label="Point R on plane"
          className="vp195-r-tip"
          onPointerDown={(e: PointerEvent<HTMLButtonElement>) => {
            e.stopPropagation();
            start.current = { x: e.clientX, y: e.clientY, s, t };
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e: PointerEvent<HTMLButtonElement>) => {
            if (!start.current || !e.buttons) return;
            e.stopPropagation();
            onST(
              clamp(
                start.current.s + (e.clientX - start.current.x) / 35,
                -3,
                3,
              ),
              clamp(
                start.current.t - (e.clientY - start.current.y) / 35,
                -3,
                3,
              ),
            );
          }}
          onPointerUp={() => {
            start.current = null;
          }}
        >
          R
        </button>
      </Html>
      <OrbitControls makeDefault target={[2, 2, 2]} />
    </Canvas>
  );
}
function Fields({
  title,
  p,
  onP,
}: {
  title: string;
  p: P;
  onP: (p: P) => void;
}) {
  return (
    <section>
      <h3>{title}</h3>
      <div>
        {(["x", "y", "z"] as const).map((k) => (
          <input
            key={k}
            aria-label={`${title} ${k}`}
            type="number"
            value={p[k]}
            onChange={(e) => onP({ ...p, [k]: clamp(+e.target.value) })}
          />
        ))}
      </div>
      <output>
        {title[title.length - 1]} = ({fmt(p.x)}, {fmt(p.y)}, {fmt(p.z)})
      </output>
    </section>
  );
}
export default function VectorPlaneTargetLesson195({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [a, setA] = useState(A0),
    [u, setU] = useState(U0),
    [v, setV] = useState(V0),
    [s, setS] = useState(1.5),
    [t, setT] = useState(1),
    [grid, setGrid] = useState(true),
    [normal, setNormal] = useState(true),
    [equation, setEquation] = useState(true),
    [tab, setTab] = useState(0),
    [language, setLanguage] = useState("English (English)"),
    [shared, setShared] = useState(false),
    [view, setView] = useState(0),
    [challenge, setChallenge] = useState(false);
  const r = point(a, u, v, s, t),
    raw = cross(u, v),
    n = simplify(raw),
    constant = n.x * a.x + n.y * a.y + n.z * a.z,
    independent = Math.hypot(raw.x, raw.y, raw.z) > 0.001,
    interact = () => onInteraction();
  useEffect(() => {
    setA(A0);
    setU(U0);
    setV(V0);
    setS(1.5);
    setT(1);
    setGrid(true);
    setNormal(true);
    setEquation(true);
    setTab(0);
    setLanguage("English (English)");
    setShared(false);
    setView((x) => x + 1);
    setChallenge(false);
  }, [resetToken]);
  const reset = () => {
    setA(A0);
    setU(U0);
    setV(V0);
    setS(1.5);
    setT(1);
    setGrid(true);
    setNormal(true);
    setEquation(true);
    setChallenge(false);
    setView((x) => x + 1);
    interact();
  };
  return (
    <main
      className="vp195-page"
      data-testid="vector-mockup-0252"
      data-dedicated-lesson="195"
      data-object-model="three-dimensional-parametric-plane-anchor-span-parameters-normal-equation-challenge"
      data-a={`${a.x}:${a.y}:${a.z}`}
      data-u={`${u.x}:${u.y}:${u.z}`}
      data-v={`${v.x}:${v.y}:${v.z}`}
      data-s={s}
      data-t={t}
      data-r={`${r.x}:${r.y}:${r.z}`}
      data-normal={`${n.x}:${n.y}:${n.z}`}
      data-independent={independent}
      data-grid={grid}
      data-show-normal={normal}
      data-equation={equation}
      data-tab={tab}
      data-language={language}
      data-shared={shared}
      data-view={view}
      data-challenge={challenge}
    >
      <header className="vp195-header">
        <section>
          <span>GEOMETRY</span>
          <span>VECTORS</span>
          <h1>Vector Equation of a Plane</h1>
          <p>Represent planes parametrically</p>
          <aside>
            <b>♙ Intermediate-Advanced</b>
            <b>ϟ Applied Lab</b>
            <b>▣ Vector Tools</b>
            <b>◷ 6-10 min</b>
          </aside>
        </section>
        <nav>
          <select
            aria-label="Lesson language"
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              interact();
            }}
          >
            <option>English (English)</option>
            <option>हिन्दी (Hindi)</option>
          </select>
          <button onClick={reset}>
            <RotateCcw />
            Reset
          </button>
          <button
            onClick={() => {
              setShared(true);
              navigator.clipboard
                ?.writeText(location.href)
                .catch(() => undefined);
              interact();
            }}
          >
            <Share2 />
            {shared ? "Shared" : "Share"}
          </button>
          <a href="/workspace/geometry">Workspace</a>
        </nav>
      </header>
      <nav className="vp195-tabs">
        {["Interact", "Learn", "Examples", "Formula", "Practice"].map(
          (name, index) => (
            <button
              key={name}
              className={tab === index ? "active" : ""}
              onClick={() => {
                setTab(index);
                interact();
              }}
            >
              {name}
            </button>
          ),
        )}
      </nav>
      <section className="vp195-main">
        <article className="vp195-work">
          <h2>3D PARAMETRIC PLANE WORKBENCH</h2>
          <output>r = a + s u + t v</output>
          <aside>
            <b>● a (anchor point)</b>
            <b>➜ u (direction)</b>
            <b>➜ v (direction)</b>
            <b>● R(s,t) (point on plane)</b>
            <b>● n (normal)</b>
            <b>· Parameter grid</b>
            <b>■ Plane patch</b>
          </aside>
          <div>
            <PlaneScene
              a={a}
              u={u}
              v={v}
              s={s}
              t={t}
              grid={grid}
              normal={normal}
              view={view}
              onST={(ns, nt) => {
                setS(ns);
                setT(nt);
                interact();
              }}
            />
          </div>
          <footer>
            <section>
              {[
                ["Show parameter grid", grid, setGrid],
                ["Show normal", normal, setNormal],
                ["Show plane equation", equation, setEquation],
              ].map(([name, value, setter]) => (
                <label key={String(name)}>
                  <input
                    aria-label={String(name)}
                    type="checkbox"
                    checked={value as boolean}
                    onChange={() => {
                      (setter as (f: (x: boolean) => boolean) => void)(
                        (x) => !x,
                      );
                      interact();
                    }}
                  />
                  {name}
                </label>
              ))}
              <button
                onClick={() => {
                  setView((x) => x + 1);
                  interact();
                }}
              >
                <RotateCcw />
                Reset view
              </button>
            </section>
            <article>
              <h3>How to use</h3>
              <p>
                Adjust s and t to move R(s,t) across the plane. The position
                vector r updates, and the plane equation remains satisfied.
              </p>
            </article>
          </footer>
        </article>
        <aside className="vp195-rail">
          <article>
            <h2>Define the plane</h2>
            <Fields
              title="Anchor point a"
              p={a}
              onP={(p) => {
                setA(p);
                interact();
              }}
            />
            <Fields
              title="Direction vector u"
              p={u}
              onP={(p) => {
                setU(p);
                interact();
              }}
            />
            <Fields
              title="Direction vector v"
              p={v}
              onP={(p) => {
                setV(p);
                interact();
              }}
            />
            <strong>
              {independent
                ? "u and v are not parallel"
                : "u and v are parallel"}
            </strong>
          </article>
          <article>
            <h2>Parameters (move R on the plane)</h2>
            {[
              ["s", s, setS],
              ["t", t, setT],
            ].map(([name, value, setter]) => (
              <label key={String(name)}>
                <b>
                  {name} = {fmt(value as number)}
                </b>
                <span>-3</span>
                <input
                  aria-label={`Plane parameter ${name}`}
                  type="range"
                  min="-3"
                  max="3"
                  step=".5"
                  value={value as number}
                  onChange={(e) => {
                    (setter as (n: number) => void)(+e.target.value);
                    interact();
                  }}
                />
                <span>3</span>
                <input
                  aria-label={`Exact plane parameter ${name}`}
                  type="number"
                  value={value as number}
                  onChange={(e) => {
                    (setter as (n: number) => void)(
                      clamp(+e.target.value, -3, 3),
                    );
                    interact();
                  }}
                />
              </label>
            ))}
          </article>
          <article className="vp195-results">
            <h2>Results</h2>
            <p>R(s,t) = a + s u + t v</p>
            <output>
              R(s,t) = ({fmt(r.x)}, {fmt(r.y)}, {fmt(r.z)})
            </output>
            <p>
              Position vector r = OR
              <br />
              <b>
                r = ({fmt(r.x)}, {fmt(r.y)}, {fmt(r.z)})
              </b>
            </p>
            <hr />
            <p>
              Normal vector
              <br />
              <b>
                n = u × v = ({raw.x}, {raw.y}, {raw.z})
              </b>
              <br />
              Simplified n = ({n.x}, {n.y}, {n.z})
            </p>
            {equation && (
              <>
                <hr />
                <p>
                  Plane equation
                  <br />
                  <b>
                    {n.x}x + {n.y}y + {n.z}z = {constant}
                  </b>
                </p>
              </>
            )}
            <strong>R satisfies the plane equation</strong>
          </article>
          <button
            onClick={() => {
              setS(1);
              setT(2);
              setChallenge(true);
              interact();
            }}
          >
            Try: find s,t for R = (3,5,4) <ArrowRight />
          </button>
        </aside>
      </section>
      <nav className="vp195-nav">
        <a href="/lessons/geometry/194-vector-equation-of-a-line">
          <ArrowLeft />
          <span>
            PREVIOUS<b>Vector Equation of a Line</b>
          </span>
        </a>
        <a href="/lessons/geometry/196-relative-motion">
          <span>
            NEXT<b>Relative Motion</b>
          </span>
          <ArrowRight />
        </a>
      </nav>
      <footer className="vp195-footer">
        <b>Math Universe</b>
        <span>
          Interactive math labs, visual proofs, NCERT explorations, graphing,
          CAS-style tools, and classroom-ready activities.
        </span>
        <small>© 2026 INDIAN SERVERS PRIVATE LIMITED.</small>
        <nav>
          <a href="/sitemap">Sitemap</a>
          <a href="/docs">Docs</a>
          <a href="/about">About</a>
        </nav>
      </footer>
    </main>
  );
}

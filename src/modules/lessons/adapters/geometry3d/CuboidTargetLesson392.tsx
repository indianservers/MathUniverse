import { Billboard, Edges, Line, OrbitControls, Text } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { ExternalLink, RotateCcw, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { LessonAdapterProps } from "../../types";
import "./CoordinateSystemTargetLesson378.css";
import "./CuboidTargetLesson392.css";

type Dims = [number, number, number];
const initial: Dims = [5, 3, 2],
  clean = (value: number) => Number(value.toFixed(2));

export default function CuboidTargetLesson392({
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [dims, setDims] = useState<Dims>(initial),
    [layers, setLayers] = useState([true, true, false]),
    [tab, setTab] = useState("Interaction + visualization"),
    [cameraReset, setCameraReset] = useState(0),
    [shared, setShared] = useState(false),
    [actions, setActions] = useState(0),
    [length, width, height] = dims,
    volume = clean(length * width * height),
    surface = clean(2 * (length * width + width * height + height * length)),
    base = clean(length * width),
    face = clean(Math.hypot(length, width)),
    space = clean(Math.hypot(length, width, height)),
    act = (action: () => void) => {
      action();
      setActions((value) => value + 1);
      onInteraction();
    },
    reset = () => {
      setDims(initial);
      setLayers([true, true, false]);
      setTab("Interaction + visualization");
      setCameraReset((value) => value + 1);
      setShared(false);
      setActions(0);
    };
  useEffect(reset, [resetToken]);
  const step = (index: number, delta: number) =>
      act(() =>
        setDims(
          (current) =>
            current.map((value, i) =>
              i === index
                ? Math.max(1, Math.min(8, clean(value + delta)))
                : value,
            ) as Dims,
        ),
      ),
    share = () =>
      act(() => {
        void navigator.clipboard?.writeText(
          `Cuboid ${length}×${width}×${height}: V=${volume}, S=${surface}, d=${space}`,
        );
        setShared(true);
      });
  return (
    <section
      className="cs378-page cub392-page"
      data-testid="geometry3d-mockup-0577"
      data-object-model="threejs-dedicated-parametric-cuboid-six-dimension-steppers-face-space-diagonals-six-face-net-orbit-exact-volume-surface-base-practice"
      data-dimensions={JSON.stringify(dims)}
      data-volume={volume}
      data-surface={surface}
      data-base={base}
      data-face-diagonal={face}
      data-space-diagonal={space}
      data-layers={JSON.stringify(layers)}
      data-tab={tab}
      data-shared={shared}
      data-actions={actions}
    >
      <header className="cs378-hero">
        <div className="cs378-pills">
          <b>3D MATHEMATICS</b>
          <b>3D GEOMETRY AND SOLIDS</b>
        </div>
        <h1>Cuboid</h1>
        <p>Explore rectangular prisms.</p>
        <nav>
          <span>Intermediate–Advanced</span>
          <span>3D Lab</span>
          <span>3D Calculator</span>
          <span>6–10 min</span>
        </nav>
        <div className="cs378-actions">
          <select aria-label="Language">
            <option>English (English)</option>
          </select>
          <button onClick={() => act(reset)}>
            <RotateCcw />
            Reset
          </button>
          <button onClick={share}>
            <Share2 />
            {shared ? "Shared" : "Share"}
          </button>
          <button
            onClick={() => act(() => setCameraReset((value) => value + 1))}
          >
            <ExternalLink />
            Workspace
          </button>
        </div>
      </header>
      <nav className="cs378-tabs">
        {[
          "Interaction + visualization",
          "Explain",
          "Examples",
          "Formulas",
          "Know more",
        ].map((name) => (
          <button
            key={name}
            className={tab === name ? "active" : ""}
            onClick={() => act(() => setTab(name))}
          >
            {name}
          </button>
        ))}
      </nav>
      <section className="cub392-work">
        <article className="cub392-lab">
          <header>
            <small>INTERACTION + VISUALIZATION</small>
            <h2>Explore the cuboid</h2>
            <p>
              Adjust the dimensions to see how edges, diagonals, and measures
              change.
            </p>
          </header>
          <div className="cub392-scene" data-testid="geometry3d-cuboid-canvas">
            <Canvas camera={{ position: [8, 6, 10], fov: 42 }} dpr={[1, 1.5]}>
              <color attach="background" args={["#06172b"]} />
              <ambientLight intensity={1.8} />
              <directionalLight position={[7, 9, 6]} intensity={2.2} />
              <CuboidScene
                dims={dims}
                layers={layers}
                cameraReset={cameraReset}
                face={face}
                space={space}
              />
            </Canvas>
            <div className="cub392-legend">
              <span className="l">l &nbsp; length ({length})</span>
              <span className="w">w &nbsp; width ({width})</span>
              <span className="h">h &nbsp; height ({height})</span>
            </div>
            <div className="cub392-facts">
              <span>
                ⌞ <b>Edges</b>
                <small>
                  12 edges
                  <br />4 of each length
                </small>
              </span>
              <span>
                □ <b>Faces</b>
                <small>
                  6 rectangular faces
                  <br />
                  (3 pairs equal)
                </small>
              </span>
              <span>
                ∟ <b>Right angles</b>
                <small>All faces meet at 90°</small>
              </span>
            </div>
          </div>
        </article>
        <aside className="cub392-side">
          <section className="cub392-dims">
            <header>
              <h2>Dimensions ⓘ</h2>
              <button onClick={() => act(reset)}>Reset</button>
            </header>
            {["Length", "Width", "Height"].map((name, index) => (
              <label key={name}>
                {name} <i>{["l", "w", "h"][index]}</i>
                <button
                  aria-label={`Decrease ${name}`}
                  onClick={() => step(index, -1)}
                >
                  −
                </button>
                <output>{dims[index]}</output>
                <button
                  aria-label={`Increase ${name}`}
                  onClick={() => step(index, 1)}
                >
                  +
                </button>
              </label>
            ))}
          </section>
          <section className="cub392-options">
            <h2>Options</h2>
            {[
              "Show face diagonal (l×w face)",
              "Show space diagonal",
              "Show net (unfolded)",
            ].map((name, index) => (
              <label key={name}>
                {name}
                <input
                  aria-label={name}
                  type="checkbox"
                  checked={layers[index]}
                  onChange={() =>
                    act(() =>
                      setLayers((current) =>
                        current.map((value, i) =>
                          i === index ? !value : value,
                        ),
                      ),
                    )
                  }
                />
              </label>
            ))}
          </section>
          <section className="cub392-results">
            <h2>Live results</h2>
            <p>
              <span>
                Volume{" "}
                <small>
                  V = lwh
                  <br />= {length} × {width} × {height}
                </small>
              </span>
              <b>{volume}</b>
            </p>
            <p>
              <span>
                Surface area{" "}
                <small>
                  S = 2(lw + wh + hl)
                  <br />= 2({length}×{width} + {width}×{height} + {height}×
                  {length})
                </small>
              </span>
              <b>{surface}</b>
            </p>
            <p>
              <span>
                Base area{" "}
                <small>
                  Aᵦₐₛₑ = lw
                  <br />= {length} × {width}
                </small>
              </span>
              <b>{base}</b>
            </p>
            <p>
              <span>
                Space diagonal{" "}
                <small>
                  d = √(l² + w² + h²)
                  <br />= √({length}² + {width}² + {height}²)
                </small>
              </span>
              <b>
                √{clean(space ** 2)} ≈ {space}
              </b>
            </p>
          </section>
        </aside>
      </section>
      <section className="cub392-bottom">
        <article>
          <h2>💡 Key idea</h2>
          <p>
            A cuboid stretches the cube idea into three independent dimensions.
            Each dimension can change independently.
          </p>
        </article>
        <article>
          <h2>◎ Practice</h2>
          <p>Try l = 4, w = 2, h = 3 → V = 24, S = 52.</p>
          <button onClick={() => act(() => setDims([4, 2, 3]))}>
            Use values
          </button>
        </article>
      </section>
      <nav className="cs378-nav">
        <a href="/lessons/3d-mathematics/391-cube">
          ←{" "}
          <span>
            <small>PREVIOUS</small>Cube
          </span>
        </a>
        <a href="/lessons/3d-mathematics/393-prism">
          <span>
            <small>NEXT</small>Prism
          </span>{" "}
          →
        </a>
      </nav>
    </section>
  );
}

function CuboidScene({
  dims,
  layers,
  cameraReset,
  face,
  space,
}: {
  dims: Dims;
  layers: boolean[];
  cameraReset: number;
  face: number;
  space: number;
}) {
  const [l, w, h] = dims,
    scale = 0.72;
  if (layers[2])
    return (
      <>
        <OrbitControls
          key={cameraReset}
          makeDefault
          target={[0, 0, 0]}
          minDistance={7}
          maxDistance={24}
        />
        <CuboidNet dims={dims} />
      </>
    );
  return (
    <>
      <OrbitControls
        key={cameraReset}
        makeDefault
        target={[0, 0, 0]}
        minDistance={7}
        maxDistance={24}
      />
      <group scale={scale}>
        <mesh>
          <boxGeometry args={[l, h, w]} />
          <meshStandardMaterial color="#5c7fa9" transparent opacity={0.34} />
          <Edges color="#9cb8d4" lineWidth={2} />
        </mesh>
        {layers[0] && (
          <>
            <Line
              points={[
                [-l / 2, h / 2, w / 2],
                [l / 2, h / 2, -w / 2],
              ]}
              color="#ffe55e"
              dashed
              lineWidth={3}
            />
            <Billboard position={[0.8, h / 2 + 0.5, 0]}>
              <Text fontSize={0.25} color="#ffe55e">
                Face diagonal √{clean(l * l + w * w)} ≈ {face}
              </Text>
            </Billboard>
          </>
        )}
        {layers[1] && (
          <>
            <Line
              points={[
                [-l / 2, -h / 2, w / 2],
                [l / 2, h / 2, -w / 2],
              ]}
              color="#aa94ff"
              dashed
              lineWidth={3}
            />
            <Billboard position={[0.5, 0, 0]}>
              <Text fontSize={0.25} color="#b9a6ff">
                Space diagonal √{clean(l * l + w * w + h * h)} ≈ {space}
              </Text>
            </Billboard>
          </>
        )}
        <Labels dims={dims} />
      </group>
    </>
  );
}
function Labels({ dims: [l, w, h] }: { dims: Dims }) {
  return (
    <>
      <Billboard position={[0, -h / 2 - 0.35, w / 2]}>
        <Text fontSize={0.24} color="#4c86ff">
          l = {l}
        </Text>
      </Billboard>
      <Billboard position={[l / 2 + 0.35, -h / 2, 0]}>
        <Text fontSize={0.24} color="#37d56f">
          w = {w}
        </Text>
      </Billboard>
      <Billboard position={[l / 2 + 0.3, 0, -w / 2]}>
        <Text fontSize={0.24} color="#ff5767">
          h = {h}
        </Text>
      </Billboard>
    </>
  );
}
function CuboidNet({ dims: [l, w, h] }: { dims: Dims }) {
  const faces = [
    { p: [0, 0], s: [l, w] },
    { p: [0, w + h], s: [l, h] },
    { p: [0, -w - h], s: [l, h] },
    { p: [(l + w) / 2, 0], s: [w, h] },
    { p: [-(l + w) / 2, 0], s: [w, h] },
    { p: [0, 2 * w + 2 * h], s: [l, w] },
  ];
  return (
    <group rotation={[-Math.PI / 2, 0, 0]} scale={0.48}>
      {faces.map((face, index) => (
        <mesh key={index} position={[face.p[0], face.p[1], 0]}>
          <planeGeometry args={[face.s[0], face.s[1]]} />
          <meshStandardMaterial
            color={index % 2 ? "#45b8cd" : "#237e9d"}
            transparent
            opacity={0.78}
          />
          <Edges color="#c4f7ff" lineWidth={2} />
        </mesh>
      ))}
    </group>
  );
}

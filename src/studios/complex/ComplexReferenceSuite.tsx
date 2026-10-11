import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Link } from "react-router-dom";
import {
  Home,
  BookOpen,
  FlaskConical,
  Grid2X2,
  Search,
  Sun,
  Moon,
  CircleHelp,
  Settings,
  Target,
  ChartNoAxesColumn,
  RotateCw,
  RotateCcw,
  MoveUpRight,
  Ellipsis,
  ZoomIn,
  ZoomOut,
  Expand,
  Grid3X3,
  Type,
  Camera,
  Download,
  Check,
  RefreshCw,
  ArrowRightLeft,
  Lightbulb,
  Eye,
  Network,
  Pencil,
  Trophy,
  ChevronRight,
  Play,
  Info,
  Binoculars,
  X,
  ArrowRight,
} from "lucide-react";
import MathExpression from "../../components/ui/MathExpression";
import { useStudioState } from "../phase1/StudioModelProvider";
import { useLabMode } from "../mockup/studioLabKit";
import type { StudioMockupPage } from "../mockup/studioMockupCatalog";
import { nthRoots, fromPolar, mulC, type C } from "./complexLabMath";
import {
  argandNumber,
  argandComplex,
  complexLabel,
} from "./argandReferenceMath";
import { markComplexComplete } from "./complexStudioSession";
import {
  phaseTex,
  polarValues,
  multiplicationSequence,
  sameDirectionDegrees,
} from "./referenceSuiteMath";
import ComplexLearningDepth from "./ComplexLearningDepth";
import "./complexReferenceSuite.css";

const num = (n: number, digits = 2) => Number(n.toFixed(digits)).toString();
const mathZ = (z: C) =>
  `${num(z.re)}${z.im < 0 ? "-" : "+"}${num(Math.abs(z.im))}i`;
const MathText = ({ value }: { value: string }) => (
  <MathExpression value={value} />
);

export function Planet({ small = false }: { small?: boolean }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={small ? "cr-planet small" : "cr-planet"}
      viewBox="0 0 92 70"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x2=".8" y2="1">
          <stop stopColor="#86efff" />
          <stop offset=".48" stopColor="#409aff" />
          <stop offset="1" stopColor="#8c35fa" />
        </linearGradient>
      </defs>
      <ellipse
        cx="44"
        cy="37"
        rx="39"
        ry="11"
        fill="none"
        stroke="#2865ff"
        strokeWidth="5"
        transform="rotate(-24 44 37)"
      />
      <circle cx="45" cy="34" r="25" fill={`url(#${id})`} />
      <path
        d="M11 46Q27 59 79 23"
        fill="none"
        stroke="#a3f1ff"
        strokeWidth="4"
      />
    </svg>
  );
}
export function Robot({
  onClick,
  family,
}: {
  onClick: () => void;
  family: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <button className="cr-robot" onClick={onClick} aria-label="Chat with Ruhi">
      <svg viewBox="0 0 120 145" aria-hidden="true">
        <defs>
          <linearGradient id={id} x2=".7" y2="1">
            <stop stopColor="#fff" />
            <stop offset=".5" stopColor="#d8e9f3" />
            <stop offset="1" stopColor="#829dbb" />
          </linearGradient>
          <radialGradient id={`${id}-face`} cx=".4" cy=".2" r=".9">
            <stop stopColor="#17364f" />
            <stop offset="1" stopColor="#020b19" />
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="135" rx="34" ry="6" fill="#8faeca33" />
        <path d="M53 20V9" stroke="#517393" strokeWidth="4" />
        <circle cx="53" cy="7" r="5" fill="#7d9cb7" />
        <rect
          x="17"
          y="28"
          width="86"
          height="65"
          rx="30"
          fill={`url(#${id})`}
          stroke="#819bb4"
        />
        <rect
          x="28"
          y="39"
          width="66"
          height="42"
          rx="20"
          fill={`url(#${id}-face)`}
          stroke="#a7d1e8"
          strokeWidth="3"
        />
        <path
          d="M34 45q24-9 52-1"
          stroke="#597990"
          strokeWidth="2"
          opacity=".5"
          fill="none"
        />
        <path
          d="M40 60q5-11 12 0M69 60q5-11 12 0"
          fill="none"
          stroke="#31dfff"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {family === "roots" && (
          <g fill="#42dcff">
            <ellipse cx="45" cy="60" rx="5" ry="8" />
            <ellipse cx="75" cy="60" rx="5" ry="8" />
          </g>
        )}
        <path
          d="M52 74q8 5 16 0"
          stroke="#42dcff"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="9" y="46" width="9" height="28" rx="4" fill="#7998b5" />
        <rect x="102" y="46" width="9" height="28" rx="4" fill="#7998b5" />
        <path
          d="M41 91q-12 18 0 32h37q11-15-1-32Z"
          fill={`url(#${id})`}
          stroke="#879eb6"
        />
        <circle
          cx="60"
          cy="106"
          r="8"
          fill="#34bce4"
          stroke="white"
          strokeWidth="3"
        />
        <path
          d="m38 94-13 17M83 93l13 12M46 123l-8 10M75 123l6 10"
          stroke="#95aec3"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </svg>
      <span>
        Hi! I'm Ruhi.{family === "rotation" ? " 👋" : ""}
        <small>
          {family === "rotation"
            ? "I can help you explore complex numbers. Try changing the angle or magnitude, or ask me a question!"
            : family === "roots"
              ? "Ask me anything!"
              : "Need help?"}
        </small>
        <b>
          Chat with Ruhi <ArrowRight />
        </b>
      </span>
    </button>
  );
}
export function RangeField({
  label,
  detail,
  value,
  onChange,
  min,
  max,
  color = "#258dff",
  step = 0.01,
  unit = "",
  disabled = false,
  badge,
  precision = 3,
}: {
  label: string;
  detail?: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  color?: string;
  step?: number;
  unit?: string;
  disabled?: boolean;
  badge?: string;
  precision?: number;
}) {
  const change = (raw: string) => {
    if (raw.trim() && Number.isFinite(Number(raw)))
      onChange(Math.max(min, Math.min(max, Number(raw))));
  };
  return (
    <label className={`cr-field${disabled ? " disabled" : ""}`}>
      <span>
        <b>{label}</b>
        {detail && <small>{detail}</small>}
        <input
          aria-label={label}
          type="number"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={Number(value.toFixed(precision))}
          onChange={(e) => change(e.target.value)}
        />
        {unit && <i>{unit}</i>}
      </span>
      <div>
        <input
          aria-label={`${label} slider`}
          type="range"
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          value={value}
          onChange={(e) => change(e.target.value)}
          style={
            {
              "--fill": `${((value - min) / (max - min)) * 100}%`,
              "--accent": color,
            } as CSSProperties
          }
        />
        {badge && <em style={{ color, background: `${color}16` }}>{badge}</em>}
      </div>
      <footer>
        <span>
          {min}
          {unit}
        </span>
        {label.startsWith("θ (") || label.startsWith("|w|")
          ? [1, 2, 3].map((k) => (
              <span key={k}>
                {num(min + ((max - min) * k) / 4)}
                {unit}
              </span>
            ))
          : null}
        <span>
          {max}
          {unit}
        </span>
      </footer>
    </label>
  );
}
function CheckButton({
  label,
  checked,
  change,
}: {
  label: string;
  checked: boolean;
  change: (v: boolean) => void;
}) {
  return (
    <button
      className="cr-checkbutton"
      aria-pressed={checked}
      onClick={() => change(!checked)}
    >
      <i>{checked && <Check />}</i>
      {label}
    </button>
  );
}
function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="cr-callout">
      <Info />
      <div>{children}</div>
    </div>
  );
}

type Snapshot = { angle: number; magnitude: number };
export default function ComplexReferenceSuite({
  page,
}: {
  page: StudioMockupPage;
}) {
  const family =
    page.id === "polar-forms"
      ? "polar"
      : page.id === "roots"
        ? "roots"
        : "rotation";
  const { tabs, mode, setMode } = useLabMode(page);
  const [re, setRe] = useStudioState(
    `ComplexNumbersStudioLabs:${family === "polar" ? "PolarLab" : "RootsLab"}:re`,
    1,
  );
  const [im, setIm] = useStudioState(
    `ComplexNumbersStudioLabs:${family === "polar" ? "PolarLab" : "RootsLab"}:im`,
    family === "polar" ? Math.sqrt(3) : 0,
  );
  const [branch, setBranch] = useStudioState(
    "ComplexNumbersStudioLabs:PolarLab:branch",
    -180,
  );
  const [n, setN] = useStudioState("ComplexNumbersStudioLabs:RootsLab:n", 6);
  const [rotation, setRotation] = useStudioState(
    "ComplexNumbersStudioLabs:RotationLab:th",
    90,
  );
  const [magnitude, setMagnitude] = useStudioState(
    "ComplexNumbersStudioLabs:RotationLab:mag",
    1,
  );
  const [zeroAngle, setZeroAngle] = useState(60),
    [grid, setGrid] = useState(family !== "rotation"),
    [circle, setCircle] = useState(true),
    [projections, setProjections] = useState(mode !== "Exponential"),
    [trail, setTrail] = useState(true),
    [vectors, setVectors] = useState(true),
    [labels, setLabels] = useState(true),
    [zoom, setZoom] = useState(1),
    [dark, setDark] = useState(false),
    [search, setSearch] = useState(""),
    [dialog, setDialog] = useState<string | null>(null),
    [answer, setAnswer] = useState(""),
    [feedback, setFeedback] = useState(""),
    [notice, setNotice] = useState("");
  const [past, setPast] = useState<Snapshot[]>([]),
    [future, setFuture] = useState<Snapshot[]>([]);
  const figure = useRef<HTMLElement>(null),
    plot = useRef<SVGSVGElement>(null),
    uid = useId().replace(/:/g, "");
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const sync = () =>
      setFullscreen(document.fullscreenElement === figure.current);
    document.addEventListener("fullscreenchange", sync);
    return () => document.removeEventListener("fullscreenchange", sync);
  }, []);
  useEffect(() => {
    setAnswer("");
    setFeedback("");
  }, [mode, re, im, rotation, magnitude, n, branch]);
  const polar = polarValues({ re, im }, branch),
    radius = polar.radius,
    angle = polar.angle ?? zeroAngle;
  const rootCount =
    mode === "Square Roots" ? 2 : Math.max(2, Math.min(12, Math.round(n)));
  const rootInput = mode === "Roots of Unity" ? { re: 1, im: 0 } : { re, im };
  const roots = nthRoots(rootInput, rootCount),
    rootRadius = Math.hypot(rootInput.re, rootInput.im) ** (1 / rootCount),
    distinct = Math.hypot(rootInput.re, rootInput.im) < 1e-12 ? 1 : rootCount;
  const rotationAngle = mode === "Scale" ? 0 : rotation;
  const initial: C = { re: 1, im: 0 },
    w = fromPolar(magnitude, rotationAngle),
    product = mulC(initial, w),
    sequence = multiplicationSequence(initial, magnitude, rotationAngle, 4);
  const title =
    family === "polar"
      ? "Polar & Exponential Forms Lab"
      : family === "roots"
        ? "Roots of Complex Numbers Lab"
        : "Multiplication as Rotation Lab";
  const polarFormula =
    mode === "Rectangular"
      ? "z=a+bi"
      : mode === "Polar"
        ? String.raw`z=r\operatorname{cis}\theta`
        : String.raw`z=re^{i\theta}`;
  const selectedFormula =
    mode === "Rectangular"
      ? `z=${mathZ({ re, im })}`
      : mode === "Polar"
        ? `z=${num(radius)}\\operatorname{cis}${num(angle, 1)}^\\circ`
        : `z=${num(radius)}e^{i(${phaseTex(angle)})}`;
  const setPolar = (r: number, theta: number) => {
    setZeroAngle(theta);
    const z = fromPolar(r, theta);
    setRe(z.re);
    setIm(z.im);
  };
  const updateRotation = (next: Snapshot) => {
    setPast((prev) => [...prev.slice(-49), { angle: rotation, magnitude }]);
    setFuture([]);
    setRotation(next.angle);
    setMagnitude(next.magnitude);
  };
  const switchMode = (next: string) => {
    setMode(next);
    setDialog(null);
    setNotice("");
    if (family === "rotation") {
      updateRotation({
        angle: next === "Scale" ? 0 : 90,
        magnitude: next === "Scale" ? 2 : 1,
      });
    }
    if (family === "polar") setProjections(next !== "Exponential");
  };
  const undo = () => {
    const last = past.at(-1);
    if (!last) return;
    setFuture((prev) => [...prev, { angle: rotation, magnitude }]);
    setPast((prev) => prev.slice(0, -1));
    setRotation(last.angle);
    setMagnitude(last.magnitude);
  };
  const redo = () => {
    const next = future.at(-1);
    if (!next) return;
    setPast((prev) => [...prev, { angle: rotation, magnitude }]);
    setFuture((prev) => prev.slice(0, -1));
    setRotation(next.angle);
    setMagnitude(next.magnitude);
  };
  const reset = () => {
    setZoom(1);
    setCircle(true);
    setLabels(true);
    setVectors(true);
    setGrid(family !== "rotation");
    setTrail(true);
    setProjections(mode !== "Exponential");
    setAnswer("");
    setFeedback("");
    if (family === "polar") {
      setRe(1);
      setIm(Math.sqrt(3));
      setBranch(-180);
    } else if (family === "roots") {
      setN(6);
      setRe(1);
      setIm(0);
    } else
      updateRotation({
        angle: mode === "Scale" ? 0 : 90,
        magnitude: mode === "Scale" ? 2 : 1,
      });
  };
  const extent =
    (family === "polar"
      ? Math.max(3.5, Math.abs(re) + 0.8, Math.abs(im) + 0.8)
      : family === "roots"
        ? Math.max(
            2.1,
            Math.abs(rootInput.re) + 0.5,
            Math.abs(rootInput.im) + 0.5,
            rootRadius * 1.5,
          )
        : Math.max(
            mode === "Scale" ? 2.6 : 1.3,
            ...(mode === "Sequence" ? sequence : sequence.slice(0, 2)).map(
              (z) => Math.hypot(z.re, z.im) * 1.35,
            ),
          )) / zoom;
  const scale = 210 / extent,
    ox = 315,
    oy = 220,
    px = (v: number) => ox + v * scale,
    py = (v: number) => oy - v * scale;
  const ticks = Array.from(
    { length: Math.floor(extent) * 2 + 1 },
    (_, i) => i - Math.floor(extent),
  );
  const pick = (event: PointerEvent<SVGSVGElement>) => {
    if (family === "rotation" || mode === "Roots of Unity") return;
    if (event.type === "pointermove" && !(event.buttons & 1)) return;
    const box = event.currentTarget.getBoundingClientRect(),
      s = Math.min(box.width / 630, box.height / 440),
      x = (event.clientX - box.left - (box.width - 630 * s) / 2) / s,
      y = (event.clientY - box.top - (box.height - 440 * s) / 2) / s;
    setRe(Math.max(-5, Math.min(5, (x - ox) / scale)));
    setIm(Math.max(-5, Math.min(5, (oy - y) / scale)));
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const save = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob),
      link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const exportPlot = async (png: boolean) => {
    if (!plot.current) return;
    const copy = plot.current.cloneNode(true) as SVGSVGElement;
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    copy.setAttribute("width", "1260");
    copy.setAttribute("height", "880");
    const style = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style",
    );
    style.textContent =
      "text{font:16px Arial,sans-serif;fill:#13245d}.cr-vector-label{fill:#7236ff;font-weight:bold;font-size:20px}";
    copy.prepend(style);
    const bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("width", "630");
    bg.setAttribute("height", "440");
    bg.setAttribute("fill", "#f8fcff");
    copy.prepend(bg);
    const blob = new Blob([new XMLSerializer().serializeToString(copy)], {
      type: "image/svg+xml",
    });
    if (!png) {
      save(blob, `${family}-${mode}.svg`);
      setNotice("SVG downloaded.");
      return;
    }
    try {
      const url = URL.createObjectURL(blob),
        img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Unable to render graph"));
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = 1260;
      canvas.height = 880;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      const result = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve),
      );
      if (result) {
        save(result, `${family}-${mode}.png`);
        setNotice("Screenshot downloaded.");
      }
    } catch {
      setNotice("Screenshot could not be created. Download the SVG instead.");
    }
  };
  const quizQuestion =
    family === "polar"
      ? mode === "Rectangular"
        ? "What is the argument θ (in degrees) for this complex number?"
        : mode === "Polar"
          ? `What is the rectangular form of ${num(radius)} cis ${num(angle, 1)}°?`
          : "What is the modulus r of the complex number shown?"
      : family === "roots"
        ? `How many distinct ${rootCount === 2 ? "square" : rootCount === 3 ? "cube" : `${rootCount}th`} roots does ${complexLabel(rootInput.re, rootInput.im)} have?`
        : mode === "Scale"
          ? "If |w| = 3 and |z| = 2, what is |zw|?"
          : mode === "Sequence"
            ? `What is arg(z w³) in degrees for z = 1?`
            : `What is arg(w) in degrees?`;
  const quiz = () => {
    let correct = false;
    if (family === "polar" && mode === "Polar") {
      const value = argandComplex(answer);
      correct = !!value && Math.hypot(value[0] - re, value[1] - im) < 0.025;
    } else {
      const value = argandNumber(answer);
      if (family === "roots") correct = value === distinct;
      else if (family === "polar")
        correct =
          mode === "Rectangular"
            ? polar.angle === null
              ? answer.trim().toLowerCase() === "undefined"
              : sameDirectionDegrees(value, angle)
            : Math.abs(value - radius) < 0.02;
      else
        correct =
          mode === "Scale"
            ? value === 6
            : magnitude === 0
              ? answer.trim().toLowerCase() === "undefined"
              : sameDirectionDegrees(
                  value,
                  rotationAngle * (mode === "Sequence" ? 3 : 1),
                );
    }
    setFeedback(
      correct
        ? "Correct! Your answer matches the mathematics."
        : "Try again. Read the live values and formula above.",
    );
    if (correct) markComplexComplete(page.id);
  };
  const contentType = family === "polar" ? `${mode} Form` : "Input & Controls";
  const rootFormula =
    mode === "Roots of Unity"
      ? String.raw`u_k=e^{2\pi ik/n}=\cos\frac{2\pi k}{n}+i\sin\frac{2\pi k}{n}`
      : String.raw`u_k=r^{\frac{1}{n}}\left(\cos\frac{\theta+2\pi k}{n}+i\sin\frac{\theta+2\pi k}{n}\right)`;
  const explain =
    family === "polar"
      ? "The same complex number, three different forms"
      : family === "roots"
        ? "Information about the current complex number and its roots."
        : "Multiplication adds arguments and multiplies moduli.";
  const learning =
    family === "polar"
      ? [
          [
            "Observe",
            "See how changing a or b moves the point on the Argand plane.",
          ],
          [
            "Understand",
            "Explore the relationship between rectangular, polar, and exponential forms.",
          ],
          [
            "Why It Works",
            "Learn the geometry and intuition behind the formulas.",
          ],
          [
            "Try It Yourself",
            "Experiment with different values and see the forms update instantly.",
          ],
          ["Challenge", "Test your skills with more complex numbers."],
        ]
      : family === "roots"
        ? [
            [
              "Observe",
              "Move the sliders and see how the roots are placed on the complex plane.",
            ],
            [
              "Understand",
              "See how De Moivre’s formula determines the magnitude and angles of the roots.",
            ],
            [
              "Why It Works",
              "Learn the connection between polar form, roots, and rotations in the complex plane.",
            ],
            [
              "Challenge",
              "Try different values of z and n. Can you predict the locations of the roots?",
            ],
          ]
        : [
            [
              "Learn the Idea",
              "Explore how multiplication rotates and scales points on the complex plane.",
            ],
            [
              "Watch a Quick Lesson",
              "See the geometric meaning of complex multiplication.",
            ],
            [
              "Try More Modes",
              "Explore rotation, scaling, and sequences with different values of w.",
            ],
          ];
  const learningIcons =
    family === "polar"
      ? [Eye, Lightbulb, Network, Pencil, Trophy]
      : family === "roots"
        ? [Binoculars, Lightbulb, MoveUpRight, Trophy]
        : [BookOpen, Play, Lightbulb];
  const polarFields = {
    real: (
      <RangeField
        label="Real part (Re)"
        detail="Horizontal position on the Argand plane"
        value={re}
        min={-5}
        max={5}
        onChange={setRe}
        badge="a"
      />
    ),
    imag: (
      <RangeField
        label="Imaginary part (Im)"
        detail="Vertical position on the Argand plane"
        value={im}
        min={-5}
        max={5}
        onChange={setIm}
        color="#8b4bff"
        badge="b"
      />
    ),
    radius: (
      <RangeField
        label="Modulus (r)"
        detail="Distance from origin (|z|)"
        value={radius}
        min={0}
        max={Math.max(5, radius)}
        onChange={(v) => setPolar(v, angle)}
        color="#23bed0"
        badge="r"
      />
    ),
    angle: (
      <RangeField
        label="Argument (θ)"
        detail="Angle from positive real axis"
        value={angle}
        min={branch}
        max={branch + 360}
        step={1}
        onChange={(v) => setPolar(radius, v)}
        color="#8b4bff"
        unit="°"
        badge="θ"
      />
    ),
  };
  return (
    <div
      className={`complex-reference-suite cr-${family}${dark ? " cr-night" : ""}`}
      data-complex-owned
      data-lab-pane="workspace"
      data-lab-mode={mode}
      data-cx-mode={mode}
      data-mode-canvas={mode}
    >
      <nav className="cr-nav" aria-label="Math Universe navigation">
        <Link className="cr-brand" to="/complex-numbers">
          <Planet small />
          <span>
            <b>Math Universe</b>
            {family === "polar" && (
              <small>EXPLORE · VISUALIZE · UNDERSTAND</small>
            )}
          </span>
        </Link>
        <div className="cr-nav-links">
          <Link
            className={family === "polar" ? "active" : ""}
            to="/complex-numbers"
          >
            <Home />
            {family === "roots" ? "Studio" : "Studio Home"}
          </Link>
          <Link to="/lessons">
            <BookOpen />
            Lessons & Practice
          </Link>
          <Link
            className={family !== "polar" ? "active" : ""}
            to={`/complex-numbers/${page.id}`}
          >
            <FlaskConical />
            Interactive Investigations
          </Link>
          <Link to="/">
            <Grid2X2 />
            App Home
          </Link>
        </div>
        <label className="cr-search">
          <Search />
          <input
            aria-label="Search lab modes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Math Universe..."
          />
          {search && (
            <div>
              {tabs
                .filter((t) => t.toLowerCase().includes(search.toLowerCase()))
                .map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      switchMode(t);
                      setSearch("");
                    }}
                  >
                    {t}
                  </button>
                ))}
              {!tabs.some((t) =>
                t.toLowerCase().includes(search.toLowerCase()),
              ) && <span>No matching modes</span>}
            </div>
          )}
        </label>
        {family !== "polar" && (
          <button aria-label="Help" onClick={() => setDialog("Help")}>
            <CircleHelp />
          </button>
        )}
        <button aria-label="Toggle theme" onClick={() => setDark(!dark)}>
          {dark ? <Moon /> : <Sun />}
        </button>
        <button
          className="cr-profile"
          aria-label="Learning progress"
          onClick={() => setDialog("Progress")}
        >
          {family === "roots" ? "RS" : <Planet small />}
        </button>
      </nav>
      {family === "rotation" && (
        <div className="cr-breadcrumb">
          <Link to="/complex-numbers">
            <Home />
            Complex Numbers Studio
          </Link>
          <ChevronRight />
          {title}
          <span>✧ Explore · Visualize · Discover ›</span>
        </div>
      )}
      <header className="cr-hero">
        {family === "roots" ? (
          <>
            <small>
              <Link to="/complex-numbers">Complex Numbers Studio</Link> ›
              Interactive Investigations
            </small>
            <h1>{title}</h1>
            <p>
              Explore nth roots, roots of unity, and polynomial roots on the
              Argand plane.
            </p>
            <svg className="cr-hills" viewBox="0 0 900 120" aria-hidden="true">
              <path
                d="M0 120Q100 20 180 100T350 70T620 45T900 110V120Z"
                fill="#b1d6fa66"
              />
              <path
                d="M100 120Q245 30 290 75T440 75T690 35T900 120Z"
                fill="#7cbbf777"
              />
            </svg>
            <blockquote>
              Complex ideas
              <br />
              brighter futures
              <br />— Math Universe
            </blockquote>
          </>
        ) : family === "rotation" ? (
          <>
            <span className="cr-hero-icon">
              <RotateCw />
            </span>
            <div>
              <h1>{title}</h1>
              <p>
                Visualize z × w as a rotation and scaling in the complex plane.
              </p>
            </div>
            <div className="cr-rotation-art">
              <Planet />
              <span>✦</span>
            </div>
            <aside>
              <b>Complex Numbers</b>
              <p>See algebra. Visualize deeper.</p>
            </aside>
          </>
        ) : (
          <>
            <small>INTERACTIVE INVESTIGATIONS</small>
            <h1>{title}</h1>
            <p>
              Convert between rectangular, polar, and exponential forms on the
              Argand plane.
            </p>
            <div className="cr-polar-art">
              <MathText value={polarFormula} />
              <small>
                SAME NUMBER.
                <br />
                THREE PERSPECTIVES.
                <br />A DEEPER UNDERSTANDING.
              </small>
            </div>
            <svg className="cr-globe" viewBox="0 0 230 200" aria-hidden="true">
              <defs>
                <radialGradient id={`${uid}globe`}>
                  <stop stopColor="#937dfc" stopOpacity=".65" />
                  <stop offset="1" stopColor="#72b1ff" stopOpacity=".5" />
                </radialGradient>
              </defs>
              <circle cx="110" cy="110" r="72" fill={`url(#${uid}globe)`} />
              <circle cx="110" cy="110" r="72" fill="none" stroke="#ffffffa9" />
              <ellipse
                cx="110"
                cy="110"
                rx="34"
                ry="72"
                fill="none"
                stroke="#ffffffa9"
              />
              <ellipse
                cx="110"
                cy="110"
                rx="72"
                ry="24"
                fill="none"
                stroke="#ffffffa9"
              />
              <path d="M16 110H208M110 195V4" stroke="#3049b4" />
              <path d="M110 110 160 59" stroke="white" strokeWidth="2" />
              <circle
                cx="160"
                cy="59"
                r="5"
                fill="white"
                style={{ filter: "drop-shadow(0 0 8px #ff84ff)" }}
              />
              <text x="202" y="104">
                Re
              </text>
              <text x="117" y="14">
                Im
              </text>
              {mode === "Exponential" && (
                <path
                  d="M110 110q-12-15-20 0t20 23q30-4 24-32t-40-30q-42 16-21 54t65 35"
                  fill="none"
                  stroke="#ffffffe0"
                  strokeDasharray="4 5"
                />
              )}
            </svg>
            <blockquote>
              {mode === "Polar"
                ? "“Polar form reveals the magnitude and direction of a complex number.”"
                : mode === "Exponential"
                  ? "“Euler’s formula connects algebra, geometry and rotation in the complex plane.”"
                  : "“Complex numbers connect algebra, geometry and a more beautiful perspective.”"}
            </blockquote>
          </>
        )}
      </header>
      <div className="cr-mode-toolbar">
        <nav aria-label={`${title} modes`}>
          {tabs.map((t, i) => {
            const Icon =
              family === "polar"
                ? [Grid2X2, Target, FlaskConical][i]
                : family === "rotation"
                  ? [RotateCw, MoveUpRight, Ellipsis][i]
                  : null;
            return (
              <button
                key={t}
                className={mode === t ? "active" : ""}
                aria-pressed={mode === t}
                onClick={() => switchMode(t)}
              >
                {Icon && <Icon />}
                {t === "nth Roots" ? "Nth Roots" : t}
              </button>
            );
          })}
        </nav>
        {family === "rotation" && (
          <div className="cr-tools">
            <button
              aria-label="Zoom out"
              onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
            >
              <ZoomOut />
            </button>
            <button
              aria-label="Zoom in"
              onClick={() => setZoom(Math.min(3, zoom + 0.25))}
            >
              <ZoomIn />
            </button>
            <button aria-label="Fit graph" onClick={() => setZoom(1)}>
              <MoveUpRight />
            </button>
            <button
              aria-label="Toggle grid"
              aria-pressed={grid}
              onClick={() => setGrid(!grid)}
            >
              <Grid3X3 />
            </button>
            <button
              aria-label="Toggle labels"
              aria-pressed={labels}
              onClick={() => setLabels(!labels)}
            >
              <Type />
            </button>
            <button aria-label="Screenshot" onClick={() => exportPlot(true)}>
              <Camera />
            </button>
            <button aria-label="Download SVG" onClick={() => exportPlot(false)}>
              <Download />
            </button>
            <button
              aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
              onClick={async () => {
                if (document.fullscreenElement) await document.exitFullscreen();
                else await figure.current?.requestFullscreen();
              }}
            >
              <Expand />
            </button>
            <button aria-label="Undo" disabled={!past.length} onClick={undo}>
              <RotateCcw />
            </button>
            <button aria-label="Redo" disabled={!future.length} onClick={redo}>
              <RotateCw />
            </button>
            <button aria-label="Settings" onClick={() => setDialog("Settings")}>
              <Settings />
            </button>
          </div>
        )}
      </div>
      {notice && (
        <div className="cr-notice" role="status">
          {notice}
          <button aria-label="Dismiss notice" onClick={() => setNotice("")}>
            <X />
          </button>
        </div>
      )}
      <div className="cr-panes">
        <section className="cr-panel cr-controls">
          <header>
            <span className="cr-icon">
              {family === "polar" ? (
                mode === "Rectangular" ? (
                  <Grid2X2 />
                ) : (
                  <Target />
                )
              ) : family === "rotation" ? (
                <RotateCw />
              ) : (
                <Settings />
              )}
            </span>
            <div>
              <h2>
                {family === "rotation" ? (
                  <MathText
                    value={String.raw`\text{Multiply by } e^{i\theta}`}
                  />
                ) : (
                  contentType
                )}
              </h2>
              <p>
                {family === "polar"
                  ? `Adjust ${mode === "Rectangular" ? "the real and imaginary parts" : mode === "Polar" ? "modulus and angle" : "modulus and phase"}`
                  : family === "roots"
                    ? `Choose a complex number and explore its ${mode.toLowerCase()}.`
                    : mode === "Scale"
                      ? "Scale a complex number by changing |w|. The angle θ is fixed at 0° in Scale mode."
                      : mode === "Sequence"
                        ? "Rotate a complex number by an angle θ and repeat to create a sequence."
                        : "Rotate a complex number by an angle θ on the complex plane."}
              </p>
            </div>
            {family === "polar" && (
              <span className="cr-sync">
                <RefreshCw />
                Forms stay
                <br />
                in sync
              </span>
            )}
          </header>
          {family === "polar" ? (
            <>
              {mode === "Rectangular" ? (
                <>
                  {polarFields.real}
                  {polarFields.imag}
                  <hr />
                  {polarFields.radius}
                  {polarFields.angle}
                </>
              ) : (
                <>
                  {polarFields.radius}
                  {polarFields.angle}
                  {polarFields.real}
                  {polarFields.imag}
                  <RangeField
                    label="Branch cut"
                    detail="Angle where the argument jumps"
                    value={branch}
                    onChange={setBranch}
                    min={-180}
                    max={180}
                    step={1}
                    color="#23bed0"
                    unit="°"
                    badge="c"
                  />
                </>
              )}
              {polar.angle === null && (
                <p className="cr-zero">At z = 0 the argument is undefined.</p>
              )}
            </>
          ) : family === "roots" ? (
            <>
              <RangeField
                label="n (roots)"
                value={mode === "Square Roots" ? 2 : rootCount}
                onChange={(v) => setN(Math.round(v))}
                min={2}
                max={12}
                step={1}
                disabled={mode === "Square Roots"}
              />
              {mode === "Roots of Unity" && (
                <Callout>
                  The nth roots of unity solve <MathText value="u^n=1" /> and
                  lie on the unit circle. The input is fixed at z = 1.
                </Callout>
              )}
              <RangeField
                label="Re z"
                value={rootInput.re}
                onChange={setRe}
                min={-5}
                max={5}
                disabled={mode === "Roots of Unity"}
              />
              <RangeField
                label="Im z"
                value={rootInput.im}
                onChange={setIm}
                min={-5}
                max={5}
                disabled={mode === "Roots of Unity"}
              />
              <Callout>
                <b>{mode}: </b>
                {mode === "Polynomial Roots" ? (
                  <>
                    Visualize every root of the polynomial{" "}
                    <MathText
                      value={`u^{${rootCount}}-(${mathZ(rootInput)})=0`}
                    />
                    .
                  </>
                ) : (
                  "Use De Moivre’s formula to visualize the roots on the complex plane."
                )}
              </Callout>
            </>
          ) : (
            <>
              <RangeField
                label="θ (angle of rotation)"
                value={rotationAngle}
                onChange={(v) => updateRotation({ angle: v, magnitude })}
                min={0}
                max={360}
                step={1}
                unit="°"
                disabled={mode === "Scale"}
              />
              <RangeField
                label="|w| (magnitude)"
                value={magnitude}
                onChange={(v) =>
                  updateRotation({ angle: rotation, magnitude: v })
                }
                min={0}
                max={2}
                step={0.05}
                color="#7752ff"
              />
              <Callout>
                {mode === "Scale" ? (
                  "The radius grows by a factor of |w|. When |w| = 1, the length does not change."
                ) : mode === "Sequence" ? (
                  "Repeated multiplication gives z, zw, zw², zw³. The points spiral when |w| differs from 1 and stay on a circle when |w| = 1."
                ) : (
                  <>
                    Multiplication by{" "}
                    <MathText value={String.raw`e^{i\theta}`} /> rotates z by θ
                    without changing its length when |w| = 1.
                  </>
                )}
              </Callout>
            </>
          )}
        </section>
        <section className="cr-panel cr-figure" ref={figure}>
          <header>
            <span className="cr-icon">
              <Target />
            </span>
            <div>
              <h2>{family === "polar" ? "Argand Plane" : "Complex Plane"}</h2>
              <p>
                {family === "polar"
                  ? `Visualize the complex number in ${mode.toLowerCase()} form`
                  : family === "roots"
                    ? `Visualize z and its ${mode.toLowerCase()} on the Argand plane.`
                    : mode === "Scale"
                      ? "Multiplication as scaling: z ↦ zw = |w|z"
                      : mode === "Sequence"
                        ? "Sequence of products: z, zw, zw², zw³, …"
                        : "Multiplication as rotation: z ↦ zw"}
              </p>
            </div>
            {family === "polar" ? (
              <div className="cr-plot-checks">
                <CheckButton label="Grid" checked={grid} change={setGrid} />
                <CheckButton
                  label="Unit circle"
                  checked={circle}
                  change={setCircle}
                />
                {mode === "Exponential" && (
                  <CheckButton
                    label="Phase trail"
                    checked={trail}
                    change={setTrail}
                  />
                )}
                <CheckButton
                  label="Projections"
                  checked={projections}
                  change={setProjections}
                />
              </div>
            ) : (
              <span className="cr-mode-badge">
                {mode.toUpperCase()} {family === "rotation" ? "MODE" : ""}
              </span>
            )}
            {fullscreen && (
              <button
                aria-label="Exit fullscreen"
                onClick={() => document.exitFullscreen()}
              >
                <X />
              </button>
            )}
          </header>
          {family === "roots" && (
            <div className="cr-root-tools">
              <button
                aria-label="Zoom out"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
              >
                <ZoomOut />
              </button>
              <button
                aria-label="Zoom in"
                onClick={() => setZoom(Math.min(3, zoom + 0.25))}
              >
                <ZoomIn />
              </button>
              <button
                aria-label={fullscreen ? "Exit fullscreen" : "Fullscreen"}
                onClick={async () => {
                  if (document.fullscreenElement)
                    await document.exitFullscreen();
                  else await figure.current?.requestFullscreen();
                }}
              >
                <Expand />
              </button>
              <button aria-label="Reset graph" onClick={reset}>
                <Target />
              </button>
            </div>
          )}
          <div className="cr-plot-wrap">
            <svg
              ref={plot}
              viewBox="0 0 630 440"
              role="img"
              aria-label={`${title} ${mode} graph`}
              className="cr-plot"
              tabIndex={0}
              onPointerDown={pick}
              onPointerMove={pick}
              onKeyDown={(e) => {
                if (family === "rotation" || mode === "Roots of Unity") return;
                const increment = e.shiftKey ? 1 : 0.1;
                if (
                  ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(
                    e.key,
                  )
                ) {
                  e.preventDefault();
                  if (e.key === "ArrowUp") setIm(Math.min(5, im + increment));
                  if (e.key === "ArrowDown")
                    setIm(Math.max(-5, im - increment));
                  if (e.key === "ArrowLeft")
                    setRe(Math.max(-5, re - increment));
                  if (e.key === "ArrowRight")
                    setRe(Math.min(5, re + increment));
                }
              }}
            >
              <defs>
                <marker
                  id={`${uid}axis`}
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3.5"
                  orient="auto-start-reverse"
                >
                  <path d="M0 0 7 3.5 0 7" fill="#223671" />
                </marker>
                <marker
                  id={`${uid}purple`}
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3.5"
                  orient="auto"
                >
                  <path d="M0 0 7 3.5 0 7" fill="#883dff" />
                </marker>
                <marker
                  id={`${uid}blue`}
                  markerWidth="7"
                  markerHeight="7"
                  refX="5"
                  refY="3.5"
                  orient="auto"
                >
                  <path d="M0 0 7 3.5 0 7" fill="#0089ff" />
                </marker>
                <clipPath id={`${uid}clip`}>
                  <rect x="10" y="12" width="610" height="416" />
                </clipPath>
              </defs>
              <g clipPath={`url(#${uid}clip)`}>
                {grid &&
                  ticks.map((t) => (
                    <path
                      key={t}
                      d={`M${px(t)} 14V426M15 ${py(t)}H615`}
                      stroke="#dceafc"
                      strokeWidth="1"
                      strokeDasharray={family === "polar" ? "3 3" : undefined}
                    />
                  ))}
                {circle && (
                  <circle
                    cx={ox}
                    cy={oy}
                    r={(family === "roots" ? rootRadius : 1) * scale}
                    fill={family === "rotation" ? "#8abfff08" : "none"}
                    stroke="#aac8fb"
                    strokeWidth="1.3"
                    strokeDasharray={family === "roots" ? "8 5" : undefined}
                  />
                )}
                {family === "rotation" && circle && mode === "Scale" && (
                  <circle
                    cx={ox}
                    cy={oy}
                    r={magnitude * scale}
                    fill="none"
                    stroke="#a9c6f3"
                    strokeDasharray="5 5"
                  />
                )}
                <path
                  d={`M22 ${oy}H608M${ox} 424V17`}
                  stroke="#223671"
                  strokeWidth="1.5"
                  markerEnd={`url(#${uid}axis)`}
                />
                <path
                  d={`M${ox} ${oy}H22M${ox} ${oy}V424`}
                  stroke="#223671"
                  strokeWidth="1"
                  markerEnd={
                    family === "polar" ? `url(#${uid}axis)` : undefined
                  }
                />
                {ticks
                  .filter((t) => t !== 0)
                  .map((t) => (
                    <g key={t}>
                      <path
                        d={`M${px(t)} ${oy - 4}v8M${ox - 4} ${py(t)}h8`}
                        stroke="#36558d"
                      />
                      <text x={px(t)} y={oy + 26} textAnchor="middle">
                        {t}
                      </text>
                      <text x={ox - 14} y={py(t) + 4} textAnchor="end">
                        {t}
                      </text>
                    </g>
                  ))}
                <text x="610" y={oy - 14} textAnchor="end">
                  {family === "polar" ? "Re (real)" : "Re"}
                </text>
                <text x={ox + 12} y="23">
                  {family === "polar" ? "Im (imaginary)" : "Im"}
                </text>
                {family === "polar" ? (
                  <>
                    {mode === "Exponential" && trail && (
                      <path
                        d={Array.from({ length: 90 }, (_, k) => {
                          const t = (k / 89) * Math.PI * 2;
                          return `${k === 0 ? "M" : "L"}${px(radius * Math.cos(t))} ${py(radius * Math.sin(t))}`;
                        }).join(" ")}
                        stroke="#a271ff"
                        strokeWidth="1.3"
                        strokeDasharray="4 5"
                        fill="none"
                      />
                    )}
                    {radius > 1e-12 && (
                      <>
                        <path
                          d={`M${ox} ${oy}h44A44 44 0 ${Math.abs(angle % 360) > 180 ? 1 : 0} ${angle < 0 ? 1 : 0} ${ox + 44 * Math.cos((angle * Math.PI) / 180)} ${oy - 44 * Math.sin((angle * Math.PI) / 180)}Z`}
                          fill="#9b6eff20"
                          stroke="#a37bff"
                        />
                        <text x={ox + 42} y={oy - 18} fill="#7439ff">
                          θ = {num(angle, 1)}°
                        </text>
                      </>
                    )}
                    {projections && (
                      <path
                        d={`M${ox} ${py(im)}H${px(re)}V${oy}`}
                        fill="none"
                        stroke="#ffa421"
                        strokeWidth="1.5"
                        strokeDasharray="6 5"
                      />
                    )}
                    <path
                      d={`M${ox} ${oy}L${px(re)} ${py(im)}`}
                      stroke="#883dff"
                      strokeWidth="2.5"
                    />
                    <text
                      transform={`translate(${(ox + px(re)) / 2 - 8} ${(oy + py(im)) / 2 - 8}) rotate(${-angle})`}
                      className="cr-vector-label"
                    >
                      r = {num(radius)}
                    </text>
                    <circle
                      cx={px(re)}
                      cy={py(im)}
                      r="7"
                      fill="#ffad17"
                      stroke="#ff9700"
                    />
                    <g
                      transform={`translate(${Math.max(15, Math.min(460, px(re) + 12))} ${Math.max(26, Math.min(380, py(im) - 42))})`}
                    >
                      <rect
                        width="146"
                        height="34"
                        fill="#fff7e9"
                        stroke="#ffbd6b"
                        rx="8"
                      />
                      <text
                        x="12"
                        y="24"
                        style={{ fill: "#f08700", fontWeight: 700 }}
                      >
                        z ={" "}
                        {mode === "Rectangular"
                          ? complexLabel(re, im)
                          : mode === "Polar"
                            ? `${num(radius)} cis ${num(angle, 1)}°`
                            : `${num(radius)} exp(iθ)`}
                      </text>
                    </g>
                    {projections && (
                      <>
                        <g
                          transform={`translate(${ox - 166} ${Math.max(18, py(im) - 14)})`}
                        >
                          <rect width="92" height="29" rx="7" fill="#eee4ff" />
                          <text
                            x="10"
                            y="20"
                            style={{ fill: "#7c43ef", fontWeight: 600 }}
                          >
                            Im = {num(im)}
                          </text>
                        </g>
                        <g transform={`translate(${px(re) - 25} ${oy + 10})`}>
                          <rect width="65" height="27" rx="7" fill="#e2f3ff" />
                          <text
                            x="9"
                            y="19"
                            style={{ fill: "#0081ff", fontWeight: 600 }}
                          >
                            Re = {num(re)}
                          </text>
                        </g>
                      </>
                    )}
                  </>
                ) : family === "roots" ? (
                  <>
                    {roots.length > 2 && (
                      <polygon
                        points={roots
                          .map((z) => `${px(z.re)},${py(z.im)}`)
                          .join(" ")}
                        fill="none"
                        stroke="#3d7dff"
                        strokeWidth="1.4"
                      />
                    )}
                    {roots.map((z, k) => (
                      <g key={k}>
                        <circle
                          cx={px(z.re)}
                          cy={py(z.im)}
                          r="8"
                          fill="#2b7cff"
                          stroke="#135fff"
                        />
                        {labels && mode === "Square Roots" && (
                          <text x={px(z.re) - 25} y={py(z.im) + 27}>
                            {complexLabel(z.re, z.im)}
                          </text>
                        )}
                      </g>
                    ))}
                    <circle
                      cx={px(rootInput.re)}
                      cy={py(rootInput.im)}
                      r="7"
                      fill="#ff5b88"
                      stroke="#f64f82"
                    />
                    {labels && (
                      <text
                        x={Math.min(470, px(rootInput.re) + 10)}
                        y={Math.min(420, py(rootInput.im) + 25)}
                        style={{ fontWeight: 650 }}
                      >
                        z = {complexLabel(rootInput.re, rootInput.im)}
                      </text>
                    )}
                  </>
                ) : (
                  <>
                    {(mode === "Sequence" ? sequence : [initial, product]).map(
                      (z, k) => (
                        <g key={k}>
                          {vectors && (
                            <path
                              d={`M${ox} ${oy}L${px(z.re)} ${py(z.im)}`}
                              stroke={k ? "#883dff" : "#0089ff"}
                              strokeWidth={k ? "2.5" : "3"}
                              markerEnd={`url(#${uid}${k ? "purple" : "blue"})`}
                            />
                          )}
                          <circle
                            cx={px(z.re)}
                            cy={py(z.im)}
                            r="8"
                            fill={k ? "#974cff" : "#0089ff"}
                            stroke="white"
                            strokeWidth="1.6"
                          />
                          {labels && (
                            <>
                              <text
                                className="cr-vector-label"
                                x={Math.min(
                                  490,
                                  Math.max(
                                    20,
                                    px(z.re) + (z.re < 0 ? -35 : 20),
                                  ),
                                )}
                                y={Math.max(30, Math.min(390, py(z.im) - 20))}
                              >
                                {k === 0
                                  ? "z"
                                  : mode === "Sequence"
                                    ? `zw${k === 1 ? "" : k === 2 ? "²" : "³"}`
                                    : "zw"}
                              </text>
                              <text
                                x={Math.max(20, Math.min(470, px(z.re) + 16))}
                                y={Math.max(46, Math.min(415, py(z.im) + 4))}
                                style={{ fill: k ? "#883dff" : "#0089ff" }}
                              >
                                ({num(z.re)}, {num(z.im)})
                              </text>
                            </>
                          )}
                        </g>
                      ),
                    )}
                    {mode === "Rotate" && magnitude > 0 && (
                      <>
                        <path
                          d={`M${ox + 72} ${oy}A72 72 0 ${rotationAngle > 180 ? 1 : 0} 0 ${ox + 72 * Math.cos((rotationAngle * Math.PI) / 180)} ${oy - 72 * Math.sin((rotationAngle * Math.PI) / 180)}`}
                          fill="none"
                          stroke="#934cff"
                          strokeWidth="2"
                        />
                        <text
                          x={ox + 55}
                          y={oy - 58}
                          style={{ fill: "#883dff", fontWeight: 650 }}
                        >
                          θ = {num(rotationAngle)}°
                        </text>
                      </>
                    )}
                    {mode === "Sequence" && magnitude === 1 && (
                      <path
                        d={sequence
                          .map((z, k) =>
                            k === 0
                              ? `M${px(z.re)} ${py(z.im)}`
                              : `A${scale} ${scale} 0 ${rotationAngle > 180 ? 1 : 0} 0 ${px(z.re)} ${py(z.im)}`,
                          )
                          .join(" ")}
                        stroke="#a36cff"
                        strokeWidth="2"
                        fill="none"
                      />
                    )}
                  </>
                )}
                <circle cx={ox} cy={oy} r="2.5" fill="#5165a1" />
              </g>
            </svg>
            {family === "polar" ? (
              <>
                <div className="cr-plot-note left">
                  <b>{mode} form:</b>
                  <MathText value={selectedFormula} />
                  <span>
                    {mode === "Rectangular"
                      ? `(a, b) = (${num(re)}, ${num(im)})`
                      : `(r, θ) = (${num(radius)}, ${num(angle, 1)}°)`}
                  </span>
                </div>
                <div className="cr-plot-note right">
                  <MathText
                    value={`r=${num(radius)},\\quad\\theta=${polar.angle === null ? "\\text{undefined}" : num(angle, 1) + "^\\circ"}`}
                  />
                  <span>
                    Point: ({num(re)}, {num(im)})
                  </span>
                </div>
              </>
            ) : (
              <div
                className={`cr-legend ${family === "roots" ? "top" : "bottom"}`}
              >
                <span>
                  <i
                    style={{
                      background: family === "roots" ? "#ff5b88" : "#0089ff",
                    }}
                  />
                  {family === "roots"
                    ? `z = ${complexLabel(rootInput.re, rootInput.im)}`
                    : "z (original)"}
                </span>
                <span>
                  <i
                    style={{
                      background: family === "roots" ? "#287cff" : "#974cff",
                    }}
                  />
                  {family === "roots"
                    ? mode.toLowerCase()
                    : mode === "Sequence"
                      ? "zw, zw², zw³"
                      : mode === "Scale"
                        ? "zw (scaled)"
                        : "zw (rotated)"}
                </span>
                <span>
                  <em />
                  {family === "roots"
                    ? "root circle"
                    : mode === "Scale"
                      ? `Circle of radius ${num(magnitude)}`
                      : "Unit circle (|z| = 1)"}
                </span>
              </div>
            )}
            {family === "rotation" && (
              <label className="cr-vectors">
                <input
                  type="checkbox"
                  checked={mode === "Scale" ? circle : vectors}
                  onChange={(e) =>
                    mode === "Scale"
                      ? setCircle(e.target.checked)
                      : setVectors(e.target.checked)
                  }
                />
                {mode === "Scale" ? "Show circles" : "Show vectors"}
              </label>
            )}
          </div>
          {family === "roots" && (
            <p className="cr-root-caption">
              {distinct === 1
                ? "At z = 0, all root values coincide at the origin."
                : `The ${rootCount} ${mode.toLowerCase()} lie on a circle of radius ${num(rootRadius, 3)}, equally spaced at ${num(360 / rootCount, 1)}° intervals.`}
            </p>
          )}
        </section>
        <aside className="cr-right">
          <section className="cr-panel cr-results">
            <header>
              <span className="cr-icon">
                {family === "polar" ? (
                  <ArrowRightLeft />
                ) : (
                  <ChartNoAxesColumn />
                )}
              </span>
              <div>
                <h2>
                  {family === "polar"
                    ? "Equivalent Forms"
                    : family === "roots"
                      ? "Results & Insights"
                      : "Value Information"}
                </h2>
                <p>{explain}</p>
              </div>
            </header>
            {family === "polar" ? (
              <div className="cr-equivalents">
                {[
                  ["Rectangular", "z=a+bi", mathZ({ re, im })],
                  [
                    "Polar",
                    String.raw`z=r\operatorname{cis}\theta`,
                    `${num(radius)}\\operatorname{cis}${num(angle, 1)}^\\circ`,
                  ],
                  [
                    "Exponential",
                    String.raw`z=re^{i\theta}`,
                    `${num(radius)}e^{i(${phaseTex(angle)})}`,
                  ],
                ].map(([name, formula, value], k) => (
                  <div className={name === mode ? "selected" : ""} key={name}>
                    <i
                      style={{
                        background: ["#238fff", "#813eff", "#0fbfd4"][k],
                      }}
                    />
                    <span>
                      <b>{name} form</b>
                      <MathText value={formula} />
                    </span>
                    <strong>
                      <MathText
                        value={
                          polar.angle === null && name !== "Rectangular"
                            ? "0\\;\\text{(angle undefined)}"
                            : value
                        }
                      />
                    </strong>
                  </div>
                ))}
              </div>
            ) : family === "roots" ? (
              <>
                <div className="cr-result-list">
                  <div>
                    <i />
                    <span>Number of roots (n)</span>
                    <b>{distinct}</b>
                  </div>
                  <div>
                    <i className="pink" />
                    <span>z</span>
                    <b>{complexLabel(rootInput.re, rootInput.im)}</b>
                  </div>
                  <div>
                    <i />
                    <span>
                      {mode === "Polynomial Roots"
                        ? `Roots of u${rootCount === 2 ? "²" : `^${rootCount}`} − z = 0`
                        : mode === "Roots of Unity"
                          ? "Roots of unity (solutions to uⁿ = 1)"
                          : `${mode} of z`}
                    </span>
                    <b>
                      {distinct} {distinct === 1 ? "point" : "complex roots"}
                    </b>
                  </div>
                </div>
                <div className="cr-formula-box">
                  <h3>
                    <BookOpen />
                    {mode === "Polynomial Roots"
                      ? "Polynomial Roots (De Moivre)"
                      : "Formula"}
                  </h3>
                  <p>
                    The {rootCount}th roots{" "}
                    {mode === "Roots of Unity"
                      ? "of unity"
                      : "of a nonzero complex number"}{" "}
                    are
                  </p>
                  <MathText value={rootFormula} />
                  <p>
                    for k = 0, 1, …, {rootCount - 1}, where{" "}
                    <MathText value={String.raw`z=r(\cos\theta+i\sin\theta)`} />
                    .
                  </p>
                  {distinct === 1 && (
                    <p>
                      At zero, u = 0 is the sole distinct root, with
                      multiplicity {rootCount}.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="cr-result-list">
                  <div>
                    <i className="purple" />
                    <span>arg(w)</span>
                    <b>{magnitude === 0 ? "undefined" : `${rotationAngle}°`}</b>
                  </div>
                  <div>
                    <i />
                    <span>|w|</span>
                    <b>{num(magnitude)}</b>
                  </div>
                </div>
                <div className="cr-rotation-formula">
                  <MathText
                    value={
                      mode === "Scale"
                        ? String.raw`zw=|w|z,\quad |zw|=|w|\,|z|`
                        : String.raw`\arg(zw)=\arg z+\arg w\pmod{2\pi}`
                    }
                  />
                </div>
              </>
            )}
          </section>
          <section className="cr-panel cr-quiz">
            <header>
              <span className="cr-question">?</span>
              <div>
                <h2>Concept Check</h2>
                <p>{quizQuestion}</p>
              </div>
            </header>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                quiz();
              }}
            >
              <input
                aria-label="Concept check answer"
                value={answer}
                onChange={(e) => {
                  setAnswer(e.target.value);
                  setFeedback("");
                }}
                placeholder={
                  family === "polar" && mode === "Polar"
                    ? "Type your answer (e.g. 1 + 1.73i)"
                    : "Type your answer..."
                }
              />
              <button className="cr-primary" type="submit">
                {family === "polar" ? "Check Answer" : "Check"}
              </button>
            </form>
            {feedback && (
              <p className="cr-feedback" role="status">
                {feedback}
              </p>
            )}
            {family === "rotation" && (
              <Callout>
                {mode === "Scale" ? (
                  "Multiplication by w scales the modulus by |w|."
                ) : mode === "Sequence" ? (
                  <>
                    Each multiplication adds θ to the angle and multiplies the
                    radius by |w|.
                  </>
                ) : (
                  <>
                    Since{" "}
                    <MathText
                      value={`w=${num(magnitude)}e^{i(${phaseTex(rotationAngle)})}`}
                    />
                    , multiplication rotates by {rotationAngle}° and scales by{" "}
                    {num(magnitude)}.
                  </>
                )}
              </Callout>
            )}
          </section>
        </aside>
      </div>
      <section className="cr-learning" aria-label="Keep exploring">
        {learning.map(([name, copy], k) => {
          const Icon = learningIcons[k];
          return (
            <button key={name} onClick={() => setDialog(name)}>
              <span>
                <Icon />
              </span>
              <div>
                <b>{name}</b>
                <small>{copy}</small>
              </div>
              <ChevronRight />
            </button>
          );
        })}
        <Robot family={family} onClick={() => setDialog("Ruhi")} />
      </section>
      <footer className="cr-footer">
        <Link to="/complex-numbers">
          <Planet small />
          <b>Math Universe</b>
        </Link>
        <span>
          {family === "polar"
            ? "Making mathematics more visual, interactive, and meaningful."
            : "Explore · Discover · Belong"}
        </span>
        <small>Explore · Practice · Build Intuition · Go Further</small>
      </footer>
      {dialog && (
        <section className="cr-dialog" role="dialog" aria-label={dialog}>
          <button
            className="cr-dialog-close"
            aria-label="Close dialog"
            onClick={() => setDialog(null)}
          >
            <X />
          </button>
          <h2>
            {dialog} · {title}
          </h2>
          {dialog === "Settings" ? (
            <>
              <CheckButton label="Grid" checked={grid} change={setGrid} />
              <CheckButton label="Labels" checked={labels} change={setLabels} />
              <CheckButton
                label="Vectors"
                checked={vectors}
                change={setVectors}
              />
              <button onClick={reset}>Restore defaults</button>
            </>
          ) : dialog === "Ruhi" || dialog === "Help" ? (
            <p>
              {family === "polar"
                ? "Change any input to see the same number in all three forms. Drag the point or use the keyboard arrows. Arguments of zero are undefined; changing the branch cut chooses an interval of length 360°."
                : family === "roots"
                  ? "Choose z and n. The nth roots have radius |z|^(1/n), and adjacent arguments differ by 360°/n. Square Roots always uses n = 2; Roots of Unity always solves uⁿ = 1."
                  : "Choose Rotate, Scale, or Sequence. Each multiplication adds arg(w) and multiplies the modulus by |w|. A zero multiplier sends every subsequent point to zero."}
            </p>
          ) : dialog === "Challenge" ? (
            <p>
              {family === "polar"
                ? "Create a number of modulus 3 and argument −120°. Predict its rectangular form, then verify it."
                : family === "roots"
                  ? "Set z = −1 and n = 4. Predict all four arguments before checking the graph."
                  : "Choose |w| = 0.5 and θ = 60°. Predict the angle and modulus after three multiplications."}
            </p>
          ) : (
            <p>
              {learning.find(([name]) => name === dialog)?.[1] ??
                "Complete concept checks and explore every mode to build your understanding."}{" "}
              {family === "polar"
                ? "Use a = r cos θ and b = r sin θ to connect the three forms."
                : family === "roots"
                  ? "Raising each displayed root to the nth power gives the original number."
                  : "Try 90°, 180°, and 270° to see the effect of multiplying by i, −1, and −i."}
            </p>
          )}
        </section>
      )}
      <details className="cr-depth">
        <summary>Explore the theory, worked examples, and practice</summary>
        <ComplexLearningDepth pageId={page.id} />
      </details>
    </div>
  );
}

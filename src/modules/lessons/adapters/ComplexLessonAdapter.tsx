import { useEffect, useState } from "react";
import SliderControl, {
  SliderGroup,
} from "../../../components/ui/SliderControl";
import {
  complexMultiply,
  complexToPolar,
  eulerPoint,
  type Complex,
} from "../../../utils/complex";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import ComplexPlaneTargetLesson365 from "./complex/ComplexPlaneTargetLesson365";
import RealImaginaryTargetLesson366 from "./complex/RealImaginaryTargetLesson366";
import ComplexAdditionTargetLesson367 from "./complex/ComplexAdditionTargetLesson367";
import ComplexMultiplicationTargetLesson368 from "./complex/ComplexMultiplicationTargetLesson368";
import ComplexConjugateTargetLesson369 from "./complex/ComplexConjugateTargetLesson369";
import ModulusArgumentTargetLesson370 from "./complex/ModulusArgumentTargetLesson370";
import PolarFormTargetLesson371 from "./complex/PolarFormTargetLesson371";
import EulerFormTargetLesson372 from "./complex/EulerFormTargetLesson372";
import PowersTargetLesson373 from "./complex/PowersTargetLesson373";

const sx = (x: number) => 300 + x * 46;
const sy = (y: number) => 180 - y * 46;

function complexGuidanceFor(title: string) {
  const name = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  if (name.includes("complex plane"))
    return [
      "Complex plane",
      "Plot a+bi at the point (a,b).",
      "Real is horizontal; imaginary is vertical.",
    ];
  if (name.includes("real and imaginary"))
    return [
      "Real and imaginary parts",
      "For a+bi, Re(z)=a and Im(z)=b.",
      "The imaginary part is b, not bi.",
    ];
  if (name.includes("complex addition"))
    return [
      "Complex addition",
      "Add real parts and imaginary parts separately.",
      "Do not mix the two coordinates.",
    ];
  if (name.includes("complex multiplication"))
    return [
      "Complex multiplication",
      "Expand and replace i squared by -1.",
      "Multiplication can rotate and scale.",
    ];
  if (name.includes("conjugate"))
    return [
      "Complex conjugate",
      "Change only the sign of the imaginary part.",
      "The real part stays the same.",
    ];
  if (name.includes("modulus") || name.includes("argument"))
    return [
      "Modulus and argument",
      "Modulus is distance; argument is direction.",
      "Do not use the angle as the size.",
    ];
  if (name.includes("polar form"))
    return [
      "Polar form",
      "Use radius and angle to describe the point.",
      "r is distance, not the real part.",
    ];
  if (name.includes("euler form"))
    return [
      "Euler form",
      "re^(i theta) equals r(cos theta+i sin theta).",
      "Keep r unless the point is on the unit circle.",
    ];
  if (name.includes("powers"))
    return [
      "Complex powers",
      "Use polar form and multiply the angle by n.",
      "Do not power real and imaginary parts separately.",
    ];
  if (name.includes("polynomial roots"))
    return [
      "Polynomial roots",
      "Real polynomials have non-real roots in conjugate pairs.",
      "Do not omit the paired root.",
    ];
  if (name.includes("roots"))
    return [
      "Complex roots",
      "Roots are spaced evenly around a circle.",
      "A non-zero number has n nth roots.",
    ];
  if (name.includes("mobius"))
    return [
      "Mobius transformations",
      "Use w=(az+b)/(cz+d).",
      "Exclude inputs that make the denominator zero.",
    ];
  if (name.includes("complex functions"))
    return [
      "Complex functions",
      "Track both real and imaginary output parts.",
      "A real-only check is incomplete.",
    ];
  return [
    "Complex numbers",
    "Use real and imaginary parts as two coordinates.",
    "Check which part belongs on each axis.",
  ];
}

export default function ComplexLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.id === 365)
    return <ComplexPlaneTargetLesson365 {...props} />;
  if (props.lesson.id === 366)
    return <RealImaginaryTargetLesson366 {...props} />;
  if (props.lesson.id === 367)
    return <ComplexAdditionTargetLesson367 {...props} />;
  if (props.lesson.id === 368)
    return <ComplexMultiplicationTargetLesson368 {...props} />;
  if (props.lesson.id === 369)
    return <ComplexConjugateTargetLesson369 {...props} />;
  if (props.lesson.id === 370)
    return <ModulusArgumentTargetLesson370 {...props} />;
  if (props.lesson.id === 371) return <PolarFormTargetLesson371 {...props} />;
  if (props.lesson.id === 372) return <EulerFormTargetLesson372 {...props} />;
  if (props.lesson.id === 373) return <PowersTargetLesson373 {...props} />;
  return <GenericComplexLessonAdapter {...props} />;
}

function GenericComplexLessonAdapter({
  lesson,
  resetToken,
  onInteraction,
}: LessonAdapterProps) {
  const [real, setReal] = useState(2);
  const [imaginary, setImaginary] = useState(1);
  const [angle, setAngle] = useState(45);
  const guidance = complexGuidanceFor(lesson.title);

  useEffect(() => {
    setReal(2);
    setImaginary(1);
    setAngle(45);
  }, [resetToken]);

  const z: Complex = { a: real, b: imaginary };
  const multiplier = eulerPoint((angle * Math.PI) / 180);
  const product = complexMultiply(z, multiplier);
  const polar = complexToPolar(real, imaginary);
  const shown = /multiply|rotation|euler|polar|argument|root/i.test(
    lesson.title,
  )
    ? product
    : z;
  const update = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };

  return (
    <AdapterFrame
      title={`${lesson.title} - complex plane`}
      value={`${shown.a.toFixed(2)} ${shown.b >= 0 ? "+" : "-"} ${Math.abs(shown.b).toFixed(2)}i`}
      footer="Modulus, argument, Euler point, and multiplication are computed by the existing complex-number engine."
    >
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-900">
          <svg
            viewBox="0 0 600 360"
            className="h-[310px] w-full"
            role="img"
            aria-label="Interactive complex plane"
          >
            <Grid />
            <line
              x1="300"
              y1="180"
              x2={sx(z.a)}
              y2={sy(z.b)}
              stroke="#94a3b8"
              strokeWidth="3"
              strokeDasharray="7 5"
            />
            <line
              x1="300"
              y1="180"
              x2={sx(product.a)}
              y2={sy(product.b)}
              stroke="#06b6d4"
              strokeWidth="4"
            />
            <circle cx={sx(z.a)} cy={sy(z.b)} r="7" fill="#94a3b8" />
            <circle
              cx={sx(product.a)}
              cy={sy(product.b)}
              r="8"
              fill="#06b6d4"
            />
            <text
              x={sx(product.a) + 10}
              y={sy(product.b) - 8}
              fill="#0891b2"
              fontWeight="900"
            >
              z times rotation
            </text>
          </svg>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {guidance[1]}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">
              {guidance[2]}
            </p>
          </div>
          <SliderGroup title="Complex input">
            <SliderControl
              density="compact"
              label="Real"
              value={real}
              min={-5}
              max={5}
              step={0.25}
              onChange={update(setReal)}
            />
            <SliderControl
              density="compact"
              label="Imaginary"
              value={imaginary}
              min={-3}
              max={3}
              step={0.25}
              onChange={update(setImaginary)}
            />
            <SliderControl
              density="compact"
              label="Rotation theta"
              value={angle}
              min={-180}
              max={180}
              step={1}
              unit="degrees"
              onChange={update(setAngle)}
            />
          </SliderGroup>
          <div className="grid grid-cols-2 gap-2">
            <Metric label="|z|" value={polar.r.toFixed(3)} />
            <Metric
              label="arg z"
              value={`${((polar.theta * 180) / Math.PI).toFixed(1)} degrees`}
            />
            <Metric label="Product Re" value={product.a.toFixed(3)} />
            <Metric label="Product Im" value={product.b.toFixed(3)} />
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

function Grid() {
  return (
    <g>
      {Array.from({ length: 13 }, (_, i) => (
        <line
          key={`v${i}`}
          x1={i * 46 + 24}
          x2={i * 46 + 24}
          y1="0"
          y2="360"
          stroke="#cbd5e1"
          opacity=".3"
        />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          x2="600"
          y1={i * 46 - 4}
          y2={i * 46 - 4}
          stroke="#cbd5e1"
          opacity=".3"
        />
      ))}
      <line x1="0" x2="600" y1="180" y2="180" stroke="#64748b" />
      <line x1="300" x2="300" y1="0" y2="360" stroke="#64748b" />
    </g>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10">
      <span className="block text-[10px] font-bold text-slate-500">
        {label}
      </span>
      <strong className="font-mono text-xs">{value}</strong>
    </div>
  );
}

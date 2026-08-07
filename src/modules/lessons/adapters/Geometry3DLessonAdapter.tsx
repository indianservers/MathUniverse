import { useEffect, useMemo, useState } from "react";
import SliderControl, { SliderGroup } from "../../../components/ui/SliderControl";
import { solidMetrics, summarizeSurfaceSamples } from "../../../space3d/spaceStudio";
import { cone3, cylinder3, object3Measurement, point3, sphere3 } from "../../../workspace/geometry3dKernel";
import AdapterFrame from "../components/AdapterFrame";
import type { LessonAdapterProps } from "../types";
import { SolidNetActivity } from "./p0/PriorityConceptActivities";

function solidFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("sphere")) return "sphere";
  if (name.includes("cone")) return "cone";
  if (name.includes("cylinder")) return "cylinder";
  if (name.includes("pyramid")) return "pyramid";
  if (name.includes("prism")) return "triangular-prism";
  if (name.includes("torus")) return "torus-solid";
  return "box";
}

function geometry3DGuidanceFor(title: string) {
  const name = title.toLowerCase();
  if (name.includes("coordinate system")) return ["3D coordinate system", "Use x, y, and z axes.", "Do not drop the z coordinate."];
  if (name.includes("3d points")) return ["3D points", "Read ordered triples as x, then y, then z.", "Coordinate order matters."];
  if (name.includes("point-to-plane")) return ["Point-to-plane distance", "Measure along the perpendicular direction.", "Do not measure along the plane."];
  if (name.includes("distance")) return ["Distance in 3D", "Use all three squared differences.", "Forgetting z gives a flat answer."];
  if (name.includes("lines in 3d")) return ["Lines in 3D", "A point and direction vector define a line.", "One point alone is not enough."];
  if (name === "planes") return ["Planes", "A normal vector is perpendicular to the plane.", "The normal is not along the plane."];
  if (name.includes("parallel") || name.includes("perpendicular planes")) return ["Parallel and perpendicular planes", "Compare normal vectors.", "Parallel planes have parallel normals."];
  if (name.includes("line") && name.includes("plane") && name.includes("intersection")) return ["Line-plane intersection", "Substitute the line into the plane equation.", "Solve the line parameter."];
  if (name.includes("plane") && name.includes("plane") && name.includes("intersection")) return ["Plane-plane intersection", "Two non-parallel planes meet in a line.", "Do not expect only one point."];
  if (name.includes("angle between lines")) return ["Angle between lines", "Use direction vectors in the dot product formula.", "Points alone do not give the angle."];
  if (name.includes("angle between planes")) return ["Angle between planes", "Use normal vectors.", "The angle comes from the normals."];
  if (name.includes("angle between line and plane")) return ["Angle between line and plane", "Use the line direction and plane normal.", "It is complementary to the normal angle."];
  if (name.includes("3d vectors")) return ["3D vectors", "Magnitude uses x, y, and z components.", "Use all three components."];
  if (name.includes("cube")) return ["Cube", "All six faces are equal squares.", "Volume is side cubed."];
  if (name.includes("cuboid")) return ["Cuboid", "Volume is length times width times height.", "Include height for volume."];
  if (name.includes("prism")) return ["Prism", "Volume is base area times height.", "Use base area, not perimeter."];
  if (name.includes("pyramid")) return ["Pyramid", "Volume is one third base area times height.", "It is not the full prism volume."];
  if (name.includes("tetrahedron")) return ["Tetrahedron", "A tetrahedron has four triangular faces.", "Do not treat it as a cube."];
  if (name.includes("regular polyhedra")) return ["Regular polyhedra", "There are exactly five Platonic solids.", "Not every neat solid is regular."];
  if (name.includes("hemisphere")) return ["Hemisphere", "A hemisphere is half a sphere.", "Use half the sphere volume."];
  if (name.includes("cylinder")) return ["Cylinder", "Volume is pi r squared h.", "Include pi because the base is circular."];
  if (name.includes("cone")) return ["Cone", "A cone volume is one third of the matching cylinder.", "Do not use full cylinder volume."];
  if (name.includes("sphere")) return ["Sphere", "Volume uses radius cubed.", "Do not use circle area for volume."];
  if (name.includes("frustum")) return ["Frustum", "Use both top and bottom radii.", "One radius is not enough."];
  if (name.includes("surface of revolution")) return ["Surface of revolution", "Rotate a curve around an axis.", "Surface area is not volume."];
  if (name.includes("extrusion")) return ["Extrusion", "Push a 2D area through a length.", "Use area times length for volume."];
  if (name.includes("cross-sections")) return ["Cross-sections", "A slicing plane makes the cross-section.", "Slice angle can change the shape."];
  if (name === "volume") return ["Volume", "Volume measures 3D space inside a solid.", "Use cubic units."];
  if (name.includes("surface area")) return ["Surface area", "Add all exposed outside areas.", "Use square units, not cubic units."];
  if (name.includes("euler")) return ["Euler's polyhedron formula", "For convex polyhedra, V-E+F equals 2.", "Use vertices, edges, and faces."];
  if (name.includes("transparent") || name.includes("x-ray")) return ["Transparent / X-Ray Mode", "Transparency changes visibility only.", "It does not change measurements."];
  if (name.includes("camera controls")) return ["Camera controls", "Orbit and zoom change the view.", "They do not move the real object."];
  if (name.includes("orthographic")) return ["Orthographic views", "Parallel edges stay parallel.", "There is no perspective shrinking."];
  if (name.includes("ar placement")) return ["AR placement", "Match position, rotation, and scale.", "Scale must fit the real scene."];
  if (name.includes("surface z=f(x,y)")) return ["Surface z=f(x,y)", "Two inputs x and y give height z.", "Do not treat it as one-input graph."];
  if (name.includes("implicit surfaces")) return ["Implicit surfaces", "Points satisfy F(x,y,z)=0.", "You may not solve for z."];
  if (name.includes("parametric surfaces")) return ["Parametric surfaces", "Two parameters make a surface.", "One parameter usually makes a curve."];
  if (name.includes("space curves")) return ["Space curves", "One parameter traces a 3D path.", "A curve is not a full surface."];
  if (name.includes("quadric surfaces")) return ["Quadric surfaces", "Second-degree equations make quadrics.", "They are not planes."];
  if (name.includes("cylindrical coordinates")) return ["Cylindrical coordinates", "Use radius, angle, and height.", "r is distance from the z-axis."];
  if (name.includes("spherical coordinates")) return ["Spherical coordinates", "Use distance from origin and two angles.", "One angle is not enough in 3D."];
  if (name.includes("contour curves")) return ["Contour curves", "A contour keeps height constant.", "Height does not change along one contour."];
  if (name.includes("level surfaces")) return ["Level surfaces", "Set F(x,y,z) equal to a constant.", "In 3D the level set is often a surface."];
  if (name.includes("partial derivatives")) return ["Partial derivatives", "Change one variable and hold others fixed.", "Do not change all variables at once."];
  if (name.includes("gradient vector")) return ["Gradient vector", "The gradient points toward steepest increase.", "It is built from partial derivatives."];
  if (name.includes("tangent plane")) return ["Tangent plane", "It is a local flat approximation.", "It does not match the whole surface."];
  if (name.includes("normal vector")) return ["Normal vector", "A normal is perpendicular to the surface.", "It is not tangent."];
  if (name.includes("double integrals")) return ["Double integrals", "Add values over tiny area pieces.", "Use dA, not just dx."];
  if (name.includes("multivariable optimisation")) return ["Multivariable optimisation", "Check all partial derivatives or constraints.", "One-variable tests are not enough."];
  return ["3D geometry", "Use all spatial dimensions and the correct formula.", "Check axes, units, and height."];
}

export default function Geometry3DLessonAdapter(props: LessonAdapterProps) {
  if (props.lesson.preset.id === "geometry3d.solid-net") {
    return (
      <AdapterFrame title={`${props.lesson.title} - linked 2D/3D net`} footer="Selecting or folding a face updates the linked net and solid representation.">
        <SolidNetActivity {...props} />
      </AdapterFrame>
    );
  }
  return <LegacyGeometry3DLessonAdapter {...props} />;
}

function LegacyGeometry3DLessonAdapter({ lesson, resetToken, onInteraction }: LessonAdapterProps) {
  const [size, setSize] = useState(4);
  const [height, setHeight] = useState(5);
  const [section, setSection] = useState(0);
  const [orbit, setOrbit] = useState(25);

  useEffect(() => {
    setSize(4);
    setHeight(5);
    setSection(0);
    setOrbit(25);
  }, [resetToken]);

  const name = lesson.title.toLowerCase();
  const surfaceMode = /surface|contour|gradient|tangent plane|partial derivative|multivariable|level curve/i.test(name);
  const solid = solidFor(lesson.title);
  const guidance = geometry3DGuidanceFor(lesson.title);
  const kernelObject = solid === "sphere" ? sphere3(point3(0, 0, 0), size / 2) : solid === "cylinder" ? cylinder3(point3(0, 0, 0), size / 2, height) : cone3(point3(0, 0, 0), size / 2, height);
  const kernelMetrics = object3Measurement(kernelObject);
  const genericMetrics = solidMetrics(solid, size);
  const surface = useMemo(() => summarizeSurfaceSamples((x, y) => (name.includes("saddle") ? x * x - y * y : Math.sin(x) * Math.cos(y)), Math.max(1, size / 2), section), [name, section, size]);
  const surfaceRange = `z ${surface.min.toFixed(2)} to ${surface.max.toFixed(2)}`;
  const update = (setter: (value: number) => void) => (value: number) => {
    setter(value);
    onInteraction();
  };
  const angle = (orbit * Math.PI) / 180;
  const dx = Math.cos(angle) * 70;
  const dy = Math.sin(angle) * 30;
  const volume = solid === "box" || solid === "pyramid" || solid === "triangular-prism" || solid === "torus-solid" ? genericMetrics.volume : kernelMetrics.volume;
  const surfaceArea = solid === "box" ? genericMetrics.surfaceArea : kernelMetrics.surfaceArea;

  return (
    <AdapterFrame title={`${lesson.title} - controlled 3D scene`} value={surfaceMode ? surfaceRange : `V = ${volume.toFixed(2)}`} footer="Measurements use the existing 3D kernels; orbit and section controls expose the lesson scene without loading the full workspace.">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_290px]">
        <div className="overflow-hidden rounded-xl bg-[radial-gradient(circle_at_50%_35%,#164e63,#020617)]">
          <svg viewBox="0 0 640 360" className="h-[310px] w-full" role="img" aria-label="Interactive three-dimensional scene">
            <line x1="320" y1="190" x2={320 + dx * 2.5} y2={190 + dy * 2.5} stroke="#ef4444" strokeWidth="3" />
            <line x1="320" y1="190" x2={320 - dx * 2.2} y2={190 + dy * 2.2} stroke="#22c55e" strokeWidth="3" />
            <line x1="320" y1="300" x2="320" y2="40" stroke="#38bdf8" strokeWidth="3" />
            {surfaceMode ? <Surface size={size} section={section} /> : <Solid kind={solid} size={size} />}
            <text x="575" y="330" fill="#f87171" fontWeight="800">x</text>
            <text x="65" y="330" fill="#4ade80" fontWeight="800">y</text>
            <text x="330" y="45" fill="#7dd3fc" fontWeight="800">z</text>
          </svg>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl bg-slate-100 p-3 text-sm font-semibold text-slate-700 dark:bg-white/10 dark:text-slate-100">
            <p>{guidance[0]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[1]}</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{guidance[2]}</p>
          </div>
          <SliderGroup title="3D controls">
            <SliderControl density="compact" label="Size / domain" value={size} min={1} max={8} step={0.25} onChange={update(setSize)} />
            <SliderControl density="compact" label="Height / section" value={surfaceMode ? section : height} min={surfaceMode ? -3 : 1} max={surfaceMode ? 3 : 10} step={0.25} onChange={surfaceMode ? update(setSection) : update(setHeight)} />
            <SliderControl density="compact" label="Orbit" value={orbit} min={0} max={360} step={5} unit="degrees" onChange={update(setOrbit)} />
          </SliderGroup>
          <div className="grid grid-cols-2 gap-2">
            <Metric label={surfaceMode ? "Contour samples" : "Surface area"} value={surfaceMode ? String(surface.crossSectionSamples) : surfaceArea.toFixed(2)} />
            <Metric label="Orientation" value={`${orbit} degrees`} />
          </div>
        </div>
      </div>
    </AdapterFrame>
  );
}

function Solid({ kind, size }: { kind: string; size: number }) {
  const scale = 20 + size * 7;
  if (kind === "sphere") return <ellipse cx="320" cy="185" rx={scale} ry={scale * 0.72} fill="#06b6d4" opacity=".55" stroke="#67e8f9" strokeWidth="3" />;
  if (kind === "cylinder" || kind === "cone") {
    return (
      <g>
        <ellipse cx="320" cy={250} rx={scale} ry={scale * 0.3} fill="#06b6d4" opacity=".5" />
        <path d={kind === "cone" ? `M${320 - scale},250 L320,75 L${320 + scale},250` : `M${320 - scale},250 L${320 - scale},100 M${320 + scale},250 L${320 + scale},100`} fill="none" stroke="#67e8f9" strokeWidth="4" />
        <ellipse cx="320" cy="100" rx={kind === "cone" ? 3 : scale} ry={kind === "cone" ? 3 : scale * 0.3} fill="#06b6d4" opacity=".6" stroke="#67e8f9" />
      </g>
    );
  }
  return <path d={`M${320 - scale},${220 - scale / 2} l${scale},${-scale / 2} l${scale},${scale / 2} v${scale} l${-scale},${scale / 2} l${-scale},${-scale / 2}z M320,${220 - scale} v${scale} M${320 - scale},${220 - scale / 2} l${scale},${scale / 2} l${scale},${-scale / 2}`} fill="#06b6d4" opacity=".38" stroke="#67e8f9" strokeWidth="3" />;
}

function Surface({ size, section }: { size: number; section: number }) {
  const rows = Array.from({ length: 9 }, (_, row) => {
    const y = (row - 4) / 2;
    return Array.from({ length: 17 }, (_, index) => {
      const x = (index - 8) / 2;
      const z = Math.sin(x) * Math.cos(y);
      return `${320 + x * 28},${185 + y * 15 - z * 35}`;
    }).join(" ");
  });
  return (
    <g>
      {rows.map((points, index) => <polyline key={index} points={points} fill="none" stroke="#67e8f9" strokeWidth="2" />)}
      <ellipse cx="320" cy={185 - section * 35} rx={Math.max(25, size * 22)} ry="30" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 5" />
    </g>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-100 p-2 text-center dark:bg-white/10"><span className="block text-[10px] font-bold text-slate-500">{label}</span><strong className="text-xs">{value}</strong></div>;
}

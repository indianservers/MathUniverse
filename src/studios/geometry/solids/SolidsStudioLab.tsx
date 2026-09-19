import { Link } from "react-router-dom";
import type { StudioMockupPage } from "../../mockup/studioMockupCatalog";
import { LiveRow, Panel, StatusOk } from "../../mockup/studioLabKit";
import { Phase1LabChrome } from "../../phase1/Phase1LabChrome";
import { SolidKind, StudioMath3D } from "../../shared/studioMath3D";

const SHAPE: Record<string, { href: string; label: string; formula: string }> = {
  Cylinders: { href: "/shapes?shape=cylinder", label: "Cylinder", formula: "V = πr²h" },
  Cones: { href: "/shapes?shape=cone", label: "Cone", formula: "V = ⅓πr²h" },
  Spheres: { href: "/shapes?shape=sphere", label: "Sphere", formula: "V = ⁴⁄₃πr³" },
  Nets: { href: "/shapes?shape=cube", label: "Cube net", formula: "Unfold without overlap" },
  "Cross-sections": { href: "/shapes?shape=cylinder", label: "Cross-section", formula: "Plane ∩ solid" },
};

export default function SolidsStudioLab({ page }: { page: StudioMockupPage }) {
  return (
    <Phase1LabChrome page={page}>
      {(mode) => {
        const spec = SHAPE[mode] ?? SHAPE.Cylinders!;
        return (
          <>
            <Panel title={mode}>
              <p className="msk-note">Solid geometry uses the same Three.js engine as Linear Algebra. Orbit the solid, then open Shapes Explorer for nets and measurements.</p>
              <Link className="msk-cta" to={spec.href}>Open {spec.label} in Shapes Explorer</Link>
            </Panel>
            <section className="msk-panel msk-canvas" data-mode-canvas={mode}>
              <StudioMath3D label={mode}>
                <SolidKind kind={mode} />
              </StudioMath3D>
              <p className="msk-formula">{spec.formula}</p>
            </section>
            <aside className="msk-panel msk-live">
              <LiveRow color="#147df2" label="Opens" value={spec.href} />
              <StatusOk>Rotate the solid, read surface area and volume, then unfold a net that does not overlap.</StatusOk>
            </aside>
          </>
        );
      }}
    </Phase1LabChrome>
  );
}

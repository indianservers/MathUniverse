/* global console, process */
import { writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
const evidenceDir = "test-evidence/lesson-ui-upgrade";

const lessons = [
  [581, "/lessons/3d-mathematics/396-regular-polyhedra", "Regular Polyhedra", ["Platonic solids carousel", "V - E + F = 2"]],
  [582, "/lessons/3d-mathematics/397-cylinder", "Cylinder", ["cylinder with net", "V = pi r^2 h"]],
  [583, "/lessons/3d-mathematics/398-cone", "Cone", ["cone with sector net", "V = pi r^2 h / 3"]],
  [584, "/lessons/3d-mathematics/399-sphere", "Sphere", ["sphere with great circle", "V = 4 pi r^3 / 3"]],
  [585, "/lessons/3d-mathematics/400-hemisphere", "Hemisphere", ["hemisphere cut", "V = 2 pi r^3 / 3"]],
  [586, "/lessons/3d-mathematics/401-frustum", "Frustum", ["frustum with two radii", "V = pi h(R^2+Rr+r^2)/3"]],
  [587, "/lessons/3d-mathematics/402-surface-of-revolution", "Surface of Revolution", ["surface of revolution", "rotate y=f(x)"]],
  [588, "/lessons/3d-mathematics/403-extrusion", "Extrusion", ["extruded prism", "V = area x depth"]],
  [589, "/lessons/3d-mathematics/404-nets-of-solids", "Nets of Solids", ["linked 2D/3D net", "Linked face"]],
  [590, "/lessons/3d-mathematics/405-cross-sections", "Cross-Sections", ["moving slice plane", "section changes with plane"]],
  [591, "/lessons/3d-mathematics/406-volume", "Volume", ["capacity comparison", "volume uses cubic units"]],
  [592, "/lessons/3d-mathematics/407-surface-area", "Surface Area", ["unfolded face net", "sum exposed faces"]],
  [593, "/lessons/3d-mathematics/408-euler-s-polyhedron-formula", "Euler's Polyhedron Formula", ["Platonic solids carousel", "V - E + F = 2"]],
  [594, "/lessons/3d-mathematics/409-transparent-x-ray-mode", "Transparent / X-Ray Mode", ["transparent x-ray solid", "hidden edges visible"]],
  [595, "/lessons/3d-mathematics/410-camera-controls", "Camera Controls", ["orbit pan zoom camera", "orbit"]],
  [596, "/lessons/3d-mathematics/411-orthographic-views", "Orthographic Views", ["front top side views", "3D -> 2D projections"]],
  [597, "/lessons/3d-mathematics/412-ar-placement", "AR Placement", ["AR placement anchor", "scale and ground plane"]],
  [598, "/lessons/3d-mathematics/413-surface-z-f-x-y", "Surface z=f(x,y)", ["height surface", "z=f(x,y)"]],
  [599, "/lessons/3d-mathematics/414-implicit-surfaces", "Implicit Surfaces", ["implicit surface", "F(x,y,z)=0"]],
  [600, "/lessons/3d-mathematics/415-parametric-surfaces", "Parametric Surfaces", ["parametric surface", "r(u,v)=<x,y,z>"]],
  [601, "/lessons/3d-mathematics/416-space-curves", "Space Curves", ["space curve", "tangent"]],
  [602, "/lessons/3d-mathematics/417-quadric-surfaces", "Quadric Surfaces", ["quadric classifier", "sign pattern"]],
  [603, "/lessons/3d-mathematics/418-cylindrical-coordinates", "Cylindrical Coordinates", ["cylindrical coordinates", "x=r cos theta"]],
  [604, "/lessons/3d-mathematics/419-spherical-coordinates", "Spherical Coordinates", ["spherical coordinates", "rho with theta and phi"]],
  [605, "/lessons/3d-mathematics/420-contour-curves", "Contour Curves", ["contour", "f(x,y)=c"]],
  [606, "/lessons/3d-mathematics/421-level-surfaces", "Level Surfaces", ["level surface", "f(x,y,z)=c"]],
  [607, "/lessons/3d-mathematics/422-partial-derivatives", "Partial Derivatives", ["partial derivative slices", "fx="]],
  [608, "/lessons/3d-mathematics/423-gradient-vector", "Gradient Vector", ["gradient", "grad f = <fx, fy>"]],
  [609, "/lessons/3d-mathematics/424-tangent-plane", "Tangent Plane", ["tangent plane", "z-z0=fx(x-x0)+fy(y-y0)"]],
  [610, "/lessons/3d-mathematics/425-normal-vector", "Normal Vector", ["normal vector", "n perpendicular to tangents"]],
];

const viewports = [
  ["desktop", { width: 1440, height: 1000 }],
  ["tablet", { width: 900, height: 1100 }],
  ["mobile", { width: 390, height: 1100 }],
];

function assertIncludes(text, expected, label) {
  if (!text.toLowerCase().includes(expected.toLowerCase())) throw new Error(`${label}: missing "${expected}"`);
}

async function setRange(locator, value) {
  const next = await locator.evaluate((input, requested) => {
    const min = Number(input.min);
    const max = Number(input.max);
    const step = Number(input.step) || 1;
    const clamped = Math.min(max, Math.max(min, Number(requested)));
    const snapped = min + Math.round((clamped - min) / step) * step;
    return Number(snapped.toFixed(6));
  }, value);
  await locator.fill(String(next));
}

const browser = await chromium.launch();
const results = [];

try {
  for (const [id, route, title, snippets] of lessons) {
    for (const [viewportName, viewport] of viewports) {
      const page = await browser.newPage({ viewport });
      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      page.on("pageerror", (error) => consoleErrors.push(error.message));

      await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
      await page.getByRole("heading", { name: title }).first().waitFor({ timeout: 15_000 });

      let text = await page.locator("body").innerText();
      assertIncludes(text, title, `${id} ${viewportName}`);
      for (const snippet of snippets) assertIncludes(text, snippet, `${id} ${viewportName}`);

      const svgCount = await page.locator("svg").count();
      if (svgCount < 1) throw new Error(`${id} ${viewportName}: expected SVG scene`);

      const sliders = page.locator('input[type="range"]');
      if ((await sliders.count()) < 1) throw new Error(`${id} ${viewportName}: expected at least one interactive slider`);

      if (id === 589) {
        await page.getByTestId("lesson-live-surface").getByRole("button", { name: "top" }).click();
        await setRange(sliders.first(), 80);
        text = await page.locator("body").innerText();
        assertIncludes(text, "Linked face: top", `${id} ${viewportName}`);
      } else {
        const before = text;
        await setRange(sliders.nth(0), 6);
        if ((await sliders.count()) > 1) await setRange(sliders.nth(1), id >= 598 ? 1.25 : 7);
        if ((await sliders.count()) > 2) await setRange(sliders.nth(2), 145);
        text = await page.locator("body").innerText();
        if (text === before) throw new Error(`${id} ${viewportName}: controls did not update page text`);
      }

      if (consoleErrors.length) throw new Error(`${id} ${viewportName}: console errors: ${consoleErrors.join(" | ")}`);
      await page.screenshot({ path: `${evidenceDir}/${String(id).padStart(4, "0")}-${viewportName}.png`, fullPage: true });
      results.push({ id, route, viewport: viewportName, status: "passed" });
      await page.close();
    }
  }
} finally {
  await browser.close();
}

await writeFile(`${evidenceDir}/validate-0581-0610-summary.json`, `${JSON.stringify({ baseUrl, results }, null, 2)}\n`);
console.log(`Validated ${results.length} lesson viewport renders from 0581 through 0610.`);

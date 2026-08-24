import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const base = "http://127.0.0.1:2245";
const allLessons = [
  [206, 263, "ray", 1031, 1526],
  [207, 264, "polyline", 1024, 1536],
  [208, 265, "perpendicular-line", 998, 1576],
  [209, 266, "parallel-line", 1024, 1536],
  [210, 267, "perpendicular-bisector", 1024, 1536],
  [211, 268, "angle-bisector", 1059, 1485],
  [212, 269, "tangent", 1024, 1536],
  [213, 270, "best-fit-line", 1534, 1025],
  [214, 271, "triangle-constructor", 1029, 1528],
  [215, 272, "regular-polygon", 1027, 1532],
  [216, 273, "rigid-polygon", 1027, 1531],
  [217, 274, "general-polygon", 1022, 1538],
  [218, 275, "circle-centre-and-point", 1024, 1536],
  [219, 276, "circle-centre-and-radius", 997, 1578],
  [220, 277, "circle-through-three-points", 1087, 1447],
  [221, 278, "compass", 1024, 1536],
  [222, 279, "semicircle", 1007, 1562],
  [223, 280, "circular-arc", 1024, 1536],
  [224, 281, "circumcircular-arc", 1013, 1553],
  [225, 282, "circular-sector", 1024, 1536],
  [226, 283, "conic-through-five-points", 1086, 1448],
  [227, 284, "ellipse", 1032, 1524],
  [228, 285, "hyperbola", 1024, 1536],
  [229, 286, "parabola", 1026, 1533],
  [230, 287, "distance-length", 1029, 1528],
  [231, 288, "area", 1040, 1513],
  [232, 289, "angle", 994, 1582],
  [233, 290, "fixed-angle", 1004, 1567],
  [234, 291, "relation-checker", 1023, 1538],
  [235, 292, "construction-steps", 1006, 1564],
];
const selectedIds = new Set(
  (process.env.LESSON_IDS ?? "").split(",").filter(Boolean).map(Number),
);
const lessons = selectedIds.size
  ? allLessons.filter(([id]) => selectedIds.has(id))
  : allLessons;

const browser = await chromium.launch({ headless: true });
const results = [];
for (const [id, mockup, slug, width, height] of lessons) {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const consoleErrors = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  const route = `/lessons/geometry/${id}-${slug}`;
  await page.goto(`${base}${route}`, { waitUntil: "networkidle" });
  const selector = `[data-testid="dynamic-geometry-mockup-${String(mockup).padStart(4, "0")}"]`;
  await page.locator(selector).waitFor({ state: "visible" });
  const firstRange = page.locator(`${selector} input[type="range"]`).first();
  const before = Number(await firstRange.inputValue());
  const max = Number(await firstRange.getAttribute("max"));
  await firstRange.fill(String(Math.min(max, before + 1)));
  await page.getByRole("button", { name: "Check Construction" }).click();
  const status = await page
    .getByRole("status")
    .filter({ hasText: "Construction verified." })
    .innerText();
  await page.reload({ waitUntil: "networkidle" });
  const geometry = await page.evaluate((surfaceSelector) => {
    const surface = document.querySelector(surfaceSelector);
    const rect = surface?.getBoundingClientRect();
    const overflowing = [
      ...document.querySelectorAll(`${surfaceSelector} *`),
    ].filter((element) => {
      const box = element.getBoundingClientRect();
      return box.width > 0 && (box.left < 0 || box.right > innerWidth + 1);
    }).length;
    return {
      scrollHeight: document.documentElement.scrollHeight,
      surfaceBottom: rect?.bottom ?? null,
      objectModel: surface?.getAttribute("data-object-model"),
      overflowing,
    };
  }, selector);
  const file = path.join(
    evidence,
    `${String(mockup).padStart(4, "0")}-desktop.png`,
  );
  await page.screenshot({ path: file, fullPage: false, type: "png" });
  results.push({
    id,
    mockup,
    route,
    width,
    height,
    status,
    consoleErrors,
    ...geometry,
  });
  await page.close();
}
await browser.close();
await fs.writeFile(
  path.join(evidence, "0263-0292-dedicated-target-validation.json"),
  JSON.stringify(results, null, 2),
);
console.log(
  JSON.stringify(
    {
      lessons: results.length,
      failures: results.filter(
        (row) =>
          row.consoleErrors.length ||
          row.overflowing ||
          row.status !== "Construction verified.",
      ).length,
      results,
    },
    null,
    2,
  ),
);

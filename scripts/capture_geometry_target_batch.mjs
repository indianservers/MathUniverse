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
  let status;
  if (id === 206) {
    await page.getByRole("button", { name: "Edit point B" }).click();
    await page.getByRole("spinbutton", { name: "B x coordinate" }).fill("5");
    await page.getByRole("button", { name: "Hide grid" }).click();
    await page.getByRole("button", { name: "Show grid" }).click();
    await page.getByRole("textbox", { name: "Ray practice slope" }).fill("1");
    await page.getByRole("textbox", { name: "Ray practice angle" }).fill("45");
    await page
      .getByRole("textbox", { name: "Ray practice ray notation" })
      .fill("PQ");
    await page.getByRole("button", { name: "Check your answer" }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct:" })
      .innerText();
  } else if (id === 207) {
    const firstPoint = page.locator('[data-testid="polyline-point-0"]');
    const pointXBeforeDrag = await firstPoint.getAttribute("cx");
    const firstPointBox = await firstPoint.boundingBox();
    if (!firstPointBox) throw new Error("Polyline point A is not draggable");
    await page.mouse.move(
      firstPointBox.x + firstPointBox.width / 2,
      firstPointBox.y + firstPointBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(firstPointBox.x + 24, firstPointBox.y - 18, {
      steps: 4,
    });
    await page.mouse.up();
    const pointXAfterDrag = await firstPoint.getAttribute("cx");
    if (pointXAfterDrag === pointXBeforeDrag) {
      throw new Error("Polyline drag did not update point A");
    }
    await page.getByRole("button", { name: "Point" }).click();
    await page
      .getByRole("img", { name: "Interactive polyline coordinate plane" })
      .click({ position: { x: 210, y: 120 } });
    await page.getByRole("button", { name: "Closed" }).click();
    await page.getByRole("button", { name: "Open" }).click();
    await page.getByRole("button", { name: "Undo last action" }).click();
    await page.getByRole("button", { name: "Load example" }).click();
    await page.getByRole("button", { name: "Start constructing" }).click();
    await page.getByRole("button", { name: "Check answer" }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct construction" })
      .innerText();
  } else if (id === 208) {
    const pointP = page.locator('[data-testid="perpendicular-point-p"]');
    const pointXBeforeDrag = await pointP.getAttribute("cx");
    const pointBox = await pointP.boundingBox();
    if (!pointBox) throw new Error("Perpendicular point P is not draggable");
    await page.mouse.move(
      pointBox.x + pointBox.width / 2,
      pointBox.y + pointBox.height / 2,
    );
    await page.mouse.down();
    await page.waitForTimeout(150);
    await page.mouse.move(pointBox.x + 22, pointBox.y - 16, { steps: 4 });
    await page.mouse.up();
    if ((await pointP.getAttribute("cx")) === pointXBeforeDrag) {
      throw new Error("Perpendicular drag did not update point P");
    }
    await page.getByRole("slider", { name: "Given line slope" }).fill("1");
    await page.getByRole("spinbutton", { name: "Point P x" }).fill("3");
    await page.getByRole("button", { name: "Clear" }).click();
    await page.getByRole("button", { name: "Perpendicular" }).click();
    await page.getByRole("button", { name: "New example" }).click();
    await page.getByRole("button", { name: "Start construction" }).click();
    await page.getByRole("button", { name: "Perpendicular" }).click();
    await page.getByRole("button", { name: "Check answer" }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct perpendicular construction" })
      .innerText();
  } else if (id === 209) {
    const pointP = page.locator('[data-testid="parallel-point-p"]');
    const pointXBeforeDrag = await pointP.getAttribute("cx");
    const pointBox = await pointP.boundingBox();
    if (!pointBox) throw new Error("Parallel point P is not draggable");
    await page.mouse.move(
      pointBox.x + pointBox.width / 2,
      pointBox.y + pointBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(pointBox.x + 24, pointBox.y - 16, { steps: 4 });
    await page.mouse.up();
    if ((await pointP.getAttribute("cx")) === pointXBeforeDrag) {
      throw new Error("Parallel drag did not update point P");
    }
    await page.getByRole("slider", { name: "Slope m" }).fill("1");
    await page
      .getByRole("spinbutton", { name: "y-intercept c exact value" })
      .fill("2");
    await page.getByRole("checkbox", { name: "Snap to grid" }).check();
    await page.getByRole("button", { name: "Increase point x" }).click();
    await page.getByRole("button", { name: "Start practice" }).click();
    for (const label of [
      "Slopes are equal",
      "Angles are equal",
      "Lines are parallel",
    ]) {
      await page.getByRole("checkbox", { name: label }).check();
    }
    await page.getByRole("button", { name: "Check my answer" }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct parallel construction" })
      .innerText();
  } else if (id === 210) {
    const pointA = page.locator('[data-testid="bisector-point-a"]');
    const pointXBeforeDrag = await pointA.getAttribute("cx");
    const pointBox = await pointA.boundingBox();
    if (!pointBox) throw new Error("Bisector endpoint A is not draggable");
    await page.mouse.move(
      pointBox.x + pointBox.width / 2,
      pointBox.y + pointBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(pointBox.x + 22, pointBox.y - 14, { steps: 4 });
    await page.mouse.up();
    if ((await pointA.getAttribute("cx")) === pointXBeforeDrag) {
      throw new Error("Bisector drag did not update endpoint A");
    }
    await page.getByRole("spinbutton", { name: "B y coordinate" }).fill("1");
    await page.getByRole("button", { name: "Custom" }).click();
    await page.getByRole("spinbutton", { name: "Arc radius" }).fill("6.5");
    await page.getByRole("button", { name: "Auto" }).click();
    for (const label of [
      "Show arcs",
      "Show perpendicular bisector",
      "Show right angle",
      "Show equal marks",
      "Show labels",
    ]) {
      const control = page.getByRole("checkbox", { name: label }).last();
      await control.uncheck();
      await control.check();
    }
    await page.getByRole("button", { name: "Reset" }).click();
    await page.getByRole("button", { name: "Hint" }).click();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct: C lies" })
      .innerText();
  } else if (id === 211) {
    const pointB = page.locator('[data-testid="angle-point-b"]');
    const xBeforeDrag = await pointB.getAttribute("cx");
    const pointBox = await pointB.boundingBox();
    if (!pointBox) throw new Error("Angle arm point B is not draggable");
    await page.mouse.move(
      pointBox.x + pointBox.width / 2,
      pointBox.y + pointBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(pointBox.x - 20, pointBox.y + 26, { steps: 4 });
    await page.mouse.up();
    if ((await pointB.getAttribute("cx")) === xBeforeDrag) {
      throw new Error("Angle arm drag did not update point B");
    }
    const arcs = page.getByRole("switch", { name: "Show arcs" });
    await arcs.click();
    await arcs.click();
    await page.getByRole("button", { name: "Pan construction" }).click();
    const plane = page.getByRole("img", {
      name: "Interactive angle bisector construction with draggable points A B and C",
    });
    const planeBox = await plane.boundingBox();
    if (!planeBox) throw new Error("Angle construction plane is missing");
    await page.mouse.move(planeBox.x + 280, planeBox.y + 180);
    await page.mouse.down();
    await page.mouse.move(planeBox.x + 295, planeBox.y + 190, { steps: 3 });
    await page.mouse.up();
    await page
      .getByRole("button", { name: "Show compass construction" })
      .click();
    await page.getByRole("button", { name: "Show steps on canvas" }).click();
    const practiceC = page.locator('[data-testid="practice-angle-point-c"]');
    const practiceCBefore = await practiceC.getAttribute("cy");
    const practiceCBox = await practiceC.boundingBox();
    if (!practiceCBox)
      throw new Error("Practice angle point C is not draggable");
    await page.mouse.move(
      practiceCBox.x + practiceCBox.width / 2,
      practiceCBox.y + practiceCBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(practiceCBox.x + 18, practiceCBox.y - 20, {
      steps: 3,
    });
    await page.mouse.up();
    if ((await practiceC.getAttribute("cy")) === practiceCBefore) {
      throw new Error("Practice angle drag did not update point C");
    }
    const practiceBefore = await page
      .getByRole("img", { name: /Practice angle/ })
      .getAttribute("aria-label");
    await page.getByRole("button", { name: "New Angle" }).click();
    await page.waitForFunction(
      (before) =>
        document
          .querySelector('[aria-label^="Practice angle"]')
          ?.getAttribute("aria-label") !== before,
      practiceBefore,
    );
    const practiceAfter = await page
      .getByRole("img", { name: /Practice angle/ })
      .getAttribute("aria-label");
    if (practiceBefore === practiceAfter) {
      throw new Error("New Angle did not change the practice model");
    }
    status = `Correct: ${await page.getByRole("status").filter({ hasText: "The two angles are equal" }).innerText()}`;
  } else if (id === 212) {
    const pointT = page.locator('[data-testid="tangent-point-t"]');
    const xBeforeDrag = await pointT.getAttribute("cx");
    const pointBox = await pointT.boundingBox();
    if (!pointBox) throw new Error("Tangent point T is not draggable");
    await page.mouse.move(
      pointBox.x + pointBox.width / 2,
      pointBox.y + pointBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(pointBox.x + 90, pointBox.y + 45, { steps: 5 });
    await page.mouse.up();
    if ((await pointT.getAttribute("cx")) === xBeforeDrag) {
      throw new Error("Tangent drag did not update point T");
    }
    await page.getByRole("switch", { name: "Snap to circle" }).uncheck();
    const yBeforeFreeDrag = await pointT.getAttribute("cy");
    const movedBox = await pointT.boundingBox();
    if (!movedBox) throw new Error("Free tangent point is missing");
    await page.mouse.move(
      movedBox.x + movedBox.width / 2,
      movedBox.y + movedBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(movedBox.x + 35, movedBox.y + 28, { steps: 4 });
    await page.mouse.up();
    if ((await pointT.getAttribute("cy")) === yBeforeFreeDrag) {
      throw new Error("Free tangent drag did not update point T");
    }
    await page.getByRole("switch", { name: "Show secant line" }).check();
    await page.getByRole("switch", { name: "Show grid" }).uncheck();
    await page.getByRole("button", { name: "Zoom in" }).click();
    await page.getByRole("button", { name: "Zoom out" }).click();
    await page.getByRole("button", { name: "Reset view" }).click();
    const practiceBefore = await page
      .getByRole("img", { name: /Practice tangent position/ })
      .getAttribute("aria-label");
    await page.getByRole("button", { name: "New Position" }).click();
    const practiceAfter = await page
      .getByRole("img", { name: /Practice tangent position/ })
      .getAttribute("aria-label");
    if (practiceBefore === practiceAfter) {
      throw new Error("New Position did not update tangent practice");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    status = `Correct: ${await page.getByRole("status").filter({ hasText: "The tangent is perpendicular" }).innerText()}`;
  } else if (id === 213) {
    const point = page.locator('[data-testid="best-fit-point-0"]');
    const xBeforeDrag = await point.getAttribute("cx");
    const pointBox = await point.boundingBox();
    if (!pointBox) throw new Error("Regression observation is not draggable");
    await page.mouse.move(
      pointBox.x + pointBox.width / 2,
      pointBox.y + pointBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(pointBox.x + 30, pointBox.y - 22, { steps: 4 });
    await page.mouse.up();
    if ((await point.getAttribute("cx")) === xBeforeDrag) {
      throw new Error("Regression point drag did not update observation");
    }
    const intercept = page.getByRole("slider", { name: "b (y-intercept)" });
    const bBeforeLineDrag = await intercept.inputValue();
    const line = page.locator('[data-testid="best-fit-draggable-line"]');
    const lineBox = await line.boundingBox();
    if (!lineBox) throw new Error("Regression line is not draggable");
    await page.mouse.move(
      lineBox.x + lineBox.width / 2,
      lineBox.y + lineBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(lineBox.x + lineBox.width / 2, lineBox.y - 28, {
      steps: 4,
    });
    await page.mouse.up();
    if ((await intercept.inputValue()) === bBeforeLineDrag) {
      throw new Error("Regression line drag did not update intercept");
    }
    await page.getByRole("slider", { name: "m (slope)" }).fill("0.5");
    await intercept.fill("1");
    for (const label of ["Best-fit line", "Residuals", "Equation"]) {
      const control = page.getByRole("checkbox", { name: label });
      await control.uncheck();
      await control.check();
    }
    await page.getByRole("button", { name: "Bookmark lesson" }).click();
    await page.getByRole("button", { name: "Fit least squares line" }).click();
    await page.getByRole("button", { name: "Check my line" }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct: least-squares" })
      .innerText();
    const oldSlope = await page
      .getByRole("slider", { name: "m (slope)" })
      .inputValue();
    await page.getByRole("button", { name: "New challenge" }).click();
    if (
      (await page.getByRole("slider", { name: "m (slope)" }).inputValue()) ===
      oldSlope
    ) {
      throw new Error("New challenge did not update the regression dataset");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
  } else if (id === 214) {
    const pointC = page.locator('[data-testid="triangle-point-c"]');
    const xBeforeDrag = await pointC.getAttribute("cx");
    const pointBox = await pointC.boundingBox();
    if (!pointBox) throw new Error("Triangle vertex C is not draggable");
    await page.mouse.move(
      pointBox.x + pointBox.width / 2,
      pointBox.y + pointBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(pointBox.x + 28, pointBox.y - 20, { steps: 4 });
    await page.mouse.up();
    if ((await pointC.getAttribute("cx")) === xBeforeDrag) {
      throw new Error("Triangle vertex drag did not update C");
    }
    await page.getByRole("button", { name: "SAS", exact: true }).click();
    await page.getByRole("slider", { name: "AB (base)" }).fill("8");
    await page.getByRole("slider", { name: "∠A" }).fill("45");
    await page.getByRole("slider", { name: "AC", exact: true }).fill("7");
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct: target triangle" })
      .innerText();
    const practice = page.locator("#triangle-4");
    const practiceBefore = await practice.innerText();
    await page.getByRole("button", { name: "New values" }).click();
    if ((await practice.innerText()) === practiceBefore) {
      throw new Error("New values did not change the triangle target");
    }
    await page.getByRole("button", { name: "SSS", exact: true }).click();
    await page.getByRole("slider", { name: "AB (base)" }).fill("1");
    await page.getByRole("slider", { name: "AC", exact: true }).fill("1");
    await page.getByRole("slider", { name: "BC" }).fill("3");
    await page
      .getByRole("status")
      .filter({ hasText: "Not feasible" })
      .waitFor();
    await page.getByRole("button", { name: "ASA", exact: true }).click();
    await page.getByRole("slider", { name: "∠A" }).fill("100");
    await page.getByRole("slider", { name: "∠B" }).fill("100");
    await page
      .getByRole("status")
      .filter({ hasText: "Not feasible" })
      .waitFor();
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    const panLayer = page.locator('[data-testid="triangle-pan-layer"]');
    const panBefore = await panLayer.getAttribute("transform");
    await page.getByRole("button", { name: "Pan triangle plane" }).click();
    const plane = page.getByRole("img", {
      name: "Interactive triangle coordinate plane with draggable vertices A B and C",
    });
    const planeBox = await plane.boundingBox();
    if (!planeBox) throw new Error("Triangle plane is missing");
    await page.mouse.move(planeBox.x + 250, planeBox.y + 250);
    await page.mouse.down();
    await page.mouse.move(planeBox.x + 275, planeBox.y + 268, { steps: 3 });
    await page.mouse.up();
    if ((await panLayer.getAttribute("transform")) === panBefore) {
      throw new Error("Triangle pan tool did not move the construction");
    }
    await page.getByRole("button", { name: "Fit triangle to view" }).click();
  } else if (id === 215) {
    const vertex = page.locator('[data-testid="regular-polygon-vertex-0"]');
    const xBeforeDrag = await vertex.getAttribute("cx");
    const radiusBeforeDrag = await page
      .getByRole("slider", { name: "Radius (r)" })
      .inputValue();
    const vertexBox = await vertex.boundingBox();
    if (!vertexBox) throw new Error("Regular polygon vertex is not draggable");
    await page.mouse.move(
      vertexBox.x + vertexBox.width / 2,
      vertexBox.y + vertexBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(vertexBox.x + 28, vertexBox.y + 18, { steps: 4 });
    await page.mouse.up();
    if (
      (await vertex.getAttribute("cx")) === xBeforeDrag ||
      (await page.getByRole("slider", { name: "Radius (r)" }).inputValue()) ===
        radiusBeforeDrag
    ) {
      throw new Error(
        "Polygon vertex drag did not update radius and orientation",
      );
    }
    const center = page.locator('[data-testid="regular-polygon-center"]');
    const centerBefore = await center.getAttribute("cx");
    const centerBox = await center.boundingBox();
    if (!centerBox) throw new Error("Regular polygon centre is not draggable");
    await page.mouse.move(
      centerBox.x + centerBox.width / 2,
      centerBox.y + centerBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(centerBox.x + 24, centerBox.y - 16, { steps: 4 });
    await page.mouse.up();
    if ((await center.getAttribute("cx")) === centerBefore) {
      throw new Error("Polygon centre drag did not translate the construction");
    }
    await page.getByRole("slider", { name: "Sides (n)" }).fill("8");
    await page.getByRole("slider", { name: "Radius (r)" }).fill("5");
    const rotatedBefore = await page
      .locator('[data-testid="regular-polygon-vertex-0"]')
      .getAttribute("cx");
    await page
      .getByRole("button", { name: "Rotate polygon 15 degrees" })
      .click();
    if (
      (await page
        .locator('[data-testid="regular-polygon-vertex-0"]')
        .getAttribute("cx")) === rotatedBefore
    ) {
      throw new Error("Rotate control did not update polygon orientation");
    }
    await page.getByRole("button", { name: "Hide radii" }).click();
    await page.getByRole("button", { name: "Show radii" }).click();
    await page.getByRole("button", { name: "Hide polygon grid" }).click();
    await page.getByRole("button", { name: "Show polygon grid" }).click();
    for (const label of [
      "Show vertices",
      "Show circumcircle",
      "Show symmetry axes",
      "Labels",
    ]) {
      const control = page.getByRole("checkbox", { name: label });
      await control.uncheck();
      await control.check();
    }
    await page.getByRole("button", { name: "Place polygon centre" }).click();
    const plane = page.getByRole("img", {
      name: "Interactive regular polygon coordinate plane with draggable centre and vertices",
    });
    await plane.click({ position: { x: 310, y: 225 } });
    await page
      .getByRole("spinbutton", { name: "Polygon practice side" })
      .fill("3.83");
    await page
      .getByRole("spinbutton", { name: "Polygon practice perimeter" })
      .fill("30.61");
    await page
      .getByRole("spinbutton", { name: "Polygon practice area" })
      .fill("70.71");
    await page.getByRole("button", { name: "Hint" }).click();
    await page.getByRole("button", { name: "Check Answer" }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct: octagon" })
      .innerText();
  } else {
    const firstRange = page.locator(`${selector} input[type="range"]`).first();
    const before = Number(await firstRange.inputValue());
    const max = Number(await firstRange.getAttribute("max"));
    await firstRange.fill(String(Math.min(max, before + 1)));
    await page.getByRole("button", { name: "Check Construction" }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Construction verified." })
      .innerText();
  }
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
const validationName = selectedIds.size
  ? `${String(lessons[0][1]).padStart(4, "0")}-dedicated-target-validation.json`
  : "0263-0292-dedicated-target-validation.json";
await fs.writeFile(
  path.join(evidence, validationName),
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
          !row.status.match(/Construction verified\.|Correct/i),
      ).length,
      results,
    },
    null,
    2,
  ),
);

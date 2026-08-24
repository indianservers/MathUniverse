import { chromium } from "playwright";
import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const evidence = path.join(root, "test-evidence", "lesson-ui-upgrade");
const base = process.env.LESSON_BASE_URL ?? "http://127.0.0.1:2245";
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
  [236, 293, "translation-by-vector", 1024, 1542],
  [237, 294, "reflection-in-line", 1026, 1533],
  [238, 295, "reflection-in-point", 1044, 1506],
  [239, 296, "reflection-in-circle", 1027, 1532],
  [240, 297, "rotation-around-point", 1474, 1067],
  [241, 298, "dilation-from-point", 1054, 1492],
  [242, 299, "matrix-transformation", 1045, 1505],
  [243, 300, "composite-transformations", 988, 1592],
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
  await page.goto(`${base}${route}`, { waitUntil: "networkidle", timeout: 60_000 });
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
  } else if (id === 216) {
    const polygon = page.locator('[data-testid="rigid-original-polygon"]');
    const pointsBefore = await polygon.getAttribute("points");
    const lengthsBefore = await polygon.getAttribute("data-side-lengths");
    const polygonBox = await polygon.boundingBox();
    if (!polygonBox) throw new Error("Rigid triangle is not draggable");
    await page.mouse.move(
      polygonBox.x + polygonBox.width / 2,
      polygonBox.y + polygonBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      polygonBox.x + polygonBox.width / 2 + 34,
      polygonBox.y + polygonBox.height / 2 - 22,
      { steps: 4 },
    );
    await page.mouse.up();
    if ((await polygon.getAttribute("points")) === pointsBefore) {
      throw new Error("Rigid-body move did not translate the triangle");
    }
    if ((await polygon.getAttribute("data-side-lengths")) !== lengthsBefore) {
      throw new Error("Rigid-body move changed a side length");
    }
    await page.getByRole("button", { name: "Rotate", exact: true }).click();
    const vertex = page.locator('[data-testid="rigid-vertex-a"]');
    const vertexBefore = await vertex.getAttribute("cx");
    const vertexBox = await vertex.boundingBox();
    if (!vertexBox) throw new Error("Rigid triangle vertex is missing");
    await page.mouse.move(
      vertexBox.x + vertexBox.width / 2,
      vertexBox.y + vertexBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(vertexBox.x + 24, vertexBox.y - 32, { steps: 4 });
    await page.mouse.up();
    if ((await vertex.getAttribute("cx")) === vertexBefore) {
      throw new Error("Rotate mode did not turn the rigid triangle");
    }
    if ((await polygon.getAttribute("data-side-lengths")) !== lengthsBefore) {
      throw new Error("Rigid-body rotation changed a side length");
    }
    for (const label of [
      "Show labels",
      "Show lengths",
      "Show angles",
      "Show overlay",
    ]) {
      const control = page.getByRole("checkbox", { name: label });
      await control.uncheck();
      await control.check();
    }
    await page.getByRole("button", { name: "Reset view" }).click();
    const values = {
      "A rotated x": "-1",
      "A rotated y": "-3",
      "B rotated x": "-5",
      "B rotated y": "1",
      "C rotated x": "-1",
      "C rotated y": "4",
    };
    for (const [label, value] of Object.entries(values)) {
      await page.getByRole("textbox", { name: label }).fill(value);
    }
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct rigid rotation." })
      .innerText();
  } else if (id === 217) {
    const body = page.locator('[data-testid="general-polygon-body"]');
    const areaBeforeVertexDrag = await body.getAttribute("data-area");
    const vertex = page.locator('[data-testid="general-polygon-vertex-0"]');
    const vertexBefore = await vertex.getAttribute("cx");
    const vertexBox = await vertex.boundingBox();
    if (!vertexBox) throw new Error("General polygon vertex is not draggable");
    await page.mouse.move(
      vertexBox.x + vertexBox.width / 2,
      vertexBox.y + vertexBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(vertexBox.x + 32, vertexBox.y - 28, { steps: 4 });
    await page.mouse.up();
    if ((await vertex.getAttribute("cx")) === vertexBefore) {
      throw new Error("General polygon vertex drag did not reshape the polygon");
    }
    if ((await body.getAttribute("data-area")) === areaBeforeVertexDrag) {
      throw new Error("Vertex drag did not update the computed polygon area");
    }
    await page.getByRole("button", { name: "Point", exact: true }).click();
    const plane = page.getByRole("img", {
      name: "Editable general polygon coordinate plane with add drag and remove vertices",
    });
    await plane.click({ position: { x: 420, y: 145 } });
    if ((await page.locator('[data-testid^="general-polygon-vertex-"]').count()) !== 6) {
      throw new Error("Point tool did not add a sixth polygon vertex");
    }
    await page.locator('[data-testid="general-polygon-vertex-5"]').dblclick();
    if ((await page.locator('[data-testid^="general-polygon-vertex-"]').count()) !== 5) {
      throw new Error("Double-click did not remove the added polygon vertex");
    }
    await page.getByRole("button", { name: "Move", exact: true }).click();
    const areaBeforeMove = await body.getAttribute("data-area");
    const pointsBeforeMove = await body.getAttribute("points");
    const bodyBox = await body.boundingBox();
    if (!bodyBox) throw new Error("General polygon body is not movable");
    await page.mouse.move(
      bodyBox.x + bodyBox.width / 2,
      bodyBox.y + bodyBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      bodyBox.x + bodyBox.width / 2 + 26,
      bodyBox.y + bodyBox.height / 2 + 18,
      { steps: 4 },
    );
    await page.mouse.up();
    if ((await body.getAttribute("points")) === pointsBeforeMove) {
      throw new Error("Move tool did not translate the complete polygon");
    }
    if ((await body.getAttribute("data-area")) !== areaBeforeMove) {
      throw new Error("Whole-polygon translation changed its area");
    }
    await page.getByRole("button", { name: "Measure", exact: true }).click();
    const firstSide = page.locator('[data-testid="general-polygon-side-0"]');
    await firstSide.click({ force: true });
    if ((await firstSide.getAttribute("stroke")) !== "#f97316") {
      throw new Error("Measure tool did not select a polygon side");
    }
    for (const label of ["Snap", "Grid"]) {
      const control = page.getByRole("checkbox", { name: label });
      await control.uncheck();
      await control.check();
    }
    await page.getByRole("button", { name: "Clear All" }).click();
    if ((await page.locator('[data-testid^="general-polygon-vertex-"]').count()) !== 0) {
      throw new Error("Clear All did not remove the polygon vertices");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("textbox", { name: "Hexagon interior sum" }).fill("720");
    await page.getByRole("textbox", { name: "Hexagon exterior sum" }).fill("360");
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct polygon sums." })
      .innerText();
  } else if (id === 218) {
    const circle = page.locator(
      '[data-testid="centre-point-construction-circle"]',
    );
    const centre = page.locator('[data-testid="circle-centre-handle"]');
    const centreBefore = await centre.getAttribute("cx");
    const radiusBeforeCentreDrag = await circle.getAttribute("data-radius");
    const centreBox = await centre.boundingBox();
    if (!centreBox) throw new Error("Circle centre C is not draggable");
    await page.mouse.move(
      centreBox.x + centreBox.width / 2,
      centreBox.y + centreBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(centreBox.x + 30, centreBox.y - 22, { steps: 4 });
    await page.mouse.up();
    if ((await centre.getAttribute("cx")) === centreBefore) {
      throw new Error("Dragging C did not translate the circle centre");
    }
    if ((await circle.getAttribute("data-radius")) === radiusBeforeCentreDrag) {
      throw new Error("Dragging C did not recalculate CP");
    }
    const point = page.locator('[data-testid="circle-point-handle"]');
    const pointBefore = await point.getAttribute("cx");
    const radiusBeforePointDrag = await circle.getAttribute("data-radius");
    const pointBox = await point.boundingBox();
    if (!pointBox) throw new Error("Circle point P is not draggable");
    await page.mouse.move(
      pointBox.x + pointBox.width / 2,
      pointBox.y + pointBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(pointBox.x - 28, pointBox.y + 34, { steps: 4 });
    await page.mouse.up();
    if ((await point.getAttribute("cx")) === pointBefore) {
      throw new Error("Dragging P did not move the circumference point");
    }
    if ((await circle.getAttribute("data-radius")) === radiusBeforePointDrag) {
      throw new Error("Dragging P did not change the circle radius");
    }
    await page.getByRole("spinbutton", { name: "Centre x coordinate" }).fill("2");
    await page.getByRole("spinbutton", { name: "Centre y coordinate" }).fill("1");
    await page.getByRole("spinbutton", { name: "Point x coordinate" }).fill("5");
    await page.getByRole("spinbutton", { name: "Point y coordinate" }).fill("4");
    await page.getByRole("button", { name: "Lock centre" }).click();
    if (!(await page.getByRole("spinbutton", { name: "Centre x coordinate" }).isDisabled())) {
      throw new Error("Centre lock did not disable coordinate editing");
    }
    await page.getByRole("button", { name: "Unlock centre" }).click();
    for (const label of ["Grid", "Axes"]) {
      const control = page.getByRole("button", { name: label, exact: true });
      await control.click();
      await control.click();
    }
    for (const label of [
      "Show circle",
      "Show radius",
      "Show centre C",
      "Show point P",
    ]) {
      const control = page.getByRole("checkbox", { name: label });
      await control.uncheck();
      await control.check();
    }
    await page.getByRole("button", { name: "New random challenge" }).click();
    await page.getByRole("button", { name: "Load this challenge" }).click();
    await page.getByText("Challenge circle loaded.").waitFor();
    await page.getByRole("button", { name: "Reset view" }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct circle dependency." })
      .innerText();
  } else if (id === 219) {
    const circle = page.locator('[data-testid="fixed-radius-circle"]');
    const centre = page.locator('[data-testid="fixed-radius-centre"]');
    const centreBefore = await centre.getAttribute("cx");
    const radiusBeforeCentreDrag = await circle.getAttribute("data-radius");
    const centreBox = await centre.boundingBox();
    if (!centreBox) throw new Error("Fixed-radius circle centre is not draggable");
    await page.mouse.move(
      centreBox.x + centreBox.width / 2,
      centreBox.y + centreBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(centreBox.x + 34, centreBox.y - 24, { steps: 4 });
    await page.mouse.up();
    if ((await centre.getAttribute("cx")) === centreBefore) {
      throw new Error("Dragging C did not translate the fixed-radius circle");
    }
    if ((await circle.getAttribute("data-radius")) !== radiusBeforeCentreDrag) {
      throw new Error("Moving C changed the independent radius");
    }
    const handle = page.locator('[data-testid="fixed-radius-handle"]');
    const handleBox = await handle.boundingBox();
    if (!handleBox) throw new Error("Compass radius handle is not draggable");
    const centreBeforeRadiusDrag = await centre.getAttribute("cx");
    const radiusBeforeHandleDrag = await circle.getAttribute("data-radius");
    await page.mouse.move(
      handleBox.x + handleBox.width / 2,
      handleBox.y + handleBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(handleBox.x + 38, handleBox.y + 16, { steps: 4 });
    await page.mouse.up();
    if ((await circle.getAttribute("data-radius")) === radiusBeforeHandleDrag) {
      throw new Error("Compass drag did not update the numeric radius");
    }
    if ((await centre.getAttribute("cx")) !== centreBeforeRadiusDrag) {
      throw new Error("Changing radius moved the centre");
    }
    for (const label of ["Move circle", "Adjust radius with compass", "Select"]) {
      await page.getByRole("button", { name: label, exact: true }).click();
    }
    await page.getByRole("button", { name: "Increase Centre x" }).click();
    await page.getByRole("button", { name: "Decrease Centre y" }).click();
    await page.getByRole("button", { name: "Increase radius" }).click();
    await page.getByRole("button", { name: "Decrease radius" }).click();
    await page.getByRole("combobox", { name: "Radius units" }).selectOption("cm");
    await page.getByRole("combobox", { name: "Radius units" }).selectOption("units");
    await page.getByRole("spinbutton", { name: "Centre x", exact: true }).fill("-3");
    await page.getByRole("spinbutton", { name: "Centre y", exact: true }).fill("2");
    await page.getByRole("spinbutton", { name: "Radius exact value" }).fill("4");
    await page.getByRole("button", { name: "Check Answer" }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct centre and radius construction." })
      .innerText();
  } else if (id === 220) {
    const plane = page.getByRole("img", {
      name: "Interactive circumcircle through draggable points A B and C",
    });
    const toScreen = async (x, y) =>
      plane.evaluate(
        (svg, point) => {
          const matrix = svg.getScreenCTM();
          if (!matrix) throw new Error("Circumcircle SVG matrix is unavailable");
          const result = new DOMPoint(point.x, point.y).matrixTransform(matrix);
          return { x: result.x, y: result.y };
        },
        { x, y },
      );
    const circle = page.locator('[data-testid="three-point-circle"]');
    const pointA = page.locator('[data-testid="circumcircle-point-0"]');
    const centreBefore = await circle.getAttribute("data-center-y");
    const pointABox = await pointA.boundingBox();
    if (!pointABox) throw new Error("Circumcircle point A is not draggable");
    await page.mouse.move(
      pointABox.x + pointABox.width / 2,
      pointABox.y + pointABox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(pointABox.x + 24, pointABox.y + 18, { steps: 4 });
    await page.mouse.up();
    if ((await circle.getAttribute("data-center-y")) === centreBefore) {
      throw new Error("Dragging A did not update the circumcentre");
    }
    const collinear = await toScreen(350, 355);
    const movedABox = await pointA.boundingBox();
    if (!movedABox) throw new Error("Moved circumcircle point A is missing");
    await page.mouse.move(
      movedABox.x + movedABox.width / 2,
      movedABox.y + movedABox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(collinear.x, collinear.y, { steps: 5 });
    await page.mouse.up();
    await page.getByText("No unique circle", { exact: true }).waitFor();
    if (await page.locator('[data-testid="three-point-circle"]').count()) {
      throw new Error("Collinear points still produced a unique circle");
    }
    await page.getByRole("button", { name: "Reset Points" }).click();
    await page.getByRole("button", { name: "Remove point C" }).click();
    if ((await page.locator('[data-testid^="circumcircle-point-"]').count()) !== 2) {
      throw new Error("Point removal did not update the three-point model");
    }
    const replacement = await toScreen(515, 190);
    await page.mouse.click(replacement.x, replacement.y);
    if ((await page.locator('[data-testid^="circumcircle-point-"]').count()) !== 3) {
      throw new Error("Clicking the plane did not replace the third point");
    }
    await page.getByRole("button", { name: "Reset Points" }).click();
    for (const label of ["Labels", "Grid"]) {
      const control = page.getByRole("checkbox", { name: label, exact: true });
      await control.uncheck();
      await control.check();
    }
    for (const label of [
      "Circle (through A, B, C)",
      "Perpendicular bisectors",
      "Circumcentre O",
    ]) {
      const control = page.getByRole("checkbox", { name: label });
      await control.uncheck();
      await control.check();
    }
    const targetA = await toScreen(350, 300 - Math.sqrt(10) * 55);
    const resetABox = await pointA.boundingBox();
    if (!resetABox) throw new Error("Reset circumcircle point A is missing");
    await page.mouse.move(
      resetABox.x + resetABox.width / 2,
      resetABox.y + resetABox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(targetA.x, targetA.y, { steps: 5 });
    await page.mouse.up();
    const practiceCircle = page.locator('[data-testid="three-point-circle"]');
    const x0 = Number(await practiceCircle.getAttribute("data-center-x"));
    const y0 = Number(await practiceCircle.getAttribute("data-center-y"));
    const radius = Number(await practiceCircle.getAttribute("data-radius"));
    if (Math.abs(y0) >= 0.08) {
      throw new Error("Practice drag did not place O on the x-axis");
    }
    const values = {
      "Circumcentre x": x0.toFixed(2),
      "Circumcentre y": y0.toFixed(2),
      "Circumcircle radius": radius.toFixed(2),
      "Equation h": x0.toFixed(2),
      "Equation k": y0.toFixed(2),
      "Equation radius squared": (radius * radius).toFixed(2),
    };
    for (const [label, value] of Object.entries(values)) {
      await page.getByRole("textbox", { name: label }).fill(value);
    }
    await page.getByRole("button", { name: "Check Answer" }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct circumcircle construction." })
      .innerText();
  } else if (id === 221) {
    const center = page.locator('[data-testid="compass-center-point"]');
    const centerBefore = await center.getAttribute("cx");
    const centerBox = await center.boundingBox();
    if (!centerBox) throw new Error("Compass center is not draggable");
    await page.mouse.move(
      centerBox.x + centerBox.width / 2,
      centerBox.y + centerBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(centerBox.x - 45, centerBox.y - 40, { steps: 4 });
    await page.mouse.up();
    if ((await center.getAttribute("cx")) === centerBefore) {
      throw new Error("Compass center drag did not move the construction");
    }
    const radiusHandle = page.locator('[data-testid="compass-radius-handle"]');
    const radiusBefore = await page
      .getByRole("slider", { name: "Opening radius" })
      .inputValue();
    const radiusBox = await radiusHandle.boundingBox();
    if (!radiusBox) throw new Error("Compass opening handle is not draggable");
    await page.mouse.move(
      radiusBox.x + radiusBox.width / 2,
      radiusBox.y + radiusBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(radiusBox.x - 55, radiusBox.y + 15, { steps: 4 });
    await page.mouse.up();
    if (
      (await page.getByRole("slider", { name: "Opening radius" }).inputValue()) ===
      radiusBefore
    ) {
      throw new Error("Compass leg drag did not change the opening");
    }
    await page.getByRole("button", { name: "Circle (Center)" }).click();
    await page
      .getByRole("img", {
        name: "Interactive compass plane with draggable center and opening",
      })
      .click({ position: { x: 275, y: 220 } });
    await page.getByRole("button", { name: "Clear" }).click();
    await page.getByRole("button", { name: "Circle (Center)" }).click();
    await page
      .getByRole("img", {
        name: "Interactive compass plane with draggable center and opening",
      })
      .click({ position: { x: 310, y: 220 } });
    await page.getByRole("button", { name: "3", exact: true }).click();
    await page.getByRole("checkbox", { name: "Show radius" }).uncheck();
    await page.getByRole("checkbox", { name: "Show radius" }).check();
    await page.getByRole("button", { name: "Edit center coordinates" }).click();
    await page.getByRole("spinbutton", { name: "Center x" }).fill("2");
    await page.getByRole("spinbutton", { name: "Center y" }).fill("1");
    const practicePoint = page.locator(
      '[data-testid="compass-practice-point-d"]',
    );
    const practiceBox = await practicePoint.boundingBox();
    if (!practiceBox) throw new Error("Compass practice point is not draggable");
    const practicePlane = page.getByRole("img", {
      name: "Compass distance transfer practice plane",
    });
    const practicePlaneBox = await practicePlane.boundingBox();
    if (!practicePlaneBox) throw new Error("Compass practice plane is missing");
    const practiceScale = Math.min(
      practicePlaneBox.width / 480,
      practicePlaneBox.height / 240,
    );
    const practiceTop =
      practicePlaneBox.y + (practicePlaneBox.height - 240 * practiceScale) / 2;
    await page.mouse.move(
      practiceBox.x + practiceBox.width / 2,
      practiceBox.y + practiceBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(
      practicePlaneBox.x + practicePlaneBox.width / 2 + 120 * practiceScale,
      practiceTop + 30 * practiceScale,
      {
      steps: 5,
      },
    );
    await page.mouse.up();
    await page.getByRole("button", { name: "Reset", exact: true }).last().click();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct" })
      .innerText();
  } else if (id === 222) {
    const endpointA = page.locator('[data-testid="semicircle-endpoint-a"]');
    const endpointB = page.locator('[data-testid="semicircle-endpoint-b"]');
    const arc = page.locator('[data-testid="semicircle-arc"]');
    const aBefore = await endpointA.getAttribute("cx");
    const radiusBefore = await arc.getAttribute("data-radius");
    const aBox = await endpointA.boundingBox();
    if (!aBox) throw new Error("Semicircle endpoint A is not draggable");
    await page.mouse.move(aBox.x + aBox.width / 2, aBox.y + aBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(aBox.x + 35, aBox.y - 22, { steps: 4 });
    await page.mouse.up();
    if ((await endpointA.getAttribute("cx")) === aBefore) {
      throw new Error("Dragging A did not update the diameter");
    }
    if ((await arc.getAttribute("data-radius")) === radiusBefore) {
      throw new Error("Dragging A did not recalculate the radius");
    }
    const bBefore = await endpointB.getAttribute("cx");
    const bBox = await endpointB.boundingBox();
    if (!bBox) throw new Error("Semicircle endpoint B is not draggable");
    await page.mouse.move(bBox.x + bBox.width / 2, bBox.y + bBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(bBox.x - 28, bBox.y + 18, { steps: 4 });
    await page.mouse.up();
    if ((await endpointB.getAttribute("cx")) === bBefore) {
      throw new Error("Dragging B did not update the diameter");
    }
    for (const [label, value] of [
      ["A x coordinate", "-6"],
      ["A y coordinate", "0"],
      ["B x coordinate", "6"],
      ["B y coordinate", "0"],
    ]) {
      await page.getByRole("spinbutton", { name: label }).fill(value);
    }
    const upperPath = await arc.getAttribute("d");
    await page.getByRole("button", { name: "Lower semicircle" }).click();
    if ((await arc.getAttribute("d")) === upperPath) {
      throw new Error("Orientation control did not flip the semicircle");
    }
    await page.getByRole("button", { name: "Upper semicircle" }).click();
    await page.getByRole("button", { name: "Show calculations" }).click();
    await page.getByText("r = AB / 2", { exact: false }).waitFor();
    await page.getByRole("button", { name: "Show calculations" }).click();
    await page.getByRole("button", { name: "Move semicircle" }).click();
    const translatedABefore = Number(await endpointA.getAttribute("cx"));
    const translatedBBefore = Number(await endpointB.getAttribute("cx"));
    const translatedRadiusBefore = await arc.getAttribute("data-radius");
    const arcBox = await arc.boundingBox();
    if (!arcBox) throw new Error("Semicircle arc is not movable");
    await page.mouse.move(arcBox.x + arcBox.width / 2, arcBox.y + 8);
    await page.mouse.down();
    await page.mouse.move(arcBox.x + arcBox.width / 2 + 26, arcBox.y + 22, {
      steps: 4,
    });
    await page.mouse.up();
    const translatedAAfter = Number(await endpointA.getAttribute("cx"));
    const translatedBAfter = Number(await endpointB.getAttribute("cx"));
    if (
      Math.abs((translatedAAfter - translatedABefore) - (translatedBAfter - translatedBBefore)) > 0.1 ||
      translatedRadiusBefore !== (await arc.getAttribute("data-radius"))
    ) {
      throw new Error("Move tool did not translate the rigid semicircle");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    const arcPoint = page.locator('[data-testid="semicircle-arc-point"]');
    const arcPointBefore = await arcPoint.getAttribute("cx");
    const arcPointBox = await arcPoint.boundingBox();
    if (!arcPointBox) throw new Error("Semicircle point P is not draggable");
    await page.mouse.move(
      arcPointBox.x + arcPointBox.width / 2,
      arcPointBox.y + arcPointBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(arcPointBox.x + 70, arcPointBox.y + 30, { steps: 5 });
    await page.mouse.up();
    if ((await arcPoint.getAttribute("cx")) === arcPointBefore) {
      throw new Error("Dragging P did not move it along the semicircle");
    }
    if (!(await page.getByTestId("semicircle-thales-angle").innerText()).includes("90.00°")) {
      throw new Error("Thales angle did not remain 90 degrees");
    }
    const practicePoint = page.locator('[data-testid="thales-practice-point"]');
    const practiceBefore = await practicePoint.getAttribute("cx");
    const practiceBox = await practicePoint.boundingBox();
    if (!practiceBox) throw new Error("Thales practice point is not draggable");
    await page.mouse.move(
      practiceBox.x + practiceBox.width / 2,
      practiceBox.y + practiceBox.height / 2,
    );
    await page.mouse.down();
    await page.mouse.move(practiceBox.x + 46, practiceBox.y + 24, { steps: 5 });
    await page.mouse.up();
    if ((await practicePoint.getAttribute("cx")) === practiceBefore) {
      throw new Error("Thales practice drag did not move P");
    }
    await page.getByRole("radio", { name: "It becomes bigger." }).check();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Try moving P" }).waitFor();
    await page.getByRole("radio", { name: "It stays 90°." }).check();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page
      .getByRole("status")
      .filter({ hasText: "Correct Thales theorem." })
      .innerText();
  } else if (id === 223) {
    const arc = page.locator('[data-testid="circular-arc-path"]');
    const center = page.locator('[data-testid="arc-center-point"]');
    const start = page.locator('[data-testid="arc-start-point"]');
    const end = page.locator('[data-testid="arc-end-point"]');
    const centerBefore = Number(await center.getAttribute("cx"));
    const startBeforeCenterDrag = Number(await start.getAttribute("cx"));
    const endBeforeCenterDrag = Number(await end.getAttribute("cx"));
    const radiusBeforeCenterDrag = await arc.getAttribute("data-arc-length");
    const centerBox = await center.boundingBox();
    if (!centerBox) throw new Error("Circular arc center is not draggable");
    await page.mouse.move(centerBox.x + centerBox.width / 2, centerBox.y + centerBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(centerBox.x + 34, centerBox.y - 24, { steps: 5 });
    await page.mouse.up();
    const centerAfter = Number(await center.getAttribute("cx"));
    const startAfterCenterDrag = Number(await start.getAttribute("cx"));
    const endAfterCenterDrag = Number(await end.getAttribute("cx"));
    if (
      centerAfter === centerBefore ||
      Math.abs((centerAfter - centerBefore) - (startAfterCenterDrag - startBeforeCenterDrag)) > 0.1 ||
      Math.abs((centerAfter - centerBefore) - (endAfterCenterDrag - endBeforeCenterDrag)) > 0.1 ||
      radiusBeforeCenterDrag !== (await arc.getAttribute("data-arc-length"))
    ) {
      throw new Error("Dragging O did not translate the complete arc rigidly");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    const angleBeforeStartDrag = await arc.getAttribute("data-central-angle");
    const startBox = await start.boundingBox();
    if (!startBox) throw new Error("Circular arc point A is not draggable");
    await page.mouse.move(startBox.x + startBox.width / 2, startBox.y + startBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(startBox.x - 30, startBox.y + 34, { steps: 5 });
    await page.mouse.up();
    if ((await arc.getAttribute("data-central-angle")) === angleBeforeStartDrag) {
      throw new Error("Dragging A did not recalculate the central angle");
    }
    const angleBeforeEndDrag = await arc.getAttribute("data-central-angle");
    const endBox = await end.boundingBox();
    if (!endBox) throw new Error("Circular arc point B is not draggable");
    await page.mouse.move(endBox.x + endBox.width / 2, endBox.y + endBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(endBox.x + 24, endBox.y - 28, { steps: 5 });
    await page.mouse.up();
    if ((await arc.getAttribute("data-central-angle")) === angleBeforeEndDrag) {
      throw new Error("Dragging B did not recalculate the central angle");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    const initialAngle = Number(await arc.getAttribute("data-central-angle"));
    const initialLength = Number(await arc.getAttribute("data-arc-length"));
    await page.getByRole("slider", { name: "Arc radius" }).fill("6");
    const lengthAtSix = Number(await arc.getAttribute("data-arc-length"));
    if (Math.abs(lengthAtSix / initialLength - 1.2) > 0.01) {
      throw new Error("Radius control did not scale arc length proportionally");
    }
    await page.getByRole("button", { name: "Major arc" }).click();
    const majorAngle = Number(await arc.getAttribute("data-central-angle"));
    if (Math.abs(initialAngle + majorAngle - 360) > 0.01) {
      throw new Error("Major arc did not use the complementary central angle");
    }
    await page.getByRole("button", { name: "Results", exact: true }).click();
    await page.getByText("Calculated results").waitFor();
    await page.getByRole("button", { name: "Controls", exact: true }).click();
    await page.getByRole("button", { name: "Show grid" }).click();
    await page.getByRole("button", { name: "Hide grid" }).click();
    await page.getByRole("button", { name: "Zoom in" }).click();
    await page.getByRole("button", { name: "Zoom out" }).click();
    await page.getByRole("button", { name: "Fit arc view" }).click();
    await page.getByRole("combobox", { name: "Lesson language" }).selectOption({ label: "Hindi (हिन्दी)" });
    await page.getByRole("button", { name: "Hint" }).click();
    await page.getByRole("textbox", { name: "Practice arc length" }).fill("8");
    await page.getByRole("button", { name: "Check answer" }).click();
    await page.getByRole("status").filter({ hasText: "Recheck" }).waitFor();
    await page.getByRole("textbox", { name: "Practice arc length" }).fill((3 * Math.PI).toFixed(3));
    await page.getByRole("button", { name: "Check answer" }).click();
    status = await page.getByRole("status").filter({ hasText: "Correct arc length." }).innerText();
  } else if (id === 224) {
    const circle = page.locator('[data-testid="circumarc-circle"]');
    const arc = page.locator('[data-testid="circumarc-through-a"]');
    const pointA = page.locator('[data-testid="circumarc-point-a"]');
    const pointB = page.locator('[data-testid="circumarc-point-b"]');
    const pointC = page.locator('[data-testid="circumarc-point-c"]');
    const radiusBefore = await circle.getAttribute("data-radius");
    const arcBefore = await arc.getAttribute("data-arc-measure");
    const aBox = await pointA.boundingBox();
    if (!aBox) throw new Error("Circumcircular point A is not draggable");
    await page.mouse.move(aBox.x + aBox.width / 2, aBox.y + aBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(aBox.x + 34, aBox.y + 26, { steps: 5 });
    await page.mouse.up();
    if (
      (await circle.getAttribute("data-radius")) === radiusBefore ||
      (await arc.getAttribute("data-arc-measure")) === arcBefore
    ) {
      throw new Error("Dragging A did not rebuild the circumcircle and arc");
    }
    const bBefore = await pointB.getAttribute("cx");
    const bBox = await pointB.boundingBox();
    if (!bBox) throw new Error("Circumcircular point B is not draggable");
    await page.mouse.move(bBox.x + bBox.width / 2, bBox.y + bBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(bBox.x + 28, bBox.y - 18, { steps: 5 });
    await page.mouse.up();
    if ((await pointB.getAttribute("cx")) === bBefore) {
      throw new Error("Dragging B did not move the endpoint");
    }
    const cBefore = await pointC.getAttribute("cy");
    const cBox = await pointC.boundingBox();
    if (!cBox) throw new Error("Circumcircular point C is not draggable");
    await page.mouse.move(cBox.x + cBox.width / 2, cBox.y + cBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(cBox.x - 20, cBox.y - 25, { steps: 5 });
    await page.mouse.up();
    if ((await pointC.getAttribute("cy")) === cBefore) {
      throw new Error("Dragging C did not move the endpoint");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("spinbutton", { name: "Point A x" }).fill("1");
    await page.getByRole("slider", { name: "Point B y slider" }).fill("-2");
    await page.getByRole("spinbutton", { name: "Point C x" }).fill("5");
    for (const label of [
      "Show center O",
      "Show radii",
      "Show central ∠AOC",
      "Show inscribed ∠ABC",
    ]) {
      const toggle = page.getByRole("checkbox", { name: label });
      await toggle.uncheck({ force: true });
      await toggle.check({ force: true });
    }
    await page.getByRole("button", { name: "Toggle triangle segments" }).click();
    await page.getByRole("button", { name: "Toggle triangle segments" }).click();
    await page.getByRole("button", { name: "Toggle circumcircle" }).click();
    await page.getByRole("button", { name: "Toggle circumcircle" }).click();
    const grid = page.getByRole("checkbox", { name: "Circumcircle grid" });
    await grid.check();
    await grid.uncheck();
    await page.getByRole("button", { name: "Remove point C" }).click();
    if ((await page.locator('[data-testid="circumarc-circle"]').count()) !== 0) {
      throw new Error("Removing A did not invalidate the circumcircle");
    }
    await page
      .getByRole("img", {
        name: "Interactive circumcircular arc through draggable points A B and C",
      })
      .click({ position: { x: 290, y: 115 } });
    await page.locator('[data-testid="circumarc-circle"]').waitFor();
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("button", { name: "Replay Steps" }).click();
    await page.getByRole("button", { name: "Replay Steps" }).waitFor({ timeout: 5_000 });
    await page
      .getByRole("combobox", { name: "Circumcircular arc language" })
      .selectOption({ label: "Hindi (हिन्दी)" });
    await page.getByRole("textbox", { name: "Practice arc measure" }).fill("100");
    await page.getByRole("textbox", { name: "Practice inscribed angle" }).fill("70");
    await page.getByRole("button", { name: "Check relationship" }).click();
    await page.getByRole("status").filter({ hasText: "divide the arc by 2" }).waitFor();
    await page.getByRole("textbox", { name: "Practice arc measure" }).fill("120");
    await page.getByRole("textbox", { name: "Practice inscribed angle" }).fill("60");
    await page.getByRole("button", { name: "Check relationship" }).click();
    status = await page.getByRole("status").filter({ hasText: "Well done!" }).innerText();
    await page.getByRole("button", { name: "New Challenge" }).click();
    if ((await page.getByRole("textbox", { name: "Practice arc measure" }).inputValue()) !== "80.00") {
      throw new Error("New Challenge did not load a new theorem target");
    }
  } else if (id === 225) {
    const fill = page.locator('[data-testid="sector-fill"]');
    const arc = page.locator('[data-testid="sector-arc"]');
    const radiusHandle = page.locator('[data-testid="sector-radius-handle"]');
    const angleHandle = page.locator('[data-testid="sector-angle-handle"]');
    const centerHandle = page.locator('[data-testid="sector-center-handle"]');
    const areaBefore = await fill.getAttribute("data-area");
    const radiusBox = await radiusHandle.boundingBox();
    if (!radiusBox) throw new Error("Sector radius handle is not draggable");
    await page.mouse.move(radiusBox.x + radiusBox.width / 2, radiusBox.y + radiusBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(radiusBox.x + 34, radiusBox.y, { steps: 5 });
    await page.mouse.up();
    if ((await fill.getAttribute("data-area")) === areaBefore) {
      throw new Error("Dragging the radius handle did not recalculate sector area");
    }
    const arcBefore = await arc.getAttribute("data-arc-length");
    const angleBox = await angleHandle.boundingBox();
    if (!angleBox) throw new Error("Sector angle handle is not draggable");
    await page.mouse.move(angleBox.x + angleBox.width / 2, angleBox.y + angleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(angleBox.x - 26, angleBox.y + 34, { steps: 5 });
    await page.mouse.up();
    if ((await arc.getAttribute("data-arc-length")) === arcBefore) {
      throw new Error("Dragging the angle handle did not recalculate arc length");
    }
    const centerBefore = await centerHandle.getAttribute("cx");
    const centerBox = await centerHandle.boundingBox();
    if (!centerBox) throw new Error("Sector center handle is not draggable");
    await page.mouse.move(centerBox.x + centerBox.width / 2, centerBox.y + centerBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(centerBox.x + 28, centerBox.y - 18, { steps: 5 });
    await page.mouse.up();
    if ((await centerHandle.getAttribute("cx")) === centerBefore) {
      throw new Error("Dragging the sector center did not translate the model");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("slider", { name: "Sector radius slider", exact: true }).fill("8");
    await page.getByRole("spinbutton", { name: "Sector central angle", exact: true }).fill("135");
    await page.getByRole("button", { name: "Try this example" }).click();
    if (
      (await page.getByRole("spinbutton", { name: "Sector radius", exact: true }).inputValue()) !== "6" ||
      (await page.getByRole("spinbutton", { name: "Sector central angle", exact: true }).inputValue()) !== "90"
    ) {
      throw new Error("Worked example did not load r=6 and theta=90");
    }
    await page.getByRole("button", { name: "Hide handles" }).click();
    if ((await page.locator('[data-testid="sector-radius-handle"]').count()) !== 0) {
      throw new Error("Hide handles did not remove the drag handles");
    }
    await page.getByRole("button", { name: "Show handles" }).click();
    await page.getByRole("button", { name: "Try Independently" }).click();
    await page.getByRole("button", { name: "Observe & Manipulate" }).click();
    await page.getByRole("spinbutton", { name: "Practice sector radius" }).fill("5");
    await page.getByRole("spinbutton", { name: "Practice sector angle" }).fill("100");
    await page.getByRole("button", { name: "Check Answer" }).click();
    await page.getByRole("status").filter({ hasText: "Match both target values." }).waitFor();
    await page.getByRole("spinbutton", { name: "Practice sector radius" }).fill("7");
    await page.getByRole("spinbutton", { name: "Practice sector angle" }).fill("120");
    await page.getByRole("button", { name: "Check Answer" }).click();
    await page.getByRole("status").filter({ hasText: "Angle: 120°" }).waitFor();
    status = "Correct circular sector target.";
  } else if (id === 226) {
    const path = page.locator('[data-testid="five-point-conic-path"]');
    if ((await path.getAttribute("data-classification")) !== "ellipse") {
      throw new Error("Initial five-point system did not solve to an ellipse");
    }
    const pathBefore = await path.getAttribute("d");
    const point1 = page.locator('[data-testid="conic-point-1"]');
    const point1Box = await point1.boundingBox();
    if (!point1Box) throw new Error("Conic point P1 is not draggable");
    await page.mouse.move(point1Box.x + point1Box.width / 2, point1Box.y + point1Box.height / 2);
    await page.mouse.down();
    await page.mouse.move(point1Box.x + 34, point1Box.y - 22, { steps: 6 });
    await page.mouse.up();
    if ((await path.getAttribute("d")) === pathBefore) {
      throw new Error("Dragging P1 did not resolve the conic coefficients");
    }
    const point4 = page.locator('[data-testid="conic-point-4"]');
    const point4Before = await point4.getAttribute("cy");
    const point4Box = await point4.boundingBox();
    if (!point4Box) throw new Error("Conic point P4 is not draggable");
    await page.mouse.move(point4Box.x + point4Box.width / 2, point4Box.y + point4Box.height / 2);
    await page.mouse.down();
    await page.mouse.move(point4Box.x + 15, point4Box.y + 28, { steps: 5 });
    await page.mouse.up();
    if ((await point4.getAttribute("cy")) === point4Before) {
      throw new Error("Dragging P4 did not move its independent constraint");
    }
    await page.getByRole("spinbutton", { name: "Conic point 2 x" }).fill("3.5");
    await page.getByRole("spinbutton", { name: "Conic point 3 y" }).fill("-2");
    await page.getByRole("button", { name: "Zoom in conic" }).click();
    await page.getByRole("button", { name: "Zoom out conic" }).click();
    await page.getByRole("button", { name: "Fit conic view" }).click();
    await page.getByRole("button", { name: "Try Independently" }).click();
    await page.getByRole("button", { name: "Observe & Manipulate" }).click();
    await page.getByRole("combobox", { name: "Conic lesson language" }).selectOption({ label: "Hindi (हिन्दी)" });
    await page.getByRole("button", { name: "Clear all" }).click();
    if ((await page.locator('[data-testid^="conic-point-"]').count()) !== 0) {
      throw new Error("Clear all did not remove all five point constraints");
    }
    const plot = page.getByRole("img", { name: "Five draggable points and their solved general conic" });
    for (const position of [
      { x: 150, y: 130 },
      { x: 330, y: 95 },
      { x: 400, y: 260 },
      { x: 280, y: 360 },
      { x: 110, y: 300 },
    ]) await plot.click({ position });
    if ((await page.locator('[data-testid^="conic-point-"]').count()) !== 5) {
      throw new Error("Point tool did not rebuild five independent constraints");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("button", { name: "Load points" }).click();
    if ((await path.getAttribute("data-classification")) !== "parabola") {
      throw new Error("Practice points did not solve to the requested parabola");
    }
    status = "Correct five-point parabola classification.";
  } else if (id === 227) {
    const locus = page.locator('[data-testid="ellipse-locus"]');
    const point = page.locator('[data-testid="ellipse-point"]');
    const focus2 = page.locator('[data-testid="ellipse-focus-2"]');
    const center = page.locator('[data-testid="ellipse-center"]');
    const sum = page.locator('[data-testid="ellipse-focal-sum"]');
    const thetaBefore = await point.getAttribute("data-theta");
    const pointBox = await point.boundingBox();
    if (!pointBox) throw new Error("Ellipse point P is not draggable");
    await page.mouse.move(pointBox.x + pointBox.width / 2, pointBox.y + pointBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(pointBox.x - 42, pointBox.y + 31, { steps: 6 });
    await page.mouse.up();
    if ((await point.getAttribute("data-theta")) === thetaBefore) {
      throw new Error("Dragging P did not change its ellipse parameter");
    }
    if ((await sum.innerText()) !== "12.00") {
      throw new Error("Dragging P broke the two-focus constant-sum invariant");
    }
    const bBefore = await locus.getAttribute("data-b");
    const focusBox = await focus2.boundingBox();
    if (!focusBox) throw new Error("Ellipse focus F2 is not draggable");
    await page.mouse.move(focusBox.x + focusBox.width / 2, focusBox.y + focusBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(focusBox.x + 35, focusBox.y, { steps: 5 });
    await page.mouse.up();
    if ((await locus.getAttribute("data-b")) === bBefore) {
      throw new Error("Dragging a focus did not recalculate the minor semi-axis");
    }
    const centerBefore = await locus.getAttribute("cx");
    const centerBox = await center.boundingBox();
    if (!centerBox) throw new Error("Ellipse center O is not draggable");
    await page.mouse.move(centerBox.x + centerBox.width / 2, centerBox.y + centerBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(centerBox.x + 24, centerBox.y - 18, { steps: 5 });
    await page.mouse.up();
    if ((await locus.getAttribute("cx")) === centerBefore) {
      throw new Error("Dragging O did not translate the ellipse");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("spinbutton", { name: "Ellipse semi-major axis" }).fill("7");
    await page.getByRole("spinbutton", { name: "Ellipse focus distance" }).fill("3.5");
    await page.getByRole("slider", { name: "Ellipse eccentricity slider" }).fill("0.6");
    await page.getByRole("spinbutton", { name: "Ellipse focus distance" }).fill("3.5");
    for (const label of ["Axes", "Major/Minor Axes", "Grid"]) {
      const toggle = page.getByRole("checkbox", { name: label, exact: true });
      await toggle.uncheck();
      await toggle.check();
    }
    await page.getByRole("button", { name: "Practice Try independently", exact: true }).click();
    await page.getByRole("button", { name: "Observe See the model", exact: true }).click();
    await page.getByRole("textbox", { name: "Ellipse practice sum" }).fill("10");
    await page.getByRole("button", { name: "Check", exact: true }).nth(0).click();
    await page.locator('.target-ellipse-practice output').nth(0).filter({ hasText: "Try again" }).waitFor();
    await page.getByRole("textbox", { name: "Ellipse practice sum" }).fill("14");
    await page.getByRole("textbox", { name: "Ellipse practice minor" }).fill("6.06");
    await page.getByRole("textbox", { name: "Ellipse practice eccentricity" }).fill("0.5");
    for (let index = 0; index < 3; index += 1) await page.getByRole("button", { name: "Check", exact: true }).nth(index).click();
    if ((await page.locator('.target-ellipse-practice output').filter({ hasText: "Correct" }).count()) !== 3) {
      throw new Error("Ellipse practice did not grade all three derived values");
    }
    await page.getByRole("button", { name: "Need a hint? Show solution formula" }).click();
    await page.getByText("Use PF₁ + PF₂ = 2a").waitFor();
    await page.getByRole("button", { name: "New Task" }).click();
    await page.getByText("Set a = 8 and c = 4.8").waitFor();
    status = "Correct ellipse focal invariant and practice.";
  } else if (id === 228) {
    const branch = page.locator('[data-testid="hyperbola-right-branch"]');
    const point = page.locator('[data-testid="hyperbola-point"]');
    const focus2 = page.locator('[data-testid="hyperbola-focus-2"]');
    const center = page.locator('[data-testid="hyperbola-center"]');
    const difference = page.locator('[data-testid="hyperbola-focal-difference"]');
    const uBefore = await point.getAttribute("data-u");
    const pointBox = await point.boundingBox();
    if (!pointBox) throw new Error("Hyperbola point P is not draggable");
    await page.mouse.move(pointBox.x + pointBox.width / 2, pointBox.y + pointBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(pointBox.x + 20, pointBox.y + 38, { steps: 6 });
    await page.mouse.up();
    if ((await point.getAttribute("data-u")) === uBefore) {
      throw new Error("Dragging P did not change its branch parameter");
    }
    if ((await difference.innerText()) !== "6.000") {
      throw new Error("Dragging P broke the constant focal-difference invariant");
    }
    const bBefore = await branch.getAttribute("data-b");
    const focusBox = await focus2.boundingBox();
    if (!focusBox) throw new Error("Hyperbola focus F2 is not draggable");
    await page.mouse.move(focusBox.x + focusBox.width / 2, focusBox.y + focusBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(focusBox.x + 32, focusBox.y, { steps: 5 });
    await page.mouse.up();
    if ((await branch.getAttribute("data-b")) === bBefore) {
      throw new Error("Dragging a focus did not recalculate b");
    }
    const centerBefore = await center.getAttribute("cx");
    const centerBox = await center.boundingBox();
    if (!centerBox) throw new Error("Hyperbola center is not draggable");
    await page.mouse.move(centerBox.x + centerBox.width / 2, centerBox.y + centerBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(centerBox.x + 25, centerBox.y - 20, { steps: 5 });
    await page.mouse.up();
    if ((await center.getAttribute("cx")) === centerBefore) {
      throw new Error("Dragging the center did not translate the hyperbola");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("spinbutton", { name: "Hyperbola right focus" }).fill("5");
    await page.getByRole("slider", { name: "Hyperbola left focus slider" }).fill("-4.5");
    const asymptotes = page.getByRole("checkbox", { name: "Show asymptotes" });
    await asymptotes.uncheck();
    if ((await page.locator('[data-testid="hyperbola-asymptote"]').count()) !== 0) throw new Error("Asymptote toggle did not hide both guides");
    await asymptotes.check();
    const snap = page.getByRole("checkbox", { name: "Snap to grid" });
    await snap.check(); await snap.uncheck();
    await page.getByRole("button", { name: "Hide details" }).click();
    await page.getByRole("button", { name: "Show details" }).click();
    await page.getByRole("button", { name: /Observe What is a hyperbola\?/ }).click();
    await page.getByRole("button", { name: /Manipulate Drag to explore/ }).click();
    await page.getByRole("combobox", { name: "Hyperbola lesson language" }).selectOption({ label: "Hindi (हिन्दी)" });
    await page.getByRole("button", { name: "View worked example" }).click();
    await page.getByText("For a = 3 and c = 4").waitFor();
    await page.getByRole("spinbutton", { name: "Practice hyperbola semi-axis" }).fill("2.5");
    await page.getByRole("textbox", { name: "Practice focal difference" }).fill("4");
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Use the constant 2a" }).waitFor();
    await page.getByRole("spinbutton", { name: "Practice hyperbola semi-axis" }).fill("2");
    await page.getByRole("checkbox", { name: "Move P toward" }).check();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page.getByRole("status").filter({ hasText: "Correct: the difference is 2a." }).innerText();
  } else if (id === 229) {
    const locus = page.locator('[data-testid="parabola-locus"]');
    const point = page.locator('[data-testid="parabola-point"]');
    const focus = page.locator('[data-testid="parabola-focus"]');
    const directrix = page.locator('[data-testid="parabola-directrix-handle"]');
    const equality = page.locator('[data-testid="parabola-distance-equality"]');
    const pointBefore = await point.getAttribute("data-x");
    const pointBox = await point.boundingBox();
    if (!pointBox) throw new Error("Parabola point P is not draggable");
    await page.mouse.move(pointBox.x + pointBox.width / 2, pointBox.y + pointBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(pointBox.x + 38, pointBox.y, { steps: 6 });
    await page.mouse.up();
    if ((await point.getAttribute("data-x")) === pointBefore) {
      throw new Error("Dragging P did not move it along the parabola");
    }
    const distances = (await equality.innerText()).split("=").map(Number);
    if (distances.length !== 2 || Math.abs(distances[0] - distances[1]) > 0.01) {
      throw new Error("Dragging P broke the focus-directrix equality");
    }
    const pBeforeFocus = await locus.getAttribute("data-p");
    const focusBox = await focus.boundingBox();
    if (!focusBox) throw new Error("Parabola focus is not draggable");
    await page.mouse.move(focusBox.x + focusBox.width / 2, focusBox.y + focusBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(focusBox.x + 25, focusBox.y - 28, { steps: 5 });
    await page.mouse.up();
    if ((await locus.getAttribute("data-p")) === pBeforeFocus) {
      throw new Error("Dragging the focus did not recalculate the focal parameter");
    }
    const pBeforeDirectrix = await locus.getAttribute("data-p");
    const directrixBox = await directrix.boundingBox();
    if (!directrixBox) throw new Error("Parabola directrix is not draggable");
    await page.mouse.move(directrixBox.x + directrixBox.width / 2, directrixBox.y);
    await page.mouse.down();
    await page.mouse.move(directrixBox.x + directrixBox.width / 2, directrixBox.y + 22, { steps: 5 });
    await page.mouse.up();
    if ((await locus.getAttribute("data-p")) === pBeforeDirectrix) {
      throw new Error("Dragging the directrix did not recalculate the parabola");
    }
    await page.locator('.target-parabola-header').getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("spinbutton", { name: "Parabola focus x", exact: true }).fill("1");
    await page.getByRole("spinbutton", { name: "Parabola focus y", exact: true }).fill("3");
    await page.getByRole("spinbutton", { name: "Parabola directrix", exact: true }).fill("-1");
    if ((await locus.getAttribute("data-p")) !== "2.000000") {
      throw new Error("Exact focus/directrix inputs did not update the model");
    }
    await page.getByRole("spinbutton", { name: "Parabola trace x" }).fill("2");
    await page.getByRole("spinbutton", { name: "Parabola trace y" }).fill("4");
    await page.getByRole("button", { name: "Reset P to parabola" }).click();
    for (const [name, testId] of [["Axes", "parabola-axes"], ["Trace", "parabola-trace"]]) {
      await page.getByRole("button", { name, exact: true }).click();
      if ((await page.locator(`[data-testid="${testId}"]`).count()) !== 0) throw new Error(`${name} toggle did not hide its layer`);
      await page.getByRole("button", { name, exact: true }).click();
    }
    await page.getByRole("button", { name: "Grid", exact: true }).click();
    if ((await page.locator('[data-testid="parabola-grid"]').getAttribute("fill")) !== "white") {
      throw new Error("Grid toggle did not hide the grid");
    }
    await page.getByRole("button", { name: "Grid", exact: true }).click();
    await page.getByRole("button", { name: "Zoom in parabola" }).click();
    await page.getByRole("button", { name: "Zoom out parabola" }).click();
    await page.getByRole("button", { name: "Fit parabola" }).click();
    await page.getByRole("button", { name: /2 Manipulate/ }).click();
    await page.getByRole("button", { name: "Understand", exact: true }).click();
    await page.getByRole("button", { name: "Share", exact: true }).click();
    await page.getByRole("spinbutton", { name: "Practice parabola focus x" }).fill("-1");
    await page.getByRole("spinbutton", { name: "Practice parabola focus y" }).fill("1");
    await page.getByRole("spinbutton", { name: "Practice parabola directrix" }).fill("-1");
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Match the focus and directrix." }).waitFor();
    await page.getByRole("spinbutton", { name: "Practice parabola focus y" }).fill("3");
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page.getByRole("status").filter({ hasText: "Construction correct." }).innerText();
  } else if (id === 230) {
    const segment = page.locator('[data-testid="distance-segment"]');
    const pointA = page.locator('[data-testid="distance-point-a"]');
    const pointB = page.locator('[data-testid="distance-point-b"]');
    const initialDistance = await segment.getAttribute("data-distance");
    if (initialDistance !== "7.810250") {
      throw new Error(`Distance initial model was ${initialDistance}, expected sqrt(61)`);
    }
    const aBox = await pointA.boundingBox();
    if (!aBox) throw new Error("Distance point A is not draggable");
    await page.mouse.move(aBox.x + aBox.width / 2, aBox.y + aBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(aBox.x + 28, aBox.y - 18, { steps: 6 });
    await page.mouse.up();
    if ((await segment.getAttribute("data-distance")) === initialDistance) {
      throw new Error("Dragging point A did not recalculate distance");
    }
    const afterA = await segment.getAttribute("data-distance");
    const bBox = await pointB.boundingBox();
    if (!bBox) throw new Error("Distance point B is not draggable");
    await page.mouse.move(bBox.x + bBox.width / 2, bBox.y + bBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(bBox.x - 24, bBox.y + 20, { steps: 6 });
    await page.mouse.up();
    if ((await segment.getAttribute("data-distance")) === afterA) {
      throw new Error("Dragging point B did not recalculate distance");
    }
    await page.getByRole("spinbutton", { name: "Point A x coordinate" }).fill("-3");
    await page.getByRole("spinbutton", { name: "Point A y coordinate" }).fill("-1");
    await page.getByRole("spinbutton", { name: "Point B x coordinate" }).fill("3");
    await page.getByRole("spinbutton", { name: "Point B y coordinate" }).fill("3");
    if ((await segment.getAttribute("data-distance")) !== "7.211103") {
      throw new Error("Exact endpoint editors did not produce sqrt(52)");
    }
    await page.getByRole("button", { name: "Reset Point A" }).click();
    await page.getByRole("button", { name: "Reset Point B" }).click();
    await page.getByRole("combobox", { name: "Distance units" }).selectOption("cm");
    if (!(await page.locator('[data-testid="distance-primary-value"]').innerText()).includes("78.10")) {
      throw new Error("Distance unit conversion did not update");
    }
    await page.getByRole("combobox", { name: "Distance units" }).selectOption("units");
    await page.getByRole("button", { name: "Show Δx, Δy" }).click();
    if ((await page.locator('[data-testid="distance-component-guides"]').count()) !== 0) {
      throw new Error("Component toggle did not hide the guides");
    }
    await page.getByRole("button", { name: "Show Δx, Δy" }).click();
    await page.getByRole("button", { name: "Midpoint", exact: true }).click();
    await page.locator('[data-testid="distance-midpoint"]').waitFor();
    await page.getByRole("button", { name: "Perpendicular", exact: true }).click();
    if ((await page.locator('[data-testid="distance-perpendicular"]').count()) !== 1) {
      throw new Error("Perpendicular tool did not add its construction");
    }
    await page.getByRole("button", { name: "Point", exact: true }).click();
    if ((await page.locator('[data-testid="distance-point-a"]').count()) !== 0) {
      throw new Error("Point construction mode did not start a new point pair");
    }
    const plane = page.getByRole("img", { name: "Coordinate plane with draggable distance endpoints A and B" });
    await plane.click({ position: { x: 120, y: 275 } });
    await plane.click({ position: { x: 325, y: 145 } });
    if ((await page.locator('[data-testid="distance-point-b"]').count()) !== 1) {
      throw new Error("Point tool did not construct two endpoints");
    }
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    if ((await page.locator('[data-testid="distance-segment"]').count()) !== 0) {
      throw new Error("Clear did not remove the measured segment");
    }
    await page.getByRole("button", { name: "Reset Point A" }).click();
    await page.getByRole("button", { name: "Reset Point B" }).click();
    await page.getByRole("combobox", { name: "Distance grid spacing" }).selectOption("2");
    await page.getByRole("button", { name: "Reset view" }).click();
    if ((await page.getByRole("combobox", { name: "Distance grid spacing" }).inputValue()) !== "1") {
      throw new Error("Reset view did not restore unit grid spacing");
    }
    await page.getByRole("button", { name: "Quick reference" }).click();
    await page.getByRole("note").waitFor();
    await page.getByRole("button", { name: /2 Manipulate Change it/ }).click();
    const practicePoint = page.locator('[data-testid="practice-distance-point-p"]');
    const practiceBefore = await practicePoint.getAttribute("data-x");
    const practiceDistanceBefore = await page.locator('[data-testid="practice-distance-value"]').innerText();
    const practiceBox = await practicePoint.boundingBox();
    if (!practiceBox) throw new Error("Practice distance point P is not draggable");
    await page.mouse.move(practiceBox.x + practiceBox.width / 2, practiceBox.y + practiceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(practiceBox.x + 22, practiceBox.y - 15, { steps: 5 });
    await page.mouse.up();
    if ((await practicePoint.getAttribute("data-x")) === practiceBefore ||
        (await page.locator('[data-testid="practice-distance-value"]').innerText()) === practiceDistanceBefore) {
      throw new Error("Dragging practice P did not update the exact distance");
    }
    await page.getByRole("spinbutton", { name: "Distance estimate" }).fill("1");
    await page.getByRole("radio", { name: "Very close (±0.5)" }).check();
    await page.getByRole("status").filter({ hasText: "Reconsider how close" }).waitFor();
    const challengeBefore = await page.locator('[data-testid="practice-distance-value"]').innerText();
    await page.getByRole("button", { name: "New challenge" }).click();
    if ((await page.locator('[data-testid="practice-distance-value"]').innerText()) === challengeBefore) {
      throw new Error("New challenge did not replace the practice point pair");
    }
    status = "Correct two-endpoint distance model and independent practice.";
  } else if (id === 231) {
    const polygon = page.locator('[data-testid="area-polygon"]');
    const initialArea = await polygon.getAttribute("data-area");
    const initialPerimeter = await polygon.getAttribute("data-perimeter");
    if (initialArea !== "18.000000") {
      throw new Error(`Area initial model was ${initialArea}, expected 18`);
    }
    const vertexA = page.locator('[data-testid="area-vertex-0"]');
    const aBefore = await vertexA.getAttribute("data-x");
    const aBox = await vertexA.boundingBox();
    if (!aBox) throw new Error("Area vertex A is not draggable");
    await page.mouse.move(aBox.x + aBox.width / 2, aBox.y + aBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(aBox.x - 35, aBox.y + 24, { steps: 7 });
    await page.mouse.up();
    if ((await vertexA.getAttribute("data-x")) === aBefore) {
      throw new Error("Dragging area vertex A did not reshape the polygon");
    }
    if ((await polygon.getAttribute("data-area")) !== initialArea) {
      throw new Error("Dragging area vertex A broke the shoelace invariant");
    }
    if ((await polygon.getAttribute("data-perimeter")) === initialPerimeter) {
      throw new Error("Area-preserving drag did not change polygon perimeter");
    }
    const vertexC = page.locator('[data-testid="area-vertex-2"]');
    const cBox = await vertexC.boundingBox();
    if (!cBox) throw new Error("Area vertex C is not draggable");
    await page.mouse.move(cBox.x + cBox.width / 2, cBox.y + cBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(cBox.x + 28, cBox.y - 18, { steps: 6 });
    await page.mouse.up();
    if ((await polygon.getAttribute("data-area")) !== initialArea) {
      throw new Error("Dragging area vertex C broke the shoelace invariant");
    }
    const squares = page.getByRole("checkbox", { name: "Show unit squares" });
    await squares.uncheck();
    if ((await page.locator('[data-testid="area-unit-grid"]').getAttribute("data-visible")) !== "false") {
      throw new Error("Unit-square toggle did not update the coordinate grid");
    }
    await squares.check();
    await page.getByRole("button", { name: "Check invariance" }).click();
    await page.getByRole("status").filter({ hasText: "Area invariant verified." }).waitFor();
    await page.getByRole("combobox", { name: "Area measurement units" }).selectOption("cm²");
    await page.getByRole("button", { name: "Explain", exact: true }).click();
    await page.getByRole("button", { name: "Share", exact: true }).click();
    await page.getByRole("button", { name: "Bookmark Area lesson" }).click();
    await page.getByRole("button", { name: "Remove Area bookmark" }).waitFor();
    await page.getByRole("button", { name: "Polygon", exact: true }).click();
    const areaPlane = page.getByRole("img", { name: "Area-preserving draggable quadrilateral on a coordinate grid" });
    await areaPlane.click({ position: { x: 55, y: 310 } });
    await areaPlane.click({ position: { x: 170, y: 85 } });
    await areaPlane.click({ position: { x: 410, y: 95 } });
    await areaPlane.click({ position: { x: 390, y: 300 } });
    if ((await page.locator('[data-testid="area-vertex-3"]').count()) !== 1) {
      throw new Error("Polygon tool did not construct four vertices");
    }
    const constructedArea = await polygon.getAttribute("data-area");
    if (!constructedArea || Number(constructedArea) <= 0) {
      throw new Error("Constructed polygon did not produce a valid area");
    }
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    if ((await polygon.getAttribute("data-area")) !== "18.000000") {
      throw new Error("Area reset did not restore the target quadrilateral");
    }
    const practicePolygon = page.locator('[data-testid="practice-area-polygon"]');
    const practiceAreaBefore = await practicePolygon.getAttribute("data-area");
    const practicePerimeterBefore = await practicePolygon.getAttribute("data-perimeter");
    const practiceVertex = page.locator('[data-testid="practice-area-vertex-1"]');
    const practiceBox = await practiceVertex.boundingBox();
    if (!practiceBox) throw new Error("Practice area vertex is not draggable");
    await page.mouse.move(practiceBox.x + practiceBox.width / 2, practiceBox.y + practiceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(practiceBox.x + 24, practiceBox.y + 15, { steps: 6 });
    await page.mouse.up();
    if ((await practicePolygon.getAttribute("data-area")) !== practiceAreaBefore) {
      throw new Error("Practice reshaping broke the area invariant");
    }
    if ((await practicePolygon.getAttribute("data-perimeter")) === practicePerimeterBefore) {
      throw new Error("Practice reshaping did not change perimeter");
    }
    await page.getByRole("spinbutton", { name: "Practice polygon area" }).fill("1");
    await page.getByRole("spinbutton", { name: "Practice polygon perimeter" }).fill("1");
    await page.getByRole("button", { name: "Submit observation" }).click();
    await page.getByRole("status").filter({ hasText: "Recheck both measurements." }).waitFor();
    await page.getByRole("spinbutton", { name: "Practice polygon area" }).fill(String(Number(await practicePolygon.getAttribute("data-area")).toFixed(2)));
    await page.getByRole("spinbutton", { name: "Practice polygon perimeter" }).fill(String(Number(await practicePolygon.getAttribute("data-perimeter")).toFixed(2)));
    await page.getByRole("button", { name: "Submit observation" }).click();
    await page.getByRole("status").filter({ hasText: "Observation correct." }).waitFor();
    const beforeNewPolygon = await practicePolygon.getAttribute("data-area");
    await page.getByRole("button", { name: "New polygon" }).click();
    if ((await practicePolygon.getAttribute("data-area")) === beforeNewPolygon) {
      throw new Error("New polygon did not replace the practice construction");
    }
    await page.getByRole("checkbox", { name: "Don’t show again" }).click();
    if ((await page.locator('.target-area-tip').count()) !== 0) {
      throw new Error("Tip preference did not hide the practice tip");
    }
    status = "Correct area-preserving shoelace and practice models.";
  } else if (id === 232) {
    const measurement = page.locator('[data-testid="angle-measurement"]');
    const pointA = page.locator('[data-testid="angle-point-a"]');
    const pointB = page.locator('[data-testid="angle-point-b"]');
    const pointC = page.locator('[data-testid="angle-point-c"]');
    if ((await measurement.innerText()) !== "55.0°") {
      throw new Error("Angle initial model did not measure 55 degrees");
    }
    const cBefore = await pointC.getAttribute("data-x");
    const cBox = await pointC.boundingBox();
    if (!cBox) throw new Error("Angle point C is not draggable");
    await page.mouse.move(cBox.x + cBox.width / 2, cBox.y + cBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(cBox.x + 32, cBox.y + 25, { steps: 6 });
    await page.mouse.up();
    if ((await pointC.getAttribute("data-x")) === cBefore ||
        (await measurement.innerText()) === "55.0°") {
      throw new Error("Dragging point C did not recalculate the angle");
    }
    const afterC = await measurement.innerText();
    const bBox = await pointB.boundingBox();
    if (!bBox) throw new Error("Angle point B is not draggable");
    await page.mouse.move(bBox.x + bBox.width / 2, bBox.y + bBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(bBox.x - 20, bBox.y - 34, { steps: 6 });
    await page.mouse.up();
    if ((await measurement.innerText()) === afterC) {
      throw new Error("Dragging point B did not rotate the base ray");
    }
    const angleBeforeTranslation = await measurement.innerText();
    const aBefore = await pointA.getAttribute("data-x");
    const aBox = await pointA.boundingBox();
    if (!aBox) throw new Error("Angle vertex A is not draggable");
    await page.mouse.move(aBox.x + aBox.width / 2, aBox.y + aBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(aBox.x + 25, aBox.y - 18, { steps: 5 });
    await page.mouse.up();
    if ((await pointA.getAttribute("data-x")) === aBefore) {
      throw new Error("Dragging A did not translate the angle");
    }
    if ((await measurement.innerText()) !== angleBeforeTranslation) {
      throw new Error("Translating vertex A changed the angle measure");
    }
    await page.locator('.target-angle-main').getByRole("button", { name: "Reset", exact: true }).click();
    await page.getByRole("button", { name: "Protractor", exact: true }).click();
    await page.locator('[data-testid="angle-protractor"]').first().waitFor();
    await page.getByRole("button", { name: "Grid", exact: true }).click();
    if ((await page.locator('[data-testid="angle-grid-layer"]').getAttribute("data-visible")) !== "false") {
      throw new Error("Angle grid toggle did not hide the grid");
    }
    await page.getByRole("button", { name: "Grid", exact: true }).click();
    await page.getByRole("button", { name: /^Right/ }).click();
    if ((await measurement.innerText()) !== "90.0°") throw new Error("Right preset did not construct 90 degrees");
    await page.getByRole("button", { name: /^Obtuse/ }).click();
    if ((await measurement.innerText()) !== "120.0°") throw new Error("Obtuse preset did not construct 120 degrees");
    await page.getByRole("button", { name: /^Straight/ }).click();
    if ((await measurement.innerText()) !== "180.0°") throw new Error("Straight preset did not construct 180 degrees");
    await page.getByRole("button", { name: /^Reflex 180/ }).click();
    if ((await measurement.innerText()) !== "235.0°") throw new Error("Reflex preset did not construct 235 degrees");
    await page.getByRole("button", { name: "Small angle", exact: true }).click();
    if ((await measurement.innerText()) !== "125.0°") throw new Error("Small-angle mode did not select the complementary measure");
    await page.getByRole("button", { name: "Reflex angle", exact: true }).click();
    const layerChecks = [
      ["Show angle arc", "angle-arc"],
      ["Show ray AB", "angle-ray-ab"],
      ["Show ray AC", "angle-ray-ac"],
      ["Show labels", "angle-point-label"],
    ];
    for (const [name, testId] of layerChecks) {
      const toggle = page.getByRole("checkbox", { name });
      await toggle.uncheck();
      if ((await page.locator(`[data-testid="${testId}"]`).count()) !== 0) {
        throw new Error(`${name} did not hide its SVG layer`);
      }
      await toggle.check();
    }
    await page.getByRole("button", { name: "Copy point A" }).click();
    await page.getByRole("status").filter({ hasText: "Point A copied." }).waitFor();
    await page.getByRole("button", { name: "Bookmark Angle lesson" }).click();
    await page.getByRole("button", { name: "Remove Angle bookmark" }).waitFor();
    await page.getByRole("button", { name: /3 Notice Find the pattern/ }).click();
    await page.getByRole("button", { name: "Go to angle step 5" }).click();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Adjust ray AC closer to 120°." }).waitFor();
    const practicePoint = page.locator('[data-testid="practice-angle-point-c"]');
    const practiceSvg = page.getByRole("img", { name: "Practice protractor with draggable ray C" });
    const practicePointBox = await practicePoint.boundingBox();
    const practiceSvgBox = await practiceSvg.boundingBox();
    if (!practicePointBox || !practiceSvgBox) throw new Error("Practice angle handle is not draggable");
    await page.mouse.move(practicePointBox.x + practicePointBox.width / 2, practicePointBox.y + practicePointBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      practiceSvgBox.x + (22 / 280) * practiceSvgBox.width,
      practiceSvgBox.y + (30 / 180) * practiceSvgBox.height,
      { steps: 8 },
    );
    await page.mouse.up();
    if (Math.abs(Number(await practicePoint.getAttribute("data-angle")) - 120) > 1) {
      throw new Error("Dragging practice C did not construct 120 degrees");
    }
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page.getByRole("status").filter({ hasText: "120° construction correct." }).innerText();
    await page.getByRole("button", { name: "Reset", exact: true }).last().click();
    if ((await practicePoint.getAttribute("data-angle")) !== "112.000000") {
      throw new Error("Practice reset did not restore 112 degrees");
    }
  } else if (id === 233) {
    const liveAngle = page.locator('[data-testid="fixed-live-angle"]');
    const currentAngle = page.locator('[data-testid="fixed-current-angle"]');
    const angleError = page.locator('[data-testid="fixed-angle-error"]');
    const origin = page.locator('[data-testid="fixed-origin"]');
    const pointP = page.locator('[data-testid="fixed-point-p"]');
    if ((await liveAngle.innerText()) !== "55.0°" ||
        (await angleError.innerText()) !== "0.0°") {
      throw new Error("Fixed Angle initial constraint is not 55 degrees");
    }
    const initialLength = await pointP.getAttribute("data-length");
    const pBox = await pointP.boundingBox();
    if (!pBox) throw new Error("Fixed Angle point P is not draggable");
    await page.mouse.move(pBox.x + pBox.width / 2, pBox.y + pBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(pBox.x - 45, pBox.y + 60, { steps: 7 });
    await page.mouse.up();
    if ((await liveAngle.innerText()) !== "55.0°") {
      throw new Error("Locked P drag changed the fixed angle");
    }
    if ((await pointP.getAttribute("data-length")) === initialLength) {
      throw new Error("Locked P drag did not change the ray length");
    }
    const originX = await origin.getAttribute("data-x");
    const originBox = await origin.boundingBox();
    if (!originBox) throw new Error("Fixed Angle origin O is not draggable");
    await page.mouse.move(originBox.x + originBox.width / 2, originBox.y + originBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(originBox.x + 28, originBox.y - 19, { steps: 6 });
    await page.mouse.up();
    if ((await origin.getAttribute("data-x")) === originX) {
      throw new Error("Dragging origin O did not translate the construction");
    }
    if ((await liveAngle.innerText()) !== "55.0°") {
      throw new Error("Translating origin O changed the fixed angle");
    }
    await page.getByRole("switch", { name: "Lock main angle" }).click();
    const freePBox = await pointP.boundingBox();
    const movedOriginBox = await origin.boundingBox();
    if (!freePBox || !movedOriginBox) throw new Error("Unlocked model handles disappeared");
    await page.mouse.move(freePBox.x + freePBox.width / 2, freePBox.y + freePBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(movedOriginBox.x + 120, movedOriginBox.y + 5, { steps: 8 });
    await page.mouse.up();
    if ((await liveAngle.innerText()) === "55.0°" ||
        (await angleError.innerText()) === "0.0°") {
      throw new Error("Unlocked P drag did not create a measurable target error");
    }
    await page.getByRole("spinbutton", { name: "Target angle", exact: true }).fill("60");
    if ((await currentAngle.innerText()) === "60.0°") {
      throw new Error("Unlocked target edit incorrectly rotated the free ray");
    }
    await page.getByRole("switch", { name: "Lock main angle" }).click();
    if ((await liveAngle.innerText()) !== "60.0°" ||
        (await angleError.innerText()) !== "0.0°") {
      throw new Error("Relocking did not snap the ray to the 60 degree target");
    }
    await page.getByRole("button", { name: "30°", exact: true }).click();
    if ((await liveAngle.innerText()) !== "30.0°") {
      throw new Error("Fixed Angle quick-set control did not rotate the locked ray");
    }
    const arcToggle = page.getByRole("checkbox", { name: "Show arc" });
    await arcToggle.uncheck();
    if ((await page.locator('[data-testid="fixed-angle-arc"]').count()) !== 0) {
      throw new Error("Fixed Angle arc toggle did not hide the arc");
    }
    await arcToggle.check();
    const coordToggle = page.getByRole("checkbox", { name: "Show coords" });
    await coordToggle.uncheck();
    if ((await page.locator('[data-testid="fixed-coordinates"]').count()) !== 0) {
      throw new Error("Fixed Angle coordinate toggle did not hide labels");
    }
    await coordToggle.check();
    const gridToggle = page.getByRole("checkbox", { name: "Grid" });
    await gridToggle.uncheck();
    if ((await page.locator('[data-testid="fixed-grid"]').count()) !== 0) {
      throw new Error("Fixed Angle grid toggle did not hide the grid");
    }
    await gridToggle.check();
    await page.getByRole("button", { name: "Zoom in" }).click();
    await page.getByRole("button", { name: "Reset graph view" }).click();
    await page.getByRole("combobox", { name: "Lesson language" }).selectOption({ label: "Hindi (हिन्दी)" });
    await page.getByRole("button", { name: "Share", exact: true }).click();
    await page.getByRole("button", { name: "Shared", exact: true }).waitFor();
    await page.getByRole("button", { name: "Steps", exact: true }).click();
    await page.getByRole("button", { name: "Try It", exact: true }).click();
    await page.getByRole("button", { name: "Check Answer", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "The locked ray matches the target angle." }).waitFor();
    const practicePoint = page.locator('[data-testid="fixed-practice-point"]');
    const practiceGraph = page.getByRole("img", { name: "Practice fixed angle graph with draggable point P" });
    await page.getByRole("switch", { name: "Lock practice angle" }).click();
    const practicePointBox = await practicePoint.boundingBox();
    const practiceGraphBox = await practiceGraph.boundingBox();
    if (!practicePointBox || !practiceGraphBox) throw new Error("Practice fixed-angle point is not draggable");
    await page.mouse.move(practicePointBox.x + practicePointBox.width / 2, practicePointBox.y + practicePointBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      practiceGraphBox.x + (245 / 300) * practiceGraphBox.width,
      practiceGraphBox.y + (90 / 170) * practiceGraphBox.height,
      { steps: 7 },
    );
    await page.mouse.up();
    if (Math.abs(Number(await practicePoint.getAttribute("data-angle")) - 75) < 5) {
      throw new Error("Unlocked practice drag did not change the ray angle");
    }
    await page.getByRole("button", { name: "Check Answer", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Lock the angle or drag P" }).waitFor();
    await page.getByRole("spinbutton", { name: "Practice target angle" }).fill("60");
    await page.getByRole("switch", { name: "Lock practice angle" }).click();
    if ((await practicePoint.getAttribute("data-angle")) !== "60.000000") {
      throw new Error("Practice lock did not snap P to the target direction");
    }
    await page.getByRole("button", { name: "Check Answer", exact: true }).click();
    status = await page.getByRole("status").filter({ hasText: "The locked ray matches the target angle." }).innerText();
    await page.getByRole("button", { name: "Reset", exact: true }).click();
    if ((await liveAngle.innerText()) !== "55.0°") {
      throw new Error("Fixed Angle reset did not restore the target model");
    }
  } else if (id === 234) {
    const surface = page.locator(selector);
    const result = page.locator('[data-testid="relation-result"]');
    const lineL = page.locator('[data-testid="relation-line-l"]');
    const lineM = page.locator('[data-testid="relation-line-m"]');
    if ((await result.getAttribute("data-valid")) !== "true" ||
        (await lineL.getAttribute("data-slope")) !== "1.000000" ||
        (await lineM.getAttribute("data-slope")) !== "-1.000000") {
      throw new Error("Relation Checker initial perpendicular model is invalid");
    }
    const handleA = page.locator('[data-testid="relation-handle-l-b"]');
    const aBox = await handleA.boundingBox();
    if (!aBox) throw new Error("Relation Checker point A is not draggable");
    await page.mouse.move(aBox.x + aBox.width / 2, aBox.y + aBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(aBox.x + 34, aBox.y + 20, { steps: 7 });
    await page.mouse.up();
    if ((await lineL.getAttribute("data-slope")) === "1.000000" ||
        (await result.getAttribute("data-valid")) !== "false") {
      throw new Error("Dragging line l did not recompute the perpendicular predicate");
    }
    await page.getByRole("button", { name: "Reset construction", exact: true }).click();
    if ((await result.getAttribute("data-valid")) !== "true") {
      throw new Error("Relation reset did not restore perpendicular lines");
    }
    await page.getByRole("button", { name: "Move", exact: true }).click();
    const handleB = page.locator('[data-testid="relation-handle-l-a"]');
    const slopeBeforeMove = await lineL.getAttribute("data-slope");
    const bBox = await handleB.boundingBox();
    if (!bBox) throw new Error("Relation line move handle is missing");
    await page.mouse.move(bBox.x + bBox.width / 2, bBox.y + bBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(bBox.x + 25, bBox.y - 18, { steps: 6 });
    await page.mouse.up();
    if ((await lineL.getAttribute("data-slope")) !== slopeBeforeMove ||
        (await result.getAttribute("data-valid")) !== "true") {
      throw new Error("Move tool failed to preserve the line direction relation");
    }
    await page.getByRole("switch", { name: "Auto-check relations" }).click();
    await page.getByRole("radio", { name: /^Parallel/ }).click();
    if (!(await result.innerText()).includes("Ready to check")) {
      throw new Error("Manual relation mode did not defer evaluation");
    }
    await page.getByRole("button", { name: "Run check", exact: true }).click();
    if ((await result.getAttribute("data-valid")) !== "false" ||
        !(await result.innerText()).includes("Not parallel")) {
      throw new Error("Parallel predicate returned an incorrect result");
    }
    await page.getByRole("radio", { name: /^Incident/ }).click();
    await page.getByRole("button", { name: "Run check", exact: true }).click();
    if ((await result.getAttribute("data-valid")) !== "true") {
      throw new Error("Incident predicate did not detect the line intersection");
    }
    await page.getByRole("switch", { name: "Auto-check relations" }).click();
    await page.getByRole("radio", { name: /^Perpendicular/ }).click();
    const countBefore = Number(await surface.getAttribute("data-object-count"));
    for (const name of ["Point", "Line", "Segment", "Ray", "Circle"]) {
      await page.getByRole("button", { name, exact: true }).click();
    }
    if (Number(await surface.getAttribute("data-object-count")) !== countBefore + 5 ||
        (await page.locator('[data-testid="relation-extra-objects"] > *').count()) !== 5) {
      throw new Error("Relation object tools did not create all five object types");
    }
    await page.getByRole("button", { name: "Clear", exact: true }).click();
    if ((await surface.getAttribute("data-object-count")) !== "0") {
      throw new Error("Relation Clear did not remove workspace objects");
    }
    await page.getByRole("button", { name: "Reset construction", exact: true }).click();
    await page.getByRole("button", { name: "Add to Notes", exact: true }).click();
    await page.getByRole("textbox", { name: "Relation notes" }).fill("Perpendicular because the direction dot product is zero.");
    await page.getByRole("button", { name: "Relation checker menu" }).click();
    await page.getByRole("button", { name: "Copy evidence to notes" }).click();
    if (!(await page.getByRole("textbox", { name: "Relation notes" }).inputValue()).includes("Perpendicular")) {
      throw new Error("Relation evidence menu did not update notes");
    }
    await page.getByRole("button", { name: "Add to Notes", exact: true }).click();
    await page.getByRole("combobox", { name: "Lesson language" }).selectOption({ label: "Hindi (हिन्दी)" });
    await page.locator(".target-relation-tabs").getByRole("button", { name: /^Examples/ }).click();
    await page.locator(".target-relation-tabs").getByRole("button", { name: /^Practice/ }).click();
    await page.getByRole("button", { name: "Check my relation", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Correct: the lines are perpendicular." }).waitFor();
    const practiceHandle = page.locator('[data-testid="relation-practice-handle"]');
    const practiceGraph = page.getByRole("img", { name: "Practice perpendicular lines with draggable line m" });
    const practiceHandleBox = await practiceHandle.boundingBox();
    const practiceGraphBox = await practiceGraph.boundingBox();
    if (!practiceHandleBox || !practiceGraphBox) throw new Error("Relation practice line is not draggable");
    await page.mouse.move(practiceHandleBox.x + practiceHandleBox.width / 2, practiceHandleBox.y + practiceHandleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      practiceGraphBox.x + (156 / 190) * practiceGraphBox.width,
      practiceGraphBox.y + (53 / 160) * practiceGraphBox.height,
      { steps: 7 },
    );
    await page.mouse.up();
    if (Math.abs(Number(await practiceHandle.getAttribute("data-angle"))) < 10) {
      throw new Error("Dragging practice line m did not change its angle");
    }
    await page.getByRole("button", { name: "Check my relation", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Not yet" }).waitFor();
    const movedHandleBox = await practiceHandle.boundingBox();
    if (!movedHandleBox) throw new Error("Practice line handle disappeared after dragging");
    await page.mouse.move(movedHandleBox.x + movedHandleBox.width / 2, movedHandleBox.y + movedHandleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(
      practiceGraphBox.x + (165 / 190) * practiceGraphBox.width,
      practiceGraphBox.y + (88 / 160) * practiceGraphBox.height,
      { steps: 7 },
    );
    await page.mouse.up();
    await page.getByRole("button", { name: "Check my relation", exact: true }).click();
    status = await page.getByRole("status").filter({ hasText: "Correct: the lines are perpendicular." }).innerText();
  } else if (id === 235) {
    const surface = page.locator(selector);
    const pointA = page.locator('[data-testid="steps-point-a"]');
    const distance = page.locator('[data-testid="steps-distance"]');
    const midpointValue = page.locator('[data-testid="steps-midpoint-value"]');
    if ((await surface.getAttribute("data-current-step")) !== "1" ||
        (await surface.getAttribute("data-stable")) !== "true" ||
        (await pointA.getAttribute("data-x")) !== "2.000000" ||
        (await page.locator('[data-testid="steps-point-b"]').count()) !== 0) {
      throw new Error("Construction Steps initial reveal state is invalid");
    }
    await page.getByRole("button", { name: "Unlock construction" }).click();
    await page.getByRole("spinbutton", { name: "A x exact value" }).fill("4");
    if ((await distance.innerText()) !== "4.00" ||
        (await midpointValue.innerText()) !== "(2.00, 0.00)") {
      throw new Error("Editing A did not recalculate dependent measurements");
    }
    await page.getByRole("button", { name: "Undo construction edit" }).click();
    if ((await pointA.getAttribute("data-x")) !== "2.000000" ||
        (await midpointValue.innerText()) !== "(1.00, 0.00)") {
      throw new Error("Construction undo did not restore the dependency snapshot");
    }
    await page.getByRole("button", { name: "Redo construction edit" }).click();
    if ((await pointA.getAttribute("data-x")) !== "4.000000") {
      throw new Error("Construction redo did not restore the edited point");
    }
    await page.getByRole("button", { name: "Next construction step" }).click();
    const pointB = page.locator('[data-testid="steps-point-b"]');
    if ((await surface.getAttribute("data-current-step")) !== "2" ||
        (await pointB.count()) !== 1) {
      throw new Error("Step 2 did not reveal point B");
    }
    await page.getByRole("slider", { name: "Construction timeline position" }).fill("6");
    for (const testId of ["steps-line-ab", "steps-perpendicular", "steps-midpoint", "steps-segment-am"]) {
      if ((await page.locator(`[data-testid="${testId}"]`).count()) !== 1) {
        throw new Error(`Construction step 6 did not reveal ${testId}`);
      }
    }
    await page.getByRole("switch", { name: "Hide dependencies" }).click();
    if ((await page.locator('[data-testid="steps-dependency-overlay"]').count()) !== 1) {
      throw new Error("Dependency visibility control did not show parent links");
    }
    await page.getByRole("button", { name: "Grid", exact: true }).click();
    if ((await page.locator('[data-testid="steps-grid"]').count()) !== 0) {
      throw new Error("Construction grid control did not hide the grid");
    }
    await page.getByRole("button", { name: "Grid", exact: true }).click();
    const midpointBeforeDrag = await midpointValue.innerText();
    await pointA.scrollIntoViewIfNeeded();
    const aBox = await pointA.boundingBox();
    if (!aBox) throw new Error("Construction point A is not draggable");
    await page.mouse.move(aBox.x + aBox.width / 2, aBox.y + aBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(aBox.x - 38, aBox.y - 24, { steps: 7 });
    await page.mouse.up();
    if ((await midpointValue.innerText()) === midpointBeforeDrag) {
      throw new Error(`Dragging A did not update midpoint M (A=${await pointA.getAttribute("data-x")}, M=${await midpointValue.innerText()})`);
    }
    const distanceBeforeMove = await distance.innerText();
    const bBeforeMove = await pointB.getAttribute("data-x");
    await page.getByRole("button", { name: "Move tool" }).click();
    await pointA.scrollIntoViewIfNeeded();
    const moveABox = await pointA.boundingBox();
    if (!moveABox) throw new Error("Construction Move tool lost point A");
    await page.mouse.move(moveABox.x + moveABox.width / 2, moveABox.y + moveABox.height / 2);
    await page.mouse.down();
    await page.mouse.move(moveABox.x + 26, moveABox.y + 17, { steps: 6 });
    await page.mouse.up();
    if ((await distance.innerText()) !== distanceBeforeMove ||
        (await pointB.getAttribute("data-x")) === bBeforeMove) {
      throw new Error("Move tool did not translate the construction rigidly");
    }
    await page.locator(".target-steps-parameters").getByRole("button", { name: "Step", exact: true }).click();
    await page.locator(".target-steps-parameters").getByRole("button", { name: "Depend.", exact: true }).click();
    if (!(await page.locator(".target-steps-side-list").innerText()).includes("depends on A, B")) {
      throw new Error("Dependency tab did not expose parent relationships");
    }
    await page.getByRole("slider", { name: "Construction timeline position" }).fill("1");
    await page.locator(".target-steps-timeline").getByRole("button", { name: "Play", exact: true }).click();
    await page.waitForTimeout(2300);
    if ((await surface.getAttribute("data-current-step")) !== "6") {
      throw new Error("Construction playback did not traverse all six steps");
    }
    await page.getByRole("button", { name: "Export", exact: true }).click();
    await page.getByRole("button", { name: "Exported", exact: true }).waitFor();
    await page.getByRole("combobox", { name: "Lesson language" }).selectOption({ label: "Hindi (हिन्दी)" });
    await page.getByRole("button", { name: "Start Construction", exact: true }).click();
    if ((await surface.getAttribute("data-current-step")) !== "2" ||
        (await pointA.getAttribute("data-x")) !== "3.000000" ||
        (await pointB.getAttribute("data-x")) !== "-1.000000") {
      throw new Error("Practice start did not load the given points and dependency state");
    }
    await page.getByRole("button", { name: "Segment tool" }).click();
    if ((await surface.getAttribute("data-current-step")) !== "3") {
      throw new Error("Segment tool did not advance the construction graph");
    }
    await page.getByRole("button", { name: "Perpendicular tool" }).click();
    if ((await surface.getAttribute("data-current-step")) !== "4") {
      throw new Error("Perpendicular tool did not add its dependent object");
    }
    await page.getByRole("slider", { name: "Construction timeline position" }).fill("6");
    const practicePerpendicular = page.locator('[data-testid="steps-perpendicular"]');
    if ((await practicePerpendicular.count()) !== 1 ||
        (await midpointValue.innerText()) !== "(1.00, -1.00)") {
      throw new Error("Practice dependency graph did not build from the given segment");
    }
    status = await page.getByRole("status").filter({ hasText: "Correct: perpendicular bisector" }).innerText();
    await page.locator(".target-steps-learning").getByRole("button", { name: "Reset", exact: true }).click();
    if ((await surface.getAttribute("data-current-step")) !== "1") {
      throw new Error("Construction practice reset did not restore step 1");
    }
  } else if (id === 236) {
    const surface = page.locator(selector);
    const source = page.locator('[data-testid="translation-source-triangle"]');
    const imageTriangle = page.locator('[data-testid="translation-image-triangle"]');
    const vectorHandle = page.locator('[data-testid="translation-vector-handle"]');
    if ((await surface.getAttribute("data-object-model")) !== "rigid-vector-translation-pair" ||
        (await surface.getAttribute("data-vector-x")) !== "3.0000" ||
        (await imageTriangle.getAttribute("data-a-x")) !== "1.0000" ||
        (await imageTriangle.getAttribute("data-a-y")) !== "3.0000") {
      throw new Error("Translation initial model does not match the vector mapping");
    }
    const sourceBeforeDrag = Number(await source.getAttribute("data-a-x"));
    const vectorBeforeShapeDrag = await surface.getAttribute("data-vector-x");
    const sourceBox = await source.boundingBox();
    if (!sourceBox) throw new Error("Translation source triangle is not draggable");
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(sourceBox.x + sourceBox.width / 2 + 30, sourceBox.y + sourceBox.height / 2 - 15, { steps: 6 });
    await page.mouse.up();
    if (Number(await source.getAttribute("data-a-x")) === sourceBeforeDrag ||
        (await surface.getAttribute("data-vector-x")) !== vectorBeforeShapeDrag) {
      throw new Error("Dragging the source did not translate it rigidly while preserving the vector");
    }
    const sourceBeforeVectorDrag = await source.getAttribute("data-a-x");
    const imageBeforeVectorDrag = await imageTriangle.getAttribute("data-a-x");
    const vectorBox = await vectorHandle.boundingBox();
    if (!vectorBox) throw new Error("Translation vector handle is not draggable");
    await page.mouse.move(vectorBox.x + vectorBox.width / 2, vectorBox.y + vectorBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(vectorBox.x - 30, vectorBox.y + 30, { steps: 6 });
    await page.mouse.up();
    if ((await source.getAttribute("data-a-x")) !== sourceBeforeVectorDrag ||
        (await imageTriangle.getAttribute("data-a-x")) === imageBeforeVectorDrag) {
      throw new Error("Dragging the vector did not preserve the source and recalculate its image");
    }
    await page.getByRole("spinbutton", { name: "Vector x component exact value" }).fill("2");
    await page.getByRole("spinbutton", { name: "Vector y component exact value" }).fill("-1");
    const sourceA = Number(await source.getAttribute("data-a-x"));
    if (Number(await imageTriangle.getAttribute("data-a-x")) !== sourceA + 2) {
      throw new Error("Exact vector controls did not update the image coordinates");
    }
    await page.getByRole("button", { name: "Reverse", exact: true }).click();
    if ((await surface.getAttribute("data-vector-x")) !== "-2.0000" ||
        (await surface.getAttribute("data-vector-y")) !== "1.0000") {
      throw new Error("Reverse did not negate both vector components");
    }
    await page.getByRole("button", { name: "Delete vector" }).click();
    if ((await imageTriangle.getAttribute("data-a-x")) !== (await source.getAttribute("data-a-x"))) {
      throw new Error("Deleting the vector did not make source and image coincide");
    }
    await surface.getByRole("button", { name: "Reset", exact: true }).click();
    if ((await surface.getAttribute("data-vector-x")) !== "3.0000" ||
        (await source.getAttribute("data-a-x")) !== "-2.0000") {
      throw new Error("Translation reset did not restore the target construction");
    }
    await surface.locator(".target-translation-stages button").nth(1).click();
    await page.getByRole("button", { name: "Bookmark lesson" }).click();
    await page.getByRole("button", { name: "Edit", exact: true }).click();
    const practiceSource = page.locator('[data-testid="translation-practice-source"]');
    const practicePointA = page.locator('[data-testid="translation-practice-point-a"]');
    const practiceSourceBefore = await practiceSource.getAttribute("data-a-x");
    await practicePointA.scrollIntoViewIfNeeded();
    const practiceBox = await practicePointA.boundingBox();
    if (!practiceBox) throw new Error("Practice triangle vertex A is not draggable");
    await page.mouse.move(practiceBox.x + practiceBox.width / 2, practiceBox.y + practiceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(practiceBox.x + practiceBox.width / 2 + 18, practiceBox.y + practiceBox.height / 2, { steps: 5 });
    await page.mouse.up();
    if ((await practiceSource.getAttribute("data-a-x")) === practiceSourceBefore) {
      throw new Error("Practice triangle drag did not update the challenge model");
    }
    const practiceVector = page.locator('[data-testid="translation-practice-vector-handle"]');
    const practiceVectorBefore = await practiceVector.getAttribute("data-x");
    await practiceVector.scrollIntoViewIfNeeded();
    const practiceVectorBox = await practiceVector.boundingBox();
    if (!practiceVectorBox) throw new Error("Practice vector is not draggable");
    await page.mouse.move(practiceVectorBox.x + practiceVectorBox.width / 2, practiceVectorBox.y + practiceVectorBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(practiceVectorBox.x - 18, practiceVectorBox.y - 18, { steps: 5 });
    await page.mouse.up();
    if ((await practiceVector.getAttribute("data-x")) === practiceVectorBefore) {
      throw new Error("Practice vector drag did not change the challenge vector");
    }
    await page.getByRole("textbox", { name: "A' x coordinate" }).fill("999");
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Not yet" }).waitFor();
    await page.getByRole("button", { name: "Show solution", exact: true }).click();
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page.getByRole("status").filter({ hasText: "Correct: every practice vertex" }).innerText();
  } else if (id === 237) {
    const surface = page.locator(selector);
    const source = page.locator('[data-testid="reflection-source-point"]');
    const imagePoint = page.locator('[data-testid="reflection-image-point"]');
    const mirror = page.locator('[data-testid="reflection-mirror-line"]');
    const leftDistance = page.locator('[data-testid="reflection-source-distance"]');
    const rightDistance = page.locator('[data-testid="reflection-image-distance"]');
    if ((await surface.getAttribute("data-object-model")) !== "point-line-orthogonal-reflection" ||
        (await source.getAttribute("data-x")) !== "-4.0000" ||
        (await imagePoint.getAttribute("data-x")) !== "6.0000" ||
        (await mirror.getAttribute("data-value")) !== "1.0000" ||
        (await leftDistance.innerText()) !== "5 units" ||
        (await rightDistance.innerText()) !== "5 units") {
      throw new Error("Reflection initial model does not satisfy the target construction");
    }
    const imageBeforePointDrag = await imagePoint.getAttribute("data-x");
    const sourceBox = await source.boundingBox();
    if (!sourceBox) throw new Error("Reflection source point is not draggable");
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(sourceBox.x + 35, sourceBox.y - 18, { steps: 6 });
    await page.mouse.up();
    if ((await imagePoint.getAttribute("data-x")) === imageBeforePointDrag ||
        (await leftDistance.innerText()) !== (await rightDistance.innerText())) {
      throw new Error("Dragging P did not preserve equal reflected distances");
    }
    await page.getByRole("spinbutton", { name: "Point P x coordinate" }).fill("-3");
    if ((await imagePoint.getAttribute("data-x")) !== "5.0000") {
      throw new Error("Editing P did not derive P' across x=1");
    }
    await page.getByRole("spinbutton", { name: "Image P' x coordinate" }).fill("4");
    if ((await source.getAttribute("data-x")) !== "-2.0000") {
      throw new Error("Editing dependent P' did not recover its reflected source");
    }
    await page.getByRole("spinbutton", { name: "Image P' y coordinate" }).fill("3");
    if ((await source.getAttribute("data-y")) !== "3.0000") {
      throw new Error("Editing image y did not preserve the vertical reflection rule");
    }
    const lineHandle = page.locator('[data-testid="reflection-line-handle"]');
    const lineBeforeDrag = await mirror.getAttribute("data-value");
    const sourceBeforeLineDrag = await source.getAttribute("data-x");
    const imageBeforeLineDrag = await imagePoint.getAttribute("data-x");
    const lineBox = await lineHandle.boundingBox();
    if (!lineBox) throw new Error("Reflection mirror line is not draggable");
    await page.mouse.move(lineBox.x + lineBox.width / 2, lineBox.y + lineBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(lineBox.x + 35, lineBox.y, { steps: 6 });
    await page.mouse.up();
    if ((await mirror.getAttribute("data-value")) === lineBeforeDrag ||
        (await source.getAttribute("data-x")) !== sourceBeforeLineDrag ||
        (await imagePoint.getAttribute("data-x")) === imageBeforeLineDrag ||
        (await leftDistance.innerText()) !== (await rightDistance.innerText())) {
      throw new Error("Dragging the mirror line did not update only the dependent image");
    }
    await page.getByRole("checkbox", { name: "Show perpendiculars" }).uncheck();
    if ((await page.locator('[data-testid="reflection-perpendicular"]').count()) !== 0) {
      throw new Error("Perpendicular visibility control did not hide the guide");
    }
    await page.getByRole("button", { name: "⌘ Fold", exact: true }).click();
    if ((await imagePoint.getAttribute("data-x")) !== (await source.getAttribute("data-x"))) {
      throw new Error("Fold did not superimpose the image on its source");
    }
    await page.getByRole("button", { name: "⌘ Fold", exact: true }).click();
    await page.locator(".target-reflection-panel>nav").getByRole("button", { name: "Line", exact: true }).click();
    await page.getByRole("button", { name: "horizontal", exact: true }).click();
    await page.getByRole("spinbutton", { name: "Mirror line exact value" }).fill("2");
    if ((await surface.getAttribute("data-orientation")) !== "horizontal" ||
        (await surface.getAttribute("data-line")) !== "2.0000" ||
        (await imagePoint.getAttribute("data-y")) !== "1.0000") {
      throw new Error("Horizontal line mode did not apply y'=2b-y");
    }
    await page.locator(".target-reflection-panel>nav").getByRole("button", { name: "Objects", exact: true }).click();
    await surface.getByRole("button", { name: "Reset", exact: true }).first().click();
    if ((await source.getAttribute("data-x")) !== "-4.0000" ||
        (await imagePoint.getAttribute("data-x")) !== "6.0000" ||
        (await surface.getAttribute("data-orientation")) !== "vertical") {
      throw new Error("Reflection reset did not restore the target model");
    }
    await surface.locator(".target-reflection-stages button").nth(2).click();
    await page.getByRole("button", { name: "Share", exact: true }).click();
    const practicePoint = page.locator('[data-testid="reflection-practice-point"]');
    await practicePoint.scrollIntoViewIfNeeded();
    const practicePointBefore = await practicePoint.getAttribute("data-x");
    const practicePointBox = await practicePoint.boundingBox();
    if (!practicePointBox) throw new Error("Practice reflection point is not draggable");
    await page.mouse.move(practicePointBox.x + practicePointBox.width / 2, practicePointBox.y + practicePointBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(practicePointBox.x + 23, practicePointBox.y - 16, { steps: 6 });
    await page.mouse.up();
    if ((await practicePoint.getAttribute("data-x")) === practicePointBefore) {
      throw new Error("Practice source point did not drag");
    }
    const practiceLine = page.locator('[data-testid="reflection-practice-line"]');
    const practiceLineHandle = page.locator('[data-testid="reflection-practice-line-handle"]');
    const practiceLineBefore = await practiceLine.getAttribute("data-value");
    const practiceLineBox = await practiceLineHandle.boundingBox();
    if (!practiceLineBox) throw new Error("Practice reflection line is not draggable");
    await page.mouse.move(practiceLineBox.x + practiceLineBox.width / 2, practiceLineBox.y + practiceLineBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(practiceLineBox.x, practiceLineBox.y - 23, { steps: 6 });
    await page.mouse.up();
    if ((await practiceLine.getAttribute("data-value")) === practiceLineBefore) {
      throw new Error("Practice mirror line did not drag");
    }
    await page.getByRole("button", { name: "Check my work", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Not yet" }).waitFor();
    for (const checkbox of await page.locator(".target-reflection-practice aside label input").all()) await checkbox.check();
    await page.getByRole("button", { name: "Check my work", exact: true }).click();
    status = await page.getByRole("status").filter({ hasText: "Correct: all line-reflection invariants" }).innerText();
    await page.locator(".target-reflection-practice aside").getByRole("button", { name: "Reset", exact: true }).click();
  } else if (id === 238) {
    const surface = page.locator(selector);
    const centre = page.locator('[data-testid="point-reflection-centre"]');
    const source = page.locator('[data-testid="point-reflection-source"]');
    const imagePoint = page.locator('[data-testid="point-reflection-image"]');
    if ((await surface.getAttribute("data-object-model")) !== "centre-midpoint-half-turn-reflection" ||
        (await centre.getAttribute("data-x")) !== "0.0000" ||
        (await source.getAttribute("data-x")) !== "3.0000" ||
        (await source.getAttribute("data-y")) !== "1.0000" ||
        (await imagePoint.getAttribute("data-x")) !== "-3.0000" ||
        (await imagePoint.getAttribute("data-y")) !== "-1.0000") {
      throw new Error("Point Reflection initial midpoint model is invalid");
    }
    const centreBeforeSourceDrag = await centre.getAttribute("data-x");
    const imageBeforeSourceDrag = await imagePoint.getAttribute("data-x");
    const sourceBox = await source.boundingBox();
    if (!sourceBox) throw new Error("Point Reflection source A is not draggable");
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(sourceBox.x + 36, sourceBox.y - 18, { steps: 6 });
    await page.mouse.up();
    if ((await centre.getAttribute("data-x")) !== centreBeforeSourceDrag ||
        (await imagePoint.getAttribute("data-x")) === imageBeforeSourceDrag) {
      throw new Error("Dragging A did not preserve P while updating A'");
    }
    const sourceBeforeCentreDrag = await source.getAttribute("data-x");
    const imageBeforeCentreDrag = await imagePoint.getAttribute("data-x");
    const centreBox = await centre.boundingBox();
    if (!centreBox) throw new Error("Point Reflection centre P is not draggable");
    await page.mouse.move(centreBox.x + centreBox.width / 2, centreBox.y + centreBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(centreBox.x + 36, centreBox.y + 18, { steps: 6 });
    await page.mouse.up();
    if ((await source.getAttribute("data-x")) !== sourceBeforeCentreDrag ||
        (await imagePoint.getAttribute("data-x")) === imageBeforeCentreDrag) {
      throw new Error("Dragging P did not preserve A while recalculating A'");
    }
    await page.getByRole("spinbutton", { name: "Centre P x coordinate" }).fill("1");
    await page.getByRole("spinbutton", { name: "Centre P y coordinate" }).fill("2");
    await page.getByRole("spinbutton", { name: "Point A x coordinate" }).fill("4");
    await page.getByRole("spinbutton", { name: "Point A y coordinate" }).fill("-1");
    if ((await imagePoint.getAttribute("data-x")) !== "-2.0000" ||
        (await imagePoint.getAttribute("data-y")) !== "5.0000") {
      throw new Error("Exact P/A coordinate edits did not apply A'=2P-A");
    }
    await page.getByRole("button", { name: "Origin (0,0)", exact: true }).click();
    if ((await imagePoint.getAttribute("data-x")) !== "-4.0000" ||
        (await imagePoint.getAttribute("data-y")) !== "1.0000") {
      throw new Error("Origin preset did not apply A'=(-x,-y)");
    }
    await page.getByRole("button", { name: "Quadrant I", exact: true }).click();
    if ((await surface.getAttribute("data-centre-x")) !== "2.0000" ||
        (await surface.getAttribute("data-centre-y")) !== "2.0000") {
      throw new Error("Quadrant I centre preset did not move P");
    }
    const randomBefore = await surface.getAttribute("data-centre-x");
    await page.getByRole("button", { name: "Random", exact: true }).click();
    if ((await surface.getAttribute("data-centre-x")) === randomBefore) {
      throw new Error("Random centre preset did not change P");
    }
    await page.getByRole("checkbox", { name: "Midpoint PA", exact: true }).uncheck();
    if ((await page.locator('[data-testid="point-reflection-midpoint-pa"]').count()) !== 0) {
      throw new Error("Midpoint PA layer did not hide");
    }
    await page.getByRole("checkbox", { name: "Midpoint PA", exact: true }).check();
    await surface.getByRole("button", { name: "Reset", exact: true }).first().click();
    const relativeBeforeMove = Number(await source.getAttribute("data-x")) - Number(await centre.getAttribute("data-x"));
    await page.getByRole("button", { name: "Move construction tool" }).click();
    const centreBeforeMove = await centre.getAttribute("data-x");
    const moveSourceBox = await source.boundingBox();
    if (!moveSourceBox) throw new Error("Move tool lost source A");
    await page.mouse.move(moveSourceBox.x + moveSourceBox.width / 2, moveSourceBox.y + moveSourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(moveSourceBox.x + 36, moveSourceBox.y - 18, { steps: 6 });
    await page.mouse.up();
    const relativeAfterMove = Number(await source.getAttribute("data-x")) - Number(await centre.getAttribute("data-x"));
    if ((await centre.getAttribute("data-x")) === centreBeforeMove || relativeAfterMove !== relativeBeforeMove) {
      throw new Error("Move mode did not translate the complete construction rigidly");
    }
    await page.getByRole("slider", { name: "Point A horizontal position" }).fill("2");
    await page.getByRole("button", { name: "Lesson guide", exact: true }).click();
    await page.getByRole("button", { name: "Share", exact: true }).click();
    await surface.locator(".target-point-reflection-stages button").nth(2).click();
    await page.getByRole("textbox", { name: "Practice reflected x coordinate" }).fill("0");
    await page.getByRole("textbox", { name: "Practice reflected y coordinate" }).fill("0");
    await page.getByRole("button", { name: "Check answer", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Not yet" }).waitFor();
    await page.getByRole("button", { name: "Show worked steps", exact: true }).click();
    await page.getByRole("textbox", { name: "Practice reflected x coordinate" }).fill("-1");
    await page.getByRole("textbox", { name: "Practice reflected y coordinate" }).fill("-5");
    await page.getByRole("button", { name: "Check answer", exact: true }).click();
    status = await page.getByRole("status").filter({ hasText: "Correct: A' = (-1, -5)" }).innerText();
  } else if (id === 239) {
    const surface = page.locator(selector);
    const centre = page.locator('[data-testid="circle-reflection-centre"]');
    const source = page.locator('[data-testid="circle-reflection-source"]');
    const imagePoint = page.locator('[data-testid="circle-reflection-image"]');
    const radiusHandle = page.locator('[data-testid="circle-reflection-radius-handle"]');
    if ((await surface.getAttribute("data-object-model")) !== "opposite-ray-circle-inversion" ||
        (await surface.getAttribute("data-product")) !== "9.0000" ||
        (await imagePoint.getAttribute("data-x")) !== "-1.0800" ||
        (await imagePoint.getAttribute("data-y")) !== "-1.4400") {
      throw new Error("Circle Reflection initial inverse model is invalid");
    }
    const centreBefore = await centre.getAttribute("cx");
    const imageBefore = await imagePoint.getAttribute("data-x");
    const sourceBox = await source.boundingBox();
    if (!sourceBox) throw new Error("Circle Reflection point P is not draggable");
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(sourceBox.x + 35, sourceBox.y + 18, { steps: 6 });
    await page.mouse.up();
    if ((await centre.getAttribute("cx")) !== centreBefore ||
        (await imagePoint.getAttribute("data-x")) === imageBefore ||
        (await surface.getAttribute("data-product")) !== "9.0000") {
      throw new Error("Dragging P did not independently preserve O and OP·OP'=r²");
    }
    const centreBox = await centre.boundingBox();
    if (!centreBox) throw new Error("Circle Reflection centre O is not draggable");
    const sourceBeforeCentre = await source.getAttribute("data-x");
    await page.mouse.move(centreBox.x + centreBox.width / 2, centreBox.y + centreBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(centreBox.x + 35, centreBox.y - 18, { steps: 6 });
    await page.mouse.up();
    if ((await source.getAttribute("data-x")) !== sourceBeforeCentre ||
        (await surface.getAttribute("data-product")) !== "9.0000") {
      throw new Error("Dragging O did not independently preserve P and the inversion invariant");
    }
    await page.getByRole("button", { name: "Radius mode", exact: true }).click();
    const handleBox = await radiusHandle.boundingBox();
    if (!handleBox) throw new Error("Circle radius handle is not draggable");
    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
    await page.mouse.down();
    await page.mouse.move(handleBox.x + 35, handleBox.y, { steps: 6 });
    await page.mouse.up();
    const radius = Number(await surface.getAttribute("data-radius"));
    if (Math.abs(Number(await surface.getAttribute("data-product")) - radius * radius) > .001) {
      throw new Error("Dragging radius did not recalculate the inverse product");
    }
    await page.getByRole("spinbutton", { name: "Circle center O x coordinate" }).fill("0");
    await page.getByRole("spinbutton", { name: "Circle center O y coordinate" }).fill("0");
    await page.getByRole("spinbutton", { name: "Point P x coordinate" }).fill("3");
    await page.getByRole("spinbutton", { name: "Point P y coordinate" }).fill("4");
    await page.getByRole("spinbutton", { name: "Circle radius exact value" }).fill("3");
    await page.getByRole("checkbox", { name: "Grid", exact: true }).uncheck();
    await page.getByRole("checkbox", { name: "Grid", exact: true }).check();
    await surface.locator(".target-circle-reflection-stages button").nth(3).click();
    await page.getByRole("textbox", { name: "Practice inverse x coordinate" }).fill("0");
    await page.getByRole("textbox", { name: "Practice inverse y coordinate" }).fill("0");
    await page.getByRole("button", { name: "Check", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Not yet" }).waitFor();
    await page.getByRole("button", { name: "Show solution", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "OP² = 5" }).waitFor();
    await page.getByRole("button", { name: "Hide solution", exact: true }).click();
    await page.getByRole("textbox", { name: "Practice inverse x coordinate" }).fill("10");
    await page.getByRole("textbox", { name: "Practice inverse y coordinate" }).fill("-5");
    await page.getByRole("button", { name: "Check", exact: true }).click();
    status = await page.getByRole("status").filter({ hasText: "Correct: P' = (10, -5)." }).innerText();
  } else if (id === 240) {
    const surface = page.locator(selector);
    const centre = page.locator('[data-testid="rotation-centre"]');
    const source = page.locator('[data-testid="rotation-source"]');
    const imagePoint = page.locator('[data-testid="rotation-image"]');
    if ((await surface.getAttribute("data-object-model")) !== "fixed-centre-signed-angle-rotation" ||
        (await surface.getAttribute("data-image-x")) !== "-2.0000" ||
        (await surface.getAttribute("data-image-y")) !== "4.0000") {
      throw new Error("Rotation initial 90-degree model is invalid");
    }
    const radiusBefore = await surface.getAttribute("data-radius");
    const centreBefore = await centre.getAttribute("data-x");
    const sourceBox = await source.boundingBox();
    if (!sourceBox) throw new Error("Rotation point P is not draggable");
    await page.mouse.move(sourceBox.x + sourceBox.width / 2, sourceBox.y + sourceBox.height / 2);
    await page.mouse.down(); await page.mouse.move(sourceBox.x + 29, sourceBox.y - 29, {steps:6}); await page.mouse.up();
    if ((await centre.getAttribute("data-x")) !== centreBefore || (await surface.getAttribute("data-radius")) === radiusBefore) throw new Error("Dragging P did not update radius independently");
    const sourceBefore = await source.getAttribute("data-x");
    const centreBox = await centre.boundingBox();
    if (!centreBox) throw new Error("Rotation centre O is not draggable");
    await page.mouse.move(centreBox.x + centreBox.width/2,centreBox.y + centreBox.height/2); await page.mouse.down(); await page.mouse.move(centreBox.x+29,centreBox.y+29,{steps:6}); await page.mouse.up();
    if ((await source.getAttribute("data-x")) !== sourceBefore) throw new Error("Dragging O changed source P");
    await page.getByRole("spinbutton",{name:"Centre O x coordinate"}).fill("0");
    await page.getByRole("spinbutton",{name:"Centre O y coordinate"}).fill("0");
    await page.getByRole("spinbutton",{name:"Point P x coordinate"}).fill("4");
    await page.getByRole("spinbutton",{name:"Point P y coordinate"}).fill("2");
    await page.getByRole("slider",{name:"Rotation angle"}).fill("180");
    if ((await surface.getAttribute("data-image-x")) !== "-4.0000" || (await surface.getAttribute("data-image-y")) !== "-2.0000") throw new Error("Angle control did not apply 180-degree rotation");
    await page.getByRole("button",{name:"Clockwise direction",exact:true}).click();
    await page.getByRole("button",{name:"90°",exact:true}).click();
    await page.getByRole("checkbox",{name:"Show image (rotated)"}).uncheck();
    if (await imagePoint.count()) throw new Error("Image visibility toggle failed");
    await page.getByRole("checkbox",{name:"Show image (rotated)"}).check();
    await page.getByRole("textbox",{name:"Practice rotated x coordinate"}).fill("0");
    await page.getByRole("textbox",{name:"Practice rotated y coordinate"}).fill("0");
    await page.getByRole("button",{name:"Check answer"}).click();
    await page.getByRole("status").filter({hasText:"Not yet"}).waitFor();
    await page.getByRole("textbox",{name:"Practice rotated x coordinate"}).fill("-3.33");
    await page.getByRole("textbox",{name:"Practice rotated y coordinate"}).fill("-4.23");
    await page.getByRole("button",{name:"Check answer"}).click();
    status = await page.getByRole("status").filter({hasText:"Correct: P'"}).innerText();
  } else if (id === 241) {
    const surface=page.locator(selector),centre=page.locator('[data-testid="dilation-centre"]'),source=page.locator('[data-testid="dilation-source-a"]'),imagePoint=page.locator('[data-testid="dilation-image-a"]');
    if((await surface.getAttribute("data-object-model"))!=="centre-scale-triangle-dilation"||(await surface.getAttribute("data-perimeter-ratio"))!=="2.0000"||(await surface.getAttribute("data-area-ratio"))!=="4.0000"||(await imagePoint.getAttribute("data-x"))!=="4.0000")throw new Error("Dilation initial model is invalid");
    const centreBefore=await centre.getAttribute("data-x"),imageBefore=await imagePoint.getAttribute("data-x"),box=await source.boundingBox();if(!box)throw new Error("Dilation source A is not draggable");
    await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+32,box.y-16,{steps:6});await page.mouse.up();
    if((await centre.getAttribute("data-x"))!==centreBefore||(await imagePoint.getAttribute("data-x"))===imageBefore)throw new Error("Dragging A did not preserve C and update A'");
    const sourceBefore=await source.getAttribute("data-x"),centreBox=await centre.boundingBox();if(!centreBox)throw new Error("Dilation centre is not draggable");
    await page.mouse.move(centreBox.x+centreBox.width/2,centreBox.y+centreBox.height/2);await page.mouse.down();await page.mouse.move(centreBox.x+32,centreBox.y-16,{steps:6});await page.mouse.up();if((await source.getAttribute("data-x"))!==sourceBefore)throw new Error("Dragging C changed source triangle");
    await page.getByRole("button",{name:"Negative k"}).click();if(Number(await surface.getAttribute("data-scale"))>=0)throw new Error("Negative mode failed");
    await page.getByRole("slider",{name:"Scale factor"}).fill("3");if((await surface.getAttribute("data-area-ratio"))!=="9.0000")throw new Error("Area ratio did not follow k squared");
    await page.getByRole("checkbox",{name:"Show rays"}).uncheck();await page.getByRole("button",{name:"Clear"}).click();if(await page.locator('[data-testid="dilation-image-polygon"]').count())throw new Error("Clear did not hide image");
    await page.getByRole("button",{name:"New question"}).click();await page.getByRole("button",{name:"Check my construction"}).click();status=await page.getByRole("status").filter({hasText:"Correct construction"}).innerText();
  } else if (id === 242) {
    const surface=page.locator(selector),source=page.locator('[data-testid="matrix-source-a"]'),imagePoint=page.locator('[data-testid="matrix-image-a"]');
    if((await surface.getAttribute("data-object-model"))!=="editable-linear-map-basis-shape"||(await surface.getAttribute("data-determinant"))!=="2.0000"||(await imagePoint.getAttribute("data-x"))!=="-2.0000")throw new Error("Matrix transformation initial model is invalid");
    const before=await imagePoint.getAttribute("data-x"),box=await source.boundingBox();if(!box)throw new Error("Matrix source A is not draggable");await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+51,box.y-26,{steps:6});await page.mouse.up();if((await imagePoint.getAttribute("data-x"))===before)throw new Error("Dragging source A did not transform its image");
    await page.getByRole("spinbutton",{name:"Matrix a"}).fill("0");await page.getByRole("spinbutton",{name:"Matrix b"}).fill("-1");await page.getByRole("spinbutton",{name:"Matrix c"}).fill("1");await page.getByRole("spinbutton",{name:"Matrix d"}).fill("0");if((await surface.getAttribute("data-determinant"))!=="1.0000")throw new Error("Matrix input determinant failed");
    await page.getByRole("button",{name:"Reflect X"}).click();if((await surface.getAttribute("data-determinant"))!=="-1.0000")throw new Error("Reflection preset did not reverse orientation");
    await page.getByRole("button",{name:"Before",exact:true}).click();if(await page.locator('[data-testid="matrix-transformed-shape"]').count())throw new Error("Before mode did not hide transformed shape");await page.getByRole("button",{name:"Overlay"}).click();
    await page.getByRole("textbox",{name:"Practice matrix 1"}).fill("0");await page.getByRole("textbox",{name:"Practice matrix 2"}).fill("0");await page.getByRole("textbox",{name:"Practice matrix 3"}).fill("0");await page.getByRole("textbox",{name:"Practice matrix 4"}).fill("0");await page.getByRole("button",{name:"Check",exact:true}).click();await page.getByRole("status").filter({hasText:"Not yet"}).waitFor();
    for(const [i,value] of ["2","1","0","1"].entries())await page.getByRole("textbox",{name:`Practice matrix ${i+1}`}).fill(value);await page.getByRole("button",{name:"Check",exact:true}).click();status=await page.getByRole("status").filter({hasText:"Correct: the composite matrix"}).innerText();
  } else if (id === 243) {
    const surface=page.locator(selector),source=page.locator('[data-testid="composite-source-a"]'),mid=page.locator('[data-testid="composite-intermediate-a"]'),finalPoint=page.locator('[data-testid="composite-final-a"]');
    if((await surface.getAttribute("data-object-model"))!=="ordered-two-step-affine-composition"||(await surface.getAttribute("data-final-a"))!=="(2, -3)"||(await mid.getAttribute("data-x"))!=="-1.0000"||(await finalPoint.getAttribute("data-x"))!=="2.0000")throw new Error("Composite initial sequence is invalid");
    const before=await finalPoint.getAttribute("data-x"),box=await source.boundingBox();if(!box)throw new Error("Composite source A is not draggable");await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+36,box.y-18,{steps:6});await page.mouse.up();if((await finalPoint.getAttribute("data-x"))===before)throw new Error("Dragging source did not update both composed images");
    await page.getByRole("button",{name:"Swap transformation order"}).click();if((await surface.getAttribute("data-final-a"))==="(2, -3)")throw new Error("Swapping order did not change final mapping");
    await page.locator(".target-composite-steps>button").last().click();await page.getByRole("button",{name:"Reflect Across line"}).click();
    await page.getByRole("checkbox",{name:"Grid",exact:true}).uncheck();await page.getByRole("checkbox",{name:"Grid",exact:true}).check();await page.getByRole("button",{name:"Reset",exact:true}).click();
    await page.getByRole("combobox",{name:"First practice transformation"}).selectOption("translate");await page.getByRole("combobox",{name:"Second practice transformation"}).selectOption("rotate");await page.getByRole("button",{name:"Check",exact:true}).click();await page.getByRole("status").filter({hasText:"Not yet"}).waitFor();
    await page.getByRole("combobox",{name:"First practice transformation"}).selectOption("rotate");await page.getByRole("combobox",{name:"Second practice transformation"}).selectOption("translate");await page.getByRole("button",{name:"Check",exact:true}).click();status=await page.getByRole("status").filter({hasText:"Correct composition"}).innerText();
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
          !row.status.match(/Construction verified\.|Correct|Well done!/i),
      ).length,
      results,
    },
    null,
    2,
  ),
);

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

import { expect, test } from "@playwright/test";

test.setTimeout(120_000);

test("algebra signed tiles, modes, equivalent equation operations and degenerate systems", async ({ page }) => {
  await page.goto("/algebra/expressions");
  await page.getByRole("button", { name: "−x", exact: true }).click();
  await expect(page.getByLabel("x coefficient", { exact: true })).toHaveValue("0");
  await page.getByRole("button", { name: "−1", exact: true }).click();
  await expect(page.getByLabel("Constant", { exact: true })).toHaveValue("-3");
  await page.getByRole("button", { name: "Expand", exact: true }).click();
  await page.getByLabel("Expression to expand").fill("(x+3)^2");
  await expect(page.getByRole("heading", { name: "Expand result" }).locator("..")).toContainText("6*x");
  await page.goto("/algebra/equations");
  const solution = page.getByRole("heading", { name: "Solution & Validation" }).locator("..");
  await expect(solution).toContainText("x = -6");
  await page.getByRole("button", { name: "Multiply", exact: true }).click();
  await page.getByLabel("Operation operand").fill("2");
  await page.getByRole("button", { name: "Multiply", exact: true }).click();
  await expect(page.getByLabel("a", { exact: true })).toHaveValue("6");
  await expect(solution).toContainText("x = -6");
  await page.getByLabel("Operation operand").fill("0");
  await page.getByRole("button", { name: "Divide", exact: true }).click();
  await expect(page.locator('p[role="status"]')).toContainText("nonzero");
  await page.getByRole("button", { name: "Inequalities", exact: true }).click();
  await page.getByLabel("a", { exact: true }).fill("-2");
  await expect(solution).toContainText("sign reversed");
  await page.goto("/algebra/systems");
  await page.getByRole("button", { name: "None", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Solution classification" }).locator("..")).toContainText("No solution: parallel lines");
  await page.getByRole("button", { name: "Infinite", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Solution classification" }).locator("..")).toContainText("Infinite solutions");
});

test("algebra polynomial degree, sequence grading, symbolic proof and CAS computation", async ({ page }) => {
  await page.goto("/algebra/polynomials");
  await page.getByRole("button", { name: "3", exact: true }).click();
  await expect(page.getByLabel("Root", { exact: false })).toHaveCount(3);
  await page.getByRole("button", { name: "End Behavior", exact: true }).click();
  await expect(page.getByRole("heading", { name: "End Behavior analysis" }).locator("..")).toContainText("Left falls; right rises");
  await page.goto("/algebra/sequences");
  await page.getByLabel("Your answer", { exact: true }).fill("79");
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.locator('p[role="status"]')).toContainText("Correct.");
  await page.getByLabel("Common difference").fill("2");
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.locator('p[role="status"]')).toContainText("Not yet");
  await page.getByRole("button", { name: "Geometric", exact: true }).click();
  await expect(page.getByLabel("Common ratio")).toBeVisible();
  await page.goto("/algebra/proof");
  await page.getByLabel("Statement", { exact: true }).fill("a^2+b^2");
  await page.getByRole("button", { name: "Add to proof" }).click();
  await expect(page.locator('p[role="status"]')).toContainText("not equivalent");
  await page.getByLabel("Statement", { exact: true }).fill("a^2+2*a*b+b^2");
  await page.getByRole("button", { name: "Add to proof" }).click();
  await expect(page.locator('p[role="status"]')).toContainText("verified symbolically");
  await page.goto("/algebra/cas");
  await page.getByRole("button", { name: "Compute Solve" }).click();
  await expect(page.getByRole("heading", { name: "Solve result" }).locator("..")).toContainText("5");
  await page.getByRole("button", { name: "Expand", exact: true }).click();
  await page.getByLabel("CAS expression").fill("(x+2)^2");
  await page.getByRole("button", { name: "Compute Expand" }).click();
  await expect(page.getByRole("heading", { name: "Expand result" }).locator("..")).toContainText("4*x");
});

test("all Algebra modes produce a mode-specific surface", async ({ page }) => {
  for (const route of ["expressions", "equations", "functions", "polynomials", "systems", "exponents-logs", "sequences", "proof", "cas"]) {
    await page.goto(`/algebra/${route}`);
    const tabs = page.getByRole("navigation", { name: "Lab modes" }).getByRole("button");
    const names = await tabs.allTextContents();
    for (const name of names) {
      await page.getByRole("navigation", { name: "Lab modes" }).getByRole("button", { name, exact: true }).click();
      await expect(page.getByRole("navigation", { name: "Lab modes" }).getByRole("button", { name, exact: true })).toHaveAttribute("aria-pressed", "true");
      await expect(page.locator(".alg-page .alg-card").first()).toBeVisible();
    }
  }
});

test("geometry examples grade their own quantities and theorems change construction", async ({ page }) => {
  await page.goto("/geometry?tab=accuracy");
  for (const [title, answer] of [["Triangle area", "12"], ["Pythagorean check", "0"], ["Circle equation", "25"], ["Cube diagonal", "6.9282"]]) {
    await page.getByRole("button", { name: title, exact: true }).click();
    await expect(page.getByRole("img", { name: `${title} diagram` })).toBeVisible();
    await page.getByLabel("Your answer", { exact: true }).fill(answer);
    await page.getByRole("button", { name: "Check answer", exact: true }).click();
    await expect(page.locator('p[role="status"]')).toContainText("Correct within tolerance");
  }
  await page.goto("/geometry?tab=theorems");
  await page.getByRole("button", { name: "Thales' Theorem", exact: true }).click();
  await expect(page.locator(".gu-workspace-frame output")).toContainText("90.000°");
  await expect(page.getByRole("img", { name: "Thales' Theorem construction" }).locator("ellipse")).toHaveCount(1);
  await page.getByRole("button", { name: "Law of Cosines", exact: true }).click();
  await expect(page.locator(".gu-workspace-frame output")).toContainText("c² = 64.000");
  await page.getByRole("button", { name: "Proof", exact: true }).click();
  await page.getByRole("button", { name: "Animate proof", exact: true }).click();
  await expect(page.getByText("Step 2:", { exact: false })).toBeVisible({ timeout: 5000 });
});

test("project undo, save, restore and encoded link reopen the project", async ({ page }) => {
  await page.goto("/studio-projects");
  await page.getByLabel("Project title").fill("First investigation");
  await page.getByRole("button", { name: "Checkpoint", exact: true }).click();
  await page.getByLabel("Project title").fill("Second investigation");
  await page.getByRole("button", { name: "Checkpoint", exact: true }).click();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(page.getByLabel("Project title")).toHaveValue("First investigation");
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(page.getByLabel("Project title")).toHaveValue("Second investigation");
  await page.getByRole("button", { name: "Save project locally" }).click();
  await page.getByLabel("Project title").fill("Unsaved");
  await page.getByRole("button", { name: "Open saved project" }).click();
  await expect(page.getByLabel("Project title")).toHaveValue("Second investigation");
  const link = JSON.parse(await page.locator('[data-enhancement-id="PLATFORM-02"] output').innerText()) as string;
  await page.goto(link);
  await expect(page.getByLabel("Project title")).toHaveValue("Second investigation");
});

test("studio mode links survive reload and Back", async ({ page }) => {
  await page.goto("/linear-algebra?mode=eigenvectors");
  await expect(page.locator(".la-mode-tabs button.active")).toHaveText("Eigenvectors", { timeout: 60000 });
  await page.getByRole("button", { name: "Matrix Transform", exact: true }).click();
  await page.reload();
  await expect(page.locator(".la-mode-tabs button.active")).toHaveText("Matrix Transform");
  await page.goBack();
  await expect(page.locator(".la-mode-tabs button.active")).toHaveText("Eigenvectors");
  await page.goto("/discrete-world?workbench=grammar");
  await expect(page.getByRole("heading", { name: /Grammar/ }).first()).toBeVisible();
});

test("trigonometry animation advances the model and pauses", async ({ page }) => {
  await page.goto("/trigonometry");
  const angle = page.getByRole("slider", { name: "Angle theta", exact: true });
  await expect(angle).toBeVisible({ timeout: 60_000 });
  const initial = await angle.inputValue();
  await page.getByRole("button", { name: "2D play animation", exact: true }).click();
  await expect(angle).not.toHaveValue(initial);
  await page.getByRole("button", { name: "2D pause animation", exact: true }).click();
  const paused = await angle.inputValue();
  await page.getByRole("button", { name: "2D zoom in", exact: true }).click();
  await expect(angle).toHaveValue(paused);
});

test("complex controls and statistics dataset recalculate results", async ({ page }) => {
  await page.goto("/complex-numbers");
  const angle = page.getByRole("slider", { name: "Rotate z1" });
  await angle.focus();
  await angle.press("Home");
  await expect(angle).toHaveValue("0");
  await expect(page.locator(".complex-tab-content")).toContainText("0 deg");
  await page.getByRole("button", { name: "Reset to 1 + i√3" }).click();
  await expect(angle).toHaveValue("60");
  await page.goto("/probability-statistics?tab=advanced");
  await page.getByLabel("Linked numeric dataset").fill("2,4,6,8");
  const summary = page.locator('[data-enhancement-id="STAT-02"] output');
  await expect(summary).toContainText('"mean":5');
  await page.getByLabel("Linked numeric dataset").fill("10,20,30");
  await expect(summary).toContainText('"mean":20');
});

test("discrete invalid expressions show validation instead of another automaton", async ({ page }) => {
  await page.goto("/discrete-world?workbench=regex-pda");
  await page.getByLabel("Regular expression", { exact: true }).fill("(");
  await expect(page.getByRole("alert")).toBeVisible();
  await page.getByLabel("Regular expression", { exact: true }).fill("a(b|c)*");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByText("Thompson NFA:", { exact: false })).toBeVisible();
});

test("modelling preserves declared rate, initial value and fixed reference observations", async ({ page }) => {
  await page.goto("/mathematical-modelling?model=linear&initial=12&rate=0.5&time=6");
  const prediction = page.getByText("Prediction", { exact: true }).locator("..");
  await expect(prediction).toContainText("15.00");
  const samples = await page.locator('svg circle[r="4"]').evaluateAll((circles) => circles.map((circle) => circle.getAttribute("cy")));
  await page.getByRole("slider", { name: "Rate", exact: true }).focus();
  await page.getByRole("slider", { name: "Rate", exact: true }).press("Home");
  await expect(prediction).toContainText("10.80");
  expect(await page.locator('svg circle[r="4"]').evaluateAll((circles) => circles.map((circle) => circle.getAttribute("cy")))).toEqual(samples);
  await page.goto("/mathematical-modelling?model=logistic&initial=60&capacity=40&time=0");
  await expect(prediction).toContainText("60.00");
});

test("geometry solids use their own measurements and net faces", async ({ page }) => {
  await page.goto("/geometry?tab=solids&solid=tetrahedron&v_size_radius=4");
  await page.getByRole("button", { name: "Net", exact: true }).first().click();
  await expect(page.getByRole("img", { name: "tetrahedron net" })).toBeVisible();
  await page.getByRole("button", { name: "Face 2", exact: true }).click();
  await expect(page.locator(".gu-inspector output")).toContainText("Face 2: area 6.928");
  await page.getByRole("button", { name: "Prism", exact: true }).click();
  await expect(page.getByRole("img", { name: "prism net" })).toBeVisible();
  await page.getByRole("tab", { name: "Properties", exact: true }).click();
  await expect(page.locator(".gu-inspector")).toContainText("27.71");
});

test("shared slider locks enforce editing and undo stays with the focused slider", async ({ page }) => {
  await page.goto("/trigonometry");
  const angle = page.getByLabel("Angle theta exact value"), radius = page.getByLabel("Radius / scale exact value");
  await angle.fill("60");
  await radius.fill("130");
  await angle.focus();
  await angle.press("Control+z");
  await expect(angle).toHaveValue("45");
  await expect(radius).toHaveValue("130");
  await page.getByRole("button", { name: "Lock Angle theta", exact: true }).click();
  await expect(angle).toBeDisabled();
  await expect(page.getByRole("slider", { name: "Angle theta", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Unlock Angle theta", exact: true }).click();
  await expect(angle).toBeEnabled();
});

for (const [route, dimension] of [["/math-lab/graphing-calculator", "2D"], ["/math-lab/3d-graphing", "3D"]]) {
  test(`graph studio Help opens and closes: ${dimension}`, async ({ page }) => {
    await page.goto(route);
    await page.getByRole("button", { name: "Help", exact: true }).click();
    await expect(page.getByRole("dialog", { name: `${dimension} graph learning help` })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: `${dimension} graph learning help` })).toHaveCount(0);
  });
}

test("repaired studio controls remain usable on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/algebra/equations");
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("combobox", { name: "Text size", exact: true }).selectOption("large");
  await page.getByRole("button", { name: "Settings", exact: true }).click();
  await page.getByRole("button", { name: "Inequalities", exact: true }).click();
  await expect(page.getByRole("combobox", { name: "Relation", exact: true })).toBeVisible();
  await page.screenshot({ path: "artifacts/studio-control-audit/algebra-mobile.png", fullPage: true });
  await page.goto("/geometry?tab=accuracy");
  await page.getByRole("button", { name: "Triangle area", exact: true }).click();
  await page.getByLabel("Your answer", { exact: true }).fill("12");
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.locator('p[role="status"]')).toContainText("Correct");
  await page.screenshot({ path: "artifacts/studio-control-audit/geometry-mobile.png", fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true);
});

for (const [route, selector] of [["/trigonometry", ".trig-tabs"], ["/complex-numbers", ".complex-tabs"], ["/probability-statistics", ".stats-tabs"]]) {
  test(`studio sections open their own content: ${route}`, async ({ page }) => {
    await page.goto(route);
    const tabs = page.locator(selector).getByRole("tab");
    await expect(tabs.first()).toBeVisible({ timeout: 60_000 });
    for (const name of await tabs.allTextContents()) {
      const tab = tabs.filter({ hasText: name.trim() }).first();
      await tab.click();
      await expect(tab).toHaveAttribute("aria-selected", "true");
      await expect(page.locator("body")).not.toContainText("Unexpected Application Error");
    }
  });
}

for (const route of ["/calculus", "/calculus/limits", "/calculus/derivatives", "/calculus/integration", "/calculus/differential-equations", "/trigonometry", "/geometry", "/algebra", "/probability-statistics", "/linear-algebra", "/discrete-world", "/complex-numbers", "/mathematical-modelling", "/studio-projects", "/math-lab/graphing-calculator", "/math-lab/3d-graphing"]) {
  test(`studio route loads without application errors: ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(route);
    await expect(page.locator(route === "/trigonometry" ? ".trig-studio" : route.includes("math-lab/") ? ".graph-studio-3d-shell" : "h1").first()).toBeVisible({ timeout: 60_000 });
    await expect(page.locator("body")).not.toContainText("Unexpected Application Error");
    expect(errors).toEqual([]);
  });
}

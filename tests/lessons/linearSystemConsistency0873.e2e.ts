import { expect, test } from "@playwright/test";
const route = "/lessons/school/class-12/class-12-matrices-and-determinants-consistency-of-linear-systems";

test("0873 screenshot controls update equations, ranks and solution", async ({ page }) => {
  await page.goto(route);
  const lesson = page.getByTestId("school-mockup-0873");
  await expect(lesson).toHaveAttribute("data-case", "unique");
  const presets = lesson.locator(".lsc-preset-row");
  await presets.getByRole("button", { name: "Infinite", exact: true }).click();
  await expect(lesson).toHaveAttribute("data-case", "infinite");
  await lesson.getByRole("slider").fill("5");
  await expect(lesson).toHaveAttribute("data-case", "none");
  await expect(lesson).toHaveAttribute("data-rank-augmented", "2");
  await lesson.getByRole("button", { name: "Reset", exact: true }).click();
  await expect(lesson).toHaveAttribute("data-case", "unique");
  await expect(lesson.getByRole("spinbutton", { name: "Equation 1 x coefficient", exact: true })).toHaveValue("15");
  await expect(lesson.locator(".lsc-solution-values")).toHaveText(/x = 0\s*y = 2/);
  await lesson.getByRole("spinbutton", { name: "Equation 1 constant", exact: true }).fill("16");
  await expect(lesson.locator(".lsc-solution-values")).toHaveText(/x = 1\s*y = 1/);
  await lesson.getByRole("button", { name: "Try random system", exact: true }).click();
  const values = await lesson.getByRole("spinbutton").evaluateAll(inputs => inputs.map(input => Number((input as HTMLInputElement).value)));
  expect(values).toHaveLength(6);
  expect(values.every(value => Number.isInteger(value) && value >= -5 && value <= 5)).toBe(true);
});

test("0873 help and graph zoom respond", async ({ page }) => {
  await page.goto(route);
  const lesson = page.getByTestId("school-mockup-0873");
  const help = lesson.getByRole("button", { name: "How it works", exact: true });
  await help.click();
  await expect(lesson.locator(".lsc-how-wrap aside")).toBeVisible();
  await help.click();
  await expect(lesson.locator(".lsc-how-wrap aside")).toHaveCount(0);
  const line = lesson.locator(".lsc-geometry-panel .line-one");
  const initial = await line.getAttribute("y1");
  await lesson.getByRole("button", { name: "Zoom in", exact: true }).click();
  await expect(line).not.toHaveAttribute("y1", initial!);
  await lesson.getByRole("button", { name: "Reset graph view", exact: true }).click();
  await expect(line).toHaveAttribute("y1", initial!);
});

import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import NCERTDashboardPage from "./NCERTDashboardPage";
function renderDashboard(path: string) {
 return renderToStaticMarkup(<MemoryRouter initialEntries={[path]}><NCERTDashboardPage /></MemoryRouter>);
}
describe("shared curriculum dashboard", () => {
 it("links decimal operations to the published global lesson", () => {
  const html = renderDashboard("/curriculum?topic=class-7-decimal-operations");
  expect(html).toContain("Curriculum Dashboard");
  expect(html).toContain("80-decimal-operations");
  expect(html).not.toContain('href="/ncert');
 });
 it("exposes available solid-view lessons while keeping only fractals Upcoming", () => {
  const html = renderDashboard("/curriculum?topic=class-8-fractals-and-solid-views&status=upcoming");
  expect(html).toContain("Fractals and Solid Views");
  expect(html).toContain("1</strong> chapters");
  expect(html).toContain("2</strong> unique lessons");
  expect(html).toContain("Fractals and Sierpinski carpet");
  expect(html).toContain("411-orthographic-views");
 });
 it("renders class and chapter disclosure cards with expansion controls", () => {
  const html = renderDashboard("/curriculum");
  expect(html).toContain('class="curriculum-class"');
  expect(html).toContain('class="curriculum-chapter"');
  expect(html).toContain("Expand all");
  expect(html).toContain("Collapse all");
  expect(html).toContain("Class 6");
  expect(html).toContain("Class 12");
 });
 it("separates paper mapping from missing lessons", () => {
  const html = renderDashboard("/curriculum?topic=paper-map-Class%2011");
  expect(html).toContain("Mapping pending");
  expect(html).toContain("0</strong> upcoming lessons");
  expect(html).not.toContain('class="curriculum-status-upcoming"');
 });
 it("links shared AP practice without claiming exact textbook assessment alignment", () => {
  const html = renderDashboard("/curriculum?topic=30271");
  expect(html).toContain("Shared practice available");
  expect(html).toContain("Exact textbook exercise sets and board assessments");
  expect(html).not.toContain('class="curriculum-status-upcoming"');
 });
 it("shows direct work coverage alongside the missing energy and power topics", () => {
  const html = renderDashboard("/curriculum?topic=workbook-row-1316");
  expect(html).toContain("Partly covered");
  expect(html).toContain("190-dot-product");
  expect(html).toContain("Energy conservation and power");
  expect(html).toContain("Kinetic/potential energy");
 });
 it("keeps physical momentum Upcoming while linking its mathematical prerequisites", () => {
  const html = renderDashboard("/curriculum?topic=workbook-row-1310");
  expect(html).toContain("Mechanics: Momentum");
  expect(html).toContain("physical momentum p = mv");
  expect(html).toContain("183-vector-introduction");
  expect(html).not.toContain("32023-sgd-momentum");
 });
});

export type DedicatedTab = "interact" | "learn" | "example" | "formula" | "practice";

const TAB_ATTR = "data-lesson-tab";
const HIDDEN_ATTR = "data-tab-hidden";

export function normalizeLessonTab(label: string): DedicatedTab | null {
  const text = label
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, " ")
    .trim();
  if (!text) return null;
  if (/^(reset|hint|check|share|workspace|school lessons|advanced lessons)/.test(text)) {
    return null;
  }
  if (/interact|interaction|visualization/.test(text)) return "interact";
  if (/^learn\b|^explain\b/.test(text)) return "learn";
  if (/\bexample/.test(text)) return "example";
  if (/\bformula/.test(text)) return "formula";
  if (/\bpractice\b|know more/.test(text)) return "practice";
  return null;
}

export function classifyLessonPanel(heading: string, className = ""): DedicatedTab[] {
  const text = `${heading} ${className}`.toLowerCase();
  if (
    /workbench|builder|lab\b|observe|manipulat|place grid|statement cards|assumed|proved|explore board/.test(
      text,
    )
  ) {
    return ["interact"];
  }
  if (/worked example|\bexample\b/.test(text)) return ["example"];
  if (/key rules|\bformula|formulae|\brules\b/.test(text)) return ["formula"];
  if (/practice|mini challenge|your challenge|try independently|counterexample/.test(text)) {
    return ["practice"];
  }
  if (
    /why it works|why it matters|misconception|remember|common mistake|key idea|learn|understand/.test(
      text,
    )
  ) {
    return ["learn"];
  }
  if (/evidence viewer|chain overview|proof/.test(text)) return ["learn"];
  return ["interact"];
}

function headingText(element: HTMLElement) {
  const heading = element.querySelector("h2, h3, b");
  return (heading?.textContent ?? element.textContent ?? "").slice(0, 80);
}

function isChrome(element: HTMLElement) {
  return Boolean(
    element.closest(
      "header, nav, [class*='-hero'], [class*='-tabs'], [class*='-adjacent'], [data-lesson-study-board], .lesson-topic-study-board, [data-lesson-simple-english]",
    ),
  );
}

function collectBlocks(page: Element) {
  const nodes = [
    ...page.querySelectorAll<HTMLElement>(
      ":scope > main, :scope > section, :scope > article, :scope > aside, main > *, main article, main section, main aside",
    ),
  ].filter((element) => !isChrome(element));
  return nodes.filter(
    (element) =>
      !nodes.some(
        (other) =>
          other !== element &&
          element.contains(other) &&
          Boolean(other.querySelector("h2, h3")),
      ),
  );
}

function findPage(root: HTMLElement) {
  return (
    root.querySelector<HTMLElement>(
      "[class$='-page'], [data-dedicated-lesson], [data-testid^='school-mockup'], [data-testid^='advanced-mockup']",
    ) ?? root
  );
}

export function applyDedicatedTabVisibility(root: HTMLElement, rawTab: string) {
  const tab = normalizeLessonTab(rawTab);
  if (!tab) return;
  const page = findPage(root);
  page.setAttribute(TAB_ATTR, tab);
  const blocks = collectBlocks(page);
  for (const block of blocks) {
    const panels = classifyLessonPanel(headingText(block), block.className);
    const show = tab === "interact" || panels.includes(tab);
    if (show) block.removeAttribute(HIDDEN_ATTR);
    else block.setAttribute(HIDDEN_ATTR, "true");
  }
  if (tab !== "interact") {
    const firstVisible = blocks.find((block) => block.getAttribute(HIDDEN_ATTR) !== "true");
    firstVisible?.scrollIntoView({ block: "nearest" });
  }
}

export function readActiveLessonTab(root: HTMLElement) {
  const page = findPage(root);
  const active = page.querySelector<HTMLElement>(
    "nav[class*='-tabs'] button.active, nav[class*='-tabs'] button[aria-selected='true'], nav[class*='-tabs'] button[aria-current], nav[aria-label*='section' i] button.active, nav[aria-label*='section' i] button[aria-current]",
  );
  return active?.textContent?.trim() ?? "Interact";
}

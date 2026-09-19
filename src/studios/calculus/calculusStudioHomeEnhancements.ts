export type CalculusHomeEnhancementKind = "ui" | "ux";

export type CalculusHomeEnhancement = {
  id: string;
  kind: CalculusHomeEnhancementKind;
  title: string;
  detail: string;
};

const rows: Array<[CalculusHomeEnhancementKind, string, string]> = [
  ["ui", "Welcome hero that names the studio", "Keep “Welcome to Calculus Studio” and a one-line promise so home feels like a learning lobby, not a lab dump."],
  ["ui", "Command search under the title", "Full-width search with Ctrl+K, calculus examples (limits, FTC, Taylor), and instant route hits."],
  ["ui", "Nine numbered topic cards", "A 3×3 Explore-by-topic grid matching the dedicated labs, each with a preview drawing and a go arrow."],
  ["ui", "Color-coded topic numbers", "Cyan / violet / green badges so Limits, Derivatives, and Integrals are scannable at a glance."],
  ["ui", "Continue-experiment rail", "Resume the last graph with title, formula, mini-preview, and last-used time."],
  ["ui", "Journey stats that count real work", "Topics / 9, experiments run, challenges / 18, streak days, and XP from completed modes."],
  ["ui", "Challenge of the day card", "A calculus prompt with a typeset formula, New badge, +50 XP, and Take challenge."],
  ["ui", "Observe–Understand–Why–Try–Challenge strip", "Five home pills that jump to the grid, a starter lab, FTC, last experiment, or the daily challenge."],
  ["ui", "MAIN pill in the sidebar", "A gradient Main control that always leaves the studio, separate from Studio Home."],
  ["ui", "Streak and XP chips in the header", "Flame and star chips so progress is visible before scrolling."],
  ["ux", "Keys 1–9 open labs", "From home, number keys launch the matching topic card without focusing search."],
  ["ux", "Hide Unlock Pro on home", "Keep the lobby uncluttered; Pro stays on lab pages only."],
  ["ux", "Search that understands formulas", "Match lim, f', ∫, FTC, ε–δ, and common misspellings, not only lab titles."],
  ["ux", "Suggested next lab", "If topics explored is 0, highlight Limits; otherwise recommend the first unfinished card."],
  ["ui", "Visited check on topic cards", "A small check or progress ring on cards the learner has already opened."],
  ["ux", "Resume deep-links with mode", "Continue should restore ?mode= as well as the lab route."],
  ["ui", "KaTeX on the daily challenge", "Render the limit (and later integrals) as real math, not a serif approximation."],
  ["ux", "Guess on home, then open the lab", "Let learners type 4 on home, then Take challenge to see the ε–δ picture of the same limit."],
  ["ui", "Rotating challenge bank of 18", "One prompt per weekday spanning limits through vector calculus, not a single static limit."],
  ["ux", "Explain-why after a miss", "If the guess is 0 or DNE, show the factor-and-cancel hint before opening Limits."],
  ["ui", "Path map above the grid", "A thin Limits → Derivatives → Integrals → DE → Series ribbon so order is visible."],
  ["ux", "Time-on-task estimates", "8–12 min labels on cards, measured from real sessions when possible."],
  ["ui", "Empty-state coaching", "When XP is 0, a single sentence: “Start with Limits — press 1.”"],
  ["ux", "Screen-reader live region for search", "Announce hit count and the first result after debounce."],
  ["ui", "High-contrast card borders", "Focus rings that survive the cyan–violet gradients on Main and Resume."],
  ["ux", "Reduced-motion home", "Disable card lift and smooth-scroll; keep instant jumps."],
  ["ui", "Dark-theme home completeness", "Topic previews, chips, and pills must not stay paper-white in dark mode."],
  ["ux", "Teacher projection mode", "Hide XP and challenges; enlarge the 3×3 grid for a classroom display."],
  ["ui", "Curriculum tags on cards", "NCERT / AP / A-level chips so a class can filter the nine labs."],
  ["ux", "Cross-studio “why leave” chips", "From home, offer Complex roots, Algebra CAS, and Physics motion with a one-line reason."],
  ["ui", "Saved experiments list", "Named snapshots under Continue, not only the last route."],
  ["ux", "Offline-friendly lobby", "Home should render cards and search from local catalog if the network is slow."],
  ["ui", "Printable warm-up sheet", "Challenge of the day plus the nine topic names as a one-page PDF."],
  ["ux", "Announce XP changes", "When a challenge is solved, a polite aria-live “+50 XP, streak 2”."],
  ["ui", "Topic card illustrations that teach", "Each preview should show the core picture: hole, tangent, area, slope field, Taylor overlay."],
  ["ux", "Skip-to-challenge landmark", "A skip link for keyboard users who want the daily problem first."],
  ["ui", "Mobile: stacked rail after the grid", "Continue / journey / challenge under the cards, pills as a horizontal snap row."],
  ["ux", "Don’t steal number keys while typing", "1–9 only launch labs when the search field is not focused."],
  ["ui", "Studio Home vs Main labels", "Studio Home stays the current page; Main always returns to Math Universe."],
  ["ux", "Progress “View progress” that actually scrolls", "Anchor to the topic grid and highlight unfinished cards."],
  ["ui", "Challenge New badge that expires", "Hide New after the first view that day so it stays meaningful."],
  ["ux", "Streak freeze on timezone edges", "Use the local day key already in session storage; show “streak saved” at 11:50pm."],
  ["ui", "XP that maps to modes", "10 XP per completed mode, 50 for the daily challenge, shown in the chip and the rail."],
  ["ux", "First-run 60-second tour", "Search → card 1 → challenge, then dismiss forever."],
  ["ui", "Glossary drawer from home", "Limit, derivative, integral, FTC, series — each with a 10-second visual."],
  ["ux", "Parent/teacher summary", "One paragraph: labs visited, last challenge, recommended next topic."],
  ["ui", "Consistent 22px card radius", "Match Complex Numbers Studio so the product family feels one app."],
  ["ux", "Error illustration for empty search", "A hole in a graph, not a generic “no results” string only."],
  ["ui", "Lab count in the brand", "Optional 9 labs under Calculus Studio so the map feels finite and finishable."],
  ["ux", "Share home with a class code", "A link that opens /calculus with a highlighted challenge and a forced starter lab."],
  ["ui", "Accessible hit targets 44px", "Topic arrows, Resume, Take challenge, and pills meet touch size."],
  ["ux", "Don’t auto-play graphs on home", "Static previews only; motion waits until a lab is open."],
  ["ui", "Challenge formula aria-label", "Human sentence for the limit, not “lim x 2 x 2 4”."],
  ["ux", "Remember collapsed sidebar", "Home should restore the learner’s last nav width."],
  ["ui", "Footer learning loop as buttons", "Pills are real controls, not decorative copy."],
];

export const calculusStudioHomeEnhancements: CalculusHomeEnhancement[] = rows.map(([kind, title, detail], index) => ({
  id: `calc-home-${String(index + 1).padStart(2, "0")}`,
  kind,
  title,
  detail,
}));

export function calculusHomeEnhancementCounts() {
  return {
    total: calculusStudioHomeEnhancements.length,
    ui: calculusStudioHomeEnhancements.filter((item) => item.kind === "ui").length,
    ux: calculusStudioHomeEnhancements.filter((item) => item.kind === "ux").length,
  };
}

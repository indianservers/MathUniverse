# Focused studio labs

Shared studio lab pages now expose only Studio Home Page and Main App Home Page in their global navigation. Previous Studio / Lessons, practice & reference / All studios links and global model-tools row were removed. Lab-local tools remain available. Left navigation sidebars and cross-lab topic strips are hidden, and the vacated layout columns collapse so the active lab uses the full width. Studio collection/home pages keep their collection navigation.

Tabs: What it means; Interactive workspace; Common use cases; Quiz; Theory & more. All five oblique-trigonometry subpages have populated tabs. Shared theory content supplies simple explanations, real-time examples and practice when a lab lacks its own separate section. Pages without separate content omit the unavailable tab instead of presenting an empty panel.

Tab switches hide presentation sections while retaining the mounted React model components. Model state, graph controls, entered values and quiz answers remain available when returning. Keyboard arrow/Home/End navigation and tab/panel ARIA relationships are supported. Native links still work. Existing theory and original fixed-concept practice are retained.

Validation:
- Twelve representative routes across trigonometry, oblique trigonometry, inverse trigonometry, geometry, Number Systems, calculus and linear algebra: no visible former navigation sidebars, no mobile horizontal overflow, no browser errors.
- All five oblique subpages: populated meaning/workspace/use-case/quiz/more sections.
- Area side b = 12 survives switching to Quiz and back.
- Geometry workspace is visible only in its workspace tab.
- Number Systems retains the two visible global home links despite its former header-hiding CSS.
- Scoped checks pass for the new tab adapter and theory integration. The store bridge retains its existing exhaustive-deps lint warning; this change does not alter that effect.
- Production build passes with the existing large-chunk advisory.

Evidence: verified-final.json, regression.json, typecheck.log, lint.log, build-final.log and screenshots. Presentation adapts shared semantic panels; custom pages without distinct sections retain their available workspace/theory categories. Route inventories and core mathematics were not replaced.

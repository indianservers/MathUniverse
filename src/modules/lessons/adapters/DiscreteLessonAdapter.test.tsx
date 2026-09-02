import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { lessonCatalog } from "../catalog/lessonCatalog";
import DiscreteLessonAdapter from "./DiscreteLessonAdapter";

describe("discrete lesson adapter", () => {
  it("renders every discrete preset without an unrelated fallback", () => {
    const lessons = lessonCatalog.filter(
      (lesson) => lesson.adapter === "discrete",
    );
    expect(lessons).toHaveLength(35);
    for (const lesson of lessons) {
      const html = renderToStaticMarkup(
        <DiscreteLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html, `lesson ${lesson.id}`).toContain(
        lesson.title.replace("'", "&#x27;"),
      );
      expect(html, `lesson ${lesson.id}`).not.toContain(
        "Unsupported discrete preset",
      );
      expect(html, `lesson ${lesson.id}`).toMatch(/button|input|select/);
    }
  });
  it("does not render shortest-path language for unrelated set concepts", () => {
    for (const id of [582, 583, 584, 585, 586, 587, 588, 589, 590]) {
      const lesson = lessonCatalog.find((candidate) => candidate.id === id)!;
      const html = renderToStaticMarkup(
        <DiscreteLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html).not.toContain("Dijkstra");
      expect(html).not.toContain("shortest distance");
    }
  });
  it("uses the dedicated three-stage counting tree for lesson 556", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 556)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0613"');
    expect(html).toContain(
      "dedicated-three-stage-cartesian-product-wardrobe-tree",
    );
    expect(html).toContain('data-total="12"');
    expect(html).toContain('data-meal-total="12"');
  });
  it("uses the dedicated distinct-arrangement tray for lesson 557", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 557)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0614"');
    expect(html).toContain("dedicated-distinct-object-drag-drop-arrangement");
    expect(html).toContain('data-total="120"');
    expect(html).toContain('data-slots="_____"');
    expect(html).toContain('data-challenge-total="5040"');
  });
  it("uses the dedicated ordered-selection lab for lesson 558", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 558)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0615"');
    expect(html).toContain(
      "dedicated-ordered-selection-drag-drop-permutation-history-choice-tree",
    );
    expect(html).toContain('data-total="20"');
    expect(html).toContain('data-slots="__"');
    expect(html).toContain('data-practice-total="12"');
  });
  it("uses the dedicated multiset arrangement lab for lesson 559", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 559)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0616"');
    expect(html).toContain("dedicated-multiset-repeated-item-drag-drop");
    expect(html).toContain('data-total="30"');
    expect(html).toContain('data-generated-count="30"');
    expect(html).toContain('data-challenge-total="180"');
  });
  it("uses the dedicated circular seating lab for lesson 560", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 560)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0617"');
    expect(html).toContain(
      "dedicated-circular-seat-drag-swap-rotation-equivalence",
    );
    expect(html).toContain('data-total="24"');
    expect(html).toContain('data-arrangement="ABCDE"');
    expect(html).toContain('data-challenge-total="720"');
  });
  it("uses the dedicated unordered basket lab for lesson 561", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 561)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0618"');
    expect(html).toContain(
      "dedicated-unordered-selection-basket-combination-permutation-relation",
    );
    expect(html).toContain('data-combinations="10"');
    expect(html).toContain('data-selected="BD"');
    expect(html).toContain('data-challenge-total="35"');
  });
  it("uses the dedicated binomial triangle lab for lesson 562", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 562)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0619"');
    expect(html).toContain(
      "dedicated-binomial-coefficient-selectable-pascal-triangle",
    );
    expect(html).toContain('data-rows="7"');
    expect(html).toContain('data-selected="4,2"');
    expect(html).toContain('data-value="6"');
  });
  it("uses the dedicated overlap counter lab for lesson 563", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 563)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0620"');
    expect(html).toContain(
      "dedicated-draggable-counter-venn-region-assignment",
    );
    expect(html).toContain('data-a="4"');
    expect(html).toContain('data-b="4"');
    expect(html).toContain('data-overlap="2"');
    expect(html).toContain('data-union="6"');
  });
  it("uses the dedicated pigeon-to-hole lab for lesson 564", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 564)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0621"');
    expect(html).toContain(
      "dedicated-pigeon-to-hole-drag-distribution-ceiling-guarantee",
    );
    expect(html).toContain('data-n="7"');
    expect(html).toContain('data-k="5"');
    expect(html).toContain('data-guarantee="2"');
    expect(html).toContain('data-challenge-total="3"');
  });
  it("uses the dedicated editable graph canvas for lesson 565", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 565)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0622"');
    expect(html).toContain("dedicated-editable-vertex-edge-svg-graph");
    expect(html).toContain('data-vertices="5"');
    expect(html).toContain('data-edges="7"');
    expect(html).toContain('data-degree-sum="14"');
  });
  it("uses the dedicated directed graph analysis surface for lesson 566", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 566)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0623"');
    expect(html).toContain(
      "dedicated-directed-graph-degree-reachability-path-model",
    );
    expect(html).toContain('data-source="A"');
    expect(html).toContain('data-sink="E"');
    expect(html).toContain('data-edge-count="7"');
  });
  it("uses the dedicated weighted shortest-path surface for lesson 567", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 567)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0624"');
    expect(html).toContain(
      "dedicated-weighted-drag-graph-dijkstra-route-model",
    );
    expect(html).toContain('data-cheapest-path="A,B,E"');
    expect(html).toContain('data-cheapest-cost="4"');
    expect(html).toContain('data-edge-count="7"');
  });
  it("uses the dedicated vertex-degree multigraph surface for lesson 568", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 568)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0625"');
    expect(html).toContain("dedicated-multigraph-degree-loop-handshake-model");
    expect(html).toContain('data-selected-degree="13"');
    expect(html).toContain('data-edge-count="19"');
    expect(html).toContain('data-degree-sum="38"');
  });
  it("uses the dedicated path and cycle tracing surface for lesson 569", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 569)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0626"');
    expect(html).toContain("dedicated-weighted-walk-trail-path-cycle-model");
    expect(html).toContain('data-walk="A,B,C"');
    expect(html).toContain('data-length="5"');
    expect(html).toContain('data-shortest-cycle-length="8"');
  });
  it("uses the dedicated connected-components surface for lesson 570", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 570)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0627"');
    expect(html).toContain(
      "dedicated-component-partition-reachability-cluster-drag-model",
    );
    expect(html).toContain('data-component-count="3"');
    expect(html).toContain('data-component-sizes="3,3,1"');
    expect(html).toContain('data-reachable="false"');
  });
  it("uses the dedicated Euler trail surface for lesson 571", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 571)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0628"');
    expect(html).toContain("dedicated-euler-edge-consumption-degree-model");
    expect(html).toContain('data-edge-count="5"');
    expect(html).toContain('data-euler-kind="circuit"');
    expect(html).toContain('data-used-count="0"');
  });
  it("uses the dedicated Hamiltonian route surface for lesson 572", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 572)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0629"');
    expect(html).toContain("dedicated-hamiltonian-vertex-route-search-model");
    expect(html).toContain('data-route="A,B,C"');
    expect(html).toContain('data-visited-count="3"');
    expect(html).toContain('data-can-complete="true"');
  });
  it("uses the dedicated mutable tree surface for lesson 573", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 573)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0630"');
    expect(html).toContain("dedicated-rooted-tree-invariant-builder-model");
    expect(html).toContain('data-vertex-count="8"');
    expect(html).toContain('data-edge-count="7"');
    expect(html).toContain('data-height="3"');
    expect(html).toContain('data-leaves="D,F,G,H"');
  });
  it("uses the dedicated minimum-spanning-tree surface for lesson 574", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 574)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0631"');
    expect(html).toContain("dedicated-union-find-mst-selection-model");
    expect(html).toContain('data-optimal-weight="6"');
    expect(html).toContain('data-selected-count="0"');
    expect(html).toContain('data-algorithm="kruskal"');
  });
  it("uses the dedicated Dijkstra shortest-path surface for lesson 575", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 575)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0632"');
    expect(html).toContain("dedicated-dijkstra-relaxation-state-model");
    expect(html).toContain('data-source="A"');
    expect(html).toContain('data-target="E"');
    expect(html).toContain('data-current="A"');
    expect(html).toContain('data-target-distance="Infinity"');
  });
  it("uses the dedicated graph-colouring surface for lesson 576", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 576)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0633"');
    expect(html).toContain(
      "dedicated-greedy-vertex-colouring-conflict-chromatic-model",
    );
    expect(html).toContain('data-conflict-count="0"');
    expect(html).toContain('data-colour-count="3"');
    expect(html).toContain('data-edge-count="7"');
    expect(html).toContain('data-chromatic-number="3"');
  });
  it("uses the dedicated bipartite-graph surface for lesson 577", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 577)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0634"');
    expect(html).toContain(
      "dedicated-bfs-two-colour-drag-partition-odd-cycle-model",
    );
    expect(html).toContain('data-set-a="2"');
    expect(html).toContain('data-set-b="3"');
    expect(html).toContain('data-edge-count="4"');
    expect(html).toContain('data-bipartite="true"');
  });
  it("uses the dedicated planar-graph surface for lesson 578", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 578)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0635"');
    expect(html).toContain(
      "dedicated-segment-crossing-planarity-euler-history-model",
    );
    expect(html).toContain('data-kind="k5"');
    expect(html).toContain('data-vertex-count="5"');
    expect(html).toContain('data-edge-count="10"');
    expect(html).toContain('data-planar="false"');
  });
  it("uses the dedicated network-flow surface for lesson 579", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 579)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0636"');
    expect(html).toContain(
      "dedicated-residual-edmonds-karp-capacity-conservation-model",
    );
    expect(html).toContain('data-flow-value="5"');
    expect(html).toContain('data-max-flow="5"');
    expect(html).toContain('data-conserved="true"');
    expect(html).toContain('data-maximum="true"');
  });
  it("uses the dedicated travelling-salesperson surface for lesson 580", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 580)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0637"');
    expect(html).toContain(
      "dedicated-exhaustive-hamiltonian-weighted-tour-model",
    );
    expect(html).toContain('data-distance="15"');
    expect(html).toContain('data-optimum="15"');
    expect(html).toContain('data-complete="true"');
  });
  it("uses the dedicated adjacency-matrix surface for lesson 581", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 581)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0638"');
    expect(html).toContain(
      "dedicated-synchronized-graph-adjacency-matrix-model",
    );
    expect(html).toContain('data-edge-count="7"');
    expect(html).toContain('data-degrees="2,4,2,3,3"');
    expect(html).toContain('data-degree-sum="14"');
  });
  it("uses the dedicated set-builder surface for lesson 582", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 582)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0639"');
    expect(html).toContain("dedicated-integer-domain-predicate-filter-model");
    expect(html).toContain('data-result="-4,-2,0,2,4"');
    expect(html).toContain('data-result-count="5"');
    expect(html).toContain('data-domain="-5,5"');
  });
  it("uses the dedicated set-operations surface for lesson 583", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 583)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0640"');
    expect(html).toContain("dedicated-two-set-venn-operation-model");
    expect(html).toContain('data-union="1,2,3,4,5,6"');
    expect(html).toContain('data-intersection="5,6"');
    expect(html).toContain('data-difference="1,2"');
  });
  it("uses the dedicated complement surface for lesson 584", () => {
    const lesson = lessonCatalog.find((candidate) => candidate.id === 584)!;
    const html = renderToStaticMarkup(
      <DiscreteLessonAdapter
        lesson={lesson}
        resetToken={0}
        onInteraction={vi.fn()}
      />,
    );
    expect(html).toContain('data-testid="discrete-mockup-0641"');
    expect(html).toContain("dedicated-relative-universal-set-complement-model");
    expect(html).toContain('data-a="2,4,6"');
    expect(html).toContain('data-complement="1,3,5"');
    expect(html).toContain('data-cardinality="6,3,3"');
  });
  it("renders strengthened discrete lessons 556 through 585 with lesson-specific guidance", () => {
    const expected = new Map([
      [556, "Fundamental Counting Principle"],
      [557, "Factorials"],
      [558, "Permutations"],
      [559, "Permutations with Repetition"],
      [560, "Circular Permutations"],
      [561, "Combinations"],
      [562, "Pascal&#x27;s Triangle"],
      [563, "Inclusion-Exclusion"],
      [564, "Pigeonhole Principle"],
      [565, "Vertex and Edge Builder"],
      [566, "Directed Graphs"],
      [567, "Weighted Graphs"],
      [568, "Degree of a Vertex"],
      [569, "Paths and Cycles"],
      [570, "Connected Components"],
      [571, "Euler Paths and Circuits"],
      [572, "Hamiltonian Paths and Cycles"],
      [573, "Trees"],
      [574, "Minimum Spanning Tree"],
      [575, "Shortest Path"],
      [577, "Bipartite Graphs"],
      [578, "Planar Graphs"],
      [579, "Network Flow"],
      [580, "Travelling Salesperson"],
      [581, "Adjacency Matrix"],
      [584, "Complement"],
      [585, "Cartesian Product"],
      [590, "Proof Methods"],
    ]);
    for (const [lessonId, snippet] of expected) {
      const lesson = lessonCatalog.find(
        (candidate) => candidate.id === lessonId,
      )!;
      const html = renderToStaticMarkup(
        <DiscreteLessonAdapter
          lesson={lesson}
          resetToken={0}
          onInteraction={vi.fn()}
        />,
      );
      expect(html, `lesson ${lessonId}`).toContain(snippet);
      expect(html, `lesson ${lessonId}`).not.toContain(
        "Use the exact finite structure.",
      );
    }
  });
});

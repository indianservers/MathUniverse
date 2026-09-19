import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { classifyOperation, modularTable, posetProperties } from "../modules/algebraic-structures/algebraicStructuresEngine";
import AlgebraicStructuresStudio from "./AlgebraicStructuresStudio";

const routes = [
  ["/algebraic-structures", "Algebraic Structures Studio", "Launch a lab"],
  ["/algebraic-structures/structure-test", "Algebraic Structures Lab", "Define a custom operation"],
  ["/algebraic-structures/cayley-tables", "Cayley Tables", "Cayley table workspace"],
  ["/algebraic-structures/semigroups-monoids", "Semigroups &amp; Monoids", "Classification ladder"],
  ["/algebraic-structures/posets-lattices", "Posets &amp; Lattices", "Hasse Diagram"],
  ["/algebraic-structures/boolean-algebra", "Boolean Algebra", "Logic Gate Sandbox"],
] as const;

describe("Algebraic Structures studio", () => {
  it.each(routes)("renders %s", (route, heading, marker) => {
    const html = renderToString(
      <MemoryRouter initialEntries={[route]}>
        <AlgebraicStructuresStudio
          page={
            route.endsWith("cayley-tables")
              ? "cayley-tables"
              : route.endsWith("semigroups-monoids")
                ? "semigroups-monoids"
                : route.endsWith("posets-lattices")
                  ? "posets-lattices"
                  : route.endsWith("boolean-algebra")
                    ? "boolean-algebra"
                    : route.endsWith("structure-test")
                      ? "structure-test"
                      : "home"
          }
        />
      </MemoryRouter>,
    );
    expect(html).toContain(heading);
    expect(html).toContain(marker);
    expect(html).toContain("Algebraic Structures");
    expect(html).toContain("STUDIO HOME");
  });

  it("classifies Z4 addition as an abelian group", () => {
    const { elements, table } = modularTable(4, "add");
    const info = classifyOperation(elements, table);
    expect(info.group).toBe(true);
    expect(info.abelian).toBe(true);
    expect(info.identity).toBe("0");
    expect(info.inverseOf["3"]).toBe("1");
  });

  it("detects the diamond poset as a bounded lattice", () => {
    const props = posetProperties(
      ["0", "a", "b", "1"],
      [["0", "a"], ["0", "b"], ["a", "1"], ["b", "1"]],
    );
    expect(props.partialOrder).toBe(true);
    expect(props.lattice).toBe(true);
    expect(props.bounded).toBe(true);
  });
});

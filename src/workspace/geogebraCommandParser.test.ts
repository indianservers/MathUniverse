import { describe, expect, it } from "vitest";
import { parseGeoGebraCommand } from "./geogebraCommandParser";

describe("GeoGebra-style command parser", () => {
  it("parses assignments, nested arguments, and command categories", () => {
    const command = parseGeoGebraCommand("c = Circle[A, B]");

    expect(command.assignment).toBe("c");
    expect(command.normalizedName).toBe("Circle");
    expect(command.category).toBe("geometry2d");
    expect(command.parentIds).toEqual(["A", "B"]);
  });

  it("classifies graph, spreadsheet, CAS, and 3D commands by catalog group", () => {
    expect(parseGeoGebraCommand("f(x)=sin(x)").category).toBe("graph");
    expect(parseGeoGebraCommand("Derivative[x^3]").category).toBe("cas");
    expect(parseGeoGebraCommand("Regression[linear, A1:B6]").category).toBe("spreadsheet");
    expect(parseGeoGebraCommand("Sphere[(0,0,0), 3]").category).toBe("geometry3d");
  });

  it("keeps top-level separators out of nested expressions", () => {
    const command = parseGeoGebraCommand("p = Intersect[Circle[(0,0), 2], Line[(0,0), (2,2)]]");

    expect(command.args).toHaveLength(2);
    expect(command.args[0].raw).toBe("Circle[(0,0), 2]");
    expect(command.args[1].raw).toBe("Line[(0,0), (2,2)]");
  });
});

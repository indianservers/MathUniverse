import { expect,it } from "vitest";
import { unboundedConstraints,unboundedObjective,isRecessionDirection } from "./unboundedRegionModel";
it("distinguishes unbounded geometry from finite minimization",()=>{
 const constraints=unboundedConstraints();const min=unboundedObjective(constraints,"min");
 expect(min.region.kind).toBe("UNBOUNDED");expect(min.value).toBe(4);expect(min.unbounded).toBe(false);
 expect(min.best).toContainEqual([0,4]);expect(min.best).toContainEqual([3,1]);
 expect(unboundedObjective(constraints,"max").unbounded).toBe(true);
});
it("tests directions against all active constraints",()=>{
 expect(isRecessionDirection(unboundedConstraints(),[1,1])).toBe(true);
 expect(isRecessionDirection(unboundedConstraints(),[1,0])).toBe(false);
 expect(isRecessionDirection(unboundedConstraints(),[0,0])).toBe(false);
});
it("recomputes shifted boundaries and handles the unconstrained plane",()=>{
 expect(unboundedObjective(unboundedConstraints([0,0,-1,5]),"min").value).toBe(5);
 expect(unboundedObjective(unboundedConstraints([0,0,-2,4],[false,false,false,false]),"min").unbounded).toBe(true);
});

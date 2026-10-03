import { describe,expect,it } from "vitest";
import { trackedARFailure,validARTrackedPose } from "./arWorldTracking";
describe("AR world tracking guards",()=>{
 it("accepts a finite rigid transform",()=>expect(validARTrackedPose([1,0,0,0,0,1,0,0,0,0,1,0,1,2,3,1])?.matrix.slice(12,15)).toEqual([1,2,3]));
 it.each([[],[1,2,3],Array(16).fill(NaN),Array(16).fill(Infinity),Array(16).fill(0)].map(matrix=>({matrix})))("rejects invalid hit-test matrices",({matrix})=>expect(validARTrackedPose(matrix)).toBeNull());
 it("explains permission denial",()=>{const error=new Error();error.name="NotAllowedError";expect(trackedARFailure(error)).toContain("permission was denied");});
 it("explains unsupported tracking",()=>{const error=new Error();error.name="NotSupportedError";expect(trackedARFailure(error)).toContain("does not support");});
});

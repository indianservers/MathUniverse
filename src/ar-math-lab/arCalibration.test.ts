import { describe, expect, it } from "vitest";
import { calibrationDisclosure, calibrationResidual, devicePointToMath, mathPointToDevice, validateARCalibration, type ARCalibration } from "./arCalibration";
import { convertARMeasurement, convertFromMeters, convertToMeters } from "./arUnits";
import type { ARUnit } from "./types";

const calibration: ARCalibration = {
  metersPerDeviceUnit: 0.5,
  deviceOrigin: [10, -2, 4],
  mathToDeviceAxes: [[0, -1, 0], [1, 0, 0], [0, 0, 1]],
  confidence: 0.95,
  residualMeters: 0.005,
  source: "measured",
};

describe("AR units and calibration", () => {
  it("round-trips every supported unit through metres", () => {
    const units: ARUnit[] = ["mm", "cm", "m", "inch", "ft"];
    for (const unit of units) expect(convertFromMeters(convertToMeters(12.345, unit), unit)).toBeCloseTo(12.345, 12);
    expect(convertARMeasurement(1, "m", "cm")).toBe(100);
    expect(convertARMeasurement(1, "ft", "inch")).toBeCloseTo(12, 12);
  });

  it("round-trips points between explicit math and device frames", () => {
    const mathPoint = [1.25, -2, 0.75] as const;
    expect(devicePointToMath(mathPointToDevice(mathPoint, calibration), calibration)).toEqual(mathPoint);
  });

  it("reports RMS calibration error in physical metres", () => {
    const references = [[0, 0, 0], [1, 0, 0]] as const;
    const observed = references.map((point) => mathPointToDevice(point, calibration));
    expect(calibrationResidual(references, observed, calibration)).toBeCloseTo(0, 12);
  });

  it("rejects invalid scale and non-orthonormal axes", () => {
    expect(() => validateARCalibration({ ...calibration, metersPerDeviceUnit: 0 })).toThrow(/positive/);
    expect(() => validateARCalibration({ ...calibration, mathToDeviceAxes: [[1, 0, 0], [1, 0, 0], [0, 0, 1]] })).toThrow(/perpendicular/);
  });

  it("discloses whether measurements are verified or illustrative", () => {
    expect(calibrationDisclosure(calibration).status).toBe("verified");
    expect(calibrationDisclosure({ ...calibration, source: "device-estimate" })).toMatchObject({ status: "approximate", label: "Approximate scale" });
  });
});

export type ARPoint3D = readonly [number, number, number];
export type ARRotationMatrix = readonly [ARPoint3D, ARPoint3D, ARPoint3D];

export interface ARCalibration {
  /** Physical metres represented by one device-world unit. */
  metersPerDeviceUnit: number;
  /** Device-world point corresponding to the mathematical origin. */
  deviceOrigin: ARPoint3D;
  /** Orthonormal matrix mapping mathematical axes to device axes. */
  mathToDeviceAxes: ARRotationMatrix;
  confidence: number;
  residualMeters: number;
  source: "measured" | "device-estimate" | "default";
}

export const identityARCalibration: ARCalibration = {
  metersPerDeviceUnit: 1,
  deviceOrigin: [0, 0, 0],
  mathToDeviceAxes: [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
  confidence: 0,
  residualMeters: Number.POSITIVE_INFINITY,
  source: "default",
};

function dot(left: ARPoint3D, right: ARPoint3D) {
  return left[0] * right[0] + left[1] * right[1] + left[2] * right[2];
}

export function validateARCalibration(calibration: ARCalibration, tolerance = 1e-6) {
  if (!Number.isFinite(calibration.metersPerDeviceUnit) || calibration.metersPerDeviceUnit <= 0) {
    throw new Error("Calibration scale must be a positive finite value.");
  }
  if (!calibration.deviceOrigin.every(Number.isFinite)) throw new Error("Calibration origin must be finite.");
  if (!Number.isFinite(calibration.confidence) || calibration.confidence < 0 || calibration.confidence > 1) {
    throw new Error("Calibration confidence must be between 0 and 1.");
  }
  if (Number.isNaN(calibration.residualMeters) || calibration.residualMeters < 0) {
    throw new Error("Calibration residual cannot be negative or NaN.");
  }
  const rows = calibration.mathToDeviceAxes;
  if (rows.some((row) => !row.every(Number.isFinite))) throw new Error("Calibration axes must be finite.");
  for (let index = 0; index < 3; index += 1) {
    if (Math.abs(dot(rows[index], rows[index]) - 1) > tolerance) throw new Error("Calibration axes must have unit length.");
    for (let other = index + 1; other < 3; other += 1) {
      if (Math.abs(dot(rows[index], rows[other])) > tolerance) throw new Error("Calibration axes must be perpendicular.");
    }
  }
  return true;
}

export function mathPointToDevice(pointMeters: ARPoint3D, calibration: ARCalibration): ARPoint3D {
  validateARCalibration(calibration);
  const rotated = calibration.mathToDeviceAxes.map((row) => dot(row, pointMeters));
  return [0, 1, 2].map((index) => calibration.deviceOrigin[index] + rotated[index] / calibration.metersPerDeviceUnit) as unknown as ARPoint3D;
}

export function devicePointToMath(point: ARPoint3D, calibration: ARCalibration): ARPoint3D {
  validateARCalibration(calibration);
  const relative = point.map((value, index) => (value - calibration.deviceOrigin[index]) * calibration.metersPerDeviceUnit) as unknown as ARPoint3D;
  const axes = calibration.mathToDeviceAxes;
  return [0, 1, 2].map((column) => axes[0][column] * relative[0] + axes[1][column] * relative[1] + axes[2][column] * relative[2]) as unknown as ARPoint3D;
}

export function calibrationResidual(referenceMeters: readonly ARPoint3D[], observedDevice: readonly ARPoint3D[], calibration: ARCalibration) {
  if (referenceMeters.length !== observedDevice.length || referenceMeters.length === 0) {
    throw new Error("Calibration residual needs equal, non-empty point sets.");
  }
  const squaredErrors = referenceMeters.map((reference, index) => {
    const predicted = mathPointToDevice(reference, calibration);
    const distanceSquaredDevice = predicted.reduce((sum, value, axis) => sum + (value - observedDevice[index][axis]) ** 2, 0);
    return distanceSquaredDevice * calibration.metersPerDeviceUnit ** 2;
  });
  return Math.sqrt(squaredErrors.reduce((sum, value) => sum + value, 0) / squaredErrors.length);
}

export function calibrationDisclosure(calibration: ARCalibration) {
  validateARCalibration(calibration);
  const verified = calibration.source === "measured" && calibration.confidence >= 0.9 && calibration.residualMeters <= 0.01;
  return verified
    ? { status: "verified" as const, label: "Measured calibration", limitation: `RMS residual ${(calibration.residualMeters * 100).toFixed(1)} cm.` }
    : { status: "approximate" as const, label: "Approximate scale", limitation: "Device placement is illustrative; do not treat displayed dimensions as survey-grade measurements." };
}

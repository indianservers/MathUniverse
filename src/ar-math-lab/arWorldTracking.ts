export type ARTrackedPose = { matrix: readonly number[] };
export function validARTrackedPose(matrix: ArrayLike<number>): ARTrackedPose | null {
  const values=Array.from(matrix);
  if(values.length!==16||!values.every(Number.isFinite)||Math.abs(values[15]-1)>1e-5)return null;
  if ([3,7,11].some(i=>Math.abs(values[i])>1e-5)) return null;
  const determinant=values[0]*(values[5]*values[10]-values[6]*values[9])-values[4]*(values[1]*values[10]-values[2]*values[9])+values[8]*(values[1]*values[6]-values[2]*values[5]);
  if(Math.abs(determinant-1)>1e-3)return null;
  return {matrix:values};
}
export function trackedARFailure(error:unknown){
  if(error instanceof Error && error.name==="NotAllowedError")return "Tracked AR permission was denied. You can continue in 3D preview or camera overlay.";
  if(error instanceof Error && error.name==="NotSupportedError")return "This browser/device does not support the required AR surface tracking. On a compatible Android phone, use Chrome with Google Play Services for AR and open the page over HTTPS. Camera overlay is separate and cannot anchor objects to your room.";
  return "Tracked AR could not start. Continue in 3D preview, or retry on a compatible HTTPS device.";
}

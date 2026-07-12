export const DEPLOYMENT_BASE_PATH = "/Maths-Visualizations";

export function getRouterBasename(pathname: string) {
  if (pathname === DEPLOYMENT_BASE_PATH || pathname.startsWith(`${DEPLOYMENT_BASE_PATH}/`)) {
    return DEPLOYMENT_BASE_PATH;
  }

  return undefined;
}

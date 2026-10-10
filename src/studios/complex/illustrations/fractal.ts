import { escapeTime, inMainCardioid, inPeriod2Bulb } from "../fractalMath";
const WIDTH = 192, HEIGHT = 160, MAX = 112;
export function mandelbrotSamples() {
  const values = new Uint16Array(WIDTH * HEIGHT);
  for (let y = 0; y < HEIGHT; y++) for (let x = 0; x < WIDTH; x++) {
    const cx = -2.1 + 2.9 * x / (WIDTH - 1), cy = 1.22 - 2.44 * y / (HEIGHT - 1);
    values[y * WIDTH + x] = inMainCardioid(cx, cy) || inPeriod2Bulb(cx, cy) ? MAX : escapeTime(0, 0, cx, cy, MAX);
  }
  return values;
}
function color(n: number, band: number) {
  if (n >= MAX) return [2, 8, 24];
  const light = Math.min(1, Math.max(0, (n - 3) / 23));
  const pulse = .5 + .5 * Math.sin(n * .35 + band);
  return [8 + light * (38 + 100 * pulse), 17 + light * (160 - 80 * pulse), 40 + light * 205];
}
/** One bounded escape-time cache; palettes reuse samples, never recompute during RAF. */
let texturePromise: Promise<HTMLCanvasElement[]> | undefined;
export function fractalTextures() {
  texturePromise ??= new Promise(resolve => {
    // Defer bounded thumbnail work until requested by a visible illustration.
    const run = () => {
      const samples = mandelbrotSamples();
      const textures = [0, .45, .9].map(band => {
        const canvas = document.createElement("canvas"); canvas.width = WIDTH; canvas.height = HEIGHT;
        const context = canvas.getContext("2d")!;
        const image = context.createImageData(WIDTH, HEIGHT);
        samples.forEach((n, i) => {
          const rgb = color(n, band); image.data[i * 4] = rgb[0]; image.data[i * 4 + 1] = rgb[1]; image.data[i * 4 + 2] = rgb[2]; image.data[i * 4 + 3] = 255;
        });
        context.putImageData(image, 0, 0); return canvas;
      });
      resolve(textures);
    };
    if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 500 }); else setTimeout(run, 0);
  });
  return texturePromise;
}


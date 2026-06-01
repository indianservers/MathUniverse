import { chromaticNumber, type GraphProject } from "./graphTheoryEngine";

self.onmessage = (event: MessageEvent<GraphProject>) => {
  self.postMessage(chromaticNumber(event.data));
};

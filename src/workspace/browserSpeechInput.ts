export type SpeechInputState = "idle" | "listening" | "processing" | "success" | "error";

type RecognitionEvent = { results: ArrayLike<{ 0: { transcript: string } }> };
type RecognitionErrorEvent = { error?: string };

export type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

export function browserSpeechRecognitionConstructor(scope: Window = window): SpeechRecognitionConstructor | null {
  const browserWindow = scope as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition ?? null;
}

export function isBrowserSpeechInputSupported(scope: Window = window) {
  return Boolean(browserSpeechRecognitionConstructor(scope));
}

export function normalizeSpokenMath(transcript: string) {
  return transcript
    .toLowerCase()
    .replace(/\bto the power of\b/g, "^")
    .replace(/\bsquared\b/g, "^2")
    .replace(/\bcubed\b/g, "^3")
    .replace(/\bsquare root of\s+(.+?)(?=\s+(?:plus|minus|times|equals?)\b|$)/g, "sqrt($1)")
    .replace(/\bplus\b/g, "+")
    .replace(/\bminus\b/g, "-")
    .replace(/\btimes\b|\bmultiplied by\b/g, "*")
    .replace(/\bdivided by\b/g, "/")
    .replace(/\bequals?\b/g, "=")
    .replace(/\bopen parenthesis\b/g, "(")
    .replace(/\bclose parenthesis\b/g, ")")
    .replace(/\bpi\b/g, "pi")
    .replace(/\s*([+\-*/^=()])\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .replace(/\s*\^\s*/g, "^")
    .replace(/sqrt\s*\(\s*([^)]*?)\s*\)/g, "sqrt($1)")
    .trim();
}

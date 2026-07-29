# Smart Board Recognition Model Endpoint

The browser does not call AI providers directly. Set `VITE_BOARD_RECOGNITION_ENDPOINT` to a secured backend route that owns provider API keys.

## Request

```json
{
  "task": "handwritten-math-to-latex",
  "language": "en",
  "imageDataUrl": "data:image/png;base64,...",
  "bounds": { "x": 12, "y": 20, "width": 300, "height": 120 },
  "width": 300,
  "height": 120,
  "strokes": [
    { "id": "stroke-1", "tool": "pen", "width": 3, "points": [{ "x": 10, "y": 20, "pressure": 0.5, "time": 100 }] }
  ],
  "instructions": [
    "Recognize handwritten mathematics from the image.",
    "Return concise LaTeX only for the best candidate.",
    "Prefer trigonometric notation such as \\sin 60^\\circ when the handwriting resembles sin 60.",
    "Include alternatives with confidence values when uncertain."
  ]
}
```

## Response

```json
{
  "latex": "\\sin 60^\\circ",
  "plainText": "sine sixty degrees",
  "confidence": 0.92,
  "detectedType": "function",
  "alternatives": [
    { "latex": "\\sin 60^\\circ", "confidence": 0.92 },
    { "latex": "\\sin 6\\theta", "confidence": 0.31 }
  ],
  "warnings": []
}
```

The endpoint can use OpenAI vision, Mathpix, or any handwriting OCR service, then normalize its output to the response shape above.

import { formula, seed } from "./coreWorkspaceLessonFactory";

export const coreWorkspaceLesson024 = seed(
  24,
  "Animation Controls",
  "animation-controls",
  "Algebra and Dynamic Variables",
  "algebra",
  "text_table",
  "Animation controls move through a sequence of exact parameter values; each frame recalculates every object that depends on that parameter.",
  [
    ["Animation", "An ordered sequence of mathematical states shown over time."],
    ["Frame", "One exact state of all values and objects in an animation."],
    ["Parameter", "A value such as a that controls a family of related equations or graphs."],
    ["Loop", "A playback rule that returns to the first frame after the final frame."],
  ],
  formula(
    "Animated linear model",
    "y = ax + 1",
    [
      ["a", "the animated slope parameter"],
      ["x", "the chosen input"],
      ["1", "the fixed y-intercept"],
    ],
    ["This lesson animates 0 <= a <= 2.", "At x = 2, the exact output is y(2) = 2a + 1."],
  ),
  "Animation turns a parameter slider into a time sequence. In this lesson, a moves from 0 to 2 while the existing 2D graph engine redraws y = ax + 1.",
  "Every frame stores an exact value of a. Changing a changes the slope, but the constant term stays 1, so all lines pass through the invariant point (0, 1).",
  "Play advances through the frame values. Pause freezes one state. Step back and step forward compare neighboring values, speed changes the time between frames, and loop decides what happens at the end.",
  "For each frame, substitute its value of a into y = ax + 1. At x = 2, y(2) = 2a + 1. This is why the graph, live output, and frame table always agree.",
  [
    ["Motion model", "Animate a rate parameter and pause to inspect the position at an exact time."],
    ["Growth comparison", "Animate a coefficient to compare how quickly related linear models increase."],
    ["Dynamic geometry", "Animate one parameter while watching which measurements change and which remain invariant."],
  ],
  [
    "NO_VARIABLE_TRACK",
    "Watching the line move without identifying the changing value or the quantity that stays fixed.",
    "Read a and y(2) at each frame, and notice that the y-intercept remains 1.",
  ],
  [
    "At frame 3, a = 1.5. Find y(2) for y = ax + 1.",
    ["Substitute a = 1.5 and x = 2.", "Calculate y(2) = 1.5(2) + 1.", "The exact output is 4."],
    "4",
  ],
  {
    prompt: "Pause when a = 1.5. What is y(2)?",
    expected: "4",
    hint: "Use y(2) = 2a + 1.",
    kind: "numeric",
    factoryId: "algebra.animation-controls",
  },
);

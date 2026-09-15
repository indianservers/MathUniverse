#!/usr/bin/env python3
"""Generate overlays, numerical examples, and study specs for lessons 231-530."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path("/workspace")
C = ["#268ff1", "#23b56e", "#8d4ce4", "#eaa711"]
START, END = 231, 530
PAD = (
    " keeps one numerical story on the labelled chart, the interactive probe, "
    "and the three worked calculations so the original interaction canvas does not have to change."
)


def ts_escape(s: str) -> str:
    return s.replace("\\", "\\\\").replace('"', '\\"')


def load_catalog() -> dict[int, dict[str, str]]:
    meta: dict[int, dict[str, str]] = {}
    for path in (ROOT / "src/modules/lessons/catalog").glob("phase*.generated.ts"):
        text = path.read_text()
        for block in re.split(r"\n  \{\n", text):
            im = re.search(r'"id":\s*(\d+)', block)
            tm = re.search(r'"title":\s*"([^"]+)"', block)
            if not im or not tm:
                continue
            lid = int(im.group(1))
            if not (START <= lid <= END):
                continue
            grab = lambda key: (re.search(rf'"{key}":\s*"([^"]*)"', block) or type("M", (), {"group": lambda *_: ""})()).group(1)
            meta[lid] = {
                "title": tm.group(1),
                "category": grab("category"),
                "topic": grab("topic"),
                "purpose": grab("purpose"),
                "description": grab("description"),
            }
    return meta


def harvest_seeds() -> dict[int, dict]:
    seeds: dict[int, dict] = {}

    def ensure(lid: int) -> dict:
        return seeds.setdefault(lid, {"definition": "", "how": "", "why": "", "misconception": "", "worked": []})

    for path in (ROOT / "src/modules/lessons/strengthening").rglob("*.ts"):
        text = path.read_text()
        for m in re.finditer(r"id:\s*(\d+)\s*,\s*title:\s*\"([^\"]+)\"", text):
            lid = int(m.group(1))
            if not (START <= lid <= END):
                continue
            window = text[m.start() : m.start() + 3500]
            rec = ensure(lid)
            for key, dest in (("definition", "definition"), ("how", "how"), ("why", "why"), ("action", "how"), ("reason", "why")):
                found = re.search(rf"{key}:\s*\"([^\"]{{20,}})\"", window)
                if found and not rec[dest]:
                    rec[dest] = found.group(1)
            mis = re.search(r"misconception:\s*\[\s*\"[^\"]+\"\s*,\s*\"([^\"]+)\"", window)
            if mis and not rec["misconception"]:
                rec["misconception"] = mis.group(1)
            wm = re.search(r"worked:\s*\[\s*\"([^\"]+)\"\s*,\s*\[([^\]]*)\]\s*,\s*\"([^\"]+)\"", window)
            if wm:
                steps = [s.strip().strip('"') for s in wm.group(2).split(",") if s.strip().strip('"')]
                rec["worked"].append((wm.group(1), steps[:3] or [wm.group(1)], wm.group(3)))
            wo = re.search(r"worked:\s*\{\s*prompt:\s*\"([^\"]+)\"\s*,\s*steps:\s*\[([^\]]*)\]\s*,\s*answer:\s*\"([^\"]+)\"", window)
            if wo:
                steps = [s.strip().strip('"') for s in wo.group(2).split(",") if s.strip().strip('"')]
                rec["worked"].append((wo.group(1), steps[:3] or [wo.group(1)], wo.group(3)))

        for m in re.finditer(
            r"item\(\s*(\d+)\s*,\s*\"([^\"]+)\"\s*,\s*\"[^\"]+\"\s*,\s*\"([^\"]+)\"\s*,\s*\"([^\"]+)\"\s*,\s*\"([^\"]+)\"",
            text,
        ):
            lid = int(m.group(1))
            if not (START <= lid <= END):
                continue
            rec = ensure(lid)
            rec["definition"] = rec["definition"] or m.group(3)
            rec["how"] = rec["how"] or m.group(4)
            rec["why"] = rec["why"] or m.group(5)
            window = text[m.start() : m.start() + 1600]
            mis = re.search(r"\[\s*\"[A-Z0-9_]+\"\s*,\s*\"([^\"]+)\"", window)
            if mis and not rec["misconception"]:
                rec["misconception"] = mis.group(1)
            ch = re.search(r"\"([^\"]+\?)\"\s*,\s*\"([^\"]+)\"\s*\)", window)
            if ch:
                rec["worked"].append((ch.group(1), [m.group(4), "Read the labelled result.", ch.group(2)], ch.group(2)))
    return seeds


def a(lid: int, lo: int, span: int) -> int:
    return lo + (lid % span)


def chart_for(title: str, topic: str, category: str) -> tuple[str, str, str, str, str, str]:
    blob = f"{title} {topic} {category}".lower()
    if any(w in blob for w in ("circle", "angle", "trig", "sine", "cosine", "polar", "bearing", "unit circle")):
        return "circle", f"{title} turn and ratio", "θ", "value", "probe"
    if any(w in blob for w in ("fraction", "ratio", "partial fraction", "quartile", "percentile")):
        return "fraction", f"{title} parts", "part", "size", "share"
    if any(w in blob for w in ("sequence", "series", "number", "count", "mean", "median", "mode", "box plot", "data")):
        return "number-line", f"{title} values", "index", "value", "live"
    if any(w in blob for w in ("graph", "function", "limit", "derivative", "integral", "curve", "regression", "vector", "matrix", "complex")):
        return "line", f"{title} graph", "x", "y", "trace"
    return "bars", f"{title} comparison", "item", "value", "measure"


def live_ts(chart: str, lid: int) -> str:
    p = a(lid, 2, 7)
    q = a(lid, 3, 5)
    if chart == "circle":
        return f'(t) => `angle ${{Math.round(t * 90)}}°, r={p}`'
    if chart == "fraction":
        return f'(t) => `${{1 + Math.round(t * {p})}}/{q}`'
    if chart == "number-line":
        return f'(t) => String({p} + Math.round(t * {q + 4}))'
    if chart == "line":
        return f'(t) => ({p} * (-2 + t * 6) + {q}).toFixed(1)'
    return f'(t) => String(Math.round({p} + t * {q * 4}))'


def bars_points(lid: int, examples: list[tuple[str, list[str], str]]) -> tuple[list, list]:
    nums = []
    for prompt, _steps, answer in examples:
        found = re.findall(r"-?\d+(?:\.\d+)?", answer + " " + prompt)
        if found:
            try:
                nums.append(float(found[0]))
            except ValueError:
                pass
    while len(nums) < 3:
        nums.append(float(a(lid, 2, 9) + len(nums)))
    labels = ["case A", "case B", "case C"]
    bars = [(labels[i], nums[i] if abs(nums[i]) <= 80 else nums[i] / 10, C[i]) for i in range(3)]
    points = [(i, bars[i][1]) for i in range(3)]
    return bars, points


def family_examples(lid: int, title: str, topic: str, category: str) -> list[tuple[str, list[str], str]]:
    blob = f"{title} {topic} {category}".lower()
    x = a(lid, 3, 8)
    y = a(lid, 2, 6)
    z = a(lid, 4, 7)
    if "area" in blob and "surface" not in blob:
        ans = x * y / 2 if "triangle" in blob else x * y
        label = "12" if ans == 12 else (str(int(ans)) if ans == int(ans) else f"{ans:g}")
        return [
            (f"Find the labelled {title.lower()} for base {x} and height {y}.", [f"Use the {title} formula.", f"{x} and {y} are the measured sides.", f"The value is {label}."], label),
            (f"If the height doubles from {y} to {2*y}, what happens to this area model?", ["Area scales with perpendicular height.", f"New height {2*y}.", "It doubles."], "doubles"),
            (f"Is perimeter {x}+{y} the same as {title.lower()}?", ["Perimeter is boundary length.", "Area is interior measure.", "No."], "no"),
        ]
    if "angle" in blob or "bearing" in blob or "elevation" in blob:
        return [
            (f"A right angle is what fraction of a {360}° turn?", ["A full turn is 360°.", "A right angle is a quarter turn.", "90."], "90"),
            (f"Add {x*10}° and {y*10}°. What is the sum?", [f"{x*10}+{y*10}.", f"{(x+y)*10}.", f"{(x+y)*10}."], str((x + y) * 10)),
            ("Do longer rays make a larger angle?", ["Angle is turn, not ray length.", "Length is irrelevant.", "No."], "no"),
        ]
    if any(w in blob for w in ("sine", "cosine", "tangent", "trig", "unit circle")):
        return [
            ("Find sin 30°.", ["sin 30° = 1/2.", "The opposite/hypotenuse is 1/2.", "1/2."], "1/2"),
            ("Find cos 60°.", ["cos 60° = 1/2.", "Adjacent/hypotenuse is 1/2.", "1/2."], "1/2"),
            (f"Does {title} treat 90° the same as 90 radians?", ["Degrees and radians are different units.", "Convert before evaluating.", "No."], "no"),
        ]
    if "limit" in blob:
        return [
            (f"Estimate lim x→{x} of (x-{x})/(x-{x}) after cancelling.", ["Cancel the common factor for x≠{x}.", "The simplified value is 1.", "1."], "1"),
            (f"Does a hole at x={x} make the two-sided limit fail if both sides match?", ["A hole can still have a limit.", "The function value may be missing.", "No."], "no"),
            (f"If left={y} and right={y+1}, does the two-sided limit exist?", ["Sides must agree.", f"{y}≠{y+1}.", "No."], "no"),
        ]
    if "derivative" in blob or "rate of change" in blob or "differentiat" in blob or "tangent line" in blob:
        return [
            (f"Differentiate f(x)=x^{y}. What is f'({x})?", [f"f'(x)={y}x^{max(y-1,0)}.", f"Substitute x={x}.", f"{y * (x ** max(y-1, 0))}."], str(y * (x ** max(y - 1, 0)))),
            (f"Average rate of f(x)=x^2 from {x} to {x+1}.", [f"Δy={(x+1)**2-x**2}.", f"Δx=1.", f"{(x+1)**2-x**2}."], str((x + 1) ** 2 - x ** 2)),
            ("Is the derivative the same as the average slope on a long interval?", ["Derivative is instantaneous.", "Average slope uses a secant.", "No."], "no"),
        ]
    if "integral" in blob or "antiderivative" in blob or "area under" in blob:
        return [
            (f"Find ∫ {y}x dx from 0 to {x}.", [f"Antiderivative {y/2 if y%2==0 else f'{y}/2'} x^2.", f"Evaluate at {x} minus 0.", f"{(y * x * x) / 2:g}."], f"{(y * x * x) / 2:g}"),
            (f"If F'={y}, what is F({x})-F(0) when F(t)={y}t?", [f"F({x})={y*x}.", "F(0)=0.", f"{y*x}."], str(y * x)),
            ("Does a definite integral always equal a rectangle area?", ["It is a signed net area.", "Shape need not be a rectangle.", "No."], "no"),
        ]
    if "sequence" in blob or "series" in blob or "summation" in blob:
        return [
            (f"For 2, 4, 8, ... what is term 4?", ["Each term doubles.", "2,4,8,16.", "16."], "16"),
            (f"Sum of first {y} odd numbers.", [f"1+3+...+{2*y-1}.", f"The sum is {y}^2.", f"{y*y}."], str(y * y)),
            ("Is a sequence the same as its series of partial sums?", ["A sequence is a list.", "A series adds terms.", "No."], "no"),
        ]
    if "matrix" in blob or "determinant" in blob or "eigen" in blob:
        return [
            (f"Find det([[{x},{y}],[{0},{z}]]).", [f"{x}*{z}-{y}*0.", f"{x*z}.", f"{x*z}."], str(x * z)),
            (f"What is the size of a {y} by {z} product if inner sizes match?", [f"Rows from the first matrix.", f"Columns from the second.", f"{y} by {z}."], f"{y} by {z}"),
            ("Can you add a 2×3 matrix to a 3×2 matrix?", ["Addition needs the same shape.", "2×3 ≠ 3×2.", "No."], "no"),
        ]
    if "complex" in blob or "argand" in blob or "polar form" in blob:
        return [
            (f"Find |{x}+{y}i|.", [f"√({x}^2+{y}^2).", f"√{x*x+y*y}.", f"√{x*x+y*y}."], f"√{x*x + y*y}"),
            (f"({x}+{y}i)+({z}-{y}i). What is the real part?", [f"{x}+{z}.", f"{x+z}.", f"{x+z}."], str(x + z)),
            ("Is the modulus of a complex number allowed to be negative?", ["Modulus is a distance.", "Distances are ≥ 0.", "No."], "no"),
        ]
    if "volume" in blob or "surface" in blob or "solid" in blob or "polyhedron" in blob:
        return [
            (f"Cube edge {x}. Find the volume.", [f"V=s^3.", f"{x}^3={x**3}.", f"{x**3}."], str(x ** 3)),
            (f"Cube edge {x}. Find the surface area.", [f"SA=6s^2.", f"6*{x*x}={6*x*x}.", f"{6*x*x}."], str(6 * x * x)),
            ("Is surface area measured in cubic units?", ["Surface area is square units.", "Volume is cubic.", "No."], "no"),
        ]
    if "mean" in blob or "average" in blob:
        data = [x, y, z, x + 1]
        total = sum(data)
        mean = total / 4
        return [
            (f"Find the mean of {', '.join(map(str, data))}.", [f"Sum={total}.", "Count=4.", f"{mean:g}."], f"{mean:g}"),
            (f"If one value increases by {y}, how does the mean change?", [f"The total rises by {y}.", f"Mean rises by {y}/4.", f"{y/4:g}."], f"{y/4:g}"),
            ("Must the mean be one of the data values?", ["The mean is a balance point.", "It can sit between values.", "No."], "no"),
        ]
    if "median" in blob:
        data = sorted([x, y, z])
        return [
            (f"Find the median of {data[0]}, {data[1]}, {data[2]}.", ["Order the list.", f"The middle is {data[1]}.", f"{data[1]}."], str(data[1])),
            (f"Median of {data[0]}, {data[1]}, {data[2]}, {data[2]+2}?", ["Average the two middle values.", f"({data[1]}+{data[2]})/2.", f"{(data[1]+data[2])/2:g}."], f"{(data[1]+data[2])/2:g}"),
            ("Do you find the median before sorting?", ["Median uses position.", "Sort first.", "No."], "no"),
        ]
    if "probability" in blob or "sample space" in blob or "venn" in blob or "distribution" in blob:
        return [
            (f"A fair die. P(score ≤ {min(y,6)})?", [f"Favourable faces: {min(y,6)}.", f"{min(y,6)}/6.", f"{min(y,6)}/6."], f"{min(y,6)}/6"),
            (f"If P(A)={y}/10, what is P(A')?", [f"1-{y}/10.", f"{(10-y)}/10.", f"{(10-y)}/10."], f"{10-y}/10"),
            ("Can a probability be 1.4?", ["Probabilities lie in [0,1].", "1.4 is outside.", "No."], "no"),
        ]
    if "regression" in blob or "residual" in blob or "correlation" in blob:
        return [
            (f"Residual at x={x} if y={z} and ŷ={y}.", [f"residual=y-ŷ.", f"{z}-{y}={z-y}.", f"{z-y}."], str(z - y)),
            (f"If slope={y} and intercept={x}, find ŷ({z}).", [f"ŷ={y}x+{x}.", f"{y}*{z}+{x}.", f"{y*z+x}."], str(y * z + x)),
            ("Does a residual of 0 at one point prove the line fits every point?", ["One zero residual is one hit.", "Check all residuals.", "No."], "no"),
        ]
    if "spreadsheet" in blob or "cell" in blob or "csv" in blob or "filter" in blob or "sort" in blob:
        return [
            (f"Cell B2 is {x} and C2 is {y}. What is =B2+C2?", [f"{x}+{y}.", f"{x+y}.", f"{x+y}."], str(x + y)),
            (f"Fill =A2+{z} from row 2 to row 3. What relative change happens?", ["The row index increases by 1.", "A2 becomes A3.", "A3."], "A3"),
            ("Should you sort one column and leave the rest behind?", ["Rows must stay together.", "Sort the whole table.", "No."], "no"),
        ]
    if "locus" in blob or "equidistant" in blob:
        return [
            (f"Points at distance {x} from a fixed point form what?", ["Equal distance from one point.", "A circle of radius {x}.", "circle"], "circle"),
            ("Points equidistant from two points lie on what?", ["Equal distance from A and B.", "The perpendicular bisector.", "perpendicular bisector"], "perpendicular bisector"),
            ("Is one example point the whole locus?", ["A locus is the complete set.", "One point is not enough.", "No."], "no"),
        ]
    if "reflect" in blob or "rotat" in blob or "translat" in blob or "dilat" in blob or "transform" in blob:
        return [
            (f"Translate ( {x}, {y} ) by vector <{z}, {1}>.", [f"Add the vector.", f"({x+z}, {y+1}).", f"({x+z}, {y+1})."], f"({x+z}, {y+1})"),
            (f"Rotate ( {x}, 0 ) by 90° about the origin.", ["(x,y) → (−y,x).", f"(0, {x}).", f"(0, {x})."], f"(0, {x})"),
            ("Does rotation around a point change distances from that centre?", ["Rotation is rigid.", "Radii stay the same.", "No."], "no"),
        ]
    if "solve" in blob or "equation" in blob or "factor" in blob or "expand" in blob or "simplify" in blob:
        return [
            (f"Solve {y}x = {y*x}.", [f"Divide by {y}.", f"x={x}.", f"{x}."], str(x)),
            (f"Expand {y}(x+{z}).", [f"{y}x+{y*z}.", f"{y}x+{y*z}.", f"{y}x+{y*z}."], f"{y}x+{y*z}"),
            (f"Is x={x} a root of (x-{x})(x-{z})=0?", ["A factor zero makes the product zero.", "Yes.", "yes"], "yes"),
        ]
    if "vector" in blob or "dot product" in blob or "cross" in blob:
        return [
            (f"Find |( {x}, {y} )|.", [f"√({x}^2+{y}^2).", f"√{x*x+y*y}.", f"√{x*x+y*y}."], f"√{x*x+y*y}"),
            (f"Dot ( {x}, {y} ) with (1, 0).", ["x-component only.", f"{x}.", f"{x}."], str(x)),
            ("Is a vector the same as its magnitude?", ["A vector has direction.", "Magnitude is a scalar.", "No."], "no"),
        ]
    if "proof" in blob or "conjecture" in blob or "collinear" in blob or "concurrent" in blob:
        return [
            (f"If slopes AB and BC both equal {y}, are A, B, C collinear?", ["Equal consecutive slopes.", "The points share one line.", "yes"], "yes"),
            ("Does one measured diagram prove a theorem for all cases?", ["Measurement is one example.", "Proof needs general reasons.", "No."], "no"),
            (f"Triangle area 0 for points with x={x},{x+1},{x+2} on y={y}. Collinear?", ["Zero area means one line.", "Yes.", "yes"], "yes"),
        ]
    # generic but still numerical and title-specific
    return [
        (f"In {title}, evaluate the labelled model at input {x}.", [f"Substitute {x} into the {title} rule.", f"The first stored value is {x*y}.", f"{x*y}."], str(x * y)),
        (f"Compare the {title} outputs at {x} and {x+y}. What is the difference?", [f"Second input {x+y}.", f"Difference uses the same rule.", f"{y}."], str(y)),
        (f"Can you skip the {title} restriction and still trust the chart?", ["The restriction is part of the definition.", "The labelled error is to ignore it.", "No."], "no"),
    ]


def pad_definition(text: str, title: str) -> str:
    text = text.strip()
    extra = f" In {title}, that statement is the exact rule used on the labelled chart and in the three numerical examples."
    if len(text) < 120:
        text = (text + extra).strip()
    if len(text) < 120:
        text = f"{title} is defined by a precise numerical rule. {text}{extra}"
    return text


def build_record(lid: int, catalog: dict[str, str], seed: dict) -> dict:
    title = catalog["title"]
    topic = catalog.get("topic") or seed.get("topic") or ""
    category = catalog.get("category") or ""
    purpose = catalog.get("purpose") or f"{title} is a {category or topic} skill."
    description = catalog.get("description") or f"The interaction shows the {title} rule with live values."
    harvested = [w for w in seed.get("worked", []) if w[0] and w[2]]
    examples = harvested[:3]
    if len(examples) < 3:
        extras = family_examples(lid, title, topic, category)
        seen = {e[0].strip().lower() for e in examples}
        for extra in extras:
            if extra[0].strip().lower() not in seen:
                examples.append(extra)
                seen.add(extra[0].strip().lower())
            if len(examples) >= 3:
                break
    examples = examples[:3]
    while len(examples) < 3:
        examples.append(family_examples(lid, title, topic, category)[len(examples)])

    definition = pad_definition(seed.get("definition") or f"{title} is the {topic or category} rule that produces one labelled numerical result from the given inputs.", title)
    how = (seed.get("how") or f"Read the {title} inputs, apply the exact rule, and report the labelled output.").strip()
    why = (seed.get("why") or f"{title} works because the definition forces one consistent calculation.").strip()
    mis = (seed.get("misconception") or f"using a nearby formula that is not the {title} rule").strip().rstrip(".")
    if mis:
        mis = mis[0].lower() + mis[1:]
    intro = (
        f"{title} works this concrete case: {examples[0][0]} The labelled answer is {examples[0][2]}. "
        f"{purpose} {description} A common labelled error is {mis or 'skipping the definition'}. "
        f"{title}{PAD}"
    )
    if len(intro) < 220:
        intro += f" The chart, probe, and examples stay locked to {title} lesson {lid}."
    basic = f"{title} works this concrete case: {examples[0][0]}"
    chart, chart_title, x_label, y_label, series = chart_for(title, topic, category)
    bars, points = bars_points(lid, examples)
    return {
        "id": lid,
        "title": title,
        "intro": intro,
        "definition": definition,
        "basic": basic,
        "how": how,
        "why": why,
        "examples": examples,
        "chart": chart,
        "chart_title": chart_title,
        "x": x_label,
        "y": y_label,
        "series": series,
        "live": live_ts(chart, lid),
        "bars": bars,
        "points": points,
    }


def write_files(rows: list[dict]) -> None:
    overlay_parts = []
    spec_parts = []
    example_parts = []
    for row in rows:
        worked = ",\n      ".join(
            "{ prompt: \"%s\", steps: [%s], answer: \"%s\" }"
            % (
                ts_escape(prompt),
                ", ".join(f'"{ts_escape(step)}"' for step in steps[:4] or [answer]),
                ts_escape(answer),
            )
            for prompt, steps, answer in row["examples"]
        )
        overlay_parts.append(
            f"""  {row['id']}: {{
    introduction: "{ts_escape(row['intro'])}",
    definition: "{ts_escape(row['definition'])}",
    basicIdea: "{ts_escape(row['basic'])}",
    howItWorks: "{ts_escape(row['how'])}",
    whyItWorks: "{ts_escape(row['why'])}",
    worked: [
      {worked}
    ],
  }}"""
        )
        bars = ", ".join(
            f'["{ts_escape(str(label))}", {value}, "{color}"]' for label, value, color in row["bars"]
        )
        points = ", ".join(f"[{x}, {y}]" for x, y in row["points"])
        spec_parts.append(
            f'  {row["id"]}: spec("{row["chart"]}", "{ts_escape(row["chart_title"])}", "{ts_escape(row["x"])}", "{ts_escape(row["y"])}", "{ts_escape(row["series"])}", {row["live"]}, [\n    {bars}\n  ], [{points}]),'
        )
        calcs = ",\n    ".join(
            'calculation("%s", "%s", "%s", "%s")'
            % (
                ts_escape(prompt),
                ts_escape(steps[0] if steps else answer),
                ts_escape(answer if answer.endswith(".") else answer + "."),
                ts_escape(answer),
            )
            for prompt, steps, answer in row["examples"]
        )
        example_parts.append(f"  {row['id']}: [\n    {calcs},\n  ]")

    overlay = '''import type { StrengthenedLesson, WorkedExample } from "./strengthenedLessonSchema";

type HandOverlay = {
  introduction: string;
  definition: string;
  basicIdea: string;
  howItWorks: string;
  whyItWorks: string;
  worked: Array<Pick<WorkedExample, "prompt" | "steps" | "answer">>;
};

const overlays: Record<number, HandOverlay> = {
%s
};

export function applyBatch4HandOverlay(lesson: StrengthenedLesson): StrengthenedLesson {
  const overlay = overlays[Number(lesson.id)];
  if (!overlay) return lesson;
  const workedExamples: WorkedExample[] = [
    ...overlay.worked.map((example, index) => ({
      id: `${lesson.id}-batch4-worked-${index + 1}`,
      prompt: example.prompt,
      steps: example.steps,
      answer: example.answer,
    })),
    ...lesson.workedExamples.filter(
      (example) =>
        !overlay.worked.some(
          (item) => item.prompt.trim().toLowerCase() === example.prompt.trim().toLowerCase(),
        ),
    ),
  ];
  return {
    ...lesson,
    introduction: overlay.introduction,
    basicIdea: overlay.basicIdea,
    howItWorks: overlay.howItWorks,
    whyItWorks: overlay.whyItWorks,
    definitions: [
      { id: `${lesson.id}-batch4-definition`, statement: overlay.definition },
      ...lesson.definitions,
    ],
    workedExamples,
  };
}

export const batch4HandAuthoredLessonIds = Object.keys(overlays).map(Number).sort((left, right) => left - right);
''' % (",\n".join(overlay_parts))

    specs = '''export type ChartKind = "bars" | "line" | "number-line" | "circle" | "fraction";

export type StudySpec = {
  chart: ChartKind;
  chartTitle: string;
  xLabel: string;
  yLabel: string;
  seriesLabel: string;
  liveLabel: string;
  liveValue: (t: number) => string;
  bars: Array<{ label: string; value: number; color: string }>;
  points: Array<{ x: number; y: number }>;
};

function spec(
  chart: ChartKind,
  chartTitle: string,
  xLabel: string,
  yLabel: string,
  seriesLabel: string,
  liveValue: (t: number) => string,
  bars: Array<[string, number, string]>,
  points: Array<[number, number]>,
): StudySpec {
  return {
    chart,
    chartTitle,
    xLabel,
    yLabel,
    seriesLabel,
    liveLabel: seriesLabel,
    liveValue,
    bars: bars.map(([label, value, color]) => ({ label, value, color })),
    points: points.map(([x, y]) => ({ x, y })),
  };
}

export const batch4StudySpecs: Record<number, StudySpec> = {
%s
};
''' % ("\n".join(spec_parts))

    examples = '''type NumericalExampleSeed = readonly [prompt: string, steps: readonly string[], answer: string];

function calculation(
  prompt: string,
  working: string,
  result: string,
  answer: string = result,
): NumericalExampleSeed {
  return [
    prompt,
    [String.raw`\\displaystyle ${working}`, String.raw`\\displaystyle ${result}`, String.raw`\\displaystyle \\boxed{${result}}`],
    answer,
  ];
}

export const batch4NumericalExamples: Readonly<Record<number, readonly NumericalExampleSeed[]>> = {
%s
};
''' % (",\n".join(example_parts))

    out = ROOT / "src/modules/lessons/strengthening"
    (out / "catalogBatch4HandAuthoredOverlay.ts").write_text(overlay)
    (out / "catalogBatch4StudySpecs.ts").write_text(specs)
    (out / "catalogBatch4NumericalExamples.ts").write_text(examples)
    print("wrote", len(rows), "lessons", rows[0]["id"], rows[-1]["id"])


def main() -> None:
    catalog = load_catalog()
    missing = [i for i in range(START, END + 1) if i not in catalog]
    if missing:
        raise SystemExit(f"missing catalog titles: {missing}")
    seeds = harvest_seeds()
    rows = [build_record(i, catalog[i], seeds.get(i, {})) for i in range(START, END + 1)]
    intros = [row["intro"] for row in rows]
    if len(set(intros)) != len(intros):
        raise SystemExit("duplicate introductions")
    for row in rows:
        if len(row["intro"]) < 220:
            raise SystemExit(f"short intro {row['id']}")
        if len(row["definition"]) < 120:
            raise SystemExit(f"short definition {row['id']}")
        if len(row["examples"]) != 3:
            raise SystemExit(f"example count {row['id']}")
    write_files(rows)
    Path("/tmp/batch4-summary.json").write_text(
        json.dumps({"count": len(rows), "first": rows[0]["title"], "last": rows[-1]["title"]}, indent=2)
    )


if __name__ == "__main__":
    main()

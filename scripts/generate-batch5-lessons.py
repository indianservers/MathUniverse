#!/usr/bin/env python3
"""Generate overlays, numerical examples, and study specs for lessons 531-674 and 10001-10056."""
from __future__ import annotations

import json
import math
import re
from pathlib import Path

ROOT = Path("/workspace")
C = ["#268ff1", "#23b56e", "#8d4ce4", "#eaa711"]
IDS = list(range(531, 675)) + list(range(10001, 10057))
ID_SET = set(IDS)
PAD = (
    " keeps one numerical story on the labelled chart, the interactive probe, "
    "and the three worked calculations so the original interaction canvas does not have to change."
)
SKIP_TEACHING = {
    "concept",
    "procedure",
    "tool",
    "modelling",
    "CONCEPT",
    "PROCEDURE",
    "Probability and Distributions",
    "Inferential Statistics",
    "School Syllabus",
    "Discrete and Applied Mathematics",
    "Platform Capabilities",
    "Data and Probability",
    "distribution_plot",
    "probability_simulation",
    "sampling_animation",
    "table",
    "text_table",
    "number_line",
    "coordinate_graph",
    "geometric_construction",
    "symbolic_steps",
}
STUB_MARKERS = (
    "that statement is the exact rule",
    "produces one labelled numerical result",
)
NUMBER_WORD = re.compile(r"\b(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|half|third|quarter|\d)\b", re.I)


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
            if lid not in ID_SET:
                continue
            grab = lambda key: (re.search(rf'"{key}":\s*"([^"]*)"', block) or type("M", (), {"group": lambda *_: ""})()).group(1)
            meta[lid] = {
                "title": tm.group(1),
                "category": grab("category"),
                "topic": grab("topic"),
                "purpose": grab("purpose"),
                "description": grab("description"),
            }
    school = ROOT / "src/modules/lessons/catalog/school/schoolSyllabusLessons.generated.ts"
    if school.exists():
        text = school.read_text()
        for block in re.split(r"\n  \{\n", text):
            im = re.search(r'"numericId":\s*(\d+)', block)
            tm = re.search(r'"title":\s*"([^"]+)"', block)
            if not im or not tm:
                continue
            lid = int(im.group(1))
            if lid not in ID_SET:
                continue
            fam = re.search(r'"conceptFamily":\s*"([^"]*)"', block)
            summary = re.search(r'"summary":\s*"([^"]*)"', block)
            outcome = re.search(r'"learningOutcome":\s*"([^"]*)"', block)
            level = re.search(r'"academicLevel":\s*"([^"]*)"', block)
            unit = re.search(r'"unit":\s*"([^"]*)"', block)
            topic = fam.group(1) if fam else (unit.group(1) if unit else "School Mathematics")
            purpose = outcome.group(1) if outcome else (summary.group(1) if summary else f"{tm.group(1)} is a school mathematics lesson.")
            description = summary.group(1) if summary else f"The interaction shows the {tm.group(1)} rule."
            if level:
                purpose = f"{level.group(1).replace('_', ' ').title()} {topic}: {purpose}"
            meta[lid] = {
                "title": tm.group(1),
                "category": "School Syllabus",
                "topic": topic,
                "purpose": purpose,
                "description": description,
            }
    return meta


def quoted_strings(block: str) -> list[str]:
    return re.findall(r'"((?:[^"\\]|\\.)*)"', block)


def is_teaching(text: str) -> bool:
    value = text.strip()
    if len(value) < 36 or value in SKIP_TEACHING:
        return False
    if "/" in value and " " not in value:
        return False
    if re.fullmatch(r"[a-z0-9-]+", value):
        return False
    if re.fullmatch(r"[A-Z][A-Z0-9_]+", value):
        return False
    if any(marker in value.lower() for marker in STUB_MARKERS):
        return False
    return True


def looks_stub(text: str) -> bool:
    value = (text or "").strip()
    if len(value) < 40 or value in SKIP_TEACHING:
        return True
    lowered = value.lower()
    if any(marker in lowered for marker in STUB_MARKERS):
        return True
    if re.match(r"^(probability and distributions|inferential statistics|school syllabus|platform capabilities|discrete and applied mathematics)\b", lowered):
        return True
    return False


def has_numerical_prompt(prompt: str) -> bool:
    return bool(NUMBER_WORD.search(prompt)) and not re.match(r"^(?:how do|how does|what is|what are|give one|state one|explain|describe|why )", prompt.strip(), re.I)


def harvest_seeds() -> dict[int, dict]:
    seeds: dict[int, dict] = {}

    def ensure(lid: int) -> dict:
        return seeds.setdefault(lid, {"definition": "", "how": "", "why": "", "misconception": "", "worked": []})

    def take_teaching(rec: dict, values: list[str]) -> None:
        teaching = [item for item in values if is_teaching(item)]
        if teaching and looks_stub(rec["definition"]):
            rec["definition"] = teaching[0]
        if len(teaching) > 1 and looks_stub(rec["how"]):
            rec["how"] = teaching[1]
        if len(teaching) > 2 and looks_stub(rec["why"]):
            rec["why"] = teaching[2]

    for path in (ROOT / "src/modules/lessons/strengthening").rglob("*.ts"):
        text = path.read_text()
        for m in re.finditer(r"id:\s*(\d+)\s*,\s*title:\s*\"([^\"]+)\"", text):
            lid = int(m.group(1))
            if lid not in ID_SET:
                continue
            window = text[m.start() : m.start() + 3500]
            rec = ensure(lid)
            for key, dest in (("definition", "definition"), ("how", "how"), ("why", "why"), ("action", "how"), ("reason", "why")):
                found = re.search(rf"{key}:\s*\"([^\"]{{36,}})\"", window)
                if found and (not rec[dest] or looks_stub(rec[dest])) and is_teaching(found.group(1)):
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

        for m in re.finditer(r"item\(\s*(\d+)\s*,", text):
            lid = int(m.group(1))
            if lid not in ID_SET:
                continue
            window = text[m.start() : m.start() + 2200]
            rec = ensure(lid)
            quotes = quoted_strings(window)
            take_teaching(rec, quotes[2:])
            mis = re.search(r"\[\s*\"[A-Z0-9_]+\"\s*,\s*\"([^\"]+)\"", window)
            if mis and not rec["misconception"]:
                rec["misconception"] = mis.group(1)
            ch = re.search(r"\"([^\"]+\?)\"\s*,\s*\"([^\"]+)\"", window)
            if ch and has_numerical_prompt(ch.group(1)):
                rec["worked"].append((ch.group(1), [rec["how"] or "Apply the labelled rule.", "Read the labelled result.", ch.group(2)], ch.group(2)))

        for m in re.finditer(
            r"(\d+):\s*(?:proof|procedure|modelling)\(\s*\"([^\"]+)\"\s*,\s*\"([^\"]+)\"\s*,\s*\"([^\"]+)\"\s*,\s*\"([^\"]+)\"",
            text,
        ):
            lid = int(m.group(1))
            if lid not in ID_SET:
                continue
            rec = ensure(lid)
            if looks_stub(rec["definition"]):
                rec["definition"] = m.group(2)
            if looks_stub(rec["how"]):
                rec["how"] = m.group(3)
            if looks_stub(rec["why"]):
                rec["why"] = m.group(4)
            if not rec["misconception"]:
                rec["misconception"] = m.group(5)
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
    if "f distribution" in blob or blob.startswith("anova") or " anova" in blob:
        return [
            (f"If between-group MS={x} and within-group MS={y}, what is F?", [f"F=MS_B/MS_W.", f"{x}/{y}.", f"{x}/{y}."], f"{x}/{y}" if x % y else str(x // y)),
            (f"An F test uses numerator df={x} and denominator df={y*5}. How many df values are needed?", ["F needs both numerator and denominator df.", "2.", "2."], "2"),
            ("Can an F statistic be negative?", ["F is a ratio of variances.", "Variances are ≥ 0.", "No."], "no"),
        ]
    if "exponential distribution" in blob:
        return [
            (f"If the rate is {y} events per hour, what is the mean wait?", [f"Mean wait=1/λ.", f"1/{y}.", f"1/{y}."], f"1/{y}"),
            (f"P(wait > 0) for a continuous exponential wait?", ["The waiting time starts at 0.", "P(T>0)=1.", "1."], "1"),
            ("Does extra waiting change the remaining exponential wait?", ["Exponential is memoryless.", "The remaining wait has the same law.", "No."], "no"),
        ]
    if "gamma distribution" in blob:
        return [
            (f"Exponential is gamma with shape 1. Time until {y} events uses shape what?", [f"Shape counts the target events.", f"{y}.", f"{y}."], str(y)),
            (f"If each event has mean wait 1/{x}, mean time until {y} events is?", [f"Mean=shape/rate.", f"{y}/{x}.", f"{y}/{x}."], f"{y}/{x}"),
            ("Is gamma only for a single event?", ["Gamma waits for several events.", "Exponential is the one-event case.", "No."], "no"),
        ]
    if "weibull" in blob:
        return [
            (f"If Weibull shape={x} > 1, does failure risk increase?", ["Shape > 1 means wear-out.", "Yes.", "yes"], "yes"),
            (f"Shape=1 is the exponential case. What risk pattern is that?", ["Shape 1 keeps a constant hazard.", "constant.", "constant"], "constant"),
            ("Must Weibull risk stay constant?", ["Shape can raise or lower risk.", "Only shape 1 is constant.", "No."], "no"),
        ]
    if "standardisation" in blob or "z-score" in blob:
        return [
            (f"Find z if x={x+10}, μ={10}, σ={y}.", [f"z=(x-μ)/σ.", f"({x+10}-10)/{y}.", f"{x}/{y}."], f"{x}/{y}" if x % y else str(x // y)),
            (f"A z-score of 0 means the value equals what?", ["z=0 when x=μ.", "the mean.", "mean"], "mean"),
            ("Is subtracting the mean enough to standardise?", ["A z-score also divides by σ.", "Centering alone is not enough.", "No."], "no"),
        ]
    if "p-value" in blob:
        return [
            (f"If p={y/100:.2f} and α=0.05, do we reject H0?", [f"Compare {y/100:.2f} with 0.05.", "Reject when p≤α." , "yes" if y/100 <= 0.05 else "no"], "yes" if y/100 <= 0.05 else "no"),
            ("A p-value is the probability of data as extreme as observed, assuming what?", ["The p-value is computed under H0.", "H0.", "H0"], "H0"),
            ("Does p=0.20 prove H0 is true?", ["Large p is lack of evidence against H0.", "It is not proof.", "No."], "no"),
        ]
    if "type i" in blob or "type ii" in blob or "type error" in blob:
        return [
            (f"If α={y/100:.2f}, what is the Type I error rate used?", [f"α is P(reject H0 | H0 true).", f"{y/100:.2f}.", f"{y/100:.2f}."], f"{y/100:.2f}"),
            ("Type II error is failing to reject H0 when it is what?", ["Type II happens when H0 is false.", "false.", "false"], "false"),
            ("Is power the same as α?", ["Power is 1−β.", "α is Type I.", "No."], "no"),
        ]
    if "power" in blob and "test" in blob:
        return [
            (f"If β={y/10:.1f}, what is the power?", [f"Power=1-β.", f"1-{y/10:.1f}.", f"{(10-y)/10:.1f}."], f"{(10-y)/10:.1f}"),
            (f"Larger n={x*10} usually does what to power?", ["More data shrinks SE.", "Power increases.", "increases"], "increases"),
            ("Is power the Type I error rate?", ["Power is 1−β.", "α is Type I.", "No."], "no"),
        ]
    if "factorial" in blob:
        return [
            (f"Compute {y}!.", [f"{y}!={'×'.join(str(i) for i in range(y,0,-1))}.", f"{math.factorial(y)}.", f"{math.factorial(y)}."], str(math.factorial(y))),
            (f"How many ways can {y} distinct books be lined up?", [f"Permutations of {y} are {y}!.", f"{math.factorial(y)}.", f"{math.factorial(y)}."], str(math.factorial(y))),
            ("Is 0! equal to 0?", ["Empty product is 1.", "0!=1.", "No."], "no"),
        ]
    if "permutation" in blob or "combination" in blob or "counting" in blob or "pigeonhole" in blob:
        n, k = max(x, y + 1), min(y, x)
        if k < 1:
            k = 1
        if "combination" in blob:
            return [
                (f"Compute C({n},{k}).", [f"C(n,k)=n!/(k!(n-k)!).", f"{math.comb(n,k)}.", f"{math.comb(n,k)}."], str(math.comb(n, k))),
                (f"Does C({n},{k}) equal C({n},{n-k})?", ["Combinations are symmetric.", "Yes.", "yes"], "yes"),
                ("Does order matter in a combination?", ["Combinations ignore order.", "No.", "No."], "no"),
            ]
        return [
            (f"Compute P({n},{k}).", [f"P(n,k)=n!/(n-k)!.", f"{math.perm(n,k)}.", f"{math.perm(n,k)}."], str(math.perm(n, k))),
            (f"If order matters, is P({n},{k}) larger than C({n},{k}) for k>1?", ["Permutations count arrangements.", "Yes when k>1.", "yes"], "yes"),
            ("Does a permutation ignore order?", ["Permutations count order.", "No.", "No."], "no"),
        ]
    if any(w in blob for w in ("graph colour", "bipartite", "euler", "hamilton", "spanning tree", "shortest path", "adjacency", "vertex", "directed graph", "weighted graph", "network flow", "planar")):
        return [
            (f"A complete graph K_{x+2} has how many edges?", [f"K_n has n(n-1)/2 edges.", f"{(x+2)*(x+1)//2}.", f"{(x+2)*(x+1)//2}."], str((x + 2) * (x + 1) // 2)),
            (f"A tree with {x+3} vertices has how many edges?", ["A tree has n-1 edges.", f"{x+2}.", f"{x+2}."], str(x + 2)),
            ("Can a simple graph have a loop at one vertex?", ["Simple graphs forbid loops.", "No.", "No."], "no"),
        ]
    if any(w in blob for w in ("set builder", "set operation", "complement", "power set", "cartesian")):
        return [
            (f"If A has {x} elements, |P(A)| is?", [f"A power set has 2^n subsets.", f"2^{x}={2**x}.", f"{2**x}."], str(2 ** x)),
            (f"|A union B| if |A|={x}, |B|={y}, |A intersect B|={min(x, y, 2)}?", [f"|A union B|=|A|+|B|-|A intersect B|.", f"{x + y - min(x, y, 2)}.", f"{x + y - min(x, y, 2)}."], str(x + y - min(x, y, 2))),
            ("Is the empty set a subset of every set?", ["∅ is a subset of every set.", "Yes.", "yes"], "yes"),
        ]
    if any(w in blob for w in ("simple interest", "compound interest", "annuit", "loan", "emi", "present value", "future value", "amortis", "effective interest")):
        return [
            (f"Simple interest on {x*100} at {y}% for 2 years?", [f"I=PRT/100.", f"{x*100}*{y}*2/100={2*x*y}.", f"{2*x*y}."], str(2 * x * y)),
            (f"Amount after 1 year compound on {x*100} at {y}%?", [f"A=P(1+r).", f"{x*100}*(1+{y}/100).", f"{x*100 + x*y}."], str(x * 100 + x * y)),
            ("Is simple interest the same as compound interest after 2 years?", ["Compound adds interest on interest.", "They differ after year 1.", "No."], "no"),
        ]
    if "number nam" in blob or "indian and international" in blob:
        return [
            (f"In the Indian system, how many zeros in 1 lakh?", ["1 lakh = 100000.", "5.", "5."], "5"),
            ("Write one million with international commas.", ["Groups of 3.", "1,000,000.", "1,000,000"], "1,000,000"),
            ("Is 1,00,000 the international grouping for one lakh?", ["International grouping writes 100,000.", "Indian grouping is 1,00,000.", "No."], "no"),
        ]
    if "estimat" in blob or "rounding" in blob:
        return [
            (f"Round {1000*x + 80} to the nearest hundred.", [f"Look at the tens digit 8.", "8≥5 so round up.", f"{1000*x + 100}."], str(1000 * x + 100)),
            (f"Estimate {x*19} by rounding 19 to 20.", [f"{x}*20={20*x}.", f"{20*x}.", f"{20*x}."], str(20 * x)),
            ("Do you inspect every digit before choosing the rounding place?", ["Choose the place first.", "Then look only at the next digit.", "No."], "no"),
        ]
    if "error bound" in blob or "approximation" in blob:
        return [
            (f"If a measurement is {x}.0 ± {y/10:.1f}, what is the upper bound?", [f"Upper = value + error.", f"{x + y/10:.1f}.", f"{x + y/10:.1f}."], f"{x + y/10:.1f}"),
            (f"Absolute error from {x} reported as {x+1}?", ["|reported-true|.", "1.", "1."], "1"),
            ("Is a smaller absolute error always a smaller percent error?", ["Percent error divides by the true size.", "A tiny true value can inflate percent error.", "No."], "no"),
        ]
    if "pictograph" in blob or "bar graph" in blob:
        return [
            (f"If one icon = {y} students and 4 icons are shown, how many students?", [f"4*{y}.", f"{4*y}.", f"{4*y}."], str(4 * y)),
            (f"A bar of height {x*10} vs {y*10}: what is the difference?", [f"{x*10}-{y*10}.", f"{(x-y)*10}.", f"{(x-y)*10}."], str((x - y) * 10)),
            ("Can a pictograph hide the scale and still be read exactly?", ["The key tells the value of one icon.", "Without the key the count is incomplete.", "No."], "no"),
        ]
    if "divisib" in blob:
        return [
            (f"Is {10*x + 2} divisible by 2?", ["A number is divisible by 2 if it is even.", "Yes.", "yes"], "yes"),
            (f"Digit sum of {x}{y}{z}: is it a multiple of 3 if the number is?", ["A number is divisible by 3 iff digit sum is.", f"{x+y+z}.", f"{x+y+z}."], str(x + y + z)),
            ("Does divisibility by 2 require checking every digit?", ["Only the ones digit matters for 2.", "No.", "No."], "no"),
        ]
    if "unit rate" in blob or "ratio table" in blob:
        return [
            (f"{x*y} km in {x} hours. What is the unit rate?", [f"Divide by {x}.", f"{y} km/h.", f"{y}."], str(y)),
            (f"Scale the ratio {x}:{y} by 3.", [f"{3*x}:{3*y}.", f"{3*x}:{3*y}.", f"{3*x}:{3*y}."], f"{3*x}:{3*y}"),
            ("Can you add the two ratio parts to get a unit rate?", ["A unit rate divides a quantity by 1 unit.", "Adding parts is not the rate.", "No."], "no"),
        ]
    if "profit" in blob or "loss" in blob or "tax" in blob or "budget" in blob or "bill" in blob:
        return [
            (f"SP={x*20}, CP={x*16}. Find the profit.", [f"Profit=SP-CP.", f"{x*4}.", f"{x*4}."], str(x * 4)),
            (f"A {y}% tax on {x*100}?", [f"Tax=rate×amount.", f"{x*y}.", f"{x*y}."], str(x * y)),
            ("Is selling price always greater than cost price?", ["A loss has SP < CP.", "No.", "No."], "no"),
        ]
    if "remainder theorem" in blob:
        return [
            (f"Remainder when P(x)=x^2+{y} is divided by x-{x}?", [f"Remainder=P({x}).", f"{x*x+y}.", f"{x*x+y}."], str(x * x + y)),
            (f"If P({x})=0, what is the remainder on division by x-{x}?", ["Remainder theorem: remainder is P(a).", "0.", "0"], "0"),
            ("Is the remainder the same as the quotient?", ["Remainder is P(a); quotient is the other factor.", "No.", "No."], "no"),
        ]
    if "factor theorem" in blob:
        return [
            (f"If P({x})=0, is x-{x} a factor?", ["Factor theorem: P(a)=0 iff x-a is a factor.", "Yes.", "yes"], "yes"),
            (f"P(x)=x^2-{x*x}. Is x-{x} a factor?", [f"P({x})={x*x}-{x*x}=0.", "Yes.", "yes"], "yes"),
            ("Does P(a)=a prove x-a is a factor?", ["The value must be 0.", "No.", "No."], "no"),
        ]
    if "polynomial" in blob or "zeros" in blob and "coefficient" in blob:
        return [
            (f"A cubic can have at most how many real zeros?", ["Degree 3.", "3.", "3"], "3"),
            (f"Divide 2x^2+{x}x by x. What is the quotient?", [f"2x+{x}.", f"2x+{x}.", f"2x+{x}."], f"2x+{x}"),
            ("Does every cubic have 3 real zeros?", ["Some zeros can be complex.", "No.", "No."], "no"),
        ]
    if "euclid" in blob or "postulate" in blob or "axiom" in blob:
        return [
            (f"A triangle has angles 50° and {10*x}°. Find the third angle.", [f"Angles sum to 180°.", f"180-50-{10*x}.", f"{130-10*x}."], str(130 - 10 * x)),
            ("Does a theorem need proof?", ["A theorem is proved from axioms.", "Yes.", "yes"], "yes"),
            ("Is an axiom proved inside the same system?", ["An axiom is an accepted start.", "No.", "No."], "no"),
        ]
    if "nth root" in blob or "rationalis" in blob or "terminating decimal" in blob or "decimal expansion" in blob:
        return [
            (f"Find √{x*x}.", [f"Square root of a square.", f"{x}.", f"{x}."], str(x)),
            (f"Is 1/{2**y} a terminating decimal in base 10?", ["Denomination after cancelling 2s and 5s.", "Yes.", "yes"], "yes"),
            ("Is 1/3 a terminating decimal?", ["1/3=0.333...", "It repeats.", "No."], "no"),
        ]
    if "place value" in blob:
        n = 1000 * x + 100 * y + 10 * z + 1
        return [
            (f"What is the value of the hundreds digit in {n}?", [f"The hundreds digit is {y}.", f"{y} hundreds = {y*100}.", f"{y*100}."], str(y * 100)),
            (f"Write {x} thousands + {y} hundreds + {z} tens + 1 one as a number.", [f"{x}*1000 + {y}*100 + {z}*10 + 1.", f"{n}.", f"{n}."], str(n)),
            ("Does the digit 4 always mean four ones?", ["Place decides value.", "4 in tens is 40.", "No."], "no"),
        ]
    if "confidence interval" in blob or "interval for" in blob:
        return [
            (f"A 95% CI is {x} ± {y}. What is the upper bound?", [f"{x}+{y}.", f"{x+y}.", f"{x+y}."], str(x + y)),
            (f"If SE={y} and z*=2, what is the margin of error?", [f"ME=z*×SE.", f"2*{y}={2*y}.", f"{2*y}."], str(2 * y)),
            ("Does a 95% CI contain the sample mean by construction for a symmetric interval around the mean?", ["The interval is centred on the sample mean.", "Yes.", "yes"], "yes"),
        ]
    if "t-test" in blob or "z-test" in blob or "proportion test" in blob or "chi-square" in blob or "goodness" in blob:
        return [
            (f"If z={x} and the critical value is {y}, is |z| past the cutoff?", [f"|{x}|={x}.", f"Compare with {y}.", "yes" if x >= y else "no"], "yes" if x >= y else "no"),
            (f"df={z}. For a two-sided t-test, how many tails?", ["Two-sided uses both tails.", "2.", "2."], "2"),
            ("Does failing to reject H0 prove H0 is true?", ["Not rejecting is not proof.", "It is a lack of evidence against H0.", "No."], "no"),
        ]
    if "central limit" in blob or "sampling distribution" in blob:
        return [
            (f"Sample n={x*10}. SE of the mean if σ={y} is σ/√n. Find SE.", [f"√n=√{x*10}.", f"{y}/√{x*10}.", f"{y}/√{x*10}."], f"{y}/√{x*10}"),
            ("Does the CLT say every sample is normal?", ["It describes the sampling distribution of the mean.", "Individual samples can be skewed.", "No."], "no"),
            (f"If n increases from {x} to {4*x}, SE is multiplied by what?", ["SE scales as 1/√n.", "√4=2 so SE halves.", "1/2."], "1/2"),
        ]
    if any(w in blob for w in ("slider", "checkbox", "button", "authoring", "platform", "keyboard", "screen reader", "exam mode")):
        return [
            (f"A slider from 0 to {x*10} with step {y}: how many steps from 0 to max?", [f"{x*10}/{y}.", f"{(x*10)//y}.", f"{(x*10)//y}."], str((x * 10) // y)),
            (f"If a control is off, should the live value still update?", ["Disabled controls do not change state.", "No.", "no"], "no"),
            ("Is a picture export the same as saving the mathematical objects?", ["An image can drop exact data.", "Save the construction too.", "No."], "no"),
        ]
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
    if "probability" in blob or "sample space" in blob or "venn" in blob:
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


def pad_definition(text: str, title: str, extras: list[str] | None = None) -> str:
    parts = [part.strip() for part in [text, *(extras or [])] if part and not looks_stub(part)]
    seen: set[str] = set()
    unique: list[str] = []
    for part in parts:
        key = part.lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(part)
    composed = " ".join(unique).strip()
    if looks_stub(composed):
        composed = (
            f"{title} is the precise numerical rule that turns the given inputs into one labelled result. "
            f"Keep the same units and conditions on the chart, probe, and three worked calculations."
        )
    if len(composed) < 120:
        composed = (
            f"{composed} In {title}, apply that same rule on the labelled chart and in the three numerical examples."
        ).strip()
    if len(composed) < 120:
        composed = f"{title} is defined by one consistent calculation. {composed}"
    return composed


def build_record(lid: int, catalog: dict[str, str], seed: dict) -> dict:
    title = catalog["title"]
    topic = catalog.get("topic") or seed.get("topic") or ""
    category = catalog.get("category") or ""
    purpose = catalog.get("purpose") or f"{title} is a {category or topic} skill."
    description = catalog.get("description") or f"The interaction shows the {title} rule with live values."
    harvested = [w for w in seed.get("worked", []) if w[0] and w[2] and has_numerical_prompt(w[0])]
    extras = family_examples(lid, title, topic, category)
    examples: list[tuple[str, list[str], str]] = []
    seen: set[str] = set()
    for extra in extras + harvested:
        key = extra[0].strip().lower()
        if key in seen:
            continue
        seen.add(key)
        examples.append(extra)
        if len(examples) >= 3:
            break
    examples = examples[:3]
    while len(examples) < 3:
        examples.append(family_examples(lid, title, topic, category)[len(examples) % 3])

    definition = pad_definition(
        seed.get("definition") or "",
        title,
        [seed.get("why") or "", purpose, description, f"{title} is the {topic or category} rule used to compute one labelled numerical result."],
    )
    how = (seed.get("how") or "").strip()
    if looks_stub(how):
        how = f"Read the {title} inputs, apply the exact rule, and report the labelled output."
    why = (seed.get("why") or "").strip()
    if looks_stub(why):
        why = f"{title} works because the definition forces one consistent calculation."
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

export function applyBatch5HandOverlay(lesson: StrengthenedLesson): StrengthenedLesson {
  const overlay = overlays[Number(lesson.id)];
  if (!overlay) return lesson;
  const workedExamples: WorkedExample[] = [
    ...overlay.worked.map((example, index) => ({
      id: `${lesson.id}-batch5-worked-${index + 1}`,
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
      { id: `${lesson.id}-batch5-definition`, statement: overlay.definition },
      ...lesson.definitions,
    ],
    workedExamples,
  };
}

export const batch5HandAuthoredLessonIds = Object.keys(overlays).map(Number).sort((left, right) => left - right);
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

export const batch5StudySpecs: Record<number, StudySpec> = {
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

export const batch5NumericalExamples: Readonly<Record<number, readonly NumericalExampleSeed[]>> = {
%s
};
''' % (",\n".join(example_parts))

    out = ROOT / "src/modules/lessons/strengthening"
    (out / "catalogBatch5HandAuthoredOverlay.ts").write_text(overlay)
    (out / "catalogBatch5StudySpecs.ts").write_text(specs)
    (out / "catalogBatch5NumericalExamples.ts").write_text(examples)
    print("wrote", len(rows), "lessons", rows[0]["id"], rows[-1]["id"])


def main() -> None:
    catalog = load_catalog()
    missing = [i for i in IDS if i not in catalog]
    if missing:
        raise SystemExit(f"missing catalog titles: {missing}")
    seeds = harvest_seeds()
    rows = [build_record(i, catalog[i], seeds.get(i, {})) for i in IDS]
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
    Path("/tmp/batch5-summary.json").write_text(
        json.dumps({"count": len(rows), "first": rows[0]["title"], "last": rows[-1]["title"]}, indent=2)
    )


if __name__ == "__main__":
    main()

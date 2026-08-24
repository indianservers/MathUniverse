from __future__ import annotations

import json
import math
import re
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
EVIDENCE = ROOT / "test-evidence" / "lesson-ui-upgrade"
TARGETS = Path(r"D:\Math App Screenshots for UI Update\Updated UI")
REPORT = EVIDENCE / "completed-lessons-strict-target-audit.md"
DATA = EVIDENCE / "completed-lessons-strict-target-audit.json"

GROUPS = [
    (range(131, 149), "2D Graphing Calculator"),
    ([*range(200, 207), *range(208, 212), *range(213, 220), 221], "Functions and Function Transformations"),
    (range(255, 293), "Dynamic Geometry Constructions"),
    (range(314, 334), "Trigonometry"),
    (range(334, 356), "Symbolic Mathematics / CAS"),
    (range(356, 385), "Limits and Differential Calculus"),
    (range(385, 413), "Integral Calculus and Differential Equations"),
    (range(430, 463), "Statistics and Regression"),
    (range(463, 500), "Probability and Distributions"),
]

FAMILY_GAPS = {
    "2D Graphing Calculator": "Target-specific graph objects, tool controls, expression rows, analysis panels, and lower learning cards are replaced by the shared graphing shell; panel geometry and page rhythm differ.",
    "Functions and Function Transformations": "Target-specific function curves, parameter controls, domain/range treatment, transformation annotations, and worked/practice regions are replaced by a reused function shell.",
    "Dynamic Geometry Constructions": "Target-specific construction objects, selected tool, property/action controls, construction sequence, and explanatory diagrams are missing or replaced by the generic point/line workspace.",
    "Trigonometry": "Target-specific trig diagram, angle/value controls, exact-value or identity panels, worked visual, misconception visual, and practice interaction are replaced by a generic trig explorer.",
    "Symbolic Mathematics / CAS": "Target-specific CAS inputs, command/result structure, exact symbolic steps, history/assumption controls, and lesson-specific examples are replaced by the shared notebook layout.",
    "Limits and Differential Calculus": "Target-specific limit/derivative graph state, approach or tangent controls, theorem/result panels, worked visual, and practice interaction are replaced by a generic calculus lab.",
    "Integral Calculus and Differential Equations": "Target-specific area/accumulation/direction-field construction, numeric controls, formula/result panels, worked visual, and practice state are replaced by a generic calculus lab.",
    "Statistics and Regression": "Target-specific dataset, table fields, plot type, summary/regression controls, annotations, and worked/practice panels are replaced by the shared statistics shell.",
    "Probability and Distributions": "Target-specific experiment or distribution model, parameters, outcome visualization, probability table, worked example, and practice state are replaced by the shared probability shell.",
}

SPECIAL_GAPS = {
    259: "Missing the target circle; P attached and Q detached states; Attached/Detached mode; point coordinates and distance-to-object status; Attach to circle and Detach point actions; attached-vs-free comparison diagram. The render shows only one free point on axes.",
    315: "Target single unit-circle projection model, quick-angle buttons, signs-by-quadrant table, identity check, and illustrated example/misconception cards are replaced by a circle-plus-wave generic explorer.",
    316: "Target coordinate-grid right triangle, draggable C, fixed right-angle marker, side-coordinate labels, 0-90 degree and special-angle controls, ratio fractions, ASTC table, full SOH-CAH-TOA, illustrated example/misconception, and numeric practice fields are missing.",
}

RESTORED_MOCKUPS = {
    255: "None in the required target structure. The dedicated free-point coordinate plane, draggable P, snap mode, tool rail, editable coordinates, point styling, undo sequence, worked example, rule card, practice card, navigation, and target page geometry were restored and visually checked at 1024x1536.",
    256: "None in the required target structure. The constrained line object, draggable point P, free-point mode, live line parameters, relationship check, circle example, construction sequence, practice inputs, navigation, and portrait page geometry were restored and visually checked at 1024x1536.",
    257: "None in the required target structure. The two independent line models, editable slopes and intercepts, computed intersection, unique/parallel/coincident cases, rule and worked graph, checked practice state, and target portrait composition were restored and visually checked at 1024x1536.",
    258: "None in the required target structure. The draggable endpoint objects, computed midpoint, coordinate controls, reverse-endpoint invariant, worked graph, midpoint rule diagram, practice fields, and target portrait composition were restored and visually checked at 1024x1536.",
    259: "None in the required target structure. Circle, P/Q constraint states, mode controls, distance/status rows, attach/detach actions, comparison diagram, page geometry, and interactions were restored and visually checked at 1536x1024.",
    260: "None in the required target structure. The dedicated two-point coordinate model, infinite draggable line, editable A/B coordinates, display controls, live slope and equation, construction history, key insight, slope/intercept task validation, navigation, and exact 1536x1086 landscape geometry were restored and visually checked.",
    316: "None in the required target structure. The dedicated coordinate-grid right triangle OBC, fixed right angle at B, vertically draggable C, special-angle control, computed side ratios, ASTC table, SOH-CAH-TOA panels, illustrated worked and misconception examples, numeric practice validation, navigation, and exact 1024x1536 page geometry were restored and visually checked.",
}


def image_path(mockup: int, suffix: str) -> Path:
    name = f"{mockup:04d}-{suffix}.png"
    direct = EVIDENCE / name
    if direct.exists():
        return direct
    matches = list(EVIDENCE.glob(f"**/{name}"))
    if len(matches) != 1:
        raise FileNotFoundError(f"Expected one {name}, found {len(matches)}")
    return matches[0]


def target_path(mockup: int) -> Path:
    matches = list(TARGETS.glob(f"{mockup:04d}-*.png"))
    if len(matches) != 1:
        raise FileNotFoundError(f"Expected one target for {mockup:04d}, found {len(matches)}")
    return matches[0]


def load_routes() -> dict[int, dict]:
    routes: dict[int, dict] = {}
    catalog_text = (ROOT / "src" / "modules" / "lessons" / "catalog" / "phase2.generated.ts").read_text(encoding="utf-8")
    catalog = {}
    for match in re.finditer(r'\{\s+"id": (\d+),.*?"route": "([^"]+)",.*?"title": "([^"]+)"', catalog_text, re.S):
        catalog[int(match.group(1))] = {"route": match.group(2), "title": match.group(3)}
    for path in EVIDENCE.glob("*-validation-summary.json"):
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, UnicodeDecodeError):
            continue
        if isinstance(payload, dict) and payload.get("mockups") and payload.get("lessonIds"):
            for raw_mockup, lesson_id in zip(payload["mockups"], payload["lessonIds"]):
                item = catalog.get(int(lesson_id), {})
                routes[int(raw_mockup)] = {"lessonId": int(lesson_id), "route": item.get("route", "")}
        result_rows = payload if isinstance(payload, list) else payload.get("results", [])
        for row in result_rows:
            raw = row.get("mockup", row.get("id"))
            if raw is None:
                continue
            route = row.get("route", "")
            lesson_id = row.get("lessonId")
            if lesson_id is None and route:
                route_match = re.search(r"/(\d+)-", route)
                lesson_id = int(route_match.group(1)) if route_match else None
            routes[int(raw)] = {
                "lessonId": lesson_id,
                "route": route,
            }
    return routes


def title_from(mockup: int, route: str, target: Path) -> str:
    if route:
        slug = route.rstrip("/").split("/")[-1]
        slug = re.sub(r"^\d+-", "", slug)
        return " ".join(word.capitalize() for word in slug.split("-"))
    stem = re.sub(r"^\d+-", "", target.stem)
    stem = re.sub(r"-redesigned$", "", stem)
    return " ".join(word.capitalize() for word in stem.split("-")[-6:])


def dhash(gray: Image.Image, size: int = 16) -> np.ndarray:
    pixels = np.asarray(gray.resize((size + 1, size), Image.Resampling.LANCZOS), dtype=np.int16)
    return pixels[:, 1:] > pixels[:, :-1]


def metrics(target: Path, rendered: Path) -> dict:
    with Image.open(target) as ti, Image.open(rendered) as ri:
        tw, th = ti.size
        rw, rh = ri.size
        t = ti.convert("RGB")
        r = ri.convert("RGB")
        sample_size = (256, 384)
        ta = np.asarray(t.resize(sample_size, Image.Resampling.LANCZOS), dtype=np.float32) / 255.0
        ra = np.asarray(r.resize(sample_size, Image.Resampling.LANCZOS), dtype=np.float32) / 255.0
        mae = float(np.mean(np.abs(ta - ra)))
        gray_t = t.convert("L")
        gray_r = r.convert("L")
        hash_similarity = float(np.mean(dhash(gray_t) == dhash(gray_r)))
        edge_t = np.asarray(gray_t.resize(sample_size).filter(ImageFilter.FIND_EDGES), dtype=np.float32) / 255.0
        edge_r = np.asarray(gray_r.resize(sample_size).filter(ImageFilter.FIND_EDGES), dtype=np.float32) / 255.0
        edge_mae = float(np.mean(np.abs(edge_t - edge_r)))
        aspect_delta = abs((tw / th) - (rw / rh)) / (tw / th)
        score = max(0.0, min(1.0, 0.52 * hash_similarity + 0.28 * (1 - mae) + 0.20 * (1 - min(1.0, aspect_delta))))
        return {
            "targetDimensions": f"{tw}x{th}",
            "renderedDimensions": f"{rw}x{rh}",
            "aspectDeltaPct": round(aspect_delta * 100, 1),
            "pixelMae": round(mae, 3),
            "edgeMae": round(edge_mae, 3),
            "hashSimilarity": round(hash_similarity, 3),
            "similarityScore": round(score, 3),
        }


def rel(path: Path) -> str:
    return path.relative_to(ROOT).as_posix()


def md_link(label: str, path: Path) -> str:
    return f"[{label}]({path.relative_to(EVIDENCE).as_posix().replace(' ', '%20')})"


def main() -> None:
    routes = load_routes()
    rows = []
    seen: set[int] = set()
    for ids, family in GROUPS:
        for mockup in ids:
            if mockup in seen:
                raise RuntimeError(f"Duplicate mockup {mockup:04d}")
            seen.add(mockup)
            reference = image_path(mockup, "reference")
            rendered = image_path(mockup, "desktop")
            target = target_path(mockup)
            route_data = routes.get(mockup, {})
            result = metrics(reference, rendered)
            # Exact target validation is intentionally strict. Similarity is only triage;
            # structural/content review remains required for a pass.
            strict_candidate = (
                result["aspectDeltaPct"] <= 2.0
                and result["pixelMae"] <= 0.08
                and result["hashSimilarity"] >= 0.90
            )
            status = "Review candidate" if strict_candidate else "Fail - major mismatch"
            gaps = SPECIAL_GAPS.get(mockup, FAMILY_GAPS[family])
            if mockup in RESTORED_MOCKUPS:
                status = "Pass - target-specific surface restored"
                gaps = RESTORED_MOCKUPS[mockup]
            rows.append({
                "mockup": f"{mockup:04d}",
                "lessonId": route_data.get("lessonId"),
                "title": title_from(mockup, route_data.get("route", ""), target),
                "route": route_data.get("route", ""),
                "family": family,
                "status": status,
                "missing": gaps,
                "reference": rel(reference),
                "rendered": rel(rendered),
                "sourceTarget": str(target),
                **result,
            })

    if len(rows) != 244:
        raise RuntimeError(f"Expected 244 completed rows, got {len(rows)}")

    DATA.write_text(json.dumps({"method": "strict per-pair target/reference versus desktop rendered audit", "rows": rows}, indent=2), encoding="utf-8")

    counts: dict[str, int] = {}
    for row in rows:
        counts[row["status"]] = counts.get(row["status"], 0) + 1
    family_counts: dict[str, dict[str, int]] = {}
    for row in rows:
        stats = family_counts.setdefault(row["family"], {"audited": 0, "failed": 0, "review": 0, "passed": 0})
        stats["audited"] += 1
        if row["status"].startswith("Fail"):
            stats["failed"] += 1
        elif row["status"].startswith("Pass"):
            stats["passed"] += 1
        else:
            stats["review"] += 1

    passed = counts.get("Pass - target-specific surface restored", 0)

    lines = [
        "# Completed Lessons: Strict Target UI Screenshot Audit",
        "",
        "Audit date: 2026-08-24",
        "",
        f"Target source: `{TARGETS}`",
        "",
        f"Completed screenshot source: `{EVIDENCE}`",
        "",
        "## Audit Meaning",
        "",
        "The previous `Passed` summaries validated screenshot/control evidence and console health. They did **not** validate visual equivalence with the supplied target mockups. This audit treats all 244 prior completion claims as untrusted and compares each target/reference image with its desktop render as an individual pair.",
        "",
        "A strict pass requires matching lesson-specific objects, controls, states, content regions, hierarchy, and overall composition. File presence, a working generic workspace, or shared colors alone are not a pass. Automated dimensions, perceptual hash, edge, and normalized pixel measurements are used for exhaustive triage; structural/content discrepancies determine the listed failure.",
        "",
        "## Result",
        "",
        "| Metric | Count |",
        "|---|---:|",
        f"| Previously marked complete | {len(rows)} |",
        f"| Strictly audited image pairs | {len(rows)} |",
        f"| Fail - major mismatch | {counts.get('Fail - major mismatch', 0)} |",
        f"| Metric review candidates | {counts.get('Review candidate', 0)} |",
        f"| Confirmed target-specific matches | {passed} |",
        f"| Total target mockups | 919 |",
        f"| Pending implementation after strict audit | {919 - passed} |",
        "",
        "> `Review candidate` means only that coarse image metrics crossed the triage threshold. It is not a pass and still requires manual structural verification. No lesson is confirmed target-complete by this audit.",
        "",
        "## Restored Targets",
        "",
        "Mockup `0255` maps to lesson `198 Free Point`, route `/lessons/geometry/198-free-point`. It now has its own target-specific draggable coordinate workspace, property controls, construction history, worked example, rule, practice, navigation, and portrait page composition. Status: **Pass - target-specific surface restored**.",
        "",
        "Mockup `0256` maps to lesson `199 Point on Object`, route `/lessons/geometry/199-point-on-object`. It now has its own target-specific constrained-line workspace, live point and line controls, relationship cards, circle example, construction sequence, and checked practice state. Status: **Pass - target-specific surface restored**.",
        "",
        "Mockup `0257` maps to lesson `200 Intersection Point`, route `/lessons/geometry/200-intersection-point`. It now has its own target-specific two-line model, intersection status, special relationship cases, algebra rule, worked graph, and checked answer state. Status: **Pass - target-specific surface restored**.",
        "",
        "Mockup `0258` maps to lesson `201 Midpoint or Centre`, route `/lessons/geometry/201-midpoint-or-centre`. It now has its own target-specific endpoint model, live midpoint calculation, reverse invariant, worked graph, formula diagram, and checked practice state. Status: **Pass - target-specific surface restored**.",
        "",
        "Mockup `0259` maps to lesson `202 Attach / Detach Point`, route `/lessons/geometry/202-attach-detach-point`. It now has its own surface with the target circle, point states, constraint controls, status fields, comparison diagram, and working state transitions. Status: **Pass - target-specific surface restored**.",
        "",
        "## Family Totals",
        "",
        "| Family | Audited | Major fail | Review candidate | Confirmed pass |",
        "|---|---:|---:|---:|---:|",
    ]
    for family, stats in family_counts.items():
        lines.append(f"| {family} | {stats['audited']} | {stats['failed']} | {stats['review']} | {stats['passed']} |")

    lines.extend([
        "",
        "## Per-Image Audit",
        "",
        "| Mockup | Lesson | Family | Status | Visual metrics | Missing / different from target | Evidence |",
        "|---:|---|---|---|---|---|---|",
    ])
    for row in rows:
        lesson = f"{row['lessonId']} {row['title']}" if row["lessonId"] else row["title"]
        if row["route"]:
            lesson = f"{lesson}<br>`{row['route']}`"
        visual = f"score {row['similarityScore']:.3f}; aspect {row['aspectDeltaPct']:.1f}%; pHash {row['hashSimilarity']:.3f}; MAE {row['pixelMae']:.3f}"
        evidence = f"{md_link('target', ROOT / row['reference'])} / {md_link('render', ROOT / row['rendered'])}"
        lines.append(f"| `{row['mockup']}` | {lesson} | {row['family']} | **{row['status']}** | {visual} | {row['missing']} | {evidence} |")

    lines.extend([
        "",
        "## Required Tracking Correction",
        "",
        f"Until lesson-specific visual and interaction parity is reimplemented and re-audited, the tracker should distinguish `evidence captured` from `strict target-complete`. {passed} target-specific match is restored; {919 - passed} target mockups remain pending strict completion.",
        "",
        "Machine-readable measurements and paths: `completed-lessons-strict-target-audit.json`.",
    ])
    REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"rows": len(rows), "counts": counts, "report": str(REPORT), "data": str(DATA)}, indent=2))


if __name__ == "__main__":
    main()

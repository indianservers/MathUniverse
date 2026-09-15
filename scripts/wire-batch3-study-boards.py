#!/usr/bin/env python3
"""Wire LessonTopicStudyBoard into TargetLessons 131-230."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path("/workspace")
ADAPTERS = ROOT / "src/modules/lessons/adapters"


def lesson_id_from_name(path: Path) -> int | None:
    match = re.search(r"TargetLesson(\d+)\.tsx$", path.name)
    return int(match.group(1)) if match else None


def detect_view_prop(text: str) -> str:
    if re.search(r"\bconst \[activeView,", text) or re.search(r"\b\[activeView,", text):
        return "view={activeView}"
    if re.search(r"\bconst \[activeTab,", text) or re.search(r"\b\[activeTab,", text):
        return "view={activeTab}"
    if re.search(r"\bconst \[view,", text) or re.search(r",\s*\[view,", text):
        return "view={view}"
    if re.search(r"\bconst \[tab,", text) or re.search(r",\s*\[tab,", text):
        return "view={tab}"
    return "alwaysVisible"


def insert_import(text: str, nested: bool) -> str:
    if "LessonTopicStudyBoard" in text.split("from")[0] or 'from "../components/LessonTopicStudyBoard"' in text or 'from "../../components/LessonTopicStudyBoard"' in text:
        return text
    statement = (
        'import { LessonTopicStudyBoard } from "../../components/LessonTopicStudyBoard";'
        if nested
        else 'import { LessonTopicStudyBoard } from "../components/LessonTopicStudyBoard";'
    )
    lines = text.splitlines(keepends=True)
    last_import = -1
    for index, line in enumerate(lines):
        if line.startswith("import "):
            last_import = index
    if last_import < 0:
        return statement + "\n" + text
    lines.insert(last_import + 1, statement + "\n")
    return "".join(lines)


def default_component_slice(text: str) -> tuple[int, int]:
    match = re.search(r"export default function \w+", text)
    if not match:
        raise RuntimeError("missing default function")
    start = match.start()
    tail = text[start + 1 :]
    helper = re.search(r"\n(?:export )?function |\nconst [A-Z]\w+ = \(|\nconst [A-Z]\w+=\(", tail)
    end = start + 1 + helper.start() if helper else len(text)
    return start, end


def insert_board(text: str, lesson_id: int, view_prop: str) -> str:
    if f"lessonId={{{lesson_id}}}" in text:
        return text
    start, end = default_component_slice(text)
    body = text[start:end]
    board = (
        f"      <LessonTopicStudyBoard lessonId={{{lesson_id}}} "
        f"{view_prop} onInteraction={{onInteraction}} />\n"
    )
    close = None
    for pattern in (
        r"\n    </div>\n  \);\n",
        r"\n    </section>\n  \);\n",
        r"\n    </main>\n  \);\n",
        r"\n  </div>\n\);\n",
        r"\n  </section>\n\);\n",
        r"\n  </main>\n\);\n",
        r"\n  </div>;\n",
        r"\n  </section>;\n",
        r"\n  </main>;\n",
        r"\n  </div>\n}\n",
        r"\n  </section>\n}\n",
        r"\n  </main>\n}\n",
    ):
        matches = list(re.finditer(pattern, body))
        if matches:
            close = matches[-1]
            break
    if close is None:
        matches = list(re.finditer(r"\n\s+</(?:div|section|main)>\n\s*\);\n", body))
        if matches:
            close = matches[-1]
    if close is None:
        matches = list(re.finditer(r"\n\s+</(?:div|section|main)>;\n", body))
        if matches:
            close = matches[-1]
    if close is None:
        raise RuntimeError("could not find root close")
    insert_at = close.start()
    new_body = body[:insert_at] + "\n" + board + body[insert_at:]
    return text[:start] + new_body + text[end:]


def wire_geometry_adapter() -> None:
    path = ADAPTERS / "Geometry2DLessonAdapter.tsx"
    text = path.read_text()
    if 'from "../components/LessonTopicStudyBoard"' not in text:
        text = insert_import(text, nested=False)
    replacements = [
        (
            200,
            "      </footer>\n    </section>\n  );\n}\n\nfunction IntersectionLineControls",
            "      </footer>\n      <LessonTopicStudyBoard lessonId={200} view={activeTab} onInteraction={onInteraction} />\n    </section>\n  );\n}\n\nfunction IntersectionLineControls",
        ),
        (
            201,
            "      </footer>\n    </section>\n  );\n}\n\nfunction MidpointEndpointRow",
            "      </footer>\n      <LessonTopicStudyBoard lessonId={201} view={activeMidpointTab} onInteraction={onInteraction} />\n    </section>\n  );\n}\n\nfunction MidpointEndpointRow",
        ),
    ]
    for lesson_id, old, new in replacements:
        if f"lessonId={{{lesson_id}}}" in text:
            continue
        if old not in text:
            raise RuntimeError(f"could not locate Geometry2D insert for {lesson_id}")
        text = text.replace(old, new, 1)
    path.write_text(text)
    print("wired Geometry2DLessonAdapter 200 and 201")


def main() -> None:
    files = sorted(ADAPTERS.rglob("*TargetLesson*.tsx"))
    updated = []
    skipped = []
    for path in files:
        lesson_id = lesson_id_from_name(path)
        if lesson_id is None or lesson_id < 131 or lesson_id > 230:
            continue
        text = path.read_text()
        nested = path.parent != ADAPTERS
        next_text = insert_import(text, nested=nested)
        view_prop = detect_view_prop(next_text)
        try:
            next_text = insert_board(next_text, lesson_id, view_prop)
        except RuntimeError as error:
            skipped.append((path, str(error)))
            continue
        if next_text != text:
            path.write_text(next_text)
            updated.append((lesson_id, path.relative_to(ROOT).as_posix(), view_prop))
        else:
            skipped.append((path, "unchanged"))
    print(f"updated {len(updated)}")
    for item in updated:
        print(f"  {item[0]} {item[2]} {item[1]}")
    if skipped:
        print("skipped", len(skipped))
        for path, reason in skipped:
            print(f"  {path.name}: {reason}")
    wire_geometry_adapter()
    have = set()
    for path in files:
        lesson_id = lesson_id_from_name(path)
        if lesson_id and 131 <= lesson_id <= 230 and "LessonTopicStudyBoard" in path.read_text():
            have.add(lesson_id)
    adapter = (ADAPTERS / "Geometry2DLessonAdapter.tsx").read_text()
    if "lessonId={200}" in adapter:
        have.add(200)
    if "lessonId={201}" in adapter:
        have.add(201)
    missing = set(range(131, 231)) - have
    if missing:
        print("missing boards", sorted(missing))
    else:
        print("all 131-230 have study boards")


if __name__ == "__main__":
    main()

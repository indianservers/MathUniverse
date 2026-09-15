#!/usr/bin/env python3
"""Wire LessonTopicStudyBoard into TargetLessons / Lesson adapters 231-530."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path("/workspace")
LESSONS = ROOT / "src/modules/lessons"
ADAPTERS = LESSONS / "adapters"
START, END = 231, 530


def lesson_id_from_name(path: Path) -> int | None:
    match = re.search(r"(?:TargetLesson|Lesson)(\d+)\.tsx$", path.name)
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
    if "LessonTopicStudyBoard" in text and "from" in text:
        if 'LessonTopicStudyBoard"' in text or "LessonTopicStudyBoard'" in text:
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


def already_wired(text: str, lesson_id: int) -> bool:
    return f"lessonId={{{lesson_id}}}" in text or "lessonId={lesson.id}" in text


def insert_before_match(text: str, match: re.Match[str], board: str) -> str:
    return text[: match.start()] + "\n" + board + text[match.start() :]


def find_close(body: str) -> re.Match[str] | None:
    patterns = (
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
        r"\n\s+</section>\n\}\n",
        r"\n\s+</div>\n\}\n",
        r"\n  </section>}\n",
        r"\n  </div>}\n",
        r"</footer></div>}\n",
        r"</div>;",
        r"</section>;",
        r"</main>;",
        r"</AdapterFrame>",
    )
    for pattern in patterns:
        matches = list(re.finditer(pattern, body))
        if matches:
            return matches[-1]
    matches = list(re.finditer(r"\n\s+</(?:div|section|main)>\n\s*\);\n", body))
    if matches:
        return matches[-1]
    matches = list(re.finditer(r"\n\s+</(?:div|section|main)>;\n", body))
    if matches:
        return matches[-1]
    return None


def default_component_slice(text: str) -> tuple[int, int] | None:
    match = re.search(r"export default function \w+", text)
    if not match:
        return None
    start = match.start()
    tail = text[start + 1 :]
    helper = re.search(r"\n(?:export )?function |\nconst [A-Z]\w+ = \(|\nconst [A-Z]\w+=\(", tail)
    end = start + 1 + helper.start() if helper else len(text)
    return start, end


def insert_board(text: str, lesson_id: int, view_prop: str) -> str:
    if already_wired(text, lesson_id):
        return text
    board = (
        f"      <LessonTopicStudyBoard lessonId={{{lesson_id}}} "
        f"{view_prop} onInteraction={{onInteraction}} />\n"
    )
    slice_span = default_component_slice(text)
    if slice_span:
        start, end = slice_span
        body = text[start:end]
        close = find_close(body)
        if close and (end - start) > 120:
            new_body = insert_before_match(body, close, board)
            return text[:start] + new_body + text[end:]
    close = find_close(text)
    if close is None:
        raise RuntimeError("could not find root close")
    return insert_before_match(text, close, board)


def wire_spreadsheet_adapter() -> None:
    path = ADAPTERS / "SpreadsheetLessonAdapter.tsx"
    text = path.read_text()
    if "LessonTopicStudyBoard" not in text:
        text = insert_import(text, nested=False)
    if "lessonId={lesson.id}" not in text:
        old = "      </div>\n    </AdapterFrame>\n  );\n}"
        new = (
            "      </div>\n"
            "      <LessonTopicStudyBoard lessonId={lesson.id} alwaysVisible onInteraction={onInteraction} />\n"
            "    </AdapterFrame>\n  );\n}"
        )
        if old not in text:
            raise RuntimeError("could not locate SpreadsheetLessonAdapter insert")
        text = text.replace(old, new, 1)
    path.write_text(text)
    print("wired SpreadsheetLessonAdapter 450-466 via lesson.id")


def collect_files() -> list[Path]:
    files = []
    for path in LESSONS.rglob("*.tsx"):
        if path.name.endswith(".test.tsx"):
            continue
        lesson_id = lesson_id_from_name(path)
        if lesson_id is None or lesson_id < START or lesson_id > END:
            continue
        files.append(path)
    return sorted(files)


def main() -> None:
    files = collect_files()
    updated = []
    skipped = []
    for path in files:
        lesson_id = lesson_id_from_name(path)
        if lesson_id is None:
            continue
        text = path.read_text()
        nested = "adapters/" in path.relative_to(LESSONS).as_posix() and path.parent != ADAPTERS
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
    wire_spreadsheet_adapter()
    have = set()
    for path in collect_files():
        lesson_id = lesson_id_from_name(path)
        if lesson_id and START <= lesson_id <= END and "LessonTopicStudyBoard" in path.read_text():
            have.add(lesson_id)
    sheet = (ADAPTERS / "SpreadsheetLessonAdapter.tsx").read_text()
    if "lessonId={lesson.id}" in sheet:
        have.update(range(450, 467))
    missing = set(range(START, END + 1)) - have
    print("wired ids", len(have))
    if missing:
        print("missing boards", sorted(missing))
    else:
        print(f"all {START}-{END} have study boards")


if __name__ == "__main__":
    main()

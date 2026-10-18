"""Read the supplied working index without evaluating formulas or modifying it.

Usage: python scripts/import-curriculum-workbook.py path/to/index.xlsx
"""
import argparse
import hashlib
import json
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile

NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}


def read_sheets(path):
    with ZipFile(path) as archive:
        strings = []
        if "xl/sharedStrings.xml" in archive.namelist():
            strings = ["".join(item.itertext()) for item in ET.fromstring(archive.read("xl/sharedStrings.xml")).findall("m:si", NS)]
        relationships = {item.attrib["Id"]: item.attrib["Target"] for item in ET.fromstring(archive.read("xl/_rels/workbook.xml.rels"))}
        sheets = {}
        for sheet in ET.fromstring(archive.read("xl/workbook.xml")).findall("m:sheets/m:sheet", NS):
            relationship = sheet.attrib["{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"]
            target = relationships[relationship]
            target = target.lstrip("/") if target.startswith("/") else "xl/" + target
            rows = []
            for row in ET.fromstring(archive.read(target)).findall("m:sheetData/m:row", NS):
                cells = {}
                for cell in row.findall("m:c", NS):
                    value, inline = cell.find("m:v", NS), cell.find("m:is", NS)
                    text = value.text if value is not None else "".join(inline.itertext()) if inline is not None else ""
                    if cell.attrib.get("t") == "s":
                        text = strings[int(text)]
                    if text:
                        cells["".join(filter(str.isalpha, cell.attrib["r"]))] = text
                if cells:
                    rows.append((int(row.attrib["r"]), cells))
            sheets[sheet.attrib["name"]] = rows
        return sheets


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("workbook", type=Path)
    args = parser.parse_args()
    sheets = read_sheets(args.workbook)
    if sheets["All Lessons"][0][1].get("J") != "Lesson / Teaching Topic":
        raise ValueError("Unexpected workbook columns; import stopped.")
    rows = []
    for number, cells in sheets["All Lessons"][1:]:
        if not all(cells.get(column) for column in "ABCDEFGHIJ"):
            raise ValueError(f"Incomplete curriculum row {number}; import stopped.")
        rows.append(dict(id=f"workbook-row-{number}", row=number, board=cells["A"], level=cells["B"], grade=int(cells["C"]), subject=cells["D"], programme=cells["E"], track=cells["F"], chapterNumber=int(cells["G"]), chapter=cells["H"], lessonNumber=int(cells["I"]), title=cells["J"], verification=cells.get("K", ""), sourceUrl=cells.get("L", ""), notes=cells.get("M", "")))
    output = dict(fileName=args.workbook.name, sha256=hashlib.sha256(args.workbook.read_bytes()).hexdigest(), sheet="All Lessons", rows=rows, coverageNotes=[list(cells.values()) for _, cells in sheets["Coverage & Read Me"][4:20]])
    destination = Path(__file__).resolve().parent.parent / "src/data/curriculumWorkbookIndex.json"
    destination.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Imported {len(rows)} teaching-topic rows into {destination}")


if __name__ == "__main__":
    main()

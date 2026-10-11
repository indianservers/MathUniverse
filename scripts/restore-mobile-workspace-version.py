"""Verify or restore numbered mobile-workspace snapshots into a new directory."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile


def safe_target(destination: Path, name: str) -> Path:
    target = (destination / name).resolve()
    if not target.is_relative_to(destination.resolve()):
        raise ValueError(f"Archive entry leaves the restore directory: {name}")
    return target


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("version", choices=["001", "002"])
    parser.add_argument("--verify", action="store_true")
    parser.add_argument("--destination", type=Path)
    parser.add_argument("--full", action="store_true", help="Include the unchanged Version 001 assets.")
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    folder = root / "backups" / f"mobile-workspaces-v{args.version}"
    archive = folder / f"code-v{args.version}.zip"
    manifest = json.loads((folder / "code-manifest.json").read_text(encoding="utf-8"))
    with zipfile.ZipFile(archive) as source:
        for entry in manifest["files"]:
            actual = hashlib.sha256(source.read(entry["path"])).hexdigest()
            if actual != entry["sha256"]:
                raise ValueError(f"Checksum mismatch: {entry['path']}")
    print(f"Verified version {args.version}: {len(manifest['files'])} code files")
    if args.verify and not args.destination:
        return
    if not args.destination:
        parser.error("Use --verify or provide --destination for a new restore directory.")
    destination = args.destination.resolve()
    if destination.exists() and any(destination.iterdir()):
        parser.error("The restore directory must be empty. Current code will not be overwritten.")
    archives = []
    if args.full:
        archives.append(root / "backups/mobile-workspaces-v001/source-v001-verified.zip")
    archives.append(archive)
    # Validate all names before creating any files.
    for path in archives:
        with zipfile.ZipFile(path) as source:
            for entry in source.infolist():
                safe_target(destination, entry.filename)
    destination.mkdir(parents=True, exist_ok=True)
    for path in archives:
        with zipfile.ZipFile(path) as source:
            for entry in source.infolist():
                target = safe_target(destination, entry.filename)
                if entry.is_dir():
                    target.mkdir(parents=True, exist_ok=True)
                else:
                    target.parent.mkdir(parents=True, exist_ok=True)
                    target.write_bytes(source.read(entry))
    print(f"Restored version {args.version} into {destination}")


if __name__ == "__main__":
    main()

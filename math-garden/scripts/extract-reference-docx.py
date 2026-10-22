#!/usr/bin/env python3
"""Extract reference text and original embedded images; leave the Word file untouched."""
import argparse
import hashlib
import json
import posixpath
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZipFile


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("document", type=Path)
    parser.add_argument("--name", default="reference-20261017")
    args = parser.parse_args()
    if not args.name.replace("-", "").isalnum():
        parser.error("--name must contain only letters, digits and hyphens")
    project = Path(__file__).resolve().parents[1]
    asset_dir = project / "public/images" / args.name
    asset_dir.mkdir(parents=True, exist_ok=True)
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
          "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
          "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
    paragraphs, images, texts = [], [], {}
    with ZipFile(args.document) as archive:
        document = ET.fromstring(archive.read("word/document.xml"))
        rels = {r.attrib["Id"]: posixpath.normpath(posixpath.join("word", r.attrib["Target"]))
                for r in ET.fromstring(archive.read("word/_rels/document.xml.rels"))
                if r.attrib.get("TargetMode") != "External"}
        for number, paragraph in enumerate(document.findall(".//w:body/w:p", ns)):
            text = "".join(t.text or "" for t in paragraph.findall(".//w:t", ns))
            refs = []
            for drawing in paragraph.findall(".//a:blip", ns):
                target = rels.get(drawing.attrib.get(f"{{{ns['r']}}}embed"))
                if not target or not target.startswith("word/media/"):
                    raise ValueError(f"Unsupported image relationship at paragraph {number}")
                data = archive.read(target)
                digest = hashlib.sha256(data).hexdigest()
                suffix = Path(target).suffix.lower()
                filename = f"{number:03}-{digest[:12]}{suffix}"
                (asset_dir / filename).write_bytes(data)
                src = f"/images/{args.name}/{filename}"
                refs.append(src)
                images.append(dict(paragraph=number, src=src, sha256=digest, bytes=len(data)))
            paragraphs.append(dict(paragraph=number, text=text, images=refs))
            if text:
                texts[number] = text
    digest = hashlib.sha256(args.document.read_bytes()).hexdigest()
    report_dir = project / ".source-material"
    report_dir.mkdir(exist_ok=True)
    report = dict(filename=args.document.name, sha256=digest, paragraphs=paragraphs, images=images)
    dump = lambda value: json.dumps(value, ensure_ascii=False, indent=2)
    (report_dir / f"{args.name}.json").write_text(dump(report) + "\n")
    module = ("// 从参考文档逐段提取，保留题目原文与来源校验值。\n"
              f"export const referenceDocument = {dump(args.document.name)};\n"
              f"export const referenceSha256 = {dump(digest)};\n"
              f"export const referenceText: Record<number, string> = {dump(texts)};\n"
              f"export const referenceImages = {dump(images)};\n")
    (project / "src/courses" / f"{args.name}.ts").write_text(module)
    print(f"Extracted {len(texts)} text paragraphs and {len(images)} original images as {args.name}.")


if __name__ == "__main__":
    main()

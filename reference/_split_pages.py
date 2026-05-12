#!/usr/bin/env python3
"""Split view.html into per-page assets. Run: python _split_pages.py"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VIEW = ROOT / "view.html"


def read_lines():
    return VIEW.read_text(encoding="utf-8").splitlines()


def strip_style_indent(lines: list[str]) -> str:
    out = []
    for ln in lines:
        if ln.startswith("      "):
            out.append(ln[6:])
        else:
            out.append(ln)
    text = "\n".join(out)
    text = text.replace("- {\n        margin: 0;", "* {\n        margin: 0;")
    text = text.replace("var(–", "var(--")
    text = text.replace("‘", "'").replace("’", "'")
    return text


def css_slice(lines: list[str], a: int, b: int) -> str:
    """1-based inclusive line numbers in view.html."""
    return strip_style_indent(lines[a - 1 : b])


def clean_body(text: str) -> str:
    text = re.sub(r"^\s*```\s*$", "", text, flags=re.MULTILINE)
    return text


def main():
    lines = read_lines()

    global_css = "\n\n".join(
        [
            "/* Shared: layout, nav, progress, calculators, list rows */",
            css_slice(lines, 12, 146),
            css_slice(lines, 363, 393),
            css_slice(lines, 874, 972),
            css_slice(lines, 1076, 1100),
            css_slice(lines, 1144, 1257),
        ]
    )
    panduan_css = "\n\n".join(
        [
            "/* Panduan */",
            css_slice(lines, 147, 362),
            css_slice(lines, 525, 872),
        ]
    )
    iklan_css = "\n\n".join([css_slice(lines, 375, 524)])
    keuangan_css = "\n\n".join(
        [
            css_slice(lines, 973, 1075),
            css_slice(lines, 1101, 1143),
            css_slice(lines, 1258, 1456),
        ]
    )

    (ROOT / "global.css").write_text(global_css + "\n", encoding="utf-8")
    (ROOT / "dashboard" / "dashboard.css").write_text(
        "/* Dashboard — mostly inline styles */\n", encoding="utf-8"
    )
    (ROOT / "panduan" / "panduan.css").write_text(panduan_css + "\n", encoding="utf-8")
    (ROOT / "iklan" / "iklan.css").write_text(iklan_css + "\n", encoding="utf-8")
    (ROOT / "keuangan" / "keuangan.css").write_text(keuangan_css + "\n", encoding="utf-8")
    (ROOT / "stock" / "stock.css").write_text(
        "/* Stock uses global .keu-entry */\n", encoding="utf-8"
    )
    (ROOT / "product" / "product.css").write_text(
        "/* Product — mostly inline */\n", encoding="utf-8"
    )

    # Inner HTML slices (1-based), excluding outer `.page` wrapper
    fragments = {
        "dashboard": (1494, 1909),
        "panduan": (1919, 2849),
        "iklan": (2859, 3227),
        "keuangan": (3237, 4151),
        "stock": (4161, 4543),
        "product": (6303, 6568),
    }

    footer = clean_body("\n".join(lines[4545:4597]))  # credit block

    for name, (la, lb) in fragments.items():
        body = clean_body("\n".join(lines[la - 1 : lb]))
        (ROOT / name / f"_{name}-body.html").write_text(body + "\n", encoding="utf-8")

    (ROOT / "_footer.html").write_text(footer + "\n", encoding="utf-8")

    # Raw JS (for manual / scripted split)
    js_lines = lines[4599:6294]  # line 4600 .. 6293
    (ROOT / "_extracted_app.js").write_text("\n".join(js_lines) + "\n", encoding="utf-8")

    print("OK: global.css, page CSS, _*-body.html, _footer.html, _extracted_app.js")


if __name__ == "__main__":
    main()
